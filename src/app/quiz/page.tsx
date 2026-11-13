"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Trophy,
  Sparkles,
  CheckCircle2,
  XCircle,
  RotateCcw,
  Users,
  Lightbulb,
  Shuffle,
  Split,
  ArrowRight,
  Clock,
  ShieldCheck,
  Volume2,
  VolumeX,
  LogOut,
  Award,
} from "lucide-react";
import { QUIZ_BANK, QUIZ_CATEGORIES, QuizQuestion, SAFE_TIERS, TIER_REWARDS } from "@/data/quiz";
import { useApp } from "@/lib/store";

type CategoryFilter = "all" | QuizQuestion["category"];

function playQuizTone(kind: "correct" | "wrong" | "lock" | "win", muted: boolean) {
  if (muted) return;
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const seq =
      kind === "win"
        ? [523.25, 659.25, 783.99, 1046.5]
        : kind === "correct"
        ? [523.25, 659.25]
        : kind === "lock"
        ? [440]
        : [260, 210];
    seq.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = kind === "wrong" ? "triangle" : "sine";
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + i * 0.11;
      gain.gain.setValueAtTime(0.001, t0);
      gain.gain.exponentialRampToValueAtTime(0.14, t0 + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.35);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 0.38);
    });
    setTimeout(() => ctx.close().catch(() => undefined), 1200);
  } catch {
    // ignore WebAudio restrictions
  }
}

/** Build a 15-question ladder (or category drill) picking a fresh variant per tier. */
function buildRunDeck(category: CategoryFilter): QuizQuestion[] {
  if (category === "all") {
    return Array.from({ length: 15 }, (_, idx) => {
      const tierNum = idx + 1;
      const pool = QUIZ_BANK.filter((q) => q.tier === tierNum);
      return pool[Math.floor(Math.random() * pool.length)] || QUIZ_BANK[idx % QUIZ_BANK.length];
    });
  }
  const catPool = QUIZ_BANK.filter((q) => q.category === category);
  return catPool.sort((a, b) => a.tier - b.tier);
}

