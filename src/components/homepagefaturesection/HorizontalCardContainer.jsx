import React, { useEffect, useState } from 'react'
import HorizontalProductCard from '../productcards/HorizontalProductCard'
import { useSelector } from 'react-redux';
import Image from 'next/image';
import { useDispatch } from 'react-redux';
import { setFilterSection, setListingSource, } from '@/redux/slices/productFilterSlice';
import { t } from '@/utils/translation';
import { useRouter } from 'next/navigation';
import HomeOfferSection from './HomeOfferSection';
const HorizontalCardContainer = ({ section }) => {

    const router = useRouter();
    const dispatch = useDispatch();
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
        <section className="py-6 md:py-10 transition-colors" style={theme == "light" ? { backgroundColor: section?.background_color_for_light_theme || 'transparent' } : { backgroundColor: section?.background_color_for_dark_theme || 'transparent' }}>
            {section?.products?.length > 0 ? <div className='container mx-auto px-4 feature-section'>
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

                        <div className="pb-2">
                            <button 
                                onClick={handleViewAll} 
                                className="flex items-center gap-1 px-4 py-1.5 rounded-full border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:border-[#0BADFB] hover:text-[#0BADFB] transition-all shadow-2xs cursor-pointer"
                            >
                                {t("see_all")}
                                <span className="text-xs">→</span>
                            </button>
                        </div>
                    </div>
                </div>
                <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mt-6 gap-4 md:gap-5'>
                    {section?.products?.slice(0, 6)?.map((product, index) => {
                        return (
                            <div key={product?.id || index}>
                                <HorizontalProductCard product={product} />
                            </div>
                        )
                    })}
                </div>
            </div> : null}
            <div className='container'>
                {promotionImage && promotionImage?.map((offer) => {
                    return (
                        <div className='relative w-full' key={offer?.id}>
                            <HomeOfferSection offer={offer} />
                        </div>
                    )
                })}
            </div>
        </section>
    )
}

export default HorizontalCardContainer