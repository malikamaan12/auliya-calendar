"use client";

import React, { Suspense, useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  Scale,
  Search,
  BookOpen,
  CheckCircle2,
  Plus,
  ArrowRight,
  Bookmark,
  Copy,
  Check,
  Volume2,
  Loader2,
  Sparkles,
  Filter,
  Compass,
  ChevronLeft,
  ChevronRight,
  Layers,
  ShieldCheck,
  HelpCircle,
  Hash,
  Users,
  Eye,
  AlertCircle,
} from "lucide-react";
import {
  BAHAR_E_SHARIAT_MASAIL,
  FIQH_CATEGORIES,
  FIQH_QUICK_SCENARIOS,
  FiqhCategory,
  FiqhRulingStatus,
  HADITH_COLLECTION,
  SUNNAH_PLAYBOOKS,
  SunnahPlaybookCategory,
} from "@/data/fiqh-hadith";
import {
  SALAH_ARCHITECTURE_MATRIX,
  SALAH_POSTURE_STEPS,
  SPECIAL_PRAYER_BLUEPRINTS,
  TAHARAH_METHODS,
} from "@/data/prayer-method";
import {
  fetchBookSectionHadiths,
  fetchSingleHadithByNumber,
  HADITH_BOOKS,
  HadithBookCategory,
  HadithCatalogMap,
  loadHadithCatalog,
  loadLibraryBookmarks,
  saveLibraryBookmarks,
  searchFullHadithBook,
  UnifiedHadithRecord,
} from "@/lib/hadith-api";
import { useApp } from "@/lib/store";

type MainStudioTab = "hadith" | "prayer-method" | "fiqh" | "sunnah";
type PrayerSubTab = "walkthrough" | "blueprints" | "taharah" | "matrix";

const RULING_STATUSES: ("All" | FiqhRulingStatus)[] = [
  "All",
  "Fard",
  "Wajib",
  "Sunnah Mu'akkadah",
  "Mustahabb",
  "Makruh Tahrimi",
  "Haram",
  "Aqidah Qat'iyyah",
];

const SUNNAH_CATEGORIES: ("All" | SunnahPlaybookCategory)[] = [
  "All",
  "Taharah & Masjid",
  "Morning & Evening",
  "Eating & Drinking",
  "Home, Dress & Grooming",
  "Jumu'ah & Sacred Nights",
  "Travel, Sleep & Social Adab",
];

function speakArabicOrEnglish(text: string, lang: "ar-SA" | "en-US" = "ar-SA") {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;
  try {
    window.speechSynthesis.cancel();
    const u = new SpeechSynthesisUtterance(text);
    u.lang = lang;
    u.rate = lang === "ar-SA" ? 0.85 : 0.95;
    window.speechSynthesis.speak(u);
  } catch {
    // ignore speech restrictions
  }
}

