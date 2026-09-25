"use client";

import dynamic from "next/dynamic";
import { useState, useRef, type ChangeEvent } from "react";
import { Upload, Sparkles, Monitor, Layers } from "lucide-react";
import { CHARACTER_PRESETS, type CharacterPreset } from "@/lib/character-presets";

const Scene = dynamic(() => import("./Scene").then((m) => m.Scene), {
  ssr: false,
});

export function MacBookExperience() {
  const [characterUrl, setCharacterUrl] = useState<string>(CHARACTER_PRESETS[0].dataUrl);
  const [selectedPreset, setSelectedPreset] = useState<string>(CHARACTER_PRESETS[0].id);
  const [customFileName, setCustomFileName] = useState<string | null>(null);
  const [displayMode, setDisplayMode] = useState<"screen" | "hologram">("screen");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCustomFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      if (result) {
        setCharacterUrl(result);
        setSelectedPreset("custom");
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleSelectPreset = (preset: CharacterPreset) => {
    setSelectedPreset(preset.id);
    setCharacterUrl(preset.dataUrl);
    setCustomFileName(null);
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
        displayMode={displayMode}
        onScreenClick={handleTriggerUpload}
      />

      {/* Top Navbar */}
      <header className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-5 text-xs tracking-widest text-gray-500 font-medium uppercase pointer-events-none">
        <span className="font-semibold text-gray-900 tracking-wider">MacBook Pro 16″</span>
        <span className="text-gray-500">Apple Silicon M4</span>
      </header>

      {/* Interactive Character Control Dock */}
      <div className="fixed top-16 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2 max-w-[95vw]">
        <div className="flex items-center gap-2 p-2 rounded-2xl bg-white/85 backdrop-blur-xl border border-gray-200/80 shadow-2xl">
          {/* Direct File Upload Button */}
          <button
            type="button"
            onClick={handleTriggerUpload}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md transition-all active:scale-95 cursor-pointer"
          >
            <Upload className="w-4 h-4" />
            <span>Upload Image</span>
          </button>

          <div className="h-6 w-px bg-gray-200" />

          {/* Preset Characters */}
          <div className="flex items-center gap-1">
            {CHARACTER_PRESETS.map((preset) => {
              const isSelected = selectedPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => handleSelectPreset(preset)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                    isSelected
                      ? "bg-gray-900 text-white shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>{preset.name}</span>
                </button>
              );
            })}
          </div>

          <div className="h-6 w-px bg-gray-200" />

          {/* Display Mode Toggle */}
          <div className="flex items-center gap-1 bg-gray-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => setDisplayMode("screen")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                displayMode === "screen"
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Screen</span>
            </button>
            <button
              type="button"
              onClick={() => setDisplayMode("hologram")}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                displayMode === "hologram"
                  ? "bg-white text-blue-600 shadow-sm font-semibold"
                  : "text-gray-500 hover:text-gray-800"
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>3D Hologram</span>
            </button>
          </div>

          {/* Active Character Thumbnail Badge */}
          <div className="h-6 w-px bg-gray-200" />
          <div className="flex items-center gap-2 pl-1 pr-2 py-0.5 rounded-lg bg-gray-50 border border-gray-200/60 text-xs">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={characterUrl}
              alt="Active Character"
              className="w-6 h-6 object-contain rounded bg-gray-900/10 p-0.5 border border-gray-200"
            />
            <span className="font-semibold text-gray-800 max-w-[110px] truncate text-[11px]">
              {customFileName ? customFileName : selectedPreset.toUpperCase()}
            </span>
          </div>
        </div>

        {/* Small Interaction Hint */}
        <div className="text-[10px] tracking-wider text-gray-500 font-mono bg-white/70 backdrop-blur-md px-3 py-0.5 rounded-full border border-gray-100 shadow-sm">
          💡 Click directly on the MacBook display to upload your character
        </div>
      </div>

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
            Your uploaded character breathes, floats, and reacts dynamically to cursor movements in real-time on the Liquid Retina XDR screen.
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
            02 / 3D Holographic Projection
          </span>
          <h2 className="text-4xl sm:text-5xl font-medium tracking-tight text-gray-950 mb-4">
            Pop-Out 3D Hologram.
          </h2>
          <p className="text-lg text-gray-600 font-light leading-relaxed">
            Switch to 3D Hologram mode above to pop your character out of the display and watch it hover in 3D space with glowing pedestal rings.
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
