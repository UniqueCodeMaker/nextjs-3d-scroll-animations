export interface CharacterPreset {
  id: string;
  name: string;
  tag: string;
  color: string;
  dataUrl: string;
}

// Crisp, high-resolution SVG character avatars with transparent backgrounds
const ASTRO_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <radialGradient id="visorGrad" cx="40%" cy="40%" r="60%">
      <stop offset="0%" stop-color="#38bdf8"/>
      <stop offset="50%" stop-color="#0284c7"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </radialGradient>
    <linearGradient id="bodyGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#f8fafc"/>
      <stop offset="70%" stop-color="#cbd5e1"/>
      <stop offset="100%" stop-color="#64748b"/>
    </linearGradient>
    <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Floating Thrusters Jetpack Particles -->
  <circle cx="210" cy="460" r="14" fill="#38bdf8" opacity="0.8" filter="url(#neonGlow)"/>
  <circle cx="302" cy="460" r="14" fill="#38bdf8" opacity="0.8" filter="url(#neonGlow)"/>
  <circle cx="210" cy="490" r="8" fill="#0284c7" opacity="0.5"/>
  <circle cx="302" cy="490" r="8" fill="#0284c7" opacity="0.5"/>
  <!-- Backpack -->
  <rect x="176" y="160" width="160" height="240" rx="30" fill="#475569" stroke="#94a3b8" stroke-width="4"/>
  <!-- Body Suit -->
  <path d="M 190 230 C 190 200, 322 200, 322 230 L 334 370 C 334 390, 178 390, 178 370 Z" fill="url(#bodyGrad)"/>
  <!-- Chest Hologram Plate -->
  <rect x="216" y="240" width="80" height="60" rx="10" fill="#0f172a" stroke="#38bdf8" stroke-width="3" filter="url(#neonGlow)"/>
  <circle cx="236" cy="270" r="6" fill="#38bdf8"/>
  <rect x="252" y="264" width="32" height="4" rx="2" fill="#38bdf8"/>
  <rect x="252" y="272" width="24" height="4" rx="2" fill="#0284c7"/>
  <!-- Legs -->
  <path d="M 196 370 L 190 440 C 190 455, 230 455, 230 440 L 236 370 Z" fill="url(#bodyGrad)"/>
  <path d="M 276 370 L 282 440 C 282 455, 322 455, 322 440 L 316 370 Z" fill="url(#bodyGrad)"/>
  <!-- Arms & Gloves -->
  <path d="M 190 230 C 150 250, 140 310, 150 340 C 158 355, 175 350, 175 335 C 168 310, 175 270, 196 250 Z" fill="url(#bodyGrad)"/>
  <path d="M 322 230 C 362 250, 372 310, 362 340 C 354 355, 337 350, 337 335 C 344 310, 337 270, 316 250 Z" fill="url(#bodyGrad)"/>
  <!-- Helmet Outer -->
  <circle cx="256" cy="155" r="92" fill="url(#bodyGrad)" stroke="#cbd5e1" stroke-width="4"/>
  <!-- Visor -->
  <ellipse cx="256" cy="155" rx="72" ry="58" fill="url(#visorGrad)" stroke="#38bdf8" stroke-width="3" filter="url(#neonGlow)"/>
  <!-- Visor Glass Reflection -->
  <path d="M 215 125 C 230 115, 270 115, 295 128 C 285 132, 240 130, 222 142 Z" fill="#ffffff" opacity="0.65"/>
  <!-- Cyber Antenna -->
  <line x1="335" y1="130" x2="365" y2="95" stroke="#94a3b8" stroke-width="4" stroke-linecap="round"/>
  <circle cx="368" cy="92" r="7" fill="#38bdf8" filter="url(#neonGlow)"/>
