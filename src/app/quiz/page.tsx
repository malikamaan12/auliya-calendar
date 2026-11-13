"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
  PhoneCall,
  Shuffle,
  Split,
  ArrowRight,
  ShieldCheck,
  Volume2,
  VolumeX,
  LogOut,
  Award,
  Lock,
  Infinity as InfinityIcon,
  Zap,
  Copy,
  Check,
  Mic,
} from "lucide-react";
import {
  FASTEST_FINGER_BANK,
  FastestFingerChallenge,
  QUIZ_BANK,
  QUIZ_CATEGORIES,
  QuizQuestion,
  SAFE_TIERS,
  TIER_REWARDS,
} from "@/data/quiz";
import { useApp } from "@/lib/store";

type CategoryFilter = "all" | QuizQuestion["category"];

function playKbcTone(
  kind: "select" | "lock" | "tick" | "correct" | "milestone" | "wrong" | "win",
  muted: boolean
) {
  if (muted) return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const seq =
      kind === "win"
        ? [523.25, 659.25, 783.99, 1046.5, 1318.5]
        : kind === "milestone"
        ? [440, 554.37, 659.25, 880]
        : kind === "correct"
        ? [523.25, 659.25, 783.99]
        : kind === "lock"
        ? [293.66, 369.99, 440]
        : kind === "tick"
        ? [880]
        : kind === "select"
        ? [392]
        : [220, 174.61];
    seq.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "wrong" ? "sawtooth" : kind === "lock" ? "triangle" : "sine";
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + i * (kind === "lock" ? 0.14 : 0.1);
      const dur = kind === "tick" ? 0.08 : 0.42;
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(kind === "tick" ? 0.06 : kind === "wrong" ? 0.1 : 0.15, t0 + 0.015);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + dur + 0.03);
    });
    setTimeout(() => ctx.close().catch(() => undefined), 1500);
  } catch {
    // ignore WebAudio restrictions
  }
}

function buildRunDeck(category: CategoryFilter): QuizQuestion[] {
  if (category === "all") {
    return Array.from({ length: 15 }, (_, idx) => {
      const tierNum = idx + 1;
      const pool = QUIZ_BANK.filter((q) => q.tier === tierNum);
      return pool[Math.floor(Math.random() * pool.length)] || QUIZ_BANK[idx % QUIZ_BANK.length];
    });
  }
  return QUIZ_BANK.filter((q) => q.category === category).sort((a, b) => a.tier - b.tier);
}

