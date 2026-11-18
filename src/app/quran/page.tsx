"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  BookOpen,
  Play,
  Pause,
  Repeat,
  Moon,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Bookmark,
  Share2,
  Copy,
  Check,
  ListMusic,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  SlidersHorizontal,
  AlignJustify,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { assetUrl } from "@/lib/assets";
import { LangCode, t, tp } from "@/lib/i18n";
import {
  HANAFI_SAJDA_ITEMS,
  HANAFI_SAJDA_REFS,
  JUZ_LIST,
  QURAN_AYAHS,
  QuranAyah,
  SURAH_LIST,
  getEveryAyahUrl,
  toArabicIndicDigits,
} from "@/data/quran";

interface CompactAyah {
  n: number;
  g: number;
  p: number;
  j: number;
  r: number;
  h: number;
  t: string;
  u: string;
  e: string;
}

interface CompactSurah {
  n: number;
  ar: string;
  en: string;
  tr: string;
  rv: "M" | "D";
  p: number;
  j: number;
  a: CompactAyah[];
}

interface DisplayAyah {
  id: string;
  globalNum: number;
  surahNum: number;
  surahName: string;
  surahArabic: string;
  ayahNum: number;
  page: number;
  juz: number;
  ruku: number;
  hizbQuarter: number;
  arabicIndoPak: string;
  arabicUthmani: string;
  transliteration: string;
  kanzulImanUrdu: string;
  kanzulImanEnglish: string;
  kanzulImanRomanUrdu?: string;
  kanzulImanHindi?: string;
  khazainUlIrfanNote?: string;
  hanafiSajda: boolean;
  audioUrl: string;
}

interface QuranUiStrings {
  surahView: string;
  mushaf604: string;
  highlights: string;
  settings: string;
  audio: string;
  playSurah: string;
  pause: string;
  listen: string;
  jumpToPage: string;
  translation: string;
  transliteration: string;
  tajweed: string;
  script: string;
  indoPak: string;
  uthmani: string;
  on: string;
  off: string;
  autoNext: string;
  loop: string;
  sleep: string;
  copy: string;
  copied: string;
  share: string;
  bookmark: string;
  sajdaCompleted: string;
  deferSajda: string;
  markDone: string;
  paperNight: string;
  paperCream: string;
  searchPlaceholder: string;
  loadingQuran: string;
  corpusError: string;
  audioUnavailable: string;
  dismiss: string;
  nextPage: string;
  prevPage: string;
  nextSurah: string;
  sajdaCount: string;
  wajibSajda: string;
  sajdaDoneBanner: string;
  sajdaDeferredBanner: string;
  sajdaPromptBanner: string;
  sajdaDrawerTitle: string;
  deferredQueue: string;
  tafsirNote: string;
  hideTafsir: string;
  showTranslation: string;
  hideTranslation: string;
  urduToggle: string;
  englishToggle: string;
  kanzulImanUr: string;
  kanzulImanEn: string;
  kanzulImanHi: string;
  kanzulImanRoUr: string;
  pageTarjuma: string;
  hizb: string;
  done: string;
  logAction: string;
}

