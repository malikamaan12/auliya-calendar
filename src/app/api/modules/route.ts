import { NextResponse } from "next/server";
import {
  BackendError,
  buildPublicView,
  opSaveGamificationConfig,
  opSaveModules,
  opSavePlatformSettings,
  opSaveZakatConfig,
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
      modules: view.modules,
      zakatConfig: view.zakatConfig,
      gamificationConfig: view.gamificationConfig,
      platformSettings: view.platformSettings,
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}

export async function PUT(req: Request) {
  try {
    const { db, actor } = await getRequestContext(req);
    const body = await req.json();
    const target = body?.target;

    if (target === "modules") {
      await opSaveModules(db, actor, body.modules);
    } else if (target === "zakat") {
      await opSaveZakatConfig(db, actor, body.zakatConfig);
    } else if (target === "gamification") {
      await opSaveGamificationConfig(db, actor, body.gamificationConfig);
    } else if (target === "settings") {
      await opSavePlatformSettings(db, actor, body.settings);
    } else {
      throw new BackendError("Unsupported configuration target.", 400);
    }

    await persistServerDatabase(db);
    return NextResponse.json({
      state: buildPublicView(db, actor, "server-api"),
    });
  } catch (err) {
    return toErrorResponse(err);
  }
}
