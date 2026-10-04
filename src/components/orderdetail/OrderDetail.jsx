import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import * as api from "@/api/apiRoutes";
import { t } from "@/utils/translation";
import { formatCustomDate } from "@/lib/utils";
import OrderAdressCard from "./OrderAdressCard";
import { useSelector } from "react-redux";
import OrderItems from "./OrderItems";
import OrderStepper from "./OrderStatusStepper";
import FinalCheckoutSummary from "./FinalCheckoutSummary";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import { MdOutlineFileDownload, MdOutlineWatchLater } from "react-icons/md";
import Loader from "../loader/Loader";
import { FiPhoneCall } from "react-icons/fi";
import { IoLocationOutline } from "react-icons/io5";

const OrderDetail = () => {
  const router = useRouter();
  const { orderid } = router.query;
  const address = useSelector((state) => state.Addresses);
  const [orderDetail, setOrderDetail] = useState([]);
  const [deliveryAddress, setDeliveryAddress] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (orderid) {
      handleFetchOrderDetail();
    }
  }, [orderid]);

  const handleFetchOrderDetail = async () => {
    setLoading(true);
    try {
      const response = await api.getOrders({ orderId: orderid });
      if (response?.status == 1) {
        setOrderDetail(response.data[0]);
        setLoading(false);
      } else {
        console.log("Error", response);
        setLoading(false);
      }
    } catch (error) {
      console.log("Error", error);
      setLoading(false);
    }
  };

  const handleDownloadInvoice = async () => {
    try {
      const response = await api.downloadInvoice({ orderId: orderid });
      var fileURL = window.URL.createObjectURL(new Blob([response.data]));
      var fileLink = document.createElement("a");
      fileLink.href = fileURL;
      fileLink.setAttribute("download", "Invoice-No:" + orderid + ".pdf");
      document.body.appendChild(fileLink);
      fileLink.click();
    } catch (error) {
      if (error.request.statusText) {
        toast.error(error.request.statusText);
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error(t("something_went_wrong"));
      }
    }
  };

  const handleLocationRedirect = (lat, lng) => {
    window.open(`https://www.google.com/maps?q=${lat},${lng}`, "_blank");
  };

  return (
    <section className="bg-slate-50/50 min-h-screen pb-20">
      <BreadCrumb />
      <div className="container mx-auto px-4 max-w-7xl my-8 md:my-10">
        {loading ? (
          <div className="py-24 flex items-center justify-center">
            <Loader />
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            {/* Top Order Hero Banner */}
            <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 md:p-8 flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
              <div className="flex flex-wrap items-center gap-6">
                <div>
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t("orderNumber")}
                  </span>
                  <h1 className="text-2xl md:text-3xl font-bold text-slate-900 tracking-tight">#{orderDetail?.id}</h1>
                </div>
                <div className="h-10 w-[1px] bg-slate-200 hidden sm:block"></div>
                <div className="flex flex-col">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                    {t("order_type")}
                  </span>
                  <p className="text-base font-semibold text-slate-800">
                    {orderDetail?.order_type == "doorstep"
                      ? t("home_delivery")
                      : t("store_pickup")}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-4 sm:gap-6 w-full md:w-auto justify-between md:justify-end">
                <div className="flex flex-col items-start md:items-end">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("orderDate")}</span>
                  <p className="text-sm font-semibold text-slate-700">
                    {orderDetail?.date}
                  </p>
                </div>

                {Number(
                  orderDetail?.active_status < 6 &&
                  parseInt(orderDetail?.otp) !== 0 &&
                  orderDetail.order_type == "doorstep" &&
                  orderDetail?.otp !== null
                ) && (
                  <div className="flex flex-col items-start md:items-end px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200/60">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-amber-700">{t("otp")}</span>
                    <p className="text-sm font-bold text-amber-900 tracking-wider">{orderDetail?.otp}</p>
                  </div>
                )}

                <button
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.02]"
                  onClick={handleDownloadInvoice}
                >
                  <MdOutlineFileDownload size={18} />
                  <span>{t("GetInvoice")}</span>
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
              {orderDetail?.order_note && (
                <div className="col-span-12">
                  <div className="bg-amber-50/60 rounded-2xl border border-amber-200/60 p-4">
                    <h3 className="font-bold text-xs uppercase tracking-wider text-amber-800 mb-1">
                      {t("order_note_title")}
                    </h3>
                    <p className="text-sm text-amber-900">{orderDetail?.order_note}</p>
                  </div>
                </div>
              )}

              <div className="col-span-12 md:col-span-8 flex flex-col gap-8">
                {orderDetail?.order_type == "doorstep" ? (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-xl text-slate-900 tracking-tight">
                      {t("shippingAdress")}
                    </h3>
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
                      <OrderAdressCard orderDetail={orderDetail} />
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-xl text-slate-900 tracking-tight">
                      {t("pickup_from_store")}
                    </h3>
                    <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 flex flex-col gap-5">
                      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-slate-100">
                        <div className="flex gap-3 items-start">
                          <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <IoLocationOutline size={22} />
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-slate-900">
                              {orderDetail?.pickup_address?.seller_name}
                            </h4>
                            <p className="text-xs text-slate-500 mt-0.5 max-w-sm">
                              {orderDetail?.pickup_address?.pickup_store_address}
                            </p>
                          </div>
                        </div>
                        <button
                          className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs shadow-xs transition-all self-start sm:self-auto"
                          onClick={() => {
                            handleLocationRedirect(
                              orderDetail?.pickup_address?.pickup_latitude,
                              orderDetail?.pickup_address?.pickup_longitude
                            );
                          }}
                        >
                          <IoLocationOutline size={16} />
                          <span>{t("direction")}</span>
                        </button>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            <FiPhoneCall size={16} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("phone")}</p>
                            <p className="font-semibold text-sm text-slate-800">
                              {orderDetail?.pickup_address?.seller_mobile}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-slate-100 text-slate-600 flex items-center justify-center shrink-0">
                            <MdOutlineWatchLater size={18} />
                          </div>
                          <div>
                            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400">{t("open_hours")}</p>
                            <p className="font-semibold text-sm text-slate-800">
                              {`${t("today")} ${orderDetail?.pickup_address?.opening_time} - ${orderDetail?.pickup_address?.closing_time}`}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-xl text-slate-900 tracking-tight">{t("items")}</h3>
                  <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden p-4 md:p-6">
                    <OrderItems
                      products={orderDetail?.items}
                      handleFetchOrderDetail={handleFetchOrderDetail}
                      isShowProductRating={orderDetail?.product_rating == true}
                    />
                  </div>
                </div>
              </div>

              <div className="col-span-12 md:col-span-4 flex flex-col gap-6">
                {orderDetail?.status?.length > 0 && (
                  <div className="flex flex-col gap-3">
                    <h3 className="font-bold text-xl text-slate-900 tracking-tight">{t("track_order")}</h3>
                    <OrderStepper orderDetail={orderDetail} />
                  </div>
                )}
                <div className="flex flex-col gap-3">
                  <h3 className="font-bold text-xl text-slate-900 tracking-tight">{t("billing_details")}</h3>
                  <FinalCheckoutSummary orderDetail={orderDetail} />
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default OrderDetail;
