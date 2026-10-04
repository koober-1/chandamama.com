import React from 'react'
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import AnimationOne from "@/assets/order_place_animation/order_failed_animation.json"
import { useRouter } from 'next/router';
import { t } from '@/utils/translation';
const Lottie = dynamic(() => import('lottie-react'), { ssr: false });

const OrderFailedModal = ({ showOrderFailed, handleFailedOrder }) => {
    const router = useRouter();

    return (
        <Dialog open={showOrderFailed}>
            <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-2xl">
                <DialogHeader>
                    <div className="flex flex-col relative items-center text-center gap-4">
                        {/* Lottie animation */}
                        <div className="relative w-full h-44 flex items-center justify-center">
                            <Lottie
                                className="h-40"
                                animationData={AnimationOne}
                                loop={false}
                            />
                        </div>

                        <div className="text-center mt-2 flex flex-col items-center gap-3">
                            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                                {t("order_failed_description")}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium max-w-xs">
                                An issue occurred while processing your payment. Please try again or choose an alternative payment method.
                            </p>
                            <button
                                type="button"
                                className="mt-4 px-8 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm tracking-wide shadow-md transition-all active:scale-95"
                                onClick={handleFailedOrder}
                            >
                                {t("home")}
                            </button>
                        </div>
                    </div>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
};

export default OrderFailedModal