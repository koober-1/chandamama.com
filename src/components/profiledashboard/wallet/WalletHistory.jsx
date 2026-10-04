import React, { useEffect, useState } from 'react'
import { t } from "@/utils/translation"
import WalletTransactionCard from './WalletTransactionCard'
import * as api from "@/api/apiRoutes"
import CardSkeleton from '@/components/skeleton/CardSkeleton'
import NoTransactionFound from "@/assets/not_found_images/No_Transaction.svg"
import Image from 'next/image'


const WalletHistory = () => {

    const [transactions, setTransactions] = useState([])
    const [offset, setOffset] = useState(0)
    const [total, setTotal] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)
    useEffect(() => {
        fetchWalletTransaction(false, 0);
    }, [])

    const transactionPerPage = 9;

    const fetchWalletTransaction = async (isLoadMore = false, newOffset) => {
        if (isLoadMore) {
            setLoadingMore(true)
        } else {
            setLoading(true)
        }
        try {
            const response = await api.getUserTransactions({ limit: transactionPerPage, offset: newOffset, type: 'wallet' })
            if (response.status == 1) {
                setTransactions((trnscn) => [...trnscn, ...response.data])
                setTotal(response?.total)
                setLoading(false)
                setLoadingMore(false)
            } else {
                setTransactions([])
                setTotal(0)
                setLoading(false)
                setLoadingMore(false)
            }

        } catch (error) {
            setLoading(false)
            setLoadingMore(false)
            console.log("Error", error)
        }
    }

    const handleFetchMore = async () => {
        const newOffset = offset + transactionPerPage
        setOffset(newOffset)
        fetchWalletTransaction(true, newOffset)
    }

    return (
        <div className='w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden'>
            <div className='bg-slate-50/70 border-b border-slate-100 flex justify-between p-5 md:p-6 items-center'>
                <div>
                    <h2 className='font-bold text-xl md:text-2xl text-slate-900 tracking-tight'>{t("wallet_history")}</h2>
                    <p className='text-xs text-slate-500 mt-0.5'>Track credits and debits to your digital wallet</p>
                </div>
            </div>

            <div className='p-5 md:p-6'>
                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {Array?.from({ length: 4 })?.map((_, index) => (
                            <CardSkeleton height={160} padding='p-4' key={index} />
                        ))}
                    </div>
                ) : transactions?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {transactions?.map((transaction) => (
                            <WalletTransactionCard transaction={transaction} key={transaction?.id} />
                        ))}
                    </div>
                ) : (
                    <div className='py-16 px-4 flex items-center justify-center flex-col text-center'>
                        <div className="w-24 h-24 mb-4 opacity-80">
                            <Image src={NoTransactionFound} alt='Transactions Not found' height={120} width={120} unoptimized className='w-full h-full object-contain' />
                        </div>
                        <h3 className='text-lg font-bold text-slate-900'>{t("no_transaction")}</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">You have no wallet transactions recorded yet.</p>
                    </div>
                )}

                {loadingMore && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
                        {Array?.from({ length: 2 })?.map((_, index) => (
                            <CardSkeleton height={160} padding='p-4' key={index} />
                        ))}
                    </div>
                )}

                {total > transactions?.length && (
                    <div className='flex justify-center pt-6 mt-4 border-t border-slate-100'>
                        <button 
                            className='px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.02]' 
                            onClick={handleFetchMore}
                        >
                            {t("load_more")}
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default WalletHistory