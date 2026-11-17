"use client";

import {
  BackendError,
  createInitialBackendSnapshot,
  sha256Hex,
} from "./backend-core";
import {
  BackendAuditLog,
  BackendDatabaseSnapshot,
  BarsiIsalGiftLog,
  BarsiRecord,
  GamificationConfig,
  ManagedAuliyaRecord,
  ModuleConfigRecord,
  PlatformSettings,
  PublicBackendView,
  PublicUserAccount,
  UrsEventRecord,
  UserProgressSnapshot,
  UserRole,
  ZakatBackendConfig,
} from "./backend-types";

export interface SupabaseRuntimeConfig {
  url: string;
  anonKey: string;
}

interface SupabaseAuthSession {
  access_token: string;
  refresh_token: string;
  expires_at: number; // unix seconds
  user: { id: string; email?: string };
}

const RUNTIME_CFG_KEY = "auliya_supabase_runtime_cfg_v1";
const SUPABASE_SESS_KEY = "auliya_supabase_session_v1";

export function getSupabaseConfig(): SupabaseRuntimeConfig | null {
  const envUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const envKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim();
  if (envUrl && envKey) {
    return { url: envUrl.replace(/\/$/, ""), anonKey: envKey };
  }
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(RUNTIME_CFG_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as Partial<SupabaseRuntimeConfig>;
    if (parsed.url && parsed.anonKey) {
      return {
        url: parsed.url.trim().replace(/\/$/, ""),
        anonKey: parsed.anonKey.trim(),
      };
    }
  } catch {
    // ignore storage errors
  }
  return null;
}

export function setSupabaseRuntimeConfig(cfg: SupabaseRuntimeConfig | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!cfg || !cfg.url.trim() || !cfg.anonKey.trim()) {
      localStorage.removeItem(RUNTIME_CFG_KEY);
      localStorage.removeItem(SUPABASE_SESS_KEY);
    } else {
      localStorage.setItem(
        RUNTIME_CFG_KEY,
        JSON.stringify({ url: cfg.url.trim().replace(/\/$/, ""), anonKey: cfg.anonKey.trim() })
      );
    }
  } catch {
    // ignore
  }
}

export function isSupabaseConfigured(): boolean {
  return getSupabaseConfig() !== null;
}

function getStoredSession(): SupabaseAuthSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SUPABASE_SESS_KEY);
    if (!raw) return null;
    return JSON.parse(raw) as SupabaseAuthSession;
  } catch {
    return null;
  }
}

function setStoredSession(sess: SupabaseAuthSession | null): void {
  if (typeof window === "undefined") return;
  try {
    if (!sess) localStorage.removeItem(SUPABASE_SESS_KEY);
    else localStorage.setItem(SUPABASE_SESS_KEY, JSON.stringify(sess));
  } catch {
    // ignore
  }
}

async function ensureFreshAccessToken(cfg: SupabaseRuntimeConfig): Promise<SupabaseAuthSession | null> {
  const sess = getStoredSession();
  if (!sess) return null;
  const nowSec = Math.floor(Date.now() / 1000);
  if (sess.expires_at && sess.expires_at - 60 > nowSec) {
    return sess;
  }
  if (!sess.refresh_token) return null;
  try {
    const res = await fetch(`${cfg.url}/auth/v1/token?grant_type=refresh_token`, {
      method: "POST",
      headers: {
        apikey: cfg.anonKey,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ refresh_token: sess.refresh_token }),
    });
    if (!res.ok) {
      setStoredSession(null);
      return null;
    }
    const data = await res.json();
    const next: SupabaseAuthSession = {
      access_token: data.access_token,
      refresh_token: data.refresh_token || sess.refresh_token,
      expires_at: data.expires_at || nowSec + Number(data.expires_in || 3600),
      user: data.user || sess.user,
    };
    setStoredSession(next);
    return next;
  } catch {
    return null;
  }
}

