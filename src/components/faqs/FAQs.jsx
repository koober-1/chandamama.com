import React, { useEffect, useState } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import * as api from "../../api/apiRoutes";
import FAQCard from "./FAQCard";
import { t } from "@/utils/translation";
import CardSkeleton from "../skeleton/CardSkeleton";


const FAQs = () => {
  const [faqs, setFaqs] = useState([]);
  const total_faqs_per_page = 7;
  const [currPage, setcurrPage] = useState(1);
  const [offset, setoffset] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [totalFaqs, setTotalFaqs] = useState(0);

  useEffect(() => {
    handleFetchFAQs();
  }, []);

  const handleFetchFAQs = async (offset = 0) => {
    setIsLoading(true);
    try {
      const response = await api.getFAQs({
        limit: total_faqs_per_page,
        offset,
      });
      setFaqs([...faqs, ...response?.data]);
      setTotalFaqs(response?.total);
      setIsLoading(false);
    } catch (error) {
      setIsLoading(false);
      console.log("FAQs page error: ", error);
    }
  };
  const handlePageChange = (pageNum) => {
    setcurrPage(pageNum);
    setoffset(pageNum * total_faqs_per_page - total_faqs_per_page);
    handleFetchFAQs(pageNum * total_faqs_per_page - total_faqs_per_page);
  };
  return (
    <section className="bg-slate-50/50 min-h-[70vh] pb-16">
      <BreadCrumb />
      <div className="container mx-auto px-4 max-w-4xl my-8 flex flex-col items-center">
        <div className="w-full border-b-2 border-[#8fe5ef] mb-8 pb-0 flex flex-wrap items-end justify-between gap-4">
          <div className="inline-block bg-[#8fe5ef] text-slate-900 font-extrabold uppercase px-6 py-2 rounded-t-xl text-lg tracking-wider">
            {t("faqs") || "FREQUENTLY ASKED QUESTIONS"}
          </div>
          <span className="text-xs md:text-sm font-semibold text-slate-500 pb-1">
            Find quick answers to common questions about our products & delivery
          </span>
        </div>

        <div className="w-full flex flex-col items-center">
          {faqs?.map((faq, idx) => (
            <FAQCard key={idx} faq={faq} />
          ))}
          {isLoading &&
            Array.from({ length: total_faqs_per_page }).map((_, idx) => (
              <div key={idx} className="w-full max-w-3xl mb-3">
                <CardSkeleton height={56} padding="p-2" />
              </div>
            ))}
          {totalFaqs > faqs?.length && (
            <button
              type="button"
              className="mt-6 px-8 py-3 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
              onClick={() => handlePageChange(currPage + 1)}
            >
              {t("load_more")}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FAQs;
