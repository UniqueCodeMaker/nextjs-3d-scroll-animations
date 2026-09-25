"use client";

import { useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Float, Sparkles, ContactShadows, MeshDistortMaterial } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect } from "react";

gsap.registerPlugin(ScrollTrigger);

function KineticArtifact() {
  const coreRef = useRef<THREE.Mesh>(null);
  const ring1Ref = useRef<THREE.Mesh>(null);
  const ring2Ref = useRef<THREE.Mesh>(null);
  const ring3Ref = useRef<THREE.Mesh>(null);
  const groupRef = useRef<THREE.Group>(null);

  useEffect(() => {
    if (!groupRef.current) return;

    const ctx = gsap.context(() => {
      // ScrollTrigger timeline for Section 1
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#quantum-section-1",
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        })
        .to(groupRef.current!.position, {
          x: 1.6,
          y: 0.2,
          z: 0.5,
          ease: "power2.inOut",
        })
        .to(
          groupRef.current!.rotation,
          {
            x: Math.PI * 0.75,
            y: Math.PI * 0.9,
            z: 0.4,
            ease: "power2.inOut",
          },
          0
        );

      // ScrollTrigger timeline for Section 2
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#quantum-section-2",
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        })
        .to(groupRef.current!.position, {
          x: -1.6,
          y: -0.2,
          z: 1.0,
          ease: "power2.inOut",
        })
        .to(
          groupRef.current!.rotation,
          {
            x: Math.PI * 1.5,
            y: -Math.PI * 0.6,
            z: -0.8,
            ease: "power2.inOut",
          },
          0
        );

      // ScrollTrigger timeline for Section 3
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#quantum-section-3",
            start: "top bottom",
            end: "top top",
            scrub: 1,
          },
        })
        .to(groupRef.current!.position, {
          x: 0,
          y: 0,
          z: -0.5,
          ease: "power2.inOut",
        })
        .to(
          groupRef.current!.scale,
          {
            x: 1.4,
            y: 1.4,
            z: 1.4,
            ease: "power2.inOut",
          },
          0
        );
    });

    return () => ctx.revert();
  }, []);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (coreRef.current) {
      coreRef.current.rotation.x = t * 0.4;
      coreRef.current.rotation.y = t * 0.6;
    }
    if (ring1Ref.current) {
      ring1Ref.current.rotation.x = t * 0.8;
      ring1Ref.current.rotation.y = t * 0.3;
    }
    if (ring2Ref.current) {
      ring2Ref.current.rotation.y = -t * 0.7;
      ring2Ref.current.rotation.z = t * 0.5;
    }
    if (ring3Ref.current) {
      ring3Ref.current.rotation.z = t * 0.9;
      ring3Ref.current.rotation.x = -t * 0.4;
    }
  });

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      <Float speed={2.5} rotationIntensity={0.6} floatIntensity={0.8}>
        {/* Central Quantum Core */}
        <mesh ref={coreRef} castShadow receiveShadow>
          <icosahedronGeometry args={[1.05, 4]} />
          <MeshDistortMaterial
            color="#22d3ee"
            emissive="#0891b2"
            emissiveIntensity={0.35}
            roughness={0.12}
            metalness={0.85}
            distort={0.38}
            speed={2.2}
          />
        </mesh>

        {/* Orbit Ring 1 - Cyan */}
        <mesh ref={ring1Ref}>
          <torusGeometry args={[1.65, 0.035, 24, 100]} />
          <meshStandardMaterial
            color="#67e8f9"
            emissive="#06b6d4"
            emissiveIntensity={0.8}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Orbit Ring 2 - Violet */}
        <mesh ref={ring2Ref}>
          <torusGeometry args={[2.05, 0.03, 24, 100]} />
          <meshStandardMaterial
            color="#c084fc"
            emissive="#9333ea"
            emissiveIntensity={0.7}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Orbit Ring 3 - Amber Gold */}
        <mesh ref={ring3Ref}>
          <torusGeometry args={[2.45, 0.025, 24, 100]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.6}
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
      </Float>

      <ContactShadows
        position={[0, -2.4, 0]}
        opacity={0.6}
        scale={10}
        blur={2.5}
        far={6}
        color="#0891b2"
      />
    </group>
  );
}

function DynamicLights() {
  const lightRef = useRef<THREE.PointLight>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    if (lightRef.current) {
      lightRef.current.position.x = Math.sin(t * 0.8) * 4;
      lightRef.current.position.y = Math.cos(t * 0.6) * 3;
      lightRef.current.position.z = Math.sin(t * 0.5) * 3 + 2;
    }
  });

  return (
    <>
      <ambientLight intensity={0.4} />
      <directionalLight position={[6, 8, 5]} intensity={2.5} color="#e0f2fe" castShadow />
      <directionalLight position={[-6, -4, -3]} intensity={1.2} color="#f472b6" />
      <pointLight ref={lightRef} intensity={3.5} distance={12} color="#38bdf8" />
      <pointLight position={[0, -2, 2]} intensity={1.8} distance={8} color="#a855f7" />
    </>
  );
}

