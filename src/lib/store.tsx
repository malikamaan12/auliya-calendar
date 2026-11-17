"use client";

import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { getLangMeta, LangCode } from "./i18n";
import {
  getThemeMeta,
  normalizeThemeId,
  PersistedThemeInput,
  SanctuaryThemeMeta,
  ThemeId,
} from "./themes";
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
import {
  fetchWeatherAndAqi,
  LiveWeatherData,
  resolveCityForTimezone,
  reverseGeocodeGps,
} from "./location-weather";
import { getHijriDate, HijriDateInfo, IslamicEvent, SACRED_EVENTS } from "./hijri";
import { AULIYA_DATA, AuliyaProfile } from "@/data/auliya";
import { backendClient } from "./backend-client";
import {
  BarsiIsalGiftLog,
  BarsiRecord,
  GamificationConfig,
  ManagedAuliyaRecord,
  ModuleConfigRecord,
  PlatformSettings,
  PublicBackendView,
  PublicUserAccount,
  SpiritualRankConfig,
  UrsEventRecord,
  UserRole,
  ZakatBackendConfig,
} from "./backend-types";

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
  role?: UserRole;
  title?: string;
  provider: "Local" | "Backend";
}

export interface XpToastNotification {
  id: string;
  xp: number;
  label: string;
}

interface PersistedState {
  theme: ThemeId;
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
  qiblaCalibrationOffset: number;
  lastActiveDate: string;
  claimedQuestsToday: string[];
  barsiFatihaToday: number;
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
  theme: "indigo-night",
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
  ilmPoints: 120,
  quranVersesToday: 0,
  lastQuranRef: "1:1",
  sajdaQueue: [],
  sajdaCompleted: [],
  streakDays: 1,
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
  qiblaCalibrationOffset: 0,
  lastActiveDate: "",
  claimedQuestsToday: [],
  barsiFatihaToday: 0,
};

