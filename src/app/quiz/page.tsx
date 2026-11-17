"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
  PhoneCall,
  Shuffle,
  Split,
  ArrowRight,
  ShieldCheck,
  Volume2,
  VolumeX,
  LogOut,
  Award,
  Lock,
  Infinity as InfinityIcon,
  Zap,
  Copy,
  Check,
  Mic,
  MicOff,
  Flame,
  Crown,
  Medal,
  Clock,
  Radio,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import {
  buildRandomizedDeck,
  FastestFingerChallenge,
  pickAlternateQuestionForTier,
  pickRandomFastestFinger,
  QUIZ_BANK,
  QuizCategory,
  QuizQuestion,
  SAFE_TIERS,
  shuffleQuestionOptions,
  TIER_REWARDS,
  TIER_TITLES,
} from "@/data/quiz";
import {
  DEFAULT_VAULT_PROFILE,
  getIlmRank,
  HotSeatDrone,
  loadQuizVault,
  playQuizSfx,
  QUIZ_MEDALS,
  QuizVaultProfile,
  saveQuizVault,
  speakHostLine,
} from "@/lib/quiz-fx";
import {
  FloatingToastItem,
  FloatingXpBursts,
  KbcStudioBeams,
  ParticleBurstKind,
  QuizConfettiCanvas,
  SanadCertificateModal,
  StageMood,
} from "@/components/QuizStageFx";
import { useApp } from "@/lib/store";
import { LangCode, t, tp } from "@/lib/i18n";

type TopicFilter =
  | "all"
  | "aqidah"
  | "fiqh"
  | "seerah"
  | "quran"
  | "auliya"
  | "history";

type RunFormat = "ladder15" | "blitz20";

interface QuizUiStrings {
  sound: string;
  atmosphere: string;
  voice: string;
  modeChampionship: string;
  modeBlitz: string;
  modeFastestFinger: string;
  topicAll: string;
  topicAqidah: string;
  topicFiqh: string;
  topicSeerah: string;
  topicQuran: string;
  topicAuliya: string;
  topicHistory: string;
  lifeline5050: string;
  lifelineHint: string;
  lifelinePoll: string;
  lifelineSwitch: string;
  lifelineDouble: string;
  tierLabel: string;
  safeMilestone: string;
  lockAnswer: string;
  sealingAnswer: string;
  nextTier: string;
  walkAwaySafely: string;
  newChallenge: string;
  shareScore: string;
  copied: string;
  viewSanad: string;
  scholarlyExplanation: string;
  reference: string;
  correctAnswer: string;
  championshipCompleted: string;
  safeScoreBanked: string;
  reviewExplanation: string;
  timeExpired: string;
  eliminated: string;
  streak: string;
  honorsTitle: string;
  championshipsWon: string;
  highestTier: string;
  masteredCountLabel: string;
  recentSessions: string;
  Unlocked: string;
  Locked: string;
  consultingScholar: string;
  secondChancePrompt: string;
  dramaticReveal: string;
  instantReveal: string;
  fffPromptSubtitle: string;
  fffReset: string;
  fffNextTrial: string;
  fffReturnStage: string;
  hostReady: string;
  hostUntimed: string;
  hotkeysHint: string;
}

