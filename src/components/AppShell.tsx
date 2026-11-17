"use client";

import React, { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
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
  HeartHandshake,
  Sun,
  Moon,
  MapPin,
  Globe,
  Palette,
  UserCheck,
  UserRound,
  LocateFixed,
  ArrowLeft,
  LayoutGrid,
  X,
  Search,
  Loader2,
  CloudSun,
  Check,
  Flame,
  KeyRound,
  LogOut,
  Award,
} from "lucide-react";
import { PrayerAlerts } from "./PrayerAlerts";
import { useApp } from "@/lib/store";
import { LANGUAGES, LangCode, t } from "@/lib/i18n";
import { SANCTUARY_THEMES, ThemeId } from "@/lib/themes";
import { ModuleIconKey, RBAC_ROLES, UserRole } from "@/lib/backend-types";
import {
  GeocodedLocation,
  getAllWorldTimezones,
  getAqiCategory,
  getTimezoneOffsetInfo,
  searchWorldLocations,
} from "@/lib/location-weather";

const ICON_MAP: Record<ModuleIconKey, React.ComponentType<{ className?: string }>> = {
  BookOpen,
  Clock,
  Sparkles,
  Compass,
  Trophy,
  Scale,
  Calculator,
  HeartHandshake,
  ShieldCheck,
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const {
    themeMeta,
    setTheme,
    toggleDarkLight,
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
    authUser,
    backend,
    registerAccount,
    loginAccount,
    switchDemoRole,
    logoutAccount,
    updateMyAccount,
    totalXp,
    currentRank,
    rankProgressPct,
    xpToast,
    streakDays,
    hydrated,
  } = useApp();

  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authTab, setAuthTab] = useState<"signin" | "register" | "demo">("signin");
  const [themeModalOpen, setThemeModalOpen] = useState(false);
  const [switcherOpen, setSwitcherOpen] = useState(false);

  // Auth form fields
  const [nameInput, setNameInput] = useState("");
  const [emailInput, setEmailInput] = useState("");
  const [passwordInput, setPasswordInput] = useState("");
  const [cityInput, setCityInput] = useState("");
  const [requestedRole, setRequestedRole] = useState<"member" | "creator">("member");
  const [authBusy, setAuthBusy] = useState(false);
  const [authErr, setAuthErr] = useState<string | null>(null);
  const [profileTitleInput, setProfileTitleInput] = useState("");

  // Global City Search inside Drawer
  const [locQuery, setLocQuery] = useState("");
  const [locResults, setLocResults] = useState<GeocodedLocation[]>([]);
  const [searchingLoc, setSearchingLoc] = useState(false);

  const isDashboard = pathname === "/" || pathname === "";

  const allTimezones = useMemo(() => getAllWorldTimezones(), []);
  const activeTz = city.tz || "UTC";
  const activeTzOffset = useMemo(() => getTimezoneOffsetInfo(activeTz).label, [activeTz]);
  const aqiMeta = useMemo(() => getAqiCategory(weather?.usAqi ?? null), [weather?.usAqi]);

  // Dynamic Navigation Items built directly from Modular Backend Registry
  const navItems = useMemo(() => {
    const homeItem = {
      id: "home",
      href: "/",
      label: t(lang, "navHome"),
      shortLabel: t(lang, "navHome").split(" ")[0],
      desc: t(lang, "tagline"),
      icon: Home,
      showInBottomNav: true,
    };

    const dynamicItems = backend.modules
      .filter((m) => m.enabled)
      .sort((a, b) => a.order - b.order)
      .map((m) => {
        const translated = m.customTitle?.trim() || t(lang, m.i18nTitleKey);
        return {
          id: m.id,
          href: m.href,
          label: translated,
          shortLabel: translated.split(" ")[0],
          desc: m.subtitleTemplate,
          icon: ICON_MAP[m.iconKey] || Compass,
          showInBottomNav: m.showInBottomNav,
        };
      });

    return [homeItem, ...dynamicItems];
  }, [backend.modules, lang]);

  const bottomNavItems = useMemo(() => {
    const pinned = navItems.filter((n) => n.showInBottomNav).slice(0, 4);
    return pinned.length > 0 ? pinned : navItems.slice(0, 4);
  }, [navItems]);

  const activeModule = navItems.find(
    (item) => item.href !== "/" && pathname.startsWith(item.href)
  );

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

  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthErr(null);
    setAuthBusy(true);
    try {
      if (authTab === "register") {
        await registerAccount({
          name: nameInput,
          email: emailInput,
          password: passwordInput,
          city: cityInput || city.name,
          requestedRole,
        });
      } else {
        await loginAccount({
          email: emailInput,
          password: passwordInput,
        });
      }
      setPasswordInput("");
      setAuthModalOpen(false);
    } catch (err) {
      setAuthErr(err instanceof Error ? err.message : "Authentication failed");
    } finally {
      setAuthBusy(false);
    }
  };

  const handleQuickRoleSwitch = async (role: UserRole) => {
    setAuthErr(null);
    setAuthBusy(true);
    try {
      await switchDemoRole(role);
      setAuthModalOpen(false);
    } catch (err) {
      setAuthErr(err instanceof Error ? err.message : "Could not switch role");
    } finally {
      setAuthBusy(false);
    }
  };

  const activeRoleMeta = authUser ? RBAC_ROLES[authUser.role] : null;

  return (
    <div className="min-h-dvh flex flex-col pb-16 sm:pb-6 relative z-10">
      {/* Floating Gamified +XP Celebration Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            key={xpToast.id}
            initial={{ opacity: 0, y: -28, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -18, scale: 0.92 }}
            transition={{ type: "spring", stiffness: 420, damping: 26 }}
            className="fixed top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full flex items-center gap-2.5 shadow-xl pointer-events-none"
            style={{
              backgroundImage: "var(--gradient-brand)",
              color: "#ffffff",
            }}
            role="status"
            aria-live="polite"
          >
            <Award className="w-4 h-4 shrink-0 text-amber-200" />
            <span className="text-xs font-extrabold tracking-wide">+{xpToast.xp} XP</span>
            <span className="text-xs font-medium opacity-95">• {xpToast.label}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* App Header */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl transition-colors border-b"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-canvas) 84%, transparent)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="max-w-5xl mx-auto px-4 sm:px-6 h-14 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Menu or Back Arrow + Dynamic Title */}
          <div className="flex items-center gap-2.5 min-w-0">
            {isDashboard ? (
              <button
                type="button"
                onClick={() => setSwitcherOpen(true)}
                aria-label="Open modules, GPS and timezone drawer"
                className="w-9 h-9 rounded-xl flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-hairline)",
                  color: "var(--text-primary)",
                }}
              >
                <svg width="20" height="15" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
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
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-hairline)",
                  color: "var(--text-primary)",
                }}
              >
                <ArrowLeft className="w-4 h-4" />
              </Link>
            )}

            <Link href="/" className="min-w-0">
              <span className="text-base sm:text-lg font-bold tracking-tight truncate block">
                {!isDashboard && activeModule
                  ? activeModule.label
                  : t(lang, "appName")}
              </span>
            </Link>
          </div>

          {/* Right: GPS/Weather Pill + Theme/Language Studio + Spiritual Rank + Account/RBAC */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Live Location & Weather Pill */}
            <button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-hairline)",
              }}
              title={`Location: ${city.name} (${activeTz}, ${activeTzOffset})`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
              <span className="truncate max-w-[105px] font-semibold" style={{ color: "var(--text-primary)" }}>
                {city.name}
              </span>
              {weather && (
                <span
                  className="hidden md:inline-flex items-center gap-1 pl-1.5 ml-1 border-l text-[11px] font-semibold tabular-nums"
                  style={{ borderColor: "var(--border-hairline)", color: "var(--accent-gold)" }}
                >
                  <CloudSun className="w-3 h-3" />
                  {Math.round(weather.temperatureC)}°C
                  {weather.usAqi !== null && (
                    <span
                      className="px-1.5 py-0.2 rounded-full text-[9px]"
                      style={{ backgroundColor: aqiMeta.bg, color: aqiMeta.color }}
                    >
                      AQI {weather.usAqi}
                    </span>
                  )}
                </span>
              )}
            </button>

            {/* Spiritual XP & Rank Pill */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              title={`${currentRank.title} (${totalXp} XP • ${rankProgressPct}% to next rank)`}
              className="hidden lg:inline-flex items-center gap-1.5 px-2.5 py-1.5 rounded-full text-[11px] font-bold cursor-pointer transition-transform active:scale-95"
              style={{
                backgroundColor: "var(--accent-soft)",
                color: "var(--accent-primary)",
                border: "1px solid color-mix(in srgb, var(--accent-primary) 30%, transparent)",
              }}
            >
              <Flame className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
              <span className="tabular-nums">{totalXp.toLocaleString()} XP</span>
              <span className="opacity-75">• Lv.{currentRank.level}</span>
            </button>

            {/* Complete Theme & Language Studio Button */}
            <button
              type="button"
              onClick={() => setThemeModalOpen(true)}
              aria-label="Open Theme and Language Studio"
              title={`${themeMeta.name} • ${lang.toUpperCase()}`}
              className="h-9 px-2.5 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-hairline)",
                color: "var(--text-primary)",
              }}
            >
              <Palette className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
              <span className="text-[11px] font-bold uppercase tracking-wider">{lang}</span>
            </button>

            {/* Quick Dark/Light Toggle */}
            <button
              type="button"
              onClick={toggleDarkLight}
              aria-label="Toggle Dark or Light Mode"
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-85"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-hairline)",
              }}
            >
              {themeMeta.mode === "dark" ? (
                <Sun className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
              ) : (
                <Moon className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
              )}
            </button>

            {/* User Account & RBAC Role Pill */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              aria-label={user ? `Account: ${user.name}` : "Sign in or Create Account"}
              className="h-9 pl-1.5 pr-2.5 rounded-full inline-flex items-center gap-1.5 text-xs font-bold text-white cursor-pointer shrink-0 shadow-sm"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              <span className="w-6 h-6 rounded-full bg-black/25 flex items-center justify-center text-[11px]">
                {user ? user.name.slice(0, 1).toUpperCase() : <UserRound className="w-3.5 h-3.5" />}
              </span>
              <span className="hidden md:inline max-w-[92px] truncate">
                {activeRoleMeta ? activeRoleMeta.label : user ? user.name.split(" ")[0] : t(lang, "signIn")}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Module Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-4 sm:px-6 py-3 sm:py-5 flex flex-col">
        {hydrated ? children : <PageSkeleton />}
      </main>

      {/* Mobile Bottom Dock Bar (Driven by Modular Backend Registry) */}
      <nav
        aria-label="Primary Mobile Navigation"
        className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-xl"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-surface) 92%, transparent)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="grid grid-cols-5 h-14 max-w-md mx-auto px-2">
          {bottomNavItems.map((item) => {
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
                <span className="truncate max-w-[60px]">{item.shortLabel}</span>
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

      {/* 1. Complete 8-Theme & 10-Language Studio Modal */}
      <AnimatePresence>
        {themeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4"
            onClick={() => setThemeModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ type: "spring", stiffness: 360, damping: 28 }}
              className="bento-card w-full max-w-2xl p-5 sm:p-6 space-y-5 max-h-[88dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <div
                    className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider"
                    style={{ color: "var(--accent-primary)" }}
                  >
                    <Palette className="w-3.5 h-3.5" />
                    <span>{t(lang, "themeStudio")}</span>
                  </div>
                  <h2 className="text-lg sm:text-xl font-bold mt-0.5">
                    8 Sanctuary Palettes &amp; 10 World Languages
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setThemeModalOpen(false)}
                  aria-label="Close Theme and Language Studio"
                  className="w-8 h-8 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 8 Curated Sanctuary Themes */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span>{t(lang, "chooseTheme")}</span>
                  <span style={{ color: "var(--text-muted)" }}>
                    Active: {themeMeta.name} ({themeMeta.mode.toUpperCase()})
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SANCTUARY_THEMES.map((th) => {
                    const selected = th.id === themeMeta.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setTheme(th.id as ThemeId)}
                        className="p-3 rounded-2xl border text-left flex items-center justify-between gap-3 cursor-pointer transition-transform active:scale-[0.99]"
                        style={{
                          borderColor: selected ? "var(--accent-primary)" : "var(--border-hairline)",
                          backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          {/* Live 4-Quadrant Color Swatch */}
                          <div
                            className="w-10 h-10 rounded-xl shrink-0 grid grid-cols-2 overflow-hidden border"
                            style={{ borderColor: "rgba(255,255,255,0.18)" }}
                          >
                            <span style={{ backgroundColor: th.swatches.canvas }} />
                            <span style={{ backgroundColor: th.swatches.surface }} />
                            <span style={{ backgroundColor: th.swatches.primary }} />
                            <span style={{ backgroundColor: th.swatches.gold }} />
                          </div>
                          <div className="min-w-0">
                            <div className="flex items-center gap-1.5">
                              <span className="font-bold text-xs sm:text-sm truncate">{th.name}</span>
                              <span
                                className="text-[9px] px-1.5 py-0.5 rounded-full font-bold uppercase"
                                style={{
                                  backgroundColor: "var(--bg-surface)",
                                  color: "var(--text-muted)",
                                }}
                              >
                                {th.mode}
                              </span>
                            </div>
                            <div className="text-[11px] truncate" style={{ color: "var(--text-muted)" }}>
                              {th.subtitle} • <span className="font-arabic">{th.arabicTitle}</span>
                            </div>
                          </div>
                        </div>
                        {selected && (
                          <span
                            className="w-6 h-6 rounded-full flex items-center justify-center text-white shrink-0"
                            style={{ backgroundImage: "var(--gradient-brand)" }}
                          >
                            <Check className="w-3.5 h-3.5" />
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 10 Complete World Languages */}
              <div className="space-y-2.5 pt-2 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                    <span>{t(lang, "chooseLanguage")} (Auto RTL / LTR)</span>
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>{LANGUAGES.length} Languages</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  {LANGUAGES.map((l) => {
                    const active = l.code === lang;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setLang(l.code)}
                        className="p-2.5 rounded-xl border text-left cursor-pointer transition-all"
                        style={{
                          borderColor: active ? "var(--accent-primary)" : "var(--border-hairline)",
                          backgroundColor: active ? "var(--accent-soft)" : "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-bold text-xs truncate ${l.fontClass}`}>
                            {l.nativeLabel}
                          </span>
                          <span className="text-[9px] font-mono uppercase opacity-70">{l.dir}</span>
                        </div>
                        <div className="text-[10px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                          {l.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Navigation, Live GPS & World Timezones Drawer */}
      <AnimatePresence>
        {switcherOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/65 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4"
            onClick={() => setSwitcherOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              className="bento-card w-full max-w-2xl p-5 sm:p-6 space-y-5 max-h-[88dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between gap-2">
                <div>
                  <p className="text-xs font-medium" style={{ color: "var(--text-muted)" }}>
                    Modular Sanctuary Navigation • Live GPS &amp; World Timezones
                  </p>
                  <h2 className="text-lg font-bold">{t(lang, "companionModules")}</h2>
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
              <div
                className="space-y-3 p-3.5 rounded-2xl border"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
                    <div>
                      <span className="font-bold">
                        {city.name}, {city.country}
                      </span>
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
                    {gpsLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <LocateFixed className="w-3.5 h-3.5" />
                    )}
                    <span>{gpsLoading ? "Detecting GPS…" : "Use Live GPS & Timezone"}</span>
                  </button>
                </div>

                {gpsError && <p className="text-[11px] text-amber-400">{gpsError}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label
                      className="block text-[11px] font-semibold mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      World Timezone ({allTimezones.length} IANA Zones)
                    </label>
                    <select
                      aria-label="Select World Timezone"
                      value={activeTz}
                      onChange={(e) => setTimezone(e.target.value, true)}
                      className="ui-select w-full px-3 py-2 rounded-xl border font-semibold outline-none cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-surface)",
                      }}
                    >
                      {allTimezones.map((tOpt) => (
                        <option key={tOpt.tz} value={tOpt.tz} className="text-black">
                          ({tOpt.utcOffsetLabel}) {tOpt.tz.replace(/_/g, " ")}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className="block text-[11px] font-semibold mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {t(lang, "chooseLanguage")}
                    </label>
                    <select
                      aria-label="Select Language"
                      value={lang}
                      onChange={(e) => setLang(e.target.value as LangCode)}
                      className="ui-select w-full px-3 py-2 rounded-xl border font-semibold outline-none cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-surface)",
                      }}
                    >
                      {LANGUAGES.map((l) => (
                        <option key={l.code} value={l.code} className="text-black">
                          {l.nativeLabel} — {l.label} ({l.dir.toUpperCase()})
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="text"
                    value={locQuery}
                    onChange={(e) => handleSearchLocations(e.target.value)}
                    placeholder="Search any city worldwide (auto-sets coordinates & timezone)…"
                    className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs outline-none"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  />
                  {searchingLoc && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin absolute right-3 top-1/2 -translate-y-1/2" />
                  )}
                </div>

                {locResults.length > 0 && (
                  <div
                    className="max-h-40 overflow-y-auto divide-y rounded-xl border"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  >
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
                          {loc.admin1 ? `, ${loc.admin1}` : ""} —{" "}
                          <span style={{ color: "var(--text-muted)" }}>{loc.country}</span>
                        </div>
                        <span
                          className="text-[10px] font-mono"
                          style={{ color: "var(--accent-primary)" }}
                        >
                          {loc.tz}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Dynamic Backend-Driven Module Cards */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {navItems.map((item) => {
                  const active =
                    item.href === "/" ? isDashboard : pathname.startsWith(item.href);
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
                        <div
                          className="text-[11px] line-clamp-1 mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {item.desc}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 3. Complete Account, Self-Registration & RBAC Role Portal Modal */}
      <AnimatePresence>
        {authModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4"
            onClick={() => setAuthModalOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="bento-card max-w-lg w-full p-6 relative space-y-4 max-h-[90dvh] overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setAuthModalOpen(false)}
                className="absolute top-4 end-4 p-1.5 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
                aria-label="Close account modal"
              >
                <X className="w-4 h-4" />
              </button>

              {authUser ? (
                <div className="space-y-4">
                  <div className="flex items-center gap-3.5">
                    <div
                      className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-md"
                      style={{ backgroundImage: "var(--gradient-brand)" }}
                    >
                      <UserCheck className="w-6 h-6" />
                    </div>
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <h2 className="text-lg font-bold truncate">{authUser.name}</h2>
                        {activeRoleMeta && (
                          <span
                            className="text-[10px] px-2 py-0.5 rounded-full font-bold text-white"
                            style={{ backgroundColor: activeRoleMeta.badgeColor }}
                          >
                            {activeRoleMeta.label}
                          </span>
                        )}
                      </div>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {authUser.email} • {streakDays}-Day Streak
                      </p>
                    </div>
                  </div>

                  {/* Spiritual Rank Progress Card */}
                  <div
                    className="p-3.5 rounded-2xl border space-y-2"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">
                        Lv.{currentRank.level} {currentRank.title}{" "}
                        <span className="font-arabic opacity-80">({currentRank.arabicTitle})</span>
                      </span>
                      <span className="font-mono font-bold" style={{ color: "var(--accent-gold)" }}>
                        {totalXp.toLocaleString()} XP
                      </span>
                    </div>
                    <div className="h-2 rounded-full overflow-hidden bg-black/25">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${rankProgressPct}%`,
                          backgroundImage: "var(--gradient-brand)",
                        }}
                      />
                    </div>
                    <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      {activeRoleMeta?.description}
                    </p>
                  </div>

                  {/* Quick Edit Profile Title */}
                  <form
                    onSubmit={async (e) => {
                      e.preventDefault();
                      if (!profileTitleInput.trim()) return;
                      await updateMyAccount({ title: profileTitleInput.trim() });
                      setProfileTitleInput("");
                    }}
                    className="flex gap-2 text-xs"
                  >
                    <input
                      type="text"
                      value={profileTitleInput}
                      onChange={(e) => setProfileTitleInput(e.target.value)}
                      placeholder={`Update title (current: ${authUser.title})`}
                      className="flex-1 px-3 py-2 rounded-xl border bg-transparent outline-none"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                    <button
                      type="submit"
                      className="px-3.5 py-2 rounded-xl font-semibold border cursor-pointer"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-elevated)",
                      }}
                    >
                      Save
                    </button>
                  </form>

                  {/* Instant RBAC Role Switcher */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-bold uppercase tracking-wider" style={{ color: "var(--text-muted)" }}>
                      Quick Switch RBAC Role (Demo &amp; Testing)
                    </div>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {(["super_admin", "editor", "creator", "member"] as UserRole[]).map((r) => {
                        const meta = RBAC_ROLES[r];
                        const isCurrent = authUser.role === r;
                        return (
                          <button
                            key={r}
                            type="button"
                            disabled={authBusy}
                            onClick={() => handleQuickRoleSwitch(r)}
                            className="p-2.5 rounded-xl border text-left cursor-pointer transition-opacity hover:opacity-90"
                            style={{
                              borderColor: isCurrent ? meta.badgeColor : "var(--border-hairline)",
                              backgroundColor: isCurrent ? "var(--accent-soft)" : "var(--bg-elevated)",
                            }}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>{meta.label}</span>
                              {isCurrent && <Check className="w-3.5 h-3.5" />}
                            </div>
                            <div className="text-[10px] opacity-75 font-urdu">{meta.arabicBadge}</div>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="flex gap-2 pt-2">
                    <Link
                      href="/admin"
                      onClick={() => setAuthModalOpen(false)}
                      className="btn-primary flex-1 py-2.5 rounded-xl text-xs font-bold text-center inline-flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-4 h-4" />
                      <span>Open RBAC Control Center</span>
                    </Link>
                    <button
                      type="button"
                      onClick={async () => {
                        await logoutAccount();
                        setAuthModalOpen(false);
                      }}
                      className="px-4 py-2.5 rounded-xl text-xs font-semibold border inline-flex items-center gap-1.5 cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      <LogOut className="w-3.5 h-3.5" />
                      <span>{t(lang, "signOut")}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-4">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                      Sanctuary Identity &amp; RBAC Access
                    </p>
                    <h2 className="text-xl font-bold mt-0.5">
                      {authTab === "register"
                        ? t(lang, "createAccount")
                        : authTab === "demo"
                        ? "1-Click RBAC Role Access"
                        : t(lang, "signIn")}
                    </h2>
                  </div>

                  {/* Tab Pills */}
                  <div
                    className="grid grid-cols-3 p-1 rounded-xl border text-xs font-semibold"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    {(
                      [
                        { id: "signin", label: t(lang, "signIn") },
                        { id: "register", label: t(lang, "createAccount") },
                        { id: "demo", label: "RBAC Demo" },
                      ] as const
                    ).map((tb) => (
                      <button
                        key={tb.id}
                        type="button"
                        onClick={() => {
                          setAuthTab(tb.id);
                          setAuthErr(null);
                        }}
                        className="py-2 rounded-lg cursor-pointer transition-all"
                        style={{
                          backgroundImage: authTab === tb.id ? "var(--gradient-brand)" : undefined,
                          color: authTab === tb.id ? "#ffffff" : "var(--text-muted)",
                        }}
                      >
                        {tb.label}
                      </button>
                    ))}
                  </div>

                  {authErr && (
                    <div className="p-2.5 rounded-xl bg-red-500/15 border border-red-500/30 text-xs text-red-300">
                      {authErr}
                    </div>
                  )}

                  {authTab === "demo" ? (
                    <div className="space-y-2.5 text-xs">
                      <p style={{ color: "var(--text-muted)" }}>
                        Instantly sign in as any RBAC tier to manage Auliya profiles, Urs events, Modular Dashboard cards, or Super Admin settings:
                      </p>
                      {(["super_admin", "editor", "creator", "member"] as UserRole[]).map((r) => {
                        const meta = RBAC_ROLES[r];
                        return (
                          <button
                            key={r}
                            type="button"
                            disabled={authBusy}
                            onClick={() => handleQuickRoleSwitch(r)}
                            className="w-full p-3 rounded-xl border text-left flex items-center justify-between gap-3 cursor-pointer hover:opacity-90"
                            style={{
                              borderColor: "var(--border-hairline)",
                              backgroundColor: "var(--bg-elevated)",
                            }}
                          >
                            <div>
                              <div className="font-bold flex items-center gap-2">
                                <KeyRound className="w-3.5 h-3.5" style={{ color: meta.badgeColor }} />
                                <span>{meta.label}</span>
                                <span className="font-urdu text-[11px] opacity-80">({meta.arabicBadge})</span>
                              </div>
                              <p className="text-[11px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                                {meta.description}
                              </p>
                            </div>
                            <span
                              className="px-2.5 py-1 rounded-full text-[10px] font-bold text-white shrink-0"
                              style={{ backgroundColor: meta.badgeColor }}
                            >
                              Enter
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  ) : (
                    <form onSubmit={handleAuthSubmit} className="space-y-3 text-xs">
                      {authTab === "register" && (
                        <>
                          <div>
                            <label className="block font-semibold mb-1">Full Name</label>
                            <input
                              type="text"
                              required
                              maxLength={50}
                              placeholder="e.g., Syed Aamaan Ali"
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none"
                              style={{ borderColor: "var(--border-hairline)" }}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block font-semibold mb-1">City</label>
                              <input
                                type="text"
                                placeholder={city.name}
                                value={cityInput}
                                onChange={(e) => setCityInput(e.target.value)}
                                className="w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none"
                                style={{ borderColor: "var(--border-hairline)" }}
                              />
                            </div>
                            <div>
                              <label className="block font-semibold mb-1">Account Access Tier</label>
                              <select
                                value={requestedRole}
                                onChange={(e) =>
                                  setRequestedRole(e.target.value as "member" | "creator")
                                }
                                className="ui-select w-full px-3 py-2.5 rounded-xl border bg-transparent font-semibold outline-none"
                                style={{ borderColor: "var(--border-hairline)" }}
                              >
                                <option value="member" className="text-black">
                                  Community Member (Personal Sanctuary)
                                </option>
                                <option value="creator" className="text-black">
                                  Curator / Creator (Submit Auliya &amp; Urs)
                                </option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block font-semibold mb-1">Email Address</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com (or admin@auliyacalendar.org)"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">Password</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="Minimum 6 characters (Demo: Admin@786)"
                          value={passwordInput}
                          onChange={(e) => setPasswordInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={authBusy}
                        className="btn-primary w-full py-2.5 rounded-xl text-sm font-bold cursor-pointer disabled:opacity-50"
                      >
                        {authBusy
                          ? "Authenticating…"
                          : authTab === "register"
                          ? `${t(lang, "createAccount")} (+100 XP)`
                          : t(lang, "signIn")}
                      </button>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
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
