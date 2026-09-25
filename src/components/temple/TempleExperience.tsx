"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const TempleScene = dynamic(
  () => import("./TempleScene").then((m) => m.TempleScene),
  { ssr: false }
);

gsap.registerPlugin(ScrollTrigger);

export function TempleExperience() {
  const scrollProgressRef = useRef<number>(0);
  const chapterRef = useRef<number>(1);
  const percentTextRef = useRef<HTMLSpanElement>(null);
  const waypointTextRef = useRef<HTMLSpanElement>(null);
  const [currentChapter, setCurrentChapter] = useState(1);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Setup continuous smooth scrub across the entire 500vh pilgrimage journey
    const trigger = ScrollTrigger.create({
      trigger: "#temple-journey",
      start: "top top",
      end: "bottom bottom",
      scrub: 1.2,
      onUpdate: (self) => {
        scrollProgressRef.current = self.progress;
        
        // Fast direct DOM update to eliminate 60-120Hz React re-rendering jank
        if (percentTextRef.current) {
          percentTextRef.current.textContent = `${Math.round(self.progress * 100)}% COMPLETE`;
        }

        let nextChapter = 1;
        if (self.progress < 0.22) {
          nextChapter = 1;
        } else if (self.progress < 0.46) {
          nextChapter = 2;
        } else if (self.progress < 0.70) {
          nextChapter = 3;
        } else if (self.progress < 0.90) {
          nextChapter = 4;
        } else {
          nextChapter = 5;
        }

        // Only trigger React state change when crossing a chapter boundary (4 times total)
        if (nextChapter !== chapterRef.current) {
          chapterRef.current = nextChapter;
          setCurrentChapter(nextChapter);
          if (waypointTextRef.current) {
            waypointTextRef.current.textContent = `WAYPOINT 0${nextChapter} / 05`;
          }
        }
      },
    });

    return () => trigger.kill();
  }, []);

  return (
    <div
      id="temple-journey"
      className={`relative min-h-[500vh] bg-[#181411] text-[#f5efe6] selection:bg-[#d97706] selection:text-black font-sans transition-opacity duration-700 ${
        mounted ? "opacity-100" : "opacity-0"
      }`}
    >
      {/* 3D Temple Environment Canvas */}
      <TempleScene scrollProgress={scrollProgressRef} />

      {/* Top Atmospheric Header */}
      <header className="fixed top-0 left-0 right-0 z-30 flex justify-between items-center px-8 py-6 text-xs tracking-widest text-[#d4af37] font-mono pointer-events-none">
        <div className="flex items-center gap-3">
          <span className="w-2 h-2 rounded-full bg-[#f59e0b] shadow-[0_0_12px_#f59e0b] animate-pulse" />
          <span className="font-semibold tracking-[0.25em]">ATELIER SANCTUARY // PILGRIMAGE</span>
        </div>
        <div className="flex items-center gap-4 text-[#a8a29e]">
          <span ref={waypointTextRef}>WAYPOINT 0{currentChapter} / 05</span>
          <span ref={percentTextRef} className="text-[#f59e0b] font-mono">0% COMPLETE</span>
        </div>
      </header>

      {/* Side Progress Rail */}
      <aside
        className="fixed right-8 top-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col gap-5 items-end pointer-events-none select-none text-[10px] tracking-widest font-mono text-stone-500"
        aria-hidden="true"
      >
        <span className={currentChapter === 1 ? "text-[#f59e0b] font-bold" : ""}>01 // VALLEY APPROACH</span>
        <span className={currentChapter === 2 ? "text-[#f59e0b] font-bold" : ""}>02 // TORII PORTAL</span>
        <span className={currentChapter === 3 ? "text-[#f59e0b] font-bold" : ""}>03 // PROCESSIONAL WAY</span>
        <span className={currentChapter === 4 ? "text-[#f59e0b] font-bold" : ""}>04 // SACRED STEPS</span>
        <span className={currentChapter === 5 ? "text-[#f59e0b] font-bold" : ""}>05 // INNER SANCTUM</span>
      </aside>

      {/* CHAPTER 1: Outside Approach */}
      <section className="h-screen flex flex-col justify-between items-center pt-28 pb-16 relative z-10 pointer-events-none text-center px-6">
        <div className="max-w-3xl mx-auto pt-10">
          <span className="inline-block px-3.5 py-1 mb-4 rounded-full border border-amber-500/30 bg-amber-950/40 text-[#f59e0b] text-[11px] font-mono tracking-[0.25em] uppercase">
            Chapter 01 // Mountain Threshold
          </span>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-serif font-normal tracking-tight text-[#fdfbf7] drop-shadow-[0_12px_24px_rgba(0,0,0,0.8)]">
            THE ANCIENT PATH
          </h1>
          <p className="mt-5 text-lg sm:text-xl font-light text-stone-400 max-w-xl mx-auto leading-relaxed">
            Begin the journey at dawn. Morning mist rolls through the cedar valley as stone lanterns illuminate the processional way.
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-xs tracking-[0.3em] text-[#f59e0b]/70 font-mono animate-bounce">
          <span>↓ SCROLL TO ENTER THE TEMPLE</span>
        </div>
      </section>

      {/* CHAPTER 2: The Outer Portal */}
      <section className="h-screen flex items-center justify-start relative z-10 pointer-events-none px-8 sm:px-20">
        <div className="max-w-lg p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-amber-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <span className="text-[10px] font-mono text-[#f59e0b] tracking-[0.25em] uppercase block mb-2">
            Chapter 02 // The Boundary
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white mb-4 tracking-tight">
            The Torii Portal
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
            Pass beneath towering carved cedar timbers marking the threshold between the external world and the consecrated sacred ground.
          </p>
        </div>
      </section>

      {/* CHAPTER 3: Processional Colonnade */}
      <section className="h-screen flex items-center justify-end relative z-10 pointer-events-none px-8 sm:px-20">
        <div className="max-w-lg p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-amber-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)] text-right">
          <span className="text-[10px] font-mono text-[#f59e0b] tracking-[0.25em] uppercase block mb-2">
            Chapter 03 // Flanked by Fire
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white mb-4 tracking-tight">
            The Colonnade
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
            Gliding forward along ancient slate flagstones, flanked by rhythmic rows of monumental pillars and flickering flame lanterns.
          </p>
        </div>
      </section>

      {/* CHAPTER 4: Stone Steps */}
      <section className="h-screen flex items-center justify-start relative z-10 pointer-events-none px-8 sm:px-20">
        <div className="max-w-lg p-8 rounded-3xl bg-black/60 backdrop-blur-xl border border-amber-900/30 shadow-[0_20px_50px_rgba(0,0,0,0.8)]">
          <span className="text-[10px] font-mono text-[#f59e0b] tracking-[0.25em] uppercase block mb-2">
            Chapter 04 // The Ascension
          </span>
          <h2 className="text-3xl sm:text-5xl font-serif font-normal text-white mb-4 tracking-tight">
            Ascending the Steps
          </h2>
          <p className="text-sm sm:text-base text-stone-300 font-light leading-relaxed">
            Rise onto the elevated stone dais. The outdoor cool air gives way to the fragrant warmth of sandalwood incense and sacred silence.
          </p>
        </div>
      </section>

      {/* CHAPTER 5: The Inner Sanctum & Altar */}
      <section className="h-screen flex flex-col justify-center items-center relative z-10 pointer-events-none text-center px-6">
        <div className="max-w-2xl p-10 sm:p-12 rounded-3xl bg-black/75 backdrop-blur-2xl border border-[#d4af37]/30 shadow-[0_25px_60px_rgba(0,0,0,0.9)]">
          <span className="text-[11px] font-mono text-[#f59e0b] tracking-[0.3em] uppercase block mb-3">
            Chapter 05 // Consecration
          </span>
          <h2 className="text-4xl sm:text-6xl font-serif font-normal text-[#fffbeb] mb-5 tracking-tight">
            The Inner Sanctum
          </h2>
          <p className="text-base sm:text-lg text-stone-300 font-light leading-relaxed max-w-lg mx-auto mb-6">
            You have arrived at the sacred altar. Golden relics reflect the celestial god rays streaming down from the high skylight above.
          </p>
          <div className="text-xs font-mono text-[#f59e0b]/80 tracking-widest">
            PILGRIMAGE COMPLETE // SCROLL UP TO RETURN
          </div>
        </div>
      </section>
    </div>
  );
}
