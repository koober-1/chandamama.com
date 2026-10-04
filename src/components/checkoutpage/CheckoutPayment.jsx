import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { CiWallet } from "react-icons/ci";
import { useSelector, useDispatch } from "react-redux";
import { t } from "@/utils/translation";
import {
  setCurrentStep,
  setPaymentMethod,
  setUserWalletBalance,
  setWalletChecked,
} from "@/redux/slices/checkoutSlice";

import CashOnDeliveryImage from "@/assets/payment_methods_svgs/ic_cod.svg";
import CashfreeImage from "@/assets/payment_methods_svgs/ic_cashfree.svg";
import RazorpayImage from "@/assets/payment_methods_svgs/ic_razorpay.svg";
import PaypalImage from "@/assets/payment_methods_svgs/ic_paypal.svg";
import PaystackImage from "@/assets/payment_methods_svgs/ic_paystack.svg";
import StriperImage from "@/assets/payment_methods_svgs/ic_stripe.svg";
import MidtransImage from "@/assets/payment_methods_svgs/Midtrans.svg";
import PhonePeImage from "@/assets/payment_methods_svgs/Phonepe.svg";
import PaytabsImage from "@/assets/payment_methods_svgs/ic_paytabs.svg";
import DpoImage from "@/assets/payment_methods_svgs/ic_dpo_full.svg";

const paymentMethodsConfig = [
  { key: "razorpay_payment_method", label: "razorpay", image: RazorpayImage },
  { key: "paypal_payment_method", label: "paypal", image: PaypalImage },
  { key: "paystack_payment_method", label: "paystack", image: PaystackImage },
  { key: "stripe_payment_method", label: "stripe", image: StriperImage },
  { key: "cashfree_payment_method", label: "cashfree", image: CashfreeImage },
  { key: "midtrans_payment_method", label: "midtrans", image: MidtransImage },
  { key: "phonepay_payment_method", label: "phonepe", image: PhonePeImage },
  { key: "paytabs_payment_method", label: "paytabs", image: PaytabsImage },
  { key: "dpo_payment_method", label: "dpo", image: DpoImage },
];

