import React, { useState, useEffect } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import ProfileSidebar from "./ProfileSidebar";
import Profile from "./Profile";
import Address from "./Address";
import ActiveOrders from "./orders/ActiveOrders";
import OrderHistory from "./orders/PrevOrder";
import Wishlist from "./Wishlist";
import Subscription from "./subscriptions/Subscriptions";
import { useRouter } from "next/router";
import WalletHistory from "./wallet/WalletHistory";
import TransactionHistory from "./transactions/TransactionHistory";
import Notifications from "./Notifications";
import { setCurrentUser } from "@/redux/slices/userSlice";
import * as api from "@/api/apiRoutes";
import { useDispatch } from "react-redux";
import ResetPassword from "./ResetPassword";
import withAuth from "@/checkauth/CheckAuth";
import CardSkeleton from "../skeleton/CardSkeleton";
import RequestProducts from "./RequestProducts";
import NotificationSetting from "./notification-setting/NotificationSetting";

const ProfileDashboard = () => {
  const dispatch = useDispatch();
  const [selectedTab, setSelectedTab] = useState("profile");
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const currentTab = router.pathname.split("/").pop();
    setSelectedTab(currentTab || "profile");
  }, [router.pathname]);

  useEffect(() => {
    getCurrentUser();
  }, []);

  const getCurrentUser = async () => {
    setLoading(true);
    try {
      const response = await api.getUser();
      dispatch(setCurrentUser({ data: response.user }));
      setLoading(false);
    } catch (error) {
      console.log("error", error);
      setLoading(false);
    }
  };

  const activeTab = router.pathname.split("/").pop();

  return (
    <section className="bg-slate-50/50 min-h-[75vh] pb-16">
      <BreadCrumb />
      <div className="container mx-auto px-4 max-w-7xl my-8 md:my-10">
        <div className="grid grid-cols-12 gap-6 lg:gap-8">
          <div className="md:col-span-4 lg:col-span-4 hidden md:block">
            <ProfileSidebar
              setSelectedTab={setSelectedTab}
              selectedTab={selectedTab}
            />
          </div>

          <div className="col-span-12 md:col-span-8 lg:col-span-8">
            {loading ? (
              <div className="flex flex-col gap-4">
                <CardSkeleton height={60} />
                <CardSkeleton height={500} />
              </div>
            ) : (
              <>
                {activeTab == "profile" && <Profile />}
                {activeTab == "resetpassword" && <ResetPassword />}
                {activeTab == "subscription" && <Subscription />}
                {activeTab == "address" && <Address />}
                {activeTab == "activeorders" && <ActiveOrders />}
                {activeTab == "orderhistory" && <OrderHistory />}
                {activeTab == "wishlist" && <Wishlist />}
                {activeTab == "wallethistory" && <WalletHistory />}
                {activeTab == "transaction" && <TransactionHistory />}
                {activeTab == "notifications" && (
                  <Notifications
                    selectedTab={selectedTab}
                    setSelectedTab={setSelectedTab}
                  />
                )}
                {activeTab == "notification-setting" && <NotificationSetting />}
                {activeTab == "requested-products" && <RequestProducts />}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default withAuth(ProfileDashboard);
