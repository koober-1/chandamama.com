import React, { useState } from "react";
import { FaMinus, FaPlus, FaShoppingBasket } from "react-icons/fa";
import { BiTrash } from "react-icons/bi";
import * as api from "@/api/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { IoMdArrowDropdown } from "react-icons/io";
import VariantsModal from "../variantsmodal/VariantsModal";
import {
  setCart,
  setCartProducts,
  setCartSubTotal,
} from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import { t } from "@/utils/translation";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import SingleSellerConfirmationModal from "../single-seller-confirmation-modal/SingleSellerConfirmationModal";

const WishlistCard = ({
  product,
  setWishlistProducts,
  wishlistProducts,
  setTotal,
  handleFetchLikedProducts,
}) => {
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.Setting.setting);
  const cart = useSelector((state) => state.Cart);

  const [showVariants, setShowVariants] = useState(false);
  const [showSingleSellerModal, setSingleSellerModal] = useState(false);

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

  const handleRemoveFromWishlist = async (prdctId) => {
    try {
      const response = await api.removeFromFavorite({ product_id: prdctId });
      if (response.status == 1) {
        const updateProducts = wishlistProducts?.filter(
          (prdct) => prdct?.id != prdctId,
        );
        setWishlistProducts(updateProducts);
        setTotal((prevTotal) => prevTotal - 1);
        await handleFetchLikedProducts();
      } else {
        console.log(response.message);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleShowVariatModal = () => {
    if (product?.variants?.length > 0) {
      setShowVariants(true);
    } else {
      return;
    }
  };

  const handleQuantityIncrease = (e) => {
    const quantity = getProductQuantities(cart?.cartProducts);
    handleValidateAddExistingProduct(quantity, product);
  };
  const handleQuantityDecrease = (e) => {
    if (
      cart?.cartProducts?.find(
        (prdct) => prdct?.product_variant_id == product?.variants[0]?.id,
      ).qty == 1
    ) {
      removeFromCart(product?.id, product?.variants[0]?.id);
    } else {
      addToCart(
        product.id,
        product?.variants[0].id,
        cart?.cartProducts?.find(
          (prdct) => prdct?.product_variant_id == product?.variants[0]?.id,
        )?.qty - 1,
      );
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
            product?.product_variant_id != variantId,
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
  const handleValidateAddExistingProduct = (productQuantity, product) => {
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id,
    )?.qty;
    if (Number(product.is_unlimited_stock)) {
      if (productQty < Number(product?.total_allowed_quantity)) {
        addToCart(
          product.id,
          product?.variants[0]?.id,
          cart?.cartProducts?.find(
            (prdct) => prdct?.product_variant_id == product?.variants[0]?.id,
          )?.qty + 1,
        );
      } else {
        toast.error(t("max_cart_limit_error"));
      }
    } else {
      if (productQty >= Number(product?.variants[0].stock)) {
        toast.error(t("out_of_stock_message"));
      } else if (Number(productQty) >= Number(product.total_allowed_quantity)) {
        toast.error(t("max_cart_limit_error"));
      } else {
        addToCart(
          product.id,
          product?.variants[0]?.id,
          cart?.cartProducts?.find(
            (prdct) => prdct?.product_variant_id == product?.variants[0]?.id,
          )?.qty + 1,
        );
      }
    }
  };

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
              product?.product_variant_id == productVId,
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

  const handleValidateAddNewProduct = (productQuantity, product) => {
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id,
    )?.qty;

    if ((productQty || 0) >= Number(product?.total_allowed_quantity)) {
      toast.error(t("out_of_stock_message"));
    } else if (productQty >= Number(product?.total_allowed_quantity)) {
      toast.error(t("max_cart_limit_error"));
    } else if (Number(product.is_unlimited_stock)) {
      addToCart(product.id, product?.variants[0].id, 1);
    } else {
      if (product?.variants[0]?.status) {
        addToCart(product.id, product?.variants[0]?.id, 1);
      } else {
        toast.error(t("out_of_stock_message"));
      }
    }
  };

  const handleIntialAddToCart = (e) => {
    const quantity = getProductQuantities(cart?.cartProducts);
    handleValidateAddNewProduct(quantity, product);
  };

  const isProductAlreadyAdded =
    cart?.isGuest === false &&
    cart?.cartProducts?.find(
      (prdct) => prdct?.product_variant_id == product?.variants[0]?.id,
    )?.qty > 0;
  const addedQuantity = cart?.cartProducts?.find(
    (prdct) => prdct?.product_variant_id == product?.variants[0]?.id,
  )?.qty;

  return (
    <div className="w-full rounded-2xl hover:bg-slate-50/70 p-3 sm:p-4 transition-all duration-200">
      {/* Desktop Layout */}
      <div className="hidden lg:grid grid-cols-12 items-center gap-4">
        {/* Product Image and Details */}
        <div className="col-span-6 flex items-center gap-4">
          <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-2xl border border-slate-100 overflow-hidden bg-white shrink-0 p-1">
            <ImageWithPlaceholder
              src={product?.image_url}
              alt={product?.translations?.name || "Product"}
              className="h-full w-full object-cover rounded-xl"
              height={80}
              width={80}
            />
          </div>
          <div className="flex flex-col min-w-0">
            <h4 className="font-bold text-base text-slate-900 truncate">
              {product?.translations?.name}
            </h4>
            <div className="mt-1">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                onClick={handleShowVariatModal}
              >
                <span>
                  {product?.variants[0]?.measurement} {product?.variants[0]?.unit?.translations?.name}
                </span>
                {product?.variants?.length > 1 && <IoMdArrowDropdown size={14} />}
              </span>
            </div>
          </div>
        </div>

        {/* Quantity Selector */}
        <div className="col-span-3 flex items-center justify-center">
          {isProductAlreadyAdded ? (
            <div className="flex items-center rounded-full border border-slate-200 bg-white shadow-2xs h-8 px-1">
              <button
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors"
                onClick={handleQuantityDecrease}
                aria-label="Decrease quantity"
              >
                <FaMinus size={10} />
              </button>
              <input
                value={addedQuantity}
                disabled
                className="w-8 text-center text-xs font-bold text-slate-800 bg-transparent select-none"
                min="1"
                max={product?.variants[0]?.stock}
              />
              <button
                className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors"
                onClick={handleQuantityIncrease}
                aria-label="Increase quantity"
              >
                <FaPlus size={10} />
              </button>
            </div>
          ) : (
            <button
              className="inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all hover:scale-[1.02]"
              onClick={handleIntialAddToCart}
            >
              <FaShoppingBasket size={14} />
              <span>{t("add")}</span>
            </button>
          )}
        </div>

        {/* Product Price */}
        <div className="col-span-2 text-center">
          {product?.variants[0]?.discounted_price !== 0 ? (
            <div className="flex flex-col items-center">
              <span className="text-base font-bold text-slate-900">
                {setting?.currency}
                {product?.variants[0]?.discounted_price}
              </span>
              <span className="text-xs text-slate-400 line-through">
                {setting?.currency}
                {product?.variants[0]?.price}
              </span>
            </div>
          ) : (
            <span className="text-base font-bold text-slate-900">
              {setting?.currency}
              {product?.variants[0]?.price}
            </span>
          )}
        </div>

        {/* Remove Button */}
        <div className="col-span-1 flex justify-end">
          <button
            className="w-9 h-9 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
            onClick={() => handleRemoveFromWishlist(product?.id)}
            title="Remove from wishlist"
          >
            <BiTrash size={18} />
          </button>
        </div>
      </div>

      {/* Mobile Layout */}
      <div className="flex flex-col lg:hidden gap-3">
        <div className="flex items-center gap-3">
          <div className="w-16 h-16 rounded-xl border border-slate-100 overflow-hidden bg-white shrink-0 p-1">
            <ImageWithPlaceholder
              src={product?.image_url}
              alt={product?.name || "Product"}
              className="h-full w-full object-cover rounded-lg"
              height={64}
              width={64}
            />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="font-bold text-sm text-slate-900 truncate">
              {product?.name}
            </h4>
            <div className="mt-1">
              <span
                className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 cursor-pointer"
                onClick={handleShowVariatModal}
              >
                <span>
                  {product?.variants[0]?.measurement} {product?.variants[0]?.stock_unit_name}
                </span>
                {product?.variants?.length > 1 && <IoMdArrowDropdown size={14} />}
              </span>
            </div>
          </div>
          <div className="text-right shrink-0">
            {product?.variants[0]?.discounted_price !== 0 ? (
              <div className="flex flex-col items-end">
                <span className="text-sm font-bold text-slate-900">
                  {setting?.currency}
                  {product?.variants[0]?.discounted_price}
                </span>
                <span className="text-xs text-slate-400 line-through">
                  {setting?.currency}
                  {product?.variants[0]?.price}
                </span>
              </div>
            ) : (
              <span className="text-sm font-bold text-slate-900">
                {setting?.currency}
                {product?.variants[0]?.price}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          {/* Quantity Selector */}
          <div>
            {isProductAlreadyAdded ? (
              <div className="flex items-center rounded-full border border-slate-200 bg-white shadow-2xs h-8 px-1">
                <button
                  className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors"
                  onClick={handleQuantityDecrease}
                >
                  <FaMinus size={10} />
                </button>
                <input
                  value={addedQuantity}
                  disabled
                  className="w-8 text-center text-xs font-bold text-slate-800 bg-transparent"
                  min="1"
                  max={product?.variants[0]?.stock}
                />
                <button
                  className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-700 flex items-center justify-center transition-colors"
                  onClick={handleQuantityIncrease}
                >
                  <FaPlus size={10} />
                </button>
              </div>
            ) : (
              <button
                className="inline-flex items-center justify-center gap-1.5 px-4 py-1.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all"
                onClick={handleIntialAddToCart}
              >
                <FaShoppingBasket size={13} />
                <span>{t("add")}</span>
              </button>
            )}
          </div>

          {/* Remove Button */}
          <button
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-rose-50 text-slate-400 hover:text-rose-600 flex items-center justify-center transition-colors"
            onClick={() => handleRemoveFromWishlist(product?.id)}
          >
            <BiTrash size={16} />
          </button>
        </div>
      </div>

      {/* Variants Modal */}
      <VariantsModal
        product={product}
        showVariants={showVariants}
        setShowVariants={setShowVariants}
      />
      <SingleSellerConfirmationModal
        showSingleSellerModal={showSingleSellerModal}
        setSingleSellerModal={setSingleSellerModal}
        product={product}
        selectedVariant={product?.variants[0]}
      />
    </div>
  );
};

export default WishlistCard;
