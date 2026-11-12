import {
  Coordinates,
  CalculationMethod,
  PrayerTimes,
  Madhab,
  Qibla,
  SunnahTimes,
  CalculationParameters,
} from "adhan";

export type PrayerName = "fajr" | "dhuhr" | "asr" | "maghrib" | "isha";

export type CalcMethodId =
  | "Karachi"
  | "MuslimWorldLeague"
  | "UmmAlQura"
  | "MoonsightingCommittee"
  | "NorthAmerica"
  | "Turkey";

export interface PrayerCustomConfig {
  mode: "offset" | "fixed";
  offsetMinutes: number; // e.g., +15 min after Azan
  fixedTime: string; // HH:mm 24h e.g., "13:15"
  manualAdjustMinutes: number; // ± minutes calibration
  azanAudioEnabled: boolean;
  salawatBeforeAzan: boolean;
  preJamaatAlertMinutes: 5 | 10 | 0;
}

export type PrayerSettingsMap = Record<PrayerName, PrayerCustomConfig>;

export const DEFAULT_PRAYER_SETTINGS: PrayerSettingsMap = {
  fajr: { mode: "offset", offsetMinutes: 25, fixedTime: "05:30", manualAdjustMinutes: 0, azanAudioEnabled: true, salawatBeforeAzan: true, preJamaatAlertMinutes: 10 },
  dhuhr: { mode: "offset", offsetMinutes: 15, fixedTime: "13:15", manualAdjustMinutes: 0, azanAudioEnabled: true, salawatBeforeAzan: true, preJamaatAlertMinutes: 10 },
  asr: { mode: "offset", offsetMinutes: 15, fixedTime: "16:30", manualAdjustMinutes: 0, azanAudioEnabled: true, salawatBeforeAzan: false, preJamaatAlertMinutes: 5 },
  maghrib: { mode: "offset", offsetMinutes: 5, fixedTime: "18:05", manualAdjustMinutes: 0, azanAudioEnabled: true, salawatBeforeAzan: true, preJamaatAlertMinutes: 5 },
  isha: { mode: "offset", offsetMinutes: 15, fixedTime: "20:00", manualAdjustMinutes: 0, azanAudioEnabled: true, salawatBeforeAzan: true, preJamaatAlertMinutes: 10 },
};

export interface CityPreset {
  id: string;
  name: string;
  country: string;
  lat: number;
  lng: number;
}

export const CITY_PRESETS: CityPreset[] = [
  { id: "ajmer", name: "Ajmer Sharif", country: "India", lat: 26.4499, lng: 74.6399 },
  { id: "bareilly", name: "Bareilly Sharif", country: "India", lat: 28.367, lng: 79.4304 },
  { id: "baghdad", name: "Baghdad Sharif", country: "Iraq", lat: 33.3152, lng: 44.3661 },
  { id: "karachi", name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011 },
  { id: "lahore", name: "Lahore (Data Darbar)", country: "Pakistan", lat: 31.5763, lng: 74.3046 },
  { id: "makkah", name: "Makkah al-Mukarramah", country: "Saudi Arabia", lat: 21.4225, lng: 39.8262 },
  { id: "madinah", name: "Madinah al-Munawwarah", country: "Saudi Arabia", lat: 24.4672, lng: 39.6112 },
  { id: "london", name: "London", country: "UK", lat: 51.5074, lng: -0.1278 },
  { id: "newyork", name: "New York", country: "USA", lat: 40.7128, lng: -74.006 },
];

export interface ComputedPrayerRow {
  name: PrayerName;
  label: string;
  azanTime: Date;
  jamaatTime: Date;
  config: PrayerCustomConfig;
  isConflict: boolean; // True if fixed Jamaat is earlier than Azan
}

export interface MakruhWindow {
  id: "sunrise" | "zawal" | "sunset";
  label: string;
  start: Date;
  end: Date;
  description: string;
}

export interface HanafiPrayerSchedule {
  rows: ComputedPrayerRow[];
  sunrise: Date;
  ishraq: Date;
  chasht: Date;
  dahwaKubra: Date;
  sunset: Date;
  tahajjudStart: Date;
  qiblaBearing: number;
  makruhWindows: MakruhWindow[];
  activeMakruh: MakruhWindow | null;
  nextPrayer: ComputedPrayerRow;
  currentWaqt: PrayerName | "isha_late" | "makruh";
}

function getMethodParams(methodId: CalcMethodId): CalculationParameters {
  let params: CalculationParameters;
  switch (methodId) {
    case "MuslimWorldLeague":
      params = CalculationMethod.MuslimWorldLeague();
      break;
    case "UmmAlQura":
      params = CalculationMethod.UmmAlQura();
      break;
    case "MoonsightingCommittee":
      params = CalculationMethod.MoonsightingCommittee();
      break;
    case "NorthAmerica":
      params = CalculationMethod.NorthAmerica();
      break;
    case "Turkey":
      params = CalculationMethod.Turkey();
      break;
    case "Karachi":
    default:
      params = CalculationMethod.Karachi();
      break;
  }
  // Strictly lock to Hanafi Madhhab (Asr at Mithlayn) per PRD Section 3 Module 3
  params.madhab = Madhab.Hanafi;
  return params;
}

function addMinutes(d: Date, mins: number): Date {
  return new Date(d.getTime() + mins * 60000);
}

