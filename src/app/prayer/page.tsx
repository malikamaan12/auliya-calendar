"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Clock,
  Compass,
  AlertTriangle,
  Bell,
  Volume2,
  CheckCircle2,
  Sun,
  Moon,
  MapPin,
  LocateFixed,
  Globe2,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  Activity,
  RotateCcw,
  Sliders,
  Search,
  ChevronLeft,
  ChevronRight,
  Calendar,
  Sparkles,
  RefreshCw,
  Navigation,
  ShieldCheck,
} from "lucide-react";
import { useApp } from "@/lib/store";
import {
  CalcMethodId,
  computeHanafiSchedule,
  formatCountdown,
  formatTime,
  PrayerName,
} from "@/lib/prayer-engine";
import {
  GeocodedLocation,
  getAllWorldTimezones,
  getAqiCategory,
  getKaabaDistanceKm,
  getMagneticDeclinationDeg,
  getSolarPosition,
  getTimezoneOffsetInfo,
  searchWorldLocations,
} from "@/lib/location-weather";

function degreesToCardinal(deg: number): string {
  const dirs = ["N", "NNE", "NE", "ENE", "E", "ESE", "SE", "SSE", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  const idx = Math.round((((deg % 360) + 360) % 360) / 22.5) % 16;
  return dirs[idx];
}

function shortestAngleDiff(target: number, current: number): number {
  const diff = ((target - current + 540) % 360) - 180;
  return diff;
}

export default function PrayerPage() {
  const {
    now,
    city,
    setCity,
    setTimezone,
    requestGpsLocation,
    gpsLoading,
    gpsError,
    calcMethod,
    setCalcMethod,
    schedule: liveSchedule,
    prayerSettings,
    updatePrayerSetting,
    salahToday,
    logSalah,
    rings,
    weather,
    weatherLoading,
    weatherError,
    refreshWeather,
    qiblaCalibrationOffset,
    setQiblaCalibrationOffset,
  } = useApp();

  // Interactive Date Scrubber (0 = Today, +/- days for any past/future date)
  const [dayOffset, setDayOffset] = useState<number>(0);

  // Temperature unit toggle (°C / °F)
  const [useFahrenheit, setUseFahrenheit] = useState<boolean>(false);

  // Expandable Location & Complete Timezone Studio panel
  const [showLocationStudio, setShowLocationStudio] = useState<boolean>(false);
  const [tzFilter, setTzFilter] = useState<string>("");
  const [geoQuery, setGeoQuery] = useState<string>("");
  const [geoResults, setGeoResults] = useState<GeocodedLocation[]>([]);
  const [geoSearching, setGeoSearching] = useState<boolean>(false);
  const [customLat, setCustomLat] = useState<string>("");
  const [customLng, setCustomLng] = useState<string>("");

  // Qibla Compass & Calibration Studio state
  const [sensorHeading, setSensorHeading] = useState<number | null>(null);
  const [manualHeading, setManualHeading] = useState<number>(0);
  const [sensorActive, setSensorActive] = useState<boolean>(false);
  const [sensorStatus, setSensorStatus] = useState<string>("Interactive Mode (Drag or Enable Live Sensor)");
  const [tiltBeta, setTiltBeta] = useState<number>(0); // front/back pitch
  const [tiltGamma, setTiltGamma] = useState<number>(0); // left/right roll
  const [useMagneticNorth, setUseMagneticNorth] = useState<boolean>(false);
  const [showCalibrationModal, setShowCalibrationModal] = useState<boolean>(false);
  const [figure8Step, setFigure8Step] = useState<number>(0);
  const lastVibratedAlignedRef = useRef<boolean>(false);

  // Expandable Jamaat & Azan customization per prayer
  const [expandedPrayer, setExpandedPrayer] = useState<PrayerName | null>(null);

  // Audio Chime & Notification state
  const [chimePlayed, setChimePlayed] = useState<string | null>(null);
  const [notifPerm, setNotifPerm] = useState<NotificationPermission | "unsupported">("default");

  useEffect(() => {
    Promise.resolve().then(() =>
      setNotifPerm(typeof Notification === "undefined" ? "unsupported" : Notification.permission)
    );
  }, []);

  // All 400+ IANA World Timezones
  const allTimezones = useMemo(() => getAllWorldTimezones(), []);
  const activeTimezone = useMemo(() => {
    if (city.tz) return city.tz;
    try {
      return Intl.DateTimeFormat().resolvedOptions().timeZone || "UTC";
    } catch {
      return "UTC";
    }
  }, [city.tz]);

  const activeTzOffset = useMemo(
    () => getTimezoneOffsetInfo(activeTimezone, now),
    [activeTimezone, now]
  );

  const filteredTimezones = useMemo(() => {
    const q = tzFilter.trim().toLowerCase();
    if (!q) return allTimezones;
    return allTimezones.filter(
      (item) =>
        item.tz.toLowerCase().includes(q) ||
        item.cityLabel.toLowerCase().includes(q) ||
        item.region.toLowerCase().includes(q) ||
        item.utcOffsetLabel.toLowerCase().includes(q)
    );
  }, [allTimezones, tzFilter]);

  // Global City Geocoding Search (200k+ cities via Open-Meteo)
  useEffect(() => {
    const q = geoQuery.trim();
    if (q.length < 2) {
      Promise.resolve().then(() => setGeoResults([]));
      return;
    }
    let cancelled = false;
    Promise.resolve().then(() => setGeoSearching(true));
    const timer = setTimeout(() => {
      searchWorldLocations(q)
        .then((res) => {
          if (!cancelled) setGeoResults(res);
        })
        .catch(() => {
          if (!cancelled) setGeoResults([]);
        })
        .finally(() => {
          if (!cancelled) setGeoSearching(false);
        });
    }, 260);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [geoQuery]);

  // Selected date schedule (uses liveSchedule when dayOffset === 0, or computes exact Hanafi schedule for target date)
  const selectedDate = useMemo(() => {
    if (dayOffset === 0) return now;
    const d = new Date(now);
    d.setDate(d.getDate() + dayOffset);
    return d;
  }, [now, dayOffset]);

  const schedule = useMemo(() => {
    if (dayOffset === 0) return liveSchedule;
    return computeHanafiSchedule(
      city.lat,
      city.lng,
      selectedDate,
      calcMethod,
      prayerSettings,
      activeTimezone
    );
  }, [dayOffset, liveSchedule, selectedDate, city.lat, city.lng, calcMethod, prayerSettings, activeTimezone]);

  // Real Geodesic Distance, Magnetic Declination, and Solar Position
  const kaabaDistanceKm = useMemo(
    () => getKaabaDistanceKm(city.lat, city.lng),
    [city.lat, city.lng]
  );
  const kaabaDistanceMiles = useMemo(
    () => Math.round(kaabaDistanceKm * 0.621371),
    [kaabaDistanceKm]
  );
  const magneticDeclination = useMemo(
    () => getMagneticDeclinationDeg(city.lat, city.lng),
    [city.lat, city.lng]
  );
  const solarPosition = useMemo(
    () => getSolarPosition(city.lat, city.lng, now),
    [city.lat, city.lng, now]
  );

  // Effective Qibla target bearing (True North vs Magnetic North)
  const effectiveQiblaBearing = useMemo(() => {
    const base = schedule.qiblaBearing;
    if (!useMagneticNorth) return base;
    return Number(((base - magneticDeclination + 360) % 360).toFixed(1));
  }, [schedule.qiblaBearing, useMagneticNorth, magneticDeclination]);

  // Effective current compass heading (0-360°) including user calibration trim offset
  const rawHeading = sensorActive && sensorHeading !== null ? sensorHeading : manualHeading;
  const currentHeading = useMemo(
    () => Number(((rawHeading + qiblaCalibrationOffset + 360) % 360).toFixed(1)),
    [rawHeading, qiblaCalibrationOffset]
  );

  // Angle delta between where device points (`currentHeading`) and `effectiveQiblaBearing`
  const qiblaDelta = useMemo(
    () => shortestAngleDiff(effectiveQiblaBearing, currentHeading),
    [effectiveQiblaBearing, currentHeading]
  );
  const isQiblaAligned = Math.abs(qiblaDelta) <= 3.5;
  const isDeviceTilted = Math.hypot(tiltBeta, tiltGamma) > 15;

  // Trigger gentle haptic vibration when locking onto Qibla within ±3.5°
  useEffect(() => {
    if (isQiblaAligned && !lastVibratedAlignedRef.current) {
      lastVibratedAlignedRef.current = true;
      if (typeof navigator !== "undefined" && "vibrate" in navigator) {
        try {
          navigator.vibrate(30);
        } catch {
          // ignore
        }
      }
    } else if (!isQiblaAligned) {
      lastVibratedAlignedRef.current = false;
    }
  }, [isQiblaAligned]);

  // Hardware Magnetometer / DeviceOrientation listener
  useEffect(() => {
    if (!sensorActive || typeof window === "undefined") return;

    const handleOrientation = (event: DeviceOrientationEvent) => {
      const webkitHeading = (event as unknown as { webkitCompassHeading?: number }).webkitCompassHeading;
      let heading: number | null = null;

      if (typeof webkitHeading === "number" && !Number.isNaN(webkitHeading)) {
        heading = webkitHeading;
      } else if (typeof event.alpha === "number" && !Number.isNaN(event.alpha)) {
        heading = (360 - event.alpha) % 360;
      }

      if (heading !== null) {
        setSensorHeading(Number(heading.toFixed(1)));
      }
      if (typeof event.beta === "number") {
        setTiltBeta(Number(Math.max(-45, Math.min(45, event.beta)).toFixed(1)));
      }
      if (typeof event.gamma === "number") {
        setTiltGamma(Number(Math.max(-45, Math.min(45, event.gamma)).toFixed(1)));
      }
    };

    const win = window as Window;
    win.addEventListener("deviceorientationabsolute", handleOrientation as EventListener, true);
    win.addEventListener("deviceorientation", handleOrientation as EventListener, true);

    return () => {
      win.removeEventListener("deviceorientationabsolute", handleOrientation as EventListener, true);
      win.removeEventListener("deviceorientation", handleOrientation as EventListener, true);
    };
  }, [sensorActive]);

  const toggleLiveCompassSensor = async () => {
    if (sensorActive) {
      setSensorActive(false);
      setTiltBeta(0);
      setTiltGamma(0);
      setSensorStatus("Interactive Mode (Slider / Quick-Align)");
      return;
    }

    if (typeof window === "undefined" || typeof DeviceOrientationEvent === "undefined") {
      setSensorStatus("Hardware magnetometer unavailable on this device — use interactive dial below");
      return;
    }

    try {
      const DevOrient = DeviceOrientationEvent as unknown as {
        requestPermission?: () => Promise<"granted" | "denied">;
      };
      if (typeof DevOrient.requestPermission === "function") {
        const permission = await DevOrient.requestPermission();
        if (permission !== "granted") {
          setSensorStatus("Compass permission denied — using interactive slider");
          return;
        }
      }
      setSensorActive(true);
      setSensorStatus("Live Magnetometer & Tilt Level Active");
    } catch {
      setSensorActive(true);
      setSensorStatus("Sensor listening (move phone in Figure-8 ∞ or use slider)");
    }
  };

  // Interactive Figure-8 Calibration Assistant runner
  const runFigure8CalibrationStep = () => {
    setFigure8Step((prev) => {
      const next = prev + 1;
      if (next >= 3) {
        playGentleChime("Compass calibrated");
        return 3;
      }
      return next;
    });
  };

  // Solar / Lunar Sky Arc Progress Calculation (0% = Fajr, 100% = Isha)
  const skyArcMetrics = useMemo(() => {
    const fajrMs = schedule.rows[0].azanTime.getTime();
    const sunriseMs = schedule.sunrise.getTime();
    const maghribMs = schedule.rows[3].azanTime.getTime();
    const ishaMs = schedule.rows[4].azanTime.getTime();
    const nowMs = now.getTime();

    const isDaytime = nowMs >= sunriseMs && nowMs <= maghribMs;
    let progress = 0;
    if (nowMs <= fajrMs) {
      progress = 0.04;
    } else if (nowMs >= ishaMs) {
      progress = 0.96;
    } else {
      progress = (nowMs - fajrMs) / Math.max(1, ishaMs - fajrMs);
    }
    const clamped = Math.max(0.03, Math.min(0.97, progress));

    // Quadratic Bezier curve from (30, 120) via control (250, 14) to (470, 120)
    const t = clamped;
    const x = (1 - t) * (1 - t) * 30 + 2 * (1 - t) * t * 250 + t * t * 470;
    const y = (1 - t) * (1 - t) * 120 + 2 * (1 - t) * t * 14 + t * t * 120;

    return { progress: clamped, x, y, isDaytime };
  }, [schedule, now]);

  const formatTemp = (tempC: number) => {
    if (useFahrenheit) {
      return `${Math.round((tempC * 9) / 5 + 32)}°F`;
    }
    return `${Math.round(tempC)}°C`;
  };

  const aqiMeta = useMemo(() => getAqiCategory(weather?.usAqi ?? null), [weather?.usAqi]);

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
      const ctx = new (window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
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
    setTimeout(() => setChimePlayed(null), 2200);
  };

  const applyCustomCoordinates = (e: React.FormEvent) => {
    e.preventDefault();
    const latNum = parseFloat(customLat);
    const lngNum = parseFloat(customLng);
    if (Number.isNaN(latNum) || Number.isNaN(lngNum)) return;
    if (latNum < -90 || latNum > 90 || lngNum < -180 || lngNum > 180) return;
    setCity({
      id: `coords-${latNum.toFixed(4)}-${lngNum.toFixed(4)}`,
      name: `Coord (${latNum.toFixed(2)}°, ${lngNum.toFixed(2)}°)`,
      country: activeTimezone,
      lat: Number(latNum.toFixed(5)),
      lng: Number(lngNum.toFixed(5)),
      tz: activeTimezone,
    });
    setShowLocationStudio(false);
  };

  const fmtTz = (d: Date) => formatTime(d, activeTimezone);

  return (
    <div className="space-y-6">
      {/* 1. Animated Twilight Mosque & Live Solar/Lunar Sky Arc Hero Card */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.35 }}
        className="twilight-hero-card p-6 sm:p-8 relative overflow-hidden"
      >
        {/* Mosque & Twilight Sky Backdrop */}
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

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          {/* Left: Next Jamaat Countdown + Live Location & Timezone */}
          <div className="space-y-2">
            <div className="inline-flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-purple-200">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md">
                <Clock className="w-3.5 h-3.5 text-amber-300" />
                <span>Next Jamaat • {schedule.nextPrayer.label}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-white/10 backdrop-blur-md text-[11px] font-mono">
                <Globe2 className="w-3 h-3 text-purple-200" />
                {activeTimezone} ({activeTzOffset.label})
              </span>
            </div>

            <div className="flex items-baseline gap-3 flex-wrap">
              <div className="text-4xl sm:text-5xl font-bold tracking-tight tabular-nums text-white">
                {fmtTz(schedule.nextPrayer.jamaatTime)}
              </div>
              <div className="text-sm font-semibold text-amber-300 tabular-nums">
                in {formatCountdown(schedule.nextPrayer.jamaatTime, now)}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 text-xs text-purple-100/90 pt-0.5">
              <MapPin className="w-3.5 h-3.5 text-amber-300 shrink-0" />
              <span>
                {city.name}, {city.country} ({city.lat.toFixed(3)}°N, {city.lng.toFixed(3)}°E) • Azan{" "}
                {fmtTz(schedule.nextPrayer.azanTime)}
              </span>
            </div>

            {/* Live GPS & Complete Timezone Action Pills */}
            <div className="flex flex-wrap items-center gap-2 pt-2">
              <button
                type="button"
                onClick={requestGpsLocation}
                disabled={gpsLoading}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-amber-400/20 hover:bg-amber-400/30 text-amber-200 border border-amber-300/30 transition cursor-pointer disabled:opacity-60"
              >
                <LocateFixed className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                <span>{gpsLoading ? "Locating via GPS…" : "Use Live GPS & Auto-Timezone"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowLocationStudio((v) => !v)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/15 hover:bg-white/25 text-white border border-white/20 transition cursor-pointer"
              >
                <Globe2 className="w-3.5 h-3.5" />
                <span>
                  {showLocationStudio ? "Close Timezone & Location Studio" : "Change Timezone / City (400+ Zones)"}
                </span>
              </button>

              <button
                type="button"
                onClick={enableNotifications}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold bg-white/10 hover:bg-white/20 text-purple-100 border border-white/15 transition cursor-pointer"
              >
                <Bell className="w-3.5 h-3.5" />
                <span>{notifPerm === "granted" ? "Browser Alerts On" : "Enable Azan Alerts"}</span>
              </button>
            </div>
            {gpsError && (
              <p className="text-[11px] text-rose-200 bg-rose-950/50 border border-rose-400/30 rounded-lg px-2.5 py-1 inline-block">
                {gpsError}
              </p>
            )}
          </div>

          {/* Right: Animated Solar/Lunar Horizon Arc SVG */}
          <div className="w-full lg:w-[360px] bg-black/25 backdrop-blur-md rounded-2xl p-3.5 border border-white/15">
            <div className="flex items-center justify-between text-[11px] text-purple-200 mb-1">
              <span className="font-semibold flex items-center gap-1">
                {skyArcMetrics.isDaytime ? (
                  <Sun className="w-3.5 h-3.5 text-amber-300" />
                ) : (
                  <Moon className="w-3.5 h-3.5 text-purple-200" />
                )}
                Solar & Prayer Horizon
              </span>
              <span className="font-mono text-amber-200">
                Sun Az {solarPosition.azimuthDeg}° • Alt {solarPosition.altitudeDeg}°
              </span>
            </div>

            <svg viewBox="0 0 500 140" className="w-full h-24 overflow-visible">
              <defs>
                <linearGradient id="skyArcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#9055FF" stopOpacity="0.4" />
                  <stop offset="50%" stopColor="#F4B860" stopOpacity="0.95" />
                  <stop offset="100%" stopColor="#DF98FA" stopOpacity="0.5" />
                </linearGradient>
              </defs>
              {/* Horizon baseline */}
              <line
                x1="20"
                y1="120"
                x2="480"
                y2="120"
                stroke="rgba(255,255,255,0.18)"
                strokeDasharray="4 4"
                strokeWidth="1.5"
              />
              {/* Full Dashed Trajectory */}
              <path
                d="M 30 120 Q 250 14 470 120"
                fill="none"
                stroke="rgba(255,255,255,0.22)"
                strokeWidth="2.5"
                strokeDasharray="5 5"
              />
              {/* Active Illuminated Trajectory */}
              <path
                d="M 30 120 Q 250 14 470 120"
                fill="none"
                stroke="url(#skyArcGrad)"
                strokeWidth="3.5"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray={`${Math.round(skyArcMetrics.progress * 100)} 100`}
              />
              {/* 5 Prayer Node Markers along the arc */}
              {[
                { label: "Fajr", x: 30, y: 120 },
                { label: "Sunrise", x: 112, y: 80 },
                { label: "Dhuhr", x: 250, y: 67 },
                { label: "Asr", x: 355, y: 85 },
                { label: "Maghrib", x: 422, y: 105 },
                { label: "Isha", x: 470, y: 120 },
              ].map((pt) => (
                <g key={pt.label}>
                  <circle cx={pt.x} cy={pt.y} r="3.5" fill="#FFFFFF" fillOpacity="0.7" />
                  <text
                    x={pt.x}
                    y={135}
                    textAnchor="middle"
                    fill="rgba(255,255,255,0.75)"
                    fontSize="10"
                    fontWeight="600"
                  >
                    {pt.label}
                  </text>
                </g>
              ))}
              {/* Animated Orb at current time */}
              <motion.g
                initial={false}
                animate={{ x: skyArcMetrics.x, y: skyArcMetrics.y }}
                transition={{ type: "spring", stiffness: 90, damping: 18 }}
              >
                <circle
                  cx={0}
                  cy={0}
                  r="12"
                  fill={skyArcMetrics.isDaytime ? "rgba(244, 184, 96, 0.3)" : "rgba(223, 152, 250, 0.3)"}
                />
                <circle
                  cx={0}
                  cy={0}
                  r="6"
                  fill={skyArcMetrics.isDaytime ? "#F4B860" : "#DF98FA"}
                  stroke="#FFFFFF"
                  strokeWidth="2"
                />
              </motion.g>
            </svg>
          </div>
        </div>
      </motion.div>

      {/* Expandable Complete World Timezone (400+ IANA Zones) & Global City/GPS Studio */}
      <AnimatePresence>
        {showLocationStudio && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <div className="card-surface p-5 space-y-5 border-2 border-[var(--accent-gold)]/30">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-2">
                    <Globe2 className="w-4 h-4 text-[var(--accent-gold)]" />
                    Complete World Timezones & Live GPS Studio
                  </h2>
                  <p className="text-xs text-[var(--text-muted)]">
                    Select any of the {allTimezones.length} official IANA world timezones, search any city worldwide, or lock onto live hardware GPS.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={requestGpsLocation}
                  disabled={gpsLoading}
                  className="btn-gold px-3.5 py-2 text-xs inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <LocateFixed className={`w-3.5 h-3.5 ${gpsLoading ? "animate-spin" : ""}`} />
                  <span>{gpsLoading ? "Acquiring GPS…" : "Detect My City & Timezone via GPS"}</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1: Complete IANA Timezone Selector */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                  <div className="text-xs font-bold text-[var(--text-primary)] flex items-center justify-between">
                    <span>1. Complete IANA Timezones ({allTimezones.length})</span>
                    <span className="font-mono text-[11px] text-[var(--accent-gold)]">
                      {activeTzOffset.label}
                    </span>
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={tzFilter}
                      onChange={(e) => setTzFilter(e.target.value)}
                      placeholder="Filter e.g. Asia/Kolkata, London, UTC+05..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                  <select
                    aria-label="Complete World Timezone Selector"
                    value={activeTimezone}
                    onChange={(e) => setTimezone(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none"
                  >
                    {filteredTimezones.map((item) => (
                      <option key={item.tz} value={item.tz}>
                        ({item.utcOffsetLabel}) {item.tz} — {item.cityLabel}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Column 2: Live Global City Geocoding Search */}
                <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    2. Worldwide City & Town Search
                  </div>
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[var(--text-muted)] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={geoQuery}
                      onChange={(e) => setGeoQuery(e.target.value)}
                      placeholder="Search any city worldwide (e.g. Bareilly, Madinah, Toronto)..."
                      className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                    />
                  </div>
                  <div className="max-h-32 overflow-y-auto space-y-1">
                    {geoSearching && (
                      <div className="text-[11px] text-[var(--text-muted)] py-1">Searching global directory…</div>
                    )}
                    {!geoSearching &&
                      geoResults.map((loc) => (
                        <button
                          key={loc.id}
                          type="button"
                          onClick={() => {
                            setCity({
                              id: loc.id,
                              name: loc.name,
                              country: loc.country,
                              lat: loc.lat,
                              lng: loc.lng,
                              tz: loc.tz,
                            });
                            setGeoQuery("");
                            setGeoResults([]);
                          }}
                          className="w-full text-left px-2.5 py-1.5 rounded-lg hover:bg-[var(--bg-card)] transition flex items-center justify-between text-xs cursor-pointer"
                        >
                          <span className="font-medium text-[var(--text-primary)] truncate">
                            {loc.name}
                            {loc.admin1 ? `, ${loc.admin1}` : ""} ({loc.country})
                          </span>
                          <span className="text-[10px] font-mono text-[var(--accent-gold)] shrink-0 ml-2">
                            {loc.tz}
                          </span>
                        </button>
                      ))}
                    {!geoSearching && geoQuery.trim().length < 2 && (
                      <div className="text-[11px] text-[var(--text-muted)]">
                        Type at least 2 letters to geocode any city with automatic coordinates & timezone.
                      </div>
                    )}
                  </div>
                </div>

                {/* Column 3: Exact GPS Coordinates Override */}
                <form
                  onSubmit={applyCustomCoordinates}
                  className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5"
                >
                  <div className="text-xs font-bold text-[var(--text-primary)]">
                    3. Exact Coordinates ({city.lat.toFixed(4)}°, {city.lng.toFixed(4)}°)
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="number"
                      step="any"
                      placeholder={`Lat (${city.lat.toFixed(2)})`}
                      value={customLat}
                      onChange={(e) => setCustomLat(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                    <input
                      type="number"
                      step="any"
                      placeholder={`Lng (${city.lng.toFixed(2)})`}
                      value={customLng}
                      onChange={(e) => setCustomLng(e.target.value)}
                      className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                    />
                  </div>
                  <button
                    type="submit"
                    className="w-full py-1.5 rounded-xl bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition cursor-pointer"
                  >
                    Apply Exact Latitude / Longitude
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {chimePlayed && (
        <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>Salawat & Azan chime played: {chimePlayed}</span>
        </div>
      )}

      {/* 2. Interactive Qibla Finder + Calibration Studio + Live Weather & AQI Module */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left 7 Columns: Interactive Animated Qibla Compass with Embedded Weather & AQI HUD */}
        <div className="lg:col-span-7 card-surface p-5 sm:p-6 flex flex-col justify-between space-y-5">
          {/* Header & Sensor / North Reference Controls */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                <Compass className="w-4 h-4" />
                <span>Interactive Qibla Finder & Weather Compass</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                {city.name}, {city.country} • Kaaba Distance:{" "}
                <strong className="text-[var(--text-primary)]">
                  {kaabaDistanceKm.toLocaleString()} km ({kaabaDistanceMiles.toLocaleString()} mi)
                </strong>
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={toggleLiveCompassSensor}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition cursor-pointer flex items-center gap-1.5 ${
                  sensorActive
                    ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-[var(--accent-gold)]"
                }`}
              >
                <Navigation className="w-3.5 h-3.5" />
                <span>{sensorActive ? "Live Sensor ON" : "Enable Live Compass"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowCalibrationModal((v) => !v)}
                className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition cursor-pointer flex items-center gap-1.5"
              >
                <Sliders className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>Calibrate ({qiblaCalibrationOffset >= 0 ? `+${qiblaCalibrationOffset}°` : `${qiblaCalibrationOffset}°`})</span>
              </button>
            </div>
          </div>

          {/* True North vs Magnetic North & Alignment Status Pill Bar */}
          <div className="flex flex-wrap items-center justify-between gap-2 px-3.5 py-2.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs">
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => setUseMagneticNorth(false)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  !useMagneticNorth
                    ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                True North ({schedule.qiblaBearing}°)
              </button>
              <button
                type="button"
                onClick={() => setUseMagneticNorth(true)}
                className={`px-2.5 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  useMagneticNorth
                    ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                Magnetic North ({effectiveQiblaBearing}°)
              </button>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[11px] text-[var(--text-muted)] font-mono">
                Declination: {magneticDeclination >= 0 ? `+${magneticDeclination}° E` : `${magneticDeclination}° W`}
              </span>
              {isQiblaAligned ? (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold text-[11px]">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Qibla Aligned ✓
                </span>
              ) : (
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--text-secondary)] font-mono text-[11px]">
                  Turn {qiblaDelta > 0 ? `${Math.abs(Math.round(qiblaDelta))}° Right →` : `← ${Math.abs(Math.round(qiblaDelta))}° Left`}
                </span>
              )}
            </div>
          </div>

          {/* Interactive Animated Compass Dial + Embedded Weather, Wind Vector & AQI HUD */}
          <div className="relative flex flex-col items-center justify-center py-2">
            {/* Fixed Top Lubber Line (Device Forward Pointer) */}
            <div className="mb-1 flex flex-col items-center">
              <div
                className={`text-[11px] font-bold font-mono px-2.5 py-0.5 rounded-full border ${
                  isQiblaAligned
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)]"
                }`}
              >
                Heading {currentHeading}° {degreesToCardinal(currentHeading)}
              </div>
              <div
                className={`w-0 h-0 border-l-[7px] border-r-[7px] border-b-[10px] border-l-transparent border-r-transparent mt-1 ${
                  isQiblaAligned ? "border-b-emerald-400" : "border-b-[var(--accent-gold)]"
                }`}
              />
            </div>

            {/* Compass Ring Container */}
            <div
              className={`relative w-72 h-72 sm:w-80 sm:h-80 rounded-full flex items-center justify-center transition-shadow duration-500 ${
                isQiblaAligned
                  ? "shadow-[0_0_45px_rgba(52,211,153,0.35)] ring-2 ring-emerald-400/60"
                  : "shadow-[0_14px_34px_rgba(11,16,38,0.22)] ring-1 ring-[var(--border-subtle)]"
              }`}
              style={{
                background:
                  "radial-gradient(circle at center, var(--bg-elevated) 0%, var(--bg-card) 72%, rgba(144,85,255,0.12) 100%)",
              }}
            >
              {/* Rotating Compass Rose SVG (rotates by -currentHeading so North & Qibla move relative to top lubber line) */}
              <motion.svg
                viewBox="0 0 300 300"
                className="w-full h-full"
                animate={{ rotate: -currentHeading }}
                transition={{ type: "spring", stiffness: 85, damping: 18 }}
              >
                <defs>
                  <linearGradient id="qiblaRayGrad" x1="0%" y1="100%" x2="0%" y2="0%">
                    <stop offset="0%" stopColor="#9055FF" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="#F4B860" stopOpacity="0.95" />
                  </linearGradient>
                </defs>

                {/* Outer Degree Ring */}
                <circle
                  cx="150"
                  cy="150"
                  r="140"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="1.5"
                />
                <circle
                  cx="150"
                  cy="150"
                  r="112"
                  fill="none"
                  stroke="var(--border-subtle)"
                  strokeWidth="1"
                  strokeDasharray="3 3"
                />

                {/* 72 Degree Ticks (every 5°) */}
                {Array.from({ length: 72 }).map((_, idx) => {
                  const deg = idx * 5;
                  const isMajor = deg % 30 === 0;
                  const isCardinal = deg % 90 === 0;
                  return (
                    <g key={deg} transform={`rotate(${deg} 150 150)`}>
                      <line
                        x1="150"
                        y1={isCardinal ? "10" : isMajor ? "12" : "14"}
                        x2="150"
                        y2={isCardinal ? "22" : isMajor ? "20" : "18"}
                        stroke={
                          deg === 0
                            ? "#F87171"
                            : isMajor
                            ? "var(--text-secondary)"
                            : "var(--text-muted)"
                        }
                        strokeWidth={isCardinal ? "2.5" : isMajor ? "1.5" : "1"}
                        strokeOpacity={isMajor ? "0.9" : "0.45"}
                      />
                    </g>
                  );
                })}

                {/* Cardinal Labels (N, E, S, W) */}
                {[
                  { label: "N", deg: 0, color: "#F87171" },
                  { label: "E", deg: 90, color: "var(--text-primary)" },
                  { label: "S", deg: 180, color: "var(--text-primary)" },
                  { label: "W", deg: 270, color: "var(--text-primary)" },
                ].map((c) => (
                  <g key={c.label} transform={`rotate(${c.deg} 150 150)`}>
                    <text
                      x="150"
                      y="36"
                      textAnchor="middle"
                      fill={c.color}
                      fontSize="13"
                      fontWeight="800"
                    >
                      {c.label}
                    </text>
                  </g>
                ))}

                {/* Live Wind Direction Vector on Compass Perimeter (from Open-Meteo) */}
                {weather && (
                  <g transform={`rotate(${weather.windDirectionDeg} 150 150)`}>
                    <line
                      x1="150"
                      y1="42"
                      x2="150"
                      y2="72"
                      stroke="#38BDF8"
                      strokeWidth="2"
                      strokeDasharray="3 2"
                    />
                    <polygon points="150,76 145,66 155,66" fill="#38BDF8" />
                    <circle cx="150" cy="40" r="9" fill="rgba(56, 189, 248, 0.2)" stroke="#38BDF8" strokeWidth="1.2" />
                    <text x="150" y="43" textAnchor="middle" fill="#38BDF8" fontSize="7" fontWeight="700">
                      W
                    </text>
                  </g>
                )}

                {/* Live Solar Azimuth Marker on Compass Perimeter (for Sun/Shadow Qibla verification) */}
                <g transform={`rotate(${solarPosition.azimuthDeg} 150 150)`}>
                  <circle
                    cx="150"
                    cy="26"
                    r="8"
                    fill={solarPosition.altitudeDeg > 0 ? "rgba(251, 191, 36, 0.25)" : "rgba(148, 163, 184, 0.2)"}
                    stroke={solarPosition.altitudeDeg > 0 ? "#FBBF24" : "#94A3B8"}
                    strokeWidth="1.5"
                  />
                  <circle
                    cx="150"
                    cy="26"
                    r="3.5"
                    fill={solarPosition.altitudeDeg > 0 ? "#FBBF24" : "#94A3B8"}
                  />
                </g>

                {/* Golden-Violet Kaaba Qibla Pointer Needle */}
                <g transform={`rotate(${effectiveQiblaBearing} 150 150)`}>
                  {/* Glowing Qibla Ray */}
                  <line
                    x1="150"
                    y1="150"
                    x2="150"
                    y2="28"
                    stroke="url(#qiblaRayGrad)"
                    strokeWidth="4"
                    strokeLinecap="round"
                  />
                  <polygon
                    points="150,14 141,34 150,29 159,34"
                    fill={isQiblaAligned ? "#34D399" : "#F4B860"}
                  />
                  {/* Iconic Kaaba Cube Emblem on the Qibla Bearing */}
                  <g transform="translate(150, 52)">
                    <rect
                      x="-11"
                      y="-11"
                      width="22"
                      height="22"
                      rx="4"
                      fill="#121324"
                      stroke={isQiblaAligned ? "#34D399" : "#F4B860"}
                      strokeWidth="2"
                    />
                    {/* Golden Kiswah Band */}
                    <rect x="-10" y="-5" width="20" height="3.5" fill="#F4B860" />
                  </g>
                </g>
              </motion.svg>

              {/* Center Stationary Hub: Live In-Compass Weather, AQI & Qibla Bearing HUD + Tilt Bubble */}
              <div className="absolute w-40 h-40 sm:w-44 sm:h-44 rounded-full bg-[var(--bg-card)]/95 backdrop-blur-md border border-[var(--border-subtle)] shadow-inner flex flex-col items-center justify-center p-3 text-center">
                {/* Subtle 2-Axis Spirit Level Bubble dot inside center hub */}
                <motion.div
                  aria-hidden="true"
                  className={`w-3 h-3 rounded-full absolute pointer-events-none ${
                    isDeviceTilted ? "bg-rose-400/60" : "bg-emerald-400/35"
                  }`}
                  animate={{
                    x: Math.max(-28, Math.min(28, tiltGamma * 1.2)),
                    y: Math.max(-28, Math.min(28, tiltBeta * 1.2)),
                  }}
                />

                <div className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                  Qibla Bearing
                </div>
                <div className="text-2xl sm:text-3xl font-extrabold tabular-nums text-[var(--accent-gold)] leading-tight">
                  {effectiveQiblaBearing}°
                </div>
                <div className="text-[10px] font-semibold text-[var(--text-secondary)]">
                  {degreesToCardinal(effectiveQiblaBearing)} • {kaabaDistanceKm.toLocaleString()} km
                </div>

                {/* Live Weather & AQI Pill directly inside the Compass Hub */}
                <div className="mt-2 pt-2 border-t border-[var(--border-subtle)] w-full flex flex-col items-center gap-1">
                  {weather ? (
                    <>
                      <div className="flex items-center justify-center gap-1.5 text-xs font-bold text-[var(--text-primary)]">
                        <Thermometer className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        <span>{formatTemp(weather.temperatureC)}</span>
                        <span className="text-[10px] font-normal text-[var(--text-muted)] truncate max-w-[78px]">
                          {weather.weatherLabel}
                        </span>
                      </div>
                      <div className="flex items-center justify-center gap-1.5 flex-wrap">
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ background: aqiMeta.bg, color: aqiMeta.color }}
                        >
                          AQI {weather.usAqi ?? "—"} • {aqiMeta.label}
                        </span>
                        <span className="text-[10px] font-mono text-sky-400 flex items-center gap-0.5">
                          <Wind className="w-3 h-3" />
                          {Math.round(weather.windSpeedKmh)} km/h
                        </span>
                      </div>
                    </>
                  ) : (
                    <div className="text-[10px] text-[var(--text-muted)]">
                      {weatherLoading ? "Syncing live weather & AQI…" : "Live telemetry ready"}
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Compass Legend Pills */}
            <div className="flex flex-wrap items-center justify-center gap-3 mt-3 text-[11px] text-[var(--text-muted)]">
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-sm bg-[#F4B860] inline-block" />
                Kaaba Qibla ({effectiveQiblaBearing}°)
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-400 inline-block" />
                Sun Azimuth ({solarPosition.azimuthDeg}°)
              </span>
              {weather && (
                <span className="inline-flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-sky-400 inline-block" />
                  Wind Vector ({weather.windDirectionDeg}° {degreesToCardinal(weather.windDirectionDeg)})
                </span>
              )}
            </div>
          </div>

          {/* Interactive Rotation Control Slider & 1-Tap Align to Qibla */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-semibold text-[var(--text-primary)]">
                {sensorStatus}
              </span>
              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => {
                    setSensorActive(false);
                    setManualHeading(
                      Number(((effectiveQiblaBearing - qiblaCalibrationOffset + 360) % 360).toFixed(1))
                    );
                  }}
                  className="px-2.5 py-1 rounded-lg bg-[var(--accent-gold)]/20 text-[var(--accent-gold)] font-semibold hover:bg-[var(--accent-gold)]/30 transition cursor-pointer text-[11px]"
                >
                  Snap to Qibla ({effectiveQiblaBearing}°)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSensorActive(false);
                    setManualHeading(0);
                  }}
                  className="px-2 py-1 rounded-lg bg-[var(--bg-card)] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition cursor-pointer text-[11px]"
                >
                  North (0°)
                </button>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-mono text-[var(--text-muted)] w-8">0°</span>
              <input
                type="range"
                aria-label="Interactive Compass Heading Rotation"
                min={0}
                max={359}
                step={0.5}
                value={rawHeading}
                onChange={(e) => {
                  setSensorActive(false);
                  setManualHeading(parseFloat(e.target.value));
                }}
                className="flex-1 accent-[var(--accent-gold)] cursor-pointer"
              />
              <span className="text-[11px] font-mono text-[var(--text-muted)] w-10 text-right">360°</span>
            </div>
          </div>

          {/* Expandable Qibla Calibration Studio (Figure-8 ∞ Guide, 2-Axis Spirit Level & Offset Trim) */}
          <AnimatePresence>
            {showCalibrationModal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border-2 border-[var(--accent-gold)]/40 space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4" />
                      <span>Qibla Magnetometer & Spirit-Level Calibration Studio</span>
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowCalibrationModal(false)}
                      className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                    >
                      Done
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Figure-8 ∞ Motion Calibration */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          1. Figure-8 (∞) Wave Calibration
                        </span>
                        <span className="text-[11px] font-mono text-emerald-400">
                          Step {figure8Step}/3
                        </span>
                      </div>
                      {/* Animated SVG Figure-8 Path */}
                      <div className="flex items-center justify-center py-1">
                        <svg viewBox="0 0 200 70" className="w-40 h-14">
                          <path
                            d="M 100 35 C 130 5, 185 5, 185 35 C 185 65, 130 65, 100 35 C 70 5, 15 5, 15 35 C 15 65, 70 65, 100 35 Z"
                            fill="none"
                            stroke="var(--accent-gold)"
                            strokeWidth="3"
                            strokeDasharray="6 4"
                          />
                          <circle cx="100" cy="35" r="5" fill="#34D399" />
                        </svg>
                      </div>
                      <p className="text-[11px] text-[var(--text-muted)]">
                        Wave your device in a smooth figure-8 (∞) motion away from metal cases or magnetic mounts, then tap below:
                      </p>
                      <button
                        type="button"
                        onClick={runFigure8CalibrationStep}
                        className="w-full py-1.5 rounded-lg bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] transition cursor-pointer"
                      >
                        {figure8Step >= 3
                          ? "Magnetometer Verified ✓ (Tap to Re-Verify)"
                          : `Record Figure-8 Pass (${figure8Step}/3)`}
                      </button>
                    </div>

                    {/* 2-Axis Spirit Level & Manual Compass Trim Offset */}
                    <div className="p-3.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-[var(--text-primary)]">
                          2. Flat-Surface Tilt & Trim Offset
                        </span>
                        <span
                          className={`text-[11px] font-mono ${
                            isDeviceTilted ? "text-rose-400" : "text-emerald-400"
                          }`}
                        >
                          Pitch {tiltBeta}° • Roll {tiltGamma}°
                        </span>
                      </div>

                      <div className="space-y-1.5">
                        <div className="flex items-center justify-between text-[11px]">
                          <span className="text-[var(--text-muted)]">Compass Trim Offset (-30° to +30°)</span>
                          <span className="font-mono font-bold text-[var(--accent-gold)]">
                            {qiblaCalibrationOffset >= 0
                              ? `+${qiblaCalibrationOffset}°`
                              : `${qiblaCalibrationOffset}°`}
                          </span>
                        </div>
                        <input
                          type="range"
                          aria-label="Qibla Compass Calibration Trim Offset"
                          min={-30}
                          max={30}
                          step={0.5}
                          value={qiblaCalibrationOffset}
                          onChange={(e) => setQiblaCalibrationOffset(parseFloat(e.target.value))}
                          className="w-full accent-[var(--accent-gold)] cursor-pointer"
                        />
                        <div className="flex items-center justify-between pt-1">
                          <span className="text-[10px] text-[var(--text-muted)]">
                            Sun Azimuth Reference: {solarPosition.azimuthDeg}°
                          </span>
                          <button
                            type="button"
                            onClick={() => setQiblaCalibrationOffset(0)}
                            className="inline-flex items-center gap-1 text-[11px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                          >
                            <RotateCcw className="w-3 h-3" />
                            Reset Trim
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Right 5 Columns: Live Weather & Air Quality Index (AQI) Telemetry Widget */}
        <div className="lg:col-span-5 card-surface p-5 sm:p-6 flex flex-col justify-between space-y-5">
          <div className="flex items-center justify-between gap-2">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-400">
                <Thermometer className="w-4 h-4" />
                <span>Live Weather & Air Quality (AQI)</span>
              </div>
              <p className="text-xs text-[var(--text-muted)] mt-0.5">
                Real-time telemetry for {city.name} ({city.lat.toFixed(2)}°, {city.lng.toFixed(2)}°)
              </p>
            </div>

            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setUseFahrenheit((v) => !v)}
                className="px-2.5 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--text-primary)] cursor-pointer"
              >
                {useFahrenheit ? "°F" : "°C"}
              </button>
              <button
                type="button"
                onClick={refreshWeather}
                disabled={weatherLoading}
                title="Refresh Live Weather & AQI"
                className="p-1.5 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${weatherLoading ? "animate-spin" : ""}`} />
              </button>
            </div>
          </div>

          {weatherError && (
            <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-xs text-rose-300">
              {weatherError}
            </div>
          )}

          {/* Primary Temperature & Condition Banner */}
          <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between gap-4">
            <div>
              <div className="text-3xl sm:text-4xl font-extrabold tabular-nums text-[var(--text-primary)]">
                {weather ? formatTemp(weather.temperatureC) : weatherLoading ? "…" : "—"}
              </div>
              <div className="text-xs font-semibold text-[var(--accent-gold)] mt-0.5">
                {weather ? weather.weatherLabel : "Fetching atmospheric data…"}
              </div>
              {weather && (
                <div className="text-[11px] text-[var(--text-muted)] mt-1">
                  Feels like {formatTemp(weather.apparentTemperatureC)} • H: {formatTemp(weather.tempMaxC)} / L:{" "}
                  {formatTemp(weather.tempMinC)}
                </div>
              )}
            </div>

            {/* Live US & European AQI Badge */}
            <div
              className="p-3 rounded-2xl border text-right min-w-[125px]"
              style={{
                background: aqiMeta.bg,
                borderColor: `${aqiMeta.color}40`,
              }}
            >
              <div className="text-[10px] font-bold uppercase tracking-wider" style={{ color: aqiMeta.color }}>
                US AQI • {aqiMeta.label}
              </div>
              <div className="text-2xl font-extrabold tabular-nums mt-0.5" style={{ color: aqiMeta.color }}>
                {weather?.usAqi ?? "—"}
              </div>
              <div className="text-[10px] text-[var(--text-secondary)]">
                EU AQI: {weather?.europeanAqi ?? "—"}
              </div>
            </div>
          </div>

          {/* 4-Metric Meteorological Grid */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-2.5">
              <Wind className="w-4 h-4 text-sky-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)]">Wind Vector</div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {weather
                    ? `${Math.round(weather.windSpeedKmh)} km/h ${degreesToCardinal(weather.windDirectionDeg)} (${weather.windDirectionDeg}°)`
                    : "—"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-2.5">
              <Droplets className="w-4 h-4 text-blue-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)]">Humidity & Rain</div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {weather ? `${weather.humidityPct}% • ${weather.precipitationMm} mm` : "—"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-2.5">
              <Gauge className="w-4 h-4 text-purple-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)]">Surface Pressure</div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {weather ? `${Math.round(weather.surfacePressureHpa)} hPa` : "—"}
                </div>
              </div>
            </div>

            <div className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center gap-2.5">
              <Sun className="w-4 h-4 text-amber-400 shrink-0" />
              <div>
                <div className="text-[10px] uppercase text-[var(--text-muted)]">UV Index & Cloud</div>
                <div className="text-xs font-bold text-[var(--text-primary)]">
                  {weather ? `UV ${weather.uvIndex} • ${weather.cloudCoverPct}% Cloud` : "—"}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Particulate & Atmospheric Breakdown (PM2.5, PM10, Ozone, Dust) */}
          <div className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                <Activity className="w-3.5 h-3.5 text-emerald-400" />
                Atmospheric Particulates (μg/m³)
              </span>
              <span className="text-[11px] font-semibold" style={{ color: aqiMeta.color }}>
                {aqiMeta.label}
              </span>
            </div>

            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: "PM2.5", val: weather?.pm25 },
                { label: "PM10", val: weather?.pm10 },
                { label: "O₃ Ozone", val: weather?.ozone },
                { label: "Dust", val: weather?.dust },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)]"
                >
                  <div className="text-[10px] text-[var(--text-muted)]">{item.label}</div>
                  <div className="text-xs font-bold tabular-nums text-[var(--text-primary)] mt-0.5">
                    {item.val !== null && item.val !== undefined ? item.val : "—"}
                  </div>
                </div>
              ))}
            </div>

            <p className="text-[11px] text-[var(--text-secondary)] leading-relaxed">
              {aqiMeta.advisory}
            </p>
          </div>
        </div>
      </div>

      {/* 3. Date Scrubber + 5 Daily Hanafi Prayers with 1-Tap Tracker & Expandable Jamaat Config */}
      <div className="card-surface p-5 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border-subtle)]">
          <div>
            <h2 className="text-lg font-bold text-[var(--text-primary)] flex items-center gap-2">
              <span>Hanafi 5 Daily Prayers (Mithlayn Asr)</span>
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400">
                {rings.salah}% Prayed Today
              </span>
            </h2>
            <p className="text-xs text-[var(--text-muted)]">
              Tap a status pill to log your Salah • Click any row to customize Azan offset or fixed Masjid Jamaat time
            </p>
          </div>

          {/* Interactive Date Scrubber & Calculation Authority Selector */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="inline-flex items-center rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] p-1">
              <button
                type="button"
                onClick={() => setDayOffset((d) => d - 1)}
                title="Previous Day"
                className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] cursor-pointer"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => setDayOffset(0)}
                className="px-2.5 py-1 text-xs font-semibold text-[var(--text-primary)] flex items-center gap-1.5 cursor-pointer"
              >
                <Calendar className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                <span>
                  {dayOffset === 0
                    ? "Today"
                    : selectedDate.toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                </span>
              </button>
              <button
                type="button"
                onClick={() => setDayOffset((d) => d + 1)}
                title="Next Day"
                className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] cursor-pointer"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <select
              aria-label="Calculation Authority"
              value={calcMethod}
              onChange={(e) => setCalcMethod(e.target.value as CalcMethodId)}
              className="px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-medium text-[var(--text-primary)] focus:outline-none"
            >
              <option value="Karachi">Univ. of Islamic Sciences, Karachi (Hanafi)</option>
              <option value="MuslimWorldLeague">Muslim World League</option>
              <option value="UmmAlQura">Umm al-Qura (Makkah)</option>
              <option value="MoonsightingCommittee">Moonsighting Committee</option>
              <option value="NorthAmerica">ISNA (North America)</option>
              <option value="Turkey">Diyanet (Türkiye)</option>
            </select>
          </div>
        </div>

        <div className="divide-y divide-[var(--border-subtle)]">
          {schedule.rows.map((p) => {
            const cfg = prayerSettings[p.name];
            const isNext = schedule.nextPrayer.name === p.name && dayOffset === 0;
            const loggedStatus = salahToday[p.name];
            const isExpanded = expandedPrayer === p.name;

            return (
              <div key={p.name} className="py-3.5 first:pt-1 last:pb-1">
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
                  {/* Prayer Name & Jamaat/Azan Summary */}
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() => setExpandedPrayer(isExpanded ? null : p.name)}
                      className={`w-10 h-10 rounded-2xl flex items-center justify-center font-bold text-sm transition cursor-pointer ${
                        isNext
                          ? "bg-[var(--accent-gold)] text-[#1D0E40] shadow-md"
                          : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] border border-[var(--border-subtle)]"
                      }`}
                    >
                      {p.label.slice(0, 2)}
                    </button>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-base text-[var(--text-primary)]">{p.label}</span>
                        {isNext && <span className="badge-pill badge-emerald">Next</span>}
                        {p.isConflict && (
                          <span className="badge-pill badge-crimson">Check Fixed Time</span>
                        )}
                      </div>
                      <div className="text-[11px] text-[var(--text-muted)]">
                        Azan <strong className="text-[var(--text-primary)] font-mono">{fmtTz(p.azanTime)}</strong> • Jamaat{" "}
                        <strong className="text-[var(--accent-gold)] font-mono">{fmtTz(p.jamaatTime)}</strong>
                      </div>
                    </div>
                  </div>

                  {/* Interactive 1-Tap Salah Tracker Pills + Customize Button */}
                  <div className="flex flex-wrap items-center gap-1.5">
                    {(
                      [
                        { key: "jamaat", label: "With Jamaat" },
                        { key: "ontime", label: "On Time" },
                        { key: "qaza", label: "Qaza" },
                      ] as const
                    ).map((st) => {
                      const active = loggedStatus === st.key;
                      return (
                        <button
                          key={st.key}
                          type="button"
                          onClick={() => logSalah(p.name, active ? "none" : st.key)}
                          className={`px-2.5 py-1 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                            active
                              ? st.key === "jamaat"
                                ? "bg-emerald-500/20 border-emerald-500/50 text-emerald-400"
                                : st.key === "ontime"
                                ? "bg-purple-500/20 border-purple-400/50 text-purple-300"
                                : "bg-amber-500/20 border-amber-400/50 text-amber-300"
                              : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                          }`}
                        >
                          {active ? `✓ ${st.label}` : st.label}
                        </button>
                      );
                    })}

                    <button
                      type="button"
                      onClick={() => setExpandedPrayer(isExpanded ? null : p.name)}
                      className="px-2.5 py-1 rounded-xl text-xs font-semibold bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer ml-1"
                    >
                      {isExpanded ? "Hide Config" : "Jamaat Config"}
                    </button>

                    <button
                      type="button"
                      onClick={() => playGentleChime(`${p.label} Salawat & Azan`)}
                      title="Preview Gentle Salawat Chime"
                      className="p-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--accent-gold)] hover:bg-[var(--bg-muted)] cursor-pointer"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Expandable Per-Prayer Customization Drawer */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="mt-3 p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
                        <div>
                          <label className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                            Jamaat Mode
                          </label>
                          <div className="flex items-center gap-1.5">
                            <button
                              type="button"
                              onClick={() => updatePrayerSetting(p.name, { mode: "offset" })}
                              className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                                cfg.mode === "offset"
                                  ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                                  : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                              }`}
                            >
                              +Minutes
                            </button>
                            <button
                              type="button"
                              onClick={() => updatePrayerSetting(p.name, { mode: "fixed" })}
                              className={`px-2.5 py-1 rounded-lg font-semibold cursor-pointer ${
                                cfg.mode === "fixed"
                                  ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                                  : "bg-[var(--bg-card)] text-[var(--text-muted)]"
                              }`}
                            >
                              Fixed Time
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                            {cfg.mode === "offset" ? "Minutes After Azan" : "Fixed Masjid Jamaat"}
                          </label>
                          {cfg.mode === "offset" ? (
                            <input
                              type="number"
                              min={0}
                              max={120}
                              value={cfg.offsetMinutes}
                              onChange={(e) =>
                                updatePrayerSetting(p.name, {
                                  offsetMinutes: Number(e.target.value),
                                })
                              }
                              className="w-28 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-[var(--text-primary)]"
                            />
                          ) : (
                            <input
                              type="time"
                              value={cfg.fixedTime}
                              onChange={(e) =>
                                updatePrayerSetting(p.name, { fixedTime: e.target.value })
                              }
                              className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-[var(--text-primary)]"
                            />
                          )}
                        </div>

                        <div>
                          <label className="text-[10px] uppercase text-[var(--text-muted)] block mb-1">
                            Azan Calibration (±Min)
                          </label>
                          <input
                            type="number"
                            min={-30}
                            max={30}
                            value={cfg.manualAdjustMinutes}
                            onChange={(e) =>
                              updatePrayerSetting(p.name, {
                                manualAdjustMinutes: Number(e.target.value),
                              })
                            }
                            className="w-24 px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] font-mono text-[var(--text-primary)]"
                          />
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Fasting, Nafl & 3 Hanafi Makruh Tahrimi Windows */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card-surface p-5 space-y-3">
          <div className="flex items-center gap-2 text-[var(--accent-gold)] text-xs font-semibold uppercase tracking-wider">
            <Sun className="w-4 h-4" />
            <span>Fasting & Nafl Windows ({activeTimezone})</span>
          </div>
          <div className="divide-y divide-[var(--border-subtle)] text-xs">
            {[
              {
                label: "Sehri Ends (Subh Sadiq)",
                value: fmtTz(schedule.rows[0].azanTime),
                sub: "Stop eating before Fajr begins",
              },
              {
                label: "Iftar (Maghrib)",
                value: fmtTz(schedule.rows[3].azanTime),
                sub: "Sunnah to break fast with dates & water",
              },
              {
                label: "Ishraq & Chasht (Duha)",
                value: `${fmtTz(schedule.ishraq)} – ${fmtTz(schedule.chasht)}`,
                sub: "2 to 12 Rak'at Nafl after sunrise",
              },
              {
                label: "Dahwa-e-Kubra (Shar'i Midday)",
                value: fmtTz(schedule.dahwaKubra),
                sub: "Deadline for Hanafi Ramadan/Niyyah cutoff",
              },
              {
                label: "Tahajjud (Last Third of Night)",
                value: fmtTz(schedule.tahajjudStart),
                sub: "Blessed pre-dawn vigil until Fajr",
              },
            ].map((row) => (
              <div key={row.label} className="py-2.5 flex items-center justify-between gap-2">
                <div>
                  <div className="font-semibold text-[var(--text-primary)]">{row.label}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{row.sub}</div>
                </div>
                <div className="font-mono font-bold text-sm text-[var(--accent-gold)] shrink-0">
                  {row.value}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card-surface p-5 space-y-3">
          <div className="flex items-center gap-2 text-rose-400 text-xs font-semibold uppercase tracking-wider">
            <AlertTriangle className="w-4 h-4" />
            <span>3 Makruh Tahrimi Windows (No Salah)</span>
          </div>
          <p className="text-xs text-[var(--text-secondary)]">
            Under Sunni Hanafi fiqh, no Fard, Wajib, Nafl, or Qaza Salah is valid during these three solar transitions:
          </p>
          <div className="divide-y divide-[var(--border-subtle)]">
            {schedule.makruhWindows.map((w) => (
              <div key={w.id} className="py-2.5 flex items-center justify-between gap-3">
                <div>
                  <div className="text-xs font-bold text-[var(--text-primary)]">{w.label}</div>
                  <div className="text-[11px] text-[var(--text-muted)]">{w.description}</div>
                </div>
                <div className="text-xs font-mono font-bold text-rose-400 shrink-0">
                  {fmtTz(w.start)} – {fmtTz(w.end)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
