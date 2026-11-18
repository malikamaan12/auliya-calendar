"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Bell,
  Plus,
  Pencil,
  Trash2,
  Search,
  Compass,
  Volume2,
  VolumeX,
  Copy,
  Check,
  History,
  ChevronLeft,
  ChevronRight,
  ArrowRight,
  GraduationCap,
  Heart,
  Play,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { LangCode, localizePrayerName, t, tp } from "@/lib/i18n";
import { TASBIH_LITANIES, TasbihLitany } from "@/data/fiqh-hadith";
import {
  CustomChecklistItem,
  DAILY_DUAS_LIBRARY,
  DEFAULT_CHECKLIST_ITEMS,
  DhikrReminderConfig,
  DUA_ACTION_CATEGORIES,
  DuaActionCategory,
  DuaEntry,
  SavedTasbihSession,
  SuggestedWaqtTag,
} from "@/data/duas-adhkar";
import { PrayerName } from "@/lib/prayer-engine";

type ActiveTabId =
  | "counter"
  | "today-dua"
  | "dua-finder"
  | "checklist"
  | "dhikr-creator";

type ChecklistCatKey = "All" | "Morning" | "Salah" | "Evening" | "Sunnah";

type ExtendedLitany = TasbihLitany & {
  urduTranslation?: string;
};

interface TasbihUiStrings {
  tabCounter: string;
  tabTodayDua: string;
  tabDuaFinder: string;
  tabChecklist: string;
  tabDhikrCreator: string;
  todayLabel: string;
  beadsUnit: string;
  learnedStat: string;
  tapToRecite: string;
  target: string;
  saveSession: string;
  reset: string;
  savedSessions: string;
  reminders: string;
  suggestedNow: string;
  allDuasLink: string;
  listen: string;
  toneOn: string;
  muted: string;
  virtue: string;
  newCustomDhikr: string;
  notePlaceholder: string;
  saveToHistory: string;
  close: string;
  lifetimeTotal: string;
  noSavedSessions: string;
  browserAlerts: string;
  addAlert: string;
  reminderPlaceholder: string;
  active: string;
  off: string;
  duaOfTheDay: string;
  whenToRecite: string;
  transliteration: string;
  translation: string;
  markAsLearned: string;
  learned: string;
  practiceOnTasbih: string;
  virtueAndReference: string;
  wordBreakdown: string;
  testMemory: string;
  exitTest: string;
  tapToReveal: string;
  duaMastery: string;
  searchDuasPlaceholder: string;
  savedFilter: string;
  allFilter: string;
  reciteInTasbih: string;
  copy: string;
  copied: string;
  dailyChecklist: string;
  checklistSubtitle: string;
  completed: string;
  resetDefaults: string;
  createHabit: string;
  editHabit: string;
  cancelEdit: string;
  habitTitle: string;
  habitSubtitle: string;
  habitCategory: string;
  saveHabit: string;
  qazaTitle: string;
  qazaSubtitle: string;
  qazaYearsPlaceholder: string;
  setLedger: string;
  litanyName: string;
  arabicText: string;
  urduMeaning: string;
  meaning: string;
  targetCount: string;
  recommendedWindow: string;
  virtueNote: string;
  createDhikr: string;
  updateDhikr: string;
  customBadge: string;
  countNow: string;
  litanyLibrary: string;
  checklistCats: Record<ChecklistCatKey, string>;
  duaCategories: Record<DuaActionCategory, string>;
}

