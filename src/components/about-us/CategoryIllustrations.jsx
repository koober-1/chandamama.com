import React from "react";

// 1. Toys & Games (Teddy Bear, Toy Train, Building Blocks)
export const ToysSvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="48" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Cute Teddy Bear */}
    <g transform="translate(18, 20)">
      {/* Ears */}
      <circle cx="42" cy="38" r="10" fill="#D97706" />
      <circle cx="42" cy="38" r="6" fill="#FDE68A" />
      <circle cx="78" cy="38" r="10" fill="#D97706" />
      <circle cx="78" cy="38" r="6" fill="#FDE68A" />

      {/* Head */}
      <circle cx="60" cy="54" r="22" fill="#B45309" />
      {/* Muzzle */}
      <ellipse cx="60" cy="60" rx="11" ry="8" fill="#FDE68A" />
      <ellipse cx="60" cy="56" rx="4" ry="3" fill="#1E293B" />
      <path d="M60 59V64M57 63C58.5 65 61.5 65 63 63" stroke="#1E293B" strokeWidth="1.5" strokeLinecap="round" />
      {/* Eyes */}
      <circle cx="52" cy="50" r="3" fill="#1E293B" />
      <circle cx="53" cy="49" r="1" fill="#FFFFFF" />
      <circle cx="68" cy="50" r="3" fill="#1E293B" />
      <circle cx="69" cy="49" r="1" fill="#FFFFFF" />

      {/* Body */}
      <ellipse cx="60" cy="86" rx="20" ry="24" fill="#B45309" />
      <ellipse cx="60" cy="88" rx="13" ry="16" fill="#FDE68A" />

      {/* Red Bow Tie */}
      <polygon points="53,70 67,76 53,76" fill="#EF4444" />
      <polygon points="67,70 53,76 67,76" fill="#EF4444" />
      <circle cx="60" cy="74" r="3" fill="#DC2626" />

      {/* Arms & Paws */}
      <circle cx="38" cy="80" r="8" fill="#B45309" />
      <circle cx="38" cy="80" r="4.5" fill="#FDE68A" />
      <circle cx="82" cy="80" r="8" fill="#B45309" />
      <circle cx="82" cy="80" r="4.5" fill="#FDE68A" />

      {/* Feet */}
      <ellipse cx="44" cy="106" rx="9" ry="7" fill="#B45309" />
      <ellipse cx="44" cy="106" rx="5" ry="4" fill="#FDE68A" />
      <ellipse cx="76" cy="106" rx="9" ry="7" fill="#B45309" />
      <ellipse cx="76" cy="106" rx="5" ry="4" fill="#FDE68A" />
    </g>

    {/* Wooden Toy Blocks next to Teddy */}
    <g transform="translate(86, 96)">
      {/* Block 1 (Red with 'A') */}
      <rect x="0" y="8" width="22" height="22" rx="3" fill="#EF4444" />
      <rect x="0" y="8" width="22" height="4" fill="#F87171" />
      <text x="11" y="24" textAnchor="middle" fill="#FFFFFF" fontSize="13" fontWeight="900">A</text>
      
      {/* Block 2 (Blue with '1') */}
      <rect x="18" y="0" width="20" height="20" rx="3" fill="#0284C7" />
      <rect x="18" y="0" width="20" height="4" fill="#38BDF8" />
      <text x="28" y="15" textAnchor="middle" fill="#FFFFFF" fontSize="12" fontWeight="900">1</text>
    </g>
  </svg>
);

