import { AULIYA_DATA } from "@/data/auliya";
import { HIJRI_MONTHS } from "./hijri";
import {
  AuthSessionRecord,
  BackendAuditLog,
  BackendDatabaseSnapshot,
  BarsiIsalGiftLog,
  BarsiRecord,
  DailyQuestConfig,
  GamificationConfig,
  hasPermission,
  ManagedAuliyaRecord,
  ModuleConfigRecord,
  PermissionKey,
  PlatformSettings,
  PublicBackendView,
  PublicUserAccount,
  SpiritualRankConfig,
  UrsEventRecord,
  UserAccount,
  UserRole,
  ZakatBackendConfig,
} from "./backend-types";

export class BackendError extends Error {
  status: number;
  constructor(message: string, status = 400) {
    super(message);
    this.name = "BackendError";
    this.status = status;
  }
}

export async function sha256Hex(input: string): Promise<string> {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.subtle) {
    const data = new TextEncoder().encode(input);
    const buf = await globalThis.crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }
  // Fallback deterministic FNV-style 64-hex if WebCrypto unavailable
  let h1 = 0xdeadbeef;
  let h2 = 0x41c6ce57;
  for (let i = 0; i < input.length; i++) {
    const ch = input.charCodeAt(i);
    h1 = Math.imul(h1 ^ ch, 2654435761);
    h2 = Math.imul(h2 ^ ch, 1597334677);
  }
  return (
    (h1 >>> 0).toString(16).padStart(8, "0") +
    (h2 >>> 0).toString(16).padStart(8, "0")
  ).repeat(4);
}

