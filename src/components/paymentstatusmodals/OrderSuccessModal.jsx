import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import animationOne from "@/assets/order_place_animation/order_placed_back_animation.json";
import animationTwo from "@/assets/order_place_animation/order_success_tick_animation.json";
import { t } from "@/utils/translation";


const Lottie = dynamic(() => import('lottie-react'), { ssr: false });


const OrderSuccessModal = ({ showOrderSuccess, handlePaymentClose }) => {
    return (
        <Dialog open={showOrderSuccess}>
            <DialogContent className="max-w-md bg-white rounded-3xl border border-slate-100 p-8 shadow-2xl">
                <DialogHeader>
                    <div className="flex flex-col relative items-center text-center gap-4">
                        {/* Lottie animations */}
                        <div className="relative w-full h-44 flex items-center justify-center overflow-hidden">
                            <Lottie
                                className="h-44 absolute left-0 opacity-70"
                                animationData={animationOne}
                                loop={true}
                            />
                            <Lottie
                                className="h-36 relative z-10"
                                animationData={animationTwo}
                                loop={false}
                            />
                            <Lottie
                                className="h-44 absolute right-0 opacity-70"
                                animationData={animationOne}
                                loop={true}
                            />
                        </div>

                        <div className="text-center mt-2 flex flex-col items-center gap-3">
                            <h2 className="text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight">
                                {t("order_placed_description")}
                            </h2>
                            <p className="text-xs text-slate-500 font-medium max-w-xs">
                                Thank you for your order. We are preparing your items with utmost care.
                            </p>
                            <button
                                type="button"
                                className="mt-4 px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                                onClick={handlePaymentClose}
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

export default OrderSuccessModal;
