"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Scale, Search, BookOpen, CheckCircle2, Plus, ArrowRight } from "lucide-react";
import {
  BAHAR_E_SHARIAT_MASAIL,
  HADITH_COLLECTION,
  SUNNAH_PLAYBOOKS,
} from "@/data/fiqh-hadith";
import { useApp } from "@/lib/store";

export default function FiqhPage() {
  const { sunnahChecks, toggleSunnah } = useApp();
  const [query, setQuery] = useState("");
  const [category, setCategory] = useState<string>("All");

  const filteredMasail = BAHAR_E_SHARIAT_MASAIL.filter((m) => {
    const catOk = category === "All" || m.category === category;
    if (!catOk) return false;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      m.title.toLowerCase().includes(q) ||
      m.summary.toLowerCase().includes(q) ||
      m.source.toLowerCase().includes(q)
    );
  });

  const filteredHadith = HADITH_COLLECTION.filter((h) => {
    const q = query.trim().toLowerCase();
    if (!q) return true;
    return (
      h.english.toLowerCase().includes(q) ||
      h.collection.toLowerCase().includes(q) ||
      h.sunniNote.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      <div>
        <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-primary)" }}>
          <Scale className="w-3.5 h-3.5" />
          <span>Bahar-e-Shariat • Fatawa Razawiyya • Graded Hadith</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Hadith, Sunnah &amp; Hanafi Fiqh (Masail) Library
        </h1>
      </div>

      {/* Search & Filter */}
      <div className="bento-card p-4 flex flex-col sm:flex-row gap-3">
        <div
          className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl border"
          style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
        >
          <Search className="w-4 h-4 opacity-60" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search Wudu, Asr Mithlayn, Sajda-e-Sahw, Zakat, Bukhari..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", "Wudu & Ghusl", "Salah & Jamaat", "Sajda-e-Sahw", "Roza & Zakat"].map((cat) => (
            <button
              key={cat}
              type="button"
              onClick={() => setCategory(cat)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
              style={{
                borderColor: category === cat ? "var(--accent-primary)" : "var(--border-hairline)",
                backgroundColor: category === cat ? "var(--accent-soft)" : "transparent",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Bahar-e-Shariat Fiqh Decision Cards */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Bahar-e-Shariat Fiqh Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredMasail.map((m) => (
            <article key={m.id} className="bento-card p-5 space-y-3 flex flex-col justify-between">
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="px-2.5 py-0.5 rounded-full font-semibold" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}>
                    {m.category}
                  </span>
                  <span style={{ color: "var(--text-muted)" }}>{m.source}</span>
                </div>
                <h3 className="text-base font-bold">{m.title}</h3>
                <p className="text-xs leading-relaxed" style={{ color: "var(--text-muted)" }}>
                  {m.summary}
                </p>
                <ul className="space-y-1.5 text-xs pt-1">
                  {m.steps.map((st, idx) => (
                    <li key={idx} className="p-2 rounded-lg" style={{ backgroundColor: "var(--bg-muted)" }}>
                      {st}
                    </li>
                  ))}
                </ul>
              </div>
              <Link
                href={m.deepLink}
                className="text-xs font-semibold inline-flex items-center gap-1 pt-2"
                style={{ color: "var(--accent-secondary)" }}
              >
                <span>Open Interactive Tool</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Graded Hadith with Sunni-Maturidi Commentary */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Graded Hadith &amp; Sunni Commentary</h2>
        <div className="space-y-3">
          {filteredHadith.map((h) => (
            <article key={h.id} className="bento-card p-5 space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold inline-flex items-center gap-1.5" style={{ color: "var(--accent-gold)" }}>
                  <BookOpen className="w-3.5 h-3.5" />
                  {h.collection} ({h.refNumber})
                </span>
              </div>
              <p dir="rtl" className="font-arabic text-xl text-right leading-loose">
                {h.arabic}
              </p>
              <p className="text-sm leading-relaxed">{h.english}</p>
              <p dir="rtl" className="font-urdu text-right text-base opacity-90">
                {h.urdu}
              </p>
              <div className="p-3 rounded-xl text-xs" style={{ backgroundColor: "var(--bg-muted)", color: "var(--text-muted)" }}>
                {h.sunniNote}
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* Daily Masnoon Sunnah Playbooks */}
      <section className="space-y-3">
        <h2 className="text-lg font-bold">Masnoon Sunnah &amp; Dua Playbooks</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {SUNNAH_PLAYBOOKS.map((pb) => {
            const added = Boolean(sunnahChecks[pb.id]);
            return (
              <div key={pb.id} className="bento-card p-5 space-y-3 flex flex-col justify-between">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm">{pb.title}</h3>
                  <p dir="rtl" className="font-arabic text-lg text-right">
                    {pb.arabicDua}
                  </p>
                  <p className="text-[11px] italic" style={{ color: "var(--accent-secondary)" }}>
                    {pb.transliteration}
                  </p>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    {pb.meaning}
                  </p>
                  <ul className="space-y-1 text-xs pt-1">
                    {pb.steps.map((s, idx) => (
                      <li key={idx}>• {s}</li>
                    ))}
                  </ul>
                </div>

                <button
                  type="button"
                  onClick={() => toggleSunnah(pb.id)}
                  className="w-full py-2 rounded-xl text-xs font-semibold inline-flex items-center justify-center gap-1.5 cursor-pointer border"
                  style={{
                    borderColor: added ? "var(--accent-primary)" : "var(--border-hairline)",
                    backgroundColor: added ? "var(--accent-soft)" : "var(--bg-muted)",
                    color: added ? "var(--accent-primary)" : "var(--text-primary)",
                  }}
                >
                  {added ? <CheckCircle2 className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                  <span>{added ? "Completed in Habit Tracker" : "Log in Habit Tracker"}</span>
                </button>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
