import React from 'react';
import Image from 'next/image';
import pageNotFound from "@/assets/not_found_images/404.svg";
import { t } from '@/utils/translation';
import { LocalizedLink } from '@/utils/localizedNav';

const Custom404 = () => {
    return (
        <section className="min-h-screen w-full flex items-center justify-center bg-slate-50/50 p-6">
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-8 md:p-12 max-w-lg w-full flex flex-col items-center justify-center gap-4 text-center">
                <div className="relative w-64 h-64 md:w-80 md:h-80">
                    <Image
                        src={pageNotFound}
                        alt="Page Not Found"
                        fill
                        priority
                        className="object-contain"
                    />
                </div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
                    {t("page_not_found")}
                </h1>
                <p className="text-xs md:text-sm text-slate-500 font-medium max-w-xs">
                    The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
                </p>
                <LocalizedLink
                    href="/"
                    className="mt-2 inline-flex items-center justify-center px-8 py-3.5 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
                >
                    {t("home")}
                </LocalizedLink>
            </div>
        </section>
    );
};

export default Custom404;
