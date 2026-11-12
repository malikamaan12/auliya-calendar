"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Sparkles, RotateCcw, CheckCircle2, MinusCircle } from "lucide-react";
import { useApp } from "@/lib/store";
import { TASBIH_LITANIES } from "@/data/fiqh-hadith";
import { PrayerName } from "@/lib/prayer-engine";

export default function TasbihPage() {
  const {
    tasbihTotalToday,
    tasbihTarget,
    activeLitanyId,
    setActiveLitany,
    incrementTasbih,
    resetTasbihToday,
    sunnahChecks,
    toggleSunnah,
    qazaUmriRemaining,
    setQazaUmri,
    decrementQazaUmri,
  } = useApp();
  const [qazaYears, setQazaYears] = useState("");

  const activeLitany = TASBIH_LITANIES.find((l) => l.id === activeLitanyId) || TASBIH_LITANIES[0];

  const handleTap = () => {
    incrementTasbih(1);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      const next = tasbihTotalToday + 1;
      navigator.vibrate(next === 33 || next === 99 || next === 100 ? [40, 30, 40] : 14);
    }
  };

  const sunnahList = [
    { id: "miswak", label: "Miswak before Wudu & Salah" },
    { id: "ishraq", label: "Ishraq (2–4 Rak'at after Sunrise +20m)" },
    { id: "surah_mulk", label: "Surah Al-Mulk before Sleep" },
    { id: "tahajjud", label: "Tahajjud (Last 1/3 of Night)" },
    { id: "sunnah-jumuah", label: "Jumu'ah Surah Al-Kahf & Abundant Durood" },
    { id: "ayyam_beed", label: "Ayyam al-Beed (13, 14, 15 Hijri Fast)" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-gold)" }}>
          <Sparkles className="w-3.5 h-3.5" />
          <span>Haptic Tasbih Studio • Sunnah Matrix • Qaza-e-Umri Ledger</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Sunnah Habit Tracker &amp; Smart Tasbih
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Full-Screen Tactile Tasbih Studio */}
        <section className="lg:col-span-7 bento-card p-6 space-y-5">
          <div className="flex flex-wrap gap-2">
            {TASBIH_LITANIES.map((lit) => {
              const active = lit.id === activeLitany.id;
              return (
                <button
                  key={lit.id}
                  type="button"
                  onClick={() => setActiveLitany(lit.id, lit.defaultTarget)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
                  style={{
                    borderColor: active ? "var(--accent-gold)" : "var(--border-hairline)",
                    backgroundColor: active ? "var(--gold-soft)" : "var(--bg-muted)",
                    color: active ? "var(--accent-gold)" : "var(--text-muted)",
                  }}
                >
                  {lit.name}
                </button>
              );
            })}
          </div>

          <div className="p-4 rounded-2xl border space-y-2" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
            <div className="text-[11px] font-semibold" style={{ color: "var(--accent-primary)" }}>
              Recommended: {activeLitany.recommendedWindow}
            </div>
            <p dir="rtl" className="font-arabic text-2xl text-right leading-loose">
              {activeLitany.arabic}
            </p>
            <p className="text-xs italic" style={{ color: "var(--accent-secondary)" }}>
              {activeLitany.transliteration}
            </p>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              {activeLitany.translation}
            </p>
            <div className="text-[11px] pt-1" style={{ color: "var(--accent-gold)" }}>
              Fazilat: {activeLitany.fazilat}
            </div>
          </div>

          {/* Luminous Circular Tasbih Ring & Tap Orb */}
          <motion.button
            type="button"
            whileTap={{ scale: 0.97 }}
            onClick={handleTap}
            className="w-full py-8 rounded-3xl border flex flex-col items-center justify-center gap-3 cursor-pointer select-none relative overflow-hidden"
            style={{
              borderColor: "var(--border-hairline)",
              background:
                "radial-gradient(circle at 50% 45%, rgba(0, 229, 255, 0.12), rgba(16, 185, 129, 0.05) 55%, transparent 80%)",
            }}
          >
            {(() => {
              const size = 212;
              const stroke = 11;
              const r = (size - stroke) / 2;
              const circ = 2 * Math.PI * r;
              const pct = Math.min(1, tasbihTotalToday / Math.max(1, tasbihTarget));
              return (
                <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                  <svg width={size} height={size} className="-rotate-90">
                    <defs>
                      <linearGradient id="tasbihArc" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stopColor="#10B981" />
                        <stop offset="100%" stopColor="#00E5FF" />
                      </linearGradient>
                    </defs>
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={r}
                      fill="none"
                      stroke="var(--border-hairline)"
                      strokeWidth={stroke}
                    />
                    <circle
                      cx={size / 2}
                      cy={size / 2}
                      r={r}
                      fill="none"
                      stroke="url(#tasbihArc)"
                      strokeWidth={stroke}
                      strokeLinecap="round"
                      strokeDasharray={circ}
                      strokeDashoffset={circ * (1 - pct)}
                      style={{ transition: "stroke-dashoffset 0.25s ease" }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-secondary)" }}>
                      {activeLitany.name.split(" ")[0]}
                    </span>
                    <div className="flex items-baseline gap-1 mt-0.5">
                      <span className="text-4xl sm:text-5xl font-bold tabular-nums">
                        {String(tasbihTotalToday).padStart(3, "0")}
                      </span>
                      <span className="text-sm font-semibold tabular-nums" style={{ color: "var(--text-muted)" }}>
                        / {tasbihTarget}
                      </span>
                    </div>
                    <span
                      className="mt-2.5 w-8 h-8 rounded-full border-2 flex items-center justify-center text-[10px] font-bold"
                      style={{
                        borderColor: "var(--accent-secondary)",
                        backgroundColor: "rgba(0, 229, 255, 0.14)",
                        boxShadow: "0 0 18px rgba(0, 229, 255, 0.35)",
                        color: "var(--accent-secondary)",
                      }}
                    >
                      +1
                    </span>
                  </div>
                </div>
              );
            })()}
            <span className="text-xs font-semibold uppercase tracking-widest" style={{ color: "var(--accent-primary)" }}>
              Tap Anywhere to Count
            </span>
          </motion.button>

          <div className="flex items-center justify-between text-xs">
            <button
              type="button"
              onClick={() => incrementTasbih(33)}
              className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              +33 Quick Log
            </button>
            <button
              type="button"
              onClick={resetTasbihToday}
              className="px-3 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 cursor-pointer"
              style={{ borderColor: "var(--border-hairline)", color: "var(--text-muted)" }}
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Counter</span>
            </button>
          </div>
        </section>

        {/* Right Column: Sunnah Habit Matrix & Qaza-e-Umri Ledger */}
        <aside className="lg:col-span-5 space-y-5">
          <div className="bento-card p-5 space-y-3">
            <h2 className="text-base font-bold">Daily Sunnah Habit Matrix</h2>
            <div className="space-y-2">
              {sunnahList.map((item) => {
                const done = Boolean(sunnahChecks[item.id]);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => toggleSunnah(item.id)}
                    className="w-full p-3 rounded-xl border flex items-center justify-between text-xs font-medium cursor-pointer"
                    style={{
                      borderColor: done ? "var(--accent-primary)" : "var(--border-hairline)",
                      backgroundColor: done ? "var(--accent-soft)" : "var(--bg-muted)",
                    }}
                  >
                    <span>{item.label}</span>
                    <CheckCircle2
                      className="w-4 h-4 shrink-0"
                      style={{ color: done ? "var(--accent-primary)" : "var(--text-muted)" }}
                    />
                  </button>
                );
              })}
            </div>
          </div>

          <div className="bento-card p-5 space-y-3">
            <div>
              <h2 className="text-base font-bold">Hanafi Qaza-e-Umri Ledger</h2>
              <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                Chip away at lifetime missed Fard + Witr prayers with 1-tap logging.
              </p>
            </div>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const years = Math.max(0, Math.min(80, parseFloat(qazaYears) || 0));
                const n = Math.round(years * 365);
                setQazaUmri({ fajr: n, dhuhr: n, asr: n, maghrib: n, isha: n, witr: n });
                setQazaYears("");
              }}
              className="flex items-center gap-2"
            >
              <input
                type="number"
                min={0}
                max={80}
                step={0.5}
                inputMode="decimal"
                placeholder="Missed years (estimate)"
                aria-label="Estimated years of missed prayers"
                value={qazaYears}
                onChange={(e) => setQazaYears(e.target.value)}
                className="flex-1 min-w-0 px-3 py-2 rounded-xl border text-xs bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer shrink-0"
                style={{ backgroundColor: "var(--accent-primary)" }}
              >
                Set
              </button>
            </form>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Estimate the years of missed Salah since Bulugh (puberty); we count 365 of each Fard + Witr per year.
              Tap a prayer below each time you offer one Qaza.
            </p>
            <div className="grid grid-cols-2 gap-2.5">
              {(["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"] as (PrayerName | "witr")[]).map(
                (p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => decrementQazaUmri(p)}
                    className="p-3 rounded-xl border flex items-center justify-between text-xs cursor-pointer hover:opacity-90"
                    style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                  >
                    <div className="text-start">
                      <div className="uppercase font-bold">{p}</div>
                      <div className="tabular-nums text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {qazaUmriRemaining[p]} left
                      </div>
                    </div>
                    <MinusCircle className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                  </button>
                )
              )}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
