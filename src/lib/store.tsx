"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LangCode, LANGUAGES } from "./i18n";
import {
  CalcMethodId,
  CITY_PRESETS,
  CityPreset,
  computeHanafiSchedule,
  DEFAULT_PRAYER_SETTINGS,
  HanafiPrayerSchedule,
  PrayerName,
  PrayerSettingsMap,
} from "./prayer-engine";
import { getHijriDate, HijriDateInfo } from "./hijri";
import { AULIYA_DATA, AuliyaProfile } from "@/data/auliya";

export type PrayerLogStatus = "none" | "jamaat" | "ontime" | "qaza";

export interface FamilyBarsi {
  id: string;
  personName: string;
  hijriMonth: number;
  hijriDay: number;
  relation: string;
}

export interface AuditEntry {
  id: string;
  timestamp: string;
  actor: string;
  action: string;
  target: string;
}

export interface AppUser {
  name: string;
  email: string;
  provider: "Apple" | "Google" | "Email OTP";
}

interface PersistedState {
  theme: "dark" | "light";
  lang: LangCode;
  hilalOffset: number;
  city: CityPreset;
  calcMethod: CalcMethodId;
  prayerSettings: PrayerSettingsMap;
  salahToday: Record<PrayerName, PrayerLogStatus>;
  sunnahChecks: Record<string, boolean>;
  tasbihTotalToday: number;
  tasbihTarget: number;
  activeLitanyId: string;
  ilmPoints: number;
  quranVersesToday: number;
  lastQuranRef: string;
  sajdaQueue: string[];
  sajdaCompleted: string[];
  streakDays: number;
  qazaShieldAvailable: boolean;
  qazaUmriRemaining: Record<PrayerName | "witr", number>;
  bestQuizTier: number;
  hawlHijriMonth: number;
  hawlHijriDay: number;
  familyBarsis: FamilyBarsi[];
  customAuliya: AuliyaProfile[];
  auditLogs: AuditEntry[];
  user: AppUser | null;
  hasInteracted: boolean;
}

const DEFAULT_STATE: PersistedState = {
  theme: "dark",
  lang: "en",
  hilalOffset: 0,
  city: CITY_PRESETS[0],
  calcMethod: "Karachi",
  prayerSettings: DEFAULT_PRAYER_SETTINGS,
  salahToday: { fajr: "jamaat", dhuhr: "ontime", asr: "none", maghrib: "none", isha: "none" },
  sunnahChecks: { miswak: true, ishraq: false, surah_mulk: false, tahajjud: false },
  tasbihTotalToday: 33,
  tasbihTarget: 100,
  activeLitanyId: "durood-razawiyya",
  ilmPoints: 1200,
  quranVersesToday: 4,
  lastQuranRef: "18:28",
  sajdaQueue: [],
  sajdaCompleted: ["84:21"],
  streakDays: 14,
  qazaShieldAvailable: true,
  qazaUmriRemaining: { fajr: 120, dhuhr: 95, asr: 110, maghrib: 45, isha: 130, witr: 130 },
  bestQuizTier: 5,
  hawlHijriMonth: 9,
  hawlHijriDay: 1,
  familyBarsis: [
    { id: "b-1", personName: "Marhum Dada Jan", hijriMonth: 4, hijriDay: 14, relation: "Grandfather" },
  ],
  customAuliya: [],
  auditLogs: [
    {
      id: "aud-1",
      timestamp: "2026-11-12T08:00:00Z",
      actor: "Mufti Scholar Reviewer (FIDO2)",
      action: "Published",
      target: "7 Flagship Auliya Profiles & Kanzul Iman SHA-256 Bundle",
    },
  ],
  user: null,
  hasInteracted: false,
};

const STORAGE_KEY = "auliya_companion_state_v1";

