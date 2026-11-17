"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Compass,
  AlertTriangle,
  Bell,
  Volume2,
  CheckCircle2,
  Circle,
  Sun,
  Moon,
  MapPin,
  LocateFixed,
  Globe2,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Activity,
  RotateCcw,
  Sliders,
  Search,
  ChevronLeft,
  ChevronRight,
  ArrowLeft,
  ArrowRight,
  Calendar,
  Sparkles,
  RefreshCw,
  Navigation,
  ShieldCheck,
  BookOpen,
} from "lucide-react";
import { useApp } from "@/lib/store";
import {
  formatLocalizedHijriMonth,
  LangCode,
  localizePrayerName,
  t,
  tp,
} from "@/lib/i18n";
import {
  CalcMethodId,
  computeHanafiSchedule,
  formatCountdown,
  formatTime,
  HANAFI_RAKAT_GUIDE,
  PrayerName,
  RakatUnit,
} from "@/lib/prayer-engine";
import {
  GeocodedLocation,
  getAllWorldTimezones,
  getAqiCategory,
  getKaabaDistanceKm,
  getMagneticDeclinationDeg,
  getSolarPosition,
  getTimezoneOffsetInfo,
  searchWorldLocations,
} from "@/lib/location-weather";

type SensorStatusKey = "interactive" | "active" | "unavailable" | "denied" | "listening";

interface PrayerUiStrings {
  solarHorizon: string;
  useLiveGps: string;
  locatingGps: string;
  changeLocationTz: string;
  closeLocationTz: string;
  enableAlerts: string;
  alertsActive: string;
  locationStudioTitle: string;
  locationStudioSub: string;
  detectGpsBtn: string;
  ianaZonesLabel: string;
  filterTzPlaceholder: string;
  citySearchLabel: string;
  searchCityPlaceholder: string;
  searchingCities: string;
  typeTwoChars: string;
  exactCoordsLabel: string;
  applyCoordsBtn: string;
  qiblaCompassTitle: string;
  distanceToMakkah: string;
  liveCompass: string;
  liveCompassOn: string;
  calibrate: string;
  trueNorth: string;
  magneticNorth: string;
  declination: string;
  qiblaAligned: string;
  turnRight: string;
  turnLeft: string;
  heading: string;
  snapToQibla: string;
  northZero: string;
  sensorInteractive: string;
  sensorActive: string;
  sensorUnavailable: string;
  sensorDenied: string;
  sensorListening: string;
  calibrationTitle: string;
  figure8Title: string;
  figure8Desc: string;
  figure8Verified: string;
  recordPass: string;
  tiltTrimTitle: string;
  compassTrim: string;
  sunAzimuth: string;
  resetTrim: string;
  done: string;
  weatherAqi: string;
  localConditions: string;
  feelsLike: string;
  wind: string;
  humidity: string;
  pressure: string;
  uvIndex: string;
  cloud: string;
  particulates: string;
  ozone: string;
  dust: string;
  syncingWeather: string;
  scheduleTitle: string;
  scheduleSub: string;
  prayedToday: string;
  namazGuide: string;
  today: string;
  prevDay: string;
  nextDay: string;
  withJamaat: string;
  onTime: string;
  qaza: string;
  sunnah: string;
  sunnahMuakkadah: string;
  sunnahGhayr: string;
  fard: string;
  witr: string;
  nafl: string;
  preFard: string;
  postFard: string;
  rakatTotal: string;
  rakatSequence: string;
  sunnahAndConfig: string;
  hideDetails: string;
  sunnahBreakdown: string;
  jamaatMode: string;
  plusMinutes: string;
  fixedTime: string;
  minutesAfterAzan: string;
  fixedMasjidJamaat: string;
  azanCalibration: string;
  checkFixedTime: string;
  chimePlayed: string;
  fastingNaflTitle: string;
  sehriEnds: string;
  sehriSub: string;
  iftarTitle: string;
  iftarSub: string;
  ishraqChasht: string;
  ishraqSub: string;
  dahwaKubra: string;
  dahwaSub: string;
  tahajjudTitle: string;
  tahajjudSub: string;
  makruhTitle: string;
  makruhSub: string;
  makruhSunriseTitle: string;
  makruhSunriseDesc: string;
  makruhZawalTitle: string;
  makruhZawalDesc: string;
  makruhSunsetTitle: string;
  makruhSunsetDesc: string;
}

