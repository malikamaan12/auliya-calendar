export interface HijriDateInfo {
  day: number;
  month: number;
  monthName: string;
  year: number;
  formatted: string;
  weekday: string;
  isFriday: boolean;
  isAyyamAlBeed: boolean;
  isGyarhviSharif: boolean;
}

export const HIJRI_MONTHS = [
  "Muharram",
  "Safar",
  "Rabi' al-Awwal",
  "Rabi' al-Thani",
  "Jumada al-Awwal",
  "Jumada al-Thani",
  "Rajab",
  "Sha'ban",
  "Ramadan",
  "Shawwal",
  "Dhu al-Qi'dah",
  "Dhu al-Hijjah",
];

export interface IslamicEvent {
  month: number;
  day: number;
  title: string;
  subtitle: string;
  auliyaId?: string;
  type: "urs" | "sacred" | "fasting";
}

export const SACRED_EVENTS: IslamicEvent[] = [
  { month: 1, day: 10, title: "Yaum-e-Ashura", subtitle: "10 Muharram — Martyrdom of Imam Husayn (رضي الله عنه)", type: "sacred" },
  { month: 2, day: 20, title: "Urs Data Ganj Bakhsh", subtitle: "20 Safar — Syed Ali Hujwiri (Lahore)", auliyaId: "data-ganj-bakhsh", type: "urs" },
  { month: 2, day: 25, title: "Urs-e-Razavi", subtitle: "25 Safar — Ala Hazrat Imam Ahmad Raza Khan", auliyaId: "ala-hazrat", type: "urs" },
  { month: 2, day: 28, title: "Urs Mujaddid Alf Thani", subtitle: "28 Safar — Shaikh Ahmad Sirhindi", auliyaId: "mujaddid-alf-thani", type: "urs" },
  { month: 3, day: 12, title: "Eid Milad-un-Nabi ﷺ", subtitle: "12 Rabi' al-Awwal — Blessed Birth of the Prophet ﷺ", type: "sacred" },
  { month: 4, day: 11, title: "Bari Gyarhvi Sharif", subtitle: "11 Rabi' al-Thani — Urs of Ghaus-e-Azam (Baghdad)", auliyaId: "ghaus-e-azam", type: "urs" },
  { month: 4, day: 18, title: "Urs Nizamuddin Auliya", subtitle: "18 Rabi' al-Thani — Mahboob-e-Ilahi (Delhi)", auliyaId: "nizamuddin-auliya", type: "urs" },
  { month: 7, day: 6, title: "Chhati Sharif (Urs Ajmer)", subtitle: "6 Rajab — Khwaja Moinuddin Chishti (Ajmer)", auliyaId: "khwaja-moinuddin", type: "urs" },
  { month: 7, day: 27, title: "Shab-e-Mi'raj", subtitle: "27 Rajab — Night of the Heavenly Ascension", type: "sacred" },
  { month: 8, day: 15, title: "Shab-e-Barat", subtitle: "15 Sha'ban — Night of Forgiveness & Destiny", type: "sacred" },
  { month: 9, day: 27, title: "Shab-e-Qadr (27th Night)", subtitle: "27 Ramadan — Night Better Than a Thousand Months", type: "sacred" },
  { month: 11, day: 16, title: "Urs Khwaja Banda Nawaz", subtitle: "15–17 Dhu al-Qi'dah — Gulbarga Sharif", auliyaId: "banda-nawaz", type: "urs" },
];

export function getHijriDate(date: Date, hilalOffset: number = 0): HijriDateInfo {
  const adjusted = new Date(date.getTime() + hilalOffset * 86400000);
  try {
    const fmt = new Intl.DateTimeFormat("en-TN-u-ca-islamic-umalqura", {
      day: "numeric",
      month: "numeric",
      year: "numeric",
    });
    const parts = fmt.formatToParts(adjusted);
    const day = parseInt(parts.find((p) => p.type === "day")?.value || "1", 10);
    const month = parseInt(parts.find((p) => p.type === "month")?.value || "1", 10);
    const year = parseInt(parts.find((p) => p.type === "year")?.value || "1448", 10);
    const monthName = HIJRI_MONTHS[(month - 1 + 12) % 12] || "Muharram";
    const weekday = date.toLocaleDateString("en-US", { weekday: "long" });

    return {
      day,
      month,
      monthName,
      year,
      formatted: `${day} ${monthName} ${year} AH`,
      weekday,
      isFriday: date.getDay() === 5,
      isAyyamAlBeed: day === 13 || day === 14 || day === 15,
      isGyarhviSharif: day === 11,
    };
  } catch {
    // Offline tabular fallback
    const jd = Math.floor(adjusted.getTime() / 86400000) + 2440588;
    const l = jd - 1948440 + 10632;
    const n = Math.floor((l - 1) / 10631);
    const l2 = l - 10631 * n + 354;
    const j =
      Math.floor((10985 - l2) / 5316) * Math.floor((50 * l2) / 17719) +
      Math.floor(l2 / 5670) * Math.floor((43 * l2) / 15238);
    const l3 =
      l2 -
      Math.floor((30 - j) / 15) * Math.floor((17719 * j) / 50) -
      Math.floor(j / 16) * Math.floor((15238 * j) / 43) +
      29;
    const month = Math.floor((24 * l3) / 709);
    const day = l3 - Math.floor((709 * month) / 24);
    const year = 30 * n + j - 30;
    const monthName = HIJRI_MONTHS[(month - 1 + 12) % 12];
    return {
      day,
      month,
      monthName,
      year,
      formatted: `${day} ${monthName} ${year} AH`,
      weekday: date.toLocaleDateString("en-US", { weekday: "long" }),
      isFriday: date.getDay() === 5,
      isAyyamAlBeed: day === 13 || day === 14 || day === 15,
      isGyarhviSharif: day === 11,
    };
  }
}

export function getEventsForHijri(month: number, day: number): IslamicEvent[] {
  return SACRED_EVENTS.filter((ev) => ev.month === month && ev.day === day);
}

export function getUpcomingEvents(month: number, day: number): IslamicEvent[] {
  const idx = (m: number, d: number) => (m - 1) * 30 + d;
  const current = idx(month, day);
  return SACRED_EVENTS.slice()
    .sort((a, b) => {
      const da = (idx(a.month, a.day) - current + 360) % 360;
      const db = (idx(b.month, b.day) - current + 360) % 360;
      return da - db;
    })
    .slice(0, 4);
}
