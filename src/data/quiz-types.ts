export type QuizCategory =
  | "Aqaid & Seerah"
  | "Quran & Kanzul Iman"
  | "Lives of the Auliya"
  | "Hanafi Fiqh";

export interface QuizQuestion {
  id: string;
  tier: number; // 1..15
  category: QuizCategory;
  question: string;
  options: [string, string, string, string];
  correctIdx: 0 | 1 | 2 | 3;
  isharaHint: string;
  communityPoll: [number, number, number, number];
  proofExplanation: string;
  proofLink: string;
  proofLinkLabel: string;
}

export interface FastestFingerChallenge {
  id: string;
  prompt: string;
  items: [string, string, string, string];
  correctOrder: [number, number, number, number];
  explanation: string;
}
