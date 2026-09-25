"use client";

import { Laptop, Orbit, Compass, Watch } from "lucide-react";

export type SceneryMode = "temple" | "titan" | "macbook" | "quantum";

interface ScenerySwitcherProps {
  currentMode: SceneryMode;
  onSelectMode: (mode: SceneryMode) => void;
}

export function ScenerySwitcher({ currentMode, onSelectMode }: ScenerySwitcherProps) {
  const sceneries = [
    {
      id: "temple" as SceneryMode,
      label: "Temple Sanctuary",
      tag: "Pilgrimage 3D",
      icon: Compass,
    },
    {
      id: "titan" as SceneryMode,
      label: "Titan Horology",
      tag: "Luxury 3D",
      icon: Watch,
    },
    {
      id: "macbook" as SceneryMode,
      label: "MacBook Pro M4",
      tag: "Product 3D",
      icon: Laptop,
    },
    {
      id: "quantum" as SceneryMode,
      label: "Quantum Core",
      tag: "Kinetic Shader",
      icon: Orbit,
    },
  ];

  return (
    <nav
      aria-label="3D Scenery Selector"
      className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 flex items-center gap-1.5 p-1.5 rounded-full bg-neutral-950/85 backdrop-blur-xl border border-white/20 shadow-2xl text-xs select-none max-w-[95vw]"
    >
      <div className="hidden sm:flex items-center px-3 text-[10px] uppercase font-mono tracking-widest text-neutral-400 border-r border-white/10">
        Scenery:
      </div>

      <div className="flex items-center gap-1">
        {sceneries.map((scenery) => {
          const Icon = scenery.icon;
          const isActive = currentMode === scenery.id;

          return (
            <button
              key={scenery.id}
              type="button"
              onClick={() => onSelectMode(scenery.id)}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-full font-medium transition-all duration-300 ${
                isActive
                  ? "bg-amber-400 text-neutral-950 shadow-md scale-100"
                  : "text-neutral-300 hover:text-white hover:bg-white/10 scale-95 hover:scale-100"
              }`}
            >
              <Icon className={`w-4 h-4 ${isActive ? "text-neutral-950" : "text-amber-400/80"}`} />
              <div className="flex flex-col items-start leading-none">
                <span className="text-xs font-semibold">{scenery.label}</span>
                <span
                  className={`text-[9px] uppercase tracking-wider font-mono ${
                    isActive ? "text-neutral-800" : "text-neutral-400"
                  }`}
                >
                  {scenery.tag}
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