async function sbFetch<T>(
  path: string,
  options: RequestInit = {},
  requireAuthToken?: string | null
): Promise<T> {
  const cfg = getSupabaseConfig();
  if (!cfg) throw new BackendError("Supabase is not configured.", 400);

  const sess = requireAuthToken ? null : await ensureFreshAccessToken(cfg);
  const bearer = requireAuthToken || sess?.access_token || cfg.anonKey;

  const res = await fetch(`${cfg.url}${path}`, {
    ...options,
    headers: {
      apikey: cfg.anonKey,
      Authorization: `Bearer ${bearer}`,
      "Content-Type": "application/json",
      ...(options.headers as Record<string, string> | undefined),
    },
    cache: "no-store",
  });

  if (res.status === 204) return undefined as T;
  const text = await res.text();
  let json: Record<string, unknown> | unknown[] | null = null;
  try {
    json = text ? JSON.parse(text) : null;
  } catch {
    json = null;
  }

  if (!res.ok) {
    const msg =
      (json && !Array.isArray(json) && (json.error_description || json.message || json.msg || json.error)) ||
      `Supabase error (${res.status})`;
    throw new BackendError(String(msg), res.status);
  }
  return json as T;
}

interface SbProfileRow {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  title: string;
  city: string;
  avatar_color: string;
  status: "active" | "suspended";
  xp: number;
  progress_jsonb?: UserProgressSnapshot;
  created_at: string;
  last_login_at: string;
}

function mapProfileRow(r: SbProfileRow): PublicUserAccount {
  return {
    id: r.id,
    name: r.name,
    email: r.email,
    role: r.role,
    title: r.title,
    city: r.city,
    avatarColor: r.avatar_color || "#A855F7",
    status: r.status || "active",
    xp: r.xp ?? 100,
    progress: r.progress_jsonb,
    createdAt: r.created_at,
    lastLoginAt: r.last_login_at,
  };
}

interface SbAuliyaRow {
  id: string;
  slug: string;
  data_jsonb: ManagedAuliyaRecord;
  status: ManagedAuliyaRecord["status"];
  review_notes?: string;
  created_by_user_id: string;
  created_by_name: string;
  verified_by_name?: string;
  updated_at: string;
}

interface SbUrsRow {
  id: string;
  month: number;
  day: number;
  duration_days?: number;
  title: string;
  urdu_title: string;
  subtitle: string;
  city: string;
  country: string;
  silsila?: string;
  auliya_id?: string;
  type: "urs" | "sacred" | "fasting";
  recommended_wird: string;
  featured: boolean;
  status: UrsEventRecord["status"];
  review_notes?: string;
  created_by_user_id: string;
  created_by_name: string;
  updated_at: string;
}

interface SbBarsiRow {
  id: string;
  owner_user_id: string;
  owner_name: string;
  person_name: string;
  urdu_name: string;
  relation: string;
  hijri_month: number;
  hijri_day: number;
  hijri_year?: number;
  gregorian_death_date?: string;
  resting_place_city: string;
  qabrastan_name: string;
  memory_note: string;
  favorite_wird: string;
  visibility: "private" | "community";
  khatm_paras: Record<string, string>;
  total_fatiha_count: number;
  total_durood_count: number;
  total_yasin_count: number;
  gift_logs: BarsiIsalGiftLog[];
  created_at: string;
  updated_at: string;
}

async function appendSupabaseAudit(
  actor: PublicUserAccount | null,
  action: string,
  target: string
): Promise<void> {
  if (!actor) return;
  try {
    const existing = await sbFetch<BackendAuditLog[]>(
      "/rest/v1/audit_logs?select=*&order=timestamp.desc&limit=1"
    );
    const prevHash = existing[0]?.hash || "0".repeat(64);
    const timestamp = new Date().toISOString();
    const hash = await sha256Hex(`${prevHash}|${timestamp}|${actor.id}|${action}|${target}`);
    await sbFetch("/rest/v1/audit_logs", {
      method: "POST",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        id: `aud_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`,
        timestamp,
        actor_id: actor.id,
        actor_name: actor.name,
        actor_role: actor.role,
        action,
        target,
        prev_hash: prevHash,
        hash,
      }),
    });
  } catch {
    // non-fatal if RLS or network blocks audit insert
  }
}

