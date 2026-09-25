import "./globals.css";
import type { Metadata } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Next.js 3D Scroll Experience",
  description: "High-performance cinematic 3D scroll animations",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <link rel="prefetch" href="/assets/Macbook_Top.glb" as="fetch" crossOrigin="anonymous" />
        <link rel="prefetch" href="/assets/Macbook_Bottom.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
