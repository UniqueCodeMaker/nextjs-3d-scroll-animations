"use client";

import dynamic from "next/dynamic";
import { useState, useRef, type ChangeEvent } from "react";
import { CHARACTER_PRESETS } from "@/lib/character-presets";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
});

export function MacBookExperience() {
  const [characterUrl, setCharacterUrl] = useState<string>(CHARACTER_PRESETS[0].dataUrl);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCharacterUrl(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleTriggerUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative min-h-[380vh] bg-[#f8fafc] text-gray-900 selection:bg-gray-900 selection:text-white">
      {/* Hidden File Input for Character Upload */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
        aria-label="Upload character image"
      />

      {/* 3D Canvas */}
      <Scene
        characterUrl={characterUrl}
        displayMode="screen"
        onScreenClick={handleTriggerUpload}
      />

      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-5 text-xs tracking-widest text-gray-500 font-medium uppercase pointer-events-none">
        <span className="font-semibold text-gray-900 tracking-wider">MacBook Pro 16″</span>
        <span className="text-gray-500">Apple Silicon M4</span>
      </header>

      {/* Hero Section */}
      <section
        id="hero"
        className="h-screen flex flex-col justify-between items-center pt-28 pb-16 relative z-10 pointer-events-none text-center px-6"
      >
        <div id="text-1" className="max-w-4xl mx-auto pt-10">
          <p className="text-xs font-semibold tracking-widest uppercase text-blue-600 mb-3">
            Supercharged by M4
          </p>
          <h1 className="text-6xl sm:text-8xl font-medium tracking-tight text-gray-950 mb-3">
            MacBook Pro M4
          </h1>
          <p className="text-2xl sm:text-3xl font-light text-gray-500">
            Interactive Character Experience
          </p>
        </div>

        <div className="flex flex-col items-center gap-2 text-xs tracking-widest text-gray-400 font-medium animate-bounce">
          <span>↓ SCROLL TO EXPLORE M4</span>
        </div>
      </section>

      {/* Section 1 - Display */}
      <section
        id="section1"
        className="h-screen flex items-center justify-start relative z-10 pointer-events-none px-8 sm:px-20"
      >
        <div
          id="text-2"
          className="max-w-lg opacity-0 translate-y-8 transition-transform duration-700 bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-xl"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-600 block mb-2">
            01 / Liquid Retina XDR
          </span>
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 mb-4">
            Living Display with Motion.
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Your character breathes, floats, and reacts dynamically to cursor movements in real-time on the Liquid Retina XDR screen. Click the screen anytime to upload a custom character image.
          </p>
        </div>
      </section>

      {/* Section 2 - Performance */}
      <section
        id="section2"
        className="h-screen flex items-center justify-end relative z-10 pointer-events-none px-8 sm:px-20"
      >
        <div
          id="text-3"
          className="max-w-lg ml-auto opacity-0 translate-y-8 transition-transform duration-700 bg-white/80 backdrop-blur-md p-8 rounded-3xl border border-gray-100 shadow-xl text-right"
        >
          <span className="text-xs font-semibold tracking-widest uppercase text-blue-600 block mb-2">
            02 / M4 Pro & M4 Max
          </span>
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 mb-4">
            Phenomenal Power.
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Next-generation GPU with hardware-accelerated ray tracing and Neural Engine delivering jaw-dropping performance and efficiency.
          </p>
        </div>
      </section>

      {/* Section 3 - Outro */}
      <section className="h-screen flex flex-col justify-center items-center relative z-10 pointer-events-none text-center px-6">
        <div className="max-w-xl p-10 bg-white/90 backdrop-blur-lg rounded-3xl border border-gray-100 shadow-2xl">
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 mb-4">
            Ready for Everything.
          </h2>
          <p className="text-base text-gray-500 font-light mb-6">
            Upload any character or explore the Titan Horology, Temple Sanctuary, and Quantum Core using the dock below.
          </p>
        </div>
      </section>
    </div>
  );
}
