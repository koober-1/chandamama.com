import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import * as api from "@/api/apiRoutes";
import RequestProductCard from "./requestedProduct/RequestProductCard";
import RequestedProductModal from "./requestedProduct/RequestedProductModal";
import CardSkeleton from "../skeleton/CardSkeleton";

const RequestProducts = () => {
  const [requestedProducts, setRequestedProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [offset, setOffset] = useState(0);
  const [totalRequests, setTotalRequests] = useState(0);
  const [loading, setLoading] = useState(false);
  const [flag, setFlag] = useState(false);

  const REQUEST_LIMIT = 9;

  useEffect(() => {
    setOffset(0);
    getRequestedProducts(false, 0);
  }, [flag]);

  const getRequestedProducts = async (isFetchMore, bOffset) => {
    setLoading(true);
    try {
      const response = await api.getRequestedProducts({
        limit: REQUEST_LIMIT,
        offset: bOffset,
      });
      setTotalRequests(response.total);
      if (isFetchMore) {
        setRequestedProducts((prevRequests) => [
          ...prevRequests,
          ...response.data,
        ]);
        setOffset((offset) => offset + REQUEST_LIMIT);
        setLoading(false);
      } else {
        setRequestedProducts(response.data);
        setOffset((offset) => offset + REQUEST_LIMIT);
        setLoading(false);
      }
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
      <div className="bg-slate-50/70 border-b border-slate-100 flex justify-between p-5 md:p-6 items-center">
        <div>
          <h2 className="text-xl md:text-2xl font-bold text-slate-900 tracking-tight">
            {t("requestedProducts")}
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">Can&apos;t find an item? Request it directly from our team</p>
        </div>
        <button
          className="px-5 py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.02]"
          onClick={() => setShowModal(true)}
        >
          {t("requestNewProduct")}
        </button>
      </div>

      <div className="p-5 md:p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <CardSkeleton height={180} padding="2px" key={index} />
            ))
          ) : requestedProducts.length > 0 ? (
            requestedProducts.map((request) => (
              <RequestProductCard key={request.id} request={request} />
            ))
          ) : (
            <div className="py-16 px-4 flex items-center justify-center flex-col text-center col-span-full">
              <div className="w-16 h-16 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
                </svg>
              </div>
              <h3 className="text-lg font-bold text-slate-900">{t("noRequestedProducts")}</h3>
              <p className="text-xs text-slate-500 mt-1 max-w-xs">You have not submitted any custom product requests.</p>
            </div>
          )}
        </div>

        {totalRequests > requestedProducts.length && (
          <div className="flex justify-center pt-6 mt-4 border-t border-slate-100">
            <button
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.02]"
              onClick={() => getRequestedProducts(true, offset)}
            >
              {t("load_more")}
            </button>
          </div>
        )}
      </div>

      <RequestedProductModal
        showModal={showModal}
        setShowModal={setShowModal}
        setFlag={setFlag}
      />
    </div>
  );
};

export default RequestProducts;
