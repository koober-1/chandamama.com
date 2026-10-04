import React, { useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useQuery } from '@tanstack/react-query';
import * as api from '@/api/apiRoutes';
import {
  setListingSource,
  setFilterCategory,
  setCategorySlug,
} from '@/redux/slices/productFilterSlice';
import { LocalizedLink, useLocalizedRouter } from '@/utils/localizedNav';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import VerticleProductCard from '@/components/productcards/VerticleProductCard';
import HomePageSlider from '@/components/mainslider/MainSlider';
import BrandSlider from '@/components/shop-by-brands/BrandSlider';
import HomeOfferSection from '@/components/homepagefaturesection/HomeOfferSection';
import ImageWithPlaceholder from '@/components/image-with-placeholder/ImageWithPlaceholder';
import { t } from '@/utils/translation';

const HomePage = ({ shopData: propShopData, isShopLoading: propIsShopLoading }) => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();

  const reduxShop = useSelector((state) => state.Shop?.shop);
  const shopData = propShopData || reduxShop;

  const setting = useSelector((state) => state.Setting?.setting);
  const language = useSelector((state) => state.Language?.selectedLanguage);
  const city = useSelector((state) => state.City?.city);

  const effectiveLat =
    city?.latitude || setting?.default_city?.latitude || 23.242;
  const effectiveLng =
    city?.longitude || setting?.default_city?.longitude || 69.6669;

  // 1. Sliders logic
  const sliders = Array.isArray(shopData?.sliders) ? shopData.sliders : [];

  // 2. Offers / promotional banners from shopData
  const offers = Array.isArray(shopData?.offers) ? shopData.offers : [];
  const topOffers = offers.filter((o) => o?.position === 'top');
  const belowSliderOffers = offers.filter((o) => o?.position === 'below_slider');
  const belowCategoryOffers = offers.filter((o) => o?.position === 'below_category');

  // 3. Dynamic Offers Query from /offers API endpoint
  const { data: dynamicOffersAPI = [] } = useQuery({
    queryKey: ['homeDynamicOffersAPI', effectiveLat, effectiveLng, language?.id],
    queryFn: async () => {
      try {
        const res = await api.getOffers({ latitude: effectiveLat, longitude: effectiveLng });
        if (Array.isArray(res?.data)) return res.data;
        if (Array.isArray(res?.offers)) return res.offers;
        if (Array.isArray(res)) return res;
      } catch (e) {
        console.log('Error fetching dynamic offers API:', e);
      }
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const allDynamicOffers = useMemo(() => {
    const combined = [...dynamicOffersAPI, ...offers];
    const uniqueMap = new Map();
    combined.forEach((off) => {
      if (off && (off.id || off.image || off.image_url) && !uniqueMap.has(off.id || off.image_url)) {
        uniqueMap.set(off.id || off.image_url, off);
      }
    });
    return Array.from(uniqueMap.values());
  }, [dynamicOffersAPI, offers]);

  // 4. Categories logic: read from shopData, with query fallback
  const shopCategories = Array.isArray(shopData?.categories) ? shopData.categories : [];

  const { data: fallbackCategories, isLoading: isCategoriesLoading } = useQuery({
    queryKey: ['homeCategories', language?.id],
    queryFn: async () => {
      const res = await api.getCategories();
      return Array.isArray(res?.data) ? res.data : [];
    },
    enabled: shopCategories.length === 0,
    staleTime: 1000 * 60 * 10,
  });

  const categories =
    shopCategories.length > 0
      ? shopCategories
      : Array.isArray(fallbackCategories) && fallbackCategories.length > 0
      ? fallbackCategories
      : [];

  const isCategoriesLoadingState =
    Boolean(propIsShopLoading || isCategoriesLoading) && categories.length === 0;

  // 5. Sections & Products logic
  const rawSections = Array.isArray(shopData?.sections) ? shopData.sections : [];
  const sections = rawSections.map((sec) => {
    const prods = Array.isArray(sec?.products)
      ? sec.products.filter((p) => p && typeof p === 'object' && p.id)
      : [];
    return {
      ...sec,
      products: prods,
    };
  });

  // Direct API Query for Featured / Direct Products
  const { data: directFeaturedProducts, isLoading: isProductsLoading } = useQuery({
    queryKey: [
      'homeDirectFeaturedProducts',
      effectiveLat,
      effectiveLng,
      language?.id,
    ],
    queryFn: async () => {
      const res = await api.getProductByFilter({
        latitude: effectiveLat,
        longitude: effectiveLng,
        filters: { limit: 16 },
      });
      if (Array.isArray(res?.data)) return res.data;
      if (Array.isArray(res?.data?.data)) return res.data.data;
      if (Array.isArray(res)) return res;
      return [];
    },
    staleTime: 1000 * 60 * 5,
  });

  const fallbackProducts = directFeaturedProducts || [];
  const isProductsLoadingState = Boolean(propIsShopLoading || isProductsLoading);

  // 6. Top Trending Products Logic
  // Sort by purchase / sales count if order data exists; fallback to general products; min 8 products guaranteed.
  const trendingProductsList = useMemo(() => {
    let allProds = [...fallbackProducts];
    sections.forEach((sec) => {
      if (Array.isArray(sec?.products)) {
        allProds.push(...sec.products);
      }
    });

    // Filter valid objects
    allProds = allProds.filter((p) => p && typeof p === 'object' && p.id);

    // Sort by sales / order count / purchases if available
    allProds.sort((a, b) => {
      const purchaseA = Number(a?.sales_count || a?.total_sales || a?.orders_count || a?.ratings_count || a?.purchases || 0);
      const purchaseB = Number(b?.sales_count || b?.total_sales || b?.orders_count || b?.ratings_count || b?.purchases || 0);
      return purchaseB - purchaseA;
    });

    // Deduplicate by product id
    const map = new Map();
    allProds.forEach((p) => {
      if (!map.has(p.id)) {
        map.set(p.id, p);
      }
    });

    let list = Array.from(map.values());

    // Ensure at least 8 items
    if (list.length < 8 && list.length > 0) {
      while (list.length < 8) {
        list = [...list, ...list].slice(0, 8);
      }
    }

    return list.slice(0, 12);
  }, [fallbackProducts, sections]);

  // Brands logic
  const brands = Array.isArray(shopData?.brands) ? shopData.brands : [];

  const handleCategoryClick = (cat) => {
    dispatch(setListingSource({ data: 'category' }));
    dispatch(setFilterCategory({ data: cat.id }));
    if (cat.slug) {
      dispatch(setCategorySlug({ data: cat.slug }));
    }
    router.push({
      pathname: '/products',
      query: {
        category: cat.slug || cat.id,
        category_id: cat.id,
        source: 'category',
        lang: language?.code,
      },
    });
  };

  const handleOfferClick = (offer) => {
    if (offer?.type === 'category' && offer?.type_id) {
      dispatch(setListingSource({ data: 'category' }));
      dispatch(setFilterCategory({ data: offer.type_id }));
      router.push({
        pathname: '/products',
        query: { category_id: offer.type_id, lang: language?.code },
      });
    } else if (offer?.type === 'product' && (offer?.type_slug || offer?.type_id)) {
      router.push({
        pathname: `/product/${offer.type_slug || offer.type_id}`,
        query: { lang: language?.code },
      });
    } else {
      router.push({
        pathname: '/products',
        query: { lang: language?.code },
      });
    }
  };

  const renderProductSkeletons = (count = 4) => (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {Array.from({ length: count }).map((_, idx) => (
        <div
          key={idx}
          className="p-4 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 flex flex-col items-center"
        >
          <div className="w-full aspect-square mb-4">
            <Skeleton height="100%" className="rounded-xl w-full" />
          </div>
          <Skeleton height={18} width="80%" className="mb-2" />
          <Skeleton height={14} width="50%" className="mb-3" />
          <Skeleton height={36} width="100%" className="rounded-full" />
        </div>
      ))}
    </div>
  );

  return (
    <div className="w-full bg-white dark:bg-slate-900 font-sans text-slate-800 dark:text-slate-100 transition-colors duration-200">
      {/* 1. Hero Section: Real dynamic slider if available, otherwise brand welcoming hero */}
      {sliders.length > 0 ? (
        <div className="w-full">
          <HomePageSlider slider={{ sliders }} />
        </div>
      ) : (
        <div className="w-full bg-gradient-to-r from-[#0BADFB] via-[#0298e0] to-[#017cc0] dark:from-[#06203D] dark:via-[#092D57] dark:to-[#06203D] flex justify-center items-center py-12 md:py-20 relative overflow-hidden min-h-[300px] md:min-h-[420px]">
          {/* Whimsical Twinkling Stars matching Brand Logo */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden select-none">
            <span className="absolute top-6 left-[8%] md:left-[14%] text-[#FDD811] text-2xl md:text-3xl animate-pulse opacity-90 drop-shadow">
              ★
            </span>
            <span className="absolute top-20 left-[20%] text-white text-base md:text-xl opacity-80">
              ✦
            </span>
            <span className="absolute bottom-10 left-[10%] md:left-[16%] text-[#FDD811] text-xl md:text-2xl opacity-80">
              ★
            </span>
            <span className="absolute top-8 right-[10%] md:right-[15%] text-[#FDD811] text-2xl md:text-3xl animate-pulse opacity-90 drop-shadow">
              ★
            </span>
            <span className="absolute top-24 right-[22%] text-white text-base md:text-xl opacity-80">
              ✦
            </span>
            <span className="absolute bottom-12 right-[8%] md:right-[14%] text-[#FDD811] text-xl md:text-2xl opacity-80">
              ★
            </span>
          </div>

          {/* Left Playful Badges */}
          <div className="hidden lg:flex flex-col gap-4 absolute left-8 xl:left-20 z-20 pointer-events-none">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/60 dark:border-slate-700 flex items-center gap-3 transform -rotate-3">
              <span className="text-2xl">🎒</span>
              <div>
                <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  School Days
                </p>
                <p className="text-xs font-black text-[#0B4F94] dark:text-[#38BDF8]">
                  Books & Stationery
                </p>
              </div>
            </div>
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/60 dark:border-slate-700 flex items-center gap-3 transform rotate-2 ml-5">
              <span className="text-2xl">🧸</span>
              <div>
                <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Play Time
                </p>
                <p className="text-xs font-black text-[#0B4F94] dark:text-[#38BDF8]">
                  Toys & Games
                </p>
              </div>
            </div>
          </div>

          {/* Right Playful Badges */}
          <div className="hidden lg:flex flex-col gap-4 absolute right-8 xl:right-20 z-20 pointer-events-none">
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/60 dark:border-slate-700 flex items-center gap-3 transform rotate-3">
              <span className="text-2xl">🎁</span>
              <div>
                <p className="text-[10px] font-black text-[#BD162C] dark:text-red-400 uppercase tracking-wider">
                  Special Days
                </p>
                <p className="text-xs font-black text-[#0B4F94] dark:text-[#38BDF8]">
                  Gifts & Surprises
                </p>
              </div>
            </div>
            <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-md px-4 py-2.5 rounded-2xl shadow-xl border border-white/60 dark:border-slate-700 flex items-center gap-3 transform -rotate-2 mr-5">
              <span className="text-2xl">✨</span>
              <div>
                <p className="text-[10px] font-black text-amber-600 dark:text-amber-400 uppercase tracking-wider">
                  Best Quality
                </p>
                <p className="text-xs font-black text-[#0B4F94] dark:text-[#38BDF8]">
                  Direct Doorstep Delivery
                </p>
              </div>
            </div>
          </div>

          {/* Large Brand Visual Circle */}
          <div className="relative w-[280px] h-[280px] md:w-[380px] md:h-[380px] bg-gradient-to-b from-[#FDD811] via-[#FDD811] to-[#e6c300] rounded-full flex flex-col justify-center items-center text-center p-6 z-10 shadow-[0_15px_45px_rgba(253,216,17,0.4)] border-4 md:border-8 border-white dark:border-slate-800">
            <div className="bg-white/95 dark:bg-slate-900/90 px-3.5 py-1 rounded-full shadow-xs mb-1 border border-amber-200">
              <h3 className="text-[10px] md:text-xs font-black text-[#0BADFB] dark:text-[#38BDF8] tracking-widest uppercase">
                WELCOME TO
              </h3>
            </div>
            <h1 className="text-3xl md:text-5xl font-black leading-tight select-none mb-1 tracking-tight">
              <span className="text-[#0B4F94] drop-shadow-[0_2px_0_rgba(255,255,255,0.7)]">
                CHANDA
              </span>
              <br />
              <span className="text-[#0BADFB] drop-shadow-[0_2px_0_rgba(255,255,255,0.8)]">
                MAMA
              </span>
            </h1>
            <div className="mt-1 px-4 py-1 bg-gradient-to-r from-[#0BADFB] via-[#0298e0] to-[#0BADFB] text-white text-[10px] md:text-xs font-black rounded-full shadow-md flex items-center gap-1.5 border border-amber-300/40 tracking-wider uppercase">
              <span className="text-[#FDD811]">★</span>
              <span>FROM SCHOOL DAYS TO SPECIAL DAYS</span>
              <span className="text-[#FDD811]">★</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. Below Slider Offers */}
      {belowSliderOffers.length > 0 && (
        <div className="container mx-auto px-4 py-6">
          {belowSliderOffers.map((offer) => (
            <div key={offer.id} className="mb-4">
              <HomeOfferSection offer={offer} />
            </div>
          ))}
        </div>
      )}

      {/* 4. Discover Categories Section */}
      <div className="container mx-auto py-10 md:py-14 px-4">
        <div className="flex flex-col md:flex-row items-start md:items-end gap-3 md:gap-4 mb-8 border-b-2 border-[#0BADFB]/40 pb-0">
          <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
            <span className="inline-block bg-[#FDD811] text-slate-900 font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-5 sm:px-6 py-2 sm:py-2.5 rounded-t-xl shadow-2xs">
              {t('shop_by') || 'SHOP BY'} {t('categories') || 'CATEGORY'}
            </span>
            <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium pb-2">
              Find fresh groceries, daily essentials and produce!
            </span>
          </div>
          <div className="ml-auto pb-2">
            <LocalizedLink
              href="/products"
              className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0BADFB] hover:text-[#0BADFB] transition-all shadow-2xs"
            >
              {t('see_all') || 'See All'} →
            </LocalizedLink>
          </div>
        </div>

        {isCategoriesLoadingState ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 md:gap-6">
            {Array.from({ length: 6 }).map((_, idx) => (
              <div key={idx} className="flex flex-col items-center">
                <Skeleton
                  height={130}
                  className="w-full aspect-square rounded-2xl mb-3"
                />
                <Skeleton height={16} width={80} />
              </div>
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 md:gap-6">
            {categories.map((cat, idx) => {
              const catName = cat.translations?.name || cat.name || 'Category';
              const catImg =
                cat.image_url ||
                cat.image ||
                cat.translations?.image_url ||
                cat.translations?.image ||
                cat.banner_url ||
                cat.icon_url;
              return (
                <div
                  key={cat.id || idx}
                  onClick={() => handleCategoryClick(cat)}
                  className="group flex flex-col items-center cursor-pointer w-full text-center"
                >
                  <div className="w-full aspect-[4/3] sm:aspect-square rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#0BADFB] p-4 sm:p-6 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md relative overflow-hidden">
                    <div className="w-full h-full relative flex items-center justify-center">
                      <ImageWithPlaceholder
                        src={catImg}
                        width={300}
                        height={300}
                        alt={catName}
                        className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300 rounded-xl"
                      />
                    </div>
                  </div>
                  <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#0BADFB] transition-colors mt-3 uppercase tracking-wider line-clamp-1 w-full text-center">
                    {catName}
                  </h3>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              No categories available at the moment.
            </p>
          </div>
        )}
      </div>

      {/* 5. Products Section RIGHT AFTER Category Section */}
      <div className="w-full bg-[#FFFDF0] dark:bg-slate-800/80 border-y border-[#FEF08A]/70 dark:border-slate-700 py-12 md:py-16 transition-colors">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 border-b-2 border-[#0BADFB]/40 pb-0">
            <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
              <div className="bg-[#FDD811] text-slate-900 px-6 py-2 whitespace-nowrap rounded-t-lg shadow-xs">
                <h2 className="text-base md:text-lg font-black tracking-wide uppercase">
                  POPULAR PRODUCTS & DEALS
                </h2>
              </div>
              <p className="text-slate-700 dark:text-slate-300 font-medium pb-2 text-sm md:text-base">
                Explore top quality products directly available for order!
              </p>
            </div>
            <div className="pb-2">
              <LocalizedLink
                href="/products"
                className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0BADFB] hover:text-[#0BADFB] transition-all shadow-2xs"
              >
                {t('see_all') || 'See All'} →
              </LocalizedLink>
            </div>
          </div>

          {isProductsLoadingState ? (
            renderProductSkeletons(4)
          ) : fallbackProducts && fallbackProducts.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {fallbackProducts.slice(0, 8).map((prod) => (
                <VerticleProductCard key={prod.id} product={prod} />
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-white/60 dark:bg-slate-800/50 rounded-2xl border border-dashed border-amber-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                No products currently in stock. Please check back soon!
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 6. Dynamic Offers Section (Fetched from http://127.0.0.1:8000/api/customer/offers) */}
      {allDynamicOffers.length > 0 && (
        <div className="w-full py-12 md:py-16 bg-gradient-to-r from-sky-50 via-amber-50/40 to-sky-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 border-b border-sky-100 dark:border-slate-800">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 mb-8 border-b-2 border-[#0BADFB]/40 pb-0">
              <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
                <span className="inline-block bg-[#0BADFB] text-white font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-5 sm:px-6 py-2 sm:py-2.5 rounded-t-xl shadow-xs">
                  🎁 SPECIAL OFFERS & PROMOTIONS
                </span>
                <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium pb-2">
                  Exclusive discounts & dynamic promotional deals!
                </span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {allDynamicOffers.map((offer, idx) => {
                const offerImg = offer.image_url || offer.image;
                if (!offerImg) return null;
                return (
                  <div
                    key={offer.id || idx}
                    onClick={() => handleOfferClick(offer)}
                    className="group relative rounded-3xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-slate-200/80 dark:border-slate-700 bg-white dark:bg-slate-800 cursor-pointer"
                  >
                    <div className="relative w-full h-48 sm:h-56 overflow-hidden bg-slate-100 dark:bg-slate-800">
                      <ImageWithPlaceholder
                        src={offerImg}
                        width={600}
                        height={400}
                        alt="Special Offer"
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent opacity-60 group-hover:opacity-40 transition-opacity" />
                      <span className="absolute top-3 left-3 px-3.5 py-1.5 rounded-full bg-[#FDD811] text-slate-900 text-xs font-black uppercase tracking-wider shadow-md border border-amber-300">
                        OFFER
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* 7. TOP TRENDING PRODUCTS SECTION (Sorted by purchase count, min 8 products) */}
      <div className="w-full py-12 md:py-16 bg-white dark:bg-slate-900">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-3 mb-8 border-b-2 border-rose-500/40 pb-0">
            <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
              <span className="inline-block bg-gradient-to-r from-rose-500 via-rose-600 to-amber-500 text-white font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-5 sm:px-6 py-2 sm:py-2.5 rounded-t-xl shadow-xs flex items-center gap-1.5">
                🔥 TOP TRENDING PRODUCTS
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium pb-2">
                Most purchased & highly ordered items!
              </span>
            </div>
            <div className="ml-auto pb-2">
              <LocalizedLink
                href="/products"
                className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-rose-500 hover:text-rose-500 transition-all shadow-2xs"
              >
                {t('see_all') || 'See All'} →
              </LocalizedLink>
            </div>
          </div>

          {isProductsLoadingState ? (
            renderProductSkeletons(8)
          ) : trendingProductsList && trendingProductsList.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
              {trendingProductsList.map((prod, pIdx) => (
                <div key={prod.id || pIdx} className="relative group">
                  {/* Top Trending Rank Badge */}
                  {pIdx < 3 && (
                    <div className="absolute top-2 left-2 z-20 bg-gradient-to-r from-amber-500 to-rose-500 text-white font-black text-[10px] sm:text-xs px-2.5 py-0.5 rounded-full shadow-md flex items-center gap-1">
                      <span>#{pIdx + 1} Trending</span>
                    </div>
                  )}
                  <VerticleProductCard product={prod} />
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-10 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
              <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
                No trending products available.
              </p>
            </div>
          )}
        </div>
      </div>

      {/* 8. Additional Dynamic Backend Sections */}
      {sections.filter((sec) => sec.products?.length > 0).map((sec, secIdx) => {
        const title =
          sec.translations?.title ||
          sec.title ||
          'Featured Section';
        const shortDesc =
          sec.translations?.short_description ||
          sec.short_description ||
          'Best quality products at great prices';

        return (
          <div
            key={sec.id || secIdx}
            className={`w-full py-12 md:py-16 transition-colors ${
              secIdx % 2 === 0
                ? 'bg-[#FFFDF0] dark:bg-slate-800/80 border-y border-[#FEF08A]/70 dark:border-slate-700'
                : 'bg-white dark:bg-slate-900'
            }`}
          >
            <div className="container mx-auto px-4">
              <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 border-b-2 border-[#0BADFB]/40 pb-0">
                <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
                  <div className="bg-[#FDD811] text-slate-900 px-6 py-2 whitespace-nowrap rounded-t-lg shadow-xs">
                    <h2 className="text-base md:text-lg font-black tracking-wide uppercase">
                      {title}
                    </h2>
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium pb-2 text-sm md:text-base">
                    {shortDesc}
                  </p>
                </div>
                <div className="pb-2">
                  <LocalizedLink
                    href="/products"
                    className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0BADFB] hover:text-[#0BADFB] transition-all shadow-2xs"
                  >
                    {t('see_all') || 'See All'} →
                  </LocalizedLink>
                </div>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                {sec.products.map((prod) => (
                  <VerticleProductCard key={prod.id} product={prod} />
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {/* 9. Shop by Brands Section */}
      {brands.length > 0 && (
        <div className="container mx-auto px-4 py-8">
          <BrandSlider brands={brands} />
        </div>
      )}
    </div>
  );
};

export default HomePage;