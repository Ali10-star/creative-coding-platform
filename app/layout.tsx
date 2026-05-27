// app/layout.tsx
import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import "./globals.css";

// Load Outfit with the weights the Bauhaus spec calls for.
// next/font handles self-hosting + CSS variable injection automatically.
const outfit = Outfit({
  subsets: ["latin"],
  weight: ["400", "500", "700", "900"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Creative Coding Platform",
  description: "Interactive sketches, fractals, and tutorials",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={outfit.variable}>
      <body>{children}</body>
    </html>
  );
}
