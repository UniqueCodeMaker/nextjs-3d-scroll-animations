"use client";

import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

// Generate high-resolution procedural canvas textures for authentic luxury watch realism
function createWatchDialTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;

  // 1. Base Radial Gradient: Deep Midnight Obsidian to Rich Navy/Slate
  const bgGrad = ctx.createRadialGradient(cx, cy, 30, cx, cy, r);
  bgGrad.addColorStop(0, "#1a2233");
  bgGrad.addColorStop(0.55, "#0e1420");
  bgGrad.addColorStop(0.85, "#090d15");
  bgGrad.addColorStop(1, "#05070a");
  ctx.fillStyle = bgGrad;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // 2. Sunburst Guilloché Fine Concentric Rings
  ctx.strokeStyle = "rgba(212, 175, 55, 0.07)";
  ctx.lineWidth = 1.2;
  for (let rad = 90; rad < r - 40; rad += 12) {
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.stroke();
  }

  // Radial sunburst ray lines
  ctx.save();
  ctx.translate(cx, cy);
  ctx.strokeStyle = "rgba(255, 255, 255, 0.025)";
  ctx.lineWidth = 1;
  for (let deg = 0; deg < 360; deg += 3) {
    ctx.rotate((3 * Math.PI) / 180);
    ctx.beginPath();
    ctx.moveTo(80, 0);
    ctx.lineTo(r - 50, 0);
    ctx.stroke();
  }
  ctx.restore();

  // 3. Outer Chapter Ring in Rose Gold
  ctx.beginPath();
  ctx.arc(cx, cy, r - 35, 0, Math.PI * 2);
  ctx.strokeStyle = "#e6b85c";
  ctx.lineWidth = 3;
  ctx.stroke();

  ctx.beginPath();
  ctx.arc(cx, cy, r - 70, 0, Math.PI * 2);
  ctx.strokeStyle = "rgba(230, 184, 92, 0.35)";
  ctx.lineWidth = 1.5;
  ctx.stroke();

  // 4. Minute Ticks and Hour Markers
  for (let i = 0; i < 60; i++) {
    const angle = (i * Math.PI) / 30 - Math.PI / 2;
    const isHour = i % 5 === 0;
    const isQuarter = i % 15 === 0;

    const rOuter = r - 40;
    const rInner = isQuarter ? r - 66 : isHour ? r - 60 : r - 50;

    const x1 = cx + Math.cos(angle) * rOuter;
    const y1 = cy + Math.sin(angle) * rOuter;
    const x2 = cx + Math.cos(angle) * rInner;
    const y2 = cy + Math.sin(angle) * rInner;

    ctx.beginPath();
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.strokeStyle = isQuarter ? "#ffffff" : isHour ? "#e6b85c" : "rgba(226, 232, 240, 0.4)";
    ctx.lineWidth = isQuarter ? 5 : isHour ? 3.5 : 1.5;
    ctx.stroke();
  }

  // 5. Embossed Brand Logo & Typography: TITAN
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Stylized Titan Crest Icon
  ctx.fillStyle = "#e6b85c";
  ctx.beginPath();
  ctx.arc(cx, cy - 250, 14, 0, Math.PI * 2);
  ctx.fill();

  ctx.strokeStyle = "#e6b85c";
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(cx, cy - 250, 22, 0, Math.PI * 2);
  ctx.stroke();

  // "TITAN" Text
  ctx.font = "bold 44px 'Cinzel', 'Playfair Display', serif, sans-serif";
  ctx.letterSpacing = "12px";
  ctx.fillStyle = "#ffffff";
  ctx.shadowColor = "rgba(230, 184, 92, 0.8)";
  ctx.shadowBlur = 10;
  ctx.fillText("TITAN", cx + 6, cy - 195);
  ctx.shadowBlur = 0;

  // "EDGE AUTOMATIC" Subtitle
  ctx.font = "500 16px 'Inter', sans-serif";
  ctx.letterSpacing = "6px";
  ctx.fillStyle = "#e6b85c";
  ctx.fillText("EDGE // AUTOMATIC", cx + 3, cy - 150);

  // 6. Chronometer Subdial (Seconds Counter at 9 o'clock)
  const subX = cx - 180;
  const subY = cy + 30;
  const subR = 85;

  ctx.beginPath();
  ctx.arc(subX, subY, subR, 0, Math.PI * 2);
  ctx.fillStyle = "rgba(10, 15, 25, 0.85)";
  ctx.fill();
  ctx.strokeStyle = "rgba(230, 184, 92, 0.5)";
  ctx.lineWidth = 2;
  ctx.stroke();

  ctx.font = "600 13px 'Inter', sans-serif";
  ctx.letterSpacing = "1px";
  ctx.fillStyle = "#cbd5e1";
  ctx.fillText("60", subX, subY - 65);
  ctx.fillText("30", subX, subY + 68);
  ctx.fillText("15", subX + 68, subY);
  ctx.fillText("45", subX - 68, subY);

  // 7. Date Aperture Window at 3 o'clock
  const dateX = cx + 195;
  const dateY = cy + 15;
  const dw = 76;
  const dh = 50;

  // Gold Bevel Border
  ctx.fillStyle = "#e6b85c";
  ctx.fillRect(dateX - dw / 2 - 3, dateY - dh / 2 - 3, dw + 6, dh + 6);

  // White date background
  ctx.fillStyle = "#f8fafc";
  ctx.fillRect(dateX - dw / 2, dateY - dh / 2, dw, dh);

  // Date Number: 25
  ctx.font = "bold 30px 'Inter', sans-serif";
  ctx.letterSpacing = "0px";
  ctx.fillStyle = "#0f172a";
  ctx.fillText("25", dateX, dateY + 3);

  // 8. Open-Heart Tourbillon Window Ring at 6 o'clock
  const tourbX = cx;
  const tourbY = cy + 220;
  const tourbR = 115;

  ctx.beginPath();
  ctx.arc(tourbX, tourbY, tourbR, 0, Math.PI * 2);
  ctx.strokeStyle = "#e6b85c";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = "600 14px 'Inter', sans-serif";
  ctx.letterSpacing = "3px";
  ctx.fillStyle = "#e6b85c";
  ctx.fillText("TOURBILLON // 28,800 VPH", cx + 2, cy + 90);

  // 9. Rim Hallmark: "TITAN CHRONOMETER"
  ctx.font = "500 13px 'Inter', monospace";
  ctx.letterSpacing = "4px";
  ctx.fillStyle = "rgba(148, 163, 184, 0.7)";
  ctx.fillText("SWISS GRADE - SAPPHIRE CRYSTAL - 30M", cx, cy + 440);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