const TASBIH_UI: Record<LangCode, TasbihUiStrings> = {
  en: {
    tabCounter: "Counter",
    tabTodayDua: "Today's Dua",
    tabDuaFinder: "Dua Finder",
    tabChecklist: "Checklist",
    tabDhikrCreator: "Dhikr Creator",
    todayLabel: "Today",
    beadsUnit: "beads",
    learnedStat: "Learned",
    tapToRecite: "Tap to Recite",
    target: "Target",
    saveSession: "Save Session",
    reset: "Reset",
    savedSessions: "Saved Sessions",
    reminders: "Reminders",
    suggestedNow: "Suggested for Current Time",
    allDuasLink: "All Duas",
    listen: "Listen",
    toneOn: "Bead Tone",
    muted: "Muted",
    virtue: "Virtue",
    newCustomDhikr: "Custom Dhikr",
    notePlaceholder: "Optional reflection note (e.g., after Fajr)…",
    saveToHistory: "Save Session",
    close: "Close",
    lifetimeTotal: "Lifetime",
    noSavedSessions: "No saved sessions yet. Save a completed round to keep a quiet log of your adhkar.",
    browserAlerts: "Enable Alerts",
    addAlert: "Add Reminder",
    reminderPlaceholder: "Reminder label…",
    active: "On",
    off: "Off",
    duaOfTheDay: "Dua of the Day",
    whenToRecite: "Occasion",
    transliteration: "Transliteration",
    translation: "Meaning",
    markAsLearned: "Mark as Learned",
    learned: "Learned",
    practiceOnTasbih: "Practice on Tasbih",
    virtueAndReference: "Virtue & Reference",
    wordBreakdown: "Phrase Breakdown",
    testMemory: "Hide Meanings",
    exitTest: "Show Meanings",
    tapToReveal: "Tap to reveal…",
    duaMastery: "Duas Learned",
    searchDuasPlaceholder: "Search duas…",
    savedFilter: "Saved",
    allFilter: "All",
    reciteInTasbih: "Recite in Tasbih",
    copy: "Copy",
    copied: "Copied",
    dailyChecklist: "Daily Sunnah & Wird Checklist",
    checklistSubtitle: "Tap any practice to mark it complete for today, or edit your personal routine.",
    completed: "Completed",
    resetDefaults: "Reset Defaults",
    createHabit: "New Checklist Habit",
    editHabit: "Edit Checklist Habit",
    cancelEdit: "Cancel",
    habitTitle: "Practice Title",
    habitSubtitle: "Time Window or Note",
    habitCategory: "Category",
    saveHabit: "Save Habit",
    qazaTitle: "Qaza-e-Umri Tracker",
    qazaSubtitle: "Track and decrement missed Fard and Wajib Witr prayers.",
    qazaYearsPlaceholder: "Years to calculate…",
    setLedger: "Set Ledger",
    litanyName: "Litany Name",
    arabicText: "Arabic Text",
    urduMeaning: "Urdu Translation (Optional)",
    meaning: "Meaning",
    targetCount: "Target Count",
    recommendedWindow: "Recommended Time",
    virtueNote: "Virtue & Reference",
    createDhikr: "Create Dhikr",
    updateDhikr: "Update Dhikr",
    customBadge: "Custom",
    countNow: "Recite",
    litanyLibrary: "Litanies & Awrad",
    checklistCats: {
      All: "All",
      Morning: "Morning",
      Salah: "Salah",
      Evening: "Evening",
      Sunnah: "Sunnah",
    },
    duaCategories: {
      "Waking & Sleeping": "Waking & Sleeping",
      "Home & Travel": "Home & Travel",
      "Wudu & Masjid": "Wudu & Masjid",
      "Food & Sustenance": "Food & Sustenance",
      "Protection & Relief": "Protection & Relief",
      "Forgiveness & Parents": "Forgiveness & Parents",
      "Knowledge & Success": "Knowledge & Success",
      "Morning & Evening": "Morning & Evening",
    },
  },
  ur: {
    tabCounter: "تسبیح کاؤنٹر",
    tabTodayDua: "آج کی دعا",
    tabDuaFinder: "دعا خزانہ",
    tabChecklist: "معمولات",
    tabDhikrCreator: "نیا وظیفہ",
    todayLabel: "آج",
    beadsUnit: "دانے",
    learnedStat: "یاد شدہ",
    tapToRecite: "پڑھنے کے لیے چھوئیں",
    target: "ہدف",
    saveSession: "سیشن محفوظ کریں",
    reset: "دوبارہ ترتیب",
    savedSessions: "محفوظ تسبیحات",
    reminders: "یاد دہانی",
    suggestedNow: "موجودہ وقت کے مسنون اذکار",
    allDuasLink: "تمام دعائیں",
    listen: "تلاوت سنیں",
    toneOn: "آواز فعال",
    muted: "خاموش",
    virtue: "فضیلت",
    newCustomDhikr: "ذاتی وظیفہ",
    notePlaceholder: "اختیاری کیفیت یا نوٹ لکھیں…",
    saveToHistory: "محفوظ کریں",
    close: "بند کریں",
    lifetimeTotal: "مجموعی تعداد",
    noSavedSessions: "ابھی کوئی تسبیح سیشن محفوظ نہیں۔ اپنا روزمرہ ریکارڈ رکھنے کے لیے سیشن محفوظ کریں۔",
    browserAlerts: "اطلاعات فعال کریں",
    addAlert: "یاد دہانی شامل کریں",
    reminderPlaceholder: "یاد دہانی کا عنوان…",
    active: "فعال",
    off: "بند",
    duaOfTheDay: "آج کی مسنون دعا",
    whenToRecite: "موقع",
    transliteration: "تلفظ",
    translation: "اردو ترجمہ و مفہوم",
    markAsLearned: "یاد ہو گئی",
    learned: "یاد شدہ",
    practiceOnTasbih: "تسبیح پر مشق کریں",
    virtueAndReference: "فضیلت اور حوالہ",
    wordBreakdown: "الفاظ کے معانی",
    testMemory: "معانی چھپائیں",
    exitTest: "معانی دکھائیں",
    tapToReveal: "معنی دیکھنے کے لیے چھوئیں…",
    duaMastery: "نصابِ دعا",
    searchDuasPlaceholder: "مسنون دعائیں تلاش کریں…",
    savedFilter: "پسندیدہ",
    allFilter: "تمام",
    reciteInTasbih: "تسبیح میں پڑھیں",
    copy: "کاپی",
    copied: "کاپی ہو گیا",
    dailyChecklist: "روزانہ سنت و اوراد فہرست",
    checklistSubtitle: "آج کے مکمل کردہ معمولات پر نشان لگائیں یا نیا معمول شامل کریں۔",
    completed: "مکمل",
    resetDefaults: "اصل فہرست بحال کریں",
    createHabit: "نیا معمول شامل کریں",
    editHabit: "معمول میں ترمیم",
    cancelEdit: "منسوخ",
    habitTitle: "معمول کا عنوان",
    habitSubtitle: "وقت یا مختصر نوٹ",
    habitCategory: "درجہ بندی",
    saveHabit: "محفوظ کریں",
    qazaTitle: "قضائے عمری حساب",
    qazaSubtitle: "فوت شدہ فرض اور وتر نمازوں کا حساب رکھیں اور ادا کر کے کم کریں۔",
    qazaYearsPlaceholder: "سال درج کریں…",
    setLedger: "حساب مقرر کریں",
    litanyName: "وظیفہ / ذکر کا نام",
    arabicText: "عربی عبارت",
    urduMeaning: "اردو ترجمہ",
    meaning: "مفہوم",
    targetCount: "تعداد کا ہدف",
    recommendedWindow: "بہترین وقت",
    virtueNote: "فضیلت و حوالہ",
    createDhikr: "وظیفہ بنائیں",
    updateDhikr: "تبدیلی محفوظ کریں",
    customBadge: "ذاتی",
    countNow: "پڑھیں",
    litanyLibrary: "اوراد و وظائف ذخیرہ",
    checklistCats: {
      All: "تمام",
      Morning: "صبح",
      Salah: "نماز",
      Evening: "شام",
      Sunnah: "سنت",
    },
    duaCategories: {
      "Waking & Sleeping": "سونے اور جاگنے کی دعائیں",
      "Home & Travel": "گھر اور سفر",
      "Wudu & Masjid": "وضو اور مسجد",
      "Food & Sustenance": "کھانا اور رزق",
      "Protection & Relief": "حفاظت اور پریشانی سے نجات",
      "Forgiveness & Parents": "مغفرت اور والدین",
      "Knowledge & Success": "علم اور کامیابی",
      "Morning & Evening": "صبح و شام کے اذکار",
    },
  },
  ar: {
    tabCounter: "المسبحة",
    tabTodayDua: "دعاء اليوم",
    tabDuaFinder: "موسوعة الأدعية",
    tabChecklist: "الأوراد",
    tabDhikrCreator: "إنشاء ورد",
    todayLabel: "اليوم",
    beadsUnit: "تسبيحة",
    learnedStat: "محفوظ",
    tapToRecite: "اضغط للتسبيح",
    target: "الهدف",
    saveSession: "حفظ الجلسة",
    reset: "إعادة ضبط",
    savedSessions: "الجلسات المحفوظة",
    reminders: "التذكيرات",
    suggestedNow: "أدعية مقترحة للوقت الحالي",
    allDuasLink: "كل الأدعية",
    listen: "استماع",
    toneOn: "الصوت مفعل",
    muted: "صامت",
    virtue: "الفضل",
    newCustomDhikr: "ورد خاص",
    notePlaceholder: "ملاحظة اختيارية (مثلاً: بعد صلاة الفجر)…",
    saveToHistory: "حفظ",
    close: "إغلاق",
    lifetimeTotal: "الإجمالي",
    noSavedSessions: "لا توجد جلسات محفوظة بعد. احفظ جلستك لتوثيق أورادك اليومية.",
    browserAlerts: "تفعيل التنبيهات",
    addAlert: "إضافة تذكير",
    reminderPlaceholder: "عنوان التذكير…",
    active: "مفعل",
    off: "متوقف",
    duaOfTheDay: "دعاء اليوم",
    whenToRecite: "المناسبة",
    transliteration: "النطق الصوتي",
    translation: "المعنى",
    markAsLearned: "تحديد كمحفوظ",
    learned: "محفوظ",
    practiceOnTasbih: "التدرب في المسبحة",
    virtueAndReference: "الفضل والمصدر",
    wordBreakdown: "معاني المفردات",
    testMemory: "إخفاء المعاني",
    exitTest: "إظهار المعاني",
    tapToReveal: "اضغط لإظهار المعنى…",
    duaMastery: "الأدعية المحفوظة",
    searchDuasPlaceholder: "ابحث في الأدعية…",
    savedFilter: "المحفوظات",
    allFilter: "الكل",
    reciteInTasbih: "سبّح به",
    copy: "نسخ",
    copied: "تم النسخ",
    dailyChecklist: "قائمة السنن والأوراد اليومية",
    checklistSubtitle: "اضغط على أي ورد لتسجيل إتمامه اليوم أو عدّل قائمتك الخاصة.",
    completed: "مكتمل",
    resetDefaults: "استعادة الافتراضي",
    createHabit: "إضافة ورد يومي",
    editHabit: "تعديل الورد",
    cancelEdit: "إلغاء",
    habitTitle: "عنوان الورد",
    habitSubtitle: "الوقت أو ملاحظة الفضل",
    habitCategory: "الفئة",
    saveHabit: "حفظ الورد",
    qazaTitle: "سجل قضاء الفوائت",
    qazaSubtitle: "تتبع الصلوات المفروضة والوتر الفائتة وأنقصها عند الأداء.",
    qazaYearsPlaceholder: "عدد السنوات…",
    setLedger: "ضبط السجل",
    litanyName: "اسم الذكر",
    arabicText: "النص العربي",
    urduMeaning: "الترجمة الأردية (اختياري)",
    meaning: "المعنى",
    targetCount: "العدد المستهدف",
    recommendedWindow: "الوقت المستحب",
    virtueNote: "الفضل والمصدر",
    createDhikr: "إنشاء الذكر",
    updateDhikr: "حفظ التعديلات",
    customBadge: "خاص",
    countNow: "ابدأ",
    litanyLibrary: "مكتبة الأذكار والأوراد",
    checklistCats: {
      All: "الكل",
      Morning: "الصباح",
      Salah: "الصلاة",
      Evening: "المساء",
      Sunnah: "السنن",
    },
    duaCategories: {
      "Waking & Sleeping": "النوم والاستيقاظ",
      "Home & Travel": "المنزل والسفر",
      "Wudu & Masjid": "الوضوء والمسجد",
      "Food & Sustenance": "الطعام والرزق",
      "Protection & Relief": "التحصين وتفريج الكرب",
      "Forgiveness & Parents": "الاستغفار والوالدين",
      "Knowledge & Success": "العلم والتوفيق",
      "Morning & Evening": "أذكار الصباح والمساء",
    },
  },
  ro_ur: {
    tabCounter: "Tasbih Counter",
    tabTodayDua: "Aaj Ki Dua",
    tabDuaFinder: "Dua Finder",
    tabChecklist: "Mamoolat",
    tabDhikrCreator: "Zikr Creator",
    todayLabel: "Aaj",
    beadsUnit: "daane",
    learnedStat: "Yaad Shuda",
    tapToRecite: "Parhne Ke Liye Tap Karein",
    target: "Hadaf",
    saveSession: "Session Save Karein",
    reset: "Reset",
    savedSessions: "Mehfooz Tasbihat",
    reminders: "Yad-dihani",
    suggestedNow: "Maujooda Waqt Ki Masnoon Duayein",
    allDuasLink: "Tamam Duayein",
    listen: "Sunein",
    toneOn: "Bead Tone On",
    muted: "Khamosh",
    virtue: "Fazilat",
    newCustomDhikr: "Naya Wazifa",
    notePlaceholder: "Ikhtiyari note (maslan Fajr ke baad)…",
    saveToHistory: "Save Karein",
    close: "Band Karein",
    lifetimeTotal: "Kul Tadad",
    noSavedSessions: "Abhi koi session save nahin hua. Apne rozana wazaif ka hisab rakhne ke liye save karein.",
    browserAlerts: "Alerts On Karein",
    addAlert: "Reminder Jorein",
    reminderPlaceholder: "Reminder ka naam…",
    active: "Fa'al",
    off: "Band",
    duaOfTheDay: "Aaj Ki Masnoon Dua",
    whenToRecite: "Mauqa",
    transliteration: "Talaffuz",
    translation: "Tarjuma",
    markAsLearned: "Yaad Ho Gayi",
    learned: "Yaad Shuda",
    practiceOnTasbih: "Tasbih Par Mashq",
    virtueAndReference: "Fazilat aur Hawala",
    wordBreakdown: "Alfaz Ke Ma'ani",
    testMemory: "Ma'ani Chhupayein",
    exitTest: "Ma'ani Dikhayein",
    tapToReveal: "Ma'ani dekhne ke liye tap karein…",
    duaMastery: "Yaad Shuda Duayein",
    searchDuasPlaceholder: "Duayein talash karein…",
    savedFilter: "Mehfooz",
    allFilter: "Tamam",
    reciteInTasbih: "Tasbih Mein Parhein",
    copy: "Copy",
    copied: "Copy Ho Gaya",
    dailyChecklist: "Rozana Sunnat & Wird Checklist",
    checklistSubtitle: "Aaj ke mukammal mamoolat par nishan lagayein ya apni list murattab karein.",
    completed: "Mukammal",
    resetDefaults: "Default Bahal Karein",
    createHabit: "Naya Mamool Shamil Karein",
    editHabit: "Mamool Edit Karein",
    cancelEdit: "Cancel",
    habitTitle: "Mamool Ka Naam",
    habitSubtitle: "Waqt ya Fazilat Note",
    habitCategory: "Category",
    saveHabit: "Save Karein",
    qazaTitle: "Qaza-e-Umri Hisab",
    qazaSubtitle: "Chhooti hui Farz aur Witr namazon ka hisab rakhein.",
    qazaYearsPlaceholder: "Saal likhein…",
    setLedger: "Set Karein",
    litanyName: "Wazifa / Zikr Ka Naam",
    arabicText: "Arabi Matan",
    urduMeaning: "Urdu Tarjuma (Ikhtiyari)",
    meaning: "Tarjuma / Mafhoom",
    targetCount: "Tadad Ka Hadaf",
    recommendedWindow: "Behtareen Waqt",
    virtueNote: "Fazilat & Hawala",
    createDhikr: "Zikr Banayein",
    updateDhikr: "Tabdeeli Save Karein",
    customBadge: "Zati",
    countNow: "Parhein",
    litanyLibrary: "Wazaif aur Awrad",
    checklistCats: {
      All: "Tamam",
      Morning: "Subah",
      Salah: "Namaz",
      Evening: "Shaam",
      Sunnah: "Sunnat",
    },
    duaCategories: {
      "Waking & Sleeping": "Sone aur Jagne Ki Duayein",
      "Home & Travel": "Ghar aur Safar",
      "Wudu & Masjid": "Wuzu aur Masjid",
      "Food & Sustenance": "Khana aur Rizq",
      "Protection & Relief": "Hifazat aur Sukoon",
      "Forgiveness & Parents": "Maghfirat aur Walidain",
      "Knowledge & Success": "Ilm aur Kamyabi",
      "Morning & Evening": "Subah o Shaam",
    },
  },
  hi: {
    tabCounter: "तस्बीह काउंटर",
    tabTodayDua: "आज की दुआ",
    tabDuaFinder: "दुआ संग्रह",
    tabChecklist: "दिनचर्या",
    tabDhikrCreator: "ज़िक्र बनाएं",
    todayLabel: "आज",
    beadsUnit: "दाने",
    learnedStat: "याद की गईं",
    tapToRecite: "पढ़ने के लिए टैप करें",
    target: "लक्ष्य",
    saveSession: "सत्र सहेजें",
    reset: "रीसेट",
    savedSessions: "सहेजे गए सत्र",
    reminders: "रिमाइंडर",
    suggestedNow: "वर्तमान समय की मसनून दुआएं",
    allDuasLink: "सभी दुआएं",
    listen: "सुनें",
    toneOn: "ध्वनि चालू",
    muted: "मौन",
    virtue: "फ़ज़ीलत",
    newCustomDhikr: "नया वज़ीफ़ा",
    notePlaceholder: "वैकल्पिक नोट (जैसे: फ़ज्र के बाद)…",
    saveToHistory: "सहेजें",
    close: "बंद करें",
    lifetimeTotal: "कुल संख्या",
    noSavedSessions: "अभी तक कोई सत्र सहेजा नहीं गया है। अपना दैनिक रिकॉर्ड रखने के लिए सत्र सहेजें।",
    browserAlerts: "अलर्ट चालू करें",
    addAlert: "रिमाइंडर जोड़ें",
    reminderPlaceholder: "रिमाइंडर का नाम…",
    active: "चालू",
    off: "बंद",
    duaOfTheDay: "आज की दुआ",
    whenToRecite: "अवसर",
    transliteration: "उच्चारण",
    translation: "अर्थ",
    markAsLearned: "याद हो गई",
    learned: "याद की गई",
    practiceOnTasbih: "तस्बीह पर अभ्यास",
    virtueAndReference: "फ़ज़ीलत और संदर्भ",
    wordBreakdown: "शब्दार्थ",
    testMemory: "अर्थ छुपाएं",
    exitTest: "अर्थ दिखाएं",
    tapToReveal: "अर्थ देखने के लिए टैप करें…",
    duaMastery: "सीखी गई दुआएं",
    searchDuasPlaceholder: "दुआएं खोजें…",
    savedFilter: "सहेजी गईं",
    allFilter: "सभी",
    reciteInTasbih: "तस्बीह में पढ़ें",
    copy: "कॉपी",
    copied: "कॉपी हो गया",
    dailyChecklist: "दैनिक सुन्नत व विर्द सूची",
    checklistSubtitle: "आज के पूरे किए गए आमाल पर निशान लगाएं या अपनी सूची संपादित करें।",
    completed: "पूर्ण",
    resetDefaults: "डिफ़ॉल्ट बहाल करें",
    createHabit: "नया अमल जोड़ें",
    editHabit: "अमल संपादित करें",
    cancelEdit: "रद्द करें",
    habitTitle: "अमल का नाम",
    habitSubtitle: "समय या नोट",
    habitCategory: "श्रेणी",
    saveHabit: "सहेजें",
    qazaTitle: "क़ज़ा-ए-उम्री ट्रैकर",
    qazaSubtitle: "छूटी हुई फ़र्ज़ और वित्र नमाज़ों का हिसाब रखें।",
    qazaYearsPlaceholder: "वर्ष दर्ज करें…",
    setLedger: "हिसाब सेट करें",
    litanyName: "वज़ीफ़ा / ज़िक्र का नाम",
    arabicText: "अरबी पाठ",
    urduMeaning: "उर्दू अनुवाद (वैकल्पिक)",
    meaning: "अर्थ",
    targetCount: "लक्ष्य संख्या",
    recommendedWindow: "उत्तम समय",
    virtueNote: "फ़ज़ीलत व संदर्भ",
    createDhikr: "ज़िक्र बनाएं",
    updateDhikr: "बदलाव सहेजें",
    customBadge: "निजी",
    countNow: "पढ़ें",
    litanyLibrary: "वज़ाइफ़ और अवराद",
    checklistCats: {
      All: "सभी",
      Morning: "सुबह",
      Salah: "नमाज़",
      Evening: "शाम",
      Sunnah: "सुन्नत",
    },
    duaCategories: {
      "Waking & Sleeping": "सोने व जागने की दुआएं",
      "Home & Travel": "घर व सफ़र",
      "Wudu & Masjid": "वुज़ू व मस्जिद",
      "Food & Sustenance": "भोजन व रिज़्क़",
      "Protection & Relief": "हिफ़ाज़त व राहत",
      "Forgiveness & Parents": "मग़फ़िरत व वालिदैन",
      "Knowledge & Success": "इल्म व कामयाबी",
      "Morning & Evening": "सुबह व शाम",
    },
  },
  tr: {
    tabCounter: "Tesbih",
    tabTodayDua: "Günün Duası",
    tabDuaFinder: "Dua Rehberi",
    tabChecklist: "Evrad",
    tabDhikrCreator: "Zikir Oluştur",
    todayLabel: "Bugün",
    beadsUnit: "tesbih",
    learnedStat: "Ezberlenen",
    tapToRecite: "Zikir İçin Dokun",
    target: "Hedef",
    saveSession: "Oturumu Kaydet",
    reset: "Sıfırla",
    savedSessions: "Kayıtlı Oturumlar",
    reminders: "Hatırlatıcılar",
    suggestedNow: "Bu Vakit İçin Önerilen Dualar",
    allDuasLink: "Tüm Dualar",
    listen: "Dinle",
    toneOn: "Ses Açık",
    muted: "Sessiz",
    virtue: "Fazilet",
    newCustomDhikr: "Özel Zikir",
    notePlaceholder: "İsteğe bağlı not (örn. Sabah namazı sonrası)…",
    saveToHistory: "Kaydet",
    close: "Kapat",
    lifetimeTotal: "Toplam",
    noSavedSessions: "Henüz kayıtlı oturum yok. Günlük zikirlerinizi takip etmek için kaydedin.",
    browserAlerts: "Bildirimleri Aç",
    addAlert: "Hatırlatıcı Ekle",
    reminderPlaceholder: "Hatırlatıcı başlığı…",
    active: "Açık",
    off: "Kapalı",
    duaOfTheDay: "Günün Duası",
    whenToRecite: "Okunma Vakti",
    transliteration: "Okunuş",
    translation: "Anlamı",
    markAsLearned: "Ezberlendi İşaretle",
    learned: "Ezberlendi",
    practiceOnTasbih: "Tesbihte Okuyun",
    virtueAndReference: "Fazilet ve Kaynak",
    wordBreakdown: "Kelime Anlamları",
    testMemory: "Anlamları Gizle",
    exitTest: "Anlamları Göster",
    tapToReveal: "Görmek için dokunun…",
    duaMastery: "Ezber Durumu",
    searchDuasPlaceholder: "Dualarda ara…",
    savedFilter: "Kayıtlı",
    allFilter: "Tümü",
    reciteInTasbih: "Tesbihe Aktar",
    copy: "Kopyala",
    copied: "Kopyalandı",
    dailyChecklist: "Günlük Sünnet ve Evrad Çetelesi",
    checklistSubtitle: "Tamamlanan sünnetleri işaretleyin veya kişisel evradınızı düzenleyin.",
    completed: "Tamamlandı",
    resetDefaults: "Varsayılana Dön",
    createHabit: "Yeni Evrad Ekle",
    editHabit: "Evradı Düzenle",
    cancelEdit: "İptal",
    habitTitle: "Evrad Başlığı",
    habitSubtitle: "Vakit veya Not",
    habitCategory: "Kategori",
    saveHabit: "Kaydet",
    qazaTitle: "Kaza Namazı Çetelesi",
    qazaSubtitle: "Geçmiş farz ve vacip vitir namazlarınızı takip edin.",
    qazaYearsPlaceholder: "Hesaplanacak yıl…",
    setLedger: "Hesapla",
    litanyName: "Zikir Adı",
    arabicText: "Arapça Metin",
    urduMeaning: "Urduca Tercüme (İsteğe bağlı)",
    meaning: "Anlamı",
    targetCount: "Hedef Sayı",
    recommendedWindow: "Tavsiye Edilen Vakit",
    virtueNote: "Fazilet ve Kaynak",
    createDhikr: "Zikir Oluştur",
    updateDhikr: "Güncelle",
    customBadge: "Özel",
    countNow: "Zikret",
    litanyLibrary: "Zikir ve Evrad Kitaplığı",
    checklistCats: {
      All: "Tümü",
      Morning: "Sabah",
      Salah: "Namaz",
      Evening: "Akşam",
      Sunnah: "Sünnet",
    },
    duaCategories: {
      "Waking & Sleeping": "Uyku ve Uyanma",
      "Home & Travel": "Ev ve Yolculuk",
      "Wudu & Masjid": "Abdest ve Mescid",
      "Food & Sustenance": "Yemek ve Rızık",
      "Protection & Relief": "Korunma ve İnşirah",
      "Forgiveness & Parents": "İstiğfar ve Anne-Baba",
      "Knowledge & Success": "İlim ve Muvaffakiyet",
      "Morning & Evening": "Sabah ve Akşam",
    },
  },
  bn: {
    tabCounter: "তাসবিহ",
    tabTodayDua: "আজকের দোয়া",
    tabDuaFinder: "দোয়া অনুসন্ধান",
    tabChecklist: "আমল তালিকা",
    tabDhikrCreator: "যিকির তৈরি",
    todayLabel: "আজ",
    beadsUnit: "দানা",
    learnedStat: "মুখস্থ",
    tapToRecite: "পাঠ করতে ট্যাপ করুন",
    target: "লক্ষ্য",
    saveSession: "সেশন সংরক্ষণ",
    reset: "রিসেট",
    savedSessions: "সংরক্ষিত সেশন",
    reminders: "রিমাইন্ডার",
    suggestedNow: "বর্তমান সময়ের মাসনুন দোয়া",
    allDuasLink: "সব দোয়া",
    listen: "শুনুন",
    toneOn: "শব্দ চালু",
    muted: "নীরব",
    virtue: "ফজিলত",
    newCustomDhikr: "নিজস্ব যিকির",
    notePlaceholder: "ঐচ্ছিক নোট (যেমন: ফজরের পর)…",
    saveToHistory: "সংরক্ষণ করুন",
    close: "বন্ধ করুন",
    lifetimeTotal: "সর্বমোট",
    noSavedSessions: "এখনও কোনো সেশন সংরক্ষিত নেই। আপনার দৈনিক যিকির সংরক্ষণ করুন।",
    browserAlerts: "অ্যালার্ট চালু করুন",
    addAlert: "রিমাইন্ডার যোগ",
    reminderPlaceholder: "রিমাইন্ডার শিরোনাম…",
    active: "চালু",
    off: "বন্ধ",
    duaOfTheDay: "আজকের দোয়া",
    whenToRecite: "পাঠের সময়",
    transliteration: "উচ্চারণ",
    translation: "অর্থ",
    markAsLearned: "মুখস্থ হিসেবে চিহ্নিত করুন",
    learned: "মুখস্থ",
    practiceOnTasbih: "তাসবিহতে অনুশীলন",
    virtueAndReference: "ফজিলত ও সূত্র",
    wordBreakdown: "শব্দার্থ",
    testMemory: "অর্থ লুকান",
    exitTest: "অর্থ দেখান",
    tapToReveal: "অর্থ দেখতে ট্যাপ করুন…",
    duaMastery: "দোয়া অগ্রগতি",
    searchDuasPlaceholder: "দোয়া অনুসন্ধান করুন…",
    savedFilter: "সংরক্ষিত",
    allFilter: "সব",
    reciteInTasbih: "তাসবিহতে পড়ুন",
    copy: "কপি",
    copied: "কপি হয়েছে",
    dailyChecklist: "দৈনিক সুন্নাহ ও অজিফা তালিকা",
    checklistSubtitle: "আজকের সম্পন্ন আমল চিহ্নিত করুন অথবা নিজের তালিকা সাজান।",
    completed: "সম্পন্ন",
    resetDefaults: "ডিফল্ট ফিরিয়ে আনুন",
    createHabit: "নতুন আমল যোগ করুন",
    editHabit: "আমল সম্পাদনা",
    cancelEdit: "বাতিল",
    habitTitle: "আমলের নাম",
    habitSubtitle: "সময় বা ফজিলত নোট",
    habitCategory: "বিভাগ",
    saveHabit: "সংরক্ষণ করুন",
    qazaTitle: "কাযায়ে উমরি হিসাব",
    qazaSubtitle: "ছুটে যাওয়া ফরজ ও বিতর নামাজের হিসাব রাখুন।",
    qazaYearsPlaceholder: "বছর লিখুন…",
    setLedger: "হিসাব সেট করুন",
    litanyName: "যিকিরের নাম",
    arabicText: "আরবি পাঠ",
    urduMeaning: "উর্দু অনুবাদ (ঐচ্ছিক)",
    meaning: "অর্থ",
    targetCount: "লক্ষ্য সংখ্যা",
    recommendedWindow: "উত্তম সময়",
    virtueNote: "ফজিলত ও সূত্র",
    createDhikr: "যিকির তৈরি করুন",
    updateDhikr: "আপডেট করুন",
    customBadge: "নিজস্ব",
    countNow: "পাঠ করুন",
    litanyLibrary: "যিকির ও অজিফা সংগ্রহ",
    checklistCats: {
      All: "সব",
      Morning: "সকাল",
      Salah: "নামাজ",
      Evening: "সন্ধ্যা",
      Sunnah: "সুন্নাহ",
    },
    duaCategories: {
      "Waking & Sleeping": "ঘুম ও জাগরণ",
      "Home & Travel": "ঘর ও সফর",
      "Wudu & Masjid": "ওযু ও মসজিদ",
      "Food & Sustenance": "খাবার ও রিযিক",
      "Protection & Relief": "নিরাপত্তা ও মুক্তি",
      "Forgiveness & Parents": "ক্ষমা ও পিতামাতা",
      "Knowledge & Success": "ইলম ও সাফল্য",
      "Morning & Evening": "সকাল ও সন্ধ্যা",
    },
  },
  fa: {
    tabCounter: "تسبیح‌شمار",
    tabTodayDua: "دعای روز",
    tabDuaFinder: "گنجینه دعا",
    tabChecklist: "برنامه اوراد",
    tabDhikrCreator: "ایجاد ذکر",
    todayLabel: "امروز",
    beadsUnit: "دانه",
    learnedStat: "حفظ‌شده",
    tapToRecite: "برای ذکر لمس کنید",
    target: "هدف",
    saveSession: "ذخیره جلسه",
    reset: "بازنشانی",
    savedSessions: "جلسات ذخیره‌شده",
    reminders: "یادآورها",
    suggestedNow: "دعاهای پیشنهادی وقت حاضر",
    allDuasLink: "همه دعاها",
    listen: "شنیدن",
    toneOn: "صدا روشن",
    muted: "بی‌صدا",
    virtue: "فضیلت",
    newCustomDhikr: "ذکر شخصی",
    notePlaceholder: "یادداشت اختیاری (مثلاً بعد از نماز صبح)…",
    saveToHistory: "ذخیره",
    close: "بستن",
    lifetimeTotal: "مجموع کل",
    noSavedSessions: "هنوز جلسه‌ای ذخیره نشده است. برای ثبت اذکار روزانه جلسه خود را ذخیره کنید.",
    browserAlerts: "فعال‌سازی اعلان",
    addAlert: "افزودن یادآور",
    reminderPlaceholder: "عنوان یادآور…",
    active: "فعال",
    off: "خاموش",
    duaOfTheDay: "دعای امروز",
    whenToRecite: "مناسبت",
    transliteration: "تلفظ",
    translation: "ترجمه و مفهوم",
    markAsLearned: "ثبت به‌عنوان حفظ‌شده",
    learned: "حفظ‌شده",
    practiceOnTasbih: "تمرین در تسبیح",
    virtueAndReference: "فضیلت و منبع",
    wordBreakdown: "معنای عبارات",
    testMemory: "پنهان کردن معانی",
    exitTest: "نمایش معانی",
    tapToReveal: "برای مشاهده لمس کنید…",
    duaMastery: "پیشرفت حفظ دعا",
    searchDuasPlaceholder: "جستجوی دعا…",
    savedFilter: "ذخیره‌شده",
    allFilter: "همه",
    reciteInTasbih: "ذکر در تسبیح",
    copy: "کپی",
    copied: "کپی شد",
    dailyChecklist: "برنامه روزانه سنت‌ها و اوراد",
    checklistSubtitle: "اعمال انجام‌شده امروز را علامت بزنید یا برنامه شخصی خود را ویرایش کنید.",
    completed: "تکمیل‌شده",
    resetDefaults: "بازگردانی پیش‌فرض",
    createHabit: "افزودن برنامه جدید",
    editHabit: "ویرایش برنامه",
    cancelEdit: "انصراف",
    habitTitle: "عنوان عمل",
    habitSubtitle: "زمان یا یادداشت فضیلت",
    habitCategory: "دسته‌بندی",
    saveHabit: "ذخیره",
    qazaTitle: "دفتر قضای عمری",
    qazaSubtitle: "ثبت و کسر نمازهای فرض و وتر قضا شده.",
    qazaYearsPlaceholder: "تعداد سال‌ها…",
    setLedger: "تنظیم دفتر",
    litanyName: "نام ذکر / ورد",
    arabicText: "متن عربی",
    urduMeaning: "ترجمه اردو / فارسی",
    meaning: "معنا",
    targetCount: "تعداد هدف",
    recommendedWindow: "زمان مستحب",
    virtueNote: "فضیلت و منبع",
    createDhikr: "ایجاد ذکر",
    updateDhikr: "ذخیره تغییرات",
    customBadge: "شخصی",
    countNow: "شروع ذکر",
    litanyLibrary: "مجموعه اذکار و اوراد",
    checklistCats: {
      All: "همه",
      Morning: "صبح",
      Salah: "نماز",
      Evening: "شامگاه",
      Sunnah: "سنت",
    },
    duaCategories: {
      "Waking & Sleeping": "خواب و بیداری",
      "Home & Travel": "خانه و سفر",
      "Wudu & Masjid": "وضو و مسجد",
      "Food & Sustenance": "غذا و رزق",
      "Protection & Relief": "حفاظت و گشایش",
      "Forgiveness & Parents": "استغفار و والدین",
      "Knowledge & Success": "علم و توفیق",
      "Morning & Evening": "اذکار صبح و شام",
    },
  },
  id: {
    tabCounter: "Tasbih",
    tabTodayDua: "Doa Hari Ini",
    tabDuaFinder: "Pencari Doa",
    tabChecklist: "Amalan",
    tabDhikrCreator: "Buat Dzikir",
    todayLabel: "Hari Ini",
    beadsUnit: "butir",
    learnedStat: "Dihafal",
    tapToRecite: "Ketuk untuk Dzikir",
    target: "Target",
    saveSession: "Simpan Sesi",
    reset: "Atur Ulang",
    savedSessions: "Sesi Tersimpan",
    reminders: "Pengingat",
    suggestedNow: "Disarankan untuk Waktu Saat Ini",
    allDuasLink: "Semua Doa",
    listen: "Dengar",
    toneOn: "Nada Aktif",
    muted: "Senyap",
    virtue: "Keutamaan",
    newCustomDhikr: "Dzikir Khusus",
    notePlaceholder: "Catatan opsional (mis. ba'da Subuh)…",
    saveToHistory: "Simpan",
    close: "Tutup",
    lifetimeTotal: "Total",
    noSavedSessions: "Belum ada sesi tersimpan. Simpan putaran tasbih untuk mencatat wirid harian Anda.",
    browserAlerts: "Aktifkan Notifikasi",
    addAlert: "Tambah Pengingat",
    reminderPlaceholder: "Judul pengingat…",
    active: "Aktif",
    off: "Nonaktif",
    duaOfTheDay: "Doa Hari Ini",
    whenToRecite: "Waktu Membaca",
    transliteration: "Transliterasi",
    translation: "Arti",
    markAsLearned: "Tandai Dihafal",
    learned: "Dihafal",
    practiceOnTasbih: "Latih di Tasbih",
    virtueAndReference: "Keutamaan & Riwayat",
    wordBreakdown: "Arti Per Frasa",
    testMemory: "Sembunyikan Arti",
    exitTest: "Tampilkan Arti",
    tapToReveal: "Ketuk untuk melihat arti…",
    duaMastery: "Progres Hafalan",
    searchDuasPlaceholder: "Cari doa…",
    savedFilter: "Tersimpan",
    allFilter: "Semua",
    reciteInTasbih: "Baca di Tasbih",
    copy: "Salin",
    copied: "Tersalin",
    dailyChecklist: "Daftar Sunnah & Wirid Harian",
    checklistSubtitle: "Ketuk amalan untuk menandai selesai hari ini atau ubah rutinitas Anda.",
    completed: "Selesai",
    resetDefaults: "Kembalikan Awal",
    createHabit: "Tambah Amalan Harian",
    editHabit: "Ubah Amalan",
    cancelEdit: "Batal",
    habitTitle: "Nama Amalan",
    habitSubtitle: "Waktu atau Catatan",
    habitCategory: "Kategori",
    saveHabit: "Simpan Amalan",
    qazaTitle: "Catatan Qadha Shalat",
    qazaSubtitle: "Catat dan kurangi shalat Fardhu dan Witir yang terlewat.",
    qazaYearsPlaceholder: "Jumlah tahun…",
    setLedger: "Hitung",
    litanyName: "Nama Wirid",
    arabicText: "Teks Arab",
    urduMeaning: "Terjemahan Urdu (Opsional)",
    meaning: "Arti",
    targetCount: "Target Hitungan",
    recommendedWindow: "Waktu Utama",
    virtueNote: "Keutamaan & Dalil",
    createDhikr: "Buat Dzikir",
    updateDhikr: "Simpan Perubahan",
    customBadge: "Khusus",
    countNow: "Mulai",
    litanyLibrary: "Pustaka Wirid & Dzikir",
    checklistCats: {
      All: "Semua",
      Morning: "Pagi",
      Salah: "Shalat",
      Evening: "Petang",
      Sunnah: "Sunnah",
    },
    duaCategories: {
      "Waking & Sleeping": "Tidur & Bangun",
      "Home & Travel": "Rumah & Safar",
      "Wudu & Masjid": "Wudhu & Masjid",
      "Food & Sustenance": "Makan & Rezeki",
      "Protection & Relief": "Perlindungan & Ketenangan",
      "Forgiveness & Parents": "Ampunan & Orang Tua",
      "Knowledge & Success": "Ilmu & Keberhasilan",
      "Morning & Evening": "Dzikir Pagi & Petang",
    },
  },
  fr: {
    tabCounter: "Chapelet",
    tabTodayDua: "Doua du Jour",
    tabDuaFinder: "Invocations",
    tabChecklist: "Routine",
    tabDhikrCreator: "Créer un Dhikr",
    todayLabel: "Aujourd'hui",
    beadsUnit: "grains",
    learnedStat: "Appris",
    tapToRecite: "Toucher pour réciter",
    target: "Objectif",
    saveSession: "Enregistrer la session",
    reset: "Réinitialiser",
    savedSessions: "Sessions enregistrées",
    reminders: "Rappels",
    suggestedNow: "Suggéré pour le moment actuel",
    allDuasLink: "Toutes les douas",
    listen: "Écouter",
    toneOn: "Son activé",
    muted: "Muet",
    virtue: "Vertu",
    newCustomDhikr: "Dhikr personnel",
    notePlaceholder: "Note facultative (ex. après Fajr)…",
    saveToHistory: "Enregistrer",
    close: "Fermer",
    lifetimeTotal: "Cumul",
    noSavedSessions: "Aucune session enregistrée. Sauvegardez une série pour suivre vos invocations.",
    browserAlerts: "Activer les alertes",
    addAlert: "Ajouter un rappel",
    reminderPlaceholder: "Titre du rappel…",
    active: "Actif",
    off: "Inactif",
    duaOfTheDay: "Doua du Jour",
    whenToRecite: "Occasion",
    transliteration: "Translittération",
    translation: "Sens",
    markAsLearned: "Marquer comme appris",
    learned: "Appris",
    practiceOnTasbih: "Réciter au Tasbih",
    virtueAndReference: "Vertu & Référence",
    wordBreakdown: "Mot à mot",
    testMemory: "Masquer le sens",
    exitTest: "Afficher le sens",
    tapToReveal: "Toucher pour révéler…",
    duaMastery: "Invocations apprises",
    searchDuasPlaceholder: "Rechercher des invocations…",
    savedFilter: "Favoris",
    allFilter: "Tout",
    reciteInTasbih: "Réciter au Tasbih",
    copy: "Copier",
    copied: "Copié",
    dailyChecklist: "Liste Quotidienne de Sunnas & Wird",
    checklistSubtitle: "Cochez vos pratiques accomplies aujourd'hui ou personnalisez votre routine.",
    completed: "Accompli",
    resetDefaults: "Par défaut",
    createHabit: "Nouvelle habitude",
    editHabit: "Modifier l'habitude",
    cancelEdit: "Annuler",
    habitTitle: "Intitulé",
    habitSubtitle: "Moment ou note",
    habitCategory: "Catégorie",
    saveHabit: "Enregistrer",
    qazaTitle: "Suivi Qada (Prières manquées)",
    qazaSubtitle: "Suivez et décrémentez vos prières Fard et Witr à rattraper.",
    qazaYearsPlaceholder: "Années à calculer…",
    setLedger: "Calculer",
    litanyName: "Nom de l'invocation",
    arabicText: "Texte arabe",
    urduMeaning: "Traduction ourdoue (Optionnel)",
    meaning: "Signification",
    targetCount: "Nombre cible",
    recommendedWindow: "Moment recommandé",
    virtueNote: "Vertu & Source",
    createDhikr: "Créer le Dhikr",
    updateDhikr: "Mettre à jour",
    customBadge: "Personnel",
    countNow: "Réciter",
    litanyLibrary: "Bibliothèque d'Awrad",
    checklistCats: {
      All: "Tout",
      Morning: "Matin",
      Salah: "Prière",
      Evening: "Soir",
      Sunnah: "Sunna",
    },
    duaCategories: {
      "Waking & Sleeping": "Sommeil & Réveil",
      "Home & Travel": "Foyer & Voyage",
      "Wudu & Masjid": "Ablutions & Mosquée",
      "Food & Sustenance": "Repas & Subsistance",
      "Protection & Relief": "Protection & Sérénité",
      "Forgiveness & Parents": "Pardon & Parents",
      "Knowledge & Success": "Savoir & Réussite",
      "Morning & Evening": "Matin & Soir",
    },
  },
};

