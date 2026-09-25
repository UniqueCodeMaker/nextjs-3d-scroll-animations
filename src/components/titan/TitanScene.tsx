"use client";

import { useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { ContactShadows, Sparkles } from "@react-three/drei";
import * as THREE from "three";
import { TitanWatch3D } from "./TitanWatch3D";

export type TitanViewKey = "hero" | "dial" | "crown" | "strap" | "caseback";

export interface TitanViewPose {
  name: string;
  camPos: [number, number, number];
  targetPos: [number, number, number];
  watchRot: [number, number, number];
  watchPos: [number, number, number];
}

export const TITAN_VIEWS: Record<TitanViewKey, TitanViewPose> = {
  hero: {
    name: "01 // Grand Orbit",
    camPos: [0, 0, 7.4],
    targetPos: [0, 0, 0],
    watchRot: [0.15, -0.22, 0.04],
    watchPos: [0, 0, 0],
  },
  dial: {
    name: "02 // Dial Macro",
    camPos: [0, 0.1, 4.5],
    targetPos: [0, 0.15, 0.15],
    watchRot: [0.18, 0.08, -0.02],
    watchPos: [0, 0.08, 0],
  },
  crown: {
    name: "03 // Crown & Slim Edge",
    camPos: [4.6, 0.4, 4.2],
    targetPos: [0.8, 0.0, 0],
    watchRot: [0.08, -1.05, 0.06],
    watchPos: [-0.6, 0, 0],
  },
  strap: {
    name: "04 // Leather Strap & Clasp",
    camPos: [-2.6, -2.8, 5.0],
    targetPos: [0, -1.4, -0.5],
    watchRot: [-0.42, 0.32, -0.12],
    watchPos: [0.3, 0.5, 0],
  },
  caseback: {
    name: "05 // Exhibition Caseback",
    camPos: [0, 0, 7.2],
    targetPos: [0, 0, -0.15],
    watchRot: [0.15, Math.PI + 0.05, 0],
    watchPos: [0, 0, 0],
  },
};

interface TitanCameraControllerProps {
  scrollProgress: React.RefObject<number> | { current: number };
  activeView: TitanViewKey;
  overrideManualView: boolean;
}

function sampleTitanSpline(progress: number): {
  cam: THREE.Vector3;
  target: THREE.Vector3;
  rot: THREE.Vector3;
  pos: THREE.Vector3;
} {
  const p = Math.max(0, Math.min(1, progress));
  const stages: { p: number; key: TitanViewKey }[] = [
    { p: 0.0, key: "hero" },
    { p: 0.25, key: "dial" },
    { p: 0.50, key: "crown" },
    { p: 0.75, key: "strap" },
    { p: 1.0, key: "caseback" },
  ];

  for (let i = 0; i < stages.length - 1; i++) {
    const a = stages[i];
    const b = stages[i + 1];
    if (p <= b.p) {
      const t = (p - a.p) / (b.p - a.p);
      const factor = THREE.MathUtils.smoothstep(t, 0, 1);
      const poseA = TITAN_VIEWS[a.key];
      const poseB = TITAN_VIEWS[b.key];

      return {
        cam: new THREE.Vector3().fromArray(poseA.camPos).lerp(new THREE.Vector3().fromArray(poseB.camPos), factor),
        target: new THREE.Vector3().fromArray(poseA.targetPos).lerp(new THREE.Vector3().fromArray(poseB.targetPos), factor),
        rot: new THREE.Vector3().fromArray(poseA.watchRot).lerp(new THREE.Vector3().fromArray(poseB.watchRot), factor),
        pos: new THREE.Vector3().fromArray(poseA.watchPos).lerp(new THREE.Vector3().fromArray(poseB.watchPos), factor),
      };
    }
  }

  const last = TITAN_VIEWS.caseback;
  return {
    cam: new THREE.Vector3().fromArray(last.camPos),
    target: new THREE.Vector3().fromArray(last.targetPos),
    rot: new THREE.Vector3().fromArray(last.watchRot),
    pos: new THREE.Vector3().fromArray(last.watchPos),
  };
}

function TitanCinematicController({
  scrollProgress,
  activeView,
  overrideManualView,
  watchGroupRef,
}: TitanCameraControllerProps & { watchGroupRef: React.RefObject<THREE.Group | null> }) {
  const { camera } = useThree();

  const camPosRef = useRef(new THREE.Vector3(0, 0, 7.4));
  const targetPosRef = useRef(new THREE.Vector3(0, 0, 0));
  const watchRotRef = useRef(new THREE.Vector3(0.15, -0.22, 0.04));
  const watchPosRef = useRef(new THREE.Vector3(0, 0, 0));

  useFrame((state, delta) => {
    const { pointer, clock } = state;
    const time = clock.getElapsedTime();

    // Determine target pose from manual button click OR scroll progress
    let targetPose: { cam: THREE.Vector3; target: THREE.Vector3; rot: THREE.Vector3; pos: THREE.Vector3 };

    if (overrideManualView) {
      const selected = TITAN_VIEWS[activeView];
      targetPose = {
        cam: new THREE.Vector3().fromArray(selected.camPos),
        target: new THREE.Vector3().fromArray(selected.targetPos),
        rot: new THREE.Vector3().fromArray(selected.watchRot),
        pos: new THREE.Vector3().fromArray(selected.watchPos),
      };
    } else {
      targetPose = sampleTitanSpline(scrollProgress.current);
    }

    // Natural gentle breathing float
    const breathingY = Math.sin(time * 1.4) * 0.035;
    const breathingRotX = Math.cos(time * 1.0) * 0.015;
    const breathingRotY = Math.sin(time * 0.8) * 0.018;

    // Fluid mouse parallax
    const mouseX = pointer.x * 0.35;
    const mouseY = pointer.y * 0.25;

    // Critically damped spring smoothing (4.0 factor = ultra-smooth 60-144fps transitions)
    const dampSpeed = 3.8;

    camPosRef.current.x = THREE.MathUtils.damp(camPosRef.current.x, targetPose.cam.x + mouseX * 0.4, dampSpeed, delta);
    camPosRef.current.y = THREE.MathUtils.damp(camPosRef.current.y, targetPose.cam.y + mouseY * 0.35 + breathingY * 0.5, dampSpeed, delta);
    camPosRef.current.z = THREE.MathUtils.damp(camPosRef.current.z, targetPose.cam.z, dampSpeed, delta);

    targetPosRef.current.x = THREE.MathUtils.damp(targetPosRef.current.x, targetPose.target.x + mouseX * 0.15, dampSpeed, delta);
    targetPosRef.current.y = THREE.MathUtils.damp(targetPosRef.current.y, targetPose.target.y + mouseY * 0.15, dampSpeed, delta);
    targetPosRef.current.z = THREE.MathUtils.damp(targetPosRef.current.z, targetPose.target.z, dampSpeed, delta);

    camera.position.copy(camPosRef.current);
    camera.lookAt(targetPosRef.current);

    if (watchGroupRef.current) {
      watchRotRef.current.x = THREE.MathUtils.damp(watchRotRef.current.x, targetPose.rot.x + breathingRotX - mouseY * 0.15, dampSpeed, delta);
      watchRotRef.current.y = THREE.MathUtils.damp(watchRotRef.current.y, targetPose.rot.y + breathingRotY + mouseX * 0.2, dampSpeed, delta);
      watchRotRef.current.z = THREE.MathUtils.damp(watchRotRef.current.z, targetPose.rot.z, dampSpeed, delta);

      watchPosRef.current.x = THREE.MathUtils.damp(watchPosRef.current.x, targetPose.pos.x, dampSpeed, delta);
      watchPosRef.current.y = THREE.MathUtils.damp(watchPosRef.current.y, targetPose.pos.y + breathingY, dampSpeed, delta);
      watchPosRef.current.z = THREE.MathUtils.damp(watchPosRef.current.z, targetPose.pos.z, dampSpeed, delta);

      watchGroupRef.current.rotation.set(watchRotRef.current.x, watchRotRef.current.y, watchRotRef.current.z);
      watchGroupRef.current.position.set(watchPosRef.current.x, watchPosRef.current.y, watchPosRef.current.z);
    }
  });

  return null;
}

interface TitanSceneProps {
  scrollProgress: React.RefObject<number> | { current: number };
  activeView: TitanViewKey;
  overrideManualView: boolean;
}

export function TitanScene({ scrollProgress, activeView, overrideManualView }: TitanSceneProps) {
  const watchGroupRef = useRef<THREE.Group>(null);

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 0, 7.4], fov: 42 }}
        dpr={[1, 1.8]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          toneMapping: THREE.ACESFilmicToneMapping,
          toneMappingExposure: 1.55,
        }}
        shadows
      >
        {/* ======================================================== */}
        {/* BRIGHT LUXURY STUDIO LIGHTING SETUP                      */}
        {/* ======================================================== */}
        {/* High ambient illumination so metals never appear dark */}
        <ambientLight intensity={2.2} color="#f8fafc" />

        {/* Powerful Warm Key Light: front-top-right highlight */}
        <directionalLight
          position={[5, 6, 6]}
          intensity={5.5}
          color="#ffffff"
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
          shadow-bias={-0.0001}
        />

        {/* Daylight Rim Light: left raking light catching titanium bevels */}
        <directionalLight
          position={[-5, 4, 4]}
          intensity={4.8}
          color="#e0f2fe"
        />

        {/* Soft Golden Fill Light from underneath: illuminates bezel underside */}
        <directionalLight
          position={[0, -4, 4]}
          intensity={3.2}
          color="#fef08a"
        />

        {/* Overhead Top Downlight: highlights sapphire dome reflection */}
        <directionalLight
          position={[0, 7, 3]}
          intensity={4.0}
          color="#ffffff"
        />

        {/* Deep Rim Backlight for silhouette separation */}
        <directionalLight
          position={[0, 0, -6]}
          intensity={2.8}
          color="#38bdf8"
        />

        {/* Floating atmospheric gold and diamond sparkles */}
        <Sparkles
          count={55}
          scale={9}
          size={1.8}
          speed={0.5}
          opacity={0.4}
          color="#f59e0b"
        />

        {/* 3D Titan Watch */}
        <group ref={watchGroupRef} position={[0, 0, 0]}>
          <TitanWatch3D />
        </group>

        {/* Soft studio contact shadows */}
        <ContactShadows
          opacity={0.55}
          position={[0, -2.6, 0]}
          scale={10}
          blur={2.8}
          far={5.0}
        />

        {/* Smooth Camera Controller */}
        <TitanCinematicController
          scrollProgress={scrollProgress}
          activeView={activeView}
          overrideManualView={overrideManualView}
          watchGroupRef={watchGroupRef}
        />
      </Canvas>
    </div>
  );
}
