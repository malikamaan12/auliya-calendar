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
  /** IANA timezone, e.g. "Asia/Kolkata". Undefined = viewer's device timezone (GPS). */
  tz?: string;
}

export const CITY_PRESETS: CityPreset[] = [
  { id: "ajmer", name: "Ajmer Sharif", country: "India", lat: 26.4499, lng: 74.6399, tz: "Asia/Kolkata" },
  { id: "bareilly", name: "Bareilly Sharif", country: "India", lat: 28.367, lng: 79.4304, tz: "Asia/Kolkata" },
  { id: "delhi", name: "Delhi", country: "India", lat: 28.6139, lng: 77.209, tz: "Asia/Kolkata" },
  { id: "mumbai", name: "Mumbai", country: "India", lat: 19.076, lng: 72.8777, tz: "Asia/Kolkata" },
  { id: "hyderabad", name: "Hyderabad", country: "India", lat: 17.385, lng: 78.4867, tz: "Asia/Kolkata" },
  { id: "karachi", name: "Karachi", country: "Pakistan", lat: 24.8607, lng: 67.0011, tz: "Asia/Karachi" },
  { id: "lahore", name: "Lahore (Data Darbar)", country: "Pakistan", lat: 31.5763, lng: 74.3046, tz: "Asia/Karachi" },
  { id: "dhaka", name: "Dhaka", country: "Bangladesh", lat: 23.8103, lng: 90.4125, tz: "Asia/Dhaka" },
  { id: "baghdad", name: "Baghdad Sharif", country: "Iraq", lat: 33.3152, lng: 44.3661, tz: "Asia/Baghdad" },
  { id: "makkah", name: "Makkah al-Mukarramah", country: "Saudi Arabia", lat: 21.4225, lng: 39.8262, tz: "Asia/Riyadh" },
  { id: "madinah", name: "Madinah al-Munawwarah", country: "Saudi Arabia", lat: 24.4672, lng: 39.6112, tz: "Asia/Riyadh" },
  { id: "doha", name: "Doha", country: "Qatar", lat: 25.2854, lng: 51.531, tz: "Asia/Qatar" },
  { id: "dubai", name: "Dubai", country: "UAE", lat: 25.2048, lng: 55.2708, tz: "Asia/Dubai" },
  { id: "istanbul", name: "Istanbul", country: "Türkiye", lat: 41.0082, lng: 28.9784, tz: "Europe/Istanbul" },
  { id: "cairo", name: "Cairo", country: "Egypt", lat: 30.0444, lng: 31.2357, tz: "Africa/Cairo" },
  { id: "london", name: "London", country: "UK", lat: 51.5074, lng: -0.1278, tz: "Europe/London" },
  { id: "birmingham", name: "Birmingham", country: "UK", lat: 52.4862, lng: -1.8904, tz: "Europe/London" },
  { id: "toronto", name: "Toronto", country: "Canada", lat: 43.6532, lng: -79.3832, tz: "America/Toronto" },
  { id: "newyork", name: "New York", country: "USA", lat: 40.7128, lng: -74.006, tz: "America/New_York" },
  { id: "chicago", name: "Chicago", country: "USA", lat: 41.8781, lng: -87.6298, tz: "America/Chicago" },
  { id: "houston", name: "Houston", country: "USA", lat: 29.7604, lng: -95.3698, tz: "America/Chicago" },
  { id: "losangeles", name: "Los Angeles", country: "USA", lat: 34.0522, lng: -118.2437, tz: "America/Los_Angeles" },
];

/** Pick the preset whose timezone matches the viewer's device, used on first launch. */
export function detectCityFromDevice(): CityPreset | null {
  try {
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
    return CITY_PRESETS.find((c) => c.tz === tz) || null;
  } catch {
    return null;
  }
}

// ---- Timezone helpers -------------------------------------------------------

let displayTimeZone: string | undefined;

/** Set the timezone used by formatTime (the selected city's timezone). */
export function setDisplayTimeZone(tz: string | undefined) {
  displayTimeZone = tz;
}

/** Calendar parts (Y/M/D/h/m) of an instant as seen in a timezone. */
export function zonedParts(d: Date, tz?: string) {
  const fmt = new Intl.DateTimeFormat("en-US", {
    timeZone: tz,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  });
  const p: Record<string, number> = {};
  for (const part of fmt.formatToParts(d)) {
    if (part.type !== "literal") p[part.type] = parseInt(part.value, 10);
  }
  return { year: p.year, month: p.month, day: p.day, hour: p.hour % 24, minute: p.minute, second: p.second };
}

/** The real instant for wall-clock y-m-d h:m in a timezone. */
function zonedWallTimeToDate(year: number, month: number, day: number, hour: number, minute: number, tz?: string): Date {
  if (!tz) return new Date(year, month - 1, day, hour, minute, 0, 0);
  const guess = Date.UTC(year, month - 1, day, hour, minute);
  const p = zonedParts(new Date(guess), tz);
  const asUtc = Date.UTC(p.year, p.month - 1, p.day, p.hour, p.minute);
  return new Date(guess - (asUtc - guess));
}

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

function parseFixedTime(y: number, mo: number, d: number, hhmm: string, tz?: string): Date {
  const [hStr, mStr] = hhmm.split(":");
  const h = Math.min(23, Math.max(0, parseInt(hStr || "12", 10) || 0));
  const m = Math.min(59, Math.max(0, parseInt(mStr || "0", 10) || 0));
  return zonedWallTimeToDate(y, mo, d, h, m, tz);
}

export function computeHanafiSchedule(
  lat: number,
  lng: number,
  date: Date,
  methodId: CalcMethodId,
  settings: PrayerSettingsMap,
  tz?: string
): HanafiPrayerSchedule {
  const coords = new Coordinates(lat, lng);
  const params = getMethodParams(methodId);
  // Use the calendar day as seen in the city's timezone (adhan reads local Y/M/D only)
  const cityDay = zonedParts(date, tz);
  const pt = new PrayerTimes(coords, new Date(cityDay.year, cityDay.month - 1, cityDay.day), params);
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
        jamaatTime = parseFixedTime(cityDay.year, cityDay.month, cityDay.day, cfg.fixedTime, tz);
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
  try {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", timeZone: displayTimeZone });
  } catch {
    return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  }
}

export function formatCountdown(target: Date, now: Date): string {
  const diff = Math.max(0, Math.floor((target.getTime() - now.getTime()) / 1000));
  const h = Math.floor(diff / 3600);
  const m = Math.floor((diff % 3600) / 60);
  const s = diff % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`;
}
