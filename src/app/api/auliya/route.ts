import { NextResponse } from "next/server";
import {
  buildPublicView,
  opDeleteAuliya,
  opReviewSubmission,
  opUpsertAuliya,
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
      count: view.auliyaRecords.length,
      profiles: view.auliyaRecords,
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const body = await req.json();
    const record = await opUpsertAuliya(db, actor, body);
    await persistServerDatabase(db);
    return NextResponse.json({
      record,
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
    const record = await opReviewSubmission(db, actor, {
      targetType: "auliya",
      id: String(body.id || ""),
      decision: body.decision === "request_changes" ? "request_changes" : "approve",
      reviewNotes: body.reviewNotes ? String(body.reviewNotes) : undefined,
    });
    await persistServerDatabase(db);
    return NextResponse.json({
      record,
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
    await opDeleteAuliya(db, actor, id);
    await persistServerDatabase(db);
    return NextResponse.json({
      ok: true,
      state: buildPublicView(db, actor, "server-api"),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
