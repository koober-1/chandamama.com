"use client";
import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import Stepper from "./Stepper";
import AddressCard from "../cards/AddressCard";
import { t } from "@/utils/translation";
import { GoPlus, GoPlusCircle } from "react-icons/go";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { FaRegCalendarAlt } from "react-icons/fa";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import CheckoutPayment from "./CheckoutPayment";
import OrderSummaryCard from "./OrderSummaryCard";
import CheckoutOrderItems from "./CheckoutOrderItems";
import { useDispatch, useSelector } from "react-redux";
import dynamic from 'next/dynamic';
const NewAddressModal = dynamic(() => import('../newaddressmodal/NewAddressModal'), {
  ssr: false,
});
import * as api from "@/api/apiRoutes";
import {
  clearCartPromo,
  setCartCheckout,
  setCartPromo,
  setCartProducts,
  setCartSubTotal,
} from "@/redux/slices/cartSlice";
import { setAllAddresses } from "@/redux/slices/addressSlice";
import {
  setAddress,
  setSelectedDate,
  setCurrentStep,
  setTimeSlot,
  setOrderNote,
  setCheckoutTotal,
  setPhonePeCheckoutDetails,
  setOrderType,
} from "@/redux/slices/checkoutSlice";
import { toast } from "react-toastify";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { setCurrentUser } from "@/redux/slices/userSlice";

// Remove: import StripeModal from "./StripeModal";

const StripeModal = dynamic(() => import("./StripeModal"), {
  ssr: false, // Stripe must only load on the client side
});
import PaystackPop from "@paystack/inline-js";
import CheckoutSkeleton from "./CheckoutSkeleton";
import { FiPhoneCall, FiTruck } from "react-icons/fi";
import { MdOutlineStorefront, MdOutlineWatchLater } from "react-icons/md";
import { IoLocationOutline } from "react-icons/io5";

