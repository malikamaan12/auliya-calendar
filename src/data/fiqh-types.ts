export type FiqhCategory =
  | "Aqaid & Sunnah Creed"
  | "Wudu, Ghusl & Taharah"
  | "Salah & Jamaat"
  | "Sajda-e-Sahw & Tilawat"
  | "Jumu'ah, Eidain & Janazah"
  | "Musafir (Qasr) & Sick"
  | "Sawm (Roza) & I'tikaf"
  | "Zakat, Fitrah & Ushr"
  | "Hajj, Umrah & Qurbani"
  | "Nikah, Mirath & Mu'amalat";

export type FiqhRulingStatus =
  | "Fard"
  | "Wajib"
  | "Sunnah Mu'akkadah"
  | "Mustahabb"
  | "Makruh Tahrimi"
  | "Haram"
  | "Aqidah Qat'iyyah"
  | "Valid / Mubah";

export interface FiqhMasalah {
  id: string;
  category: FiqhCategory;
  ruling: FiqhRulingStatus;
  title: string;
  source: string;
  summary: string;
  steps: string[];
  dalilNote: string;
  tags: string[];
  deepLink: string;
}

export interface HadithItem {
  id: string;
  collection: string;
  bookSlug: string;
  chapter: string;
  topic:
    | "Iman & Aqaid"
    | "Ilm & Sunnah"
    | "Taharah & Salah"
    | "Zakat & Charity"
    | "Sawm & Ramadan"
    | "Dhikr, Dua & Durood"
    | "Auliya, Sahabah & Ahl al-Bayt"
    | "Akhlaq, Adab & Mu'amalat";
  narrator: string;
  grade: "Sahih" | "Hasan" | "Mutawatir" | "Hadith Qudsi";
  refNumber: string;
  arabic: string;
  english: string;
  urdu: string;
  sunniNote: string;
}

export type SunnahPlaybookCategory =
  | "Taharah & Masjid"
  | "Morning & Evening"
  | "Eating & Drinking"
  | "Home, Dress & Grooming"
  | "Jumu'ah & Sacred Nights"
  | "Travel, Sleep & Social Adab";

export interface SunnahPlaybook {
  id: string;
  category: SunnahPlaybookCategory;
  title: string;
  occasion: string;
  hadithRef: string;
  arabicDua: string;
  transliteration: string;
  meaning: string;
  urduMeaning: string;
  steps: string[];
}

export interface TasbihLitany {
  id: string;
  name: string;
  arabic: string;
  transliteration: string;
  translation: string;
  fazilat: string;
  defaultTarget: number;
  recommendedWindow: string;
}

export interface FiqhQuickScenario {
  id: string;
  checkerGroup: "Wudu Validity" | "Sajda-e-Sahw" | "Fasting (Roza)" | "Traveler (Qasr)";
  question: string;
  verdictBadge: string;
  verdictColor: "emerald" | "amber" | "rose";
  explanation: string;
  source: string;
}

// ---- PRAYER METHOD (TARIQA-E-NAMAZ) TYPES ----

export interface TaharahMethodGuide {
  id: "wudu" | "ghusl" | "tayammum";
  title: string;
  urduTitle: string;
  subtitle: string;
  faraid: string[];
  sunanSteps: {
    stepNum: number;
    title: string;
    ruling: "Fard" | "Sunnah" | "Mustahabb";
    detail: string;
    arabicDua?: string;
    transliteration?: string;
    translation?: string;
  }[];
  nullifiers: string[];
  source: string;
}

export interface SalahPostureStep {
  stepNumber: number;
  id: string;
  phase:
    | "Opening & Qiyam"
    | "Ruku & Qaumah"
    | "Sujood & Jalsah"
    | "Qa'dah & Tashahhud"
    | "Salam & Conclusion";
  title: string;
  arabicTitle: string;
  ruling: "Shart (Condition)" | "Fard (Rukn)" | "Wajib" | "Sunnah Mu'akkadah" | "Mustahabb";
  gazeTarget: string;
  brothersPosture: string;
  sistersPosture: string;
  recitation?: {
    label: string;
    arabic: string;
    transliteration: string;
    english: string;
    urdu: string;
  };
  fiqhTip: string;
}

export interface SpecialPrayerBlueprint {
  id: string;
  category:
    | "Daily Fard"
    | "Sunnah & Wajib"
    | "Congregational & Eid"
    | "Janazah & Special Nafl";
  title: string;
  arabicTitle: string;
  rakatsSummary: string;
  ruling: string;
  timeWindow: string;
  overview: string;
  rakatByRakat: {
    heading: string;
    instructions: string;
  }[];
  keyRecitation?: {
    title: string;
    arabic: string;
    transliteration: string;
    english: string;
    urdu: string;
  };
  hanafiNotes: string[];
  source: string;
}

export interface SalahRulingItem {
  id: string;
  group:
    | "6 Shara'it (Pre-Conditions)"
    | "6 Fara'id (Inner Pillars)"
    | "14 Wajibat of Salah"
    | "Key Sunan of Salah"
    | "Mufsidat (Nullifiers of Salah)";
  title: string;
  detail: string;
  consequenceIfMissed: string;
}