// 2. Sports & Fitness (Cricket Bat, Ball, Football, Shuttlecock)
export const SportsSvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="50" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Classic Football / Soccer Ball */}
    <g transform="translate(18, 70)">
      <circle cx="34" cy="34" r="30" fill="#FFFFFF" stroke="#1E293B" strokeWidth="2.5" />
      {/* Center Pentagon */}
      <polygon points="34,22 44,29 40,41 28,41 24,29" fill="#0F172A" />
      {/* Connecting Seam Lines */}
      <line x1="34" y1="22" x2="34" y2="8" stroke="#1E293B" strokeWidth="2" />
      <line x1="44" y1="29" x2="56" y2="24" stroke="#1E293B" strokeWidth="2" />
      <line x1="40" y1="41" x2="50" y2="52" stroke="#1E293B" strokeWidth="2" />
      <line x1="28" y1="41" x2="18" y2="52" stroke="#1E293B" strokeWidth="2" />
      <line x1="24" y1="29" x2="12" y2="24" stroke="#1E293B" strokeWidth="2" />
    </g>

    {/* Cricket Bat (Angled across) */}
    <g transform="rotate(22 96 68)">
      {/* Handle */}
      <rect x="94" y="8" width="9" height="34" rx="4.5" fill="#FFFFFF" stroke="#0F172A" strokeWidth="1.5" />
      {/* Grip wraps */}
      <line x1="94" y1="14" x2="103" y2="14" stroke="#00ADBB" strokeWidth="2" />
      <line x1="94" y1="20" x2="103" y2="20" stroke="#00ADBB" strokeWidth="2" />
      <line x1="94" y1="26" x2="103" y2="26" stroke="#00ADBB" strokeWidth="2" />
      <line x1="94" y1="32" x2="103" y2="32" stroke="#00ADBB" strokeWidth="2" />

      {/* Bat Blade */}
      <path
        d="M91 42C91 39 93 38 98.5 38C104 38 106 39 106 42V124C106 128 103 130 98.5 130C94 130 91 128 91 124V42Z"
        fill="#D97706"
        stroke="#92400E"
        strokeWidth="1.5"
      />
      {/* Wood grain & center spine */}
      <line x1="98.5" y1="42" x2="98.5" y2="126" stroke="#FDE68A" strokeWidth="2.5" />
      {/* Colored Sticker */}
      <rect x="92" y="52" width="13" height="28" fill="#EF4444" />
      <text x="98.5" y="68" textAnchor="middle" fill="#FFFFFF" fontSize="6" fontWeight="bold">PRO</text>
    </g>

    {/* Red Leather Cricket Ball */}
    <g transform="translate(108, 102)">
      <circle cx="16" cy="16" r="14" fill="#DC2626" />
      <path d="M5 16C10 24 22 24 27 16" stroke="#FFFFFF" strokeWidth="2" strokeDasharray="2 1" />
      <circle cx="11" cy="11" r="2.5" fill="#F87171" />
    </g>
  </svg>
);

// 3. Home & Kitchen (Pressure Cooker / Pot, Blender & Utensils)
export const HomeKitchenSvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="48" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Modern Kitchen Blender */}
    <g transform="translate(24, 34)">
      {/* Glass Jar */}
      <path d="M22 18L18 72H46L42 18H22Z" fill="#E0F2FE" stroke="#0284C7" strokeWidth="2" />
      {/* Jar measurement markings */}
      <line x1="23" y1="32" x2="30" y2="32" stroke="#38BDF8" strokeWidth="1.5" />
      <line x1="22" y1="44" x2="32" y2="44" stroke="#38BDF8" strokeWidth="1.5" />
      <line x1="21" y1="56" x2="30" y2="56" stroke="#38BDF8" strokeWidth="1.5" />
      {/* Blender Lid */}
      <rect x="18" y="12" width="28" height="7" rx="3" fill="#0F172A" />
      <rect x="28" y="6" width="8" height="6" rx="2" fill="#0284C7" />
      {/* Blender Base */}
      <path d="M14 72H50L53 100H11L14 72Z" fill="#1E293B" />
      <rect x="11" y="98" width="42" height="4" rx="2" fill="#0F172A" />
      {/* Speed Dial Knob */}
      <circle cx="32" cy="86" r="6" fill="#00ADBB" />
      <line x1="32" y1="83" x2="32" y2="86" stroke="#FFFFFF" strokeWidth="1.8" />
    </g>

    {/* Stainless Steel Cooking Pot / Casserole */}
    <g transform="translate(74, 60)">
      {/* Pot Body */}
      <rect x="10" y="24" width="56" height="44" rx="8" fill="#CBD5E1" stroke="#64748B" strokeWidth="2" />
      <rect x="14" y="24" width="12" height="44" fill="#E2E8F0" />
      
      {/* Pot Handles */}
      <path d="M10 36H2C0.9 36 0 36.9 0 38V44C0 45.1 0.9 46 2 46H10" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M66 36H74C75.1 36 76 36.9 76 38V44C76 45.1 75.1 46 74 46H66" stroke="#1E293B" strokeWidth="2.5" strokeLinecap="round" />

      {/* Domed Glass Lid */}
      <path d="M10 24C10 12 66 12 66 24H10Z" fill="#94A3B8" stroke="#475569" strokeWidth="1.5" />
      {/* Lid Knob */}
      <rect x="34" y="6" width="8" height="6" rx="2" fill="#1E293B" />
    </g>
  </svg>
);