export default function QuizPage() {
  const { addIlmPoints, ilmPoints, bestQuizTier } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [deck, setDeck] = useState<QuizQuestion[]>(() => buildRunDeck("all"));
  const [tierIdx, setTierIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const [outcome, setOutcome] = useState<"playing" | "correct" | "wrong" | "won" | "walked">("playing");
  const [eliminatedOpts, setEliminatedOpts] = useState<number[]>([]);
  const [showIshara, setShowIshara] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [swappedQuestion, setSwappedQuestion] = useState<QuizQuestion | null>(null);
  const [muted, setMuted] = useState(false);
  const [copiedScore, setCopiedScore] = useState(false);

  // Fastest Finger First state
  const [fffOpen, setFffOpen] = useState(false);
  const [fffChallenge, setFffChallenge] = useState<FastestFingerChallenge>(FASTEST_FINGER_BANK[0]);
  const [fffPickOrder, setFffPickOrder] = useState<number[]>([]);
  const [fffTimeLeft, setFffTimeLeft] = useState(25);
  const [fffStatus, setFffStatus] = useState<"playing" | "won" | "lost">("playing");

  const [runXp, setRunXp] = useState(0);
  const [safeXp, setSafeXp] = useState(0);
  const [bankedXp, setBankedXp] = useState<number | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [usedLifelines, setUsedLifelines] = useState({
    nisf: false,
    ishara: false,
    poll: false,
    tabdeeli: false,
  });

  const isLadder = categoryFilter === "all";
  const totalSteps = deck.length;
  const question = swappedQuestion || deck[tierIdx] || QUIZ_BANK[0];
  const stepReward = isLadder ? TIER_REWARDS[tierIdx] : (question.tier || tierIdx + 1) * 150;

  const totalSeconds = tierIdx < 5 ? 30 : tierIdx < 10 ? 45 : null;
  const [secondsLeft, setSecondsLeft] = useState<number | null>(30);

  const commitPoints = useCallback(
    (pts: number, achievedTier?: number) => {
      if (pts > 0) addIlmPoints(pts, achievedTier);
      setBankedXp(pts);
    },
    [addIlmPoints]
  );

  // Main KBC Clock
  useEffect(() => {
    if (fffOpen || isLocking || outcome !== "playing" || secondsLeft === null || secondsLeft <= 0) return;
    const id = setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setOutcome("wrong");
        playKbcTone("wrong", muted);
        commitPoints(safeXp, isLadder && tierIdx > 0 ? tierIdx : undefined);
      } else {
        const next = secondsLeft - 1;
        setSecondsLeft(next);
        if (next <= 10) playKbcTone("tick", muted);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [fffOpen, isLocking, secondsLeft, outcome, muted, safeXp, isLadder, tierIdx, commitPoints]);

  // Fastest Finger First Clock
  useEffect(() => {
    if (!fffOpen || fffStatus !== "playing" || fffTimeLeft <= 0) return;
    const id = setTimeout(() => {
      if (fffTimeLeft <= 1) {
        setFffTimeLeft(0);
        setFffStatus("lost");
        playKbcTone("wrong", muted);
      } else {
        setFffTimeLeft((t) => t - 1);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [fffOpen, fffStatus, fffTimeLeft, muted]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  const revealAnswer = useCallback(
    (idx: number) => {
      setIsLocking(false);
      if (idx === question.correctIdx) {
        setAnsweredCount((c) => c + 1);
        if (isLadder) {
          const earned = TIER_REWARDS[tierIdx];
          setRunXp(earned);
          const hitSafe = SAFE_TIERS.includes(tierIdx);
          if (hitSafe) setSafeXp(earned);

          if (tierIdx === totalSteps - 1) {
            setOutcome("won");
            playKbcTone("win", muted);
            commitPoints(earned, 15);
          } else {
            setOutcome("correct");
            playKbcTone(hitSafe ? "milestone" : "correct", muted);
          }
        } else {
          const earned = runXp + stepReward;
          setRunXp(earned);
          setSafeXp(earned);
          if (tierIdx === totalSteps - 1) {
            setOutcome("won");
            playKbcTone("win", muted);
            commitPoints(earned);
          } else {
            setOutcome("correct");
            playKbcTone("correct", muted);
          }
        }
      } else {
        setOutcome("wrong");
        playKbcTone("wrong", muted);
        commitPoints(safeXp, isLadder && tierIdx > 0 ? tierIdx : undefined);
      }
    },
    [question.correctIdx, isLadder, tierIdx, totalSteps, muted, commitPoints, runXp, stepReward, safeXp]
  );

  const lockInAnswer = useCallback(
    (idx: number) => {
      if (outcome !== "playing" || isLocking) return;
      setIsLocking(true);
      playKbcTone("lock", muted);
      lockTimerRef.current = setTimeout(() => {
        revealAnswer(idx);
      }, 850);
    },
    [outcome, isLocking, muted, revealAnswer]
  );

  const handleOptionSelect = useCallback(
    (idx: number) => {
      if (outcome !== "playing" || isLocking || eliminatedOpts.includes(idx)) return;
      setSelectedOpt(idx);
      playKbcTone("select", muted);
    },
    [outcome, isLocking, eliminatedOpts, muted]
  );

  const nextTier = useCallback(() => {
    const next = Math.min(totalSteps - 1, tierIdx + 1);
    setTierIdx(next);
    setSecondsLeft(next < 5 ? 30 : next < 10 ? 45 : null);
    setSelectedOpt(null);
    setIsLocking(false);
    setOutcome("playing");
    setEliminatedOpts([]);
    setShowIshara(false);
    setShowPoll(false);
    setSwappedQuestion(null);
  }, [totalSteps, tierIdx]);

  const startNewRun = useCallback((cat: CategoryFilter) => {
    if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    setFffOpen(false);
    setCategoryFilter(cat);
    setDeck(buildRunDeck(cat));
    setTierIdx(0);
    setSecondsLeft(30);
    setSelectedOpt(null);
    setIsLocking(false);
    setOutcome("playing");
    setEliminatedOpts([]);
    setShowIshara(false);
    setShowPoll(false);
    setSwappedQuestion(null);
    setRunXp(0);
    setSafeXp(0);
    setBankedXp(null);
    setAnsweredCount(0);
    setCopiedScore(false);
    setUsedLifelines({ nisf: false, ishara: false, poll: false, tabdeeli: false });
  }, []);

  const openFastestFinger = () => {
    const pick = FASTEST_FINGER_BANK[Math.floor(Math.random() * FASTEST_FINGER_BANK.length)];
    setFffChallenge(pick);
    setFffPickOrder([]);
    setFffTimeLeft(25);
    setFffStatus("playing");
    setFffOpen(true);
  };

  const handleFffPick = (idx: number) => {
    if (fffStatus !== "playing" || fffPickOrder.includes(idx)) return;
    const nextOrder = [...fffPickOrder, idx];
    setFffPickOrder(nextOrder);
    playKbcTone("select", muted);
    if (nextOrder.length === 4) {
      const ok = nextOrder.every((val, i) => val === fffChallenge.correctOrder[i]);
      if (ok) {
        setFffStatus("won");
        playKbcTone("milestone", muted);
        addIlmPoints(250);
      } else {
        setFffStatus("lost");
        playKbcTone("wrong", muted);
      }
    }
  };

  const walkAway = () => {
    if (runXp <= 0 || isLocking || outcome === "won" || outcome === "wrong" || outcome === "walked") return;
    setOutcome("walked");
    playKbcTone("milestone", muted);
    commitPoints(runXp, isLadder ? tierIdx + (outcome === "correct" ? 1 : 0) : undefined);
  };

  const triggerNisf = () => {
    if (usedLifelines.nisf || outcome !== "playing" || isLocking) return;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== question.correctIdx);
    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    const removed = shuffled.slice(0, 2);
    setEliminatedOpts(removed);
    if (selectedOpt !== null && removed.includes(selectedOpt)) setSelectedOpt(null);
    setUsedLifelines((u) => ({ ...u, nisf: true }));
    playKbcTone("lock", muted);
  };

  const triggerIshara = useCallback(() => {
    if (usedLifelines.ishara || outcome !== "playing" || isLocking) return;
    setShowIshara(true);
    setUsedLifelines((u) => ({ ...u, ishara: true }));
    playKbcTone("lock", muted);
  }, [usedLifelines.ishara, outcome, isLocking, muted]);

  const triggerPoll = () => {
    if (usedLifelines.poll || outcome !== "playing" || isLocking) return;
    setShowPoll(true);
    setUsedLifelines((u) => ({ ...u, poll: true }));
    playKbcTone("lock", muted);
  };

  const triggerTabdeeli = () => {
    if (usedLifelines.tabdeeli || outcome !== "playing" || isLocking) return;
    const sameTierAlt = QUIZ_BANK.find((q) => q.id !== question.id && q.tier === question.tier);
    const sameCatAlt = QUIZ_BANK.find(
      (q) => q.id !== question.id && q.category === question.category && !deck.some((d) => d.id === q.id)
    );
    setSwappedQuestion(sameTierAlt || sameCatAlt || QUIZ_BANK[0]);
    setEliminatedOpts([]);
    setSelectedOpt(null);
    setShowIshara(false);
    setShowPoll(false);
    setUsedLifelines((u) => ({ ...u, tabdeeli: true }));
    playKbcTone("lock", muted);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (fffOpen) return;
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();
      if (outcome === "playing" && !isLocking) {
        if (k === "1" || k === "a") handleOptionSelect(0);
        else if (k === "2" || k === "b") handleOptionSelect(1);
        else if (k === "3" || k === "c") handleOptionSelect(2);
        else if (k === "4" || k === "d") handleOptionSelect(3);
        else if (k === "h") triggerIshara();
        else if (k === "enter" && selectedOpt !== null) lockInAnswer(selectedOpt);
      } else if (outcome === "correct" && k === "enter") {
        nextTier();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [fffOpen, outcome, isLocking, selectedOpt, handleOptionSelect, lockInAnswer, nextTier, triggerIshara]);

  const timerPct = useMemo(() => {
    if (secondsLeft === null || totalSeconds === null) return 100;
    return Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  }, [secondsLeft, totalSeconds]);

  const lifelinesRemaining = Object.values(usedLifelines).filter((v) => !v).length;

  const hostLine = useMemo(() => {
    if (isLocking) return "Computer ji, is jawab ko lock kiya jaye...";
    if (outcome === "won") return "MashaAllah! Aapne 15/15 Sawal jeet kar Sahib-e-Ilm ka Taaj haasil kiya!";
    if (outcome === "walked") return `Behtareen faisla! Aapne ${bankedXp?.toLocaleString() ?? 0} Ilm XP mehfooz kar liye.`;
    if (outcome === "wrong") {
      return safeXp > 0
        ? `Afsos, galat jawab — magar Safe Padav ki wajah se ${safeXp.toLocaleString()} XP aapke paas hain!`
        : "Koi baat nahi — Ilm seekhne ka safar jari rakhein aur phir koshish karein!";
    }
    if (outcome === "correct") {
      if (SAFE_TIERS.includes(tierIdx)) return `Mubarak! Safe Padav #${SAFE_TIERS.indexOf(tierIdx) + 1} paar — ${runXp.toLocaleString()} XP ab bilkul mehfooz hain!`;
      return `Bilkul sahi jawab! Agle sawal ke liye taiyar ho jayein.`;
    }
    if (isLadder && SAFE_TIERS.includes(tierIdx)) {
      return `Sawal #${tierIdx + 1} — Yeh Safe Padav hai (${stepReward.toLocaleString()} Ilm XP). Soch samajh kar jawab dein!`;
    }
    if (isLadder && tierIdx >= 10) {
      return `Sawal #${tierIdx + 1} — Waqt ki koi qaid nahi. Aapke paas ${lifelinesRemaining} lifeline baqi hain.`;
    }
    return `Sawal #${tierIdx + 1} — ${stepReward.toLocaleString()} Ilm XP ke liye aapki screen par.`;
  }, [isLocking, outcome, bankedXp, safeXp, tierIdx, runXp, isLadder, stepReward, lifelinesRemaining]);

  const lifelines = [
    { id: "nisf", label: "50:50", sub: "Nisf", icon: Split, used: usedLifelines.nisf, onClick: triggerNisf },
    { id: "ishara", label: "Phone a Scholar", sub: "Ishara", icon: PhoneCall, used: usedLifelines.ishara, onClick: triggerIshara },
    { id: "poll", label: "Audience Poll", sub: "Ijma'", icon: Users, used: usedLifelines.poll, onClick: triggerPoll },
    { id: "tabdeeli", label: "Flip Question", sub: "Tabdeeli", icon: Shuffle, used: usedLifelines.tabdeeli, onClick: triggerTabdeeli },
  ];


  const copyCertificate = () => {
    const text = `Sahib-e-Ilm Sunni Trivia (Auliya Calendar): Reached ${
      isLadder ? `Tier ${answeredCount}/15` : `${categoryFilter} (${answeredCount}/${totalSteps})`
    } and banked ${(bankedXp ?? 0).toLocaleString()} Ilm XP!`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedScore(true);
      setTimeout(() => setCopiedScore(false), 2000);
    });
  };

  return (
    <div className="space-y-5">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-gold)" }}>
            <Trophy className="w-3.5 h-3.5" />
            <span>KBC-Style Hot Seat • 15-Tier Sahib-e-Ilm Ladder</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sahib-e-Ilm Hot Seat Quiz
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={openFastestFinger}
            className="px-3 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1.5 cursor-pointer hover:brightness-110"
            style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Fastest Finger First (+250 XP)</span>
          </button>
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute quiz audio" : "Mute quiz audio"}
            className="p-2 rounded-xl border cursor-pointer"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />}
          </button>
          <span className="px-3 py-1.5 rounded-xl border font-bold tabular-nums" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}>
            Total XP: {ilmPoints.toLocaleString()}
          </span>
          <span className="px-3 py-1.5 rounded-xl border font-semibold" style={{ borderColor: "var(--border-hairline)" }}>
            Best: {bestQuizTier}/15
          </span>
        </div>
      </div>

      {/* Mode Switcher */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => startNewRun("all")}
          className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
          style={{
            borderColor: categoryFilter === "all" && !fffOpen ? "var(--accent-gold)" : "var(--border-hairline)",
            backgroundColor: categoryFilter === "all" && !fffOpen ? "var(--gold-soft)" : "var(--bg-muted)",
            color: categoryFilter === "all" && !fffOpen ? "var(--accent-gold)" : "var(--text-muted)",
          }}
        >
          15-Tier KBC Ladder
        </button>
        {QUIZ_CATEGORIES.map((cat) => {
          const active = categoryFilter === cat && !fffOpen;
          return (
            <button
              key={cat}
              type="button"
              onClick={() => startNewRun(cat)}
              className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
              style={{
                borderColor: active ? "var(--accent-secondary)" : "var(--border-hairline)",
                backgroundColor: active ? "rgba(2, 132, 199, 0.12)" : "var(--bg-muted)",
                color: active ? "var(--accent-secondary)" : "var(--text-muted)",
              }}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Fastest Finger First Qualifier Panel */}
      {fffOpen ? (
        <section className="bento-card p-6 space-y-5 max-w-3xl mx-auto">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                Fastest Finger First • Warm-Up Round
              </span>
              <h2 className="text-lg sm:text-xl font-bold mt-1">{fffChallenge.prompt}</h2>
            </div>
            <div
              className="w-12 h-12 rounded-full border-2 flex items-center justify-center text-sm font-extrabold tabular-nums shrink-0"
              style={{
                borderColor: fffTimeLeft <= 7 ? "#EF4444" : "var(--accent-gold)",
                color: fffTimeLeft <= 7 ? "#F87171" : "var(--accent-gold)",
              }}
            >
              {fffTimeLeft}s
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {fffChallenge.items.map((item, idx) => {
              const orderPos = fffPickOrder.indexOf(idx);
              const picked = orderPos !== -1;
              return (
                <button
                  key={idx}
                  type="button"
                  disabled={fffStatus !== "playing" || picked}
                  onClick={() => handleFffPick(idx)}
                  className="p-4 rounded-2xl border-2 text-start text-sm font-medium flex items-center justify-between gap-3 cursor-pointer disabled:opacity-75 transition-all"
                  style={{
                    borderColor: picked ? "var(--accent-gold)" : "var(--border-hairline)",
                    backgroundColor: picked ? "var(--gold-soft)" : "var(--bg-muted)",
                  }}
                >
                  <span>{item}</span>
                  <span
                    className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-bold shrink-0"
                    style={{
                      borderColor: picked ? "var(--accent-gold)" : "var(--border-hairline)",
                      backgroundColor: picked ? "#F59E0B" : "transparent",
                      color: picked ? "#000" : "var(--text-muted)",
                    }}
                  >
                    {picked ? orderPos + 1 : "?"}
                  </span>
                </button>
              );
            })}
          </div>

          {fffStatus !== "playing" && (
            <div className="p-4 rounded-2xl border space-y-2" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
              <div className="font-bold text-sm flex items-center gap-2">
                {fffStatus === "won" ? (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>MashaAllah! Fastest Finger Qualified (+250 Bonus Ilm XP)!</span>
                  </>
                ) : (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span>Not quite in sequence — try another or head to the Hot Seat!</span>
                  </>
                )}
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                {fffChallenge.explanation}
              </p>
            </div>
          )}

          <div className="flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={() => setFffPickOrder([])}
              disabled={fffStatus !== "playing" || fffPickOrder.length === 0}
              className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer disabled:opacity-40"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              Clear Order
            </button>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={openFastestFinger}
                className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                New Challenge
              </button>
              <button
                type="button"
                onClick={() => startNewRun("all")}
                className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer"
              >
                Enter Hot Seat
              </button>
            </div>
          </div>
        </section>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          {/* KBC Hot-Seat Stage */}
          <section
            className="lg:col-span-8 bento-card p-5 sm:p-6 space-y-5 relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 90% 60% at 50% 0%, rgba(245, 158, 11, 0.08), transparent 65%), var(--bg-surface-elevated)",
            }}
          >
            {/* KBC Lifelines Bar */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b" style={{ borderColor: "var(--border-hairline)" }}>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 flex-1">
                {lifelines.map((lf) => {
                  const Icon = lf.icon;
                  return (
                    <button
                      key={lf.id}
                      type="button"
                      disabled={lf.used || outcome !== "playing" || isLocking}
                      onClick={lf.onClick}
                      className="relative px-3 py-2 rounded-2xl border flex items-center gap-2 text-start cursor-pointer transition-all disabled:opacity-35 hover:brightness-110"
                      style={{
                        borderColor: lf.used ? "var(--border-hairline)" : "rgba(245, 158, 11, 0.45)",
                        backgroundColor: lf.used ? "var(--bg-muted)" : "rgba(245, 158, 11, 0.08)",
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: lf.used ? "transparent" : "var(--gold-soft)",
                          color: lf.used ? "var(--text-muted)" : "var(--accent-gold)",
                        }}
                      >
                        <Icon className="w-3.5 h-3.5" />
                      </span>
                      <div className="min-w-0 leading-tight">
                        <div className={`text-[11px] font-bold truncate ${lf.used ? "line-through" : ""}`}>{lf.label}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>{lf.sub}</div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* KBC Circular Stage Clock + Current Prize */}
            <div className="flex items-center justify-between gap-3">
              <div className="flex flex-wrap items-center gap-2 text-xs">
                <span
                  className="px-3 py-1 rounded-full font-bold"
                  style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                >
                  {isLadder ? `Sawal #${tierIdx + 1}` : `Q${tierIdx + 1}/${totalSteps}`} • {stepReward.toLocaleString()} XP
                </span>
                <span className="px-2.5 py-1 rounded-full border text-[11px]" style={{ borderColor: "var(--border-hairline)" }}>
                  {question.category}
                </span>
                {safeXp > 0 && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-semibold" style={{ color: "var(--accent-primary)" }}>
                    <ShieldCheck className="w-3.5 h-3.5" />
                    Padav: {safeXp.toLocaleString()} XP
                  </span>
                )}
              </div>

              <div className="flex items-center gap-2.5 shrink-0">
                {runXp > 0 && !isLocking && (outcome === "playing" || outcome === "correct") && (
                  <button
                    type="button"
                    onClick={walkAway}
                    className="px-3 py-1.5 rounded-xl border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer hover:brightness-110"
                    style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Quit &amp; Take {runXp.toLocaleString()}</span>
                  </button>
                )}

                {(() => {
                  const size = 54;
                  const r = 22;
                  const c = 2 * Math.PI * r;
                  const urgent = secondsLeft !== null && secondsLeft <= 8;
                  return (
                    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
                      <svg width={size} height={size} className="-rotate-90">
                        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--border-hairline)" strokeWidth="4" />
                        <circle
                          cx={size / 2}
                          cy={size / 2}
                          r={r}
                          fill="none"
                          stroke={urgent ? "#EF4444" : "var(--accent-gold)"}
                          strokeWidth="4"
                          strokeLinecap="round"
                          strokeDasharray={c}
                          strokeDashoffset={c * (1 - timerPct / 100)}
                          style={{ transition: "stroke-dashoffset 0.9s linear" }}
                        />
                      </svg>
                      <span
                        className="absolute text-xs font-extrabold tabular-nums"
                        style={{ color: urgent ? "#F87171" : "var(--accent-gold)" }}
                      >
                        {secondsLeft !== null ? secondsLeft : <InfinityIcon className="w-4 h-4" />}
                      </span>
                    </div>
                  );
                })()}
              </div>
            </div>

            {/* Host Stage Commentary */}
            <div className="flex items-center gap-2 text-xs italic px-1" style={{ color: "var(--text-muted)" }}>
              <Mic className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
              <span>{hostLine}</span>
            </div>

            {/* KBC Question Box */}
            <div
              className="p-5 sm:p-6 rounded-2xl border-2 text-center"
              style={{
                borderColor: "rgba(245, 158, 11, 0.4)",
                backgroundColor: "var(--bg-muted)",
                boxShadow: "inset 0 1px 0 rgba(255,255,255,0.06)",
              }}
            >
              <h2 className="text-lg sm:text-xl font-bold leading-snug">{question.question}</h2>
            </div>

            {/* Lifeline Outputs */}
            {showIshara && (
              <div className="p-3.5 rounded-2xl border text-xs flex items-start gap-2.5" style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}>
                <PhoneCall className="w-4 h-4 shrink-0 mt-0.5" />
                <div>
                  <strong>Scholar&apos;s Call (Ishara):</strong> {question.isharaHint}
                </div>
              </div>
            )}

            {showPoll && (
              <div className="p-4 rounded-2xl border space-y-2" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
                <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--accent-secondary)" }}>
                  Ijma&apos; Audience Poll Results
                </div>
                <div className="grid grid-cols-4 gap-3 items-end h-24 pt-2">
                  {question.communityPoll.map((pct, i) => (
                    <div key={i} className="flex flex-col items-center justify-end h-full gap-1">
                      <span className="text-[11px] font-bold tabular-nums" style={{ color: "var(--accent-secondary)" }}>
                        {pct}%
                      </span>
                      <div className="w-full max-w-[36px] bg-black/25 rounded-t-lg overflow-hidden flex items-end h-14">
                        <div
                          className="w-full rounded-t-lg transition-all duration-500"
                          style={{ height: `${pct}%`, backgroundColor: "var(--accent-secondary)" }}
                        />
                      </div>
                      <span className="text-[11px] font-bold">{String.fromCharCode(65 + i)}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* KBC 2x2 Options */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {question.options.map((opt, idx) => {
                const isElim = eliminatedOpts.includes(idx);
                const isSel = selectedOpt === idx;
                const isCorr = idx === question.correctIdx;

                let borderCol = "var(--border-hairline)";
                let bgCol = "var(--bg-muted)";
                let badgeBg = "transparent";
                let badgeText = "var(--accent-gold)";

                if (outcome !== "playing" && outcome !== "walked") {
                  if (isCorr) {
                    borderCol = "#10B981";
                    bgCol = "rgba(16,185,129,0.2)";
                    badgeBg = "#10B981";
                    badgeText = "#FFFFFF";
                  } else if (isSel) {
                    borderCol = "#EF4444";
                    bgCol = "rgba(239,68,68,0.2)";
                    badgeBg = "#EF4444";
                    badgeText = "#FFFFFF";
                  }
                } else if (isSel) {
                  borderCol = "#F59E0B";
                  bgCol = isLocking ? "rgba(245,158,11,0.32)" : "rgba(245,158,11,0.18)";
                  badgeBg = "#F59E0B";
                  badgeText = "#000000";
                }

                return (
                  <motion.button
                    key={idx}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    disabled={isElim || outcome !== "playing" || isLocking}
                    onClick={() => handleOptionSelect(idx)}
                    className={`p-3.5 sm:p-4 rounded-2xl border-2 text-start text-sm font-medium flex items-center gap-3 cursor-pointer disabled:opacity-20 transition-all hover:brightness-110 ${
                      isLocking && isSel ? "animate-pulse" : ""
                    }`}
                    style={{ borderColor: borderCol, backgroundColor: bgCol }}
                  >
                    <span
                      className="w-7 h-7 rounded-lg rotate-45 flex items-center justify-center shrink-0 border"
                      style={{ borderColor: borderCol, backgroundColor: badgeBg, color: badgeText }}
                    >
                      <span className="-rotate-45 text-xs font-extrabold">{String.fromCharCode(65 + idx)}</span>
                    </span>
                    <span className="leading-snug">{opt}</span>
                  </motion.button>
                );
              })}
            </div>

            {/* KBC "Lock Kiya Jaye?" Dramatic Confirmation Bar */}
            {outcome === "playing" && selectedOpt !== null && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl border-2 flex flex-wrap items-center justify-between gap-3"
                style={{ borderColor: "#F59E0B", backgroundColor: "var(--gold-soft)" }}
              >
                <div className="text-xs sm:text-sm font-bold">
                  {isLocking
                    ? `Locking Option ${String.fromCharCode(65 + selectedOpt)}...`
                    : (
                      <>
                        Option {String.fromCharCode(65 + selectedOpt)} selected —{" "}
                        <span style={{ color: "var(--accent-gold)" }}>Lock Kiya Jaye?</span>
                      </>
                    )}
                </div>
                <button
                  type="button"
                  disabled={isLocking}
                  onClick={() => lockInAnswer(selectedOpt)}
                  className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-amber-500 text-black cursor-pointer inline-flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60"
                >
                  <Lock className="w-3.5 h-3.5" />
                  <span>{isLocking ? "Locking..." : "Lock Kiya Jaye!"}</span>
                </button>
              </motion.div>
            )}

            {/* Result & Certificate Summary */}
            {outcome !== "playing" && (
              <div className="p-5 rounded-2xl border space-y-3" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-bold text-sm">
                    {outcome === "wrong" ? (
                      <>
                        <XCircle className="w-5 h-5 text-red-400" />
                        <span>
                          {secondsLeft === 0 ? "Time Up" : "Galat Jawab"} — Banked {bankedXp?.toLocaleString() ?? 0} Safe XP
                        </span>
                      </>
                    ) : outcome === "walked" ? (
                      <>
                        <Award className="w-5 h-5 text-amber-400" />
                        <span>Shabash! +{bankedXp?.toLocaleString() ?? 0} Ilm XP Claimed Safely</span>
                      </>
                    ) : outcome === "won" ? (
                      <>
                        <Trophy className="w-5 h-5 text-amber-400" />
                        <span>MashaAllah! 15/15 Sahib-e-Ilm Grand Crown (+{bankedXp?.toLocaleString() ?? 0} XP)!</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                        <span>
                          Sahi Jawab! {SAFE_TIERS.includes(tierIdx) ? "★ Safe Padav Reached — " : ""}
                          {runXp.toLocaleString()} Ilm XP
                        </span>
                      </>
                    )}
                  </div>

                  {(outcome === "won" || outcome === "walked" || outcome === "wrong") && (
                    <div className="flex items-center gap-2">
                      <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                        {answeredCount} correct • {lifelinesRemaining}/4 lifelines left
                      </span>
                      <button
                        type="button"
                        onClick={copyCertificate}
                        className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        {copiedScore ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedScore ? "Copied" : "Share Score"}</span>
                      </button>
                    </div>
                  )}
                </div>

                {outcome !== "walked" && (
                  <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                    <strong>Learn Why (Proof):</strong> {question.proofExplanation}
                  </p>
                )}

                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  <Link
                    href={question.proofLink}
                    className="text-xs font-semibold inline-flex items-center gap-1 hover:underline"
                    style={{ color: "var(--accent-secondary)" }}
                  >
                    <span>{question.proofLinkLabel}</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>

                  {outcome === "correct" ? (
                    <button
                      type="button"
                      onClick={nextTier}
                      className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>Next Sawal ({isLadder ? `Tier ${tierIdx + 2}` : `Q${tierIdx + 2}`})</span>
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => startNewRun(categoryFilter)}
                      className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Play Again (New Seat)</span>
                    </button>
                  )}
                </div>
              </div>
            )}

            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              Shortcuts: <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "var(--border-hairline)" }}>A</kbd>–
              <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "var(--border-hairline)" }}>D</kbd> select •{" "}
              <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "var(--border-hairline)" }}>Enter</kbd> Lock Kiya Jaye / Next •{" "}
              <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "var(--border-hairline)" }}>H</kbd> Scholar Call
            </p>
          </section>

          {/* Classic KBC 15-Tier Prize Tree */}
          <aside className="lg:col-span-4 bento-card p-5 space-y-2">
            <div className="flex items-center justify-between mb-1">
              <h2 className="text-sm font-bold">
                {isLadder ? "KBC 15-Tier Prize Tree" : `${categoryFilter} (${totalSteps} Qs)`}
              </h2>
              {isLadder && (
                <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                  ★ Safe Padav
                </span>
              )}
            </div>

            {isLadder ? (
              <div className="space-y-1 flex flex-col-reverse">
                {TIER_REWARDS.map((pts, i) => {
                  const isSafe = SAFE_TIERS.includes(i);
                  const isCurrent = i === tierIdx;
                  const isPassed = i < tierIdx || (i === tierIdx && (outcome === "correct" || outcome === "won"));
                  return (
                    <div
                      key={i}
                      className="px-3 py-1.5 rounded-xl text-xs flex items-center justify-between border transition-all"
                      style={{
                        borderColor: isCurrent ? "#F59E0B" : isSafe ? "rgba(245,158,11,0.28)" : "transparent",
                        backgroundColor: isCurrent
                          ? "rgba(245, 158, 11, 0.22)"
                          : isPassed
                          ? "var(--accent-soft)"
                          : "transparent",
                        color: isCurrent
                          ? "#FBBF24"
                          : isSafe
                          ? "var(--accent-gold)"
                          : isPassed
                          ? "var(--accent-primary)"
                          : "var(--text-muted)",
                        fontWeight: isCurrent || isSafe ? 800 : 500,
                      }}
                    >
                      <span className="flex items-center gap-2 tabular-nums">
                        <span className="w-5 text-end opacity-75">{i + 1}</span>
                        <span>{isSafe ? "★" : "•"}</span>
                      </span>
                      <span className="tabular-nums">{pts.toLocaleString()} XP</span>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="space-y-1.5">
                {deck.map((q, i) => {
                  const isCurrent = i === tierIdx;
                  const isPassed = i < tierIdx || (i === tierIdx && (outcome === "correct" || outcome === "won"));
                  return (
                    <div
                      key={q.id}
                      className="px-3 py-2 rounded-xl text-xs flex items-center justify-between border"
                      style={{
                        borderColor: isCurrent ? "var(--accent-secondary)" : "transparent",
                        backgroundColor: isCurrent
                          ? "rgba(2, 132, 199, 0.12)"
                          : isPassed
                          ? "var(--accent-soft)"
                          : "transparent",
                        color: isPassed ? "var(--accent-primary)" : "var(--text-muted)",
                        fontWeight: isCurrent ? 700 : 500,
                      }}
                    >
                      <span>Sawal {i + 1} (Tier {q.tier})</span>
                      <span className="tabular-nums">{(q.tier * 150).toLocaleString()} XP</span>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        </div>
      )}
    </div>
  );
}
