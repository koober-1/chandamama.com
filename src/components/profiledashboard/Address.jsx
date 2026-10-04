import React, { use, useEffect, useState } from "react";
import { t } from "@/utils/translation";
import { CiCirclePlus } from "react-icons/ci";
import AddressCard from "../cards/AddressCard";
import dynamic from 'next/dynamic';
const NewAddressModal = dynamic(() => import('../newaddressmodal/NewAddressModal'), {
  ssr: false,
});
import * as api from "@/api/apiRoutes";
import { useSelector, useDispatch } from "react-redux";
import { setAllAddresses } from "@/redux/slices/addressSlice";
import CardSkeleton from "../skeleton/CardSkeleton";
import { GoPlusCircle } from "react-icons/go";

const Address = () => {
  const dispatch = useDispatch();

  const addresses = useSelector((state) => state.Addresses);
  const [showAddAddres, setShowAddAddres] = useState(false);
  const [isAddressSelected, setIsAddressSelected] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAddress();
  }, []);

  // const addressPerPage = 10;

  const fetchAddress = async () => {
    setLoading(true);
    try {
      const response = await api.getAddress();
      if (response.status == 1) {
        dispatch(setAllAddresses({ data: response.data }));
      } else {
        dispatch(setAllAddresses({ data: [] }));
      }
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.log("Error", error);
    }
  };

  const handleshowAddres = () => {
    setIsAddressSelected(false);
    setShowAddAddres(true);
  };

  return (
    <div className="w-full bg-white rounded-3xl border border-slate-200/80 shadow-card overflow-hidden">
      <div className="bg-slate-50/70 border-b border-slate-100 flex justify-between p-5 md:p-6 items-center">
        <div>
          <h2 className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">{t("manage_address")}</h2>
          <p className="text-xs md:text-sm text-slate-500 mt-0.5">Manage and organize your delivery locations</p>
        </div>
        {addresses?.allAddresses?.length > 0 && (
          <button
            className="inline-flex items-center gap-2 py-2.5 px-5 rounded-full text-sm font-semibold bg-[#0BADFB] hover:bg-[#0298e0] text-white shadow-sm transition-all hover:scale-[1.02] active:scale-[0.98]"
            onClick={handleshowAddres}
          >
            <GoPlusCircle size={18} className="font-bold" />
            <span>{t("add_new_address")}</span>
          </button>
        )}
      </div>

      <div className="p-5 md:p-6">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Array?.from({ length: 4 })?.map((_, index) => {
              return <CardSkeleton key={index} height={180} padding="2px" />;
            })}
          </div>
        ) : addresses?.allAddresses?.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {addresses?.allAddresses?.map((address) => {
              return (
                <div key={address?.id}>
                  <AddressCard
                    address={address}
                    setShowAddAddres={setShowAddAddres}
                    setIsAddressSelected={setIsAddressSelected}
                    fetchAddress={fetchAddress}
                    fromAddress={true}
                  />
                </div>
              );
            })}
          </div>
        ) : (
          <div
            className="flex flex-col items-center justify-center p-10 md:p-14 my-4 rounded-3xl border-2 border-dashed border-slate-200 hover:border-[#0BADFB]/60 bg-slate-50/40 hover:bg-[#e0f7fe]/40 transition-all cursor-pointer group text-center"
            onClick={() => setShowAddAddres(true)}
          >
            <div className="w-14 h-14 rounded-full bg-[#e0f7fe] text-[#0BADFB] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <GoPlusCircle size={28} />
            </div>
            <h3 className="text-base font-bold text-slate-800">{t("add_address")}</h3>
            <p className="text-xs text-slate-500 max-w-xs mt-1">You haven&apos;t added any shipping addresses yet. Click here to add your first address.</p>
          </div>
        )}
      </div>

      {showAddAddres && (
        <NewAddressModal
          showAddAddres={showAddAddres}
          setShowAddAddres={setShowAddAddres}
          isAddressSelected={isAddressSelected}
          fetchAddress={fetchAddress}
        />
      )}
    </div>
  );
};

export default Address;
