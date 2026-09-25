"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Eye, Clock, ShieldCheck, Sparkles } from "lucide-react";
import { type TitanViewKey } from "./TitanScene";

const TitanScene = dynamic(
  () => import("./TitanScene").then((m) => m.TitanScene),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

export function TitanExperience() {
  const scrollProgressRef = useRef<number>(0);
  const chapterRef = useRef<number>(1);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const timeDisplayRef = useRef<HTMLSpanElement>(null);

  const [activeView, setActiveView] = useState<TitanViewKey>("hero");
  const [overrideManual, setOverrideManual] = useState<boolean>(false);
  const [mounted, setMounted] = useState<boolean>(false);
  const manualTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Live ticking watch clock in the header
  useEffect(() => {
    setMounted(true);

    const updateClock = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      const s = String(now.getSeconds()).padStart(2, "0");
      if (timeDisplayRef.current) {
        timeDisplayRef.current.textContent = `${h}:${m}:${s} IST`;
      }
    };

    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, []);

  // GSAP ScrollTrigger for 500vh cinematic journey across 5 views
  useEffect(() => {
    const trigger = ScrollTrigger.create({
      trigger: "#titan-showcase",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.0,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;

        // High performance direct DOM text update
        if (percentTextRef.current) {
          percentTextRef.current.textContent = `${Math.round(self.progress * 100)}% COMPLETE`;
        }

        // Determine active view based on scroll progress if not in temporary manual override
        if (!overrideManual) {
          let nextView: TitanViewKey = "hero";
          let nextChapter = 1;

          if (self.progress < 0.2) {
            nextView = "hero";
            nextChapter = 1;
          } else if (self.progress < 0.42) {
            nextView = "dial";
            nextChapter = 2;
          } else if (self.progress < 0.65) {
            nextView = "crown";
            nextChapter = 3;
          } else if (self.progress < 0.85) {
            nextView = "strap";
            nextChapter = 4;
          } else {
            nextView = "caseback";
            nextChapter = 5;
          }

          if (nextChapter !== chapterRef.current) {
            chapterRef.current = nextChapter;
            setActiveView(nextView);
          }
        }
      },
    });

    return () => trigger.kill();
  }, [overrideManual]);

  // Handle direct view selection button click
  const handleSelectView = (viewKey: TitanViewKey) => {
    setActiveView(viewKey);
    setOverrideManual(true);

    // Scroll smoothly to matching chapter anchor
    const targets: Record<TitanViewKey, string> = {
      hero: "#titan-hero",
      dial: "#titan-dial",
      crown: "#titan-crown",
      strap: "#titan-strap",
      caseback: "#titan-caseback",
    };

    const targetEl = document.querySelector(targets[viewKey]);
    if (targetEl) {
      targetEl.scrollIntoView({ behavior: "smooth" });
    }

    if (manualTimerRef.current) clearTimeout(manualTimerRef.current);
    manualTimerRef.current = setTimeout(() => {
      setOverrideManual(false);
    }, 1800);
  };

  const viewButtons: { key: TitanViewKey; label: string; desc: string }[] = [
    { key: "hero", label: "01 Orbit", desc: "Full Silhouette" },
    { key: "dial", label: "02 Dial Macro", desc: "Guilloché & Hands" },
    { key: "crown", label: "03 Crown Edge", desc: "4.2mm Slim Case" },
    { key: "strap", label: "04 Strap Clasp", desc: "Italian Leather" },
    { key: "caseback", label: "05 Caseback", desc: "Exhibition Rotor" },
  ];

  return (
    <div
      id="titan-showcase"
      className={`relative min-h-[500vh] bg-gradient-to-b from-[#111624] via-[#0f1420] to-[#0a0d14] text-[#f1f5f9] selection:bg-[#e6b85c] selection:text-black font-sans transition-opacity duration-700 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* Central Studio Glow to illuminate the scene & eliminate dark murky void */}
      <div className="fixed inset-0 pointer-events-none z-0 bg-[radial-gradient(ellipse_75%_55%_at_50%_40%,rgba(56,189,248,0.12),rgba(230,184,92,0.08),transparent_70%)]" />

      {/* 3D Titan Watch Canvas */}
      <TitanScene
        scrollProgress={scrollProgressRef}
        activeView={activeView}
        overrideManualView={overrideManual}
      />

      {/* Atmospheric Top Navigation Bar */}
      <header className="fixed top-0 left-0 right-0 z-30 flex justify-between items-center px-6 sm:px-10 py-5 text-xs font-mono pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="w-2.5 h-2.5 rounded-full bg-[#f59e0b] shadow-[0_0_14px_#f59e0b] animate-pulse" />
          <span className="font-semibold tracking-[0.28em] text-[#f8fafc] text-sm">
            TITAN <span className="text-[#f59e0b]">EDGE</span> {"// HOROLOGY"}
          </span>
          <span className="hidden sm:inline-block px-2.5 py-0.5 rounded-full border border-amber-400/35 bg-amber-400/15 text-[10px] text-amber-200 tracking-widest font-semibold">
            CALIBRE T-900
          </span>
        </div>

        <div className="flex items-center gap-5 text-slate-300">
          <div className="flex items-center gap-1.5 font-mono text-[11px] text-amber-300">
            <Clock className="w-3.5 h-3.5 text-amber-400" />
            <span ref={timeDisplayRef}>12:00:00 IST</span>
          </div>
          <span ref={percentTextRef} className="text-[#f59e0b] font-mono text-xs font-bold">
            0% COMPLETE
          </span>
        </div>
      </header>

      {/* Interactive Quick-View Selector Pill (HUD Dock) */}
      <nav
        aria-label="Titan Camera Views"
        className="fixed top-20 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 p-1.5 rounded-full bg-slate-900/90 backdrop-blur-2xl border border-amber-400/40 shadow-[0_10px_35px_rgba(0,0,0,0.7)] text-xs select-none max-w-[95vw]"
      >
        <div className="hidden sm:flex items-center gap-1 px-3 text-[10px] uppercase font-mono tracking-widest text-amber-300 border-r border-white/15">
          <Eye className="w-3.5 h-3.5 mr-1 text-amber-400" />
          Views:
        </div>
        <div className="flex items-center gap-1 overflow-x-auto py-0.5">
          {viewButtons.map((btn) => {
            const isActive = activeView === btn.key;
            return (
              <button
                key={btn.key}
                type="button"
                onClick={() => handleSelectView(btn.key)}
                className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full font-medium transition-all duration-300 pointer-events-auto cursor-pointer ${
                  isActive
                    ? "bg-[#f59e0b] text-slate-950 font-bold shadow-[0_0_16px_rgba(245,158,11,0.5)] scale-100"
                    : "text-slate-200 hover:text-white hover:bg-white/15 scale-95 hover:scale-100"
                }`}
              >
                <span className="text-[11px] tracking-wide">{btn.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Right Side Craftsmanship Rail */}
      <aside
        className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden lg:flex flex-col gap-6 items-end pointer-events-none select-none text-[10px] tracking-widest font-mono text-slate-400"
        aria-hidden="true"
      >
        <div className={`transition-all duration-300 ${activeView === "hero" ? "text-[#f59e0b] font-bold scale-105" : ""}`}>
          {"01 // ORBIT PERSPECTIVE"}
        </div>
        <div className={`transition-all duration-300 ${activeView === "dial" ? "text-[#f59e0b] font-bold scale-105" : ""}`}>
          {"02 // MACRO DIAL & HANDS"}
        </div>
        <div className={`transition-all duration-300 ${activeView === "crown" ? "text-[#f59e0b] font-bold scale-105" : ""}`}>
          {"03 // SLIM CROWN EDGE"}
        </div>
        <div className={`transition-all duration-300 ${activeView === "strap" ? "text-[#f59e0b] font-bold scale-105" : ""}`}>
          {"04 // ARTICULATED STRAP"}
        </div>
        <div className={`transition-all duration-300 ${activeView === "caseback" ? "text-[#f59e0b] font-bold scale-105" : ""}`}>
          {"05 // EXHIBITION ROTOR"}
        </div>
      </aside>

      {/* ======================================================== */}
      {/* SECTION 1: HERO VIEW (ORBIT & OVERVIEW)                   */}
      {/* ======================================================== */}
      <section
        id="titan-hero"
        className="h-screen flex flex-col justify-between items-center pt-28 pb-16 relative z-10 pointer-events-none text-center px-6"
      >
        <div className="max-w-3xl mx-auto pt-8">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 mb-4 rounded-full border border-amber-400/40 bg-amber-950/50 text-[#f59e0b] text-[11px] font-mono tracking-[0.25em] uppercase shadow-lg">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            Masterpiece In Aerospace Titanium
          </div>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-normal tracking-tight text-white drop-shadow-[0_12px_30px_rgba(0,0,0,0.9)]">
            TITAN <span className="font-serif italic font-light text-[#f59e0b]">EDGE</span>
          </h1>
          <p className="mt-4 text-lg sm:text-xl font-light text-slate-200 max-w-xl mx-auto leading-relaxed drop-shadow">
            Ultra-thin mechanical luxury engineered with Grade 5 titanium, sunburst obsidian dial, dauphine hands, and flying tourbillon.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-xs tracking-[0.3em] text-[#f59e0b] font-mono animate-bounce font-semibold">
          <span>↓ SCROLL TO TOUR IN 3D</span>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 2: MACRO DIAL & TOURBILLON                       */}
      {/* ======================================================== */}
      <section
        id="titan-dial"
        className="h-screen flex items-center justify-start relative z-10 pointer-events-none px-6 sm:px-16 lg:px-24"
      >
        <div className="max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-amber-400/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <span className="text-[10px] font-mono text-[#f59e0b] tracking-[0.25em] uppercase block mb-2 font-semibold">
            {"View 02 // Micro-Mechanical Heart"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-white mb-3 tracking-tight">
            Guilloché Dial & Hands
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed mb-4">
            Camera glides in close to inspect the midnight concentric guilloché dial, gold dauphine hands, sweeping seconds, date aperture at 3 o&apos;clock, and 28,800 VPH tourbillon escapement.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700 text-[11px] font-mono text-slate-300">
            <div>
              <span className="text-amber-300 block font-bold text-sm">28,800 VPH</span>
              Escapement Frequency
            </div>
            <div>
              <span className="text-amber-300 block font-bold text-sm">Real-Time</span>
              Sweeping Seconds
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 3: CROWN & SLIM EDGE SILHOUETTE                  */}
      {/* ======================================================== */}
      <section
        id="titan-crown"
        className="h-screen flex items-center justify-end relative z-10 pointer-events-none px-6 sm:px-16 lg:px-24"
      >
        <div className="max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-amber-400/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)] text-right">
          <span className="text-[10px] font-mono text-[#f59e0b] tracking-[0.25em] uppercase block mb-2 font-semibold">
            {"View 03 // Ultra-Slim Architecture"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-white mb-3 tracking-tight">
            Fluted Crown & Profile
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed mb-4">
            Raking perspective reveals the ultra-thin 4.2mm profile, diamond-turned fluted crown, royal blue sapphire cabochon, and ergonomic downward lug curvature.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700 text-[11px] font-mono text-slate-300 text-left">
            <div>
              <span className="text-amber-300 block font-bold text-sm">4.2 mm</span>
              Case Thickness
            </div>
            <div>
              <span className="text-amber-300 block font-bold text-sm">Grade 5</span>
              Titanium Alloy
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 4: ARTICULATED LEATHER STRAP & CLASP             */}
      {/* ======================================================== */}
      <section
        id="titan-strap"
        className="h-screen flex items-center justify-start relative z-10 pointer-events-none px-6 sm:px-16 lg:px-24"
      >
        <div className="max-w-md p-8 sm:p-10 rounded-3xl bg-slate-900/85 backdrop-blur-2xl border border-amber-400/35 shadow-[0_20px_60px_rgba(0,0,0,0.85)]">
          <span className="text-[10px] font-mono text-[#f59e0b] tracking-[0.25em] uppercase block mb-2 font-semibold">
            {"View 04 // Hand-Crafted Bracelet"}
          </span>
          <h2 className="text-3xl sm:text-4xl font-normal text-white mb-3 tracking-tight">
            Italian Leather & Clasp
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed mb-4">
            Angled perspective focuses on the hand-finished Italian leather strap with precision perimeter stitching, contoured wrist curvature, and solid titanium deployant buckle.
          </p>
          <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-700 text-[11px] font-mono text-slate-300">
            <div>
              <span className="text-amber-300 block font-bold text-sm">Calfskin</span>
              Hand-Stitched Leather
            </div>
            <div>
              <span className="text-amber-300 block font-bold text-sm">Deployant</span>
              Titanium Clasp
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* SECTION 5: EXHIBITION CASEBACK & SKELETON ROTOR          */}
      {/* ======================================================== */}
      <section
        id="titan-caseback"
        className="h-screen flex flex-col justify-center items-center relative z-10 pointer-events-none text-center px-6"
      >
        <div className="max-w-xl p-10 sm:p-12 rounded-3xl bg-slate-900/90 backdrop-blur-2xl border border-[#f59e0b]/40 shadow-[0_25px_70px_rgba(0,0,0,0.9)]">
          <span className="text-[11px] font-mono text-[#f59e0b] tracking-[0.3em] uppercase block mb-3 font-semibold">
            {"View 05 // Exhibition Caseback"}
          </span>
          <h2 className="text-4xl sm:text-5xl font-normal text-white mb-4 tracking-tight">
            Exhibition Rotor & Jewels
          </h2>
          <p className="text-sm sm:text-base text-slate-200 font-light leading-relaxed max-w-lg mx-auto mb-6">
            The watch rotates 180° to present the sapphire exhibition caseback with Côtes de Genève striping. Observe the swinging 21K rose-gold skeleton rotor moving dynamically with physical inertia over ruby bearings.
          </p>
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-amber-400/40 bg-amber-400/15 text-xs font-mono text-amber-200 font-semibold">
            <ShieldCheck className="w-4 h-4 text-amber-400" />
            {"21 JEWELS // 42-HOUR POWER RESERVE // 30M WATER RESIST"}
          </div>
        </div>
      </section>
    </div>
  );
}
