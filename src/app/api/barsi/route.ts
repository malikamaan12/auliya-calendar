import { NextResponse } from "next/server";
import {
  BackendError,
  buildPublicView,
  opDeleteBarsi,
  opLogBarsiGift,
  opToggleBarsiPara,
  opUpsertBarsi,
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
      count: view.barsiRecords.length,
      barsis: view.barsiRecords,
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function POST(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const body = await req.json();
    const action = body?.action || "upsert";

    if (action === "upsert") {
      await opUpsertBarsi(db, actor, body);
    } else if (action === "gift") {
      await opLogBarsiGift(db, actor, {
        barsiId: String(body.barsiId || ""),
        donorName: body.donorName,
        giftType: body.giftType,
        count: body.count,
      });
    } else if (action === "toggle-para") {
      await opToggleBarsiPara(db, actor, {
        barsiId: String(body.barsiId || ""),
        paraNumber: Number(body.paraNumber),
        readerName: body.readerName,
      });
    } else {
      throw new BackendError("Unsupported barsi action.", 400);
    }

    await persistServerDatabase(db);
    return NextResponse.json({
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
    await opDeleteBarsi(db, actor, id);
    await persistServerDatabase(db);
    return NextResponse.json({
      ok: true,
      state: buildPublicView(db, actor, "server-api"),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
