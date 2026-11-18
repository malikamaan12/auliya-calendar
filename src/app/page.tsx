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
  ChevronRight,
  Sparkles,
  Clock,
  Scale,
  ShieldCheck,
  HeartHandshake,
  MapPin,
  Search,
  Flame,
  CheckCircle2,
  Sliders,
  Calendar,
  Megaphone,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { formatCountdown, formatTime } from "@/lib/prayer-engine";
import { getEventsForHijri, getUpcomingEvents } from "@/lib/hijri";
import {
  formatLocalizedHijriMonth,
  formatLocalizedWeekday,
  getModuleSubtitle,
  localizePrayerName,
  t,
  tp,
} from "@/lib/i18n";
import { ModuleIconKey } from "@/lib/backend-types";
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
    weather,
    rings,
    streakDays,
    backend,
    dynamicCalendarEvents,
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

  // Clean localized module launcher items
  const enabledModules = useMemo(() => {
    return backend.modules
      .filter((m) => m.enabled)
      .sort((a, b) => a.order - b.order)
      .map((m) => {
        const title = m.customTitle?.trim() || t(lang, m.i18nTitleKey);
        let liveSubtitle = getModuleSubtitle(lang, m.id, m.subtitleTemplate);

        if (m.id === "quran") {
          liveSubtitle = `${t(lang, "pageLabel")} ${lastReadSurah.startPage} • ${lastReadSurah.englishName}`;
        } else if (m.id === "prayer") {
          liveSubtitle = `${fardCompletedCount}/5 • ${t(lang, "qiblaBearing")} ${schedule.qiblaBearing}°`;
        } else if (m.id === "tasbih") {
          liveSubtitle = `${tasbihTotalToday}/${tasbihTarget} • ${activeLitany.name.split(" ")[0]}`;
        } else if (m.id === "auliya" && nextEvent) {
          liveSubtitle = nextEvent.title;
        } else if (m.id === "auliya") {
          liveSubtitle = `${allAuliya.length} • ${getModuleSubtitle(lang, m.id, m.subtitleTemplate)}`;
        } else if (m.id === "quiz" && bestQuizTier > 0) {
          liveSubtitle = `${tp(lang, `Tier ${bestQuizTier}/15`)} • ${getModuleSubtitle(lang, m.id, m.subtitleTemplate)}`;
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
    lang,
    lastReadSurah.startPage,
    lastReadSurah.englishName,
    fardCompletedCount,
    schedule.qiblaBearing,
    tasbihTotalToday,
    tasbihTarget,
    activeLitany.name,
    nextEvent,
    allAuliya.length,
    bestQuizTier,
  ]);

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
      { page: 1, title: "Surah Al-Fatihah", para: 1, arabic: "الفاتحة" },
      { page: 2, title: "Surah Al-Baqarah", para: 1, arabic: "البقرة" },
      { page: 50, title: "Ayat-ul-Kursi", para: 3, arabic: "آية الكرسي" },
      { page: 293, title: "Surah Al-Kahf", para: 15, arabic: "الكهف" },
      { page: 440, title: "Surah Yasin", para: 22, arabic: "يس" },
      { page: 531, title: "Surah Ar-Rahman", para: 27, arabic: "الرحمن" },
      { page: 534, title: "Surah Al-Waqi'ah", para: 27, arabic: "الواقعة" },
      { page: 562, title: "Surah Al-Mulk", para: 29, arabic: "الملك" },
      { page: 582, title: "Juz Amma", para: 30, arabic: "عم يتساءلون" },
      { page: 604, title: "Surah Al-Ikhlas & Mu'awwidhatayn", para: 30, arabic: "الناس" },
    ],
    []
  );

  const localizedHijriMonth = formatLocalizedHijriMonth(lang, hijri.month, hijri.monthName);
  const localizedWeekday = formatLocalizedWeekday(lang, hijri.weekday);
  const nextPrayerName = localizePrayerName(lang, schedule.nextPrayer.label);

  return (
    <div className="space-y-4 sm:space-y-7">
      {/* Optional Admin-Enabled Notice */}
      {backend.platformSettings.announcementEnabled && backend.platformSettings.announcementText && (
        <div
          className="px-3.5 py-2 rounded-2xl border flex flex-wrap items-center justify-between gap-2 text-xs"
          style={{
            borderColor: "color-mix(in srgb, var(--accent-primary) 30%, var(--border-hairline))",
            backgroundColor: "var(--accent-soft)",
          }}
        >
          <div className="flex items-center gap-2 min-w-0">
            <Megaphone className="w-4 h-4 shrink-0" style={{ color: "var(--accent-primary)" }} />
            <span className="truncate font-medium">{backend.platformSettings.announcementText}</span>
          </div>
          <Link
            href={backend.platformSettings.announcementHref || "/auliya"}
            className="font-semibold inline-flex items-center gap-1 shrink-0"
            style={{ color: "var(--accent-primary)" }}
          >
            <span>{tp(lang, "Open")}</span>
            <ArrowRight className="w-3.5 h-3.5 rtl-mirror" />
          </Link>
        </div>
      )}

      {/* 1. Calm Editorial Greeting Header (Single-Row Compact on Mobile) */}
      <div className="flex items-end justify-between gap-2 pt-0.5">
        <div className="space-y-0.5 min-w-0">
          <p className="text-xs sm:text-sm font-medium truncate" style={{ color: "var(--text-muted)" }}>
            {t(lang, "greeting")}
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-[28px] font-bold tracking-tight truncate">
              {user ? user.name : "Tanvir Ahassan"}
            </h1>
            {streakDays > 0 && (
              <span
                className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
              >
                <Flame className="w-3 h-3" />
                <span>
                  {streakDays} {t(lang, "streakDays")}
                </span>
              </span>
            )}
          </div>
        </div>

        <div className="text-end text-[11px] sm:text-xs shrink-0" style={{ color: "var(--text-muted)" }}>
          <div className="font-semibold text-xs sm:text-sm" style={{ color: "var(--text-primary)" }}>
            {hijri.day} {localizedHijriMonth} {hijri.year} AH
          </div>
          <div className="mt-0.5">{localizedWeekday}</div>
        </div>
      </div>

      {/* 2. Dual Atmospheric Hero Cards (Compact on Mobile, Lush on Desktop) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5 sm:gap-4">
        {/* Next Prayer Twilight Mosque Card (Image 2 Style) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="lg:col-span-6 order-1 lg:order-2"
        >
          <Link
            href="/prayer"
            className="twilight-hero-card p-4 sm:p-6 relative overflow-hidden flex flex-col items-center justify-center text-center min-h-[122px] sm:min-h-[178px] group h-full"
          >
            {/* Atmospheric Moon, Clouds & Mosque Horizon Artwork */}
            <svg
              aria-hidden="true"
              viewBox="0 0 520 210"
              preserveAspectRatio="xMidYMax slice"
              className="pointer-events-none absolute inset-0 w-full h-full"
            >
              <defs>
                <radialGradient id="heroMoonHalo" cx="76%" cy="28%" r="36%">
                  <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.55" />
                  <stop offset="45%" stopColor="#DF98FA" stopOpacity="0.22" />
                  <stop offset="100%" stopColor="#1E1348" stopOpacity="0" />
                </radialGradient>
                <linearGradient id="mosqueSil" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#1A103D" stopOpacity="0.72" />
                  <stop offset="100%" stopColor="#080B1E" stopOpacity="0.94" />
                </linearGradient>
              </defs>
              {/* Soft Moon & Glow */}
              <circle cx="395" cy="58" r="76" fill="url(#heroMoonHalo)" />
              <circle cx="395" cy="58" r="22" fill="#FFFDF7" opacity="0.88" />
              {/* Subtle Stars */}
              <circle cx="88" cy="36" r="1.5" fill="#FFFFFF" opacity="0.65" />
              <circle cx="142" cy="54" r="1.2" fill="#FFFFFF" opacity="0.45" />
              <circle cx="290" cy="30" r="1.6" fill="#FFFFFF" opacity="0.55" />
              <circle cx="462" cy="42" r="1.3" fill="#FFFFFF" opacity="0.5" />
              {/* Drifting Twilight Clouds */}
              <path
                d="M30 92 Q58 76 86 90 Q112 80 136 94 Z"
                fill="#FFFFFF"
                opacity="0.08"
              />
              <path
                d="M320 86 Q348 70 378 84 Q405 74 432 88 Z"
                fill="#FFFFFF"
                opacity="0.1"
              />
              {/* Mosque Domes & Minarets Silhouette */}
              <path
                d="M0 210 L0 172 L36 172 L36 118 L41 96 L46 118 L46 172 L86 172 Q118 136 150 172 L196 172 L196 150 Q260 96 324 150 L324 172 L368 172 Q400 136 432 172 L472 172 L472 118 L477 96 L482 118 L482 172 L520 172 L520 210 Z"
                fill="url(#mosqueSil)"
              />
              {/* Lit Sanctuary Arch Windows */}
              <rect x="246" y="162" width="7" height="14" rx="3.5" fill="#F9B091" opacity="0.45" />
              <rect x="258" y="160" width="8" height="16" rx="4" fill="#F9B091" opacity="0.6" />
              <rect x="271" y="162" width="7" height="14" rx="3.5" fill="#F9B091" opacity="0.45" />
            </svg>

            <div className="relative z-10 space-y-0.5 sm:space-y-1">
              <div className="text-xs sm:text-sm font-medium text-white/85">
                {nextPrayerName}
              </div>
              <div className="text-2xl sm:text-[38px] font-bold tracking-tight tabular-nums text-white leading-tight">
                {formatTime(schedule.nextPrayer.jamaatTime)}
              </div>
              <div className="inline-flex flex-wrap items-center justify-center gap-1.5 text-[11px] sm:text-xs text-white/90 pt-0.5">
                <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
                <span>
                  {city.name} • {t(lang, "inTimePrefix")} {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
                </span>
                {weather && (
                  <span className="px-2 py-0.5 rounded-full bg-white/15 text-white text-[10px] sm:text-[11px] font-semibold tabular-nums">
                    {Math.round(weather.temperatureC)}°C
                  </span>
                )}
              </div>
            </div>
          </Link>
        </motion.div>

        {/* Last Read Open Mushaf Card (Image 1 & Image 2 Style) */}
        <motion.div
          whileHover={{ y: -2 }}
          transition={{ type: "spring", stiffness: 360, damping: 28 }}
          className="lg:col-span-6 order-2 lg:order-1"
        >
          <Link
            href={`/quran?surah=${lastReadSurah.number}&page=${lastReadSurah.startPage}`}
            className="quran-gradient-card p-4 sm:p-6 relative overflow-hidden flex flex-col justify-between min-h-[118px] sm:min-h-[178px] group h-full"
          >
            {/* Soft Ambient Wave Contours */}
            <svg
              aria-hidden="true"
              viewBox="0 0 400 180"
              preserveAspectRatio="none"
              className="pointer-events-none absolute inset-0 w-full h-full opacity-25"
            >
              <path d="M0 130 Q120 90 240 135 T400 115 L400 180 L0 180 Z" fill="#FFFFFF" opacity="0.22" />
              <path d="M0 152 Q150 118 280 152 T400 138 L400 180 L0 180 Z" fill="#2E1065" opacity="0.28" />
            </svg>

            {/* Sculpted Open Quran on Rehal Artwork */}
            <svg
              aria-hidden="true"
              viewBox="0 0 230 165"
              className="pointer-events-none absolute -end-3 -bottom-4 w-32 sm:w-50 h-26 sm:h-40 opacity-95 transition-transform duration-300 group-hover:scale-105"
            >
              <ellipse cx="115" cy="148" rx="68" ry="10" fill="#180838" opacity="0.32" />
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

            <div className="relative z-10 inline-flex items-center gap-1.5 text-[11px] sm:text-xs font-medium text-white/95">
              <BookOpen className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span>{t(lang, "lastRead")}</span>
            </div>

            <div className="relative z-10 mt-1.5 sm:mt-3 max-w-[70%] sm:max-w-[65%]">
              <div className="flex items-baseline gap-2">
                <h2 className="text-base sm:text-xl font-bold tracking-tight text-white truncate">
                  {lastReadSurah.englishName}
                </h2>
                <span className="font-arabic text-sm sm:text-base text-white/90 hidden sm:inline">
                  {lastReadSurah.name}
                </span>
              </div>
              <p className="text-[11px] sm:text-xs text-white/85 mt-0.5 sm:mt-1">
                {t(lang, "ayahNo")} {lastReadParsed.ayahNum} • {t(lang, "pageLabel")} {lastReadSurah.startPage}
              </p>
            </div>

            <div className="relative z-10 mt-2 sm:mt-3.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 sm:px-3.5 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold bg-black/20 backdrop-blur-xs text-white">
                <span>{t(lang, "continueJourney")}</span>
                <ChevronRight className="w-3.5 h-3.5 rtl-mirror" />
              </span>
            </div>
          </Link>
        </motion.div>
      </div>

      {/* Timely Companion Strip (Only renders on sacred events, Jumu'ah, or pre-Salah window) */}
      <RafiqBar />

      {/* 3. Clean Uncluttered Sanctuary Spaces Launcher (2-Col on Mobile so all modules fit 1 screen) */}
      <section className="space-y-2.5 sm:space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-sm sm:text-lg font-bold tracking-tight truncate">
              {t(lang, "companionModules")}
            </h2>
            <p className="text-[11px] sm:text-xs mt-0.5 hidden sm:block" style={{ color: "var(--text-muted)" }}>
              {t(lang, "selectModuleHint")}
            </p>
          </div>

          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 rounded-full text-[11px] sm:text-xs font-semibold border transition-opacity hover:opacity-90 shrink-0"
            style={{
              borderColor: "var(--border-hairline)",
              backgroundColor: "var(--bg-surface)",
              color: "var(--text-muted)",
            }}
          >
            <Sliders className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
            <span>{t(lang, "customizeModules")}</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
          {enabledModules.map((mod) => {
            const Icon = mod.Icon;
            return (
              <Link
                key={mod.id}
                href={mod.href}
                className="bento-card bento-card-interactive p-2.5 sm:p-4 flex items-center justify-between gap-2 sm:gap-3 group min-h-[58px]"
              >
                <div className="flex items-center gap-2.5 sm:gap-3.5 min-w-0">
                  <div
                    className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105"
                    style={{
                      backgroundImage: mod.featured ? "var(--gradient-brand)" : undefined,
                      backgroundColor: mod.featured ? undefined : "var(--accent-soft)",
                      color: mod.featured ? "#ffffff" : "var(--accent-primary)",
                    }}
                  >
                    <Icon className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-xs sm:text-sm truncate">{mod.resolvedTitle}</span>
                      {mod.badgeText && (
                        <span
                          className="hidden sm:inline-block text-[10px] px-2 py-0.5 rounded-full font-semibold shrink-0"
                          style={{
                            backgroundColor: "var(--gold-soft)",
                            color: "var(--accent-gold)",
                          }}
                        >
                          {tp(lang, mod.badgeText)}
                        </span>
                      )}
                    </div>
                    <div
                      className="text-[10px] sm:text-xs truncate mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {mod.resolvedSubtitle}
                    </div>
                  </div>
                </div>

                <ChevronRight
                  className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0 opacity-40 group-hover:opacity-100 transition-opacity rtl-mirror"
                  style={{ color: "var(--accent-primary)" }}
                />
              </Link>
            );
          })}
        </div>
      </section>

      {/* 4. Hairline-Divided Today's Devotions & Sacred Hijri Remembrances (Zero Nested Box Clutter) */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Today's Devotions + Spiritual Rings */}
        <div className="lg:col-span-7 bento-card p-5 space-y-3">
          <div className="flex items-center justify-between gap-3 pb-2 border-b" style={{ borderColor: "var(--border-hairline)" }}>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {t(lang, "ringsTitle")}
              </p>
              <h3 className="text-base font-bold mt-0.5">{t(lang, "dailyQuests")}</h3>
            </div>

            <div className="flex items-center gap-3">
              <div className="hidden sm:block text-end text-[11px] space-y-0.5" style={{ color: "var(--text-muted)" }}>
                <div>
                  <span className="font-semibold text-emerald-400 tabular-nums">{rings.salah}%</span> {t(lang, "salahRing")}
                </div>
                <div>
                  <span className="font-semibold text-cyan-400 tabular-nums">{rings.ilm}%</span> {t(lang, "ilmRing")}
                </div>
                <div>
                  <span className="font-semibold text-amber-400 tabular-nums">{rings.dhikr}%</span> {t(lang, "dhikrRing")}
                </div>
              </div>
              <ActivityRings salah={rings.salah} ilm={rings.ilm} dhikr={rings.dhikr} size={64} />
            </div>
          </div>

          <div className="divide-y" style={{ borderColor: "var(--border-hairline)" }}>
            {activeQuests.slice(0, 4).map((q) => (
              <div
                key={q.id}
                className="py-3 first:pt-1 last:pb-0 flex items-center justify-between gap-3 text-xs"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="min-w-0 flex-1 space-y-1.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-semibold text-xs sm:text-sm truncate">
                      {tp(lang, q.title)}
                    </span>
                    <span className="font-mono text-[11px] tabular-nums shrink-0" style={{ color: "var(--text-muted)" }}>
                      {Math.min(q.current, q.target)}/{q.target}
                    </span>
                  </div>
                  <div className="h-1.5 rounded-full overflow-hidden" style={{ backgroundColor: "var(--bg-muted)" }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${q.pct}%`,
                        backgroundImage: "var(--gradient-brand)",
                      }}
                    />
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
                    className="btn-primary px-3.5 py-1.5 rounded-full font-semibold shrink-0 cursor-pointer"
                  >
                    {t(lang, "claimReward")}
                  </button>
                ) : (
                  <Link
                    href={q.actionHref}
                    className="px-3 py-1.5 rounded-full border font-semibold shrink-0 text-center transition-opacity hover:opacity-85"
                    style={{
                      borderColor: "var(--border-hairline)",
                      color: "var(--accent-primary)",
                    }}
                  >
                    {t(lang, "goAction")}
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Urs & Family Remembrances */}
        <div className="lg:col-span-5 bento-card p-5 flex flex-col justify-between space-y-3">
          <div className="flex items-center justify-between pb-2 border-b" style={{ borderColor: "var(--border-hairline)" }}>
            <div>
              <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                {t(lang, "hijriSacredDates")}
              </p>
              <h3 className="text-base font-bold mt-0.5">{t(lang, "upcomingUrsBarsi")}</h3>
            </div>
            <Calendar className="w-4 h-4 shrink-0" style={{ color: "var(--accent-gold)" }} />
          </div>

          <div className="divide-y flex-1" style={{ borderColor: "var(--border-hairline)" }}>
            {upcomingEvents.map((ev, i) => {
              const isBarsi = ev.title.startsWith("Barsi:");
              const href = isBarsi
                ? "/barsi"
                : ev.auliyaId
                ? `/auliya?saint=${ev.auliyaId}`
                : "/auliya";
              const evMonthName = formatLocalizedHijriMonth(lang, ev.month, "");
              return (
                <Link
                  key={`${ev.title}_${i}`}
                  href={href}
                  className="py-3 first:pt-1 last:pb-1 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <div className="min-w-0">
                    <div className="font-semibold text-xs sm:text-sm truncate">{ev.title}</div>
                    <div className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {ev.subtitle}
                    </div>
                  </div>
                  <span
                    className="px-2.5 py-1 rounded-full text-[10px] font-semibold shrink-0 tabular-nums"
                    style={{
                      backgroundColor: isBarsi ? "var(--accent-soft)" : "var(--gold-soft)",
                      color: isBarsi ? "var(--accent-primary)" : "var(--accent-gold)",
                    }}
                  >
                    {ev.day} {evMonthName.split(" ")[0]}
                  </span>
                </Link>
              );
            })}
          </div>

          <div className="grid grid-cols-2 gap-2 pt-2 border-t text-xs font-semibold" style={{ borderColor: "var(--border-hairline)" }}>
            <Link
              href="/barsi"
              className="py-2 px-3 rounded-xl border text-center hover:opacity-90 truncate"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
              }}
            >
              {t(lang, "addFamilyBarsi")}
            </Link>
            <Link
              href="/admin"
              className="py-2 px-3 rounded-xl border text-center hover:opacity-90 truncate"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-elevated)",
                color: "var(--accent-primary)",
              }}
            >
              {t(lang, "addUrsSaint")}
            </Link>
          </div>
        </div>
      </section>

      {/* 5. Reference Mushaf Index: Surah | Para | Page | Sajda */}
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
              <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t(lang, "searchSurah")}
                className="w-full ps-8 pe-3 py-1.5 rounded-full border text-xs bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>
          )}
        </div>

        {activeTab === "surah" && (
          <div className="divide-y max-h-[440px] overflow-y-auto pe-1" style={{ borderColor: "var(--border-hairline)" }}>
            {filteredSurahs.map((s) => (
              <Link
                key={s.number}
                href={`/quran?surah=${s.number}&page=${s.startPage}`}
                className="py-3.5 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <StarMedallion label={String(s.number)} />
                  <div className="min-w-0">
                    <div className="font-semibold text-sm sm:text-base truncate">{s.englishName}</div>
                    <div
                      className="text-[11px] uppercase tracking-wider font-medium mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {tp(lang, s.revelationType)} • {s.numberOfAyahs} {t(lang, "versesLabel")}
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
          <div className="divide-y max-h-[440px] overflow-y-auto pe-1" style={{ borderColor: "var(--border-hairline)" }}>
            {JUZ_LIST.map((j) => (
              <Link
                key={j.juz}
                href={`/quran?page=${j.startPage}`}
                className="py-3.5 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <StarMedallion label={String(j.juz)} />
                  <div>
                    <div className="font-semibold text-sm sm:text-base">
                      {t(lang, "paraLabel")} {j.juz}
                    </div>
                    <div
                      className="text-[11px] font-medium mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {j.surahName} ({j.surahNum}:{j.ayahNum}) • {t(lang, "pageLabel")} {j.startPage}
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
          <div className="divide-y max-h-[440px] overflow-y-auto pe-1" style={{ borderColor: "var(--border-hairline)" }}>
            {keyMushafPages.map((item) => (
              <Link
                key={item.page}
                href={`/quran?page=${item.page}`}
                className="py-3.5 flex items-center justify-between gap-3 hover:opacity-85 transition-opacity"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <div className="flex items-center gap-4 min-w-0">
                  <StarMedallion label={String(item.page)} small />
                  <div>
                    <div className="font-semibold text-sm sm:text-base">{item.title}</div>
                    <div
                      className="text-[11px] font-medium mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t(lang, "pageLabel")} {item.page} • {t(lang, "paraLabel")} {item.para}
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
          <div className="divide-y max-h-[440px] overflow-y-auto pe-1" style={{ borderColor: "var(--border-hairline)" }}>
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
                    <StarMedallion label={String(idx + 1)} />
                    <div>
                      <div className="font-semibold text-sm sm:text-base">{s.label}</div>
                      <div
                        className="text-[11px] font-medium mt-0.5"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {tp(lang, "Wajib Sajda")} • {t(lang, "pageLabel")} {s.page}
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
                    {done ? tp(lang, "Completed") : `${t(lang, "pageLabel")} ${s.page}`}
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

function StarMedallion({ label, small = false }: { label: string; small?: boolean }) {
  return (
    <span
      className="relative w-9 h-9 inline-flex items-center justify-center shrink-0"
      style={{ color: "var(--accent-primary)" }}
    >
      <svg viewBox="0 0 36 36" className="w-9 h-9" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="6.5" y="6.5" width="23" height="23" rx="2" />
        <rect x="6.5" y="6.5" width="23" height="23" rx="2" transform="rotate(45 18 18)" />
      </svg>
      <span
        className={`absolute ${small ? "text-[10px]" : "text-xs"} font-semibold tabular-nums`}
        style={{ color: "var(--text-primary)" }}
      >
        {label}
      </span>
    </span>
  );
}
