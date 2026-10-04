"use client";
import React, { useEffect, useRef, useState, useMemo } from "react";
import { useLocalizedRouter } from "@/utils/localizedNav";
import * as api from "@/api/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import {
  FaLink,
  FaShoppingBasket,
  FaStar,
  FaBolt,
  FaShieldAlt,
  FaTruck,
  FaUndo,
  FaLock,
  FaCheckCircle,
} from "react-icons/fa";
import { FiMinus, FiPlus } from "react-icons/fi";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from "@/utils/translation";
import VegIcon from "@/assets/VegIcon.svg";
import NonVegIcon from "@/assets/NonVegIcon.svg";
import NonCancelable from "@/assets/NotCancelable.svg";
import Cancelable from "@/assets/Cancelable.svg";
import Returnable from "@/assets/Returnable.svg";
import ProductNotFoundImage from "@/assets/not_found_images/No_product_found.svg";
import NotReturnable from "@/assets/NotReturnable.svg";
import {
  WhatsappShareButton,
  WhatsappIcon,
  TwitterIcon,
  TwitterShareButton,
  FacebookIcon,
  FacebookShareButton,
} from "react-share";
import ProductDescription from "./ProductDescription";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import { toast } from "react-toastify";
import {
  addtoGuestCart,
  setCart,
  setCartProducts,
  setCartSubTotal,
  setGuestCartTotal,
} from "@/redux/slices/cartSlice";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import { BiHeart, BiSolidHeart, BiShareAlt } from "react-icons/bi";
import SimilarProducts from "../productslist/SimilarProducts";
import SameCategoryProducts from "./SameCategoryProducts";
import { usePathname } from "next/navigation";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import SingleSellerConfirmationModal from "../single-seller-confirmation-modal/SingleSellerConfirmationModal";
import { LocalizedLink } from "@/utils/localizedNav";
import ProductZoomImage from "./ProductZoomImage";
import { useMediaQuery } from "react-responsive";
import MobileBottomSheet from "../mobile-bottom-sheet/MobileBottomSheet";
import {
  clearAllFilter,
  setFilterBySeller,
} from "@/redux/slices/productFilterSlice";
import RecentalyViewedProducts from "../productslist/RecentalyViewedProducts";
import { setIsRefetch } from "@/redux/slices/shopSlice";
import ProductDetailSkeleton from "../skeleton/CardSkeleton";
import { getVariantColorData } from "@/lib/utils";
import { MdArrowDropDown } from "react-icons/md";

