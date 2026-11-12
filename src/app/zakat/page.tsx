"use client";

import React, { useMemo, useState } from "react";
import { Calculator, Lock, Calendar, Plus, CheckCircle2, Info } from "lucide-react";
import { useApp } from "@/lib/store";
import { HIJRI_MONTHS } from "@/lib/hijri";
import { encryptZakatPayload } from "@/lib/crypto-integrity";

type CurrencyCode = "USD" | "INR" | "PKR" | "QAR" | "SAR" | "AED" | "GBP";

const DEFAULT_RATES: Record<CurrencyCode, { symbol: string; goldPerGram: number; silverPerGram: number }> = {
  USD: { symbol: "$", goldPerGram: 85, silverPerGram: 1.05 },
  INR: { symbol: "₹", goldPerGram: 7200, silverPerGram: 90 },
  PKR: { symbol: "₨", goldPerGram: 23500, silverPerGram: 290 },
  QAR: { symbol: "QAR ", goldPerGram: 310, silverPerGram: 3.85 },
  SAR: { symbol: "SAR ", goldPerGram: 320, silverPerGram: 3.95 },
  AED: { symbol: "AED ", goldPerGram: 312, silverPerGram: 3.88 },
  GBP: { symbol: "£", goldPerGram: 67, silverPerGram: 0.83 },
};

const KARAT_FACTOR: Record<string, number> = {
  "24K": 1,
  "22K": 22 / 24,
  "21K": 21 / 24,
  "18K": 18 / 24,
};

