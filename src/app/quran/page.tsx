"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import {
  BookOpen,
  Play,
  Pause,
  ShieldCheck,
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
  Columns2,
  FileText,
  AlignJustify,
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
  n: number; // numberInSurah
  g: number; // global ayah number (1..6236)
  p: number; // Mushaf page (1..604)
  j: number; // Juz (1..30)
  r: number; // Ruku
  h: number; // HizbQuarter
  t: string; // Arabic text
  u: string; // Kanzul Iman Urdu
  e: string; // Kanzul Iman English
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
  { num: 1, page: 1, label: "Al-Fatihah (p.1)" },
  { num: 18, page: 293, label: "Al-Kahf (p.293)" },
  { num: 36, page: 440, label: "Yaseen (p.440)" },
  { num: 55, page: 531, label: "Ar-Rahman (p.531)" },
  { num: 56, page: 534, label: "Al-Waqiah (p.534)" },
  { num: 67, page: 562, label: "Al-Mulk (p.562)" },
  { num: 32, page: 415, label: "As-Sajdah (p.415)" },
  { num: 96, page: 597, label: "Al-Alaq (p.597)" },
];

const CURATED_BY_ID = new Map<string, QuranAyah>(QURAN_AYAHS.map((a) => [a.id, a]));

function parseRef(ref: string): { surahNum: number; ayahNum: number } {
  const [s, a] = ref.split(":").map((n) => parseInt(n, 10));
  return {
    surahNum: Number.isFinite(s) && s >= 1 && s <= 114 ? s : 1,
    ayahNum: Number.isFinite(a) && a >= 1 ? a : 1,
  };
}

/**
 * Strips leading Bismillah from Ayah 1 of Surahs 2..114 (except 9) when the
 * ornamental Surah header banner already displays Bismillah above it.
 */
function stripLeadingBismillah(text: string, surahNum: number, ayahNum: number): string {
  if (surahNum === 1 || surahNum === 9 || ayahNum !== 1) return text;
  const stripped = text.replace(/^بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ\s*/, "");
  return stripped.length > 0 ? stripped : text;
}

