"use client";

import { Canvas } from "@react-three/fiber";
import { useEffect, Suspense } from "react";
import { MacBook } from "./MacBook";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ContactShadows } from "@react-three/drei";

gsap.registerPlugin(ScrollTrigger);

function MacBookLoadingFallback() {
  return (
    <group position={[0, -0.55, 0]} rotation={[0.22, Math.PI, 0]} scale={1.1}>
      <mesh position={[0, 0, 0]}>
        <boxGeometry args={[2.2, 0.04, 1.5]} />
        <meshStandardMaterial color="#60a5fa" emissive="#2563eb" emissiveIntensity={0.5} wireframe />
      </mesh>
    </group>
  );
}

interface SceneProps {
  characterUrl?: string | null;
  displayMode?: "screen" | "hologram";
  onScreenClick?: () => void;
}

export function Scene({ characterUrl, displayMode = "screen", onScreenClick }: SceneProps) {
  useEffect(() => {
    const text1 = document.getElementById("text-1");
    const text2 = document.getElementById("text-2");
    const text3 = document.getElementById("text-3");

    const ctx = gsap.context(() => {
      if (text1) {
        gsap.to(text1, {
          opacity: 0,
          y: -40,
          scrollTrigger: {
            trigger: "#section1",
            start: "top bottom",
            end: "top 60%",
            scrub: true,
          },
        });
      }

      if (text2) {
        gsap.to(text2, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: "#section1",
            start: "top 60%",
            end: "top 20%",
            scrub: true,
          },
        });
      }

      if (text3) {
        gsap.to(text3, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: "#section2",
            start: "top 60%",
            end: "top 20%",
            scrub: true,
          },
        });
      }
    });

    return () => ctx.revert();
  }, []);

  return (
    <div className="fixed inset-0 z-0 pointer-events-auto">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 55 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        shadows
      >
        <ambientLight intensity={0.9} />
        <directionalLight intensity={4.5} position={[2, 4, 3]} castShadow />
        <directionalLight intensity={1.8} position={[-3, 1, 2]} color="#e0f2fe" />
        <Suspense fallback={<MacBookLoadingFallback />}>
          <MacBook
            characterUrl={characterUrl}
            displayMode={displayMode}
            onScreenClick={onScreenClick}
          />
        </Suspense>
        <ContactShadows opacity={0.32} position={[0, -1.05, 0]} scale={10} blur={2.2} />
      </Canvas>
    </div>
  );
}
