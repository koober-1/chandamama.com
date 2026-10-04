import Link from 'next/link'
import React from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import Seller from './Seller'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import { t } from '@/utils/translation';
import { useRouter } from 'next/router';
import { useDispatch } from 'react-redux';
import { setFilterBySeller, setListingSource } from '@/redux/slices/productFilterSlice';
import { useSelector } from 'react-redux';
import { isRtl } from '@/lib/utils';


const SellerSlider = ({ sellers }) => {
    const rtl = isRtl();
    const language = useSelector(state => state.Language.selectedLanguage)
    const router = useRouter();
    const dispatch = useDispatch();

    const handleSellerClick = (seller) => {
        dispatch(setFilterBySeller({ data: seller?.id }));
        dispatch(setListingSource({ data: "all" }));
        router.push("/products")
    }

    return (
        <section className='py-6 md:py-10 bg-slate-50/50'>
            <div className='container mx-auto px-4 feature-section'>
                <div className='flex flex-col gap-3' dir={language?.type}>
                    {/* CHANDAMAMA Official Section Header */}
                    <div className="relative border-b-2 border-[#0BADFB]/30 dark:border-[#0BADFB]/40 mb-8 pb-0">
                        <div className="flex flex-wrap items-end justify-between gap-4">
                            <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
                                <span className="inline-block bg-[#FDD811] text-slate-900 font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-5 sm:px-6 py-2 sm:py-2.5 rounded-t-xl shadow-2xs">
                                    {t("shop_by")} {t("sellers")}
                                </span>
                                <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium pb-2">
                                    {t("shop_from_top_rated_sellers") || "Top-rated verified vendors & stores"}
                                </span>
                            </div>

                            <div className="flex items-center gap-3 pb-2">
                                <Link 
                                    href={"/sellers"} 
                                    className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0BADFB] hover:text-[#0BADFB] transition-all shadow-2xs cursor-pointer"
                                >
                                    {t("see_all")}
                                    <span className="text-xs">→</span>
                                </Link>
                                <div className={`hidden md:flex items-center gap-1.5 ${language?.type == "RTL" ? "flex-row-reverse" : ""}`}>
                                    <button 
                                        className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:text-white text-slate-700 dark:text-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer seller-slider-prev"
                                        aria-label="Previous sellers"
                                    >
                                        <IoMdArrowBack size={16} />
                                    </button>
                                    <button 
                                        className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:text-white text-slate-700 dark:text-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer seller-slider-next"
                                        aria-label="Next sellers"
                                    >
                                        <IoMdArrowForward size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='mt-6'>
                        <Swiper
                            key={rtl}
                            spaceBetween={20}
                            modules={[Navigation]}
                            navigation={{
                                prevEl: ".seller-slider-prev",
                                nextEl: ".seller-slider-next"
                            }}
                            className="brand-swiper"
                            breakpoints={{
                                0: { slidesPerView: 1.2, spaceBetween: 10 },
                                320: { slidesPerView: 1.2, spaceBetween: 10 },
                                375: { slidesPerView: 1.5, spaceBetween: 12 },
                                640: { slidesPerView: 3, spaceBetween: 15 },
                                1024: { slidesPerView: 4, spaceBetween: 20 },
                            }}
                        >
                            {sellers?.sellers?.map((seller, index) => (
                                <SwiperSlide key={seller.id} onClick={() => handleSellerClick(seller)} >
                                    <Seller seller={seller} />
                                </SwiperSlide>
                            ))}
                        </Swiper>
                    </div>
                </div>

            </div>
        </section>
    )
}

export default SellerSlider;