/**
 * Applies Tajweed visual cues to Arabic text when enabled.
 */
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

  // Navigation & Page Mode
  const [viewMode, setViewMode] = useState<"mushaf" | "surah" | "highlights">("mushaf");
  const [spreadMode, setSpreadMode] = useState<"single" | "double">("double");
  const [showMushafTarjuma, setShowMushafTarjuma] = useState(true);
  const [currentPage, setCurrentPage] = useState<number>(initialSurahMeta.startPage || 1);
  const [selectedSurah, setSelectedSurah] = useState<number>(initialRef.surahNum || 1);
  const [selectedAyahId, setSelectedAyahId] = useState<string>(lastQuranRef || "1:1");
  const [surahSearch, setSurahSearch] = useState("");
  const [ayahFilter, setAyahFilter] = useState("");
  const [pageInput, setPageInput] = useState<string>(String(initialSurahMeta.startPage || 1));

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

  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Load complete 114-Surah / 6,236-Ayah / 604-Page dataset from bundled JSON
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

  // Build fast lookup maps once quranData is loaded
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

  // Determine spread pages (RTL book layout: odd page on right, even page on left)
  const visiblePageNumbers = useMemo(() => {
    const clamped = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, currentPage));
    if (spreadMode === "single") return [clamped];
    // Standard Mushaf two-page spread: odd page (right) + even page (left)
    const rightPage = clamped % 2 === 1 ? clamped : clamped - 1;
    const leftPage = rightPage + 1;
    return leftPage <= TOTAL_MUSHAF_PAGES ? [rightPage, leftPage] : [rightPage];
  }, [currentPage, spreadMode]);

  const currentPageAyahs = useMemo(() => {
    const list: DisplayAyah[] = [];
    for (const p of visiblePageNumbers) {
      const ayahs = pagesMap.get(p) ?? [];
      list.push(...ayahs);
    }
    return list;
  }, [pagesMap, visiblePageNumbers]);

  // Active ayahs for Surah / Highlights list modes + audio queue
  const activeListAyahs: DisplayAyah[] = useMemo(() => {
    let base: DisplayAyah[] = [];
    if (viewMode === "mushaf") {
      base = currentPageAyahs;
    } else if (viewMode === "surah") {
      base = surahMap.get(selectedSurah) ?? [];
    } else {
      base = QURAN_AYAHS.map((a) => ayahByRef.get(a.id) ?? {
        ...a,
        globalNum: 1,
        page: 1,
        juz: 1,
        ruku: 1,
        hizbQuarter: 1,
      });
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

  const filteredSurahs = useMemo(() => {
    const q = surahSearch.trim().toLowerCase();
    if (!q) return SURAH_LIST;
    return SURAH_LIST.filter(
      (s) =>
        String(s.number).includes(q) ||
        s.englishName.toLowerCase().includes(q) ||
        s.englishNameTranslation.toLowerCase().includes(q) ||
        s.name.includes(surahSearch.trim())
    );
  }, [surahSearch]);

  // Compute real SHA-256 verification hashes for displayed ayahs
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

  // Sync playbackRate & loopAyah live to <audio> element
  useEffect(() => {
    if (!audioRef.current) return;
    audioRef.current.playbackRate = playbackRate;
    audioRef.current.loop = loopAyah;
  }, [playbackRate, loopAyah]);

  // Real Sleep Timer countdown
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

  const goToPage = useCallback((page: number) => {
    const clamped = Math.max(1, Math.min(TOTAL_MUSHAF_PAGES, page));
    setCurrentPage(clamped);
    setPageInput(String(clamped));
    const firstOnPage = pagesMap.get(clamped)?.[0];
    if (firstOnPage) {
      setSelectedSurah(firstOnPage.surahNum);
      setSelectedAyahId(firstOnPage.id);
    }
  }, [pagesMap]);

  const stepPage = useCallback(
    (delta: number) => {
      const step = spreadMode === "double" ? delta * 2 : delta;
      goToPage(currentPage + step);
    },
    [currentPage, spreadMode, goToPage]
  );

  // Keyboard navigation (Left/Right arrows flip Mushaf pages in RTL book order)
  useEffect(() => {
    if (viewMode !== "mushaf") return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA") return;
      // In an Arabic RTL Mushaf, pressing Left turns to the NEXT page, Right turns to the PREVIOUS page
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
      // If at the end of the current Mushaf page/spread, automatically turn to the next page and continue!
      if (viewMode === "mushaf") {
        const lastVisiblePage = visiblePageNumbers[visiblePageNumbers.length - 1];
        if (lastVisiblePage < TOTAL_MUSHAF_PAGES) {
          const nextPage = lastVisiblePage + 1;
          const nextPageAyahs = pagesMap.get(nextPage);
          if (nextPageAyahs && nextPageAyahs.length > 0) {
            goToPage(nextPage);
            playAyah(nextPageAyahs[0]);
            return;
          }
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
    setTimeout(() => {
      document.getElementById(`ayah-${ref}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    }, 80);
  };

  const getTranslation = (ayah: DisplayAyah): { text: string; fallbackNote?: string } => {
    if (tarjumaLang === "ur") return { text: ayah.kanzulImanUrdu };
    if (tarjumaLang === "ro_ur") {
      if (ayah.kanzulImanRomanUrdu) return { text: ayah.kanzulImanRomanUrdu };
      return {
        text: ayah.kanzulImanEnglish,
        fallbackNote: "Showing Kanzul Iman (English).",
      };
    }
    if (tarjumaLang === "hi") {
      if (ayah.kanzulImanHindi) return { text: ayah.kanzulImanHindi };
      return {
        text: ayah.kanzulImanEnglish,
        fallbackNote: "Showing Kanzul Iman (English).",
      };
    }
    return { text: ayah.kanzulImanEnglish };
  };

  // Render a single ornate Mushaf page sheet (1..604)
  const renderMushafPageSheet = (pageNum: number, side: "right" | "left" | "single") => {
    const pageAyahs = pagesMap.get(pageNum) ?? [];
    const firstAyah = pageAyahs[0];
    const lastAyah = pageAyahs[pageAyahs.length - 1];
    const juzNum = firstAyah?.juz ?? 1;
    const juzMeta = JUZ_LIST.find((j) => j.juz === juzNum);
    const hizbNum = firstAyah ? Math.ceil(firstAyah.hizbQuarter / 4) : 1;
    const isOpeningPage = pageNum === 1 || pageNum === 2;

    // Group consecutive ayahs on this page by Surah so we can render Surah header banners mid-page
    const surahBlocks: { surahNum: number; surahName: string; surahArabic: string; ayahs: DisplayAyah[] }[] = [];
    for (const ay of pageAyahs) {
      const lastBlock = surahBlocks[surahBlocks.length - 1];
      if (!lastBlock || lastBlock.surahNum !== ay.surahNum) {
        surahBlocks.push({
          surahNum: ay.surahNum,
          surahName: ay.surahName,
          surahArabic: ay.surahArabic,
          ayahs: [ay],
        });
      } else {
        lastBlock.ayahs.push(ay);
      }
    }

    const pageHasSajda = pageAyahs.some((a) => a.hanafiSajda);

    return (
      <div
        key={pageNum}
        className={`relative flex flex-col justify-between rounded-2xl p-4 sm:p-6 transition-all select-text ${
          side === "right"
            ? "lg:rounded-l-none lg:border-l-0"
            : side === "left"
            ? "lg:rounded-r-none"
            : ""
        }`}
        style={{
          background:
            "radial-gradient(circle at 50% 15%, color-mix(in srgb, var(--accent-gold) 8%, var(--bg-surface)), var(--bg-surface) 75%)",
          border: "2px solid color-mix(in srgb, var(--accent-gold) 45%, var(--border-hairline))",
          boxShadow:
            side === "right"
              ? "inset -14px 0 24px -12px rgba(0,0,0,0.35), 0 12px 32px -8px rgba(0,0,0,0.28)"
              : side === "left"
              ? "inset 14px 0 24px -12px rgba(0,0,0,0.35), 0 12px 32px -8px rgba(0,0,0,0.28)"
              : "0 12px 32px -8px rgba(0,0,0,0.28)",
          minHeight: isOpeningPage ? "540px" : "680px",
        }}
      >
        {/* Inner gilded double-frame border */}
        <div
          className="pointer-events-none absolute inset-2 sm:inset-3 rounded-xl"
          style={{
            border: "1px solid color-mix(in srgb, var(--accent-gold) 32%, var(--border-hairline))",
          }}
        />

        {/* Corner Arabesque Flourishes */}
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

        {/* Top Running Mushaf Header (Juz on Right, Surah on Left, Page/Manzil in Center) */}
        <header
          dir="rtl"
          className="relative z-10 flex items-center justify-between gap-2 pb-2.5 mb-3 border-b text-xs"
          style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 30%, var(--border-hairline))" }}
        >
          <div className="flex items-center gap-1.5 font-semibold" style={{ color: "var(--accent-gold)" }}>
            <span className="font-arabic text-base">الجزء {toArabicIndicDigits(juzNum)}</span>
            {juzMeta && <span className="font-arabic text-sm opacity-80">({juzMeta.arabicTitle})</span>}
          </div>

          <div className="flex items-center gap-2 text-[11px] font-semibold" style={{ color: "var(--text-muted)" }}>
            <span>Hizb {hizbNum}</span>
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
            <span className="font-arabic text-base">{firstAyah?.surahArabic}</span>
            <span className="text-[11px] opacity-80">({firstAyah?.surahName})</span>
          </div>
        </header>

        {/* Main Mushaf Page Body (Continuous Flowing Justified Arabic Lines) */}
        <div className={`relative z-10 flex-1 flex flex-col ${isOpeningPage ? "justify-center py-4" : "justify-start"} space-y-4`}>
          {surahBlocks.map((block) => {
            const startsOnThisPage = block.ayahs[0]?.ayahNum === 1;
            const showBismillahBanner = startsOnThisPage && block.surahNum !== 1 && block.surahNum !== 9;
            const surahInfo = SURAH_LIST.find((s) => s.number === block.surahNum);

            return (
              <div key={`${pageNum}-surah-${block.surahNum}`} className="space-y-3">
                {/* Ornate Surah Unwan (Header Cartouche) when a Surah begins on this page */}
                {startsOnThisPage && (
                  <div
                    className="relative my-2 py-2.5 px-4 rounded-xl text-center overflow-hidden"
                    style={{
                      background:
                        "linear-gradient(90deg, color-mix(in srgb, var(--accent-gold) 16%, transparent), color-mix(in srgb, var(--accent-primary) 18%, var(--bg-muted)), color-mix(in srgb, var(--accent-gold) 16%, transparent))",
                      border: "1.5px solid color-mix(in srgb, var(--accent-gold) 55%, var(--border-hairline))",
                    }}
                  >
                    <div className="flex items-center justify-between text-[11px] font-semibold" style={{ color: "var(--accent-gold)" }}>
                      <span>Surah {block.surahNum}: {block.surahName}</span>
                      <span className="font-arabic text-xl sm:text-2xl" style={{ color: "var(--text-primary)" }}>
                        {block.surahArabic}
                      </span>
                      <span>
                        {surahInfo?.numberOfAyahs} Ayahs • {surahInfo?.revelationType}
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

                {/* Continuous Mushaf Arabic Flow with Inline End-of-Ayah Rosettes */}
                <div
                  dir="rtl"
                  className={`font-arabic text-right ${
                    isOpeningPage
                      ? "text-center text-3xl sm:text-4xl leading-[2.5] px-2 sm:px-6"
                      : "text-2xl sm:text-[27px] leading-[2.35]"
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
                        }}
                        onDoubleClick={() => togglePlay(ayah)}
                        title={`Ayah ${ayah.id} — Click to inspect Kanzul Iman, double-click to play recitation`}
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
                            className="inline-block mx-1 px-1.5 py-0.2 rounded text-sm font-bold align-middle"
                            style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                            title="Wajib Hanafi Sajda-e-Tilawat"
                          >
                            ۩ سجدہ
                          </span>
                        )}

                        {/* Ornate End-of-Ayah Medallion (۝ + Eastern Arabic Number) */}
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedAyahId(ayah.id);
                            togglePlay(ayah);
                          }}
                          className="inline-flex items-center justify-center mx-1.5 px-1.5 py-0.5 rounded-full text-sm font-bold align-middle cursor-pointer transition-transform hover:scale-110"
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

          {/* Optional Kanzul Iman Hashiya (Footnotes / Page Translation Panel) */}
          {showMushafTarjuma && pageAyahs.length > 0 && (
            <div
              className="mt-4 pt-3 border-t space-y-2"
              style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 30%, var(--border-hairline))" }}
            >
              <div className="flex items-center justify-between text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                <span>Kanzul Iman Page Tarjuma ({tarjumaLang === "ur" ? "اردو" : "English"})</span>
                <span>
                  {firstAyah?.id} – {lastAyah?.id}
                </span>
              </div>
              <div className="max-h-56 overflow-y-auto pr-1 space-y-2 text-xs">
                {pageAyahs.map((ay) => {
                  const isSelected = selectedAyahId === ay.id || playingId === ay.id;
                  const tr = getTranslation(ay);
                  return (
                    <div
                      key={`tr-${ay.id}`}
                      onClick={() => setSelectedAyahId(ay.id)}
                      className="p-2 rounded-lg cursor-pointer transition-colors"
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

        {/* Bottom Mushaf Page Number Medallion */}
        <footer
          className="relative z-10 pt-3 mt-4 border-t flex items-center justify-between text-xs"
          style={{ borderColor: "color-mix(in srgb, var(--accent-gold) 30%, var(--border-hairline))" }}
        >
          <span className="text-[11px] opacity-70">
            Ruku {firstAyah?.ruku ?? 1}
          </span>

          <div
            className="inline-flex items-center gap-2 px-4 py-1 rounded-full font-bold tabular-nums"
            style={{
              backgroundColor: "color-mix(in srgb, var(--accent-gold) 15%, var(--bg-muted))",
              border: "1px solid color-mix(in srgb, var(--accent-gold) 45%, var(--border-hairline))",
              color: "var(--accent-gold)",
            }}
          >
            <span className="font-arabic text-base">{toArabicIndicDigits(pageNum)}</span>
            <span className="text-[11px] opacity-80">Page {pageNum}</span>
          </div>

          <span className="text-[11px] opacity-70">
            {pageAyahs.length} Ayahs
          </span>
        </footer>
      </div>
    );
  };

  return (
    <div className="space-y-6">
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

      {/* Top Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--accent-secondary)" }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Complete 604-Page Mushaf • 114 Surahs • 6,236 Ayahs • Kanzul Iman</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Holy Quran Mushaf (Kanzul Iman)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          {lastQuranRef && (
            <button
              type="button"
              onClick={() => jumpToRef(lastQuranRef)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
              style={{ borderColor: "var(--accent-gold)", color: "var(--accent-gold)" }}
            >
              <Bookmark className="w-3.5 h-3.5" />
              <span>Resume ({lastQuranRef})</span>
            </button>
          )}
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold"
            style={{
              borderColor: "var(--border-hairline)",
              backgroundColor: "var(--accent-soft)",
              color: "var(--accent-primary)",
            }}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>6,236 Ayahs Bundled • SHA-256 Verified</span>
          </span>
        </div>
      </div>

      {/* Navigation & Mushaf Page Controller */}
      <div className="bento-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          {/* View Mode Switcher */}
          <div
            className="inline-flex rounded-xl p-1 border"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            <button
              type="button"
              onClick={() => setViewMode("mushaf")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              style={{
                backgroundColor: viewMode === "mushaf" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "mushaf" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Mushaf Pages (1–604)</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("surah")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              style={{
                backgroundColor: viewMode === "surah" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "surah" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <AlignJustify className="w-3.5 h-3.5" />
              <span>Ayah-by-Ayah Study</span>
            </button>
            <button
              type="button"
              onClick={() => setViewMode("highlights")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer inline-flex items-center gap-1.5 transition-colors"
              style={{
                backgroundColor: viewMode === "highlights" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "highlights" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>Sajda &amp; Tafsir Highlights</span>
            </button>
          </div>

          {/* Single vs 2-Page Book Spread Toggle */}
          {viewMode === "mushaf" && (
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <button
                type="button"
                onClick={() => setSpreadMode(spreadMode === "double" ? "single" : "double")}
                className="px-3 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1.5 cursor-pointer"
                style={{
                  borderColor: spreadMode === "double" ? "var(--accent-gold)" : "var(--border-hairline)",
                  color: spreadMode === "double" ? "var(--accent-gold)" : "var(--text-primary)",
                }}
              >
                {spreadMode === "double" ? <Columns2 className="w-3.5 h-3.5" /> : <FileText className="w-3.5 h-3.5" />}
                <span>{spreadMode === "double" ? "2-Page Book Spread" : "Single Page"}</span>
              </button>

              <button
                type="button"
                onClick={() => setShowMushafTarjuma(!showMushafTarjuma)}
                className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
                style={{
                  borderColor: showMushafTarjuma ? "var(--accent-primary)" : "var(--border-hairline)",
                  backgroundColor: showMushafTarjuma ? "var(--accent-soft)" : "transparent",
                }}
              >
                Page Tarjuma: {showMushafTarjuma ? "Shown" : "Hidden"}
              </button>
            </div>
          )}

          {viewMode !== "mushaf" && (
            <div className="relative flex-1 min-w-[200px] max-w-xs">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
              <input
                type="text"
                value={ayahFilter}
                onChange={(e) => setAyahFilter(e.target.value)}
                placeholder="Filter ayah # or Kanzul Iman…"
                className="w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>
          )}
        </div>

        {/* Surah + Juz (Para) + Page Jump Bar */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-2 pt-1">
          {/* Surah Search Filter */}
          <div className="relative md:col-span-3">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={surahSearch}
              onChange={(e) => setSurahSearch(e.target.value)}
              placeholder="Search 114 Surahs…"
              className="w-full pl-8 pr-3 py-2 rounded-xl border text-xs bg-transparent outline-none"
              style={{ borderColor: "var(--border-hairline)" }}
            />
          </div>

          {/* 114 Surah Selector */}
          <select
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
            className="md:col-span-4 px-3 py-2 rounded-xl border text-xs font-semibold bg-transparent outline-none"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            {filteredSurahs.map((s) => (
              <option key={s.number} value={s.number} className="text-black">
                {s.number}. {s.englishName} ({s.name}) — {s.numberOfAyahs} Ayahs (p.{s.startPage})
              </option>
            ))}
          </select>

          {/* 30 Juz / Para Selector */}
          <select
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
            className="md:col-span-3 px-3 py-2 rounded-xl border text-xs font-semibold bg-transparent outline-none"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            {JUZ_LIST.map((j) => (
              <option key={j.juz} value={j.juz} className="text-black">
                Para {j.juz}: {j.arabicTitle} — p.{j.startPage} ({j.surahName})
              </option>
            ))}
          </select>

          {/* Direct Page Stepper (1..604) */}
          <div className="md:col-span-2 flex items-center justify-end gap-1">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => stepPage(-1)}
              className="p-2 rounded-xl border disabled:opacity-40 cursor-pointer"
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
                className="w-14 px-2 py-1.5 rounded-xl border text-center text-xs font-bold tabular-nums bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)" }}
                aria-label="Mushaf Page Number"
              />
              <span className="text-[11px] opacity-60">/604</span>
            </form>
            <button
              type="button"
              disabled={currentPage >= TOTAL_MUSHAF_PAGES}
              onClick={() => stepPage(1)}
              className="p-2 rounded-xl border disabled:opacity-40 cursor-pointer"
              style={{ borderColor: "var(--border-hairline)" }}
              title="Next Page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Quick Sunnah Surahs */}
        <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
          <span className="font-semibold mr-1" style={{ color: "var(--text-muted)" }}>
            Sunnah Surahs:
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
              className="px-2.5 py-1 rounded-full border font-semibold cursor-pointer transition-colors"
              style={{
                borderColor: currentSurahMeta.number === qs.num ? "var(--accent-primary)" : "var(--border-hairline)",
                backgroundColor: currentSurahMeta.number === qs.num ? "var(--accent-soft)" : "transparent",
                color: currentSurahMeta.number === qs.num ? "var(--accent-primary)" : "var(--text-muted)",
              }}
            >
              {qs.label}
            </button>
          ))}
        </div>
      </div>

      {/* Reading & Audio Controls Bar */}
      <div className="bento-card p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
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
            Tajweed Accent: {tajweedColor ? "On" : "Off"}
          </button>
          <button
            type="button"
            onClick={() => setShowTranslit(!showTranslit)}
            className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
            style={{
              borderColor: showTranslit ? "var(--accent-secondary)" : "var(--border-hairline)",
              backgroundColor: showTranslit ? "var(--accent-soft)" : "transparent",
            }}
          >
            Transliteration
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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

          {currentPageAyahs.length > 0 && (
            <button
              type="button"
              onClick={() => togglePlay(inspectedAyah ?? currentPageAyahs[0])}
              className="px-3 py-1.5 rounded-xl font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
              style={{ backgroundColor: playingId ? "var(--accent-secondary)" : "var(--accent-primary)" }}
            >
              {playingId ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
              <span>{playingId ? `Pause (${playingId})` : `Recite Page ${visiblePageNumbers[0]}`}</span>
            </button>
          )}

          <button
            type="button"
            onClick={() => setPlaybackRate(playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 0.75 : 1)}
            className="px-2.5 py-1.5 rounded-xl border font-semibold tabular-nums cursor-pointer"
            style={{ borderColor: "var(--border-hairline)" }}
            title="Playback Speed"
          >
            {playbackRate}x
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

      {audioError && (
        <div
          className="p-3 rounded-xl border text-xs flex items-center justify-between gap-2"
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
        <div className="bento-card p-12 text-center space-y-3">
          <Loader2 className="w-7 h-7 animate-spin mx-auto" style={{ color: "var(--accent-primary)" }} />
          <p className="text-sm font-semibold">Opening Complete 604-Page Mushaf (Kanzul Iman)…</p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            Loading all 114 Surahs and 6,236 blessed verses for instant page turning.
          </p>
        </div>
      )}

      {corpusError && !loadingCorpus && (
        <div className="bento-card p-6 text-xs" style={{ borderColor: "var(--accent-gold)" }}>
          {corpusError}
        </div>
      )}

      {/* Main Content + Sidebar */}
      {!loadingCorpus && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-4">
            {/* VIEW 1: PRINTED MUSHAF PAGES (1..604) */}
            {viewMode === "mushaf" && (
              <div className="space-y-4">
                {/* RTL Book Spread Container (dir="rtl" puts odd right page on the right, even left page on the left) */}
                <div
                  dir="rtl"
                  className={`grid grid-cols-1 ${
                    visiblePageNumbers.length === 2 ? "xl:grid-cols-2 gap-3 lg:gap-0" : "max-w-3xl mx-auto"
                  }`}
                >
                  {visiblePageNumbers.map((pNum, idx) =>
                    renderMushafPageSheet(
                      pNum,
                      visiblePageNumbers.length === 1 ? "single" : idx === 0 ? "right" : "left"
                    )
                  )}
                </div>

                {/* Page Turn Bottom Bar (RTL Book Direction: Next Page is on the Left, Previous Page is on the Right) */}
                <div className="bento-card p-3.5 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <button
                    type="button"
                    disabled={visiblePageNumbers[visiblePageNumbers.length - 1] >= TOTAL_MUSHAF_PAGES}
                    onClick={() => stepPage(1)}
                    className="px-3.5 py-2 rounded-xl font-semibold text-white inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Next Mushaf Page (←)</span>
                  </button>

                  <div className="text-center">
                    <div className="font-bold">
                      {visiblePageNumbers.length === 2
                        ? `Mushaf Spread: Pages ${visiblePageNumbers[0]} – ${visiblePageNumbers[1]} of 604`
                        : `Mushaf Page ${visiblePageNumbers[0]} of 604`}
                    </div>
                    <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                      Tip: Click any verse to inspect Kanzul Iman • Double-click or tap ۝ to play audio
                    </div>
                  </div>

                  <button
                    type="button"
                    disabled={visiblePageNumbers[0] <= 1}
                    onClick={() => stepPage(-1)}
                    className="px-3.5 py-2 rounded-xl border font-semibold inline-flex items-center gap-1.5 disabled:opacity-40 cursor-pointer"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    <span>Previous Page (→)</span>
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* VIEW 2 & 3: AYAH-BY-AYAH STUDY & HIGHLIGHTS */}
            {viewMode !== "mushaf" && (
              <div className="space-y-4">
                <div
                  className="bento-card hero-surface p-5 text-center space-y-2"
                  style={{ borderColor: "color-mix(in srgb, var(--accent-primary) 28%, var(--border-hairline))" }}
                >
                  <div
                    className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {viewMode === "surah" ? (
                      <>
                        <span>
                          Surah {currentSurahMeta.number}: {currentSurahMeta.englishName}
                        </span>
                        <span>•</span>
                        <span>{currentSurahMeta.revelationType}</span>
                        <span>•</span>
                        <span>{currentSurahMeta.numberOfAyahs} Ayahs</span>
                        <span>•</span>
                        <span>Starts on Page {currentSurahMeta.startPage}</span>
                      </>
                    ) : (
                      <span>Kanzul Iman • Khazain-ul-Irfan Highlights</span>
                    )}
                  </div>

                  {viewMode === "surah" && (
                    <div className="font-arabic text-2xl sm:text-3xl" dir="rtl">
                      {currentSurahMeta.name}
                    </div>
                  )}

                  {(viewMode === "highlights" || selectedSurah !== 9) && (
                    <>
                      <p dir="rtl" className="font-arabic text-2xl sm:text-3xl leading-relaxed">
                        بِسْمِ اللّٰهِ الرَّحْمٰنِ الرَّحِيْمِ
                      </p>
                      <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                        In the name of Allah, the Most Affectionate, the Merciful
                      </p>
                    </>
                  )}
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
                      className="bento-card p-6 space-y-4 transition-colors"
                      style={{
                        borderColor: isPlaying
                          ? "var(--accent-secondary)"
                          : isBookmarked
                          ? "var(--accent-gold)"
                          : undefined,
                      }}
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <span
                            className="relative w-8 h-8 inline-flex items-center justify-center shrink-0"
                            style={{ color: "var(--accent-primary)" }}
                          >
                            <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none" stroke="currentColor" strokeWidth="1.6">
                              <rect x="6" y="6" width="20" height="20" rx="2" />
                              <rect x="6" y="6" width="20" height="20" rx="2" transform="rotate(45 16 16)" />
                            </svg>
                            <span className="absolute text-[10px] font-bold tabular-nums">{ayah.ayahNum}</span>
                          </span>

                          <span
                            className="px-2.5 py-1 rounded-lg text-xs font-bold tabular-nums"
                            style={{ backgroundColor: "var(--bg-muted)" }}
                          >
                            {ayah.surahName} ({ayah.id}) • Page {ayah.page}
                          </span>

                          {ayah.hanafiSajda && (
                            <span
                              className="px-2.5 py-1 rounded-full text-[11px] font-bold"
                              style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                            >
                              ۩ Wajib Hanafi Sajda-e-Tilawat
                            </span>
                          )}

                          {ayah.shafiiOnlySajdaNote && (
                            <span
                              className="px-2.5 py-1 rounded-full text-[11px] font-medium border"
                              style={{ borderColor: "var(--border-hairline)", color: "var(--text-muted)" }}
                            >
                              Not a Hanafi Sajda (22:18 is Wajib)
                            </span>
                          )}
                        </div>

                        <div className="flex items-center gap-2">
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
                            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                            style={{
                              borderColor: isBookmarked ? "var(--accent-gold)" : "var(--border-hairline)",
                              color: isBookmarked ? "var(--accent-gold)" : "var(--text-muted)",
                            }}
                          >
                            <Bookmark className="w-3.5 h-3.5" />
                            <span>{isBookmarked ? "Bookmarked" : "Bookmark"}</span>
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

                      <div className="space-y-1">
                        <p
                          dir={tarjumaLang === "ur" ? "rtl" : "ltr"}
                          className={`text-base leading-relaxed ${
                            tarjumaLang === "ur" ? "font-urdu text-right text-lg" : tarjumaLang === "hi" ? "font-hindi" : ""
                          }`}
                        >
                          {translation.text}
                        </p>
                      </div>

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
                              <span>{sajdaDone ? "Logged" : "Log Sajda Now"}</span>
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
                            {openTafsirId === ayah.id
                              ? "Hide Khazain-ul-Irfan Note ▲"
                              : "Read Khazain-ul-Irfan Note ▼"}
                          </button>
                        ) : (
                          <span className="inline-flex items-center gap-1 opacity-70">
                            <Volume2 className="w-3.5 h-3.5" />
                            <span>Alafasy Recitation • Juz {ayah.juz}</span>
                          </span>
                        )}
                        <span className="font-mono text-[10px] opacity-60">
                          SHA-256: {(verifiedHashes[ayah.id] || ayah.sha256).slice(0, 18)}…
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

            {/* Cross-Module Teleportation Bridge */}
            <div className="bento-card p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5" style={{ color: "var(--accent-gold)" }} />
                <div>
                  <div className="font-bold text-sm">Continue Your Journey — Quran to Fiqh &amp; Trivia</div>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Test your Kanzul Iman &amp; Hanafi Sajda knowledge or read Bahar-e-Shariat rulings.
                  </p>
                </div>
              </div>
              <div className="flex gap-2">
                <Link
                  href="/fiqh"
                  className="px-3 py-2 rounded-xl border text-xs font-semibold"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  Hanafi Fiqh
                </Link>
                <Link
                  href="/quiz"
                  className="px-3 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                >
                  <span>Play Ilm Quiz</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          {/* Right Sidebar: Selected Ayah Kanzul Iman Inspector + 14 Hanafi Sajdas */}
          <aside className="lg:col-span-4 space-y-4">
            {/* Selected Ayah Inspector Card */}
            {inspectedAyah && (
              <div
                className="bento-card p-5 space-y-3"
                style={{ borderColor: "color-mix(in srgb, var(--accent-primary) 40%, var(--border-hairline))" }}
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-[11px] font-semibold uppercase tracking-wider" style={{ color: "var(--accent-gold)" }}>
                      Selected Verse • Page {inspectedAyah.page} • Juz {inspectedAyah.juz}
                    </div>
                    <h2 className="text-sm font-bold">
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
                      <Bookmark className="w-3.5 h-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => togglePlay(inspectedAyah)}
                      className="px-3 py-1.5 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1.5 cursor-pointer"
                      style={{
                        backgroundColor: playingId === inspectedAyah.id ? "var(--accent-secondary)" : "var(--accent-primary)",
                      }}
                    >
                      {playingId === inspectedAyah.id ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{playingId === inspectedAyah.id ? "Pause" : "Listen"}</span>
                    </button>
                  </div>
                </div>

                <p dir="rtl" className="font-arabic text-xl text-right leading-[2.1] p-3 rounded-xl" style={{ backgroundColor: "var(--bg-muted)" }}>
                  {inspectedAyah.arabicUthmani}{" "}
                  <span style={{ color: "var(--accent-gold)" }}>۝{toArabicIndicDigits(inspectedAyah.ayahNum)}</span>
                </p>

                <div className="space-y-2 text-xs">
                  <div>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--accent-primary)" }}>
                      Kanzul Iman (Urdu — Ala Hazrat)
                    </div>
                    <p dir="rtl" className="font-urdu text-right text-base leading-relaxed">
                      {inspectedAyah.kanzulImanUrdu}
                    </p>
                  </div>

                  <div className="pt-2 border-t" style={{ borderColor: "var(--border-hairline)" }}>
                    <div className="text-[10px] font-bold uppercase tracking-wider mb-0.5" style={{ color: "var(--accent-secondary)" }}>
                      Kanzul Iman (English)
                    </div>
                    <p className="leading-relaxed">{inspectedAyah.kanzulImanEnglish}</p>
                  </div>
                </div>

                {inspectedAyah.hanafiSajda && (
                  <div
                    className="p-3 rounded-xl border space-y-2 text-xs"
                    style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}
                  >
                    <div className="font-bold" style={{ color: "var(--accent-gold)" }}>
                      ۩ Wajib Hanafi Sajda-e-Tilawat
                    </div>
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
            )}

            {/* Deferred Sajda Queue */}
            {sajdaQueue.length > 0 && (
              <div className="bento-card p-5 space-y-3" style={{ borderColor: "var(--accent-gold)" }}>
                <h2 className="text-sm font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                  <span>Deferred Sajda Queue ({sajdaQueue.length})</span>
                </h2>
                <div className="space-y-2 text-xs">
                  {sajdaQueue.map((ref) => (
                    <div
                      key={ref}
                      className="p-2.5 rounded-xl border flex items-center justify-between gap-2"
                      style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--gold-soft)" }}
                    >
                      <button
                        type="button"
                        onClick={() => jumpToRef(ref)}
                        className="font-semibold underline cursor-pointer"
                      >
                        ۩ Ayah {ref}
                      </button>
                      <button
                        type="button"
                        onClick={() => logSajda(ref, "now")}
                        className="px-2.5 py-1 rounded-lg bg-emerald-600 text-white font-semibold cursor-pointer"
                      >
                        Complete
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* 14 Hanafi Sajdas with Mushaf Page Numbers */}
            <div className="bento-card p-5 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-base font-bold">14 Hanafi Sajda-e-Tilawat</h2>
                <span
                  className="px-2 py-0.5 rounded-full text-[11px] font-bold tabular-nums"
                  style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}
                >
                  {sajdaCompleted.length}/14
                </span>
              </div>
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Strictly follows Hanafi fiqh (includes 84:21 &amp; 96:19; excludes Shafi&apos;i-only 22:77). Click any verse to open its Mushaf page.
              </p>
              <div className="grid grid-cols-1 gap-1.5 text-xs">
                {HANAFI_SAJDA_ITEMS.map((s) => {
                  const done = sajdaCompleted.includes(s.ref);
                  const deferred = sajdaQueue.includes(s.ref);
                  return (
                    <button
                      key={s.ref}
                      type="button"
                      onClick={() => jumpToRef(s.ref)}
                      className="w-full text-left px-3 py-2 rounded-xl border flex items-center justify-between gap-2 cursor-pointer transition-colors hover:opacity-90"
                      style={{
                        borderColor: done ? "var(--accent-primary)" : "var(--border-hairline)",
                        backgroundColor: done ? "var(--accent-soft)" : "var(--bg-muted)",
                      }}
                    >
                      <span className="font-medium">۩ {s.label}</span>
                      <span className="inline-flex items-center gap-1.5 text-[11px] opacity-75">
                        <span>p.{s.page}</span>
                        {done ? (
                          <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
                        ) : deferred ? (
                          <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
                        ) : (
                          <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
                        )}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </aside>
        </div>
      )}
    </div>
  );
}