const FALLBACK_BACKEND: PublicBackendView = {
  currentUser: null,
  auliyaRecords: AULIYA_DATA.map((a, idx) => ({
    ...a,
    createdByUserId: "system",
    createdByName: "Scholarly Archive",
    updatedAt: "2026-11-16T00:00:00.000Z",
    featured: idx < 4,
  })),
  ursEvents: SACRED_EVENTS.map((ev, idx) => ({
    id: `fallback_ev_${idx}`,
    month: ev.month,
    day: ev.day,
    title: ev.title,
    urduTitle: ev.title,
    subtitle: ev.subtitle,
    city: "Sacred",
    country: "Ummah",
    auliyaId: ev.auliyaId,
    type: ev.type,
    recommendedWird: "Surah Al-Fatihah & Durood-e-Pak",
    featured: true,
    status: "Published",
    createdByUserId: "system",
    createdByName: "System",
    updatedAt: "2026-11-16T00:00:00.000Z",
  })),
  barsiRecords: [],
  modules: [
    { id: "quran", href: "/quran", iconKey: "BookOpen", i18nTitleKey: "navQuran", customTitle: "", subtitleTemplate: "604-Page Mushaf", badgeText: "Mushaf", enabled: true, featured: true, showInBottomNav: true, order: 1 },
    { id: "prayer", href: "/prayer", iconKey: "Clock", i18nTitleKey: "navPrayer", customTitle: "", subtitleTemplate: "Hanafi Waqt & Qibla", badgeText: "Live GPS", enabled: true, featured: true, showInBottomNav: true, order: 2 },
    { id: "tasbih", href: "/tasbih", iconKey: "Sparkles", i18nTitleKey: "navTasbih", customTitle: "", subtitleTemplate: "Adhkar & Duas", badgeText: "Dhikr", enabled: true, featured: false, showInBottomNav: true, order: 3 },
    { id: "auliya", href: "/auliya", iconKey: "Compass", i18nTitleKey: "navAuliya", customTitle: "", subtitleTemplate: "360° Ziyarat & Urs", badgeText: "360°", enabled: true, featured: true, showInBottomNav: false, order: 4 },
    { id: "fiqh", href: "/fiqh", iconKey: "Scale", i18nTitleKey: "navFiqh", customTitle: "", subtitleTemplate: "11 Hadith Books & Namaz", badgeText: "36.5k", enabled: true, featured: true, showInBottomNav: false, order: 5 },
    { id: "quiz", href: "/quiz", iconKey: "Trophy", i18nTitleKey: "navQuiz", customTitle: "", subtitleTemplate: "15 Tiers • 300 Qs", badgeText: "XP", enabled: true, featured: false, showInBottomNav: false, order: 6 },
    { id: "zakat", href: "/zakat", iconKey: "Calculator", i18nTitleKey: "navZakat", customTitle: "", subtitleTemplate: "Silver Nisab & Fitrah", badgeText: "52.5 Tola", enabled: true, featured: false, showInBottomNav: false, order: 7 },
    { id: "barsi", href: "/barsi", iconKey: "HeartHandshake", i18nTitleKey: "navBarsi", customTitle: "", subtitleTemplate: "Family Khatm & Fatiha", badgeText: "Isal-e-Sawab", enabled: true, featured: false, showInBottomNav: false, order: 8 },
    { id: "admin", href: "/admin", iconKey: "ShieldCheck", i18nTitleKey: "navAdmin", customTitle: "", subtitleTemplate: "RBAC & Modular CMS", badgeText: "RBAC", enabled: true, featured: false, showInBottomNav: false, order: 9 },
  ],
  zakatConfig: {
    silverNisabGrams: 612.36,
    goldNisabGrams: 87.48,
    lunarRatePercent: 2.5,
    solarRatePercent: 2.577,
    fitrahWheatKg: 1.92,
    fitrahOtherKg: 3.84,
    updatedAt: "2026-11-16T00:00:00.000Z",
    currencies: [
      { code: "USD", name: "US Dollar", symbol: "$", goldPerGram24K: 86.5, silverPerGram: 1.08, fitrahWheatPerKg: 2.6, fitrahDatesPerKg: 9.5, fitrahRaisinsPerKg: 8.2, fitrahBarleyPerKg: 3.1 },
      { code: "INR", name: "Indian Rupee", symbol: "₹", goldPerGram24K: 7650, silverPerGram: 94, fitrahWheatPerKg: 48, fitrahDatesPerKg: 380, fitrahRaisinsPerKg: 420, fitrahBarleyPerKg: 65 },
      { code: "PKR", name: "Pakistani Rupee", symbol: "₨", goldPerGram24K: 24200, silverPerGram: 305, fitrahWheatPerKg: 165, fitrahDatesPerKg: 1150, fitrahRaisinsPerKg: 1450, fitrahBarleyPerKg: 230 },
    ],
  },
  gamificationConfig: {
    ranks: [
      { level: 1, title: "Talib-e-Ilm", arabicTitle: "طالب العلم", minXp: 0, badgeHex: "#94A3B8", perk: "Sanctuary Initiate" },
      { level: 2, title: "Salik", arabicTitle: "سالك الطريق", minXp: 150, badgeHex: "#38BDF8", perk: "Wayfarer" },
    ],
    dailyQuests: [],
    xpRewards: {
      salahOnTime: 25,
      salahJamaat: 40,
      sunnahCheck: 15,
      quranPage: 20,
      tasbihMilestone: 25,
      zakatLogged: 60,
      barsiFatihaGift: 35,
      curatorSubmission: 75,
    },
  },
  platformSettings: {
    platformTitle: "Auliya Calendar & Sunni Companion",
    platformTagline: "Modular Sunni Hanafi Digital Sanctuary",
    announcementEnabled: false,
    announcementBadge: "Sanctuary",
    announcementText: "",
    announcementHref: "/admin",
    defaultTheme: "indigo-night",
    defaultLang: "en",
    allowSelfRegistration: true,
    requireScholarVerificationForPublish: true,
    updatedAt: "2026-11-16T00:00:00.000Z",
  },
  auditLogs: [],
  backendMode: "local-engine",
};