const BUILT_IN_URDU_TRANSLATIONS: Record<string, string> = {
  // Built-in Tasbih Litanies
  "durood-razawiyya":
    "اللہ تعالیٰ نبیِ اُمّی اور اُن کی آل پر درود و سلام نازل فرمائے؛ صلوٰۃ و سلام ہو آپ پر یا رسول اللہ ﷺ۔",
  "tasbih-fatima":
    "اللہ پاک ہے (۳۳) • سب تعریفیں اللہ کے لیے ہیں (۳۳) • اللہ سب سے بڑا ہے (۳۴)۔",
  "durood-taj":
    "اے اللہ! ہمارے آقا و مولیٰ حضرت محمد ﷺ پر درود نازل فرما جو صاحبِ تاج و معراج و براق و علم ہیں اور بلا و وبا و قحط و مرض و الم کو دور فرمانے والے ہیں۔",
  "durood-ghausia":
    "اے اللہ! ہمارے آقا سیدنا محمد ﷺ پر درود و برکت اور سلام بھیج جو جود و کرم کی کان ہیں، اور آپ کی آلِ پاک پر بھی۔",
  istighfar:
    "میں عظمت والے اللہ سے بخشش مانگتا ہوں جس کے سوا کوئی معبود نہیں، وہ ہمیشہ زندہ اور قائم رکھنے والا ہے، اور میں اُسی کی بارگاہ میں توبہ کرتا ہوں۔",
  "durood-ibrahimi":
    "اے اللہ! حضرت محمد ﷺ اور آلِ محمد ﷺ پر رحمت بھیج جس طرح تو نے حضرت ابراہیم علیہ السلام اور آلِ ابراہیم پر رحمت بھیجی، بے شک تو تعریف والا بزرگی والا ہے۔",
  "la-hawla":
    "گناہ سے بچنے کی طاقت اور نیکی کرنے کی قوت نہیں مگر اللہ بلند و عظمت والے کی توفیق سے۔",
  hasbunallah:
    "ہمیں اللہ ہی کافی ہے اور وہ بہترین کارساز ہے، بہترین مولیٰ اور بہترین مددگار ہے۔",

  // Built-in Daily Duas
  "dua-sayyidul-istighfar":
    "اے اللہ! تو ہی میرا رب ہے، تیرے سوا کوئی معبود نہیں۔ تو نے مجھے پیدا فرمایا اور میں تیرا بندہ ہوں، اور اپنی طاقت بھر تیرے عہد اور وعدے پر قائم ہوں۔ اپنے کیے کے شر سے تیری پناہ مانگتا ہوں، مجھ پر تیری نعمت کا اقرار کرتا ہوں اور اپنے گناہ کا اعتراف کرتا ہوں، پس مجھے بخش دے کہ تیرے سوا کوئی گناہ نہیں بخشتا۔",
  "dua-waking-up":
    "سب تعریفیں اللہ کے لیے ہیں جس نے ہمیں نیند (موت کی مانند کیفیت) کے بعد دوبارہ زندگی عطا فرمائی اور اُسی کی طرف اٹھ کر جانا ہے۔",
  "dua-before-sleep":
    "اے اللہ! میں تیرے ہی نام کے ساتھ مرتا (سوتا) ہوں اور زندہ ہوتا (جاگتا) ہوں۔",
  "dua-leaving-home":
    "اللہ کے نام سے (نکلتا ہوں)، میں نے اللہ پر بھروسہ کیا، اور گناہ سے بچنے اور نیکی کرنے کی طاقت اللہ ہی کی طرف سے ہے۔",
  "dua-entering-home":
    "اللہ ہی کے نام سے ہم داخل ہوئے اور اللہ ہی کے نام سے باہر نکلے اور اپنے رب اللہ ہی پر ہم نے بھروسہ کیا۔",
  "dua-entering-masjid":
    "اے اللہ! میرے لیے اپنی رحمت کے دروازے کھول دے۔",
  "dua-after-wudu":
    "میں گواہی دیتا ہوں کہ اللہ کے سوا کوئی معبود نہیں، وہ اکیلا ہے اس کا کوئی شریک نہیں، اور گواہی دیتا ہوں کہ حضرت محمد ﷺ اس کے بندے اور رسول ہیں۔ اے اللہ! مجھے کثرت سے توبہ کرنے والوں اور پاک رہنے والوں میں شامل فرما۔",
  "dua-after-eating":
    "سب تعریفیں اللہ کے لیے ہیں جس نے مجھے یہ کھانا کھلایا اور میری کسی طاقت و قوت کے بغیر مجھے یہ رزق عطا فرمایا۔",
  "dua-rizq-debt":
    "اے اللہ! مجھے اپنے حلال رزق کے ذریعے حرام سے بے نیاز فرما دے اور اپنے فضل سے اپنے سوا سب سے غنی فرما دے۔",
  "dua-anxiety-distress":
    "اے اللہ! میں فکر و غم، عاجزی و سستی، بخل و بزدلی، قرض کے بوجھ اور لوگوں کے غلبے سے تیری پناہ مانگتا ہوں۔",
  "dua-protection-harm":
    "اللہ کے نام کے ساتھ جس کے نام کی برکت سے زمین اور آسمان کی کوئی چیز نقصان نہیں پہنچا سکتی، اور وہ خوب سننے والا، سب کچھ جاننے والا ہے۔",
  "dua-knowledge-study":
    "اے میرے رب! میرا سینہ کھول دے، میرا کام میرے لیے آسان فرما دے اور میری زبان کی گرہ کھول دے تاکہ لوگ میری بات سمجھیں۔ اے میرے رب! میرے علم میں اضافہ فرما۔",
  "dua-parents-mercy":
    "اے میرے رب! ان دونوں (والدین) پر رحم فرما جیسا کہ انہوں نے بچپن میں میری پرورش کی۔ اے ہمارے رب! حساب قائم ہونے کے دن میری، میرے والدین کی اور تمام مومنوں کی مغفرت فرما۔",
  "dua-travel-journey":
    "پاک ہے وہ ذات جس نے اس سواری کو ہمارے تابع کر دیا حالانکہ ہم اسے قابو میں لانے کی طاقت نہ رکھتے تھے، اور بے شک ہمیں اپنے رب ہی کی طرف لوٹ کر جانا ہے۔",
};

