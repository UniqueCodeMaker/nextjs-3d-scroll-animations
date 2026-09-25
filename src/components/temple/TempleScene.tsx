"use client";

import { useMemo, useRef } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Sparkles } from "@react-three/drei";
import * as THREE from "three";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Architectural Temple Waypoints along the path from outside to the inner altar
const TEMPLE_PATH = [
  // 0% - Outside the gate in the misty mountain approach
  { progress: 0.0, camPos: [0, 2.2, 40], targetPos: [0, 2.5, 10] },
  // 25% - Passing through the monumental outer gate / Torii
  { progress: 0.25, camPos: [0, 2.0, 24], targetPos: [0, 2.4, 0] },
  // 50% - Walking the stone processional colonnade between fire lanterns
  { progress: 0.50, camPos: [0, 2.1, 10], targetPos: [0, 2.6, -15] },
  // 75% - Ascending the stone steps into the great sacred hall
  { progress: 0.75, camPos: [0, 2.8, -3], targetPos: [0, 3.2, -26] },
  // 100% - Arriving at the inner sanctum before the glowing golden altar
  { progress: 1.0, camPos: [0, 3.2, -18], targetPos: [0, 4.0, -32] },
];

function sampleTemplePath(p: number) {
  const t = Math.min(1, Math.max(0, p));
  for (let i = 0; i < TEMPLE_PATH.length - 1; i++) {
    const a = TEMPLE_PATH[i];
    const b = TEMPLE_PATH[i + 1];
    if (t <= b.progress) {
      const span = b.progress - a.progress;
      const factor = THREE.MathUtils.smoothstep((t - a.progress) / span, 0, 1);
      return {
        cam: new THREE.Vector3().fromArray(a.camPos).lerp(new THREE.Vector3().fromArray(b.camPos), factor),
        target: new THREE.Vector3().fromArray(a.targetPos).lerp(new THREE.Vector3().fromArray(b.targetPos), factor),
      };
    }
  }
  const last = TEMPLE_PATH[TEMPLE_PATH.length - 1];
  return {
    cam: new THREE.Vector3().fromArray(last.camPos),
    target: new THREE.Vector3().fromArray(last.targetPos),
  };
}

// Cinematic Camera Controller with smooth spline interpolation and subtle natural head-sway
function CinematicTempleCamera({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number> | { current: number };
}) {
  const { camera } = useThree();
  const currentCam = useRef(new THREE.Vector3(0, 2.2, 40));
  const currentTarget = useRef(new THREE.Vector3(0, 2.5, 10));

  useFrame((state, delta) => {
    const { pointer, clock } = state;
    const time = clock.getElapsedTime();

    // Sample path according to scroll progress
    const path = sampleTemplePath(scrollProgress.current);

    // Natural subtle breathing and gentle sway
    const breathingY = Math.sin(time * 1.4) * 0.035;
    const swayX = Math.cos(time * 0.7) * 0.025;

    // Mouse look offset
    const lookOffsetX = pointer.x * 0.4;
    const lookOffsetY = pointer.y * 0.25;

    // Smooth camera damping
    currentCam.current.x = THREE.MathUtils.damp(currentCam.current.x, path.cam.x + swayX, 3.5, delta);
    currentCam.current.y = THREE.MathUtils.damp(currentCam.current.y, path.cam.y + breathingY, 3.5, delta);
    currentCam.current.z = THREE.MathUtils.damp(currentCam.current.z, path.cam.z, 3.5, delta);

    currentTarget.current.x = THREE.MathUtils.damp(currentTarget.current.x, path.target.x + lookOffsetX, 3.5, delta);
    currentTarget.current.y = THREE.MathUtils.damp(currentTarget.current.y, path.target.y + lookOffsetY, 3.5, delta);
    currentTarget.current.z = THREE.MathUtils.damp(currentTarget.current.z, path.target.z, 3.5, delta);

    camera.position.copy(currentCam.current);
    camera.lookAt(currentTarget.current);
  });

  return null;
}