const PRAYER_UI: Record<LangCode, PrayerUiStrings> = {
  en: {
    solarHorizon: "Solar & Prayer Horizon",
    useLiveGps: "Live GPS & Timezone",
    locatingGps: "Detecting GPS…",
    changeLocationTz: "Location & Timezone",
    closeLocationTz: "Close Location Panel",
    enableAlerts: "Azan Alerts",
    alertsActive: "Alerts On",
    locationStudioTitle: "World Timezones & City Finder",
    locationStudioSub: "Select from 400+ official IANA timezones, search any city worldwide, or detect via GPS.",
    detectGpsBtn: "Auto-Detect via GPS",
    ianaZonesLabel: "IANA World Timezones",
    filterTzPlaceholder: "Filter timezone or city…",
    citySearchLabel: "Worldwide City Search",
    searchCityPlaceholder: "Search city (Bareilly, Madinah, Istanbul)…",
    searchingCities: "Searching cities…",
    typeTwoChars: "Type at least 2 letters to search cities with automatic timezone.",
    exactCoordsLabel: "Custom Coordinates",
    applyCoordsBtn: "Apply Coordinates",
    qiblaCompassTitle: "Qibla Compass",
    distanceToMakkah: "Distance to Makkah",
    liveCompass: "Live Compass",
    liveCompassOn: "Sensor Active",
    calibrate: "Calibrate",
    trueNorth: "True North",
    magneticNorth: "Magnetic North",
    declination: "Declination",
    qiblaAligned: "Aligned with Qibla",
    turnRight: "Right",
    turnLeft: "Left",
    heading: "Heading",
    snapToQibla: "Align to Qibla",
    northZero: "North (0°)",
    sensorInteractive: "Interactive dial — drag or enable live sensor",
    sensorActive: "Live compass & spirit level active",
    sensorUnavailable: "Hardware sensor unavailable — use interactive dial",
    sensorDenied: "Sensor permission denied — use interactive dial",
    sensorListening: "Sensor active — gently wave device in a figure-8",
    calibrationTitle: "Compass & Level Calibration",
    figure8Title: "Figure-8 Motion Calibration",
    figure8Desc: "Gently move your phone in a smooth figure-8 away from magnetic cases or metal mounts.",
    figure8Verified: "Compass Calibrated",
    recordPass: "Record Calibration Step",
    tiltTrimTitle: "Flat Level & Offset Trim",
    compassTrim: "Bearing Trim (-30° to +30°)",
    sunAzimuth: "Sun Azimuth",
    resetTrim: "Reset",
    done: "Done",
    weatherAqi: "Weather & Air Quality",
    localConditions: "Local atmospheric conditions in",
    feelsLike: "Feels like",
    wind: "Wind",
    humidity: "Humidity",
    pressure: "Pressure",
    uvIndex: "UV Index",
    cloud: "Cloud",
    particulates: "Particulates (μg/m³)",
    ozone: "Ozone",
    dust: "Dust",
    syncingWeather: "Updating weather…",
    scheduleTitle: "Hanafi 5 Daily Prayers",
    scheduleSub: "Log your daily Salah or expand any prayer to customize Azan & Masjid Jamaat times",
    prayedToday: "Completed",
    namazGuide: "Prayer Guide",
    today: "Today",
    prevDay: "Previous Day",
    nextDay: "Next Day",
    withJamaat: "With Jamaat",
    onTime: "On Time",
    qaza: "Qaza",
    sunnah: "Sunnah",
    sunnahMuakkadah: "Sunnah Mu'akkadah",
    sunnahGhayr: "Sunnah Ghayr Mu'akkadah",
    fard: "Fard",
    witr: "Witr",
    nafl: "Nafl",
    preFard: "Pre-Fard",
    postFard: "Post-Fard",
    rakatTotal: "Rak'at",
    rakatSequence: "Rak'at Sequence",
    sunnahAndConfig: "Sunnah & Timings",
    hideDetails: "Hide Details",
    sunnahBreakdown: "Hanafi Rak'at & Sunnah Guide",
    jamaatMode: "Jamaat Mode",
    plusMinutes: "+Minutes",
    fixedTime: "Fixed Time",
    minutesAfterAzan: "Minutes After Azan",
    fixedMasjidJamaat: "Masjid Jamaat Time",
    azanCalibration: "Azan Adjust (±Min)",
    checkFixedTime: "Check Fixed Time",
    chimePlayed: "Salawat & Azan chime played",
    fastingNaflTitle: "Fasting & Nafl Windows",
    sehriEnds: "Sehri Ends (Subh Sadiq)",
    sehriSub: "Complete Suhoor before Fajr enters",
    iftarTitle: "Iftar (Maghrib)",
    iftarSub: "Sunnah to break fast with dates and water",
    ishraqChasht: "Ishraq & Chasht (Duha)",
    ishraqSub: "2 to 12 Rak'at Nafl after post-sunrise window",
    dahwaKubra: "Dahwa-e-Kubra (Shar'i Midday)",
    dahwaSub: "Hanafi Ramadan fasting intention cutoff",
    tahajjudTitle: "Tahajjud (Last Third of Night)",
    tahajjudSub: "Blessed pre-dawn vigil until Fajr",
    makruhTitle: "3 Makruh Tahrimi Windows",
    makruhSub: "Under Sunni Hanafi fiqh, no Fard, Wajib, Nafl, or Qaza prayer is offered during these three solar transitions:",
    makruhSunriseTitle: "Tulu-e-Aftab (Sunrise)",
    makruhSunriseDesc: "Prayer and Sajda-e-Tilawat are prohibited for 20 minutes after sunrise.",
    makruhZawalTitle: "Istiwa / Zawal (Solar Zenith)",
    makruhZawalDesc: "Midday zenith window just before Dhuhr begins.",
    makruhSunsetTitle: "Ghurub-e-Aftab (Sunset)",
    makruhSunsetDesc: "20 minutes before sunset (only that day's Asr may be offered if delayed).",
  },
  ur: {
    solarHorizon: "افقِ آفتاب و اوقاتِ نماز",
    useLiveGps: "لائیو جی پی ایس اور وقت",
    locatingGps: "مقام تلاش ہو رہا ہے…",
    changeLocationTz: "شہر اور ٹائم زون",
    closeLocationTz: "مقام پینل بند کریں",
    enableAlerts: "اذان یاد دہانی",
    alertsActive: "یاد دہانی فعال",
    locationStudioTitle: "عالمی ٹائم زونز اور شہر تلاش کریں",
    locationStudioSub: "۴۰۰ سے زائد عالمی ٹائم زونز، دنیا کا کوئی بھی شہر منتخب کریں یا جی پی ایس استعمال کریں۔",
    detectGpsBtn: "جی پی ایس سے مقام معلوم کریں",
    ianaZonesLabel: "عالمی ٹائم زونز",
    filterTzPlaceholder: "ٹائم زون یا شہر تلاش کریں…",
    citySearchLabel: "عالمی شہر تلاش کریں",
    searchCityPlaceholder: "شہر لکھیں (مثلاً بریلی، مدینہ، کراچی)…",
    searchingCities: "تلاش جاری ہے…",
    typeTwoChars: "خودکار وقت اور مقام کے لیے کم از کم ۲ حروف لکھیں۔",
    exactCoordsLabel: "درست عرض و طول بلد",
    applyCoordsBtn: "نقاط محفوظ کریں",
    qiblaCompassTitle: "سمتِ قبلہ کمپاس",
    distanceToMakkah: "مکہ مکرمہ سے فاصلہ",
    liveCompass: "لائیو کمپاس",
    liveCompassOn: "سینسر فعال",
    calibrate: "درستگی",
    trueNorth: "حقیقی شمال",
    magneticNorth: "مقناطیسی شمال",
    declination: "زاویہ انحراف",
    qiblaAligned: "سمتِ قبلہ درست ہے",
    turnRight: "دائیں مڑیں",
    turnLeft: "بائیں مڑیں",
    heading: "رخ",
    snapToQibla: "قبلہ رخ کریں",
    northZero: "شمال (0°)",
    sensorInteractive: "ڈائل گھمائیں یا لائیو سینسر فعال کریں",
    sensorActive: "لائیو مقناطیسی کمپاس اور سطح پیما فعال ہے",
    sensorUnavailable: "سینسر دستیاب نہیں — نیچے ڈائل استعمال کریں",
    sensorDenied: "سینسر اجازت نہیں ملی — ڈائل استعمال کریں",
    sensorListening: "سینسر فعال — فون کو ۸ کے نشان میں ہلائیں",
    calibrationTitle: "کمپاس اور ہموار سطح کی درستگی",
    figure8Title: "آٹھ (8) کی حرکت سے درستگی",
    figure8Desc: "میگنیٹک کور یا دھات سے دور رکھ کر فون کو نرمی سے ۸ کے انداز میں گھمائیں۔",
    figure8Verified: "کمپاس کی تصدیق مکمل",
    recordPass: "درستگی مرحلہ درج کریں",
    tiltTrimTitle: "ہموار سطح اور زاویہ ایڈجسٹمنٹ",
    compassTrim: "زاویہ تصحیح (-30° تا +30°)",
    sunAzimuth: "سمتِ آفتاب",
    resetTrim: "صفر کریں",
    done: "مکمل",
    weatherAqi: "موسم اور معیارِ ہوا",
    localConditions: "مقامی فضا اور موسم:",
    feelsLike: "محسوس درجہ حرارت",
    wind: "ہوا",
    humidity: "نمی",
    pressure: "ہوا کا دباؤ",
    uvIndex: "یو وی انڈیکس",
    cloud: "ابر",
    particulates: "فضائی ذرات (μg/m³)",
    ozone: "اوزون",
    dust: "گرد و غبار",
    syncingWeather: "موسم اپڈیٹ ہو رہا ہے…",
    scheduleTitle: "پنجگانہ حنفی اوقاتِ نماز",
    scheduleSub: "نماز کی ادائیگی درج کریں یا اذان و جماعت کا وقت ترتیب دینے کے لیے کسی بھی نماز پر کلک کریں",
    prayedToday: "مکمل",
    namazGuide: "طریقۂ نماز",
    today: "آج",
    prevDay: "پچھلا دن",
    nextDay: "اگلا دن",
    withJamaat: "باجماعت",
    onTime: "بروقت",
    qaza: "قضا",
    sunnah: "سنت",
    sunnahMuakkadah: "سنتِ مؤکدہ",
    sunnahGhayr: "سنتِ غیر مؤکدہ",
    fard: "فرض",
    witr: "وتر واجب",
    nafl: "نفل",
    preFard: "قبل از فرض",
    postFard: "بعد از فرض",
    rakatTotal: "رکعات",
    rakatSequence: "ترتیبِ رکعات",
    sunnahAndConfig: "سنن و ترتیبات",
    hideDetails: "تفصیل چھپائیں",
    sunnahBreakdown: "حنفی رکعات، سنن و نوافل کی تفصیل",
    jamaatMode: "طریقۂ جماعت",
    plusMinutes: "+منٹ بعد",
    fixedTime: "مقررہ وقت",
    minutesAfterAzan: "اذان کے بعد منٹ",
    fixedMasjidJamaat: "مسجد کا مقررہ وقتِ جماعت",
    azanCalibration: "اذان تدوین (±منٹ)",
    checkFixedTime: "وقتِ جماعت چیک کریں",
    chimePlayed: "درود و اذان کی ہلکی گھنٹی بجائی گئی",
    fastingNaflTitle: "سحری، افطار اور نوافل کے اوقات",
    sehriEnds: "ختمِ سحری (صبح صادق)",
    sehriSub: "فجر شروع ہونے سے پہلے سحری مکمل کریں",
    iftarTitle: "وقتِ افطار (مغرب)",
    iftarSub: "کھجور اور پانی سے افطار کرنا سنت ہے",
    ishraqChasht: "اشراق اور چاشت (ضحیٰ)",
    ishraqSub: "طلوع کے ۲۰ منٹ بعد ۲ تا ۱۲ رکعت نفل",
    dahwaKubra: "ضحوۂ کبریٰ (نصف النہار شرعی)",
    dahwaSub: "فقہِ حنفی میں روزے کی نیت کی آخری حد",
    tahajjudTitle: "تہجد (تہائی شبِ آخر)",
    tahajjudSub: "صبح صادق سے قبل بیداری اور مناجات کا بابرکت وقت",
    makruhTitle: "تین مکروہ تحریمی اوقات (ممنوعہ اوقات)",
    makruhSub: "فقہِ حنفی کے مطابق ان تین اوقات میں کوئی فرض، واجب، نفل یا قضا نماز جائز نہیں:",
    makruhSunriseTitle: "طلوعِ آفتاب",
    makruhSunriseDesc: "سورج نکلنے سے لے کر ۲۰ منٹ بعد تک نماز اور سجدۂ تلاوت مکروہِ تحریمی ہے۔",
    makruhZawalTitle: "استواء / زوالِ آفتاب",
    makruhZawalDesc: "ظہر کا وقت شروع ہونے سے قبل نصف النہار کا وقت۔",
    makruhSunsetTitle: "غروبِ آفتاب",
    makruhSunsetDesc: "غروب سے ۲۰ منٹ قبل (صرف اسی دن کی عصر بوجہ مجبوری پڑھی جا سکتی ہے)۔",
  },
  ar: {
    solarHorizon: "أفق الشمس ومواقيت الصلاة",
    useLiveGps: "تحديد الموقع تلقائياً",
    locatingGps: "جارٍ تحديد الموقع…",
    changeLocationTz: "الموقع والمنطقة الزمنية",
    closeLocationTz: "إغلاق لوحة الموقع",
    enableAlerts: "تنبيهات الأذان",
    alertsActive: "التنبيهات مفعلة",
    locationStudioTitle: "المناطق الزمنية والمدن العالمية",
    locationStudioSub: "اختر من بين أكثر من ٤٠٠ منطقة زمنية أو ابحث عن أي مدينة في العالم أو استخدم GPS.",
    detectGpsBtn: "تحديد موقعي عبر GPS",
    ianaZonesLabel: "المناطق الزمنية العالمية",
    filterTzPlaceholder: "ابحث عن منطقة زمنية أو مدينة…",
    citySearchLabel: "البحث في مدن العالم",
    searchCityPlaceholder: "ابحث عن مدينة (مكة، المدينة، القاهرة)…",
    searchingCities: "جارٍ البحث…",
    typeTwoChars: "اكتب حرفين على الأقل للبحث عن أي مدينة.",
    exactCoordsLabel: "إحداثيات مخصصة",
    applyCoordsBtn: "تطبيق الإحداثيات",
    qiblaCompassTitle: "بوصلة القبلة",
    distanceToMakkah: "المسافة إلى مكة المكرمة",
    liveCompass: "البوصلة المباشرة",
    liveCompassOn: "المستشعر نشط",
    calibrate: "معايرة",
    trueNorth: "الشمال الحقيقي",
    magneticNorth: "الشمال المغناطيسي",
    declination: "الميل المغناطيسي",
    qiblaAligned: "باتجاه القبلة تماماً",
    turnRight: "يميناً",
    turnLeft: "يساراً",
    heading: "الاتجاه",
    snapToQibla: "محاذاة للقبلة",
    northZero: "الشمال (0°)",
    sensorInteractive: "حرك القرص أو فعّل المستشعر المباشر",
    sensorActive: "مستشعر البوصلة وميزان الاستواء نشط",
    sensorUnavailable: "المستشعر غير متاح — استخدم القرص التفاعلي",
    sensorDenied: "تم رفض الإذن — استخدم القرص التفاعلي",
    sensorListening: "المستشعر نشط — حرك الهاتف على شكل رقم 8",
    calibrationTitle: "معايرة البوصلة وميزان السطح",
    figure8Title: "معايرة بحركة الرقم 8",
    figure8Desc: "حرك الهاتف بلطف على شكل رقم 8 بعيداً عن الأغطية المغناطيسية أو المعادن.",
    figure8Verified: "تمت معايرة البوصلة",
    recordPass: "تسجيل خطوة المعايرة",
    tiltTrimTitle: "استواء السطح وتعديل الزاوية",
    compassTrim: "تعديل الزاوية (-30° إلى +30°)",
    sunAzimuth: "سمت الشمس",
    resetTrim: "إعادة ضبط",
    done: "تم",
    weatherAqi: "الطقس وجودة الهواء",
    localConditions: "الأحوال الجوية المحلية في",
    feelsLike: "الشعور الفعلي",
    wind: "الرياح",
    humidity: "الرطوبة",
    pressure: "الضغط الجوي",
    uvIndex: "مؤشر الأشعة UV",
    cloud: "الغيوم",
    particulates: "الجسيمات الدقيقة (μg/m³)",
    ozone: "الأوزون",
    dust: "الغبار",
    syncingWeather: "جارٍ تحديث الطقس…",
    scheduleTitle: "الصلوات الخمس على المذهب الحنفي",
    scheduleSub: "سجل صلواتك اليومية أو اضغط على أي صلاة لضبط الأذان ووقت الإقامة",
    prayedToday: "مكتمل",
    namazGuide: "صفة الصلاة",
    today: "اليوم",
    prevDay: "اليوم السابق",
    nextDay: "اليوم التالي",
    withJamaat: "مع الجماعة",
    onTime: "في الوقت",
    qaza: "قضاء",
    sunnah: "سنة",
    sunnahMuakkadah: "سنة مؤكدة",
    sunnahGhayr: "سنة غير مؤكدة",
    fard: "فرض",
    witr: "الوتر",
    nafl: "نفل",
    preFard: "قبل الفرض",
    postFard: "بعد الفرض",
    rakatTotal: "ركعات",
    rakatSequence: "ترتيب الركعات",
    sunnahAndConfig: "السنن والإعدادات",
    hideDetails: "إخفاء التفاصيل",
    sunnahBreakdown: "تفصيل الركعات والسنن الرواتب",
    jamaatMode: "نظام الإقامة",
    plusMinutes: "+دقائق",
    fixedTime: "وقت ثابت",
    minutesAfterAzan: "دقائق بعد الأذان",
    fixedMasjidJamaat: "وقت إقامة المسجد",
    azanCalibration: "ضبط الأذان (±دقيقة)",
    checkFixedTime: "تحقق من وقت الإقامة",
    chimePlayed: "تم تشغيل تنبيه الصلاة على النبي ﷺ والأذان",
    fastingNaflTitle: "أوقات الصيام والنوافل",
    sehriEnds: "انتهاء السحور (الفجر الصادق)",
    sehriSub: "الإمساك قبل دخول وقت الفجر",
    iftarTitle: "الإفطار (المغرب)",
    iftarSub: "يُسن الفطر على رطبات أو تمرات أو ماء",
    ishraqChasht: "الإشراق والضحى",
    ishraqSub: "من ركعتين إلى ١٢ ركعة بعد ارتفاع الشمس",
    dahwaKubra: "الضحوة الكبرى",
    dahwaSub: "آخر وقت لنية صيام رمضان عند الحنفية",
    tahajjudTitle: "التهجد (الثلث الأخير من الليل)",
    tahajjudSub: "أفضل أوقات قيام الليل والدعاء حتى الفجر",
    makruhTitle: "أوقات الكراهة التحريمية الثلاثة",
    makruhSub: "في الفقه الحنفي لا تصح صلاة الفرض أو الواجب أو النفل أو القضاء في هذه الأوقات الثلاثة:",
    makruhSunriseTitle: "طلوع الشمس",
    makruhSunriseDesc: "تحرم الصلاة وسجدة التلاوة من شروق الشمس حتى ترتفع (نحو ٢٠ دقيقة).",
    makruhZawalTitle: "الاستواء (قبيل الزوال)",
    makruhZawalDesc: "عند استواء الشمس في كبد السماء قبيل دخول الظهر.",
    makruhSunsetTitle: "اصفرار الشمس والغروب",
    makruhSunsetDesc: "قبل الغروب بنحو ٢٠ دقيقة (إلا عصر يومه فيؤدى مع الكراهة).",
  },
  ro_ur: {
    solarHorizon: "Aftab aur Auqat-e-Namaz Ufaq",
    useLiveGps: "Live GPS & Timezone",
    locatingGps: "GPS talash ho raha hai…",
    changeLocationTz: "Shehar & Timezone",
    closeLocationTz: "Location Panel Band Karein",
    enableAlerts: "Azan Alerts",
    alertsActive: "Alerts On",
    locationStudioTitle: "World Timezones & Shehar Talash",
    locationStudioSub: "400+ IANA timezones chunein, koi bhi shehar search karein ya GPS istemal karein.",
    detectGpsBtn: "GPS se Shehar Chunein",
    ianaZonesLabel: "IANA World Timezones",
    filterTzPlaceholder: "Timezone ya shehar likhein…",
    citySearchLabel: "Duniya Bhar Ke Shehar",
    searchCityPlaceholder: "Shehar likhein (Bareilly, Madinah, Karachi)…",
    searchingCities: "Shehar talash ho rahe hain…",
    typeTwoChars: "Shehar dhoondhne ke liye kam az kam 2 huroof likhein.",
    exactCoordsLabel: "Exact Coordinates",
    applyCoordsBtn: "Coordinates Lagayein",
    qiblaCompassTitle: "Qibla Compass",
    distanceToMakkah: "Makkah Mukarramah ka Fasla",
    liveCompass: "Live Compass",
    liveCompassOn: "Sensor Fa'al",
    calibrate: "Calibrate",
    trueNorth: "Asli Shumal",
    magneticNorth: "Magnetic Shumal",
    declination: "Jhukao",
    qiblaAligned: "Qibla Rukh Durust",
    turnRight: "Dayein",
    turnLeft: "Bayein",
    heading: "Rukh",
    snapToQibla: "Qibla Rukh Karein",
    northZero: "Shumal (0°)",
    sensorInteractive: "Dial ghumayein ya Live Sensor on karein",
    sensorActive: "Live compass aur spirit level fa'al hai",
    sensorUnavailable: "Sensor dastiyab nahi — niche dial istemal karein",
    sensorDenied: "Permission nahi mili — dial istemal karein",
    sensorListening: "Sensor fa'al — phone ko 8 ke nishan mein ghumayein",
    calibrationTitle: "Compass & Level Calibration",
    figure8Title: "Figure-8 Calibration",
    figure8Desc: "Magnetic cover se door rakh kar phone ko narmi se 8 ki shakal mein ghumayein.",
    figure8Verified: "Compass Verified",
    recordPass: "Calibration Darj Karein",
    tiltTrimTitle: "Flat Surface & Offset Trim",
    compassTrim: "Compass Trim (-30° se +30°)",
    sunAzimuth: "Suraj ki Simt",
    resetTrim: "Reset",
    done: "Mukammal",
    weatherAqi: "Mausam aur Hawa ka Mayar",
    localConditions: "Maqami mausam:",
    feelsLike: "Mehsoos",
    wind: "Hawa",
    humidity: "Nami",
    pressure: "Dabao",
    uvIndex: "UV Index",
    cloud: "Badal",
    particulates: "Fiza ke Zarrat (μg/m³)",
    ozone: "Ozone",
    dust: "Gard",
    syncingWeather: "Mausam update ho raha hai…",
    scheduleTitle: "Hanafi Panjgana Auqat-e-Namaz",
    scheduleSub: "Apni namaz darj karein ya Azan o Jamaat waqt set karne ke liye kisi bhi namaz ko kholein",
    prayedToday: "Ada Shuda",
    namazGuide: "Tariqa-e-Namaz",
    today: "Aaj",
    prevDay: "Pichla Din",
    nextDay: "Agla Din",
    withJamaat: "Ba-Jamaat",
    onTime: "Waqt Par",
    qaza: "Qaza",
    sunnah: "Sunnat",
    sunnahMuakkadah: "Sunnat-e-Mu'akkadah",
    sunnahGhayr: "Sunnat Ghayr Mu'akkadah",
    fard: "Farz",
    witr: "Witr Wajib",
    nafl: "Nafl",
    preFard: "Pehle",
    postFard: "Baad",
    rakatTotal: "Rakaat",
    rakatSequence: "Tarteeb-e-Rakaat",
    sunnahAndConfig: "Sunnat & Waqt",
    hideDetails: "Chhupayein",
    sunnahBreakdown: "Hanafi Rakaat aur Sunnat Tafseel",
    jamaatMode: "Jamaat Tariqa",
    plusMinutes: "+Minutes",
    fixedTime: "Muqarrar Waqt",
    minutesAfterAzan: "Azan ke baad minutes",
    fixedMasjidJamaat: "Masjid Jamaat Waqt",
    azanCalibration: "Azan Farq (±Min)",
    checkFixedTime: "Jamaat Waqt Dekhein",
    chimePlayed: "Durood o Azan chime bajayi gayi",
    fastingNaflTitle: "Roza aur Nawafil Auqat",
    sehriEnds: "Khatm-e-Sehri (Subh Sadiq)",
    sehriSub: "Fajr se pehle sehri mukammal karein",
    iftarTitle: "Iftar (Maghrib)",
    iftarSub: "Khajoor aur pani se iftar karna sunnat hai",
    ishraqChasht: "Ishraq & Chasht (Duha)",
    ishraqSub: "Tulu ke 20 min baad 2 se 12 rakaat nafl",
    dahwaKubra: "Dahwa-e-Kubra (Shar'i Dopehar)",
    dahwaSub: "Hanafi fiqh mein Ramazan niyyat ka aakhri waqt",
    tahajjudTitle: "Tahajjud (Raat ka Aakhri Tihai)",
    tahajjudSub: "Subh Sadiq tak ibadat ka mubarak waqt",
    makruhTitle: "3 Makruh Tahrimi Auqat",
    makruhSub: "Sunni Hanafi fiqh mein in teen auqat mein koi Farz, Wajib, Nafl ya Qaza namaz jayez nahi:",
    makruhSunriseTitle: "Tulu-e-Aftab (Sunrise)",
    makruhSunriseDesc: "Suraj nikalne se 20 minute baad tak namaz aur sajda-e-tilawat mana hai.",
    makruhZawalTitle: "Istiwa / Zawal",
    makruhZawalDesc: "Zuhr shuru hone se chand minute pehle dopehar ka zawal.",
    makruhSunsetTitle: "Ghurub-e-Aftab (Sunset)",
    makruhSunsetDesc: "Ghurub se 20 minute pehle (sirf usi din ki Asr majboori mein parhi ja sakti hai).",
  },
  hi: {
    solarHorizon: "सूर्य पथ व नमाज़ समय",
    useLiveGps: "लाइव GPS व समय क्षेत्र",
    locatingGps: "GPS खोजा जा रहा है…",
    changeLocationTz: "स्थान व समय क्षेत्र",
    closeLocationTz: "स्थान पैनल बंद करें",
    enableAlerts: "अज़ान अलर्ट",
    alertsActive: "अलर्ट चालू",
    locationStudioTitle: "विश्व समय क्षेत्र व शहर खोज",
    locationStudioSub: "400+ आधिकारिक समय क्षेत्रों में से चुनें, कोई भी शहर खोजें, या लाइव GPS उपयोग करें।",
    detectGpsBtn: "GPS से स्थान पहचानें",
    ianaZonesLabel: "IANA विश्व समय क्षेत्र",
    filterTzPlaceholder: "समय क्षेत्र या शहर खोजें…",
    citySearchLabel: "विश्वव्यापी शहर खोज",
    searchCityPlaceholder: "शहर खोजें (बरेली, अजमेर, मदीना)…",
    searchingCities: "शहर खोजे जा रहे हैं…",
    typeTwoChars: "शहर खोजने के लिए कम से कम 2 अक्षर लिखें।",
    exactCoordsLabel: "सटीक निर्देशांक",
    applyCoordsBtn: "निर्देशांक लागू करें",
    qiblaCompassTitle: "क़िबला कंपास",
    distanceToMakkah: "मक्का मुकर्रमा की दूरी",
    liveCompass: "लाइव कंपास",
    liveCompassOn: "सेंसर सक्रिय",
    calibrate: "कैलिब्रेट",
    trueNorth: "वास्तविक उत्तर",
    magneticNorth: "चुंबकीय उत्तर",
    declination: "झुकाव",
    qiblaAligned: "क़िबला दिशा सटीक",
    turnRight: "दाएं",
    turnLeft: "बाएं",
    heading: "दिशा",
    snapToQibla: "क़िबला पर सेट करें",
    northZero: "उत्तर (0°)",
    sensorInteractive: "डायल घुमाएं या लाइव सेंसर चालू करें",
    sensorActive: "लाइव कंपास और स्पिरिट लेवल सक्रिय",
    sensorUnavailable: "सेंसर उपलब्ध नहीं — नीचे डायल उपयोग करें",
    sensorDenied: "अनुमति अस्वीकृत — नीचे डायल उपयोग करें",
    sensorListening: "सेंसर सक्रिय — फ़ोन को 8 के आकार में घुमाएं",
    calibrationTitle: "कंपास व समतल अंशांकन",
    figure8Title: "आकृति-8 गति अंशांकन",
    figure8Desc: "चुंबकीय कवर या धातु से दूर रखकर फ़ोन को धीरे से 8 के आकार में घुमाएं।",
    figure8Verified: "कंपास सत्यापित",
    recordPass: "कैलिब्रेशन चरण दर्ज करें",
    tiltTrimTitle: "समतल स्तर व कोण समायोजन",
    compassTrim: "कोण समायोजन (-30° से +30°)",
    sunAzimuth: "सूर्य दिशा",
    resetTrim: "रीसेट",
    done: "पूर्ण",
    weatherAqi: "मौसम व वायु गुणवत्ता",
    localConditions: "स्थानीय मौसम:",
    feelsLike: "महसूस तापमान",
    wind: "हवा",
    humidity: "नमी",
    pressure: "वायुदाब",
    uvIndex: "यूवी सूचकांक",
    cloud: "बादल",
    particulates: "सूक्ष्म कण (μg/m³)",
    ozone: "ओज़ोन",
    dust: "धूल",
    syncingWeather: "मौसम अपडेट हो रहा है…",
    scheduleTitle: "हनफ़ी पांच दैनिक नमाज़ें",
    scheduleSub: "अपनी नमाज़ दर्ज करें या अज़ान व जमाअत समय बदलने के लिए किसी भी पंक्ति को खोलें",
    prayedToday: "पूर्ण",
    namazGuide: "नमाज़ का तरीक़ा",
    today: "आज",
    prevDay: "पिछला दिन",
    nextDay: "अगला दिन",
    withJamaat: "जमाअत के साथ",
    onTime: "समय पर",
    qaza: "क़ज़ा",
    sunnah: "सुन्नत",
    sunnahMuakkadah: "सुन्नत मुअक्कदा",
    sunnahGhayr: "सुन्नत ग़ैर मुअक्कदा",
    fard: "फ़र्ज़",
    witr: "वित्र",
    nafl: "नफ़्ल",
    preFard: "फ़र्ज़ से पहले",
    postFard: "फ़र्ज़ के बाद",
    rakatTotal: "रकात",
    rakatSequence: "रकात क्रम",
    sunnahAndConfig: "सुन्नत व समय",
    hideDetails: "विवरण छुपाएं",
    sunnahBreakdown: "हनफ़ी रकात व सुन्नत विवरण",
    jamaatMode: "जमाअत मोड",
    plusMinutes: "+मिनट",
    fixedTime: "निश्चित समय",
    minutesAfterAzan: "अज़ान के बाद मिनट",
    fixedMasjidJamaat: "मस्जिद जमाअत समय",
    azanCalibration: "अज़ान समायोजन (±मिनट)",
    checkFixedTime: "जमाअत समय जांचें",
    chimePlayed: "दुरूद व अज़ान ध्वनि बजाई गई",
    fastingNaflTitle: "रोज़ा व नफ़्ल समय",
    sehriEnds: "सहरी समाप्त (सुबह सादिक़)",
    sehriSub: "फ़ज्र शुरू होने से पहले सहरी पूरी करें",
    iftarTitle: "इफ़्तार (मग़रिब)",
    iftarSub: "खजूर और पानी से इफ़्तार करना सुन्नत है",
    ishraqChasht: "इशराक़ व चाश्त (दुहा)",
    ishraqSub: "सूर्योदय के 20 मिनट बाद 2 से 12 रकात नफ़्ल",
    dahwaKubra: "दहवा-ए-कुबरा (शरई दोपहर)",
    dahwaSub: "हनफ़ी रमज़ान रोज़ा नियत की अंतिम सीमा",
    tahajjudTitle: "तहज्जुद (रात का अंतिम तिहाई)",
    tahajjudSub: "फ़ज्र से पहले इबादत का मुबारक समय",
    makruhTitle: "3 मकरूह तहरीमी समय",
    makruhSub: "सुन्नी हनफ़ी फ़िक़्ह में इन तीन समयों में कोई फ़र्ज़, वाजिब, नफ़्ल या क़ज़ा नमाज़ जायज़ नहीं:",
    makruhSunriseTitle: "तुलू-ए-आफ़ताब (सूर्योदय)",
    makruhSunriseDesc: "सूर्योदय से 20 मिनट बाद तक नमाज़ और सजदा-ए-तिलावत मकरूह है।",
    makruhZawalTitle: "इस्तिवा / ज़वाल",
    makruhZawalDesc: "ज़ुहर शुरू होने से ठीक पहले दोपहर का ज़वाल।",
    makruhSunsetTitle: "ग़ुरूब-ए-आफ़ताब (सूर्यास्त)",
    makruhSunsetDesc: "सूर्यास्त से 20 मिनट पहले (केवल उसी दिन की अस्र पढ़ी जा सकती है)।",
  },
  tr: {
    solarHorizon: "Güneş Ufku ve Vakitler",
    useLiveGps: "Canlı GPS ve Saat Dilimi",
    locatingGps: "Konum bulunuyor…",
    changeLocationTz: "Konum ve Saat Dilimi",
    closeLocationTz: "Konum Panelini Kapat",
    enableAlerts: "Ezan Bildirimi",
    alertsActive: "Bildirim Açık",
    locationStudioTitle: "Dünya Saat Dilimleri ve Şehir Arama",
    locationStudioSub: "400+ resmî saat diliminden seçin, dünya genelinde şehir arayın veya GPS kullanın.",
    detectGpsBtn: "GPS ile Otomatik Bul",
    ianaZonesLabel: "IANA Saat Dilimleri",
    filterTzPlaceholder: "Saat dilimi veya şehir filtrele…",
    citySearchLabel: "Dünya Şehir Araması",
    searchCityPlaceholder: "Şehir ara (İstanbul, Mekke, Medine)…",
    searchingCities: "Şehirler aranıyor…",
    typeTwoChars: "Şehir aramak için en az 2 harf yazın.",
    exactCoordsLabel: "Özel Koordinatlar",
    applyCoordsBtn: "Koordinatları Uygula",
    qiblaCompassTitle: "Kıble Pusulası",
    distanceToMakkah: "Mekke'ye Uzaklık",
    liveCompass: "Canlı Pusula",
    liveCompassOn: "Sensör Aktif",
    calibrate: "Kalibre Et",
    trueNorth: "Gerçek Kuzey",
    magneticNorth: "Manyetik Kuzey",
    declination: "Sapma Açısı",
    qiblaAligned: "Kıble Hizalandı",
    turnRight: "Sağa",
    turnLeft: "Sola",
    heading: "Yön",
    snapToQibla: "Kıbleye Hizala",
    northZero: "Kuzey (0°)",
    sensorInteractive: "Kadranı çevirin veya canlı sensörü açın",
    sensorActive: "Canlı pusula ve su terazisi aktif",
    sensorUnavailable: "Sensör bulunamadı — etkileşimli kadranı kullanın",
    sensorDenied: "Sensör izni reddedildi — kadranı kullanın",
    sensorListening: "Sensör aktif — telefonu 8 çizecek şekilde hareket ettirin",
    calibrationTitle: "Pusula ve Terazi Kalibrasyonu",
    figure8Title: "Sekiz (8) Hareketi Kalibrasyonu",
    figure8Desc: "Telefonu mıknatıslı kılıflardan uzak tutarak yumuşak bir 8 çizecek şekilde sallayın.",
    figure8Verified: "Pusula Doğrulandı",
    recordPass: "Kalibrasyon Adımı Kaydet",
    tiltTrimTitle: "Yüzey Eğimi ve Açı İnce Ayarı",
    compassTrim: "Açı Ayarı (-30° ile +30°)",
    sunAzimuth: "Güneş Azimutu",
    resetTrim: "Sıfırla",
    done: "Tamam",
    weatherAqi: "Hava Durumu ve Hava Kalitesi",
    localConditions: "Yerel atmosfer koşulları:",
    feelsLike: "Hissedilen",
    wind: "Rüzgâr",
    humidity: "Nem",
    pressure: "Basınç",
    uvIndex: "UV İndeksi",
    cloud: "Bulut",
    particulates: "Partiküller (μg/m³)",
    ozone: "Ozon",
    dust: "Toz",
    syncingWeather: "Hava durumu güncelleniyor…",
    scheduleTitle: "Hanefî 5 Vakit Namaz",
    scheduleSub: "Günlük namazlarınızı kaydedin veya ezan ve cemaat saatlerini özelleştirin",
    prayedToday: "Kılındı",
    namazGuide: "Namaz Rehberi",
    today: "Bugün",
    prevDay: "Önceki Gün",
    nextDay: "Sonraki Gün",
    withJamaat: "Cemaatle",
    onTime: "Vaktinde",
    qaza: "Kaza",
    sunnah: "Sünnet",
    sunnahMuakkadah: "Sünnet-i Müekkede",
    sunnahGhayr: "Sünnet-i Gayri Müekkede",
    fard: "Farz",
    witr: "Vitir",
    nafl: "Nafile",
    preFard: "İlk Sünnet",
    postFard: "Son Sünnet",
    rakatTotal: "Rekât",
    rakatSequence: "Rekât Sırası",
    sunnahAndConfig: "Sünnet ve Ayar",
    hideDetails: "Gizle",
    sunnahBreakdown: "Hanefî Rekât ve Sünnet Rehberi",
    jamaatMode: "Cemaat Modu",
    plusMinutes: "+Dakika",
    fixedTime: "Sabit Saat",
    minutesAfterAzan: "Ezandan Sonra Dakika",
    fixedMasjidJamaat: "Cami Cemaat Saati",
    azanCalibration: "Ezan Temkin (±Dk)",
    checkFixedTime: "Sabit Saati Kontrol Et",
    chimePlayed: "Salavat ve Ezan sesi dinletildi",
    fastingNaflTitle: "Oruç ve Nafile Vakitleri",
    sehriEnds: "İmsak (Sahur Sonu)",
    sehriSub: "Sabah vakti girmeden sahuru tamamlayın",
    iftarTitle: "İftar (Akşam)",
    iftarSub: "Hurma ve su ile iftar açmak sünnettir",
    ishraqChasht: "İşrak ve Kuşluk (Duha)",
    ishraqSub: "Güneş doğduktan 20 dk sonra 2–12 rekât nafile",
    dahwaKubra: "Dahve-i Kübrâ",
    dahwaSub: "Hanefî'de Ramazan orucu niyetinin son vakti",
    tahajjudTitle: "Teheccüd (Gecenin Son Üçte Biri)",
    tahajjudSub: "İmsak vaktine kadar mübarek gece ibadeti",
    makruhTitle: "3 Kerâhet Vakti (Tahrimen Mekruh)",
    makruhSub: "Hanefî fıkhına göre bu üç vakitte farz, vacip, nafile veya kaza namazı kılınmaz:",
    makruhSunriseTitle: "Güneşin Doğuşu (Tulû)",
    makruhSunriseDesc: "Güneş doğarken ve doğduktan sonraki 20 dakika boyunca namaz kılınmaz.",
    makruhZawalTitle: "İstivâ (Zeveâl Öncesi)",
    makruhZawalDesc: "Öğle vakti girmeden hemen önce güneşin tepe noktasında olduğu an.",
    makruhSunsetTitle: "Güneşin Batışı (Gurûb)",
    makruhSunsetDesc: "Akşamdan önceki 20 dakika (yalnızca o günün ikindi farzı kerâhetle kılınabilir).",
  },
  bn: {
    solarHorizon: "সূর্য দিগন্ত ও নামাজের ওয়াক্ত",
    useLiveGps: "লাইভ জিপিএস ও টাইমজোন",
    locatingGps: "জিপিএস খোঁজা হচ্ছে…",
    changeLocationTz: "অবস্থান ও টাইমজোন",
    closeLocationTz: "অবস্থান প্যানেল বন্ধ করুন",
    enableAlerts: "আজান অ্যালার্ট",
    alertsActive: "অ্যালার্ট চালু",
    locationStudioTitle: "বিশ্ব টাইমজোন ও শহর অনুসন্ধান",
    locationStudioSub: "৪০০+ টাইমজোন থেকে বেছে নিন, যেকোনো শহর খুঁজুন অথবা লাইভ জিপিএস ব্যবহার করুন।",
    detectGpsBtn: "জিপিএস দিয়ে শনাক্ত করুন",
    ianaZonesLabel: "বিশ্ব টাইমজোনসমূহ",
    filterTzPlaceholder: "টাইমজোন বা শহর খুঁজুন…",
    citySearchLabel: "বিশ্বব্যাপী শহর অনুসন্ধান",
    searchCityPlaceholder: "শহর লিখুন (ঢাকা, মদিনা, কলকাতা)…",
    searchingCities: "শহর খোঁজা হচ্ছে…",
    typeTwoChars: "শহর খুঁজতে কমপক্ষে ২টি অক্ষর লিখুন।",
    exactCoordsLabel: "নির্দিষ্ট স্থানাঙ্ক",
    applyCoordsBtn: "স্থানাঙ্ক প্রয়োগ করুন",
    qiblaCompassTitle: "কিবলা কম্পাস",
    distanceToMakkah: "মক্কা শরীফের দূরত্ব",
    liveCompass: "লাইভ কম্পাস",
    liveCompassOn: "সেন্সর সক্রিয়",
    calibrate: "ক্যালিব্রেট",
    trueNorth: "প্রকৃত উত্তর",
    magneticNorth: "চৌম্বক উত্তর",
    declination: "চ্যুতি কোণ",
    qiblaAligned: "কিবলামুখী সঠিক",
    turnRight: "ডানে",
    turnLeft: "বামে",
    heading: "দিক",
    snapToQibla: "কিবলায় মেলান",
    northZero: "উত্তর (0°)",
    sensorInteractive: "ডায়াল ঘোরান বা লাইভ সেন্সর চালু করুন",
    sensorActive: "লাইভ কম্পাস ও স্পিরিট লেভেল সক্রিয়",
    sensorUnavailable: "সেন্সর নেই — নিচের ডায়াল ব্যবহার করুন",
    sensorDenied: "অনুমতি মেলেনি — ডায়াল ব্যবহার করুন",
    sensorListening: "সেন্সর সক্রিয় — ফোনটি ৮ আকারে ঘোরান",
    calibrationTitle: "কম্পাস ও সমতল ক্যালিব্রেশন",
    figure8Title: "ফিগার-৮ ক্যালিব্রেশন",
    figure8Desc: "চৌম্বক কভার বা ধাতু থেকে দূরে রেখে ফোনটি আলতোভাবে ৮ আকারে ঘোরান।",
    figure8Verified: "কম্পাস যাচাইকৃত",
    recordPass: "ক্যালিব্রেশন ধাপ সম্পন্ন",
    tiltTrimTitle: "সমতল ও কোণ সমন্বয়",
    compassTrim: "কোণ সমন্বয় (-30° থেকে +30°)",
    sunAzimuth: "সূর্যের দিক",
    resetTrim: "রিসেট",
    done: "সম্পন্ন",
    weatherAqi: "আবহাওয়া ও বায়ুর মান",
    localConditions: "স্থানীয় আবহাওয়া:",
    feelsLike: "অনুভূত তাপমাত্রা",
    wind: "বাতাস",
    humidity: "আর্দ্রতা",
    pressure: "বায়ুচাপ",
    uvIndex: "ইউভি সূচক",
    cloud: "মেঘ",
    particulates: "বায়ুকণা (μg/m³)",
    ozone: "ওজোন",
    dust: "ধূলিকণা",
    syncingWeather: "আবহাওয়া আপডেট হচ্ছে…",
    scheduleTitle: "হানাফি পাঁচ ওয়াক্ত নামাজ",
    scheduleSub: "আপনার নামাজ নথিভুক্ত করুন অথবা আজান ও জামাতের সময় সমন্বয় করতে যেকোনো সারিতে ক্লিক করুন",
    prayedToday: "সম্পন্ন",
    namazGuide: "নামাজ শিক্ষা",
    today: "আজ",
    prevDay: "আগের দিন",
    nextDay: "পরের দিন",
    withJamaat: "জামাতে",
    onTime: "সময়মতো",
    qaza: "কাযা",
    sunnah: "সুন্নাত",
    sunnahMuakkadah: "সুন্নাতে মুয়াক্কাদা",
    sunnahGhayr: "সুন্নাতে গায়রে মুয়াক্কাদা",
    fard: "ফরজ",
    witr: "বিতর",
    nafl: "নফল",
    preFard: "ফরজের পূর্বে",
    postFard: "ফরজের পরে",
    rakatTotal: "রাকাত",
    rakatSequence: "রাকাতের ক্রম",
    sunnahAndConfig: "সুন্নাত ও সময়",
    hideDetails: "লুকান",
    sunnahBreakdown: "হানাফি রাকাত ও সুন্নাত বিবরণ",
    jamaatMode: "জামাত মোড",
    plusMinutes: "+মিনিট",
    fixedTime: "নির্দিষ্ট সময়",
    minutesAfterAzan: "আজানের পর মিনিট",
    fixedMasjidJamaat: "মসজিদের জামাত সময়",
    azanCalibration: "আজান সমন্বয় (±মিনিট)",
    checkFixedTime: "জামাতের সময় দেখুন",
    chimePlayed: "দরুদ ও আজানের মৃদু ধ্বনি বাজানো হয়েছে",
    fastingNaflTitle: "রোজা ও নফল নামাজের সময়",
    sehriEnds: "সেহরি শেষ (সুবহে সাদিক)",
    sehriSub: "ফজর শুরুর আগেই সেহরি শেষ করুন",
    iftarTitle: "ইফতার (মাগরিব)",
    iftarSub: "খেজুর ও পানি দিয়ে ইফতার করা সুন্নাত",
    ishraqChasht: "ইশরাক ও চাশত (দুহা)",
    ishraqSub: "সূর্যোদয়ের ২০ মিনিট পর ২ থেকে ১২ রাকাত নফল",
    dahwaKubra: "দাহওয়ায়ে কুবরা (শরয়ি দুপুর)",
    dahwaSub: "হানাফি ফিকহে রমজানের নিয়তের শেষ সময়",
    tahajjudTitle: "তাহাজ্জুদ (রাতের শেষ তৃতীয়াংশ)",
    tahajjudSub: "ফজরের পূর্ব পর্যন্ত বরকতময় নফল ইবাদত",
    makruhTitle: "৩টি মাকরুহে তাহরিমি সময়",
    makruhSub: "সুন্নি হানাফি ফিকহ অনুযায়ী এই তিনটি সময়ে কোনো ফরজ, ওয়াজিব, নফল বা কাযা নামাজ আদায় শুদ্ধ নয়:",
    makruhSunriseTitle: "সূর্যোদয় কাল",
    makruhSunriseDesc: "সূর্যোদয়ের পর ২০ মিনিট পর্যন্ত নামাজ ও সিজদায়ে তিলাওয়াত নিষিদ্ধ।",
    makruhZawalTitle: "ইস্তিওয়া / যাওয়াল (দ্বিপ্রহর)",
    makruhZawalDesc: "যোহরের ওয়াক্ত শুরু হওয়ার ঠিক আগের মধ্যাকাশের সময়।",
    makruhSunsetTitle: "সূর্যাস্তের পূর্বক্ষণ",
    makruhSunsetDesc: "সূর্যাস্তের ২০ মিনিট পূর্ব থেকে (কেবল ঐ দিনের আসর অনন্যোপায় হলে পড়া যায়)।",
  },
  fa: {
    solarHorizon: "افق خورشید و اوقات نماز",
    useLiveGps: "مکان‌یاب زنده و منطقه زمانی",
    locatingGps: "در حال مکان‌یابی…",
    changeLocationTz: "مکان و منطقه زمانی",
    closeLocationTz: "بستن پنل مکان",
    enableAlerts: "اعلان اذان",
    alertsActive: "اعلان فعال",
    locationStudioTitle: "مناطق زمانی جهان و جستجوی شهر",
    locationStudioSub: "از میان بیش از ۴۰۰ منطقه زمانی انتخاب کنید، هر شهری را بجویید یا از GPS استفاده کنید.",
    detectGpsBtn: "تشخیص خودکار با GPS",
    ianaZonesLabel: "مناطق زمانی جهان",
    filterTzPlaceholder: "جستجوی منطقه زمانی یا شهر…",
    citySearchLabel: "جستجوی شهرهای جهان",
    searchCityPlaceholder: "نام شهر (تهران، هرات، مدینه)…",
    searchingCities: "در حال جستجو…",
    typeTwoChars: "حداقل ۲ حرف برای جستجوی شهر وارد کنید.",
    exactCoordsLabel: "مختصات دقیق",
    applyCoordsBtn: "اعمال مختصات",
    qiblaCompassTitle: "قطب‌نمای قبله",
    distanceToMakkah: "فاصله تا مکه مکرمه",
    liveCompass: "قطب‌نمای زنده",
    liveCompassOn: "حسگر فعال",
    calibrate: "کالیبره",
    trueNorth: "شمال حقیقی",
    magneticNorth: "شمال مغناطیسی",
    declination: "انحراف مغناطیسی",
    qiblaAligned: "هم‌راستا با قبله",
    turnRight: "راست",
    turnLeft: "چپ",
    heading: "جهت",
    snapToQibla: "تنظیم روی قبله",
    northZero: "شمال (0°)",
    sensorInteractive: "صفحه را بچرخانید یا حسگر زنده را فعال کنید",
    sensorActive: "قطب‌نمای زنده و تراز سطح فعال است",
    sensorUnavailable: "حسگر در دسترس نیست — از صفحه تعاملی استفاده کنید",
    sensorDenied: "مجوز حسگر رد شد — از صفحه تعاملی استفاده کنید",
    sensorListening: "حسگر فعال — گوشی را به شکل ۸ حرکت دهید",
    calibrationTitle: "کالیبراسیون قطب‌نما و تراز سطح",
    figure8Title: "کالیبراسیون با حرکت ۸ انگلیسی",
    figure8Desc: "گوشی را دور از قاب‌های آهنربایی به نرمی به شکل ∞ حرکت دهید.",
    figure8Verified: "قطب‌نما کالیبره شد",
    recordPass: "ثبت مرحله کالیبره",
    tiltTrimTitle: "تراز افقی و تنظیم زاویه",
    compassTrim: "اصلاح زاویه (-30° تا +30°)",
    sunAzimuth: "سمت خورشید",
    resetTrim: "بازنشانی",
    done: "تأیید",
    weatherAqi: "آب‌وهوا و کیفیت هوا",
    localConditions: "شرایط جوی محلی در",
    feelsLike: "دمای محسوس",
    wind: "باد",
    humidity: "رطوبت",
    pressure: "فشار هوا",
    uvIndex: "شاخص UV",
    cloud: "ابر",
    particulates: "ذرات معلق (μg/m³)",
    ozone: "ازن",
    dust: "گردوغبار",
    syncingWeather: "در حال بروزرسانی آب‌وهوا…",
    scheduleTitle: "نمازهای پنج‌گانه حنفی",
    scheduleSub: "نمازهای روزانه خود را ثبت کنید یا برای تنظیم اذان و جماعت روی هر ردیف بزنید",
    prayedToday: "انجام شده",
    namazGuide: "آموزش نماز",
    today: "امروز",
    prevDay: "روز قبل",
    nextDay: "روز بعد",
    withJamaat: "با جماعت",
    onTime: "در وقت",
    qaza: "قضا",
    sunnah: "سنت",
    sunnahMuakkadah: "سنت مؤکده",
    sunnahGhayr: "سنت غیر مؤکده",
    fard: "فرض",
    witr: "وتر",
    nafl: "نفل",
    preFard: "پیش از فرض",
    postFard: "پس از فرض",
    rakatTotal: "رکعت",
    rakatSequence: "ترتیب رکعات",
    sunnahAndConfig: "سنن و تنظیمات",
    hideDetails: "بستن جزئیات",
    sunnahBreakdown: "راهنمای رکعات و سنت‌های حنفی",
    jamaatMode: "حالت جماعت",
    plusMinutes: "+دقیقه",
    fixedTime: "ساعت ثابت",
    minutesAfterAzan: "دقیقه پس از اذان",
    fixedMasjidJamaat: "ساعت جماعت مسجد",
    azanCalibration: "تنظیم اذان (±دقیقه)",
    checkFixedTime: "بررسی زمان جماعت",
    chimePlayed: "زنگ ملایم صلوات و اذان پخش شد",
    fastingNaflTitle: "اوقات روزه و نوافل",
    sehriEnds: "پایان سحری (صبح صادق)",
    sehriSub: "پیش از ورود فجر سحری را به پایان برسانید",
    iftarTitle: "افطار (مغرب)",
    iftarSub: "افطار با خرما و آب سنت نبوی است",
    ishraqChasht: "اشراق و چاشت (ضحی)",
    ishraqSub: "۲ تا ۱۲ رکعت نفل پس از بالا آمدن خورشید",
    dahwaKubra: "ضحوه کبری (نیمروز شرعی)",
    dahwaSub: "آخرین مهلت نیت روزه رمضان در فقه حنفی",
    tahajjudTitle: "تهجد (ثلث آخر شب)",
    tahajjudSub: "زمان پربرکت شب‌زنده‌داری تا پیش از فجر",
    makruhTitle: "سه وقت مکروه تحریمی",
    makruhSub: "در فقه حنفی خواندن هیچ نماز فرض، واجب، نفل یا قضا در این سه زمان صحیح نیست:",
    makruhSunriseTitle: "طلوع آفتاب",
    makruhSunriseDesc: "از آغاز طلوع تا ۲۰ دقیقه پس از آن نماز و سجده تلاوت ممنوع است.",
    makruhZawalTitle: "استواء / زوال خورشید",
    makruhZawalDesc: "هنگام قرار گرفتن خورشید در میانه آسمان پیش از اذان ظهر.",
    makruhSunsetTitle: "غروب آفتاب",
    makruhSunsetDesc: "۲۰ دقیقه پیش از غروب (تنها عصر همان روز با کراهت ادا می‌شود).",
  },
  id: {
    solarHorizon: "Cakrawala Surya & Waktu Shalat",
    useLiveGps: "GPS & Zona Waktu",
    locatingGps: "Mendeteksi GPS…",
    changeLocationTz: "Lokasi & Zona Waktu",
    closeLocationTz: "Tutup Panel Lokasi",
    enableAlerts: "Notifikasi Adzan",
    alertsActive: "Notifikasi Aktif",
    locationStudioTitle: "Zona Waktu Dunia & Pencarian Kota",
    locationStudioSub: "Pilih dari 400+ zona waktu resmi IANA, cari kota di seluruh dunia, atau gunakan GPS.",
    detectGpsBtn: "Deteksi Otomatis via GPS",
    ianaZonesLabel: "Zona Waktu Dunia IANA",
    filterTzPlaceholder: "Cari zona waktu atau kota…",
    citySearchLabel: "Pencarian Kota Dunia",
    searchCityPlaceholder: "Cari kota (Jakarta, Madinah, Surabaya)…",
    searchingCities: "Mencari kota…",
    typeTwoChars: "Ketik minimal 2 huruf untuk mencari kota.",
    exactCoordsLabel: "Koordinat Khusus",
    applyCoordsBtn: "Terapkan Koordinat",
    qiblaCompassTitle: "Kompas Kiblat",
    distanceToMakkah: "Jarak ke Makkah",
    liveCompass: "Kompas Langsung",
    liveCompassOn: "Sensor Aktif",
    calibrate: "Kalibrasi",
    trueNorth: "Utara Sejati",
    magneticNorth: "Utara Magnetik",
    declination: "Deklinasi",
    qiblaAligned: "Tepat Arah Kiblat",
    turnRight: "Kanan",
    turnLeft: "Kiri",
    heading: "Arah",
    snapToQibla: "Arahkan ke Kiblat",
    northZero: "Utara (0°)",
    sensorInteractive: "Putar dial atau aktifkan sensor langsung",
    sensorActive: "Kompas langsung & nivo datar aktif",
    sensorUnavailable: "Sensor tidak tersedia — gunakan dial interaktif",
    sensorDenied: "Izin sensor ditolak — gunakan dial interaktif",
    sensorListening: "Sensor aktif — gerakkan ponsel membentuk angka 8",
    calibrationTitle: "Kalibrasi Kompas & Nivo",
    figure8Title: "Kalibrasi Gerakan Angka 8",
    figure8Desc: "Gerakkan ponsel perlahan membentuk angka 8 jauh dari casing magnetik atau logam.",
    figure8Verified: "Kompas Terkalibrasi",
    recordPass: "Catat Langkah Kalibrasi",
    tiltTrimTitle: "Kemiringan & Koreksi Sudut",
    compassTrim: "Koreksi Sudut (-30° s/d +30°)",
    sunAzimuth: "Azimut Matahari",
    resetTrim: "Atur Ulang",
    done: "Selesai",
    weatherAqi: "Cuaca & Kualitas Udara",
    localConditions: "Kondisi atmosfer lokal di",
    feelsLike: "Terasa seperti",
    wind: "Angin",
    humidity: "Kelembapan",
    pressure: "Tekanan",
    uvIndex: "Indeks UV",
    cloud: "Awan",
    particulates: "Partikulat (μg/m³)",
    ozone: "Ozon",
    dust: "Debu",
    syncingWeather: "Memperbarui cuaca…",
    scheduleTitle: "Shalat 5 Waktu Hanafi",
    scheduleSub: "Catat shalat harian Anda atau buka baris shalat untuk mengatur waktu Adzan & Jamaah",
    prayedToday: "Selesai",
    namazGuide: "Panduan Shalat",
    today: "Hari Ini",
    prevDay: "Hari Sebelumnya",
    nextDay: "Hari Berikutnya",
    withJamaat: "Berjamaah",
    onTime: "Tepat Waktu",
    qaza: "Qadha",
    sunnah: "Sunnah",
    sunnahMuakkadah: "Sunnah Muakkadah",
    sunnahGhayr: "Sunnah Ghairu Muakkadah",
    fard: "Fardhu",
    witr: "Witir",
    nafl: "Nafilah",
    preFard: "Qabliyah",
    postFard: "Ba'diyah",
    rakatTotal: "Rakaat",
    rakatSequence: "Urutan Rakaat",
    sunnahAndConfig: "Sunnah & Waktu",
    hideDetails: "Tutup Detail",
    sunnahBreakdown: "Rincian Rakaat & Sunnah Hanafi",
    jamaatMode: "Mode Jamaah",
    plusMinutes: "+Menit",
    fixedTime: "Waktu Tetap",
    minutesAfterAzan: "Menit Setelah Adzan",
    fixedMasjidJamaat: "Waktu Jamaah Masjid",
    azanCalibration: "Koreksi Adzan (±Mnt)",
    checkFixedTime: "Periksa Waktu Jamaah",
    chimePlayed: "Nada lembut Shalawat & Adzan diputar",
    fastingNaflTitle: "Waktu Puasa & Shalat Sunnah",
    sehriEnds: "Batas Sahur (Subuh)",
    sehriSub: "Selesaikan sahur sebelum masuk waktu Subuh",
    iftarTitle: "Buka Puasa (Maghrib)",
    iftarSub: "Disunnahkan berbuka dengan kurma dan air",
    ishraqChasht: "Isyraq & Dhuha",
    ishraqSub: "2 hingga 12 rakaat setelah lewat waktu terbit",
    dahwaKubra: "Dahwah Kubra (Tengah Hari Syar'i)",
    dahwaSub: "Batas niat puasa Ramadhan dalam fiqih Hanafi",
    tahajjudTitle: "Tahajud (Sepertiga Malam Terakhir)",
    tahajjudSub: "Waktu mustajab ibadah malam hingga Subuh",
    makruhTitle: "3 Waktu Terlarang (Makruh Tahrimi)",
    makruhSub: "Menurut fiqih Sunni Hanafi, shalat Fardhu, Wajib, Sunnah, maupun Qadha tidak sah pada tiga waktu ini:",
    makruhSunriseTitle: "Terbit Matahari (Syuruq)",
    makruhSunriseDesc: "Shalat dan sujud tilawah dilarang selama 20 menit sejak matahari terbit.",
    makruhZawalTitle: "Istiwa / Zawal (Kulminasi)",
    makruhZawalDesc: "Saat matahari tepat di atas kepala sesaat sebelum masuk Dzuhur.",
    makruhSunsetTitle: "Menjelang Terbenam (Ghurub)",
    makruhSunsetDesc: "20 menit sebelum matahari terbenam (kecuali Ashar hari itu jika belum ditunaikan).",
  },
  fr: {
    solarHorizon: "Horizon Solaire & Prières",
    useLiveGps: "GPS & Fuseau Horaire",
    locatingGps: "Localisation GPS…",
    changeLocationTz: "Lieu & Fuseau Horaire",
    closeLocationTz: "Fermer le Panneau",
    enableAlerts: "Alertes Adhan",
    alertsActive: "Alertes Activées",
    locationStudioTitle: "Fuseaux Horaires & Recherche de Ville",
    locationStudioSub: "Choisissez parmi plus de 400 fuseaux IANA, recherchez une ville ou utilisez le GPS.",
    detectGpsBtn: "Détecter via GPS",
    ianaZonesLabel: "Fuseaux Horaires IANA",
    filterTzPlaceholder: "Filtrer un fuseau ou une ville…",
    citySearchLabel: "Recherche Mondiale de Villes",
    searchCityPlaceholder: "Rechercher une ville (Paris, Médine, Casablanca)…",
    searchingCities: "Recherche en cours…",
    typeTwoChars: "Saisissez au moins 2 lettres pour rechercher une ville.",
    exactCoordsLabel: "Coordonnées Exactes",
    applyCoordsBtn: "Appliquer",
    qiblaCompassTitle: "Boussole Qibla",
    distanceToMakkah: "Distance vers La Mecque",
    liveCompass: "Boussole Directe",
    liveCompassOn: "Capteur Actif",
    calibrate: "Calibrer",
    trueNorth: "Nord Vrai",
    magneticNorth: "Nord Magnétique",
    declination: "Déclinaison",
    qiblaAligned: "Aligné sur la Qibla",
    turnRight: "Droite",
    turnLeft: "Gauche",
    heading: "Cap",
    snapToQibla: "Aligner sur la Qibla",
    northZero: "Nord (0°)",
    sensorInteractive: "Tournez le cadran ou activez le capteur en direct",
    sensorActive: "Boussole en direct et niveau à bulle actifs",
    sensorUnavailable: "Capteur indisponible — utilisez le cadran interactif",
    sensorDenied: "Permission refusée — utilisez le cadran interactif",
    sensorListening: "Capteur actif — décrivez un 8 avec l'appareil",
    calibrationTitle: "Calibration Boussole & Niveau",
    figure8Title: "Calibration par Mouvement en 8",
    figure8Desc: "Déplacez doucement votre téléphone en formant un 8 loin des étuis magnétiques.",
    figure8Verified: "Boussole Calibrée",
    recordPass: "Valider l'Étape",
    tiltTrimTitle: "Niveau Plat & Ajustement",
    compassTrim: "Ajustement d'Angle (-30° à +30°)",
    sunAzimuth: "Azimut Solaire",
    resetTrim: "Réinitialiser",
    done: "Terminé",
    weatherAqi: "Météo & Qualité de l'Air",
    localConditions: "Conditions atmosphériques à",
    feelsLike: "Ressenti",
    wind: "Vent",
    humidity: "Humidité",
    pressure: "Pression",
    uvIndex: "Indice UV",
    cloud: "Nuages",
    particulates: "Particules (μg/m³)",
    ozone: "Ozone",
    dust: "Poussière",
    syncingWeather: "Mise à jour météo…",
    scheduleTitle: "Les 5 Prières Quotidiennes (Hanafite)",
    scheduleSub: "Notez vos prières du jour ou ouvrez une ligne pour ajuster l'Adhan et la Jamaat",
    prayedToday: "Accompli",
    namazGuide: "Guide de Prière",
    today: "Aujourd'hui",
    prevDay: "Jour Précédent",
    nextDay: "Jour Suivant",
    withJamaat: "En Groupe",
    onTime: "À l'Heure",
    qaza: "Qada",
    sunnah: "Sunna",
    sunnahMuakkadah: "Sunna Mou'akkada",
    sunnahGhayr: "Sunna Non-Mou'akkada",
    fard: "Fard",
    witr: "Witr",
    nafl: "Nafl",
    preFard: "Avant Fard",
    postFard: "Après Fard",
    rakatTotal: "Rak'at",
    rakatSequence: "Séquence des Rak'at",
    sunnahAndConfig: "Sunna & Horaires",
    hideDetails: "Masquer",
    sunnahBreakdown: "Détail des Rak'at & Sunnas Hanafites",
    jamaatMode: "Mode Jamaat",
    plusMinutes: "+Minutes",
    fixedTime: "Heure Fixe",
    minutesAfterAzan: "Minutes Après l'Adhan",
    fixedMasjidJamaat: "Heure Fixe Mosquée",
    azanCalibration: "Ajustement Adhan (±Min)",
    checkFixedTime: "Vérifier l'Heure Fixe",
    chimePlayed: "Carillon doux Salawat & Adhan joué",
    fastingNaflTitle: "Jeûne & Prières Surérogatoires",
    sehriEnds: "Fin du Suhoor (Subh Sadiq)",
    sehriSub: "Terminez le repas avant l'entrée du Fajr",
    iftarTitle: "Iftar (Maghrib)",
    iftarSub: "Rompre le jeûne avec des dattes et de l'eau",
    ishraqChasht: "Ishraq & Duha",
    ishraqSub: "2 à 12 Rak'at Nafl après le lever complet du soleil",
    dahwaKubra: "Dahwa-e-Kubra (Midi Légal)",
    dahwaSub: "Limite d'intention du jeûne de Ramadan (Hanafite)",
    tahajjudTitle: "Tahajjud (Dernier Tiers de la Nuit)",
    tahajjudSub: "Veillée nocturne bénie avant l'aube",
    makruhTitle: "3 Fenêtres Interdites (Makruh Tahrimi)",
    makruhSub: "Selon le fiqh sunnite hanafite, aucune prière Fard, Wajib, Nafl ou Qada n'est valide durant ces trois transitions :",
    makruhSunriseTitle: "Lever du Soleil (Chourouq)",
    makruhSunriseDesc: "Prière et prosternation de récitation interdites pendant 20 minutes après le lever.",
    makruhZawalTitle: "Zénith Solaire (Istiwa)",
    makruhZawalDesc: "Passage du soleil au méridien juste avant l'entrée du Dhuhr.",
    makruhSunsetTitle: "Coucher du Soleil (Ghouroub)",
    makruhSunsetDesc: "20 minutes avant le coucher (seul l'Asr du jour peut être rattrapé).",
  },
};

