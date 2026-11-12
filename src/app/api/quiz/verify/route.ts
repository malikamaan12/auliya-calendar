import { NextResponse } from "next/server";
import { z } from "zod";
import { QUIZ_BANK, TIER_REWARDS } from "@/data/quiz";

const VerifySchema = z.object({
  questionId: z.string().min(1),
  selectedIdx: z.number().int().min(0).max(3),
  tierIdx: z.number().int().min(0).max(14),
});

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = VerifySchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid quiz payload" }, { status: 400 });
    }
    const q = QUIZ_BANK.find((item) => item.id === parsed.data.questionId);
    if (!q) {
      return NextResponse.json({ error: "Question not found" }, { status: 404 });
    }
    const correct = q.correctIdx === parsed.data.selectedIdx;
    return NextResponse.json({
      correct,
      correctIdx: q.correctIdx,
      xpAwarded: correct ? TIER_REWARDS[parsed.data.tierIdx] : 0,
      proofExplanation: q.proofExplanation,
      proofLink: q.proofLink,
    });
  } catch {
    return NextResponse.json({ error: "Malformed JSON" }, { status: 400 });
  }
}
