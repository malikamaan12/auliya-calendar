import type { AuliyaProfile } from "@/data/auliya";
import type { LangCode } from "./i18n";
import type { ThemeId } from "./themes";

export type UserRole = "super_admin" | "editor" | "creator" | "member";

export type PermissionKey =
  | "auliya:create"
  | "auliya:edit_own"
  | "auliya:edit_any"
  | "auliya:publish"
  | "auliya:delete"
  | "urs:create"
  | "urs:edit_any"
  | "urs:publish"
  | "urs:delete"
  | "barsi:manage_own"
  | "barsi:moderate_community"
  | "modules:manage"
  | "zakat:manage_rates"
  | "gamification:manage"
  | "settings:manage"
  | "users:manage"
  | "audit:view"
  | "db:snapshot";

export interface RoleMeta {
  role: UserRole;
  label: string;
  arabicBadge: string;
  badgeColor: string;
  description: string;
  permissions: PermissionKey[];
}

export const RBAC_ROLES: Record<UserRole, RoleMeta> = {
  super_admin: {
    role: "super_admin",
    label: "Super Admin",
    arabicBadge: "ناظمِ اعلیٰ",
    badgeColor: "#F59E0B",
    description:
      "Full platform governance: manage RBAC user roles, reorder/toggle dashboard modules, edit Zakat & Gamification configs, publish/delete Auliya & Urs records, and export/restore database snapshots.",
    permissions: [
      "auliya:create",
      "auliya:edit_own",
      "auliya:edit_any",
      "auliya:publish",
      "auliya:delete",
      "urs:create",
      "urs:edit_any",
      "urs:publish",
      "urs:delete",
      "barsi:manage_own",
      "barsi:moderate_community",
      "modules:manage",
      "zakat:manage_rates",
      "gamification:manage",
      "settings:manage",
      "users:manage",
      "audit:view",
      "db:snapshot",
    ],
  },
  editor: {
    role: "editor",
    label: "Scholar Editor",
    arabicBadge: "محقق و مدون",
    badgeColor: "#10B981",
    description:
      "Scholarly verification & editorial control: review Creator drafts, edit any Auliya biography or Urs calendar event, approve & publish to the live directory, and update Zakat metal benchmarks.",
    permissions: [
      "auliya:create",
      "auliya:edit_own",
      "auliya:edit_any",
      "auliya:publish",
      "urs:create",
      "urs:edit_any",
      "urs:publish",
      "barsi:manage_own",
      "barsi:moderate_community",
      "modules:manage",
      "zakat:manage_rates",
      "audit:view",
    ],
  },
  creator: {
    role: "creator",
    label: "Curator / Creator",
    arabicBadge: "خادمِ تذکرہ",
    badgeColor: "#38BDF8",
    description:
      "Content contributor access: author rich Auliya Allah profiles (biography, shrine GPS, 360° hotspots, books, Shajrah) and submit Urs dates for Scholarly Editor verification.",
    permissions: [
      "auliya:create",
      "auliya:edit_own",
      "urs:create",
      "barsi:manage_own",
      "audit:view",
    ],
  },
  member: {
    role: "member",
    label: "Community Member",
    arabicBadge: "رفیقِ کارواں",
    badgeColor: "#A855F7",
    description:
      "Personal sanctuary account: sync Spiritual XP & Ranks, manage Family Barsi & 30-Para Khatm-e-Quran boards, save encrypted Zakat ledgers, and customize personal themes & languages.",
    permissions: ["barsi:manage_own"],
  },
};

export function hasPermission(role: UserRole | undefined | null, perm: PermissionKey): boolean {
  if (!role) return false;
  return RBAC_ROLES[role]?.permissions.includes(perm) ?? false;
}

export interface UserProgressSnapshot {
  streakDays?: number;
  bestQuizTier?: number;
  lastQuranRef?: string;
  tasbihTotalToday?: number;
  hawlHijriMonth?: number;
  hawlHijriDay?: number;
  updatedAt?: string;
}

export interface UserAccount {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  city: string;
  avatarColor: string;
  status: "active" | "suspended";
  xp: number;
  progress?: UserProgressSnapshot;
  passwordSalt: string;
  passwordHash: string;
  createdAt: string;
  lastLoginAt: string;
}

export type PublicUserAccount = Omit<UserAccount, "passwordSalt" | "passwordHash">;

export interface AuthSessionRecord {
  token: string;
  userId: string;
  createdAt: string;
  expiresAt: string;
}

export interface ManagedAuliyaRecord extends AuliyaProfile {
  createdByUserId: string;
  createdByName: string;
  verifiedByName?: string;
  reviewNotes?: string;
  reviewedAt?: string;
  updatedAt: string;
  featured?: boolean;
  era?: string;
  shrineArchitecture?: string;
  visitingGuide?: string;
  famousQuotes?: string[];
  silsilaChain?: string[];
}

export interface UrsEventRecord {
  id: string;
  month: number; // 1..12 Hijri
  day: number; // 1..30 Hijri
  durationDays?: number;
  title: string;
  urduTitle: string;
  subtitle: string;
  city: string;
  country: string;
  silsila?: string;
  auliyaId?: string;
  type: "urs" | "sacred" | "fasting";
  recommendedWird: string;
  featured: boolean;
  status: "Draft" | "Scholarly Verification" | "Published";
  reviewNotes?: string;
  reviewedAt?: string;
  createdByUserId: string;
  createdByName: string;
  updatedAt: string;
}

