"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Bookmark,
  Bell,
  Plus,
  Pencil,
  Trash2,
  Search,
  Compass,
  Volume2,
  Copy,
  Check,
  History,
  ChevronLeft,
  ChevronRight,
  GraduationCap,
  Heart,
  Play,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { TASBIH_LITANIES, TasbihLitany } from "@/data/fiqh-hadith";
import {
  CustomChecklistItem,
  DAILY_DUAS_LIBRARY,
  DEFAULT_CHECKLIST_ITEMS,
  DhikrReminderConfig,
  DUA_ACTION_CATEGORIES,
  DuaActionCategory,
  DuaEntry,
  SavedTasbihSession,
  SuggestedWaqtTag,
} from "@/data/duas-adhkar";
import { PrayerName } from "@/lib/prayer-engine";

type ActiveTabId =
  | "counter"
  | "today-dua"
  | "dua-finder"
  | "checklist"
  | "dhikr-creator";

const STORAGE_CUSTOM_LITANIES = "auliya_custom_litanies_v1";
const STORAGE_SAVED_SESSIONS = "auliya_saved_tasbih_sessions_v1";
const STORAGE_REMINDERS = "auliya_dhikr_reminders_v1";
const STORAGE_CHECKLIST_ITEMS = "auliya_custom_checklist_v1";
const STORAGE_LEARNED_DUAS = "auliya_learned_duas_v1";
const STORAGE_FAVORITE_DUAS = "auliya_favorite_duas_v1";

const DEFAULT_REMINDERS: DhikrReminderConfig[] = [
  {
    id: "rem-morning",
    label: "Morning Adhkar & Istighfar",
    litanyId: "astaghfirullah",
    time24h: "06:30",
    enabled: false,
  },
  {
    id: "rem-asr-durood",
    label: "Evening Durood-e-Razawiyya",
    litanyId: "durood-razawiyya",
    time24h: "17:15",
    enabled: false,
  },
  {
    id: "rem-night-tasbih",
    label: "Before Sleep Tasbih-e-Fatima",
    litanyId: "tasbih-fatima",
    time24h: "22:00",
    enabled: false,
  },
];