const Checkout = () => {
  const router = useLocalizedRouter();
  const dispatch = useDispatch();

  const city = useSelector((state) => state.City.city);
  const cart = useSelector((state) => state.Cart);
  const address = useSelector((state) => state.Addresses);
  const user = useSelector((state) => state.User.user);
  const setting = useSelector((state) => state.Setting);

  const checkout = useSelector((state) => state.Checkout);

  const [checkoutLoading, setCheckoutLoading] = useState(false);
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState("");
  const [showStripe, setShowStripe] = useState(false);
  const [paymentLoading, setPaymentLoading] = useState(false);

  // stripe variables
  const [stripeOrderId, setStripeOrderId] = useState(null);
  const [stripeClientSecret, setStripeClientSecret] = useState(null);
  const [stripeTransactionId, setStripeTransactionId] = useState(null);
  // step 1 variables
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [showAddAddres, setShowAddAddres] = useState(false);
  const [checkOutError, setCheckOutError] = useState(false);
  const [checkOutErrorMsg, setCheckOutErrorMsg] = useState("");
  // step 2 Variables
  // const [selectedDate, setSelectedDate] = useState(null)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const [timeSlotsData, setTimeSlotsData] = useState(null);
  const [timeSlots, setTimeSlots] = useState([]);

  const [availabeleTimeSlot, setAvailableTimeSlot] = useState([]);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState(null);

  // step 3 variables
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState();

  useEffect(() => {
    fetchAddress();
    handleFetchTimeSlots();
    getCurrentUser();
    const orderType =
      cart?.doorstep_delivery_mode != 0 ? "doorstep" : "selfpickup";
    handleOrderType(orderType);
  }, []);

  useEffect(() => {
    validateCouponCode();
  }, [cart?.cart, checkout?.address, cart?.cartProducts]);

  useEffect(() => {
    handleFetchCheckout();
  }, [
    cart?.cart,
    cart?.promo_code,
    checkout?.address,
    cart?.cartProducts,
    checkout?.orderType,
    checkout?.timeSlot,
  ]);

  const getCurrentUser = async () => {
    try {
      const response = await api.getUser();
      dispatch(setCurrentUser({ data: response.user }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const validateCouponCode = async () => {
    try {
      const response = await api.setPromoCode({
        promoCodeName: cart?.promo_code?.promo_code,
        amount: cart?.cartSubTotal,
      });
      if (response.status == 1) {
        dispatch(setCartPromo({ data: response.data }));
      } else {
        dispatch(clearCartPromo());
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  useEffect(() => {
    handleFilterTimeSlots();
  }, [checkout?.selectedDate, timeSlots]);

  const handleFetchCheckout = async () => {
    const couponseCodeId = cart?.promo_code?.promo_code_id;
    try {
      const addrLat = parseFloat(checkout?.address?.latitude);
      const addrLng = parseFloat(checkout?.address?.longitude);

      const effectiveLat =
        addrLat ? checkout.address.latitude :
        (city?.latitude || setting?.setting?.default_city?.latitude || 22.7196);
      const effectiveLng =
        addrLng ? checkout.address.longitude :
        (city?.longitude || setting?.setting?.default_city?.longitude || 75.8577);

      const response = await api.getCart({
        latitude: effectiveLat,
        longitude: effectiveLng,
        checkout: 1,
        promocode_id: couponseCodeId,
        order_type: checkout?.orderType,
        is_free_delivery: checkout?.timeSlot?.is_free_delivery,
      });
      if (response?.status == 1) {
        dispatch(setCartCheckout({ data: response?.data }));
        dispatch(setCheckoutTotal({ data: response?.data?.total_amount }));
        setCheckoutData(response?.data);
        setCheckOutError(false);
      } else {
        setCheckOutError(true);
        setCheckOutErrorMsg(response?.message);
      }
    } catch (error) {
      console.log("Error", error);
      setCheckOutError(true);
    }
  };

  const handleSelectedDate = (date) => {
    const currentDate = new Date();
    const finalDate = currentDate.setHours(0, 0, 0, 0);
    if (date < finalDate) {
      toast.info(t("please_select_valid_date"));
    }

    dispatch(setSelectedDate({ data: date }));
    dispatch(setTimeSlot({ data: null }));
    setIsPopoverOpen(false);
    handleFilterTimeSlots(date);
  };

  const formatDate = (date) => {
    if (timeSlotsData?.time_slots_is_enabled == "true") {
      if (!date) return t("choose_date");
      return new Date(date).toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
    } else {
      const tomorrow = new Date();
      tomorrow.setDate(
        tomorrow.getDate() + parseInt(timeSlotsData.delivery_estimate_days),
      );
      const finalDate = tomorrow.toLocaleDateString("en-US", {
        day: "2-digit",
        month: "long",
        year: "numeric",
      });
      dispatch(setSelectedDate({ data: finalDate }));
      return finalDate;
    }
  };

  const fetchAddress = async () => {
    try {
      const response = await api.getAddress();
      if (response.status == 1) {
        dispatch(setAllAddresses({ data: response.data }));
        const defaultAddress = response?.data?.find(
          (address) => address.is_default == 1,
        );
        if (checkout?.address != null) {
          return;
        } else if (!defaultAddress) {
          dispatch(setAddress({ data: response?.data[0] }));
        } else {
          dispatch(setAddress({ data: defaultAddress }));
        }
        setLoading(false);
      } else {
        setLoading(false);
        dispatch(setAllAddresses({ data: [] }));
      }
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  const handleFilterTimeSlots = () => {
    const currentDate = new Date();
    const userSelectedDate = new Date(
      checkout?.selectedDate ? checkout?.selectedDate : new Date(),
    );

    const updatedTimeSlots = timeSlots.map((slot) => {
      // Create date object for the slot's last order time
      const lastOrderTime = new Date(checkout?.selectedDate);
      const [hours, minutes, seconds] = slot.last_order_time
        .split(":")
        .map(Number);
      lastOrderTime.setHours(hours, minutes, seconds);

      const isToday =
        userSelectedDate.toDateString() === currentDate.toDateString();
      const isDisabled = isToday && currentDate >= lastOrderTime;

      return {
        ...slot,
        isDisabled,
      };
    });

    setAvailableTimeSlot(updatedTimeSlots);
  };

  const handleFetchTimeSlots = async (selectedDate) => {
    setLoading(true);
    try {
      const response = await api.getTimeSlots();
      const allTimeSlots = response?.data?.time_slots || [];
      setTimeSlotsData(response?.data);
      setTimeSlots(allTimeSlots);
      handleFilterTimeSlots(selectedDate);
      setLoading(false);
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  const handleTimeSlotChange = (value) => {
    if (value.isDisabled == true) {
      toast.error(t("please_select_valid_time_slot"));
      return;
    }
    setSelectedTimeSlot(value);
    dispatch(setTimeSlot({ data: value }));
  };

  const handleOrderType = (value) => {
    dispatch(setOrderType({ data: value }));
  };

  const handleChangeOrderNote = (e) => {
    dispatch(setOrderNote({ data: e.target.value }));
  };

  const handleShowAddress = () => {
    setIsAddressSelected(false);
    setShowAddAddres(true);
  };

  const handleFirstStep = () => {
    if (checkOutError) {
      toast.error(checkOutErrorMsg);
      // toast.error(t(checkOutErrorMsg));
      return;
    } else {
      dispatch(setCurrentStep({ data: 2 }));
    }
  };

  const handleSecondStep = () => {
    if (
      checkout?.selectedDate == null &&
      timeSlotsData?.time_slot_setting == "true"
    ) {
      toast.error(t("please_select_date"));
      return;
    } else if (
      timeSlotsData?.time_slots_is_enabled == "true" &&
      checkout?.timeSlot == null
    ) {
      toast.error(t("please_select_time_slot"));
      return;
    }

    dispatch(setCurrentStep({ data: 3 }));
  };

  const handlePickupOrderStep = () => {
    if (checkOutError) {
      toast.error(t(checkOutErrorMsg));
      return;
    } else {
      dispatch(setCurrentStep({ data: 3 }));
    }
  };

  const formatDateToDDMMYYYY = (date) => {
    const d = new Date(date);
    const day = String(d.getDate()).padStart(2, "0");
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatDateWithTimeSlot = (date, timeSlot) => {
    const formattedDate = formatDateToDDMMYYYY(date);
    return timeSlot
      ? `${formattedDate} ${timeSlot.default_title}`
      : formattedDate;
  };

  const initializeRazorpay = () => {
    return new Promise((resolve) => {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      // document.body.appendChild(script);
      script.onload = () => {
        resolve(true);
      };
      script.onerror = () => {
        resolve(false);
      };

      document.body.appendChild(script);
    });
  };

  const handleRozarpayPayment = async (
    order_id,
    razorpay_transaction_id,
    amount,
    capilizePaymeneMethod,
  ) => {
    try {
      const res = await initializeRazorpay();
      if (!res) {
        console.error("RazorPay SDK Load Failed");
        return;
      }
      const key = setting?.payment_setting?.razorpay_key;
      const convertedAmount = Math.floor(amount * 100);
      const options = {
        key: key,
        amount: convertedAmount,
        currency: "INR",
        name: user?.user?.name,
        description: setting?.setting?.app_name,
        image: setting?.setting?.web_settings.web_logo,
        order_id: razorpay_transaction_id,
        handler: async (res) => {
          if (res.razorpay_payment_id) {
            try {
              setPaymentLoading(true);
              const response = await api.addTransaction({
                orderId: order_id,
                transactionId: res.razorpay_payment_id,
                paymentMethod: capilizePaymeneMethod,
                type: "order",
              });
              if (response.status === 1) {
                setPaymentLoading(false);
                return router.push(
                  `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}&order_id=${order_id}`,
                );
              } else {
                setPaymentLoading(false);
                toast.error(response.message);
              }
            } catch (error) {
              console.error("Transaction error:", error);
            }
          }
        },
        modal: {
          confirm_close: true,
          ondismiss: async (reason) => {
            if (reason === undefined) {
              await handleRazorpayCancel(order_id);
              // dispatch(deductUserBalance({ data: walletDeductionAmt || 0 }));
            }
          },
        },
        prefill: {
          name: user?.user?.name,
          email: user?.user?.email,
          contact: user?.user?.mobile,
        },
        notes: {
          address: "Razorpay Corporate",
        },
        theme: {
          color: setting?.setting?.web_settings.color,
        },
      };

      const rzpay = new window.Razorpay(options);
      rzpay.on("payment.cancel", (response) => {
        handleRazorpayCancel(order_id);
      });
      rzpay.on("payment.failed", (response) => {
        api.deleteOrder({ orderId: order_id });
      });
      rzpay.open();
    } catch (error) {
      console.error("Error initializing Razorpay:", error);
    }
  };

  const handleRazorpayCancel = async (order_id) => {
    await api.deleteOrder({ orderId: order_id });
  };

  const handlePayStackPayment = async (
    orderId,
    amount,
    capilizePaymeneMethod,
  ) => {
    try {
      const handler = PaystackPop.setup({
        key:
          setting.payment_setting &&
          setting.payment_setting.paystack_public_key,
        email: user && user?.email,
        amount: parseFloat(amount) * 100,
        currency:
          setting?.payment_setting &&
          setting?.payment_setting?.paystack_currency_code,
        ref: new Date().getTime().toString(),
        label: setting?.setting && setting?.setting?.support_email,
        onClose: function () {
          api.deleteOrder({ orderId: orderId });
          // setWalletAmount(user.user.balance);
          // dispatch(setWallet({ data: 0 }));
        },
        callback: async function (res) {
          try {
            setPaymentLoading(true);
            const response = await api.addTransaction({
              orderId: orderId,
              transactionId: res.reference,
              paymentMethod: capilizePaymeneMethod,
              type: "order",
            });
            if (response.status == 1) {
              setPaymentLoading(false);
              return router.push(
                `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}&order_id=${orderId}`,
              );
            } else {
              setPaymentLoading(false);
              toast.error(response.message);
            }
          } catch (error) {
            console.log("Error", error);
          }
        },
      });
      handler.openIframe();
    } catch (error) {
      console.log("Paytabs Error", error);
    }
  };

  const handlePlaceOrder = async () => {
    const formatDate = formatDateWithTimeSlot(
      checkout?.selectedDate,
      checkout?.timeSlot,
    );
    const capilizePaymeneMethod =
      checkout?.selectedPaymentMethod === "dpo"
        ? "DPO"
        : String(checkout?.selectedPaymentMethod).charAt(0).toUpperCase() +
          String(checkout?.selectedPaymentMethod).slice(1);
    const status =
      checkout?.selectedPaymentMethod === "COD" ||
      checkout?.selectedPaymentMethod === "wallet"
        ? 2
        : 1;
    try {
      if (checkout?.selectedPaymentMethod == null) {
        toast.error(t('please_select_payment_method'));
        return;
      } else if (
        checkout?.selectedDate == null &&
        checkout?.orderType == "doorstep" &&
        timeSlotsData?.time_slot_setting == "true"
      ) {
        toast.error(t("please_select_date"));
        return;
      } else if (
        checkout?.address == null &&
        checkout?.orderType == "doorstep"
      ) {
        toast.error(t("please_select_address"));
        return;
      } else {
        setCheckoutLoading(true);
        const response = await api.placeOrder({
          productVariantId: checkoutData?.product_variant_id || cart?.checkout?.product_variant_id,
          quantity: checkoutData?.quantity || cart?.checkout?.quantity,
          total: checkoutData?.sub_total || cart?.checkout?.sub_total,
          deliveryCharge:
            checkoutData?.delivery_charge?.total_delivery_charge ?? cart?.checkout?.delivery_charge?.total_delivery_charge ?? 0,
          finalTotal: checkout?.checkoutTotal,
          walletUsed: checkout?.isWalletChecked ? 1 : 0,
          walletBalance: checkout?.usedWalletBalance || 0,
          addressId: checkout?.address?.id,
          deliveryTime: formatDate,
          orderNote: checkout?.orderNote || "",
          paymentMethod: checkout?.selectedPaymentMethod,
          promocodeId: cart?.promo_code?.promo_code_id || 0,
          status: status,
          order_type: checkout?.orderType || "doorstep",
        });
        if (response?.status == 1) {
          dispatch(setOrderNote(""));
          dispatch(clearCartPromo());
          dispatch(setCartProducts({ data: [] }));
          dispatch(setCartSubTotal({ data: 0 }));
          setOrderId(response?.data?.order_id);
          setCheckoutLoading(false);
          await handleInitiateTransaction(
            response?.data?.order_id,
            capilizePaymeneMethod,
          );
        } else {
          setCheckoutLoading(false);
          toast.error(response?.message || "Failed to place order");
        }
      }
    } catch (error) {
      setCheckoutLoading(false);
      console.log("Error", error);
    }
  };

  const handleInitiateTransaction = async (
    currentOrderID,
    capilizePaymeneMethod,
  ) => {
    try {
      if (checkout?.selectedPaymentMethod === "COD" || checkout?.selectedPaymentMethod === "wallet") {
        toast.success(t("order_placed_successfully") || "Order placed successfully!");
        const orderIdQuery = currentOrderID ? `&order_id=${currentOrderID}` : "";
        return router.push(
          `/web-payment-status?status=success&type=order&payment_method=${checkout?.selectedPaymentMethod}${orderIdQuery}`,
        );
      } else if (checkout?.selectedPaymentMethod == "paystack") {
        handlePayStackPayment(
          currentOrderID,
          checkout?.checkoutTotal,
          capilizePaymeneMethod,
        );
      } else {
        const response = await api.initiateTrasaction({
          orderId: currentOrderID,
          paymentMethod: capilizePaymeneMethod,
          type: "order",
        });
        if (response.status == 1) {
          if (checkout?.selectedPaymentMethod == "phonepe") {
            dispatch(setPhonePeCheckoutDetails(response?.data));
          }
          if (checkout?.selectedPaymentMethod == "razorpay") {
            handleRozarpayPayment(
              currentOrderID,
              response?.data?.transaction_id,
              checkout?.checkoutTotal,
              capilizePaymeneMethod,
            );
          } else if (checkout?.selectedPaymentMethod == "stripe") {
            setStripeOrderId(currentOrderID);
            setStripeClientSecret(response?.data?.client_secret);
            setStripeTransactionId(response?.data?.id);
            setShowStripe(true);
          } else {
            dispatch(clearCartPromo());
            //  payment methods redirect urls
            const paymentUrls = {
              cashfree: response?.data?.redirectUrl,
              phonepe: response?.data?.redirectUrl,
              paytabs: response?.data?.redirectUrl,
              paypal: response?.data?.paypal_redirect_url,
              midtrans: response?.data?.snapUrl,
              dpo: response?.data?.redirectUrl,
            };
            // Select specific paymentUrls
            const redirectUrl = paymentUrls[checkout?.selectedPaymentMethod];
            if (redirectUrl) {
              router.push(redirectUrl);
            } else {
              console.error(
                "Unsupported payment method:",
                selectedPaymentMethod,
              );
            }
          }
        } else {
          // setIsOrderPlaced(false)
          await api.deleteOrder({ orderId: orderId });
          toast.error(response?.message);
        }
      }
    } catch (error) {
      console.log(("Error", error));
    }
  };

  const handleLocationRedirect = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  const handleOptionsClick = (type) => {
    if (type == "doorstep" && cart?.doorstep_delivery_mode == 0) {
      toast.error(t("doorStepDeliveryDisableNote"));
    } else if (type == "selfpickup" && cart?.self_pickup_mode == 0) {
      toast.error(t("selfPickUpDisabledNote"));
    } else {
      return;
    }
  };

  return loading == true ? (
    <CheckoutSkeleton />
  ) : (
    <section>
      <BreadCrumb />
      <div className="container px-2">
        {paymentLoading ? (
          <CheckoutSkeleton />
        ) : (
          <div className="flex justify-center flex-col items-center">
            <div
              className={`flex w-full ${
                checkout?.orderType == "doorstep" ? "lg:w-1/2" : "lg:w-1/4"
              }`}
            >
              <Stepper currentStep={checkout?.currentStep} />
            </div>
            <div className="w-full">
              <div className="grid grid-cols-12 gap-6 items-start">
                {/* step 1 */}
                {checkout?.currentStep == 1 && (
                  <div className="col-span-12 md:col-span-7 lg:col-span-7 flex flex-col gap-6">
                    {/* Items in your order summary card */}
                    <CheckoutOrderItems checkoutData={checkoutData} />

                    {/* Delivery Method Selector Card */}
                    <div className="bg-white border border-slate-200/80 rounded-3xl shadow-card p-6 flex flex-col gap-4">
                      <h2 className="font-extrabold text-lg text-slate-900 tracking-tight">
                        {t("choose_delivery_method")}
                      </h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Doorstep Option */}
                        <div
                          className="flex flex-col"
                          onClick={() => handleOptionsClick("doorstep")}
                        >
                          <label
                            className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                              checkout?.orderType === "doorstep"
                                ? "border-[#0BADFB] bg-[#e0f7fe]/40 ring-2 ring-[#0BADFB]/20 shadow-xs"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            }`}
                          >
                            <input
                              type="radio"
                              name="delivery"
                              value="doorstep"
                              checked={checkout?.orderType == "doorstep"}
                              className="mr-3 text-[#0BADFB] focus:ring-[#0BADFB] w-4 h-4 cursor-pointer"
                              disabled={cart?.doorstep_delivery_mode == 0}
                              onChange={(e) => handleOrderType(e.target.value)}
                            />
                            <div className="flex items-center space-x-3.5">
                              <div className="w-11 h-11 rounded-2xl bg-[#e0f7fe] text-[#0BADFB] border border-[#0BADFB]/30 flex items-center justify-center flex-shrink-0">
                                <FiTruck size={22} />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900">
                                  {t("home_delivery")}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {t("get_it_deliverd_to_your_address")}
                                </p>
                              </div>
                            </div>
                          </label>
                        </div>

                        {/* Self Pickup Option */}
                        <div
                          className="flex flex-col"
                          onClick={() => handleOptionsClick("selfpickup")}
                        >
                          <label
                            className={`flex items-center p-4 rounded-2xl border transition-all cursor-pointer ${
                              checkout?.orderType === "selfpickup"
                                ? "border-[#0BADFB] bg-[#e0f7fe]/40 ring-2 ring-[#0BADFB]/20 shadow-xs"
                                : "border-slate-200 hover:border-slate-300 bg-white"
                            } ${cart?.self_pickup_mode == 0 ? "opacity-60 cursor-not-allowed" : ""}`}
                          >
                            <input
                              type="radio"
                              name="delivery"
                              value="selfpickup"
                              disabled={cart?.self_pickup_mode == 0}
                              checked={checkout?.orderType == "selfpickup"}
                              className="mr-3 text-[#0BADFB] focus:ring-[#0BADFB] w-4 h-4 cursor-pointer"
                              onChange={(e) => handleOrderType(e.target.value)}
                            />
                            <div className="flex items-center space-x-3.5">
                              <div className="w-11 h-11 rounded-2xl bg-slate-100 text-slate-700 border border-slate-200 flex items-center justify-center flex-shrink-0">
                                <MdOutlineStorefront size={22} />
                              </div>
                              <div>
                                <p className="font-bold text-sm text-slate-900">
                                  {t("store_pickup")}
                                </p>
                                <p className="text-xs text-slate-500 mt-0.5">
                                  {t("pick_up_from_store")}
                                </p>
                              </div>
                            </div>
                          </label>
                          {cart?.self_pickup_mode == 0 && (
                            <p className="text-xs font-semibold text-rose-600 px-2 mt-1.5">
                              {t("selfPickUpDisabledNote")}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Step 1 Content: Doorstep Addresses OR Store Pickup Details */}
                    {checkout?.orderType == "doorstep" ? (
                      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-card overflow-hidden">
                        <div className="flex justify-between items-center bg-slate-50/80 px-6 py-4 border-b border-slate-100">
                          <span className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight">
                            {t("choose_delivery_address")}
                          </span>
                          {address?.allAddresses?.length > 0 && (
                            <button
                              type="button"
                              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-xs shadow-md shadow-[#0BADFB]/20 active:scale-95 transition-all"
                              onClick={handleShowAddress}
                            >
                              <GoPlus size={16} />
                              <span>{t("add_address")}</span>
                            </button>
                          )}
                        </div>

                        {address?.allAddresses?.length > 0 ? (
                          <div className="p-6">
                            <div className="flex flex-col gap-3">
                              {address?.allAddresses?.map((addr) => (
                                <AddressCard
                                  key={addr?.id}
                                  address={addr}
                                  setShowAddAddres={setShowAddAddres}
                                  setIsAddressSelected={setIsAddressSelected}
                                  fetchAddress={fetchAddress}
                                />
                              ))}
                            </div>
                            <div className="flex justify-end pt-5 border-t border-slate-100 mt-5">
                              <button
                                type="button"
                                onClick={handleFirstStep}
                                className="px-8 py-3 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-sm tracking-wide shadow-md shadow-[#0BADFB]/20 active:scale-95 transition-all"
                              >
                                {t("continue")}
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="p-8 flex flex-col items-center justify-center text-center">
                            <button
                              type="button"
                              className="border-2 border-dashed border-slate-300 hover:border-[#0BADFB] rounded-3xl p-8 w-full max-w-md flex flex-col items-center justify-center gap-3 transition-colors group cursor-pointer"
                              onClick={() => setShowAddAddres(true)}
                            >
                              <div className="w-12 h-12 rounded-full bg-[#e0f7fe] text-[#0BADFB] flex items-center justify-center group-hover:scale-110 transition-transform">
                                <GoPlusCircle size={24} />
                              </div>
                              <span className="font-bold text-sm text-slate-800">
                                {t("add_address")}
                              </span>
                            </button>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex flex-col gap-6">
                        {/* Order Note */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-card p-6 flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t("order_note_title")}
                          </label>
                          <textarea
                            className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-[#0BADFB] focus:ring-2 focus:ring-[#0BADFB]/20 text-sm transition-all"
                            value={checkout?.orderNote}
                            onChange={(e) => handleChangeOrderNote(e)}
                            placeholder={t("order_note")}
                            maxLength={256}
                            rows={3}
                          />
                        </div>

                        {/* Pickup Store Information */}
                        <div className="bg-white border border-slate-200/80 rounded-3xl shadow-card overflow-hidden">
                          <div className="flex items-center gap-2.5 bg-slate-50/80 px-6 py-4 border-b border-slate-100">
                            <MdOutlineStorefront size={24} className="text-[#0BADFB]" />
                            <span className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight">
                              {t("pickup_from_store")}
                            </span>
                          </div>

                          <div className="p-6 flex flex-col gap-5">
                            <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 p-4 rounded-2xl bg-slate-50/80 border border-slate-100">
                              <div className="flex gap-3 items-start">
                                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0 mt-0.5">
                                  <IoLocationOutline size={20} />
                                </div>
                                <div className="flex flex-col gap-0.5">
                                  <h3 className="font-bold text-sm text-slate-900">
                                    {checkoutData?.seller_self_pickup?.seller_name}
                                  </h3>
                                  <p className="text-xs text-slate-600 leading-relaxed">
                                    {checkoutData?.seller_self_pickup?.pickup_store_address}
                                  </p>
                                </div>
                              </div>
                              <button
                                type="button"
                                className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors self-start sm:self-auto"
                                onClick={() => {
                                  handleLocationRedirect(
                                    checkoutData?.seller_self_pickup?.pickup_latitude,
                                    checkoutData?.seller_self_pickup?.pickup_longitude
                                  );
                                }}
                              >
                                <IoLocationOutline size={16} />
                                <span>{t("direction")}</span>
                              </button>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                                  <FiPhoneCall size={18} />
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                    {t("phone")}
                                  </span>
                                  <span className="font-bold text-xs text-slate-800">
                                    {checkoutData?.seller_self_pickup?.seller_mobile}
                                  </span>
                                </div>
                              </div>

                              <div className="flex items-center gap-3 p-3.5 rounded-2xl border border-slate-100 bg-slate-50/50">
                                <div className="w-9 h-9 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-600 flex-shrink-0">
                                  <MdOutlineWatchLater size={18} />
                                </div>
                                <div>
                                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                                    {t("open_hours")}
                                  </span>
                                  <span className="font-bold text-xs text-slate-800">
                                    {`${t("today")} ${checkoutData?.seller_self_pickup?.opening_time} - ${checkoutData?.seller_self_pickup?.closing_time}`}
                                  </span>
                                </div>
                              </div>
                            </div>

                            <div className="flex justify-end pt-3">
                              <button
                                type="button"
                                onClick={handlePickupOrderStep}
                                className="px-8 py-3 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-sm tracking-wide shadow-md shadow-[#0BADFB]/20 active:scale-95 transition-all"
                              >
                                {t("continue")}
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* step 2 */}
                {checkout?.currentStep == 2 && (
                  <div className="col-span-12 md:col-span-7 lg:col-span-7">
                    <div className="bg-white border border-slate-200/80 rounded-3xl shadow-card overflow-hidden">
                      <div className="flex justify-between items-center bg-slate-50/80 px-6 py-4 border-b border-slate-100">
                        <span className="font-extrabold text-base md:text-lg text-slate-900 tracking-tight">
                          {timeSlotsData?.time_slot_setting == "true"
                            ? t("preferred_day_and_time")
                            : t("order_note_title")}
                        </span>
                      </div>
                      <div className="p-6 flex flex-col gap-6">
                        {timeSlotsData?.time_slot_setting == "true" && (
                          <div className="grid grid-cols-1 md:grid-cols-2 items-start gap-5">
                            {/* Delivery Day Picker */}
                            <div className="flex flex-col gap-2">
                              <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                {timeSlotsData?.time_slots_is_enabled == "true"
                                  ? t("preferred_delivery_day")
                                  : t("estimage_delivery_date")}
                                <span className="text-rose-500 ml-1">*</span>
                              </label>

                              <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
                                <PopoverTrigger
                                  className="w-full px-4 py-3 rounded-2xl border border-slate-200 bg-white hover:border-slate-300 items-center flex justify-between text-xs md:text-sm font-semibold text-slate-800 transition-colors shadow-xs"
                                  onClick={() => setIsPopoverOpen(!isPopoverOpen)}
                                >
                                  <span>{formatDate(checkout?.selectedDate)}</span>
                                  <FaRegCalendarAlt className="text-slate-400" />
                                </PopoverTrigger>
                                {timeSlotsData?.time_slots_is_enabled == "true" && (
                                  <PopoverContent className="w-full p-2 bg-white rounded-3xl shadow-2xl border border-slate-100">
                                    <Calendar
                                      mode="single"
                                      selected={checkout?.selectedDate}
                                      onSelect={handleSelectedDate}
                                      className="rounded-2xl"
                                      fromDate={(() => {
                                        let date = new Date();
                                        date.setDate(
                                          date.getDate() +
                                            parseInt(timeSlotsData.delivery_estimate_days - 1)
                                        );
                                        return date;
                                      })()}
                                      toDate={(() => {
                                        let date = new Date();
                                        let allowedDays =
                                          parseInt(setting?.setting?.time_slots_allowed_days) || 15;
                                        date.setDate(
                                          date.getDate() +
                                            parseInt(timeSlotsData.delivery_estimate_days - 1) +
                                            (allowedDays - 1)
                                        );
                                        return date;
                                      })()}
                                    />
                                  </PopoverContent>
                                )}
                              </Popover>
                            </div>

                            {/* Preferred Delivery Time Slot */}
                            {timeSlotsData?.time_slots_is_enabled == "true" && (
                              <div className="flex flex-col gap-2">
                                <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                                  {t("preferred_delivery_time")}
                                  <span className="text-rose-500 ml-1">*</span>
                                </label>
                                <Select
                                  onValueChange={handleTimeSlotChange}
                                  value={selectedTimeSlot}
                                >
                                  <SelectTrigger className="w-full py-6 px-4 rounded-2xl border border-slate-200 bg-white text-xs md:text-sm font-semibold text-slate-800 shadow-xs">
                                    <SelectValue placeholder="Select a timezone">
                                      {checkout?.timeSlot?.title}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent className="bg-white rounded-2xl shadow-xl border border-slate-100">
                                    {availabeleTimeSlot?.map((slot) => (
                                      <SelectItem
                                        key={slot?.id}
                                        value={slot}
                                        style={{
                                          opacity: slot.isDisabled == "true" ? 0.4 : 1,
                                        }}
                                        className={`rounded-xl ${
                                          slot.isDisabled == true
                                            ? "opacity-40 cursor-not-allowed text-slate-400"
                                            : ""
                                        }`}
                                      >
                                        <div className="flex justify-between items-center w-full gap-4">
                                          <span>{slot?.translations?.title}</span>
                                           {slot?.is_free_delivery && (
                                            <span className="text-xs font-bold text-[#0BADFB] bg-[#e0f7fe] px-2 py-0.5 rounded-full">
                                              {t("freedelivery")}
                                            </span>
                                          )}
                                        </div>
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                            )}
                          </div>
                        )}

                        {/* Order Note */}
                        <div className="flex flex-col gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t("order_note_title")}
                          </label>
                          <textarea
                            className="w-full rounded-2xl border border-slate-200 p-4 outline-none focus:border-[#0BADFB] focus:ring-2 focus:ring-[#0BADFB]/20 text-sm transition-all"
                            value={checkout?.orderNote}
                            onChange={(e) => handleChangeOrderNote(e)}
                            placeholder={t("order_note")}
                            maxLength={256}
                            rows={3}
                          />
                        </div>

                        {/* Navigation Buttons */}
                        <div className="flex justify-between items-center pt-4 border-t border-slate-100">
                          <button
                            type="button"
                            className="px-6 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-bold text-xs transition-colors"
                            onClick={() => dispatch(setCurrentStep({ data: 1 }))}
                          >
                            {t("previous")}
                          </button>
                          <button
                            type="button"
                            className="px-8 py-3 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-sm tracking-wide shadow-md shadow-[#0BADFB]/20 active:scale-95 transition-all"
                            onClick={handleSecondStep}
                          >
                            {t("continue")}
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
                {/* step 3 */}
                {checkout?.currentStep == 3 && (
                  <div className="col-span-12 md:col-span-7 lg:col-span-7">
                    <CheckoutPayment
                      checkoutData={checkoutData}
                      selectedPaymentMethod={selectedPaymentMethod}
                      setSelectedPaymentMethod={setSelectedPaymentMethod}
                      setCurrentStep={setCurrentStep}
                    />
                  </div>
                )}
                <div className="col-span-12 md:col-span-5 lg:col-span-5">
                  <OrderSummaryCard
                    step={checkout?.currentStep}
                    checkoutData={checkoutData}
                    handlePlaceOrder={handlePlaceOrder}
                    handleFirstStep={handleFirstStep}
                    handleSecondStep={handleSecondStep}
                    handlePickupOrderStep={handlePickupOrderStep}
                    checkOutError={checkOutError}
                    checkoutLoading={checkoutLoading}
                  />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
      {showAddAddres && (<NewAddressModal
        fetchAddress={fetchAddress}
        showAddAddres={showAddAddres}
        setShowAddAddres={setShowAddAddres}
        isAddressSelected={isAddressSelected}
      />)}
      {showStripe && (<StripeModal
        showStripe={showStripe}
        setShowStripe={setShowStripe}
        amount={checkout?.checkoutTotal}
        clientSecret={stripeClientSecret}
        stripeTransId={stripeTransactionId}
        stripeOrderId={stripeOrderId}
        type="order"
      />)}
      {/* <OrderSuccessModal showOrderSuccess={showOrderSuccess} handlePaymentClose={handlePaymentClose} /> */}
    </section>
  );
};

export default Checkout;
