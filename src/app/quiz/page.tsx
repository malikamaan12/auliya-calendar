"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import {
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
  MicOff,
  Flame,
  Crown,
  Medal,
  Clock,
  Layers,
  Radio,
  ShieldAlert,
  BookOpen,
} from "lucide-react";
import {
  buildRandomizedDeck,
  FastestFingerChallenge,
  pickAlternateQuestionForTier,
  pickRandomFastestFinger,
  QUIZ_BANK,
  QUIZ_CATEGORIES,
  QuizCategory,
  QuizQuestion,
  SAFE_TIERS,
  TIER_REWARDS,
  TIER_TITLES,
} from "@/data/quiz";
import {
  DEFAULT_VAULT_PROFILE,
  getIlmRank,
  HotSeatDrone,
  loadQuizVault,
  playQuizSfx,
  QUIZ_MEDALS,
  QuizVaultProfile,
  saveQuizVault,
  speakHostLine,
} from "@/lib/quiz-fx";
import {
  FloatingToastItem,
  FloatingXpBursts,
  KbcStudioBeams,
  ParticleBurstKind,
  QuizConfettiCanvas,
  SanadCertificateModal,
  StageMood,
} from "@/components/QuizStageFx";
import { useApp } from "@/lib/store";

type CategoryFilter = "all" | QuizCategory;
type RunFormat = "ladder15" | "blitz20";

