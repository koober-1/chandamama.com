import React from "react";
import { useEffect } from "react";
import CategoryCard from "./CategoryCard";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/navigation";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import { t } from "@/utils/translation";
import { LocalizedLink } from "@/utils/localizedNav";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { useDispatch, useSelector } from "react-redux";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import {
  setListingSource,
  setCategorySlug,
  setCategoryBreadcrumb,
} from "@/redux/slices/productFilterSlice";
import { isRtl } from "@/lib/utils";

const CategoriesContainer = ({ categories }) => {
  const rtl = isRtl();
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const selectedCategories = useSelector(
    (state) => state.ProductFilter?.selectedCategories,
  );
  const language = useSelector((state) => state.Language.selectedLanguage);
  // const handleCategoryClick = (category) => {
  //     dispatch(setSelectedCategories({ data: category?.id }))
  //     dispatch(setSelectedCategories({ data: category?.id }));
  //     if (category?.has_child) {
  //         router.push(`/categories/${category?.slug}`)
  //     } else {
  //         const cats = [...selectedCategories, category?.id];
  //         dispatch(setFilterCategory({ data: cats.join(",") }))
  //         router.push(`/products`)
  //     }
  // }
  const categoryBreadcrumb = useSelector(
    (state) => state.ProductFilter.categoryBreadcrumb,
  );
  const handleCategoryClick = (category) => {
    const exists = categoryBreadcrumb.find((c) => c.id === category.id);

    const newBreadcrumb = exists
      ? categoryBreadcrumb
      : [
          ...categoryBreadcrumb,
          {
            id: category.id,
            name: category.translations?.name || category.name,
            slug: category.slug,
          },
        ];

    dispatch(setListingSource({ data: "category" }));
    dispatch(setFilterCategory({ data: category.id }));
    dispatch(setCategorySlug({ data: category.slug }));
    dispatch(setCategoryBreadcrumb({ data: newBreadcrumb }));

    router.push({
      pathname: "/products",
      query: {
        category: category.slug,
        category_id: category.id,
        source: "category",
        lang: language?.code,
      },
    });
  };
  useEffect(() => {
    dispatch(setCategoryBreadcrumb({ data: [] }));
  }, [dispatch]);
  return (
    <section className="py-6 md:py-10">
      <div className="container mx-auto px-4 feature-section" dir={language?.type}>
        {/* CHANDAMAMA Official Section Header */}
        <div className="relative border-b-2 border-[#0BADFB]/30 dark:border-[#0BADFB]/40 mb-8 pb-0">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
              <span className="inline-block bg-[#FDD811] text-slate-900 font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-5 sm:px-6 py-2 sm:py-2.5 rounded-t-xl shadow-2xs">
                {t("discover_categories") || `${t("shop_by")} ${t("categories")}`}
              </span>
              <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium pb-2">
                {t("all_your_needs_in_one_place") || "All your stationery needs in one place!"}
              </span>
            </div>

            <div className="flex items-center gap-3 pb-2">
              <LocalizedLink
                className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0BADFB] hover:text-[#0BADFB] transition-all shadow-2xs"
                href="/categories/all"
              >
                {t("see_all")}
                <span className="text-xs">→</span>
              </LocalizedLink>
              <div className={`hidden md:flex items-center gap-1.5 ${language?.type == "RTL" ? "flex-row-reverse" : ""}`}>
                <button 
                  className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:text-white text-slate-700 dark:text-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer category-button-next"
                  aria-label="Previous categories"
                >
                  <IoMdArrowBack size={16} />
                </button>
                <button 
                  className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:text-white text-slate-700 dark:text-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer category-button-prev"
                  aria-label="Next categories"
                >
                  <IoMdArrowForward size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6">
          <Swiper
            key={rtl}
            modules={[Navigation]}
            spaceBetween={20}
            slidesPerView={1.5}
            navigation={{
              nextEl: ".category-button-prev",
              prevEl: ".category-button-next",
            }}
            breakpoints={{
              0: { slidesPerView: 1.5 },
              320: { slidesPerView: 2 },
              375: { slidesPerView: 2.5 },
              425: { slidesPerView: 3 },
              768: { slidesPerView: 4 },
              1024: { slidesPerView: 6 },
            }}
          >
            {categories?.categories?.map((category, index) => {
              return (
                <SwiperSlide
                  key={index}
                  onClick={() => handleCategoryClick(category)}
                >
                  <CategoryCard
                    category={category}
                    imageSize={122}
                    padding={16}
                  />
                </SwiperSlide>
              );
            })}
          </Swiper>
        </div>
      </div>
    </section>
  );
};

export default CategoriesContainer;
