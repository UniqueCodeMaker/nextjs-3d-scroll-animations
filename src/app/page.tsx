"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { ScenerySwitcher, type SceneryMode } from "@/components/ScenerySwitcher";
import { SmoothScrollProvider } from "@/components/SmoothScrollProvider";

const TempleExperience = dynamic(
  () => import("@/components/temple/TempleExperience").then((m) => m.TempleExperience),
  { ssr: false }
);

const TitanExperience = dynamic(
  () => import("@/components/titan/TitanExperience").then((m) => m.TitanExperience),
  { ssr: false }
);

const MacBookExperience = dynamic(
  () => import("@/components/MacBookExperience").then((m) => m.MacBookExperience),
  { ssr: false }
);

const QuantumExperience = dynamic(
  () => import("@/components/quantum/QuantumScene").then((m) => m.QuantumExperience),
  { ssr: false }
);

export default function Home() {
  const [mode, setMode] = useState<SceneryMode>("titan");

  useEffect(() => {
    // Prefetch all scene bundles and GLB models in background after initial render
    const timer = setTimeout(() => {
      import("@/components/titan/TitanExperience");
      import("@/components/temple/TempleExperience");
      import("@/components/MacBookExperience");
      import("@/components/quantum/QuantumScene");
      import("@react-three/drei").then(({ useGLTF }) => {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
        useGLTF.preload(`${basePath}/assets/Macbook_Top.glb`);
        useGLTF.preload(`${basePath}/assets/Macbook_Bottom.glb`);
      });
    }, 400);

    return () => clearTimeout(timer);
  }, []);

  const [transitioning, setTransitioning] = useState(false);

  const handleSelectMode = (newMode: SceneryMode) => {
    if (newMode === mode) return;
    setTransitioning(true);
    setTimeout(() => {
      setMode(newMode);
      if (typeof window !== "undefined") {
        window.scrollTo({ top: 0, behavior: "instant" });
      }
      setTimeout(() => {
        setTransitioning(false);
      }, 50);
    }, 120);
  };

  return (
    <SmoothScrollProvider>
      <main className={`relative min-h-screen transition-opacity duration-300 ${transitioning ? "opacity-20" : "opacity-100"}`}>
        {mode === "titan" && <TitanExperience key="titan" />}
        {mode === "temple" && <TempleExperience key="temple" />}
        {mode === "macbook" && <MacBookExperience key="macbook" />}
        {mode === "quantum" && <QuantumExperience key="quantum" />}

        <ScenerySwitcher currentMode={mode} onSelectMode={handleSelectMode} />
      </main>
    </SmoothScrollProvider>
  );
}
