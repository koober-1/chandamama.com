import React, { useEffect, useState } from "react";
import { t } from "@/utils/translation";
import NotificationCard from "../notifications/NotificationCard";
import * as api from "../../api/apiRoutes";
import NoNotificationImage from "@/assets/not_found_images/No_Notification.svg"
import Image from "next/image";
import CardSkeleton from "../skeleton/CardSkeleton";

const Notifications = ({ selectedTab, setSelectedTab }) => {
  const total_notifications_per_page = 7;

  const [notifications, setNotifications] = useState([]);
  const [currPage, setCurrPage] = useState(1)
  const [offset, setoffset] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [totalNotications, setTotalNotifications] = useState(null)

  useEffect(() => {
    if (selectedTab === "notifications") {
      handleFetchNotifications();
    }
  }, [selectedTab]);

  const handleFetchNotifications = async (offset = 0) => {
    setIsLoading(true);
    try {
      const response = await api.getNotifications({ limit: total_notifications_per_page, offset });
      setTotalNotifications(response.total)
      setNotifications([...notifications, ...response?.data]);
      setIsLoading(false);
    } catch (error) {
      console.log("Error ", error);
    }
  };

  const handleLoadMore = (pageNum) => {
    setCurrPage(pageNum);
    setoffset(pageNum * total_notifications_per_page - total_notifications_per_page);
    handleFetchNotifications(pageNum * total_notifications_per_page - total_notifications_per_page);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
      <div className="bg-slate-50/70 border-b border-slate-100 p-5 md:p-6 flex justify-between items-center">
        <div>
          <h2 className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">{t("notification")}</h2>
          <p className="text-xs text-slate-500 mt-0.5">Stay updated on orders, deals, and announcements</p>
        </div>
      </div>

      <div className="p-4 md:p-6">
        {isLoading && (
          <div className="flex flex-col gap-3">
            {Array.from({ length: 4 }).map((_, idx) => (
              <CardSkeleton key={idx} height={80} padding="p-1" />
            ))}
          </div>
        )}

        {notifications?.length > 0 ? (
          <div className="divide-y divide-slate-100">
            {notifications?.map((notification) => (
              <div key={notification?.id} className="py-2 first:pt-0 last:pb-0">
                <NotificationCard notification={notification} />
              </div>
            ))}
          </div>
        ) : (
          <div className="py-16 px-4 flex items-center justify-center flex-col text-center">
            <div className="w-24 h-24 mb-4 opacity-80">
              <Image
                src={NoNotificationImage}
                alt="Notification Not found"
                height={120}
                width={120}
                className="w-full h-full object-contain"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-900">{t("empty_notification_list_message")}</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-xs">You have no new notifications right now.</p>
          </div>
        )}

        {notifications?.length < totalNotications && (
          <div className="flex justify-center pt-6 mt-4 border-t border-slate-100">
            <button
              className="px-6 py-2.5 rounded-full bg-slate-900 hover:bg-black text-white font-semibold text-xs shadow-sm transition-all hover:scale-[1.02]"
              onClick={() => handleLoadMore(currPage + 1)}
            >
              {t("load_more")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Notifications;
