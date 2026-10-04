import { formatCustomDate } from "@/lib/utils";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import Image from "next/image";
import { useLocalizedRouter } from "@/utils/localizedNav";
import React from "react";
import { FaRegBell } from "react-icons/fa";
import { IoTimeOutline } from "react-icons/io5";
import { useDispatch } from "react-redux";

const NotificationCard = ({ notification }) => {
  const router = useLocalizedRouter();
  const dispatch = useDispatch();

  const handleCategoryNotificationClick = (notification) => {
    if (notification?.type === "category") {
      dispatch(setFilterCategory({ data: `${catId},` }));
      router.push("/products");
    } else if (notification?.type === "product") {
      router.push(`/products/${notification?.type_id}`);
    } else if (notification?.type === "url") {
      window.open(notification?.link_url, "_blank");
    }
    return;
  };

  return (
    <div className="flex items-start gap-4 p-4 rounded-2xl hover:bg-slate-50/70 transition-all border border-transparent hover:border-slate-100">
      <div className="shrink-0">
        {notification?.image_url ? (
          <div className="w-12 h-12 rounded-2xl overflow-hidden border border-slate-100 bg-white p-1">
            <Image
              src={notification?.image_url}
              alt="notification"
              height={48}
              width={48}
              className="h-full w-full object-cover rounded-xl"
            />
          </div>
        ) : (
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 flex items-center justify-center">
            <FaRegBell size={20} />
          </div>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
          <h4
            className="font-bold text-sm md:text-base text-slate-800 hover:text-emerald-700 transition-colors cursor-pointer truncate"
            onClick={() => handleCategoryNotificationClick(notification)}
          >
            {notification?.title}
          </h4>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 shrink-0">
            <IoTimeOutline size={14} />
            <span>{notification?.date_sent}</span>
          </div>
        </div>
        <p className="text-xs md:text-sm text-slate-600 leading-relaxed mt-1">
          {notification?.message}
        </p>
      </div>
    </div>
  );
};

export default NotificationCard;
