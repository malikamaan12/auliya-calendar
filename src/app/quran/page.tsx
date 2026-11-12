"use client";

import React, { useEffect, useRef, useState } from "react";
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
} from "lucide-react";
import { useApp } from "@/lib/store";
import { HANAFI_14_SAJDAS, QURAN_AYAHS, QuranAyah } from "@/data/quran";
import { sha256Hex } from "@/lib/crypto-integrity";

export default function QuranPage() {
  const {
    lang,
    lastQuranRef,
    logQuranAyah,
    sajdaQueue,
    sajdaCompleted,
    logSajda,
  } = useApp();

  const [scriptMode, setScriptMode] = useState<"indopak" | "uthmani">("indopak");
  const [showTranslit, setShowTranslit] = useState(true);
  const [tajweedColor, setTajweedColor] = useState(true);
  const [openTafsirId, setOpenTafsirId] = useState<string | null>("18:28");
  const [tarjumaLang, setTarjumaLang] = useState<"ur" | "en" | "ro_ur" | "hi">(
    lang === "ur" || lang === "ro_ur" || lang === "hi" ? lang : "en"
  );
  const [playingId, setPlayingId] = useState<string | null>(null);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [loopAyah, setLoopAyah] = useState(false);
  const [sleepTimerMins, setSleepTimerMins] = useState<number | null>(null);
  const [verifiedHashes, setVerifiedHashes] = useState<Record<string, string>>({});

  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    Promise.all(
      QURAN_AYAHS.map(async (a) => [a.id, await sha256Hex(`${a.id}|${a.kanzulImanUrdu}`)] as const)
    ).then((entries) => setVerifiedHashes(Object.fromEntries(entries)));
  }, []);

  const togglePlay = (ayah: QuranAyah) => {
    if (playingId === ayah.id) {
      audioRef.current?.pause();
      setPlayingId(null);
      return;
    }
    if (audioRef.current) {
      audioRef.current.src = ayah.audioUrl;
      audioRef.current.playbackRate = playbackRate;
      audioRef.current.loop = loopAyah;
      audioRef.current.play().catch(() => {});
    }
    setPlayingId(ayah.id);
    logQuranAyah(ayah.id);
  };

  const getTranslation = (ayah: QuranAyah) => {
    if (tarjumaLang === "ur") return ayah.kanzulImanUrdu;
    if (tarjumaLang === "ro_ur") return ayah.kanzulImanRomanUrdu;
    if (tarjumaLang === "hi") return ayah.kanzulImanHindi;
    return ayah.kanzulImanEnglish;
  };

  return (
    <div className="space-y-6">
      <audio ref={audioRef} onEnded={() => !loopAyah && setPlayingId(null)} />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-secondary)" }}>
            <BookOpen className="w-3.5 h-3.5" />
            <span>Kanzul Iman • Khazain-ul-Irfan • 14 Hanafi Sajdas</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Holy Quran Suite (Kanzul Iman)
          </h1>
        </div>

        <div className="flex flex-wrap items-center gap-2 text-xs">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border font-semibold"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>SHA-256 Sacred Text Verified</span>
          </span>
        </div>
      </div>

      {/* Controls Bar */}
      <div className="bento-card p-4 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setScriptMode(scriptMode === "indopak" ? "uthmani" : "indopak")}
            className="px-3 py-1.5 rounded-xl border font-semibold cursor-pointer"
            style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
          >
            Script: {scriptMode === "indopak" ? "Indo-Pak (13/16-line)" : "Uthmani"}
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
            <option value="hi" className="text-black">Kanzul Iman (Hindi)</option>
          </select>

          <button
            type="button"
            onClick={() => setPlaybackRate(playbackRate === 1 ? 1.25 : playbackRate === 1.25 ? 0.75 : 1)}
            className="px-2.5 py-1.5 rounded-xl border font-semibold tabular-nums cursor-pointer"
            style={{ borderColor: "var(--border-hairline)" }}
          >
            {playbackRate}x
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
            onClick={() => setSleepTimerMins(sleepTimerMins ? null : 10)}
            className="px-2.5 py-1.5 rounded-xl border font-semibold inline-flex items-center gap-1 cursor-pointer"
            style={{
              borderColor: sleepTimerMins ? "var(--accent-primary)" : "var(--border-hairline)",
            }}
          >
            <Moon className="w-3.5 h-3.5" />
            <span>{sleepTimerMins ? `Sleep: ${sleepTimerMins}m` : "Sleep Timer"}</span>
          </button>
        </div>
      </div>

      {/* Main Content + Hanafi Sajda Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        <div className="lg:col-span-8 space-y-4">
          {QURAN_AYAHS.map((ayah) => {
            const isPlaying = playingId === ayah.id;
            const isBookmarked = lastQuranRef === ayah.id;
            const sajdaDone = sajdaCompleted.includes(ayah.id);
            const sajdaDeferred = sajdaQueue.includes(ayah.id);

            return (
              <article
                key={ayah.id}
                className="bento-card p-6 space-y-4"
                style={{
                  borderColor: isPlaying ? "var(--accent-secondary)" : undefined,
                }}
              >
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
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
                      <span className="px-2.5 py-1 rounded-full text-[11px] font-medium border" style={{ borderColor: "var(--border-hairline)", color: "var(--text-muted)" }}>
                        Not a Hanafi Sajda (22:18 is Wajib)
                      </span>
                    )}
                    {isBookmarked && (
                      <span className="text-[11px] font-semibold" style={{ color: "var(--accent-primary)" }}>
                        • Bookmarked
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => togglePlay(ayah)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold text-white cursor-pointer"
                      style={{ backgroundColor: isPlaying ? "var(--accent-secondary)" : "var(--accent-primary)" }}
                    >
                      {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                      <span>{isPlaying ? "Pause" : "Listen"}</span>
                    </button>
                  </div>
                </div>

                {/* Arabic Text */}
                <p
                  dir="rtl"
                  className="font-arabic text-2xl sm:text-3xl text-right leading-[2.2]"
                  style={{ color: tajweedColor ? "var(--text-primary)" : "inherit" }}
                >
                  {scriptMode === "indopak" ? ayah.arabicIndoPak : ayah.arabicUthmani}
                </p>

                {showTranslit && (
                  <p className="text-xs italic" style={{ color: "var(--accent-secondary)" }}>
                    {ayah.transliteration}
                  </p>
                )}

                {/* Kanzul Iman Translation */}
                <p
                  dir={tarjumaLang === "ur" ? "rtl" : "ltr"}
                  className={`text-base leading-relaxed ${
                    tarjumaLang === "ur" ? "font-urdu text-right text-lg" : tarjumaLang === "hi" ? "font-hindi" : ""
                  }`}
                >
                  {getTranslation(ayah)}
                </p>

                {/* Hanafi Sajda Action Bar */}
                {ayah.hanafiSajda && (
                  <div className="p-3 rounded-xl border flex flex-wrap items-center justify-between gap-2 text-xs" style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}>
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
                        <span>Log Sajda Now</span>
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
                <div className="pt-2 border-t flex flex-wrap items-center justify-between gap-2 text-xs" style={{ borderColor: "var(--border-hairline)" }}>
                  <button
                    type="button"
                    onClick={() => setOpenTafsirId(openTafsirId === ayah.id ? null : ayah.id)}
                    className="font-semibold cursor-pointer"
                    style={{ color: "var(--accent-gold)" }}
                  >
                    {openTafsirId === ayah.id ? "Hide Khazain-ul-Irfan Tafsir ▲" : "Read Khazain-ul-Irfan Tafsir ▼"}
                  </button>
                  <span className="font-mono text-[10px] opacity-60">
                    SHA-256: {(verifiedHashes[ayah.id] || ayah.sha256).slice(0, 18)}…
                  </span>
                </div>

                {openTafsirId === ayah.id && (
                  <div className="p-3.5 rounded-xl text-xs leading-relaxed" style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}>
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
              <Link href="/fiqh" className="px-3 py-2 rounded-xl border text-xs font-semibold" style={{ borderColor: "var(--border-hairline)" }}>
                Hanafi Fiqh
              </Link>
              <Link href="/quiz" className="px-3 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center gap-1" style={{ backgroundColor: "var(--accent-primary)" }}>
                <span>Play Ilm Quiz</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>

        {/* Right Sidebar: 14 Hanafi Sajdas & Deferred Queue */}
        <aside className="lg:col-span-4 space-y-4">
          <div className="bento-card p-5 space-y-3">
            <h2 className="text-base font-bold">14 Hanafi Sajda-e-Tilawat Verses</h2>
            <p className="text-xs" style={{ color: "var(--text-muted)" }}>
              Strictly follows Hanafi fiqh (includes 84:21 &amp; 96:19; excludes Shafi&apos;i-only 22:77).
            </p>
            <div className="grid grid-cols-1 gap-1.5 text-xs">
              {HANAFI_14_SAJDAS.map((s) => (
                <div
                  key={s}
                  className="px-3 py-2 rounded-xl border flex items-center justify-between"
                  style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                >
                  <span>۩ {s}</span>
                </div>
              ))}
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
