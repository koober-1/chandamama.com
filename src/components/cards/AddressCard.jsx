import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  setSelectedAddresForEdit,
  setSelectedAddress,
} from "@/redux/slices/addressSlice";
import { setAddress } from "@/redux/slices/checkoutSlice";
import * as api from "@/api/apiRoutes";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { FaRegEdit } from "react-icons/fa";
import { RiDeleteBinLine } from "react-icons/ri";
import { t } from "@/utils/translation";
import { BsThreeDotsVertical } from "react-icons/bs";

const AddressCard = ({
  address,
  setShowAddAddres,
  setIsAddressSelected,
  fetchAddress,
  finalOrderAddress,
  fromAddress,
}) => {
  const dispatch = useDispatch();

  const checkout = useSelector((state) => state.Checkout);
  const selectedAddress = useSelector(
    (state) => state.Addresses.selectedAddress,
  );
  const theme = useSelector((state) => state.Theme.theme);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showActionModal, setShowActionModal] = useState(false);
  const [selectedAddressId, setSelectedAddressId] = useState(null); // Track selected address ID

  const formattedAddress = `${address?.address}, ${address?.landmark}, ${address?.area}, ${address?.city}, ${address?.state}, ${address?.pincode}-${address?.country}`;

  const handleDeleteAdress = async () => {
    try {
      const response = await api.deleteAddress({ id: address.id });
      if (response.status === 1) {
        fetchAddress();
        dispatch(setSelectedAddresForEdit({ data: null }));
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEditAddress = () => {
    setShowAddAddres(true);
    setIsAddressSelected(true);
    dispatch(setSelectedAddresForEdit({ data: address }));
  };

  const handleCheckboxChange = () => {
    dispatch(setAddress({ data: address }));
  };

  const isSelected = checkout?.address?.id === address?.id;

  return (
    <div className="w-full mb-3">
      <div
        className={`p-5 rounded-2xl border transition-all bg-white cursor-pointer ${
          isSelected && !fromAddress
            ? "border-emerald-600 bg-emerald-50/30 ring-2 ring-emerald-600/20 shadow-sm"
            : "border-slate-200 hover:border-slate-300 shadow-xs"
        }`}
        onClick={() => {
          if (!fromAddress && !finalOrderAddress) {
            handleCheckboxChange();
          }
        }}
      >
        <div className="flex justify-between items-start gap-3 mb-2">
          <div className="flex items-center gap-2.5">
            <h2 className="font-extrabold text-sm md:text-base text-slate-900">
              {address?.name}
            </h2>
            {address?.type && (
              <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 bg-emerald-100/70 border border-emerald-200 px-2 py-0.5 rounded-full">
                {address?.type}
              </span>
            )}
          </div>

          {!fromAddress && (
            <div className="flex items-center">
              {!finalOrderAddress && (
                <input
                  type="radio"
                  id={`default-address-${address.id}`}
                  name="delivery_address"
                  className="w-4 h-4 text-emerald-600 focus:ring-emerald-500 border-slate-300 cursor-pointer"
                  checked={isSelected}
                  onChange={handleCheckboxChange}
                  onClick={(e) => e.stopPropagation()}
                />
              )}
            </div>
          )}
        </div>

        {address?.is_default === 1 && !finalOrderAddress && (
          <span className="inline-block text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full mb-2">
            {t("default_address_msg")}
          </span>
        )}

        <p className="text-xs md:text-sm text-slate-600 leading-relaxed mb-3">
          {formattedAddress}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-slate-100 text-xs">
          <p className="text-slate-600 font-medium">
            <span className="text-slate-400 font-normal">{t("phone")}: </span>
            <span className="font-bold text-slate-800">{address?.mobile}</span>
          </p>

          {!finalOrderAddress && (
            <div className="flex items-center gap-1">
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-600 hover:text-emerald-700 hover:bg-emerald-50 transition-colors font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  handleEditAddress();
                }}
              >
                <FaRegEdit size={13} />
                <span>{t("edit")}</span>
              </button>
              <button
                type="button"
                className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-slate-600 hover:text-rose-600 hover:bg-rose-50 transition-colors font-semibold"
                onClick={(e) => {
                  e.stopPropagation();
                  setShowDeleteModal(true);
                }}
              >
                <RiDeleteBinLine size={13} />
                <span>{t("delete")}</span>
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Delete Address Dialog */}
      <Dialog open={showDeleteModal} onOpenChange={setShowDeleteModal}>
        <DialogOverlay className="bg-slate-900/40 backdrop-blur-xs" />
        <DialogContent className="max-w-sm rounded-3xl bg-white p-6 shadow-2xl border border-slate-100">
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-600 flex items-center justify-center">
              <RiDeleteBinLine size={24} />
            </div>
            <h2 className="text-lg font-bold text-slate-900">
              {t("delete_address")}
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              {t("delete_address_message")}
            </p>
            <div className="flex items-center gap-3 w-full mt-2">
              <button
                type="button"
                className="flex-1 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs transition-colors"
                onClick={() => setShowDeleteModal(false)}
              >
                {t("cancel")}
              </button>
              <button
                type="button"
                className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-md shadow-rose-600/20 transition-all"
                onClick={handleDeleteAdress}
              >
                {t("Ok")}
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddressCard;