export default function QuizPage() {
  const { addIlmPoints, ilmPoints, bestQuizTier, user } = useApp();

  // Persistent Gamification Vault (seen questions, mastered questions, medals, history)
  const [vault, setVault] = useState<QuizVaultProfile>(DEFAULT_VAULT_PROFILE);
  const [vaultHydrated, setVaultHydrated] = useState(false);

  // Audio & Broadcast FX toggles
  const [muted, setMuted] = useState(false);
  const [droneOn, setDroneOn] = useState(false);
  const [hostVoiceOn, setHostVoiceOn] = useState(false);
  const [dramaticMode, setDramaticMode] = useState(true);
  const droneRef = useRef<HotSeatDrone | null>(null);

  // Game Mode & Deck State
  const [categoryFilter, setCategoryFilter] = useState<CategoryFilter>("all");
  const [runFormat, setRunFormat] = useState<RunFormat>("ladder15");
  const [deck, setDeck] = useState<QuizQuestion[]>(() =>
    buildRandomizedDeck("all", [], "ladder15")
  );
  const [tierIdx, setTierIdx] = useState(0);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [isLocking, setIsLocking] = useState(false);
  const [outcome, setOutcome] = useState<
    "playing" | "correct" | "wrong" | "won" | "walked"
  >("playing");

  // Lifelines & Power-Ups State
  const [eliminatedOpts, setEliminatedOpts] = useState<number[]>([]);
  const [showIshara, setShowIshara] = useState(false);
  const [isharaRinging, setIsharaRinging] = useState(false);
  const [showPoll, setShowPoll] = useState(false);
  const [swappedQuestion, setSwappedQuestion] = useState<QuizQuestion | null>(null);
  const [doubleDipUnlocked, setDoubleDipUnlocked] = useState(false);
  const [doubleDipActive, setDoubleDipActive] = useState(false);
  const [doubleDipSecondChance, setDoubleDipSecondChance] = useState(false);
  const [timeBoostAvailable, setTimeBoostAvailable] = useState(false);
  const [timeBoostUsed, setTimeBoostUsed] = useState(false);

  const [usedLifelines, setUsedLifelines] = useState({
    nisf: false,
    ishara: false,
    poll: false,
    tabdeeli: false,
    doubleDip: false,
  });

  // Streak, Speed Bonus & Visual FX State
  const [streak, setStreak] = useState(0);
  const [peakStreak, setPeakStreak] = useState(0);
  const [runXp, setRunXp] = useState(0);
  const [speedBonusTotal, setSpeedBonusTotal] = useState(0);
  const [safeXp, setSafeXp] = useState(0);
  const [bankedXp, setBankedXp] = useState<number | null>(null);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [copiedScore, setCopiedScore] = useState(false);

  const [burstKind, setBurstKind] = useState<ParticleBurstKind>("none");
  const [burstId, setBurstId] = useState(0);
  const [toasts, setToasts] = useState<FloatingToastItem[]>([]);
  const [shakeKey, setShakeKey] = useState(0);
  const [sanadOpen, setSanadOpen] = useState(false);
  const [vaultDrawerOpen, setVaultDrawerOpen] = useState(false);

  // Fastest Finger First State
  const [fffOpen, setFffOpen] = useState(false);
  const [fffChallenge, setFffChallenge] = useState<FastestFingerChallenge>(() =>
    pickRandomFastestFinger()
  );
  const [fffPickOrder, setFffPickOrder] = useState<number[]>([]);
  const [fffTimeLeft, setFffTimeLeft] = useState(25);
  const [fffStatus, setFffStatus] = useState<"playing" | "won" | "lost">("playing");

  const lockTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Hydrate Vault from localStorage and deal an unseen-prioritized randomized deck
  useEffect(() => {
    const loaded = loadQuizVault();
    Promise.resolve().then(() => {
      setVault(loaded);
      setVaultHydrated(true);
      setDeck(buildRandomizedDeck("all", loaded.seenQuestionIds, "ladder15"));
    });
  }, []);

  // Manage Studio Tension Drone
  useEffect(() => {
    if (!droneRef.current) droneRef.current = new HotSeatDrone();
    const shouldPlay =
      droneOn && !muted && !fffOpen && outcome === "playing" && !isLocking;
    if (shouldPlay) {
      droneRef.current.start();
    } else {
      droneRef.current.stop();
    }
    return () => {
      droneRef.current?.stop();
    };
  }, [droneOn, muted, fffOpen, outcome, isLocking]);

  const pushToast = useCallback(
    (label: string, sublabel?: string, tone: FloatingToastItem["tone"] = "gold") => {
      const id = Date.now() + Math.floor(Math.random() * 10000);
      setToasts((prev) => [...prev.slice(-3), { id, label, sublabel, tone }]);
      setTimeout(() => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
      }, 2800);
    },
    []
  );

  const fireConfetti = useCallback((kind: ParticleBurstKind) => {
    setBurstKind(kind);
    setBurstId((n) => n + 1);
  }, []);

  const isLadder = runFormat === "ladder15";
  const totalSteps = deck.length;
  const question = swappedQuestion || deck[tierIdx] || QUIZ_BANK[0];
  const stepReward = isLadder
    ? TIER_REWARDS[Math.min(tierIdx, TIER_REWARDS.length - 1)]
    : (question.tier || 1) * 200;

  const getClockForStep = useCallback(
    (idx: number, fmt: RunFormat): number | null => {
      if (fmt === "blitz20") return 22;
      if (idx < 5) return 30;
      if (idx < 10) return 45;
      return null; // Unlimited contemplation on Tiers 11–15
    },
    []
  );

  const totalSeconds = getClockForStep(tierIdx, runFormat);
  const [secondsLeft, setSecondsLeft] = useState<number | null>(30);

  // Record current question as "seen" in Vault so future runs pick fresh questions
  useEffect(() => {
    if (!vaultHydrated || !question.id) return;
    const qid = question.id;
    Promise.resolve().then(() => {
      setVault((prev) => {
        if (prev.seenQuestionIds.includes(qid)) return prev;
        const nextSeen = [...prev.seenQuestionIds, qid].slice(-280);
        const updated = { ...prev, seenQuestionIds: nextSeen };
        saveQuizVault(updated);
        return updated;
      });
    });
  }, [question.id, vaultHydrated]);

  const updateVaultEndOfRun = useCallback(
    (
      finalOutcome: "won" | "walked" | "wrong",
      finalXp: number,
      achievedSteps: number,
      maxRunStreak: number,
      extraMedals: string[] = []
    ) => {
      setVault((prev) => {
        const medalSet = new Set([...prev.unlockedMedals, ...extraMedals]);
        if (finalOutcome === "won" && isLadder) medalSet.add("grand-crown");
        if (prev.masteredQuestionIds.length >= 50) medalSet.add("vault-50");

        const entry = {
          id: `run-${Date.now()}`,
          date: new Date().toLocaleDateString(),
          mode:
            categoryFilter === "all"
              ? isLadder
                ? "15-Tier KBC Ladder"
                : "20-Q Rapid Blitz"
              : `${categoryFilter}`,
          tierReached: achievedSteps,
          totalSteps,
          xpEarned: finalXp,
          maxStreak: maxRunStreak,
          outcome: finalOutcome,
        };

        const updated: QuizVaultProfile = {
          ...prev,
          unlockedMedals: Array.from(medalSet),
          gamesPlayed: prev.gamesPlayed + 1,
          crownsWon:
            prev.crownsWon + (finalOutcome === "won" && isLadder ? 1 : 0),
          bestStreak: Math.max(prev.bestStreak, maxRunStreak),
          recentRuns: [entry, ...prev.recentRuns].slice(0, 8),
        };
        saveQuizVault(updated);
        return updated;
      });
    },
    [categoryFilter, isLadder, totalSteps]
  );

  const commitPoints = useCallback(
    (
      pts: number,
      finalOutcome: "won" | "walked" | "wrong",
      achievedTier?: number,
      maxRunStreak = peakStreak,
      extraMedals: string[] = []
    ) => {
      const totalAward = pts + speedBonusTotal;
      if (totalAward > 0) addIlmPoints(totalAward, achievedTier);
      setBankedXp(totalAward);
      updateVaultEndOfRun(
        finalOutcome,
        totalAward,
        answeredCount + (finalOutcome === "won" ? 1 : 0),
        maxRunStreak,
        extraMedals
      );
    },
    [addIlmPoints, speedBonusTotal, peakStreak, updateVaultEndOfRun, answeredCount]
  );

  // Main Hot-Seat Countdown Clock + Heartbeat FX
  useEffect(() => {
    if (
      fffOpen ||
      isLocking ||
      outcome !== "playing" ||
      secondsLeft === null ||
      secondsLeft <= 0
    ) {
      return;
    }
    const id = setTimeout(() => {
      if (secondsLeft <= 1) {
        setSecondsLeft(0);
        setStreak(0);
        setOutcome("wrong");
        setShakeKey((k) => k + 1);
        playQuizSfx("wrong", muted);
        commitPoints(
          safeXp,
          "wrong",
          isLadder && tierIdx > 0 ? tierIdx : undefined
        );
      } else {
        const next = secondsLeft - 1;
        setSecondsLeft(next);
        if (next <= 8) {
          playQuizSfx("heartbeat", muted);
        } else if (next <= 12) {
          playQuizSfx("tick", muted);
        }
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [
    fffOpen,
    isLocking,
    secondsLeft,
    outcome,
    muted,
    safeXp,
    isLadder,
    tierIdx,
    commitPoints,
  ]);

  // Fastest Finger First Clock
  useEffect(() => {
    if (!fffOpen || fffStatus !== "playing" || fffTimeLeft <= 0) return;
    const id = setTimeout(() => {
      if (fffTimeLeft <= 1) {
        setFffTimeLeft(0);
        setFffStatus("lost");
        playQuizSfx("wrong", muted);
      } else {
        const next = fffTimeLeft - 1;
        setFffTimeLeft(next);
        if (next <= 6) playQuizSfx("tick", muted);
      }
    }, 1000);
    return () => clearTimeout(id);
  }, [fffOpen, fffStatus, fffTimeLeft, muted]);

  useEffect(() => {
    return () => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
    };
  }, []);

  // Compute dynamic Audience Poll adjusted for 50:50 eliminations
  const effectivePoll = useMemo(() => {
    const raw = question.communityPoll;
    if (eliminatedOpts.length === 0) return raw;
    const activeIndices = [0, 1, 2, 3].filter((i) => !eliminatedOpts.includes(i));
    const sumActive = activeIndices.reduce((acc, idx) => acc + raw[idx], 0) || 1;
    const out: [number, number, number, number] = [0, 0, 0, 0];
    let assigned = 0;
    activeIndices.forEach((idx, pos) => {
      if (pos === activeIndices.length - 1) {
        out[idx] = Math.max(0, 100 - assigned);
      } else {
        const scaled = Math.round((raw[idx] / sumActive) * 100);
        out[idx] = scaled;
        assigned += scaled;
      }
    });
    return out;
  }, [question.communityPoll, eliminatedOpts]);

  const lifelinesUsedCount = Object.values(usedLifelines).filter(Boolean).length;

  const revealAnswer = useCallback(
    (idx: number) => {
      setIsLocking(false);

      if (idx === question.correctIdx) {
        setDoubleDipActive(false);
        setDoubleDipSecondChance(false);

        const nextStreak = streak + 1;
        const nextPeak = Math.max(peakStreak, nextStreak);
        setStreak(nextStreak);
        setPeakStreak(nextPeak);
        setAnsweredCount((c) => c + 1);

        // Speed Bonus Calculation (fast answers earn bonus XP + combo multiplier!)
        let speedBonus = 0;
        if (secondsLeft !== null && totalSeconds !== null) {
          const ratio = secondsLeft / totalSeconds;
          if (ratio >= 0.65) {
            speedBonus = Math.round(50 * Math.min(4, nextStreak));
          } else if (ratio >= 0.4) {
            speedBonus = Math.round(25 * Math.min(3, nextStreak));
          }
        } else {
          // Tiers 11-15 streak bonus
          speedBonus = 150 * Math.min(5, nextStreak);
        }
        setSpeedBonusTotal((s) => s + speedBonus);

        // Unlock Time Boost at 3x streak!
        if (nextStreak === 3 && !timeBoostUsed && !timeBoostAvailable) {
          setTimeBoostAvailable(true);
          pushToast("⏳ Waqt +20s Power-Up Unlocked!", "3x Noor Streak Reward", "violet");
        }

        // Check newly earned medals & record mastered question
        const newlyEarnedMedals: string[] = [];
        if (nextStreak >= 5) newlyEarnedMedals.push("streak-5");
        if (nextStreak >= 10) newlyEarnedMedals.push("streak-10");
        if (isLadder && tierIdx === 4) newlyEarnedMedals.push("first-padav");
        if (isLadder && tierIdx === 9) {
          newlyEarnedMedals.push("second-padav");
          if (lifelinesUsedCount === 0) newlyEarnedMedals.push("no-lifeline-10");
        }

        setVault((prev) => {
          const mastered = prev.masteredQuestionIds.includes(question.id)
            ? prev.masteredQuestionIds
            : [...prev.masteredQuestionIds, question.id];
          const medals = new Set([...prev.unlockedMedals, ...newlyEarnedMedals]);
          if (mastered.length >= 50) medals.add("vault-50");
          const updated = {
            ...prev,
            masteredQuestionIds: mastered,
            unlockedMedals: Array.from(medals),
            bestStreak: Math.max(prev.bestStreak, nextPeak),
          };
          saveQuizVault(updated);
          return updated;
        });

        if (isLadder) {
          const earned = TIER_REWARDS[tierIdx];
          setRunXp(earned);
          const hitSafe = SAFE_TIERS.includes(tierIdx);
          if (hitSafe) setSafeXp(earned);

          // Unlock 5th Lifeline (Double Dip / Do Mauqe) at Tier 5 Safe Padav!
          if (tierIdx === 4 && !doubleDipUnlocked) {
            setDoubleDipUnlocked(true);
            pushToast(
              "🛡️ Safe Padav #1 + Double Dip Unlocked!",
              "1,000 XP Locked Safely • 5th Lifeline Ready",
              "gold"
            );
          } else if (tierIdx === 9) {
            pushToast(
              "⚔️ Safe Padav #2 Conquered!",
              "32,000 Ilm XP Guaranteed!",
              "gold"
            );
          }

          if (tierIdx === totalSteps - 1) {
            setOutcome("won");
            playQuizSfx("win", muted);
            fireConfetti("grand_crown");
            speakHostLine(
              "MashaAllah! Adbhut! Aapne pandrah ke pandrah sawal jeet kar Taj-e-Sahib-e-Ilm haasil kar liya!",
              hostVoiceOn
            );
            commitPoints(earned, "won", 15, nextPeak, [
              ...newlyEarnedMedals,
              "grand-crown",
            ]);
            setTimeout(() => setSanadOpen(true), 1200);
          } else {
            setOutcome("correct");
            if (hitSafe) {
              playQuizSfx("milestone", muted);
              fireConfetti("padav");
              speakHostLine(
                `Mubarak ho! Safe Padav mukammal hua. ${earned.toLocaleString()} Ilm XP ab bilkul mehfooz hain!`,
                hostVoiceOn
              );
            } else {
              playQuizSfx("correct", muted, nextStreak);
              if (nextStreak >= 2) playQuizSfx("combo", muted, nextStreak);
              fireConfetti("sparkle");
              pushToast(
                `+${earned.toLocaleString()} XP Tier${
                  speedBonus > 0 ? ` (+${speedBonus} Speed)` : ""
                }`,
                nextStreak >= 2 ? `🔥 Noor Streak x${nextStreak}!` : "Sahi Jawab!",
                "emerald"
              );
              speakHostLine("MashaAllah, bilkul sahi jawab!", hostVoiceOn);
            }
          }
        } else {
          // 20-Q Rapid Blitz Mode
          const comboMult = Math.min(3, 1 + Math.floor(nextStreak / 3) * 0.5);
          const stepEarned = Math.round(stepReward * comboMult);
          const earned = runXp + stepEarned;
          setRunXp(earned);
          setSafeXp(earned);
          pushToast(
            `+${stepEarned.toLocaleString()} Blitz XP`,
            `🔥 ${nextStreak}x Combo (${comboMult}x Multiplier)`,
            "emerald"
          );

          if (tierIdx === totalSteps - 1) {
            setOutcome("won");
            playQuizSfx("win", muted);
            fireConfetti("grand_crown");
            commitPoints(earned, "won", undefined, nextPeak, newlyEarnedMedals);
            setTimeout(() => setSanadOpen(true), 1000);
          } else {
            setOutcome("correct");
            playQuizSfx("correct", muted, nextStreak);
            fireConfetti("sparkle");
          }
        }
      } else {
        // Check if Double Dip (Do Mauqe) gives a second chance!
        if (doubleDipActive && !doubleDipSecondChance) {
          setDoubleDipSecondChance(true);
          setEliminatedOpts((prev) => [...prev, idx]);
          setSelectedOpt(null);
          playQuizSfx("lifeline", muted);
          pushToast(
            "⚡ Do Mauqe Saved You!",
            `Option ${String.fromCharCode(65 + idx)} eliminated — Pick your 2nd choice!`,
            "gold"
          );
          speakHostLine(
            "Woh jawab sahi nahi tha, magar Do Mauqe ki wajah se aapke paas ek aur mauqa hai!",
            hostVoiceOn
          );
          return;
        }

        setDoubleDipActive(false);
        setDoubleDipSecondChance(false);
        setStreak(0);
        setOutcome("wrong");
        setShakeKey((k) => k + 1);
        playQuizSfx("wrong", muted);
        speakHostLine(
          "Afsos, yeh galat jawab hai. Aaiye sahi dalil dekhte hain.",
          hostVoiceOn
        );
        commitPoints(
          safeXp,
          "wrong",
          isLadder && tierIdx > 0 ? tierIdx : undefined
        );
      }
    },
    [
      question.correctIdx,
      question.id,
      streak,
      peakStreak,
      secondsLeft,
      totalSeconds,
      timeBoostUsed,
      timeBoostAvailable,
      pushToast,
      isLadder,
      tierIdx,
      lifelinesUsedCount,
      doubleDipUnlocked,
      totalSteps,
      muted,
      fireConfetti,
      hostVoiceOn,
      commitPoints,
      stepReward,
      runXp,
      doubleDipActive,
      doubleDipSecondChance,
      safeXp,
    ]
  );

  const lockInAnswer = useCallback(
    (idx: number) => {
      if (outcome !== "playing" || isLocking) return;
      setIsLocking(true);
      playQuizSfx("lock", muted);
      speakHostLine(
        `Computer ji, Option ${String.fromCharCode(65 + idx)} ko lock kiya jaye!`,
        hostVoiceOn
      );
      lockTimerRef.current = setTimeout(
        () => {
          revealAnswer(idx);
        },
        dramaticMode ? 1450 : 480
      );
    },
    [outcome, isLocking, muted, hostVoiceOn, dramaticMode, revealAnswer]
  );

  const handleOptionSelect = useCallback(
    (idx: number) => {
      if (outcome !== "playing" || isLocking || eliminatedOpts.includes(idx)) return;
      setSelectedOpt(idx);
      playQuizSfx("select", muted);
    },
    [outcome, isLocking, eliminatedOpts, muted]
  );

  const nextTier = useCallback(() => {
    const next = Math.min(totalSteps - 1, tierIdx + 1);
    setTierIdx(next);
    setSecondsLeft(getClockForStep(next, runFormat));
    setSelectedOpt(null);
    setIsLocking(false);
    setOutcome("playing");
    setEliminatedOpts([]);
    setShowIshara(false);
    setIsharaRinging(false);
    setShowPoll(false);
    setSwappedQuestion(null);
    setDoubleDipActive(false);
    setDoubleDipSecondChance(false);
    playQuizSfx("select", muted);
  }, [totalSteps, tierIdx, getClockForStep, runFormat, muted]);

  const startNewRun = useCallback(
    (cat: CategoryFilter, fmt: RunFormat = runFormat) => {
      if (lockTimerRef.current) clearTimeout(lockTimerRef.current);
      const currentSeen = loadQuizVault().seenQuestionIds;
      const freshDeck = buildRandomizedDeck(cat, currentSeen, fmt);

      setFffOpen(false);
      setSanadOpen(false);
      setCategoryFilter(cat);
      setRunFormat(fmt);
      setDeck(freshDeck);
      setTierIdx(0);
      setSecondsLeft(getClockForStep(0, fmt));
      setSelectedOpt(null);
      setIsLocking(false);
      setOutcome("playing");
      setEliminatedOpts([]);
      setShowIshara(false);
      setIsharaRinging(false);
      setShowPoll(false);
      setSwappedQuestion(null);
      setDoubleDipUnlocked(false);
      setDoubleDipActive(false);
      setDoubleDipSecondChance(false);
      setTimeBoostAvailable(false);
      setTimeBoostUsed(false);
      setStreak(0);
      setPeakStreak(0);
      setRunXp(0);
      setSpeedBonusTotal(0);
      setSafeXp(0);
      setBankedXp(null);
      setAnsweredCount(0);
      setCopiedScore(false);
      setUsedLifelines({
        nisf: false,
        ishara: false,
        poll: false,
        tabdeeli: false,
        doubleDip: false,
      });

      playQuizSfx("intro", muted);
      pushToast(
        "🎲 Fresh Randomized Seat Ready!",
        fmt === "ladder15"
          ? "15 Levels • Drawn from 300-Question Vault"
          : "20-Question High-Speed Blitz",
        "violet"
      );
    },
    [runFormat, getClockForStep, muted, pushToast]
  );

  // Fastest Finger First Handlers
  const openFastestFinger = () => {
    const pick = pickRandomFastestFinger(fffChallenge.id);
    setFffChallenge(pick);
    setFffPickOrder([]);
    setFffTimeLeft(25);
    setFffStatus("playing");
    setFffOpen(true);
    playQuizSfx("intro", muted);
  };

  const handleFffPick = (idx: number) => {
    if (fffStatus !== "playing" || fffPickOrder.includes(idx)) return;
    const nextOrder = [...fffPickOrder, idx];
    setFffPickOrder(nextOrder);
    playQuizSfx("select", muted);

    if (nextOrder.length === 4) {
      const ok = nextOrder.every((val, i) => val === fffChallenge.correctOrder[i]);
      if (ok) {
        setFffStatus("won");
        const fastBonus = fffTimeLeft >= 15 ? 500 : 250;
        playQuizSfx("milestone", muted);
        fireConfetti("padav");
        addIlmPoints(fastBonus);
        pushToast(
          `⚡ Fastest Finger Won (+${fastBonus} XP)!`,
          `Completed with ${fffTimeLeft}s remaining`,
          "gold"
        );
        if (fffTimeLeft >= 15) {
          setVault((prev) => {
            if (prev.unlockedMedals.includes("speed-demon")) return prev;
            const updated = {
              ...prev,
              unlockedMedals: [...prev.unlockedMedals, "speed-demon"],
            };
            saveQuizVault(updated);
            return updated;
          });
        }
      } else {
        setFffStatus("lost");
        setShakeKey((k) => k + 1);
        playQuizSfx("wrong", muted);
      }
    }
  };

  const walkAway = () => {
    if (
      runXp <= 0 ||
      isLocking ||
      outcome === "won" ||
      outcome === "wrong" ||
      outcome === "walked"
    ) {
      return;
    }
    setOutcome("walked");
    playQuizSfx("milestone", muted);
    fireConfetti("sparkle");
    commitPoints(
      runXp,
      "walked",
      isLadder ? tierIdx + (outcome === "correct" ? 1 : 0) : undefined
    );
    setTimeout(() => setSanadOpen(true), 650);
  };

  // Lifeline 1: 50:50 (Nisf)
  const triggerNisf = () => {
    if (usedLifelines.nisf || outcome !== "playing" || isLocking) return;
    const wrongIndices = [0, 1, 2, 3].filter(
      (i) => i !== question.correctIdx && !eliminatedOpts.includes(i)
    );
    const shuffled = [...wrongIndices].sort(() => Math.random() - 0.5);
    const removed = shuffled.slice(0, 2);
    setEliminatedOpts((prev) => [...prev, ...removed]);
    if (selectedOpt !== null && removed.includes(selectedOpt)) setSelectedOpt(null);
    setUsedLifelines((u) => ({ ...u, nisf: true }));
    playQuizSfx("lifeline", muted);
    pushToast("✂️ 50:50 Nisf Activated", "Two incorrect options eliminated", "gold");
  };

  // Lifeline 2: Phone a Scholar (Ishara) with Realistic Ringing Drama
  const triggerIshara = useCallback(() => {
    if (usedLifelines.ishara || outcome !== "playing" || isLocking) return;
    setUsedLifelines((u) => ({ ...u, ishara: true }));
    setIsharaRinging(true);
    playQuizSfx("phone_ring", muted);
    setTimeout(() => {
      setIsharaRinging(false);
      setShowIshara(true);
      playQuizSfx("lifeline", muted);
    }, 900);
  }, [usedLifelines.ishara, outcome, isLocking, muted]);

  // Lifeline 3: Audience Poll (Ijma')
  const triggerPoll = () => {
    if (usedLifelines.poll || outcome !== "playing" || isLocking) return;
    setShowPoll(true);
    setUsedLifelines((u) => ({ ...u, poll: true }));
    playQuizSfx("lifeline", muted);
    pushToast("📊 Ijma' Poll Live!", "Community congregation votes tallied", "violet");
  };

  // Lifeline 4: Flip Question (Tabdeeli) — draws from the other 19 questions in the SAME tier!
  const triggerTabdeeli = () => {
    if (usedLifelines.tabdeeli || outcome !== "playing" || isLocking) return;
    const exclude = [...deck.map((d) => d.id), ...vault.seenQuestionIds.slice(-40)];
    const replacement = pickAlternateQuestionForTier(
      question.id,
      question.tier,
      categoryFilter,
      exclude
    );
    setSwappedQuestion(replacement);
    setEliminatedOpts([]);
    setSelectedOpt(null);
    setShowIshara(false);
    setIsharaRinging(false);
    setShowPoll(false);
    setDoubleDipActive(false);
    setDoubleDipSecondChance(false);
    if (totalSeconds !== null) setSecondsLeft(totalSeconds);
    setUsedLifelines((u) => ({ ...u, tabdeeli: true }));
    playQuizSfx("lifeline", muted);
    pushToast(
      "🔄 Sawal Tabdeel!",
      `Fresh Tier ${question.tier} question drawn from 20-Q pool`,
      "violet"
    );
  };

  // Lifeline 5: Double Dip (Do Mauqe) — Unlocked at Tier 5 Safe Padav!
  const triggerDoubleDip = () => {
    if (
      !doubleDipUnlocked ||
      usedLifelines.doubleDip ||
      outcome !== "playing" ||
      isLocking
    ) {
      return;
    }
    setDoubleDipActive(true);
    setUsedLifelines((u) => ({ ...u, doubleDip: true }));
    playQuizSfx("lifeline", muted);
    pushToast(
      "🛡️ Do Mauqe Armed!",
      "You have 2 attempts on this question (Cannot Walk Away)",
      "gold"
    );
  };

  // Streak Power-Up: Waqt +20s
  const triggerTimeBoost = () => {
    if (
      !timeBoostAvailable ||
      timeBoostUsed ||
      secondsLeft === null ||
      outcome !== "playing" ||
      isLocking
    ) {
      return;
    }
    setSecondsLeft((s) => (s !== null ? s + 20 : null));
    setTimeBoostUsed(true);
    setTimeBoostAvailable(false);
    playQuizSfx("lifeline", muted);
    pushToast("⏳ +20 Seconds Added!", "Noor Streak Time Extension Activated", "emerald");
  };

  // Keyboard Shortcuts (A/B/C/D, 1-4, Enter, H)
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (fffOpen || sanadOpen || vaultDrawerOpen) return;
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
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
  }, [
    fffOpen,
    sanadOpen,
    vaultDrawerOpen,
    outcome,
    isLocking,
    selectedOpt,
    handleOptionSelect,
    lockInAnswer,
    nextTier,
    triggerIshara,
  ]);

  const timerPct = useMemo(() => {
    if (secondsLeft === null || totalSeconds === null) return 100;
    return Math.max(0, Math.min(100, (secondsLeft / totalSeconds) * 100));
  }, [secondsLeft, totalSeconds]);

  const stageMood: StageMood = useMemo(() => {
    if (isLocking) return "locking";
    if (outcome === "won" || (outcome === "correct" && SAFE_TIERS.includes(tierIdx))) {
      return "milestone";
    }
    if (outcome === "correct") return "correct";
    if (outcome === "wrong") return "wrong";
    if (secondsLeft !== null && secondsLeft <= 8) return "urgent";
    return "normal";
  }, [isLocking, outcome, tierIdx, secondsLeft]);

  const rankInfo = useMemo(() => getIlmRank(ilmPoints), [ilmPoints]);

  const hostLine = useMemo(() => {
    if (isLocking)
      return "Computer ji, is jawab par tala lagaya jaye... Dil tham kar baithiye!";
    if (doubleDipSecondChance)
      return "Pehla intekhab galat tha — Do Mauqe ki barkat se apna doosra jawab chuniye!";
    if (outcome === "won")
      return "MashaAllah! Aapne tamam marahil sar karke Taj-e-Sahib-e-Ilm apne naam kiya!";
    if (outcome === "walked")
      return `Hikmat bhara faisla! Aapne ${(bankedXp ?? 0).toLocaleString()} Ilm XP mehfooz kar liye.`;
    if (outcome === "wrong") {
      return safeXp > 0
        ? `Afsos, galat jawab — magar Safe Padav ki wajah se ${safeXp.toLocaleString()} XP aapke mehfooz hain!`
        : "Ilm ka har sawal ek nayi seekh hai — dalil padhein aur naye sawalon ke sath phir aayein!";
    }
    if (outcome === "correct") {
      if (isLadder && SAFE_TIERS.includes(tierIdx)) {
        return `Mubarak! Safe Padav #${SAFE_TIERS.indexOf(tierIdx) + 1} fatah hua — ${runXp.toLocaleString()} XP ab bilkul mehfooz hain!`;
      }
      return `SubhanAllah, bilkul durust jawab! ${
        streak >= 2 ? `Noor Streak ${streak}x par hai!` : "Agle marhale ke liye taiyar!"
      }`;
    }
    if (isLadder && SAFE_TIERS.includes(tierIdx)) {
      return `Sawal #${tierIdx + 1} (${TIER_TITLES[tierIdx]}) — Yeh Safe Padav hai (${stepReward.toLocaleString()} XP)!`;
    }
    if (isLadder && tierIdx >= 10) {
      return `Sawal #${tierIdx + 1} (${TIER_TITLES[tierIdx]}) — Waqt ki koi qaid nahi, sukoon aur tadabbur se jawab dein.`;
    }
    return `Sawal #${tierIdx + 1} — ${stepReward.toLocaleString()} Ilm XP ke liye aapki screen par!`;
  }, [
    isLocking,
    doubleDipSecondChance,
    outcome,
    bankedXp,
    safeXp,
    isLadder,
    tierIdx,
    runXp,
    streak,
    stepReward,
  ]);

  const copyCertificate = () => {
    const modeName =
      categoryFilter === "all"
        ? isLadder
          ? "15-Tier KBC Ladder"
          : "20-Q Blitz"
        : categoryFilter;
    const text = `👑 Sahib-e-Ilm Hot Seat (${modeName}): Reached ${answeredCount}/${totalSteps} • Peak Streak 🔥 ${peakStreak}x • Rank: ${rankInfo.current.title} • Banked +${(
      bankedXp ?? runXp
    ).toLocaleString()} Ilm XP!`;
    navigator.clipboard?.writeText(text).then(() => {
      setCopiedScore(true);
      setTimeout(() => setCopiedScore(false), 2000);
    });
  };

  // Count questions per tier dynamically so user can verify 20+ per level
  const totalBankSize = QUIZ_BANK.length;
  const perTierCount = useMemo(
    () => QUIZ_BANK.filter((q) => q.tier === question.tier).length,
    [question.tier]
  );

  return (
    <div className="space-y-5 relative">
      {/* Canvas Confetti / Fireworks Particle Engine */}
      <QuizConfettiCanvas burstKind={burstKind} burstId={burstId} />
      <FloatingXpBursts items={toasts} />

      {/* Royal Sanad-e-Ilm Certificate Modal */}
      <SanadCertificateModal
        open={sanadOpen}
        onClose={() => setSanadOpen(false)}
        playerName={user?.name || "Hot-Seat Contender"}
        rank={rankInfo.current}
        modeLabel={
          categoryFilter === "all"
            ? isLadder
              ? "15-Tier KBC Ladder"
              : "20-Q Rapid Blitz"
            : categoryFilter
        }
        outcome={
          outcome === "won" ? "won" : outcome === "walked" ? "walked" : "wrong"
        }
        answeredCount={answeredCount}
        totalSteps={totalSteps}
        bankedXp={bankedXp ?? runXp}
        speedBonusXp={speedBonusTotal}
        peakStreak={peakStreak}
        masteredCount={vault.masteredQuestionIds.length}
        unlockedMedals={vault.unlockedMedals}
        onCopyShare={copyCertificate}
        copied={copiedScore}
        onPlayAgain={() => startNewRun(categoryFilter, runFormat)}
      />

      {/* Top Broadcast Studio Banner + Gamified Rank Progress */}
      <section
        className="bento-card p-5 sm:p-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(71, 30, 138, 0.42) 0%, rgba(18, 25, 49, 0.96) 55%, rgba(245, 158, 11, 0.12) 100%)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 relative z-10">
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-amber-400/15 border border-amber-400/40 text-amber-300">
                <Crown className="w-3.5 h-3.5" />
                Sahib-e-Ilm Championship Studio
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-[#A44AFF]/15 border border-[#A44AFF]/35 text-[#DF98FA]">
                <Layers className="w-3 h-3" />
                {totalBankSize} Questions • {perTierCount} Qs/Level Randomized
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Kaun Banega <span style={{ color: "var(--accent-gold)" }}>Sahib-e-Ilm</span>
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              15-Tier KBC Hot Seat • 20 Unique Questions per Level • Shuffled Options, 5 Lifelines, Combos &amp; Broadcast FX
            </p>
          </div>

          {/* Scholarly Rank Card + Broadcast Audio/FX Controls */}
          <div className="flex flex-col sm:items-end gap-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={openFastestFinger}
                className="px-3.5 py-2 rounded-xl border font-bold text-xs inline-flex items-center gap-1.5 cursor-pointer hover:brightness-110 transition-all"
                style={{
                  borderColor: "#F59E0B",
                  backgroundColor: "rgba(245, 158, 11, 0.16)",
                  color: "#FBBF24",
                }}
              >
                <Zap className="w-3.5 h-3.5" />
                <span>Fastest Finger (+500 XP)</span>
              </button>

              <button
                type="button"
                onClick={() => setVaultDrawerOpen((v) => !v)}
                className="px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer hover:brightness-110"
                style={{
                  borderColor: vaultDrawerOpen
                    ? "var(--accent-primary)"
                    : "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <Medal className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  Medals ({vault.unlockedMedals.length}/{QUIZ_MEDALS.length}) &amp; Vault
                </span>
              </button>

              {/* Host Voice Toggle */}
              <button
                type="button"
                onClick={() => setHostVoiceOn((v) => !v)}
                title="Toggle Spoken Host Commentary"
                className="p-2 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: hostVoiceOn ? "#4ADE80" : "var(--border-hairline)",
                  backgroundColor: hostVoiceOn
                    ? "rgba(74, 222, 128, 0.14)"
                    : "var(--bg-muted)",
                }}
              >
                {hostVoiceOn ? (
                  <Mic className="w-4 h-4 text-emerald-400" />
                ) : (
                  <MicOff className="w-4 h-4 opacity-60" />
                )}
              </button>

              {/* Studio Tension Drone Toggle */}
              <button
                type="button"
                onClick={() => setDroneOn((d) => !d)}
                title="Toggle Hot-Seat Studio Tension Ambience"
                className="p-2 rounded-xl border cursor-pointer transition-all"
                style={{
                  borderColor: droneOn ? "#F59E0B" : "var(--border-hairline)",
                  backgroundColor: droneOn
                    ? "rgba(245, 158, 11, 0.15)"
                    : "var(--bg-muted)",
                }}
              >
                <Radio
                  className={`w-4 h-4 ${
                    droneOn ? "text-amber-400 animate-pulse" : "opacity-60"
                  }`}
                />
              </button>

              {/* Master SFX Mute */}
              <button
                type="button"
                onClick={() => setMuted((m) => !m)}
                aria-label={muted ? "Unmute quiz audio" : "Mute quiz audio"}
                className="p-2 rounded-xl border cursor-pointer"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                {muted ? (
                  <VolumeX className="w-4 h-4 text-red-400" />
                ) : (
                  <Volume2
                    className="w-4 h-4"
                    style={{ color: "var(--accent-secondary)" }}
                  />
                )}
              </button>
            </div>

            {/* Rank & XP Progress Strip */}
            <div
              className="w-full sm:w-80 p-2.5 rounded-2xl border flex flex-col gap-1.5"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "rgba(4, 12, 35, 0.55)",
              }}
            >
              <div className="flex items-center justify-between text-[11px]">
                <span className="font-extrabold flex items-center gap-1.5">
                  <span style={{ color: rankInfo.current.color }}>
                    ● {rankInfo.current.title}
                  </span>
                  <span className="font-arabic text-xs opacity-80">
                    ({rankInfo.current.arabicTitle})
                  </span>
                </span>
                <span className="font-bold tabular-nums text-amber-300">
                  {ilmPoints.toLocaleString()} XP
                </span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${rankInfo.progressPct}%` }}
                  className="h-full rounded-full bg-gradient-to-r from-[#DF98FA] via-[#9055FF] to-amber-400"
                />
              </div>
              <div className="flex items-center justify-between text-[10px] opacity-75">
                <span>
                  Vault: {vault.masteredQuestionIds.length}/{totalBankSize} Mastered
                </span>
                <span>
                  {rankInfo.next
                    ? `Next: ${rankInfo.next.title} (${rankInfo.next.minXp.toLocaleString()} XP)`
                    : "Max Rank Achieved!"}
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Expandable Medals, Per-Level 20-Q Pool Stats & Hall of Fame Drawer */}
      <AnimatePresence>
        {vaultDrawerOpen && (
          <motion.section
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="bento-card p-5 space-y-5 overflow-hidden"
          >
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div>
                <h2 className="text-base font-extrabold flex items-center gap-2">
                  <Medal className="w-4 h-4 text-amber-400" />
                  <span>Scholarly Medals, 300-Question Vault &amp; Recent Runs</span>
                </h2>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Unseen questions are automatically prioritized every run so you never see repeats until exhausting a level&apos;s 20-question pool!
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="px-3 py-1 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 font-bold">
                  Crowns Won: {vault.crownsWon}
                </span>
                <span className="px-3 py-1 rounded-xl bg-orange-400/10 border border-orange-400/30 text-orange-300 font-bold">
                  Best Streak: 🔥 {vault.bestStreak}x
                </span>
                <span className="px-3 py-1 rounded-xl bg-emerald-400/10 border border-emerald-400/30 text-emerald-300 font-bold">
                  Best Tier: {bestQuizTier}/15
                </span>
              </div>
            </div>

            {/* 8 Unlockable Medals Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {QUIZ_MEDALS.map((m) => {
                const unlocked = vault.unlockedMedals.includes(m.id);
                return (
                  <div
                    key={m.id}
                    className={`p-3 rounded-2xl border transition-all ${
                      unlocked ? "opacity-100" : "opacity-45 grayscale"
                    }`}
                    style={{
                      borderColor: unlocked ? "#F59E0B" : "var(--border-hairline)",
                      backgroundColor: unlocked
                        ? "rgba(245, 158, 11, 0.1)"
                        : "var(--bg-muted)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xl">{m.badgeEmoji}</span>
                      <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-black/25">
                        {unlocked ? "Unlocked" : "Locked"}
                      </span>
                    </div>
                    <div className="text-xs font-extrabold mt-1.5">{m.title}</div>
                    <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                      {m.subtitle}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 15-Level Pool Breakdown (Proving 20 Questions per Level + Mastery Count) */}
            <div>
              <div className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--accent-secondary)" }}>
                15 Levels Question Pool Mastery (20 Questions Per Level = {totalBankSize} Total)
              </div>
              <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-15 gap-1.5">
                {Array.from({ length: 15 }, (_, i) => {
                  const t = i + 1;
                  const pool = QUIZ_BANK.filter((q) => q.tier === t);
                  const mast = pool.filter((q) =>
                    vault.masteredQuestionIds.includes(q.id)
                  ).length;
                  return (
                    <div
                      key={t}
                      className="p-2 rounded-xl border text-center"
                      style={{
                        borderColor: SAFE_TIERS.includes(i)
                          ? "rgba(245,158,11,0.45)"
                          : "var(--border-hairline)",
                        backgroundColor: "var(--bg-muted)",
                      }}
                    >
                      <div className="text-[10px] font-bold text-amber-300">
                        L{t} {SAFE_TIERS.includes(i) ? "★" : ""}
                      </div>
                      <div className="text-xs font-extrabold tabular-nums mt-0.5">
                        {mast}/{pool.length}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recent Runs History */}
            {vault.recentRuns.length > 0 && (
              <div className="space-y-1.5">
                <div className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                  Recent Hot-Seat Sessions
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
                  {vault.recentRuns.slice(0, 4).map((r) => (
                    <div
                      key={r.id}
                      className="p-2.5 rounded-xl border text-xs flex items-center justify-between"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-muted)",
                      }}
                    >
                      <div>
                        <div className="font-bold">{r.mode}</div>
                        <div className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                          {r.date} • Tier {r.tierReached}/{r.totalSteps} • 🔥 {r.maxStreak}x
                        </div>
                      </div>
                      <span className="font-extrabold text-amber-300 tabular-nums">
                        +{r.xpEarned.toLocaleString()}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.section>
        )}
      </AnimatePresence>

      {/* Mode, Category & Format Switcher Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 text-xs">
        <div className="flex flex-wrap items-center gap-1.5">
          <button
            type="button"
            onClick={() => startNewRun("all", runFormat)}
            className="px-3 py-1.5 rounded-xl border font-bold cursor-pointer transition-all"
            style={{
              borderColor:
                categoryFilter === "all" && !fffOpen
                  ? "#F59E0B"
                  : "var(--border-hairline)",
              backgroundColor:
                categoryFilter === "all" && !fffOpen
                  ? "rgba(245, 158, 11, 0.18)"
                  : "var(--bg-muted)",
              color:
                categoryFilter === "all" && !fffOpen ? "#FBBF24" : "var(--text-muted)",
            }}
          >
            All Categories (300 Qs)
          </button>
          {QUIZ_CATEGORIES.map((cat) => {
            const active = categoryFilter === cat && !fffOpen;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => startNewRun(cat, runFormat)}
                className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition-all"
                style={{
                  borderColor: active
                    ? "var(--accent-secondary)"
                    : "var(--border-hairline)",
                  backgroundColor: active
                    ? "rgba(164, 74, 255, 0.18)"
                    : "var(--bg-muted)",
                  color: active ? "var(--accent-secondary)" : "var(--text-muted)",
                }}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="flex flex-wrap items-center gap-1.5">
          {/* Format Toggle: 15-Tier Ladder vs 20-Q Rapid Blitz */}
          <div
            className="inline-flex p-0.5 rounded-xl border"
            style={{
              borderColor: "var(--border-hairline)",
              backgroundColor: "var(--bg-muted)",
            }}
          >
            <button
              type="button"
              onClick={() => startNewRun(categoryFilter, "ladder15")}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                runFormat === "ladder15"
                  ? "bg-amber-500 text-slate-950"
                  : "text-[#A19CC5]"
              }`}
            >
              15-Tier KBC
            </button>
            <button
              type="button"
              onClick={() => startNewRun(categoryFilter, "blitz20")}
              className={`px-2.5 py-1 rounded-lg font-bold cursor-pointer transition-all ${
                runFormat === "blitz20"
                  ? "bg-purple-500 text-white"
                  : "text-[#A19CC5]"
              }`}
            >
              20-Q Blitz
            </button>
          </div>

          <button
            type="button"
            onClick={() => setDramaticMode((d) => !d)}
            className="px-2.5 py-1.5 rounded-xl border font-semibold cursor-pointer"
            style={{
              borderColor: "var(--border-hairline)",
              backgroundColor: "var(--bg-muted)",
              color: dramaticMode ? "#FBBF24" : "var(--text-muted)",
            }}
            title="Toggle Dramatic 1.5s KBC Suspense Lock vs Fast Lock"
          >
            {dramaticMode ? "🎬 Dramatic Lock" : "⚡ Fast Lock"}
          </button>

          <button
            type="button"
            onClick={() => startNewRun(categoryFilter, runFormat)}
            className="px-3 py-1.5 rounded-xl border font-bold inline-flex items-center gap-1 cursor-pointer hover:brightness-110"
            style={{
              borderColor: "var(--border-hairline)",
              backgroundColor: "var(--bg-muted)",
            }}
          >
            <Shuffle className="w-3.5 h-3.5 text-[#DF98FA]" />
            <span>Deal Random Deck</span>
          </button>
        </div>
      </div>

      {/* FASTEST FINGER FIRST QUALIFIER STAGE */}
      {fffOpen ? (
        <motion.section
          key={`fff-${shakeKey}`}
          animate={shakeKey > 0 && fffStatus === "lost" ? { x: [0, -10, 10, -6, 6, 0] } : {}}
          className="bento-card p-6 space-y-5 max-w-3xl mx-auto relative overflow-hidden"
        >
          <KbcStudioBeams mood={fffStatus === "won" ? "milestone" : fffTimeLeft <= 7 ? "urgent" : "normal"} />
          <div className="relative z-10 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-wider text-amber-400">
                  ⚡ Fastest Finger First • 16 Randomized Sequence Trials
                </span>
                <h2 className="text-lg sm:text-xl font-bold mt-1">{fffChallenge.prompt}</h2>
              </div>
              <div
                className="w-14 h-14 rounded-full border-2 flex items-center justify-center text-sm font-extrabold tabular-nums shrink-0"
                style={{
                  borderColor: fffTimeLeft <= 7 ? "#EF4444" : "#F59E0B",
                  color: fffTimeLeft <= 7 ? "#F87171" : "#FBBF24",
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
                  <motion.button
                    key={idx}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    type="button"
                    disabled={fffStatus !== "playing" || picked}
                    onClick={() => handleFffPick(idx)}
                    className="p-4 rounded-2xl border-2 text-start text-sm font-semibold flex items-center justify-between gap-3 cursor-pointer disabled:opacity-80 transition-all"
                    style={{
                      borderColor: picked ? "#F59E0B" : "var(--border-hairline)",
                      backgroundColor: picked
                        ? "rgba(245, 158, 11, 0.18)"
                        : "var(--bg-muted)",
                    }}
                  >
                    <span>{item}</span>
                    <span
                      className="w-7 h-7 rounded-full border flex items-center justify-center text-xs font-extrabold shrink-0"
                      style={{
                        borderColor: picked ? "#F59E0B" : "var(--border-hairline)",
                        backgroundColor: picked ? "#F59E0B" : "transparent",
                        color: picked ? "#000" : "var(--text-muted)",
                      }}
                    >
                      {picked ? orderPos + 1 : String.fromCharCode(65 + idx)}
                    </span>
                  </motion.button>
                );
              })}
            </div>

            {fffStatus !== "playing" && (
              <motion.div
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 rounded-2xl border space-y-2"
                style={{
                  borderColor: fffStatus === "won" ? "#10B981" : "#EF4444",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <div className="font-bold text-sm flex items-center gap-2">
                  {fffStatus === "won" ? (
                    <>
                      <CheckCircle2 className="w-5 h-5 text-emerald-400" />
                      <span>
                        MashaAllah! Fastest Finger Qualified (+
                        {fffTimeLeft >= 15 ? 500 : 250} Bonus Ilm XP)!
                      </span>
                    </>
                  ) : (
                    <>
                      <XCircle className="w-5 h-5 text-red-400" />
                      <span>Sequence mismatch — Read the proof below &amp; try another!</span>
                    </>
                  )}
                </div>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  {fffChallenge.explanation}
                </p>
              </motion.div>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setFffPickOrder([])}
                disabled={fffStatus !== "playing" || fffPickOrder.length === 0}
                className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer disabled:opacity-40"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                Reset Picks
              </button>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={openFastestFinger}
                  className="px-4 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  Next Random Trial
                </button>
                <button
                  type="button"
                  onClick={() => startNewRun("all", "ladder15")}
                  className="btn-primary px-4 py-2 rounded-xl text-xs font-extrabold cursor-pointer"
                >
                  Enter Hot Seat →
                </button>
              </div>
            </div>
          </div>
        </motion.section>
      ) : (
        /* MAIN KBC HOT-SEAT BROADCAST STAGE + 15-TIER PRIZE LADDER */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
          <motion.section
            key={`stage-shake-${shakeKey}`}
            animate={
              shakeKey > 0 && outcome === "wrong"
                ? { x: [0, -12, 12, -9, 9, -5, 5, 0] }
                : {}
            }
            transition={{ duration: 0.45 }}
            className="lg:col-span-8 bento-card p-5 sm:p-6 space-y-5 relative overflow-hidden"
            style={{
              background:
                "radial-gradient(ellipse 95% 65% at 50% 0%, rgba(245, 158, 11, 0.11), rgba(164, 74, 255, 0.06) 45%, transparent 75%), var(--bg-surface-elevated)",
            }}
          >
            {/* Animated Sweeping KBC Studio Spotlights */}
            <KbcStudioBeams mood={stageMood} />

            <div className="relative z-10 space-y-5">
              {/* 5 KBC Lifelines Bar (including Tier-5 Unlockable Double Dip!) */}
              <div
                className="grid grid-cols-2 sm:grid-cols-5 gap-2 pb-4 border-b"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                {[
                  {
                    id: "nisf",
                    label: "50:50",
                    sub: "Nisf",
                    icon: Split,
                    used: usedLifelines.nisf,
                    locked: false,
                    activeNow: false,
                    onClick: triggerNisf,
                  },
                  {
                    id: "ishara",
                    label: "Scholar Call",
                    sub: "Ishara",
                    icon: PhoneCall,
                    used: usedLifelines.ishara,
                    locked: false,
                    activeNow: isharaRinging,
                    onClick: triggerIshara,
                  },
                  {
                    id: "poll",
                    label: "Ijma' Poll",
                    sub: "Audience",
                    icon: Users,
                    used: usedLifelines.poll,
                    locked: false,
                    activeNow: false,
                    onClick: triggerPoll,
                  },
                  {
                    id: "tabdeeli",
                    label: "Flip Sawal",
                    sub: "Tabdeeli",
                    icon: Shuffle,
                    used: usedLifelines.tabdeeli,
                    locked: false,
                    activeNow: false,
                    onClick: triggerTabdeeli,
                  },
                  {
                    id: "doubleDip",
                    label: "Do Mauqe",
                    sub: doubleDipUnlocked ? "2x Try" : "Padav 1 ★",
                    icon: ShieldAlert,
                    used: usedLifelines.doubleDip,
                    locked: !doubleDipUnlocked,
                    activeNow: doubleDipActive,
                    onClick: triggerDoubleDip,
                  },
                ].map((lf) => {
                  const Icon = lf.icon;
                  return (
                    <motion.button
                      key={lf.id}
                      whileHover={!lf.used && !lf.locked ? { y: -2, scale: 1.02 } : {}}
                      whileTap={!lf.used && !lf.locked ? { scale: 0.96 } : {}}
                      type="button"
                      disabled={
                        lf.used || lf.locked || outcome !== "playing" || isLocking
                      }
                      onClick={lf.onClick}
                      title={
                        lf.locked
                          ? "Conquer Tier 5 Safe Padav to unlock Double Dip (Do Mauqe)!"
                          : lf.label
                      }
                      className={`relative px-2.5 py-2 rounded-2xl border flex items-center gap-2 text-start cursor-pointer transition-all disabled:opacity-35 ${
                        lf.activeNow ? "ring-2 ring-amber-400 animate-pulse" : ""
                      }`}
                      style={{
                        borderColor: lf.activeNow
                          ? "#FBBF24"
                          : lf.used || lf.locked
                          ? "var(--border-hairline)"
                          : "rgba(245, 158, 11, 0.48)",
                        backgroundColor: lf.activeNow
                          ? "rgba(245, 158, 11, 0.25)"
                          : lf.used || lf.locked
                          ? "var(--bg-muted)"
                          : "rgba(245, 158, 11, 0.09)",
                      }}
                    >
                      <span
                        className="w-7 h-7 rounded-full flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor:
                            lf.used || lf.locked ? "transparent" : "var(--gold-soft)",
                          color:
                            lf.used || lf.locked
                              ? "var(--text-muted)"
                              : "var(--accent-gold)",
                        }}
                      >
                        {lf.locked ? (
                          <Lock className="w-3.5 h-3.5" />
                        ) : (
                          <Icon className="w-3.5 h-3.5" />
                        )}
                      </span>
                      <div className="min-w-0 leading-tight">
                        <div
                          className={`text-[11px] font-extrabold truncate ${
                            lf.used ? "line-through" : ""
                          }`}
                        >
                          {lf.label}
                        </div>
                        <div
                          className="text-[10px] truncate"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {lf.sub}
                        </div>
                      </div>
                    </motion.button>
                  );
                })}
              </div>

              {/* Stage Telemetry Row: Sawal Tier, Streak Flame, Time Boost & Animated KBC Clock */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="flex flex-wrap items-center gap-2 text-xs">
                  <span
                    className="px-3 py-1 rounded-full font-extrabold"
                    style={{
                      backgroundColor: "rgba(245, 158, 11, 0.2)",
                      color: "#FBBF24",
                      border: "1px solid rgba(245, 158, 11, 0.4)",
                    }}
                  >
                    {isLadder
                      ? `Level ${tierIdx + 1}/15 • ${stepReward.toLocaleString()} XP`
                      : `Blitz ${tierIdx + 1}/${totalSteps} • +${stepReward} XP`}
                  </span>

                  <span
                    className="px-2.5 py-1 rounded-full border text-[11px] font-semibold"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    {question.category}
                  </span>

                  {/* Active Streak Flame Badge */}
                  {streak > 0 && (
                    <motion.span
                      key={streak}
                      initial={{ scale: 0.7 }}
                      animate={{ scale: 1 }}
                      className="px-2.5 py-1 rounded-full bg-orange-500/20 border border-orange-400/50 text-orange-300 text-[11px] font-extrabold inline-flex items-center gap-1"
                    >
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>{streak}x Streak</span>
                    </motion.span>
                  )}

                  {safeXp > 0 && isLadder && (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400">
                      <ShieldCheck className="w-3.5 h-3.5" />
                      Safe: {safeXp.toLocaleString()}
                    </span>
                  )}
                </div>

                {/* Right Controls: Waqt +20s, Walk Away, Circular Clock */}
                <div className="flex items-center gap-2.5 shrink-0">
                  {timeBoostAvailable &&
                    secondsLeft !== null &&
                    outcome === "playing" &&
                    !isLocking && (
                      <motion.button
                        initial={{ scale: 0.85 }}
                        animate={{ scale: [1, 1.06, 1] }}
                        transition={{ duration: 1.2, repeat: Infinity }}
                        type="button"
                        onClick={triggerTimeBoost}
                        className="px-2.5 py-1.5 rounded-xl bg-emerald-500/20 border border-emerald-400 text-emerald-300 text-[11px] font-extrabold inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Clock className="w-3.5 h-3.5" />
                        <span>+20s</span>
                      </motion.button>
                    )}

                  {runXp > 0 &&
                    !isLocking &&
                    !doubleDipActive &&
                    (outcome === "playing" || outcome === "correct") && (
                      <button
                        type="button"
                        onClick={walkAway}
                        className="px-3 py-1.5 rounded-xl border text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer hover:brightness-110"
                        style={{
                          borderColor: "#F59E0B",
                          color: "#FBBF24",
                        }}
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>Walk Away ({runXp.toLocaleString()})</span>
                      </button>
                    )}

                  {/* KBC Animated Circular Countdown Gauge */}
                  {(() => {
                    const size = 58;
                    const r = 24;
                    const c = 2 * Math.PI * r;
                    const urgent = secondsLeft !== null && secondsLeft <= 8;
                    return (
                      <motion.div
                        animate={
                          urgent && outcome === "playing"
                            ? { scale: [1, 1.1, 1] }
                            : { scale: 1 }
                        }
                        transition={{ duration: 0.75, repeat: urgent ? Infinity : 0 }}
                        className="relative flex items-center justify-center"
                        style={{ width: size, height: size }}
                      >
                        <svg width={size} height={size} className="-rotate-90">
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="rgba(4, 12, 35, 0.7)"
                            stroke="var(--border-hairline)"
                            strokeWidth="4"
                          />
                          <circle
                            cx={size / 2}
                            cy={size / 2}
                            r={r}
                            fill="none"
                            stroke={
                              urgent
                                ? "#EF4444"
                                : isLocking
                                ? "#F59E0B"
                                : "#FBBF24"
                            }
                            strokeWidth="4.5"
                            strokeLinecap="round"
                            strokeDasharray={c}
                            strokeDashoffset={c * (1 - timerPct / 100)}
                            style={{ transition: "stroke-dashoffset 0.9s linear" }}
                          />
                        </svg>
                        <span
                          className="absolute text-xs font-extrabold tabular-nums"
                          style={{ color: urgent ? "#F87171" : "#FBBF24" }}
                        >
                          {secondsLeft !== null ? (
                            secondsLeft
                          ) : (
                            <InfinityIcon className="w-4 h-4" />
                          )}
                        </span>
                      </motion.div>
                    );
                  })()}
                </div>
              </div>

              {/* Host Commentary Strip */}
              <div
                className="flex items-center justify-between gap-2 px-3.5 py-2 rounded-xl border text-xs"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "rgba(4, 12, 35, 0.42)",
                  color: "var(--text-muted)",
                }}
              >
                <div className="flex items-center gap-2 italic">
                  <Mic
                    className="w-3.5 h-3.5 shrink-0"
                    style={{ color: "#FBBF24" }}
                  />
                  <span>{hostLine}</span>
                </div>
                {isLadder && (
                  <span className="text-[10px] font-bold text-[#DF98FA] shrink-0 hidden sm:inline">
                    {TIER_TITLES[tierIdx]}
                  </span>
                )}
              </div>

              {/* AUTHENTIC KBC QUESTION POD WITH HORIZONTAL CONNECTOR RAILS */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={question.id}
                  initial={{ opacity: 0, y: 14, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -12, scale: 0.98 }}
                  transition={{ duration: 0.28 }}
                  className="relative flex items-center"
                >
                  {/* KBC Horizontal Gold Stage Rail */}
                  <div
                    className="absolute inset-x-0 h-[2px] pointer-events-none"
                    style={{
                      background:
                        "linear-gradient(90deg, transparent 0%, #F59E0B 15%, #DF98FA 50%, #F59E0B 85%, transparent 100%)",
                    }}
                  />
                  <div
                    className="relative z-10 w-full mx-2 sm:mx-4 p-5 sm:p-6 rounded-2xl border-2 text-center shadow-xl"
                    style={{
                      borderColor: isLocking
                        ? "#F59E0B"
                        : outcome === "correct" || outcome === "won"
                        ? "#10B981"
                        : outcome === "wrong"
                        ? "#EF4444"
                        : "rgba(245, 158, 11, 0.55)",
                      background:
                        "linear-gradient(180deg, rgba(18, 25, 49, 0.98) 0%, rgba(9, 25, 69, 0.96) 100%)",
                      boxShadow: isLocking
                        ? "0 0 32px rgba(245, 158, 11, 0.35)"
                        : "0 10px 28px -8px rgba(0,0,0,0.65)",
                    }}
                  >
                    <div className="text-[10px] font-bold uppercase tracking-widest text-amber-300/80 mb-1.5">
                      Tier {question.tier} Vault • ID #{question.id.toUpperCase()}
                    </div>
                    <h2 className="text-base sm:text-xl font-extrabold leading-snug text-white">
                      {question.question}
                    </h2>
                  </div>
                </motion.div>
              </AnimatePresence>

              {/* LIFELINE DRAMATIC OVERLAYS: Scholar Phone Ringing / Answer & Live Ijma' Poll */}
              <AnimatePresence>
                {isharaRinging && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    className="p-4 rounded-2xl border border-amber-400/50 bg-amber-500/10 text-amber-300 text-xs font-bold flex items-center gap-3"
                  >
                    <PhoneCall className="w-4 h-4 animate-bounce" />
                    <span>Dialing Dar-ul-Ifta Scholar on the Hot-Seat Line...</span>
                  </motion.div>
                )}

                {showIshara && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border text-xs flex items-start gap-3"
                    style={{
                      borderColor: "#F59E0B",
                      backgroundColor: "rgba(245, 158, 11, 0.13)",
                    }}
                  >
                    <div className="w-9 h-9 rounded-full bg-amber-400/20 border border-amber-400 flex items-center justify-center shrink-0 text-base">
                      👳‍♂️
                    </div>
                    <div className="space-y-0.5">
                      <div className="font-extrabold text-amber-300 uppercase tracking-wider text-[11px]">
                        Mufti Sahib&apos;s Ishara (Phone-a-Scholar)
                      </div>
                      <p className="text-white/95 leading-relaxed">
                        &ldquo;Assalamu Alaikum! Reflect on this key clue:{" "}
                        <strong>{question.isharaHint}</strong>&rdquo;
                      </p>
                    </div>
                  </motion.div>
                )}

                {showPoll && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-4 rounded-2xl border space-y-2.5"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "rgba(4, 12, 35, 0.65)",
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-extrabold uppercase tracking-wider text-[#DF98FA]">
                      <span>📊 Live Ijma&apos; Studio Audience Poll</span>
                      <span>100% Verified Votes</span>
                    </div>
                    <div className="grid grid-cols-4 gap-3 items-end h-28 pt-2">
                      {effectivePoll.map((pct, i) => {
                        const elim = eliminatedOpts.includes(i);
                        return (
                          <div
                            key={i}
                            className={`flex flex-col items-center justify-end h-full gap-1 ${
                              elim ? "opacity-25" : ""
                            }`}
                          >
                            <span className="text-xs font-extrabold tabular-nums text-amber-300">
                              {pct}%
                            </span>
                            <div className="w-full max-w-[42px] bg-white/10 rounded-t-lg overflow-hidden flex items-end h-16">
                              <motion.div
                                initial={{ height: 0 }}
                                animate={{ height: `${pct}%` }}
                                transition={{ duration: 0.75, ease: "easeOut" }}
                                className="w-full rounded-t-lg bg-gradient-to-t from-[#9055FF] to-[#DF98FA]"
                              />
                            </div>
                            <span className="text-xs font-extrabold text-white">
                              {String.fromCharCode(65 + i)}
                            </span>
                          </div>
                        );
                      })}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* KBC 2x2 BEVELED OPTION PODS WITH STAGGERED ENTRANCE */}
              <motion.div
                key={`opts-${question.id}`}
                initial="hidden"
                animate="visible"
                variants={{
                  hidden: {},
                  visible: { transition: { staggerChildren: 0.08 } },
                }}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {question.options.map((opt, idx) => {
                  const isElim = eliminatedOpts.includes(idx);
                  const isSel = selectedOpt === idx;
                  const isCorr = idx === question.correctIdx;

                  let borderCol = "rgba(161, 156, 197, 0.25)";
                  let bgCol = "rgba(9, 25, 69, 0.78)";
                  let badgeBg = "rgba(245, 158, 11, 0.14)";
                  let badgeText = "#FBBF24";
                  let glowShadow = "none";

                  if (outcome !== "playing" && outcome !== "walked") {
                    if (isCorr) {
                      borderCol = "#10B981";
                      bgCol = "rgba(16, 185, 129, 0.24)";
                      badgeBg = "#10B981";
                      badgeText = "#FFFFFF";
                      glowShadow = "0 0 24px rgba(16, 185, 129, 0.4)";
                    } else if (isSel) {
                      borderCol = "#EF4444";
                      bgCol = "rgba(239, 68, 68, 0.24)";
                      badgeBg = "#EF4444";
                      badgeText = "#FFFFFF";
                    }
                  } else if (isSel) {
                    borderCol = "#F59E0B";
                    bgCol = isLocking
                      ? "rgba(245, 158, 11, 0.36)"
                      : "rgba(245, 158, 11, 0.2)";
                    badgeBg = "#F59E0B";
                    badgeText = "#000000";
                    glowShadow = "0 0 22px rgba(245, 158, 11, 0.35)";
                  }

                  return (
                    <motion.button
                      key={`${question.id}-${idx}`}
                      variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 },
                      }}
                      whileHover={
                        !isElim && outcome === "playing" && !isLocking
                          ? { scale: 1.015 }
                          : {}
                      }
                      whileTap={
                        !isElim && outcome === "playing" && !isLocking
                          ? { scale: 0.98 }
                          : {}
                      }
                      type="button"
                      disabled={isElim || outcome !== "playing" || isLocking}
                      onClick={() => handleOptionSelect(idx)}
                      onDoubleClick={() => {
                        if (!isElim && outcome === "playing" && !isLocking) {
                          handleOptionSelect(idx);
                          lockInAnswer(idx);
                        }
                      }}
                      className={`relative p-3.5 sm:p-4 rounded-2xl border-2 text-start text-sm font-semibold flex items-center gap-3.5 cursor-pointer disabled:opacity-20 transition-colors overflow-hidden ${
                        isLocking && isSel ? "animate-pulse" : ""
                      }`}
                      style={{
                        borderColor: borderCol,
                        backgroundColor: bgCol,
                        boxShadow: glowShadow,
                      }}
                    >
                      {/* Diamond KBC Letter Badge */}
                      <span
                        className="w-7 h-7 rounded-lg rotate-45 flex items-center justify-center shrink-0 border transition-colors"
                        style={{
                          borderColor: borderCol,
                          backgroundColor: badgeBg,
                          color: badgeText,
                        }}
                      >
                        <span className="-rotate-45 text-xs font-extrabold">
                          {String.fromCharCode(65 + idx)}
                        </span>
                      </span>

                      <span className="leading-snug text-white flex-1">
                        {isElim ? "— Eliminated —" : opt}
                      </span>

                      {outcome !== "playing" && outcome !== "walked" && isCorr && (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      )}
                    </motion.button>
                  );
                })}
              </motion.div>

              {/* DRAMATIC "COMPUTER JI, LOCK KIYA JAYE!" SUSPENSE BAR */}
              <AnimatePresence>
                {outcome === "playing" && selectedOpt !== null && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 6 }}
                    className="p-4 rounded-2xl border-2 space-y-2.5 relative overflow-hidden"
                    style={{
                      borderColor: "#F59E0B",
                      backgroundColor: "rgba(245, 158, 11, 0.14)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <div className="text-xs sm:text-sm font-extrabold text-white">
                        {isLocking ? (
                          <span className="text-amber-300">
                            🔒 Computer ji Option{" "}
                            {String.fromCharCode(65 + selectedOpt)} lock kar rahe hain...
                          </span>
                        ) : (
                          <>
                            Option{" "}
                            <span className="text-amber-300">
                              {String.fromCharCode(65 + selectedOpt)}
                            </span>{" "}
                            selected —{" "}
                            <span className="text-amber-300">
                              Computer ji, Lock Kiya Jaye?
                            </span>
                          </>
                        )}
                      </div>
                      <button
                        type="button"
                        disabled={isLocking}
                        onClick={() => lockInAnswer(selectedOpt)}
                        className="px-5 py-2.5 rounded-xl text-xs font-extrabold bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 cursor-pointer inline-flex items-center gap-1.5 hover:brightness-110 active:scale-95 transition-all disabled:opacity-60 shadow-lg"
                      >
                        <Lock className="w-3.5 h-3.5" />
                        <span>{isLocking ? "Suspense..." : "Lock Kiya Jaye!"}</span>
                      </button>
                    </div>

                    {/* Animated Suspense Laser Progress Bar while locking */}
                    {isLocking && (
                      <div className="h-1.5 w-full rounded-full bg-black/40 overflow-hidden">
                        <motion.div
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{
                            duration: dramaticMode ? 1.4 : 0.45,
                            ease: "easeInOut",
                          }}
                          className="h-full bg-gradient-to-r from-amber-300 via-orange-400 to-emerald-400"
                        />
                      </div>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>

              {/* SCHOLARLY DALIL & OUTCOME REVEAL PANEL */}
              <AnimatePresence>
                {outcome !== "playing" && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="p-5 rounded-2xl border-2 space-y-3"
                    style={{
                      borderColor:
                        outcome === "wrong"
                          ? "rgba(239, 68, 68, 0.55)"
                          : outcome === "won"
                          ? "#FBBF24"
                          : "rgba(16, 185, 129, 0.55)",
                      backgroundColor: "rgba(4, 12, 35, 0.78)",
                    }}
                  >
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2 font-extrabold text-sm sm:text-base">
                        {outcome === "wrong" ? (
                          <>
                            <XCircle className="w-5 h-5 text-red-400 shrink-0" />
                            <span className="text-red-300">
                              {secondsLeft === 0 ? "Waqt Khatam!" : "Galat Jawab"} —
                              Banked {(bankedXp ?? 0).toLocaleString()} XP
                            </span>
                          </>
                        ) : outcome === "walked" ? (
                          <>
                            <Award className="w-5 h-5 text-amber-400 shrink-0" />
                            <span className="text-amber-300">
                              Mubarak! +{(bankedXp ?? 0).toLocaleString()} Ilm XP
                              Safely Claimed
                            </span>
                          </>
                        ) : outcome === "won" ? (
                          <>
                            <Crown className="w-5 h-5 text-amber-400 shrink-0" />
                            <span className="text-amber-300">
                              Taj-e-Sahib-e-Ilm Won! +
                              {(bankedXp ?? 0).toLocaleString()} Total XP!
                            </span>
                          </>
                        ) : (
                          <>
                            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                            <span className="text-emerald-300">
                              Sahi Jawab!{" "}
                              {isLadder && SAFE_TIERS.includes(tierIdx)
                                ? "★ Safe Padav Secured • "
                                : ""}
                              {runXp.toLocaleString()} XP
                            </span>
                          </>
                        )}
                      </div>

                      {(outcome === "won" ||
                        outcome === "walked" ||
                        outcome === "wrong") && (
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => setSanadOpen(true)}
                            className="px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/40 text-amber-300 text-xs font-bold inline-flex items-center gap-1 cursor-pointer hover:brightness-110"
                          >
                            <Award className="w-3.5 h-3.5" />
                            <span>View Sanad</span>
                          </button>
                          <button
                            type="button"
                            onClick={copyCertificate}
                            className="px-2.5 py-1.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1 cursor-pointer"
                            style={{ borderColor: "var(--border-hairline)" }}
                          >
                            {copiedScore ? (
                              <Check className="w-3.5 h-3.5 text-emerald-400" />
                            ) : (
                              <Copy className="w-3.5 h-3.5" />
                            )}
                            <span>{copiedScore ? "Copied" : "Share"}</span>
                          </button>
                        </div>
                      )}
                    </div>

                    {outcome !== "walked" && (
                      <div className="p-3.5 rounded-xl bg-white/[0.04] border border-white/10 text-xs leading-relaxed text-white/90 flex items-start gap-2.5">
                        <BookOpen className="w-4 h-4 text-[#DF98FA] shrink-0 mt-0.5" />
                        <div>
                          <strong className="text-[#DF98FA]">
                            Scholarly Dalil &amp; Explanation:
                          </strong>{" "}
                          {question.proofExplanation}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                      <Link
                        href={question.proofLink}
                        className="text-xs font-bold inline-flex items-center gap-1 hover:underline text-[#DF98FA]"
                      >
                        <span>{question.proofLinkLabel}</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>

                      {outcome === "correct" ? (
                        <button
                          type="button"
                          onClick={nextTier}
                          className="btn-primary px-5 py-2.5 rounded-xl text-xs font-extrabold cursor-pointer inline-flex items-center gap-1.5"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>
                            Next Sawal (
                            {isLadder
                              ? `Level ${tierIdx + 2}`
                              : `Blitz ${tierIdx + 2}/${totalSteps}`}
                            ) →
                          </span>
                        </button>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startNewRun(categoryFilter, runFormat)}
                          className="btn-primary px-5 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                          <span>New Randomized Hot Seat</span>
                        </button>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Hotkeys:{" "}
                <kbd
                  className="px-1.5 py-0.5 rounded border"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  A–D
                </kbd>{" "}
                select •{" "}
                <kbd
                  className="px-1.5 py-0.5 rounded border"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  Enter
                </kbd>{" "}
                Lock / Next • Double-click option to instant-lock •{" "}
                <kbd
                  className="px-1.5 py-0.5 rounded border"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  H
                </kbd>{" "}
                Scholar Call
              </p>
            </div>
          </motion.section>

          {/* RIGHT SIDEBAR: ANIMATED 15-TIER KBC PRIZE TREE */}
          <aside className="lg:col-span-4 bento-card p-5 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--border-hairline)" }}>
              <div>
                <h2 className="text-sm font-extrabold">
                  {isLadder
                    ? "15-Level Sahib-e-Ilm Tree"
                    : `20-Question Blitz (${answeredCount}/20)`}
                </h2>
                <p className="text-[10px]" style={{ color: "var(--text-muted)" }}>
                  {isLadder
                    ? "20 Unique Questions in Every Level"
                    : `Speed Bonus Collected: +${speedBonusTotal} XP`}
                </p>
              </div>
              {isLadder && (
                <span className="text-[10px] font-extrabold uppercase tracking-wider text-amber-400">
                  ★ Safe Padav
                </span>
              )}
            </div>

            {isLadder ? (
              <div className="space-y-1 flex flex-col-reverse">
                {TIER_REWARDS.map((pts, i) => {
                  const isSafe = SAFE_TIERS.includes(i);
                  const isCurrent = i === tierIdx;
                  const isPassed =
                    i < tierIdx ||
                    (i === tierIdx && (outcome === "correct" || outcome === "won"));
                  return (
                    <motion.div
                      key={i}
                      animate={isCurrent ? { x: [0, 3, 0] } : { x: 0 }}
                      transition={{
                        duration: 1.8,
                        repeat: isCurrent ? Infinity : 0,
                      }}
                      className="px-3 py-1.5 rounded-xl text-xs flex items-center justify-between border transition-all"
                      style={{
                        borderColor: isCurrent
                          ? "#F59E0B"
                          : isSafe
                          ? "rgba(245, 158, 11, 0.3)"
                          : "transparent",
                        backgroundColor: isCurrent
                          ? "rgba(245, 158, 11, 0.24)"
                          : isPassed
                          ? "rgba(16, 185, 129, 0.12)"
                          : "transparent",
                        color: isCurrent
                          ? "#FBBF24"
                          : isSafe
                          ? "#F9B091"
                          : isPassed
                          ? "#4ADE80"
                          : "var(--text-muted)",
                        fontWeight: isCurrent || isSafe ? 800 : 500,
                      }}
                    >
                      <span className="flex items-center gap-2 tabular-nums min-w-0">
                        <span className="w-5 text-end opacity-80">{i + 1}</span>
                        <span>
                          {i === 14 ? "👑" : isSafe ? "★" : isPassed ? "✓" : "•"}
                        </span>
                        <span className="text-[10px] truncate opacity-80 font-semibold">
                          {TIER_TITLES[i].replace("★ ", "").replace("👑 ", "")}
                        </span>
                      </span>
                      <span className="tabular-nums shrink-0">
                        {pts.toLocaleString()} XP
                      </span>
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              <div className="grid grid-cols-4 gap-1.5 pt-1">
                {deck.map((q, i) => {
                  const isCurrent = i === tierIdx;
                  const isPassed =
                    i < tierIdx ||
                    (i === tierIdx && (outcome === "correct" || outcome === "won"));
                  return (
                    <div
                      key={`${q.id}-${i}`}
                      className="p-2 rounded-xl border text-center text-xs font-bold tabular-nums"
                      style={{
                        borderColor: isCurrent
                          ? "#F59E0B"
                          : isPassed
                          ? "#10B981"
                          : "var(--border-hairline)",
                        backgroundColor: isCurrent
                          ? "rgba(245, 158, 11, 0.22)"
                          : isPassed
                          ? "rgba(16, 185, 129, 0.14)"
                          : "var(--bg-muted)",
                        color: isCurrent
                          ? "#FBBF24"
                          : isPassed
                          ? "#4ADE80"
                          : "var(--text-muted)",
                      }}
                    >
                      <div>Q{i + 1}</div>
                      <div className="text-[9px] opacity-75">L{q.tier}</div>
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
