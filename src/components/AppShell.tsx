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
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { LANGUAGES, LangCode, t } from "@/lib/i18n";
import { CITY_PRESETS } from "@/lib/prayer-engine";

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, setTheme, lang, setLang, city, setCity, user, signInUser, signOutUser, streakDays } =
    useApp();
  const [authModalOpen, setAuthModalOpen] = useState(false);
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
    if (!navigator.geolocation) return;
    navigator.geolocation.getCurrentPosition((pos) => {
      setCity({
        id: "gps",
        name: "My Location",
        country: "GPS",
        lat: Number(pos.coords.latitude.toFixed(4)),
        lng: Number(pos.coords.longitude.toFixed(4)),
      });
    });
  };

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
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
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
            <div>
              <div className="text-sm sm:text-base font-bold tracking-tight leading-none">
                {t(lang, "appName")}
              </div>
              <div className="text-[11px] leading-tight mt-0.5" style={{ color: "var(--text-muted)" }}>
                {t(lang, "tagline")}
              </div>
            </div>
          </Link>

          {/* Controls */}
          <div className="flex items-center gap-2">
            {/* City Selector */}
            <div
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border text-xs"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <MapPin className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
              <select
                aria-label="Select City"
                value={city.id}
                onChange={(e) => {
                  const found = CITY_PRESETS.find((c) => c.id === e.target.value);
                  if (found) setCity(found);
                }}
                className="bg-transparent outline-none cursor-pointer font-medium"
              >
                {city.id === "gps" && <option value="gps">My Location (GPS)</option>}
                {CITY_PRESETS.map((c) => (
                  <option key={c.id} value={c.id} className="text-black">
                    {c.name}, {c.country}
                  </option>
                ))}
              </select>
              <button
                type="button"
                onClick={handleGeolocate}
                title="Detect GPS Location"
                className="text-[11px] underline opacity-75 hover:opacity-100 cursor-pointer"
              >
                GPS
              </button>
            </div>

            {/* 5-Language Switcher */}
            <div
              className="flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              <Globe className="w-3.5 h-3.5" style={{ color: "var(--accent-secondary)" }} />
              <select
                aria-label="Select Language"
                value={lang}
                onChange={(e) => setLang(e.target.value as LangCode)}
                className="bg-transparent outline-none cursor-pointer font-medium"
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
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--accent-soft)",
                  color: "var(--accent-primary)",
                }}
              >
                <UserCheck className="w-3.5 h-3.5" />
                <span>{user.name}</span>
              </button>
            ) : (
              <button
                type="button"
                onClick={() => setAuthModalOpen(true)}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                <span>{t(lang, "saveProgress")}</span>
              </button>
            )}
          </div>
        </div>

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
        {children}
      </main>

      {/* Mobile Bottom Navigation Bar */}
      <nav
        aria-label="Mobile Bottom Navigation"
        className="md:hidden fixed bottom-0 inset-x-0 z-40 border-t backdrop-blur-xl px-2 py-1.5 flex items-center justify-around"
        style={{
          backgroundColor: "var(--bg-surface-elevated)",
          borderColor: "var(--border-hairline)",
        }}
      >
        {navItems.slice(0, 5).map((item) => {
          const active = pathname === item.href;
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
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
      </nav>

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
                <h2 className="text-lg font-bold">Cloud Sync Active</h2>
                <p className="text-sm" style={{ color: "var(--text-muted)" }}>
                  Signed in as <strong>{user.name}</strong> ({user.email}) via {user.provider}. Your{" "}
                  {streakDays}-day streak, custom Jamaat offsets, and encrypted Zakat ledger are synced.
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
                  Switch to Offline Guest Mode
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div>
                  <span
                    className="text-[11px] font-semibold uppercase tracking-wider"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    Zero-Bounce Progressive Sync
                  </span>
                  <h2 className="text-lg font-bold mt-1">
                    Save Your {streakDays}-Day Streak &amp; Custom Jamaat Offsets
                  </h2>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    Your offline-first local state merges seamlessly with zero data loss.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      signInUser({ name: "Ahmad Raza", email: "apple-user@icloud.com", provider: "Apple" });
                      setAuthModalOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer hover:opacity-90"
                    style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                  >
                    Sign in with Apple
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      signInUser({ name: "Bilal Qadri", email: "bilal@gmail.com", provider: "Google" });
                      setAuthModalOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl border text-xs font-semibold cursor-pointer hover:opacity-90"
                    style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                  >
                    Google OAuth 2.0
                  </button>
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!emailInput.trim()) return;
                    signInUser({
                      name: nameInput.trim() || emailInput.split("@")[0],
                      email: emailInput.trim(),
                      provider: "Email OTP",
                    });
                    setAuthModalOpen(false);
                  }}
                  className="space-y-2.5 pt-2 border-t"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <input
                    type="text"
                    placeholder="Display Name (optional)"
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border text-sm bg-transparent outline-none"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                  <input
                    type="email"
                    required
                    placeholder="Email for Passwordless OTP"
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
                    Merge Local State &amp; Sync
                  </button>
                </form>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
