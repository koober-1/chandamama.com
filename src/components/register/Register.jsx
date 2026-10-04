import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { RiCloseFill } from "react-icons/ri";
import { FaRegEye, FaRegEyeSlash } from "react-icons/fa";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import { setTokenThunk } from "@/redux/thunk/loginthunk";
import {
  setAuthType,
  setCurrentUser,
} from "@/redux/slices/userSlice";
import { setIsGuest } from "@/redux/slices/cartSlice";
import { t } from "@/utils/translation";

const Register = ({ showRegister, setShowRegister, setShowLogin }) => {
  const dispatch = useDispatch();
  const fcmToken = useSelector((state) => state.User?.fcm_token);

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const resetForm = () => {
    setEmail("");
    setPassword("");
    setConfirmPassword("");
    setShowPassword(false);
    setError("");
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    setShowRegister(false);
  };

  const handleRegister = async (event) => {
    event.preventDefault();
    setError("");

    const normalizedEmail = email.trim().toLowerCase();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailPattern.test(normalizedEmail)) {
      setError(t("please_enter_email"));
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Password and confirm password do not match.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.registerUser({
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        type: "email",
        password,
        password_confirmation: confirmPassword,
        fcm: fcmToken,
      });

      if (response?.status !== 1 || !response?.data?.access_token) {
        setError(t(response?.message || "Something went wrong"));
        return;
      }

      await dispatch(setTokenThunk(response.data.access_token));
      dispatch(setCurrentUser({ data: response.data.user }));
      dispatch(setAuthType({ data: "email" }));
      dispatch(setIsGuest({ data: false }));
      toast.success(t("succesfull_register_message"));
      resetForm();
      setShowRegister(false);
      setShowLogin(false);
    } catch (registrationError) {
      console.error("Registration failed", registrationError);
      setError(t("Something went wrong"));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={showRegister}>
      <DialogContent className="overflow-y-auto max-h-[90%] max-w-[440px] w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl">
        <DialogHeader className="flex justify-between flex-row items-center pb-1">
          <DialogTitle className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0BADFB]" />
            <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              {t("register")}
            </span>
          </DialogTitle>
          <DialogDescription className="sr-only">
            Create a new account on Chandamama
          </DialogDescription>
          <button
            type="button"
            aria-label="Close registration"
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer"
            onClick={handleClose}
          >
            <RiCloseFill size={20} />
          </button>
        </DialogHeader>

        <div className="mb-4 mt-1">
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("welcome")}
          </h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-1 leading-relaxed">
            Create an account to start your Chandamama shopping journey.
          </p>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
          {error && (
            <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
              {error}
            </div>
          )}

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-email" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t("email")} <span className="text-rose-500">*</span>
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
              placeholder={t("please_enter_email")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-password" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t("password")} <span className="text-rose-500">*</span>
            </label>
            <div className="relative">
              <input
                id="register-password"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                required
                minLength={6}
                className="w-full pl-4 pr-11 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
                placeholder={t("passwordMessage")}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
              <button
                type="button"
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
                onClick={() => setShowPassword((visible) => !visible)}
              >
                {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-1.5">
            <label htmlFor="register-confirm-password" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              Confirm Password <span className="text-rose-500">*</span>
            </label>
            <input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full mt-2 bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                {t("loading")}
              </span>
            ) : (
              t("register")
            )}
          </button>

          <div className="pt-2 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {t("alreadyHaveAnAccount")}{" "}
              <button
                type="button"
                className="text-[#0BADFB] hover:underline font-bold transition-colors cursor-pointer ml-1"
                onClick={() => {
                  setShowRegister(false);
                  setShowLogin(true);
                }}
              >
                {t("signIn")}
              </button>
            </p>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Register;