export const supabaseBackend = {
  async fetchState(): Promise<PublicBackendView> {
    const cfg = getSupabaseConfig();
    if (!cfg) throw new BackendError("Supabase not configured", 400);

    const seed: BackendDatabaseSnapshot = await createInitialBackendSnapshot();
    const sess = await ensureFreshAccessToken(cfg);

    let currentUser: PublicUserAccount | null = null;
    let usersList: PublicUserAccount[] | undefined = undefined;

    if (sess?.user?.id) {
      const profiles = await sbFetch<SbProfileRow[]>(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(sess.user.id)}&select=*`
      ).catch(() => []);
      if (profiles[0]) {
        currentUser = mapProfileRow(profiles[0]);
        if (currentUser.role === "super_admin" || currentUser.role === "editor") {
          const allProfiles = await sbFetch<SbProfileRow[]>(
            "/rest/v1/profiles?select=*&order=created_at.desc"
          ).catch(() => []);
          if (allProfiles.length) usersList = allProfiles.map(mapProfileRow);
        }
      }
    }

    const [auliyaRows, ursRows, barsiRows, configRows, auditRows] = await Promise.all([
      sbFetch<SbAuliyaRow[]>("/rest/v1/auliya_records?select=*&order=updated_at.desc").catch(() => []),
      sbFetch<SbUrsRow[]>("/rest/v1/urs_events?select=*&order=month.asc,day.asc").catch(() => []),
      sbFetch<SbBarsiRow[]>("/rest/v1/barsi_records?select=*&order=updated_at.desc").catch(() => []),
      sbFetch<{ key: string; value_jsonb: unknown }[]>("/rest/v1/platform_config?select=*").catch(() => []),
      currentUser && ["super_admin", "editor", "creator"].includes(currentUser.role)
        ? sbFetch<BackendAuditLog[]>(
            "/rest/v1/audit_logs?select=*&order=timestamp.desc&limit=60"
          ).catch(() => [])
        : Promise.resolve([]),
    ]);

    const cfgMap = new Map(configRows.map((c) => [c.key, c.value_jsonb]));
    const modules = (cfgMap.get("modules") as ModuleConfigRecord[] | undefined) || seed.modules;
    const zakatConfig = (cfgMap.get("zakat") as ZakatBackendConfig | undefined) || seed.zakatConfig;
    const gamificationConfig =
      (cfgMap.get("gamification") as GamificationConfig | undefined) || seed.gamificationConfig;
    const platformSettings =
      (cfgMap.get("settings") as PlatformSettings | undefined) || seed.platformSettings;

    const auliyaRecords: ManagedAuliyaRecord[] = auliyaRows.length
      ? auliyaRows.map((r) => ({
          ...r.data_jsonb,
          id: r.id,
          slug: r.slug,
          status: r.status,
          reviewNotes: r.review_notes ?? r.data_jsonb.reviewNotes,
          createdByUserId: r.created_by_user_id,
          createdByName: r.created_by_name,
          verifiedByName: r.verified_by_name,
          updatedAt: r.updated_at,
        }))
      : seed.auliyaRecords;

    const ursEvents: UrsEventRecord[] = ursRows.length
      ? ursRows.map((r) => ({
          id: r.id,
          month: r.month,
          day: r.day,
          durationDays: r.duration_days,
          title: r.title,
          urduTitle: r.urdu_title,
          subtitle: r.subtitle,
          city: r.city,
          country: r.country,
          silsila: r.silsila,
          auliyaId: r.auliya_id,
          type: r.type,
          recommendedWird: r.recommended_wird,
          featured: r.featured,
          status: r.status,
          reviewNotes: r.review_notes,
          createdByUserId: r.created_by_user_id,
          createdByName: r.created_by_name,
          updatedAt: r.updated_at,
        }))
      : seed.ursEvents;

    const barsiRecords: BarsiRecord[] = barsiRows.length
      ? barsiRows.map((r) => ({
          id: r.id,
          ownerUserId: r.owner_user_id,
          ownerName: r.owner_name,
          personName: r.person_name,
          urduName: r.urdu_name,
          relation: r.relation,
          hijriMonth: r.hijri_month,
          hijriDay: r.hijri_day,
          hijriYear: r.hijri_year,
          gregorianDeathDate: r.gregorian_death_date,
          restingPlaceCity: r.resting_place_city,
          qabrastanName: r.qabrastan_name,
          memoryNote: r.memory_note,
          favoriteWird: r.favorite_wird,
          visibility: r.visibility,
          khatmParas: r.khatm_paras || {},
          totalFatihaCount: r.total_fatiha_count ?? 0,
          totalDuroodCount: r.total_durood_count ?? 0,
          totalYasinCount: r.total_yasin_count ?? 0,
          giftLogs: r.gift_logs || [],
          createdAt: r.created_at,
          updatedAt: r.updated_at,
        }))
      : seed.barsiRecords;

    return {
      currentUser,
      users: usersList,
      auliyaRecords,
      ursEvents,
      barsiRecords,
      modules: [...modules].sort((a, b) => a.order - b.order),
      zakatConfig,
      gamificationConfig,
      platformSettings,
      auditLogs: auditRows,
      backendMode: "supabase",
    };
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    city?: string;
    requestedRole?: "member" | "creator";
    guestProgress?: UserProgressSnapshot;
  }): Promise<PublicBackendView> {
    const data = await sbFetch<{
      access_token?: string;
      refresh_token?: string;
      expires_in?: number;
      user?: { id: string; email?: string };
      session?: SupabaseAuthSession;
    }>("/auth/v1/signup", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
        data: {
          name: payload.name.trim(),
          city: payload.city?.trim() || "Global",
          requested_role: payload.requestedRole === "creator" ? "creator" : "member",
        },
      }),
    });

    const token = data.access_token || data.session?.access_token;
    const refresh = data.refresh_token || data.session?.refresh_token || "";
    if (!token || !data.user?.id) {
      throw new BackendError(
        "Check your email to confirm your account, then sign in.",
        202
      );
    }

    setStoredSession({
      access_token: token,
      refresh_token: refresh,
      expires_at: Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600),
      user: data.user,
    });

    if (payload.guestProgress) {
      await sbFetch(
        `/rest/v1/profiles?id=eq.${encodeURIComponent(data.user.id)}`,
        {
          method: "PATCH",
          headers: { Prefer: "return=minimal" },
          body: JSON.stringify({ progress_jsonb: payload.guestProgress }),
        },
        token
      ).catch(() => null);
    }

    return this.fetchState();
  },

  async login(payload: { email: string; password: string }): Promise<PublicBackendView> {
    const data = await sbFetch<{
      access_token: string;
      refresh_token: string;
      expires_in?: number;
      expires_at?: number;
      user: { id: string; email?: string };
    }>("/auth/v1/token?grant_type=password", {
      method: "POST",
      body: JSON.stringify({
        email: payload.email.trim().toLowerCase(),
        password: payload.password,
      }),
    });

    setStoredSession({
      access_token: data.access_token,
      refresh_token: data.refresh_token,
      expires_at: data.expires_at || Math.floor(Date.now() / 1000) + Number(data.expires_in || 3600),
      user: data.user,
    });

    return this.fetchState();
  },

  async logout(): Promise<PublicBackendView> {
    const sess = getStoredSession();
    if (sess?.access_token) {
      await sbFetch("/auth/v1/logout", { method: "POST" }, sess.access_token).catch(() => null);
    }
    setStoredSession(null);
    return this.fetchState();
  },

  async updateMyProfile(patch: {
    name?: string;
    title?: string;
    city?: string;
    xpDelta?: number;
    progress?: UserProgressSnapshot;
  }): Promise<PublicBackendView> {
    const state = await this.fetchState();
    const actor = state.currentUser;
    if (!actor) throw new BackendError("Authentication required.", 401);

    const body: Record<string, unknown> = { last_login_at: new Date().toISOString() };
    if (patch.name && patch.name.trim().length >= 2) body.name = patch.name.trim();
    if (patch.title !== undefined) body.title = patch.title.trim().slice(0, 60);
    if (patch.city !== undefined) body.city = patch.city.trim().slice(0, 50);
    if (typeof patch.xpDelta === "number" && Number.isFinite(patch.xpDelta)) {
      body.xp = Math.max(0, actor.xp + Math.round(patch.xpDelta));
    }
    if (patch.progress) {
      body.progress_jsonb = { ...(actor.progress || {}), ...patch.progress, updatedAt: new Date().toISOString() };
    }

    await sbFetch(`/rest/v1/profiles?id=eq.${encodeURIComponent(actor.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(body),
    });

    return this.fetchState();
  },

  async adminUpdateUser(payload: {
    targetUserId: string;
    role?: UserRole;
    status?: "active" | "suspended";
    title?: string;
  }): Promise<PublicBackendView> {
    const state = await this.fetchState();
    const body: Record<string, unknown> = {};
    if (payload.role) body.role = payload.role;
    if (payload.status) body.status = payload.status;
    if (payload.title !== undefined) body.title = payload.title.trim();

    await sbFetch(`/rest/v1/profiles?id=eq.${encodeURIComponent(payload.targetUserId)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify(body),
    });
    await appendSupabaseAudit(state.currentUser, "RBAC_USER_UPDATED", payload.targetUserId);
    return this.fetchState();
  },

  async upsertAuliya(
    input: Partial<ManagedAuliyaRecord> & { name: string; urduName: string; city: string; country: string }
  ): Promise<PublicBackendView> {
    const state = await this.fetchState();
    const actor = state.currentUser;
    if (!actor) throw new BackendError("Sign in to submit or edit Auliya profiles.", 401);

    const slug = (input.id || input.slug || input.name)
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-|-$/g, "");
    const existing = state.auliyaRecords.find((a) => a.id === slug);
    let nextStatus = input.status || existing?.status || "Draft";
    if (nextStatus === "Published" && actor.role === "creator") {
      nextStatus = "Scholarly Verification";
    }
    const nowIso = new Date().toISOString();
    const fullRecord: ManagedAuliyaRecord = {
      ...(existing || {}),
      ...(input as ManagedAuliyaRecord),
      id: slug,
      slug,
      status: nextStatus,
      createdByUserId: existing?.createdByUserId || actor.id,
      createdByName: existing?.createdByName || actor.name,
      verifiedByName: nextStatus === "Published" ? actor.name : existing?.verifiedByName,
      updatedAt: nowIso,
    };

    await sbFetch("/rest/v1/auliya_records", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        id: slug,
        slug,
        data_jsonb: fullRecord,
        status: nextStatus,
        review_notes: fullRecord.reviewNotes || null,
        created_by_user_id: fullRecord.createdByUserId,
        created_by_name: fullRecord.createdByName,
        verified_by_name: fullRecord.verifiedByName || null,
        updated_at: nowIso,
      }),
    });

    await appendSupabaseAudit(actor, existing ? "AULIYA_UPDATED" : "AULIYA_CREATED", fullRecord.name);
    return this.fetchState();
  },

  async deleteAuliya(id: string): Promise<PublicBackendView> {
    const state = await this.fetchState();
    await sbFetch(`/rest/v1/auliya_records?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    await appendSupabaseAudit(state.currentUser, "AULIYA_DELETED", id);
    return this.fetchState();
  },

  async upsertUrs(
    input: Partial<UrsEventRecord> & { title: string; month: number; day: number }
  ): Promise<PublicBackendView> {
    const state = await this.fetchState();
    const actor = state.currentUser;
    if (!actor) throw new BackendError("Sign in to submit or edit Urs events.", 401);

    const id =
      input.id ||
      `urs_${input.title.toLowerCase().replace(/[^a-z0-9]+/g, "_").slice(0, 32)}_${Date.now().toString(36).slice(-4)}`;
    let nextStatus = input.status || "Scholarly Verification";
    if (nextStatus === "Published" && actor.role === "creator") {
      nextStatus = "Scholarly Verification";
    }
    const nowIso = new Date().toISOString();

    await sbFetch("/rest/v1/urs_events", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        id,
        month: Number(input.month),
        day: Number(input.day),
        duration_days: input.durationDays ?? 1,
        title: input.title.trim(),
        urdu_title: input.urduTitle || input.title.trim(),
        subtitle: input.subtitle || "",
        city: input.city || "Global",
        country: input.country || "Ummah",
        silsila: input.silsila || null,
        auliya_id: input.auliyaId || null,
        type: input.type || "urs",
        recommended_wird: input.recommendedWird || "Surah Al-Fatihah & Durood-e-Pak",
        featured: Boolean(input.featured),
        status: nextStatus,
        created_by_user_id: actor.id,
        created_by_name: actor.name,
        updated_at: nowIso,
      }),
    });

    await appendSupabaseAudit(actor, "URS_EVENT_UPSERTED", input.title);
    return this.fetchState();
  },

  async deleteUrs(id: string): Promise<PublicBackendView> {
    const state = await this.fetchState();
    await sbFetch(`/rest/v1/urs_events?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    await appendSupabaseAudit(state.currentUser, "URS_EVENT_DELETED", id);
    return this.fetchState();
  },

  async reviewSubmission(payload: {
    targetType: "auliya" | "urs";
    id: string;
    decision: "approve" | "request_changes";
    reviewNotes?: string;
  }): Promise<PublicBackendView> {
    const state = await this.fetchState();
    const actor = state.currentUser;
    if (!actor || !["super_admin", "editor"].includes(actor.role)) {
      throw new BackendError("Scholar Editor or Super Admin role required.", 403);
    }
    const nextStatus = payload.decision === "approve" ? "Published" : "Draft";
    const nowIso = new Date().toISOString();
    if (payload.targetType === "auliya") {
      await sbFetch(`/rest/v1/auliya_records?id=eq.${encodeURIComponent(payload.id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          status: nextStatus,
          review_notes: payload.reviewNotes || null,
          verified_by_name: payload.decision === "approve" ? actor.name : null,
          updated_at: nowIso,
        }),
      });
    } else {
      await sbFetch(`/rest/v1/urs_events?id=eq.${encodeURIComponent(payload.id)}`, {
        method: "PATCH",
        headers: { Prefer: "return=minimal" },
        body: JSON.stringify({
          status: nextStatus,
          review_notes: payload.reviewNotes || null,
          updated_at: nowIso,
        }),
      });
    }
    await appendSupabaseAudit(
      actor,
      payload.decision === "approve" ? "SCHOLAR_APPROVED" : "SCHOLAR_CHANGES_REQUESTED",
      `${payload.targetType}:${payload.id}`
    );
    return this.fetchState();
  },

  async upsertBarsi(
    input: Partial<BarsiRecord> & { personName: string; hijriMonth: number; hijriDay: number }
  ): Promise<PublicBackendView> {
    const state = await this.fetchState();
    const actor = state.currentUser;
    if (!actor) throw new BackendError("Sign in to save Barsi memorials to the cloud.", 401);
    const id = input.id || `barsi_${Date.now().toString(36)}`;
    const nowIso = new Date().toISOString();
    await sbFetch("/rest/v1/barsi_records", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({
        id,
        owner_user_id: actor.id,
        owner_name: actor.name,
        person_name: input.personName.trim(),
        urdu_name: input.urduName || input.personName.trim(),
        relation: input.relation || "Beloved Marhum / Marhuma",
        hijri_month: Number(input.hijriMonth),
        hijri_day: Number(input.hijriDay),
        resting_place_city: input.restingPlaceCity || "",
        qabrastan_name: input.qabrastanName || "",
        memory_note: input.memoryNote || "",
        favorite_wird: input.favoriteWird || "Surah Yasin & Durood-e-Pak",
        visibility: input.visibility === "community" ? "community" : "private",
        updated_at: nowIso,
      }),
    });
    return this.fetchState();
  },

  async logBarsiGift(payload: {
    barsiId: string;
    donorName?: string;
    giftType: BarsiIsalGiftLog["giftType"];
    count?: number;
  }): Promise<PublicBackendView> {
    const state = await this.fetchState();
    const rec = state.barsiRecords.find((b) => b.id === payload.barsiId);
    if (!rec) throw new BackendError("Barsi record not found.", 404);
    const count = Math.max(1, Number(payload.count ?? 1));
    const log: BarsiIsalGiftLog = {
      id: `gift_${Date.now().toString(36)}`,
      donorName: payload.donorName?.trim() || state.currentUser?.name || "Believer",
      giftType: payload.giftType,
      count,
      createdAt: new Date().toISOString(),
    };
    await sbFetch(`/rest/v1/barsi_records?id=eq.${encodeURIComponent(rec.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({
        total_durood_count:
          payload.giftType === "Durood-e-Pak (100x)" ? rec.totalDuroodCount + count : rec.totalDuroodCount,
        total_yasin_count:
          payload.giftType === "Surah Yasin" ? rec.totalYasinCount + count : rec.totalYasinCount,
        total_fatiha_count:
          payload.giftType !== "Durood-e-Pak (100x)" && payload.giftType !== "Surah Yasin"
            ? rec.totalFatihaCount + count
            : rec.totalFatihaCount,
        gift_logs: [log, ...rec.giftLogs].slice(0, 40),
        updated_at: log.createdAt,
      }),
    });
    return this.fetchState();
  },

  async toggleBarsiPara(payload: {
    barsiId: string;
    paraNumber: number;
    readerName?: string;
  }): Promise<PublicBackendView> {
    const state = await this.fetchState();
    const rec = state.barsiRecords.find((b) => b.id === payload.barsiId);
    if (!rec) throw new BackendError("Barsi record not found.", 404);
    const p = String(Math.max(1, Math.min(30, Math.round(payload.paraNumber))));
    const nextParas = { ...rec.khatmParas };
    if (nextParas[p]) delete nextParas[p];
    else nextParas[p] = payload.readerName?.trim() || state.currentUser?.name || "Completed";
    await sbFetch(`/rest/v1/barsi_records?id=eq.${encodeURIComponent(rec.id)}`, {
      method: "PATCH",
      headers: { Prefer: "return=minimal" },
      body: JSON.stringify({ khatm_paras: nextParas, updated_at: new Date().toISOString() }),
    });
    return this.fetchState();
  },

  async deleteBarsi(id: string): Promise<PublicBackendView> {
    await sbFetch(`/rest/v1/barsi_records?id=eq.${encodeURIComponent(id)}`, { method: "DELETE" });
    return this.fetchState();
  },

  async saveConfigKey(key: "modules" | "zakat" | "gamification" | "settings", value: unknown): Promise<PublicBackendView> {
    await sbFetch("/rest/v1/platform_config", {
      method: "POST",
      headers: { Prefer: "resolution=merge-duplicates,return=minimal" },
      body: JSON.stringify({ key, value_jsonb: value, updated_at: new Date().toISOString() }),
    });
    return this.fetchState();
  },
};

export async function testSupabaseConnection(url: string, anonKey: string): Promise<{ ok: boolean; message: string }> {
  try {
    const cleanUrl = url.trim().replace(/\/$/, "");
    const res = await fetch(`${cleanUrl}/rest/v1/platform_config?select=key&limit=1`, {
      headers: {
        apikey: anonKey.trim(),
        Authorization: `Bearer ${anonKey.trim()}`,
      },
      cache: "no-store",
    });
    if (res.ok) {
      return { ok: true, message: "Connected to Supabase PostgreSQL & RLS." };
    }
    const text = await res.text();
    return { ok: false, message: `HTTP ${res.status}: ${text.slice(0, 120)}` };
  } catch (err) {
    return {
      ok: false,
      message: err instanceof Error ? err.message : "Could not reach Supabase URL.",
    };
  }
}

export async function pingSupabaseWithAuditCheck(logs: BackendAuditLog[]) {
  return logs.length;
}
