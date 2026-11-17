"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Search,
  MapPin,
  BookOpen,
  GitBranch,
  Eye,
  Calendar,
  Compass,
  Plus,
  Volume2,
  VolumeX,
  Image as ImageIcon,
  Film,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  X,
  Copy,
  Check,
  CheckCircle2,
  ExternalLink,
  Navigation,
  Clock,
  Landmark,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Award,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { HIJRI_MONTHS } from "@/lib/hijri";
import { formatLocalizedHijriMonth, LangCode, t, tp } from "@/lib/i18n";
import {
  resolvePublicAssetUrl,
  ShrineGalleryItem,
  AuthoredBook,
} from "@/data/auliya";

type AuliyaTab =
  | "tazkirah"
  | "gallery"
  | "ziyarat"
  | "video"
  | "shajrah"
  | "books"
  | "map";

interface AuliyaUiStrings {
  all: string;
  silsilaAll: string;
  silsilaQadri: string;
  silsilaChishti: string;
  silsilaNaqshbandi: string;
  silsilaSuhrawardi: string;
  silsilaRazavi: string;
  directoryHeading: string;
  noResults: string;
  birth: string;
  passing: string;
  shrineCity: string;
  annualUrs: string;
  blessedLife: string;
  earlyLife: string;
  spiritualTraining: string;
  revivalLegacy: string;
  historicalTimeline: string;
  blessedQuotes: string;
  recommendedWird: string;
  reciteStep: string;
  karamatRank: string;
  spiritualSuccessors: string;
  sacredEtiquettes: string;
  shrineArchitecture: string;
  visitingGuide: string;
  archStyle: string;
  historicalEra: string;
  patronage: string;
  precinctLandmarks: string;
  nearLandmark: string;
  galleryPlates: string;
  galleryCaption: string;
  autoOrbit: string;
  ambientSound: string;
  resetView: string;
  day: string;
  golden: string;
  night: string;
  distanceFromYou: string;
  bearing: string;
  dragHint: string;
  rotationPan: string;
  opticalZoom: string;
  reciteSalam: string;
  prevLabel: string;
  nextLabel: string;
  readExcerpt: string;
  chapter: string;
  playDocumentary: string;
  pause: string;
  voiceNarration: string;
  close: string;
  copy: string;
  copied: string;
  goldenChain: string;
  lineageTree: string;
  selectNodeHint: string;
  googleMaps: string;
  openStreetMap: string;
  allShrinesMap: string;
  ursBarsiTracker: string;
  hilalOffset: string;
  departedPlaceholder: string;
  relationPlaceholder: string;
  saveBarsi: string;
}

