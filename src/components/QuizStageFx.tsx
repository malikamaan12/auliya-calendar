"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Check, Copy, Crown, Sparkles, Trophy, X } from "lucide-react";
import { IlmRankInfo, QUIZ_MEDALS } from "@/lib/quiz-fx";

export type ParticleBurstKind = "none" | "sparkle" | "padav" | "grand_crown";

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  alpha: number;
  decay: number;
  rotation: number;
  vRot: number;
  shape: "rect" | "circle" | "star";
}

export function QuizConfettiCanvas({
  burstKind,
  burstId,
}: {
  burstKind: ParticleBurstKind;
  burstId: number;
}) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (burstKind === "none" || burstId === 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();

    const palette =
      burstKind === "grand_crown"
        ? ["#FBBF24", "#F59E0B", "#DF98FA", "#4ADE80", "#F9B091", "#FFFFFF"]
        : burstKind === "padav"
        ? ["#FBBF24", "#DF98FA", "#A44AFF", "#4ADE80"]
        : ["#4ADE80", "#FBBF24", "#DF98FA", "#38BDF8"];

    const particles: Particle[] = [];

    const spawnBurst = (cx: number, cy: number, count: number, power: number) => {
      const shapes: Particle["shape"][] = ["rect", "circle", "star"];
      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = (0.35 + Math.random() * 0.95) * power;
        particles.push({
          x: cx,
          y: cy,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed - Math.random() * 3.2,
          size: 4 + Math.random() * 6,
          color: palette[Math.floor(Math.random() * palette.length)],
          alpha: 1,
          decay:
            burstKind === "grand_crown"
              ? 0.008 + Math.random() * 0.007
              : 0.014 + Math.random() * 0.01,
          rotation: Math.random() * Math.PI * 2,
          vRot: (Math.random() - 0.5) * 0.22,
          shape: shapes[i % shapes.length],
        });
      }
    };

    const w = window.innerWidth;
    const h = window.innerHeight;

    if (burstKind === "sparkle") {
      spawnBurst(w * 0.5, h * 0.42, 55, 8.5);
    } else if (burstKind === "padav") {
      spawnBurst(w * 0.32, h * 0.35, 65, 10.5);
      spawnBurst(w * 0.68, h * 0.35, 65, 10.5);
    } else if (burstKind === "grand_crown") {
      spawnBurst(w * 0.5, h * 0.3, 95, 12.5);
      spawnBurst(w * 0.25, h * 0.42, 70, 11);
      spawnBurst(w * 0.75, h * 0.42, 70, 11);
    }

    let rafId = 0;
    const drawStar = (cx: number, cy: number, r: number) => {
      ctx.beginPath();
      for (let i = 0; i < 5; i++) {
        const a = (i * 4 * Math.PI) / 5 - Math.PI / 2;
        const px = cx + Math.cos(a) * r;
        const py = cy + Math.sin(a) * r;
        if (i === 0) ctx.moveTo(px, py);
        else ctx.lineTo(px, py);
      }
      ctx.closePath();
      ctx.fill();
    };

    const tick = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      let alive = 0;
      for (const p of particles) {
        if (p.alpha <= 0.01) continue;
        alive++;
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.19; // gravity
        p.vx *= 0.988; // air drag
        p.rotation += p.vRot;
        p.alpha -= p.decay;

        ctx.save();
        ctx.globalAlpha = Math.max(0, p.alpha);
        ctx.fillStyle = p.color;
        ctx.translate(p.x, p.y);
        ctx.rotate(p.rotation);

        if (p.shape === "rect") {
          ctx.fillRect(-p.size / 2, -p.size / 3, p.size, p.size * 0.66);
        } else if (p.shape === "circle") {
          ctx.beginPath();
          ctx.arc(0, 0, p.size * 0.45, 0, Math.PI * 2);
          ctx.fill();
        } else {
          drawStar(0, 0, p.size * 0.65);
        }
        ctx.restore();
      }
      if (alive > 0) {
        rafId = window.requestAnimationFrame(tick);
      } else {
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    rafId = window.requestAnimationFrame(tick);
    return () => window.cancelAnimationFrame(rafId);
  }, [burstKind, burstId]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-50"
      aria-hidden="true"
    />
  );
}

export type StageMood =
  | "normal"
  | "urgent"
  | "locking"
  | "correct"
  | "milestone"
  | "wrong";

