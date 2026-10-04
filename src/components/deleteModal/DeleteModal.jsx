import React from "react";
import { Dialog, DialogContent, DialogOverlay } from "@/components/ui/dialog";
import { t } from "@/utils/translation";
import { useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import { clearAllFilter } from "@/redux/slices/productFilterSlice";
import {
  logoutAuth,
  setJWTToken,
  setCurrentUser,
  setAuthType,
} from "@/redux/slices/userSlice";
import {
  setCart,
  setCartProducts,
  setCartSubTotal,
  setIsGuest,
} from "@/redux/slices/cartSlice";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

const DeleteModal = ({ showDelete, setShowDelete }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User);
  const theme = useSelector((state) => state.Theme.theme);

  const handleHideDelete = () => {
    setShowDelete(false);
  };

  const handleDelete = async () => {
    try {
      const response = await api.deleteUser({ uid: user?.authId });
      if (response.status == 1) {
        if (user?.authType == "phone" || user?.authType == "google") {
          // const user = auth.currentUser;
          try {
            // const res = await user.delete();
            dispatch(clearAllFilter());
            dispatch(logoutAuth());
            dispatch(setJWTToken({ data: "" }));
            dispatch(setCurrentUser({ data: null }));
            dispatch(setCart({ data: [] }));
            dispatch(setCartProducts({ data: [] }));
            dispatch(setCartSubTotal({ data: 0 }));
            dispatch(setCartProducts({ data: [] }));
            dispatch(setIsGuest({ data: true }));
            router.push("/");
            setShowDelete(false);
            toast.success(response.message);
          } catch (error) {
            console.log("error", error);
          }
        } else {
          dispatch(clearAllFilter());
          dispatch(logoutAuth());
          dispatch(setJWTToken({ data: "" }));
          dispatch(setCurrentUser({ data: null }));
          dispatch(setCart({ data: [] }));
          dispatch(setCartProducts({ data: [] }));
          dispatch(setCartSubTotal({ data: 0 }));
          dispatch(setCartProducts({ data: [] }));
          dispatch(setIsGuest({ data: true }));
          router.push("/");
          setShowDelete(false);
          toast.success(response.message);
        }
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  return (
    <Dialog open={showDelete}>
      <DialogOverlay
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 transition-opacity"
      />
      <DialogContent className="sm:max-w-md p-6 rounded-2xl bg-white border border-slate-100 shadow-2xl z-50">
        <div className="flex flex-col items-center text-center">
          <div className="w-12 h-12 rounded-full bg-rose-50 text-rose-500 border border-rose-100 flex items-center justify-center mb-4">
            <svg
              className="w-6 h-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
              />
            </svg>
          </div>
          <h3 className="font-bold text-base text-slate-900">
            {t("delete") || "Confirm Deletion"}
          </h3>
          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-xs">
            {t("delete_user_message") || "Are you sure you want to delete your account? This action cannot be undone."}
          </p>
          <div className="flex items-center gap-3 mt-6 w-full">
            <button
              type="button"
              className="flex-1 py-2.5 rounded-full border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold transition-colors"
              onClick={handleHideDelete}
            >
              {t("cancel") || "Cancel"}
            </button>
            <button
              type="button"
              className="flex-1 py-2.5 rounded-full bg-rose-600 hover:bg-rose-700 text-white text-xs font-semibold shadow-xs hover:shadow transition-all"
              onClick={handleDelete}
            >
              {t("Ok") || "Delete"}
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DeleteModal;
