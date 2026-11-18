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
  KeyRound,
  LogOut,
  Award,
} from "lucide-react";
import { PrayerAlerts } from "./PrayerAlerts";
import { LanguageBridge } from "./LanguageBridge";
import { useApp } from "@/lib/store";
import { getLangMeta, getModuleSubtitle, LANGUAGES, LangCode, t, tp } from "@/lib/i18n";
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
  const activeLangMeta = useMemo(() => getLangMeta(lang), [lang]);

  const allTimezones = useMemo(() => getAllWorldTimezones(), []);
  const activeTz = city.tz || "UTC";
  const activeTzOffset = useMemo(() => getTimezoneOffsetInfo(activeTz).label, [activeTz]);
  const aqiMeta = useMemo(() => getAqiCategory(weather?.usAqi ?? null), [weather?.usAqi]);

  // Navigation items localized cleanly across all 10 languages
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
          desc: getModuleSubtitle(lang, m.id, m.subtitleTemplate),
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
      setAuthErr(err instanceof Error ? err.message : "Could not switch profile");
    } finally {
      setAuthBusy(false);
    }
  };

  const activeRoleMeta = authUser ? RBAC_ROLES[authUser.role] : null;

  return (
    <div className="min-h-dvh flex flex-col pb-[calc(4rem+env(safe-area-inset-bottom))] sm:pb-8 relative z-10">
      {/* Subtle Celebration Toast */}
      <AnimatePresence>
        {xpToast && (
          <motion.div
            key={xpToast.id}
            initial={{ opacity: 0, y: -24, scale: 0.94 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -14, scale: 0.94 }}
            transition={{ type: "spring", stiffness: 400, damping: 28 }}
            className="fixed top-14 sm:top-16 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full flex items-center gap-2 shadow-xl pointer-events-none"
            style={{
              backgroundImage: "var(--gradient-brand)",
              color: "#ffffff",
            }}
            role="status"
            aria-live="polite"
          >
            <Award className="w-4 h-4 shrink-0 text-amber-200" />
            <span className="text-xs font-semibold">{tp(lang, xpToast.label)}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Calm Reference-Grade Top Bar */}
      <header
        className="sticky top-0 z-40 backdrop-blur-xl transition-colors border-b pt-[env(safe-area-inset-top)]"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-canvas) 88%, transparent)",
          borderColor: "color-mix(in srgb, var(--border-hairline) 75%, transparent)",
        }}
      >
        <div className="max-w-5xl mx-auto px-3 sm:px-6 h-13 sm:h-16 flex items-center justify-between gap-2">
          {/* Left: Staggered Menu Icon or Back Arrow + Localized Title */}
          <div className="flex items-center gap-2.5 sm:gap-3 min-w-0">
            {isDashboard ? (
              <button
                type="button"
                onClick={() => setSwitcherOpen(true)}
                aria-label="Open navigation and location settings"
                className="w-10 h-10 rounded-xl flex items-center justify-center cursor-pointer transition-opacity hover:opacity-80 shrink-0"
                style={{
                  color: "var(--text-muted)",
                }}
              >
                <svg width="21" height="15" viewBox="0 0 22 16" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round">
                  <line x1="2" y1="3" x2="20" y2="3" />
                  <line x1="2" y1="8" x2="13" y2="8" />
                  <line x1="2" y1="13" x2="17" y2="13" />
                </svg>
              </button>
            ) : (
              <Link
                href="/"
                aria-label={t(lang, "navHome")}
                className="w-10 h-10 rounded-xl flex items-center justify-center transition-transform active:scale-95 hover:opacity-80 shrink-0"
                style={{
                  backgroundColor: "var(--bg-surface)",
                  border: "1px solid var(--border-hairline)",
                  color: "var(--text-primary)",
                }}
              >
                <ArrowLeft className="w-4 h-4 rtl-mirror" />
              </Link>
            )}

            <Link href="/" className="min-w-0">
              <span className="text-[15px] sm:text-lg font-bold tracking-tight truncate block">
                {!isDashboard && activeModule ? activeModule.label : t(lang, "appName")}
              </span>
            </Link>
          </div>

          {/* Right: Location Pill + Native Language/Theme Pill + Dark/Light + Avatar */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Location & Weather Pill (Compact on mobile, expanded on desktop) */}
            <button
              type="button"
              onClick={() => setSwitcherOpen(true)}
              className="inline-flex items-center gap-1 sm:gap-1.5 h-9 px-2.5 sm:px-3 rounded-full text-xs font-medium cursor-pointer transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--bg-surface)",
                color: "var(--text-muted)",
                border: "1px solid var(--border-hairline)",
              }}
              title={`${city.name} (${activeTz}, ${activeTzOffset})`}
            >
              <MapPin className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
              <span className="truncate max-w-[68px] sm:max-w-[100px] font-semibold text-[11px] sm:text-xs" style={{ color: "var(--text-primary)" }}>
                {city.name}
              </span>
              {weather && (
                <span
                  className="hidden md:inline-flex items-center gap-1 ps-1.5 ms-0.5 border-s text-[11px] font-semibold tabular-nums"
                  style={{ borderColor: "var(--border-hairline)", color: "var(--accent-gold)" }}
                >
                  <CloudSun className="w-3 h-3" />
                  {Math.round(weather.temperatureC)}°
                  {weather.usAqi !== null && (
                    <span
                      className="px-1.5 py-0.2 rounded-full text-[9px]"
                      style={{ backgroundColor: aqiMeta.bg, color: aqiMeta.color }}
                    >
                      {weather.usAqi}
                    </span>
                  )}
                </span>
              )}
            </button>

            {/* Prominent Native-Script Language & Palette Pill */}
            <button
              type="button"
              onClick={() => setThemeModalOpen(true)}
              aria-label={t(lang, "themeStudio")}
              title={`${activeLangMeta.nativeLabel} • ${themeMeta.name}`}
              className="h-9 px-2.5 sm:px-3 rounded-full inline-flex items-center gap-1.5 cursor-pointer transition-opacity hover:opacity-90"
              style={{
                backgroundColor: "var(--bg-surface)",
                border: "1px solid var(--border-hairline)",
                color: "var(--text-primary)",
              }}
            >
              <Globe className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
              <span
                data-no-translate="true"
                className={`text-xs font-semibold leading-none ${activeLangMeta.fontClass}`}
              >
                {activeLangMeta.shortNative}
              </span>
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0 border border-white/25"
                style={{ backgroundColor: themeMeta.swatches.primary }}
              />
            </button>

            {/* Quick Dark/Light Toggle */}
            <button
              type="button"
              onClick={toggleDarkLight}
              aria-label="Toggle Dark or Light Mode"
              className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer transition-opacity hover:opacity-85 shrink-0"
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

            {/* Sleek User Avatar Pill */}
            <button
              type="button"
              onClick={() => setAuthModalOpen(true)}
              aria-label={user ? user.name : t(lang, "signIn")}
              className="h-9 ps-1 pe-1 sm:pe-3 rounded-full inline-flex items-center gap-1.5 text-xs font-semibold text-white cursor-pointer shrink-0 shadow-sm"
              style={{ backgroundImage: "var(--gradient-brand)" }}
            >
              <span className="w-7 h-7 rounded-full bg-black/25 flex items-center justify-center text-[11px] font-bold">
                {user ? user.name.slice(0, 1).toUpperCase() : <UserRound className="w-3.5 h-3.5" />}
              </span>
              <span className="hidden sm:inline max-w-[88px] truncate">
                {user ? user.name.split(" ")[0] : t(lang, "signIn")}
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Module Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto px-3 sm:px-6 py-2.5 sm:py-6 flex flex-col">
        {hydrated ? children : <PageSkeleton />}
      </main>

      {/* Mobile Bottom Dock Bar (Safe-area aware, ≥44px touch targets) */}
      <nav
        aria-label="Primary Mobile Navigation"
        className="sm:hidden fixed bottom-0 inset-x-0 z-30 border-t backdrop-blur-xl pb-[env(safe-area-inset-bottom)]"
        style={{
          backgroundColor: "color-mix(in srgb, var(--bg-surface) 95%, transparent)",
          borderColor: "var(--border-hairline)",
        }}
      >
        <div className="grid grid-cols-5 h-14 max-w-md mx-auto px-1.5">
          {bottomNavItems.map((item) => {
            const active = item.href === "/" ? isDashboard : pathname.startsWith(item.href);
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className="relative flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold transition-colors min-h-[44px]"
                style={{ color: active ? "var(--accent-primary)" : "var(--text-muted)" }}
              >
                {active && (
                  <span
                    className="absolute top-0 w-7 h-[2.5px] rounded-b-full"
                    style={{ backgroundImage: "var(--gradient-brand)" }}
                  />
                )}
                <Icon className="w-4 h-4 shrink-0" />
                <span className="truncate max-w-[60px] leading-tight">{item.shortLabel}</span>
              </Link>
            );
          })}
          <button
            type="button"
            onClick={() => setSwitcherOpen(true)}
            className="flex flex-col items-center justify-center gap-0.5 text-[10px] font-semibold cursor-pointer min-h-[44px]"
            style={{ color: switcherOpen ? "var(--accent-primary)" : "var(--text-muted)" }}
          >
            <LayoutGrid className="w-4 h-4 shrink-0" />
            <span className="truncate max-w-[60px] leading-tight">{t(lang, "moreLabel")}</span>
          </button>
        </div>
      </nav>

      <PrayerAlerts />
      <LanguageBridge />

      {/* 1. Language & Appearance Studio Modal (Language First!) */}
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
                  <h2 className="text-lg sm:text-xl font-bold">{t(lang, "themeStudio")}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {activeLangMeta.nativeLabel} • {themeMeta.name}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setThemeModalOpen(false)}
                  aria-label={tp(lang, "Close")}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* 10 World Languages (Top Priority) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Globe className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                    <span>{t(lang, "chooseLanguage")}</span>
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>{activeLangMeta.dir.toUpperCase()}</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2" data-no-translate="true">
                  {LANGUAGES.map((l) => {
                    const active = l.code === lang;
                    return (
                      <button
                        key={l.code}
                        type="button"
                        onClick={() => setLang(l.code)}
                        className="p-2.5 rounded-xl border text-start cursor-pointer transition-all"
                        style={{
                          borderColor: active ? "var(--accent-primary)" : "var(--border-hairline)",
                          backgroundColor: active ? "var(--accent-soft)" : "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex items-center justify-between gap-1">
                          <span className={`font-bold text-xs truncate ${l.fontClass}`}>
                            {l.nativeLabel}
                          </span>
                          {active && (
                            <Check className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
                          )}
                        </div>
                        <div className="text-[10px] mt-0.5 truncate" style={{ color: "var(--text-muted)" }}>
                          {l.label}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 8 Curated Sanctuary Themes */}
              <div className="space-y-2.5 pt-3 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="inline-flex items-center gap-1.5">
                    <Palette className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                    <span>{t(lang, "chooseTheme")}</span>
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>{themeMeta.name}</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {SANCTUARY_THEMES.map((th) => {
                    const selected = th.id === themeMeta.id;
                    return (
                      <button
                        key={th.id}
                        type="button"
                        onClick={() => setTheme(th.id as ThemeId)}
                        className="p-3 rounded-2xl border text-start flex items-center justify-between gap-3 cursor-pointer transition-transform active:scale-[0.99]"
                        style={{
                          borderColor: selected ? "var(--accent-primary)" : "var(--border-hairline)",
                          backgroundColor: selected ? "var(--accent-soft)" : "var(--bg-elevated)",
                        }}
                      >
                        <div className="flex items-center gap-3 min-w-0">
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
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 2. Navigation, Live GPS & World Timezone Drawer */}
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
                  <h2 className="text-lg font-bold">{t(lang, "companionModules")}</h2>
                  <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                    {tp(lang, "Location & Timezone")}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setSwitcherOpen(false)}
                  className="w-9 h-9 rounded-full flex items-center justify-center cursor-pointer"
                  style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}
                  aria-label={tp(lang, "Close")}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* GPS + Timezone + City Search */}
              <div
                className="space-y-3 p-3.5 rounded-2xl border"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 shrink-0" style={{ color: "var(--accent-primary)" }} />
                    <div>
                      <span className="font-bold">
                        {city.name}, {city.country}
                      </span>
                      <span className="ms-2 opacity-70 font-mono text-[11px]">
                        ({activeTz} {activeTzOffset})
                      </span>
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => requestGpsLocation()}
                    disabled={gpsLoading}
                    className="btn-primary px-3.5 py-1.5 rounded-full text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                  >
                    {gpsLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <LocateFixed className="w-3.5 h-3.5" />
                    )}
                    <span>{tp(lang, gpsLoading ? "Detecting GPS…" : "Use Live GPS")}</span>
                  </button>
                </div>

                {gpsError && <p className="text-[11px] text-amber-400">{gpsError}</p>}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
                  <div>
                    <label
                      className="block text-[11px] font-semibold mb-1"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {tp(lang, "Location & Timezone")}
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
                          {l.nativeLabel} — {l.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="relative">
                  <Search className="w-3.5 h-3.5 absolute start-3 top-1/2 -translate-y-1/2 opacity-60" />
                  <input
                    type="text"
                    value={locQuery}
                    onChange={(e) => handleSearchLocations(e.target.value)}
                    placeholder={tp(lang, "Search")}
                    className="w-full ps-8 pe-3 py-2 rounded-xl border text-xs outline-none"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-surface)",
                    }}
                  />
                  {searchingLoc && (
                    <Loader2 className="w-3.5 h-3.5 animate-spin absolute end-3 top-1/2 -translate-y-1/2" />
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
                        className="w-full px-3 py-2 text-start text-xs flex items-center justify-between hover:opacity-85 cursor-pointer"
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

              {/* Clean Localized Module Grid */}
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

      {/* 3. Account & Contributor Profiles Modal */}
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
                className="absolute top-4 end-4 p-2 rounded-lg opacity-70 hover:opacity-100 cursor-pointer"
                aria-label={tp(lang, "Close")}
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
                            className="text-[10px] px-2 py-0.5 rounded-full font-semibold text-white"
                            style={{ backgroundColor: activeRoleMeta.badgeColor }}
                          >
                            {tp(lang, activeRoleMeta.label)}
                          </span>
                        )}
                      </div>
                      <p className="text-xs truncate" style={{ color: "var(--text-muted)" }}>
                        {authUser.email} • {streakDays} {t(lang, "streakDays")}
                      </p>
                    </div>
                  </div>

                  {/* Journey Progress */}
                  <div
                    className="p-3.5 rounded-2xl border space-y-2"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-elevated)",
                    }}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold">
                        {currentRank.title}{" "}
                        <span className="font-arabic opacity-80">({currentRank.arabicTitle})</span>
                      </span>
                      <span className="font-mono font-semibold" style={{ color: "var(--accent-gold)" }}>
                        {totalXp.toLocaleString()} pts
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
                      placeholder={authUser.title}
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
                      {tp(lang, "Save")}
                    </button>
                  </form>

                  {/* Contributor Profile Switcher */}
                  <div className="space-y-2 pt-1">
                    <div className="text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
                      {t(lang, "saveProgress")}
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
                            className="p-2.5 rounded-xl border text-start cursor-pointer transition-opacity hover:opacity-90"
                            style={{
                              borderColor: isCurrent ? meta.badgeColor : "var(--border-hairline)",
                              backgroundColor: isCurrent ? "var(--accent-soft)" : "var(--bg-elevated)",
                            }}
                          >
                            <div className="font-bold flex items-center justify-between">
                              <span>{tp(lang, meta.label)}</span>
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
                      <span>{t(lang, "navAdmin")}</span>
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
                    <h2 className="text-xl font-bold">
                      {authTab === "register"
                        ? t(lang, "createAccount")
                        : authTab === "demo"
                        ? t(lang, "navAdmin")
                        : t(lang, "signIn")}
                    </h2>
                    <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
                      {t(lang, "tagline")}
                    </p>
                  </div>

                  {/* Clean Tab Pills */}
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
                        { id: "demo", label: tp(lang, "Curator / Creator") },
                      ] as const
                    ).map((tb) => (
                      <button
                        key={tb.id}
                        type="button"
                        onClick={() => {
                          setAuthTab(tb.id);
                          setAuthErr(null);
                        }}
                        className="py-2 rounded-lg cursor-pointer transition-all truncate px-1"
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
                      {(["super_admin", "editor", "creator", "member"] as UserRole[]).map((r) => {
                        const meta = RBAC_ROLES[r];
                        return (
                          <button
                            key={r}
                            type="button"
                            disabled={authBusy}
                            onClick={() => handleQuickRoleSwitch(r)}
                            className="w-full p-3 rounded-xl border text-start flex items-center justify-between gap-3 cursor-pointer hover:opacity-90"
                            style={{
                              borderColor: "var(--border-hairline)",
                              backgroundColor: "var(--bg-elevated)",
                            }}
                          >
                            <div>
                              <div className="font-bold flex items-center gap-2">
                                <KeyRound className="w-3.5 h-3.5" style={{ color: meta.badgeColor }} />
                                <span>{tp(lang, meta.label)}</span>
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
                              {tp(lang, "Enter")}
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
                            <label className="block font-semibold mb-1">{tp(lang, "Full Name")}</label>
                            <input
                              type="text"
                              required
                              maxLength={50}
                              placeholder="Syed Aamaan Ali"
                              value={nameInput}
                              onChange={(e) => setNameInput(e.target.value)}
                              className="w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none"
                              style={{ borderColor: "var(--border-hairline)" }}
                            />
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                            <div>
                              <label className="block font-semibold mb-1">{tp(lang, "City")}</label>
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
                              <label className="block font-semibold mb-1">{t(lang, "saveProgress")}</label>
                              <select
                                value={requestedRole}
                                onChange={(e) =>
                                  setRequestedRole(e.target.value as "member" | "creator")
                                }
                                className="ui-select w-full px-3 py-2.5 rounded-xl border bg-transparent font-semibold outline-none"
                                style={{ borderColor: "var(--border-hairline)" }}
                              >
                                <option value="member" className="text-black">
                                  {tp(lang, "Community Member")}
                                </option>
                                <option value="creator" className="text-black">
                                  {tp(lang, "Curator / Creator")}
                                </option>
                              </select>
                            </div>
                          </div>
                        </>
                      )}

                      <div>
                        <label className="block font-semibold mb-1">{tp(lang, "Email Address")}</label>
                        <input
                          type="email"
                          required
                          placeholder="you@example.com"
                          value={emailInput}
                          onChange={(e) => setEmailInput(e.target.value)}
                          className="w-full px-3.5 py-2.5 rounded-xl border bg-transparent outline-none"
                          style={{ borderColor: "var(--border-hairline)" }}
                        />
                      </div>

                      <div>
                        <label className="block font-semibold mb-1">{tp(lang, "Password")}</label>
                        <input
                          type="password"
                          required
                          minLength={6}
                          placeholder="••••••••"
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
                          ? tp(lang, "Loading")
                          : authTab === "register"
                          ? t(lang, "createAccount")
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
