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
    <section>
      <div className="container feature-section" dir={language?.type}>
        <div className="flex justify-between items-start p-0 w-full mb-0 md:mb-3">
          <div className="textColor text-xl sm:text-3xl font-extrabold !tracking-wide leading-[29px] m-0">
            <p>
              {t("shop_by")} {t("categories")}
            </p>
          </div>

          <div className=" items-center flex">
            {/* {categories?.categoriess?.length > 5 ? ( */}
            <div className="flex justify-center items-center gap-4 flex-col-reverse md:flex-row">
              <LocalizedLink
                className="text-nowrap SecondaryTextColor  hover:primaryColor"
                href="/categories/all"
              >
                {t("see_all")}
              </LocalizedLink>
              <div
                className={` flex  gap-2 ${language?.type == "RTL" ? "flex-row-reverse" : ""}`}
              >
                <button className=" group category-button-next swiperBorderColor rounded-full  !p-2 inline-block text-[15px] relative right-[5%] top-0 transition-all duration-200 ease-linear visibility-visible z-10 hover:primaryBackColor hover:text-white hover:primaryBorder">
                  <IoMdArrowBack
                    className="swiperNavButtonColor group-hover:text-white transition-colors duration-200"
                    size={20}
                  />
                </button>
                <button className=" group category-button-prev swiperBorderColor rounded-full   !p-2 inline-block text-[15px] relative right-[5%] top-0 transition-all duration-200 ease-linear visibility-visible z-10 hover:primaryBackColor hover:text-white hover:primaryBorder">
                  <IoMdArrowForward
                    className="swiperNavButtonColor group-hover:text-white transition-colors duration-200"
                    size={20}
                  />
                </button>
              </div>
            </div>
            {/* ) : null} */}
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