// 4. Baby & Kids (Stroller, Feeding Bottle, Rattle)
export const BabyKidsSvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="46" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Baby Stroller */}
    <g transform="translate(24, 28)">
      {/* Stroller Hood / Seat */}
      <path d="M22 66C22 36 58 36 68 66H22Z" fill="#38BDF8" stroke="#0284C7" strokeWidth="2" />
      <path d="M22 66C22 78 48 84 64 74L68 66H22Z" fill="#0284C7" />
      {/* Soft Cushion inside */}
      <ellipse cx="44" cy="62" rx="14" ry="6" fill="#BAE6FD" />

      {/* Stroller Metal Frame */}
      <line x1="64" y1="46" x2="36" y2="98" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
      <line x1="36" y1="68" x2="68" y2="98" stroke="#64748B" strokeWidth="3" strokeLinecap="round" />
      {/* Handle Bar */}
      <path d="M64 46L76 28C77 26 80 26 82 28" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" />

      {/* Wheels */}
      <circle cx="36" cy="98" r="9" fill="#1E293B" />
      <circle cx="36" cy="98" r="4" fill="#E2E8F0" />
      <circle cx="68" cy="98" r="9" fill="#1E293B" />
      <circle cx="68" cy="98" r="4" fill="#E2E8F0" />
    </g>

    {/* Milk Feeding Bottle */}
    <g transform="translate(100, 52)">
      <rect x="10" y="24" width="22" height="42" rx="6" fill="#F8FAFC" stroke="#00ADBB" strokeWidth="2" />
      <rect x="14" y="34" width="14" height="24" fill="#FEF08A" fillOpacity="0.6" />
      <line x1="12" y1="36" x2="18" y2="36" stroke="#94A3B8" strokeWidth="1.2" />
      <line x1="12" y1="44" x2="20" y2="44" stroke="#94A3B8" strokeWidth="1.2" />
      {/* Bottle Cap & Nipple */}
      <rect x="8" y="18" width="26" height="7" rx="2" fill="#F43F5E" />
      <path d="M17 18C17 12 25 12 25 18H17Z" fill="#FBBF24" />
    </g>
  </svg>
);

// 5. Household Essentials (Storage Basket, Spray Cleaner, Organizer)
export const HouseholdSvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="48" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Storage / Organizer Laundry Basket */}
    <g transform="translate(48, 54)">
      <path d="M8 24L16 78H74L82 24H8Z" fill="#00ADBB" />
      <rect x="4" y="20" width="82" height="8" rx="4" fill="#008B97" />
      {/* Woven Ventilation Holes */}
      <g fill="#007984">
        <rect x="22" y="36" width="6" height="6" rx="1.5" />
        <rect x="36" y="36" width="6" height="6" rx="1.5" />
        <rect x="50" y="36" width="6" height="6" rx="1.5" />
        <rect x="64" y="36" width="6" height="6" rx="1.5" />

        <rect x="24" y="48" width="6" height="6" rx="1.5" />
        <rect x="38" y="48" width="6" height="6" rx="1.5" />
        <rect x="52" y="48" width="6" height="6" rx="1.5" />
        <rect x="66" y="48" width="6" height="6" rx="1.5" />

        <rect x="26" y="60" width="6" height="6" rx="1.5" />
        <rect x="40" y="60" width="6" height="6" rx="1.5" />
        <rect x="54" y="60" width="6" height="6" rx="1.5" />
        <rect x="68" y="60" width="6" height="6" rx="1.5" />
      </g>
      {/* Folded Towels Peeking from top */}
      <rect x="14" y="10" width="46" height="12" rx="4" fill="#FBBF24" />
      <rect x="20" y="2" width="44" height="10" rx="4" fill="#38BDF8" />
    </g>

    {/* Household Spray Cleaner Bottle */}
    <g transform="translate(18, 48)">
      <rect x="12" y="36" width="22" height="48" rx="6" fill="#10B981" />
      <path d="M17 36L19 22H27L29 36H17Z" fill="#059669" />
      {/* Trigger Spray Nozzle */}
      <path d="M21 22V14H36L42 20L36 22H21Z" fill="#1E293B" />
      <path d="M36 22L32 30" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round" />
      <circle cx="42" cy="18" r="2" fill="#FBBF24" />
      {/* Clean label */}
      <rect x="15" y="48" width="16" height="18" rx="2" fill="#FFFFFF" />
      <path d="M21 54L23 58L27 52" stroke="#10B981" strokeWidth="1.8" strokeLinecap="round" />
    </g>
  </svg>
);

