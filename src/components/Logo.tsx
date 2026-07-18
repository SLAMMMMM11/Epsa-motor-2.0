import React from "react";

interface LogoProps {
  className?: string;
  variant?: "light" | "dark" | "blue-only";
}

export default function Logo({ className = "w-10 h-10", variant = "light" }: LogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      className={className}
      fill="none"
      aria-hidden="true"
    >
      <defs>
        {/* Deep, glossy metallic blue gradient */}
        <linearGradient id="metallicBlue" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#60a5fa" /> {/* Glossy Sapphire */}
          <stop offset="35%" stopColor="#2563eb" /> {/* Metallic Cobalt */}
          <stop offset="70%" stopColor="#1e3a8a" /> {/* Deep Cobalt-800 */}
          <stop offset="100%" stopColor="#0f172a" /> {/* Obsidian slate-900 */}
        </linearGradient>

        {/* Polished brushed silver gradient for highlights */}
        <linearGradient id="polishedSilver" x1="100%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="40%" stopColor="#cbd5e1" />
          <stop offset="80%" stopColor="#64748b" />
          <stop offset="100%" stopColor="#334155" />
        </linearGradient>

        {/* Drop shadow for high-end depth */}
        <filter id="premiumGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="5" floodColor="#2563eb" floodOpacity="0.3" />
        </filter>
      </defs>

      {/* Modern Shield Outline - Sleek and sharp, representing safety and structure */}
      <path
        d="M 50 12 L 82 24 C 82 56, 68 78, 50 88 C 32 78, 18 56, 18 24 Z"
        stroke="url(#polishedSilver)"
        strokeWidth="3.5"
        strokeLinejoin="round"
        fill="#09090b" /* Match zinc-950 canvas background */
        className="opacity-95"
      />

      {/* Abstract Inside: 3 Speed Fins & Lettermark (E / T)
          The 3 angled bars represent Bajaj's 3 wheels, DTS-i (triple spark) and dynamic forward acceleration. */}
      <g filter="url(#premiumGlow)">
        {/* Top bar */}
        <path
          d="M 32 34 L 68 34 L 60 41 L 32 41 Z"
          fill="url(#metallicBlue)"
        />
        {/* Middle bar */}
        <path
          d="M 32 46 L 62 46 L 54 53 L 32 53 Z"
          fill="url(#metallicBlue)"
        />
        {/* Bottom bar */}
        <path
          d="M 32 58 L 56 58 L 48 65 L 32 65 Z"
          fill="url(#metallicBlue)"
        />
        {/* Vertical Backbone of "E" - Polished chrome look */}
        <path
          d="M 28 30 L 33 30 L 33 69 L 28 69 Z"
          fill="url(#polishedSilver)"
        />
      </g>

      {/* Centerpiece Crown Spark dot (Represents Bajaj innovation) */}
      <circle cx="50" cy="23" r="3" fill="#60a5fa" className="animate-pulse" />
    </svg>
  );
}

