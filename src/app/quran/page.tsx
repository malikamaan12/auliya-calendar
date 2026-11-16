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
  Volume2,
  ListMusic,
  Loader2,
  AlertCircle,
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  AlignJustify,
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
import { sha256Hex } from "@/lib/crypto-integrity";

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

const QUICK_SUNNAH_SURAHS = [
  { num: 1, page: 1, label: "Al-Fatihah" },
  { num: 18, page: 293, label: "Al-Kahf" },
  { num: 36, page: 440, label: "Yaseen" },
  { num: 55, page: 531, label: "Ar-Rahman" },
  { num: 56, page: 534, label: "Al-Waqiah" },
  { num: 67, page: 562, label: "Al-Mulk" },
  { num: 32, page: 415, label: "As-Sajdah" },
  { num: 96, page: 597, label: "Al-Alaq" },
];

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

  // 1-Page-Per-Screen Default State
  const [viewMode, setViewMode] = useState<"mushaf" | "surah" | "highlights">("mushaf");
  const [showMushafTarjuma, setShowMushafTarjuma] = useState(false);
  const [currentPage, setCurrentPage] = useState<number>(initialSurahMeta.startPage || 1);
  const [selectedSurah, setSelectedSurah] = useState<number>(initialRef.surahNum || 1);
  const [selectedAyahId, setSelectedAyahId] = useState<string>(lastQuranRef || "1:1");
  const [pageInput, setPageInput] = useState<string>(String(initialSurahMeta.startPage || 1));

  // Drawers / Modals for mobile-friendly single-screen focus
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
  const [verifiedHashes, setVerifiedHashes] = useState<Record<string, string>>({});

  // Touch swipe tracking for mobile page turning
  const [touchStartX, setTouchStartX] = useState<number | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  // Strictly 1 Page Per Screen
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

  const currentJuzNum = useMemo(() => {
    if (currentPageAyahs.length > 0) return currentPageAyahs[0].juz;
    return currentSurahMeta.juz || 1;
  }, [currentPageAyahs, currentSurahMeta]);

  useEffect(() => {
    const slice = activeListAyahs.slice(0, 40);
    if (slice.length === 0) return;
    let cancelled = false;
    Promise.all(
      slice.map(async (a) => [a.id, await sha256Hex(`${a.id}|${a.kanzulImanUrdu}`)] as const)
    ).then((entries) => {
      if (!cancelled) setVerifiedHashes(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [activeListAyahs]);

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

  // Keyboard navigation (Left/Right arrows flip 1 Mushaf page at a time)
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
          // Swipe right-to-left or left-to-right to turn Mushaf page
          if (Math.abs(diff) > 65) {
            if (diff > 0) stepPage(1);
            else stepPage(-1);
          }
        }}
        className="relative w-full max-w-3xl mx-auto flex flex-col justify-between rounded-2xl p-4 sm:p-7 md:p-8 select-text transition-all"
        style={{
          background:
            "radial-gradient(circle at 50% 15%, color-mix(in srgb, var(--accent-gold) 8%, var(--bg-surface)), var(--bg-surface) 75%)",
          border: "2px solid color-mix(in srgb, var(--accent-gold) 48%, var(--border-hairline))",
          boxShadow: "0 14px 36px -10px rgba(0,0,0,0.32)",
          minHeight: isOpeningPage ? "520px" : "640px",
        }}
      >
        {/* Inner Gilded Mushaf Frame */}
        <div
          className="pointer-events-none absolute inset-2 sm:inset-3 rounded-xl"
          style={{
            border: "1px solid color-mix(in srgb, var(--accent-gold) 32%, var(--border-hairline))",
          }}
        />

        {/* Corner Arabesque Ornaments */}
        <span
          className="pointer-events-none absolute top-3.5 left-3.5 w-3 h-3 rotate-45"
          style={{ borderTop: "2px solid var(--accent-gold)", borderLeft: "2px solid var(--accent-gold)" }}
        />
        <span
          className="pointer-events-none absolute top-3.5 right-3.5 w-3 h-3 rotate-45"
          style={{ borderTop: "2px solid var(--accent-gold)", borderRight: "2px solid var(--accent-gold)" }}
        />
        <span
          className="pointer-events-none absolute bottom-3.5 left-3.5 w-3 h-3 rotate-45"
          style={{ borderBottom: "2px solid var(--accent-gold)", borderLeft: "2px solid var(--accent-gold)" }}
        />
        <span
          className="pointer-events-none absolute bottom-3.5 right-3.5 w-3 h-3 rotate-45"
          style={{ borderBottom: "2px solid var(--accent-gold)", borderRight: "2px solid var(--accent-gold)" }}
        />

        {/* Top Running Mushaf Header */}
        <header
          dir="rtl"
          className="relative z-10 flex items-center justify-between gap-2 pb-2.5 mb-3 border-b text-xs"
          style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 30%, var(--border-hairline))" }}
        >
          <div className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--accent-gold)" }}>
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
                {startsOnThisPage && (
                  <div
                    className="relative my-1.5 py-2.5 px-3 sm:px-4 rounded-xl text-center overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(90deg, color-mix(in srgb, var(--accent-gold) 16%, transparent), color-mix(in srgb, var(--accent-primary) 18%, var(--bg-muted)), color-mix(in srgb, var(--accent-gold) 16%, transparent))",
                      border: "1.5px solid color-mix(in srgb, var(--accent-gold) 55%, var(--border-hairline))",
                    }}
                  >
                    <div
                      className="flex items-center justify-between text-[11px] font-semibold"
                      style={{ color: "var(--accent-gold)" }}
                    >
                      <span>
                        Surah {block.surahNum}: {block.surahName}
                      </span>
                      <span className="font-arabic text-xl sm:text-2xl" style={{ color: "var(--text-primary)" }}>
                        {block.surahArabic}
                      </span>
                      <span>
                        {surahInfo?.numberOfAyahs} Ayahs
                      </span>
                    </div>
                  </div>
                )}

                {showBismillahBanner && (
                  <div
                    dir="rtl"
                    className="font-arabic text-center text-2xl sm:text-3xl py-1"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {BISMILLAH_TEXT}
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
                            ? "color-mix(in srgb, var(--accent-secondary) 22%, transparent)"
                            : isSelected
                            ? "color-mix(in srgb, var(--accent-primary) 16%, transparent)"
                            : isBookmarked
                            ? "color-mix(in srgb, var(--accent-gold) 16%, transparent)"
                            : "transparent",
                          boxShadow: isPlaying
                            ? "0 0 0 1px var(--accent-secondary)"
                            : isSelected
                            ? "0 0 0 1px color-mix(in srgb, var(--accent-primary) 45%, transparent)"
                            : undefined,
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
                            color: isPlaying ? "#ffffff" : "var(--accent-gold)",
                            backgroundColor: isPlaying
                              ? "var(--accent-secondary)"
                              : "color-mix(in srgb, var(--accent-gold) 14%, transparent)",
                            border: "1px solid color-mix(in srgb, var(--accent-gold) 45%, transparent)",
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

          {/* Optional Kanzul Iman Page Tarjuma (Hashiya) */}
          {showMushafTarjuma && currentPageAyahs.length > 0 && (
            <div
              className="mt-4 pt-3 border-t space-y-2"
              style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 30%, var(--border-hairline))" }}
            >
              <div
                className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider"
                style={{ color: "var(--accent-gold)" }}
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
                          {ay.hanafiSajda ? " • ۩ Wajib Hanafi Sajda" : ""}
                        </span>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            togglePlay(ay);
                          }}
                          className="text-[11px] font-semibold underline cursor-pointer"
                          style={{ color: "var(--accent-secondary)" }}
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
          style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 30%, var(--border-hairline))" }}
        >
          <button
            type="button"
            disabled={clampedPage >= TOTAL_MUSHAF_PAGES}
            onClick={() => stepPage(1)}
            className="px-3 py-1.5 rounded-xl font-semibold text-white inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer min-h-[38px]"
            style={{ backgroundColor: "var(--accent-primary)" }}
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Next Page</span>
          </button>

          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full font-bold tabular-nums"
            style={{
              backgroundColor: "color-mix(in srgb, var(--accent-gold) 15%, var(--bg-muted))",
              border: "1px solid color-mix(in srgb, var(--accent-gold) 45%, var(--border-hairline))",
              color: "var(--accent-gold)",
            }}
          >
            <span className="font-arabic text-base">{toArabicIndicDigits(clampedPage)}</span>
            <span className="text-[11px] opacity-85">Page {clampedPage} / 604</span>
          </div>

          <button
            type="button"
            disabled={clampedPage <= 1}
            onClick={() => stepPage(-1)}
            className="px-3 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 disabled:opacity-40 cursor-pointer min-h-[38px]"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            <span>Prev Page</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </footer>
      </div>
  );

  return (
    <div className="space-y-4">
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

      {/* Compact Responsive Mushaf Control Bar */}
      <div className="bento-card p-3 sm:p-4 space-y-3">
        {/* Top Row: Mode Switcher + Quick Actions */}
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div
            className="inline-flex rounded-xl p-1 border"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            <button
              type="button"
              onClick={() => setViewMode("mushaf")}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              style={{
                backgroundColor: viewMode === "mushaf" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "mushaf" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>1-Page Mushaf</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("surah")}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              style={{
                backgroundColor: viewMode === "surah" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "surah" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Verse List</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("highlights")}
              className="px-2.5 sm:px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              style={{
                backgroundColor: viewMode === "highlights" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "highlights" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden xs:inline">Highlights</span>
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            {currentPageAyahs.length > 0 && (
              <button
                type="button"
                onClick={() => togglePlay(inspectedAyah ?? currentPageAyahs[0])}
                className="px-3 py-1.5 rounded-xl font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer min-h-[36px]"
                style={{ backgroundColor: playingId ? "var(--accent-secondary)" : "var(--accent-primary)" }}
              >
                {playingId ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                <span>{playingId ? `Pause (${playingId})` : `Recite p.${clampedPage}`}</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => setShowMushafTarjuma(!showMushafTarjuma)}
              className="px-2.5 py-1.5 rounded-xl border font-semibold cursor-pointer min-h-[36px]"
              style={{
                borderColor: showMushafTarjuma ? "var(--accent-gold)" : "var(--border-hairline)",
                color: showMushafTarjuma ? "var(--accent-gold)" : "var(--text-primary)",
              }}
            >
              Tarjuma: {showMushafTarjuma ? "On" : "Off"}
            </button>

            <button
              type="button"
              onClick={() => setSajdaDrawerOpen(true)}
              className="px-2.5 py-1.5 rounded-xl border font-semibold cursor-pointer min-h-[36px]"
              style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
            >
              ۩ 14 Sajdas ({sajdaCompleted.length}/14)
            </button>

            <button
              type="button"
              onClick={() => setSettingsOpen(!settingsOpen)}
              aria-label="Reading and Audio Settings"
              className="p-2 rounded-xl border cursor-pointer min-h-[36px]"
              style={{
                borderColor: settingsOpen ? "var(--accent-primary)" : "var(--border-hairline)",
                backgroundColor: settingsOpen ? "var(--accent-soft)" : "var(--bg-muted)",
              }}
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Second Row: Surah + Para (Juz) + Page (1..604) */}
        <div className="grid grid-cols-2 sm:grid-cols-12 gap-2">
          {/* 114 Surah Selector */}
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

          {/* 30 Juz / Para Selector */}
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

          {/* Page Stepper (1..604) */}
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

        {/* Quick Sunnah Surahs Strip */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 text-[11px]">
          <span className="font-semibold shrink-0" style={{ color: "var(--text-muted)" }}>
            Sunnah:
          </span>
          {QUICK_SUNNAH_SURAHS.map((qs) => (
            <button
              key={qs.num}
              type="button"
              onClick={() => {
                setSelectedSurah(qs.num);
                setCurrentPage(qs.page);
                setPageInput(String(qs.page));
                setSelectedAyahId(`${qs.num}:1`);
              }}
              className="px-2.5 py-1 rounded-full border font-semibold cursor-pointer whitespace-nowrap transition-colors"
              style={{
                borderColor: currentSurahMeta.number === qs.num ? "var(--accent-primary)" : "var(--border-hairline)",
                backgroundColor: currentSurahMeta.number === qs.num ? "var(--accent-soft)" : "transparent",
                color: currentSurahMeta.number === qs.num ? "var(--accent-primary)" : "var(--text-muted)",
              }}
            >
              {qs.label}
            </button>
          ))}
          {lastQuranRef && (
            <button
              type="button"
              onClick={() => jumpToRef(lastQuranRef)}
              className="ml-auto px-2.5 py-1 rounded-full border font-semibold cursor-pointer whitespace-nowrap inline-flex items-center gap-1"
              style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
            >
              <Bookmark className="w-3 h-3" />
              <span>Resume {lastQuranRef}</span>
            </button>
          )}
        </div>

        {/* Collapsible Reading & Audio Settings Panel */}
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
                  borderColor: autoAdvance && !loopAyah ? "var(--accent-secondary)" : "var(--border-hairline)",
                  color: autoAdvance && !loopAyah ? "var(--accent-secondary)" : "var(--text-muted)",
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
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Loading all 114 Surahs and 6,236 blessed verses.
          </p>
        </div>
      )}

      {corpusError && !loadingCorpus && (
        <div className="bento-card p-6 text-xs max-w-3xl mx-auto" style={{ borderColor: "var(--accent-gold)" }}>
          {corpusError}
        </div>
      )}

      {/* MAIN VIEW: 1-PAGE-PER-SCREEN MUSHAF */}
      {!loadingCorpus && viewMode === "mushaf" && mushafSheetNode}

      {/* ALTERNATE VIEW: VERSE-BY-VERSE LIST / HIGHLIGHTS */}
      {!loadingCorpus && viewMode !== "mushaf" && (
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="flex items-center justify-between gap-2">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={ayahFilter}
                onChange={(e) => setAyahFilter(e.target.value)}
                placeholder="Filter ayah # or Kanzul Iman translation…"
                className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>
            <button
              type="button"
              onClick={() => setShowTranslit(!showTranslit)}
              className="px-3 py-2 rounded-xl border text-xs font-semibold cursor-pointer"
              style={{
                borderColor: showTranslit ? "var(--accent-secondary)" : "var(--border-hairline)",
              }}
            >
              Transliteration
            </button>
          </div>

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
                className="bento-card p-5 space-y-4 transition-colors"
                style={{
                  borderColor: isPlaying
                    ? "var(--accent-secondary)"
                    : isBookmarked
                    ? "var(--accent-gold)"
                    : undefined,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className="px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums"
                      style={{ backgroundColor: "var(--bg-muted)" }}
                    >
                      {ayah.surahName} ({ayah.id}) • p.{ayah.page}
                    </span>

                    {ayah.hanafiSajda && (
                      <span
                        className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                        style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                      >
                        ۩ Wajib Hanafi Sajda
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setViewMode("mushaf");
                        goToPage(ayah.page);
                        setSelectedAyahId(ayah.id);
                      }}
                      className="px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      Open p.{ayah.page}
                    </button>

                    <button
                      type="button"
                      onClick={() => logQuranAyah(ayah.id)}
                      className="p-2 rounded-xl border text-xs font-semibold cursor-pointer"
                      style={{
                        borderColor: isBookmarked ? "var(--accent-gold)" : "var(--border-hairline)",
                        color: isBookmarked ? "var(--accent-gold)" : "var(--text-muted)",
                      }}
                      title="Bookmark"
                    >
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => togglePlay(ayah)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
                      style={{ backgroundColor: isPlaying ? "var(--accent-secondary)" : "var(--accent-primary)" }}
                    >
                      {isAudioLoading ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : isPlaying ? (
                        <Pause className="w-3.5 h-3.5" />
                      ) : (
                        <Play className="w-3.5 h-3.5" />
                      )}
                      <span>{isAudioLoading ? "Loading" : isPlaying ? "Pause" : "Listen"}</span>
                    </button>
                  </div>
                </div>

                <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-right leading-[2.2]">
                  {renderTajweedArabic(
                    scriptMode === "indopak" ? ayah.arabicIndoPak : ayah.arabicUthmani,
                    tajweedColor
                  )}{" "}
                  <span style={{ color: "var(--accent-gold)" }}>۝{toArabicIndicDigits(ayah.ayahNum)}</span>
                </p>

                {showTranslit && ayah.transliteration && (
                  <p className="text-xs italic" style={{ color: "var(--accent-secondary)" }}>
                    {ayah.transliteration}
                  </p>
                )}

                <p
                  dir={tarjumaLang === "ur" ? "rtl" : "ltr"}
                  className={`text-base leading-relaxed ${
                    tarjumaLang === "ur" ? "font-urdu text-right text-lg" : ""
                  }`}
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
                        className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold cursor-pointer inline-flex items-center gap-1"
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

                <div
                  className="pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-xs"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  {ayah.khazainUlIrfanNote ? (
                    <button
                      type="button"
                      onClick={() => setOpenTafsirId(openTafsirId === ayah.id ? null : ayah.id)}
                      className="font-semibold cursor-pointer"
                      style={{ color: "var(--accent-gold)" }}
                    >
                      {openTafsirId === ayah.id ? "Hide Khazain-ul-Irfan Note ▲" : "Read Khazain-ul-Irfan Note ▼"}
                    </button>
                  ) : (
                    <span className="inline-flex items-center gap-1 opacity-70">
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Juz {ayah.juz}</span>
                    </span>
                  )}
                  <span className="font-mono text-[10px] opacity-60">
                    SHA-256: {(verifiedHashes[ayah.id] || ayah.sha256).slice(0, 16)}…
                  </span>
                </div>

                {ayah.khazainUlIrfanNote && openTafsirId === ayah.id && (
                  <div
                    className="p-3.5 rounded-xl text-xs leading-relaxed"
                    style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}
                  >
                    {ayah.khazainUlIrfanNote}
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* Selected Verse Kanzul Iman Bottom Sheet / Modal (Opened on tapping any verse on the Mushaf page) */}
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
                <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
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
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
                  style={{
                    backgroundColor: playingId === inspectedAyah.id ? "var(--accent-secondary)" : "var(--accent-primary)",
                  }}
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
              <span style={{ color: "var(--accent-gold)" }}>۝{toArabicIndicDigits(inspectedAyah.ayahNum)}</span>
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

            {inspectedAyah.hanafiSajda && (
              <div
                className="p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs"
                style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}
              >
                <span className="font-bold" style={{ color: "var(--accent-gold)" }}>
                  ۩ Wajib Hanafi Sajda-e-Tilawat
                </span>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => logSajda(inspectedAyah.id, "now")}
                    className="px-3 py-1 rounded-lg bg-emerald-600 text-white font-semibold cursor-pointer inline-flex items-center gap-1"
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>Log Sajda Now</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => logSajda(inspectedAyah.id, "defer")}
                    className="px-3 py-1 rounded-lg border font-semibold cursor-pointer inline-flex items-center gap-1"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <Clock className="w-3.5 h-3.5" />
                    <span>Defer</span>
                  </button>
                </div>
              </div>
            )}
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
                <span className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
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
                      className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold cursor-pointer"
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
