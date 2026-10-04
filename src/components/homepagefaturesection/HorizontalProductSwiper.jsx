import React, { useEffect, useState } from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import VerticleProductCard from '../productcards/VerticleProductCard';
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setFilterSection, setListingSource, } from '@/redux/slices/productFilterSlice';

import { useRouter } from 'next/router';
import { t } from '@/utils/translation';
import { isRtl } from '@/lib/utils';
import HomeOfferSection from './HomeOfferSection';

const HorizontalProductSwiper = ({ section, index }) => {
    const router = useRouter();
    const dispatch = useDispatch();
    const rtl = isRtl()
    const shop = useSelector(state => state.Shop.shop);
    const theme = useSelector(state => state.Theme.theme)
    const language = useSelector(state => state.Language.selectedLanguage)
    const [promotionImage, setPromotionImage] = useState(null)
    useEffect(() => {
        const promotionImageBelowSection = shop?.offers?.filter((offer) => offer?.position == "below_section");
        const image = promotionImageBelowSection?.filter((offer) => {
            return offer?.section?.id == section?.id
        })
        setPromotionImage(image)
    }, [section])

    const handleViewAll = () => {
        dispatch(setFilterSection({ data: section?.id }))
        dispatch(setListingSource({ data: "all" }));
        router.push("/products")
    }

    const isBestSeller = (section?.title || "").toLowerCase().includes("best") || (section?.title || "").toLowerCase().includes("seller");
    const bgLight = section?.background_color_for_light_theme || (isBestSeller ? '#FFFE7D' : 'transparent');
    const bgDark = section?.background_color_for_dark_theme || (isBestSeller ? '#0f172a' : 'transparent');
    const hasCustomBg = bgLight !== 'transparent';

    return (
        <div className={`py-4 md:py-6 transition-colors ${hasCustomBg ? 'py-8 md:py-12 my-6' : ''}`} style={theme == "light" ? { backgroundColor: bgLight } : { backgroundColor: bgDark }}>
            {
                section?.products?.length > 0 ?
                    <section className='w-full'>

                        <div className='container mx-auto px-4 feature-section'>
                            <div dir={language?.type}>
                                {/* CHANDAMAMA Official Section Header */}
                                <div className="relative border-b-2 border-[#0BADFB]/30 dark:border-[#0BADFB]/40 mb-8 pb-0">
                                    <div className="flex flex-wrap items-end justify-between gap-4">
                                        <div className="flex flex-wrap items-baseline gap-3 md:gap-4">
                                            <span className="inline-block bg-[#FDD811] text-slate-900 font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-5 sm:px-6 py-2 sm:py-2.5 rounded-t-xl shadow-2xs">
                                                {section?.translations?.title || section?.title}
                                            </span>
                                            {section?.translations?.short_description && (
                                                <span className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm font-medium pb-2">
                                                    {section?.translations?.short_description}
                                                </span>
                                            )}
                                        </div>

                                        <div className="flex items-center gap-3 pb-2">
                                            <button 
                                                onClick={handleViewAll} 
                                                className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0BADFB] hover:text-[#0BADFB] transition-all shadow-2xs cursor-pointer"
                                            >
                                                {t("see_all")}
                                                <span className="text-xs">→</span>
                                            </button>
                                            <div className={`hidden md:flex items-center gap-1.5 ${language?.type == "RTL" ? "flex-row-reverse" : ""}`} >
                                                <button 
                                                    className={`w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:text-white text-slate-700 dark:text-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer prev-btn-${section?.id}`}
                                                    aria-label="Previous"
                                                >
                                                    <IoMdArrowBack size={16} />
                                                </button>
                                                <button 
                                                    className={`w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:text-white text-slate-700 dark:text-slate-200 shadow-2xs flex items-center justify-center transition-all cursor-pointer next-btn-${section?.id}`}
                                                    aria-label="Next"
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
                                        className="brand-swiper"
                                        navigation={
                                            {
                                                prevEl: `.prev-btn-${section?.id}`,
                                                nextEl: `.next-btn-${section?.id}`
                                            }
                                        }
                                        breakpoints={{

                                            1200: {
                                                slidesPerView: 5,
                                                spaceBetween: 10
                                            },
                                            1024: {
                                                slidesPerView: 4.5,
                                                spaceBetween: 10
                                            },
                                            768: {
                                                slidesPerView: 3.3,
                                                spaceBetween: 10
                                            },
                                            500: {
                                                slidesPerView: 2,
                                                spaceBetween: 10
                                            },
                                            300: {
                                                slidesPerView: 1.5,
                                                spaceBetween: 10
                                            },
                                        }}
                                    >
                                        {section?.products?.map((product, index) => (
                                            <SwiperSlide key={product.id} className='h-auto'>
                                                <VerticleProductCard product={product} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        </div>
                    </section>
                    : null
            }
            {promotionImage && promotionImage?.map((offer) => {
                return (
                    <div className='container mb-6' key={offer?.id}>
                        <div className='relative' >
                            <HomeOfferSection offer={offer} />
                        </div>
                    </div>
                )
            })}
        </div>


    )
}

export default HorizontalProductSwiper