interface AppContextValue extends PersistedState {
  now: Date;
  hijri: HijriDateInfo;
  schedule: HanafiPrayerSchedule;
  allAuliya: AuliyaProfile[];
  rings: { salah: number; ilm: number; dhikr: number };
  setTheme: (t: "dark" | "light") => void;
  setLang: (l: LangCode) => void;
  setHilalOffset: (o: number) => void;
  setCity: (c: CityPreset) => void;
  setCalcMethod: (m: CalcMethodId) => void;
  updatePrayerSetting: (p: PrayerName, patch: Partial<PrayerSettingsMap[PrayerName]>) => void;
  logSalah: (p: PrayerName, status: PrayerLogStatus) => void;
  toggleSunnah: (id: string) => void;
  incrementTasbih: (step?: number) => void;
  resetTasbihToday: () => void;
  setActiveLitany: (id: string, target: number) => void;
  addIlmPoints: (pts: number, quizTier?: number) => void;
  logQuranAyah: (ref: string) => void;
  logSajda: (ref: string, action: "now" | "defer") => void;
  decrementQazaUmri: (p: PrayerName | "witr") => void;
  setHawlDate: (m: number, d: number) => void;
  addFamilyBarsi: (b: Omit<FamilyBarsi, "id">) => void;
  upsertCustomAuliya: (a: AuliyaProfile, actorNote: string) => void;
  signInUser: (u: AppUser) => void;
  signOutUser: () => void;
}