export function KbcStudioBeams({ mood }: { mood: StageMood }) {
  const beamColor =
    mood === "urgent" || mood === "wrong"
      ? "rgba(239, 68, 68, 0.22)"
      : mood === "locking"
      ? "rgba(245, 158, 11, 0.28)"
      : mood === "correct"
      ? "rgba(16, 185, 129, 0.25)"
      : mood === "milestone"
      ? "rgba(251, 191, 36, 0.32)"
      : "rgba(164, 74, 255, 0.18)";

  const secondaryBeam =
    mood === "urgent" || mood === "wrong"
      ? "rgba(248, 113, 113, 0.14)"
      : mood === "correct"
      ? "rgba(251, 191, 36, 0.18)"
      : "rgba(249, 176, 145, 0.14)";

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      {/* Left Sweeping KBC Spotlight Cone */}
      <motion.div
        animate={{
          rotate: mood === "locking" ? [-14, 14, -14] : [-22, -6, -22],
          opacity: mood === "locking" ? [0.65, 1, 0.65] : [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: mood === "locking" ? 1.4 : 7,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformOrigin: "20% 0%",
          background: `conic-gradient(from 155deg at 20% 0%, transparent 0deg, ${beamColor} 22deg, transparent 46deg)`,
        }}
        className="absolute -top-10 -left-16 w-[130%] h-[130%]"
      />

      {/* Right Sweeping KBC Spotlight Cone */}
      <motion.div
        animate={{
          rotate: mood === "locking" ? [14, -14, 14] : [22, 6, 22],
          opacity: mood === "locking" ? [0.65, 1, 0.65] : [0.45, 0.75, 0.45],
        }}
        transition={{
          duration: mood === "locking" ? 1.4 : 7.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformOrigin: "80% 0%",
          background: `conic-gradient(from 160deg at 80% 0%, transparent 0deg, ${secondaryBeam} 24deg, transparent 48deg)`,
        }}
        className="absolute -top-10 -right-16 w-[130%] h-[130%]"
      />

      {/* Subtle Rotating Islamic 8-Pointed Star Studio Seal */}
      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 90, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 200 200"
        className="absolute -right-20 -bottom-20 w-72 h-72 opacity-[0.045]"
      >
        <rect
          x="45"
          y="45"
          width="110"
          height="110"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
        />
        <rect
          x="45"
          y="45"
          width="110"
          height="110"
          stroke="currentColor"
          strokeWidth="3"
          fill="none"
          transform="rotate(45 100 100)"
        />
        <circle
          cx="100"
          cy="100"
          r="36"
          stroke="currentColor"
          strokeWidth="2.5"
          fill="none"
        />
      </motion.svg>

      {/* Urgent Heartbeat Crimson Edge Vignette */}
      {mood === "urgent" && (
        <motion.div
          animate={{ opacity: [0.12, 0.42, 0.12] }}
          transition={{ duration: 0.85, repeat: Infinity }}
          className="absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow: "inset 0 0 65px rgba(239, 68, 68, 0.55)",
          }}
        />
      )}
    </div>
  );
}

export interface FloatingToastItem {
  id: number;
  label: string;
  sublabel?: string;
  tone: "gold" | "emerald" | "violet";
}

export function FloatingXpBursts({ items }: { items: FloatingToastItem[] }) {
  return (
    <div className="pointer-events-none fixed top-24 right-6 z-50 flex flex-col items-end gap-2">
      <AnimatePresence>
        {items.map((item) => {
          const colors =
            item.tone === "gold"
              ? "from-amber-400/95 to-orange-500/95 text-slate-950 border-amber-200"
              : item.tone === "emerald"
              ? "from-emerald-400/95 to-teal-500/95 text-slate-950 border-emerald-200"
              : "from-[#DF98FA]/95 to-[#9055FF]/95 text-white border-purple-200";
          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 24, scale: 0.82 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -22, scale: 0.9 }}
              transition={{ type: "spring", stiffness: 360, damping: 22 }}
              className={`px-4 py-2 rounded-2xl border bg-gradient-to-r shadow-2xl ${colors}`}
            >
              <div className="text-xs sm:text-sm font-extrabold tracking-wide flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.sublabel && (
                <div className="text-[10px] font-bold opacity-85">{item.sublabel}</div>
              )}
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
}

