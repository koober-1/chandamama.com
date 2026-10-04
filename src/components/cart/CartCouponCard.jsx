import { t } from "@/utils/translation";
import React from "react";
import { MdOutlineCelebration } from "react-icons/md";
import { useSelector, useDispatch } from "react-redux";
import { clearCartPromo } from "@/redux/slices/cartSlice";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { toast } from "react-toastify";

const CartCouponCard = ({ setShowCouponCode }) => {
  const router = useLocalizedRouter();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.Cart);
  const user = useSelector((state) => state.User);
  const setting = useSelector((state) => state.Setting?.setting);

  const handleClearPromo = () => {
    dispatch(clearCartPromo());
  };

  const handleToCheckOut = () => {
    if (user?.jwtToken) {
      router.push("/checkout");
    } else {
      toast.error(t("login_to_access_checkout_page"));
    }
  };

  const handleToProducts = () => {
    router.push("/products");
  };

  const cartTotlaWithDiscount =
    cart?.cartSubTotal?.toFixed(
      setting?.decimal_point ? setting?.decimal_point : 0
    ) -
    cart?.promo_code?.discount?.toFixed(
      setting?.decimal_point ? setting?.decimal_point : 0
    );

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-3xl shadow-md p-6 flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
        <div className="w-9 h-9 rounded-xl bg-[#0BADFB]/10 flex items-center justify-center text-[#0BADFB] shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11"/></svg>
        </div>
        <h2 className="text-base font-extrabold text-slate-900 tracking-tight">
          {t("order_summary") || "Order Summary"}
        </h2>
      </div>

      {user?.jwtToken && (
        <div className="flex justify-between items-center py-3 px-4 bg-[#0BADFB]/5 rounded-2xl border border-[#0BADFB]/15">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-slate-800">{t("have_coupon")}</span>
            <span className="text-[11px] text-slate-500 font-medium">Apply voucher code</span>
          </div>
          <button
            type="button"
            className="px-3.5 py-1.5 text-xs font-bold text-[#0BADFB] bg-white border border-[#0BADFB]/40 rounded-full hover:bg-[#0BADFB] hover:text-white transition-colors shadow-xs cursor-pointer"
            onClick={() => setShowCouponCode(true)}
          >
            {t("view_coupon")}
          </button>
        </div>
      )}

      {cart?.promo_code && (
        <div className="p-3.5 bg-emerald-50/60 border border-emerald-200/80 rounded-2xl flex flex-col gap-2">
          <div className="flex justify-between items-center">
            <span className="text-xs font-bold text-emerald-900">{t("promoCodeSuccess")}</span>
            <button
              type="button"
              onClick={handleClearPromo}
              className="text-xs font-bold text-rose-600 hover:text-rose-800 transition-colors cursor-pointer"
            >
              {t("delete")}
            </button>
          </div>
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-1.5 text-emerald-700">
              <MdOutlineCelebration size={18} />
              <span className="text-xs font-extrabold uppercase tracking-wider">
                {cart?.promo_code?.promo_code}
              </span>
            </div>
            <span className="text-xs font-extrabold text-emerald-700">
              - {setting?.currency}
              {cart?.promo_code?.discount?.toFixed(
                setting?.decimal_point ? setting?.decimal_point : 0
              )}
            </span>
          </div>
        </div>
      )}

      {/* Pricing Details */}
      <div className="flex flex-col gap-2.5">
        <div className="flex justify-between items-center text-sm">
          <span className="text-slate-600 font-medium">{t("sub_total")}</span>
          <span className="font-bold text-slate-900">
            {setting?.currency}
            {cart?.cartSubTotal?.toFixed(
              setting?.decimal_point ? setting?.decimal_point : 0
            )}
          </span>
        </div>

        {cart?.promo_code && (
          <div className="flex justify-between items-center text-sm">
            <span className="text-emerald-700 font-medium">{t("promoDiscount")}</span>
            <span className="font-bold text-emerald-700">
              - {setting?.currency}
              {cart?.promo_code?.discount?.toFixed(
                setting?.decimal_point ? setting?.decimal_point : 0
              )}
            </span>
          </div>
        )}
      </div>

      {/* Total Box */}
      <div className="flex justify-between items-center bg-gradient-to-r from-[#0BADFB]/10 to-[#0BADFB]/5 rounded-2xl border border-[#0BADFB]/20 p-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-[#0BADFB] block">
            {t("total")}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">Including all taxes</span>
        </div>
        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {setting?.currency}{" "}
          {cart?.promo_code
            ? cartTotlaWithDiscount?.toFixed(
                setting?.decimal_point ? setting?.decimal_point : 0
              )
            : cart?.cartSubTotal?.toFixed(
                setting?.decimal_point ? setting?.decimal_point : 0
              )}
        </span>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col gap-2.5 pt-1">
        <button
          type="button"
          className="w-full h-12 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-sm tracking-wide shadow-md shadow-[#0BADFB]/25 active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
          onClick={handleToCheckOut}
        >
          {t("proceed_to_checkout")}
        </button>
        <button
          type="button"
          className="w-full h-11 rounded-full border border-slate-200 hover:border-[#0BADFB] hover:bg-slate-50 hover:text-[#0BADFB] text-slate-700 font-semibold text-xs transition-all flex items-center justify-center cursor-pointer"
          onClick={handleToProducts}
        >
          {t("continue_shopping")}
        </button>
      </div>
    </div>
  );
};

export default CartCouponCard;
