"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Scale,
  Search,
  BookOpen,
  CheckCircle2,
  Plus,
  ArrowRight,
  Bookmark,
  Copy,
  Check,
  Volume2,
  Loader2,
  Sparkles,
  Filter,
  Compass,
  ChevronLeft,
  ChevronRight,
  Layers,
  HelpCircle,
  Hash,
  Users,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  BAHAR_E_SHARIAT_MASAIL,
  FIQH_CATEGORIES,
  FIQH_QUICK_SCENARIOS,
  FiqhCategory,
  FiqhRulingStatus,
  HADITH_COLLECTION,
  SUNNAH_PLAYBOOKS,
  SunnahPlaybookCategory,
} from "@/data/fiqh-hadith";
import {
  SALAH_ARCHITECTURE_MATRIX,
  SALAH_POSTURE_STEPS,
  SPECIAL_PRAYER_BLUEPRINTS,
  TAHARAH_METHODS,
} from "@/data/prayer-method";
import {
  fetchBookSectionHadiths,
  fetchSingleHadithByNumber,
  HADITH_BOOKS,
  HadithBookCategory,
  HadithCatalogMap,
  loadHadithCatalog,
  loadLibraryBookmarks,
  saveLibraryBookmarks,
  searchFullHadithBook,
  UnifiedHadithRecord,
} from "@/lib/hadith-api";
import { useApp } from "@/lib/store";
import { LangCode, t, tp } from "@/lib/i18n";

type MainStudioTab = "hadith" | "prayer-method" | "fiqh" | "sunnah";
type PrayerSubTab = "walkthrough" | "blueprints" | "taharah" | "matrix";
type CheckerGroupKey =
  | "All"
  | "Wudu Validity"
  | "Sajda-e-Sahw"
  | "Fasting (Roza)"
  | "Traveler (Qasr)";

const RULING_STATUSES: ("All" | FiqhRulingStatus)[] = [
  "All",
  "Fard",
  "Wajib",
  "Sunnah Mu'akkadah",
  "Mustahabb",
  "Makruh Tahrimi",
  "Haram",
  "Aqidah Qat'iyyah",
];

const SUNNAH_CATEGORIES: ("All" | SunnahPlaybookCategory)[] = [
  "All",
  "Taharah & Masjid",
  "Morning & Evening",
  "Eating & Drinking",
  "Home, Dress & Grooming",
  "Jumu'ah & Sacred Nights",
  "Travel, Sleep & Social Adab",
];

interface FiqhUiStrings {
  bookmarks: string;
  selectCollection: string;
  chapters: string;
  backToChapters: string;
  filterChapters: string;
  searchFullBook: string;
  jumpToHadith: string;
  go: string;
  sahih: string;
  hasan: string;
  all: string;
  arabic: string;
  urdu: string;
  english: string;
  previous: string;
  next: string;
  page: string;
  narratedBy: string;
  commentary: string;
  loadingHadiths: string;
  noHadithsFound: string;
  salahGuide16: string;
  prayerBlueprints12: string;
  taharahGuide: string;
  rulingsMatrix: string;
  compareBoth: string;
  brothers: string;
  sisters: string;
  guidedMode: string;
  allSteps: string;
  step: string;
  of: string;
  gaze: string;
  recitation: string;
  listen: string;
  fiqhNote: string;
  faraidPillars: string;
  sunnahSequence: string;
  nullifiers: string;
  ifOmitted: string;
  keyHanafiRulings: string;
  searchPrayerPlaceholder: string;
  rulingCheckerTitle: string;
  wuduValidity: string;
  sajdaSahw: string;
  fasting: string;
  travelerQasr: string;
  checkerPlaceholder: string;
  fiqhSearchPlaceholder: string;
  savedOnly: string;
  dalilSource: string;
  relatedModule: string;
  completed: string;
  remaining: string;
  sunnahSearchPlaceholder: string;
  markCompleted: string;
  completedToday: string;
  bookGroups: Record<"All" | HadithBookCategory, string>;
  rulingLabels: Record<"All" | FiqhRulingStatus, string>;
  fiqhCatLabels: Record<FiqhCategory, string>;
  sunnahCatLabels: Record<SunnahPlaybookCategory, string>;
}

