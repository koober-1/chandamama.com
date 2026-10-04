import { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import * as api from "@/api/apiRoutes"
import { useSelector } from 'react-redux'
import WishlistCard from '../productcards/WishlistCard'
import CardSkeleton from '../skeleton/CardSkeleton'
import NoWishListImage from "@/assets/not_found_images/Empty_Wishlist.svg"
import Image from 'next/image'

const Wishlist = () => {
    const city = useSelector(state => state.City?.city);
    const setting = useSelector(state => state.Setting?.setting);

    const effectiveLat =
        city?.latitude || setting?.default_city?.latitude || 23.242;
    const effectiveLng =
        city?.longitude || setting?.default_city?.longitude || 69.6669;

    const [wishlistProducts, setWishlistProducts] = useState([])
    const [offset, setOffset] = useState(0)
    const [loading, setLoading] = useState(false)
    const [total, setTotal] = useState(null)


    const itemPerPage = 10;

    useEffect(() => {
        handleFetchLikedProducts();
    }, [])


    const handleFetchLikedProducts = async (isAppend = false) => {
        setLoading(true)
        try {
            const response = await api.getFavorite({ latitude: effectiveLat, longitude: effectiveLng, limit: itemPerPage, offset: offset })
            if (response.status == 1) {
                setWishlistProducts(isAppend ? state => [...state, ...response.data] : response.data)
                setLoading(false)
                setTotal(response.total)
            } else {
                setLoading(false)
                setTotal(0)
            }
        } catch (error) {
            setLoading(false)
            console.log("Error", error)
        }
    }


    const handleLoadMore = () => {

        handleFetchLikedProducts(true)
        setOffset(offset => offset + itemPerPage);
    }



    return (
        <div className='w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden'>
            <div className='bg-slate-50/70 border-b border-slate-100 flex justify-between p-5 md:p-6 items-center'>
                <div>
                    <h2 className='font-bold text-xl md:text-2xl text-slate-900 tracking-tight'>{t("wishlist")}</h2>
                    <p className='text-xs text-slate-500 mt-0.5'>Saved items you love</p>
                </div>
                {total > 0 && (
                    <span className="px-3 py-1 rounded-full bg-[#e0f7fe] text-[#0BADFB] text-xs font-semibold border border-[#0BADFB]/30">
                        {total} {total === 1 ? 'item' : 'items'}
                    </span>
                )}
            </div>
            <div className="p-3 sm:p-5">
                {loading ? (
                    <div className="flex flex-col gap-3">
                        {Array?.from({ length: 4 })?.map((_, index) => {
                            return (
                                <CardSkeleton height={100} padding="3px" key={index} />
                            )
                        })}
                    </div>
                ) : wishlistProducts?.length > 0 ? (
                    <div className="divide-y divide-slate-100">
                        {wishlistProducts?.map((prdct) => {
                            return (
                                <div key={prdct?.id} className="py-2 first:pt-0 last:pb-0">
                                    <WishlistCard 
                                        product={prdct} 
                                        setWishlistProducts={setWishlistProducts} 
                                        wishlistProducts={wishlistProducts} 
                                        setTotal={setTotal} 
                                        handleFetchLikedProducts={handleFetchLikedProducts} 
                                    />
                                </div>
                            )
                        })}
                    </div>
                ) : (
                    <div className='py-16 px-4 flex items-center justify-center flex-col text-center'>
                        <div className="w-24 h-24 mb-4 opacity-80">
                            <Image 
                                src={NoWishListImage} 
                                alt='Your wishlist is Empty' 
                                height={120} 
                                width={120} 
                                unoptimized 
                                className='w-full h-full object-contain' 
                            />
                        </div>
                        <h3 className='text-lg font-bold text-slate-900'>{t("enter_wishlist_message")}</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">Explore our catalog and click the heart icon on any product to save it here.</p>
                    </div>
                )}

                {(total > wishlistProducts?.length) && (
                    <div className='flex justify-center pt-6 mt-4 border-t border-slate-100'>
                        <button 
                            onClick={handleLoadMore} 
                            className='px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.02]'
                        >
                            {t("load_more")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default Wishlist