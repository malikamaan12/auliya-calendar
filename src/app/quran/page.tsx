"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  BookOpen,
  Play,
  Pause,
  Repeat,
  Moon,
  Sparkles,
  CheckCircle2,
  Clock,
  ArrowRight,
  Search,
  Bookmark,
  Share2,
  ListMusic,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  AlignJustify,
  SkipBack,
  SkipForward,
  X,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { assetUrl } from "@/lib/assets";
import {
  HANAFI_SAJDA_ITEMS,
  HANAFI_SAJDA_REFS,
  JUZ_LIST,
  QURAN_AYAHS,
  QuranAyah,
  SURAH_LIST,
  getEveryAyahUrl,
  toArabicIndicDigits,
} from "@/data/quran";

interface CompactAyah {
  n: number;
  g: number;
  p: number;
  j: number;
  r: number;
  h: number;
  t: string;
  u: string;
  e: string;
}

interface CompactSurah {
  n: number;
  ar: string;
  en: string;
  tr: string;
  rv: "M" | "D";
  p: number;
  j: number;
  a: CompactAyah[];
}

interface DisplayAyah {
  id: string;
  globalNum: number;
  surahNum: number;
  surahName: string;
  surahArabic: string;
  ayahNum: number;
  page: number;
  juz: number;
  ruku: number;
  hizbQuarter: number;
  arabicIndoPak: string;
  arabicUthmani: string;
  transliteration: string;
  kanzulImanUrdu: string;
  kanzulImanEnglish: string;
  kanzulImanRomanUrdu?: string;
  kanzulImanHindi?: string;
  khazainUlIrfanNote?: string;
  hanafiSajda: boolean;
  shafiiOnlySajdaNote?: string;
  audioUrl: string;
  sha256: string;
}

const TOTAL_MUSHAF_PAGES = 604;
const BISMILLAH_TEXT = "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ";

const CURATED_BY_ID = new Map<string, QuranAyah>(QURAN_AYAHS.map((a) => [a.id, a]));

function parseRef(ref: string): { surahNum: number; ayahNum: number } {
  const [s, a] = ref.split(":").map((n) => parseInt(n, 10));
  return {
    surahNum: Number.isFinite(s) && s >= 1 && s <= 114 ? s : 1,
    ayahNum: Number.isFinite(a) && a >= 1 ? a : 1,
  };
}

function stripLeadingBismillah(text: string, surahNum: number, ayahNum: number): string {
  if (surahNum === 1 || surahNum === 9 || ayahNum !== 1) return text;
  const stripped = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, "");
  return stripped.length > 0 ? stripped : text;
}

function renderTajweedArabic(text: string, enabled: boolean): React.ReactNode {
  if (!enabled) return text;
  const parts = text.split(/(۩|[\u0622\u0670\u0653]|[^\s]\u0651[^\s]?)/g);
  return parts.map((part, i) => {
    if (!part) return null;
    if (part === "۩") {
      return (
        <span key={i} className="font-bold mx-1" style={{ color: "var(--accent-gold)" }}>
          {part}
        </span>
      );
    }
    if (/[\u0622\u0670\u0653]/.test(part)) {
      return (
        <span key={i} style={{ color: "var(--accent-primary)" }}>
          {part}
        </span>
      );
    }
    if (/\u0651/.test(part)) {
      return (
        <span key={i} style={{ color: "var(--accent-secondary)" }}>
          {part}
        </span>
      );
    }
    return <React.Fragment key={i}>{part}</React.Fragment>;
  });
}

function hydrateDisplayAyah(s: CompactSurah, ay: CompactAyah): DisplayAyah {
  const ref = `${s.n}:${ay.n}`;
  const curated = CURATED_BY_ID.get(ref);
  const isHanafiSajda = HANAFI_SAJDA_REFS.has(ref);
  const is22_77 = ref === "22:77";
  const cleanArabic = stripLeadingBismillah(ay.t, s.n, ay.n);

  return {
    id: ref,
    globalNum: ay.g,
    surahNum: s.n,
    surahName: s.en,
    surahArabic: s.ar,
    ayahNum: ay.n,
    page: ay.p,
    juz: ay.j,
    ruku: ay.r,
    hizbQuarter: ay.h,
    arabicIndoPak: curated?.arabicIndoPak ?? cleanArabic,
    arabicUthmani: cleanArabic,
    transliteration: curated?.transliteration ?? "",
    kanzulImanUrdu: ay.u || curated?.kanzulImanUrdu || "",
    kanzulImanEnglish: ay.e || curated?.kanzulImanEnglish || "",
    kanzulImanRomanUrdu: curated?.kanzulImanRomanUrdu,
    kanzulImanHindi: curated?.kanzulImanHindi,
    khazainUlIrfanNote:
      curated?.khazainUlIrfanNote ??
      (isHanafiSajda
        ? "Hanafi Fiqh (Bahar-e-Shariat): Sajda-e-Tilawat is Wajib upon reciting or hearing this verse."
        : is22_77
        ? "Note: In Hanafi Madhhab, 22:77 is NOT a Sajda-e-Tilawat (only 22:18 in Surah Al-Hajj is Wajib)."
        : undefined),
    hanafiSajda: isHanafiSajda,
    shafiiOnlySajdaNote: is22_77
      ? "Excluded from the 14 Hanafi Sajdas (Shafi'i-only marker; Hanafi Sajda in Al-Hajj is at 22:18)."
      : undefined,
    audioUrl: getEveryAyahUrl(s.n, ay.n),
    sha256: curated?.sha256 ?? `kanzul-iman-${s.n}-${ay.n}`,
  };
}