function resolveUrduTranslation(item: { id: string; urduTranslation?: string }): string | undefined {
  const cleanId = item.id.startsWith("dua-litany-")
    ? item.id.replace("dua-litany-", "")
    : item.id;
  return item.urduTranslation?.trim() || BUILT_IN_URDU_TRANSLATIONS[cleanId];
}

const STORAGE_CUSTOM_LITANIES = "auliya_custom_litanies_v1";
const STORAGE_SAVED_SESSIONS = "auliya_saved_tasbih_sessions_v1";
const STORAGE_REMINDERS = "auliya_dhikr_reminders_v1";
const STORAGE_CHECKLIST_ITEMS = "auliya_custom_checklist_v1";
const STORAGE_LEARNED_DUAS = "auliya_learned_duas_v1";
const STORAGE_FAVORITE_DUAS = "auliya_favorite_duas_v1";

const DEFAULT_REMINDERS: DhikrReminderConfig[] = [
  {
    id: "rem-morning",
    label: "Morning Adhkar & Istighfar",
    litanyId: "istighfar",
    time24h: "06:30",
    enabled: false,
  },
  {
    id: "rem-asr-durood",
    label: "Evening Durood-e-Razawiyya",
    litanyId: "durood-razawiyya",
    time24h: "17:15",
    enabled: false,
  },
  {
    id: "rem-night-tasbih",
    label: "Before Sleep Tasbih-e-Fatima",
    litanyId: "tasbih-fatima",
    time24h: "22:00",
    enabled: false,
  },
];