const FIQH_UI: Record<LangCode, FiqhUiStrings> = {
  en: {
    bookmarks: "Bookmarks",
    selectCollection: "Select Collection",
    chapters: "Chapters",
    backToChapters: "Back to Chapters",
    filterChapters: "Filter chapters…",
    searchFullBook: "Search Full Book",
    jumpToHadith: "Jump to Hadith #",
    go: "Go",
    sahih: "Sahih",
    hasan: "Hasan",
    all: "All",
    arabic: "Arabic",
    urdu: "Urdu",
    english: "English",
    previous: "Previous",
    next: "Next",
    page: "Page",
    narratedBy: "Narrated by",
    commentary: "Sunni Hanafi-Maturidi Note",
    loadingHadiths: "Loading narrations…",
    noHadithsFound: "No matching narrations found in this view.",
    salahGuide16: "16-Step Salah Guide",
    prayerBlueprints12: "12 Prayer Blueprints",
    taharahGuide: "Wudu, Ghusl & Tayammum",
    rulingsMatrix: "Rulings Matrix",
    compareBoth: "Compare Both",
    brothers: "Brothers",
    sisters: "Sisters",
    guidedMode: "Guided Mode",
    allSteps: "All Steps",
    step: "Step",
    of: "of",
    gaze: "Gaze",
    recitation: "Recitation",
    listen: "Listen",
    fiqhNote: "Hanafi Ruling",
    faraidPillars: "Obligatory Pillars (Fara'id)",
    sunnahSequence: "Prophetic Sunnah Method",
    nullifiers: "Nullifiers (Nawaqid)",
    ifOmitted: "If Omitted",
    keyHanafiRulings: "Key Hanafi Rulings",
    searchPrayerPlaceholder: "Search postures, recitations, or prayers…",
    rulingCheckerTitle: "Instant Hanafi Ruling Checker",
    wuduValidity: "Wudu Validity",
    sajdaSahw: "Sajda-e-Sahw",
    fasting: "Fasting",
    travelerQasr: "Traveler Qasr",
    checkerPlaceholder: "Search everyday scenarios…",
    fiqhSearchPlaceholder: "Search Bahar-e-Shariat rulings, topics, or sources…",
    savedOnly: "Saved",
    dalilSource: "Source & Dalil",
    relatedModule: "Open Module",
    completed: "Completed",
    remaining: "Remaining",
    sunnahSearchPlaceholder: "Search Prophetic Sunnah practices…",
    markCompleted: "Mark Completed",
    completedToday: "Completed Today",
    bookGroups: {
      All: "All Collections",
      "Sihah Sittah (Six Canonical Books)": "Sihah Sittah",
      "Muwatta & Hanafi Musnad": "Muwatta & Musnad",
      "Arba'in & Hadith Qudsi": "Arba'in & Qudsi",
    },
    rulingLabels: {
      All: "All",
      Fard: "Fard",
      Wajib: "Wajib",
      "Sunnah Mu'akkadah": "Sunnah Mu'akkadah",
      Mustahabb: "Mustahabb",
      "Makruh Tahrimi": "Makruh Tahrimi",
      Haram: "Haram",
      "Aqidah Qat'iyyah": "Aqidah",
      "Valid / Mubah": "Mubah",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "Aqaid & Creed",
      "Wudu, Ghusl & Taharah": "Taharah & Wudu",
      "Salah & Jamaat": "Salah & Jamaat",
      "Sajda-e-Sahw & Tilawat": "Sajda-e-Sahw",
      "Jumu'ah, Eidain & Janazah": "Jumu'ah, Eid & Janazah",
      "Musafir (Qasr) & Sick": "Traveler (Qasr)",
      "Sawm (Roza) & I'tikaf": "Fasting & I'tikaf",
      "Zakat, Fitrah & Ushr": "Zakat & Fitrah",
      "Hajj, Umrah & Qurbani": "Hajj & Qurbani",
      "Nikah, Mirath & Mu'amalat": "Nikah & Mu'amalat",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "Taharah & Masjid",
      "Morning & Evening": "Morning & Evening",
      "Eating & Drinking": "Eating & Drinking",
      "Home, Dress & Grooming": "Home & Dress",
      "Jumu'ah & Sacred Nights": "Jumu'ah & Sacred Nights",
      "Travel, Sleep & Social Adab": "Travel, Sleep & Adab",
    },
  },
  ur: {
    bookmarks: "محفوظ شدہ",
    selectCollection: "مجموعۂ حدیث منتخب کریں",
    chapters: "ابواب و کتب",
    backToChapters: "واپس ابواب کی طرف",
    filterChapters: "باب تلاش کریں…",
    searchFullBook: "مکمل کتاب میں تلاش",
    jumpToHadith: "حدیث نمبر",
    go: "کھولیں",
    sahih: "صحیح",
    hasan: "حسن",
    all: "تمام",
    arabic: "عربی",
    urdu: "اردو",
    english: "انگریزی",
    previous: "پچھلا",
    next: "اگلا",
    page: "صفحہ",
    narratedBy: "راوی",
    commentary: "فقہی و عقائدی وضاحت",
    loadingHadiths: "احادیثِ مبارکہ لوڈ ہو رہی ہیں…",
    noHadithsFound: "اس فلٹر میں کوئی حدیث موجود نہیں۔",
    salahGuide16: "۱۶ مراحل طریقۂ نماز",
    prayerBlueprints12: "۱۲ نمازوں کے نقشے",
    taharahGuide: "وضو، غسل اور تیمم",
    rulingsMatrix: "فرائض و واجبات نقشہ",
    compareBoth: "دونوں کا تقابل",
    brothers: "اسلامی بھائی",
    sisters: "اسلامی بہنیں",
    guidedMode: "مرحلہ وار رہنمائی",
    allSteps: "تمام مراحل",
    step: "مرحلہ",
    of: "از",
    gaze: "نگاہ",
    recitation: "تسبیح و قراءت",
    listen: "تلاوت سنیں",
    fiqhNote: "مسئلہ بہارِ شریعت",
    faraidPillars: "فرائض (لازمی ارکان)",
    sunnahSequence: "مسنون طریقہ (مرحلہ وار)",
    nullifiers: "نواقض (توڑنے والی چیزیں)",
    ifOmitted: "چھوٹنے کا حکم",
    keyHanafiRulings: "اہم حنفی مسائل",
    searchPrayerPlaceholder: "قیام، رکوع، تشہد یا جنازہ تلاش کریں…",
    rulingCheckerTitle: "روزمرہ حنفی مسائل چیکر",
    wuduValidity: "وضو کے مسائل",
    sajdaSahw: "سجدۂ سہو",
    fasting: "روزہ کے مسائل",
    travelerQasr: "مسافر و قصر",
    checkerPlaceholder: "روزمرہ مسئلہ تلاش کریں…",
    fiqhSearchPlaceholder: "بہارِ شریعت اور فتاویٰ رضویہ کے مسائل تلاش کریں…",
    savedOnly: "نشان زدہ",
    dalilSource: "ماخذ و دلیل",
    relatedModule: "متعلقہ گوشہ",
    completed: "مکمل",
    remaining: "باقی",
    sunnahSearchPlaceholder: "مسنون سنتیں اور آداب تلاش کریں…",
    markCompleted: "آج مکمل کیا",
    completedToday: "آج کی سنت مکمل",
    bookGroups: {
      All: "تمام کتبِ حدیث",
      "Sihah Sittah (Six Canonical Books)": "صحاحِ ستہ",
      "Muwatta & Hanafi Musnad": "موطا و مسند",
      "Arba'in & Hadith Qudsi": "اربعین و قدسی",
    },
    rulingLabels: {
      All: "تمام احکام",
      Fard: "فرض",
      Wajib: "واجب",
      "Sunnah Mu'akkadah": "سنتِ مؤکدہ",
      Mustahabb: "مستحب",
      "Makruh Tahrimi": "مکروہِ تحریمی",
      Haram: "حرام",
      "Aqidah Qat'iyyah": "عقیدۂ قطعیہ",
      "Valid / Mubah": "مباح",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "عقائدِ اہلِ سنت",
      "Wudu, Ghusl & Taharah": "طہارت و وضو",
      "Salah & Jamaat": "نماز و جماعت",
      "Sajda-e-Sahw & Tilawat": "سجدۂ سہو و تلاوت",
      "Jumu'ah, Eidain & Janazah": "جمعہ، عیدین و جنازہ",
      "Musafir (Qasr) & Sick": "مسافر (قصر) و مریض",
      "Sawm (Roza) & I'tikaf": "روزہ و اعتکاف",
      "Zakat, Fitrah & Ushr": "زکوٰۃ، فطرہ و عشر",
      "Hajj, Umrah & Qurbani": "حج، عمرہ و قربانی",
      "Nikah, Mirath & Mu'amalat": "نکاح، میراث و معاملات",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "طہارت و مسجد",
      "Morning & Evening": "صبح و شام",
      "Eating & Drinking": "کھانے پینے کے آداب",
      "Home, Dress & Grooming": "گھر اور لباس",
      "Jumu'ah & Sacred Nights": "جمعہ اور مبارک راتیں",
      "Travel, Sleep & Social Adab": "سفر، نیند اور معاشرت",
    },
  },
  ar: {
    bookmarks: "المحفوظات",
    selectCollection: "اختر ديوان الحديث",
    chapters: "الكتب والأبواب",
    backToChapters: "العودة للأبواب",
    filterChapters: "ابحث في الأبواب…",
    searchFullBook: "بحث في كامل الكتاب",
    jumpToHadith: "رقم الحديث",
    go: "انتقال",
    sahih: "صحيح",
    hasan: "حسن",
    all: "الكل",
    arabic: "العربية",
    urdu: "الأردية",
    english: "الإنجليزية",
    previous: "السابق",
    next: "التالي",
    page: "صفحة",
    narratedBy: "الراوي",
    commentary: "الشرح الفقهي والعقدي",
    loadingHadiths: "جار تحميل الأحاديث الشريفة…",
    noHadithsFound: "لا توجد أحاديث مطابقة في هذا العرض.",
    salahGuide16: "صفة الصلاة (١٦ خطوة)",
    prayerBlueprints12: "١٢ صلاة مفصلة",
    taharahGuide: "الوضوء والغسل والتيمم",
    rulingsMatrix: "الفرائض والواجبات",
    compareBoth: "مقارنة الاثنين",
    brothers: "الرجال",
    sisters: "النساء",
    guidedMode: "الوضع الموجه",
    allSteps: "جميع الخطوات",
    step: "خطوة",
    of: "من",
    gaze: "موضع النظر",
    recitation: "الذكر والقراءة",
    listen: "استماع",
    fiqhNote: "فائدة فقهية حنفية",
    faraidPillars: "الفرائض والأركان",
    sunnahSequence: "الطريقة المسنونة بالتفصيل",
    nullifiers: "النواقض والمفسدات",
    ifOmitted: "حكم الترك",
    keyHanafiRulings: "أهم الأحكام الحنفية",
    searchPrayerPlaceholder: "ابحث في الأركان أو الأذكار أو الصلوات…",
    rulingCheckerTitle: "فاحص الأحكام الفقهية السريع",
    wuduValidity: "صحة الوضوء",
    sajdaSahw: "سجود السهو",
    fasting: "الصيام",
    travelerQasr: "قصر المسافر",
    checkerPlaceholder: "ابحث في المسائل اليومية…",
    fiqhSearchPlaceholder: "ابحث في المسائل الفقهية الحنفية…",
    savedOnly: "المحفوظ",
    dalilSource: "المصدر والدليل",
    relatedModule: "القسم المرتبط",
    completed: "مكتمل",
    remaining: "متبقٍ",
    sunnahSearchPlaceholder: "ابحث في السنن والآداب النبوية…",
    markCompleted: "تسجيل الإتمام",
    completedToday: "أُنجز اليوم",
    bookGroups: {
      All: "جميع الدواوين",
      "Sihah Sittah (Six Canonical Books)": "الصحاح الستة",
      "Muwatta & Hanafi Musnad": "الموطأ والمسانيد",
      "Arba'in & Hadith Qudsi": "الأربعون والقدسية",
    },
    rulingLabels: {
      All: "الكل",
      Fard: "فرض",
      Wajib: "واجب",
      "Sunnah Mu'akkadah": "سنة مؤكدة",
      Mustahabb: "مستحب",
      "Makruh Tahrimi": "مكروه تحريماً",
      Haram: "حرام",
      "Aqidah Qat'iyyah": "عقيدة قطعية",
      "Valid / Mubah": "مباح",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "العقيدة السنية",
      "Wudu, Ghusl & Taharah": "الطهارة والوضوء",
      "Salah & Jamaat": "الصلاة والجماعة",
      "Sajda-e-Sahw & Tilawat": "سجود السهو والتلاوة",
      "Jumu'ah, Eidain & Janazah": "الجمعة والعيدان والجنازة",
      "Musafir (Qasr) & Sick": "المسافر والمريض",
      "Sawm (Roza) & I'tikaf": "الصوم والاعتكاف",
      "Zakat, Fitrah & Ushr": "الزكاة والفطرة والعشر",
      "Hajj, Umrah & Qurbani": "الحج والعمرة والأضحية",
      "Nikah, Mirath & Mu'amalat": "النكاح والمواريث والمعاملات",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "الطهارة والمسجد",
      "Morning & Evening": "الصباح والمساء",
      "Eating & Drinking": "الطعام والشراب",
      "Home, Dress & Grooming": "المنزل واللباس",
      "Jumu'ah & Sacred Nights": "الجمعة والليالي المباركة",
      "Travel, Sleep & Social Adab": "السفر والنوم والآداب",
    },
  },
  ro_ur: {
    bookmarks: "Bookmarks",
    selectCollection: "Kitab Chunein",
    chapters: "Abwab (Chapters)",
    backToChapters: "Wapas Abwab Par",
    filterChapters: "Bab talash karein…",
    searchFullBook: "Poori Kitab Mein Talash",
    jumpToHadith: "Hadith #",
    go: "Kholein",
    sahih: "Sahih",
    hasan: "Hasan",
    all: "Tamam",
    arabic: "Arabi",
    urdu: "Urdu",
    english: "English",
    previous: "Pichla",
    next: "Agla",
    page: "Safha",
    narratedBy: "Rawi",
    commentary: "Sunni Hanafi Wazahat",
    loadingHadiths: "Ahadith load ho rahi hain…",
    noHadithsFound: "Is filter mein koi Hadith nahin mili.",
    salahGuide16: "16-Step Namaz Guide",
    prayerBlueprints12: "12 Namazon Ke Naqshe",
    taharahGuide: "Wuzu, Ghusl & Tayammum",
    rulingsMatrix: "Fara'id & Wajibat Matrix",
    compareBoth: "Dono Dekhein",
    brothers: "Islami Bhai",
    sisters: "Islami Behnein",
    guidedMode: "Step-by-Step",
    allSteps: "Tamam Marahil",
    step: "Marhala",
    of: "az",
    gaze: "Nigah",
    recitation: "Tasbih & Qira'at",
    listen: "Sunein",
    fiqhNote: "Mas'ala Bahar-e-Shariat",
    faraidPillars: "Fara'id (Lazmi Arkan)",
    sunnahSequence: "Mukammal Sunnat Tariqa",
    nullifiers: "Nawaqid (Torne Wali Cheezein)",
    ifOmitted: "Chhootne Ka Hukm",
    keyHanafiRulings: "Aham Hanafi Masa'il",
    searchPrayerPlaceholder: "Ruku, Qunoot, Tashahhud, Janazah talash karein…",
    rulingCheckerTitle: "Fauri Hanafi Mas'ala Checker",
    wuduValidity: "Wuzu Validity",
    sajdaSahw: "Sajda-e-Sahw",
    fasting: "Roza",
    travelerQasr: "Musafir Qasr",
    checkerPlaceholder: "Rozmarra mas'ala talash karein…",
    fiqhSearchPlaceholder: "Bahar-e-Shariat ke masa'il talash karein…",
    savedOnly: "Mehfooz",
    dalilSource: "Hawala & Dalil",
    relatedModule: "Mutalliqah Module",
    completed: "Mukammal",
    remaining: "Baqi",
    sunnahSearchPlaceholder: "Masnoon Sunnatein talash karein…",
    markCompleted: "Mukammal Karein",
    completedToday: "Aaj Mukammal",
    bookGroups: {
      All: "Tamam Kutub",
      "Sihah Sittah (Six Canonical Books)": "Sihah Sittah",
      "Muwatta & Hanafi Musnad": "Muwatta & Musnad",
      "Arba'in & Hadith Qudsi": "Arba'in & Qudsi",
    },
    rulingLabels: {
      All: "Tamam",
      Fard: "Farz",
      Wajib: "Wajib",
      "Sunnah Mu'akkadah": "Sunnat Mu'akkadah",
      Mustahabb: "Mustahab",
      "Makruh Tahrimi": "Makruh Tahrimi",
      Haram: "Haram",
      "Aqidah Qat'iyyah": "Aqidah",
      "Valid / Mubah": "Mubah",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "Aqaid-e-Sunnat",
      "Wudu, Ghusl & Taharah": "Wuzu & Taharat",
      "Salah & Jamaat": "Namaz & Jamaat",
      "Sajda-e-Sahw & Tilawat": "Sajda-e-Sahw",
      "Jumu'ah, Eidain & Janazah": "Jumu'ah, Eid & Janazah",
      "Musafir (Qasr) & Sick": "Musafir (Qasr)",
      "Sawm (Roza) & I'tikaf": "Roza & I'tikaf",
      "Zakat, Fitrah & Ushr": "Zakat & Fitrah",
      "Hajj, Umrah & Qurbani": "Hajj & Qurbani",
      "Nikah, Mirath & Mu'amalat": "Nikah & Mu'amalat",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "Taharat & Masjid",
      "Morning & Evening": "Subah & Shaam",
      "Eating & Drinking": "Khana & Peena",
      "Home, Dress & Grooming": "Ghar & Libas",
      "Jumu'ah & Sacred Nights": "Jumu'ah & Mubarak Raatein",
      "Travel, Sleep & Social Adab": "Safar, Neend & Adab",
    },
  },
  hi: {
    bookmarks: "बुकमार्क",
    selectCollection: "हदीस संग्रह चुनें",
    chapters: "अध्याय",
    backToChapters: "वापस अध्याय पर",
    filterChapters: "अध्याय खोजें…",
    searchFullBook: "पूरी किताब में खोजें",
    jumpToHadith: "हदीस #",
    go: "खोलें",
    sahih: "सहीह",
    hasan: "हसन",
    all: "सभी",
    arabic: "अरबी",
    urdu: "उर्दू",
    english: "अंग्रेज़ी",
    previous: "पिछला",
    next: "अगला",
    page: "पृष्ठ",
    narratedBy: "रावी",
    commentary: "सुन्नी हनफ़ी व्याख्या",
    loadingHadiths: "हदीसें लोड हो रही हैं…",
    noHadithsFound: "इस फ़िल्टर में कोई हदीस नहीं मिली।",
    salahGuide16: "16-चरणीय नमाज़ गाइड",
    prayerBlueprints12: "12 नमाज़ों की विधि",
    taharahGuide: "वुज़ू, ग़ुस्ल व तयम्मुम",
    rulingsMatrix: "फ़राइज़ व वाजिबात चार्ट",
    compareBoth: "दोनों की तुलना",
    brothers: "भाई (पुरुष)",
    sisters: "बहनें (महिलाएं)",
    guidedMode: "गाइडेड मोड",
    allSteps: "सभी चरण",
    step: "चरण",
    of: "में से",
    gaze: "निगाह",
    recitation: "तस्बीह व तिलावत",
    listen: "सुनें",
    fiqhNote: "बहार-ए-शरीअत नोट",
    faraidPillars: "फ़राइज़ (अनिवार्य स्तंभ)",
    sunnahSequence: "मसनून तरीक़ा (क्रमवार)",
    nullifiers: "नवाक़िज़ (तोड़ने वाली बातें)",
    ifOmitted: "छूटने का हुक्म",
    keyHanafiRulings: "प्रमुख हनफ़ी मसाइल",
    searchPrayerPlaceholder: "रुकू, तशह्हुद, वितर या जनाज़ा खोजें…",
    rulingCheckerTitle: "त्वरित हनफ़ी मसाइल चेकर",
    wuduValidity: "वुज़ू की वैधता",
    sajdaSahw: "सजदा-ए-सह्व",
    fasting: "रोज़ा",
    travelerQasr: "मुसाफ़िर क़स्र",
    checkerPlaceholder: "दैनिक मसअला खोजें…",
    fiqhSearchPlaceholder: "बहार-ए-शरीअत के मसाइल खोजें…",
    savedOnly: "सहेजे गए",
    dalilSource: "स्रोत व दलील",
    relatedModule: "संबंधित विभाग",
    completed: "पूर्ण",
    remaining: "शेष",
    sunnahSearchPlaceholder: "मसनून सुन्नतें खोजें…",
    markCompleted: "पूर्ण चिह्नित करें",
    completedToday: "आज पूर्ण किया",
    bookGroups: {
      All: "सभी संग्रह",
      "Sihah Sittah (Six Canonical Books)": "सिहाह सित्ता",
      "Muwatta & Hanafi Musnad": "मुवत्ता व मुसनद",
      "Arba'in & Hadith Qudsi": "अरबईन व क़ुदसी",
    },
    rulingLabels: {
      All: "सभी",
      Fard: "फ़र्ज़",
      Wajib: "वाजिब",
      "Sunnah Mu'akkadah": "सुन्नत मुअक्कदा",
      Mustahabb: "मुस्तहब",
      "Makruh Tahrimi": "मकरूह तहरीमी",
      Haram: "हराम",
      "Aqidah Qat'iyyah": "अक़ीदा",
      "Valid / Mubah": "मुबाह",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "अक़ाइद व सुन्नत",
      "Wudu, Ghusl & Taharah": "तहारत व वुज़ू",
      "Salah & Jamaat": "नमाज़ व जमाअत",
      "Sajda-e-Sahw & Tilawat": "सजदा-ए-सह्व",
      "Jumu'ah, Eidain & Janazah": "जुमुआ, ईद व जनाज़ा",
      "Musafir (Qasr) & Sick": "मुसाफ़िर (क़स्र)",
      "Sawm (Roza) & I'tikaf": "रोज़ा व एतिकाफ़",
      "Zakat, Fitrah & Ushr": "ज़कात व फ़ितरा",
      "Hajj, Umrah & Qurbani": "हज व क़ुर्बानी",
      "Nikah, Mirath & Mu'amalat": "निकाह व मुआमलात",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "तहारत व मस्जिद",
      "Morning & Evening": "सुबह व शाम",
      "Eating & Drinking": "खान-पान के आदाब",
      "Home, Dress & Grooming": "घर व लिबास",
      "Jumu'ah & Sacred Nights": "जुमुआ व मुबारक रातें",
      "Travel, Sleep & Social Adab": "सफ़र, नींद व आदाब",
    },
  },
  tr: {
    bookmarks: "Yer İmleri",
    selectCollection: "Külliyat Seçin",
    chapters: "Bölümler",
    backToChapters: "Bölümlere Dön",
    filterChapters: "Bölüm ara…",
    searchFullBook: "Tüm Kitapta Ara",
    jumpToHadith: "Hadis No",
    go: "Git",
    sahih: "Sahih",
    hasan: "Hasen",
    all: "Tümü",
    arabic: "Arapça",
    urdu: "Urduca",
    english: "İngilizce",
    previous: "Önceki",
    next: "Sonraki",
    page: "Sayfa",
    narratedBy: "Râvi",
    commentary: "Ehl-i Sünnet Hanefî Şerhi",
    loadingHadiths: "Hadis-i şerifler yükleniyor…",
    noHadithsFound: "Bu filtrede eşleşen hadis bulunamadı.",
    salahGuide16: "16 Adımda Namaz Rehberi",
    prayerBlueprints12: "12 Namaz Tablosu",
    taharahGuide: "Abdest, Gusül ve Teyemmüm",
    rulingsMatrix: "Farz, Vacip ve Müfsidler",
    compareBoth: "İkisini Karşılaştır",
    brothers: "Erkekler",
    sisters: "Hanımlar",
    guidedMode: "Adım Adım Mod",
    allSteps: "Tüm Adımlar",
    step: "Adım",
    of: "/",
    gaze: "Bakış Yeri",
    recitation: "Okunuş ve Tesbih",
    listen: "Dinle",
    fiqhNote: "Hanefî Fıkıh Notu",
    faraidPillars: "Farzlar (Rükünler)",
    sunnahSequence: "Sünnet Üzere Uygulama",
    nullifiers: "Bozan Haller (Nevâkız)",
    ifOmitted: "Terk Hükmü",
    keyHanafiRulings: "Temel Hanefî Hükümleri",
    searchPrayerPlaceholder: "Rükû, Kunut, Teşehhüd veya Cenaze ara…",
    rulingCheckerTitle: "Hızlı Hanefî İlmihal Kontrolü",
    wuduValidity: "Abdest Sıhhati",
    sajdaSahw: "Sehiv Secdesi",
    fasting: "Oruç",
    travelerQasr: "Seferî (Kasr)",
    checkerPlaceholder: "Günlük mesele ara…",
    fiqhSearchPlaceholder: "Hanefî fıkıh meselelerinde ara…",
    savedOnly: "Kayıtlı",
    dalilSource: "Kaynak ve Delil",
    relatedModule: "İlgili Bölüm",
    completed: "Tamamlandı",
    remaining: "Kalan",
    sunnahSearchPlaceholder: "Sünnet-i Seniyye rehberlerinde ara…",
    markCompleted: "Tamamlandı İşaretle",
    completedToday: "Bugün Uygulandı",
    bookGroups: {
      All: "Tüm Kitaplar",
      "Sihah Sittah (Six Canonical Books)": "Kütüb-i Sitte",
      "Muwatta & Hanafi Musnad": "Muvatta ve Müsned",
      "Arba'in & Hadith Qudsi": "Erbaîn ve Kudsî",
    },
    rulingLabels: {
      All: "Tümü",
      Fard: "Farz",
      Wajib: "Vacip",
      "Sunnah Mu'akkadah": "Sünnet-i Müekkede",
      Mustahabb: "Müstehap",
      "Makruh Tahrimi": "Tahrimen Mekruh",
      Haram: "Haram",
      "Aqidah Qat'iyyah": "İtikad",
      "Valid / Mubah": "Mübah",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "Akaid ve İtikad",
      "Wudu, Ghusl & Taharah": "Taharet ve Abdest",
      "Salah & Jamaat": "Namaz ve Cemaat",
      "Sajda-e-Sahw & Tilawat": "Sehiv ve Tilavet Secdesi",
      "Jumu'ah, Eidain & Janazah": "Cuma, Bayram ve Cenaze",
      "Musafir (Qasr) & Sick": "Seferîlik ve Hastalık",
      "Sawm (Roza) & I'tikaf": "Oruç ve İtikâf",
      "Zakat, Fitrah & Ushr": "Zekât, Fitre ve Öşür",
      "Hajj, Umrah & Qurbani": "Hac, Umre ve Kurban",
      "Nikah, Mirath & Mu'amalat": "Nikâh, Miras ve Muamelat",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "Taharet ve Mescid",
      "Morning & Evening": "Sabah ve Akşam",
      "Eating & Drinking": "Yeme ve İçme",
      "Home, Dress & Grooming": "Ev ve Giyim Âdâbı",
      "Jumu'ah & Sacred Nights": "Cuma ve Mübarek Geceler",
      "Travel, Sleep & Social Adab": "Yolculuk, Uyku ve Âdâb",
    },
  },
  bn: {
    bookmarks: "বুকমার্ক",
    selectCollection: "সংগ্রহ নির্বাচন করুন",
    chapters: "অধ্যায়সমূহ",
    backToChapters: "অধ্যায়ে ফিরে যান",
    filterChapters: "অধ্যায় খুঁজুন…",
    searchFullBook: "সম্পূর্ণ কিতাবে খুঁজুন",
    jumpToHadith: "হাদিস নং",
    go: "যান",
    sahih: "সহিহ",
    hasan: "হাসান",
    all: "সব",
    arabic: "আরবি",
    urdu: "উর্দু",
    english: "ইংরেজি",
    previous: "পূর্ববর্তী",
    next: "পরবর্তী",
    page: "পৃষ্ঠা",
    narratedBy: "বর্ণনাকারী",
    commentary: "সুন্নি হানাফি ব্যাখ্যা",
    loadingHadiths: "হাদিস লোড হচ্ছে…",
    noHadithsFound: "এই ফিল্টারে কোনো হাদিস পাওয়া যায়নি।",
    salahGuide16: "১৬ ধাপে নামাজ শিক্ষা",
    prayerBlueprints12: "১২ প্রকার নামাজের নিয়ম",
    taharahGuide: "ওযু, গোসল ও তায়াম্মুম",
    rulingsMatrix: "ফরজ, ওয়াজিব ও ভঙ্গের কারণ",
    compareBoth: "উভয় তুলনা",
    brothers: "ভাইদের নিয়ম",
    sisters: "বোনদের নিয়ম",
    guidedMode: "ধাপে ধাপে মোড",
    allSteps: "সব ধাপ",
    step: "ধাপ",
    of: "/",
    gaze: "দৃষ্টি",
    recitation: "তাসবিহ ও কিরাত",
    listen: "শুনুন",
    fiqhNote: "বাহারে শরীয়ত নোট",
    faraidPillars: "ফরজসমূহ (অপরিহার্য রুকন)",
    sunnahSequence: "পূর্ণ সুন্নাত পদ্ধতি",
    nullifiers: "ভঙ্গের কারণসমূহ",
    ifOmitted: "ছুটে গেলে হুকুম",
    keyHanafiRulings: "গুরুত্বপূর্ণ হানাফি মাসায়েল",
    searchPrayerPlaceholder: "রুকু, কুনুত, তাশাহহুদ বা জানাজা খুঁজুন…",
    rulingCheckerTitle: "তাৎক্ষণিক হানাফি মাসআলা যাচাই",
    wuduValidity: "ওযু ভঙ্গ",
    sajdaSahw: "সিজদায়ে সাহু",
    fasting: "রোজা",
    travelerQasr: "মুসাফির কসর",
    checkerPlaceholder: "দৈনন্দিন মাসআলা খুঁজুন…",
    fiqhSearchPlaceholder: "বাহারে শরীয়ত মাসায়েল অনুসন্ধান করুন…",
    savedOnly: "সংরক্ষিত",
    dalilSource: "সূত্র ও দলিল",
    relatedModule: "সংশ্লিষ্ট বিভাগ",
    completed: "সম্পন্ন",
    remaining: "বাকি",
    sunnahSearchPlaceholder: "মাসনুন সুন্নাহ অনুসন্ধান করুন…",
    markCompleted: "সম্পন্ন চিহ্নিত করুন",
    completedToday: "আজ সম্পন্ন হয়েছে",
    bookGroups: {
      All: "সব গ্রন্থ",
      "Sihah Sittah (Six Canonical Books)": "সিহাহ সিত্তাহ",
      "Muwatta & Hanafi Musnad": "মুয়াত্তা ও মুসনাদ",
      "Arba'in & Hadith Qudsi": "আরবাইন ও কুদসি",
    },
    rulingLabels: {
      All: "সব",
      Fard: "ফরজ",
      Wajib: "ওয়াজিব",
      "Sunnah Mu'akkadah": "সুন্নাতে মুয়াক্কাদা",
      Mustahabb: "মুস্তাহাব",
      "Makruh Tahrimi": "মাকরুহে তাহরিমি",
      Haram: "হারাম",
      "Aqidah Qat'iyyah": "আকিদা",
      "Valid / Mubah": "মুবাহ",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "আকাইদ ও সুন্নাহ",
      "Wudu, Ghusl & Taharah": "তাহারাত ও ওযু",
      "Salah & Jamaat": "নামাজ ও জামাত",
      "Sajda-e-Sahw & Tilawat": "সিজদায়ে সাহু",
      "Jumu'ah, Eidain & Janazah": "জুমুআ, ঈদ ও জানাজা",
      "Musafir (Qasr) & Sick": "মুসাফির (কসর)",
      "Sawm (Roza) & I'tikaf": "রোজা ও ইতিকাফ",
      "Zakat, Fitrah & Ushr": "যাকাত ও ফিতরা",
      "Hajj, Umrah & Qurbani": "হজ ও কুরবানি",
      "Nikah, Mirath & Mu'amalat": "নিকাহ ও মুআমালাত",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "তাহারাত ও মসজিদ",
      "Morning & Evening": "সকাল ও সন্ধ্যা",
      "Eating & Drinking": "পানাহারের আদব",
      "Home, Dress & Grooming": "ঘর ও পোশাক",
      "Jumu'ah & Sacred Nights": "জুমুআ ও মহিমান্বিত রাত",
      "Travel, Sleep & Social Adab": "সফর, ঘুম ও আদব",
    },
  },
  fa: {
    bookmarks: "نشان‌شده‌ها",
    selectCollection: "انتخاب مجموعه حدیث",
    chapters: "کتاب‌ها و ابواب",
    backToChapters: "بازگشت به ابواب",
    filterChapters: "جستجوی باب…",
    searchFullBook: "جستجو در کل کتاب",
    jumpToHadith: "شماره حدیث",
    go: "برو",
    sahih: "صحیح",
    hasan: "حسن",
    all: "همه",
    arabic: "عربی",
    urdu: "اردو",
    english: "انگلیسی",
    previous: "قبلی",
    next: "بعدی",
    page: "صفحه",
    narratedBy: "راوی",
    commentary: "شرح فقهی حنفی و ماتریدی",
    loadingHadiths: "در حال بارگذاری احادیث…",
    noHadithsFound: "در این نما حدیثی یافت نشد.",
    salahGuide16: "آموزش ۱۶ مرحله‌ای نماز",
    prayerBlueprints12: "الگوی ۱۲ نماز",
    taharahGuide: "وضو، غسل و تیمم",
    rulingsMatrix: "جدول فرائض و واجبات",
    compareBoth: "مقایسه هر دو",
    brothers: "آقایان",
    sisters: "بانوان",
    guidedMode: "حالت گام‌به‌گام",
    allSteps: "همه مراحل",
    step: "مرحله",
    of: "از",
    gaze: "محل نگاه",
    recitation: "ذکر و قرائت",
    listen: "شنیدن",
    fiqhNote: "نکته فقه حنفی",
    faraidPillars: "فرائض (ارکان واجب)",
    sunnahSequence: "روش کامل سنت نبوی",
    nullifiers: "نواقض و باطل‌کننده‌ها",
    ifOmitted: "حکم ترک",
    keyHanafiRulings: "احکام کلیدی حنفی",
    searchPrayerPlaceholder: "جستجوی رکوع، قنوت، تشهد یا جنازه…",
    rulingCheckerTitle: "بررسی سریع مسائل فقه حنفی",
    wuduValidity: "صحت وضو",
    sajdaSahw: "سجده سهو",
    fasting: "روزه",
    travelerQasr: "قصر مسافر",
    checkerPlaceholder: "جستجوی مسائل روزمره…",
    fiqhSearchPlaceholder: "جستجو در مسائل بهار شریعت…",
    savedOnly: "نشان‌شده",
    dalilSource: "منبع و دلیل",
    relatedModule: "بخش مرتبط",
    completed: "تکمیل‌شده",
    remaining: "باقی‌مانده",
    sunnahSearchPlaceholder: "جستجوی سنت‌های نبوی…",
    markCompleted: "ثبت انجام",
    completedToday: "امروز انجام شد",
    bookGroups: {
      All: "همه مجموعه‌ها",
      "Sihah Sittah (Six Canonical Books)": "صحاح سته",
      "Muwatta & Hanafi Musnad": "موطا و مسند",
      "Arba'in & Hadith Qudsi": "اربعین و قدسی",
    },
    rulingLabels: {
      All: "همه",
      Fard: "فرض",
      Wajib: "واجب",
      "Sunnah Mu'akkadah": "سنت مؤکده",
      Mustahabb: "مستحب",
      "Makruh Tahrimi": "مکروه تحریمی",
      Haram: "حرام",
      "Aqidah Qat'iyyah": "عقیده قطعی",
      "Valid / Mubah": "مباح",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "عقاید اهل سنت",
      "Wudu, Ghusl & Taharah": "طهارت و وضو",
      "Salah & Jamaat": "نماز و جماعت",
      "Sajda-e-Sahw & Tilawat": "سجده سهو و تلاوت",
      "Jumu'ah, Eidain & Janazah": "جمعه، عیدین و جنازه",
      "Musafir (Qasr) & Sick": "مسافر (قصر)",
      "Sawm (Roza) & I'tikaf": "روزه و اعتکاف",
      "Zakat, Fitrah & Ushr": "زکات و فطریه",
      "Hajj, Umrah & Qurbani": "حج و قربانی",
      "Nikah, Mirath & Mu'amalat": "نکاح و معاملات",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "طهارت و مسجد",
      "Morning & Evening": "صبح و شام",
      "Eating & Drinking": "آداب خوردن و آشامیدن",
      "Home, Dress & Grooming": "خانه و پوشش",
      "Jumu'ah & Sacred Nights": "جمعه و شب‌های مبارک",
      "Travel, Sleep & Social Adab": "سفر، خواب و آداب",
    },
  },
  id: {
    bookmarks: "Markah",
    selectCollection: "Pilih Kitab",
    chapters: "Bab",
    backToChapters: "Kembali ke Bab",
    filterChapters: "Cari bab…",
    searchFullBook: "Cari Seluruh Kitab",
    jumpToHadith: "Hadis #",
    go: "Buka",
    sahih: "Shahih",
    hasan: "Hasan",
    all: "Semua",
    arabic: "Arab",
    urdu: "Urdu",
    english: "Inggris",
    previous: "Sebelumnya",
    next: "Berikutnya",
    page: "Halaman",
    narratedBy: "Diriwayatkan oleh",
    commentary: "Catatan Sunni Hanafi",
    loadingHadiths: "Memuat riwayat hadis…",
    noHadithsFound: "Tidak ada hadis yang cocok pada tampilan ini.",
    salahGuide16: "Panduan Shalat 16 Langkah",
    prayerBlueprints12: "12 Panduan Jenis Shalat",
    taharahGuide: "Wudhu, Ghusl & Tayamum",
    rulingsMatrix: "Matriks Rukun & Wajib",
    compareBoth: "Bandingkan",
    brothers: "Laki-laki",
    sisters: "Perempuan",
    guidedMode: "Mode Terpandu",
    allSteps: "Semua Langkah",
    step: "Langkah",
    of: "dari",
    gaze: "Pandangan",
    recitation: "Bacaan",
    listen: "Dengar",
    fiqhNote: "Catatan Fiqih Hanafi",
    faraidPillars: "Rukun Wajib (Fardhu)",
    sunnahSequence: "Urutan Sunnah Lengkap",
    nullifiers: "Pembatal (Nawaqidh)",
    ifOmitted: "Jika Tertinggal",
    keyHanafiRulings: "Ketentuan Utama Hanafi",
    searchPrayerPlaceholder: "Cari gerakan, bacaan, atau shalat…",
    rulingCheckerTitle: "Pemeriksa Cepat Hukum Hanafi",
    wuduValidity: "Sahnya Wudhu",
    sajdaSahw: "Sujud Sahwi",
    fasting: "Puasa",
    travelerQasr: "Musafir Qashar",
    checkerPlaceholder: "Cari masalah sehari-hari…",
    fiqhSearchPlaceholder: "Cari hukum Bahar-e-Shariat, topik, atau dalil…",
    savedOnly: "Tersimpan",
    dalilSource: "Sumber & Dalil",
    relatedModule: "Buka Modul",
    completed: "Selesai",
    remaining: "Belum",
    sunnahSearchPlaceholder: "Cari amalan Sunnah Nabi ﷺ…",
    markCompleted: "Tandai Selesai",
    completedToday: "Selesai Hari Ini",
    bookGroups: {
      All: "Semua Koleksi",
      "Sihah Sittah (Six Canonical Books)": "Kutubus Sittah",
      "Muwatta & Hanafi Musnad": "Muwatha & Musnad",
      "Arba'in & Hadith Qudsi": "Arba'in & Qudsi",
    },
    rulingLabels: {
      All: "Semua",
      Fard: "Fardhu",
      Wajib: "Wajib",
      "Sunnah Mu'akkadah": "Sunnah Muakkadah",
      Mustahabb: "Mustahab",
      "Makruh Tahrimi": "Makruh Tahrimi",
      Haram: "Haram",
      "Aqidah Qat'iyyah": "Aqidah",
      "Valid / Mubah": "Mubah",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "Aqidah Ahlussunnah",
      "Wudu, Ghusl & Taharah": "Thaharah & Wudhu",
      "Salah & Jamaat": "Shalat & Jamaah",
      "Sajda-e-Sahw & Tilawat": "Sujud Sahwi",
      "Jumu'ah, Eidain & Janazah": "Jumat, Id & Jenazah",
      "Musafir (Qasr) & Sick": "Musafir (Qashar)",
      "Sawm (Roza) & I'tikaf": "Puasa & I'tikaf",
      "Zakat, Fitrah & Ushr": "Zakat & Fitrah",
      "Hajj, Umrah & Qurbani": "Haji & Qurban",
      "Nikah, Mirath & Mu'amalat": "Nikah & Muamalah",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "Thaharah & Masjid",
      "Morning & Evening": "Pagi & Petang",
      "Eating & Drinking": "Adab Makan & Minum",
      "Home, Dress & Grooming": "Rumah & Pakaian",
      "Jumu'ah & Sacred Nights": "Jumat & Malam Mulia",
      "Travel, Sleep & Social Adab": "Safar, Tidur & Adab",
    },
  },
  fr: {
    bookmarks: "Favoris",
    selectCollection: "Choisir un recueil",
    chapters: "Chapitres",
    backToChapters: "Retour aux chapitres",
    filterChapters: "Filtrer les chapitres…",
    searchFullBook: "Rechercher dans tout le livre",
    jumpToHadith: "Hadith n°",
    go: "Aller",
    sahih: "Sahih",
    hasan: "Hasan",
    all: "Tout",
    arabic: "Arabe",
    urdu: "Ourdou",
    english: "Anglais",
    previous: "Précédent",
    next: "Suivant",
    page: "Page",
    narratedBy: "Rapporté par",
    commentary: "Note Sunnite Hanafite",
    loadingHadiths: "Chargement des hadiths…",
    noHadithsFound: "Aucun hadith correspondant dans cette vue.",
    salahGuide16: "Guide de Prière en 16 étapes",
    prayerBlueprints12: "12 Modèles de Prières",
    taharahGuide: "Wudu, Ghusl & Tayammum",
    rulingsMatrix: "Matrice des Règles",
    compareBoth: "Comparer les deux",
    brothers: "Hommes",
    sisters: "Femmes",
    guidedMode: "Mode guidé",
    allSteps: "Toutes les étapes",
    step: "Étape",
    of: "sur",
    gaze: "Regard",
    recitation: "Récitation",
    listen: "Écouter",
    fiqhNote: "Règle Hanafite",
    faraidPillars: "Piliers obligatoires (Fara'id)",
    sunnahSequence: "Méthode prophétique complète",
    nullifiers: "Annulatifs (Nawaqid)",
    ifOmitted: "En cas d'oubli",
    keyHanafiRulings: "Règles Hanafites clés",
    searchPrayerPlaceholder: "Rechercher postures, invocations ou prières…",
    rulingCheckerTitle: "Vérificateur Rapide de Fiqh Hanafite",
    wuduValidity: "Validité du Wudu",
    sajdaSahw: "Sajda-e-Sahw",
    fasting: "Jeûne",
    travelerQasr: "Voyageur (Qasr)",
    checkerPlaceholder: "Filtrer les cas fréquents…",
    fiqhSearchPlaceholder: "Rechercher dans les règles de Bahar-e-Shariat…",
    savedOnly: "Enregistrés",
    dalilSource: "Source & Preuve",
    relatedModule: "Ouvrir le module",
    completed: "Accompli",
    remaining: "À faire",
    sunnahSearchPlaceholder: "Rechercher dans les Sunnas prophétiques…",
    markCompleted: "Marquer accompli",
    completedToday: "Accompli aujourd'hui",
    bookGroups: {
      All: "Tous les recueils",
      "Sihah Sittah (Six Canonical Books)": "Sihah Sittah",
      "Muwatta & Hanafi Musnad": "Muwatta & Musnad",
      "Arba'in & Hadith Qudsi": "Arba'in & Qudsi",
    },
    rulingLabels: {
      All: "Tout",
      Fard: "Fard",
      Wajib: "Wajib",
      "Sunnah Mu'akkadah": "Sunna Mou'akkada",
      Mustahabb: "Moustahabb",
      "Makruh Tahrimi": "Makruh Tahrimi",
      Haram: "Haram",
      "Aqidah Qat'iyyah": "Croyance",
      "Valid / Mubah": "Licite",
    },
    fiqhCatLabels: {
      "Aqaid & Sunnah Creed": "Dogme Sunnite",
      "Wudu, Ghusl & Taharah": "Pureté & Ablutions",
      "Salah & Jamaat": "Prière & Groupe",
      "Sajda-e-Sahw & Tilawat": "Prosternation d'oubli",
      "Jumu'ah, Eidain & Janazah": "Vendredi, Aïd & Janaza",
      "Musafir (Qasr) & Sick": "Voyageur (Qasr)",
      "Sawm (Roza) & I'tikaf": "Jeûne & I'tikaf",
      "Zakat, Fitrah & Ushr": "Zakat & Fitrah",
      "Hajj, Umrah & Qurbani": "Hajj & Sacrifice",
      "Nikah, Mirath & Mu'amalat": "Mariage & Transactions",
    },
    sunnahCatLabels: {
      "Taharah & Masjid": "Pureté & Mosquée",
      "Morning & Evening": "Matin & Soir",
      "Eating & Drinking": "Repas & Boisson",
      "Home, Dress & Grooming": "Foyer & Tenue",
      "Jumu'ah & Sacred Nights": "Vendredi & Nuits Sacrées",
      "Travel, Sleep & Social Adab": "Voyage, Sommeil & Adab",
    },
  },
};

