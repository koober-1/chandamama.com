import React from "react";

export const UrbanSketchSvg = ({ className = "" }) => (
  <svg
    viewBox="0 0 800 450"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    preserveAspectRatio="xMidYMid meet"
  >
    <defs>
      {/* Hatching patterns for urban architecture */}
      <pattern id="diagonalHatch" width="6" height="6" patternTransform="rotate(45 0 0)" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="0" y2="6" stroke="#475569" strokeWidth="1" strokeOpacity="0.4" />
      </pattern>
      <pattern id="crossHatch" width="8" height="8" patternUnits="userSpaceOnUse">
        <line x1="0" y1="0" x2="8" y2="8" stroke="#334155" strokeWidth="1" strokeOpacity="0.45" />
        <line x1="8" y1="0" x2="0" y2="8" stroke="#334155" strokeWidth="1" strokeOpacity="0.45" />
      </pattern>
    </defs>

    {/* Background Grid & Perspective Guidelines */}
    <g opacity="0.35" stroke="#94A3B8" strokeWidth="0.8" strokeDasharray="3 3">
      <line x1="0" y1="360" x2="800" y2="360" />
      <line x1="0" y1="390" x2="800" y2="390" />
      <line x1="50" y1="0" x2="180" y2="400" />
      <line x1="160" y1="0" x2="240" y2="400" />
      <line x1="680" y1="0" x2="620" y2="400" />
      <line x1="760" y1="0" x2="700" y2="400" />
    </g>

    {/* Distant Architectural Skyline (Wireframe) */}
    <g opacity="0.4" stroke="#64748B" strokeWidth="1.2">
      {/* Left building outlines */}
      <rect x="18" y="140" width="60" height="220" />
      <line x1="18" y1="170" x2="78" y2="170" />
      <line x1="18" y1="200" x2="78" y2="200" />
      <line x1="18" y1="230" x2="78" y2="230" />
      <line x1="18" y1="260" x2="78" y2="260" />
      <line x1="18" y1="290" x2="78" y2="290" />
      <line x1="48" y1="140" x2="48" y2="360" />

      {/* Modern tower 1 */}
      <polygon points="90,110 145,70 145,360 90,360" />
      <polygon points="145,70 180,95 180,360 145,360" fill="url(#diagonalHatch)" />

      {/* Triangular spire */}
      <polygon points="135,18 140,70 130,70" strokeWidth="1.5" />
      <line x1="135" y1="18" x2="135" y2="4" strokeWidth="2" />

      {/* Right side buildings */}
      <rect x="620" y="80" width="80" height="280" />
      <line x1="660" y1="80" x2="660" y2="360" />
      <line x1="620" y1="120" x2="700" y2="120" />
      <line x1="620" y1="160" x2="700" y2="160" />
      <line x1="620" y1="200" x2="700" y2="200" />
      <line x1="620" y1="240" x2="700" y2="240" />

      <polygon points="710,50 780,105 780,360 710,360" />
      <polygon points="710,50 690,80 690,360 710,360" fill="url(#diagonalHatch)" />
    </g>

    {/* Center Industrial Chimney Sketches (Exact motif from Apsara reference image) */}
    <g>
      {/* Chimney 1 (Left tall tower) */}
      <polygon points="360,110 395,110 405,370 350,370" fill="#1E293B" />
      <polygon points="360,110 395,110 405,370 350,370" fill="url(#crossHatch)" />
      <line x1="358" y1="110" x2="397" y2="110" stroke="#0F172A" strokeWidth="5" strokeLinecap="round" />
      {/* Ring bands */}
      <line x1="357" y1="160" x2="399" y2="160" stroke="#0F172A" strokeWidth="3" />
      <line x1="354" y1="220" x2="401" y2="220" stroke="#0F172A" strokeWidth="3" />
      <line x1="352" y1="290" x2="403" y2="290" stroke="#0F172A" strokeWidth="3" />

      {/* Chimney 2 (Right tall tower) */}
      <polygon points="440,85 480,85 492,370 430,370" fill="#0F172A" />
      <polygon points="440,85 480,85 492,370 430,370" fill="url(#crossHatch)" />
      <line x1="438" y1="85" x2="482" y2="85" stroke="#000000" strokeWidth="6" strokeLinecap="round" />
      {/* Ring bands */}
      <line x1="436" y1="140" x2="484" y2="140" stroke="#000000" strokeWidth="4" />
      <line x1="434" y1="205" x2="487" y2="205" stroke="#000000" strokeWidth="4" />
      <line x1="432" y1="280" x2="490" y2="280" stroke="#000000" strokeWidth="4" />

      {/* Chimney 3 (Shorter middle tower) */}
      <polygon points="405,170 435,170 442,370 398,370" fill="#334155" />
      <line x1="403" y1="170" x2="437" y2="170" stroke="#1E293B" strokeWidth="4" strokeLinecap="round" />

      {/* Billowing Ink-Hatched Smoke Plumes (Artistic Sketch Style from Image) */}
      {/* Smoke from Chimney 1 */}
      <path
        d="M375 110C350 95 330 85 345 60C358 40 330 25 350 10C365 2 385 10 395 24C410 42 385 65 405 85C415 95 390 108 375 110Z"
        fill="#334155"
        fillOpacity="0.85"
      />
      <path
        d="M360 80C340 70 350 55 365 48C380 40 375 25 390 30"
        stroke="#FFFFFF"
        strokeWidth="1.5"
        strokeLinecap="round"
      />

      {/* Smoke from Chimney 2 */}
      <path
        d="M460 85C435 68 445 45 470 35C495 24 485 5 515 2C545 -2 555 18 545 38C535 58 560 70 545 88C530 105 480 95 460 85Z"
        fill="#1E293B"
        fillOpacity="0.9"
      />
      <path
        d="M475 60C495 50 510 35 530 42C540 48 535 65 520 72"
        stroke="#FFFFFF"
        strokeWidth="1.8"
        strokeLinecap="round"
      />

      {/* Smoke from Chimney 3 drifting right */}
      <path
        d="M420 170C400 155 410 135 430 130C450 125 465 140 450 160C440 172 430 168 420 170Z"
        fill="#475569"
        fillOpacity="0.8"
      />
    </g>

    {/* Light architectural perspective lines in foreground */}
    <g opacity="0.4" stroke="#475569" strokeWidth="1">
      <line x1="280" y1="360" x2="560" y2="360" />
      <line x1="300" y1="380" x2="540" y2="380" />
      <line x1="320" y1="400" x2="520" y2="400" />
    </g>
  </svg>
);
