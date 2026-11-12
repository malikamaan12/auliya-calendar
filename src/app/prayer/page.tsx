"use client";

import React, { useState } from "react";
import {
  Clock,
  Compass,
  AlertTriangle,
  Bell,
  Volume2,
  CheckCircle2,
  Sun,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { CalcMethodId, formatTime, PrayerName } from "@/lib/prayer-engine";

export default function PrayerPage() {
  const { city, calcMethod, setCalcMethod, schedule, prayerSettings, updatePrayerSetting } = useApp();
  const [chimePlayed, setChimePlayed] = useState<string | null>(null);

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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-primary)" }}>
            <Clock className="w-3.5 h-3.5" />
            <span>Hanafi Astronomical Engine (adhan-js • Madhab.Hanafi)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Hanafi Azan &amp; Custom Jamaat Timings — {city.name}
          </h1>
        </div>

        <div className="flex items-center gap-2">
          <label className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
            Twilight Preset:
          </label>
          <select
            value={calcMethod}
            onChange={(e) => setCalcMethod(e.target.value as CalcMethodId)}
            className="px-3 py-2 rounded-xl border text-xs font-semibold bg-transparent outline-none"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
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

      {/* Dual-Time Display & Custom Jamaat Modification Table */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-3">
          {schedule.rows.map((row) => {
            const cfg = prayerSettings[row.name];
            return (
              <div key={row.name} className="bento-card p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <h2 className="text-lg font-bold">{row.label}</h2>
                    <div className="text-xs flex items-center gap-3 mt-1" style={{ color: "var(--text-muted)" }}>
                      <span>
                        Azan / Waqt: <strong className="tabular-nums text-[var(--text-primary)]">{formatTime(row.azanTime)}</strong>
                      </span>
                      <span>→</span>
                      <span>
                        Your Jamaat:{" "}
                        <strong className="tabular-nums" style={{ color: "var(--accent-primary)" }}>
                          {formatTime(row.jamaatTime)}
                        </strong>
                      </span>
                    </div>
                  </div>

                  {/* Two-Tier Alert Toggles */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updatePrayerSetting(row.name as PrayerName, { azanAudioEnabled: !cfg.azanAudioEnabled })}
                      className="px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
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
                      className="px-2.5 py-1.5 rounded-xl border text-[11px] font-semibold inline-flex items-center gap-1 cursor-pointer"
                      style={{
                        borderColor: cfg.salawatBeforeAzan ? "var(--accent-gold)" : "var(--border-hairline)",
                        backgroundColor: cfg.salawatBeforeAzan ? "var(--gold-soft)" : "transparent",
                      }}
                    >
                      <Bell className="w-3.5 h-3.5" />
                      <span>Salat-o-Salam</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => playGentleChime(row.label)}
                      className="px-2.5 py-1.5 rounded-xl border text-[11px] cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {chimePlayed === row.label ? "Playing..." : "Test Chime"}
                    </button>
                  </div>
                </div>

                {row.isConflict && (
                  <div className="p-2.5 rounded-xl bg-amber-500/15 border border-amber-500/40 text-xs text-amber-300 flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>
                      Seasonal Alert: Azan ({formatTime(row.azanTime)}) has shifted past your Fixed Jamaat ({cfg.fixedTime}). Please adjust your fixed clock.
                    </span>
                  </div>
                )}

                {/* Mode Switcher: Relative Offset vs Fixed Masjid Clock */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-3 border-t text-xs" style={{ borderColor: "var(--border-hairline)" }}>
                  <div>
                    <label className="block mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>
                      Jamaat Mode
                    </label>
                    <div className="flex rounded-xl border overflow-hidden" style={{ borderColor: "var(--border-hairline)" }}>
                      <button
                        type="button"
                        onClick={() => updatePrayerSetting(row.name as PrayerName, { mode: "offset" })}
                        className="flex-1 py-1.5 font-semibold cursor-pointer"
                        style={{
                          backgroundColor: cfg.mode === "offset" ? "var(--accent-primary)" : "transparent",
                          color: cfg.mode === "offset" ? "#FFF" : "var(--text-muted)",
                        }}
                      >
                        +Offset
                      </button>
                      <button
                        type="button"
                        onClick={() => updatePrayerSetting(row.name as PrayerName, { mode: "fixed" })}
                        className="flex-1 py-1.5 font-semibold cursor-pointer"
                        style={{
                          backgroundColor: cfg.mode === "fixed" ? "var(--accent-primary)" : "transparent",
                          color: cfg.mode === "fixed" ? "#FFF" : "var(--text-muted)",
                        }}
                      >
                        Fixed Clock
                      </button>
                    </div>
                  </div>

                  {cfg.mode === "offset" ? (
                    <div>
                      <label className="block mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>
                        Delay After Azan (0–60m)
                      </label>
                      <div className="flex items-center gap-1.5">
                        {[5, 10, 15, 25].map((m) => (
                          <button
                            key={m}
                            type="button"
                            onClick={() => updatePrayerSetting(row.name as PrayerName, { offsetMinutes: m })}
                            className="px-2 py-1.5 rounded-lg border font-semibold cursor-pointer"
                            style={{
                              borderColor: cfg.offsetMinutes === m ? "var(--accent-secondary)" : "var(--border-hairline)",
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
                          className="w-14 px-2 py-1.5 rounded-lg border bg-transparent text-center tabular-nums"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>
                    </div>
                  ) : (
                    <div>
                      <label className="block mb-1 font-semibold" style={{ color: "var(--text-muted)" }}>
                        Fixed Masjid Clock
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
                      Azan Calibration (± mins)
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

        {/* Right Sidebar: Qibla Compass + Hanafi Nafl & Makruh Windows */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bento-card p-5 text-center space-y-3">
            <div className="flex items-center justify-center gap-2 text-sm font-bold">
              <Compass className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
              <span>Qibla Bearing — {city.name}</span>
            </div>
            <div className="mx-auto w-36 h-36 rounded-full border-2 flex items-center justify-center relative" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
              <span className="absolute top-1.5 text-[10px] font-bold opacity-60">N</span>
              <span className="absolute bottom-1.5 text-[10px] font-bold opacity-60">S</span>
              <span className="absolute end-2 text-[10px] font-bold opacity-60">E</span>
              <span className="absolute start-2 text-[10px] font-bold opacity-60">W</span>
              <div
                className="w-1 h-20 rounded-full origin-center transition-transform duration-500"
                style={{
                  transform: `rotate(${schedule.qiblaBearing}deg)`,
                  background: "linear-gradient(to top, transparent 50%, var(--accent-gold) 50%)",
                }}
              />
              <div className="w-3 h-3 rounded-full bg-emerald-400 absolute" />
            </div>
            <div className="text-xl font-bold tabular-nums" style={{ color: "var(--accent-gold)" }}>
              {schedule.qiblaBearing}° from North
            </div>
          </div>

          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2 text-sm font-bold">
              <Sun className="w-4 h-4" style={{ color: "var(--accent-secondary)" }} />
              <span>Hanafi Nafl &amp; Fasting Windows</span>
            </div>
            <div className="space-y-2 text-xs">
              {[
                { label: "Sahar Cutoff (Subh Sadiq)", time: schedule.rows[0].azanTime },
                { label: "Sunrise (Tulu-e-Aftab)", time: schedule.sunrise },
                { label: "Ishraq Starts (+20m)", time: schedule.ishraq },
                { label: "Chasht / Duha", time: schedule.chasht },
                { label: "Dahwa-e-Kubra (Fasting Niyyah)", time: schedule.dahwaKubra },
                { label: "Iftar / Sunset", time: schedule.sunset },
                { label: "Tahajjud (Last 1/3 Night)", time: schedule.tahajjudStart },
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
              <span>3 Hanafi Makruh Tahrimi Windows</span>
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
              <span>All calculations run 100% offline locally.</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
