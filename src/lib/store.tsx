"use client";

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { LangCode, LANGUAGES } from "./i18n";
import {
  CalcMethodId,
  CITY_PRESETS,
  CityPreset,
  computeHanafiSchedule,
  DEFAULT_PRAYER_SETTINGS,
  detectCityFromDevice,
  HanafiPrayerSchedule,
  PrayerName,
  PrayerSettingsMap,
  setDisplayTimeZone,
  zonedParts,
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
  provider: "Local";
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
  /** YYYY-MM-DD (city-local) of the last day the app was used — drives daily rollover. */
  lastActiveDate: string;
}

const EMPTY_SALAH: Record<PrayerName, PrayerLogStatus> = {
  fajr: "none",
  dhuhr: "none",
  asr: "none",
  maghrib: "none",
  isha: "none",
};

const EMPTY_SUNNAH: Record<string, boolean> = {
  miswak: false,
  ishraq: false,
  surah_mulk: false,
  tahajjud: false,
};

const DEFAULT_STATE: PersistedState = {
  theme: "dark",
  lang: "en",
  hilalOffset: 0,
  city: CITY_PRESETS[0],
  calcMethod: "Karachi",
  prayerSettings: DEFAULT_PRAYER_SETTINGS,
  salahToday: EMPTY_SALAH,
  sunnahChecks: EMPTY_SUNNAH,
  tasbihTotalToday: 0,
  tasbihTarget: 100,
  activeLitanyId: "durood-razawiyya",
  ilmPoints: 0,
  quranVersesToday: 0,
  lastQuranRef: "1:1",
  sajdaQueue: [],
  sajdaCompleted: [],
  streakDays: 0,
  qazaShieldAvailable: false,
  qazaUmriRemaining: { fajr: 0, dhuhr: 0, asr: 0, maghrib: 0, isha: 0, witr: 0 },
  bestQuizTier: 0,
  hawlHijriMonth: 9,
  hawlHijriDay: 1,
  familyBarsis: [],
  customAuliya: [],
  auditLogs: [],
  user: null,
  hasInteracted: false,
  lastActiveDate: "",
};

const STORAGE_KEY = "auliya_companion_state_v2";

function dayKey(d: Date, tz?: string): string {
  const p = zonedParts(d, tz);
  return `${p.year}-${String(p.month).padStart(2, "0")}-${String(p.day).padStart(2, "0")}`;
}

function daysBetween(a: string, b: string): number {
  const pa = Date.parse(`${a}T00:00:00Z`);
  const pb = Date.parse(`${b}T00:00:00Z`);
  if (Number.isNaN(pa) || Number.isNaN(pb)) return 0;
  return Math.round((pb - pa) / 86400000);
}

/** Reset daily counters when the (city-local) date changes and update the streak. */
function applyDailyRollover(s: PersistedState, today: string): PersistedState {
  if (!s.lastActiveDate) return { ...s, lastActiveDate: today };
  if (s.lastActiveDate === today) return s;
  const gap = daysBetween(s.lastActiveDate, today);
  if (gap <= 0) return { ...s, lastActiveDate: today };

  const allFardLogged = Object.values(s.salahToday).every((v) => v !== "none");
  let streakDays = s.streakDays;
  let qazaShieldAvailable = s.qazaShieldAvailable;
  if (allFardLogged && gap === 1) {
    streakDays += 1;
    if (streakDays > 0 && streakDays % 7 === 0) qazaShieldAvailable = true;
  } else if (qazaShieldAvailable && gap <= 2) {
    // Qaza Shield protects the streak once
    qazaShieldAvailable = false;
  } else {
    streakDays = 0;
  }

  return {
    ...s,
    lastActiveDate: today,
    streakDays,
    qazaShieldAvailable,
    salahToday: EMPTY_SALAH,
    sunnahChecks: EMPTY_SUNNAH,
    tasbihTotalToday: 0,
    quranVersesToday: 0,
  };
}

interface AppContextValue extends PersistedState {
  /** True once localStorage has been read on the client (avoids SSR hydration mismatch). */
  hydrated: boolean;
  now: Date;
  /** Current hour (0-23) in the selected city's timezone. */
  cityHour: number;
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
  setQazaUmri: (counts: Record<PrayerName | "witr", number>) => void;
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
      let next: PersistedState = DEFAULT_STATE;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState>;
          next = { ...DEFAULT_STATE, ...parsed };
        } else {
          // First launch: pick the preset city matching this device's timezone
          const detected = detectCityFromDevice();
          if (detected) next = { ...DEFAULT_STATE, city: detected };
        }
      } catch {
        // ignore corrupted storage
      }
      next = applyDailyRollover(next, dayKey(new Date(), next.city.tz));
      setState(next);
      setNow(new Date());
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

  // Live 1-second clock tick for Azan/Jamaat countdown + midnight rollover
  useEffect(() => {
    if (!hydrated) return;
    const timer = setInterval(() => {
      const t = new Date();
      setNow(t);
      setState((s) => applyDailyRollover(s, dayKey(t, s.city.tz)));
    }, 1000);
    return () => clearInterval(timer);
  }, [hydrated]);

  // All displayed times use the selected city's timezone
  setDisplayTimeZone(state.city.tz);

  const hijri = useMemo(() => getHijriDate(now, state.hilalOffset), [now, state.hilalOffset]);

  const schedule = useMemo(
    () =>
      computeHanafiSchedule(
        state.city.lat,
        state.city.lng,
        now,
        state.calcMethod,
        state.prayerSettings,
        state.city.tz
      ),
    [state.city.lat, state.city.lng, state.city.tz, now, state.calcMethod, state.prayerSettings]
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
    hydrated,
    now,
    cityHour: zonedParts(now, state.city.tz).hour,
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
    setQazaUmri: (counts) =>
      setState((s) => ({ ...s, hasInteracted: true, qazaUmriRemaining: { ...counts } })),
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
