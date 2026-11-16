"use client";

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react";
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
  Image as ImageIcon,
  Film,
  Sparkles,
  Play,
  Pause,
  RotateCcw,
  Maximize2,
  X,
  Copy,
  Check,
  ExternalLink,
  Navigation,
  Clock,
  Landmark,
  ScrollText,
  ChevronLeft,
  ChevronRight,
  Sun,
  Sunset,
  Moon,
  Award,
} from "lucide-react";
import { useApp } from "@/lib/store";
import { HIJRI_MONTHS } from "@/lib/hijri";
import {
  resolvePublicAssetUrl,
  ShrineGalleryItem,
  AuthoredBook,
} from "@/data/auliya";

type AuliyaTab =
  | "tazkirah"
  | "gallery"
  | "ziyarat"
  | "video"
  | "shajrah"
  | "books"
  | "map";

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

function initialBearingDeg(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const phi1 = (lat1 * Math.PI) / 180;
  const phi2 = (lat2 * Math.PI) / 180;
  const dLambda = ((lon2 - lon1) * Math.PI) / 180;
  const y = Math.sin(dLambda) * Math.cos(phi2);
  const x =
    Math.cos(phi1) * Math.sin(phi2) -
    Math.sin(phi1) * Math.cos(phi2) * Math.cos(dLambda);
  const theta = (Math.atan2(y, x) * 180) / Math.PI;
  return Math.round((theta + 360) % 360);
}

function bearingCardinal(deg: number): string {
  const dirs = ["N", "NE", "E", "SE", "S", "SW", "W", "NW"];
  return dirs[Math.round(deg / 45) % 8];
}

