"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  BookOpen,
  Trophy,
  Calculator,
  ArrowRight,
  Sparkles,
  Clock,
  Scale,
  ShieldCheck,
  MapPin,
  Search,
  ChevronRight,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { formatCountdown, formatTime } from "@/lib/prayer-engine";
import { getEventsForHijri, getUpcomingEvents } from "@/lib/hijri";
import { TASBIH_LITANIES } from "@/data/fiqh-hadith";
import { HANAFI_SAJDA_ITEMS, JUZ_LIST, SURAH_LIST } from "@/data/quran";

function parseRef(ref: string): { surahNum: number; ayahNum: number } {
  const [s, a] = ref.split(":").map((n) => parseInt(n, 10));
  return {
    surahNum: Number.isFinite(s) && s >= 1 && s <= 114 ? s : 1,
    ayahNum: Number.isFinite(a) && a >= 1 ? a : 1,
  };
}

export default function DashboardPage() {
  const {
    now,
    city,
    hijri,
    schedule,
    salahToday,
    tasbihTotalToday,
    tasbihTarget,
    activeLitanyId,
    ilmPoints,
    bestQuizTier,
    lastQuranRef,
    sajdaCompleted,
    allAuliya,
    user,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"modules" | "surah" | "para" | "sajda">("modules");
  const [searchQuery, setSearchQuery] = useState("");

  const lastReadParsed = useMemo(() => parseRef(lastQuranRef || "1:1"), [lastQuranRef]);
  const lastReadSurah = useMemo(
    () => SURAH_LIST.find((s) => s.number === lastReadParsed.surahNum) ?? SURAH_LIST[0],
    [lastReadParsed.surahNum]
  );

  const todayEvents = getEventsForHijri(hijri.month, hijri.day);
  const upcomingEvents = getUpcomingEvents(hijri.month, hijri.day);
  const nextEvent = todayEvents[0] || upcomingEvents[0];
  const activeLitany = TASBIH_LITANIES.find((l) => l.id === activeLitanyId) || TASBIH_LITANIES[0];
  const fardCompletedCount = Object.values(salahToday).filter((v) => v !== "none").length;

  const moduleCards = [
    {
      href: "/quran",
      title: "Holy Quran Mushaf",
      subtitle: "604 Pages • 114 Surahs • Kanzul Iman",
      badge: `Page ${lastReadSurah.startPage}`,
      arabic: "القرآن الكريم",
      icon: BookOpen,
    },
    {
      href: "/prayer",
      title: "Prayer & Qibla",
      subtitle: `${schedule.nextPrayer.label} at ${formatTime(schedule.nextPrayer.jamaatTime)}`,
      badge: `${fardCompletedCount}/5 Logged`,
      arabic: "الصلاة والقبلة",
      icon: Clock,
    },
    {
      href: "/tasbih",
      title: "Tasbih & Litanies",
      subtitle: activeLitany.name,
      badge: `${tasbihTotalToday}/${tasbihTarget}`,
      arabic: "التسبيح والأوراد",
      icon: Sparkles,
    },
    {
      href: "/auliya",
      title: "Auliya Urs & 360°",
      subtitle: nextEvent ? nextEvent.title : `${allAuliya.length} Sunni Saints`,
      badge: todayEvents.length > 0 ? "Urs Today" : "Ziyarat",
      arabic: "أولياء الله",
      icon: Compass,
    },
    {
      href: "/quiz",
      title: "Sahib-e-Ilm Quiz",
      subtitle: bestQuizTier > 0 ? `Best: Tier ${bestQuizTier}/15` : "15-Tier KBC Challenge",
      badge: `${ilmPoints.toLocaleString()} XP`,
      arabic: "صاحب العلم",
      icon: Trophy,
    },
    {
      href: "/fiqh",
      title: "Hanafi Fiqh & Hadith",
      subtitle: "Bahar-e-Shariat • Fatawa Razawiyya",
      badge: "Rulings",
      arabic: "الفقه الحنفي",
      icon: Scale,
    },
    {
      href: "/zakat",
      title: "Hanafi Zakat",
      subtitle: "Silver Nisab (612.36g / 52.5 Tola)",
      badge: "2.5% Fard",
      arabic: "الزكاة",
      icon: Calculator,
    },
    {
      href: "/admin",
      title: "Curator Studio",
      subtitle: "Custom Auliya & Family Barsis",
      badge: "SHA-256",
      arabic: "الإدارة",
      icon: ShieldCheck,
    },
  ];

  const filteredSurahs = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) return SURAH_LIST;
    return SURAH_LIST.filter(
      (s) =>
        String(s.number).includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(searchQuery.trim())
    );
  }, [searchQuery]);

  return (
    <div className="space-y-5">
      {/* 1. Reference UI Greeting Header ("Assalamualaikum" + Bold Name) */}
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-xs sm:text-sm font-medium" style={{ color: "var(--text-muted)" }}>
            Assalamualaikum
          </p>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight mt-0.5">
            {user ? user.name : "Sunni Companion"}
          </h1>
        </div>

        <div className="text-right text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {hijri.formatted}
          </div>
          <div>{hijri.weekday}</div>
        </div>
      </div>

      {/* 2. Top Dual Hero Cards (Reference Image 2 Twilight Prayer Card + Reference Image 1 & 2 "Last Read" Lavender Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Left: Twilight Mosque & Next Prayer Card (Exact style of Image 2 top card) */}
        <Link
          href="/prayer"
          className="lg:col-span-6 twilight-hero-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[168px] group transition-transform hover:scale-[1.01]"
        >
          {/* Glowing Moon & Clouds & Mosque Silhouette SVG */}
          <svg
            aria-hidden="true"
            viewBox="0 0 500 200"
            preserveAspectRatio="xMidYMax slice"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-35"
          >
            <defs>
              <radialGradient id="moonGlow" cx="78%" cy="32%" r="28%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.95" />
                <stop offset="45%" stopColor="#DF98FA" stopOpacity="0.45" />
                <stop offset="100%" stopColor="#431B82" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="390" cy="64" r="56" fill="url(#moonGlow)" />
            <circle cx="390" cy="64" r="24" fill="#FFFDF9" opacity="0.9" />
            {/* Mosque Skyline Silhouette */}
            <path
              d="M0 200 L0 165 L45 165 L45 130 L50 112 L55 130 L55 165 L110 165 Q145 120 180 165 L235 165 L235 142 Q275 88 315 142 L315 165 L360 165 L360 118 L366 96 L372 118 L372 165 L430 165 Q455 135 480 165 L500 165 L500 200 Z"
              fill="#090D24"
            />
          </svg>

          <div className="relative z-10 flex items-center justify-between gap-2 text-xs text-purple-200">
            <span className="inline-flex items-center gap-1.5 font-semibold uppercase tracking-wider">
              <Clock className="w-3.5 h-3.5" />
              <span>{schedule.nextPrayer.label}</span>
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-white/15 text-white font-mono text-[11px]">
              in {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
            </span>
          </div>

          <div className="relative z-10 my-2">
            <div className="text-3xl sm:text-4xl font-extrabold tracking-tight tabular-nums text-white">
              {formatTime(schedule.nextPrayer.jamaatTime)}
            </div>
            <div className="mt-1 inline-flex items-center gap-1.5 text-xs text-purple-100/90">
              <MapPin className="w-3.5 h-3.5" />
              <span>
                {city.name}, {city.country} • Azan {formatTime(schedule.nextPrayer.azanTime)}
              </span>
            </div>
          </div>
        </Link>

        {/* Right: Signature Lavender-to-Violet "Last Read" Card with Open Mushaf on Rehal SVG (Exact style of Image 1 & 2) */}
        <Link
          href="/quran"
          className="lg:col-span-6 quran-gradient-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[168px] group transition-transform hover:scale-[1.01]"
        >
          {/* Decorative Open Quran on Rehal Stand SVG on the Right */}
          <svg
            aria-hidden="true"
            viewBox="0 0 220 160"
            className="pointer-events-none absolute -right-2 -bottom-3 w-44 sm:w-52 h-36 sm:h-40 opacity-95 transition-transform group-hover:scale-105"
          >
            {/* Sparkle stars */}
            <circle cx="40" cy="28" r="2.5" fill="#FFF" opacity="0.8" />
            <circle cx="185" cy="24" r="2" fill="#FFF" opacity="0.7" />
            <circle cx="150" cy="16" r="3" fill="#F9B091" />
            {/* Wooden Rehal (X-Stand) */}
            <path d="M65 145 L155 102 L162 110 L72 153 Z" fill="#4C1D95" />
            <path d="M155 145 L65 102 L58 110 L148 153 Z" fill="#3B0764" />
            {/* Golden Book Covers */}
            <path d="M38 98 Q74 82 110 102 L110 112 Q74 92 38 108 Z" fill="#F59E0B" />
            <path d="M182 98 Q146 82 110 102 L110 112 Q146 92 182 108 Z" fill="#D97706" />
            {/* White Open Mushaf Pages */}
            <path d="M42 93 Q76 75 110 97 L110 52 Q76 32 42 50 Z" fill="#FFFFFF" />
            <path d="M178 93 Q144 75 110 97 L110 52 Q144 32 178 50 Z" fill="#F3E8FF" />
            {/* Arabic Script Lines on Pages */}
            <path d="M54 60 Q76 50 98 62" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M54 70 Q76 60 98 72" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M54 80 Q76 70 98 82" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M122 62 Q144 50 166 60" stroke="#9333EA" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M122 72 Q144 60 166 70" stroke="#9333EA" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M122 82 Q144 70 166 80" stroke="#9333EA" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>

          <div className="relative z-10 inline-flex items-center gap-2 text-xs font-semibold text-white/95">
            <BookOpen className="w-4 h-4" />
            <span>Last Read</span>
          </div>

          <div className="relative z-10 my-2 max-w-[62%]">
            <h2 className="text-xl sm:text-2xl font-extrabold tracking-tight text-white truncate">
              {lastReadSurah.englishName}
            </h2>
            <p className="text-xs text-white/85 mt-0.5">
              Ayah No: {lastReadParsed.ayahNum} • Page {lastReadSurah.startPage}
            </p>
          </div>

          <div className="relative z-10">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold bg-white/20 backdrop-blur-xs text-white">
              <span>Continue read</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>
      </div>

      {/* 3. Reference UI Tab Bar ("Modules" | "Surah" | "Para" | "Sajda") */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-2" style={{ borderColor: "var(--border-hairline)" }}>
        <div className="flex items-center gap-2 overflow-x-auto">
          {(
            [
              { id: "modules", label: "All Modules" },
              { id: "surah", label: "Surah (114)" },
              { id: "para", label: "Para / Juz (30)" },
              { id: "sajda", label: `Sajda (${sajdaCompleted.length}/14)` },
            ] as const
          ).map((tab) => {
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className="px-4 py-2 rounded-full text-xs sm:text-sm font-bold whitespace-nowrap cursor-pointer transition-all"
                style={{
                  backgroundImage: active ? "var(--gradient-brand)" : undefined,
                  backgroundColor: active ? undefined : "var(--bg-muted)",
                  color: active ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

        {activeTab === "surah" && (
          <div className="relative sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Surah name or number…"
              className="w-full pl-8 pr-3 py-1.5 rounded-full border text-xs bg-transparent outline-none"
              style={{ borderColor: "var(--border-hairline)" }}
            />
          </div>
        )}
      </div>

      {/* TAB 1: ALL MODULES (Clean 1-Screen Launcher Grid) */}
      {activeTab === "modules" && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {moduleCards.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.href}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.025, duration: 0.2 }}
              >
                <Link
                  href={mod.href}
                  className="bento-card bento-card-interactive p-4 flex items-center justify-between gap-3 group"
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    {/* 8-Point Octagram Star Badge with Icon */}
                    <div
                      className="relative w-11 h-11 flex items-center justify-center shrink-0"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      <svg viewBox="0 0 36 36" className="w-11 h-11" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="6" y="6" width="24" height="24" rx="3" />
                        <rect x="6" y="6" width="24" height="24" rx="3" transform="rotate(45 18 18)" />
                      </svg>
                      <Icon className="w-4 h-4 absolute" />
                    </div>

                    <div className="min-w-0">
                      <h3 className="font-bold text-sm sm:text-base truncate">{mod.title}</h3>
                      <p className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {mod.subtitle}
                      </p>
                      <span
                        className="inline-block mt-1 px-2 py-0.5 rounded-full text-[10px] font-bold"
                        style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}
                      >
                        {mod.badge}
                      </span>
                    </div>
                  </div>

                  <div className="text-right shrink-0 flex flex-col items-end gap-1">
                    <span
                      dir="rtl"
                      className="font-arabic text-base sm:text-lg font-bold"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      {mod.arabic}
                    </span>
                    <ChevronRight className="w-4 h-4 opacity-50 group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* TAB 2: SURAH LIST (Exact Reference Image 1 & 2 List with 8-Point Star Number, MECCAN • X VERSES, and Purple Arabic Right Title) */}
      {activeTab === "surah" && (
        <div className="bento-card divide-y max-h-[420px] overflow-y-auto px-4" style={{ borderColor: "var(--border-hairline)" }}>
          {filteredSurahs.map((s) => (
            <Link
              key={s.number}
              href={`/quran?surah=${s.number}&page=${s.startPage}`}
              className="py-3.5 flex items-center justify-between gap-3 hover:opacity-90 transition-opacity"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className="relative w-10 h-10 inline-flex items-center justify-center shrink-0"
                  style={{ color: "var(--accent-primary)" }}
                >
                  <svg viewBox="0 0 36 36" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="6" y="6" width="24" height="24" rx="2.5" />
                    <rect x="6" y="6" width="24" height="24" rx="2.5" transform="rotate(45 18 18)" />
                  </svg>
                  <span className="absolute text-[11px] font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                    {s.number}
                  </span>
                </span>

                <div className="min-w-0">
                  <div className="font-bold text-sm sm:text-base truncate">{s.englishName}</div>
                  <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: "var(--text-muted)" }}>
                    {s.revelationType} • {s.numberOfAyahs} Verses • Page {s.startPage}
                  </div>
                </div>
              </div>

              <span
                dir="rtl"
                className="font-arabic text-xl sm:text-2xl font-bold shrink-0"
                style={{ color: "var(--accent-primary)" }}
              >
                {s.name}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* TAB 3: PARA / JUZ LIST (1..30) */}
      {activeTab === "para" && (
        <div className="bento-card divide-y max-h-[420px] overflow-y-auto px-4" style={{ borderColor: "var(--border-hairline)" }}>
          {JUZ_LIST.map((j) => (
            <Link
              key={j.juz}
              href={`/quran?page=${j.startPage}`}
              className="py-3.5 flex items-center justify-between gap-3 hover:opacity-90 transition-opacity"
              style={{ borderColor: "var(--border-hairline)" }}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <span
                  className="relative w-10 h-10 inline-flex items-center justify-center shrink-0"
                  style={{ color: "var(--accent-primary)" }}
                >
                  <svg viewBox="0 0 36 36" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.6">
                    <rect x="6" y="6" width="24" height="24" rx="2.5" />
                    <rect x="6" y="6" width="24" height="24" rx="2.5" transform="rotate(45 18 18)" />
                  </svg>
                  <span className="absolute text-[11px] font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                    {j.juz}
                  </span>
                </span>

                <div>
                  <div className="font-bold text-sm sm:text-base">Para {j.juz}</div>
                  <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: "var(--text-muted)" }}>
                    Starts at {j.surahName} ({j.surahNum}:{j.ayahNum}) • Page {j.startPage}
                  </div>
                </div>
              </div>

              <span
                dir="rtl"
                className="font-arabic text-xl sm:text-2xl font-bold shrink-0"
                style={{ color: "var(--accent-primary)" }}
              >
                {j.arabicTitle}
              </span>
            </Link>
          ))}
        </div>
      )}

      {/* TAB 4: 14 HANAFI SAJDA VERSES */}
      {activeTab === "sajda" && (
        <div className="bento-card divide-y max-h-[420px] overflow-y-auto px-4" style={{ borderColor: "var(--border-hairline)" }}>
          {HANAFI_SAJDA_ITEMS.map((s, idx) => {
            const done = sajdaCompleted.includes(s.ref);
            return (
              <Link
                key={s.ref}
                href={`/quran?page=${s.page}`}
                className="py-3.5 flex items-center justify-between gap-3 hover:opacity-90 transition-opacity"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <span
                    className="relative w-10 h-10 inline-flex items-center justify-center shrink-0"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    <svg viewBox="0 0 36 36" className="w-10 h-10" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="6" y="6" width="24" height="24" rx="2.5" />
                      <rect x="6" y="6" width="24" height="24" rx="2.5" transform="rotate(45 18 18)" />
                    </svg>
                    <span className="absolute text-[11px] font-bold tabular-nums" style={{ color: "var(--text-primary)" }}>
                      {idx + 1}
                    </span>
                  </span>

                  <div>
                    <div className="font-bold text-sm sm:text-base">{s.label}</div>
                    <div className="text-[11px] uppercase tracking-wider font-medium" style={{ color: "var(--text-muted)" }}>
                      Wajib Hanafi Sajda • Mushaf Page {s.page}
                    </div>
                  </div>
                </div>

                <span
                  className="px-3 py-1 rounded-full text-xs font-bold"
                  style={{
                    backgroundColor: done ? "var(--accent-soft)" : "var(--bg-muted)",
                    color: done ? "var(--accent-primary)" : "var(--text-muted)",
                  }}
                >
                  {done ? "Completed" : `Page ${s.page}`}
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