export function randomToken(prefix = "tok"): string {
  if (typeof globalThis.crypto !== "undefined" && globalThis.crypto.getRandomValues) {
    const bytes = new Uint8Array(18);
    globalThis.crypto.getRandomValues(bytes);
    return `${prefix}_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
  }
  return `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 12)}`;
}

export async function hashPasswordWithSalt(password: string, salt: string): Promise<string> {
  return sha256Hex(`auliya-sanctuary-v1:${salt}:${password}`);
}

export function stripSecretFields(u: UserAccount): PublicUserAccount {
  const { passwordSalt: _s, passwordHash: _h, ...pub } = u;
  void _s;
  void _h;
  return pub;
}

export async function appendAuditLog(
  db: BackendDatabaseSnapshot,
  actor: Pick<UserAccount, "id" | "name" | "role"> | null,
  action: string,
  target: string
): Promise<BackendAuditLog> {
  const prevHash = db.auditLogs[0]?.hash || "0".repeat(64);
  const timestamp = new Date().toISOString();
  const actorId = actor?.id || "system";
  const actorName = actor?.name || "System Seed";
  const actorRole = actor?.role || "system";
  const hash = await sha256Hex(`${prevHash}|${timestamp}|${actorId}|${action}|${target}`);
  const entry: BackendAuditLog = {
    id: randomToken("aud"),
    timestamp,
    actorId,
    actorName,
    actorRole,
    action,
    target,
    prevHash,
    hash,
  };
  db.auditLogs = [entry, ...db.auditLogs].slice(0, 150);
  return entry;
}

const DEFAULT_MODULES: ModuleConfigRecord[] = [
  {
    id: "quran",
    href: "/quran",
    iconKey: "BookOpen",
    i18nTitleKey: "navQuran",
    customTitle: "",
    subtitleTemplate: "604-Page Mushaf & Kanzul Iman",
    badgeText: "",
    enabled: true,
    featured: true,
    showInBottomNav: true,
    order: 1,
  },
  {
    id: "prayer",
    href: "/prayer",
    iconKey: "Clock",
    i18nTitleKey: "navPrayer",
    customTitle: "",
    subtitleTemplate: "Hanafi Timings, Qibla & Weather",
    badgeText: "",
    enabled: true,
    featured: true,
    showInBottomNav: true,
    order: 2,
  },
  {
    id: "tasbih",
    href: "/tasbih",
    iconKey: "Sparkles",
    i18nTitleKey: "navTasbih",
    customTitle: "",
    subtitleTemplate: "Bead Counter, Checklists & Duas",
    badgeText: "",
    enabled: true,
    featured: false,
    showInBottomNav: true,
    order: 3,
  },
  {
    id: "auliya",
    href: "/auliya",
    iconKey: "Compass",
    i18nTitleKey: "navAuliya",
    customTitle: "",
    subtitleTemplate: "Biographies, Shajrah & 360° Shrines",
    badgeText: "",
    enabled: true,
    featured: true,
    showInBottomNav: false,
    order: 4,
  },
  {
    id: "fiqh",
    href: "/fiqh",
    iconKey: "Scale",
    i18nTitleKey: "navFiqh",
    customTitle: "",
    subtitleTemplate: "Hadith Collections & Prayer Guide",
    badgeText: "",
    enabled: true,
    featured: true,
    showInBottomNav: false,
    order: 5,
  },
  {
    id: "quiz",
    href: "/quiz",
    iconKey: "Trophy",
    i18nTitleKey: "navQuiz",
    customTitle: "",
    subtitleTemplate: "15 Scholarly Tiers & Challenges",
    badgeText: "",
    enabled: true,
    featured: false,
    showInBottomNav: false,
    order: 6,
  },
  {
    id: "zakat",
    href: "/zakat",
    iconKey: "Calculator",
    i18nTitleKey: "navZakat",
    customTitle: "",
    subtitleTemplate: "Hanafi Nisab, Fitrah & Ushr",
    badgeText: "",
    enabled: true,
    featured: false,
    showInBottomNav: false,
    order: 7,
  },
  {
    id: "barsi",
    href: "/barsi",
    iconKey: "HeartHandshake",
    i18nTitleKey: "navBarsi",
    customTitle: "",
    subtitleTemplate: "30-Para Khatm & Isal-e-Sawab",
    badgeText: "",
    enabled: true,
    featured: false,
    showInBottomNav: false,
    order: 8,
  },
  {
    id: "admin",
    href: "/admin",
    iconKey: "ShieldCheck",
    i18nTitleKey: "navAdmin",
    customTitle: "",
    subtitleTemplate: "Curate Profiles, Urs & Layout",
    badgeText: "",
    enabled: true,
    featured: false,
    showInBottomNav: false,
    order: 9,
  },
];

const DEFAULT_ZAKAT_CONFIG: ZakatBackendConfig = {
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
    { code: "GBP", name: "British Pound", symbol: "£", goldPerGram24K: 68.2, silverPerGram: 0.86, fitrahWheatPerKg: 2.2, fitrahDatesPerKg: 7.8, fitrahRaisinsPerKg: 6.9, fitrahBarleyPerKg: 2.6 },
    { code: "EUR", name: "Euro", symbol: "€", goldPerGram24K: 80.4, silverPerGram: 1.01, fitrahWheatPerKg: 2.4, fitrahDatesPerKg: 8.6, fitrahRaisinsPerKg: 7.5, fitrahBarleyPerKg: 2.9 },
    { code: "SAR", name: "Saudi Riyal", symbol: "SAR ", goldPerGram24K: 325, silverPerGram: 4.05, fitrahWheatPerKg: 9.5, fitrahDatesPerKg: 28, fitrahRaisinsPerKg: 32, fitrahBarleyPerKg: 11 },
    { code: "AED", name: "UAE Dirham", symbol: "AED ", goldPerGram24K: 318, silverPerGram: 3.96, fitrahWheatPerKg: 9.2, fitrahDatesPerKg: 27, fitrahRaisinsPerKg: 31, fitrahBarleyPerKg: 10.5 },
    { code: "QAR", name: "Qatari Riyal", symbol: "QAR ", goldPerGram24K: 315, silverPerGram: 3.93, fitrahWheatPerKg: 9.0, fitrahDatesPerKg: 27, fitrahRaisinsPerKg: 30, fitrahBarleyPerKg: 10.5 },
    { code: "CAD", name: "Canadian Dollar", symbol: "CA$", goldPerGram24K: 119, silverPerGram: 1.48, fitrahWheatPerKg: 3.4, fitrahDatesPerKg: 12.5, fitrahRaisinsPerKg: 11, fitrahBarleyPerKg: 4.1 },
    { code: "BDT", name: "Bangladeshi Taka", symbol: "৳", goldPerGram24K: 10400, silverPerGram: 132, fitrahWheatPerKg: 65, fitrahDatesPerKg: 620, fitrahRaisinsPerKg: 680, fitrahBarleyPerKg: 95 },
    { code: "MYR", name: "Malaysian Ringgit", symbol: "RM", goldPerGram24K: 386, silverPerGram: 4.82, fitrahWheatPerKg: 7.5, fitrahDatesPerKg: 34, fitrahRaisinsPerKg: 32, fitrahBarleyPerKg: 9.8 },
    { code: "TRY", name: "Turkish Lira", symbol: "₺", goldPerGram24K: 2980, silverPerGram: 37.5, fitrahWheatPerKg: 45, fitrahDatesPerKg: 290, fitrahRaisinsPerKg: 260, fitrahBarleyPerKg: 58 },
  ],
};

const DEFAULT_RANKS: SpiritualRankConfig[] = [
  { level: 1, title: "Talib-e-Ilm", arabicTitle: "طالب العلم", minXp: 0, badgeHex: "#94A3B8", perk: "Sanctuary Initiate" },
  { level: 2, title: "Salik", arabicTitle: "سالك الطريق", minXp: 150, badgeHex: "#38BDF8", perk: "Wayfarer of Devotion" },
  { level: 3, title: "Zakir", arabicTitle: "ذاكر الله", minXp: 400, badgeHex: "#34D399", perk: "Heart Alive in Dhikr" },
  { level: 4, title: "Muhibb-e-Sunnat", arabicTitle: "محب السنة", minXp: 750, badgeHex: "#A855F7", perk: "Reviver of Prophetic Sunnah" },
  { level: 5, title: "Khadim-ul-Masjid", arabicTitle: "خادم المسجد", minXp: 1250, badgeHex: "#F59E0B", perk: "Guardian of the FiveJamaats" },
  { level: 6, title: "Hafiz-ul-Awrad", arabicTitle: "حافظ الأوراد", minXp: 2000, badgeHex: "#EC4899", perk: "Keeper of Litanies & Durood" },
  { level: 7, title: "Sahib-ul-Khayr", arabicTitle: "صاحب الخير", minXp: 3000, badgeHex: "#10B981", perk: "Pillar of Zakat & Charity" },
  { level: 8, title: "Ashiq-e-Auliya", arabicTitle: "عاشق الأولياء", minXp: 4500, badgeHex: "#6366F1", perk: "Companion of the Friends of Allah" },
  { level: 9, title: "Faqih-un-Nafs", arabicTitle: "فقيه النفس", minXp: 6500, badgeHex: "#F97316", perk: "Scholar of Hanafi Adab" },
  { level: 10, title: "Sahib-e-Noor", arabicTitle: "صاحب النور", minXp: 9500, badgeHex: "#FACC15", perk: "Crown Sanctuary Luminary" },
];

const DEFAULT_QUESTS: DailyQuestConfig[] = [
  {
    id: "quest-salah-5",
    title: "Complete All 5 Fard Prayers",
    subtitle: "Log Fajr, Dhuhr, Asr, Maghrib & Isha today",
    xpReward: 75,
    metric: "salah_count",
    target: 5,
    actionHref: "/prayer",
    enabled: true,
  },
  {
    id: "quest-tasbih-100",
    title: "Recite 100 Salawat & Adhkar",
    subtitle: "Reach 100 beads on the Smart Tasbih Studio",
    xpReward: 50,
    metric: "tasbih_count",
    target: 100,
    actionHref: "/tasbih",
    enabled: true,
  },
  {
    id: "quest-quran-10",
    title: "Recite 10 Blessed Verses",
    subtitle: "Read Mushaf pages with Kanzul Iman translation",
    xpReward: 60,
    metric: "quran_verses",
    target: 10,
    actionHref: "/quran",
    enabled: true,
  },
  {
    id: "quest-sunnah-3",
    title: "Revive 3 Masnoon Sunnahs",
    subtitle: "Check off Sunnah Rak'ats or Daily Sunnah Playbooks",
    xpReward: 45,
    metric: "sunnah_count",
    target: 3,
    actionHref: "/fiqh?tab=sunnah",
    enabled: true,
  },
  {
    id: "quest-barsi-fatiha",
    title: "Gift Isal-e-Sawab Fatiha",
    subtitle: "Dedicate Surah Fatiha or Durood to Marhumeen",
    xpReward: 55,
    metric: "barsi_fatiha",
    target: 1,
    actionHref: "/barsi",
    enabled: true,
  },
];

const DEFAULT_GAMIFICATION: GamificationConfig = {
  ranks: DEFAULT_RANKS,
  dailyQuests: DEFAULT_QUESTS,
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
};

const DEFAULT_URS_EVENTS: Omit<UrsEventRecord, "createdByUserId" | "createdByName" | "updatedAt">[] = [
  {
    id: "ev-ashura",
    month: 1,
    day: 10,
    title: "Yaum-e-Ashura & Shuhada-e-Karbala",
    urduTitle: "یومِ عاشورہ و شہدائے کربلا",
    subtitle: "10 Muharram — Supreme Sacrifice of Sayyiduna Imam Husayn (رضي الله عنه)",
    city: "Karbala Mu'alla",
    country: "Iraq",
    type: "sacred",
    recommendedWird: "Fast 9th & 10th Muharram; recite Surah Ikhlas & Fatiha for Shuhada-e-Karbala",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-farid",
    month: 1,
    day: 5,
    durationDays: 5,
    title: "Urs Baba Fariduddin Ganjshakar",
    urduTitle: "عرس بابا فرید الدین گنج شکر",
    subtitle: "5 Muharram — Bahishti Darwaza Commemoration (Pakpattan Sharif)",
    city: "Pakpattan",
    country: "Pakistan",
    silsila: "Chishti",
    auliyaId: "baba-farid",
    type: "urs",
    recommendedWird: "Surah Yasin & Durood-e-Chishtiyya (100x)",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-data-sahib",
    month: 2,
    day: 20,
    durationDays: 3,
    title: "Urs Data Ganj Bakhsh Ali Hujwiri",
    urduTitle: "عرس داتا گنج بخش علی ہجویری",
    subtitle: "20 Safar — Author of Kashf al-Mahjub (Lahore Sharif)",
    city: "Lahore",
    country: "Pakistan",
    silsila: "Qadri",
    auliyaId: "data-ganj-bakhsh",
    type: "urs",
    recommendedWird: "Study a chapter of Kashf al-Mahjub & recite Khatm-e-Khwajgan",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-razavi",
    month: 2,
    day: 25,
    durationDays: 3,
    title: "Urs-e-Razavi (Ala Hazrat)",
    urduTitle: "عرسِ رضوی — اعلیٰ حضرت امام احمد رضا",
    subtitle: "25 Safar — Mujaddid Imam Ahmad Raza Khan Qadri (Bareilly Sharif)",
    city: "Bareilly Sharif",
    country: "India",
    silsila: "Razavi",
    auliyaId: "ala-hazrat",
    type: "urs",
    recommendedWird: "Durood-e-Razawiyya (100x) & Qasida Burdah / Salaam 'Mustafa Jaan-e-Rahmat'",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-mujaddid",
    month: 2,
    day: 28,
    title: "Urs Mujaddid Alf Thani",
    urduTitle: "عرس مجدد الف ثانی شیخ احمد سرہندی",
    subtitle: "28 Safar — Reviver of the Second Millennium (Sirhind Sharif)",
    city: "Sirhind",
    country: "India",
    silsila: "Naqshbandi",
    auliyaId: "mujaddid-alf-thani",
    type: "urs",
    recommendedWird: "Khatm-e-Khwajgan & Istighfar (100x)",
    featured: false,
    status: "Published",
  },
  {
    id: "ev-milad",
    month: 3,
    day: 12,
    title: "Eid Milad-un-Nabi ﷺ",
    urduTitle: "عید میلاد النبی ﷺ",
    subtitle: "12 Rabi' al-Awwal — Blessed Wiladat of Sayyiduna Muhammad Mustafa ﷺ",
    city: "Madinah Munawwarah",
    country: "Hijaz",
    type: "sacred",
    recommendedWird: "Abundant Salawat & Salam upon the Beloved Prophet ﷺ (1,000x)",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-sabir-pak",
    month: 3,
    day: 13,
    title: "Urs Makhdoom Alauddin Ali Ahmad Sabir",
    urduTitle: "عرس مخدوم علاؤالدین علی احمد صابر کلیری",
    subtitle: "13 Rabi' al-Awwal — Sabir Pak (Kaliyar Sharif)",
    city: "Kaliyar Sharif",
    country: "India",
    silsila: "Chishti",
    type: "urs",
    recommendedWird: "Surah Al-Muzzammil & Durood-e-Pak",
    featured: false,
    status: "Published",
  },
  {
    id: "ev-ghaus-e-azam",
    month: 4,
    day: 11,
    title: "Bari Gyarhvi Sharif (Urs Ghaus-e-Azam)",
    urduTitle: "بڑی گیارہویں شریف — حضور غوثِ اعظم",
    subtitle: "11 Rabi' al-Thani — Shaykh Abdul Qadir Jilani (Baghdad Sharif)",
    city: "Baghdad",
    country: "Iraq",
    silsila: "Qadri",
    auliyaId: "ghaus-e-azam",
    type: "urs",
    recommendedWird: "Durood-e-Ghausia (111x) & Khatm-e-Qadriyya",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-nizamuddin",
    month: 4,
    day: 18,
    title: "Urs Hazrat Nizamuddin Auliya",
    urduTitle: "عرس محبوبِ الٰہی حضرت نظام الدین اولیاء",
    subtitle: "18 Rabi' al-Thani — Mahboob-e-Ilahi (Delhi Sharif)",
    city: "New Delhi",
    country: "India",
    silsila: "Chishti",
    auliyaId: "nizamuddin-auliya",
    type: "urs",
    recommendedWird: "Surah Al-Fatihah, Surah Ikhlas (11x) & Feeding the Poor",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-bahauddin-naqshband",
    month: 3,
    day: 3,
    title: "Urs Khwaja Bahauddin Naqshband",
    urduTitle: "عرس خواجہ بہاؤالدین نقشبند بخاری",
    subtitle: "3 Rabi' al-Awwal — Shah-e-Naqshband (Bukhara Sharif)",
    city: "Bukhara",
    country: "Uzbekistan",
    silsila: "Naqshbandi",
    auliyaId: "bahauddin-naqshband",
    type: "urs",
    recommendedWird: "Silent Dhikr-e-Qalbi (Allah, Allah) & Khatm-e-Khwajgan",
    featured: false,
    status: "Published",
  },
  {
    id: "ev-ajmer-chhati",
    month: 7,
    day: 6,
    durationDays: 6,
    title: "Urs Gharib Nawaz (Chhati Sharif Ajmer)",
    urduTitle: "عرس حضور غریب نواز خواجہ معین الدین چشتی",
    subtitle: "1–6 Rajab — Sultan-ul-Hind Khwaja Moinuddin Chishti (Ajmer Sharif)",
    city: "Ajmer Sharif",
    country: "India",
    silsila: "Chishti",
    auliyaId: "khwaja-moinuddin",
    type: "urs",
    recommendedWird: "Surah Yasin, Durood-e-Taj & Charity to Travelers",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-imam-azam",
    month: 7,
    day: 2,
    title: "Wisal Imam-e-Azam Abu Hanifa",
    urduTitle: "وصال امامِ اعظم ابو حنیفہ نعمان بن ثابت",
    subtitle: "2 Rajab / Sha'ban — Founder of the Sunni Hanafi Madhhab (Baghdad)",
    city: "Baghdad",
    country: "Iraq",
    type: "urs",
    recommendedWird: "Khatm-e-Quran & Study of Hanafi Fiqh",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-miraj",
    month: 7,
    day: 27,
    title: "Shab-e-Mi'raj-un-Nabi ﷺ",
    urduTitle: "شبِ معراج النبی ﷺ",
    subtitle: "27 Rajab — Blessed Night Journey & Gift of the Five Daily Prayers",
    city: "Al-Quds & Heavens",
    country: "Sacred",
    type: "sacred",
    recommendedWird: "Nafl Salah, Qaza-e-Umri review & abundant Durood-e-Ibrahimi",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-barat",
    month: 8,
    day: 15,
    title: "Shab-e-Barat (Laylatul Bara'ah)",
    urduTitle: "شبِ برات — لیلۃ البراءۃ",
    subtitle: "15 Sha'ban — Night of Forgiveness, Rizq & Ziyarat-e-Qubur",
    city: "Global",
    country: "Ummah",
    type: "sacred",
    recommendedWird: "3x Surah Yasin, Salat-ut-Tasbih, Istighfar & Fasting 15th Sha'ban",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-qadr",
    month: 9,
    day: 27,
    title: "Laylatul Qadr (Shab-e-Qadr)",
    urduTitle: "لیلۃ القدر — شبِ قدر",
    subtitle: "27 Ramadan (Odd Nights of Last Ashra) — Better Than 1,000 Months",
    city: "Global",
    country: "Ummah",
    type: "sacred",
    recommendedWird: "Allahumma innaka 'afuwwun tuhibbul-'afwa fa'fu 'anni",
    featured: true,
    status: "Published",
  },
  {
    id: "ev-banda-nawaz",
    month: 11,
    day: 16,
    durationDays: 3,
    title: "Urs Khwaja Banda Nawaz Gesudaraz",
    urduTitle: "عرس خواجہ بندہ نواز گیسو دراز",
    subtitle: "16 Dhu al-Qi'dah — Gulbarga Sharif",
    city: "Kalaburagi (Gulbarga)",
    country: "India",
    silsila: "Chishti",
    auliyaId: "banda-nawaz",
    type: "urs",
    recommendedWird: "Surah Al-Fatihah & Durood-e-Pak (100x)",
    featured: false,
    status: "Published",
  },
  {
    id: "ev-arafah",
    month: 12,
    day: 9,
    title: "Yaum-e-Arafah & Eid-ul-Adha",
    urduTitle: "یومِ عرفہ و عید الاضحیٰ",
    subtitle: "9–10 Dhu al-Hijjah — Takbirat-e-Tashriq & Wajib Qurbani",
    city: "Makkah Mukarramah",
    country: "Hijaz",
    type: "fasting",
    recommendedWird: "Fast of Arafah (for non-pilgrims) & Takbirat-e-Tashriq after every Fard Salah",
    featured: true,
    status: "Published",
  },
];

const DEFAULT_SETTINGS: PlatformSettings = {
  platformTitle: "Auliya Calendar",
  platformTagline: "Sunni & Hanafi Companion",
  announcementEnabled: false,
  announcementBadge: "Notice",
  announcementText: "",
  announcementHref: "/auliya",
  defaultTheme: "indigo-night",
  defaultLang: "en",
  allowSelfRegistration: true,
  requireScholarVerificationForPublish: true,
  updatedAt: "2026-11-16T00:00:00.000Z",
};

export async function createInitialBackendSnapshot(): Promise<BackendDatabaseSnapshot> {
  const nowIso = "2026-11-16T00:00:00.000Z";
  const demoSalt = "sanctuary_seed_salt_v1";

  const [adminHash, editorHash, creatorHash, memberHash] = await Promise.all([
    hashPasswordWithSalt("Admin@786", demoSalt),
    hashPasswordWithSalt("Editor@786", demoSalt),
    hashPasswordWithSalt("Creator@786", demoSalt),
    hashPasswordWithSalt("Member@786", demoSalt),
  ]);

  const users: UserAccount[] = [
    {
      id: "usr_super_admin",
      name: "Mufti Salman Razavi",
      email: "admin@auliyacalendar.org",
      role: "super_admin",
      title: "Chief Sanctuary Administrator",
      city: "Bareilly Sharif",
      avatarColor: "#F59E0B",
      status: "active",
      xp: 9850,
      passwordSalt: demoSalt,
      passwordHash: adminHash,
      createdAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "usr_scholar_editor",
      name: "Maulana Tariq Qadri",
      email: "editor@auliyacalendar.org",
      role: "editor",
      title: "Senior Tazkirah & Fiqh Editor",
      city: "Lahore",
      avatarColor: "#10B981",
      status: "active",
      xp: 6800,
      passwordSalt: demoSalt,
      passwordHash: editorHash,
      createdAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "usr_curator_creator",
      name: "Hafiz Bilal Chishti",
      email: "creator@auliyacalendar.org",
      role: "creator",
      title: "Dargah Archive Contributor",
      city: "Ajmer Sharif",
      avatarColor: "#38BDF8",
      status: "active",
      xp: 3420,
      passwordSalt: demoSalt,
      passwordHash: creatorHash,
      createdAt: nowIso,
      lastLoginAt: nowIso,
    },
    {
      id: "usr_community_member",
      name: "Tanvir Ahassan",
      email: "member@auliyacalendar.org",
      role: "member",
      title: "Devoted Sanctuary Companion",
      city: "Dhaka",
      avatarColor: "#A855F7",
      status: "active",
      xp: 1320,
      passwordSalt: demoSalt,
      passwordHash: memberHash,
      createdAt: nowIso,
      lastLoginAt: nowIso,
    },
  ];

  const auliyaRecords: ManagedAuliyaRecord[] = AULIYA_DATA.map((a, idx) => ({
    ...a,
    createdByUserId: "usr_scholar_editor",
    createdByName: "Maulana Tariq Qadri",
    verifiedByName: "Mufti Salman Razavi",
    updatedAt: nowIso,
    featured: idx < 4,
  }));

  const ursEvents: UrsEventRecord[] = DEFAULT_URS_EVENTS.map((ev) => ({
    ...ev,
    createdByUserId: "usr_scholar_editor",
    createdByName: "Maulana Tariq Qadri",
    updatedAt: nowIso,
  }));

  const barsiRecords: BarsiRecord[] = [
    {
      id: "barsi_shuhada_ummah",
      ownerUserId: "usr_super_admin",
      ownerName: "Sanctuary Endowment",
      personName: "All Marhumeen of the Ummah & Parents of Believers",
      urduName: "جملہ مرحومینِ امتِ مسلمہ و والدینِ مومنین",
      relation: "Collective Ummah Isal-e-Sawab",
      hijriMonth: 8,
      hijriDay: 15,
      restingPlaceCity: "Jannat al-Baqi & Worldwide",
      qabrastanName: "Global Collective Khatm",
      memoryNote:
        "Join believers worldwide in dedicating Surah Al-Fatihah, Surah Yasin, Durood-e-Pak, and Paras of the Holy Quran to all departed believers who have no one left to remember them.",
      favoriteWird: "Surah Yasin & 3x Surah Al-Ikhlas",
      visibility: "community",
      khatmParas: {
        "1": "Mufti Salman",
        "2": "Maulana Tariq",
        "3": "Hafiz Bilal",
        "30": "Tanvir Ahassan",
      },
      totalFatihaCount: 314,
      totalDuroodCount: 1240,
      totalYasinCount: 42,
      giftLogs: [
        {
          id: "g_seed_1",
          donorName: "Maulana Tariq Qadri",
          giftType: "Surah Yasin",
          count: 1,
          createdAt: nowIso,
        },
        {
          id: "g_seed_2",
          donorName: "Tanvir Ahassan",
          giftType: "Durood-e-Pak (100x)",
          count: 100,
          createdAt: nowIso,
        },
      ],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
    {
      id: "barsi_ulama_mashaykh",
      ownerUserId: "usr_scholar_editor",
      ownerName: "Maulana Tariq Qadri",
      personName: "Mashaykh-e-Kiram & Sunni Scholars of Ahl-e-Sunnat",
      urduName: "مشائخِ عظام و علمائے اہلِ سنت",
      relation: "Teachers & Spiritual Guides",
      hijriMonth: 2,
      hijriDay: 25,
      restingPlaceCity: "Madinah, Baghdad, Ajmer, Bareilly & Lahore",
      qabrastanName: "Sacred Mazarats",
      memoryNote:
        "Dedicated to the scholars, Muhaddithin, Fuqaha, and Awliya who preserved authentic Sunni Hanafi creed and transmitted Kanzul Iman & Bahar-e-Shariat to us.",
      favoriteWird: "Durood-e-Razawiyya (100x)",
      visibility: "community",
      khatmParas: {
        "1": "Hafiz Bilal",
        "15": "Mufti Salman",
      },
      totalFatihaCount: 186,
      totalDuroodCount: 890,
      totalYasinCount: 27,
      giftLogs: [],
      createdAt: nowIso,
      updatedAt: nowIso,
    },
  ];

  const db: BackendDatabaseSnapshot = {
    schemaVersion: 2,
    users,
    sessions: [],
    auliyaRecords,
    ursEvents,
    barsiRecords,
    modules: DEFAULT_MODULES,
    zakatConfig: DEFAULT_ZAKAT_CONFIG,
    gamificationConfig: DEFAULT_GAMIFICATION,
    platformSettings: DEFAULT_SETTINGS,
    auditLogs: [],
  };

  await appendAuditLog(
    db,
    users[0],
    "SYSTEM_SEED_INITIALIZED",
    "Modular RBAC Database, 9 Companion Modules, Auliya & Urs CMS"
  );

  return db;
}

export function resolveSessionUser(
  db: BackendDatabaseSnapshot,
  token?: string | null
): UserAccount | null {
  if (!token) return null;
  const now = Date.now();
  const sess = db.sessions.find((s) => s.token === token);
  if (!sess) return null;
  if (Date.parse(sess.expiresAt) < now) return null;
  const user = db.users.find((u) => u.id === sess.userId);
  if (!user || user.status !== "active") return null;
  return user;
}

export function buildPublicView(
  db: BackendDatabaseSnapshot,
  currentUser: UserAccount | null,
  backendMode: "server-api" | "local-engine"
): PublicBackendView {
  const canSeeAllDrafts =
    currentUser &&
    (hasPermission(currentUser.role, "auliya:edit_any") ||
      hasPermission(currentUser.role, "auliya:create"));

  const visibleAuliya = db.auliyaRecords.filter((a) => {
    if (a.status === "Published") return true;
    if (canSeeAllDrafts) return true;
    return false;
  });

  const visibleUrs = db.ursEvents.filter((u) => {
    if (u.status === "Published") return true;
    if (canSeeAllDrafts) return true;
    return false;
  });

  const visibleBarsis = db.barsiRecords.filter((b) => {
    if (b.visibility === "community") return true;
    if (currentUser && (b.ownerUserId === currentUser.id || currentUser.role === "super_admin")) {
      return true;
    }
    return b.ownerUserId === "guest_local";
  });

  const includeUsers =
    currentUser &&
    (hasPermission(currentUser.role, "users:manage") ||
      hasPermission(currentUser.role, "audit:view"));

  return {
    currentUser: currentUser ? stripSecretFields(currentUser) : null,
    users: includeUsers ? db.users.map(stripSecretFields) : undefined,
    auliyaRecords: visibleAuliya,
    ursEvents: visibleUrs,
    barsiRecords: visibleBarsis,
    modules: [...db.modules].sort((a, b) => a.order - b.order),
    zakatConfig: db.zakatConfig,
    gamificationConfig: db.gamificationConfig,
    platformSettings: db.platformSettings,
    auditLogs: db.auditLogs.slice(0, 60),
    backendMode,
  };
}

function createSessionForUser(db: BackendDatabaseSnapshot, user: UserAccount): AuthSessionRecord {
  const createdAt = new Date().toISOString();
  const expiresAt = new Date(Date.now() + 30 * 86400_000).toISOString();
  const session: AuthSessionRecord = {
    token: randomToken("sanctuary_sess"),
    userId: user.id,
    createdAt,
    expiresAt,
  };
  user.lastLoginAt = createdAt;
  db.sessions = [session, ...db.sessions.filter((s) => s.userId !== user.id)].slice(0, 100);
  return session;
}

export async function opRegisterUser(
  db: BackendDatabaseSnapshot,
  payload: {
    name: string;
    email: string;
    password: string;
    city?: string;
    requestedRole?: "member" | "creator";
  }
): Promise<{ user: PublicUserAccount; token: string }> {
  if (!db.platformSettings.allowSelfRegistration) {
    throw new BackendError("Self-registration is currently closed by the administrator.", 403);
  }
  const name = payload.name.trim();
  const email = payload.email.trim().toLowerCase();
  const password = payload.password;

  if (name.length < 2) throw new BackendError("Name must be at least 2 characters.");
  if (!email.includes("@") || email.length < 5) throw new BackendError("Valid email is required.");
  if (password.length < 6) throw new BackendError("Password must be at least 6 characters.");

  if (db.users.some((u) => u.email.toLowerCase() === email)) {
    throw new BackendError("An account with this email already exists. Please sign in instead.", 409);
  }

  const salt = randomToken("salt");
  const passwordHash = await hashPasswordWithSalt(password, salt);
  const nowIso = new Date().toISOString();
  const role: UserRole = payload.requestedRole === "creator" ? "creator" : "member";

  const colors = ["#A855F7", "#10B981", "#38BDF8", "#F59E0B", "#EC4899"];
  const newUser: UserAccount = {
    id: randomToken("usr"),
    name,
    email,
    role,
    title: role === "creator" ? "Community Archive Creator" : "Sanctuary Member",
    city: payload.city?.trim() || "Global",
    avatarColor: colors[db.users.length % colors.length],
    status: "active",
    xp: 100, // Welcome Barakah XP bonus
    passwordSalt: salt,
    passwordHash,
    createdAt: nowIso,
    lastLoginAt: nowIso,
  };

  db.users.push(newUser);
  const sess = createSessionForUser(db, newUser);
  await appendAuditLog(db, newUser, "USER_SELF_REGISTERED", `${newUser.email} (${newUser.role})`);
  return { user: stripSecretFields(newUser), token: sess.token };
}

export async function opLoginUser(
  db: BackendDatabaseSnapshot,
  payload: { email: string; password: string }
): Promise<{ user: PublicUserAccount; token: string }> {
  const email = payload.email.trim().toLowerCase();
  const user = db.users.find((u) => u.email.toLowerCase() === email);
  if (!user) {
    throw new BackendError("Invalid email or password.", 401);
  }
  if (user.status !== "active") {
    throw new BackendError("This account has been suspended by an administrator.", 403);
  }
  const candidateHash = await hashPasswordWithSalt(payload.password, user.passwordSalt);
  if (candidateHash !== user.passwordHash) {
    throw new BackendError("Invalid email or password.", 401);
  }
  const sess = createSessionForUser(db, user);
  await appendAuditLog(db, user, "USER_LOGIN", `${user.email} (${user.role})`);
  return { user: stripSecretFields(user), token: sess.token };
}

export async function opDemoSwitchRole(
  db: BackendDatabaseSnapshot,
  role: UserRole
): Promise<{ user: PublicUserAccount; token: string }> {
  const user = db.users.find((u) => u.role === role && u.status === "active");
  if (!user) {
    throw new BackendError(`No active ${role} profile available.`, 404);
  }
  const sess = createSessionForUser(db, user);
  await appendAuditLog(db, user, "RBAC_SESSION_SWITCH", `Switched active role to ${role}`);
  return { user: stripSecretFields(user), token: sess.token };
}

export async function opLogoutSession(db: BackendDatabaseSnapshot, token?: string | null): Promise<void> {
  if (!token) return;
  db.sessions = db.sessions.filter((s) => s.token !== token);
}

export async function opUpdateUserProfile(
  db: BackendDatabaseSnapshot,
  actor: UserAccount,
  patch: { name?: string; title?: string; city?: string; xpDelta?: number }
): Promise<PublicUserAccount> {
  if (patch.name && patch.name.trim().length >= 2) actor.name = patch.name.trim();
  if (patch.title !== undefined) actor.title = patch.title.trim().slice(0, 60);
  if (patch.city !== undefined) actor.city = patch.city.trim().slice(0, 50);
  if (typeof patch.xpDelta === "number" && Number.isFinite(patch.xpDelta)) {
    actor.xp = Math.max(0, actor.xp + Math.round(patch.xpDelta));
  }
  return stripSecretFields(actor);
}

export async function opAdminUpdateUser(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  payload: { targetUserId: string; role?: UserRole; status?: "active" | "suspended"; title?: string }
): Promise<PublicUserAccount> {
  if (!actor || !hasPermission(actor.role, "users:manage")) {
    throw new BackendError("Super Admin permission (users:manage) required.", 403);
  }
  const target = db.users.find((u) => u.id === payload.targetUserId);
  if (!target) throw new BackendError("Target user not found.", 404);

  if (payload.role) target.role = payload.role;
  if (payload.status) target.status = payload.status;
  if (payload.title !== undefined) target.title = payload.title.trim();

  await appendAuditLog(
    db,
    actor,
    "RBAC_USER_UPDATED",
    `${target.email} -> role=${target.role}, status=${target.status}`
  );
  return stripSecretFields(target);
}

export async function opUpsertAuliya(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  input: Partial<ManagedAuliyaRecord> & { name: string; urduName: string; city: string; country: string }
): Promise<ManagedAuliyaRecord> {
  if (!actor || !hasPermission(actor.role, "auliya:create")) {
    throw new BackendError(
      "Creator, Editor, or Super Admin role is required to add or edit Auliya records.",
      403
    );
  }

  const slug = (input.id || input.slug || input.name)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

  const existingIdx = db.auliyaRecords.findIndex((a) => a.id === slug);
  const existing = existingIdx >= 0 ? db.auliyaRecords[existingIdx] : null;

  if (
    existing &&
    existing.createdByUserId !== actor.id &&
    !hasPermission(actor.role, "auliya:edit_any")
  ) {
    throw new BackendError(
      "Creators can only edit their own submissions. Editor or Super Admin access is required to edit other profiles.",
      403
    );
  }

  let nextStatus: ManagedAuliyaRecord["status"] = input.status || existing?.status || "Draft";
  if (nextStatus === "Published" && !hasPermission(actor.role, "auliya:publish")) {
    // Creators automatically route to Scholarly Verification instead of direct publish
    nextStatus = "Scholarly Verification";
  }

  const ursMonth = Math.max(1, Math.min(12, Number(input.ursMonth ?? existing?.ursMonth ?? 4)));
  const ursDay = Math.max(1, Math.min(30, Number(input.ursDay ?? existing?.ursDay ?? 11)));
  const monthLabel = HIJRI_MONTHS[ursMonth - 1] || "Rabi' al-Thani";
  const nowIso = new Date().toISOString();

  const record: ManagedAuliyaRecord = {
    id: slug,
    slug,
    name: input.name.trim(),
    urduName: input.urduName.trim(),
    arabicName: input.arabicName?.trim() || existing?.arabicName || input.urduName.trim(),
    alqab: input.alqab?.length ? input.alqab : existing?.alqab || [input.silsila || "Qadri"],
    silsila: input.silsila || existing?.silsila || "Qadri",
    era: input.era ?? existing?.era,
    wiladatHijri: input.wiladatHijri || existing?.wiladatHijri || "Verified Sunni Archive",
    wisalHijri: input.wisalHijri || existing?.wisalHijri || `${ursDay} ${monthLabel}`,
    ursMonth,
    ursDay,
    ursLabel: input.ursLabel || `Urs (${ursDay} ${monthLabel})`,
    city: input.city.trim(),
    country: input.country.trim(),
    lat: Number.isFinite(Number(input.lat)) ? Number(input.lat) : existing?.lat ?? 27.1767,
    lng: Number.isFinite(Number(input.lng)) ? Number(input.lng) : existing?.lng ?? 78.0081,
    shrineImage: input.shrineImage || existing?.shrineImage || "/images/shrines/bareilly.jpg",
    shortSummary:
      input.shortSummary?.trim() ||
      existing?.shortSummary ||
      "Illustrious Sunni Sufi master and beacon of Sacred Law and Tariqah.",
    fullTazkirah:
      input.fullTazkirah?.trim() ||
      input.shortSummary?.trim() ||
      existing?.fullTazkirah ||
      "Biography curated through the Sanctuary Scholarly CMS.",
    shrineArchitecture: input.shrineArchitecture ?? existing?.shrineArchitecture,
    visitingGuide: input.visitingGuide ?? existing?.visitingGuide,
    famousQuotes: input.famousQuotes ?? existing?.famousQuotes,
    karamat: input.karamat?.length
      ? input.karamat
      : existing?.karamat || ["Preserved in classical Sunni Tazkirah literature."],
    adabZiyarat: input.adabZiyarat?.length
      ? input.adabZiyarat
      : existing?.adabZiyarat || [
          "Enter in a state of Wudu with lowered gaze and recite Salawat upon the Prophet ﷺ.",
          "Recite Surah Al-Fatihah, Surah Al-Ikhlas (3x), and gift Isal-e-Sawab.",
        ],
    hotspots: input.hotspots ?? existing?.hotspots ?? [],
    gallery: input.gallery ?? existing?.gallery ?? [],
    videos: input.videos ?? existing?.videos ?? [],
    books: input.books ?? existing?.books ?? [],
    murshidId: input.murshidId ?? existing?.murshidId ?? "ghaus-e-azam",
    silsilaChain: input.silsilaChain ?? existing?.silsilaChain,
    khulafaNames: input.khulafaNames ?? existing?.khulafaNames ?? [],
    status: nextStatus,
    featured: input.featured ?? existing?.featured ?? false,
    createdByUserId: existing?.createdByUserId || actor.id,
    createdByName: existing?.createdByName || actor.name,
    verifiedByName:
      nextStatus === "Published" ? actor.name : existing?.verifiedByName,
    updatedAt: nowIso,
  };

  if (existingIdx >= 0) {
    db.auliyaRecords[existingIdx] = record;
  } else {
    db.auliyaRecords = [record, ...db.auliyaRecords];
  }

  actor.xp += db.gamificationConfig.xpRewards.curatorSubmission;
  await appendAuditLog(
    db,
    actor,
    existing ? "AULIYA_UPDATED" : "AULIYA_CREATED",
    `${record.name} [${record.status}]`
  );
  return record;
}

export async function opDeleteAuliya(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  id: string
): Promise<void> {
  if (!actor || !hasPermission(actor.role, "auliya:delete")) {
    throw new BackendError("Super Admin permission (auliya:delete) required.", 403);
  }
  const found = db.auliyaRecords.find((a) => a.id === id);
  if (!found) throw new BackendError("Auliya record not found.", 404);
  db.auliyaRecords = db.auliyaRecords.filter((a) => a.id !== id);
  await appendAuditLog(db, actor, "AULIYA_DELETED", `${found.name} (${id})`);
}

export async function opUpsertUrs(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  input: Partial<UrsEventRecord> & { title: string; month: number; day: number }
): Promise<UrsEventRecord> {
  if (!actor || !hasPermission(actor.role, "urs:create")) {
    throw new BackendError("Creator, Editor, or Super Admin role required to manage Urs events.", 403);
  }

  const id =
    input.id ||
    `urs_${input.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "_")
      .slice(0, 32)}_${Date.now().toString(36).slice(-4)}`;

  const existingIdx = db.ursEvents.findIndex((u) => u.id === id);
  const existing = existingIdx >= 0 ? db.ursEvents[existingIdx] : null;

  if (
    existing &&
    existing.createdByUserId !== actor.id &&
    !hasPermission(actor.role, "urs:edit_any")
  ) {
    throw new BackendError("Editor or Super Admin permission required to edit this Urs record.", 403);
  }

  let nextStatus: UrsEventRecord["status"] = input.status || existing?.status || "Published";
  if (nextStatus === "Published" && !hasPermission(actor.role, "urs:publish")) {
    nextStatus = "Scholarly Verification";
  }

  const month = Math.max(1, Math.min(12, Number(input.month)));
  const day = Math.max(1, Math.min(30, Number(input.day)));
  const record: UrsEventRecord = {
    id,
    month,
    day,
    durationDays: input.durationDays ?? existing?.durationDays ?? 1,
    title: input.title.trim(),
    urduTitle: input.urduTitle?.trim() || existing?.urduTitle || input.title.trim(),
    subtitle:
      input.subtitle?.trim() ||
      existing?.subtitle ||
      `${day} ${HIJRI_MONTHS[month - 1]} — Annual Remembrance`,
    city: input.city?.trim() || existing?.city || "Global",
    country: input.country?.trim() || existing?.country || "Ummah",
    silsila: input.silsila ?? existing?.silsila,
    auliyaId: input.auliyaId ?? existing?.auliyaId,
    type: input.type || existing?.type || "urs",
    recommendedWird:
      input.recommendedWird?.trim() ||
      existing?.recommendedWird ||
      "Surah Al-Fatihah, 3x Surah Al-Ikhlas & Durood-e-Pak",
    featured: input.featured ?? existing?.featured ?? false,
    status: nextStatus,
    createdByUserId: existing?.createdByUserId || actor.id,
    createdByName: existing?.createdByName || actor.name,
    updatedAt: new Date().toISOString(),
  };

  if (existingIdx >= 0) {
    db.ursEvents[existingIdx] = record;
  } else {
    db.ursEvents = [record, ...db.ursEvents];
  }

  await appendAuditLog(
    db,
    actor,
    existing ? "URS_EVENT_UPDATED" : "URS_EVENT_CREATED",
    `${record.title} (${record.day} ${HIJRI_MONTHS[record.month - 1]}) [${record.status}]`
  );
  return record;
}

export async function opDeleteUrs(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  id: string
): Promise<void> {
  if (!actor || !hasPermission(actor.role, "urs:delete")) {
    throw new BackendError("Super Admin permission (urs:delete) required.", 403);
  }
  const found = db.ursEvents.find((u) => u.id === id);
  if (!found) throw new BackendError("Urs event not found.", 404);
  db.ursEvents = db.ursEvents.filter((u) => u.id !== id);
  await appendAuditLog(db, actor, "URS_EVENT_DELETED", found.title);
}

export async function opUpsertBarsi(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  input: Partial<BarsiRecord> & { personName: string; hijriMonth: number; hijriDay: number }
): Promise<BarsiRecord> {
  const ownerId = actor?.id || "guest_local";
  const ownerName = actor?.name || "Family Sanctuary Guest";
  const id = input.id || randomToken("barsi");
  const existingIdx = db.barsiRecords.findIndex((b) => b.id === id);
  const existing = existingIdx >= 0 ? db.barsiRecords[existingIdx] : null;

  if (
    existing &&
    existing.ownerUserId !== ownerId &&
    existing.ownerUserId !== "guest_local" &&
    (!actor || !hasPermission(actor.role, "barsi:moderate_community"))
  ) {
    throw new BackendError("You can only edit your own Family Barsi records.", 403);
  }

  const nowIso = new Date().toISOString();
  const visibility: BarsiRecord["visibility"] =
    input.visibility === "community" && actor ? "community" : existing?.visibility || "private";

  const record: BarsiRecord = {
    id,
    ownerUserId: existing?.ownerUserId || ownerId,
    ownerName: existing?.ownerName || ownerName,
    personName: input.personName.trim(),
    urduName: input.urduName?.trim() || existing?.urduName || input.personName.trim(),
    relation: input.relation?.trim() || existing?.relation || "Beloved Marhum / Marhuma",
    hijriMonth: Math.max(1, Math.min(12, Number(input.hijriMonth))),
    hijriDay: Math.max(1, Math.min(30, Number(input.hijriDay))),
    hijriYear: input.hijriYear ?? existing?.hijriYear,
    gregorianDeathDate: input.gregorianDeathDate ?? existing?.gregorianDeathDate,
    restingPlaceCity: input.restingPlaceCity?.trim() || existing?.restingPlaceCity || "",
    qabrastanName: input.qabrastanName?.trim() || existing?.qabrastanName || "",
    memoryNote:
      input.memoryNote?.trim() ||
      existing?.memoryNote ||
      "May Allah illuminate their grave with Noor and grant lofty ranks in Jannat-ul-Firdaws.",
    favoriteWird: input.favoriteWird?.trim() || existing?.favoriteWird || "Surah Yasin & Durood-e-Pak",
    visibility,
    khatmParas: existing?.khatmParas || {},
    totalFatihaCount: existing?.totalFatihaCount ?? 0,
    totalDuroodCount: existing?.totalDuroodCount ?? 0,
    totalYasinCount: existing?.totalYasinCount ?? 0,
    giftLogs: existing?.giftLogs || [],
    createdAt: existing?.createdAt || nowIso,
    updatedAt: nowIso,
  };

  if (existingIdx >= 0) {
    db.barsiRecords[existingIdx] = record;
  } else {
    db.barsiRecords = [record, ...db.barsiRecords];
  }

  await appendAuditLog(
    db,
    actor,
    existing ? "BARSI_UPDATED" : "BARSI_CREATED",
    `${record.personName} (${record.hijriDay} ${HIJRI_MONTHS[record.hijriMonth - 1]})`
  );
  return record;
}

export async function opLogBarsiGift(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  payload: {
    barsiId: string;
    donorName?: string;
    giftType: BarsiIsalGiftLog["giftType"];
    count?: number;
  }
): Promise<BarsiRecord> {
  const rec = db.barsiRecords.find((b) => b.id === payload.barsiId);
  if (!rec) throw new BackendError("Barsi record not found.", 404);
  const count = Math.max(1, Number(payload.count ?? 1));
  const donorName = payload.donorName?.trim() || actor?.name || "Believer";

  if (payload.giftType === "Durood-e-Pak (100x)") {
    rec.totalDuroodCount += count;
  } else if (payload.giftType === "Surah Yasin") {
    rec.totalYasinCount += count;
  } else {
    rec.totalFatihaCount += count;
  }

  const log: BarsiIsalGiftLog = {
    id: randomToken("gift"),
    donorName,
    giftType: payload.giftType,
    count,
    createdAt: new Date().toISOString(),
  };
  rec.giftLogs = [log, ...rec.giftLogs].slice(0, 40);
  rec.updatedAt = log.createdAt;
  if (actor) actor.xp += db.gamificationConfig.xpRewards.barsiFatihaGift;
  return rec;
}

export async function opToggleBarsiPara(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  payload: { barsiId: string; paraNumber: number; readerName?: string }
): Promise<BarsiRecord> {
  const rec = db.barsiRecords.find((b) => b.id === payload.barsiId);
  if (!rec) throw new BackendError("Barsi record not found.", 404);
  const p = String(Math.max(1, Math.min(30, Math.round(payload.paraNumber))));
  const nextParas = { ...rec.khatmParas };
  if (nextParas[p]) {
    delete nextParas[p];
  } else {
    nextParas[p] = payload.readerName?.trim() || actor?.name || "Completed ✓";
    if (actor) actor.xp += 30;
  }
  rec.khatmParas = nextParas;
  rec.updatedAt = new Date().toISOString();
  return rec;
}

export async function opDeleteBarsi(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  id: string
): Promise<void> {
  const rec = db.barsiRecords.find((b) => b.id === id);
  if (!rec) throw new BackendError("Barsi record not found.", 404);
  const ownerId = actor?.id || "guest_local";
  if (
    rec.ownerUserId !== ownerId &&
    rec.ownerUserId !== "guest_local" &&
    (!actor || !hasPermission(actor.role, "barsi:moderate_community"))
  ) {
    throw new BackendError("Not authorized to delete this Barsi record.", 403);
  }
  db.barsiRecords = db.barsiRecords.filter((b) => b.id !== id);
  await appendAuditLog(db, actor, "BARSI_DELETED", rec.personName);
}

export async function opSaveModules(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  modules: ModuleConfigRecord[]
): Promise<ModuleConfigRecord[]> {
  if (!actor || !hasPermission(actor.role, "modules:manage")) {
    throw new BackendError("Editor or Super Admin permission (modules:manage) required.", 403);
  }
  db.modules = modules
    .slice()
    .sort((a, b) => a.order - b.order)
    .map((m, i) => ({ ...m, order: i + 1 }));
  await appendAuditLog(db, actor, "MODULES_CONFIG_UPDATED", `Updated ${db.modules.length} modules`);
  return db.modules;
}

export async function opSaveZakatConfig(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  zakatConfig: ZakatBackendConfig
): Promise<ZakatBackendConfig> {
  if (!actor || !hasPermission(actor.role, "zakat:manage_rates")) {
    throw new BackendError("Editor or Super Admin permission (zakat:manage_rates) required.", 403);
  }
  db.zakatConfig = {
    ...zakatConfig,
    updatedAt: new Date().toISOString(),
  };
  await appendAuditLog(db, actor, "ZAKAT_BENCHMARKS_UPDATED", `${zakatConfig.currencies.length} currencies`);
  return db.zakatConfig;
}

export async function opSaveGamificationConfig(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  gamificationConfig: GamificationConfig
): Promise<GamificationConfig> {
  if (!actor || !hasPermission(actor.role, "gamification:manage")) {
    throw new BackendError("Super Admin permission (gamification:manage) required.", 403);
  }
  db.gamificationConfig = gamificationConfig;
  await appendAuditLog(db, actor, "GAMIFICATION_CONFIG_UPDATED", "Updated Spiritual Ranks & Daily Quests");
  return db.gamificationConfig;
}

export async function opSavePlatformSettings(
  db: BackendDatabaseSnapshot,
  actor: UserAccount | null,
  settings: Partial<PlatformSettings>
): Promise<PlatformSettings> {
  if (!actor || !hasPermission(actor.role, "settings:manage")) {
    throw new BackendError("Super Admin permission (settings:manage) required.", 403);
  }
  db.platformSettings = {
    ...db.platformSettings,
    ...settings,
    updatedAt: new Date().toISOString(),
  };
  await appendAuditLog(db, actor, "PLATFORM_SETTINGS_UPDATED", db.platformSettings.platformTitle);
  return db.platformSettings;
}

export function assertHasPermission(actor: UserAccount | null, perm: PermissionKey): UserAccount {
  if (!actor || !hasPermission(actor.role, perm)) {
    throw new BackendError(`Insufficient RBAC privileges: missing '${perm}'.`, 403);
  }
  return actor;
}