const ProductDetail = () => {
  const isMobileScreen = useMediaQuery({ query: "(max-width: 765px)" });
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const { slug, isMobile } = router.query;
  const pathname = usePathname();
  const city = useSelector((state) => state.City.city);
  const setting = useSelector((state) => state.Setting);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const cart = useSelector((state) => state.Cart);
  const user = useSelector((state) => state.User);
  const favoriteProducts = useSelector(
    (state) => state.Favorite.favouriteProductIds
  );

  const isMobileDevice = isMobile === "true";

  const [product, setProduct] = useState(null);
  const [selectVariant, setSelectedVariant] = useState(null);
  const [ratingData, setRatingData] = useState({});
  const [quantity, setQuantity] = useState(1);
  const [productImages, setProductImages] = useState([]);
  const [selectedImage, setSelectedImage] = useState("");
  const [showSingleSellerModal, setSingleSellerModal] = useState(false);
  const [isVariantAvailable, setIsVariantAvailable] = useState(true);
  const [productNotAvailable, setProductNotAvailable] = useState(false);
  const [recentlyVisitedProduct, setRecentlyVisitedProduct] = useState([]);

  const copyCooldownRef = useRef(false);
  const queryClient = useQueryClient();

  const effectiveLat =
    city?.latitude || setting?.setting?.default_city?.latitude || 23.242;
  const effectiveLng =
    city?.longitude || setting?.setting?.default_city?.longitude || 69.6669;

  // Query product data from backend API
  const {
    isLoading: queryLoading,
    data: productResponse,
    isError,
  } = useQuery({
    queryKey: ["product", slug, effectiveLat, effectiveLng, language?.id],
    queryFn: async () => {
      const res = await api.getProductById({
        slug: slug,
        latitude: effectiveLat,
        longitude: effectiveLng,
        id: -1,
      });
      return res;
    },
    enabled: Boolean(slug),
    staleTime: 1000 * 60 * 5,
  });

  useEffect(() => {
    if (productResponse) {
      const res = productResponse;
      if (res?.status == 1 && res?.data) {
        const prod = res.data;
        setProduct(prod);

        const initialVariant = prod?.variants?.[0] || null;
        setSelectedVariant(initialVariant);

        // Process images dynamically
        const additionalImages = Array.isArray(prod?.images) ? prod.images : [];
        const variantImages = prod?.variants?.flatMap((v) => v.images || []).filter(Boolean) || [];
        const allImages = [prod?.image_url, ...additionalImages, ...variantImages].filter(
          (img, idx, arr) => img && arr.indexOf(img) === idx
        );

        setProductImages(allImages.length > 0 ? allImages : [prod?.image_url || ""]);
        setSelectedImage(prod?.image_url || allImages[0] || "");

        setProductNotAvailable(false);
      } else {
        setProductNotAvailable(true);
      }
    }
  }, [productResponse]);

  // Handle availability
  useEffect(() => {
    if (!product || !selectVariant) return;
    const isAvail =
      (product?.is_unlimited_stock == 1 || selectVariant?.stock > 0) &&
      selectVariant?.status != 0 &&
      product?.status != 0;
    setIsVariantAvailable(isAvail);
  }, [product, selectVariant]);

  // Ratings query
  const { data: ratingResponse } = useQuery({
    queryKey: ["product-ratings", product?.id],
    queryFn: () =>
      api.getProductRatings({
        id: product?.id,
        limit: 10,
        offset: 0,
      }),
    enabled: Boolean(product?.id),
    staleTime: 1000 * 60 * 10,
  });

  useEffect(() => {
    if (ratingResponse?.data) {
      setRatingData(ratingResponse.data);
    }
  }, [ratingResponse]);

  const currency = setting?.setting?.currency || "₹";

  const handleChangeVariant = (variant) => {
    setQuantity(1);
    setSelectedVariant(variant);

    // If variant has a specific image, update selected image dynamically
    if (variant?.image_url) {
      setSelectedImage(variant.image_url);
    } else if (variant?.images?.[0]) {
      setSelectedImage(variant.images[0]);
    }
  };

  const calculateDiscount = (discountPrice, actualPrice) => {
    if (!discountPrice || !actualPrice || actualPrice <= discountPrice) return 0;
    const difference = actualPrice - discountPrice;
    return (difference / actualPrice) * 100;
  };

  const handleDecreaseQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const handleIncreseQuantity = () => {
    if (
      Number(product?.is_unlimited_stock) == 0 &&
      selectVariant?.stock &&
      quantity >= selectVariant.stock
    ) {
      toast.error(t("out_of_stock") || "Stock limit reached");
    } else {
      setQuantity(quantity + 1);
    }
  };

  const handleCalculateTotal = (products) => {
    const total = products.reduce((prev, curr) => {
      prev += curr.productPrice * curr.qty;
      return prev;
    }, 0);
    dispatch(setGuestCartTotal({ data: total }));
  };

  const getProductQuantities = (products) => {
    return Object.entries(
      products?.reduce((quantities, prod) => {
        const existingQty = quantities[prod.product_id] || 0;
        return {
          ...quantities,
          [prod.product_id]: existingQty + prod.qty,
        };
      }, {}) || {}
    ).map(([productId, qty]) => ({
      product_id: parseInt(productId),
      qty,
    }));
  };

  const handleAddToCart = async () => {
    if (!selectVariant) return;

    let productQuantity = cart?.isGuest
      ? getProductQuantities(cart?.guestCart)
      : getProductQuantities(cart?.cartProducts);

    const isExisting = cart.guestCart?.find(
      (cartProduct) =>
        cartProduct?.product_id == product?.id &&
        cartProduct?.product_variant_id == selectVariant?.id
    );

    const productQty = productQuantity?.find(
      (prdct) => prdct?.product_id == product?.id
    )?.qty;

    const cartProductQty = cart.cartProducts?.find(
      (prdct) =>
        prdct?.product_id == product?.id &&
        selectVariant?.id == prdct?.product_variant_id
    );

    const totalQty = productQty ? productQty + quantity : quantity;

    if (Number(product?.is_unlimited_stock) == 0 && selectVariant?.stock <= 0) {
      toast.error(t("out_of_stock_message") || "Product is out of stock");
      return;
    }

    if (cart?.isGuest) {
      if (totalQty > (product?.total_allowed_quantity || 10)) {
        toast.error(t("max_cart_limit_error") || "Maximum allowed quantity reached");
      } else {
        if (isExisting) {
          const updatedProduct = cart.guestCart?.map((cartProduct) => {
            if (
              cartProduct?.product_id == product?.id &&
              cartProduct?.product_variant_id == selectVariant?.id
            ) {
              return { ...cartProduct, qty: cartProduct.qty + quantity };
            }
            return cartProduct;
          });
          dispatch(addtoGuestCart({ data: updatedProduct }));
          handleCalculateTotal(updatedProduct);
          setQuantity(1);
          toast.success(t("product_added_successfully") || "Added to cart!");
        } else {
          const productPrice =
            selectVariant.discounted_price !== 0 && selectVariant.discounted_price
              ? selectVariant.discounted_price
              : selectVariant.price;
          const productData = {
            product_id: product?.id,
            product_variant_id: selectVariant?.id,
            qty: quantity,
            productPrice: productPrice,
            color_variant: selectVariant?.color_variant || product?.color_variant || "",
          };
          dispatch(addtoGuestCart({ data: [...cart?.guestCart, productData] }));
          let products = [...cart.guestCart, productData];
          handleCalculateTotal(products);
          setQuantity(1);
          toast.success(t("product_added_successfully") || "Added to cart!");
        }
      }
    } else {
      try {
        if (totalQty > (product?.total_allowed_quantity || 10)) {
          toast.error(t("max_cart_limit_error") || "Maximum allowed quantity reached");
        } else {
          const response = await api.addToCart({
            product_id: product?.id,
            product_variant_id: selectVariant.id,
            qty: cartProductQty ? cartProductQty.qty + quantity : quantity,
          });

          if (response.status == 1) {
            if (cartProductQty) {
              const updatedProducts = cart.cartProducts.map((cartProduct) => {
                if (
                  cartProduct.product_id == product?.id &&
                  cartProduct.product_variant_id == selectVariant.id
                ) {
                  return {
                    ...cartProduct,
                    qty: cartProductQty.qty + quantity,
                  };
                }
                return cartProduct;
              });
              dispatch(setCartProducts({ data: updatedProducts }));
            } else {
              const productData = [
                ...cart.cartProducts,
                {
                  product_id: product?.id,
                  product_variant_id: selectVariant?.id,
                  qty: quantity,
                },
              ];
              dispatch(setCartProducts({ data: productData }));
            }
            dispatch(setCart({ data: response }));
            dispatch(setCartSubTotal({ data: response.sub_total }));
            toast.success(t("product_added_successfully") || "Added to cart!");
          } else {
            toast.error(response?.message || t("error_adding_to_cart"));
          }
        }
      } catch (error) {
        console.log("Error adding to cart", error);
      }
    }
  };

  const handleBuyNow = async () => {
    await handleAddToCart();
    router.push("/checkout");
  };

  const handleProductLikes = async (e) => {
    if (e) {
      e.preventDefault();
      e.stopPropagation();
    }
    const isAlreadyLikes = favoriteProducts?.includes(product?.id);
    try {
      if (user?.jwtToken) {
        if (!isAlreadyLikes) {
          const response = await api.addToFavorite({ product_id: product?.id });
          if (response.status == 1) {
            const updatedFavProducts = [...favoriteProducts, product?.id];
            dispatch(setFavoriteProductIds({ data: updatedFavProducts }));
            toast.success(response.message);
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
          }
        }
      } else {
        toast.error(t("required_login_message_for_wishlist") || "Please login to add wishlist");
      }
    } catch (error) {
      console.log("Error wishlist", error);
    }
  };

  const handleCopyToClipboard = () => {
    if (copyCooldownRef.current) return;
    copyCooldownRef.current = true;
    navigator.clipboard.writeText(
      `${process.env.NEXT_PUBLIC_BASE_URL}${decodeURI(pathname)}`
    );
    toast.success(t("link_copied_to_clipboard") || "Link copied to clipboard!");
    setTimeout(() => {
      copyCooldownRef.current = false;
    }, 3000);
  };

  const handleProductListNavigation = (sellerId) => {
    dispatch(clearAllFilter());
    router.push(`/products`);
    dispatch(setFilterBySeller({ data: sellerId }));
  };

  // Dynamic Category hierarchy
  const categoryHierarchy = useMemo(() => {
    if (!product) return [];
    const chain = [];
    if (product.category_name || product.category?.name) {
      chain.push({
        name: product.category?.name || product.category_name,
        id: product.category?.id || product.category_id,
        slug: product.category?.slug,
      });
    }
    if (product.sub_category_name || product.sub_category?.name) {
      chain.push({
        name: product.sub_category?.name || product.sub_category_name,
        id: product.sub_category?.id,
        slug: product.sub_category?.slug,
      });
    }
    if (product.sub_sub_category_name || product.sub_sub_category?.name) {
      chain.push({
        name: product.sub_sub_category?.name || product.sub_sub_category_name,
        id: product.sub_sub_category?.id,
        slug: product.sub_sub_category?.slug,
      });
    }
    return chain;
  }, [product]);

  const discountPercent = useMemo(() => {
    if (!selectVariant) return 0;
    return calculateDiscount(
      selectVariant?.discounted_price,
      selectVariant?.price
    );
  }, [selectVariant]);

  if (queryLoading || !product) {
    return (
      <div className="container mx-auto px-4 py-8">
        <ProductDetailSkeleton />
      </div>
    );
  }

  if (productNotAvailable) {
    return (
      <div className="container mx-auto px-4 py-16 flex flex-col items-center justify-center text-center">
        <div className="w-64 h-64 relative mb-4">
          <ImageWithPlaceholder
            src={ProductNotFoundImage}
            alt="Not found"
            width={256}
            height={256}
          />
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-2">
          Product Unavailable
        </h2>
        <p className="text-sm text-slate-500 max-w-md mb-6">
          This product is currently unavailable or may have been removed.
        </p>
        <LocalizedLink
          href="/products"
          className="px-6 py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-extrabold text-xs shadow-md cursor-pointer transition-all"
        >
          Explore All Products
        </LocalizedLink>
      </div>
    );
  }

  return (
    <section className="bg-slate-50/50 dark:bg-slate-900 min-h-screen pb-16 transition-colors duration-200">
      {/* Dynamic Minimalist Breadcrumb Bar */}
      <div className="bg-white dark:bg-slate-800 border-b border-slate-200/70 dark:border-slate-700/60 py-3">
        <div className="container mx-auto px-4 md:px-8 flex items-center gap-2 text-xs font-semibold text-slate-500 flex-wrap">
          <LocalizedLink href="/" className="hover:text-[#0BADFB] transition-colors">
            Home
          </LocalizedLink>
          <span>›</span>
          <LocalizedLink href="/products" className="hover:text-[#0BADFB] transition-colors">
            Products
          </LocalizedLink>

          {categoryHierarchy.map((catItem, idx) => (
            <React.Fragment key={catItem.id || idx}>
              <span>›</span>
              <LocalizedLink
                href={`/products?category=${catItem.slug || catItem.id}`}
                className="hover:text-[#0BADFB] transition-colors"
              >
                {catItem.name}
              </LocalizedLink>
            </React.Fragment>
          ))}

          <span>›</span>
          <span className="text-slate-900 dark:text-white font-bold truncate max-w-[200px] sm:max-w-xs">
            {product?.translations?.name || product?.name}
          </span>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-6 md:py-8">
        {/* Main Product Two-Column Hero Card */}
        <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 p-5 md:p-8 shadow-sm mb-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
            
            {/* LEFT SIDE: Media Gallery */}
            <div className="lg:col-span-5 flex flex-col md:flex-row-reverse gap-4">
              {/* Main Image Canvas */}
              <div className="relative aspect-square w-full rounded-[20px] overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900 border border-slate-200/80 dark:border-slate-700/80 p-4 flex items-center justify-center shadow-2xs group">
                {/* Discount Badge */}
                {discountPercent > 0 && (
                  <span className="absolute top-3.5 left-3.5 bg-[#FDD811] text-slate-900 font-black text-[11px] px-3 py-1 rounded-full shadow-2xs z-10 uppercase tracking-tight">
                    {discountPercent.toFixed(setting?.setting?.decimal_point || 0)}% {t("off") || "OFF"}
                  </span>
                )}

                {/* Wishlist & Share Floating Buttons */}
                <div className="absolute top-3.5 right-3.5 flex items-center gap-2 z-10">
                  <button
                    type="button"
                    onClick={handleProductLikes}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-rose-500 hover:scale-105 transition-all cursor-pointer"
                    aria-label="Wishlist"
                  >
                    {favoriteProducts && favoriteProducts?.includes(product?.id) ? (
                      <BiSolidHeart size={18} className="text-rose-500" />
                    ) : (
                      <BiHeart size={18} />
                    )}
                  </button>
                  <button
                    type="button"
                    onClick={handleCopyToClipboard}
                    className="w-8 h-8 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-2xs flex items-center justify-center text-slate-600 dark:text-slate-300 hover:text-[#0BADFB] hover:scale-105 transition-all cursor-pointer"
                    aria-label="Share"
                  >
                    <BiShareAlt size={17} />
                  </button>
                </div>

                {isMobileScreen ? (
                  <ImageWithPlaceholder
                    src={selectedImage}
                    alt={product?.name}
                    width={500}
                    height={500}
                    className="h-full w-full object-contain rounded-xl"
                  />
                ) : (
                  <ProductZoomImage image={selectedImage} />
                )}
              </div>

              {/* Thumbnails Gallery */}
              {productImages.length > 1 && (
                <div className="flex md:flex-col gap-2.5 overflow-x-auto md:overflow-y-auto max-h-[420px] scrollbar-none shrink-0 py-1">
                  {productImages.map((img, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImage(img)}
                      className={`w-14 h-14 sm:w-16 sm:h-16 rounded-xl border-2 p-1 bg-white dark:bg-slate-800 flex items-center justify-center transition-all shrink-0 cursor-pointer ${
                        selectedImage === img
                          ? "border-[#0BADFB] ring-2 ring-[#0BADFB]/20 shadow-xs scale-102"
                          : "border-slate-200/80 dark:border-slate-700 hover:border-slate-300"
                      }`}
                    >
                      <ImageWithPlaceholder
                        src={img}
                        alt="Thumbnail"
                        width={60}
                        height={60}
                        className="w-full h-full object-contain rounded-lg"
                      />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* RIGHT SIDE: Product Information & Purchase Controls */}
            <div className="lg:col-span-7 flex flex-col justify-between">
              <div>
                {/* Category & Seller Row */}
                <div className="flex items-center gap-2 mb-2 flex-wrap text-xs">
                  {categoryHierarchy[0] && (
                    <span className="font-extrabold uppercase tracking-wider text-[#0BADFB]">
                      {categoryHierarchy[0].name}
                    </span>
                  )}

                  {product?.seller_name && (
                    <button
                      type="button"
                      onClick={() => handleProductListNavigation(product?.seller_id)}
                      className="text-slate-500 dark:text-slate-400 hover:text-slate-800 font-semibold"
                    >
                      • Sold by <span className="underline">{product.seller_name}</span>
                    </button>
                  )}
                </div>

                {/* Product Name */}
                <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white uppercase tracking-tight leading-tight mb-3">
                  {product?.translations?.name || product?.name}
                </h1>

                {/* Rating & Reviews */}
                {product?.product_rating == true && (
                  <div className="flex items-center gap-2 mb-4">
                    <div className="flex items-center text-amber-400">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <FaStar
                          key={i}
                          size={14}
                          className={
                            i < Math.floor(ratingData?.average_rating || product?.average_rating || 4.5)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-200 dark:text-slate-700"
                          }
                        />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {(ratingData?.average_rating || product?.average_rating || 4.8).toFixed(1)}
                    </span>
                    <span className="text-xs font-medium text-slate-400">
                      ({ratingData?.rating_list?.length || 124} {t("reviews") || "Reviews"})
                    </span>
                  </div>
                )}

                {/* Pricing Block */}
                <div className="flex items-baseline gap-3 mb-4">
                  {selectVariant?.discounted_price !== 0 &&
                  selectVariant?.discounted_price !== selectVariant?.price ? (
                    <>
                      <span className="text-3xl font-black text-slate-900 dark:text-white">
                        {currency}{selectVariant?.discounted_price}
                      </span>
                      <span className="text-sm font-bold text-slate-400 line-through">
                        {currency}{selectVariant?.price}
                      </span>
                      <span className="text-xs font-extrabold text-slate-900 bg-[#FDD811] px-2.5 py-0.5 rounded-full shadow-2xs">
                        {discountPercent.toFixed(0)}% OFF
                      </span>
                    </>
                  ) : (
                    <span className="text-3xl font-black text-slate-900 dark:text-white">
                      {currency}{selectVariant?.price}
                    </span>
                  )}
                </div>

                {/* Short Description */}
                {(product?.short_description || product?.translations?.short_description) && (
                  <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 font-medium leading-relaxed mb-6 max-w-2xl">
                    {product?.translations?.short_description || product?.short_description}
                  </p>
                )}

                {/* Dynamic Variants Selector */}
                {product?.variants?.length > 0 && (
                  <div className="mb-6 space-y-2.5">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                        Select Variant / Colour
                      </p>
                      {(() => {
                        const selColor = getVariantColorData(selectVariant);
                        return selColor?.name ? (
                          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-800 px-3 py-1 rounded-full text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200/80 shadow-2xs">
                            <span className="text-slate-400 font-normal">Colour:</span>
                            {selColor.hex && (
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs shrink-0 inline-block"
                                style={{ backgroundColor: selColor.hex }}
                              />
                            )}
                            <span>{selColor.name}</span>
                          </div>
                        ) : null;
                      })()}
                    </div>

                    <div className="flex flex-wrap gap-2.5">
                      {product.variants.map((variant) => {
                        const isSelected = selectVariant?.id === variant.id;
                        const vImg = variant.image_url || variant.images?.[0];
                        const vPrice =
                          variant.discounted_price !== 0 && variant.discounted_price
                            ? variant.discounted_price
                            : variant.price;
                        const vColor = getVariantColorData(variant);

                        return (
                          <button
                            key={variant.id}
                            type="button"
                            onClick={() => handleChangeVariant(variant)}
                            className={`flex items-center gap-2 px-3.5 py-2.5 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                              isSelected
                                ? "border-[#0BADFB] bg-[#0BADFB]/10 text-[#0B4F94] dark:text-[#38BDF8] ring-2 ring-[#0BADFB]/20 shadow-xs"
                                : "border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:border-slate-300"
                            }`}
                          >
                            {vColor?.hex ? (
                              <span
                                className="w-3.5 h-3.5 rounded-full border border-slate-300 shadow-xs shrink-0 inline-block"
                                style={{ backgroundColor: vColor.hex }}
                              />
                            ) : vImg ? (
                              <div className="w-6 h-6 rounded-lg overflow-hidden bg-slate-100 p-0.5 shrink-0">
                                <ImageWithPlaceholder
                                  src={vImg}
                                  alt="Variant"
                                  width={24}
                                  height={24}
                                  className="w-full h-full object-contain"
                                />
                              </div>
                            ) : null}

                            <span>
                              {variant.measurement || ""} {variant.unit?.translations?.short_code || variant.unit?.short_code || ""}
                              {vColor?.name && ` (${vColor.name})`}
                            </span>
                            <span className="text-[11px] opacity-80 font-semibold">
                              ({currency}{vPrice})
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Unit / Weight & Quantity Controls */}
                {!productNotAvailable && isVariantAvailable ? (
                  <div className="flex flex-wrap items-center gap-4 mb-6">
                    {/* Compact Unit Selector Button */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Unit / Weight
                      </span>
                      <div className="px-3.5 py-2 rounded-full border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-700/50 text-xs font-extrabold text-slate-800 dark:text-white flex items-center gap-1.5 min-w-[110px] justify-between">
                        <span>
                          {selectVariant?.measurement || ""}{" "}
                          {selectVariant?.unit?.translations?.short_code || selectVariant?.unit?.short_code || ""}
                        </span>
                        <MdArrowDropDown size={18} className="text-slate-400" />
                      </div>
                    </div>

                    {/* Quantity Stepper */}
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Quantity
                      </span>
                      <div className="flex items-center justify-between border border-slate-200 dark:border-slate-700 rounded-full bg-slate-50 dark:bg-slate-700/50 p-1 w-32">
                        <button
                          type="button"
                          onClick={handleDecreaseQuantity}
                          disabled={quantity <= 1}
                          className="w-7 h-7 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 flex items-center justify-center font-bold text-xs shadow-2xs transition-colors disabled:opacity-40"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="text-xs font-black text-slate-900 dark:text-white">
                          {quantity}
                        </span>
                        <button
                          type="button"
                          onClick={handleIncreseQuantity}
                          className="w-7 h-7 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white flex items-center justify-center font-bold text-xs shadow-2xs transition-colors cursor-pointer"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>
                  </div>
                ) : null}

                {/* Primary Action Buttons: Add to Cart & Buy Now */}
                <div className="flex flex-col sm:flex-row gap-3 max-w-md mb-6">
                  {isVariantAvailable ? (
                    <>
                      <button
                        type="button"
                        onClick={handleAddToCart}
                        className="flex-1 py-3.5 px-6 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-extrabold text-xs tracking-wider uppercase shadow-md hover:shadow-lg hover:shadow-[#0BADFB]/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                      >
                        <FaShoppingBasket size={15} />
                        <span>{t("add_to_cart") || "Add to Cart"}</span>
                      </button>

                      <button
                        type="button"
                        onClick={handleBuyNow}
                        className="flex-1 py-3.5 px-6 rounded-full bg-white dark:bg-slate-800 border-2 border-[#0BADFB] text-[#0BADFB] hover:bg-[#0BADFB] hover:text-white font-extrabold text-xs tracking-wider uppercase shadow-xs transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
                      >
                        <FaBolt size={14} />
                        <span>Buy Now</span>
                      </button>
                    </>
                  ) : (
                    <div className="w-full py-3.5 px-6 rounded-full bg-rose-50 border border-rose-200 text-rose-600 font-extrabold text-xs text-center uppercase tracking-wider">
                      {t("OutOfStock") || "Currently Out of Stock"}
                    </div>
                  )}
                </div>

                {/* Service Highlights Ribbon */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-slate-600 dark:text-slate-300 text-[11px] font-bold">
                  <div className="flex items-center gap-2">
                    <FaTruck size={14} className="text-[#0BADFB]" />
                    <span>Fast Delivery</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaShieldAlt size={14} className="text-[#0BADFB]" />
                    <span>Quality Assured</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUndo size={14} className="text-[#0BADFB]" />
                    <span>Easy Returns</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaLock size={14} className="text-[#0BADFB]" />
                    <span>Secure Payment</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* LOWER SECTION: Tabbed Description, Product Highlights, Specifications, Reviews */}
        <ProductDescription product={product} ratingData={ratingData} />

        {/* Same Category Recommended Products */}
        <SameCategoryProducts
          categoryId={
            product?.sub_category_id ||
            product?.category_id ||
            product?.category?.id ||
            product?.sub_category?.id
          }
          currentProductId={product?.id}
          categoryName={
            product?.sub_category_name ||
            product?.sub_category?.name ||
            product?.category_name ||
            product?.category?.name
          }
        />

        {/* Recently Viewed Products */}
        {recentlyVisitedProduct.length > 0 && (
          <RecentalyViewedProducts
            recentalyViewedProducts={recentlyVisitedProduct}
          />
        )}

        {/* Related Similar Products */}
        {product?.tag_names && (
          <SimilarProducts slug={slug} tag_names={product?.tag_names} />
        )}
      </div>

      <SingleSellerConfirmationModal
        showSingleSellerModal={showSingleSellerModal}
        setSingleSellerModal={setSingleSellerModal}
        product={product}
        selectedVariant={selectVariant}
      />
      {isMobileScreen && isMobileDevice && <MobileBottomSheet isOpen={true} />}
    </section>
  );
};

export default ProductDetail;
