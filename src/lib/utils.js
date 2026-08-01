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