// High-performance Stone Lantern with glowing emissive fire
function StoneLantern({ position, flickerSeed }: { position: [number, number, number]; flickerSeed: number }) {
  const flameRef = useRef<THREE.Mesh>(null);

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    const flicker = Math.sin(t * 11 + flickerSeed) * 0.25 + Math.cos(t * 17 + flickerSeed * 2) * 0.15;
    if (flameRef.current) {
      flameRef.current.scale.setScalar(1 + flicker * 0.25);
    }
  });

  return (
    <group position={position}>
      {/* Stone Pedestal */}
      <mesh position={[0, 0.25, 0]} receiveShadow>
        <boxGeometry args={[0.7, 0.5, 0.7]} />
        <meshStandardMaterial color="#383838" roughness={0.9} metalness={0.1} />
      </mesh>
      {/* Stone Column */}
      <mesh position={[0, 0.9, 0]} receiveShadow>
        <cylinderGeometry args={[0.2, 0.25, 0.8, 8]} />
        <meshStandardMaterial color="#424242" roughness={0.85} metalness={0.1} />
      </mesh>
      {/* Lantern Platform */}
      <mesh position={[0, 1.35, 0]} receiveShadow>
        <boxGeometry args={[0.65, 0.1, 0.65]} />
        <meshStandardMaterial color="#333333" roughness={0.9} />
      </mesh>
      {/* Inner Glowing Fire Flame */}
      <mesh ref={flameRef} position={[0, 1.6, 0]}>
        <sphereGeometry args={[0.13, 10, 10]} />
        <meshStandardMaterial emissive="#f59e0b" emissiveIntensity={3.5} color="#f97316" />
      </mesh>
      {/* Lantern Frame Posts */}
      <mesh position={[0, 1.6, 0]}>
        <boxGeometry args={[0.55, 0.45, 0.55]} />
        <meshStandardMaterial color="#1f1f1f" roughness={0.7} wireframe />
      </mesh>
      {/* Pagoda Roof Cap */}
      <mesh position={[0, 1.95, 0]}>
        <coneGeometry args={[0.6, 0.35, 4]} />
        <meshStandardMaterial color="#2d2d2d" roughness={0.75} />
      </mesh>
    </group>
  );
}

// Colonnade Pillar with base, fluted shaft, and capital
function TemplePillar({ position }: { position: [number, number, number] }) {
  return (
    <group position={position}>
      {/* Base */}
      <mesh position={[0, 0.3, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.7, 0.85, 0.6, 16]} />
        <meshStandardMaterial color="#3d342d" roughness={0.75} />
      </mesh>
      {/* Shaft */}
      <mesh position={[0, 3.8, 0]} castShadow receiveShadow>
        <cylinderGeometry args={[0.55, 0.65, 6.4, 16]} />
        <meshStandardMaterial color="#4d4239" roughness={0.7} />
      </mesh>
      {/* Capital */}
      <mesh position={[0, 7.2, 0]} castShadow receiveShadow>
        <boxGeometry args={[1.3, 0.5, 1.3]} />
        <meshStandardMaterial color="#362e27" roughness={0.75} />
      </mesh>
    </group>
  );
}

