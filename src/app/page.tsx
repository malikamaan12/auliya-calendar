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

      {/* 2. Apple-Style Bento Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Hero Card: Live Hanafi Azan & Custom Jamaat Countdown */}
        <motion.section
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          className="lg:col-span-7 bento-card p-6 relative overflow-hidden"
        >
          {/* Subtle 4% opacity geometric octagram watermark strictly on hero header */}
          <svg
            aria-hidden="true"
            className="pointer-events-none absolute -end-12 -top-12 w-64 h-64 opacity-[0.04]"
            viewBox="0 0 100 100"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
          >
            <rect x="20" y="20" width="60" height="60" />
            <rect x="20" y="20" width="60" height="60" transform="rotate(45 50 50)" />
            <circle cx="50" cy="50" r="24" />
          </svg>

          <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <div className="flex items-center gap-2">
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

              <div className="mt-2 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-bold tracking-tight">
                  {schedule.nextPrayer.label}
                </span>
                <span
                  className="text-2xl sm:text-3xl font-mono font-semibold tabular-nums"
                  style={{ color: "var(--accent-secondary)" }}
                >
                  {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
                </span>
              </div>

              <div className="mt-1.5 text-xs flex flex-wrap items-center gap-3" style={{ color: "var(--text-muted)" }}>
                <span>
                  {t(lang, "azanTime")}:{" "}
                  <strong className="tabular-nums" style={{ color: "var(--text-primary)" }}>
                    {formatTime(schedule.nextPrayer.azanTime)}
                  </strong>
                </span>
                <span>•</span>
                <span>
                  {t(lang, "jamaatTime")}:{" "}
                  <strong className="tabular-nums" style={{ color: "var(--accent-primary)" }}>
                    {formatTime(schedule.nextPrayer.jamaatTime)}
                  </strong>
                </span>
              </div>
            </div>

            <div className="flex sm:flex-col items-end gap-2">
              <div
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                <Compass className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
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

          {/* 5 Daily Prayers Quick-Log Row */}
          <div className="relative z-10 grid grid-cols-5 gap-2 mt-6 pt-5 border-t" style={{ borderColor: "var(--border-hairline)" }}>
            {schedule.rows.map((row) => {
              const status = salahToday[row.name];
              const isDone = status !== "none";
              const cycle: Record<string, "none" | "jamaat" | "ontime" | "qaza"> = {
                none: "jamaat",
                jamaat: "ontime",
                ontime: "qaza",
                qaza: "none",
              };
              return (
                <button
                  key={row.name}
                  type="button"
                  onClick={() => logSalah(row.name as PrayerName, cycle[status])}
                  className="p-2.5 rounded-xl border text-start transition-all cursor-pointer active:scale-95"
                  style={{
                    borderColor: isDone ? "var(--accent-primary)" : "var(--border-hairline)",
                    backgroundColor: isDone ? "var(--accent-soft)" : "var(--bg-muted)",
                  }}
                >
                  <div className="text-[11px] font-semibold truncate">{row.name.toUpperCase()}</div>
                  <div className="text-xs font-bold tabular-nums mt-0.5">{formatTime(row.jamaatTime)}</div>
                  <div className="text-[10px] mt-1 capitalize" style={{ color: "var(--text-muted)" }}>
                    {status === "none" ? "Tap to log" : status}
                  </div>
                </button>
              );
            })}
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