function speakArabicOrEnglish(text: string, voiceLang: "ar-SA" | "en-US" = "ar-SA") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = voiceLang;
    u.rate = voiceLang === "ar-SA" ? 0.85 : 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore speech synthesis restrictions
  }
}

function FiqhHadithInner() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as MainStudioTab) || "hadith";

  const { lang, sunnahChecks, toggleSunnah } = useApp();
  const ui = FIQH_UI[lang] || FIQH_UI.en;
  const preferUrdu = lang === "ur" || lang === "fa";

  const [activeTab, setActiveTab] = useState<MainStudioTab>(
    ["hadith", "prayer-method", "fiqh", "sunnah"].includes(initialTab)
      ? initialTab
      : "hadith"
  );

  // Persistent Bookmarks across Hadith, Fiqh & Prayer Blueprints
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // =========================================================================
  // 1. HADITH BOOKS LIBRARY STATE
  // =========================================================================
  const [catalog, setCatalog] = useState<HadithCatalogMap | null>(null);
  const [bookGroupFilter, setBookGroupFilter] = useState<
    "All" | HadithBookCategory
  >("All");
  const [selectedBookId, setSelectedBookId] = useState<string>("bukhari");
  const [selectedSectionNum, setSelectedSectionNum] = useState<number>(1);
  const [sectionSearchQuery, setSectionSearchQuery] = useState("");
  const [hadithQuery, setHadithQuery] = useState("");
  const [hadithGradeFilter, setHadithGradeFilter] = useState<
    "All" | "Sahih" | "Hasan"
  >("All");
  const [anthologyTopicFilter, setAnthologyTopicFilter] =
    useState<string>("All");
  const [onlyBookmarkedHadith, setOnlyBookmarkedHadith] = useState(false);

  // Language Visibility Toggles
  const [showArabic, setShowArabic] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);

  // Auto-sync Hadith & Prayer language emphasis with global `lang`
  useEffect(() => {
    Promise.resolve().then(() => {
      if (lang === "ur" || lang === "fa") {
        setShowUrdu(true);
      } else if (lang === "ar") {
        setShowArabic(true);
      }
    });
  }, [lang]);

  // Remote Canonical Book Section / Search State
  const [sectionHadiths, setSectionHadiths] = useState<UnifiedHadithRecord[]>([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [hadithPage, setHadithPage] = useState(1);

  // Full-book Deep Search & Direct Hadith # Jump
  const [jumpNumberInput, setJumpNumberInput] = useState("");
  const [fullSearchActive, setFullSearchActive] = useState(false);
  const [fullSearchLoading, setFullSearchLoading] = useState(false);
  const [fullSearchResults, setFullSearchResults] = useState<{
    total: number;
    items: UnifiedHadithRecord[];
  } | null>(null);

  // =========================================================================
  // 2. HANAFI PRAYER METHOD (TARIQA-E-NAMAZ) STATE
  // =========================================================================
  const [prayerSubTab, setPrayerSubTab] = useState<PrayerSubTab>("walkthrough");
  const [postureGenderMode, setPostureGenderMode] = useState<
    "brothers" | "sisters" | "both"
  >("both");
  const [walkthroughViewMode, setWalkthroughViewMode] = useState<
    "guided" | "all"
  >("all");
  const [guidedStepIdx, setGuidedStepIdx] = useState(0);
  const [prayerSearch, setPrayerSearch] = useState("");
  const [posturePhaseFilter, setPosturePhaseFilter] = useState<string>("All");
  const [postureRulingFilter, setPostureRulingFilter] = useState<string>("All");
  const [blueprintCategoryFilter, setBlueprintCategoryFilter] =
    useState<string>("All");
  const [selectedBlueprintId, setSelectedBlueprintId] =
    useState<string>("fajr-2-fard");
  const [selectedTaharahId, setSelectedTaharahId] = useState<
    "wudu" | "ghusl" | "tayammum"
  >("wudu");
  const [matrixGroupFilter, setMatrixGroupFilter] = useState<string>("All");

  // =========================================================================
  // 3. HANAFI FIQH ENCYCLOPEDIA STATE
  // =========================================================================
  const [fiqhQuery, setFiqhQuery] = useState("");
  const [fiqhCategory, setFiqhCategory] = useState<"All" | FiqhCategory>("All");
  const [fiqhRuling, setFiqhRuling] = useState<"All" | FiqhRulingStatus>("All");
  const [onlyBookmarkedFiqh, setOnlyBookmarkedFiqh] = useState(false);
  const [checkerGroup, setCheckerGroup] =
    useState<CheckerGroupKey>("Wudu Validity");
  const [checkerQuery, setCheckerQuery] = useState("");

  // =========================================================================
  // 4. MASNOON SUNNAH PLAYBOOKS STATE
  // =========================================================================
  const [sunnahQuery, setSunnahQuery] = useState("");
  const [sunnahCat, setSunnahCat] = useState<"All" | SunnahPlaybookCategory>("All");
  const [sunnahStatusFilter, setSunnahStatusFilter] = useState<
    "All" | "Completed" | "Remaining"
  >("All");

  // Hydrate bookmarks & 10-Book Hadith Catalog
  useEffect(() => {
    Promise.resolve().then(() => {
      setBookmarks(loadLibraryBookmarks());
    });
    loadHadithCatalog()
      .then((cat) => setCatalog(cat))
      .catch(() => undefined);
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveLibraryBookmarks(next);
      return next;
    });
  }, []);

  const copyCitation = useCallback((id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }, []);

  const selectedBook = useMemo(
    () => HADITH_BOOKS.find((b) => b.id === selectedBookId) || HADITH_BOOKS[0],
    [selectedBookId]
  );

  const visibleBooks = useMemo(
    () =>
      HADITH_BOOKS.filter(
        (b) => bookGroupFilter === "All" || b.category === bookGroupFilter
      ),
    [bookGroupFilter]
  );

  const bookSections = useMemo(() => {
    if (!catalog || selectedBook.isBuiltInAnthology) return [];
    const list = catalog[selectedBook.id]?.sections || [];
    const q = sectionSearchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) => s.title.toLowerCase().includes(q) || String(s.num) === q
    );
  }, [catalog, selectedBook, sectionSearchQuery]);

  const activeSectionMeta = useMemo(() => {
    if (!catalog || selectedBook.isBuiltInAnthology) return null;
    const list = catalog[selectedBook.id]?.sections || [];
    return list.find((s) => s.num === selectedSectionNum) || list[0] || null;
  }, [catalog, selectedBook, selectedSectionNum]);

  const activeSecNum = activeSectionMeta?.num ?? 1;
  const activeSecTitle = activeSectionMeta?.title ?? "Chapter 1";

  // Load selected chapter Hadiths for canonical books
  useEffect(() => {
    if (selectedBook.isBuiltInAnthology || fullSearchActive) return;
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;
      setSectionLoading(true);
      setSectionError(null);
    });

    fetchBookSectionHadiths(selectedBook, activeSecNum, activeSecTitle)
      .then((records) => {
        if (cancelled) return;
        setSectionHadiths(records);
        setSectionLoading(false);
        setHadithPage(1);
      })
      .catch(() => {
        if (cancelled) return;
        setSectionError(
          "Could not reach Hadith CDN right now — switch to 'Sunni Hanafi Anthology' for instant offline Hadiths or retry."
        );
        setSectionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBook, activeSecNum, activeSecTitle, fullSearchActive]);

  const runFullBookSearch = async () => {
    if (selectedBook.isBuiltInAnthology || !hadithQuery.trim()) return;
    setFullSearchActive(true);
    setFullSearchLoading(true);
    setSectionError(null);
    try {
      const res = await searchFullHadithBook(
        selectedBook,
        hadithQuery,
        hadithGradeFilter,
        35
      );
      setFullSearchResults({ total: res.totalMatches, items: res.items });
    } catch {
      setSectionError("Unable to search full book at the moment.");
    } finally {
      setFullSearchLoading(false);
    }
  };

  const runJumpToHadithNumber = async () => {
    const num = parseInt(jumpNumberInput.trim(), 10);
    if (!Number.isFinite(num) || num < 1 || selectedBook.isBuiltInAnthology) return;
    setFullSearchActive(true);
    setFullSearchLoading(true);
    setSectionError(null);
    try {
      const single = await fetchSingleHadithByNumber(selectedBook, num, catalog);
      setFullSearchResults({
        total: single ? 1 : 0,
        items: single ? [single] : [],
      });
    } catch {
      setFullSearchResults({ total: 0, items: [] });
    } finally {
      setFullSearchLoading(false);
    }
  };

  const displayedRemoteHadiths = useMemo(() => {
    const base =
      fullSearchActive && fullSearchResults
        ? fullSearchResults.items
        : sectionHadiths;
    const q = hadithQuery.trim().toLowerCase();

    return base.filter((h) => {
      if (onlyBookmarkedHadith && !bookmarks.includes(h.uid)) return false;
      if (hadithGradeFilter === "Sahih" && !/sahih/i.test(h.primaryGrade)) {
        return false;
      }
      if (hadithGradeFilter === "Hasan" && !/hasan/i.test(h.primaryGrade)) {
        return false;
      }
      if (!q || fullSearchActive) return true;
      return (
        h.english.toLowerCase().includes(q) ||
        h.arabic.includes(hadithQuery.trim()) ||
        h.urdu.includes(hadithQuery.trim()) ||
        String(h.hadithNumber) === q ||
        (h.narratorHint && h.narratorHint.toLowerCase().includes(q))
      );
    });
  }, [
    fullSearchActive,
    fullSearchResults,
    sectionHadiths,
    hadithQuery,
    onlyBookmarkedHadith,
    bookmarks,
    hadithGradeFilter,
  ]);

  const PAGE_SIZE = 20;
  const totalHadithPages = Math.max(
    1,
    Math.ceil(displayedRemoteHadiths.length / PAGE_SIZE)
  );
  const paginatedRemoteHadiths = useMemo(
    () =>
      displayedRemoteHadiths.slice(
        (hadithPage - 1) * PAGE_SIZE,
        hadithPage * PAGE_SIZE
      ),
    [displayedRemoteHadiths, hadithPage]
  );

  const filteredAnthology = useMemo(() => {
    const q = hadithQuery.trim().toLowerCase();
    return HADITH_COLLECTION.filter((h) => {
      if (onlyBookmarkedHadith && !bookmarks.includes(h.id)) return false;
      if (anthologyTopicFilter !== "All" && h.topic !== anthologyTopicFilter) {
        return false;
      }
      if (
        hadithGradeFilter !== "All" &&
        !h.grade.toLowerCase().includes(hadithGradeFilter.toLowerCase())
      ) {
        return false;
      }
      if (!q) return true;
      return (
        h.english.toLowerCase().includes(q) ||
        h.collection.toLowerCase().includes(q) ||
        h.narrator.toLowerCase().includes(q) ||
        h.sunniNote.toLowerCase().includes(q) ||
        h.arabic.includes(hadithQuery.trim()) ||
        h.urdu.includes(hadithQuery.trim())
      );
    });
  }, [
    hadithQuery,
    onlyBookmarkedHadith,
    bookmarks,
    anthologyTopicFilter,
    hadithGradeFilter,
  ]);

  const filteredPostureSteps = useMemo(() => {
    const q = prayerSearch.trim().toLowerCase();
    return SALAH_POSTURE_STEPS.filter((s) => {
      if (posturePhaseFilter !== "All" && s.phase !== posturePhaseFilter) {
        return false;
      }
      if (postureRulingFilter !== "All" && s.ruling !== postureRulingFilter) {
        return false;
      }
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.brothersPosture.toLowerCase().includes(q) ||
        s.sistersPosture.toLowerCase().includes(q) ||
        s.fiqhTip.toLowerCase().includes(q) ||
        (s.recitation &&
          (s.recitation.transliteration.toLowerCase().includes(q) ||
            s.recitation.english.toLowerCase().includes(q) ||
            s.recitation.urdu.includes(prayerSearch.trim()) ||
            s.recitation.label.toLowerCase().includes(q)))
      );
    });
  }, [prayerSearch, posturePhaseFilter, postureRulingFilter]);

  const filteredBlueprints = useMemo(() => {
    const q = prayerSearch.trim().toLowerCase();
    return SPECIAL_PRAYER_BLUEPRINTS.filter((bp) => {
      if (
        blueprintCategoryFilter !== "All" &&
        bp.category !== blueprintCategoryFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        bp.title.toLowerCase().includes(q) ||
        bp.overview.toLowerCase().includes(q) ||
        bp.rakatsSummary.toLowerCase().includes(q) ||
        bp.hanafiNotes.some((n) => n.toLowerCase().includes(q))
      );
    });
  }, [prayerSearch, blueprintCategoryFilter]);

  const activeBlueprint = useMemo(
    () =>
      filteredBlueprints.find((b) => b.id === selectedBlueprintId) ||
      filteredBlueprints[0] ||
      SPECIAL_PRAYER_BLUEPRINTS[0],
    [filteredBlueprints, selectedBlueprintId]
  );

  const activeTaharah = useMemo(
    () =>
      TAHARAH_METHODS.find((tm) => tm.id === selectedTaharahId) ||
      TAHARAH_METHODS[0],
    [selectedTaharahId]
  );

  const filteredMatrix = useMemo(() => {
    const q = prayerSearch.trim().toLowerCase();
    return SALAH_ARCHITECTURE_MATRIX.filter((item) => {
      if (matrixGroupFilter !== "All" && item.group !== matrixGroupFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q) ||
        item.consequenceIfMissed.toLowerCase().includes(q)
      );
    });
  }, [prayerSearch, matrixGroupFilter]);

  const filteredMasail = useMemo(() => {
    const q = fiqhQuery.trim().toLowerCase();
    return BAHAR_E_SHARIAT_MASAIL.filter((m) => {
      if (onlyBookmarkedFiqh && !bookmarks.includes(m.id)) return false;
      if (fiqhCategory !== "All" && m.category !== fiqhCategory) return false;
      if (fiqhRuling !== "All" && m.ruling !== fiqhRuling) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.source.toLowerCase().includes(q) ||
        m.dalilNote.toLowerCase().includes(q) ||
        m.tags.some((tg) => tg.toLowerCase().includes(q)) ||
        m.steps.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [fiqhQuery, onlyBookmarkedFiqh, bookmarks, fiqhCategory, fiqhRuling]);

  const filteredQuickScenarios = useMemo(() => {
    const q = checkerQuery.trim().toLowerCase();
    return FIQH_QUICK_SCENARIOS.filter((s) => {
      if (checkerGroup !== "All" && s.checkerGroup !== checkerGroup) return false;
      if (!q) return true;
      return (
        s.question.toLowerCase().includes(q) ||
        s.explanation.toLowerCase().includes(q) ||
        s.verdictBadge.toLowerCase().includes(q)
      );
    });
  }, [checkerGroup, checkerQuery]);

  const filteredSunnahPlaybooks = useMemo(() => {
    const q = sunnahQuery.trim().toLowerCase();
    return SUNNAH_PLAYBOOKS.filter((pb) => {
      const done = Boolean(sunnahChecks[pb.id]);
      if (sunnahStatusFilter === "Completed" && !done) return false;
      if (sunnahStatusFilter === "Remaining" && done) return false;
      if (sunnahCat !== "All" && pb.category !== sunnahCat) return false;
      if (!q) return true;
      return (
        pb.title.toLowerCase().includes(q) ||
        pb.occasion.toLowerCase().includes(q) ||
        pb.meaning.toLowerCase().includes(q) ||
        pb.urduMeaning.includes(sunnahQuery.trim()) ||
        pb.transliteration.toLowerCase().includes(q) ||
        pb.steps.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [sunnahQuery, sunnahChecks, sunnahStatusFilter, sunnahCat]);

  const checkerGroupLabel = (grp: CheckerGroupKey): string => {
    if (grp === "All") return ui.all;
    if (grp === "Wudu Validity") return ui.wuduValidity;
    if (grp === "Sajda-e-Sahw") return ui.sajdaSahw;
    if (grp === "Fasting (Roza)") return ui.fasting;
    return ui.travelerQasr;
  };

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Illuminated Manuscript-Inspired Editorial Hero */}
      <section className="twilight-hero-card p-4 sm:p-8 relative overflow-hidden">
        {/* Subtle Ornamental Pointed Arch & Manuscript Filigree SVG */}
        <svg
          aria-hidden="true"
          viewBox="0 0 800 220"
          preserveAspectRatio="xMaxYMid slice"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
        >
          <g fill="none" stroke="#FDE68A" strokeWidth="1">
            <path d="M620 220 L620 110 Q620 34 700 16 Q780 34 780 110 L780 220" />
            <path
              d="M636 220 L636 114 Q636 50 700 32 Q764 50 764 114 L764 220"
              strokeOpacity="0.65"
            />
            <circle cx="700" cy="96" r="28" strokeOpacity="0.55" />
            <circle cx="700" cy="96" r="14" strokeOpacity="0.45" />
            <path
              d="M700 60 L708 88 L736 96 L708 104 L700 132 L692 104 L664 96 L692 88 Z"
              strokeOpacity="0.5"
            />
          </g>
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-end justify-between gap-3 sm:gap-5">
          <div className="space-y-1 sm:space-y-2 max-w-2xl">
            <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
              {t(lang, "navFiqh")}
            </h1>
            <p className="text-xs sm:text-sm text-white/80 leading-relaxed line-clamp-2 sm:line-clamp-none">
              {t(lang, "fiqhSubtitle")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
            <span className="px-3 py-1.5 rounded-full bg-white/12 border border-white/20 text-white font-medium inline-flex items-center gap-1.5 tabular-nums">
              <Bookmark className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {bookmarks.length} {ui.bookmarks}
              </span>
            </span>
            <Link
              href="/prayer"
              className="px-3.5 py-1.5 rounded-full bg-white/12 hover:bg-white/20 border border-white/20 text-white font-medium inline-flex items-center gap-1.5 transition"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-300" />
              <span>{t(lang, "navPrayer")}</span>
            </Link>
          </div>
        </div>
      </section>

      {/* Primary Module Pill Tabs */}
      <div className="overflow-x-auto no-scrollbar pb-0.5">
        <nav className="pill-tab-bar min-w-max">
          {(
            [
              { id: "hadith", label: t(lang, "fiqhTabHadith"), icon: BookOpen },
              { id: "prayer-method", label: t(lang, "fiqhTabNamaz"), icon: Layers },
              { id: "fiqh", label: t(lang, "fiqhTabFiqh"), icon: Scale },
              { id: "sunnah", label: t(lang, "fiqhTabSunnah"), icon: Sparkles },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                data-active={activeTab === tab.id}
                onClick={() => setActiveTab(tab.id)}
                className="pill-tab-btn inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Icon className="w-3.5 h-3.5 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* =====================================================================
          TAB 1: HADITH BOOKS LIBRARY
         ===================================================================== */}
      {activeTab === "hadith" && (
        <div className="space-y-3.5 sm:space-y-5">
          {/* Top Bar: Collection Category Filter + Script Toggles */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 max-w-full">
              <span className="font-medium mr-1 shrink-0" style={{ color: "var(--text-muted)" }}>
                {ui.selectCollection}:
              </span>
              {(
                [
                  "All",
                  "Sihah Sittah (Six Canonical Books)",
                  "Muwatta & Hanafi Musnad",
                  "Arba'in & Hadith Qudsi",
                ] as const
              ).map((grp) => {
                const active = bookGroupFilter === grp;
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setBookGroupFilter(grp)}
                    className="px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full border font-medium whitespace-nowrap shrink-0 cursor-pointer transition"
                    style={
                      active
                        ? {
                            backgroundColor: "var(--accent-soft)",
                            borderColor: "var(--accent-primary)",
                            color: "var(--accent-primary)",
                          }
                        : {
                            backgroundColor: "var(--bg-surface)",
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {ui.bookGroups[grp]}
                  </button>
                );
              })}
            </div>

            {/* Language Display Toggles */}
            <div className="flex items-center gap-1.5">
              {[
                {
                  key: "ar",
                  label: ui.arabic,
                  active: showArabic,
                  toggle: () => setShowArabic((v) => !v),
                },
                {
                  key: "ur",
                  label: ui.urdu,
                  active: showUrdu,
                  toggle: () => setShowUrdu((v) => !v),
                },
                {
                  key: "en",
                  label: ui.english,
                  active: showEnglish,
                  toggle: () => setShowEnglish((v) => !v),
                },
              ].map((l) => (
                <button
                  key={l.key}
                  type="button"
                  onClick={l.toggle}
                  className="px-2.5 py-1 rounded-full border text-xs font-medium inline-flex items-center gap-1 cursor-pointer transition"
                  style={
                    l.active
                      ? {
                          backgroundColor: "var(--gold-soft)",
                          borderColor: "var(--accent-gold)",
                          color: "var(--accent-gold)",
                        }
                      : {
                          backgroundColor: "var(--bg-surface)",
                          borderColor: "var(--border-hairline)",
                          color: "var(--text-muted)",
                        }
                  }
                >
                  {l.active && <Check className="w-3 h-3" />}
                  <span>{l.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Hadith Collections Grid — 2-col compact on mobile, 4-col on desktop */}
          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-2.5">
            {visibleBooks.map((b) => {
              const active = b.id === selectedBook.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelectedBookId(b.id);
                    setSelectedSectionNum(1);
                    setFullSearchActive(false);
                    setFullSearchResults(null);
                    setHadithPage(1);
                  }}
                  className="p-2.5 sm:p-3.5 rounded-2xl border text-start transition cursor-pointer flex flex-col justify-between"
                  style={{
                    borderColor: active ? "var(--accent-primary)" : "var(--border-hairline)",
                    backgroundColor: active ? "var(--accent-soft)" : "var(--bg-surface)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-[11px] font-medium tabular-nums"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {b.totalHadiths.toLocaleString()}
                      </span>
                      <span
                        className="font-arabic text-sm"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        {b.arabicTitle}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold mt-1 truncate">{b.title}</h3>
                    <p
                      className="text-[11px] truncate mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {b.compiler}
                    </p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Collection Header & Search Bar */}
          <div className="bento-card p-4 sm:p-5 space-y-4">
            <div>
              <div className="flex flex-wrap items-baseline gap-2">
                <h2 className="text-lg sm:text-xl font-bold">{selectedBook.title}</h2>
                <span
                  className="font-arabic text-lg"
                  style={{ color: "var(--accent-gold)" }}
                >
                  {selectedBook.arabicTitle}
                </span>
              </div>
              <p className="text-xs mt-1 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                {selectedBook.sunniIntro}
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
              <div
                className="lg:col-span-5 flex items-center gap-2 px-3.5 py-2 rounded-xl border"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={hadithQuery}
                  onChange={(e) => {
                    setHadithQuery(e.target.value);
                    if (!e.target.value.trim()) {
                      setFullSearchActive(false);
                      setFullSearchResults(null);
                    }
                    setHadithPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !selectedBook.isBuiltInAnthology) {
                      runFullBookSearch();
                    }
                  }}
                  placeholder={t(lang, "fiqhSearchPlaceholder")}
                  className="w-full bg-transparent outline-none text-xs sm:text-sm"
                />
              </div>

              {!selectedBook.isBuiltInAnthology && (
                <>
                  <button
                    type="button"
                    disabled={!hadithQuery.trim() || fullSearchLoading}
                    onClick={runFullBookSearch}
                    className="lg:col-span-3 btn-primary px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer disabled:opacity-45 inline-flex items-center justify-center gap-1.5"
                  >
                    {fullSearchLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>{ui.searchFullBook}</span>
                  </button>

                  <div
                    className="lg:col-span-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <Hash className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
                    <input
                      type="number"
                      min={1}
                      max={selectedBook.totalHadiths}
                      value={jumpNumberInput}
                      onChange={(e) => setJumpNumberInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") runJumpToHadithNumber();
                      }}
                      placeholder={ui.jumpToHadith}
                      className="w-full bg-transparent outline-none text-xs tabular-nums"
                    />
                    <button
                      type="button"
                      onClick={runJumpToHadithNumber}
                      className="px-2 py-1 rounded-lg text-[11px] font-semibold cursor-pointer"
                      style={{
                        backgroundColor: "var(--accent-soft)",
                        color: "var(--accent-primary)",
                      }}
                    >
                      {ui.go}
                    </button>
                  </div>
                </>
              )}

              {/* Grade Chips & Bookmark Toggle */}
              <div
                className={`${
                  selectedBook.isBuiltInAnthology ? "lg:col-span-7" : "lg:col-span-2"
                } flex items-center justify-end gap-1.5 flex-wrap`}
              >
                {(
                  [
                    { id: "All", label: ui.all },
                    { id: "Sahih", label: ui.sahih },
                    { id: "Hasan", label: ui.hasan },
                  ] as const
                ).map((g) => {
                  const active = hadithGradeFilter === g.id;
                  return (
                    <button
                      key={g.id}
                      type="button"
                      onClick={() => {
                        setHadithGradeFilter(g.id);
                        setHadithPage(1);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition"
                      style={
                        active
                          ? {
                              backgroundColor: "var(--accent-soft)",
                              borderColor: "var(--accent-primary)",
                              color: "var(--accent-primary)",
                            }
                          : {
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-secondary)",
                            }
                      }
                    >
                      {g.label}
                    </button>
                  );
                })}

                <button
                  type="button"
                  onClick={() => setOnlyBookmarkedHadith((b) => !b)}
                  aria-label={ui.bookmarks}
                  className="p-2 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: onlyBookmarkedHadith
                      ? "var(--accent-gold)"
                      : "var(--border-hairline)",
                    backgroundColor: onlyBookmarkedHadith
                      ? "var(--gold-soft)"
                      : "var(--bg-elevated)",
                    color: onlyBookmarkedHadith ? "var(--accent-gold)" : "var(--text-muted)",
                  }}
                >
                  <Bookmark
                    className={`w-4 h-4 ${onlyBookmarkedHadith ? "fill-current" : ""}`}
                  />
                </button>
              </div>
            </div>

            {selectedBook.isBuiltInAnthology && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "All",
                  "Iman & Aqaid",
                  "Ilm & Sunnah",
                  "Taharah & Salah",
                  "Zakat & Charity",
                  "Sawm & Ramadan",
                  "Dhikr, Dua & Durood",
                  "Auliya, Sahabah & Ahl al-Bayt",
                  "Akhlaq, Adab & Mu'amalat",
                ].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setAnthologyTopicFilter(topic)}
                    className="px-2.5 py-1 rounded-full border text-xs font-medium cursor-pointer"
                    style={{
                      borderColor:
                        anthologyTopicFilter === topic
                          ? "var(--accent-primary)"
                          : "var(--border-hairline)",
                      backgroundColor:
                        anthologyTopicFilter === topic
                          ? "var(--accent-soft)"
                          : "transparent",
                      color:
                        anthologyTopicFilter === topic
                          ? "var(--accent-primary)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {topic === "All" ? ui.all : topic}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hadith Reader Workspace */}
          {selectedBook.isBuiltInAnthology ? (
            <div className="space-y-4">
              {filteredAnthology.map((h) => {
                const isSaved = bookmarks.includes(h.id);
                return (
                  <article key={h.id} className="bento-card p-5 sm:p-6 space-y-4">
                    {/* Clean Editorial Card Header: Reference + Grade + Subtle Icon Actions */}
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-bold" style={{ color: "var(--accent-gold)" }}>
                          {h.collection} ({h.refNumber})
                        </span>
                        <span className="badge-pill badge-emerald">{h.grade}</span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => speakArabicOrEnglish(h.arabic, "ar-SA")}
                          className="p-1.5 rounded-lg border cursor-pointer opacity-80 hover:opacity-100"
                          style={{ borderColor: "var(--border-hairline)" }}
                          aria-label={ui.listen}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            copyCitation(
                              h.id,
                              `${h.collection} (${h.refNumber}) — ${h.narrator}:\n${h.arabic}\n"${h.english}"\n${h.urdu}`
                            )
                          }
                          className="p-1.5 rounded-lg border cursor-pointer opacity-80 hover:opacity-100"
                          style={{ borderColor: "var(--border-hairline)" }}
                          aria-label={tp(lang, "Copy")}
                        >
                          {copiedId === h.id ? (
                            <Check className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(h.id)}
                          className="p-1.5 rounded-lg border cursor-pointer opacity-80 hover:opacity-100"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: isSaved ? "var(--accent-gold)" : undefined,
                          }}
                          aria-label={ui.bookmarks}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {ui.narratedBy}:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>{h.narrator}</strong>
                    </div>

                    {showArabic && (
                      <p
                        dir="rtl"
                        className="font-arabic text-xl sm:text-2xl text-right leading-[2.2] p-4 rounded-2xl"
                        style={{ backgroundColor: "var(--bg-elevated)" }}
                      >
                        {h.arabic}
                      </p>
                    )}

                    {preferUrdu ? (
                      <>
                        {showUrdu && (
                          <p
                            dir="rtl"
                            className="font-urdu text-right text-base sm:text-lg leading-loose"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {h.urdu}
                          </p>
                        )}
                        {showEnglish && (
                          <p
                            className="text-sm leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {h.english}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        {showEnglish && (
                          <p className="text-sm leading-relaxed">{h.english}</p>
                        )}
                        {showUrdu && (
                          <p
                            dir="rtl"
                            className="font-urdu text-right text-base leading-loose"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {h.urdu}
                          </p>
                        )}
                      </>
                    )}

                    <div
                      className="pt-3 border-t text-xs leading-relaxed"
                      style={{
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <strong style={{ color: "var(--accent-gold)" }}>
                        {ui.commentary}:
                      </strong>{" "}
                      {h.sunniNote}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Chapters Sidebar */}
              <aside className="lg:col-span-4 bento-card p-4 space-y-3">
                <div className="flex items-center justify-between text-xs">
                  <h3 className="font-bold">
                    {ui.chapters} ({bookSections.length})
                  </h3>
                  {fullSearchActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setFullSearchActive(false);
                        setFullSearchResults(null);
                      }}
                      className="font-semibold underline cursor-pointer"
                      style={{ color: "var(--accent-gold)" }}
                    >
                      {ui.backToChapters}
                    </button>
                  )}
                </div>

                {selectedBook.totalSections > 3 && (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <Filter className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                    <input
                      type="text"
                      value={sectionSearchQuery}
                      onChange={(e) => setSectionSearchQuery(e.target.value)}
                      placeholder={ui.filterChapters}
                      className="w-full bg-transparent outline-none text-xs"
                    />
                  </div>
                )}

                <div
                  className="max-h-[540px] overflow-y-auto divide-y pr-1"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  {bookSections.map((sec) => {
                    const active =
                      !fullSearchActive && activeSectionMeta?.num === sec.num;
                    return (
                      <button
                        key={sec.num}
                        type="button"
                        onClick={() => {
                          setFullSearchActive(false);
                          setFullSearchResults(null);
                          setSelectedSectionNum(sec.num);
                          setHadithPage(1);
                        }}
                        className="w-full text-start py-2.5 px-2.5 rounded-lg text-xs transition cursor-pointer flex items-center justify-between gap-2"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: active ? "var(--accent-soft)" : "transparent",
                          color: active ? "var(--accent-primary)" : "var(--text-primary)",
                        }}
                      >
                        <div className="min-w-0 truncate">
                          <span className="font-bold tabular-nums mr-1.5">{sec.num}.</span>
                          <span className="font-medium">{sec.title}</span>
                        </div>
                        {sec.first > 0 && (
                          <span
                            className="text-[10px] tabular-nums shrink-0"
                            style={{ color: "var(--text-muted)" }}
                          >
                            #{sec.first}–{sec.last}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* Hadith Stream */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bento-card p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="font-semibold">
                    {fullSearchActive ? (
                      <span style={{ color: "var(--accent-gold)" }}>
                        {selectedBook.title} — {fullSearchResults?.total ?? 0}
                      </span>
                    ) : (
                      <span>
                        {activeSectionMeta?.num}. {activeSectionMeta?.title || selectedBook.title}{" "}
                        <span style={{ color: "var(--text-muted)" }}>
                          ({displayedRemoteHadiths.length})
                        </span>
                      </span>
                    )}
                  </div>

                  {totalHadithPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={hadithPage <= 1}
                        onClick={() => setHadithPage((p) => Math.max(1, p - 1))}
                        className="px-2.5 py-1 rounded-lg border disabled:opacity-35 cursor-pointer inline-flex items-center gap-1"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        <ChevronLeft className="w-3.5 h-3.5 rtl-mirror" />
                        <span>{ui.previous}</span>
                      </button>
                      <span className="tabular-nums font-medium" style={{ color: "var(--text-muted)" }}>
                        {ui.page} {hadithPage}/{totalHadithPages}
                      </span>
                      <button
                        type="button"
                        disabled={hadithPage >= totalHadithPages}
                        onClick={() =>
                          setHadithPage((p) => Math.min(totalHadithPages, p + 1))
                        }
                        className="px-2.5 py-1 rounded-lg border disabled:opacity-35 cursor-pointer inline-flex items-center gap-1"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        <span>{ui.next}</span>
                        <ChevronRight className="w-3.5 h-3.5 rtl-mirror" />
                      </button>
                    </div>
                  )}
                </div>

                {sectionError && (
                  <div
                    className="p-4 rounded-2xl border text-xs flex items-center gap-2.5"
                    style={{
                      borderColor: "var(--accent-gold)",
                      backgroundColor: "var(--gold-soft)",
                    }}
                  >
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{sectionError}</span>
                  </div>
                )}

                {sectionLoading || fullSearchLoading ? (
                  <div className="bento-card p-10 flex flex-col items-center justify-center gap-3 text-xs">
                    <Loader2
                      className="w-6 h-6 animate-spin"
                      style={{ color: "var(--accent-primary)" }}
                    />
                    <span style={{ color: "var(--text-muted)" }}>{ui.loadingHadiths}</span>
                  </div>
                ) : paginatedRemoteHadiths.length === 0 ? (
                  <div
                    className="bento-card p-8 text-center text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {ui.noHadithsFound}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {paginatedRemoteHadiths.map((h) => {
                      const isSaved = bookmarks.includes(h.uid);
                      return (
                        <article key={h.uid} className="bento-card p-5 sm:p-6 space-y-4">
                          {/* Clean Header: Book/Ref + Single Grade Badge + Subtle Icon Actions */}
                          <div className="flex items-center justify-between gap-2 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="font-bold tabular-nums"
                                style={{ color: "var(--accent-gold)" }}
                              >
                                {h.bookTitle} #{h.hadithNumber}
                              </span>
                              <span className="badge-pill badge-emerald">
                                {h.primaryGrade}
                              </span>
                            </div>

                            <div className="flex items-center gap-1">
                              {h.arabic && (
                                <button
                                  type="button"
                                  onClick={() => speakArabicOrEnglish(h.arabic, "ar-SA")}
                                  className="p-1.5 rounded-lg border cursor-pointer opacity-80 hover:opacity-100"
                                  style={{ borderColor: "var(--border-hairline)" }}
                                  aria-label={ui.listen}
                                >
                                  <Volume2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  copyCitation(
                                    h.uid,
                                    `${h.bookTitle} #${h.hadithNumber}\n${h.arabic}\n${h.english}\n${h.urdu}`
                                  )
                                }
                                className="p-1.5 rounded-lg border cursor-pointer opacity-80 hover:opacity-100"
                                style={{ borderColor: "var(--border-hairline)" }}
                                aria-label={tp(lang, "Copy")}
                              >
                                {copiedId === h.uid ? (
                                  <Check
                                    className="w-3.5 h-3.5"
                                    style={{ color: "var(--accent-primary)" }}
                                  />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleBookmark(h.uid)}
                                className="p-1.5 rounded-lg border cursor-pointer opacity-80 hover:opacity-100"
                                style={{
                                  borderColor: "var(--border-hairline)",
                                  color: isSaved ? "var(--accent-gold)" : undefined,
                                }}
                                aria-label={ui.bookmarks}
                              >
                                <Bookmark
                                  className={`w-3.5 h-3.5 ${isSaved ? "fill-current" : ""}`}
                                />
                              </button>
                            </div>
                          </div>

                          {h.narratorHint && (
                            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
                              {ui.narratedBy}:{" "}
                              <strong style={{ color: "var(--text-primary)" }}>
                                {h.narratorHint}
                              </strong>
                            </div>
                          )}

                          {showArabic && h.arabic && (
                            <p
                              dir="rtl"
                              className="font-arabic text-xl sm:text-2xl text-right leading-[2.2] p-4 rounded-2xl"
                              style={{ backgroundColor: "var(--bg-elevated)" }}
                            >
                              {h.arabic}
                            </p>
                          )}

                          {preferUrdu ? (
                            <>
                              {showUrdu && h.urdu && (
                                <p
                                  dir="rtl"
                                  className="font-urdu text-right text-base sm:text-lg leading-loose"
                                  style={{ color: "var(--text-primary)" }}
                                >
                                  {h.urdu}
                                </p>
                              )}
                              {showEnglish && h.english && (
                                <p
                                  className="text-sm leading-relaxed"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {h.english}
                                </p>
                              )}
                            </>
                          ) : (
                            <>
                              {showEnglish && h.english && (
                                <p className="text-sm leading-relaxed">{h.english}</p>
                              )}
                              {showUrdu && h.urdu && (
                                <p
                                  dir="rtl"
                                  className="font-urdu text-right text-base leading-loose"
                                  style={{ color: "var(--text-secondary)" }}
                                >
                                  {h.urdu}
                                </p>
                              )}
                            </>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: HANAFI PRAYER METHOD (TARIQA-E-NAMAZ)
         ===================================================================== */}
      {activeTab === "prayer-method" && (
        <div className="space-y-5">
          {/* Sub-Navigation & Search */}
          <div className="bento-card p-4 sm:p-5 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div className="overflow-x-auto max-w-full">
                <div className="pill-tab-bar min-w-max">
                  {(
                    [
                      { id: "walkthrough", label: ui.salahGuide16 },
                      { id: "blueprints", label: ui.prayerBlueprints12 },
                      { id: "taharah", label: ui.taharahGuide },
                      { id: "matrix", label: ui.rulingsMatrix },
                    ] as const
                  ).map((st) => (
                    <button
                      key={st.id}
                      type="button"
                      data-active={prayerSubTab === st.id}
                      onClick={() => setPrayerSubTab(st.id)}
                      className="pill-tab-btn whitespace-nowrap"
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border w-full sm:w-72"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={prayerSearch}
                  onChange={(e) => setPrayerSearch(e.target.value)}
                  placeholder={ui.searchPrayerPlaceholder}
                  className="w-full bg-transparent outline-none text-xs"
                />
              </div>
            </div>

            {prayerSubTab === "walkthrough" && (
              <div
                className="flex flex-wrap items-center justify-between gap-2.5 pt-3 border-t text-xs"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="flex flex-wrap items-center gap-1.5">
                  <Users className="w-3.5 h-3.5 mr-0.5" style={{ color: "var(--accent-primary)" }} />
                  {(
                    [
                      { id: "both", label: ui.compareBoth },
                      { id: "brothers", label: ui.brothers },
                      { id: "sisters", label: ui.sisters },
                    ] as const
                  ).map((m) => {
                    const active = postureGenderMode === m.id;
                    return (
                      <button
                        key={m.id}
                        type="button"
                        onClick={() => setPostureGenderMode(m.id)}
                        className="px-3 py-1 rounded-full border font-medium cursor-pointer transition"
                        style={
                          active
                            ? {
                                backgroundColor: "var(--accent-soft)",
                                borderColor: "var(--accent-primary)",
                                color: "var(--accent-primary)",
                              }
                            : {
                                borderColor: "var(--border-hairline)",
                                color: "var(--text-secondary)",
                              }
                        }
                      >
                        {m.label}
                      </button>
                    );
                  })}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={posturePhaseFilter}
                    onChange={(e) => setPosturePhaseFilter(e.target.value)}
                    className="ui-select px-2.5 py-1.5 rounded-xl border text-xs font-medium"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="All">{ui.all}</option>
                    <option value="Opening & Qiyam">Opening &amp; Qiyam</option>
                    <option value="Ruku & Qaumah">Ruku &amp; Qaumah</option>
                    <option value="Sujood & Jalsah">Sujood &amp; Jalsah</option>
                    <option value="Qa'dah & Tashahhud">Qa&apos;dah &amp; Tashahhud</option>
                    <option value="Salam & Conclusion">Salam &amp; Conclusion</option>
                  </select>

                  <select
                    value={postureRulingFilter}
                    onChange={(e) => setPostureRulingFilter(e.target.value)}
                    className="ui-select px-2.5 py-1.5 rounded-xl border text-xs font-medium"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="All">{ui.all}</option>
                    <option value="Shart (Condition)">Shart</option>
                    <option value="Fard (Rukn)">Fard</option>
                    <option value="Wajib">Wajib</option>
                    <option value="Sunnah Mu'akkadah">Sunnah Mu&apos;akkadah</option>
                    <option value="Mustahabb">Mustahabb</option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setWalkthroughViewMode((v) => (v === "all" ? "guided" : "all"))
                    }
                    className="px-3 py-1.5 rounded-full border font-semibold cursor-pointer transition"
                    style={{
                      borderColor: "var(--accent-gold)",
                      backgroundColor:
                        walkthroughViewMode === "guided" ? "var(--gold-soft)" : "transparent",
                      color: "var(--accent-gold)",
                    }}
                  >
                    {walkthroughViewMode === "guided" ? ui.allSteps : ui.guidedMode}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SUB-TAB A: 16-STEP SALAH WALKTHROUGH */}
          {prayerSubTab === "walkthrough" && (
            <div className="space-y-4">
              {walkthroughViewMode === "guided" && filteredPostureSteps.length > 0 && (
                <div className="flex items-center justify-between bento-card p-3.5 text-xs">
                  <button
                    type="button"
                    disabled={guidedStepIdx <= 0}
                    onClick={() => setGuidedStepIdx((i) => Math.max(0, i - 1))}
                    className="px-3 py-1.5 rounded-xl border font-semibold disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <ChevronLeft className="w-4 h-4 rtl-mirror" />
                    <span>{ui.previous}</span>
                  </button>
                  <span className="font-bold tabular-nums" style={{ color: "var(--accent-gold)" }}>
                    {ui.step} {Math.min(guidedStepIdx + 1, filteredPostureSteps.length)} {ui.of}{" "}
                    {filteredPostureSteps.length}
                  </span>
                  <button
                    type="button"
                    disabled={guidedStepIdx >= filteredPostureSteps.length - 1}
                    onClick={() =>
                      setGuidedStepIdx((i) =>
                        Math.min(filteredPostureSteps.length - 1, i + 1)
                      )
                    }
                    className="btn-primary px-3.5 py-1.5 rounded-xl font-semibold disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
                  >
                    <span>{ui.next}</span>
                    <ChevronRight className="w-4 h-4 rtl-mirror" />
                  </button>
                </div>
              )}

              {(walkthroughViewMode === "guided"
                ? filteredPostureSteps.slice(guidedStepIdx, guidedStepIdx + 1)
                : filteredPostureSteps
              ).map((step) => (
                <article key={step.id} className="bento-card p-5 sm:p-6 space-y-4">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span
                        className="w-9 h-9 rounded-full text-white font-bold text-sm flex items-center justify-center shrink-0 tabular-nums"
                        style={{ backgroundImage: "var(--gradient-brand)" }}
                      >
                        {step.stepNumber}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-baseline gap-2">
                          <h3 className="text-base sm:text-lg font-bold">{step.title}</h3>
                          <span
                            className="font-arabic text-base"
                            style={{ color: "var(--accent-gold)" }}
                          >
                            {step.arabicTitle}
                          </span>
                        </div>
                        <div
                          className="flex flex-wrap items-center gap-2 text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          <span className="badge-pill badge-gold">{step.ruling}</span>
                          <span className="inline-flex items-center gap-1">
                            <Eye className="w-3 h-3" />
                            <span>
                              {ui.gaze}: {step.gazeTarget}
                            </span>
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Brothers / Sisters Posture Comparison */}
                  <div
                    className={`grid grid-cols-1 ${
                      postureGenderMode === "both" ? "md:grid-cols-2" : ""
                    } gap-3`}
                  >
                    {(postureGenderMode === "both" || postureGenderMode === "brothers") && (
                      <div
                        className="p-4 rounded-2xl border space-y-1.5"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-elevated)",
                        }}
                      >
                        <div
                          className="text-xs font-bold"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          {ui.brothers}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {step.brothersPosture}
                        </p>
                      </div>
                    )}

                    {(postureGenderMode === "both" || postureGenderMode === "sisters") && (
                      <div
                        className="p-4 rounded-2xl border space-y-1.5"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-elevated)",
                        }}
                      >
                        <div
                          className="text-xs font-bold"
                          style={{ color: "var(--accent-gold)" }}
                        >
                          {ui.sisters}
                        </div>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {step.sistersPosture}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Liturgical Recitation (Urdu prioritized before English when lang === ur | fa) */}
                  {step.recitation && (
                    <div
                      className="p-4 rounded-2xl border space-y-2.5"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2 text-xs">
                        <span className="font-semibold" style={{ color: "var(--accent-gold)" }}>
                          {ui.recitation}: {step.recitation.label}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            speakArabicOrEnglish(step.recitation!.arabic, "ar-SA")
                          }
                          className="px-2.5 py-1 rounded-full border text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                          style={{ borderColor: "var(--border-hairline)" }}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                          <span>{ui.listen}</span>
                        </button>
                      </div>
                      <p
                        dir="rtl"
                        className="font-arabic text-xl sm:text-2xl text-right leading-[2.15]"
                      >
                        {step.recitation.arabic}
                      </p>
                      <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
                        {step.recitation.transliteration}
                      </p>
                      {preferUrdu ? (
                        <>
                          <p
                            dir="rtl"
                            className="font-urdu text-right text-base leading-loose"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {step.recitation.urdu}
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {step.recitation.english}
                          </p>
                        </>
                      ) : (
                        <>
                          <p className="text-xs leading-relaxed">
                            {step.recitation.english}
                          </p>
                          <p
                            dir="rtl"
                            className="font-urdu text-right text-sm leading-loose"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {step.recitation.urdu}
                          </p>
                        </>
                      )}
                    </div>
                  )}

                  <div
                    className="pt-3 border-t text-xs leading-relaxed"
                    style={{
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-muted)",
                    }}
                  >
                    <strong style={{ color: "var(--accent-gold)" }}>
                      {ui.fiqhNote}:
                    </strong>{" "}
                    {step.fiqhTip}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* SUB-TAB B: 12 PRAYER BLUEPRINTS */}
          {prayerSubTab === "blueprints" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  "All",
                  "Daily Fard",
                  "Sunnah & Wajib",
                  "Congregational & Eid",
                  "Janazah & Special Nafl",
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBlueprintCategoryFilter(cat)}
                    className="px-3 py-1.5 rounded-full border font-medium cursor-pointer"
                    style={{
                      borderColor:
                        blueprintCategoryFilter === cat
                          ? "var(--accent-primary)"
                          : "var(--border-hairline)",
                      backgroundColor:
                        blueprintCategoryFilter === cat
                          ? "var(--accent-soft)"
                          : "var(--bg-surface)",
                      color:
                        blueprintCategoryFilter === cat
                          ? "var(--accent-primary)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {cat === "All" ? ui.all : cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                <div className="lg:col-span-4 space-y-2">
                  {filteredBlueprints.map((bp) => {
                    const active = bp.id === activeBlueprint?.id;
                    return (
                      <button
                        key={bp.id}
                        type="button"
                        onClick={() => setSelectedBlueprintId(bp.id)}
                        className="w-full text-start p-3.5 rounded-2xl border transition cursor-pointer"
                        style={{
                          borderColor: active
                            ? "var(--accent-primary)"
                            : "var(--border-hairline)",
                          backgroundColor: active
                            ? "var(--accent-soft)"
                            : "var(--bg-surface)",
                        }}
                      >
                        <div className="flex items-center justify-between text-[11px] font-medium">
                          <span style={{ color: "var(--text-muted)" }}>{bp.category}</span>
                          <span style={{ color: "var(--accent-gold)" }}>{bp.ruling}</span>
                        </div>
                        <div className="text-sm font-bold mt-1">{bp.title}</div>
                        <div
                          className="text-xs mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {bp.rakatsSummary}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {activeBlueprint && (
                  <div className="lg:col-span-8 bento-card p-5 sm:p-6 space-y-5">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="badge-pill badge-gold">
                          {activeBlueprint.ruling} • {activeBlueprint.timeWindow}
                        </span>
                        <h3 className="text-xl font-bold mt-2">
                          {activeBlueprint.title}{" "}
                          <span
                            className="font-arabic font-normal"
                            style={{ color: "var(--accent-gold)" }}
                          >
                            {activeBlueprint.arabicTitle}
                          </span>
                        </h3>
                        <p
                          className="text-xs mt-1 leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {activeBlueprint.overview}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(activeBlueprint.id)}
                        className="p-2 rounded-xl border cursor-pointer"
                        style={{
                          borderColor: "var(--border-hairline)",
                          color: bookmarks.includes(activeBlueprint.id)
                            ? "var(--accent-gold)"
                            : undefined,
                        }}
                        aria-label={ui.bookmarks}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            bookmarks.includes(activeBlueprint.id) ? "fill-current" : ""
                          }`}
                        />
                      </button>
                    </div>

                    <div
                      className="divide-y"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {activeBlueprint.rakatByRakat.map((rk, i) => (
                        <div
                          key={i}
                          className="py-3 first:pt-0 last:pb-0"
                          style={{ borderColor: "var(--border-hairline)" }}
                        >
                          <div
                            className="text-xs font-bold"
                            style={{ color: "var(--accent-primary)" }}
                          >
                            {rk.heading}
                          </div>
                          <p
                            className="text-xs leading-relaxed mt-1"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {rk.instructions}
                          </p>
                        </div>
                      ))}
                    </div>

                    {activeBlueprint.keyRecitation && (
                      <div
                        className="p-4 rounded-2xl border space-y-2.5"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-semibold" style={{ color: "var(--accent-gold)" }}>
                            {activeBlueprint.keyRecitation.title}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              speakArabicOrEnglish(
                                activeBlueprint.keyRecitation!.arabic,
                                "ar-SA"
                              )
                            }
                            className="px-2.5 py-1 rounded-full border text-[11px] font-medium inline-flex items-center gap-1 cursor-pointer"
                            style={{ borderColor: "var(--border-hairline)" }}
                          >
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>{ui.listen}</span>
                          </button>
                        </div>
                        <p
                          dir="rtl"
                          className="font-arabic text-xl sm:text-2xl text-right leading-[2.15]"
                        >
                          {activeBlueprint.keyRecitation.arabic}
                        </p>
                        <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
                          {activeBlueprint.keyRecitation.transliteration}
                        </p>
                        {preferUrdu ? (
                          <>
                            <p
                              dir="rtl"
                              className="font-urdu text-right text-base leading-loose"
                            >
                              {activeBlueprint.keyRecitation.urdu}
                            </p>
                            <p
                              className="text-xs leading-relaxed"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {activeBlueprint.keyRecitation.english}
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="text-xs leading-relaxed">
                              {activeBlueprint.keyRecitation.english}
                            </p>
                            <p
                              dir="rtl"
                              className="font-urdu text-right text-sm leading-loose"
                              style={{ color: "var(--text-secondary)" }}
                            >
                              {activeBlueprint.keyRecitation.urdu}
                            </p>
                          </>
                        )}
                      </div>
                    )}

                    <div className="space-y-2">
                      <div className="text-xs font-bold" style={{ color: "var(--accent-gold)" }}>
                        {ui.keyHanafiRulings} ({activeBlueprint.source})
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        {activeBlueprint.hanafiNotes.map((n, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              style={{ color: "var(--accent-primary)" }}
                            />
                            <span style={{ color: "var(--text-secondary)" }}>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB C: WUDU, GHUSL & TAYAMMUM */}
          {prayerSubTab === "taharah" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {TAHARAH_METHODS.map((tm) => {
                  const active = selectedTaharahId === tm.id;
                  return (
                    <button
                      key={tm.id}
                      type="button"
                      onClick={() => setSelectedTaharahId(tm.id)}
                      className="px-4 py-2 rounded-full border text-xs font-semibold cursor-pointer transition"
                      style={
                        active
                          ? {
                              backgroundImage: "var(--gradient-brand)",
                              color: "#ffffff",
                              borderColor: "transparent",
                            }
                          : {
                              backgroundColor: "var(--bg-surface)",
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-secondary)",
                            }
                      }
                    >
                      {tm.title} ({tm.urduTitle})
                    </button>
                  );
                })}
              </div>

              <div className="bento-card p-5 sm:p-6 space-y-5">
                <div>
                  <span className="text-xs font-medium" style={{ color: "var(--accent-gold)" }}>
                    {activeTaharah.source}
                  </span>
                  <h3 className="text-xl font-bold mt-0.5">
                    {activeTaharah.title}{" "}
                    <span
                      className="font-urdu font-normal"
                      style={{ color: "var(--accent-gold)" }}
                    >
                      ({activeTaharah.urduTitle})
                    </span>
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {activeTaharah.subtitle}
                  </p>
                </div>

                {/* Fara'id */}
                <div
                  className="p-4 rounded-2xl border space-y-2"
                  style={{
                    backgroundColor: "var(--gold-soft)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <div className="text-xs font-bold" style={{ color: "var(--accent-gold)" }}>
                    {ui.faraidPillars}
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {activeTaharah.faraid.map((f, idx) => (
                      <li key={idx} className="font-medium leading-relaxed">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Sunnah Steps */}
                <div className="space-y-3">
                  <h4 className="text-sm font-bold">{ui.sunnahSequence}</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeTaharah.sunanSteps.map((st) => (
                      <div
                        key={st.stepNum}
                        className="p-4 rounded-2xl border space-y-1.5"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-2 text-xs">
                          <span className="font-bold">
                            {st.stepNum}. {st.title}
                          </span>
                          <span className="badge-pill badge-gold shrink-0">{st.ruling}</span>
                        </div>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {st.detail}
                        </p>
                        {st.arabicDua && (
                          <div
                            className="pt-2 border-t space-y-1"
                            style={{ borderColor: "var(--border-hairline)" }}
                          >
                            <p
                              dir="rtl"
                              className="font-arabic text-lg text-right leading-loose"
                              style={{ color: "var(--accent-gold)" }}
                            >
                              {st.arabicDua}
                            </p>
                            {st.transliteration && (
                              <p
                                className="text-[11px] italic"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {st.transliteration}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nullifiers */}
                <div
                  className="p-4 rounded-2xl border space-y-2"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  <div className="text-xs font-bold" style={{ color: "var(--accent-danger)" }}>
                    {ui.nullifiers}
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {activeTaharah.nullifiers.map((nl, i) => (
                      <li
                        key={i}
                        className="leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        • {nl}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB D: RULINGS MATRIX */}
          {prayerSubTab === "matrix" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  "All",
                  "6 Shara'it (Pre-Conditions)",
                  "6 Fara'id (Inner Pillars)",
                  "14 Wajibat of Salah",
                  "Key Sunan of Salah",
                  "Mufsidat (Nullifiers of Salah)",
                ].map((grp) => (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setMatrixGroupFilter(grp)}
                    className="px-3 py-1.5 rounded-full border font-medium cursor-pointer"
                    style={{
                      borderColor:
                        matrixGroupFilter === grp
                          ? "var(--accent-primary)"
                          : "var(--border-hairline)",
                      backgroundColor:
                        matrixGroupFilter === grp
                          ? "var(--accent-soft)"
                          : "var(--bg-surface)",
                      color:
                        matrixGroupFilter === grp
                          ? "var(--accent-primary)"
                          : "var(--text-secondary)",
                    }}
                  >
                    {grp === "All" ? ui.all : grp}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredMatrix.map((item) => (
                  <div
                    key={item.id}
                    className="bento-card p-5 space-y-3 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span
                        className="text-[11px] font-semibold"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        {item.group}
                      </span>
                      <h4 className="text-sm font-bold">{item.title}</h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {item.detail}
                      </p>
                    </div>
                    <div
                      className="pt-2.5 border-t text-xs"
                      style={{
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <strong style={{ color: "var(--accent-gold)" }}>{ui.ifOmitted}:</strong>{" "}
                      {item.consequenceIfMissed}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: HANAFI FIQH & INSTANT RULING CHECKER
         ===================================================================== */}
      {activeTab === "fiqh" && (
        <div className="space-y-6">
          {/* Instant Hanafi Ruling Checker */}
          <section className="bento-card p-5 sm:p-6 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 shrink-0" style={{ color: "var(--accent-gold)" }} />
                <h2 className="text-base sm:text-lg font-bold">{ui.rulingCheckerTitle}</h2>
              </div>

              <div
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl border w-full sm:w-64"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <Search className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={checkerQuery}
                  onChange={(e) => setCheckerQuery(e.target.value)}
                  placeholder={ui.checkerPlaceholder}
                  className="w-full bg-transparent outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {(
                [
                  "All",
                  "Wudu Validity",
                  "Sajda-e-Sahw",
                  "Fasting (Roza)",
                  "Traveler (Qasr)",
                ] as const
              ).map((grp) => {
                const active = checkerGroup === grp;
                return (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setCheckerGroup(grp)}
                    className="px-3.5 py-1.5 rounded-full border font-medium cursor-pointer transition"
                    style={
                      active
                        ? {
                            backgroundImage: "var(--gradient-brand)",
                            color: "#ffffff",
                            borderColor: "transparent",
                          }
                        : {
                            backgroundColor: "var(--bg-elevated)",
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {checkerGroupLabel(grp)}
                  </button>
                );
              })}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {filteredQuickScenarios.map((sc) => {
                const badgeClass =
                  sc.verdictColor === "emerald"
                    ? "badge-emerald"
                    : sc.verdictColor === "amber"
                    ? "badge-gold"
                    : "badge-crimson";
                return (
                  <div
                    key={sc.id}
                    className="p-4 rounded-2xl border space-y-2"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span
                        className="text-[11px] font-medium"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {checkerGroupLabel(sc.checkerGroup)}
                      </span>
                      <span className={`badge-pill ${badgeClass}`}>{sc.verdictBadge}</span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-bold">{sc.question}</h4>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {sc.explanation}
                    </p>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {sc.source}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bahar-e-Shariat Search, Ruling Chips & Category Chips */}
          <div className="bento-card p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div
                className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-xl border"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={fiqhQuery}
                  onChange={(e) => setFiqhQuery(e.target.value)}
                  placeholder={ui.fiqhSearchPlaceholder}
                  className="w-full bg-transparent outline-none text-xs sm:text-sm"
                />
              </div>

              <button
                type="button"
                onClick={() => setOnlyBookmarkedFiqh((v) => !v)}
                className="px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                style={{
                  borderColor: onlyBookmarkedFiqh
                    ? "var(--accent-gold)"
                    : "var(--border-hairline)",
                  backgroundColor: onlyBookmarkedFiqh
                    ? "var(--gold-soft)"
                    : "var(--bg-elevated)",
                  color: onlyBookmarkedFiqh ? "var(--accent-gold)" : "var(--text-secondary)",
                }}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${onlyBookmarkedFiqh ? "fill-current" : ""}`}
                />
                <span>{ui.savedOnly}</span>
              </button>
            </div>

            {/* Ruling Filter Chips */}
            <div className="flex flex-wrap gap-1.5">
              {RULING_STATUSES.map((r) => {
                const active = fiqhRuling === r;
                return (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setFiqhRuling(r)}
                    className="px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition"
                    style={
                      active
                        ? {
                            backgroundColor: "var(--gold-soft)",
                            borderColor: "var(--accent-gold)",
                            color: "var(--accent-gold)",
                          }
                        : {
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {ui.rulingLabels[r]}
                  </button>
                );
              })}
            </div>

            {/* Category Filter Chips */}
            <div
              className="flex flex-wrap gap-1.5 pt-2 border-t"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              {(["All", ...FIQH_CATEGORIES] as const).map((cat) => {
                const active = fiqhCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setFiqhCategory(cat)}
                    className="px-3 py-1 rounded-full text-xs font-medium border cursor-pointer transition"
                    style={
                      active
                        ? {
                            backgroundColor: "var(--accent-soft)",
                            borderColor: "var(--accent-primary)",
                            color: "var(--accent-primary)",
                          }
                        : {
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-muted)",
                          }
                    }
                  >
                    {cat === "All" ? ui.all : ui.fiqhCatLabels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Masa'il Cards (Clean Editorial Layout, Zero Tag-Soup) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMasail.map((m) => {
              const saved = bookmarks.includes(m.id);
              return (
                <article
                  key={m.id}
                  className="bento-card p-5 sm:p-6 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="font-medium"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {ui.fiqhCatLabels[m.category]}
                        </span>
                        <span className="badge-pill badge-gold">
                          {ui.rulingLabels[m.ruling]}
                        </span>
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            copyCitation(
                              m.id,
                              `${m.title} [${m.ruling} — ${m.source}]\n${m.summary}\n${m.steps.join("\n")}`
                            )
                          }
                          className="p-1.5 rounded-lg border cursor-pointer opacity-80 hover:opacity-100"
                          style={{ borderColor: "var(--border-hairline)" }}
                          aria-label={tp(lang, "Copy")}
                        >
                          {copiedId === m.id ? (
                            <Check
                              className="w-3.5 h-3.5"
                              style={{ color: "var(--accent-primary)" }}
                            />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(m.id)}
                          className="p-1.5 rounded-lg border cursor-pointer opacity-80 hover:opacity-100"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: saved ? "var(--accent-gold)" : undefined,
                          }}
                          aria-label={ui.bookmarks}
                        >
                          <Bookmark className={`w-3.5 h-3.5 ${saved ? "fill-current" : ""}`} />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-bold">{m.title}</h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {m.summary}
                    </p>

                    <ul
                      className="divide-y text-xs"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {m.steps.map((st, idx) => (
                        <li
                          key={idx}
                          className="py-2 first:pt-0 last:pb-0 leading-relaxed"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-secondary)",
                          }}
                        >
                          {st}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div
                    className="pt-3 border-t space-y-2 text-xs"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <div
                      className="text-[11px] leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      <strong style={{ color: "var(--accent-gold)" }}>
                        {ui.dalilSource} ({m.source}):
                      </strong>{" "}
                      {m.dalilNote}
                    </div>
                    <div className="flex justify-end">
                      <Link
                        href={m.deepLink}
                        className="font-semibold inline-flex items-center gap-1 hover:underline"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        <span>{ui.relatedModule}</span>
                        <ArrowRight className="w-3.5 h-3.5 rtl-mirror" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: MASNOON SUNNAH PLAYBOOKS
         ===================================================================== */}
      {activeTab === "sunnah" && (
        <div className="space-y-5">
          <div className="bento-card p-4 sm:p-5 space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div
                className="flex-1 flex items-center gap-2 px-3.5 py-2 rounded-xl border"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={sunnahQuery}
                  onChange={(e) => setSunnahQuery(e.target.value)}
                  placeholder={ui.sunnahSearchPlaceholder}
                  className="w-full bg-transparent outline-none text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {(
                  [
                    { id: "All", label: ui.all },
                    { id: "Completed", label: ui.completed },
                    { id: "Remaining", label: ui.remaining },
                  ] as const
                ).map((st) => {
                  const active = sunnahStatusFilter === st.id;
                  return (
                    <button
                      key={st.id}
                      type="button"
                      onClick={() => setSunnahStatusFilter(st.id)}
                      className="px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer transition"
                      style={
                        active
                          ? {
                              backgroundColor: "var(--accent-soft)",
                              borderColor: "var(--accent-primary)",
                              color: "var(--accent-primary)",
                            }
                          : {
                              backgroundColor: "var(--bg-elevated)",
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-secondary)",
                            }
                      }
                    >
                      {st.label}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SUNNAH_CATEGORIES.map((cat) => {
                const active = sunnahCat === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSunnahCat(cat)}
                    className="px-3 py-1.5 rounded-full border text-xs font-medium cursor-pointer transition"
                    style={
                      active
                        ? {
                            backgroundImage: "var(--gradient-brand)",
                            color: "#ffffff",
                            borderColor: "transparent",
                          }
                        : {
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-secondary)",
                          }
                    }
                  >
                    {cat === "All" ? ui.all : ui.sunnahCatLabels[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSunnahPlaybooks.map((pb) => {
              const added = Boolean(sunnahChecks[pb.id]);
              return (
                <article
                  key={pb.id}
                  className="bento-card p-5 space-y-4 flex flex-col justify-between"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2 text-[11px]">
                      <span
                        className="font-semibold"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        {ui.sunnahCatLabels[pb.category]}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>{pb.hadithRef}</span>
                    </div>

                    <div>
                      <h3 className="font-bold text-sm sm:text-base">{pb.title}</h3>
                      <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {pb.occasion}
                      </p>
                    </div>

                    <div
                      className="p-3.5 rounded-2xl border space-y-1.5"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() => speakArabicOrEnglish(pb.arabicDua, "ar-SA")}
                          className="text-[11px] inline-flex items-center gap-1 cursor-pointer"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          <Volume2 className="w-3 h-3" />
                          <span>{ui.listen}</span>
                        </button>
                      </div>
                      <p
                        dir="rtl"
                        className="font-arabic text-lg sm:text-xl text-right leading-[2.1]"
                      >
                        {pb.arabicDua}
                      </p>
                      <p className="text-[11px] italic" style={{ color: "var(--text-muted)" }}>
                        {pb.transliteration}
                      </p>
                      {preferUrdu ? (
                        <>
                          <p
                            dir="rtl"
                            className="font-urdu text-right text-sm leading-loose"
                          >
                            {pb.urduMeaning}
                          </p>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {pb.meaning}
                          </p>
                        </>
                      ) : (
                        <>
                          <p
                            className="text-xs leading-relaxed"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {pb.meaning}
                          </p>
                          <p
                            dir="rtl"
                            className="font-urdu text-right text-sm leading-loose"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {pb.urduMeaning}
                          </p>
                        </>
                      )}
                    </div>

                    <ul className="space-y-1.5 text-xs">
                      {pb.steps.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <CheckCircle2
                            className="w-3.5 h-3.5 shrink-0 mt-0.5"
                            style={{ color: "var(--accent-primary)" }}
                          />
                          <span style={{ color: "var(--text-secondary)" }}>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSunnah(pb.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer border transition"
                    style={
                      added
                        ? {
                            backgroundColor: "var(--accent-soft)",
                            borderColor: "var(--accent-primary)",
                            color: "var(--accent-primary)",
                          }
                        : {
                            backgroundColor: "var(--bg-elevated)",
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-primary)",
                          }
                    }
                  >
                    {added ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>{added ? ui.completedToday : ui.markCompleted}</span>
                  </button>
                </article>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FiqhPage() {
  const { lang } = useApp();
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          {tp(lang, "Loading")}
        </div>
      }
    >
      <FiqhHadithInner />
    </Suspense>
  );
}