// 6. Stationery & Books (Stacked Notebooks, Highlighters, Pen Stand)
export const StationerySvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="48" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Stack of Colorful Books & Notebooks */}
    <g transform="translate(24, 62)">
      {/* Bottom Book (Deep Blue) */}
      <path d="M12 48L68 56L96 46L40 38L12 48Z" fill="#1E3A8A" />
      <path d="M12 48V60L68 68V56L12 48Z" fill="#172554" />
      <path d="M68 68L96 58V46L68 56V68Z" fill="#F8FAFC" />

      {/* Middle Book (Vibrant Orange) */}
      <path d="M16 34L70 42L94 32L42 26L16 34Z" fill="#EA580C" />
      <path d="M16 34V46L70 54V42L16 34Z" fill="#C2410C" />
      <path d="M70 54L94 44V32L70 42V54Z" fill="#F8FAFC" />

      {/* Top Notebook (Cyan with Ribbon bookmark) */}
      <path d="M20 20L72 28L92 18L42 12L20 20Z" fill="#00ADBB" />
      <path d="M20 20V32L72 40V28L20 20Z" fill="#008B97" />
      <path d="M72 40L92 30V18L72 28V40Z" fill="#F8FAFC" />
      {/* Golden Bookmark ribbon */}
      <path d="M52 25L56 46L60 42L64 46L62 27" fill="#FACC15" />
    </g>

    {/* Modern Pen & Pencil Container */}
    <g transform="translate(98, 38)">
      {/* Cup / Container */}
      <rect x="6" y="44" width="30" height="42" rx="4" fill="#334155" />
      <rect x="8" y="46" width="26" height="38" rx="2" fill="#1E293B" />
      
      {/* Pen 1 (Yellow) */}
      <rect x="10" y="16" width="4.5" height="38" rx="1.5" fill="#FACC15" transform="rotate(-8 10 16)" />
      {/* Pen 2 (Red) */}
      <rect x="18" y="12" width="4.5" height="42" rx="1.5" fill="#EF4444" />
      {/* Pen 3 (Cyan) */}
      <rect x="26" y="16" width="4.5" height="38" rx="1.5" fill="#06B6D4" transform="rotate(8 26 16)" />
      {/* Ruler sticking out */}
      <rect x="14" y="6" width="6" height="48" fill="#E2E8F0" transform="rotate(12 14 6)" />
    </g>
  </svg>
);

// 7. Outdoor & Cycles (Bicycle, Skateboard, Helmet)
export const OutdoorCyclesSvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="52" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Modern Bicycle Graphic */}
    <g transform="translate(18, 44)">
      {/* Wheels */}
      <circle cx="26" cy="68" r="22" stroke="#1E293B" strokeWidth="4.5" fill="none" />
      <circle cx="26" cy="68" r="4" fill="#00ADBB" />
      <circle cx="98" cy="68" r="22" stroke="#1E293B" strokeWidth="4.5" fill="none" />
      <circle cx="98" cy="68" r="4" fill="#00ADBB" />

      {/* Bicycle Frame */}
      {/* Bottom Bracket to Rear Axle */}
      <line x1="26" y1="68" x2="60" y2="68" stroke="#00ADBB" strokeWidth="4" strokeLinecap="round" />
      {/* Rear Axle to Seat */}
      <line x1="26" y1="68" x2="48" y2="34" stroke="#00ADBB" strokeWidth="4" strokeLinecap="round" />
      {/* Seat to Bottom Bracket */}
      <line x1="48" y1="34" x2="60" y2="68" stroke="#00ADBB" strokeWidth="4" strokeLinecap="round" />
      {/* Bottom Bracket to Headtube */}
      <line x1="60" y1="68" x2="84" y2="28" stroke="#00ADBB" strokeWidth="4" strokeLinecap="round" />
      {/* Seat to Headtube (Top Tube) */}
      <line x1="48" y1="34" x2="84" y2="28" stroke="#00ADBB" strokeWidth="4" strokeLinecap="round" />
      {/* Front Fork */}
      <line x1="84" y1="28" x2="98" y2="68" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />

      {/* Seat */}
      <path d="M38 28C38 26 42 24 48 24H56C60 24 62 26 60 28H38Z" fill="#1E293B" />
      
      {/* Handlebars */}
      <line x1="84" y1="28" x2="84" y2="20" stroke="#0F172A" strokeWidth="3" />
      <path d="M76 18H90C92 18 94 20 94 22" stroke="#1E293B" strokeWidth="3.5" strokeLinecap="round" fill="none" />

      {/* Pedals & Chain Ring */}
      <circle cx="60" cy="68" r="6" fill="#F59E0B" />
    </g>
  </svg>
);