// Generate high-resolution procedural canvas texture for the Exhibition Caseback
function createCasebackTexture(): THREE.CanvasTexture | null {
  if (typeof document === "undefined") return null;

  const size = 1024;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const cx = size / 2;
  const cy = size / 2;
  const r = size / 2 - 20;

  // 1. Dark Steel Movement Baseplate
  ctx.fillStyle = "#1e293b";
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI * 2);
  ctx.fill();

  // 2. Côtes de Genève (Geneva Striping)
  ctx.save();
  ctx.beginPath();
  ctx.arc(cx, cy, r - 50, 0, Math.PI * 2);
  ctx.clip();
  const stripeWidth = 24;
  for (let x = 0; x < size; x += stripeWidth) {
    const isAlt = (x / stripeWidth) % 2 === 0;
    ctx.fillStyle = isAlt ? "rgba(255, 255, 255, 0.05)" : "rgba(0, 0, 0, 0.15)";
    ctx.fillRect(x, 0, stripeWidth, size);
  }
  ctx.restore();

  // 3. Movement Circular Perlage Patterns
  ctx.fillStyle = "rgba(255, 255, 255, 0.04)";
  for (let rad = 100; rad < r - 60; rad += 45) {
    const count = Math.floor(rad * 0.14);
    for (let j = 0; j < count; j++) {
      const a = (j * Math.PI * 2) / count;
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, 16, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  // 4. Caseback Inscribed Outer Ring
  ctx.beginPath();
  ctx.arc(cx, cy, r - 25, 0, Math.PI * 2);
  ctx.strokeStyle = "#e6b85c";
  ctx.lineWidth = 4;
  ctx.stroke();

  ctx.font = "bold 18px 'Inter', monospace";
  ctx.letterSpacing = "6px";
  ctx.fillStyle = "#e6b85c";
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("TITAN HOROLOGY // ALL TITANIUM // CALIBRE T-900", cx, 65);
  ctx.fillText("SAPPHIRE CRYSTAL // 21 JEWELS // 30M WATER RESIST", cx, size - 65);

  const texture = new THREE.CanvasTexture(canvas);
  texture.anisotropy = 16;
  texture.needsUpdate = true;
  return texture;
}

export function TitanWatch3D() {
  const secondHandRef = useRef<THREE.Group>(null);
  const minuteHandRef = useRef<THREE.Group>(null);
  const hourHandRef = useRef<THREE.Group>(null);
  const balanceWheelRef = useRef<THREE.Group>(null);
  const rotorRef = useRef<THREE.Group>(null);
  const subdialSecRef = useRef<THREE.Group>(null);

  const dialTexture = useMemo(() => createWatchDialTexture(), []);
  const casebackTexture = useMemo(() => createCasebackTexture(), []);

  // Premium high-sheen PBR Materials for luxury studio lighting
  const materials = useMemo(() => {
    return {
      // Lustrous Titanium Case Body
      titaniumCase: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        metalness: 0.94,
        roughness: 0.18,
      }),
      // Polished 18K Yellow Gold Bezel & Accents
      polishedGold: new THREE.MeshStandardMaterial({
        color: "#f59e0b",
        metalness: 0.98,
        roughness: 0.12,
      }),
      // Rose Gold Fluting
      roseGold: new THREE.MeshStandardMaterial({
        color: "#d97706",
        metalness: 0.92,
        roughness: 0.22,
      }),
      // Midnight Blue Dial Base
      dialFace: new THREE.MeshStandardMaterial({
        map: dialTexture ?? undefined,
        roughness: 0.25,
        metalness: 0.45,
      }),
      // Caseback Movement Base
      casebackFace: new THREE.MeshStandardMaterial({
        map: casebackTexture ?? undefined,
        roughness: 0.35,
        metalness: 0.75,
      }),
      // Highly reflective Sapphire Glass
      sapphireGlass: new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        transmission: 0.94,
        opacity: 1,
        transparent: true,
        roughness: 0.04,
        ior: 1.55,
        thickness: 0.15,
      }),
      // Royal Blue Sapphire Cabochon Crown Jewel
      sapphireJewel: new THREE.MeshStandardMaterial({
        color: "#2563eb",
        emissive: "#1d4ed8",
        emissiveIntensity: 0.5,
        roughness: 0.1,
        metalness: 0.85,
      }),
      // Synthetic Ruby Pivot Bearings
      rubyJewel: new THREE.MeshStandardMaterial({
        color: "#f43f5e",
        emissive: "#be123c",
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.5,
      }),
      // Midnight Black Italian Leather Strap with subtle sheen
      strapLeather: new THREE.MeshStandardMaterial({
        color: "#18181b",
        roughness: 0.55,
        metalness: 0.15,
      }),
      // White Perimeter Stitching on Leather
      strapStitch: new THREE.MeshStandardMaterial({
        color: "#e2e8f0",
        roughness: 0.8,
        metalness: 0.05,
      }),
      // Luminous Hands / Indices
      lumeWhite: new THREE.MeshStandardMaterial({
        color: "#ffffff",
        emissive: "#38bdf8",
        emissiveIntensity: 0.4,
        roughness: 0.2,
      }),
      // Steel Chrono Needle
      bluedSteel: new THREE.MeshStandardMaterial({
        color: "#0284c7",
        metalness: 0.95,
        roughness: 0.15,
      }),
    };
  }, [dialTexture, casebackTexture]);

  // Real-time ticking and smooth mechanical watch movement
  useFrame(() => {
    const now = new Date();
    const ms = now.getMilliseconds();
    const s = now.getSeconds() + ms / 1000;
    const m = now.getMinutes() + s / 60;
    const h = (now.getHours() % 12) + m / 60;

    // Smooth continuous sweeping second hand
    if (secondHandRef.current) {
      secondHandRef.current.rotation.z = -s * ((Math.PI * 2) / 60);
    }
    if (subdialSecRef.current) {
      subdialSecRef.current.rotation.z = -s * ((Math.PI * 2) / 60) * 2;
    }
    if (minuteHandRef.current) {
      minuteHandRef.current.rotation.z = -m * ((Math.PI * 2) / 60);
    }
    if (hourHandRef.current) {
      hourHandRef.current.rotation.z = -h * ((Math.PI * 2) / 12);
    }

    // High frequency tourbillon escapement balance wheel (4Hz / 28,800 VPH)
    const time = performance.now() * 0.001;
    if (balanceWheelRef.current) {
      balanceWheelRef.current.rotation.z = Math.sin(time * 28) * 0.92;
    }

    // Automatic weighted rotor inertia swing on exhibition caseback
    if (rotorRef.current) {
      rotorRef.current.rotation.z = Math.sin(time * 1.6) * 1.1 + Math.cos(time * 0.8) * 0.6;
    }
  });

  return (
    <group dispose={null}>
      {/* ========================================================= */}
      {/* 1. MAIN CASE: Round Titanium Outer Cylinder (Z-Thickness)  */}
      {/* ========================================================= */}
      {/* Outer Case Drum: aligned with Z-axis so face is in X-Y plane */}
      <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.titaniumCase} castShadow receiveShadow>
        <cylinderGeometry args={[2.0, 1.95, 0.38, 64]} />
      </mesh>

      {/* Stepped Polished 18K Gold Outer Bezel Ring */}
      <mesh position={[0, 0, 0.19]} rotation={[0, 0, 0]} material={materials.polishedGold} castShadow>
        <torusGeometry args={[1.92, 0.09, 24, 64]} />
      </mesh>

      {/* Inner Rose Gold Sloped Rehaut Ring */}
      <mesh position={[0, 0, 0.16]} rotation={[Math.PI / 2, 0, 0]} material={materials.roseGold}>
        <cylinderGeometry args={[1.86, 1.80, 0.08, 64, 1, true]} />
      </mesh>

      {/* ========================================================= */}
      {/* 2. THE PHOTOREALISTIC WATCH DIAL FACE                      */}
      {/* ========================================================= */}
      <mesh position={[0, 0, 0.155]} material={materials.dialFace} receiveShadow>
        <circleGeometry args={[1.82, 64]} />
      </mesh>

      {/* 12 Faceted 3D Gold Batons at Hour Positions (Extruding out) */}
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i * Math.PI) / 6;
        const radius = 1.58;
        const isQuarter = i % 3 === 0;
        return (
          <group
            key={`marker-${i}`}
            position={[Math.sin(angle) * radius, Math.cos(angle) * radius, 0.17]}
            rotation={[0, 0, -angle]}
          >
            <mesh material={materials.polishedGold} castShadow>
              <boxGeometry args={[isQuarter ? 0.08 : 0.045, isQuarter ? 0.26 : 0.18, 0.03]} />
            </mesh>
            <mesh position={[0, 0, 0.018]} material={materials.lumeWhite}>
              <boxGeometry args={[0.022, isQuarter ? 0.16 : 0.10, 0.01]} />
            </mesh>
          </group>
        );
      })}

      {/* ========================================================= */}
      {/* 3. OPEN-HEART TOURBILLON APERTURE AT 6 O'CLOCK             */}
      {/* ========================================================= */}
      <group position={[0, -0.78, 0.16]}>
        {/* Beveled Gold Outer Rim */}
        <mesh material={materials.polishedGold}>
          <ringGeometry args={[0.42, 0.48, 48]} />
        </mesh>
        {/* Recessed Mechanical Cavity */}
        <mesh position={[0, 0, -0.06]} rotation={[Math.PI / 2, 0, 0]} material={materials.titaniumCase}>
          <cylinderGeometry args={[0.42, 0.42, 0.12, 32]} />
        </mesh>
        {/* Escapement Bridge Bar */}
        <mesh position={[0, 0, 0.02]} material={materials.roseGold}>
          <boxGeometry args={[0.78, 0.06, 0.025]} />
        </mesh>
        {/* Ruby Pivot Jewel */}
        <mesh position={[0, 0, 0.035]} rotation={[Math.PI / 2, 0, 0]} material={materials.rubyJewel}>
          <cylinderGeometry args={[0.06, 0.06, 0.02, 16]} />
        </mesh>
        {/* Rapidly Oscillating Balance Wheel */}
        <group ref={balanceWheelRef} position={[0, 0, -0.02]}>
          <mesh material={materials.polishedGold}>
            <torusGeometry args={[0.30, 0.022, 16, 32]} />
          </mesh>
          <mesh material={materials.polishedGold}>
            <boxGeometry args={[0.58, 0.025, 0.012]} />
          </mesh>
          <mesh rotation={[0, 0, Math.PI / 2]} material={materials.polishedGold}>
            <boxGeometry args={[0.58, 0.025, 0.012]} />
          </mesh>
        </group>
      </group>

      {/* Subdial Small Sweeping Seconds Needle */}
      <group position={[-0.64, 0.1, 0.165]}>
        <group ref={subdialSecRef}>
          <mesh position={[0, 0.11, 0]} material={materials.bluedSteel}>
            <boxGeometry args={[0.018, 0.22, 0.008]} />
          </mesh>
        </group>
        <mesh position={[0, 0, 0.01]} rotation={[Math.PI / 2, 0, 0]} material={materials.polishedGold}>
          <cylinderGeometry args={[0.03, 0.03, 0.015, 16]} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 4. CENTRAL PINION & FACETED DAUPHINE HANDS                */}
      {/* ========================================================= */}
      {/* Center Pinion Boss */}
      <mesh position={[0, 0, 0.19]} rotation={[Math.PI / 2, 0, 0]} material={materials.polishedGold}>
        <cylinderGeometry args={[0.12, 0.12, 0.06, 32]} />
      </mesh>

      {/* Faceted Dauphine Hour Hand */}
      <group ref={hourHandRef} position={[0, 0, 0.22]}>
        <mesh position={[0, 0.44, 0]} material={materials.polishedGold} castShadow>
          <boxGeometry args={[0.10, 0.88, 0.022]} />
        </mesh>
        <mesh position={[0, 0.46, 0.012]} material={materials.lumeWhite}>
          <boxGeometry args={[0.035, 0.62, 0.008]} />
        </mesh>
      </group>

      {/* Faceted Dauphine Minute Hand */}
      <group ref={minuteHandRef} position={[0, 0, 0.24]}>
        <mesh position={[0, 0.72, 0]} material={materials.polishedGold} castShadow>
          <boxGeometry args={[0.08, 1.44, 0.022]} />
        </mesh>
        <mesh position={[0, 0.74, 0.012]} material={materials.lumeWhite}>
          <boxGeometry args={[0.03, 1.05, 0.008]} />
        </mesh>
      </group>

      {/* Blued-Steel Sweeping Needle Second Hand with Counterweight */}
      <group ref={secondHandRef} position={[0, 0, 0.26]}>
        {/* Long Needle Shaft */}
        <mesh position={[0, 0.76, 0]} material={materials.bluedSteel}>
          <boxGeometry args={[0.015, 1.52, 0.008]} />
        </mesh>
        {/* Red Arrow Pointer Tip */}
        <mesh position={[0, 1.55, 0]} rotation={[0, 0, 0]} material={materials.rubyJewel}>
          <coneGeometry args={[0.045, 0.14, 16]} />
        </mesh>
        {/* Counterweight Tail */}
        <mesh position={[0, -0.28, 0]} material={materials.bluedSteel}>
          <boxGeometry args={[0.035, 0.56, 0.012]} />
        </mesh>
        <mesh position={[0, -0.44, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.bluedSteel}>
          <cylinderGeometry args={[0.07, 0.07, 0.018, 16]} />
        </mesh>
      </group>

      {/* Center Cap Synthetic Ruby */}
      <mesh position={[0, 0, 0.28]} rotation={[Math.PI / 2, 0, 0]} material={materials.rubyJewel}>
        <cylinderGeometry args={[0.04, 0.04, 0.02, 16]} />
      </mesh>

      {/* ========================================================= */}
      {/* 5. CURVED DOMED SAPPHIRE CRYSTAL GLASS                     */}
      {/* ========================================================= */}
      <mesh position={[0, 0, 0.21]} material={materials.sapphireGlass}>
        <sphereGeometry args={[2.0, 48, 24, 0, Math.PI * 2, 0, 0.38]} />
      </mesh>

      {/* ========================================================= */}
      {/* 6. PROPORTIONATE FLUTED CROWN AT 3 O'CLOCK                 */}
      {/* ========================================================= */}
      <group position={[2.02, 0, 0]} rotation={[0, 0, -Math.PI / 2]}>
        {/* Protective Crown Shoulder */}
        <mesh position={[0, 0.04, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.titaniumCase}>
          <cylinderGeometry args={[0.22, 0.25, 0.14, 24]} />
        </mesh>
        {/* Knurled Gold Crown Barrel */}
        <mesh position={[0, 0.16, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.polishedGold} castShadow>
          <cylinderGeometry args={[0.20, 0.20, 0.16, 32]} />
        </mesh>
        {/* Royal Blue Sapphire Jewel Cabochon */}
        <mesh position={[0, 0.25, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.sapphireJewel}>
          <sphereGeometry args={[0.13, 20, 16, 0, Math.PI * 2, 0, Math.PI / 2]} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 7. SCULPTED ERGONOMIC LUGS (4 Corners)                    */}
      {/* ========================================================= */}
      {/* Top Left Lug */}
      <mesh position={[-0.95, 2.15, -0.08]} rotation={[-0.32, 0, 0.1]} material={materials.titaniumCase} castShadow>
        <boxGeometry args={[0.28, 0.65, 0.28]} />
      </mesh>
      {/* Top Right Lug */}
      <mesh position={[0.95, 2.15, -0.08]} rotation={[-0.32, 0, -0.1]} material={materials.titaniumCase} castShadow>
        <boxGeometry args={[0.28, 0.65, 0.28]} />
      </mesh>

      {/* Bottom Left Lug */}
      <mesh position={[-0.95, -2.15, -0.08]} rotation={[0.32, 0, -0.1]} material={materials.titaniumCase} castShadow>
        <boxGeometry args={[0.28, 0.65, 0.28]} />
      </mesh>
      {/* Bottom Right Lug */}
      <mesh position={[0.95, -2.15, -0.08]} rotation={[0.32, 0, 0.1]} material={materials.titaniumCase} castShadow>
        <boxGeometry args={[0.28, 0.65, 0.28]} />
      </mesh>

      {/* ========================================================= */}
      {/* 8. ELEGANT LEATHER STRAP (Curving realistically around)   */}
      {/* ========================================================= */}
      {/* Top Strap Segment flowing smoothly downwards behind */}
      <group position={[0, 2.1, -0.08]}>
        {/* Link 1 */}
        <mesh position={[0, 0.45, -0.15]} rotation={[0.38, 0, 0]} material={materials.strapLeather} castShadow>
          <boxGeometry args={[1.62, 0.9, 0.15]} />
        </mesh>
        {/* White Perimeter Stitching Accent */}
        <mesh position={[-0.72, 0.45, -0.07]} rotation={[0.38, 0, 0]} material={materials.strapStitch}>
          <boxGeometry args={[0.03, 0.88, 0.02]} />
        </mesh>
        <mesh position={[0.72, 0.45, -0.07]} rotation={[0.38, 0, 0]} material={materials.strapStitch}>
          <boxGeometry args={[0.03, 0.88, 0.02]} />
        </mesh>

        {/* Link 2: Curving Further Back */}
        <mesh position={[0, 1.18, -0.62]} rotation={[0.82, 0, 0]} material={materials.strapLeather} castShadow>
          <boxGeometry args={[1.56, 0.95, 0.14]} />
        </mesh>
        {/* Link 3: Wrapping to Rear */}
        <mesh position={[0, 1.68, -1.35]} rotation={[1.35, 0, 0]} material={materials.strapLeather} castShadow>
          <boxGeometry args={[1.52, 1.0, 0.13]} />
        </mesh>
      </group>

      {/* Bottom Strap Segment with Deployant Clasp */}
      <group position={[0, -2.1, -0.08]}>
        {/* Link 1 */}
        <mesh position={[0, -0.45, -0.15]} rotation={[-0.38, 0, 0]} material={materials.strapLeather} castShadow>
          <boxGeometry args={[1.62, 0.9, 0.15]} />
        </mesh>
        {/* Stitching */}
        <mesh position={[-0.72, -0.45, -0.07]} rotation={[-0.38, 0, 0]} material={materials.strapStitch}>
          <boxGeometry args={[0.03, 0.88, 0.02]} />
        </mesh>
        <mesh position={[0.72, -0.45, -0.07]} rotation={[-0.38, 0, 0]} material={materials.strapStitch}>
          <boxGeometry args={[0.03, 0.88, 0.02]} />
        </mesh>

        {/* Link 2: Curving Further Back */}
        <mesh position={[0, -1.18, -0.62]} rotation={[-0.82, 0, 0]} material={materials.strapLeather} castShadow>
          <boxGeometry args={[1.56, 0.95, 0.14]} />
        </mesh>
        {/* Link 3: Wrapping to Rear */}
        <mesh position={[0, -1.68, -1.35]} rotation={[-1.35, 0, 0]} material={materials.strapLeather} castShadow>
          <boxGeometry args={[1.52, 1.0, 0.13]} />
        </mesh>

        {/* Titanium Deployant Buckle Clasp */}
        <mesh position={[0, -1.95, -1.72]} rotation={[-1.4, 0, 0]} material={materials.titaniumCase} castShadow>
          <boxGeometry args={[1.64, 0.38, 0.22]} />
        </mesh>
      </group>

      {/* ========================================================= */}
      {/* 9. EXHIBITION SAPPHIRE CASEBACK (REVERSE SIDE)            */}
      {/* ========================================================= */}
      <group position={[0, 0, -0.19]} rotation={[0, Math.PI, 0]}>
        {/* Screw-Down Outer Titanium Ring */}
        <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.titaniumCase} castShadow>
          <cylinderGeometry args={[1.96, 1.96, 0.05, 48]} />
        </mesh>

        {/* Exhibition Movement Plate with Geneva Striping Texture */}
        <mesh position={[0, 0, 0.026]} material={materials.casebackFace}>
          <circleGeometry args={[1.65, 48]} />
        </mesh>

        {/* Sapphire Protective Back Window */}
        <mesh position={[0, 0, 0.032]} material={materials.sapphireGlass}>
          <circleGeometry args={[1.62, 48]} />
        </mesh>

        {/* 3D Gold Automatic Winding Skeleton Rotor */}
        <group ref={rotorRef} position={[0, 0, 0.038]}>
          <mesh position={[0, 0.52, 0]} rotation={[Math.PI / 2, 0, 0]} material={materials.polishedGold} castShadow>
            <cylinderGeometry args={[1.35, 1.35, 0.035, 32, 1, false, 0, Math.PI]} />
          </mesh>
          {/* Rotor Center Bearing */}
          <mesh rotation={[Math.PI / 2, 0, 0]} material={materials.roseGold}>
            <cylinderGeometry args={[0.22, 0.22, 0.045, 24]} />
          </mesh>
          <mesh position={[0, 0, 0.025]} rotation={[Math.PI / 2, 0, 0]} material={materials.rubyJewel}>
            <cylinderGeometry args={[0.07, 0.07, 0.02, 16]} />
          </mesh>
        </group>
      </group>
    </group>
  );
}
