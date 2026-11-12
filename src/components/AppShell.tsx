"use client";

import React, { useState } from "react";
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
  LayoutGrid,
  X,
} from "lucide-react";
import { PrayerAlerts } from "./PrayerAlerts";
import { useApp } from "@/lib/store";
import { LANGUAGES, LangCode, t } from "@/lib/i18n";
import { CITY_PRESETS } from "@/lib/prayer-engine";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme, lang, setLang, city, setCity, user, signInUser, signOutUser, streakDays, hydrated } =
    useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const navItems = [
    { href: "/", label: t(lang, "navHome"), icon: Home },
    { href: "/auliya", label: t(lang, "navAuliya"), icon: Compass },
    { href: "/prayer", label: t(lang, "navPrayer"), icon: Clock },
    { href: "/quran", label: t(lang, "navQuran"), icon: BookOpen },
    { href: "/fiqh", label: t(lang, "navFiqh"), icon: Scale },
    { href: "/tasbih", label: t(lang, "navTasbih"), icon: Sparkles },
    { href: "/zakat", label: t(lang, "navZakat"), icon: Calculator },
    { href: "/quiz", label: t(lang, "navQuiz"), icon: Trophy },
    { href: "/admin", label: t(lang, "navAdmin"), icon: ShieldCheck },
  ];

  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("Location is not available in this browser. Please choose a city from the list.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        let tz: string | undefined;
        try {
          tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
        } catch {
          tz = undefined;
        }
        setCity({
          id: "gps",
          name: "My Location",
          country: "GPS",
          lat: Number(pos.coords.latitude.toFixed(4)),
          lng: Number(pos.coords.longitude.toFixed(4)),
          tz,
        });
      },
      () => alert("Location permission was denied. Please choose a city from the list.")
    );
  };

  const cityPicker = (
    <div
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs min-w-0"
      style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
    >
      <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
      <select
        aria-label="Select City"
        value={city.id}
        onChange={(e) => {
          const found = CITY_PRESETS.find((c) => c.id === e.target.value);
          if (found) setCity(found);
        }}
        className="bg-transparent outline-none cursor-pointer font-medium min-w-0 flex-1 truncate"
      >
        {city.id === "gps" && (
          <option value="gps" className="text-black">
            My Location (GPS)
          </option>
        )}
        {CITY_PRESETS.map((c) => (
          <option key={c.id} value={c.id} className="text-black">
            {c.name}, {c.country}
          </option>
        ))}
      </select>
      <button
        type="button"
        onClick={handleGeolocate}
        title="Use my GPS location"
        aria-label="Use my GPS location"
        className="inline-flex items-center gap-1 text-[11px] font-semibold opacity-80 hover:opacity-100 cursor-pointer shrink-0"
        style={{ color: "var(--accent-primary)" }}
      >
        <LocateFixed className="w-3.5 h-3.5" />
        GPS
      </button>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col">
      {/* Top Glass Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: "var(--bg-surface-elevated)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-3">
          {/* Brand */}
          <Link href="/" className="flex items-center gap-2.5 min-w-0">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center border"
              style={{
                backgroundColor: "var(--accent-soft)",
                borderColor: "var(--border-hairline)",
                color: "var(--accent-primary)",
              }}
            >
              {/* Subtle 8-point Islamic Star (Octagram) */}
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6">
                <rect x="5" y="5" width="14" height="14" rx="1" />
                <rect x="5" y="5" width="14" height="14" rx="1" transform="rotate(45 12 12)" />
                <circle cx="12" cy="12" r="2.2" fill="currentColor" />
              </svg>
            </div>
            <div className="min-w-0">
              <div className="text-sm sm:text-base font-bold tracking-tight leading-none truncate">
                {t(lang, "appName")}
              </div>
              <div className="hidden sm:block text-[11px] leading-tight mt-0.5" style={{ color: "var(--text-muted)" }}>
                {t(lang, "tagline")}
              </div>
            </div>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* City Selector (desktop) */}
            <div className="hidden md:block">{cityPicker}</div>

            {/* 5-Language Switcher */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Globe className="hidden sm:block w-3.5 h-3.5" style={{ color: "var(--accent-secondary)" }} />
              <select
                aria-label="Select Language"
                value={lang}
                onChange={(e) => setLang(e.target.value as LangCode)}
                className="bg-transparent outline-none cursor-pointer font-medium max-w-[72px] sm:max-w-none"
              >
                {LANGUAGES.map((l) => (
                  <option key={l.code} value={l.code} className="text-black">
                    {l.nativeLabel}
                  </option>
                ))}
              </select>
            </div>

            {/* Theme Toggle */}
            <button
              type="button"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
              aria-label="Toggle Obsidian Dark / Alabaster Light Theme"
              className="p-2 rounded-xl border cursor-pointer transition-colors"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {/* Progressive Account Pill (Zero Login Wall) */}
            {user ? (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-primary)",
                }}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span className="hidden sm:inline max-w-[120px] truncate">{user.name}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                <UserRound className="w-3.5 h-3.5 sm:hidden" />
                <span className="hidden sm:inline">{t(lang, "saveProgress")}</span>
              </button>
            )}
          </div>
        </div>

        {/* Mobile city row */}
        <div className="md:hidden px-4 pb-2">{cityPicker}</div>

        {/* Desktop Sub-Nav Strip */}
        <nav
          aria-label="Primary Navigation"
          className="border-t overflow-x-auto"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-1.5 py-2">
            {navItems.map((item) => {
              const active = pathname === item.href;
              const Icon = item.icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all"
                  style={{
                    backgroundColor: active ? "var(--accent-soft)" : "transparent",
                    color: active ? "var(--accent-primary)" : "var(--text-muted)",
                    border: active ? "1px solid var(--border-hairline)" : "1px solid transparent",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>
        </nav>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 pb-24 md:pb-10">
        {hydrated ? children : <PageSkeleton />}
      </main>

      <PrayerAlerts />

      {/* Desktop Footer */}
      <footer
        className="hidden md:block border-t py-4 text-xs"
        style={{ borderColor: "var(--border-hairline)", color: "var(--text-muted)" }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-4">
          <span>
            Auliya Calendar &amp; Sunni Companion • Hanafi Madhhab (Mithlayn Asr) • Kanzul Iman • Bahar-e-Shariat
          </span>
          <span>Offline-First • Saved privately on your device</span>
        </div>
      </footer>

      {/* Mobile Bottom Navigation Bar (4 primary + More sheet) */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 flex items-center justify-around"
        style={{
          backgroundColor: "var(--bg-surface-elevated)",
          borderColor: "var(--border-hairline)",
        }}
      >
        {navItems.slice(0, 4).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setMobileMoreOpen(false)}
              className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-medium"
              style={{
                color: active ? "var(--accent-primary)" : "var(--text-muted)",
              }}
            >
              <Icon className="w-4 h-4" />
              <span className="truncate max-w-[60px]">{item.label}</span>
            </Link>
          );
        })}
        <button
          type="button"
          onClick={() => setMobileMoreOpen((v) => !v)}
          aria-expanded={mobileMoreOpen}
          className="flex flex-col items-center gap-0.5 px-2 py-1 rounded-xl text-[10px] font-medium cursor-pointer"
          style={{
            color: mobileMoreOpen ? "var(--accent-primary)" : "var(--text-muted)",
          }}
        >
          <LayoutGrid className="w-4 h-4" />
          <span>More</span>
        </button>
      </nav>

      {/* Mobile All-Modules Drawer */}
      {mobileMoreOpen && (
        <div
          className="md:hidden fixed inset-0 z-30 bg-black/50 backdrop-blur-xs flex items-end pb-16 p-3"
          onClick={() => setMobileMoreOpen(false)}
        >
          <div
            className="bento-card w-full p-4 space-y-3"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                All Modules
              </span>
              <button
                type="button"
                onClick={() => setMobileMoreOpen(false)}
                className="p-1 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
                aria-label="Close menu"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {navItems.map((item) => {
                const active = pathname === item.href;
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileMoreOpen(false)}
                    className="flex flex-col items-center justify-center gap-1.5 p-3 rounded-xl border text-center text-[11px] font-medium"
                    style={{
                      borderColor: active ? "var(--accent-primary)" : "var(--border-hairline)",
                      backgroundColor: active ? "var(--accent-soft)" : "var(--bg-muted)",
                      color: active ? "var(--accent-primary)" : "var(--text-primary)",
                    }}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="leading-tight">{item.label}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Progressive Account Merge Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bento-card max-w-md w-full p-6 relative">
            <button
              type="button"
              onClick={() => setAuthModalOpen(false)}
              className="absolute top-4 end-4 p-1.5 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            {user ? (
              <div className="space-y-4">
                <h2 className="text-lg font-bold">Your Profile</h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Assalamu Alaikum, <strong>{user.name}</strong>
                  {user.email ? ` (${user.email})` : ""}. Your {streakDays}-day streak, Jamaat settings, Qaza
                  counts and Zakat details are saved privately on this device.
                </p>
                <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                  Tip: clearing your browser data will erase this progress. Cloud backup will be available in a
                  future update.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    signOutUser();
                    setAuthModalOpen(false);
                  }}
                  className="w-full py-2.5 rounded-xl text-sm font-semibold border cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  Remove Profile Name (keep progress)
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
                className="space-y-3"
              >
                <div>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    No sign-up required
                  </span>
                  <h2 className="text-lg font-bold mt-1">Create Your Profile</h2>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Everything works without an account. Add your name to personalise greetings. Your data stays
                    private on this device — nothing is uploaded.
                  </p>
                </div>
                <input
                  type="text"
                  required
                  maxLength={40}
                  placeholder="Your name"
                  value={nameInput}
                  onChange={(e) => setNameInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm bg-transparent outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
                <input
                  type="email"
                  placeholder="Email (optional, stored on this device only)"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border text-sm bg-transparent outline-none"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl text-sm font-semibold text-white cursor-pointer"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                >
                  Save Profile
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
    <div className="grid gap-4 md:grid-cols-3 animate-pulse" aria-busy="true" aria-label="Loading">
      {[0, 1, 2, 3, 4, 5].map((i) => (
        <div key={i} className="bento-card h-40" style={{ opacity: 0.5 }} />
      ))}
    </div>
  );
}
