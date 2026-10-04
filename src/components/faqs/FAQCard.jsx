import React, { useState } from 'react';
import {
    Collapsible,
    CollapsibleContent,
    CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FiChevronDown } from "react-icons/fi";

const FAQCard = ({ faq }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <Collapsible
            open={isOpen}
            onOpenChange={setIsOpen}
            className="w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:border-slate-300 transition-all p-5 mb-3.5 max-w-3xl"
        >
            <CollapsibleTrigger className="w-full flex justify-between gap-4 items-center font-bold text-left cursor-pointer group">
                <span className="text-sm md:text-base font-bold text-slate-800 group-hover:text-emerald-700 transition-colors">
                    {faq?.translations?.question}
                </span>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-transform duration-200 ${
                    isOpen
                        ? "bg-emerald-50 text-emerald-700 rotate-180"
                        : "bg-slate-50 text-slate-400 group-hover:bg-slate-100 text-slate-600"
                }`}>
                    <FiChevronDown size={18} />
                </div>
            </CollapsibleTrigger>
            <CollapsibleContent className="pt-4 mt-3 border-t border-slate-100 text-xs md:text-sm text-slate-600 leading-relaxed font-normal">
                {faq?.translations?.answer}
            </CollapsibleContent>
        </Collapsible>
    );
};

export default FAQCard;