const QUIZ_UI: Record<LangCode, QuizUiStrings> = {
  en: {
    sound: "Sound",
    atmosphere: "Atmosphere",
    voice: "Voice",
    modeChampionship: "15-Tier Championship",
    modeBlitz: "20-Question Blitz",
    modeFastestFinger: "Fastest Finger First",
    topicAll: "All Topics",
    topicAqidah: "Aqidah",
    topicFiqh: "Hanafi Fiqh",
    topicSeerah: "Seerah",
    topicQuran: "Quran & Tafsir",
    topicAuliya: "Auliya & Tasawwuf",
    topicHistory: "Islamic History",
    lifeline5050: "50:50",
    lifelineHint: "Scholar Hint",
    lifelinePoll: "Community Poll",
    lifelineSwitch: "Switch Question",
    lifelineDouble: "Double Chance",
    tierLabel: "Tier",
    safeMilestone: "Safe Milestone",
    lockAnswer: "Lock Answer",
    sealingAnswer: "Sealing Answer…",
    nextTier: "Next Tier",
    walkAwaySafely: "Walk Away Safely",
    newChallenge: "New Challenge",
    shareScore: "Share Score",
    copied: "Copied",
    viewSanad: "View Sanad Certificate",
    scholarlyExplanation: "Scholarly Explanation",
    reference: "Reference",
    correctAnswer: "Correct Answer!",
    championshipCompleted: "Championship Completed!",
    safeScoreBanked: "Safe Score Banked",
    reviewExplanation: "Review Explanation",
    timeExpired: "Time Expired",
    eliminated: "Eliminated",
    streak: "Streak",
    honorsTitle: "Honors & Scholarly Progress",
    championshipsWon: "Championships",
    highestTier: "Highest Tier",
    masteredCountLabel: "Questions Mastered",
    recentSessions: "Recent Challenges",
    Unlocked: "Earned",
    Locked: "Locked",
    consultingScholar: "Requesting Scholarly Counsel…",
    secondChancePrompt: "First choice eliminated — select your second choice.",
    dramaticReveal: "Dramatic",
    instantReveal: "Instant",
    fffPromptSubtitle: "Arrange all four items in the correct scholarly order",
    fffReset: "Reset Order",
    fffNextTrial: "Another Round",
    fffReturnStage: "Enter Championship",
    hostReady: "Reflect carefully and lock your chosen answer.",
    hostUntimed: "Advanced scholarly tier — take all the time you need to reflect.",
    hotkeysHint: "Shortcuts: A–D select · Enter lock or advance · H scholar hint",
  },
  ur: {
    sound: "آواز",
    atmosphere: "ماحول",
    voice: "میزبان",
    modeChampionship: "۱۵ درجاتی مقابلہ",
    modeBlitz: "۲۰ سوالی تیز مرحلہ",
    modeFastestFinger: "تیز ترین ترتیب",
    topicAll: "تمام موضوعات",
    topicAqidah: "عقائد",
    topicFiqh: "فقہِ حنفی",
    topicSeerah: "سیرتِ طیبہ",
    topicQuran: "قرآن و تفسیر",
    topicAuliya: "اولیاء و تصوف",
    topicHistory: "اسلامی تاریخ",
    lifeline5050: "۵۰:۵۰",
    lifelineHint: "عالم کا اشارہ",
    lifelinePoll: "اجتماعی رائے",
    lifelineSwitch: "سوال بدلیں",
    lifelineDouble: "دو مواقع",
    tierLabel: "درجہ",
    safeMilestone: "محفوظ منزل",
    lockAnswer: "جواب محفوظ کریں",
    sealingAnswer: "تصدیق جاری ہے…",
    nextTier: "اگلا درجہ",
    walkAwaySafely: "محفوظ واپسی",
    newChallenge: "نیا مقابلہ",
    shareScore: "نتیجہ شیئر کریں",
    copied: "کاپی ہو گیا",
    viewSanad: "سندِ علم دیکھیں",
    scholarlyExplanation: "علمی وضاحت و دلیل",
    reference: "حوالہ",
    correctAnswer: "درست جواب!",
    championshipCompleted: "مقابلہ کامیابی سے مکمل!",
    safeScoreBanked: "محفوظ اسکور جمع ہو گیا",
    reviewExplanation: "علمی وضاحت ملاحظہ کریں",
    timeExpired: "وقت ختم ہو گیا",
    eliminated: "حذف شدہ",
    streak: "تسلسل",
    honorsTitle: "اعزازات اور علمی پیشرفت",
    championshipsWon: "تاجِ علم",
    highestTier: "بلند ترین درجہ",
    masteredCountLabel: "مکمل کردہ مسائل",
    recentSessions: "حالیہ مقابلے",
    Unlocked: "حاصل شدہ",
    Locked: "مقفل",
    consultingScholar: "دارالافتاء سے رہنمائی لی جا رہی ہے…",
    secondChancePrompt: "پہلا انتخاب درست نہیں تھا — اب اپنا دوسرا جواب منتخب کریں۔",
    dramaticReveal: "وقار",
    instantReveal: "فوری",
    fffPromptSubtitle: "چاروں اجزاء کو درست تاریخی یا فقہی ترتیب میں چنیں",
    fffReset: "ترتیب صاف کریں",
    fffNextTrial: "اگلی مشق",
    fffReturnStage: "مقابلے میں داخل ہوں",
    hostReady: "غور و فکر کے ساتھ درست جواب منتخب کریں۔",
    hostUntimed: "اعلیٰ علمی مرحلہ — وقت کی قید نہیں، اطمینان سے جواب دیں۔",
    hotkeysHint: "کلیدیں: A–D انتخاب · Enter تصدیق · H عالم کا اشارہ",
  },
  ar: {
    sound: "الصوت",
    atmosphere: "الأجواء",
    voice: "التعليق",
    modeChampionship: "بطولة ١٥ مرتبة",
    modeBlitz: "تحدي ٢٠ سؤالاً",
    modeFastestFinger: "الأسرع ترتيباً",
    topicAll: "جميع المواضيع",
    topicAqidah: "العقيدة",
    topicFiqh: "الفقه الحنفي",
    topicSeerah: "السيرة النبوية",
    topicQuran: "القرآن والتفسير",
    topicAuliya: "الأولياء والتصوف",
    topicHistory: "التاريخ الإسلامي",
    lifeline5050: "٥٠:٥٠",
    lifelineHint: "إشارة عالم",
    lifelinePoll: "رأي الجمهور",
    lifelineSwitch: "تبديل السؤال",
    lifelineDouble: "فرصتان",
    tierLabel: "المرتبة",
    safeMilestone: "محطة آمنة",
    lockAnswer: "تثبيت الإجابة",
    sealingAnswer: "جارٍ التثبيت…",
    nextTier: "المرتبة التالية",
    walkAwaySafely: "انسحاب آمن",
    newChallenge: "تحدٍ جديد",
    shareScore: "مشاركة النتيجة",
    copied: "تم النسخ",
    viewSanad: "عرض شهادة السند",
    scholarlyExplanation: "الشرح والدليل العلمي",
    reference: "المرجع",
    correctAnswer: "إجابة صحيحة!",
    championshipCompleted: "اكتملت البطولة بنجاح!",
    safeScoreBanked: "تم حفظ الرصيد الآمن",
    reviewExplanation: "مراجعة الدليل العلمي",
    timeExpired: "انتهى الوقت",
    eliminated: "مستبعد",
    streak: "تتابع",
    honorsTitle: "الأوسمة والتقدم العلمي",
    championshipsWon: "البطولات",
    highestTier: "أعلى مرتبة",
    masteredCountLabel: "المسائل المتقنة",
    recentSessions: "الجولات الأخيرة",
    Unlocked: "مكتسب",
    Locked: "مقفل",
    consultingScholar: "جارٍ طلب إشارة العالم…",
    secondChancePrompt: "الخيار الأول غير صحيح — اختر محاولتك الثانية.",
    dramaticReveal: "متأنٍ",
    instantReveal: "فوري",
    fffPromptSubtitle: "رتب العناصر الأربعة وفق التسلسل الصحيح",
    fffReset: "إعادة الترتيب",
    fffNextTrial: "جولة أخرى",
    fffReturnStage: "دخول البطولة",
    hostReady: "تأمل السؤال جيداً ثم ثبّت إجابتك.",
    hostUntimed: "مرتبة علمية متقدمة — لا حد للوقت، أجب بتأنٍّ وتدبر.",
    hotkeysHint: "اختصارات: A–D للاختيار · Enter للتثبيت · H لإشارة العالم",
  },
  ro_ur: {
    sound: "Awaz",
    atmosphere: "Mahol",
    voice: "Mezban",
    modeChampionship: "15-Darjati Championship",
    modeBlitz: "20-Sawal Blitz",
    modeFastestFinger: "Tez Tareen Tarteeb",
    topicAll: "Tamam Mauzuat",
    topicAqidah: "Aqidah",
    topicFiqh: "Fiqh-e-Hanafi",
    topicSeerah: "Seerat-e-Tayyiba",
    topicQuran: "Quran & Tafsir",
    topicAuliya: "Auliya & Tasawwuf",
    topicHistory: "Islami Tareekh",
    lifeline5050: "50:50",
    lifelineHint: "Aalim Ishara",
    lifelinePoll: "Ijma' Rai",
    lifelineSwitch: "Sawal Badlein",
    lifelineDouble: "Do Mauqe",
    tierLabel: "Darja",
    safeMilestone: "Mehfooz Padav",
    lockAnswer: "Jawab Lock Karein",
    sealingAnswer: "Lock Ho Raha Hai…",
    nextTier: "Agla Darja",
    walkAwaySafely: "Mehfooz Wapsi",
    newChallenge: "Naya Muqabla",
    shareScore: "Score Share Karein",
    copied: "Copy Ho Gaya",
    viewSanad: "Sanad Certificate Dekhein",
    scholarlyExplanation: "Ilmi Wazahat & Dalil",
    reference: "Hawala",
    correctAnswer: "Durust Jawab!",
    championshipCompleted: "Championship Mukammal!",
    safeScoreBanked: "Mehfooz Score Jama Ho Gaya",
    reviewExplanation: "Ilmi Wazahat Parhein",
    timeExpired: "Waqt Khatam",
    eliminated: "Kharij",
    streak: "Tasalsul",
    honorsTitle: "Tamghe & Ilmi Taraqqi",
    championshipsWon: "Taj-e-Ilm",
    highestTier: "Aala Darja",
    masteredCountLabel: "Maharat Hasil Sawalat",
    recentSessions: "Haliya Muqable",
    Unlocked: "Hasil",
    Locked: "Muqaffal",
    consultingScholar: "Aalim-e-Deen se rabta ho raha hai…",
    secondChancePrompt: "Pehla intekhab durust nahi tha — apna doosra jawab chunein.",
    dramaticReveal: "Dramatic",
    instantReveal: "Fauri",
    fffPromptSubtitle: "Charon ajza ko sahi tareekhi ya fiqhi tarteeb mein chunein",
    fffReset: "Dobara Chunein",
    fffNextTrial: "Agla Sawal",
    fffReturnStage: "Championship Mein Jayein",
    hostReady: "Ghaur o fikr ke saath apna jawab muntakhab karein.",
    hostUntimed: "Aala ilmi marhala — waqt ki koi qaid nahi, sukoon se jawab dein.",
    hotkeysHint: "Shortcuts: A–D chunein · Enter lock/agla · H aalim ishara",
  },
  hi: {
    sound: "ध्वनि",
    atmosphere: "माहौल",
    voice: "वाचन",
    modeChampionship: "15-स्तरीय चैंपियनशिप",
    modeBlitz: "20-प्रश्न ब्लिट्ज़",
    modeFastestFinger: "सबसे तेज़ क्रम",
    topicAll: "सभी विषय",
    topicAqidah: "अक़ीदा",
    topicFiqh: "हनफ़ी फ़िक़्ह",
    topicSeerah: "सीरत-ए-नबवी",
    topicQuran: "क़ुरआन व तफ़्सीर",
    topicAuliya: "औलिया व तसव्वुफ़",
    topicHistory: "इस्लामी इतिहास",
    lifeline5050: "50:50",
    lifelineHint: "आलिम संकेत",
    lifelinePoll: "सामूहिक राय",
    lifelineSwitch: "प्रश्न बदलें",
    lifelineDouble: "दो अवसर",
    tierLabel: "स्तर",
    safeMilestone: "सुरक्षित पड़ाव",
    lockAnswer: "उत्तर लॉक करें",
    sealingAnswer: "लॉक हो रहा है…",
    nextTier: "अगला स्तर",
    walkAwaySafely: "सुरक्षित वापसी",
    newChallenge: "नई चुनौती",
    shareScore: "स्कोर साझा करें",
    copied: "कॉपी हो गया",
    viewSanad: "सनद प्रमाणपत्र देखें",
    scholarlyExplanation: "इल्मी व्याख्या व दलील",
    reference: "संदर्भ",
    correctAnswer: "सही उत्तर!",
    championshipCompleted: "चैंपियनशिप पूर्ण!",
    safeScoreBanked: "सुरक्षित स्कोर संचित",
    reviewExplanation: "व्याख्या देखें",
    timeExpired: "समय समाप्त",
    eliminated: "हटाया गया",
    streak: "क्रम",
    honorsTitle: "पदक व इल्मी प्रगति",
    championshipsWon: "चैंपियनशिप",
    highestTier: "सर्वोच्च स्तर",
    masteredCountLabel: "सिद्ध प्रश्न",
    recentSessions: "हाल के सत्र",
    Unlocked: "प्राप्त",
    Locked: "लॉक",
    consultingScholar: "आलिम संकेत प्राप्त किया जा रहा है…",
    secondChancePrompt: "पहला विकल्प ग़लत था — अपना दूसरा विकल्प चुनें।",
    dramaticReveal: "नाटकीय",
    instantReveal: "तुरंत",
    fffPromptSubtitle: "चारों विकल्पों को सही क्रम में चुनें",
    fffReset: "रीसेट करें",
    fffNextTrial: "अगला अभ्यास",
    fffReturnStage: "चैंपियनशिप में जाएं",
    hostReady: "ध्यानपूर्वक विचार करें और अपना उत्तर लॉक करें।",
    hostUntimed: "उच्च इल्मी स्तर — समय सीमा नहीं है, इत्मीनान से उत्तर दें।",
    hotkeysHint: "शॉर्टकट: A–D चुनें · Enter लॉक/अगला · H आलिम संकेत",
  },
  tr: {
    sound: "Ses",
    atmosphere: "Atmosfer",
    voice: "Sunucu",
    modeChampionship: "15 Seviye Şampiyona",
    modeBlitz: "20 Soru Hızlı Tur",
    modeFastestFinger: "En Hızlı Sıralama",
    topicAll: "Tüm Konular",
    topicAqidah: "Akâid",
    topicFiqh: "Hanefî Fıkhı",
    topicSeerah: "Siyer-i Nebî",
    topicQuran: "Kur'ân ve Tefsir",
    topicAuliya: "Evliya ve Tasavvuf",
    topicHistory: "İslâm Tarihi",
    lifeline5050: "50:50",
    lifelineHint: "Âlim İpucu",
    lifelinePoll: "Cemaat Görüşü",
    lifelineSwitch: "Soruyu Değiştir",
    lifelineDouble: "Çift Hakkı",
    tierLabel: "Seviye",
    safeMilestone: "Güvenli Baraj",
    lockAnswer: "Cevabı Kilitle",
    sealingAnswer: "Kilitleniyor…",
    nextTier: "Sonraki Seviye",
    walkAwaySafely: "Güvenle Çekil",
    newChallenge: "Yeni Yarışma",
    shareScore: "Skoru Paylaş",
    copied: "Kopyalandı",
    viewSanad: "İcâzet / Senedi Gör",
    scholarlyExplanation: "İlmî Açıklama ve Delil",
    reference: "Kaynak",
    correctAnswer: "Doğru Cevap!",
    championshipCompleted: "Şampiyona Tamamlandı!",
    safeScoreBanked: "Güvenli Puan Kaydedildi",
    reviewExplanation: "Açıklamayı İncele",
    timeExpired: "Süre Doldu",
    eliminated: "Elendi",
    streak: "Seri",
    honorsTitle: "Madalyalar ve İlmî İlerleme",
    championshipsWon: "Şampiyonluk",
    highestTier: "En Yüksek Seviye",
    masteredCountLabel: "Öğrenilen Sorular",
    recentSessions: "Son Yarışmalar",
    Unlocked: "Kazanıldı",
    Locked: "Kilitli",
    consultingScholar: "Âlim görüşüne başvuruluyor…",
    secondChancePrompt: "İlk tercih yanlıştı — ikinci cevabınızı seçin.",
    dramaticReveal: "Heyecanlı",
    instantReveal: "Hızlı",
    fffPromptSubtitle: "Dört seçeneği doğru tarihî veya fıkhî sırayla dizin",
    fffReset: "Sıfırla",
    fffNextTrial: "Yeni Sıralama",
    fffReturnStage: "Şampiyonaya Dön",
    hostReady: "Dikkatlice tefekkür edin ve cevabınızı kilitleyin.",
    hostUntimed: "İleri ilmî seviye — süre sınırı yoktur, huzurla cevaplayın.",
    hotkeysHint: "Kısayollar: A–D seç · Enter kilitle/ilerle · H âlim ipucu",
  },
  bn: {
    sound: "শব্দ",
    atmosphere: "আবহ",
    voice: "কণ্ঠ",
    modeChampionship: "১৫-স্তর চ্যাম্পিয়নশিপ",
    modeBlitz: "২০-প্রশ্ন ব্লিটজ",
    modeFastestFinger: "দ্রুততম ক্রম",
    topicAll: "সকল বিষয়",
    topicAqidah: "আকিদা",
    topicFiqh: "হানাফি ফিকহ",
    topicSeerah: "সীরাতুন্নবী ﷺ",
    topicQuran: "কুরআন ও তাফসির",
    topicAuliya: "আউলিয়া ও তাসাউফ",
    topicHistory: "ইসলামি ইতিহাস",
    lifeline5050: "৫০:৫০",
    lifelineHint: "আলেম সংকেত",
    lifelinePoll: "জনমত জরিপ",
    lifelineSwitch: "প্রশ্ন পরিবর্তন",
    lifelineDouble: "দুই সুযোগ",
    tierLabel: "স্তর",
    safeMilestone: "নিরাপদ ধাপ",
    lockAnswer: "উত্তর লক করুন",
    sealingAnswer: "লক হচ্ছে…",
    nextTier: "পরবর্তী স্তর",
    walkAwaySafely: "নিরাপদে বিরতি",
    newChallenge: "নতুন প্রতিযোগিতা",
    shareScore: "স্কোর শেয়ার",
    copied: "কপি হয়েছে",
    viewSanad: "সনদপত্র দেখুন",
    scholarlyExplanation: "ইলমি ব্যাখ্যা ও দলিল",
    reference: "সূত্র",
    correctAnswer: "সঠিক উত্তর!",
    championshipCompleted: "চ্যাম্পিয়নশিপ সম্পন্ন!",
    safeScoreBanked: "নিরাপদ স্কোর সংরক্ষিত",
    reviewExplanation: "ব্যাখ্যা দেখুন",
    timeExpired: "সময় সমাপ্ত",
    eliminated: "বাতিল",
    streak: "ধারাবাহিক",
    honorsTitle: "পদক ও ইলমি অগ্রগতি",
    championshipsWon: "চ্যাম্পিয়নশিপ",
    highestTier: "সর্বোচ্চ স্তর",
    masteredCountLabel: "আয়ত্তকৃত প্রশ্ন",
    recentSessions: "সাম্প্রতিক পর্ব",
    Unlocked: "অর্জিত",
    Locked: "লক",
    consultingScholar: "আলেমের পরামর্শ নেওয়া হচ্ছে…",
    secondChancePrompt: "প্রথম পছন্দটি সঠিক ছিল না — দ্বিতীয় উত্তর নির্বাচন করুন।",
    dramaticReveal: "নাটকীয়",
    instantReveal: "তাৎক্ষণিক",
    fffPromptSubtitle: "চারটি বিষয় সঠিক ক্রমানুসারে সাজান",
    fffReset: "পুনরায় সাজান",
    fffNextTrial: "পরবর্তী অনুশীলন",
    fffReturnStage: "মূল পর্বে ফিরুন",
    hostReady: "মনোযোগসহ চিন্তা করে সঠিক উত্তর লক করুন।",
    hostUntimed: "উচ্চতর ইলমি স্তর — সময়ের সীমা নেই, ধীরস্থিরভাবে উত্তর দিন।",
    hotkeysHint: "শর্টকাট: A–D নির্বাচন · Enter লক/পরবর্তী · H আলেম সংকেত",
  },
  fa: {
    sound: "صدا",
    atmosphere: "فضاسازی",
    voice: "گوینده",
    modeChampionship: "مسابقه ۱۵ مرحله‌ای",
    modeBlitz: "رقابت سریع ۲۰ سؤال",
    modeFastestFinger: "سریع‌ترین چیدمان",
    topicAll: "همه موضوعات",
    topicAqidah: "عقاید",
    topicFiqh: "فقه حنفی",
    topicSeerah: "سیره نبوی",
    topicQuran: "قرآن و تفسیر",
    topicAuliya: "اولیاء و تصوف",
    topicHistory: "تاریخ اسلام",
    lifeline5050: "۵۰:۵۰",
    lifelineHint: "راهنمایی عالم",
    lifelinePoll: "نظرسنجی جمع",
    lifelineSwitch: "تعویض سؤال",
    lifelineDouble: "دو فرصت",
    tierLabel: "مرحله",
    safeMilestone: "ایستگاه امن",
    lockAnswer: "ثبت نهایی پاسخ",
    sealingAnswer: "در حال ثبت…",
    nextTier: "مرحله بعد",
    walkAwaySafely: "خروج امن با امتیاز",
    newChallenge: "رقابت جدید",
    shareScore: "اشتراک امتیاز",
    copied: "کپی شد",
    viewSanad: "مشاهده گواهی سند",
    scholarlyExplanation: "توضیح و دلیل علمی",
    reference: "منبع",
    correctAnswer: "پاسخ صحیح!",
    championshipCompleted: "مسابقه با موفقیت کامل شد!",
    safeScoreBanked: "امتیاز امن ذخیره شد",
    reviewExplanation: "بررسی توضیح علمی",
    timeExpired: "پایان زمان",
    eliminated: "حذف‌شده",
    streak: "پیوستگی",
    honorsTitle: "نشان‌ها و پیشرفت علمی",
    championshipsWon: "قهرمانی‌ها",
    highestTier: "بالاترین مرحله",
    masteredCountLabel: "پرسش‌های آموخته‌شده",
    recentSessions: "رقابت‌های اخیر",
    Unlocked: "کسب‌شده",
    Locked: "قفل",
    consultingScholar: "در حال دریافت راهنمایی علمی…",
    secondChancePrompt: "انتخاب اول نادرست بود — گزینه دوم خود را برگزینید.",
    dramaticReveal: "با مکث",
    instantReveal: "فوری",
    fffPromptSubtitle: "هر چهار مورد را به ترتیب صحیح علمی بچینید",
    fffReset: "بازنشانی",
    fffNextTrial: "چیدمان دیگر",
    fffReturnStage: "ورود به مسابقه اصلی",
    hostReady: "با تأمل بیندیشید و پاسخ نهایی را ثبت کنید.",
    hostUntimed: "مرحله عالی علمی — بدون محدودیت زمانی با آرامش پاسخ دهید.",
    hotkeysHint: "کلیدها: A–D انتخاب · Enter ثبت/بعدی · H راهنمایی عالم",
  },
  id: {
    sound: "Suara",
    atmosphere: "Atmosfer",
    voice: "Narator",
    modeChampionship: "Kejuaraan 15 Tingkat",
    modeBlitz: "Blitz 20 Soal",
    modeFastestFinger: "Urutan Tercepat",
    topicAll: "Semua Topik",
    topicAqidah: "Aqidah",
    topicFiqh: "Fiqih Hanafi",
    topicSeerah: "Sirah Nabawiyah",
    topicQuran: "Al-Qur'an & Tafsir",
    topicAuliya: "Auliya & Tasawuf",
    topicHistory: "Sejarah Islam",
    lifeline5050: "50:50",
    lifelineHint: "Petunjuk Ulama",
    lifelinePoll: "Jajak Komunitas",
    lifelineSwitch: "Ganti Soal",
    lifelineDouble: "Dua Kesempatan",
    tierLabel: "Tingkat",
    safeMilestone: "Batas Aman",
    lockAnswer: "Kunci Jawaban",
    sealingAnswer: "Mengunci…",
    nextTier: "Tingkat Berikutnya",
    walkAwaySafely: "Amankan Skor",
    newChallenge: "Tantangan Baru",
    shareScore: "Bagikan Skor",
    copied: "Tersalin",
    viewSanad: "Lihat Sertifikat Sanad",
    scholarlyExplanation: "Penjelasan & Dalil Ilmiah",
    reference: "Referensi",
    correctAnswer: "Jawaban Benar!",
    championshipCompleted: "Kejuaraan Selesai!",
    safeScoreBanked: "Skor Aman Tersimpan",
    reviewExplanation: "Tinjau Penjelasan",
    timeExpired: "Waktu Habis",
    eliminated: "Dieliminasi",
    streak: "Beruntun",
    honorsTitle: "Medali & Kemajuan Ilmu",
    championshipsWon: "Gelar Juara",
    highestTier: "Tingkat Tertinggi",
    masteredCountLabel: "Soal Dikuasai",
    recentSessions: "Sesi Terakhir",
    Unlocked: "Diraih",
    Locked: "Terkunci",
    consultingScholar: "Meminta petunjuk keilmuan…",
    secondChancePrompt: "Pilihan pertama kurang tepat — pilih jawaban kedua Anda.",
    dramaticReveal: "Dramatis",
    instantReveal: "Instan",
    fffPromptSubtitle: "Susun keempat pilihan sesuai urutan yang benar",
    fffReset: "Atur Ulang",
    fffNextTrial: "Soal Urutan Lain",
    fffReturnStage: "Masuk Kejuaraan",
    hostReady: "Renungkan dengan saksama lalu kunci jawaban Anda.",
    hostUntimed: "Tingkat ilmu lanjut — tanpa batas waktu, jawab dengan tenang.",
    hotkeysHint: "Pintasan: A–D pilih · Enter kunci/lanjut · H petunjuk ulama",
  },
  fr: {
    sound: "Son",
    atmosphere: "Atmosphère",
    voice: "Voix",
    modeChampionship: "Championnat 15 Paliers",
    modeBlitz: "Blitz 20 Questions",
    modeFastestFinger: "Rapidité d'Ordre",
    topicAll: "Tous les Sujets",
    topicAqidah: "Aqida",
    topicFiqh: "Fiqh Hanafite",
    topicSeerah: "Sîra Prophétique",
    topicQuran: "Coran & Tafsîr",
    topicAuliya: "Auliya & Tasawwuf",
    topicHistory: "Histoire Islamique",
    lifeline5050: "50:50",
    lifelineHint: "Indice Savant",
    lifelinePoll: "Vote du Public",
    lifelineSwitch: "Changer la Question",
    lifelineDouble: "Double Chance",
    tierLabel: "Palier",
    safeMilestone: "Palier Sécurisé",
    lockAnswer: "Verrouiller la Réponse",
    sealingAnswer: "Validation…",
    nextTier: "Palier Suivant",
    walkAwaySafely: "Conserver le Score",
    newChallenge: "Nouveau Défi",
    shareScore: "Partager le Score",
    copied: "Copié",
    viewSanad: "Voir le Certificat Sanad",
    scholarlyExplanation: "Explication & Preuve Savante",
    reference: "Référence",
    correctAnswer: "Bonne Réponse !",
    championshipCompleted: "Championnat Terminé !",
    safeScoreBanked: "Score Sécurisé Enregistré",
    reviewExplanation: "Consulter l'Explication",
    timeExpired: "Temps Écoulé",
    eliminated: "Éliminé",
    streak: "Série",
    honorsTitle: "Distinctions & Progression",
    championshipsWon: "Victoires",
    highestTier: "Meilleur Palier",
    masteredCountLabel: "Questions Maîtrisées",
    recentSessions: "Sessions Récentes",
    Unlocked: "Obtenu",
    Locked: "Verrouillé",
    consultingScholar: "Consultation de l'indice savant…",
    secondChancePrompt: "Premier choix incorrect — sélectionnez votre seconde réponse.",
    dramaticReveal: "Dramatique",
    instantReveal: "Instantané",
    fffPromptSubtitle: "Classez les quatre éléments dans l'ordre exact",
    fffReset: "Réinitialiser",
    fffNextTrial: "Autre Séquence",
    fffReturnStage: "Rejoindre le Championnat",
    hostReady: "Méditez attentivement puis verrouillez votre réponse.",
    hostUntimed: "Palier supérieur sans limite de temps — répondez avec sérénité.",
    hotkeysHint: "Raccourcis : A–D choisir · Entrée valider · H indice savant",
  },
};

