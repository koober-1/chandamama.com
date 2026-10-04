import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import {
  addtoGuestCart,
  clearCartPromo,
  setCartProducts,
  setCartPromo,
  setCartSubTotal,
  setGuestCartTotal,
} from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import { BiTrash } from "react-icons/bi";
import { FaMinus, FaPlus } from "react-icons/fa";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { t } from "@/utils/translation";
import { getVariantColorData } from "@/lib/utils";

const CartProductCard = ({
  product,
  cartProductsData,
  setCartProductsData,
}) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.Setting.setting);

  const cart = useSelector((state) => state.Cart);
  const coupon = useSelector((state) => state.Cart.promo_code);
  const [totalPrice, setTotalPrice] = useState();

  useEffect(() => {
    let productQuantity = cart?.isGuest
      ? getProductQuantities(cart?.guestCart)
      : getProductQuantities(cart?.cartProducts);
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.product_id,
    )?.qty;
    const finalPrice =
      product?.discounted_price == 0
        ? product?.price
        : product?.discounted_price;
    setTotalPrice(finalPrice * productQty);
  }, [cart]);

  const handleRemoveFromCart = async () => {
    try {
      const response = await api.removeFromCart({
        product_id: product?.product_id,
        product_variant_id: product?.product_variant_id,
      });
      if (response?.status == 1) {
        const remainItems = cart?.cartProducts?.filter(
          (cartProduct) =>
            cartProduct?.product_variant_id !== product?.product_variant_id,
        );
        const updatedProducts = cartProductsData?.filter(
          (cartProduct) =>
            cartProduct?.product_variant_id !== product?.product_variant_id,
        );
        setCartProductsData(updatedProducts);
        dispatch(setCartProducts({ data: remainItems }));
        dispatch(setCartSubTotal({ data: response?.sub_total }));
        // toast.success(response.message)
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCalculateTotal = (products) => {
    const total = products?.reduce((prev, curr) => {
      prev += curr?.productPrice * curr.qty;
      return prev;
    }, 0);
    dispatch(setCartSubTotal({ data: total }));
    dispatch(setGuestCartTotal({ data: total }));
  };

  const handleGuestCartRemove = () => {
    const remainItems = cart?.guestCart?.filter(
      (cartProduct) =>
        cartProduct?.product_variant_id !== product?.product_variant_id,
    );
    const updatedProducts = cartProductsData?.filter(
      (cartProduct) =>
        cartProduct?.product_variant_id !== product?.product_variant_id,
    );
    setCartProductsData(updatedProducts);
    dispatch(addtoGuestCart({ data: remainItems }));
    handleCalculateTotal(remainItems);
  };

  const handleRemoveItem = async () => {
    if (cart.isGuest) {
      handleGuestCartRemove();
    } else {
      await handleRemoveFromCart();
    }
  };

  const getProductQuantities = (products) => {
    return Object.entries(
      products?.reduce((quantities, product) => {
        const existingQty = quantities[product.product_id] || 0;
        return {
          ...quantities,
          [product.product_id]: existingQty + product.qty,
        };
      }, {}),
    ).map(([productId, qty]) => ({
      product_id: parseInt(productId),
      qty,
    }));
  };

  const handleQuantityIncrease = async () => {
    try {
      let productQuantity = cart?.isGuest
        ? getProductQuantities(cart?.guestCart)
        : getProductQuantities(cart?.cartProducts);
      const productQty = productQuantity?.find(
        (prdct) => prdct?.product_id == product?.product_id,
      )?.qty;
      const cartProductQty = cart.cartProducts.find(
        (prdct) =>
          prdct?.product_id == product?.product_id &&
          prdct?.product_variant_id == product?.product_variant_id,
      );
      if (product?.is_unlimited_stock !== 0) {
        if (productQty >= Number(product?.total_allowed_quantity)) {
          toast.error(t("max_cart_limit_error"));
        } else {
          if (cart.isGuest) {
            let updatedProducts = cart?.guestCart?.map((cartProduct) => {
              if (
                cartProduct?.product_id == product?.product_id &&
                cartProduct?.product_variant_id == product?.product_variant_id
              ) {
                return { ...cartProduct, qty: Number(cartProduct?.qty + 1) };
              } else {
                return cartProduct;
              }
            });
            handleCalculateTotal(updatedProducts);
            dispatch(addtoGuestCart({ data: updatedProducts }));
          } else {
            try {
              const response = await api.addToCart({
                product_id: product?.product_id,
                product_variant_id: product?.product_variant_id,
                qty: Number(cartProductQty.qty + 1),
              });
              if (response.status == 1) {
                let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
                  if (
                    cartProduct?.product_id == product?.product_id &&
                    cartProduct?.product_variant_id ==
                    product?.product_variant_id
                  ) {
                    return { ...cartProduct, qty: cartProductQty?.qty + 1 };
                  } else {
                    return cartProduct;
                  }
                });

                dispatch(setCartSubTotal({ data: response.sub_total }));
                dispatch(setCartProducts({ data: updatedProducts }));
                await handleApplyCoupon(response.sub_total);
              }
            } catch (error) {
              console.log("Error", error);
            }
          }
        }
      } else {
        if (productQty >= Number(product?.stock)) {
          toast.error(t("out_of_stock_message"));
        } else if (productQty >= Number(product?.total_allowed_quantity)) {
          toast.error(t("max_cart_limit_error"));
        } else {
          if (cart.isGuest) {
            let updatedProducts = cart?.guestCart?.map((cartProduct) => {
              if (
                cartProduct?.product_id == product?.product_id &&
                cartProduct?.product_variant_id == product?.product_variant_id
              ) {
                return { ...cartProduct, qty: Number(cartProduct?.qty + 1) };
              } else {
                return cartProduct;
              }
            });
            handleCalculateTotal(updatedProducts);
            dispatch(addtoGuestCart({ data: updatedProducts }));
          } else {
            try {
              const response = await api.addToCart({
                product_id: product?.product_id,
                product_variant_id: product?.product_variant_id,
                qty: Number(cartProductQty.qty + 1),
              });
              if (response.status == 1) {
                let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
                  if (
                    cartProduct?.product_id == product?.product_id &&
                    cartProduct?.product_variant_id ==
                    product?.product_variant_id
                  ) {
                    return { ...cartProduct, qty: cartProductQty?.qty + 1 };
                  } else {
                    return cartProduct;
                  }
                });
                dispatch(setCartSubTotal({ data: response.sub_total }));
                dispatch(setCartProducts({ data: updatedProducts }));
                await handleApplyCoupon(response.sub_total);
              }
            } catch (error) {
              console.log("Error", error);
            }
          }
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  // Calling this function on every increament decreament so total adjust with coupon card
  const handleApplyCoupon = async (total) => {
    try {
      const response = await api.setPromoCode({
        promoCodeName: coupon?.promo_code,
        amount: total,
      });
      if (response.status == 1) {
        dispatch(setCartPromo({ data: response.data }));
      } else {
        await handleRemoveCoupon();
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleQuantityDecrease = async () => {
    try {
      let productQuantity;
      if (cart?.isGuest) {
        productQuantity = getProductQuantities(cart?.guestCart);
      } else {
        productQuantity = getProductQuantities(cart?.cartProducts);
      }
      const productQty = productQuantity?.find(
        (prdct) => prdct?.product_id == product?.product_id,
      )?.qty;
      const variantQty = cart?.guestCart?.find(
        (prdct) =>
          prdct?.product_id == product?.product_id &&
          prdct?.product_variant_id == product?.product_variant_id,
      )?.qty;
      const cartProductQty = cart.cartProducts.find(
        (prdct) =>
          prdct?.product_id == product?.product_id &&
          prdct?.product_variant_id == product?.product_variant_id,
      );
      if (cart.isGuest) {
        if (variantQty <= 1) {
          return;
        }
        let updatedProducts = cart?.guestCart?.map((cartProduct) => {
          if (
            cartProduct?.product_id == product?.product_id &&
            cartProduct?.product_variant_id == product?.product_variant_id
          ) {
            return { ...cartProduct, qty: Number(cartProduct?.qty - 1) };
          } else {
            return cartProduct;
          }
        });
        handleCalculateTotal(updatedProducts);
        dispatch(addtoGuestCart({ data: updatedProducts }));
      } else {
        if (cartProductQty.qty <= 1) {
          return;
        }
        try {
          const response = await api.addToCart({
            product_id: product?.product_id,
            product_variant_id: product?.product_variant_id,
            qty: Number(cartProductQty.qty - 1),
          });
          if (response.status == 1) {
            let updatedProducts = cart?.cartProducts?.map((cartProduct) => {
              if (
                cartProduct?.product_id == product?.product_id &&
                cartProduct?.product_variant_id == product?.product_variant_id
              ) {
                return { ...cartProduct, qty: cartProductQty?.qty - 1 };
              } else {
                return cartProduct;
              }
            });
            dispatch(setCartSubTotal({ data: response.sub_total }));
            dispatch(setCartProducts({ data: updatedProducts }));
            await handleApplyCoupon(response.sub_total);
          }
        } catch (error) {
          console.log("Error", error);
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleRemoveCoupon = async () => {
    dispatch(clearCartPromo());
  };

  const addedQuantity =
    cart.isGuest === false
      ? cart?.cartProducts?.find(
        (prdct) => prdct?.product_variant_id == product?.product_variant_id
      )?.qty
      : cart?.guestCart?.find(
        (prdct) => prdct?.product_variant_id == product?.product_variant_id
      )?.qty;

  const colorData = getVariantColorData(product) || getVariantColorData(product?.product_variant) || getVariantColorData(product?.variant);

  return (
    <div className="p-5 w-full min-w-0 transition-colors hover:bg-slate-50/50">
      {/* Desktop Grid Row */}
      <div className="hidden md:grid grid-cols-12 items-center gap-4">
        {/* Product Image and Details */}
        <div className="col-span-4 flex items-center space-x-4">
          <div className="relative w-16 h-16 rounded-2xl flex-shrink-0 bg-slate-50 border border-slate-100 p-1.5 overflow-hidden">
            <ImageWithPlaceholder
              src={product?.image_url}
              alt={product?.product?.translations?.name || "Product"}
              width={160}
              height={160}
              className="w-full h-full object-contain"
            />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-sm font-bold text-slate-800 line-clamp-2 leading-snug">
              {product?.product?.translations?.name || product?.name}
            </h3>
            <div className="flex items-center gap-1.5 flex-wrap mt-1">
              <span className="inline-block text-[11px] font-semibold text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full">
                {product?.measurement} {product?.unit?.translations?.short_code || product?.unit_code || ""}
              </span>
              {colorData?.name && (
                <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
                  {colorData.hex && (
                    <span
                      className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs shrink-0 inline-block"
                      style={{ backgroundColor: colorData.hex }}
                    />
                  )}
                  <span>{colorData.name}</span>
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Product Price */}
        <div className="col-span-2 text-center px-1">
          {product?.discounted_price !== 0 && product?.discounted_price !== product?.price ? (
            <div className="flex flex-col items-center">
              <span className="text-sm font-extrabold text-emerald-600">
                {setting?.currency}
                {product?.discounted_price}
              </span>
              <span className="text-xs font-medium text-slate-400 line-through">
                {setting?.currency} {product?.price}
              </span>
            </div>
          ) : (
            <span className="text-sm font-bold text-slate-800">
              {setting?.currency} {product?.price}
            </span>
          )}
        </div>

        {/* Quantity Stepper (Pill style) */}
        <div className="col-span-3 flex items-center justify-center">
          <div className="inline-flex items-center border border-slate-200 bg-slate-50 rounded-full p-0.5 shadow-inner">
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-white hover:bg-[#0BADFB] hover:text-white text-slate-700 shadow-xs transition-all flex items-center justify-center"
              onClick={handleQuantityDecrease}
              aria-label="Decrease quantity"
            >
              <FaMinus className="text-[10px]" />
            </button>
            <input
              type="text"
              className="w-10 text-center font-bold text-xs bg-transparent text-slate-800"
              value={addedQuantity}
              disabled
            />
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-white hover:bg-[#0BADFB] hover:text-white text-slate-700 shadow-xs transition-all flex items-center justify-center"
              onClick={handleQuantityIncrease}
              aria-label="Increase quantity"
            >
              <FaPlus className="text-[10px]" />
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="col-span-2 text-center px-1">
          <p className="text-sm font-extrabold text-slate-900">
            {setting?.currency}
            {totalPrice}
          </p>
        </div>

        {/* Remove Button */}
        <div className="col-span-1 text-center">
          <button
            type="button"
            className="w-8 h-8 mx-auto rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 transition-all flex items-center justify-center"
            onClick={handleRemoveItem}
            aria-label="Remove item"
          >
            <BiTrash size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Card */}
      <div className="flex flex-col md:hidden gap-3.5 bg-slate-50/50 p-3.5 rounded-2xl border border-slate-100">
        <div className="flex justify-between items-start gap-3">
          <div className="flex items-center gap-3 min-w-0">
            <div className="relative w-14 h-14 rounded-xl flex-shrink-0 bg-white border border-slate-100 p-1 overflow-hidden">
              <ImageWithPlaceholder
                src={product?.image_url}
                alt={product?.product?.translations?.name || "Product"}
                width={140}
                height={140}
                className="h-full w-full object-contain"
              />
            </div>
            <div className="min-w-0">
              <h3 className="text-sm font-bold text-slate-800 truncate">
                {product?.product?.translations?.name || product?.name}
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                <span className="text-xs font-semibold text-slate-500">
                  {product?.measurement} {product?.unit_code || product?.unit?.translations?.short_code || ""}
                </span>
                {colorData?.name && (
                  <span className="inline-flex items-center gap-1 text-[11px] font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200/60">
                    {colorData.hex && (
                      <span
                        className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs shrink-0 inline-block"
                        style={{ backgroundColor: colorData.hex }}
                      />
                    )}
                    <span>{colorData.name}</span>
                  </span>
                )}
              </div>
            </div>
          </div>
          <button
            type="button"
            className="w-8 h-8 rounded-full hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center flex-shrink-0"
            onClick={handleRemoveItem}
            aria-label="Remove item"
          >
            <BiTrash size={18} />
          </button>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-slate-200/60">
          <div>
            <span className="text-xs text-slate-400 font-semibold">{t("price")}: </span>
            <span className="text-sm font-bold text-emerald-600">
              {setting?.currency}
              {product?.discounted_price !== 0 ? product?.discounted_price : product?.price}
            </span>
          </div>

          {/* Stepper */}
          <div className="inline-flex items-center border border-slate-200 bg-white rounded-full p-0.5 shadow-xs">
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#0BADFB] hover:text-white text-slate-700 transition-all flex items-center justify-center"
              onClick={handleQuantityDecrease}
            >
              <FaMinus className="text-[10px]" />
            </button>
            <input
              type="text"
              className="w-8 text-center font-bold text-xs bg-transparent text-slate-800"
              value={addedQuantity}
              disabled
            />
            <button
              type="button"
              className="w-7 h-7 rounded-full bg-slate-100 hover:bg-[#0BADFB] hover:text-white text-slate-700 transition-all flex items-center justify-center"
              onClick={handleQuantityIncrease}
            >
              <FaPlus className="text-[10px]" />
            </button>
          </div>

          <div>
            <span className="text-xs text-slate-400 font-semibold">{t("total")}: </span>
            <span className="text-sm font-extrabold text-slate-900">
              {setting?.currency}
              {totalPrice}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartProductCard;
