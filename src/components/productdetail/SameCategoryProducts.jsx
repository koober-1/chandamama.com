"use client";
import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from "@/utils/translation";
import VerticleProductCard from "../productcards/VerticleProductCard";
import * as api from "@/api/apiRoutes";
import { useSelector } from "react-redux";
import { isRtl } from "@/lib/utils";
import { IoMdArrowBack, IoMdArrowForward } from "react-icons/io";
import CardSkeleton from "../skeleton/CardSkeleton";

const SameCategoryProducts = ({ categoryId, currentProductId, categoryName }) => {
  const rtl = isRtl();
  const city = useSelector((state) => state.City?.city);
  const setting = useSelector((state) => state.Setting?.setting);
  const language = useSelector((state) => state.Language.selectedLanguage);

  const effectiveLat =
    city?.latitude || setting?.default_city?.latitude || 23.242;
  const effectiveLng =
    city?.longitude || setting?.default_city?.longitude || 69.6669;

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (categoryId) {
      fetchSameCategoryProducts();
    } else {
      setLoading(false);
    }
  }, [categoryId, currentProductId, effectiveLat, effectiveLng]);

  const fetchSameCategoryProducts = async () => {
    setLoading(true);
    try {
      const response = await api.getProductByFilter({
        latitude: effectiveLat,
        longitude: effectiveLng,
        filters: {
          category_ids: String(categoryId),
          limit: 12,
        },
      });

      if (response?.data && Array.isArray(response.data)) {
        // Filter out current product
        const filtered = response.data.filter(
          (item) => String(item.id) !== String(currentProductId)
        );
        setProducts(filtered);
      } else {
        setProducts([]);
      }
    } catch (error) {
      console.error("Error fetching same category products:", error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  if (!loading && products.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#FFFDF0] dark:bg-slate-800/80 rounded-3xl border border-[#FEF08A]/70 dark:border-slate-700 p-6 md:p-8 my-8 transition-colors">
      <div className="flex flex-col md:flex-row items-start md:items-end justify-between gap-4 mb-8 border-b-2 border-[#0BADFB]/40 pb-0">
        <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
          <div className="bg-[#FDD811] text-slate-900 px-6 py-2 whitespace-nowrap rounded-t-lg shadow-xs">
            <h2 className="text-base md:text-lg font-black tracking-wide uppercase">
              RECOMMENDED PRODUCTS
            </h2>
          </div>
          <p className="text-slate-700 dark:text-slate-300 font-medium pb-2 text-sm md:text-base">
            {categoryName
              ? `More top choices from "${categoryName}" category!`
              : "Best quality products at great prices, directly delivered!"}
          </p>
        </div>

        {/* Swiper Navigation Arrows */}
        <div className="flex items-center gap-2 pb-2">
          <button
            type="button"
            className="same-cat-prev-btn w-9 h-9 rounded-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-[#0BADFB] text-slate-700 dark:text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            aria-label="Previous"
          >
            <IoMdArrowBack size={18} />
          </button>
          <button
            type="button"
            className="same-cat-next-btn w-9 h-9 rounded-full bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 hover:bg-[#0BADFB] text-slate-700 dark:text-slate-200 hover:text-white flex items-center justify-center transition-all cursor-pointer shadow-2xs"
            aria-label="Next"
          >
            <IoMdArrowForward size={18} />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
          {Array.from({ length: 4 }).map((_, idx) => (
            <CardSkeleton key={idx} height={320} />
          ))}
        </div>
      ) : (
        <Swiper
          key={rtl}
          spaceBetween={16}
          modules={[Navigation]}
          navigation={{
            prevEl: ".same-cat-prev-btn",
            nextEl: ".same-cat-next-btn",
          }}
          breakpoints={{
            1280: { slidesPerView: 4, spaceBetween: 20 },
            1024: { slidesPerView: 3.5, spaceBetween: 18 },
            768: { slidesPerView: 2.8, spaceBetween: 16 },
            480: { slidesPerView: 2, spaceBetween: 14 },
            0: { slidesPerView: 1.2, spaceBetween: 10 },
          }}
          className="pb-2"
        >
          {products.map((item) => (
            <SwiperSlide key={item.id}>
              <VerticleProductCard product={item} />
            </SwiperSlide>
          ))}
        </Swiper>
      )}
    </section>
  );
};

export default SameCategoryProducts;