// The Grand Temple Architecture Environment
function TempleArchitecture() {
  const lanterns = useMemo(() => {
    const list: { pos: [number, number, number]; seed: number }[] = [];
    // 6 pairs of fire lanterns along the pathway outside and inside
    const zOffsets = [34, 26, 18, 10, 2, -6, -14, -22];
    zOffsets.forEach((z, i) => {
      list.push({ pos: [-3.2, 0, z], seed: i * 2.3 });
      list.push({ pos: [3.2, 0, z], seed: (i + 1) * 3.7 });
    });
    return list;
  }, []);

  const pillars = useMemo(() => {
    const list: [number, number, number][] = [];
    const zOffsets = [8, 0, -8, -16, -24];
    zOffsets.forEach((z) => {
      list.push([-5.2, 0, z]);
      list.push([5.2, 0, z]);
    });
    return list;
  }, []);

  return (
    <group>
      {/* Endless Misty Ground Terrain */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.05, 0]} receiveShadow>
        <planeGeometry args={[120, 160]} />
        <meshStandardMaterial color="#2d2621" roughness={0.9} metalness={0.05} />
      </mesh>

      {/* Stone Processional Flagstone Pathway */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 5]} receiveShadow>
        <planeGeometry args={[5.2, 90]} />
        <meshStandardMaterial color="#4a423b" roughness={0.65} metalness={0.15} />
      </mesh>

      {/* Pathway Curbs */}
      <mesh position={[-2.7, 0.08, 5]} receiveShadow>
        <boxGeometry args={[0.3, 0.16, 90]} />
        <meshStandardMaterial color="#3a342e" roughness={0.75} />
      </mesh>
      <mesh position={[2.7, 0.08, 5]} receiveShadow>
        <boxGeometry args={[0.3, 0.16, 90]} />
        <meshStandardMaterial color="#3a342e" roughness={0.75} />
      </mesh>

      {/* Tiered Stone Steps leading up to the Main Temple Entrance at z=12 */}
      {[0, 1, 2, 3, 4].map((step) => (
        <mesh key={step} position={[0, step * 0.18 + 0.09, 13.5 - step * 0.6]} receiveShadow castShadow>
          <boxGeometry args={[7.5, 0.18, 0.65]} />
          <meshStandardMaterial color="#443c35" roughness={0.7} />
        </mesh>
      ))}

      {/* Temple Raised Stone Foundation Floor (z: 11 to -36) */}
      <mesh position={[0, 0.85, -12]} receiveShadow>
        <boxGeometry args={[16, 0.2, 48]} />
        <meshStandardMaterial color="#383029" roughness={0.6} metalness={0.2} />
      </mesh>

      {/* Outer Grand Gate / Torii Portal at z=24 */}
      <group position={[0, 0, 24]}>
        {/* Left Column */}
        <mesh position={[-3.8, 3.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 7.6, 16]} />
          <meshStandardMaterial color="#8b1e16" roughness={0.6} />
        </mesh>
        {/* Right Column */}
        <mesh position={[3.8, 3.8, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.45, 0.55, 7.6, 16]} />
          <meshStandardMaterial color="#8b1e16" roughness={0.6} />
        </mesh>
        {/* Lower Crossbeam (Nuki) */}
        <mesh position={[0, 5.8, 0]} castShadow receiveShadow>
          <boxGeometry args={[9.5, 0.4, 0.5]} />
          <meshStandardMaterial color="#7a1a13" roughness={0.6} />
        </mesh>
        {/* Upper Swept Crossbeam (Kasagi) */}
        <mesh position={[0, 7.6, 0]} castShadow receiveShadow>
          <boxGeometry args={[11.5, 0.6, 0.8]} />
          <meshStandardMaterial color="#68150f" roughness={0.55} />
        </mesh>
        {/* Gate Name Tablet / Plaque */}
        <mesh position={[0, 6.7, 0]} castShadow>
          <boxGeometry args={[1.2, 1.4, 0.15]} />
          <meshStandardMaterial color="#29201c" metalness={0.4} roughness={0.5} />
        </mesh>
      </group>

      {/* Monumental Colonnade Pillars */}
      {pillars.map((pos, idx) => (
        <TemplePillar key={idx} position={pos} />
      ))}

      {/* Long Architrave Beams spanning the Colonnade */}
      <mesh position={[-5.2, 7.6, -8]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.7, 36]} />
        <meshStandardMaterial color="#352c25" roughness={0.75} />
      </mesh>
      <mesh position={[5.2, 7.6, -8]} castShadow receiveShadow>
        <boxGeometry args={[1.1, 0.7, 36]} />
        <meshStandardMaterial color="#352c25" roughness={0.75} />
      </mesh>

      {/* Temple Ceiling Rafters & Beams */}
      {[-24, -20, -16, -12, -8, -4, 0, 4].map((z) => (
        <mesh key={z} position={[0, 7.8, z]} castShadow receiveShadow>
          <boxGeometry args={[12.5, 0.45, 0.45]} />
          <meshStandardMaterial color="#2e251f" roughness={0.8} />
        </mesh>
      ))}

      {/* Temple Side Walls */}
      <mesh position={[-7.5, 4.2, -12]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 7.2, 46]} />
        <meshStandardMaterial color="#2a231d" roughness={0.85} />
      </mesh>
      <mesh position={[7.5, 4.2, -12]} castShadow receiveShadow>
        <boxGeometry args={[0.5, 7.2, 46]} />
        <meshStandardMaterial color="#2a231d" roughness={0.85} />
      </mesh>

      {/* Back Sanctum Wall */}
      <mesh position={[0, 4.5, -34]} castShadow receiveShadow>
        <boxGeometry args={[15.5, 8.0, 0.6]} />
        <meshStandardMaterial color="#241e19" roughness={0.85} />
      </mesh>

      {/* Flickering Fire Lanterns along the pathway */}
      {lanterns.map((l, idx) => (
        <StoneLantern key={idx} position={l.pos} flickerSeed={l.seed} />
      ))}

      {/* Strategic Pathway Point Lights illuminating the colonnade */}
      <pointLight position={[0, 2.2, 28]} color="#f59e0b" intensity={4.8} distance={24} decay={2} />
      <pointLight position={[0, 2.2, 12]} color="#f59e0b" intensity={4.8} distance={24} decay={2} />
      <pointLight position={[0, 2.4, -4]} color="#f59e0b" intensity={4.8} distance={24} decay={2} />
      <pointLight position={[0, 2.6, -18]} color="#f59e0b" intensity={4.8} distance={24} decay={2} />

      {/* THE INNER SANCTUM ALTAR (at z = -28) */}
      <group position={[0, 0.9, -28]}>
        {/* Tiered Altar Dais */}
        <mesh position={[0, 0.25, 0]} castShadow receiveShadow>
          <boxGeometry args={[5.5, 0.5, 3.8]} />
          <meshStandardMaterial color="#352c26" roughness={0.7} />
        </mesh>
        <mesh position={[0, 0.7, 0]} castShadow receiveShadow>
          <boxGeometry args={[4.2, 0.4, 2.8]} />
          <meshStandardMaterial color="#28201a" roughness={0.6} />
        </mesh>
        <mesh position={[0, 1.15, 0]} castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.5, 2.0]} />
          <meshStandardMaterial color="#3d2f25" roughness={0.65} />
        </mesh>

        {/* Central Sacred Golden Monument / Lotus Relic */}
        <mesh position={[0, 2.1, 0]} castShadow receiveShadow>
          <octahedronGeometry args={[0.75, 2]} />
          <meshStandardMaterial
            color="#fbbf24"
            emissive="#d97706"
            emissiveIntensity={0.8}
            metalness={0.95}
            roughness={0.15}
          />
        </mesh>

        {/* Golden Halo Ring around the Sacred Relic */}
        <mesh position={[0, 2.1, 0]} rotation={[Math.PI / 4, 0, 0]}>
          <torusGeometry args={[1.2, 0.04, 16, 64]} />
          <meshStandardMaterial
            color="#fef08a"
            emissive="#eab308"
            emissiveIntensity={1.5}
            metalness={0.9}
            roughness={0.1}
          />
        </mesh>

        {/* Dual Altar Incense Urns */}
        <mesh position={[-1.6, 1.6, 0.5]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.6, 16]} />
          <meshStandardMaterial color="#632507" metalness={0.8} roughness={0.3} />
        </mesh>
        <mesh position={[1.6, 1.6, 0.5]} castShadow>
          <cylinderGeometry args={[0.25, 0.2, 0.6, 16]} />
          <meshStandardMaterial color="#632507" metalness={0.8} roughness={0.3} />
        </mesh>

        {/* Warm Altar Illumination Light */}
        <pointLight position={[0, 2.5, 0]} color="#fde047" intensity={5.5} distance={18} />
      </group>

      {/* Volumetric Celestial Light Shaft Streaming Down onto the Altar from above */}
      <mesh position={[0, 7.5, -28]} rotation={[0, 0, 0]}>
        <cylinderGeometry args={[0.8, 3.2, 9, 32, 1, true]} />
        <meshBasicMaterial
          color="#fef9c3"
          transparent
          opacity={0.26}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

