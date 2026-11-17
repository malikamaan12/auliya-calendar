import { NextResponse } from "next/server";
import {
  appendAuditLog,
  assertHasPermission,
  buildPublicView,
  createInitialBackendSnapshot,
  opDemoSwitchRole,
  opRestoreSnapshot,
  resolveSessionUser,
  verifyAuditChain,
} from "@/lib/backend-core";
import {
  getRequestContext,
  persistServerDatabase,
  toErrorResponse,
} from "@/lib/backend-server";

export async function GET(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const url = new URL(req.url);
    if (url.searchParams.get("export") === "1") {
      assertHasPermission(actor, "db:snapshot");
      return NextResponse.json({ snapshot: db });
    }
    if (url.searchParams.get("verifyAudit") === "1") {
      assertHasPermission(actor, "audit:view");
      const report = await verifyAuditChain(db.auditLogs);
      return NextResponse.json({ report });
    }
    return NextResponse.json(buildPublicView(db, actor, "server-api"));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PUT(req: Request) {
  try {
    const { actor } = await getRequestContext(req);
    const verified = assertHasPermission(actor, "db:snapshot");
    const body = await req.json();
    if (body?.action === "reset") {
      const fresh = await createInitialBackendSnapshot();
      await appendAuditLog(fresh, verified, "DATABASE_RESET_TO_DEFAULTS", "Super Admin reset");
      const { token } = await opDemoSwitchRole(fresh, "super_admin");
      await persistServerDatabase(fresh);
      const nextActor = resolveSessionUser(fresh, token);
      return NextResponse.json({
        token,
        state: buildPublicView(fresh, nextActor, "server-api"),
      });
    }
    if (body?.action === "restore") {
      const restored = await opRestoreSnapshot(verified, body.snapshot);
      await persistServerDatabase(restored);
      return NextResponse.json({
        state: buildPublicView(restored, verified, "server-api"),
      });
    }
    return NextResponse.json({ error: "Unsupported snapshot action" }, { status: 400 });
  } catch (err) {
    return toErrorResponse(err);
  }
}
