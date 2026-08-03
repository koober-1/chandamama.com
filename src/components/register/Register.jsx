import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
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
      <DialogContent className="overflow-y-auto max-h-[90%]">
        <DialogHeader className="flex justify-between flex-row items-center">
          <h1 className="text-3xl font-bold">{t("register")}</h1>
          <button
            type="button"
            aria-label="Close registration"
            className="closeButtonBg rounded-full p-2 cursor-pointer"
            onClick={handleClose}
          >
            <RiCloseFill size={22} />
          </button>
        </DialogHeader>

        <div className="flex flex-col mb-5">
          <h5 className="text-[34px] font-bold textColor">{t("welcome")}</h5>
          <span className="textColor text-xs">
            Register with your email and password.
          </span>
        </div>

        <form onSubmit={handleRegister} className="flex flex-col gap-4">
          {error && (
            <p className="text-center text-xs text-red-500 font-semibold">
              {error}
            </p>
          )}

          <div className="flex flex-col gap-1">
            <label htmlFor="register-email" className="font-bold text-base">
              {t("email")} <span className="text-red-500">*</span>
            </label>
            <input
              id="register-email"
              type="email"
              autoComplete="email"
              required
              className="py-2 px-4 cardBorder outline-none rounded-sm"
              placeholder={t("please_enter_email")}
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="flex flex-col gap-1 relative">
            <label htmlFor="register-password" className="font-bold text-base">
              {t("password")} <span className="text-red-500">*</span>
            </label>
            <input
              id="register-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              className="py-2 pl-4 pr-10 cardBorder outline-none rounded-sm"
              placeholder={t("passwordMessage")}
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
            <button
              type="button"
              aria-label={showPassword ? "Hide password" : "Show password"}
              className="absolute right-3 bottom-3"
              onClick={() => setShowPassword((visible) => !visible)}
            >
              {showPassword ? <FaRegEyeSlash /> : <FaRegEye />}
            </button>
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="register-confirm-password" className="font-bold text-base">
              Confirm Password <span className="text-red-500">*</span>
            </label>
            <input
              id="register-confirm-password"
              type={showPassword ? "text" : "password"}
              autoComplete="new-password"
              required
              minLength={6}
              className="py-2 px-4 cardBorder outline-none rounded-sm"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="bg-[#29363F] disabled:opacity-60 py-2 px-4 text-white rounded-sm text-xl"
          >
            {isLoading ? t("loading") : t("register")}
          </button>

          <span className="text-base font-medium text-center">
            {t("alreadyHaveAnAccount")} {" "}
            <button
              type="button"
              className="primaryColor underline ml-1"
              onClick={() => setShowRegister(false)}
            >
              {t("signIn")}
            </button>
          </span>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default Register;
