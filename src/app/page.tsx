"use client";

import { assetUrl } from "@/lib/assets";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Compass,
  Flame,
  Shield,
  BookOpen,
  Trophy,
  Calculator,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Clock,
  Scale,
  ShieldCheck,
  Check,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { t } from "@/lib/i18n";
import { formatCountdown, formatTime, PrayerName } from "@/lib/prayer-engine";
import { getEventsForHijri, getUpcomingEvents } from "@/lib/hijri";
import { ActivityRings } from "@/components/ActivityRings";
import { RafiqBar } from "@/components/RafiqBar";
import { TASBIH_LITANIES } from "@/data/fiqh-hadith";

export default function DashboardPage() {
  const {
    now,
    lang,
    city,
    hijri,
    hilalOffset,
    setHilalOffset,
    schedule,
    rings,
    streakDays,
    qazaShieldAvailable,
    salahToday,
    logSalah,
    tasbihTotalToday,
    tasbihTarget,
    activeLitanyId,
    incrementTasbih,
    ilmPoints,
    bestQuizTier,
    lastQuranRef,
    hawlHijriMonth,
    hawlHijriDay,
    allAuliya,
    user,
  } = useApp();

  const todayEvents = getEventsForHijri(hijri.month, hijri.day);
  const upcomingEvents = getUpcomingEvents(hijri.month, hijri.day);
  const activeLitany = TASBIH_LITANIES.find((l) => l.id === activeLitanyId) || TASBIH_LITANIES[0];
  const featuredWali =
    (todayEvents[0]?.auliyaId && allAuliya.find((a) => a.id === todayEvents[0].auliyaId)) ||
    allAuliya[0];

  const handleQuickTasbih = () => {
    incrementTasbih(1);
    if (typeof navigator !== "undefined" && navigator.vibrate) {
      const next = tasbihTotalToday + 1;
      navigator.vibrate(next === 33 || next === 99 || next === 100 ? [35, 30, 35] : 12);
    }
  };

  return (
    <div className="space-y-6">
      {/* Page H1 for semantic hierarchy & accessibility */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Assalamu Alaikum{user ? `, ${user.name}` : ""} — {city.name}
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            {hijri.weekday} • {hijri.formatted} • {t(lang, "hanafiLocked")}
          </p>
        </div>
        <div className="flex items-center gap-2 text-xs">
          <span
            className="px-2.5 py-1 rounded-full border font-medium"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            {user ? "Saved on this device" : t(lang, "guestMode")}
          </span>
          <span
            className="px-2.5 py-1 rounded-full font-semibold inline-flex items-center gap-1"
            style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
          >
            <Flame className="w-3.5 h-3.5" />
            {streakDays} {t(lang, "streakDays")}
          </span>
        </div>
      </div>

      {/* 1. Dynamic Rafiq Companion Bar */}
      <RafiqBar />

      {/* 1b. Quick Sanctuary Shortcuts (inspired by clean mobile/web launcher tiles) */}
      <div className="grid grid-cols-4 sm:grid-cols-8 gap-2.5">
        {[
          { href: "/prayer", label: "Prayer", icon: Clock, tone: "var(--accent-primary)", bg: "var(--accent-soft)" },
          { href: "/quran", label: "Quran", icon: BookOpen, tone: "var(--accent-secondary)", bg: "rgba(2, 132, 199, 0.12)" },
          { href: "/tasbih", label: "Tasbih", icon: Sparkles, tone: "var(--accent-gold)", bg: "var(--gold-soft)" },
          { href: "/auliya", label: "Auliya 360°", icon: Compass, tone: "var(--accent-primary)", bg: "var(--accent-soft)" },
          { href: "/fiqh", label: "Fiqh", icon: Scale, tone: "var(--accent-secondary)", bg: "rgba(2, 132, 199, 0.12)" },
          { href: "/zakat", label: "Zakat", icon: Calculator, tone: "var(--accent-gold)", bg: "var(--gold-soft)" },
          { href: "/quiz", label: "Ilm Quiz", icon: Trophy, tone: "var(--accent-primary)", bg: "var(--accent-soft)" },
          { href: "/admin", label: "Studio", icon: ShieldCheck, tone: "var(--text-muted)", bg: "var(--bg-muted)" },
        ].map((tile) => {
          const Icon = tile.icon;
          return (
            <Link
              key={tile.href}
              href={tile.href}
              className="bento-card bento-card-interactive p-2.5 sm:p-3 flex flex-col items-center justify-center gap-1.5 text-center"
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: tile.bg, color: tile.tone }}
              >
                <Icon className="w-4 h-4" />
              </div>
              <span className="text-[11px] font-semibold tracking-tight truncate w-full">
                {tile.label}
              </span>
            </Link>
          );
        })}
      </div>

      {/* 2. Apple-Style Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hero Card: Live Hanafi Azan & Custom Jamaat Countdown with Celestial Sky & Mosque Arc */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="lg:col-span-7 bento-card hero-surface p-5 sm:p-6 relative overflow-hidden flex flex-col justify-between"
        >
          {/* Atmospheric twilight/night mosque silhouette & celestial arc */}
          <svg
            aria-hidden="true"
            viewBox="0 0 600 180"
            preserveAspectRatio="xMidYMax slice"
            className="pointer-events-none absolute inset-x-0 bottom-0 w-full h-44 opacity-[0.12] dark:opacity-[0.18]"
          >
            <defs>
              <linearGradient id="skyArc" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10B981" stopOpacity="0.1" />
                <stop offset="50%" stopColor="#F59E0B" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#00E5FF" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Celestial sun/moon arc */}
            <path d="M 60 155 Q 300 10 540 155" fill="none" stroke="url(#skyArc)" strokeWidth="2" strokeDasharray="4 4" />
            <circle cx="145" cy="100" r="4" fill="#10B981" />
            <circle cx="240" cy="65" r="4" fill="#F59E0B" />
            <circle cx="345" cy="62" r="5" fill="#F59E0B" />
            <circle cx="445" cy="96" r="4" fill="#00E5FF" />
            {/* Crescent */}
            <path d="M 520 34 A 12 12 0 1 0 534 48 A 9 9 0 1 1 520 34 Z" fill="#F59E0B" opacity="0.8" />
            {/* Mosque dome & minarets silhouette */}
            <path
              d="M0 180 L0 152 L48 152 L48 124 L54 106 L60 124 L60 152 L110 152 L110 140 Q140 105 170 140 L170 152 L225 152 L225 132 Q265 78 305 132 L305 152 L345 152 L345 110 L351 90 L357 110 L357 152 L420 152 L420 138 Q445 110 470 138 L470 152 L535 152 L535 120 L541 102 L547 120 L547 152 L600 152 L600 180 Z"
              fill="currentColor"
            />
          </svg>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2">
                <span
                  className="text-xs font-semibold uppercase tracking-wider"
                  style={{ color: "var(--accent-primary)" }}
                >
                  {t(lang, "nextPrayer")}
                </span>
                {schedule.activeMakruh ? (
                  <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-red-500/15 text-red-400">
                    <AlertTriangle className="w-3 h-3" />
                    {t(lang, "makruhWarning")}
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-medium"
                    style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}
                  >
                    <CheckCircle2 className="w-3 h-3" />
                    {t(lang, "safeWindow")}
                  </span>
                )}
              </div>

              <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight leading-tight">
                {schedule.nextPrayer.label}
              </h2>

              <div className="mt-2 text-xs flex flex-wrap items-center gap-x-3 gap-y-1" style={{ color: "var(--text-muted)" }}>
                <span>
                  {t(lang, "azanTime")}:{" "}
                  <strong className="tabular-nums" style={{ color: "var(--text-primary)" }}>
                    {formatTime(schedule.nextPrayer.azanTime)}
                  </strong>
                </span>
                <span aria-hidden="true">•</span>
                <span>
                  {t(lang, "jamaatTime")}:{" "}
                  <strong className="tabular-nums" style={{ color: "var(--accent-primary)" }}>
                    {formatTime(schedule.nextPrayer.jamaatTime)}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex flex-row sm:flex-col items-center sm:items-end justify-between sm:justify-start gap-2.5 shrink-0">
              <div
                className="px-3.5 py-2 rounded-2xl border text-center sm:text-end backdrop-blur-md"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <div className="text-[10px] uppercase tracking-wider font-semibold" style={{ color: "var(--text-muted)" }}>
                  Countdown
                </div>
                <div
                  className="text-2xl sm:text-3xl font-mono font-bold tabular-nums leading-tight"
                  style={{ color: "var(--accent-secondary)" }}
                >
                  {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
                </div>
              </div>

              <div className="flex flex-col items-end gap-1.5">
                <div
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl border text-[11px] font-semibold"
                  style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                >
                  <Compass className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                  <span className="tabular-nums">
                    {t(lang, "qiblaBearing")}: {schedule.qiblaBearing}°
                  </span>
                </div>
                <Link
                  href="/prayer"
                  className="text-xs font-semibold inline-flex items-center gap-1 hover:underline"
                  style={{ color: "var(--accent-secondary)" }}
                >
                  <span>Customize Jamaat</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Connected 5-Prayer Tracker Stepper (1-tap cycle) */}
          <div className="relative z-10 mt-6 pt-5 border-t" style={{ borderColor: "var(--border-hairline)" }}>
            <div className="flex items-center justify-between mb-3">
              <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                Today&apos;s Prayer Tracker (tap to log)
              </span>
              <span className="text-[11px] font-medium" style={{ color: "var(--accent-primary)" }}>
                {Object.values(salahToday).filter((s) => s !== "none").length}/5 logged
              </span>
            </div>

            <div className="relative grid grid-cols-5 gap-1 sm:gap-2">
              {/* Connecting horizontal track behind nodes */}
              <div
                aria-hidden="true"
                className="pointer-events-none absolute top-[38px] inset-x-[10%] h-[2px]"
                style={{ backgroundColor: "var(--border-hairline)" }}
              />
              {schedule.rows.map((row) => {
                const status = salahToday[row.name];
                const isDone = status !== "none";
                const isNext = schedule.nextPrayer.name === row.name;
                const cycle: Record<string, "none" | "jamaat" | "ontime" | "qaza"> = {
                  none: "jamaat",
                  jamaat: "ontime",
                  ontime: "qaza",
                  qaza: "none",
                };
                const statusLabel =
                  status === "none"
                    ? "Log"
                    : status === "jamaat"
                    ? "Jamaat"
                    : status === "ontime"
                    ? "On Time"
                    : "Qaza";
                const nodeColor =
                  status === "jamaat"
                    ? "var(--accent-primary)"
                    : status === "ontime"
                    ? "var(--accent-secondary)"
                    : status === "qaza"
                    ? "var(--accent-gold)"
                    : isNext
                    ? "var(--accent-secondary)"
                    : "var(--border-hairline)";
                return (
                  <button
                    key={row.name}
                    type="button"
                    onClick={() => logSalah(row.name as PrayerName, cycle[status])}
                    className="relative z-10 flex flex-col items-center text-center group cursor-pointer active:scale-95 transition-transform"
                  >
                    <span className="text-[10px] sm:text-[11px] font-semibold tracking-wide capitalize">
                      {row.name}
                    </span>
                    <span className="text-[10px] sm:text-xs font-bold tabular-nums mb-1.5" style={{ color: "var(--text-muted)" }}>
                      {formatTime(row.jamaatTime)}
                    </span>
                    <span
                      className="w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center transition-all"
                      style={{
                        borderColor: nodeColor,
                        backgroundColor: isDone ? nodeColor : "var(--bg-surface)",
                        color: isDone ? "#FFFFFF" : "var(--text-muted)",
                        boxShadow: isNext && !isDone ? "0 0 0 4px rgba(0, 229, 255, 0.14)" : undefined,
                      }}
                    >
                      {isDone ? (
                        <Check className="w-3.5 h-3.5 sm:w-4 sm:h-4 stroke-[2.75]" />
                      ) : (
                        <span
                          className="w-2 h-2 rounded-full"
                          style={{ backgroundColor: isNext ? "var(--accent-secondary)" : "var(--border-hairline)" }}
                        />
                      )}
                    </span>
                    <span
                      className="text-[10px] mt-1 font-medium"
                      style={{ color: isDone ? nodeColor : "var(--text-muted)" }}
                    >
                      {statusLabel}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </motion.section>

        {/* Three Daily Completion Rings & Merciful Qaza Shield */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32, delay: 0.05 }}
          className="lg:col-span-5 bento-card p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold">{t(lang, "ringsTitle")}</h2>
            {qazaShieldAvailable && (
              <span
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}
              >
                <Shield className="w-3 h-3" />
                {t(lang, "qazaShieldActive")}
              </span>
            )}
          </div>

          <div className="flex items-center gap-6 my-4">
            <ActivityRings salah={rings.salah} ilm={rings.ilm} dhikr={rings.dhikr} size={132} />
            <div className="space-y-2.5 flex-1">
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]" />
                  {t(lang, "salahRing")}
                </span>
                <span className="font-bold tabular-nums">{rings.salah}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00E5FF]" />
                  {t(lang, "ilmRing")}
                </span>
                <span className="font-bold tabular-nums">{rings.ilm}%</span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="flex items-center gap-2 font-medium">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]" />
                  {t(lang, "dhikrRing")}
                </span>
                <span className="font-bold tabular-nums">{rings.dhikr}%</span>
              </div>
            </div>
          </div>

          <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
            Missed a Fard window? Log <strong>Qaza</strong> within 48 hours to preserve your{" "}
            {streakDays}-day streak with authentic Hanafi accountability.
          </p>
        </motion.section>

        {/* Smart Tasbih Quick-Tap Widget (Interactive in < 3 seconds) */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32, delay: 0.1 }}
          className="lg:col-span-5 bento-card p-6 flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                {t(lang, "quickTasbih")}
              </span>
              <h2 className="text-base font-bold mt-0.5">{activeLitany.name}</h2>
            </div>
            <Link href="/tasbih" className="text-xs font-semibold hover:underline" style={{ color: "var(--accent-secondary)" }}>
              Full Studio →
            </Link>
          </div>

          <p className="font-arabic text-right text-lg mt-3 leading-loose" dir="rtl">
            {activeLitany.arabic}
          </p>

          <div className="mt-4 flex items-center justify-between gap-4">
            <div>
              <div className="text-3xl font-bold tabular-nums">
                {tasbihTotalToday}
                <span className="text-sm font-normal" style={{ color: "var(--text-muted)" }}>
                  {" "}
                  / {tasbihTarget}
                </span>
              </div>
              <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                Haptic pulse at 33, 99 &amp; 100
              </div>
            </div>
            <button
              type="button"
              onClick={handleQuickTasbih}
              className="px-6 py-3.5 rounded-2xl font-semibold text-sm text-white shadow-lg transition-transform active:scale-95 cursor-pointer inline-flex items-center gap-2"
              style={{ backgroundColor: "var(--accent-primary)" }}
            >
              <Sparkles className="w-4 h-4" />
              <span>{t(lang, "tapToCount")}</span>
            </button>
          </div>
        </motion.section>

        {/* Today in Hijri & Auliya Spotlight */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32, delay: 0.14 }}
          className="lg:col-span-7 bento-card p-6 flex flex-col justify-between"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
              <h2 className="text-base font-bold">{t(lang, "hijriSpotlight")}</h2>
            </div>
            <div className="flex items-center gap-1.5 text-xs">
              <span style={{ color: "var(--text-muted)" }}>{t(lang, "hilalOffset")}:</span>
              {[-2, -1, 0, 1, 2].map((o) => (
                <button
                  key={o}
                  type="button"
                  onClick={() => setHilalOffset(o)}
                  className="px-2 py-0.5 rounded-lg border text-[11px] font-semibold cursor-pointer"
                  style={{
                    borderColor: hilalOffset === o ? "var(--accent-gold)" : "var(--border-hairline)",
                    backgroundColor: hilalOffset === o ? "var(--gold-soft)" : "transparent",
                    color: hilalOffset === o ? "var(--accent-gold)" : "var(--text-muted)",
                  }}
                >
                  {o > 0 ? `+${o}` : o}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 mt-4 items-center">
            <div className="sm:col-span-5 rounded-xl overflow-hidden border h-36 relative" style={{ borderColor: "var(--border-hairline)" }}>
              <img
                src={assetUrl(featuredWali.shrineImage)}
                alt={`${featuredWali.city} Shrine Architecture`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent flex items-end p-3">
                <div className="text-white">
                  <div className="text-[10px] uppercase tracking-wider opacity-85">{featuredWali.silsila} Silsila</div>
                  <div className="text-xs font-bold">{featuredWali.city}</div>
                </div>
              </div>
            </div>

            <div className="sm:col-span-7 space-y-2">
              <div className="text-xs font-semibold" style={{ color: "var(--accent-gold)" }}>
                {featuredWali.ursLabel}
              </div>
              <h3 className="text-lg font-bold leading-snug">{featuredWali.name}</h3>
              <p className="text-xs leading-relaxed line-clamp-2" style={{ color: "var(--text-muted)" }}>
                {featuredWali.shortSummary}
              </p>
              <div className="flex flex-wrap gap-2 pt-1">
                <Link
                  href={`/auliya?saint=${featuredWali.id}`}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                >
                  Read Tazkirah &amp; Shajrah
                </Link>
                <Link
                  href={`/auliya?saint=${featuredWali.id}&tab=ziyarat`}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  360° Ziyarat
                </Link>
              </div>
            </div>
          </div>

          {/* Upcoming Sacred Dates Strip */}
          <div className="mt-4 pt-3 border-t flex flex-wrap gap-2" style={{ borderColor: "var(--border-hairline)" }}>
            {upcomingEvents.map((ev) => (
              <span
                key={`${ev.month}-${ev.day}`}
                className="text-[11px] px-2.5 py-1 rounded-full border"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                <strong>
                  {ev.day}/{ev.month} AH:
                </strong>{" "}
                {ev.title}
              </span>
            ))}
          </div>
        </motion.section>
      </div>

      {/* 3. Continue Your Journey (Cross-Module Bridges) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Link href="/quran" className="bento-card p-5 hover:scale-[1.01] transition-transform block">
          <div className="flex items-center justify-between">
            <BookOpen className="w-5 h-5" style={{ color: "var(--accent-secondary)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--accent-secondary)" }}>
              Kanzul Iman
            </span>
          </div>
          <h3 className="font-bold mt-3">Resume Quran &amp; Sajda Log</h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Last bookmarked Ayah {lastQuranRef} • Indo-Pak &amp; Uthmani scripts with 14 Hanafi Sajdas.
          </p>
        </Link>

        <Link href="/zakat" className="bento-card p-5 hover:scale-[1.01] transition-transform block">
          <div className="flex items-center justify-between">
            <Calculator className="w-5 h-5" style={{ color: "var(--accent-primary)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--accent-primary)" }}>
              Hawl: {hawlHijriDay}/{hawlHijriMonth} AH
            </span>
          </div>
          <h3 className="font-bold mt-3">Hanafi Silver-First Zakat</h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            612.36g Silver Nisab • AES-256-GCM client-encrypted asset ledger.
          </p>
        </Link>

        <Link href="/quiz" className="bento-card p-5 hover:scale-[1.01] transition-transform block">
          <div className="flex items-center justify-between">
            <Trophy className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
            <span className="text-[11px] font-semibold" style={{ color: "var(--accent-gold)" }}>
              {ilmPoints.toLocaleString()} Ilm XP
            </span>
          </div>
          <h3 className="font-bold mt-3">15-Tier Sahib-e-Ilm Trivia</h3>
          <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
            Best Tier: {bestQuizTier}/15 • 4 Lifelines &amp; verified Proof Cards.
          </p>
        </Link>
      </div>
    </div>
  );
}
