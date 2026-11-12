"use client";

import { useEffect, useRef } from "react";
import { useApp } from "@/lib/store";
import { assetUrl } from "@/lib/assets";
import { formatTime } from "@/lib/prayer-engine";

/** Soft chime generated with WebAudio (no external audio file needed). */
function playChime() {
  try {
    const Ctx =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!Ctx) return;
    const ctx = new Ctx();
    const notes = [523.25, 659.25, 783.99];
    notes.forEach((freq, i) => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.value = freq;
      const t0 = ctx.currentTime + i * 0.35;
      gain.gain.setValueAtTime(0.0001, t0);
      gain.gain.exponentialRampToValueAtTime(0.25, t0 + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.0001, t0 + 1.2);
      osc.connect(gain).connect(ctx.destination);
      osc.start(t0);
      osc.stop(t0 + 1.3);
    });
    setTimeout(() => ctx.close().catch(() => undefined), 2500);
  } catch {
    // audio not available
  }
}

function notify(title: string, body: string) {
  playChime();
  try {
    if (typeof Notification !== "undefined" && Notification.permission === "granted") {
      new Notification(title, { body, icon: assetUrl("/icon.svg"), tag: title });
    }
  } catch {
    // some mobile browsers only allow notifications via a service worker
  }
}

/**
 * Fires Azan and pre-Jamaat reminders while the app is open in a tab.
 * Respects each prayer's "Azan audio" and "pre-Jamaat alert" settings.
 */
export function PrayerAlerts() {
  const { hydrated, now, schedule, city } = useApp();
  const fired = useRef<Set<string>>(new Set());

  useEffect(() => {
    if (!hydrated) return;
    const nowMs = now.getTime();
    for (const row of schedule.rows) {
      const events: { key: string; at: number; title: string; body: string; enabled: boolean }[] = [
        {
          key: `azan-${row.name}-${row.azanTime.getTime()}`,
          at: row.azanTime.getTime(),
          title: `${row.label.split(" (")[0]} Azan`,
          body: `It is time for ${row.label.split(" (")[0]} in ${city.name} (${formatTime(row.azanTime)}).`,
          enabled: row.config.azanAudioEnabled,
        },
        {
          key: `jamaat-${row.name}-${row.jamaatTime.getTime()}`,
          at: row.jamaatTime.getTime() - row.config.preJamaatAlertMinutes * 60000,
          title: `${row.label.split(" (")[0]} Jamaat in ${row.config.preJamaatAlertMinutes} min`,
          body: `Jamaat at ${formatTime(row.jamaatTime)}. Time to prepare for Wudu.`,
          enabled: row.config.preJamaatAlertMinutes > 0,
        },
      ];
      for (const ev of events) {
        // fire within a 60s window after the scheduled moment, once
        if (ev.enabled && nowMs >= ev.at && nowMs - ev.at < 60000 && !fired.current.has(ev.key)) {
          fired.current.add(ev.key);
          notify(ev.title, ev.body);
        }
      }
    }
  }, [hydrated, now, schedule, city.name]);

  return null;
}