export default function TasbihPage() {
  const {
    now,
    schedule,
    tasbihTotalToday,
    tasbihTarget,
    activeLitanyId,
    setActiveLitany,
    incrementTasbih,
    resetTasbihToday,
    sunnahChecks,
    toggleSunnah,
    qazaUmriRemaining,
    setQazaUmri,
    decrementQazaUmri,
  } = useApp();

  // Sleek Top Navigation Tab
  const [activeTab, setActiveTab] = useState<ActiveTabId>("counter");

  // Persisted Custom Litanies, Saved Sessions, Reminders, Checklist Items, Learned & Favorite Duas
  const [customLitanies, setCustomLitanies] = useState<TasbihLitany[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_CUSTOM_LITANIES);
      return raw ? (JSON.parse(raw) as TasbihLitany[]) : [];
    } catch {
      return [];
    }
  });

  const [savedSessions, setSavedSessions] = useState<SavedTasbihSession[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_SAVED_SESSIONS);
      return raw ? (JSON.parse(raw) as SavedTasbihSession[]) : [];
    } catch {
      return [];
    }
  });

  const [reminders, setReminders] = useState<DhikrReminderConfig[]>(() => {
    if (typeof window === "undefined") return DEFAULT_REMINDERS;
    try {
      const raw = localStorage.getItem(STORAGE_REMINDERS);
      return raw ? (JSON.parse(raw) as DhikrReminderConfig[]) : DEFAULT_REMINDERS;
    } catch {
      return DEFAULT_REMINDERS;
    }
  });

  const [checklistItems, setChecklistItems] = useState<CustomChecklistItem[]>(() => {
    if (typeof window === "undefined") return DEFAULT_CHECKLIST_ITEMS;
    try {
      const raw = localStorage.getItem(STORAGE_CHECKLIST_ITEMS);
      return raw ? (JSON.parse(raw) as CustomChecklistItem[]) : DEFAULT_CHECKLIST_ITEMS;
    } catch {
      return DEFAULT_CHECKLIST_ITEMS;
    }
  });

  const [learnedDuaIds, setLearnedDuaIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_LEARNED_DUAS);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  const [favoriteDuaIds, setFavoriteDuaIds] = useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      const raw = localStorage.getItem(STORAGE_FAVORITE_DUAS);
      return raw ? (JSON.parse(raw) as string[]) : [];
    } catch {
      return [];
    }
  });

  // Persist changes to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CUSTOM_LITANIES, JSON.stringify(customLitanies));
    } catch {
      // ignore
    }
  }, [customLitanies]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_SAVED_SESSIONS, JSON.stringify(savedSessions));
    } catch {
      // ignore
    }
  }, [savedSessions]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_REMINDERS, JSON.stringify(reminders));
    } catch {
      // ignore
    }
  }, [reminders]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_CHECKLIST_ITEMS, JSON.stringify(checklistItems));
    } catch {
      // ignore
    }
  }, [checklistItems]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_LEARNED_DUAS, JSON.stringify(learnedDuaIds));
    } catch {
      // ignore
    }
  }, [learnedDuaIds]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_FAVORITE_DUAS, JSON.stringify(favoriteDuaIds));
    } catch {
      // ignore
    }
  }, [favoriteDuaIds]);

  // Combined Litanies (Built-in + User-created Custom Dhikr + Active Temporary Dua if selected)
  const [adHocDuaLitany, setAdHocDuaLitany] = useState<TasbihLitany | null>(null);

  const allLitanies = useMemo(() => {
    const base = [...TASBIH_LITANIES, ...customLitanies];
    if (adHocDuaLitany && !base.some((x) => x.id === adHocDuaLitany.id)) {
      return [adHocDuaLitany, ...base];
    }
    return base;
  }, [customLitanies, adHocDuaLitany]);

  const activeLitany = useMemo(
    () => allLitanies.find((l) => l.id === activeLitanyId) || allLitanies[0],
    [allLitanies, activeLitanyId]
  );

  // Counter UI states
  const [soundEnabled, setSoundEnabled] = useState<boolean>(true);
  const [sessionNote, setSessionNote] = useState<string>("");
  const [showSaveDrawer, setShowSaveDrawer] = useState<boolean>(false);
  const [showReminderDrawer, setShowReminderDrawer] = useState<boolean>(false);
  const [toastBanner, setToastBanner] = useState<string | null>(null);

  // Reminder Creator state
  const [newRemLabel, setNewRemLabel] = useState<string>("");
  const [newRemTime, setNewRemTime] = useState<string>("07:00");

  // Daily Dhikr Creator & Editor state
  const [editingLitanyId, setEditingLitanyId] = useState<string | null>(null);
  const [dhikrName, setDhikrName] = useState<string>("");
  const [dhikrArabic, setDhikrArabic] = useState<string>("");
  const [dhikrTranslit, setDhikrTranslit] = useState<string>("");
  const [dhikrTranslation, setDhikrTranslation] = useState<string>("");
  const [dhikrFazilat, setDhikrFazilat] = useState<string>("");
  const [dhikrTarget, setDhikrTarget] = useState<number>(100);
  const [dhikrWindow, setDhikrWindow] = useState<string>("After Fajr & Maghrib");

  // Checklist Creator & Editor state
  const [checklistCategoryFilter, setChecklistCategoryFilter] = useState<
    "All" | "Morning" | "Salah" | "Evening" | "Sunnah"
  >("All");
  const [editingCheckId, setEditingCheckId] = useState<string | null>(null);
  const [checkLabelInput, setCheckLabelInput] = useState<string>("");
  const [checkSubtitleInput, setCheckSubtitleInput] = useState<string>("");
  const [checkCategoryInput, setCheckCategoryInput] = useState<
    "Morning" | "Salah" | "Evening" | "Sunnah"
  >("Sunnah");
  const [qazaYears, setQazaYears] = useState<string>("");

  // Today's Dua Learning state
  const [duaDayOffset, setDuaDayOffset] = useState<number>(0);
  const [memorizeQuizMode, setMemorizeQuizMode] = useState<boolean>(false);
  const [revealedWordIndices, setRevealedWordIndices] = useState<number[]>([]);

  // Dua Finder & Action Filter state
  const [duaSearchQuery, setDuaSearchQuery] = useState<string>("");
  const [selectedActionCategory, setSelectedActionCategory] = useState<
    DuaActionCategory | "All" | "Saved"
  >("All");
  const [copiedDuaId, setCopiedDuaId] = useState<string | null>(null);

  const showToast = useCallback((msg: string) => {
    setToastBanner(msg);
    setTimeout(() => setToastBanner(null), 2600);
  }, []);

  const playSoftBeadTone = useCallback(
    (isMilestone: boolean) => {
      if (!soundEnabled || typeof window === "undefined") return;
      try {
        const ctx = new (window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "sine";
        osc.frequency.setValueAtTime(isMilestone ? 660 : 432, ctx.currentTime);
        gain.gain.setValueAtTime(isMilestone ? 0.07 : 0.025, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(
          0.0001,
          ctx.currentTime + (isMilestone ? 0.45 : 0.09)
        );
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start();
        osc.stop(ctx.currentTime + (isMilestone ? 0.45 : 0.09));
      } catch {
        // ignore audio context block
      }
    },
    [soundEnabled]
  );

  // Monitor Dhikr Reminders every minute against `now`
  useEffect(() => {
    const hh = String(now.getHours()).padStart(2, "0");
    const mm = String(now.getMinutes()).padStart(2, "0");
    const currentHm = `${hh}:${mm}`;
    const todayKey = now.toISOString().slice(0, 10);

    const due = reminders.find(
      (r) => r.enabled && r.time24h === currentHm && r.lastTriggeredDate !== todayKey
    );
    if (!due) return;

    Promise.resolve().then(() => {
      setReminders((prev) =>
        prev.map((item) =>
          item.id === due.id ? { ...item, lastTriggeredDate: todayKey } : item
        )
      );
      showToast(`Dhikr Reminder: ${due.label}`);
      playSoftBeadTone(true);
      if (typeof Notification !== "undefined" && Notification.permission === "granted") {
        try {
          new Notification(`Dhikr Reminder • ${due.label}`, {
            body: "Time for your scheduled remembrance of Allah ﷻ.",
          });
        } catch {
          // ignore
        }
      }
    });
  }, [now, reminders, playSoftBeadTone, showToast]);

  const handleBeadIncrement = (step = 1) => {
    const next = tasbihTotalToday + step;
    const isMilestone =
      next === 33 || next === 66 || next === 99 || next === 100 || next === tasbihTarget;
    incrementTasbih(step);
    playSoftBeadTone(isMilestone);
    if (typeof navigator !== "undefined" && "vibrate" in navigator) {
      try {
        navigator.vibrate(isMilestone ? [35, 25, 45] : 12);
      } catch {
        // ignore
      }
    }
  };

  // Save current Tasbih session to persistent history
  const handleSaveCurrentSession = (e: React.FormEvent) => {
    e.preventDefault();
    if (tasbihTotalToday <= 0) {
      showToast("Count at least 1 bead before saving a session.");
      return;
    }
    const entry: SavedTasbihSession = {
      id: `sess-${Date.now()}`,
      litanyId: activeLitany.id,
      litanyName: activeLitany.name,
      arabic: activeLitany.arabic,
      count: tasbihTotalToday,
      target: tasbihTarget,
      note: sessionNote.trim() || `Completed during ${schedule.nextPrayer.label} window`,
      savedAtIso: new Date().toISOString(),
    };
    setSavedSessions((prev) => [entry, ...prev]);
    setSessionNote("");
    showToast(`Saved "${activeLitany.name}" (${tasbihTotalToday}x) to your Dhikr log.`);
  };

  // Create or update a custom Daily Dhikr
  const handleSaveCustomDhikr = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dhikrName.trim() || !dhikrArabic.trim()) {
      showToast("Please enter both a Dhikr title and Arabic text.");
      return;
    }
    const payload: TasbihLitany = {
      id: editingLitanyId || `custom-dhikr-${Date.now()}`,
      name: dhikrName.trim(),
      arabic: dhikrArabic.trim(),
      transliteration: dhikrTranslit.trim() || dhikrName.trim(),
      translation: dhikrTranslation.trim() || "Personal daily remembrance.",
      fazilat: dhikrFazilat.trim() || "Custom daily Wird created in your Tasbih studio.",
      defaultTarget: Math.max(1, Number(dhikrTarget) || 100),
      recommendedWindow: dhikrWindow.trim() || "Anytime",
    };

    if (editingLitanyId) {
      setCustomLitanies((prev) => prev.map((x) => (x.id === editingLitanyId ? payload : x)));
      showToast(`Updated custom Dhikr "${payload.name}"`);
    } else {
      setCustomLitanies((prev) => [payload, ...prev]);
      showToast(`Created custom Dhikr "${payload.name}"`);
    }

    setActiveLitany(payload.id, payload.defaultTarget);
    setEditingLitanyId(null);
    setDhikrName("");
    setDhikrArabic("");
    setDhikrTranslit("");
    setDhikrTranslation("");
    setDhikrFazilat("");
    setDhikrTarget(100);
  };

  const handleEditCustomDhikr = (lit: TasbihLitany) => {
    setEditingLitanyId(lit.id);
    setDhikrName(lit.name);
    setDhikrArabic(lit.arabic);
    setDhikrTranslit(lit.transliteration);
    setDhikrTranslation(lit.translation);
    setDhikrFazilat(lit.fazilat);
    setDhikrTarget(lit.defaultTarget);
    setDhikrWindow(lit.recommendedWindow);
    setActiveTab("dhikr-creator");
  };

  const handleDeleteCustomDhikr = (id: string) => {
    setCustomLitanies((prev) => prev.filter((x) => x.id !== id));
    if (activeLitanyId === id) {
      setActiveLitany(TASBIH_LITANIES[0].id, TASBIH_LITANIES[0].defaultTarget);
    }
    showToast("Removed custom Dhikr.");
  };

  // Checklist Creator & Editor handlers
  const handleSaveChecklistItem = (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkLabelInput.trim()) return;
    if (editingCheckId) {
      setChecklistItems((prev) =>
        prev.map((item) =>
          item.id === editingCheckId
            ? {
                ...item,
                label: checkLabelInput.trim(),
                subtitle: checkSubtitleInput.trim() || "Daily Sunnah & Wird habit",
                category: checkCategoryInput,
              }
            : item
        )
      );
      showToast("Updated checklist item.");
    } else {
      const newItem: CustomChecklistItem = {
        id: `chk-${Date.now()}`,
        label: checkLabelInput.trim(),
        subtitle: checkSubtitleInput.trim() || "Personal daily Sunnah & Wird practice",
        category: checkCategoryInput,
        isCustom: true,
      };
      setChecklistItems((prev) => [newItem, ...prev]);
      showToast("Added new item to your daily checklist.");
    }
    setEditingCheckId(null);
    setCheckLabelInput("");
    setCheckSubtitleInput("");
  };

  // Today's Dua (deterministic rotation by day of year + user offset)
  const todaysDua = useMemo(() => {
    const dayOfYear = Math.floor(
      (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
    );
    const total = DAILY_DUAS_LIBRARY.length;
    const idx = (((dayOfYear + duaDayOffset) % total) + total) % total;
    return DAILY_DUAS_LIBRARY[idx];
  }, [now, duaDayOffset]);

  // Context-aware Suggested Duas based on live Prayer Waqt & time of day
  const contextSuggestedDuas = useMemo(() => {
    const waqt = schedule.currentWaqt;
    const isFriday = now.getDay() === 5;
    const hr = now.getHours();

    let targetTag: SuggestedWaqtTag = "anytime";
    if (waqt === "fajr" || (hr >= 4 && hr < 9)) targetTag = "fajr";
    else if (waqt === "dhuhr" || (hr >= 11 && hr < 15)) targetTag = "dhuhr";
    else if (waqt === "asr" || (hr >= 15 && hr < 18)) targetTag = "asr";
    else if (waqt === "maghrib" || (hr >= 18 && hr < 20)) targetTag = "maghrib";
    else if (waqt === "isha" || hr >= 20) targetTag = "isha";
    else if (hr < 4) targetTag = "tahajjud";

    return DAILY_DUAS_LIBRARY.filter(
      (d) =>
        d.suggestedWaqt.includes(targetTag) ||
        (isFriday && d.suggestedWaqt.includes("jumuah"))
    ).slice(0, 3);
  }, [schedule.currentWaqt, now]);

  // Filtered Duas for the Dua Finder & Actions Studio
  const filteredDuas = useMemo(() => {
    const q = duaSearchQuery.trim().toLowerCase();
    return DAILY_DUAS_LIBRARY.filter((d) => {
      if (selectedActionCategory === "Saved" && !favoriteDuaIds.includes(d.id)) {
        return false;
      }
      if (
        selectedActionCategory !== "All" &&
        selectedActionCategory !== "Saved" &&
        d.actionCategory !== selectedActionCategory
      ) {
        return false;
      }
      if (!q) return true;
      return (
        d.title.toLowerCase().includes(q) ||
        d.actionTrigger.toLowerCase().includes(q) ||
        d.actionCategory.toLowerCase().includes(q) ||
        d.transliteration.toLowerCase().includes(q) ||
        d.translation.toLowerCase().includes(q) ||
        d.reference.toLowerCase().includes(q) ||
        d.arabic.includes(q)
      );
    });
  }, [duaSearchQuery, selectedActionCategory, favoriteDuaIds]);

  // Launch any Dua directly into the Tasbih Counter
  const launchDuaInTasbih = (dua: DuaEntry, customTarget?: number) => {
    const target = customTarget ?? dua.recommendedCount;
    const asLitany: TasbihLitany = {
      id: `dua-litany-${dua.id}`,
      name: dua.title,
      arabic: dua.arabic,
      transliteration: dua.transliteration,
      translation: dua.translation,
      fazilat: `${dua.virtue} (${dua.reference})`,
      defaultTarget: target,
      recommendedWindow: dua.actionTrigger,
    };
    setAdHocDuaLitany(asLitany);
    setActiveLitany(asLitany.id, target);
    setActiveTab("counter");
    showToast(`Loaded "${dua.title}" (${target}x) into Tasbih Counter`);
  };

  const speakArabicDua = (arabicText: string, label: string) => {
    if (typeof window === "undefined" || !("speechSynthesis" in window)) {
      playSoftBeadTone(true);
      return;
    }
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(arabicText);
      utter.lang = "ar-SA";
      utter.rate = 0.85;
      window.speechSynthesis.speak(utter);
      showToast(`Playing Arabic pronunciation: ${label}`);
    } catch {
      playSoftBeadTone(true);
    }
  };

  const copyDuaToClipboard = async (dua: DuaEntry) => {
    const text = `${dua.title} (${dua.actionTrigger})\n\n${dua.arabic}\n\n${dua.transliteration}\n\n"${dua.translation}"\n— ${dua.reference}`;
    try {
      await navigator.clipboard.writeText(text);
      setCopiedDuaId(dua.id);
      setTimeout(() => setCopiedDuaId(null), 2000);
    } catch {
      showToast("Copied Dua text");
    }
  };

  const toggleLearnedDua = (id: string) => {
    setLearnedDuaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleFavoriteDua = (id: string) => {
    setFavoriteDuaIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // Checklist metrics
  const completedChecklistCount = useMemo(
    () => checklistItems.filter((item) => Boolean(sunnahChecks[item.id])).length,
    [checklistItems, sunnahChecks]
  );
  const checklistPct = Math.round(
    (completedChecklistCount / Math.max(1, checklistItems.length)) * 100
  );
  const filteredChecklist = useMemo(
    () =>
      checklistItems.filter(
        (item) =>
          checklistCategoryFilter === "All" || item.category === checklistCategoryFilter
      ),
    [checklistItems, checklistCategoryFilter]
  );

  // Total lifetime beads saved across sessions + today
  const lifetimeBeadsCount = useMemo(
    () =>
      savedSessions.reduce((acc, s) => acc + s.count, 0) + tasbihTotalToday,
    [savedSessions, tasbihTotalToday]
  );

  return (
    <div className="space-y-6">
      {/* Sleek Minimalist Header & Quick Metrics Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-widest text-[var(--accent-gold)]">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Minimalist Dhikr, Wird &amp; Masnoon Dua Studio</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[var(--text-primary)] mt-0.5">
            Tasbih, Daily Duas &amp; Sunnah Checklist
          </h1>
        </div>

        {/* Minimalist Stat Pills */}
        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span className="px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
            Today: <strong className="text-[var(--text-primary)] tabular-nums">{tasbihTotalToday}</strong> beads
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
            Checklist: <strong className="text-emerald-400 tabular-nums">{checklistPct}%</strong>
          </span>
          <span className="px-3 py-1.5 rounded-full bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] font-medium">
            Duas Learned: <strong className="text-[var(--accent-gold)] tabular-nums">{learnedDuaIds.length}/{DAILY_DUAS_LIBRARY.length}</strong>
          </span>
        </div>
      </div>

      {/* Sleek Minimalist Segmented Navigation Bar */}
      <div className="p-1.5 rounded-2xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex flex-wrap items-center gap-1">
        {(
          [
            { id: "counter", label: "Tasbih Counter", icon: Sparkles },
            { id: "today-dua", label: "Today's Dua (Learn Daily)", icon: GraduationCap },
            { id: "dua-finder", label: "Dua Finder & Actions", icon: Compass },
            { id: "checklist", label: `Checklist Editor (${completedChecklistCount}/${checklistItems.length})`, icon: CheckCircle2 },
            { id: "dhikr-creator", label: `Dhikr Creator (${customLitanies.length})`, icon: Plus },
          ] as const
        ).map((tab) => {
          const Icon = tab.icon;
          const active = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex-1 min-w-[135px] px-3.5 py-2.5 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                active
                  ? "text-white shadow-sm"
                  : "text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-elevated)]"
              }`}
              style={
                active
                  ? { backgroundImage: "var(--gradient-brand)" }
                  : undefined
              }
            >
              <Icon className="w-3.5 h-3.5 shrink-0" />
              <span className="truncate">{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Toast Notification Banner */}
      <AnimatePresence>
        {toastBanner && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="px-4 py-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center justify-between"
          >
            <span className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              {toastBanner}
            </span>
            <button
              type="button"
              onClick={() => setToastBanner(null)}
              className="text-emerald-200 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* =====================================================================
          TAB 1: SLEEK MINIMALIST TASBIH COUNTER + SAVE SESSION + REMINDERS
         ===================================================================== */}
      {activeTab === "counter" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Columns: Minimalist Tactile Counter Studio */}
          <section className="lg:col-span-7 card-surface p-5 sm:p-7 space-y-6">
            {/* Litany Pills + Quick Create Button */}
            <div className="flex items-center justify-between gap-2 flex-wrap">
              <div className="flex flex-wrap gap-1.5">
                {allLitanies.map((lit) => {
                  const active = lit.id === activeLitany.id;
                  return (
                    <button
                      key={lit.id}
                      type="button"
                      onClick={() => setActiveLitany(lit.id, lit.defaultTarget)}
                      className={`px-3 py-1.5 rounded-full text-xs font-semibold transition cursor-pointer ${
                        active
                          ? "text-white shadow-sm"
                          : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)]"
                      }`}
                      style={active ? { backgroundImage: "var(--gradient-brand)" } : undefined}
                    >
                      {lit.name}
                    </button>
                  );
                })}
              </div>

              <button
                type="button"
                onClick={() => setActiveTab("dhikr-creator")}
                className="px-3 py-1.5 rounded-full text-xs font-semibold bg-[var(--bg-elevated)] border border-dashed border-[var(--accent-gold)]/50 text-[var(--accent-gold)] hover:bg-[var(--bg-muted)] inline-flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>New Custom Dhikr</span>
              </button>
            </div>

            {/* Minimalist Active Litany Card */}
            <div className="p-4 sm:p-5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2.5">
              <div className="flex items-center justify-between gap-2 text-[11px]">
                <span className="font-semibold text-[var(--accent-gold)] uppercase tracking-wider">
                  {activeLitany.recommendedWindow}
                </span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => speakArabicDua(activeLitany.arabic, activeLitany.name)}
                    className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                    <span>Listen</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setSoundEnabled((v) => !v)}
                    className={`px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer ${
                      soundEnabled
                        ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                        : "bg-[var(--bg-card)] border-[var(--border-subtle)] text-[var(--text-muted)]"
                    }`}
                  >
                    {soundEnabled ? "Bead Tone ON" : "Muted"}
                  </button>
                </div>
              </div>

              <p
                dir="rtl"
                className="font-arabic text-2xl sm:text-3xl text-right leading-loose text-[var(--text-primary)]"
              >
                {activeLitany.arabic}
              </p>
              <p className="text-xs font-medium text-[var(--accent-primary)]">
                {activeLitany.transliteration}
              </p>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {activeLitany.translation}
              </p>
              <div className="text-[11px] text-[var(--text-muted)] pt-1 border-t border-[var(--border-subtle)]">
                Virtue: {activeLitany.fazilat}
              </div>
            </div>

            {/* Minimalist Radial Tap Orb */}
            <motion.button
              type="button"
              whileTap={{ scale: 0.975 }}
              onClick={() => handleBeadIncrement(1)}
              className="w-full py-7 rounded-3xl border border-[var(--border-subtle)] flex flex-col items-center justify-center gap-3 cursor-pointer select-none relative overflow-hidden"
              style={{
                background:
                  "radial-gradient(circle at 50% 48%, rgba(223, 152, 250, 0.14), rgba(144, 85, 255, 0.04) 60%, transparent 85%)",
              }}
            >
              {(() => {
                const size = 216;
                const stroke = 10;
                const r = (size - stroke) / 2;
                const circ = 2 * Math.PI * r;
                const pct = Math.min(1, tasbihTotalToday / Math.max(1, tasbihTarget));
                return (
                  <div
                    className="relative flex items-center justify-center"
                    style={{ width: size, height: size }}
                  >
                    <svg width={size} height={size} className="-rotate-90">
                      <defs>
                        <linearGradient id="tasbihMinimalArc" x1="0" y1="0" x2="1" y2="1">
                          <stop offset="0%" stopColor="#DF98FA" />
                          <stop offset="100%" stopColor="#9055FF" />
                        </linearGradient>
                      </defs>
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="var(--border-subtle)"
                        strokeWidth={stroke}
                      />
                      <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={r}
                        fill="none"
                        stroke="url(#tasbihMinimalArc)"
                        strokeWidth={stroke}
                        strokeLinecap="round"
                        strokeDasharray={circ}
                        strokeDashoffset={circ * (1 - pct)}
                        style={{ transition: "stroke-dashoffset 0.22s ease" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--text-muted)]">
                        {Math.round(pct * 100)}% of Target
                      </span>
                      <div className="flex items-baseline gap-1 mt-1">
                        <span className="text-5xl font-extrabold tabular-nums text-[var(--text-primary)]">
                          {tasbihTotalToday}
                        </span>
                        <span className="text-sm font-semibold tabular-nums text-[var(--text-muted)]">
                          / {tasbihTarget}
                        </span>
                      </div>
                      <span
                        className="mt-3 px-3.5 py-1 rounded-full text-[11px] font-bold text-white shadow-sm"
                        style={{ backgroundImage: "var(--gradient-brand)" }}
                      >
                        Tap +1
                      </span>
                    </div>
                  </div>
                );
              })()}
            </motion.button>

            {/* Quick Multi-Bead Increments, Target Presets & Save / Reminder Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-1.5">
                {[10, 33, 100].map((step) => (
                  <button
                    key={step}
                    type="button"
                    onClick={() => handleBeadIncrement(step)}
                    className="px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-gold)] transition cursor-pointer"
                  >
                    +{step}
                  </button>
                ))}
                <div className="flex items-center gap-1 ml-1 pl-2 border-l border-[var(--border-subtle)]">
                  <span className="text-[11px] text-[var(--text-muted)]">Target:</span>
                  {[33, 100, 313, 1000].map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setActiveLitany(activeLitany.id, t)}
                      className={`px-2 py-1 rounded-lg text-[11px] font-mono font-semibold cursor-pointer ${
                        tasbihTarget === t
                          ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                          : "bg-[var(--bg-elevated)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => setShowSaveDrawer((v) => !v)}
                  className="px-3 py-1.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5" />
                  <span>Save Session</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShowReminderDrawer((v) => !v)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Bell className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Reminders</span>
                </button>
                <button
                  type="button"
                  onClick={resetTasbihToday}
                  title="Reset Counter"
                  className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Expandable Save Session Bar */}
            <AnimatePresence>
              {showSaveDrawer && (
                <motion.form
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  onSubmit={handleSaveCurrentSession}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-emerald-500/30 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Bookmark className="w-3.5 h-3.5 text-emerald-400" />
                        Save Current Dhikr Session ({tasbihTotalToday} / {tasbihTarget} beads)
                      </span>
                      <button
                        type="button"
                        onClick={() => setShowSaveDrawer(false)}
                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        Close
                      </button>
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2">
                      <input
                        type="text"
                        value={sessionNote}
                        onChange={(e) => setSessionNote(e.target.value)}
                        placeholder="Optional reflection note (e.g., After Fajr Jamaat, for parents' health)..."
                        className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer shrink-0"
                      >
                        Save to History
                      </button>
                    </div>
                  </div>
                </motion.form>
              )}
            </AnimatePresence>

            {/* Expandable Dhikr Reminder Scheduler */}
            <AnimatePresence>
              {showReminderDrawer && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--accent-gold)]/35 space-y-3">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                        <Bell className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                        Daily Dhikr Reminder Scheduler
                      </span>
                      <button
                        type="button"
                        onClick={async () => {
                          if (typeof Notification !== "undefined") {
                            await Notification.requestPermission();
                            showToast("Browser notification permission updated.");
                          }
                        }}
                        className="text-[11px] font-semibold text-[var(--accent-gold)] hover:underline cursor-pointer"
                      >
                        Authorize Browser Alerts
                      </button>
                    </div>

                    <div className="space-y-2">
                      {reminders.map((rem) => (
                        <div
                          key={rem.id}
                          className="p-2.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] flex items-center justify-between gap-2 text-xs"
                        >
                          <div className="flex items-center gap-2.5">
                            <input
                              type="time"
                              value={rem.time24h}
                              onChange={(e) =>
                                setReminders((prev) =>
                                  prev.map((x) =>
                                    x.id === rem.id ? { ...x, time24h: e.target.value } : x
                                  )
                                )
                              }
                              className="px-2 py-1 rounded-lg bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-mono text-xs text-[var(--text-primary)]"
                            />
                            <span className="font-semibold text-[var(--text-primary)]">
                              {rem.label}
                            </span>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                setReminders((prev) =>
                                  prev.map((x) =>
                                    x.id === rem.id ? { ...x, enabled: !x.enabled } : x
                                  )
                                )
                              }
                              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold cursor-pointer ${
                                rem.enabled
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                                  : "bg-[var(--bg-elevated)] text-[var(--text-muted)]"
                              }`}
                            >
                              {rem.enabled ? "Active" : "Off"}
                            </button>
                            <button
                              type="button"
                              onClick={() =>
                                setReminders((prev) => prev.filter((x) => x.id !== rem.id))
                              }
                              className="text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add New Reminder Form */}
                    <form
                      onSubmit={(e) => {
                        e.preventDefault();
                        if (!newRemLabel.trim()) return;
                        setReminders((prev) => [
                          ...prev,
                          {
                            id: `rem-${Date.now()}`,
                            label: newRemLabel.trim(),
                            litanyId: activeLitany.id,
                            time24h: newRemTime,
                            enabled: true,
                          },
                        ]);
                        setNewRemLabel("");
                        showToast("Scheduled new daily Dhikr reminder.");
                      }}
                      className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-1"
                    >
                      <input
                        type="text"
                        value={newRemLabel}
                        onChange={(e) => setNewRemLabel(e.target.value)}
                        placeholder="Reminder label..."
                        className="sm:col-span-2 px-3 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                      />
                      <input
                        type="time"
                        value={newRemTime}
                        onChange={(e) => setNewRemTime(e.target.value)}
                        className="px-2.5 py-1.5 rounded-xl bg-[var(--bg-card)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
                      />
                      <button
                        type="submit"
                        className="px-3 py-1.5 rounded-xl bg-[var(--accent-gold)] text-[#1D0E40] font-bold text-xs cursor-pointer"
                      >
                        + Add Alert
                      </button>
                    </form>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

          {/* Right 5 Columns: Context-Suggested Duas Right Now + Saved Dhikr History */}
          <aside className="lg:col-span-5 space-y-6">
            {/* Suggested Duas for Current Waqt */}
            <div className="card-surface p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-gold)]">
                    Smart Contextual Suggestions
                  </span>
                  <h2 className="text-base font-bold text-[var(--text-primary)]">
                    Suggested Duas for Right Now
                  </h2>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab("dua-finder")}
                  className="text-xs font-semibold text-[var(--accent-primary)] hover:underline cursor-pointer"
                >
                  All Duas →
                </button>
              </div>

              <div className="space-y-2.5">
                {contextSuggestedDuas.map((dua) => (
                  <div
                    key={dua.id}
                    className="p-3.5 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-bold text-[var(--text-primary)]">
                        {dua.title}
                      </span>
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--accent-gold)] shrink-0">
                        {dua.actionTrigger}
                      </span>
                    </div>
                    <p
                      dir="rtl"
                      className="font-arabic text-lg text-right leading-relaxed text-[var(--text-primary)]"
                    >
                      {dua.arabic}
                    </p>
                    <p className="text-[11px] text-[var(--text-secondary)] line-clamp-2">
                      {dua.translation}
                    </p>
                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[10px] text-[var(--text-muted)]">
                        {dua.reference}
                      </span>
                      <button
                        type="button"
                        onClick={() => launchDuaInTasbih(dua)}
                        className="px-2.5 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-[11px] font-semibold text-[var(--accent-gold)] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Recite {dua.recommendedCount}x</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Saved Tasbih Sessions Log */}
            <div className="card-surface p-5 space-y-3.5">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-emerald-400">
                    Lifetime Total: {lifetimeBeadsCount.toLocaleString()} Beads
                  </span>
                  <h2 className="text-base font-bold text-[var(--text-primary)] flex items-center gap-1.5">
                    <History className="w-4 h-4 text-[var(--accent-gold)]" />
                    <span>Saved Dhikr Sessions ({savedSessions.length})</span>
                  </h2>
                </div>
                {!showSaveDrawer && (
                  <button
                    type="button"
                    onClick={() => setShowSaveDrawer(true)}
                    className="text-xs font-semibold text-emerald-400 hover:underline cursor-pointer"
                  >
                    + Save Current
                  </button>
                )}
              </div>

              {savedSessions.length === 0 ? (
                <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-muted)] text-center">
                  No saved sessions yet. Tap <strong>&ldquo;Save Session&rdquo;</strong> under the counter to record your daily Wazaif and track lifetime progress.
                </div>
              ) : (
                <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
                  {savedSessions.map((sess) => (
                    <div
                      key={sess.id}
                      className="p-3 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between gap-2 text-xs"
                    >
                      <div className="min-w-0">
                        <div className="font-bold text-[var(--text-primary)] truncate">
                          {sess.litanyName}{" "}
                          <span className="text-emerald-400 font-mono">
                            ({sess.count}/{sess.target})
                          </span>
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)] truncate">
                          {sess.note} •{" "}
                          {new Date(sess.savedAtIso).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setSavedSessions((prev) => prev.filter((x) => x.id !== sess.id))
                        }
                        title="Delete saved session"
                        className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 cursor-pointer shrink-0"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          TAB 2: TODAY'S DUA — LEARN A NEW DUA EVERY DAY
         ===================================================================== */}
      {activeTab === "today-dua" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 card-surface p-6 sm:p-8 space-y-6">
            {/* Day Scrubber & Memorization Status */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-[var(--border-subtle)]">
              <div>
                <div className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                  <GraduationCap className="w-4 h-4" />
                  <span>Daily Dua Academy • Learn 1 Authentic Dua Every Day</span>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[var(--text-primary)] mt-1">
                  {todaysDua.title}
                </h2>
              </div>

              <div className="flex items-center gap-1.5 bg-[var(--bg-elevated)] border border-[var(--border-subtle)] rounded-xl p-1">
                <button
                  type="button"
                  onClick={() => {
                    setDuaDayOffset((d) => d - 1);
                    setRevealedWordIndices([]);
                  }}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDuaDayOffset(0);
                    setRevealedWordIndices([]);
                  }}
                  className="px-3 py-1 text-xs font-semibold text-[var(--text-primary)] cursor-pointer"
                >
                  {duaDayOffset === 0
                    ? "Today's Dua"
                    : duaDayOffset > 0
                    ? `Day +${duaDayOffset}`
                    : `Day ${duaDayOffset}`}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDuaDayOffset((d) => d + 1);
                    setRevealedWordIndices([]);
                  }}
                  className="p-1.5 rounded-lg hover:bg-[var(--bg-card)] text-[var(--text-secondary)] cursor-pointer"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Action Situation & Audio / Copy Controls */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--accent-gold)]">
                  When to Recite: {todaysDua.actionTrigger}
                </span>
                <span className="px-3 py-1 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-secondary)]">
                  {todaysDua.actionCategory}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => speakArabicDua(todaysDua.arabic, todaysDua.title)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-primary)] hover:border-[var(--accent-gold)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  <Volume2 className="w-3.5 h-3.5 text-[var(--accent-gold)]" />
                  <span>Listen Arabic</span>
                </button>
                <button
                  type="button"
                  onClick={() => copyDuaToClipboard(todaysDua)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--text-secondary)] hover:text-[var(--text-primary)] inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {copiedDuaId === todaysDua.id ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span>Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Vocalized Arabic & Phonetic Card */}
            <div className="p-6 rounded-3xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-4">
              <p
                dir="rtl"
                className="font-arabic text-2xl sm:text-4xl text-right leading-[2.1] text-[var(--text-primary)]"
              >
                {todaysDua.arabic}
              </p>
              <div className="space-y-1.5 pt-3 border-t border-[var(--border-subtle)]">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--accent-primary)]">
                  Transliteration
                </div>
                <p className="text-sm font-medium text-[var(--text-primary)] leading-relaxed">
                  {todaysDua.transliteration}
                </p>
              </div>
              <div className="space-y-1 pt-2">
                <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--text-muted)]">
                  Translation &amp; Meaning
                </div>
                <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                  &ldquo;{todaysDua.translation}&rdquo;
                </p>
              </div>
            </div>

            {/* Interactive Word-by-Word / Phrase Breakdown & Self-Test Mode */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--text-primary)]">
                  Phrase-by-Phrase Meaning Breakdown
                </h3>
                <button
                  type="button"
                  onClick={() => {
                    setMemorizeQuizMode((v) => !v);
                    setRevealedWordIndices([]);
                  }}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold border cursor-pointer ${
                    memorizeQuizMode
                      ? "bg-[var(--accent-gold)] text-[#1D0E40] border-transparent"
                      : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                  }`}
                >
                  {memorizeQuizMode ? "Exit Self-Test Mode" : "Test My Memory (Hide Meanings)"}
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {todaysDua.wordBreakdown.map((chip, idx) => {
                  const revealed = !memorizeQuizMode || revealedWordIndices.includes(idx);
                  return (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => {
                        if (!memorizeQuizMode) return;
                        setRevealedWordIndices((prev) =>
                          prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]
                        );
                      }}
                      className="p-3 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-left transition hover:border-[var(--accent-gold)]/50 cursor-pointer"
                    >
                      <div dir="rtl" className="font-arabic text-xl text-[var(--accent-gold)]">
                        {chip.arabic}
                      </div>
                      <div className="text-xs font-semibold text-[var(--text-primary)] mt-1">
                        {chip.translit}
                      </div>
                      <div className="text-xs text-[var(--text-muted)] mt-0.5">
                        {revealed ? chip.meaning : "Tap to reveal meaning…"}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Bottom Actions: Mark as Learned & Practice in Tasbih Counter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[var(--border-subtle)]">
              <button
                type="button"
                onClick={() => toggleLearnedDua(todaysDua.id)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold inline-flex items-center gap-2 border cursor-pointer transition ${
                  learnedDuaIds.includes(todaysDua.id)
                    ? "bg-emerald-500/20 border-emerald-500/40 text-emerald-300"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-primary)] hover:border-emerald-400"
                }`}
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>
                  {learnedDuaIds.includes(todaysDua.id)
                    ? "Memorized & Learned ✓"
                    : "Mark Today's Dua as Learned"}
                </span>
              </button>

              <div className="flex items-center gap-2">
                {[3, 7, 33].map((cnt) => (
                  <button
                    key={cnt}
                    type="button"
                    onClick={() => launchDuaInTasbih(todaysDua, cnt)}
                    className="px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] hover:bg-[var(--bg-muted)] border border-[var(--border-subtle)] text-xs font-semibold text-[var(--accent-gold)] cursor-pointer"
                  >
                    Practice {cnt}x on Tasbih
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Right 4 Columns: Hadith Virtue & Curriculum Progress */}
          <aside className="lg:col-span-4 space-y-5">
            <div className="card-surface p-5 space-y-3">
              <div className="text-xs font-bold uppercase tracking-wider text-[var(--accent-gold)]">
                Prophetic Virtue &amp; Source
              </div>
              <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                {todaysDua.virtue}
              </p>
              <div className="text-[11px] font-mono text-[var(--text-muted)] pt-2 border-t border-[var(--border-subtle)]">
                Source: {todaysDua.reference}
              </div>
            </div>

            <div className="card-surface p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-[var(--text-primary)]">
                  Your Dua Mastery ({learnedDuaIds.length}/{DAILY_DUAS_LIBRARY.length})
                </h3>
                <span className="text-xs font-bold text-emerald-400">
                  {Math.round((learnedDuaIds.length / DAILY_DUAS_LIBRARY.length) * 100)}%
                </span>
              </div>
              <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                {DAILY_DUAS_LIBRARY.map((d, idx) => {
                  const isLearned = learnedDuaIds.includes(d.id);
                  const isCurrent = d.id === todaysDua.id;
                  return (
                    <button
                      key={d.id}
                      type="button"
                      onClick={() => {
                        const dayOfYear = Math.floor(
                          (now.getTime() - new Date(now.getFullYear(), 0, 0).getTime()) / 86400000
                        );
                        setDuaDayOffset(idx - (dayOfYear % DAILY_DUAS_LIBRARY.length));
                      }}
                      className={`w-full text-left p-2.5 rounded-xl border text-xs flex items-center justify-between gap-2 cursor-pointer transition ${
                        isCurrent
                          ? "bg-[var(--bg-elevated)] border-[var(--accent-gold)]"
                          : "bg-[var(--bg-card)] border-[var(--border-subtle)] hover:bg-[var(--bg-elevated)]"
                      }`}
                    >
                      <span className="truncate font-medium text-[var(--text-primary)]">
                        {idx + 1}. {d.title}
                      </span>
                      <CheckCircle2
                        className={`w-4 h-4 shrink-0 ${
                          isLearned ? "text-emerald-400" : "text-[var(--text-muted)]/40"
                        }`}
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          TAB 3: DUA FINDER, SUGGESTED DUAS & DUAS FOR DAILY ACTIONS
         ===================================================================== */}
      {activeTab === "dua-finder" && (
        <div className="space-y-5">
          {/* Search & Action Category Pills */}
          <div className="card-surface p-5 space-y-4">
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-[var(--text-muted)] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={duaSearchQuery}
                  onChange={(e) => setDuaSearchQuery(e.target.value)}
                  placeholder="Search Duas by action, emotion, keyword, or Hadith (e.g., sleep, home, rizq, debt, anxiety, parents)..."
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-gold)]"
                />
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedActionCategory(
                    selectedActionCategory === "Saved" ? "All" : "Saved"
                  )
                }
                className={`px-4 py-2.5 rounded-xl text-xs font-bold border inline-flex items-center justify-center gap-1.5 cursor-pointer ${
                  selectedActionCategory === "Saved"
                    ? "bg-amber-400/20 border-amber-400 text-amber-300"
                    : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-secondary)]"
                }`}
              >
                <Heart className="w-3.5 h-3.5" />
                <span>Saved Duas ({favoriteDuaIds.length})</span>
              </button>
            </div>

            {/* Duas for Actions Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setSelectedActionCategory("All")}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                  selectedActionCategory === "All"
                    ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                    : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                }`}
              >
                All Actions ({DAILY_DUAS_LIBRARY.length})
              </button>
              {DUA_ACTION_CATEGORIES.map((cat) => {
                const active = selectedActionCategory === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedActionCategory(cat)}
                    className={`px-3 py-1.5 rounded-full text-xs font-semibold cursor-pointer transition ${
                      active
                        ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                        : "bg-[var(--bg-elevated)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Grid of Duas for Daily Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {filteredDuas.map((dua) => {
              const isFav = favoriteDuaIds.includes(dua.id);
              const isLearned = learnedDuaIds.includes(dua.id);
              return (
                <div
                  key={dua.id}
                  className="card-surface p-5 flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <span className="inline-block px-2.5 py-0.5 rounded-full bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[10px] font-bold uppercase tracking-wider text-[var(--accent-gold)] mb-1">
                          Action: {dua.actionTrigger}
                        </span>
                        <h3 className="text-base font-bold text-[var(--text-primary)]">
                          {dua.title}
                        </h3>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => toggleFavoriteDua(dua.id)}
                          title="Save to Favorite Duas"
                          className={`p-2 rounded-xl border cursor-pointer ${
                            isFav
                              ? "bg-amber-400/20 border-amber-400/40 text-amber-300"
                              : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)]"
                          }`}
                        >
                          <Heart className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => speakArabicDua(dua.arabic, dua.title)}
                          title="Listen Arabic Pronunciation"
                          className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={() => copyDuaToClipboard(dua)}
                          title="Copy Dua"
                          className="p-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] cursor-pointer"
                        >
                          {copiedDuaId === dua.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2">
                      <p
                        dir="rtl"
                        className="font-arabic text-2xl text-right leading-loose text-[var(--text-primary)]"
                      >
                        {dua.arabic}
                      </p>
                      <p className="text-xs font-medium text-[var(--accent-primary)]">
                        {dua.transliteration}
                      </p>
                      <p className="text-xs text-[var(--text-secondary)] leading-relaxed">
                        &ldquo;{dua.translation}&rdquo;
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[var(--border-subtle)] flex flex-wrap items-center justify-between gap-2 text-xs">
                    <span className="text-[11px] text-[var(--text-muted)]">
                      {dua.reference}
                    </span>
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => toggleLearnedDua(dua.id)}
                        className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border cursor-pointer ${
                          isLearned
                            ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400"
                            : "bg-[var(--bg-elevated)] border-[var(--border-subtle)] text-[var(--text-muted)]"
                        }`}
                      >
                        {isLearned ? "Learned ✓" : "Mark Learned"}
                      </button>
                      <button
                        type="button"
                        onClick={() => launchDuaInTasbih(dua)}
                        className="px-3 py-1 rounded-lg bg-[var(--accent-gold)] text-[#1D0E40] font-bold text-[11px] inline-flex items-center gap-1 cursor-pointer"
                      >
                        <Play className="w-3 h-3" />
                        <span>Count {dua.recommendedCount}x</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: CHECKLIST CREATOR & EDITOR + QAZA-E-UMRI TRACKER
         ===================================================================== */}
      {activeTab === "checklist" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 7 Columns: Interactive Checklist + Category Filter */}
          <div className="lg:col-span-7 card-surface p-5 sm:p-6 space-y-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  Daily Sunnah &amp; Wird Checklist
                </h2>
                <p className="text-xs text-[var(--text-muted)]">
                  Tap any habit to mark completed today, or click the pencil icon to edit any item.
                </p>
              </div>
              <div className="text-right">
                <div className="text-lg font-extrabold text-emerald-400 tabular-nums">
                  {completedChecklistCount} / {checklistItems.length}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  Completed ({checklistPct}%)
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="w-full h-2 rounded-full bg-[var(--bg-elevated)] overflow-hidden">
              <div
                className="h-full rounded-full transition-all duration-300"
                style={{
                  width: `${checklistPct}%`,
                  backgroundImage: "var(--gradient-brand)",
                }}
              />
            </div>

            {/* Category Filter Pills */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              <div className="flex flex-wrap gap-1.5">
                {(["All", "Morning", "Salah", "Evening", "Sunnah"] as const).map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setChecklistCategoryFilter(cat)}
                    className={`px-3 py-1 rounded-full text-xs font-semibold cursor-pointer ${
                      checklistCategoryFilter === cat
                        ? "bg-[var(--accent-gold)] text-[#1D0E40]"
                        : "bg-[var(--bg-elevated)] text-[var(--text-secondary)]"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => {
                  setChecklistItems(DEFAULT_CHECKLIST_ITEMS);
                  showToast("Restored default Sunnah checklist items.");
                }}
                className="text-[11px] text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
              >
                Reset Defaults
              </button>
            </div>

            {/* Checklist Items */}
            <div className="space-y-2">
              {filteredChecklist.map((item) => {
                const done = Boolean(sunnahChecks[item.id]);
                return (
                  <div
                    key={item.id}
                    className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition ${
                      done
                        ? "bg-emerald-500/10 border-emerald-500/40"
                        : "bg-[var(--bg-elevated)] border-[var(--border-subtle)]"
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => toggleSunnah(item.id)}
                      className="flex-1 flex items-start gap-3 text-left cursor-pointer"
                    >
                      <CheckCircle2
                        className={`w-5 h-5 mt-0.5 shrink-0 ${
                          done ? "text-emerald-400" : "text-[var(--text-muted)]"
                        }`}
                      />
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-[var(--text-primary)]">
                          {item.label}
                        </div>
                        <div className="text-[11px] text-[var(--text-muted)]">
                          {item.subtitle} • <span className="text-[var(--accent-gold)]">{item.category}</span>
                        </div>
                      </div>
                    </button>

                    <div className="flex items-center gap-1 shrink-0">
                      <button
                        type="button"
                        onClick={() => {
                          setEditingCheckId(item.id);
                          setCheckLabelInput(item.label);
                          setCheckSubtitleInput(item.subtitle);
                          setCheckCategoryInput(item.category);
                        }}
                        title="Edit checklist item"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          setChecklistItems((prev) => prev.filter((x) => x.id !== item.id))
                        }
                        title="Delete checklist item"
                        className="p-1.5 rounded-lg text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right 5 Columns: Checklist Creator & Editor Form + Qaza-e-Umri Tracker */}
          <aside className="lg:col-span-5 space-y-6">
            <form
              onSubmit={handleSaveChecklistItem}
              className="card-surface p-5 space-y-3.5"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  {editingCheckId ? "Edit Checklist Item" : "Create New Checklist Habit"}
                </h3>
                {editingCheckId && (
                  <button
                    type="button"
                    onClick={() => {
                      setEditingCheckId(null);
                      setCheckLabelInput("");
                      setCheckSubtitleInput("");
                    }}
                    className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>

              <div className="space-y-2.5">
                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                    Habit / Practice Title
                  </label>
                  <input
                    type="text"
                    required
                    value={checkLabelInput}
                    onChange={(e) => setCheckLabelInput(e.target.value)}
                    placeholder="e.g., Recite Surah Yaseen after Fajr"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                    Subtitle / Time Window / Virtue Note
                  </label>
                  <input
                    type="text"
                    value={checkSubtitleInput}
                    onChange={(e) => setCheckSubtitleInput(e.target.value)}
                    placeholder="e.g., Every morning for barakah in sustenance"
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)] focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                    Time Category
                  </label>
                  <select
                    value={checkCategoryInput}
                    onChange={(e) =>
                      setCheckCategoryInput(
                        e.target.value as "Morning" | "Salah" | "Evening" | "Sunnah"
                      )
                    }
                    className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Salah">Salah</option>
                    <option value="Evening">Evening</option>
                    <option value="Sunnah">Sunnah</option>
                  </select>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-[var(--accent-gold)] text-[#1D0E40] font-bold text-xs cursor-pointer"
              >
                {editingCheckId ? "Save Changes to Checklist Item" : "+ Add to My Daily Checklist"}
              </button>
            </form>

            {/* Qaza-e-Umri Tracker */}
            <div className="card-surface p-5 space-y-3">
              <div>
                <h3 className="text-base font-bold text-[var(--text-primary)]">
                  Qaza-e-Umri Prayer Ledger
                </h3>
                <p className="text-xs text-[var(--text-muted)]">
                  Track and decrement missed Fard &amp; Wajib Witr prayers.
                </p>
              </div>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  const years = Math.max(0, Math.min(80, parseFloat(qazaYears) || 0));
                  const n = Math.round(years * 365);
                  setQazaUmri({ fajr: n, dhuhr: n, asr: n, maghrib: n, isha: n, witr: n });
                  setQazaYears("");
                  showToast(`Initialized Qaza-e-Umri ledger for ${years} years (${n} days).`);
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="number"
                  min={0}
                  max={80}
                  step="0.5"
                  value={qazaYears}
                  onChange={(e) => setQazaYears(e.target.value)}
                  placeholder="Years to calculate..."
                  className="flex-1 px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
                <button
                  type="submit"
                  className="px-3.5 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-bold text-[var(--accent-gold)] cursor-pointer"
                >
                  Set Ledger
                </button>
              </form>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {(["fajr", "dhuhr", "asr", "maghrib", "isha", "witr"] as const).map((p) => (
                  <div
                    key={p}
                    className="p-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] flex items-center justify-between"
                  >
                    <div>
                      <div className="text-[10px] uppercase font-bold text-[var(--text-muted)]">
                        {p}
                      </div>
                      <div className="text-sm font-extrabold tabular-nums text-[var(--text-primary)]">
                        {qazaUmriRemaining[p as PrayerName | "witr"]}
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => decrementQazaUmri(p as PrayerName | "witr")}
                      className="px-2 py-1 rounded-lg bg-[var(--bg-card)] hover:bg-emerald-500/20 text-[11px] font-bold text-emerald-400 cursor-pointer"
                    >
                      -1
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </aside>
        </div>
      )}

      {/* =====================================================================
          TAB 5: DAILY DHIKR CREATOR & CUSTOM LITANY STUDIO
         ===================================================================== */}
      {activeTab === "dhikr-creator" && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left 6 Columns: Creator / Editor Form */}
          <form
            onSubmit={handleSaveCustomDhikr}
            className="lg:col-span-6 card-surface p-5 sm:p-6 space-y-4"
          >
            <div className="flex items-center justify-between">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-widest text-[var(--accent-gold)]">
                  Personal Wird Studio
                </span>
                <h2 className="text-lg font-bold text-[var(--text-primary)]">
                  {editingLitanyId ? "Edit Custom Daily Dhikr" : "Create Custom Daily Dhikr"}
                </h2>
              </div>
              {editingLitanyId && (
                <button
                  type="button"
                  onClick={() => {
                    setEditingLitanyId(null);
                    setDhikrName("");
                    setDhikrArabic("");
                    setDhikrTranslit("");
                    setDhikrTranslation("");
                    setDhikrFazilat("");
                  }}
                  className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                >
                  Cancel Edit
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                  Dhikr / Wazifa Name *
                </label>
                <input
                  type="text"
                  required
                  value={dhikrName}
                  onChange={(e) => setDhikrName(e.target.value)}
                  placeholder="e.g., Ya Hayyu Ya Qayyum"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                  Default Bead Target *
                </label>
                <input
                  type="number"
                  min={1}
                  max={10000}
                  value={dhikrTarget}
                  onChange={(e) => setDhikrTarget(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs font-mono text-[var(--text-primary)]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Arabic Script *
              </label>
              <input
                type="text"
                required
                dir="rtl"
                value={dhikrArabic}
                onChange={(e) => setDhikrArabic(e.target.value)}
                placeholder="يَا حَيُّ يَا قَيُّومُ بِرَحْمَتِكَ أَسْتَغِيثُ"
                className="w-full px-3 py-2.5 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] font-arabic text-xl text-right text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Transliteration
              </label>
              <input
                type="text"
                value={dhikrTranslit}
                onChange={(e) => setDhikrTranslit(e.target.value)}
                placeholder="Ya Hayyu Ya Qayyum birahmatika astaghith"
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>

            <div>
              <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                Meaning / Translation
              </label>
              <input
                type="text"
                value={dhikrTranslation}
                onChange={(e) => setDhikrTranslation(e.target.value)}
                placeholder="O Ever-Living, O All-Sustaining, in Your Mercy I seek relief."
                className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                  Recommended Time Window
                </label>
                <input
                  type="text"
                  value={dhikrWindow}
                  onChange={(e) => setDhikrWindow(e.target.value)}
                  placeholder="After Fajr & Asr"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
              </div>
              <div>
                <label className="text-[11px] font-semibold text-[var(--text-muted)] block mb-1">
                  Spiritual Benefit / Fazilat Note
                </label>
                <input
                  type="text"
                  value={dhikrFazilat}
                  onChange={(e) => setDhikrFazilat(e.target.value)}
                  placeholder="Revives the heart and removes distress"
                  className="w-full px-3 py-2 rounded-xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] text-xs text-[var(--text-primary)]"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 rounded-xl bg-[var(--accent-gold)] text-[#1D0E40] font-bold text-xs cursor-pointer"
            >
              {editingLitanyId ? "Save Updated Dhikr" : "+ Create & Add to Tasbih Counter"}
            </button>
          </form>

          {/* Right 6 Columns: User's Custom Dhikr Library + Built-in Awrad */}
          <div className="lg:col-span-6 card-surface p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-bold text-[var(--text-primary)]">
              Your Custom &amp; Built-In Daily Dhikr Library ({allLitanies.length})
            </h3>

            <div className="space-y-2.5 max-h-[520px] overflow-y-auto pr-1">
              {allLitanies.map((lit) => {
                const isCustom = customLitanies.some((c) => c.id === lit.id);
                return (
                  <div
                    key={lit.id}
                    className="p-4 rounded-2xl bg-[var(--bg-elevated)] border border-[var(--border-subtle)] space-y-2"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-sm text-[var(--text-primary)]">
                          {lit.name}
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-[var(--bg-card)] text-[var(--accent-gold)]">
                          Target {lit.defaultTarget}x
                        </span>
                        {isCustom && (
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300">
                            Custom
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() => {
                            setActiveLitany(lit.id, lit.defaultTarget);
                            setActiveTab("counter");
                          }}
                          className="px-2.5 py-1 rounded-lg bg-[var(--accent-gold)] text-[#1D0E40] font-bold text-[11px] cursor-pointer"
                        >
                          Count Now
                        </button>
                        {isCustom && (
                          <>
                            <button
                              type="button"
                              onClick={() => handleEditCustomDhikr(lit)}
                              className="p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => handleDeleteCustomDhikr(lit.id)}
                              className="p-1.5 text-[var(--text-muted)] hover:text-rose-400 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </>
                        )}
                      </div>
                    </div>

                    <p
                      dir="rtl"
                      className="font-arabic text-xl text-right leading-relaxed text-[var(--text-primary)]"
                    >
                      {lit.arabic}
                    </p>
                    <p className="text-xs text-[var(--text-secondary)]">
                      {lit.translation}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
