"use client";

import React, { useEffect, useState } from "react";
import {
  Clock,
  Compass,
  AlertTriangle,
  Bell,
  Volume2,
  CheckCircle2,
  Sun,
  MapPin,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { CalcMethodId, formatCountdown, formatTime, PrayerName } from "@/lib/prayer-engine";

export default function PrayerPage() {
  const { now, city, calcMethod, setCalcMethod, schedule, prayerSettings, updatePrayerSetting } = useApp();
  const [chimePlayed, setChimePlayed] = useState<string | null>(null);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    Promise.resolve().then(() =>
      setNotifPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission)
    );
  }, []);

  const enableNotifications = async () => {
    if (typeof Notification === "undefined") return;
    try {
      const res = await Notification.requestPermission();
      setNotifPerm(res);
      if (res === "granted") playGentleChime("Alerts enabled");
    } catch {
      // ignore
    }
  };

  const playGentleChime = (label: string) => {
    setChimePlayed(label);
    try {
      const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(528, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 1.2);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 1.2);
    } catch {
      // ignore audio context block
    }
    setTimeout(() => setChimePlayed(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Reference Image 2 Twilight Mosque Hero Card */}
      <div className="twilight-hero-card p-6 sm:p-8 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <svg
          aria-hidden="true"
          viewBox="0 0 500 200"
          preserveAspectRatio="xMidYMax slice"
          className="pointer-events-none absolute inset-0 w-full h-full opacity-35"
        >
          <defs>
            <radialGradient id="prayerMoon" cx="75%" cy="32%" r="30%">
              <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.9" />
              <stop offset="45%" stopColor="#DF98FA" stopOpacity="0.35" />
              <stop offset="100%" stopColor="#27155D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <circle cx="380" cy="64" r="58" fill="url(#prayerMoon)" />
          <path
            d="M0 200 L0 164 L42 164 L42 124 L47 104 L52 124 L52 164 L108 164 Q142 124 176 164 L218 164 L218 140 Q250 92 282 140 L282 164 L324 164 Q358 124 392 164 L448 164 L448 124 L453 104 L458 124 L458 164 L500 164 L500 200 Z"
            fill="#0A0E24"
          />
        </svg>

        <div className="relative z-10 space-y-1">
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-purple-200">
            <Clock className="w-3.5 h-3.5" />
            <span>Next Jamaat • {schedule.nextPrayer.label}</span>
          </div>
          <div className="text-3xl sm:text-5xl font-bold tracking-tight tabular-nums text-white">
            {formatTime(schedule.nextPrayer.jamaatTime)}
          </div>
          <div className="inline-flex items-center gap-1.5 text-xs text-purple-100/90 pt-1">
            <MapPin className="w-3.5 h-3.5 text-amber-300" />
            <span>
              {city.name}, {city.country} • Azan {formatTime(schedule.nextPrayer.azanTime)} • in{" "}
              {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
            </span>
          </div>
        </div>

        <div className="relative z-10 flex flex-col items-start sm:items-end gap-2">
          <label className="text-[11px] font-medium text-purple-200">
            Calculation Method (Hanafi Mithlayn Asr)
          </label>
          <select
            value={calcMethod}
            onChange={(e) => setCalcMethod(e.target.value as CalcMethodId)}
            className="ui-select px-3.5 py-2 rounded-xl border text-xs font-semibold text-white outline-none cursor-pointer"
            style={{
              borderColor: "rgba(255,255,255,0.22)",
              backgroundColor: "rgba(18, 25, 49, 0.75)",
            }}
          >
            <option value="Karachi" className="text-black">Univ. of Islamic Sciences, Karachi (18°/18°)</option>
            <option value="MuslimWorldLeague" className="text-black">Muslim World League</option>
            <option value="UmmAlQura" className="text-black">Umm al-Qura (Makkah)</option>
            <option value="MoonsightingCommittee" className="text-black">Moonsighting Committee (Shafaq Abyad)</option>
            <option value="Turkey" className="text-black">Diyanet (Turkey)</option>
            <option value="NorthAmerica" className="text-black">ISNA (North America)</option>
          </select>
        </div>
      </div>

      {/* Azan / Jamaat alert permission */}
      <div
        className="bento-card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
      >
        <div className="flex items-start gap-3">
          <Bell className="w-5 h-5 shrink-0 mt-0.5" style={{ color: "var(--accent-primary)" }} />
          <div className="text-sm">
            <div className="font-semibold">Azan &amp; Jamaat Reminders</div>
            <div className="text-xs" style={{ color: "var(--text-muted)" }}>
              {notifPerm === "granted"
                ? "Reminders are active. A gentle chime and notification play at Azan and before Jamaat."
                : notifPerm === "denied"
                ? "Browser notifications are blocked, but an audio chime will still play while the app is open."
                : notifPerm === "unsupported"
                ? "Audio chimes will play at prayer times while the app is open."
                : "Enable reminders to be alerted at Azan time and before your local Masjid Jamaat."}
            </div>
          </div>
        </div>
        {notifPerm === "default" && (
          <button
            type="button"
            onClick={enableNotifications}
            className="btn-primary px-4 py-2 rounded-full text-xs font-semibold cursor-pointer shrink-0"
          >
            Enable Reminders
          </button>
        )}
      </div>

      {/* Live Makruh Warning Banner if active */}
      {schedule.activeMakruh && (
        <div className="p-4 rounded-2xl border border-red-500/40 bg-red-500/10 flex items-start gap-3">
          <AlertTriangle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
            <div className="font-bold text-sm text-red-300">
              {schedule.activeMakruh.label} ({formatTime(schedule.activeMakruh.start)} – {formatTime(schedule.activeMakruh.end)})
            </div>
            <p className="text-xs text-red-200/80 mt-0.5">{schedule.activeMakruh.description}</p>
          </div>
        </div>
      )}

      {/* Dual-Time Display & Custom Jamaat Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-3">
          {schedule.rows.map((row) => {
            const cfg = prayerSettings[row.name];
            return (
              <div key={row.name} className="bento-card p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-base sm:text-lg font-bold">{row.label}</h2>
                    <div className="text-xs flex items-center gap-3 mt-1" style={{ color: "var(--text-muted)" }}>
                      <span>
                        Waqt Begins: <strong className="tabular-nums text-[var(--text-primary)]">{formatTime(row.azanTime)}</strong>
                      </span>
                      <span>•</span>
                      <span>
                        Masjid Jamaat:{" "}
                        <strong className="tabular-nums" style={{ color: "var(--accent-primary)" }}>
                          {formatTime(row.jamaatTime)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Two-Tier Alert Toggles */}
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => updatePrayerSetting(row.name as PrayerName, { azanAudioEnabled: !cfg.azanAudioEnabled })}
                      className="px-3 py-1.5 rounded-full border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                      style={{
                        borderColor: cfg.azanAudioEnabled ? "var(--accent-primary)" : "var(--border-hairline)",
                        backgroundColor: cfg.azanAudioEnabled ? "var(--accent-soft)" : "transparent",
                      }}
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Azan</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => updatePrayerSetting(row.name as PrayerName, { salawatBeforeAzan: !cfg.salawatBeforeAzan })}
                      className="px-3 py-1.5 rounded-full border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                      style={{
                        borderColor: cfg.salawatBeforeAzan ? "var(--accent-gold)" : "var(--border-hairline)",
                        backgroundColor: cfg.salawatBeforeAzan ? "var(--gold-soft)" : "transparent",
                      }}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Salawat</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => playGentleChime(row.label)}
                      className="px-3 py-1.5 rounded-full border text-[11px] cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {chimePlayed === row.label ? "Playing…" : "Preview"}
                    </button>
                  </div>
                </div>

                {row.isConflict && (
                  <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Seasonal Notice: Azan ({formatTime(row.azanTime)}) is later than your fixed Jamaat ({cfg.fixedTime}).
                    </span>
                  </div>
                )}

                {/* Mode Switcher: Relative Offset vs Fixed Masjid Clock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t text-xs" style={{ borderColor: "var(--border-hairline)" }}>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>
                      Jamaat Schedule
                    </label>
                    <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: "var(--border-hairline)" }}>
                      <button
                        type="button"
                        onClick={() => updatePrayerSetting(row.name as PrayerName, { mode: "offset" })}
                        className="flex-1 py-1.5 font-semibold cursor-pointer"
                        style={{
                          backgroundImage: cfg.mode === "offset" ? "var(--gradient-brand)" : undefined,
                          color: cfg.mode === "offset" ? "#FFF" : "var(--text-muted)",
                        }}
                      >
                        +Minutes
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePrayerSetting(row.name as PrayerName, { mode: "fixed" })}
                        className="flex-1 py-1.5 font-semibold cursor-pointer"
                        style={{
                          backgroundImage: cfg.mode === "fixed" ? "var(--gradient-brand)" : undefined,
                          color: cfg.mode === "fixed" ? "#FFF" : "var(--text-muted)",
                        }}
                      >
                        Fixed Time
                      </button>
                    </div>
                  </div>

                  {cfg.mode === "offset" ? (
                    <div>
                      <label className="block mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>
                        Minutes After Azan
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[10, 15, 20, 30].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => updatePrayerSetting(row.name as PrayerName, { offsetMinutes: m })}
                            className="px-2 py-1.5 rounded-lg border font-semibold cursor-pointer"
                            style={{
                              borderColor: cfg.offsetMinutes === m ? "var(--accent-primary)" : "var(--border-hairline)",
                              backgroundColor: cfg.offsetMinutes === m ? "var(--accent-soft)" : "transparent",
                            }}
                          >
                            +{m}m
                          </button>
                        ))}
                        <input
                          type="number"
                          min={0}
                          max={60}
                          value={cfg.offsetMinutes}
                          onChange={(e) =>
                            updatePrayerSetting(row.name as PrayerName, {
                              offsetMinutes: Math.max(0, Math.min(60, Number(e.target.value))),
                            })
                          }
                          className="w-12 px-1.5 py-1.5 rounded-lg border bg-transparent text-center tabular-nums"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>
                        MasjidJamaat Time
                      </label>
                      <input
                        type="time"
                        value={cfg.fixedTime}
                        onChange={(e) => updatePrayerSetting(row.name as PrayerName, { fixedTime: e.target.value })}
                        className="w-full px-3 py-1.5 rounded-xl border bg-transparent tabular-nums"
                        style={{ borderColor: "var(--border-hairline)" }}
                      />
                    </div>
                  )}

                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>
                      Fine-Tune Azan (±m)
                    </label>
                    <input
                      type="number"
                      min={-15}
                      max={15}
                      value={cfg.manualAdjustMinutes}
                      onChange={(e) =>
                        updatePrayerSetting(row.name as PrayerName, {
                          manualAdjustMinutes: Math.max(-15, Math.min(15, Number(e.target.value))),
                        })
                      }
                      className="w-full px-3 py-1.5 rounded-xl border bg-transparent tabular-nums"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Right Sidebar: Qibla Compass + Sunnah & Makruh Windows */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bento-card p-5 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm font-bold">
              <Compass className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
              <span>Qibla Direction — {city.name}</span>
            </div>
            <div
              className="mx-auto w-36 h-36 rounded-full border-2 flex items-center justify-center relative"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <span className="absolute top-1.5 text-[10px] font-bold opacity-60">N</span>
              <span className="absolute bottom-1.5 text-[10px] font-bold opacity-60">S</span>
              <span className="absolute end-2 text-[10px] font-bold opacity-60">E</span>
              <span className="absolute start-2 text-[10px] font-bold opacity-60">W</span>
              <div
                className="w-1.5 h-20 rounded-full origin-center transition-transform duration-500"
                style={{
                  transform: `rotate(${schedule.qiblaBearing}deg)`,
                  background: "linear-gradient(to top, transparent 50%, var(--accent-primary) 50%)",
                }}
              />
              <div
                className="w-3.5 h-3.5 rounded-full absolute shadow-md"
                style={{ backgroundImage: "var(--gradient-brand)" }}
              />
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: "var(--accent-primary)" }}>
              {schedule.qiblaBearing}° from North
            </div>
          </div>

          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Sun className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
              <span>Nafl &amp; Fasting Timings</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Sehri Ends (Subh Sadiq)", time: schedule.rows[0].azanTime },
                { label: "Sunrise", time: schedule.sunrise },
                { label: "Ishraq (+20m)", time: schedule.ishraq },
                { label: "Chasht / Duha", time: schedule.chasht },
                { label: "Dahwa-e-Kubra", time: schedule.dahwaKubra },
                { label: "Iftar / Sunset", time: schedule.sunset },
                { label: "Tahajjud (Last Third)", time: schedule.tahajjudStart },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between p-2.5 rounded-xl border"
                  style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                >
                  <span style={{ color: "var(--text-muted)" }}>{item.label}</span>
                  <strong className="tabular-nums">{formatTime(item.time)}</strong>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold text-red-400">
              <AlertTriangle className="w-4 h-4" />
              <span>Makruh Times (No Salah)</span>
            </div>
            <div className="space-y-2 text-xs">
              {schedule.makruhWindows.map((w) => (
                <div key={w.id} className="p-3 rounded-xl border border-red-500/25 bg-red-500/5">
                  <div className="font-semibold">{w.label}</div>
                  <div className="tabular-nums text-[11px] mt-0.5 text-red-300">
                    {formatTime(w.start)} – {formatTime(w.end)}
                  </div>
                </div>
              ))}
            </div>
            <div className="text-[11px] flex items-center gap-1.5" style={{ color: "var(--accent-primary)" }}>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Calculated for {city.name} according to Hanafi Fiqh.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
