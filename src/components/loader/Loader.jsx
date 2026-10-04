import React from 'react';
import { isRtl } from "@/lib/utils";

const DOTS_DATA = [
  // 0: Red (Active Peak Head - Largest)
  {
    size: 14,
    bg: "radial-gradient(circle at 35% 32%, #FFA3A3 0%, #FF3030 55%, #D41515 100%)",
    shadow: "0 2px 7px rgba(255, 48, 48, 0.6), inset 0 -1.5px 2px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.85)",
  },
  // 1: Orange-Red
  {
    size: 13,
    bg: "radial-gradient(circle at 35% 32%, #FFB58A 0%, #FF5A15 55%, #D93B00 100%)",
    shadow: "0 2px 6px rgba(255, 90, 21, 0.55), inset 0 -1.5px 2px rgba(0,0,0,0.35), inset 0 1px 2px rgba(255,255,255,0.85)",
  },
  // 2: Orange
  {
    size: 12,
    bg: "radial-gradient(circle at 35% 32%, #FFCA85 0%, #FF8A00 55%, #D66E00 100%)",
    shadow: "0 1.5px 5px rgba(255, 138, 0, 0.5), inset 0 -1.2px 1.8px rgba(0,0,0,0.3), inset 0 1px 1.8px rgba(255,255,255,0.85)",
  },
  // 3: Warm Orange-Yellow
  {
    size: 11,
    bg: "radial-gradient(circle at 35% 32%, #FFE085 0%, #FFAE0D 55%, #DB8B00 100%)",
    shadow: "0 1.5px 4.5px rgba(255, 174, 13, 0.45), inset 0 -1px 1.5px rgba(0,0,0,0.3), inset 0 1px 1.5px rgba(255,255,255,0.85)",
  },
  // 4: Yellow
  {
    size: 10,
    bg: "radial-gradient(circle at 35% 32%, #FFF5A3 0%, #FFD21F 55%, #D9A900 100%)",
    shadow: "0 1.5px 4px rgba(255, 210, 31, 0.4), inset 0 -1px 1.5px rgba(0,0,0,0.25), inset 0 0.8px 1.5px rgba(255,255,255,0.85)",
  },
  // 5: Soft Yellow
  {
    size: 9,
    bg: "radial-gradient(circle at 35% 32%, #FFF9C2 0%, #FFC107 55%, #D69C00 100%)",
    shadow: "0 1px 3px rgba(255, 193, 7, 0.35), inset 0 -0.8px 1.2px rgba(0,0,0,0.25), inset 0 0.8px 1.2px rgba(255,255,255,0.85)",
  },
  // 6: Light Cyan
  {
    size: 8,
    bg: "radial-gradient(circle at 35% 32%, #C2F4FF 0%, #5ED0FA 55%, #18A7DE 100%)",
    shadow: "0 1px 3px rgba(94, 208, 250, 0.35), inset 0 -0.8px 1px rgba(0,0,0,0.2), inset 0 0.8px 1px rgba(255,255,255,0.85)",
  },
  // 7: Cyan
  {
    size: 7,
    bg: "radial-gradient(circle at 35% 32%, #A1EBFF 0%, #00AEEF 55%, #0087BA 100%)",
    shadow: "0 1px 2.5px rgba(0, 174, 239, 0.3), inset 0 -0.8px 1px rgba(0,0,0,0.2), inset 0 0.8px 1px rgba(255,255,255,0.85)",
  },
  // 8: Cyan-Blue
  {
    size: 6,
    bg: "radial-gradient(circle at 35% 32%, #9BE2FF 0%, #0BA0F4 55%, #007BC7 100%)",
    shadow: "0 1px 2px rgba(11, 160, 244, 0.25), inset 0 -0.5px 1px rgba(0,0,0,0.2), inset 0 0.5px 1px rgba(255,255,255,0.85)",
  },
  // 9: Blue (Smallest Tail)
  {
    size: 5.5,
    bg: "radial-gradient(circle at 35% 32%, #8FD3FF 0%, #168FF5 55%, #0066C4 100%)",
    shadow: "0 0.8px 2px rgba(22, 143, 245, 0.25), inset 0 -0.5px 1px rgba(0,0,0,0.2), inset 0 0.5px 1px rgba(255,255,255,0.85)",
  },
  // 10: Deep Blue
  {
    size: 5,
    bg: "radial-gradient(circle at 35% 32%, #7DC7FF 0%, #0B75D4 55%, #004FA3 100%)",
    shadow: "0 0.8px 2px rgba(11, 117, 212, 0.2), inset 0 -0.5px 1px rgba(0,0,0,0.2), inset 0 0.5px 1px rgba(255,255,255,0.85)",
  },
  // 11: Blue-Cyan
  {
    size: 6,
    bg: "radial-gradient(circle at 35% 32%, #A1EBFF 0%, #00AEEF 55%, #0087BA 100%)",
    shadow: "0 1px 2px rgba(0, 174, 239, 0.25), inset 0 -0.5px 1px rgba(0,0,0,0.2), inset 0 0.5px 1px rgba(255,255,255,0.85)",
  },
  // 12: Cyan-Yellow
  {
    size: 8,
    bg: "radial-gradient(circle at 35% 32%, #C2F4FF 0%, #5ED0FA 55%, #18A7DE 100%)",
    shadow: "0 1px 3px rgba(94, 208, 250, 0.3), inset 0 -0.8px 1px rgba(0,0,0,0.2), inset 0 0.8px 1px rgba(255,255,255,0.85)",
  },
  // 13: Yellow
  {
    size: 10,
    bg: "radial-gradient(circle at 35% 32%, #FFF5A3 0%, #FFD21F 55%, #D9A900 100%)",
    shadow: "0 1.5px 4px rgba(255, 210, 31, 0.4), inset 0 -1px 1.5px rgba(0,0,0,0.25), inset 0 0.8px 1.5px rgba(255,255,255,0.85)",
  },
  // 14: Orange
  {
    size: 12,
    bg: "radial-gradient(circle at 35% 32%, #FFCA85 0%, #FF8A00 55%, #D66E00 100%)",
    shadow: "0 1.5px 5px rgba(255, 138, 0, 0.5), inset 0 -1.2px 1.8px rgba(0,0,0,0.3), inset 0 1px 1.8px rgba(255,255,255,0.85)",
  },
];

