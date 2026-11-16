import {
  FastestFingerChallenge,
  QuizCategory,
  QuizQuestion,
} from "./quiz-types";
import { TIERS_1_TO_5 } from "./quiz-bank/tiers-1-5";
import { TIERS_6_TO_10 } from "./quiz-bank/tiers-6-10";
import { TIERS_11_TO_15 } from "./quiz-bank/tiers-11-15";
import { FASTEST_FINGER_BANK } from "./quiz-bank/fastest-finger";

export type { QuizQuestion, QuizCategory, FastestFingerChallenge };
export { FASTEST_FINGER_BANK };

export const QUIZ_CATEGORIES: QuizCategory[] = [
  "Aqaid & Seerah",
  "Quran & Kanzul Iman",
  "Lives of the Auliya",
  "Hanafi Fiqh",
];

export const TIER_REWARDS = [
  100, 200, 300, 500, 1000, // Safe Padav 1 (Tier 5)
  2000, 4000, 8000, 16000, 32000, // Safe Padav 2 (Tier 10)
  64000, 125000, 250000, 500000, 1000000, // Grand Crown (Tier 15)
];

export const TIER_TITLES = [
  "Mubtadi (Seeker)",
  "Murid (Disciple)",
  "Qari (Reciter)",
  "Zakir (Rememberer)",
  "★ Padav I: Muhafiz-e-Sunnat",
  "Talib-e-Fiqh",
  "Ahl-e-Fahm",
  "Alim-e-Masa'il",
  "Arif-e-Tasawwuf",
  "★ Padav II: Faqih-e-Asr",
  "Muhaddith-e-Sagir",
  "Mufassir-e-Bayan",
  "Mujtahid-fil-Madhhab",
  "Bahr-ul-Uloom",
  "👑 Taj-e-Sahib-e-Ilm",
];

export const SAFE_TIERS = [4, 9, 14]; // 0-indexed: Tiers 5, 10, 15

export const QUIZ_BANK: QuizQuestion[] = [
  ...TIERS_1_TO_5,
  ...TIERS_6_TO_10,
  ...TIERS_11_TO_15,
];

function fisherYates<T>(arr: readonly T[]): T[] {
  const copy = [...arr];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

/**
 * Permutes the 4 answer choices (A/B/C/D) along with `correctIdx` and `communityPoll`
 * so the correct option position is unpredictable every single run.
 */
export function shuffleQuestionOptions(q: QuizQuestion): QuizQuestion {
  const perm = fisherYates([0, 1, 2, 3]);
  const newOptions = perm.map((origIdx) => q.options[origIdx]) as [
    string,
    string,
    string,
    string
  ];
  const newPoll = perm.map((origIdx) => q.communityPoll[origIdx]) as [
    number,
    number,
    number,
    number
  ];
  const newCorrectIdx = perm.indexOf(q.correctIdx) as 0 | 1 | 2 | 3;

  return {
    ...q,
    options: newOptions,
    communityPoll: newPoll,
    correctIdx: newCorrectIdx,
  };
}

/**
 * Builds a freshly randomized deck prioritizing unseen questions from each level's 20-question pool.
 */
export function buildRandomizedDeck(
  category: "all" | QuizCategory,
  seenIds: string[] = [],
  format: "ladder15" | "blitz20" = "ladder15"
): QuizQuestion[] {
  const seenSet = new Set(seenIds);

  if (format === "ladder15") {
    return Array.from({ length: 15 }, (_, idx) => {
      const tierNum = idx + 1;
      const tierPool = QUIZ_BANK.filter(
        (q) =>
          q.tier === tierNum &&
          (category === "all" || q.category === category)
      );
      const fallbackPool =
        tierPool.length > 0
          ? tierPool
          : QUIZ_BANK.filter((q) => q.tier === tierNum);
      const unseen = fallbackPool.filter((q) => !seenSet.has(q.id));
      const candidates = unseen.length > 0 ? unseen : fallbackPool;
      const picked =
        candidates[Math.floor(Math.random() * candidates.length)] ||
        QUIZ_BANK[idx % QUIZ_BANK.length];
      return shuffleQuestionOptions(picked);
    });
  }

  // 20-Question Rapid Blitz Mode
  const catPool =
    category === "all"
      ? QUIZ_BANK
      : QUIZ_BANK.filter((q) => q.category === category);
  const unseen = fisherYates(catPool.filter((q) => !seenSet.has(q.id)));
  const seen = fisherYates(catPool.filter((q) => seenSet.has(q.id)));
  const combined = [...unseen, ...seen].slice(0, 20);
  combined.sort((a, b) => a.tier - b.tier);
  return combined.map(shuffleQuestionOptions);
}

/**
 * Picks a fresh unseen alternate question from the same tier for the Flip Question (Tabdeeli) lifeline.
 */
export function pickAlternateQuestionForTier(
  currentId: string,
  tier: number,
  category: "all" | QuizCategory,
  excludeIds: string[] = []
): QuizQuestion {
  const excludeSet = new Set([currentId, ...excludeIds]);
  const sameTierCat = QUIZ_BANK.filter(
    (q) =>
      q.tier === tier &&
      q.id !== currentId &&
      (category === "all" || q.category === category)
  );
  const unseen = sameTierCat.filter((q) => !excludeSet.has(q.id));
  const pool =
    unseen.length > 0
      ? unseen
      : sameTierCat.length > 0
      ? sameTierCat
      : QUIZ_BANK.filter((q) => q.tier === tier && q.id !== currentId);
  const picked =
    pool[Math.floor(Math.random() * pool.length)] || QUIZ_BANK[0];
  return shuffleQuestionOptions(picked);
}

/**
 * Picks a random Fastest Finger First challenge and scrambles its 4 item positions.
 */
export function pickRandomFastestFinger(lastId?: string): FastestFingerChallenge {
  const pool = FASTEST_FINGER_BANK.filter((c) => c.id !== lastId);
  const candidates = pool.length > 0 ? pool : FASTEST_FINGER_BANK;
  const base = candidates[Math.floor(Math.random() * candidates.length)];

  const perm = fisherYates([0, 1, 2, 3]);
  const newItems = perm.map((origIdx) => base.items[origIdx]) as [
    string,
    string,
    string,
    string
  ];
  const newCorrectOrder = base.correctOrder.map((origIdx) =>
    perm.indexOf(origIdx)
  ) as [number, number, number, number];

  return {
    ...base,
    items: newItems,
    correctOrder: newCorrectOrder,
  };
}