const AppContext = createContext<AppContextValue | null>(null);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<PersistedState>(DEFAULT_STATE);
  const [hydrated, setHydrated] = useState(false);
  const [now, setNow] = useState<Date>(() => new Date());

  // Hydrate offline-first from localStorage in < 5ms
  useEffect(() => {
    Promise.resolve().then(() => {
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          setState((prev) => ({ ...prev, ...parsed }));
        }
      } catch {
        // ignore corrupted storage
      }
      setHydrated(true);
    });
  }, []);

  // Save changes to localStorage
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated]);

  // Apply HTML theme class + RTL/LTR dir & lang attributes
  useEffect(() => {
    const html = document.documentElement;
    if (state.theme === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    const langMeta = LANGUAGES.find((l) => l.code === state.lang) || LANGUAGES[0];
    html.setAttribute("dir", langMeta.dir);
    html.setAttribute("lang", state.lang === "ro_ur" ? "en" : state.lang);
  }, [state.theme, state.lang]);

  // Live 1-second clock tick for Azan/Jamaat countdown
  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hijri = useMemo(() => getHijriDate(now, state.hilalOffset), [now, state.hilalOffset]);

  const schedule = useMemo(
    () =>
      computeHanafiSchedule(
        state.city.lat,
        state.city.lng,
        now,
        state.calcMethod,
        state.prayerSettings
      ),
    [state.city.lat, state.city.lng, now, state.calcMethod, state.prayerSettings]
  );

  const allAuliya = useMemo(() => {
    const map = new Map<string, AuliyaProfile>();
    for (const a of AULIYA_DATA) map.set(a.id, a);
    for (const a of state.customAuliya) map.set(a.id, a);
    return Array.from(map.values());
  }, [state.customAuliya]);

  const rings = useMemo(() => {
    const prayed = Object.values(state.salahToday).filter((s) => s !== "none").length;
    const salah = Math.min(100, Math.round((prayed / 5) * 100));
    const ilm = Math.min(100, Math.round((state.quranVersesToday / 10) * 100));
    const sunnahDone = Object.values(state.sunnahChecks).filter(Boolean).length;
    const dhikr = Math.min(
      100,
      Math.round(
        ((state.tasbihTotalToday / Math.max(1, state.tasbihTarget)) * 0.6 +
          (sunnahDone / 4) * 0.4) *
          100
      )
    );
    return { salah, ilm, dhikr };
  }, [state.salahToday, state.quranVersesToday, state.tasbihTotalToday, state.tasbihTarget, state.sunnahChecks]);

  const value: AppContextValue = {
    ...state,
    now,
    hijri,
    schedule,
    allAuliya,
    rings,
    setTheme: (theme) => setState((s) => ({ ...s, theme })),
    setLang: (lang) => setState((s) => ({ ...s, lang })),
    setHilalOffset: (hilalOffset) =>
      setState((s) => ({ ...s, hilalOffset: Math.max(-2, Math.min(2, hilalOffset)) })),
    setCity: (city) => setState((s) => ({ ...s, city })),
    setCalcMethod: (calcMethod) => setState((s) => ({ ...s, calcMethod })),
    updatePrayerSetting: (p, patch) =>
      setState((s) => ({
        ...s,
        hasInteracted: true,
        prayerSettings: {
          ...s.prayerSettings,
          [p]: { ...s.prayerSettings[p], ...patch },
        },
      })),
    logSalah: (p, status) =>
      setState((s) => ({
        ...s,
        hasInteracted: true,
        salahToday: { ...s.salahToday, [p]: status },
      })),
    toggleSunnah: (id) =>
      setState((s) => ({
        ...s,
        hasInteracted: true,
        sunnahChecks: { ...s.sunnahChecks, [id]: !s.sunnahChecks[id] },
      })),
    incrementTasbih: (step = 1) =>
      setState((s) => ({
        ...s,
        hasInteracted: true,
        tasbihTotalToday: s.tasbihTotalToday + step,
      })),
    resetTasbihToday: () => setState((s) => ({ ...s, tasbihTotalToday: 0 })),
    setActiveLitany: (activeLitanyId, tasbihTarget) =>
      setState((s) => ({ ...s, activeLitanyId, tasbihTarget })),
    addIlmPoints: (pts, quizTier) =>
      setState((s) => ({
        ...s,
        hasInteracted: true,
        ilmPoints: s.ilmPoints + pts,
        bestQuizTier: quizTier ? Math.max(s.bestQuizTier, quizTier) : s.bestQuizTier,
      })),
    logQuranAyah: (ref) =>
      setState((s) => ({
        ...s,
        hasInteracted: true,
        lastQuranRef: ref,
        quranVersesToday: s.quranVersesToday + 1,
      })),
    logSajda: (ref, action) =>
      setState((s) => {
        if (action === "now") {
          return {
            ...s,
            hasInteracted: true,
            sajdaCompleted: Array.from(new Set([...s.sajdaCompleted, ref])),
            sajdaQueue: s.sajdaQueue.filter((x) => x !== ref),
          };
        }
        return {
          ...s,
          hasInteracted: true,
          sajdaQueue: Array.from(new Set([...s.sajdaQueue, ref])),
        };
      }),
    decrementQazaUmri: (p) =>
      setState((s) => ({
        ...s,
        hasInteracted: true,
        qazaUmriRemaining: {
          ...s.qazaUmriRemaining,
          [p]: Math.max(0, s.qazaUmriRemaining[p] - 1),
        },
      })),
    setHawlDate: (hawlHijriMonth, hawlHijriDay) =>
      setState((s) => ({ ...s, hawlHijriMonth, hawlHijriDay })),
    addFamilyBarsi: (b) =>
      setState((s) => ({
        ...s,
        familyBarsis: [...s.familyBarsis, { ...b, id: `b-${Date.now()}` }],
      })),
    upsertCustomAuliya: (a, actorNote) =>
      setState((s) => ({
        ...s,
        customAuliya: [...s.customAuliya.filter((x) => x.id !== a.id), a],
        auditLogs: [
          {
            id: `aud-${Date.now()}`,
            timestamp: new Date().toISOString(),
            actor: actorNote,
            action: a.status,
            target: `${a.name} (${a.city})`,
          },
          ...s.auditLogs,
        ],
      })),
    signInUser: (user) => setState((s) => ({ ...s, user })),
    signOutUser: () => setState((s) => ({ ...s, user: null })),
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