export interface BarsiIsalGiftLog {
  id: string;
  donorName: string;
  giftType:
    | "Surah Al-Fatihah"
    | "Surah Al-Ikhlas (3x)"
    | "Surah Yasin"
    | "Surah Al-Mulk"
    | "Ayat-ul-Kursi"
    | "Durood-e-Pak (100x)"
    | "Khatm-e-Quran Para";
  count: number;
  createdAt: string;
}

export interface BarsiRecord {
  id: string;
  ownerUserId: string;
  ownerName: string;
  personName: string;
  urduName: string;
  relation: string;
  hijriMonth: number;
  hijriDay: number;
  hijriYear?: number;
  gregorianDeathDate?: string;
  restingPlaceCity: string;
  qabrastanName: string;
  memoryNote: string;
  favoriteWird: string;
  visibility: "private" | "community";
  /** 30-Para Khatm-e-Quran completion map: paraNumber (1..30) -> readerName */
  khatmParas: Record<string, string>;
  totalFatihaCount: number;
  totalDuroodCount: number;
  totalYasinCount: number;
  giftLogs: BarsiIsalGiftLog[];
  createdAt: string;
  updatedAt: string;
}

export type ModuleIconKey =
  | "BookOpen"
  | "Clock"
  | "Sparkles"
  | "Compass"
  | "Trophy"
  | "Scale"
  | "Calculator"
  | "HeartHandshake"
  | "ShieldCheck";

export interface ModuleConfigRecord {
  id: string;
  href: string;
  iconKey: ModuleIconKey;
  i18nTitleKey: string;
  customTitle: string; // Optional override managed from Backend CMS
  subtitleTemplate: string;
  badgeText: string;
  enabled: boolean;
  featured: boolean;
  showInBottomNav: boolean;
  order: number;
  minRole?: UserRole;
}

export interface ZakatCurrencyConfig {
  code: string;
  name: string;
  symbol: string;
  goldPerGram24K: number;
  silverPerGram: number;
  fitrahWheatPerKg: number;
  fitrahDatesPerKg: number;
  fitrahRaisinsPerKg: number;
  fitrahBarleyPerKg: number;
}

export interface ZakatBackendConfig {
  silverNisabGrams: number; // 612.36g (52.5 Tola)
  goldNisabGrams: number; // 87.48g (7.5 Tola)
  lunarRatePercent: number; // 2.5%
  solarRatePercent: number; // 2.577%
  fitrahWheatKg: number; // 1.92 kg (2 kg precaution)
  fitrahOtherKg: number; // 3.84 kg (1 Sa')
  currencies: ZakatCurrencyConfig[];
  updatedAt: string;
}

export interface SpiritualRankConfig {
  level: number;
  title: string;
  arabicTitle: string;
  minXp: number;
  badgeHex: string;
  perk: string;
}

export interface DailyQuestConfig {
  id: string;
  title: string;
  subtitle: string;
  xpReward: number;
  metric: "salah_count" | "tasbih_count" | "quran_verses" | "sunnah_count" | "barsi_fatiha" | "quiz_played";
  target: number;
  actionHref: string;
  enabled: boolean;
}

export interface GamificationConfig {
  ranks: SpiritualRankConfig[];
  dailyQuests: DailyQuestConfig[];
  xpRewards: {
    salahOnTime: number;
    salahJamaat: number;
    sunnahCheck: number;
    quranPage: number;
    tasbihMilestone: number;
    zakatLogged: number;
    barsiFatihaGift: number;
    curatorSubmission: number;
  };
}

export interface PlatformSettings {
  platformTitle: string;
  platformTagline: string;
  announcementEnabled: boolean;
  announcementBadge: string;
  announcementText: string;
  announcementHref: string;
  defaultTheme: ThemeId;
  defaultLang: LangCode;
  allowSelfRegistration: boolean;
  requireScholarVerificationForPublish: boolean;
  updatedAt: string;
}

export interface BackendAuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  actorRole: UserRole | "system";
  action: string;
  target: string;
  prevHash: string;
  hash: string;
}

export interface BackendDatabaseSnapshot {
  schemaVersion: number;
  users: UserAccount[];
  sessions: AuthSessionRecord[];
  auliyaRecords: ManagedAuliyaRecord[];
  ursEvents: UrsEventRecord[];
  barsiRecords: BarsiRecord[];
  modules: ModuleConfigRecord[];
  zakatConfig: ZakatBackendConfig;
  gamificationConfig: GamificationConfig;
  platformSettings: PlatformSettings;
  auditLogs: BackendAuditLog[];
}

export interface AuditChainReport {
  valid: boolean;
  checkedCount: number;
  brokenAtId?: string;
}

export interface PublicBackendView {
  currentUser: PublicUserAccount | null;
  users?: PublicUserAccount[]; // Included for super_admin / editor
  auliyaRecords: ManagedAuliyaRecord[];
  ursEvents: UrsEventRecord[];
  barsiRecords: BarsiRecord[];
  modules: ModuleConfigRecord[];
  zakatConfig: ZakatBackendConfig;
  gamificationConfig: GamificationConfig;
  platformSettings: PlatformSettings;
  auditLogs: BackendAuditLog[];
  backendMode: "supabase" | "server-api" | "local-engine";
}
