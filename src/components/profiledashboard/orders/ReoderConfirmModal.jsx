import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import * as api from "@/api/apiRoutes";
import { toast } from "react-toastify";
import { t } from "@/utils/translation";
import { useSelector, useDispatch } from "react-redux";
import {
  setCartProducts,
  setCartSubTotal,
  setDoorStepDeliveryMode,
  setSelfPickupMode,
} from "@/redux/slices/cartSlice";

const ReoderConfirmModal = ({
  showReoderModal,
  setShowReorderModal,
  order,
}) => {
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Theme.theme);
  const city = useSelector((state) => state.City.city);

  const handleHideReorder = () => {
    setShowReorderModal(false);
  };

  const handleReoder = async () => {
    try {
      const variantIds = order?.items
        ?.map((prdct) => prdct?.variant_id)
        ?.join(",");
      const quantity = order?.items?.map((prdct) => prdct?.quantity)?.join(",");
      const response = await api.addToBulkCart({
        variant_ids: variantIds,
        quantities: quantity,
      });
      if (response.status == 1) {
        toast.success(t("items_added_to_cart"));
        setShowReorderModal(false);
        await fetchCart();
      } else {
        toast.error(t(response?.message));
        setShowReorderModal(false);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const fetchCart = async () => {
    try {
      const cartData = await api.getCart({
        latitude: city?.latitude,
        longitude: city?.longitude,
      });
      if (cartData.status == 1) {
        dispatch(setCartSubTotal({ data: cartData?.data?.sub_total }));
        dispatch(setSelfPickupMode({ data: cartData?.data?.self_pickup_mode }));
        dispatch(setDoorStepDeliveryMode({data:cartData?.data?.doorstep_delivery_mode}))
        const productsData = cartData?.data?.cart?.map((product) => {
          return {
            product_id: product?.product_id,
            product_variant_id: product?.product_variant_id,
            qty: product?.qty,
          };
        });
        dispatch(setCartProducts({ data: productsData }));
      } else {
        dispatch(setCartProducts({ data: [] }));
        dispatch(setCartSubTotal({ data: 0 }));
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Dialog open={showReoderModal}>
      <DialogOverlay className="backdrop-blur-sm bg-slate-900/40" />
      <DialogContent className="max-w-md bg-white rounded-3xl p-6 md:p-8 shadow-2xl border border-slate-100">
        <div className="flex flex-col items-center text-center">
          <div className="w-14 h-14 rounded-full bg-[#e0f7fe] text-[#0BADFB] flex items-center justify-center mb-4">
            <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">{t("reorder")}</h2>
          <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{t("reOrder_warning")}</p>
          <div className="flex items-center gap-3 mt-6 w-full">
            <button
              className="flex-1 py-2.5 rounded-full border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-sm transition-all shadow-2xs"
              onClick={handleHideReorder}
            >
              {t("cancel")}
            </button>
            <button
              className="flex-1 py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-semibold text-sm shadow-sm transition-all hover:scale-[1.02]"
              onClick={handleReoder}
            >
              {t("Ok")}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ReoderConfirmModal;
