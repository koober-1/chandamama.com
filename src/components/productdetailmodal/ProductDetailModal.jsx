import { useEffect, useState } from "react";
import * as api from "@/api/apiRoutes";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import {FaShoppingBasket, FaStar, FaLink } from "react-icons/fa";
import Image from "next/image";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { useSelector, useDispatch } from "react-redux";
import { t } from "@/utils/translation";
import { FiMinus, FiPlus } from "react-icons/fi";
import VegIcon from "@/assets/VegIcon.svg";
import NonVegIcon from "@/assets/NonVegIcon.svg";
import NonCancelable from "@/assets/NotCancelable.svg";
import Cancelable from "@/assets/Cancelable.svg";
import Returnable from "@/assets/Returnable.svg";
import NotReturnable from "@/assets/NotReturnable.svg";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  TwitterShareButton,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";
import { RiCloseFill } from "react-icons/ri";
import {
  addtoGuestCart,
  setCart,
  setCartProducts,
  setCartSubTotal,
  setGuestCartTotal,
} from "@/redux/slices/cartSlice";
import { toast } from "react-toastify";
import { BiHeart, BiSolidHeart } from "react-icons/bi";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import Loader from "../loader/Loader";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import SingleSellerConfirmationModal from "../single-seller-confirmation-modal/SingleSellerConfirmationModal";
import { isRtl, getVariantColorData } from "@/lib/utils";

