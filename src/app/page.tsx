"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
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
    weather,
  } = useApp();

  // Exact tabs from Reference Image 1: Surah | Para | Page | Hijb
  const [activeTab, setActiveTab] = useState<"surah" | "para" | "page" | "hijb">("surah");
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

  const companionModules = [
    {
      href: "/quran",
      title: "Holy Quran",
      subtitle: `Page ${lastReadSurah.startPage} • 604 Pages`,
      icon: BookOpen,
    },
    {
      href: "/prayer",
      title: "Prayer & Qibla",
      subtitle: `${fardCompletedCount}/5 Today • Qibla ${schedule.qiblaBearing}°`,
      icon: Clock,
    },
    {
      href: "/tasbih",
      title: "Tasbih & Adhkar",
      subtitle: `${tasbihTotalToday}/${tasbihTarget} • ${activeLitany.name.split(" ")[0]}`,
      icon: Sparkles,
    },
    {
      href: "/auliya",
      title: "Auliya & Urs",
      subtitle: nextEvent ? nextEvent.title : `${allAuliya.length} Shrines`,
      icon: Compass,
    },
    {
      href: "/quiz",
      title: "Sahib-e-Ilm Quiz",
      subtitle:
        bestQuizTier > 0
          ? `Tier ${bestQuizTier}/15 • 300 Qs`
          : `300 Qs • ${ilmPoints.toLocaleString()} XP`,
      icon: Trophy,
    },
    {
      href: "/fiqh",
      title: "Hanafi Fiqh",
      subtitle: "Bahar-e-Shariat & Hadith",
      icon: Scale,
    },
    {
      href: "/zakat",
      title: "Zakat Calculator",
      subtitle: "Silver Nisab • 612.36g",
      icon: Calculator,
    },
    {
      href: "/admin",
      title: "Curator & Barsi",
      subtitle: "Family Fatiha & Profiles",
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

  const keyMushafPages = useMemo(
    () => [
      { page: 1, title: "Surah Al-Fatihah", subtitle: "Opening Page of the Mushaf", arabic: "الفاتحة" },
      { page: 2, title: "Surah Al-Baqarah", subtitle: "Para 1 • Alif-Lam-Mim", arabic: "البقرة" },
      { page: 50, title: "Ayat-ul-Kursi & Para 3", subtitle: "Surah Al-Baqarah", arabic: "آية الكرسي" },
      { page: 293, title: "Surah Al-Kahf", subtitle: "Para 15 • Friday Recitation", arabic: "الكهف" },
      { page: 440, title: "Surah Yasin", subtitle: "Para 22–23 • Heart of the Quran", arabic: "يس" },
      { page: 531, title: "Surah Ar-Rahman", subtitle: "Para 27 • Bride of the Quran", arabic: "الرحمن" },
      { page: 534, title: "Surah Al-Waqi'ah", subtitle: "Para 27 • Nightly Recitation", arabic: "الواقعة" },
      { page: 562, title: "Surah Al-Mulk", subtitle: "Para 29 • Protection before Sleep", arabic: "الملك" },
      { page: 582, title: "Juz Amma (Para 30)", subtitle: "Surah An-Naba to An-Nas", arabic: "عم يتساءلون" },
      { page: 604, title: "Khatm-ul-Quran Page", subtitle: "Surah Al-Ikhlas, Al-Falaq & An-Nas", arabic: "الناس" },
    ],
    []
  );

  return (
    <div className="space-y-6">
      {/* 1. Reference UI Greeting Header ("Assalamualaikum" + Bold User Name) */}
      <div className="flex items-end justify-between gap-3 pt-1">
        <div>
          <p className="text-sm sm:text-base font-medium" style={{ color: "var(--text-muted)" }}>
            Assalamualaikum
          </p>
          <h1 className="text-2xl sm:text-[26px] font-bold tracking-tight mt-0.5">
            {user ? user.name : "Tanvir Ahassan"}
          </h1>
        </div>

        <div className="text-right text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="font-semibold" style={{ color: "var(--text-primary)" }}>
            {hijri.formatted}
          </div>
          <div>{hijri.weekday}</div>
        </div>
      </div>

      {/* 2. Dual Reference Hero Cards (Image 1 & 2 "Last Read" Card + Image 2 Twilight Prayer Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Signature Lavender-to-Violet "Last Read" Card (Exact Reference Image 1 & 2) */}
        <Link
          href={`/quran?surah=${lastReadSurah.number}&page=${lastReadSurah.startPage}`}
          className="lg:col-span-6 quran-gradient-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[156px] group transition-transform active:scale-[0.99]"
        >
          {/* Open Quran on Rehal Illustration on the Right (Reference Image 1) */}
          <svg
            aria-hidden="true"
            viewBox="0 0 230 165"
            className="pointer-events-none absolute -right-3 -bottom-4 w-44 sm:w-52 h-36 sm:h-40 opacity-95 transition-transform duration-300 group-hover:scale-105"
          >
            {/* Soft shadow under Rehal */}
            <ellipse cx="115" cy="148" rx="68" ry="10" fill="#2A0F5D" opacity="0.38" />
            {/* Wooden Rehal X-Stand */}
            <path d="M62 146 L160 100 L167 109 L69 155 Z" fill="#581C87" />
            <path d="M160 146 L62 100 L55 109 L153 155 Z" fill="#3B0764" />
            {/* Warm Peach-Gold Book Cover Edges */}
            <path d="M34 98 Q74 80 114 103 L114 113 Q74 90 34 108 Z" fill="#F9B091" />
            <path d="M194 98 Q154 80 114 103 L114 113 Q154 90 194 108 Z" fill="#F59E0B" />
            {/* Crisp White Open Mushaf Pages */}
            <path d="M38 92 Q76 72 114 97 L114 48 Q76 28 38 46 Z" fill="#FFFFFF" />
            <path d="M190 92 Q152 72 114 97 L114 48 Q152 28 190 46 Z" fill="#F5F3FF" />
            {/* Page Spine */}
            <line x1="114" y1="48" x2="114" y2="103" stroke="#C084FC" strokeWidth="2.5" />
            {/* Delicate Calligraphy Lines on Left & Right Pages */}
            <path d="M50 58 Q76 47 102 60" stroke="#C084FC" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M50 68 Q76 57 102 70" stroke="#C084FC" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M50 78 Q76 67 102 80" stroke="#C084FC" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M126 60 Q152 47 178 58" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M126 70 Q152 57 178 68" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
            <path d="M126 80 Q152 67 178 78" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
          </svg>

          <div className="relative z-10 inline-flex items-center gap-2 text-xs font-medium text-white">
            <BookOpen className="w-4 h-4" />
            <span>Last Read</span>
          </div>

          <div className="relative z-10 mt-3 max-w-[60%]">
            <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
              {lastReadSurah.englishName}
            </h2>
            <p className="text-xs text-white/85 mt-1">
              Ayah No: {lastReadParsed.ayahNum}
            </p>
          </div>

          <div className="relative z-10 mt-3">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-xs text-white">
              <span>Continue read</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </span>
          </div>
        </Link>

        {/* Twilight Mosque Next Prayer Card (Exact Reference Image 2 Top Card) */}
        <Link
          href="/prayer"
          className="lg:col-span-6 twilight-hero-card p-5 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[156px] group transition-transform active:scale-[0.99]"
        >
          {/* Twilight Mosque Skyline & Glowing Moon Illustration */}
          <svg
            aria-hidden="true"
            viewBox="0 0 500 200"
            preserveAspectRatio="xMidYMax slice"
            className="pointer-events-none absolute inset-0 w-full h-full opacity-40"
          >
            <defs>
              <radialGradient id="twilightMoon" cx="50%" cy="35%" r="32%">
                <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.85" />
                <stop offset="45%" stopColor="#DF98FA" stopOpacity="0.35" />
                <stop offset="100%" stopColor="#27155D" stopOpacity="0" />
              </radialGradient>
            </defs>
            <circle cx="250" cy="68" r="64" fill="url(#twilightMoon)" />
            {/* Mosque Domes & Minarets Silhouette */}
            <path
              d="M0 200 L0 164 L42 164 L42 124 L47 104 L52 124 L52 164 L108 164 Q142 124 176 164 L218 164 L218 140 Q250 92 282 140 L282 164 L324 164 Q358 124 392 164 L448 164 L448 124 L453 104 L458 124 L458 164 L500 164 L500 200 Z"
              fill="#0A0E24"
            />
          </svg>

          <div className="relative z-10 space-y-1">
            <div className="text-sm font-semibold text-purple-100">
              {schedule.nextPrayer.label.split(" (")[0]}
            </div>
            <div className="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums text-white">
              {formatTime(schedule.nextPrayer.jamaatTime)}
            </div>
            <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs text-purple-100/90 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300" />
              <span>
                {city.name} ({city.tz || "Local"}) • in {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
              </span>
              {weather && (
                <span className="px-2 py-0.5 rounded-full bg-white/15 text-white font-semibold tabular-nums">
                  {Math.round(weather.temperatureC)}°C{weather.usAqi !== null ? ` • AQI ${weather.usAqi}` : ""}
                </span>
              )}
            </div>
          </div>
        </Link>
      </div>

      {/* 3. Companion Modules Grid (Clean 1-Tap Access to Every Feature) */}
      <section className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold tracking-tight" style={{ color: "var(--text-primary)" }}>
            Companion Modules
          </h2>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Select a module to open
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
          {companionModules.map((mod) => {
            const Icon = mod.icon;
            return (
              <Link
                key={mod.href}
                href={mod.href}
                className="bento-card bento-card-interactive p-3.5 flex items-center gap-3 group"
              >
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent-primary)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <div className="font-semibold text-xs sm:text-sm truncate">{mod.title}</div>
                  <div className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {mod.subtitle}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Exact Reference Image 1 Underline Tab Bar: Surah | Para | Page | Hijb */}
      <section className="space-y-2">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <div className="grid grid-cols-4 sm:flex sm:items-center sm:gap-8">
            {(
              [
                { id: "surah", label: "Surah" },
                { id: "para", label: "Para" },
                { id: "page", label: "Page" },
                { id: "hijb", label: "Hijb" },
              ] as const
            ).map((tab) => {
              const active = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className="relative py-3 text-xs sm:text-sm font-semibold text-center cursor-pointer transition-colors"
                  style={{
                    color: active ? "var(--text-primary)" : "var(--text-muted)",
                  }}
                >
                  <span>{tab.label}</span>
                  {active && (
                    <span
                      className="absolute bottom-0 inset-x-0 h-[3px] rounded-full"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    />
                  )}
                </button>
              );
            })}
          </div>

          {activeTab === "surah" && (
            <div className="relative sm:w-64 pb-2 sm:pb-0">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Surah…"
                className="w-full pl-8 pr-3 py-1.5 rounded-full border text-xs bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>
          )}
        </div>

        {/* TAB 1: SURAH LIST (Exact Reference Image 1 & 2 Clean Hairline List) */}
        {activeTab === "surah" && (
          <div className="divide-y max-h-[460px] overflow-y-auto pr-1" style={{ borderColor: "var(--border-hairline)" }}>
            {filteredSurahs.map((s) => (
              <Link
                key={s.number}
                href={`/quran?surah=${s.number}&page=${s.startPage}`}
                className="py-4 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  {/* Reference 8-Point Star Number Medallion */}
                  <span
                    className="relative w-9 h-9 inline-flex items-center justify-center shrink-0"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="6" y="6" width="24" height="24" rx="2" />
                      <rect x="6" y="6" width="24" height="24" rx="2" transform="rotate(45 18 18)" />
                    </svg>
                    <span className="absolute text-xs font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                      {s.number}
                    </span>
                  </span>

                  <div className="min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate">{s.englishName}</div>
                    <div
                      className="text-[11px] uppercase tracking-wider font-medium mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {s.revelationType} • {s.numberOfAyahs} Verses
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

        {/* TAB 2: PARA / JUZ LIST (1..30) */}
        {activeTab === "para" && (
          <div className="divide-y max-h-[460px] overflow-y-auto pr-1" style={{ borderColor: "var(--border-hairline)" }}>
            {JUZ_LIST.map((j) => (
              <Link
                key={j.juz}
                href={`/quran?page=${j.startPage}`}
                className="py-4 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className="relative w-9 h-9 inline-flex items-center justify-center shrink-0"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="6" y="6" width="24" height="24" rx="2" />
                      <rect x="6" y="6" width="24" height="24" rx="2" transform="rotate(45 18 18)" />
                    </svg>
                    <span className="absolute text-xs font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                      {j.juz}
                    </span>
                  </span>

                  <div>
                    <div className="font-semibold text-sm sm:text-base">Para {j.juz}</div>
                    <div
                      className="text-[11px] uppercase tracking-wider font-medium mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {j.surahName} ({j.surahNum}:{j.ayahNum}) • Page {j.startPage}
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

        {/* TAB 3: PAGE (604-Page Mushaf Landmarks & Quick Jump) */}
        {activeTab === "page" && (
          <div className="divide-y max-h-[460px] overflow-y-auto pr-1" style={{ borderColor: "var(--border-hairline)" }}>
            {keyMushafPages.map((item) => (
              <Link
                key={item.page}
                href={`/quran?page=${item.page}`}
                className="py-4 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <span
                    className="relative w-9 h-9 inline-flex items-center justify-center shrink-0"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6">
                      <rect x="6" y="6" width="24" height="24" rx="2" />
                      <rect x="6" y="6" width="24" height="24" rx="2" transform="rotate(45 18 18)" />
                    </svg>
                    <span className="absolute text-[10px] font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                      {item.page}
                    </span>
                  </span>

                  <div>
                    <div className="font-semibold text-sm sm:text-base">{item.title}</div>
                    <div
                      className="text-[11px] uppercase tracking-wider font-medium mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      Mushaf Page {item.page} • {item.subtitle}
                    </div>
                  </div>
                </div>

                <span
                  dir="rtl"
                  className="font-arabic text-xl sm:text-2xl font-bold shrink-0"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {item.arabic}
                </span>
              </Link>
            ))}
          </div>
        )}

        {/* TAB 4: HIJB & 14 HANAFI SAJDAS */}
        {activeTab === "hijb" && (
          <div className="divide-y max-h-[460px] overflow-y-auto pr-1" style={{ borderColor: "var(--border-hairline)" }}>
            {HANAFI_SAJDA_ITEMS.map((s, idx) => {
              const done = sajdaCompleted.includes(s.ref);
              return (
                <Link
                  key={s.ref}
                  href={`/quran?page=${s.page}`}
                  className="py-4 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <div className="flex items-center gap-4 min-w-0">
                    <span
                      className="relative w-9 h-9 inline-flex items-center justify-center shrink-0"
                      style={{ color: "var(--accent-primary)" }}
                    >
                      <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <rect x="6" y="6" width="24" height="24" rx="2" />
                        <rect x="6" y="6" width="24" height="24" rx="2" transform="rotate(45 18 18)" />
                      </svg>
                      <span className="absolute text-xs font-semibold tabular-nums" style={{ color: "var(--text-primary)" }}>
                        {idx + 1}
                      </span>
                    </span>

                    <div>
                      <div className="font-semibold text-sm sm:text-base">{s.label}</div>
                      <div
                        className="text-[11px] uppercase tracking-wider font-medium mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        Wajib Sajda • Page {s.page}
                      </div>
                    </div>
                  </div>

                  <span
                    className="px-3 py-1 rounded-full text-xs font-semibold"
                    style={{
                      backgroundColor: done ? "var(--accent-soft)" : "var(--bg-surface)",
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
      </section>
    </div>
  );
}
