import { NextResponse } from "next/server";
import { AULIYA_DATA } from "@/data/auliya";

export async function GET() {
  return NextResponse.json({
    count: AULIYA_DATA.length,
    profiles: AULIYA_DATA.filter((a) => a.status === "Published"),
  });
}
