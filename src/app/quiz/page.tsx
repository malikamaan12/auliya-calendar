"use client";

import React, { useEffect, useState } from "react";
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
} from "lucide-react";
import { QUIZ_BANK, QuizQuestion, TIER_REWARDS } from "@/data/quiz";
import { useApp } from "@/lib/store";

export default function QuizPage() {
  const { addIlmPoints, ilmPoints, bestQuizTier } = useApp();

  const [tierIdx, setTierIdx] = useState(0); // 0..14
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [awaitingFinalConfirm, setAwaitingFinalConfirm] = useState(false);
  const [outcome, setOutcome] = useState<"playing" | "correct" | "wrong" | "won">("playing");
  const [eliminatedOpts, setEliminatedOpts] = useState<number[]>([]);
  const [showIshara, setShowIshara] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [swappedQuestion, setSwappedQuestion] = useState<QuizQuestion | null>(null);

  const [usedLifelines, setUsedLifelines] = useState({
    nisf: false,
    ishara: false,
    poll: false,
    tabdeeli: false,
  });

  const baseQuestion = QUIZ_BANK[tierIdx];
  const question = swappedQuestion || baseQuestion;

  // Countdown: 30s (Tiers 1-5), 45s (Tiers 6-10), untimed (Tiers 11-15)
  const [secondsLeft, setSecondsLeft] = useState<number | null>(30);

  useEffect(() => {
    if (outcome !== "playing" || secondsLeft === null || secondsLeft <= 0) return;
    const id = setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setOutcome("wrong");
      } else {
        setSecondsLeft((s) => (s !== null ? s - 1 : null));
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [secondsLeft, outcome]);

  const handleOptionClick = (idx: number) => {
    if (outcome !== "playing" || eliminatedOpts.includes(idx)) return;
    setSelectedOpt(idx);

    // Tiers 6+ require "Final Answer?" confirmation per PRD Section 3 Module 8
    if (tierIdx >= 5) {
      setAwaitingFinalConfirm(true);
    } else {
      evaluateAnswer(idx);
    }
  };

  const evaluateAnswer = (idx: number) => {
    setAwaitingFinalConfirm(false);
    if (idx === question.correctIdx) {
      const reward = TIER_REWARDS[tierIdx];
      addIlmPoints(reward, tierIdx + 1);
      if (tierIdx === 14) {
        setOutcome("won");
      } else {
        setOutcome("correct");
      }
    } else {
      setOutcome("wrong");
    }
  };

  const nextTier = () => {
    const next = Math.min(14, tierIdx + 1);
    setTierIdx(next);
    setSecondsLeft(next < 5 ? 30 : next < 10 ? 45 : null);
    setSelectedOpt(null);
    setAwaitingFinalConfirm(false);
    setOutcome("playing");
    setEliminatedOpts([]);
    setShowIshara(false);
    setShowPoll(false);
    setSwappedQuestion(null);
  };

  const restartGame = () => {
    setTierIdx(0);
    setSecondsLeft(30);
    setSelectedOpt(null);
    setAwaitingFinalConfirm(false);
    setOutcome("playing");
    setEliminatedOpts([]);
    setShowIshara(false);
    setShowPoll(false);
    setSwappedQuestion(null);
    setUsedLifelines({ nisf: false, ishara: false, poll: false, tabdeeli: false });
  };

  const useNisf = () => {
    if (usedLifelines.nisf || outcome !== "playing") return;
    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== question.correctIdx);
    setEliminatedOpts(wrongIndices.slice(0, 2));
    setUsedLifelines((u) => ({ ...u, nisf: true }));
  };

  const useIshara = () => {
    if (usedLifelines.ishara || outcome !== "playing") return;
    setShowIshara(true);
    setUsedLifelines((u) => ({ ...u, ishara: true }));
  };

  const usePoll = () => {
    if (usedLifelines.poll || outcome !== "playing") return;
    setShowPoll(true);
    setUsedLifelines((u) => ({ ...u, poll: true }));
  };

  const useTabdeeli = () => {
    if (usedLifelines.tabdeeli || outcome !== "playing") return;
    const alt = QUIZ_BANK.find((q) => q.id !== question.id && q.category === question.category) || QUIZ_BANK[(tierIdx + 3) % QUIZ_BANK.length];
    setSwappedQuestion(alt);
    setEliminatedOpts([]);
    setSelectedOpt(null);
    setAwaitingFinalConfirm(false);
    setUsedLifelines((u) => ({ ...u, tabdeeli: true }));
  };

  return (
    <div className="space-y-6">
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
        <div className="flex items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-xl border font-bold tabular-nums" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}>
            Total Ilm XP: {ilmPoints.toLocaleString()}
          </span>
          <span className="px-3 py-1.5 rounded-xl border font-semibold" style={{ borderColor: "var(--border-hairline)" }}>
            Best Tier: {bestQuizTier}/15
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Main Arena */}
        <section className="lg:col-span-8 bento-card p-6 space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold text-white" style={{ backgroundColor: "var(--accent-primary)" }}>
                Tier {tierIdx + 1} / 15 • {TIER_REWARDS[tierIdx].toLocaleString()} Ilm XP
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full border" style={{ borderColor: "var(--border-hairline)" }}>
                {question.category}
              </span>
            </div>

            <div className="text-xs font-bold tabular-nums inline-flex items-center gap-1.5" style={{ color: secondsLeft !== null && secondsLeft <= 8 ? "#F87171" : "var(--accent-secondary)" }}>
              <Clock className="w-3.5 h-3.5" />
              <span>{secondsLeft !== null ? `${secondsLeft}s` : "Untimed Contemplation"}</span>
            </div>
          </div>

          {/* 4 Lifelines */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
            <button
              type="button"
              disabled={usedLifelines.nisf}
              onClick={useNisf}
              className="p-2.5 rounded-xl border font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Split className="w-3.5 h-3.5" />
              <span>50:50 (Nisf)</span>
            </button>
            <button
              type="button"
              disabled={usedLifelines.ishara}
              onClick={useIshara}
              className="p-2.5 rounded-xl border font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Lightbulb className="w-3.5 h-3.5" />
              <span>Scholar&apos;s Ishara</span>
            </button>
            <button
              type="button"
              disabled={usedLifelines.poll}
              onClick={usePoll}
              className="p-2.5 rounded-xl border font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer disabled:opacity-40"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Ijma&apos; Poll</span>
            </button>
            <button
              type="button"
              disabled={usedLifelines.tabdeeli}
              onClick={useTabdeeli}
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
            <div className="p-3 rounded-xl border text-xs grid grid-cols-4 gap-2" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
              {question.communityPoll.map((pct, i) => (
                <div key={i} className="text-center">
                  <div className="font-bold">{String.fromCharCode(65 + i)}</div>
                  <div className="tabular-nums" style={{ color: "var(--accent-secondary)" }}>{pct}%</div>
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
              if (outcome !== "playing") {
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
                  className="p-4 rounded-2xl border text-start text-sm font-medium flex items-center gap-3 cursor-pointer disabled:opacity-25"
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
            <div className="p-4 rounded-2xl border flex items-center justify-between gap-3" style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}>
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

          {/* Learn Why Proof Card */}
          {outcome !== "playing" && (
            <div className="p-5 rounded-2xl border space-y-3" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
              <div className="flex items-center gap-2 font-bold text-sm">
                {outcome === "wrong" ? (
                  <>
                    <XCircle className="w-5 h-5 text-red-400" />
                    <span>Incorrect — Safe Checkpoint Retained!</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                    <span>
                      {outcome === "won"
                        ? "MashaAllah! 15/15 Sahib-e-Ilm Grand Crown Achieved!"
                        : `Correct! +${TIER_REWARDS[tierIdx].toLocaleString()} Ilm XP`}
                    </span>
                  </>
                )}
              </div>
              <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                <strong>Learn Why (Proof Card):</strong> {question.proofExplanation}
              </p>
              <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                <Link
                  href={question.proofLink}
                  className="text-xs font-semibold inline-flex items-center gap-1"
                  style={{ color: "var(--accent-secondary)" }}
                >
                  <span>{question.proofLinkLabel}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>

                {outcome === "correct" ? (
                  <button
                    type="button"
                    onClick={nextTier}
                    className="px-4 py-2 rounded-xl text-xs font-semibold text-white cursor-pointer inline-flex items-center gap-1.5"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Proceed to Tier {tierIdx + 2}</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={restartGame}
                    className="px-4 py-2 rounded-xl text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Play Again</span>
                  </button>
                )}
              </div>
            </div>
          )}
        </section>

        {/* 15-Tier Ladder Sidebar */}
        <aside className="lg:col-span-4 bento-card p-5 space-y-2">
          <h2 className="text-sm font-bold mb-2">Sahib-e-Ilm 15-Tier Ladder</h2>
          <div className="space-y-1 flex flex-col-reverse">
            {TIER_REWARDS.map((pts, i) => {
              const isSafe = i === 4 || i === 9 || i === 14;
              const isCurrent = i === tierIdx;
              const isPassed = i < tierIdx;
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
        </aside>
      </div>
    </div>
  );
}
