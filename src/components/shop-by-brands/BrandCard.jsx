import React from 'react'
import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'

const BrandCard = ({ brand }) => {
    return (
        <div className="group rounded-2xl bg-white border border-slate-100 shadow-subtle hover:border-emerald-200 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 p-4 flex flex-col items-center cursor-pointer text-center w-full">
            <div className='h-24 w-24 relative rounded-xl overflow-hidden bg-slate-50/70 p-2 flex items-center justify-center'>
                <ImageWithPlaceholder 
                    src={brand?.image_url} 
                    alt={brand?.translations?.name ?? brand?.name ?? "Brand"} 
                    sizes="96px" 
                    fill 
                    className="object-contain p-1 transition-transform duration-300 group-hover:scale-105" 
                />
            </div>
            <div className="text-xs sm:text-sm font-semibold text-slate-800 text-center w-full truncate group-hover:text-emerald-700 transition-colors mt-2">
                {brand?.translations?.name ?? brand?.name}
            </div>
        </div>
    )
}

export default BrandCard