const STORAGE_KEY = "auliya_companion_state_v2";
const WEATHER_CACHE_KEY = "auliya_weather_cache_v1";

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
    claimedQuestsToday: [],
    barsiFatihaToday: 0,
  };
}

interface AppContextValue extends PersistedState {
  hydrated: boolean;
  now: Date;
  cityHour: number;
  hijri: HijriDateInfo;
  schedule: HanafiPrayerSchedule;
  allAuliya: AuliyaProfile[];
  rings: { salah: number; ilm: number; dhikr: number };
  weather: LiveWeatherData | null;
  weatherLoading: boolean;
  weatherError: string | null;
  gpsLoading: boolean;
  gpsError: string | null;

  // Theme & Language Studio
  themeMeta: SanctuaryThemeMeta;
  setTheme: (t: PersistedThemeInput) => void;
  toggleDarkLight: () => void;
  setLang: (l: LangCode) => void;

  // Backend, Auth, RBAC & Dynamic CMS
  backend: PublicBackendView;
  backendLoading: boolean;
  authUser: PublicUserAccount | null;
  dynamicCalendarEvents: IslamicEvent[];
  refreshBackend: () => Promise<void>;
  registerAccount: (p: {
    name: string;
    email: string;
    password: string;
    city?: string;
    requestedRole?: "member" | "creator";
  }) => Promise<void>;
  loginAccount: (p: { email: string; password: string }) => Promise<void>;
  switchDemoRole: (role: UserRole) => Promise<void>;
  logoutAccount: () => Promise<void>;
  updateMyAccount: (patch: { name?: string; title?: string; city?: string }) => Promise<void>;

  cmsUpsertAuliya: (
    input: Partial<ManagedAuliyaRecord> & { name: string; urduName: string; city: string; country: string }
  ) => Promise<void>;
  cmsDeleteAuliya: (id: string) => Promise<void>;
  cmsUpsertUrs: (input: Partial<UrsEventRecord> & { title: string; month: number; day: number }) => Promise<void>;
  cmsDeleteUrs: (id: string) => Promise<void>;
  cmsUpsertBarsi: (
    input: Partial<BarsiRecord> & { personName: string; hijriMonth: number; hijriDay: number }
  ) => Promise<void>;
  cmsLogBarsiGift: (p: {
    barsiId: string;
    donorName?: string;
    giftType: BarsiIsalGiftLog["giftType"];
    count?: number;
  }) => Promise<void>;
  cmsToggleBarsiPara: (p: { barsiId: string; paraNumber: number; readerName?: string }) => Promise<void>;
  cmsDeleteBarsi: (id: string) => Promise<void>;
  cmsSaveModules: (modules: ModuleConfigRecord[]) => Promise<void>;
  cmsSaveZakatConfig: (zakatConfig: ZakatBackendConfig) => Promise<void>;
  cmsSaveGamificationConfig: (gamificationConfig: GamificationConfig) => Promise<void>;
  cmsSavePlatformSettings: (settings: Partial<PlatformSettings>) => Promise<void>;
  cmsAdminUpdateUser: (p: {
    targetUserId: string;
    role?: UserRole;
    status?: "active" | "suspended";
    title?: string;
  }) => Promise<void>;
  cmsExportSnapshot: () => Promise<string>;
  cmsResetDatabase: () => Promise<void>;

  // Gamification & Spiritual Rank
  totalXp: number;
  currentRank: SpiritualRankConfig;
  nextRank: SpiritualRankConfig | null;
  rankProgressPct: number;
  xpToast: XpToastNotification | null;
  awardXp: (xp: number, label: string) => void;
  claimDailyQuest: (questId: string, xp: number, title: string) => void;

