import React, { useState, useEffect } from "react";
import {
  FaStar,
  FaShoppingBasket,
  FaMinus,
  FaPlus,
} from "react-icons/fa";
import { LocalizedLink } from "@/utils/localizedNav";
import { t } from "@/utils/translation";
import { MdArrowDropDown } from "react-icons/md";
import VariantsModal from "../variantsmodal/VariantsModal";
import ProductDetailModal from "../productdetailmodal/ProductDetailModal";
import { useDispatch, useSelector } from "react-redux";
import {
  addGuestCartTotal,
  addtoGuestCart,
  setCart,
  setCartProducts,
  setCartSubTotal,
  subGuestCartTotal,
} from "@/redux/slices/cartSlice";
import * as api from "@/api/apiRoutes";
import { toast } from "react-toastify";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import SingleSellerConfirmationModal from "../single-seller-confirmation-modal/SingleSellerConfirmationModal";
import { isRtl } from "@/lib/utils";
import { GoEye } from "react-icons/go";

const VerticleProductCard = ({ product, largeImage = false }) => {
  const isLtr = isRtl();
  const dispatch = useDispatch();

  const cart = useSelector((state) => state.Cart);
  const setting = useSelector((state) => state.Setting.setting);
  const user = useSelector((state) => state.User);
  const favoriteProducts = useSelector(
    (state) => state.Favorite.favouriteProductIds
  );

  const [selectedVariant, setSelectedVariant] = useState([]);
  const [showVariants, setShowVariants] = useState(false);
  const [showProductDetail, setShowProductDetail] = useState(false);
  const [showSingleSellerModal, setSingleSellerModal] = useState(false);

  useEffect(() => {
    const inStockVariant = product?.variants?.find(
      (variant) => variant?.is_unlimited_stock === 0 && variant?.stock > 0
    );
    if (inStockVariant == undefined) {
      setSelectedVariant(product?.variants?.[0]);
    } else {
      setSelectedVariant(inStockVariant);
    }
  }, [product]);

  const calculateDiscount = (discountPrice, actualPrice) => {
    const difference = actualPrice - discountPrice;
    const actualDiscountPrice = difference / actualPrice;
    return actualDiscountPrice * 100;
  };

  const getProductQuantities = (products) => {
    return Object.entries(
      products?.reduce((quantities, product) => {
        const existingQty = quantities[product.product_id] || 0;
        return {
          ...quantities,
          [product.product_id]: existingQty + product.qty,
        };
      }, {})
    ).map(([productId, qty]) => ({
      product_id: parseInt(productId),
      qty,
    }));
  };

  // Cart functionality
  const addToCart = async (productId, productVId, qty) => {
    try {
      const response = await api.addToCart({
        product_id: productId,
        product_variant_id: productVId,
        qty: qty,
      });
      if (response.status === 1) {
        if (
          cart?.cartProducts?.find(
            (product) =>
              product?.product_id == productId &&
              product?.product_variant_id == productVId
          )?.qty == undefined
        ) {
          dispatch(setCart({ data: response }));
          const updatedCartCount = [
            ...cart?.cartProducts,
            { product_id: productId, product_variant_id: productVId, qty: qty },
          ];
          dispatch(setCartProducts({ data: updatedCartCount }));
          dispatch(setCartSubTotal({ data: response?.sub_total }));
        } else {
          const updatedProducts = cart?.cartProducts?.map((product) => {
            if (
              product.product_id == productId &&
              product?.product_variant_id == productVId
            ) {
              return { ...product, qty: qty };
            } else {
              return product;
            }
          });
          dispatch(setCart({ data: response }));
          dispatch(setCartProducts({ data: updatedProducts }));
          dispatch(setCartSubTotal({ data: response?.sub_total }));
        }
      } else if (response?.data?.one_seller_error_code == 1) {
        setSingleSellerModal(true);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const removeFromCart = async (productId, variantId) => {
    try {
      const response = await api.removeFromCart({
        product_id: productId,
        product_variant_id: variantId,
      });
      if (response?.status === 1) {
        const updatedProducts = cart?.cartProducts?.filter(
          (product) =>
            product?.product_id != productId &&
            product?.product_variant_id != variantId
        );
        dispatch(setCartSubTotal({ data: response?.sub_total }));
        dispatch(setCartProducts({ data: updatedProducts }));
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const AddToGuestCart = (
    product,
    productId,
    productVariantId,
    Qty,
    isExisting,
    flag
  ) => {
    const finalPrice =
      selectedVariant?.discounted_price !== 0
        ? selectedVariant?.discounted_price
        : selectedVariant?.price;
    if (isExisting) {
      let updatedProducts;
      if (Qty !== 0) {
        if (flag == "add") {
          dispatch(addGuestCartTotal({ data: finalPrice }));
        } else if (flag == "remove") {
          dispatch(subGuestCartTotal({ data: finalPrice }));
        }
        updatedProducts = cart?.guestCart?.map((product) => {
          if (
            product?.product_id == productId &&
            product?.product_variant_id == productVariantId
          ) {
            return { ...product, qty: Qty };
          } else {
            return product;
          }
        });
      } else {
        if (flag == "add") {
          dispatch(addGuestCartTotal({ data: finalPrice }));
        } else if (flag == "remove") {
          dispatch(subGuestCartTotal({ data: finalPrice }));
        }
        updatedProducts = cart?.guestCart?.filter(
          (product) =>
            product?.product_id != productId &&
            product?.product_variant_id != productVariantId
        );
      }
      dispatch(addtoGuestCart({ data: updatedProducts }));
    } else {
      if (flag == "add") {
        dispatch(addGuestCartTotal({ data: finalPrice }));
      } else if (flag == "remove") {
        dispatch(subGuestCartTotal({ data: finalPrice }));
      }
      const productData = {
        product_id: productId,
        product_variant_id: productVariantId,
        qty: Qty,
        productPrice: finalPrice,
        color_variant: selectedVariant?.color_variant || selectedVariant?.color_name || selectedVariant?.color_code || selectedVariant?.color || '',
      };
      dispatch(addtoGuestCart({ data: [...cart?.guestCart, productData] }));
    }
  };

  const handleValidateAddExistingGuestProduct = (
    productQuantity,
    product,
    quantity
  ) => {
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id
    )?.qty;

    if (Number(product.is_unlimited_stock !== 0)) {
      if (productQty >= Number(product?.total_allowed_quantity)) {
        toast.error(t("max_cart_limit_error"));
      } else {
        AddToGuestCart(
          product,
          product?.id,
          selectedVariant?.id,
          quantity,
          1,
          "add"
        );
      }
    } else {
      if (productQty >= Number(selectedVariant?.stock)) {
        toast.error(t("out_of_stock_message"));
      } else if (productQty >= Number(product?.total_allowed_quantity)) {
        toast.error(t("max_cart_limit_error"));
      } else {
        AddToGuestCart(
          product,
          product?.id,
          selectedVariant?.id,
          quantity,
          1,
          "add"
        );
      }
    }
  };

  const handleAddNewProductGuest = (productQuantity, product) => {
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id
    )?.qty;
    if (
      selectedVariant?.is_unlimited_stock == 0 &&
      selectedVariant?.stock == 0
    ) {
      toast.error(t("out_of_stock_message"));
    } else if (
      Number(productQty || 0) < Number(product.total_allowed_quantity)
    ) {
      AddToGuestCart(product, product?.id, selectedVariant?.id, 1, 0, "add");
    } else {
      toast.error(t("out_of_stock_message"));
    }
  };

  const handleValidateAddNewProduct = (productQuantity, product) => {
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id
    )?.qty;

    if ((productQty || 0) >= Number(product?.total_allowed_quantity)) {
      toast.error(t("out_of_stock_message"));
    } else if (
      selectedVariant?.is_unlimited_stock == 0 &&
      selectedVariant?.stock <= 0
    ) {
      toast.error(t("out_of_stock_message"));
    } else if (cart?.cartProducts?.length >= setting?.max_cart_items_count) {
      toast.error(t("maximum_cart_quantity_reach"));
    } else if (Number(product.is_unlimited_stock)) {
      addToCart(product?.id, selectedVariant.id, 1);
    } else {
      if (selectedVariant?.status) {
        addToCart(product?.id, selectedVariant?.id, 1);
      } else {
        toast.error(t("out_of_stock_message"));
      }
    }
  };

  const handleIntialAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cart?.isGuest) {
      const quantity = getProductQuantities(cart?.cartProducts);
      handleAddNewProductGuest(quantity, product);
    } else {
      const quantity = getProductQuantities(cart?.cartProducts);
      handleValidateAddNewProduct(quantity, product);
    }
  };

  const handleValidateAddExistingProduct = (productQuantity, product) => {
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id
    )?.qty;
    if (Number(product.is_unlimited_stock)) {
      if (productQty < Number(product?.total_allowed_quantity)) {
        addToCart(
          product?.id,
          selectedVariant?.id,
          cart?.cartProducts?.find(
            (prdct) => prdct?.product_variant_id == selectedVariant?.id
          )?.qty + 1
        );
      } else {
        toast.error(t("max_cart_limit_error"));
      }
    } else {
      if (productQty >= Number(selectedVariant.stock)) {
        toast.error(t("out_of_stock_message"));
      } else if (Number(productQty) >= Number(product.total_allowed_quantity)) {
        toast.error(t("max_cart_limit_error"));
      } else {
        addToCart(
          product?.id,
          selectedVariant?.id,
          cart?.cartProducts?.find(
            (prdct) => prdct?.product_variant_id == selectedVariant?.id
          )?.qty + 1
        );
      }
    }
  };

  const handleQuantityIncrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cart?.isGuest) {
      const productQuantity = getProductQuantities(cart?.guestCart);
      handleValidateAddExistingGuestProduct(
        productQuantity,
        product,
        cart?.guestCart?.find(
          (prdct) =>
            prdct?.product_id == product?.id &&
            prdct?.product_variant_id == selectedVariant?.id
        )?.qty + 1
      );
    } else {
      const quantity = getProductQuantities(cart?.cartProducts);
      handleValidateAddExistingProduct(quantity, product);
    }
  };

  const handleQuantityDecrease = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (cart?.isGuest) {
      AddToGuestCart(
        product,
        product?.id,
        selectedVariant?.id,
        cart?.guestCart?.find(
          (prdct) => prdct?.product_variant_id == selectedVariant?.id
        )?.qty - 1,
        1,
        "remove"
      );
    } else {
      if (
        cart?.cartProducts?.find(
          (prdct) => prdct?.product_variant_id == selectedVariant?.id
        ).qty == 1
      ) {
        removeFromCart(product?.id, selectedVariant?.id);
      } else {
        addToCart(
          product?.id,
          selectedVariant?.id,
          cart?.cartProducts?.find(
            (prdct) => prdct?.product_variant_id == selectedVariant?.id
          )?.qty - 1
        );
      }
    }
  };

  const handleShowVariantModal = (e, product) => {
    e.preventDefault();
    e.stopPropagation();
    if (product.variants.length > 1) {
      setShowVariants(true);
    } else {
      return;
    }
  };

  const handleShowDetailModal = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowProductDetail(true);
  };

  const handleProductLikes = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    const isAlreadyLikes = favoriteProducts?.includes(product?.id);
    try {
      if (user?.jwtToken) {
        if (!isAlreadyLikes) {
          const response = await api.addToFavorite({ product_id: product?.id });
          if (response.status == 1) {
            const updatedFavProducts = [...favoriteProducts, product?.id];
            dispatch(setFavoriteProductIds({ data: updatedFavProducts }));
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        } else {
          const response = await api.removeFromFavorite({
            product_id: product?.id,
          });
          if (response.status == 1) {
            const updatedFavProducts = favoriteProducts?.filter(
              (prdctId) => prdctId != product?.id
            );
            dispatch(setFavoriteProductIds({ data: updatedFavProducts }));
            toast.success(response.message);
          } else {
            toast.error(response.message);
          }
        }
      } else {
        toast.error(t("required_login_message_for_wishlist"));
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const productsVariants = product?.variants;

  const isProductAlreadyAdded =
    (cart?.isGuest === false &&
      cart?.cartProducts?.find(
        (prdct) => prdct?.product_variant_id == selectedVariant?.id
      )?.qty > 0) ||
    (cart?.isGuest === true &&
      cart?.guestCart?.find(
        (prdct) => prdct?.product_variant_id === selectedVariant?.id
      )?.qty > 0);

  const addedQuantity =
    cart.isGuest === false
      ? cart?.cartProducts?.find(
        (prdct) => prdct?.product_variant_id == selectedVariant?.id
      )?.qty
      : cart?.guestCart?.find(
        (prdct) => prdct?.product_variant_id == selectedVariant?.id
      )?.qty;

  const isProductAvailabel =
    (product?.variants?.length <= 1 &&
      product?.variants?.[0]?.is_unlimited_stock == 0 &&
      product?.variants?.[0]?.stock == 0) ||
    (selectedVariant?.stock <= 0 && selectedVariant?.is_unlimited_stock == 0) ||
    selectedVariant?.status == 0 ||
    product?.status == 0;

  const catName = product?.category?.name || product?.category_name || "";

  return (
    <div className="w-full">
      <div className="group relative flex flex-col bg-white dark:bg-slate-800 rounded-[20px] border border-slate-200/90 dark:border-slate-700/80 p-3.5 md:p-4 shadow-sm hover:shadow-xl hover:shadow-cyan-900/5 hover:border-[#0BADFB] transition-all duration-300 hover:-translate-y-1.5 h-full justify-between">
        <div>
          {/* Image Canvas with Discount Tag & Floating Quick Action Icons */}
          <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 p-3 flex items-center justify-center mb-3">
            {/* Discount Badge at top-left */}
            {selectedVariant?.discounted_price !== 0 &&
            selectedVariant?.discounted_price !== selectedVariant?.price ? (
              <span className="absolute top-2.5 left-2.5 bg-[#FDD811] text-slate-900 font-black text-[10px] sm:text-[11px] px-2.5 py-0.5 rounded-full shadow-2xs z-10 tracking-tight">
                {calculateDiscount(
                  selectedVariant?.discounted_price,
                  selectedVariant?.price
                ).toFixed(setting?.decimal_point ? setting?.decimal_point : 0)}
                % {t("off") || "OFF"}
              </span>
            ) : null}

            {/* Quick Actions (Wishlist & Quick View) at top-right */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-10">
              <button
                type="button"
                onClick={handleProductLikes}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs flex justify-center items-center text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-105 transition-all cursor-pointer"
                aria-label="Wishlist"
              >
                {favoriteProducts && favoriteProducts?.includes(product?.id) ? (
                  <BiSolidHeart size={16} className="text-rose-500" />
                ) : (
                  <BiHeart size={16} />
                )}
              </button>
              <button
                type="button"
                onClick={handleShowDetailModal}
                className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200/80 dark:border-slate-700 shadow-2xs flex justify-center items-center text-slate-600 dark:text-slate-300 hover:text-[#0BADFB] hover:scale-105 transition-all cursor-pointer"
                aria-label="Quick View"
              >
                <GoEye size={15} />
              </button>
            </div>

            {/* Product Image */}
            <LocalizedLink
              href={`/product/${product?.slug}`}
              className="w-full h-full flex items-center justify-center"
            >
              <ImageWithPlaceholder
                className="rounded-xl object-contain max-h-full max-w-full transition-transform duration-400 group-hover:scale-105"
                alt={product?.translations?.name ?? product?.name}
                src={product?.image_url}
                width={280}
                height={280}
                priority={true}
              />
            </LocalizedLink>
          </div>

          {/* Product Category Muted Subtitle */}
          <div className="flex items-center gap-1.5 text-[11px] font-bold text-slate-400 dark:text-slate-400 mb-1 px-0.5">
            {catName ? (
              <span className="uppercase tracking-wider truncate">
                {catName}
              </span>
            ) : (
              <span className="uppercase tracking-wider opacity-0">.</span>
            )}
          </div>

          {/* Product Title */}
          <LocalizedLink href={`/product/${product?.slug}`} className="block mb-2">
            <h3 className="text-xs sm:text-sm font-black uppercase tracking-wide text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#0BADFB] transition-colors">
              {product?.translations?.name ?? product?.name}
            </h3>
          </LocalizedLink>

          {/* Pricing */}
          <div className="flex items-baseline gap-2 mb-3 px-0.5">
            {selectedVariant?.discounted_price !== 0 &&
            selectedVariant?.discounted_price !== selectedVariant?.price ? (
              <>
                <span className="text-lg font-black text-slate-900 dark:text-white">
                  {setting?.currency}{selectedVariant?.discounted_price}
                </span>
                <span className="text-xs font-semibold text-slate-400 line-through">
                  {setting?.currency}{selectedVariant?.price}
                </span>
              </>
            ) : (
              <span className="text-lg font-black text-slate-900 dark:text-white">
                {setting?.currency}{selectedVariant?.price}
              </span>
            )}
          </div>
        </div>

        {/* Action Controls: Unit Dropdown + Stepper + Full-width Add to Cart Button */}
        {!isProductAvailabel ? (
          <div className="space-y-2.5 pt-1">
            <div className="grid grid-cols-2 gap-2 items-center">
              {/* Compact Measurement Dropdown */}
              <button
                type="button"
                onClick={(e) => handleShowVariantModal(e, product)}
                className="w-full flex items-center justify-between px-2.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/40 text-xs font-bold text-slate-700 dark:text-slate-200 hover:bg-slate-100 transition-colors"
              >
                <span className="truncate">
                  {`${selectedVariant?.measurement || ""} ${selectedVariant?.unit?.translations?.short_code ?? selectedVariant?.unit?.short_code ?? ""}`}
                </span>
                <MdArrowDropDown size={16} className="text-slate-400 shrink-0 ml-0.5" />
              </button>

              {/* Quantity Stepper (- 1 +) */}
              <div className="flex items-center justify-between bg-slate-50 dark:bg-slate-700/40 border border-slate-200 dark:border-slate-700 rounded-full p-0.5">
                <button
                  type="button"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-white dark:bg-slate-800 hover:bg-slate-200/80 text-slate-700 dark:text-slate-200 flex items-center justify-center font-bold text-xs transition-colors shadow-2xs active:scale-95 disabled:opacity-40 cursor-pointer"
                  onClick={handleQuantityDecrease}
                  disabled={!isProductAlreadyAdded}
                >
                  <FaMinus size={8} />
                </button>
                <span className="text-xs font-extrabold text-slate-800 dark:text-white px-1">
                  {addedQuantity || 1}
                </span>
                <button
                  type="button"
                  className="w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white flex items-center justify-center font-bold text-xs transition-colors shadow-2xs active:scale-95 cursor-pointer"
                  onClick={isProductAlreadyAdded ? handleQuantityIncrease : handleIntialAddToCart}
                >
                  <FaPlus size={8} />
                </button>
              </div>
            </div>

            {/* Modern Full-Width Add to Cart Button */}
            <button
              type="button"
              className="w-full py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white text-xs font-extrabold shadow-sm hover:shadow-md transition-all duration-200 flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              onClick={handleIntialAddToCart}
            >
              <FaShoppingBasket size={13} />
              <span>{t("add_to_cart") || "Add to Cart"}</span>
            </button>
          </div>
        ) : (
          <div className="pt-3 text-center">
            <span className="inline-flex items-center justify-center w-full text-rose-600 text-xs font-extrabold bg-rose-50 dark:bg-rose-950/40 py-2 rounded-full border border-rose-200 dark:border-rose-900/60">
              {t("OutOfStock") || "Out of Stock"}
            </span>
          </div>
        )}
      </div>

      <ProductDetailModal
        product={product}
        showDetailModal={showProductDetail}
        setShowDetailModal={setShowProductDetail}
      />
      <VariantsModal
        product={product}
        showVariants={showVariants}
        setShowVariants={setShowVariants}
      />
      <SingleSellerConfirmationModal
        showSingleSellerModal={showSingleSellerModal}
        setSingleSellerModal={setSingleSellerModal}
        product={product}
        selectedVariant={selectedVariant}
      />
    </div>
  );
};

export default VerticleProductCard;