const AULIYA_UI: Record<LangCode, AuliyaUiStrings> = {
  en: {
    all: "All",
    silsilaAll: "All Silsilas",
    silsilaQadri: "Silsila Qadriyah",
    silsilaChishti: "Silsila Chishtiyah",
    silsilaNaqshbandi: "Silsila Naqshbandiyah",
    silsilaSuhrawardi: "Silsila Suhrawardiyah",
    silsilaRazavi: "Qadriyah Razawiyyah",
    directoryHeading: "Sacred Directory",
    noResults: "No matching Auliya profiles found.",
    birth: "Birth",
    passing: "Passing",
    shrineCity: "Shrine City",
    annualUrs: "Annual Urs",
    blessedLife: "Blessed Life & Tazkirah",
    earlyLife: "Early Life & Sacred Study",
    spiritualTraining: "Bay'ah, Mujahadah & Succession",
    revivalLegacy: "Revival & Enduring Legacy",
    historicalTimeline: "Historical Milestones",
    blessedQuotes: "Blessed Quotes",
    recommendedWird: "Recommended Wird",
    reciteStep: "Recite +1",
    karamatRank: "Spiritual Rank & Karamat",
    spiritualSuccessors: "Spiritual Successors (Khulafa)",
    sacredEtiquettes: "Sacred Etiquettes (Adab)",
    shrineArchitecture: "Shrine Architecture",
    visitingGuide: "Visiting Guide",
    archStyle: "Architectural Style",
    historicalEra: "Historical Era",
    patronage: "Historical Patronage",
    precinctLandmarks: "Precinct Landmarks",
    nearLandmark: "Near",
    galleryPlates: "Architectural & Courtyard Plates",
    galleryCaption: "Respectful architectural studies of domes, calligraphy, and sanctuary courtyards.",
    autoOrbit: "Auto Orbit",
    ambientSound: "Ambient Sound",
    resetView: "Reset View",
    day: "Day",
    golden: "Golden",
    night: "Night",
    distanceFromYou: "Distance from You",
    bearing: "Bearing",
    dragHint: "Drag across the courtyard or select numbered markers",
    rotationPan: "Courtyard Pan",
    opticalZoom: "Zoom",
    reciteSalam: "Recite Salam & Fatiha",
    prevLabel: "Previous",
    nextLabel: "Next",
    readExcerpt: "Read Excerpt",
    chapter: "Chapter",
    playDocumentary: "Play Documentary",
    pause: "Pause",
    voiceNarration: "Voice Narration",
    close: "Close",
    copy: "Copy",
    copied: "Copied",
    goldenChain: "Golden Chain of Transmission",
    lineageTree: "Interactive Lineage Network",
    selectNodeHint: "Select any Wali node in the tree to view their profile",
    googleMaps: "Google Maps",
    openStreetMap: "OpenStreetMap",
    allShrinesMap: "All Sacred Shrines",
    ursBarsiTracker: "Annual Urs & Family Barsi Log",
    hilalOffset: "Moon Sighting",
    departedPlaceholder: "Departed loved one's name…",
    relationPlaceholder: "Relation",
    saveBarsi: "Save Barsi",
  },
  ur: {
    all: "تمام",
    silsilaAll: "تمام سلاسل",
    silsilaQadri: "سلسلہ قادریہ",
    silsilaChishti: "سلسلہ چشتیہ",
    silsilaNaqshbandi: "سلسلہ نقشبندیہ",
    silsilaSuhrawardi: "سلسلہ سہروردیہ",
    silsilaRazavi: "قادریہ رضویہ",
    directoryHeading: "فہرستِ اولیاء کرام",
    noResults: "تلاش کے مطابق کوئی تذکرہ نہیں ملا۔",
    birth: "ولادت شریف",
    passing: "وصال مبارک",
    shrineCity: "شہرِ مزار",
    annualUrs: "سالانہ عرس",
    blessedLife: "حیاتِ طیبہ اور تذکرہ",
    earlyLife: "ابتدائی حیات و تحصیلِ علم",
    spiritualTraining: "بیعت، مجاہدہ اور خلافت",
    revivalLegacy: "تجدیدِ دین اور فیضان",
    historicalTimeline: "تاریخی مراحلِ حیات",
    blessedQuotes: "ملفوظاتِ قدسیہ",
    recommendedWird: "مسنون سلسلۂ ورد",
    reciteStep: "تلاوت +۱",
    karamatRank: "مقامِ ولایت اور کرامات",
    spiritualSuccessors: "خلفائے کرام",
    sacredEtiquettes: "آدابِ زیارت",
    shrineArchitecture: "طرزِ تعمیرِ مزار",
    visitingGuide: "رہنمائے زائرین",
    archStyle: "معماری طرز",
    historicalEra: "عہدِ تعمیر",
    patronage: "تاریخی سرپرستی",
    precinctLandmarks: "احاطۂ مزار کے آثار",
    nearLandmark: "قریب",
    galleryPlates: "مزار و احاطے کی تصاویر",
    galleryCaption: "گنبد، خطاطی اور صحنِ مزار کے باادب فنِ تعمیر کے مناظر۔",
    autoOrbit: "خودکار گردش",
    ambientSound: "روحانی صدا",
    resetView: "ابتدائی منظر",
    day: "دن",
    golden: "شفق",
    night: "رات",
    distanceFromYou: "آپ سے فاصلہ",
    bearing: "سمت",
    dragHint: "منظر گھمانے کے لیے کھینچیں یا نشانات منتخب کریں",
    rotationPan: "زاویۂ نظر",
    opticalZoom: "قریب نمائی",
    reciteSalam: "سلام و فاتحہ پڑھیں",
    prevLabel: "پچھلا",
    nextLabel: "اگلا",
    readExcerpt: "اقتباس پڑھیں",
    chapter: "باب",
    playDocumentary: "دستاویزی بیان چلائیں",
    pause: "روکیں",
    voiceNarration: "صوتی بیان",
    close: "بند کریں",
    copy: "کاپی",
    copied: "کاپی ہو گیا",
    goldenChain: "سلسلۂ ذہب (اسنادِ طریقت)",
    lineageTree: "شجرۂ طیبہ کا نقشہ",
    selectNodeHint: "کسی بھی بزرگ کے نام پر کلک کر کے ان کا تذکرہ کھولیں",
    googleMaps: "گوگل نقشہ",
    openStreetMap: "اوپن اسٹریٹ میپ",
    allShrinesMap: "تمام مقدس مزارات",
    ursBarsiTracker: "تقویمِ عرس اور خاندانی برسی",
    hilalOffset: "رویتِ ہلال",
    departedPlaceholder: "مرحوم کا نام…",
    relationPlaceholder: "رشتہ",
    saveBarsi: "برسی محفوظ کریں",
  },
  ar: {
    all: "الكل",
    silsilaAll: "جميع الطرق",
    silsilaQadri: "الطريقة القادرية",
    silsilaChishti: "الطريقة الجشتية",
    silsilaNaqshbandi: "الطريقة النقشبندية",
    silsilaSuhrawardi: "الطريقة السهروردية",
    silsilaRazavi: "القادرية الرضوية",
    directoryHeading: "دليل الأولياء",
    noResults: "لم يتم العثور على تراجم مطابقة.",
    birth: "المولد",
    passing: "الوصال",
    shrineCity: "مدينة المقام",
    annualUrs: "الحولية السنوية",
    blessedLife: "السيرة المباركة والتذكرة",
    earlyLife: "النشأة وطلب العلم الشريف",
    spiritualTraining: "البيعة والمجاهدة والإجازة",
    revivalLegacy: "الإصلاح والأثر الخالد",
    historicalTimeline: "المحطات التاريخية",
    blessedQuotes: "أقوال وحكم مباركة",
    recommendedWird: "الورد المأثور",
    reciteStep: "تسبيح +١",
    karamatRank: "المقام الروحي والكرامات",
    spiritualSuccessors: "الخلفاء المرشدون",
    sacredEtiquettes: "آداب الزيارة",
    shrineArchitecture: "عمارة المقام الشريف",
    visitingGuide: "دليل الزائرين",
    archStyle: "الطراز المعماري",
    historicalEra: "حقبة البناء",
    patronage: "الرعاية التاريخية",
    precinctLandmarks: "معالم الروضة الشريفة",
    nearLandmark: "بالقرب من",
    galleryPlates: "لوحات العمارة والصحن",
    galleryCaption: "دراسات معمارية مهيبة للقباب والخط العربي وأروقة المقامات.",
    autoOrbit: "دوران تلقائي",
    ambientSound: "صوت السكينة",
    resetView: "إعادة العرض",
    day: "نهار",
    golden: "غروب",
    night: "ليل",
    distanceFromYou: "المسافة منك",
    bearing: "الاتجاه",
    dragHint: "اسحب للتجول في الصحن أو اختر المعالم المرقمة",
    rotationPan: "زاوية الدوران",
    opticalZoom: "التكبير",
    reciteSalam: "قراءة السلام والفاتحة",
    prevLabel: "السابق",
    nextLabel: "التالي",
    readExcerpt: "قراءة المقتطف",
    chapter: "الفصل",
    playDocumentary: "تشغيل الوثائقي",
    pause: "إيقاف مؤقت",
    voiceNarration: "التعليق الصوتي",
    close: "إغلاق",
    copy: "نسخ",
    copied: "تم النسخ",
    goldenChain: "السلسلة الذهبية المتصلة",
    lineageTree: "شجرة الإسناد التفاعلية",
    selectNodeHint: "اضغط على أي علم في الشجرة لفتح ترجمته",
    googleMaps: "خرائط جوجل",
    openStreetMap: "الخريطة المفتوحة",
    allShrinesMap: "جميع المقامات المباركة",
    ursBarsiTracker: "تقويم الحوليات وذكرى المرحومين",
    hilalOffset: "رؤية الهلال",
    departedPlaceholder: "اسم المرحوم…",
    relationPlaceholder: "صلة القرابة",
    saveBarsi: "حفظ الذكرى",
  },
  ro_ur: {
    all: "Tamam",
    silsilaAll: "Tamam Silsile",
    silsilaQadri: "Silsila-e-Qadriya",
    silsilaChishti: "Silsila-e-Chishtiya",
    silsilaNaqshbandi: "Silsila-e-Naqshbandiya",
    silsilaSuhrawardi: "Silsila-e-Suhrawardiya",
    silsilaRazavi: "Qadriya Razaviya",
    directoryHeading: "Fehrist-e-Auliya",
    noResults: "Talash ke mutabiq koi tazkirah nahi mila.",
    birth: "Wiladat",
    passing: "Wisal",
    shrineCity: "Dargah Shehar",
    annualUrs: "Salana Urs",
    blessedLife: "Hayat-e-Tayyiba & Tazkirah",
    earlyLife: "Ibtidai Hayat & Ilm-e-Deen",
    spiritualTraining: "Bay'at, Mujahada & Khilafat",
    revivalLegacy: "Tajdeed-e-Deen & Faizan",
    historicalTimeline: "Tareekhi Marahil",
    blessedQuotes: "Malfuzat-e-Qudsiyyah",
    recommendedWird: "Masnoon Wird",
    reciteStep: "Parhein +1",
    karamatRank: "Maqam-e-Wilayat & Karamat",
    spiritualSuccessors: "Khulafa-e-Kiram",
    sacredEtiquettes: "Adab-e-Ziyarat",
    shrineArchitecture: "Tameer-e-Mazar",
    visitingGuide: "Rehnuma-e-Zaireen",
    archStyle: "Tameeri Tarz",
    historicalEra: "Daur-e-Tameer",
    patronage: "Tareekhi Sarparasti",
    precinctLandmarks: "Ahata-e-Dargah Ke Aasar",
    nearLandmark: "Qareeb",
    galleryPlates: "Mazar & Sahan Ki Tasaveer",
    galleryCaption: "Gunbad, khattati aur sahan-e-dargah ki ba-adab tasaveer.",
    autoOrbit: "Auto Gardish",
    ambientSound: "Roohani Sada",
    resetView: "Reset Manzar",
    day: "Din",
    golden: "Shafaq",
    night: "Raat",
    distanceFromYou: "Aap Se Fasla",
    bearing: "Simt",
    dragHint: "Ghumane ke liye drag karein ya nishanat chunein",
    rotationPan: "360° Zawiya",
    opticalZoom: "Zoom",
    reciteSalam: "Salam & Fatiha Parhein",
    prevLabel: "Pichla",
    nextLabel: "Agla",
    readExcerpt: "Iqtibas Parhein",
    chapter: "Baab",
    playDocumentary: "Documentary Chalayein",
    pause: "Rokein",
    voiceNarration: "Awaz Bayan",
    close: "Band Karein",
    copy: "Copy",
    copied: "Copy Ho Gaya",
    goldenChain: "Silsila-e-Zahab (Isnad)",
    lineageTree: "Shajrah-e-Tayyibah Naqsha",
    selectNodeHint: "Kisi bhi buzurg par click karke sawaneh kholein",
    googleMaps: "Google Maps",
    openStreetMap: "OpenStreetMap",
    allShrinesMap: "Tamam Muqaddas Dargah",
    ursBarsiTracker: "Salana Urs & Family Barsi",
    hilalOffset: "Hilal Farq",
    departedPlaceholder: "Marhoom ka naam…",
    relationPlaceholder: "Rishta",
    saveBarsi: "Barsi Save Karein",
  },
  hi: {
    all: "सभी",
    silsilaAll: "सभी सिलसिले",
    silsilaQadri: "सिलसिला क़ादरिया",
    silsilaChishti: "सिलसिला चिश्तिया",
    silsilaNaqshbandi: "सिलसिला नक़्शबंदिया",
    silsilaSuhrawardi: "सिलसिला सुहरवर्दिया",
    silsilaRazavi: "क़ादरिया रज़विया",
    directoryHeading: "औलिया सूची",
    noResults: "खोज से मेल खाता कोई विवरण नहीं मिला।",
    birth: "विलादत (जन्म)",
    passing: "विसाल",
    shrineCity: "दरगाह शहर",
    annualUrs: "सालाना उर्स",
    blessedLife: "मुबारक जीवनी व तज़किरा",
    earlyLife: "प्रारंभिक जीवन व इल्म",
    spiritualTraining: "बैअत, मुजाहदा व ख़िलाफ़त",
    revivalLegacy: "दीनी ख़िदमात व विरासत",
    historicalTimeline: "ऐतिहासिक पड़ाव",
    blessedQuotes: "अनमोल वचन (मलफ़ूज़ात)",
    recommendedWird: "मसनून विर्द",
    reciteStep: "पढ़ें +1",
    karamatRank: "रूहानी मर्तबा व करामत",
    spiritualSuccessors: "प्रमुख ख़ुलफ़ा",
    sacredEtiquettes: "ज़ियारत के आदाब",
    shrineArchitecture: "दरगाह स्थापत्य कला",
    visitingGuide: "ज़ायरीन मार्गदर्शिका",
    archStyle: "स्थापत्य शैली",
    historicalEra: "निर्माण काल",
    patronage: "ऐतिहासिक संरक्षण",
    precinctLandmarks: "परिसर के प्रमुख स्थल",
    nearLandmark: "निकट",
    galleryPlates: "स्थापत्य व प्रांगण दीर्घा",
    galleryCaption: "गुंबद, ख़त्ताती और दरगाह प्रांगण के अदबपूर्ण स्थापत्य दृश्य।",
    autoOrbit: "स्वतः परिक्रमा",
    ambientSound: "शांत ध्वनि",
    resetView: "दृश्य रीसेट",
    day: "दिन",
    golden: "संध्या",
    night: "रात",
    distanceFromYou: "आपसे दूरी",
    bearing: "दिशा",
    dragHint: "घुमाने के लिए खींचें या चिह्नित बिंदु चुनें",
    rotationPan: "प्रांगण घुमाव",
    opticalZoom: "ज़ूम",
    reciteSalam: "सलाम व फ़ातिहा पढ़ें",
    prevLabel: "पिछला",
    nextLabel: "अगला",
    readExcerpt: "अंश पढ़ें",
    chapter: "अध्याय",
    playDocumentary: "वृत्तचित्र चलाएं",
    pause: "रोकें",
    voiceNarration: "स्वर वाचन",
    close: "बंद करें",
    copy: "कॉपी",
    copied: "कॉपी हो गया",
    goldenChain: "रूहानी सिलसिला (सनद)",
    lineageTree: "शजरा-ए-तय्यिबा वृक्ष",
    selectNodeHint: "प्रोफ़ाइल देखने के लिए किसी भी बुज़ुर्ग पर क्लिक करें",
    googleMaps: "गूगल मैप्स",
    openStreetMap: "ओपनस्ट्रीटमैप",
    allShrinesMap: "सभी पवित्र दरगाहें",
    ursBarsiTracker: "हिजरी उर्स व पारिवारिक बरसी",
    hilalOffset: "चांद अंतर",
    departedPlaceholder: "मरहूम का नाम…",
    relationPlaceholder: "रिश्ता",
    saveBarsi: "बरसी सहेजें",
  },
  tr: {
    all: "Tümü",
    silsilaAll: "Tüm Silsileler",
    silsilaQadri: "Kâdiriyye",
    silsilaChishti: "Çiştiyye",
    silsilaNaqshbandi: "Nakşibendiyye",
    silsilaSuhrawardi: "Sühreverdiyye",
    silsilaRazavi: "Kâdiriyye Rızviyye",
    directoryHeading: "Evliya Rehberi",
    noResults: "Aramanızla eşleşen kayıt bulunamadı.",
    birth: "Vilâdet",
    passing: "Vuslat",
    shrineCity: "Türbe Şehri",
    annualUrs: "Yıllık Vuslat",
    blessedLife: "Mübarek Hayatı ve Menkıbeleri",
    earlyLife: "İlk Yılları ve İlim Tahsili",
    spiritualTraining: "İntisap, Mücâhede ve İcâzet",
    revivalLegacy: "İrşad ve Manevî Mirası",
    historicalTimeline: "Kronolojik Dönüm Noktaları",
    blessedQuotes: "Hikmetli Sözleri",
    recommendedWird: "Tavsiye Edilen Vird",
    reciteStep: "Zikret +1",
    karamatRank: "Manevî Makamı ve Kerâmetleri",
    spiritualSuccessors: "Halifeleri (Hulefâ)",
    sacredEtiquettes: "Ziyaret Âdâbı",
    shrineArchitecture: "Türbe Mimarisi",
    visitingGuide: "Ziyaretçi Rehberi",
    archStyle: "Mimarî Üslup",
    historicalEra: "İnşa Dönemi",
    patronage: "Tarihî Baniler",
    precinctLandmarks: "Külliyedeki Bölümler",
    nearLandmark: "Yakınında",
    galleryPlates: "Mimarî ve Avlu Galerisi",
    galleryCaption: "Kubbe, hüsn-i hat ve külliye avlularının edebe uygun mimarî görünümleri.",
    autoOrbit: "Otomatik Dönüş",
    ambientSound: "Avlu Sesi",
    resetView: "Görünümü Sıfırla",
    day: "Gündüz",
    golden: "Gün Batımı",
    night: "Gece",
    distanceFromYou: "Size Uzaklık",
    bearing: "Yön Açısı",
    dragHint: "Avluyu döndürmek için sürükleyin veya noktaları seçin",
    rotationPan: "360° Dönüş",
    opticalZoom: "Yakınlaştırma",
    reciteSalam: "Selâm ve Fâtiha Oku",
    prevLabel: "Önceki",
    nextLabel: "Sonraki",
    readExcerpt: "Bölümü Oku",
    chapter: "Bölüm",
    playDocumentary: "Belgeseli Oynat",
    pause: "Duraklat",
    voiceNarration: "Sesli Anlatım",
    close: "Kapat",
    copy: "Kopyala",
    copied: "Kopyalandı",
    goldenChain: "Altın Silsile Halkaları",
    lineageTree: "Etkileşimli Silsile Ağacı",
    selectNodeHint: "Hayatını incelemek için ağaçtaki bir veliyi seçin",
    googleMaps: "Google Haritalar",
    openStreetMap: "OpenStreetMap",
    allShrinesMap: "Tüm Mübarek Türbeler",
    ursBarsiTracker: "Hicrî Vuslat ve Aile Hatim Kaydı",
    hilalOffset: "Hilâl Farkı",
    departedPlaceholder: "Merhumun adı…",
    relationPlaceholder: "Yakınlık",
    saveBarsi: "Kaydet",
  },
  bn: {
    all: "সব",
    silsilaAll: "সকল সিলসিলা",
    silsilaQadri: "কাদেরিয়া সিলসিলা",
    silsilaChishti: "চিশতিয়া সিলসিলা",
    silsilaNaqshbandi: "নকশবন্দিয়া সিলসিলা",
    silsilaSuhrawardi: "সোহরাওয়ার্দিয়া সিলসিলা",
    silsilaRazavi: "কাদেরিয়া রজভিয়া",
    directoryHeading: "আউলিয়া তালিকা",
    noResults: "অনুসন্ধানের সাথে মিল পাওয়া যায়নি।",
    birth: "বেলাদত (জন্ম)",
    passing: "বেসাল (ওফাত)",
    shrineCity: "মাজার শহর",
    annualUrs: "বার্ষিক ওরস",
    blessedLife: "পবিত্র জীবনী ও তাযকিরা",
    earlyLife: "প্রাথমিক জীবন ও ইলম অর্জন",
    spiritualTraining: "বায়আত, মুজাহাদা ও খিলাফত",
    revivalLegacy: "দ্বীনি সংস্কার ও অবদান",
    historicalTimeline: "ঐতিহাসিক সময়রেখা",
    blessedQuotes: "মূল্যবান বাণী (মালফুজাত)",
    recommendedWird: "মাসনুন অজিফা",
    reciteStep: "পাঠ +১",
    karamatRank: "আধ্যাত্মিক মর্যাদা ও কারামত",
    spiritualSuccessors: "খলিফাগণ (খুলাফা)",
    sacredEtiquettes: "জিয়ারতের আদব",
    shrineArchitecture: "মাজার স্থাপত্য",
    visitingGuide: "জিয়ারত নির্দেশিকা",
    archStyle: "স্থাপত্য শৈলী",
    historicalEra: "নির্মাণকাল",
    patronage: "ঐতিহাসিক পৃষ্ঠপোষকতা",
    precinctLandmarks: "মাজার প্রাঙ্গণের নিদর্শন",
    nearLandmark: "নিকটস্থ",
    galleryPlates: "স্থাপত্য ও প্রাঙ্গণ গ্যালারি",
    galleryCaption: "গম্বুজ, ক্যালিগ্রাফি ও মাজার প্রাঙ্গণের আদবসম্মত স্থাপত্য চিত্র।",
    autoOrbit: "স্বয়ংক্রিয় ঘূর্ণন",
    ambientSound: "প্রশান্ত ধ্বনি",
    resetView: "পুনঃস্থাপন",
    day: "দিন",
    golden: "গোধূলি",
    night: "রাত",
    distanceFromYou: "আপনার থেকে দূরত্ব",
    bearing: "দিক কোণ",
    dragHint: "ঘুরিয়ে দেখতে টেনে আনুন বা চিহ্নিত বিন্দু নির্বাচন করুন",
    rotationPan: "প্রাঙ্গণ ঘূর্ণন",
    opticalZoom: "জুম",
    reciteSalam: "সালাম ও ফাতিহা পাঠ",
    prevLabel: "পূর্ববর্তী",
    nextLabel: "পরবর্তী",
    readExcerpt: "অংশ পড়ুন",
    chapter: "অধ্যায়",
    playDocumentary: "প্রামাণ্যচিত্র চালান",
    pause: "বিরতি",
    voiceNarration: "কণ্ঠ বর্ণনা",
    close: "বন্ধ করুন",
    copy: "কপি",
    copied: "কপি হয়েছে",
    goldenChain: "আধ্যাত্মিক সনদ ও সিলসিলা",
    lineageTree: "শাজরায়ে তাইয়্যিবা বৃক্ষ",
    selectNodeHint: "জীবনী দেখতে বৃক্ষের যেকোনো অলির নাম নির্বাচন করুন",
    googleMaps: "গুগল ম্যাপস",
    openStreetMap: "ওপেনস্ট্রিটম্যাপ",
    allShrinesMap: "সকল পবিত্র মাজার",
    ursBarsiTracker: "হিজরি ওরস ও পারিবারিক বার্ষিকী",
    hilalOffset: "চাঁদ সমন্বয়",
    departedPlaceholder: "মরহুমের নাম…",
    relationPlaceholder: "সম্পর্ক",
    saveBarsi: "সংরক্ষণ করুন",
  },
  fa: {
    all: "همه",
    silsilaAll: "همه سلاسل",
    silsilaQadri: "سلسله قادریه",
    silsilaChishti: "سلسله چشتیه",
    silsilaNaqshbandi: "سلسله نقشبندیه",
    silsilaSuhrawardi: "سلسله سهروردیه",
    silsilaRazavi: "قادریه رضویه",
    directoryHeading: "فهرست اولیاء الهی",
    noResults: "موردی مطابق جستجوی شما یافت نشد.",
    birth: "ولادت",
    passing: "وصال",
    shrineCity: "شهر مزار",
    annualUrs: "عرس سالانه",
    blessedLife: "زندگی‌نامه مبارک و تذکره",
    earlyLife: "آغاز زندگی و تحصیل دانش",
    spiritualTraining: "بیعت، مجاهده و خلافت",
    revivalLegacy: "احیای دین و میراث ماندگار",
    historicalTimeline: "گاه‌شمار تاریخی",
    blessedQuotes: "سخنان قدسی (ملفوظات)",
    recommendedWird: "ورد توصیه‌شده",
    reciteStep: "ذکر +۱",
    karamatRank: "مقام معنوی و کرامات",
    spiritualSuccessors: "خلفای روحانی",
    sacredEtiquettes: "آداب زیارت",
    shrineArchitecture: "معماری مزار شریف",
    visitingGuide: "راهنمای زائران",
    archStyle: "سبک معماری",
    historicalEra: "دوره ساخت",
    patronage: "حمایت تاریخی",
    precinctLandmarks: "بخش‌های صحن و بارگاه",
    nearLandmark: "نزدیک به",
    galleryPlates: "نگارخانه معماری و صحن",
    galleryCaption: "نماهای محترمانه از گنبدها، خوشنویسی و صحن‌های آرامگاهی.",
    autoOrbit: "چرخش خودکار",
    ambientSound: "نوای محیطی",
    resetView: "بازنشانی نما",
    day: "روز",
    golden: "غروب",
    night: "شب",
    distanceFromYou: "فاصله از شما",
    bearing: "زاویه سمت",
    dragHint: "برای چرخش بکشید یا نقاط شماره‌گذاری‌شده را انتخاب کنید",
    rotationPan: "چرخش افقی",
    opticalZoom: "بزرگ‌نمایی",
    reciteSalam: "قرائت سلام و فاتحه",
    prevLabel: "قبلی",
    nextLabel: "بعدی",
    readExcerpt: "مطالعه گزیده",
    chapter: "فصل",
    playDocumentary: "پخش مستند",
    pause: "مکث",
    voiceNarration: "روایت صوتی",
    close: "بستن",
    copy: "کپی",
    copied: "کپی شد",
    goldenChain: "سلسله الذهب (اسناد طریقت)",
    lineageTree: "شبکه شجره‌نامه طیبه",
    selectNodeHint: "برای مشاهده زندگی‌نامه روی نام هر ولی کلیک کنید",
    googleMaps: "گوگل مپس",
    openStreetMap: "اوپن‌استریت‌مپ",
    allShrinesMap: "همه مزارات متبرکه",
    ursBarsiTracker: "تقویم عرس و سالگرد درگذشتگان",
    hilalOffset: "تنظیم هلال",
    departedPlaceholder: "نام مرحوم…",
    relationPlaceholder: "نسبت",
    saveBarsi: "ذخیره سالگرد",
  },
  id: {
    all: "Semua",
    silsilaAll: "Semua Tarekat",
    silsilaQadri: "Tarekat Qadiriyah",
    silsilaChishti: "Tarekat Chishtiyah",
    silsilaNaqshbandi: "Tarekat Naqsyabandiyah",
    silsilaSuhrawardi: "Tarekat Suhrawardiyah",
    silsilaRazavi: "Qadiriyah Razawiyah",
    directoryHeading: "Direktori Auliya",
    noResults: "Tidak ada profil wali yang cocok.",
    birth: "Kelahiran",
    passing: "Wafat",
    shrineCity: "Kota Makam",
    annualUrs: "Haul Tahunan",
    blessedLife: "Biografi Mulia & Tazkirah",
    earlyLife: "Masa Muda & Keilmuan",
    spiritualTraining: "Baiat, Mujahadah & Ijazah",
    revivalLegacy: "Dakwah & Warisan Abadi",
    historicalTimeline: "Linimasa Sejarah",
    blessedQuotes: "Untaian Hikmah",
    recommendedWird: "Wirid Utama",
    reciteStep: "Baca +1",
    karamatRank: "Maqam Ruhani & Karamah",
    spiritualSuccessors: "Para Khalifah Penerus",
    sacredEtiquettes: "Adab Ziarah",
    shrineArchitecture: "Arsitektur Kompleks Makam",
    visitingGuide: "Panduan Peziarah",
    archStyle: "Gaya Arsitektur",
    historicalEra: "Era Pembangunan",
    patronage: "Dukungan Sejarah",
    precinctLandmarks: "Bagian Utama Kompleks",
    nearLandmark: "Dekat",
    galleryPlates: "Galeri Arsitektur & Pelataran",
    galleryCaption: "Kajian visual penuh adab atas kubah, kaligrafi, dan pelataran makam.",
    autoOrbit: "Putar Otomatis",
    ambientSound: "Suara Pelataran",
    resetView: "Atur Ulang",
    day: "Siang",
    golden: "Senja",
    night: "Malam",
    distanceFromYou: "Jarak dari Anda",
    bearing: "Arah Sudut",
    dragHint: "Geser layar untuk berputar atau pilih titik penanda",
    rotationPan: "Putaran 360°",
    opticalZoom: "Perbesaran",
    reciteSalam: "Baca Salam & Fatihah",
    prevLabel: "Sebelumnya",
    nextLabel: "Berikutnya",
    readExcerpt: "Baca Kutipan",
    chapter: "Bab",
    playDocumentary: "Putar Dokumenter",
    pause: "Jeda",
    voiceNarration: "Narasi Suara",
    close: "Tutup",
    copy: "Salin",
    copied: "Tersalin",
    goldenChain: "Mata Rantai Sanad Emas",
    lineageTree: "Pohon Sanad Silsilah",
    selectNodeHint: "Pilih nama wali pada bagan untuk membuka profilnya",
    googleMaps: "Google Maps",
    openStreetMap: "OpenStreetMap",
    allShrinesMap: "Semua Makam Auliya",
    ursBarsiTracker: "Jadwal Haul & Pengingat Keluarga",
    hilalOffset: "Koreksi Hilal",
    departedPlaceholder: "Nama almarhum…",
    relationPlaceholder: "Hubungan",
    saveBarsi: "Simpan Haul",
  },
  fr: {
    all: "Tout",
    silsilaAll: "Toutes les Voies",
    silsilaQadri: "Voie Qadiriyya",
    silsilaChishti: "Voie Chishtiyya",
    silsilaNaqshbandi: "Voie Naqshbandiyya",
    silsilaSuhrawardi: "Voie Suhrawardiyya",
    silsilaRazavi: "Qadiriyya Razawiyya",
    directoryHeading: "Répertoire des Saints",
    noResults: "Aucun profil correspondant trouvé.",
    birth: "Naissance",
    passing: "Rappel à Dieu",
    shrineCity: "Ville du Sanctuaire",
    annualUrs: "Urs Annuel",
    blessedLife: "Vie Bénie & Tazkirah",
    earlyLife: "Jeunesse & Sciences Sacrées",
    spiritualTraining: "Pacte, Mujahada & Transmission",
    revivalLegacy: "Renouveau & Héritage",
    historicalTimeline: "Repères Chronologiques",
    blessedQuotes: "Paroles de Sagesse",
    recommendedWird: "Wird Recommandé",
    reciteStep: "Réciter +1",
    karamatRank: "Rang Spirituel & Prodiges",
    spiritualSuccessors: "Successeurs Spirituels (Khulafa)",
    sacredEtiquettes: "Bienséances de Visite (Adab)",
    shrineArchitecture: "Architecture du Sanctuaire",
    visitingGuide: "Guide du Visiteur",
    archStyle: "Style Architectural",
    historicalEra: "Époque de Construction",
    patronage: "Mécénat Historique",
    precinctLandmarks: "Éléments de l'Enceinte",
    nearLandmark: "À proximité de",
    galleryPlates: "Planches d'Architecture & Cours",
    galleryCaption: "Études architecturales respectueuses des coupoles, calligraphies et parvis.",
    autoOrbit: "Orbite Auto",
    ambientSound: "Son d'Ambiance",
    resetView: "Réinitialiser",
    day: "Jour",
    golden: "Crépuscule",
    night: "Nuit",
    distanceFromYou: "Distance depuis votre position",
    bearing: "Azimut",
    dragHint: "Faites glisser pour explorer ou touchez un repère numéroté",
    rotationPan: "Panorama 360°",
    opticalZoom: "Zoom",
    reciteSalam: "Réciter Salam & Fatiha",
    prevLabel: "Précédent",
    nextLabel: "Suivant",
    readExcerpt: "Lire l'Extrait",
    chapter: "Chapitre",
    playDocumentary: "Lire le Documentaire",
    pause: "Pause",
    voiceNarration: "Narration Vocale",
    close: "Fermer",
    copy: "Copier",
    copied: "Copié",
    goldenChain: "Chaîne d'Or de Transmission",
    lineageTree: "Arbre Interactif de la Silsila",
    selectNodeHint: "Sélectionnez un saint dans l'arbre pour consulter sa biographie",
    googleMaps: "Google Maps",
    openStreetMap: "OpenStreetMap",
    allShrinesMap: "Tous les Sanctuaires",
    ursBarsiTracker: "Calendrier des Urs & Commémorations",
    hilalOffset: "Ajustement Lunaire",
    departedPlaceholder: "Nom du défunt…",
    relationPlaceholder: "Lien familial",
    saveBarsi: "Enregistrer",
  },
};

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function initialBearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  const theta = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((theta + 360) % 360);
}

function bearingCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function AuliyaInner() {
  const searchParams = useSearchParams();
  const initialSaint = searchParams.get("saint") || "ghaus-e-azam";
  const initialTab = (searchParams.get("tab") as AuliyaTab) || "tazkirah";

  const {
    lang,
    allAuliya,
    city,
    hijri,
    hilalOffset,
    setHilalOffset,
    familyBarsis,
    addFamilyBarsi,
  } = useApp();

  const ui = AULIYA_UI[lang] || AULIYA_UI.en;
  const isPersoArabicScript = lang === "ur" || lang === "ar" || lang === "fa";

  const [query, setQuery] = useState("");
  const [silsilaFilter, setSilsilaFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState(initialSaint);
  const [activeTab, setActiveTab] = useState<AuliyaTab>(initialTab);

  // Biography Wird counter & copy state
  const [wirdCount, setWirdCount] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Gallery Lightbox state
  const [lightboxItem, setLightboxItem] = useState<ShrineGalleryItem | null>(null);

  // 360° Virtual Ziyarat interactive state
  const [yawDeg, setYawDeg] = useState(180);
  const [pitchPct, setPitchPct] = useState(50);
  const [zoom, setZoom] = useState(1.22);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [lightingMode, setLightingMode] = useState<"day" | "golden" | "night">("golden");
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [ambientOn, setAmbientOn] = useState(false);
  const [isDragging360, setIsDragging360] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(
    null
  );
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Video & Documentary Cinema state
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoStepIdx, setVideoStepIdx] = useState(0);
  const [voiceNarrationOn, setVoiceNarrationOn] = useState(false);

  // Books Reader Modal state
  const [activeBook, setActiveBook] = useState<AuthoredBook | null>(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

  // Family Barsi form
  const [barsiName, setBarsiName] = useState("");
  const [barsiRelation, setBarsiRelation] = useState("");
  const [barsiDay, setBarsiDay] = useState(11);
  const [barsiMonth, setBarsiMonth] = useState(4);

  const getSilsilaLabel = (silsila: string): string => {
    switch (silsila) {
      case "All":
        return ui.silsilaAll;
      case "Qadri":
        return ui.silsilaQadri;
      case "Chishti":
        return ui.silsilaChishti;
      case "Naqshbandi":
        return ui.silsilaNaqshbandi;
      case "Suhrawardi":
        return ui.silsilaSuhrawardi;
      case "Razavi":
        return ui.silsilaRazavi;
      default:
        return tp(lang, silsila);
    }
  };

  const formatUrsDate = (day: number, month1Based: number): string => {
    const fallback = HIJRI_MONTHS[(month1Based - 1 + 12) % 12] || "";
    return `${day} ${formatLocalizedHijriMonth(lang, month1Based, fallback)}`;
  };

  const getPrimaryHeading = (item: {
    name: string;
    urduName: string;
    arabicName: string;
  }): string => {
    if (lang === "ar") return item.arabicName || item.urduName || item.name;
    if (lang === "ur" || lang === "fa") return item.urduName || item.arabicName || item.name;
    return item.name;
  };

  const getSecondaryHeading = (item: {
    name: string;
    urduName: string;
    arabicName: string;
  }): string => {
    if (isPersoArabicScript) return item.name;
    return item.urduName || item.arabicName;
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allAuliya.filter((a) => {
      if (a.status !== "Published") return false;
      const matchesSilsila = silsilaFilter === "All" || a.silsila === silsilaFilter;
      if (!matchesSilsila) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.urduName.includes(q) ||
        a.arabicName.includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.alqab.some((item) => item.toLowerCase().includes(q)) ||
        a.silsila.toLowerCase().includes(q)
      );
    });
  }, [allAuliya, query, silsilaFilter]);

  const saint =
    allAuliya.find((a) => a.id === selectedId) || filtered[0] || allAuliya[0];
  const activeSaintId = saint.id;

  // Auto-orbit effect for 360° Ziyarat viewer
  useEffect(() => {
    if (!autoOrbit || activeTab !== "ziyarat" || isDragging360) return;
    const interval = window.setInterval(() => {
      setYawDeg((prev) => (prev + 1.2) % 360);
    }, 60);
    return () => window.clearInterval(interval);
  }, [autoOrbit, activeTab, isDragging360]);

  // Ambient Web Audio generator for 360° Ziyarat
  useEffect(() => {
    if (!ambientOn) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0.04;
      master.connect(ctx.destination);

      [146.83, 220.0, 293.66].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(master);
        osc.start();
      });
    } catch {
      // Ignore if blocked by browser autoplay policy
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [ambientOn]);

  // Documentary Cinema auto-advance & optional speech synthesis
  const currentVideo =
    saint.videos && saint.videos.length > 0
      ? saint.videos[Math.min(selectedVideoIdx, saint.videos.length - 1)]
      : null;

  useEffect(() => {
    if (!isPlayingVideo || !currentVideo) return;
    const scripts = currentVideo.narrationScript;
    if (voiceNarrationOn && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(scripts[videoStepIdx] || "");
      utter.rate = 0.94;
      utter.pitch = 0.98;
      window.speechSynthesis.speak(utter);
    }
    const timer = window.setTimeout(() => {
      if (videoStepIdx + 1 < scripts.length) {
        setVideoStepIdx(videoStepIdx + 1);
      } else {
        setIsPlayingVideo(false);
        setVideoStepIdx(0);
      }
    }, 6500);
    return () => {
      window.clearTimeout(timer);
    };
  }, [isPlayingVideo, videoStepIdx, currentVideo, voiceNarrationOn]);

  const handleSelectSaint = (id: string) => {
    setSelectedId(id);
    setActiveHotspotId(null);
    setWirdCount(0);
    setSelectedVideoIdx(0);
    setVideoStepIdx(0);
    setIsPlayingVideo(false);
  };

  const resetZiyaratView = () => {
    setYawDeg(180);
    setPitchPct(50);
    setZoom(1.22);
    setAutoOrbit(false);
    setActiveHotspotId(null);
  };

  const copyText = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  };

  const speakSalawatOrText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.92;
      window.speechSynthesis.speak(utter);
    }
  };

  // React Flow Shajrah-e-Tayyibah Lineage Graph
  const { nodes, edges } = useMemo(() => {
    const rfNodes: Node[] = [
      {
        id: "prophet",
        position: { x: 260, y: 10 },
        data: { label: "Sayyiduna Muhammad ﷺ (Khatam-un-Nabiyyin)" },
        style: {
          background: "linear-gradient(135deg, #DF98FA, #9055FF)",
          color: "#FFFFFF",
          border: "1px solid #F9B091",
          borderRadius: "14px",
          padding: "10px 16px",
          fontWeight: 700,
          fontSize: "12px",
          width: 260,
          textAlign: "center",
        },
      },
      {
        id: "ali",
        position: { x: 260, y: 100 },
        data: { label: "Imam Ali ibn Abi Talib (رضي الله عنه)" },
        style: {
          background: "#121931",
          color: "#FFFFFF",
          border: "1px solid #A44AFF",
          borderRadius: "12px",
          padding: "8px 14px",
          fontSize: "12px",
          width: 260,
          textAlign: "center",
        },
      },
    ];

    const positions: Record<string, { x: number; y: number }> = {
      "ghaus-e-azam": { x: 70, y: 210 },
      "ala-hazrat": { x: 70, y: 340 },
      "khwaja-moinuddin": { x: 280, y: 210 },
      "nizamuddin-auliya": { x: 280, y: 310 },
      "banda-nawaz": { x: 280, y: 410 },
      "data-ganj-bakhsh": { x: 490, y: 210 },
      "mujaddid-alf-thani": { x: 490, y: 340 },
    };

    allAuliya
      .filter((a) => a.status === "Published")
      .forEach((a) => {
        const isSelected = a.id === activeSaintId;
        const primaryLabel =
          lang === "ar"
            ? a.arabicName || a.name
            : lang === "ur" || lang === "fa"
            ? a.urduName || a.name
            : a.name;
        rfNodes.push({
          id: a.id,
          position: positions[a.id] || { x: 280, y: 250 },
          data: {
            label: `${primaryLabel}\n(${a.silsila} · ${a.city})`,
          },
          style: {
            background: isSelected
              ? "linear-gradient(135deg, rgba(249,176,145,0.32), rgba(144,85,255,0.55))"
              : "#121931",
            color: "#FFFFFF",
            border: isSelected ? "2px solid #F9B091" : "1px solid #242F54",
            borderRadius: "12px",
            padding: "10px 12px",
            fontSize: "11px",
            fontWeight: isSelected ? 700 : 500,
            width: 190,
            textAlign: "center",
            whiteSpace: "pre-line",
            cursor: "pointer",
          },
        });
      });

    const rfEdges: Edge[] = [
      {
        id: "e-prophet-ali",
        source: "prophet",
        target: "ali",
        animated: true,
        style: { stroke: "#F9B091", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#F9B091" },
      },
      {
        id: "e-ali-ghaus",
        source: "ali",
        target: "ghaus-e-azam",
        animated: true,
        style: { stroke: "#A44AFF" },
      },
      {
        id: "e-ghaus-razavi",
        source: "ghaus-e-azam",
        target: "ala-hazrat",
        animated: true,
        style: { stroke: "#A44AFF" },
      },
      {
        id: "e-ali-khwaja",
        source: "ali",
        target: "khwaja-moinuddin",
        animated: true,
        style: { stroke: "#4ADE80" },
      },
      {
        id: "e-khwaja-nizam",
        source: "khwaja-moinuddin",
        target: "nizamuddin-auliya",
        animated: true,
        style: { stroke: "#4ADE80" },
      },
      {
        id: "e-nizam-banda",
        source: "nizamuddin-auliya",
        target: "banda-nawaz",
        animated: true,
        style: { stroke: "#4ADE80" },
      },
      {
        id: "e-ali-data",
        source: "ali",
        target: "data-ganj-bakhsh",
        animated: true,
        style: { stroke: "#F9B091" },
      },
      {
        id: "e-data-mujaddid",
        source: "data-ganj-bakhsh",
        target: "mujaddid-alf-thani",
        animated: true,
        style: { stroke: "#F9B091" },
      },
    ];

    return { nodes: rfNodes, edges: rfEdges };
  }, [allAuliya, activeSaintId, lang]);

  // Convert yawDeg (0..360) into CSS object-position X% (0..100)
  const panXPct = Math.round((yawDeg / 360) * 100);
  const activeHotspot =
    saint.hotspots.find((h) => h.id === activeHotspotId) || saint.hotspots[0] || null;

  // OpenStreetMap bounding box around the active saint's shrine
  const mapDelta = 0.012;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(
    saint.lng - mapDelta
  ).toFixed(5)}%2C${(saint.lat - mapDelta).toFixed(5)}%2C${(
    saint.lng + mapDelta
  ).toFixed(5)}%2C${(saint.lat + mapDelta).toFixed(
    5
  )}&layer=mapnik&marker=${saint.lat.toFixed(5)}%2C${saint.lng.toFixed(5)}`;

  const saintDistanceKm = haversineKm(city.lat, city.lng, saint.lat, saint.lng);
  const saintBearing = initialBearingDeg(city.lat, city.lng, saint.lat, saint.lng);

  const profileTabs: { id: AuliyaTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: "tazkirah", label: t(lang, "auliyaTabBio"), icon: BookOpen },
    { id: "gallery", label: t(lang, "auliyaTabGallery"), icon: ImageIcon },
    { id: "ziyarat", label: t(lang, "auliyaTabZiyarat"), icon: Eye },
    { id: "video", label: t(lang, "auliyaTabMedia"), icon: Film },
    { id: "shajrah", label: t(lang, "auliyaTabShajrah"), icon: GitBranch },
    { id: "books", label: t(lang, "auliyaTabBooks"), icon: ScrollText },
    { id: "map", label: t(lang, "auliyaTabMap"), icon: Compass },
  ];

  const silsilaOptions = ["All", "Qadri", "Chishti", "Naqshbandi", "Razavi"] as const;

  return (
    <div className="space-y-6">
      {/* Editorial Module Header */}
      <header className="bento-card p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <h1
              className="text-2xl sm:text-3xl font-bold tracking-tight"
              style={{ color: "var(--text-primary)" }}
            >
              {t(lang, "navAuliya")}
            </h1>
            <p className="text-sm" style={{ color: "var(--text-muted)" }}>
              {t(lang, "auliyaSubtitle")}
            </p>
          </div>

          {/* Search & Silsila Filter */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative">
              <Search
                className="w-4 h-4 absolute start-3.5 top-1/2 -translate-y-1/2 pointer-events-none"
                style={{ color: "var(--text-muted)" }}
              />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t(lang, "auliyaSearchPlaceholder")}
                className="w-full sm:w-64 rounded-xl ps-10 pe-4 py-2 text-sm border focus:outline-none transition-colors"
                style={{
                  backgroundColor: "var(--bg-muted)",
                  borderColor: "var(--border-hairline)",
                  color: "var(--text-primary)",
                }}
              />
            </div>

            <select
              value={silsilaFilter}
              onChange={(e) => setSilsilaFilter(e.target.value)}
              className="ui-select rounded-xl px-3.5 py-2 text-sm font-medium border focus:outline-none"
              style={{
                backgroundColor: "var(--bg-muted)",
                borderColor: "var(--border-hairline)",
                color: "var(--text-primary)",
              }}
            >
              {silsilaOptions.map((opt) => (
                <option key={opt} value={opt}>
                  {opt === "All" ? `${ui.all} — ${ui.silsilaAll}` : getSilsilaLabel(opt)}
                </option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Grid: Saint Directory Sidebar + Editorial Profile Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Directory Sidebar */}
        <aside className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 pb-0.5">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--text-muted)" }}
            >
              {ui.directoryHeading}
            </span>
            <span
              className="text-xs font-semibold tabular-nums"
              style={{ color: "var(--text-muted)" }}
            >
              {filtered.length}
            </span>
          </div>

          {filtered.length === 0 ? (
            <div
              className="bento-card p-6 text-center text-sm"
              style={{ color: "var(--text-muted)" }}
            >
              {ui.noResults}
            </div>
          ) : (
            <div className="space-y-2">
              {filtered.map((item) => {
                const active = item.id === saint.id;
                const primaryTitle = getPrimaryHeading(item);
                const secondaryTitle = getSecondaryHeading(item);
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => handleSelectSaint(item.id)}
                    className="w-full text-start p-3.5 rounded-2xl border transition-all cursor-pointer"
                    style={{
                      backgroundColor: active
                        ? "var(--accent-soft)"
                        : "var(--bg-surface)",
                      borderColor: active
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                      boxShadow: active ? "var(--shadow-card)" : "none",
                    }}
                  >
                    <div className="flex items-center gap-3.5">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={resolvePublicAssetUrl(item.shrineImage)}
                        alt={item.name}
                        className="w-13 h-13 rounded-xl object-cover border shrink-0"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                      <div className="min-w-0 flex-1">
                        <h3
                          className={`font-bold truncate ${
                            isPersoArabicScript
                              ? lang === "ar"
                                ? "font-arabic text-base"
                                : "font-urdu text-base"
                              : "text-sm"
                          }`}
                          style={{ color: "var(--text-primary)" }}
                        >
                          {primaryTitle}
                        </h3>
                        <p
                          className={`truncate mt-0.5 ${
                            isPersoArabicScript
                              ? "text-xs"
                              : "font-urdu text-xs"
                          }`}
                          dir={isPersoArabicScript ? "ltr" : "rtl"}
                          style={{ color: "var(--text-secondary)" }}
                        >
                          {secondaryTitle}
                        </p>
                        <p
                          className="text-[11px] truncate mt-1"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {getSilsilaLabel(item.silsila)} · {item.city} ·{" "}
                          {formatUrsDate(item.ursDay, item.ursMonth)}
                        </p>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          )}
        </aside>

        {/* Right Detail Workspace */}
        <div className="lg:col-span-8 space-y-5 min-w-0">
          {/* Dignified Shrine-Arch Editorial Hero Banner */}
          <section className="bento-card overflow-hidden">
            <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-[#060C1F]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvePublicAssetUrl(saint.shrineImage)}
                alt={saint.name}
                className="w-full h-full object-cover"
              />
              {/* Calm Dusk Sanctuary Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#070D22] via-[#070D22]/55 to-black/20" />

              {/* Subtle Architectural Mihrab Arch Hairline */}
              <svg
                viewBox="0 0 800 320"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-0 w-full h-full pointer-events-none opacity-25"
              >
                <path
                  d="M 28 320 L 28 118 Q 28 28 400 14 Q 772 28 772 118 L 772 320"
                  fill="none"
                  stroke="#F9B091"
                  strokeWidth="1.25"
                />
              </svg>

              {/* Top Quiet Context & 360° Entry */}
              <div className="absolute top-4 inset-x-5 flex items-center justify-between gap-2">
                <span className="text-[11px] font-medium tracking-wide text-white/85 px-3 py-1 rounded-full bg-black/40 backdrop-blur-md border border-white/15">
                  {getSilsilaLabel(saint.silsila)}
                </span>
                {activeTab !== "ziyarat" && (
                  <button
                    type="button"
                    onClick={() => setActiveTab("ziyarat")}
                    className="px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 text-xs font-semibold text-white hover:bg-black/65 transition-colors inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <Eye className="w-3.5 h-3.5 text-[#F9B091]" />
                    <span>{t(lang, "auliyaTabZiyarat")}</span>
                  </button>
                )}
              </div>

              {/* Editorial Name & Honorifics */}
              <div className="absolute bottom-5 inset-x-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3">
                <div className="space-y-1 min-w-0">
                  {saint.alqab.length > 0 && (
                    <p className="text-xs font-medium text-[#F9B091] truncate">
                      {saint.alqab.slice(0, 3).join("  ·  ")}
                    </p>
                  )}
                  <h2
                    className={`font-bold text-white leading-tight ${
                      isPersoArabicScript
                        ? lang === "ar"
                          ? "font-arabic text-2xl sm:text-4xl"
                          : "font-urdu text-2xl sm:text-4xl"
                        : "text-2xl sm:text-3xl tracking-tight"
                    }`}
                  >
                    {getPrimaryHeading(saint)}
                  </h2>
                  <p className="text-xs sm:text-sm text-white/80">
                    {isPersoArabicScript
                      ? `${saint.name} · ${saint.city}, ${saint.country}`
                      : `${saint.arabicName} · ${saint.city}, ${saint.country}`}
                  </p>
                </div>

                {!isPersoArabicScript && (
                  <p
                    className="font-urdu text-xl sm:text-2xl text-white/95 shrink-0"
                    dir="rtl"
                  >
                    {saint.urduName}
                  </p>
                )}
              </div>
            </div>

            {/* Clean Hairline Metadata Strip: Birth • Passing • Shrine City • Annual Urs */}
            <div
              className="grid grid-cols-2 sm:grid-cols-4 border-t divide-y sm:divide-y-0 sm:divide-x"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <div className="px-4 py-3" style={{ borderColor: "var(--border-hairline)" }}>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {ui.birth}
                </p>
                <p
                  className="text-xs font-semibold mt-0.5 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {saint.wiladatHijri}
                </p>
              </div>
              <div className="px-4 py-3" style={{ borderColor: "var(--border-hairline)" }}>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {ui.passing}
                </p>
                <p
                  className="text-xs font-semibold mt-0.5 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {saint.wisalHijri}
                </p>
              </div>
              <div className="px-4 py-3" style={{ borderColor: "var(--border-hairline)" }}>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {ui.shrineCity}
                </p>
                <p
                  className="text-xs font-semibold mt-0.5 truncate"
                  style={{ color: "var(--text-primary)" }}
                >
                  {saint.city}, {saint.country}
                </p>
              </div>
              <div className="px-4 py-3" style={{ borderColor: "var(--border-hairline)" }}>
                <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                  {ui.annualUrs}
                </p>
                <p
                  className="text-xs font-semibold mt-0.5 truncate"
                  style={{ color: "var(--accent-gold)" }}
                >
                  {formatUrsDate(saint.ursDay, saint.ursMonth)}
                </p>
              </div>
            </div>
          </section>

          {/* Sleek Scrollable 7-Pill Tab Bar */}
          <div className="overflow-x-auto pb-1">
            <div className="pill-tab-bar min-w-max">
              {profileTabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    data-active={isActive}
                    onClick={() => setActiveTab(tab.id)}
                    className="pill-tab-btn inline-flex items-center gap-1.5 whitespace-nowrap"
                  >
                    <Icon className="w-3.5 h-3.5 shrink-0" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* TAB 1: BIOGRAPHY & TIMELINE */}
          {activeTab === "tazkirah" && (
            <div className="bento-card p-6 space-y-6">
              {/* Blessed Life & Tazkirah */}
              <section className="space-y-2.5">
                <h3
                  className="text-base font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {ui.blessedLife}
                </h3>
                <p
                  className="text-sm leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {saint.fullTazkirah}
                </p>
              </section>

              {/* 3-Chapter Scholarly Biography */}
              {(saint.earlyLifeAndEducation ||
                saint.spiritualLineageAndTraining ||
                saint.reformAndLegacy) && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {saint.earlyLifeAndEducation && (
                    <div
                      className="p-4 rounded-2xl border space-y-1.5"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <h4
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        {ui.earlyLife}
                      </h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {saint.earlyLifeAndEducation}
                      </p>
                    </div>
                  )}
                  {saint.spiritualLineageAndTraining && (
                    <div
                      className="p-4 rounded-2xl border space-y-1.5"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <h4
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        {ui.spiritualTraining}
                      </h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {saint.spiritualLineageAndTraining}
                      </p>
                    </div>
                  )}
                  {saint.reformAndLegacy && (
                    <div
                      className="p-4 rounded-2xl border space-y-1.5"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <h4
                        className="text-xs font-bold uppercase tracking-wider"
                        style={{ color: "var(--accent-secondary)" }}
                      >
                        {ui.revivalLegacy}
                      </h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-secondary)" }}
                      >
                        {saint.reformAndLegacy}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {/* Chronological Life Milestones */}
              {saint.lifeTimeline && saint.lifeTimeline.length > 0 && (
                <section
                  className="pt-5 border-t space-y-4"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <h3
                    className="text-sm font-bold flex items-center gap-2"
                    style={{ color: "var(--text-primary)" }}
                  >
                    <Clock
                      className="w-4 h-4"
                      style={{ color: "var(--accent-gold)" }}
                    />
                    <span>{ui.historicalTimeline}</span>
                  </h3>
                  <div
                    className="relative ps-5 border-s space-y-4"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    {saint.lifeTimeline.map((m, idx) => (
                      <div key={idx} className="relative">
                        <span
                          className="w-2.5 h-2.5 rounded-full absolute -start-[25px] top-1.5"
                          style={{ backgroundColor: "var(--accent-gold)" }}
                        />
                        <div className="flex flex-wrap items-baseline gap-2">
                          <span
                            className="text-xs font-bold"
                            style={{ color: "var(--accent-primary)" }}
                          >
                            {m.yearHijri}
                          </span>
                          <h4
                            className="text-xs font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {m.title}
                          </h4>
                        </div>
                        <p
                          className="text-xs mt-1 leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {m.detail}
                        </p>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Blessed Quotes */}
              {saint.goldenSayings && saint.goldenSayings.length > 0 && (
                <section
                  className="pt-5 border-t space-y-3"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {ui.blessedQuotes}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {saint.goldenSayings.map((quote, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl border flex flex-col justify-between gap-3"
                        style={{
                          backgroundColor: "var(--bg-muted)",
                          borderColor: "var(--border-hairline)",
                        }}
                      >
                        <p
                          className="text-xs italic leading-relaxed"
                          style={{ color: "var(--text-primary)" }}
                        >
                          &ldquo;{quote}&rdquo;
                        </p>
                        <div
                          className="flex items-center justify-between pt-2.5 border-t"
                          style={{ borderColor: "var(--border-hairline)" }}
                        >
                          <span
                            className="text-[11px] font-medium truncate"
                            style={{ color: "var(--accent-gold)" }}
                          >
                            {getPrimaryHeading(saint)}
                          </span>
                          <button
                            type="button"
                            onClick={() => copyText(`quote-${idx}`, quote)}
                            className="text-[11px] inline-flex items-center gap-1 cursor-pointer"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {copiedKey === `quote-${idx}` ? (
                              <>
                                <Check className="w-3 h-3 text-emerald-500" />
                                <span>{ui.copied}</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3 h-3" />
                                <span>{ui.copy}</span>
                              </>
                            )}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {/* Recommended Wird */}
              {saint.dailyWird && (
                <section className="sanctuary-halo-card p-5 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div>
                      <span
                        className="text-[11px] font-semibold uppercase tracking-wider"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        {ui.recommendedWird}
                      </span>
                      <h3
                        className="text-base font-bold mt-0.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {saint.dailyWird.title}
                      </h3>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => setWirdCount((c) => c + 1)}
                        className="btn-primary px-4 py-2 rounded-xl text-xs font-bold tabular-nums cursor-pointer"
                      >
                        {ui.reciteStep} ({wirdCount} / {saint.dailyWird.recommendedCount})
                      </button>
                      {wirdCount > 0 && (
                        <button
                          type="button"
                          onClick={() => setWirdCount(0)}
                          className="p-2 rounded-xl border cursor-pointer"
                          style={{
                            backgroundColor: "var(--bg-surface)",
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-muted)",
                          }}
                          aria-label={tp(lang, "Reset")}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>
                  <p
                    className="font-arabic text-2xl text-end"
                    dir="rtl"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {saint.dailyWird.arabic}
                  </p>
                  <p
                    className="text-xs font-medium"
                    style={{ color: "var(--text-secondary)" }}
                  >
                    {saint.dailyWird.transliteration}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {saint.dailyWird.translation}
                  </p>
                </section>
              )}

              {/* Karamat, Spiritual Successors (Khulafa) & Sacred Etiquettes (Adab) */}
              <div
                className="grid grid-cols-1 md:grid-cols-2 gap-5 pt-5 border-t"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="space-y-2.5">
                  <h3
                    className="text-sm font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {ui.karamatRank}
                  </h3>
                  <ul className="space-y-2">
                    {saint.karamat.map((k, idx) => (
                      <li
                        key={idx}
                        className="p-3 rounded-xl border text-xs flex items-start gap-2.5"
                        style={{
                          backgroundColor: "var(--bg-muted)",
                          borderColor: "var(--border-hairline)",
                          color: "var(--text-secondary)",
                        }}
                      >
                        <span
                          className="w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5 tabular-nums"
                          style={{
                            backgroundColor: "var(--accent-soft)",
                            color: "var(--accent-primary)",
                          }}
                        >
                          {idx + 1}
                        </span>
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2.5">
                    <h3
                      className="text-sm font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {ui.spiritualSuccessors}
                    </h3>
                    <div className="space-y-2">
                      {saint.khulafaNames.map((kh) => (
                        <div
                          key={kh}
                          className="p-3 rounded-xl border text-xs font-semibold flex items-center gap-2.5"
                          style={{
                            backgroundColor: "var(--bg-muted)",
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <Award
                            className="w-4 h-4 shrink-0"
                            style={{ color: "var(--accent-gold)" }}
                          />
                          <span>{kh}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {saint.adabZiyarat.length > 0 && (
                    <div className="space-y-2">
                      <h3
                        className="text-sm font-bold"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {ui.sacredEtiquettes}
                      </h3>
                      <div className="space-y-1.5">
                        {saint.adabZiyarat.map((adab, i) => (
                          <div
                            key={i}
                            className="flex items-start gap-2 text-xs"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            <CheckCircle2
                              className="w-3.5 h-3.5 shrink-0 mt-0.5"
                              style={{ color: "var(--accent-primary)" }}
                            />
                            <span>{adab}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: SHRINE ARCHITECTURE, VISITING GUIDE & GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-5">
              {saint.architecturalDetails && (
                <section className="bento-card p-6 space-y-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span
                        className="text-xs font-semibold uppercase tracking-wider"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        {ui.shrineArchitecture}
                      </span>
                      <h3
                        className="text-xl font-bold mt-0.5"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {getPrimaryHeading(saint)}
                      </h3>
                    </div>
                    <span
                      className="text-xs font-medium"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {saint.city}, {saint.country}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div
                      className="p-4 rounded-2xl border"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {ui.archStyle}
                      </p>
                      <p
                        className="text-xs font-bold mt-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {saint.architecturalDetails.style}
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-2xl border"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {ui.historicalEra}
                      </p>
                      <p
                        className="text-xs font-bold mt-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {saint.architecturalDetails.eraBuilt}
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-2xl border"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {ui.patronage}
                      </p>
                      <p
                        className="text-xs font-bold mt-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {saint.architecturalDetails.patronage}
                      </p>
                    </div>
                    <div
                      className="p-4 rounded-2xl border"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {ui.visitingGuide}
                      </p>
                      <p
                        className="text-xs font-bold mt-1"
                        style={{ color: "var(--text-primary)" }}
                      >
                        {saint.architecturalDetails.visitingHours}
                      </p>
                      <p
                        className="text-[11px] mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {ui.nearLandmark}: {saint.architecturalDetails.nearestLandmark}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h4
                      className="text-xs font-bold uppercase tracking-wider"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {ui.precinctLandmarks}
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {saint.architecturalDetails.keyFeatures.map((feat) => (
                        <span
                          key={feat}
                          className="px-3 py-1.5 rounded-xl border text-xs inline-flex items-center gap-1.5"
                          style={{
                            backgroundColor: "var(--bg-muted)",
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-primary)",
                          }}
                        >
                          <Landmark
                            className="w-3.5 h-3.5 shrink-0"
                            style={{ color: "var(--accent-gold)" }}
                          />
                          <span>{feat}</span>
                        </span>
                      ))}
                    </div>
                  </div>
                </section>
              )}

              <section className="bento-card p-6 space-y-4">
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {ui.galleryPlates}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {ui.galleryCaption}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(saint.gallery || []).map((item) => (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setLightboxItem(item)}
                      className="group text-start cursor-pointer rounded-2xl border overflow-hidden transition-all"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <div className="relative h-52 overflow-hidden bg-[#060C1F]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={resolvePublicAssetUrl(item.imageUrl)}
                          alt={item.title}
                          style={{ objectPosition: item.focalPoint || "50% 50%" }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
                        <span className="absolute top-3 start-3 px-2.5 py-1 rounded-lg bg-black/65 backdrop-blur-md text-[10px] font-semibold text-[#F9B091]">
                          {item.era}
                        </span>
                        <span className="absolute top-3 end-3 p-1.5 rounded-lg bg-black/65 text-white opacity-80 group-hover:opacity-100">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="p-4">
                        <span
                          className="text-[10px] font-semibold uppercase tracking-wider"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          {item.architecturalStyle}
                        </span>
                        <h4
                          className="text-sm font-bold mt-0.5"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {item.title}
                        </h4>
                        <p
                          className="text-xs mt-1 leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {item.caption}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          )}

          {/* TAB 3: 360° VIRTUAL ZIYARAT VIEWER */}
          {activeTab === "ziyarat" && (
            <section className="bento-card p-6 space-y-5">
              <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t(lang, "auliyaTabZiyarat")} — {getPrimaryHeading(saint)}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {ui.distanceFromYou}:{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {saintDistanceKm.toLocaleString()} km
                    </strong>{" "}
                    · {ui.bearing}:{" "}
                    <strong style={{ color: "var(--text-primary)" }}>
                      {saintBearing}° {bearingCardinal(saintBearing)}
                    </strong>
                  </p>
                </div>

                {/* Compact Ziyarat Controls Cluster */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setAutoOrbit((o) => !o)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors"
                    style={{
                      backgroundColor: autoOrbit
                        ? "var(--accent-soft)"
                        : "var(--bg-muted)",
                      borderColor: autoOrbit
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                      color: autoOrbit
                        ? "var(--accent-primary)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {autoOrbit ? (
                      <Pause className="w-3.5 h-3.5" />
                    ) : (
                      <Play className="w-3.5 h-3.5" />
                    )}
                    <span>{ui.autoOrbit}</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setAmbientOn((a) => !a)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors"
                    style={{
                      backgroundColor: ambientOn
                        ? "var(--gold-soft)"
                        : "var(--bg-muted)",
                      borderColor: ambientOn
                        ? "var(--accent-gold)"
                        : "var(--border-hairline)",
                      color: ambientOn
                        ? "var(--accent-gold)"
                        : "var(--text-secondary)",
                    }}
                  >
                    {ambientOn ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                    <span>{ui.ambientSound}</span>
                  </button>

                  <button
                    type="button"
                    onClick={resetZiyaratView}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{ui.resetView}</span>
                  </button>

                  {/* Day / Golden / Night Lighting Pill */}
                  <div
                    className="inline-flex items-center rounded-xl p-0.5 border"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    {[
                      { id: "day", label: ui.day, icon: Sun },
                      { id: "golden", label: ui.golden, icon: Sunset },
                      { id: "night", label: ui.night, icon: Moon },
                    ].map((m) => {
                      const Icon = m.icon;
                      const active = lightingMode === m.id;
                      return (
                        <button
                          key={m.id}
                          type="button"
                          onClick={() =>
                            setLightingMode(m.id as "day" | "golden" | "night")
                          }
                          className="px-2.5 py-1 rounded-lg text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer transition-colors"
                          style={{
                            backgroundColor: active
                              ? "var(--accent-primary)"
                              : "transparent",
                            color: active ? "#FFFFFF" : "var(--text-muted)",
                          }}
                        >
                          <Icon className="w-3 h-3" />
                          <span>{m.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Interactive 360° Drag Viewport */}
              <div
                onPointerDown={(e) => {
                  setIsDragging360(true);
                  dragStartRef.current = {
                    x: e.clientX,
                    y: e.clientY,
                    yaw: yawDeg,
                    pitch: pitchPct,
                  };
                }}
                onPointerMove={(e) => {
                  if (!isDragging360 || !dragStartRef.current) return;
                  const dx = e.clientX - dragStartRef.current.x;
                  const dy = e.clientY - dragStartRef.current.y;
                  const nextYaw = (dragStartRef.current.yaw - dx * 0.45 + 360) % 360;
                  const nextPitch = Math.max(
                    20,
                    Math.min(80, dragStartRef.current.pitch - dy * 0.15)
                  );
                  setYawDeg(Math.round(nextYaw));
                  setPitchPct(Math.round(nextPitch));
                }}
                onPointerUp={() => {
                  setIsDragging360(false);
                  dragStartRef.current = null;
                }}
                onPointerLeave={() => {
                  setIsDragging360(false);
                  dragStartRef.current = null;
                }}
                className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border bg-[#040C23] select-none cursor-grab active:cursor-grabbing"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={resolvePublicAssetUrl(saint.shrineImage)}
                  alt={saint.name}
                  draggable={false}
                  style={{
                    objectPosition: `${panXPct}% ${pitchPct}%`,
                    transform: `scale(${zoom})`,
                    filter:
                      lightingMode === "day"
                        ? "brightness(1.06) contrast(1.04)"
                        : lightingMode === "golden"
                        ? "sepia(0.18) saturate(1.25) brightness(0.98)"
                        : "brightness(0.72) contrast(1.18) hue-rotate(-12deg)",
                  }}
                  className="w-full h-full object-cover transition-transform duration-150"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040C23]/85 via-transparent to-[#040C23]/45 pointer-events-none" />

                {/* Top Compass & Bearing HUD */}
                <div className="absolute top-3 inset-x-3 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-[#040C23]/80 backdrop-blur-md border border-white/15 text-[11px] font-semibold text-white inline-flex items-center gap-2 tabular-nums">
                    <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
                    <span>
                      {ui.bearing}: {Math.round(yawDeg)}° ({bearingCardinal(yawDeg)})
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#040C23]/80 backdrop-blur-md border border-white/15 text-[11px] text-white/85">
                    {ui.dragHint}
                  </div>
                </div>

                {/* Interactive Hotspots */}
                {saint.hotspots.map((spot, idx) => {
                  const isSpotActive =
                    (activeHotspot && activeHotspot.id === spot.id) || false;
                  return (
                    <button
                      key={spot.id}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspotId(spot.id);
                      }}
                      style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg inline-flex items-center gap-1.5 transition-transform hover:scale-105 cursor-pointer ${
                        isSpotActive
                          ? "bg-[#F9B091] text-[#040C23] ring-4 ring-[#F9B091]/40"
                          : "bg-[#121931]/90 text-white border border-[#F9B091]"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-[#A44AFF] text-white text-[10px] flex items-center justify-center tabular-nums">
                        {idx + 1}
                      </span>
                      <span>{spot.title}</span>
                    </button>
                  );
                })}

                {/* Active Hotspot Detail Overlay */}
                {activeHotspot && (
                  <div className="absolute bottom-3 inset-x-3 p-4 rounded-xl bg-[#040C23]/90 backdrop-blur-md border border-white/15">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#F9B091]">
                        {activeHotspot.title}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => {
                            const idx = saint.hotspots.findIndex(
                              (h) => h.id === activeHotspot.id
                            );
                            const prev =
                              saint.hotspots[
                                (idx - 1 + saint.hotspots.length) %
                                  saint.hotspots.length
                              ];
                            if (prev) {
                              setActiveHotspotId(prev.id);
                              setYawDeg(Math.round((prev.xPct / 100) * 360));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white hover:bg-white/20 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <ChevronLeft className="w-3 h-3 rtl-mirror" />
                          <span>{ui.prevLabel}</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const idx = saint.hotspots.findIndex(
                              (h) => h.id === activeHotspot.id
                            );
                            const next =
                              saint.hotspots[(idx + 1) % saint.hotspots.length];
                            if (next) {
                              setActiveHotspotId(next.id);
                              setYawDeg(Math.round((next.xPct / 100) * 360));
                            }
                          }}
                          className="px-2.5 py-1 rounded-lg bg-white/10 border border-white/15 text-[11px] text-white hover:bg-white/20 inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>{ui.nextLabel}</span>
                          <ChevronRight className="w-3 h-3 rtl-mirror" />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-white/90 mt-1">
                      {activeHotspot.description}
                    </p>
                    <p className="text-[11px] text-[#4ADE80] mt-1.5 font-medium">
                      {ui.sacredEtiquettes}: {activeHotspot.adabNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Pan & Zoom Sliders + Recite Salam Action */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <div
                    className="flex justify-between text-xs mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>{ui.rotationPan}</span>
                    <span
                      className="font-semibold tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {Math.round(yawDeg)}°
                    </span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={yawDeg}
                    onChange={(e) => setYawDeg(Number(e.target.value))}
                    className="w-full accent-[#A44AFF]"
                  />
                </div>

                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <div
                    className="flex justify-between text-xs mb-1"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>{ui.opticalZoom}</span>
                    <span
                      className="font-semibold tabular-nums"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {zoom.toFixed(2)}x
                    </span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={1.85}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[#F9B091]"
                  />
                </div>

                <button
                  type="button"
                  onClick={() =>
                    speakSalawatOrText(
                      `Assalamu Alaikum Ya Ahlal Quboor. Reciting Surah Al-Fatiha and Salawat for ${saint.name}.`
                    )
                  }
                  className="btn-primary h-full px-4 py-3 rounded-xl text-xs font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Volume2 className="w-4 h-4" />
                  <span>{ui.reciteSalam}</span>
                </button>
              </div>

              {/* Sacred Etiquettes (Adab) */}
              <div
                className="p-4 rounded-2xl border space-y-2.5"
                style={{
                  backgroundColor: "var(--bg-muted)",
                  borderColor: "var(--border-hairline)",
                }}
              >
                <h4
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {ui.sacredEtiquettes}
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {saint.adabZiyarat.map((adab, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      <CheckCircle2
                        className="w-3.5 h-3.5 shrink-0 mt-0.5"
                        style={{ color: "var(--accent-primary)" }}
                      />
                      <span>{adab}</span>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* TAB 4: AUDIO & VIDEO DOCUMENTARY VIEWER */}
          {activeTab === "video" && (
            <section className="bento-card p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t(lang, "auliyaTabMedia")} — {getPrimaryHeading(saint)}
                  </h3>
                  {currentVideo && (
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {currentVideo.description}
                    </p>
                  )}
                </div>

                {saint.videos && saint.videos.length > 1 && (
                  <div className="flex flex-wrap gap-1.5">
                    {saint.videos.map((v, idx) => {
                      const active = selectedVideoIdx === idx;
                      return (
                        <button
                          key={v.id}
                          type="button"
                          onClick={() => {
                            setSelectedVideoIdx(idx);
                            setVideoStepIdx(0);
                            setIsPlayingVideo(false);
                          }}
                          className="px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer transition-colors"
                          style={{
                            backgroundColor: active
                              ? "var(--accent-primary)"
                              : "var(--bg-muted)",
                            borderColor: active
                              ? "var(--accent-primary)"
                              : "var(--border-hairline)",
                            color: active ? "#FFFFFF" : "var(--text-secondary)",
                          }}
                        >
                          {v.category} ({v.duration})
                        </button>
                      );
                    })}
                  </div>
                )}
              </div>

              {currentVideo ? (
                <>
                  {/* Cinema Player Viewport */}
                  <div
                    className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border bg-[#040C23]"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={resolvePublicAssetUrl(
                        saint.gallery && saint.gallery.length > 0
                          ? saint.gallery[videoStepIdx % saint.gallery.length].imageUrl
                          : saint.shrineImage
                      )}
                      alt={currentVideo.title}
                      style={{
                        objectPosition:
                          saint.gallery && saint.gallery.length > 0
                            ? saint.gallery[videoStepIdx % saint.gallery.length]
                                .focalPoint
                            : "50% 50%",
                        transform: isPlayingVideo ? "scale(1.18)" : "scale(1.04)",
                      }}
                      className="w-full h-full object-cover transition-transform duration-[6000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040C23] via-[#040C23]/45 to-transparent" />

                    <div className="absolute top-4 inset-x-4 flex items-center justify-between gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#040C23]/85 border border-white/15 text-[11px] font-semibold text-[#F9B091]">
                        {currentVideo.category} · {currentVideo.duration}
                      </span>
                      <button
                        type="button"
                        onClick={() => setVoiceNarrationOn((v) => !v)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border inline-flex items-center gap-1.5 cursor-pointer ${
                          voiceNarrationOn
                            ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                            : "bg-[#040C23]/80 border-white/15 text-white/80"
                        }`}
                      >
                        {voiceNarrationOn ? (
                          <Volume2 className="w-3.5 h-3.5" />
                        ) : (
                          <VolumeX className="w-3.5 h-3.5" />
                        )}
                        <span>{ui.voiceNarration}</span>
                      </button>
                    </div>

                    {/* Subtitle & Narration Box */}
                    <div className="absolute bottom-16 inset-x-4 p-4 rounded-2xl bg-[#040C23]/90 backdrop-blur-md border border-white/15">
                      <div className="flex items-center justify-between text-[11px] text-[#DF98FA] font-semibold mb-1">
                        <span>
                          {ui.chapter} {videoStepIdx + 1} /{" "}
                          {currentVideo.narrationScript.length}:{" "}
                          {currentVideo.chapters[videoStepIdx]?.label ||
                            currentVideo.title}
                        </span>
                        <span className="tabular-nums">
                          {currentVideo.chapters[videoStepIdx]?.time || "00:00"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-white leading-relaxed">
                        &ldquo;{currentVideo.narrationScript[videoStepIdx]}&rdquo;
                      </p>
                    </div>

                    {/* Bottom Transport Controls */}
                    <div className="absolute bottom-3 inset-x-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setIsPlayingVideo((p) => !p)}
                          className="btn-primary px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          {isPlayingVideo ? (
                            <>
                              <Pause className="w-3.5 h-3.5" />
                              <span>{ui.pause}</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" />
                              <span>{ui.playDocumentary}</span>
                            </>
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            setIsPlayingVideo(false);
                            setVideoStepIdx(0);
                          }}
                          className="p-1.5 rounded-xl bg-white/10 border border-white/15 text-white/80 hover:text-white cursor-pointer"
                          aria-label={tp(lang, "Reset")}
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="flex items-center gap-1.5">
                        {currentVideo.narrationScript.map((_, idx) => (
                          <button
                            key={idx}
                            type="button"
                            onClick={() => setVideoStepIdx(idx)}
                            className={`h-2 rounded-full transition-all cursor-pointer ${
                              idx === videoStepIdx
                                ? "w-6 bg-[#F9B091]"
                                : "w-2 bg-white/30 hover:bg-white/60"
                            }`}
                            aria-label={`${ui.chapter} ${idx + 1}`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Documentary Chapters List */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    {currentVideo.chapters.map((ch, idx) => {
                      const active = videoStepIdx === idx;
                      return (
                        <button
                          key={idx}
                          type="button"
                          onClick={() => {
                            setVideoStepIdx(
                              Math.min(idx, currentVideo.narrationScript.length - 1)
                            );
                            setIsPlayingVideo(true);
                          }}
                          className="text-start p-4 rounded-2xl border transition-all cursor-pointer"
                          style={{
                            backgroundColor: active
                              ? "var(--accent-soft)"
                              : "var(--bg-muted)",
                            borderColor: active
                              ? "var(--accent-primary)"
                              : "var(--border-hairline)",
                          }}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold">
                            <span style={{ color: "var(--accent-gold)" }}>
                              {ui.chapter} {idx + 1}
                            </span>
                            <span
                              className="tabular-nums"
                              style={{ color: "var(--text-muted)" }}
                            >
                              {ch.time}
                            </span>
                          </div>
                          <h4
                            className="text-xs font-bold mt-1"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {ch.label}
                          </h4>
                          <p
                            className="text-[11px] mt-1"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {ch.summary}
                          </p>
                        </button>
                      );
                    })}
                  </div>
                </>
              ) : null}
            </section>
          )}

          {/* TAB 5: SHAJRAH-E-TAYYIBAH */}
          {activeTab === "shajrah" && (
            <section className="bento-card p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <h3
                    className="text-lg font-bold"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {t(lang, "auliyaTabShajrah")} — {getPrimaryHeading(saint)}
                  </h3>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {ui.selectNodeHint}
                  </p>
                </div>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {getSilsilaLabel(saint.silsila)}
                </span>
              </div>

              {/* Golden Chain Cards */}
              {saint.shajrahChain && saint.shajrahChain.length > 0 && (
                <div className="space-y-2.5">
                  <h4
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {ui.goldenChain}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {saint.shajrahChain.map((node, idx) => (
                      <div
                        key={node.generation}
                        className="p-3.5 rounded-2xl border flex items-start gap-2.5"
                        style={{
                          backgroundColor:
                            idx === 0 ? "var(--accent-soft)" : "var(--bg-muted)",
                          borderColor:
                            idx === 0
                              ? "var(--accent-gold)"
                              : idx === saint.shajrahChain!.length - 1
                              ? "var(--accent-primary)"
                              : "var(--border-hairline)",
                        }}
                      >
                        <span
                          className="w-6 h-6 rounded-full text-[11px] font-bold flex items-center justify-center shrink-0 tabular-nums"
                          style={{
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--accent-primary)",
                            border: "1px solid var(--border-hairline)",
                          }}
                        >
                          {node.generation}
                        </span>
                        <div className="min-w-0">
                          <h5
                            className="text-xs font-bold truncate"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {node.name}
                          </h5>
                          <p
                            className="text-[11px] truncate"
                            style={{ color: "var(--text-secondary)" }}
                          >
                            {node.title}
                          </p>
                          <p
                            className="text-[10px] mt-0.5"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {node.era}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive React Flow Tree */}
              <div className="space-y-2">
                <h4
                  className="text-xs font-bold uppercase tracking-wider"
                  style={{ color: "var(--text-muted)" }}
                >
                  {ui.lineageTree}
                </h4>
                <div
                  className="h-[420px] w-full rounded-2xl bg-[#040C23] border overflow-hidden"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    onNodeClick={(_, node) => {
                      const found = allAuliya.find((a) => a.id === node.id);
                      if (found) handleSelectSaint(found.id);
                    }}
                  >
                    <Background color="#242F54" gap={20} />
                    <Controls />
                  </ReactFlow>
                </div>
              </div>
            </section>
          )}

          {/* TAB 6: BOOKS & MALFUZAT */}
          {activeTab === "books" && (
            <section className="bento-card p-6 space-y-4">
              <div>
                <h3
                  className="text-lg font-bold"
                  style={{ color: "var(--text-primary)" }}
                >
                  {t(lang, "auliyaTabBooks")} — {getPrimaryHeading(saint)}
                </h3>
              </div>

              <div className="space-y-4">
                {saint.books.map((book) => (
                  <article
                    key={book.title}
                    className="p-5 rounded-2xl border space-y-3.5"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-2">
                      <div>
                        <p
                          className="text-[11px] font-medium"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {book.genre}
                          {book.language ? ` · ${book.language}` : ""}
                          {book.yearOrEra ? ` · ${book.yearOrEra}` : ""}
                        </p>
                        <h4
                          className="text-base font-bold mt-0.5"
                          style={{ color: "var(--text-primary)" }}
                        >
                          {book.title}
                        </h4>
                      </div>
                      <p
                        className="font-arabic text-xl shrink-0"
                        dir="rtl"
                        style={{ color: "var(--accent-gold)" }}
                      >
                        {book.arabicOrUrduTitle}
                      </p>
                    </div>

                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-secondary)" }}
                    >
                      {book.summary}
                    </p>

                    <div
                      className="p-3.5 rounded-xl border-s-2"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--accent-gold)",
                      }}
                    >
                      <p
                        className="text-xs italic leading-relaxed"
                        style={{ color: "var(--text-primary)" }}
                      >
                        &ldquo;{book.excerpt}&rdquo;
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => copyText(book.title, book.excerpt)}
                        className="text-xs font-medium inline-flex items-center gap-1.5 cursor-pointer"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {copiedKey === book.title ? (
                          <>
                            <Check className="w-3.5 h-3.5 text-emerald-500" />
                            <span>{ui.copied}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3.5 h-3.5" />
                            <span>{ui.copy}</span>
                          </>
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveBook(book);
                          setActiveChapterIdx(0);
                        }}
                        className="btn-primary px-4 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                      >
                        <BookOpen className="w-3.5 h-3.5" />
                        <span>{ui.readExcerpt}</span>
                      </button>
                    </div>
                  </article>
                ))}
              </div>
            </section>
          )}

          {/* TAB 7: SHRINE WORLD MAP & URS CALENDAR */}
          {activeTab === "map" && (
            <div className="space-y-5">
              <section className="bento-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3
                      className="text-lg font-bold"
                      style={{ color: "var(--text-primary)" }}
                    >
                      {getPrimaryHeading(saint)} — {saint.city}, {saint.country}
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {ui.distanceFromYou}:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        {saintDistanceKm.toLocaleString()} km
                      </strong>{" "}
                      ({city.name}) · {ui.bearing}:{" "}
                      <strong style={{ color: "var(--text-primary)" }}>
                        {saintBearing}° {bearingCardinal(saintBearing)}
                      </strong>
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${saint.lat},${saint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-primary px-3.5 py-1.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" />
                      <span>{ui.googleMaps}</span>
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${saint.lat}&mlon=${saint.lng}#map=16/${saint.lat}/${saint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3.5 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    >
                      <ExternalLink className="w-3.5 h-3.5" />
                      <span>{ui.openStreetMap}</span>
                    </a>
                  </div>
                </div>

                {/* Live Embedded OpenStreetMap Iframe */}
                <div
                  className="h-80 w-full rounded-2xl overflow-hidden border bg-[#040C23]"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <iframe
                    key={saint.id}
                    title={`Map — ${saint.name}`}
                    src={osmEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>

                {/* All Sacred Shrines Quick Switcher */}
                <div className="space-y-2.5 pt-2">
                  <h4
                    className="text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {ui.allShrinesMap}
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {allAuliya
                      .filter((a) => a.status === "Published")
                      .map((a) => {
                        const dist = haversineKm(city.lat, city.lng, a.lat, a.lng);
                        const brg = initialBearingDeg(city.lat, city.lng, a.lat, a.lng);
                        const isSelected = a.id === saint.id;
                        return (
                          <button
                            key={a.id}
                            type="button"
                            onClick={() => handleSelectSaint(a.id)}
                            className="p-3.5 rounded-2xl border text-start transition-all flex items-center justify-between gap-2 cursor-pointer"
                            style={{
                              backgroundColor: isSelected
                                ? "var(--accent-soft)"
                                : "var(--bg-muted)",
                              borderColor: isSelected
                                ? "var(--accent-primary)"
                                : "var(--border-hairline)",
                            }}
                          >
                            <div className="min-w-0">
                              <p
                                className="text-xs font-bold truncate"
                                style={{ color: "var(--text-primary)" }}
                              >
                                {getPrimaryHeading(a)}
                              </p>
                              <p
                                className="text-[11px] truncate mt-0.5"
                                style={{ color: "var(--text-muted)" }}
                              >
                                <MapPin className="w-3 h-3 inline me-1" />
                                {a.city}, {a.country} ·{" "}
                                {formatUrsDate(a.ursDay, a.ursMonth)}
                              </p>
                            </div>
                            <div className="text-end shrink-0 tabular-nums">
                              <span
                                className="text-xs font-bold block"
                                style={{ color: "var(--accent-primary)" }}
                              >
                                {dist.toLocaleString()} km
                              </span>
                              <span
                                className="text-[10px]"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {brg}° {bearingCardinal(brg)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </section>

              {/* Annual Urs & Family Barsi Tracker */}
              <section className="bento-card p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3
                      className="text-base font-bold flex items-center gap-2"
                      style={{ color: "var(--text-primary)" }}
                    >
                      <Calendar
                        className="w-4 h-4"
                        style={{ color: "var(--accent-gold)" }}
                      />
                      <span>{ui.ursBarsiTracker}</span>
                    </h3>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {hijri.day}{" "}
                      {formatLocalizedHijriMonth(lang, hijri.month, hijri.monthName)}{" "}
                      {hijri.year} AH
                    </p>
                  </div>

                  <div
                    className="inline-flex items-center gap-1 p-1 rounded-xl border"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <span
                      className="text-[11px] px-2"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {ui.hilalOffset}:
                    </span>
                    {([-1, 0, 1] as const).map((offset) => (
                      <button
                        key={offset}
                        type="button"
                        onClick={() => setHilalOffset(offset)}
                        className="px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums cursor-pointer"
                        style={{
                          backgroundColor:
                            hilalOffset === offset
                              ? "var(--accent-primary)"
                              : "transparent",
                          color:
                            hilalOffset === offset ? "#FFFFFF" : "var(--text-muted)",
                        }}
                      >
                        {offset > 0 ? `+${offset}d` : `${offset}d`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Family Barsi Form */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-3.5 rounded-2xl border"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <input
                    type="text"
                    value={barsiName}
                    onChange={(e) => setBarsiName(e.target.value)}
                    placeholder={ui.departedPlaceholder}
                    className="sm:col-span-2 rounded-xl px-3 py-2 text-xs border focus:outline-none"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <input
                    type="text"
                    value={barsiRelation}
                    onChange={(e) => setBarsiRelation(e.target.value)}
                    placeholder={ui.relationPlaceholder}
                    className="rounded-xl px-3 py-2 text-xs border focus:outline-none"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={barsiDay}
                      onChange={(e) => setBarsiDay(Number(e.target.value))}
                      className="w-16 rounded-xl px-2 py-2 text-xs border tabular-nums focus:outline-none"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    />
                    <select
                      value={barsiMonth}
                      onChange={(e) => setBarsiMonth(Number(e.target.value))}
                      className="ui-select flex-1 rounded-xl px-2 py-2 text-xs border focus:outline-none"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-primary)",
                      }}
                    >
                      {HIJRI_MONTHS.map((m, idx) => (
                        <option key={m} value={idx + 1}>
                          {formatLocalizedHijriMonth(lang, idx + 1, m)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      if (!barsiName.trim()) return;
                      addFamilyBarsi({
                        personName: barsiName.trim(),
                        relation: barsiRelation.trim() || "—",
                        hijriDay: barsiDay,
                        hijriMonth: barsiMonth,
                      });
                      setBarsiName("");
                      setBarsiRelation("");
                    }}
                    className="btn-primary rounded-xl px-3 py-2 text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{ui.saveBarsi}</span>
                  </button>
                </div>

                {familyBarsis.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {familyBarsis.map((b) => (
                      <div
                        key={b.id}
                        className="p-3.5 rounded-xl border flex items-center justify-between gap-2"
                        style={{
                          backgroundColor: "var(--bg-muted)",
                          borderColor: "var(--border-hairline)",
                        }}
                      >
                        <div>
                          <p
                            className="text-xs font-bold"
                            style={{ color: "var(--text-primary)" }}
                          >
                            {b.personName}
                          </p>
                          <p
                            className="text-[11px]"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {b.relation}
                          </p>
                        </div>
                        <span
                          className="text-xs font-semibold shrink-0"
                          style={{ color: "var(--accent-gold)" }}
                        >
                          {formatUrsDate(b.hijriDay, b.hijriMonth)}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}
        </div>
      </div>

      {/* GALLERY LIGHTBOX MODAL */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full rounded-3xl border overflow-hidden shadow-2xl"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-hairline)",
            }}
          >
            <div className="relative h-80 sm:h-[420px] bg-[#040C23]">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={resolvePublicAssetUrl(lightboxItem.imageUrl)}
                alt={lightboxItem.title}
                style={{ objectPosition: lightboxItem.focalPoint || "50% 50%" }}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 end-4 px-3 py-1.5 rounded-full bg-black/70 text-white text-xs font-semibold inline-flex items-center gap-1.5 hover:bg-black/90 cursor-pointer"
              >
                <X className="w-3.5 h-3.5" />
                <span>{ui.close}</span>
              </button>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {lightboxItem.architecturalStyle}
                </span>
                <span
                  className="text-xs font-semibold"
                  style={{ color: "var(--accent-gold)" }}
                >
                  {lightboxItem.era}
                </span>
              </div>
              <h3
                className="text-lg font-bold mt-1"
                style={{ color: "var(--text-primary)" }}
              >
                {lightboxItem.title}
              </h3>
              <p
                className="text-xs mt-1 leading-relaxed"
                style={{ color: "var(--text-muted)" }}
              >
                {lightboxItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOOK EXCERPT & CHAPTER READER MODAL */}
      {activeBook && (
        <div
          onClick={() => setActiveBook(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full rounded-3xl border p-6 space-y-4 shadow-2xl"
            style={{
              backgroundColor: "var(--bg-surface)",
              borderColor: "var(--border-hairline)",
            }}
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p
                  className="text-[11px] font-medium"
                  style={{ color: "var(--text-muted)" }}
                >
                  {activeBook.genre}
                  {activeBook.language ? ` · ${activeBook.language}` : ""}
                </p>
                <h3
                  className="text-xl font-bold mt-0.5"
                  style={{ color: "var(--text-primary)" }}
                >
                  {activeBook.title}
                </h3>
                <p
                  className="font-arabic text-lg"
                  dir="rtl"
                  style={{ color: "var(--accent-gold)" }}
                >
                  {activeBook.arabicOrUrduTitle}
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveBook(null)}
                className="px-3 py-1.5 rounded-full border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                style={{
                  backgroundColor: "var(--bg-muted)",
                  borderColor: "var(--border-hairline)",
                  color: "var(--text-secondary)",
                }}
              >
                <X className="w-3.5 h-3.5" />
                <span>{ui.close}</span>
              </button>
            </div>

            {activeBook.chapters && activeBook.chapters.length > 0 ? (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {activeBook.chapters.map((_, idx) => {
                    const active = activeChapterIdx === idx;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveChapterIdx(idx)}
                        className="px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
                        style={{
                          backgroundColor: active
                            ? "var(--accent-primary)"
                            : "var(--bg-muted)",
                          borderColor: active
                            ? "var(--accent-primary)"
                            : "var(--border-hairline)",
                          color: active ? "#FFFFFF" : "var(--text-secondary)",
                        }}
                      >
                        {ui.chapter} {idx + 1}
                      </button>
                    );
                  })}
                </div>

                <div
                  className="p-5 rounded-2xl border space-y-2"
                  style={{
                    backgroundColor: "var(--bg-muted)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <h4
                    className="text-sm font-bold"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {activeBook.chapters[activeChapterIdx]?.title}
                  </h4>
                  <p
                    className="text-xs sm:text-sm leading-relaxed"
                    style={{ color: "var(--text-primary)" }}
                  >
                    {activeBook.chapters[activeChapterIdx]?.content}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    type="button"
                    disabled={activeChapterIdx === 0}
                    onClick={() => setActiveChapterIdx((i) => Math.max(0, i - 1))}
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <ChevronLeft className="w-3.5 h-3.5 rtl-mirror" />
                    <span>{ui.prevLabel}</span>
                  </button>
                  <span
                    className="text-xs tabular-nums"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {ui.chapter} {activeChapterIdx + 1} / {activeBook.chapters.length}
                  </span>
                  <button
                    type="button"
                    disabled={activeChapterIdx + 1 >= activeBook.chapters.length}
                    onClick={() =>
                      setActiveChapterIdx((i) =>
                        Math.min(activeBook.chapters!.length - 1, i + 1)
                      )
                    }
                    className="px-3 py-1.5 rounded-xl border text-xs font-semibold disabled:opacity-40 inline-flex items-center gap-1 cursor-pointer"
                    style={{
                      backgroundColor: "var(--bg-muted)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <span>{ui.nextLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5 rtl-mirror" />
                  </button>
                </div>
              </>
            ) : (
              <div
                className="p-5 rounded-2xl border space-y-2.5"
                style={{
                  backgroundColor: "var(--bg-muted)",
                  borderColor: "var(--border-hairline)",
                }}
              >
                <p
                  className="text-xs leading-relaxed"
                  style={{ color: "var(--text-secondary)" }}
                >
                  {activeBook.summary}
                </p>
                <p
                  className="text-sm italic leading-relaxed"
                  style={{ color: "var(--text-primary)" }}
                >
                  &ldquo;{activeBook.excerpt}&rdquo;
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuliyaPage() {
  const { lang } = useApp();
  return (
    <Suspense
      fallback={
        <div
          className="p-8 text-center text-sm"
          style={{ color: "var(--text-muted)" }}
        >
          {tp(lang, "Loading")}
        </div>
      }
    >
      <AuliyaInner />
    </Suspense>
  );
}
