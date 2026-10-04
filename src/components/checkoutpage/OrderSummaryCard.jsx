import { t } from "@/utils/translation";
import { LocalizedLink } from "@/utils/localizedNav";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { setCheckoutTotal } from "@/redux/slices/checkoutSlice";
import { useDispatch } from "react-redux";
import { CgInfo } from "react-icons/cg";
import ChargesInfoPopup from "./ChargesInfoPopup";
import CheckoutOrderItems from "./CheckoutOrderItems";

const OrderSummaryCard = ({
  step,
  checkoutData,
  handlePlaceOrder,
  handleFirstStep,
  handleSecondStep,
  handlePickupOrderStep,
  checkOutError,
  checkoutLoading,
}) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.Setting.setting);
  const user = useSelector((state) => state.User);
  const checkout = useSelector((state) => state.Checkout);
  const cart = useSelector((state) => state.Cart);
  const [activeTooltip, setActiveTooltip] = useState(null);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // Calculate new total amount based on wallet balance usage
    if (checkout?.isWalletChecked) {
      const updatedTotal = Math.max(
        (checkoutData?.total_amount || 0) - (user?.user?.balance || 0),
        0 // Ensure total doesn't go below 0
      );
      dispatch(setCheckoutTotal({ data: updatedTotal }));
    } else {
      dispatch(setCheckoutTotal({ data: checkoutData?.total_amount || 0 }));
      // setCheckoutTotal(checkoutData?.total_amount || 0); // Reset to original total
    }
  }, [
    checkout?.isWalletChecked,
    checkoutData?.total_amount,
    user?.user?.balance,
  ]);

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-3xl shadow-card p-6 flex flex-col gap-4">
      <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">
        {t("order_summary") || "Order Summary"}
      </h2>

      {/* Small Compact Product Cards */}
      <CheckoutOrderItems checkoutData={checkoutData} />

      <div className="flex flex-col gap-2.5 text-xs md:text-sm">
        {/* Subtotal */}
        <div className="flex justify-between items-center text-slate-600 font-medium">
          <span>{t("sub_total")}</span>
          <span className="font-bold text-slate-900">
            {setting?.currency}{" "}
            {checkOutError == false
              ? checkoutData?.sub_total?.toFixed(
                  setting?.decimal_point ? setting?.decimal_point : 0
                )
              : cart?.cartSubTotal?.toFixed(
                  setting?.decimal_point ? setting?.decimal_point : 0
                )}
          </span>
        </div>

        {/* Additional Charges */}
        {checkoutData?.additional_charges?.length > 0 &&
          checkoutData?.additional_charges?.map((charge, index) => (
            <div
              className="flex justify-between items-center text-slate-600 font-medium"
              key={index}
            >
              <span className="flex items-center gap-1 relative">
                <span>{charge?.title}</span>
                <button
                  type="button"
                  className="text-slate-400 hover:text-slate-600 cursor-pointer"
                  onClick={() => {
                    setMessage(
                      charge?.is_refundable
                        ? t("refundable_message")
                        : t("non_refundable_message")
                    );
                    setActiveTooltip(index);
                  }}
                  aria-label="Info"
                >
                  <CgInfo size={14} />
                </button>
                {activeTooltip === index && (
                  <ChargesInfoPopup
                    message={message}
                    onClose={() => setActiveTooltip(null)}
                  />
                )}
              </span>
              <span className="font-bold text-slate-800">
                {setting?.currency}
                {charge?.amount}
              </span>
            </div>
          ))}

        {/* Delivery Charge */}
        {checkOutError == false && checkout?.orderType == "doorstep" && (
          <div className="flex justify-between items-center text-slate-600 font-medium">
            <span className="flex items-center gap-1 relative">
              <span>{t("delivery_charge")}</span>
              <button
                type="button"
                className="text-slate-400 hover:text-slate-600 cursor-pointer"
                onClick={() => {
                  setMessage(
                    <div className="flex flex-col gap-2">
                      <span className="font-bold">{t("delivery_charge_details")}</span>
                      {checkoutData?.delivery_charge?.sellers_info?.map((seller, i) => (
                        <div key={i} className="flex justify-between items-center text-xs gap-4">
                          <span>{seller.seller_name}</span>
                          <span className="font-semibold whitespace-nowrap">
                            {setting?.currency} {seller.delivery_charge}
                          </span>
                        </div>
                      ))}
                      <span className="text-xs text-slate-500 mt-1">
                        {checkoutData?.delivery_charge?.is_delivery_charges_refundable == 1
                          ? t("refundable_message")
                          : t("non_refundable_message")}
                      </span>
                    </div>
                  );
                  setActiveTooltip("delivery");
                }}
                aria-label="Delivery charge details"
              >
                <CgInfo size={14} />
              </button>
              {activeTooltip === "delivery" && (
                <ChargesInfoPopup
                  message={message}
                  onClose={() => setActiveTooltip(null)}
                />
              )}
            </span>
            <span className="font-bold text-slate-800">
              {setting?.currency} {checkoutData?.delivery_charge?.total_delivery_charge}
            </span>
          </div>
        )}

        {/* Promo Discount */}
        {checkoutData?.promocode_details && checkOutError == false && (
          <div className="flex justify-between items-center text-[#0BADFB] font-medium">
            <span>{t("promoDiscount")}</span>
            <span className="font-bold">
              - {setting?.currency} {checkoutData?.promocode_details?.discount}
            </span>
          </div>
        )}

        {/* Wallet Balance Used */}
        {checkout?.isWalletChecked && (
          <div className="flex justify-between items-center text-[#0BADFB] font-medium">
            <span>{t("wallet_balance_used")}</span>
            <span className="font-bold">
              - {setting?.currency}{" "}
              {checkout?.usedWalletBalance?.toFixed(
                setting?.decimal_point ? setting?.decimal_point : 0
              )}
            </span>
          </div>
        )}
      </div>

      {/* Total Box */}
      <div className="flex justify-between items-center bg-slate-50/80 rounded-2xl border border-slate-100 p-4 my-1">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-slate-400 block">
            {t("total")}
          </span>
          <span className="text-[11px] text-slate-500 font-medium">All taxes included</span>
        </div>
        <span className="text-2xl font-extrabold text-slate-900 tracking-tight">
          {setting?.currency}{" "}
          {checkOutError == false
            ? checkout?.isWalletChecked
              ? (
                  Number(checkoutData?.total_amount) -
                  Number(checkout?.usedWalletBalance)
                ).toFixed(setting?.decimal_point ? setting?.decimal_point : 0)
              : checkoutData?.total_amount?.toFixed(
                  setting?.decimal_point ? setting?.decimal_point : 0
                )
            : cart?.cartSubTotal?.toFixed(
                setting?.decimal_point ? setting?.decimal_point : 0
              )}
        </span>
      </div>

      {/* Dynamic CTA Button Based on Step */}
      <div className="flex flex-col gap-2 pt-1">
        {step === 1 ? (
          <button
            type="button"
            className="w-full h-12 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-extrabold text-sm tracking-wide shadow-md shadow-[#0BADFB]/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            disabled={checkoutLoading}
            onClick={() => {
              if (checkout?.orderType === "selfpickup") {
                handlePickupOrderStep?.();
              } else {
                handleFirstStep?.();
              }
            }}
          >
            {checkoutLoading ? (
              <span className="inline-block animate-pulse">{t("processing") || "Processing..."}</span>
            ) : (
              t("continue") || "Continue to Schedule"
            )}
          </button>
        ) : step === 2 ? (
          <button
            type="button"
            className="w-full h-12 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-extrabold text-sm tracking-wide shadow-md shadow-[#0BADFB]/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            disabled={checkoutLoading}
            onClick={() => handleSecondStep?.()}
          >
            {checkoutLoading ? (
              <span className="inline-block animate-pulse">{t("processing") || "Processing..."}</span>
            ) : (
              t("proceed_to_payment") || "Proceed to Payment"
            )}
          </button>
        ) : (
          <button
            type="button"
            className="w-full h-12 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-extrabold text-sm tracking-wide shadow-md shadow-[#0BADFB]/20 active:scale-98 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center cursor-pointer"
            disabled={step !== 3 || checkoutLoading}
            onClick={handlePlaceOrder}
          >
            {checkoutLoading ? (
              <span className="inline-block animate-pulse">{t("processing") || "Processing..."}</span>
            ) : (
              t("place_order")
            )}
          </button>
        )}

        <LocalizedLink
          href="/cart"
          className="w-full h-10 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-600 font-semibold text-xs flex items-center justify-center transition-colors"
        >
          {t("backToCart")}
        </LocalizedLink>
      </div>
    </div>
  );
};

export default OrderSummaryCard;
