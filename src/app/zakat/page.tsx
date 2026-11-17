"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  Award,
  BadgeCheck,
  BookOpen,
  Briefcase,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Clock,
  Coins,
  Copy,
  Download,
  Droplets,
  Eye,
  FileText,
  Globe,
  HeartHandshake,
  History,
  Info,
  Landmark,
  Lock,
  Minus,
  Plus,
  RefreshCw,
  RotateCcw,
  Scale,
  Search,
  ShieldCheck,
  Sparkles,
  Sprout,
  Trash2,
  TrendingUp,
  Users,
  Wallet,
  Wheat,
  XCircle,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { HIJRI_MONTHS } from "@/lib/hijri";
import { formatLocalizedHijriMonth, t } from "@/lib/i18n";
import { decryptZakatPayload, encryptZakatPayload, sha256Hex } from "@/lib/crypto-integrity";
import type { ZakatCurrencyConfig } from "@/lib/backend-types";

/* -------------------------------------------------------------------------- */
/* Types & Constants                                                          */
/* -------------------------------------------------------------------------- */

type StudioTab = "calculator" | "ledger" | "fitrah" | "ushr";
type WeightUnit = "grams" | "tola" | "oz";
type CalendarBasis = "lunar" | "solar";
type GoldKarat = "24K" | "22K" | "21K" | "18K" | "14K";
type SharesValuationMode = "trading_100" | "longterm_30";
type FitrahCommodityId = "wheat" | "barley" | "dates" | "raisins";
type IrrigationMode = "natural_10" | "irrigated_5";
type MasarifFilter = "all" | "eligible" | "ineligible" | "special";

type DisbursementCategory =
  | "Fuqara & Masakin"
  | "Madrasa Tamlik Scholarship"
  | "Orphan Tamlik Support"
  | "Indigent Debt Relief"
  | "Medical Aid";

interface GoldVaultItem {
  id: string;
  label: string;
  weight: number; // Stored in active WeightUnit; auto-converted when unit changes
  karat: GoldKarat;
}

interface DisbursementEntry {
  id: string;
  recipient: string;
  category: DisbursementCategory;
  date: string;
  amount: number;
  tamlikConfirmed: boolean;
}

interface RateOverrideEntry {
  goldPerGram24K?: number;
  silverPerGram?: number;
  source?: "manual" | "live-fx";
  fxRate?: number;
  syncedAt?: string;
}

interface EncryptedZakatSnapshot {
  id: string;
  createdAt: string;
  hijriDateFormatted: string;
  hawlLabel: string;
  currencyCode: string;
  currencySymbol: string;
  weightUnit: WeightUnit;
  calendarBasis: CalendarBasis;
  goldRatePerGram: number;
  silverRatePerGram: number;
  grossAssets: number;
  totalLiabilities: number;
  netZakatableWealth: number;
  activeNisabType: "gold" | "silver";
  activeNisabValue: number;
  isSahibNisab: boolean;
  zakatRatePercent: number;
  zakatDue: number;
  totalPaid: number;
  remainingDue: number;
  sha256Digest: string;
  cipherPreview: string;
  stateSnapshot: {
    goldItems: GoldVaultItem[];
    silver999: number;
    silver925: number;
    cashInHand: number;
    bankAccounts: number;
    foreignCurrency: number;
    tradeInventory: number;
    halalSharesValue: number;
    sharesMode: SharesValuationMode;
    receivablesStrong: number;
    retirementAccessible: number;
    immediateDebts: number;
    supplierPayables: number;
    unpaidMahr: number;
    dueBillsTaxes: number;
    unpaidPriorZakat: number;
    disbursements: DisbursementEntry[];
  };
}

interface EncryptedVaultEnvelope {
  snapshots: EncryptedZakatSnapshot[];
  activeDisbursements: DisbursementEntry[];
}

const VAULT_STORAGE_KEY = "auliya_encrypted_zakat_v2";

const UNIT_META: Record<WeightUnit, { label: string; shortLabel: string; gramsFactor: number }> = {
  grams: { label: "Grams", shortLabel: "g", gramsFactor: 1 },
  tola: { label: "Tola (11.664g)", shortLabel: "tola", gramsFactor: 11.664 },
  oz: { label: "Troy Oz (31.1035g)", shortLabel: "oz t", gramsFactor: 31.1035 },
};

const KARAT_FACTORS: Record<GoldKarat, number> = {
  "24K": 24 / 24,
  "22K": 22 / 24,
  "21K": 21 / 24,
  "18K": 18 / 24,
  "14K": 14 / 24,
};

const GOLD_KARATS: GoldKarat[] = ["24K", "22K", "21K", "18K", "14K"];

const DISBURSEMENT_CATEGORIES: DisbursementCategory[] = [
  "Fuqara & Masakin",
  "Madrasa Tamlik Scholarship",
  "Orphan Tamlik Support",
  "Indigent Debt Relief",
  "Medical Aid",
];

interface MasarifRuleCard {
  id: string;
  title: string;
  arabicTerm: string;
  status: "eligible" | "ineligible" | "special";
  badgeText: string;
  summary: string;
  fiqhDetail: string;
  keywords: string;
}

const HANAFI_MASARIF_RULES: MasarifRuleCard[] = [
  {
    id: "tamlik-core",
    title: "Unconditional Ownership Transfer (Tamlik)",
    arabicTerm: "تمليك الفقير",
    status: "special",
    badgeText: "Pillar Condition (Rukn)",
    summary:
      "In the Hanafi Madhhab, Zakat is only discharged when an eligible poor Muslim is made the unconditional personal owner (Malik) of the wealth.",
    fiqhDetail:
      "Feeding people at a general gathering (Ibahah) or paying directly for services/construction without transferring ownership to a qualifying individual does not discharge Zakat (Al-Hidayah, Bahar-e-Shariat).",
    keywords: "tamlik ownership condition rukn meals ibahah",
  },
  {
    id: "sadat-honor",
    title: "Sadat / Banu Hashim (Ahl al-Bayt ﷺ)",
    arabicTerm: "إكرام السادات وبني هاشم",
    status: "special",
    badgeText: "Sacred Honor — Give Hadiya, Never Zakat",
    summary:
      "Sayyids and members of Banu Hashim (descendants of Hashim: families of Ali, Aqil, Ja'far, Abbas, and Harith رضي الله عنهم) CANNOT be given Zakat, Fitrah, Fidyah, or Kaffarah.",
    fiqhDetail:
      "Out of supreme reverence for the Prophetic household ﷺ, obligatory charity (which cleanses wealth's impurities) is forbidden for Ahl al-Bayt. Believers must honor and support needy Sadat generously from pure personal wealth as unconditional Hadiya (gifts) and Khidmat.",
    keywords: "sadat syed sayyid ahlul bayt ahl al bayt banu hashim hadiya prophet family",
  },
  {
    id: "poor-relatives",
    title: "Poor Siblings, Nephews, Nieces, Aunts & Uncles",
    arabicTerm: "ذوو الأرحام المحتاجون",
    status: "eligible",
    badgeText: "Valid • Double Reward (2x Ajr)",
    summary:
      "Giving Zakat to non-lineal relatives who are below the Silver Nisab carries a double reward: one for Zakat and one for Silat ar-Rahim (upholding kinship).",
    fiqhDetail:
      "Brothers, sisters, nephews, nieces, paternal/maternal uncles, aunts, cousins, in-laws, and step-relatives are top-priority recipients in Hanafi Fiqh when they are Sahib-e-Hajat (below Nisab) and non-Hashimi.",
    keywords: "brother sister sibling uncle aunt nephew niece cousin in-laws relative double reward kinship",
  },
  {
    id: "fuqara-masakin",
    title: "Fuqara & Masakin (Indigent & Needy Muslims)",
    arabicTerm: "الفقراء والمساكين",
    status: "eligible",
    badgeText: "Primary Eligible Masrif",
    summary:
      "A Faqir possesses something minimal but less than the Hanafi Nisab above basic necessities (Hajat-e-Asliyyah); a Miskin possesses nothing at all.",
    fiqhDetail:
      "Basic necessities (one's home, essential clothing, tools of trade, household furniture, and basic transport) do NOT prevent someone from receiving Zakat, provided their surplus assets do not reach the Silver Nisab.",
    keywords: "faqir fuqara miskin masakin poor needy indigent nisab",
  },
  {
    id: "ascendants-descendants",
    title: "Ascendants, Descendants & Spouse",
    arabicTerm: "الأصول والفروع والزوجية",
    status: "ineligible",
    badgeText: "Not Permissible for Zakat",
    summary:
      "You CANNOT give Zakat or Fitrah to your parents, grandparents, children, grandchildren, or spouse (husband to wife OR wife to husband in Hanafi Fiqh).",
    fiqhDetail:
      "Because benefits of wealth are shared between direct lineage (Usul/Furu') and spouses in the Hanafi school (Imam Abu Hanifa, Fatawa Alamgiri), Tamlik is incomplete. Support them generously via Nafaqah and voluntary Hadiya.",
    keywords: "father mother parents grandfather grandmother son daughter children grandchildren wife husband spouse",
  },
  {
    id: "madrasa-orphans",
    title: "Madrasa Talib-e-Ilm & Poor Orphans",
    arabicTerm: "طلبة العلم الشرعي والأيتام",
    status: "eligible",
    badgeText: "Valid via Direct / Wakil Tamlik",
    summary:
      "Adult poor students of Sacred Islamic Knowledge and indigent orphans (who do not own Nisab) are highly virtuous Zakat recipients when Tamlik is observed.",
    fiqhDetail:
      "Madrasas and orphanages must act strictly as an authorized representative (Wakil) to hand Zakat into the personal ownership of eligible poor students/orphans first, rather than spending Zakat directly on staff salaries or buildings.",
    keywords: "madrasa student talib ilm scholar orphan yatim scholarship",
  },
  {
    id: "gharimin-traveler",
    title: "Debt-Burdened (Al-Gharimin) & Stranded Traveler",
    arabicTerm: "الغارمون وابن السبيل",
    status: "eligible",
    badgeText: "Valid Masrif",
    summary:
      "A Muslim crushed by lawful personal debts whose net wealth after debt falls below Nisab, or a traveler stranded away from accessible home wealth.",
    fiqhDetail:
      "Handing Zakat directly to the indebted person (or paying their creditor with the debtor's explicit authorization/Wakalah) validly discharges Zakat. Do not simply forgive an existing loan you gave someone and count it as Zakat — in Hanafi Fiqh, forgiving a debt does not count as Zakat!",
    keywords: "debt debtor loan gharimin traveler musafir ibn sabil medical bills",
  },
  {
    id: "masjid-public-works",
    title: "Masjid Construction, Shrouds & Public Works",
    arabicTerm: "بناء المساجد والمصالح العامة",
    status: "ineligible",
    badgeText: "Use Sadaqah Jariyah / Lillah Only",
    summary:
      "Zakat CANNOT be spent directly on building Masjids, Dargahs, hospitals, digging wells, printing books for waqf, or shrouding (Kafan) a deceased person.",
    fiqhDetail:
      "None of these transfer ownership (Tamlik) to a living indigent Muslim. Fund Masjids, shrines, and community welfare abundantly from Lillah and Sadaqah Jariyah funds.",
    keywords: "masjid mosque construction building hospital well road kafan funeral deceased waqf",
  },
];

/* -------------------------------------------------------------------------- */
/* Pure Helper Functions                                                      */
/* -------------------------------------------------------------------------- */

function parseStudioTab(raw: string | null): StudioTab {
  if (raw === "ledger" || raw === "fitrah" || raw === "ushr" || raw === "calculator") {
    return raw;
  }
  return "calculator";
}

function formatMoney(val: number, symbol: string, decimals = 2): string {
  const safe = Number.isFinite(val) ? val : 0;
  return `${symbol}${safe.toLocaleString(undefined, {
    minimumFractionDigits: safe % 1 === 0 ? 0 : Math.min(2, decimals),
    maximumFractionDigits: decimals,
  })}`;
}

function hijriDayOfYearApprox(month: number, day: number): number {
  let acc = 0;
  const clampedM = Math.max(1, Math.min(12, month));
  for (let i = 0; i < clampedM - 1; i++) {
    acc += i % 2 === 0 ? 30 : 29;
  }
  return acc + Math.max(1, Math.min(30, day));
}

/* -------------------------------------------------------------------------- */
/* Inner Studio Component                                                     */
/* -------------------------------------------------------------------------- */

