import { NextResponse } from "next/server";
import {
  buildPublicView,
  opDeleteUrs,
  opReviewSubmission,
  opUpsertUrs,
} from "@/lib/backend-core";
import {
  getRequestContext,
  persistServerDatabase,
  toErrorResponse,
} from "@/lib/backend-server";

export async function GET(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const view = buildPublicView(db, actor, "server-api");
    return NextResponse.json({
      count: view.ursEvents.length,
      events: view.ursEvents,
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const body = await req.json();
    const event = await opUpsertUrs(db, actor, body);
    await persistServerDatabase(db);
    return NextResponse.json({
      event,
      state: buildPublicView(db, actor, "server-api"),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PATCH(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const body = await req.json();
    const event = await opReviewSubmission(db, actor, {
      targetType: "urs",
      id: String(body.id || ""),
      decision: body.decision === "request_changes" ? "request_changes" : "approve",
      reviewNotes: body.reviewNotes ? String(body.reviewNotes) : undefined,
    });
    await persistServerDatabase(db);
    return NextResponse.json({
      event,
      state: buildPublicView(db, actor, "server-api"),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function DELETE(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const id = new URL(req.url).searchParams.get("id") || "";
    await opDeleteUrs(db, actor, id);
    await persistServerDatabase(db);
    return NextResponse.json({
      ok: true,
      state: buildPublicView(db, actor, "server-api"),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
