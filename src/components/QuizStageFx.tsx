"use client";

import React, { useEffect, useRef } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Award, Check, Copy, Crown, Flame, Sparkles, Trophy, X } from "lucide-react";
import { IlmRankInfo, QUIZ_MEDALS } from "@/lib/quiz-fx";
import { useApp } from "@/lib/store";
import type { LangCode } from "@/lib/i18n";

const SANAD_UI: Record<
  LangCode,
  {
    grandCrown: string;
    sanadTitle: string;
    wonHeading: string;
    walkedHeading: string;
    wrongHeading: string;
    presentedTo: string;
    stageLabel: string;
    pointsLabel: string;
    speedBonus: string;
    streakLabel: string;
    masteredLabel: string;
    medalsLabel: string;
    copied: string;
    copySummary: string;
    playAgain: string;
  }
> = {
  en: {
    grandCrown: "Crown of Sacred Knowledge",
    sanadTitle: "Sanad-e-Sahib-e-Ilm",
    wonHeading: "Taj-e-Sahib-e-Ilm Attained",
    walkedHeading: "Honored Seeker of Knowledge",
    wrongHeading: "Steadfast Student of Sacred Ilm",
    presentedTo: "Presented to",
    stageLabel: "Stages",
    pointsLabel: "Ilm Score",
    speedBonus: "Swift Recall",
    streakLabel: "Peak Streak",
    masteredLabel: "Mastered",
    medalsLabel: "Scholarly Honors",
    copied: "Sanad Copied",
    copySummary: "Share Sanad",
    playAgain: "Begin Another Session",
  },
  ur: {
    grandCrown: "تاجِ صاحبِ علم",
    sanadTitle: "سندِ صاحبِ علم",
    wonHeading: "تاجِ صاحبِ علم سر انجام پایا",
    walkedHeading: "معزز طالبِ علمِ دین",
    wrongHeading: "سفرِ علمِ دین کا باہمت مسافر",
    presentedTo: "پیش خدمت",
    stageLabel: "مراحل",
    pointsLabel: "علمی اسکور",
    speedBonus: "برجستہ جواب",
    streakLabel: "بہترین تسلسل",
    masteredLabel: "مکمل مسائل",
    medalsLabel: "علمی اعزازات",
    copied: "سند کاپی ہو گئی",
    copySummary: "سند شیئر کریں",
    playAgain: "نئی نشست شروع کریں",
  },
  ar: {
    grandCrown: "تاج صاحب العلم",
    sanadTitle: "سند صاحب العلم",
    wonHeading: "نلتَ تاج صاحب العلم",
    walkedHeading: "طالب علمٍ مكرّم",
    wrongHeading: "سالكٌ مثابر في طلب العلم",
    presentedTo: "يُمنح إلى",
    stageLabel: "المراحل",
    pointsLabel: "رصيد العلم",
    speedBonus: "سرعة البديهة",
    streakLabel: "أعلى سلسلة",
    masteredLabel: "المسائل المتقنة",
    medalsLabel: "الأوسمة العلمية",
    copied: "تم نسخ السند",
    copySummary: "مشاركة السند",
    playAgain: "بدء جلسة جديدة",
  },
  ro_ur: {
    grandCrown: "Taj-e-Sahib-e-Ilm",
    sanadTitle: "Sanad-e-Sahib-e-Ilm",
    wonHeading: "Taj-e-Sahib-e-Ilm Mukammal!",
    walkedHeading: "Muazzaz Talib-e-Ilm",
    wrongHeading: "Ilm-e-Deen Ka Ba-Himmat Musafir",
    presentedTo: "Pesh-e-Khidmat",
    stageLabel: "Marahil",
    pointsLabel: "Ilmi Score",
    speedBonus: "Tez Jawab",
    streakLabel: "Behtareen Silsila",
    masteredLabel: "Masail Mukammal",
    medalsLabel: "Ilmi Aizazaat",
    copied: "Sanad Copy Ho Gayi",
    copySummary: "Sanad Share Karein",
    playAgain: "Nayi Nishast Shuru Karein",
  },
  hi: {
    grandCrown: "ताज-ए-साहिब-ए-इल्म",
    sanadTitle: "सनद-ए-साहिब-ए-इल्म",
    wonHeading: "ताज-ए-साहिब-ए-इल्म हासिल!",
    walkedHeading: "सम्मानित तालिब-ए-इल्म",
    wrongHeading: "इल्म-ए-दीन का सच्चा तालिब",
    presentedTo: "भेंट",
    stageLabel: "चरण",
    pointsLabel: "इल्मी स्कोर",
    speedBonus: "तेज़ जवाब",
    streakLabel: "सर्वश्रेष्ठ क्रम",
    masteredLabel: "मसाइल पूर्ण",
    medalsLabel: "इल्मी सम्मान",
    copied: "सनद कॉपी हो गई",
    copySummary: "सनद साझा करें",
    playAgain: "नया सत्र शुरू करें",
  },
  tr: {
    grandCrown: "Sâhib-i İlim Tacı",
    sanadTitle: "Sâhib-i İlim İcâzeti",
    wonHeading: "Sâhib-i İlim Tacı Kazanıldı",
    walkedHeading: "Muhterem İlim Talebesi",
    wrongHeading: "Azimli İlim Yolcusu",
    presentedTo: "Takdim edilen",
    stageLabel: "Aşamalar",
    pointsLabel: "İlim Puanı",
    speedBonus: "Hızlı Cevap",
    streakLabel: "En İyi Seri",
    masteredLabel: "Tamamlanan",
    medalsLabel: "İlmî Nişanlar",
    copied: "İcâzet Kopyalandı",
    copySummary: "İcâzeti Paylaş",
    playAgain: "Yeni Oturum Başlat",
  },
  bn: {
    grandCrown: "তাজ-এ-সাহেবে ইলম",
    sanadTitle: "সনদ-এ-সাহেবে ইলম",
    wonHeading: "তাজ-এ-সাহেবে ইলম অর্জিত!",
    walkedHeading: "সম্মানিত ইলম অন্বেষী",
    wrongHeading: "ইলমে দ্বীনের অবিচল শিক্ষার্থী",
    presentedTo: "প্রাপক",
    stageLabel: "ধাপসমূহ",
    pointsLabel: "ইলমি স্কোর",
    speedBonus: "দ্রুত উত্তর",
    streakLabel: "সর্বোচ্চ ধারা",
    masteredLabel: "আয়ত্তকৃত মাসআলা",
    medalsLabel: "ইলমি সম্মাননা",
    copied: "সনদ কপি হয়েছে",
    copySummary: "সনদ শেয়ার করুন",
    playAgain: "নতুন পর্ব শুরু করুন",
  },
  fa: {
    grandCrown: "تاج صاحب علم",
    sanadTitle: "سند صاحب علم",
    wonHeading: "تاج صاحب علم کسب شد",
    walkedHeading: "طالب گرامی علم دین",
    wrongHeading: "رهرو استوار دانش دینی",
    presentedTo: "تقدیم به",
    stageLabel: "مراحل",
    pointsLabel: "امتیاز علمی",
    speedBonus: "پاسخ سریع",
    streakLabel: "بهترین پیوستگی",
    masteredLabel: "مسائل آموخته",
    medalsLabel: "نشان‌های علمی",
    copied: "سند کپی شد",
    copySummary: "اشتراک‌گذاری سند",
    playAgain: "آغاز نشست تازه",
  },
  id: {
    grandCrown: "Mahkota Sahib-e-Ilm",
    sanadTitle: "Sanad Sahib-e-Ilm",
    wonHeading: "Mahkota Sahib-e-Ilm Diraih",
    walkedHeading: "Penuntut Ilmu Mulia",
    wrongHeading: "Pelajar Ilmu Syar'i yang Tekun",
    presentedTo: "Diberikan kepada",
    stageLabel: "Tahap",
    pointsLabel: "Skor Ilmu",
    speedBonus: "Jawab Cepat",
    streakLabel: "Runtunan Terbaik",
    masteredLabel: "Masail Dikuasai",
    medalsLabel: "Penghargaan Ilmiah",
    copied: "Sanad Tersalin",
    copySummary: "Bagikan Sanad",
    playAgain: "Mulai Sesi Baru",
  },
  fr: {
    grandCrown: "Couronne de Sahib-e-Ilm",
    sanadTitle: "Sanad de Sahib-e-Ilm",
    wonHeading: "Couronne de Sahib-e-Ilm Acquise",
    walkedHeading: "Noble Chercheur du Savoir",
    wrongHeading: "Étudiant Persévérant en Sciences Sacrées",
    presentedTo: "Décerné à",
    stageLabel: "Étapes",
    pointsLabel: "Score d'Ilm",
    speedBonus: "Réponse Rapide",
    streakLabel: "Meilleure Série",
    masteredLabel: "Questions Maîtrisées",
    medalsLabel: "Distinctions Savantes",
    copied: "Sanad Copié",
    copySummary: "Partager le Sanad",
    playAgain: "Nouvelle Session",
  },
};

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
        p.vy += 0.19;
        p.vx *= 0.988;
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
      ? "rgba(239, 68, 68, 0.2)"
      : mood === "locking"
      ? "rgba(245, 158, 11, 0.24)"
      : mood === "correct"
      ? "rgba(16, 185, 129, 0.22)"
      : mood === "milestone"
      ? "rgba(251, 191, 36, 0.28)"
      : "rgba(164, 74, 255, 0.14)";

  const secondaryBeam =
    mood === "urgent" || mood === "wrong"
      ? "rgba(248, 113, 113, 0.12)"
      : mood === "correct"
      ? "rgba(251, 191, 36, 0.15)"
      : "rgba(249, 176, 145, 0.12)";

  return (
    <div
      className="absolute inset-0 pointer-events-none overflow-hidden rounded-[inherit]"
      aria-hidden="true"
    >
      <motion.div
        animate={{
          rotate: mood === "locking" ? [-12, 12, -12] : [-20, -6, -20],
          opacity: mood === "locking" ? [0.55, 0.9, 0.55] : [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: mood === "locking" ? 1.5 : 8,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformOrigin: "20% 0%",
          background: `conic-gradient(from 155deg at 20% 0%, transparent 0deg, ${beamColor} 22deg, transparent 46deg)`,
        }}
        className="absolute -top-10 -left-16 w-[130%] h-[130%]"
      />

      <motion.div
        animate={{
          rotate: mood === "locking" ? [12, -12, 12] : [20, 6, 20],
          opacity: mood === "locking" ? [0.55, 0.9, 0.55] : [0.35, 0.65, 0.35],
        }}
        transition={{
          duration: mood === "locking" ? 1.5 : 8.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
        style={{
          transformOrigin: "80% 0%",
          background: `conic-gradient(from 160deg at 80% 0%, transparent 0deg, ${secondaryBeam} 24deg, transparent 48deg)`,
        }}
        className="absolute -top-10 -right-16 w-[130%] h-[130%]"
      />

      <motion.svg
        animate={{ rotate: 360 }}
        transition={{ duration: 95, repeat: Infinity, ease: "linear" }}
        viewBox="0 0 200 200"
        className="absolute -right-20 -bottom-20 w-72 h-72 opacity-[0.04]"
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

      {mood === "urgent" && (
        <motion.div
          animate={{ opacity: [0.1, 0.35, 0.1] }}
          transition={{ duration: 0.9, repeat: Infinity }}
          className="absolute inset-0 rounded-[inherit]"
          style={{
            boxShadow: "inset 0 0 55px rgba(239, 68, 68, 0.45)",
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
              initial={{ opacity: 0, y: 24, scale: 0.86 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 360, damping: 24 }}
              className={`px-4 py-2 rounded-2xl border bg-gradient-to-r shadow-xl ${colors}`}
            >
              <div className="text-xs sm:text-sm font-bold flex items-center gap-1.5">
                <Sparkles className="w-4 h-4 shrink-0" />
                <span>{item.label}</span>
              </div>
              {item.sublabel && (
                <div className="text-[11px] font-medium opacity-85">{item.sublabel}</div>
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
  const { lang } = useApp();
  if (!open) return null;
  const L = SANAD_UI[lang] ?? SANAD_UI.en;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-black/75 backdrop-blur-md flex items-center justify-center p-4"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.94, y: 12 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="max-w-xl w-full rounded-3xl border p-6 sm:p-7 relative overflow-hidden shadow-2xl"
        style={{
          backgroundColor: "var(--bg-surface)",
          borderColor:
            outcome === "won" ? "var(--accent-gold)" : "var(--border-hairline)",
          backgroundImage:
            "radial-gradient(circle at 50% 0%, color-mix(in srgb, var(--accent-gold) 14%, transparent), transparent 65%)",
        }}
      >
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute top-4 end-4 p-2 rounded-full transition-colors cursor-pointer"
          style={{
            backgroundColor: "var(--bg-elevated)",
            color: "var(--text-secondary)",
          }}
        >
          <X className="w-4 h-4" />
        </button>

        <div className="text-center space-y-2">
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full border text-[11px] font-semibold"
            style={{
              backgroundColor:
                "color-mix(in srgb, var(--accent-gold) 12%, transparent)",
              borderColor:
                "color-mix(in srgb, var(--accent-gold) 35%, transparent)",
              color: "var(--accent-gold)",
            }}
          >
            {outcome === "won" ? (
              <>
                <Crown className="w-3.5 h-3.5" /> {L.grandCrown}
              </>
            ) : (
              <>
                <Award className="w-3.5 h-3.5" /> {L.sanadTitle}
              </>
            )}
          </div>

          <p
            className="font-arabic text-2xl"
            style={{ color: "var(--accent-gold)" }}
          >
            بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيمِ
          </p>
          <h3
            className="text-2xl font-bold"
            style={{ color: "var(--text-primary)" }}
          >
            {outcome === "won"
              ? L.wonHeading
              : outcome === "walked"
              ? L.walkedHeading
              : L.wrongHeading}
          </h3>
          <p className="text-xs" style={{ color: "var(--text-secondary)" }}>
            {L.presentedTo}{" "}
            <strong style={{ color: "var(--text-primary)" }}>{playerName}</strong>{" "}
            •{" "}
            <span style={{ color: rank.color }} className="font-semibold">
              {rank.title}{" "}
              <span className="font-arabic">({rank.arabicTitle})</span>
            </span>
          </p>
        </div>

        <div
          className="grid grid-cols-2 sm:grid-cols-4 divide-y sm:divide-y-0 sm:divide-x rounded-2xl border my-5 overflow-hidden"
          style={{
            backgroundColor: "var(--bg-elevated)",
            borderColor: "var(--border-hairline)",
          }}
        >
          <div
            className="p-3.5 text-center"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            <div
              className="text-[11px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {L.stageLabel}
            </div>
            <div
              className="text-base font-bold mt-0.5 tabular-nums"
              style={{ color: "var(--text-primary)" }}
            >
              {answeredCount}/{totalSteps}
            </div>
            <div
              className="text-[11px] truncate"
              style={{ color: "var(--accent-primary)" }}
            >
              {modeLabel}
            </div>
          </div>

          <div
            className="p-3.5 text-center"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            <div
              className="text-[11px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {L.pointsLabel}
            </div>
            <div
              className="text-base font-bold mt-0.5 tabular-nums"
              style={{ color: "var(--accent-gold)" }}
            >
              +{bankedXp.toLocaleString()}
            </div>
            <div
              className="text-[11px] tabular-nums"
              style={{ color: "var(--accent-emerald)" }}
            >
              +{speedBonusXp.toLocaleString()} {L.speedBonus}
            </div>
          </div>

          <div
            className="p-3.5 text-center"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            <div
              className="text-[11px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {L.streakLabel}
            </div>
            <div
              className="text-base font-bold mt-0.5 inline-flex items-center justify-center gap-1 tabular-nums"
              style={{ color: "var(--accent-gold)" }}
            >
              <Flame className="w-4 h-4" /> {peakStreak}x
            </div>
          </div>

          <div
            className="p-3.5 text-center"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            <div
              className="text-[11px]"
              style={{ color: "var(--text-secondary)" }}
            >
              {L.masteredLabel}
            </div>
            <div
              className="text-base font-bold mt-0.5 tabular-nums"
              style={{ color: "var(--text-primary)" }}
            >
              {masteredCount}/300
            </div>
          </div>
        </div>

        {unlockedMedals.length > 0 && (
          <div className="mb-5">
            <div
              className="text-xs font-semibold mb-2 text-center"
              style={{ color: "var(--text-secondary)" }}
            >
              {L.medalsLabel} ({unlockedMedals.length}/{QUIZ_MEDALS.length})
            </div>
            <div className="flex flex-wrap justify-center gap-1.5">
              {QUIZ_MEDALS.filter((m) => unlockedMedals.includes(m.id)).map(
                (m) => (
                  <span
                    key={m.id}
                    className="px-3 py-1 rounded-full border text-xs font-medium inline-flex items-center gap-1.5"
                    style={{
                      backgroundColor:
                        "color-mix(in srgb, var(--accent-gold) 10%, transparent)",
                      borderColor:
                        "color-mix(in srgb, var(--accent-gold) 30%, transparent)",
                      color: "var(--text-primary)",
                    }}
                  >
                    <Award
                      className="w-3.5 h-3.5 shrink-0"
                      style={{ color: "var(--accent-gold)" }}
                    />
                    <span>{m.title}</span>
                  </span>
                )
              )}
            </div>
          </div>
        )}

        <div
          className="flex flex-wrap items-center justify-between gap-3 pt-4 border-t"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <button
            type="button"
            onClick={onCopyShare}
            className="px-4 py-2.5 rounded-xl border text-xs font-semibold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
            style={{
              backgroundColor: "var(--bg-elevated)",
              borderColor: "var(--border-hairline)",
              color: "var(--text-primary)",
            }}
          >
            {copied ? (
              <>
                <Check
                  className="w-4 h-4"
                  style={{ color: "var(--accent-emerald)" }}
                />{" "}
                {L.copied}
              </>
            ) : (
              <>
                <Copy
                  className="w-4 h-4"
                  style={{ color: "var(--accent-primary)" }}
                />{" "}
                {L.copySummary}
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => {
              onClose();
              onPlayAgain();
            }}
            className="btn-primary px-5 py-2.5 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
          >
            <Trophy className="w-4 h-4" /> {L.playAgain}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
