import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import CartProductsCard from "./CartDrawerProductsCard";
import { useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import { RiCloseFill } from "react-icons/ri";
import NoCartData from "@/assets/Empty_Cart.svg";
import Image from "next/image";
import {
  clearCartPromo,
  setCartProducts,
  setCartPromo,
  setCartSubTotal,
  setDoorStepDeliveryMode,
  setGuestCartTotal,
  setSelfPickupMode,
} from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import Login from "../login/Login";
import { useLocalizedRouter } from "@/utils/localizedNav";
import CouponCodeDrawer from "@/components/couponcode/CouponCodeDrawer";
import { RiCoupon3Line } from "react-icons/ri";
import { LocalizedLink } from "@/utils/localizedNav";
import Loader from "../loader/Loader";
import CartDrawerSkeletons, {
  AppliedCouponSkeleton,
} from "./CartDrawerLoading.jsx";
import { setListingSource } from "@/redux/slices/productFilterSlice";

const CartDrawer = ({ showCart, setShowCart, setMobileActiveKey }) => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const city = useSelector((state) => state.City.city);
  const cart = useSelector((state) => state.Cart);
  const user = useSelector((state) => state.User);
  const setting = useSelector((state) => state.Setting.setting);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const coupon = useSelector((state) => state.Cart.promo_code);

  const effectiveLat =
    city?.latitude || setting?.default_city?.latitude || 23.242;
  const effectiveLng =
    city?.longitude || setting?.default_city?.longitude || 69.6669;

  const [showLogin, setShowLogin] = useState(false);
  const [cartProductsData, setCartProductsData] = useState([]);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [couponLoading, setCouponLoading] = useState(false);
  const [showCouponCode, setShowCouponCode] = useState(false);

  useEffect(() => {
    if (showCart) {
      if (cart?.isGuest == true && cart?.guestCart?.length == 0) {
        setCartProductsData([]);
      } else if (cart.isGuest == false) {
        fetchCart();
      } else if (cart?.guestCart?.length > 0 && cart?.isGuest == true) {
        fetchGuestCart();
      }
    }
  }, [showCart]);

  const fetchCart = async () => {
    setLoading(true);
    try {
      const cartData = await api.getCart({
        latitude: effectiveLat,
        longitude: effectiveLng,
      });
      if (cartData?.status == 1) {
        setCartProductsData(cartData?.data?.cart);
        dispatch(setCartSubTotal({ data: cartData?.data?.sub_total }));
        dispatch(setSelfPickupMode({ data: cartData?.data?.self_pickup_mode }));
        dispatch(
          setDoorStepDeliveryMode({
            data: cartData?.data?.doorstep_delivery_mode,
          }),
        );
        setCartData(cartData?.data);
        await handleApplyCoupon();
        const productsData = cartData?.data?.cart?.map((product) => {
          return {
            product_id: product?.product_id,
            product_variant_id: product?.product_variant_id,
            qty: product?.qty,
          };
        });

        dispatch(setCartProducts({ data: productsData }));
        setLoading(false);
      } else {
        dispatch(setCartProducts({ data: [] }));
        dispatch(setCartSubTotal({ data: 0 }));
        setCartProductsData([]);
        // setCartData([])
        setCartSubTotal(0);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleApplyCoupon = async () => {
    setCouponLoading(true);
    try {
      const response = await api.setPromoCode({
        promoCodeName: coupon?.promo_code,
        amount: cart?.cartSubTotal,
      });
      if (response.status == 1) {
        dispatch(setCartPromo({ data: response.data }));
        setShowCouponCode(false);
      } else {
        await handleRemoveCoupon();
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setCouponLoading(false);
    }
  };

  const fetchGuestCart = async () => {
    setLoading(true);
    try {
      const variantIds = cart?.guestCart?.map((p) => p.product_variant_id);
      const quantities = cart?.guestCart?.map((p) => p.qty);
      const response = await api.getGuestCart({
        latitude: effectiveLat,
        longitude: effectiveLng,
        variant_ids: variantIds?.join(","),
        quantities: quantities?.join(","),
      });
      if (response.status == 1) {
        setCartProductsData(response.data.cart);
        dispatch(setCartSubTotal({ data: response?.data?.sub_total }));
        dispatch(setGuestCartTotal({ data: response?.data?.sub_total }));
      }
    } catch (error) {
      console.log("Error", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCheckoutbtnClick = () => {
    if (cart.isGuest) {
      setShowCart(false);
      setShowLogin(true);
    } else {
      router.push("/checkout");
    }
  };

  const isCouponApplied = cart?.promo_code != null;
  const handleRemoveCoupon = async () => {
    setCouponLoading(true);
    dispatch(clearCartPromo());
    setCouponLoading(false);
  };
  const handleShopNow = () => {
    dispatch(setListingSource({ data: "all" }));
  };

  return (
    <>
      <Sheet open={showCart}>
        <SheetContent
          side={language?.type == "RTL" ? "left" : "right"}
          className="p-0 w-full sm:max-w-md flex flex-col h-screen bg-slate-50 border-l border-slate-200/80 shadow-2xl"
        >
          {/* Drawer Header */}
          <SheetHeader className="px-6 py-4 bg-white border-b border-slate-100 flex flex-row items-center justify-between text-left shrink-0">
            <SheetTitle className="text-base font-bold text-slate-900 flex items-center gap-2.5">
              <span>{t("shoppingCart") || "Your Cart"}</span>
              {cartProductsData?.length > 0 && (
                <span className="text-[11px] font-semibold bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-full border border-emerald-100">
                  {cartProductsData.length} {cartProductsData.length === 1 ? "item" : "items"}
                </span>
              )}
            </SheetTitle>
            <button
              type="button"
              aria-label="Close cart"
              onClick={() => setShowCart(false)}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95"
            >
              <RiCloseFill size={20} />
            </button>
          </SheetHeader>

          {loading ? (
            <div className="p-4 flex-grow overflow-y-auto">
              <CartDrawerSkeletons />
            </div>
          ) : cartProductsData?.length !== 0 ? (
            <>
              {/* Product list */}
              <div className="flex-grow overflow-y-auto p-4 space-y-3">
                {cartProductsData?.map((product) => (
                  <div key={product?.id || product?.product_variant_id}>
                    <CartProductsCard
                      product={product}
                      cartProductsData={cartProductsData}
                      setCartProductsData={setCartProductsData}
                    />
                  </div>
                ))}
              </div>

              {/* Bottom Checkout & Summary Footer */}
              <div className="w-full bg-white border-t border-slate-100 p-5 shadow-dropdown sticky bottom-0 z-20 space-y-4">
                {/* Coupon Box */}
                {couponLoading ? (
                  <AppliedCouponSkeleton />
                ) : cart?.isGuest == false && !isCouponApplied ? (
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 flex justify-between items-center">
                    <div className="flex items-center gap-2 text-xs font-semibold text-slate-700">
                      <RiCoupon3Line size={18} className="text-emerald-600" />
                      <span>{t("have_coupon") || "Have a promo code?"}</span>
                    </div>
                    <button
                      type="button"
                      className="px-3 py-1 bg-white hover:bg-emerald-50 text-emerald-700 border border-slate-200 hover:border-emerald-200 rounded-full text-xs font-semibold shadow-xs transition-colors"
                      onClick={() => setShowCouponCode(true)}
                    >
                      {t("view_coupon") || "Apply"}
                    </button>
                  </div>
                ) : (
                  cart?.isGuest == false &&
                  isCouponApplied && (
                    <div className="p-3 rounded-xl bg-emerald-50/70 border border-emerald-200/80 flex justify-between items-center">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div className="w-8 h-8 rounded-lg bg-emerald-100/80 flex items-center justify-center text-emerald-700 shrink-0">
                          <RiCoupon3Line size={18} />
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-xs text-slate-900 truncate">
                            {cart?.promo_code?.promo_code}
                          </p>
                          <p className="text-[11px] text-emerald-700 font-medium">
                            {t("promoCodeSuccess") || "Coupon Applied"}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs font-bold text-emerald-700">
                          -{setting?.currency}{cart?.promo_code?.discount}
                        </span>
                        <button
                          type="button"
                          className="text-[11px] font-semibold text-rose-600 hover:text-rose-700 underline"
                          onClick={handleRemoveCoupon}
                          disabled={couponLoading}
                        >
                          {couponLoading ? "..." : (t("delete") || "Remove")}
                        </button>
                      </div>
                    </div>
                  )
                )}

                {/* Subtotal row */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-slate-500 font-medium">{t("total") || "Subtotal"}</span>
                    <span className="font-bold text-lg text-slate-900 tracking-tight">
                      {setting?.currency}
                      {cart.isGuest
                        ? cart?.guestCartTotal
                        : isCouponApplied
                          ? (
                              cart?.cartSubTotal - cart?.promo_code?.discount
                            )?.toFixed(
                              setting?.decimal_point
                                ? setting?.decimal_point
                                : 0,
                            )
                          : cart?.cartSubTotal.toFixed(
                              setting?.decimal_point
                                ? setting?.decimal_point
                                : 0,
                            )}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    Taxes and shipping calculated at checkout
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-2 pt-1">
                  <button
                    type="button"
                    className="w-full py-3 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] text-white font-bold text-sm shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer"
                    onClick={handleCheckoutbtnClick}
                  >
                    <span>{user?.jwtToken ? (t("checkout") || "Proceed to Checkout") : (t("login_to_checkout") || "Login to Checkout")}</span>
                  </button>
                  <button
                    type="button"
                    className="w-full py-2.5 rounded-full border border-slate-200 hover:border-[#0BADFB] hover:bg-slate-50 text-slate-700 hover:text-[#0BADFB] font-semibold text-xs transition-colors cursor-pointer"
                    onClick={() => {
                      setShowCart(false);
                      router.push("/cart");
                    }}
                  >
                    {t("view_cart") || "View Full Cart"}
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full my-auto px-6 py-12">
              <div className="flex items-center justify-center flex-col text-center max-w-xs">
                <div className="w-48 h-48 relative mb-4">
                  <Image
                    src={NoCartData}
                    alt="Empty Cart"
                    fill
                    sizes="192px"
                    className="object-contain"
                  />
                </div>
                <h3 className="font-bold text-lg text-slate-900 mb-1">
                  {t("empty_cart_list_message") || "Your cart is empty"}
                </h3>
                <p className="text-xs text-slate-500 mb-6 leading-relaxed">
                  {t("empty_cart_list_description") || "Looks like you haven't added anything to your cart yet."}
                </p>
                <LocalizedLink
                  href="/products"
                  className="px-6 py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-xs shadow-sm hover:shadow transition-all"
                  onClick={() => {
                    handleShopNow();
                    setShowCart(false);
                  }}
                >
                  {t("empty_cart_list_button_name") || "Start Shopping"}
                </LocalizedLink>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
      <Login
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setMobileActiveKey={setMobileActiveKey}
      />
      <CouponCodeDrawer
        showCouponCode={showCouponCode}
        setShowCouponCode={setShowCouponCode}
      />
    </>
  );
};

export default CartDrawer;
