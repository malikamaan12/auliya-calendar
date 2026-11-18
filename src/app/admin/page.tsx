"use client";

import React, { Suspense, useCallback, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  Award,
  BookOpen,
  Calculator,
  Calendar,
  Check,
  CheckCircle2,
  Clock,
  Coins,
  Compass,
  Copy,
  Crown,
  Database,
  Download,
  Edit3,
  ExternalLink,
  Eye,
  EyeOff,
  FileJson,
  Filter,
  Flame,
  Globe,
  Hash,
  HeartHandshake,
  KeyRound,
  Layers,
  LayoutGrid,
  Link2,
  Lock,
  LogIn,
  LogOut,
  MapPin,
  Megaphone,
  Palette,
  Plus,
  RefreshCw,
  RotateCcw,
  Save,
  Scale,
  Search,
  Server,
  Settings,
  Shield,
  ShieldAlert,
  ShieldCheck,
  Sparkles,
  Star,
  Trash2,
  Trophy,
  Unlock,
  Upload,
  UserCheck,
  UserPlus,
  Users,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import {
  getSupabaseConfig,
  setSupabaseRuntimeConfig,
  testSupabaseConnection,
} from "@/lib/supabase-rest";
import {
  DailyQuestConfig,
  GamificationConfig,
  hasPermission,
  ManagedAuliyaRecord,
  ModuleConfigRecord,
  ModuleIconKey,
  PermissionKey,
  PlatformSettings,
  RBAC_ROLES,
  UrsEventRecord,
  UserRole,
  ZakatBackendConfig,
  ZakatCurrencyConfig,
} from "@/lib/backend-types";
import { AuliyaProfile, AuthoredBook, resolvePublicAssetUrl } from "@/data/auliya";
import { HIJRI_MONTHS } from "@/lib/hijri";
import { SANCTUARY_THEMES, ThemeId } from "@/lib/themes";
import { formatLocalizedHijriMonth, LANGUAGES, LangCode, t, tp } from "@/lib/i18n";

function tl(lang: LangCode, key: string, fallback: string): string {
  const val = t(lang, key);
  if (lang !== "en" && val === t("en", key)) return fallback;
  return val;
}

interface AdminUiCopy {
  studioEyebrow: string;
  subtitle: string;
  tabOverview: string;
  tabAuliya: string;
  tabUrs: string;
  tabModules: string;
  tabZakat: string;
  tabAudit: string;
  contributorRole: string;
  contributorRoleHint: string;
  registerEmailLink: string;
  guestSession: string;
  publicReadOnly: string;
  myProfile: string;
  accountPortalTitle: string;
  accountPortalSubtitle: string;
  roleCapabilitiesTitle: string;
  roleCapabilitiesSubtitle: string;
  userDirectoryTitle: string;
  publish: string;
  approvePublish: string;
  statusPublished: string;
  statusVerification: string;
  statusDraft: string;
  newRecord: string;
  exportSnapshot: string;
  resetSeed: string;
  switching: string;
  selectRole: string;
  permissionsCount: string;
}

const ADMIN_UI: Record<LangCode, AdminUiCopy> = {
  en: {
    studioEyebrow: "Editorial & Contributor Studio",
    subtitle:
      "Curate Auliya biographies, Urs dates, home layout, Zakat benchmarks, and contributor roles",
    tabOverview: "Overview",
    tabAuliya: "Auliya Profiles",
    tabUrs: "Urs Calendar",
    tabModules: "Home Layout",
    tabZakat: "Nisab Rates",
    tabAudit: "Activity Log",
    contributorRole: "Contributor Role",
    contributorRoleHint: "Switch editorial tier to preview or curate Sanctuary content",
    registerEmailLink: "Register with personal email",
    guestSession: "Guest Session",
    publicReadOnly: "Public read-only view",
    myProfile: "My Profile",
    accountPortalTitle: "Account & Contributor Access",
    accountPortalSubtitle: "Create a contributor account, sign in, or update your profile",
    roleCapabilitiesTitle: "Contributor Role Permissions",
    roleCapabilitiesSubtitle: "Editorial responsibilities across Sanctuary contributor tiers",
    userDirectoryTitle: "Members & Contributor Roles",
    publish: "Publish",
    approvePublish: "Approve & Publish",
    statusPublished: "Published",
    statusVerification: "Scholarly Review",
    statusDraft: "Draft",
    newRecord: "New",
    exportSnapshot: "Export Database Snapshot",
    resetSeed: "Reset to Clean Seed",
    switching: "Switching…",
    selectRole: "Select",
    permissionsCount: "permissions",
  },
  ur: {
    studioEyebrow: "ادارتی و تحقیقی مرکز",
    subtitle:
      "تذکرۂ اولیاء، تاریخِ عرس، ترتیبِ شعبہ جات، نصابِ زکوٰۃ اور معاونین کے اختیارات کی ادارت",
    tabOverview: "جائزہ",
    tabAuliya: "تذکرۂ اولیاء",
    tabUrs: "تقویمِ عرس",
    tabModules: "ترتیبِ مرکز",
    tabZakat: "شرحِ نصاب",
    tabAudit: "سجلِ سرگرمی",
    contributorRole: "ادارتی ذمہ داری",
    contributorRoleHint: "مواد کی تدوین یا جائزے کے لیے معاون درجہ منتخب کریں",
    registerEmailLink: "ذاتی ای میل سے اکاؤنٹ بنائیں",
    guestSession: "مہمان نشست",
    publicReadOnly: "صرف مطالعہ",
    myProfile: "میرا تعارف",
    accountPortalTitle: "اکاؤنٹ اور معاون داخلہ",
    accountPortalSubtitle: "نیا اکاؤنٹ بنائیں، لاگ اِن کریں یا پروفائل میں ترمیم کریں",
    roleCapabilitiesTitle: "معاونین کے ادارتی اختیارات",
    roleCapabilitiesSubtitle: "مرکزِ ادارت کے ہر درجے کی ذمہ داریاں",
    userDirectoryTitle: "اراکین اور معاون درجات",
    publish: "شائع کریں",
    approvePublish: "تصدیق و اشاعت",
    statusPublished: "شائع شدہ",
    statusVerification: "علمی تصدیق",
    statusDraft: "مسودہ",
    newRecord: "نیا اندراج",
    exportSnapshot: "ڈیٹا بیس نسخہ محفوظ کریں",
    resetSeed: "ابتدائی حالت بحال کریں",
    switching: "تبدیل ہو رہا ہے…",
    selectRole: "منتخب کریں",
    permissionsCount: "اختیارات",
  },
  ar: {
    studioEyebrow: "استوديو التحرير والتوثيق",
    subtitle:
      "تحرير تراجم الأولياء ومواعيد الحوليات وتخطيط الواجهة ومعدلات النصاب وأدوار المساهمين",
    tabOverview: "نظرة عامة",
    tabAuliya: "تراجم الأولياء",
    tabUrs: "تقويم الحوليات",
    tabModules: "تخطيط الرئيسية",
    tabZakat: "معدلات النصاب",
    tabAudit: "سجل النشاط",
    contributorRole: "دور المساهم",
    contributorRoleHint: "اختر مستوى الصلاحية لمعاينة المحتوى أو تحريره",
    registerEmailLink: "التسجيل بالبريد الشخصي",
    guestSession: "جلسة زائر",
    publicReadOnly: "قراءة عامة فقط",
    myProfile: "ملفي الشخصي",
    accountPortalTitle: "الحساب وبوابة المساهمين",
    accountPortalSubtitle: "أنشئ حساباً أو سجّل الدخول أو حدّث ملفك الشخصي",
    roleCapabilitiesTitle: "صلاحيات أدوار المساهمين",
    roleCapabilitiesSubtitle: "المسؤوليات التحريرية لكل فئة في المنصة",
    userDirectoryTitle: "الأعضاء وأدوار المساهمين",
    publish: "نشر",
    approvePublish: "اعتماد ونشر",
    statusPublished: "منشور",
    statusVerification: "مراجعة علمية",
    statusDraft: "مسودة",
    newRecord: "جديد",
    exportSnapshot: "تصدير نسخة البيانات",
    resetSeed: "استعادة البيانات الأصلية",
    switching: "جارٍ التبديل…",
    selectRole: "اختيار",
    permissionsCount: "صلاحيات",
  },
  ro_ur: {
    studioEyebrow: "Idarati & Tehqeeqi Studio",
    subtitle:
      "Auliya tazkirah, Urs tareekh, home layout, Zakat nisab aur khadimeen ke ikhtiyarat murattab karein",
    tabOverview: "Jaiza",
    tabAuliya: "Auliya Tazkirah",
    tabUrs: "Urs Calendar",
    tabModules: "Home Tarteeb",
    tabZakat: "Nisab Rates",
    tabAudit: "Activity Log",
    contributorRole: "Khadim / Editorial Darja",
    contributorRoleHint: "Tazkirah aur Urs murattab karne ke liye darja muntakhab karein",
    registerEmailLink: "Zati email se account banayein",
    guestSession: "Mehman Session",
    publicReadOnly: "Sirf mutala (Read-only)",
    myProfile: "Mera Profile",
    accountPortalTitle: "Account & Khadim Dakhila",
    accountPortalSubtitle: "Naya account banayein, sign in karein ya profile badlein",
    roleCapabilitiesTitle: "Khadimeen Ke Ikhtiyarat",
    roleCapabilitiesSubtitle: "Har idarati darje ki zimmedariyan",
    userDirectoryTitle: "Arakeen & Roles",
    publish: "Publish Karein",
    approvePublish: "Tasdeeq & Publish",
    statusPublished: "Published",
    statusVerification: "Ilmi Tasdeeq",
    statusDraft: "Draft",
    newRecord: "Naya",
    exportSnapshot: "Snapshot Export Karein",
    resetSeed: "Asal Seed Bahal Karein",
    switching: "Badal raha hai…",
    selectRole: "Chunein",
    permissionsCount: "ikhtiyarat",
  },
  hi: {
    studioEyebrow: "संपादकीय एवं योगदान स्टुडियो",
    subtitle:
      "औलिया जीवनियां, उर्स तिथियां, होम लेआउट, ज़कात निसाब दरें और सहयोगी भूमिकाएं संपादित करें",
    tabOverview: "अवलोकन",
    tabAuliya: "औलिया परिचय",
    tabUrs: "उर्स कैलेंडर",
    tabModules: "होम लेआउट",
    tabZakat: "निसाब दरें",
    tabAudit: "गतिविधि लॉग",
    contributorRole: "सहयोगी भूमिका",
    contributorRoleHint: "सामग्री संपादन व समीक्षा के लिए भूमिका चुनें",
    registerEmailLink: "व्यक्तिगत ईमेल से खाता बनाएं",
    guestSession: "अतिथि सत्र",
    publicReadOnly: "केवल पठन मोड",
    myProfile: "मेरी प्रोफ़ाइल",
    accountPortalTitle: "खाता एवं सहयोगी प्रवेश",
    accountPortalSubtitle: "नया खाता बनाएं, साइन इन करें या प्रोफ़ाइल अपडेट करें",
    roleCapabilitiesTitle: "सहयोगी भूमिका अधिकार",
    roleCapabilitiesSubtitle: "प्रत्येक संपादकीय स्तर की ज़िम्मेदारियां",
    userDirectoryTitle: "सदस्य एवं भूमिकाएं",
    publish: "प्रकाशित करें",
    approvePublish: "सत्यापित व प्रकाशित करें",
    statusPublished: "प्रकाशित",
    statusVerification: "आलिम समीक्षा",
    statusDraft: "ड्राफ़्ट",
    newRecord: "नया",
    exportSnapshot: "डेटाबेस स्नैपशॉट निर्यात करें",
    resetSeed: "मूल डेटा रीसेट करें",
    switching: "बदल रहा है…",
    selectRole: "चुनें",
    permissionsCount: "अधिकार",
  },
  tr: {
    studioEyebrow: "Yayın ve Katkıda Bulunan Stüdyosu",
    subtitle:
      "Evliya biyografilerini, vuslat günlerini, ana sayfa düzenini, nisap kurlarını ve rolleri yönetin",
    tabOverview: "Genel Bakış",
    tabAuliya: "Evliya Profilleri",
    tabUrs: "Vuslat Takvimi",
    tabModules: "Ana Düzen",
    tabZakat: "Nisap Kurları",
    tabAudit: "İşlem Kaydı",
    contributorRole: "Katkı Rolü",
    contributorRoleHint: "İçerik düzenlemek veya önizlemek için rol seçin",
    registerEmailLink: "Kişisel e-posta ile kaydolun",
    guestSession: "Misafir Oturumu",
    publicReadOnly: "Salt okunur görünüm",
    myProfile: "Profilim",
    accountPortalTitle: "Hesap ve Katkı Portalı",
    accountPortalSubtitle: "Yeni hesap oluşturun, giriş yapın veya profilinizi güncelleyin",
    roleCapabilitiesTitle: "Katkı Rolü Yetkileri",
    roleCapabilitiesSubtitle: "Her yayın kademesi için tanımlı sorumluluklar",
    userDirectoryTitle: "Üyeler ve Roller",
    publish: "Yayınla",
    approvePublish: "Onayla ve Yayınla",
    statusPublished: "Yayında",
    statusVerification: "İlmî İnceleme",
    statusDraft: "Taslak",
    newRecord: "Yeni",
    exportSnapshot: "Veritabanı Yedeği İndir",
    resetSeed: "Varsayılan Veriye Sıfırla",
    switching: "Geçiliyor…",
    selectRole: "Seç",
    permissionsCount: "yetki",
  },
  bn: {
    studioEyebrow: "সম্পাদনা ও অবদানকারী স্টুডিও",
    subtitle:
      "আউলিয়া জীবনী, ওরস তারিখ, হোম লেআউট, নিসাব হার এবং অবদানকারী ভূমিকা পরিচালনা করুন",
    tabOverview: "সারসংক্ষেপ",
    tabAuliya: "আউলিয়া প্রোফাইল",
    tabUrs: "ওরস ক্যালেন্ডার",
    tabModules: "হোম লেআউট",
    tabZakat: "নিসাব হার",
    tabAudit: "কার্যবিবরণী",
    contributorRole: "অবদানকারী ভূমিকা",
    contributorRoleHint: "সম্পাদনা বা প্রিভিউ করতে ভূমিকা নির্বাচন করুন",
    registerEmailLink: "ব্যক্তিগত ইমেইল দিয়ে নিবন্ধন করুন",
    guestSession: "অতিথি সেশন",
    publicReadOnly: "শুধুমাত্র পাঠযোগ্য",
    myProfile: "আমার প্রোফাইল",
    accountPortalTitle: "অ্যাকাউন্ট ও অবদানকারী প্রবেশ",
    accountPortalSubtitle: "নতুন অ্যাকাউন্ট খুলুন, সাইন ইন করুন বা প্রোফাইল সম্পাদনা করুন",
    roleCapabilitiesTitle: "ভূমিকাভিত্তিক অনুমতি",
    roleCapabilitiesSubtitle: "প্রতিটি সম্পাদনা স্তরের দায়িত্বসমূহ",
    userDirectoryTitle: "সদস্য ও ভূমিকা তালিকা",
    publish: "প্রকাশ করুন",
    approvePublish: "অনুমোদন ও প্রকাশ",
    statusPublished: "প্রকাশিত",
    statusVerification: "আলেম যাচাই",
    statusDraft: "খসড়া",
    newRecord: "নতুন",
    exportSnapshot: "ডেটাবেস স্ন্যাপশট ডাউনলোড",
    resetSeed: "মূল ডেটায় রিসেট করুন",
    switching: "পরিবর্তন হচ্ছে…",
    selectRole: "নির্বাচন",
    permissionsCount: "অনুমতি",
  },
  fa: {
    studioEyebrow: "استودیوی تحریریه و مشارکت",
    subtitle:
      "تدوین تذکره اولیا، تاریخ‌های عرس، چیدمان صفحه اصلی، نرخ‌های نصاب و نقش‌های مشارکت‌کنندگان",
    tabOverview: "نمای کلی",
    tabAuliya: "تذکره اولیا",
    tabUrs: "تقویم عرس",
    tabModules: "چیدمان خانه",
    tabZakat: "نرخ‌های نصاب",
    tabAudit: "گزارش فعالیت",
    contributorRole: "نقش مشارکت‌کننده",
    contributorRoleHint: "برای پیش‌نمایش یا ویرایش محتوا سطح دسترسی را انتخاب کنید",
    registerEmailLink: "ثبت‌نام با ایمیل شخصی",
    guestSession: "نشست مهمان",
    publicReadOnly: "فقط خواندنی",
    myProfile: "نمایه من",
    accountPortalTitle: "حساب کاربری و درگاه مشارکت",
    accountPortalSubtitle: "ایجاد حساب، ورود یا ویرایش مشخصات فردی",
    roleCapabilitiesTitle: "دسترسی‌های نقش‌ها",
    roleCapabilitiesSubtitle: "مسئولیت‌های تحریریه در هر سطح کاربری",
    userDirectoryTitle: "اعضا و نقش‌ها",
    publish: "انتشار",
    approvePublish: "تأیید و انتشار",
    statusPublished: "منتشر شده",
    statusVerification: "بررسی علمی",
    statusDraft: "پیش‌نویس",
    newRecord: "جدید",
    exportSnapshot: "دریافت نسخه پشتیبان",
    resetSeed: "بازگردانی به داده اولیه",
    switching: "در حال تغییر…",
    selectRole: "انتخاب",
    permissionsCount: "مجوز",
  },
  id: {
    studioEyebrow: "Studio Redaksi & Kontributor",
    subtitle:
      "Kelola biografi Auliya, jadwal Haul/Urs, tata letak beranda, nisab Zakat, dan peran kontributor",
    tabOverview: "Ringkasan",
    tabAuliya: "Profil Auliya",
    tabUrs: "Kalender Haul",
    tabModules: "Tata Letak",
    tabZakat: "Kurs Nisab",
    tabAudit: "Log Aktivitas",
    contributorRole: "Peran Kontributor",
    contributorRoleHint: "Pilih tingkat peran untuk meninjau atau menyunting konten",
    registerEmailLink: "Daftar dengan email pribadi",
    guestSession: "Sesi Tamu",
    publicReadOnly: "Akses baca publik",
    myProfile: "Profil Saya",
    accountPortalTitle: "Akun & Akses Kontributor",
    accountPortalSubtitle: "Buat akun baru, masuk, atau perbarui profil Anda",
    roleCapabilitiesTitle: "Izin Peran Kontributor",
    roleCapabilitiesSubtitle: "Cakupan tanggung jawab redaksi tiap peran",
    userDirectoryTitle: "Daftar Anggota & Peran",
    publish: "Terbitkan",
    approvePublish: "Setujui & Terbitkan",
    statusPublished: "Terbit",
    statusVerification: "Tinjauan Ulama",
    statusDraft: "Draf",
    newRecord: "Baru",
    exportSnapshot: "Ekspor Snapshot Database",
    resetSeed: "Atur Ulang ke Data Awal",
    switching: "Mengalihkan…",
    selectRole: "Pilih",
    permissionsCount: "izin",
  },
  fr: {
    studioEyebrow: "Studio Éditorial & Contributeurs",
    subtitle:
      "Gérez les biographies des Auliya, le calendrier des Urs, la mise en page, le Nisab et les rôles",
    tabOverview: "Aperçu",
    tabAuliya: "Profils Auliya",
    tabUrs: "Calendrier Urs",
    tabModules: "Mise en Page",
    tabZakat: "Taux du Nisab",
    tabAudit: "Journal d'Activité",
    contributorRole: "Rôle Contributeur",
    contributorRoleHint: "Changez de rôle pour prévisualiser ou éditer le contenu",
    registerEmailLink: "S'inscrire avec un e-mail personnel",
    guestSession: "Session Invité",
    publicReadOnly: "Lecture publique uniquement",
    myProfile: "Mon Profil",
    accountPortalTitle: "Compte & Accès Contributeur",
    accountPortalSubtitle: "Créez un compte, connectez-vous ou modifiez votre profil",
    roleCapabilitiesTitle: "Permissions des Rôles",
    roleCapabilitiesSubtitle: "Responsabilités éditoriales par niveau d'accès",
    userDirectoryTitle: "Membres & Rôles",
    publish: "Publier",
    approvePublish: "Approuver & Publier",
    statusPublished: "Publié",
    statusVerification: "Validation Savante",
    statusDraft: "Brouillon",
    newRecord: "Nouveau",
    exportSnapshot: "Exporter l'Instantané JSON",
    resetSeed: "Réinitialiser les Données",
    switching: "Changement…",
    selectRole: "Choisir",
    permissionsCount: "permissions",
  },
};

type AdminTabId = "account" | "auliya" | "urs" | "modules" | "economy" | "audit";

interface ExtendedAuliyaFields {
  era?: string;
  shrineArchitecture?: string;
  visitingGuide?: string;
}

type UpsertAuliyaPayload = Partial<ManagedAuliyaRecord> & {
  name: string;
  urduName: string;
  city: string;
  country: string;
} & ExtendedAuliyaFields;

interface AuliyaEditorState {
  editingId: string | null;
  name: string;
  urduName: string;
  arabicName: string;
  alqabText: string;
  silsila: AuliyaProfile["silsila"];
  era: string;
  wiladatHijri: string;
  wisalHijri: string;
  ursMonth: number;
  ursDay: number;
  ursLabel: string;
  city: string;
  country: string;
  lat: string;
  lng: string;
  shrineImage: string;
  featured: boolean;
  shortSummary: string;
  fullTazkirah: string;
  shrineArchitecture: string;
  visitingGuide: string;
  karamatText: string;
  adabText: string;
  khulafaText: string;
  murshidId: string;
  books: AuthoredBook[];
  status: AuliyaProfile["status"];
}

interface UrsEditorState {
  editingId: string | null;
  title: string;
  urduTitle: string;
  subtitle: string;
  day: number;
  month: number;
  durationDays: number;
  type: UrsEventRecord["type"];
  city: string;
  country: string;
  silsila: string;
  auliyaId: string;
  recommendedWird: string;
  featured: boolean;
  status: UrsEventRecord["status"];
}

const ROLE_ORDER: UserRole[] = ["super_admin", "editor", "creator", "member"];

const SILSILA_OPTIONS: AuliyaProfile["silsila"][] = [
  "Qadri",
  "Chishti",
  "Razavi",
  "Naqshbandi",
  "Suhrawardi",
];

const SHRINE_IMAGE_PRESETS = [
  { label: "Baghdad Sharif", url: "/images/shrines/baghdad.jpg" },
  { label: "Ajmer Sharif", url: "/images/shrines/ajmer.jpg" },
  { label: "Bareilly Sharif", url: "/images/shrines/bareilly.jpg" },
];

const PERMISSION_CATALOG: {
  key: PermissionKey;
  label: string;
  domain: "Auliya CMS" | "Urs Calendar" | "Barsi" | "Platform & Economy" | "Security & DB";
}[] = [
  { key: "auliya:create", label: "Create Auliya Drafts", domain: "Auliya CMS" },
  { key: "auliya:edit_own", label: "Edit Own Auliya Profiles", domain: "Auliya CMS" },
  { key: "auliya:edit_any", label: "Edit Any Auliya Biography", domain: "Auliya CMS" },
  { key: "auliya:publish", label: "Verify & Publish Auliya Live", domain: "Auliya CMS" },
  { key: "auliya:delete", label: "Delete Auliya Records", domain: "Auliya CMS" },
  { key: "urs:create", label: "Submit Urs & Sacred Dates", domain: "Urs Calendar" },
  { key: "urs:edit_any", label: "Edit Any Urs Calendar Event", domain: "Urs Calendar" },
  { key: "urs:publish", label: "Approve & Publish Urs Live", domain: "Urs Calendar" },
  { key: "urs:delete", label: "Delete Urs Calendar Events", domain: "Urs Calendar" },
  { key: "barsi:manage_own", label: "Manage Personal Family Barsis", domain: "Barsi" },
  { key: "barsi:moderate_community", label: "Moderate Community Khatm Boards", domain: "Barsi" },
  { key: "modules:manage", label: "Reorder & Toggle App Modules", domain: "Platform & Economy" },
  { key: "zakat:manage_rates", label: "Manage Zakat & Fitrah Rates", domain: "Platform & Economy" },
  { key: "gamification:manage", label: "Configure XP, Ranks & Quests", domain: "Platform & Economy" },
  { key: "settings:manage", label: "Global Settings & Banner", domain: "Platform & Economy" },
  { key: "users:manage", label: "Govern Users & RBAC Roles", domain: "Security & DB" },
  { key: "audit:view", label: "Inspect SHA-256 Audit Ledger", domain: "Security & DB" },
  { key: "db:snapshot", label: "Export & Reset Backend DB", domain: "Security & DB" },
];

const DEMO_SEED_CREDENTIALS: {
  role: UserRole;
  email: string;
  pass: string;
  scholar: string;
}[] = [
  { role: "super_admin", email: "admin@auliyacalendar.org", pass: "Admin@786", scholar: "Mufti Salman Razavi" },
  { role: "editor", email: "editor@auliyacalendar.org", pass: "Editor@786", scholar: "Maulana Tariq Qadri" },
  { role: "creator", email: "creator@auliyacalendar.org", pass: "Creator@786", scholar: "Hafiz Bilal Chishti" },
  { role: "member", email: "member@auliyacalendar.org", pass: "Member@786", scholar: "Tanvir Ahassan" },
];

function parseTabParam(raw: string | null): AdminTabId {
  if (
    raw === "account" ||
    raw === "auliya" ||
    raw === "urs" ||
    raw === "modules" ||
    raw === "economy" ||
    raw === "audit"
  ) {
    return raw;
  }
  return "account";
}

function renderModuleIcon(iconKey: ModuleIconKey, className = "w-4 h-4") {
  switch (iconKey) {
    case "BookOpen":
      return <BookOpen className={className} />;
    case "Clock":
      return <Clock className={className} />;
    case "Sparkles":
      return <Sparkles className={className} />;
    case "Compass":
      return <Compass className={className} />;
    case "Trophy":
      return <Trophy className={className} />;
    case "Scale":
      return <Scale className={className} />;
    case "Calculator":
      return <Calculator className={className} />;
    case "HeartHandshake":
      return <HeartHandshake className={className} />;
    case "ShieldCheck":
    default:
      return <ShieldCheck className={className} />;
  }
}

function createEmptyAuliyaForm(canPublish: boolean): AuliyaEditorState {
  return {
    editingId: null,
    name: "",
    urduName: "",
    arabicName: "",
    alqabText: "Qutb-e-Zaman, Wali-e-Kamil",
    silsila: "Qadri",
    era: "13th Century AH",
    wiladatHijri: "",
    wisalHijri: "",
    ursMonth: 4,
    ursDay: 11,
    ursLabel: "",
    city: "",
    country: "India",
    lat: "27.1767",
    lng: "78.0081",
    shrineImage: "/images/shrines/bareilly.jpg",
    featured: false,
    shortSummary: "",
    fullTazkirah: "",
    shrineArchitecture: "",
    visitingGuide: "",
    karamatText:
      "Thousands revived the Prophetic Sunnah and repented sincerely at his blessed assemblies.",
    adabText:
      "Enter the Dargah precinct in a state of Wudu with lowered gaze and abundant Salawat upon the Prophet ﷺ.\nRecite Surah Al-Fatihah, 3x Surah Al-Ikhlas, and gift the Isal-e-Sawab before making Dua to Allah.",
    khulafaText: "",
    murshidId: "ghaus-e-azam",
    books: [],
    status: canPublish ? "Published" : "Scholarly Verification",
  };
}

function mapRecordToAuliyaForm(rec: ManagedAuliyaRecord): AuliyaEditorState {
  const ext = rec as ManagedAuliyaRecord & ExtendedAuliyaFields;
  const eraVal = ext.era || rec.architecturalDetails?.eraBuilt || "";
  const archVal = ext.shrineArchitecture || rec.architecturalDetails?.style || "";
  const visitVal =
    ext.visitingGuide ||
    (rec.architecturalDetails
      ? [rec.architecturalDetails.visitingHours, rec.architecturalDetails.nearestLandmark]
          .filter(Boolean)
          .join(" • ")
      : "");

  return {
    editingId: rec.id,
    name: rec.name,
    urduName: rec.urduName,
    arabicName: rec.arabicName || rec.urduName,
    alqabText: rec.alqab.join(", "),
    silsila: rec.silsila,
    era: eraVal,
    wiladatHijri: rec.wiladatHijri || "",
    wisalHijri: rec.wisalHijri || "",
    ursMonth: rec.ursMonth,
    ursDay: rec.ursDay,
    ursLabel: rec.ursLabel || "",
    city: rec.city,
    country: rec.country,
    lat: String(rec.lat),
    lng: String(rec.lng),
    shrineImage: rec.shrineImage || "/images/shrines/bareilly.jpg",
    featured: Boolean(rec.featured),
    shortSummary: rec.shortSummary || "",
    fullTazkirah: rec.fullTazkirah || "",
    shrineArchitecture: archVal,
    visitingGuide: visitVal,
    karamatText: (rec.karamat || []).join("\n"),
    adabText: (rec.adabZiyarat || []).join("\n"),
    khulafaText: (rec.khulafaNames || []).join(", "),
    murshidId: rec.murshidId || "",
    books: (rec.books || []).map((b) => ({ ...b })),
    status: rec.status,
  };
}

function createEmptyUrsForm(canPublish: boolean): UrsEditorState {
  return {
    editingId: null,
    title: "",
    urduTitle: "",
    subtitle: "",
    day: 11,
    month: 4,
    durationDays: 1,
    type: "urs",
    city: "",
    country: "India",
    silsila: "Qadri",
    auliyaId: "",
    recommendedWird: "Surah Al-Fatihah, 3x Surah Al-Ikhlas & Durood-e-Pak (100x)",
    featured: false,
    status: canPublish ? "Published" : "Scholarly Verification",
  };
}

function mapRecordToUrsForm(ev: UrsEventRecord): UrsEditorState {
  return {
    editingId: ev.id,
    title: ev.title,
    urduTitle: ev.urduTitle || ev.title,
    subtitle: ev.subtitle || "",
    day: ev.day,
    month: ev.month,
    durationDays: ev.durationDays || 1,
    type: ev.type,
    city: ev.city || "",
    country: ev.country || "",
    silsila: ev.silsila || "",
    auliyaId: ev.auliyaId || "",
    recommendedWird: ev.recommendedWird || "",
    featured: Boolean(ev.featured),
    status: ev.status,
  };
}

function extractErrorMessage(err: unknown, fallback: string): string {
  if (err instanceof Error && err.message) return err.message;
  return fallback;
}

function StatusPill({
  status,
  ui,
}: {
  status: "Published" | "Scholarly Verification" | "Draft";
  ui: AdminUiCopy;
}) {
  if (status === "Published") {
    return (
      <span className="badge-pill badge-emerald">
        <CheckCircle2 className="w-3 h-3" />
        {ui.statusPublished}
      </span>
    );
  }
  if (status === "Scholarly Verification") {
    return (
      <span className="badge-pill badge-gold">
        <Clock className="w-3 h-3" />
        {ui.statusVerification}
      </span>
    );
  }
  return (
    <span
      className="badge-pill border"
      style={{
        backgroundColor: "var(--bg-muted)",
        color: "var(--text-secondary)",
        borderColor: "var(--border-hairline)",
      }}
    >
      <Edit3 className="w-3 h-3" />
      {ui.statusDraft}
    </span>
  );
}

function AdminControlCenterInner() {
  const searchParams = useSearchParams();

  const {
    lang,
    backend,
    backendLoading,
    authUser,
    refreshBackend,
    registerAccount,
    loginAccount,
    switchDemoRole,
    logoutAccount,
    updateMyAccount,
    cmsUpsertAuliya,
    cmsDeleteAuliya,
    cmsUpsertUrs,
    cmsDeleteUrs,
    cmsReviewSubmission,
    cmsSaveModules,
    cmsSaveZakatConfig,
    cmsSaveGamificationConfig,
    cmsSavePlatformSettings,
    cmsAdminUpdateUser,
    cmsVerifyAuditChain,
    cmsExportSnapshot,
    cmsRestoreSnapshot,
    cmsResetDatabase,
    currentRank,
  } = useApp();

  const ui = ADMIN_UI[lang] ?? ADMIN_UI.en;

  const [activeTab, setActiveTab] = useState<AdminTabId>(() =>
    parseTabParam(searchParams.get("tab"))
  );

  // Global status banner notifications
  const [banner, setBanner] = useState<{
    kind: "success" | "error" | "info";
    text: string;
  } | null>(null);
  const [busyAction, setBusyAction] = useState<string | null>(null);

  const notify = useCallback((kind: "success" | "error" | "info", text: string) => {
    setBanner({ kind, text });
  }, []);

  const activeRole: UserRole | null = authUser?.role ?? null;
  const roleMeta = activeRole ? RBAC_ROLES[activeRole] : null;

  // ============================================================================
  // TAB 1 STATE: Account, Self-Registration, Login & User Governance
  // ============================================================================
  const [authFormMode, setAuthFormMode] = useState<"register" | "login" | "profile">("register");
  const [regName, setRegName] = useState("");
  const [regEmail, setRegEmail] = useState("");
  const [regCity, setRegCity] = useState("");
  const [regPassword, setRegPassword] = useState("");
  const [regRole, setRegRole] = useState<"member" | "creator">("creator");
  const [showPassword, setShowPassword] = useState(false);

  const [loginEmail, setLoginEmail] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const [profileDraft, setProfileDraft] = useState<{
    name: string;
    title: string;
    city: string;
  } | null>(null);

  const [userSearch, setUserSearch] = useState("");
  const [userRoleFilter, setUserRoleFilter] = useState<"all" | UserRole>("all");

  // ============================================================================
  // TAB 2 STATE: Auliya Allah CMS
  // ============================================================================
  const canPublishAuliya = hasPermission(activeRole, "auliya:publish");
  const canCreateAuliya = hasPermission(activeRole, "auliya:create");
  const canEditAnyAuliya = hasPermission(activeRole, "auliya:edit_any");
  const canDeleteAuliya = hasPermission(activeRole, "auliya:delete");

  const [auliyaSearch, setAuliyaSearch] = useState("");
  const [auliyaStatusFilter, setAuliyaStatusFilter] = useState<
    "All" | AuliyaProfile["status"]
  >("All");
  const [auliyaSilsilaFilter, setAuliyaSilsilaFilter] = useState<string>("All");
  const [auliyaForm, setAuliyaForm] = useState<AuliyaEditorState>(() =>
    createEmptyAuliyaForm(false)
  );
  const [confirmDeleteAuliyaId, setConfirmDeleteAuliyaId] = useState<string | null>(null);

  // ============================================================================
  // TAB 3 STATE: Urs & Sacred Calendar CMS
  // ============================================================================
  const canCreateUrs = hasPermission(activeRole, "urs:create");
  const canEditAnyUrs = hasPermission(activeRole, "urs:edit_any");
  const canPublishUrs = hasPermission(activeRole, "urs:publish");
  const canDeleteUrs = hasPermission(activeRole, "urs:delete");

  const [ursSearch, setUrsSearch] = useState("");
  const [ursMonthFilter, setUrsMonthFilter] = useState<number>(0); // 0 = All
  const [ursTypeFilter, setUrsTypeFilter] = useState<"all" | UrsEventRecord["type"]>("all");
  const [ursStatusFilter, setUrsStatusFilter] = useState<"All" | UrsEventRecord["status"]>("All");
  const [ursForm, setUrsForm] = useState<UrsEditorState>(() => createEmptyUrsForm(false));
  const [confirmDeleteUrsId, setConfirmDeleteUrsId] = useState<string | null>(null);

  // ============================================================================
  // TAB 4 STATE: Modular Dashboard Builder & Global Platform Settings
  // ============================================================================
  const canManageModules = hasPermission(activeRole, "modules:manage");
  const canManageSettings = hasPermission(activeRole, "settings:manage");

  const [modulesDraft, setModulesDraft] = useState<ModuleConfigRecord[] | null>(null);
  const [settingsDraft, setSettingsDraft] = useState<PlatformSettings | null>(null);

  const activeModules = useMemo(
    () =>
      (modulesDraft ?? backend.modules)
        .slice()
        .sort((a, b) => a.order - b.order),
    [modulesDraft, backend.modules]
  );
  const activeSettings = settingsDraft ?? backend.platformSettings;

  // ============================================================================
  // TAB 5 STATE: Zakat & Gamification Engine
  // ============================================================================
  const canManageZakat = hasPermission(activeRole, "zakat:manage_rates");
  const canManageGamification = hasPermission(activeRole, "gamification:manage");

  const [zakatDraft, setZakatDraft] = useState<ZakatBackendConfig | null>(null);
  const [currencySearch, setCurrencySearch] = useState("");
  const [gamificationDraft, setGamificationDraft] = useState<GamificationConfig | null>(null);

  const activeZakat = zakatDraft ?? backend.zakatConfig;
  const activeGamification = gamificationDraft ?? backend.gamificationConfig;

  // ============================================================================
  // TAB 6 STATE: SHA-256 Audit Trail & DB Snapshot
  // ============================================================================
  const canSnapshotDb = hasPermission(activeRole, "db:snapshot");
  const [auditSearch, setAuditSearch] = useState("");
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null);
  const [exportedJson, setExportedJson] = useState<string | null>(null);
  const [copiedSnapshot, setCopiedSnapshot] = useState(false);
  const [armResetConfirm, setArmResetConfirm] = useState(false);

  // ============================================================================
  // HANDLERS: RBAC Role Switch, Auth, Profile & User Governance
  // ============================================================================
  const handleQuickRoleSwitch = useCallback(
    async (role: UserRole) => {
      setBusyAction(`role-${role}`);
      try {
        await switchDemoRole(role);
        setProfileDraft(null);
        notify(
          "success",
          `${tp(lang, RBAC_ROLES[role].label)} (${RBAC_ROLES[role].arabicBadge})`
        );
      } catch (err) {
        notify("error", extractErrorMessage(err, "Could not switch contributor role."));
      } finally {
        setBusyAction(null);
      }
    },
    [switchDemoRole, notify, lang]
  );

  const handleRegisterSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction("register");
    try {
      await registerAccount({
        name: regName,
        email: regEmail,
        password: regPassword,
        city: regCity || "Global",
        requestedRole: regRole,
      });
      setRegName("");
      setRegEmail("");
      setRegCity("");
      setRegPassword("");
      setProfileDraft(null);
      setAuthFormMode("profile");
      notify(
        "success",
        `Alhamdulillah! ${tp(
          lang,
          regRole === "creator" ? "Curator / Creator" : "Community Member"
        )} — ${t(lang, "createAccount")}.`
      );
    } catch (err) {
      notify("error", extractErrorMessage(err, "Registration failed."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction("login");
    try {
      await loginAccount({ email: loginEmail, password: loginPassword });
      setLoginPassword("");
      setProfileDraft(null);
      setAuthFormMode("profile");
      notify("success", `Signed in as ${loginEmail}. Session token verified.`);
    } catch (err) {
      notify("error", extractErrorMessage(err, "Sign-in failed."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleLogout = async () => {
    setBusyAction("logout");
    try {
      await logoutAccount();
      setProfileDraft(null);
      setAuthFormMode("login");
      notify("info", "Signed out of backend session. Now browsing in Guest mode.");
    } catch (err) {
      notify("error", extractErrorMessage(err, "Sign-out failed."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleProfileSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!authUser) return;
    const patch = profileDraft ?? {
      name: authUser.name,
      title: authUser.title,
      city: authUser.city,
    };
    setBusyAction("profile");
    try {
      await updateMyAccount(patch);
      setProfileDraft(null);
      notify("success", "Personal sanctuary profile updated.");
    } catch (err) {
      notify("error", extractErrorMessage(err, "Could not update profile."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleAdminUserPatch = async (
    targetUserId: string,
    patch: { role?: UserRole; status?: "active" | "suspended" }
  ) => {
    setBusyAction(`usr-${targetUserId}`);
    try {
      await cmsAdminUpdateUser({ targetUserId, ...patch });
      notify("success", "User RBAC governance record updated & logged to SHA-256 audit chain.");
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to update user role/status."));
    } finally {
      setBusyAction(null);
    }
  };

  // ============================================================================
  // HANDLERS: Auliya Allah CMS
  // ============================================================================
  const filteredAuliyaRecords = useMemo(() => {
    const q = auliyaSearch.trim().toLowerCase();
    return backend.auliyaRecords.filter((rec) => {
      if (auliyaStatusFilter !== "All" && rec.status !== auliyaStatusFilter) return false;
      if (auliyaSilsilaFilter !== "All" && rec.silsila !== auliyaSilsilaFilter) return false;
      if (!q) return true;
      return (
        rec.name.toLowerCase().includes(q) ||
        rec.urduName.includes(auliyaSearch.trim()) ||
        (rec.arabicName || "").includes(auliyaSearch.trim()) ||
        rec.city.toLowerCase().includes(q) ||
        rec.country.toLowerCase().includes(q) ||
        rec.silsila.toLowerCase().includes(q) ||
        rec.alqab.some((t) => t.toLowerCase().includes(q)) ||
        rec.createdByName.toLowerCase().includes(q)
      );
    });
  }, [backend.auliyaRecords, auliyaSearch, auliyaStatusFilter, auliyaSilsilaFilter]);

  const auliyaCounts = useMemo(() => {
    let published = 0;
    let pending = 0;
    let draft = 0;
    for (const r of backend.auliyaRecords) {
      if (r.status === "Published") published++;
      else if (r.status === "Scholarly Verification") pending++;
      else draft++;
    }
    return { total: backend.auliyaRecords.length, published, pending, draft };
  }, [backend.auliyaRecords]);

  const handleLoadAuliyaForEdit = (rec: ManagedAuliyaRecord) => {
    setAuliyaForm(mapRecordToAuliyaForm(rec));
    notify("info", `Loaded "${rec.name}" into the Rich Auliya Profile Editor.`);
  };

  const handleSaveAuliya = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auliyaForm.name.trim() || !auliyaForm.urduName.trim()) {
      notify("error", "Both English Name and Urdu Name are required.");
      return;
    }
    if (!auliyaForm.city.trim() || !auliyaForm.country.trim()) {
      notify("error", "Shrine City and Country are required.");
      return;
    }

    const existing = auliyaForm.editingId
      ? backend.auliyaRecords.find((r) => r.id === auliyaForm.editingId)
      : undefined;

    const alqab = auliyaForm.alqabText
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
    const karamat = auliyaForm.karamatText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const adabZiyarat = auliyaForm.adabText
      .split("\n")
      .map((s) => s.trim())
      .filter(Boolean);
    const khulafaNames = auliyaForm.khulafaText
      .split(/[,\n]+/)
      .map((s) => s.trim())
      .filter(Boolean);

    const cleanBooks: AuthoredBook[] = auliyaForm.books
      .filter((b) => b.title.trim().length > 0)
      .map((b) => ({
        ...b,
        title: b.title.trim(),
        arabicOrUrduTitle: b.arabicOrUrduTitle.trim() || b.title.trim(),
        genre: b.genre.trim() || "Tasawwuf & Fiqh",
        summary: b.summary.trim() || "Classical Sunni scholarly treatise.",
        excerpt: b.excerpt.trim() || b.summary.trim() || "Preserved in the Sunni Archive.",
      }));

    const effectiveStatus: AuliyaProfile["status"] = canPublishAuliya
      ? auliyaForm.status
      : auliyaForm.status === "Draft"
      ? "Draft"
      : "Scholarly Verification";

    const parsedLat = Number(auliyaForm.lat);
    const parsedLng = Number(auliyaForm.lng);
    const monthLabel = HIJRI_MONTHS[(auliyaForm.ursMonth - 1 + 12) % 12] || "Rabi' al-Thani";

    const payload: UpsertAuliyaPayload = {
      ...(existing ? existing : {}),
      id: auliyaForm.editingId || undefined,
      name: auliyaForm.name.trim(),
      urduName: auliyaForm.urduName.trim(),
      arabicName: auliyaForm.arabicName.trim() || auliyaForm.urduName.trim(),
      alqab: alqab.length ? alqab : [auliyaForm.silsila],
      silsila: auliyaForm.silsila,
      era: auliyaForm.era.trim() || undefined,
      wiladatHijri: auliyaForm.wiladatHijri.trim() || "Verified Sunni Archive",
      wisalHijri: auliyaForm.wisalHijri.trim() || `${auliyaForm.ursDay} ${monthLabel}`,
      ursMonth: auliyaForm.ursMonth,
      ursDay: auliyaForm.ursDay,
      ursLabel:
        auliyaForm.ursLabel.trim() || `Urs (${auliyaForm.ursDay} ${monthLabel})`,
      city: auliyaForm.city.trim(),
      country: auliyaForm.country.trim(),
      lat: Number.isFinite(parsedLat) ? parsedLat : 27.1767,
      lng: Number.isFinite(parsedLng) ? parsedLng : 78.0081,
      shrineImage: auliyaForm.shrineImage.trim() || "/images/shrines/bareilly.jpg",
      featured: auliyaForm.featured,
      shortSummary:
        auliyaForm.shortSummary.trim() ||
        "Illustrious Sunni Sufi master and beacon of Sacred Law and Tariqah.",
      fullTazkirah:
        auliyaForm.fullTazkirah.trim() ||
        auliyaForm.shortSummary.trim() ||
        "Biography curated through the Sanctuary Scholarly CMS.",
      shrineArchitecture: auliyaForm.shrineArchitecture.trim() || undefined,
      visitingGuide: auliyaForm.visitingGuide.trim() || undefined,
      architecturalDetails: {
        style:
          auliyaForm.shrineArchitecture.trim() ||
          existing?.architecturalDetails?.style ||
          "Traditional Indo-Islamic & Sacred Sanctuary Architecture",
        eraBuilt:
          auliyaForm.era.trim() ||
          existing?.architecturalDetails?.eraBuilt ||
          auliyaForm.wiladatHijri.trim() ||
          "Classical Era",
        patronage: existing?.architecturalDetails?.patronage || "Sunni Waqf Endowment",
        keyFeatures: existing?.architecturalDetails?.keyFeatures || [
          "Blessed Mazar-e-Aqdas Dome",
          "Jami Masjid & Sama / Dhikr Courtyard",
        ],
        visitingHours:
          auliyaForm.visitingGuide.trim() ||
          existing?.architecturalDetails?.visitingHours ||
          "Open daily Fajr to Isha",
        nearestLandmark:
          existing?.architecturalDetails?.nearestLandmark ||
          `${auliyaForm.city.trim()}, ${auliyaForm.country.trim()}`,
      },
      karamat: karamat.length
        ? karamat
        : ["Preserved in authentic Sunni Tazkirah sources."],
      adabZiyarat: adabZiyarat.length
        ? adabZiyarat
        : ["Enter with Wudu and recite Salawat upon the Prophet ﷺ."],
      khulafaNames,
      murshidId: auliyaForm.murshidId || undefined,
      books: cleanBooks,
      status: effectiveStatus,
    };

    setBusyAction("save-auliya");
    try {
      await cmsUpsertAuliya(payload);
      notify(
        "success",
        canPublishAuliya
          ? `Saved "${payload.name}" with status [${effectiveStatus}].`
          : `Saved "${payload.name}" as [${effectiveStatus}] — routed for Scholar Editor verification.`
      );
      if (!auliyaForm.editingId) {
        setAuliyaForm(createEmptyAuliyaForm(canPublishAuliya));
      }
    } catch (err) {
      notify("error", extractErrorMessage(err, "Could not save Auliya profile."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleQuickApproveAuliya = async (rec: ManagedAuliyaRecord) => {
    setBusyAction(`pub-auliya-${rec.id}`);
    try {
      await cmsUpsertAuliya({
        ...rec,
        status: "Published",
      });
      notify("success", `Approved & Published "${rec.name}" to the live Auliya Directory!`);
    } catch (err) {
      notify("error", extractErrorMessage(err, "Could not publish Auliya record."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleDeleteAuliya = async (id: string, name: string) => {
    setBusyAction(`del-auliya-${id}`);
    try {
      await cmsDeleteAuliya(id);
      setConfirmDeleteAuliyaId(null);
      if (auliyaForm.editingId === id) {
        setAuliyaForm(createEmptyAuliyaForm(canPublishAuliya));
      }
      notify("info", `Deleted Auliya profile "${name}" from database.`);
    } catch (err) {
      notify("error", extractErrorMessage(err, "Could not delete Auliya record."));
    } finally {
      setBusyAction(null);
    }
  };

  // ============================================================================
  // HANDLERS: Urs & Sacred Calendar CMS
  // ============================================================================
  const filteredUrsEvents = useMemo(() => {
    const q = ursSearch.trim().toLowerCase();
    return backend.ursEvents
      .filter((ev) => {
        if (ursMonthFilter > 0 && ev.month !== ursMonthFilter) return false;
        if (ursTypeFilter !== "all" && ev.type !== ursTypeFilter) return false;
        if (ursStatusFilter !== "All" && ev.status !== ursStatusFilter) return false;
        if (!q) return true;
        return (
          ev.title.toLowerCase().includes(q) ||
          ev.urduTitle.includes(ursSearch.trim()) ||
          ev.subtitle.toLowerCase().includes(q) ||
          ev.city.toLowerCase().includes(q) ||
          ev.country.toLowerCase().includes(q) ||
          ev.recommendedWird.toLowerCase().includes(q)
        );
      })
      .sort((a, b) => a.month * 31 + a.day - (b.month * 31 + b.day));
  }, [backend.ursEvents, ursSearch, ursMonthFilter, ursTypeFilter, ursStatusFilter]);

  const handleSaveUrs = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!ursForm.title.trim()) {
      notify("error", "Event Title is required.");
      return;
    }

    const effectiveStatus: UrsEventRecord["status"] = canPublishUrs
      ? ursForm.status
      : ursForm.status === "Draft"
      ? "Draft"
      : "Scholarly Verification";

    setBusyAction("save-urs");
    try {
      await cmsUpsertUrs({
        id: ursForm.editingId || undefined,
        title: ursForm.title.trim(),
        urduTitle: ursForm.urduTitle.trim() || ursForm.title.trim(),
        subtitle:
          ursForm.subtitle.trim() ||
          `${ursForm.day} ${HIJRI_MONTHS[(ursForm.month - 1 + 12) % 12]} — Annual Commemoration`,
        day: ursForm.day,
        month: ursForm.month,
        durationDays: Math.max(1, ursForm.durationDays || 1),
        type: ursForm.type,
        city: ursForm.city.trim() || "Global",
        country: ursForm.country.trim() || "Ummah",
        silsila: ursForm.silsila.trim() || undefined,
        auliyaId: ursForm.auliyaId || undefined,
        recommendedWird:
          ursForm.recommendedWird.trim() ||
          "Surah Al-Fatihah, 3x Surah Al-Ikhlas & Durood-e-Pak",
        featured: ursForm.featured,
        status: effectiveStatus,
      });
      notify("success", `Saved Sacred Calendar Event "${ursForm.title.trim()}" [${effectiveStatus}].`);
      if (!ursForm.editingId) {
        setUrsForm(createEmptyUrsForm(canPublishUrs));
      }
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to save Urs event."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleQuickApproveUrs = async (ev: UrsEventRecord) => {
    setBusyAction(`pub-urs-${ev.id}`);
    try {
      await cmsUpsertUrs({
        ...ev,
        status: "Published",
      });
      notify("success", `Approved & Published "${ev.title}" to the Sacred Hijri Calendar!`);
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to publish Urs event."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleDeleteUrs = async (id: string, title: string) => {
    setBusyAction(`del-urs-${id}`);
    try {
      await cmsDeleteUrs(id);
      setConfirmDeleteUrsId(null);
      if (ursForm.editingId === id) {
        setUrsForm(createEmptyUrsForm(canPublishUrs));
      }
      notify("info", `Deleted calendar event "${title}".`);
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to delete Urs event."));
    } finally {
      setBusyAction(null);
    }
  };

  // ============================================================================
  // HANDLERS: Modular Dashboard Builder & Global Platform Settings
  // ============================================================================
  const updateModuleItem = (id: string, patch: Partial<ModuleConfigRecord>) => {
    const base = activeModules.map((m) => (m.id === id ? { ...m, ...patch } : m));
    setModulesDraft(base);
  };

  const moveModuleOrder = (index: number, direction: -1 | 1) => {
    const nextIdx = index + direction;
    if (nextIdx < 0 || nextIdx >= activeModules.length) return;
    const copy = activeModules.map((m) => ({ ...m }));
    const temp = copy[index];
    copy[index] = copy[nextIdx];
    copy[nextIdx] = temp;
    const normalized = copy.map((m, i) => ({ ...m, order: i + 1 }));
    setModulesDraft(normalized);
  };

  const handleSaveModulesLayout = async () => {
    setBusyAction("save-modules");
    try {
      await cmsSaveModules(activeModules);
      setModulesDraft(null);
      notify(
        "success",
        "Modular Dashboard & Navigation layout saved! Changes are live across Dashboard & AppShell."
      );
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to save modular layout."));
    } finally {
      setBusyAction(null);
    }
  };

  const updateSettingsField = <K extends keyof PlatformSettings>(
    key: K,
    val: PlatformSettings[K]
  ) => {
    setSettingsDraft({
      ...activeSettings,
      [key]: val,
    });
  };

  const handleSavePlatformSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setBusyAction("save-settings");
    try {
      await cmsSavePlatformSettings(activeSettings);
      setSettingsDraft(null);
      notify("success", "Global Platform Settings & Announcement Banner saved!");
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to save platform settings."));
    } finally {
      setBusyAction(null);
    }
  };

  // ============================================================================
  // HANDLERS: Zakat & Gamification Engine
  // ============================================================================
  const updateZakatTopField = <K extends keyof ZakatBackendConfig>(
    key: K,
    val: ZakatBackendConfig[K]
  ) => {
    setZakatDraft({
      ...activeZakat,
      [key]: val,
    });
  };

  const updateZakatCurrency = (
    code: string,
    field: keyof ZakatCurrencyConfig,
    val: number
  ) => {
    setZakatDraft({
      ...activeZakat,
      currencies: activeZakat.currencies.map((c) =>
        c.code === code ? { ...c, [field]: Number.isFinite(val) ? val : 0 } : c
      ),
    });
  };

  const handleSaveZakat = async () => {
    setBusyAction("save-zakat");
    try {
      await cmsSaveZakatConfig(activeZakat);
      setZakatDraft(null);
      notify(
        "success",
        `Saved Hanafi Nisab & Sadaqat-ul-Fitr benchmarks across ${activeZakat.currencies.length} currencies!`
      );
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to save Zakat benchmarks."));
    } finally {
      setBusyAction(null);
    }
  };

  const updateXpReward = (
    key: keyof GamificationConfig["xpRewards"],
    val: number
  ) => {
    setGamificationDraft({
      ...activeGamification,
      xpRewards: {
        ...activeGamification.xpRewards,
        [key]: Math.max(0, Math.round(Number.isFinite(val) ? val : 0)),
      },
    });
  };

  const updateDailyQuest = (questId: string, patch: Partial<DailyQuestConfig>) => {
    setGamificationDraft({
      ...activeGamification,
      dailyQuests: activeGamification.dailyQuests.map((q) =>
        q.id === questId ? { ...q, ...patch } : q
      ),
    });
  };

  const handleSaveGamification = async () => {
    setBusyAction("save-gamification");
    try {
      await cmsSaveGamificationConfig(activeGamification);
      setGamificationDraft(null);
      notify("success", "Saved Gamification XP Rewards & Daily Barakah Quests!");
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to save Gamification config."));
    } finally {
      setBusyAction(null);
    }
  };

  // ============================================================================
  // HANDLERS: Audit Chain & Database Snapshot / Reset
  // ============================================================================
  const filteredAuditLogs = useMemo(() => {
    const q = auditSearch.trim().toLowerCase();
    if (!q) return backend.auditLogs;
    return backend.auditLogs.filter(
      (log) =>
        log.action.toLowerCase().includes(q) ||
        log.actorName.toLowerCase().includes(q) ||
        log.actorRole.toLowerCase().includes(q) ||
        log.target.toLowerCase().includes(q) ||
        log.hash.toLowerCase().includes(q)
    );
  }, [backend.auditLogs, auditSearch]);

  const auditChainIntact = useMemo(() => {
    const logs = backend.auditLogs;
    if (logs.length <= 1) return true;
    // Logs are ordered newest first: logs[i].prevHash === logs[i + 1].hash
    for (let i = 0; i < logs.length - 1; i++) {
      if (logs[i].prevHash !== logs[i + 1].hash) return false;
    }
    return true;
  }, [backend.auditLogs]);

  const handleExportSnapshot = async () => {
    setBusyAction("export-db");
    try {
      const json = await cmsExportSnapshot();
      setExportedJson(json);
      if (typeof window !== "undefined") {
        const blob = new Blob([json], { type: "application/json" });
        const url = URL.createObjectURL(blob);
        const a = document.createElement("a");
        const dateStamp = new Date().toISOString().slice(0, 10);
        a.href = url;
        a.download = `auliya-sanctuary-db-snapshot-${dateStamp}.json`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }
      notify("success", "Full Backend Database JSON Snapshot exported & downloaded!");
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to export database snapshot."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleResetDatabase = async () => {
    setBusyAction("reset-db");
    try {
      await cmsResetDatabase();
      setArmResetConfirm(false);
      setExportedJson(null);
      setModulesDraft(null);
      setSettingsDraft(null);
      setZakatDraft(null);
      setGamificationDraft(null);
      notify(
        "success",
        "Backend database restored to clean Sunni Sanctuary seed & re-authenticated as Super Admin."
      );
    } catch (err) {
      notify("error", extractErrorMessage(err, "Database reset failed."));
    } finally {
      setBusyAction(null);
    }
  };

  const [reviewNotesMap, setReviewNotesMap] = useState<Record<string, string>>({});
  const [auditVerifyStatus, setAuditVerifyStatus] = useState<{
    valid: boolean;
    checkedCount: number;
    brokenAtId?: string;
  } | null>(null);
  const existingSb = useMemo(() => getSupabaseConfig(), []);
  const [sbUrl, setSbUrl] = useState(() => existingSb?.url || "");
  const [sbAnonKey, setSbAnonKey] = useState(() => existingSb?.anonKey || "");
  const [sbTestResult, setSbTestResult] = useState<string | null>(null);

  const pendingAuliya = useMemo(
    () => backend.auliyaRecords.filter((a) => a.status !== "Published"),
    [backend.auliyaRecords]
  );
  const pendingUrs = useMemo(
    () => backend.ursEvents.filter((u) => u.status !== "Published"),
    [backend.ursEvents]
  );

  const handleReviewSubmission = async (
    targetType: "auliya" | "urs",
    id: string,
    decision: "approve" | "request_changes"
  ) => {
    setBusyAction(`review-${targetType}-${id}`);
    try {
      const notes = reviewNotesMap[`${targetType}:${id}`]?.trim();
      await cmsReviewSubmission({ targetType, id, decision, reviewNotes: notes || undefined });
      notify(
        "success",
        decision === "approve"
          ? "Submission approved and published to the live directory."
          : "Returned to Draft with editorial review notes."
      );
    } catch (err) {
      notify("error", extractErrorMessage(err, "Review action failed."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleVerifyAuditChain = async () => {
    setBusyAction("verify-audit");
    try {
      const report = await cmsVerifyAuditChain();
      setAuditVerifyStatus(report);
      notify(
        report.valid ? "success" : "error",
        report.valid
          ? `Cryptographic SHA-256 chain verified across ${report.checkedCount} audit entries.`
          : `Hash mismatch detected at entry ${report.brokenAtId || "unknown"}.`
      );
    } catch (err) {
      notify("error", extractErrorMessage(err, "Could not verify audit chain."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleRestoreSnapshotFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setBusyAction("restore-db");
    try {
      const text = await file.text();
      await cmsRestoreSnapshot(text);
      setModulesDraft(null);
      setSettingsDraft(null);
      setZakatDraft(null);
      setGamificationDraft(null);
      notify("success", `Database snapshot restored cleanly from ${file.name}.`);
    } catch (err) {
      notify("error", extractErrorMessage(err, "Failed to restore snapshot JSON."));
    } finally {
      e.target.value = "";
      setBusyAction(null);
    }
  };

  const handleConnectSupabase = async () => {
    if (!sbUrl.trim() || !sbAnonKey.trim()) {
      notify("error", "Enter both Supabase Project URL and Anon Key.");
      return;
    }
    setBusyAction("sb-connect");
    try {
      const test = await testSupabaseConnection(sbUrl, sbAnonKey);
      setSbTestResult(test.message);
      if (!test.ok) {
        notify("error", test.message);
        return;
      }
      setSupabaseRuntimeConfig({ url: sbUrl.trim(), anonKey: sbAnonKey.trim() });
      await refreshBackend();
      notify("success", "Connected to Supabase PostgreSQL + Auth + RLS.");
    } catch (err) {
      notify("error", extractErrorMessage(err, "Supabase connection failed."));
    } finally {
      setBusyAction(null);
    }
  };

  const handleDisconnectSupabase = async () => {
    setSupabaseRuntimeConfig(null);
    setSbUrl("");
    setSbAnonKey("");
    setSbTestResult(null);
    await refreshBackend();
    notify("info", "Disconnected runtime Supabase connector; using Server/Local Engine.");
  };

  const filteredUsers = useMemo(() => {
    const list = backend.users ?? [];
    const q = userSearch.trim().toLowerCase();
    return list.filter((u) => {
      if (userRoleFilter !== "all" && u.role !== userRoleFilter) return false;
      if (!q) return true;
      return (
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.city.toLowerCase().includes(q) ||
        u.title.toLowerCase().includes(q) ||
        u.role.toLowerCase().includes(q)
      );
    });
  }, [backend.users, userSearch, userRoleFilter]);

  const filteredCurrencies = useMemo(() => {
    const q = currencySearch.trim().toLowerCase();
    if (!q) return activeZakat.currencies;
    return activeZakat.currencies.filter(
      (c) =>
        c.code.toLowerCase().includes(q) ||
        c.name.toLowerCase().includes(q) ||
        c.symbol.toLowerCase().includes(q)
    );
  }, [activeZakat.currencies, currencySearch]);

  const tabs: {
    id: AdminTabId;
    label: string;
    shortBadge: string;
    icon: React.ReactNode;
  }[] = [
    {
      id: "account",
      label: tl(lang, "adminTabOverview", ui.tabOverview),
      shortBadge: roleMeta ? tp(lang, roleMeta.label) : t(lang, "guestMode"),
      icon: <Shield className="w-4 h-4" />,
    },
    {
      id: "auliya",
      label: tl(lang, "adminTabAuliya", ui.tabAuliya),
      shortBadge:
        auliyaCounts.pending > 0
          ? `${auliyaCounts.total} • ${auliyaCounts.pending}`
          : `${auliyaCounts.total}`,
      icon: <Compass className="w-4 h-4" />,
    },
    {
      id: "urs",
      label: tl(lang, "adminTabUrs", ui.tabUrs),
      shortBadge: `${backend.ursEvents.length}`,
      icon: <Calendar className="w-4 h-4" />,
    },
    {
      id: "modules",
      label: tl(lang, "adminTabModules", ui.tabModules),
      shortBadge: `${activeModules.filter((m) => m.enabled).length}/${activeModules.length}`,
      icon: <LayoutGrid className="w-4 h-4" />,
    },
    {
      id: "economy",
      label: tl(lang, "adminTabZakat", ui.tabZakat),
      shortBadge: `${activeZakat.currencies.length}`,
      icon: <Coins className="w-4 h-4" />,
    },
    {
      id: "audit",
      label: tl(lang, "adminTabAudit", ui.tabAudit),
      shortBadge: `${backend.auditLogs.length}`,
      icon: <Hash className="w-4 h-4" />,
    },
  ];

  return (
    <div className="space-y-3.5 sm:space-y-6 pb-8">
      {/* ===================================================================== */}
      {/* 1. SANCTUARY STUDIO EDITORIAL HEADER & CONTRIBUTOR ROLE BAR           */}
      {/* ===================================================================== */}
      <section className="sanctuary-halo-card p-3.5 sm:p-6 space-y-3.5 sm:space-y-5 relative overflow-hidden">
        {/* Top Row: Studio Title & Active Contributor Card */}
        <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span
                className="badge-pill"
                style={{
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-primary)",
                  border: "1px solid var(--border-hairline)",
                }}
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                {ui.studioEyebrow}
              </span>

              <button
                type="button"
                onClick={async () => {
                  setBusyAction("sync");
                  try {
                    await refreshBackend();
                    notify("info", `${tp(lang, "Refresh")} — ${t(lang, "navAdmin")}`);
                  } finally {
                    setBusyAction(null);
                  }
                }}
                aria-label={tp(lang, "Refresh")}
                className="px-2.5 py-1 rounded-full text-[11px] font-semibold inline-flex items-center gap-1 border cursor-pointer transition-opacity hover:opacity-90"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                  color: "var(--text-secondary)",
                }}
              >
                <RefreshCw
                  className={`w-3 h-3 ${
                    busyAction === "sync" || backendLoading ? "animate-spin" : ""
                  }`}
                />
                <span>{tp(lang, "Refresh")}</span>
              </button>
            </div>

            <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
              {t(lang, "navAdmin")}
            </h1>
            <p className="text-xs sm:text-sm max-w-2xl line-clamp-2 sm:line-clamp-none" style={{ color: "var(--text-secondary)" }}>
              {tl(lang, "adminSubtitle", ui.subtitle)}
            </p>
          </div>

          {/* Active Signed-In Contributor / Guest Card */}
          <div
            className="rounded-2xl p-3 sm:p-4 border min-w-0 sm:min-w-[270px] flex flex-col gap-2"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-hairline)",
            }}
          >
            {authUser && roleMeta ? (
              <>
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div
                      className="w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm text-white shrink-0 shadow-sm"
                      style={{ backgroundColor: authUser.avatarColor || roleMeta.badgeColor }}
                    >
                      {authUser.name
                        .split(" ")
                        .map((w) => w[0])
                        .slice(0, 2)
                        .join("")
                        .toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold text-sm truncate">{authUser.name}</div>
                      <div
                        className="text-[11px] truncate"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {authUser.email}
                      </div>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={handleLogout}
                    disabled={busyAction === "logout"}
                    aria-label={t(lang, "signOut")}
                    className="p-2 rounded-xl border cursor-pointer transition-colors hover:opacity-80"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-secondary)",
                    }}
                    title={t(lang, "signOut")}
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>

                <div
                  className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <span
                    className="px-2.5 py-1 rounded-full text-[11px] font-bold inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor: `${roleMeta.badgeColor}22`,
                      color: roleMeta.badgeColor,
                      border: `1px solid ${roleMeta.badgeColor}55`,
                    }}
                  >
                    <Crown className="w-3 h-3" />
                    <span>{tp(lang, roleMeta.label)}</span>
                    <span className="font-urdu text-xs opacity-90">• {roleMeta.arabicBadge}</span>
                  </span>
                  <span className="text-[11px] font-medium truncate" style={{ color: "var(--text-muted)" }}>
                    {authUser.title || authUser.city}
                  </span>
                </div>
              </>
            ) : (
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-bold text-xs border"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      <Users className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">{ui.guestSession}</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {ui.publicReadOnly}
                      </div>
                    </div>
                  </div>
                  <span
                    className="badge-pill border"
                    style={{
                      backgroundColor: "var(--bg-surface)",
                      borderColor: "var(--border-hairline)",
                      color: "var(--text-secondary)",
                    }}
                  >
                    {t(lang, "guestMode")}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("account");
                      setAuthFormMode("register");
                    }}
                    className="btn-primary flex-1 py-1.5 px-3 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    {t(lang, "createAccount")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setActiveTab("account");
                      setAuthFormMode("login");
                    }}
                    className="py-1.5 px-3 rounded-xl text-xs font-semibold border inline-flex items-center justify-center gap-1.5 cursor-pointer"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-surface)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    {t(lang, "signIn")}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Editorial Contributor Role Switcher Strip */}
        <div
          className="p-2.5 sm:p-3.5 rounded-2xl border space-y-2"
          style={{
            backgroundColor: "var(--bg-surface)",
            borderColor: "var(--border-hairline)",
          }}
        >
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs font-bold">
              <Shield className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
              <span>{ui.contributorRole}</span>
              <span className="font-normal hidden sm:inline" style={{ color: "var(--text-muted)" }}>
                — {ui.contributorRoleHint}
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                setActiveTab("account");
                setAuthFormMode("register");
              }}
              className="text-[11px] font-semibold underline cursor-pointer"
              style={{ color: "var(--accent-primary)" }}
            >
              {ui.registerEmailLink}
            </button>
          </div>

          <div className="flex lg:grid lg:grid-cols-4 gap-2 overflow-x-auto no-scrollbar pb-0.5">
            {ROLE_ORDER.map((rKey) => {
              const meta = RBAC_ROLES[rKey];
              const isSelected = activeRole === rKey;
              const isSwitching = busyAction === `role-${rKey}`;
              return (
                <button
                  key={rKey}
                  type="button"
                  onClick={() => handleQuickRoleSwitch(rKey)}
                  disabled={Boolean(busyAction)}
                  aria-label={tp(lang, meta.label)}
                  className="w-[175px] sm:w-[200px] lg:w-full shrink-0 p-2.5 sm:p-3 rounded-xl border text-left transition-all cursor-pointer relative overflow-hidden group"
                  style={{
                    backgroundColor: isSelected ? `${meta.badgeColor}18` : "var(--bg-elevated)",
                    borderColor: isSelected ? meta.badgeColor : "var(--border-hairline)",
                    boxShadow: isSelected ? `0 8px 22px -8px ${meta.badgeColor}66` : "none",
                  }}
                >
                  <div className="flex items-center justify-between gap-1.5">
                    <span
                      className="text-xs font-extrabold flex items-center gap-1.5"
                      style={{ color: isSelected ? meta.badgeColor : "var(--text-primary)" }}
                    >
                      <span
                        className="w-2 h-2 rounded-full shrink-0"
                        style={{ backgroundColor: meta.badgeColor }}
                      />
                      {tp(lang, meta.label)}
                    </span>
                    <span className="font-urdu text-xs" style={{ color: meta.badgeColor }}>
                      {meta.arabicBadge}
                    </span>
                  </div>
                  <div
                    className="mt-1 flex items-center justify-between text-[11px]"
                    style={{ color: "var(--text-muted)" }}
                  >
                    <span>
                      {meta.permissions.length} {ui.permissionsCount}
                    </span>
                    <span
                      className="font-semibold inline-flex items-center gap-1"
                      style={{ color: isSelected ? meta.badgeColor : "var(--text-secondary)" }}
                    >
                      {isSwitching ? (
                        ui.switching
                      ) : isSelected ? (
                        <>
                          <Check className="w-3 h-3" />
                          <span>{tp(lang, "Active")}</span>
                        </>
                      ) : (
                        ui.selectRole
                      )}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Global Toast / Action Feedback Banner */}
      <AnimatePresence mode="wait">
        {banner && (
          <motion.div
            key={banner.text}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
            className="p-3.5 rounded-2xl border flex items-center justify-between gap-3 text-xs sm:text-sm font-medium"
            style={{
              backgroundColor:
                banner.kind === "error"
                  ? "rgba(239, 68, 68, 0.14)"
                  : banner.kind === "success"
                  ? "rgba(16, 185, 129, 0.14)"
                  : "var(--accent-soft)",
              borderColor:
                banner.kind === "error"
                  ? "rgba(239, 68, 68, 0.4)"
                  : banner.kind === "success"
                  ? "rgba(16, 185, 129, 0.4)"
                  : "var(--border-hairline)",
              color:
                banner.kind === "error"
                  ? "#F87171"
                  : banner.kind === "success"
                  ? "#10B981"
                  : "var(--text-primary)",
            }}
          >
            <div className="flex items-center gap-2.5">
              {banner.kind === "error" ? (
                <AlertTriangle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckCircle2 className="w-4 h-4 shrink-0" />
              )}
              <span>{banner.text}</span>
            </div>
            <button
              type="button"
              onClick={() => setBanner(null)}
              aria-label={tp(lang, "Close")}
              className="p-1 rounded-lg hover:opacity-75 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* 2. 6-TAB SANCTUARY STUDIO NAVIGATION                                  */}
      {/* ===================================================================== */}
      <div className="overflow-x-auto pb-1">
        <nav aria-label={t(lang, "navAdmin")} className="pill-tab-bar min-w-max">
          {tabs.map((tabItem) => {
            const active = activeTab === tabItem.id;
            return (
              <button
                key={tabItem.id}
                type="button"
                data-active={active}
                onClick={() => setActiveTab(tabItem.id)}
                className="pill-tab-btn inline-flex items-center gap-2 shrink-0"
              >
                {tabItem.icon}
                <span>{tabItem.label}</span>
                <span
                  className="px-1.5 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: active ? "rgba(255,255,255,0.22)" : "var(--bg-elevated)",
                    color: active ? "#ffffff" : "var(--text-muted)",
                  }}
                >
                  {tabItem.shortBadge}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* ===================================================================== */}
      {/* TAB 1: OVERVIEW — ACCOUNT, CONTRIBUTOR ROLES & MEMBER GOVERNANCE      */}
      {/* ===================================================================== */}
      <AnimatePresence mode="wait">
        {activeTab === "account" && (
          <motion.div
            key="tab-account"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
              {/* Left 5 Cols: Self-Registration, Sign-In & Signed-In Profile Portal */}
              <section className="lg:col-span-5 bento-card p-5 sm:p-6 space-y-4">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                      <UserPlus className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                      <span>{ui.accountPortalTitle}</span>
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {ui.accountPortalSubtitle}
                    </p>
                  </div>
                </div>

                {/* Mode Switcher Tabs: Create Account | Sign In | My Profile */}
                <div
                  className="grid grid-cols-3 gap-1 p-1 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <button
                    type="button"
                    onClick={() => setAuthFormMode("register")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      authFormMode === "register" ? "btn-primary" : ""
                    }`}
                    style={
                      authFormMode === "register"
                        ? undefined
                        : { color: "var(--text-secondary)" }
                    }
                  >
                    {t(lang, "createAccount")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthFormMode("login")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold cursor-pointer transition-all ${
                      authFormMode === "login" ? "btn-primary" : ""
                    }`}
                    style={
                      authFormMode === "login"
                        ? undefined
                        : { color: "var(--text-secondary)" }
                    }
                  >
                    {t(lang, "signIn")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setAuthFormMode("profile")}
                    className={`py-2 px-2 rounded-lg text-xs font-bold inline-flex items-center justify-center gap-1 cursor-pointer transition-all ${
                      authFormMode === "profile" ? "btn-primary" : ""
                    }`}
                    style={
                      authFormMode === "profile"
                        ? undefined
                        : { color: "var(--text-secondary)" }
                    }
                  >
                    <span>{ui.myProfile}</span>
                    {authUser && <Check className="w-3 h-3" />}
                  </button>
                </div>

                {/* 1A: SELF-REGISTRATION ("Create Account") FORM */}
                {authFormMode === "register" && (
                  <form onSubmit={handleRegisterSubmit} className="space-y-3.5 text-xs">
                    {!backend.platformSettings.allowSelfRegistration && (
                      <div
                        className="p-3 rounded-xl border flex items-start gap-2"
                        style={{
                          backgroundColor: "var(--gold-soft)",
                          borderColor: "var(--border-hairline)",
                          color: "var(--accent-gold)",
                        }}
                      >
                        <Lock className="w-4 h-4 shrink-0 mt-0.5" />
                        <span>
                          Public self-registration is currently disabled in Global Platform Settings.
                          Super Admins can re-enable it in the Home Layout tab.
                        </span>
                      </div>
                    )}

                    {/* Account Type Selector: Member vs Creator */}
                    <div>
                      <label className="block font-bold mb-1.5">{ui.contributorRole}</label>
                      <div className="grid grid-cols-2 gap-2.5">
                        {(
                          [
                            {
                              role: "member" as const,
                              title: tp(lang, RBAC_ROLES.member.label),
                              badge: RBAC_ROLES.member.arabicBadge,
                              desc: "Family Barsi Khatm & Personal Zakat Ledgers",
                            },
                            {
                              role: "creator" as const,
                              title: tp(lang, RBAC_ROLES.creator.label),
                              badge: RBAC_ROLES.creator.arabicBadge,
                              desc: "Author Auliya Tazkirahs & Submit Urs Dates",
                            },
                          ] as const
                        ).map((opt) => {
                          const selected = regRole === opt.role;
                          return (
                            <button
                              key={opt.role}
                              type="button"
                              onClick={() => setRegRole(opt.role)}
                              className="p-3 rounded-xl border text-left cursor-pointer transition-all"
                              style={{
                                backgroundColor: selected
                                  ? "var(--accent-soft)"
                                  : "var(--bg-elevated)",
                                borderColor: selected
                                  ? "var(--accent-primary)"
                                  : "var(--border-hairline)",
                              }}
                            >
                              <div className="flex items-center justify-between font-bold text-xs">
                                <span
                                  style={{
                                    color: selected
                                      ? "var(--accent-primary)"
                                      : "var(--text-primary)",
                                  }}
                                >
                                  {opt.title}
                                </span>
                                <span className="font-urdu text-xs" style={{ color: "var(--accent-gold)" }}>
                                  {opt.badge}
                                </span>
                              </div>
                              <p
                                className="text-[11px] mt-1 leading-snug"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {opt.desc}
                              </p>
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block font-semibold mb-1">{tp(lang, "Full Name")} *</label>
                        <input
                          type="text"
                          required
                          minLength={2}
                          value={regName}
                          onChange={(e) => setRegName(e.target.value)}
                          placeholder="e.g., Syed Owais Qadri"
                          className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">{tp(lang, "City")}</label>
                        <input
                          type="text"
                          value={regCity}
                          onChange={(e) => setRegCity(e.target.value)}
                          placeholder="e.g., Hyderabad / London"
                          className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{tp(lang, "Email Address")} *</label>
                      <input
                        type="email"
                        required
                        value={regEmail}
                        onChange={(e) => setRegEmail(e.target.value)}
                        placeholder="you@example.com"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>

                    <div>
                      <label className="block font-semibold mb-1">{tp(lang, "Password")} *</label>
                      <div className="relative">
                        <input
                          type={showPassword ? "text" : "password"}
                          required
                          minLength={6}
                          value={regPassword}
                          onChange={(e) => setRegPassword(e.target.value)}
                          placeholder="••••••••"
                          className="w-full px-3 py-2.5 pr-10 rounded-xl border bg-transparent"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((v) => !v)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={
                        busyAction === "register" ||
                        !backend.platformSettings.allowSelfRegistration
                      }
                      className="btn-primary w-full py-2.5 px-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                    >
                      <UserPlus className="w-4 h-4" />
                      <span>
                        {busyAction === "register" ? tp(lang, "Loading") : t(lang, "createAccount")}
                      </span>
                    </button>
                  </form>
                )}

                {/* 1B: SIGN IN FORM + SEEDED ACCOUNTS QUICK FILL */}
                {authFormMode === "login" && (
                  <div className="space-y-4 text-xs">
                    <form onSubmit={handleLoginSubmit} className="space-y-3">
                      <div>
                        <label className="block font-semibold mb-1">{tp(lang, "Email Address")}</label>
                        <input
                          type="email"
                          required
                          value={loginEmail}
                          onChange={(e) => setLoginEmail(e.target.value)}
                          placeholder="admin@auliyacalendar.org"
                          className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>
                      <div>
                        <label className="block font-semibold mb-1">{tp(lang, "Password")}</label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            required
                            value={loginPassword}
                            onChange={(e) => setLoginPassword(e.target.value)}
                            placeholder="••••••••"
                            className="w-full px-3 py-2.5 pr-10 rounded-xl border bg-transparent"
                            style={{ borderColor: "var(--border-hairline)" }}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword((v) => !v)}
                            aria-label={showPassword ? "Hide password" : "Show password"}
                            className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 cursor-pointer"
                            style={{ color: "var(--text-muted)" }}
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </div>
                      <button
                        type="submit"
                        disabled={busyAction === "login"}
                        className="btn-primary w-full py-2.5 px-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <LogIn className="w-4 h-4" />
                        <span>{busyAction === "login" ? tp(lang, "Loading") : t(lang, "signIn")}</span>
                      </button>
                    </form>

                    {/* Seeded Accounts Quick-Fill */}
                    <div
                      className="p-3 rounded-xl border space-y-2"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <div className="font-bold text-[11px]" style={{ color: "var(--text-secondary)" }}>
                        {ui.contributorRole}:
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                        {DEMO_SEED_CREDENTIALS.map((cred) => (
                          <button
                            key={cred.role}
                            type="button"
                            onClick={() => {
                              setLoginEmail(cred.email);
                              setLoginPassword(cred.pass);
                            }}
                            className="p-2 rounded-lg border text-left cursor-pointer hover:opacity-90 transition-opacity"
                            style={{
                              backgroundColor: "var(--bg-surface)",
                              borderColor: "var(--border-hairline)",
                            }}
                          >
                            <div className="font-bold text-[11px]" style={{ color: RBAC_ROLES[cred.role].badgeColor }}>
                              {tp(lang, RBAC_ROLES[cred.role].label)}
                            </div>
                            <div className="text-[10px] truncate" style={{ color: "var(--text-muted)" }}>
                              {cred.email} • {cred.pass}
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* 1C: SIGNED-IN PROFILE EDITOR */}
                {authFormMode === "profile" && (
                  <div className="space-y-4 text-xs">
                    {authUser && roleMeta ? (
                      <form onSubmit={handleProfileSave} className="space-y-3.5">
                        <div
                          className="p-3.5 rounded-xl border flex items-center justify-between gap-3"
                          style={{
                            backgroundColor: "var(--bg-elevated)",
                            borderColor: "var(--border-hairline)",
                          }}
                        >
                          <div>
                            <div className="font-bold text-sm">{authUser.name}</div>
                            <div style={{ color: "var(--text-muted)" }}>{authUser.email}</div>
                            <div className="mt-1 text-[11px] font-semibold" style={{ color: roleMeta.badgeColor }}>
                              {tp(lang, roleMeta.label)} ({roleMeta.arabicBadge})
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-xs font-bold" style={{ color: "var(--accent-gold)" }}>
                              {currentRank.title}
                            </div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {tp(lang, authUser.status === "active" ? "Active" : authUser.status)}
                            </div>
                          </div>
                        </div>

                        <div>
                          <label className="block font-semibold mb-1">{tp(lang, "Full Name")}</label>
                          <input
                            type="text"
                            value={(profileDraft ?? authUser).name}
                            onChange={(e) =>
                              setProfileDraft({
                                name: e.target.value,
                                title: (profileDraft ?? authUser).title,
                                city: (profileDraft ?? authUser).city,
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border bg-transparent"
                            style={{ borderColor: "var(--border-hairline)" }}
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="block font-semibold mb-1">Honorific / Title</label>
                            <input
                              type="text"
                              value={(profileDraft ?? authUser).title}
                              onChange={(e) =>
                                setProfileDraft({
                                  name: (profileDraft ?? authUser).name,
                                  title: e.target.value,
                                  city: (profileDraft ?? authUser).city,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border bg-transparent"
                              style={{ borderColor: "var(--border-hairline)" }}
                            />
                          </div>
                          <div>
                            <label className="block font-semibold mb-1">{tp(lang, "City")}</label>
                            <input
                              type="text"
                              value={(profileDraft ?? authUser).city}
                              onChange={(e) =>
                                setProfileDraft({
                                  name: (profileDraft ?? authUser).name,
                                  title: (profileDraft ?? authUser).title,
                                  city: e.target.value,
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border bg-transparent"
                              style={{ borderColor: "var(--border-hairline)" }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          <button
                            type="submit"
                            disabled={busyAction === "profile"}
                            className="btn-primary flex-1 py-2.5 px-4 rounded-xl font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                          >
                            <Save className="w-4 h-4" />
                            <span>{tp(lang, "Save")}</span>
                          </button>
                          <button
                            type="button"
                            onClick={handleLogout}
                            className="py-2.5 px-4 rounded-xl border font-bold inline-flex items-center gap-1.5 cursor-pointer"
                            style={{
                              borderColor: "var(--border-hairline)",
                              backgroundColor: "var(--bg-elevated)",
                              color: "var(--text-secondary)",
                            }}
                          >
                            <LogOut className="w-4 h-4" />
                            <span>{t(lang, "signOut")}</span>
                          </button>
                        </div>
                      </form>
                    ) : (
                      <div
                        className="p-5 rounded-xl border text-center space-y-3"
                        style={{
                          backgroundColor: "var(--bg-elevated)",
                          borderColor: "var(--border-hairline)",
                        }}
                      >
                        <KeyRound className="w-7 h-7 mx-auto" style={{ color: "var(--accent-gold)" }} />
                        <div className="font-bold text-sm">{ui.guestSession}</div>
                        <p style={{ color: "var(--text-muted)" }}>
                          {ui.accountPortalSubtitle}
                        </p>
                        <button
                          type="button"
                          onClick={() => setAuthFormMode("register")}
                          className="btn-primary px-4 py-2 rounded-xl font-bold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <UserPlus className="w-4 h-4" />
                          <span>{t(lang, "createAccount")}</span>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </section>

              {/* Right 7 Cols: Scholarly Review Queue + Contributor Role Permissions Table */}
              <section className="lg:col-span-7 space-y-5 overflow-hidden">
                {(canPublishAuliya || canPublishUrs) && (pendingAuliya.length > 0 || pendingUrs.length > 0) && (
                  <div className="bento-card p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" style={{ color: "var(--accent-emerald)" }} />
                          <span>{ui.statusVerification} ({pendingAuliya.length + pendingUrs.length})</span>
                        </h2>
                        <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                          Review Creator submissions before publishing to the live directory
                        </p>
                      </div>
                    </div>

                    <div className="divide-y" style={{ borderColor: "var(--border-hairline)" }}>
                      {pendingAuliya.map((item) => (
                        <div key={`rev-a-${item.id}`} className="py-3.5 first:pt-0 last:pb-0 space-y-2 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-sm">{item.name}</span>{" "}
                              <span className="font-urdu" style={{ color: "var(--text-secondary)" }}>({item.urduName})</span>
                              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                {item.city}, {item.country} • {item.createdByName}
                              </div>
                            </div>
                            <StatusPill status={item.status} ui={ui} />
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={reviewNotesMap[`auliya:${item.id}`] || ""}
                              onChange={(e) =>
                                setReviewNotesMap((prev) => ({ ...prev, [`auliya:${item.id}`]: e.target.value }))
                              }
                              placeholder="Editorial review note (optional)…"
                              className="flex-1 min-w-[180px] px-3 py-1.5 rounded-xl border bg-transparent text-xs"
                              style={{ borderColor: "var(--border-hairline)" }}
                            />
                            <button
                              type="button"
                              disabled={busyAction === `review-auliya-${item.id}`}
                              onClick={() => handleReviewSubmission("auliya", item.id, "approve")}
                              className="btn-primary px-3 py-1.5 rounded-xl font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{ui.approvePublish}</span>
                            </button>
                            <button
                              type="button"
                              disabled={busyAction === `review-auliya-${item.id}`}
                              onClick={() => handleReviewSubmission("auliya", item.id, "request_changes")}
                              className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                              style={{ borderColor: "var(--border-hairline)" }}
                            >
                              {ui.statusDraft}
                            </button>
                          </div>
                        </div>
                      ))}

                      {pendingUrs.map((ev) => (
                        <div key={`rev-u-${ev.id}`} className="py-3.5 first:pt-0 last:pb-0 space-y-2 text-xs">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <div>
                              <span className="font-bold text-sm">{ev.title}</span>
                              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                {ev.day} {formatLocalizedHijriMonth(lang, ev.month, HIJRI_MONTHS[ev.month - 1] || "")} • {ev.createdByName}
                              </div>
                            </div>
                            <StatusPill status={ev.status} ui={ui} />
                          </div>
                          <div className="flex flex-wrap items-center gap-2">
                            <input
                              type="text"
                              value={reviewNotesMap[`urs:${ev.id}`] || ""}
                              onChange={(e) =>
                                setReviewNotesMap((prev) => ({ ...prev, [`urs:${ev.id}`]: e.target.value }))
                              }
                              placeholder="Editorial review note (optional)…"
                              className="flex-1 min-w-[180px] px-3 py-1.5 rounded-xl border bg-transparent text-xs"
                              style={{ borderColor: "var(--border-hairline)" }}
                            />
                            <button
                              type="button"
                              disabled={busyAction === `review-urs-${ev.id}`}
                              onClick={() => handleReviewSubmission("urs", ev.id, "approve")}
                              className="btn-primary px-3 py-1.5 rounded-xl font-semibold inline-flex items-center gap-1 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>{ui.approvePublish}</span>
                            </button>
                            <button
                              type="button"
                              disabled={busyAction === `review-urs-${ev.id}`}
                              onClick={() => handleReviewSubmission("urs", ev.id, "request_changes")}
                              className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                              style={{ borderColor: "var(--border-hairline)" }}
                            >
                              {ui.statusDraft}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="bento-card p-5 sm:p-6 space-y-4 overflow-hidden">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                      <span>{ui.roleCapabilitiesTitle}</span>
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {ui.roleCapabilitiesSubtitle} ({PERMISSION_CATALOG.length})
                    </p>
                  </div>
                </div>

                <div className="overflow-x-auto -mx-2 px-2">
                  <table className="w-full text-xs border-collapse min-w-[540px]">
                    <thead>
                      <tr
                        className="border-b text-left"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        <th className="py-2.5 pr-3 font-bold" style={{ color: "var(--text-secondary)" }}>
                          {tp(lang, "Details")}
                        </th>
                        {ROLE_ORDER.map((r) => {
                          const meta = RBAC_ROLES[r];
                          const isCurr = activeRole === r;
                          return (
                            <th
                              key={r}
                              className="py-2.5 px-2 text-center font-bold rounded-t-xl"
                              style={{
                                backgroundColor: isCurr ? `${meta.badgeColor}18` : "transparent",
                                color: meta.badgeColor,
                              }}
                            >
                              <div>{tp(lang, meta.label)}</div>
                              <div className="font-urdu text-[11px] font-normal opacity-90">
                                {meta.arabicBadge}
                              </div>
                            </th>
                          );
                        })}
                      </tr>
                    </thead>
                    <tbody>
                      {PERMISSION_CATALOG.map((item) => (
                        <tr
                          key={item.key}
                          className="border-b transition-colors"
                          style={{ borderColor: "var(--border-hairline)" }}
                        >
                          <td className="py-2 pr-3">
                            <div className="font-semibold">{item.label}</div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {item.domain}
                            </div>
                          </td>
                          {ROLE_ORDER.map((r) => {
                            const allowed = hasPermission(r, item.key);
                            const isCurr = activeRole === r;
                            return (
                              <td
                                key={r}
                                className="py-2 px-2 text-center"
                                style={{
                                  backgroundColor: isCurr
                                    ? `${RBAC_ROLES[r].badgeColor}10`
                                    : "transparent",
                                }}
                              >
                                {allowed ? (
                                  <span
                                    className="inline-flex items-center justify-center w-6 h-6 rounded-full"
                                    style={{
                                      backgroundColor: "rgba(16, 185, 129, 0.16)",
                                      color: "#10B981",
                                    }}
                                    aria-label={`${RBAC_ROLES[r].label} has ${item.key}`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                  </span>
                                ) : (
                                  <span
                                    className="inline-flex items-center justify-center w-6 h-6 rounded-full opacity-35"
                                    style={{ color: "var(--text-muted)" }}
                                    aria-label={`${RBAC_ROLES[r].label} does not have ${item.key}`}
                                  >
                                    <X className="w-3 h-3" />
                                  </span>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                </div>
              </section>
            </div>

            {/* Bottom Section: Members & Contributor Roles */}
            <section className="bento-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Users className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <h2 className="text-base sm:text-lg font-bold">
                      {ui.userDirectoryTitle}
                    </h2>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {ui.roleCapabilitiesSubtitle}
                  </p>
                </div>

                {!hasPermission(activeRole, "users:manage") && (
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSwitch("super_admin")}
                    className="btn-peach px-3.5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>{tp(lang, RBAC_ROLES.super_admin.label)}</span>
                  </button>
                )}
              </div>

              {backend.users && backend.users.length > 0 ? (
                <>
                  <div className="flex flex-col sm:flex-row gap-2.5 text-xs">
                    <div className="relative flex-1">
                      <Search
                        className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: "var(--text-muted)" }}
                      />
                      <input
                        type="text"
                        value={userSearch}
                        onChange={(e) => setUserSearch(e.target.value)}
                        placeholder={`${tp(lang, "Search")}…`}
                        aria-label={tp(lang, "Search")}
                        className="w-full pl-9 pr-3 py-2 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <select
                      value={userRoleFilter}
                      onChange={(e) => setUserRoleFilter(e.target.value as "all" | UserRole)}
                      aria-label={ui.contributorRole}
                      className="ui-select px-3 py-2 rounded-xl border bg-transparent font-semibold"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      <option value="all" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                        {tp(lang, "All")} ({backend.users.length})
                      </option>
                      {ROLE_ORDER.map((r) => (
                        <option
                          key={r}
                          value={r}
                          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                        >
                          {tp(lang, RBAC_ROLES[r].label)}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs border-collapse min-w-[680px]">
                      <thead>
                        <tr
                          className="border-b text-left"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: "var(--text-muted)",
                          }}
                        >
                          <th className="py-2.5 pr-3">{tp(lang, "Full Name")}</th>
                          <th className="py-2.5 px-3">{tp(lang, "City")}</th>
                          <th className="py-2.5 px-3">{tp(lang, "Active")}</th>
                          <th className="py-2.5 px-3">{ui.contributorRole}</th>
                          <th className="py-2.5 pl-3 text-right">{tp(lang, "Edit")}</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((u) => {
                          const canManage = hasPermission(activeRole, "users:manage");
                          const isSelf = authUser?.id === u.id;
                          return (
                            <tr
                              key={u.id}
                              className="border-b"
                              style={{ borderColor: "var(--border-hairline)" }}
                            >
                              <td className="py-3 pr-3">
                                <div className="flex items-center gap-2.5">
                                  <div
                                    className="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-xs shrink-0"
                                    style={{ backgroundColor: u.avatarColor }}
                                  >
                                    {u.name.slice(0, 2).toUpperCase()}
                                  </div>
                                  <div>
                                    <div className="font-bold flex items-center gap-1.5">
                                      <span>{u.name}</span>
                                      {isSelf && (
                                        <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-500/20 text-emerald-400">
                                          {tp(lang, "Active")}
                                        </span>
                                      )}
                                    </div>
                                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                      {u.email}
                                    </div>
                                  </div>
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                <div className="font-medium">{u.title}</div>
                                <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                                  {u.city}
                                </div>
                              </td>
                              <td className="py-3 px-3">
                                {u.status === "active" ? (
                                  <span className="badge-pill badge-emerald">{tp(lang, "Active")}</span>
                                ) : (
                                  <span className="badge-pill badge-crimson">Suspended</span>
                                )}
                              </td>
                              <td className="py-3 px-3">
                                <select
                                  value={u.role}
                                  disabled={!canManage || busyAction === `usr-${u.id}`}
                                  onChange={(e) =>
                                    handleAdminUserPatch(u.id, {
                                      role: e.target.value as UserRole,
                                    })
                                  }
                                  aria-label={u.name}
                                  className="ui-select px-2.5 py-1.5 rounded-lg border bg-transparent font-bold disabled:opacity-60"
                                  style={{
                                    borderColor: "var(--border-hairline)",
                                    color: RBAC_ROLES[u.role].badgeColor,
                                  }}
                                >
                                  {ROLE_ORDER.map((r) => (
                                    <option
                                      key={r}
                                      value={r}
                                      style={{
                                        backgroundColor: "var(--bg-surface)",
                                        color: "var(--text-primary)",
                                      }}
                                    >
                                      {tp(lang, RBAC_ROLES[r].label)}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="py-3 pl-3 text-right">
                                <button
                                  type="button"
                                  disabled={!canManage || isSelf || busyAction === `usr-${u.id}`}
                                  onClick={() =>
                                    handleAdminUserPatch(u.id, {
                                      status: u.status === "active" ? "suspended" : "active",
                                    })
                                  }
                                  className="px-3 py-1.5 rounded-lg border font-semibold cursor-pointer disabled:opacity-40"
                                  style={{
                                    borderColor: "var(--border-hairline)",
                                    backgroundColor:
                                      u.status === "active"
                                        ? "rgba(239, 68, 68, 0.12)"
                                        : "rgba(16, 185, 129, 0.14)",
                                    color: u.status === "active" ? "#F87171" : "#10B981",
                                  }}
                                >
                                  {u.status === "active" ? "Suspend" : "Reactivate"}
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </>
              ) : (
                <div
                  className="p-5 rounded-xl border text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <div className="flex items-center gap-2.5">
                    <ShieldAlert className="w-5 h-5 shrink-0" style={{ color: "var(--accent-gold)" }} />
                    <span style={{ color: "var(--text-secondary)" }}>
                      {tp(lang, RBAC_ROLES.editor.label)} / {tp(lang, RBAC_ROLES.super_admin.label)}
                    </span>
                  </div>
                </div>
              )}
            </section>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: AULIYA ALLAH CMS                                             */}
        {/* =================================================================== */}
        {activeTab === "auliya" && (
          <motion.div
            key="tab-auliya"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Editorial Workflow Banner */}
            <div
              className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
              style={{
                backgroundColor: "var(--bg-surface)",
                borderColor: "var(--border-hairline)",
              }}
            >
              <div className="flex items-start gap-2.5">
                <Award className="w-4 h-4 shrink-0 mt-0.5" style={{ color: "var(--accent-gold)" }} />
                <div>
                  <span className="font-bold">{ui.statusVerification}: </span>
                  <span style={{ color: "var(--text-secondary)" }}>
                    {canPublishAuliya
                      ? `${roleMeta ? tp(lang, roleMeta.label) : ""} — create, edit saint biographies, and publish directly to the live Auliya Directory.`
                      : canCreateAuliya
                      ? `${tp(lang, RBAC_ROLES.creator.label)} — author Auliya profiles as ${ui.statusDraft} or submit for ${ui.statusVerification}.`
                      : `${ui.publicReadOnly} — ${ui.contributorRoleHint}.`}
                  </span>
                </div>
              </div>
              {!canCreateAuliya && (
                <button
                  type="button"
                  onClick={() => handleQuickRoleSwitch("editor")}
                  className="btn-primary px-3.5 py-2 rounded-xl font-bold shrink-0 cursor-pointer"
                >
                  {ui.selectRole}: {tp(lang, RBAC_ROLES.editor.label)}
                </button>
              )}
            </div>

            {/* Searchable, Filterable Table of ALL Auliya Records */}
            <section className="bento-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div>
                  <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Compass className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <span>
                      {tl(lang, "adminTabAuliya", ui.tabAuliya)} ({filteredAuliyaRecords.length})
                    </span>
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Curate saint biographies, shrine coordinates, spiritual lineages (Shajrah), and authored works
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setAuliyaForm(createEmptyAuliyaForm(canPublishAuliya))}
                  className="btn-primary px-3.5 py-2 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer self-start"
                >
                  <Plus className="w-4 h-4" />
                  <span>
                    {ui.newRecord} — {tl(lang, "adminTabAuliya", ui.tabAuliya)}
                  </span>
                </button>
              </div>

              {/* Search & Status/Silsila Filters */}
              <div className="flex flex-col lg:flex-row gap-3 text-xs">
                <div className="relative flex-1">
                  <Search
                    className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    value={auliyaSearch}
                    onChange={(e) => setAuliyaSearch(e.target.value)}
                    placeholder={`${tp(lang, "Search")}…`}
                    aria-label={tp(lang, "Search")}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border bg-transparent"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>

                <div className="flex flex-wrap items-center gap-1.5">
                  {(
                    [
                      { key: "All", label: `${tp(lang, "All")} (${auliyaCounts.total})` },
                      {
                        key: "Published",
                        label: `${ui.statusPublished} (${auliyaCounts.published})`,
                      },
                      {
                        key: "Scholarly Verification",
                        label: `${ui.statusVerification} (${auliyaCounts.pending})`,
                      },
                      { key: "Draft", label: `${ui.statusDraft} (${auliyaCounts.draft})` },
                    ] as const
                  ).map((st) => {
                    const active = auliyaStatusFilter === st.key;
                    return (
                      <button
                        key={st.key}
                        type="button"
                        onClick={() => setAuliyaStatusFilter(st.key)}
                        className={`px-3 py-1.5 rounded-xl font-semibold border cursor-pointer ${
                          active ? "btn-primary border-transparent" : ""
                        }`}
                        style={
                          active
                            ? undefined
                            : {
                                borderColor: "var(--border-hairline)",
                                backgroundColor: "var(--bg-elevated)",
                                color: "var(--text-secondary)",
                              }
                        }
                      >
                        {st.label}
                      </button>
                    );
                  })}

                  <select
                    value={auliyaSilsilaFilter}
                    onChange={(e) => setAuliyaSilsilaFilter(e.target.value)}
                    aria-label="Filter by Silsila"
                    className="ui-select px-3 py-1.5 rounded-xl border bg-transparent font-semibold"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <option value="All" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                      {tp(lang, "All")} — Silsila
                    </option>
                    {SILSILA_OPTIONS.map((s) => (
                      <option
                        key={s}
                        value={s}
                        style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                      >
                        {s}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Auliya Directory Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse min-w-[780px]">
                  <thead>
                    <tr
                      className="border-b text-left"
                      style={{ borderColor: "var(--border-hairline)", color: "var(--text-muted)" }}
                    >
                      <th className="py-2.5 pr-3">{tl(lang, "adminTabAuliya", ui.tabAuliya)}</th>
                      <th className="py-2.5 px-3">Silsila</th>
                      <th className="py-2.5 px-3">{tl(lang, "adminTabUrs", ui.tabUrs)}</th>
                      <th className="py-2.5 px-3">{ui.statusPublished}</th>
                      <th className="py-2.5 pl-3 text-right">{tp(lang, "Edit")}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAuliyaRecords.map((rec) => {
                      const canEditThis =
                        canEditAnyAuliya ||
                        (hasPermission(activeRole, "auliya:edit_own") &&
                          rec.createdByUserId === authUser?.id);
                      const isEditing = auliyaForm.editingId === rec.id;

                      return (
                        <tr
                          key={rec.id}
                          className="border-b transition-colors"
                          style={{
                            borderColor: "var(--border-hairline)",
                            backgroundColor: isEditing ? "var(--accent-soft)" : "transparent",
                          }}
                        >
                          <td className="py-3 pr-3">
                            <div className="flex items-center gap-3">
                              <div
                                role="img"
                                aria-label={rec.name}
                                className="w-11 h-11 rounded-xl shrink-0 border bg-cover bg-center"
                                style={{
                                  borderColor: "var(--border-hairline)",
                                  backgroundImage: `url("${resolvePublicAssetUrl(
                                    rec.shrineImage || "/images/shrines/bareilly.jpg"
                                  )}")`,
                                }}
                              />
                              <div className="min-w-0">
                                <div className="font-bold flex items-center gap-1.5">
                                  <span>{rec.name}</span>
                                  {rec.featured && (
                                    <Star
                                      className="w-3.5 h-3.5 fill-current shrink-0"
                                      style={{ color: "var(--accent-gold)" }}
                                    />
                                  )}
                                </div>
                                <div className="font-urdu text-xs" style={{ color: "var(--accent-gold)" }}>
                                  {rec.urduName}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <span
                              className="px-2.5 py-1 rounded-full text-[11px] font-bold border"
                              style={{
                                backgroundColor: "var(--bg-elevated)",
                                borderColor: "var(--border-hairline)",
                                color: "var(--text-primary)",
                              }}
                            >
                              {rec.silsila}
                            </span>
                          </td>
                          <td className="py-3 px-3">
                            <div className="font-semibold">
                              {rec.ursDay}{" "}
                              {formatLocalizedHijriMonth(
                                lang,
                                rec.ursMonth,
                                HIJRI_MONTHS[(rec.ursMonth - 1 + 12) % 12]
                              )}
                            </div>
                            <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                              {rec.city}, {rec.country}
                            </div>
                          </td>
                          <td className="py-3 px-3">
                            <StatusPill status={rec.status} ui={ui} />
                            <div className="text-[10px] mt-1" style={{ color: "var(--text-muted)" }}>
                              {rec.createdByName}
                              {rec.verifiedByName ? ` • ${rec.verifiedByName}` : ""}
                            </div>
                          </td>
                          <td className="py-3 pl-3">
                            <div className="flex items-center justify-end gap-1.5 flex-wrap">
                              <button
                                type="button"
                                onClick={() => handleLoadAuliyaForEdit(rec)}
                                disabled={!canEditThis && Boolean(activeRole)}
                                className="px-2.5 py-1.5 rounded-lg border font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-40"
                                style={{
                                  borderColor: "var(--border-hairline)",
                                  backgroundColor: "var(--bg-elevated)",
                                  color: "var(--text-primary)",
                                }}
                              >
                                <Edit3 className="w-3.5 h-3.5" />
                                <span>{tp(lang, "Edit")}</span>
                              </button>

                              {canPublishAuliya && rec.status !== "Published" && (
                                <button
                                  type="button"
                                  onClick={() => handleQuickApproveAuliya(rec)}
                                  disabled={busyAction === `pub-auliya-${rec.id}`}
                                  className="px-2.5 py-1.5 rounded-lg font-bold inline-flex items-center gap-1 cursor-pointer"
                                  style={{
                                    backgroundColor: "rgba(16, 185, 129, 0.16)",
                                    color: "#10B981",
                                    border: "1px solid rgba(16, 185, 129, 0.38)",
                                  }}
                                >
                                  <CheckCircle2 className="w-3.5 h-3.5" />
                                  <span>{ui.approvePublish}</span>
                                </button>
                              )}

                              <Link
                                href={`/auliya?saint=${encodeURIComponent(rec.id)}`}
                                className="px-2.5 py-1.5 rounded-lg border font-semibold inline-flex items-center gap-1"
                                style={{
                                  borderColor: "var(--border-hairline)",
                                  backgroundColor: "var(--bg-surface)",
                                  color: "var(--accent-primary)",
                                }}
                              >
                                <ExternalLink className="w-3.5 h-3.5" />
                                <span>{t(lang, "navAuliya")}</span>
                              </Link>

                              {canDeleteAuliya &&
                                (confirmDeleteAuliyaId === rec.id ? (
                                  <div className="inline-flex items-center gap-1">
                                    <button
                                      type="button"
                                      onClick={() => handleDeleteAuliya(rec.id, rec.name)}
                                      className="px-2 py-1.5 rounded-lg font-bold bg-red-500 text-white cursor-pointer"
                                    >
                                      {tp(lang, "Delete")}
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() => setConfirmDeleteAuliyaId(null)}
                                      className="px-2 py-1.5 rounded-lg border cursor-pointer"
                                      style={{ borderColor: "var(--border-hairline)" }}
                                    >
                                      {tp(lang, "Cancel")}
                                    </button>
                                  </div>
                                ) : (
                                  <button
                                    type="button"
                                    onClick={() => setConfirmDeleteAuliyaId(rec.id)}
                                    aria-label={`${tp(lang, "Delete")} ${rec.name}`}
                                    className="p-1.5 rounded-lg border cursor-pointer"
                                    style={{
                                      borderColor: "rgba(239, 68, 68, 0.35)",
                                      backgroundColor: "rgba(239, 68, 68, 0.1)",
                                      color: "#F87171",
                                    }}
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                ))}
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* COMPLETE RICH AULIYA PROFILE EDITOR */}
            <section className="bento-card p-5 sm:p-6 space-y-5">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b pb-4" style={{ borderColor: "var(--border-hairline)" }}>
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                    {auliyaForm.editingId
                      ? `${tp(lang, "Edit")}: ${auliyaForm.editingId}`
                      : `${ui.newRecord} — ${tl(lang, "adminTabAuliya", ui.tabAuliya)}`}
                  </div>
                  <h2 className="text-lg sm:text-xl font-extrabold mt-0.5">
                    {tl(lang, "adminTabAuliya", ui.tabAuliya)} — Tazkirah, Shajrah &amp; Tasanif
                  </h2>
                </div>

                {auliyaForm.editingId && (
                  <button
                    type="button"
                    onClick={() => setAuliyaForm(createEmptyAuliyaForm(canPublishAuliya))}
                    className="px-3.5 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>{ui.newRecord}</span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSaveAuliya} className="space-y-6 text-xs">
                {/* Block 1: Names, Alqab, Silsila & Era */}
                <div className="space-y-3.5">
                  <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--accent-gold)" }}>
                    <Sparkles className="w-4 h-4" />
                    <span>1. Sacred Identity, Script &amp; Spiritual Lineage</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div>
                      <label className="block font-semibold mb-1">English Name *</label>
                      <input
                        type="text"
                        required
                        value={auliyaForm.name}
                        onChange={(e) => setAuliyaForm({ ...auliyaForm, name: e.target.value })}
                        placeholder="e.g., Sarkar Waris Pak"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Urdu Name *</label>
                      <input
                        type="text"
                        dir="rtl"
                        required
                        value={auliyaForm.urduName}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, urduName: e.target.value })
                        }
                        placeholder="حاجی وارث علی شاہ"
                        className="w-full px-3 py-2 rounded-xl border bg-transparent font-urdu text-sm"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Arabic Name</label>
                      <input
                        type="text"
                        dir="rtl"
                        value={auliyaForm.arabicName}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, arabicName: e.target.value })
                        }
                        placeholder="الشيخ وارث علي شاه"
                        className="w-full px-3 py-2 rounded-xl border bg-transparent font-arabic text-sm"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">
                        Honorific Alqab (comma-separated)
                      </label>
                      <input
                        type="text"
                        value={auliyaForm.alqabText}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, alqabText: e.target.value })
                        }
                        placeholder="Sarkar Waris Pak, Qutb-ul-Aqtab, Sultan-ul-Ashiqeen"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Spiritual Order (Silsila)</label>
                      <select
                        value={auliyaForm.silsila}
                        onChange={(e) =>
                          setAuliyaForm({
                            ...auliyaForm,
                            silsila: e.target.value as AuliyaProfile["silsila"],
                          })
                        }
                        className="ui-select w-full px-3 py-2.5 rounded-xl border bg-transparent font-semibold"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        {SILSILA_OPTIONS.map((s) => (
                          <option
                            key={s}
                            value={s}
                            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                          >
                            {s}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                    <div>
                      <label className="block font-semibold mb-1">Era / Century</label>
                      <input
                        type="text"
                        value={auliyaForm.era}
                        onChange={(e) => setAuliyaForm({ ...auliyaForm, era: e.target.value })}
                        placeholder="e.g., 6th Century AH"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Wiladat (Birth Hijri)</label>
                      <input
                        type="text"
                        value={auliyaForm.wiladatHijri}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, wiladatHijri: e.target.value })
                        }
                        placeholder="1 Ramadan 470 AH"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Wisal (Union Hijri)</label>
                      <input
                        type="text"
                        value={auliyaForm.wisalHijri}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, wisalHijri: e.target.value })
                        }
                        placeholder="11 Rabi' al-Thani 561 AH"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Murshid Link (Shajrah)</label>
                      <select
                        value={auliyaForm.murshidId}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, murshidId: e.target.value })
                        }
                        className="ui-select w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        <option value="" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                          Prophetic / Root Mashaykh Chain
                        </option>
                        {backend.auliyaRecords
                          .filter((m) => m.id !== auliyaForm.editingId)
                          .map((m) => (
                            <option
                              key={m.id}
                              value={m.id}
                              style={{
                                backgroundColor: "var(--bg-surface)",
                                color: "var(--text-primary)",
                              }}
                            >
                              {m.name} ({m.silsila})
                            </option>
                          ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Block 2: Annual Urs, Shrine Coordinates & Shrine Image */}
                <div className="space-y-3.5 pt-3 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                  <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--accent-gold)" }}>
                    <MapPin className="w-4 h-4" />
                    <span>2. Annual Urs Date, Shrine GPS Coordinates &amp; Media</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5">
                    <div>
                      <label className="block font-semibold mb-1">Annual Urs Day (1–30)</label>
                      <input
                        type="number"
                        min={1}
                        max={30}
                        value={auliyaForm.ursDay}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, ursDay: Number(e.target.value) })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Annual Urs Hijri Month</label>
                      <select
                        value={auliyaForm.ursMonth}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, ursMonth: Number(e.target.value) })
                        }
                        className="ui-select w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        {HIJRI_MONTHS.map((m, idx) => (
                          <option
                            key={m}
                            value={idx + 1}
                            style={{
                              backgroundColor: "var(--bg-surface)",
                              color: "var(--text-primary)",
                            }}
                          >
                            {idx + 1}. {formatLocalizedHijriMonth(lang, idx + 1, m)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">{tp(lang, "City")} *</label>
                      <input
                        type="text"
                        required
                        value={auliyaForm.city}
                        onChange={(e) => setAuliyaForm({ ...auliyaForm, city: e.target.value })}
                        placeholder="Dewa Sharif / Baghdad"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">Country *</label>
                      <input
                        type="text"
                        required
                        value={auliyaForm.country}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, country: e.target.value })
                        }
                        placeholder="India / Iraq / Pakistan"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-4 gap-3.5 items-end">
                    <div>
                      <label className="block font-semibold mb-1">GPS Latitude</label>
                      <input
                        type="number"
                        step="any"
                        value={auliyaForm.lat}
                        onChange={(e) => setAuliyaForm({ ...auliyaForm, lat: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent tabular-nums"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">GPS Longitude</label>
                      <input
                        type="number"
                        step="any"
                        value={auliyaForm.lng}
                        onChange={(e) => setAuliyaForm({ ...auliyaForm, lng: e.target.value })}
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent tabular-nums"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div className="sm:col-span-2">
                      <label className="block font-semibold mb-1">Shrine Image URL</label>
                      <input
                        type="text"
                        value={auliyaForm.shrineImage}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, shrineImage: e.target.value })
                        }
                        placeholder="/images/shrines/baghdad.jpg"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-1.5">
                      <span style={{ color: "var(--text-muted)" }}>Quick Shrine Presets:</span>
                      {SHRINE_IMAGE_PRESETS.map((p) => (
                        <button
                          key={p.url}
                          type="button"
                          onClick={() => setAuliyaForm({ ...auliyaForm, shrineImage: p.url })}
                          className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer"
                          style={{
                            borderColor:
                              auliyaForm.shrineImage === p.url
                                ? "var(--accent-primary)"
                                : "var(--border-hairline)",
                            backgroundColor:
                              auliyaForm.shrineImage === p.url
                                ? "var(--accent-soft)"
                                : "var(--bg-elevated)",
                          }}
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>

                    <label className="inline-flex items-center gap-2 font-bold cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={auliyaForm.featured}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, featured: e.target.checked })
                        }
                        className="w-4 h-4 accent-amber-500"
                      />
                      <Star className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                      <span>Featured Saint Spotlight</span>
                    </label>
                  </div>
                </div>

                {/* Block 3: Biography, Architecture & Visiting Guide */}
                <div className="space-y-3.5 pt-3 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                  <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--accent-gold)" }}>
                    <BookOpen className="w-4 h-4" />
                    <span>3. Tazkirah Biography, Shrine Architecture &amp; Visiting Guide</span>
                  </h3>

                  <div>
                    <label className="block font-semibold mb-1">Short Biographical Summary *</label>
                    <textarea
                      rows={2}
                      required
                      value={auliyaForm.shortSummary}
                      onChange={(e) =>
                        setAuliyaForm({ ...auliyaForm, shortSummary: e.target.value })
                      }
                      placeholder="Concise introduction displayed on directory cards and spotlight banners…"
                      className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">Full Tazkirah Biography</label>
                    <textarea
                      rows={4}
                      value={auliyaForm.fullTazkirah}
                      onChange={(e) =>
                        setAuliyaForm({ ...auliyaForm, fullTazkirah: e.target.value })
                      }
                      placeholder="Comprehensive scholarly biography covering sacred sciences, Mujahadah, spiritual succession, and Sunni legacy…"
                      className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold mb-1">
                        Shrine Architecture &amp; Complex Details
                      </label>
                      <textarea
                        rows={2}
                        value={auliyaForm.shrineArchitecture}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, shrineArchitecture: e.target.value })
                        }
                        placeholder="e.g., Mughal marble dome with Kashani tilework and expansive courtyard…"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Ziyarat Visiting Guide &amp; Timings
                      </label>
                      <textarea
                        rows={2}
                        value={auliyaForm.visitingGuide}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, visitingGuide: e.target.value })
                        }
                        placeholder="e.g., Open Fajr to Isha; nearest rail hub & Langar Khana timings…"
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Block 4: Karamat, Adab-e-Ziyarat, Khulafa & Books/Tasanif */}
                <div className="space-y-3.5 pt-3 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                  <h3 className="font-bold text-sm flex items-center gap-2" style={{ color: "var(--accent-gold)" }}>
                    <Layers className="w-4 h-4" />
                    <span>4. Karamat, Adab-e-Ziyarat, Khulafa &amp; Authored Books (Tasanif)</span>
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    <div>
                      <label className="block font-semibold mb-1">
                        Karamat List (one entry per line)
                      </label>
                      <textarea
                        rows={3}
                        value={auliyaForm.karamatText}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, karamatText: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div>
                      <label className="block font-semibold mb-1">
                        Adab-e-Ziyarat Etiquette (one rule per line)
                      </label>
                      <textarea
                        rows={3}
                        value={auliyaForm.adabText}
                        onChange={(e) =>
                          setAuliyaForm({ ...auliyaForm, adabText: e.target.value })
                        }
                        className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      Illustrious Khulafa Names (comma-separated)
                    </label>
                    <input
                      type="text"
                      value={auliyaForm.khulafaText}
                      onChange={(e) =>
                        setAuliyaForm({ ...auliyaForm, khulafaText: e.target.value })
                      }
                      placeholder="e.g., Khwaja Qutbuddin Bakhtiyar Kaki, Shaikh Hamiduddin Nagauri"
                      className="w-full px-3 py-2.5 rounded-xl border bg-transparent"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>

                  {/* Interactive Books / Tasanif List */}
                  <div
                    className="p-4 rounded-2xl border space-y-3"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="font-bold">
                          Authored Books &amp; Tasanif ({auliyaForm.books.length})
                        </div>
                        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          Synced directly with the interactive Books Reader on the Saint Profile page
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setAuliyaForm({
                            ...auliyaForm,
                            books: [
                              ...auliyaForm.books,
                              {
                                title: "",
                                arabicOrUrduTitle: "",
                                genre: "Tasawwuf & Aqaid",
                                summary: "",
                                excerpt: "",
                              },
                            ],
                          })
                        }
                        className="px-3 py-1.5 rounded-xl border font-bold inline-flex items-center gap-1 cursor-pointer"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-surface)",
                          color: "var(--accent-primary)",
                        }}
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Book / Tasnif</span>
                      </button>
                    </div>

                    {auliyaForm.books.length > 0 && (
                      <div className="space-y-2.5">
                        {auliyaForm.books.map((book, bIdx) => (
                          <div
                            key={bIdx}
                            className="p-3 rounded-xl border space-y-2"
                            style={{
                              backgroundColor: "var(--bg-surface)",
                              borderColor: "var(--border-hairline)",
                            }}
                          >
                            <div className="grid grid-cols-1 sm:grid-cols-12 gap-2">
                              <input
                                type="text"
                                value={book.title}
                                onChange={(e) => {
                                  const next = auliyaForm.books.map((item, i) =>
                                    i === bIdx ? { ...item, title: e.target.value } : item
                                  );
                                  setAuliyaForm({ ...auliyaForm, books: next });
                                }}
                                placeholder="Book Title (e.g., Futuh al-Ghaib)"
                                className="sm:col-span-4 px-2.5 py-1.5 rounded-lg border bg-transparent"
                                style={{ borderColor: "var(--border-hairline)" }}
                              />
                              <input
                                type="text"
                                dir="rtl"
                                value={book.arabicOrUrduTitle}
                                onChange={(e) => {
                                  const next = auliyaForm.books.map((item, i) =>
                                    i === bIdx
                                      ? { ...item, arabicOrUrduTitle: e.target.value }
                                      : item
                                  );
                                  setAuliyaForm({ ...auliyaForm, books: next });
                                }}
                                placeholder="فتوح الغيب"
                                className="sm:col-span-4 px-2.5 py-1.5 rounded-lg border bg-transparent font-urdu"
                                style={{ borderColor: "var(--border-hairline)" }}
                              />
                              <input
                                type="text"
                                value={book.genre}
                                onChange={(e) => {
                                  const next = auliyaForm.books.map((item, i) =>
                                    i === bIdx ? { ...item, genre: e.target.value } : item
                                  );
                                  setAuliyaForm({ ...auliyaForm, books: next });
                                }}
                                placeholder="Genre (Fiqh / Tasawwuf)"
                                className="sm:col-span-3 px-2.5 py-1.5 rounded-lg border bg-transparent"
                                style={{ borderColor: "var(--border-hairline)" }}
                              />
                              <button
                                type="button"
                                onClick={() =>
                                  setAuliyaForm({
                                    ...auliyaForm,
                                    books: auliyaForm.books.filter((_, i) => i !== bIdx),
                                  })
                                }
                                aria-label="Remove book"
                                className="sm:col-span-1 p-1.5 rounded-lg border flex items-center justify-center cursor-pointer"
                                style={{
                                  borderColor: "rgba(239, 68, 68, 0.35)",
                                  color: "#F87171",
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                              <input
                                type="text"
                                value={book.summary}
                                onChange={(e) => {
                                  const next = auliyaForm.books.map((item, i) =>
                                    i === bIdx ? { ...item, summary: e.target.value } : item
                                  );
                                  setAuliyaForm({ ...auliyaForm, books: next });
                                }}
                                placeholder="Short summary of the work…"
                                className="px-2.5 py-1.5 rounded-lg border bg-transparent"
                                style={{ borderColor: "var(--border-hairline)" }}
                              />
                              <input
                                type="text"
                                value={book.excerpt}
                                onChange={(e) => {
                                  const next = auliyaForm.books.map((item, i) =>
                                    i === bIdx ? { ...item, excerpt: e.target.value } : item
                                  );
                                  setAuliyaForm({ ...auliyaForm, books: next });
                                }}
                                placeholder="Selected luminous excerpt…"
                                className="px-2.5 py-1.5 rounded-lg border bg-transparent"
                                style={{ borderColor: "var(--border-hairline)" }}
                              />
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* Publication Status & Submit Row */}
                <div
                  className="p-4 rounded-2xl border flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <div className="space-y-1 flex-1">
                    <label className="block font-bold">{ui.publish}</label>
                    <div className="flex flex-wrap items-center gap-3">
                      <select
                        value={
                          !canPublishAuliya && auliyaForm.status === "Published"
                            ? "Scholarly Verification"
                            : auliyaForm.status
                        }
                        onChange={(e) =>
                          setAuliyaForm({
                            ...auliyaForm,
                            status: e.target.value as AuliyaProfile["status"],
                          })
                        }
                        className="ui-select px-3 py-2 rounded-xl border bg-transparent font-bold"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        <option
                          value="Draft"
                          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                        >
                          {ui.statusDraft}
                        </option>
                        <option
                          value="Scholarly Verification"
                          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                        >
                          {ui.statusVerification}
                        </option>
                        {canPublishAuliya && (
                          <option
                            value="Published"
                            style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                          >
                            {ui.statusPublished} ({tp(lang, RBAC_ROLES.editor.label)} /{" "}
                            {tp(lang, RBAC_ROLES.super_admin.label)})
                          </option>
                        )}
                      </select>

                      {!canPublishAuliya && (
                        <span className="text-[11px]" style={{ color: "var(--accent-gold)" }}>
                          {ui.approvePublish}: {tp(lang, RBAC_ROLES.editor.label)} /{" "}
                          {tp(lang, RBAC_ROLES.super_admin.label)}
                        </span>
                      )}
                    </div>
                  </div>

                  <button
                    type="submit"
                    disabled={!canCreateAuliya || busyAction === "save-auliya"}
                    className="btn-primary px-6 py-3 rounded-xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45 shrink-0"
                  >
                    <Save className="w-4 h-4" />
                    <span>
                      {busyAction === "save-auliya"
                        ? `${tp(lang, "Loading")}…`
                        : `${tp(lang, "Save")} — ${tl(lang, "adminTabAuliya", ui.tabAuliya)}`}
                    </span>
                  </button>
                </div>
              </form>
            </section>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: URS & SACRED CALENDAR                                        */}
        {/* =================================================================== */}
        {activeTab === "urs" && (
          <motion.div
            key="tab-urs"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          >
            {/* Left 5 Cols: Create / Edit Urs & Sacred Event Form */}
            <section className="lg:col-span-5 bento-card p-5 sm:p-6 space-y-4 self-start">
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                    {ursForm.editingId ? tp(lang, "Edit") : ui.newRecord}
                  </div>
                  <h2 className="text-base sm:text-lg font-bold">
                    {tl(lang, "adminTabUrs", ui.tabUrs)}
                  </h2>
                </div>
                {ursForm.editingId && (
                  <button
                    type="button"
                    onClick={() => setUrsForm(createEmptyUrsForm(canPublishUrs))}
                    className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold cursor-pointer"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    {ui.newRecord}
                  </button>
                )}
              </div>

              {!canCreateUrs && (
                <div
                  className="p-3 rounded-xl border text-xs flex items-center justify-between gap-2"
                  style={{
                    backgroundColor: "var(--gold-soft)",
                    borderColor: "var(--border-hairline)",
                    color: "var(--accent-gold)",
                  }}
                >
                  <span>{ui.contributorRoleHint}</span>
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSwitch("creator")}
                    className="px-2.5 py-1 rounded-lg font-bold border cursor-pointer shrink-0"
                    style={{ borderColor: "var(--accent-gold)" }}
                  >
                    {ui.selectRole}: {tp(lang, RBAC_ROLES.creator.label)}
                  </button>
                </div>
              )}

              <form onSubmit={handleSaveUrs} className="space-y-3 text-xs">
                <div>
                  <label className="block font-semibold mb-1">Event Title (English) *</label>
                  <input
                    type="text"
                    required
                    value={ursForm.title}
                    onChange={(e) => setUrsForm({ ...ursForm, title: e.target.value })}
                    placeholder="e.g., Urs Sarkar Waris Pak (Dewa Sharif)"
                    className="w-full px-3 py-2 rounded-xl border bg-transparent"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Urdu / Arabic Title</label>
                  <input
                    type="text"
                    dir="rtl"
                    value={ursForm.urduTitle}
                    onChange={(e) => setUrsForm({ ...ursForm, urduTitle: e.target.value })}
                    placeholder="عرس سرکار وارث پاک"
                    className="w-full px-3 py-2 rounded-xl border bg-transparent font-urdu text-sm"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>

                <div>
                  <label className="block font-semibold mb-1">Subtitle / Historical Note</label>
                  <input
                    type="text"
                    value={ursForm.subtitle}
                    onChange={(e) => setUrsForm({ ...ursForm, subtitle: e.target.value })}
                    placeholder="1 Safar — Annual Spiritual Gathering"
                    className="w-full px-3 py-2 rounded-xl border bg-transparent"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>

                <div className="grid grid-cols-3 gap-2.5">
                  <div>
                    <label className="block font-semibold mb-1">Hijri Day</label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={ursForm.day}
                      onChange={(e) => setUrsForm({ ...ursForm, day: Number(e.target.value) })}
                      className="w-full px-2.5 py-2 rounded-xl border bg-transparent text-center"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Hijri Month</label>
                    <select
                      value={ursForm.month}
                      onChange={(e) => setUrsForm({ ...ursForm, month: Number(e.target.value) })}
                      className="ui-select w-full px-2 py-2 rounded-xl border bg-transparent"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {HIJRI_MONTHS.map((m, idx) => (
                        <option
                          key={m}
                          value={idx + 1}
                          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                        >
                          {idx + 1}. {formatLocalizedHijriMonth(lang, idx + 1, m)}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Duration (Days)</label>
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={ursForm.durationDays}
                      onChange={(e) =>
                        setUrsForm({ ...ursForm, durationDays: Number(e.target.value) })
                      }
                      className="w-full px-2.5 py-2 rounded-xl border bg-transparent text-center"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold mb-1">Commemoration Type</label>
                    <select
                      value={ursForm.type}
                      onChange={(e) =>
                        setUrsForm({
                          ...ursForm,
                          type: e.target.value as UrsEventRecord["type"],
                        })
                      }
                      className="ui-select w-full px-3 py-2 rounded-xl border bg-transparent font-semibold"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      <option value="urs" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                        Annual Urs Sharif (urs)
                      </option>
                      <option value="sacred" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                        Sacred Night / Eid (sacred)
                      </option>
                      <option value="fasting" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                        Sunnah Fasting Day (fasting)
                      </option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1">
                      {tl(lang, "adminTabAuliya", ui.tabAuliya)}
                    </label>
                    <select
                      value={ursForm.auliyaId}
                      onChange={(e) => {
                        const nextId = e.target.value;
                        const linked = backend.auliyaRecords.find((a) => a.id === nextId);
                        setUrsForm({
                          ...ursForm,
                          auliyaId: nextId,
                          city: ursForm.city || linked?.city || "",
                          country: ursForm.country || linked?.country || "India",
                          silsila: linked?.silsila || ursForm.silsila,
                        });
                      }}
                      className="ui-select w-full px-3 py-2 rounded-xl border bg-transparent"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      <option value="" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                        None — General Sacred Event
                      </option>
                      {backend.auliyaRecords.map((a) => (
                        <option
                          key={a.id}
                          value={a.id}
                          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                        >
                          {a.name} ({a.city})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2.5">
                  <div>
                    <label className="block font-semibold mb-1">{tp(lang, "City")}</label>
                    <input
                      type="text"
                      value={ursForm.city}
                      onChange={(e) => setUrsForm({ ...ursForm, city: e.target.value })}
                      placeholder="Baghdad / Ajmer"
                      className="w-full px-3 py-2 rounded-xl border bg-transparent"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Country</label>
                    <input
                      type="text"
                      value={ursForm.country}
                      onChange={(e) => setUrsForm({ ...ursForm, country: e.target.value })}
                      placeholder="Iraq / India"
                      className="w-full px-3 py-2 rounded-xl border bg-transparent"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-semibold mb-1">
                    Recommended Wird, Khatm &amp; Fatiha Practice
                  </label>
                  <textarea
                    rows={2}
                    value={ursForm.recommendedWird}
                    onChange={(e) =>
                      setUrsForm({ ...ursForm, recommendedWird: e.target.value })
                    }
                    className="w-full px-3 py-2 rounded-xl border bg-transparent"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>

                <div className="flex items-center justify-between gap-2 pt-1">
                  <label className="inline-flex items-center gap-2 font-semibold cursor-pointer">
                    <input
                      type="checkbox"
                      checked={ursForm.featured}
                      onChange={(e) =>
                        setUrsForm({ ...ursForm, featured: e.target.checked })
                      }
                      className="w-4 h-4 accent-amber-500"
                    />
                    <span>Featured Spotlight</span>
                  </label>

                  <select
                    value={
                      !canPublishUrs && ursForm.status === "Published"
                        ? "Scholarly Verification"
                        : ursForm.status
                    }
                    onChange={(e) =>
                      setUrsForm({
                        ...ursForm,
                        status: e.target.value as UrsEventRecord["status"],
                      })
                    }
                    aria-label="Urs publication status"
                    className="ui-select px-3 py-1.5 rounded-xl border bg-transparent font-bold"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <option value="Draft" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                      {ui.statusDraft}
                    </option>
                    <option
                      value="Scholarly Verification"
                      style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                    >
                      {ui.statusVerification}
                    </option>
                    {canPublishUrs && (
                      <option
                        value="Published"
                        style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                      >
                        {ui.statusPublished}
                      </option>
                    )}
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={!canCreateUrs || busyAction === "save-urs"}
                  className="btn-primary w-full py-2.5 px-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
                >
                  <Save className="w-4 h-4" />
                  <span>
                    {tp(lang, "Save")} — {tl(lang, "adminTabUrs", ui.tabUrs)}
                  </span>
                </button>
              </form>
            </section>

            {/* Right 7 Cols: Searchable Muharram–Dhu al-Hijjah Urs & Sacred Events List */}
            <section className="lg:col-span-7 bento-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base sm:text-lg font-bold flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <span>
                      {formatLocalizedHijriMonth(lang, 1, "Muharram")} –{" "}
                      {formatLocalizedHijriMonth(lang, 12, "Dhu al-Hijjah")} (
                      {filteredUrsEvents.length})
                    </span>
                  </h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Published events automatically appear on the Sanctuary Home &amp; Hijri Calendar
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 text-xs">
                <div className="sm:col-span-5 relative">
                  <Search
                    className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                    style={{ color: "var(--text-muted)" }}
                  />
                  <input
                    type="text"
                    value={ursSearch}
                    onChange={(e) => setUrsSearch(e.target.value)}
                    placeholder={`${tp(lang, "Search")}…`}
                    aria-label={tp(lang, "Search")}
                    className="w-full pl-8 pr-3 py-2 rounded-xl border bg-transparent"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>
                <select
                  value={ursMonthFilter}
                  onChange={(e) => setUrsMonthFilter(Number(e.target.value))}
                  aria-label="Filter by Hijri month"
                  className="sm:col-span-3 ui-select px-2.5 py-2 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <option value={0} style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                    {tp(lang, "All")} (12)
                  </option>
                  {HIJRI_MONTHS.map((m, idx) => (
                    <option
                      key={m}
                      value={idx + 1}
                      style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                    >
                      {idx + 1}. {formatLocalizedHijriMonth(lang, idx + 1, m)}
                    </option>
                  ))}
                </select>
                <select
                  value={ursTypeFilter}
                  onChange={(e) =>
                    setUrsTypeFilter(e.target.value as "all" | UrsEventRecord["type"])
                  }
                  aria-label="Filter by event type"
                  className="sm:col-span-2 ui-select px-2.5 py-2 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <option value="all" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                    {tp(lang, "All")}
                  </option>
                  <option value="urs" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                    Urs
                  </option>
                  <option value="sacred" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                    Sacred
                  </option>
                  <option value="fasting" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                    Fasting
                  </option>
                </select>
                <select
                  value={ursStatusFilter}
                  onChange={(e) =>
                    setUrsStatusFilter(e.target.value as "All" | UrsEventRecord["status"])
                  }
                  aria-label="Filter by publication status"
                  className="sm:col-span-2 ui-select px-2.5 py-2 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <option value="All" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                    {tp(lang, "All")}
                  </option>
                  <option value="Published" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                    {ui.statusPublished}
                  </option>
                  <option
                    value="Scholarly Verification"
                    style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                  >
                    {ui.statusVerification}
                  </option>
                  <option value="Draft" style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}>
                    {ui.statusDraft}
                  </option>
                </select>
              </div>

              <div className="space-y-2.5 max-h-[680px] overflow-y-auto pr-1">
                {filteredUrsEvents.map((ev) => {
                  const linkedSaint = ev.auliyaId
                    ? backend.auliyaRecords.find((a) => a.id === ev.auliyaId)
                    : undefined;
                  const canEditEv =
                    canEditAnyUrs ||
                    (canCreateUrs && ev.createdByUserId === authUser?.id);

                  return (
                    <div
                      key={ev.id}
                      className="p-3.5 rounded-2xl border space-y-2 transition-colors"
                      style={{
                        backgroundColor:
                          ursForm.editingId === ev.id
                            ? "var(--accent-soft)"
                            : "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <div className="flex flex-wrap items-start justify-between gap-2">
                        <div className="space-y-0.5">
                          <div className="flex flex-wrap items-center gap-2">
                            <span
                              className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold"
                              style={{
                                backgroundColor: "var(--gold-soft)",
                                color: "var(--accent-gold)",
                              }}
                            >
                              {ev.day}{" "}
                              {formatLocalizedHijriMonth(
                                lang,
                                ev.month,
                                HIJRI_MONTHS[(ev.month - 1 + 12) % 12]
                              )}
                              {ev.durationDays && ev.durationDays > 1
                                ? ` (${ev.durationDays}d)`
                                : ""}
                            </span>
                            <span
                              className="px-2 py-0.5 rounded-md text-[10px] uppercase font-bold border"
                              style={{
                                borderColor: "var(--border-hairline)",
                                backgroundColor: "var(--bg-surface)",
                                color: "var(--accent-primary)",
                              }}
                            >
                              {ev.type}
                            </span>
                            <StatusPill status={ev.status} ui={ui} />
                          </div>
                          <div className="font-bold text-sm pt-1">{ev.title}</div>
                          <div className="font-urdu text-xs" style={{ color: "var(--accent-gold)" }}>
                            {ev.urduTitle}
                          </div>
                        </div>

                        <div className="flex items-center gap-1.5">
                          <button
                            type="button"
                            disabled={!canEditEv && Boolean(activeRole)}
                            onClick={() => setUrsForm(mapRecordToUrsForm(ev))}
                            className="px-2.5 py-1.5 rounded-lg border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer disabled:opacity-40"
                            style={{
                              borderColor: "var(--border-hairline)",
                              backgroundColor: "var(--bg-surface)",
                            }}
                          >
                            <Edit3 className="w-3 h-3" />
                            <span>{tp(lang, "Edit")}</span>
                          </button>

                          {canPublishUrs && ev.status !== "Published" && (
                            <button
                              type="button"
                              onClick={() => handleQuickApproveUrs(ev)}
                              className="px-2.5 py-1.5 rounded-lg text-xs font-bold inline-flex items-center gap-1 cursor-pointer"
                              style={{
                                backgroundColor: "rgba(16, 185, 129, 0.16)",
                                color: "#10B981",
                                border: "1px solid rgba(16, 185, 129, 0.38)",
                              }}
                            >
                              <CheckCircle2 className="w-3 h-3" />
                              <span>{ui.publish}</span>
                            </button>
                          )}

                          {canDeleteUrs &&
                            (confirmDeleteUrsId === ev.id ? (
                              <div className="inline-flex items-center gap-1 text-xs">
                                <button
                                  type="button"
                                  onClick={() => handleDeleteUrs(ev.id, ev.title)}
                                  className="px-2 py-1 rounded-lg bg-red-500 text-white font-bold cursor-pointer"
                                >
                                  {tp(lang, "Delete")}
                                </button>
                                <button
                                  type="button"
                                  onClick={() => setConfirmDeleteUrsId(null)}
                                  className="px-2 py-1 rounded-lg border cursor-pointer"
                                  style={{ borderColor: "var(--border-hairline)" }}
                                >
                                  {tp(lang, "Cancel")}
                                </button>
                              </div>
                            ) : (
                              <button
                                type="button"
                                onClick={() => setConfirmDeleteUrsId(ev.id)}
                                aria-label={`${tp(lang, "Delete")} ${ev.title}`}
                                className="p-1.5 rounded-lg border cursor-pointer"
                                style={{
                                  borderColor: "rgba(239, 68, 68, 0.35)",
                                  color: "#F87171",
                                }}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            ))}
                        </div>
                      </div>

                      <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                        {ev.subtitle} • <span style={{ color: "var(--text-muted)" }}>{ev.city}, {ev.country}</span>
                      </div>

                      <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pt-1 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                        <span style={{ color: "var(--text-muted)" }}>
                          <strong style={{ color: "var(--text-secondary)" }}>Wird:</strong>{" "}
                          {ev.recommendedWird}
                        </span>
                        {linkedSaint && (
                          <Link
                            href={`/auliya?saint=${encodeURIComponent(linkedSaint.id)}`}
                            className="font-bold inline-flex items-center gap-1 shrink-0"
                            style={{ color: "var(--accent-primary)" }}
                          >
                            <Link2 className="w-3 h-3" />
                            <span>{linkedSaint.name}</span>
                          </Link>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: MODULAR DASHBOARD BUILDER & GLOBAL PLATFORM SETTINGS         */}
        {/* =================================================================== */}
        {activeTab === "modules" && (
          <motion.div
            key="tab-modules"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Section A: Interactive Home Layout & Navigation Builder */}
            <section className="bento-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <LayoutGrid className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <h2 className="text-base sm:text-lg font-bold">
                      {tl(lang, "adminTabModules", ui.tabModules)}
                    </h2>
                    {modulesDraft && (
                      <span className="badge-pill badge-gold">{tp(lang, "Edit")}</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Reorder Sanctuary sections, toggle visibility across Home &amp; Navigation, pin Bottom Nav shortcuts, and customize card labels.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {modulesDraft && (
                    <button
                      type="button"
                      onClick={() => setModulesDraft(null)}
                      className="px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {tp(lang, "Cancel")}
                    </button>
                  )}
                  {canManageModules ? (
                    <button
                      type="button"
                      onClick={handleSaveModulesLayout}
                      disabled={busyAction === "save-modules"}
                      className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {busyAction === "save-modules"
                          ? `${tp(lang, "Loading")}…`
                          : `${tp(lang, "Save")} — ${tl(lang, "adminTabModules", ui.tabModules)}`}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickRoleSwitch("editor")}
                      className="btn-peach px-3.5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>
                        {ui.selectRole}: {tp(lang, RBAC_ROLES.editor.label)}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="space-y-3">
                {activeModules.map((mod, idx) => (
                  <motion.div
                    key={mod.id}
                    layout
                    transition={{ duration: 0.18 }}
                    className="p-4 rounded-2xl border space-y-3"
                    style={{
                      backgroundColor: mod.enabled ? "var(--bg-elevated)" : "var(--bg-surface)",
                      borderColor: mod.featured
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                      opacity: mod.enabled ? 1 : 0.65,
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col gap-1">
                          <button
                            type="button"
                            disabled={!canManageModules || idx === 0}
                            onClick={() => moveModuleOrder(idx, -1)}
                            aria-label={`Move ${mod.id} up`}
                            className="p-1 rounded-md border cursor-pointer disabled:opacity-30"
                            style={{
                              borderColor: "var(--border-hairline)",
                              backgroundColor: "var(--bg-surface)",
                            }}
                          >
                            <ArrowUp className="w-3 h-3" />
                          </button>
                          <button
                            type="button"
                            disabled={!canManageModules || idx === activeModules.length - 1}
                            onClick={() => moveModuleOrder(idx, 1)}
                            aria-label={`Move ${mod.id} down`}
                            className="p-1 rounded-md border cursor-pointer disabled:opacity-30"
                            style={{
                              borderColor: "var(--border-hairline)",
                              backgroundColor: "var(--bg-surface)",
                            }}
                          >
                            <ArrowDown className="w-3 h-3" />
                          </button>
                        </div>

                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                          style={{
                            backgroundColor: "var(--accent-soft)",
                            color: "var(--accent-primary)",
                          }}
                        >
                          {renderModuleIcon(mod.iconKey, "w-5 h-5")}
                        </div>

                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-mono font-bold px-1.5 py-0.5 rounded" style={{ backgroundColor: "var(--bg-surface)", color: "var(--accent-gold)" }}>
                              #{idx + 1}
                            </span>
                            <span className="font-bold text-sm">
                              {mod.customTitle || t(lang, mod.i18nTitleKey)}
                            </span>
                            <span className="text-[11px] font-mono" style={{ color: "var(--text-muted)" }}>
                              ({mod.href})
                            </span>
                          </div>
                          <div className="text-xs" style={{ color: "var(--text-secondary)" }}>
                            {mod.subtitleTemplate}
                          </div>
                        </div>
                      </div>

                      {/* Module Toggles: Enabled, Featured, BottomNav */}
                      <div className="flex flex-wrap items-center gap-3 text-xs">
                        <label className="inline-flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!canManageModules}
                            checked={mod.enabled}
                            onChange={(e) =>
                              updateModuleItem(mod.id, { enabled: e.target.checked })
                            }
                            className="w-4 h-4 accent-emerald-500"
                          />
                          <span>{tp(lang, "Active")}</span>
                        </label>

                        <label className="inline-flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!canManageModules}
                            checked={mod.featured}
                            onChange={(e) =>
                              updateModuleItem(mod.id, { featured: e.target.checked })
                            }
                            className="w-4 h-4 accent-purple-500"
                          />
                          <span>Featured</span>
                        </label>

                        <label className="inline-flex items-center gap-1.5 font-semibold cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!canManageModules}
                            checked={mod.showInBottomNav}
                            onChange={(e) =>
                              updateModuleItem(mod.id, { showInBottomNav: e.target.checked })
                            }
                            className="w-4 h-4 accent-amber-500"
                          />
                          <span>Bottom Nav</span>
                        </label>
                      </div>
                    </div>

                    {/* Editable Title, Subtitle & Badge */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs pt-2 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                          Custom Title Override ({t(lang, mod.i18nTitleKey)})
                        </label>
                        <input
                          type="text"
                          disabled={!canManageModules}
                          value={mod.customTitle}
                          onChange={(e) =>
                            updateModuleItem(mod.id, { customTitle: e.target.value })
                          }
                          placeholder={t(lang, mod.i18nTitleKey)}
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent disabled:opacity-50"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                          Subtitle Template
                        </label>
                        <input
                          type="text"
                          disabled={!canManageModules}
                          value={mod.subtitleTemplate}
                          onChange={(e) =>
                            updateModuleItem(mod.id, { subtitleTemplate: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent disabled:opacity-50"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                          Card Badge Pill
                        </label>
                        <input
                          type="text"
                          disabled={!canManageModules}
                          value={mod.badgeText}
                          onChange={(e) =>
                            updateModuleItem(mod.id, { badgeText: e.target.value })
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent disabled:opacity-50"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </section>

            {/* Section B: Global Platform Settings & Announcement Banner */}
            <section className="bento-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Settings className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <h2 className="text-base sm:text-lg font-bold">
                      {t(lang, "settings")} — Announcement &amp; Defaults
                    </h2>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Configure Sanctuary title, community announcement banner, default theme &amp; language, and editorial policies.
                  </p>
                </div>

                {!canManageSettings && (
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSwitch("super_admin")}
                    className="btn-peach px-3.5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>
                      {ui.selectRole}: {tp(lang, RBAC_ROLES.super_admin.label)}
                    </span>
                  </button>
                )}
              </div>

              <form onSubmit={handleSavePlatformSettings} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold mb-1">Platform Title</label>
                    <input
                      type="text"
                      disabled={!canManageSettings}
                      value={activeSettings.platformTitle}
                      onChange={(e) => updateSettingsField("platformTitle", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border bg-transparent disabled:opacity-55"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>
                  <div>
                    <label className="block font-semibold mb-1">Platform Tagline</label>
                    <input
                      type="text"
                      disabled={!canManageSettings}
                      value={activeSettings.platformTagline}
                      onChange={(e) => updateSettingsField("platformTagline", e.target.value)}
                      className="w-full px-3 py-2.5 rounded-xl border bg-transparent disabled:opacity-55"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>
                </div>

                {/* Announcement Banner Controls */}
                <div
                  className="p-4 rounded-2xl border space-y-3"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <div className="flex items-center justify-between gap-2">
                    <div className="font-bold flex items-center gap-2">
                      <Megaphone className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                      <span>Global Sanctuary Announcement Banner</span>
                    </div>
                    <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
                      <input
                        type="checkbox"
                        disabled={!canManageSettings}
                        checked={activeSettings.announcementEnabled}
                        onChange={(e) =>
                          updateSettingsField("announcementEnabled", e.target.checked)
                        }
                        className="w-4 h-4 accent-emerald-500"
                      />
                      <span>{tp(lang, "Active")}</span>
                    </label>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
                    <div className="sm:col-span-3">
                      <label className="block font-semibold mb-1">Badge Label</label>
                      <input
                        type="text"
                        disabled={!canManageSettings}
                        value={activeSettings.announcementBadge}
                        onChange={(e) =>
                          updateSettingsField("announcementBadge", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl border bg-transparent disabled:opacity-55"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div className="sm:col-span-6">
                      <label className="block font-semibold mb-1">Announcement Message</label>
                      <input
                        type="text"
                        disabled={!canManageSettings}
                        value={activeSettings.announcementText}
                        onChange={(e) =>
                          updateSettingsField("announcementText", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl border bg-transparent disabled:opacity-55"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                    <div className="sm:col-span-3">
                      <label className="block font-semibold mb-1">Action Link Href</label>
                      <input
                        type="text"
                        disabled={!canManageSettings}
                        value={activeSettings.announcementHref}
                        onChange={(e) =>
                          updateSettingsField("announcementHref", e.target.value)
                        }
                        className="w-full px-3 py-2 rounded-xl border bg-transparent disabled:opacity-55"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                  </div>
                </div>

                {/* Default Theme, Default Language & Security Policies */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                  <div>
                    <label className="block font-semibold mb-1 flex items-center gap-1.5">
                      <Palette className="w-3.5 h-3.5" />
                      <span>{t(lang, "selectTheme")} (8)</span>
                    </label>
                    <select
                      disabled={!canManageSettings}
                      value={activeSettings.defaultTheme}
                      onChange={(e) =>
                        updateSettingsField("defaultTheme", e.target.value as ThemeId)
                      }
                      className="ui-select w-full px-3 py-2.5 rounded-xl border bg-transparent font-semibold disabled:opacity-55"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {SANCTUARY_THEMES.map((th) => (
                        <option
                          key={th.id}
                          value={th.id}
                          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                        >
                          {th.name} — {th.subtitle} ({th.mode})
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-semibold mb-1 flex items-center gap-1.5">
                      <Globe className="w-3.5 h-3.5" />
                      <span>{t(lang, "selectLanguage")} (10)</span>
                    </label>
                    <select
                      disabled={!canManageSettings}
                      value={activeSettings.defaultLang}
                      onChange={(e) =>
                        updateSettingsField("defaultLang", e.target.value as LangCode)
                      }
                      className="ui-select w-full px-3 py-2.5 rounded-xl border bg-transparent font-semibold disabled:opacity-55"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {LANGUAGES.map((lg) => (
                        <option
                          key={lg.code}
                          value={lg.code}
                          style={{ backgroundColor: "var(--bg-surface)", color: "var(--text-primary)" }}
                        >
                          {lg.label} ({lg.nativeLabel})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <label
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <div>
                      <div className="font-bold">Allow Public Self-Registration</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        Permit visitors to create Member &amp; Creator accounts
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!canManageSettings}
                      checked={activeSettings.allowSelfRegistration}
                      onChange={(e) =>
                        updateSettingsField("allowSelfRegistration", e.target.checked)
                      }
                      className="w-4 h-4 accent-emerald-500"
                    />
                  </label>

                  <label
                    className="p-3.5 rounded-xl border flex items-center justify-between gap-3 cursor-pointer"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <div>
                      <div className="font-bold">Require Scholar Verification to Publish</div>
                      <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        Route Creator submissions through Scholar Editor review queue
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      disabled={!canManageSettings}
                      checked={activeSettings.requireScholarVerificationForPublish}
                      onChange={(e) =>
                        updateSettingsField(
                          "requireScholarVerificationForPublish",
                          e.target.checked
                        )
                      }
                      className="w-4 h-4 accent-emerald-500"
                    />
                  </label>
                </div>

                <div className="flex justify-end gap-2">
                  {settingsDraft && (
                    <button
                      type="button"
                      onClick={() => setSettingsDraft(null)}
                      className="px-4 py-2.5 rounded-xl border font-semibold cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {tp(lang, "Cancel")}
                    </button>
                  )}
                  <button
                    type="submit"
                    disabled={!canManageSettings || busyAction === "save-settings"}
                    className="btn-primary px-5 py-2.5 rounded-xl font-bold inline-flex items-center gap-2 cursor-pointer disabled:opacity-45"
                  >
                    <Save className="w-4 h-4" />
                    <span>{tp(lang, "Save")}</span>
                  </button>
                </div>
              </form>
            </section>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: ZAKAT & DAILY QUEST BENCHMARKS                               */}
        {/* =================================================================== */}
        {activeTab === "economy" && (
          <motion.div
            key="tab-economy"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="space-y-6"
          >
            {/* Section A: Hanafi Zakat & Sadaqat-ul-Fitr Benchmarks */}
            <section className="bento-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Coins className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                    <h2 className="text-base sm:text-lg font-bold">
                      {tl(lang, "adminTabZakat", ui.tabZakat)} ({activeZakat.currencies.length})
                    </h2>
                    {zakatDraft && <span className="badge-pill badge-gold">{tp(lang, "Edit")}</span>}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Configure classical Hanafi Nisab weights (52.5 Tola Silver / 7.5 Tola Gold) and per-currency bullion &amp; Fitrah commodity rates.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {zakatDraft && (
                    <button
                      type="button"
                      onClick={() => setZakatDraft(null)}
                      className="px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {tp(lang, "Cancel")}
                    </button>
                  )}
                  {canManageZakat ? (
                    <button
                      type="button"
                      onClick={handleSaveZakat}
                      disabled={busyAction === "save-zakat"}
                      className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>
                        {tp(lang, "Save")} — {tl(lang, "adminTabZakat", ui.tabZakat)}
                      </span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickRoleSwitch("editor")}
                      className="btn-peach px-3.5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>
                        {ui.selectRole}: {tp(lang, RBAC_ROLES.editor.label)}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Global Nisab & Fitrah Weight Benchmarks */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <label className="block font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    Silver Nisab (g • 52.5 Tola)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!canManageZakat}
                    value={activeZakat.silverNisabGrams}
                    onChange={(e) =>
                      updateZakatTopField("silverNisabGrams", Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent font-bold tabular-nums"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>
                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <label className="block font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    Gold Nisab (g • 7.5 Tola)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!canManageZakat}
                    value={activeZakat.goldNisabGrams}
                    onChange={(e) =>
                      updateZakatTopField("goldNisabGrams", Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent font-bold tabular-nums"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>
                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <label className="block font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    Fitrah Wheat Weight (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!canManageZakat}
                    value={activeZakat.fitrahWheatKg}
                    onChange={(e) =>
                      updateZakatTopField("fitrahWheatKg", Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent font-bold tabular-nums"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>
                <div
                  className="p-3 rounded-xl border"
                  style={{
                    backgroundColor: "var(--bg-elevated)",
                    borderColor: "var(--border-hairline)",
                  }}
                >
                  <label className="block font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    Fitrah 1 Sa&apos; Dates/Barley (kg)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    disabled={!canManageZakat}
                    value={activeZakat.fitrahOtherKg}
                    onChange={(e) =>
                      updateZakatTopField("fitrahOtherKg", Number(e.target.value))
                    }
                    className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent font-bold tabular-nums"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                </div>
              </div>

              {/* Filter Currencies */}
              <div className="relative text-xs max-w-sm">
                <Filter
                  className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  value={currencySearch}
                  onChange={(e) => setCurrencySearch(e.target.value)}
                  placeholder="Filter 12 currencies (USD, INR, PKR, GBP, SAR…)"
                  aria-label="Filter currencies"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>

              {/* 12-Currency Rate Matrix Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-xs border-collapse min-w-[860px]">
                  <thead>
                    <tr
                      className="border-b text-left"
                      style={{ borderColor: "var(--border-hairline)", color: "var(--text-muted)" }}
                    >
                      <th className="py-2.5 pr-3">Currency</th>
                      <th className="py-2.5 px-2">Gold 24K / g</th>
                      <th className="py-2.5 px-2">Silver / g</th>
                      <th className="py-2.5 px-2">Wheat / kg</th>
                      <th className="py-2.5 px-2">Dates / kg</th>
                      <th className="py-2.5 px-2">Raisins / kg</th>
                      <th className="py-2.5 px-2">Barley / kg</th>
                      <th className="py-2.5 pl-2 text-right">Computed Silver Nisab</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredCurrencies.map((cur) => {
                      const silverNisabVal =
                        activeZakat.silverNisabGrams * cur.silverPerGram;
                      return (
                        <tr
                          key={cur.code}
                          className="border-b"
                          style={{ borderColor: "var(--border-hairline)" }}
                        >
                          <td className="py-2.5 pr-3">
                            <div className="font-bold">
                              {cur.code} ({cur.symbol.trim()})
                            </div>
                            <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                              {cur.name}
                            </div>
                          </td>
                          {(
                            [
                              "goldPerGram24K",
                              "silverPerGram",
                              "fitrahWheatPerKg",
                              "fitrahDatesPerKg",
                              "fitrahRaisinsPerKg",
                              "fitrahBarleyPerKg",
                            ] as const
                          ).map((field) => (
                            <td key={field} className="py-2 px-1.5">
                              <input
                                type="number"
                                step="any"
                                disabled={!canManageZakat}
                                value={cur[field]}
                                onChange={(e) =>
                                  updateZakatCurrency(cur.code, field, Number(e.target.value))
                                }
                                aria-label={`${cur.code} ${field}`}
                                className="w-24 px-2 py-1.5 rounded-lg border bg-transparent tabular-nums font-semibold disabled:opacity-55"
                                style={{ borderColor: "var(--border-hairline)" }}
                              />
                            </td>
                          ))}
                          <td
                            className="py-2.5 pl-2 text-right font-extrabold tabular-nums"
                            style={{ color: "var(--accent-gold)" }}
                          >
                            {cur.symbol}
                            {silverNisabVal.toLocaleString(undefined, {
                              maximumFractionDigits: 0,
                            })}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </section>

            {/* Section B: Daily Barakah Quests & Spiritual Milestones */}
            <section className="bento-card p-5 sm:p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Flame className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <h2 className="text-base sm:text-lg font-bold">
                      Daily Barakah Quests &amp; Spiritual Milestones
                    </h2>
                    {gamificationDraft && (
                      <span className="badge-pill badge-gold">{tp(lang, "Edit")}</span>
                    )}
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Configure daily devotion goals and spiritual milestone weights across Salah, Sunnahs, Quran, and Tasbih.
                  </p>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {gamificationDraft && (
                    <button
                      type="button"
                      onClick={() => setGamificationDraft(null)}
                      className="px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {tp(lang, "Cancel")}
                    </button>
                  )}
                  {canManageGamification ? (
                    <button
                      type="button"
                      onClick={handleSaveGamification}
                      disabled={busyAction === "save-gamification"}
                      className="btn-primary px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Save className="w-4 h-4" />
                      <span>{tp(lang, "Save")}</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleQuickRoleSwitch("super_admin")}
                      className="btn-peach px-3.5 py-2 rounded-xl text-xs inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <Unlock className="w-3.5 h-3.5" />
                      <span>
                        {ui.selectRole}: {tp(lang, RBAC_ROLES.super_admin.label)}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              {/* Milestone Weights 8-Card Grid */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>
                  Practice Milestone Weights
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  {(
                    [
                      { key: "salahJamaat", label: "Salah with Jamaat" },
                      { key: "salahOnTime", label: "Salah On Time" },
                      { key: "sunnahCheck", label: "Sunnah Revived" },
                      { key: "quranPage", label: "Quran Page / Ayah" },
                      { key: "tasbihMilestone", label: "Tasbih 33x Milestone" },
                      { key: "zakatLogged", label: "Zakat Calculated" },
                      { key: "barsiFatihaGift", label: "Barsi Fatiha Gift" },
                      { key: "curatorSubmission", label: "Curator Contribution" },
                    ] as const
                  ).map((item) => (
                    <div
                      key={item.key}
                      className="p-3 rounded-xl border"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                      }}
                    >
                      <label className="block font-semibold mb-1">{item.label}</label>
                      <div className="flex items-center gap-1.5">
                        <input
                          type="number"
                          min={0}
                          max={1000}
                          disabled={!canManageGamification}
                          value={activeGamification.xpRewards[item.key]}
                          onChange={(e) =>
                            updateXpReward(item.key, Number(e.target.value))
                          }
                          className="w-full px-2.5 py-1.5 rounded-lg border bg-transparent font-extrabold tabular-nums disabled:opacity-55"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: "var(--accent-gold)",
                          }}
                        />
                        <span className="font-bold" style={{ color: "var(--text-muted)" }}>
                          pts
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Daily Quests Config */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2.5" style={{ color: "var(--text-muted)" }}>
                  Daily Barakah Quests ({activeGamification.dailyQuests.length})
                </h3>
                <div className="space-y-2.5 text-xs">
                  {activeGamification.dailyQuests.map((quest) => (
                    <div
                      key={quest.id}
                      className="p-3.5 rounded-xl border grid grid-cols-1 sm:grid-cols-12 gap-3 items-center"
                      style={{
                        backgroundColor: "var(--bg-elevated)",
                        borderColor: "var(--border-hairline)",
                        opacity: quest.enabled ? 1 : 0.6,
                      }}
                    >
                      <div className="sm:col-span-5">
                        <input
                          type="text"
                          disabled={!canManageGamification}
                          value={quest.title}
                          onChange={(e) =>
                            updateDailyQuest(quest.id, { title: e.target.value })
                          }
                          aria-label={`Quest title ${quest.id}`}
                          className="w-full font-bold bg-transparent border-b pb-0.5 mb-1 disabled:opacity-70"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                        <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                          {quest.subtitle} • <code>{quest.metric}</code>
                        </div>
                      </div>

                      <div className="sm:col-span-3 flex items-center gap-2">
                        <label className="text-[11px] font-semibold shrink-0" style={{ color: "var(--text-muted)" }}>
                          Target:
                        </label>
                        <input
                          type="number"
                          min={1}
                          disabled={!canManageGamification}
                          value={quest.target}
                          onChange={(e) =>
                            updateDailyQuest(quest.id, {
                              target: Math.max(1, Number(e.target.value)),
                            })
                          }
                          aria-label={`Target for ${quest.title}`}
                          className="w-20 px-2.5 py-1.5 rounded-lg border bg-transparent font-bold tabular-nums disabled:opacity-55"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>

                      <div className="sm:col-span-2 flex items-center gap-2">
                        <label className="text-[11px] font-semibold shrink-0" style={{ color: "var(--text-muted)" }}>
                          Points:
                        </label>
                        <input
                          type="number"
                          min={5}
                          disabled={!canManageGamification}
                          value={quest.xpReward}
                          onChange={(e) =>
                            updateDailyQuest(quest.id, {
                              xpReward: Math.max(5, Number(e.target.value)),
                            })
                          }
                          aria-label={`Reward for ${quest.title}`}
                          className="w-20 px-2.5 py-1.5 rounded-lg border bg-transparent font-bold tabular-nums disabled:opacity-55"
                          style={{
                            borderColor: "var(--border-hairline)",
                            color: "var(--accent-gold)",
                          }}
                        />
                      </div>

                      <div className="sm:col-span-2 flex sm:justify-end">
                        <label className="inline-flex items-center gap-2 font-bold cursor-pointer">
                          <input
                            type="checkbox"
                            disabled={!canManageGamification}
                            checked={quest.enabled}
                            onChange={(e) =>
                              updateDailyQuest(quest.id, { enabled: e.target.checked })
                            }
                            className="w-4 h-4 accent-emerald-500"
                          />
                          <span>{tp(lang, "Active")}</span>
                        </label>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </motion.div>
        )}

        {/* =================================================================== */}
        {/* TAB 6: SHA-256 AUDIT TRAIL & DB SNAPSHOT                            */}
        {/* =================================================================== */}
        {activeTab === "audit" && (
          <motion.div
            key="tab-audit"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-5"
          >
            {/* Left 8 Cols: Tamper-Evident SHA-256 Audit Chain */}
            <section className="lg:col-span-8 bento-card p-5 sm:p-6 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2">
                    <Hash className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <h2 className="text-base sm:text-lg font-bold">
                      {tl(lang, "adminTabAudit", ui.tabAudit)} ({filteredAuditLogs.length})
                    </h2>
                  </div>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    Every auth session, role change, profile edit, and configuration update is cryptographically chained via <code className="font-mono">prevHash → hash</code>.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    disabled={busyAction === "verify-audit"}
                    onClick={handleVerifyAuditChain}
                    className="px-3 py-1 rounded-full border text-[11px] font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-elevated)" }}
                  >
                    <RefreshCw className={`w-3 h-3 ${busyAction === "verify-audit" ? "animate-spin" : ""}`} />
                    <span>Verify SHA-256 Chain</span>
                  </button>
                  <span
                    className={`badge-pill ${
                      (auditVerifyStatus ? auditVerifyStatus.valid : auditChainIntact)
                        ? "badge-emerald"
                        : "badge-crimson"
                    }`}
                  >
                    <ShieldCheck className="w-3.5 h-3.5" />
                    {auditVerifyStatus
                      ? auditVerifyStatus.valid
                        ? `Verified (${auditVerifyStatus.checkedCount})`
                        : "Hash Link Mismatch"
                      : auditChainIntact
                      ? "SHA-256 Chain Intact"
                      : "Hash Link Mismatch"}
                  </span>
                </div>
              </div>

              <div className="relative text-xs">
                <Search
                  className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2"
                  style={{ color: "var(--text-muted)" }}
                />
                <input
                  type="text"
                  value={auditSearch}
                  onChange={(e) => setAuditSearch(e.target.value)}
                  placeholder={`${tp(lang, "Search")}…`}
                  aria-label={tp(lang, "Search")}
                  className="w-full pl-9 pr-3 py-2.5 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>

              <div className="space-y-2.5 max-h-[620px] overflow-y-auto pr-1 text-xs">
                {filteredAuditLogs.map((log, idx) => (
                  <div
                    key={log.id}
                    className="p-3.5 rounded-2xl border space-y-2"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="px-2 py-0.5 rounded-md font-mono font-bold text-[11px]"
                          style={{
                            backgroundColor: "var(--accent-soft)",
                            color: "var(--accent-primary)",
                          }}
                        >
                          {log.action}
                        </span>
                        <span className="font-bold">{log.actorName}</span>
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-semibold border"
                          style={{
                            borderColor: "var(--border-hairline)",
                            backgroundColor: "var(--bg-surface)",
                            color: "var(--accent-gold)",
                          }}
                        >
                          {log.actorRole in RBAC_ROLES
                            ? tp(lang, RBAC_ROLES[log.actorRole as UserRole].label)
                            : ui.guestSession}
                        </span>
                      </div>
                      <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                        #{filteredAuditLogs.length - idx} •{" "}
                        {log.timestamp.replace("T", " ").slice(0, 19)} UTC
                      </span>
                    </div>

                    <div style={{ color: "var(--text-secondary)" }}>{log.target}</div>

                    {/* Cryptographic prevHash -> hash chain */}
                    <div
                      className="p-2 rounded-xl border flex flex-wrap items-center justify-between gap-2 font-mono text-[10px]"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        borderColor: "var(--border-hairline)",
                        color: "var(--text-muted)",
                      }}
                    >
                      <div className="truncate">
                        <span>prev: {log.prevHash.slice(0, 12)}…</span>
                        <span className="mx-1.5" style={{ color: "var(--accent-gold)" }}>
                          →
                        </span>
                        <span style={{ color: "var(--accent-primary)" }}>
                          sha256: {log.hash.slice(0, 16)}…
                        </span>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(log.hash).catch(() => null);
                          setCopiedHashId(log.id);
                          setTimeout(() => setCopiedHashId(null), 1800);
                        }}
                        aria-label="Copy full SHA-256 hash"
                        className="px-2 py-0.5 rounded border inline-flex items-center gap-1 cursor-pointer shrink-0"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        {copiedHashId === log.id ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{tp(lang, "Copied")}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>Hash</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Right 4 Cols: Super Admin Database Snapshot & Clean Seed Reset */}
            <aside className="lg:col-span-4 space-y-4">
              <div className="bento-card p-5 space-y-4 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                    <h2 className="text-base font-bold">{ui.exportSnapshot}</h2>
                  </div>
                </div>
                <p style={{ color: "var(--text-secondary)" }}>
                  Export a portable JSON snapshot of Auliya profiles, Urs events, Barsi memorials, Home layout, Nisab rates, and SHA-256 audit logs, or restore the clean Sanctuary seed.
                </p>

                {!canSnapshotDb && (
                  <button
                    type="button"
                    onClick={() => handleQuickRoleSwitch("super_admin")}
                    className="btn-peach w-full py-2.5 px-3 rounded-xl font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    <Unlock className="w-3.5 h-3.5" />
                    <span>
                      {ui.selectRole}: {tp(lang, RBAC_ROLES.super_admin.label)}
                    </span>
                  </button>
                )}

                {/* Export Full Backend JSON Snapshot */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button
                    type="button"
                    disabled={!canSnapshotDb || busyAction === "export-db"}
                    onClick={handleExportSnapshot}
                    className="btn-primary py-3 px-4 rounded-xl font-bold inline-flex items-center justify-center gap-2 cursor-pointer disabled:opacity-45"
                  >
                    <Download className="w-4 h-4" />
                    <span>
                      {busyAction === "export-db"
                        ? `${tp(lang, "Loading")}…`
                        : ui.exportSnapshot}
                    </span>
                  </button>
                  <label
                    className={`py-3 px-4 rounded-xl border font-bold inline-flex items-center justify-center gap-2 ${
                      canSnapshotDb ? "cursor-pointer" : "opacity-45 pointer-events-none"
                    }`}
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <Upload className="w-4 h-4" />
                    <span>{busyAction === "restore-db" ? `${tp(lang, "Loading")}…` : "Restore JSON"}</span>
                    <input
                      type="file"
                      accept="application/json,.json"
                      disabled={!canSnapshotDb || busyAction === "restore-db"}
                      onChange={handleRestoreSnapshotFile}
                      className="sr-only"
                    />
                  </label>
                </div>

                {exportedJson && (
                  <div
                    className="p-3 rounded-xl border space-y-2"
                    style={{
                      backgroundColor: "var(--bg-elevated)",
                      borderColor: "var(--border-hairline)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold inline-flex items-center gap-1">
                        <FileJson className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                        Snapshot ({(exportedJson.length / 1024).toFixed(1)} KB)
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          navigator.clipboard?.writeText(exportedJson).catch(() => null);
                          setCopiedSnapshot(true);
                          setTimeout(() => setCopiedSnapshot(false), 1800);
                        }}
                        className="px-2 py-1 rounded border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        {copiedSnapshot ? (
                          <>
                            <Check className="w-3 h-3 text-emerald-400" />
                            <span>{tp(lang, "Copied")}</span>
                          </>
                        ) : (
                          <>
                            <Copy className="w-3 h-3" />
                            <span>JSON</span>
                          </>
                        )}
                      </button>
                    </div>
                    <pre
                      className="max-h-48 overflow-auto p-2.5 rounded-lg text-[10px] font-mono"
                      style={{
                        backgroundColor: "var(--bg-surface)",
                        color: "var(--text-secondary)",
                      }}
                    >
                      {exportedJson.slice(0, 1800)}
                      {exportedJson.length > 1800 ? "\n… [Full JSON downloaded]" : ""}
                    </pre>
                  </div>
                )}

                {/* Reset Backend Database to Clean Seed */}
                <div
                  className="pt-4 border-t space-y-2.5"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <div className="font-bold text-red-400 flex items-center gap-1.5">
                    <AlertTriangle className="w-4 h-4" />
                    <span>{ui.resetSeed}</span>
                  </div>
                  <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                    Re-initializes all collections back to the factory Sunni Sanctuary seed and logs{" "}
                    <code>DATABASE_RESET_TO_DEFAULTS</code>.
                  </p>

                  {!armResetConfirm ? (
                    <button
                      type="button"
                      disabled={!canSnapshotDb}
                      onClick={() => setArmResetConfirm(true)}
                      className="w-full py-2.5 px-4 rounded-xl border font-bold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
                      style={{
                        borderColor: "rgba(239, 68, 68, 0.45)",
                        backgroundColor: "rgba(239, 68, 68, 0.1)",
                        color: "#F87171",
                      }}
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>{ui.resetSeed}</span>
                    </button>
                  ) : (
                    <div
                      className="p-3 rounded-xl border space-y-2"
                      style={{
                        borderColor: "rgba(239, 68, 68, 0.55)",
                        backgroundColor: "rgba(239, 68, 68, 0.14)",
                      }}
                    >
                      <div className="font-bold text-red-300">
                        {ui.resetSeed}?
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          disabled={busyAction === "reset-db"}
                          onClick={handleResetDatabase}
                          className="flex-1 py-2 px-3 rounded-lg bg-red-500 text-white font-bold cursor-pointer"
                        >
                          {busyAction === "reset-db" ? `${tp(lang, "Loading")}…` : tp(lang, "Reset")}
                        </button>
                        <button
                          type="button"
                          onClick={() => setArmResetConfirm(false)}
                          className="py-2 px-3 rounded-lg border font-semibold cursor-pointer"
                          style={{
                            borderColor: "var(--border-hairline)",
                            backgroundColor: "var(--bg-surface)",
                          }}
                        >
                          {tp(lang, "Cancel")}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Technical Engine & Live Collection Telemetry Card */}
              <div className="quran-gradient-card p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm flex items-center gap-2">
                    <UserCheck className="w-4 h-4" />
                    <span>Storage &amp; Telemetry</span>
                  </div>
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/15 text-[10px] font-semibold">
                    <Server className="w-3 h-3" />
                    {backend.backendMode === "supabase"
                      ? "Supabase Cloud"
                      : backend.backendMode === "server-api"
                      ? "REST API"
                      : "Local Engine"}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-2.5 rounded-xl bg-white/15">
                    <div className="text-[10px] opacity-85">
                      {tl(lang, "adminTabAuliya", ui.tabAuliya)}
                    </div>
                    <div className="text-lg font-extrabold tabular-nums">
                      {backend.auliyaRecords.length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/15">
                    <div className="text-[10px] opacity-85">
                      {tl(lang, "adminTabUrs", ui.tabUrs)}
                    </div>
                    <div className="text-lg font-extrabold tabular-nums">
                      {backend.ursEvents.length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/15">
                    <div className="text-[10px] opacity-85">
                      {tl(lang, "adminTabModules", ui.tabModules)}
                    </div>
                    <div className="text-lg font-extrabold tabular-nums">
                      {backend.modules.length}
                    </div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-white/15">
                    <div className="text-[10px] opacity-85">
                      {tl(lang, "adminTabZakat", ui.tabZakat)}
                    </div>
                    <div className="text-lg font-extrabold tabular-nums">
                      {backend.zakatConfig.currencies.length}
                    </div>
                  </div>
                </div>
              </div>

              {/* Supabase Cloud Backend Connector */}
              <div className="bento-card p-5 space-y-3 text-xs">
                <div className="flex items-center justify-between gap-2">
                  <div className="font-bold text-sm flex items-center gap-2">
                    <Database className="w-4 h-4 text-[var(--accent-primary)]" />
                    <span>Supabase Cloud Backend</span>
                  </div>
                  <span
                    className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                    style={{
                      backgroundColor:
                        backend.backendMode === "supabase"
                          ? "rgba(16,185,129,0.16)"
                          : "var(--bg-subtle)",
                      color:
                        backend.backendMode === "supabase"
                          ? "#10B981"
                          : "var(--text-muted)",
                    }}
                  >
                    {backend.backendMode === "supabase" ? "Connected" : "Optional"}
                  </span>
                </div>
                <p style={{ color: "var(--text-muted)" }}>
                  Connect a PostgreSQL + RLS Supabase project (run{" "}
                  <code className="text-[10px] px-1 py-0.5 rounded bg-black/10 dark:bg-white/10">
                    supabase/migrations/001_initial_schema.sql
                  </code>{" "}
                  first) for live multi-device sync even on static GitHub Pages.
                </p>
                <div className="space-y-2">
                  <div>
                    <label
                      className="block text-[10px] font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Project URL
                    </label>
                    <input
                      type="url"
                      value={sbUrl}
                      onChange={(e) => setSbUrl(e.target.value)}
                      placeholder="https://your-project.supabase.co"
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-subtle)",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      className="block text-[10px] font-semibold uppercase tracking-wider mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Anon Public Key
                    </label>
                    <input
                      type="password"
                      value={sbAnonKey}
                      onChange={(e) => setSbAnonKey(e.target.value)}
                      placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                      className="w-full px-3 py-2 rounded-xl border text-xs outline-none"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-subtle)",
                      }}
                    />
                  </div>
                </div>
                {sbTestResult && (
                  <div
                    className="p-2.5 rounded-xl border text-[11px]"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-subtle)",
                    }}
                  >
                    {sbTestResult}
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    disabled={busyAction === "supabase-connect"}
                    onClick={handleConnectSupabase}
                    className="flex-1 py-2 px-3 rounded-xl font-bold text-white cursor-pointer disabled:opacity-60"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                  >
                    {busyAction === "supabase-connect"
                      ? `${tp(lang, "Loading")}…`
                      : "Test & Connect"}
                  </button>
                  {backend.backendMode === "supabase" && (
                    <button
                      type="button"
                      onClick={handleDisconnectSupabase}
                      className="py-2 px-3 rounded-xl border font-semibold cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-subtle)",
                      }}
                    >
                      Disconnect
                    </button>
                  )}
                </div>
              </div>
            </aside>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense
      fallback={
        <div className="bento-card p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Loading Sanctuary Studio…
        </div>
      }
    >
      <AdminControlCenterInner />
    </Suspense>
  );
}
