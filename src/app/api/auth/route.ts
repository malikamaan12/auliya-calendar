import { NextResponse } from "next/server";
import {
  BackendError,
  buildPublicView,
  opDemoSwitchRole,
  opLoginUser,
  opLogoutSession,
  opRegisterUser,
  opUpdateUserProfile,
  resolveSessionUser,
} from "@/lib/backend-core";
import {
  getRequestContext,
  persistServerDatabase,
  toErrorResponse,
} from "@/lib/backend-server";

export async function GET(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    return NextResponse.json(buildPublicView(db, actor, "server-api"));
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const { db, token, actor } = await getRequestContext(req);
    const body = await req.json();
    const action = body?.action;

    if (action === "register") {
      const res = await opRegisterUser(db, {
        name: String(body.name || ""),
        email: String(body.email || ""),
        password: String(body.password || ""),
        city: body.city ? String(body.city) : undefined,
        requestedRole: body.requestedRole === "creator" ? "creator" : "member",
        guestProgress: body.guestProgress,
      });
      await persistServerDatabase(db);
      const nextActor = resolveSessionUser(db, res.token);
      return NextResponse.json({
        token: res.token,
        user: res.user,
        state: buildPublicView(db, nextActor, "server-api"),
      });
    }

    if (action === "login") {
      const res = await opLoginUser(db, {
        email: String(body.email || ""),
        password: String(body.password || ""),
      });
      await persistServerDatabase(db);
      const nextActor = resolveSessionUser(db, res.token);
      return NextResponse.json({
        token: res.token,
        user: res.user,
        state: buildPublicView(db, nextActor, "server-api"),
      });
    }

    if (action === "demo-switch") {
      const res = await opDemoSwitchRole(db, body.role);
      await persistServerDatabase(db);
      const nextActor = resolveSessionUser(db, res.token);
      return NextResponse.json({
        token: res.token,
        user: res.user,
        state: buildPublicView(db, nextActor, "server-api"),
      });
    }

    if (action === "logout") {
      await opLogoutSession(db, token);
      await persistServerDatabase(db);
      return NextResponse.json({ ok: true });
    }

    if (action === "update-profile") {
      if (!actor) throw new BackendError("Authentication required.", 401);
      await opUpdateUserProfile(db, actor, {
        name: body.name,
        title: body.title,
        city: body.city,
        xpDelta: body.xpDelta,
        progress: body.progress,
      });
      await persistServerDatabase(db);
      return NextResponse.json({
        state: buildPublicView(db, actor, "server-api"),
      });
    }

    throw new BackendError("Unknown auth action.", 400);
  } catch (err) {
    return toErrorResponse(err);
  }
}