function degreesToCardinal(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const idx = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return dirs[idx];
}

function shortestAngleDiff(target: number, current: number): number {
  return ((target - current + 540) % 360) - 180;
}

function localizeRakatUnit(u: RakatUnit, ui: PrayerUiStrings): { shortLabel: string; typeLabel: string } {
  if (u.type === "Fard") {
    return { shortLabel: `${u.rakaat} ${ui.fard}`, typeLabel: ui.fard };
  }
  if (u.type === "Wajib Witr") {
    return { shortLabel: `${u.rakaat} ${ui.witr}`, typeLabel: ui.witr };
  }
  if (u.type === "Nafl") {
    return { shortLabel: `${u.rakaat} ${ui.nafl}`, typeLabel: ui.nafl };
  }
  const typeLabel = u.type === "Sunnah Mu'akkadah" ? ui.sunnahMuakkadah : ui.sunnahGhayr;
  const timingTag = u.timing === "Before Fard" ? ui.preFard : ui.postFard;
  return {
    shortLabel: `${u.rakaat} ${ui.sunnah} (${timingTag})`,
    typeLabel,
  };
}

export default function PrayerPage() {
  const {
    lang,
    now,
    hijri,
    city,
    setCity,
    setTimezone,
    requestGpsLocation,
    gpsLoading,
    gpsError,
    calcMethod,
    setCalcMethod,
    schedule: liveSchedule,
    prayerSettings,
    updatePrayerSetting,
    salahToday,
    logSalah,
    sunnahChecks,
    toggleSunnah,
    rings,
    weather,
    weatherLoading,
    weatherError,
    refreshWeather,
    qiblaCalibrationOffset,
    setQiblaCalibrationOffset,
  } = useApp();

  const ui = PRAYER_UI[lang] ?? PRAYER_UI.en;
  const { lat: cityLat, lng: cityLng, tz: cityTz } = city;

  // Interactive Date Scrubber (0 = Today, +/- days for any past/future date)
  const [dayOffset, setDayOffset] = useState<number>(0);

  // Temperature unit toggle (°C / °F)
  const [useFahrenheit, setUseFahrenheit] = useState<boolean>(false);

  // Expandable Location & Complete Timezone Studio panel
  const [showLocationStudio, setShowLocationStudio] = useState<boolean>(false);
  const [tzFilter, setTzFilter] = useState<string>("");
  const [geoQuery, setGeoQuery] = useState<string>("");
  const [geoResults, setGeoResults] = useState<GeocodedLocation[]>([]);
  const [geoSearching, setGeoSearching] = useState<boolean>(false);
  const [customLat, setCustomLat] = useState<string>("");
  const [customLng, setCustomLng] = useState<string>("");

  // Qibla Compass & Calibration Studio state
  const [sensorHeading, setSensorHeading] = useState<number | null>(null);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [sensorModeKey, setSensorModeKey] = useState<SensorStatusKey>("interactive");
  const [tiltBeta, setTiltBeta] = useState<number>(0);
  const [tiltGamma, setTiltGamma] = useState<number>(0);
  const [useMagneticNorth, setUseMagneticNorth] = useState<boolean>(false);
  const [showCalibrationModal, setShowCalibrationModal] = useState<boolean>(false);
  const [figure8Step, setFigure8Step] = useState<number>(0);
  const lastVibratedAlignedRef = useRef<boolean>(false);

  // Expandable Jamaat & Azan customization per prayer
  const [expandedPrayer, setExpandedPrayer] = useState<PrayerName | null>(null);

  // Audio Chime & Notification state
  const [chimeBannerLabel, setChimeBannerLabel] = useState<string | null>(null);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    Promise.resolve().then(() =>
      setNotifPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission)
    );
  }, []);

  // All 400+ IANA World Timezones
  const allTimezones = useMemo(() => getAllWorldTimezones(), []);
  const activeTimezone = useMemo(() => {
    if (cityTz) return cityTz;
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }, [cityTz]);

  const activeTzOffset = useMemo(
    () => getTimezoneOffsetInfo(activeTimezone, now),
    [activeTimezone, now]
  );

  const filteredTimezones = useMemo(() => {
    const q = tzFilter.trim().toLowerCase();
    if (!q) return allTimezones;
    return allTimezones.filter(
      (item) =>
        item.tz.toLowerCase().includes(q) ||
        item.cityLabel.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.utcOffsetLabel.toLowerCase().includes(q)
    );
  }, [allTimezones, tzFilter]);

  // Global City Geocoding Search (200k+ cities via Open-Meteo)
  useEffect(() => {
    const q = geoQuery.trim();
    if (q.length < 2) {
      Promise.resolve().then(() => setGeoResults([]));
      return;
    }
    let cancelled = false;
    Promise.resolve().then(() => setGeoSearching(true));
    const timer = setTimeout(() => {
      searchWorldLocations(q)
        .then((res) => {
          if (!cancelled) setGeoResults(res);
        })
        .catch(() => {
          if (!cancelled) setGeoResults([]);
        })
        .finally(() => {
          if (!cancelled) setGeoSearching(false);
        });
    }, 260);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [geoQuery]);

  const selectedDate = useMemo(() => {
    if (dayOffset === 0) return now;
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [now, dayOffset]);

  const schedule = useMemo(() => {
    if (dayOffset === 0) return liveSchedule;
    return computeHanafiSchedule(
      cityLat,
      cityLng,
      selectedDate,
      calcMethod,
      prayerSettings,
      activeTimezone
    );
  }, [dayOffset, liveSchedule, selectedDate, cityLat, cityLng, calcMethod, prayerSettings, activeTimezone]);

  // Real Geodesic Distance, Magnetic Declination, and Solar Position
  const kaabaDistanceKm = useMemo(
    () => getKaabaDistanceKm(cityLat, cityLng),
    [cityLat, cityLng]
  );
  const kaabaDistanceMiles = useMemo(
    () => Math.round(kaabaDistanceKm * 0.621371),
    [kaabaDistanceKm]
  );
  const magneticDeclination = useMemo(
    () => getMagneticDeclinationDeg(cityLat, cityLng),
    [cityLat, cityLng]
  );
  const solarPosition = useMemo(
    () => getSolarPosition(cityLat, cityLng, now),
    [cityLat, cityLng, now]
  );

  const qiblaBaseBearing = schedule.qiblaBearing;
  const effectiveQiblaBearing = useMemo(() => {
    if (!useMagneticNorth) return qiblaBaseBearing;
    return Number(((qiblaBaseBearing - magneticDeclination + 360) % 360).toFixed(1));
  }, [qiblaBaseBearing, useMagneticNorth, magneticDeclination]);

  const rawHeading = sensorActive && sensorHeading !== null ? sensorHeading : manualHeading;
  const currentHeading = useMemo(
    () => Number(((rawHeading + qiblaCalibrationOffset + 360) % 360).toFixed(1)),
    [rawHeading, qiblaCalibrationOffset]
  );

  const qiblaDelta = useMemo(
    () => shortestAngleDiff(effectiveQiblaBearing, currentHeading),
    [effectiveQiblaBearing, currentHeading]
  );
  const isQiblaAligned = Math.abs(qiblaDelta) <= 3.5;
  const isDeviceTilted = Math.hypot(tiltBeta, tiltGamma) > 15;

  // Gentle haptic vibration when locking onto Qibla within ±3.5°
  useEffect(() => {
    if (isQiblaAligned && !lastVibratedAlignedRef.current) {
      lastVibratedAlignedRef.current = true;
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(30);
        } catch {
          // ignore
        }
      }
    } else if (!isQiblaAligned) {
      lastVibratedAlignedRef.current = false;
    }
  }, [isQiblaAligned]);

  // Hardware Magnetometer / DeviceOrientation listener
  useEffect(() => {
    if (!sensorActive || typeof window === "undefined") return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const webkitHeading = (event as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      let heading: number | null = null;

      if (typeof webkitHeading === "number" && !Number.isNaN(webkitHeading)) {
        heading = webkitHeading;
      } else if (typeof event.alpha === "number" && !Number.isNaN(event.alpha)) {
        heading = (360 - event.alpha) % 360;
      }

      if (heading !== null) {
        setSensorHeading(Number(heading.toFixed(1)));
      }
      if (typeof event.beta === "number") {
        setTiltBeta(Number(Math.max(-45, Math.min(45, event.beta)).toFixed(1)));
      }
      if (typeof event.gamma === "number") {
        setTiltGamma(Number(Math.max(-45, Math.min(45, event.gamma)).toFixed(1)));
      }
    };

    const win = window as Window;
    win.addEventListener("deviceorientationabsolute", handleOrientation as EventListener, true);
    win.addEventListener("deviceorientation", handleOrientation as EventListener, true);

    return () => {
      win.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener, true);
      win.removeEventListener("deviceorientation", handleOrientation as EventListener, true);
    };
  }, [sensorActive]);

  const toggleLiveCompassSensor = async () => {
    if (sensorActive) {
      setSensorActive(false);
      setTiltBeta(0);
      setTiltGamma(0);
      setSensorModeKey("interactive");
      return;
    }

    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      setSensorModeKey("unavailable");
      return;
    }

    try {
      const DevOrient = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof DevOrient.requestPermission === "function") {
        const permission = await DevOrient.requestPermission();
        if (permission !== "granted") {
          setSensorModeKey("denied");
          return;
        }
      }
      setSensorActive(true);
      setSensorModeKey("active");
    } catch {
      setSensorActive(true);
      setSensorModeKey("listening");
    }
  };

  const playGentleChime = (label: string) => {
    setChimeBannerLabel(label);
    try {
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // ignore audio context block
    }
    setTimeout(() => setChimeBannerLabel(null), 2200);
  };

  const runFigure8CalibrationStep = () => {
    setFigure8Step((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        playGentleChime(ui.figure8Verified);
        return 3;
      }
      return next;
    });
  };

  // Solar / Lunar Sky Arc Progress Calculation (0% = Fajr, 100% = Isha)
  const skyArcMetrics = useMemo(() => {
    const fajrMs = schedule.rows[0].azanTime.getTime();
    const sunriseMs = schedule.sunrise.getTime();
    const maghribMs = schedule.rows[3].azanTime.getTime();
    const ishaMs = schedule.rows[4].azanTime.getTime();
    const nowMs = now.getTime();

    const isDaytime = nowMs >= sunriseMs && nowMs <= maghribMs;
    let progress = 0;
    if (nowMs <= fajrMs) {
      progress = 0.04;
    } else if (nowMs >= ishaMs) {
      progress = 0.96;
    } else {
      progress = (nowMs - fajrMs) / Math.max(1, ishaMs - fajrMs);
    }
    const clamped = Math.max(0.03, Math.min(0.97, progress));

    // Quadratic Bezier curve from (30, 118) via control (250, 14) to (470, 118)
    const u = clamped;
    const x = (1 - u) * (1 - u) * 30 + 2 * (1 - u) * u * 250 + u * u * 470;
    const y = (1 - u) * (1 - u) * 118 + 2 * (1 - u) * u * 14 + u * u * 118;

    return { progress: clamped, x, y, isDaytime };
  }, [schedule, now]);

  const formatTemp = (tempC: number) => {
    if (useFahrenheit) {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const usAqiVal = weather?.usAqi ?? null;
  const aqiMeta = useMemo(() => getAqiCategory(usAqiVal), [usAqiVal]);

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    try {
      const res = await Notification.requestPermission();
      setNotifPerm(res);
      if (res === "granted") playGentleChime(ui.alertsActive);
    } catch {
      // ignore
    }
  };

  const applyCustomCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(customLat);
    const lngNum = parseFloat(customLng);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return;
    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) return;
    setCity({
      id: `coords-${latNum.toFixed(4)}-${lngNum.toFixed(4)}`,
      name: `${latNum.toFixed(2)}°, ${lngNum.toFixed(2)}°`,
      country: activeTimezone,
      lat: Number(latNum.toFixed(5)),
      lng: Number(lngNum.toFixed(5)),
      tz: activeTimezone,
    });
    setShowLocationStudio(false);
  };

  const fmtTz = (d: Date) => formatTime(d, activeTimezone);
  const localizedHijriMonth = formatLocalizedHijriMonth(lang, hijri.month, hijri.monthName);
  const nextPrayerLocalized = localizePrayerName(lang, schedule.nextPrayer.label);

  const sensorStatusText =
    sensorModeKey === "active"
      ? ui.sensorActive
      : sensorModeKey === "unavailable"
      ? ui.sensorUnavailable
      : sensorModeKey === "denied"
      ? ui.sensorDenied
      : sensorModeKey === "listening"
      ? ui.sensorListening
      : ui.sensorInteractive;

  return (
    <div className="space-y-6">
      {/* 1. Lush Atmospheric Twilight Mosque & Solar Horizon Hero Card (Matching Reference Image 2) */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="twilight-hero-card p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Layered Twilight Sky, Luminous Moon Halo, Clouds & Mosque Horizon Artwork */}
        <svg
          aria-hidden="true"
          viewBox="0 0 600 230"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-0 w-full h-full"
        >
          <defs>
            <radialGradient id="prayerTwilightMoon" cx="76%" cy="28%" r="34%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.58" />
              <stop offset="45%" stopColor="#DF98FA" stopOpacity="0.22" />
              <stop offset="100%" stopColor="#1E1348" stopOpacity="0" />
            </radialGradient>
            <linearGradient id="prayerMosqueSilhouette" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#19103B" stopOpacity="0.65" />
              <stop offset="100%" stopColor="#070A1C" stopOpacity="0.92" />
            </linearGradient>
          </defs>
          <circle cx="456" cy="62" r="84" fill="url(#prayerTwilightMoon)" />
          <circle cx="456" cy="62" r="24" fill="#FFFDF7" opacity="0.86" />
          <circle cx="96" cy="36" r="1.5" fill="#FFFFFF" opacity="0.6" />
          <circle cx="174" cy="54" r="1.2" fill="#FFFFFF" opacity="0.45" />
          <circle cx="312" cy="28" r="1.6" fill="#FFFFFF" opacity="0.55" />
          <circle cx="536" cy="44" r="1.4" fill="#FFFFFF" opacity="0.5" />
          <path d="M40 96 Q74 78 108 94 Q138 82 168 98 Z" fill="#FFFFFF" opacity="0.08" />
          <path d="M368 88 Q402 72 436 86 Q468 74 498 90 Z" fill="#FFFFFF" opacity="0.1" />
          <path
            d="M0 230 L0 186 L44 186 L44 126 L50 102 L56 126 L56 186 L104 186 Q142 146 180 186 L232 186 L232 162 Q300 104 368 162 L368 186 L418 186 Q456 146 494 186 L544 186 L544 126 L550 102 L556 126 L556 186 L600 186 L600 230 Z"
            fill="url(#prayerMosqueSilhouette)"
          />
          <rect x="284" y="174" width="8" height="16" rx="4" fill="#F9B091" opacity="0.45" />
          <rect x="297" y="172" width="9" height="18" rx="4.5" fill="#F9B091" opacity="0.62" />
          <rect x="311" y="174" width="8" height="16" rx="4" fill="#F9B091" opacity="0.45" />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Start: Next Prayer Countdown, Hijri Date & Clean Location Pills */}
          <div className="space-y-2.5">
            <div className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold text-white/90">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/14 backdrop-blur-md">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {t(lang, "nextPrayer")} • {nextPrayerLocalized}
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-white/85">
                <Calendar className="w-3.5 h-3.5 text-purple-200" />
                <span>
                  {hijri.day} {localizedHijriMonth} {hijri.year} AH
                </span>
              </span>
            </div>

            <div className="flex items-baseline gap-3.5 flex-wrap pt-0.5">
              <div className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-white">
                {fmtTz(schedule.nextPrayer.jamaatTime)}
              </div>
              <div className="text-sm font-semibold text-amber-300 tabular-nums">
                {t(lang, "inTimePrefix")} {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-white/85">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                {city.name}, {city.country} • {t(lang, "azanTime")} {fmtTz(schedule.nextPrayer.azanTime)} •{" "}
                {activeTimezone} ({activeTzOffset.label})
              </span>
            </div>

            {/* Clean Action Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={requestGpsLocation}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-amber-400/20 hover:bg-amber-400/30 text-amber-100 border border-amber-300/30 transition cursor-pointer disabled:opacity-60"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                <span>{gpsLoading ? ui.locatingGps : ui.useLiveGps}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLocationStudio((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>{showLocationStudio ? ui.closeLocationTz : ui.changeLocationTz}</span>
              </button>

              <button
                type="button"
                onClick={enableNotifications}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-white/90 border border-white/15 transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notifPerm === "granted" ? ui.alertsActive : ui.enableAlerts}</span>
              </button>
            </div>

            {gpsError && (
              <p className="text-[11px] text-rose-200 bg-rose-950/50 border border-rose-400/30 rounded-lg px-2.5 py-1 inline-block">
                {gpsError}
              </p>
            )}
          </div>

          {/* End: Clean Solar & Lunar Horizon Arc */}
          <div className="w-full lg:w-[372px] bg-black/22 backdrop-blur-md rounded-2xl p-4 border border-white/15">
            <div className="flex items-center justify-between text-[11px] text-white/85 mb-1.5">
              <span className="font-semibold flex items-center gap-1.5">
                {skyArcMetrics.isDaytime ? (
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-purple-200" />
                )}
                <span>{ui.solarHorizon}</span>
              </span>
              <span className="tabular-nums text-amber-200 font-medium">
                {localizePrayerName(lang, "Sunrise")} {fmtTz(schedule.sunrise)}
              </span>
            </div>

            <svg viewBox="0 0 500 142" className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="skyArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9055FF" stopOpacity="0.45" />
                  <stop offset="50%" stopColor="#F4B860" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#DF98FA" stopOpacity="0.55" />
                </linearGradient>
              </defs>
              <line
                x1="20"
                y1="118"
                x2="480"
                y2="118"
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              <path
                d="M 30 118 Q 250 14 470 118"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="2.5"
                strokeDasharray="5 5"
              />
              <path
                d="M 30 118 Q 250 14 470 118"
                fill="none"
                stroke="url(#skyArcGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${Math.round(skyArcMetrics.progress * 100)} 100`}
              />
              {[
                { key: "Fajr", x: 30, y: 118 },
                { key: "Sunrise", x: 112, y: 79 },
                { key: "Dhuhr", x: 250, y: 66 },
                { key: "Asr", x: 355, y: 84 },
                { key: "Maghrib", x: 420, y: 103 },
                { key: "Isha", x: 470, y: 118 },
              ].map((pt) => (
                <g key={pt.key}>
                  <circle cx={pt.x} cy={pt.y} r="3.5" fill="#FFFFFF" fillOpacity="0.78" />
                  <text
                    x={pt.x}
                    y={136}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.82)"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {localizePrayerName(lang, pt.key)}
                  </text>
                </g>
              ))}
              <motion.g
                initial={false}
                animate={{ x: skyArcMetrics.x, y: skyArcMetrics.y }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r="12"
                  fill={skyArcMetrics.isDaytime ? "rgba(244, 184, 96, 0.3)" : "rgba(223, 152, 250, 0.3)"}
                />
                <circle
                  cx={0}
                  cy={0}
                  r="6"
                  fill={skyArcMetrics.isDaytime ? "#F4B860" : "#DF98FA"}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </motion.g>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Expandable World Timezone (400+ IANA Zones) & Global City/GPS Drawer */}
      <AnimatePresence>
        {showLocationStudio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card-surface p-5 space-y-5 border border-[var(--accent-gold)]/35">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-[var(--accent-gold)]" />
                    <span>{ui.locationStudioTitle}</span>
                  </h2>
                  <p className="text-xs text-[var(--text-muted)] mt-0.5">{ui.locationStudioSub}</p>
                </div>
                <button
                  type="button"
                  onClick={requestGpsLocation}
                  disabled={gpsLoading}
                  className="btn-primary px-3.5 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <LocateFixed className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                  <span>{gpsLoading ? ui.locatingGps : ui.detectGpsBtn}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Complete IANA Timezone Selector */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between gap-2">
                    <span>
                      {ui.ianaZonesLabel} ({allTimezones.length})
                    </span>
                    <span className="font-mono text-[11px] text-[var(--accent-gold)]">
                      {activeTzOffset.label}
                    </span>
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute start-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tzFilter}
                      onChange={(e) => setTzFilter(e.target.value)}
                      placeholder={ui.filterTzPlaceholder}
                      className="w-full ps-8 pe-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                  <select
                    aria-label={ui.ianaZonesLabel}
                    value={activeTimezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="ui-select w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                  >
                    {filteredTimezones.map((item) => (
                      <option key={item.tz} value={item.tz}>
                        ({item.utcOffsetLabel}) {item.tz} — {item.cityLabel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Column 2: Live Global City Geocoding Search */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                  <div className="text-xs font-bold text-[var(--text-primary)]">{ui.citySearchLabel}</div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute start-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={geoQuery}
                      onChange={(e) => setGeoQuery(e.target.value)}
                      placeholder={ui.searchCityPlaceholder}
                      className="w-full ps-8 pe-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {geoSearching && (
                      <div className="text-[11px] text-[var(--text-muted)] py-1">{ui.searchingCities}</div>
                    )}
                    {!geoSearching &&
                      geoResults.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => {
                            setCity({
                              id: loc.id,
                              name: loc.name,
                              country: loc.country,
                              lat: loc.lat,
                              lng: loc.lng,
                              tz: loc.tz,
                            });
                            setGeoQuery("");
                            setGeoResults([]);
                          }}
                          className="w-full text-start px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-card)] transition flex items-center justify-between text-xs cursor-pointer"
                        >
                          <span className="font-medium text-[var(--text-primary)] truncate">
                            {loc.name}
                            {loc.admin1 ? `, ${loc.admin1}` : ""} ({loc.country})
                          </span>
                          <span className="text-[10px] font-mono text-[var(--accent-gold)] shrink-0 ms-2">
                            {loc.tz}
                          </span>
                        </button>
                      ))}
                    {!geoSearching && geoQuery.trim().length < 2 && (
                      <div className="text-[11px] text-[var(--text-muted)]">{ui.typeTwoChars}</div>
                    )}
                  </div>
                </div>

                {/* Column 3: Exact GPS Coordinates Override */}
                <form
                  onSubmit={applyCustomCoordinates}
                  className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5"
                >
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    {ui.exactCoordsLabel} ({cityLat.toFixed(3)}°, {cityLng.toFixed(3)}°)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder={`Lat (${cityLat.toFixed(2)})`}
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder={`Lng (${cityLng.toFixed(2)})`}
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition cursor-pointer"
                  >
                    {ui.applyCoordsBtn}
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {chimeBannerLabel && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>
            {ui.chimePlayed}: {chimeBannerLabel}
          </span>
        </div>
      )}

      {/* 2. Interactive Qibla Compass + Live Weather & Air Quality Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Interactive Qibla Compass with Embedded Weather & AQI Hub */}
        <div className="lg:col-span-7 card-surface p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                <Compass className="w-4 h-4" />
                <span>{ui.qiblaCompassTitle}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {city.name} • {ui.distanceToMakkah}:{" "}
                <strong className="text-[var(--text-primary)] tabular-nums">
                  {kaabaDistanceKm.toLocaleString()} km ({kaabaDistanceMiles.toLocaleString()} mi)
                </strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleLiveCompassSensor}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                  sensorActive
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]"
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{sensorActive ? ui.liveCompassOn : ui.liveCompass}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCalibrationModal((v) => !v)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>
                  {ui.calibrate} (
                  {qiblaCalibrationOffset >= 0 ? `+${qiblaCalibrationOffset}°` : `${qiblaCalibrationOffset}°`})
                </span>
              </button>
            </div>
          </div>

          {/* True North vs Magnetic North & Alignment Status Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseMagneticNorth(false)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  !useMagneticNorth
                    ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {ui.trueNorth} ({schedule.qiblaBearing}°)
              </button>
              <button
                type="button"
                onClick={() => setUseMagneticNorth(true)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  useMagneticNorth
                    ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {ui.magneticNorth} ({effectiveQiblaBearing}°)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)] tabular-nums">
                {ui.declination}: {magneticDeclination >= 0 ? `+${magneticDeclination}°` : `${magneticDeclination}°`}
              </span>
              {isQiblaAligned ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>{ui.qiblaAligned}</span>
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] tabular-nums text-[11px] font-medium">
                  {qiblaDelta > 0 ? (
                    <>
                      <span>
                        {Math.abs(Math.round(qiblaDelta))}° {ui.turnRight}
                      </span>
                      <ArrowRight className="w-3 h-3" />
                    </>
                  ) : (
                    <>
                      <ArrowLeft className="w-3 h-3" />
                      <span>
                        {Math.abs(Math.round(qiblaDelta))}° {ui.turnLeft}
                      </span>
                    </>
                  )}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Animated Compass Dial + Embedded Weather & AQI Hub */}
          <div className="relative flex flex-col items-center justify-center py-2">
            <div className="mb-1 flex flex-col items-center">
              <div
                className={`text-[11px] font-bold tabular-nums px-2.5 py-0.5 rounded-full border ${
                  isQiblaAligned
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)]"
                }`}
              >
                {ui.heading} {currentHeading}° {degreesToCardinal(currentHeading)}
              </div>
              <div
                className={`w-0 h-0 border-x-[7px] border-b-[10px] border-x-transparent mt-1 ${
                  isQiblaAligned ? "border-b-emerald-400" : "border-b-[var(--accent-gold)]"
                }`}
              />
            </div>

            <div
              className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-shadow duration-500 ${
                isQiblaAligned
                  ? "shadow-[0_0_45px_rgba(52,211,153,0.35)] ring-2 ring-emerald-400/60"
                  : "shadow-[0_14px_34px_rgba(11,16,38,0.22)] ring-1 ring-[var(--border-subtle)]"
              }`}
              style={{
                background:
                  "radial-gradient(circle at center, var(--bg-elevated) 0%, var(--bg-card) 72%, rgba(144,85,255,0.12) 100%)",
              }}
            >
              <motion.svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                animate={{ rotate: -currentHeading }}
                transition={{ type: "spring", stiffness: 85, damping: 18 }}
              >
                <defs>
                  <linearGradient id="qiblaRayGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#9055FF" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#F4B860" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="112"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {Array.from({ length: 72 }).map((_, idx) => {
                  const deg = idx * 5;
                  const isMajor = deg % 30 === 0;
                  const isCardinal = deg % 90 === 0;
                  return (
                    <g key={deg} transform={`rotate(${deg} 150 150)`}>
                      <line
                        x1="150"
                        y1={isCardinal ? "10" : isMajor ? "12" : "14"}
                        x2="150"
                        y2={isCardinal ? "22" : isMajor ? "20" : "18"}
                        stroke={
                          deg === 0
                            ? "#F87171"
                            : isMajor
                            ? "var(--text-secondary)"
                            : "var(--text-muted)"
                        }
                        strokeWidth={isCardinal ? "2.5" : isMajor ? "1.5" : "1"}
                        strokeOpacity={isMajor ? "0.9" : "0.45"}
                      />
                    </g>
                  );
                })}

                {[
                  { label: "N", deg: 0, color: "#F87171" },
                  { label: "E", deg: 90, color: "var(--text-primary)" },
                  { label: "S", deg: 180, color: "var(--text-primary)" },
                  { label: "W", deg: 270, color: "var(--text-primary)" },
                ].map((c) => (
                  <g key={c.label} transform={`rotate(${c.deg} 150 150)`}>
                    <text
                      x="150"
                      y="36"
                      textAnchor="middle"
                      fill={c.color}
                      fontSize="13"
                      fontWeight="800"
                    >
                      {c.label}
                    </text>
                  </g>
                ))}

                {weather && (
                  <g transform={`rotate(${weather.windDirectionDeg} 150 150)`}>
                    <line
                      x1="150"
                      y1="42"
                      x2="150"
                      y2="72"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeDasharray="3 2"
                    />
                    <polygon points="150,76 145,66 155,66" fill="#38BDF8" />
                    <circle cx="150" cy="40" r="9" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth="1.2" />
                    <text x="150" y="43" textAnchor="middle" fill="#38BDF8" fontSize="7" fontWeight="700">
                      W
                    </text>
                  </g>
                )}

                <g transform={`rotate(${solarPosition.azimuthDeg} 150 150)`}>
                  <circle
                    cx="150"
                    cy="26"
                    r="8"
                    fill={solarPosition.altitudeDeg > 0 ? "rgba(251, 191, 36, 0.25)" : "rgba(148, 163, 184, 0.2)"}
                    stroke={solarPosition.altitudeDeg > 0 ? "#FBBF24" : "#94A3B8"}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="150"
                    cy="26"
                    r="3.5"
                    fill={solarPosition.altitudeDeg > 0 ? "#FBBF24" : "#94A3B8"}
                  />
                </g>

                <g transform={`rotate(${effectiveQiblaBearing} 150 150)`}>
                  <line
                    x1="150"
                    y1="150"
                    x2="150"
                    y2="28"
                    stroke="url(#qiblaRayGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <polygon
                    points="150,14 141,34 150,29 159,34"
                    fill={isQiblaAligned ? "#34D399" : "#F4B860"}
                  />
                  <g transform="translate(150, 52)">
                    <rect
                      x="-11"
                      y="-11"
                      width="22"
                      height="22"
                      rx="4"
                      fill="#121324"
                      stroke={isQiblaAligned ? "#34D399" : "#F4B860"}
                      strokeWidth="2"
                    />
                    <rect x="-10" y="-5" width="20" height="3.5" fill="#F4B860" />
                  </g>
                </g>
              </motion.svg>

              {/* Center Stationary Hub */}
              <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-[var(--bg-card)]/95 backdrop-blur-md border border-[var(--border-subtle)] shadow-inner flex flex-col items-center justify-center p-3 text-center">
                <motion.div
                  aria-hidden="true"
                  className={`w-3 h-3 rounded-full absolute pointer-events-none ${
                    isDeviceTilted ? "bg-rose-400/60" : "bg-emerald-400/35"
                  }`}
                  animate={{
                    x: Math.max(-28, Math.min(28, tiltGamma * 1.2)),
                    y: Math.max(-28, Math.min(28, tiltBeta * 1.2)),
                  }}
                />

                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  {t(lang, "qiblaBearing")}
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[var(--accent-gold)] leading-tight">
                  {effectiveQiblaBearing}°
                </div>
                <div className="text-[10px] font-semibold text-[var(--text-secondary)] tabular-nums">
                  {degreesToCardinal(effectiveQiblaBearing)} • {kaabaDistanceKm.toLocaleString()} km
                </div>

                <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] w-full flex flex-col items-center gap-1">
                  {weather ? (
                    <>
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{formatTemp(weather.temperatureC)}</span>
                        <span className="text-[10px] font-normal text-[var(--text-muted)] truncate max-w-[78px]">
                          {tp(lang, weather.weatherLabel)}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: aqiMeta.bg, color: aqiMeta.color }}
                        >
                          AQI {weather.usAqi ?? "—"}
                        </span>
                        <span className="text-[10px] tabular-nums text-sky-400 flex items-center gap-0.5">
                          <Wind className="w-3 h-3" />
                          {Math.round(weather.windSpeedKmh)} km/h
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {weatherLoading ? ui.syncingWeather : ui.weatherAqi}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compass Legend Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[11px] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F4B860] inline-block" />
                <span>
                  {t(lang, "qiblaBearing")} ({effectiveQiblaBearing}°)
                </span>
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                <span>
                  {ui.sunAzimuth} ({solarPosition.azimuthDeg}°)
                </span>
              </span>
              {weather && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                  <span>
                    {ui.wind} ({weather.windDirectionDeg}° {degreesToCardinal(weather.windDirectionDeg)})
                  </span>
                </span>
              )}
            </div>
          </div>

          {/* Interactive Rotation Control Slider & 1-Tap Align to Qibla */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[var(--text-primary)]">{sensorStatusText}</span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSensorActive(false);
                    setSensorModeKey("interactive");
                    setManualHeading(
                      Number(((effectiveQiblaBearing - qiblaCalibrationOffset + 360) % 360).toFixed(1))
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-semibold hover:bg-[var(--accent-gold)]/30 transition cursor-pointer text-[11px]"
                >
                  {ui.snapToQibla} ({effectiveQiblaBearing}°)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSensorActive(false);
                    setSensorModeKey("interactive");
                    setManualHeading(0);
                  }}
                  className="px-2 py-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer text-[11px]"
                >
                  {ui.northZero}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3" dir="ltr">
              <span className="text-[11px] font-mono text-[var(--text-muted)] w-8">0°</span>
              <input
                type="range"
                aria-label={ui.heading}
                min={0}
                max={359}
                step={0.5}
                value={rawHeading}
                onChange={(e) => {
                  setSensorActive(false);
                  setSensorModeKey("interactive");
                  setManualHeading(parseFloat(e.target.value));
                }}
                className="flex-1 accent-[var(--accent-gold)] cursor-pointer"
              />
              <span className="text-[11px] font-mono text-[var(--text-muted)] w-10 text-right">360°</span>
            </div>
          </div>

          {/* Expandable Qibla Calibration Modal / Panel */}
          <AnimatePresence>
            {showCalibrationModal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--accent-gold)]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>{ui.calibrationTitle}</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCalibrationModal(false)}
                      className="text-xs font-semibold text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      {ui.done}
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Figure-8 Motion Calibration */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-primary)]">{ui.figure8Title}</span>
                        <span className="text-[11px] tabular-nums font-semibold text-emerald-400">
                          {figure8Step}/3
                        </span>
                      </div>
                      <div className="flex items-center justify-center py-1">
                        <svg viewBox="0 0 200 70" className="w-40 h-14">
                          <path
                            d="M 100 35 C 130 5, 185 5, 185 35 C 185 65, 130 65, 100 35 C 70 5, 15 5, 15 35 C 15 65, 70 65, 100 35 Z"
                            fill="none"
                            stroke="var(--accent-gold)"
                            strokeWidth="3"
                            strokeDasharray="6 4"
                          />
                          <circle cx="100" cy="35" r="5" fill="#34D399" />
                        </svg>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">{ui.figure8Desc}</p>
                      <button
                        type="button"
                        onClick={runFigure8CalibrationStep}
                        className="w-full py-1.5 px-3 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition cursor-pointer inline-flex items-center justify-center gap-1.5"
                      >
                        {figure8Step >= 3 ? (
                          <>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{ui.figure8Verified}</span>
                          </>
                        ) : (
                          <span>
                            {ui.recordPass} ({figure8Step}/3)
                          </span>
                        )}
                      </button>
                    </div>

                    {/* 2-Axis Spirit Level & Manual Compass Trim Offset */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-primary)]">{ui.tiltTrimTitle}</span>
                        <span
                          className={`text-[11px] tabular-nums font-medium ${
                            isDeviceTilted ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          {tiltBeta}° • {tiltGamma}°
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">{ui.compassTrim}</span>
                          <span className="tabular-nums font-bold text-[var(--accent-gold)]">
                            {qiblaCalibrationOffset >= 0
                              ? `+${qiblaCalibrationOffset}°`
                              : `${qiblaCalibrationOffset}°`}
                          </span>
                        </div>
                        <input
                          type="range"
                          dir="ltr"
                          aria-label={ui.compassTrim}
                          min={-30}
                          max={30}
                          step={0.5}
                          value={qiblaCalibrationOffset}
                          onChange={(e) => setQiblaCalibrationOffset(parseFloat(e.target.value))}
                          className="w-full accent-[var(--accent-gold)] cursor-pointer"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-[var(--text-muted)] tabular-nums">
                            {ui.sunAzimuth}: {solarPosition.azimuthDeg}°
                          </span>
                          <button
                            type="button"
                            onClick={() => setQiblaCalibrationOffset(0)}
                            className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            <span>{ui.resetTrim}</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right 5 Columns: Live Weather & Air Quality Card */}
        <div className="lg:col-span-5 card-surface p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Thermometer className="w-4 h-4" />
                <span>{ui.weatherAqi}</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {ui.localConditions} {city.name}
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setUseFahrenheit((v) => !v)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] cursor-pointer"
              >
                {useFahrenheit ? "°F" : "°C"}
              </button>
              <button
                type="button"
                onClick={refreshWeather}
                disabled={weatherLoading}
                title={tp(lang, "Refresh")}
                aria-label={tp(lang, "Refresh")}
                className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {weatherError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {weatherError}
            </div>
          )}

          {/* Primary Temperature & Condition Banner */}
          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tabular-nums text-[var(--text-primary)]">
                {weather ? formatTemp(weather.temperatureC) : weatherLoading ? "…" : "—"}
              </div>
              <div className="text-xs font-semibold text-[var(--accent-gold)] mt-0.5">
                {weather ? tp(lang, weather.weatherLabel) : ui.syncingWeather}
              </div>
              {weather && (
                <div className="text-[11px] text-[var(--text-muted)] mt-1 tabular-nums">
                  {ui.feelsLike} {formatTemp(weather.apparentTemperatureC)} • {formatTemp(weather.tempMaxC)} /{" "}
                  {formatTemp(weather.tempMinC)}
                </div>
              )}
            </div>

            {/* Live US & European AQI Badge */}
            <div
              className="p-3 rounded-2xl border text-end min-w-[120px]"
              style={{
                background: aqiMeta.bg,
                borderColor: `${aqiMeta.color}40`,
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: aqiMeta.color }}>
                AQI • {tp(lang, aqiMeta.label)}
              </div>
              <div className="text-2xl font-extrabold tabular-nums mt-0.5" style={{ color: aqiMeta.color }}>
                {weather?.usAqi ?? "—"}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)] tabular-nums">
                EU: {weather?.europeanAqi ?? "—"}
              </div>
            </div>
          </div>

          {/* 4-Metric Meteorological Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-2.5">
              <Wind className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)]">{ui.wind}</div>
                <div className="text-xs font-bold text-[var(--text-primary)] tabular-nums">
                  {weather
                    ? `${Math.round(weather.windSpeedKmh)} km/h ${degreesToCardinal(weather.windDirectionDeg)}`
                    : "—"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)]">{ui.humidity}</div>
                <div className="text-xs font-bold text-[var(--text-primary)] tabular-nums">
                  {weather ? `${weather.humidityPct}% • ${weather.precipitationMm} mm` : "—"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-2.5">
              <Gauge className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)]">{ui.pressure}</div>
                <div className="text-xs font-bold text-[var(--text-primary)] tabular-nums">
                  {weather ? `${Math.round(weather.surfacePressureHpa)} hPa` : "—"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)]">{ui.uvIndex}</div>
                <div className="text-xs font-bold text-[var(--text-primary)] tabular-nums">
                  {weather ? `${weather.uvIndex} • ${weather.cloudCoverPct}% ${ui.cloud}` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Atmospheric Particulates Breakdown */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                <span>{ui.particulates}</span>
              </span>
              <span className="text-[11px] font-semibold" style={{ color: aqiMeta.color }}>
                {tp(lang, aqiMeta.label)}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "PM2.5", val: weather?.pm25 },
                { label: "PM10", val: weather?.pm10 },
                { label: ui.ozone, val: weather?.ozone },
                { label: ui.dust, val: weather?.dust },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
                >
                  <div className="text-[10px] text-[var(--text-muted)] truncate">{item.label}</div>
                  <div className="text-xs font-bold tabular-nums text-[var(--text-primary)] mt-0.5">
                    {item.val !== null && item.val !== undefined ? item.val : "—"}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* 3. Date Scrubber + 5 Daily Hanafi Prayers with Crisp SVG Status Pills & Rak'at Guide */}
      <div className="card-surface p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2 flex-wrap">
              <span>{ui.scheduleTitle}</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 tabular-nums">
                {rings.salah}% {ui.prayedToday}
              </span>
            </h2>
            <p className="text-xs text-[var(--text-muted)] mt-0.5">{ui.scheduleSub}</p>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <Link
              href="/fiqh?tab=prayer-method"
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-[var(--accent-gold)]/15 border border-[var(--accent-gold)]/45 text-xs font-bold text-[var(--accent-gold)] hover:bg-[var(--accent-gold)]/25 transition"
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>{ui.namazGuide}</span>
            </Link>

            <div className="inline-flex items-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-1">
              <button
                type="button"
                onClick={() => setDayOffset((d) => d - 1)}
                title={ui.prevDay}
                aria-label={ui.prevDay}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5 rtl-mirror" />
              </button>
              <button
                type="button"
                onClick={() => setDayOffset(0)}
                className="px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>
                  {dayOffset === 0
                    ? ui.today
                    : selectedDate.toLocaleDateString(undefined, {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDayOffset((d) => d + 1)}
                title={ui.nextDay}
                aria-label={ui.nextDay}
                className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5 rtl-mirror" />
              </button>
            </div>

            <select
              aria-label="Calculation Method"
              value={calcMethod}
              onChange={(e) => setCalcMethod(e.target.value as CalcMethodId)}
              className="ui-select px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none"
            >
              <option value="Karachi">Karachi — Islamic Sciences (Hanafi)</option>
              <option value="MuslimWorldLeague">Muslim World League</option>
              <option value="UmmAlQura">Umm al-Qura (Makkah)</option>
              <option value="MoonsightingCommittee">Moonsighting Committee</option>
              <option value="NorthAmerica">ISNA (North America)</option>
              <option value="Turkey">Diyanet (Türkiye)</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {schedule.rows.map((p) => {
            const cfg = prayerSettings[p.name];
            const isNext = schedule.nextPrayer.name === p.name && dayOffset === 0;
            const loggedStatus = salahToday[p.name];
            const isExpanded = expandedPrayer === p.name;
            const rakatGuide = HANAFI_RAKAT_GUIDE[p.name];
            const prayerDisplayLabel = localizePrayerName(lang, p.label);

            return (
              <div key={p.name} className="py-4 first:pt-1 last:pb-1 space-y-2.5">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedPrayer(isExpanded ? null : p.name)}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition cursor-pointer shrink-0 ${
                        isNext
                          ? "bg-[var(--accent-gold)] text-[#1D0E40] shadow-md"
                          : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                      }`}
                    >
                      {prayerDisplayLabel.slice(0, 2)}
                    </button>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-bold text-base text-[var(--text-primary)]">
                          {prayerDisplayLabel}
                        </span>
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--accent-gold)] tabular-nums">
                          {rakatGuide.totalRakaat} {ui.rakatTotal}
                        </span>
                        {isNext && <span className="badge-pill badge-emerald">{tp(lang, "Next")}</span>}
                        {p.isConflict && (
                          <span className="badge-pill badge-crimson">{ui.checkFixedTime}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)] mt-0.5">
                        {t(lang, "azanTime")}{" "}
                        <strong className="text-[var(--text-primary)] tabular-nums">{fmtTz(p.azanTime)}</strong> •{" "}
                        {t(lang, "jamaatTime")}{" "}
                        <strong className="text-[var(--accent-gold)] tabular-nums">{fmtTz(p.jamaatTime)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* 1-Tap Salah Tracker Pills (Crisp Lucide CheckCircle2 / Circle Icons) */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { key: "jamaat", label: ui.withJamaat },
                        { key: "ontime", label: ui.onTime },
                        { key: "qaza", label: ui.qaza },
                      ] as const
                    ).map((st) => {
                      const active = loggedStatus === st.key;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => logSalah(p.name, active ? "none" : st.key)}
                          className={`px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition inline-flex items-center gap-1.5 cursor-pointer ${
                            active
                              ? st.key === "jamaat"
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                : st.key === "ontime"
                                ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
                                : "bg-amber-500/20 border-amber-400/50 text-amber-300"
                              : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {active ? (
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                          ) : (
                            <Circle className="w-3 h-3 opacity-45 shrink-0" />
                          )}
                          <span>{st.label}</span>
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setExpandedPrayer(isExpanded ? null : p.name)}
                      className="px-2.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer ms-0.5"
                    >
                      {isExpanded ? ui.hideDetails : ui.sunnahAndConfig}
                    </button>

                    <button
                      type="button"
                      onClick={() => playGentleChime(prayerDisplayLabel)}
                      title={t(lang, "azanTime")}
                      aria-label={t(lang, "azanTime")}
                      className="p-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--accent-gold)] hover:bg-[var(--bg-muted)] cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Interactive Sunnah, Fard, Wajib Witr & Nafl Rak'at Sequence Strip */}
                <div className="flex flex-wrap items-center gap-1.5 ps-0 lg:ps-13">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--text-muted)] me-1">
                    {ui.rakatSequence}:
                  </span>
                  {rakatGuide.units.map((u, idx) => {
                    const isFardUnit = u.type === "Fard";
                    const checked = isFardUnit
                      ? loggedStatus === "jamaat" || loggedStatus === "ontime"
                      : Boolean(sunnahChecks[u.id]);
                    const localizedUnit = localizeRakatUnit(u, ui);

                    return (
                      <React.Fragment key={u.id}>
                        <button
                          type="button"
                          title={u.fiqhNote}
                          onClick={() => {
                            if (isFardUnit) {
                              logSalah(p.name, checked ? "none" : "jamaat");
                            } else {
                              toggleSunnah(u.id);
                            }
                          }}
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition inline-flex items-center gap-1.5 cursor-pointer ${
                            checked
                              ? "bg-emerald-500/15 border-emerald-500/45 text-emerald-300"
                              : u.type === "Fard"
                              ? "bg-[var(--accent-gold)]/15 border-[var(--accent-gold)]/40 text-[var(--accent-gold)]"
                              : u.type === "Wajib Witr"
                              ? "bg-purple-500/15 border-purple-400/35 text-purple-300"
                              : u.type === "Sunnah Mu'akkadah"
                              ? "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)]"
                              : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                          }`}
                        >
                          {checked ? (
                            <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          ) : (
                            <Circle className="w-2.5 h-2.5 opacity-50 shrink-0" />
                          )}
                          <span>{localizedUnit.shortLabel}</span>
                        </button>
                        {idx < rakatGuide.units.length - 1 && (
                          <ChevronRight className="w-3 h-3 text-[var(--text-muted)] opacity-55 rtl-mirror shrink-0" />
                        )}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Expandable Per-Prayer Customization & Detailed Sunnah/Nafl Fiqh Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-2 space-y-3">
                        <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
                          <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                            {ui.sunnahBreakdown} ({prayerDisplayLabel})
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {rakatGuide.units.map((u) => {
                              const locUnit = localizeRakatUnit(u, ui);
                              return (
                                <div
                                  key={u.id}
                                  className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs space-y-0.5"
                                >
                                  <div className="flex items-center justify-between gap-2 font-bold text-[var(--text-primary)]">
                                    <span>{locUnit.shortLabel}</span>
                                    <span className="text-[10px] text-[var(--accent-gold)]">
                                      {locUnit.typeLabel}
                                    </span>
                                  </div>
                                  <p className="text-[11px] text-[var(--text-muted)] leading-relaxed">
                                    {u.fiqhNote}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        </div>

                        <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                          <div>
                            <label className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                              {ui.jamaatMode}
                            </label>
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => updatePrayerSetting(p.name, { mode: "offset" })}
                                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                                  cfg.mode === "offset"
                                    ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                                    : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                                }`}
                              >
                                {ui.plusMinutes}
                              </button>
                              <button
                                type="button"
                                onClick={() => updatePrayerSetting(p.name, { mode: "fixed" })}
                                className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                                  cfg.mode === "fixed"
                                    ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                                    : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                                }`}
                              >
                                {ui.fixedTime}
                              </button>
                            </div>
                          </div>

                          <div>
                            <label className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                              {cfg.mode === "offset" ? ui.minutesAfterAzan : ui.fixedMasjidJamaat}
                            </label>
                            {cfg.mode === "offset" ? (
                              <input
                                type="number"
                                min={0}
                                max={120}
                                value={cfg.offsetMinutes}
                                onChange={(e) =>
                                  updatePrayerSetting(p.name, {
                                    offsetMinutes: Number(e.target.value),
                                  })
                                }
                                className="w-28 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] tabular-nums text-[var(--text-primary)]"
                              />
                            ) : (
                              <input
                                type="time"
                                value={cfg.fixedTime}
                                onChange={(e) =>
                                  updatePrayerSetting(p.name, { fixedTime: e.target.value })
                                }
                                className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] tabular-nums text-[var(--text-primary)]"
                              />
                            )}
                          </div>

                          <div>
                            <label className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                              {ui.azanCalibration}
                            </label>
                            <input
                              type="number"
                              min={-30}
                              max={30}
                              value={cfg.manualAdjustMinutes}
                              onChange={(e) =>
                                updatePrayerSetting(p.name, {
                                  manualAdjustMinutes: Number(e.target.value),
                                })
                              }
                              className="w-24 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] tabular-nums text-[var(--text-primary)]"
                            />
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Fasting, Nafl & 3 Hanafi Makruh Tahrimi Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-surface p-5 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-semibold uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>
              {ui.fastingNaflTitle} ({activeTimezone})
            </span>
          </div>
          <div className="divide-y divide-[var(--border-subtle)] text-xs">
            {[
              {
                label: ui.sehriEnds,
                value: fmtTz(schedule.rows[0].azanTime),
                sub: ui.sehriSub,
              },
              {
                label: ui.iftarTitle,
                value: fmtTz(schedule.rows[3].azanTime),
                sub: ui.iftarSub,
              },
              {
                label: ui.ishraqChasht,
                value: `${fmtTz(schedule.ishraq)} – ${fmtTz(schedule.chasht)}`,
                sub: ui.ishraqSub,
              },
              {
                label: ui.dahwaKubra,
                value: fmtTz(schedule.dahwaKubra),
                sub: ui.dahwaSub,
              },
              {
                label: ui.tahajjudTitle,
                value: fmtTz(schedule.tahajjudStart),
                sub: ui.tahajjudSub,
              },
            ].map((row) => (
              <div key={row.label} className="py-2.5 flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{row.label}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{row.sub}</div>
                </div>
                <div className="tabular-nums font-bold text-sm text-[var(--accent-gold)] shrink-0">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>{ui.makruhTitle}</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">{ui.makruhSub}</p>
          <div className="divide-y divide-[var(--border-subtle)]">
            {schedule.makruhWindows.map((w) => {
              const title =
                w.id === "sunrise"
                  ? ui.makruhSunriseTitle
                  : w.id === "zawal"
                  ? ui.makruhZawalTitle
                  : ui.makruhSunsetTitle;
              const desc =
                w.id === "sunrise"
                  ? ui.makruhSunriseDesc
                  : w.id === "zawal"
                  ? ui.makruhZawalDesc
                  : ui.makruhSunsetDesc;

              return (
                <div key={w.id} className="py-2.5 flex items-center justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold text-[var(--text-primary)]">{title}</div>
                    <div className="text-[11px] text-[var(--text-muted)]">{desc}</div>
                  </div>
                  <div className="text-xs tabular-nums font-bold text-rose-400 shrink-0">
                    {fmtTz(w.start)} – {fmtTz(w.end)}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
