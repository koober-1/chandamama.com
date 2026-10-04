import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { store } from "@/redux/store";

export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function formatCustomDate(dateString) {
  if (!dateString) return;

  const isoCompatibleString = dateString.replace(/Z+$/, "Z");
  // NOTE: for removing the zz from created At which return Nan
  // const isoCompatibleString = dateString.replace(" ", "T") + "Z";
  const date = new Date(isoCompatibleString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();

  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const seconds = String(date.getSeconds()).padStart(2, "0");

  const isPM = hours >= 12;
  const formattedHours = String(hours % 12 || 12).padStart(2, "0");
  const ampm = isPM ? "PM" : "AM";

  return `${day}-${month}-${year}, ${formattedHours}:${minutes}:${seconds} ${ampm}`;
}

export const formatOnlyDate = (dateString) => {
  if (!dateString) return;

  const isoCompatibleString = dateString.replace(/Z+$/, "Z");
  // NOTE: for removing the zz from created At which return Nan
  // const isoCompatibleString = dateString.replace(" ", "T") + "Z";
  const date = new Date(isoCompatibleString);

  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const year = date.getFullYear();
  return `${day}-${month}-${year}`;
};

export const isRtl = () => {
  const state = store.getState();
  const isLangRtl =
    state?.Language?.selectedLanguage?.type == "RTL" ? true : false;
  return isLangRtl;
};

export const getVariantColorData = (variant) => {
  if (!variant) return null;
  const rawColor = variant.color_variant || variant.color_name || variant.color_code || variant.color || '';
  if (!rawColor) return null;

  let hex = null;
  const hexMatch = String(rawColor).match(/#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})\b/);
  if (hexMatch) {
    hex = hexMatch[0].toUpperCase();
  } else if (variant.color_custom_hex || variant.color_code || variant.hex_code) {
    const directHex = variant.color_custom_hex || variant.color_code || variant.hex_code;
    if (String(directHex).startsWith('#')) {
      hex = String(directHex).toUpperCase();
    }
  }

  if (!hex) {
    const presets = {
      'black': '#000000', 'white': '#FFFFFF', 'grey': '#808080', 'gray': '#808080',
      'red': '#FF0000', 'crimson': '#DC143C', 'maroon': '#800000', 'pink': '#FFC0CB',
      'orange': '#FFA500', 'narangi': '#E08229', 'yellow': '#FFFF00', 'blue': '#0000FF',
      'navy blue': '#000080', 'navy': '#000080', 'green': '#008000', 'dark green': '#006400',
      'khakhi': '#1D5D18', 'khaki': '#1D5D18', 'olive green': '#556B2F', 'purple': '#800080',
      'brown': '#8B4513', 'multi color': '#4A90E2', 'multi': '#4A90E2'
    };
    const lower = String(rawColor).toLowerCase().replace(/\([^)]*\)/g, '').replace(/_/g, ' ').trim();
    hex = presets[lower] || null;
  }

  let name = String(rawColor).replace(/\s*\([^)]*\)/g, '').replace(/_/g, ' ').trim();
  if (!name || name.startsWith('#')) {
    name = variant.color_name || 'Color';
  } else {
    name = name.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
  }

  return { name, hex };
};
