import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder'

const Country = ({ country }) => {
    return (
        <div className='group rounded-2xl bg-white border border-slate-100 shadow-subtle hover:border-emerald-200 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 p-3.5 flex flex-col items-center cursor-pointer text-center w-full'>
            <div className='relative w-20 h-20 rounded-xl overflow-hidden bg-slate-50/70 p-2 flex items-center justify-center'>
                <ImageWithPlaceholder
                    src={`${process.env.NEXT_PUBLIC_API_URL}/storage/${country.logo}`}
                    alt={country?.translations?.name ?? country?.name ?? "Country"}
                    className='object-contain w-full h-full transition-transform duration-300 group-hover:scale-105'
                    sizes="(max-width: 480px) 100vw, 80px"
                />
            </div>
            <div className='w-full text-xs sm:text-sm font-semibold text-slate-800 text-center truncate group-hover:text-emerald-700 transition-colors mt-2'>
                {country?.translations?.name ?? country?.name}
            </div>
        </div>
    )
}

export default Country