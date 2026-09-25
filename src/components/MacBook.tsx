"use client";

import * as THREE from "three";
import { useGLTF } from "@react-three/drei";
import { useFrame } from "@react-three/fiber";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useEffect, useRef, useState, useCallback } from "react";

gsap.registerPlugin(ScrollTrigger);

const BASE_PATH = process.env.NEXT_PUBLIC_BASE_PATH ?? "";
const TOP_MODEL_URL = `${BASE_PATH}/assets/Macbook_Top.glb`;
const BOTTOM_MODEL_URL = `${BASE_PATH}/assets/Macbook_Bottom.glb`;

useGLTF.preload(TOP_MODEL_URL);
useGLTF.preload(BOTTOM_MODEL_URL);

interface MacBookProps {
  characterUrl?: string | null;
  displayMode?: "screen" | "hologram";
  onScreenClick?: () => void;
}

export function MacBook({
  characterUrl,
  displayMode = "screen",
  onScreenClick,
}: MacBookProps) {
  const topModel = useGLTF(TOP_MODEL_URL);
  const bottomModel = useGLTF(BOTTOM_MODEL_URL);

  const groupRef = useRef<THREE.Group>(null);
  const floatRef = useRef<THREE.Group>(null);
  const topRef = useRef<THREE.Mesh>(null);
  const bottomRef = useRef<THREE.Mesh>(null);

  // 3D Hologram references
  const hologramMeshRef = useRef<THREE.Mesh>(null);
  const hologramRingRef = useRef<THREE.Mesh>(null);
  const hologramGroupRef = useRef<THREE.Group>(null);

  // Canvas & dynamic screen texture references
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvasTexRef = useRef<THREE.CanvasTexture | null>(null);
  const characterImgRef = useRef<HTMLImageElement | null>(null);
  const [characterLoaded, setCharacterLoaded] = useState(false);
  const [hologramTexture, setHologramTexture] = useState<THREE.Texture | null>(null);

  // Create the dynamic 1024x640 Canvas for the MacBook Liquid Retina XDR screen
  useEffect(() => {
    if (typeof document === "undefined") return;

    const canvas = document.createElement("canvas");
    canvas.width = 1024;
    canvas.height = 640;
    canvasRef.current = canvas;

    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.minFilter = THREE.LinearFilter;
    tex.magFilter = THREE.LinearFilter;
    tex.flipY = false;
    canvasTexRef.current = tex;

    // Apply the dynamic Canvas Texture directly onto the GLTF model's Screen material
    const screenMat = topModel.materials.Screen as THREE.MeshStandardMaterial;
    if (screenMat) {
      screenMat.map = tex;
      screenMat.emissiveMap = tex;
      screenMat.emissive = new THREE.Color(0xffffff);
      screenMat.emissiveIntensity = 1.15;
      screenMat.roughness = 0.18;
      screenMat.metalness = 0.05;
      screenMat.needsUpdate = true;
    }
  }, [topModel]);

  // Load character image whenever characterUrl changes (uploaded PNG or preset)
  useEffect(() => {
    if (!characterUrl) {
      characterImgRef.current = null;
      setCharacterLoaded(false);
      setHologramTexture(null);
      return;
    }

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      characterImgRef.current = img;
      setCharacterLoaded(true);

      // Create high-res 3D billboard texture for hologram mode
      const texLoader = new THREE.TextureLoader();
      texLoader.load(characterUrl, (loadedTex) => {
        loadedTex.colorSpace = THREE.SRGBColorSpace;
        loadedTex.minFilter = THREE.LinearFilter;
        loadedTex.magFilter = THREE.LinearFilter;
        loadedTex.needsUpdate = true;
        setHologramTexture(loadedTex);
      });
    };
    img.src = characterUrl;
  }, [characterUrl]);

  // Draw the animated frame onto the MacBook's screen canvas
  const renderScreenFrame = useCallback((time: number, pointer: { x: number; y: number }) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // 1. Background: Deep macOS Dark Liquid Glass Gradient
    const bg = ctx.createLinearGradient(0, 0, W, H);
    bg.addColorStop(0, "#080c16");
    bg.addColorStop(0.4, "#0f172a");
    bg.addColorStop(0.75, "#1e1b4b");
    bg.addColorStop(1, "#020617");
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    // Glowing vibrant wallpaper light waves
    ctx.save();
    ctx.filter = "blur(50px)";
    ctx.fillStyle = "rgba(56, 189, 248, 0.4)";
    ctx.beginPath();
    ctx.ellipse(280 + Math.sin(time) * 30, 240, 260, 140, Math.PI / 4, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(244, 63, 94, 0.35)";
    ctx.beginPath();
    ctx.ellipse(740 + Math.cos(time) * 30, 360, 300, 150, -Math.PI / 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = "rgba(245, 158, 11, 0.3)";
    ctx.beginPath();
    ctx.ellipse(512, 320, 220, 110, 0, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();

    // 2. Top macOS Menu Bar
    ctx.fillStyle = "rgba(255, 255, 255, 0.15)";
    ctx.fillRect(0, 0, W, 32);

    ctx.fillStyle = "#ffffff";
    ctx.font = "bold 14px -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif";
    ctx.fillText("  Finder  File  Edit  View  Go  Window  Help", 24, 21);
    ctx.fillText("100% 🔋  Fri Sep 25  12:00 PM", 780, 21);

    // 3. Render Mode Specific Content
    if (displayMode === "hologram") {
      // Holographic Matrix HUD on the screen while character hovers in 3D
      ctx.fillStyle = "rgba(14, 165, 233, 0.15)";
      ctx.fillRect(60, 80, W - 120, H - 160);
      ctx.strokeStyle = "rgba(56, 189, 248, 0.6)";
      ctx.lineWidth = 2;
      ctx.strokeRect(60, 80, W - 120, H - 160);

      ctx.fillStyle = "#38bdf8";
      ctx.font = "bold 24px monospace";
      ctx.textAlign = "center";
      ctx.fillText("⚡ 3D HOLOGRAPHIC PROJECTION ACTIVE", W / 2, H / 2 - 20);

      ctx.font = "16px monospace";
      ctx.fillStyle = "#94a3b8";
      ctx.fillText("Character teleported to 3D space above keyboard", W / 2, H / 2 + 20);

      // Scanning Laser Line
      const scanY = 90 + ((time * 180) % (H - 180));
      ctx.strokeStyle = "#38bdf8";
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(60, scanY);
      ctx.lineTo(W - 60, scanY);
      ctx.stroke();
    } else if (characterImgRef.current && characterLoaded) {
      // 4. ON-SCREEN ANIMATED CHARACTER WITH DYNAMIC MOTION
      const img = characterImgRef.current;

      // Motion calculations:
      // Breathing floating vertical bounce
      const floatY = Math.sin(time * 2.8) * 16;
      // Slight rhythmic horizontal sway
      const swayX = Math.cos(time * 1.6) * 10;
      // Mouse cursor interactive tracking offset
      const mouseX = pointer.x * 40;
      const mouseY = -pointer.y * 30;
      // Breathing scale pulsation
      const breathScale = 1 + Math.sin(time * 3.2) * 0.025;

      const targetH = 380 * breathScale;
      const aspect = img.width > 0 ? img.width / img.height : 1;
      const targetW = targetH * aspect;

      const centerX = W / 2 + swayX + mouseX;
      const centerY = H / 2 + 25 + floatY + mouseY;

      const drawX = centerX - targetW / 2;
      const drawY = centerY - targetH / 2;

      // Glowing Aura underneath/behind the character
      ctx.save();
      ctx.shadowColor = "rgba(56, 189, 248, 0.75)";
      ctx.shadowBlur = 32;
      ctx.fillStyle = "rgba(56, 189, 248, 0.25)";
      ctx.beginPath();
      ctx.ellipse(centerX, centerY + targetH / 2 - 20, targetW * 0.4, 25, 0, 0, Math.PI * 2);
      ctx.fill();

      // Draw the uploaded character image
      ctx.drawImage(img, drawX, drawY, targetW, targetH);
      ctx.restore();
    }

    // 5. macOS Bottom Dock
    const dockW = 340;
    const dockH = 46;
    const dockX = (W - dockW) / 2;
    const dockY = H - dockH - 12;

    ctx.fillStyle = "rgba(255, 255, 255, 0.18)";
    ctx.beginPath();
    ctx.roundRect(dockX, dockY, dockW, dockH, [18]);
    ctx.fill();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.35)";
    ctx.lineWidth = 1;
    ctx.stroke();

    // Dock app icons
    const iconColors = ["#38bdf8", "#f43f5e", "#f59e0b", "#10b981", "#8b5cf6", "#ec4899"];
    iconColors.forEach((color, i) => {
      const ix = dockX + 24 + i * 50;
      const iy = dockY + 9;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.roundRect(ix, iy, 28, 28, [8]);
      ctx.fill();
    });

    if (canvasTexRef.current) {
      canvasTexRef.current.needsUpdate = true;
    }
  }, [displayMode, characterLoaded]);

  // GSAP ScrollTrigger timeline for 3D camera/model rotation
  useEffect(() => {
    if (!groupRef.current) return;

    const context = gsap.context(() => {
      // Section 1: Glide right and orient towards viewer
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#section1",
            start: "top bottom",
            end: "top top",
            scrub: 1.0,
          },
        })
        .to(groupRef.current!.position, {
          x: 1.15,
          y: -0.35,
          z: 0.2,
          ease: "power2.inOut",
        })
        .to(
          groupRef.current!.rotation,
          {
            x: 0.12,
            y: Math.PI - 0.35,
            z: 0.02,
            ease: "power2.inOut",
          },
          "<"
        )
        .to(
          groupRef.current!.scale,
          {
            x: 0.95,
            y: 0.95,
            z: 0.95,
            ease: "power2.inOut",
          },
          "<"
        );

      // Section 2: Glide left and rotate to showcase thin side profile
      gsap
        .timeline({
          scrollTrigger: {
            trigger: "#section2",
            start: "top bottom",
            end: "top top",
            scrub: 1.0,
          },
        })
        .to(groupRef.current!.position, {
          x: -1.15,
          y: -0.3,
          z: 0.1,
          ease: "power2.inOut",
        })
        .to(
          groupRef.current!.rotation,
          {
            x: 0.18,
            y: Math.PI + 0.65,
            z: -0.05,
            ease: "power2.inOut",
          },
          "<"
        );
    });

    return () => context.revert();
  }, []);

  // Frame Loop: Smooth Breathing float & Canvas animation
  useFrame((state, delta) => {
    const { pointer, clock } = state;
    const t = clock.getElapsedTime();

    // 1. Update the Screen Canvas with real-time character motion
    renderScreenFrame(t, pointer);

    // 2. Gentle laptop breathing float & subtle mouse tilt
    if (floatRef.current) {
      floatRef.current.position.y = Math.sin(t * 1.5) * 0.02;
      floatRef.current.rotation.x = THREE.MathUtils.lerp(floatRef.current.rotation.x, pointer.y * 0.05, 0.05);
      floatRef.current.rotation.y = THREE.MathUtils.lerp(floatRef.current.rotation.y, pointer.x * 0.05, 0.05);
    }

    // 3. Dynamic 3D Pop-Out Hologram Motion (hovering in 3D space above keyboard)
    if (hologramGroupRef.current && displayMode === "hologram") {
      const hoverY = Math.sin(t * 2.5) * 0.08;
      hologramGroupRef.current.position.y = 0.45 + hoverY;

      // Face the camera & tilt smoothly with cursor
      hologramGroupRef.current.rotation.y = THREE.MathUtils.lerp(
        hologramGroupRef.current.rotation.y,
        Math.PI + pointer.x * 0.4,
        0.08
      );
      hologramGroupRef.current.rotation.x = THREE.MathUtils.lerp(
        hologramGroupRef.current.rotation.x,
        pointer.y * 0.25,
        0.08
      );

      // Spin the holographic pedestal ring
      if (hologramRingRef.current) {
        hologramRingRef.current.rotation.z += delta * 2.0;
      }
    }
  });

  return (
    <group
      ref={groupRef}
      position={[0, -0.55, 0]}
      rotation={[0.22, Math.PI, 0]}
      scale={1.1}
    >
      <group ref={floatRef}>
        {/* ======================================================== */}
        {/* MACBOOK TOP LID & SCREEN MESH                            */}
        {/* ======================================================== */}
        <mesh
          ref={topRef}
          rotation={[Math.PI / 2 + 0.14, 0, 0]}
          castShadow
          receiveShadow
          onClick={(e) => {
            e.stopPropagation();
            onScreenClick?.();
          }}
          onPointerOver={() => {
            document.body.style.cursor = "pointer";
          }}
          onPointerOut={() => {
            document.body.style.cursor = "default";
          }}
        >
          <primitive object={topModel.nodes.Top} />
        </mesh>

        {/* ======================================================== */}
        {/* 3D POP-OUT HOLOGRAPHIC CHARACTER (HOVERING ABOVE KEYBOARD)*/}
        {/* ======================================================== */}
        {hologramTexture && displayMode === "hologram" && (
          <group ref={hologramGroupRef} position={[0, 0.45, 0.35]}>
            {/* Hologram Character Billboard */}
            <mesh ref={hologramMeshRef}>
              <planeGeometry args={[1.5, 1.5]} />
              <meshBasicMaterial
                map={hologramTexture}
                transparent
                alphaTest={0.05}
                side={THREE.DoubleSide}
              />
            </mesh>

            {/* Glowing Holographic Pedestal Ring on the Keyboard */}
            <mesh
              ref={hologramRingRef}
              position={[0, -0.75, 0]}
              rotation={[-Math.PI / 2, 0, 0]}
            >
              <ringGeometry args={[0.55, 0.62, 32]} />
              <meshBasicMaterial color="#38bdf8" transparent opacity={0.85} side={THREE.DoubleSide} />
            </mesh>
            <mesh position={[0, -0.75, 0]} rotation={[-Math.PI / 2, 0, 0]}>
              <ringGeometry args={[0.3, 0.36, 32]} />
              <meshBasicMaterial color="#f59e0b" transparent opacity={0.7} side={THREE.DoubleSide} />
            </mesh>

            {/* Hologram Ambient Light illuminating the laptop */}
            <pointLight position={[0, 0, 0.3]} intensity={4.0} distance={3.5} color="#38bdf8" />
          </group>
        )}

        {/* ======================================================== */}
        {/* MACBOOK BOTTOM BASE (KEYBOARD, TRACKPAD, PORTS)           */}
        {/* ======================================================== */}
        <mesh ref={bottomRef} castShadow receiveShadow>
          <primitive object={bottomModel.nodes.Bottom} />
        </mesh>
      </group>
    </group>
  );
}