export default function TasbihPage() {
  const {
    now,
    lang,
    schedule,
    tasbihTotalToday,
    tasbihTarget,
    activeLitanyId,
    setActiveLitany,
    incrementTasbih,
    resetTasbihToday,
    sunnahChecks,
    toggleSunnah,
    qazaUmriRemaining,
    setQazaUmri,
    decrementQazaUmri,
  } = useApp();

  const ui = TASBIH_UI[lang] || TASBIH_UI.en;
  const preferUrdu = lang === "ur" || lang === "fa";

  const [activeTab, setActiveTab] = useState<ActiveTabId>("counter");

  // Persisted states
  const [customLitanies, setCustomLitanies] = useState<ExtendedLitany[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_LITANIES);
      return raw ? (JSON.parse(raw) as ExtendedLitany[]) : [];
    } catch {
      return [];
    }
  });

  const [savedSessions, setSavedSessions] = useState<SavedTasbihSession[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_SESSIONS);
      return raw ? (JSON.parse(raw) as SavedTasbihSession[]) : [];
    } catch {
      return [];
    }
  });

  const [reminders, setReminders] = useState<DhikrReminderConfig[]>(() => {
    if (typeof window === "undefined") return DEFAULT_REMINDERS;
    try {
      const raw = localStorage.getItem(STORAGE_REMINDERS);
      return raw ? (JSON.parse(raw) as DhikrReminderConfig[]) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });

  const [checklistItems, setChecklistItems] = useState<CustomChecklistItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_CHECKLIST_ITEMS;
    try {
      const raw = localStorage.getItem(STORAGE_CHECKLIST_ITEMS);
      return raw ? (JSON.parse(raw) as CustomChecklistItem[]) : DEFAULT_CHECKLIST_ITEMS;
    } catch {
      return DEFAULT_CHECKLIST_ITEMS;
    }
  });

  const [learnedDuaIds, setLearnedDuaIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_LEARNED_DUAS);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [favoriteDuaIds, setFavoriteDuaIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_FAVORITE_DUAS);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_LITANIES, JSON.stringify(customLitanies));
    } catch {
      // ignore storage quota errors
    }
  }, [customLitanies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_SESSIONS, JSON.stringify(savedSessions));
    } catch {
      // ignore
    }
  }, [savedSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REMINDERS, JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHECKLIST_ITEMS, JSON.stringify(checklistItems));
    } catch {
      // ignore
    }
  }, [checklistItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEARNED_DUAS, JSON.stringify(learnedDuaIds));
    } catch {
      // ignore
    }
  }, [learnedDuaIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITE_DUAS, JSON.stringify(favoriteDuaIds));
    } catch {
      // ignore
    }
  }, [favoriteDuaIds]);

  const [adHocDuaLitany, setAdHocDuaLitany] = useState<ExtendedLitany | null>(null);

  const allLitanies = useMemo<ExtendedLitany[]>(() => {
    const base: ExtendedLitany[] = [...TASBIH_LITANIES, ...customLitanies];
    if (adHocDuaLitany && !base.some((x) => x.id === adHocDuaLitany.id)) {
      return [adHocDuaLitany, ...base];
    }
    return base;
  }, [customLitanies, adHocDuaLitany]);

  const activeLitany = useMemo<ExtendedLitany>(
    () => allLitanies.find((l) => l.id === activeLitanyId) || allLitanies[0],
    [allLitanies, activeLitanyId]
  );

  // Counter UI states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionNote, setSessionNote] = useState<string>("");
  const [showSaveDrawer, setShowSaveDrawer] = useState<boolean>(false);
  const [showReminderDrawer, setShowReminderDrawer] = useState<boolean>(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Reminder Creator state
  const [newRemLabel, setNewRemLabel] = useState<string>("");
  const [newRemTime, setNewRemTime] = useState<string>("07:00");

  // Custom Dhikr Creator state
  const [editingLitanyId, setEditingLitanyId] = useState<string | null>(null);
  const [dhikrName, setDhikrName] = useState<string>("");
  const [dhikrArabic, setDhikrArabic] = useState<string>("");
  const [dhikrTranslit, setDhikrTranslit] = useState<string>("");
  const [dhikrTranslation, setDhikrTranslation] = useState<string>("");
  const [dhikrUrduTranslation, setDhikrUrduTranslation] = useState<string>("");
  const [dhikrFazilat, setDhikrFazilat] = useState<string>("");
  const [dhikrTarget, setDhikrTarget] = useState<number>(100);
  const [dhikrWindow, setDhikrWindow] = useState<string>("After Fajr & Maghrib");

  // Checklist Creator & Editor state
  const [checklistCategoryFilter, setChecklistCategoryFilter] =
    useState<ChecklistCatKey>("All");
  const [editingCheckId, setEditingCheckId] = useState<string | null>(null);
  const [checkLabelInput, setCheckLabelInput] = useState<string>("");
  const [checkSubtitleInput, setCheckSubtitleInput] = useState<string>("");
  const [checkCategoryInput, setCheckCategoryInput] = useState<
    "Morning" | "Salah" | "Evening" | "Sunnah"
  >("Sunnah");
  const [qazaYears, setQazaYears] = useState<string>("");

  // Today's Dua Learning state
  const [duaDayOffset, setDuaDayOffset] = useState<number>(0);
  const [memorizeQuizMode, setMemorizeQuizMode] = useState<boolean>(false);
  const [revealedWordIndices, setRevealedWordIndices] = useState<number[]>([]);

  // Dua Finder & Action Filter state
  const [duaSearchQuery, setDuaSearchQuery] = useState<string>("");
  const [selectedActionCategory, setSelectedActionCategory] = useState<
    DuaActionCategory | "All" | "Saved"
  >("All");
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 2600);
  }, []);

  const playSoftBeadTone = useCallback(
    (isMilestone: boolean) => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        const ctx = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(isMilestone ? 660 : 432, ctx.currentTime);
        gain.gain.setValueAtTime(isMilestone ? 0.065 : 0.024, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + (isMilestone ? 0.42 : 0.085)
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + (isMilestone ? 0.42 : 0.085));
      } catch {
        // ignore audio context restrictions
      }
    },
    [soundEnabled]
  );

  // Monitor Dhikr Reminders every minute against `now`
  useEffect(() => {
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const currentHm = `${hh}:${mm}`;
    const todayKey = now.toISOString().slice(0, 10);

    const due = reminders.find(
      (r) => r.enabled && r.time24h === currentHm && r.lastTriggeredDate !== todayKey
    );
    if (!due) return;

    Promise.resolve().then(() => {
      setReminders((prev) =>
        prev.map((item) =>
          item.id === due.id ? { ...item, lastTriggeredDate: todayKey } : item
        )
      );
      showToast(`${ui.reminders}: ${due.label}`);
      playSoftBeadTone(true);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification(`${ui.reminders} • ${due.label}`, {
            body: due.label,
          });
        } catch {
          // ignore
        }
      }
    });
  }, [now, reminders, playSoftBeadTone, showToast, ui.reminders]);

  const handleBeadIncrement = (step = 1) => {
    const next = tasbihTotalToday + step;
    const isMilestone =
      next === 33 || next === 66 || next === 99 || next === 100 || next === tasbihTarget;
    incrementTasbih(step);
    playSoftBeadTone(isMilestone);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(isMilestone ? [35, 25, 45] : 12);
      } catch {
        // ignore
      }
    }
  };

  const handleSaveCurrentSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (tasbihTotalToday <= 0) return;
    const localizedNextPrayer = localizePrayerName(lang, schedule.nextPrayer.label);
    const entry: SavedTasbihSession = {
      id: `sess-${Date.now()}`,
      litanyId: activeLitany.id,
      litanyName: activeLitany.name,
      arabic: activeLitany.arabic,
      count: tasbihTotalToday,
      target: tasbihTarget,
      note: sessionNote.trim() || localizedNextPrayer,
      savedAtIso: new Date().toISOString(),
    };
    setSavedSessions((prev) => [entry, ...prev]);
    setSessionNote("");
    setShowSaveDrawer(false);
    showToast(`${tp(lang, "Saved")}: ${activeLitany.name} (${tasbihTotalToday})`);
  };

  const handleSaveCustomDhikr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dhikrName.trim() || !dhikrArabic.trim()) return;
    const payload: ExtendedLitany = {
      id: editingLitanyId || `custom-dhikr-${Date.now()}`,
      name: dhikrName.trim(),
      arabic: dhikrArabic.trim(),
      transliteration: dhikrTranslit.trim() || dhikrName.trim(),
      translation: dhikrTranslation.trim() || dhikrUrduTranslation.trim() || dhikrName.trim(),
      urduTranslation: dhikrUrduTranslation.trim() || undefined,
      fazilat: dhikrFazilat.trim() || "-",
      defaultTarget: Math.max(1, Number(dhikrTarget) || 100),
      recommendedWindow: dhikrWindow.trim() || "Anytime",
    };

    if (editingLitanyId) {
      setCustomLitanies((prev) => prev.map((x) => (x.id === editingLitanyId ? payload : x)));
    } else {
      setCustomLitanies((prev) => [payload, ...prev]);
    }

    setActiveLitany(payload.id, payload.defaultTarget);
    setEditingLitanyId(null);
    setDhikrName("");
    setDhikrArabic("");
    setDhikrTranslit("");
    setDhikrTranslation("");
    setDhikrUrduTranslation("");
    setDhikrFazilat("");
    setDhikrTarget(100);
    showToast(`${tp(lang, "Saved")}: ${payload.name}`);
  };

  const handleEditCustomDhikr = (lit: ExtendedLitany) => {
    setEditingLitanyId(lit.id);
    setDhikrName(lit.name);
    setDhikrArabic(lit.arabic);
    setDhikrTranslit(lit.transliteration);
    setDhikrTranslation(lit.translation);
    setDhikrUrduTranslation(lit.urduTranslation || "");
    setDhikrFazilat(lit.fazilat);
    setDhikrTarget(lit.defaultTarget);
    setDhikrWindow(lit.recommendedWindow);
    setActiveTab("dhikr-creator");
  };

  const handleDeleteCustomDhikr = (id: string) => {
    setCustomLitanies((prev) => prev.filter((x) => x.id !== id));
    if (activeLitanyId === id) {
      setActiveLitany(TASBIH_LITANIES[0].id, TASBIH_LITANIES[0].defaultTarget);
    }
  };

  const handleSaveChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkLabelInput.trim()) return;
    if (editingCheckId) {
      setChecklistItems((prev) =>
        prev.map((item) =>
          item.id === editingCheckId
            ? {
                ...item,
                label: checkLabelInput.trim(),
                subtitle: checkSubtitleInput.trim() || item.subtitle,
                category: checkCategoryInput,
              }
            : item
        )
      );
    } else {
      const newItem: CustomChecklistItem = {
        id: `chk-${Date.now()}`,
        label: checkLabelInput.trim(),
        subtitle: checkSubtitleInput.trim() || ui.checklistCats[checkCategoryInput],
        category: checkCategoryInput,
        isCustom: true,
      };
      setChecklistItems((prev) => [newItem, ...prev]);
    }
    setEditingCheckId(null);
    setCheckLabelInput("");
    setCheckSubtitleInput("");
    showToast(tp(lang, "Saved"));
  };

  const todaysDua = useMemo(() => {
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const total = DAILY_DUAS_LIBRARY.length;
    const idx = (((dayOfYear + duaDayOffset) % total) + total) % total;
    return DAILY_DUAS_LIBRARY[idx];
  }, [now, duaDayOffset]);

  const currentWaqt = schedule.currentWaqt;
  const contextSuggestedDuas = useMemo(() => {
    const isFriday = now.getDay() === 5;
    const hr = now.getHours();

    let targetTag: SuggestedWaqtTag = "anytime";
    if (currentWaqt === "fajr" || (hr >= 4 && hr < 9)) targetTag = "fajr";
    else if (currentWaqt === "dhuhr" || (hr >= 11 && hr < 15)) targetTag = "dhuhr";
    else if (currentWaqt === "asr" || (hr >= 15 && hr < 18)) targetTag = "asr";
    else if (currentWaqt === "maghrib" || (hr >= 18 && hr < 20)) targetTag = "maghrib";
    else if (currentWaqt === "isha" || hr >= 20) targetTag = "isha";
    else if (hr < 4) targetTag = "tahajjud";

    return DAILY_DUAS_LIBRARY.filter(
      (d) =>
        d.suggestedWaqt.includes(targetTag) ||
        (isFriday && d.suggestedWaqt.includes("jumuah"))
    ).slice(0, 3);
  }, [currentWaqt, now]);

  const filteredDuas = useMemo(() => {
    const q = duaSearchQuery.trim().toLowerCase();
    return DAILY_DUAS_LIBRARY.filter((d) => {
      if (selectedActionCategory === "Saved" && !favoriteDuaIds.includes(d.id)) {
        return false;
      }
      if (
        selectedActionCategory !== "All" &&
        selectedActionCategory !== "Saved" &&
        d.actionCategory !== selectedActionCategory
      ) {
        return false;
      }
      if (!q) return true;
      const urduText = BUILT_IN_URDU_TRANSLATIONS[d.id] || "";
      return (
        d.title.toLowerCase().includes(q) ||
        d.actionTrigger.toLowerCase().includes(q) ||
        d.actionCategory.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        d.reference.toLowerCase().includes(q) ||
        d.arabic.includes(duaSearchQuery.trim()) ||
        urduText.includes(duaSearchQuery.trim())
      );
    });
  }, [duaSearchQuery, selectedActionCategory, favoriteDuaIds]);

  const launchDuaInTasbih = (dua: DuaEntry, customTarget?: number) => {
    const target = customTarget ?? dua.recommendedCount;
    const asLitany: ExtendedLitany = {
      id: `dua-litany-${dua.id}`,
      name: dua.title,
      arabic: dua.arabic,
      transliteration: dua.transliteration,
      translation: dua.translation,
      urduTranslation: BUILT_IN_URDU_TRANSLATIONS[dua.id],
      fazilat: `${dua.virtue} (${dua.reference})`,
      defaultTarget: target,
      recommendedWindow: dua.actionTrigger,
    };
    setAdHocDuaLitany(asLitany);
    setActiveLitany(asLitany.id, target);
    setActiveTab("counter");
  };

  const speakArabicDua = (arabicText: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      playSoftBeadTone(true);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(arabicText);
      utter.lang = "ar-SA";
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
    } catch {
      playSoftBeadTone(true);
    }
  };

  const copyDuaToClipboard = async (dua: DuaEntry) => {
    const urduLine = BUILT_IN_URDU_TRANSLATIONS[dua.id]
      ? `\n${BUILT_IN_URDU_TRANSLATIONS[dua.id]}\n`
      : "\n";
    const text = `${dua.title}\n\n${dua.arabic}\n${urduLine}"${dua.translation}"\n— ${dua.reference}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDuaId(dua.id);
      setTimeout(() => setCopiedDuaId(null), 2000);
    } catch {
      showToast(ui.copied);
    }
  };

  const toggleLearnedDua = (id: string) => {
    setLearnedDuaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleFavoriteDua = (id: string) => {
    setFavoriteDuaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const completedChecklistCount = useMemo(
    () => checklistItems.filter((item) => Boolean(sunnahChecks[item.id])).length,
    [checklistItems, sunnahChecks]
  );
  const checklistPct = Math.round(
    (completedChecklistCount / Math.max(1, checklistItems.length)) * 100
  );
  const filteredChecklist = useMemo(
    () =>
      checklistItems.filter(
        (item) =>
          checklistCategoryFilter === "All" || item.category === checklistCategoryFilter
      ),
    [checklistItems, checklistCategoryFilter]
  );

  const lifetimeBeadsCount = useMemo(
    () => savedSessions.reduce((acc, s) => acc + s.count, 0) + tasbihTotalToday,
    [savedSessions, tasbihTotalToday]
  );

  const activeLitanyUrdu = resolveUrduTranslation(activeLitany);
  const todaysDuaUrdu = resolveUrduTranslation(todaysDua);

  return (
    <div className="space-y-3.5 sm:space-y-6">
      {/* Calm Minimalist Editorial Header */}
      <header className="flex flex-wrap items-end justify-between gap-2 sm:gap-4 pb-0.5">
        <div className="space-y-0.5">
          <h1 className="text-xl sm:text-3xl font-bold tracking-tight">
            {t(lang, "navTasbih")}
          </h1>
          <p className="text-xs sm:text-sm hidden sm:block" style={{ color: "var(--text-muted)" }}>
            {t(lang, "tasbihSubtitle")}
          </p>
        </div>

        {/* Quiet Inline Summary Metrics */}
        <div
          className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-[11px] sm:text-xs"
          style={{ color: "var(--text-muted)" }}
        >
          <span>
            {ui.todayLabel}:{" "}
            <strong className="tabular-nums" style={{ color: "var(--text-primary)" }}>
              {tasbihTotalToday}
            </strong>{" "}
            {ui.beadsUnit}
          </span>
          <span aria-hidden="true" style={{ color: "var(--border-hairline)" }}>
            |
          </span>
          <span>
            {ui.tabChecklist}:{" "}
            <strong className="tabular-nums" style={{ color: "var(--accent-primary)" }}>
              {checklistPct}%
            </strong>
          </span>
          <span aria-hidden="true" style={{ color: "var(--border-hairline)" }}>
            |
          </span>
          <span>
            {ui.learnedStat}:{" "}
            <strong className="tabular-nums" style={{ color: "var(--accent-gold)" }}>
              {learnedDuaIds.length}/{DAILY_DUAS_LIBRARY.length}
            </strong>
          </span>
        </div>
      </header>

      {/* Editorial Pill Navigation Bar */}
      <div className="overflow-x-auto no-scrollbar pb-0.5">
        <nav className="pill-tab-bar min-w-max">
          {(
            [
              { id: "counter", label: ui.tabCounter, icon: Sparkles },
              { id: "today-dua", label: ui.tabTodayDua, icon: GraduationCap },
              { id: "dua-finder", label: ui.tabDuaFinder, icon: Compass },
              {
                id: "checklist",
                label: `${ui.tabChecklist} (${completedChecklistCount}/${checklistItems.length})`,
                icon: CheckCircle2,
              },
              {
                id: "dhikr-creator",
                label:
                  customLitanies.length > 0
                    ? `${ui.tabDhikrCreator} (${customLitanies.length})`
                    : ui.tabDhikrCreator,
                icon: Plus,
              },
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

      {/* Subtle Toast Banner */}
      <AnimatePresence>
        {toastBanner && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            className="px-4 py-2 rounded-2xl border text-xs font-medium flex items-center justify-between"
            style={{
              backgroundColor: "var(--accent-soft)",
              borderColor: "var(--border-hairline)",
              color: "var(--text-primary)",
            }}
          >
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" style={{ color: "var(--accent-primary)" }} />
              <span>{toastBanner}</span>
            </span>
            <button
              type="button"
              onClick={() => setToastBanner(null)}
              className="opacity-70 hover:opacity-100 cursor-pointer"
              aria-label={ui.close}
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          TAB 1: SERENE SCULPTURAL TASBIH COUNTER
         ===================================================================== */}
      {activeTab === "counter" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-start">
          {/* Centerpiece Counter Sanctuary */}
          <section className="lg:col-span-7 bento-card p-4 sm:p-8 space-y-3.5 sm:space-y-7">
            {/* Litany Selector Strip (Single-Line Horizontal Scroll on Mobile) */}
            <div className="flex items-center justify-between gap-2 overflow-x-auto no-scrollbar pb-0.5 sm:flex-wrap">
              <div className="flex items-center sm:flex-wrap gap-1.5 shrink-0 sm:shrink">
                {allLitanies.map((lit) => {
                  const active = lit.id === activeLitany.id;
                  return (
                    <button
                      key={lit.id}
                      type="button"
                      onClick={() => setActiveLitany(lit.id, lit.defaultTarget)}
                      className="px-3 py-1.5 rounded-full text-xs font-medium transition cursor-pointer border whitespace-nowrap shrink-0"
                      style={
                        active
                          ? {
                              backgroundImage: "var(--gradient-brand)",
                              color: "#ffffff",
                              borderColor: "transparent",
                            }
                          : {
                              backgroundColor: "var(--bg-elevated)",
                              color: "var(--text-secondary)",
                              borderColor: "var(--border-hairline)",
                            }
                      }
                    >
                      {lit.name}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("dhikr-creator")}
                className="px-3 py-1.5 rounded-full text-xs font-medium inline-flex items-center gap-1 cursor-pointer border transition hover:brightness-105 whitespace-nowrap shrink-0"
                style={{
                  borderColor: "var(--border-hairline)",
                  color: "var(--accent-gold)",
                  backgroundColor: "var(--gold-soft)",
                }}
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{ui.newCustomDhikr}</span>
              </button>
            </div>

            {/* Active Litany Editorial Display */}
            <div
              className="space-y-2 sm:space-y-3 pb-3 sm:pb-6 border-b"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <div className="flex items-center justify-between gap-2 text-xs">
                <span style={{ color: "var(--accent-gold)" }} className="font-medium truncate">
                  {activeLitany.recommendedWindow}
                </span>
                <div className="flex items-center gap-1.5 shrink-0">
                  <button
                    type="button"
                    onClick={() => speakArabicDua(activeLitany.arabic)}
                    className="px-2.5 py-1 rounded-full border text-xs inline-flex items-center gap-1.5 cursor-pointer transition hover:brightness-105"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Volume2 className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                    <span>{ui.listen}</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled((v) => !v)}
                    className="px-2.5 py-1 rounded-full border text-xs inline-flex items-center gap-1.5 cursor-pointer transition"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: soundEnabled ? "var(--accent-soft)" : "var(--bg-elevated)",
                      color: soundEnabled ? "var(--accent-primary)" : "var(--text-muted)",
                    }}
                  >
                    {soundEnabled ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                    <span>{soundEnabled ? ui.toneOn : ui.muted}</span>
                  </button>
                </div>
              </div>

              <p
                dir="rtl"
                className="font-arabic text-xl sm:text-3xl text-right leading-[1.9] sm:leading-[2.2]"
                style={{ color: "var(--text-primary)" }}
              >
                {activeLitany.arabic}
              </p>

              {preferUrdu && activeLitanyUrdu ? (
                <p
                  dir="rtl"
                  className="font-urdu text-sm sm:text-lg text-right leading-relaxed sm:leading-loose"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {activeLitanyUrdu}
                </p>
              ) : (
                <>
                  <p className="text-[11px] sm:text-xs italic line-clamp-2 sm:line-clamp-none" style={{ color: "var(--text-muted)" }}>
                    {activeLitany.transliteration}
                  </p>
                  <p className="text-xs sm:text-sm leading-relaxed line-clamp-2 sm:line-clamp-none" style={{ color: "var(--text-secondary)" }}>
                    {activeLitany.translation}
                  </p>
                </>
              )}

              {activeLitany.fazilat && activeLitany.fazilat !== "-" && (
                <p className="text-[11px] sm:text-xs leading-relaxed hidden sm:block" style={{ color: "var(--text-muted)" }}>
                  <strong style={{ color: "var(--accent-gold)" }}>{ui.virtue}:</strong>{" "}
                  {activeLitany.fazilat}
                </p>
              )}
            </div>

            {/* Sculptural Tactile Bead Counter Centerpiece */}
            <div className="py-1 sm:py-3 flex flex-col items-center justify-center">
              {(() => {
                const size = 248;
                const stroke = 8;
                const r = (size - stroke * 3) / 2;
                const circ = 2 * Math.PI * r;
                const pct = Math.min(1, tasbihTotalToday / Math.max(1, tasbihTarget));
                const angleRad = pct * 2 * Math.PI - Math.PI / 2;
                const beadX = size / 2 + r * Math.cos(angleRad);
                const beadY = size / 2 + r * Math.sin(angleRad);

                return (
                  <motion.button
                    type="button"
                    whileTap={{ scale: 0.972 }}
                    onClick={() => handleBeadIncrement(1)}
                    className="relative w-52 h-52 sm:w-[248px] sm:h-[248px] rounded-full flex items-center justify-center cursor-pointer select-none focus:outline-none group"
                    style={{
                      background:
                        "radial-gradient(circle at 50% 42%, color-mix(in srgb, var(--accent-primary) 13%, var(--bg-elevated)), var(--bg-surface) 74%)",
                      boxShadow: "0 18px 44px -16px var(--glow-primary)",
                    }}
                  >
                    <svg viewBox={`0 0 ${size} ${size}`} className="absolute inset-0 w-full h-full">
                      <defs>
                        <linearGradient id="sculpturalBeadArc" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="var(--accent-secondary)" />
                          <stop offset="100%" stopColor="var(--accent-primary)" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="var(--border-hairline)"
                        strokeWidth={stroke}
                      />
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="url(#sculpturalBeadArc)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - pct)}
                        transform={`rotate(-90 ${size / 2} ${size / 2})`}
                        style={{ transition: "stroke-dashoffset 0.24s ease" }}
                      />
                      <circle
                        cx={beadX}
                        cy={beadY}
                        r={6.5}
                        fill="var(--accent-gold)"
                        style={{ transition: "cx 0.24s ease, cy 0.24s ease" }}
                      />
                    </svg>

                    <div className="relative z-10 flex flex-col items-center justify-center text-center px-5">
                      <div className="flex items-baseline gap-1.5">
                        <span
                          className="text-4xl sm:text-6xl font-bold tracking-tight tabular-nums"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {tasbihTotalToday}
                        </span>
                        <span
                          className="text-xs sm:text-sm font-medium tabular-nums"
                          style={{ color: "var(--text-muted)" }}
                        >
                          / {tasbihTarget}
                        </span>
                      </div>
                      <span
                        className="mt-2 sm:mt-3 text-[11px] sm:text-xs font-semibold px-3 py-1 rounded-full transition group-hover:brightness-105"
                        style={{
                          backgroundColor: "var(--accent-soft)",
                          color: "var(--accent-primary)",
                        }}
                      >
                        {ui.tapToRecite}
                      </span>
                    </div>
                  </motion.button>
                );
              })()}
            </div>

            {/* Clean Counter Controls Footer */}
            <div
              className="pt-3 sm:pt-5 border-t space-y-2.5 sm:space-y-4"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <div className="flex flex-wrap items-center justify-between gap-3">
                {/* Multi-step increments */}
                <div className="flex items-center gap-1.5">
                  {[10, 33, 100].map((step) => (
                    <button
                      key={step}
                      type="button"
                      onClick={() => handleBeadIncrement(step)}
                      className="px-3 py-1.5 rounded-full border text-xs font-semibold tabular-nums cursor-pointer transition hover:brightness-105"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    >
                      +{step}
                    </button>
                  ))}
                </div>

                {/* Target selector */}
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {ui.target}:
                  </span>
                  {[33, 100, 313, 1000].map((val) => {
                    const active = tasbihTarget === val;
                    return (
                      <button
                        key={val}
                        type="button"
                        onClick={() => setActiveLitany(activeLitany.id, val)}
                        className="px-2.5 py-1 rounded-full text-xs font-semibold tabular-nums cursor-pointer border transition"
                        style={
                          active
                            ? {
                                backgroundColor: "var(--gold-soft)",
                                borderColor: "var(--accent-gold)",
                                color: "var(--accent-gold)",
                              }
                            : {
                                backgroundColor: "transparent",
                                borderColor: "var(--border-hairline)",
                                color: "var(--text-muted)",
                              }
                        }
                      >
                        {val}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons: Save Session, Reminders, Reset */}
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowSaveDrawer((v) => !v)}
                    className="px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition hover:brightness-105"
                    style={{
                      backgroundColor: "var(--accent-soft)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    <Bookmark className="w-3.5 h-3.5" />
                    <span>{ui.saveSession}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setShowReminderDrawer((v) => !v)}
                    className="px-3.5 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition hover:brightness-105"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <Bell className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                    <span>{ui.reminders}</span>
                  </button>
                </div>

                <button
                  type="button"
                  onClick={resetTasbihToday}
                  className="px-3 py-2 rounded-xl border text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer transition hover:brightness-105"
                  style={{
                    borderColor: "var(--border-hairline)",
                    color: "var(--text-muted)",
                  }}
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>{ui.reset}</span>
                </button>
              </div>

              {/* Save Session Drawer */}
              <AnimatePresence>
                {showSaveDrawer && (
                  <motion.form
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    onSubmit={handleSaveCurrentSession}
                    className="overflow-hidden"
                  >
                    <div
                      className="p-4 rounded-2xl border space-y-3"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">
                          {ui.saveSession} ({tasbihTotalToday}/{tasbihTarget})
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowSaveDrawer(false)}
                          className="cursor-pointer"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {ui.close}
                        </button>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-2">
                        <input
                          type="text"
                          value={sessionNote}
                          onChange={(e) => setSessionNote(e.target.value)}
                          placeholder={ui.notePlaceholder}
                          className="flex-1 px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                        <button
                          type="submit"
                          className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer shrink-0"
                        >
                          {ui.saveToHistory}
                        </button>
                      </div>
                    </div>
                  </motion.form>
                )}
              </AnimatePresence>

              {/* Reminder Scheduler Drawer */}
              <AnimatePresence>
                {showReminderDrawer && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="p-4 rounded-2xl border space-y-3"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-semibold">{ui.reminders}</span>
                        <button
                          type="button"
                          onClick={async () => {
                            if (typeof Notification !== "undefined") {
                              await Notification.requestPermission();
                              showToast(ui.browserAlerts);
                            }
                          }}
                          className="font-medium underline cursor-pointer"
                          style={{ color: "var(--accent-gold)" }}
                        >
                          {ui.browserAlerts}
                        </button>
                      </div>

                      <div
                        className="divide-y"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        {reminders.map((rem) => (
                          <div
                            key={rem.id}
                            className="py-2.5 flex items-center justify-between gap-2 text-xs"
                            style={{ borderColor: "var(--border-hairline)" }}
                          >
                            <div className="flex items-center gap-2.5 min-w-0">
                              <input
                                type="time"
                                value={rem.time24h}
                                onChange={(e) =>
                                  setReminders((prev) =>
                                    prev.map((x) =>
                                      x.id === rem.id ? { ...x, time24h: e.target.value } : x
                                    )
                                  )
                                }
                                className="px-2 py-1 rounded-lg border text-xs tabular-nums bg-transparent"
                                style={{ borderColor: "var(--border-hairline)" }}
                              />
                              <span className="font-medium truncate">{rem.label}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <button
                                type="button"
                                onClick={() =>
                                  setReminders((prev) =>
                                    prev.map((x) =>
                                      x.id === rem.id ? { ...x, enabled: !x.enabled } : x
                                    )
                                  )
                                }
                                className="px-2.5 py-1 rounded-full text-[11px] font-semibold border cursor-pointer"
                                style={
                                  rem.enabled
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
                                {rem.enabled ? ui.active : ui.off}
                              </button>
                              <button
                                type="button"
                                onClick={() =>
                                  setReminders((prev) => prev.filter((x) => x.id !== rem.id))
                                }
                                className="p-1 opacity-60 hover:opacity-100 cursor-pointer"
                                style={{ color: "var(--accent-danger)" }}
                                aria-label={tp(lang, "Delete")}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>

                      <form
                        onSubmit={(e) => {
                          e.preventDefault();
                          if (!newRemLabel.trim()) return;
                          setReminders((prev) => [
                            ...prev,
                            {
                              id: `rem-${Date.now()}`,
                              label: newRemLabel.trim(),
                              litanyId: activeLitany.id,
                              time24h: newRemTime,
                              enabled: true,
                            },
                          ]);
                          setNewRemLabel("");
                        }}
                        className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1"
                      >
                        <input
                          type="text"
                          value={newRemLabel}
                          onChange={(e) => setNewRemLabel(e.target.value)}
                          placeholder={ui.reminderPlaceholder}
                          className="sm:col-span-2 px-3 py-1.5 rounded-xl border text-xs bg-transparent focus:outline-none"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                        <input
                          type="time"
                          value={newRemTime}
                          onChange={(e) => setNewRemTime(e.target.value)}
                          className="px-2.5 py-1.5 rounded-xl border text-xs tabular-nums bg-transparent"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                        <button
                          type="submit"
                          className="btn-primary px-3 py-1.5 rounded-xl text-xs font-semibold cursor-pointer"
                        >
                          {ui.addAlert}
                        </button>
                      </form>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </section>

          {/* Right Column: Suggested for Current Time + Hairline Saved Sessions */}
          <aside className="lg:col-span-5 space-y-6">
            {/* Suggested Duas for Current Time */}
            <div className="bento-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold">{ui.suggestedNow}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {localizePrayerName(lang, schedule.currentWaqt)}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("dua-finder")}
                  className="text-xs font-semibold inline-flex items-center gap-1 cursor-pointer hover:underline"
                  style={{ color: "var(--accent-primary)" }}
                >
                  <span>{ui.allDuasLink}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl-mirror" />
                </button>
              </div>

              <div
                className="divide-y"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {contextSuggestedDuas.map((dua) => {
                  const duaUrdu = resolveUrduTranslation(dua);
                  return (
                    <div
                      key={dua.id}
                      className="py-3.5 first:pt-0 last:pb-0 space-y-2"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-semibold">{dua.title}</span>
                        <span
                          className="text-[11px] shrink-0"
                          style={{ color: "var(--accent-gold)" }}
                        >
                          {dua.actionTrigger}
                        </span>
                      </div>
                      <p
                        dir="rtl"
                        className="font-arabic text-lg text-right leading-loose"
                      >
                        {dua.arabic}
                      </p>
                      {preferUrdu && duaUrdu ? (
                        <p
                          dir="rtl"
                          className="font-urdu text-sm text-right leading-loose line-clamp-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {duaUrdu}
                        </p>
                      ) : (
                        <p
                          className="text-xs line-clamp-2"
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {dua.translation}
                        </p>
                      )}
                      <div className="flex items-center justify-between pt-0.5">
                        <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {dua.reference}
                        </span>
                        <button
                          type="button"
                          onClick={() => launchDuaInTasbih(dua)}
                          className="px-2.5 py-1 rounded-full border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition hover:brightness-105"
                          style={{
                            borderColor: "var(--border-hairline)",
                            backgroundColor: "var(--bg-elevated)",
                            color: "var(--accent-primary)",
                          }}
                        >
                          <Play className="w-3 h-3" />
                          <span>{dua.recommendedCount}x</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Hairline-Divided Saved Sessions */}
            <div className="bento-card p-5 sm:p-6 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold inline-flex items-center gap-1.5">
                    <History className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                    <span>
                      {ui.savedSessions} ({savedSessions.length})
                    </span>
                  </h2>
                  <p className="text-xs mt-0.5 tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {ui.lifetimeTotal}: {lifetimeBeadsCount.toLocaleString()} {ui.beadsUnit}
                  </p>
                </div>
                {!showSaveDrawer && tasbihTotalToday > 0 && (
                  <button
                    type="button"
                    onClick={() => setShowSaveDrawer(true)}
                    className="text-xs font-semibold cursor-pointer hover:underline"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    + {ui.saveSession}
                  </button>
                )}
              </div>

              {savedSessions.length === 0 ? (
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {ui.noSavedSessions}
                </p>
              ) : (
                <div
                  className="divide-y max-h-64 overflow-y-auto pr-1"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  {savedSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="py-2.5 first:pt-0 last:pb-0 flex items-center justify-between gap-2 text-xs"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      <div className="min-w-0">
                        <div className="font-semibold truncate">
                          {sess.litanyName}{" "}
                          <span
                            className="tabular-nums font-bold"
                            style={{ color: "var(--accent-primary)" }}
                          >
                            {sess.count}/{sess.target}
                          </span>
                        </div>
                        <div
                          className="text-[11px] truncate"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {sess.note} •{" "}
                          {new Date(sess.savedAtIso).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                          })}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSavedSessions((prev) => prev.filter((x) => x.id !== sess.id))
                        }
                        className="p-1.5 opacity-60 hover:opacity-100 cursor-pointer shrink-0"
                        style={{ color: "var(--accent-danger)" }}
                        aria-label={tp(lang, "Delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          TAB 2: TODAY'S DUA
         ===================================================================== */}
      {activeTab === "today-dua" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8 bento-card p-6 sm:p-8 space-y-6">
            {/* Header & Day Scrubber */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <div>
                <span className="text-xs font-medium" style={{ color: "var(--accent-gold)" }}>
                  {ui.duaOfTheDay}
                </span>
                <h2 className="text-xl sm:text-2xl font-bold mt-0.5">{todaysDua.title}</h2>
              </div>

              <div
                className="inline-flex items-center gap-1 rounded-full border p-1"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-hairline)",
                }}
              >
                <button
                  type="button"
                  onClick={() => {
                    setDuaDayOffset((d) => d - 1);
                    setRevealedWordIndices([]);
                  }}
                  className="p-1.5 rounded-full cursor-pointer hover:brightness-105"
                  aria-label={tp(lang, "Previous")}
                >
                  <ChevronLeft className="w-4 h-4 rtl-mirror" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDuaDayOffset(0);
                    setRevealedWordIndices([]);
                  }}
                  className="px-3 py-1 text-xs font-semibold tabular-nums cursor-pointer"
                >
                  {duaDayOffset === 0
                    ? ui.todayLabel
                    : duaDayOffset > 0
                    ? `+${duaDayOffset}`
                    : `${duaDayOffset}`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDuaDayOffset((d) => d + 1);
                    setRevealedWordIndices([]);
                  }}
                  className="p-1.5 rounded-full cursor-pointer hover:brightness-105"
                  aria-label={tp(lang, "Next")}
                >
                  <ChevronRight className="w-4 h-4 rtl-mirror" />
                </button>
              </div>
            </div>

            {/* Occasion & Audio/Copy Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <div className="flex flex-wrap items-center gap-2">
                <span className="badge-pill badge-gold">
                  {ui.whenToRecite}: {todaysDua.actionTrigger}
                </span>
                <span style={{ color: "var(--text-muted)" }}>
                  {ui.duaCategories[todaysDua.actionCategory]}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => speakArabicDua(todaysDua.arabic)}
                  className="px-3 py-1.5 rounded-full border font-medium inline-flex items-center gap-1.5 cursor-pointer"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  <Volume2 className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                  <span>{ui.listen}</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyDuaToClipboard(todaysDua)}
                  className="px-3 py-1.5 rounded-full border font-medium inline-flex items-center gap-1.5 cursor-pointer"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  {copiedDuaId === todaysDua.id ? (
                    <>
                      <Check className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                      <span>{ui.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>{ui.copy}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Vocalized Arabic & Prioritized Translation */}
            <div
              className="p-6 rounded-2xl border space-y-4"
              style={{
                backgroundColor: "var(--bg-elevated)",
                borderColor: "var(--border-hairline)",
              }}
            >
              <p
                dir="rtl"
                className="font-arabic text-2xl sm:text-3xl text-right leading-[2.2]"
              >
                {todaysDua.arabic}
              </p>

              <div
                className="pt-3 border-t space-y-2.5"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {preferUrdu && todaysDuaUrdu && (
                  <p
                    dir="rtl"
                    className="font-urdu text-base sm:text-lg text-right leading-loose"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {todaysDuaUrdu}
                  </p>
                )}

                <div>
                  <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                    {ui.transliteration}
                  </div>
                  <p className="text-sm italic mt-0.5" style={{ color: "var(--text-secondary)" }}>
                    {todaysDua.transliteration}
                  </p>
                </div>

                {(!preferUrdu || !todaysDuaUrdu) && (
                  <div>
                    <div className="text-[11px] font-medium" style={{ color: "var(--text-muted)" }}>
                      {ui.translation}
                    </div>
                    <p className="text-sm leading-relaxed mt-0.5">{todaysDua.translation}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Phrase Breakdown & Memory Self-Test */}
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-xs font-semibold" style={{ color: "var(--text-secondary)" }}>
                  {ui.wordBreakdown}
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setMemorizeQuizMode((v) => !v);
                    setRevealedWordIndices([]);
                  }}
                  className="px-3 py-1 rounded-full text-xs font-medium border cursor-pointer"
                  style={{
                    borderColor: memorizeQuizMode
                      ? "var(--accent-gold)"
                      : "var(--border-hairline)",
                    backgroundColor: memorizeQuizMode
                      ? "var(--gold-soft)"
                      : "var(--bg-elevated)",
                    color: memorizeQuizMode ? "var(--accent-gold)" : "var(--text-secondary)",
                  }}
                >
                  {memorizeQuizMode ? ui.exitTest : ui.testMemory}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {todaysDua.wordBreakdown.map((chip, idx) => {
                  const revealed = !memorizeQuizMode || revealedWordIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (!memorizeQuizMode) return;
                        setRevealedWordIndices((prev) =>
                          prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                        );
                      }}
                      className="p-3 rounded-2xl border text-start transition cursor-pointer"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <div
                        dir="rtl"
                        className="font-arabic text-xl text-right"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        {chip.arabic}
                      </div>
                      <div className="text-xs font-semibold mt-1">{chip.translit}</div>
                      <div className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {revealed ? chip.meaning : ui.tapToReveal}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Footer: Mark as Learned & Practice on Tasbih */}
            <div
              className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <button
                type="button"
                onClick={() => toggleLearnedDua(todaysDua.id)}
                className="px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-2 border cursor-pointer transition"
                style={
                  learnedDuaIds.includes(todaysDua.id)
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
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {learnedDuaIds.includes(todaysDua.id) ? ui.learned : ui.markAsLearned}
                </span>
              </button>

              <div className="flex flex-wrap items-center gap-1.5">
                {[3, 7, 33].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => launchDuaInTasbih(todaysDua, cnt)}
                    className="px-3 py-2 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition hover:brightness-105"
                    style={{
                      backgroundColor: "var(--gold-soft)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--accent-gold)",
                    }}
                  >
                    <Play className="w-3 h-3" />
                    <span>
                      {ui.practiceOnTasbih} ({cnt}x)
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right Sidebar: Virtue & Reference + Mastery List */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="bento-card p-5 sm:p-6 space-y-3">
              <h3 className="text-sm font-bold" style={{ color: "var(--accent-gold)" }}>
                {ui.virtueAndReference}
              </h3>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                {todaysDua.virtue}
              </p>
              <div
                className="text-xs pt-2 border-t"
                style={{
                  borderColor: "var(--border-hairline)",
                  color: "var(--text-muted)",
                }}
              >
                {todaysDua.reference}
              </div>
            </div>

            <div className="bento-card p-5 sm:p-6 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <h3 className="text-sm font-bold">
                  {ui.duaMastery} ({learnedDuaIds.length}/{DAILY_DUAS_LIBRARY.length})
                </h3>
                <span className="font-bold tabular-nums" style={{ color: "var(--accent-primary)" }}>
                  {Math.round((learnedDuaIds.length / DAILY_DUAS_LIBRARY.length) * 100)}%
                </span>
              </div>
              <div
                className="divide-y max-h-80 overflow-y-auto pr-1"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {DAILY_DUAS_LIBRARY.map((d, idx) => {
                  const isLearned = learnedDuaIds.includes(d.id);
                  const isCurrent = d.id === todaysDua.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        const dayOfYear = Math.floor(
                          (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
                        );
                        setDuaDayOffset(idx - (dayOfYear % DAILY_DUAS_LIBRARY.length));
                      }}
                      className="w-full text-start py-2.5 px-2 rounded-lg text-xs flex items-center justify-between gap-2 cursor-pointer transition"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: isCurrent ? "var(--bg-elevated)" : "transparent",
                      }}
                    >
                      <span className="truncate font-medium">
                        {idx + 1}. {d.title}
                      </span>
                      <CheckCircle2
                        className="w-4 h-4 shrink-0"
                        style={{
                          color: isLearned ? "var(--accent-primary)" : "var(--border-hairline)",
                        }}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          TAB 3: DUA FINDER & ACTION DUAS
         ===================================================================== */}
      {activeTab === "dua-finder" && (
        <div className="space-y-5">
          <div className="bento-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div
                className="flex-1 flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl border"
                style={{
                  backgroundColor: "var(--bg-elevated)",
                  borderColor: "var(--border-hairline)",
                }}
              >
                <Search className="w-4 h-4 shrink-0" style={{ color: "var(--text-muted)" }} />
                <input
                  type="text"
                  value={duaSearchQuery}
                  onChange={(e) => setDuaSearchQuery(e.target.value)}
                  placeholder={ui.searchDuasPlaceholder}
                  className="w-full bg-transparent text-xs sm:text-sm focus:outline-none"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedActionCategory(
                    selectedActionCategory === "Saved" ? "All" : "Saved"
                  )
                }
                className="px-4 py-2.5 rounded-xl text-xs font-semibold border inline-flex items-center justify-center gap-1.5 cursor-pointer"
                style={
                  selectedActionCategory === "Saved"
                    ? {
                        backgroundColor: "var(--gold-soft)",
                        borderColor: "var(--accent-gold)",
                        color: "var(--accent-gold)",
                      }
                    : {
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-secondary)",
                      }
                }
              >
                <Heart className="w-3.5 h-3.5" />
                <span>
                  {ui.savedFilter} ({favoriteDuaIds.length})
                </span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedActionCategory("All")}
                className="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition"
                style={
                  selectedActionCategory === "All"
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
                {ui.allFilter} ({DAILY_DUAS_LIBRARY.length})
              </button>
              {DUA_ACTION_CATEGORIES.map((cat) => {
                const active = selectedActionCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedActionCategory(cat)}
                    className="px-3 py-1.5 rounded-full text-xs font-medium border cursor-pointer transition"
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
                    {ui.duaCategories[cat]}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Editorial Grid of Duas */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDuas.map((dua) => {
              const isFav = favoriteDuaIds.includes(dua.id);
              const isLearned = learnedDuaIds.includes(dua.id);
              const duaUrdu = resolveUrduTranslation(dua);

              return (
                <article
                  key={dua.id}
                  className="bento-card p-5 sm:p-6 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="text-[11px] font-medium" style={{ color: "var(--accent-gold)" }}>
                          {dua.actionTrigger}
                        </span>
                        <h3 className="text-base font-bold mt-0.5">{dua.title}</h3>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleFavoriteDua(dua.id)}
                          className="p-2 rounded-xl border cursor-pointer"
                          style={{
                            borderColor: isFav ? "var(--accent-gold)" : "var(--border-hairline)",
                            color: isFav ? "var(--accent-gold)" : "var(--text-muted)",
                          }}
                          aria-label={ui.savedFilter}
                        >
                          <Heart className={`w-3.5 h-3.5 ${isFav ? "fill-current" : ""}`} />
                        </button>
                        <button
                          type="button"
                          onClick={() => speakArabicDua(dua.arabic)}
                          className="p-2 rounded-xl border cursor-pointer"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-secondary)",
                          }}
                          aria-label={ui.listen}
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyDuaToClipboard(dua)}
                          className="p-2 rounded-xl border cursor-pointer"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-secondary)",
                          }}
                          aria-label={ui.copy}
                        >
                          {copiedDuaId === dua.id ? (
                            <Check className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <p
                      dir="rtl"
                      className="font-arabic text-xl sm:text-2xl text-right leading-[2.15] p-4 rounded-2xl"
                      style={{ backgroundColor: "var(--bg-elevated)" }}
                    >
                      {dua.arabic}
                    </p>

                    {preferUrdu && duaUrdu ? (
                      <p
                        dir="rtl"
                        className="font-urdu text-base text-right leading-loose"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {duaUrdu}
                      </p>
                    ) : (
                      <>
                        <p className="text-xs italic" style={{ color: "var(--text-muted)" }}>
                          {dua.transliteration}
                        </p>
                        <p className="text-xs leading-relaxed" style={{ color: "var(--text-secondary)" }}>
                          {dua.translation}
                        </p>
                      </>
                    )}
                  </div>

                  <div
                    className="pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {dua.reference}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleLearnedDua(dua.id)}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-medium border cursor-pointer"
                        style={
                          isLearned
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
                        {isLearned ? ui.learned : ui.markAsLearned}
                      </button>
                      <button
                        type="button"
                        onClick={() => launchDuaInTasbih(dua)}
                        className="btn-primary px-3 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>
                          {ui.reciteInTasbih} ({dua.recommendedCount}x)
                        </span>
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: CHECKLIST & QAZA-E-UMRI TRACKER
         ===================================================================== */}
      {activeTab === "checklist" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Daily Checklist */}
          <div className="lg:col-span-7 bento-card p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold">{ui.dailyChecklist}</h2>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {ui.checklistSubtitle}
                </p>
              </div>
              <div className="text-end">
                <div
                  className="text-lg font-bold tabular-nums"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {completedChecklistCount} / {checklistItems.length}
                </div>
                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {ui.completed} ({checklistPct}%)
                </div>
              </div>
            </div>

            <div
              className="w-full h-1.5 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--bg-elevated)" }}
            >
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${checklistPct}%`,
                  backgroundImage: "var(--gradient-brand)",
                }}
              />
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {(["All", "Morning", "Salah", "Evening", "Sunnah"] as const).map((cat) => {
                  const active = checklistCategoryFilter === cat;
                  return (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setChecklistCategoryFilter(cat)}
                      className="px-3 py-1 rounded-full text-xs font-medium border cursor-pointer"
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
                      {ui.checklistCats[cat]}
                    </button>
                  );
                })}
              </div>
              <button
                type="button"
                onClick={() => setChecklistItems(DEFAULT_CHECKLIST_ITEMS)}
                className="text-xs cursor-pointer hover:underline"
                style={{ color: "var(--text-muted)" }}
              >
                {ui.resetDefaults}
              </button>
            </div>

            <div
              className="divide-y"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              {filteredChecklist.map((item) => {
                const done = Boolean(sunnahChecks[item.id]);
                return (
                  <div
                    key={item.id}
                    className="py-3 first:pt-0 last:pb-0 flex items-center justify-between gap-3"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSunnah(item.id)}
                      className="flex-1 flex items-start gap-3 text-start cursor-pointer"
                    >
                      <CheckCircle2
                        className="w-5 h-5 mt-0.5 shrink-0"
                        style={{
                          color: done ? "var(--accent-primary)" : "var(--text-muted)",
                        }}
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-semibold">{item.label}</div>
                        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {item.subtitle} •{" "}
                          <span style={{ color: "var(--accent-gold)" }}>
                            {ui.checklistCats[item.category]}
                          </span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCheckId(item.id);
                          setCheckLabelInput(item.label);
                          setCheckSubtitleInput(item.subtitle);
                          setCheckCategoryInput(item.category);
                        }}
                        className="p-1.5 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
                        aria-label={tp(lang, "Edit")}
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setChecklistItems((prev) => prev.filter((x) => x.id !== item.id))
                        }
                        className="p-1.5 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
                        style={{ color: "var(--accent-danger)" }}
                        aria-label={tp(lang, "Delete")}
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Checklist Editor + Qaza-e-Umri Tracker */}
          <aside className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleSaveChecklistItem}
              className="bento-card p-5 sm:p-6 space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold">
                  {editingCheckId ? ui.editHabit : ui.createHabit}
                </h3>
                {editingCheckId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCheckId(null);
                      setCheckLabelInput("");
                      setCheckSubtitleInput("");
                    }}
                    className="text-xs cursor-pointer"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {ui.cancelEdit}
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                    {ui.habitTitle}
                  </label>
                  <input
                    type="text"
                    required
                    value={checkLabelInput}
                    onChange={(e) => setCheckLabelInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                    {ui.habitSubtitle}
                  </label>
                  <input
                    type="text"
                    value={checkSubtitleInput}
                    onChange={(e) => setCheckSubtitleInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>

                <div>
                  <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                    {ui.habitCategory}
                  </label>
                  <select
                    value={checkCategoryInput}
                    onChange={(e) =>
                      setCheckCategoryInput(
                        e.target.value as "Morning" | "Salah" | "Evening" | "Sunnah"
                      )
                    }
                    className="ui-select w-full px-3 py-2 rounded-xl border text-xs"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <option value="Morning">{ui.checklistCats.Morning}</option>
                    <option value="Salah">{ui.checklistCats.Salah}</option>
                    <option value="Evening">{ui.checklistCats.Evening}</option>
                    <option value="Sunnah">{ui.checklistCats.Sunnah}</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="btn-primary w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
              >
                {ui.saveHabit}
              </button>
            </form>

            {/* Qaza-e-Umri Prayer Ledger */}
            <div className="bento-card p-5 sm:p-6 space-y-3.5">
              <div>
                <h3 className="text-base font-bold">{ui.qazaTitle}</h3>
                <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                  {ui.qazaSubtitle}
                </p>
              </div>

              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const years = Math.max(0, Math.min(80, parseFloat(qazaYears) || 0));
                  const n = Math.round(years * 365);
                  setQazaUmri({ fajr: n, dhuhr: n, asr: n, maghrib: n, isha: n, witr: n });
                  setQazaYears("");
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="number"
                  min={0}
                  max={80}
                  step="0.5"
                  value={qazaYears}
                  onChange={(e) => setQazaYears(e.target.value)}
                  placeholder={ui.qazaYearsPlaceholder}
                  className="flex-1 px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{
                    backgroundColor: "var(--gold-soft)",
                    borderColor: "var(--border-hairline)",
                    color: "var(--accent-gold)",
                  }}
                >
                  {ui.setLedger}
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"] as const).map((p) => (
                  <div
                    key={p}
                    className="p-2.5 rounded-xl border flex items-center justify-between gap-1.5"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <div className="min-w-0">
                      <div
                        className="text-[11px] font-medium truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {localizePrayerName(lang, p)}
                      </div>
                      <div className="text-sm font-bold tabular-nums">
                        {qazaUmriRemaining[p as PrayerName | "witr"]}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => decrementQazaUmri(p as PrayerName | "witr")}
                      className="px-2 py-1 rounded-lg border text-[11px] font-bold tabular-nums cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        color: "var(--accent-primary)",
                      }}
                    >
                      -1
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          TAB 5: CUSTOM DHIKR CREATOR
         ===================================================================== */}
      {activeTab === "dhikr-creator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <form
            onSubmit={handleSaveCustomDhikr}
            className="lg:col-span-6 bento-card p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">
                {editingLitanyId ? ui.updateDhikr : ui.createDhikr}
              </h2>
              {editingLitanyId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingLitanyId(null);
                    setDhikrName("");
                    setDhikrArabic("");
                    setDhikrTranslit("");
                    setDhikrTranslation("");
                    setDhikrUrduTranslation("");
                    setDhikrFazilat("");
                  }}
                  className="text-xs cursor-pointer"
                  style={{ color: "var(--text-muted)" }}
                >
                  {ui.cancelEdit}
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                  {ui.litanyName} *
                </label>
                <input
                  type="text"
                  required
                  value={dhikrName}
                  onChange={(e) => setDhikrName(e.target.value)}
                  placeholder="Ya Hayyu Ya Qayyum"
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>

              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                  {ui.targetCount} *
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={dhikrTarget}
                  onChange={(e) => setDhikrTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border text-xs tabular-nums bg-transparent focus:outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                {ui.arabicText} *
              </label>
              <input
                type="text"
                required
                dir="rtl"
                value={dhikrArabic}
                onChange={(e) => setDhikrArabic(e.target.value)}
                placeholder="يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ"
                className="w-full px-3 py-2.5 rounded-xl border font-arabic text-xl text-right bg-transparent focus:outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                {ui.transliteration}
              </label>
              <input
                type="text"
                value={dhikrTranslit}
                onChange={(e) => setDhikrTranslit(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                {ui.meaning}
              </label>
              <input
                type="text"
                value={dhikrTranslation}
                onChange={(e) => setDhikrTranslation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                {ui.urduMeaning}
              </label>
              <input
                type="text"
                dir="rtl"
                value={dhikrUrduTranslation}
                onChange={(e) => setDhikrUrduTranslation(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border font-urdu text-sm text-right bg-transparent focus:outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                  {ui.recommendedWindow}
                </label>
                <input
                  type="text"
                  value={dhikrWindow}
                  onChange={(e) => setDhikrWindow(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>
              <div>
                <label className="text-xs font-medium block mb-1" style={{ color: "var(--text-muted)" }}>
                  {ui.virtueNote}
                </label>
                <input
                  type="text"
                  value={dhikrFazilat}
                  onChange={(e) => setDhikrFazilat(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-xs bg-transparent focus:outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>
            </div>

            <button
              type="submit"
              className="btn-primary w-full py-2.5 rounded-xl text-xs font-semibold cursor-pointer"
            >
              {editingLitanyId ? ui.updateDhikr : ui.createDhikr}
            </button>
          </form>

          {/* Litanies Library */}
          <div className="lg:col-span-6 bento-card p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold">
              {ui.litanyLibrary} ({allLitanies.length})
            </h3>

            <div
              className="divide-y max-h-[540px] overflow-y-auto pr-1"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              {allLitanies.map((lit) => {
                const isCustom = customLitanies.some((c) => c.id === lit.id);
                const litUrdu = resolveUrduTranslation(lit);
                return (
                  <div
                    key={lit.id}
                    className="py-4 first:pt-0 last:pb-0 space-y-2"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-semibold text-sm">{lit.name}</span>
                        <span
                          className="text-[11px] tabular-nums"
                          style={{ color: "var(--accent-gold)" }}
                        >
                          {lit.defaultTarget}x
                        </span>
                        {isCustom && (
                          <span className="badge-pill badge-gold">{ui.customBadge}</span>
                        )}
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveLitany(lit.id, lit.defaultTarget);
                            setActiveTab("counter");
                          }}
                          className="btn-primary px-3 py-1 rounded-lg text-[11px] font-semibold cursor-pointer"
                        >
                          {ui.countNow}
                        </button>
                        {isCustom && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEditCustomDhikr(lit)}
                              className="p-1.5 opacity-70 hover:opacity-100 cursor-pointer"
                              aria-label={tp(lang, "Edit")}
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomDhikr(lit.id)}
                              className="p-1.5 opacity-70 hover:opacity-100 cursor-pointer"
                              style={{ color: "var(--accent-danger)" }}
                              aria-label={tp(lang, "Delete")}
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <p dir="rtl" className="font-arabic text-xl text-right leading-loose">
                      {lit.arabic}
                    </p>
                    {preferUrdu && litUrdu ? (
                      <p
                        dir="rtl"
                        className="font-urdu text-sm text-right leading-loose"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {litUrdu}
                      </p>
                    ) : (
                      <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {lit.translation}
                      </p>
                    )}
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
