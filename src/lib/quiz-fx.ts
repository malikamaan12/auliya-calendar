"use client";

export type QuizSfxKind =
  | "intro"
  | "select"
  | "lock"
  | "tick"
  | "heartbeat"
  | "lifeline"
  | "phone_ring"
  | "correct"
  | "combo"
  | "milestone"
  | "wrong"
  | "win";

let sharedCtx: AudioContext | null = null;

function getAudioCtx(): AudioContext | null {
  if (typeof window === "undefined") return null;
  try {
    if (!sharedCtx || sharedCtx.state === "closed") {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext?: typeof AudioContext })
          .webkitAudioContext;
      if (!Ctx) return null;
      sharedCtx = new Ctx();
    }
    if (sharedCtx.state === "suspended") {
      sharedCtx.resume().catch(() => undefined);
    }
    return sharedCtx;
  } catch {
    return null;
  }
}

export function playQuizSfx(
  kind: QuizSfxKind,
  muted: boolean,
  comboMultiplier = 1
) {
  if (muted) return;
  const ctx = getAudioCtx();
  if (!ctx) return;

  const now = ctx.currentTime;

  const playNote = (
    freq: number,
    startOffset: number,
    duration: number,
    type: OscillatorType = "sine",
    peakGain = 0.14,
    endFreq?: number
  ) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, now + startOffset);
    if (endFreq) {
      osc.frequency.exponentialRampToValueAtTime(
        Math.max(20, endFreq),
        now + startOffset + duration
      );
    }
    gain.gain.setValueAtTime(0.0001, now + startOffset);
    gain.gain.exponentialRampToValueAtTime(peakGain, now + startOffset + 0.018);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + startOffset + duration);
    osc.connect(gain).connect(ctx.destination);
    osc.start(now + startOffset);
    osc.stop(now + startOffset + duration + 0.02);
  };

  switch (kind) {
    case "intro": {
      // Iconic KBC-style heroic studio fanfare
      const notes = [293.66, 369.99, 440, 587.33, 659.25, 739.99, 880];
      notes.forEach((f, i) => {
        playNote(f, i * 0.085, 0.45, "triangle", 0.12);
        playNote(f * 0.5, i * 0.085, 0.45, "sine", 0.08);
      });
      break;
    }
    case "select": {
      playNote(523.25, 0, 0.11, "sine", 0.09);
      playNote(783.99, 0.035, 0.14, "triangle", 0.07);
      break;
    }
    case "lock": {
      // Deep timpani boom + rising suspense shimmer
      playNote(146.83, 0, 0.55, "sine", 0.22, 73.42);
      playNote(220, 0.05, 1.25, "triangle", 0.09, 440);
      playNote(329.63, 0.2, 1.1, "sine", 0.07, 659.25);
      break;
    }
    case "tick": {
      playNote(987.77, 0, 0.055, "sine", 0.05);
      break;
    }
    case "heartbeat": {
      // Dual thump "lub-dub" + urgent tick
      playNote(75, 0, 0.14, "sine", 0.2, 42);
      playNote(65, 0.16, 0.18, "sine", 0.16, 38);
      playNote(1174.66, 0, 0.06, "triangle", 0.055);
      break;
    }
    case "lifeline": {
      const chord = [523.25, 659.25, 783.99, 1046.5];
      chord.forEach((f, i) => playNote(f, i * 0.06, 0.38, "triangle", 0.11));
      break;
    }
    case "phone_ring": {
      [0, 0.35].forEach((offset) => {
        playNote(440, offset, 0.22, "sine", 0.08);
        playNote(480, offset, 0.22, "sine", 0.08);
      });
      break;
    }
    case "correct": {
      const boost = Math.min(1.35, 1 + (comboMultiplier - 1) * 0.05);
      [523.25, 659.25, 783.99, 1046.5].forEach((f, i) => {
        playNote(f * boost, i * 0.075, 0.38, "triangle", 0.13);
      });
      break;
    }
    case "combo": {
      const base = 587.33 * Math.min(1.5, 1 + comboMultiplier * 0.06);
      playNote(base, 0, 0.18, "sine", 0.11);
      playNote(base * 1.25, 0.07, 0.28, "triangle", 0.12);
      break;
    }
    case "milestone": {
      // Safe Padav royal fanfare
      const fanfare = [440, 554.37, 659.25, 880, 1108.73, 1318.51];
      fanfare.forEach((f, i) => {
        playNote(f, i * 0.095, 0.6, "triangle", 0.15);
        playNote(f * 0.5, i * 0.095, 0.6, "sine", 0.1);
      });
      break;
    }
    case "win": {
      // Grand 15/15 Sahib-e-Ilm Crown symphony
      const grand = [
        523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.51, 1567.98,
      ];
      grand.forEach((f, i) => {
        playNote(f, i * 0.11, 0.7, "triangle", 0.16);
        playNote(f * 0.5, i * 0.11, 0.7, "sine", 0.11);
      });
      break;
    }
    case "wrong": {
      playNote(311.13, 0, 0.32, "sawtooth", 0.09, 233.08);
      playNote(220, 0.22, 0.55, "sawtooth", 0.1, 130.81);
      break;
    }
  }
}

