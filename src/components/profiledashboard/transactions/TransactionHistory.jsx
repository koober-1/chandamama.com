import { t } from '@/utils/translation'
import React, { useEffect, useState } from 'react'
import TransactionCard from './TransactionCard'
import * as api from "@/api/apiRoutes"
import CardSkeleton from '@/components/skeleton/CardSkeleton'
import NoTransactionImage from "@/assets/not_found_images/No_Transaction.svg"
import Image from 'next/image'

const TransactionHistory = () => {

    const [transaction, setTransaction] = useState([])
    const [offset, setOffset] = useState(0)
    const [total, setTotal] = useState(null)
    const [loading, setLoading] = useState(false)
    const [loadingMore, setLoadingMore] = useState(false)

    const transactionPerPage = 9;
    useEffect(() => {
        handleFetchTransactions(false, 0);
    }, [])

    const handleFetchTransactions = async (isLoadMore = false, newOffset) => {
        if (isLoadMore) {
            setLoadingMore(true)
        } else {
            setLoading(true)
        }
        try {
            const response = await api.getUserTransactions({ limit: transactionPerPage, offset: newOffset, type: "transactions" })
            if (response.status == 1) {
                setTransaction((trnscn) => [...trnscn, ...response.data])
                setTotal(response.total)
                setLoading(false)
                setLoadingMore(false)
            } else {
                setLoading(false)
                setLoadingMore(false)
            }
        } catch (error) {
            setLoading(false)
            setLoadingMore(false)
            console.log("Error", error)
        }
    }

    const handleFetchMore = () => {
        const newOffset = offset + transactionPerPage
        setOffset(newOffset)
        handleFetchTransactions(true, newOffset)
    }

    return (
        <div className='w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden'>
            <div className='bg-slate-50/70 border-b border-slate-100 flex justify-between p-5 md:p-6 items-center'>
                <div>
                    <h2 className='font-bold text-xl md:text-2xl text-slate-900 tracking-tight'>{t("transaction_history")}</h2>
                    <p className='text-xs text-slate-500 mt-0.5'>Audit trail of all your orders and payments</p>
                </div>
            </div>

            <div className='p-5 md:p-6'>
                {loading ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {Array?.from({ length: 4 })?.map((_, index) => (
                            <CardSkeleton height={180} padding='p-4' key={index} />
                        ))}
                    </div>
                ) : transaction?.length > 0 ? (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        {transaction?.map((item) => (
                            <TransactionCard transaction={item} key={item?.id} />
                        ))}
                    </div>
                ) : (
                    <div className='py-16 px-4 flex items-center justify-center flex-col text-center'>
                        <div className="w-24 h-24 mb-4 opacity-80">
                            <Image src={NoTransactionImage} alt='Transactions Not found' unoptimized className='w-full h-full object-contain' />
                        </div>
                        <h3 className='text-lg font-bold text-slate-900'>{t("no_transaction")}</h3>
                        <p className="text-xs text-slate-500 mt-1 max-w-xs">You have no order transactions recorded yet.</p>
                    </div>
                )}

                {loadingMore && (
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4 pt-4'>
                        {Array?.from({ length: 2 })?.map((_, index) => (
                            <CardSkeleton height={180} padding="2px" key={index} />
                        ))}
                    </div>
                )}

                {total > transaction?.length && (
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

export default TransactionHistory