  // Existing companion actions
  setHilalOffset: (o: number) => void;
  setCity: (c: CityPreset) => void;
  setTimezone: (tz: string, updateCoordinates?: boolean) => void;
  requestGpsLocation: () => Promise<void>;
  refreshWeather: () => Promise<void>;
  setQiblaCalibrationOffset: (deg: number) => void;
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

  const [backend, setBackend] = useState<PublicBackendView>(FALLBACK_BACKEND);
  const [backendLoading, setBackendLoading] = useState(true);
  const [xpToast, setXpToast] = useState<XpToastNotification | null>(null);

  const [weather, setWeather] = useState<LiveWeatherData | null>(null);
  const [weatherLoading, setWeatherLoading] = useState(false);
  const [weatherError, setWeatherError] = useState<string | null>(null);
  const [gpsLoading, setGpsLoading] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const awardXp = useCallback((xp: number, label: string) => {
    if (!xp || xp <= 0) return;
    const rounded = Math.round(xp);
    setState((s) => ({ ...s, ilmPoints: s.ilmPoints + rounded, hasInteracted: true }));
    const toastId = `xp_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`;
    setXpToast({ id: toastId, xp: rounded, label });
    backendClient.updateMyProfile({ xpDelta: rounded }).then((view) => {
      if (view.currentUser) setBackend(view);
    }).catch(() => null);
  }, []);

  // Auto-dismiss XP celebration toast
  useEffect(() => {
    if (!xpToast) return;
    const timer = setTimeout(() => {
      setXpToast((curr) => (curr?.id === xpToast.id ? null : curr));
    }, 3400);
    return () => clearTimeout(timer);
  }, [xpToast]);

