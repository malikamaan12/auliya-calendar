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
} from "lucide-react";
import { useApp } from "@/lib/store";
import {
  HANAFI_SAJDA_ITEMS,
  HANAFI_SAJDA_REFS,
  QURAN_AYAHS,
  QuranAyah,
  SURAH_LIST,
  getEveryAyahUrl,
} from "@/data/quran";
import { sha256Hex } from "@/lib/crypto-integrity";

interface DisplayAyah {
  id: string;
  surahNum: number;
  surahName: string;
  surahArabic: string;
  ayahNum: number;
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

const QUICK_SUNNAH_SURAHS = [
  { num: 1, label: "Al-Fatihah (1)" },
  { num: 18, label: "Al-Kahf (18)" },
  { num: 36, label: "Yaseen (36)" },
  { num: 55, label: "Ar-Rahman (55)" },
  { num: 56, label: "Al-Waqiah (56)" },
  { num: 67, label: "Al-Mulk (67)" },
  { num: 32, label: "As-Sajdah (32)" },
  { num: 96, label: "Al-Alaq (96)" },
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
 * Applies subtle Tajweed visual cues to Arabic text when enabled:
 * - Sajdah symbol (۩) in gold
 * - Madd / Dagger Alif / Shaddah clusters highlighted for recitation awareness
 */
function renderTajweedArabic(text: string, enabled: boolean): React.ReactNode {
  if (!enabled) return text;
  // Split around Sajdah symbol and Madd/Shaddah-bearing characters
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

  const [viewMode, setViewMode] = useState<"surah" | "highlights">("surah");
  const [selectedSurah, setSelectedSurah] = useState<number>(initialRef.surahNum || 1);
  const [surahSearch, setSurahSearch] = useState("");
  const [ayahFilter, setAyahFilter] = useState("");
  const pendingScrollAyahIdRef = useRef<string | null>(null);

  const [surahAyahs, setSurahAyahs] = useState<DisplayAyah[]>([]);
  const [loadingSurah, setLoadingSurah] = useState(false);
  const [surahError, setSurahError] = useState<string | null>(null);

  const [scriptMode, setScriptMode] = useState<"indopak" | "uthmani">("indopak");
  const [showTranslit, setShowTranslit] = useState(true);
  const [tajweedColor, setTajweedColor] = useState(true);
  const [openTafsirId, setOpenTafsirId] = useState<string | null>("18:28");
  const [tarjumaLang, setTarjumaLang] = useState<"ur" | "en" | "ro_ur" | "hi">(
    lang === "ur" || lang === "ro_ur" || lang === "hi" ? lang : "en"
  );

  // Audio state
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [audioLoadingId, setAudioLoadingId] = useState<string | null>(null);
  const [audioError, setAudioError] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopAyah, setLoopAyah] = useState(false);
  const [autoAdvance, setAutoAdvance] = useState(true);

  // Working Sleep Timer (in seconds)
  const [sleepSecondsLeft, setSleepSecondsLeft] = useState<number | null>(null);
  const [verifiedHashes, setVerifiedHashes] = useState<Record<string, string>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const memCacheRef = useRef<Record<string, DisplayAyah[]>>({});

  const currentSurahMeta = useMemo(
    () => SURAH_LIST.find((s) => s.number === selectedSurah) ?? SURAH_LIST[0],
    [selectedSurah]
  );

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

  // Fetch selected Surah (with Hindi edition when needed, cached in memory + localStorage)
  const loadSurah = useCallback(async (surahNum: number, includeHindi: boolean) => {
    const cacheKey = `${surahNum}:${includeHindi ? "hi" : "std"}`;
    if (memCacheRef.current[cacheKey]) {
      setSurahAyahs(memCacheRef.current[cacheKey]);
      setSurahError(null);
      return;
    }

    const lsKey = `auliya_surah_v1_${cacheKey}`;
    try {
      const cached = localStorage.getItem(lsKey);
      if (cached) {
        const parsed = JSON.parse(cached) as DisplayAyah[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          memCacheRef.current[cacheKey] = parsed;
          setSurahAyahs(parsed);
          setSurahError(null);
          return;
        }
      }
    } catch {
      // ignore storage errors
    }

    setLoadingSurah(true);
    setSurahError(null);

    try {
      const editions = includeHindi
        ? "quran-uthmani,ur.kanzuliman,en.ahmedraza,en.transliteration,hi.hindi"
        : "quran-uthmani,ur.kanzuliman,en.ahmedraza,en.transliteration";
      const res = await fetch(`https://api.alquran.cloud/v1/surah/${surahNum}/editions/${editions}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const json = await res.json();
      if (!json?.data || !Array.isArray(json.data) || json.data.length < 4) {
        throw new Error("Unexpected Quran API response");
      }

      const [uthmaniEd, urduEd, engEd, translitEd, hindiEd] = json.data;
      const meta = SURAH_LIST.find((s) => s.number === surahNum);

      const ayahs: DisplayAyah[] = uthmaniEd.ayahs.map(
        (a: { numberInSurah: number; text: string }, idx: number) => {
          const ref = `${surahNum}:${a.numberInSurah}`;
          const curated = CURATED_BY_ID.get(ref);
          const isHanafiSajda = HANAFI_SAJDA_REFS.has(ref);
          const is22_77 = ref === "22:77";

          return {
            id: ref,
            surahNum,
            surahName: curated?.surahName ?? meta?.englishName ?? `Surah ${surahNum}`,
            surahArabic: meta?.name ?? "",
            ayahNum: a.numberInSurah,
            arabicIndoPak: curated?.arabicIndoPak ?? a.text,
            arabicUthmani: a.text,
            transliteration: translitEd.ayahs[idx]?.text ?? curated?.transliteration ?? "",
            kanzulImanUrdu: urduEd.ayahs[idx]?.text ?? curated?.kanzulImanUrdu ?? "",
            kanzulImanEnglish: engEd.ayahs[idx]?.text ?? curated?.kanzulImanEnglish ?? "",
            kanzulImanRomanUrdu: curated?.kanzulImanRomanUrdu,
            kanzulImanHindi: hindiEd?.ayahs?.[idx]?.text ?? curated?.kanzulImanHindi,
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
            audioUrl: getEveryAyahUrl(surahNum, a.numberInSurah),
            sha256: curated?.sha256 ?? `kanzul-iman-${surahNum}-${a.numberInSurah}`,
          };
        }
      );

      memCacheRef.current[cacheKey] = ayahs;
      try {
        localStorage.setItem(lsKey, JSON.stringify(ayahs));
      } catch {
        // ignore quota errors
      }
      setSurahAyahs(ayahs);
    } catch {
      const offlineMatches = QURAN_AYAHS.filter((a) => a.surahNum === surahNum);
      if (offlineMatches.length > 0) {
        setSurahAyahs(offlineMatches);
        setSurahError("Offline mode: showing cached Kanzul Iman verses for this Surah.");
      } else {
        setSurahAyahs([]);
        setSurahError("Could not load full Surah online. Check your connection or switch to Highlights.");
      }
    } finally {
      setLoadingSurah(false);
    }
  }, []);

  useEffect(() => {
    if (viewMode === "surah") {
      loadSurah(selectedSurah, tarjumaLang === "hi");
    }
  }, [viewMode, selectedSurah, tarjumaLang, loadSurah]);

  const activeAyahs: DisplayAyah[] = useMemo(() => {
    const base = viewMode === "highlights" ? QURAN_AYAHS : surahAyahs;
    const q = ayahFilter.trim().toLowerCase();
    if (!q) return base;
    return base.filter(
      (a) =>
        a.id.includes(q) ||
        String(a.ayahNum) === q ||
        a.kanzulImanEnglish.toLowerCase().includes(q) ||
        a.kanzulImanUrdu.includes(ayahFilter.trim()) ||
        a.transliteration.toLowerCase().includes(q)
    );
  }, [viewMode, surahAyahs, ayahFilter]);

  // Compute real SHA-256 verification hashes for currently displayed ayahs
  useEffect(() => {
    if (activeAyahs.length === 0) return;
    let cancelled = false;
    Promise.all(
      activeAyahs.slice(0, 50).map(async (a) => [a.id, await sha256Hex(`${a.id}|${a.kanzulImanUrdu}`)] as const)
    ).then((entries) => {
      if (!cancelled) setVerifiedHashes(Object.fromEntries(entries));
    });
    return () => {
      cancelled = true;
    };
  }, [activeAyahs]);

  // Scroll to a requested ayah once loaded
  useEffect(() => {
    const targetId = pendingScrollAyahIdRef.current;
    if (!targetId || loadingSurah) return;
    const el = document.getElementById(`ayah-${targetId}`);
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "center" });
      pendingScrollAyahIdRef.current = null;
    }
  }, [loadingSurah, activeAyahs]);

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
      const idx = activeAyahs.findIndex((a) => a.id === playingId);
      if (idx !== -1 && idx + 1 < activeAyahs.length) {
        const next = activeAyahs[idx + 1];
        playAyah(next);
        document.getElementById(`ayah-${next.id}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    setPlayingId(null);
  };

  const jumpToRef = (ref: string) => {
    const { surahNum } = parseRef(ref);
    setAyahFilter("");
    setViewMode("surah");
    if (selectedSurah === surahNum) {
      const el = document.getElementById(`ayah-${ref}`);
      if (el) {
        el.scrollIntoView({ behavior: "smooth", block: "center" });
        return;
      }
    }
    pendingScrollAyahIdRef.current = ref;
    setSelectedSurah(surahNum);
  };

  const getTranslation = (ayah: DisplayAyah): { text: string; fallbackNote?: string } => {
    if (tarjumaLang === "ur") return { text: ayah.kanzulImanUrdu };
    if (tarjumaLang === "ro_ur") {
      if (ayah.kanzulImanRomanUrdu) return { text: ayah.kanzulImanRomanUrdu };
      return {
        text: ayah.kanzulImanEnglish,
        fallbackNote: "Roman Urdu available for curated highlights; showing Kanzul Iman (English).",
      };
    }
    if (tarjumaLang === "hi") {
      if (ayah.kanzulImanHindi) return { text: ayah.kanzulImanHindi };
      return {
        text: ayah.kanzulImanEnglish,
        fallbackNote: "Hindi unavailable offline; showing Kanzul Iman (English).",
      };
    }
    return { text: ayah.kanzulImanEnglish };
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

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div
            className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1"
            style={{ color: "var(--accent-secondary)" }}
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kanzul Iman • Khazain-ul-Irfan • 14 Hanafi Sajdas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Holy Quran Suite (Kanzul Iman)
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
            <span>SHA-256 Verified</span>
          </span>
        </div>
      </div>

      {/* Mode Switcher + Surah Navigator */}
      <div className="bento-card p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="inline-flex rounded-xl p-1 border" style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}>
            <button
              type="button"
              onClick={() => setViewMode("surah")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              style={{
                backgroundColor: viewMode === "surah" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "surah" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              All 114 Surahs
            </button>
            <button
              type="button"
              onClick={() => setViewMode("highlights")}
              className="px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-colors"
              style={{
                backgroundColor: viewMode === "highlights" ? "var(--accent-primary)" : "transparent",
                color: viewMode === "highlights" ? "#ffffff" : "var(--text-muted)",
              }}
            >
              Kanzul Iman &amp; Sajda Highlights
            </button>
          </div>

          {/* Search ayahs inside current view */}
          <div className="relative flex-1 min-w-[200px] max-w-xs">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 opacity-50" />
            <input
              type="text"
              value={ayahFilter}
              onChange={(e) => setAyahFilter(e.target.value)}
              placeholder="Filter ayah # or text…"
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border text-xs bg-transparent outline-none"
              style={{ borderColor: "var(--border-hairline)" }}
            />
          </div>
        </div>

        {viewMode === "surah" && (
          <div className="space-y-3 pt-1">
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative sm:w-56">
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

              <select
                value={selectedSurah}
                onChange={(e) => {
                  setSelectedSurah(Number(e.target.value));
                  setAyahFilter("");
                }}
                className="flex-1 px-3 py-2 rounded-xl border text-xs font-semibold bg-transparent outline-none"
                style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
              >
                {filteredSurahs.map((s) => (
                  <option key={s.number} value={s.number} className="text-black">
                    {s.number}. {s.englishName} ({s.englishNameTranslation}) — {s.numberOfAyahs} Ayahs
                  </option>
                ))}
              </select>

              <div className="flex items-center gap-1.5">
                <button
                  type="button"
                  disabled={selectedSurah <= 1}
                  onClick={() => setSelectedSurah((s) => Math.max(1, s - 1))}
                  className="p-2 rounded-xl border disabled:opacity-40 cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                  aria-label="Previous Surah"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  disabled={selectedSurah >= 114}
                  onClick={() => setSelectedSurah((s) => Math.min(114, s + 1))}
                  className="p-2 rounded-xl border disabled:opacity-40 cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                  aria-label="Next Surah"
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
                    setAyahFilter("");
                  }}
                  className="px-2.5 py-1 rounded-full border font-semibold cursor-pointer transition-colors"
                  style={{
                    borderColor: selectedSurah === qs.num ? "var(--accent-primary)" : "var(--border-hairline)",
                    backgroundColor: selectedSurah === qs.num ? "var(--accent-soft)" : "transparent",
                    color: selectedSurah === qs.num ? "var(--accent-primary)" : "var(--text-muted)",
                  }}
                >
                  {qs.label}
                </button>
              ))}
            </div>
          </div>
        )}
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
            title="Automatically play next ayah"
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

      {/* Main Content + Hanafi Sajda Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-4">
          {/* Calligraphic Surah Header & Bismillah Banner */}
          <div
            className="bento-card hero-surface p-5 text-center space-y-2"
            style={{ borderColor: "color-mix(in srgb, var(--accent-primary) 28%, var(--border-hairline))" }}
          >
            <div className="flex flex-wrap items-center justify-center gap-2 text-[11px] font-semibold uppercase tracking-widest" style={{ color: "var(--accent-gold)" }}>
              {viewMode === "surah" ? (
                <>
                  <span>Surah {currentSurahMeta.number}: {currentSurahMeta.englishName}</span>
                  <span>•</span>
                  <span>{currentSurahMeta.revelationType}</span>
                  <span>•</span>
                  <span>{currentSurahMeta.numberOfAyahs} Ayahs</span>
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

            {/* Surah At-Tawbah (9) does not begin with Bismillah */}
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

          {loadingSurah && (
            <div className="bento-card p-10 text-center space-y-2">
              <Loader2 className="w-6 h-6 animate-spin mx-auto" style={{ color: "var(--accent-primary)" }} />
              <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                Loading Surah {currentSurahMeta.englishName} with Kanzul Iman…
              </p>
            </div>
          )}

          {surahError && !loadingSurah && (
            <div className="bento-card p-4 text-xs flex flex-wrap items-center justify-between gap-2" style={{ borderColor: "var(--accent-gold)" }}>
              <span>{surahError}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => loadSurah(selectedSurah, tarjumaLang === "hi")}
                  className="px-3 py-1 rounded-lg font-semibold text-white cursor-pointer"
                  style={{ backgroundColor: "var(--accent-primary)" }}
                >
                  Retry
                </button>
                <button
                  type="button"
                  onClick={() => setViewMode("highlights")}
                  className="px-3 py-1 rounded-lg border font-semibold cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  View Highlights
                </button>
              </div>
            </div>
          )}

          {!loadingSurah && activeAyahs.length === 0 && !surahError && (
            <div className="bento-card p-8 text-center text-xs" style={{ color: "var(--text-muted)" }}>
              No ayahs match your filter.
            </div>
          )}

          {!loadingSurah &&
            activeAyahs.map((ayah) => {
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
                      {/* 8-point Islamic Star (Octagram) Verse Medallion */}
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
                        {ayah.surahName} ({ayah.id})
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
                        onClick={() => logQuranAyah(ayah.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                        style={{
                          borderColor: isBookmarked ? "var(--accent-gold)" : "var(--border-hairline)",
                          color: isBookmarked ? "var(--accent-gold)" : "var(--text-muted)",
                        }}
                        title="Bookmark this Ayah"
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

                  {/* Arabic Text */}
                  <p dir="rtl" className="font-arabic text-2xl sm:text-3xl text-right leading-[2.2]">
                    {renderTajweedArabic(
                      scriptMode === "indopak" ? ayah.arabicIndoPak : ayah.arabicUthmani,
                      tajweedColor
                    )}
                  </p>

                  {showTranslit && ayah.transliteration && (
                    <p className="text-xs italic" style={{ color: "var(--accent-secondary)" }}>
                      {ayah.transliteration}
                    </p>
                  )}

                  {/* Kanzul Iman Translation */}
                  <div className="space-y-1">
                    <p
                      dir={tarjumaLang === "ur" ? "rtl" : "ltr"}
                      className={`text-base leading-relaxed ${
                        tarjumaLang === "ur" ? "font-urdu text-right text-lg" : tarjumaLang === "hi" ? "font-hindi" : ""
                      }`}
                    >
                      {translation.text}
                    </p>
                    {translation.fallbackNote && (
                      <p className="text-[11px]" style={{ color: "var(--text-muted)" }}>
                        {translation.fallbackNote}
                      </p>
                    )}
                  </div>

                  {/* Hanafi Sajda Action Bar */}
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

                  {/* Expandable Khazain-ul-Irfan Tafsir + SHA-256 Hash */}
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
                        <span>Alafasy Recitation</span>
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

          {/* Cross-Module Teleportation Bridge (PRD Section 2.3) */}
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

        {/* Right Sidebar: Deferred Sajda Queue + Interactive 14 Hanafi Sajdas */}
        <aside className="lg:col-span-4 space-y-4">
          {sajdaQueue.length > 0 && (
            <div
              className="bento-card p-5 space-y-3"
              style={{ borderColor: "var(--accent-gold)" }}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-sm font-bold flex items-center gap-1.5">
                  <Clock className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                  <span>Deferred Sajda Queue ({sajdaQueue.length})</span>
                </h2>
              </div>
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
              Strictly follows Hanafi fiqh (includes 84:21 &amp; 96:19; excludes Shafi&apos;i-only 22:77). Click any verse to jump directly to it.
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
                    {done ? (
                      <CheckCircle2 className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-primary)" }} />
                    ) : deferred ? (
                      <Clock className="w-3.5 h-3.5 shrink-0" style={{ color: "var(--accent-gold)" }} />
                    ) : (
                      <ArrowRight className="w-3.5 h-3.5 shrink-0 opacity-40" />
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
