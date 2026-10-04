import { setFilterSearch, setProductBySearch } from '@/redux/slices/productFilterSlice'
import Link from 'next/link'
import React from 'react'
import { useDispatch, useSelector } from 'react-redux'
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'

const SearchProductCard = ({ product }) => {
    const dispatch = useDispatch()
    const setting = useSelector(state => state.Setting?.setting)

    const handleSearchProductClick = () => {
        dispatch(setProductBySearch({ data: [] }))
        dispatch(setFilterSearch({ data: "" }))
    }
    return (
        <Link href={`/product/${product?.slug}`} onClick={() => handleSearchProductClick()} className="w-full">
            <div className="flex items-center gap-3 px-4 py-2.5 hover:bg-[#8fe5ef]/15 dark:hover:bg-slate-700/60 border-b border-slate-100 dark:border-slate-700/60 transition-colors">
                <div className="w-10 h-10 flex-shrink-0 bg-slate-50 dark:bg-slate-900 rounded-lg p-1 border border-slate-200/80 dark:border-slate-700 flex items-center justify-center">
                    <ImageWithPlaceholder src={product?.image_url} width={80} height={80} className="w-full h-full object-contain rounded" alt={product?.name || "product"} />
                </div>
                <div className="flex flex-col min-w-0 flex-1">
                    <div className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-100 truncate group-hover:text-[#0BADFB]">{product?.translations?.name || product?.name}</div>
                    <div className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                        {
                            product?.discounted_price && product?.discounted_price !== product?.price ?
                                <div className="flex items-baseline gap-1.5">
                                    <span className="text-slate-900 dark:text-white font-bold">{setting?.currency}{product?.discounted_price}</span>
                                    <span className='line-through text-slate-400 text-[11px]'>{setting?.currency}{product?.price}</span>
                                </div> :
                                <div className="text-slate-900 dark:text-white font-bold">{setting?.currency}{product?.price}</div>
                        }
                    </div>
                </div>
            </div>
        </Link>
    )
}

export default SearchProductCard
