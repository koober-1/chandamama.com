import { t } from "@/utils/translation";
import React from "react";
import { formatCustomDate } from "@/lib/utils";
import { useSelector } from "react-redux";

const WalletTransactionCard = ({ transaction }) => {
  const setting = useSelector((state) => state.Setting.setting);
  return (
    <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-card transition-all overflow-hidden flex flex-col justify-between">
      {/* Header: Transaction ID and Date */}
      <div className="flex justify-between items-center text-xs p-4 bg-slate-50/70 border-b border-slate-100">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("transaction_id")}</p>
          <p className="font-bold text-slate-800">#{transaction?.id}</p>
        </div>
        <div className="text-right">
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("date")}</p>
          <p className="font-semibold text-slate-700">{transaction?.created_at}</p>
        </div>
      </div>

      {/* Message Section */}
      <div className="p-4 flex-1">
        <p className="text-xs text-slate-400 mb-1">{t("message")}</p>
        <p className="font-medium text-slate-800 text-sm leading-snug line-clamp-2">
          {transaction?.message}
        </p>
      </div>

      {/* Transaction Amount Section */}
      <div className="p-4 bg-slate-50/40 border-t border-slate-100 flex justify-between items-center">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            {t("transaction")} {t("amount")}
          </p>
          <p className="text-lg md:text-xl font-bold text-slate-900">
            {setting?.currency}
            {transaction?.amount?.toFixed(
              setting?.decimal_point ? setting?.decimal_point : 0
            )}
          </p>
        </div>
        <div>
          {transaction?.type == "credit" ? (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e0f7fe] text-[#0BADFB] border border-[#0BADFB]/30 inline-flex items-center">
              +{t("credit")}
            </span>
          ) : (
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 inline-flex items-center">
              -{t("debit")}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

export default WalletTransactionCard;