function ZakatStudioInner() {
  const searchParams = useSearchParams();
  const {
    lang,
    now,
    hijri,
    hawlHijriMonth,
    hawlHijriDay,
    setHawlDate,
    backend,
    totalXp,
    currentRank,
    awardXp,
  } = useApp();

  const zakatConfig = backend.zakatConfig;
  const xpZakatReward = backend.gamificationConfig.xpRewards.zakatLogged || 60;

  const todayIso = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(
    now.getDate()
  ).padStart(2, "0")}`;

  // Navigation Tab
  const [activeTab, setActiveTab] = useState<StudioTab>(() =>
    parseStudioTab(searchParams.get("tab"))
  );

  // Global Benchmark Controls
  const [currencyCode, setCurrencyCode] = useState<string>("USD");
  const [weightUnit, setWeightUnit] = useState<WeightUnit>("grams");
  const [calendarBasis, setCalendarBasis] = useState<CalendarBasis>("lunar");
  const [rateOverrides, setRateOverrides] = useState<Record<string, RateOverrideEntry>>({});
  const [spotLoading, setSpotLoading] = useState(false);
  const [spotMessage, setSpotMessage] = useState<{ tone: "emerald" | "gold"; text: string } | null>(
    null
  );

  // Tab 1: Itemized Gold Vault
  const [goldItems, setGoldItems] = useState<GoldVaultItem[]>([
    { id: "g-1", label: "Personal Jewelry & Ornaments", weight: 25, karat: "22K" },
    { id: "g-2", label: "Gold Coins / Bullion", weight: 10, karat: "24K" },
  ]);

  // Tab 1: Silver Vault (stored in active weightUnit)
  const [silver999, setSilver999] = useState<number>(80);
  const [silver925, setSilver925] = useState<number>(40);

  // Tab 1: Liquid & Investment Assets
  const [cashInHand, setCashInHand] = useState<number>(650);
  const [bankAccounts, setBankAccounts] = useState<number>(3200);
  const [foreignCurrency, setForeignCurrency] = useState<number>(0);
  const [tradeInventory, setTradeInventory] = useState<number>(1500);
  const [halalSharesValue, setHalalSharesValue] = useState<number>(2000);
  const [sharesMode, setSharesMode] = useState<SharesValuationMode>("longterm_30");
  const [receivablesStrong, setReceivablesStrong] = useState<number>(400);
  const [retirementAccessible, setRetirementAccessible] = useState<number>(0);

  // Tab 1: Deductible Hanafi Liabilities
  const [immediateDebts, setImmediateDebts] = useState<number>(300);
  const [supplierPayables, setSupplierPayables] = useState<number>(0);
  const [unpaidMahr, setUnpaidMahr] = useState<number>(0);
  const [dueBillsTaxes, setDueBillsTaxes] = useState<number>(180);
  const [unpaidPriorZakat, setUnpaidPriorZakat] = useState<number>(0);

  // Interactive Donut Slice Highlight
  const [activeDonutId, setActiveDonutId] = useState<string | null>(null);

  // Tab 2: Disbursement Ledger & Encrypted Vault History
  const [disbursements, setDisbursements] = useState<DisbursementEntry[]>([]);
  const [payRecipient, setPayRecipient] = useState("");
  const [payCategory, setPayCategory] = useState<DisbursementCategory>("Fuqara & Masakin");
  const [payDate, setPayDate] = useState<string>("");
  const [payAmount, setPayAmount] = useState<string>("");
  const [payTamlik, setPayTamlik] = useState<boolean>(true);

  const [vaultSnapshots, setVaultSnapshots] = useState<EncryptedZakatSnapshot[]>([]);
  const [vaultHydrated, setVaultHydrated] = useState(false);
  const [expandedSnapshotId, setExpandedSnapshotId] = useState<string | null>(null);
  const [statusBanner, setStatusBanner] = useState<string | null>(null);
  const [copiedReport, setCopiedReport] = useState(false);

  // Tab 3: Fitrah, Fidyah & Kaffarah
  const [familyAdults, setFamilyAdults] = useState<number>(2);
  const [familyMinors, setFamilyMinors] = useState<number>(2);
  const [familyNewborns, setFamilyNewborns] = useState<number>(0);
  const [fitrahCommodity, setFitrahCommodity] = useState<FitrahCommodityId>("wheat");
  const [fitrahPriceOverrides, setFitrahPriceOverrides] = useState<
    Record<string, Partial<Record<FitrahCommodityId, number>>>
  >({});
  const [fidyahMissedFasts, setFidyahMissedFasts] = useState<number>(30);
  const [shaykhFaniAcknowledged, setShaykhFaniAcknowledged] = useState<boolean>(false);

  // Tab 4: Ushr & Masarif Checker
  const [ushrInputMode, setUshrInputMode] = useState<"value" | "quantity">("value");
  const [ushrHarvestValue, setUshrHarvestValue] = useState<number>(5000);
  const [ushrHarvestKg, setUshrHarvestKg] = useState<number>(1200);
  const [ushrPricePerKg, setUshrPricePerKg] = useState<number>(2.5);
  const [ushrIrrigation, setUshrIrrigation] = useState<IrrigationMode>("natural_10");
  const [masarifSearch, setMasarifSearch] = useState<string>("");
  const [masarifFilter, setMasarifFilter] = useState<MasarifFilter>("all");

  // Show temporary banner helper
  const flashBanner = useCallback((msg: string) => {
    setStatusBanner(msg);
    setTimeout(() => {
      setStatusBanner((curr) => (curr === msg ? null : curr));
    }, 4200);
  }, []);

  // Hydrate AES-256-GCM Encrypted Vault from localStorage (`auliya_encrypted_zakat_v2`)
  useEffect(() => {
    let cancelled = false;
    Promise.resolve().then(async () => {
      try {
        const raw = localStorage.getItem(VAULT_STORAGE_KEY);
        if (raw) {
          const decrypted = await decryptZakatPayload<
            EncryptedVaultEnvelope | EncryptedZakatSnapshot[]
          >(raw);
          if (!cancelled && decrypted) {
            if (Array.isArray(decrypted)) {
              setVaultSnapshots(decrypted);
            } else if (Array.isArray(decrypted.snapshots)) {
              setVaultSnapshots(decrypted.snapshots);
              if (Array.isArray(decrypted.activeDisbursements)) {
                setDisbursements(decrypted.activeDisbursements);
              }
            }
          }
        }
      } catch {
        // Ignore corrupted or unavailable WebCrypto storage
      } finally {
        if (!cancelled) {
          setVaultHydrated(true);
        }
      }
    });
    return () => {
      cancelled = true;
    };
  }, []);

  // Persist envelope helper
  const persistEncryptedEnvelope = useCallback(
    async (
      nextSnapshots: EncryptedZakatSnapshot[],
      nextDisbursements: DisbursementEntry[]
    ): Promise<string> => {
      const envelope: EncryptedVaultEnvelope = {
        snapshots: nextSnapshots,
        activeDisbursements: nextDisbursements,
      };
      const blob = await encryptZakatPayload(envelope);
      try {
        localStorage.setItem(VAULT_STORAGE_KEY, blob);
      } catch {
        // ignore storage quota errors
      }
      return blob;
    },
    []
  );

  // Active Currency Resolution from backend.zakatConfig
  const activeCurrency: ZakatCurrencyConfig = useMemo(() => {
    const list = zakatConfig.currencies;
    return (
      list.find((c) => c.code === currencyCode) ||
      list[0] || {
        code: "USD",
        name: "US Dollar",
        symbol: "$",
        goldPerGram24K: 86.5,
        silverPerGram: 1.08,
        fitrahWheatPerKg: 2.6,
        fitrahDatesPerKg: 9.5,
        fitrahRaisinsPerKg: 8.2,
        fitrahBarleyPerKg: 3.1,
      }
    );
  }, [zakatConfig.currencies, currencyCode]);

  const activeOverride = rateOverrides[activeCurrency.code];
  const effectiveGoldPerGram = activeOverride?.goldPerGram24K ?? activeCurrency.goldPerGram24K;
  const effectiveSilverPerGram = activeOverride?.silverPerGram ?? activeCurrency.silverPerGram;

  const unitMeta = UNIT_META[weightUnit];
  const displayedGoldPerUnit = Number(
    (effectiveGoldPerGram * unitMeta.gramsFactor).toFixed(effectiveGoldPerGram >= 50 ? 2 : 3)
  );
  const displayedSilverPerUnit = Number(
    (effectiveSilverPerGram * unitMeta.gramsFactor).toFixed(effectiveSilverPerGram >= 50 ? 2 : 3)
  );

  // Convert vault weights cleanly when user switches Grams <-> Tola <-> Troy Oz
  const handleWeightUnitChange = useCallback(
    (nextUnit: WeightUnit) => {
      if (nextUnit === weightUnit) return;
      const ratio = UNIT_META[weightUnit].gramsFactor / UNIT_META[nextUnit].gramsFactor;
      const scaleWeight = (w: number) => (w === 0 ? 0 : Number((w * ratio).toFixed(4)));
      setGoldItems((prev) => prev.map((it) => ({ ...it, weight: scaleWeight(it.weight) })));
      setSilver999((prev) => scaleWeight(prev));
      setSilver925((prev) => scaleWeight(prev));
      setWeightUnit(nextUnit);
    },
    [weightUnit]
  );

  const handleManualGoldRateChange = (valInUnit: number) => {
    const safe = Math.max(0, Number.isFinite(valInUnit) ? valInUnit : 0);
    const perGram = safe / unitMeta.gramsFactor;
    setRateOverrides((prev) => ({
      ...prev,
      [activeCurrency.code]: {
        ...prev[activeCurrency.code],
        goldPerGram24K: Number(perGram.toFixed(6)),
        source: "manual",
      },
    }));
  };

  const handleManualSilverRateChange = (valInUnit: number) => {
    const safe = Math.max(0, Number.isFinite(valInUnit) ? valInUnit : 0);
    const perGram = safe / unitMeta.gramsFactor;
    setRateOverrides((prev) => ({
      ...prev,
      [activeCurrency.code]: {
        ...prev[activeCurrency.code],
        silverPerGram: Number(perGram.toFixed(6)),
        source: "manual",
      },
    }));
  };

  const handleResetBenchmark = () => {
    setRateOverrides((prev) => {
      const copy = { ...prev };
      delete copy[activeCurrency.code];
      return copy;
    });
    setSpotMessage(null);
  };

  // Live FX Spot Benchmark Query (`https://open.er-api.com/v6/latest/USD`)
  const handleFetchLiveSpot = async () => {
    setSpotLoading(true);
    setSpotMessage(null);
    const usdRef =
      zakatConfig.currencies.find((c) => c.code === "USD") || zakatConfig.currencies[0];

    try {
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 6500);
      const res = await fetch("https://open.er-api.com/v6/latest/USD", {
        signal: controller.signal,
        cache: "no-store",
      });
      clearTimeout(timeout);

      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = (await res.json()) as {
        result?: string;
        rates?: Record<string, number>;
      };

      if (!json?.rates || typeof json.rates !== "object") {
        throw new Error("Invalid FX payload");
      }

      const syncedAt = new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
      const nextMap: Record<string, RateOverrideEntry> = {};

      for (const curr of zakatConfig.currencies) {
        const fx = curr.code === "USD" ? 1 : json.rates[curr.code];
        if (typeof fx === "number" && fx > 0 && usdRef) {
          const g = Number(
            (usdRef.goldPerGram24K * fx).toFixed(curr.goldPerGram24K >= 100 ? 2 : 3)
          );
          const s = Number(
            (usdRef.silverPerGram * fx).toFixed(curr.silverPerGram >= 20 ? 2 : 3)
          );
          nextMap[curr.code] = {
            goldPerGram24K: g,
            silverPerGram: s,
            source: "live-fx",
            fxRate: fx,
            syncedAt,
          };
        }
      }

      setRateOverrides((prev) => ({ ...prev, ...nextMap }));
      const currApplied = nextMap[activeCurrency.code];
      if (currApplied) {
        setSpotMessage({
          tone: "emerald",
          text:
            activeCurrency.code === "USD"
              ? `Live USD benchmark verified (${activeCurrency.symbol}${currApplied.goldPerGram24K}/g 24K Gold • ${activeCurrency.symbol}${currApplied.silverPerGram}/g Silver).`
              : `Live FX synced (1 USD = ${currApplied.fxRate?.toFixed(2)} ${activeCurrency.code}) • ${activeCurrency.symbol}${currApplied.goldPerGram24K}/g Gold, ${activeCurrency.symbol}${currApplied.silverPerGram}/g Silver.`,
        });
      } else {
        setSpotMessage({
          tone: "gold",
          text: `FX synced, using Sanctuary CMS rate for ${activeCurrency.code}. Verify with local bullion jeweler if needed.`,
        });
      }
    } catch {
      // Graceful fallback to backend.zakatConfig rates
      setRateOverrides((prev) => {
        const copy = { ...prev };
        delete copy[activeCurrency.code];
        return copy;
      });
      setSpotMessage({
        tone: "gold",
        text: `Live FX feed unavailable — gracefully using Sanctuary CMS benchmark (${activeCurrency.symbol}${activeCurrency.goldPerGram24K}/g 24K Gold • ${activeCurrency.symbol}${activeCurrency.silverPerGram}/g Silver).`,
      });
    } finally {
      setSpotLoading(false);
    }
  };

  /* ------------------------------------------------------------------------ */
  /* Core Hanafi Zakat Telemetry Calculation                                  */
  /* ------------------------------------------------------------------------ */

  const calc = useMemo(() => {
    const gFactor = UNIT_META[weightUnit].gramsFactor;

    const itemizedGold = goldItems.map((item) => {
      const grossGrams = Math.max(0, item.weight) * gFactor;
      const pure24KGrams = grossGrams * KARAT_FACTORS[item.karat];
      const value = pure24KGrams * effectiveGoldPerGram;
      return {
        ...item,
        grossGrams,
        pure24KGrams,
        value,
      };
    });

    const totalGoldGrossGrams = itemizedGold.reduce((acc, i) => acc + i.grossGrams, 0);
    const totalPureGoldGrams = itemizedGold.reduce((acc, i) => acc + i.pure24KGrams, 0);
    const goldValue = itemizedGold.reduce((acc, i) => acc + i.value, 0);

    const silver999Grams = Math.max(0, silver999) * gFactor;
    const silver925Grams = Math.max(0, silver925) * gFactor;
    const pureSilverGrams = silver999Grams + silver925Grams * 0.925;
    const silverValue = pureSilverGrams * effectiveSilverPerGram;

    const cashTotal =
      Math.max(0, cashInHand) + Math.max(0, bankAccounts) + Math.max(0, foreignCurrency);

    const effectiveSharesValue =
      Math.max(0, halalSharesValue) * (sharesMode === "trading_100" ? 1 : 0.3);
    const businessTotal = Math.max(0, tradeInventory) + effectiveSharesValue;

    const receivablesTotal =
      Math.max(0, receivablesStrong) + Math.max(0, retirementAccessible);

    const grossAssets =
      goldValue + silverValue + cashTotal + businessTotal + receivablesTotal;

    const totalLiabilities =
      Math.max(0, immediateDebts) +
      Math.max(0, supplierPayables) +
      Math.max(0, unpaidMahr) +
      Math.max(0, dueBillsTaxes) +
      Math.max(0, unpaidPriorZakat);

    const netZakatableWealth = Math.max(0, grossAssets - totalLiabilities);

    // Dynamic Nisab thresholds from backend.zakatConfig
    const silverNisabValue = zakatConfig.silverNisabGrams * effectiveSilverPerGram;
    const goldNisabValue = zakatConfig.goldNisabGrams * effectiveGoldPerGram;

    // Hanafi Dhamm & Anfa' lil-Fuqara Rule:
    // Gold Nisab applies ONLY if the person owns pure gold alone with zero silver, cash, trade goods, or receivables.
    const nonGoldAssetsSum = silverValue + cashTotal + businessTotal + receivablesTotal;
    const onlyPureGold = totalPureGoldGrams > 0 && nonGoldAssetsSum === 0;

    const activeNisabType: "gold" | "silver" = onlyPureGold ? "gold" : "silver";
    const activeNisabValue = onlyPureGold ? goldNisabValue : silverNisabValue;

    const isSahibNisab = activeNisabValue > 0 && netZakatableWealth >= activeNisabValue;
    const nisabProgressPct =
      activeNisabValue > 0 ? Math.min(100, (netZakatableWealth / activeNisabValue) * 100) : 0;

    const zakatRatePercent =
      calendarBasis === "lunar"
        ? zakatConfig.lunarRatePercent
        : zakatConfig.solarRatePercent;

    const zakatDue = isSahibNisab ? netZakatableWealth * (zakatRatePercent / 100) : 0;
    const totalPaid = disbursements.reduce((acc, d) => acc + d.amount, 0);
    const remainingDue = Math.max(0, zakatDue - totalPaid);
    const surplusSadaqah = Math.max(0, totalPaid - zakatDue);
    const paidProgressPct =
      zakatDue > 0 ? Math.min(100, (totalPaid / zakatDue) * 100) : totalPaid > 0 ? 100 : 0;

    return {
      itemizedGold,
      totalGoldGrossGrams,
      totalPureGoldGrams,
      goldValue,
      silver999Grams,
      silver925Grams,
      pureSilverGrams,
      silverValue,
      cashTotal,
      effectiveSharesValue,
      businessTotal,
      receivablesTotal,
      grossAssets,
      totalLiabilities,
      netZakatableWealth,
      silverNisabValue,
      goldNisabValue,
      onlyPureGold,
      activeNisabType,
      activeNisabValue,
      isSahibNisab,
      nisabProgressPct,
      zakatRatePercent,
      zakatDue,
      totalPaid,
      remainingDue,
      surplusSadaqah,
      paidProgressPct,
    };
  }, [
    weightUnit,
    goldItems,
    effectiveGoldPerGram,
    silver999,
    silver925,
    effectiveSilverPerGram,
    cashInHand,
    bankAccounts,
    foreignCurrency,
    halalSharesValue,
    sharesMode,
    tradeInventory,
    receivablesStrong,
    retirementAccessible,
    immediateDebts,
    supplierPayables,
    unpaidMahr,
    dueBillsTaxes,
    unpaidPriorZakat,
    zakatConfig.silverNisabGrams,
    zakatConfig.goldNisabGrams,
    zakatConfig.lunarRatePercent,
    zakatConfig.solarRatePercent,
    calendarBasis,
    disbursements,
  ]);

  /* ------------------------------------------------------------------------ */
  /* Donut Chart Segments                                                     */
  /* ------------------------------------------------------------------------ */

  const donutSegments = useMemo(() => {
    const raw = [
      { id: "gold", label: "Gold Vault", value: calc.goldValue, color: "#F59E0B" },
      { id: "silver", label: "Silver Vault", value: calc.silverValue, color: "#94A3B8" },
      { id: "cash", label: "Cash & Bank", value: calc.cashTotal, color: "#10B981" },
      { id: "business", label: "Trade & Shares", value: calc.businessTotal, color: "#A855F7" },
      { id: "receivables", label: "Receivables & PF", value: calc.receivablesTotal, color: "#38BDF8" },
    ];
    const total = calc.grossAssets;
    const circumference = 2 * Math.PI * 60;
    let cumulative = 0;

    return raw.map((seg) => {
      const pct = total > 0 ? (seg.value / total) * 100 : 0;
      const dash = total > 0 ? (seg.value / total) * circumference : 0;
      const offset = -cumulative * circumference;
      if (total > 0) cumulative += seg.value / total;
      return {
        ...seg,
        pct,
        dash,
        offset,
        circumference,
      };
    });
  }, [
    calc.goldValue,
    calc.silverValue,
    calc.cashTotal,
    calc.businessTotal,
    calc.receivablesTotal,
    calc.grossAssets,
  ]);

  const focusedDonutSeg = donutSegments.find((s) => s.id === activeDonutId) || null;

  /* ------------------------------------------------------------------------ */
  /* Hijri Hawl Countdown Telemetry (Pure Deterministic Calculation)          */
  /* ------------------------------------------------------------------------ */

  const hawlTelemetry = useMemo(() => {
    const isToday = hijri.month === hawlHijriMonth && hijri.day === hawlHijriDay;
    const currIdx = hijriDayOfYearApprox(hijri.month, hijri.day);
    const targetIdx = hijriDayOfYearApprox(hawlHijriMonth, hawlHijriDay);
    const daysRemaining = isToday
      ? 0
      : targetIdx > currIdx
      ? targetIdx - currIdx
      : 354 - currIdx + targetIdx;
    const nextHijriYear = targetIdx >= currIdx ? hijri.year : hijri.year + 1;
    const cycleCompletedPct = Math.min(
      100,
      Math.max(0, Math.round(((354 - daysRemaining) / 354) * 100))
    );
    const baseMs = Date.parse(`${todayIso}T12:00:00Z`);
    const approxGregorian = new Date(baseMs + daysRemaining * 86400000).toLocaleDateString(
      "en-US",
      { month: "short", day: "numeric", year: "numeric" }
    );
    const monthDisplay = formatLocalizedHijriMonth(
      lang,
      hawlHijriMonth,
      HIJRI_MONTHS[(hawlHijriMonth - 1 + 12) % 12] || "Ramadan"
    );

    return {
      isToday,
      daysRemaining,
      nextHijriYear,
      cycleCompletedPct,
      approxGregorian,
      monthDisplay,
      hawlFormatted: `${hawlHijriDay} ${HIJRI_MONTHS[(hawlHijriMonth - 1 + 12) % 12]} ${nextHijriYear} AH`,
    };
  }, [todayIso, hijri.month, hijri.day, hijri.year, hawlHijriMonth, hawlHijriDay, lang]);

  /* ------------------------------------------------------------------------ */
  /* Fitrah, Fidyah & Ushr Calculations                                       */
  /* ------------------------------------------------------------------------ */

  const fitrahCommodities = useMemo(() => {
    const ov = fitrahPriceOverrides[activeCurrency.code] || {};
    return [
      {
        id: "wheat" as const,
        title: "Wheat / Atta (Nisf Sa')",
        arabic: "نصف صاع حنطة",
        kg: zakatConfig.fitrahWheatKg,
        defaultPrice: activeCurrency.fitrahWheatPerKg,
        pricePerKg: ov.wheat ?? activeCurrency.fitrahWheatPerKg,
        note: "Standard Hanafi baseline (~2 kg precaution per Fatawa Razawiyyah)",
      },
      {
        id: "barley" as const,
        title: "Barley / Jau (1 Sa')",
        arabic: "صاع شعير",
        kg: zakatConfig.fitrahOtherKg,
        defaultPrice: activeCurrency.fitrahBarleyPerKg,
        pricePerKg: ov.barley ?? activeCurrency.fitrahBarleyPerKg,
        note: "Full Prophetic Sa' weight",
      },
      {
        id: "dates" as const,
        title: "Dates / Khajoor (1 Sa')",
        arabic: "صاع تمر",
        kg: zakatConfig.fitrahOtherKg,
        defaultPrice: activeCurrency.fitrahDatesPerKg,
        pricePerKg: ov.dates ?? activeCurrency.fitrahDatesPerKg,
        note: "Higher Anfa' lil-Fuqara merit for affluent households",
      },
      {
        id: "raisins" as const,
        title: "Raisins / Kishmish (1 Sa')",
        arabic: "صاع زبيب",
        kg: zakatConfig.fitrahOtherKg,
        defaultPrice: activeCurrency.fitrahRaisinsPerKg,
        pricePerKg: ov.raisins ?? activeCurrency.fitrahRaisinsPerKg,
        note: "Full Sa' Sunnah commodity",
      },
    ];
  }, [
    fitrahPriceOverrides,
    activeCurrency,
    zakatConfig.fitrahWheatKg,
    zakatConfig.fitrahOtherKg,
  ]);

  const selectedCommodity =
    fitrahCommodities.find((c) => c.id === fitrahCommodity) || fitrahCommodities[0];

  const totalFamilyMembers =
    Math.max(0, familyAdults) + Math.max(0, familyMinors) + Math.max(0, familyNewborns);
  const perPersonFitrah = selectedCommodity.kg * selectedCommodity.pricePerKg;
  const totalFamilyFitrah = perPersonFitrah * totalFamilyMembers;
  const totalFidyahDue = Math.max(0, fidyahMissedFasts) * perPersonFitrah;
  const kaffarahFast60Value = 60 * perPersonFitrah;
  const kaffarahOath10Value = 10 * perPersonFitrah;

  const ushrCalc = useMemo(() => {
    const grossValue =
      ushrInputMode === "value"
        ? Math.max(0, ushrHarvestValue)
        : Math.max(0, ushrHarvestKg) * Math.max(0, ushrPricePerKg);
    const ratePct = ushrIrrigation === "natural_10" ? 10 : 5;
    const dueValue = grossValue * (ratePct / 100);
    const dueKg =
      ushrInputMode === "quantity" ? Math.max(0, ushrHarvestKg) * (ratePct / 100) : null;
    return { grossValue, ratePct, dueValue, dueKg };
  }, [ushrInputMode, ushrHarvestValue, ushrHarvestKg, ushrPricePerKg, ushrIrrigation]);

  const filteredMasarif = useMemo(() => {
    const q = masarifSearch.trim().toLowerCase();
    return HANAFI_MASARIF_RULES.filter((card) => {
      if (masarifFilter !== "all" && card.status !== masarifFilter) return false;
      if (!q) return true;
      return (
        card.title.toLowerCase().includes(q) ||
        card.summary.toLowerCase().includes(q) ||
        card.fiqhDetail.toLowerCase().includes(q) ||
        card.keywords.toLowerCase().includes(q)
      );
    });
  }, [masarifSearch, masarifFilter]);

  /* ------------------------------------------------------------------------ */
  /* Vault Actions, Disbursement Logging & Report Export                      */
  /* ------------------------------------------------------------------------ */

  const addGoldRow = (
    presetLabel = "Gold Item",
    presetKarat: GoldKarat = "22K",
    presetGrams = 10
  ) => {
    const convertedWeight = Number(
      (presetGrams / UNIT_META[weightUnit].gramsFactor).toFixed(3)
    );
    setGoldItems((prev) => [
      ...prev,
      {
        id: `g-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
        label: presetLabel,
        weight: convertedWeight,
        karat: presetKarat,
      },
    ]);
  };

  const updateGoldRow = (id: string, patch: Partial<GoldVaultItem>) => {
    setGoldItems((prev) => prev.map((it) => (it.id === id ? { ...it, ...patch } : it)));
  };

  const removeGoldRow = (id: string) => {
    setGoldItems((prev) => prev.filter((it) => it.id !== id));
  };

  const handleSaveEncryptedSnapshot = async () => {
    const corePayload = {
      hijri: hijri.formatted,
      currency: activeCurrency.code,
      net: calc.netZakatableWealth,
      due: calc.zakatDue,
      paid: calc.totalPaid,
      ts: Date.now(),
    };
    const digest = (await sha256Hex(JSON.stringify(corePayload))).slice(0, 16);

    const newSnapshot: EncryptedZakatSnapshot = {
      id: `zk_snap_${Date.now()}`,
      createdAt: new Date().toISOString(),
      hijriDateFormatted: hijri.formatted,
      hawlLabel: `${hawlHijriDay} ${HIJRI_MONTHS[(hawlHijriMonth - 1 + 12) % 12]}`,
      currencyCode: activeCurrency.code,
      currencySymbol: activeCurrency.symbol,
      weightUnit,
      calendarBasis,
      goldRatePerGram: effectiveGoldPerGram,
      silverRatePerGram: effectiveSilverPerGram,
      grossAssets: calc.grossAssets,
      totalLiabilities: calc.totalLiabilities,
      netZakatableWealth: calc.netZakatableWealth,
      activeNisabType: calc.activeNisabType,
      activeNisabValue: calc.activeNisabValue,
      isSahibNisab: calc.isSahibNisab,
      zakatRatePercent: calc.zakatRatePercent,
      zakatDue: calc.zakatDue,
      totalPaid: calc.totalPaid,
      remainingDue: calc.remainingDue,
      sha256Digest: digest,
      cipherPreview: "AES-256-GCM",
      stateSnapshot: {
        goldItems,
        silver999,
        silver925,
        cashInHand,
        bankAccounts,
        foreignCurrency,
        tradeInventory,
        halalSharesValue,
        sharesMode,
        receivablesStrong,
        retirementAccessible,
        immediateDebts,
        supplierPayables,
        unpaidMahr,
        dueBillsTaxes,
        unpaidPriorZakat,
        disbursements,
      },
    };

    const nextList = [newSnapshot, ...vaultSnapshots].slice(0, 20);
    const encryptedBlob = await persistEncryptedEnvelope(nextList, disbursements);
    let ctSnippet = "AES-256-GCM";
    try {
      const parsed = JSON.parse(encryptedBlob) as { ct?: string };
      if (parsed.ct) ctSnippet = parsed.ct.slice(0, 22);
    } catch {
      // keep default label
    }
    const finalizedList = nextList.map((s, idx) =>
      idx === 0 ? { ...s, cipherPreview: ctSnippet } : s
    );
    await persistEncryptedEnvelope(finalizedList, disbursements);
    setVaultSnapshots(finalizedList);
    awardXp(xpZakatReward, "Encrypted Zakat Snapshot Saved");
    flashBanner("AES-256-GCM encrypted assessment saved privately on this device.");
  };

  const handleRestoreSnapshot = (snap: EncryptedZakatSnapshot) => {
    setCurrencyCode(snap.currencyCode);
    setWeightUnit(snap.weightUnit);
    setCalendarBasis(snap.calendarBasis);
    setRateOverrides((prev) => ({
      ...prev,
      [snap.currencyCode]: {
        goldPerGram24K: snap.goldRatePerGram,
        silverPerGram: snap.silverRatePerGram,
        source: "manual",
      },
    }));
    const s = snap.stateSnapshot;
    setGoldItems(s.goldItems);
    setSilver999(s.silver999);
    setSilver925(s.silver925);
    setCashInHand(s.cashInHand);
    setBankAccounts(s.bankAccounts);
    setForeignCurrency(s.foreignCurrency);
    setTradeInventory(s.tradeInventory);
    setHalalSharesValue(s.halalSharesValue);
    setSharesMode(s.sharesMode);
    setReceivablesStrong(s.receivablesStrong);
    setRetirementAccessible(s.retirementAccessible);
    setImmediateDebts(s.immediateDebts);
    setSupplierPayables(s.supplierPayables);
    setUnpaidMahr(s.unpaidMahr);
    setDueBillsTaxes(s.dueBillsTaxes);
    setUnpaidPriorZakat(s.unpaidPriorZakat);
    setDisbursements(s.disbursements);
    setActiveTab("calculator");
    flashBanner(`Restored ${snap.hijriDateFormatted} assessment into live Zakat Studio.`);
  };

  const handleDeleteSnapshot = async (id: string) => {
    const nextList = vaultSnapshots.filter((s) => s.id !== id);
    setVaultSnapshots(nextList);
    await persistEncryptedEnvelope(nextList, disbursements);
  };

  const handleLogDisbursement = async (e: React.FormEvent) => {
    e.preventDefault();
    const amt = Number(payAmount);
    if (!Number.isFinite(amt) || amt <= 0) return;

    const entry: DisbursementEntry = {
      id: `pay_${Date.now()}_${Math.random().toString(36).slice(2, 5)}`,
      recipient: payRecipient.trim() || payCategory,
      category: payCategory,
      date: payDate || todayIso,
      amount: amt,
      tamlikConfirmed: payTamlik,
    };

    const nextDisb = [entry, ...disbursements];
    setDisbursements(nextDisb);
    setPayAmount("");
    setPayRecipient("");
    await persistEncryptedEnvelope(vaultSnapshots, nextDisb);
    awardXp(
      Math.max(25, Math.round(xpZakatReward * 0.65)),
      `Zakat Disbursed: ${entry.category}`
    );
    flashBanner(
      `Recorded ${formatMoney(amt, activeCurrency.symbol)} Tamlik disbursement to ${entry.recipient}.`
    );
  };

  const handleDeleteDisbursement = async (id: string) => {
    const nextDisb = disbursements.filter((d) => d.id !== id);
    setDisbursements(nextDisb);
    await persistEncryptedEnvelope(vaultSnapshots, nextDisb);
  };

  const buildSummaryReportText = useCallback((): string => {
    const sym = activeCurrency.symbol;
    const lines = [
      "============================================================",
      "AULIYA SANCTUARY — HANAFI ZAKAT & CHARITY ASSESSMENT REPORT",
      "============================================================",
      `Generated Date : ${todayIso} (${hijri.formatted})`,
      `Hawl Date      : ${hawlHijriDay} ${HIJRI_MONTHS[(hawlHijriMonth - 1 + 12) % 12]}`,
      `Currency       : ${activeCurrency.code} (${activeCurrency.name})`,
      `Calendar Basis : ${
        calendarBasis === "lunar"
          ? `Hijri Lunar Year (${zakatConfig.lunarRatePercent}%)`
          : `Solar Year Equivalent (${zakatConfig.solarRatePercent}%)`
      }`,
      `Metal Rates    : 24K Gold ${sym}${effectiveGoldPerGram.toFixed(2)}/g | Silver ${sym}${effectiveSilverPerGram.toFixed(2)}/g`,
      "------------------------------------------------------------",
      "1. ZAKATABLE ASSETS (HANAFI FIQH)",
      `   • Gold Vault (${calc.totalPureGoldGrams.toFixed(2)}g pure 24K eq.) : ${formatMoney(calc.goldValue, sym)}`,
      `   • Silver Vault (${calc.pureSilverGrams.toFixed(2)}g pure 999 eq.): ${formatMoney(calc.silverValue, sym)}`,
      `   • Cash, Bank & Foreign Currency         : ${formatMoney(calc.cashTotal, sym)}`,
      `   • Trade Goods & Halal Shares            : ${formatMoney(calc.businessTotal, sym)}`,
      `   • Strong Receivables & Accessible PF    : ${formatMoney(calc.receivablesTotal, sym)}`,
      `   GROSS ZAKATABLE ASSETS                  : ${formatMoney(calc.grossAssets, sym)}`,
      "------------------------------------------------------------",
      "2. DEDUCTIBLE IMMEDIATE LIABILITIES",
      `   • Total Due Debts, Payables, Mahr, Bills: -${formatMoney(calc.totalLiabilities, sym)}`,
      "------------------------------------------------------------",
      "3. NISAB & ZAKAT OBLIGATION",
      `   • Active Nisab Rule : ${
        calc.onlyPureGold
          ? `Gold Nisab (${zakatConfig.goldNisabGrams}g — Pure Gold Only)`
          : `Silver Nisab (${zakatConfig.silverNisabGrams}g — Hanafi Dhamm / Anfa' lil-Fuqara)`
      }`,
      `   • Nisab Threshold   : ${formatMoney(calc.activeNisabValue, sym)}`,
      `   • Net Wealth        : ${formatMoney(calc.netZakatableWealth, sym)}`,
      `   • Status            : ${calc.isSahibNisab ? "SAHIB-UN-NISAB (Zakat Wajib)" : "Below Nisab (Exempt)"}`,
      `   • Total Zakat Due   : ${formatMoney(calc.zakatDue, sym)}`,
      `   • Disbursed So Far  : ${formatMoney(calc.totalPaid, sym)}`,
      `   • Remaining Balance : ${formatMoney(calc.remainingDue, sym)}`,
      "------------------------------------------------------------",
      `4. DISBURSEMENT LEDGER (${disbursements.length} entries)`,
      ...(disbursements.length === 0
        ? ["   (No installments logged yet)"]
        : disbursements.map(
            (d, idx) =>
              `   ${idx + 1}. [${d.date}] ${d.recipient} (${d.category}) — ${formatMoney(d.amount, sym)}${
                d.tamlikConfirmed ? " [Tamlik Confirmed]" : ""
              }`
          )),
      "============================================================",
      "Note: Zakat & Fitrah require unconditional Tamlik to eligible non-Hashimi poor Muslims.",
      "Sadat (Ahl al-Bayt ﷺ) are honored with unconditional Hadiya, never Zakat.",
    ];
    return lines.join("\n");
  }, [
    todayIso,
    activeCurrency,
    hijri.formatted,
    hawlHijriDay,
    hawlHijriMonth,
    calendarBasis,
    zakatConfig.lunarRatePercent,
    zakatConfig.solarRatePercent,
    zakatConfig.goldNisabGrams,
    zakatConfig.silverNisabGrams,
    effectiveGoldPerGram,
    effectiveSilverPerGram,
    calc,
    disbursements,
  ]);

  const handleCopyReport = async () => {
    const report = buildSummaryReportText();
    try {
      await navigator.clipboard.writeText(report);
      setCopiedReport(true);
      setTimeout(() => setCopiedReport(false), 2600);
      flashBanner("Copied formatted Hanafi Zakat Summary Report to clipboard.");
    } catch {
      flashBanner("Clipboard unavailable in this browser context — use Download Report instead.");
    }
  };

  const handleDownloadReport = () => {
    const report = buildSummaryReportText();
    const blob = new Blob([report], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hanafi-zakat-summary-${todayIso}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    flashBanner("Downloaded Zakat Summary Report (.txt).");
  };

  const sym = activeCurrency.symbol;
  const silverTolaDisplay = (zakatConfig.silverNisabGrams / 11.664).toFixed(1);
  const goldTolaDisplay = (zakatConfig.goldNisabGrams / 11.664).toFixed(1);

  const studioTabs: {
    id: StudioTab;
    label: string;
    shortBadge: string;
    icon: React.ComponentType<{ className?: string }>;
  }[] = [
    {
      id: "calculator",
      label: "Zakat Calculator",
      shortBadge: calc.isSahibNisab ? "Wajib" : "Nisab",
      icon: Calculator,
    },
    {
      id: "ledger",
      label: "Hawl & Payment Ledger",
      shortBadge: `${disbursements.length} Paid`,
      icon: History,
    },
    {
      id: "fitrah",
      label: "Fitrah, Fidyah & Kaffarah",
      shortBadge: `${zakatConfig.fitrahWheatKg}kg`,
      icon: Wheat,
    },
    {
      id: "ushr",
      label: "Ushr & Masarif Guide",
      shortBadge: "10% / 5%",
      icon: Sprout,
    },
  ];

  return (
    <div className="space-y-6 pb-10">
      {/* ------------------------------------------------------------------ */}
      {/* Hero Sanctuary Studio Banner & Global Benchmark Deck               */}
      {/* ------------------------------------------------------------------ */}
      <section className="sanctuary-halo-card p-5 sm:p-6 space-y-5 relative overflow-hidden">
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="badge-pill badge-gold">
                <Scale className="w-3.5 h-3.5" />
                <span>
                  Hanafi Silver Nisab • {silverTolaDisplay} Tola ({zakatConfig.silverNisabGrams}g)
                </span>
              </span>
              <span
                className="badge-pill"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-primary)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>AES-256-GCM Zero-Knowledge Vault</span>
              </span>
              <span
                className="badge-pill"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <Award className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                <span>
                  {currentRank.title} • {totalXp.toLocaleString()} XP (+{xpZakatReward} XP)
                </span>
              </span>
            </div>

            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {t(lang, "navZakat")} — Fiqh-Verified Wealth &amp; Charity Studio
            </h1>
            <p
              className="text-xs sm:text-sm max-w-3xl leading-relaxed"
              style={{ color: "var(--text-secondary)" }}
            >
              Authoritative Sunni Hanafi calculator for annual Zakat (<em>Dhamm</em> &amp;{" "}
              <em>Anfa&apos; lil-Fuqara</em> Silver Nisab), Hijri Hawl installment tracking,
              Ramadan Sadaqat-ul-Fitr, <em>Shaykh Fani</em> Fidyah, agricultural Ushr, and{" "}
              <em>Tamlik</em> recipient verification.
            </p>
          </div>

          {/* Live Benchmark Action */}
          <div className="flex flex-wrap items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handleFetchLiveSpot}
              disabled={spotLoading}
              className="btn-primary px-4 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${spotLoading ? "animate-spin" : ""}`} />
              <span>{spotLoading ? "Syncing FX Rates..." : "Fetch Live Spot Benchmark"}</span>
            </button>

            {activeOverride && (
              <button
                type="button"
                onClick={handleResetBenchmark}
                aria-label="Reset currency rates to CMS benchmark"
                className="px-3 py-2.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Rate</span>
              </button>
            )}
          </div>
        </div>

        {/* Global Currency, Weight Unit, Calendar Basis & Manual Jeweler Rate Deck */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-3 pt-4 border-t"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          {/* Currency Selector */}
          <div className="xl:col-span-3 space-y-1.5">
            <label
              htmlFor="zakat-currency-select"
              className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              <Globe className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
              <span>Active Currency (CMS)</span>
            </label>
            <select
              id="zakat-currency-select"
              value={activeCurrency.code}
              onChange={(e) => {
                setCurrencyCode(e.target.value);
                setSpotMessage(null);
              }}
              className="ui-select w-full px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
              }}
            >
              {zakatConfig.currencies.map((c) => (
                <option
                  key={c.code}
                  value={c.code}
                  style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                >
                  {c.code} ({c.symbol.trim()}) — {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Weight Unit Switcher */}
          <div className="xl:col-span-3 space-y-1.5">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              <Coins className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
              <span>Bullion Weight Unit</span>
            </span>
            <div
              className="grid grid-cols-3 p-1 rounded-xl border gap-1"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              {(["grams", "tola", "oz"] as WeightUnit[]).map((u) => {
                const active = weightUnit === u;
                return (
                  <button
                    key={u}
                    type="button"
                    onClick={() => handleWeightUnitChange(u)}
                    className="py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer truncate"
                    style={{
                      backgroundColor: active ? "var(--accent-primary)" : "transparent",
                      color: active ? "#ffffff" : "var(--text-secondary)",
                    }}
                  >
                    {u === "grams" ? "Grams" : u === "tola" ? "Tola" : "Troy Oz"}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Calendar Basis Switcher */}
          <div className="xl:col-span-2 space-y-1.5">
            <span
              className="text-[11px] font-semibold uppercase tracking-wider flex items-center gap-1.5"
              style={{ color: "var(--text-muted)" }}
            >
              <Calendar className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
              <span>Year Basis</span>
            </span>
            <div
              className="grid grid-cols-2 p-1 rounded-xl border gap-1"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              <button
                type="button"
                onClick={() => setCalendarBasis("lunar")}
                className="py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer truncate"
                style={{
                  backgroundColor:
                    calendarBasis === "lunar" ? "var(--accent-primary)" : "transparent",
                  color: calendarBasis === "lunar" ? "#ffffff" : "var(--text-secondary)",
                }}
                title={`Hijri Lunar Year (${zakatConfig.lunarRatePercent}%)`}
              >
                Lunar {zakatConfig.lunarRatePercent}%
              </button>
              <button
                type="button"
                onClick={() => setCalendarBasis("solar")}
                className="py-1.5 px-2 rounded-lg text-[11px] font-semibold transition-all cursor-pointer truncate"
                style={{
                  backgroundColor:
                    calendarBasis === "solar" ? "var(--accent-primary)" : "transparent",
                  color: calendarBasis === "solar" ? "#ffffff" : "var(--text-secondary)",
                }}
                title={`Solar Year Equivalent (${zakatConfig.solarRatePercent}%)`}
              >
                Solar {zakatConfig.solarRatePercent}%
              </button>
            </div>
          </div>

          {/* Manual Jeweler Rate: 24K Gold per Active Unit */}
          <div className="xl:col-span-2 space-y-1.5">
            <label
              htmlFor="gold-rate-input"
              className="text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between"
              style={{ color: "var(--text-muted)" }}
            >
              <span>24K Gold / {unitMeta.shortLabel}</span>
              <span className="tabular-nums" style={{ color: "var(--accent-gold)" }}>
                {sym}
                {effectiveGoldPerGram.toFixed(2)}/g
              </span>
            </label>
            <input
              id="gold-rate-input"
              type="number"
              min={0}
              step="any"
              value={displayedGoldPerUnit}
              onChange={(e) => handleManualGoldRateChange(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border text-xs font-bold tabular-nums outline-none"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
              }}
            />
          </div>

          {/* Manual Jeweler Rate: Fine Silver per Active Unit */}
          <div className="xl:col-span-2 space-y-1.5">
            <label
              htmlFor="silver-rate-input"
              className="text-[11px] font-semibold uppercase tracking-wider flex items-center justify-between"
              style={{ color: "var(--text-muted)" }}
            >
              <span>Silver / {unitMeta.shortLabel}</span>
              <span className="tabular-nums" style={{ color: "var(--accent-primary)" }}>
                {sym}
                {effectiveSilverPerGram.toFixed(2)}/g
              </span>
            </label>
            <input
              id="silver-rate-input"
              type="number"
              min={0}
              step="any"
              value={displayedSilverPerUnit}
              onChange={(e) => handleManualSilverRateChange(Number(e.target.value))}
              className="w-full px-3 py-2 rounded-xl border text-xs font-bold tabular-nums outline-none"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--text-primary)",
              }}
            />
          </div>
        </div>

        {/* Live FX / Action Status Strip */}
        <AnimatePresence mode="wait">
          {(spotMessage || statusBanner) && (
            <motion.div
              key={statusBanner || spotMessage?.text}
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="px-3.5 py-2.5 rounded-xl border text-xs flex items-center gap-2"
              style={{
                borderColor:
                  spotMessage?.tone === "gold" && !statusBanner
                    ? "var(--accent-gold)"
                    : "var(--accent-primary)",
                backgroundColor:
                  spotMessage?.tone === "gold" && !statusBanner
                    ? "var(--gold-soft)"
                    : "var(--accent-soft)",
                color: "var(--text-primary)",
              }}
            >
              <Sparkles
                className="w-4 h-4 shrink-0"
                style={{
                  color:
                    spotMessage?.tone === "gold" && !statusBanner
                      ? "var(--accent-gold)"
                      : "var(--accent-primary)",
                }}
              />
              <span>{statusBanner || spotMessage?.text}</span>
            </motion.div>
          )}
        </AnimatePresence>
      </section>

      {/* ------------------------------------------------------------------ */}
      {/* 4 Interactive Animated Studio Tabs                                 */}
      {/* ------------------------------------------------------------------ */}
      <nav
        aria-label="Hanafi Zakat Studio Sections"
        className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 p-1.5 rounded-2xl border"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor: "var(--border-hairline)",
        }}
      >
        {studioTabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className="relative px-3.5 py-3 rounded-xl text-left transition-colors cursor-pointer flex items-center justify-between gap-2 overflow-hidden"
              style={{
                color: isActive ? "#ffffff" : "var(--text-secondary)",
              }}
            >
              {isActive && (
                <motion.div
                  layoutId="zakat-studio-active-tab"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  className="absolute inset-0 rounded-xl"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                />
              )}
              <span className="relative z-10 flex items-center gap-2 font-semibold text-xs sm:text-sm truncate">
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate">{tab.label}</span>
              </span>
              <span
                className="relative z-10 text-[10px] font-bold px-2 py-0.5 rounded-full tabular-nums shrink-0 hidden sm:inline-block"
                style={{
                  backgroundColor: isActive ? "rgba(255,255,255,0.22)" : "var(--bg-muted)",
                  color: isActive ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {tab.shortBadge}
              </span>
            </button>
          );
        })}
      </nav>

      {/* ------------------------------------------------------------------ */}
      {/* Animated Tab Viewport                                              */}
      {/* ------------------------------------------------------------------ */}
      <AnimatePresence mode="wait">
        {/* ================================================================ */}
        {/* TAB 1: ZAKAT CALCULATOR                                          */}
        {/* ================================================================ */}
        {activeTab === "calculator" && (
          <motion.div
            key="tab-calculator"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Hanafi Vaults, Liquid Assets & Deductible Liabilities */}
            <div className="lg:col-span-7 space-y-5">
              {/* 1A. Itemized Multi-Karat Gold Vault */}
              <section className="bento-card p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Coins className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                      <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                        Itemized Multi-Karat Gold Vault
                      </h2>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      In the Hanafi Madhhab, personal gold jewelry (even worn daily) is zakatable
                      by pure metal content. Exclude non-gold precious stones.
                    </p>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="text-xs font-semibold" style={{ color: "var(--accent-gold)" }}>
                      {calc.totalPureGoldGrams.toFixed(2)}g Pure 24K Eq.
                    </div>
                    <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {formatMoney(calc.goldValue, sym)}
                    </div>
                  </div>
                </div>

                {/* Quick-Add Presets */}
                <div className="flex flex-wrap items-center gap-1.5">
                  {[
                    { label: "Wife's Jewelry", karat: "22K" as GoldKarat, grams: 35 },
                    { label: "Gold Coins (Ashrafi)", karat: "24K" as GoldKarat, grams: 11.664 },
                    { label: "Bullion Bar", karat: "24K" as GoldKarat, grams: 31.1035 },
                    { label: "18K Gift Ring/Watch", karat: "18K" as GoldKarat, grams: 12 },
                  ].map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => addGoldRow(preset.label, preset.karat, preset.grams)}
                      className="px-2.5 py-1 rounded-full border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Plus className="w-3 h-3" style={{ color: "var(--accent-gold)" }} />
                      <span>{preset.label}</span>
                    </button>
                  ))}
                </div>

                {/* Gold Item Rows */}
                <div className="space-y-2.5">
                  {calc.itemizedGold.length === 0 ? (
                    <div
                      className="p-4 rounded-xl border text-center text-xs"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-muted)",
                      }}
                    >
                      No gold items in vault. Click &ldquo;Add Gold Holding Row&rdquo; below if you
                      own jewelry, coins, or bullion.
                    </div>
                  ) : (
                    calc.itemizedGold.map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-xl border grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-elevated)",
                        }}
                      >
                        <div className="sm:col-span-5">
                          <input
                            type="text"
                            aria-label="Gold item description"
                            value={item.label}
                            onChange={(e) => updateGoldRow(item.id, { label: e.target.value })}
                            placeholder="Item label (e.g., Bridal Set)"
                            className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-medium bg-transparent outline-none"
                            style={{
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-primary)",
                            }}
                          />
                        </div>

                        <div className="sm:col-span-3 flex items-center gap-1.5">
                          <input
                            type="number"
                            aria-label={`Weight in ${unitMeta.label}`}
                            min={0}
                            step="any"
                            value={item.weight}
                            onChange={(e) =>
                              updateGoldRow(item.id, {
                                weight: Math.max(0, Number(e.target.value) || 0),
                              })
                            }
                            className="w-full px-2.5 py-1.5 rounded-lg border text-xs font-semibold tabular-nums bg-transparent outline-none"
                            style={{
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-primary)",
                            }}
                          />
                          <span
                            className="text-[11px] font-semibold shrink-0"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {unitMeta.shortLabel}
                          </span>
                        </div>

                        <div className="sm:col-span-2">
                          <select
                            aria-label="Gold karat purity"
                            value={item.karat}
                            onChange={(e) =>
                              updateGoldRow(item.id, { karat: e.target.value as GoldKarat })
                            }
                            className="ui-select w-full px-2.5 py-1.5 rounded-lg border text-xs font-bold outline-none cursor-pointer"
                            style={{
                              borderColor: "var(--border-hairline)",
                              backgroundColor: "var(--bg-surface)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {GOLD_KARATS.map((k) => (
                              <option
                                key={k}
                                value={k}
                                style={{
                                  backgroundColor: "var(--bg-surface)",
                                  color: "var(--text-primary)",
                                }}
                              >
                                {k}
                              </option>
                            ))}
                          </select>
                        </div>

                        <div className="sm:col-span-2 flex items-center justify-between sm:justify-end gap-2">
                          <div className="text-right tabular-nums">
                            <div
                              className="text-[11px] font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {formatMoney(item.value, sym, 0)}
                            </div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {item.pure24KGrams.toFixed(2)}g 24K
                            </div>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${item.label || "gold item"}`}
                            onClick={() => removeGoldRow(item.id)}
                            className="p-1.5 rounded-lg border cursor-pointer transition-opacity hover:opacity-80"
                            style={{
                              borderColor: "var(--border-hairline)",
                              color: "var(--accent-danger)",
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

                <button
                  type="button"
                  onClick={() => addGoldRow("Additional Gold Holding", "22K", 10)}
                  className="w-full py-2 rounded-xl border border-dashed text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
                  style={{
                    borderColor: "var(--accent-gold)",
                    color: "var(--accent-gold)",
                    backgroundColor: "var(--gold-soft)",
                  }}
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Gold Holding Row</span>
                </button>
              </section>

              {/* 1B. Silver Vault (999 Fine & 925 Sterling) */}
              <section className="bento-card p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                      <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                        Silver Vault (Chandi Coins, Bars &amp; Ornaments)
                      </h2>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Separate 999 Fine Bullion/Coins (100%) and 925 Sterling Silverware/Jewelry
                      (92.5% silver purity).
                    </p>
                  </div>
                  <div className="text-right tabular-nums">
                    <div className="text-xs font-semibold" style={{ color: "var(--accent-primary)" }}>
                      {calc.pureSilverGrams.toFixed(2)}g Pure Silver Eq.
                    </div>
                    <div className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      {formatMoney(calc.silverValue, sym)}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1.5">
                    <label
                      htmlFor="silver-999-input"
                      className="block font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Fine Silver 999 ({unitMeta.label})
                    </label>
                    <input
                      id="silver-999-input"
                      type="number"
                      min={0}
                      step="any"
                      value={silver999}
                      onChange={(e) => setSilver999(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2.5 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <div className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                      {calc.silver999Grams.toFixed(2)}g pure •{" "}
                      {formatMoney(calc.silver999Grams * effectiveSilverPerGram, sym)}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label
                      htmlFor="silver-925-input"
                      className="block font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Sterling Silver 925 ({unitMeta.label})
                    </label>
                    <input
                      id="silver-925-input"
                      type="number"
                      min={0}
                      step="any"
                      value={silver925}
                      onChange={(e) => setSilver925(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2.5 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <div className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                      {(calc.silver925Grams * 0.925).toFixed(2)}g pure eq. •{" "}
                      {formatMoney(calc.silver925Grams * 0.925 * effectiveSilverPerGram, sym)}
                    </div>
                  </div>
                </div>
              </section>

              {/* 1C. Liquid, Business & Investment Assets */}
              <section className="bento-card p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Landmark className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                      <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                        Liquid Cash, Business Inventory &amp; Halal Investments
                      </h2>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Enter balances held on your Hawl valuation day (excluding unlawful bank
                      interest, which is given away without intention of reward).
                    </p>
                  </div>
                  <div
                    className="text-sm font-bold tabular-nums"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {formatMoney(
                      calc.cashTotal + calc.businessTotal + calc.receivablesTotal,
                      sym
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Cash in Hand / Safe ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={cashInHand}
                      onChange={(e) => setCashInHand(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2.5 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Bank Accounts — Savings &amp; Current ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={bankAccounts}
                      onChange={(e) => setBankAccounts(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2.5 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Foreign Currency Equivalent ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={foreignCurrency}
                      onChange={(e) => setForeignCurrency(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2.5 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Business Inventory / Mal-e-Tijarah ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={tradeInventory}
                      onChange={(e) => setTradeInventory(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2.5 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  {/* Halal Shares / Mutual Funds with 100% vs 30% Toggle */}
                  <div
                    className="sm:col-span-2 p-3.5 rounded-xl border space-y-2.5"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <label
                        className="font-semibold flex items-center gap-1.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <TrendingUp
                          className="w-3.5 h-3.5"
                          style={{ color: "var(--accent-primary)" }}
                        />
                        <span>Halal Shares / Islamic Equity Mutual Funds ({sym})</span>
                      </label>
                      <span
                        className="text-[11px] font-bold tabular-nums"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        Zakatable Portion: {formatMoney(calc.effectiveSharesValue, sym)}
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
                      <div className="sm:col-span-5">
                        <input
                          type="number"
                          min={0}
                          step="any"
                          value={halalSharesValue}
                          onChange={(e) =>
                            setHalalSharesValue(Math.max(0, Number(e.target.value) || 0))
                          }
                          placeholder="Portfolio market value"
                          className="w-full px-3 py-2 rounded-lg border font-semibold tabular-nums outline-none"
                          style={{
                            borderColor: "var(--border-hairline)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>

                      <div className="sm:col-span-7 grid grid-cols-2 gap-1.5">
                        <button
                          type="button"
                          onClick={() => setSharesMode("trading_100")}
                          className="px-2.5 py-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all text-center"
                          style={{
                            borderColor:
                              sharesMode === "trading_100"
                                ? "var(--accent-primary)"
                                : "var(--border-hairline)",
                            backgroundColor:
                              sharesMode === "trading_100"
                                ? "var(--accent-soft)"
                                : "var(--bg-surface)",
                            color:
                              sharesMode === "trading_100"
                                ? "var(--accent-primary)"
                                : "var(--text-secondary)",
                          }}
                        >
                          Active Trading (100%)
                        </button>
                        <button
                          type="button"
                          onClick={() => setSharesMode("longterm_30")}
                          className="px-2.5 py-2 rounded-lg border text-[11px] font-semibold cursor-pointer transition-all text-center"
                          style={{
                            borderColor:
                              sharesMode === "longterm_30"
                                ? "var(--accent-primary)"
                                : "var(--border-hairline)",
                            backgroundColor:
                              sharesMode === "longterm_30"
                                ? "var(--accent-soft)"
                                : "var(--bg-surface)",
                            color:
                              sharesMode === "longterm_30"
                                ? "var(--accent-primary)"
                                : "var(--text-secondary)",
                          }}
                        >
                          Long-Term Proxy (30%)
                        </button>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Strong/Medium Receivables — Dayn Qawi ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={receivablesStrong}
                      onChange={(e) =>
                        setReceivablesStrong(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Accessible Retirement / PF Savings ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={retirementAccessible}
                      onChange={(e) =>
                        setRetirementAccessible(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              </section>

              {/* 1D. Deductible Hanafi Liabilities */}
              <section className="bento-card p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <Briefcase className="w-4 h-4" style={{ color: "var(--accent-danger)" }} />
                      <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                        Deductible Hanafi Liabilities
                      </h2>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Deduct immediate debts due now (or current lunar year&apos;s principal
                      installments on long-term financing), supplier payables, demanded Mahr, and
                      unpaid prior Zakat.
                    </p>
                  </div>
                  <div
                    className="text-sm font-bold tabular-nums"
                    style={{ color: "var(--accent-danger)" }}
                  >
                    −{formatMoney(calc.totalLiabilities, sym)}
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Immediate Debts Due ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={immediateDebts}
                      onChange={(e) => setImmediateDebts(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Supplier / Trade Payables ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={supplierPayables}
                      onChange={(e) =>
                        setSupplierPayables(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Unpaid Demanded Mahr ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={unpaidMahr}
                      onChange={(e) => setUnpaidMahr(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Due Bills, Rent &amp; Taxes ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={dueBillsTaxes}
                      onChange={(e) => setDueBillsTaxes(Math.max(0, Number(e.target.value) || 0))}
                      className="w-full px-3 py-2 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Unpaid Prior Years&apos; Zakat Obligations ({sym})
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={unpaidPriorZakat}
                      onChange={(e) =>
                        setUnpaidPriorZakat(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2 rounded-xl border font-semibold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              </section>
            </div>

            {/* Right Column: Dramatic Visual Telemetry Panel */}
            <aside className="lg:col-span-5 space-y-5 lg:sticky lg:top-20">
              {/* Hero Zakat Obligation Card */}
              <div className="quran-gradient-card p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/20 text-white inline-flex items-center gap-1.5">
                    <Wallet className="w-3.5 h-3.5" />
                    <span>
                      {calc.isSahibNisab
                        ? `${calc.zakatRatePercent}% Zakat Wajib`
                        : "Below Nisab — Exempt"}
                    </span>
                  </span>
                  <span className="text-xs font-medium text-white/85 tabular-nums">
                    {calendarBasis === "lunar" ? "Hijri Lunar (354d)" : "Solar Year (365d)"}
                  </span>
                </div>

                <div>
                  <div className="text-xs text-white/80 font-medium">Annual Zakat Obligation</div>
                  <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white mt-0.5">
                    {formatMoney(calc.zakatDue, sym)}
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-white/20 text-xs tabular-nums">
                  <div>
                    <div className="text-white/75 text-[11px]">Net Zakatable</div>
                    <div className="font-bold text-white truncate">
                      {formatMoney(calc.netZakatableWealth, sym, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/75 text-[11px]">Paid So Far</div>
                    <div className="font-bold text-white truncate">
                      {formatMoney(calc.totalPaid, sym, 0)}
                    </div>
                  </div>
                  <div>
                    <div className="text-white/75 text-[11px]">Remaining</div>
                    <div className="font-bold text-white truncate">
                      {formatMoney(calc.remainingDue, sym, 0)}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleSaveEncryptedSnapshot}
                    className="flex-1 py-2.5 px-4 rounded-xl bg-white text-slate-900 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shadow-md hover:opacity-95 transition-opacity"
                  >
                    <Lock className="w-3.5 h-3.5" />
                    <span>Save Encrypted Snapshot (+{xpZakatReward} XP)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("ledger")}
                    className="py-2.5 px-3.5 rounded-xl bg-white/20 text-white text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer hover:bg-white/25 transition-colors"
                  >
                    <History className="w-3.5 h-3.5" />
                    <span>Log Payment</span>
                  </button>
                </div>
              </div>

              {/* Animated Nisab Threshold Gauge */}
              <div className="bento-card p-5 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Scale className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                    <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                      Hanafi Nisab Threshold Gauge
                    </h3>
                  </div>
                  <span
                    className={`badge-pill ${calc.isSahibNisab ? "badge-emerald" : "badge-gold"}`}
                  >
                    {calc.isSahibNisab ? "Sahib-un-Nisab" : "Below Nisab"}
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-xs tabular-nums">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Active:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        {calc.onlyPureGold
                          ? `Gold Nisab (${zakatConfig.goldNisabGrams}g / ${goldTolaDisplay} Tola)`
                          : `Silver Nisab (${zakatConfig.silverNisabGrams}g / ${silverTolaDisplay} Tola)`}
                      </strong>
                    </span>
                    <span className="font-bold" style={{ color: "var(--accent-primary)" }}>
                      {formatMoney(calc.activeNisabValue, sym)}
                    </span>
                  </div>

                  <div
                    className="h-3 w-full rounded-full overflow-hidden p-0.5"
                    style={{ backgroundColor: "var(--bg-muted)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(100, calc.nisabProgressPct)}%` }}
                      transition={{ type: "spring", stiffness: 120, damping: 20 }}
                      className="h-full rounded-full"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    />
                  </div>

                  <div
                    className="flex items-center justify-between text-[11px] tabular-nums"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Net Wealth: {formatMoney(calc.netZakatableWealth, sym)}</span>
                    <span>
                      {calc.activeNisabValue > 0
                        ? `${((calc.netZakatableWealth / calc.activeNisabValue) * 100).toFixed(0)}% of Nisab`
                        : "0%"}
                    </span>
                  </div>
                </div>

                {/* Silver vs Gold Reference Pills */}
                <div className="grid grid-cols-2 gap-2 text-[11px] tabular-nums">
                  <div
                    className="p-2.5 rounded-xl border"
                    style={{
                      borderColor: !calc.onlyPureGold
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                      backgroundColor: !calc.onlyPureGold
                        ? "var(--accent-soft)"
                        : "var(--bg-elevated)",
                    }}
                  >
                    <div className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Silver Nisab ({silverTolaDisplay} Tola)
                    </div>
                    <div
                      className="font-bold text-xs mt-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatMoney(calc.silverNisabValue, sym)}
                    </div>
                  </div>

                  <div
                    className="p-2.5 rounded-xl border"
                    style={{
                      borderColor: calc.onlyPureGold
                        ? "var(--accent-gold)"
                        : "var(--border-hairline)",
                      backgroundColor: calc.onlyPureGold
                        ? "var(--gold-soft)"
                        : "var(--bg-elevated)",
                    }}
                  >
                    <div className="font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Gold Nisab ({goldTolaDisplay} Tola)
                    </div>
                    <div
                      className="font-bold text-xs mt-0.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatMoney(calc.goldNisabValue, sym)}
                    </div>
                  </div>
                </div>

                {/* Dhamm & Anfa' lil-Fuqara Scholarly Explanation */}
                <div
                  className="p-3 rounded-xl border text-[11px] leading-relaxed"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                    color: "var(--text-secondary)",
                  }}
                >
                  <strong style={{ color: "var(--accent-gold)" }}>
                    Hanafi Dhamm &amp; Anfa&apos; lil-Fuqara Rule:{" "}
                  </strong>
                  {calc.onlyPureGold
                    ? `Because you hold pure gold alone with zero silver, cash, or trade assets, the Gold Nisab (${zakatConfig.goldNisabGrams}g) applies.`
                    : `Whenever cash, bank savings, silver, trade inventory, or receivables are held (alone or alongside gold), Hanafi Fiqh aggregates all assets by value under the Silver Nisab (${zakatConfig.silverNisabGrams}g) as most beneficial to the poor.`}
                </div>
              </div>

              {/* Interactive SVG Asset Breakdown Donut Chart */}
              <div className="bento-card p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Gross Zakatable Portfolio Breakdown
                  </h3>
                  <span
                    className="text-xs font-bold tabular-nums"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {formatMoney(calc.grossAssets, sym, 0)}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row items-center gap-5">
                  <div className="relative w-40 h-40 shrink-0">
                    <svg viewBox="0 0 160 160" className="w-full h-full">
                      <circle
                        cx={80}
                        cy={80}
                        r={60}
                        fill="transparent"
                        stroke="var(--bg-muted)"
                        strokeWidth={16}
                      />
                      {calc.grossAssets > 0 &&
                        donutSegments.map(
                          (seg) =>
                            seg.value > 0 && (
                              <circle
                                key={seg.id}
                                cx={80}
                                cy={80}
                                r={60}
                                fill="transparent"
                                stroke={seg.color}
                                strokeWidth={activeDonutId === seg.id ? 21 : 16}
                                strokeDasharray={`${seg.dash} ${seg.circumference}`}
                                strokeDashoffset={seg.offset}
                                transform="rotate(-90 80 80)"
                                className="transition-all duration-300 cursor-pointer"
                                onMouseEnter={() => setActiveDonutId(seg.id)}
                                onMouseLeave={() => setActiveDonutId(null)}
                                onClick={() =>
                                  setActiveDonutId((curr) => (curr === seg.id ? null : seg.id))
                                }
                              />
                            )
                        )}
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-3 pointer-events-none">
                      <span
                        className="text-[10px] font-semibold uppercase tracking-wider truncate max-w-full"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {focusedDonutSeg ? focusedDonutSeg.label : "Gross Assets"}
                      </span>
                      <span
                        className="text-xs font-extrabold tabular-nums truncate max-w-full"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {focusedDonutSeg
                          ? formatMoney(focusedDonutSeg.value, sym, 0)
                          : formatMoney(calc.grossAssets, sym, 0)}
                      </span>
                      {focusedDonutSeg && (
                        <span
                          className="text-[10px] font-bold tabular-nums"
                          style={{ color: focusedDonutSeg.color }}
                        >
                          {focusedDonutSeg.pct.toFixed(1)}%
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Interactive Legend */}
                  <div className="flex-1 w-full space-y-1.5 text-xs">
                    {donutSegments.map((seg) => {
                      const highlighted = activeDonutId === seg.id;
                      return (
                        <button
                          key={seg.id}
                          type="button"
                          onMouseEnter={() => setActiveDonutId(seg.id)}
                          onMouseLeave={() => setActiveDonutId(null)}
                          onClick={() =>
                            setActiveDonutId((curr) => (curr === seg.id ? null : seg.id))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg flex items-center justify-between gap-2 cursor-pointer transition-colors"
                          style={{
                            backgroundColor: highlighted ? "var(--bg-elevated)" : "transparent",
                          }}
                        >
                          <span className="flex items-center gap-2 truncate">
                            <span
                              className="w-2.5 h-2.5 rounded-full shrink-0"
                              style={{ backgroundColor: seg.color }}
                            />
                            <span
                              className="font-medium truncate"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {seg.label}
                            </span>
                          </span>
                          <span
                            className="tabular-nums font-semibold shrink-0"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {formatMoney(seg.value, sym, 0)}{" "}
                            <span className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              ({seg.pct.toFixed(0)}%)
                            </span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>
            </aside>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/* TAB 2: HAWL & PAYMENT LEDGER                                     */}
        {/* ================================================================ */}
        {activeTab === "ledger" && (
          <motion.div
            key="tab-ledger"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Hijri Hawl Countdown + Installment Disbursement Logger */}
            <div className="lg:col-span-7 space-y-5">
              {/* Hijri Hawl Anniversary Card */}
              <section className="bento-card p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                      <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                        Hijri Hawl Anniversary &amp; Lunar Countdown
                      </h2>
                    </div>
                    <p
                      className="text-xs mt-1 leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Today is{" "}
                      <strong style={{ color: "var(--text-primary)" }}>{hijri.formatted}</strong>.
                      In Hanafi Fiqh, your Hawl begins on the lunar date your wealth first reached
                      Nisab and completes 354 days later.
                    </p>
                  </div>

                  <div
                    className="px-3.5 py-2 rounded-xl border text-right tabular-nums"
                    style={{
                      borderColor: hawlTelemetry.isToday
                        ? "var(--accent-gold)"
                        : "var(--border-hairline)",
                      backgroundColor: hawlTelemetry.isToday
                        ? "var(--gold-soft)"
                        : "var(--bg-elevated)",
                    }}
                  >
                    <div
                      className="text-[10px] font-semibold uppercase"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {hawlTelemetry.isToday ? "Hawl Due Today!" : "Countdown to Hawl"}
                    </div>
                    <div
                      className="text-xl font-extrabold"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {hawlTelemetry.daysRemaining} Days
                    </div>
                    <div className="text-[10px]" style={{ color: "var(--text-secondary)" }}>
                      ~{hawlTelemetry.approxGregorian}
                    </div>
                  </div>
                </div>

                {/* Hawl Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end text-xs">
                  <div className="sm:col-span-3 space-y-1">
                    <label
                      htmlFor="hawl-day-input"
                      className="block font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Hijri Day (1–30)
                    </label>
                    <input
                      id="hawl-day-input"
                      type="number"
                      min={1}
                      max={30}
                      value={hawlHijriDay}
                      onChange={(e) =>
                        setHawlDate(
                          hawlHijriMonth,
                          Math.max(1, Math.min(30, Number(e.target.value) || 1))
                        )
                      }
                      className="w-full px-3 py-2.5 rounded-xl border font-bold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="sm:col-span-5 space-y-1">
                    <label
                      htmlFor="hawl-month-select"
                      className="block font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Hijri Month ({hawlTelemetry.monthDisplay})
                    </label>
                    <select
                      id="hawl-month-select"
                      value={hawlHijriMonth}
                      onChange={(e) => setHawlDate(Number(e.target.value), hawlHijriDay)}
                      className="ui-select w-full px-3 py-2.5 rounded-xl border font-semibold outline-none cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {HIJRI_MONTHS.map((m, idx) => (
                        <option
                          key={m}
                          value={idx + 1}
                          style={{
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {idx + 1}. {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-4 flex flex-wrap gap-1.5">
                    <button
                      type="button"
                      onClick={() => setHawlDate(9, 1)}
                      className="flex-1 px-2.5 py-2.5 rounded-xl border text-[11px] font-semibold cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      1st Ramadan
                    </button>
                    <button
                      type="button"
                      onClick={() => setHawlDate(hijri.month, hijri.day)}
                      className="flex-1 px-2.5 py-2.5 rounded-xl border text-[11px] font-semibold cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      Set Today
                    </button>
                  </div>
                </div>

                {/* Lunar Cycle Progress Bar */}
                <div className="space-y-1">
                  <div
                    className="flex justify-between text-[11px] tabular-nums"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>Current 354-Day Lunar Hawl Cycle</span>
                    <span>{hawlTelemetry.cycleCompletedPct}% Elapsed</span>
                  </div>
                  <div
                    className="h-2.5 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--bg-muted)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${hawlTelemetry.cycleCompletedPct}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    />
                  </div>
                </div>
              </section>

              {/* Installment Disbursement Logger */}
              <section className="bento-card p-5 sm:p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <div className="flex items-center gap-2">
                      <HeartHandshake
                        className="w-4 h-4"
                        style={{ color: "var(--accent-primary)" }}
                      />
                      <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                        Installment Disbursement Logger
                      </h2>
                    </div>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Pay Zakat in lump sum or advance/installment payments across your Hawl year
                      (+{Math.max(25, Math.round(xpZakatReward * 0.65))} XP per payment logged).
                    </p>
                  </div>

                  {/* Export / Copy Report Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={handleCopyReport}
                      className="px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {copiedReport ? (
                        <Check
                          className="w-3.5 h-3.5"
                          style={{ color: "var(--accent-primary)" }}
                        />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                      <span>{copiedReport ? "Copied!" : "Copy Summary"}</span>
                    </button>
                    <button
                      type="button"
                      onClick={handleDownloadReport}
                      className="px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Download Report</span>
                    </button>
                  </div>
                </div>

                {/* Fulfillment Progress Bar */}
                <div
                  className="p-4 rounded-xl border space-y-2"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  <div className="flex flex-wrap items-center justify-between gap-2 text-xs tabular-nums">
                    <span style={{ color: "var(--text-secondary)" }}>
                      Disbursed:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        {formatMoney(calc.totalPaid, sym)}
                      </strong>{" "}
                      of {formatMoney(calc.zakatDue, sym)}
                    </span>
                    <span className="font-bold" style={{ color: "var(--accent-primary)" }}>
                      {calc.remainingDue > 0
                        ? `${formatMoney(calc.remainingDue, sym)} Remaining`
                        : calc.surplusSadaqah > 0
                        ? `100% Fulfilled (+${formatMoney(calc.surplusSadaqah, sym)} Nafl Sadaqah)`
                        : calc.zakatDue > 0
                        ? "100% Zakat Fulfilled!"
                        : "Ready to Track"}
                    </span>
                  </div>

                  <div
                    className="h-3 rounded-full overflow-hidden"
                    style={{ backgroundColor: "var(--bg-muted)" }}
                  >
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${calc.paidProgressPct}%` }}
                      className="h-full rounded-full"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    />
                  </div>
                </div>

                {/* Log New Installment Form */}
                <form
                  onSubmit={handleLogDisbursement}
                  className="grid grid-cols-1 sm:grid-cols-12 gap-3 text-xs"
                >
                  <div className="sm:col-span-4 space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Recipient / Wakil Name
                    </label>
                    <input
                      type="text"
                      value={payRecipient}
                      onChange={(e) => setPayRecipient(e.target.value)}
                      placeholder="e.g., Sister Amina / Jamia Scholarship"
                      className="w-full px-3 py-2.5 rounded-xl border outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="sm:col-span-4 space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Masarif Category
                    </label>
                    <select
                      value={payCategory}
                      onChange={(e) => setPayCategory(e.target.value as DisbursementCategory)}
                      className="ui-select w-full px-3 py-2.5 rounded-xl border font-semibold outline-none cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {DISBURSEMENT_CATEGORIES.map((cat) => (
                        <option
                          key={cat}
                          value={cat}
                          style={{
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {cat}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Date
                    </label>
                    <input
                      type="date"
                      value={payDate || todayIso}
                      onChange={(e) => setPayDate(e.target.value)}
                      className="w-full px-2.5 py-2.5 rounded-xl border tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="sm:col-span-2 space-y-1">
                    <label className="block font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Amount ({sym})
                    </label>
                    <input
                      type="number"
                      min={0.01}
                      step="any"
                      required
                      value={payAmount}
                      onChange={(e) => setPayAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-3 py-2.5 rounded-xl border font-bold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="sm:col-span-12 flex flex-wrap items-center justify-between gap-3 pt-1">
                    <label className="inline-flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={payTamlik}
                        onChange={(e) => setPayTamlik(e.target.checked)}
                        className="rounded accent-purple-600"
                      />
                      <span style={{ color: "var(--text-secondary)" }}>
                        Unconditional <strong>Tamlik</strong> (non-Hashimi eligible recipient)
                        verified
                      </span>
                    </label>

                    <button
                      type="submit"
                      className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Log Disbursement (+XP)</span>
                    </button>
                  </div>
                </form>

                {/* Disbursements List */}
                <div className="space-y-2 pt-2">
                  {disbursements.length === 0 ? (
                    <div
                      className="p-5 rounded-xl border text-center text-xs"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-muted)",
                      }}
                    >
                      No Zakat installments recorded yet. Log each Tamlik payment above to track
                      your remaining Hawl balance.
                    </div>
                  ) : (
                    disbursements.map((entry) => (
                      <div
                        key={entry.id}
                        className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-3"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-elevated)",
                        }}
                      >
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="text-xs font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {entry.recipient}
                            </span>
                            <span
                              className="badge-pill"
                              style={{
                                backgroundColor: "var(--accent-soft)",
                                color: "var(--accent-primary)",
                              }}
                            >
                              {entry.category}
                            </span>
                            {entry.tamlikConfirmed && (
                              <span className="badge-pill badge-emerald">
                                <CheckCircle2 className="w-3 h-3" />
                                <span>Tamlik</span>
                              </span>
                            )}
                          </div>
                          <div
                            className="text-[11px] tabular-nums"
                            style={{ color: "var(--text-muted)" }}
                          >
                            Disbursed on {entry.date}
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <span
                            className="text-sm font-extrabold tabular-nums"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {formatMoney(entry.amount, sym)}
                          </span>
                          <button
                            type="button"
                            aria-label={`Delete payment to ${entry.recipient}`}
                            onClick={() => handleDeleteDisbursement(entry.id)}
                            className="p-1.5 rounded-lg border cursor-pointer hover:opacity-80"
                            style={{
                              borderColor: "var(--border-hairline)",
                              color: "var(--accent-danger)",
                            }}
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </section>
            </div>

            {/* Right Column: Encrypted Vault History (`auliya_encrypted_zakat_v2`) */}
            <aside className="lg:col-span-5 space-y-4">
              <div className="bento-card p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Lock className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                      Encrypted Vault History
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={handleSaveEncryptedSnapshot}
                    className="btn-primary px-3 py-1.5 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Save Current</span>
                  </button>
                </div>

                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  Saved assessments are encrypted locally with WebCrypto{" "}
                  <strong>AES-256-GCM</strong> (<code>{VAULT_STORAGE_KEY}</code>) and never leave
                  your device in plaintext.
                </p>

                {!vaultHydrated ? (
                  <div className="p-4 text-xs text-center" style={{ color: "var(--text-muted)" }}>
                    Decrypting local AES-256-GCM vault...
                  </div>
                ) : vaultSnapshots.length === 0 ? (
                  <div
                    className="p-5 rounded-xl border text-center space-y-2"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <ShieldCheck
                      className="w-7 h-7 mx-auto"
                      style={{ color: "var(--accent-primary)" }}
                    />
                    <div
                      className="text-xs font-semibold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      No Saved Annual Snapshots Yet
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      Click &ldquo;Save Encrypted Snapshot&rdquo; to seal your current Hawl
                      calculation with AES-256-GCM &amp; SHA-256 verification.
                    </p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {vaultSnapshots.map((snap) => {
                      const isOpen = expandedSnapshotId === snap.id;
                      return (
                        <div
                          key={snap.id}
                          className="p-4 rounded-xl border space-y-3"
                          style={{
                            borderColor: "var(--border-hairline)",
                            backgroundColor: "var(--bg-elevated)",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div>
                              <div
                                className="text-xs font-bold"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {snap.hijriDateFormatted} • Hawl {snap.hawlLabel}
                              </div>
                              <div
                                className="text-[11px] tabular-nums"
                                style={{ color: "var(--text-muted)" }}
                              >
                                Saved {new Date(snap.createdAt).toLocaleString()} •{" "}
                                {snap.currencyCode}
                              </div>
                            </div>
                            <span
                              className={`badge-pill ${
                                snap.isSahibNisab ? "badge-emerald" : "badge-gold"
                              }`}
                            >
                              {snap.isSahibNisab ? "Wajib" : "Exempt"}
                            </span>
                          </div>

                          <div className="grid grid-cols-3 gap-2 text-xs tabular-nums">
                            <div>
                              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                Net Wealth
                              </div>
                              <div className="font-bold" style={{ color: "var(--text-primary)" }}>
                                {formatMoney(snap.netZakatableWealth, snap.currencySymbol, 0)}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                Zakat Due
                              </div>
                              <div
                                className="font-bold"
                                style={{ color: "var(--accent-primary)" }}
                              >
                                {formatMoney(snap.zakatDue, snap.currencySymbol)}
                              </div>
                            </div>
                            <div>
                              <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                                Paid
                              </div>
                              <div className="font-bold" style={{ color: "var(--text-primary)" }}>
                                {formatMoney(snap.totalPaid, snap.currencySymbol, 0)}
                              </div>
                            </div>
                          </div>

                          {isOpen && (
                            <div
                              className="pt-2.5 border-t space-y-1.5 text-[11px] tabular-nums"
                              style={{
                                borderColor: "var(--border-hairline)",
                                color: "var(--text-secondary)",
                              }}
                            >
                              <div>
                                Gross Assets: {formatMoney(snap.grossAssets, snap.currencySymbol)} |
                                Liabilities: −
                                {formatMoney(snap.totalLiabilities, snap.currencySymbol)}
                              </div>
                              <div>
                                Basis:{" "}
                                {snap.calendarBasis === "lunar" ? "Hijri Lunar" : "Solar Eq."} (
                                {snap.zakatRatePercent}%) •{" "}
                                {snap.activeNisabType === "gold" ? "Gold Nisab" : "Silver Nisab"}
                              </div>
                              <div
                                className="truncate font-mono text-[10px]"
                                style={{ color: "var(--text-muted)" }}
                              >
                                SHA-256: {snap.sha256Digest} • CT: {snap.cipherPreview}…
                              </div>
                            </div>
                          )}

                          <div className="flex items-center justify-between gap-2 pt-1">
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => handleRestoreSnapshot(snap)}
                                className="px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                                style={{
                                  borderColor: "var(--accent-primary)",
                                  backgroundColor: "var(--accent-soft)",
                                  color: "var(--accent-primary)",
                                }}
                              >
                                <RotateCcw className="w-3 h-3" />
                                <span>Restore</span>
                              </button>
                              <button
                                type="button"
                                aria-label="Toggle snapshot details"
                                onClick={() =>
                                  setExpandedSnapshotId((curr) =>
                                    curr === snap.id ? null : snap.id
                                  )
                                }
                                className="px-2.5 py-1.5 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                                style={{
                                  borderColor: "var(--border-hairline)",
                                  backgroundColor: "var(--bg-surface)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                <Eye className="w-3 h-3" />
                                <span>{isOpen ? "Hide" : "Inspect"}</span>
                                {isOpen ? (
                                  <ChevronUp className="w-3 h-3" />
                                ) : (
                                  <ChevronDown className="w-3 h-3" />
                                )}
                              </button>
                            </div>

                            <button
                              type="button"
                              aria-label="Delete encrypted snapshot"
                              onClick={() => handleDeleteSnapshot(snap.id)}
                              className="p-1.5 rounded-lg border cursor-pointer hover:opacity-80"
                              style={{
                                borderColor: "var(--border-hairline)",
                                color: "var(--accent-danger)",
                              }}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </aside>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/* TAB 3: FITRAH, FIDYAH & KAFFARAH                                 */}
        {/* ================================================================ */}
        {activeTab === "fitrah" && (
          <motion.div
            key="tab-fitrah"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Hanafi Sadaqat-ul-Fitr Calculator */}
            <section className="lg:col-span-7 bento-card p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Wheat className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                    <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                      Hanafi Sadaqat-ul-Fitr (Fitrah) Calculator
                    </h2>
                  </div>
                  <p
                    className="text-xs mt-1 leading-relaxed"
                    style={{ color: "var(--text-muted)" }}
                  >
                    Wajib at <em>Subh Sadiq</em> (dawn) of 1st Shawwal (Eid-ul-Fitr) on every free
                    Muslim owning Nisab-value wealth surplus to basic necessities (no 1-year Hawl
                    required). Include yourself, minor children, and any newborn born before Fajr
                    of Eid!
                  </p>
                </div>
              </div>

              {/* Family Headcount Steppers */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                {[
                  {
                    label: "Self & Adults",
                    sub: "Household adults",
                    value: familyAdults,
                    setter: setFamilyAdults,
                  },
                  {
                    label: "Minor Children",
                    sub: "Wajib on father",
                    value: familyMinors,
                    setter: setFamilyMinors,
                  },
                  {
                    label: "Newborns",
                    sub: "Born before Eid Fajr",
                    value: familyNewborns,
                    setter: setFamilyNewborns,
                  },
                ].map((group) => (
                  <div
                    key={group.label}
                    className="p-3.5 rounded-xl border space-y-2.5"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <div>
                      <div className="font-bold" style={{ color: "var(--text-primary)" }}>
                        {group.label}
                      </div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {group.sub}
                      </div>
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <button
                        type="button"
                        aria-label={`Decrease ${group.label}`}
                        onClick={() => group.setter((v) => Math.max(0, v - 1))}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>

                      <span
                        className="text-lg font-extrabold tabular-nums"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {group.value}
                      </span>

                      <button
                        type="button"
                        aria-label={`Increase ${group.label}`}
                        onClick={() => group.setter((v) => v + 1)}
                        className="w-8 h-8 rounded-lg border flex items-center justify-center cursor-pointer"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* 4 Sunnah Commodities Selector */}
              <div className="space-y-2.5">
                <div className="text-xs font-bold" style={{ color: "var(--text-primary)" }}>
                  Select Prophetic Commodity Standard (CMS Weights: {zakatConfig.fitrahWheatKg} kg /{" "}
                  {zakatConfig.fitrahOtherKg} kg)
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {fitrahCommodities.map((comm) => {
                    const selected = comm.id === fitrahCommodity;
                    const personCost = comm.kg * comm.pricePerKg;
                    return (
                      <button
                        key={comm.id}
                        type="button"
                        onClick={() => setFitrahCommodity(comm.id)}
                        className="p-3.5 rounded-xl border text-left space-y-1.5 cursor-pointer transition-all"
                        style={{
                          borderColor: selected
                            ? "var(--accent-primary)"
                            : "var(--border-hairline)",
                          backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="text-xs font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {comm.title}
                          </span>
                          <span
                            className="font-arabic text-sm"
                            style={{ color: "var(--accent-gold)" }}
                          >
                            {comm.arabic}
                          </span>
                        </div>
                        <div className="flex items-center justify-between text-xs tabular-nums">
                          <span style={{ color: "var(--text-secondary)" }}>
                            {comm.kg} kg × {formatMoney(comm.pricePerKg, sym)}/kg
                          </span>
                          <span
                            className="font-extrabold"
                            style={{ color: "var(--accent-primary)" }}
                          >
                            {formatMoney(personCost, sym)} / person
                          </span>
                        </div>
                        <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {comm.note}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Customizable Local Per-Kg Price */}
              <div
                className="p-4 rounded-xl border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center text-xs"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <div className="sm:col-span-7 space-y-0.5">
                  <label
                    htmlFor="local-fitrah-price"
                    className="font-bold block"
                    style={{ color: "var(--text-primary)" }}
                  >
                    Local Market Price for {selectedCommodity.title} ({sym} / kg)
                  </label>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Defaults to Sanctuary CMS rate (
                    {formatMoney(selectedCommodity.defaultPrice, sym)}
                    /kg). Adjust to match your local grain/date bazaar.
                  </p>
                </div>

                <div className="sm:col-span-5 flex items-center gap-2">
                  <input
                    id="local-fitrah-price"
                    type="number"
                    min={0}
                    step="any"
                    value={selectedCommodity.pricePerKg}
                    onChange={(e) => {
                      const val = Math.max(0, Number(e.target.value) || 0);
                      setFitrahPriceOverrides((prev) => ({
                        ...prev,
                        [activeCurrency.code]: {
                          ...prev[activeCurrency.code],
                          [selectedCommodity.id]: val,
                        },
                      }));
                    }}
                    className="flex-1 px-3 py-2 rounded-xl border font-bold tabular-nums outline-none"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                    }}
                  />
                  {fitrahPriceOverrides[activeCurrency.code]?.[selectedCommodity.id] !==
                    undefined && (
                    <button
                      type="button"
                      aria-label="Reset commodity price to CMS default"
                      onClick={() =>
                        setFitrahPriceOverrides((prev) => {
                          const nextCurr = { ...prev[activeCurrency.code] };
                          delete nextCurr[selectedCommodity.id];
                          return { ...prev, [activeCurrency.code]: nextCurr };
                        })
                      }
                      className="p-2 rounded-xl border cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Total Family Fitrah Result Card */}
              <div className="quran-gradient-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-semibold text-white/85 flex items-center gap-1.5">
                    <Users className="w-4 h-4" />
                    <span>
                      {totalFamilyMembers} Family Member{totalFamilyMembers === 1 ? "" : "s"} •{" "}
                      {formatMoney(perPersonFitrah, sym)} per person (
                      {(selectedCommodity.kg * totalFamilyMembers).toFixed(2)} kg total)
                    </span>
                  </div>
                  <div className="text-3xl font-extrabold tabular-nums text-white">
                    {formatMoney(totalFamilyFitrah, sym)}
                  </div>
                  <div className="text-[11px] text-white/80">
                    Best discharged before Eid-ul-Fitr Salah so indigent families rejoice on Eid.
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    awardXp(40, "Sadaqat-ul-Fitr Discharged");
                    flashBanner(
                      `Alhamdulillah! Logged ${formatMoney(totalFamilyFitrah, sym)} Sadaqat-ul-Fitr for ${totalFamilyMembers} family member(s).`
                    );
                  }}
                  className="px-4 py-2.5 rounded-xl bg-white text-slate-900 text-xs font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer shrink-0 shadow-md"
                >
                  <BadgeCheck className="w-4 h-4" />
                  <span>Mark Fitrah Paid (+40 XP)</span>
                </button>
              </div>
            </section>

            {/* Right Column: Hanafi Fidyah (Shaykh Fani) & Kaffarah Reference */}
            <aside className="lg:col-span-5 space-y-5">
              {/* Hanafi Fidyah Calculator */}
              <section className="bento-card p-5 sm:p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                  <h2 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    Hanafi Fidyah Calculator (Shaykh Fani Only)
                  </h2>
                </div>

                {/* Strict Bahar-e-Shariat Annotation */}
                <div
                  className="p-3.5 rounded-xl border text-xs leading-relaxed space-y-1.5"
                  style={{
                    borderColor: "var(--accent-gold)",
                    backgroundColor: "var(--gold-soft)",
                    color: "var(--text-primary)",
                  }}
                >
                  <div
                    className="font-bold flex items-center gap-1.5"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    <BookOpen className="w-3.5 h-3.5" />
                    <span>Strict Ruling — Bahar-e-Shariat &amp; Al-Hidayah</span>
                  </div>
                  <p style={{ color: "var(--text-secondary)" }}>
                    In the Hanafi Madhhab, Fidyah is valid <strong>ONLY</strong> for a{" "}
                    <strong>Shaykh Fani</strong> (a chronically frail, very elderly, or terminally
                    ill Muslim who has <strong>zero medical hope of recovery</strong> even in short
                    winter days). Temporary illness, travel, pregnancy, or nursing{" "}
                    <strong>require Qaza make-up fasts</strong> — Fidyah does NOT replace them!
                  </p>
                </div>

                <label className="flex items-start gap-2.5 text-xs cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={shaykhFaniAcknowledged}
                    onChange={(e) => setShaykhFaniAcknowledged(e.target.checked)}
                    className="mt-0.5 rounded accent-purple-600"
                  />
                  <span style={{ color: "var(--text-secondary)" }}>
                    I understand Fidyah applies strictly to a <em>Shaykh Fani</em> (and if health
                    unexpectedly returns later, Qaza fasts become obligatory again).
                  </span>
                </label>

                <div className="space-y-1.5 text-xs">
                  <label
                    htmlFor="fidyah-days-input"
                    className="font-semibold flex items-center justify-between"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    <span>Missed Fasts Count</span>
                    <span className="tabular-nums" style={{ color: "var(--text-muted)" }}>
                      1 Fast = 1 Fitrah ({formatMoney(perPersonFitrah, sym)})
                    </span>
                  </label>

                  <div className="flex items-center gap-2">
                    <input
                      id="fidyah-days-input"
                      type="number"
                      min={1}
                      max={3600}
                      value={fidyahMissedFasts}
                      onChange={(e) =>
                        setFidyahMissedFasts(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="flex-1 px-3 py-2.5 rounded-xl border font-bold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                    {[1, 10, 29, 30].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        onClick={() => setFidyahMissedFasts(preset)}
                        className="px-2.5 py-2.5 rounded-xl border font-semibold tabular-nums cursor-pointer"
                        style={{
                          borderColor:
                            fidyahMissedFasts === preset
                              ? "var(--accent-primary)"
                              : "var(--border-hairline)",
                          backgroundColor:
                            fidyahMissedFasts === preset
                              ? "var(--accent-soft)"
                              : "var(--bg-elevated)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {preset}d
                      </button>
                    ))}
                  </div>
                </div>

                <div
                  className="p-4 rounded-xl border flex items-center justify-between"
                  style={{
                    borderColor: shaykhFaniAcknowledged
                      ? "var(--accent-primary)"
                      : "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  <div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      Total Shaykh Fani Fidyah ({selectedCommodity.title} basis)
                    </div>
                    <div
                      className="text-2xl font-extrabold tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {formatMoney(totalFidyahDue, sym)}
                    </div>
                  </div>
                  <Clock className="w-6 h-6" style={{ color: "var(--accent-primary)" }} />
                </div>
              </section>

              {/* Kaffarah Reference Card */}
              <section className="bento-card p-5 space-y-3 text-xs">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                  <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                    Hanafi Kaffarah Benchmarks
                  </h3>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  <div
                    className="flex items-center justify-between font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span>Broken Oath (Kaffarah-e-Yamin)</span>
                    <span className="tabular-nums" style={{ color: "var(--accent-primary)" }}>
                      {formatMoney(kaffarahOath10Value, sym)}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Feed or clothe <strong>10 Masakin</strong> (10 × Fitrah equivalent). Only if
                    financially unable, fast <strong>3 consecutive days</strong>.
                  </p>
                </div>

                <div
                  className="p-3.5 rounded-xl border space-y-1"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  <div
                    className="flex items-center justify-between font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <span>Deliberately Broken Ramadan Fast</span>
                    <span className="tabular-nums" style={{ color: "var(--accent-gold)" }}>
                      {formatMoney(kaffarahFast60Value, sym)}
                    </span>
                  </div>
                  <p className="text-[11px] leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    Primary obligation is <strong>60 consecutive fasts</strong> (+ 1 Qaza). Feeding{" "}
                    <strong>60 Masakin</strong> (60 × Fitrah) is valid ONLY if permanently unable to
                    fast 60 consecutive days; consult a Sunni Mufti for specific rulings.
                  </p>
                </div>
              </section>
            </aside>
          </motion.div>
        )}

        {/* ================================================================ */}
        {/* TAB 4: USHR & MASARIF GUIDE                                      */}
        {/* ================================================================ */}
        {activeTab === "ushr" && (
          <motion.div
            key="tab-ushr"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.22 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start"
          >
            {/* Left Column: Hanafi Ushr Agricultural Tithe Calculator */}
            <section className="lg:col-span-5 bento-card p-5 sm:p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2">
                  <Sprout className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                  <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                    Hanafi Ushr Calculator
                  </h2>
                </div>
                <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  <em>&ldquo;Give its due on the day of its harvest&rdquo;</em> (Surah Al-An&apos;am
                  6:141). Under Imam Abu Hanifa&apos;s ruling, Ushr has{" "}
                  <strong>no Nisab minimum</strong> and <strong>no 1-year Hawl wait</strong> — it is
                  due on every harvest of Ushri land.
                </p>
              </div>

              {/* Value vs Quantity Input Mode */}
              <div
                className="grid grid-cols-2 p-1 rounded-xl border gap-1 text-xs"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setUshrInputMode("value")}
                  className="py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                  style={{
                    backgroundColor:
                      ushrInputMode === "value" ? "var(--accent-primary)" : "transparent",
                    color: ushrInputMode === "value" ? "#ffffff" : "var(--text-secondary)",
                  }}
                >
                  By Market Value ({sym})
                </button>
                <button
                  type="button"
                  onClick={() => setUshrInputMode("quantity")}
                  className="py-2 rounded-lg font-semibold cursor-pointer transition-colors"
                  style={{
                    backgroundColor:
                      ushrInputMode === "quantity" ? "var(--accent-primary)" : "transparent",
                    color: ushrInputMode === "quantity" ? "#ffffff" : "var(--text-secondary)",
                  }}
                >
                  By Harvest Weight (kg)
                </button>
              </div>

              {ushrInputMode === "value" ? (
                <div className="space-y-1.5 text-xs">
                  <label
                    htmlFor="ushr-value-input"
                    className="block font-semibold"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    Gross Harvest Market Value ({sym})
                  </label>
                  <input
                    id="ushr-value-input"
                    type="number"
                    min={0}
                    step="any"
                    value={ushrHarvestValue}
                    onChange={(e) =>
                      setUshrHarvestValue(Math.max(0, Number(e.target.value) || 0))
                    }
                    className="w-full px-3 py-2.5 rounded-xl border font-bold tabular-nums outline-none"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="space-y-1.5">
                    <label
                      className="block font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Total Produce (kg)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={ushrHarvestKg}
                      onChange={(e) =>
                        setUshrHarvestKg(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border font-bold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label
                      className="block font-semibold"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      Crop Price ({sym}/kg)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step="any"
                      value={ushrPricePerKg}
                      onChange={(e) =>
                        setUshrPricePerKg(Math.max(0, Number(e.target.value) || 0))
                      }
                      className="w-full px-3 py-2.5 rounded-xl border font-bold tabular-nums outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Irrigation Method Toggle */}
              <div className="space-y-2">
                <div
                  className="text-xs font-bold flex items-center gap-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  <Droplets className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                  <span>Primary Irrigation Source</span>
                </div>

                <div className="space-y-2">
                  <button
                    type="button"
                    onClick={() => setUshrIrrigation("natural_10")}
                    className="w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                    style={{
                      borderColor:
                        ushrIrrigation === "natural_10"
                          ? "var(--accent-primary)"
                          : "var(--border-hairline)",
                      backgroundColor:
                        ushrIrrigation === "natural_10"
                          ? "var(--accent-soft)"
                          : "var(--bg-elevated)",
                    }}
                  >
                    <div
                      className="flex items-center justify-between text-xs font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <span>Rain / River / Natural Spring</span>
                      <span style={{ color: "var(--accent-primary)" }}>10% Full Ushr (1/10)</span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Watered predominantly by rainfall, natural streams, or unpaid floodwater.
                    </p>
                  </button>

                  <button
                    type="button"
                    onClick={() => setUshrIrrigation("irrigated_5")}
                    className="w-full p-3.5 rounded-xl border text-left cursor-pointer transition-all"
                    style={{
                      borderColor:
                        ushrIrrigation === "irrigated_5"
                          ? "var(--accent-primary)"
                          : "var(--border-hairline)",
                      backgroundColor:
                        ushrIrrigation === "irrigated_5"
                          ? "var(--accent-soft)"
                          : "var(--bg-elevated)",
                    }}
                  >
                    <div
                      className="flex items-center justify-between text-xs font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <span>Tube-Well / Paid Irrigation</span>
                      <span style={{ color: "var(--accent-gold)" }}>5% Nisf Ushr (1/20)</span>
                    </div>
                    <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                      Watered predominantly via diesel/electric pumps, water tankers, or paid canal
                      tariffs.
                    </p>
                  </button>
                </div>
              </div>

              {/* Ushr Output Card */}
              <div className="quran-gradient-card p-5 space-y-2">
                <div className="text-xs font-semibold text-white/85">
                  Obligatory Harvest Tithe ({ushrCalc.ratePct}%{" "}
                  {ushrCalc.ratePct === 10 ? "Full Ushr" : "Nisf Ushr"})
                </div>
                <div className="text-3xl font-extrabold tabular-nums text-white">
                  {formatMoney(ushrCalc.dueValue, sym)}
                </div>
                {ushrCalc.dueKg !== null && (
                  <div className="text-xs font-semibold text-white/90 tabular-nums">
                    In-Kind Produce Equivalent: {ushrCalc.dueKg.toFixed(2)} kg
                  </div>
                )}
                <div className="text-[11px] text-white/80 pt-1">
                  Note: Cultivation costs (seed, fertilizer, labor) are not deducted before
                  computing the {ushrCalc.ratePct}% gross rate in Hanafi Fiqh.
                </div>
              </div>
            </section>

            {/* Right Column: Interactive Hanafi Masarif & Tamlik Checker */}
            <section className="lg:col-span-7 bento-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Info className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                    <h2 className="text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                      Interactive Hanafi Masarif &amp; Tamlik Verifier
                    </h2>
                  </div>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Verify who CAN and CANNOT receive Zakat, Fitrah, Fidyah &amp; Ushr before
                    transferring ownership.
                  </p>
                </div>
              </div>

              {/* Search & Filter Controls */}
              <div className="flex flex-col sm:flex-row gap-2.5">
                <div className="relative flex-1">
                  <Search
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="search"
                    aria-label="Search Masarif recipient rules"
                    value={masarifSearch}
                    onChange={(e) => setMasarifSearch(e.target.value)}
                    placeholder="Search sister, Sadat, parents, wife, madrasa, masjid, debt..."
                    className="w-full pl-9 pr-3 py-2.5 rounded-xl border text-xs outline-none"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div className="flex flex-wrap gap-1.5">
                  {(
                    [
                      { id: "all", label: "All Rules" },
                      { id: "eligible", label: "Can Receive" },
                      { id: "ineligible", label: "Cannot Receive" },
                      { id: "special", label: "Sadat & Tamlik" },
                    ] as { id: MasarifFilter; label: string }[]
                  ).map((f) => (
                    <button
                      key={f.id}
                      type="button"
                      onClick={() => setMasarifFilter(f.id)}
                      className="px-3 py-2 rounded-xl border text-[11px] font-semibold cursor-pointer transition-colors"
                      style={{
                        borderColor:
                          masarifFilter === f.id
                            ? "var(--accent-primary)"
                            : "var(--border-hairline)",
                        backgroundColor:
                          masarifFilter === f.id ? "var(--accent-soft)" : "var(--bg-elevated)",
                        color:
                          masarifFilter === f.id ? "var(--accent-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {f.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Masarif Cards Grid */}
              <div className="grid grid-cols-1 gap-3">
                {filteredMasarif.length === 0 ? (
                  <div
                    className="p-6 rounded-xl border text-center text-xs"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-muted)",
                    }}
                  >
                    No Masarif rulings matched &ldquo;{masarifSearch}&rdquo;. Try searching
                    &ldquo;Sadat&rdquo;, &ldquo;sibling&rdquo;, &ldquo;spouse&rdquo;, or
                    &ldquo;masjid&rdquo;.
                  </div>
                ) : (
                  filteredMasarif.map((rule) => {
                    const StatusIcon =
                      rule.status === "eligible"
                        ? CheckCircle2
                        : rule.status === "ineligible"
                        ? XCircle
                        : Sparkles;
                    const badgeClass =
                      rule.status === "eligible"
                        ? "badge-emerald"
                        : rule.status === "ineligible"
                        ? "badge-crimson"
                        : "badge-gold";

                    return (
                      <div
                        key={rule.id}
                        className="p-4 rounded-xl border space-y-2 transition-colors"
                        style={{
                          borderColor:
                            rule.id === "sadat-honor"
                              ? "var(--accent-gold)"
                              : "var(--border-hairline)",
                          backgroundColor:
                            rule.id === "sadat-honor" ? "var(--gold-soft)" : "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex items-center gap-2">
                            <h3
                              className="text-sm font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {rule.title}
                            </h3>
                            <span
                              className="font-arabic text-sm"
                              style={{ color: "var(--accent-gold)" }}
                            >
                              {rule.arabicTerm}
                            </span>
                          </div>
                          <span className={`badge-pill ${badgeClass}`}>
                            <StatusIcon className="w-3.5 h-3.5" />
                            <span>{rule.badgeText}</span>
                          </span>
                        </div>

                        <p
                          className="text-xs font-medium leading-relaxed"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {rule.summary}
                        </p>
                        <p
                          className="text-[11px] leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {rule.fiqhDetail}
                        </p>
                      </div>
                    );
                  })
                )}
              </div>
            </section>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Suspense Wrapper Export (Next.js 16 / React 19 Compliant)                  */
/* -------------------------------------------------------------------------- */

function ZakatStudioSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div
        className="h-44 rounded-2xl border"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-hairline)" }}
      />
      <div
        className="h-14 rounded-2xl border"
        style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-hairline)" }}
      />
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div
          className="lg:col-span-7 h-96 rounded-2xl border"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-hairline)" }}
        />
        <div
          className="lg:col-span-5 h-96 rounded-2xl border"
          style={{ backgroundColor: "var(--bg-surface)", borderColor: "var(--border-hairline)" }}
        />
      </div>
    </div>
  );
}

export default function ZakatPage() {
  return (
    <Suspense fallback={<ZakatStudioSkeleton />}>
      <ZakatStudioInner />
    </Suspense>
  );
}