function parseFixedTime(baseDate: Date, hhmm: string): Date {
  const [hStr, mStr] = hhmm.split(":");
  const h = Math.min(23, Math.max(0, parseInt(hStr || "12", 10) || 0));
  const m = Math.min(59, Math.max(0, parseInt(mStr || "0", 10) || 0));
  const out = new Date(baseDate);
  out.setHours(h, m, 0, 0);
  return out;
}

export function computeHanafiSchedule(
  lat: number,
  lng: number,
  date: Date,
  methodId: CalcMethodId,
  settings: PrayerSettingsMap
): HanafiPrayerSchedule {
  const coords = new Coordinates(lat, lng);
  const params = getMethodParams(methodId);
  const pt = new PrayerTimes(coords, date, params);
  const sunnah = new SunnahTimes(pt);

  const labels: Record<PrayerName, string> = {
    fajr: "Fajr",
    dhuhr: "Dhuhr",
    asr: "Asr (Hanafi Mithlayn)",
    maghrib: "Maghrib",
    isha: "Isha",
  };

  const baseTimes: Record<PrayerName, Date> = {
    fajr: pt.fajr,
    dhuhr: pt.dhuhr,
    asr: pt.asr,
    maghrib: pt.maghrib,
    isha: pt.isha,
  };

  const rows: ComputedPrayerRow[] = (["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerName[]).map(
    (name) => {
      const cfg = settings[name];
      const azanTime = addMinutes(baseTimes[name], cfg.manualAdjustMinutes || 0);
      let jamaatTime: Date;
      let isConflict = false;
      if (cfg.mode === "fixed") {
        jamaatTime = parseFixedTime(date, cfg.fixedTime);
        if (jamaatTime.getTime() < azanTime.getTime()) {
          isConflict = true;
        }
      } else {
        jamaatTime = addMinutes(azanTime, cfg.offsetMinutes);
      }
      return {
        name,
        label: labels[name],
        azanTime,
        jamaatTime,
        config: cfg,
        isConflict,
      };
    }
  );

  // Hanafi Nafl & Makruh Tahrimi windows
  const sunrise = pt.sunrise;
  const sunset = pt.sunset;
  const ishraq = addMinutes(sunrise, 20);
  const chasht = new Date(sunrise.getTime() + (pt.dhuhr.getTime() - sunrise.getTime()) * 0.45);
  // Dahwa-e-Kubra: midpoint between Subh Sadiq (Fajr) and Sunset
  const dahwaKubra = new Date((pt.fajr.getTime() + sunset.getTime()) / 2);

  // Solar noon (Istiwa/Zawal) ~5 mins before Dhuhr start
  const zawalEnd = pt.dhuhr;
  const zawalStart = addMinutes(zawalEnd, -8);

  const makruhWindows: MakruhWindow[] = [
    {
      id: "sunrise",
      label: "Tulu-e-Aftab (Sunrise Prohibition)",
      start: sunrise,
      end: addMinutes(sunrise, 20),
      description: "Salah and Sajda-e-Tilawat are Makruh Tahrimi for 20 minutes after sunrise.",
    },
    {
      id: "zawal",
      label: "Istiwa / Zawal (Zenith Prohibition)",
      start: zawalStart,
      end: zawalEnd,
      description: "Midday solar zenith window before Dhuhr enters.",
    },
    {
      id: "sunset",
      label: "Ghurub-e-Aftab (Sunset Yellowing)",
      start: addMinutes(sunset, -20),
      end: sunset,
      description: "20 minutes before sunset (only that day's Asr may be offered with Karahat).",
    },
  ];

  const nowMs = date.getTime();
  const activeMakruh =
    makruhWindows.find((w) => nowMs >= w.start.getTime() && nowMs <= w.end.getTime()) || null;

  const upcoming = rows.find((r) => r.jamaatTime.getTime() > nowMs);
  const nextPrayer = upcoming ?? {
    ...rows[0],
    azanTime: addMinutes(rows[0].azanTime, 1440),
    jamaatTime: addMinutes(rows[0].jamaatTime, 1440),
  };

  let currentWaqt: PrayerName | "isha_late" | "makruh" = "isha_late";
  if (activeMakruh) {
    currentWaqt = "makruh";
  } else if (nowMs >= pt.fajr.getTime() && nowMs < sunrise.getTime()) {
    currentWaqt = "fajr";
  } else if (nowMs >= pt.dhuhr.getTime() && nowMs < pt.asr.getTime()) {
    currentWaqt = "dhuhr";
  } else if (nowMs >= pt.asr.getTime() && nowMs < sunset.getTime()) {
    currentWaqt = "asr";
  } else if (nowMs >= pt.maghrib.getTime() && nowMs < pt.isha.getTime()) {
    currentWaqt = "maghrib";
  } else if (nowMs >= pt.isha.getTime()) {
    currentWaqt = "isha";
  }

  return {
    rows,
    sunrise,
    ishraq,
    chasht,
    dahwaKubra,
    sunset,
    tahajjudStart: sunnah.lastThirdOfTheNight,
    qiblaBearing: Math.round(Qibla(coords)),
    makruhWindows,
    activeMakruh,
    nextPrayer,
    currentWaqt,
  };
}

export function formatTime(d: Date): string {
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export function formatCountdown(target: Date, now: Date): string {
  const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