const QURAN_UI: Record<LangCode, QuranUiStrings> = {
  en: {
    surahView: "Surah View",
    mushaf604: "Mushaf 604p",
    highlights: "Highlights & Sajda",
    settings: "Settings",
    audio: "Audio",
    playSurah: "Play Surah",
    pause: "Pause",
    listen: "Listen",
    jumpToPage: "Jump to Page",
    translation: "Translation",
    transliteration: "Transliteration",
    tajweed: "Tajweed",
    script: "Script",
    indoPak: "Indo-Pak",
    uthmani: "Uthmani",
    on: "On",
    off: "Off",
    autoNext: "Auto-Next",
    loop: "Loop",
    sleep: "Sleep",
    copy: "Copy",
    copied: "Copied",
    share: "Share",
    bookmark: "Bookmark",
    sajdaCompleted: "Sajda Completed",
    deferSajda: "Defer Sajda",
    markDone: "Mark Done",
    paperNight: "Paper: Night",
    paperCream: "Paper: Cream",
    searchPlaceholder: "Search verse number or translation…",
    loadingQuran: "Opening the Noble Mushaf…",
    corpusError: "Could not load the 604-page Mushaf dataset.",
    audioUnavailable: "Audio recitation is temporarily unavailable.",
    dismiss: "Dismiss",
    nextPage: "Next Page",
    prevPage: "Prev Page",
    nextSurah: "Next Surah",
    sajdaCount: "Sajdas",
    wajibSajda: "Wajib Sajda",
    sajdaDoneBanner: "Alhamdulillah — Sajda-e-Tilawat completed.",
    sajdaDeferredBanner: "Saved to your Sajda reminder queue.",
    sajdaPromptBanner: "Wajib Sajda-e-Tilawat (Hanafi): Perform one Sajdah facing Qibla.",
    sajdaDrawerTitle: "14 Wajib Sajda-e-Tilawat Verses",
    deferredQueue: "Deferred Sajda Queue",
    tafsirNote: "Khazain-ul-Irfan Commentary",
    hideTafsir: "Hide Commentary",
    showTranslation: "Show Translation",
    hideTranslation: "Hide Translation",
    urduToggle: "Urdu (کنزالایمان)",
    englishToggle: "English (Kanzul Iman)",
    kanzulImanUr: "Kanzul Iman (Urdu — Imam Ahmad Raza Khan)",
    kanzulImanEn: "Kanzul Iman (English)",
    kanzulImanHi: "Kanzul Iman (Hindi)",
    kanzulImanRoUr: "Kanzul Iman (Roman Urdu)",
    pageTarjuma: "Kanzul Iman Page Translation",
    hizb: "Hizb",
    done: "Done",
    logAction: "Log",
  },
  ur: {
    surahView: "سورۃ مطالعہ",
    mushaf604: "مصحف ۶۰۴ ص",
    highlights: "منتخب و سجدہ",
    settings: "ترتیبات",
    audio: "تلاوت",
    playSurah: "تلاوتِ سورۃ",
    pause: "روکیں",
    listen: "سنیں",
    jumpToPage: "صفحہ منتخب کریں",
    translation: "ترجمہ",
    transliteration: "تلفظ",
    tajweed: "تجوید",
    script: "رسم الخط",
    indoPak: "برصغیر (انڈو پاک)",
    uthmani: "عثمانی",
    on: "فعال",
    off: "غیر فعال",
    autoNext: "مسلسل تلاوت",
    loop: "تکرار",
    sleep: "ٹائمر",
    copy: "کاپی",
    copied: "کاپی ہو گیا",
    share: "شیئر",
    bookmark: "نشان زد",
    sajdaCompleted: "سجدہ مکمل",
    deferSajda: "یاد دہانی میں رکھیں",
    markDone: "ادا ہو گیا",
    paperNight: "کاغذ: شب",
    paperCream: "کاغذ: کریم",
    searchPlaceholder: "آیت نمبر یا ترجمہ کنزالایمان تلاش کریں…",
    loadingQuran: "قرآنِ مجید لوڈ ہو رہا ہے…",
    corpusError: "۶۰۴ صفحات کا مصحف لوڈ نہیں ہو سکا۔",
    audioUnavailable: "تلاوت کی آڈیو اس وقت دستیاب نہیں۔",
    dismiss: "بند کریں",
    nextPage: "اگلا صفحہ",
    prevPage: "پچھلا صفحہ",
    nextSurah: "اگلی سورۃ",
    sajdaCount: "سجدے",
    wajibSajda: "سجدۂ تلاوت واجب",
    sajdaDoneBanner: "الحمد للہ — سجدۂ تلاوت ادا ہو چکا ہے۔",
    sajdaDeferredBanner: "آپ کی سجدہ یاد دہانی فہرست میں محفوظ ہے۔",
    sajdaPromptBanner: "فقہِ حنفی: اس آیت کی تلاوت یا سماع پر رو بہ قبلہ ایک سجدہ واجب ہے۔",
    sajdaDrawerTitle: "۱۴ واجب آیاتِ سجدۂ تلاوت",
    deferredQueue: "باقی سجدہ ہائے تلاوت",
    tafsirNote: "حاشیہ خزائن العرفان",
    hideTafsir: "حاشیہ چھپائیں",
    showTranslation: "ترجمہ دکھائیں",
    hideTranslation: "ترجمہ چھپائیں",
    urduToggle: "اردو (کنزالایمان)",
    englishToggle: "انگریزی ترجمہ",
    kanzulImanUr: "ترجمہ کنزالایمان (اعلیٰ حضرت امام احمد رضا خان)",
    kanzulImanEn: "کنزالایمان (انگریزی)",
    kanzulImanHi: "کنزالایمان (ہندی)",
    kanzulImanRoUr: "کنزالایمان (رومن اردو)",
    pageTarjuma: "ترجمہ کنزالایمان (مکمل صفحہ)",
    hizb: "حزب",
    done: "مکمل",
    logAction: "درج کریں",
  },
  ar: {
    surahView: "عرض السورة",
    mushaf604: "المصحف ٦٠٤ ص",
    highlights: "المختارات والسجدة",
    settings: "الإعدادات",
    audio: "التلاوة",
    playSurah: "تلاوة السورة",
    pause: "إيقاف مؤقت",
    listen: "استماع",
    jumpToPage: "انتقال إلى صفحة",
    translation: "الترجمة",
    transliteration: "النطق اللاتيني",
    tajweed: "التجويد",
    script: "الرسم",
    indoPak: "الهندي والباكستاني",
    uthmani: "الرسم العثماني",
    on: "مفعل",
    off: "معطل",
    autoNext: "تلقائي",
    loop: "تكرار",
    sleep: "مؤقت النوم",
    copy: "نسخ",
    copied: "تم النسخ",
    share: "مشاركة",
    bookmark: "حفظ العلامة",
    sajdaCompleted: "تمت السجدة",
    deferSajda: "تأجيل السجدة",
    markDone: "تسجيل الأداء",
    paperNight: "الورق: ليلي",
    paperCream: "الورق: كريمي",
    searchPlaceholder: "ابحث برقم الآية أو النص…",
    loadingQuran: "جارٍ فتح المصحف الشريف…",
    corpusError: "تعذر تحميل بيانات المصحف الشريف (٦٠٤ صفحات).",
    audioUnavailable: "التلاوة الصوتية غير متاحة حالياً.",
    dismiss: "إغلاق",
    nextPage: "الصفحة التالية",
    prevPage: "الصفحة السابقة",
    nextSurah: "السورة التالية",
    sajdaCount: "السجدات",
    wajibSajda: "سجدة تلاوة واجبة",
    sajdaDoneBanner: "الحمد لله — تم أداء سجدة التلاوة.",
    sajdaDeferredBanner: "تم الحفظ في قائمة تذكير السجدات.",
    sajdaPromptBanner: "الفقه الحنفي: تجب سجدة التلاوة عند قراءة أو سماع هذه الآية.",
    sajdaDrawerTitle: "آيات سجدة التلاوة الـ ١٤ الواجبة",
    deferredQueue: "سجدات مؤجلة للأداء",
    tafsirNote: "حاشية خزائن العرفان",
    hideTafsir: "إخفاء الحاشية",
    showTranslation: "إظهار الترجمة",
    hideTranslation: "إخفاء الترجمة",
    urduToggle: "الأردية (كنز الإيمان)",
    englishToggle: "الإنجليزية (كنز الإيمان)",
    kanzulImanUr: "كنز الإيمان (الأردية)",
    kanzulImanEn: "كنز الإيمان (الإنجليزية)",
    kanzulImanHi: "كنز الإيمان (الهندية)",
    kanzulImanRoUr: "كنز الإيمان (الأردية اللاتينية)",
    pageTarjuma: "ترجمة معاني الصفحة",
    hizb: "الحزب",
    done: "تم",
    logAction: "تسجيل",
  },
  ro_ur: {
    surahView: "Surah View",
    mushaf604: "Mushaf 604p",
    highlights: "Muntakhab & Sajda",
    settings: "Settings",
    audio: "Tilawat",
    playSurah: "Surah Sunein",
    pause: "Rokein",
    listen: "Sunein",
    jumpToPage: "Safha par jayein",
    translation: "Tarjuma",
    transliteration: "Talaffuz",
    tajweed: "Tajweed",
    script: "Rasm-ul-Khat",
    indoPak: "Indo-Pak",
    uthmani: "Uthmani",
    on: "On",
    off: "Off",
    autoNext: "Auto-Agla",
    loop: "Dohrayein",
    sleep: "Sleep Timer",
    copy: "Copy",
    copied: "Copy Ho Gaya",
    share: "Share",
    bookmark: "Nishani",
    sajdaCompleted: "Sajda Mukammal",
    deferSajda: "Baad Mein",
    markDone: "Ada Ho Gaya",
    paperNight: "Kaghaz: Night",
    paperCream: "Kaghaz: Cream",
    searchPlaceholder: "Ayat number ya tarjuma talash karein…",
    loadingQuran: "Quran-e-Pak khul raha hai…",
    corpusError: "604-safha Mushaf load nahi ho saka.",
    audioUnavailable: "Audio tilawat dastiyab nahi hai.",
    dismiss: "Hataein",
    nextPage: "Agla Safha",
    prevPage: "Pichla Safha",
    nextSurah: "Agli Surah",
    sajdaCount: "Sajde",
    wajibSajda: "Wajib Sajda",
    sajdaDoneBanner: "Alhamdulillah — Sajda-e-Tilawat ada ho gaya.",
    sajdaDeferredBanner: "Sajda yad-dihani fehrist mein mehfooz.",
    sajdaPromptBanner: "Hanafi Fiqh: Qibla rukh ek Sajda-e-Tilawat wajib hai.",
    sajdaDrawerTitle: "14 Wajib Sajda-e-Tilawat Aayaat",
    deferredQueue: "Baqi Sajda Fehrist",
    tafsirNote: "Khazain-ul-Irfan Hashiya",
    hideTafsir: "Hashiya Chhupayein",
    showTranslation: "Tarjuma Dikhayein",
    hideTranslation: "Tarjuma Chhupayein",
    urduToggle: "Urdu (کنزالایمان)",
    englishToggle: "English (Kanzul Iman)",
    kanzulImanUr: "Kanzul Iman (Urdu — Ala Hazrat)",
    kanzulImanEn: "Kanzul Iman (English)",
    kanzulImanHi: "Kanzul Iman (Hindi)",
    kanzulImanRoUr: "Kanzul Iman (Roman Urdu)",
    pageTarjuma: "Safha Tarjuma (Kanzul Iman)",
    hizb: "Hizb",
    done: "Mukammal",
    logAction: "Darj",
  },
  hi: {
    surahView: "सूरह दृश्य",
    mushaf604: "मुसहफ़ 604 पृ.",
    highlights: "चयनित व सजदा",
    settings: "सेटिंग्स",
    audio: "तिलावत",
    playSurah: "सूरह सुनें",
    pause: "रोकें",
    listen: "सुनें",
    jumpToPage: "पृष्ठ पर जाएं",
    translation: "अनुवाद",
    transliteration: "उच्चारण",
    tajweed: "तजवीद",
    script: "लिपि",
    indoPak: "इंडो-पाक",
    uthmani: "उस्मानी",
    on: "चालू",
    off: "बंद",
    autoNext: "ऑटो-अगला",
    loop: "दोहराएं",
    sleep: "स्लीप टाइमर",
    copy: "कॉपी",
    copied: "कॉपी हो गया",
    share: "साझा करें",
    bookmark: "बुकमार्क",
    sajdaCompleted: "सजदा पूर्ण",
    deferSajda: "बाद में याद दिलाएं",
    markDone: "पूर्ण चिह्नित करें",
    paperNight: "पृष्ठ: नाइट",
    paperCream: "पृष्ठ: क्रीम",
    searchPlaceholder: "आयत संख्या या अनुवाद खोजें…",
    loadingQuran: "पवित्र क़ुरआन लोड हो रहा है…",
    corpusError: "604 पृष्ठ का मुसहफ़ लोड नहीं हो सका।",
    audioUnavailable: "ऑडियो तिलावत अभी उपलब्ध नहीं है।",
    dismiss: "बंद करें",
    nextPage: "अगला पृष्ठ",
    prevPage: "पिछला पृष्ठ",
    nextSurah: "अगली सूरह",
    sajdaCount: "सजदे",
    wajibSajda: "वाजिब सजदा",
    sajdaDoneBanner: "अलहम्दुलिल्लाह — सजदा-ए-तिलावत पूरा हुआ।",
    sajdaDeferredBanner: "आपकी सजदा अनुस्मारक सूची में सहेजा गया।",
    sajdaPromptBanner: "हनफ़ी फ़िक़्ह: क़िबला रुख़ एक सजदा-ए-तिलावत वाजिब है।",
    sajdaDrawerTitle: "14 वाजिब सजदा-ए-तिलावत आयतें",
    deferredQueue: "लंबित सजदा सूची",
    tafsirNote: "ख़ज़ाइनुल इरफ़ान टिप्पणी",
    hideTafsir: "टिप्पणी छुपाएं",
    showTranslation: "अनुवाद दिखाएं",
    hideTranslation: "अनुवाद छुपाएं",
    urduToggle: "उर्दू (کنزالایمان)",
    englishToggle: "अंग्रेज़ी (Kanzul Iman)",
    kanzulImanUr: "कन्ज़ुल ईमान (उर्दू)",
    kanzulImanEn: "कन्ज़ुल ईमान (अंग्रेज़ी)",
    kanzulImanHi: "कन्ज़ुल ईमान (हिन्दी)",
    kanzulImanRoUr: "कन्ज़ुल ईमान (रोमन उर्दू)",
    pageTarjuma: "कन्ज़ुल ईमान पृष्ठ अनुवाद",
    hizb: "हिज़्ब",
    done: "पूर्ण",
    logAction: "दर्ज करें",
  },
  tr: {
    surahView: "Sûre Görünümü",
    mushaf604: "Mushaf 604s",
    highlights: "Seçmeler ve Secde",
    settings: "Ayarlar",
    audio: "Ses",
    playSurah: "Sûreyi Dinle",
    pause: "Duraklat",
    listen: "Dinle",
    jumpToPage: "Sayfaya Git",
    translation: "Meal",
    transliteration: "Okunuş",
    tajweed: "Tecvid",
    script: "Hat",
    indoPak: "Hint-Pak",
    uthmani: "Osmanî",
    on: "Açık",
    off: "Kapalı",
    autoNext: "Otomatik Geçiş",
    loop: "Tekrar",
    sleep: "Uyku",
    copy: "Kopyala",
    copied: "Kopyalandı",
    share: "Paylaş",
    bookmark: "Yer İmi",
    sajdaCompleted: "Secde Yapıldı",
    deferSajda: "Sonra Hatırlat",
    markDone: "Tamamlandı",
    paperNight: "Sayfa: Gece",
    paperCream: "Sayfa: Krem",
    searchPlaceholder: "Âyet numarası veya meal ara…",
    loadingQuran: "Kur'ân-ı Kerîm yükleniyor…",
    corpusError: "604 sayfalık Mushaf verisi yüklenemedi.",
    audioUnavailable: "Sesli tilavet şu anda kullanılamıyor.",
    dismiss: "Kapat",
    nextPage: "Sonraki Sayfa",
    prevPage: "Önceki Sayfa",
    nextSurah: "Sonraki Sûre",
    sajdaCount: "Secdeler",
    wajibSajda: "Vacip Secde",
    sajdaDoneBanner: "Elhamdülillah — Tilavet secdesi tamamlandı.",
    sajdaDeferredBanner: "Tilavet secdesi hatırlatma listesine eklendi.",
    sajdaPromptBanner: "Hanefî Fıkhı: Kıbleye yönelerek 1 tilavet secdesi vaciptir.",
    sajdaDrawerTitle: "14 Vacip Tilavet Secdesi Âyeti",
    deferredQueue: "Bekleyen Secdeler",
    tafsirNote: "Hazâinü'l-İrfân Notu",
    hideTafsir: "Notu Gizle",
    showTranslation: "Meali Göster",
    hideTranslation: "Meali Gizle",
    urduToggle: "Urduca (کنزالایمان)",
    englishToggle: "İngilizce (Kanzul Iman)",
    kanzulImanUr: "Kenzü'l-İman (Urduca)",
    kanzulImanEn: "Kenzü'l-İman (İngilizce)",
    kanzulImanHi: "Kenzü'l-İman (Hintçe)",
    kanzulImanRoUr: "Kenzü'l-İman (Latin Urduca)",
    pageTarjuma: "Sayfa Meali (Kenzü'l-İman)",
    hizb: "Hizb",
    done: "Tamam",
    logAction: "Kaydet",
  },
  bn: {
    surahView: "সূরা ভিউ",
    mushaf604: "মুসহাফ ৬০৪ পৃ.",
    highlights: "নির্বাচিত ও সিজদা",
    settings: "সেটিংস",
    audio: "তিলাওয়াত",
    playSurah: "সূরা শুনুন",
    pause: "বিরতি",
    listen: "শুনুন",
    jumpToPage: "পৃষ্ঠায় যান",
    translation: "অনুবাদ",
    transliteration: "উচ্চারণ",
    tajweed: "তাজবিদ",
    script: "লিপি",
    indoPak: "ইন্দো-পাক",
    uthmani: "উসমানী",
    on: "চালু",
    off: "বন্ধ",
    autoNext: "স্বয়ংক্রিয়",
    loop: "পুনরাবৃত্তি",
    sleep: "স্লিপ টাইমার",
    copy: "কপি",
    copied: "কপি হয়েছে",
    share: "শেয়ার",
    bookmark: "বুকমার্ক",
    sajdaCompleted: "সিজদা সম্পন্ন",
    deferSajda: "পরে মনে করান",
    markDone: "সম্পন্ন করুন",
    paperNight: "কাগজ: রাত",
    paperCream: "কাগজ: ক্রিম",
    searchPlaceholder: "আয়াত নম্বর বা অনুবাদ খুঁজুন…",
    loadingQuran: "পবিত্র কুরআন লোড হচ্ছে…",
    corpusError: "৬০৪ পৃষ্ঠার মুসহাফ লোড করা যায়নি।",
    audioUnavailable: "অডিও তিলাওয়াত বর্তমানে পাওয়া যাচ্ছে না।",
    dismiss: "বন্ধ করুন",
    nextPage: "পরবর্তী পৃষ্ঠা",
    prevPage: "পূর্ববর্তী পৃষ্ঠা",
    nextSurah: "পরবর্তী সূরা",
    sajdaCount: "সিজদা",
    wajibSajda: "ওয়াজিব সিজদা",
    sajdaDoneBanner: "আলহামদুলিল্লাহ — সিজদায়ে তিলাওয়াত সম্পন্ন হয়েছে।",
    sajdaDeferredBanner: "সিজদা রিমাইন্ডার তালিকায় সংরক্ষিত হয়েছে।",
    sajdaPromptBanner: "হানাফি ফিকহ: কিবলামুখী হয়ে ১টি সিজদায়ে তিলাওয়াত ওয়াজিব।",
    sajdaDrawerTitle: "১৪টি ওয়াজিব সিজদায়ে তিলাওয়াত আয়াত",
    deferredQueue: "বাকি সিজদার তালিকা",
    tafsirNote: "খাযাইনুল ইরফান টীকা",
    hideTafsir: "টীকা লুকান",
    showTranslation: "অনুবাদ দেখান",
    hideTranslation: "অনুবাদ লুকান",
    urduToggle: "উর্দু (کنزالایمان)",
    englishToggle: "ইংরেজি (Kanzul Iman)",
    kanzulImanUr: "কানযুল ঈমান (উর্দু)",
    kanzulImanEn: "কানযুল ঈমান (ইংরেজি)",
    kanzulImanHi: "কানযুল ঈমান (হিন্দি)",
    kanzulImanRoUr: "কানযুল ঈমান (রোমান উর্দু)",
    pageTarjuma: "পৃষ্ঠার অনুবাদ (কানযুল ঈমান)",
    hizb: "হিযব",
    done: "সম্পন্ন",
    logAction: "নথিভুক্ত",
  },
  fa: {
    surahView: "نمای سوره",
    mushaf604: "مصحف ۶۰۴ ص",
    highlights: "برگزیده و سجده",
    settings: "تنظیمات",
    audio: "صوت",
    playSurah: "پخش سوره",
    pause: "مکث",
    listen: "شنیدن",
    jumpToPage: "رفتن به صفحه",
    translation: "ترجمه",
    transliteration: "آوانگاری",
    tajweed: "تجوید",
    script: "رسم‌الخط",
    indoPak: "شبه‌قاره",
    uthmani: "عثمانی",
    on: "فعال",
    off: "غیرفعال",
    autoNext: "پخش پیوسته",
    loop: "تکرار",
    sleep: "خواب",
    copy: "کپی",
    copied: "کپی شد",
    share: "اشتراک",
    bookmark: "نشان‌گذاری",
    sajdaCompleted: "سجده انجام شد",
    deferSajda: "یادآوری بعدی",
    markDone: "ثبت انجام",
    paperNight: "کاغذ: شب",
    paperCream: "کاغذ: کرم",
    searchPlaceholder: "جستجوی شماره آیه یا متن ترجمه…",
    loadingQuran: "در حال گشودن مصحف شریف…",
    corpusError: "بارگذاری مصحف ۶۰۴ صفحه‌ای ممکن نشد.",
    audioUnavailable: "فایل صوتی تلاوت در دسترس نیست.",
    dismiss: "بستن",
    nextPage: "صفحه بعد",
    prevPage: "صفحه قبل",
    nextSurah: "سوره بعدی",
    sajdaCount: "سجده‌ها",
    wajibSajda: "سجده تلاوت واجب",
    sajdaDoneBanner: "الحمدلله — سجده تلاوت به جا آورده شد.",
    sajdaDeferredBanner: "در فهرست یادآوری سجده ذخیره شد.",
    sajdaPromptBanner: "فقه حنفی: یک سجده تلاوت رو به قبله واجب است.",
    sajdaDrawerTitle: "۱۴ آیه واجب سجده تلاوت",
    deferredQueue: "سجده‌های معوقه",
    tafsirNote: "حاشیه خزائن‌العرفان",
    hideTafsir: "پنهان کردن حاشیه",
    showTranslation: "نمایش ترجمه",
    hideTranslation: "پنهان کردن ترجمه",
    urduToggle: "اردو (کنزالایمان)",
    englishToggle: "انگلیسی (Kanzul Iman)",
    kanzulImanUr: "کنزالایمان (اردو — امام احمد رضا خان)",
    kanzulImanEn: "کنزالایمان (انگلیسی)",
    kanzulImanHi: "کنزالایمان (هندی)",
    kanzulImanRoUr: "کنزالایمان (اردوی لاتین)",
    pageTarjuma: "ترجمه آیات صفحه",
    hizb: "حزب",
    done: "انجام شد",
    logAction: "ثبت",
  },
  id: {
    surahView: "Tampilan Surah",
    mushaf604: "Mushaf 604h",
    highlights: "Pilihan & Sajdah",
    settings: "Pengaturan",
    audio: "Audio",
    playSurah: "Putar Surah",
    pause: "Jeda",
    listen: "Dengar",
    jumpToPage: "Ke Halaman",
    translation: "Terjemahan",
    transliteration: "Transliterasi",
    tajweed: "Tajwid",
    script: "Rasm",
    indoPak: "Indo-Pak",
    uthmani: "Utsmani",
    on: "Aktif",
    off: "Nonaktif",
    autoNext: "Otomatis Lanjut",
    loop: "Ulangi",
    sleep: "Tidur",
    copy: "Salin",
    copied: "Tersalin",
    share: "Bagikan",
    bookmark: "Markah",
    sajdaCompleted: "Sajdah Selesai",
    deferSajda: "Tunda Sajdah",
    markDone: "Tandai Selesai",
    paperNight: "Kertas: Malam",
    paperCream: "Kertas: Krem",
    searchPlaceholder: "Cari nomor ayat atau terjemahan…",
    loadingQuran: "Membuka Mushaf Al-Qur'an…",
    corpusError: "Gagal memuat data Mushaf 604 halaman.",
    audioUnavailable: "Audio murottal sedang tidak tersedia.",
    dismiss: "Tutup",
    nextPage: "Hal. Berikut",
    prevPage: "Hal. Sebelum",
    nextSurah: "Surah Berikutnya",
    sajdaCount: "Sajdah",
    wajibSajda: "Sajdah Wajib",
    sajdaDoneBanner: "Alhamdulillah — Sajdah Tilawah telah ditunaikan.",
    sajdaDeferredBanner: "Disimpan ke daftar pengingat Sajdah Anda.",
    sajdaPromptBanner: "Fiqih Hanafi: Wajib melakukan 1 sujud tilawah menghadap Kiblat.",
    sajdaDrawerTitle: "14 Ayat Sajdah Tilawah Wajib",
    deferredQueue: "Antrean Sajdah Tertunda",
    tafsirNote: "Catatan Khazain-ul-Irfan",
    hideTafsir: "Sembunyikan Catatan",
    showTranslation: "Tampilkan Terjemahan",
    hideTranslation: "Sembunyikan Terjemahan",
    urduToggle: "Urdu (کنزالایمان)",
    englishToggle: "Inggris (Kanzul Iman)",
    kanzulImanUr: "Kanzul Iman (Urdu)",
    kanzulImanEn: "Kanzul Iman (Inggris)",
    kanzulImanHi: "Kanzul Iman (Hindi)",
    kanzulImanRoUr: "Kanzul Iman (Urdu Latin)",
    pageTarjuma: "Terjemahan Halaman (Kanzul Iman)",
    hizb: "Hizb",
    done: "Selesai",
    logAction: "Catat",
  },
  fr: {
    surahView: "Vue Sourate",
    mushaf604: "Moushaf 604p",
    highlights: "Sélection & Sajda",
    settings: "Paramètres",
    audio: "Audio",
    playSurah: "Écouter la Sourate",
    pause: "Pause",
    listen: "Écouter",
    jumpToPage: "Aller à la page",
    translation: "Traduction",
    transliteration: "Translittération",
    tajweed: "Tajwid",
    script: "Graphie",
    indoPak: "Indo-Pak",
    uthmani: "Othmanienne",
    on: "Activé",
    off: "Désactivé",
    autoNext: "Suite auto",
    loop: "Boucle",
    sleep: "Veille",
    copy: "Copier",
    copied: "Copié",
    share: "Partager",
    bookmark: "Marque-page",
    sajdaCompleted: "Sajda accomplie",
    deferSajda: "Reporter la Sajda",
    markDone: "Valider",
    paperNight: "Papier : Nuit",
    paperCream: "Papier : Crème",
    searchPlaceholder: "Rechercher un verset ou une traduction…",
    loadingQuran: "Ouverture du Noble Moushaf…",
    corpusError: "Impossible de charger le Moushaf de 604 pages.",
    audioUnavailable: "La récitation audio est indisponible.",
    dismiss: "Fermer",
    nextPage: "Page suiv.",
    prevPage: "Page préc.",
    nextSurah: "Sourate suivante",
    sajdaCount: "Sajdas",
    wajibSajda: "Sajda Wajib",
    sajdaDoneBanner: "Alhamdulillah — Prosternation de récitation accomplie.",
    sajdaDeferredBanner: "Enregistré dans vos rappels de Sajda.",
    sajdaPromptBanner: "Fiqh Hanafite : Effectuez 1 prosternation face à la Qibla.",
    sajdaDrawerTitle: "Les 14 Versets de Prosternation (Wajib)",
    deferredQueue: "Sajdas en attente",
    tafsirNote: "Note Khazain-ul-Irfan",
    hideTafsir: "Masquer la note",
    showTranslation: "Afficher la traduction",
    hideTranslation: "Masquer la traduction",
    urduToggle: "Ourdou (کنزالایمان)",
    englishToggle: "Anglais (Kanzul Iman)",
    kanzulImanUr: "Kanzul Iman (Ourdou)",
    kanzulImanEn: "Kanzul Iman (Anglais)",
    kanzulImanHi: "Kanzul Iman (Hindi)",
    kanzulImanRoUr: "Kanzul Iman (Ourdou latin)",
    pageTarjuma: "Traduction de la page (Kanzul Iman)",
    hizb: "Hizb",
    done: "Fait",
    logAction: "Noter",
  },
};

