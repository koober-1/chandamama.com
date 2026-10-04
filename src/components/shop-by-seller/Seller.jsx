import ImageWithPlaceholder from '../image-with-placeholder/ImageWithPlaceholder';
import { isRtl } from '@/lib/utils';

const Seller = ({ seller }) => {
    const rtl = isRtl();
    return (
        <div className="group relative flex items-center bg-white border border-slate-100 shadow-subtle hover:border-emerald-200 hover:shadow-card-hover transition-all duration-300 hover:-translate-y-1 p-3.5 rounded-2xl cursor-pointer overflow-hidden">
            <div className='flex items-center gap-3.5 w-full'>
                <div className='relative h-16 w-16 rounded-xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0 flex items-center justify-center p-1'>
                    <ImageWithPlaceholder
                        src={seller?.logo_url}
                        alt={seller?.translations?.name || seller?.name || seller?.store_name || "Seller"}
                        fill
                        sizes="64px"
                        className='object-contain transition-transform duration-300 group-hover:scale-105'
                    />
                </div>

                <div className="flex flex-col flex-1 min-w-0">
                    <span className="text-xs text-slate-400 font-medium">Store</span>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-emerald-700 transition-colors truncate">
                        {seller?.translations?.name || seller?.name || seller?.store_name || "Seller"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Seller;