export default function QuranPage() {
  const {
    lang,
    lastQuranRef,
    logQuranAyah,
    sajdaQueue,
    sajdaCompleted,
    logSajda,
  } = useApp();

  const initialRef = useMemo(() => parseRef(lastQuranRef), [lastQuranRef]);
  const initialSurahMeta = useMemo(
    () => SURAH_LIST.find((s) => s.number === initialRef.surahNum) ?? SURAH_LIST[0],
    [initialRef.surahNum]
  );

  // Full 6,236-ayah dataset state
  const [quranData, setQuranData] = useState<CompactSurah[] | null>(null);
  const [loadingCorpus, setLoadingCorpus] = useState(true);
  const [corpusError, setCorpusError] = useState<string | null>(null);

  // View State: 1-Page Mushaf OR Detail Surah (Reference UI Card + Verse List)
  const [viewMode, setViewMode] = useState<"mushaf" | "surah" | "highlights">("mushaf");
  const [showMushafTarjuma, setShowMushafTarjuma] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(initialSurahMeta.startPage || 1);
  const [selectedSurah, setSelectedSurah] = useState<number>(initialRef.surahNum || 1);
  const [selectedAyahId, setSelectedAyahId] = useState<string>(lastQuranRef || "1:1");
  const [pageInput, setPageInput] = useState<string>(String(initialSurahMeta.startPage || 1));
  const [copiedId, setCopiedId] = useState<string | null>(null);

  // Drawers / Modals
  const [inspectorOpen, setInspectorOpen] = useState(false);
  const [sajdaDrawerOpen, setSajdaDrawerOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [ayahFilter, setAyahFilter] = useState("");

  // Reading preferences
  const [scriptMode, setScriptMode] = useState<"indopak" | "uthmani">("indopak");
  const [showTranslit, setShowTranslit] = useState(true);
  const [tajweedColor, setTajweedColor] = useState(true);
  const [openTafsirId, setOpenTafsirId] = useState<string | null>("18:28");
  const [tarjumaLang, setTarjumaLang] = useState<"ur" | "en" | "ro_ur" | "hi">(
    lang === "ur" || lang === "ro_ur" || lang === "hi" ? lang : "ur"
  );

  // Audio state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopAyah, setLoopAyah] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number | null>(null);

  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Support URL query params (?surah=X&page=Y) from the Dashboard Surah/Para/Sajda tabs
  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    const sParam = Number(params.get("surah"));
    const pParam = Number(params.get("page"));
    Promise.resolve().then(() => {
      if (Number.isFinite(sParam) && sParam >= 1 && sParam <= 114) {
        setSelectedSurah(sParam);
        const meta = SURAH_LIST.find((s) => s.number === sParam);
        if (meta && !pParam) {
          setCurrentPage(meta.startPage);
          setPageInput(String(meta.startPage));
        }
      }
      if (Number.isFinite(pParam) && pParam >= 1 && pParam <= TOTAL_MUSHAF_PAGES) {
        setCurrentPage(pParam);
        setPageInput(String(pParam));
      }
    });
  }, []);

  useEffect(() => {
    let cancelled = false;
    fetch(assetUrl("/data/quran-complete.json"))
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: { surahs: CompactSurah[] }) => {
        if (cancelled) return;
        setQuranData(json.surahs);
        setLoadingCorpus(false);
      })
      .catch(() => {
        if (cancelled) return;
        setCorpusError("Could not load the complete 604-page Mushaf dataset.");
        setLoadingCorpus(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const { pagesMap, surahMap, ayahByRef } = useMemo(() => {
    const pMap = new Map<number, DisplayAyah[]>();
    const sMap = new Map<number, DisplayAyah[]>();
    const rMap = new Map<string, DisplayAyah>();

    if (!quranData) return { pagesMap: pMap, surahMap: sMap, ayahByRef: rMap };

    for (const s of quranData) {
      const sList: DisplayAyah[] = [];
      for (const ay of s.a) {
        const d = hydrateDisplayAyah(s, ay);
        sList.push(d);
        rMap.set(d.id, d);
        const pList = pMap.get(d.page);
        if (pList) pList.push(d);
        else pMap.set(d.page, [d]);
      }
      sMap.set(s.n, sList);
    }

    return { pagesMap: pMap, surahMap: sMap, ayahByRef: rMap };
  }, [quranData]);

  const clampedPage = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, currentPage));
  const currentPageAyahs = useMemo(() => pagesMap.get(clampedPage) ?? [], [pagesMap, clampedPage]);

  const activeListAyahs: DisplayAyah[] = useMemo(() => {
    let base: DisplayAyah[] = [];
    if (viewMode === "mushaf") {
      base = currentPageAyahs;
    } else if (viewMode === "surah") {
      base = surahMap.get(selectedSurah) ?? [];
    } else {
      base = QURAN_AYAHS.map(
        (a) =>
          ayahByRef.get(a.id) ?? {
            ...a,
            globalNum: 1,
            page: 1,
            juz: 1,
            ruku: 1,
            hizbQuarter: 1,
          }
      );
    }
    const q = ayahFilter.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (a) =>
        a.id.includes(q) ||
        String(a.ayahNum) === q ||
        a.kanzulImanEnglish.toLowerCase().includes(q) ||
        a.kanzulImanUrdu.includes(ayahFilter.trim())
    );
  }, [viewMode, currentPageAyahs, surahMap, selectedSurah, ayahByRef, ayahFilter]);

  const inspectedAyah: DisplayAyah | undefined = useMemo(() => {
    if (playingId && ayahByRef.get(playingId)) return ayahByRef.get(playingId);
    if (ayahByRef.get(selectedAyahId)) return ayahByRef.get(selectedAyahId);
    return currentPageAyahs[0];
  }, [playingId, selectedAyahId, ayahByRef, currentPageAyahs]);

  const currentSurahMeta = useMemo(() => {
    if (viewMode === "mushaf" && currentPageAyahs.length > 0) {
      const sNum = currentPageAyahs[0].surahNum;
      return SURAH_LIST.find((s) => s.number === sNum) ?? SURAH_LIST[0];
    }
    return SURAH_LIST.find((s) => s.number === selectedSurah) ?? SURAH_LIST[0];
  }, [viewMode, currentPageAyahs, selectedSurah]);

  const nextSurahMeta = useMemo(
    () => SURAH_LIST.find((s) => s.number === Math.min(114, currentSurahMeta.number + 1)),
    [currentSurahMeta.number]
  );

  const currentJuzNum = useMemo(() => {
    if (currentPageAyahs.length > 0) return currentPageAyahs[0].juz;
    return currentSurahMeta.juz || 1;
  }, [currentPageAyahs, currentSurahMeta]);

  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.loop = loopAyah;
  }, [playbackRate, loopAyah]);

  const sleepActive = sleepSecondsLeft !== null;
  useEffect(() => {
    if (!sleepActive) return;
    const timer = setInterval(() => {
      setSleepSecondsLeft((prev) => {
        if (prev === null) return null;
        if (prev <= 1) {
          audioRef.current?.pause();
          setPlayingId(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [sleepActive]);

  const goToPage = useCallback(
    (page: number) => {
      const next = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, page));
      setCurrentPage(next);
      setPageInput(String(next));
      const firstOnPage = pagesMap.get(next)?.[0];
      if (firstOnPage) {
        setSelectedSurah(firstOnPage.surahNum);
        setSelectedAyahId(firstOnPage.id);
      }
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [pagesMap]
  );

  const stepPage = useCallback(
    (delta: number) => {
      goToPage(clampedPage + delta);
    },
    [clampedPage, goToPage]
  );

  useEffect(() => {
    if (viewMode !== "mushaf") return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        stepPage(1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        stepPage(-1);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [viewMode, stepPage]);

  const cycleSleepTimer = () => {
    if (sleepSecondsLeft === null) setSleepSecondsLeft(5 * 60);
    else if (sleepSecondsLeft <= 5 * 60) setSleepSecondsLeft(10 * 60);
    else if (sleepSecondsLeft <= 10 * 60) setSleepSecondsLeft(15 * 60);
    else if (sleepSecondsLeft <= 15 * 60) setSleepSecondsLeft(30 * 60);
    else setSleepSecondsLeft(null);
  };

  const formatSleep = (secs: number) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m}:${String(s).padStart(2, "0")}`;
  };

  const playAyah = useCallback(
    (ayah: DisplayAyah) => {
      if (!audioRef.current) return;
      setAudioError(null);
      setAudioLoadingId(ayah.id);
      setSelectedAyahId(ayah.id);
      audioRef.current.src = ayah.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = loopAyah;
      audioRef.current
        .play()
        .then(() => {
          setAudioLoadingId(null);
        })
        .catch(() => {
          setAudioLoadingId(null);
          setPlayingId(null);
          setAudioError(`Audio unavailable for ${ayah.id}. Check your network connection.`);
        });
      setPlayingId(ayah.id);
      logQuranAyah(ayah.id);
    },
    [playbackRate, loopAyah, logQuranAyah]
  );

  const togglePlay = (ayah: DisplayAyah) => {
    if (playingId === ayah.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      setAudioLoadingId(null);
      return;
    }
    playAyah(ayah);
  };

  const stepAudioVerse = (delta: number) => {
    const list = activeListAyahs;
    if (list.length === 0) return;
    const currentId = playingId || selectedAyahId;
    const idx = list.findIndex((a) => a.id === currentId);
    const nextIdx = Math.max(0, Math.min(list.length - 1, (idx === -1 ? 0 : idx) + delta));
    const target = list[nextIdx];
    if (target) {
      playAyah(target);
      document.getElementById(`ayah-${target.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  const handleShareAyah = (ayah: DisplayAyah) => {
    const text = `${ayah.arabicUthmani}\n\n${ayah.kanzulImanUrdu}\n${ayah.kanzulImanEnglish}\n— Holy Quran (${ayah.surahName} ${ayah.id}, Kanzul Iman)`;
    if (navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedId(ayah.id);
    setTimeout(() => setCopiedId(null), 1800);
  };

  const handleAudioEnded = () => {
    if (loopAyah) return;
    if (autoAdvance && playingId) {
      const idx = activeListAyahs.findIndex((a) => a.id === playingId);
      if (idx !== -1 && idx + 1 < activeListAyahs.length) {
        const next = activeListAyahs[idx + 1];
        playAyah(next);
        document.getElementById(`ayah-${next.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
      if (viewMode === "mushaf" && clampedPage < TOTAL_MUSHAF_PAGES) {
        const nextPage = clampedPage + 1;
        const nextPageAyahs = pagesMap.get(nextPage);
        if (nextPageAyahs && nextPageAyahs.length > 0) {
          goToPage(nextPage);
          playAyah(nextPageAyahs[0]);
          return;
        }
      }
    }
    setPlayingId(null);
  };

  const jumpToRef = (ref: string) => {
    const target = ayahByRef.get(ref);
    const { surahNum } = parseRef(ref);
    setAyahFilter("");
    setSelectedSurah(surahNum);
    setSelectedAyahId(ref);
    setSajdaDrawerOpen(false);
    if (target) {
      setCurrentPage(target.page);
      setPageInput(String(target.page));
    } else {
      const meta = SURAH_LIST.find((s) => s.number === surahNum);
      if (meta) {
        setCurrentPage(meta.startPage);
        setPageInput(String(meta.startPage));
      }
    }
  };

  const getTranslation = (ayah: DisplayAyah): { text: string } => {
    if (tarjumaLang === "ur") return { text: ayah.kanzulImanUrdu };
    if (tarjumaLang === "ro_ur" && ayah.kanzulImanRomanUrdu) return { text: ayah.kanzulImanRomanUrdu };
    if (tarjumaLang === "hi" && ayah.kanzulImanHindi) return { text: ayah.kanzulImanHindi };
    return { text: ayah.kanzulImanEnglish };
  };

  // Precompute current 1-page Mushaf sheet variables
  const firstPageAyah = currentPageAyahs[0];
  const lastPageAyah = currentPageAyahs[currentPageAyahs.length - 1];
  const pageJuzNum = firstPageAyah?.juz ?? 1;
  const pageJuzMeta = JUZ_LIST.find((j) => j.juz === pageJuzNum);
  const pageHizbNum = firstPageAyah ? Math.ceil(firstPageAyah.hizbQuarter / 4) : 1;
  const isOpeningPage = clampedPage === 1 || clampedPage === 2;
  const pageHasSajda = currentPageAyahs.some((a) => a.hanafiSajda);

  const pageSurahBlocks = useMemo(() => {
    const blocks: { surahNum: number; surahName: string; surahArabic: string; ayahs: DisplayAyah[] }[] = [];
    for (const ay of currentPageAyahs) {
      const lastBlock = blocks[blocks.length - 1];
      if (!lastBlock || lastBlock.surahNum !== ay.surahNum) {
        blocks.push({
          surahNum: ay.surahNum,
          surahName: ay.surahName,
          surahArabic: ay.surahArabic,
          ayahs: [ay],
        });
      } else {
        lastBlock.ayahs.push(ay);
      }
    }
    return blocks;
  }, [currentPageAyahs]);

  const mushafSheetNode = (
    <div
      key={clampedPage}
      onTouchStart={(e) => {
        setTouchStartX(e.touches[0]?.clientX ?? null);
      }}
      onTouchEnd={(e) => {
        if (touchStartX === null) return;
        const endX = e.changedTouches[0]?.clientX ?? touchStartX;
        const diff = endX - touchStartX;
        setTouchStartX(null);
        if (Math.abs(diff) > 65) {
          if (diff > 0) stepPage(1);
          else stepPage(-1);
        }
      }}
      className="relative w-full max-w-3xl mx-auto flex flex-col justify-between rounded-3xl p-4 sm:p-7 md:p-8 select-text transition-all"
      style={{
        background:
          "radial-gradient(circle at 50% 12%, color-mix(in srgb, var(--accent-primary) 12%, var(--bg-surface)), var(--bg-surface) 75%)",
        border: "1.5px solid color-mix(in srgb, var(--accent-primary) 45%, var(--border-hairline))",
        boxShadow: "0 18px 42px -10px rgba(4, 12, 35, 0.55)",
        minHeight: isOpeningPage ? "520px" : "640px",
      }}
    >
      {/* Inner Frame */}
      <div
        className="pointer-events-none absolute inset-2.5 sm:inset-3.5 rounded-2xl"
        style={{
          border: "1px solid color-mix(in srgb, var(--accent-primary) 28%, var(--border-hairline))",
        }}
      />

      {/* Top Running Mushaf Header */}
      <header
        dir="rtl"
        className="relative z-10 flex items-center justify-between gap-2 pb-2.5 mb-3 border-b text-xs"
        style={{ borderColor: "var(--border-hairline)" }}
      >
        <div className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--accent-primary)" }}>
          <span className="font-arabic text-base sm:text-lg">الجزء {toArabicIndicDigits(pageJuzNum)}</span>
          {pageJuzMeta && <span className="font-arabic text-xs sm:text-sm opacity-80">({pageJuzMeta.arabicTitle})</span>}
        </div>

        <div className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
          <span>Hizb {pageHizbNum}</span>
          {pageHasSajda && (
            <span
              className="px-2 py-0.5 rounded-full text-[10px] font-bold"
              style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
            >
              ۩ سجدہ تلاوت
            </span>
          )}
        </div>

        <div className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--accent-primary)" }}>
          <span className="font-arabic text-base sm:text-lg">{firstPageAyah?.surahArabic}</span>
          <span className="hidden xs:inline text-[11px] opacity-80">({firstPageAyah?.surahName})</span>
        </div>
      </header>

      {/* Mushaf Page Body */}
      <div
        className={`relative z-10 flex-1 flex flex-col ${
          isOpeningPage ? "justify-center py-4" : "justify-start"
        } space-y-4`}
      >
        {pageSurahBlocks.map((block) => {
          const startsOnThisPage = block.ayahs[0]?.ayahNum === 1;
          const showBismillahBanner = startsOnThisPage && block.surahNum !== 1 && block.surahNum !== 9;
          const surahInfo = SURAH_LIST.find((s) => s.number === block.surahNum);

          return (
            <div key={`${clampedPage}-surah-${block.surahNum}`} className="space-y-3">
              {/* Reference Image 1 Lavender-to-Violet Surah Header Card when a Surah begins on this page */}
              {startsOnThisPage && (
                <div className="quran-gradient-card relative my-2 p-4 sm:p-5 text-center overflow-hidden">
                  <div className="relative z-10 space-y-1">
                    <h2 className="text-lg sm:text-xl font-extrabold tracking-tight text-white">
                      {block.surahName}
                    </h2>
                    <p className="text-xs text-white/90">{surahInfo?.englishNameTranslation}</p>
                    <div className="w-36 h-px bg-white/30 mx-auto my-2" />
                    <p className="text-[11px] font-bold uppercase tracking-widest text-white/90">
                      {surahInfo?.revelationType} • {surahInfo?.numberOfAyahs} Verses
                    </p>
                    {showBismillahBanner && (
                      <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-white pt-2">
                        {BISMILLAH_TEXT}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Continuous Mushaf Arabic Lines */}
              <div
                dir="rtl"
                className={`font-arabic text-right ${
                  isOpeningPage
                    ? "text-center text-2xl sm:text-4xl leading-[2.4] px-2 sm:px-6"
                    : "text-xl sm:text-[26px] md:text-[28px] leading-[2.3]"
                }`}
                style={{ textAlign: isOpeningPage ? "center" : "justify" }}
              >
                {block.ayahs.map((ayah) => {
                  const isPlaying = playingId === ayah.id;
                  const isSelected = selectedAyahId === ayah.id;
                  const isBookmarked = lastQuranRef === ayah.id;

                  return (
                    <span
                      key={ayah.id}
                      id={`ayah-${ayah.id}`}
                      onClick={() => {
                        setSelectedAyahId(ayah.id);
                        setInspectorOpen(true);
                      }}
                      title={`Tap to read Kanzul Iman (${ayah.id})`}
                      className="inline rounded-lg px-1 py-0.5 cursor-pointer transition-colors"
                      style={{
                        backgroundColor: isPlaying
                          ? "color-mix(in srgb, var(--accent-primary) 24%, transparent)"
                          : isSelected
                          ? "color-mix(in srgb, var(--accent-primary) 16%, transparent)"
                          : isBookmarked
                          ? "color-mix(in srgb, var(--accent-gold) 16%, transparent)"
                          : "transparent",
                      }}
                    >
                      <span>
                        {renderTajweedArabic(
                          scriptMode === "indopak" ? ayah.arabicIndoPak : ayah.arabicUthmani,
                          tajweedColor
                        )}
                      </span>

                      {ayah.hanafiSajda && (
                        <span
                          className="inline-block mx-1 px-1.5 py-0.2 rounded text-xs sm:text-sm font-bold align-middle"
                          style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                        >
                          ۩ سجدہ
                        </span>
                      )}

                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedAyahId(ayah.id);
                          togglePlay(ayah);
                        }}
                        className="inline-flex items-center justify-center mx-1 px-1.5 py-0.5 rounded-full text-xs sm:text-sm font-bold align-middle cursor-pointer transition-transform active:scale-95"
                        style={{
                          color: isPlaying ? "#ffffff" : "var(--accent-primary)",
                          backgroundImage: isPlaying ? "var(--gradient-brand)" : undefined,
                          backgroundColor: isPlaying ? undefined : "var(--accent-soft)",
                          border: "1px solid color-mix(in srgb, var(--accent-primary) 45%, transparent)",
                        }}
                        title={`Play Ayah ${ayah.id}`}
                      >
                        <span>۝{toArabicIndicDigits(ayah.ayahNum)}</span>
                      </button>{" "}
                    </span>
                  );
                })}
              </div>
            </div>
          );
        })}

        {/* Optional Kanzul Iman Page Tarjuma */}
        {showMushafTarjuma && currentPageAyahs.length > 0 && (
          <div
            className="mt-4 pt-3 border-t space-y-2"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            <div
              className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider"
              style={{ color: "var(--accent-primary)" }}
            >
              <span>Kanzul Iman Page Tarjuma ({tarjumaLang === "ur" ? "اردو" : "English"})</span>
              <span>
                {firstPageAyah?.id} – {lastPageAyah?.id}
              </span>
            </div>
            <div className="max-h-56 overflow-y-auto pr-1 space-y-2 text-xs">
              {currentPageAyahs.map((ay) => {
                const isSelected = selectedAyahId === ay.id || playingId === ay.id;
                const tr = getTranslation(ay);
                return (
                  <div
                    key={`tr-${ay.id}`}
                    onClick={() => {
                      setSelectedAyahId(ay.id);
                      setInspectorOpen(true);
                    }}
                    className="p-2.5 rounded-xl cursor-pointer transition-colors"
                    style={{
                      backgroundColor: isSelected ? "var(--accent-soft)" : "var(--bg-muted)",
                      borderLeft: isSelected ? "3px solid var(--accent-primary)" : undefined,
                    }}
                  >
                    <div className="flex items-center justify-between gap-2 mb-0.5">
                      <span className="font-bold text-[11px]" style={{ color: "var(--accent-primary)" }}>
                        {ay.surahName} {ay.id}
                      </span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          togglePlay(ay);
                        }}
                        className="text-[11px] font-semibold underline cursor-pointer"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        {playingId === ay.id ? "Pause" : "Listen"}
                      </button>
                    </div>
                    <p
                      dir={tarjumaLang === "ur" ? "rtl" : "ltr"}
                      className={`leading-relaxed ${
                        tarjumaLang === "ur" ? "font-urdu text-right text-sm" : "text-xs"
                      }`}
                    >
                      {tr.text}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Mushaf Page Medallion & Prev/Next Turners */}
      <footer
        className="relative z-10 pt-3 mt-4 border-t flex items-center justify-between gap-2 text-xs"
        style={{ borderColor: "var(--border-hairline)" }}
      >
        <button
          type="button"
          disabled={clampedPage >= TOTAL_MUSHAF_PAGES}
          onClick={() => stepPage(1)}
          className="btn-primary px-3.5 py-1.5 rounded-full font-semibold inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer min-h-[38px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Next Page</span>
        </button>

        <div
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full font-bold tabular-nums"
          style={{
            backgroundColor: "var(--accent-soft)",
            color: "var(--accent-primary)",
          }}
        >
          <span className="font-arabic text-base">{toArabicIndicDigits(clampedPage)}</span>
          <span className="text-[11px]">Page {clampedPage} / 604</span>
        </div>

        <button
          type="button"
          disabled={clampedPage <= 1}
          onClick={() => stepPage(-1)}
          className="px-3.5 py-1.5 rounded-full border font-semibold inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer min-h-[38px]"
          style={{ borderColor: "var(--border-hairline)" }}
        >
          <span>Prev Page</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </footer>
    </div>
  );

  return (
    <div className="space-y-4 pb-20">
      <audio
        ref={audioRef}
        onEnded={handleAudioEnded}
        onCanPlay={() => setAudioLoadingId(null)}
        onError={() => {
          setAudioLoadingId(null);
          if (playingId) {
            setAudioError(`Could not stream audio for ${playingId}.`);
            setPlayingId(null);
          }
        }}
      />

      {/* Compact Responsive Mushaf & Surah Control Bar */}
      <div className="bento-card p-3 sm:p-4 space-y-3 max-w-3xl mx-auto w-full">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className="inline-flex rounded-full p-1 border"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            <button
              type="button"
              onClick={() => setViewMode("mushaf")}
              className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
              style={{
                backgroundImage: viewMode === "mushaf" ? "var(--gradient-brand)" : undefined,
                color: viewMode === "mushaf" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1-Page Mushaf</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("surah")}
              className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
              style={{
                backgroundImage: viewMode === "surah" ? "var(--gradient-brand)" : undefined,
                color: viewMode === "surah" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Detail Surah</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("highlights")}
              className="px-3 py-1.5 rounded-full text-xs font-bold cursor-pointer inline-flex items-center gap-1.5 transition-all"
              style={{
                backgroundImage: viewMode === "highlights" ? "var(--gradient-brand)" : undefined,
                color: viewMode === "highlights" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Highlights</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {viewMode === "mushaf" && (
              <button
                type="button"
                onClick={() => setShowMushafTarjuma(!showMushafTarjuma)}
                className="px-3 py-1.5 rounded-full border font-semibold cursor-pointer min-h-[36px]"
                style={{
                  borderColor: showMushafTarjuma ? "var(--accent-primary)" : "var(--border-hairline)",
                  color: showMushafTarjuma ? "var(--accent-primary)" : "var(--text-primary)",
                }}
              >
                Tarjuma: {showMushafTarjuma ? "On" : "Off"}
              </button>
            )}

            <button
              type="button"
              onClick={() => setSajdaDrawerOpen(true)}
              className="px-3 py-1.5 rounded-full border font-semibold cursor-pointer min-h-[36px]"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              ۩ 14 Sajdas ({sajdaCompleted.length}/14)
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              aria-label="Reading and Audio Settings"
              className="p-2 rounded-full border cursor-pointer min-h-[36px]"
              style={{
                borderColor: settingsOpen ? "var(--accent-primary)" : "var(--border-hairline)",
                backgroundColor: settingsOpen ? "var(--accent-soft)" : "var(--bg-muted)",
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Surah + Para (Juz) + Page (1..604) */}
        <div className="grid grid-cols-2 sm:grid-cols-12 gap-2">
          <select
            aria-label="Select Surah"
            value={currentSurahMeta.number}
            onChange={(e) => {
              const sNum = Number(e.target.value);
              setSelectedSurah(sNum);
              setAyahFilter("");
              const meta = SURAH_LIST.find((s) => s.number === sNum);
              if (meta) {
                setCurrentPage(meta.startPage);
                setPageInput(String(meta.startPage));
                setSelectedAyahId(`${sNum}:1`);
              }
            }}
            className="col-span-2 sm:col-span-5 px-3 py-2 rounded-xl border text-xs font-semibold bg-transparent outline-none min-h-[38px]"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            {SURAH_LIST.map((s) => (
              <option key={s.number} value={s.number} className="text-black">
                {s.number}. {s.englishName} ({s.name}) — p.{s.startPage}
              </option>
            ))}
          </select>

          <select
            aria-label="Select Para / Juz"
            value={currentJuzNum}
            onChange={(e) => {
              const jNum = Number(e.target.value);
              const juz = JUZ_LIST.find((j) => j.juz === jNum);
              if (juz) {
                setViewMode("mushaf");
                setCurrentPage(juz.startPage);
                setPageInput(String(juz.startPage));
                setSelectedSurah(juz.surahNum);
                setSelectedAyahId(`${juz.surahNum}:${juz.ayahNum}`);
              }
            }}
            className="col-span-1 sm:col-span-4 px-3 py-2 rounded-xl border text-xs font-semibold bg-transparent outline-none min-h-[38px]"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            {JUZ_LIST.map((j) => (
              <option key={j.juz} value={j.juz} className="text-black">
                Para {j.juz}: {j.arabicTitle} (p.{j.startPage})
              </option>
            ))}
          </select>

          <div className="col-span-1 sm:col-span-3 flex items-center justify-end gap-1">
            <button
              type="button"
              disabled={clampedPage <= 1}
              onClick={() => stepPage(-1)}
              className="p-2 rounded-xl border disabled:opacity-40 cursor-pointer min-h-[38px]"
              style={{ borderColor: "var(--border-hairline)" }}
              title="Previous Page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const parsed = parseInt(pageInput, 10);
                if (Number.isFinite(parsed)) {
                  setViewMode("mushaf");
                  goToPage(parsed);
                }
              }}
              className="flex items-center gap-1"
            >
              <input
                type="number"
                min={1}
                max={TOTAL_MUSHAF_PAGES}
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value)}
                onBlur={() => {
                  const parsed = parseInt(pageInput, 10);
                  if (Number.isFinite(parsed)) goToPage(parsed);
                }}
                className="w-14 px-1.5 py-1.5 rounded-xl border text-center text-xs font-bold tabular-nums bg-transparent outline-none min-h-[38px]"
                style={{ borderColor: "var(--border-hairline)" }}
                aria-label="Mushaf Page Number"
              />
              <span className="text-[11px] opacity-60 hidden md:inline">/604</span>
            </form>
            <button
              type="button"
              disabled={clampedPage >= TOTAL_MUSHAF_PAGES}
              onClick={() => stepPage(1)}
              className="p-2 rounded-xl border disabled:opacity-40 cursor-pointer min-h-[38px]"
              style={{ borderColor: "var(--border-hairline)" }}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Collapsible Settings */}
        {settingsOpen && (
          <div
            className="pt-3 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setScriptMode(scriptMode === "indopak" ? "uthmani" : "indopak")}
                className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                Script: {scriptMode === "indopak" ? "Indo-Pak" : "Uthmani"}
              </button>
              <button
                type="button"
                onClick={() => setTajweedColor(!tajweedColor)}
                className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                style={{
                  borderColor: tajweedColor ? "var(--accent-primary)" : "var(--border-hairline)",
                  backgroundColor: tajweedColor ? "var(--accent-soft)" : "transparent",
                }}
              >
                Tajweed: {tajweedColor ? "On" : "Off"}
              </button>
              <select
                value={tarjumaLang}
                onChange={(e) => setTarjumaLang(e.target.value as typeof tarjumaLang)}
                className="px-3 py-1.5 rounded-xl border font-semibold bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                <option value="ur" className="text-black">Kanzul Iman (Urdu)</option>
                <option value="en" className="text-black">Kanzul Iman (English)</option>
                <option value="ro_ur" className="text-black">Kanzul Iman (Roman Urdu)</option>
                <option value="hi" className="text-black">Hindi Translation</option>
              </select>
            </div>

            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setPlaybackRate(playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 0.75 : 1)}
                className="px-2.5 py-1.5 rounded-xl border font-semibold tabular-nums cursor-pointer"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                Speed: {playbackRate}x
              </button>
              <button
                type="button"
                onClick={() => setAutoAdvance(!autoAdvance)}
                className="px-2.5 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 cursor-pointer"
                style={{
                  borderColor: autoAdvance && !loopAyah ? "var(--accent-primary)" : "var(--border-hairline)",
                  color: autoAdvance && !loopAyah ? "var(--accent-primary)" : "var(--text-muted)",
                }}
              >
                <ListMusic className="w-3.5 h-3.5" />
                <span>Auto-Next</span>
              </button>
              <button
                type="button"
                onClick={() => setLoopAyah(!loopAyah)}
                className="px-2.5 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 cursor-pointer"
                style={{
                  borderColor: loopAyah ? "var(--accent-gold)" : "var(--border-hairline)",
                  color: loopAyah ? "var(--accent-gold)" : "var(--text-muted)",
                }}
              >
                <Repeat className="w-3.5 h-3.5" />
                <span>Hifz Loop</span>
              </button>
              <button
                type="button"
                onClick={cycleSleepTimer}
                className="px-2.5 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 cursor-pointer tabular-nums"
                style={{
                  borderColor: sleepSecondsLeft !== null ? "var(--accent-primary)" : "var(--border-hairline)",
                  color: sleepSecondsLeft !== null ? "var(--accent-primary)" : "var(--text-muted)",
                }}
              >
                <Moon className="w-3.5 h-3.5" />
                <span>{sleepSecondsLeft !== null ? `Sleep: ${formatSleep(sleepSecondsLeft)}` : "Sleep Timer"}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {audioError && (
        <div
          className="p-3 rounded-xl border text-xs flex items-center justify-between gap-2 max-w-3xl mx-auto"
          style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}
        >
          <span className="inline-flex items-center gap-2">
            <AlertCircle className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
            <span>{audioError}</span>
          </span>
          <button type="button" onClick={() => setAudioError(null)} className="underline cursor-pointer">
            Dismiss
          </button>
        </div>
      )}

      {loadingCorpus && (
        <div className="bento-card p-12 text-center space-y-3 max-w-3xl mx-auto">
          <Loader2 className="w-7 h-7 animate-spin mx-auto" style={{ color: "var(--accent-primary)" }} />
          <p className="text-sm font-semibold">Opening 604-Page Mushaf (Kanzul Iman)…</p>
        </div>
      )}

      {corpusError && !loadingCorpus && (
        <div className="bento-card p-6 text-xs max-w-3xl mx-auto" style={{ borderColor: "var(--accent-gold)" }}>
          {corpusError}
        </div>
      )}

      {/* VIEW 1: 1-PAGE-PER-SCREEN MUSHAF */}
      {!loadingCorpus && viewMode === "mushaf" && mushafSheetNode}

      {/* VIEW 2 & 3: DETAIL SURAH VIEW (Exact Reference Image 1 & 2 Right Screen Design) */}
      {!loadingCorpus && viewMode !== "mushaf" && (
        <div className="max-w-3xl mx-auto space-y-5">
          {/* Reference Image 1: Lavender-to-Violet Surah Header Card with Watermark Quran & Calligraphic Bismillah */}
          <div className="quran-gradient-card relative p-6 sm:p-8 text-center overflow-hidden">
            {/* Subtle Open Quran Watermark on Right */}
            <svg
              aria-hidden="true"
              viewBox="0 0 220 160"
              className="pointer-events-none absolute -right-4 -bottom-6 w-56 h-44 opacity-20"
            >
              <path d="M42 93 Q76 75 110 97 L110 52 Q76 32 42 50 Z" fill="#FFFFFF" />
              <path d="M178 93 Q144 75 110 97 L110 52 Q144 32 178 50 Z" fill="#FFFFFF" />
              <path d="M65 145 L155 102 L162 110 L72 153 Z" fill="#FFFFFF" />
              <path d="M155 145 L65 102 L58 110 L148 153 Z" fill="#FFFFFF" />
            </svg>

            <div className="relative z-10 space-y-1.5">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white">
                {currentSurahMeta.englishName}
              </h1>
              <p className="text-xs sm:text-sm text-white/90">{currentSurahMeta.englishNameTranslation}</p>
              <div className="w-44 h-px bg-white/35 mx-auto my-3" />
              <p className="text-xs font-bold uppercase tracking-widest text-white/90">
                {currentSurahMeta.revelationType} • {currentSurahMeta.numberOfAyahs} Verses • Page {currentSurahMeta.startPage}
              </p>

              {(viewMode === "highlights" || selectedSurah !== 9) && (
                <p dir="rtl" className="font-arabic text-2xl sm:text-4xl text-white pt-4">
                  {BISMILLAH_TEXT}
                </p>
              )}
            </div>
          </div>

          {/* Search Filter Bar */}
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3.5 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={ayahFilter}
                onChange={(e) => setAyahFilter(e.target.value)}
                placeholder="Filter ayah # or Kanzul Iman translation…"
                className="w-full pl-9 pr-3 py-2 rounded-full border text-xs bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowTranslit(!showTranslit)}
              className="px-3.5 py-2 rounded-full border text-xs font-semibold cursor-pointer"
              style={{
                borderColor: showTranslit ? "var(--accent-primary)" : "var(--border-hairline)",
                color: showTranslit ? "var(--accent-primary)" : "var(--text-muted)",
              }}
            >
              Transliteration
            </button>
          </div>

          {/* Reference Image 1 Verse Cards: Top Rounded Pill Bar with Purple Circle Badge Left + Share/Play/Bookmark Right */}
          <div className="space-y-4">
            {activeListAyahs.map((ayah) => {
              const isPlaying = playingId === ayah.id;
              const isAudioLoading = audioLoadingId === ayah.id;
              const isBookmarked = lastQuranRef === ayah.id;
              const sajdaDone = sajdaCompleted.includes(ayah.id);
              const sajdaDeferred = sajdaQueue.includes(ayah.id);
              const translation = getTranslation(ayah);

              return (
                <article
                  key={ayah.id}
                  id={`ayah-${ayah.id}`}
                  className="bento-card p-4 sm:p-5 space-y-4 transition-colors"
                  style={{
                    borderColor: isPlaying
                      ? "var(--accent-primary)"
                      : isBookmarked
                      ? "var(--accent-gold)"
                      : undefined,
                  }}
                >
                  {/* Reference Image 1 Top Action Pill Bar */}
                  <div
                    className="px-3.5 py-2 rounded-2xl flex items-center justify-between gap-2"
                    style={{ backgroundColor: "var(--bg-muted)" }}
                  >
                    <div className="flex items-center gap-2.5">
                      <span
                        className="w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold text-white tabular-nums shrink-0"
                        style={{ backgroundImage: "var(--gradient-brand)" }}
                      >
                        {ayah.ayahNum}
                      </span>
                      <span className="text-xs font-semibold" style={{ color: "var(--text-muted)" }}>
                        {ayah.surahName} ({ayah.id}) • p.{ayah.page}
                      </span>
                      {ayah.hanafiSajda && (
                        <span
                          className="px-2 py-0.5 rounded-full text-[10px] font-bold"
                          style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                        >
                          ۩ Sajda
                        </span>
                      )}
                    </div>

                    {/* Share / Play / Bookmark Icons (Exact Reference Image 1 Right Action Icons) */}
                    <div className="flex items-center gap-1.5" style={{ color: "var(--accent-primary)" }}>
                      <button
                        type="button"
                        onClick={() => handleShareAyah(ayah)}
                        className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer"
                        title="Copy & Share Verse"
                      >
                        {copiedId === ayah.id ? (
                          <span className="text-[10px] font-bold">Copied</span>
                        ) : (
                          <Share2 className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => togglePlay(ayah)}
                        className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer"
                        title={isPlaying ? "Pause" : "Play Recitation"}
                      >
                        {isAudioLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : isPlaying ? (
                          <Pause className="w-4 h-4" />
                        ) : (
                          <Play className="w-4 h-4" />
                        )}
                      </button>

                      <button
                        type="button"
                        onClick={() => logQuranAyah(ayah.id)}
                        className="p-1.5 rounded-lg hover:opacity-80 cursor-pointer"
                        style={{ color: isBookmarked ? "var(--accent-gold)" : "var(--accent-primary)" }}
                        title="Bookmark Verse"
                      >
                        <Bookmark className="w-4 h-4" fill={isBookmarked ? "currentColor" : "none"} />
                      </button>
                    </div>
                  </div>

                  {/* Right-Aligned Arabic Script */}
                  <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-right leading-[2.25] pt-1">
                    {renderTajweedArabic(
                      scriptMode === "indopak" ? ayah.arabicIndoPak : ayah.arabicUthmani,
                      tajweedColor
                    )}
                  </p>

                  {/* Purple Transliteration (Reference Image 2) */}
                  {showTranslit && ayah.transliteration && (
                    <p className="text-xs font-medium" style={{ color: "var(--accent-primary)" }}>
                      {ayah.transliteration}
                    </p>
                  )}

                  {/* Kanzul Iman Translation */}
                  <p
                    dir={tarjumaLang === "ur" ? "rtl" : "ltr"}
                    className={`text-sm sm:text-base leading-relaxed ${
                      tarjumaLang === "ur" ? "font-urdu text-right text-lg" : ""
                    }`}
                    style={{ color: "var(--text-muted)" }}
                  >
                    {translation.text}
                  </p>

                  {ayah.hanafiSajda && (
                    <div
                      className="p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs"
                      style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}
                    >
                      <span>
                        {sajdaDone
                          ? "Alhamdulillah — Sajda-e-Tilawat logged."
                          : sajdaDeferred
                          ? "Deferred to your Sajda Reminder Queue."
                          : "Hanafi Wajib Sajda: Perform 1 Sajdah facing Qibla with Takbir."}
                      </span>
                      <div className="flex gap-2">
                        <button
                          type="button"
                          onClick={() => logSajda(ayah.id, "now")}
                          className="btn-primary px-3 py-1 rounded-lg font-semibold cursor-pointer inline-flex items-center gap-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>{sajdaDone ? "Logged" : "Log Sajda"}</span>
                        </button>
                        {!sajdaDone && (
                          <button
                            type="button"
                            onClick={() => logSajda(ayah.id, "defer")}
                            className="px-3 py-1 rounded-lg border font-semibold cursor-pointer inline-flex items-center gap-1"
                            style={{ borderColor: "var(--border-hairline)" }}
                          >
                            <Clock className="w-3.5 h-3.5" />
                            <span>Defer</span>
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                  {ayah.khazainUlIrfanNote && (
                    <div className="pt-1">
                      <button
                        type="button"
                        onClick={() => setOpenTafsirId(openTafsirId === ayah.id ? null : ayah.id)}
                        className="text-xs font-semibold cursor-pointer"
                        style={{ color: "var(--accent-primary)" }}
                      >
                        {openTafsirId === ayah.id ? "Hide Khazain-ul-Irfan Note ▲" : "Read Khazain-ul-Irfan Note ▼"}
                      </button>
                      {openTafsirId === ayah.id && (
                        <div
                          className="mt-2 p-3 rounded-xl text-xs leading-relaxed"
                          style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}
                        >
                          {ayah.khazainUlIrfanNote}
                        </div>
                      )}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      )}

      {/* Floating Bottom Lavender-to-Violet Audio Player Pill (Exact Reference Image 2 Bottom Bar) */}
      {!loadingCorpus && inspectedAyah && (
        <div className="fixed bottom-3 inset-x-3 z-40 pointer-events-none flex justify-center">
          <div className="pointer-events-auto quran-gradient-card w-full max-w-xl px-4 py-3 rounded-full flex items-center justify-between gap-3 shadow-2xl">
            <div className="min-w-0">
              <div className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-white truncate">
                {currentSurahMeta.englishName} ({inspectedAyah.id})
              </div>
              <button
                type="button"
                onClick={() => {
                  if (nextSurahMeta) {
                    setSelectedSurah(nextSurahMeta.number);
                    goToPage(nextSurahMeta.startPage);
                  }
                }}
                className="text-[11px] text-white/85 inline-flex items-center gap-1 hover:underline cursor-pointer truncate"
              >
                <span>
                  {nextSurahMeta ? `Next surah ${nextSurahMeta.englishName}` : `Page ${clampedPage} of 604`}
                </span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => stepAudioVerse(-1)}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                aria-label="Previous Verse"
              >
                <SkipBack className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => togglePlay(inspectedAyah)}
                className="w-10 h-10 rounded-full bg-white text-purple-700 flex items-center justify-center font-bold cursor-pointer shadow-md transition-transform active:scale-95"
                aria-label={playingId ? "Pause Recitation" : "Play Recitation"}
              >
                {audioLoadingId ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : playingId ? (
                  <Pause className="w-4 h-4" />
                ) : (
                  <Play className="w-4 h-4 ml-0.5" />
                )}
              </button>
              <button
                type="button"
                onClick={() => stepAudioVerse(1)}
                className="p-2 rounded-full bg-white/15 hover:bg-white/25 text-white cursor-pointer"
                aria-label="Next Verse"
              >
                <SkipForward className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Selected Verse Kanzul Iman Bottom Sheet */}
      {inspectorOpen && inspectedAyah && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={() => setInspectorOpen(false)}
        >
          <div
            className="bento-card w-full max-w-xl p-5 space-y-3.5 max-h-[85dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                  Page {inspectedAyah.page} • Para {inspectedAyah.juz}
                </div>
                <h2 className="text-base font-bold">
                  {inspectedAyah.surahName} ({inspectedAyah.id})
                </h2>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => logQuranAyah(inspectedAyah.id)}
                  className="p-2 rounded-xl border cursor-pointer"
                  style={{
                    borderColor: lastQuranRef === inspectedAyah.id ? "var(--accent-gold)" : "var(--border-hairline)",
                    color: lastQuranRef === inspectedAyah.id ? "var(--accent-gold)" : "var(--text-muted)",
                  }}
                  title="Bookmark Verse"
                >
                  <Bookmark className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => togglePlay(inspectedAyah)}
                  className="btn-primary px-3 py-2 rounded-xl text-xs font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                >
                  {playingId === inspectedAyah.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                  <span>{playingId === inspectedAyah.id ? "Pause" : "Listen"}</span>
                </button>
                <button
                  type="button"
                  onClick={() => setInspectorOpen(false)}
                  className="p-2 rounded-xl border cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                  aria-label="Close verse modal"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            <p
              dir="rtl"
              className="font-arabic text-2xl text-right leading-[2.2] p-3.5 rounded-xl"
              style={{ backgroundColor: "var(--bg-muted)" }}
            >
              {inspectedAyah.arabicUthmani}{" "}
              <span style={{ color: "var(--accent-primary)" }}>۝{toArabicIndicDigits(inspectedAyah.ayahNum)}</span>
            </p>

            <div className="space-y-3 text-xs">
              <div>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--accent-primary)" }}>
                  Kanzul Iman (Urdu — Imam Ahmad Raza Khan)
                </div>
                <p dir="rtl" className="font-urdu text-right text-base sm:text-lg leading-relaxed">
                  {inspectedAyah.kanzulImanUrdu}
                </p>
              </div>

              <div className="pt-2.5 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                <div className="text-[10px] font-bold uppercase tracking-wider mb-1" style={{ color: "var(--accent-secondary)" }}>
                  Kanzul Iman (English)
                </div>
                <p className="text-sm leading-relaxed">{inspectedAyah.kanzulImanEnglish}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 14 Hanafi Sajdas Modal Drawer */}
      {sajdaDrawerOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-end sm:items-center justify-center p-3 sm:p-4"
          onClick={() => setSajdaDrawerOpen(false)}
        >
          <div
            className="bento-card w-full max-w-lg p-5 space-y-4 max-h-[85dvh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between gap-2">
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-primary)" }}>
                  Hanafi Fiqh (Bahar-e-Shariat)
                </span>
                <h2 className="text-base font-bold">
                  14 Wajib Sajda-e-Tilawat Verses ({sajdaCompleted.length}/14)
                </h2>
              </div>
              <button
                type="button"
                onClick={() => setSajdaDrawerOpen(false)}
                className="p-2 rounded-xl border cursor-pointer"
                style={{ borderColor: "var(--border-hairline)" }}
                aria-label="Close Sajda list"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {sajdaQueue.length > 0 && (
              <div className="p-3 rounded-xl border space-y-2 text-xs" style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}>
                <div className="font-bold">Deferred Sajda Queue ({sajdaQueue.length})</div>
                {sajdaQueue.map((ref) => (
                  <div key={ref} className="flex items-center justify-between">
                    <button type="button" onClick={() => jumpToRef(ref)} className="underline font-semibold cursor-pointer">
                      ۩ Ayah {ref}
                    </button>
                    <button
                      type="button"
                      onClick={() => logSajda(ref, "now")}
                      className="btn-primary px-2.5 py-1 rounded-lg font-semibold cursor-pointer"
                    >
                      Mark Done
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
              {HANAFI_SAJDA_ITEMS.map((s) => {
                const done = sajdaCompleted.includes(s.ref);
                const deferred = sajdaQueue.includes(s.ref);
                return (
                  <button
                    key={s.ref}
                    type="button"
                    onClick={() => jumpToRef(s.ref)}
                    className="w-full text-left px-3 py-2.5 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors"
                    style={{
                      borderColor: done ? "var(--accent-primary)" : "var(--border-hairline)",
                      backgroundColor: done ? "var(--accent-soft)" : "var(--bg-muted)",
                    }}
                  >
                    <span className="font-medium truncate">۩ {s.label}</span>
                    <span className="inline-flex items-center gap-1 text-[11px] opacity-75 shrink-0">
                      <span>p.{s.page}</span>
                      {done ? (
                        <CheckCircle2 className="w-3.5 h-3.5" style={{ color: "var(--accent-primary)" }} />
                      ) : deferred ? (
                        <Clock className="w-3.5 h-3.5" style={{ color: "var(--accent-gold)" }} />
                      ) : (
                        <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                      )}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
