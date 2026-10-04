import { LocalizedLink } from "@/utils/localizedNav";
import React, { useState, useEffect } from "react";
import { FaRegEye, FaShoppingBasket, FaStar } from "react-icons/fa";
import { t } from "@/utils/translation";
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
import { MdArrowDropDown } from "react-icons/md";
import { BiHeart, BiMinus, BiPlus, BiSolidHeart } from "react-icons/bi";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import SingleSellerConfirmationModal from "../single-seller-confirmation-modal/SingleSellerConfirmationModal";

const HorizontalProductCard = ({ product }) => {
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
      setSelectedVariant(product?.variants[0]);
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

  // cart functionality
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
            // dispatch(addGuestCartTotal({ data: finalPrice }));
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
      // dispatch(addGuestCartTotal({ data: finalPrice }))
      const productData = {
        product_id: productId,
        product_variant_id: productVariantId,
        qty: Qty,
        productPrice: finalPrice,
        color_variant: selectedVariant?.color_variant || product?.color_variant || "",
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
      AddToGuestCart(product, product.id, selectedVariant?.id, 1, 0, "add");
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
    } else if (cart?.cartProducts?.length >= setting?.max_cart_items_count) {
      toast.error(t("maximum_cart_quantity_reach"));
    } else if (Number(product.is_unlimited_stock)) {
      addToCart(product.id, selectedVariant.id, 1);
    } else {
      if (selectedVariant?.status) {
        addToCart(product.id, selectedVariant?.id, 1);
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

  const handleValidateAddExistingProduct = (productQuantity, product) => {
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id
    )?.qty;
    if (Number(product.is_unlimited_stock)) {
      if (productQty < Number(product?.total_allowed_quantity)) {
        addToCart(
          product.id,
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
          product.id,
          selectedVariant?.id,
          cart?.cartProducts?.find(
            (prdct) => prdct?.product_variant_id == selectedVariant?.id
          )?.qty + 1
        );
      }
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
          product.id,
          selectedVariant.id,
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
    if (product?.variants?.length > 1) {
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

  const productsVariants = product.variants;

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

  return (
    <div>
      <LocalizedLink
        href={`/product/${product?.slug}`}
        className="group relative grid grid-cols-12 gap-3 p-3 bg-white dark:bg-slate-800 rounded-2xl border border-slate-300 dark:border-slate-700 hover:border-[#0BADFB] hover:shadow-md transition-all duration-300 hover:-translate-y-0.5 items-center"
      >
        <div className="col-span-5 sm:col-span-5">
          <div className="aspect-square w-full rounded-xl overflow-hidden bg-white dark:bg-slate-900/60 p-2 relative flex items-center justify-center">
            <ImageWithPlaceholder
              className="object-contain aspect-square h-full w-full rounded-lg transition-transform duration-500 ease-out group-hover:scale-105"
              alt={product?.translations?.name ?? product?.name}
              src={product?.image_url}
              width={200}
              height={200}
            />
            {selectedVariant?.discounted_price !== 0 &&
              selectedVariant?.discounted_price !== selectedVariant?.price ? (
              <span className="bg-[#FDD811] text-slate-900 rounded-full text-[10px] font-black left-2 leading-none px-2 py-1 absolute text-center uppercase top-2 shadow-subtle">
                {calculateDiscount(
                  selectedVariant?.discounted_price,
                  selectedVariant?.price
                ).toFixed(setting?.decimal_point ? setting?.decimal_point : 0)}
                % {t("off")}
              </span>
            ) : null}
            <ul className="absolute right-2 top-2 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-10">
              <li
                className="w-7 h-7 rounded-full bg-white/95 hover:bg-white dark:bg-slate-800 shadow-subtle border border-slate-200/80 dark:border-slate-700 flex justify-center items-center text-slate-500 hover:text-rose-500 transition-all cursor-pointer"
                onClick={handleProductLikes}
              >
                <span>
                  {favoriteProducts &&
                    favoriteProducts?.includes(product?.id) ? (
                    <BiSolidHeart size={16} className="text-rose-500" />
                  ) : (
                    <BiHeart size={16} />
                  )}
                </span>
              </li>
              <li
                className="w-7 h-7 rounded-full bg-white/95 hover:bg-white dark:bg-slate-800 shadow-subtle border border-slate-200/80 dark:border-slate-700 flex justify-center items-center text-slate-500 hover:text-[#0BADFB] transition-all cursor-pointer"
                onClick={handleShowDetailModal}
              >
                <FaRegEye size={14} />
              </li>
            </ul>
          </div>
        </div>
        <div className="col-span-7 sm:col-span-7">
          <div className="flex flex-col justify-between h-full space-y-2">
            <div>
              <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wide text-slate-900 dark:text-white line-clamp-1 group-hover:text-[#0BADFB] transition-colors">
                {product?.translations?.name ?? product?.name}
              </h3>
              {product?.average_rating > 0 &&
                product?.product_rating == true ? (
                <div className="flex items-center gap-1 my-1">
                  <FaStar size={11} className="fill-amber-400 text-amber-400" />
                  <span className="text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {Number(product?.average_rating).toFixed(1)}
                  </span>
                </div>
              ) : null}
              <div className="flex items-baseline gap-1.5 mt-0.5">
                {selectedVariant?.discounted_price !== 0 &&
                  selectedVariant?.discounted_price !== selectedVariant?.price ? (
                  <>
                    <span className="text-sm font-black text-slate-900 dark:text-white">
                      {setting?.currency}
                      {product?.variants?.[0]?.discounted_price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {setting?.currency}
                      {selectedVariant?.price}
                    </span>
                  </>
                ) : (
                  <span className="text-sm font-black text-slate-900 dark:text-white">
                    {setting?.currency}
                    {selectedVariant?.price}
                  </span>
                )}
              </div>
            </div>

            {!isProductAvailabel ? (
              <div className="flex gap-1.5 w-full flex-col">
                <button
                  type="button"
                  className="w-full flex items-center justify-between rounded-full px-2.5 py-1 bg-slate-50 dark:bg-slate-700/50 border border-slate-200/90 dark:border-slate-700 text-xs font-semibold text-slate-700 dark:text-slate-200 truncate"
                  onClick={(e) => handleShowVariantModal(e, product)}
                >
                  <span className="truncate">
                    {`${selectedVariant?.measurement || ""} ${selectedVariant?.unit?.translations?.short_code ?? selectedVariant?.unit?.short_code ?? ""}`}
                  </span>
                  {productsVariants?.length > 1 && (
                    <MdArrowDropDown size={16} className="text-slate-400 flex-shrink-0" />
                  )}
                </button>
                {isProductAlreadyAdded ? (
                  <div className="flex items-center justify-between w-full bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700 rounded-full p-0.5 shadow-2xs">
                    <button
                      type="button"
                      className="w-7 h-7 bg-white dark:bg-slate-800 hover:bg-[#e0f7fe] text-slate-700 dark:text-slate-200 hover:text-[#0BADFB] rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-2xs"
                      onClick={handleQuantityDecrease}
                    >
                      <BiMinus size={11} />
                    </button>
                    <span className="text-xs font-bold text-slate-800 dark:text-white text-center w-full">
                      {addedQuantity}
                    </span>
                    <button
                      type="button"
                      className="w-7 h-7 bg-[#0BADFB] hover:bg-[#0298e0] text-white rounded-full flex items-center justify-center font-bold text-xs transition-colors shadow-2xs"
                      onClick={handleQuantityIncrease}
                    >
                      <BiPlus size={11} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-1.5 px-2 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white shadow-xs transition-all duration-200 cursor-pointer"
                    onClick={handleIntialAddToCart}
                  >
                    <FaShoppingBasket size={13} />
                    <span>{t("add")}</span>
                  </button>
                )}
              </div>
            ) : (
              <div className="inline-flex items-center text-rose-600 text-xs font-bold bg-rose-50 dark:bg-rose-950/40 px-2 py-0.5 rounded-full">
                {t("OutOfStock")}
              </div>
            )}
          </div>
        </div>
      </LocalizedLink>
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

export default HorizontalProductCard;