function matchesScholarlyTopic(q: QuizQuestion, topic: TopicFilter): boolean {
  if (topic === "all") return true;
  if (topic === "fiqh") return q.category === "Hanafi Fiqh";
  if (topic === "quran") return q.category === "Quran & Kanzul Iman";
  if (topic === "auliya") return q.category === "Lives of the Auliya";
  if (topic === "aqidah") {
    return (
      q.category === "Aqaid & Seerah" &&
      !/badr|uhud|khandaq|hijrah|hudaybi|expedition|battle of/i.test(q.question)
    );
  }
  if (topic === "seerah") {
    return (
      q.category === "Aqaid & Seerah" &&
      /prophet|rasul|nabi|madinah|makkah|badr|uhud|hijr|sahab|compan|abu bakr|umar|uthman|ali|khadij|aishah|fatim|hasan|husayn|miraj|seerah|cave|hudaybi/i.test(
        `${q.question} ${q.proofExplanation}`
      )
    );
  }
  // Islamic History
  return (
    (q.category === "Lives of the Auliya" || q.category === "Aqaid & Seerah") &&
    /ah\b|ce\b|century|caliph|khilaf|baghdad|damascus|ajmer|delhi|lahore|sirhind|bareilly|era|dynasty|sultan|battle|treaty|compiled|founded/i.test(
      `${q.question} ${q.proofExplanation}`
    )
  );
}

function toBaseQuizCategory(topic: TopicFilter): "all" | QuizCategory {
  if (topic === "fiqh") return "Hanafi Fiqh";
  if (topic === "quran") return "Quran & Kanzul Iman";
  if (topic === "auliya") return "Lives of the Auliya";
  if (topic === "aqidah" || topic === "seerah") return "Aqaid & Seerah";
  return "all";
}

function buildTopicDeck(
  topic: TopicFilter,
  seenIds: string[] = [],
  format: RunFormat = "ladder15"
): QuizQuestion[] {
  if (topic === "all" || topic === "fiqh" || topic === "quran" || topic === "auliya") {
    return buildRandomizedDeck(toBaseQuizCategory(topic), seenIds, format);
  }

  const seenSet = new Set(seenIds);
  const baseCat = toBaseQuizCategory(topic);

  if (format === "ladder15") {
    return Array.from({ length: 15 }, (_, idx) => {
      const tierNum = idx + 1;
      const strictPool = QUIZ_BANK.filter(
        (q) => q.tier === tierNum && matchesScholarlyTopic(q, topic)
      );
      const catPool =
        strictPool.length > 0
          ? strictPool
          : QUIZ_BANK.filter(
              (q) =>
                q.tier === tierNum &&
                (baseCat === "all" || q.category === baseCat)
            );
      const fallbackPool =
        catPool.length > 0 ? catPool : QUIZ_BANK.filter((q) => q.tier === tierNum);
      const unseen = fallbackPool.filter((q) => !seenSet.has(q.id));
      const candidates = unseen.length > 0 ? unseen : fallbackPool;
      const picked =
        candidates[Math.floor(Math.random() * candidates.length)] ||
        QUIZ_BANK[idx % QUIZ_BANK.length];
      return shuffleQuestionOptions(picked);
    });
  }

  const matched = QUIZ_BANK.filter((q) => matchesScholarlyTopic(q, topic));
  const pool = matched.length >= 20 ? matched : QUIZ_BANK;
  const unseen = [...pool.filter((q) => !seenSet.has(q.id))].sort(
    () => Math.random() - 0.5
  );
  const seen = [...pool.filter((q) => seenSet.has(q.id))].sort(
    () => Math.random() - 0.5
  );
  const combined = [...unseen, ...seen].slice(0, 20);
  combined.sort((a, b) => a.tier - b.tier);
  return combined.map(shuffleQuestionOptions);
}

function stripLeadingSymbols(raw: string): string {
  return raw.replace(/^[^A-Za-z0-9]+/, "").trim();
}