const ProductDetailModal = ({
  product,
  showDetailModal,
  setShowDetailModal,
}) => {
  const rtl = isRtl();
  const dispatch = useDispatch();
  const setting = useSelector((state) => state.Setting);
  const city = useSelector((state) => state.City.city);
  const cart = useSelector((state) => state.Cart);
  const user = useSelector((state) => state.User);
  const favoriteProducts = useSelector(
    (state) => state.Favorite.favouriteProductIds
  );

  const ratingsCount = 10;
  const currency = setting?.setting?.currency;
  const [productDetails, setProductDetails] = useState([]);
  const [selectVariant, setSelectedVariant] = useState(product?.variants?.[0]);
  const [ratingData, setRatingData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSingleSellerModal, setSingleSellerModal] = useState(false);
  const [isVariantAvailable, setIsVariantAvailable] = useState(false);

  const selectedVariantColor = getVariantColorData(selectVariant);

  const calculateDiscount = (discountPrice, actualPrice) => {
    const difference = actualPrice - discountPrice;
    const actualDiscountPrice = difference / actualPrice;
    return actualDiscountPrice * 100;
  };

  useEffect(() => {
    if (showDetailModal) {
      fetchProductById();
      fetchRatings();
    }
  }, [showDetailModal, product?.id, product?.slug]);

  useEffect(() => {
    handleIsVariantAvailable();
  }, [selectVariant]);

  const fetchProductById = async () => {
    setLoading(true);
    try {
      const res = await api.getProductById({
        latitude: city.latitude,
        longitude: city.longitude,
        id:product?.id,
        slug: product.slug,
      });
      setLoading(false);
      setProductImages([res?.data?.image_url, ...res?.data?.images]);
      setSelectedImage(res?.data?.image_url);
      setProductDetails(res.data);
      if (res?.data?.variants?.length > 0) {
        setSelectedVariant(res.data.variants[0]);
      }
    } catch (error) {
      setLoading(true);
      console.log("error", error);
    }
  };

  const handleIsVariantAvailable = () => {
    if (product?.is_unlimited_stock == 0 && selectVariant?.stock <= 0) {
      setIsVariantAvailable(false);
    } else {
      setIsVariantAvailable(true);
    }
  };

  const handleChangeVariant = (variant) => {
    setSelectedVariant(variant);
  };

  const fetchRatings = async () => {
    try {
      const result = await api.getProductRatings({
        id: product?.id,
        limit: ratingsCount,
        offset: 0,
      });
      setRatingData(result?.data);
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleHideDetailModal = () => {
    setShowDetailModal(false);
  };

  const handleDecreaseQuantity = () => {
    if (quantity <= 1) {
      return;
    } else {
      setQuantity(quantity - 1);
    }
  };
  const handleIncreseQuantity = () => {
    if (
      Number(product?.is_unlimited_stock) == 0 &&
      quantity >= selectVariant?.stock
    ) {
      toast.error(t("out_of_stock"));
    } else if (quantity >= product?.total_allowed_quantity) {
      toast.error(t("max_cart_limit_error"));
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleAddToCart = async () => {
    let productQuantity = cart?.isGuest
      ? getProductQuantities(cart?.guestCart)
      : getProductQuantities(cart?.cartProducts);
    const isExisting = cart.guestCart.find(
      (cartProduct) =>
        cartProduct?.product_id == product?.id &&
        cartProduct?.product_variant_id == selectVariant?.id
    );
    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id
    )?.qty;
    const cartProductQty = cart.cartProducts.find(
      (prdct) =>
        prdct?.product_id == product?.id &&
        selectVariant?.id == prdct?.product_variant_id
    );
    const totalQty = productQty ? productQty + quantity : quantity;
    if (Number(product?.is_unlimited_stock) == 0 && selectVariant?.stock <= 0) {
      toast.error(t("out_of_stock_message"));
      return;
    }
    if (cart?.isGuest) {
      if (productQty + quantity > product?.total_allowed_quantity) {
        toast.error(t("max_cart_limit_error"));
      } else {
        if (isExisting) {
          const updatedProduct = cart.guestCart?.map((cartProduct) => {
            if (
              cartProduct?.product_id == product?.id &&
              cartProduct?.product_variant_id == selectVariant?.id
            ) {
              return { ...cartProduct, qty: cartProduct.qty + quantity };
            } else {
              return cartProduct;
            }
          });
          dispatch(addtoGuestCart({ data: updatedProduct }));
          handleCalculateTotal(updatedProduct);
          setQuantity(1);
          toast.success(t("product_added_successfully"));
        } else {
          const productPrice =
            selectVariant.discounted_price !== 0
              ? selectVariant.discounted_price
              : selectVariant.price;
          const productData = {
            product_id:product?.id,
            product_variant_id: selectVariant?.id,
            qty: quantity,
            productPrice: productPrice,
          };
          dispatch(addtoGuestCart({ data: [...cart?.guestCart, productData] }));
          let products = [...cart.guestCart, productData];
          handleCalculateTotal(products);
          setQuantity(1);
          toast.success(t("product_added_successfully"));
        }
      }
    } else {
      try {
        const isInclude = productQuantity.some(
          (item) => item.product_id === product?.id
        );
        if (productQty + quantity > product?.total_allowed_quantity) {
          toast.error(t("max_cart_limit_error"));
        } else if (
          cart?.cartProducts?.length >= setting?.setting?.max_cart_items_count
        ) {
          toast.error(t("maximum_cart_quantity_reach"));
        } else if (
          !isInclude &&
          cart?.cartProducts?.length >= setting?.setting?.max_cart_items_count
        ) {
          toast.error(t("maximum_cart_quantity_reach"));
        } else {
          const response = await api.addToCart({
            product_id:product?.id,
            product_variant_id: selectVariant.id,
            qty: cartProductQty ? cartProductQty.qty + quantity : quantity,
          });
          if (response.status == 1) {
            if (cartProductQty) {
              const updatedProducts = cart.cartProducts.map((cartProduct) => {
                if (
                  cartProduct.product_id ==product?.id &&
                  cartProduct.product_variant_id == selectVariant.id
                ) {
                  return {
                    ...cartProduct,
                    qty: cartProductQty
                      ? cartProductQty.qty + quantity
                      : quantity,
                  };
                } else {
                  return cartProduct;
                }
              });
              dispatch(setCartProducts({ data: updatedProducts }));
            } else {
              const productData = [
                ...cart.cartProducts,
                {
                  product_id:product?.id,
                  product_variant_id: selectVariant?.id,
                  qty: quantity,
                },
              ];
              dispatch(setCartProducts({ data: productData }));
            }
            dispatch(setCart({ data: response }));
            dispatch(setCartSubTotal({ data: response.sub_total }));
            toast.success(t("product_added_successfully"));
          } else if (response?.data?.one_seller_error_code == 1) {
            setSingleSellerModal(true);
          } else {
            toast.error(response.message);
          }
        }
      } catch (error) {
        console.log("Error", error);
      }
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
      }, {})
    ).map(([productId, qty]) => ({
      product_id: parseInt(productId),
      qty,
    }));
  };
  const handleCalculateTotal = (products) => {
    const total = products.reduce((prev, curr) => {
      prev += curr.productPrice * curr.qty;
      return prev;
    }, 0);
    dispatch(setGuestCartTotal({ data: total }));
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
  const handleChangeCoverImage = (image) => {
    setSelectedImage(image);
  };
  const handleCopyToClipboard = () => {
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}/product/${product?.slug}`
    );
    toast.success(t("link_copied_to_clipboard"));
  };

  return (
    <>
      <Dialog open={showDetailModal}>
        <DialogContent className="max-w-xl lg:max-w-4xl p-6 md:p-8 rounded-3xl bg-white border border-slate-100 shadow-2xl overflow-y-auto max-h-[90vh]">
          <button
            type="button"
            aria-label="Close modal"
            className="absolute top-5 right-5 z-20 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
            onClick={handleHideDetailModal}
          >
            <RiCloseFill size={20} />
          </button>
          <div className=" ">
            {loading ? (
              <Loader />
            ) : (
              <div className="flex flex-col">
                {/* Header info */}
                <div className="pb-4 border-b border-slate-100 space-y-2 pr-10">
                  <div className="flex flex-wrap items-center gap-2">
                    {productDetails?.seller_name && (
                      <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-semibold">
                        <span className="text-slate-400 font-normal">{t("seller") || "Seller"}:</span>
                        <span>{product?.seller?.translations?.name || productDetails?.seller_name}</span>
                      </span>
                    )}
                    {ratingData?.average_rating > 0 && product?.product_rating == true && (
                      <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-amber-50 border border-amber-200/60 text-xs font-bold text-amber-900">
                        <FaStar size={12} className="fill-amber-400 text-amber-400" />
                        <span>{ratingData?.average_rating?.toFixed(1)}</span>
                        <span className="text-amber-700 font-normal">({ratingData?.rating_list?.length || 0})</span>
                      </div>
                    )}
                    {productDetails?.fssai_lic_no && (
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-50 border border-slate-200/80 text-[11px] text-slate-600 font-medium">
                        {productDetails?.fssai_lic_img && (
                          <Image
                            width={20}
                            height={20}
                            src={productDetails?.fssai_lic_img}
                            className="w-4 h-4 object-contain"
                            alt="FSSAI"
                          />
                        )}
                        <span>FSSAI: {productDetails?.fssai_lic_no}</span>
                      </div>
                    )}
                  </div>

                  <h2 className="font-extrabold text-xl md:text-2xl text-slate-900 tracking-tight leading-tight">
                    {productDetails?.translations?.name}
                  </h2>
                  {selectVariant?.few_quantity_left && (
                    <span className="inline-block text-xs font-bold text-rose-600 bg-rose-50 border border-rose-100 px-3 py-0.5 rounded-full">
                      {t("few_quantity_left") || "Hurry, limited stock remaining!"}
                    </span>
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-12 mt-6 gap-6 items-start">
                  {/* Left Column: Media & Gallery */}
                  <div className="md:col-span-5 col-span-12 flex flex-col gap-3">
                    <div className="relative aspect-square h-auto w-full bg-slate-50 rounded-2xl border border-slate-100 overflow-hidden shadow-sm flex items-center justify-center p-3">
                      <ImageWithPlaceholder
                        src={selectedImage}
                        alt={productDetails.name}
                        className="h-full w-full aspect-square object-contain transition-transform duration-300 hover:scale-105"
                        width={424}
                        height={424}
                        quality={85}
                      />
                      {selectVariant?.discounted_price !== 0 &&
                        selectVariant?.discounted_price !==
                        selectVariant?.price ? (
                        <span className="bg-rose-500 rounded-full text-white text-xs font-bold leading-none px-3 py-1.5 absolute top-3 left-3 shadow-md tracking-wider uppercase">
                          {calculateDiscount(
                            selectVariant?.discounted_price,
                            selectVariant?.price
                          ).toFixed(
                            setting?.decimal_point ? setting?.decimal_point : 0
                          )}
                          % {t("off")}
                        </span>
                      ) : null}
                    </div>

                    {productImages?.length > 1 && (
                      <div className="mt-1">
                        <Swiper
                          key={rtl}
                          spaceBetween={10}
                          modules={[Navigation]}
                          className="brand-swiper"
                          breakpoints={{
                            1200: { slidesPerView: 3.5 },
                            1024: { slidesPerView: 3 },
                            768: { slidesPerView: 3 },
                            375: { slidesPerView: 3 },
                            0: { slidesPerView: 2.5 },
                          }}
                        >
                          {productImages?.map((image, index) => (
                            <SwiperSlide key={index}>
                              <button
                                type="button"
                                className={`w-full aspect-square relative rounded-xl border p-1 bg-white transition-all overflow-hidden cursor-pointer ${
                                  selectedImage === image
                                    ? "border-[#0BADFB] ring-2 ring-[#0BADFB]/20 shadow-sm"
                                    : "border-slate-200 hover:border-slate-300"
                                }`}
                                onClick={() => handleChangeCoverImage(image)}
                              >
                                <ImageWithPlaceholder
                                  src={image}
                                  alt={productDetails.name}
                                  height={120}
                                  width={120}
                                  className="h-full w-full aspect-square object-contain rounded-lg"
                                />
                              </button>
                            </SwiperSlide>
                          ))}
                        </Swiper>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Pricing, Variants, Actions */}
                  <div className="col-span-12 md:col-span-7 flex flex-col gap-5">
                    {/* Price Header */}
                    <div className="flex items-baseline gap-3 flex-wrap">
                      {selectVariant?.discounted_price !== 0 &&
                      selectVariant?.discounted_price !== selectVariant?.price ? (
                        <>
                          <h2 className="font-black text-3xl text-[#0BADFB] tracking-tight">
                            {currency}
                            {selectVariant?.discounted_price}
                          </h2>
                          <h3 className="line-through font-semibold text-lg text-slate-400">
                            {currency}
                            {selectVariant?.price}
                          </h3>
                          <span className="text-xs font-bold text-[#0B4F94] bg-[#0BADFB]/10 border border-[#0BADFB]/30 px-2.5 py-1 rounded-full">
                            {calculateDiscount(
                              selectVariant?.discounted_price,
                              selectVariant?.price
                            ).toFixed(0)}
                            % {t("off")}
                          </span>
                        </>
                      ) : (
                        <h2 className="font-extrabold text-3xl text-slate-900 tracking-tight">
                          {currency}
                          {selectVariant?.price}
                        </h2>
                      )}
                    </div>

                    {/* Variant Selector */}
                    {productDetails?.variants?.length > 0 && (
                      <div className="flex flex-col gap-2.5">
                        <div className="flex items-center justify-between gap-2">
                          <label className="text-xs font-bold uppercase tracking-wider text-slate-500">
                            {t("chooseVariant") || "Select Option"}
                          </label>
                          {selectedVariantColor?.name && (
                            <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200/80 shadow-2xs">
                              <span className="text-slate-400 font-normal">Colour:</span>
                              {selectedVariantColor.hex && (
                                <span
                                  className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs shrink-0 inline-block"
                                  style={{ backgroundColor: selectedVariantColor.hex }}
                                />
                              )}
                              <span>{selectedVariantColor.name}</span>
                            </div>
                          )}
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                          {productDetails?.variants?.map((variant) => {
                            const discountPrice = variant?.discounted_price;
                            const price = variant?.price;
                            const isSelected = selectVariant?.id === variant?.id;
                            const colorData = getVariantColorData(variant);
                            return (
                              <button
                                key={variant.id}
                                type="button"
                                onClick={() => handleChangeVariant(variant)}
                                className={`flex flex-col items-center justify-center p-3 rounded-2xl border text-center transition-all ${
                                  isSelected
                                    ? "border-[#0BADFB] bg-sky-50 text-[#0B4F94] ring-2 ring-[#0BADFB]/25 shadow-sm"
                                    : "border-slate-200 hover:border-slate-300 bg-white text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                <div className="flex items-center gap-1.5 justify-center">
                                  {colorData?.hex && (
                                    <span
                                      className="w-3 h-3 rounded-full border border-slate-300 shadow-xs shrink-0 inline-block"
                                      style={{ backgroundColor: colorData.hex }}
                                    />
                                  )}
                                  <p className="font-bold text-xs">
                                    {`${variant?.measurement} ${variant?.unit?.translations?.short_code || ""}`}
                                  </p>
                                </div>
                                {colorData?.name && (
                                  <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mt-0.5">
                                    {colorData.name}
                                  </span>
                                )}
                                <span className="flex items-center gap-1.5 text-xs mt-1">
                                  <span className="font-semibold text-slate-900">
                                    {currency}
                                    {discountPrice != 0 && discountPrice !== price
                                      ? discountPrice
                                      : price}
                                  </span>
                                  {discountPrice != 0 && discountPrice !== price && (
                                    <span className="line-through text-slate-400 text-[11px]">
                                      {currency}
                                      {price}
                                    </span>
                                  )}
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    )}

                    {/* Quantity Stepper & Add to Cart */}
                    <div className="flex flex-wrap items-center gap-3 pt-2">
                      {isVariantAvailable ? (
                        <>
                          <div className="inline-flex items-center border border-slate-200 bg-slate-50 rounded-full p-1 shadow-inner">
                            <button
                              type="button"
                              className="w-9 h-9 rounded-full bg-white hover:bg-[#0BADFB] hover:text-white text-slate-700 shadow-sm transition-all flex items-center justify-center disabled:opacity-50"
                              onClick={handleDecreaseQuantity}
                              disabled={quantity <= 1}
                              aria-label="Decrease quantity"
                            >
                              <FiMinus className="text-sm font-bold" />
                            </button>
                            <input
                              type="text"
                              disabled
                              value={quantity}
                              className="text-center font-bold text-sm bg-transparent w-10 text-slate-800"
                            />
                            <button
                              type="button"
                              className="w-9 h-9 rounded-full bg-white hover:bg-[#0BADFB] hover:text-white text-slate-700 shadow-sm transition-all flex items-center justify-center"
                              onClick={handleIncreseQuantity}
                              aria-label="Increase quantity"
                            >
                              <FiPlus className="text-sm font-bold" />
                            </button>
                          </div>

                          <button
                            type="button"
                            className="flex-1 min-w-[170px] h-11 px-6 rounded-full bg-gradient-to-r from-[#0BADFB] via-[#0298e0] to-[#017cc0] hover:from-[#0298e0] hover:to-[#0B4F94] text-white font-extrabold text-sm tracking-wide transition-all shadow-md shadow-[#0BADFB]/30 active:scale-95 flex items-center justify-center gap-2"
                            onClick={handleAddToCart}
                          >
                            <FaShoppingBasket size={18} />
                            <span>{t("add_to_cart")}</span>
                          </button>
                        </>
                      ) : (
                        <div className="h-11 px-6 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-bold text-sm flex items-center justify-center">
                          {t("OutOfStock") || "Out of Stock"}
                        </div>
                      )}

                      {/* Wishlist Icon Button */}
                      <button
                        type="button"
                        className="w-11 h-11 rounded-full border border-slate-200 hover:border-rose-300 hover:bg-rose-50 flex items-center justify-center transition-all cursor-pointer group"
                        onClick={handleProductLikes}
                        aria-label="Wishlist"
                      >
                        {favoriteProducts && favoriteProducts?.includes(product?.id) ? (
                          <BiSolidHeart size={20} className="text-rose-500 scale-110 transition-transform" />
                        ) : (
                          <BiHeart size={20} className="text-slate-400 group-hover:text-rose-500 transition-colors" />
                        )}
                      </button>
                    </div>

                    {/* Guarantees & Info Badges */}
                    <div className="bg-slate-50/80 rounded-2xl border border-slate-100 p-3.5 flex flex-col gap-2.5 text-xs text-slate-600">
                      {productDetails?.indicator ? (
                        <div className="flex items-center gap-2.5">
                          <div className="h-6 w-6 relative flex-shrink-0">
                            <Image
                              src={productDetails?.indicator == 1 ? VegIcon : NonVegIcon}
                              fill
                              alt="indicator"
                              className="object-contain"
                            />
                          </div>
                          <span className="font-semibold text-slate-700">
                            {productDetails?.indicator == 1 ? t("vegetarian") : t("non-vegetarian")}
                          </span>
                        </div>
                      ) : null}

                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 relative flex-shrink-0">
                          <Image
                            fill
                            src={productDetails?.cancelable_status == 1 ? Cancelable : NonCancelable}
                            alt="cancelable"
                            className="object-contain"
                          />
                        </div>
                        <span className="font-medium text-slate-700">
                          {productDetails?.cancelable_status == 1 ? (
                            <>
                              <span className="font-bold">{t("cancelable")}</span>
                              {productDetails?.till_status == 1 && ` • ${t("payment_pending")}`}
                              {productDetails?.till_status == 2 && ` • ${t("received")}`}
                              {productDetails?.till_status == 3 && ` • ${t("processed")}`}
                              {productDetails?.till_status == 4 && ` • ${t("shipped")}`}
                              {productDetails?.till_status == 5 && ` • ${t("out_for_delivery")}`}
                            </>
                          ) : (
                            <span className="font-medium text-slate-500">{t("non-cancelable")}</span>
                          )}
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <div className="h-6 w-6 relative flex-shrink-0">
                          <Image
                            fill
                            src={productDetails?.return_status == 1 ? Returnable : NotReturnable}
                            alt="returnable"
                            className="object-contain"
                          />
                        </div>
                        <span className="font-medium text-slate-700">
                          {productDetails?.return_status == 1 ? (
                            <span>
                              <span className="font-bold">{t("returnable")}</span> ({productDetails?.return_days} {t("days")})
                            </span>
                          ) : (
                            <span className="text-slate-500">{t("non-returnable")}</span>
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Share Bar */}
                    <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                      <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                        {t("shareProduct") || "Share"}:
                      </span>
                      <div className="flex items-center gap-2">
                        <WhatsappShareButton url={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${product?.slug}`}>
                          <WhatsappIcon className="h-7 w-7 rounded-full shadow-xs hover:opacity-85 transition-opacity" />
                        </WhatsappShareButton>
                        <TwitterShareButton url={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${product?.slug}`}>
                          <TwitterIcon className="h-7 w-7 rounded-full shadow-xs hover:opacity-85 transition-opacity" />
                        </TwitterShareButton>
                        <FacebookShareButton url={`${process.env.NEXT_PUBLIC_BASE_URL}/product/${product?.slug}`}>
                          <FacebookIcon className="h-7 w-7 rounded-full shadow-xs hover:opacity-85 transition-opacity" />
                        </FacebookShareButton>
                        <button
                          type="button"
                          onClick={handleCopyToClipboard}
                          className="h-7 w-7 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
                          title="Copy Link"
                          aria-label="Copy link"
                        >
                          <FaLink size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
        <SingleSellerConfirmationModal
          showSingleSellerModal={showSingleSellerModal}
          setSingleSellerModal={setSingleSellerModal}
          product={product}
          selectedVariant={selectVariant}
        />
      </Dialog>
    </>
  );
};

export default ProductDetailModal;
