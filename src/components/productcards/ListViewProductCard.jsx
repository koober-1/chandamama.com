import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import {
  FaMinus,
  FaPlus,
  FaRegEye,
  FaShoppingBasket,
  FaStar,
} from "react-icons/fa";
import { LocalizedLink } from "@/utils/localizedNav";
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
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import SingleSellerConfirmationModal from "../single-seller-confirmation-modal/SingleSellerConfirmationModal";

const ListViewProductCard = ({ product }) => {
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
        className="group relative flex flex-col md:flex-row w-full justify-between items-center bg-white rounded-2xl border border-slate-100 shadow-subtle hover:border-slate-300 hover:shadow-card-hover transition-all duration-300 p-3 md:p-4 gap-4"
      >
        <div className="flex items-center gap-4 w-full md:w-auto flex-1">
          <div className="flex-shrink-0 w-28 h-28 md:w-36 md:h-36 rounded-xl overflow-hidden bg-slate-50/70 p-2 relative flex items-center justify-center">
            <div className="relative aspect-square w-full h-full">
              <ImageWithPlaceholder
                src={product?.image_url}
                alt={product?.translations?.name ?? product?.name}
                width={400}
                height={400}
                className="w-full h-full aspect-square rounded-lg object-contain transition-transform duration-500 ease-out group-hover:scale-105"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 400px"
                quality={75}
              />
              {selectedVariant?.discounted_price !== 0 &&
                selectedVariant?.discounted_price !== selectedVariant?.price ? (
                <span className="bg-[#FDD811] text-slate-900 rounded-full text-[11px] font-extrabold left-1 leading-none px-2 py-1 absolute text-center uppercase top-1 shadow-subtle">
                  {calculateDiscount(
                    selectedVariant?.discounted_price,
                    selectedVariant?.price
                  ).toFixed(setting?.decimal_point ? setting?.decimal_point : 0)}
                  % {t("off")}
                </span>
              ) : null}
              <ul className="absolute right-1 top-1 flex flex-col gap-1.5 opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 z-10">
                <li
                  className="w-7 h-7 rounded-full bg-white/90 hover:bg-white backdrop-blur-md shadow-subtle border border-slate-200/80 flex justify-center items-center text-slate-500 hover:text-rose-500 transition-all cursor-pointer"
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
                <li className="w-7 h-7 rounded-full bg-white/90 hover:bg-white backdrop-blur-md shadow-subtle border border-slate-200/80 flex justify-center items-center text-slate-500 hover:text-[#0BADFB] transition-all cursor-pointer">
                  <span onClick={handleShowDetailModal}>
                    <FaRegEye size={14} />
                  </span>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col justify-center flex-1 space-y-2">
            <div>
              <h3 className="text-base font-semibold text-slate-800 line-clamp-2 group-hover:text-[#0BADFB] transition-colors">
                {product?.translations?.name ?? product?.name}
              </h3>
              {product?.average_rating > 0 && product?.product_rating == true ? (
                <div className="flex items-center gap-1.5 my-1.5">
                  <FaStar size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-xs font-bold text-slate-700">
                    {Number(product?.average_rating).toFixed(1)}
                  </span>
                </div>
              ) : null}
              <div className="flex items-baseline gap-2 mt-1">
                {selectedVariant?.discounted_price !== 0 &&
                  selectedVariant?.discounted_price !== selectedVariant?.price ? (
                  <>
                    <span className="text-base font-bold text-slate-900">
                      {setting?.currency}{selectedVariant?.discounted_price}
                    </span>
                    <span className="text-xs text-slate-400 line-through">
                      {setting?.currency}{selectedVariant?.price}
                    </span>
                  </>
                ) : (
                  <span className="text-base font-bold text-slate-900">
                    {setting?.currency}{selectedVariant?.price}
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Right Action Area */}
        <div className="flex-shrink-0 w-full md:w-48 flex items-center justify-center p-2 md:border-l md:border-slate-100">
          {!isProductAvailabel ? (
            <div className="flex gap-2.5 w-full flex-col items-center">
              <button
                type="button"
                className="w-full flex items-center justify-between rounded-xl px-3 py-1.5 bg-slate-50 border border-slate-200 text-xs font-semibold text-slate-700 truncate"
                onClick={(e) => handleShowVariantModal(e, product)}
              >
                <span className="truncate">
                  {`${selectedVariant?.measurement || ""} ${selectedVariant?.unit?.translations?.short_code ?? selectedVariant?.unit?.short_code ?? ""}`}
                </span>
                {productsVariants?.length > 1 && (
                  <MdArrowDropDown size={16} className="text-slate-400 flex-shrink-0" />
                )}
              </button>
              <div className="w-full">
                {isProductAlreadyAdded ? (
                  <div className="w-full flex items-center justify-between bg-slate-50 border border-slate-200 rounded-xl p-0.5 shadow-subtle">
                    <button
                      type="button"
                      className="w-8 h-8 bg-white hover:bg-[#e0f7fe] text-slate-700 hover:text-[#0BADFB] rounded-lg flex items-center justify-center font-bold text-xs transition-colors shadow-subtle cursor-pointer"
                      onClick={handleQuantityDecrease}
                    >
                      <FaMinus size={11} />
                    </button>
                    <span className="text-xs font-bold text-slate-800 text-center w-full">
                      {addedQuantity}
                    </span>
                    <button
                      type="button"
                      className="w-8 h-8 bg-[#0BADFB] hover:bg-[#0298e0] text-white rounded-lg flex items-center justify-center font-bold text-xs transition-colors shadow-subtle cursor-pointer"
                      onClick={handleQuantityIncrease}
                    >
                      <FaPlus size={11} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={handleIntialAddToCart}
                    className="w-full flex items-center justify-center gap-1.5 text-xs font-bold py-2 px-3 rounded-xl bg-[#0BADFB] hover:bg-[#0298e0] text-white shadow-subtle transition-all duration-200 cursor-pointer"
                  >
                    <FaShoppingBasket size={14} />
                    <span>{t("add")}</span>
                  </button>
                )}
              </div>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center text-center py-2 text-rose-600 font-bold text-xs bg-rose-50 rounded-xl">
              {t("OutOfStock")}
            </div>
          )}
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

export default ListViewProductCard;
