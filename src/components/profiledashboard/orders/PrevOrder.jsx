import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import PrevOrderCard from "./PrevOrderCard";
import * as api from "@/api/apiRoutes";
import Loader from "@/components/loader/Loader";
import CardSkeleton from "@/components/skeleton/CardSkeleton";
import OrderNotFoundImage from "@/assets/not_found_images/No_Orders.svg";
import Image from "next/image";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaCaretDown } from "react-icons/fa";

const PrevOrder = () => {
  const [loading, setLoading] = useState(false);
  const [offset, setOffset] = useState(0);
  const [prevOrders, setPrevOrders] = useState([]);
  const [totalOrders, setTotalOrders] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [orderType, setOrderType] = useState("");

  useEffect(() => {
    handleFetchPrevOrders(false, 0);
  }, [orderType]);

  const ordersPerPage = 10;

  const handleFetchPrevOrders = async (isLoadMore = false, newOffset) => {
    if (isLoadMore) {
      setLoadingMore(true);
    } else {
      setLoading(true);
    }
    try {
      const response = await api.getOrders({
        limit: ordersPerPage,
        offset: newOffset,
        type: 0,
        orderType,
      });
      if (response?.status == 1) {
        if (isLoadMore) {
          setPrevOrders((ord) => [...ord, ...response?.data]);
        } else {
          setPrevOrders(response?.data);
        }
        setTotalOrders(response.total);
        setLoading(false);
        setLoadingMore(false);
      } else {
        setLoading(false);
        setPrevOrders([]);
        setLoadingMore(false);
      }
    } catch (error) {
      setLoading(false);
      setLoadingMore(false);
      console.log("Error", error);
    }
  };

  const handleFetchMore = async () => {
    const newOffset = offset + ordersPerPage;
    setOffset(newOffset);
    handleFetchPrevOrders(true, newOffset);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
      <div className="bg-slate-50/70 border-b border-slate-100 flex flex-col sm:flex-row justify-between p-5 md:p-6 items-start sm:items-center gap-3">
        <div>
          <h2 className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">{t("order_history")}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Review and reorder past purchases</p>
        </div>
        <div className="flex items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger className="rounded-full border border-slate-200 bg-white hover:border-slate-300 px-4 py-2 text-xs font-semibold text-slate-700 shadow-2xs transition-all flex items-center gap-2 group">
              <span className="font-medium">
                {orderType
                  ? orderType == "doorstep"
                    ? t("home_delivery")
                    : t("store_pickup")
                  : t("select_order_type")}
              </span>
              <FaCaretDown className="text-slate-400 transition-transform duration-300 ease-in-out group-data-[state=open]:-rotate-180" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className="rounded-2xl border border-slate-100 shadow-xl bg-white p-1 min-w-[160px]">
              <DropdownMenuItem
                key={0}
                onSelect={() => setOrderType("")}
                className="text-xs font-medium rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t("default")}
              </DropdownMenuItem>
              <DropdownMenuItem
                key={1}
                onSelect={() => setOrderType("doorstep")}
                className="text-xs font-medium rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t("home_delivery")}
              </DropdownMenuItem>
              <DropdownMenuItem
                key={2}
                onSelect={() => setOrderType("selfpickup")}
                className="text-xs font-medium rounded-xl text-slate-700 hover:bg-slate-50 cursor-pointer"
              >
                {t("store_pickup")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="p-5 md:p-6 space-y-4">
        {loading ? (
          <div className="flex flex-col gap-4">
            {Array.from({ length: 3 })?.map((_, index) => {
              return <CardSkeleton height={180} padding="p-4" key={index} />;
            })}
          </div>
        ) : prevOrders?.length == 0 ? (
          <div className="py-16 px-4 flex items-center justify-center flex-col text-center">
            <div className="w-24 h-24 mb-4 opacity-80">
              <Image
                src={OrderNotFoundImage}
                alt="Order Not found"
                width={120}
                height={120}
                unoptimized
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t("no_order")}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">You have no previous completed orders.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {prevOrders?.map((order) => {
              return <PrevOrderCard order={order} key={order?.id} />;
            })}
          </div>
        )}

        {loadingMore && (
          <div className="flex flex-col gap-4 pt-2">
            {Array?.from({ length: 2 })?.map((_, index) => {
              return <CardSkeleton height={180} padding="p-4" key={index} />;
            })}
          </div>
        )}
      </div>

      {totalOrders > prevOrders?.length && (
        <div className="flex justify-center p-6 border-t border-slate-100 bg-slate-50/40">
          <button
            className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.02]"
            onClick={handleFetchMore}
          >
            {t("load_more")}
          </button>
        </div>
      )}
    </div>
  );
};

export default PrevOrder;
