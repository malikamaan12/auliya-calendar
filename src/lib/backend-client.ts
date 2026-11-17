"use client";

import {
  appendAuditLog,
  BackendError,
  buildPublicView,
  createInitialBackendSnapshot,
  opAdminUpdateUser,
  opDeleteAuliya,
  opDeleteBarsi,
  opDeleteUrs,
  opDemoSwitchRole,
  opLogBarsiGift,
  opLoginUser,
  opLogoutSession,
  opRegisterUser,
  opSaveGamificationConfig,
  opSaveModules,
  opSavePlatformSettings,
  opSaveZakatConfig,
  opToggleBarsiPara,
  opUpdateUserProfile,
  opUpsertAuliya,
  opUpsertBarsi,
  opUpsertUrs,
  resolveSessionUser,
} from "./backend-core";
import {
  BackendDatabaseSnapshot,
  BarsiIsalGiftLog,
  BarsiRecord,
  GamificationConfig,
  hasPermission,
  ManagedAuliyaRecord,
  ModuleConfigRecord,
  PlatformSettings,
  PublicBackendView,
  UrsEventRecord,
  UserRole,
  ZakatBackendConfig,
} from "./backend-types";

const LOCAL_DB_KEY = "auliya_modular_backend_db_v2";
const SESSION_TOKEN_KEY = "auliya_auth_session_token_v1";

type TransportMode = "unknown" | "server-api" | "local-engine";
let detectedTransport: TransportMode = "unknown";
let cachedLocalDb: BackendDatabaseSnapshot | null = null;

export function getStoredSessionToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return localStorage.getItem(SESSION_TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setStoredSessionToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) localStorage.setItem(SESSION_TOKEN_KEY, token);
    else localStorage.removeItem(SESSION_TOKEN_KEY);
  } catch {
    // ignore storage errors
  }
}

async function getLocalDb(): Promise<BackendDatabaseSnapshot> {
  if (cachedLocalDb) return cachedLocalDb;
  if (typeof window !== "undefined") {
    try {
      const raw = localStorage.getItem(LOCAL_DB_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as BackendDatabaseSnapshot;
        if (parsed && parsed.schemaVersion >= 2 && Array.isArray(parsed.users)) {
          cachedLocalDb = parsed;
          return parsed;
        }
      }
    } catch {
      // fall through to seed
    }
  }
  const initial = await createInitialBackendSnapshot();
  cachedLocalDb = initial;
  saveLocalDb(initial);
  return initial;
}

function saveLocalDb(db: BackendDatabaseSnapshot): void {
  cachedLocalDb = db;
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(LOCAL_DB_KEY, JSON.stringify(db));
  } catch {
    // ignore quota errors
  }
}

async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T | null> {
  if (detectedTransport === "local-engine") return null;

  const token = getStoredSessionToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const res = await fetch(endpoint, {
      ...options,
      headers,
      cache: "no-store",
    });

    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("application/json")) {
      // Static hosting (e.g. GitHub Pages 404 HTML) -> switch cleanly to local-engine
      detectedTransport = "local-engine";
      return null;
    }

    if (res.status === 404 && endpoint === "/api/backend/state") {
      detectedTransport = "local-engine";
      return null;
    }

    detectedTransport = "server-api";
    const json = await res.json();
    if (!res.ok) {
      throw new BackendError(json?.error || `Request failed (${res.status})`, res.status);
    }
    return json as T;
  } catch (err) {
    if (err instanceof BackendError) throw err;
    detectedTransport = "local-engine";
    return null;
  }
}

