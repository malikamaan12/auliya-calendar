"use client";

import { assetUrl } from "@/lib/assets";

import React, { Suspense, useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import {
  ReactFlow,
  Background,
  Controls,
  Node,
  Edge,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import {
  Search,
  MapPin,
  BookOpen,
  GitBranch,
  Eye,
  Calendar,
  Compass,
  Plus,
  Volume2,
  VolumeX,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { HIJRI_MONTHS } from "@/lib/hijri";

function haversineKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  return Math.round(R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a)));
}

function AuliyaInner() {
  const searchParams = useSearchParams();
  const initialSaint = searchParams.get("saint") || "ghaus-e-azam";
  const initialTab = (searchParams.get("tab") as "tazkirah" | "shajrah" | "ziyarat" | "map" | "books") || "tazkirah";

  const { allAuliya, city, hijri, hilalOffset, setHilalOffset, familyBarsis, addFamilyBarsi } = useApp();

  const [query, setQuery] = useState("");
  const [silsilaFilter, setSilsilaFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState(initialSaint);
  const [activeTab, setActiveTab] = useState<"tazkirah" | "shajrah" | "ziyarat" | "map" | "books">(initialTab);

  // 360 Ziyarat interactive pan state
  const [panX, setPanX] = useState(50);
  const [zoom, setZoom] = useState(1.15);
  const [activeHotspot, setActiveHotspot] = useState<string | null>(null);
  const [ambientOn, setAmbientOn] = useState(false);

  // Family Barsi form
  const [barsiName, setBarsiName] = useState("");
  const [barsiRelation, setBarsiRelation] = useState("");
  const [barsiDay, setBarsiDay] = useState(11);
  const [barsiMonth, setBarsiMonth] = useState(4);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return allAuliya.filter((a) => {
      if (a.status !== "Published") return false;
      const matchesSilsila = silsilaFilter === "All" || a.silsila === silsilaFilter;
      if (!matchesSilsila) return false;
      if (!q) return true;
      return (
        a.name.toLowerCase().includes(q) ||
        a.urduName.includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.alqab.some((t) => t.toLowerCase().includes(q)) ||
        a.silsila.toLowerCase().includes(q)
      );
    });
  }, [allAuliya, query, silsilaFilter]);

  const saint = allAuliya.find((a) => a.id === selectedId) || filtered[0] || allAuliya[0];

  // React Flow Shajrah-e-Tayyibah Lineage Graph
  const { nodes, edges } = useMemo(() => {
    const rfNodes: Node[] = [
      {
        id: "prophet",
        position: { x: 260, y: 10 },
        data: { label: "Sayyiduna Muhammad ﷺ (Khatam-un-Nabiyyin)" },
        style: {
          background: "linear-gradient(135deg, #047857, #065F46)",
          color: "#FFFFFF",
          border: "1px solid #F59E0B",
          borderRadius: "14px",
          padding: "10px 16px",
          fontWeight: 700,
          fontSize: "12px",
          width: 260,
          textAlign: "center",
        },
      },
      {
        id: "ali",
        position: { x: 260, y: 100 },
        data: { label: "Imam Ali ibn Abi Talib (رضي الله عنه)" },
        style: {
          background: "#161920",
          color: "#F3F4F6",
          border: "1px solid #10B981",
          borderRadius: "12px",
          padding: "8px 14px",
          fontSize: "12px",
          width: 260,
          textAlign: "center",
        },
      },
    ];

    const positions: Record<string, { x: number; y: number }> = {
      "ghaus-e-azam": { x: 260, y: 200 },
      "data-ganj-bakhsh": { x: 20, y: 200 },
      "khwaja-moinuddin": { x: 80, y: 310 },
      "ala-hazrat": { x: 270, y: 310 },
      "mujaddid-alf-thani": { x: 470, y: 310 },
      "nizamuddin-auliya": { x: 80, y: 420 },
      "banda-nawaz": { x: 80, y: 520 },
    };

    allAuliya
      .filter((a) => a.status === "Published")
      .forEach((a, idx) => {
        const pos = positions[a.id] || { x: 470, y: 420 + idx * 45 };
        const isSel = a.id === saint.id;
        rfNodes.push({
          id: a.id,
          position: pos,
          data: { label: `${a.name} (${a.silsila})` },
          style: {
            background: isSel ? "#047857" : "#1D212B",
            color: "#F3F4F6",
            border: isSel ? "2px solid #F59E0B" : "1px solid rgba(255,255,255,0.16)",
            borderRadius: "12px",
            padding: "8px 12px",
            fontSize: "11px",
            fontWeight: isSel ? 700 : 500,
            width: 210,
            textAlign: "center",
            cursor: "pointer",
          },
        });
      });

    const rfEdges: Edge[] = [
      { id: "e-p-a", source: "prophet", target: "ali", animated: true, style: { stroke: "#F59E0B" } },
      {
        id: "e-a-g",
        source: "ali",
        target: "ghaus-e-azam",
        markerEnd: { type: MarkerType.ArrowClosed, color: "#10B981" },
        style: { stroke: "#10B981" },
      },
      {
        id: "e-a-d",
        source: "ali",
        target: "data-ganj-bakhsh",
        style: { stroke: "#00E5FF" },
      },
    ];

    allAuliya
      .filter((a) => a.murshidId && a.status === "Published")
      .forEach((a) => {
        rfEdges.push({
          id: `e-${a.murshidId}-${a.id}`,
          source: a.murshidId!,
          target: a.id,
          animated: a.id === saint.id,
          markerEnd: { type: MarkerType.ArrowClosed, color: "#10B981" },
          style: { stroke: a.id === saint.id ? "#F59E0B" : "#10B981" },
        });
      });

    return { nodes: rfNodes, edges: rfEdges };
  }, [allAuliya, saint.id]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
            Auliya Allah Encyclopedia, Shajrah &amp; 360° Ziyarat
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Face-free architectural Ziyarat, interactive spiritual lineage graphs, Malfuzat &amp; Hijri Urs calendar.
          </p>
        </div>
      </div>

      {/* Search & Silsila Filter Bar */}
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
            placeholder="Search by name, Alqab (Sultan-ul-Hind, Ala Hazrat), Urdu, or city..."
            className="w-full bg-transparent outline-none text-sm"
          />
        </div>
        <div className="flex flex-wrap gap-1.5">
          {["All", "Qadri", "Chishti", "Razavi", "Naqshbandi"].map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSilsilaFilter(s)}
              className="px-3 py-1.5 rounded-xl text-xs font-semibold border cursor-pointer"
              style={{
                borderColor: silsilaFilter === s ? "var(--accent-primary)" : "var(--border-hairline)",
                backgroundColor: silsilaFilter === s ? "var(--accent-soft)" : "transparent",
                color: silsilaFilter === s ? "var(--accent-primary)" : "var(--text-muted)",
              }}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Main Master-Detail Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
        {/* Left Directory List */}
        <aside className="lg:col-span-4 space-y-2.5">
          {filtered.map((item) => {
            const active = item.id === saint.id;
            const dist = haversineKm(city.lat, city.lng, item.lat, item.lng);
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => setSelectedId(item.id)}
                className="w-full text-start p-4 rounded-2xl border transition-all cursor-pointer"
                style={{
                  borderColor: active ? "var(--accent-primary)" : "var(--border-hairline)",
                  backgroundColor: active ? "var(--accent-soft)" : "var(--bg-surface-elevated)",
                }}
              >
                <div className="flex items-center justify-between gap-2">
                  <span
                    className="text-[11px] font-semibold px-2 py-0.5 rounded-full"
                    style={{ backgroundColor: "var(--gold-soft)", color: "var(--accent-gold)" }}
                  >
                    {item.silsila}
                  </span>
                  <span className="text-[11px] tabular-nums" style={{ color: "var(--text-muted)" }}>
                    {dist.toLocaleString()} km
                  </span>
                </div>
                <div className="font-bold text-sm mt-2">{item.name}</div>
                <div className="font-urdu text-sm mt-0.5 opacity-85" dir="rtl">
                  {item.urduName}
                </div>
                <div className="text-xs mt-1.5 flex items-center gap-1" style={{ color: "var(--text-muted)" }}>
                  <MapPin className="w-3 h-3" />
                  <span>
                    {item.city}, {item.country} • {item.ursLabel}
                  </span>
                </div>
              </button>
            );
          })}
        </aside>

        {/* Right Detail Workspace */}
        <section className="lg:col-span-8 space-y-4">
          {/* Sub-module tabs */}
          <div className="bento-card p-2 flex flex-wrap gap-1.5">
            {[
              { id: "tazkirah", label: "Tazkirah & Karamat", icon: BookOpen },
              { id: "shajrah", label: "Shajrah-e-Tayyibah Graph", icon: GitBranch },
              { id: "ziyarat", label: "360° Virtual Ziyarat", icon: Eye },
              { id: "books", label: "Malfuzat & Books", icon: BookOpen },
              { id: "map", label: "Mazar Map & Hijri Log", icon: Compass },
            ].map((tab) => {
              const Icon = tab.icon;
              const isAct = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id as typeof activeTab)}
                  className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold cursor-pointer"
                  style={{
                    backgroundColor: isAct ? "var(--accent-primary)" : "transparent",
                    color: isAct ? "#FFFFFF" : "var(--text-muted)",
                  }}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {activeTab === "tazkirah" && (
            <div className="bento-card overflow-hidden">
              <div className="h-52 relative">
                <img
                  src={saint.shrineImage}
                  alt={`${saint.city} Shrine Architecture`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent flex items-end p-6">
                  <div className="text-white">
                    <div className="text-xs font-semibold text-amber-300">{saint.ursLabel}</div>
                    <h2 className="text-2xl font-bold mt-1">{saint.name}</h2>
                    <div className="text-xs opacity-85 mt-1">
                      Wiladat: {saint.wiladatHijri} • Wisal: {saint.wisalHijri} • {saint.city}
                    </div>
                  </div>
                </div>
              </div>
              <div className="p-6 space-y-5">
                <div className="flex flex-wrap gap-1.5">
                  {saint.alqab.map((alq) => (
                    <span
                      key={alq}
                      className="text-xs px-2.5 py-1 rounded-full border font-medium"
                      style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                    >
                      {alq}
                    </span>
                  ))}
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-1.5" style={{ color: "var(--accent-primary)" }}>
                    Sacred Biography (Tazkirah)
                  </h3>
                  <p className="text-sm leading-relaxed" style={{ color: "var(--text-primary)" }}>
                    {saint.fullTazkirah}
                  </p>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "var(--accent-gold)" }}>
                    Verified Karamat &amp; Spiritual Legacy
                  </h3>
                  <ul className="space-y-2 text-sm" style={{ color: "var(--text-muted)" }}>
                    {saint.karamat.map((k, i) => (
                      <li key={i} className="flex gap-2">
                        <span style={{ color: "var(--accent-gold)" }}>•</span>
                        <span>{k}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-sm font-bold uppercase tracking-wider mb-2" style={{ color: "var(--accent-secondary)" }}>
                    Prominent Khulafa (Successors)
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {saint.khulafaNames.map((k) => (
                      <span
                        key={k}
                        className="text-xs px-3 py-1.5 rounded-xl border"
                        style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                      >
                        {k}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === "shajrah" && (
            <div className="bento-card p-5 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-base font-bold">Interactive Shajrah-e-Tayyibah (Bay&apos;at Lineage)</h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Tap any Shaykh node to inspect their Tazkirah. Powered by React Flow.
                  </p>
                </div>
              </div>
              <div className="h-[460px] rounded-2xl border overflow-hidden" style={{ borderColor: "var(--border-hairline)" }}>
                <ReactFlow
                  nodes={nodes}
                  edges={edges}
                  fitView
                  onNodeClick={(_, node) => {
                    if (allAuliya.some((a) => a.id === node.id)) {
                      setSelectedId(node.id);
                    }
                  }}
                >
                  <Background />
                  <Controls />
                </ReactFlow>
              </div>
            </div>
          )}

          {activeTab === "ziyarat" && (
            <div className="bento-card p-5 space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <h2 className="text-base font-bold">360° Interactive Virtual Ziyarat — {saint.city}</h2>
                  <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                    Drag slider or tap architectural hotspots. Strictly face-free architectural view.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAmbientOn(!ambientOn)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-semibold cursor-pointer"
                  style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                >
                  {ambientOn ? <Volume2 className="w-3.5 h-3.5 text-emerald-400" /> : <VolumeX className="w-3.5 h-3.5" />}
                  <span>{ambientOn ? "Shrine Ambience On" : "Ambience Muted"}</span>
                </button>
              </div>

              {/* Panoramic Viewport */}
              <div
                className="relative h-80 rounded-2xl overflow-hidden border select-none"
                style={{ borderColor: "var(--border-hairline)" }}
              >
                <img
                  src={saint.shrineImage}
                  alt={`${saint.city} 360 Panorama`}
                  className="w-full h-full object-cover transition-transform duration-200"
                  style={{
                    objectPosition: `${panX}% 50%`,
                    transform: `scale(${zoom})`,
                  }}
                />
                {saint.hotspots.map((hs) => (
                  <button
                    key={hs.id}
                    type="button"
                    onClick={() => setActiveHotspot(activeHotspot === hs.id ? null : hs.id)}
                    style={{ left: `${hs.xPct}%`, top: `${hs.yPct}%` }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 w-7 h-7 rounded-full bg-amber-400 text-black font-bold text-xs shadow-lg ring-4 ring-amber-400/30 cursor-pointer flex items-center justify-center"
                  >
                    +
                  </button>
                ))}
                <div className="absolute bottom-3 start-3 end-3 flex items-center gap-3 bg-black/65 backdrop-blur-md px-3 py-2 rounded-xl text-white text-xs">
                  <span>Pan 360°</span>
                  <input
                    type="range"
                    min={0}
                    max={100}
                    value={panX}
                    onChange={(e) => setPanX(Number(e.target.value))}
                    className="flex-1 accent-emerald-400"
                  />
                  <span>Zoom</span>
                  <input
                    type="range"
                    min={1}
                    max={1.8}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-24 accent-amber-400"
                  />
                </div>
              </div>

              {activeHotspot && (
                <div className="p-4 rounded-xl border" style={{ borderColor: "var(--accent-gold)", backgroundColor: "var(--gold-soft)" }}>
                  {(() => {
                    const hs = saint.hotspots.find((h) => h.id === activeHotspot);
                    if (!hs) return null;
                    return (
                      <div>
                        <div className="font-bold text-sm">{hs.title}</div>
                        <p className="text-xs mt-1">{hs.description}</p>
                        <div className="text-xs font-semibold mt-2" style={{ color: "var(--accent-gold)" }}>
                          Adab-e-Ziyarat: {hs.adabNote}
                        </div>
                      </div>
                    );
                  })()}
                </div>
              )}

              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: "var(--accent-primary)" }}>
                  Adab-e-Ziyarat (Visitation Etiquette)
                </h3>
                <ul className="space-y-1.5 text-xs" style={{ color: "var(--text-muted)" }}>
                  {saint.adabZiyarat.map((adab, i) => (
                    <li key={i}>• {adab}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          {activeTab === "books" && (
            <div className="bento-card p-6 space-y-4">
              <h2 className="text-base font-bold">Authored Treatises &amp; Malfuzat — {saint.name}</h2>
              <div className="space-y-3">
                {saint.books.map((book) => (
                  <div
                    key={book.title}
                    className="p-4 rounded-2xl border space-y-2"
                    style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <div className="font-bold text-sm">{book.title}</div>
                      <span className="font-urdu text-sm" dir="rtl">
                        {book.arabicOrUrduTitle}
                      </span>
                    </div>
                    <div className="text-[11px] font-semibold" style={{ color: "var(--accent-primary)" }}>
                      {book.genre}
                    </div>
                    <p className="text-xs" style={{ color: "var(--text-muted)" }}>
                      {book.summary}
                    </p>
                    <blockquote className="text-xs italic border-s-2 ps-3 py-1" style={{ borderColor: "var(--accent-gold)" }}>
                      &ldquo;{book.excerpt}&rdquo;
                    </blockquote>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === "map" && (
            <div className="space-y-4">
              {/* Interactive Global Shrine Pin Map */}
              <div className="bento-card p-5 space-y-3">
                <h2 className="text-base font-bold">Global Mazar Coordinates &amp; Distance from {city.name}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {allAuliya
                    .filter((a) => a.status === "Published")
                    .map((a) => (
                      <div
                        key={a.id}
                        className="p-3.5 rounded-xl border flex items-center justify-between gap-3"
                        style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                      >
                        <div>
                          <div className="font-bold text-xs">{a.city}, {a.country}</div>
                          <div className="text-[11px]" style={{ color: "var(--text-muted)" }}>{a.name}</div>
                          <div className="text-[10px] tabular-nums opacity-70 mt-0.5">
                            {a.lat.toFixed(4)}° N, {a.lng.toFixed(4)}° E
                          </div>
                        </div>
                        <div className="text-end">
                          <div className="text-xs font-bold tabular-nums" style={{ color: "var(--accent-secondary)" }}>
                            {haversineKm(city.lat, city.lng, a.lat, a.lng).toLocaleString()} km
                          </div>
                          <a
                            href={`https://www.openstreetmap.org/?mlat=${a.lat}&mlon=${a.lng}#map=15/${a.lat}/${a.lng}`}
                            target="_blank"
                            rel="noreferrer"
                            className="text-[10px] underline"
                          >
                            Directions
                          </a>
                        </div>
                      </div>
                    ))}
                </div>
              </div>

              {/* Hijri Calendar & Family Barsi / Fatiha Log */}
              <div className="bento-card p-5 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4" style={{ color: "var(--accent-gold)" }} />
                    <h3 className="text-base font-bold">
                      Hijri Calendar ({hijri.formatted}) &amp; Family Barsi / Fatiha Log
                    </h3>
                  </div>
                  <div className="flex items-center gap-1 text-xs">
                    <span>Hilal:</span>
                    {[-2, -1, 0, 1, 2].map((o) => (
                      <button
                        key={o}
                        type="button"
                        onClick={() => setHilalOffset(o)}
                        className="px-2 py-0.5 rounded-lg border text-[11px] cursor-pointer"
                        style={{
                          borderColor: hilalOffset === o ? "var(--accent-gold)" : "var(--border-hairline)",
                          backgroundColor: hilalOffset === o ? "var(--gold-soft)" : "transparent",
                        }}
                      >
                        {o > 0 ? `+${o}` : o}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-2">
                  {familyBarsis.map((b) => (
                    <div
                      key={b.id}
                      className="p-3 rounded-xl border flex items-center justify-between text-xs"
                      style={{ borderColor: "var(--border-hairline)", backgroundColor: "var(--bg-muted)" }}
                    >
                      <div>
                        <strong>{b.personName}</strong> ({b.relation})
                      </div>
                      <span style={{ color: "var(--accent-gold)" }}>
                        {b.hijriDay} {HIJRI_MONTHS[b.hijriMonth - 1]}
                      </span>
                    </div>
                  ))}
                </div>

                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (!barsiName.trim()) return;
                    addFamilyBarsi({
                      personName: barsiName.trim(),
                      relation: barsiRelation.trim() || "Family Elder",
                      hijriMonth: barsiMonth,
                      hijriDay: barsiDay,
                    });
                    setBarsiName("");
                    setBarsiRelation("");
                  }}
                  className="grid grid-cols-1 sm:grid-cols-4 gap-2 pt-2 border-t"
                  style={{ borderColor: "var(--border-hairline)" }}
                >
                  <input
                    type="text"
                    placeholder="Marhum / Elder Name"
                    value={barsiName}
                    onChange={(e) => setBarsiName(e.target.value)}
                    className="px-3 py-2 rounded-xl border text-xs bg-transparent outline-none"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                  <input
                    type="text"
                    placeholder="Relation"
                    value={barsiRelation}
                    onChange={(e) => setBarsiRelation(e.target.value)}
                    className="px-3 py-2 rounded-xl border text-xs bg-transparent outline-none"
                    style={{ borderColor: "var(--border-hairline)" }}
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={barsiDay}
                      onChange={(e) => setBarsiDay(Number(e.target.value))}
                      className="w-16 px-2 py-2 rounded-xl border text-xs bg-transparent outline-none"
                      style={{ borderColor: "var(--border-hairline)" }}
                    />
                    <select
                      value={barsiMonth}
                      onChange={(e) => setBarsiMonth(Number(e.target.value))}
                      className="flex-1 px-2 py-2 rounded-xl border text-xs bg-transparent outline-none"
                      style={{ borderColor: "var(--border-hairline)" }}
                    >
                      {HIJRI_MONTHS.map((m, idx) => (
                        <option key={m} value={idx + 1} className="text-black">
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    type="submit"
                    className="px-3 py-2 rounded-xl text-xs font-semibold text-white inline-flex items-center justify-center gap-1 cursor-pointer"
                    style={{ backgroundColor: "var(--accent-primary)" }}
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add Barsi</span>
                  </button>
                </form>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default function AuliyaPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm">Loading Auliya Encyclopedia...</div>}>
      <AuliyaInner />
    </Suspense>
  );
}