const TOTAL_MUSHAF_PAGES = 604;
const BISMILLAH_TEXT = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

const CURATED_BY_ID = new Map<string, QuranAyah>(QURAN_AYAHS.map((a) => [a.id, a]));

function parseRef(ref: string): { surahNum: number; ayahNum: number } {
  const [s, a] = ref.split(":").map((n) => parseInt(n, 10));
  return {
    surahNum: Number.isFinite(s) && s >= 1 && s <= 114 ? s : 1,
    ayahNum: Number.isFinite(a) && a >= 1 ? a : 1,
  };
}

function stripLeadingBismillah(text: string, surahNum: number, ayahNum: number): string {
  if (surahNum === 1 || surahNum === 9 || ayahNum !== 1) return text;
  const stripped = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, "");
  return stripped.length > 0 ? stripped : text;
}

function renderTajweedArabic(text: string, enabled: boolean): React.ReactNode {
  if (!enabled) return text;
  const parts = text.split(/(۩|[\u0622\u0670\u0653]|[^\s]\u0651[^\s]?)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part === "۩") {
      return (
        <span key={i} className="font-bold mx-1" style={{ color: "var(--accent-gold)" }}>
          {part}
        </span>
      );
    }
    if (/[\u0622\u0670\u0653]/.test(part)) {
      return (
        <span key={i} style={{ color: "var(--accent-primary)" }}>
          {part}
        </span>
      );
    }
    if (/\u0651/.test(part)) {
      return (
        <span key={i} style={{ color: "var(--accent-secondary)" }}>
          {part}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function hydrateDisplayAyah(s: CompactSurah, ay: CompactAyah): DisplayAyah {
  const ref = `${s.n}:${ay.n}`;
  const curated = CURATED_BY_ID.get(ref);
  const isHanafiSajda = HANAFI_SAJDA_REFS.has(ref);
  const is22_77 = ref === "22:77";
  const cleanArabic = stripLeadingBismillah(ay.t, s.n, ay.n);

  return {
    id: ref,
    globalNum: ay.g,
    surahNum: s.n,
    surahName: s.en,
    surahArabic: s.ar,
    ayahNum: ay.n,
    page: ay.p,
    juz: ay.j,
    ruku: ay.r,
    hizbQuarter: ay.h,
    arabicIndoPak: curated?.arabicIndoPak ?? cleanArabic,
    arabicUthmani: cleanArabic,
    transliteration: curated?.transliteration ?? "",
    kanzulImanUrdu: ay.u || curated?.kanzulImanUrdu || "",
    kanzulImanEnglish: ay.e || curated?.kanzulImanEnglish || "",
    kanzulImanRomanUrdu: curated?.kanzulImanRomanUrdu,
    kanzulImanHindi: curated?.kanzulImanHindi,
    khazainUlIrfanNote:
      curated?.khazainUlIrfanNote ??
      (isHanafiSajda
        ? "Hanafi Fiqh (Bahar-e-Shariat): Sajda-e-Tilawat is Wajib upon reciting or hearing this verse."
        : is22_77
        ? "Note: In Hanafi Madhhab, 22:77 is NOT a Sajda-e-Tilawat (only 22:18 in Surah Al-Hajj is Wajib)."
        : undefined),
    hanafiSajda: isHanafiSajda,
    audioUrl: getEveryAyahUrl(s.n, ay.n),
  };
}

function QuranReaderContent() {
  const {
    lang,
    lastQuranRef,
    logQuranAyah,
    sajdaQueue,
    sajdaCompleted,
    logSajda,
  } = useApp();

  const searchParams = useSearchParams();
  const ui = QURAN_UI[lang] ?? QURAN_UI.en;

  const initialRef = useMemo(() => parseRef(lastQuranRef), [lastQuranRef]);
  const initialSurahNum = initialRef.surahNum;
  const initialSurahMeta = useMemo(
    () => SURAH_LIST.find((s) => s.number === initialSurahNum) ?? SURAH_LIST[0],
    [initialSurahNum]
  );

  // Full 6,236-ayah dataset state
  const [quranData, setQuranData] = useState<CompactSurah[] | null>(null);
  const [loadingCorpus, setLoadingCorpus] = useState(true);
  const [corpusError, setCorpusError] = useState(false);

  // View State: Surah View, 604p Mushaf, or Highlights / Sajda
  const [viewMode, setViewMode] = useState<"surah" | "mushaf" | "highlights">("surah");
  const [mushafPaper, setMushafPaper] = useState<"night" | "cream">("night");
  const [showMushafTarjuma, setShowMushafTarjuma] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(initialSurahMeta.startPage || 1);
  const [selectedSurah, setSelectedSurah] = useState<number>(initialSurahNum || 1);
  const [selectedAyahId, setSelectedAyahId] = useState<string>(lastQuranRef || "1:1");
  const [pageInput, setPageInput] = useState<string>(String(initialSurahMeta.startPage || 1));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Drawers / Modals
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [sajdaDrawerOpen, setSajdaDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ayahFilter, setAyahFilter] = useState("");

  // Reading & Translation Preferences (auto-adapting to active `lang`)
  const [scriptMode, setScriptMode] = useState<"indopak" | "uthmani">("indopak");
  const [showTranslit, setShowTranslit] = useState(true);
  const [tajweedColor, setTajweedColor] = useState(false);
  const [openTafsirId, setOpenTafsirId] = useState<string | null>(null);
  const [showSecondaryTrans, setShowSecondaryTrans] = useState(false);
  const [arShowTranslation, setArShowTranslation] = useState(false);

  // Audio state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopAyah, setLoopAyah] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number | null>(null);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const primaryTranslationMode = useMemo<"ur" | "hi" | "ro_ur" | "ar" | "en">(() => {
    if (lang === "ur" || lang === "fa") return "ur";
    if (lang === "hi") return "hi";
    if (lang === "ro_ur") return "ro_ur";
    if (lang === "ar") return "ar";
    return "en";
  }, [lang]);

  // Support URL query params (?surah=X&page=Y) cleanly inside microtask
  const surahQueryParam = searchParams.get("surah");
  const pageQueryParam = searchParams.get("page");
  useEffect(() => {
    const sParam = Number(surahQueryParam);
    const pParam = Number(pageQueryParam);
    Promise.resolve().then(() => {
      if (Number.isFinite(sParam) && sParam >= 1 && sParam <= 114) {
        setSelectedSurah(sParam);
        setViewMode("surah");
        const meta = SURAH_LIST.find((s) => s.number === sParam);
        if (meta && !pageQueryParam) {
          setCurrentPage(meta.startPage);
          setPageInput(String(meta.startPage));
        }
      } else if (Number.isFinite(pParam) && pParam >= 1 && pParam <= TOTAL_MUSHAF_PAGES) {
        setViewMode("mushaf");
      }
      if (Number.isFinite(pParam) && pParam >= 1 && pParam <= TOTAL_MUSHAF_PAGES) {
        setCurrentPage(pParam);
        setPageInput(String(pParam));
      }
    });
  }, [surahQueryParam, pageQueryParam]);

  useEffect(() => {
    let cancelled = false;
    fetch(assetUrl("/data/quran-complete.json"))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: { surahs: CompactSurah[] }) => {
        if (cancelled) return;
        setQuranData(json.surahs);
        setLoadingCorpus(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCorpusError(true);
        setLoadingCorpus(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { pagesMap, surahMap, ayahByRef } = useMemo(() => {
    const pMap = new Map<number, DisplayAyah[]>();
    const sMap = new Map<number, DisplayAyah[]>();
    const rMap = new Map<string, DisplayAyah>();

    if (!quranData) return { pagesMap: pMap, surahMap: sMap, ayahByRef: rMap };

    for (const s of quranData) {
      const sList: DisplayAyah[] = [];
      for (const ay of s.a) {
        const d = hydrateDisplayAyah(s, ay);
        sList.push(d);
        rMap.set(d.id, d);
        const pList = pMap.get(d.page);
        if (pList) pList.push(d);
        else pMap.set(d.page, [d]);
      }
      sMap.set(s.n, sList);
    }

    return { pagesMap: pMap, surahMap: sMap, ayahByRef: rMap };
  }, [quranData]);

  const clampedPage = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, currentPage));
  const currentPageAyahs = useMemo(() => pagesMap.get(clampedPage) ?? [], [pagesMap, clampedPage]);

  const activeListAyahs: DisplayAyah[] = useMemo(() => {
    let base: DisplayAyah[] = [];
    if (viewMode === "mushaf") {
      base = currentPageAyahs;
    } else if (viewMode === "surah") {
      base = surahMap.get(selectedSurah) ?? [];
    } else {
      base = QURAN_AYAHS.map((a) => {
        const hydrated = ayahByRef.get(a.id);
        if (hydrated) return hydrated;
        return {
          id: a.id,
          globalNum: 1,
          surahNum: a.surahNum,
          surahName: a.surahName,
          surahArabic: a.surahArabic,
          ayahNum: a.ayahNum,
          page: 1,
          juz: 1,
          ruku: 1,
          hizbQuarter: 1,
          arabicIndoPak: a.arabicIndoPak,
          arabicUthmani: a.arabicUthmani,
          transliteration: a.transliteration,
          kanzulImanUrdu: a.kanzulImanUrdu,
          kanzulImanEnglish: a.kanzulImanEnglish,
          kanzulImanRomanUrdu: a.kanzulImanRomanUrdu,
          kanzulImanHindi: a.kanzulImanHindi,
          khazainUlIrfanNote: a.khazainUlIrfanNote,
          hanafiSajda: a.hanafiSajda,
          audioUrl: a.audioUrl,
        };
      });
    }
    const q = ayahFilter.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (a) =>
        a.id.includes(q) ||
        String(a.ayahNum) === q ||
        a.kanzulImanEnglish.toLowerCase().includes(q) ||
        a.kanzulImanUrdu.includes(ayahFilter.trim()) ||
        (a.kanzulImanHindi && a.kanzulImanHindi.includes(ayahFilter.trim())) ||
        (a.kanzulImanRomanUrdu && a.kanzulImanRomanUrdu.toLowerCase().includes(q))
    );
  }, [viewMode, currentPageAyahs, surahMap, selectedSurah, ayahByRef, ayahFilter]);

  const inspectedAyah: DisplayAyah | undefined = useMemo(() => {
    if (playingId && ayahByRef.get(playingId)) return ayahByRef.get(playingId);
    if (ayahByRef.get(selectedAyahId)) return ayahByRef.get(selectedAyahId);
    return activeListAyahs[0] || currentPageAyahs[0];
  }, [playingId, selectedAyahId, ayahByRef, activeListAyahs, currentPageAyahs]);

  const currentSurahMeta = useMemo(() => {
    if (viewMode === "mushaf" && currentPageAyahs.length > 0) {
      const sNum = currentPageAyahs[0].surahNum;
      return SURAH_LIST.find((s) => s.number === sNum) ?? SURAH_LIST[0];
    }
    return SURAH_LIST.find((s) => s.number === selectedSurah) ?? SURAH_LIST[0];
  }, [viewMode, currentPageAyahs, selectedSurah]);

  const currentSurahNumber = currentSurahMeta.number;
  const nextSurahMeta = useMemo(
    () => SURAH_LIST.find((s) => s.number === Math.min(114, currentSurahNumber + 1)),
    [currentSurahNumber]
  );

  const currentJuzNum = useMemo(() => {
    if (viewMode === "mushaf" && currentPageAyahs.length > 0) return currentPageAyahs[0].juz;
    return currentSurahMeta.juz || 1;
  }, [viewMode, currentPageAyahs, currentSurahMeta]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.loop = loopAyah;
  }, [playbackRate, loopAyah]);

  const sleepActive = sleepSecondsLeft !== null;
  useEffect(() => {
    if (!sleepActive) return;
    const timer = setInterval(() => {
      setSleepSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          audioRef.current?.pause();
          setPlayingId(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sleepActive]);

  const goToPage = useCallback(
    (page: number) => {
      const next = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, page));
      setCurrentPage(next);
      setPageInput(String(next));
      const firstOnPage = pagesMap.get(next)?.[0];
      if (firstOnPage) {
        setSelectedSurah(firstOnPage.surahNum);
        setSelectedAyahId(firstOnPage.id);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pagesMap]
  );

  const stepPage = useCallback(
    (delta: number) => {
      goToPage(clampedPage + delta);
    },
    [clampedPage, goToPage]
  );

  useEffect(() => {
    if (viewMode !== "mushaf") return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepPage(1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepPage(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewMode, stepPage]);

  const cycleSleepTimer = () => {
    if (sleepSecondsLeft === null) setSleepSecondsLeft(5 * 60);
    else if (sleepSecondsLeft <= 5 * 60) setSleepSecondsLeft(10 * 60);
    else if (sleepSecondsLeft <= 10 * 60) setSleepSecondsLeft(15 * 60);
    else if (sleepSecondsLeft <= 15 * 60) setSleepSecondsLeft(30 * 60);
    else setSleepSecondsLeft(null);
  };

  const formatSleep = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const playAyah = useCallback(
    (ayah: DisplayAyah) => {
      if (!audioRef.current) return;
      setAudioError(false);
      setAudioLoadingId(ayah.id);
      setSelectedAyahId(ayah.id);
      audioRef.current.src = ayah.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = loopAyah;
      audioRef.current
        .play()
        .then(() => {
          setAudioLoadingId(null);
        })
        .catch(() => {
          setAudioLoadingId(null);
          setPlayingId(null);
          setAudioError(true);
        });
      setPlayingId(ayah.id);
      logQuranAyah(ayah.id);
    },
    [playbackRate, loopAyah, logQuranAyah]
  );

  const togglePlay = (ayah: DisplayAyah) => {
    if (playingId === ayah.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      setAudioLoadingId(null);
      return;
    }
    playAyah(ayah);
  };

  const handlePlaySurah = () => {
    const firstTarget = activeListAyahs[0] || inspectedAyah;
    if (!firstTarget) return;
    if (playingId) {
      audioRef.current?.pause();
      setPlayingId(null);
      setAudioLoadingId(null);
      return;
    }
    playAyah(firstTarget);
  };

  const stepAudioVerse = (delta: number) => {
    const list = activeListAyahs;
    if (list.length === 0) return;
    const currentId = playingId || selectedAyahId;
    const idx = list.findIndex((a) => a.id === currentId);
    const nextIdx = Math.max(0, Math.min(list.length - 1, (idx === -1 ? 0 : idx) + delta));
    const target = list[nextIdx];
    if (target) {
      playAyah(target);
      document.getElementById(`ayah-${target.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const buildShareText = (ayah: DisplayAyah) =>
    `${ayah.arabicUthmani}\n\n${ayah.kanzulImanUrdu}\n${ayah.kanzulImanEnglish}\n— ${t(lang, "navQuran")} (${ayah.surahName} ${ayah.id})`;

  const handleCopyAyah = (ayah: DisplayAyah) => {
    const text = buildShareText(ayah);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(ayah.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleShareAyah = (ayah: DisplayAyah) => {
    const text = buildShareText(ayah);
    if (typeof navigator !== "undefined" && "share" in navigator) {
      navigator
        .share({
          title: `${ayah.surahName} (${ayah.id})`,
          text,
        })
        .catch(() => {
          handleCopyAyah(ayah);
        });
      return;
    }
    handleCopyAyah(ayah);
  };

  const handleAudioEnded = () => {
    if (loopAyah) return;
    if (autoAdvance && playingId) {
      const idx = activeListAyahs.findIndex((a) => a.id === playingId);
      if (idx !== -1 && idx + 1 < activeListAyahs.length) {
        const next = activeListAyahs[idx + 1];
        playAyah(next);
        document.getElementById(`ayah-${next.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (viewMode === "mushaf" && clampedPage < TOTAL_MUSHAF_PAGES) {
        const nextPage = clampedPage + 1;
        const nextPageAyahs = pagesMap.get(nextPage);
        if (nextPageAyahs && nextPageAyahs.length > 0) {
          goToPage(nextPage);
          playAyah(nextPageAyahs[0]);
          return;
        }
      }
    }
    setPlayingId(null);
  };

  const jumpToRef = (ref: string) => {
    const target = ayahByRef.get(ref);
    const { surahNum } = parseRef(ref);
    setAyahFilter("");
    setSelectedSurah(surahNum);
    setSelectedAyahId(ref);
    setSajdaDrawerOpen(false);
    if (target) {
      setCurrentPage(target.page);
      setPageInput(String(target.page));
    } else {
      const meta = SURAH_LIST.find((s) => s.number === surahNum);
      if (meta) {
        setCurrentPage(meta.startPage);
        setPageInput(String(meta.startPage));
      }
    }
  };

  const renderAdaptiveTranslation = (ayah: DisplayAyah, compact = false) => {
    const romanText = ayah.kanzulImanRomanUrdu || ayah.transliteration;

    if (primaryTranslationMode === "ar") {
      if (!arShowTranslation && !compact) return null;
      return (
        <div className="space-y-1.5">
          <p dir="ltr" className="text-sm leading-relaxed text-left" style={{ color: "var(--text-muted)" }}>
            {ayah.kanzulImanEnglish}
          </p>
          {showSecondaryTrans && ayah.kanzulImanUrdu && (
            <p dir="rtl" className="font-urdu text-right text-base sm:text-lg leading-[2.2]" style={{ color: "var(--text-secondary)" }}>
              {ayah.kanzulImanUrdu}
            </p>
          )}
        </div>
      );
    }

    if (primaryTranslationMode === "ur") {
      return (
        <div className="space-y-2">
          {showTranslit && ayah.transliteration && !compact && (
            <p dir="ltr" className="text-xs font-medium text-left" style={{ color: "var(--accent-primary)" }}>
              {ayah.transliteration}
            </p>
          )}
          <p
            dir="rtl"
            className={`font-urdu text-right leading-[2.2] ${compact ? "text-sm sm:text-base" : "text-lg sm:text-xl"}`}
            style={{ color: "var(--text-secondary)" }}
          >
            {ayah.kanzulImanUrdu}
          </p>
          {showSecondaryTrans && ayah.kanzulImanEnglish && (
            <p dir="ltr" className="text-xs sm:text-sm leading-relaxed text-left opacity-85" style={{ color: "var(--text-muted)" }}>
              {ayah.kanzulImanEnglish}
            </p>
          )}
        </div>
      );
    }

    if (primaryTranslationMode === "hi") {
      return (
        <div className="space-y-2">
          {showTranslit && ayah.transliteration && !compact && (
            <p className="text-xs font-medium" style={{ color: "var(--accent-primary)" }}>
              {ayah.transliteration}
            </p>
          )}
          {ayah.kanzulImanHindi && (
            <p
              className={`font-hindi leading-relaxed ${compact ? "text-xs sm:text-sm" : "text-sm sm:text-base"}`}
              style={{ color: "var(--text-secondary)" }}
            >
              {ayah.kanzulImanHindi}
            </p>
          )}
          <p
            className="text-xs sm:text-sm leading-relaxed"
            style={{ color: ayah.kanzulImanHindi ? "var(--text-muted)" : "var(--text-secondary)" }}
          >
            {ayah.kanzulImanEnglish}
          </p>
          {showSecondaryTrans && ayah.kanzulImanUrdu && (
            <p dir="rtl" className="font-urdu text-right text-base sm:text-lg leading-[2.2]" style={{ color: "var(--text-muted)" }}>
              {ayah.kanzulImanUrdu}
            </p>
          )}
        </div>
      );
    }

    if (primaryTranslationMode === "ro_ur") {
      return (
        <div className="space-y-2">
          {romanText && (
            <p className="text-sm sm:text-[15px] font-medium leading-relaxed" style={{ color: "var(--accent-secondary)" }}>
              {romanText}
            </p>
          )}
          <p dir="rtl" className="font-urdu text-right text-base sm:text-lg leading-[2.2]" style={{ color: "var(--text-secondary)" }}>
            {ayah.kanzulImanUrdu}
          </p>
          {(showSecondaryTrans || !romanText) && (
            <p className="text-xs sm:text-sm leading-relaxed" style={{ color: "var(--text-muted)" }}>
              {ayah.kanzulImanEnglish}
            </p>
          )}
        </div>
      );
    }

    // Default (`en`, `tr`, `bn`, `id`, `fr`): clean English Kanzul Iman + optional Urdu toggle
    return (
      <div className="space-y-2">
        {showTranslit && ayah.transliteration && !compact && (
          <p className="text-xs font-medium" style={{ color: "var(--accent-primary)" }}>
            {ayah.transliteration}
          </p>
        )}
        <p
          className={`leading-relaxed ${compact ? "text-xs" : "text-sm sm:text-[15px]"}`}
          style={{ color: "var(--text-secondary)" }}
        >
          {ayah.kanzulImanEnglish}
        </p>
        {showSecondaryTrans && ayah.kanzulImanUrdu && (
          <p dir="rtl" className="font-urdu text-right text-base sm:text-lg leading-[2.2]" style={{ color: "var(--text-muted)" }}>
            {ayah.kanzulImanUrdu}
          </p>
        )}
      </div>
    );
  };

  // Precompute current 1-page Mushaf sheet variables
  const firstPageAyah = currentPageAyahs[0];
  const lastPageAyah = currentPageAyahs[currentPageAyahs.length - 1];
  const pageJuzNum = firstPageAyah?.juz ?? 1;
  const pageJuzMeta = JUZ_LIST.find((j) => j.juz === pageJuzNum);
  const pageHizbNum = firstPageAyah ? Math.ceil(firstPageAyah.hizbQuarter / 4) : 1;
  const isOpeningPage = clampedPage === 1 || clampedPage === 2;
  const pageHasSajda = currentPageAyahs.some((a) => a.hanafiSajda);
  const isCreamPaper = mushafPaper === "cream";

  const pageSurahBlocks = useMemo(() => {
    const blocks: { surahNum: number; surahName: string; surahArabic: string; ayahs: DisplayAyah[] }[] = [];
    for (const ay of currentPageAyahs) {
      const lastBlock = blocks[blocks.length - 1];
      if (!lastBlock || lastBlock.surahNum !== ay.surahNum) {
        blocks.push({
          surahNum: ay.surahNum,
          surahName: ay.surahName,
          surahArabic: ay.surahArabic,
          ayahs: [ay],
        });
      } else {
        lastBlock.ayahs.push(ay);
      }
    }
    return blocks;
  }, [currentPageAyahs]);

  const mushafSheetNode = (
    <div
      key={clampedPage}
      onTouchStart={(e) => {
        setTouchStartX(e.touches[0]?.clientX ?? null);
      }}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX;
        const diff = endX - touchStartX;
        setTouchStartX(null);
        if (Math.abs(diff) > 65) {
          if (diff > 0) stepPage(1);
          else stepPage(-1);
        }
      }}
      className={`relative w-full max-w-3xl mx-auto flex flex-col justify-between rounded-2xl sm:rounded-3xl p-3.5 sm:p-8 select-text transition-colors ${
        isOpeningPage ? "min-h-[380px] sm:min-h-[520px]" : "min-h-[420px] sm:min-h-[650px]"
      }`}
      style={{
        backgroundColor: isCreamPaper ? "#FFFDF7" : "var(--bg-surface)",
        color: isCreamPaper ? "#1E160B" : "var(--text-primary)",
        border: isCreamPaper
          ? "2px solid #D4AF37"
          : "1.5px solid color-mix(in srgb, var(--accent-primary) 42%, var(--border-hairline))",
        boxShadow: isCreamPaper
          ? "0 20px 50px -12px rgba(0, 0, 0, 0.45), inset 0 0 36px rgba(212, 175, 55, 0.12)"
          : "0 18px 42px -10px rgba(4, 12, 35, 0.55)",
      }}
    >
      {/* Classical Double-Line Mushaf Inner Frame */}
      <div
        className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-2xl"
        style={{
          border: isCreamPaper
            ? "1px solid rgba(180, 134, 24, 0.45)"
            : "1px solid color-mix(in srgb, var(--accent-primary) 24%, var(--border-hairline))",
        }}
      />

      {/* Top Running Mushaf Header */}
      <header
        dir="rtl"
        className="relative z-10 flex items-center justify-between gap-2 pb-2.5 mb-3 border-b text-xs"
        style={{
          borderColor: isCreamPaper ? "rgba(180, 134, 24, 0.25)" : "var(--border-hairline)",
        }}
      >
        <div
          className="flex items-center gap-1.5 font-semibold"
          style={{ color: isCreamPaper ? "#8B5E0B" : "var(--accent-primary)" }}
        >
          <span className="font-arabic text-base sm:text-lg">الجزء {toArabicIndicDigits(pageJuzNum)}</span>
          {pageJuzMeta && <span className="font-arabic text-xs sm:text-sm opacity-80">({pageJuzMeta.arabicTitle})</span>}
        </div>

        <div
          className="flex items-center gap-2 text-[11px] font-semibold"
          style={{ color: isCreamPaper ? "#785A28" : "var(--text-muted)" }}
        >
          <span>
            {ui.hizb} {pageHizbNum}
          </span>
          {pageHasSajda && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{
                backgroundColor: isCreamPaper ? "rgba(180, 134, 24, 0.15)" : "var(--gold-soft)",
                color: isCreamPaper ? "#8B5E0B" : "var(--accent-gold)",
              }}
            >
              ۩ {ui.wajibSajda}
            </span>
          )}
        </div>

        <div
          className="flex items-center gap-1.5 font-semibold"
          style={{ color: isCreamPaper ? "#8B5E0B" : "var(--accent-primary)" }}
        >
          <span className="font-arabic text-base sm:text-lg">{firstPageAyah?.surahArabic}</span>
          <span className="hidden sm:inline text-[11px] opacity-80">({firstPageAyah?.surahName})</span>
        </div>
      </header>

      {/* Mushaf Page Body */}
      <div
        className={`relative z-10 flex-1 flex flex-col ${
          isOpeningPage ? "justify-center py-4" : "justify-start"
        } space-y-4`}
      >
        {pageSurahBlocks.map((block) => {
          const startsOnThisPage = block.ayahs[0]?.ayahNum === 1;
          const showBismillahBanner = startsOnThisPage && block.surahNum !== 1 && block.surahNum !== 9;
          const surahInfo = SURAH_LIST.find((s) => s.number === block.surahNum);

          return (
            <div key={`${clampedPage}-surah-${block.surahNum}`} className="space-y-3">
              {startsOnThisPage && (
                <div
                  className={
                    isCreamPaper
                      ? "relative my-2 p-4 sm:p-5 text-center rounded-2xl border-2"
                      : "quran-gradient-card relative my-2 p-4 sm:p-5 text-center overflow-hidden"
                  }
                  style={
                    isCreamPaper
                      ? {
                          backgroundColor: "#FAF3E0",
                          borderColor: "#C59B27",
                          color: "#2C1D06",
                        }
                      : undefined
                  }
                >
                  <div className="relative z-10 space-y-1">
                    <h2 className="text-lg sm:text-xl font-bold tracking-tight">
                      {block.surahName} • <span className="font-arabic">{block.surahArabic}</span>
                    </h2>
                    <p className="text-xs opacity-85">{surahInfo?.englishNameTranslation}</p>
                    <div
                      className="w-36 h-px mx-auto my-2"
                      style={{ backgroundColor: isCreamPaper ? "rgba(180,134,24,0.35)" : "rgba(255,255,255,0.35)" }}
                    />
                    <p className="text-[11px] font-semibold uppercase tracking-widest opacity-90">
                      {surahInfo ? tp(lang, surahInfo.revelationType) : ""} • {surahInfo?.numberOfAyahs} {t(lang, "versesLabel")}
                    </p>
                    {showBismillahBanner && (
                      <p dir="rtl" className="font-arabic text-2xl sm:text-3xl pt-2">
                        {BISMILLAH_TEXT}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Continuous Mushaf Arabic Lines */}
              <div
                dir="rtl"
                className={`font-arabic text-right ${
                  isOpeningPage
                    ? "text-center text-2xl sm:text-4xl leading-[2.4] px-2 sm:px-6"
                    : "text-xl sm:text-[26px] md:text-[28px] leading-[2.3]"
                }`}
                style={{ textAlign: isOpeningPage ? "center" : "justify" }}
              >
                {block.ayahs.map((ayah) => {
                  const isPlaying = playingId === ayah.id;
                  const isSelected = selectedAyahId === ayah.id;

                  return (
                    <span
                      key={ayah.id}
                      id={`ayah-${ayah.id}`}
                      onClick={() => {
                        setSelectedAyahId(ayah.id);
                        setInspectorOpen(true);
                      }}
                      title={`${ayah.surahName} ${ayah.id}`}
                      className="inline rounded-lg px-1 py-0.5 cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isPlaying
                          ? isCreamPaper
                            ? "rgba(197, 155, 39, 0.25)"
                            : "color-mix(in srgb, var(--accent-primary) 24%, transparent)"
                          : isSelected
                          ? isCreamPaper
                            ? "rgba(197, 155, 39, 0.14)"
                            : "color-mix(in srgb, var(--accent-primary) 14%, transparent)"
                          : "transparent",
                      }}
                    >
                      <span>
                        {renderTajweedArabic(
                          scriptMode === "indopak" ? ayah.arabicIndoPak : ayah.arabicUthmani,
                          tajweedColor
                        )}
                      </span>

                      {ayah.hanafiSajda && (
                        <span
                          className="inline-block mx-1 px-1.5 py-0.5 rounded text-xs font-bold align-middle"
                          style={{
                            backgroundColor: isCreamPaper ? "rgba(180,134,24,0.18)" : "var(--gold-soft)",
                            color: isCreamPaper ? "#8B5E0B" : "var(--accent-gold)",
                          }}
                        >
                          ۩
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAyahId(ayah.id);
                          togglePlay(ayah);
                        }}
                        className="inline-flex items-center justify-center mx-1 px-1.5 py-0.5 rounded-full text-xs sm:text-sm font-bold align-middle cursor-pointer transition-transform active:scale-95"
                        style={{
                          color: isPlaying
                            ? "#ffffff"
                            : isCreamPaper
                            ? "#8B5E0B"
                            : "var(--accent-primary)",
                          backgroundImage: isPlaying ? "var(--gradient-brand)" : undefined,
                          backgroundColor: isPlaying
                            ? undefined
                            : isCreamPaper
                            ? "rgba(197, 155, 39, 0.14)"
                            : "var(--accent-soft)",
                          border: isCreamPaper
                            ? "1px solid rgba(197, 155, 39, 0.45)"
                            : "1px solid color-mix(in srgb, var(--accent-primary) 40%, transparent)",
                        }}
                        title={`${ui.listen} (${ayah.id})`}
                      >
                        <span>۝{toArabicIndicDigits(ayah.ayahNum)}</span>
                      </button>{" "}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Optional Kanzul Iman Page Tarjuma */}
        {showMushafTarjuma && currentPageAyahs.length > 0 && (
          <div
            className="mt-4 pt-3 border-t space-y-2"
            style={{ borderColor: isCreamPaper ? "rgba(180, 134, 24, 0.25)" : "var(--border-hairline)" }}
          >
            <div
              className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: isCreamPaper ? "#8B5E0B" : "var(--accent-primary)" }}
            >
              <span>{ui.pageTarjuma}</span>
              <span className="tabular-nums">
                {firstPageAyah?.id} – {lastPageAyah?.id}
              </span>
            </div>
            <div className="max-h-60 overflow-y-auto pe-1 space-y-2 text-xs">
              {currentPageAyahs.map((ay) => (
                <div
                  key={`tr-${ay.id}`}
                  onClick={() => {
                    setSelectedAyahId(ay.id);
                    setInspectorOpen(true);
                  }}
                  className="p-3 rounded-xl cursor-pointer transition-colors"
                  style={{
                    backgroundColor: isCreamPaper ? "rgba(197, 155, 39, 0.1)" : "var(--bg-muted)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2 mb-1">
                    <span
                      className="font-bold text-[11px]"
                      style={{ color: isCreamPaper ? "#8B5E0B" : "var(--accent-primary)" }}
                    >
                      {ay.surahName} {ay.id}
                    </span>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        togglePlay(ay);
                      }}
                      className="text-[11px] font-semibold underline cursor-pointer"
                    >
                      {playingId === ay.id ? ui.pause : ui.listen}
                    </button>
                  </div>
                  {renderAdaptiveTranslation(ay, true)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Mushaf Page Medallion & Prev/Next Turners */}
      <footer
        className="relative z-10 pt-3 mt-4 border-t flex items-center justify-between gap-2 text-xs"
        style={{ borderColor: isCreamPaper ? "rgba(180, 134, 24, 0.25)" : "var(--border-hairline)" }}
      >
        <button
          type="button"
          disabled={clampedPage >= TOTAL_MUSHAF_PAGES}
          onClick={() => stepPage(1)}
          className="btn-primary px-3.5 py-1.5 rounded-full font-semibold inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer min-h-[36px]"
        >
          <ChevronLeft className="w-4 h-4 rtl-mirror" />
          <span>{ui.nextPage}</span>
        </button>

        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold tabular-nums"
          style={{
            backgroundColor: isCreamPaper ? "rgba(197, 155, 39, 0.15)" : "var(--accent-soft)",
            color: isCreamPaper ? "#8B5E0B" : "var(--accent-primary)",
          }}
        >
          <span className="font-arabic text-base">{toArabicIndicDigits(clampedPage)}</span>
          <span className="text-[11px]">
            {t(lang, "pageLabel")} {clampedPage} / 604
          </span>
        </div>

        <button
          type="button"
          disabled={clampedPage <= 1}
          onClick={() => stepPage(-1)}
          className="px-3.5 py-1.5 rounded-full border font-semibold inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer min-h-[36px]"
          style={{
            borderColor: isCreamPaper ? "rgba(180, 134, 24, 0.35)" : "var(--border-hairline)",
          }}
        >
          <span>{ui.prevPage}</span>
          <ChevronRight className="w-4 h-4 rtl-mirror" />
        </button>
      </footer>
    </div>
  );

  return (
    <div className="space-y-5 pb-24 max-w-3xl mx-auto w-full">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onCanPlay={() => setAudioLoadingId(null)}
        onError={() => {
          setAudioLoadingId(null);
          if (playingId) {
            setAudioError(true);
            setPlayingId(null);
          }
        }}
      />

      {/* Editorial Segmented Pill Bar & Controls */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="pill-tab-bar" role="tablist" aria-label={t(lang, "navQuran")}>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "surah"}
              data-active={viewMode === "surah"}
              onClick={() => setViewMode("surah")}
              className="pill-tab-btn inline-flex items-center gap-1.5"
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>{ui.surahView}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "mushaf"}
              data-active={viewMode === "mushaf"}
              onClick={() => setViewMode("mushaf")}
              className="pill-tab-btn inline-flex items-center gap-1.5"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{ui.mushaf604}</span>
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewMode === "highlights"}
              data-active={viewMode === "highlights"}
              onClick={() => setViewMode("highlights")}
              className="pill-tab-btn inline-flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">{ui.highlights}</span>
            </button>
          </div>

          <div className="flex items-center gap-1.5 text-xs">
            {viewMode === "mushaf" && (
              <>
                <button
                  type="button"
                  onClick={() => setMushafPaper(mushafPaper === "night" ? "cream" : "night")}
                  className="px-3 py-1.5 rounded-full border font-semibold cursor-pointer transition-colors"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  {mushafPaper === "cream" ? ui.paperCream : ui.paperNight}
                </button>
                <button
                  type="button"
                  onClick={() => setShowMushafTarjuma(!showMushafTarjuma)}
                  className="px-3 py-1.5 rounded-full border font-semibold cursor-pointer transition-colors"
                  style={{
                    borderColor: showMushafTarjuma ? "var(--accent-primary)" : "var(--border-hairline)",
                    color: showMushafTarjuma ? "var(--accent-primary)" : "var(--text-muted)",
                    backgroundColor: "var(--bg-surface)",
                  }}
                >
                  {ui.translation}
                </button>
              </>
            )}

            <button
              type="button"
              onClick={() => setSajdaDrawerOpen(true)}
              className="px-3 py-1.5 rounded-full border font-semibold cursor-pointer tabular-nums"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}
            >
              ۩ {ui.sajdaCount} ({sajdaCompleted.length}/14)
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              aria-label={ui.settings}
              title={ui.settings}
              className="w-8 h-8 rounded-full border flex items-center justify-center cursor-pointer transition-colors"
              style={{
                borderColor: settingsOpen ? "var(--accent-primary)" : "var(--border-hairline)",
                backgroundColor: settingsOpen ? "var(--accent-soft)" : "var(--bg-surface)",
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Clean Surah + Para + Jump-to-Page Selector Row */}
        <div className="grid grid-cols-2 sm:grid-cols-12 gap-2">
          <select
            aria-label={t(lang, "tabSurah")}
            value={currentSurahMeta.number}
            onChange={(e) => {
              const sNum = Number(e.target.value);
              setSelectedSurah(sNum);
              setAyahFilter("");
              const meta = SURAH_LIST.find((s) => s.number === sNum);
              if (meta) {
                setCurrentPage(meta.startPage);
                setPageInput(String(meta.startPage));
                setSelectedAyahId(`${sNum}:1`);
              }
            }}
            className="ui-select col-span-2 sm:col-span-5 px-3.5 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}
          >
            {SURAH_LIST.map((s) => (
              <option key={s.number} value={s.number} className="text-black">
                {s.number}. {s.englishName} ({s.name})
              </option>
            ))}
          </select>

          <select
            aria-label={t(lang, "paraLabel")}
            value={currentJuzNum}
            onChange={(e) => {
              const jNum = Number(e.target.value);
              const juz = JUZ_LIST.find((j) => j.juz === jNum);
              if (juz) {
                setViewMode("mushaf");
                setCurrentPage(juz.startPage);
                setPageInput(String(juz.startPage));
                setSelectedSurah(juz.surahNum);
                setSelectedAyahId(`${juz.surahNum}:${juz.ayahNum}`);
              }
            }}
            className="ui-select col-span-1 sm:col-span-4 px-3.5 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}
          >
            {JUZ_LIST.map((j) => (
              <option key={j.juz} value={j.juz} className="text-black">
                {t(lang, "paraLabel")} {j.juz} — {j.arabicTitle}
              </option>
            ))}
          </select>

          <div
            className="col-span-1 sm:col-span-3 flex items-center justify-between px-2 py-1 rounded-xl border"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}
          >
            <button
              type="button"
              disabled={clampedPage <= 1}
              onClick={() => {
                setViewMode("mushaf");
                stepPage(-1);
              }}
              className="p-1 rounded-lg disabled:opacity-35 cursor-pointer"
              title={ui.prevPage}
            >
              <ChevronLeft className="w-4 h-4 rtl-mirror" />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const parsed = parseInt(pageInput, 10);
                if (Number.isFinite(parsed)) {
                  setViewMode("mushaf");
                  goToPage(parsed);
                }
              }}
              className="flex items-center gap-1"
            >
              <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {t(lang, "pageLabel")}
              </span>
              <input
                type="number"
                min={1}
                max={TOTAL_MUSHAF_PAGES}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={() => {
                  const parsed = parseInt(pageInput, 10);
                  if (Number.isFinite(parsed)) goToPage(parsed);
                }}
                className="w-11 text-center text-xs font-bold tabular-nums bg-transparent outline-none"
                aria-label={ui.jumpToPage}
              />
            </form>
            <button
              type="button"
              disabled={clampedPage >= TOTAL_MUSHAF_PAGES}
              onClick={() => {
                setViewMode("mushaf");
                stepPage(1);
              }}
              className="p-1 rounded-lg disabled:opacity-35 cursor-pointer"
              title={ui.nextPage}
            >
              <ChevronRight className="w-4 h-4 rtl-mirror" />
            </button>
          </div>
        </div>

        {/* Collapsible Reading & Audio Settings Drawer */}
        {settingsOpen && (
          <div className="bento-card p-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setScriptMode(scriptMode === "indopak" ? "uthmani" : "indopak")}
                className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                {ui.script}: {scriptMode === "indopak" ? ui.indoPak : ui.uthmani}
              </button>

              <button
                type="button"
                onClick={() => setTajweedColor(!tajweedColor)}
                className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                style={{
                  borderColor: tajweedColor ? "var(--accent-primary)" : "var(--border-hairline)",
                  backgroundColor: tajweedColor ? "var(--accent-soft)" : "transparent",
                }}
              >
                {ui.tajweed}: {tajweedColor ? ui.on : ui.off}
              </button>

              {primaryTranslationMode !== "ar" && primaryTranslationMode !== "ro_ur" && (
                <button
                  type="button"
                  onClick={() => setShowTranslit(!showTranslit)}
                  className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                  style={{
                    borderColor: showTranslit ? "var(--accent-primary)" : "var(--border-hairline)",
                    backgroundColor: showTranslit ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  {ui.transliteration}: {showTranslit ? ui.on : ui.off}
                </button>
              )}

              <button
                type="button"
                onClick={() => {
                  if (primaryTranslationMode === "ar") {
                    setArShowTranslation((v) => !v);
                  } else {
                    setShowSecondaryTrans((v) => !v);
                  }
                }}
                className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                style={{
                  borderColor:
                    (primaryTranslationMode === "ar" ? arShowTranslation : showSecondaryTrans)
                      ? "var(--accent-primary)"
                      : "var(--border-hairline)",
                  backgroundColor:
                    (primaryTranslationMode === "ar" ? arShowTranslation : showSecondaryTrans)
                      ? "var(--accent-soft)"
                      : "transparent",
                }}
              >
                {primaryTranslationMode === "ar"
                  ? arShowTranslation
                    ? ui.hideTranslation
                    : ui.showTranslation
                  : primaryTranslationMode === "ur"
                  ? ui.englishToggle
                  : ui.urduToggle}
              </button>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                {ui.audio}:
              </span>
              <button
                type="button"
                onClick={() => setPlaybackRate(playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 0.75 : 1)}
                className="px-2.5 py-1.5 rounded-xl border font-semibold tabular-nums cursor-pointer"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {playbackRate}x
              </button>
              <button
                type="button"
                onClick={() => setAutoAdvance(!autoAdvance)}
                className="px-2.5 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 cursor-pointer"
                style={{
                  borderColor: autoAdvance && !loopAyah ? "var(--accent-primary)" : "var(--border-hairline)",
                  color: autoAdvance && !loopAyah ? "var(--accent-primary)" : "var(--text-muted)",
                }}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>{ui.autoNext}</span>
              </button>
              <button
                type="button"
                onClick={() => setLoopAyah(!loopAyah)}
                className="px-2.5 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 cursor-pointer"
                style={{
                  borderColor: loopAyah ? "var(--accent-gold)" : "var(--border-hairline)",
                  color: loopAyah ? "var(--accent-gold)" : "var(--text-muted)",
                }}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>{ui.loop}</span>
              </button>
              <button
                type="button"
                onClick={cycleSleepTimer}
                className="px-2.5 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 cursor-pointer tabular-nums"
                style={{
                  borderColor: sleepSecondsLeft !== null ? "var(--accent-primary)" : "var(--border-hairline)",
                  color: sleepSecondsLeft !== null ? "var(--accent-primary)" : "var(--text-muted)",
                }}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{sleepSecondsLeft !== null ? formatSleep(sleepSecondsLeft) : ui.sleep}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {audioError && (
        <div
          className="p-3 rounded-xl border text-xs flex items-center justify-between gap-2"
          style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}
        >
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" style={{ color: "var(--accent-gold)" }} />
            <span>{ui.audioUnavailable}</span>
          </span>
          <button type="button" onClick={() => setAudioError(false)} className="underline cursor-pointer">
            {ui.dismiss}
          </button>
        </div>
      )}

      {loadingCorpus && (
        <div className="bento-card p-12 text-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin mx-auto" style={{ color: "var(--accent-primary)" }} />
          <p className="text-sm font-semibold">{ui.loadingQuran}</p>
        </div>
      )}

      {corpusError && !loadingCorpus && (
        <div className="bento-card p-6 text-xs" style={{ borderColor: "var(--accent-gold)" }}>
          {ui.corpusError}
        </div>
      )}

      {/* VIEW 1: 1-PAGE-PER-SCREEN MUSHAF */}
      {!loadingCorpus && viewMode === "mushaf" && mushafSheetNode}

      {/* VIEW 2 & 3: LUMINOUS SURAH HERO BANNER + EDITORIAL VERSE LIST (Image 1 & Image 2 Style) */}
      {!loadingCorpus && viewMode !== "mushaf" && (
        <div className="space-y-3.5 sm:space-y-6">
          {/* Luminous Brand Gradient Arch Banner Card */}
          <div className="quran-gradient-card relative py-4 px-4 sm:py-9 sm:px-8 text-center overflow-hidden">
            {/* Subtle Illuminated Mihrab Arch & Wave Contours */}
            <svg
              aria-hidden="true"
              viewBox="0 0 500 220"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-20"
            >
              <path
                d="M150 220 L150 92 Q250 12 350 92 L350 220 Z"
                fill="none"
                stroke="#FFFFFF"
                strokeWidth="1.5"
              />
              <path d="M0 168 Q150 128 310 172 T500 148 L500 220 L0 220 Z" fill="#FFFFFF" opacity="0.2" />
            </svg>

            {/* Open Mushaf on Rehal Watermark (Reference Image 1 Right Screen) */}
            <svg
              aria-hidden="true"
              viewBox="0 0 230 165"
              className="pointer-events-none absolute -end-6 -bottom-8 w-44 sm:w-64 h-36 sm:h-48 opacity-16"
            >
              <path d="M38 92 Q76 72 114 97 L114 48 Q76 28 38 46 Z" fill="#FFFFFF" />
              <path d="M190 92 Q152 72 114 97 L114 48 Q152 28 190 46 Z" fill="#FFFFFF" />
              <path d="M62 146 L160 100 L167 109 L69 155 Z" fill="#FFFFFF" />
              <path d="M160 146 L62 100 L55 109 L153 155 Z" fill="#FFFFFF" />
            </svg>

            <div className="relative z-10 space-y-1 sm:space-y-1.5">
              <div className="font-arabic text-base sm:text-xl text-white/85">{currentSurahMeta.name}</div>
              <h1 className="text-xl sm:text-3xl font-bold tracking-tight text-white">
                {currentSurahMeta.englishName}
              </h1>
              <p className="text-xs sm:text-sm text-white/90 font-medium">
                {tp(lang, currentSurahMeta.englishNameTranslation)}
              </p>

              <div className="w-36 sm:w-48 h-px bg-white/35 mx-auto my-2 sm:my-3.5" />

              <p className="text-[11px] sm:text-xs font-semibold uppercase tracking-widest text-white/90">
                {tp(lang, currentSurahMeta.revelationType)} • {currentSurahMeta.numberOfAyahs} {t(lang, "versesLabel")}
              </p>

              {(viewMode === "highlights" || selectedSurah !== 9) && (
                <p dir="rtl" className="font-arabic text-xl sm:text-4xl text-white pt-2 sm:pt-4">
                  {BISMILLAH_TEXT}
                </p>
              )}

              <div className="pt-2 sm:pt-3 flex items-center justify-center">
                <button
                  type="button"
                  onClick={handlePlaySurah}
                  className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 hover:bg-white/30 backdrop-blur-xs text-white text-xs font-semibold transition cursor-pointer"
                >
                  {playingId ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{playingId ? ui.pause : ui.playSurah}</span>
                </button>
              </div>
            </div>
          </div>

          {/* Search & Companion Translation Toggle Row */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute start-3.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={ayahFilter}
                onChange={(e) => setAyahFilter(e.target.value)}
                placeholder={ui.searchPlaceholder}
                className="w-full ps-9 pe-3.5 py-2 rounded-full border text-xs bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}
              />
            </div>

            {primaryTranslationMode === "ar" ? (
              <button
                type="button"
                onClick={() => setArShowTranslation((v) => !v)}
                className="px-3.5 py-2 rounded-full border text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                style={{
                  borderColor: arShowTranslation ? "var(--accent-primary)" : "var(--border-hairline)",
                  backgroundColor: arShowTranslation ? "var(--accent-soft)" : "var(--bg-surface)",
                  color: "var(--text-primary)",
                }}
              >
                {arShowTranslation ? ui.hideTranslation : ui.showTranslation}
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setShowSecondaryTrans((v) => !v)}
                className="px-3.5 py-2 rounded-full border text-xs font-semibold cursor-pointer shrink-0 transition-colors"
                style={{
                  borderColor: showSecondaryTrans ? "var(--accent-primary)" : "var(--border-hairline)",
                  backgroundColor: showSecondaryTrans ? "var(--accent-soft)" : "var(--bg-surface)",
                  color: "var(--text-primary)",
                }}
              >
                {primaryTranslationMode === "ur" ? ui.englishToggle : ui.urduToggle}
              </button>
            )}
          </div>

          {/* Clean Hairline-Divided Verse List (Exact Reference Image 1 Action Pill + Generous Calligraphy) */}
          <div className="divide-y" style={{ borderColor: "var(--border-hairline)" }}>
            {activeListAyahs.map((ayah) => {
              const isPlaying = playingId === ayah.id;
              const isAudioLoading = audioLoadingId === ayah.id;
              const isBookmarked = lastQuranRef === ayah.id;
              const isCopied = copiedId === ayah.id;
              const sajdaDone = sajdaCompleted.includes(ayah.id);
              const sajdaDeferred = sajdaQueue.includes(ayah.id);

              return (
                <article
                  key={ayah.id}
                  id={`ayah-${ayah.id}`}
                  className="py-5 space-y-5"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  {/* Verse Action Pill: Number Badge on Start, Share / Play / Copy / Bookmark Icons on End */}
                  <div className="verse-action-pill px-3.5 py-2.5 flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <span
                        className="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold text-white tabular-nums shrink-0"
                        style={{ backgroundImage: "var(--gradient-brand)" }}
                      >
                        {ayah.ayahNum}
                      </span>
                      {viewMode === "highlights" && (
                        <span className="text-xs font-semibold truncate" style={{ color: "var(--text-muted)" }}>
                          {ayah.surahName} ({ayah.id})
                        </span>
                      )}
                      {ayah.hanafiSajda && (
                        <span
                          className="px-2.5 py-0.5 rounded-full text-[10px] font-bold shrink-0"
                          style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                        >
                          ۩ {ui.wajibSajda}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2.5 shrink-0" style={{ color: "var(--accent-primary)" }}>
                      <button
                        type="button"
                        onClick={() => handleShareAyah(ayah)}
                        className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer transition-opacity"
                        title={ui.share}
                        aria-label={ui.share}
                      >
                        <Share2 className="w-[17px] h-[17px]" />
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePlay(ayah)}
                        className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer transition-opacity"
                        title={isPlaying ? ui.pause : ui.listen}
                        aria-label={isPlaying ? ui.pause : ui.listen}
                      >
                        {isAudioLoading ? (
                          <Loader2 className="w-[17px] h-[17px] animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="w-[17px] h-[17px]" />
                        ) : (
                          <Play className="w-[17px] h-[17px]" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => handleCopyAyah(ayah)}
                        className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer transition-opacity"
                        title={isCopied ? ui.copied : ui.copy}
                        aria-label={isCopied ? ui.copied : ui.copy}
                      >
                        {isCopied ? (
                          <Check className="w-[17px] h-[17px]" style={{ color: "var(--accent-gold)" }} />
                        ) : (
                          <Copy className="w-[17px] h-[17px]" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => logQuranAyah(ayah.id)}
                        className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer transition-opacity"
                        style={{ color: isBookmarked ? "var(--accent-gold)" : "var(--accent-primary)" }}
                        title={ui.bookmark}
                        aria-label={ui.bookmark}
                      >
                        <Bookmark className="w-[17px] h-[17px]" fill={isBookmarked ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Generous Right-Aligned Calligraphic Arabic Text */}
                  <p dir="rtl" className="font-arabic text-2xl sm:text-[30px] text-right leading-[2.35] px-1">
                    {renderTajweedArabic(
                      scriptMode === "indopak" ? ayah.arabicIndoPak : ayah.arabicUthmani,
                      tajweedColor
                    )}
                  </p>

                  {/* Auto-Adapted Translation & Transliteration Block */}
                  <div className="px-1">{renderAdaptiveTranslation(ayah)}</div>

                  {ayah.hanafiSajda && (
                    <div
                      className="p-3.5 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs"
                      style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}
                    >
                      <span>
                        {sajdaDone
                          ? ui.sajdaDoneBanner
                          : sajdaDeferred
                          ? ui.sajdaDeferredBanner
                          : ui.sajdaPromptBanner}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => logSajda(ayah.id, "now")}
                          className="btn-primary px-3 py-1.5 rounded-lg font-semibold cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{sajdaDone ? ui.sajdaCompleted : ui.markDone}</span>
                        </button>
                        {!sajdaDone && (
                          <button
                            type="button"
                            onClick={() => logSajda(ayah.id, "defer")}
                            className="px-3 py-1.5 rounded-lg border font-semibold cursor-pointer inline-flex items-center gap-1.5"
                            style={{ borderColor: "var(--border-hairline)" }}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>{ui.deferSajda}</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {ayah.khazainUlIrfanNote && (
                    <div className="px-1">
                      <button
                        type="button"
                        onClick={() => setOpenTafsirId(openTafsirId === ayah.id ? null : ayah.id)}
                        className="text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        <span>{openTafsirId === ayah.id ? ui.hideTafsir : ui.tafsirNote}</span>
                        <ChevronDown
                          className={`w-3.5 h-3.5 transition-transform ${
                            openTafsirId === ayah.id ? "rotate-180" : ""
                          }`}
                        />
                      </button>
                      {openTafsirId === ayah.id && (
                        <div
                          className="mt-2 p-3.5 rounded-xl text-xs leading-relaxed"
                          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-muted)" }}
                        >
                          {ayah.khazainUlIrfanNote}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Brand Gradient Audio Player Pill (Reference Image 2 Bottom Bar) */}
      {!loadingCorpus && inspectedAyah && (
        <div className="fixed bottom-16 sm:bottom-4 inset-x-3 z-30 pointer-events-none flex justify-center">
          <div className="pointer-events-auto quran-gradient-card w-full max-w-xl px-5 py-3 rounded-full flex items-center justify-between gap-3 shadow-2xl">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-bold uppercase tracking-wide text-white truncate">
                {currentSurahMeta.englishName}
              </div>
              <button
                type="button"
                onClick={() => {
                  if (nextSurahMeta) {
                    setSelectedSurah(nextSurahMeta.number);
                    goToPage(nextSurahMeta.startPage);
                  }
                }}
                className="text-[11px] text-white/90 inline-flex items-center gap-1 hover:underline cursor-pointer truncate"
              >
                <span>
                  {nextSurahMeta
                    ? `${ui.nextSurah}: ${nextSurahMeta.englishName}`
                    : `${t(lang, "ayahNo")} ${inspectedAyah.id}`}
                </span>
                <ArrowRight className="w-3 h-3 rtl-mirror" />
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => stepAudioVerse(-1)}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                aria-label={tp(lang, "Previous")}
              >
                <SkipBack className="w-4 h-4 rtl-mirror" />
              </button>
              <button
                type="button"
                onClick={() => togglePlay(inspectedAyah)}
                className="w-9 h-9 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold cursor-pointer shadow-md transition-transform active:scale-95"
                aria-label={playingId ? ui.pause : ui.listen}
              >
                {audioLoadingId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : playingId ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ms-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => stepAudioVerse(1)}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                aria-label={tp(lang, "Next")}
              >
                <SkipForward className="w-4 h-4 rtl-mirror" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Verse Kanzul Iman Modal (When Tapping a Verse in 1-Page Mushaf Mode) */}
      {inspectorOpen && inspectedAyah && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={() => setInspectorOpen(false)}
        >
          <div
            className="bento-card w-full max-w-xl p-5 space-y-4 max-h-[85dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {t(lang, "pageLabel")} {inspectedAyah.page} • {t(lang, "paraLabel")} {inspectedAyah.juz}
                </div>
                <h2 className="text-base font-bold">
                  {inspectedAyah.surahName} ({inspectedAyah.id})
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleCopyAyah(inspectedAyah)}
                  className="p-2 rounded-xl border cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                  title={copiedId === inspectedAyah.id ? ui.copied : ui.copy}
                >
                  {copiedId === inspectedAyah.id ? (
                    <Check className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
                <button
                  type="button"
                  onClick={() => logQuranAyah(inspectedAyah.id)}
                  className="p-2 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: lastQuranRef === inspectedAyah.id ? "var(--accent-gold)" : "var(--border-hairline)",
                    color: lastQuranRef === inspectedAyah.id ? "var(--accent-gold)" : "var(--text-muted)",
                  }}
                  title={ui.bookmark}
                >
                  <Bookmark className="w-4 h-4" fill={lastQuranRef === inspectedAyah.id ? "currentColor" : "none"} />
                </button>
                <button
                  type="button"
                  onClick={() => togglePlay(inspectedAyah)}
                  className="btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {playingId === inspectedAyah.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{playingId === inspectedAyah.id ? ui.pause : ui.listen}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorOpen(false)}
                  className="p-2 rounded-xl border cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                  aria-label={tp(lang, "Close")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p
              dir="rtl"
              className="font-arabic text-2xl text-right leading-[2.2] p-4 rounded-xl"
              style={{ backgroundColor: "var(--bg-muted)" }}
            >
              {inspectedAyah.arabicUthmani}{" "}
              <span style={{ color: "var(--accent-primary)" }}>۝{toArabicIndicDigits(inspectedAyah.ayahNum)}</span>
            </p>

            <div className="space-y-3 text-xs">
              {primaryTranslationMode === "ur" ? (
                <>
                  <div>
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {ui.kanzulImanUr}
                    </div>
                    <p dir="rtl" className="font-urdu text-right text-base sm:text-lg leading-[2.2]">
                      {inspectedAyah.kanzulImanUrdu}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: "var(--accent-secondary)" }}
                    >
                      {ui.kanzulImanEn}
                    </div>
                    <p dir="ltr" className="text-sm leading-relaxed text-left" style={{ color: "var(--text-muted)" }}>
                      {inspectedAyah.kanzulImanEnglish}
                    </p>
                  </div>
                </>
              ) : (
                <>
                  {inspectedAyah.kanzulImanHindi && primaryTranslationMode === "hi" && (
                    <div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-wider mb-1"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        {ui.kanzulImanHi}
                      </div>
                      <p className="font-hindi text-sm sm:text-base leading-relaxed">
                        {inspectedAyah.kanzulImanHindi}
                      </p>
                    </div>
                  )}
                  {inspectedAyah.kanzulImanRomanUrdu && primaryTranslationMode === "ro_ur" && (
                    <div>
                      <div
                        className="text-[10px] font-bold uppercase tracking-wider mb-1"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        {ui.kanzulImanRoUr}
                      </div>
                      <p className="text-sm font-medium leading-relaxed">{inspectedAyah.kanzulImanRomanUrdu}</p>
                    </div>
                  )}
                  <div>
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: "var(--accent-secondary)" }}
                    >
                      {ui.kanzulImanEn}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {inspectedAyah.kanzulImanEnglish}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                    <div
                      className="text-[10px] font-bold uppercase tracking-wider mb-1"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {ui.kanzulImanUr}
                    </div>
                    <p dir="rtl" className="font-urdu text-right text-base sm:text-lg leading-[2.2]">
                      {inspectedAyah.kanzulImanUrdu}
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 14 Hanafi Sajdas Modal Drawer */}
      {sajdaDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={() => setSajdaDrawerOpen(false)}
        >
          <div
            className="bento-card w-full max-w-lg p-5 space-y-4 max-h-[85dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {tp(lang, "Hanafi Fiqh")}
                </span>
                <h2 className="text-base font-bold">
                  {ui.sajdaDrawerTitle} ({sajdaCompleted.length}/14)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSajdaDrawerOpen(false)}
                className="p-2 rounded-xl border cursor-pointer"
                style={{ borderColor: "var(--border-hairline)" }}
                aria-label={tp(lang, "Close")}
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sajdaQueue.length > 0 && (
              <div
                className="p-3 rounded-xl border space-y-2 text-xs"
                style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}
              >
                <div className="font-bold">
                  {ui.deferredQueue} ({sajdaQueue.length})
                </div>
                {sajdaQueue.map((ref) => (
                  <div key={ref} className="flex items-center justify-between">
                    <button
                      type="button"
                      onClick={() => jumpToRef(ref)}
                      className="underline font-semibold cursor-pointer"
                    >
                      ۩ {t(lang, "ayahNo")} {ref}
                    </button>
                    <button
                      type="button"
                      onClick={() => logSajda(ref, "now")}
                      className="btn-primary px-2.5 py-1 rounded-lg font-semibold cursor-pointer inline-flex items-center gap-1"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      <span>{ui.markDone}</span>
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {HANAFI_SAJDA_ITEMS.map((s) => {
                const done = sajdaCompleted.includes(s.ref);
                return (
                  <div
                    key={s.ref}
                    className="p-3 rounded-xl border flex items-center justify-between gap-2"
                    style={{
                      borderColor: done ? "var(--accent-primary)" : "var(--border-hairline)",
                      backgroundColor: done ? "var(--accent-soft)" : "var(--bg-muted)",
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => jumpToRef(s.ref)}
                      className="text-start font-semibold hover:underline cursor-pointer"
                    >
                      <div>۩ {s.label}</div>
                      <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                        {t(lang, "pageLabel")} {s.page}
                      </div>
                    </button>
                    <button
                      type="button"
                      onClick={() => logSajda(s.ref, "now")}
                      className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer inline-flex items-center gap-1"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {done && <CheckCircle2 className="w-3 h-3" style={{ color: "var(--accent-primary)" }} />}
                      <span>{done ? ui.done : ui.logAction}</span>
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default function QuranPage() {
  return (
    <Suspense
      fallback={
        <div className="bento-card p-12 text-center max-w-3xl mx-auto">
          <Loader2 className="w-7 h-7 animate-spin mx-auto" style={{ color: "var(--accent-primary)" }} />
        </div>
      }
    >
      <QuranReaderContent />
    </Suspense>
  );
}
