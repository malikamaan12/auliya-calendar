import { NextResponse } from "next/server";
import {
  assertHasPermission,
  buildPublicView,
  opAdminUpdateUser,
  stripSecretFields,
} from "@/lib/backend-core";
import {
  getRequestContext,
  persistServerDatabase,
  toErrorResponse,
} from "@/lib/backend-server";

export async function GET(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    assertHasPermission(actor, "users:manage");
    return NextResponse.json({
      count: db.users.length,
      users: db.users.map(stripSecretFields),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const body = await req.json();
    const updated = await opAdminUpdateUser(db, actor, {
      targetUserId: String(body.targetUserId || ""),
      role: body.role,
      status: body.status,
      title: body.title,
    });
    await persistServerDatabase(db);
    return NextResponse.json({
      user: updated,
      state: buildPublicView(db, actor, "server-api"),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
