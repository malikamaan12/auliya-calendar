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
  ArrowLeft,
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
  const [switcherOpen, setSwitcherOpen] = useState(false);
  const [emailInput, setEmailInput] = useState("");
  const [nameInput, setNameInput] = useState("");

  const isDashboard = pathname === "/" || pathname === "";

  const navItems = [
    { href: "/", label: t(lang, "navHome"), desc: "Main Sanctuary Launcher", icon: Home },
    { href: "/prayer", label: t(lang, "navPrayer"), desc: "Hanafi Azan, Jamaat & Qibla", icon: Clock },
    { href: "/quran", label: t(lang, "navQuran"), desc: "604-Page Mushaf & Kanzul Iman", icon: BookOpen },
    { href: "/tasbih", label: t(lang, "navTasbih"), desc: "Wird, Durood & Haptic Counter", icon: Sparkles },
    { href: "/auliya", label: t(lang, "navAuliya"), desc: "Urs Calendar & 360° Ziyarat", icon: Compass },
    { href: "/fiqh", label: t(lang, "navFiqh"), desc: "Bahar-e-Shariat & Hadith", icon: Scale },
    { href: "/zakat", label: t(lang, "navZakat"), desc: "Hanafi Silver Nisab Calculator", icon: Calculator },
    { href: "/quiz", label: t(lang, "navQuiz"), desc: "15-Tier Sahib-e-Ilm Hot Seat", icon: Trophy },
    { href: "/admin", label: t(lang, "navAdmin"), desc: "Curator & Audit Studio", icon: ShieldCheck },
  ];

  const activeModule = navItems.find((item) => item.href !== "/" && pathname.startsWith(item.href));

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
      className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs min-w-0 min-h-[38px]"
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
        className="bg-transparent outline-none cursor-pointer font-medium min-w-0 flex-1 truncate max-w-[130px] sm:max-w-[160px]"
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
        <span className="hidden sm:inline">GPS</span>
      </button>
    </div>
  );

  return (
    <div className="min-h-dvh flex flex-col">
      {/* Focused Single-Row Top Header */}
      <header
        className="sticky top-0 z-40 border-b backdrop-blur-xl"
        style={{
          backgroundColor: "var(--bg-surface-elevated)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="max-w-7xl mx-auto px-3 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Back to Dashboard when inside a module, or Brand on Dashboard */}
          <div className="flex items-center gap-2 min-w-0">
            {!isDashboard ? (
              <>
                <Link
                  href="/"
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border text-xs font-semibold shrink-0 transition-transform active:scale-95"
                  style={{
                    borderColor: "color-mix(in srgb, var(--accent-primary) 40%, var(--border-hairline))",
                    backgroundColor: "var(--accent-soft)",
                    color: "var(--accent-primary)",
                  }}
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Dashboard</span>
                </Link>

                {activeModule && (
                  <div className="flex items-center gap-2 pl-1 min-w-0">
                    <activeModule.icon
                      className="w-4 h-4 shrink-0 hidden xs:block"
                      style={{ color: "var(--accent-gold)" }}
                    />
                    <span className="text-sm sm:text-base font-bold truncate">
                      {activeModule.label}
                    </span>
                  </div>
                )}
              </>
            ) : (
              <Link href="/" className="flex items-center gap-2.5 min-w-0">
                <div
                  className="w-9 h-9 rounded-xl flex items-center justify-center border shrink-0"
                  style={{
                    backgroundColor: "var(--accent-soft)",
                    borderColor: "var(--border-hairline)",
                    color: "var(--accent-primary)",
                  }}
                >
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
                  <div
                    className="hidden sm:block text-[11px] leading-tight mt-0.5 truncate"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t(lang, "tagline")}
                  </div>
                </div>
              </Link>
            )}
          </div>

          {/* Right Controls */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* City Picker (shown on Dashboard or larger screens) */}
            <div className={isDashboard ? "hidden sm:block" : "hidden lg:block"}>{cityPicker}</div>

            {/* Language Switcher */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs min-h-[38px]"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Globe className="hidden sm:block w-3.5 h-3.5" style={{ color: "var(--accent-secondary)" }} />
              <select
                aria-label="Select Language"
                value={lang}
                onChange={(e) => setLang(e.target.value as LangCode)}
                className="bg-transparent outline-none cursor-pointer font-medium max-w-[68px] sm:max-w-none"
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
              className="p-2 rounded-xl border cursor-pointer transition-colors min-w-[38px] min-h-[38px] flex items-center justify-center"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              {theme === "dark" ? (
                <Sun className="w-4 h-4 text-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-emerald-700" />
              )}
            </button>

            {/* Quick Module Switcher Modal Trigger */}
            <button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              aria-label="Open Module Launcher"
              title="Switch Module"
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl border text-xs font-semibold cursor-pointer min-h-[38px]"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <LayoutGrid className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
              <span className="hidden md:inline">Modules</span>
            </button>

            {/* Profile Button */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              aria-label={user ? `Profile: ${user.name}` : "Save Progress"}
              className="inline-flex items-center gap-1.5 px-2.5 py-2 rounded-xl text-xs font-semibold border cursor-pointer min-h-[38px]"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: user ? "var(--accent-soft)" : "var(--bg-muted)",
                color: user ? "var(--accent-primary)" : "var(--text-primary)",
              }}
            >
              {user ? <UserCheck className="w-4 h-4" /> : <UserRound className="w-4 h-4" />}
              <span className="hidden xl:inline max-w-[100px] truncate">
                {user ? user.name : t(lang, "saveProgress")}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Focused Screen Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-6 py-4 sm:py-6 flex flex-col">
        {hydrated ? children : <PageSkeleton />}
      </main>

      <PrayerAlerts />

      {/* Quick Module Switcher Modal (Accessible from any screen) */}
      {switcherOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={() => setSwitcherOpen(false)}
        >
          <div
            className="bento-card w-full max-w-2xl p-5 space-y-4 max-h-[85dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span
                  className="text-[11px] font-semibold uppercase tracking-wider"
                  style={{ color: "var(--accent-primary)" }}
                >
                  Auliya Companion Launcher
                </span>
                <h2 className="text-base sm:text-lg font-bold">Choose a Module</h2>
              </div>
              <button
                type="button"
                onClick={() => setSwitcherOpen(false)}
                className="p-2 rounded-xl border opacity-80 hover:opacity-100 cursor-pointer"
                style={{ borderColor: "var(--border-hairline)" }}
                aria-label="Close launcher"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="sm:hidden">{cityPicker}</div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
              {navItems.map((item) => {
                const active =
                  item.href === "/"
                    ? isDashboard
                    : pathname.startsWith(item.href);
                const Icon = item.icon;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setSwitcherOpen(false)}
                    className="p-3.5 rounded-2xl border flex flex-col justify-between gap-2 transition-all hover:scale-[1.01]"
                    style={{
                      borderColor: active ? "var(--accent-primary)" : "var(--border-hairline)",
                      backgroundColor: active ? "var(--accent-soft)" : "var(--bg-muted)",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={{
                          backgroundColor: active ? "var(--accent-primary)" : "var(--bg-surface)",
                          color: active ? "#ffffff" : "var(--accent-primary)",
                        }}
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      {active && (
                        <span
                          className="text-[10px] font-bold px-2 py-0.5 rounded-full"
                          style={{ backgroundColor: "var(--accent-primary)", color: "#ffffff" }}
                        >
                          Active
                        </span>
                      )}
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

      {/* Progressive Account Merge Modal */}
      {authModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
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
                <h2 className="text-lg font-bold">Your Profile</h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Assalamu Alaikum, <strong>{user.name}</strong>
                  {user.email ? ` (${user.email})` : ""}. Your {streakDays}-day streak, Jamaat settings, Qaza
                  counts and Zakat details are saved privately on this device.
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
                    private on this device.
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
                  placeholder="Email (optional)"
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
