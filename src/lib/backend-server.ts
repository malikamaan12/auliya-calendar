import { promises as fs } from "fs";
import path from "path";
import { NextResponse } from "next/server";
import {
  BackendError,
  createInitialBackendSnapshot,
  resolveSessionUser,
} from "./backend-core";
import { BackendDatabaseSnapshot, UserAccount } from "./backend-types";

const DB_DIR = process.env.BACKEND_DB_DIR || path.join(process.cwd(), ".data");
const DB_FILE = path.join(DB_DIR, "auliya-backend-db.json");

let memoryCache: BackendDatabaseSnapshot | null = null;
let writeLock: Promise<void> = Promise.resolve();

export async function loadServerDatabase(): Promise<BackendDatabaseSnapshot> {
  if (memoryCache) return memoryCache;
  try {
    const raw = await fs.readFile(DB_FILE, "utf8");
    const parsed = JSON.parse(raw) as BackendDatabaseSnapshot;
    if (parsed && parsed.schemaVersion >= 2 && Array.isArray(parsed.users)) {
      memoryCache = parsed;
      return parsed;
    }
  } catch {
    // Initialize fresh database on first boot
  }
  const initial = await createInitialBackendSnapshot();
  memoryCache = initial;
  await persistServerDatabase(initial);
  return initial;
}

export async function persistServerDatabase(db: BackendDatabaseSnapshot): Promise<void> {
  memoryCache = db;
  writeLock = writeLock.then(async () => {
    try {
      await fs.mkdir(DB_DIR, { recursive: true });
      const tmpFile = `${DB_FILE}.tmp.${process.pid}.${Date.now()}`;
      await fs.writeFile(tmpFile, JSON.stringify(db, null, 2), "utf8");
      await fs.rename(tmpFile, DB_FILE);
    } catch {
      // In read-only serverless fs environments, memoryCache still serves the instance
    }
  });
  await writeLock;
}

export function extractBearerToken(req: Request): string | null {
  const auth = req.headers.get("authorization") || req.headers.get("Authorization");
  if (!auth) return null;
  if (auth.toLowerCase().startsWith("bearer ")) {
    return auth.slice(7).trim() || null;
  }
  return auth.trim() || null;
}

export async function getRequestContext(req: Request): Promise<{
  db: BackendDatabaseSnapshot;
  token: string | null;
  actor: UserAccount | null;
}> {
  const db = await loadServerDatabase();
  const token = extractBearerToken(req);
  const actor = resolveSessionUser(db, token);
  return { db, token, actor };
}

export function toErrorResponse(err: unknown): NextResponse {
  if (err instanceof BackendError) {
    return NextResponse.json({ error: err.message }, { status: err.status });
  }
  const message = err instanceof Error ? err.message : "Unexpected backend error";
  return NextResponse.json({ error: message }, { status: 500 });
}
