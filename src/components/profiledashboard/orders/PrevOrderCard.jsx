import { t } from "@/utils/translation";
import { formatCustomDate } from "@/lib/utils";
import { useSelector } from "react-redux";
import { FaArrowRight } from "react-icons/fa";
import { LocalizedLink } from "@/utils/localizedNav";
import ImageWithPlaceholder from "@/components/image-with-placeholder/ImageWithPlaceholder";
import * as api from "@/api/apiRoutes";
import ReoderConfirmModal from "./ReoderConfirmModal";
import { useState } from "react";

const PrevOrderCard = ({ order }) => {
  const setting = useSelector((state) => state.Setting);
  const deliveryDate = order?.status?.find((ord) => ord[0] == "6");
  const orderFirstItem = order?.items[0];

  const [showReoderModal, setShowReorderModal] = useState(false);

  const handleReoder = () => {
    setShowReorderModal(true);
  };

  return (
    <div className="w-full">
      <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-card transition-all overflow-hidden">
        {/* Card Header */}
        <div className="p-4 sm:px-6 sm:py-3.5 bg-slate-50/70 border-b border-slate-100 flex flex-wrap justify-between items-center gap-3">
          <div className="flex flex-wrap items-center gap-4 sm:gap-8">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("order")}
              </p>
              <p className="text-sm font-bold text-slate-800">#{order?.id}</p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("order_type")}
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {order?.order_type == "doorstep"
                  ? t("home_delivery")
                  : t("store_pickup")}
              </p>
            </div>
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                {t("orderDate")}
              </p>
              <p className="text-sm font-semibold text-slate-700">
                {order?.date}
              </p>
            </div>
          </div>

          <div>
            <span className="px-3 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-700 border border-slate-200/60 inline-flex items-center">
              {t("order_status_display_name_delivered") || "Completed"}
            </span>
          </div>
        </div>

        {/* Card Body Item preview */}
        <div className="p-4 sm:p-5">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 relative aspect-square shrink-0 rounded-xl overflow-hidden border border-slate-100 bg-slate-50">
              {orderFirstItem?.image_url && (
                <ImageWithPlaceholder
                  src={orderFirstItem?.image_url}
                  alt={orderFirstItem?.name || "Product"}
                  fill
                  className="object-cover p-1"
                />
              )}
            </div>
            <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="min-w-0">
                <h4 className="font-bold text-sm sm:text-base text-slate-900 truncate">
                  {orderFirstItem?.name}
                </h4>
                <p className="text-xs text-slate-500 mt-0.5">
                  {orderFirstItem?.variant_name}
                </p>
              </div>

              <div className="sm:text-right shrink-0">
                {orderFirstItem?.discounted_price != 0 ? (
                  <div className="flex items-baseline sm:flex-col gap-1.5 sm:gap-0">
                    <span className="text-sm sm:text-base font-bold text-slate-900">
                      {setting?.setting?.currency}
                      {orderFirstItem?.discounted_price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {setting?.setting?.currency}
                      {orderFirstItem?.price}
                    </span>
                  </div>
                ) : (
                  <span className="text-sm sm:text-base font-bold text-slate-900">
                    {setting?.setting?.currency}
                    {orderFirstItem?.price}
                  </span>
                )}
              </div>
            </div>
          </div>

          {order?.items?.length > 1 && (
            <div className="mt-3">
              <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-slate-600 text-xs font-medium">
                +{order?.items?.length - 1} {t("moteItems")}
              </span>
            </div>
          )}
        </div>

        {/* Card Footer */}
        <div className="p-4 sm:px-6 sm:py-3.5 bg-slate-50/40 border-t border-slate-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
          <div className="flex items-baseline gap-2">
            <span className="text-xs text-slate-500">
              {t("total")}:
            </span>
            <span className="font-bold text-base sm:text-lg text-slate-900">
              {setting?.setting?.currency}
              {order?.final_total}
            </span>
          </div>

          <div className="flex items-center gap-2 flex-wrap w-full sm:w-auto">
            <button
              className="px-4 py-2 rounded-full border border-[#0BADFB]/30 hover:border-[#0BADFB] bg-[#e0f7fe]/70 hover:bg-[#e0f7fe] text-[#0BADFB] font-semibold text-xs transition-all"
              onClick={handleReoder}
            >
              {t("reorder")}
            </button>

            <LocalizedLink
              href={`/order-detail/${order?.id}`}
              className="px-4 py-2 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-all shadow-2xs inline-flex items-center gap-1.5"
            >
              <span>{t("view_details")}</span>
              <FaArrowRight size={11} />
            </LocalizedLink>
          </div>
        </div>
      </div>

      <ReoderConfirmModal
        showReoderModal={showReoderModal}
        setShowReorderModal={setShowReorderModal}
        order={order}
      />
    </div>
  );
};

export default PrevOrderCard;
