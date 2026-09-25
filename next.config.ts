import type { NextConfig } from "next";

const isGitHubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGitHubPages ? "/nextjs-3d-scroll-animations" : "";

const nextConfig: NextConfig = {
  // output: "export", // Disabled for Node.js / HTTPS custom server
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  allowedDevOrigins: [
    "localhost:3000",
    "*.ngrok-free.dev",
    "*.ngrok.app",
    "glennis-pseudosyphilitic-maude.ngrok-free.dev",
  ],
};

export default nextConfig;