/** Optional atmospheric Hot-Seat low tension drone controller */
export class HotSeatDrone {
  private osc1: OscillatorNode | null = null;
  private osc2: OscillatorNode | null = null;
  private gain: GainNode | null = null;

  start() {
    const ctx = getAudioCtx();
    if (!ctx || this.osc1) return;
    try {
      const gain = ctx.createGain();
      gain.gain.setValueAtTime(0.0001, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.025, ctx.currentTime + 0.8);
      gain.connect(ctx.destination);

      const o1 = ctx.createOscillator();
      o1.type = "sine";
      o1.frequency.value = 73.42; // D2
      o1.connect(gain);
      o1.start();

      const o2 = ctx.createOscillator();
      o2.type = "triangle";
      o2.frequency.value = 110.0; // A2
      o2.connect(gain);
      o2.start();

      this.osc1 = o1;
      this.osc2 = o2;
      this.gain = gain;
    } catch {
      // ignore
    }
  }

  stop() {
    try {
      if (this.gain && sharedCtx) {
        this.gain.gain.setTargetAtTime(0.0001, sharedCtx.currentTime, 0.12);
      }
      const o1 = this.osc1;
      const o2 = this.osc2;
      this.osc1 = null;
      this.osc2 = null;
      this.gain = null;
      setTimeout(() => {
        try {
          o1?.stop();
          o2?.stop();
        } catch {
          // ignore
        }
      }, 220);
    } catch {
      // ignore
    }
  }
}

export function speakHostLine(text: string, enabled: boolean) {
  if (!enabled || typeof window === "undefined" || !("speechSynthesis" in window)) {
    return;
  }
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.rate = 0.96;
    u.pitch = 0.92;
    u.volume = 0.9;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore
  }
}

// ---- GAMIFICATION: SCHOLARLY RANKS, MEDALS & VAULT PERSISTENCE ----

export interface IlmRankInfo {
  id: string;
  title: string;
  arabicTitle: string;
  minXp: number;
  color: string;
}

export const ILM_RANKS: IlmRankInfo[] = [
  {
    id: "talib",
    title: "Talib-e-Ilm",
    arabicTitle: "طالب العلم",
    minXp: 0,
    color: "#A19CC5",
  },
  {
    id: "qari",
    title: "Qari-e-Sunnat",
    arabicTitle: "قارئ السنة",
    minXp: 5000,
    color: "#38BDF8",
  },
  {
    id: "mutakallim",
    title: "Mutakallim",
    arabicTitle: "متكلم",
    minXp: 25000,
    color: "#4ADE80",
  },
  {
    id: "faqih",
    title: "Faqih-e-Waqt",
    arabicTitle: "فقيه الوقت",
    minXp: 100000,
    color: "#DF98FA",
  },
  {
    id: "bahr",
    title: "Bahr-ul-Uloom",
    arabicTitle: "بحر العلوم",
    minXp: 400000,
    color: "#F9B091",
  },
  {
    id: "sultan",
    title: "Taj-e-Sahib-e-Ilm",
    arabicTitle: "تاج صاحب العلم",
    minXp: 1000000,
    color: "#FBBF24",
  },
];

export function getIlmRank(xp: number): {
  current: IlmRankInfo;
  next: IlmRankInfo | null;
  progressPct: number;
} {
  let current = ILM_RANKS[0];
  let next: IlmRankInfo | null = ILM_RANKS[1];
  for (let i = 0; i < ILM_RANKS.length; i++) {
    if (xp >= ILM_RANKS[i].minXp) {
      current = ILM_RANKS[i];
      next = ILM_RANKS[i + 1] || null;
    }
  }
  if (!next) return { current, next: null, progressPct: 100 };
  const span = next.minXp - current.minXp;
  const pct = Math.max(0, Math.min(100, Math.round(((xp - current.minXp) / span) * 100)));
  return { current, next, progressPct: pct };
}