export default function QuizPage() {
  const { lang, addIlmPoints, ilmPoints, bestQuizTier, user } = useApp();
  const ui = QUIZ_UI[lang] || QUIZ_UI.en;

  // Persistent Gamification Vault (seen questions, mastered questions, medals, history)
  const [vault, setVault] = useState<QuizVaultProfile>(DEFAULT_VAULT_PROFILE);
  const [vaultHydrated, setVaultHydrated] = useState(false);

  // Audio & Broadcast FX toggles
  const [muted, setMuted] = useState(false);
  const [droneOn, setDroneOn] = useState(false);
  const [hostVoiceOn, setHostVoiceOn] = useState(false);
  const [dramaticMode, setDramaticMode] = useState(true);
  const droneRef = useRef<HotSeatDrone | null>(null);

  // Game Mode & Deck State
  const [topicFilter, setTopicFilter] = useState<TopicFilter>("all");
  const [runFormat, setRunFormat] = useState<RunFormat>("ladder15");
  const [deck, setDeck] = useState<QuizQuestion[]>(() =>
    buildTopicDeck("all", [], "ladder15")
  );
  const [tierIdx, setTierIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const [outcome, setOutcome] = useState<
    "playing" | "correct" | "wrong" | "won" | "walked"
  >("playing");

  // Lifelines & Power-Ups State
  const [eliminatedOpts, setEliminatedOpts] = useState<number[]>([]);
  const [showIshara, setShowIshara] = useState(false);
  const [isharaRinging, setIsharaRinging] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [swappedQuestion, setSwappedQuestion] = useState<QuizQuestion | null>(null);
  const [doubleDipUnlocked, setDoubleDipUnlocked] = useState(false);
  const [doubleDipActive, setDoubleDipActive] = useState(false);
  const [doubleDipSecondChance, setDoubleDipSecondChance] = useState(false);
  const [timeBoostAvailable, setTimeBoostAvailable] = useState(false);
  const [timeBoostUsed, setTimeBoostUsed] = useState(false);

  const [usedLifelines, setUsedLifelines] = useState({
    nisf: false,
    ishara: false,
    poll: false,
    tabdeeli: false,
    doubleDip: false,
  });

  // Streak, Speed Bonus & Visual FX State
  const [streak, setStreak] = useState(0);
  const [peakStreak, setPeakStreak] = useState(0);
  const [runXp, setRunXp] = useState(0);
  const [speedBonusTotal, setSpeedBonusTotal] = useState(0);
  const [safeXp, setSafeXp] = useState(0);
  const [bankedXp, setBankedXp] = useState<number | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [copiedScore, setCopiedScore] = useState(false);

  const [burstKind, setBurstKind] = useState<ParticleBurstKind>("none");
  const [burstId, setBurstId] = useState(0);
  const [toasts, setToasts] = useState<FloatingToastItem[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [sanadOpen, setSanadOpen] = useState(false);
  const [vaultDrawerOpen, setVaultDrawerOpen] = useState(false);

  // Fastest Finger First State
  const [fffOpen, setFffOpen] = useState(false);
  const [fffChallenge, setFffChallenge] = useState<FastestFingerChallenge>(() =>
    pickRandomFastestFinger()
  );
  const [fffPickOrder, setFffPickOrder] = useState<number[]>([]);
  const [fffTimeLeft, setFffTimeLeft] = useState(25);
  const [fffStatus, setFffStatus] = useState<"playing" | "won" | "lost">("playing");

  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate Vault from localStorage and deal an unseen-prioritized randomized deck
  useEffect(() => {
    const loaded = loadQuizVault();
    Promise.resolve().then(() => {
      setVault(loaded);
      setVaultHydrated(true);
      setDeck(buildTopicDeck("all", loaded.seenQuestionIds, "ladder15"));
    });
  }, []);

  // Manage Studio Atmosphere Drone
  useEffect(() => {
    if (!droneRef.current) droneRef.current = new HotSeatDrone();
    const shouldPlay =
      droneOn && !muted && !fffOpen && outcome === "playing" && !isLocking;
    if (shouldPlay) {
      droneRef.current.start();
    } else {
      droneRef.current.stop();
    }
    return () => {
      droneRef.current?.stop();
    };
  }, [droneOn, muted, fffOpen, outcome, isLocking]);

  const pushToast = useCallback(
    (label: string, sublabel?: string, tone: FloatingToastItem["tone"] = "gold") => {
      const id = Date.now() + Math.floor(Math.random() * 10000);
      setToasts((prev) => [...prev.slice(-3), { id, label, sublabel, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((item) => item.id !== id));
      }, 2800);
    },
    []
  );

  const fireConfetti = useCallback((kind: ParticleBurstKind) => {
    setBurstKind(kind);
    setBurstId((n) => n + 1);
  }, []);

  const isLadder = runFormat === "ladder15";
  const totalSteps = deck.length;
  const question = swappedQuestion || deck[tierIdx] || QUIZ_BANK[0];
  const questionId = question.id;
  const questionCorrectIdx = question.correctIdx;
  const questionCommunityPoll = question.communityPoll;
  const stepReward = isLadder
    ? TIER_REWARDS[Math.min(tierIdx, TIER_REWARDS.length - 1)]
    : (question.tier || 1) * 200;

  const getClockForStep = useCallback(
    (idx: number, fmt: RunFormat): number | null => {
      if (fmt === "blitz20") return 22;
      if (idx < 5) return 30;
      if (idx < 10) return 45;
      return null; // Unlimited contemplation on Tiers 11–15
    },
    []
  );

  const totalSeconds = getClockForStep(tierIdx, runFormat);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(30);

  // Record current question as "seen" so future runs prioritize unseen questions
  useEffect(() => {
    if (!vaultHydrated || !questionId) return;
    Promise.resolve().then(() => {
      setVault((prev) => {
        if (prev.seenQuestionIds.includes(questionId)) return prev;
        const nextSeen = [...prev.seenQuestionIds, questionId].slice(-280);
        const updated = { ...prev, seenQuestionIds: nextSeen };
        saveQuizVault(updated);
        return updated;
      });
    });
  }, [questionId, vaultHydrated]);

  const getTopicLabel = useCallback(
    (topic: TopicFilter): string => {
      switch (topic) {
        case "all":
          return ui.topicAll;
        case "aqidah":
          return ui.topicAqidah;
        case "fiqh":
          return ui.topicFiqh;
        case "seerah":
          return ui.topicSeerah;
        case "quran":
          return ui.topicQuran;
        case "auliya":
          return ui.topicAuliya;
        case "history":
          return ui.topicHistory;
      }
    },
    [ui]
  );

  const getQuestionCategoryLabel = (cat: QuizCategory): string => {
    switch (cat) {
      case "Hanafi Fiqh":
        return ui.topicFiqh;
      case "Quran & Kanzul Iman":
        return ui.topicQuran;
      case "Lives of the Auliya":
        return ui.topicAuliya;
      case "Aqaid & Seerah":
        return `${ui.topicAqidah} · ${ui.topicSeerah}`;
    }
  };

  const updateVaultEndOfRun = useCallback(
    (
      finalOutcome: "won" | "walked" | "wrong",
      finalXp: number,
      achievedSteps: number,
      maxRunStreak: number,
      extraMedals: string[] = []
    ) => {
      setVault((prev) => {
        const medalSet = new Set([...prev.unlockedMedals, ...extraMedals]);
        if (finalOutcome === "won" && isLadder) medalSet.add("grand-crown");
        if (prev.masteredQuestionIds.length >= 50) medalSet.add("vault-50");

        const entry = {
          id: `run-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          mode:
            topicFilter === "all"
              ? isLadder
                ? ui.modeChampionship
                : ui.modeBlitz
              : getTopicLabel(topicFilter),
          tierReached: achievedSteps,
          totalSteps,
          xpEarned: finalXp,
          maxStreak: maxRunStreak,
          outcome: finalOutcome,
        };

        const updated: QuizVaultProfile = {
          ...prev,
          unlockedMedals: Array.from(medalSet),
          gamesPlayed: prev.gamesPlayed + 1,
          crownsWon:
            prev.crownsWon + (finalOutcome === "won" && isLadder ? 1 : 0),
          bestStreak: Math.max(prev.bestStreak, maxRunStreak),
          recentRuns: [entry, ...prev.recentRuns].slice(0, 8),
        };
        saveQuizVault(updated);
        return updated;
      });
    },
    [topicFilter, isLadder, totalSteps, ui, getTopicLabel]
  );

  const commitPoints = useCallback(
    (
      pts: number,
      finalOutcome: "won" | "walked" | "wrong",
      achievedTier?: number,
      maxRunStreak = peakStreak,
      extraMedals: string[] = []
    ) => {
      const totalAward = pts + speedBonusTotal;
      if (totalAward > 0) addIlmPoints(totalAward, achievedTier);
      setBankedXp(totalAward);
      updateVaultEndOfRun(
        finalOutcome,
        totalAward,
        answeredCount + (finalOutcome === "won" ? 1 : 0),
        maxRunStreak,
        extraMedals
      );
    },
    [addIlmPoints, speedBonusTotal, peakStreak, updateVaultEndOfRun, answeredCount]
  );

  // Main Countdown Clock + Heartbeat FX
  useEffect(() => {
    if (
      fffOpen ||
      isLocking ||
      outcome !== "playing" ||
      secondsLeft === null ||
      secondsLeft <= 0
    ) {
      return;
    }
    const id = setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setStreak(0);
        setOutcome("wrong");
        setShakeKey((k) => k + 1);
        playQuizSfx("wrong", muted);
        commitPoints(
          safeXp,
          "wrong",
          isLadder && tierIdx > 0 ? tierIdx : undefined
        );
      } else {
        const next = secondsLeft - 1;
        setSecondsLeft(next);
        if (next <= 8) {
          playQuizSfx("heartbeat", muted);
        } else if (next <= 12) {
          playQuizSfx("tick", muted);
        }
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [
    fffOpen,
    isLocking,
    secondsLeft,
    outcome,
    muted,
    safeXp,
    isLadder,
    tierIdx,
    commitPoints,
  ]);

  // Fastest Finger First Clock
  useEffect(() => {
    if (!fffOpen || fffStatus !== "playing" || fffTimeLeft <= 0) return;
    const id = setTimeout(() => {
      if (fffTimeLeft <= 1) {
        setFffTimeLeft(0);
        setFffStatus("lost");
        playQuizSfx("wrong", muted);
      } else {
        const next = fffTimeLeft - 1;
        setFffTimeLeft(next);
        if (next <= 6) playQuizSfx("tick", muted);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [fffOpen, fffStatus, fffTimeLeft, muted]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  // Compute dynamic Poll adjusted for 50:50 eliminations
  const effectivePoll = useMemo(() => {
    const raw = questionCommunityPoll;
    if (eliminatedOpts.length === 0) return raw;
    const activeIndices = [0, 1, 2, 3].filter((i) => !eliminatedOpts.includes(i));
    const sumActive = activeIndices.reduce((acc, idx) => acc + raw[idx], 0) || 1;
    const out: [number, number, number, number] = [0, 0, 0, 0];
    let assigned = 0;
    activeIndices.forEach((idx, pos) => {
      if (pos === activeIndices.length - 1) {
        out[idx] = Math.max(0, 100 - assigned);
      } else {
        const scaled = Math.round((raw[idx] / sumActive) * 100);
        out[idx] = scaled;
        assigned += scaled;
      }
    });
    return out;
  }, [questionCommunityPoll, eliminatedOpts]);

  const lifelinesUsedCount = Object.values(usedLifelines).filter(Boolean).length;

  const revealAnswer = useCallback(
    (idx: number) => {
      setIsLocking(false);

      if (idx === questionCorrectIdx) {
        setDoubleDipActive(false);
        setDoubleDipSecondChance(false);

        const nextStreak = streak + 1;
        const nextPeak = Math.max(peakStreak, nextStreak);
        setStreak(nextStreak);
        setPeakStreak(nextPeak);
        setAnsweredCount((c) => c + 1);

        let speedBonus = 0;
        if (secondsLeft !== null && totalSeconds !== null) {
          const ratio = secondsLeft / totalSeconds;
          if (ratio >= 0.65) {
            speedBonus = Math.round(50 * Math.min(4, nextStreak));
          } else if (ratio >= 0.4) {
            speedBonus = Math.round(25 * Math.min(3, nextStreak));
          }
        } else {
          speedBonus = 150 * Math.min(5, nextStreak);
        }
        setSpeedBonusTotal((s) => s + speedBonus);

        if (nextStreak === 3 && !timeBoostUsed && !timeBoostAvailable) {
          setTimeBoostAvailable(true);
          pushToast("+20s", `3x ${ui.streak}`, "violet");
        }

        const newlyEarnedMedals: string[] = [];
        if (nextStreak >= 5) newlyEarnedMedals.push("streak-5");
        if (nextStreak >= 10) newlyEarnedMedals.push("streak-10");
        if (isLadder && tierIdx === 4) newlyEarnedMedals.push("first-padav");
        if (isLadder && tierIdx === 9) {
          newlyEarnedMedals.push("second-padav");
          if (lifelinesUsedCount === 0) newlyEarnedMedals.push("no-lifeline-10");
        }

        setVault((prev) => {
          const mastered = prev.masteredQuestionIds.includes(questionId)
            ? prev.masteredQuestionIds
            : [...prev.masteredQuestionIds, questionId];
          const medals = new Set([...prev.unlockedMedals, ...newlyEarnedMedals]);
          if (mastered.length >= 50) medals.add("vault-50");
          const updated = {
            ...prev,
            masteredQuestionIds: mastered,
            unlockedMedals: Array.from(medals),
            bestStreak: Math.max(prev.bestStreak, nextPeak),
          };
          saveQuizVault(updated);
          return updated;
        });

        if (isLadder) {
          const earned = TIER_REWARDS[tierIdx];
          setRunXp(earned);
          const hitSafe = SAFE_TIERS.includes(tierIdx);
          if (hitSafe) setSafeXp(earned);

          if (tierIdx === 4 && !doubleDipUnlocked) {
            setDoubleDipUnlocked(true);
            pushToast(
              `${ui.safeMilestone} · 1,000 XP`,
              ui.lifelineDouble,
              "gold"
            );
          } else if (tierIdx === 9) {
            pushToast(ui.safeMilestone, "32,000 XP", "gold");
          }

          if (tierIdx === totalSteps - 1) {
            setOutcome("won");
            playQuizSfx("win", muted);
            fireConfetti("grand_crown");
            speakHostLine(ui.championshipCompleted, hostVoiceOn);
            commitPoints(earned, "won", 15, nextPeak, [
              ...newlyEarnedMedals,
              "grand-crown",
            ]);
            setTimeout(() => setSanadOpen(true), 1200);
          } else {
            setOutcome("correct");
            if (hitSafe) {
              playQuizSfx("milestone", muted);
              fireConfetti("padav");
              speakHostLine(
                `${ui.safeMilestone}. ${earned.toLocaleString()} XP.`,
                hostVoiceOn
              );
            } else {
              playQuizSfx("correct", muted, nextStreak);
              if (nextStreak >= 2) playQuizSfx("combo", muted, nextStreak);
              fireConfetti("sparkle");
              pushToast(
                `+${earned.toLocaleString()} XP${
                  speedBonus > 0 ? ` (+${speedBonus})` : ""
                }`,
                nextStreak >= 2
                  ? `${nextStreak}x ${ui.streak}`
                  : ui.correctAnswer,
                "emerald"
              );
              speakHostLine(ui.correctAnswer, hostVoiceOn);
            }
          }
        } else {
          const comboMult = Math.min(3, 1 + Math.floor(nextStreak / 3) * 0.5);
          const stepEarned = Math.round(stepReward * comboMult);
          const earned = runXp + stepEarned;
          setRunXp(earned);
          setSafeXp(earned);
          pushToast(
            `+${stepEarned.toLocaleString()} XP`,
            `${nextStreak}x ${ui.streak}`,
            "emerald"
          );

          if (tierIdx === totalSteps - 1) {
            setOutcome("won");
            playQuizSfx("win", muted);
            fireConfetti("grand_crown");
            commitPoints(earned, "won", undefined, nextPeak, newlyEarnedMedals);
            setTimeout(() => setSanadOpen(true), 1000);
          } else {
            setOutcome("correct");
            playQuizSfx("correct", muted, nextStreak);
            fireConfetti("sparkle");
          }
        }
      } else {
        if (doubleDipActive && !doubleDipSecondChance) {
          setDoubleDipSecondChance(true);
          setEliminatedOpts((prev) => [...prev, idx]);
          setSelectedOpt(null);
          playQuizSfx("lifeline", muted);
          pushToast(ui.lifelineDouble, ui.secondChancePrompt, "gold");
          speakHostLine(ui.secondChancePrompt, hostVoiceOn);
          return;
        }

        setDoubleDipActive(false);
        setDoubleDipSecondChance(false);
        setStreak(0);
        setOutcome("wrong");
        setShakeKey((k) => k + 1);
        playQuizSfx("wrong", muted);
        speakHostLine(ui.reviewExplanation, hostVoiceOn);
        commitPoints(
          safeXp,
          "wrong",
          isLadder && tierIdx > 0 ? tierIdx : undefined
        );
      }
    },
    [
      questionCorrectIdx,
      questionId,
      streak,
      peakStreak,
      secondsLeft,
      totalSeconds,
      timeBoostUsed,
      timeBoostAvailable,
      pushToast,
      ui,
      isLadder,
      tierIdx,
      lifelinesUsedCount,
      doubleDipUnlocked,
      totalSteps,
      muted,
      fireConfetti,
      hostVoiceOn,
      commitPoints,
      stepReward,
      runXp,
      doubleDipActive,
      doubleDipSecondChance,
      safeXp,
    ]
  );

  const lockInAnswer = useCallback(
    (idx: number) => {
      if (outcome !== "playing" || isLocking) return;
      setIsLocking(true);
      playQuizSfx("lock", muted);
      speakHostLine(
        `${ui.lockAnswer}: ${String.fromCharCode(65 + idx)}`,
        hostVoiceOn
      );
      lockTimerRef.current = setTimeout(
        () => {
          revealAnswer(idx);
        },
        dramaticMode ? 1350 : 450
      );
    },
    [outcome, isLocking, muted, ui, hostVoiceOn, dramaticMode, revealAnswer]
  );

  const handleOptionSelect = useCallback(
    (idx: number) => {
      if (outcome !== "playing" || isLocking || eliminatedOpts.includes(idx)) return;
      setSelectedOpt(idx);
      playQuizSfx("select", muted);
    },
    [outcome, isLocking, eliminatedOpts, muted]
  );

  const nextTier = useCallback(() => {
    const next = Math.min(totalSteps - 1, tierIdx + 1);
    setTierIdx(next);
    setSecondsLeft(getClockForStep(next, runFormat));
    setSelectedOpt(null);
    setIsLocking(false);
    setOutcome("playing");
    setEliminatedOpts([]);
    setShowIshara(false);
    setIsharaRinging(false);
    setShowPoll(false);
    setSwappedQuestion(null);
    setDoubleDipActive(false);
    setDoubleDipSecondChance(false);
    playQuizSfx("select", muted);
  }, [totalSteps, tierIdx, getClockForStep, runFormat, muted]);

  const startNewRun = useCallback(
    (topic: TopicFilter, fmt: RunFormat = runFormat) => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      const currentSeen = loadQuizVault().seenQuestionIds;
      const freshDeck = buildTopicDeck(topic, currentSeen, fmt);

      setFffOpen(false);
      setSanadOpen(false);
      setTopicFilter(topic);
      setRunFormat(fmt);
      setDeck(freshDeck);
      setTierIdx(0);
      setSecondsLeft(getClockForStep(0, fmt));
      setSelectedOpt(null);
      setIsLocking(false);
      setOutcome("playing");
      setEliminatedOpts([]);
      setShowIshara(false);
      setIsharaRinging(false);
      setShowPoll(false);
      setSwappedQuestion(null);
      setDoubleDipUnlocked(false);
      setDoubleDipActive(false);
      setDoubleDipSecondChance(false);
      setTimeBoostAvailable(false);
      setTimeBoostUsed(false);
      setStreak(0);
      setPeakStreak(0);
      setRunXp(0);
      setSpeedBonusTotal(0);
      setSafeXp(0);
      setBankedXp(null);
      setAnsweredCount(0);
      setCopiedScore(false);
      setUsedLifelines({
        nisf: false,
        ishara: false,
        poll: false,
        tabdeeli: false,
        doubleDip: false,
      });

      playQuizSfx("intro", muted);
      pushToast(
        ui.newChallenge,
        fmt === "ladder15" ? ui.modeChampionship : ui.modeBlitz,
        "violet"
      );
    },
    [runFormat, getClockForStep, muted, pushToast, ui]
  );

  // Fastest Finger First Handlers
  const openFastestFinger = () => {
    const pick = pickRandomFastestFinger(fffChallenge.id);
    setFffChallenge(pick);
    setFffPickOrder([]);
    setFffTimeLeft(25);
    setFffStatus("playing");
    setFffOpen(true);
    playQuizSfx("intro", muted);
  };

  const handleFffPick = (idx: number) => {
    if (fffStatus !== "playing" || fffPickOrder.includes(idx)) return;
    const nextOrder = [...fffPickOrder, idx];
    setFffPickOrder(nextOrder);
    playQuizSfx("select", muted);

    if (nextOrder.length === 4) {
      const ok = nextOrder.every((val, i) => val === fffChallenge.correctOrder[i]);
      if (ok) {
        setFffStatus("won");
        const fastBonus = fffTimeLeft >= 15 ? 500 : 250;
        playQuizSfx("milestone", muted);
        fireConfetti("padav");
        addIlmPoints(fastBonus);
        pushToast(
          `${ui.modeFastestFinger} (+${fastBonus} XP)`,
          `${fffTimeLeft}s`,
          "gold"
        );
        if (fffTimeLeft >= 15) {
          setVault((prev) => {
            if (prev.unlockedMedals.includes("speed-demon")) return prev;
            const updated = {
              ...prev,
              unlockedMedals: [...prev.unlockedMedals, "speed-demon"],
            };
            saveQuizVault(updated);
            return updated;
          });
        }
      } else {
        setFffStatus("lost");
        setShakeKey((k) => k + 1);
        playQuizSfx("wrong", muted);
      }
    }
  };

  const walkAway = () => {
    if (
      runXp <= 0 ||
      isLocking ||
      outcome === "won" ||
      outcome === "wrong" ||
      outcome === "walked"
    ) {
      return;
    }
    setOutcome("walked");
    playQuizSfx("milestone", muted);
    fireConfetti("sparkle");
    commitPoints(
      runXp,
      "walked",
      isLadder ? tierIdx + (outcome === "correct" ? 1 : 0) : undefined
    );
    setTimeout(() => setSanadOpen(true), 650);
  };

  // Lifeline 1: 50:50
  const triggerNisf = () => {
    if (usedLifelines.nisf || outcome !== "playing" || isLocking) return;
    const wrongIndices = [0, 1, 2, 3].filter(
      (i) => i !== question.correctIdx && !eliminatedOpts.includes(i)
    );
    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    const removed = shuffled.slice(0, 2);
    setEliminatedOpts((prev) => [...prev, ...removed]);
    if (selectedOpt !== null && removed.includes(selectedOpt)) setSelectedOpt(null);
    setUsedLifelines((u) => ({ ...u, nisf: true }));
    playQuizSfx("lifeline", muted);
    pushToast(ui.lifeline5050, undefined, "gold");
  };

  // Lifeline 2: Scholar Hint
  const triggerIshara = useCallback(() => {
    if (usedLifelines.ishara || outcome !== "playing" || isLocking) return;
    setUsedLifelines((u) => ({ ...u, ishara: true }));
    setIsharaRinging(true);
    playQuizSfx("phone_ring", muted);
    setTimeout(() => {
      setIsharaRinging(false);
      setShowIshara(true);
      playQuizSfx("lifeline", muted);
    }, 900);
  }, [usedLifelines.ishara, outcome, isLocking, muted]);

  // Lifeline 3: Community Poll
  const triggerPoll = () => {
    if (usedLifelines.poll || outcome !== "playing" || isLocking) return;
    setShowPoll(true);
    setUsedLifelines((u) => ({ ...u, poll: true }));
    playQuizSfx("lifeline", muted);
    pushToast(ui.lifelinePoll, undefined, "violet");
  };

  // Lifeline 4: Switch Question
  const triggerTabdeeli = () => {
    if (usedLifelines.tabdeeli || outcome !== "playing" || isLocking) return;
    const exclude = [...deck.map((d) => d.id), ...vault.seenQuestionIds.slice(-40)];
    const replacement = pickAlternateQuestionForTier(
      question.id,
      question.tier,
      toBaseQuizCategory(topicFilter),
      exclude
    );
    setSwappedQuestion(replacement);
    setEliminatedOpts([]);
    setSelectedOpt(null);
    setShowIshara(false);
    setIsharaRinging(false);
    setShowPoll(false);
    setDoubleDipActive(false);
    setDoubleDipSecondChance(false);
    if (totalSeconds !== null) setSecondsLeft(totalSeconds);
    setUsedLifelines((u) => ({ ...u, tabdeeli: true }));
    playQuizSfx("lifeline", muted);
    pushToast(ui.lifelineSwitch, `${ui.tierLabel} ${question.tier}`, "violet");
  };

  // Lifeline 5: Double Chance (Unlocked at Tier 5 Milestone)
  const triggerDoubleDip = () => {
    if (
      !doubleDipUnlocked ||
      usedLifelines.doubleDip ||
      outcome !== "playing" ||
      isLocking
    ) {
      return;
    }
    setDoubleDipActive(true);
    setUsedLifelines((u) => ({ ...u, doubleDip: true }));
    playQuizSfx("lifeline", muted);
    pushToast(ui.lifelineDouble, undefined, "gold");
  };

  // Streak Power-Up: +20s
  const triggerTimeBoost = () => {
    if (
      !timeBoostAvailable ||
      timeBoostUsed ||
      secondsLeft === null ||
      outcome !== "playing" ||
      isLocking
    ) {
      return;
    }
    setSecondsLeft((s) => (s !== null ? s + 20 : null));
    setTimeBoostUsed(true);
    setTimeBoostAvailable(false);
    playQuizSfx("lifeline", muted);
    pushToast("+20s", undefined, "emerald");
  };

  // Keyboard Shortcuts (A/B/C/D, 1-4, Enter, H)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (fffOpen || sanadOpen || vaultDrawerOpen) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      const k = e.key.toLowerCase();
      if (outcome === "playing" && !isLocking) {
        if (k === "1" || k === "a") handleOptionSelect(0);
        else if (k === "2" || k === "b") handleOptionSelect(1);
        else if (k === "3" || k === "c") handleOptionSelect(2);
        else if (k === "4" || k === "d") handleOptionSelect(3);
        else if (k === "h") triggerIshara();
        else if (k === "enter" && selectedOpt !== null) lockInAnswer(selectedOpt);
      } else if (outcome === "correct" && k === "enter") {
        nextTier();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [
    fffOpen,
    sanadOpen,
    vaultDrawerOpen,
    outcome,
    isLocking,
    selectedOpt,
    handleOptionSelect,
    lockInAnswer,
    nextTier,
    triggerIshara,
  ]);

  const timerPct = useMemo(() => {
    if (secondsLeft === null || totalSeconds === null) return 100;
    return Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  }, [secondsLeft, totalSeconds]);

  const stageMood: StageMood = useMemo(() => {
    if (isLocking) return "locking";
    if (outcome === "won" || (outcome === "correct" && SAFE_TIERS.includes(tierIdx))) {
      return "milestone";
    }
    if (outcome === "correct") return "correct";
    if (outcome === "wrong") return "wrong";
    if (secondsLeft !== null && secondsLeft <= 8) return "urgent";
    return "normal";
  }, [isLocking, outcome, tierIdx, secondsLeft]);

  const rankInfo = useMemo(() => getIlmRank(ilmPoints), [ilmPoints]);

  const hostLine = useMemo(() => {
    if (isLocking) return ui.sealingAnswer;
    if (doubleDipSecondChance) return ui.secondChancePrompt;
    if (outcome === "won") return ui.championshipCompleted;
    if (outcome === "walked")
      return `${ui.safeScoreBanked}: +${(bankedXp ?? 0).toLocaleString()} XP`;
    if (outcome === "wrong") {
      return safeXp > 0
        ? `${ui.safeScoreBanked}: ${safeXp.toLocaleString()} XP · ${ui.reviewExplanation}`
        : ui.reviewExplanation;
    }
    if (outcome === "correct") {
      if (isLadder && SAFE_TIERS.includes(tierIdx)) {
        return `${ui.safeMilestone} · ${runXp.toLocaleString()} XP`;
      }
      return `${ui.correctAnswer} ${
        streak >= 2 ? `(${streak}x ${ui.streak})` : ""
      }`.trim();
    }
    if (isLadder && tierIdx >= 10) {
      return ui.hostUntimed;
    }
    return `${ui.tierLabel} ${tierIdx + 1} · ${stepReward.toLocaleString()} XP — ${
      ui.hostReady
    }`;
  }, [
    isLocking,
    doubleDipSecondChance,
    outcome,
    bankedXp,
    safeXp,
    isLadder,
    tierIdx,
    runXp,
    streak,
    stepReward,
    ui,
  ]);

  const copyCertificate = () => {
    const modeName =
      topicFilter === "all"
        ? isLadder
          ? ui.modeChampionship
          : ui.modeBlitz
        : getTopicLabel(topicFilter);
    const text = `${t(lang, "navQuiz")} (${modeName}): ${answeredCount}/${totalSteps} · ${
      ui.streak
    } ${peakStreak}x · ${rankInfo.current.title} · +${(
      bankedXp ?? runXp
    ).toLocaleString()} XP`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedScore(true);
      setTimeout(() => setCopiedScore(false), 2000);
    });
  };

  const totalBankSize = QUIZ_BANK.length;

  const topicOptions: { id: TopicFilter; label: string }[] = [
    { id: "all", label: ui.topicAll },
    { id: "aqidah", label: ui.topicAqidah },
    { id: "fiqh", label: ui.topicFiqh },
    { id: "seerah", label: ui.topicSeerah },
    { id: "quran", label: ui.topicQuran },
    { id: "auliya", label: ui.topicAuliya },
    { id: "history", label: ui.topicHistory },
  ];

  return (
    <div className="space-y-5 relative">
      {/* Canvas Confetti / Particle Engine */}
      <QuizConfettiCanvas burstKind={burstKind} burstId={burstId} />
      <FloatingXpBursts items={toasts} />

      {/* Sanad Certificate Modal */}
      <SanadCertificateModal
        open={sanadOpen}
        onClose={() => setSanadOpen(false)}
        playerName={user?.name || tp(lang, "Guest")}
        rank={rankInfo.current}
        modeLabel={
          topicFilter === "all"
            ? isLadder
              ? ui.modeChampionship
              : ui.modeBlitz
            : getTopicLabel(topicFilter)
        }
        outcome={
          outcome === "won" ? "won" : outcome === "walked" ? "walked" : "wrong"
        }
        answeredCount={answeredCount}
        totalSteps={totalSteps}
        bankedXp={bankedXp ?? runXp}
        speedBonusXp={speedBonusTotal}
        peakStreak={peakStreak}
        masteredCount={vault.masteredQuestionIds.length}
        unlockedMedals={vault.unlockedMedals}
        onCopyShare={copyCertificate}
        copied={copiedScore}
        onPlayAgain={() => startNewRun(topicFilter, runFormat)}
      />

      {/* Top Editorial Stage Header + Compact Audio/FX Pill Cluster */}
      <header className="bento-card p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {t(lang, "navQuiz")}
            </h1>
            <p
              className="text-xs sm:text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {t(lang, "quizSubtitle")}
            </p>
          </div>

          {/* Right Column: Compact Audio/FX Pill Cluster + Rank Strip */}
          <div className="flex flex-col sm:items-end gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              {/* Compact Sleek Audio/FX Pill Cluster: Sound | Atmosphere | Voice */}
              <div
                className="inline-flex items-center rounded-full p-1 border"
                style={{
                  backgroundColor: "var(--bg-muted)",
                  borderColor: "var(--border-hairline)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setMuted((m) => !m)}
                  className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: !muted ? "var(--accent-soft)" : "transparent",
                    color: !muted ? "var(--accent-primary)" : "var(--text-muted)",
                  }}
                >
                  {muted ? (
                    <VolumeX className="w-3.5 h-3.5" />
                  ) : (
                    <Volume2 className="w-3.5 h-3.5" />
                  )}
                  <span>{ui.sound}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setDroneOn((d) => !d)}
                  className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: droneOn ? "var(--gold-soft)" : "transparent",
                    color: droneOn ? "var(--accent-gold)" : "var(--text-muted)",
                  }}
                >
                  <Radio className="w-3.5 h-3.5" />
                  <span>{ui.atmosphere}</span>
                </button>

                <button
                  type="button"
                  onClick={() => setHostVoiceOn((v) => !v)}
                  className="px-3 py-1 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                  style={{
                    backgroundColor: hostVoiceOn
                      ? "var(--accent-soft)"
                      : "transparent",
                    color: hostVoiceOn
                      ? "var(--accent-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  {hostVoiceOn ? (
                    <Mic className="w-3.5 h-3.5" />
                  ) : (
                    <MicOff className="w-3.5 h-3.5" />
                  )}
                  <span>{ui.voice}</span>
                </button>
              </div>

              {/* Discreet Honors & Progress Toggle */}
              <button
                type="button"
                onClick={() => setVaultDrawerOpen((v) => !v)}
                className="px-3 py-1.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                style={{
                  borderColor: vaultDrawerOpen
                    ? "var(--accent-primary)"
                    : "var(--border-hairline)",
                  backgroundColor: vaultDrawerOpen
                    ? "var(--accent-soft)"
                    : "var(--bg-muted)",
                  color: "var(--text-primary)",
                }}
              >
                <Medal
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--accent-gold)" }}
                />
                <span className="tabular-nums">
                  {vault.unlockedMedals.length}/{QUIZ_MEDALS.length}
                </span>
              </button>
            </div>

            {/* Compact Scholarly Rank Strip */}
            <div
              className="w-full sm:w-80 px-3.5 py-2 rounded-2xl border flex flex-col gap-1"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-muted)",
              }}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span
                  className="font-bold flex items-center gap-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  <span>{rankInfo.current.title}</span>
                  <span
                    className="font-arabic text-xs"
                    style={{ color: "var(--text-muted)" }}
                  >
                    ({rankInfo.current.arabicTitle})
                  </span>
                </span>
                <span
                  className="font-bold tabular-nums"
                  style={{ color: "var(--accent-gold)" }}
                >
                  {ilmPoints.toLocaleString()} XP
                </span>
              </div>
              <div
                className="h-1.5 w-full rounded-full overflow-hidden"
                style={{ backgroundColor: "var(--bg-surface)" }}
              >
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rankInfo.progressPct}%` }}
                  className="h-full rounded-full"
                  style={{ backgroundImage: "var(--gradient-brand)" }}
                />
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Expandable Honors & Scholarly Progress Drawer */}
      <AnimatePresence>
        {vaultDrawerOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bento-card p-5 space-y-5 overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2
                className="text-base font-bold flex items-center gap-2"
                style={{ color: "var(--text-primary)" }}
              >
                <Medal
                  className="w-4 h-4"
                  style={{ color: "var(--accent-gold)" }}
                />
                <span>{ui.honorsTitle}</span>
              </h2>
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="px-3 py-1 rounded-xl border font-semibold tabular-nums inline-flex items-center gap-1.5"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    borderColor: "var(--border-hairline)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Crown
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--accent-gold)" }}
                  />
                  <span>
                    {ui.championshipsWon}: {vault.crownsWon}
                  </span>
                </span>
                <span
                  className="px-3 py-1 rounded-xl border font-semibold tabular-nums inline-flex items-center gap-1.5"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    borderColor: "var(--border-hairline)",
                    color: "var(--text-primary)",
                  }}
                >
                  <Flame
                    className="w-3.5 h-3.5"
                    style={{ color: "var(--accent-gold)" }}
                  />
                  <span>
                    {ui.streak}: {vault.bestStreak}x
                  </span>
                </span>
                <span
                  className="px-3 py-1 rounded-xl border font-semibold tabular-nums"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    borderColor: "var(--border-hairline)",
                    color: "var(--text-primary)",
                  }}
                >
                  {ui.highestTier}: {bestQuizTier}/15
                </span>
              </div>
            </div>

            {/* 8 Unlockable Medals Grid (Zero Raw Emojis) */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {QUIZ_MEDALS.map((m) => {
                const unlocked = vault.unlockedMedals.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      unlocked ? "opacity-100" : "opacity-50"
                    }`}
                    style={{
                      borderColor: unlocked
                        ? "var(--accent-gold)"
                        : "var(--border-hairline)",
                      backgroundColor: unlocked
                        ? "var(--gold-soft)"
                        : "var(--bg-muted)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <Award
                        className="w-4 h-4"
                        style={{
                          color: unlocked
                            ? "var(--accent-gold)"
                            : "var(--text-muted)",
                        }}
                      />
                      <span
                        className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--text-muted)",
                        }}
                      >
                        {unlocked ? ui.Unlocked : ui.Locked}
                      </span>
                    </div>
                    <div
                      className="text-xs font-bold mt-1.5"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {m.title}
                    </div>
                    <div
                      className="text-[10px]"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {m.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 15-Tier Mastery Progress */}
            <div>
              <div
                className="text-xs font-bold uppercase tracking-wider mb-2"
                style={{ color: "var(--text-muted)" }}
              >
                {ui.masteredCountLabel} ({vault.masteredQuestionIds.length}/
                {totalBankSize})
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-15 gap-1.5">
                {Array.from({ length: 15 }, (_, i) => {
                  const tierNum = i + 1;
                  const pool = QUIZ_BANK.filter((q) => q.tier === tierNum);
                  const mast = pool.filter((q) =>
                    vault.masteredQuestionIds.includes(q.id)
                  ).length;
                  return (
                    <div
                      key={tierNum}
                      className="p-2 rounded-xl border text-center"
                      style={{
                        borderColor: SAFE_TIERS.includes(i)
                          ? "var(--accent-gold)"
                          : "var(--border-hairline)",
                        backgroundColor: "var(--bg-muted)",
                      }}
                    >
                      <div
                        className="text-[10px] font-bold tabular-nums"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        {tierNum}
                      </div>
                      <div
                        className="text-xs font-bold tabular-nums mt-0.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {mast}/{pool.length}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Runs History */}
            {vault.recentRuns.length > 0 && (
              <div className="space-y-1.5">
                <div
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {ui.recentSessions}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {vault.recentRuns.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-3 rounded-xl border text-xs flex items-center justify-between gap-2"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-muted)",
                      }}
                    >
                      <div className="min-w-0">
                        <div
                          className="font-bold truncate"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {r.mode}
                        </div>
                        <div
                          className="text-[10px] tabular-nums"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {r.date} · {r.tierReached}/{r.totalSteps} · {r.maxStreak}x
                        </div>
                      </div>
                      <span
                        className="font-bold tabular-nums shrink-0"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        +{r.xpEarned.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Game Mode Pill Bar & Topic Filter Strip */}
      <div className="space-y-2.5">
        <div className="flex flex-wrap items-center justify-between gap-2.5">
          <div className="overflow-x-auto pb-0.5">
            <div className="pill-tab-bar min-w-max">
              <button
                type="button"
                data-active={!fffOpen && runFormat === "ladder15"}
                onClick={() => startNewRun(topicFilter, "ladder15")}
                className="pill-tab-btn inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>{ui.modeChampionship}</span>
              </button>
              <button
                type="button"
                data-active={!fffOpen && runFormat === "blitz20"}
                onClick={() => startNewRun(topicFilter, "blitz20")}
                className="pill-tab-btn inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{ui.modeBlitz}</span>
              </button>
              <button
                type="button"
                data-active={fffOpen}
                onClick={openFastestFinger}
                className="pill-tab-btn inline-flex items-center gap-1.5 whitespace-nowrap"
              >
                <Zap className="w-3.5 h-3.5" />
                <span>{ui.modeFastestFinger}</span>
              </button>
            </div>
          </div>

          {!fffOpen && (
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setDramaticMode((d) => !d)}
                className="px-3 py-1.5 rounded-full border text-xs font-semibold cursor-pointer transition-colors"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-surface)",
                  color: dramaticMode
                    ? "var(--accent-gold)"
                    : "var(--text-muted)",
                }}
              >
                {dramaticMode ? ui.dramaticReveal : ui.instantReveal}
              </button>

              <button
                type="button"
                onClick={() => startNewRun(topicFilter, runFormat)}
                className="px-3.5 py-1.5 rounded-full border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-surface)",
                  color: "var(--text-primary)",
                }}
              >
                <RotateCcw
                  className="w-3.5 h-3.5"
                  style={{ color: "var(--accent-primary)" }}
                />
                <span>{ui.newChallenge}</span>
              </button>
            </div>
          )}
        </div>

        {/* 7 Scholarly Topic Filters */}
        {!fffOpen && (
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {topicOptions.map((topic) => {
              const active = topicFilter === topic.id;
              return (
                <button
                  key={topic.id}
                  type="button"
                  onClick={() => startNewRun(topic.id, runFormat)}
                  className="px-3 py-1.5 rounded-full border text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors"
                  style={{
                    borderColor: active
                      ? "var(--accent-primary)"
                      : "var(--border-hairline)",
                    backgroundColor: active
                      ? "var(--accent-soft)"
                      : "var(--bg-surface)",
                    color: active
                      ? "var(--accent-primary)"
                      : "var(--text-muted)",
                  }}
                >
                  {topic.label}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* FASTEST FINGER FIRST STAGE */}
      {fffOpen ? (
        <motion.section
          key={`fff-${shakeKey}`}
          animate={
            shakeKey > 0 && fffStatus === "lost"
              ? { x: [0, -10, 10, -6, 6, 0] }
              : {}
          }
          className="bento-card p-6 space-y-5 max-w-3xl mx-auto relative overflow-hidden"
        >
          <KbcStudioBeams
            mood={
              fffStatus === "won"
                ? "milestone"
                : fffTimeLeft <= 7
                ? "urgent"
                : "normal"
            }
          />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span
                  className="text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1.5"
                  style={{ color: "var(--accent-gold)" }}
                >
                  <Zap className="w-3.5 h-3.5" />
                  <span>{ui.modeFastestFinger}</span>
                </span>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  {ui.fffPromptSubtitle}
                </p>
                <h2
                  className="text-lg sm:text-xl font-bold mt-1.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {fffChallenge.prompt}
                </h2>
              </div>
              <div
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-sm font-extrabold tabular-nums shrink-0"
                style={{
                  borderColor:
                    fffTimeLeft <= 7 ? "var(--accent-danger)" : "var(--accent-gold)",
                  color:
                    fffTimeLeft <= 7 ? "var(--accent-danger)" : "var(--accent-gold)",
                }}
              >
                {fffTimeLeft}s
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {fffChallenge.items.map((item, idx) => {
                const orderPos = fffPickOrder.indexOf(idx);
                const picked = orderPos !== -1;
                return (
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    disabled={fffStatus !== "playing" || picked}
                    onClick={() => handleFffPick(idx)}
                    className="p-4 rounded-2xl border-2 text-start text-sm font-semibold flex items-center justify-between gap-3 cursor-pointer disabled:opacity-85 transition-all"
                    style={{
                      borderColor: picked
                        ? "var(--accent-gold)"
                        : "var(--border-hairline)",
                      backgroundColor: picked
                        ? "var(--gold-soft)"
                        : "var(--bg-muted)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <span>{item}</span>
                    <span
                      className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-extrabold shrink-0 tabular-nums"
                      style={{
                        borderColor: picked
                          ? "var(--accent-gold)"
                          : "var(--border-hairline)",
                        backgroundColor: picked
                          ? "var(--accent-gold)"
                          : "transparent",
                        color: picked ? "#091945" : "var(--text-muted)",
                      }}
                    >
                      {picked ? orderPos + 1 : String.fromCharCode(65 + idx)}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {fffStatus !== "playing" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl border space-y-2"
                style={{
                  borderColor: fffStatus === "won" ? "#10B981" : "#EF4444",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <div
                  className="font-bold text-sm flex items-center gap-2"
                  style={{ color: "var(--text-primary)" }}
                >
                  {fffStatus === "won" ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                      <span>
                        {ui.correctAnswer} (+{fffTimeLeft >= 15 ? 500 : 250} XP)
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-500" />
                      <span>{ui.reviewExplanation}</span>
                    </>
                  )}
                </div>
                <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
                  {fffChallenge.explanation}
                </p>
              </motion.div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setFffPickOrder([])}
                disabled={fffStatus !== "playing" || fffPickOrder.length === 0}
                className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer disabled:opacity-40"
                style={{
                  borderColor: "var(--border-hairline)",
                  color: "var(--text-primary)",
                }}
              >
                {ui.fffReset}
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openFastestFinger}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{
                    borderColor: "var(--border-hairline)",
                    color: "var(--text-primary)",
                  }}
                >
                  {ui.fffNextTrial}
                </button>
                <button
                  type="button"
                  onClick={() => startNewRun("all", "ladder15")}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{ui.fffReturnStage}</span>
                  <ArrowRight className="w-3.5 h-3.5 rtl-mirror" />
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      ) : (
        /* MAIN CHAMPIONSHIP STAGE + 15-TIER LADDER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <motion.section
            key={`stage-shake-${shakeKey}`}
            animate={
              shakeKey > 0 && outcome === "wrong"
                ? { x: [0, -12, 12, -9, 9, -5, 5, 0] }
                : {}
            }
            transition={{ duration: 0.45 }}
            className="lg:col-span-8 bento-card p-5 sm:p-6 space-y-5 relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 95% 65% at 50% 0%, rgba(245, 158, 11, 0.09), rgba(164, 74, 255, 0.05) 45%, transparent 75%), var(--bg-surface)",
            }}
          >
            <KbcStudioBeams mood={stageMood} />

            <div className="relative z-10 space-y-5">
              {/* 5 Lifelines Bar */}
              <div
                className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-4 border-b"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {[
                  {
                    id: "nisf",
                    label: ui.lifeline5050,
                    sub: "",
                    icon: Split,
                    used: usedLifelines.nisf,
                    locked: false,
                    activeNow: false,
                    onClick: triggerNisf,
                  },
                  {
                    id: "ishara",
                    label: ui.lifelineHint,
                    sub: "",
                    icon: PhoneCall,
                    used: usedLifelines.ishara,
                    locked: false,
                    activeNow: isharaRinging,
                    onClick: triggerIshara,
                  },
                  {
                    id: "poll",
                    label: ui.lifelinePoll,
                    sub: "",
                    icon: Users,
                    used: usedLifelines.poll,
                    locked: false,
                    activeNow: false,
                    onClick: triggerPoll,
                  },
                  {
                    id: "tabdeeli",
                    label: ui.lifelineSwitch,
                    sub: "",
                    icon: Shuffle,
                    used: usedLifelines.tabdeeli,
                    locked: false,
                    activeNow: false,
                    onClick: triggerTabdeeli,
                  },
                  {
                    id: "doubleDip",
                    label: ui.lifelineDouble,
                    sub: doubleDipUnlocked ? "2x" : `${ui.tierLabel} 5`,
                    icon: ShieldAlert,
                    used: usedLifelines.doubleDip,
                    locked: !doubleDipUnlocked,
                    activeNow: doubleDipActive,
                    onClick: triggerDoubleDip,
                  },
                ].map((lf) => {
                  const Icon = lf.icon;
                  return (
                    <motion.button
                      key={lf.id}
                      whileHover={!lf.used && !lf.locked ? { y: -1.5 } : {}}
                      whileTap={!lf.used && !lf.locked ? { scale: 0.97 } : {}}
                      type="button"
                      disabled={
                        lf.used || lf.locked || outcome !== "playing" || isLocking
                      }
                      onClick={lf.onClick}
                      className={`relative px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-start cursor-pointer transition-all disabled:opacity-35 ${
                        lf.activeNow ? "ring-2 ring-amber-400 animate-pulse" : ""
                      }`}
                      style={{
                        borderColor: lf.activeNow
                          ? "var(--accent-gold)"
                          : lf.used || lf.locked
                          ? "var(--border-hairline)"
                          : "color-mix(in srgb, var(--accent-gold) 45%, var(--border-hairline))",
                        backgroundColor: lf.activeNow
                          ? "var(--gold-soft)"
                          : lf.used || lf.locked
                          ? "var(--bg-muted)"
                          : "var(--bg-surface)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor:
                            lf.used || lf.locked ? "transparent" : "var(--gold-soft)",
                          color:
                            lf.used || lf.locked
                              ? "var(--text-muted)"
                              : "var(--accent-gold)",
                        }}
                      >
                        {lf.locked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <div className="min-w-0 leading-tight">
                        <div
                          className={`text-[11px] font-bold truncate ${
                            lf.used ? "line-through" : ""
                          }`}
                        >
                          {lf.label}
                        </div>
                        {lf.sub ? (
                          <div
                            className="text-[10px] truncate"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {lf.sub}
                          </div>
                        ) : null}
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Stage Telemetry Row */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span className="badge-pill badge-gold tabular-nums">
                    {isLadder
                      ? `${ui.tierLabel} ${tierIdx + 1}/15 · ${stepReward.toLocaleString()} XP`
                      : `${tierIdx + 1}/${totalSteps} · +${stepReward} XP`}
                  </span>

                  <span
                    className="px-2.5 py-1 rounded-full border text-[11px] font-medium"
                    style={{
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {getQuestionCategoryLabel(question.category)}
                  </span>

                  {streak > 0 && (
                    <motion.span
                      key={streak}
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className="badge-pill badge-gold inline-flex items-center gap-1 tabular-nums"
                    >
                      <Flame className="w-3 h-3" />
                      <span>
                        {streak}x {ui.streak}
                      </span>
                    </motion.span>
                  )}

                  {safeXp > 0 && isLadder && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-500 tabular-nums">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      <span>{safeXp.toLocaleString()} XP</span>
                    </span>
                  )}
                </div>

                {/* Right Controls: +20s, Walk Away Safely, Circular Countdown */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {timeBoostAvailable &&
                    secondsLeft !== null &&
                    outcome === "playing" &&
                    !isLocking && (
                      <motion.button
                        initial={{ scale: 0.9 }}
                        animate={{ scale: [1, 1.05, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        type="button"
                        onClick={triggerTimeBoost}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-emerald-500 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer tabular-nums"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>+20s</span>
                      </motion.button>
                    )}

                  {runXp > 0 &&
                    !isLocking &&
                    !doubleDipActive &&
                    (outcome === "playing" || outcome === "correct") && (
                      <button
                        type="button"
                        onClick={walkAway}
                        className="px-3 py-1.5 rounded-xl border text-[11px] font-bold inline-flex items-center gap-1.5 cursor-pointer transition-colors"
                        style={{
                          borderColor: "var(--accent-gold)",
                          color: "var(--accent-gold)",
                        }}
                      >
                        <LogOut className="w-3.5 h-3.5 rtl-mirror" />
                        <span>
                          {ui.walkAwaySafely} ({runXp.toLocaleString()})
                        </span>
                      </button>
                    )}

                  {/* Circular Countdown Gauge */}
                  {(() => {
                    const size = 54;
                    const r = 22;
                    const c = 2 * Math.PI * r;
                    const urgent = secondsLeft !== null && secondsLeft <= 8;
                    return (
                      <motion.div
                        animate={
                          urgent && outcome === "playing"
                            ? { scale: [1, 1.08, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.75, repeat: urgent ? Infinity : 0 }}
                        className="relative flex items-center justify-center"
                        style={{ width: size, height: size }}
                      >
                        <svg width={size} height={size} className="-rotate-90">
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="var(--bg-muted)"
                            stroke="var(--border-hairline)"
                            strokeWidth="3.5"
                          />
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke={
                              urgent
                                ? "#EF4444"
                                : isLocking
                                ? "#F59E0B"
                                : "var(--accent-gold)"
                            }
                            strokeWidth="4"
                            strokeLinecap="round"
                            strokeDasharray={c}
                            strokeDashoffset={c * (1 - timerPct / 100)}
                            style={{ transition: "stroke-dashoffset 0.9s linear" }}
                          />
                        </svg>
                        <span
                          className="absolute text-xs font-extrabold tabular-nums"
                          style={{
                            color: urgent ? "#EF4444" : "var(--text-primary)",
                          }}
                        >
                          {secondsLeft !== null ? (
                            secondsLeft
                          ) : (
                            <InfinityIcon className="w-4 h-4" />
                          )}
                        </span>
                      </motion.div>
                    );
                  })()}
                </div>
              </div>

              {/* Host Prompt Strip */}
              <div
                className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border text-xs"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                  color: "var(--text-secondary)",
                }}
              >
                <div className="flex items-center gap-2">
                  <Sparkles
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "var(--accent-gold)" }}
                  />
                  <span>{hostLine}</span>
                </div>
                {isLadder && (
                  <span
                    className="text-[11px] font-semibold shrink-0 hidden sm:inline"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    {stripLeadingSymbols(TIER_TITLES[tierIdx] || "")}
                  </span>
                )}
              </div>

              {/* DRAMATIC STAGE QUESTION POD */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 12, scale: 0.99 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.99 }}
                  transition={{ duration: 0.25 }}
                  className="relative flex items-center"
                >
                  <div
                    className="absolute inset-x-0 h-[1.5px] pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #F59E0B 15%, #DF98FA 50%, #F59E0B 85%, transparent 100%)",
                    }}
                  />
                  <div
                    className="relative z-10 w-full mx-1 sm:mx-3 p-5 sm:p-6 rounded-2xl border-2 text-center shadow-xl"
                    style={{
                      borderColor: isLocking
                        ? "#F59E0B"
                        : outcome === "correct" || outcome === "won"
                        ? "#10B981"
                        : outcome === "wrong"
                        ? "#EF4444"
                        : "rgba(245, 158, 11, 0.55)",
                      background:
                        "linear-gradient(180deg, rgba(18, 25, 49, 0.98) 0%, rgba(9, 25, 69, 0.96) 100%)",
                      boxShadow: isLocking
                        ? "0 0 32px rgba(245, 158, 11, 0.32)"
                        : "0 10px 28px -8px rgba(0,0,0,0.55)",
                    }}
                  >
                    <div className="text-[11px] font-semibold uppercase tracking-wider text-amber-300/85 mb-1.5">
                      {ui.tierLabel} {question.tier} ·{" "}
                      {getQuestionCategoryLabel(question.category)}
                    </div>
                    <h2 className="text-base sm:text-xl font-bold leading-snug text-white">
                      {question.question}
                    </h2>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* LIFELINE OVERLAYS: Scholar Hint & Community Poll */}
              <AnimatePresence>
                {isharaRinging && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.97 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl border text-xs font-bold flex items-center gap-3"
                    style={{
                      borderColor: "var(--accent-gold)",
                      backgroundColor: "var(--gold-soft)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <PhoneCall
                      className="w-4 h-4 animate-bounce shrink-0"
                      style={{ color: "var(--accent-gold)" }}
                    />
                    <span>{ui.consultingScholar}</span>
                  </motion.div>
                )}

                {showIshara && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border text-xs flex items-start gap-3"
                    style={{
                      borderColor: "var(--accent-gold)",
                      backgroundColor: "var(--gold-soft)",
                    }}
                  >
                    <div
                      className="w-9 h-9 rounded-full border flex items-center justify-center shrink-0"
                      style={{
                        borderColor: "var(--accent-gold)",
                        color: "var(--accent-gold)",
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                    </div>
                    <div className="space-y-0.5">
                      <div
                        className="font-bold uppercase tracking-wider text-[11px]"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        {ui.lifelineHint}
                      </div>
                      <p
                        className="leading-relaxed"
                        style={{ color: "var(--text-primary)" }}
                      >
                        &ldquo;{question.isharaHint}&rdquo;
                      </p>
                    </div>
                  </motion.div>
                )}

                {showPoll && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border space-y-2.5"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-muted)",
                    }}
                  >
                    <div
                      className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{ui.lifelinePoll}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 items-end h-28 pt-2">
                      {effectivePoll.map((pct, i) => {
                        const elim = eliminatedOpts.includes(i);
                        return (
                          <div
                            key={i}
                            className={`flex flex-col items-center justify-end h-full gap-1 ${
                              elim ? "opacity-25" : ""
                            }`}
                          >
                            <span
                              className="text-xs font-bold tabular-nums"
                              style={{ color: "var(--accent-gold)" }}
                            >
                              {pct}%
                            </span>
                            <div
                              className="w-full max-w-[42px] rounded-t-lg overflow-hidden flex items-end h-16"
                              style={{ backgroundColor: "var(--bg-surface)" }}
                            >
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${pct}%` }}
                                transition={{ duration: 0.75, ease: "easeOut" }}
                                className="w-full rounded-t-lg"
                                style={{ backgroundImage: "var(--gradient-brand)" }}
                              />
                            </div>
                            <span
                              className="text-xs font-bold"
                              style={{ color: "var(--text-primary)" }}
                            >
                              {String.fromCharCode(65 + i)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* 2x2 STAGE OPTION PODS */}
              <motion.div
                key={`opts-${question.id}`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.06 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {question.options.map((opt, idx) => {
                  const isElim = eliminatedOpts.includes(idx);
                  const isSel = selectedOpt === idx;
                  const isCorr = idx === question.correctIdx;

                  let borderCol = "rgba(161, 156, 197, 0.28)";
                  let bgCol = "rgba(9, 25, 69, 0.9)";
                  let badgeBg = "rgba(245, 158, 11, 0.16)";
                  let badgeText = "#FBBF24";
                  let glowShadow = "none";

                  if (outcome !== "playing" && outcome !== "walked") {
                    if (isCorr) {
                      borderCol = "#10B981";
                      bgCol = "rgba(6, 78, 59, 0.92)";
                      badgeBg = "#10B981";
                      badgeText = "#FFFFFF";
                      glowShadow = "0 0 22px rgba(16, 185, 129, 0.35)";
                    } else if (isSel) {
                      borderCol = "#EF4444";
                      bgCol = "rgba(127, 29, 29, 0.92)";
                      badgeBg = "#EF4444";
                      badgeText = "#FFFFFF";
                    }
                  } else if (isSel) {
                    borderCol = "#F59E0B";
                    bgCol = isLocking
                      ? "rgba(120, 53, 15, 0.92)"
                      : "rgba(30, 41, 82, 0.96)";
                    badgeBg = "#F59E0B";
                    badgeText = "#091945";
                    glowShadow = "0 0 20px rgba(245, 158, 11, 0.3)";
                  }

                  return (
                    <motion.button
                      key={`${question.id}-${idx}`}
                      variants={{
                        hidden: { opacity: 0, y: 8 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={
                        !isElim && outcome === "playing" && !isLocking
                          ? { scale: 1.01 }
                          : {}
                      }
                      whileTap={
                        !isElim && outcome === "playing" && !isLocking
                          ? { scale: 0.985 }
                          : {}
                      }
                      type="button"
                      disabled={isElim || outcome !== "playing" || isLocking}
                      onClick={() => handleOptionSelect(idx)}
                      onDoubleClick={() => {
                        if (!isElim && outcome === "playing" && !isLocking) {
                          handleOptionSelect(idx);
                          lockInAnswer(idx);
                        }
                      }}
                      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 text-start text-sm font-semibold flex items-center gap-3.5 cursor-pointer disabled:opacity-25 transition-colors overflow-hidden ${
                        isLocking && isSel ? "animate-pulse" : ""
                      }`}
                      style={{
                        borderColor: borderCol,
                        backgroundColor: bgCol,
                        boxShadow: glowShadow,
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-lg rotate-45 flex items-center justify-center shrink-0 border transition-colors"
                        style={{
                          borderColor: borderCol,
                          backgroundColor: badgeBg,
                          color: badgeText,
                        }}
                      >
                        <span className="-rotate-45 text-xs font-extrabold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      </span>

                      <span className="leading-snug text-white flex-1">
                        {isElim ? `— ${ui.eliminated} —` : opt}
                      </span>

                      {outcome !== "playing" && outcome !== "walked" && isCorr && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* LOCK ANSWER SUSPENSE BAR */}
              <AnimatePresence>
                {outcome === "playing" && selectedOpt !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="p-4 rounded-2xl border-2 space-y-2.5 relative overflow-hidden"
                    style={{
                      borderColor: "var(--accent-gold)",
                      backgroundColor: "var(--gold-soft)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div
                        className="text-xs sm:text-sm font-bold flex items-center gap-2"
                        style={{ color: "var(--text-primary)" }}
                      >
                        <Lock
                          className="w-4 h-4 shrink-0"
                          style={{ color: "var(--accent-gold)" }}
                        />
                        <span>
                          {isLocking
                            ? `${ui.sealingAnswer} (${String.fromCharCode(
                                65 + selectedOpt
                              )})`
                            : `${String.fromCharCode(65 + selectedOpt)} — ${
                                ui.lockAnswer
                              }?`}
                        </span>
                      </div>
                      <button
                        type="button"
                        disabled={isLocking}
                        onClick={() => lockInAnswer(selectedOpt)}
                        className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 cursor-pointer inline-flex items-center gap-1.5 hover:brightness-105 active:scale-95 transition-all disabled:opacity-60 shadow-md"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>
                          {isLocking ? ui.sealingAnswer : ui.lockAnswer}
                        </span>
                      </button>
                    </div>

                    {isLocking && (
                      <div className="h-1.5 w-full rounded-full bg-black/20 overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: dramaticMode ? 1.3 : 0.4,
                            ease: "easeInOut",
                          }}
                          className="h-full bg-gradient-to-r from-amber-400 via-orange-400 to-emerald-400"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* OUTCOME BANNER & SCHOLARLY EXPLANATION PANEL */}
              <AnimatePresence>
                {outcome !== "playing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border-2 space-y-3.5"
                    style={{
                      borderColor:
                        outcome === "wrong"
                          ? "rgba(239, 68, 68, 0.55)"
                          : outcome === "won"
                          ? "var(--accent-gold)"
                          : "rgba(16, 185, 129, 0.55)",
                      backgroundColor: "var(--bg-muted)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-bold text-sm sm:text-base">
                        {outcome === "wrong" ? (
                          <>
                            <XCircle className="w-5 h-5 text-red-500 shrink-0" />
                            <span style={{ color: "var(--text-primary)" }}>
                              {secondsLeft === 0
                                ? ui.timeExpired
                                : ui.reviewExplanation}{" "}
                              · {(bankedXp ?? 0).toLocaleString()} XP
                            </span>
                          </>
                        ) : outcome === "walked" ? (
                          <>
                            <Award
                              className="w-5 h-5 shrink-0"
                              style={{ color: "var(--accent-gold)" }}
                            />
                            <span style={{ color: "var(--text-primary)" }}>
                              {ui.safeScoreBanked} (+
                              {(bankedXp ?? 0).toLocaleString()} XP)
                            </span>
                          </>
                        ) : outcome === "won" ? (
                          <>
                            <Crown
                              className="w-5 h-5 shrink-0"
                              style={{ color: "var(--accent-gold)" }}
                            />
                            <span style={{ color: "var(--text-primary)" }}>
                              {ui.championshipCompleted} (+
                              {(bankedXp ?? 0).toLocaleString()} XP)
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                            <span style={{ color: "var(--text-primary)" }}>
                              {ui.correctAnswer} · {runXp.toLocaleString()} XP
                            </span>
                          </>
                        )}
                      </div>

                      {(outcome === "won" ||
                        outcome === "walked" ||
                        outcome === "wrong") && (
                        <div className="flex flex-wrap items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSanadOpen(true)}
                            className="px-3 py-1.5 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            style={{
                              backgroundColor: "var(--gold-soft)",
                              borderColor: "var(--accent-gold)",
                              color: "var(--accent-gold)",
                            }}
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>{ui.viewSanad}</span>
                          </button>
                          <button
                            type="button"
                            onClick={copyCertificate}
                            className="px-3 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                            style={{
                              backgroundColor: "var(--bg-surface)",
                              borderColor: "var(--border-hairline)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {copiedScore ? (
                              <Check className="w-3.5 h-3.5 text-emerald-500" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedScore ? ui.copied : ui.shareScore}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {outcome !== "walked" && (
                      <div
                        className="p-3.5 rounded-xl border text-xs leading-relaxed flex items-start gap-2.5"
                        style={{
                          backgroundColor: "var(--bg-surface)",
                          borderColor: "var(--border-hairline)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <BookOpen
                          className="w-4 h-4 shrink-0 mt-0.5"
                          style={{ color: "var(--accent-primary)" }}
                        />
                        <div>
                          <strong style={{ color: "var(--text-primary)" }}>
                            {ui.scholarlyExplanation}:
                          </strong>{" "}
                          {question.proofExplanation}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <Link
                        href={question.proofLink}
                        className="text-xs font-bold inline-flex items-center gap-1 hover:underline"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        <span>
                          {ui.reference}: {question.proofLinkLabel}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5 rtl-mirror" />
                      </Link>

                      {outcome === "correct" ? (
                        <button
                          type="button"
                          onClick={nextTier}
                          className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <span>
                            {ui.nextTier} ({tierIdx + 2}/{totalSteps})
                          </span>
                          <ArrowRight className="w-3.5 h-3.5 rtl-mirror" />
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startNewRun(topicFilter, runFormat)}
                          className="btn-primary px-5 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>{ui.newChallenge}</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                {ui.hotkeysHint}
              </p>
            </div>
          </motion.section>

          {/* RIGHT SIDEBAR: 15-TIER CHAMPIONSHIP LADDER */}
          <aside className="lg:col-span-4 bento-card p-5 space-y-2.5">
            <div
              className="flex items-center justify-between pb-2.5 border-b"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <div>
                <h2
                  className="text-sm font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {isLadder
                    ? ui.modeChampionship
                    : `${ui.modeBlitz} (${answeredCount}/${totalSteps})`}
                </h2>
                {!isLadder && (
                  <p
                    className="text-[11px] tabular-nums"
                    style={{ color: "var(--text-muted)" }}
                  >
                    +{speedBonusTotal.toLocaleString()} XP
                  </p>
                )}
              </div>
              {isLadder && (
                <span
                  className="text-[10px] font-bold uppercase tracking-wider inline-flex items-center gap-1"
                  style={{ color: "var(--accent-gold)" }}
                >
                  <ShieldCheck className="w-3 h-3" />
                  <span>{ui.safeMilestone}</span>
                </span>
              )}
            </div>

            {isLadder ? (
              <div className="space-y-1 flex flex-col-reverse">
                {TIER_REWARDS.map((pts, i) => {
                  const isSafe = SAFE_TIERS.includes(i);
                  const isCurrent = i === tierIdx;
                  const isPassed =
                    i < tierIdx ||
                    (i === tierIdx && (outcome === "correct" || outcome === "won"));
                  return (
                    <motion.div
                      key={i}
                      animate={isCurrent ? { x: [0, 3, 0] } : { x: 0 }}
                      transition={{
                        duration: 1.8,
                        repeat: isCurrent ? Infinity : 0,
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs flex items-center justify-between border transition-all"
                      style={{
                        borderColor: isCurrent
                          ? "var(--accent-gold)"
                          : isSafe
                          ? "color-mix(in srgb, var(--accent-gold) 30%, transparent)"
                          : "transparent",
                        backgroundColor: isCurrent
                          ? "var(--gold-soft)"
                          : isPassed
                          ? "rgba(16, 185, 129, 0.1)"
                          : "transparent",
                        color: isCurrent
                          ? "var(--accent-gold)"
                          : isSafe
                          ? "var(--text-primary)"
                          : isPassed
                          ? "#10B981"
                          : "var(--text-muted)",
                        fontWeight: isCurrent || isSafe ? 700 : 500,
                      }}
                    >
                      <span className="flex items-center gap-2 tabular-nums min-w-0">
                        <span className="w-5 text-end opacity-80">{i + 1}</span>
                        <span className="w-3.5 flex items-center justify-center shrink-0">
                          {i === 14 ? (
                            <Crown className="w-3.5 h-3.5" />
                          ) : isSafe ? (
                            <ShieldCheck className="w-3.5 h-3.5" />
                          ) : isPassed ? (
                            <Check className="w-3.5 h-3.5" />
                          ) : (
                            <span className="w-1.5 h-1.5 rounded-full bg-current opacity-40" />
                          )}
                        </span>
                        <span className="text-[11px] truncate opacity-90">
                          {stripLeadingSymbols(TIER_TITLES[i] || "")}
                        </span>
                      </span>
                      <span className="tabular-nums shrink-0">
                        {pts.toLocaleString()} XP
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {deck.map((q, i) => {
                  const isCurrent = i === tierIdx;
                  const isPassed =
                    i < tierIdx ||
                    (i === tierIdx && (outcome === "correct" || outcome === "won"));
                  return (
                    <div
                      key={`${q.id}-${i}`}
                      className="p-2 rounded-xl border text-center text-xs font-bold tabular-nums"
                      style={{
                        borderColor: isCurrent
                          ? "var(--accent-gold)"
                          : isPassed
                          ? "#10B981"
                          : "var(--border-hairline)",
                        backgroundColor: isCurrent
                          ? "var(--gold-soft)"
                          : isPassed
                          ? "rgba(16, 185, 129, 0.12)"
                          : "var(--bg-muted)",
                        color: isCurrent
                          ? "var(--accent-gold)"
                          : isPassed
                          ? "#10B981"
                          : "var(--text-muted)",
                      }}
                    >
                      <div>{i + 1}</div>
                      <div className="text-[9px] opacity-75">
                        {ui.tierLabel} {q.tier}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
