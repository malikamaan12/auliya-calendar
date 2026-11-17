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
  HeartHandshake,
  MapPin,
  Search,
  Flame,
  Award,
  CheckCircle2,
  Sliders,
  Calendar,
  Megaphone,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { formatCountdown, formatTime } from "@/lib/prayer-engine";
import { getEventsForHijri, getUpcomingEvents } from "@/lib/hijri";
import { formatLocalizedHijriMonth, t } from "@/lib/i18n";
import { ModuleIconKey, RBAC_ROLES } from "@/lib/backend-types";
import { TASBIH_LITANIES } from "@/data/fiqh-hadith";
import { HANAFI_SAJDA_ITEMS, JUZ_LIST, SURAH_LIST } from "@/data/quran";
import { ActivityRings } from "@/components/ActivityRings";
import { RafiqBar } from "@/components/RafiqBar";

const ICON_MAP: Record<ModuleIconKey, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Clock,
  Sparkles,
  Compass,
  Trophy,
  Scale,
  Calculator,
  HeartHandshake,
  ShieldCheck,
};

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
    lang,
    city,
    hijri,
    schedule,
    salahToday,
    sunnahChecks,
    tasbihTotalToday,
    tasbihTarget,
    activeLitanyId,
    quranVersesToday,
    bestQuizTier,
    lastQuranRef,
    sajdaCompleted,
    allAuliya,
    user,
    authUser,
    weather,
    rings,
    streakDays,
    backend,
    dynamicCalendarEvents,
    totalXp,
    currentRank,
    nextRank,
    rankProgressPct,
    claimedQuestsToday,
    claimDailyQuest,
    barsiFatihaToday,
  } = useApp();

  const [activeTab, setActiveTab] = useState<"surah" | "para" | "page" | "hijb">("surah");
  const [searchQuery, setSearchQuery] = useState("");

  const lastReadParsed = useMemo(() => parseRef(lastQuranRef || "1:1"), [lastQuranRef]);
  const lastReadSurah = useMemo(
    () => SURAH_LIST.find((s) => s.number === lastReadParsed.surahNum) ?? SURAH_LIST[0],
    [lastReadParsed.surahNum]
  );

  const todayEvents = useMemo(
    () => getEventsForHijri(hijri.month, hijri.day, dynamicCalendarEvents),
    [hijri.month, hijri.day, dynamicCalendarEvents]
  );
  const upcomingEvents = useMemo(
    () => getUpcomingEvents(hijri.month, hijri.day, dynamicCalendarEvents, 4),
    [hijri.month, hijri.day, dynamicCalendarEvents]
  );
  const nextEvent = todayEvents[0] || upcomingEvents[0];

  const activeLitany =
    TASBIH_LITANIES.find((l) => l.id === activeLitanyId) || TASBIH_LITANIES[0];
  const fardCompletedCount = Object.values(salahToday).filter((v) => v !== "none").length;
  const sunnahCompletedCount = Object.values(sunnahChecks).filter(Boolean).length;

  // Dynamic Modular Cards driven 100% by Backend Registry (enabled + ordered + live telemetry)
  const enabledModules = useMemo(() => {
    return backend.modules
      .filter((m) => m.enabled)
      .sort((a, b) => a.order - b.order)
      .map((m) => {
        const title = m.customTitle?.trim() || t(lang, m.i18nTitleKey);
        let liveSubtitle = m.subtitleTemplate;
        if (m.id === "quran") {
          liveSubtitle = `Page ${lastReadSurah.startPage} • ${m.subtitleTemplate}`;
        } else if (m.id === "prayer") {
          liveSubtitle = `${fardCompletedCount}/5 Today • Qibla ${schedule.qiblaBearing}°`;
        } else if (m.id === "tasbih") {
          liveSubtitle = `${tasbihTotalToday}/${tasbihTarget} • ${activeLitany.name.split(" ")[0]}`;
        } else if (m.id === "auliya") {
          liveSubtitle = nextEvent ? nextEvent.title : `${allAuliya.length} Shrines`;
        } else if (m.id === "quiz") {
          liveSubtitle =
            bestQuizTier > 0
              ? `Tier ${bestQuizTier}/15 • ${totalXp.toLocaleString()} XP`
              : `300 Qs • ${totalXp.toLocaleString()} XP`;
        } else if (m.id === "barsi") {
          liveSubtitle = `${backend.barsiRecords.length} Profiles • ${m.subtitleTemplate}`;
        }
        return {
          ...m,
          resolvedTitle: title,
          resolvedSubtitle: liveSubtitle,
          Icon: ICON_MAP[m.iconKey] || Compass,
        };
      });
  }, [
    backend.modules,
    backend.barsiRecords.length,
    lang,
    lastReadSurah.startPage,
    fardCompletedCount,
    schedule.qiblaBearing,
    tasbihTotalToday,
    tasbihTarget,
    activeLitany.name,
    nextEvent,
    allAuliya.length,
    bestQuizTier,
    totalXp,
  ]);

  // Evaluate live progress for Backend-Configured Daily Barakah Quests
  const activeQuests = useMemo(() => {
    return backend.gamificationConfig.dailyQuests
      .filter((q) => q.enabled)
      .map((q) => {
        let current = 0;
        if (q.metric === "salah_count") current = fardCompletedCount;
        else if (q.metric === "tasbih_count") current = tasbihTotalToday;
        else if (q.metric === "quran_verses") current = quranVersesToday;
        else if (q.metric === "sunnah_count") current = sunnahCompletedCount;
        else if (q.metric === "barsi_fatiha") current = barsiFatihaToday;
        else if (q.metric === "quiz_played") current = bestQuizTier > 0 ? 1 : 0;

        const completed = current >= q.target;
        const claimed = claimedQuestsToday.includes(q.id);
        const pct = Math.min(100, Math.round((current / Math.max(1, q.target)) * 100));
        return { ...q, current, completed, claimed, pct };
      });
  }, [
    backend.gamificationConfig.dailyQuests,
    fardCompletedCount,
    tasbihTotalToday,
    quranVersesToday,
    sunnahCompletedCount,
    barsiFatihaToday,
    bestQuizTier,
    claimedQuestsToday,
  ]);

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

  const localizedHijriMonth = formatLocalizedHijriMonth(lang, hijri.month, hijri.monthName);
  const roleMeta = authUser ? RBAC_ROLES[authUser.role] : null;

  return (
    <div className="space-y-6">
      {/* Dynamic Backend Announcement Banner */}
      {backend.platformSettings.announcementEnabled && backend.platformSettings.announcementText && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="px-4 py-2.5 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs"
          style={{
            borderColor: "color-mix(in srgb, var(--accent-primary) 35%, var(--border-hairline))",
            backgroundColor: "var(--accent-soft)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Megaphone className="w-4 h-4 shrink-0" style={{ color: "var(--accent-primary)" }} />
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider"
              style={{ backgroundColor: "var(--bg-surface)", color: "var(--accent-primary)" }}
            >
              {backend.platformSettings.announcementBadge}
            </span>
            <span className="truncate font-medium">{backend.platformSettings.announcementText}</span>
          </div>
          <Link
            href={backend.platformSettings.announcementHref || "/admin"}
            className="font-bold inline-flex items-center gap-1 shrink-0"
            style={{ color: "var(--accent-primary)" }}
          >
            <span>Open</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      )}

      {/* 1. Dramatic Greeting + Spiritual Rank & XP Progression Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pt-1">
        <div className="space-y-1.5">
          <div className="flex flex-wrap items-center gap-2">
            <p className="text-sm font-medium" style={{ color: "var(--text-muted)" }}>
              {t(lang, "greeting")}
            </p>
            {roleMeta && (
              <span
                className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                style={{ backgroundColor: roleMeta.badgeColor }}
              >
                {roleMeta.label}
              </span>
            )}
            <span
              className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full font-bold"
              style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
            >
              <Flame className="w-3 h-3" />
              <span>
                {streakDays} {t(lang, "streakDays")}
              </span>
            </span>
          </div>

          <h1 className="text-2xl sm:text-[28px] font-bold tracking-tight">
            {user ? user.name : "Tanvir Ahassan"}
          </h1>

          {/* Gamified Spiritual Rank Progress Strip */}
          <div className="flex items-center gap-2.5 pt-0.5">
            <span
              className="inline-flex items-center gap-1 text-xs font-bold"
              style={{ color: "var(--accent-primary)" }}
            >
              <Award className="w-3.5 h-3.5" />
              <span>
                Lv.{currentRank.level} {currentRank.title}
              </span>
            </span>
            <div
              className="w-28 sm:w-36 h-2 rounded-full overflow-hidden"
              style={{ backgroundColor: "var(--bg-muted)" }}
            >
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${rankProgressPct}%` }}
                transition={{ duration: 0.6, ease: "easeOut" }}
                className="h-full rounded-full"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              />
            </div>
            <span className="text-[11px] font-mono tabular-nums" style={{ color: "var(--text-muted)" }}>
              {totalXp.toLocaleString()}
              {nextRank ? ` / ${nextRank.minXp.toLocaleString()} XP` : " XP (Max)"}
            </span>
          </div>
        </div>

        <div className="sm:text-end text-xs" style={{ color: "var(--text-muted)" }}>
          <div className="font-bold text-sm" style={{ color: "var(--text-primary)" }}>
            {hijri.day} {localizedHijriMonth} {hijri.year} AH
          </div>
          <div>{hijri.weekday}</div>
        </div>
      </div>

      {/* 2. Dual Hero Cards (Quran Mushaf Last Read + Live Twilight Mosque Prayer Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="lg:col-span-6"
        >
          <Link
            href={`/quran?surah=${lastReadSurah.number}&page=${lastReadSurah.startPage}`}
            className="quran-gradient-card p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[162px] group h-full"
          >
            <svg
              aria-hidden="true"
              viewBox="0 0 230 165"
              className="pointer-events-none absolute -right-3 -bottom-4 w-44 sm:w-52 h-36 sm:h-40 opacity-95 transition-transform duration-300 group-hover:scale-105"
            >
              <ellipse cx="115" cy="148" rx="68" ry="10" fill="#180838" opacity="0.38" />
              <path d="M62 146 L160 100 L167 109 L69 155 Z" fill="#4C1D95" />
              <path d="M160 146 L62 100 L55 109 L153 155 Z" fill="#2E1065" />
              <path d="M34 98 Q74 80 114 103 L114 113 Q74 90 34 108 Z" fill="#F9B091" />
              <path d="M194 98 Q154 80 114 103 L114 113 Q154 90 194 108 Z" fill="#F59E0B" />
              <path d="M38 92 Q76 72 114 97 L114 48 Q76 28 38 46 Z" fill="#FFFFFF" />
              <path d="M190 92 Q152 72 114 97 L114 48 Q152 28 190 46 Z" fill="#F5F3FF" />
              <line x1="114" y1="48" x2="114" y2="103" stroke="#C084FC" strokeWidth="2.5" />
              <path d="M50 58 Q76 47 102 60" stroke="#C084FC" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M50 68 Q76 57 102 70" stroke="#C084FC" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M50 78 Q76 67 102 80" stroke="#C084FC" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M126 60 Q152 47 178 58" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M126 70 Q152 57 178 68" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M126 80 Q152 67 178 78" stroke="#A855F7" strokeWidth="2" fill="none" strokeLinecap="round" />
            </svg>

            <div className="relative z-10 inline-flex items-center gap-2 text-xs font-semibold text-white">
              <BookOpen className="w-4 h-4" />
              <span>{t(lang, "lastRead")}</span>
            </div>

            <div className="relative z-10 mt-3 max-w-[62%]">
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-white truncate">
                {lastReadSurah.englishName}
              </h2>
              <p className="text-xs text-white/85 mt-1">
                {t(lang, "ayahNo")}: {lastReadParsed.ayahNum} • Page {lastReadSurah.startPage}
              </p>
            </div>

            <div className="relative z-10 mt-3">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-[11px] font-semibold bg-white/20 backdrop-blur-xs text-white">
                <span>{t(lang, "continueJourney")}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </span>
            </div>
          </Link>
        </motion.div>

        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 360, damping: 26 }}
          className="lg:col-span-6"
        >
          <Link
            href="/prayer"
            className="twilight-hero-card p-5 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[162px] group h-full"
          >
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
              <path
                d="M0 200 L0 164 L42 164 L42 124 L47 104 L52 124 L52 164 L108 164 Q142 124 176 164 L218 164 L218 140 Q250 92 282 140 L282 164 L324 164 Q358 124 392 164 L448 164 L448 124 L453 104 L458 124 L458 164 L500 164 L500 200 Z"
                fill="#070A1A"
              />
            </svg>

            <div className="relative z-10 space-y-1">
              <div className="text-sm font-semibold text-white/90">
                {schedule.nextPrayer.label.split(" (")[0]}
              </div>
              <div className="text-3xl sm:text-4xl font-bold tracking-tight tabular-nums text-white">
                {formatTime(schedule.nextPrayer.jamaatTime)}
              </div>
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-xs text-white/90 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300" />
                <span>
                  {city.name} ({city.tz || "Local"}) • in {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
                </span>
                {weather && (
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-white font-semibold tabular-nums">
                    {Math.round(weather.temperatureC)}°C
                    {weather.usAqi !== null ? ` • AQI ${weather.usAqi}` : ""}
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Live Contextual Rafiq Companion Bar */}
      <RafiqBar />

      {/* 3. 100% Backend-Modular Sanctuary Modules Grid */}
      <section className="space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold tracking-tight">
              {t(lang, "companionModules")}
            </h2>
            <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
              {t(lang, "selectModuleHint")} • {enabledModules.length} Active Modules
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border transition-opacity hover:opacity-90"
            style={{
              borderColor: "var(--border-hairline)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--accent-primary)",
            }}
          >
            <Sliders className="w-3.5 h-3.5" />
            <span>{t(lang, "customizeModules")}</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {enabledModules.map((mod, idx) => {
            const Icon = mod.Icon;
            return (
              <motion.div
                key={mod.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.22, delay: idx * 0.03 }}
              >
                <Link
                  href={mod.href}
                  className={`p-4 flex items-center justify-between gap-3 group h-full ${
                    mod.featured ? "sanctuary-halo-card" : "bento-card"
                  } bento-card-interactive`}
                >
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div
                      className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                      style={{
                        backgroundImage: mod.featured ? "var(--gradient-brand)" : undefined,
                        backgroundColor: mod.featured ? undefined : "var(--accent-soft)",
                        color: mod.featured ? "#ffffff" : "var(--accent-primary)",
                      }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm truncate">{mod.resolvedTitle}</span>
                        {mod.badgeText && (
                          <span
                            className="text-[9px] px-1.5 py-0.5 rounded-full font-bold shrink-0"
                            style={{
                              backgroundColor: "var(--gold-soft)",
                              color: "var(--accent-gold)",
                            }}
                          >
                            {mod.badgeText}
                          </span>
                        )}
                      </div>
                      <div
                        className="text-xs truncate mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {mod.resolvedSubtitle}
                      </div>
                    </div>
                  </div>

                  <ArrowRight
                    className="w-4 h-4 shrink-0 opacity-45 group-hover:opacity-100 group-hover:translate-x-0.5 transition-all"
                    style={{ color: "var(--accent-primary)" }}
                  />
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* 4. Gamified Daily Barakah Quests + Spiritual Rings + Upcoming Urs/Barsi */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Daily Barakah Quests & 3 Spiritual Rings */}
        <div className="lg:col-span-7 bento-card p-5 space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent-primary)" }}
              >
                {t(lang, "ringsTitle")}
              </span>
              <h3 className="text-base font-bold mt-0.5">{t(lang, "dailyQuests")}</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-end text-[11px]" style={{ color: "var(--text-muted)" }}>
                <div>
                  <span className="font-bold text-emerald-400">{rings.salah}%</span> {t(lang, "salahRing")}
                </div>
                <div>
                  <span className="font-bold text-cyan-400">{rings.ilm}%</span> {t(lang, "ilmRing")}
                </div>
                <div>
                  <span className="font-bold text-amber-400">{rings.dhikr}%</span> {t(lang, "dhikrRing")}
                </div>
              </div>
              <ActivityRings salah={rings.salah} ilm={rings.ilm} dhikr={rings.dhikr} size={74} />
            </div>
          </div>

          <div className="space-y-2.5">
            {activeQuests.slice(0, 4).map((q) => (
              <div
                key={q.id}
                className="p-3 rounded-xl border flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 text-xs"
                style={{
                  borderColor: q.completed ? "rgba(16, 185, 129, 0.35)" : "var(--border-hairline)",
                  backgroundColor: "var(--bg-elevated)",
                }}
              >
                <div className="min-w-0 flex-1 space-y-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-bold truncate">{q.title}</span>
                    <span className="font-mono text-[11px] shrink-0" style={{ color: "var(--accent-gold)" }}>
                      +{q.xpReward} XP
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden bg-black/20">
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${q.pct}%`,
                        backgroundImage: "var(--gradient-brand)",
                      }}
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px]" style={{ color: "var(--text-muted)" }}>
                    <span className="truncate">{q.subtitle}</span>
                    <span className="font-mono tabular-nums shrink-0">
                      {Math.min(q.current, q.target)}/{q.target}
                    </span>
                  </div>
                </div>

                {q.claimed ? (
                  <span className="badge-pill badge-emerald shrink-0 py-1.5 px-3">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>{t(lang, "claimed")}</span>
                  </span>
                ) : q.completed ? (
                  <button
                    type="button"
                    onClick={() => claimDailyQuest(q.id, q.xpReward, q.title)}
                    className="btn-primary px-3.5 py-1.5 rounded-xl font-bold shrink-0 cursor-pointer"
                  >
                    {t(lang, "claimReward")}
                  </button>
                ) : (
                  <Link
                    href={q.actionHref}
                    className="px-3 py-1.5 rounded-xl border font-semibold shrink-0 text-center"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  >
                    Go
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Dynamic Upcoming Urs & Family Barsi Spotlight */}
        <div className="lg:col-span-5 bento-card p-5 flex flex-col justify-between space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span
                className="text-[11px] font-bold uppercase tracking-wider"
                style={{ color: "var(--accent-gold)" }}
              >
                Hijri Calendar CMS
              </span>
              <h3 className="text-base font-bold mt-0.5">{t(lang, "upcomingUrsBarsi")}</h3>
            </div>
            <Calendar className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
          </div>

          <div className="space-y-2.5 flex-1">
            {upcomingEvents.map((ev, i) => {
              const isBarsi = ev.title.startsWith("Barsi:");
              const href = isBarsi
                ? "/barsi"
                : ev.auliyaId
                ? `/auliya?saint=${ev.auliyaId}`
                : "/auliya";
              return (
                <Link
                  key={`${ev.title}_${i}`}
                  href={href}
                  className="p-3 rounded-xl border flex items-center justify-between gap-3 hover:opacity-90 transition-opacity"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-elevated)",
                  }}
                >
                  <div className="min-w-0">
                    <div className="font-bold text-xs truncate">{ev.title}</div>
                    <div className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {ev.subtitle}
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-lg text-[10px] font-bold shrink-0 tabular-nums"
                    style={{
                      backgroundColor: isBarsi ? "var(--accent-soft)" : "var(--gold-soft)",
                      color: isBarsi ? "var(--accent-primary)" : "var(--accent-gold)",
                    }}
                  >
                    {ev.day}/{ev.month} AH
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-1 text-xs font-semibold">
            <Link
              href="/barsi"
              className="py-2 px-3 rounded-xl border text-center hover:opacity-90"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              + Add Family Barsi
            </Link>
            <Link
              href="/admin"
              className="py-2 px-3 rounded-xl border text-center hover:opacity-90"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--accent-primary)",
              }}
            >
              + Add Urs / Saint
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Mushaf Quick Explorer Tabs: Surah | Para | Page | Hijb & Sajda */}
      <section className="space-y-2">
        <div
          className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <div className="grid grid-cols-4 sm:flex sm:items-center sm:gap-8">
            {(
              [
                { id: "surah", label: t(lang, "tabSurah") },
                { id: "para", label: t(lang, "tabPara") },
                { id: "page", label: t(lang, "tabPage") },
                { id: "hijb", label: t(lang, "tabHijb") },
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
                    <motion.span
                      layoutId="homeMushafTabIndicator"
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
                placeholder={t(lang, "searchSurah")}
                className="w-full pl-8 pr-3 py-1.5 rounded-full border text-xs bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>
          )}
        </div>

        {activeTab === "surah" && (
          <div className="divide-y max-h-[440px] overflow-y-auto pr-1" style={{ borderColor: "var(--border-hairline)" }}>
            {filteredSurahs.map((s) => (
              <Link
                key={s.number}
                href={`/quran?surah=${s.number}&page=${s.startPage}`}
                className="py-3.5 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
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

        {activeTab === "para" && (
          <div className="divide-y max-h-[440px] overflow-y-auto pr-1" style={{ borderColor: "var(--border-hairline)" }}>
            {JUZ_LIST.map((j) => (
              <Link
                key={j.juz}
                href={`/quran?page=${j.startPage}`}
                className="py-3.5 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
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

        {activeTab === "page" && (
          <div className="divide-y max-h-[440px] overflow-y-auto pr-1" style={{ borderColor: "var(--border-hairline)" }}>
            {keyMushafPages.map((item) => (
              <Link
                key={item.page}
                href={`/quran?page=${item.page}`}
                className="py-3.5 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
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

        {activeTab === "hijb" && (
          <div className="divide-y max-h-[440px] overflow-y-auto pr-1" style={{ borderColor: "var(--border-hairline)" }}>
            {HANAFI_SAJDA_ITEMS.map((s, idx) => {
              const done = sajdaCompleted.includes(s.ref);
              return (
                <Link
                  key={s.ref}
                  href={`/quran?page=${s.page}`}
                  className="py-3.5 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
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