  // Hydrate offline-first from localStorage + modular Backend Engine
  useEffect(() => {
    Promise.resolve().then(async () => {
      let next: PersistedState = DEFAULT_STATE;
      try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
          const parsed = JSON.parse(raw) as Partial<PersistedState> & { theme?: string };
          next = {
            ...DEFAULT_STATE,
            ...parsed,
            theme: normalizeThemeId(parsed.theme),
            claimedQuestsToday: Array.isArray(parsed.claimedQuestsToday)
              ? parsed.claimedQuestsToday
              : [],
            barsiFatihaToday: Number(parsed.barsiFatihaToday) || 0,
          };
        } else {
          const detected = detectCityFromDevice();
          if (detected) {
            next = { ...DEFAULT_STATE, city: detected };
          } else {
            try {
              const deviceTz = Intl.DateTimeFormat().resolvedOptions().timeZone;
              if (deviceTz) {
                next = {
                  ...DEFAULT_STATE,
                  city: resolveCityForTimezone(deviceTz, DEFAULT_STATE.city),
                };
              }
            } catch {
              // ignore
            }
          }
        }
        const rawWeather = localStorage.getItem(WEATHER_CACHE_KEY);
        if (rawWeather) {
          setWeather(JSON.parse(rawWeather) as LiveWeatherData);
        }
      } catch {
        // ignore corrupted storage
      }

      next = applyDailyRollover(next, dayKey(new Date(), next.city.tz));
      setState(next);
      setNow(new Date());
      setHydrated(true);

      try {
        const view = await backendClient.fetchState();
        setBackend(view);
      } catch {
        // keep fallback
      } finally {
        setBackendLoading(false);
      }
    });
  }, []);

  // Persist local companion state
  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // ignore quota errors
    }
  }, [state, hydrated]);

  // Fetch live Weather & AQI whenever coordinates change
  const loadWeatherForCoords = useCallback(async (lat: number, lng: number) => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const data = await fetchWeatherAndAqi(lat, lng);
      setWeather(data);
      try {
        localStorage.setItem(WEATHER_CACHE_KEY, JSON.stringify(data));
      } catch {
        // ignore
      }
      if (data.resolvedTimezone) {
        setState((prev) => {
          if (prev.city.id === "gps" && prev.city.tz !== data.resolvedTimezone) {
            return {
              ...prev,
              city: { ...prev.city, tz: data.resolvedTimezone },
            };
          }
          return prev;
        });
      }
    } catch {
      setWeatherError("Live weather temporarily unreachable.");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!hydrated) return;
    Promise.resolve().then(() => {
      loadWeatherForCoords(state.city.lat, state.city.lng);
    });
  }, [hydrated, state.city.lat, state.city.lng, loadWeatherForCoords]);

  const requestGpsLocation = useCallback(async () => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      setGpsError("Geolocation is not supported by this browser.");
      return;
    }
    setGpsLoading(true);
    setGpsError(null);
    return new Promise<void>((resolve) => {
      navigator.geolocation.getCurrentPosition(
        async (pos) => {
          try {
            const preset = await reverseGeocodeGps(pos.coords.latitude, pos.coords.longitude);
            setState((s) => ({ ...s, city: preset }));
          } catch {
            let tz: string | undefined;
            try {
              tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
            } catch {
              tz = undefined;
            }
            setState((s) => ({
              ...s,
              city: {
                id: "gps",
                name: "GPS Location",
                country: `${pos.coords.latitude.toFixed(3)}°, ${pos.coords.longitude.toFixed(3)}°`,
                lat: Number(pos.coords.latitude.toFixed(5)),
                lng: Number(pos.coords.longitude.toFixed(5)),
                tz,
              },
            }));
          } finally {
            setGpsLoading(false);
            resolve();
          }
        },
        (err) => {
          setGpsLoading(false);
          setGpsError(
            err.code === 1
              ? "Location permission denied. Allow GPS access or select your timezone/city."
              : "Could not acquire GPS signal. Please select your timezone or search your city."
          );
          resolve();
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
      );
    });
  }, []);

  const setTimezone = useCallback((tz: string, updateCoordinates = true) => {
    setState((s) => {
      if (!updateCoordinates) {
        return { ...s, city: { ...s.city, tz } };
      }
      return {
        ...s,
        city: resolveCityForTimezone(tz, s.city),
      };
    });
  }, []);

  const themeMeta = useMemo(() => getThemeMeta(state.theme), [state.theme]);

  // Apply HTML data-theme attribute, dark/light mode class, and RTL/LTR direction
  useEffect(() => {
    const html = document.documentElement;
    html.setAttribute("data-theme", themeMeta.id);
    if (themeMeta.mode === "dark") {
      html.classList.add("dark");
    } else {
      html.classList.remove("dark");
    }
    const langMeta = getLangMeta(state.lang);
    html.setAttribute("dir", langMeta.dir);
    html.setAttribute("lang", state.lang === "ro_ur" ? "en" : state.lang);
  }, [themeMeta.id, themeMeta.mode, state.lang]);

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

  // Unified Auliya list driven by Backend CMS + any legacy local custom profiles
  const allAuliya = useMemo(() => {
    const map = new Map<string, AuliyaProfile>();
    for (const a of backend.auliyaRecords) {
      if (a.status === "Published") map.set(a.id, a);
    }
    for (const a of state.customAuliya) {
      map.set(a.id, a);
    }
    if (map.size === 0) {
      for (const a of AULIYA_DATA) map.set(a.id, a);
    }
    return Array.from(map.values());
  }, [backend.auliyaRecords, state.customAuliya]);

  // Unified Family Barsis bridging Backend Barsi records + legacy local array
  const unifiedFamilyBarsis = useMemo<FamilyBarsi[]>(() => {
    const fromBackend: FamilyBarsi[] = backend.barsiRecords.map((b) => ({
      id: b.id,
      personName: b.personName,
      hijriMonth: b.hijriMonth,
      hijriDay: b.hijriDay,
      relation: b.relation,
    }));
    const seen = new Set(fromBackend.map((x) => x.id));
    const merged = [...fromBackend];
    for (const b of state.familyBarsis) {
      if (!seen.has(b.id)) merged.push(b);
    }
    return merged;
  }, [backend.barsiRecords, state.familyBarsis]);

  // Dynamic Calendar Events driven by Backend Urs CMS + Family Barsis
  const dynamicCalendarEvents = useMemo<IslamicEvent[]>(() => {
    const urs: IslamicEvent[] = backend.ursEvents
      .filter((u) => u.status === "Published")
      .map((u) => ({
        month: u.month,
        day: u.day,
        title: u.title,
        subtitle: u.subtitle,
        auliyaId: u.auliyaId,
        type: u.type,
      }));
    const barsis: IslamicEvent[] = backend.barsiRecords
      .filter((b) => b.visibility === "private" || b.hijriMonth > 0)
      .map((b) => ({
        month: b.hijriMonth,
        day: b.hijriDay,
        title: `Barsi: ${b.personName}`,
        subtitle: `${b.relation} • Gift Surah Fatiha & Isal-e-Sawab`,
        type: "urs" as const,
      }));
    return [...urs, ...barsis];
  }, [backend.ursEvents, backend.barsiRecords]);

  // Unified auditLogs bridging Backend SHA-256 logs + legacy AuditEntry shape
  const unifiedAuditLogs = useMemo<AuditEntry[]>(() => {
    const fromBackend: AuditEntry[] = backend.auditLogs.map((l) => ({
      id: l.id,
      timestamp: l.timestamp,
      actor: `${l.actorName} (${l.actorRole})`,
      action: l.action,
      target: l.target,
    }));
    return [...fromBackend, ...state.auditLogs];
  }, [backend.auditLogs, state.auditLogs]);

  // Unified User bridging Backend Auth session + Guest personalization
  const unifiedUser = useMemo<AppUser | null>(() => {
    if (backend.currentUser) {
      return {
        name: backend.currentUser.name,
        email: backend.currentUser.email,
        role: backend.currentUser.role,
        title: backend.currentUser.title,
        provider: "Backend",
      };
    }
    return state.user;
  }, [backend.currentUser, state.user]);

  // Gamification Spiritual Rank calculation
  const totalXp = useMemo(
    () => Math.max(state.ilmPoints, backend.currentUser?.xp ?? 0),
    [state.ilmPoints, backend.currentUser]
  );

  const { currentRank, nextRank, rankProgressPct } = useMemo(() => {
    const sorted = [...backend.gamificationConfig.ranks].sort((a, b) => a.minXp - b.minXp);
    let curr = sorted[0] || FALLBACK_BACKEND.gamificationConfig.ranks[0];
    let nxt: SpiritualRankConfig | null = null;
    for (let i = 0; i < sorted.length; i++) {
      if (totalXp >= sorted[i].minXp) {
        curr = sorted[i];
        nxt = sorted[i + 1] || null;
      }
    }
    if (!nxt) return { currentRank: curr, nextRank: null, rankProgressPct: 100 };
    const span = Math.max(1, nxt.minXp - curr.minXp);
    const pct = Math.min(100, Math.max(0, Math.round(((totalXp - curr.minXp) / span) * 100)));
    return { currentRank: curr, nextRank: nxt, rankProgressPct: pct };
  }, [backend.gamificationConfig.ranks, totalXp]);

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

  const refreshBackend = useCallback(async () => {
    const view = await backendClient.fetchState();
    setBackend(view);
  }, []);

  const value: AppContextValue = {
    ...state,
    familyBarsis: unifiedFamilyBarsis,
    auditLogs: unifiedAuditLogs,
    user: unifiedUser,
    hydrated,
    now,
    cityHour: zonedParts(now, state.city.tz).hour,
    hijri,
    schedule,
    allAuliya,
    rings,
    weather,
    weatherLoading,
    weatherError,
    gpsLoading,
    gpsError,

    themeMeta,
    setTheme: (input) => setState((s) => ({ ...s, theme: normalizeThemeId(input) })),
    toggleDarkLight: () =>
      setState((s) => ({
        ...s,
        theme: getThemeMeta(s.theme).mode === "dark" ? "alabaster-lavender" : "indigo-night",
      })),
    setLang: (lang) => setState((s) => ({ ...s, lang })),

    backend,
    backendLoading,
    authUser: backend.currentUser,
    dynamicCalendarEvents,
    refreshBackend,
    registerAccount: async (p) => {
      const view = await backendClient.register(p);
      setBackend(view);
      awardXp(100, "Account Created — Welcome Bonus!");
    },
    loginAccount: async (p) => {
      const view = await backendClient.login(p);
      setBackend(view);
    },
    switchDemoRole: async (role) => {
      const view = await backendClient.demoSwitchRole(role);
      setBackend(view);
    },
    logoutAccount: async () => {
      const view = await backendClient.logout();
      setBackend(view);
      setState((s) => ({ ...s, user: null }));
    },
    updateMyAccount: async (patch) => {
      const view = await backendClient.updateMyProfile(patch);
      setBackend(view);
    },

    cmsUpsertAuliya: async (input) => {
      const view = await backendClient.upsertAuliya(input);
      setBackend(view);
      awardXp(backend.gamificationConfig.xpRewards.curatorSubmission, `Saved ${input.name}`);
    },
    cmsDeleteAuliya: async (id) => {
      const view = await backendClient.deleteAuliya(id);
      setBackend(view);
    },
    cmsUpsertUrs: async (input) => {
      const view = await backendClient.upsertUrs(input);
      setBackend(view);
      awardXp(45, `Saved Urs: ${input.title}`);
    },
    cmsDeleteUrs: async (id) => {
      const view = await backendClient.deleteUrs(id);
      setBackend(view);
    },
    cmsUpsertBarsi: async (input) => {
      const view = await backendClient.upsertBarsi(input);
      setBackend(view);
      awardXp(30, `Saved Barsi: ${input.personName}`);
    },
    cmsLogBarsiGift: async (p) => {
      const view = await backendClient.logBarsiGift(p);
      setBackend(view);
      setState((s) => ({ ...s, barsiFatihaToday: s.barsiFatihaToday + 1 }));
      awardXp(backend.gamificationConfig.xpRewards.barsiFatihaGift, `Isal-e-Sawab: ${p.giftType}`);
    },
    cmsToggleBarsiPara: async (p) => {
      const view = await backendClient.toggleBarsiPara(p);
      setBackend(view);
      awardXp(30, `Khatm-e-Quran Para ${p.paraNumber}`);
    },
    cmsDeleteBarsi: async (id) => {
      const view = await backendClient.deleteBarsi(id);
      setBackend(view);
    },
    cmsSaveModules: async (modules) => {
      const view = await backendClient.saveModules(modules);
      setBackend(view);
    },
    cmsSaveZakatConfig: async (zakatConfig) => {
      const view = await backendClient.saveZakatConfig(zakatConfig);
      setBackend(view);
    },
    cmsSaveGamificationConfig: async (gamificationConfig) => {
      const view = await backendClient.saveGamificationConfig(gamificationConfig);
      setBackend(view);
    },
    cmsSavePlatformSettings: async (settings) => {
      const view = await backendClient.savePlatformSettings(settings);
      setBackend(view);
    },
    cmsAdminUpdateUser: async (p) => {
      const view = await backendClient.adminUpdateUser(p);
      setBackend(view);
    },
    cmsExportSnapshot: () => backendClient.exportSnapshotJson(),
    cmsResetDatabase: async () => {
      const view = await backendClient.resetDatabaseToDefaults();
      setBackend(view);
    },

    totalXp,
    currentRank,
    nextRank,
    rankProgressPct,
    xpToast,
    awardXp,
    claimDailyQuest: (questId, xp, title) => {
      if (state.claimedQuestsToday.includes(questId)) return;
      setState((s) => ({
        ...s,
        claimedQuestsToday: [...s.claimedQuestsToday, questId],
      }));
      awardXp(xp, `Quest Complete: ${title}`);
    },

    setHilalOffset: (hilalOffset) =>
      setState((s) => ({ ...s, hilalOffset: Math.max(-2, Math.min(2, hilalOffset)) })),
    setCity: (city) => setState((s) => ({ ...s, city })),
    setTimezone,
    requestGpsLocation,
    refreshWeather: () => loadWeatherForCoords(state.city.lat, state.city.lng),
    setQiblaCalibrationOffset: (deg) =>
      setState((s) => ({ ...s, qiblaCalibrationOffset: Math.max(-30, Math.min(30, deg)) })),
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
    logSalah: (p, status) => {
      const prev = state.salahToday[p];
      setState((s) => ({
        ...s,
        hasInteracted: true,
        salahToday: { ...s.salahToday, [p]: status },
      }));
      if (prev === "none" && status !== "none") {
        const reward =
          status === "jamaat"
            ? backend.gamificationConfig.xpRewards.salahJamaat
            : backend.gamificationConfig.xpRewards.salahOnTime;
        awardXp(reward, `${p.toUpperCase()} Logged (${status})`);
      }
    },
    toggleSunnah: (id) => {
      const wasDone = Boolean(state.sunnahChecks[id]);
      setState((s) => ({
        ...s,
        hasInteracted: true,
        sunnahChecks: { ...s.sunnahChecks, [id]: !s.sunnahChecks[id] },
      }));
      if (!wasDone) {
        awardXp(backend.gamificationConfig.xpRewards.sunnahCheck, "Sunnah Revived");
      }
    },
    incrementTasbih: (step = 1) => {
      const nextCount = state.tasbihTotalToday + step;
      setState((s) => ({
        ...s,
        hasInteracted: true,
        tasbihTotalToday: s.tasbihTotalToday + step,
      }));
      if (nextCount > 0 && nextCount % 33 === 0) {
        awardXp(backend.gamificationConfig.xpRewards.tasbihMilestone, `${nextCount} Tasbihat Milestone`);
      }
    },
    resetTasbihToday: () => setState((s) => ({ ...s, tasbihTotalToday: 0 })),
    setActiveLitany: (activeLitanyId, tasbihTarget) =>
      setState((s) => ({ ...s, activeLitanyId, tasbihTarget })),
    addIlmPoints: (pts, quizTier) => {
      setState((s) => ({
        ...s,
        hasInteracted: true,
        ilmPoints: s.ilmPoints + pts,
        bestQuizTier: quizTier ? Math.max(s.bestQuizTier, quizTier) : s.bestQuizTier,
      }));
      if (pts > 0) {
        backendClient.updateMyProfile({ xpDelta: pts }).then((v) => {
          if (v.currentUser) setBackend(v);
        }).catch(() => null);
      }
    },
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
    addFamilyBarsi: (b) => {
      backendClient
        .upsertBarsi({
          personName: b.personName,
          hijriMonth: b.hijriMonth,
          hijriDay: b.hijriDay,
          relation: b.relation,
          visibility: "private",
        })
        .then((view) => setBackend(view))
        .catch(() => {
          setState((s) => ({
            ...s,
            familyBarsis: [...s.familyBarsis, { ...b, id: `b-${Date.now()}` }],
          }));
        });
    },
    upsertCustomAuliya: (a, actorNote) => {
      backendClient
        .upsertAuliya({ ...a, createdByName: actorNote })
        .then((view) => setBackend(view))
        .catch(() => {
          setState((s) => ({
            ...s,
            customAuliya: [...s.customAuliya.filter((x) => x.id !== a.id), a],
          }));
        });
    },
    signInUser: (user) => setState((s) => ({ ...s, user })),
    signOutUser: () => {
      backendClient.logout().then((v) => setBackend(v)).catch(() => null);
      setState((s) => ({ ...s, user: null }));
    },
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside AppProvider");
  return ctx;
}