const CheckoutPayment = ({ checkoutData }) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.Setting);
  const checkout = useSelector((state) => state.Checkout);
  const user = useSelector((state) => state.User);
  const cart = useSelector((state) => state.Cart);
  const methodsContainerRef = useRef(null);
  const [walletBalance, setWalletBalance] = useState(null);

  useEffect(() => {
    if (checkout?.isWalletChecked) {
      setWalletBalance(checkout?.usedWalletBalance - user?.user?.balance);
    } else {
      setWalletBalance(user?.user?.balance);
    }
  }, [user]);

  const isCodAllowed =
    checkoutData?.cod_allowed == "1" ||
    checkoutData?.cod_allowed == 1 ||
    checkoutData?.cod_allowed === undefined ||
    checkoutData?.cod_allowed === null;

  const enabledPaymentMethods = paymentMethodsConfig.filter(
    (method) =>
      setting?.payment_setting?.[method.key] &&
      (setting?.payment_setting?.[method.key] == "1" ||
        setting?.payment_setting?.[method.key] == 1)
  );

  useEffect(() => {
    if (!checkout?.selectedPaymentMethod) {
      if (isCodAllowed || enabledPaymentMethods.length === 0) {
        dispatch(setPaymentMethod({ data: "COD" }));
      } else if (enabledPaymentMethods.length > 0) {
        dispatch(setPaymentMethod({ data: enabledPaymentMethods[0].label }));
      }
    }
  }, [checkoutData, checkout?.selectedPaymentMethod, isCodAllowed, enabledPaymentMethods]);

  const handleSelectedPaymentMethod = (value) => {
    dispatch(setPaymentMethod({ data: value }));
  };

  // Function to find the selected method element
  const scrollToSelectedMethod = () => {
    if (!methodsContainerRef.current) return;
    const selectedMethod = methodsContainerRef.current.querySelector(
      `[data-method="${checkout?.selectedPaymentMethod}"]`
    );
    if (selectedMethod) {
      selectedMethod.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  };

  // Effect to trigger scroll when selected method changes
  useEffect(() => {
    if (checkout?.selectedPaymentMethod) {
      scrollToSelectedMethod();
    }
  }, [checkout?.selectedPaymentMethod]);

  const handleWalletCheck = async () => {
    if (!checkout?.isWalletChecked) {
      if (user?.user?.balance >= checkoutData?.total_amount) {
        dispatch(setPaymentMethod({ data: "wallet" }));
        dispatch(setUserWalletBalance({ data: checkout?.checkoutTotal }));
        setWalletBalance(walletBalance - checkout?.checkoutTotal);
      } else if (user?.user?.balance <= checkoutData?.total_amount) {
        setWalletBalance(0);
        dispatch(setUserWalletBalance({ data: user?.user?.balance }));
      }
    } else {
      dispatch(setPaymentMethod({ data: null }));
      if (walletBalance == 0) {
        setWalletBalance(user?.user?.balance);
      } else if (user?.user?.balance >= checkout?.checkoutTotal) {
        setWalletBalance(walletBalance + checkoutData?.total_amount);
      } else {
        setWalletBalance(user?.user?.balance);
      }
    }
    dispatch(setWalletChecked({ data: !checkout?.isWalletChecked }));
  };

  const handelPrevStep = () => {
    if (checkout?.orderType == "selfpickup") {
      dispatch(setCurrentStep({ data: 1 }));
    } else {
      dispatch(setCurrentStep({ data: 2 }));
    }
  };

  return (
    <div className="w-full">
      <div className="flex flex-col bg-white border border-slate-200/80 rounded-3xl shadow-card overflow-hidden">
        <div className="flex justify-between items-center bg-slate-50/80 px-6 py-4 border-b border-slate-100">
          <span className="font-extrabold text-lg text-slate-900 tracking-tight">
            {t("choose_payment_method")}
          </span>
        </div>
        <div className="p-6 flex flex-col gap-5">
          {user?.user?.balance >= 1 && (
            <div className="flex flex-col gap-3 bg-[#e0f7fe]/40 border border-[#0BADFB]/30 rounded-2xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold uppercase tracking-wider text-[#0BADFB]">
                  {t("your_wallet")}
                </span>
                <label className="flex gap-2 items-center cursor-pointer text-xs font-bold text-[#0BADFB]">
                  <input
                    type="checkbox"
                    className="h-4 w-4 text-[#0BADFB] focus:ring-[#0BADFB] rounded border-slate-300"
                    onChange={handleWalletCheck}
                    checked={checkout?.isWalletChecked}
                  />
                  <span>{t("use_wallet_balance")}</span>
                </label>
              </div>
              <div className="bg-white rounded-xl border border-[#0BADFB]/20 flex justify-between items-center p-3">
                <div className="flex gap-3 items-center font-bold text-xs text-slate-800">
                  <div className="w-9 h-9 rounded-full bg-[#e0f7fe] text-[#0BADFB] flex items-center justify-center">
                    <CiWallet size={22} />
                  </div>
                  <span>{t("walletBalance")}</span>
                </div>
                <div className="font-extrabold text-lg text-[#0BADFB]">
                  {setting?.setting?.currency}
                  {walletBalance?.toFixed(
                    setting?.decimal_point ? setting?.decimal_point : 0
                  )}
                </div>
              </div>
            </div>
          )}

          {checkout?.selectedPaymentMethod == "wallet" ? null : (
            <div className="flex flex-col gap-4">
              <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
                {t("payment_method")}
              </h2>
              <div
                ref={methodsContainerRef}
                className="grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                {(isCodAllowed || enabledPaymentMethods.length === 0) && (
                  <div
                    data-method="COD"
                    className={`p-4 flex justify-between items-center rounded-2xl border transition-all cursor-pointer ${
                      checkout?.selectedPaymentMethod === "COD" || !checkout?.selectedPaymentMethod
                        ? "border-[#0BADFB] bg-[#e0f7fe]/40 ring-2 ring-[#0BADFB]/20 shadow-xs"
                        : "border-slate-200 hover:border-slate-300 bg-white"
                    }`}
                    onClick={() => handleSelectedPaymentMethod("COD")}
                  >
                    <div className="flex gap-3 items-center">
                      <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 flex-shrink-0">
                        <Image
                          src={CashOnDeliveryImage}
                          className="h-full w-full object-contain"
                          height={32}
                          width={32}
                          unoptimized
                          alt={t("cod")}
                        />
                      </div>
                      <span className="font-bold text-xs text-slate-800">
                        {t("cash_on_delivery") || "Cash on Delivery"}
                      </span>
                    </div>
                    <div>
                      <input
                        type="radio"
                        name="payment_method"
                        className="h-4 w-4 text-[#0BADFB] focus:ring-[#0BADFB] border-slate-300"
                        onChange={() => handleSelectedPaymentMethod("COD")}
                        checked={checkout?.selectedPaymentMethod === "COD" || !checkout?.selectedPaymentMethod}
                      />
                    </div>
                  </div>
                )}
                {enabledPaymentMethods.map((method) => {
                  const isSelected = checkout?.selectedPaymentMethod === method.label;
                  return (
                    <div
                      key={method.key}
                      data-method={method.label}
                      className={`p-4 flex justify-between items-center rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "border-[#0BADFB] bg-[#e0f7fe]/40 ring-2 ring-[#0BADFB]/20 shadow-xs"
                          : "border-slate-200 hover:border-slate-300 bg-white"
                      }`}
                      onClick={() => handleSelectedPaymentMethod(method.label)}
                    >
                      <div className="flex gap-3 items-center">
                        <div className="w-10 h-10 rounded-xl bg-slate-50 border border-slate-100 flex items-center justify-center p-1.5 flex-shrink-0">
                          <Image
                            src={method.image}
                            className="h-full w-full object-contain"
                            height={32}
                            width={32}
                            unoptimized
                            alt={t(method.label)}
                          />
                        </div>
                        <span className="font-bold text-xs text-slate-800 capitalize">
                          {t(method.label)}
                        </span>
                      </div>
                      <div>
                        <input
                          type="radio"
                          name="payment_method"
                          className="h-4 w-4 text-[#0BADFB] focus:ring-[#0BADFB] border-slate-300"
                          onChange={() => handleSelectedPaymentMethod(method.label)}
                          checked={isSelected}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-start pt-3">
                <button
                  type="button"
                  className="px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                  onClick={() => handelPrevStep()}
                >
                  {t("previous")}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutPayment;