</svg>`;

const MECH_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="mechPlate" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#334155"/>
      <stop offset="50%" stop-color="#1e293b"/>
      <stop offset="100%" stop-color="#0f172a"/>
    </linearGradient>
    <filter id="amberGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="6" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Cybernetic Shoulders -->
  <polygon points="120,200 170,160 210,210 150,260" fill="#475569" stroke="#f59e0b" stroke-width="3"/>
  <polygon points="392,200 342,160 302,210 362,260" fill="#475569" stroke="#f59e0b" stroke-width="3"/>
  <!-- Torso Armored Chassis -->
  <polygon points="180,200 332,200 310,350 202,350" fill="url(#mechPlate)" stroke="#64748b" stroke-width="4"/>
  <!-- Glowing Reactor Core -->
  <circle cx="256" cy="275" r="32" fill="#0f172a" stroke="#f59e0b" stroke-width="4"/>
  <polygon points="256,252 276,286 236,286" fill="#f59e0b" filter="url(#amberGlow)"/>
  <!-- Head Chassis -->
  <polygon points="206,140 306,140 326,170 306,200 206,200 186,170" fill="url(#mechPlate)" stroke="#f59e0b" stroke-width="3"/>
  <!-- Visor Lens -->
  <rect x="216" y="160" width="80" height="18" rx="6" fill="#f59e0b" filter="url(#amberGlow)"/>
  <!-- Horn Antennas -->
  <polygon points="196,140 166,90 186,90 206,130" fill="#f59e0b"/>
  <polygon points="316,140 346,90 326,90 306,130" fill="#f59e0b"/>
  <!-- Pelvis & Legs -->
  <polygon points="202,350 310,350 286,400 226,400" fill="#334155" stroke="#64748b" stroke-width="3"/>
  <rect x="190" y="400" width="45" height="70" rx="8" fill="url(#mechPlate)" stroke="#475569" stroke-width="3"/>
  <rect x="277" y="400" width="45" height="70" rx="8" fill="url(#mechPlate)" stroke="#475569" stroke-width="3"/>
  <!-- Hydraulic Arm Cannons -->
  <rect x="120" y="260" width="40" height="90" rx="8" fill="url(#mechPlate)" stroke="#64748b" stroke-width="3"/>
  <rect x="352" y="260" width="40" height="90" rx="8" fill="url(#mechPlate)" stroke="#64748b" stroke-width="3"/>
</svg>`;

const SAMURAI_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <filter id="crimsonGlow" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="8" result="blur"/>
      <feMerge>
        <feMergeNode in="blur"/>
        <feMergeNode in="SourceGraphic"/>
      </feMerge>
    </filter>
  </defs>
  <!-- Glowing Katana Energy Blade -->
  <line x1="370" y1="90" x2="310" y2="440" stroke="#f43f5e" stroke-width="6" stroke-linecap="round" filter="url(#crimsonGlow)"/>
  <line x1="370" y1="90" x2="310" y2="440" stroke="#ffffff" stroke-width="2" stroke-linecap="round"/>
  <!-- Katana Hilt -->
  <rect x="300" y="380" width="16" height="50" rx="3" fill="#1e293b" transform="rotate(-12, 300, 380)"/>
  <!-- Flowing Ronin Cloak -->
  <path d="M 190 210 Q 150 320, 130 450 Q 256 460, 360 440 Q 340 310, 322 210 Z" fill="#0f172a" stroke="#e11d48" stroke-width="3"/>
  <!-- Chest Hakama -->
  <path d="M 210 210 L 256 280 L 302 210 L 286 360 L 226 360 Z" fill="#1e293b" stroke="#f43f5e" stroke-width="2"/>
  <!-- Demon Oni Mask / Helmet -->
  <polygon points="256,120 200,160 210,210 256,230 302,210 312,160" fill="#020617" stroke="#f43f5e" stroke-width="4"/>
  <!-- Glowing Mask Eyes -->
  <polygon points="225,180 245,185 230,192" fill="#f43f5e" filter="url(#crimsonGlow)"/>
  <polygon points="287,180 267,185 282,192" fill="#f43f5e" filter="url(#crimsonGlow)"/>
  <!-- Helmet Horn Crest (Kabuto) -->
  <path d="M 256 120 C 230 70, 180 75, 170 95 C 195 105, 230 115, 256 120 Z" fill="#f59e0b"/>
  <path d="M 256 120 C 282 70, 332 75, 342 95 C 317 105, 282 115, 256 120 Z" fill="#f59e0b"/>
  <circle cx="256" cy="115" r="9" fill="#f43f5e" filter="url(#crimsonGlow)"/>
</svg>`;

export const CHARACTER_PRESETS: CharacterPreset[] = [
  {
    id: "astro",
    name: "Neon Astro",
    tag: "Space Explorer",
    color: "#38bdf8",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(ASTRO_SVG)}`,
  },
  {
    id: "mech",
    name: "Cyber Mech",
    tag: "Heavy Android",
    color: "#f59e0b",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(MECH_SVG)}`,
  },
  {
    id: "samurai",
    name: "Anime Ronin",
    tag: "Blade Master",
    color: "#f43f5e",
    dataUrl: `data:image/svg+xml;utf8,${encodeURIComponent(SAMURAI_SVG)}`,
  },
];
