import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    status: "ok",
    platform: "Auliya Calendar & Sunni Companion",
    madhhab: "Hanafi (Mithlayn)",
    security: {
      asvsLevel: 2,
      contentIntegrity: "SHA-256",
      zakatEncryption: "AES-256-GCM",
    },
    timestamp: new Date().toISOString(),
  });
}
