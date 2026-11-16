"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  Flame,
  BookOpen,
  Trophy,
  Calculator,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Scale,
  ShieldCheck,
  Check,
  MapPin,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { CITY_PRESETS, formatCountdown, formatTime, PrayerName } from "@/lib/prayer-engine";
import { getEventsForHijri, getUpcomingEvents } from "@/lib/hijri";
import { TASBIH_LITANIES } from "@/data/fiqh-hadith";

export default function DashboardPage() {
  const {
    now,
    lang,
    city,
    setCity,
    hijri,
    hilalOffset,
    setHilalOffset,
    schedule,
    streakDays,
    salahToday,
    logSalah,
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
      badge: `Resume ${lastQuranRef}`,
      meta: `${sajdaCompleted.length}/14 Hanafi Sajdas`,
      icon: BookOpen,
      accent: "var(--accent-primary)",
      bg: "var(--accent-soft)",
    },
    {
      href: "/prayer",
      title: "Hanafi Prayer & Qibla",
      subtitle: "Mithlayn Asr • Azan & Jamaat Table",
      badge: `${fardCompletedCount}/5 Logged`,
      meta: `Qibla ${schedule.qiblaBearing}°`,
      icon: Clock,
      accent: "var(--accent-secondary)",
      bg: "rgba(2, 132, 199, 0.12)",
    },
    {
      href: "/tasbih",
      title: "Tasbih & Litanies",
      subtitle: activeLitany.name,
      badge: `${tasbihTotalToday}/${tasbihTarget}`,
      meta: "33 / 99 / 100 Haptic Beads",
      icon: Sparkles,
      accent: "var(--accent-gold)",
      bg: "var(--gold-soft)",
    },
    {
      href: "/auliya",
      title: "Auliya Urs & 360° Ziyarat",
      subtitle: nextEvent ? nextEvent.title : `${allAuliya.length} Sunni Saints`,
      badge: todayEvents.length > 0 ? "Urs Today" : "Shrine Guide",
      meta: "Ajmer • Baghdad • Bareilly",
      icon: Compass,
      accent: "var(--accent-primary)",
      bg: "var(--accent-soft)",
    },
    {
      href: "/quiz",
      title: "Sahib-e-Ilm Hot Seat Quiz",
      subtitle: "15-Tier KBC Challenge • 4 Lifelines",
      badge: `${ilmPoints.toLocaleString()} XP`,
      meta: bestQuizTier > 0 ? `Best: Tier ${bestQuizTier}/15` : "Fastest Finger First",
      icon: Trophy,
      accent: "var(--accent-gold)",
      bg: "var(--gold-soft)",
    },
    {
      href: "/fiqh",
      title: "Hanafi Fiqh & Hadith",
      subtitle: "Bahar-e-Shariat • Fatawa Razawiyya",
      badge: "Verified Rulings",
      meta: "Taharah • Salah • Sawm • Aqeedah",
      icon: Scale,
      accent: "var(--accent-secondary)",
      bg: "rgba(2, 132, 199, 0.12)",
    },
    {
      href: "/zakat",
      title: "Hanafi Zakat Calculator",
      subtitle: "Silver Nisab (612.36g / 52.5 Tola)",
      badge: "2.5% Fard",
      meta: "Lunar Hawl Tracker",
      icon: Calculator,
      accent: "var(--accent-primary)",
      bg: "var(--accent-soft)",
    },
    {
      href: "/admin",
      title: "Curator & Audit Studio",
      subtitle: "Add Custom Auliya & Family Barsis",
      badge: "Local Vault",
      meta: "SHA-256 Integrity",
      icon: ShieldCheck,
      accent: "var(--text-muted)",
      bg: "var(--bg-muted)",
    },
  ];

  return (
    <div className="flex-1 flex flex-col justify-between gap-4 sm:gap-5">
      {/* 1. Compact Greeting + Hijri + City Row */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight">
            Assalamu Alaikum{user ? `, ${user.name}` : ""}
          </h1>
          <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
            {hijri.weekday} • <strong>{hijri.formatted}</strong> • {city.name}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {/* Mobile City Selector */}
          <div
            className="sm:hidden flex items-center gap-1 px-2.5 py-1.5 rounded-xl border"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            <MapPin className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
            <select
              aria-label="Select City"
              value={city.id}
              onChange={(e) => {
                const found = CITY_PRESETS.find((c) => c.id === e.target.value);
                if (found) setCity(found);
              }}
              className="bg-transparent outline-none font-medium max-w-[110px] truncate"
            >
              {CITY_PRESETS.map((c) => (
                <option key={c.id} value={c.id} className="text-black">
                  {c.name}
                </option>
              ))}
            </select>
          </div>

          {/* Hilal Offset Quick Pill */}
          <div
            className="inline-flex items-center gap-1 px-2 py-1 rounded-xl border"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            title="Local Moon Sighting Offset"
          >
            <span className="text-[11px] opacity-75">Hilal:</span>
            {([-1, 0, 1] as const).map((offset) => (
              <button
                key={offset}
                type="button"
                onClick={() => setHilalOffset(offset)}
                className="px-1.5 py-0.5 rounded-lg text-[11px] font-bold cursor-pointer"
                style={{
                  backgroundColor: hilalOffset === offset ? "var(--accent-primary)" : "transparent",
                  color: hilalOffset === offset ? "#ffffff" : "var(--text-muted)",
                }}
              >
                {offset > 0 ? `+${offset}` : offset}
              </button>
            ))}
          </div>

          <span
            className="px-2.5 py-1.5 rounded-xl font-semibold inline-flex items-center gap-1"
            style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
          >
            <Flame className="w-3.5 h-3.5" />
            <span>
              {streakDays} {t(lang, "streakDays")}
            </span>
          </span>
        </div>
      </div>

      {/* 2. Live Next Prayer & 5-Prayer Quick Tracker Hero Banner */}
      <motion.section
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="bento-card hero-surface p-4 sm:p-5 relative overflow-hidden"
      >
        <svg
          aria-hidden="true"
          viewBox="0 0 600 180"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-36 opacity-[0.10] dark:opacity-[0.16]"
        >
          <path
            d="M0 180 L0 152 L48 152 L48 124 L54 106 L60 124 L60 152 L110 152 L110 140 Q140 105 170 140 L170 152 L225 152 L225 132 Q265 78 305 132 L305 152 L345 152 L345 110 L351 90 L357 110 L357 152 L420 152 L420 138 Q445 110 470 138 L470 152 L535 152 L535 120 L541 102 L547 120 L547 152 L600 152 L600 180 Z"
            fill="currentColor"
          />
        </svg>

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center justify-between sm:justify-start gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {t(lang, "nextPrayer")}
                </span>
                {schedule.activeMakruh ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-500/15 text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    {t(lang, "makruhWarning")}
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium"
                    style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {t(lang, "safeWindow")}
                  </span>
                )}
              </div>

              <div className="mt-1 flex items-baseline gap-3">
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight">
                  {schedule.nextPrayer.label}
                </h2>
                <span
                  className="text-lg sm:text-xl font-mono font-bold tabular-nums"
                  style={{ color: "var(--accent-secondary)" }}
                >
                  {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
                </span>
              </div>

              <div className="mt-1 text-xs flex items-center gap-3" style={{ color: "var(--text-muted)" }}>
                <span>
                  Azan: <strong style={{ color: "var(--text-primary)" }}>{formatTime(schedule.nextPrayer.azanTime)}</strong>
                </span>
                <span>•</span>
                <span>
                  Jamaat: <strong style={{ color: "var(--accent-primary)" }}>{formatTime(schedule.nextPrayer.jamaatTime)}</strong>
                </span>
              </div>
            </div>
          </div>

          {/* 5 Daily Prayers 1-Tap Tracker */}
          <div className="grid grid-cols-5 gap-1.5 sm:gap-2 lg:w-[440px]">
            {(["fajr", "dhuhr", "asr", "maghrib", "isha"] as PrayerName[]).map((pKey) => {
              const w = schedule.rows.find((pr) => pr.name === pKey)!;
              const status = salahToday[pKey];
              const isNext = schedule.nextPrayer.name === pKey;
              const isLogged = status !== "none";
              return (
                <button
                  key={pKey}
                  type="button"
                  onClick={() => logSalah(pKey, status === "none" ? "jamaat" : "none")}
                  className="p-2 rounded-xl border text-center transition-all cursor-pointer flex flex-col items-center justify-center gap-0.5 min-h-[58px]"
                  style={{
                    borderColor: isNext
                      ? "var(--accent-primary)"
                      : isLogged
                      ? "rgba(16, 185, 129, 0.45)"
                      : "var(--border-hairline)",
                    backgroundColor: isLogged
                      ? "var(--accent-soft)"
                      : isNext
                      ? "rgba(16, 185, 129, 0.08)"
                      : "var(--bg-muted)",
                  }}
                >
                  <div className="flex items-center gap-1 text-[11px] font-semibold">
                    <span>{w.label.split(" ")[0]}</span>
                    {isLogged && <Check className="w-3 h-3 text-emerald-500" />}
                  </div>
                  <div className="text-[11px] font-mono font-bold tabular-nums">
                    {formatTime(w.jamaatTime)}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.section>

      {/* 3. Choose What You Want To Use — Responsive Single-Screen Module Grid */}
      <section aria-label="Select a Companion Module" className="space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
            Select a Module to Open Full-Screen
          </h2>
          <span className="text-[11px]" style={{ color: "var(--text-muted)" }}>
            Tap any card to focus on that module
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {moduleCards.map((mod, idx) => {
            const Icon = mod.icon;
            return (
              <motion.div
                key={mod.href}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.03, duration: 0.22 }}
              >
                <Link
                  href={mod.href}
                  className="bento-card bento-card-interactive h-full p-4 sm:p-5 flex flex-col justify-between gap-3 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div
                      className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105"
                      style={{ backgroundColor: mod.bg, color: mod.accent }}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <span
                      className="px-2.5 py-1 rounded-full text-[10px] sm:text-[11px] font-bold truncate max-w-[120px]"
                      style={{ backgroundColor: mod.bg, color: mod.accent }}
                    >
                      {mod.badge}
                    </span>
                  </div>

                  <div className="space-y-1">
                    <h3 className="text-sm sm:text-base font-bold tracking-tight leading-snug">
                      {mod.title}
                    </h3>
                    <p className="text-xs line-clamp-2 leading-relaxed" style={{ color: "var(--text-muted)" }}>
                      {mod.subtitle}
                    </p>
                  </div>

                  <div
                    className="pt-2.5 border-t flex items-center justify-between gap-2 text-[11px] font-semibold"
                    style={{ borderColor: "var(--border-hairline)", color: mod.accent }}
                  >
                    <span className="truncate">{mod.meta}</span>
                    <ArrowRight className="w-3.5 h-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