export interface QuizMedalDef {
  id: string;
  title: string;
  subtitle: string;
  badgeEmoji: string;
}

export const QUIZ_MEDALS: QuizMedalDef[] = [
  {
    id: "first-padav",
    title: "Muhafiz-e-Padav I",
    subtitle: "Conquer Tier 5 Safe Padav (1,000 XP)",
    badgeEmoji: "🛡️",
  },
  {
    id: "second-padav",
    title: "Muhafiz-e-Padav II",
    subtitle: "Conquer Tier 10 Safe Padav (32,000 XP)",
    badgeEmoji: "⚔️",
  },
  {
    id: "grand-crown",
    title: "Taj-e-Sahib-e-Ilm",
    subtitle: "Conquer all 15 Tiers (1,000,000 XP Grand Crown)",
    badgeEmoji: "👑",
  },
  {
    id: "streak-5",
    title: "Shu'la-e-Ilm (5x)",
    subtitle: "Build an unbroken 5-answer Noor Streak",
    badgeEmoji: "🔥",
  },
  {
    id: "streak-10",
    title: "Noor-ul-Yaqeen (10x)",
    subtitle: "Build an unbroken 10-answer Noor Streak",
    badgeEmoji: "⚡",
  },
  {
    id: "no-lifeline-10",
    title: "Tawakkul & Ilm",
    subtitle: "Reach Tier 10 without spending any Lifeline",
    badgeEmoji: "💎",
  },
  {
    id: "speed-demon",
    title: "Barq-Raftar",
    subtitle: "Win Fastest Finger First with 15s+ left on clock",
    badgeEmoji: "🚀",
  },
  {
    id: "vault-50",
    title: "Hafiz-ul-Masa'il",
    subtitle: "Master 50 unique questions in the 300-Q Vault",
    badgeEmoji: "📜",
  },
];

export interface QuizRunHistoryEntry {
  id: string;
  date: string;
  mode: string;
  tierReached: number;
  totalSteps: number;
  xpEarned: number;
  maxStreak: number;
  outcome: "won" | "walked" | "wrong";
}

export interface QuizVaultProfile {
  seenQuestionIds: string[];
  masteredQuestionIds: string[];
  unlockedMedals: string[];
  gamesPlayed: number;
  crownsWon: number;
  bestStreak: number;
  recentRuns: QuizRunHistoryEntry[];
}

const VAULT_STORAGE_KEY = "sahib_ilm_vault_v2";

export const DEFAULT_VAULT_PROFILE: QuizVaultProfile = {
  seenQuestionIds: [],
  masteredQuestionIds: [],
  unlockedMedals: [],
  gamesPlayed: 0,
  crownsWon: 0,
  bestStreak: 0,
  recentRuns: [],
};

export function loadQuizVault(): QuizVaultProfile {
  if (typeof window === "undefined") return DEFAULT_VAULT_PROFILE;
  try {
    const raw = window.localStorage.getItem(VAULT_STORAGE_KEY);
    if (!raw) return DEFAULT_VAULT_PROFILE;
    const parsed = JSON.parse(raw) as Partial<QuizVaultProfile>;
    return {
      seenQuestionIds: Array.isArray(parsed.seenQuestionIds) ? parsed.seenQuestionIds : [],
      masteredQuestionIds: Array.isArray(parsed.masteredQuestionIds)
        ? parsed.masteredQuestionIds
        : [],
      unlockedMedals: Array.isArray(parsed.unlockedMedals) ? parsed.unlockedMedals : [],
      gamesPlayed: typeof parsed.gamesPlayed === "number" ? parsed.gamesPlayed : 0,
      crownsWon: typeof parsed.crownsWon === "number" ? parsed.crownsWon : 0,
      bestStreak: typeof parsed.bestStreak === "number" ? parsed.bestStreak : 0,
      recentRuns: Array.isArray(parsed.recentRuns) ? parsed.recentRuns.slice(0, 8) : [],
    };
  } catch {
    return DEFAULT_VAULT_PROFILE;
  }
}

export function saveQuizVault(profile: QuizVaultProfile) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(VAULT_STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // ignore quota errors
  }
}