export const backendClient = {
  async fetchState(): Promise<PublicBackendView> {
    const remote = await apiRequest<PublicBackendView>("/api/backend/state");
    if (remote) return remote;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    return buildPublicView(db, actor, "local-engine");
  },

  async register(payload: {
    name: string;
    email: string;
    password: string;
    city?: string;
    requestedRole?: "member" | "creator";
  }): Promise<PublicBackendView> {
    const remote = await apiRequest<{ token: string; state: PublicBackendView }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "register", ...payload }),
    });
    if (remote) {
      setStoredSessionToken(remote.token);
      return remote.state;
    }

    const db = await getLocalDb();
    const { token } = await opRegisterUser(db, payload);
    saveLocalDb(db);
    setStoredSessionToken(token);
    const actor = resolveSessionUser(db, token);
    return buildPublicView(db, actor, "local-engine");
  },

  async login(payload: { email: string; password: string }): Promise<PublicBackendView> {
    const remote = await apiRequest<{ token: string; state: PublicBackendView }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "login", ...payload }),
    });
    if (remote) {
      setStoredSessionToken(remote.token);
      return remote.state;
    }

    const db = await getLocalDb();
    const { token } = await opLoginUser(db, payload);
    saveLocalDb(db);
    setStoredSessionToken(token);
    const actor = resolveSessionUser(db, token);
    return buildPublicView(db, actor, "local-engine");
  },

  async demoSwitchRole(role: UserRole): Promise<PublicBackendView> {
    const remote = await apiRequest<{ token: string; state: PublicBackendView }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "demo-switch", role }),
    });
    if (remote) {
      setStoredSessionToken(remote.token);
      return remote.state;
    }

    const db = await getLocalDb();
    const { token } = await opDemoSwitchRole(db, role);
    saveLocalDb(db);
    setStoredSessionToken(token);
    const actor = resolveSessionUser(db, token);
    return buildPublicView(db, actor, "local-engine");
  },

  async logout(): Promise<PublicBackendView> {
    const token = getStoredSessionToken();
    await apiRequest<{ ok: boolean }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "logout" }),
    }).catch(() => null);

    setStoredSessionToken(null);
    if (detectedTransport === "server-api") {
      return this.fetchState();
    }
    const db = await getLocalDb();
    await opLogoutSession(db, token);
    saveLocalDb(db);
    return buildPublicView(db, null, "local-engine");
  },

  async updateMyProfile(patch: {
    name?: string;
    title?: string;
    city?: string;
    xpDelta?: number;
  }): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/auth", {
      method: "POST",
      body: JSON.stringify({ action: "update-profile", ...patch }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    if (actor) {
      await opUpdateUserProfile(db, actor, patch);
      saveLocalDb(db);
    }
    return buildPublicView(db, actor, "local-engine");
  },

  async adminUpdateUser(payload: {
    targetUserId: string;
    role?: UserRole;
    status?: "active" | "suspended";
    title?: string;
  }): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/users", {
      method: "PATCH",
      body: JSON.stringify(payload),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opAdminUpdateUser(db, actor, payload);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async upsertAuliya(
    input: Partial<ManagedAuliyaRecord> & { name: string; urduName: string; city: string; country: string }
  ): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/auliya", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opUpsertAuliya(db, actor, input);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async deleteAuliya(id: string): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>(
      `/api/auliya?id=${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opDeleteAuliya(db, actor, id);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async upsertUrs(
    input: Partial<UrsEventRecord> & { title: string; month: number; day: number }
  ): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/urs", {
      method: "POST",
      body: JSON.stringify(input),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opUpsertUrs(db, actor, input);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async deleteUrs(id: string): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>(
      `/api/urs?id=${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opDeleteUrs(db, actor, id);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async upsertBarsi(
    input: Partial<BarsiRecord> & { personName: string; hijriMonth: number; hijriDay: number }
  ): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/barsi", {
      method: "POST",
      body: JSON.stringify({ action: "upsert", ...input }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opUpsertBarsi(db, actor, input);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async logBarsiGift(payload: {
    barsiId: string;
    donorName?: string;
    giftType: BarsiIsalGiftLog["giftType"];
    count?: number;
  }): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/barsi", {
      method: "POST",
      body: JSON.stringify({ action: "gift", ...payload }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opLogBarsiGift(db, actor, payload);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async toggleBarsiPara(payload: {
    barsiId: string;
    paraNumber: number;
    readerName?: string;
  }): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/barsi", {
      method: "POST",
      body: JSON.stringify({ action: "toggle-para", ...payload }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opToggleBarsiPara(db, actor, payload);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async deleteBarsi(id: string): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>(
      `/api/barsi?id=${encodeURIComponent(id)}`,
      { method: "DELETE" }
    );
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opDeleteBarsi(db, actor, id);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async saveModules(modules: ModuleConfigRecord[]): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/modules", {
      method: "PUT",
      body: JSON.stringify({ target: "modules", modules }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opSaveModules(db, actor, modules);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async saveZakatConfig(zakatConfig: ZakatBackendConfig): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/modules", {
      method: "PUT",
      body: JSON.stringify({ target: "zakat", zakatConfig }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opSaveZakatConfig(db, actor, zakatConfig);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async saveGamificationConfig(gamificationConfig: GamificationConfig): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/modules", {
      method: "PUT",
      body: JSON.stringify({ target: "gamification", gamificationConfig }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opSaveGamificationConfig(db, actor, gamificationConfig);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async savePlatformSettings(settings: Partial<PlatformSettings>): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/modules", {
      method: "PUT",
      body: JSON.stringify({ target: "settings", settings }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    await opSavePlatformSettings(db, actor, settings);
    saveLocalDb(db);
    return buildPublicView(db, actor, "local-engine");
  },

  async exportSnapshotJson(): Promise<string> {
    const remote = await apiRequest<{ snapshot: BackendDatabaseSnapshot }>(
      "/api/backend/state?export=1"
    );
    if (remote?.snapshot) {
      return JSON.stringify(remote.snapshot, null, 2);
    }
    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    if (!actor || !hasPermission(actor.role, "db:snapshot")) {
      throw new BackendError("Super Admin permission (db:snapshot) required.", 403);
    }
    return JSON.stringify(db, null, 2);
  },

  async resetDatabaseToDefaults(): Promise<PublicBackendView> {
    const remote = await apiRequest<{ state: PublicBackendView }>("/api/backend/state", {
      method: "PUT",
      body: JSON.stringify({ action: "reset" }),
    });
    if (remote) return remote.state;

    const db = await getLocalDb();
    const actor = resolveSessionUser(db, getStoredSessionToken());
    if (!actor || !hasPermission(actor.role, "db:snapshot")) {
      throw new BackendError("Super Admin permission (db:snapshot) required.", 403);
    }
    const fresh = await createInitialBackendSnapshot();
    await appendAuditLog(fresh, actor, "DATABASE_RESET_TO_DEFAULTS", "Super Admin reset");
    // Re-issue session for super_admin
    const { token } = await opDemoSwitchRole(fresh, "super_admin");
    setStoredSessionToken(token);
    saveLocalDb(fresh);
    const nextActor = resolveSessionUser(fresh, token);
    return buildPublicView(fresh, nextActor, "local-engine");
  },
};