export default function QuizPage() {
  const { addIlmPoints, ilmPoints, bestQuizTier } = useApp();

  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [deck, setDeck] = useState<QuizQuestion[]>(() => buildRunDeck("all"));
  const [tierIdx, setTierIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [awaitingFinalConfirm, setAwaitingFinalConfirm] = useState(false);
  const [outcome, setOutcome] = useState<"playing" | "correct" | "wrong" | "won" | "walked">("playing");
  const [eliminatedOpts, setEliminatedOpts] = useState<number[]>([]);
  const [showIshara, setShowIshara] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [swappedQuestion, setSwappedQuestion] = useState<QuizQuestion | null>(null);
  const [muted, setMuted] = useState(false);

  // Real Safe-Checkpoint tracking
  const [runXp, setRunXp] = useState(0);
  const [safeXp, setSafeXp] = useState(0);
  const [bankedXp, setBankedXp] = useState<number | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);

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

  // Countdown: 30s (Steps 1-5), 45s (Steps 6-10), untimed (Steps 11+)
  const totalSeconds = tierIdx < 5 ? 30 : tierIdx < 10 ? 45 : null;
  const [secondsLeft, setSecondsLeft] = useState<number | null>(30);

  const commitPoints = useCallback(
    (pts: number, achievedTier?: number) => {
      if (pts > 0) addIlmPoints(pts, achievedTier);
      setBankedXp(pts);
    },
    [addIlmPoints]
  );

  useEffect(() => {
    if (outcome !== "playing" || secondsLeft === null || secondsLeft <= 0) return;
    const id = setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setOutcome("wrong");
        playQuizTone("wrong", muted);
        commitPoints(safeXp, tierIdx > 0 ? tierIdx : undefined);
      } else {
        setSecondsLeft((s) => (s !== null ? s - 1 : null));
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, outcome, muted, safeXp, tierIdx, commitPoints]);

  const evaluateAnswer = useCallback(
    (idx: number) => {
      setAwaitingFinalConfirm(false);
      if (idx === question.correctIdx) {
        const nextAnswered = answeredCount + 1;
        setAnsweredCount(nextAnswered);
        if (isLadder) {
          const earned = TIER_REWARDS[tierIdx];
          setRunXp(earned);
          if (SAFE_TIERS.includes(tierIdx)) {
            setSafeXp(earned);
          }
          if (tierIdx === totalSteps - 1) {
            setOutcome("won");
            playQuizTone("win", muted);
            commitPoints(earned, 15);
          } else {
            setOutcome("correct");
            playQuizTone("correct", muted);
          }
        } else {
          const earned = runXp + stepReward;
          setRunXp(earned);
          setSafeXp(earned);
          if (tierIdx === totalSteps - 1) {
            setOutcome("won");
            playQuizTone("win", muted);
            commitPoints(earned);
          } else {
            setOutcome("correct");
            playQuizTone("correct", muted);
          }
        }
      } else {
        setOutcome("wrong");
        playQuizTone("wrong", muted);
        commitPoints(safeXp, isLadder && tierIdx > 0 ? tierIdx : undefined);
      }
    },
    [question.correctIdx, answeredCount, isLadder, tierIdx, totalSteps, muted, commitPoints, runXp, stepReward, safeXp]
  );

  const handleOptionClick = useCallback(
    (idx: number) => {
      if (outcome !== "playing" || eliminatedOpts.includes(idx)) return;
      setSelectedOpt(idx);
      if (isLadder && tierIdx >= 5) {
        setAwaitingFinalConfirm(true);
        playQuizTone("lock", muted);
      } else {
        evaluateAnswer(idx);
      }
    },
    [outcome, eliminatedOpts, isLadder, tierIdx, muted, evaluateAnswer]
  );

  const nextTier = useCallback(() => {
    const next = Math.min(totalSteps - 1, tierIdx + 1);
    setTierIdx(next);
    setSecondsLeft(next < 5 ? 30 : next < 10 ? 45 : null);
    setSelectedOpt(null);
    setAwaitingFinalConfirm(false);
    setOutcome("playing");
    setEliminatedOpts([]);
    setShowIshara(false);
    setShowPoll(false);
    setSwappedQuestion(null);
  }, [totalSteps, tierIdx]);

  const startNewRun = useCallback((cat: CategoryFilter) => {
    setCategoryFilter(cat);
    const nextDeck = buildRunDeck(cat);
    setDeck(nextDeck);
    setTierIdx(0);
    setSecondsLeft(30);
    setSelectedOpt(null);
    setAwaitingFinalConfirm(false);
    setOutcome("playing");
    setEliminatedOpts([]);
    setShowIshara(false);
    setShowPoll(false);
    setSwappedQuestion(null);
    setRunXp(0);
    setSafeXp(0);
    setBankedXp(null);
    setAnsweredCount(0);
    setUsedLifelines({ nisf: false, ishara: false, poll: false, tabdeeli: false });
  }, []);

  const walkAway = () => {
    if (runXp <= 0 || outcome === "won" || outcome === "wrong" || outcome === "walked") return;
    setOutcome("walked");
    playQuizTone("win", muted);
    commitPoints(runXp, isLadder ? tierIdx + (outcome === "correct" ? 1 : 0) : undefined);
  };

  const triggerNisf = () => {
    if (usedLifelines.nisf || outcome !== "playing") return;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== question.correctIdx);
    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    setEliminatedOpts(shuffled.slice(0, 2));
    setUsedLifelines((u) => ({ ...u, nisf: true }));
  };

  const triggerIshara = useCallback(() => {
    if (usedLifelines.ishara || outcome !== "playing") return;
    setShowIshara(true);
    setUsedLifelines((u) => ({ ...u, ishara: true }));
  }, [usedLifelines.ishara, outcome]);

  const triggerPoll = () => {
    if (usedLifelines.poll || outcome !== "playing") return;
    setShowPoll(true);
    setUsedLifelines((u) => ({ ...u, poll: true }));
  };

  const triggerTabdeeli = () => {
    if (usedLifelines.tabdeeli || outcome !== "playing") return;
    const sameTierAlt = QUIZ_BANK.find(
      (q) => q.id !== question.id && q.tier === question.tier
    );
    const sameCatAlt = QUIZ_BANK.find(
      (q) => q.id !== question.id && q.category === question.category && !deck.some((d) => d.id === q.id)
    );
    const fallback = QUIZ_BANK.find((q) => q.id !== question.id) || QUIZ_BANK[0];
    setSwappedQuestion(sameTierAlt || sameCatAlt || fallback);
    setEliminatedOpts([]);
    setSelectedOpt(null);
    setAwaitingFinalConfirm(false);
    setUsedLifelines((u) => ({ ...u, tabdeeli: true }));
  };

  // Keyboard shortcuts (A-D / 1-4, Enter, H)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const k = e.key.toLowerCase();
      if (outcome === "playing") {
        if (k === "1" || k === "a") handleOptionClick(0);
        else if (k === "2" || k === "b") handleOptionClick(1);
        else if (k === "3" || k === "c") handleOptionClick(2);
        else if (k === "4" || k === "d") handleOptionClick(3);
        else if (k === "h") triggerIshara();
        else if (k === "enter" && awaitingFinalConfirm && selectedOpt !== null) evaluateAnswer(selectedOpt);
      } else if (outcome === "correct" && k === "enter") {
        nextTier();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [outcome, awaitingFinalConfirm, selectedOpt, handleOptionClick, evaluateAnswer, nextTier, triggerIshara]);

  const timerPct = useMemo(() => {
    if (secondsLeft === null || totalSeconds === null) return 100;
    return Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  }, [secondsLeft, totalSeconds]);

  const lifelinesRemaining = Object.values(usedLifelines).filter((v) => !v).length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-gold)" }}>
            <Trophy className="w-3.5 h-3.5" />
            <span>15-Tier Sahib-e-Ilm Ladder • Halal Non-Monetary Gamification</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Sahib-e-Ilm Sunni Trivia
          </h1>
        </div>
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setMuted((m) => !m)}
            aria-label={muted ? "Unmute quiz chimes" : "Mute quiz chimes"}
            className="p-2 rounded-xl border cursor-pointer"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            {muted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />}
          </button>
          <span className="px-3 py-1.5 rounded-xl border font-bold tabular-nums" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}>
            Total Ilm XP: {ilmPoints.toLocaleString()}
          </span>
          <span className="px-3 py-1.5 rounded-xl border font-semibold" style={{ borderColor: "var(--border-hairline)" }}>
            Best Tier: {bestQuizTier}/15
          </span>
        </div>
      </div>

      {/* Mode / Category Selector */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <button
          type="button"
          onClick={() => startNewRun("all")}
          className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
          style={{
            borderColor: categoryFilter === "all" ? "var(--accent-primary)" : "var(--border-hairline)",
            backgroundColor: categoryFilter === "all" ? "var(--accent-soft)" : "var(--bg-muted)",
            color: categoryFilter === "all" ? "var(--accent-primary)" : "var(--text-muted)",
          }}
        >
          15-Tier Grand Ladder
        </button>
        {QUIZ_CATEGORIES.map((cat) => {
          const active = categoryFilter === cat;
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

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Arena */}
        <section className="lg:col-span-8 bento-card p-5 sm:p-6 space-y-5">
          {/* Step + Timer + Run XP */}
          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "var(--accent-primary)" }}>
                  {isLadder ? `Tier ${tierIdx + 1} / 15` : `Q ${tierIdx + 1} / ${totalSteps}`} • {stepReward.toLocaleString()} XP
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: "var(--border-hairline)" }}>
                  {question.category}
                </span>
                {safeXp > 0 && (
                  <span
                    className="text-[11px] px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1"
                    style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Safe: {safeXp.toLocaleString()} XP
                  </span>
                )}
              </div>

              <div className="flex items-center gap-3">
                {runXp > 0 && (outcome === "playing" || outcome === "correct") && (
                  <button
                    type="button"
                    onClick={walkAway}
                    className="px-2.5 py-1 rounded-xl border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer hover:opacity-90"
                    style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
                    title="End run now and bank your current XP"
                  >
                    <LogOut className="w-3 h-3" />
                    <span>Claim {runXp.toLocaleString()} XP</span>
                  </button>
                )}
                <div
                  className="text-xs font-bold tabular-nums inline-flex items-center gap-1.5"
                  style={{ color: secondsLeft !== null && secondsLeft <= 8 ? "#F87171" : "var(--accent-secondary)" }}
                >
                  <Clock className="w-3.5 h-3.5" />
                  <span>{secondsLeft !== null ? `${secondsLeft}s` : "Untimed"}</span>
                </div>
              </div>
            </div>

            {/* Smooth Timer Progress Bar */}
            {secondsLeft !== null && (
              <div className="w-full h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-muted)" }}>
                <div
                  className="h-full rounded-full transition-all duration-1000 ease-linear"
                  style={{
                    width: `${timerPct}%`,
                    backgroundColor: secondsLeft <= 8 ? "#EF4444" : "var(--accent-secondary)",
                  }}
                />
              </div>
            )}
          </div>

          {/* 4 Lifelines */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              disabled={usedLifelines.nisf || outcome !== "playing"}
              onClick={triggerNisf}
              className="p-2.5 rounded-xl border font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Split className="w-3.5 h-3.5" />
              <span>50:50 (Nisf)</span>
            </button>
            <button
              type="button"
              disabled={usedLifelines.ishara || outcome !== "playing"}
              onClick={triggerIshara}
              className="p-2.5 rounded-xl border font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Scholar&apos;s Ishara</span>
            </button>
            <button
              type="button"
              disabled={usedLifelines.poll || outcome !== "playing"}
              onClick={triggerPoll}
              className="p-2.5 rounded-xl border font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Ijma&apos; Poll</span>
            </button>
            <button
              type="button"
              disabled={usedLifelines.tabdeeli || outcome !== "playing"}
              onClick={triggerTabdeeli}
              className="p-2.5 rounded-xl border font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Shuffle className="w-3.5 h-3.5" />
              <span>Tabdeeli</span>
            </button>
          </div>

          {/* Question */}
          <h2 className="text-lg sm:text-xl font-bold leading-snug">{question.question}</h2>

          {showIshara && (
            <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}>
              <strong>Scholar&apos;s Clue (Ishara):</strong> {question.isharaHint}
            </div>
          )}

          {showPoll && (
            <div className="p-3.5 rounded-xl border text-xs grid grid-cols-2 sm:grid-cols-4 gap-3" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
              {question.communityPoll.map((pct, i) => (
                <div key={i} className="space-y-1">
                  <div className="flex items-center justify-between font-bold">
                    <span>Option {String.fromCharCode(65 + i)}</span>
                    <span className="tabular-nums" style={{ color: "var(--accent-secondary)" }}>{pct}%</span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-black/20">
                    <div className="h-full rounded-full" style={{ width: `${pct}%`, backgroundColor: "var(--accent-secondary)" }} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              const isElim = eliminatedOpts.includes(idx);
              const isSel = selectedOpt === idx;
              const isCorr = idx === question.correctIdx;

              let borderCol = "var(--border-hairline)";
              let bgCol = "var(--bg-muted)";
              if (outcome !== "playing" && outcome !== "walked") {
                if (isCorr) {
                  borderCol = "#10B981";
                  bgCol = "rgba(16,185,129,0.16)";
                } else if (isSel) {
                  borderCol = "#EF4444";
                  bgCol = "rgba(239,68,68,0.16)";
                }
              } else if (isSel) {
                borderCol = "var(--accent-gold)";
                bgCol = "var(--gold-soft)";
              }

              return (
                <motion.button
                  key={idx}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  disabled={isElim || outcome !== "playing"}
                  onClick={() => handleOptionClick(idx)}
                  className="p-4 rounded-2xl border text-start text-sm font-medium flex items-center gap-3 cursor-pointer disabled:opacity-25 hover:brightness-105 transition-all"
                  style={{ borderColor: borderCol, backgroundColor: bgCol }}
                >
                  <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 border" style={{ borderColor: "var(--border-hairline)" }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <span>{opt}</span>
                </motion.button>
              );
            })}
          </div>

          {awaitingFinalConfirm && selectedOpt !== null && (
            <div className="p-4 rounded-2xl border flex flex-wrap items-center justify-between gap-3" style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}>
              <span className="text-xs font-semibold">
                Tier {tierIdx + 1} Lock-In: Is Option {String.fromCharCode(65 + selectedOpt)} your Final Answer?
              </span>
              <button
                type="button"
                onClick={() => evaluateAnswer(selectedOpt)}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-amber-500 text-black cursor-pointer"
              >
                Lock In Final Answer
              </button>
            </div>
          )}

          {/* Learn Why Proof Card / Run Summary */}
          {outcome !== "playing" && (
            <div className="p-5 rounded-2xl border space-y-3" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2 font-bold text-sm">
                  {outcome === "wrong" ? (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span>
                        {secondsLeft === 0 ? "Time Up" : "Incorrect"} — Banked {bankedXp?.toLocaleString() ?? 0} Safe XP
                      </span>
                    </>
                  ) : outcome === "walked" ? (
                    <>
                      <Award className="w-5 h-5 text-amber-400" />
                      <span>Run Claimed! +{bankedXp?.toLocaleString() ?? 0} Ilm XP Banked</span>
                    </>
                  ) : outcome === "won" ? (
                    <>
                      <Trophy className="w-5 h-5 text-amber-400" />
                      <span>MashaAllah! Sahib-e-Ilm Crown Achieved (+{bankedXp?.toLocaleString() ?? 0} XP)!</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>Correct! Ladder at {runXp.toLocaleString()} Ilm XP</span>
                    </>
                  )}
                </div>

                {(outcome === "won" || outcome === "walked" || outcome === "wrong") && (
                  <span className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                    {answeredCount} correct • {lifelinesRemaining}/4 lifelines unused
                  </span>
                )}
              </div>

              {outcome !== "walked" && (
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  <strong>Learn Why (Proof Card):</strong> {question.proofExplanation}
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
                    <span>Proceed to {isLadder ? `Tier ${tierIdx + 2}` : `Question ${tierIdx + 2}`}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={() => startNewRun(categoryFilter)}
                    className="btn-primary px-4 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>New Run (Fresh Questions)</span>
                  </button>
                )}
              </div>
            </div>
          )}

          <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Tip: Use keys <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "var(--border-hairline)" }}>A</kbd>–
            <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "var(--border-hairline)" }}>D</kbd> to answer,{" "}
            <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "var(--border-hairline)" }}>H</kbd> for Ishara,{" "}
            <kbd className="px-1 py-0.5 rounded border" style={{ borderColor: "var(--border-hairline)" }}>Enter</kbd> to advance.
          </p>
        </section>

        {/* 15-Tier Ladder Sidebar */}
        <aside className="lg:col-span-4 bento-card p-5 space-y-2">
          <h2 className="text-sm font-bold mb-2">
            {isLadder ? "Sahib-e-Ilm 15-Tier Ladder" : `${categoryFilter} Drill (${totalSteps} Qs)`}
          </h2>
          {isLadder ? (
            <div className="space-y-1 flex flex-col-reverse">
              {TIER_REWARDS.map((pts, i) => {
                const isSafe = SAFE_TIERS.includes(i);
                const isCurrent = i === tierIdx;
                const isPassed = i < tierIdx || (i === tierIdx && (outcome === "correct" || outcome === "won"));
                return (
                  <div
                    key={i}
                    className="px-3 py-1.5 rounded-xl text-xs flex items-center justify-between border"
                    style={{
                      borderColor: isCurrent ? "var(--accent-gold)" : "transparent",
                      backgroundColor: isCurrent
                        ? "var(--gold-soft)"
                        : isPassed
                        ? "var(--accent-soft)"
                        : "transparent",
                      color: isSafe ? "var(--accent-gold)" : isPassed ? "var(--accent-primary)" : "var(--text-muted)",
                      fontWeight: isCurrent || isSafe ? 700 : 500,
                    }}
                  >
                    <span>
                      Tier {i + 1} {isSafe ? "★ Safe" : ""}
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
                    <span>Question {i + 1} (Tier {q.tier})</span>
                    <span className="tabular-nums">{(q.tier * 150).toLocaleString()} XP</span>
                  </div>
                );
              })}
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
