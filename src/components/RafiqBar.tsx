"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowUpRight, Compass } from "lucide-react";
import { useApp } from "@/lib/store";
import { getEventsForHijri } from "@/lib/hijri";
import { t } from "@/lib/i18n";

export function RafiqBar() {
  const { now, cityHour, hijri, schedule, rings, lastQuranRef, lang } = useApp();

  const prompt = useMemo(() => {
    const minsToNext = Math.round(
      (schedule.nextPrayer.jamaatTime.getTime() - now.getTime()) / 60000
    );
    const todayEvents = getEventsForHijri(hijri.month, hijri.day);

    if (todayEvents.length > 0 && todayEvents[0].auliyaId) {
      return {
        badge: "Active Urs / Sacred Date",
        message: `Today is ${hijri.formatted} — ${todayEvents[0].title}. Step inside the shrine courtyard in 360° Ziyarat or read their Shajrah?`,
        ctaLabel: "Open 360° Ziyarat",
        href: `/auliya?saint=${todayEvents[0].auliyaId}&tab=ziyarat`,
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
        message: `Assalamu Alaikum — ${schedule.nextPrayer.label} Jamaat stands in ${minsToNext} mins. Ready to review Hanafi Wudu Fara'id & queue Tasbih-e-Fatima?`,
        ctaLabel: "Wudu & Prayer Prep",
        href: "/fiqh",
      };
    }

    if (hijri.isFriday) {
      return {
        badge: "Jumu'ah Mubarak",
        message: `Jumu'ah Mubarak! You bookmarked Ayah ${lastQuranRef} (Surah Al-Kahf). Resume reading with Kanzul Iman audio & Khazain-ul-Irfan?`,
        ctaLabel: "Resume Surah Al-Kahf",
        href: "/quran",
      };
    }

    if (cityHour >= 20 && rings.ilm < 100) {
      return {
        badge: "Nightly Sunnah • Ring Reminder",
        message: `Close your Ilm & Quran Ring tonight: listen to Surah Al-Mulk in Obsidian Dark sleep mode or complete a 60s Ilm Quiz?`,
        ctaLabel: "Open Surah Al-Mulk",
        href: "/quran?surah=67",
      };
    }

    return {
      badge: `${schedule.currentWaqt === "makruh" ? "Makruh Window" : "Live Companion"}`,
      message:
        schedule.activeMakruh
          ? `${schedule.activeMakruh.label} is active right now. Avoid Salah/Sajda-e-Tilawat until it clears, and engage in Durood-e-Pak.`
          : `Assalamu Alaikum! ${schedule.nextPrayer.label} Jamaat is next. Tap to recite Durood-e-Razawiyya or explore the Auliya Shajrah lineage.`,
      ctaLabel: schedule.activeMakruh ? "Recite Durood-e-Pak" : "Explore Tasbih Studio",
      href: "/tasbih",
    };
  }, [now, cityHour, hijri, schedule, rings, lastQuranRef]);

  return (
    <div
      className="bento-card p-4 sm:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 relative overflow-hidden"
      style={{ borderInlineStartWidth: "3px", borderInlineStartColor: "var(--accent-primary)" }}
    >
      <div className="flex items-start gap-3.5 min-w-0">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border"
          style={{
            backgroundColor: "var(--accent-soft)",
            borderColor: "color-mix(in srgb, var(--accent-primary) 25%, transparent)",
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
              className="text-[11px] px-2 py-0.5 rounded-full font-medium"
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
    </div>
  );
}
