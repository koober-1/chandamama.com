import Image from 'next/image'

import React, { useEffect, useState } from 'react'
import { IoMdArrowBack, IoMdArrowForward } from 'react-icons/io'

import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";
import VerticleProductCard from '../productcards/VerticleProductCard';
import { useSelector, useDispatch } from 'react-redux'
import { t } from '@/utils/translation'
import { setFilterSection, setListingSource, } from '@/redux/slices/productFilterSlice';
import { useRouter } from 'next/navigation'
import { isRtl } from '@/lib/utils'
import HomeOfferSection from './HomeOfferSection';

const ProductSwiperWithImage = ({ section }) => {
    const router = useRouter();
    const rtl = isRtl()
    const dispatch = useDispatch();
    const language = useSelector(state => state.Language.selectedLanguage)
    const theme = useSelector(state => state.Theme.theme)
    const shop = useSelector(state => state.Shop.shop);
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
        router.push('/products')
    }

    return (
        <div className="py-6 md:py-10">
            {section?.products?.length > 0 ? <section className='transition-colors' style={theme == "light" ? { backgroundColor: section?.background_color_for_light_theme || 'transparent' } : { backgroundColor: section?.background_color_for_dark_theme || 'transparent' }}>
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
                        <div className='grid grid-cols-1 mt-6 md:grid-cols-12 gap-5 items-stretch'>
                            {/* Image Section */}
                            <div className='md:col-span-3'>
                                <div className='w-full h-full min-h-[300px] relative rounded-2xl overflow-hidden shadow-card border border-slate-100 bg-slate-50'>
                                    <Image src={section?.banner_web_url} fill sizes="(max-width: 768px) 100vw, 320px" priority={true} quality={85} alt='Section Banner' className='object-cover' />
                                </div>
                            </div>
                            {/* Swiper Section */}
                            <div className='md:col-span-9'>
                                <Swiper
                                    key={rtl}
                                    spaceBetween={16}
                                    modules={[Navigation]}
                                    navigation={
                                        {
                                            prevEl: `.prev-btn-${section?.id}`,
                                            nextEl: `.next-btn-${section?.id}`
                                        }
                                    }
                                    className="brand-swiper"
                                    breakpoints={{
                                        1200: {
                                            slidesPerView: 3,
                                            spaceBetween: 16
                                        },
                                        1024: {
                                            slidesPerView: 2.8,
                                            spaceBetween: 14
                                        },
                                        768: {
                                            slidesPerView: 2,
                                            spaceBetween: 12
                                        },
                                        500: {
                                            slidesPerView: 2,
                                            spaceBetween: 10
                                        },
                                        300: {
                                            slidesPerView: 1.3,
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
                </div>
            </section> : null}
            {promotionImage && promotionImage?.map((offer, index) => {
                return (
                    <div className='container mb-6' key={index}>
                        <div div className='relative' key={offer?.id}>
                            <HomeOfferSection offer={offer} />
                        </div>
                    </div>
                )
            })}
        </div>


    )
}

export default ProductSwiperWithImage