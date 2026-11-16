"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Compass,
  Clock,
  BookOpen,
  Scale,
  Sparkles,
  Calculator,
  Trophy,
  ShieldCheck,
  Sun,
  Moon,
  MapPin,
  Globe,
  UserCheck,
  UserRound,
  LocateFixed,
  ArrowLeft,
  LayoutGrid,
  X,
  Search,
  Loader2,
  CloudSun,
} from "lucide-react";
import { PrayerAlerts } from "./PrayerAlerts";
import { useApp } from "@/lib/store";
import { LANGUAGES, LangCode, t } from "@/lib/i18n";
import {
  GeocodedLocation,
  getAllWorldTimezones,
  getAqiCategory,
  getTimezoneOffsetInfo,
  searchWorldLocations,
} from "@/lib/location-weather";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    theme,
    setTheme,
    lang,
    setLang,
    city,
    setCity,
    setTimezone,
    requestGpsLocation,
    gpsLoading,
    gpsError,
    weather,
    user,
    signInUser,
    signOutUser,
    streakDays,
    hydrated,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  // Global City Search & Complete Timezone Filter inside Drawer
  const [locQuery, setLocQuery] = useState("");
  const [locResults, setLocResults] = useState<GeocodedLocation[]>([]);
  const [searchingLoc, setSearchingLoc] = useState(false);

  const isDashboard = pathname === "/" || pathname === "";

  const allTimezones = useMemo(() => getAllWorldTimezones(), []);
  const activeTz = city.tz || "UTC";
  const activeTzOffset = useMemo(() => getTimezoneOffsetInfo(activeTz).label, [activeTz]);
  const aqiMeta = useMemo(() => getAqiCategory(weather?.usAqi ?? null), [weather?.usAqi]);

  const navItems = [
    { href: "/", label: t(lang, "navHome"), shortLabel: "Home", desc: "Dashboard & Surah Index", icon: Home },
    { href: "/quran", label: t(lang, "navQuran"), shortLabel: "Quran", desc: "604-Page Mushaf & Kanzul Iman", icon: BookOpen },
    { href: "/prayer", label: t(lang, "navPrayer"), shortLabel: "Prayer", desc: "Hanafi Waqt, Qibla & Weather", icon: Clock },
    { href: "/tasbih", label: t(lang, "navTasbih"), shortLabel: "Tasbih", desc: "Adhkar, Durood & Habit Tracker", icon: Sparkles },
    { href: "/auliya", label: t(lang, "navAuliya"), shortLabel: "Auliya", desc: "Urs Calendar & 360° Ziyarat", icon: Compass },
    { href: "/quiz", label: t(lang, "navQuiz"), shortLabel: "Quiz", desc: "15-Tier Sahib-e-Ilm Challenge", icon: Trophy },
    { href: "/fiqh", label: t(lang, "navFiqh"), shortLabel: "Fiqh", desc: "11 Hadith Books, Namaz & Fiqh", icon: Scale },
    { href: "/zakat", label: t(lang, "navZakat"), shortLabel: "Zakat", desc: "Silver Nisab Calculator", icon: Calculator },
    { href: "/admin", label: t(lang, "navAdmin"), shortLabel: "Curator", desc: "Add Profiles & Family Barsis", icon: ShieldCheck },
  ];

  const activeModule = navItems.find((item) => item.href !== "/" && pathname.startsWith(item.href));

  const handleSearchLocations = async (q: string) => {
    setLocQuery(q);
    if (q.trim().length < 2) {
      setLocResults([]);
      return;
    }
    setSearchingLoc(true);
    try {
      const found = await searchWorldLocations(q);
      setLocResults(found);
    } catch {
      setLocResults([]);
    } finally {
      setSearchingLoc(false);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col pb-16 sm:pb-6">
      {/* Minimal Reference-Style App Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl transition-colors"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-canvas) 86%, transparent)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Staggered 2-Line Menu on Home, or Clean Back Arrow inside any Module */}
          <div className="flex items-center gap-3 min-w-0">
            {isDashboard ? (
              <button
                type="button"
                onClick={() => setSwitcherOpen(true)}
                aria-label="Open menu and settings"
                className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
                style={{ color: "var(--text-muted)" }}
              >
                <svg width="22" height="16" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="2" y1="3" x2="20" y2="3" />
                  <line x1="2" y1="8" x2="14" y2="8" />
                  <line x1="2" y1="13" x2="18" y2="13" />
                </svg>
              </button>
            ) : (
              <Link
                href="/"
                aria-label="Back to Home Dashboard"
                className="w-9 h-9 rounded-xl flex items-center justify-center transition-transform active:scale-95 hover:opacity-80"
                style={{ color: "var(--text-muted)" }}
              >
                <ArrowLeft className="w-5 h-5" />
              </Link>
            )}

            <Link href="/" className="min-w-0">
              <span className="text-lg sm:text-xl font-bold tracking-tight truncate block">
                {!isDashboard && activeModule ? activeModule.label : "Quran App"}
              </span>
            </Link>
          </div>

          {/* Right: Live GPS / Timezone / Weather Pill + Theme Toggle + Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            <button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-hairline)",
              }}
              title={`Location: ${city.name} (${activeTz}, ${activeTzOffset})`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
              <span className="truncate max-w-[84px] sm:max-w-[130px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {city.name}
              </span>
              <span className="hidden md:inline text-[10px] opacity-75">({activeTzOffset})</span>
              {weather && (
                <span className="hidden sm:inline-flex items-center gap-1 pl-1.5 ml-1 border-l text-[11px] font-semibold tabular-nums" style={{ borderColor: "var(--border-hairline)", color: "var(--accent-gold)" }}>
                  <CloudSun className="w-3 h-3" />
                  {Math.round(weather.temperatureC)}°C
                  {weather.usAqi !== null && (
                    <span className="px-1.5 py-0.2 rounded-full text-[9px]" style={{ backgroundColor: aqiMeta.bg, color: aqiMeta.color }}>
                      AQI {weather.usAqi}
                    </span>
                  )}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => requestGpsLocation()}
              disabled={gpsLoading}
              aria-label="Detect my location and timezone via GPS"
              title="Use Live GPS Location & Timezone"
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-85 disabled:opacity-50"
              style={{
                backgroundColor: city.id === "gps" ? "var(--accent-soft)" : "var(--bg-surface)",
                color: city.id === "gps" ? "var(--accent-primary)" : "var(--text-muted)",
                border: "1px solid var(--border-hairline)",
              }}
            >
              {gpsLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <LocateFixed className="w-4 h-4" />}
            </button>

            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Light/Dark Theme"
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-85"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-hairline)",
              }}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
              ) : (
                <Moon className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
              )}
            </button>

            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              aria-label={user ? `Profile: ${user.name}` : "Personalize Greeting"}
              className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold text-white cursor-pointer shrink-0 shadow-sm"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              {user ? user.name.slice(0, 1).toUpperCase() : <UserRound className="w-4 h-4" />}
            </button>
          </div>
        </div>
      </header>

      {/* Focused Single-Module Main Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-col">
        {hydrated ? children : <PageSkeleton />}
      </main>

      {/* Mobile Bottom Dock Bar */}
      <nav
        aria-label="Primary Mobile Navigation"
        className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-xl"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-surface) 92%, transparent)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="grid grid-cols-5 h-14 max-w-md mx-auto px-2">
          {[
            navItems[0], // Home
            navItems[1], // Quran
            navItems[2], // Prayer
            navItems[3], // Tasbih
          ].map((item) => {
            const active = item.href === "/" ? isDashboard : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors"
                style={{ color: active ? "var(--accent-primary)" : "var(--text-muted)" }}
              >
                <Icon className="w-4 h-4" />
                <span>{item.shortLabel}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setSwitcherOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold cursor-pointer"
            style={{ color: switcherOpen ? "var(--accent-primary)" : "var(--text-muted)" }}
          >
            <LayoutGrid className="w-4 h-4" />
            <span>More</span>
          </button>
        </div>
      </nav>

      <PrayerAlerts />

      {/* Navigation, Complete Timezone & Live GPS Drawer */}
      {switcherOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={() => setSwitcherOpen(false)}
        >
          <div
            className="bento-card w-full max-w-2xl p-5 sm:p-6 space-y-5 max-h-[88dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                  Navigation, Live GPS &amp; World Timezones
                </p>
                <h2 className="text-lg font-bold">Location &amp; Modules</h2>
              </div>
              <button
                type="button"
                onClick={() => setSwitcherOpen(false)}
                className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* GPS + Complete IANA Timezone + Global City Search */}
            <div className="space-y-3 p-3.5 rounded-2xl border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
              <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                  <div>
                    <span className="font-bold">{city.name}, {city.country}</span>
                    <span className="ml-2 opacity-75 font-mono text-[11px]">
                      ({city.lat.toFixed(3)}°, {city.lng.toFixed(3)}° • {activeTz} {activeTzOffset})
                    </span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => requestGpsLocation()}
                  disabled={gpsLoading}
                  className="btn-primary px-3 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {gpsLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <LocateFixed className="w-3.5 h-3.5" />}
                  <span>{gpsLoading ? "Detecting GPS…" : "Use Live GPS & Timezone"}</span>
                </button>
              </div>

              {gpsError && (
                <p className="text-[11px] text-amber-300">{gpsError}</p>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                {/* Complete IANA World Timezone Selector */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    World Timezone ({allTimezones.length} IANA Zones)
                  </label>
                  <select
                    aria-label="Select World Timezone"
                    value={activeTz}
                    onChange={(e) => setTimezone(e.target.value, true)}
                    className="ui-select w-full px-3 py-2 rounded-xl border font-semibold outline-none cursor-pointer"
                    style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}
                  >
                    {allTimezones.map((tOpt) => (
                      <option key={tOpt.tz} value={tOpt.tz} className="text-black">
                        ({tOpt.utcOffsetLabel}) {tOpt.tz.replace(/_/g, " ")}
                      </option>
                    ))}
                  </select>
                </div>

                {/* App Display Language */}
                <div>
                  <label className="block text-[11px] font-semibold mb-1" style={{ color: "var(--text-muted)" }}>
                    Interface Language
                  </label>
                  <div
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border"
                    style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}
                  >
                    <Globe className="w-4 h-4 shrink-0" style={{ color: "var(--accent-primary)" }} />
                    <select
                      aria-label="Select Language"
                      value={lang}
                      onChange={(e) => setLang(e.target.value as LangCode)}
                      className="ui-select bg-transparent outline-none cursor-pointer font-semibold flex-1"
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="text-black">
                          {l.nativeLabel} ({l.label})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Global City Geocoding Search */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                <input
                  type="text"
                  value={locQuery}
                  onChange={(e) => handleSearchLocations(e.target.value)}
                  placeholder="Search any city worldwide (auto-sets coordinates & timezone)…"
                  className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs outline-none"
                  style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}
                />
                {searchingLoc && (
                  <Loader2 className="w-3.5 h-3.5 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                )}
              </div>

              {locResults.length > 0 && (
                <div className="max-h-40 overflow-y-auto divide-y rounded-xl border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-surface)" }}>
                  {locResults.map((loc) => (
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
                        setLocQuery("");
                        setLocResults([]);
                      }}
                      className="w-full px-3 py-2 text-left text-xs flex items-center justify-between hover:opacity-85 cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      <div>
                        <span className="font-bold">{loc.name}</span>
                        {loc.admin1 ? `, ${loc.admin1}` : ""} — <span style={{ color: "var(--text-muted)" }}>{loc.country}</span>
                      </div>
                      <span className="text-[10px] font-mono" style={{ color: "var(--accent-primary)" }}>
                        {loc.tz}
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Module Cards */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {navItems.map((item) => {
                const active = item.href === "/" ? isDashboard : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSwitcherOpen(false)}
                    className="p-3.5 rounded-2xl border flex flex-col justify-between gap-2.5 transition-transform active:scale-98"
                    style={{
                      borderColor: active ? "var(--accent-primary)" : "var(--border-hairline)",
                      backgroundColor: active ? "var(--accent-soft)" : "var(--bg-muted)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundImage: active ? "var(--gradient-brand)" : undefined,
                          backgroundColor: active ? undefined : "var(--bg-surface)",
                          color: active ? "#ffffff" : "var(--accent-primary)",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                    </div>
                    <div>
                      <div className="font-bold text-xs sm:text-sm">{item.label}</div>
                      <div className="text-[11px] line-clamp-1 mt-0.5" style={{ color: "var(--text-muted)" }}>
                        {item.desc}
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Profile Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/65 backdrop-blur-xs p-4">
          <div className="bento-card max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 end-4 p-1.5 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
              aria-label="Close profile modal"
            >
              <X className="w-4 h-4" />
            </button>

            {user ? (
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div
                    className="w-11 h-11 rounded-full flex items-center justify-center text-white font-bold"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  >
                    <UserCheck className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold">{user.name}</h2>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {streakDays}-Day Streak • Saved on this device
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    signOutUser();
                    setAuthModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  Reset Display Name
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  if (!nameInput.trim()) return;
                  signInUser({ name: nameInput.trim(), email: emailInput.trim(), provider: "Local" });
                  setAuthModalOpen(false);
                }}
                className="space-y-3.5"
              >
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--accent-primary)" }}>
                    Personalize Your Greeting
                  </p>
                  <h2 className="text-lg font-bold mt-0.5">Assalamualaikum</h2>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Enter your name to display on the home screen.
                  </p>
                </div>
                <input
                  type="text"
                  required
                  maxLength={40}
                  placeholder="Your name (e.g. Tanvir Ahassan)"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
                <input
                  type="email"
                  placeholder="Email (optional)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border text-sm bg-transparent outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
                <button type="submit" className="btn-primary w-full py-2.5 rounded-xl text-sm font-semibold cursor-pointer">
                  Save Name
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function PageSkeleton() {
  return (
    <div className="grid gap-4 md:grid-cols-2 animate-pulse" aria-busy="true" aria-label="Loading">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="bento-card h-40" style={{ opacity: 0.45 }} />
      ))}
    </div>
  );
}
