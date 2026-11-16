"use client";

import React, { useState } from "react";
import { z } from "zod";
import { ShieldCheck, KeyRound, Plus, CheckCircle2, FileText } from "lucide-react";
import { useApp } from "@/lib/store";
import { AuliyaProfile } from "@/data/auliya";
import { HIJRI_MONTHS } from "@/lib/hijri";

const AuliyaSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  urduName: z.string().min(2, "Urdu name is required"),
  city: z.string().min(2, "City is required"),
  country: z.string().min(2, "Country is required"),
  silsila: z.enum(["Qadri", "Chishti", "Naqshbandi", "Suhrawardi", "Razavi"]),
  ursMonth: z.number().min(1).max(12),
  ursDay: z.number().min(1).max(30),
  shortSummary: z.string().min(10, "Summary must be at least 10 characters"),
});

export default function AdminPage() {
  const { allAuliya, auditLogs, upsertCustomAuliya } = useApp();

  const [fidoVerified, setFidoVerified] = useState(false);
  const [name, setName] = useState("");
  const [urduName, setUrduName] = useState("");
  const [city, setCity] = useState("");
  const [country, setCountry] = useState("India");
  const [silsila, setSilsila] = useState<AuliyaProfile["silsila"]>("Qadri");
  const [ursMonth, setUrsMonth] = useState(4);
  const [ursDay, setUrsDay] = useState(11);
  const [shortSummary, setShortSummary] = useState("");
  const [status, setStatus] = useState<AuliyaProfile["status"]>("Draft");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handlePublish = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (status === "Published" && !fidoVerified) {
      setErrorMsg("Scholar review confirmation is required before publishing.");
      return;
    }

    const parsed = AuliyaSchema.safeParse({
      name: name.trim(),
      urduName: urduName.trim(),
      city: city.trim(),
      country: country.trim(),
      silsila,
      ursMonth,
      ursDay,
      shortSummary: shortSummary.trim(),
    });

    if (!parsed.success) {
      setErrorMsg(parsed.error.issues[0]?.message || "Please check all fields.");
      return;
    }

    const slug = parsed.data.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
    const newProfile: AuliyaProfile = {
      id: slug,
      slug,
      name: parsed.data.name,
      urduName: parsed.data.urduName,
      arabicName: parsed.data.urduName,
      alqab: [parsed.data.silsila],
      silsila: parsed.data.silsila,
      wiladatHijri: "Verified Archive",
      wisalHijri: `${parsed.data.ursDay} ${HIJRI_MONTHS[parsed.data.ursMonth - 1]}`,
      ursMonth: parsed.data.ursMonth,
      ursDay: parsed.data.ursDay,
      ursLabel: `Urs (${parsed.data.ursDay} ${HIJRI_MONTHS[parsed.data.ursMonth - 1]})`,
      city: parsed.data.city,
      country: parsed.data.country,
      lat: 27.1767,
      lng: 78.0081,
      shrineImage: "/images/shrines/bareilly.jpg",
      shortSummary: parsed.data.shortSummary,
      fullTazkirah: parsed.data.shortSummary,
      karamat: ["Added via Community Curator Studio."],
      adabZiyarat: ["Enter with Wudu and recite Salawat upon the Prophet ﷺ."],
      hotspots: [],
      books: [],
      murshidId: "ghaus-e-azam",
      khulafaNames: [],
      status,
    };

    upsertCustomAuliya(
      newProfile,
      fidoVerified ? "Scholar Reviewer" : "Community Contributor"
    );
    setSuccessMsg(`Saved "${newProfile.name}" (${status})`);
    setName("");
    setUrduName("");
    setCity("");
    setShortSummary("");
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: "var(--accent-primary)" }}>
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Community &amp; Scholarly Curator</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Add Auliya Profile &amp; Urs Record
          </h1>
        </div>

        <button
          type="button"
          onClick={() => setFidoVerified(!fidoVerified)}
          className="px-4 py-2 rounded-full border text-xs font-semibold inline-flex items-center gap-2 cursor-pointer"
          style={{
            borderColor: fidoVerified ? "var(--accent-primary)" : "var(--accent-gold)",
            backgroundColor: fidoVerified ? "var(--accent-soft)" : "var(--gold-soft)",
            color: fidoVerified ? "var(--accent-primary)" : "var(--accent-gold)",
          }}
        >
          <KeyRound className="w-4 h-4" />
          <span>{fidoVerified ? "Scholar Review Confirmed" : "Confirm Scholar Review"}</span>
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Form */}
        <section className="lg:col-span-7 bento-card p-6 space-y-4">
          <h2 className="text-base font-bold">New Saint Biography &amp; Urs Date</h2>
          <form onSubmit={handlePublish} className="space-y-3.5 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold mb-1">Saint Name (English)</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., Sarkar Waris Pak"
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Urdu / Arabic Name</label>
                <input
                  type="text"
                  dir="rtl"
                  value={urduName}
                  onChange={(e) => setUrduName(e.target.value)}
                  placeholder="سرکار وارث پاک"
                  className="w-full px-3 py-2 rounded-xl border bg-transparent font-urdu"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Shrine City</label>
                <input
                  type="text"
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  placeholder="Dewa Sharif"
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Country</label>
                <input
                  type="text"
                  value={country}
                  onChange={(e) => setCountry(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Spiritual Order (Silsila)</label>
                <select
                  value={silsila}
                  onChange={(e) => setSilsila(e.target.value as AuliyaProfile["silsila"])}
                  className="ui-select w-full px-3 py-2 rounded-xl border bg-transparent"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  {["Qadri", "Chishti", "Razavi", "Naqshbandi", "Suhrawardi"].map((s) => (
                    <option key={s} value={s} className="text-black">
                      {s}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Annual Urs Date (Hijri)</label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    min={1}
                    max={30}
                    value={ursDay}
                    onChange={(e) => setUrsDay(Number(e.target.value))}
                    className="w-16 px-2 py-2 rounded-xl border bg-transparent text-center"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                  <select
                    value={ursMonth}
                    onChange={(e) => setUrsMonth(Number(e.target.value))}
                    className="ui-select flex-1 px-2.5 py-2 rounded-xl border bg-transparent"
                    style={{ borderColor: "var(--border-hairline)" }}
                  >
                    {HIJRI_MONTHS.map((m, idx) => (
                      <option key={m} value={idx + 1} className="text-black">
                        {m}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <div>
              <label className="block font-semibold mb-1">Biographical Summary (Tazkirah)</label>
              <textarea
                rows={3}
                value={shortSummary}
                onChange={(e) => setShortSummary(e.target.value)}
                placeholder="Write a brief biography and spiritual legacy…"
                className="w-full px-3 py-2 rounded-xl border bg-transparent"
                style={{ borderColor: "var(--border-hairline)" }}
              />
            </div>

            <div>
              <label className="block font-semibold mb-1">Publication Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as AuliyaProfile["status"])}
                className="ui-select w-full px-3 py-2 rounded-xl border bg-transparent font-semibold"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <option value="Draft" className="text-black">Draft</option>
                <option value="Scholarly Verification" className="text-black">Pending Scholarly Review</option>
                <option value="Published" className="text-black">Published (Visible in Directory)</option>
              </select>
            </div>

            {errorMsg && <div className="p-2.5 rounded-xl bg-red-500/15 text-red-300">{errorMsg}</div>}
            {successMsg && (
              <div className="p-2.5 rounded-xl flex items-center gap-1.5" style={{ backgroundColor: "var(--accent-soft)", color: "var(--accent-primary)" }}>
                <CheckCircle2 className="w-4 h-4" />
                <span>{successMsg}</span>
              </div>
            )}

            <button
              type="submit"
              className="btn-primary px-5 py-2.5 rounded-full font-semibold inline-flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Save Profile</span>
            </button>
          </form>
        </section>

        {/* Right: Activity History */}
        <aside className="lg:col-span-5 space-y-4">
          <div className="bento-card p-5 space-y-3">
            <div className="flex items-center gap-2 font-bold text-sm">
              <FileText className="w-4 h-4" style={{ color: "var(--accent-primary)" }} />
              <span>Recent Changes</span>
            </div>
            <div className="space-y-2 max-h-60 overflow-y-auto text-xs">
              {auditLogs.map((log) => (
                <div
                  key={log.id}
                  className="p-3 rounded-xl border"
                  style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                >
                  <div className="flex items-center justify-between font-semibold">
                    <span style={{ color: "var(--accent-primary)" }}>{log.action}</span>
                    <span className="text-[10px] opacity-60">{log.timestamp.slice(0, 10)}</span>
                  </div>
                  <div className="mt-0.5">{log.target}</div>
                  <div className="text-[10px] mt-0.5" style={{ color: "var(--text-muted)" }}>
                    By {log.actor}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bento-card p-5 space-y-2 text-xs">
            <div className="font-bold text-sm">Directory Total: {allAuliya.length} Saints</div>
            <p style={{ color: "var(--text-muted)" }}>
              Profiles you add here are saved on your device and appear immediately in the Auliya Directory and Urs calendar.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