export default function ZakatPage() {
  const { hawlHijriMonth, hawlHijriDay, setHawlDate } = useApp();

  const [currency, setCurrency] = useState<CurrencyCode>("USD");
  const [unit, setUnit] = useState<"grams" | "tola">("grams");
  const [goldRate, setGoldRate] = useState(DEFAULT_RATES.USD.goldPerGram);
  const [silverRate, setSilverRate] = useState(DEFAULT_RATES.USD.silverPerGram);

  const [goldQty, setGoldQty] = useState(20);
  const [goldKarat, setGoldKarat] = useState<"24K" | "22K" | "21K" | "18K">("22K");
  const [silverQty, setSilverQty] = useState(100);
  const [cashAndBank, setCashAndBank] = useState(2500);
  const [tradeStock, setTradeStock] = useState(1000);
  const [receivables, setReceivables] = useState(0);
  const [debtsDue, setDebtsDue] = useState(300);

  const [paidEntries, setPaidEntries] = useState<{ id: string; note: string; amount: number }[]>([]);
  const [payAmount, setPayAmount] = useState("");
  const [payNote, setPayNote] = useState("");
  const [encryptedStatus, setEncryptedStatus] = useState<string | null>(null);

  const handleCurrencyChange = (c: CurrencyCode) => {
    setCurrency(c);
    setGoldRate(DEFAULT_RATES[c].goldPerGram);
    setSilverRate(DEFAULT_RATES[c].silverPerGram);
  };

  const calc = useMemo(() => {
    const toGrams = (val: number) => (unit === "tola" ? val * 11.664 : val);
    const pureGoldGrams = toGrams(goldQty) * KARAT_FACTOR[goldKarat];
    const silverGrams = toGrams(silverQty);

    const goldValue = pureGoldGrams * goldRate;
    const silverValue = silverGrams * silverRate;
    const gross = goldValue + silverValue + cashAndBank + tradeStock + receivables;
    const net = Math.max(0, gross - debtsDue);

    // Hanafi Silver-First Nisab (612.36g) & Gold Nisab (87.48g)
    const silverNisabValue = 612.36 * silverRate;
    const goldNisabValue = 87.48 * goldRate;

    const onlyPureGold = silverGrams === 0 && cashAndBank === 0 && tradeStock === 0 && receivables === 0;
    const activeNisab = onlyPureGold ? goldNisabValue : silverNisabValue;
    const isSahibNisab = net >= activeNisab;
    const zakatDue = isSahibNisab ? net * 0.025 : 0;
    const totalPaid = paidEntries.reduce((acc, e) => acc + e.amount, 0);

    return {
      goldValue,
      silverValue,
      gross,
      net,
      silverNisabValue,
      goldNisabValue,
      activeNisab,
      onlyPureGold,
      isSahibNisab,
      zakatDue,
      totalPaid,
      remaining: Math.max(0, zakatDue - totalPaid),
    };
  }, [goldQty, goldKarat, silverQty, goldRate, silverRate, cashAndBank, tradeStock, receivables, debtsDue, unit, paidEntries]);

  const sym = DEFAULT_RATES[currency].symbol;

  const handleEncryptSave = async () => {
    const blob = await encryptZakatPayload({
      currency,
      net: calc.net,
      zakatDue: calc.zakatDue,
      hawl: `${hawlHijriDay} ${HIJRI_MONTHS[hawlHijriMonth - 1]}`,
      paidEntries,
    });
    localStorage.setItem("auliya_encrypted_zakat_v1", blob);
    setEncryptedStatus(`Encrypted with AES-256-GCM (${blob.slice(0, 42)}...)`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-primary)" }}>
            <Calculator className="w-3.5 h-3.5" />
            <span>Hanafi Silver-First Nisab (612.36g) &amp; Dhamm Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Hanafi Zakat Calculator &amp; Lunar Hawl Ledger
          </h1>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <select
            value={currency}
            onChange={(e) => handleCurrencyChange(e.target.value as CurrencyCode)}
            className="px-3 py-2 rounded-xl border font-semibold bg-transparent outline-none"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            {(Object.keys(DEFAULT_RATES) as CurrencyCode[]).map((c) => (
              <option key={c} value={c} className="text-black">
                {c}
              </option>
            ))}
          </select>
          <button
            type="button"
            onClick={() => setUnit(unit === "grams" ? "tola" : "grams")}
            className="px-3 py-2 rounded-xl border font-semibold cursor-pointer"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            Weight: {unit === "grams" ? "Grams" : "Tola"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Inputs */}
        <section className="lg:col-span-7 bento-card p-6 space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div>
              <label className="block font-semibold mb-1">24K Gold Spot ({sym} / gram)</label>
              <input
                type="number"
                value={goldRate}
                onChange={(e) => setGoldRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>
            <div>
              <label className="block font-semibold mb-1">Silver Spot ({sym} / gram)</label>
              <input
                type="number"
                step="0.01"
                value={silverRate}
                onChange={(e) => setSilverRate(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">
                Gold Jewelry &amp; Bullion ({unit}) — Zakatable in Hanafi Fiqh
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  min={0}
                  value={goldQty}
                  onChange={(e) => setGoldQty(Math.max(0, Number(e.target.value)))}
                  className="flex-1 px-3 py-2 rounded-xl border bg-transparent tabular-nums"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
                <select
                  value={goldKarat}
                  onChange={(e) => setGoldKarat(e.target.value as typeof goldKarat)}
                  className="px-2.5 py-2 rounded-xl border bg-transparent font-semibold"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  {["24K", "22K", "21K", "18K"].map((k) => (
                    <option key={k} value={k} className="text-black">
                      {k}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Silver ({unit})</label>
              <input
                type="number"
                min={0}
                value={silverQty}
                onChange={(e) => setSilverQty(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Cash &amp; Bank Balances ({sym})</label>
              <input
                type="number"
                min={0}
                value={cashAndBank}
                onChange={(e) => setCashAndBank(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Trade Inventory / Shares ({sym})</label>
              <input
                type="number"
                min={0}
                value={tradeStock}
                onChange={(e) => setTradeStock(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Strong Receivables / Dayn Qawi ({sym})</label>
              <input
                type="number"
                min={0}
                value={receivables}
                onChange={(e) => setReceivables(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1 text-red-400">Immediate Due Debts / Liabilities ({sym})</label>
              <input
                type="number"
                min={0}
                value={debtsDue}
                onChange={(e) => setDebtsDue(Math.max(0, Number(e.target.value)))}
                className="w-full px-3 py-2 rounded-xl border bg-transparent tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>
          </div>

          {/* Hijri Hawl & AES-256-GCM Save */}
          <div className="pt-4 border-t flex flex-wrap items-center justify-between gap-3 text-xs" style={{ borderColor: "var(--border-hairline)" }}>
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
              <span>Personal Hijri Hawl Date:</span>
              <input
                type="number"
                min={1}
                max={30}
                value={hawlHijriDay}
                onChange={(e) => setHawlDate(hawlHijriMonth, Number(e.target.value))}
                className="w-12 px-2 py-1 rounded-lg border bg-transparent text-center tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
              <select
                value={hawlHijriMonth}
                onChange={(e) => setHawlDate(Number(e.target.value), hawlHijriDay)}
                className="px-2 py-1 rounded-lg border bg-transparent"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {HIJRI_MONTHS.map((m, idx) => (
                  <option key={m} value={idx + 1} className="text-black">
                    {m}
                  </option>
                ))}
              </select>
            </div>

            <button
              type="button"
              onClick={handleEncryptSave}
              className="px-3.5 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: "var(--accent-primary)" }}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Encrypt &amp; Save Ledger</span>
            </button>
          </div>
          {encryptedStatus && (
            <div className="text-[11px] font-mono flex items-center gap-1.5" style={{ color: "var(--accent-primary)" }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{encryptedStatus}</span>
            </div>
          )}
        </section>

        {/* Results & Disbursement Log */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="bento-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                {calc.onlyPureGold ? "Gold Nisab (87.48g)" : "Hanafi Silver Nisab (612.36g)"}
              </span>
              <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                Threshold: {sym}{calc.activeNisab.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </span>
            </div>

            <div>
              <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                Net Zakatable Wealth
              </div>
              <div className="text-2xl font-bold tabular-nums">
                {sym}{calc.net.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>

            <div className="p-4 rounded-2xl border" style={{ borderColor: "var(--accent-primary)", backgroundColor: "var(--accent-soft)" }}>
              <div className="text-xs font-semibold" style={{ color: "var(--accent-primary)" }}>
                {calc.isSahibNisab ? "2.5% Zakat Obligatory (Wajib)" : "Below Nisab — No Zakat Due"}
              </div>
              <div className="text-3xl font-bold tabular-nums mt-1">
                {sym}{calc.zakatDue.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
              <div className="text-xs mt-1 tabular-nums" style={{ color: "var(--text-muted)" }}>
                Paid: {sym}{calc.totalPaid.toLocaleString()} • Remaining: {sym}{calc.remaining.toLocaleString(undefined, { maximumFractionDigits: 2 })}
              </div>
            </div>

            {/* Disbursement Installments */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const amt = Number(payAmount);
                if (!amt || amt <= 0) return;
                setPaidEntries((prev) => [
                  ...prev,
                  { id: `p-${Date.now()}`, note: payNote || "Zakat Installment", amount: amt },
                ]);
                setPayAmount("");
                setPayNote("");
              }}
              className="flex gap-2 pt-2"
            >
              <input
                type="number"
                placeholder="Amount"
                value={payAmount}
                onChange={(e) => setPayAmount(e.target.value)}
                className="w-24 px-2.5 py-2 rounded-xl border text-xs bg-transparent tabular-nums"
                style={{ borderColor: "var(--border-hairline)" }}
              />
              <input
                type="text"
                placeholder="Recipient / Masarif note"
                value={payNote}
                onChange={(e) => setPayNote(e.target.value)}
                className="flex-1 px-2.5 py-2 rounded-xl border text-xs bg-transparent"
                style={{ borderColor: "var(--border-hairline)" }}
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer"
                style={{ backgroundColor: "var(--accent-primary)" }}
              >
                <Plus className="w-4 h-4" />
              </button>
            </form>
          </div>

          <div className="bento-card p-5 space-y-2 text-xs" style={{ color: "var(--text-muted)" }}>
            <div className="font-bold text-sm flex items-center gap-1.5" style={{ color: "var(--accent-gold)" }}>
              <Info className="w-4 h-4" />
              <span>Hanafi Masarif al-Zakat Guidelines</span>
            </div>
            <p>
              Zakat is given unconditionally (Tamlik) to eligible Fuqara, Masakin, or travelers in need.
              <strong> Sadat (descendants of Banu Hashim)</strong> are honored with <em>Hadiya</em> gifts rather than Zakat.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
