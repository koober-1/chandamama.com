import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import CartProductCard from "./CartProductCard";
import CartCouponCard from "./CartCouponCard";
import { t } from "@/utils/translation";
import { useSelector, useDispatch } from "react-redux";
import {
  setCartProducts,
  setCartSubTotal,
  setDoorStepDeliveryMode,
  setSelfPickupMode,
} from "@/redux/slices/cartSlice";
import * as api from "@/api/apiRoutes";
import CouponCodeDrawer from "@/components/couponcode/CouponCodeDrawer";
import { LocalizedLink } from "@/utils/localizedNav";
import Image from "next/image";
import NoCartData from "@/assets/Empty_Cart.svg";
import CartPageSkeleton from "./CartLoading";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { clearAllFilter } from "@/redux/slices/productFilterSlice";
import { clearCartPromo } from "@/redux/slices/cartSlice";
import { FiShoppingBag, FiArrowLeft } from "react-icons/fi";
import { BsShieldCheck } from "react-icons/bs";
import { RiSecurePaymentLine } from "react-icons/ri";

const Cart = () => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const city = useSelector((state) => state.City.city);
  const setting = useSelector((state) => state.Setting);
  const cart = useSelector((state) => state.Cart);
  const user = useSelector((state) => state.User);
  const [cartProductsData, setCartProductsData] = useState([]);
  const [showCouponCode, setShowCouponCode] = useState(false);
  const [cartData, setCartData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);

  const effectiveLat =
    city?.latitude || setting?.setting?.default_city?.latitude || 23.242;
  const effectiveLng =
    city?.longitude || setting?.setting?.default_city?.longitude || 69.6669;

  useEffect(() => {
    if (cart?.isGuest == true && cart?.guestCart?.length == 0) {
      setCartProductsData([]);
      setInitialLoad(false);
    } else if (cart.isGuest == false) {
      fetchCart();
    } else if (cart?.guestCart?.length > 0 && cart?.isGuest == true) {
      fetchGuestCart();
    }
  }, []);

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
      }
      setLoading(false);
      setInitialLoad(false);
    } catch (error) {
      setLoading(false);
      setInitialLoad(false);
      console.log("Error", error);
    }
  };

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
          })
        );
        setCartData(cartData?.data);
        setLoading(false);
        setInitialLoad(false);
        const productsData = cartData?.data?.cart?.map((product) => {
          return {
            product_id: product?.product_id,
            product_variant_id: product?.product_variant_id,
            qty: product?.qty,
          };
        });
        dispatch(setCartProducts({ data: productsData }));
      } else {
        dispatch(setCartProducts({ data: [] }));
        dispatch(setCartSubTotal({ data: 0 }));
        setCartProductsData([]);
        setCartSubTotal(0);
        setLoading(false);
        setInitialLoad(false);
      }
    } catch (error) {
      setLoading(false);
      setInitialLoad(false);
      console.log("error", error);
    }
  };

  // Show skeleton during initial load
  if (initialLoad) {
    return (
      <>
        <BreadCrumb />
        <CartPageSkeleton />
      </>
    );
  }

  // Show empty state when no products and not loading
  if (!loading && cartProductsData?.length === 0) {
    return (
      <section className="bg-gradient-to-b from-slate-50 to-white min-h-[70vh] py-8">
        <BreadCrumb />
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-center py-16">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xl p-10 max-w-lg w-full flex flex-col items-center text-center gap-5">
              <div className="w-52 h-52 relative">
                <Image
                  src={NoCartData}
                  alt="Empty Cart"
                  fill
                  className="object-contain drop-shadow-md"
                />
              </div>
              <div>
                <h1 className="font-black text-2xl text-slate-900 tracking-tight mb-2">
                  {t("empty_cart_list_message") || "Your cart is empty!"}
                </h1>
                <p className="text-sm font-medium text-slate-500 max-w-sm leading-relaxed">
                  {t("empty_cart_list_description") ||
                    "Looks like you haven't added anything yet. Discover our amazing products!"}
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
                <button
                  onClick={() => {
                    router.push("/products");
                    dispatch(clearAllFilter());
                    dispatch(clearCartPromo());
                  }}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-sm shadow-md shadow-[#0BADFB]/25 active:scale-95 transition-all cursor-pointer"
                >
                  <FiShoppingBag size={16} />
                  {t("empty_cart_list_button_name") || "Start Shopping"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-slate-50/60 min-h-[80vh] pb-16">
      <BreadCrumb />
      <div className="container mx-auto px-4">
        {loading ? (
          <div className="my-10">
            <CartPageSkeleton />
          </div>
        ) : (
          <div className="my-6 md:my-8">
            {/* Page Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-7">
              <div>
                <h1 className="font-black text-2xl md:text-3xl text-slate-900 tracking-tight flex items-center gap-3">
                  <span className="inline-flex items-center justify-center w-9 h-9 rounded-xl bg-[#0BADFB]/10 text-[#0BADFB]">
                    <FiShoppingBag size={20} />
                  </span>
                  {t("myCart") || "My Cart"}
                </h1>
                <p className="text-sm font-medium text-slate-500 mt-1.5 ml-12">
                  {cartProductsData?.length}{" "}
                  {cartProductsData?.length === 1 ? "item" : "items"} in your cart
                </p>
              </div>
              <LocalizedLink
                href="/products"
                className="self-start sm:self-center inline-flex items-center gap-2 text-xs font-semibold text-[#0BADFB] hover:text-[#0298e0] border border-[#0BADFB]/30 hover:border-[#0BADFB] px-4 py-2 rounded-full transition-all"
              >
                <FiArrowLeft size={13} />
                Continue Shopping
              </LocalizedLink>
            </div>

            <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
              {/* Left: Product Items Table */}
              <div className="col-span-12 lg:col-span-8">
                {/* Table Header — brand primary accent */}
                <div className="hidden md:grid grid-cols-12 gap-4 px-5 py-3 bg-[#0BADFB]/8 rounded-t-2xl border border-[#0BADFB]/20 border-b-0">
                  <div className="col-span-4 text-[11px] font-extrabold uppercase tracking-widest text-[#0BADFB]">
                    {t("product") || "Product"}
                  </div>
                  <div className="col-span-2 text-center text-[11px] font-extrabold uppercase tracking-widest text-[#0BADFB]">
                    {t("price") || "Price"}
                  </div>
                  <div className="col-span-3 text-center text-[11px] font-extrabold uppercase tracking-widest text-[#0BADFB]">
                    {t("quantity") || "Quantity"}
                  </div>
                  <div className="col-span-2 text-center text-[11px] font-extrabold uppercase tracking-widest text-[#0BADFB]">
                    {t("total") || "Total"}
                  </div>
                  <div className="col-span-1 text-center text-[11px] font-extrabold uppercase tracking-widest text-[#0BADFB]"></div>
                </div>

                {/* Cart items */}
                <div className="bg-white border border-slate-200/80 md:border-t-0 md:rounded-t-none rounded-2xl md:rounded-b-2xl shadow-sm overflow-hidden divide-y divide-slate-100">
                  {cartProductsData?.map((product) => {
                    const cartProduct = cart?.cartProducts?.find(
                      (prdct) =>
                        prdct?.product_variant_id == product?.product_variant_id
                    );
                    const guestProduct = cart?.guestCart?.find(
                      (prdct) =>
                        prdct?.product_variant_id == product?.product_variant_id
                    );

                    if (cartProduct?.qty > 0 || guestProduct?.qty > 0) {
                      return (
                        <CartProductCard
                          key={product?.id || product?.product_variant_id}
                          product={product}
                          cartProductsData={cartProductsData}
                          setCartProductsData={setCartProductsData}
                        />
                      );
                    }
                    return null;
                  })}
                </div>

                {/* Trust badges */}
                <div className="mt-4 flex flex-wrap gap-2.5">
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-emerald-50/80 border border-emerald-200/60 text-emerald-700 text-xs font-semibold">
                    <BsShieldCheck size={13} />
                    <span>Secure Checkout</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-blue-50/80 border border-blue-200/60 text-blue-700 text-xs font-semibold">
                    <RiSecurePaymentLine size={14} />
                    <span>Encrypted Payment</span>
                  </div>
                  <div className="flex items-center gap-2 px-3.5 py-2 rounded-full bg-amber-50/80 border border-amber-200/60 text-amber-700 text-xs font-semibold">
                    <FiShoppingBag size={12} />
                    <span>Easy Returns</span>
                  </div>
                </div>
              </div>

              {/* Right: Order Summary sticky */}
              <div className="col-span-12 lg:col-span-4 sticky top-28">
                <CartCouponCard setShowCouponCode={setShowCouponCode} />
              </div>
            </div>
          </div>
        )}
      </div>
      <CouponCodeDrawer
        showCouponCode={showCouponCode}
        setShowCouponCode={setShowCouponCode}
      />
    </section>
  );
};

export default Cart;