export function SanadCertificateModal({
  open,
  onClose,
  playerName,
  rank,
  modeLabel,
  outcome,
  answeredCount,
  totalSteps,
  bankedXp,
  speedBonusXp,
  peakStreak,
  masteredCount,
  unlockedMedals,
  onCopyShare,
  copied,
  onPlayAgain,
}: {
  open: boolean;
  onClose: () => void;
  playerName: string;
  rank: IlmRankInfo;
  modeLabel: string;
  outcome: "won" | "walked" | "wrong";
  answeredCount: number;
  totalSteps: number;
  bankedXp: number;
  speedBonusXp: number;
  peakStreak: number;
  masteredCount: number;
  unlockedMedals: string[];
  onCopyShare: () => void;
  copied: boolean;
  onPlayAgain: () => void;
}) {
  if (!open) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 16 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full rounded-3xl border-2 p-6 sm:p-7 relative overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "#121931",
          borderColor: outcome === "won" ? "#FBBF24" : "#A44AFF",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, rgba(251, 191, 36, 0.16), transparent 65%)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full bg-white/10 text-white/80 hover:text-white cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-400/15 border border-amber-400/40 text-amber-300 text-[11px] font-extrabold uppercase tracking-widest">
            {outcome === "won" ? (
              <>
                <Crown className="w-3.5 h-3.5" /> Grand Crown Sanad-e-Ilm
              </>
            ) : (
              <>
                <Award className="w-3.5 h-3.5" /> Sanad-e-Sahib-e-Ilm
              </>
            )}
          </div>

          <p className="font-arabic text-2xl text-amber-300">
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ
          </p>
          <h3 className="text-2xl font-extrabold text-white">
            {outcome === "won"
              ? "Taj-e-Sahib-e-Ilm Conquered!"
              : outcome === "walked"
              ? "Honored Hot-Seat Scholar"
              : "Noble Seeker of Sacred Knowledge"}
          </h3>
          <p className="text-xs text-[#A19CC5]">
            Presented to <strong className="text-white">{playerName}</strong> •{" "}
            <span style={{ color: rank.color }} className="font-bold">
              {rank.title} ({rank.arabicTitle})
            </span>
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 my-5">
          <div className="p-3 rounded-2xl bg-[#091945] border border-[#242F54] text-center">
            <div className="text-[10px] text-[#A19CC5] uppercase">Mode / Level</div>
            <div className="text-sm font-extrabold text-white mt-0.5">
              {answeredCount}/{totalSteps}
            </div>
            <div className="text-[10px] text-[#DF98FA] truncate">{modeLabel}</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#091945] border border-[#242F54] text-center">
            <div className="text-[10px] text-[#A19CC5] uppercase">Ilm XP Banked</div>
            <div className="text-sm font-extrabold text-amber-300 mt-0.5 tabular-nums">
              +{bankedXp.toLocaleString()}
            </div>
            <div className="text-[10px] text-emerald-400">
              +{speedBonusXp.toLocaleString()} Speed XP
            </div>
          </div>
          <div className="p-3 rounded-2xl bg-[#091945] border border-[#242F54] text-center">
            <div className="text-[10px] text-[#A19CC5] uppercase">Peak Streak</div>
            <div className="text-sm font-extrabold text-orange-300 mt-0.5">
              🔥 {peakStreak}x
            </div>
            <div className="text-[10px] text-[#A19CC5]">Noor Combo</div>
          </div>
          <div className="p-3 rounded-2xl bg-[#091945] border border-[#242F54] text-center">
            <div className="text-[10px] text-[#A19CC5] uppercase">Vault Mastered</div>
            <div className="text-sm font-extrabold text-sky-300 mt-0.5">
              {masteredCount}/300
            </div>
            <div className="text-[10px] text-[#A19CC5]">Unique Masa&apos;il</div>
          </div>
        </div>

        {unlockedMedals.length > 0 && (
          <div className="mb-5">
            <div className="text-[11px] font-bold uppercase tracking-wider text-[#A19CC5] mb-2 text-center">
              Earned Scholarly Medals ({unlockedMedals.length}/{QUIZ_MEDALS.length})
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {QUIZ_MEDALS.filter((m) => unlockedMedals.includes(m.id)).map((m) => (
                <span
                  key={m.id}
                  className="px-2.5 py-1 rounded-full bg-amber-400/10 border border-amber-400/30 text-xs font-semibold text-amber-200 flex items-center gap-1"
                >
                  <span>{m.badgeEmoji}</span>
                  <span>{m.title}</span>
                </span>
              ))}
            </div>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 pt-3 border-t border-[#242F54]">
          <button
            type="button"
            onClick={onCopyShare}
            className="px-4 py-2.5 rounded-xl bg-[#091945] border border-[#242F54] text-xs font-bold text-white hover:border-[#A44AFF] inline-flex items-center gap-1.5 cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Sanad Copied!
              </>
            ) : (
              <>
                <Copy className="w-4 h-4 text-[#DF98FA]" /> Copy Sanad Summary
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onPlayAgain();
            }}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-4 h-4" /> New Randomized Hot-Seat Run
          </button>
        </div>
      </motion.div>
    </div>
  );
}
