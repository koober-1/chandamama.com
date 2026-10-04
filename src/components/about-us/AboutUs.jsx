import React, { useRef } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { t } from "@/utils/translation";
import {
  setListingSource,
  setFilterCategory,
  setCategorySlug,
  setCategoryBreadcrumb,
  setFilterSearch,
} from "@/redux/slices/productFilterSlice";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { HiArrowRight } from "react-icons/hi";
import {
  ToysSvg,
  SportsSvg,
  HomeKitchenSvg,
  BabyKidsSvg,
  HouseholdSvg,
  StationerySvg,
  OutdoorCyclesSvg,
  AppliancesSvg,
  GiftsSvg,
} from "./CategoryIllustrations";
import { ShoppingPatternSvg } from "./ShoppingPatternSvg";

const AboutUs = () => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const language = useSelector((state) => state.Language.selectedLanguage);
  const shopCategories = useSelector((state) => state.Shop?.shop?.categories || []);
  const swiperRef = useRef(null);



  // 9 Recommended Multi-Category Departments for Chandamama (Small to Big products)
  const recommendedCategories = [
    {
      id: "cat_toys",
      name: "TOYS & GAMES",
      searchTerm: "toys",
      Component: ToysSvg,
    },
    {
      id: "cat_sports",
      name: "SPORTS & FITNESS",
      searchTerm: "sports",
      Component: SportsSvg,
    },
    {
      id: "cat_kitchen",
      name: "HOME & KITCHEN",
      searchTerm: "kitchen",
      Component: HomeKitchenSvg,
    },
    {
      id: "cat_baby",
      name: "BABY & KIDS",
      searchTerm: "baby",
      Component: BabyKidsSvg,
    },
    {
      id: "cat_household",
      name: "HOUSEHOLD ESSENTIALS",
      searchTerm: "household",
      Component: HouseholdSvg,
    },
    {
      id: "cat_stationery",
      name: "STATIONERY & BOOKS",
      searchTerm: "stationery",
      Component: StationerySvg,
    },
    {
      id: "cat_outdoor",
      name: "OUTDOOR & CYCLES",
      searchTerm: "cycle",
      Component: OutdoorCyclesSvg,
    },
    {
      id: "cat_appliances",
      name: "APPLIANCES & GADGETS",
      searchTerm: "appliances",
      Component: AppliancesSvg,
    },
    {
      id: "cat_gifts",
      name: "GIFTS & CELEBRATIONS",
      searchTerm: "gifts",
      Component: GiftsSvg,
    },
  ];

  const handleDepartmentClick = (dept) => {
    dispatch(setListingSource({ data: "search" }));
    dispatch(setFilterSearch({ data: dept.search }));
    router.push({
      pathname: "/products",
      query: { search: dept.search, lang: language?.code },
    });
  };

  const handleCategoryNavigate = (cat) => {
    // If matching category exists in shop API
    const matched = shopCategories.find((c) =>
      c.name?.toLowerCase().includes(cat.searchTerm.toLowerCase()) ||
      c.slug?.toLowerCase().includes(cat.searchTerm.toLowerCase())
    );

    if (matched) {
      dispatch(setListingSource({ data: "category" }));
      dispatch(setFilterCategory({ data: matched.id }));
      dispatch(setCategorySlug({ data: matched.slug }));
      dispatch(
        setCategoryBreadcrumb({
          data: [{ id: matched.id, name: matched.name, slug: matched.slug }],
        })
      );
      router.push({
        pathname: "/products",
        query: {
          category: matched.slug,
          category_id: matched.id,
          source: "category",
          lang: language?.code,
        },
      });
    } else {
      dispatch(setListingSource({ data: "search" }));
      dispatch(setFilterSearch({ data: cat.searchTerm }));
      router.push({
        pathname: "/products",
        query: { search: cat.searchTerm, lang: language?.code },
      });
    }
  };

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-900 min-h-screen pb-20 select-text">

      {/* 2. CHANDAMAMA HERO PANORAMIC BANNER WITH ALTERNATIVE IMAGE & TYPOGRAPHY */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#eef9fb] via-[#f4fbfc] to-[#f8fafc] dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border-b border-slate-200/70 dark:border-slate-800">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[360px] md:min-h-[420px]">
            {/* Left Column: Bold Typography Overlay from Reference Layout */}
            <div className="lg:col-span-6 z-20 flex flex-col justify-center space-y-3 sm:space-y-4">
              <div className="flex flex-col select-none">
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase font-sans">
                  EVERYTHING
                </span>
                <span className="text-4xl sm:text-5xl md:text-6xl lg:text-[70px] font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase font-sans mt-0.5 sm:mt-1">
                  FOR YOUR HOME
                </span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 mt-2 sm:mt-3">
                  <span className="bg-slate-900 text-white font-black text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-wider transform -rotate-3 shadow-md inline-block">
                    WITH
                  </span>
                  <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[58px] font-black text-[#0BADFB] tracking-tight leading-none uppercase font-sans">
                    CHANDAMAMA
                  </span>
                </div>
              </div>

              {/* Tagline & Quick CTA */}
              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium max-w-md pt-1">
                From small joy-filled toys and sports gear to kitchen essentials and daily household utilities — shop everything your family loves under one roof.
              </p>

              <div className="pt-2">
                <button
                  type="button"
                  onClick={() => {
                    const el = document.getElementById("discover-categories-section");
                    if (el) el.scrollIntoView({ behavior: "smooth" });
                  }}
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <span>Explore All Categories</span>
                  <HiArrowRight size={16} />
                </button>
              </div>
            </div>

            {/* Right Column: Chandamama Multi-Category Banner Image */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[300px] sm:min-h-[360px] md:min-h-[400px]">
              {/* Lifestyle Line Art Backdrop */}
              <div className="absolute inset-0 w-full h-full pointer-events-none opacity-40 dark:opacity-20 flex items-center justify-center">
                <ShoppingPatternSvg className="w-full h-full object-contain" />
              </div>

              {/* Alternative Banner Photo Card */}
              <div className="relative z-10 w-full max-w-lg aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group transform hover:-translate-y-1 transition-all duration-500">
                <Image
                  src="/banners/chandamama_banner.jpg"
                  alt="Chandamama Multi-Category E-Commerce Marketplace"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Subtle soft gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Overlay Badge at bottom of banner image */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FDD811] animate-pulse" />
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider drop-shadow-md">
                      Toys • Sports • Home Essentials
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    Small to Big Products
                  </span>
                </div>
              </div>

              {/* Floating Express Delivery Badge (Top Right) */}
              <div className="hidden sm:flex absolute -top-4 -right-2 z-20 bg-[#0BADFB] text-white p-3 rounded-2xl shadow-xl border-2 border-white dark:border-slate-800 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black tracking-widest text-[#FDD811] uppercase">
                    CHANDAMAMA
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider">
                    FAST HOME DELIVERY
                  </span>
                  <span className="text-[9px] text-white/90 font-medium">
                    Toys to daily essentials
                  </span>
                </div>
              </div>

              {/* Floating Quality Assurance Badge (Bottom Left) */}
              <div className="hidden sm:flex absolute -bottom-3 left-2 z-20 bg-white dark:bg-slate-800 text-slate-800 dark:text-white px-3.5 py-2 rounded-2xl shadow-lg border border-slate-200 dark:border-slate-700 items-center gap-2 transform -rotate-3 hover:rotate-0 transition-transform duration-300">
                <span className="text-xl">✨</span>
                <div className="flex flex-col text-left leading-none">
                  <span className="text-[11px] font-extrabold text-[#0BADFB] uppercase tracking-wide">
                    100% Genuine
                  </span>
                  <span className="text-[9px] text-slate-500 dark:text-slate-400 mt-0.5">
                    Best prices guaranteed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTENT CONTAINER: ABOUT US & RECOMMENDED CATEGORIES */}
      <div className="container mx-auto px-4 max-w-5xl my-10 sm:my-14 space-y-14 sm:space-y-16">
        {/* SECTION 1: ABOUT US */}
        <section>
          {/* Header Tab with Underline Border Matching Reference Image */}
          <div className="relative border-b-2 border-[#0BADFB]/30 dark:border-[#0BADFB]/50 mb-6 pb-0">
            <span className="inline-block bg-[#FDD811] text-slate-900 font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-6 sm:px-7 py-2 sm:py-2.5 rounded-t-xl shadow-2xs">
              {t("about_us") || "ABOUT US"}
            </span>
          </div>

          {/* Static Narrative Content - Written specifically for Chandamama */}
          <div className="space-y-4 sm:space-y-5 text-slate-700 dark:text-slate-300 text-sm sm:text-base leading-relaxed sm:leading-loose font-normal">
            <p>
              Welcome to <strong>Chandamama</strong>, your premier multi-category
              e-commerce destination where quality meets affordability.
              Established to bring happiness and convenience directly to your
              doorstep, Chandamama is a family-first marketplace that brings
              together everything you need under one roof. From charming toys,
              board games, and stationery for kids to robust sports gear, modern
              kitchenware, and daily household essentials, our extensive catalogue
              is thoughtfully curated for every home.
            </p>
            <p>
              Our mission is simple yet heartfelt: to make everyday shopping
              effortless, exciting, and accessible for everyone. We believe that
              whether you are purchasing a small toy to bring a smile to a
              child&apos;s face, gearing up for an energetic sports session, or
              upgrading your living space with handy household appliances, every
              order deserves the utmost care, authentic quality, and rapid
              delivery.
            </p>
            <p>
              At Chandamama, we cater to all ages and life stages. With thousands
              of products spanning toys, sports, kitchen essentials, baby care,
              and home utilities, we are proud to be the trusted partner in
              thousands of households. We are committed to offering competitive
              prices, certified genuine products, and exceptional customer
              support. Thank you for making Chandamama a beloved part of your
              family&apos;s everyday life.
            </p>
          </div>
        </section>

        {/* SECTION 2: DISCOVER CATEGORIES / RECOMMENDED CATEGORIES */}
        <section id="discover-categories-section">
          {/* Header Tab with Underline Border & Navigation Controls */}
          <div className="relative border-b-2 border-[#0BADFB]/30 dark:border-[#0BADFB]/50 mb-8 pb-0">
            <div className="flex items-end justify-between">
              <span className="inline-block bg-[#FDD811] text-slate-900 font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-6 sm:px-7 py-2 sm:py-2.5 rounded-t-xl shadow-2xs">
                {t("discover_categories") || "DISCOVER CATEGORIES"}
              </span>

              {/* Navigation Arrows for Desktop */}
              <div className="hidden sm:flex items-center gap-2 pb-1.5">
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slidePrev()}
                  aria-label="Previous categories"
                  className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:text-white text-slate-700 dark:text-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                >
                  <IoMdArrowBack size={16} />
                </button>
                <button
                  type="button"
                  onClick={() => swiperRef.current?.slideNext()}
                  aria-label="Next categories"
                  className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:text-white text-slate-700 dark:text-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer"
                >
                  <IoMdArrowForward size={16} />
                </button>
              </div>
            </div>
          </div>

          {/* 9 Category Cards Carousel matching the 5 cards view + 9 dots */}
          <div className="relative">
            <Swiper
              modules={[Navigation, Pagination, Autoplay]}
              onSwiper={(swiper) => {
                swiperRef.current = swiper;
              }}
              slidesPerView={1.6}
              spaceBetween={14}
              breakpoints={{
                480: { slidesPerView: 2.3, spaceBetween: 16 },
                640: { slidesPerView: 3.2, spaceBetween: 18 },
                768: { slidesPerView: 4, spaceBetween: 20 },
                1024: { slidesPerView: 5, spaceBetween: 20 },
              }}
              pagination={{
                clickable: true,
                el: ".about-categories-pagination",
                bulletClass: "about-cat-bullet",
                bulletActiveClass: "about-cat-bullet-active",
              }}
              autoplay={{
                delay: 4500,
                disableOnInteraction: false,
                pauseOnMouseEnter: true,
              }}
              className="w-full pb-2"
            >
              {recommendedCategories.map((category) => {
                const SvgComponent = category.Component;
                return (
                  <SwiperSlide key={category.id} className="h-auto">
                    <div
                      onClick={() => handleCategoryNavigate(category)}
                      className="group flex flex-col items-center cursor-pointer w-full text-center select-none"
                    >
                      {/* Pastel Card Container matching the reference image */}
                      <div className="w-full aspect-square rounded-2xl sm:rounded-3xl bg-[#e0f7fe] dark:bg-slate-800/95 border border-[#bae6fd] dark:border-slate-700 p-3 sm:p-5 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg relative overflow-hidden group-hover:bg-[#bae6fd] dark:group-hover:bg-slate-800">
                        {/* Interior artwork */}
                        <div className="w-full h-full relative flex items-center justify-center">
                          <SvgComponent className="w-full h-full max-w-[130px] max-h-[130px] object-contain group-hover:scale-105 transition-transform duration-300" />
                        </div>
                      </div>

                      {/* Category Label Underneath Card with Arrow */}
                      <div className="flex items-center justify-center gap-1.5 mt-3 group-hover:text-[#0BADFB] transition-colors">
                        <span className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                          {category.name}
                        </span>
                        <span className="text-xs sm:text-sm font-bold group-hover:translate-x-1 transition-transform duration-200">
                          →
                        </span>
                      </div>
                    </div>
                  </SwiperSlide>
                );
              })}
            </Swiper>

            {/* Pagination Dots */}
            <div className="about-categories-pagination flex items-center justify-center gap-2 mt-8" />
          </div>
        </section>
      </div>

      {/* Scoped CSS for Swiper pagination bullets */}
      <style jsx global>{`
        .about-cat-bullet {
          width: 8px;
          height: 8px;
          border-radius: 9999px;
          background-color: #cbd5e1;
          display: inline-block;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          margin: 0 4px;
        }
        .about-cat-bullet-active {
          background-color: #0BADFB !important;
          width: 9px;
          height: 9px;
          transform: scale(1.15);
        }
        .dark .about-cat-bullet {
          background-color: #475569;
        }
        .dark .about-cat-bullet-active {
          background-color: #0BADFB !important;
        }
      `}</style>
    </div>
  );
};

export default AboutUs;
