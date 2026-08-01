import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { RiCloseFill } from "react-icons/ri";
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
  const setting = useSelector((state) => state.Setting.setting);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const fcmToken = useSelector((state) => state.User?.fcm_token);

  const [email, setEmail] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [mobile, setMobile] = useState("");
  const [countryCode, setCountryCode] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const dialCode =
      setting?.country_code || process.env.NEXT_PUBLIC_COUNTRY_DIAL_CODE || "91";
    setCountryCode(String(dialCode).replace(/\D/g, ""));
  }, [setting?.country_code]);

  const resetForm = () => {
    setEmail("");
    setPhoneNumber("");
    setMobile("");
    setError("");
    setIsLoading(false);
  };

  const handleClose = () => {
    resetForm();
    setShowRegister(false);
  };

  const handlePhoneChange = (value, data) => {
    const dialCode = data?.dialCode || countryCode;
    const localMobile = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;

    setPhoneNumber(value);
    setMobile(localMobile);
    setCountryCode(dialCode);
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

    if (!mobile) {
      setError(t("please_enter_phone_number"));
      return;
    }

    setIsLoading(true);
    try {
      const response = await api.registerUser({
        name: normalizedEmail.split("@")[0],
        email: normalizedEmail,
        mobile,
        country_code: countryCode,
        type: "email",
        // Current business rule: the mobile number is the initial password.
        password: mobile,
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
            Register quickly with your email and phone number.
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

          <div className="flex flex-col gap-1">
            <label className="font-bold text-base">
              {t("mobileNumber")} <span className="text-red-500">*</span>
            </label>
            <PhoneInput
              inputStyle={{ direction: language?.type }}
              country={
                setting?.nation_code?.toLowerCase() ||
                process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE
              }
              value={phoneNumber}
              onChange={handlePhoneChange}
              inputProps={{ required: true, autoComplete: "tel" }}
              className="w-full"
            />
          </div>

          <p className="text-xs textColor">
            Your phone number will be your initial password. You can change it
            later from your profile.
          </p>

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
