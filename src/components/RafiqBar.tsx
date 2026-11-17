"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowUpRight, Compass } from "lucide-react";
import { useApp } from "@/lib/store";
import { getEventsForHijri } from "@/lib/hijri";
import { t } from "@/lib/i18n";

export function RafiqBar() {
  const { now, cityHour, hijri, schedule, rings, lastQuranRef, lang, dynamicCalendarEvents } = useApp();

  const prompt = useMemo(() => {
    const minsToNext = Math.round(
      (schedule.nextPrayer.jamaatTime.getTime() - now.getTime()) / 60000
    );
    const todayEvents = getEventsForHijri(hijri.month, hijri.day, dynamicCalendarEvents);

    if (todayEvents.length > 0) {
      const ev = todayEvents[0];
      const isBarsi = ev.title.startsWith("Barsi:");
      return {
        badge: isBarsi ? "Family Barsi Today" : "Active Urs / Sacred Date",
        message: isBarsi
          ? `Today is ${hijri.formatted} — ${ev.title}. Dedicate Surah Al-Fatihah, Surah Yasin, or a Khatm Para in the Barsi Sanctuary?`
          : `Today is ${hijri.formatted} — ${ev.title}. Step inside the shrine courtyard in 360° Ziyarat or read their Shajrah?`,
        ctaLabel: isBarsi ? "Send Fatiha Gift" : "Open 360° Ziyarat",
        href: isBarsi
          ? "/barsi"
          : ev.auliyaId
          ? `/auliya?saint=${ev.auliyaId}&tab=ziyarat`
          : "/auliya",
      };
    }

    if (hijri.isGyarhviSharif) {
      return {
        badge: "11th Hijri • Gyarhvi Sharif",
        message: `Today is ${hijri.formatted} — monthly Gyarhvi Sharif remembrance of Ghaus-e-Azam. Step inside Baghdad Sharif in 360° or recite Durood-e-Ghausia?`,
        ctaLabel: "Baghdad 360° & Shajrah",
        href: "/auliya?saint=ghaus-e-azam&tab=ziyarat",
      };
    }

    if (minsToNext > 0 && minsToNext <= 25) {
      return {
        badge: `${schedule.nextPrayer.label} in ${minsToNext}m`,
        message: `Assalamu Alaikum — ${schedule.nextPrayer.label} Jamaat stands in ${minsToNext} mins. Ready to review Hanafi Wudu Fara'id & Step-by-Step Namaz Method?`,
        ctaLabel: "Wudu & Namaz Method",
        href: "/fiqh?tab=prayer-method",
      };
    }

    if (hijri.isFriday) {
      return {
        badge: "Jumu'ah Mubarak",
        message: `Jumu'ah Mubarak! You bookmarked Ayah ${lastQuranRef}. Resume reading Surah Al-Kahf with Kanzul Iman audio & commentary?`,
        ctaLabel: "Resume Surah Al-Kahf",
        href: "/quran?surah=18&page=293",
      };
    }

    if (cityHour >= 20 && rings.ilm < 100) {
      return {
        badge: "Nightly Sunnah • Ring Reminder",
        message: `Close your Ilm & Quran Ring tonight: recite Surah Al-Mulk before sleep or play a Sahib-e-Ilm Quiz round for +XP?`,
        ctaLabel: "Open Surah Al-Mulk",
        href: "/quran?surah=67&page=562",
      };
    }

    return {
      badge: `${schedule.currentWaqt === "makruh" ? "Makruh Window" : "Live Companion"}`,
      message: schedule.activeMakruh
        ? `${schedule.activeMakruh.label} is active right now. Avoid Salah/Sajda-e-Tilawat until it clears, and engage in Durood-e-Pak.`
        : `Assalamu Alaikum! ${schedule.nextPrayer.label} Jamaat is next. Recite Durood-e-Razawiyya or send Isal-e-Sawab in the Family Barsi Sanctuary.`,
      ctaLabel: schedule.activeMakruh ? "Recite Durood-e-Pak" : "Explore Tasbih Studio",
      href: "/tasbih",
    };
  }, [now, cityHour, hijri, schedule, rings, lastQuranRef, dynamicCalendarEvents]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.28 }}
      className="sanctuary-halo-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
      style={{ borderInlineStartWidth: "3px", borderInlineStartColor: "var(--accent-primary)" }}
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: "var(--accent-soft)",
            borderColor: "color-mix(in srgb, var(--accent-primary) 28%, transparent)",
            color: "var(--accent-primary)",
          }}
        >
          <Sparkles className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="flex flex-wrap items-center gap-2 mb-1">
            <span
              className="text-xs font-semibold uppercase tracking-wider"
              style={{ color: "var(--accent-primary)" }}
            >
              {t(lang, "rafiqGreeting")}
            </span>
            <span
              className="text-[11px] px-2 py-0.5 rounded-full font-semibold"
              style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
            >
              {prompt.badge}
            </span>
          </div>
          <p className="text-sm sm:text-[15px] leading-relaxed" style={{ color: "var(--text-primary)" }}>
            {prompt.message}
          </p>
        </div>
      </div>

      <Link
        href={prompt.href}
        className="btn-primary inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold shrink-0"
      >
        <Compass className="w-4 h-4" />
        <span>{prompt.ctaLabel}</span>
        <ArrowUpRight className="w-4 h-4" />
      </Link>
    </motion.div>
  );
}
