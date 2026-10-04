import React from "react";
import { t } from "@/utils/translation";
import { useSelector } from "react-redux";
import { FiCheck } from "react-icons/fi";

const Stepper = ({ currentStep }) => {
  const checkout = useSelector((state) => state.Checkout);
  const isDoorstep = checkout?.orderType === "doorstep";

  return (
    <div className="flex justify-center items-center my-8 max-w-2xl mx-auto px-4 w-full">
      {/* Step 1: Address / Pickup */}
      <div className="flex flex-col items-center gap-2 relative z-10">
        <div
          className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full font-extrabold text-sm transition-all duration-300 ${
            currentStep > 1
              ? "bg-[#0BADFB] text-white shadow-md shadow-[#0BADFB]/20"
              : currentStep === 1
              ? "bg-[#0BADFB] text-white ring-4 ring-[#e0f7fe] shadow-md shadow-[#0BADFB]/20"
              : "bg-slate-100 text-slate-400 border border-slate-200"
          }`}
        >
          {currentStep > 1 ? <FiCheck className="text-base stroke-[3]" /> : "1"}
        </div>
        <span
          className={`text-xs font-bold uppercase tracking-wider transition-colors ${
            currentStep >= 1 ? "text-slate-900" : "text-slate-400"
          }`}
        >
          {t("address")}
        </span>
      </div>

      {/* Connector Line 1 */}
      {isDoorstep && (
        <div className="flex-1 mx-2 -mt-6">
          <div
            className={`h-0.5 transition-all duration-300 ${
              currentStep > 1
                ? "bg-[#0BADFB]"
                : "border-t-2 border-dashed border-slate-200"
            }`}
          />
        </div>
      )}

      {/* Step 2: Schedule (Doorstep only) */}
      {isDoorstep && (
        <div className="flex flex-col items-center gap-2 relative z-10">
          <div
            className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full font-extrabold text-sm transition-all duration-300 ${
              currentStep > 2
                ? "bg-[#0BADFB] text-white shadow-md shadow-[#0BADFB]/20"
                : currentStep === 2
                ? "bg-[#0BADFB] text-white ring-4 ring-[#e0f7fe] shadow-md shadow-[#0BADFB]/20"
                : "bg-slate-100 text-slate-400 border border-slate-200"
            }`}
          >
            {currentStep > 2 ? <FiCheck className="text-base stroke-[3]" /> : "2"}
          </div>
          <span
            className={`text-xs font-bold uppercase tracking-wider transition-colors ${
              currentStep >= 2 ? "text-slate-900" : "text-slate-400"
            }`}
          >
            {t("schedule")}
          </span>
        </div>
      )}

      {/* Connector Line 2 */}
      <div className="flex-1 mx-2 -mt-6">
        <div
          className={`h-0.5 transition-all duration-300 ${
            (isDoorstep && currentStep > 2) || (!isDoorstep && currentStep > 1)
              ? "bg-[#0BADFB]"
              : "border-t-2 border-dashed border-slate-200"
          }`}
        />
      </div>

      {/* Step 3 (or 2 for pickup): Payment */}
      <div className="flex flex-col items-center gap-2 relative z-10">
        <div
          className={`flex items-center justify-center w-10 h-10 md:w-11 md:h-11 rounded-full font-extrabold text-sm transition-all duration-300 ${
            (isDoorstep && currentStep === 3) || (!isDoorstep && currentStep === 2)
              ? "bg-[#0BADFB] text-white ring-4 ring-[#e0f7fe] shadow-md shadow-[#0BADFB]/20"
              : "bg-slate-100 text-slate-400 border border-slate-200"
          }`}
        >
          {isDoorstep ? 3 : 2}
        </div>
        <span
          className={`text-xs font-bold uppercase tracking-wider transition-colors ${
            (isDoorstep && currentStep >= 3) || (!isDoorstep && currentStep >= 2)
              ? "text-slate-900"
              : "text-slate-400"
          }`}
        >
          {t("payment")}
        </span>
      </div>
    </div>
  );
};

export default Stepper;