// 8. Appliances & Gadgets (Electric Kettle, Toaster, Smart Headphones)
export const AppliancesSvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="48" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Modern Electric Kettle */}
    <g transform="translate(18, 44)">
      {/* Base */}
      <rect x="22" y="80" width="38" height="6" rx="2" fill="#1E293B" />
      {/* Kettle Body */}
      <path d="M26 80L30 30H52L56 80H26Z" fill="#E2E8F0" stroke="#64748B" strokeWidth="2" />
      {/* Water Level Window */}
      <rect x="38" y="44" width="6" height="26" rx="2" fill="#38BDF8" />
      {/* Handle */}
      <path d="M28 36H16C13.8 36 12 37.8 12 40V70C12 72.2 13.8 74 16 74H26" stroke="#0F172A" strokeWidth="4" strokeLinecap="round" />
      {/* Spout */}
      <path d="M52 34L64 26V36L55 44" fill="#0F172A" />
      {/* Lid & Button */}
      <rect x="30" y="24" width="22" height="7" rx="3" fill="#0F172A" />
      <circle cx="41" cy="22" r="2.5" fill="#EF4444" />
    </g>

    {/* Wireless Headphones */}
    <g transform="translate(74, 38)">
      {/* Headband */}
      <path d="M12 56C12 24 56 24 56 56" stroke="#00ADBB" strokeWidth="5" strokeLinecap="round" fill="none" />
      <path d="M20 28C24 22 44 22 48 28" stroke="#1E293B" strokeWidth="3" strokeLinecap="round" fill="none" />
      {/* Left Ear Cushion */}
      <rect x="6" y="52" width="12" height="26" rx="6" fill="#1E293B" />
      <rect x="14" y="54" width="4" height="22" rx="2" fill="#00ADBB" />
      {/* Right Ear Cushion */}
      <rect x="50" y="52" width="12" height="26" rx="6" fill="#1E293B" />
      <rect x="50" y="54" width="4" height="22" rx="2" fill="#00ADBB" />
    </g>
  </svg>
);

// 9. Gifts & Celebrations (Gift Box with Gold Ribbon Bow & Confetti)
export const GiftsSvg = ({ className = "w-28 h-28" }) => (
  <svg viewBox="0 0 160 160" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
    <ellipse cx="80" cy="142" rx="46" ry="8" fill="#000" fillOpacity="0.08" />

    {/* Gift Box Body */}
    <g transform="translate(42, 54)">
      {/* Box Container */}
      <rect x="6" y="24" width="64" height="56" rx="6" fill="#EF4444" />
      {/* Box Lid */}
      <rect x="2" y="16" width="72" height="14" rx="4" fill="#DC2626" />
      
      {/* Golden Vertical Ribbon */}
      <rect x="32" y="16" width="12" height="64" fill="#FACC15" />
      {/* Golden Horizontal Ribbon */}
      <rect x="6" y="46" width="64" height="12" fill="#FACC15" />

      {/* Big Golden Bow on top */}
      {/* Left loop */}
      <path d="M38 16C26 4 18 10 32 16Z" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
      {/* Right loop */}
      <path d="M38 16C50 4 58 10 44 16Z" fill="#FDE047" stroke="#EAB308" strokeWidth="1.5" />
      {/* Center knot */}
      <circle cx="38" cy="16" r="4.5" fill="#EAB308" />
    </g>

    {/* Floating Celebration Stars & Confetti */}
    <circle cx="34" cy="46" r="3" fill="#38BDF8" />
    <circle cx="126" cy="50" r="3.5" fill="#A855F7" />
    <polygon points="120,78 123,84 129,85 125,89 126,95 120,92 114,95 115,89 111,85 117,84" fill="#FACC15" />
    <polygon points="36,92 38,96 42,97 39,100 40,104 36,102 32,104 33,100 30,97 34,96" fill="#F43F5E" />
  </svg>
);
