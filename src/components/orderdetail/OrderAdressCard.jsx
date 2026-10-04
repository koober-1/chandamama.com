import { t } from '@/utils/translation'
import React from 'react'
import { IoLocationOutline } from 'react-icons/io5'
import { FiPhoneCall } from 'react-icons/fi'

const OrderAdressCard = ({ orderDetail }) => {
    return (
        <div className="p-6">
            <div className='flex items-center gap-3 pb-3 border-b border-slate-100'>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                    <IoLocationOutline size={22} />
                </div>
                <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("deliver_to")}</span>
                    <h4 className="text-base font-bold text-slate-900">{orderDetail?.user_name}</h4>
                </div>
            </div>
            <p className="py-3 text-sm text-slate-600 leading-relaxed">
                {orderDetail?.order_address}
            </p>
            <div className="flex items-center gap-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                <FiPhoneCall size={14} className="text-emerald-600" />
                <span>{t("phone")}: {orderDetail?.order_mobile}</span>
            </div>
        </div>
    )
}

export default OrderAdressCard