function AuliyaInner() {
  const searchParams = useSearchParams();
  const initialSaint = searchParams.get("saint") || "ghaus-e-azam";
  const initialTab = (searchParams.get("tab") as AuliyaTab) || "tazkirah";

  const {
    allAuliya,
    city,
    hijri,
    hilalOffset,
    setHilalOffset,
    familyBarsis,
    addFamilyBarsi,
  } = useApp();

  const [query, setQuery] = useState("");
  const [silsilaFilter, setSilsilaFilter] = useState<string>("All");
  const [selectedId, setSelectedId] = useState(initialSaint);
  const [activeTab, setActiveTab] = useState<AuliyaTab>(initialTab);

  // Biography Wird counter & copy state
  const [wirdCount, setWirdCount] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  // Gallery Lightbox state
  const [lightboxItem, setLightboxItem] = useState<ShrineGalleryItem | null>(null);

  // 360° Virtual Ziyarat interactive state
  const [yawDeg, setYawDeg] = useState(180); // 0 to 360 degrees
  const [pitchPct, setPitchPct] = useState(50); // 20 to 80
  const [zoom, setZoom] = useState(1.22);
  const [autoOrbit, setAutoOrbit] = useState(false);
  const [lightingMode, setLightingMode] = useState<"day" | "golden" | "night">("golden");
  const [activeHotspotId, setActiveHotspotId] = useState<string | null>(null);
  const [ambientOn, setAmbientOn] = useState(false);
  const [isDragging360, setIsDragging360] = useState(false);
  const dragStartRef = useRef<{ x: number; y: number; yaw: number; pitch: number } | null>(
    null
  );
  const audioCtxRef = useRef<AudioContext | null>(null);

  // Video & Documentary Cinema state
  const [selectedVideoIdx, setSelectedVideoIdx] = useState(0);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [videoStepIdx, setVideoStepIdx] = useState(0);
  const [voiceNarrationOn, setVoiceNarrationOn] = useState(false);

  // Books Reader Modal state
  const [activeBook, setActiveBook] = useState<AuthoredBook | null>(null);
  const [activeChapterIdx, setActiveChapterIdx] = useState(0);

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
        a.arabicName.includes(q) ||
        a.city.toLowerCase().includes(q) ||
        a.country.toLowerCase().includes(q) ||
        a.alqab.some((t) => t.toLowerCase().includes(q)) ||
        a.silsila.toLowerCase().includes(q)
      );
    });
  }, [allAuliya, query, silsilaFilter]);

  const saint =
    allAuliya.find((a) => a.id === selectedId) || filtered[0] || allAuliya[0];

  // Auto-orbit effect for 360° Ziyarat viewer
  useEffect(() => {
    if (!autoOrbit || activeTab !== "ziyarat" || isDragging360) return;
    const interval = window.setInterval(() => {
      setYawDeg((prev) => (prev + 1.2) % 360);
    }, 60);
    return () => window.clearInterval(interval);
  }, [autoOrbit, activeTab, isDragging360]);

  // Ambient Web Audio generator for 360° Ziyarat
  useEffect(() => {
    if (!ambientOn) {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
      return;
    }
    try {
      const Ctx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext })
          .webkitAudioContext;
      const ctx = new Ctx();
      audioCtxRef.current = ctx;

      const master = ctx.createGain();
      master.gain.value = 0.04;
      master.connect(ctx.destination);

      // Warm harmonic drone (D3 + A3 + D4 gentle spiritual courtyard resonance)
      [146.83, 220.0, 293.66].forEach((freq) => {
        const osc = ctx.createOscillator();
        osc.type = "sine";
        osc.frequency.value = freq;
        osc.connect(master);
        osc.start();
      });
    } catch {
      // Ignore if blocked by browser autoplay policy
    }
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
        audioCtxRef.current = null;
      }
    };
  }, [ambientOn]);

  // Documentary Cinema auto-advance & optional speech synthesis
  const currentVideo =
    saint.videos && saint.videos.length > 0
      ? saint.videos[Math.min(selectedVideoIdx, saint.videos.length - 1)]
      : null;

  useEffect(() => {
    if (!isPlayingVideo || !currentVideo) return;
    const scripts = currentVideo.narrationScript;
    if (voiceNarrationOn && typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(scripts[videoStepIdx] || "");
      utter.rate = 0.94;
      utter.pitch = 0.98;
      window.speechSynthesis.speak(utter);
    }
    const timer = window.setTimeout(() => {
      setVideoStepIdx((prev) => {
        if (prev + 1 < scripts.length) {
          return prev + 1;
        }
        setIsPlayingVideo(false);
        return 0;
      });
    }, 6500);
    return () => {
      window.clearTimeout(timer);
    };
  }, [isPlayingVideo, videoStepIdx, currentVideo, voiceNarrationOn]);

  const handleSelectSaint = (id: string) => {
    setSelectedId(id);
    setActiveHotspotId(null);
    setWirdCount(0);
    setSelectedVideoIdx(0);
    setVideoStepIdx(0);
    setIsPlayingVideo(false);
  };

  const copyText = (key: string, text: string) => {
    if (typeof navigator !== "undefined" && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    setCopiedKey(key);
    window.setTimeout(() => setCopiedKey(null), 1800);
  };

  const speakSalawatOrText = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      utter.rate = 0.92;
      window.speechSynthesis.speak(utter);
    }
  };

  // React Flow Shajrah-e-Tayyibah Lineage Graph
  const { nodes, edges } = useMemo(() => {
    const rfNodes: Node[] = [
      {
        id: "prophet",
        position: { x: 260, y: 10 },
        data: { label: "Sayyiduna Muhammad ﷺ (Khatam-un-Nabiyyin)" },
        style: {
          background: "linear-gradient(135deg, #DF98FA, #9055FF)",
          color: "#FFFFFF",
          border: "1px solid #F9B091",
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
          background: "#121931",
          color: "#FFFFFF",
          border: "1px solid #A44AFF",
          borderRadius: "12px",
          padding: "8px 14px",
          fontSize: "12px",
          width: 260,
          textAlign: "center",
        },
      },
    ];

    const positions: Record<string, { x: number; y: number }> = {
      "ghaus-e-azam": { x: 70, y: 210 },
      "ala-hazrat": { x: 70, y: 340 },
      "khwaja-moinuddin": { x: 280, y: 210 },
      "nizamuddin-auliya": { x: 280, y: 310 },
      "banda-nawaz": { x: 280, y: 410 },
      "data-ganj-bakhsh": { x: 490, y: 210 },
      "mujaddid-alf-thani": { x: 490, y: 340 },
    };

    allAuliya
      .filter((a) => a.status === "Published")
      .forEach((a) => {
        const isSelected = a.id === saint.id;
        rfNodes.push({
          id: a.id,
          position: positions[a.id] || { x: 280, y: 250 },
          data: {
            label: `${a.name}\n(${a.silsila} · ${a.city})`,
          },
          style: {
            background: isSelected
              ? "linear-gradient(135deg, rgba(249,176,145,0.28), rgba(144,85,255,0.45))"
              : "#121931",
            color: "#FFFFFF",
            border: isSelected ? "2px solid #F9B091" : "1px solid #242F54",
            borderRadius: "12px",
            padding: "10px 12px",
            fontSize: "11px",
            fontWeight: isSelected ? 700 : 500,
            width: 190,
            textAlign: "center",
            whiteSpace: "pre-line",
            cursor: "pointer",
          },
        });
      });

    const rfEdges: Edge[] = [
      {
        id: "e-prophet-ali",
        source: "prophet",
        target: "ali",
        animated: true,
        style: { stroke: "#F9B091", strokeWidth: 2 },
        markerEnd: { type: MarkerType.ArrowClosed, color: "#F9B091" },
      },
      {
        id: "e-ali-ghaus",
        source: "ali",
        target: "ghaus-e-azam",
        animated: true,
        style: { stroke: "#A44AFF" },
      },
      {
        id: "e-ghaus-razavi",
        source: "ghaus-e-azam",
        target: "ala-hazrat",
        animated: true,
        style: { stroke: "#A44AFF" },
      },
      {
        id: "e-ali-khwaja",
        source: "ali",
        target: "khwaja-moinuddin",
        animated: true,
        style: { stroke: "#4ADE80" },
      },
      {
        id: "e-khwaja-nizam",
        source: "khwaja-moinuddin",
        target: "nizamuddin-auliya",
        animated: true,
        style: { stroke: "#4ADE80" },
      },
      {
        id: "e-nizam-banda",
        source: "nizamuddin-auliya",
        target: "banda-nawaz",
        animated: true,
        style: { stroke: "#4ADE80" },
      },
      {
        id: "e-ali-data",
        source: "ali",
        target: "data-ganj-bakhsh",
        animated: true,
        style: { stroke: "#F9B091" },
      },
      {
        id: "e-data-mujaddid",
        source: "data-ganj-bakhsh",
        target: "mujaddid-alf-thani",
        animated: true,
        style: { stroke: "#F9B091" },
      },
    ];

    return { nodes: rfNodes, edges: rfEdges };
  }, [allAuliya, saint.id]);

  // Convert yawDeg (0..360) into CSS object-position X% (0..100)
  const panXPct = Math.round((yawDeg / 360) * 100);
  const activeHotspot =
    saint.hotspots.find((h) => h.id === activeHotspotId) || saint.hotspots[0] || null;

  // OpenStreetMap bounding box around the active saint's shrine
  const mapDelta = 0.012;
  const osmEmbedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${(
    saint.lng - mapDelta
  ).toFixed(5)}%2C${(saint.lat - mapDelta).toFixed(5)}%2C${(
    saint.lng + mapDelta
  ).toFixed(5)}%2C${(saint.lat + mapDelta).toFixed(
    5
  )}&layer=mapnik&marker=${saint.lat.toFixed(5)}%2C${saint.lng.toFixed(5)}`;

  const saintDistanceKm = haversineKm(city.lat, city.lng, saint.lat, saint.lng);
  const saintBearing = initialBearingDeg(city.lat, city.lng, saint.lat, saint.lng);

  return (
    <div className="space-y-6">
      {/* Header Banner */}
      <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6 relative overflow-hidden">
        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#A44AFF]/15 border border-[#A44AFF]/30 text-[#DF98FA] text-xs font-medium mb-2">
              <Sparkles className="w-3.5 h-3.5" />
              Tazkirat-ul-Auliya · Architectural Gallery · 360° Ziyarat · Cinema · Shajrah · Live Maps
            </div>
            <h1 className="text-2xl sm:text-3xl font-bold text-white">
              Auliya Allah Encyclopedia & Virtual Ziyarat
            </h1>
            <p className="text-sm text-[#8789A3] mt-1">
              Authentic Sunni biographies, chronological timelines, shrine architecture galleries, interactive 360° Ziyarat, documentaries, Shajrah-e-Tayyibah, classical books, and live shrine maps.
            </p>
          </div>

          {/* Search & Silsila Filter */}
          <div className="flex flex-col sm:flex-row gap-2.5">
            <div className="relative">
              <Search className="w-4 h-4 text-[#8789A3] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search Wali, Laqab, City..."
                className="w-full sm:w-60 bg-[#091945] border border-[#242F54] rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-[#8789A3] focus:outline-none focus:border-[#A44AFF]"
              />
            </div>
            <select
              value={silsilaFilter}
              onChange={(e) => setSilsilaFilter(e.target.value)}
              className="bg-[#091945] border border-[#242F54] rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-[#A44AFF]"
            >
              <option value="All">All Silsilas</option>
              <option value="Qadri">Silsila-e-Qadriya</option>
              <option value="Chishti">Silsila-e-Chishtiya</option>
              <option value="Naqshbandi">Silsila-e-Naqshbandiya</option>
              <option value="Razavi">Silsila-e-Qadriya Razaviya</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Grid: Saint Directory Sidebar + 7-Tab Encyclopedia Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Directory List */}
        <div className="lg:col-span-4 space-y-2.5">
          <div className="flex items-center justify-between px-1 mb-1">
            <span className="text-xs font-semibold uppercase tracking-wider text-[#8789A3]">
              Auliya Directory ({filtered.length})
            </span>
            <span className="text-[11px] text-[#DF98FA]">Tap to explore</span>
          </div>
          {filtered.map((item) => {
            const active = item.id === saint.id;
            const dist = haversineKm(city.lat, city.lng, item.lat, item.lng);
            return (
              <button
                key={item.id}
                onClick={() => handleSelectSaint(item.id)}
                className={`w-full text-left p-3.5 rounded-2xl border transition-all ${
                  active
                    ? "bg-gradient-to-r from-[#DF98FA]/20 to-[#9055FF]/25 border-[#A44AFF] shadow-lg"
                    : "bg-[#121931] border-[#242F54] hover:border-[#A44AFF]/50"
                }`}
              >
                <div className="flex items-start gap-3">
                  <img
                    src={resolvePublicAssetUrl(item.shrineImage)}
                    alt={item.name}
                    className="w-14 h-14 rounded-xl object-cover border border-[#242F54] shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#A44AFF]/20 text-[#DF98FA]">
                        {item.silsila}
                      </span>
                      <span className="text-[11px] text-[#F9B091] font-medium truncate">
                        Urs: {item.ursLabel}
                      </span>
                    </div>
                    <h3 className="text-sm font-bold text-white mt-1 truncate">
                      {item.name}
                    </h3>
                    <p
                      className="font-arabic text-sm text-[#DF98FA] mt-0.5 truncate"
                      dir="rtl"
                    >
                      {item.urduName}
                    </p>
                    <div className="flex items-center justify-between text-[11px] text-[#8789A3] mt-1">
                      <span className="flex items-center gap-1 truncate">
                        <MapPin className="w-3 h-3 text-[#4ADE80] shrink-0" />
                        {item.city}, {item.country}
                      </span>
                      <span className="text-[#4ADE80] font-medium shrink-0">
                        {dist.toLocaleString()} km
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Right Detail Workspace */}
        <div className="lg:col-span-8 space-y-5">
          {/* 7 Sub-Navigation Tabs */}
          <div className="flex flex-wrap gap-1.5 bg-[#121931] p-1.5 rounded-2xl border border-[#242F54]">
            {[
              { id: "tazkirah", label: "Biography & Timeline", icon: BookOpen },
              { id: "gallery", label: "Details & Gallery", icon: ImageIcon },
              { id: "ziyarat", label: "360° Virtual Ziyarat", icon: Eye },
              { id: "video", label: "Video & Documentary", icon: Film },
              { id: "shajrah", label: "Shajrah-e-Tayyibah", icon: GitBranch },
              { id: "books", label: "Books & Malfuzat", icon: ScrollText },
              { id: "map", label: "Live Maps & Urs", icon: Compass },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as AuliyaTab)}
                  className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-[#DF98FA] to-[#9055FF] text-white shadow-md"
                      : "text-[#8789A3] hover:text-white"
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* TAB 1: BIOGRAPHY & TIMELINE (TAZKIRAH) */}
          {activeTab === "tazkirah" && (
            <div className="rounded-3xl bg-[#121931] border border-[#242F54] overflow-hidden">
              {/* Hero Shrine Image Header */}
              <div className="relative h-64 sm:h-72 w-full overflow-hidden">
                <img
                  src={resolvePublicAssetUrl(saint.shrineImage)}
                  alt={`${saint.name} Mazar Architecture`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#121931] via-[#121931]/55 to-transparent" />
                <div className="absolute top-4 right-4 flex flex-wrap gap-2">
                  <button
                    onClick={() => setActiveTab("ziyarat")}
                    className="px-3 py-1.5 rounded-xl bg-[#040C23]/80 backdrop-blur-md border border-[#A44AFF]/50 text-xs font-semibold text-[#DF98FA] hover:bg-[#A44AFF] hover:text-white transition-all flex items-center gap-1.5"
                  >
                    <Eye className="w-3.5 h-3.5" /> Enter 360° Ziyarat
                  </button>
                  <button
                    onClick={() => setActiveTab("map")}
                    className="px-3 py-1.5 rounded-xl bg-[#040C23]/80 backdrop-blur-md border border-[#4ADE80]/40 text-xs font-semibold text-[#4ADE80] hover:bg-[#4ADE80]/20 transition-all flex items-center gap-1.5"
                  >
                    <MapPin className="w-3.5 h-3.5" /> {saintDistanceKm.toLocaleString()} km
                  </button>
                </div>
                <div className="absolute bottom-4 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-2">
                  <div>
                    <div className="flex flex-wrap gap-1.5 mb-2">
                      {saint.alqab.map((laqab) => (
                        <span
                          key={laqab}
                          className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F9B091]/20 border border-[#F9B091]/40 text-[#F9B091]"
                        >
                          {laqab}
                        </span>
                      ))}
                    </div>
                    <h2 className="text-2xl sm:text-3xl font-bold text-white">
                      {saint.name}
                    </h2>
                    <p className="text-xs text-[#8789A3] mt-0.5">
                      {saint.arabicName} · {saint.city}, {saint.country}
                    </p>
                  </div>
                  <p className="font-arabic text-2xl text-[#DF98FA]" dir="rtl">
                    {saint.urduName}
                  </p>
                </div>
              </div>

              <div className="p-6 space-y-6">
                {/* Key Meta Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  <div className="p-3 rounded-xl bg-[#091945] border border-[#242F54]">
                    <p className="text-[11px] text-[#8789A3]">Wiladat (Birth)</p>
                    <p className="text-xs font-semibold text-white mt-0.5">
                      {saint.wiladatHijri}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#091945] border border-[#242F54]">
                    <p className="text-[11px] text-[#8789A3]">Wisal (Union)</p>
                    <p className="text-xs font-semibold text-white mt-0.5">
                      {saint.wisalHijri}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#091945] border border-[#242F54]">
                    <p className="text-[11px] text-[#8789A3]">Annual Urs Mubarak</p>
                    <p className="text-xs font-semibold text-[#F9B091] mt-0.5">
                      {saint.ursLabel}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-[#091945] border border-[#242F54]">
                    <p className="text-[11px] text-[#8789A3]">Dargah Location</p>
                    <p className="text-xs font-semibold text-[#4ADE80] mt-0.5">
                      {saint.city}, {saint.country}
                    </p>
                  </div>
                </div>

                {/* Overview Biography */}
                <div className="p-4 rounded-2xl bg-[#091945]/70 border border-[#242F54]">
                  <h3 className="text-sm font-bold text-[#DF98FA] uppercase tracking-wider mb-2">
                    Tazkirah Overview (Classical Sunni Biography)
                  </h3>
                  <p className="text-sm text-white/90 leading-relaxed">
                    {saint.fullTazkirah}
                  </p>
                </div>

                {/* 3-Chapter Deep Scholarly Biography */}
                {(saint.earlyLifeAndEducation ||
                  saint.spiritualLineageAndTraining ||
                  saint.reformAndLegacy) && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {saint.earlyLifeAndEducation && (
                      <div className="p-4 rounded-2xl bg-[#091945] border border-[#242F54]">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#F9B091] mb-1.5">
                          I · Early Life & Sacred Knowledge
                        </div>
                        <p className="text-xs text-white/85 leading-relaxed">
                          {saint.earlyLifeAndEducation}
                        </p>
                      </div>
                    )}
                    {saint.spiritualLineageAndTraining && (
                      <div className="p-4 rounded-2xl bg-[#091945] border border-[#242F54]">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#DF98FA] mb-1.5">
                          II · Bay&apos;ah, Mujahada & Ijazah
                        </div>
                        <p className="text-xs text-white/85 leading-relaxed">
                          {saint.spiritualLineageAndTraining}
                        </p>
                      </div>
                    )}
                    {saint.reformAndLegacy && (
                      <div className="p-4 rounded-2xl bg-[#091945] border border-[#242F54]">
                        <div className="text-[11px] font-bold uppercase tracking-wider text-[#4ADE80] mb-1.5">
                          III · Revival & Eternal Legacy
                        </div>
                        <p className="text-xs text-white/85 leading-relaxed">
                          {saint.reformAndLegacy}
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {/* Chronological Life & Era Timeline */}
                {saint.lifeTimeline && saint.lifeTimeline.length > 0 && (
                  <div className="p-5 rounded-2xl bg-[#091945]/60 border border-[#242F54]">
                    <h3 className="text-sm font-bold text-white flex items-center gap-2 mb-4">
                      <Clock className="w-4 h-4 text-[#F9B091]" />
                      Chronological Life & Historical Milestones
                    </h3>
                    <div className="relative pl-5 border-l-2 border-[#A44AFF]/40 space-y-4">
                      {saint.lifeTimeline.map((m, idx) => (
                        <div key={idx} className="relative">
                          <span className="w-3 h-3 rounded-full bg-[#F9B091] border-2 border-[#121931] absolute -left-[23px] top-1" />
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-[11px] font-bold px-2 py-0.5 rounded-md bg-[#A44AFF]/20 text-[#DF98FA]">
                              {m.yearHijri}
                            </span>
                            <h4 className="text-xs font-bold text-white">{m.title}</h4>
                          </div>
                          <p className="text-xs text-[#8789A3] mt-1 leading-relaxed">
                            {m.detail}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Golden Sayings (Malfuzat-e-Qudsiyyah) */}
                {saint.goldenSayings && saint.goldenSayings.length > 0 && (
                  <div>
                    <h3 className="text-sm font-bold text-[#F9B091] uppercase tracking-wider mb-3">
                      Malfuzat-e-Qudsiyyah (Golden Counsels)
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {saint.goldenSayings.map((quote, idx) => (
                        <div
                          key={idx}
                          className="p-4 rounded-2xl bg-gradient-to-br from-[#091945] to-[#121931] border border-[#F9B091]/30 flex flex-col justify-between"
                        >
                          <p className="text-xs text-white/90 italic leading-relaxed">
                            &ldquo;{quote}&rdquo;
                          </p>
                          <div className="flex items-center justify-between mt-3 pt-2 border-t border-[#242F54]">
                            <span className="text-[10px] text-[#F9B091] font-semibold">
                              — {saint.name}
                            </span>
                            <button
                              onClick={() => copyText(`quote-${idx}`, quote)}
                              className="text-[10px] text-[#8789A3] hover:text-white flex items-center gap-1"
                            >
                              {copiedKey === `quote-${idx}` ? (
                                <>
                                  <Check className="w-3 h-3 text-[#4ADE80]" /> Copied
                                </>
                              ) : (
                                <>
                                  <Copy className="w-3 h-3" /> Copy
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Signature Daily Wird Counter */}
                {saint.dailyWird && (
                  <div className="p-5 rounded-2xl bg-gradient-to-r from-[#DF98FA]/12 via-[#9055FF]/15 to-[#091945] border border-[#A44AFF]/40">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#A44AFF]/25 text-[#DF98FA]">
                          Recommended Silsila Wird
                        </span>
                        <h3 className="text-base font-bold text-white mt-1.5">
                          {saint.dailyWird.title}
                        </h3>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setWirdCount((c) => c + 1)}
                          className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#DF98FA] to-[#9055FF] text-white text-xs font-bold shadow-md hover:opacity-95"
                        >
                          Recite +1 ({wirdCount} / {saint.dailyWird.recommendedCount})
                        </button>
                        {wirdCount > 0 && (
                          <button
                            onClick={() => setWirdCount(0)}
                            className="p-2 rounded-xl bg-[#091945] border border-[#242F54] text-[#8789A3] hover:text-white"
                            title="Reset count"
                          >
                            <RotateCcw className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                    <p
                      className="font-arabic text-2xl text-[#F9B091] mt-3 text-right"
                      dir="rtl"
                    >
                      {saint.dailyWird.arabic}
                    </p>
                    <p className="text-xs text-[#DF98FA] font-medium mt-1">
                      {saint.dailyWird.transliteration}
                    </p>
                    <p className="text-xs text-[#8789A3] mt-0.5">
                      {saint.dailyWird.translation}
                    </p>
                  </div>
                )}

                {/* Verified Karamat & Khulafa */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="text-sm font-bold text-[#F9B091] uppercase tracking-wider mb-2">
                      Verified Karamat & Spiritual Rank
                    </h3>
                    <ul className="space-y-2">
                      {saint.karamat.map((k, idx) => (
                        <li
                          key={idx}
                          className="p-3 rounded-xl bg-[#091945]/70 border border-[#242F54] text-xs text-white/90 flex items-start gap-2.5"
                        >
                          <span className="w-5 h-5 rounded-full bg-[#A44AFF]/20 text-[#DF98FA] flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                            {idx + 1}
                          </span>
                          <span>{k}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-[#4ADE80] uppercase tracking-wider mb-2">
                      Prominent Khulafa (Spiritual Successors)
                    </h3>
                    <div className="space-y-2">
                      {saint.khulafaNames.map((kh) => (
                        <div
                          key={kh}
                          className="p-3 rounded-xl bg-[#091945] border border-[#242F54] text-xs font-semibold text-white flex items-center gap-2"
                        >
                          <Award className="w-4 h-4 text-[#4ADE80] shrink-0" />
                          <span>{kh}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: ARCHITECTURAL DETAILS & GALLERY */}
          {activeTab === "gallery" && (
            <div className="space-y-5">
              {/* Architectural Fact Sheet */}
              {saint.architecturalDetails && (
                <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F9B091]">
                        Sacred Architecture & Heritage Dossier
                      </span>
                      <h2 className="text-xl font-bold text-white mt-0.5">
                        {saint.name} — Shrine Complex Details
                      </h2>
                    </div>
                    <span className="px-3 py-1 rounded-full bg-[#4ADE80]/15 border border-[#4ADE80]/30 text-[#4ADE80] text-xs font-semibold">
                      {saint.city}, {saint.country}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div className="p-3.5 rounded-2xl bg-[#091945] border border-[#242F54]">
                      <p className="text-[11px] text-[#8789A3]">Architectural Style</p>
                      <p className="text-xs font-bold text-white mt-1">
                        {saint.architecturalDetails.style}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#091945] border border-[#242F54]">
                      <p className="text-[11px] text-[#8789A3]">Historical Construction & Era</p>
                      <p className="text-xs font-bold text-white mt-1">
                        {saint.architecturalDetails.eraBuilt}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#091945] border border-[#242F54]">
                      <p className="text-[11px] text-[#8789A3]">Royal & Scholarly Patronage</p>
                      <p className="text-xs font-bold text-[#DF98FA] mt-1">
                        {saint.architecturalDetails.patronage}
                      </p>
                    </div>
                    <div className="p-3.5 rounded-2xl bg-[#091945] border border-[#242F54]">
                      <p className="text-[11px] text-[#8789A3]">Visiting Hours & Landmark</p>
                      <p className="text-xs font-bold text-[#4ADE80] mt-1">
                        {saint.architecturalDetails.visitingHours}
                      </p>
                      <p className="text-[11px] text-[#8789A3] mt-0.5">
                        Near: {saint.architecturalDetails.nearestLandmark}
                      </p>
                    </div>
                  </div>

                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#DF98FA] mb-2">
                      Key Architectural Landmarks Inside the Precinct
                    </h3>
                    <div className="flex flex-wrap gap-2">
                      {saint.architecturalDetails.keyFeatures.map((feat) => (
                        <span
                          key={feat}
                          className="px-3 py-1.5 rounded-xl bg-[#091945] border border-[#A44AFF]/30 text-xs text-white flex items-center gap-1.5"
                        >
                          <Landmark className="w-3.5 h-3.5 text-[#F9B091]" />
                          {feat}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Multi-Photo Architectural Gallery Grid */}
              <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      Architectural & Courtyard Visual Gallery
                    </h3>
                    <p className="text-xs text-[#8789A3]">
                      Strictly respectful, face-free architectural studies of domes, calligraphy, and courtyards. Click any plate to inspect in full screen.
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {(saint.gallery || []).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => setLightboxItem(item)}
                      className="group cursor-pointer rounded-2xl bg-[#091945] border border-[#242F54] hover:border-[#A44AFF] overflow-hidden transition-all"
                    >
                      <div className="relative h-52 overflow-hidden">
                        <img
                          src={resolvePublicAssetUrl(item.imageUrl)}
                          alt={item.title}
                          style={{ objectPosition: item.focalPoint || "50% 50%" }}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#091945] via-transparent to-transparent" />
                        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-[#040C23]/80 backdrop-blur-md border border-[#242F54] text-[10px] font-semibold text-[#F9B091]">
                          {item.era}
                        </span>
                        <span className="absolute top-3 right-3 p-1.5 rounded-lg bg-[#040C23]/80 text-white opacity-80 group-hover:opacity-100">
                          <Maximize2 className="w-3.5 h-3.5" />
                        </span>
                      </div>
                      <div className="p-4">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#DF98FA]">
                          {item.architecturalStyle}
                        </span>
                        <h4 className="text-sm font-bold text-white mt-0.5">
                          {item.title}
                        </h4>
                        <p className="text-xs text-[#8789A3] mt-1 leading-relaxed">
                          {item.caption}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: 360° VIRTUAL ZIYARAT VIEWER */}
          {activeTab === "ziyarat" && (
            <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold text-[#F9B091] uppercase tracking-wider">
                    Interactive 360° Architectural Panorama
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    {saint.name} — {saint.city}
                  </h2>
                  <p className="text-xs text-[#8789A3]">
                    Drag across the viewport or use the 360° controls to rotate around the Mazar courtyard and inspect sacred architectural hotspots.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-2">
                  {/* Auto-Orbit Toggle */}
                  <button
                    onClick={() => setAutoOrbit((o) => !o)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      autoOrbit
                        ? "bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80]"
                        : "bg-[#091945] border-[#242F54] text-[#8789A3] hover:text-white"
                    }`}
                  >
                    {autoOrbit ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
                    {autoOrbit ? "Auto-Orbit ON" : "Auto-Orbit 360°"}
                  </button>

                  {/* Lighting Mode Switcher */}
                  <div className="flex items-center bg-[#091945] border border-[#242F54] rounded-xl p-0.5">
                    {[
                      { id: "day", label: "Day", icon: Sun },
                      { id: "golden", label: "Golden", icon: Sunset },
                      { id: "night", label: "Night", icon: Moon },
                    ].map((m) => {
                      const Icon = m.icon;
                      return (
                        <button
                          key={m.id}
                          onClick={() =>
                            setLightingMode(m.id as "day" | "golden" | "night")
                          }
                          className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold flex items-center gap-1 ${
                            lightingMode === m.id
                              ? "bg-[#A44AFF] text-white"
                              : "text-[#8789A3] hover:text-white"
                          }`}
                        >
                          <Icon className="w-3 h-3" />
                          {m.label}
                        </button>
                      );
                    })}
                  </div>

                  {/* Ambient Audio */}
                  <button
                    onClick={() => setAmbientOn((a) => !a)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                      ambientOn
                        ? "bg-[#F9B091]/20 border-[#F9B091] text-[#F9B091]"
                        : "bg-[#091945] border-[#242F54] text-[#8789A3]"
                    }`}
                  >
                    {ambientOn ? (
                      <Volume2 className="w-3.5 h-3.5" />
                    ) : (
                      <VolumeX className="w-3.5 h-3.5" />
                    )}
                    {ambientOn ? "Ambience ON" : "Courtyard Audio"}
                  </button>
                </div>
              </div>

              {/* Interactive 360° Drag Viewport */}
              <div
                onPointerDown={(e) => {
                  setIsDragging360(true);
                  dragStartRef.current = {
                    x: e.clientX,
                    y: e.clientY,
                    yaw: yawDeg,
                    pitch: pitchPct,
                  };
                }}
                onPointerMove={(e) => {
                  if (!isDragging360 || !dragStartRef.current) return;
                  const dx = e.clientX - dragStartRef.current.x;
                  const dy = e.clientY - dragStartRef.current.y;
                  const nextYaw = (dragStartRef.current.yaw - dx * 0.45 + 360) % 360;
                  const nextPitch = Math.max(
                    20,
                    Math.min(80, dragStartRef.current.pitch - dy * 0.15)
                  );
                  setYawDeg(Math.round(nextYaw));
                  setPitchPct(Math.round(nextPitch));
                }}
                onPointerUp={() => {
                  setIsDragging360(false);
                  dragStartRef.current = null;
                }}
                onPointerLeave={() => {
                  setIsDragging360(false);
                  dragStartRef.current = null;
                }}
                className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#242F54] bg-[#040C23] select-none cursor-grab active:cursor-grabbing"
              >
                <img
                  src={resolvePublicAssetUrl(saint.shrineImage)}
                  alt={saint.name}
                  draggable={false}
                  style={{
                    objectPosition: `${panXPct}% ${pitchPct}%`,
                    transform: `scale(${zoom})`,
                    filter:
                      lightingMode === "day"
                        ? "brightness(1.06) contrast(1.04)"
                        : lightingMode === "golden"
                        ? "sepia(0.18) saturate(1.25) brightness(0.98)"
                        : "brightness(0.72) contrast(1.18) hue-rotate(-12deg)",
                  }}
                  className="w-full h-full object-cover transition-transform duration-150"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-[#040C23]/85 via-transparent to-[#040C23]/45 pointer-events-none" />

                {/* Top Compass & Bearing HUD */}
                <div className="absolute top-3 left-3 right-3 flex items-center justify-between pointer-events-none">
                  <div className="px-3 py-1 rounded-full bg-[#040C23]/80 backdrop-blur-md border border-[#242F54] text-[11px] font-semibold text-white flex items-center gap-2">
                    <Compass className="w-3.5 h-3.5 text-[#4ADE80]" />
                    <span>
                      360° Bearing: {Math.round(yawDeg)}° ({bearingCardinal(yawDeg)})
                    </span>
                  </div>
                  <div className="px-3 py-1 rounded-full bg-[#040C23]/80 backdrop-blur-md border border-[#242F54] text-[11px] text-[#DF98FA]">
                    Drag left/right to rotate · Click pins for details
                  </div>
                </div>

                {/* Interactive Hotspots */}
                {saint.hotspots.map((spot, idx) => {
                  const isSpotActive =
                    (activeHotspot && activeHotspot.id === spot.id) || false;
                  return (
                    <button
                      key={spot.id}
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveHotspotId(spot.id);
                      }}
                      style={{ left: `${spot.xPct}%`, top: `${spot.yPct}%` }}
                      className={`absolute -translate-x-1/2 -translate-y-1/2 px-3 py-1.5 rounded-full text-xs font-bold shadow-lg flex items-center gap-1.5 transition-transform hover:scale-110 ${
                        isSpotActive
                          ? "bg-[#F9B091] text-[#040C23] ring-4 ring-[#F9B091]/40"
                          : "bg-[#121931]/90 text-white border border-[#F9B091]"
                      }`}
                    >
                      <span className="w-4 h-4 rounded-full bg-[#A44AFF] text-white text-[10px] flex items-center justify-center">
                        {idx + 1}
                      </span>
                      {spot.title}
                    </button>
                  );
                })}

                {/* Active Hotspot Detail Overlay */}
                {activeHotspot && (
                  <div className="absolute bottom-3 left-3 right-3 p-4 rounded-xl bg-[#040C23]/90 backdrop-blur-md border border-[#A44AFF]/50">
                    <div className="flex items-center justify-between gap-2">
                      <h4 className="text-sm font-bold text-[#F9B091]">
                        {activeHotspot.title}
                      </h4>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => {
                            const idx = saint.hotspots.findIndex(
                              (h) => h.id === activeHotspot.id
                            );
                            const prev =
                              saint.hotspots[
                                (idx - 1 + saint.hotspots.length) %
                                  saint.hotspots.length
                              ];
                            if (prev) {
                              setActiveHotspotId(prev.id);
                              setYawDeg(Math.round((prev.xPct / 100) * 360));
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-[#121931] border border-[#242F54] text-[11px] text-white hover:border-[#A44AFF]"
                        >
                          ← Prev
                        </button>
                        <button
                          onClick={() => {
                            const idx = saint.hotspots.findIndex(
                              (h) => h.id === activeHotspot.id
                            );
                            const next =
                              saint.hotspots[(idx + 1) % saint.hotspots.length];
                            if (next) {
                              setActiveHotspotId(next.id);
                              setYawDeg(Math.round((next.xPct / 100) * 360));
                            }
                          }}
                          className="px-2 py-1 rounded-lg bg-[#121931] border border-[#242F54] text-[11px] text-white hover:border-[#A44AFF]"
                        >
                          Next →
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-white/90 mt-1">
                      {activeHotspot.description}
                    </p>
                    <p className="text-[11px] text-[#4ADE80] mt-1.5 font-medium">
                      Adab Note: {activeHotspot.adabNote}
                    </p>
                  </div>
                )}
              </div>

              {/* Pan & Zoom Sliders + Recite Fatiha/Salawat Action */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                <div className="p-3 rounded-xl bg-[#091945] border border-[#242F54]">
                  <div className="flex justify-between text-xs text-[#8789A3] mb-1">
                    <span>360° Horizontal Rotation</span>
                    <span className="text-white font-semibold">{Math.round(yawDeg)}°</span>
                  </div>
                  <input
                    type="range"
                    min={0}
                    max={360}
                    value={yawDeg}
                    onChange={(e) => setYawDeg(Number(e.target.value))}
                    className="w-full accent-[#A44AFF]"
                  />
                </div>
                <div className="p-3 rounded-xl bg-[#091945] border border-[#242F54]">
                  <div className="flex justify-between text-xs text-[#8789A3] mb-1">
                    <span>Optical Zoom</span>
                    <span className="text-white font-semibold">{zoom.toFixed(2)}x</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={1.85}
                    step={0.05}
                    value={zoom}
                    onChange={(e) => setZoom(Number(e.target.value))}
                    className="w-full accent-[#F9B091]"
                  />
                </div>
                <button
                  onClick={() =>
                    speakSalawatOrText(
                      `Assalamu Alaikum Ya Ahlal Quboor. Reciting Surah Al-Fatiha and Salawat for ${saint.name}.`
                    )
                  }
                  className="h-full px-4 py-3 rounded-xl bg-gradient-to-r from-[#DF98FA]/20 to-[#9055FF]/30 border border-[#A44AFF] text-xs font-bold text-white hover:opacity-95 flex items-center justify-center gap-2"
                >
                  <Volume2 className="w-4 h-4 text-[#F9B091]" />
                  Recite Salam & Fatiha Audio
                </button>
              </div>

              {/* Sunni Adab-e-Ziyarat Checklist */}
              <div className="p-4 rounded-2xl bg-[#091945] border border-[#242F54]">
                <h3 className="text-xs font-bold text-[#DF98FA] uppercase tracking-wider mb-2.5">
                  Sunni Adab-e-Ziyarat (Etiquette of Visiting the Auliya)
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {saint.adabZiyarat.map((adab, i) => (
                    <div
                      key={i}
                      className="flex items-start gap-2 text-xs text-white/85"
                    >
                      <span className="text-[#4ADE80] font-bold">✓</span>
                      <span>{adab}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: VIDEO & DOCUMENTARY VIEWER (CINEMA MODE) */}
          {activeTab === "video" && (
            <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6 space-y-5">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#F9B091]">
                    Narrated Ziyarat Documentary & Malfuzat Cinema
                  </span>
                  <h2 className="text-xl font-bold text-white mt-0.5">
                    {saint.name} — Visual Documentaries
                  </h2>
                </div>
                {saint.videos && saint.videos.length > 1 && (
                  <div className="flex flex-wrap gap-1.5">
                    {saint.videos.map((v, idx) => (
                      <button
                        key={v.id}
                        onClick={() => {
                          setSelectedVideoIdx(idx);
                          setVideoStepIdx(0);
                          setIsPlayingVideo(false);
                        }}
                        className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                          selectedVideoIdx === idx
                            ? "bg-[#A44AFF] border-[#A44AFF] text-white"
                            : "bg-[#091945] border-[#242F54] text-[#8789A3] hover:text-white"
                        }`}
                      >
                        {v.category} ({v.duration})
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {currentVideo ? (
                <>
                  {/* Cinema Player Viewport */}
                  <div className="relative h-80 sm:h-96 rounded-2xl overflow-hidden border border-[#242F54] bg-[#040C23]">
                    <img
                      src={resolvePublicAssetUrl(
                        saint.gallery && saint.gallery.length > 0
                          ? saint.gallery[videoStepIdx % saint.gallery.length].imageUrl
                          : saint.shrineImage
                      )}
                      alt={currentVideo.title}
                      style={{
                        objectPosition:
                          saint.gallery && saint.gallery.length > 0
                            ? saint.gallery[videoStepIdx % saint.gallery.length]
                                .focalPoint
                            : "50% 50%",
                        transform: isPlayingVideo ? "scale(1.18)" : "scale(1.04)",
                      }}
                      className="w-full h-full object-cover transition-transform duration-[6000ms] ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#040C23] via-[#040C23]/40 to-transparent" />

                    {/* Top Badge */}
                    <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
                      <span className="px-3 py-1 rounded-full bg-[#040C23]/85 border border-[#F9B091]/40 text-[11px] font-bold text-[#F9B091]">
                        {currentVideo.category} · {currentVideo.duration}
                      </span>
                      <button
                        onClick={() => setVoiceNarrationOn((v) => !v)}
                        className={`px-3 py-1 rounded-full text-[11px] font-semibold border flex items-center gap-1.5 ${
                          voiceNarrationOn
                            ? "bg-[#4ADE80]/20 border-[#4ADE80] text-[#4ADE80]"
                            : "bg-[#040C23]/80 border-[#242F54] text-[#8789A3]"
                        }`}
                      >
                        {voiceNarrationOn ? (
                          <Volume2 className="w-3.5 h-3.5" />
                        ) : (
                          <VolumeX className="w-3.5 h-3.5" />
                        )}
                        {voiceNarrationOn ? "Voice Narration ON" : "Enable Voice Narration"}
                      </button>
                    </div>

                    {/* Subtitle & Narration Box */}
                    <div className="absolute bottom-16 left-4 right-4 p-4 rounded-2xl bg-[#040C23]/90 backdrop-blur-md border border-[#242F54]">
                      <div className="flex items-center justify-between text-[11px] text-[#DF98FA] font-semibold mb-1">
                        <span>
                          Chapter {videoStepIdx + 1} of{" "}
                          {currentVideo.narrationScript.length}:{" "}
                          {currentVideo.chapters[videoStepIdx]?.label ||
                            currentVideo.title}
                        </span>
                        <span>
                          {currentVideo.chapters[videoStepIdx]?.time || "00:00"}
                        </span>
                      </div>
                      <p className="text-xs sm:text-sm text-white leading-relaxed">
                        &ldquo;{currentVideo.narrationScript[videoStepIdx]}&rdquo;
                      </p>
                    </div>

                    {/* Bottom Transport Controls */}
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setIsPlayingVideo((p) => !p)}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-[#DF98FA] to-[#9055FF] text-white text-xs font-bold flex items-center gap-1.5 shadow-md"
                        >
                          {isPlayingVideo ? (
                            <>
                              <Pause className="w-3.5 h-3.5" /> Pause
                            </>
                          ) : (
                            <>
                              <Play className="w-3.5 h-3.5" /> Play Documentary
                            </>
                          )}
                        </button>
                        <button
                          onClick={() => {
                            setIsPlayingVideo(false);
                            setVideoStepIdx(0);
                          }}
                          className="p-1.5 rounded-xl bg-[#121931] border border-[#242F54] text-[#8789A3] hover:text-white"
                          title="Restart"
                        >
                          <RotateCcw className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Chapter Step Dots */}
                      <div className="flex items-center gap-1.5">
                        {currentVideo.narrationScript.map((_, idx) => (
                          <button
                            key={idx}
                            onClick={() => setVideoStepIdx(idx)}
                            className={`h-2 rounded-full transition-all ${
                              idx === videoStepIdx
                                ? "w-6 bg-[#F9B091]"
                                : "w-2 bg-[#242F54] hover:bg-[#8789A3]"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Documentary Chapters List */}
                  <div>
                    <h3 className="text-xs font-bold uppercase tracking-wider text-[#DF98FA] mb-2.5">
                      Documentary Chapters & Timeline
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {currentVideo.chapters.map((ch, idx) => (
                        <button
                          key={idx}
                          onClick={() => {
                            setVideoStepIdx(
                              Math.min(idx, currentVideo.narrationScript.length - 1)
                            );
                            setIsPlayingVideo(true);
                          }}
                          className={`text-left p-3.5 rounded-2xl border transition-all ${
                            videoStepIdx === idx
                              ? "bg-[#091945] border-[#F9B091]"
                              : "bg-[#091945]/60 border-[#242F54] hover:border-[#A44AFF]/50"
                          }`}
                        >
                          <div className="flex items-center justify-between text-[11px] font-bold text-[#F9B091]">
                            <span>Part {idx + 1}</span>
                            <span>{ch.time}</span>
                          </div>
                          <h4 className="text-xs font-bold text-white mt-1">
                            {ch.label}
                          </h4>
                          <p className="text-[11px] text-[#8789A3] mt-1">
                            {ch.summary}
                          </p>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              ) : null}
            </div>
          )}

          {/* TAB 5: SHAJRAH-E-TAYYIBAH (LINEAGE GRAPH + GOLDEN CHAIN) */}
          {activeTab === "shajrah" && (
            <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6 space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div>
                  <span className="text-[11px] font-semibold uppercase tracking-wider text-[#DF98FA]">
                    Unbroken Spiritual Transmission (Isnad-e-Tariqat)
                  </span>
                  <h2 className="text-xl font-bold text-white">
                    Shajrah-e-Tayyibah — {saint.name}
                  </h2>
                  <p className="text-xs text-[#8789A3]">
                    Interactive Silsila graph and step-by-step golden chain connecting back to Sayyiduna Rasulullah ﷺ.
                  </p>
                </div>
                <span className="text-xs px-3 py-1 rounded-full bg-[#A44AFF]/20 text-[#DF98FA] border border-[#A44AFF]/40 font-semibold">
                  Silsila-e-{saint.silsila}
                </span>
              </div>

              {/* Step-by-Step Golden Chain Cards */}
              {saint.shajrahChain && saint.shajrahChain.length > 0 && (
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#F9B091] mb-3">
                    Golden Chain of Transmission ({saint.silsila} Lineage)
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                    {saint.shajrahChain.map((node, idx) => (
                      <div
                        key={node.generation}
                        className={`p-3 rounded-2xl border flex items-start gap-2.5 ${
                          idx === 0
                            ? "bg-gradient-to-r from-[#DF98FA]/20 to-[#9055FF]/20 border-[#F9B091]"
                            : idx === saint.shajrahChain!.length - 1
                            ? "bg-[#091945] border-[#4ADE80]"
                            : "bg-[#091945]/75 border-[#242F54]"
                        }`}
                      >
                        <span className="w-6 h-6 rounded-full bg-[#121931] border border-[#A44AFF]/50 text-[11px] font-bold text-[#DF98FA] flex items-center justify-center shrink-0">
                          {node.generation}
                        </span>
                        <div className="min-w-0">
                          <h4 className="text-xs font-bold text-white truncate">
                            {node.name}
                          </h4>
                          <p className="text-[11px] text-[#DF98FA] truncate">
                            {node.title}
                          </p>
                          <p className="text-[10px] text-[#8789A3] mt-0.5">
                            {node.era}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Interactive React Flow Tree */}
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[#8789A3] mb-2">
                  Interactive Silsila Network Map (Click any Wali node to switch profile)
                </h3>
                <div className="h-[420px] w-full rounded-2xl bg-[#040C23] border border-[#242F54] overflow-hidden">
                  <ReactFlow
                    nodes={nodes}
                    edges={edges}
                    fitView
                    onNodeClick={(_, node) => {
                      const found = allAuliya.find((a) => a.id === node.id);
                      if (found) handleSelectSaint(found.id);
                    }}
                  >
                    <Background color="#242F54" gap={20} />
                    <Controls />
                  </ReactFlow>
                </div>
              </div>
            </div>
          )}

          {/* TAB 6: BOOKS & MALFUZAT READER */}
          {activeTab === "books" && (
            <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6 space-y-4">
              <div>
                <span className="text-[11px] font-semibold text-[#DF98FA] uppercase tracking-wider">
                  Classical Sunni Works, Malfuzat & Fatawa
                </span>
                <h2 className="text-xl font-bold text-white">
                  Books & Treatises of {saint.name}
                </h2>
                <p className="text-xs text-[#8789A3] mt-0.5">
                  Explore authentic scholarly summaries, golden excerpts, and multi-chapter study notes.
                </p>
              </div>

              <div className="space-y-4">
                {saint.books.map((book) => (
                  <div
                    key={book.title}
                    className="p-5 rounded-2xl bg-[#091945] border border-[#242F54] space-y-3"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5">
                          <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#A44AFF]/20 text-[#DF98FA]">
                            {book.genre}
                          </span>
                          {book.language && (
                            <span className="text-[10px] font-semibold px-2.5 py-0.5 rounded-full bg-[#F9B091]/15 text-[#F9B091]">
                              {book.language}
                            </span>
                          )}
                          {book.yearOrEra && (
                            <span className="text-[10px] text-[#8789A3]">
                              · {book.yearOrEra}
                            </span>
                          )}
                        </div>
                        <h3 className="text-lg font-bold text-white mt-1.5">
                          {book.title}
                        </h3>
                      </div>
                      <p
                        className="font-arabic text-xl text-[#F9B091]"
                        dir="rtl"
                      >
                        {book.arabicOrUrduTitle}
                      </p>
                    </div>

                    <p className="text-xs text-[#8789A3] leading-relaxed">
                      {book.summary}
                    </p>

                    <div className="p-3.5 rounded-xl bg-[#121931] border-l-4 border-[#F9B091]">
                      <div className="flex items-center justify-between mb-1">
                        <p className="text-[11px] text-[#F9B091] font-semibold">
                          Golden Excerpt:
                        </p>
                        <button
                          onClick={() => copyText(book.title, book.excerpt)}
                          className="text-[11px] text-[#8789A3] hover:text-white flex items-center gap-1"
                        >
                          {copiedKey === book.title ? (
                            <>
                              <Check className="w-3 h-3 text-[#4ADE80]" /> Copied
                            </>
                          ) : (
                            <>
                              <Copy className="w-3 h-3" /> Copy Excerpt
                            </>
                          )}
                        </button>
                      </div>
                      <p className="text-xs text-white/90 italic">
                        &ldquo;{book.excerpt}&rdquo;
                      </p>
                    </div>

                    {book.chapters && book.chapters.length > 0 && (
                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-[11px] text-[#4ADE80] font-medium">
                          {book.chapters.length} Study Chapters Available
                        </span>
                        <button
                          onClick={() => {
                            setActiveBook(book);
                            setActiveChapterIdx(0);
                          }}
                          className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#DF98FA] to-[#9055FF] text-white text-xs font-bold shadow-md hover:opacity-95 flex items-center gap-1.5"
                        >
                          <BookOpen className="w-3.5 h-3.5" />
                          Open Book Reader
                        </button>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: INTERACTIVE LIVE MAPS & URS CALENDAR */}
          {activeTab === "map" && (
            <div className="space-y-5">
              {/* Interactive OpenStreetMap Shrine Explorer */}
              <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-[#4ADE80]">
                      Interactive Mazar Map & Geodesic Telemetry
                    </span>
                    <h2 className="text-xl font-bold text-white">
                      {saint.name} — {saint.city}, {saint.country}
                    </h2>
                    <p className="text-xs text-[#8789A3]">
                      Coordinates: {saint.lat.toFixed(4)}° N, {saint.lng.toFixed(4)}° E ·{" "}
                      <span className="text-[#4ADE80] font-semibold">
                        {saintDistanceKm.toLocaleString()} km ({Math.round(saintDistanceKm * 0.621371).toLocaleString()} mi)
                      </span>{" "}
                      from {city.name} (Bearing {saintBearing}° {bearingCardinal(saintBearing)})
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${saint.lat},${saint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#DF98FA] to-[#9055FF] text-white text-xs font-bold flex items-center gap-1.5"
                    >
                      <Navigation className="w-3.5 h-3.5" /> Google Maps
                    </a>
                    <a
                      href={`https://www.openstreetmap.org/?mlat=${saint.lat}&mlon=${saint.lng}#map=16/${saint.lat}/${saint.lng}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-xl bg-[#091945] border border-[#242F54] text-xs font-semibold text-white hover:border-[#A44AFF] flex items-center gap-1.5"
                    >
                      <ExternalLink className="w-3.5 h-3.5" /> OpenStreetMap
                    </a>
                  </div>
                </div>

                {/* Live Embedded OpenStreetMap Iframe */}
                <div className="h-80 w-full rounded-2xl overflow-hidden border border-[#242F54] bg-[#040C23]">
                  <iframe
                    key={saint.id}
                    title={`Live Map of ${saint.name}`}
                    src={osmEmbedUrl}
                    className="w-full h-full border-0"
                    loading="lazy"
                  />
                </div>

                {/* Quick Shrine Switcher Cards with Live Distance */}
                <div>
                  <h3 className="text-xs font-bold uppercase tracking-wider text-[#8789A3] mb-2.5">
                    All Sacred Dargahs — Tap to Center Map
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {allAuliya
                      .filter((a) => a.status === "Published")
                      .map((a) => {
                        const dist = haversineKm(city.lat, city.lng, a.lat, a.lng);
                        const brg = initialBearingDeg(city.lat, city.lng, a.lat, a.lng);
                        const isSelected = a.id === saint.id;
                        return (
                          <button
                            key={a.id}
                            onClick={() => handleSelectSaint(a.id)}
                            className={`p-3 rounded-2xl border text-left transition-all flex items-center justify-between gap-2 ${
                              isSelected
                                ? "bg-[#091945] border-[#4ADE80]"
                                : "bg-[#091945]/60 border-[#242F54] hover:border-[#A44AFF]/50"
                            }`}
                          >
                            <div className="min-w-0">
                              <p className="text-xs font-bold text-white truncate">
                                {a.name}
                              </p>
                              <p className="text-[11px] text-[#8789A3] truncate">
                                {a.city}, {a.country} · Urs: {a.ursLabel}
                              </p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-xs font-bold text-[#4ADE80] block">
                                {dist.toLocaleString()} km
                              </span>
                              <span className="text-[10px] text-[#DF98FA]">
                                {brg}° {bearingCardinal(brg)}
                              </span>
                            </div>
                          </button>
                        );
                      })}
                  </div>
                </div>
              </div>

              {/* Hijri Urs Calendar & Family Barsi Tracker */}
              <div className="rounded-3xl bg-[#121931] border border-[#242F54] p-6">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-white flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-[#F9B091]" />
                      Hijri Urs Calendar & Family Isal-e-Sawab (Barsi) Log
                    </h3>
                    <p className="text-xs text-[#8789A3]">
                      Current Hijri Date: {hijri.day} {hijri.monthName} {hijri.year} AH
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 bg-[#091945] p-1 rounded-xl border border-[#242F54]">
                    <span className="text-[11px] text-[#8789A3] px-2">Hilal Offset:</span>
                    {([-1, 0, 1] as const).map((offset) => (
                      <button
                        key={offset}
                        onClick={() => setHilalOffset(offset)}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                          hilalOffset === offset
                            ? "bg-[#A44AFF] text-white"
                            : "text-[#8789A3] hover:text-white"
                        }`}
                      >
                        {offset > 0 ? `+${offset}d` : `${offset}d`}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Add Family Barsi Form */}
                <div className="grid grid-cols-1 sm:grid-cols-5 gap-2.5 p-3.5 rounded-2xl bg-[#091945] border border-[#242F54] mb-4">
                  <input
                    type="text"
                    value={barsiName}
                    onChange={(e) => setBarsiName(e.target.value)}
                    placeholder="Marhoom Name..."
                    className="sm:col-span-2 bg-[#121931] border border-[#242F54] rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <input
                    type="text"
                    value={barsiRelation}
                    onChange={(e) => setBarsiRelation(e.target.value)}
                    placeholder="Relation (e.g. Grandfather)"
                    className="bg-[#121931] border border-[#242F54] rounded-xl px-3 py-2 text-xs text-white"
                  />
                  <div className="flex gap-1.5">
                    <input
                      type="number"
                      min={1}
                      max={30}
                      value={barsiDay}
                      onChange={(e) => setBarsiDay(Number(e.target.value))}
                      className="w-16 bg-[#121931] border border-[#242F54] rounded-xl px-2 py-2 text-xs text-white"
                    />
                    <select
                      value={barsiMonth}
                      onChange={(e) => setBarsiMonth(Number(e.target.value))}
                      className="flex-1 bg-[#121931] border border-[#242F54] rounded-xl px-2 py-2 text-xs text-white"
                    >
                      {HIJRI_MONTHS.map((m, idx) => (
                        <option key={m} value={idx + 1}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                  <button
                    onClick={() => {
                      if (!barsiName.trim()) return;
                      addFamilyBarsi({
                        personName: barsiName.trim(),
                        relation: barsiRelation.trim() || "Family",
                        hijriDay: barsiDay,
                        hijriMonth: barsiMonth,
                      });
                      setBarsiName("");
                      setBarsiRelation("");
                    }}
                    className="bg-gradient-to-r from-[#DF98FA] to-[#9055FF] text-white rounded-xl px-3 py-2 text-xs font-bold flex items-center justify-center gap-1"
                  >
                    <Plus className="w-3.5 h-3.5" /> Save Barsi
                  </button>
                </div>

                {familyBarsis.length > 0 && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {familyBarsis.map((b) => (
                      <div
                        key={b.id}
                        className="p-3 rounded-xl bg-[#091945]/60 border border-[#242F54] flex items-center justify-between"
                      >
                        <div>
                          <p className="text-xs font-bold text-white">{b.personName}</p>
                          <p className="text-[11px] text-[#8789A3]">
                            {b.relation} · Recite Surah Yaseen & Fatiha
                          </p>
                        </div>
                        <span className="text-xs font-semibold text-[#F9B091]">
                          {b.hijriDay} {HIJRI_MONTHS[b.hijriMonth - 1]}
                        </span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* GALLERY LIGHTBOX MODAL */}
      {lightboxItem && (
        <div
          onClick={() => setLightboxItem(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-3xl w-full rounded-3xl bg-[#121931] border border-[#A44AFF] overflow-hidden shadow-2xl"
          >
            <div className="relative h-80 sm:h-[420px] bg-[#040C23]">
              <img
                src={resolvePublicAssetUrl(lightboxItem.imageUrl)}
                alt={lightboxItem.title}
                style={{ objectPosition: lightboxItem.focalPoint || "50% 50%" }}
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setLightboxItem(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-[#040C23]/80 text-white hover:bg-[#A44AFF]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            <div className="p-5">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <span className="text-xs font-semibold text-[#DF98FA]">
                  {lightboxItem.architecturalStyle}
                </span>
                <span className="text-xs text-[#F9B091] font-semibold">
                  {lightboxItem.era}
                </span>
              </div>
              <h3 className="text-lg font-bold text-white mt-1">
                {lightboxItem.title}
              </h3>
              <p className="text-xs text-[#8789A3] mt-1 leading-relaxed">
                {lightboxItem.caption}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* BOOK CHAPTER READER MODAL */}
      {activeBook && (
        <div
          onClick={() => setActiveBook(null)}
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
        >
          <div
            onClick={(e) => e.stopPropagation()}
            className="max-w-2xl w-full rounded-3xl bg-[#121931] border border-[#A44AFF] p-6 space-y-4 shadow-2xl"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#A44AFF]/20 text-[#DF98FA]">
                  {activeBook.genre} · {activeBook.language || "Classical Text"}
                </span>
                <h3 className="text-xl font-bold text-white mt-1">
                  {activeBook.title}
                </h3>
                <p className="font-arabic text-lg text-[#F9B091]">
                  {activeBook.arabicOrUrduTitle}
                </p>
              </div>
              <button
                onClick={() => setActiveBook(null)}
                className="p-2 rounded-full bg-[#091945] text-[#8789A3] hover:text-white"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {activeBook.chapters && activeBook.chapters.length > 0 && (
              <>
                <div className="flex flex-wrap gap-1.5">
                  {activeBook.chapters.map((ch, idx) => (
                    <button
                      key={idx}
                      onClick={() => setActiveChapterIdx(idx)}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold ${
                        activeChapterIdx === idx
                          ? "bg-[#A44AFF] text-white"
                          : "bg-[#091945] text-[#8789A3] hover:text-white"
                      }`}
                    >
                      Chapter {idx + 1}
                    </button>
                  ))}
                </div>

                <div className="p-5 rounded-2xl bg-[#091945] border border-[#242F54] space-y-2">
                  <h4 className="text-sm font-bold text-[#F9B091]">
                    {activeBook.chapters[activeChapterIdx]?.title}
                  </h4>
                  <p className="text-xs sm:text-sm text-white/90 leading-relaxed">
                    {activeBook.chapters[activeChapterIdx]?.content}
                  </p>
                </div>

                <div className="flex items-center justify-between">
                  <button
                    disabled={activeChapterIdx === 0}
                    onClick={() => setActiveChapterIdx((i) => Math.max(0, i - 1))}
                    className="px-3 py-1.5 rounded-xl bg-[#091945] border border-[#242F54] text-xs text-white disabled:opacity-40 flex items-center gap-1"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" /> Previous Chapter
                  </button>
                  <span className="text-xs text-[#8789A3]">
                    Chapter {activeChapterIdx + 1} of {activeBook.chapters.length}
                  </span>
                  <button
                    disabled={activeChapterIdx + 1 >= activeBook.chapters.length}
                    onClick={() =>
                      setActiveChapterIdx((i) =>
                        Math.min(activeBook.chapters!.length - 1, i + 1)
                      )
                    }
                    className="px-3 py-1.5 rounded-xl bg-[#091945] border border-[#242F54] text-xs text-white disabled:opacity-40 flex items-center gap-1"
                  >
                    Next Chapter <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AuliyaPage() {
  return (
    <Suspense
      fallback={
        <div className="p-8 text-center text-sm text-[#8789A3]">
          Loading Auliya Allah Encyclopedia...
        </div>
      }
    >
      <AuliyaInner />
    </Suspense>
  );
}
