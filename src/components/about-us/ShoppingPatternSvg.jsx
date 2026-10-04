import React from "react";

export const ShoppingPatternSvg = ({ className = "" }) => (
  <svg
    viewBox="0 0 800 450"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="xMidYMid meet"
  >
    {/* Soft subtle grid guidelines */}
    <g opacity="0.25" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="4 4">
      <line x1="0" y1="360" x2="800" y2="360" />
      <line x1="0" y1="180" x2="800" y2="180" />
      <line x1="200" y1="0" x2="200" y2="450" />
      <line x1="400" y1="0" x2="400" y2="450" />
      <line x1="600" y1="0" x2="600" y2="450" />
    </g>

    {/* Lifestyle & E-commerce Line Art Elements */}
    <g opacity="0.35" stroke="#475569" strokeWidth="1.5">
      {/* Shopping Cart Outline (Left Background) */}
      <g transform="translate(60, 140)">
        <path d="M10 10H26L38 60H78L88 24H28" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="44" cy="72" r="6" />
        <circle cx="74" cy="72" r="6" />
      </g>

      {/* Gift Box Outline */}
      <g transform="translate(130, 240)">
        <rect x="0" y="8" width="36" height="32" rx="4" />
        <rect x="-2" y="4" width="40" height="8" rx="2" />
        <line x1="18" y1="4" x2="18" y2="40" />
        <line x1="0" y1="22" x2="36" y2="22" />
      </g>

      {/* Football Outline */}
      <g transform="translate(680, 120)">
        <circle cx="28" cy="28" r="24" />
        <polygon points="28,16 36,22 33,32 23,32 20,22" />
      </g>

      {/* Kitchen Teapot / Cookware Outline */}
      <g transform="translate(710, 260)">
        <path d="M10 20C10 10 40 10 40 20H10Z" />
        <rect x="8" y="20" width="34" height="24" rx="4" />
        <path d="M42 26H48C50 26 52 28 52 30V34C52 36 50 38 48 38H42" />
      </g>

      {/* Star Sparks & Floating Confetti */}
      <polygon points="120,80 123,87 130,88 125,93 126,100 120,96 114,100 115,93 110,88 117,87" fill="#CBD5E1" stroke="none" />
      <polygon points="650,80 653,87 660,88 655,93 656,100 650,96 644,100 645,93 640,88 647,87" fill="#CBD5E1" stroke="none" />
      <polygon points="400,60 403,67 410,68 405,73 406,80 400,76 394,80 395,73 390,68 397,67" fill="#CBD5E1" stroke="none" />
    </g>

    {/* Big Soft Crescent Moon (Chandamama Symbolism) */}
    <g opacity="0.12" fill="#0BADFB">
      <path d="M420 120C475 120 520 165 520 220C520 275 475 320 420 320C405 320 390 316 378 310C420 295 450 255 450 210C450 165 420 125 378 110C390 104 405 120 420 120Z" />
    </g>
  </svg>
);