// Lighting Setup with Warm Radiant Dawn Atmosphere
function TempleLighting() {
  return (
    <>
      {/* Warm Ambient Sky & Dawn Light */}
      <ambientLight intensity={0.85} color="#fed7aa" />

      {/* Atmospheric Bounce between Sky & Ground */}
      <hemisphereLight args={["#fff1e0", "#453224", 0.8]} />

      {/* Radiant Golden Hour Sun Angle shining through the gate into the temple */}
      <directionalLight
        position={[18, 30, 45]}
        intensity={4.2}
        color="#fff7ed"
        castShadow
        shadow-mapSize-width={1024}
        shadow-mapSize-height={1024}
        shadow-bias={-0.0005}
        shadow-camera-near={1}
        shadow-camera-far={110}
        shadow-camera-left={-20}
        shadow-camera-right={20}
        shadow-camera-top={20}
        shadow-camera-bottom={-20}
      />

      {/* Fill Light for Soft Luminous Shadows */}
      <directionalLight position={[-20, 18, -10]} intensity={1.4} color="#d6d3d1" />

      {/* Warm Sanctum Rim Light highlighting colonnade from within */}
      <directionalLight position={[0, 14, -35]} intensity={2.2} color="#fde047" />

      {/* Divine Skylight Light shining directly onto the altar */}
      <spotLight
        position={[0, 16, -28]}
        target-position={[0, 1, -28]}
        intensity={7.5}
        color="#fffbeb"
        angle={0.45}
        penumbra={0.8}
      />
    </>
  );
}

export function TempleScene({
  scrollProgress,
}: {
  scrollProgress: React.RefObject<number> | { current: number };
}) {
  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      <Canvas
        camera={{ position: [0, 2.2, 40], fov: 50, near: 0.2, far: 150 }}
        dpr={[1, 1.5]}
        gl={{
          antialias: true,
          powerPreference: "high-performance",
          alpha: false,
          stencil: false,
        }}
        shadows
      >
        {/* Warm Golden Dawn Mist Atmosphere */}
        <color attach="background" args={["#1e1915"]} />
        <fogExp2 attach="fog" args={["#1e1915", 0.012]} />

        {/* Lighting */}
        <TempleLighting />

        {/* 3D Architecture */}
        <TempleArchitecture />

        {/* Floating Incense Embers & Dust Motes in the air */}
        <Sparkles
          count={130}
          scale={[18, 10, 70]}
          position={[0, 4, 5]}
          size={2.5}
          speed={0.3}
          opacity={0.6}
          color="#fde047"
        />

        {/* Smooth Cinematic Camera */}
        <CinematicTempleCamera scrollProgress={scrollProgress} />
      </Canvas>
    </div>
  );
}
