import React from 'react'
import PayPalLogo from "@/assets/payment_methods_svgs/ic_paypal.svg"
import Image from 'next/image'
import { t } from "@/utils/translation"
import { formatCustomDate } from "@/lib/utils"

import CashfreeImage from "@/assets/payment_methods_svgs/ic_cashfree.svg";
import RazorpayImage from "@/assets/payment_methods_svgs/ic_razorpay.svg";
import PaypalImage from "@/assets/payment_methods_svgs/ic_paypal.svg";
import PaystackImage from "@/assets/payment_methods_svgs/ic_paystack.svg";
import StriperImage from "@/assets/payment_methods_svgs/ic_stripe.svg";
import MidtransImage from "@/assets/payment_methods_svgs/Midtrans.svg";
import PhonePeImage from "@/assets/payment_methods_svgs/Phonepe.svg";
import PaytabsImage from "@/assets/payment_methods_svgs/ic_paytabs.svg";
import DpoImage from "@/assets/payment_methods_svgs/ic_dpo_full.svg";
import { useSelector } from 'react-redux'


const TransactionCard = ({ transaction }) => {

    const setting = useSelector(state => state.Setting.setting)

    const paymentMethodsConfig = {
        Razorpay: RazorpayImage,
        Paypal: PaypalImage,
        Paystack: PaystackImage,
        Stripe: StriperImage,
        Cashfree: CashfreeImage,
        Midtrans: MidtransImage,
        PhonePe: PhonePeImage,
        Paytabs: PaytabsImage,
        DPO: DpoImage
    };
    
    return (
        <div className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-card transition-all overflow-hidden flex flex-col justify-between">
            {/* Header: Transaction ID and Date */}
            <div className="flex justify-between items-center text-xs p-4 bg-slate-50/70 border-b border-slate-100">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("transaction")}</p>
                    <p className="font-bold text-slate-800">#{transaction?.id}</p>
                </div>
                <div className="text-right">
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("date")}</p>
                    <p className="font-semibold text-slate-700">{transaction?.created_at}</p>
                </div>
            </div>

            {/* Payment Method */}
            <div className="flex items-center gap-3 p-4 flex-1">
                <div className='w-12 h-12 p-1.5 rounded-xl border border-slate-100 bg-slate-50 flex items-center justify-center shrink-0'>
                    {paymentMethodsConfig[transaction?.type] ? (
                        <Image
                            src={paymentMethodsConfig[transaction?.type]}
                            alt={transaction?.type || "Payment Method"}
                            className="h-full w-full object-contain"
                            height={40}
                            width={40}
                            unoptimized
                        />
                    ) : (
                        <span className="text-xs font-bold text-slate-500 uppercase">{transaction?.type?.slice(0, 3)}</span>
                    )}
                </div>
                
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("payment_method")}</p>
                    <p className="font-bold text-sm text-slate-800 capitalize">{transaction?.type}</p>
                </div>
            </div>

            {/* Transaction Amount Section */}
            <div className="p-4 bg-slate-50/40 border-t border-slate-100 flex justify-between items-center">
                <div>
                    <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                        {t("transaction")} {t("amount")}
                    </p>
                    <p className="text-lg md:text-xl font-bold text-slate-900">
                        {setting?.currency}
                        {transaction?.amount?.toFixed(setting?.decimal_point ? setting?.decimal_point : 0)}
                    </p>
                </div>
                <div>
                    {transaction?.status == "success" ? (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-[#e0f7fe] text-[#0BADFB] border border-[#0BADFB]/30 inline-flex items-center">
                            {t("success")}
                        </span>
                    ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200/60 inline-flex items-center">
                            {t("failed")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    )
}

export default TransactionCard