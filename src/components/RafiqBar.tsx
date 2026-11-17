"use client";

import React, { useMemo } from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";
import { useApp } from "@/lib/store";
import { getEventsForHijri } from "@/lib/hijri";
import { formatLocalizedHijriMonth, localizePrayerName, t, tp } from "@/lib/i18n";

export function RafiqBar() {
  const { now, cityHour, hijri, schedule, rings, lastQuranRef, lang, dynamicCalendarEvents } = useApp();

  const prompt = useMemo(() => {
    const minsToNext = Math.round(
      (schedule.nextPrayer.jamaatTime.getTime() - now.getTime()) / 60000
    );
    const todayEvents = getEventsForHijri(hijri.month, hijri.day, dynamicCalendarEvents);
    const nextPrayerLocal = localizePrayerName(lang, schedule.nextPrayer.label);
    const hijriLocal = `${hijri.day} ${formatLocalizedHijriMonth(lang, hijri.month, hijri.monthName)} ${hijri.year}`;

    if (todayEvents.length > 0) {
      const ev = todayEvents[0];
      const isBarsi = ev.title.startsWith("Barsi:");
      return {
        title: ev.title,
        subtitle: `${hijriLocal} • ${ev.subtitle}`,
        ctaLabel: isBarsi ? tp(lang, "Send Fatiha Gift") : tp(lang, "360° Ziyarat"),
        href: isBarsi
          ? "/barsi"
          : ev.auliyaId
          ? `/auliya?saint=${ev.auliyaId}&tab=ziyarat`
          : "/auliya",
      };
    }

    if (hijri.isGyarhviSharif) {
      return {
        title: `${hijriLocal} — Gyarhvi Sharif`,
        subtitle: t(lang, "auliyaSubtitle"),
        ctaLabel: tp(lang, "360° Ziyarat"),
        href: "/auliya?saint=ghaus-e-azam&tab=ziyarat",
      };
    }

    if (minsToNext > 0 && minsToNext <= 30) {
      return {
        title: `${nextPrayerLocal} • ${minsToNext}m`,
        subtitle: t(lang, "fiqhSubtitle"),
        ctaLabel: t(lang, "fiqhTabNamaz"),
        href: "/fiqh?tab=prayer-method",
      };
    }

    if (hijri.isFriday) {
      return {
        title: `${t(lang, "prayerJumuah")} — Surah Al-Kahf`,
        subtitle: `${t(lang, "lastRead")}: ${lastQuranRef}`,
        ctaLabel: t(lang, "continueJourney"),
        href: "/quran?surah=18&page=293",
      };
    }

    if (cityHour >= 20 && rings.ilm < 100) {
      return {
        title: `Surah Al-Mulk`,
        subtitle: t(lang, "quranSubtitle"),
        ctaLabel: t(lang, "continueJourney"),
        href: "/quran?surah=67&page=562",
      };
    }

    if (schedule.activeMakruh) {
      return {
        title: t(lang, "makruhWarning"),
        subtitle: schedule.activeMakruh.label,
        ctaLabel: t(lang, "navTasbih"),
        href: "/tasbih",
      };
    }

    return null;
  }, [now, cityHour, hijri, schedule, rings.ilm, lastQuranRef, dynamicCalendarEvents, lang]);

  // Only show contextual strip when there is an authentic timely sacred event, Jumu'ah, pre-Salah window, or Makruh warning!
  if (!prompt) return null;

  return (
    <Link
      href={prompt.href}
      className="sanctuary-halo-card px-4 py-3.5 flex items-center justify-between gap-3 group transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div
          className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
          style={{
            backgroundColor: "var(--accent-soft)",
            color: "var(--accent-primary)",
          }}
        >
          <Sparkles className="w-4 h-4" />
        </div>
        <div className="min-w-0">
          <div className="text-xs sm:text-sm font-bold truncate">{prompt.title}</div>
          <div className="text-[11px] truncate mt-0.5" style={{ color: "var(--text-muted)" }}>
            {prompt.subtitle}
          </div>
        </div>
      </div>

      <span
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold shrink-0"
        style={{
          backgroundColor: "var(--accent-soft)",
          color: "var(--accent-primary)",
        }}
      >
        <span>{prompt.ctaLabel}</span>
        <ArrowRight className="w-3.5 h-3.5 rtl-mirror transition-transform group-hover:translate-x-0.5" />
      </span>
    </Link>
  );
}
