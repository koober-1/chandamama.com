import { LocalizedLink } from "@/utils/localizedNav";
import React, { useEffect, useState } from "react";
import { useLocalizedRouter } from "@/utils/localizedNav";
import WalletBalanceModal from "./wallet/WalletBalanceModal";
import { useSelector } from "react-redux";
import { t } from "@/utils/translation";
import Image from "next/image";
import LogoutModal from "../logoutmodal/LogoutModal";
import DeleteModal from "../deleteModal/DeleteModal";
import { BiCartAlt, BiCog, BiUserCircle, BiWallet } from "react-icons/bi";
import ReferAndEarnModal from "@/components/refer-and-earn/ReferAndEarnModal";
import LightImage from "@/assets/Vector.svg";
import MoneyImage from "@/assets/bx-money.svg";
import BikeImage from "@/assets/bike.svg";
import { FaArrowRight } from "react-icons/fa";
import { formatDate } from "@/utils/helperFunction";
import { ArrowRight } from "lucide-react";
import { toast } from "react-toastify";

const ProfileSidebar = ({ setSelectedTab, selectedTab }) => {
  const router = useLocalizedRouter();
  const user = useSelector((state) => state.User.user);
  const authType = useSelector((state) => state.User.authType);
  const setting = useSelector((state) => state?.Setting?.setting);

  const [addWalletModal, setAddWalletModal] = useState(false);
  const [showReferAndEarn, setShowReferAndEarn] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [showDelete, setShowDelete] = useState(false);
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const handleTabChange = (tabName) => {
    setSelectedTab(tabName);
  };

  const handleWalletBalanceModal = () => {
    setAddWalletModal(true);
  };

  const handleShowReferAndEarn = () => {
    setShowReferAndEarn(true);
  };

  const activeTab = router.pathname.split("/").pop();

  const slides = [
    {
      id: 1,
      text: `${t("subscribe")} ${user?.subscription_name}`,
      image: (
        <div className="p-2 md:p-1.5 lg:p-2  primaryBackColor rounded-full border border-white h-9 w-9 md:h-7 md:w-7 lg:w-9 lg:h-9 shrink-0">
          <Image
            src={LightImage}
            alt="light logo"
            className={`h-5 w-5 md:w-4 md:h-4 lg:w-5 lg:h-5 object-contain `}
            height={20}
            width={20}
            unoptimized
          />
        </div>
      ),
      theme: "border-green-500 bg-[#55AE7B1F] text-green-800",
    },
    {
      id: 2,
      text: t("go_max_save_more"),
      image: (
        <div className="p-2 md:p-1.5 lg:p-2 bg-[#0186D8] rounded-full border border-white h-9 w-9 md:h-7 md:w-7 lg:w-9 lg:h-9 flex items-center shrink-0">
          <Image
            src={MoneyImage}
            alt="light logo"
            className={`h-6 w-6 md:w-4 md:h-4 lg:w-6 lg:h-6 object-contain `}
            height={20}
            width={20}
          />
        </div>
      ),
      theme: "border-blue-500 bg-[#0186D81F] text-[#0186D8]",
    },
    {
      id: 3,
      text: t("free_delivery_desc"),
      image: (
        <div className="p-2 md:p-1.5 lg:p-2 bg-[#DB9305] rounded-full border  border-white h-9 w-9 md:h-7 md:w-7 lg:w-9 lg:h-9 shrink-0">
          <Image
            src={BikeImage}
            alt="light logo"
            className={`h-5 w-5 md:w-4 md:h-4 lg:w-5 lg:h-5 object-contain `}
            height={20}
            width={20}
          />
        </div>
      ),
      theme: "border-orange-500 bg-[#DB93051F] text-[#DB9305]",
    },
  ];

  const handleSubscriptionClick = () => {
    router.push("/profile/subscription");
  };
  const handleDelete = () => {
    if (user.balance > 0) {
      toast.error(t("withdraw_it_before_deleting"));
      return;
    }
    setShowDelete(true);
  };

  return (
    <div>
      <div className="bg-white border border-slate-200/80 rounded-3xl shadow-card overflow-hidden sticky top-28">
        {user?.is_subscription_plans ? (
          <div className="bg-slate-50/80 p-5 border-b border-slate-100 flex flex-col gap-5">
            <div className="flex items-center gap-4">
              {/* Avatar */}
              <div className="w-16 h-16 rounded-full border-2 border-[#0BADFB]/30 p-0.5 flex items-center justify-center shrink-0 bg-white shadow-xs overflow-hidden relative">
                <Image
                  src={user?.profile}
                  alt="Profile"
                  fill
                  className="h-full w-full rounded-full object-cover"
                />
              </div>

              {/* Text */}
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t("hello")},</p>
                <p className="text-base md:text-lg font-extrabold text-slate-900 truncate">
                  {user?.name}
                </p>
              </div>
            </div>

            <div className="border-t border-slate-200/60 pt-3">
              <div className="flex gap-3">
                {user?.has_active_subscription == 1 ? (
                  <div className="flex items-center w-full justify-between gap-2">
                    <div className="flex items-center gap-2.5">
                      <div className="p-1.5 bg-[#0BADFB] rounded-full text-white h-7 w-7 flex items-center justify-center shrink-0 shadow-xs">
                        <Image
                          src={LightImage}
                          alt="light logo"
                          className="h-full w-full object-contain"
                          height={16}
                          width={16}
                        />
                      </div>
                      <div className="flex flex-col">
                        <h3 className="font-bold text-xs text-slate-900 truncate">
                          {user?.user_subscription_plan_name}
                        </h3>
                        <p className="text-[11px] text-slate-500 font-medium">
                          {`${t("expires_on")} ${formatDate(user?.subscription_expiry_date)}`}
                        </p>
                      </div>
                    </div>
                    <span className="bg-[#e0f7fe] text-[#0BADFB] border border-[#0BADFB]/30 text-xs font-bold px-3 py-1 rounded-full">
                      {t("active")}
                    </span>
                  </div>
                ) : user?.has_active_subscription == 2 ? (
                  <div className="flex flex-col gap-3 w-full">
                    <div className="flex items-center w-full justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <div className="p-1.5 bg-rose-500 rounded-full text-white h-7 w-7 flex items-center justify-center shrink-0">
                          <Image
                            src={LightImage}
                            alt="light logo"
                            className="h-full w-full object-contain"
                            height={16}
                            width={16}
                          />
                        </div>
                        <div className="flex flex-col">
                          <h3 className="font-bold text-xs text-slate-900">
                            {user?.subscription_name}
                          </h3>
                          <p className="text-[11px] text-slate-500">
                            {t("expired_plan_desc")}
                          </p>
                        </div>
                      </div>

                      <span className="bg-rose-50 text-rose-600 border border-rose-200 text-xs font-bold px-2.5 py-0.5 rounded-full">
                        {t("expired")}
                      </span>
                    </div>
                    <button
                      className="w-full bg-[#0BADFB] hover:bg-[#0298e0] text-white text-xs font-bold py-2 px-4 rounded-full flex items-center gap-2 justify-center shadow-sm"
                      onClick={handleSubscriptionClick}
                    >
                      <span>{`${t("renew")} ${user?.subscription_name}`}</span>
                      <ArrowRight className="w-4 h-4 text-white" />
                    </button>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <h3 className="font-bold text-xs text-slate-900">
                      {user?.subscription_name}
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      {t("subscription_desc")}
                    </p>
                  </div>
                )}
              </div>

              {user?.has_active_subscription == 0 && (
                <div className="mt-3">
                  <div
                    className={`relative h-12 w-full overflow-hidden rounded-2xl border transition-colors duration-500 ${slides[current].theme}`}
                  >
                    {slides.map((slide, index) => (
                      <div
                        key={slide.id}
                        className="absolute inset-0 flex items-center justify-center font-semibold transition-all duration-500 ease-in-out cursor-pointer"
                        style={{
                          transform: `translateY(${(index - current) * 100}%)`,
                          opacity: index === current ? 1 : 0,
                        }}
                        onClick={handleSubscriptionClick}
                      >
                        <div className="flex gap-2 items-center font-bold justify-between px-3 w-full">
                          <div className="flex gap-2 items-center">
                            {slide.image}
                            <div className="text-xs truncate">{slide.text}</div>
                          </div>
                          <FaArrowRight size={12} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="bg-slate-50/80 p-5 border-b border-slate-100 flex items-center gap-4">
            <div className="w-14 h-14 rounded-full border-2 border-[#0BADFB]/30 p-0.5 flex items-center justify-center shrink-0 bg-white shadow-xs overflow-hidden relative">
              <Image
                src={user?.profile}
                alt="Profile"
                fill
                className="h-full w-full rounded-full object-cover"
                unoptimized
              />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold uppercase tracking-wider text-slate-400">{t("hello")},</p>
              <p className="text-base font-extrabold text-slate-900 truncate">{user?.name}</p>
            </div>
          </div>
        )}

        <div className="flex flex-col">
          {/* Account Manage */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 py-3 bg-slate-50/40 border-b border-slate-100 flex items-center gap-2">
              <BiUserCircle size={16} />
              <span>{t("account_manage")}</span>
            </h3>
            <ul className="py-1">
              <LocalizedLink href={`/profile`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "profile"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("profile")}
                >
                  {t("editProfile")}
                </li>
              </LocalizedLink>
              {authType == "email" ||
                (authType == "phone" && setting?.phone_auth_password == 1 && (
                  <LocalizedLink href={`/profile/resetpassword`}>
                    <li
                      className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                        activeTab == "resetpassword"
                          ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                          : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                      }`}
                      onClick={() => handleTabChange("profile")}
                    >
                      {t("resetPassword")}
                    </li>
                  </LocalizedLink>
                ))}

              <LocalizedLink href={`/profile/address`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "address"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("address")}
                >
                  {t("manage_address")}
                </li>
              </LocalizedLink>
              {user?.has_active_subscription > 0 && (
                <LocalizedLink href={`/profile/subscription`}>
                  <li
                    className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                      activeTab == "subscription"
                        ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                        : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                    }`}
                    onClick={() => handleTabChange("subscription")}
                  >
                    {user?.subscription_name}
                  </li>
                </LocalizedLink>
              )}
            </ul>
          </div>

          {/* Orders & Wishlist */}
          <div className="border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 py-3 bg-slate-50/40 border-b border-slate-100 flex items-center gap-2">
              <BiCartAlt size={16} />
              <span>{`${t("orders")} & ${t("wishlist")}`}</span>
            </h3>
            <ul className="py-1">
              <LocalizedLink href={`/profile/activeorders`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "activeorders"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("activeorders")}
                >
                  {t("active_orders")}
                </li>
              </LocalizedLink>

              <LocalizedLink href={`/profile/orderhistory`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "orderhistory"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("orderhistory")}
                >
                  {t("order_history")}
                </li>
              </LocalizedLink>

              <LocalizedLink href={`/profile/wishlist`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "wishlist"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("wishlist")}
                >
                  {t("my_wishlist")}
                </li>
              </LocalizedLink>
            </ul>
          </div>

          {/* Payment & Wallet */}
          <div className="border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 py-3 bg-slate-50/40 border-b border-slate-100 flex items-center gap-2">
              <BiWallet size={16} />
              <span>{t("payment")}</span>
            </h3>
            <ul className="py-1">
              <li className="flex justify-between items-center px-5 py-3 text-xs md:text-sm font-semibold text-slate-700">
                <span>{t("walletBalance")}</span>
                <span className="text-xs font-extrabold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full">
                  {setting?.currency} {user?.balance}
                </span>
              </li>
              <li
                className="px-5 py-3 text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={handleWalletBalanceModal}
              >
                {t("addWalletBalance")}
              </li>
              <LocalizedLink href={`/profile/wallethistory`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "wallethistory"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("wallethistory")}
                >
                  {t("wallet_history")}
                </li>
              </LocalizedLink>

              <LocalizedLink href={`/profile/transaction`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "transaction"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("transaction")}
                >
                  {t("transaction_history")}
                </li>
              </LocalizedLink>
            </ul>
          </div>

          {/* Settings & Account Action */}
          <div className="border-t border-slate-100">
            <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400 px-5 py-3 bg-slate-50/40 border-b border-slate-100 flex items-center gap-2">
              <BiCog size={16} />
              <span>{t("setting")}</span>
            </h3>
            <ul className="py-1">
              <LocalizedLink href={`/profile/notifications`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "notifications"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("notifications")}
                >
                  {t("notification")}
                </li>
              </LocalizedLink>
              <LocalizedLink href={`/profile/notification-setting`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "notification-setting"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("notification_setting")}
                >
                  {t("notification_setting")}
                </li>
              </LocalizedLink>
              <LocalizedLink href={`/profile/requested-products`}>
                <li
                  className={`px-5 py-3 text-xs md:text-sm font-semibold cursor-pointer transition-colors ${
                    activeTab == "requested-products"
                      ? "bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] dark:text-[#7DD3FC] border-l-4 border-[#0BADFB] font-bold"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800"
                  }`}
                  onClick={() => handleTabChange("requested-products")}
                >
                  {t("requestedProducts")}
                </li>
              </LocalizedLink>
              <li
                className="px-5 py-3 text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => handleShowReferAndEarn()}
              >
                {t("referandearn")}
              </li>
              <li
                className="px-5 py-3 text-xs md:text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 cursor-pointer transition-colors"
                onClick={() => setShowLogout(true)}
              >
                {t("logout")}
              </li>
              <li
                className="px-5 py-3 text-xs md:text-sm font-semibold text-rose-600 hover:bg-rose-50 cursor-pointer transition-colors"
                onClick={handleDelete}
              >
                {t("delete_account")}
              </li>
            </ul>
          </div>
        </div>

        <WalletBalanceModal
          addWalletModal={addWalletModal}
          setAddWalletModal={setAddWalletModal}
        />
        <ReferAndEarnModal
          showReferAndEarn={showReferAndEarn}
          setShowReferAndEarn={setShowReferAndEarn}
        />
        <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
        <DeleteModal showDelete={showDelete} setShowDelete={setShowDelete} />
      </div>
    </div>
  );
};

export default ProfileSidebar;
