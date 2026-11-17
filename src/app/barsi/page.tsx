"use client";

import React, {
  Suspense,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  BookOpen,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Compass,
  Copy,
  Edit3,
  ExternalLink,
  Filter,
  Globe,
  Heart,
  HeartHandshake,
  Lock,
  MapPin,
  Moon,
  Search,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  UserRound,
  Users,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import {
  BarsiIsalGiftLog,
  BarsiRecord,
  hasPermission,
} from "@/lib/backend-types";
import { HIJRI_MONTHS } from "@/lib/hijri";
import { formatLocalizedHijriMonth, LangCode, t, tp } from "@/lib/i18n";
import { JUZ_LIST, toArabicIndicDigits } from "@/data/quran";
import { TASBIH_LITANIES } from "@/data/fiqh-hadith";
import { assetUrl } from "@/lib/assets";

type BarsiTabId = "sanctuary" | "khatm" | "fatiha" | "calendar";
type VisibilityFilter = "all" | "private" | "community";
type ParaFilterMode = "all" | "available" | "completed";

function tl(lang: LangCode, key: string, fallback: string): string {
  const val = t(lang, key);
  if (lang !== "en" && val === t("en", key)) {
    return fallback;
  }
  return val;
}

interface BarsiUiCopy {
  subtitle: string;
  tabSanctuary: string;
  tabKhatm: string;
  tabMethod: string;
  tabCalendar: string;
  addLovedOne: string;
  filterAll: string;
  filterFamily: string;
  filterCommunity: string;
  allHijriMonths: string;
  sendFatihaGift: string;
  dedicating: string;
  khatmProgress: string;
  claimCompletePara: string;
  recitedBy: string;
  recentGifts: string;
  openProfile: string;
  upcomingBarsi: string;
  todayBarsi: string;
  todaysGifts: string;
  totalHadiyah: string;
  profilesHeading: string;
  readInMushaf: string;
  completeFatiha: string;
  reciteSalam: string;
  noorAccepted: string;
  currentMonth: string;
  noBarsisInMonth: string;
  saveChanges: string;
}

const BARSI_UI: Record<LangCode, BarsiUiCopy> = {
  en: {
    subtitle:
      "Preserve the blessed memory of departed parents, elders, and Mashaykh through annual Hijri Barsi reminders, 30-Para family Khatms, and authentic Sunni Hanafi Fatiha.",
    tabSanctuary: "Memorial Sanctuary",
    tabKhatm: "30-Para Khatm",
    tabMethod: "Tariqa-e-Fatiha",
    tabCalendar: "Barsi Calendar & Adab",
    addLovedOne: "+ Add Loved One",
    filterAll: "All",
    filterFamily: "My Family",
    filterCommunity: "Community",
    allHijriMonths: "All 12 Hijri Months",
    sendFatihaGift: "Send Fatiha Gift",
    dedicating: "Dedicating…",
    khatmProgress: "30-Para Khatm Progress",
    claimCompletePara: "Claim / Complete Para",
    recitedBy: "Recited by",
    recentGifts: "Recent Gifts",
    openProfile: "Open Memorial",
    upcomingBarsi: "Upcoming Barsi",
    todayBarsi: "Today • Yaum-e-Barsi",
    todaysGifts: "Today's Dedications",
    totalHadiyah: "Total Hadiyah Gifts",
    profilesHeading: "Memorial Directory",
    readInMushaf: "Read in Mushaf",
    completeFatiha: "Complete Fatiha & Dedicate Hadiyah",
    reciteSalam: "Mark Salam Recited",
    noorAccepted: "Hadiyah Dedicated In-Sha-Allah",
    currentMonth: "Current Month",
    noBarsisInMonth: "No memorials recorded in",
    saveChanges: "Save Changes",
  },
  ur: {
    subtitle:
      "مرحوم والدین، بزرگوں اور مشائخِ عظام کی سالانہ ہجری برسی، ۳۰ پارہ خاندانی ختمِ قرآن اور مستند سنی حنفی طریقۂ فاتحہ و ایصالِ ثواب۔",
    tabSanctuary: "یادگارِ مرحومین",
    tabKhatm: "۳۰ پارہ ختمِ قرآن",
    tabMethod: "طریقۂ فاتحہ",
    tabCalendar: "برسی تقویم و آداب",
    addLovedOne: "+ مرحوم شامل کریں",
    filterAll: "سب",
    filterFamily: "میرا خاندان",
    filterCommunity: "اجتماعی وقف",
    allHijriMonths: "تمام ۱۲ ہجری مہینے",
    sendFatihaGift: "ہدیۂ فاتحہ بھیجیں",
    dedicating: "ایصال ہو رہا ہے…",
    khatmProgress: "۳۰ پارہ ختمِ قرآن پیش رفت",
    claimCompletePara: "پارہ منتخب / مکمل کریں",
    recitedBy: "تلاوت کنندہ",
    recentGifts: "حالیہ ایصالِ ثواب ہدیے",
    openProfile: "تفصیل دیکھیں",
    upcomingBarsi: "قریب ترین برسی",
    todayBarsi: "آج یومِ برسی",
    todaysGifts: "آج کے ہدیے",
    totalHadiyah: "مجموعی ایصالِ ثواب",
    profilesHeading: "فہرستِ مرحومین",
    readInMushaf: "مصحف میں پڑھیں",
    completeFatiha: "فاتحہ مکمل کریں اور ہدیہ بخشیں",
    reciteSalam: "سلامِ قبرستان پڑھا",
    noorAccepted: "ہدیۂ نور بارگاہِ الٰہی میں پیش کر دیا گیا",
    currentMonth: "موجودہ مہینہ",
    noBarsisInMonth: "اس مہینے میں کوئی برسی درج نہیں",
    saveChanges: "تبدیلیاں محفوظ کریں",
  },
  ar: {
    subtitle:
      "إحياء ذكرى الوالدين والمشايخ والراحلين عبر تقويم البرسي الهجري وختمة القرآن الثلاثين جزءاً وطريقة الفاتحة وإيصال الثواب السنية الحنفية.",
    tabSanctuary: "واحة الراحلين",
    tabKhatm: "ختمة ٣٠ جزءاً",
    tabMethod: "طريقة الفاتحة",
    tabCalendar: "تقويم البرسي والآداب",
    addLovedOne: "+ إضافة راحل عزيز",
    filterAll: "الكل",
    filterFamily: "عائلتي",
    filterCommunity: "المجتمع",
    allHijriMonths: "جميع الأشهر الهجرية (١٢)",
    sendFatihaGift: "إهداء ثواب الفاتحة",
    dedicating: "جارٍ الإهداء…",
    khatmProgress: "تقدم ختمة ٣٠ جزءاً",
    claimCompletePara: "حجز / إتمام الجزء",
    recitedBy: "تلاوة",
    recentGifts: "الإهداءات الأخيرة",
    openProfile: "عرض السيرة",
    upcomingBarsi: "الذكرى السنوية القادمة",
    todayBarsi: "اليوم • ذكرى الوفاة",
    todaysGifts: "إهداءات اليوم",
    totalHadiyah: "مجموع الإهداءات",
    profilesHeading: "سجل الراحلين",
    readInMushaf: "القراءة في المصحف",
    completeFatiha: "إتمام الفاتحة وإهداء الثواب",
    reciteSalam: "تمت قراءة السلام",
    noorAccepted: "تقبّل الله هدية النور إن شاء الله",
    currentMonth: "الشهر الحالي",
    noBarsisInMonth: "لا توجد ذكرى مسجلة في",
    saveChanges: "حفظ التغييرات",
  },
  ro_ur: {
    subtitle:
      "Marhoom walidain, buzurgo aur Mashaykh ki salana Hijri Barsi, 30-Para khandani Khatm-e-Quran aur mustanad Sunni Hanafi Tariqa-e-Fatiha.",
    tabSanctuary: "Marhumeen گوشہ",
    tabKhatm: "30-Para Khatm",
    tabMethod: "Tariqa-e-Fatiha",
    tabCalendar: "Barsi Calendar aur Adab",
    addLovedOne: "+ Pyare Marhoom Shamil Karein",
    filterAll: "Sab",
    filterFamily: "Mera Khandan",
    filterCommunity: "Community",
    allHijriMonths: "Tamam 12 Hijri Mahine",
    sendFatihaGift: "Fatiha Hadiyah Bhejein",
    dedicating: "Hadiyah pesh ho raha hai…",
    khatmProgress: "30-Para Khatm Peshraft",
    claimCompletePara: "Para Chunein / Mukammal Karein",
    recitedBy: "Tilawat",
    recentGifts: "Haaliya Hadiye",
    openProfile: "Profile Kholein",
    upcomingBarsi: "Aane Wali Barsi",
    todayBarsi: "Aaj • Yaum-e-Barsi",
    todaysGifts: "Aaj Ke Hadiye",
    totalHadiyah: "Kul Hadiyah",
    profilesHeading: "Marhumeen Fehrist",
    readInMushaf: "Mushaf Mein Parhein",
    completeFatiha: "Fatiha Mukammal Aur Hadiyah Pesh Karein",
    reciteSalam: "Salam Parh Liya",
    noorAccepted: "Noor Hadiyah Qabool Ho In-Sha-Allah",
    currentMonth: "Maujooda Mahina",
    noBarsisInMonth: "Is mahine mein koi Barsi darj nahi",
    saveChanges: "Tabdeeliyan Mahfooz Karein",
  },
  hi: {
    subtitle:
      "दिवंगत माता-पिता, बुज़ुर्गों और मशाइख़ की वार्षिक हिजरी बरसी, ३०-पारा पारिवारिक ख़त्म-ए-क़ुरआन और प्रामाणिक सुन्नी हनफ़ी तरीक़ा-ए-फ़ातिहा।",
    tabSanctuary: "मरहूमीन स्मृति",
    tabKhatm: "३०-पारा ख़त्म",
    tabMethod: "तरीक़ा-ए-फ़ातिहा",
    tabCalendar: "बरसी कैलेंडर व आदाब",
    addLovedOne: "+ प्रिय मरहूम जोड़ें",
    filterAll: "सभी",
    filterFamily: "मेरा परिवार",
    filterCommunity: "समुदाय",
    allHijriMonths: "सभी १२ हिजरी महीने",
    sendFatihaGift: "फ़ातिहा हदिया भेजें",
    dedicating: "समर्पित हो रहा है…",
    khatmProgress: "३०-पारा ख़त्म प्रगति",
    claimCompletePara: "पारा चुनें / पूर्ण करें",
    recitedBy: "तिलावतकर्ता",
    recentGifts: "हालिया हदिया",
    openProfile: "विवरण खोलें",
    upcomingBarsi: "आगामी बरसी",
    todayBarsi: "आज • यौम-ए-बरसी",
    todaysGifts: "आज के हदिये",
    totalHadiyah: "कुल हदिया",
    profilesHeading: "मरहूमीन सूची",
    readInMushaf: "मुसहफ़ में पढ़ें",
    completeFatiha: "फ़ातिहा पूर्ण करें व हदिया भेजें",
    reciteSalam: "सलाम पढ़ा गया",
    noorAccepted: "इन-शा-अल्लाह नूर हदिया समर्पित",
    currentMonth: "वर्तमान महीना",
    noBarsisInMonth: "इस महीने कोई बरसी दर्ज नहीं",
    saveChanges: "परिवर्तन सहेजें",
  },
  tr: {
    subtitle:
      "Vefat eden anne-baba, büyükler ve meşâyihin yıllık Hicrî vefat yıldönümü, 30 Cüz aile hatmi ve sahih Sünnî Hanefî Fâtiha व İsal-i Sevab rehberi.",
    tabSanctuary: "Merhumlar Köşesi",
    tabKhatm: "30 Cüz Hatim",
    tabMethod: "Fâtiha Usûlü",
    tabCalendar: "Vefat Takvimi ve Âdâb",
    addLovedOne: "+ Merhum Ekle",
    filterAll: "Tümü",
    filterFamily: "Ailem",
    filterCommunity: "Topluluk",
    allHijriMonths: "Tüm 12 Hicrî Ay",
    sendFatihaGift: "Fâtiha Hediyesi Gönder",
    dedicating: "Bağışlanıyor…",
    khatmProgress: "30 Cüz Hatim İlerlemesi",
    claimCompletePara: "Cüz Al / Tamamla",
    recitedBy: "Okuyan",
    recentGifts: "Son Hediyeler",
    openProfile: "Kaydı Aç",
    upcomingBarsi: "Yaklaşan Yıldönümü",
    todayBarsi: "Bugün • Vefat Yıldönümü",
    todaysGifts: "Bugünkü Hediyeler",
    totalHadiyah: "Toplam Hediye",
    profilesHeading: "Merhumlar Rehberi",
    readInMushaf: "Mushaf'ta Oku",
    completeFatiha: "Fâtiha'yı Tamamla ve Bağışla",
    reciteSalam: "Selâm Okundu",
    noorAccepted: "Sevap Hediyesi İnşallah İletildi",
    currentMonth: "Bu Ay",
    noBarsisInMonth: "Bu ayda kayıtlı yıldönümü yok",
    saveChanges: "Değişiklikleri Kaydet",
  },
  bn: {
    subtitle:
      "প্রয়াত পিতা-মাতা, মুরুব্বি ও মাশায়েখদের বার্ষিক হিজরি বারসি, ৩০-পারা পারিবারিক খতমে কুরআন এবং সহীহ সুন্নি হানাফি ফাতিহা ও ঈসালে সওয়াব।",
    tabSanctuary: "মরহুমীন স্মৃতি",
    tabKhatm: "৩০-পারা খতম",
    tabMethod: "তরীকায়ে ফাতিহা",
    tabCalendar: "বারসি ক্যালেন্ডার ও আদব",
    addLovedOne: "+ প্রিয় মরহুম যোগ করুন",
    filterAll: "সব",
    filterFamily: "আমার পরিবার",
    filterCommunity: "কমিউনিটি",
    allHijriMonths: "সকল ১২ হিজরি মাস",
    sendFatihaGift: "ফাতিহা হাদিয়া পাঠান",
    dedicating: "নিবেদন করা হচ্ছে…",
    khatmProgress: "৩০-পারা খতম অগ্রগতি",
    claimCompletePara: "পারা নিন / সম্পন্ন করুন",
    recitedBy: "তিলাওয়াতকারী",
    recentGifts: "সাম্প্রতিক হাদিয়া",
    openProfile: "প্রোফাইল খুলুন",
    upcomingBarsi: "আসন্ন বারসি",
    todayBarsi: "আজ • ইয়াওমে বারসি",
    todaysGifts: "আজকের হাদিয়া",
    totalHadiyah: "মোট হাদিয়া",
    profilesHeading: "মরহুমীন তালিকা",
    readInMushaf: "মুসহাফে পড়ুন",
    completeFatiha: "ফাতিহা সম্পন্ন ও হাদিয়া নিবেদন করুন",
    reciteSalam: "সালাম পাঠ সম্পন্ন",
    noorAccepted: "হাদিয়া নিবেদিত হয়েছে ইনশাআল্লাহ",
    currentMonth: "চলতি মাস",
    noBarsisInMonth: "এই মাসে কোনো বারসি নথিভুক্ত নেই",
    saveChanges: "পরিবর্তন সংরক্ষণ করুন",
  },
  fa: {
    subtitle:
      "گرامی‌داشت یاد والدین، بزرگان و مشایخ درگذشته با یادآور سالانه قمری، ختم ۳۰ جزء قرآن خانوادگی و روش اصیل فاتحه‌خوانی و ایصال ثواب حنفی.",
    tabSanctuary: "یادمان درگذشتگان",
    tabKhatm: "ختم ۳۰ جزء",
    tabMethod: "طریقهٔ فاتحه",
    tabCalendar: "تقویم سالگرد و آداب",
    addLovedOne: "+ افزودن عزیز درگذشته",
    filterAll: "همه",
    filterFamily: "خانوادهٔ من",
    filterCommunity: "عمومی",
    allHijriMonths: "همهٔ ۱۲ ماه قمری",
    sendFatihaGift: "اهدای ثواب فاتحه",
    dedicating: "در حال اهدا…",
    khatmProgress: "پیشرفت ختم ۳۰ جزء",
    claimCompletePara: "انتخاب / تکمیل جزء",
    recitedBy: "تلاوت‌کننده",
    recentGifts: "هدایای اخیر",
    openProfile: "مشاهدهٔ یادمان",
    upcomingBarsi: "سالگرد پیشِ رو",
    todayBarsi: "امروز • سالگرد وفات",
    todaysGifts: "اهدائات امروز",
    totalHadiyah: "مجموع هدایا",
    profilesHeading: "فهرست درگذشتگان",
    readInMushaf: "مطالعه در مصحف",
    completeFatiha: "تکمیل فاتحه و اهدای ثواب",
    reciteSalam: "سلام قبرستان خوانده شد",
    noorAccepted: "هدیهٔ نور ان‌شاءالله تقدیم گردید",
    currentMonth: "ماه جاری",
    noBarsisInMonth: "سالگردی در این ماه ثبت نشده است",
    saveChanges: "ذخیرهٔ تغییرات",
  },
  id: {
    subtitle:
      "Merawat kenangan penuh berkah orang tua, sesepuh, dan Masyayikh wafat melalui pengingat Haul Hijriah tahunan, Khataman 30 Juz keluarga, serta tuntunan Fatihah Sunni Hanafi.",
    tabSanctuary: "Ruang Kenangan",
    tabKhatm: "Khatam 30 Juz",
    tabMethod: "Tata Cara Fatihah",
    tabCalendar: "Kalender Haul & Adab",
    addLovedOne: "+ Tambah Almarhum",
    filterAll: "Semua",
    filterFamily: "Keluarga Saya",
    filterCommunity: "Komunitas",
    allHijriMonths: "Semua 12 Bulan Hijriah",
    sendFatihaGift: "Kirim Hadiah Fatihah",
    dedicating: "Mengirim doa…",
    khatmProgress: "Progres Khatam 30 Juz",
    claimCompletePara: "Ambil / Selesaikan Juz",
    recitedBy: "Dibaca oleh",
    recentGifts: "Hadiah Doa Terbaru",
    openProfile: "Buka Profil",
    upcomingBarsi: "Haul Terdekat",
    todayBarsi: "Hari Ini • Haul",
    todaysGifts: "Hadiah Hari Ini",
    totalHadiyah: "Total Hadiah Doa",
    profilesHeading: "Daftar Almarhum",
    readInMushaf: "Baca di Mushaf",
    completeFatiha: "Selesaikan Fatihah & Kirim Pahala",
    reciteSalam: "Tandai Salam Dibaca",
    noorAccepted: "Hadiah Doa Terkirim InsyaAllah",
    currentMonth: "Bulan Ini",
    noBarsisInMonth: "Belum ada catatan Haul di bulan",
    saveChanges: "Simpan Perubahan",
  },
  fr: {
    subtitle:
      "Préservez la mémoire bénie des parents, aînés et maîtres disparus grâce au rappel annuel hégirien, au Khatm familial de 30 Juz et à la méthode authentique de la Fatiha sunnite hanafite.",
    tabSanctuary: "Sanctuaire Mémoriel",
    tabKhatm: "Khatm 30 Juz",
    tabMethod: "Méthode de la Fatiha",
    tabCalendar: "Calendrier & Adab",
    addLovedOne: "+ Ajouter un Proche",
    filterAll: "Tous",
    filterFamily: "Ma Famille",
    filterCommunity: "Communauté",
    allHijriMonths: "Les 12 Mois Hégiriens",
    sendFatihaGift: "Offrir une Fatiha",
    dedicating: "Dédicace en cours…",
    khatmProgress: "Progression du Khatm (30 Juz)",
    claimCompletePara: "Choisir / Compléter le Juz",
    recitedBy: "Récité par",
    recentGifts: "Dons Récents",
    openProfile: "Ouvrir le Mémorial",
    upcomingBarsi: "Prochaine Commémoration",
    todayBarsi: "Aujourd'hui • Commémoration",
    todaysGifts: "Dédicaces du Jour",
    totalHadiyah: "Total des Dédicaces",
    profilesHeading: "Répertoire Mémoriel",
    readInMushaf: "Lire dans le Mushaf",
    completeFatiha: "Compléter la Fatiha et Dédier",
    reciteSalam: "Salam Récité",
    noorAccepted: "Dédicace transmise In-Sha-Allah",
    currentMonth: "Mois Actuel",
    noBarsisInMonth: "Aucune commémoration enregistrée en",
    saveChanges: "Enregistrer les modifications",
  },
};

interface CompactAyah {
  n: number;
  t: string;
  u: string;
  e: string;
}

interface CompactSurah {
  n: number;
  ar: string;
  en: string;
  a: CompactAyah[];
}

interface NoorCelebration {
  id: number;
  giftLabel: string;
  recipientName: string;
}

interface BarsiFormDraft {
  id?: string;
  personName: string;
  urduName: string;
  relation: string;
  hijriMonth: number;
  hijriDay: number;
  hijriYear: string;
  gregorianDeathDate: string;
  qabrastanName: string;
  restingPlaceCity: string;
  favoriteWird: string;
  memoryNote: string;
  visibility: "private" | "community";
}

interface GiftOptionMeta {
  giftType: BarsiIsalGiftLog["giftType"];
  count: number;
  shortTitle: string;
  arabicSnippet: string;
  virtueNote: string;
  quickHref?: string;
  quickHrefLabel?: string;
  badgeText: string;
}

const GIFT_OPTIONS: GiftOptionMeta[] = [
  {
    giftType: "Surah Al-Fatihah",
    count: 1,
    shortTitle: "Surah Al-Fatihah",
    arabicSnippet: "ٱلْحَمْدُ لِلَّهِ رَبِّ ٱلْعَـٰلَمِينَ",
    virtueNote: "Umm al-Kitab — Comprehensive mercy & spiritual elevation",
    badgeText: "1x Opening",
  },
  {
    giftType: "Surah Al-Ikhlas (3x)",
    count: 3,
    shortTitle: "Surah Al-Ikhlas (3x)",
    arabicSnippet: "قُلْ هُوَ ٱللَّهُ أَحَدٌ ۝ ٱللَّهُ ٱلصَّمَدُ",
    virtueNote: "1/3rd Quran × 3 = Full Khatm-ul-Quran Sawab!",
    badgeText: "Full Quran Eq.",
  },
  {
    giftType: "Ayat-ul-Kursi",
    count: 1,
    shortTitle: "Ayat-ul-Kursi",
    arabicSnippet: "ٱللَّهُ لَآ إِلَـٰهَ إِلَّا هُوَ ٱلْحَىُّ ٱلْقَيُّومُ",
    virtueNote: "Surah Al-Baqarah 2:255 — Crown verse bringing Noor to graves",
    badgeText: "2:255 Noor",
  },
  {
    giftType: "Surah Yasin",
    count: 1,
    shortTitle: "Surah Yasin",
    arabicSnippet: "يسٓ ۝ وَٱلْقُرْءَانِ ٱلْحَكِيمِ",
    virtueNote: "Heart of the Quran — Eases hardship & illuminates Barzakh",
    quickHref: "/quran?surah=36&page=440",
    quickHrefLabel: "Read in Mushaf (p.440)",
    badgeText: "Qalb al-Quran",
  },
  {
    giftType: "Surah Al-Mulk",
    count: 1,
    shortTitle: "Surah Al-Mulk",
    arabicSnippet: "تَبَـٰرَكَ ٱلَّذِى بِيَدِهِ ٱلْمُلْكُ",
    virtueNote: "Al-Mani'ah — Intercedes & shields in the grave (Tirmidhi)",
    quickHref: "/quran?surah=67&page=562",
    quickHrefLabel: "Read in Mushaf (p.562)",
    badgeText: "30 Ayahs Shield",
  },
  {
    giftType: "Durood-e-Pak (100x)",
    count: 100,
    shortTitle: "Durood-e-Pak (100x)",
    arabicSnippet: "ٱللَّهُمَّ صَلِّ عَلَىٰ سَيِّدِنَا مُحَمَّدٍ وَآلِهِ وَسَلِّمْ",
    virtueNote: "100 Salawat — Envelops the Marhum's soul in Prophetic Rahmah",
    quickHref: "/tasbih",
    quickHrefLabel: "Open Tasbih Studio",
    badgeText: "100 Salawat",
  },
];

const RELATION_PRESETS = [
  "Beloved Father (Walid Marhum)",
  "Beloved Mother (Walida Marhuma)",
  "Paternal Grandfather (Dada Jan)",
  "Paternal Grandmother (Dadi Jan)",
  "Maternal Grandfather (Nana Jan)",
  "Maternal Grandmother (Nani Jan)",
  "Beloved Spouse",
  "Brother / Sister",
  "Shaykh / Spiritual Teacher",
  "Family Elder & Ancestors",
];

interface FatihaVerseQuery {
  surah: number;
  ayahs?: number[];
  heading: string;
}

interface FatihaGuideStep {
  stepNumber: number;
  id: string;
  title: string;
  urduTitle: string;
  repeatCount: number;
  fiqhNote: string;
  verseQueries?: FatihaVerseQuery[];
  staticArabic?: string;
  staticTranslit?: string;
  staticEnglish?: string;
  staticUrdu?: string;
}

const FATIHA_GUIDE_STEPS: FatihaGuideStep[] = [
  {
    stepNumber: 1,
    id: "step-durood",
    title: "Durood-e-Pak (3x)",
    urduTitle: "درودِ پاک (۳ مرتبہ)",
    repeatCount: 3,
    fiqhNote:
      "Every supplication and Isal-e-Sawab opens and closes with Salawat upon Sayyiduna RasoolAllah ﷺ so acceptance is guaranteed between two accepted prayers.",
  },
  {
    stepNumber: 2,
    id: "step-kafirun",
    title: "Surah Al-Kafirun (1x)",
    urduTitle: "سورۃ الکافرون (۱ مرتبہ)",
    repeatCount: 1,
    fiqhNote:
      "Recited with Bismillah in Ahkam-e-Shariat & Bahar-e-Shariat; equals one-fourth of the Quran in pure affirmation of Tawhid.",
    verseQueries: [{ surah: 109, heading: "Surah Al-Kafirun (109:1–6)" }],
  },
  {
    stepNumber: 3,
    id: "step-ikhlas",
    title: "Surah Al-Ikhlas (3x)",
    urduTitle: "سورۃ الاخلاص (۳ مرتبہ)",
    repeatCount: 3,
    fiqhNote:
      "Reciting Surah Al-Ikhlas thrice equals the reward of reciting the entire Holy Quran (Sahih Bukhari & Muslim), multiplying the Hadiyah immensely.",
    verseQueries: [{ surah: 112, heading: "Surah Al-Ikhlas (112:1–4) — Recite 3 Times" }],
  },
  {
    stepNumber: 4,
    id: "step-muawwidhatayn",
    title: "Surah Al-Falaq (1x) & Surah An-Nas (1x)",
    urduTitle: "سورۃ الفلق اور سورۃ الناس (۱-۱ مرتبہ)",
    repeatCount: 1,
    fiqhNote:
      "The two Surahs of Divine Refuge (Al-Mu'awwidhatayn), completing the Four Quls in the Masnoon Fatiha sequence.",
    verseQueries: [
      { surah: 113, heading: "Surah Al-Falaq (113:1–5)" },
      { surah: 114, heading: "Surah An-Nas (114:1–6)" },
    ],
  },
  {
    stepNumber: 5,
    id: "step-fatihah",
    title: "Surah Al-Fatihah (1x)",
    urduTitle: "سورۃ الفاتحہ (۱ مرتبہ)",
    repeatCount: 1,
    fiqhNote:
      "Umm al-Quran — the very heart from which 'Fatiha Khwani' takes its blessed name in Sunni tradition.",
    verseQueries: [{ surah: 1, heading: "Surah Al-Fatihah (1:1–7)" }],
  },
  {
    stepNumber: 6,
    id: "step-baqarah-opening",
    title: "Beginning of Surah Al-Baqarah (Alif-Lam-Mim... muflihun, 2:1–5)",
    urduTitle: "سورۃ البقرہ کی ابتدائی آیات (الم تا المفلحون، ۲:۱-۵)",
    repeatCount: 1,
    fiqhNote:
      "Following the Sunnah practice when completing a Khatm — joining Surah Al-Fatihah with the first five verses of Surah Al-Baqarah.",
    verseQueries: [
      {
        surah: 2,
        ayahs: [1, 2, 3, 4, 5],
        heading: "Surah Al-Baqarah (2:1–5)",
      },
    ],
  },
  {
    stepNumber: 7,
    id: "step-ayat-khamsah",
    title: "Ayat-e-Khamsah, Ayat-ul-Kursi & Seal Verses",
    urduTitle: "آیاتِ مبارکہ، آیت الکرسی اور خاتمۂ تلاوت",
    repeatCount: 1,
    fiqhNote:
      "Includes 2:163 (Wa ilahukum ilahun wahid...), Ayat-ul-Kursi (2:255), Khatam-un-Nabiyyin verse (33:40), and Tasbih & Salam (37:180–182) as taught by Ala Hazrat in Ahkam-e-Shariat.",
    verseQueries: [
      { surah: 2, ayahs: [163], heading: "Verse of Divine Unity (2:163)" },
      { surah: 2, ayahs: [255], heading: "Ayat-ul-Kursi (2:255)" },
      { surah: 33, ayahs: [40], heading: "Ma kana Muhammadun... (33:40)" },
      {
        surah: 37,
        ayahs: [180, 181, 182],
        heading: "Subhana Rabbika Rabbil-'Izzati... (37:180–182)",
      },
    ],
  },
  {
    stepNumber: 8,
    id: "step-bakhshish-dua",
    title: "Dua-e-Isal-e-Sawab (Bakhshish Dua)",
    urduTitle: "دعائے ایصالِ ثواب و بخشش",
    repeatCount: 1,
    fiqhNote:
      "Raise hands respectfully (chest-high, palms heavenward). Present the reward first as a humble Hadiyah to the Court of Sayyiduna RasoolAllah ﷺ, then through his blessed Wasilah to all Prophets, Sahabah, Ahl al-Bayt, Ghaus-e-Azam, Auliya Allah, and the named Marhum/Marhuma — each soul receives the full undiminished reward (Bahar-e-Shariat, Vol. 1).",
  },
];

const QABRASTAN_SALAM = {
  arabic:
    "السَّلَامُ عَلَيْكُمْ يَا أَهْلَ الدِّيَارِ مِنَ الْمُؤْمِنِينَ وَالْمُسْلِمِينَ، وَإِنَّا إِنْ شَاءَ اللّٰهُ بِكُمْ لَاحِقُونَ، يَرْحَمُ اللّٰهُ الْمُسْتَقْدِمِينَ مِنَّا وَالْمُسْتَأْخِرِينَ، نَسْأَلُ اللّٰهَ لَنَا وَلَكُمُ الْعَافِيَةَ، يَغْفِرُ اللّٰهُ لَنَا وَلَكُمْ",
  transliteration:
    "Assalamu 'alaykum ya ahlad-diyari minal-mu'minina wal-muslimin, wa inna in sha'Allahu bikum lahiqun. Yarhamullahul-mustaqdimina minna wal-musta'khirin, nas'alullaha lana wa lakumul-'afiyah, yaghfirullahu lana wa lakum.",
  english:
    "Peace be upon you, O dwellers of these abodes from among the believers and Muslims! Truly, Allah willing, we shall join you. May Allah have mercy upon those of us who went ahead and those who follow later. We ask Allah for well-being and pardon for ourselves and for you; may Allah forgive us and you.",
  urdu:
    "سلامتی ہو تم پر اے اس بستی (قبرستان) کے رہنے والے مومنو اور مسلمانو! اور بے شک ہم بھی ان شاء اللہ تم سے ملنے والے ہیں۔ اللہ رحم فرمائے ہم میں سے آگے جانے والوں پر اور پیچھے آنے والوں پر، ہم اللہ سے اپنے لیے اور تمہارے لیے عافیت و بخشش کا سوال کرتے ہیں۔",
  source: "Sahih Muslim #974–975; Sunan al-Tirmidhi #1053; Bahar-e-Shariat, Vol. 1, Part 4",
};

const ADAB_QABRASTAN_CARDS = [
  {
    id: "adab-waqt",
    badge: "Mustahabb Times",
    title: "Blessed Days for Ziyarat-e-Qubur",
    source: "Radd al-Muhtar & Bahar-e-Shariat (Vol. 1, Part 4)",
    points: [
      "Four days are specially recommended: Thursday (from Asr onward), Friday (the most virtuous day, especially before Jumu'ah), Saturday before sunrise, and Monday.",
      "Visiting graves on blessed nights & occasions — 15th Sha'ban (Shab-e-Barat), 10th Muharram, Eid-ul-Fitr, Eid-ul-Adha, and annual Barsi / Urs days — is established among the Salaf and Sunni scholars.",
      "Departed believers recognize visitors and rejoice at their Salam and Fatiha, particularly from Thursday afternoon until Saturday sunrise.",
    ],
  },
  {
    id: "adab-standing",
    badge: "Manner of Approach",
    title: "Entering & Standing with Adab (Payanti)",
    source: "Fatawa Alamgiri (Hindiyyah) & Fatawa Razawiyya, Vol. 9",
    points: [
      "Perform Wudu before entering the Qabrastan, remove footwear when walking near graves if the ground is clean and safe from thorns, and recite the Masnoon Salam.",
      "Approach the grave from the feet side (Payanti), standing facing the deceased's face with your back toward Qibla — approaching from the head side causes spiritual inconvenience to turning their gaze.",
      "After reciting Quran and gifting Isal-e-Sawab, turn toward the Qibla when raising hands for prolonged personal Dua to Allah Almighty.",
    ],
  },
  {
    id: "adab-tilawat",
    badge: "Masnoon Recitations",
    title: "What to Recite Beside the Grave",
    source: "Sharh al-Sudur (Imam Suyuti) & Radd al-Muhtar",
    points: [
      "Recite Surah Yasin: Hadith states Allah lightens hardship across the graves in proportion to those resting therein.",
      "Recite Surah Al-Ikhlas 11 times and gift its reward — narrated from Sayyiduna Ali (رضي الله عنه) with immense promised recompense equal to the number of departed believers.",
      "Recite Surah Al-Mulk, Surah At-Takathur, Surah Al-Fatihah, Opening & Closing of Surah Al-Baqarah, and abundant Durood-e-Pak.",
    ],
  },
  {
    id: "adab-prohibitions",
    badge: "Strict Precautions",
    title: "Respecting Sanctity & Avoiding Makruhat",
    source: "Sahih Muslim #971; Bahar-e-Shariat, Vol. 1",
    points: [
      "Never step upon, sit on, lean against, or sleep over a Muslim's grave — use established pathways; if no path exists, recite Istighfar and Fatiha gently.",
      "Placing fresh green twigs or fragrant rose petals (Gul-poshi) on a grave is Mustahabb following the Prophet's ﷺ Sunnah, as moist plants glorify Allah and bring solace.",
      "Refrain from loud wailing (Niyahah), worldly gossip, laughter, or ostentation; maintain humility, reflection on the Hereafter (Akhirah), and quiet remembrance.",
    ],
  },
];

const SACRED_ISAL_OCCASIONS: Record<number, { day: number; label: string }[]> = {
  1: [{ day: 10, label: "10 Muharram — Yaum-e-Ashura & Shuhada-e-Karbala Isal-e-Sawab" }],
  2: [{ day: 25, label: "25 Safar — Urs-e-Razavi & Collective Sunni Ulama Remembrance" }],
  3: [{ day: 12, label: "12 Rabi' al-Awwal — Eid Milad-un-Nabi ﷺ Mahfil-e-Noor" }],
  4: [{ day: 11, label: "11 Rabi' al-Thani — Bari Gyarhvi Sharif (Huzoor Ghaus-e-Azam)" }],
  7: [
    { day: 6, label: "6 Rajab — Chhati Sharif (Sultan-ul-Hind Khwaja Gharib Nawaz)" },
    { day: 22, label: "22 Rajab — Traditional Koonde / Niyaz of Sayyiduna Imam Ja'far as-Sadiq" },
  ],
  8: [{ day: 15, label: "15 Sha'ban — Shab-e-Barat Global Ziyarat-e-Qubur & Fatiha Night" }],
  9: [{ day: 27, label: "27 Ramadan — Laylatul Qadr Khatm-ul-Quran & Parents' Maghfirah" }],
  10: [{ day: 1, label: "1 Shawwal — Eid-ul-Fitr Morning Qabrastan Ziyarat" }],
  12: [{ day: 10, label: "10 Dhu al-Hijjah — Eid-ul-Adha Qurbani Isal-e-Sawab Share" }],
};

function hijriDaysUntil(
  currentMonth: number,
  currentDay: number,
  targetMonth: number,
  targetDay: number
): number {
  if (currentMonth === targetMonth && currentDay === targetDay) return 0;
  const toLinear = (m: number, d: number) => (m - 1) * 30 + d;
  const diff = (toLinear(targetMonth, targetDay) - toLinear(currentMonth, currentDay) + 360) % 360;
  return diff === 0 ? 360 : diff;
}

function formatGiftRelativeTime(isoString: string, nowDate: Date): string {
  const parsed = Date.parse(isoString);
  if (Number.isNaN(parsed)) return "Recently";
  const diffSec = Math.max(0, Math.floor((nowDate.getTime() - parsed) / 1000));
  if (diffSec < 45) return "Just now";
  if (diffSec < 3600) return `${Math.floor(diffSec / 60)}m ago`;
  if (diffSec < 86400) return `${Math.floor(diffSec / 3600)}h ago`;
  const days = Math.floor(diffSec / 86400);
  if (days < 30) return `${days}d ago`;
  return new Date(parsed).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function createEmptyDraft(defaultMonth: number, defaultDay: number, isSignedIn: boolean): BarsiFormDraft {
  return {
    personName: "",
    urduName: "",
    relation: RELATION_PRESETS[0],
    hijriMonth: defaultMonth,
    hijriDay: defaultDay,
    hijriYear: "",
    gregorianDeathDate: "",
    qabrastanName: "",
    restingPlaceCity: "",
    favoriteWird: "Surah Yasin, 3x Surah Al-Ikhlas & Durood-e-Pak",
    memoryNote: "",
    visibility: isSignedIn ? "private" : "private",
  };
}

function draftFromRecord(rec: BarsiRecord): BarsiFormDraft {
  return {
    id: rec.id,
    personName: rec.personName,
    urduName: rec.urduName || "",
    relation: rec.relation || RELATION_PRESETS[0],
    hijriMonth: rec.hijriMonth,
    hijriDay: rec.hijriDay,
    hijriYear: rec.hijriYear ? String(rec.hijriYear) : "",
    gregorianDeathDate: rec.gregorianDeathDate || "",
    qabrastanName: rec.qabrastanName || "",
    restingPlaceCity: rec.restingPlaceCity || "",
    favoriteWird: rec.favoriteWird || "Surah Yasin & Durood-e-Pak",
    memoryNote: rec.memoryNote || "",
    visibility: rec.visibility,
  };
}

function BarsiLoadingSkeleton() {
  return (
    <div className="space-y-6 animate-pulse" aria-busy="true" aria-label="Loading Barsi Sanctuary">
      <div className="bento-card h-56" style={{ opacity: 0.55 }} />
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[0, 1, 2, 3].map((i) => (
          <div key={i} className="bento-card h-24" style={{ opacity: 0.45 }} />
        ))}
      </div>
      <div className="grid lg:grid-cols-12 gap-5">
        <div className="lg:col-span-5 bento-card h-96" style={{ opacity: 0.4 }} />
        <div className="lg:col-span-7 bento-card h-96" style={{ opacity: 0.4 }} />
      </div>
    </div>
  );
}

function BarsiSanctuaryInner() {
  const searchParams = useSearchParams();
  const {
    backend,
    cmsUpsertBarsi,
    cmsLogBarsiGift,
    cmsToggleBarsiPara,
    cmsDeleteBarsi,
    hijri,
    authUser,
    user,
    awardXp,
    lang,
    now,
    barsiFatihaToday,
  } = useApp();

  const ui = BARSI_UI[lang] || BARSI_UI.en;
  const preferUrduFirst = lang === "ur" || lang === "fa";

  const [activeTab, setActiveTab] = useState<BarsiTabId>(() => {
    const raw = searchParams.get("tab");
    if (raw === "sanctuary" || raw === "khatm" || raw === "fatiha" || raw === "calendar") {
      return raw;
    }
    return "sanctuary";
  });

  const [selectedBarsiId, setSelectedBarsiId] = useState<string | null>(() =>
    searchParams.get("id")
  );
  const [visibilityFilter, setVisibilityFilter] = useState<VisibilityFilter>("all");
  const [monthFilter, setMonthFilter] = useState<number>(0); // 0 = All months
  const [searchQuery, setSearchQuery] = useState<string>("");

  // Donor & Reader inputs (null means track signed-in user's display name dynamically)
  const [customDonorName, setCustomDonorName] = useState<string | null>(null);
  const [customReaderName, setCustomReaderName] = useState<string | null>(null);

  // Khatm board state
  const [paraFilter, setParaFilter] = useState<ParaFilterMode>("all");
  const [togglingPara, setTogglingPara] = useState<number | null>(null);

  // Gift animation & action states
  const [sendingGiftType, setSendingGiftType] = useState<string | null>(null);
  const [noorCelebration, setNoorCelebration] = useState<NoorCelebration | null>(null);
  const celebrationTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Modal & delete confirmation states
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [formDraft, setFormDraft] = useState<BarsiFormDraft>(() =>
    createEmptyDraft(hijri.month, hijri.day, Boolean(authUser))
  );
  const [savingDraft, setSavingDraft] = useState<boolean>(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Tab 3: Mukammal Tariqa-e-Fatiha state + Quran dataset loader
  const [quranSurahs, setQuranSurahs] = useState<Map<number, CompactSurah> | null>(null);
  const [completedSteps, setCompletedSteps] = useState<Record<string, boolean>>({});
  const [stepBeadCounts, setStepBeadCounts] = useState<Record<string, number>>({});
  const [showUrduTranslation, setShowUrduTranslation] = useState<boolean>(true);
  const [showEnglishTranslation, setShowEnglishTranslation] = useState<boolean>(true);
  const [selectedDuroodId, setSelectedDuroodId] = useState<string>("durood-razawiyya");
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Tab 4: Calendar filter
  const [showEmptyMonths, setShowEmptyMonths] = useState<boolean>(true);

  useEffect(() => {
    return () => {
      if (celebrationTimerRef.current) {
        clearTimeout(celebrationTimerRef.current);
      }
    };
  }, []);

  // Load verified local Quran corpus for Tab 3 (Tariqa-e-Fatiha)
  useEffect(() => {
    if (activeTab !== "fatiha" || quranSurahs) return;
    let cancelled = false;
    fetch(assetUrl("/data/quran-complete.json"))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: { surahs: CompactSurah[] }) => {
        if (cancelled) return;
        const map = new Map<number, CompactSurah>();
        for (const s of json.surahs) {
          map.set(s.n, s);
        }
        setQuranSurahs(map);
      })
      .catch(() => {
        // Graceful fallback if offline before cache warm
      });
    return () => {
      cancelled = true;
    };
  }, [activeTab, quranSurahs]);

  const barsiRecords = backend.barsiRecords;

  const defaultActorName = authUser?.name || user?.name || "Devoted Believer";
  const effectiveDonorName = customDonorName !== null ? customDonorName : defaultActorName;
  const effectiveReaderName = customReaderName !== null ? customReaderName : defaultActorName;

  const canManageRecord = useCallback(
    (rec: BarsiRecord): boolean => {
      if (rec.ownerUserId === "guest_local") return true;
      if (authUser && rec.ownerUserId === authUser.id) return true;
      if (authUser && hasPermission(authUser.role, "barsi:moderate_community")) return true;
      return false;
    },
    [authUser]
  );

  // Aggregate Sanctuary Metrics & Upcoming Barsi Countdown
  const sanctuaryMetrics = useMemo(() => {
    let privateCount = 0;
    let communityCount = 0;
    let totalFatiha = 0;
    let totalYasin = 0;
    let totalDurood = 0;
    let totalParasCompleted = 0;
    let completedFullKhatms = 0;

    let nextBarsi: BarsiRecord | null = null;
    let minDays = Infinity;

    for (const b of barsiRecords) {
      if (b.visibility === "private") privateCount += 1;
      else communityCount += 1;

      totalFatiha += b.totalFatihaCount || 0;
      totalYasin += b.totalYasinCount || 0;
      totalDurood += b.totalDuroodCount || 0;

      const pCount = Object.keys(b.khatmParas || {}).length;
      totalParasCompleted += pCount;
      if (pCount >= 30) completedFullKhatms += 1;

      const dLeft = hijriDaysUntil(hijri.month, hijri.day, b.hijriMonth, b.hijriDay);
      if (dLeft < minDays) {
        minDays = dLeft;
        nextBarsi = b;
      }
    }

    return {
      totalProfiles: barsiRecords.length,
      privateCount,
      communityCount,
      totalFatiha,
      totalYasin,
      totalDurood,
      totalGiftsCombined: totalFatiha + totalYasin + totalDurood,
      totalParasCompleted,
      completedFullKhatms,
      nextBarsi,
      nextBarsiDaysLeft: nextBarsi ? minDays : null,
    };
  }, [barsiRecords, hijri.month, hijri.day]);

  // Filtered & sorted Barsi profiles (upcoming first)
  const filteredBarsis = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return barsiRecords
      .filter((b) => {
        if (visibilityFilter === "private" && b.visibility !== "private") return false;
        if (visibilityFilter === "community" && b.visibility !== "community") return false;
        if (monthFilter > 0 && b.hijriMonth !== monthFilter) return false;
        if (!q) return true;
        return (
          b.personName.toLowerCase().includes(q) ||
          (b.urduName && b.urduName.toLowerCase().includes(q)) ||
          b.relation.toLowerCase().includes(q) ||
          b.restingPlaceCity.toLowerCase().includes(q) ||
          b.qabrastanName.toLowerCase().includes(q) ||
          b.ownerName.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => {
        const da = hijriDaysUntil(hijri.month, hijri.day, a.hijriMonth, a.hijriDay);
        const db = hijriDaysUntil(hijri.month, hijri.day, b.hijriMonth, b.hijriDay);
        return da - db;
      });
  }, [barsiRecords, visibilityFilter, monthFilter, searchQuery, hijri.month, hijri.day]);

  const activeBarsi: BarsiRecord | null = useMemo(() => {
    if (selectedBarsiId) {
      const exact = barsiRecords.find((b) => b.id === selectedBarsiId);
      if (exact) return exact;
    }
    return filteredBarsis[0] ?? barsiRecords[0] ?? null;
  }, [selectedBarsiId, barsiRecords, filteredBarsis]);

  const triggerNoorBurst = useCallback((giftLabel: string, recipientName: string) => {
    const nextBurst: NoorCelebration = {
      id: Date.now(),
      giftLabel,
      recipientName,
    };
    setNoorCelebration(nextBurst);
    if (celebrationTimerRef.current) {
      clearTimeout(celebrationTimerRef.current);
    }
    celebrationTimerRef.current = setTimeout(() => {
      setNoorCelebration((curr) => (curr?.id === nextBurst.id ? null : curr));
    }, 4500);
  }, []);

  const handleSendGift = useCallback(
    async (targetBarsi: BarsiRecord, option: GiftOptionMeta) => {
      if (sendingGiftType) return;
      setSendingGiftType(option.giftType);
      try {
        await cmsLogBarsiGift({
          barsiId: targetBarsi.id,
          donorName: effectiveDonorName.trim() || "Devoted Believer",
          giftType: option.giftType,
          count: option.count,
        });
        triggerNoorBurst(option.shortTitle, targetBarsi.personName);
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Could not log Isal-e-Sawab gift.");
      } finally {
        setSendingGiftType(null);
      }
    },
    [cmsLogBarsiGift, effectiveDonorName, sendingGiftType, triggerNoorBurst]
  );

  const handleTogglePara = useCallback(
    async (paraNumber: number) => {
      if (!activeBarsi || togglingPara !== null) return;
      const wasCompleted = Boolean(activeBarsi.khatmParas?.[String(paraNumber)]);
      setTogglingPara(paraNumber);
      try {
        await cmsToggleBarsiPara({
          barsiId: activeBarsi.id,
          paraNumber,
          readerName: effectiveReaderName.trim() || "Family Reader",
        });
        if (!wasCompleted) {
          triggerNoorBurst(`Khatm-e-Quran Para ${paraNumber}`, activeBarsi.personName);
        }
      } catch (err) {
        setFormError(err instanceof Error ? err.message : "Could not update Khatm Para.");
      } finally {
        setTogglingPara(null);
      }
    },
    [activeBarsi, cmsToggleBarsiPara, effectiveReaderName, togglingPara, triggerNoorBurst]
  );

  const openCreateModal = useCallback(() => {
    setFormError(null);
    setFormDraft(createEmptyDraft(hijri.month, hijri.day, Boolean(authUser)));
    setModalOpen(true);
  }, [hijri.month, hijri.day, authUser]);

  const openEditModal = useCallback((rec: BarsiRecord) => {
    setFormError(null);
    setFormDraft(draftFromRecord(rec));
    setModalOpen(true);
  }, []);

  const handleSaveBarsiForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formDraft.personName.trim()) {
      setFormError("Please enter the beloved Marhum or Marhuma's name.");
      return;
    }
    setSavingDraft(true);
    setFormError(null);
    try {
      const parsedYear = formDraft.hijriYear.trim()
        ? parseInt(formDraft.hijriYear.trim(), 10)
        : undefined;
      await cmsUpsertBarsi({
        id: formDraft.id,
        personName: formDraft.personName.trim(),
        urduName: formDraft.urduName.trim() || formDraft.personName.trim(),
        relation: formDraft.relation.trim() || "Beloved Family Member",
        hijriMonth: Math.max(1, Math.min(12, Number(formDraft.hijriMonth) || 1)),
        hijriDay: Math.max(1, Math.min(30, Number(formDraft.hijriDay) || 1)),
        hijriYear: parsedYear && Number.isFinite(parsedYear) ? parsedYear : undefined,
        gregorianDeathDate: formDraft.gregorianDeathDate.trim() || undefined,
        qabrastanName: formDraft.qabrastanName.trim(),
        restingPlaceCity: formDraft.restingPlaceCity.trim(),
        favoriteWird: formDraft.favoriteWird.trim() || "Surah Yasin & Durood-e-Pak",
        memoryNote: formDraft.memoryNote.trim(),
        visibility: formDraft.visibility,
      });
      setModalOpen(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save Barsi record.");
    } finally {
      setSavingDraft(false);
    }
  };

  const handleConfirmDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await cmsDeleteBarsi(id);
      setConfirmDeleteId(null);
      if (selectedBarsiId === id) {
        setSelectedBarsiId(null);
      }
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Could not delete Barsi record.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleCopyText = useCallback((key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => null);
      setCopiedKey(key);
      setTimeout(() => {
        setCopiedKey((curr) => (curr === key ? null : curr));
      }, 2200);
    }
  }, []);

  // Khatm board derived stats for activeBarsi
  const activeKhatmStats = useMemo(() => {
    const parasMap = activeBarsi?.khatmParas || {};
    const completedCount = Object.keys(parasMap).length;
    const pct = Math.min(100, Math.round((completedCount / 30) * 100));
    const uniqueReaders = Array.from(new Set(Object.values(parasMap)));
    return {
      parasMap,
      completedCount,
      pct,
      uniqueReaders,
      isFullKhatm: completedCount >= 30,
    };
  }, [activeBarsi]);

  const visibleJuzList = useMemo(() => {
    return JUZ_LIST.filter((juz) => {
      const done = Boolean(activeKhatmStats.parasMap[String(juz.juz)]);
      if (paraFilter === "available") return !done;
      if (paraFilter === "completed") return done;
      return true;
    });
  }, [activeKhatmStats.parasMap, paraFilter]);

  // Selected Durood for Step 1 of Tariqa-e-Fatiha
  const duroodChoices = useMemo(
    () =>
      TASBIH_LITANIES.filter((l) =>
        ["durood-razawiyya", "durood-ibrahimi", "durood-ghausia"].includes(l.id)
      ),
    []
  );
  const activeDurood = useMemo(
    () => duroodChoices.find((d) => d.id === selectedDuroodId) || duroodChoices[0],
    [duroodChoices, selectedDuroodId]
  );

  // Personalized Bakhshish Dua incorporating activeBarsi
  const bakhshishDua = useMemo(() => {
    const enTarget = activeBarsi
      ? `${activeBarsi.personName} (${activeBarsi.relation})`
      : "our beloved parents, ancestors, and all departed believers";
    const urTarget = activeBarsi
      ? `${activeBarsi.urduName || activeBarsi.personName} (${activeBarsi.relation})`
      : "ہمارے والدین، اقرباء اور جملہ مرحومینِ اہلسنت";

    return {
      arabic:
        "اَللّٰهُمَّ أَوْصِلْ وَأَبْلِغْ مِثْلَ ثَوَابِ مَا قَرَأْنَاهُ مِنَ الْقُرْآنِ الْعَظِيمِ وَمَا صَلَّيْنَاهُ عَلَى النَّبِيِّ الْكَرِيمِ ﷺ هَدِيَّةً وَاصِلَةً وَرَحْمَةً نَازِلَةً وَبَرَكَةً شَامِلَةً إِلَىٰ حَضْرَةِ سَيِّدِنَا وَمَوْلَانَا مُحَمَّدٍ الْمُصْطَفَىٰ ﷺ، ثُمَّ إِلَىٰ أَرْوَاحِ جَمِيعِ الْأَنْبِيَاءِ وَالْمُرْسَلِينَ، وَالصَّحَابَةِ أَجْمَعِينَ، وَأَهْلِ الْبَيْتِ الطَّاهِرِينَ، وَالسَّادَاتِ الْأَئِمَّةِ الْمُجْتَهِدِينَ، وَحُضُورِ غَوْثِ الْأَعْظَمِ الشَّيْخِ عَبْدِ الْقَادِرِ الْجِيلَانِيِّ، وَسَائِرِ أَوْلِيَاءِ اللّٰهِ الصَّالِحِينَ، وَخُصُوصًا إِلَىٰ رُوحِ مَنْ اجْتَمَعْنَا لِأَجْلِهِ وَجَمِيعِ الْمُؤْمِنِينَ وَالْمُؤْمِنَاتِ. اَللّٰهُمَّ اغْفِرْ لَهُمْ وَارْحَمْهُمْ وَنَوِّرْ قُبُورَهُمْ وَاجْعَلِ الْجَنَّةَ مَأْوَاهُمْ بِرَحْمَتِكَ يَا أَرْحَمَ الرَّاحِمِينَ.",
      transliteration:
        "Allahumma awsil wa abligh mithla thawabi ma qara'nahu minal-Qur'anil-'Azim wa ma sallaynahu 'alan-Nabiyyil-Karim ﷺ hadiyyatan wasilatan wa rahmatan nazilatan wa barakatan shamilatan ila hadrati Sayyidina wa Mawlana Muhammadinil-Mustafa ﷺ, thumma ila arwahi jami'il-Anbiya'i wal-Mursalin, was-Sahabati ajma'in, wa Ahlil-Baytit-Tahirin, was-Sadatil-A'immatil-Mujtahidin, wa Huduri Ghawthil-A'zam ash-Shaykh 'Abdil-Qadir al-Jilani, wa sa'iri Awliya'illahis-Salihin, wa khususan ila ruhi man ijtama'na li-ajlihi wa jami'il-mu'minina wal-mu'minat. Allahummaghfir lahum warhamhum wa nawwir quburahum waj'alil-Jannata ma'wahum bi-rahmatika ya Arhamar-Rahimin.",
      english: `O Allah! Convey and bestow the full equivalent reward of the Noble Quran and blessed Salawat we have recited — as an accepted gift, descending mercy, and encompassing blessing — first to the exalted court of our Master Sayyiduna Muhammad al-Mustafa ﷺ; then through his blessed Wasilah to the pure souls of all Prophets and Messengers, all Noble Companions (Sahabah), the Pure Household (Ahl al-Bayt), the Mujtahid Imams (especially Imam-e-Azam Abu Hanifa), Huzoor Ghaus-e-Azam Shaykh Abdul Qadir Jilani, Khwaja Gharib Nawaz, Mujaddid Alf Thani, Ala Hazrat Imam Ahmad Raza Khan, and all Auliya Allah; and ESPECIALLY to the soul of ${enTarget}, along with all believing men and women from east to west. O Allah! Forgive them, shower mercy upon them, fill their resting places with celestial Noor, and make Jannat-ul-Firdaws their eternal abode. Amin bi-jahin-Nabiyyil-Amin ﷺ!`,
      urdu: `یا اللہ! ہم نے جو قرآنِ عظیم کی تلاوت کی اور حضور نبیِّ کریم ﷺ پر درود و سلام کا نذرانہ پیش کیا، ہماری تقصیرات کو معاف فرما کر اپنے فضل و کرم سے اس کا مکمل ثواب بطورِ ہدیہ سب سے پہلے سرکارِ دو عالم سیدنا محمد مصطفیٰ ﷺ کی بارگاہِ اقدس میں نذر پہنچا۔ پھر حضور ﷺ کے وسیلۂ جلیلہ سے جملہ انبیائے کرام، خلفائے راشدین، تمام صحابۂ کرام، اہلِ بیتِ اطہار، ائمۂ مجتہدین خصوصاً امامِ اعظم ابو حنیفہ، حضور سیدنا غوثِ اعظم شیخ عبدالقادر جیلانی، سلطان الہند خواجہ غریب نواز، مجدد الف ثانی، اعلیٰ حضرت امام احمد رضا خان اور جملہ اولیاء و علمائے اہلِ سنت کی ارواحِ طیبہ کو نذر پہنچا؛ اور بالخصوص روحِ ${urTarget} سمیت تمام مومنین و مومنات کی ارواح کو بخش دے۔ الٰہی! ان کی مغفرت فرما، ان کی قبروں کو حدِ نظر تک نورِ رحمت سے منور فرما اور جنت الفردوس میں اعلیٰ درجات عطا فرما۔ آمین بجاہِ سید المرسلین ﷺ!`,
    };
  }, [activeBarsi]);

  // 12-Month Hijri Timeline Grouping for Tab 4
  const monthlyBarsiGroups = useMemo(() => {
    return HIJRI_MONTHS.map((enMonth, idx) => {
      const mNum = idx + 1;
      const localizedName = formatLocalizedHijriMonth(lang, mNum, enMonth);
      const records = barsiRecords
        .filter((b) => b.hijriMonth === mNum)
        .sort((a, b) => a.hijriDay - b.hijriDay);
      const occasions = SACRED_ISAL_OCCASIONS[mNum] || [];
      return {
        monthNumber: mNum,
        enMonth,
        localizedName,
        isCurrentMonth: hijri.month === mNum,
        records,
        occasions,
      };
    }).filter((g) => showEmptyMonths || g.records.length > 0 || g.isCurrentMonth);
  }, [barsiRecords, hijri.month, lang, showEmptyMonths]);

  const completedFatihaStepCount = useMemo(
    () => FATIHA_GUIDE_STEPS.filter((s) => completedSteps[s.id]).length,
    [completedSteps]
  );

  const handleCompleteFullFatihaMethod = async () => {
    const allChecked: Record<string, boolean> = {};
    for (const s of FATIHA_GUIDE_STEPS) {
      allChecked[s.id] = true;
    }
    setCompletedSteps(allChecked);

    if (activeBarsi) {
      await cmsLogBarsiGift({
        barsiId: activeBarsi.id,
        donorName: effectiveDonorName.trim() || "Devoted Believer",
        giftType: "Surah Al-Fatihah",
        count: 1,
      });
      awardXp(25, "Mukammal Tariqa-e-Fatiha Mastery Bonus");
      triggerNoorBurst(
        "Mukammal Tariqa-e-Fatiha & Dua-e-Bakhshish",
        activeBarsi.personName
      );
    } else {
      awardXp(35, "Completed Mukammal Tariqa-e-Fatiha");
      triggerNoorBurst("Mukammal Tariqa-e-Fatiha", "All Marhumeen of the Ummah");
    }
  };

  return (
    <div className="space-y-6 pb-8">
      {/* Floating Animated Noor Celebration Toast / Banner */}
      <AnimatePresence>
        {noorCelebration && (
          <motion.div
            key={noorCelebration.id}
            initial={{ opacity: 0, y: -24, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -16, scale: 0.96 }}
            transition={{ duration: 0.28, ease: "easeOut" }}
            role="status"
            aria-live="polite"
            className="sanctuary-halo-card relative overflow-hidden p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
          >
            {/* Ambient Noor Shimmer */}
            <motion.div
              initial={{ opacity: 0.65, scale: 0.85 }}
              animate={{ opacity: 0, scale: 1.45 }}
              transition={{ duration: 1.6, ease: "easeOut" }}
              className="pointer-events-none absolute -top-10 start-8 w-44 h-44 rounded-full blur-2xl"
              style={{ backgroundColor: "var(--accent-gold)" }}
            />
            <div className="flex items-start sm:items-center gap-3.5 relative z-10">
              <div
                className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 text-white shadow-md"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              >
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="badge-pill badge-emerald">{ui.noorAccepted}</span>
                </div>
                <p className="text-sm sm:text-base font-bold mt-1" style={{ color: "var(--text-primary)" }}>
                  {noorCelebration.giftLabel} —{" "}
                  <span style={{ color: "var(--accent-primary)" }}>
                    {noorCelebration.recipientName}
                  </span>
                </p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setNoorCelebration(null)}
              aria-label="Dismiss celebration banner"
              className="self-end sm:self-center p-1.5 rounded-lg cursor-pointer opacity-70 hover:opacity-100"
              style={{ color: "var(--text-muted)" }}
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Error Banner if any */}
      {formError && !modalOpen && (
        <div
          role="alert"
          className="bento-card p-3.5 flex items-center justify-between gap-3 text-xs sm:text-sm"
          style={{ borderColor: "var(--accent-danger)" }}
        >
          <span style={{ color: "var(--accent-danger)" }}>{formError}</span>
          <button
            type="button"
            onClick={() => setFormError(null)}
            aria-label="Clear error message"
            className="p-1 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* ==================== 1. SERENE MEMORIAL HERO & HIJRI BARSI COUNTDOWN ==================== */}
      <section className="twilight-hero-card relative overflow-hidden p-5 sm:p-7">
        {/* Decorative Celestial Glow Orbs */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -top-24 -end-20 w-72 h-72 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: "var(--accent-gold)" }}
        />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -bottom-24 -start-16 w-64 h-64 rounded-full opacity-25 blur-3xl"
          style={{ backgroundColor: "var(--accent-primary)" }}
        />

        <div className="relative z-10 grid lg:grid-cols-12 gap-6 items-center">
          {/* Left 7 Cols: Sanctuary Title, Epigraph & Primary CTAs */}
          <div className="lg:col-span-7 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-white/15 text-white backdrop-blur-sm border border-white/20">
                <Moon className="w-3.5 h-3.5 text-amber-300" />
                <span>{hijri.formatted}</span>
              </span>
              {hijri.isFriday && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-400/20 text-emerald-200 border border-emerald-300/30">
                  <Sparkles className="w-3 h-3" />
                  Jumu&apos;ah Mubarak — Fatiha &amp; Ziyarat
                </span>
              )}
              {hijri.isGyarhviSharif && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-400/20 text-amber-200 border border-amber-300/30">
                  <Star className="w-3 h-3" />
                  11th Gyarhvi Sharif
                </span>
              )}
            </div>

            <p className="font-arabic text-lg sm:text-xl text-amber-200/95 leading-relaxed">
              ﴿ رَبَّنَا اغْفِرْ لَنَا وَلِإِخْوَانِنَا الَّذِينَ سَبَقُونَا بِالْإِيمَانِ ﴾
            </p>

            <div>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-white leading-tight">
                {t(lang, "navBarsi")}
              </h1>
              <p className="text-xs sm:text-sm text-white/80 mt-2 max-w-2xl leading-relaxed">
                {tl(lang, "barsiSubtitle", ui.subtitle)}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <button
                type="button"
                onClick={openCreateModal}
                className="btn-peach inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm cursor-pointer shadow-lg"
              >
                <span>{ui.addLovedOne}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("khatm")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/14 hover:bg-white/22 text-white border border-white/20 transition-colors cursor-pointer"
              >
                <BookOpen className="w-4 h-4 text-amber-300" />
                <span>{tl(lang, "barsiTabKhatm", ui.tabKhatm)}</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab("fatiha")}
                className="inline-flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold bg-white/14 hover:bg-white/22 text-white border border-white/20 transition-colors cursor-pointer"
              >
                <HeartHandshake className="w-4 h-4 text-emerald-300" />
                <span>{tl(lang, "barsiTabMethod", ui.tabMethod)}</span>
              </button>
            </div>
          </div>

          {/* Right 5 Cols: Next Upcoming Barsi Live Countdown Spotlight */}
          <div className="lg:col-span-5">
            {sanctuaryMetrics.nextBarsi ? (
              <div className="rounded-2xl p-4 sm:p-5 bg-black/28 backdrop-blur-md border border-white/18 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
                    <Clock className="w-3.5 h-3.5" />
                    {ui.upcomingBarsi}
                  </span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums ${
                      sanctuaryMetrics.nextBarsiDaysLeft === 0
                        ? "bg-emerald-400/25 text-emerald-200 border border-emerald-300/40"
                        : "bg-amber-400/20 text-amber-200 border border-amber-300/35"
                    }`}
                  >
                    {sanctuaryMetrics.nextBarsiDaysLeft === 0
                      ? ui.todayBarsi
                      : `${sanctuaryMetrics.nextBarsiDaysLeft} ${tp(lang, "days")}`}
                  </span>
                </div>

                <div>
                  <h2 className="text-lg sm:text-xl font-bold text-white leading-snug">
                    {sanctuaryMetrics.nextBarsi.personName}
                  </h2>
                  {sanctuaryMetrics.nextBarsi.urduName && (
                    <p className="font-urdu text-base text-amber-200/90 mt-0.5" dir="rtl">
                      {sanctuaryMetrics.nextBarsi.urduName}
                    </p>
                  )}
                  <p className="text-xs text-white/75 mt-1">
                    {sanctuaryMetrics.nextBarsi.relation} •{" "}
                    <span className="font-semibold text-white">
                      {sanctuaryMetrics.nextBarsi.hijriDay}{" "}
                      {formatLocalizedHijriMonth(
                        lang,
                        sanctuaryMetrics.nextBarsi.hijriMonth,
                        HIJRI_MONTHS[sanctuaryMetrics.nextBarsi.hijriMonth - 1]
                      )}
                      {sanctuaryMetrics.nextBarsi.hijriYear
                        ? ` (${Math.max(1, hijri.year - sanctuaryMetrics.nextBarsi.hijriYear)} AH)`
                        : ""}
                    </span>
                  </p>
                </div>

                {sanctuaryMetrics.nextBarsi.restingPlaceCity && (
                  <div className="flex items-center gap-1.5 text-xs text-white/70">
                    <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                    <span className="truncate">
                      {sanctuaryMetrics.nextBarsi.qabrastanName
                        ? `${sanctuaryMetrics.nextBarsi.qabrastanName}, `
                        : ""}
                      {sanctuaryMetrics.nextBarsi.restingPlaceCity}
                    </span>
                  </div>
                )}

                <div className="pt-1 flex items-center gap-2">
                  <button
                    type="button"
                    disabled={sendingGiftType !== null}
                    onClick={() => {
                      if (!sanctuaryMetrics.nextBarsi) return;
                      setSelectedBarsiId(sanctuaryMetrics.nextBarsi.id);
                      handleSendGift(sanctuaryMetrics.nextBarsi, GIFT_OPTIONS[0]);
                    }}
                    className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-white text-slate-950 hover:opacity-95 transition-opacity cursor-pointer inline-flex items-center justify-center gap-1.5"
                  >
                    <HeartHandshake className="w-3.5 h-3.5 text-amber-700" />
                    <span>{ui.sendFatihaGift}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!sanctuaryMetrics.nextBarsi) return;
                      setSelectedBarsiId(sanctuaryMetrics.nextBarsi.id);
                      setActiveTab("sanctuary");
                    }}
                    className="py-2 px-3 rounded-xl text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 cursor-pointer"
                  >
                    {ui.openProfile}
                  </button>
                </div>
              </div>
            ) : (
              <div className="rounded-2xl p-5 bg-black/25 border border-white/15 text-center space-y-3">
                <HeartHandshake className="w-8 h-8 text-amber-300 mx-auto" />
                <p className="text-sm font-semibold text-white">{t(lang, "navBarsi")}</p>
                <p className="text-xs text-white/75">{tl(lang, "barsiSubtitle", ui.subtitle)}</p>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="btn-peach px-4 py-2 rounded-xl text-xs cursor-pointer"
                >
                  {ui.addLovedOne}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4 Serene Memorial Overview Metrics */}
        <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6 pt-5 border-t border-white/15">
          <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm border border-white/12">
            <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
              {ui.profilesHeading}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-white tabular-nums mt-0.5">
              {sanctuaryMetrics.totalProfiles}
            </p>
            <p className="text-[11px] text-white/75 mt-0.5">
              {sanctuaryMetrics.privateCount} {ui.filterFamily} • {sanctuaryMetrics.communityCount}{" "}
              {ui.filterCommunity}
            </p>
          </div>

          <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm border border-white/12">
            <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
              {ui.totalHadiyah}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-amber-200 tabular-nums mt-0.5">
              {sanctuaryMetrics.totalGiftsCombined.toLocaleString()}
            </p>
            <p className="text-[11px] text-white/75 mt-0.5 tabular-nums">
              {sanctuaryMetrics.totalFatiha} Fatiha • {sanctuaryMetrics.totalYasin} Yasin •{" "}
              {sanctuaryMetrics.totalDurood} Durood
            </p>
          </div>

          <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm border border-white/12">
            <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
              {ui.khatmProgress}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-emerald-200 tabular-nums mt-0.5">
              {sanctuaryMetrics.totalParasCompleted}
            </p>
            <p className="text-[11px] text-white/75 mt-0.5">
              {sanctuaryMetrics.completedFullKhatms} × 30/30 Khatm
            </p>
          </div>

          <div className="rounded-xl p-3 bg-white/10 backdrop-blur-sm border border-white/12">
            <p className="text-[11px] uppercase tracking-wider text-white/70 font-semibold">
              {ui.todaysGifts}
            </p>
            <p className="text-xl sm:text-2xl font-bold text-white tabular-nums mt-0.5">
              {barsiFatihaToday}
            </p>
            <p className="text-[11px] text-amber-200 mt-0.5">
              Surah Al-Fatihah &amp; Salawat
            </p>
          </div>
        </div>
      </section>

      {/* ==================== FILTER, SEARCH & SUB-TAB NAVIGATION ==================== */}
      <div className="bento-card p-3.5 sm:p-4 space-y-3.5">
        {/* Top Row: 4 Localized Navigation Tabs */}
        <div
          role="tablist"
          aria-label={t(lang, "navBarsi")}
          className="pill-tab-bar"
        >
          {(
            [
              {
                id: "sanctuary",
                label: tl(lang, "barsiTabSanctuary", ui.tabSanctuary),
                icon: HeartHandshake,
                badge: String(sanctuaryMetrics.totalProfiles),
              },
              {
                id: "khatm",
                label: tl(lang, "barsiTabKhatm", ui.tabKhatm),
                icon: BookOpen,
                badge: activeBarsi ? `${activeKhatmStats.completedCount}/30` : "30",
              },
              {
                id: "fatiha",
                label: tl(lang, "barsiTabMethod", ui.tabMethod),
                icon: Sparkles,
                badge: `${completedFatihaStepCount}/8`,
              },
              {
                id: "calendar",
                label: tl(lang, "barsiTabCalendar", ui.tabCalendar),
                icon: Calendar,
                badge: "12",
              },
            ] as const
          ).map((tab) => {
            const Icon = tab.icon;
            const isSelected = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                role="tab"
                aria-selected={isSelected}
                onClick={() => setActiveTab(tab.id)}
                className={`pill-tab-btn inline-flex items-center gap-2 cursor-pointer ${
                  isSelected ? "pill-tab-btn-active" : ""
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
                <span className="px-1.5 py-0.5 rounded-full text-[10px] font-bold tabular-nums opacity-80">
                  {tab.badge}
                </span>
              </button>
            );
          })}
        </div>

        {/* Filter & Search Bar (Shown on Sanctuary, Khatm & Calendar tabs) */}
        {activeTab !== "fatiha" && (
          <div
            className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-2.5 pt-2 border-t"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            {/* Visibility Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 me-1 hidden sm:inline" style={{ color: "var(--text-muted)" }} />
              {(
                [
                  { id: "all", label: ui.filterAll, icon: Globe },
                  { id: "private", label: ui.filterFamily, icon: Lock },
                  { id: "community", label: ui.filterCommunity, icon: Users },
                ] as const
              ).map((vf) => {
                const Icon = vf.icon;
                const active = visibilityFilter === vf.id;
                return (
                  <button
                    key={vf.id}
                    type="button"
                    onClick={() => setVisibilityFilter(vf.id)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-colors cursor-pointer"
                    style={{
                      backgroundColor: active ? "var(--accent-soft)" : "var(--bg-elevated)",
                      borderColor: active ? "var(--accent-primary)" : "var(--border-hairline)",
                      color: active ? "var(--accent-primary)" : "var(--text-secondary)",
                    }}
                  >
                    <Icon className="w-3 h-3" />
                    <span>{vf.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Hijri Month Dropdown + Search Input + Add CTA */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2">
              <select
                aria-label={ui.allHijriMonths}
                value={monthFilter}
                onChange={(e) => setMonthFilter(Number(e.target.value))}
                className="ui-select px-3 py-1.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-hairline)",
                  color: "var(--text-primary)",
                }}
              >
                <option
                  value={0}
                  style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                >
                  {ui.allHijriMonths}
                </option>
                {HIJRI_MONTHS.map((mName, idx) => (
                  <option
                    key={mName}
                    value={idx + 1}
                    style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                  >
                    {idx + 1}. {formatLocalizedHijriMonth(lang, idx + 1, mName)}
                  </option>
                ))}
              </select>

              <div
                className="relative flex-1 min-w-[170px] flex items-center rounded-xl border px-3 py-1.5"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-hairline)",
                }}
              >
                <Search className="w-3.5 h-3.5 shrink-0 me-2" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder={`${tp(lang, "Search")}…`}
                  aria-label={tp(lang, "Search")}
                  className="w-full bg-transparent text-xs outline-none"
                  style={{ color: "var(--text-primary)" }}
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    aria-label={tp(lang, "Reset")}
                    className="ms-1 opacity-70 hover:opacity-100 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 cursor-pointer"
              >
                <span>{ui.addLovedOne}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ==================== TAB CONTENT PANELS ==================== */}
      <AnimatePresence mode="wait">
        {/* -------------------- TAB 1: MARHUMEEN & BARSI SANCTUARY -------------------- */}
        {activeTab === "sanctuary" && (
          <motion.section
            key="tab-sanctuary"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid lg:grid-cols-12 gap-5 items-start"
          >
            {/* Left 5 Cols: Selectable Barsi Profile Cards */}
            <div className="lg:col-span-5 space-y-3">
              <div className="flex items-center justify-between px-1">
                <h2 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                  {ui.profilesHeading} ({filteredBarsis.length})
                </h2>
                <button
                  type="button"
                  onClick={openCreateModal}
                  className="text-xs font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {ui.addLovedOne}
                </button>
              </div>

              {filteredBarsis.length === 0 ? (
                <div className="bento-card p-6 text-center space-y-3">
                  <Heart className="w-8 h-8 mx-auto" style={{ color: "var(--accent-primary)" }} />
                  <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                    {ui.profilesHeading}
                  </h3>
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    {tl(lang, "barsiSubtitle", ui.subtitle)}
                  </p>
                  <div className="flex items-center justify-center gap-2 pt-1">
                    {(visibilityFilter !== "all" || monthFilter > 0 || searchQuery) && (
                      <button
                        type="button"
                        onClick={() => {
                          setVisibilityFilter("all");
                          setMonthFilter(0);
                          setSearchQuery("");
                        }}
                        className="px-3.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer"
                        style={{
                          borderColor: "var(--border-hairline)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        {tp(lang, "Reset")}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={openCreateModal}
                      className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                    >
                      {ui.addLovedOne}
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 max-h-[760px] overflow-y-auto pe-1">
                  {filteredBarsis.map((rec) => {
                    const isSelected = activeBarsi?.id === rec.id;
                    const daysLeft = hijriDaysUntil(
                      hijri.month,
                      hijri.day,
                      rec.hijriMonth,
                      rec.hijriDay
                    );
                    const parasDone = Object.keys(rec.khatmParas || {}).length;
                    const editable = canManageRecord(rec);

                    return (
                      <div
                        key={rec.id}
                        onClick={() => setSelectedBarsiId(rec.id)}
                        role="button"
                        tabIndex={0}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelectedBarsiId(rec.id);
                          }
                        }}
                        aria-label={`${rec.personName}`}
                        className="bento-card bento-card-interactive p-4 cursor-pointer space-y-3"
                        style={{
                          borderColor: isSelected
                            ? "var(--accent-primary)"
                            : "var(--border-hairline)",
                          backgroundColor: isSelected
                            ? "color-mix(in srgb, var(--bg-surface) 88%, var(--accent-primary) 12%)"
                            : "var(--bg-surface)",
                        }}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-1.5 mb-1">
                              <span
                                className="badge-pill"
                                style={{
                                  backgroundColor:
                                    rec.visibility === "private"
                                      ? "var(--accent-soft)"
                                      : "var(--gold-soft)",
                                  color:
                                    rec.visibility === "private"
                                      ? "var(--accent-primary)"
                                      : "var(--accent-gold)",
                                }}
                              >
                                {rec.visibility === "private" ? (
                                  <>
                                    <Lock className="w-2.5 h-2.5" /> {ui.filterFamily}
                                  </>
                                ) : (
                                  <>
                                    <Users className="w-2.5 h-2.5" /> {ui.filterCommunity}
                                  </>
                                )}
                              </span>
                              <span
                                className={`badge-pill ${
                                  daysLeft === 0 ? "badge-emerald" : "badge-gold"
                                }`}
                              >
                                {daysLeft === 0 ? tp(lang, "Today") : `${daysLeft} ${tp(lang, "days")}`}
                              </span>
                            </div>

                            <h3
                              className="text-sm sm:text-base font-bold leading-snug"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {rec.personName}
                            </h3>
                            {rec.urduName && rec.urduName !== rec.personName && (
                              <p
                                className="font-urdu text-sm mt-0.5"
                                style={{ color: "var(--accent-gold)" }}
                                dir="rtl"
                              >
                                {rec.urduName}
                              </p>
                            )}
                            <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                              {rec.relation} • {rec.hijriDay}{" "}
                              {formatLocalizedHijriMonth(
                                lang,
                                rec.hijriMonth,
                                HIJRI_MONTHS[rec.hijriMonth - 1]
                              )}
                            </p>
                          </div>

                          {editable && (
                            <div
                              className="flex items-center gap-1 shrink-0"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <button
                                type="button"
                                onClick={() => openEditModal(rec)}
                                aria-label={`${tp(lang, "Edit")} ${rec.personName}`}
                                className="p-1.5 rounded-lg border cursor-pointer hover:opacity-80"
                                style={{
                                  backgroundColor: "var(--bg-elevated)",
                                  borderColor: "var(--border-hairline)",
                                  color: "var(--text-secondary)",
                                }}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          )}
                        </div>

                        {/* Mini Khatm Progress + Counters */}
                        <div className="space-y-1.5 pt-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span style={{ color: "var(--text-muted)" }}>
                              {ui.khatmProgress}:{" "}
                              <strong style={{ color: "var(--text-primary)" }}>{parasDone}/30</strong>
                            </span>
                            <span className="tabular-nums" style={{ color: "var(--text-secondary)" }}>
                              {rec.totalFatihaCount} Fatiha • {rec.totalYasinCount} Yasin •{" "}
                              {rec.totalDuroodCount} Durood
                            </span>
                          </div>
                          <div
                            className="h-1.5 rounded-full overflow-hidden"
                            style={{ backgroundColor: "var(--bg-muted)" }}
                          >
                            <div
                              className="h-full rounded-full transition-all duration-500"
                              style={{
                                width: `${Math.min(100, Math.round((parasDone / 30) * 100))}%`,
                                backgroundImage: "var(--gradient-brand)",
                              }}
                            />
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Right 7 Cols: Active Profile Sanctuary + Serene Isal-e-Sawab Dedication */}
            <div className="lg:col-span-7 space-y-5">
              {activeBarsi ? (
                <>
                  {/* Selected Profile Halo Card */}
                  <div className="sanctuary-halo-card p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="badge-pill badge-gold">
                            <Calendar className="w-3 h-3" />
                            {activeBarsi.hijriDay}{" "}
                            {formatLocalizedHijriMonth(
                              lang,
                              activeBarsi.hijriMonth,
                              HIJRI_MONTHS[activeBarsi.hijriMonth - 1]
                            )}
                            {activeBarsi.hijriYear ? ` ${activeBarsi.hijriYear} AH` : ""}
                          </span>
                          {activeBarsi.gregorianDeathDate && (
                            <span
                              className="badge-pill"
                              style={{
                                backgroundColor: "var(--bg-elevated)",
                                color: "var(--text-secondary)",
                                border: "1px solid var(--border-hairline)",
                              }}
                            >
                              {activeBarsi.gregorianDeathDate}
                            </span>
                          )}
                          <span
                            className="badge-pill"
                            style={{
                              backgroundColor: "var(--accent-soft)",
                              color: "var(--accent-primary)",
                            }}
                          >
                            {activeBarsi.relation}
                          </span>
                        </div>

                        <h2
                          className="text-xl sm:text-2xl font-bold leading-snug pt-1"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {activeBarsi.personName}
                        </h2>
                        {activeBarsi.urduName && (
                          <p
                            className="font-urdu text-lg sm:text-xl"
                            style={{ color: "var(--accent-gold)" }}
                            dir="rtl"
                          >
                            {activeBarsi.urduName}
                          </p>
                        )}
                      </div>

                      {/* Edit / Delete Controls for Authorized Owners */}
                      {canManageRecord(activeBarsi) && (
                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={() => openEditModal(activeBarsi)}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer hover:opacity-85"
                            style={{
                              backgroundColor: "var(--bg-elevated)",
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-primary)",
                            }}
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                            {tp(lang, "Edit")}
                          </button>
                          {confirmDeleteId === activeBarsi.id ? (
                            <div className="inline-flex items-center gap-1.5">
                              <button
                                type="button"
                                disabled={deletingId === activeBarsi.id}
                                onClick={() => handleConfirmDelete(activeBarsi.id)}
                                className="px-3 py-1.5 rounded-xl text-xs font-bold text-white cursor-pointer"
                                style={{ backgroundColor: "var(--accent-danger)" }}
                              >
                                {deletingId === activeBarsi.id ? tp(lang, "Loading…") : tp(lang, "Delete")}
                              </button>
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteId(null)}
                                className="px-2.5 py-1.5 rounded-xl text-xs border cursor-pointer"
                                style={{
                                  borderColor: "var(--border-hairline)",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {tp(lang, "Cancel")}
                              </button>
                            </div>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setConfirmDeleteId(activeBarsi.id)}
                              aria-label={`${tp(lang, "Delete")} ${activeBarsi.personName}`}
                              className="p-1.5 rounded-xl border cursor-pointer hover:opacity-85"
                              style={{
                                backgroundColor: "var(--bg-elevated)",
                                borderColor: "var(--border-hairline)",
                                color: "var(--accent-danger)",
                              }}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Resting Place & Favorite Wird Pills */}
                    <div className="grid sm:grid-cols-2 gap-2.5">
                      <div
                        className="p-3 rounded-xl border flex items-start gap-2.5"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-hairline)",
                        }}
                      >
                        <MapPin
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: "var(--accent-primary)" }}
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                            Qabrastan &amp; Resting Place
                          </p>
                          <p
                            className="text-xs font-bold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {activeBarsi.qabrastanName || activeBarsi.restingPlaceCity
                              ? [activeBarsi.qabrastanName, activeBarsi.restingPlaceCity]
                                  .filter(Boolean)
                                  .join(" • ")
                              : "Remembered in Family Duas"}
                          </p>
                        </div>
                      </div>

                      <div
                        className="p-3 rounded-xl border flex items-start gap-2.5"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-hairline)",
                        }}
                      >
                        <Sparkles
                          className="w-4 h-4 mt-0.5 shrink-0"
                          style={{ color: "var(--accent-gold)" }}
                        />
                        <div className="min-w-0">
                          <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                            Recommended Wird
                          </p>
                          <p
                            className="text-xs font-bold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {activeBarsi.favoriteWird}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Memory & Dua Note */}
                    {activeBarsi.memoryNote && (
                      <blockquote
                        className="p-3.5 rounded-xl border-s-4 text-xs sm:text-sm italic leading-relaxed"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderInlineStartColor: "var(--accent-gold)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        &ldquo;{activeBarsi.memoryNote}&rdquo;
                      </blockquote>
                    )}

                    {/* 3 Aggregate Counter Stat Tiles */}
                    <div className="grid grid-cols-3 gap-2.5 pt-1">
                      <div
                        className="p-3 rounded-xl border text-center"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          borderColor: "var(--border-hairline)",
                        }}
                      >
                        <p
                          className="text-lg sm:text-xl font-bold tabular-nums"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          {activeBarsi.totalFatihaCount.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                          Fatiha &amp; Surahs
                        </p>
                      </div>
                      <div
                        className="p-3 rounded-xl border text-center"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          borderColor: "var(--border-hairline)",
                        }}
                      >
                        <p
                          className="text-lg sm:text-xl font-bold tabular-nums"
                          style={{ color: "var(--accent-gold)" }}
                        >
                          {activeBarsi.totalYasinCount.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                          Surah Yasin
                        </p>
                      </div>
                      <div
                        className="p-3 rounded-xl border text-center"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          borderColor: "var(--border-hairline)",
                        }}
                      >
                        <p
                          className="text-lg sm:text-xl font-bold tabular-nums"
                          style={{ color: "#10B981" }}
                        >
                          {activeBarsi.totalDuroodCount.toLocaleString()}
                        </p>
                        <p className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                          Durood Salawat
                        </p>
                      </div>
                    </div>

                    {/* Quick Jump Actions */}
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setActiveTab("khatm")}
                        className="btn-primary inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>
                          {ui.khatmProgress} ({activeKhatmStats.completedCount}/30)
                        </span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setActiveTab("fatiha")}
                        className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-hairline)",
                          color: "var(--text-primary)",
                        }}
                      >
                        <HeartHandshake className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                        <span>{tl(lang, "barsiTabMethod", ui.tabMethod)}</span>
                      </button>
                    </div>
                  </div>

                  {/* Serene Isal-e-Sawab Gift Dedication */}
                  <div className="bento-card p-5 sm:p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                          <HeartHandshake className="w-3.5 h-3.5" />
                          <span>Isal-e-Sawab</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>
                          {ui.sendFatihaGift}
                        </h3>
                      </div>

                      <div className="flex items-center gap-2">
                        <UserRound className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                        <input
                          type="text"
                          maxLength={45}
                          value={effectiveDonorName}
                          onChange={(e) => setCustomDonorName(e.target.value)}
                          placeholder="Name"
                          aria-label="Donor name for Isal-e-Sawab dedication"
                          className="px-3 py-1.5 rounded-xl border text-xs font-medium outline-none w-44 sm:w-48"
                          style={{
                            backgroundColor: "var(--bg-elevated)",
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-primary)",
                          }}
                        />
                      </div>
                    </div>

                    <div className="grid sm:grid-cols-2 gap-3">
                      {GIFT_OPTIONS.map((opt) => {
                        const isSending = sendingGiftType === opt.giftType;
                        return (
                          <motion.div
                            key={opt.giftType}
                            whileTap={{ scale: 0.985 }}
                            className="rounded-2xl border p-3.5 flex flex-col justify-between gap-3 transition-all"
                            style={{
                              backgroundColor: "var(--bg-elevated)",
                              borderColor: isSending
                                ? "var(--accent-gold)"
                                : "var(--border-hairline)",
                            }}
                          >
                            <div className="space-y-1.5">
                              <div className="flex items-center justify-between gap-2">
                                <span className="badge-pill badge-gold">{opt.badgeText}</span>
                              </div>
                              <h4
                                className="text-sm font-bold"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {opt.shortTitle}
                              </h4>
                              <p
                                className="font-arabic text-base leading-relaxed"
                                style={{ color: "var(--accent-gold)" }}
                                dir="rtl"
                              >
                                {opt.arabicSnippet}
                              </p>
                              <p
                                className="text-[11px] leading-snug"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {opt.virtueNote}
                              </p>
                            </div>

                            <div className="flex items-center gap-2 pt-1">
                              <button
                                type="button"
                                disabled={sendingGiftType !== null}
                                onClick={() => handleSendGift(activeBarsi, opt)}
                                className="btn-primary flex-1 py-2 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-60"
                              >
                                <HeartHandshake className="w-3.5 h-3.5" />
                                <span>{isSending ? ui.dedicating : ui.sendFatihaGift}</span>
                              </button>

                              {opt.quickHref && (
                                <Link
                                  href={opt.quickHref}
                                  title={opt.quickHrefLabel}
                                  aria-label={opt.quickHrefLabel}
                                  className="p-2 rounded-xl border inline-flex items-center justify-center shrink-0 hover:opacity-85 transition-opacity"
                                  style={{
                                    backgroundColor: "var(--bg-surface)",
                                    borderColor: "var(--border-hairline)",
                                    color: "var(--accent-primary)",
                                  }}
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </Link>
                              )}
                            </div>
                          </motion.div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Recent Gifts Feed */}
                  <div className="bento-card p-5 space-y-3">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-secondary)" }}>
                        {ui.recentGifts}
                      </h3>
                      <span className="text-xs tabular-nums" style={{ color: "var(--text-muted)" }}>
                        {activeBarsi.giftLogs.length}
                      </span>
                    </div>

                    {activeBarsi.giftLogs.length === 0 ? (
                      <p className="text-xs py-4 text-center" style={{ color: "var(--text-muted)" }}>
                        {ui.sendFatihaGift} — {activeBarsi.personName}
                      </p>
                    ) : (
                      <div className="space-y-2 max-h-64 overflow-y-auto pe-1">
                        {activeBarsi.giftLogs.map((log) => (
                          <div
                            key={log.id}
                            className="flex items-center justify-between gap-3 p-2.5 rounded-xl border text-xs"
                            style={{
                              backgroundColor: "var(--bg-elevated)",
                              borderColor: "var(--border-hairline)",
                            }}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <div
                                className="w-7 h-7 rounded-full flex items-center justify-center shrink-0 font-bold text-[11px]"
                                style={{
                                  backgroundColor: "var(--accent-soft)",
                                  color: "var(--accent-primary)",
                                }}
                              >
                                {log.donorName.slice(0, 1).toUpperCase()}
                              </div>
                              <div className="min-w-0">
                                <p className="truncate" style={{ color: "var(--text-primary)" }}>
                                  <strong>{log.donorName}</strong> •{" "}
                                  <span style={{ color: "var(--accent-gold)" }} className="font-semibold">
                                    {log.giftType}
                                  </span>
                                </p>
                              </div>
                            </div>
                            <span
                              className="text-[11px] shrink-0 tabular-nums"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {formatGiftRelativeTime(log.createdAt, now)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <div className="bento-card p-8 text-center space-y-3">
                  <HeartHandshake className="w-10 h-10 mx-auto" style={{ color: "var(--accent-primary)" }} />
                  <h3 className="text-lg font-bold">{ui.addLovedOne}</h3>
                  <p className="text-xs max-w-md mx-auto" style={{ color: "var(--text-muted)" }}>
                    {tl(lang, "barsiSubtitle", ui.subtitle)}
                  </p>
                </div>
              )}
            </div>
          </motion.section>
        )}

        {/* -------------------- TAB 2: 30-PARA FAMILY KHATM-E-QURAN BOARD -------------------- */}
        {activeTab === "khatm" && (
          <motion.section
            key="tab-khatm"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Khatm Control & Progress Header */}
            <div className="sanctuary-halo-card p-5 sm:p-6 space-y-5">
              <div className="grid md:grid-cols-12 gap-4 items-end">
                {/* Profile Selector */}
                <div className="md:col-span-5 space-y-1.5">
                  <label
                    htmlFor="khatm-barsi-select"
                    className="block text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {ui.khatmProgress}
                  </label>
                  <select
                    id="khatm-barsi-select"
                    value={activeBarsi?.id || ""}
                    onChange={(e) => setSelectedBarsiId(e.target.value)}
                    className="ui-select w-full px-3.5 py-2.5 rounded-xl border text-sm font-bold outline-none cursor-pointer"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {barsiRecords.map((b) => (
                      <option
                        key={b.id}
                        value={b.id}
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {b.personName} ({Object.keys(b.khatmParas || {}).length}/30)
                      </option>
                    ))}
                  </select>
                </div>

                {/* Reader Name Input */}
                <div className="md:col-span-4 space-y-1.5">
                  <label
                    htmlFor="khatm-reader-input"
                    className="block text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {ui.recitedBy}
                  </label>
                  <input
                    id="khatm-reader-input"
                    type="text"
                    maxLength={40}
                    value={effectiveReaderName}
                    onChange={(e) => setCustomReaderName(e.target.value)}
                    placeholder={ui.recitedBy}
                    className="w-full px-3.5 py-2.5 rounded-xl border text-sm font-medium outline-none"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Filter Mode */}
                <div className="md:col-span-3 flex items-center gap-1.5">
                  {(
                    [
                      { id: "all", label: `${ui.filterAll} (30)` },
                      { id: "available", label: `${30 - activeKhatmStats.completedCount}` },
                      { id: "completed", label: `${activeKhatmStats.completedCount}/30` },
                    ] as const
                  ).map((pf) => (
                    <button
                      key={pf.id}
                      type="button"
                      onClick={() => setParaFilter(pf.id)}
                      className="flex-1 py-2.5 px-2 rounded-xl border text-xs font-semibold cursor-pointer transition-colors"
                      style={{
                        backgroundColor:
                          paraFilter === pf.id ? "var(--accent-soft)" : "var(--bg-surface)",
                        borderColor:
                          paraFilter === pf.id ? "var(--accent-primary)" : "var(--border-hairline)",
                        color:
                          paraFilter === pf.id ? "var(--accent-primary)" : "var(--text-secondary)",
                      }}
                    >
                      {pf.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Animated Khatm Progress Bar */}
              {activeBarsi && (
                <div className="space-y-2.5 pt-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <BookOpen className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
                      <span className="text-sm sm:text-base font-bold" style={{ color: "var(--text-primary)" }}>
                        {ui.khatmProgress}: {activeKhatmStats.completedCount} / 30 (
                        {activeKhatmStats.pct}%)
                      </span>
                    </div>
                    <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {ui.claimCompletePara}
                    </span>
                  </div>

                  <div
                    className="h-3 rounded-full overflow-hidden p-0.5"
                    style={{ backgroundColor: "var(--bg-muted)" }}
                  >
                    <motion.div
                      initial={false}
                      animate={{ width: `${activeKhatmStats.pct}%` }}
                      transition={{ duration: 0.45, ease: "easeOut" }}
                      className="h-full rounded-full"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    />
                  </div>

                  {activeKhatmStats.uniqueReaders.length > 0 && (
                    <div className="flex flex-wrap items-center gap-1.5 pt-1">
                      <span className="text-[11px] font-semibold me-1" style={{ color: "var(--text-muted)" }}>
                        {ui.recitedBy}:
                      </span>
                      {activeKhatmStats.uniqueReaders.map((rName) => (
                        <span
                          key={rName}
                          className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold"
                          style={{
                            backgroundColor: "var(--accent-soft)",
                            color: "var(--accent-primary)",
                          }}
                        >
                          {rName}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Full 30/30 Khatm Celebration Banner */}
                  {activeKhatmStats.isFullKhatm && (
                    <div className="quran-gradient-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 mt-2">
                      <div className="space-y-0.5">
                        <p className="text-xs font-bold uppercase tracking-wider text-amber-200">
                          Alhamdulillah • 30/30 Khatm-ul-Quran
                        </p>
                        <p className="text-sm sm:text-base font-bold text-white">
                          {activeBarsi.personName}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setActiveTab("fatiha")}
                        className="btn-peach px-4 py-2 rounded-xl text-xs shrink-0 cursor-pointer"
                      >
                        {tl(lang, "barsiTabMethod", ui.tabMethod)}
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 30-Tile Juz / Para Interactive Grid */}
            {activeBarsi ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {visibleJuzList.map((juz) => {
                  const assignedReader = activeKhatmStats.parasMap[String(juz.juz)];
                  const isDone = Boolean(assignedReader);
                  const isBusy = togglingPara === juz.juz;

                  return (
                    <motion.div
                      key={juz.juz}
                      layout
                      whileTap={{ scale: 0.98 }}
                      className="bento-card p-3.5 flex flex-col justify-between gap-3 transition-all"
                      style={{
                        borderColor: isDone ? "#10B981" : "var(--border-hairline)",
                        backgroundColor: isDone
                          ? "color-mix(in srgb, var(--bg-surface) 88%, #10B981 12%)"
                          : "var(--bg-surface)",
                      }}
                    >
                      {/* Clickable Toggle Area */}
                      <button
                        type="button"
                        disabled={isBusy}
                        onClick={() => handleTogglePara(juz.juz)}
                        aria-label={`Para ${juz.juz} (${juz.arabicTitle})`}
                        className="text-start space-y-2 w-full cursor-pointer"
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span
                            className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-bold tabular-nums"
                            style={{
                              backgroundColor: isDone
                                ? "rgba(16, 185, 129, 0.2)"
                                : "var(--bg-elevated)",
                              color: isDone ? "#10B981" : "var(--text-primary)",
                            }}
                          >
                            Para {juz.juz} • {toArabicIndicDigits(juz.juz)}
                          </span>
                          {isDone ? (
                            <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                          ) : (
                            <span
                              className="text-[10px] font-semibold truncate max-w-[110px]"
                              style={{ color: "var(--accent-primary)" }}
                            >
                              {ui.claimCompletePara}
                            </span>
                          )}
                        </div>

                        <p
                          className="font-arabic text-xl font-bold leading-normal text-end"
                          style={{ color: isDone ? "#10B981" : "var(--accent-gold)" }}
                          dir="rtl"
                        >
                          {juz.arabicTitle}
                        </p>

                        <div>
                          <p
                            className="text-[11px] font-semibold truncate"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {juz.surahName} ({juz.surahNum}:{juz.ayahNum})
                          </p>
                          <p
                            className="text-[11px] mt-0.5 truncate"
                            style={{ color: isDone ? "#10B981" : "var(--text-muted)" }}
                          >
                            {isBusy
                              ? tp(lang, "Loading…")
                              : isDone
                              ? `${ui.recitedBy}: ${assignedReader}`
                              : ui.claimCompletePara}
                          </p>
                        </div>
                      </button>

                      {/* Direct Read Para in Mushaf Link */}
                      <Link
                        href={`/quran?page=${juz.startPage}`}
                        className="pt-2 border-t flex items-center justify-between text-[11px] font-semibold hover:underline"
                        style={{
                          borderColor: "var(--border-hairline)",
                          color: "var(--accent-primary)",
                        }}
                      >
                        <span>{ui.readInMushaf}</span>
                        <span className="inline-flex items-center gap-1 tabular-nums">
                          p.{juz.startPage}
                          <ExternalLink className="w-3 h-3" />
                        </span>
                      </Link>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="bento-card p-8 text-center">
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  {ui.addLovedOne}
                </p>
              </div>
            )}
          </motion.section>
        )}

        {/* -------------------- TAB 3: MUKAMMAL TARIQA-E-FATIHA & DUA-E-BAKHSHISH -------------------- */}
        {activeTab === "fatiha" && (
          <motion.section
            key="tab-fatiha"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-5"
          >
            {/* Guide Header & Controls */}
            <div className="sanctuary-halo-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                <div className="space-y-1">
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Ahkam-e-Shariat &amp; Bahar-e-Shariat</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {tl(lang, "barsiTabMethod", ui.tabMethod)}
                  </h2>
                  <p className="text-xs sm:text-sm max-w-3xl" style={{ color: "var(--text-secondary)" }}>
                    Follow all 8 Masnoon steps taught by Ala Hazrat Imam Ahmad Raza Khan (رحمه الله)
                    and Sadr al-Shariah Mufti Amjad Ali A&apos;zami (رحمه الله). Select any memorial
                    below to weave their name directly into the concluding Bakhshish Dua.
                  </p>
                </div>

                {/* Display Toggles & Profile Target */}
                <div className="flex flex-wrap items-center gap-2 shrink-0">
                  <select
                    aria-label="Select Marhum for personalized Bakhshish Dua"
                    value={activeBarsi?.id || ""}
                    onChange={(e) => setSelectedBarsiId(e.target.value)}
                    className="ui-select px-3 py-2 rounded-xl border text-xs font-semibold outline-none cursor-pointer"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  >
                    {barsiRecords.map((b) => (
                      <option
                        key={b.id}
                        value={b.id}
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-primary)",
                        }}
                      >
                        {b.personName}
                      </option>
                    ))}
                  </select>

                  <button
                    type="button"
                    onClick={() => setShowEnglishTranslation((v) => !v)}
                    className="px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                    style={{
                      backgroundColor: showEnglishTranslation
                        ? "var(--accent-soft)"
                        : "var(--bg-surface)",
                      borderColor: showEnglishTranslation
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                      color: showEnglishTranslation
                        ? "var(--accent-primary)"
                        : "var(--text-muted)",
                    }}
                  >
                    English
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowUrduTranslation((v) => !v)}
                    className="px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                    style={{
                      backgroundColor: showUrduTranslation
                        ? "var(--accent-soft)"
                        : "var(--bg-surface)",
                      borderColor: showUrduTranslation
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                      color: showUrduTranslation ? "var(--accent-primary)" : "var(--text-muted)",
                    }}
                  >
                    اردو ترجمہ
                  </button>
                </div>
              </div>

              {/* Progress Strip */}
              <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                <span className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  <strong style={{ color: "var(--accent-primary)" }}>
                    {completedFatihaStepCount} / 8
                  </strong>
                </span>
                <div className="flex items-center gap-2">
                  {completedFatihaStepCount > 0 && (
                    <button
                      type="button"
                      onClick={() => {
                        setCompletedSteps({});
                        setStepBeadCounts({});
                      }}
                      className="px-3 py-1.5 rounded-xl border text-xs cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-muted)",
                      }}
                    >
                      {tp(lang, "Reset")}
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={handleCompleteFullFatihaMethod}
                    className="btn-primary inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-bold cursor-pointer"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>{ui.completeFatiha}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* 8 Step Cards */}
            <div className="space-y-4">
              {FATIHA_GUIDE_STEPS.map((step) => {
                const isChecked = Boolean(completedSteps[step.id]);
                const beadCount = stepBeadCounts[step.id] || 0;

                return (
                  <div
                    key={step.id}
                    className="bento-card p-5 sm:p-6 space-y-4 transition-all"
                    style={{
                      borderColor: isChecked ? "#10B981" : "var(--border-hairline)",
                    }}
                  >
                    {/* Step Header (Urdu/Persian displays step.urduTitle prominently first) */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-start sm:items-center gap-3">
                        <div
                          className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 text-white"
                          style={{
                            backgroundImage: isChecked
                              ? "linear-gradient(135deg, #10B981, #059669)"
                              : "var(--gradient-brand)",
                          }}
                        >
                          {isChecked ? <Check className="w-4 h-4" /> : step.stepNumber}
                        </div>
                        <div>
                          {preferUrduFirst ? (
                            <div className="flex flex-col gap-0.5">
                              <h3
                                className="font-urdu text-lg sm:text-xl font-bold leading-relaxed"
                                style={{ color: "var(--text-primary)" }}
                                dir="rtl"
                              >
                                {step.urduTitle}
                              </h3>
                              <span
                                className="text-xs sm:text-sm font-semibold"
                                style={{ color: "var(--accent-gold)" }}
                              >
                                {step.title}
                              </span>
                            </div>
                          ) : (
                            <div className="flex flex-wrap items-center gap-2">
                              <h3 className="text-base sm:text-lg font-bold" style={{ color: "var(--text-primary)" }}>
                                {step.title}
                              </h3>
                              <span
                                className="font-urdu text-sm sm:text-base"
                                style={{ color: "var(--accent-gold)" }}
                                dir="rtl"
                              >
                                {step.urduTitle}
                              </span>
                            </div>
                          )}
                          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                            {step.fiqhNote}
                          </p>
                        </div>
                      </div>

                      {/* Step Counter (for 3x steps) + Check Button */}
                      <div className="flex items-center gap-2 shrink-0">
                        {step.repeatCount > 1 && (
                          <button
                            type="button"
                            onClick={() => {
                              const next = Math.min(step.repeatCount, beadCount + 1);
                              setStepBeadCounts((prev) => ({ ...prev, [step.id]: next }));
                              if (next >= step.repeatCount) {
                                setCompletedSteps((prev) => ({ ...prev, [step.id]: true }));
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl border text-xs font-bold tabular-nums cursor-pointer"
                            style={{
                              backgroundColor: "var(--gold-soft)",
                              borderColor: "var(--accent-gold)",
                              color: "var(--accent-gold)",
                            }}
                          >
                            {beadCount}/{step.repeatCount}
                          </button>
                        )}

                        <button
                          type="button"
                          onClick={() =>
                            setCompletedSteps((prev) => ({
                              ...prev,
                              [step.id]: !prev[step.id],
                            }))
                          }
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                          style={{
                            backgroundColor: isChecked
                              ? "rgba(16, 185, 129, 0.16)"
                              : "var(--bg-elevated)",
                            borderColor: isChecked ? "#10B981" : "var(--border-hairline)",
                            color: isChecked ? "#10B981" : "var(--text-primary)",
                          }}
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>#{step.stepNumber}</span>
                        </button>
                      </div>
                    </div>

                    {/* Step 1: Durood Selector & Text */}
                    {step.id === "step-durood" && activeDurood && (
                      <div className="space-y-3">
                        <div className="flex flex-wrap items-center gap-1.5">
                          {duroodChoices.map((d) => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => setSelectedDuroodId(d.id)}
                              className="px-3 py-1 rounded-full text-xs font-semibold border cursor-pointer"
                              style={{
                                backgroundColor:
                                  selectedDuroodId === d.id
                                    ? "var(--accent-soft)"
                                    : "var(--bg-elevated)",
                                borderColor:
                                  selectedDuroodId === d.id
                                    ? "var(--accent-primary)"
                                    : "var(--border-hairline)",
                                color:
                                  selectedDuroodId === d.id
                                    ? "var(--accent-primary)"
                                    : "var(--text-secondary)",
                              }}
                            >
                              {d.name}
                            </button>
                          ))}
                        </div>

                        <div
                          className="p-4 rounded-2xl border space-y-2.5"
                          style={{
                            backgroundColor: "var(--bg-elevated)",
                            borderColor: "var(--border-hairline)",
                          }}
                        >
                          <p
                            className="font-arabic text-xl sm:text-2xl text-end leading-loose"
                            style={{ color: "var(--text-primary)" }}
                            dir="rtl"
                          >
                            {activeDurood.arabic}
                          </p>
                          <p className="text-xs italic" style={{ color: "var(--accent-gold)" }}>
                            {activeDurood.transliteration}
                          </p>
                          {showEnglishTranslation && (
                            <p className="text-xs sm:text-sm" style={{ color: "var(--text-secondary)" }}>
                              {activeDurood.translation}
                            </p>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Steps 2–7: Dynamic Verified Quranic Verses from Local Kanzul Iman Dataset */}
                    {step.verseQueries && (
                      <div className="space-y-3">
                        {step.verseQueries.map((vq) => {
                          const sObj = quranSurahs?.get(vq.surah);
                          const ayahs = sObj
                            ? vq.ayahs
                              ? sObj.a.filter((ay) => vq.ayahs?.includes(ay.n))
                              : sObj.a
                            : [];

                          return (
                            <div
                              key={`${step.id}-${vq.surah}-${vq.heading}`}
                              className="p-4 rounded-2xl border space-y-3"
                              style={{
                                backgroundColor: "var(--bg-elevated)",
                                borderColor: "var(--border-hairline)",
                              }}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <span
                                  className="text-xs font-bold"
                                  style={{ color: "var(--accent-primary)" }}
                                >
                                  {vq.heading}
                                </span>
                                <Link
                                  href={`/quran?surah=${vq.surah}`}
                                  className="text-[11px] font-semibold inline-flex items-center gap-1 hover:underline"
                                  style={{ color: "var(--accent-gold)" }}
                                >
                                  {ui.readInMushaf} <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>

                              {vq.surah !== 1 && vq.surah !== 9 && (!vq.ayahs || vq.ayahs[0] === 1) && (
                                <p
                                  className="font-arabic text-lg text-center"
                                  style={{ color: "var(--accent-gold)" }}
                                  dir="rtl"
                                >
                                  بِسْمِ ٱللَّهِ ٱلرَّحْمَـٰنِ ٱلرَّحِيمِ
                                </p>
                              )}

                              {ayahs.length > 0 ? (
                                <div className="space-y-3">
                                  <p
                                    className="font-arabic text-xl sm:text-2xl leading-loose text-end"
                                    style={{ color: "var(--text-primary)" }}
                                    dir="rtl"
                                  >
                                    {ayahs.map((ay) => (
                                      <React.Fragment key={ay.n}>
                                        {ay.t.replace(
                                          /^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/,
                                          ""
                                        )}{" "}
                                        <span
                                          className="inline-block mx-1 text-sm"
                                          style={{ color: "var(--accent-gold)" }}
                                        >
                                          ﴿{toArabicIndicDigits(ay.n)}﴾
                                        </span>{" "}
                                      </React.Fragment>
                                    ))}
                                  </p>

                                  {(preferUrduFirst || showUrduTranslation) && (
                                    <p
                                      className={`font-urdu leading-loose border-t pt-2.5 ${
                                        preferUrduFirst
                                          ? "text-lg sm:text-xl font-medium"
                                          : "text-base sm:text-lg"
                                      }`}
                                      style={{
                                        borderColor: "var(--border-hairline)",
                                        color: preferUrduFirst
                                          ? "var(--text-primary)"
                                          : "var(--text-secondary)",
                                      }}
                                      dir="rtl"
                                    >
                                      {ayahs.map((ay) => `${ay.u} (${ay.n}) `).join(" ")}
                                    </p>
                                  )}

                                  {showEnglishTranslation && (
                                    <p
                                      className="text-xs sm:text-sm leading-relaxed border-t pt-2.5"
                                      style={{
                                        borderColor: "var(--border-hairline)",
                                        color: "var(--text-secondary)",
                                      }}
                                    >
                                      {ayahs.map((ay) => `(${ay.n}) ${ay.e}`).join(" ")}
                                    </p>
                                  )}
                                </div>
                              ) : (
                                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                                  {tp(lang, "Loading…")}
                                </p>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* Step 8: Full Arabic, Urdu (prominently first for ur/fa), Transliteration & English Dua */}
                    {step.id === "step-bakhshish-dua" && (
                      <div
                        className="p-4 sm:p-5 rounded-2xl border space-y-4"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--accent-gold)",
                        }}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <span className="badge-pill badge-gold">
                            {activeBarsi ? activeBarsi.personName : t(lang, "navBarsi")}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              handleCopyText(
                                "bakhshish",
                                `${bakhshishDua.arabic}\n\n${bakhshishDua.urdu}\n\n${bakhshishDua.english}`
                              )
                            }
                            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg border text-xs font-semibold cursor-pointer"
                            style={{
                              backgroundColor: "var(--bg-surface)",
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {copiedKey === "bakhshish" ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-500" />{" "}
                                {tp(lang, "Copied!")}
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" /> Copy
                              </>
                            )}
                          </button>
                        </div>

                        <p
                          className="font-arabic text-xl sm:text-2xl leading-loose text-end"
                          style={{ color: "var(--text-primary)" }}
                          dir="rtl"
                        >
                          {bakhshishDua.arabic}
                        </p>

                        {preferUrduFirst && (
                          <p
                            className="font-urdu text-lg sm:text-xl font-medium leading-loose border-t pt-3"
                            style={{
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-primary)",
                            }}
                            dir="rtl"
                          >
                            {bakhshishDua.urdu}
                          </p>
                        )}

                        <p
                          className="text-xs sm:text-sm italic leading-relaxed border-t pt-3"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: "var(--accent-gold)",
                          }}
                        >
                          {bakhshishDua.transliteration}
                        </p>

                        {!preferUrduFirst && showUrduTranslation && (
                          <p
                            className="font-urdu text-base sm:text-lg leading-loose border-t pt-3"
                            style={{
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-primary)",
                            }}
                            dir="rtl"
                          >
                            {bakhshishDua.urdu}
                          </p>
                        )}

                        {showEnglishTranslation && (
                          <p
                            className="text-xs sm:text-sm leading-relaxed border-t pt-3"
                            style={{
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            {bakhshishDua.english}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </motion.section>
        )}

        {/* -------------------- TAB 4: ANNUAL BARSI CALENDAR & ADAB-E-QABRASTAN -------------------- */}
        {activeTab === "calendar" && (
          <motion.section
            key="tab-calendar"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Part A: 12-Month Hijri Annual Barsi Timeline */}
            <div className="space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                    {ui.allHijriMonths}
                  </p>
                  <h2 className="text-xl font-bold" style={{ color: "var(--text-primary)" }}>
                    {tl(lang, "barsiTabCalendar", ui.tabCalendar)} ({hijri.year} AH)
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setShowEmptyMonths((v) => !v)}
                  className="self-start sm:self-center px-3.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{
                    backgroundColor: "var(--bg-surface)",
                    borderColor: "var(--border-hairline)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {showEmptyMonths ? ui.profilesHeading : ui.allHijriMonths}
                </button>
              </div>

              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthlyBarsiGroups.map((group) => (
                  <div
                    key={group.monthNumber}
                    className="bento-card p-4 space-y-3"
                    style={{
                      borderColor: group.isCurrentMonth
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span
                          className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold tabular-nums"
                          style={{
                            backgroundColor: group.isCurrentMonth
                              ? "var(--accent-primary)"
                              : "var(--bg-elevated)",
                            color: group.isCurrentMonth ? "#ffffff" : "var(--text-secondary)",
                          }}
                        >
                          {group.monthNumber}
                        </span>
                        <div>
                          <h3 className="text-sm font-bold" style={{ color: "var(--text-primary)" }}>
                            {group.localizedName}
                          </h3>
                        </div>
                      </div>

                      {group.isCurrentMonth ? (
                        <span className="badge-pill badge-emerald">{ui.currentMonth}</span>
                      ) : (
                        <span className="text-[11px] font-semibold tabular-nums" style={{ color: "var(--text-muted)" }}>
                          {group.records.length}
                        </span>
                      )}
                    </div>

                    {/* Barsi entries in this month */}
                    {group.records.length > 0 ? (
                      <div className="space-y-2">
                        {group.records.map((b) => (
                          <div
                            key={b.id}
                            className="p-2.5 rounded-xl border flex items-center justify-between gap-2"
                            style={{
                              backgroundColor: "var(--bg-elevated)",
                              borderColor: "var(--border-hairline)",
                            }}
                          >
                            <div className="min-w-0">
                              <p
                                className="text-xs font-bold truncate"
                                style={{ color: "var(--text-primary)" }}
                              >
                                <span
                                  className="tabular-nums me-1.5"
                                  style={{ color: "var(--accent-gold)" }}
                                >
                                  {b.hijriDay} {group.localizedName}:
                                </span>
                                {b.personName}
                              </p>
                              <p className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                                {b.relation}
                              </p>
                            </div>
                            <button
                              type="button"
                              onClick={() => {
                                setSelectedBarsiId(b.id);
                                setActiveTab("sanctuary");
                              }}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-semibold shrink-0 cursor-pointer"
                              style={{
                                backgroundColor: "var(--accent-soft)",
                                color: "var(--accent-primary)",
                              }}
                            >
                              {ui.openProfile}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs py-1" style={{ color: "var(--text-muted)" }}>
                        {ui.noBarsisInMonth} {group.localizedName}.
                      </p>
                    )}

                    {/* Traditional Sunni Isal-e-Sawab Occasions */}
                    {group.occasions.map((occ) => (
                      <div
                        key={occ.label}
                        className="p-2 rounded-xl text-[11px] flex items-start gap-1.5"
                        style={{
                          backgroundColor: "var(--gold-soft)",
                          color: "var(--accent-gold)",
                        }}
                      >
                        <Star className="w-3.5 h-3.5 shrink-0 mt-0.5" />
                        <span className="font-medium leading-snug">{occ.label}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            {/* Part B: Authentic Hanafi Adab-e-Qabrastan & Vocalized Salam */}
            <div className="sanctuary-halo-card p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                    <Compass className="w-4 h-4" />
                    <span>Sunni Hanafi Ziyarat-e-Qubur Guide</span>
                  </div>
                  <h2 className="text-xl sm:text-2xl font-bold mt-0.5" style={{ color: "var(--text-primary)" }}>
                    Adab-e-Qabrastan &amp; Masnoon Salam
                  </h2>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      awardXp(15, "Practiced Masnoon Salam-e-Qabrastan");
                      triggerNoorBurst(
                        "Salam upon Ahl al-Qubur",
                        "All Believing Dwellers of Graves"
                      );
                    }}
                    className="btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                  >
                    <HeartHandshake className="w-3.5 h-3.5" />
                    <span>{ui.reciteSalam}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      handleCopyText(
                        "salam",
                        `${QABRASTAN_SALAM.arabic}\n${QABRASTAN_SALAM.transliteration}\n${QABRASTAN_SALAM.english}`
                      )
                    }
                    className="px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {copiedKey === "salam" ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" /> {tp(lang, "Copied!")}
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" /> Copy
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* Vocalized Arabic Salam Card */}
              <div
                className="p-4 sm:p-5 rounded-2xl border space-y-3"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  borderColor: "var(--border-hairline)",
                }}
              >
                <p
                  className="font-arabic text-xl sm:text-2xl leading-loose text-end"
                  style={{ color: "var(--text-primary)" }}
                  dir="rtl"
                >
                  {QABRASTAN_SALAM.arabic}
                </p>
                {preferUrduFirst && (
                  <p
                    className="font-urdu text-lg sm:text-xl leading-loose border-t pt-2.5"
                    style={{
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                    dir="rtl"
                  >
                    {QABRASTAN_SALAM.urdu}
                  </p>
                )}
                <p className="text-xs sm:text-sm italic" style={{ color: "var(--accent-gold)" }}>
                  {QABRASTAN_SALAM.transliteration}
                </p>
                {!preferUrduFirst && (
                  <p
                    className="font-urdu text-base sm:text-lg leading-loose border-t pt-2.5"
                    style={{
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-secondary)",
                    }}
                    dir="rtl"
                  >
                    {QABRASTAN_SALAM.urdu}
                  </p>
                )}
                <p
                  className="text-xs sm:text-sm leading-relaxed border-t pt-2.5"
                  style={{
                    borderColor: "var(--border-hairline)",
                    color: "var(--text-secondary)",
                  }}
                >
                  {QABRASTAN_SALAM.english}
                </p>
                <p className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                  {QABRASTAN_SALAM.source}
                </p>
              </div>

              {/* 4 Hanafi Etiquette Cards */}
              <div className="grid md:grid-cols-2 gap-4">
                {ADAB_QABRASTAN_CARDS.map((card) => (
                  <div
                    key={card.id}
                    className="p-4 rounded-2xl border space-y-2.5"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <span className="badge-pill badge-gold">{card.badge}</span>
                    <h3 className="text-base font-bold" style={{ color: "var(--text-primary)" }}>
                      {card.title}
                    </h3>
                    <ul className="space-y-1.5 text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                      {card.points.map((pt, idx) => (
                        <li key={idx} className="flex items-start gap-2">
                          <span
                            className="w-1.5 h-1.5 rounded-full mt-1.5 shrink-0"
                            style={{ backgroundColor: "var(--accent-primary)" }}
                          />
                          <span>{pt}</span>
                        </li>
                      ))}
                    </ul>
                    <p className="text-[11px] pt-1 font-medium" style={{ color: "var(--text-muted)" }}>
                      {card.source}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ==================== ADD / EDIT BELOVED MARHUM MODAL ==================== */}
      <AnimatePresence>
        {modalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/65 backdrop-blur-sm overflow-y-auto"
            onClick={() => setModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 10 }}
              transition={{ duration: 0.2 }}
              role="dialog"
              aria-modal="true"
              aria-labelledby="barsi-modal-title"
              onClick={(e) => e.stopPropagation()}
              className="bento-card w-full max-w-2xl max-h-[90dvh] overflow-y-auto p-5 sm:p-6 space-y-4 my-auto"
            >
              <div className="flex items-start justify-between gap-3">
                <div>
                  <span className="badge-pill badge-gold">
                    <HeartHandshake className="w-3 h-3" /> {t(lang, "navBarsi")}
                  </span>
                  <h2
                    id="barsi-modal-title"
                    className="text-lg sm:text-xl font-bold mt-1"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {formDraft.id ? tp(lang, "Edit") : ui.addLovedOne}
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  aria-label={tp(lang, "Cancel")}
                  className="p-1.5 rounded-lg opacity-75 hover:opacity-100 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div
                  role="alert"
                  className="p-3 rounded-xl border text-xs font-medium"
                  style={{
                    borderColor: "var(--accent-danger)",
                    color: "var(--accent-danger)",
                  }}
                >
                  {formError}
                </div>
              )}

              <form onSubmit={handleSaveBarsiForm} className="space-y-4">
                <div className="grid sm:grid-cols-2 gap-3.5">
                  {/* English Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      maxLength={80}
                      placeholder="e.g. Al-Hajj Muhammad Ibrahim Qadri"
                      value={formDraft.personName}
                      onChange={(e) =>
                        setFormDraft((d) => ({ ...d, personName: e.target.value }))
                      }
                      className="w-full px-3.5 py-2.5 rounded-xl border text-sm outline-none"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  {/* Urdu / Arabic Name */}
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Urdu / Arabic Script Name
                    </label>
                    <input
                      type="text"
                      dir="rtl"
                      maxLength={80}
                      placeholder="الحاج محمد ابراہیم قادری مرحوم"
                      value={formDraft.urduName}
                      onChange={(e) =>
                        setFormDraft((d) => ({ ...d, urduName: e.target.value }))
                      }
                      className="font-urdu w-full px-3.5 py-2 rounded-xl border text-sm outline-none"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>

                {/* Relation Input + Quick Chips */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Relation
                  </label>
                  <input
                    type="text"
                    maxLength={60}
                    placeholder="e.g. Beloved Father (Walid Marhum)"
                    value={formDraft.relation}
                    onChange={(e) =>
                      setFormDraft((d) => ({ ...d, relation: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {RELATION_PRESETS.slice(0, 6).map((rel) => (
                      <button
                        key={rel}
                        type="button"
                        onClick={() => setFormDraft((d) => ({ ...d, relation: rel }))}
                        className="px-2.5 py-1 rounded-full text-[11px] border cursor-pointer"
                        style={{
                          backgroundColor:
                            formDraft.relation === rel
                              ? "var(--accent-soft)"
                              : "var(--bg-elevated)",
                          borderColor:
                            formDraft.relation === rel
                              ? "var(--accent-primary)"
                              : "var(--border-hairline)",
                          color:
                            formDraft.relation === rel
                              ? "var(--accent-primary)"
                              : "var(--text-muted)",
                        }}
                      >
                        {rel}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Hijri Date & Optional Year / Gregorian */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Hijri Month *
                    </label>
                    <select
                      value={formDraft.hijriMonth}
                      onChange={(e) =>
                        setFormDraft((d) => ({ ...d, hijriMonth: Number(e.target.value) }))
                      }
                      className="ui-select w-full px-3 py-2.5 rounded-xl border text-xs font-semibold outline-none cursor-pointer"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {HIJRI_MONTHS.map((m, i) => (
                        <option
                          key={m}
                          value={i + 1}
                          style={{
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--text-primary)",
                          }}
                        >
                          {i + 1}. {formatLocalizedHijriMonth(lang, i + 1, m)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Hijri Day (1–30) *
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      required
                      value={formDraft.hijriDay}
                      onChange={(e) =>
                        setFormDraft((d) => ({ ...d, hijriDay: Number(e.target.value) }))
                      }
                      className="w-full px-3 py-2 rounded-xl border text-sm outline-none tabular-nums"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Hijri Year
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={1500}
                      placeholder="e.g. 1442"
                      value={formDraft.hijriYear}
                      onChange={(e) =>
                        setFormDraft((d) => ({ ...d, hijriYear: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl border text-sm outline-none tabular-nums"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1 col-span-2 sm:col-span-1">
                    <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Gregorian
                    </label>
                    <input
                      type="date"
                      value={formDraft.gregorianDeathDate}
                      onChange={(e) =>
                        setFormDraft((d) => ({ ...d, gregorianDeathDate: e.target.value }))
                      }
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>

                {/* Qabrastan & City */}
                <div className="grid sm:grid-cols-2 gap-3.5">
                  <div className="space-y-1">
                    <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      Qabrastan / Cemetery Name
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      placeholder="e.g. Miani Sahib Qabrastan"
                      value={formDraft.qabrastanName}
                      onChange={(e) =>
                        setFormDraft((d) => ({ ...d, qabrastanName: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border text-sm outline-none"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                      City &amp; Country
                    </label>
                    <input
                      type="text"
                      maxLength={80}
                      placeholder="e.g. Lahore, Pakistan"
                      value={formDraft.restingPlaceCity}
                      onChange={(e) =>
                        setFormDraft((d) => ({ ...d, restingPlaceCity: e.target.value }))
                      }
                      className="w-full px-3.5 py-2 rounded-xl border text-sm outline-none"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    />
                  </div>
                </div>

                {/* Favorite Wird & Memory Note */}
                <div className="space-y-1">
                  <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Recommended Wird
                  </label>
                  <input
                    type="text"
                    maxLength={100}
                    placeholder="Surah Yasin, 3x Surah Al-Ikhlas & Durood-e-Razawiyya"
                    value={formDraft.favoriteWird}
                    onChange={(e) =>
                      setFormDraft((d) => ({ ...d, favoriteWird: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl border text-sm outline-none"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Memory &amp; Dua Note
                  </label>
                  <textarea
                    rows={2}
                    maxLength={280}
                    placeholder="Share a cherished quality, life lesson, or special prayer…"
                    value={formDraft.memoryNote}
                    onChange={(e) =>
                      setFormDraft((d) => ({ ...d, memoryNote: e.target.value }))
                    }
                    className="w-full px-3.5 py-2 rounded-xl border text-sm outline-none resize-none"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  />
                </div>

                {/* Visibility Toggle */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                    Visibility
                  </label>
                  <div className="grid sm:grid-cols-2 gap-2.5">
                    <button
                      type="button"
                      onClick={() =>
                        setFormDraft((d) => ({ ...d, visibility: "private" }))
                      }
                      className="p-3 rounded-xl border text-start cursor-pointer"
                      style={{
                        backgroundColor:
                          formDraft.visibility === "private"
                            ? "var(--accent-soft)"
                            : "var(--bg-elevated)",
                        borderColor:
                          formDraft.visibility === "private"
                            ? "var(--accent-primary)"
                            : "var(--border-hairline)",
                      }}
                    >
                      <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
                        <Lock className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                        {ui.filterFamily}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        Kept private in your personal memorial calendar.
                      </p>
                    </button>

                    <button
                      type="button"
                      disabled={!authUser}
                      onClick={() =>
                        setFormDraft((d) => ({ ...d, visibility: "community" }))
                      }
                      className="p-3 rounded-xl border text-start cursor-pointer disabled:opacity-55 disabled:cursor-not-allowed"
                      style={{
                        backgroundColor:
                          formDraft.visibility === "community"
                            ? "var(--gold-soft)"
                            : "var(--bg-elevated)",
                        borderColor:
                          formDraft.visibility === "community"
                            ? "var(--accent-gold)"
                            : "var(--border-hairline)",
                      }}
                    >
                      <p className="text-xs font-bold flex items-center gap-1.5" style={{ color: "var(--text-primary)" }}>
                        <Users className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                        {ui.filterCommunity}
                      </p>
                      <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {authUser
                          ? "Shared with the community for collective Khatm & Fatiha."
                          : t(lang, "signIn")}
                      </p>
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-end gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setModalOpen(false)}
                    className="px-4 py-2.5 rounded-xl border text-xs font-semibold cursor-pointer"
                    style={{
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {tp(lang, "Cancel")}
                  </button>
                  <button
                    type="submit"
                    disabled={savingDraft}
                    className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer disabled:opacity-60"
                  >
                    {savingDraft
                      ? tp(lang, "Loading…")
                      : formDraft.id
                      ? ui.saveChanges
                      : tp(lang, "Save")}
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function BarsiPage() {
  return (
    <Suspense fallback={<BarsiLoadingSkeleton />}>
      <BarsiSanctuaryInner />
    </Suspense>
  );
}