const Loader = ({ background, height, width, screen }) => {
  const rtl = isRtl();
  const rotateDirection = rtl ? "animate-[spin_1.3s_linear_infinite_reverse]" : "animate-[spin_1.3s_linear_infinite]";

  const totalDots = DOTS_DATA.length;
  const radius = 23; // Distance from center to dot centers
  const center = 32; // Canvas center point (64px / 2)

  const renderGlossyOrbit = () => (
    <div className={`relative w-[64px] h-[64px] shrink-0 bg-transparent opacity-70 transition-opacity ${rotateDirection}`}>
      {DOTS_DATA.map((dot, index) => {
        const angleDeg = (index / totalDots) * 360 - 90; // Start top
        const angleRad = (angleDeg * Math.PI) / 180;
        const posX = center + radius * Math.cos(angleRad) - dot.size / 2;
        const posY = center + radius * Math.sin(angleRad) - dot.size / 2;

        return (
          <div
            key={index}
            className="absolute rounded-full transition-transform"
            style={{
              width: `${dot.size}px`,
              height: `${dot.size}px`,
              left: `${posX}px`,
              top: `${posY}px`,
              background: dot.bg,
              boxShadow: dot.shadow,
            }}
          >
            {/* Top-Left Glossy Specular Reflection */}
            <span
              className="absolute rounded-full pointer-events-none"
              style={{
                top: "12%",
                left: "14%",
                width: "40%",
                height: "28%",
                background: "radial-gradient(ellipse at center, rgba(255, 255, 255, 0.95) 0%, rgba(255, 255, 255, 0) 80%)",
                transform: "rotate(-25deg)",
              }}
            />
            {/* Bottom-Right Refraction Highlight */}
            <span
              className="absolute rounded-full pointer-events-none"
              style={{
                bottom: "10%",
                right: "12%",
                width: "35%",
                height: "24%",
                background: "rgba(255, 255, 255, 0.3)",
                filter: "blur(0.4px)",
              }}
            />
          </div>
        );
      })}
    </div>
  );

  if (screen === 'full') {
    return (
      <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-transparent pointer-events-none">
        {renderGlossyOrbit()}
      </div>
    );
  }

  return (
    <div
      className="flex items-center justify-center bg-transparent"
      style={{
        width: width || 'auto',
        height: height || 'auto',
        background: background && background !== 'none' ? background : 'transparent',
      }}
    >
      {renderGlossyOrbit()}
    </div>
  );
};

export default Loader;