export function QuantumScene() {
  useEffect(() => {
    // Reveal text sections smoothly
    const t1 = document.getElementById("q-text-1");
    const t2 = document.getElementById("q-text-2");
    const t3 = document.getElementById("q-text-3");
    const t4 = document.getElementById("q-text-4");

    const ctx = gsap.context(() => {
      if (t1) {
        gsap.to(t1, {
          opacity: 0,
          scrollTrigger: {
            trigger: "#quantum-section-1",
            start: "top bottom",
            end: "top 40%",
            scrub: true,
          },
        });
      }
      if (t2) {
        gsap.to(t2, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: "#quantum-section-1",
            start: "top 60%",
            end: "top 20%",
            scrub: true,
          },
        });
      }
      if (t3) {
        gsap.to(t3, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: "#quantum-section-2",
            start: "top 60%",
            end: "top 20%",
            scrub: true,
          },
        });
      }
      if (t4) {
        gsap.to(t4, {
          opacity: 1,
          y: 0,
          scrollTrigger: {
            trigger: "#quantum-section-3",
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
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 6.2], fov: 48 }}
        dpr={[1, 1.5]}
        gl={{ antialias: true, powerPreference: "high-performance", alpha: false }}
      >
        <color attach="background" args={["#030712"]} />
        <DynamicLights />
        <KineticArtifact />
        <Sparkles count={80} scale={10} size={2.4} speed={0.3} opacity={0.6} color="#38bdf8" />
        <Sparkles count={40} scale={8} size={2.8} speed={0.2} opacity={0.4} color="#f472b6" />
      </Canvas>
    </div>
  );
}

export function QuantumExperience() {
  return (
    <div className="relative min-h-[400vh] bg-[#030712] text-white selection:bg-cyan-500 selection:text-black">
      {/* 3D Canvas Background */}
      <QuantumScene />

      {/* Top HUD */}
      <header className="fixed top-0 left-0 right-0 z-20 flex justify-between items-center px-8 py-6 text-xs tracking-widest text-cyan-400/80 font-mono pointer-events-none">
        <span className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          KINETIC ENGINE // SCENERY 02
        </span>
        <span className="opacity-70">SCROLL SENSITIVE 3D CORE</span>
      </header>

      {/* Hero Section */}
      <section
        id="quantum-hero"
        className="h-screen flex flex-col items-center justify-between py-24 relative z-10 pointer-events-none text-center px-6"
      >
        <div id="q-text-1" className="max-w-4xl mx-auto pt-8">
          <div className="inline-block px-3 py-1 mb-4 rounded-full border border-cyan-500/30 bg-cyan-950/40 text-cyan-300 text-xs font-mono tracking-widest uppercase">
            01 / Quantum Displacement
          </div>
          <h1 className="text-6xl sm:text-8xl font-black tracking-tighter bg-gradient-to-b from-white via-cyan-100 to-cyan-500 bg-clip-text text-transparent">
            KINETIC FLUIDITY
          </h1>
          <p className="mt-4 text-xl sm:text-2xl font-light text-cyan-200/60 max-w-xl mx-auto">
            Real-time procedural geometry animated by scroll velocity and physics.
          </p>
        </div>
        <div className="flex flex-col items-center gap-2 text-xs tracking-widest text-cyan-400/60 font-mono animate-bounce">
          <span>↓ SCROLL TO DIRECT MOTION</span>
        </div>
      </section>

      {/* Section 1 */}
      <section
        id="quantum-section-1"
        className="h-screen flex items-center justify-start relative z-10 pointer-events-none px-8 sm:px-16"
      >
        <div
          id="q-text-2"
          className="max-w-md opacity-0 translate-y-8 transition-transform duration-700 p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-cyan-500/20 shadow-2xl"
        >
          <span className="text-xs font-mono text-cyan-400 tracking-widest uppercase block mb-2">
            02 / Orbital Mechanics
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Multi-Axis Dispersion
          </h2>
          <p className="text-base text-cyan-100/70 leading-relaxed font-light">
            Each gyroscopic ring calculates dynamic angular momentum while preserving depth and specular reflections.
          </p>
        </div>
      </section>

      {/* Section 2 */}
      <section
        id="quantum-section-2"
        className="h-screen flex items-center justify-end relative z-10 pointer-events-none px-8 sm:px-16"
      >
        <div
          id="q-text-3"
          className="max-w-md opacity-0 translate-y-8 transition-transform duration-700 p-8 rounded-2xl bg-black/40 backdrop-blur-md border border-purple-500/20 shadow-2xl text-right"
        >
          <span className="text-xs font-mono text-purple-400 tracking-widest uppercase block mb-2">
            03 / Distortion Field
          </span>
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Dynamic PBR Surface
          </h2>
          <p className="text-base text-purple-100/70 leading-relaxed font-light">
            Simplex noise algorithms ripple across the central core mesh in sync with frame delta and user interactions.
          </p>
        </div>
      </section>

      {/* Section 3 */}
      <section
        id="quantum-section-3"
        className="h-screen flex flex-col items-center justify-center relative z-10 pointer-events-none text-center px-6"
      >
        <div
          id="q-text-4"
          className="max-w-2xl opacity-0 translate-y-8 transition-transform duration-700 p-10 rounded-3xl bg-black/60 backdrop-blur-xl border border-white/10 shadow-2xl"
        >
          <span className="text-xs font-mono text-amber-400 tracking-widest uppercase block mb-3">
            04 / Spatial Synthesis
          </span>
          <h2 className="text-4xl sm:text-6xl font-black tracking-tight text-white mb-4">
            Limitless Horizons
          </h2>
          <p className="text-lg text-gray-300 font-light max-w-lg mx-auto mb-6">
            Compare this kinetic scenery with the MacBook Pro showcase or the Architectural Residence anytime using the scenery switcher below.
          </p>
        </div>
      </section>
    </div>
  );
}