function FiqhHadithInner() {
  const searchParams = useSearchParams();
  const initialTab = (searchParams.get("tab") as MainStudioTab) || "hadith";

  const { sunnahChecks, toggleSunnah } = useApp();

  const [activeTab, setActiveTab] = useState<MainStudioTab>(
    ["hadith", "prayer-method", "fiqh", "sunnah"].includes(initialTab)
      ? initialTab
      : "hadith"
  );

  // Persistent Bookmarks across Hadith, Fiqh & Prayer Blueprints
  const [bookmarks, setBookmarks] = useState<string[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // =========================================================================
  // 1. HADITH BOOKS LIBRARY STATE (11 Books, 36,500+ Hadiths, Search & Filter)
  // =========================================================================
  const [catalog, setCatalog] = useState<HadithCatalogMap | null>(null);
  const [bookGroupFilter, setBookGroupFilter] = useState<
    "All" | HadithBookCategory
  >("All");
  const [selectedBookId, setSelectedBookId] = useState<string>("bukhari");
  const [selectedSectionNum, setSelectedSectionNum] = useState<number>(1);
  const [sectionSearchQuery, setSectionSearchQuery] = useState("");
  const [hadithQuery, setHadithQuery] = useState("");
  const [hadithGradeFilter, setHadithGradeFilter] = useState<
    "All" | "Sahih" | "Hasan"
  >("All");
  const [anthologyTopicFilter, setAnthologyTopicFilter] =
    useState<string>("All");
  const [onlyBookmarkedHadith, setOnlyBookmarkedHadith] = useState(false);

  // Language Visibility Toggles
  const [showArabic, setShowArabic] = useState(true);
  const [showEnglish, setShowEnglish] = useState(true);
  const [showUrdu, setShowUrdu] = useState(true);

  // Remote Canonical Book Section / Search State
  const [sectionHadiths, setSectionHadiths] = useState<UnifiedHadithRecord[]>([]);
  const [sectionLoading, setSectionLoading] = useState(false);
  const [sectionError, setSectionError] = useState<string | null>(null);
  const [hadithPage, setHadithPage] = useState(1);

  // Full-book Deep Search & Direct Hadith # Jump
  const [jumpNumberInput, setJumpNumberInput] = useState("");
  const [fullSearchActive, setFullSearchActive] = useState(false);
  const [fullSearchLoading, setFullSearchLoading] = useState(false);
  const [fullSearchResults, setFullSearchResults] = useState<{
    total: number;
    items: UnifiedHadithRecord[];
  } | null>(null);

  // =========================================================================
  // 2. HANAFI PRAYER METHOD (TARIQA-E-NAMAZ) STATE
  // =========================================================================
  const [prayerSubTab, setPrayerSubTab] = useState<PrayerSubTab>("walkthrough");
  const [postureGenderMode, setPostureGenderMode] = useState<
    "brothers" | "sisters" | "both"
  >("both");
  const [walkthroughViewMode, setWalkthroughViewMode] = useState<
    "guided" | "all"
  >("all");
  const [guidedStepIdx, setGuidedStepIdx] = useState(0);
  const [prayerSearch, setPrayerSearch] = useState("");
  const [posturePhaseFilter, setPosturePhaseFilter] = useState<string>("All");
  const [postureRulingFilter, setPostureRulingFilter] = useState<string>("All");
  const [blueprintCategoryFilter, setBlueprintCategoryFilter] =
    useState<string>("All");
  const [selectedBlueprintId, setSelectedBlueprintId] =
    useState<string>("fajr-2-fard");
  const [selectedTaharahId, setSelectedTaharahId] = useState<
    "wudu" | "ghusl" | "tayammum"
  >("wudu");
  const [matrixGroupFilter, setMatrixGroupFilter] = useState<string>("All");

  // =========================================================================
  // 3. HANAFI FIQH ENCYCLOPEDIA STATE
  // =========================================================================
  const [fiqhQuery, setFiqhQuery] = useState("");
  const [fiqhCategory, setFiqhCategory] = useState<"All" | FiqhCategory>("All");
  const [fiqhRuling, setFiqhRuling] = useState<"All" | FiqhRulingStatus>("All");
  const [onlyBookmarkedFiqh, setOnlyBookmarkedFiqh] = useState(false);
  const [checkerGroup, setCheckerGroup] = useState<
    "All" | "Wudu Validity" | "Sajda-e-Sahw" | "Fasting (Roza)" | "Traveler (Qasr)"
  >("Wudu Validity");
  const [checkerQuery, setCheckerQuery] = useState("");

  // =========================================================================
  // 4. MASNOON SUNNAH PLAYBOOKS STATE
  // =========================================================================
  const [sunnahQuery, setSunnahQuery] = useState("");
  const [sunnahCat, setSunnahCat] = useState<"All" | SunnahPlaybookCategory>("All");
  const [sunnahStatusFilter, setSunnahStatusFilter] = useState<
    "All" | "Completed" | "Remaining"
  >("All");

  // Hydrate bookmarks & 10-Book Hadith Catalog
  useEffect(() => {
    Promise.resolve().then(() => {
      setBookmarks(loadLibraryBookmarks());
    });
    loadHadithCatalog()
      .then((cat) => setCatalog(cat))
      .catch(() => undefined);
  }, []);

  const toggleBookmark = useCallback((id: string) => {
    setBookmarks((prev) => {
      const next = prev.includes(id)
        ? prev.filter((x) => x !== id)
        : [...prev, id];
      saveLibraryBookmarks(next);
      return next;
    });
  }, []);

  const copyCitation = useCallback((id: string, text: string) => {
    navigator.clipboard?.writeText(text).catch(() => undefined);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1800);
  }, []);

  const selectedBook = useMemo(
    () => HADITH_BOOKS.find((b) => b.id === selectedBookId) || HADITH_BOOKS[0],
    [selectedBookId]
  );

  const visibleBooks = useMemo(
    () =>
      HADITH_BOOKS.filter(
        (b) => bookGroupFilter === "All" || b.category === bookGroupFilter
      ),
    [bookGroupFilter]
  );

  const bookSections = useMemo(() => {
    if (!catalog || selectedBook.isBuiltInAnthology) return [];
    const list = catalog[selectedBook.id]?.sections || [];
    const q = sectionSearchQuery.trim().toLowerCase();
    if (!q) return list;
    return list.filter(
      (s) =>
        s.title.toLowerCase().includes(q) || String(s.num) === q
    );
  }, [catalog, selectedBook, sectionSearchQuery]);

  const activeSectionMeta = useMemo(() => {
    if (!catalog || selectedBook.isBuiltInAnthology) return null;
    const list = catalog[selectedBook.id]?.sections || [];
    return (
      list.find((s) => s.num === selectedSectionNum) || list[0] || null
    );
  }, [catalog, selectedBook, selectedSectionNum]);

  // Load selected chapter Hadiths for canonical books
  useEffect(() => {
    if (selectedBook.isBuiltInAnthology || fullSearchActive) return;
    const secNum = activeSectionMeta?.num || 1;
    const secTitle = activeSectionMeta?.title || "Chapter 1";
    let cancelled = false;

    Promise.resolve().then(() => {
      if (cancelled) return;
      setSectionLoading(true);
      setSectionError(null);
    });

    fetchBookSectionHadiths(selectedBook, secNum, secTitle)
      .then((records) => {
        if (cancelled) return;
        setSectionHadiths(records);
        setSectionLoading(false);
        setHadithPage(1);
      })
      .catch(() => {
        if (cancelled) return;
        setSectionError(
          "Could not reach Hadith CDN right now — switch to 'Sunni Hanafi Anthology' for instant offline Hadiths or retry."
        );
        setSectionLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [selectedBook, activeSectionMeta?.num, activeSectionMeta?.title, fullSearchActive]);

  // Trigger Full-Book Deep Search across all thousands of Hadiths in selected book
  const runFullBookSearch = async () => {
    if (selectedBook.isBuiltInAnthology || !hadithQuery.trim()) return;
    setFullSearchActive(true);
    setFullSearchLoading(true);
    setSectionError(null);
    try {
      const res = await searchFullHadithBook(
        selectedBook,
        hadithQuery,
        hadithGradeFilter,
        35
      );
      setFullSearchResults({ total: res.totalMatches, items: res.items });
    } catch {
      setSectionError("Unable to search full book at the moment. Please try again.");
    } finally {
      setFullSearchLoading(false);
    }
  };

  // Trigger Direct Jump to Hadith #
  const runJumpToHadithNumber = async () => {
    const num = parseInt(jumpNumberInput.trim(), 10);
    if (!Number.isFinite(num) || num < 1 || selectedBook.isBuiltInAnthology) return;
    setFullSearchActive(true);
    setFullSearchLoading(true);
    setSectionError(null);
    try {
      const single = await fetchSingleHadithByNumber(selectedBook, num, catalog);
      setFullSearchResults({
        total: single ? 1 : 0,
        items: single ? [single] : [],
      });
    } catch {
      setFullSearchResults({ total: 0, items: [] });
    } finally {
      setFullSearchLoading(false);
    }
  };

  // Filtered Canonical Book Hadiths (in-section or full-search)
  const displayedRemoteHadiths = useMemo(() => {
    const base =
      fullSearchActive && fullSearchResults
        ? fullSearchResults.items
        : sectionHadiths;
    const q = hadithQuery.trim().toLowerCase();

    return base.filter((h) => {
      if (onlyBookmarkedHadith && !bookmarks.includes(h.uid)) return false;
      if (
        hadithGradeFilter === "Sahih" &&
        !/sahih/i.test(h.primaryGrade)
      ) {
        return false;
      }
      if (
        hadithGradeFilter === "Hasan" &&
        !/hasan/i.test(h.primaryGrade)
      ) {
        return false;
      }
      if (!q || fullSearchActive) return true;
      return (
        h.english.toLowerCase().includes(q) ||
        h.arabic.includes(hadithQuery.trim()) ||
        h.urdu.includes(hadithQuery.trim()) ||
        String(h.hadithNumber) === q ||
        (h.narratorHint && h.narratorHint.toLowerCase().includes(q))
      );
    });
  }, [
    fullSearchActive,
    fullSearchResults,
    sectionHadiths,
    hadithQuery,
    onlyBookmarkedHadith,
    bookmarks,
    hadithGradeFilter,
  ]);

  const PAGE_SIZE = 20;
  const totalHadithPages = Math.max(
    1,
    Math.ceil(displayedRemoteHadiths.length / PAGE_SIZE)
  );
  const paginatedRemoteHadiths = useMemo(
    () =>
      displayedRemoteHadiths.slice(
        (hadithPage - 1) * PAGE_SIZE,
        hadithPage * PAGE_SIZE
      ),
    [displayedRemoteHadiths, hadithPage]
  );

  // Filtered Built-In Sunni Anthology Hadiths
  const filteredAnthology = useMemo(() => {
    const q = hadithQuery.trim().toLowerCase();
    return HADITH_COLLECTION.filter((h) => {
      if (onlyBookmarkedHadith && !bookmarks.includes(h.id)) return false;
      if (anthologyTopicFilter !== "All" && h.topic !== anthologyTopicFilter) {
        return false;
      }
      if (
        hadithGradeFilter !== "All" &&
        !h.grade.toLowerCase().includes(hadithGradeFilter.toLowerCase())
      ) {
        return false;
      }
      if (!q) return true;
      return (
        h.english.toLowerCase().includes(q) ||
        h.collection.toLowerCase().includes(q) ||
        h.narrator.toLowerCase().includes(q) ||
        h.sunniNote.toLowerCase().includes(q) ||
        h.arabic.includes(hadithQuery.trim()) ||
        h.urdu.includes(hadithQuery.trim())
      );
    });
  }, [
    hadithQuery,
    onlyBookmarkedHadith,
    bookmarks,
    anthologyTopicFilter,
    hadithGradeFilter,
  ]);

  // Filtered Prayer Method Steps, Blueprints, and Matrix
  const filteredPostureSteps = useMemo(() => {
    const q = prayerSearch.trim().toLowerCase();
    return SALAH_POSTURE_STEPS.filter((s) => {
      if (posturePhaseFilter !== "All" && s.phase !== posturePhaseFilter) {
        return false;
      }
      if (postureRulingFilter !== "All" && s.ruling !== postureRulingFilter) {
        return false;
      }
      if (!q) return true;
      return (
        s.title.toLowerCase().includes(q) ||
        s.brothersPosture.toLowerCase().includes(q) ||
        s.sistersPosture.toLowerCase().includes(q) ||
        s.fiqhTip.toLowerCase().includes(q) ||
        (s.recitation &&
          (s.recitation.transliteration.toLowerCase().includes(q) ||
            s.recitation.english.toLowerCase().includes(q) ||
            s.recitation.label.toLowerCase().includes(q)))
      );
    });
  }, [prayerSearch, posturePhaseFilter, postureRulingFilter]);

  const filteredBlueprints = useMemo(() => {
    const q = prayerSearch.trim().toLowerCase();
    return SPECIAL_PRAYER_BLUEPRINTS.filter((bp) => {
      if (
        blueprintCategoryFilter !== "All" &&
        bp.category !== blueprintCategoryFilter
      ) {
        return false;
      }
      if (!q) return true;
      return (
        bp.title.toLowerCase().includes(q) ||
        bp.overview.toLowerCase().includes(q) ||
        bp.rakatsSummary.toLowerCase().includes(q) ||
        bp.hanafiNotes.some((n) => n.toLowerCase().includes(q))
      );
    });
  }, [prayerSearch, blueprintCategoryFilter]);

  const activeBlueprint = useMemo(
    () =>
      filteredBlueprints.find((b) => b.id === selectedBlueprintId) ||
      filteredBlueprints[0] ||
      SPECIAL_PRAYER_BLUEPRINTS[0],
    [filteredBlueprints, selectedBlueprintId]
  );

  const activeTaharah = useMemo(
    () =>
      TAHARAH_METHODS.find((t) => t.id === selectedTaharahId) ||
      TAHARAH_METHODS[0],
    [selectedTaharahId]
  );

  const filteredMatrix = useMemo(() => {
    const q = prayerSearch.trim().toLowerCase();
    return SALAH_ARCHITECTURE_MATRIX.filter((item) => {
      if (matrixGroupFilter !== "All" && item.group !== matrixGroupFilter) {
        return false;
      }
      if (!q) return true;
      return (
        item.title.toLowerCase().includes(q) ||
        item.detail.toLowerCase().includes(q) ||
        item.consequenceIfMissed.toLowerCase().includes(q)
      );
    });
  }, [prayerSearch, matrixGroupFilter]);

  // Filtered Hanafi Fiqh Masa'il & Quick Scenarios
  const filteredMasail = useMemo(() => {
    const q = fiqhQuery.trim().toLowerCase();
    return BAHAR_E_SHARIAT_MASAIL.filter((m) => {
      if (onlyBookmarkedFiqh && !bookmarks.includes(m.id)) return false;
      if (fiqhCategory !== "All" && m.category !== fiqhCategory) return false;
      if (fiqhRuling !== "All" && m.ruling !== fiqhRuling) return false;
      if (!q) return true;
      return (
        m.title.toLowerCase().includes(q) ||
        m.summary.toLowerCase().includes(q) ||
        m.source.toLowerCase().includes(q) ||
        m.dalilNote.toLowerCase().includes(q) ||
        m.tags.some((t) => t.toLowerCase().includes(q)) ||
        m.steps.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [fiqhQuery, onlyBookmarkedFiqh, bookmarks, fiqhCategory, fiqhRuling]);

  const filteredQuickScenarios = useMemo(() => {
    const q = checkerQuery.trim().toLowerCase();
    return FIQH_QUICK_SCENARIOS.filter((s) => {
      if (checkerGroup !== "All" && s.checkerGroup !== checkerGroup) return false;
      if (!q) return true;
      return (
        s.question.toLowerCase().includes(q) ||
        s.explanation.toLowerCase().includes(q) ||
        s.verdictBadge.toLowerCase().includes(q)
      );
    });
  }, [checkerGroup, checkerQuery]);

  // Filtered Masnoon Sunnah Playbooks
  const filteredSunnahPlaybooks = useMemo(() => {
    const q = sunnahQuery.trim().toLowerCase();
    return SUNNAH_PLAYBOOKS.filter((pb) => {
      const done = Boolean(sunnahChecks[pb.id]);
      if (sunnahStatusFilter === "Completed" && !done) return false;
      if (sunnahStatusFilter === "Remaining" && done) return false;
      if (sunnahCat !== "All" && pb.category !== sunnahCat) return false;
      if (!q) return true;
      return (
        pb.title.toLowerCase().includes(q) ||
        pb.occasion.toLowerCase().includes(q) ||
        pb.meaning.toLowerCase().includes(q) ||
        pb.transliteration.toLowerCase().includes(q) ||
        pb.steps.some((s) => s.toLowerCase().includes(q))
      );
    });
  }, [sunnahQuery, sunnahChecks, sunnahStatusFilter, sunnahCat]);

  return (
    <div className="space-y-6">
      {/* Studio Hero Header */}
      <section
        className="bento-card p-5 sm:p-6 relative overflow-hidden"
        style={{
          background:
            "linear-gradient(135deg, rgba(71, 30, 138, 0.38) 0%, rgba(18, 25, 49, 0.96) 60%, rgba(249, 176, 145, 0.12) 100%)",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#A44AFF]/15 border border-[#A44AFF]/35 text-[#DF98FA]">
              <Scale className="w-3.5 h-3.5" />
              <span>
                11 Hadith Books (36,500+ Hadiths) • Mukammal Tariqa-e-Namaz • Bahar-e-Shariat Fiqh
              </span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Sunni Hadith, Prayer Method &amp; Hanafi Fiqh Encyclopedia
            </h1>
            <p className="text-xs sm:text-sm" style={{ color: "var(--text-muted)" }}>
              Browse all canonical Sihah Sittah, Muwatta, Musnad &amp; Arba&apos;in Hadith books in Arabic, English &amp; Urdu, master the step-by-step Hanafi Prayer Method, and search verified Bahar-e-Shariat rulings.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs shrink-0">
            <span className="px-3 py-1.5 rounded-xl bg-amber-400/15 border border-amber-400/35 text-amber-300 font-bold">
              ★ {bookmarks.length} Saved Bookmarks
            </span>
            <Link
              href="/prayer"
              className="px-3.5 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1.5 hover:brightness-110"
              style={{
                borderColor: "var(--border-hairline)",
                backgroundColor: "var(--bg-muted)",
              }}
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400" />
              <span>Live Prayer Times</span>
            </Link>
          </div>
        </div>

        {/* 4 Main Studio Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-5 pt-4 border-t" style={{ borderColor: "var(--border-hairline)" }}>
          {[
            {
              id: "hadith",
              label: "All Hadith Books",
              sub: "11 Books • 36,500+ Hadiths",
              icon: BookOpen,
            },
            {
              id: "prayer-method",
              label: "Prayer Method (Namaz)",
              sub: "Wudu • 16 Steps • All Prayers",
              icon: Layers,
            },
            {
              id: "fiqh",
              label: "Hanafi Fiqh (Masa'il)",
              sub: "Bahar-e-Shariat & Checkers",
              icon: Scale,
            },
            {
              id: "sunnah",
              label: "Sunnah Playbooks",
              sub: `${SUNNAH_PLAYBOOKS.length} Masnoon Guides`,
              icon: Sparkles,
            },
          ].map((t) => {
            const Icon = t.icon;
            const active = activeTab === t.id;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => setActiveTab(t.id as MainStudioTab)}
                className="p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-start gap-2.5"
                style={{
                  borderColor: active ? "#A44AFF" : "var(--border-hairline)",
                  background: active
                    ? "linear-gradient(135deg, rgba(223,152,250,0.22), rgba(144,85,255,0.28))"
                    : "var(--bg-muted)",
                }}
              >
                <span
                  className="w-8 h-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: active
                      ? "rgba(164, 74, 255, 0.35)"
                      : "rgba(255,255,255,0.05)",
                    color: active ? "#FFFFFF" : "var(--accent-secondary)",
                  }}
                >
                  <Icon className="w-4 h-4" />
                </span>
                <div className="min-w-0">
                  <div className="text-xs sm:text-sm font-extrabold truncate">
                    {t.label}
                  </div>
                  <div
                    className="text-[10px] truncate"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {t.sub}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </section>

      {/* =====================================================================
          TAB 1: COMPLETE 11-BOOK HADITH LIBRARY WITH SEARCH & MULTI-FILTER
         ===================================================================== */}
      {activeTab === "hadith" && (
        <div className="space-y-5">
          {/* Book Collection Filter Pills */}
          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
            <div className="flex flex-wrap items-center gap-1.5">
              {(
                [
                  "All",
                  "Sihah Sittah (Six Canonical Books)",
                  "Muwatta & Hanafi Musnad",
                  "Arba'in & Hadith Qudsi",
                ] as const
              ).map((grp) => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setBookGroupFilter(grp)}
                  className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer transition-all"
                  style={{
                    borderColor:
                      bookGroupFilter === grp
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                    backgroundColor:
                      bookGroupFilter === grp
                        ? "var(--accent-soft)"
                        : "var(--bg-muted)",
                  }}
                >
                  {grp === "All" ? "All 11 Hadith Books" : grp}
                </button>
              ))}
            </div>

            {/* Language Display Toggles */}
            <div className="flex items-center gap-1.5">
              <span className="text-[11px] opacity-75 mr-1">Display:</span>
              {[
                { label: "Arabic", active: showArabic, toggle: () => setShowArabic((v) => !v) },
                { label: "English", active: showEnglish, toggle: () => setShowEnglish((v) => !v) },
                { label: "Urdu", active: showUrdu, toggle: () => setShowUrdu((v) => !v) },
              ].map((l) => (
                <button
                  key={l.label}
                  type="button"
                  onClick={l.toggle}
                  className="px-2.5 py-1 rounded-lg border text-[11px] font-bold cursor-pointer"
                  style={{
                    borderColor: l.active ? "#F9B091" : "var(--border-hairline)",
                    backgroundColor: l.active
                      ? "rgba(249, 176, 145, 0.16)"
                      : "var(--bg-muted)",
                    color: l.active ? "#F9B091" : "var(--text-muted)",
                  }}
                >
                  {l.active ? "✓ " : ""}
                  {l.label}
                </button>
              ))}
            </div>
          </div>

          {/* 11 Hadith Books Shelf Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2.5">
            {visibleBooks.map((b) => {
              const active = b.id === selectedBook.id;
              return (
                <button
                  key={b.id}
                  type="button"
                  onClick={() => {
                    setSelectedBookId(b.id);
                    setSelectedSectionNum(1);
                    setFullSearchActive(false);
                    setFullSearchResults(null);
                    setHadithPage(1);
                  }}
                  className="p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between"
                  style={{
                    borderColor: active ? "#F9B091" : "var(--border-hairline)",
                    backgroundColor: active
                      ? "rgba(249, 176, 145, 0.14)"
                      : "var(--bg-surface)",
                  }}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-[#A44AFF]/15 text-[#DF98FA]">
                        {b.totalHadiths.toLocaleString()} Hadiths
                      </span>
                      <span className="font-arabic text-sm text-[#F9B091]">
                        {b.arabicTitle}
                      </span>
                    </div>
                    <h3 className="text-sm font-extrabold mt-1.5 truncate">
                      {b.title}
                    </h3>
                    <p
                      className="text-[11px] truncate mt-0.5"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {b.compiler}
                    </p>
                  </div>
                  <div className="flex items-center justify-between text-[10px] mt-2 pt-1.5 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                    <span style={{ color: "var(--text-muted)" }}>
                      {b.totalSections} {b.totalSections === 1 ? "Book" : "Kitabs"}
                    </span>
                    <span className="text-emerald-400 font-semibold">
                      {b.eraHijri}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Selected Book Scholarly Banner + Search, Grade Filter & Hadith # Jump */}
          <div className="bento-card p-4 sm:p-5 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-lg sm:text-xl font-extrabold">
                    {selectedBook.title}
                  </h2>
                  <span className="font-arabic text-lg text-[#F9B091]">
                    ({selectedBook.arabicTitle})
                  </span>
                </div>
                <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                  {selectedBook.sunniIntro}
                </p>
              </div>
            </div>

            {/* Unified Hadith Search, Full-Book Search, Hadith # Jump & Grade Filter */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-2.5">
              <div
                className="lg:col-span-5 flex items-center gap-2 px-3 py-2 rounded-xl border"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <Search className="w-4 h-4 opacity-60 shrink-0" />
                <input
                  type="text"
                  value={hadithQuery}
                  onChange={(e) => {
                    setHadithQuery(e.target.value);
                    if (!e.target.value.trim()) {
                      setFullSearchActive(false);
                      setFullSearchResults(null);
                    }
                    setHadithPage(1);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && !selectedBook.isBuiltInAnthology) {
                      runFullBookSearch();
                    }
                  }}
                  placeholder={
                    selectedBook.isBuiltInAnthology
                      ? "Search Arabic, English, Urdu, Narrator, or Commentary..."
                      : `Filter open chapter or press 'Search All ${selectedBook.totalHadiths.toLocaleString()}'...`
                  }
                  className="w-full bg-transparent outline-none text-xs sm:text-sm"
                />
              </div>

              {!selectedBook.isBuiltInAnthology && (
                <>
                  <button
                    type="button"
                    disabled={!hadithQuery.trim() || fullSearchLoading}
                    onClick={runFullBookSearch}
                    className="lg:col-span-3 btn-primary px-3 py-2 rounded-xl text-xs font-extrabold cursor-pointer disabled:opacity-45 inline-flex items-center justify-center gap-1.5"
                  >
                    {fullSearchLoading ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Search className="w-3.5 h-3.5" />
                    )}
                    <span>
                      Search All {selectedBook.totalHadiths.toLocaleString()}
                    </span>
                  </button>

                  <div
                    className="lg:col-span-2 flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-muted)",
                    }}
                  >
                    <Hash className="w-3.5 h-3.5 text-[#F9B091] shrink-0" />
                    <input
                      type="number"
                      min={1}
                      max={selectedBook.totalHadiths}
                      value={jumpNumberInput}
                      onChange={(e) => setJumpNumberInput(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") runJumpToHadithNumber();
                      }}
                      placeholder="Hadith #"
                      className="w-full bg-transparent outline-none text-xs"
                    />
                    <button
                      type="button"
                      onClick={runJumpToHadithNumber}
                      className="px-2 py-1 rounded-lg bg-[#A44AFF]/25 text-[#DF98FA] text-[11px] font-bold cursor-pointer"
                    >
                      Go
                    </button>
                  </div>
                </>
              )}

              {/* Grade & Bookmark Filters */}
              <div className="lg:col-span-2 flex items-center gap-1.5">
                <select
                  value={hadithGradeFilter}
                  onChange={(e) => {
                    setHadithGradeFilter(e.target.value as "All" | "Sahih" | "Hasan");
                    setHadithPage(1);
                  }}
                  className="ui-select flex-1 px-2.5 py-2 rounded-xl border text-xs font-semibold"
                  style={{
                    borderColor: "var(--border-hairline)",
                    backgroundColor: "var(--bg-muted)",
                    color: "var(--text-primary)",
                  }}
                >
                  <option value="All">All Grades</option>
                  <option value="Sahih">Sahih Only</option>
                  <option value="Hasan">Hasan Only</option>
                </select>

                <button
                  type="button"
                  onClick={() => setOnlyBookmarkedHadith((b) => !b)}
                  title="Filter Bookmarked Hadiths"
                  className="p-2 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: onlyBookmarkedHadith
                      ? "#F59E0B"
                      : "var(--border-hairline)",
                    backgroundColor: onlyBookmarkedHadith
                      ? "rgba(245, 158, 11, 0.18)"
                      : "var(--bg-muted)",
                  }}
                >
                  <Bookmark
                    className={`w-4 h-4 ${
                      onlyBookmarkedHadith ? "text-amber-400 fill-amber-400" : ""
                    }`}
                  />
                </button>
              </div>
            </div>

            {/* Topic Filter when viewing Built-in Sunni Anthology */}
            {selectedBook.isBuiltInAnthology && (
              <div className="flex flex-wrap gap-1.5 pt-1">
                {[
                  "All",
                  "Iman & Aqaid",
                  "Ilm & Sunnah",
                  "Taharah & Salah",
                  "Zakat & Charity",
                  "Sawm & Ramadan",
                  "Dhikr, Dua & Durood",
                  "Auliya, Sahabah & Ahl al-Bayt",
                  "Akhlaq, Adab & Mu'amalat",
                ].map((topic) => (
                  <button
                    key={topic}
                    type="button"
                    onClick={() => setAnthologyTopicFilter(topic)}
                    className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold cursor-pointer"
                    style={{
                      borderColor:
                        anthologyTopicFilter === topic
                          ? "var(--accent-primary)"
                          : "var(--border-hairline)",
                      backgroundColor:
                        anthologyTopicFilter === topic
                          ? "var(--accent-soft)"
                          : "transparent",
                    }}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Hadith Reader Workspace */}
          {selectedBook.isBuiltInAnthology ? (
            <div className="space-y-3.5">
              <div className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                Showing {filteredAnthology.length} of {HADITH_COLLECTION.length} Sunni Anthology Narrations
              </div>
              {filteredAnthology.map((h) => {
                const isSaved = bookmarks.includes(h.id);
                return (
                  <article key={h.id} className="bento-card p-5 space-y-3.5">
                    <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-2">
                        <span
                          className="font-extrabold inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg"
                          style={{
                            backgroundColor: "var(--gold-soft)",
                            color: "var(--accent-gold)",
                          }}
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          {h.collection} ({h.refNumber})
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold text-[11px]">
                          {h.grade}
                        </span>
                        <span className="px-2.5 py-1 rounded-lg bg-[#A44AFF]/15 text-[#DF98FA] font-semibold text-[11px]">
                          {h.topic}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => speakArabicOrEnglish(h.arabic, "ar-SA")}
                          className="p-1.5 rounded-lg border cursor-pointer hover:brightness-110"
                          style={{ borderColor: "var(--border-hairline)" }}
                          title="Listen Arabic"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-[#DF98FA]" />
                        </button>
                        <button
                          type="button"
                          onClick={() =>
                            copyCitation(
                              h.id,
                              `${h.collection} (${h.refNumber}) — Narrated by ${h.narrator}:\n${h.arabic}\n"${h.english}"\n${h.urdu}`
                            )
                          }
                          className="p-1.5 rounded-lg border cursor-pointer hover:brightness-110"
                          style={{ borderColor: "var(--border-hairline)" }}
                          title="Copy Hadith"
                        >
                          {copiedId === h.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(h.id)}
                          className="p-1.5 rounded-lg border cursor-pointer hover:brightness-110"
                          style={{ borderColor: "var(--border-hairline)" }}
                          title="Bookmark Hadith"
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${
                              isSaved ? "text-amber-400 fill-amber-400" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <div className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                      Narrated by <strong className="text-white">{h.narrator}</strong> • Chapter: {h.chapter}
                    </div>

                    {showArabic && (
                      <p
                        dir="rtl"
                        className="font-arabic text-xl sm:text-2xl text-right leading-loose p-3.5 rounded-2xl"
                        style={{ backgroundColor: "var(--bg-muted)" }}
                      >
                        {h.arabic}
                      </p>
                    )}

                    {showEnglish && (
                      <p className="text-sm leading-relaxed">{h.english}</p>
                    )}

                    {showUrdu && (
                      <p
                        dir="rtl"
                        className="font-urdu text-right text-base opacity-95 leading-loose"
                      >
                        {h.urdu}
                      </p>
                    )}

                    <div
                      className="p-3.5 rounded-xl text-xs border-l-4"
                      style={{
                        backgroundColor: "var(--bg-muted)",
                        borderLeftColor: "#F9B091",
                        color: "var(--text-muted)",
                      }}
                    >
                      <strong style={{ color: "var(--accent-gold)" }}>
                        Sunni Hanafi-Maturidi Sharh:
                      </strong>{" "}
                      {h.sunniNote}
                    </div>
                  </article>
                );
              })}
            </div>
          ) : (
            /* Canonical 10-Book Split Workspace: Left Kitab Navigator + Right Trilingual Hadith Stream */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
              {/* Left Kitab / Chapter Sidebar */}
              <aside className="lg:col-span-4 bento-card p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-extrabold uppercase tracking-wider text-[#DF98FA]">
                    Kitabs / Chapters ({bookSections.length})
                  </h3>
                  {fullSearchActive && (
                    <button
                      type="button"
                      onClick={() => {
                        setFullSearchActive(false);
                        setFullSearchResults(null);
                      }}
                      className="text-[11px] font-bold text-amber-300 underline cursor-pointer"
                    >
                      Back to Chapters
                    </button>
                  )}
                </div>

                {selectedBook.totalSections > 3 && (
                  <div
                    className="flex items-center gap-2 px-3 py-1.5 rounded-xl border"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-muted)",
                    }}
                  >
                    <Filter className="w-3.5 h-3.5 opacity-60" />
                    <input
                      type="text"
                      value={sectionSearchQuery}
                      onChange={(e) => setSectionSearchQuery(e.target.value)}
                      placeholder="Filter Kitab / Chapter..."
                      className="w-full bg-transparent outline-none text-xs"
                    />
                  </div>
                )}

                <div className="max-h-[540px] overflow-y-auto space-y-1.5 pr-1">
                  {bookSections.map((sec) => {
                    const active =
                      !fullSearchActive && activeSectionMeta?.num === sec.num;
                    return (
                      <button
                        key={sec.num}
                        type="button"
                        onClick={() => {
                          setFullSearchActive(false);
                          setFullSearchResults(null);
                          setSelectedSectionNum(sec.num);
                          setHadithPage(1);
                        }}
                        className="w-full text-left p-2.5 rounded-xl border text-xs transition-all cursor-pointer flex items-center justify-between gap-2"
                        style={{
                          borderColor: active
                            ? "#A44AFF"
                            : "var(--border-hairline)",
                          backgroundColor: active
                            ? "rgba(164, 74, 255, 0.18)"
                            : "var(--bg-muted)",
                        }}
                      >
                        <div className="min-w-0">
                          <span className="font-bold text-[#F9B091] mr-1.5">
                            {sec.num}.
                          </span>
                          <span className="font-semibold">{sec.title}</span>
                        </div>
                        {sec.first > 0 && (
                          <span
                            className="text-[10px] tabular-nums shrink-0"
                            style={{ color: "var(--text-muted)" }}
                          >
                            #{sec.first}–{sec.last}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </aside>

              {/* Right Hadith Reader Stream */}
              <div className="lg:col-span-8 space-y-4">
                <div className="bento-card p-4 flex flex-wrap items-center justify-between gap-2 text-xs">
                  <div>
                    {fullSearchActive ? (
                      <span className="font-extrabold text-amber-300">
                        Full-Book Search Results: {fullSearchResults?.total ?? 0}{" "}
                        matches in {selectedBook.title}
                      </span>
                    ) : (
                      <span className="font-extrabold">
                        Kitab {activeSectionMeta?.num}:{" "}
                        <span className="text-[#DF98FA]">
                          {activeSectionMeta?.title || selectedBook.title}
                        </span>{" "}
                        ({displayedRemoteHadiths.length} Hadiths)
                      </span>
                    )}
                  </div>

                  {totalHadithPages > 1 && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        disabled={hadithPage <= 1}
                        onClick={() => setHadithPage((p) => Math.max(1, p - 1))}
                        className="p-1.5 rounded-lg border disabled:opacity-35 cursor-pointer"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        <ChevronLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="tabular-nums font-bold">
                        Page {hadithPage}/{totalHadithPages}
                      </span>
                      <button
                        type="button"
                        disabled={hadithPage >= totalHadithPages}
                        onClick={() =>
                          setHadithPage((p) => Math.min(totalHadithPages, p + 1))
                        }
                        className="p-1.5 rounded-lg border disabled:opacity-35 cursor-pointer"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>

                {sectionError && (
                  <div className="p-4 rounded-2xl border border-amber-400/40 bg-amber-500/10 text-xs flex items-center gap-2.5 text-amber-200">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{sectionError}</span>
                  </div>
                )}

                {sectionLoading || fullSearchLoading ? (
                  <div className="bento-card p-10 flex flex-col items-center justify-center gap-3 text-xs">
                    <Loader2 className="w-6 h-6 animate-spin text-[#DF98FA]" />
                    <span>
                      Loading Arabic, English &amp; Urdu narrations from{" "}
                      {selectedBook.title}...
                    </span>
                  </div>
                ) : paginatedRemoteHadiths.length === 0 ? (
                  <div className="bento-card p-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
                    No matching Hadiths in this filter view. Try clearing the grade/bookmark filter or clicking &ldquo;Search All {selectedBook.totalHadiths.toLocaleString()}&rdquo;.
                  </div>
                ) : (
                  <div className="space-y-3.5">
                    {paginatedRemoteHadiths.map((h) => {
                      const isSaved = bookmarks.includes(h.uid);
                      return (
                        <article
                          key={h.uid}
                          className="bento-card p-5 space-y-3.5"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
                            <div className="flex flex-wrap items-center gap-2">
                              <span
                                className="px-2.5 py-1 rounded-lg font-extrabold"
                                style={{
                                  backgroundColor: "var(--gold-soft)",
                                  color: "var(--accent-gold)",
                                }}
                              >
                                {h.bookTitle} • Hadith #{h.hadithNumber}
                              </span>
                              <span className="px-2.5 py-1 rounded-lg bg-emerald-500/15 text-emerald-300 font-bold text-[11px]">
                                {h.primaryGrade}
                              </span>
                              <span
                                className="text-[11px]"
                                style={{ color: "var(--text-muted)" }}
                              >
                                {h.sectionTitle}
                              </span>
                            </div>

                            <div className="flex items-center gap-1.5">
                              {h.arabic && (
                                <button
                                  type="button"
                                  onClick={() =>
                                    speakArabicOrEnglish(h.arabic, "ar-SA")
                                  }
                                  className="p-1.5 rounded-lg border cursor-pointer hover:brightness-110"
                                  style={{ borderColor: "var(--border-hairline)" }}
                                  title="Listen Arabic"
                                >
                                  <Volume2 className="w-3.5 h-3.5 text-[#DF98FA]" />
                                </button>
                              )}
                              <button
                                type="button"
                                onClick={() =>
                                  copyCitation(
                                    h.uid,
                                    `${h.bookTitle} #${h.hadithNumber} (${h.sectionTitle})\n${h.arabic}\n${h.english}\n${h.urdu}`
                                  )
                                }
                                className="p-1.5 rounded-lg border cursor-pointer hover:brightness-110"
                                style={{ borderColor: "var(--border-hairline)" }}
                                title="Copy Citation"
                              >
                                {copiedId === h.uid ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleBookmark(h.uid)}
                                className="p-1.5 rounded-lg border cursor-pointer hover:brightness-110"
                                style={{ borderColor: "var(--border-hairline)" }}
                                title="Bookmark"
                              >
                                <Bookmark
                                  className={`w-3.5 h-3.5 ${
                                    isSaved
                                      ? "text-amber-400 fill-amber-400"
                                      : ""
                                  }`}
                                />
                              </button>
                            </div>
                          </div>

                          {h.narratorHint && (
                            <div
                              className="text-[11px] font-semibold"
                              style={{ color: "var(--text-muted)" }}
                            >
                              Narrator Chain Lead:{" "}
                              <strong className="text-white">
                                {h.narratorHint}
                              </strong>
                            </div>
                          )}

                          {showArabic && h.arabic && (
                            <p
                              dir="rtl"
                              className="font-arabic text-xl sm:text-2xl text-right leading-loose p-3.5 rounded-2xl"
                              style={{ backgroundColor: "var(--bg-muted)" }}
                            >
                              {h.arabic}
                            </p>
                          )}

                          {showEnglish && h.english && (
                            <p className="text-sm leading-relaxed">{h.english}</p>
                          )}

                          {showUrdu && h.urdu && (
                            <p
                              dir="rtl"
                              className="font-urdu text-right text-base leading-loose opacity-95"
                            >
                              {h.urdu}
                            </p>
                          )}

                          {h.grades.length > 0 && (
                            <div className="flex flex-wrap gap-1.5 pt-1">
                              {h.grades.slice(0, 3).map((g, idx) => (
                                <span
                                  key={idx}
                                  className="px-2 py-0.5 rounded-md text-[10px] border"
                                  style={{
                                    borderColor: "var(--border-hairline)",
                                    color: "var(--text-muted)",
                                  }}
                                >
                                  {g.name}: <strong>{g.grade}</strong>
                                </span>
                              ))}
                            </div>
                          )}
                        </article>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 2: COMPLETE STEP-BY-STEP HANAFI PRAYER METHOD (TARIQA-E-NAMAZ)
         ===================================================================== */}
      {activeTab === "prayer-method" && (
        <div className="space-y-5">
          {/* Sub-Navigation + Search Bar */}
          <div className="bento-card p-4 space-y-3.5">
            <div className="flex flex-wrap items-center justify-between gap-2.5">
              <div className="flex flex-wrap gap-1.5">
                {[
                  {
                    id: "walkthrough",
                    label: "16-Step Salah Walkthrough",
                  },
                  {
                    id: "blueprints",
                    label: "All 12 Prayer Types (Witr, Eid, Janazah...)",
                  },
                  {
                    id: "taharah",
                    label: "Wudu, Ghusl & Tayammum Method",
                  },
                  {
                    id: "matrix",
                    label: "Fara'id, Wajibat & Nullifiers Matrix",
                  },
                ].map((st) => (
                  <button
                    key={st.id}
                    type="button"
                    onClick={() => setPrayerSubTab(st.id as PrayerSubTab)}
                    className="px-3.5 py-2 rounded-xl text-xs font-extrabold border cursor-pointer transition-all"
                    style={{
                      borderColor:
                        prayerSubTab === st.id
                          ? "#F9B091"
                          : "var(--border-hairline)",
                      backgroundColor:
                        prayerSubTab === st.id
                          ? "rgba(249, 176, 145, 0.18)"
                          : "var(--bg-muted)",
                      color:
                        prayerSubTab === st.id ? "#F9B091" : "var(--text-primary)",
                    }}
                  >
                    {st.label}
                  </button>
                ))}
              </div>

              {/* Search across Prayer Method */}
              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border w-full sm:w-72"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <Search className="w-3.5 h-3.5 opacity-60" />
                <input
                  type="text"
                  value={prayerSearch}
                  onChange={(e) => setPrayerSearch(e.target.value)}
                  placeholder="Search Qunoot, Ruku, Tashahhud, Janazah..."
                  className="w-full bg-transparent outline-none text-xs"
                />
              </div>
            </div>

            {/* Posture Mode Toggle + Phase/Ruling Filters when on Walkthrough */}
            {prayerSubTab === "walkthrough" && (
              <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t text-xs" style={{ borderColor: "var(--border-hairline)" }}>
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-[11px] font-bold opacity-75 flex items-center gap-1">
                    <Users className="w-3.5 h-3.5 text-[#DF98FA]" />
                    Hanafi Posture Guide:
                  </span>
                  {[
                    { id: "both", label: "Compare Both" },
                    { id: "brothers", label: "Brothers (Men)" },
                    { id: "sisters", label: "Sisters (Women)" },
                  ].map((m) => (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() =>
                        setPostureGenderMode(
                          m.id as "brothers" | "sisters" | "both"
                        )
                      }
                      className="px-2.5 py-1 rounded-lg border font-bold cursor-pointer"
                      style={{
                        borderColor:
                          postureGenderMode === m.id
                            ? "#A44AFF"
                            : "var(--border-hairline)",
                        backgroundColor:
                          postureGenderMode === m.id
                            ? "rgba(164, 74, 255, 0.2)"
                            : "transparent",
                      }}
                    >
                      {m.label}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  <select
                    value={posturePhaseFilter}
                    onChange={(e) => setPosturePhaseFilter(e.target.value)}
                    className="ui-select px-2.5 py-1.5 rounded-xl border text-xs font-semibold"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-muted)",
                    }}
                  >
                    <option value="All">All Salah Phases</option>
                    <option value="Opening & Qiyam">Opening &amp; Qiyam</option>
                    <option value="Ruku & Qaumah">Ruku &amp; Qaumah</option>
                    <option value="Sujood & Jalsah">Sujood &amp; Jalsah</option>
                    <option value="Qa'dah & Tashahhud">Qa&apos;dah &amp; Tashahhud</option>
                    <option value="Salam & Conclusion">Salam &amp; Conclusion</option>
                  </select>

                  <select
                    value={postureRulingFilter}
                    onChange={(e) => setPostureRulingFilter(e.target.value)}
                    className="ui-select px-2.5 py-1.5 rounded-xl border text-xs font-semibold"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-muted)",
                    }}
                  >
                    <option value="All">All Rulings</option>
                    <option value="Shart (Condition)">Shart (Condition)</option>
                    <option value="Fard (Rukn)">Fard (Rukn)</option>
                    <option value="Wajib">Wajib</option>
                    <option value="Sunnah Mu'akkadah">Sunnah Mu&apos;akkadah</option>
                    <option value="Mustahabb">Mustahabb</option>
                  </select>

                  <button
                    type="button"
                    onClick={() =>
                      setWalkthroughViewMode((v) =>
                        v === "all" ? "guided" : "all"
                      )
                    }
                    className="px-3 py-1.5 rounded-xl border font-bold cursor-pointer"
                    style={{
                      borderColor: "#4ADE80",
                      backgroundColor:
                        walkthroughViewMode === "guided"
                          ? "rgba(74, 222, 128, 0.2)"
                          : "transparent",
                      color: "#4ADE80",
                    }}
                  >
                    {walkthroughViewMode === "guided"
                      ? "Show All 16 Steps"
                      : "Interactive Step-by-Step"}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* SUB-TAB A: 16-STEP SALAH WALKTHROUGH */}
          {prayerSubTab === "walkthrough" && (
            <div className="space-y-4">
              {walkthroughViewMode === "guided" && filteredPostureSteps.length > 0 && (
                <div className="flex items-center justify-between bento-card p-3.5 text-xs">
                  <button
                    type="button"
                    disabled={guidedStepIdx <= 0}
                    onClick={() => setGuidedStepIdx((i) => Math.max(0, i - 1))}
                    className="px-3 py-1.5 rounded-xl border font-bold disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <ChevronLeft className="w-4 h-4" /> Previous Posture
                  </button>
                  <span className="font-extrabold text-[#F9B091]">
                    Step {Math.min(guidedStepIdx + 1, filteredPostureSteps.length)} of{" "}
                    {filteredPostureSteps.length}
                  </span>
                  <button
                    type="button"
                    disabled={guidedStepIdx >= filteredPostureSteps.length - 1}
                    onClick={() =>
                      setGuidedStepIdx((i) =>
                        Math.min(filteredPostureSteps.length - 1, i + 1)
                      )
                    }
                    className="btn-primary px-3.5 py-1.5 rounded-xl font-bold disabled:opacity-40 cursor-pointer inline-flex items-center gap-1"
                  >
                    Next Posture <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              )}

              {(walkthroughViewMode === "guided"
                ? filteredPostureSteps.slice(guidedStepIdx, guidedStepIdx + 1)
                : filteredPostureSteps
              ).map((step) => (
                <article
                  key={step.id}
                  className="bento-card p-5 sm:p-6 space-y-4"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <span className="w-9 h-9 rounded-2xl bg-gradient-to-br from-[#DF98FA] to-[#9055FF] text-white font-extrabold text-sm flex items-center justify-center shrink-0">
                        {step.stepNumber}
                      </span>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h3 className="text-base sm:text-lg font-extrabold">
                            {step.title}
                          </h3>
                          <span className="font-arabic text-base text-[#F9B091]">
                            ({step.arabicTitle})
                          </span>
                        </div>
                        <div className="flex flex-wrap items-center gap-2 text-[11px] mt-0.5">
                          <span className="px-2 py-0.5 rounded-md bg-amber-400/15 text-amber-300 font-bold">
                            {step.ruling}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#A44AFF]/15 text-[#DF98FA] font-semibold">
                            {step.phase}
                          </span>
                          <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                            <Eye className="w-3 h-3" /> Gaze: {step.gazeTarget}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Hanafi Posture Cards (Brothers / Sisters / Both) */}
                  <div
                    className={`grid grid-cols-1 ${
                      postureGenderMode === "both" ? "md:grid-cols-2" : ""
                    } gap-3`}
                  >
                    {(postureGenderMode === "both" ||
                      postureGenderMode === "brothers") && (
                      <div
                        className="p-3.5 rounded-2xl border space-y-1"
                        style={{
                          borderColor: "rgba(56, 189, 248, 0.35)",
                          backgroundColor: "rgba(56, 189, 248, 0.06)",
                        }}
                      >
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-sky-300">
                          Hanafi Method — Brothers (Men)
                        </div>
                        <p className="text-xs leading-relaxed">
                          {step.brothersPosture}
                        </p>
                      </div>
                    )}

                    {(postureGenderMode === "both" ||
                      postureGenderMode === "sisters") && (
                      <div
                        className="p-3.5 rounded-2xl border space-y-1"
                        style={{
                          borderColor: "rgba(223, 152, 250, 0.35)",
                          backgroundColor: "rgba(223, 152, 250, 0.07)",
                        }}
                      >
                        <div className="text-[11px] font-extrabold uppercase tracking-wider text-[#DF98FA]">
                          Hanafi Method — Sisters (Women • Modest Satr)
                        </div>
                        <p className="text-xs leading-relaxed">
                          {step.sistersPosture}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* Liturgical Recitation Box */}
                  {step.recitation && (
                    <div
                      className="p-4 rounded-2xl border space-y-2.5"
                      style={{
                        borderColor: "var(--border-hairline)",
                        backgroundColor: "var(--bg-muted)",
                      }}
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-extrabold text-[#F9B091]">
                          Recitation: {step.recitation.label}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            speakArabicOrEnglish(step.recitation!.arabic, "ar-SA")
                          }
                          className="px-2.5 py-1 rounded-lg bg-[#A44AFF]/20 text-[#DF98FA] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3.5 h-3.5" /> Listen Arabic
                        </button>
                      </div>
                      <p
                        dir="rtl"
                        className="font-arabic text-xl sm:text-2xl text-right leading-loose"
                      >
                        {step.recitation.arabic}
                      </p>
                      <p className="text-xs italic text-[#DF98FA] font-medium">
                        {step.recitation.transliteration}
                      </p>
                      <p className="text-xs leading-relaxed">
                        {step.recitation.english}
                      </p>
                      <p
                        dir="rtl"
                        className="font-urdu text-right text-sm opacity-90"
                      >
                        {step.recitation.urdu}
                      </p>
                    </div>
                  )}

                  <div className="text-xs px-3 py-2 rounded-xl bg-emerald-500/10 border border-emerald-500/25 text-emerald-200">
                    <strong>Bahar-e-Shariat Fiqh Note:</strong> {step.fiqhTip}
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* SUB-TAB B: ALL 12 PRAYER TYPES BLUEPRINTS */}
          {prayerSubTab === "blueprints" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  "All",
                  "Daily Fard",
                  "Sunnah & Wajib",
                  "Congregational & Eid",
                  "Janazah & Special Nafl",
                ].map((cat) => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setBlueprintCategoryFilter(cat)}
                    className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                    style={{
                      borderColor:
                        blueprintCategoryFilter === cat
                          ? "var(--accent-primary)"
                          : "var(--border-hairline)",
                      backgroundColor:
                        blueprintCategoryFilter === cat
                          ? "var(--accent-soft)"
                          : "var(--bg-muted)",
                    }}
                  >
                    {cat}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
                {/* Left Blueprint Selector */}
                <div className="lg:col-span-4 space-y-2">
                  {filteredBlueprints.map((bp) => {
                    const active = bp.id === activeBlueprint?.id;
                    return (
                      <button
                        key={bp.id}
                        type="button"
                        onClick={() => setSelectedBlueprintId(bp.id)}
                        className="w-full text-left p-3.5 rounded-2xl border transition-all cursor-pointer"
                        style={{
                          borderColor: active
                            ? "#F9B091"
                            : "var(--border-hairline)",
                          backgroundColor: active
                            ? "rgba(249, 176, 145, 0.14)"
                            : "var(--bg-surface)",
                        }}
                      >
                        <div className="flex items-center justify-between text-[10px] font-bold">
                          <span className="text-[#DF98FA]">{bp.category}</span>
                          <span className="text-amber-300">{bp.ruling}</span>
                        </div>
                        <div className="text-sm font-extrabold mt-1">
                          {bp.title}
                        </div>
                        <div
                          className="text-[11px] mt-0.5"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {bp.rakatsSummary}
                        </div>
                      </button>
                    );
                  })}
                </div>

                {/* Right Blueprint Complete Rak'at-by-Rak'at Guide */}
                {activeBlueprint && (
                  <div className="lg:col-span-8 bento-card p-5 sm:p-6 space-y-4">
                    <div className="flex flex-wrap items-start justify-between gap-2">
                      <div>
                        <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-400/15 text-amber-300">
                          {activeBlueprint.ruling} • {activeBlueprint.timeWindow}
                        </span>
                        <h3 className="text-xl font-extrabold mt-1.5">
                          {activeBlueprint.title}{" "}
                          <span className="font-arabic text-[#F9B091] font-normal">
                            ({activeBlueprint.arabicTitle})
                          </span>
                        </h3>
                        <p
                          className="text-xs mt-1 leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {activeBlueprint.overview}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggleBookmark(activeBlueprint.id)}
                        className="p-2 rounded-xl border cursor-pointer"
                        style={{ borderColor: "var(--border-hairline)" }}
                      >
                        <Bookmark
                          className={`w-4 h-4 ${
                            bookmarks.includes(activeBlueprint.id)
                              ? "text-amber-400 fill-amber-400"
                              : ""
                          }`}
                        />
                      </button>
                    </div>

                    {/* Step-by-Step Rak'at Instructions */}
                    <div className="space-y-2.5">
                      {activeBlueprint.rakatByRakat.map((rk, i) => (
                        <div
                          key={i}
                          className="p-3.5 rounded-2xl border"
                          style={{
                            borderColor: "var(--border-hairline)",
                            backgroundColor: "var(--bg-muted)",
                          }}
                        >
                          <div className="text-xs font-extrabold text-[#DF98FA]">
                            {rk.heading}
                          </div>
                          <p className="text-xs leading-relaxed mt-1">
                            {rk.instructions}
                          </p>
                        </div>
                      ))}
                    </div>

                    {/* Special Dua / Recitation (e.g., Dua-e-Qunoot, Janazah Dua, Istikharah Dua) */}
                    {activeBlueprint.keyRecitation && (
                      <div
                        className="p-4 rounded-2xl border-2 space-y-2.5"
                        style={{
                          borderColor: "rgba(249, 176, 145, 0.45)",
                          backgroundColor: "rgba(249, 176, 145, 0.08)",
                        }}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold text-[#F9B091]">
                            {activeBlueprint.keyRecitation.title}
                          </span>
                          <button
                            type="button"
                            onClick={() =>
                              speakArabicOrEnglish(
                                activeBlueprint.keyRecitation!.arabic,
                                "ar-SA"
                              )
                            }
                            className="px-2.5 py-1 rounded-lg bg-[#A44AFF]/20 text-[#DF98FA] text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer"
                          >
                            <Volume2 className="w-3.5 h-3.5" /> Audio
                          </button>
                        </div>
                        <p
                          dir="rtl"
                          className="font-arabic text-xl sm:text-2xl text-right leading-loose"
                        >
                          {activeBlueprint.keyRecitation.arabic}
                        </p>
                        <p className="text-xs italic text-[#DF98FA]">
                          {activeBlueprint.keyRecitation.transliteration}
                        </p>
                        <p className="text-xs leading-relaxed">
                          {activeBlueprint.keyRecitation.english}
                        </p>
                        <p
                          dir="rtl"
                          className="font-urdu text-right text-sm opacity-90"
                        >
                          {activeBlueprint.keyRecitation.urdu}
                        </p>
                      </div>
                    )}

                    {/* Important Hanafi Rulings */}
                    <div className="space-y-1.5">
                      <div className="text-xs font-extrabold text-emerald-400 uppercase tracking-wider">
                        Key Hanafi Rulings ({activeBlueprint.source})
                      </div>
                      <ul className="space-y-1.5 text-xs">
                        {activeBlueprint.hanafiNotes.map((n, idx) => (
                          <li key={idx} className="flex items-start gap-2">
                            <span className="text-emerald-400 font-bold">✓</span>
                            <span>{n}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* SUB-TAB C: PURIFICATION METHODS (WUDU, GHUSL, TAYAMMUM) */}
          {prayerSubTab === "taharah" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2">
                {TAHARAH_METHODS.map((tm) => (
                  <button
                    key={tm.id}
                    type="button"
                    onClick={() => setSelectedTaharahId(tm.id)}
                    className="px-4 py-2 rounded-2xl border text-xs font-extrabold cursor-pointer"
                    style={{
                      borderColor:
                        selectedTaharahId === tm.id
                          ? "#4ADE80"
                          : "var(--border-hairline)",
                      backgroundColor:
                        selectedTaharahId === tm.id
                          ? "rgba(74, 222, 128, 0.16)"
                          : "var(--bg-surface)",
                    }}
                  >
                    {tm.title} ({tm.urduTitle})
                  </button>
                ))}
              </div>

              <div className="bento-card p-5 sm:p-6 space-y-5">
                <div>
                  <span className="text-xs font-bold text-emerald-400">
                    {activeTaharah.source}
                  </span>
                  <h3 className="text-xl font-extrabold mt-0.5">
                    {activeTaharah.title}{" "}
                    <span className="font-urdu text-[#F9B091] font-normal">
                      ({activeTaharah.urduTitle})
                    </span>
                  </h3>
                  <p className="text-xs mt-1" style={{ color: "var(--text-muted)" }}>
                    {activeTaharah.subtitle}
                  </p>
                </div>

                {/* Fara'id Box */}
                <div className="p-4 rounded-2xl bg-amber-400/10 border border-amber-400/35 space-y-2">
                  <div className="text-xs font-extrabold text-amber-300 uppercase tracking-wider">
                    Obligatory Pillars (Fara&apos;id — Without Any One, Purification Is Incomplete)
                  </div>
                  <ul className="space-y-1.5 text-xs">
                    {activeTaharah.faraid.map((f, idx) => (
                      <li key={idx} className="font-semibold">
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Complete Step-by-Step Sunnah Sequence */}
                <div className="space-y-2.5">
                  <h4 className="text-sm font-extrabold text-[#DF98FA]">
                    Complete Prophetic Sunnah Method (Step-by-Step)
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {activeTaharah.sunanSteps.map((st) => (
                      <div
                        key={st.stepNum}
                        className="p-3.5 rounded-2xl border space-y-1.5"
                        style={{
                          borderColor: "var(--border-hairline)",
                          backgroundColor: "var(--bg-muted)",
                        }}
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-extrabold">
                            Step {st.stepNum}: {st.title}
                          </span>
                          <span className="px-2 py-0.5 rounded-md bg-[#A44AFF]/20 text-[#DF98FA] text-[10px] font-bold">
                            {st.ruling}
                          </span>
                        </div>
                        <p
                          className="text-xs leading-relaxed"
                          style={{ color: "var(--text-muted)" }}
                        >
                          {st.detail}
                        </p>
                        {st.arabicDua && (
                          <div className="pt-1 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                            <p
                              dir="rtl"
                              className="font-arabic text-lg text-right text-[#F9B091]"
                            >
                              {st.arabicDua}
                            </p>
                            {st.transliteration && (
                              <p className="text-[11px] italic text-[#DF98FA]">
                                {st.transliteration}
                              </p>
                            )}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Nullifiers */}
                <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-400/30 space-y-2">
                  <div className="text-xs font-extrabold text-rose-300 uppercase tracking-wider">
                    Hanafi Nullifiers (Nawaqid)
                  </div>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 text-xs">
                    {activeTaharah.nullifiers.map((nl, i) => (
                      <li key={i}>• {nl}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          {/* SUB-TAB D: SALAH ARCHITECTURE MATRIX */}
          {prayerSubTab === "matrix" && (
            <div className="space-y-4">
              <div className="flex flex-wrap gap-1.5 text-xs">
                {[
                  "All",
                  "6 Shara'it (Pre-Conditions)",
                  "6 Fara'id (Inner Pillars)",
                  "14 Wajibat of Salah",
                  "Key Sunan of Salah",
                  "Mufsidat (Nullifiers of Salah)",
                ].map((grp) => (
                  <button
                    key={grp}
                    type="button"
                    onClick={() => setMatrixGroupFilter(grp)}
                    className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                    style={{
                      borderColor:
                        matrixGroupFilter === grp
                          ? "var(--accent-primary)"
                          : "var(--border-hairline)",
                      backgroundColor:
                        matrixGroupFilter === grp
                          ? "var(--accent-soft)"
                          : "var(--bg-muted)",
                    }}
                  >
                    {grp}
                  </button>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                {filteredMatrix.map((item) => (
                  <div
                    key={item.id}
                    className="bento-card p-4 space-y-2 flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#A44AFF]/15 text-[#DF98FA]">
                        {item.group}
                      </span>
                      <h4 className="text-sm font-extrabold">{item.title}</h4>
                      <p
                        className="text-xs leading-relaxed"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {item.detail}
                      </p>
                    </div>
                    <div className="p-2.5 rounded-xl bg-amber-400/10 border border-amber-400/25 text-[11px] text-amber-200 font-medium">
                      <strong>If Omitted:</strong> {item.consequenceIfMissed}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =====================================================================
          TAB 3: HANAFI FIQH ENCYCLOPEDIA (BAHAR-E-SHARIAT) + RULING CHECKER
         ===================================================================== */}
      {activeTab === "fiqh" && (
        <div className="space-y-6">
          {/* Interactive Quick Ruling Checker */}
          <section className="bento-card p-5 space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                  <HelpCircle className="w-3.5 h-3.5" />
                  <span>Instant Hanafi Ruling Checker (Everyday Masa&apos;il)</span>
                </div>
                <h2 className="text-lg font-extrabold mt-0.5">
                  Does This Break My Wudu, Salah, or Fast?
                </h2>
              </div>

              <div
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl border w-full sm:w-64"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <Search className="w-3.5 h-3.5 opacity-60" />
                <input
                  type="text"
                  value={checkerQuery}
                  onChange={(e) => setCheckerQuery(e.target.value)}
                  placeholder="Filter blood, eye drops, Qasr..."
                  className="w-full bg-transparent outline-none text-xs"
                />
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5 text-xs">
              {(
                [
                  "All",
                  "Wudu Validity",
                  "Sajda-e-Sahw",
                  "Fasting (Roza)",
                  "Traveler (Qasr)",
                ] as const
              ).map((grp) => (
                <button
                  key={grp}
                  type="button"
                  onClick={() => setCheckerGroup(grp)}
                  className="px-3 py-1.5 rounded-xl border font-bold cursor-pointer"
                  style={{
                    borderColor:
                      checkerGroup === grp
                        ? "#4ADE80"
                        : "var(--border-hairline)",
                    backgroundColor:
                      checkerGroup === grp
                        ? "rgba(74, 222, 128, 0.16)"
                        : "var(--bg-muted)",
                  }}
                >
                  {grp}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {filteredQuickScenarios.map((sc) => {
                const badgeStyles =
                  sc.verdictColor === "emerald"
                    ? "bg-emerald-500/20 text-emerald-300 border-emerald-400/40"
                    : sc.verdictColor === "amber"
                    ? "bg-amber-500/20 text-amber-300 border-amber-400/40"
                    : "bg-rose-500/20 text-rose-300 border-rose-400/40";
                return (
                  <div
                    key={sc.id}
                    className="p-4 rounded-2xl border space-y-2"
                    style={{
                      borderColor: "var(--border-hairline)",
                      backgroundColor: "var(--bg-muted)",
                    }}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <span className="text-[10px] font-bold uppercase text-[#DF98FA]">
                        {sc.checkerGroup}
                      </span>
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold border ${badgeStyles}`}
                      >
                        {sc.verdictBadge}
                      </span>
                    </div>
                    <h4 className="text-xs sm:text-sm font-extrabold">
                      {sc.question}
                    </h4>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {sc.explanation}
                    </p>
                    <div className="text-[10px] opacity-75 font-semibold">
                      Ref: {sc.source}
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Bahar-e-Shariat Encyclopedia Search & Multi-Filter */}
          <div className="bento-card p-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <Search className="w-4 h-4 opacity-60" />
                <input
                  type="text"
                  value={fiqhQuery}
                  onChange={(e) => setFiqhQuery(e.target.value)}
                  placeholder="Search 40+ Bahar-e-Shariat & Fatawa Razawiyya Masa'il (Wudu, Nisab, Nikah, Qurbani, Aqaid)..."
                  className="w-full bg-transparent outline-none text-xs sm:text-sm"
                />
              </div>

              <select
                value={fiqhRuling}
                onChange={(e) =>
                  setFiqhRuling(e.target.value as "All" | FiqhRulingStatus)
                }
                className="ui-select px-3 py-2 rounded-xl border text-xs font-bold"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                {RULING_STATUSES.map((r) => (
                  <option key={r} value={r}>
                    {r === "All" ? "All Ruling Levels" : `Ruling: ${r}`}
                  </option>
                ))}
              </select>

              <button
                type="button"
                onClick={() => setOnlyBookmarkedFiqh((v) => !v)}
                className="px-3 py-2 rounded-xl border text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer"
                style={{
                  borderColor: onlyBookmarkedFiqh
                    ? "#F59E0B"
                    : "var(--border-hairline)",
                  backgroundColor: onlyBookmarkedFiqh
                    ? "rgba(245, 158, 11, 0.16)"
                    : "var(--bg-muted)",
                }}
              >
                <Bookmark
                  className={`w-3.5 h-3.5 ${
                    onlyBookmarkedFiqh ? "text-amber-400 fill-amber-400" : ""
                  }`}
                />
                <span>Saved</span>
              </button>
            </div>

            {/* 10 Kitab Categories Filter Pills */}
            <div className="flex flex-wrap gap-1.5">
              {(["All", ...FIQH_CATEGORIES] as const).map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setFiqhCategory(cat)}
                  className="px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
                  style={{
                    borderColor:
                      fiqhCategory === cat
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                    backgroundColor:
                      fiqhCategory === cat
                        ? "var(--accent-soft)"
                        : "transparent",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
            Showing {filteredMasail.length} of {BAHAR_E_SHARIAT_MASAIL.length} Verified Hanafi Masa&apos;il
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredMasail.map((m) => {
              const saved = bookmarks.includes(m.id);
              return (
                <article
                  key={m.id}
                  className="bento-card p-5 space-y-3.5 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between gap-2 text-xs">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span
                          className="px-2.5 py-0.5 rounded-full font-bold"
                          style={{
                            backgroundColor: "var(--accent-soft)",
                            color: "var(--accent-secondary)",
                          }}
                        >
                          {m.category}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-400/15 text-amber-300 font-bold text-[11px]">
                          {m.ruling}
                        </span>
                      </div>
                      <div className="flex items-center gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            copyCitation(
                              m.id,
                              `${m.title} [${m.ruling} — ${m.source}]\n${m.summary}\n${m.steps.join("\n")}`
                            )
                          }
                          className="p-1.5 rounded-lg border cursor-pointer"
                          style={{ borderColor: "var(--border-hairline)" }}
                        >
                          {copiedId === m.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-400" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={() => toggleBookmark(m.id)}
                          className="p-1.5 rounded-lg border cursor-pointer"
                          style={{ borderColor: "var(--border-hairline)" }}
                        >
                          <Bookmark
                            className={`w-3.5 h-3.5 ${
                              saved ? "text-amber-400 fill-amber-400" : ""
                            }`}
                          />
                        </button>
                      </div>
                    </div>

                    <h3 className="text-base font-extrabold">{m.title}</h3>
                    <p
                      className="text-xs leading-relaxed"
                      style={{ color: "var(--text-muted)" }}
                    >
                      {m.summary}
                    </p>

                    <ul className="space-y-1.5 text-xs pt-1">
                      {m.steps.map((st, idx) => (
                        <li
                          key={idx}
                          className="p-2.5 rounded-xl"
                          style={{ backgroundColor: "var(--bg-muted)" }}
                        >
                          {st}
                        </li>
                      ))}
                    </ul>

                    <div className="p-2.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-[11px] text-emerald-200">
                      <strong>Dalil &amp; Source ({m.source}):</strong>{" "}
                      {m.dalilNote}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t text-xs" style={{ borderColor: "var(--border-hairline)" }}>
                    <div className="flex flex-wrap gap-1">
                      {m.tags.slice(0, 3).map((tg) => (
                        <span
                          key={tg}
                          className="text-[10px] opacity-70 px-1.5 py-0.5 rounded bg-white/5"
                        >
                          #{tg}
                        </span>
                      ))}
                    </div>
                    <Link
                      href={m.deepLink}
                      className="font-bold inline-flex items-center gap-1 text-[#DF98FA] hover:underline"
                    >
                      <span>Related Module</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 4: MASNOON SUNNAH PLAYBOOKS WITH SEARCH & HABIT FILTER
         ===================================================================== */}
      {activeTab === "sunnah" && (
        <div className="space-y-5">
          <div className="bento-card p-4 space-y-3.5">
            <div className="flex flex-col sm:flex-row gap-2.5">
              <div
                className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border"
                style={{
                  borderColor: "var(--border-hairline)",
                  backgroundColor: "var(--bg-muted)",
                }}
              >
                <Search className="w-4 h-4 opacity-60" />
                <input
                  type="text"
                  value={sunnahQuery}
                  onChange={(e) => setSunnahQuery(e.target.value)}
                  placeholder="Search Masnoon Sunnahs (Miswak, Eating, Masjid, Dressing, Travel, Sleep)..."
                  className="w-full bg-transparent outline-none text-xs sm:text-sm"
                />
              </div>

              <div className="flex items-center gap-1.5">
                {(["All", "Completed", "Remaining"] as const).map((st) => (
                  <button
                    key={st}
                    type="button"
                    onClick={() => setSunnahStatusFilter(st)}
                    className="px-3 py-2 rounded-xl border text-xs font-bold cursor-pointer"
                    style={{
                      borderColor:
                        sunnahStatusFilter === st
                          ? "#4ADE80"
                          : "var(--border-hairline)",
                      backgroundColor:
                        sunnahStatusFilter === st
                          ? "rgba(74, 222, 128, 0.16)"
                          : "var(--bg-muted)",
                    }}
                  >
                    {st}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-wrap gap-1.5">
              {SUNNAH_CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSunnahCat(cat)}
                  className="px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{
                    borderColor:
                      sunnahCat === cat
                        ? "var(--accent-primary)"
                        : "var(--border-hairline)",
                    backgroundColor:
                      sunnahCat === cat ? "var(--accent-soft)" : "transparent",
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredSunnahPlaybooks.map((pb) => {
              const added = Boolean(sunnahChecks[pb.id]);
              return (
                <div
                  key={pb.id}
                  className="bento-card p-5 space-y-3 flex flex-col justify-between"
                >
                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between text-[10px] font-bold">
                      <span className="px-2 py-0.5 rounded-md bg-[#A44AFF]/15 text-[#DF98FA]">
                        {pb.category}
                      </span>
                      <span style={{ color: "var(--text-muted)" }}>
                        {pb.hadithRef}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-sm sm:text-base">
                        {pb.title}
                      </h3>
                      <p
                        className="text-[11px]"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {pb.occasion}
                      </p>
                    </div>

                    <div
                      className="p-3 rounded-2xl space-y-1"
                      style={{ backgroundColor: "var(--bg-muted)" }}
                    >
                      <div className="flex justify-end">
                        <button
                          type="button"
                          onClick={() =>
                            speakArabicOrEnglish(pb.arabicDua, "ar-SA")
                          }
                          className="text-[10px] text-[#DF98FA] inline-flex items-center gap-1 cursor-pointer"
                        >
                          <Volume2 className="w-3 h-3" /> Audio
                        </button>
                      </div>
                      <p
                        dir="rtl"
                        className="font-arabic text-lg sm:text-xl text-right leading-loose text-[#F9B091]"
                      >
                        {pb.arabicDua}
                      </p>
                      <p className="text-[11px] italic text-[#DF98FA]">
                        {pb.transliteration}
                      </p>
                      <p
                        className="text-xs"
                        style={{ color: "var(--text-muted)" }}
                      >
                        {pb.meaning}
                      </p>
                      <p
                        dir="rtl"
                        className="font-urdu text-right text-sm opacity-90"
                      >
                        {pb.urduMeaning}
                      </p>
                    </div>

                    <ul className="space-y-1 text-xs pt-1">
                      {pb.steps.map((s, idx) => (
                        <li key={idx} className="flex items-start gap-1.5">
                          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                          <span>{s}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleSunnah(pb.id)}
                    className="w-full py-2.5 rounded-xl text-xs font-extrabold inline-flex items-center justify-center gap-1.5 cursor-pointer border transition-all"
                    style={{
                      borderColor: added
                        ? "#10B981"
                        : "var(--border-hairline)",
                      backgroundColor: added
                        ? "rgba(16, 185, 129, 0.16)"
                        : "var(--bg-muted)",
                      color: added ? "#4ADE80" : "var(--text-primary)",
                    }}
                  >
                    {added ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <Plus className="w-3.5 h-3.5" />
                    )}
                    <span>
                      {added
                        ? "Completed in Today's Sunnah Log"
                        : "Mark Completed Today"}
                    </span>
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function FiqhPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm" style={{ color: "var(--text-muted)" }}>
          Loading Hadith, Prayer Method &amp; Hanafi Fiqh Library...
        </div>
      }
    >
      <FiqhHadithInner />
    </Suspense>
  );
}
