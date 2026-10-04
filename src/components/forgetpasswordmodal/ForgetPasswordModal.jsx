import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { RiCloseFill } from "react-icons/ri";
import { t } from "@/utils/translation";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import * as api from "@/api/apiRoutes";
import { toast, ToastContainer } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import { useSelector } from "react-redux";
import { signInWithPhoneNumber } from "firebase/auth";
import { auth } from "@/utils/firebase";


const ForgetPasswordModal = ({
  showForgetPassword,
  setShowForgetPassword,
  forgotPasswordType,
  isErrorMessage,
}) => {
  const language = useSelector((state) => state.Language.selectedLanguage);
  const setting = useSelector((state) => state.Setting.setting);
  const defaultCountry = setting?.nation_code?.toLowerCase() || process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE;
  const [stage, setStage] = useState(0);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPass, setShowConfirmPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [countryCode, setCountryCode] = useState(null);
  const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] =
    useState("");
  const [error, setError] = useState("");

  const handleOtpChange = (e) => {
    const value = e.target.value;
    if (/^\d{0,6}$/.test(value)) {
      setOtp(value);
    }
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleConfirmPasswordChange = (e) => {
    setConfirmPassword(e.target.value);
  };
  const handleShowPassword = () => {
    setShowPassword(!showPassword);
  };

  const handleShowConfirmPassword = () => {
    setShowConfirmPass(!showConfirmPass);
  };

  const handleShowModal = () => {
    setStage(0);
    setLoading(false);
    setPhoneNumber(null);
    setEmail(null);
    setShowForgetPassword(false);
  };

  const handleForgetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      const res = await api.forgotPasswordOTP({ email: email });
      if (res.status == 1) {
        setStage(1);
        toast.success(t("verification_mail_sent_successfully"));
        setLoading(false);
      } else {
        if (res.message == "email_is_not_registered") {
          toast.error(t("email_is_not_registered"));
          setLoading(false);
        } else {
          setLoading(false);
          toast.error(res.message);
        }
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handleSendOTP = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (
      phoneNumber?.length < countryCode.length ||
      phoneNumber?.slice(1) === countryCode
    ) {
      setError("Please enter phone number!");
      setLoading(false);
    } else {
      const phoneNumberWithoutSpaces = `${phoneNumber}`.replace(/\s+/g, "");
      if (setting?.firebase_authentication == 1) {
        try {
          const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumberWithoutSpaces,
            window.recaptchaVerifier
          );
          window.confirmationResult = confirmationResult;
          // setTimer(90);
          setLoading(false);
          setStage(1);
        } catch (error) {
          console.log("error from send otp", error);
          setPhoneNumber();
          setError(error.message);
          setLoading(false);
          // setIsOTP(false);
        }
      } else if (setting?.custom_sms_gateway_otp_based == 1) {
        try {
          const res = await api.sendSms({
            mobile: phoneNumberWithoutSpaces,
          });
        } catch (error) {
          setPhoneNumber();
          setError(t("custom_send_sms_error_message"));
          setLoading(false);
        }
      } else {
        toast.error(t("Something went wrong"));
        setLoading(false);
      }
    }
  };

  const handleOtpVerification = async (e) => {
    e.preventDefault();
    if (otp == "") {
      toast.error(t("otp_required"));
      return;
    }
    if (setting?.firebase_authentication == 1) {
      setLoading(true);
      try {
        const user = await window.confirmationResult.confirm(otp);
        setLoading(false);
        return true;
      } catch (error) {
        setLoading(false);
        toast.error(t("invalid_otp"));
        return false;
      }
    } else if (setting?.custom_sms_gateway_otp_based == 1) {
      const mobileNo = phoneNumber?.split(" ")?.[1];
      try {
        const response = await api.verifyOTP({
          mobile: phoneNumberWithoutCountryCode,
          country_code: `+${countryCode}`,
          otp: otp,
        });
        if (
          response?.status == 1 &&
          res?.message ==
            "OTP is valid, but no user found with this phone number."
        ) {
          return false;
        } else if (response?.status == 1) {
          return true;
        } else {
          return false;
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleEmailResetPassword = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error(t("confirm_password_message"));
        setLoading(false);
        return;
      }
      const res = await api.forgotPassword({
        email: email,
        otp: otp,
        password: password,
        confirmPassword: confirmPassword,
        type: forgotPasswordType,
      });
      if (res.status == 1) {
        setConfirmPassword("");
        setOtp("");
        setPassword("");
        setEmail("");
        setShowForgetPassword(false);
        toast.success(res.message);
        setStage(0);
        setLoading(false);
      } else {
        setLoading(false);
        setStage(1);
        toast.error(res.message);
      }
    } catch (error) {
      setLoading(false);
      console.log("error", error);
    }
  };

  const handlePhoneNoChange = async (value, data) => {
    const dialCode = data?.dialCode || "";
    const phoneWithoutDialCode = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;
    setPhoneNumber(`+${value}`);
    setPhoneNumberWithoutCountryCode(phoneWithoutDialCode);
    setCountryCode("+" + dialCode);
  };

  const verifyUser = async (e) => {
    e.preventDefault();
    try {
      const res = await api.verifyUserByPhoneNum({
        mobile: phoneNumberWithoutCountryCode,
        countryCode: countryCode,
        type: "phone",
      });
      if (res?.message == "user_already_exist") {
        handleSendOTP(e);
      } else {
        setShowForgetPassword(false);
        setPhoneNumber("");
        toast.error(t("user_already_exist_message"));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleMobilePasswordChange = async (e) => {
    setLoading(true);
    e.preventDefault();
    try {
      if (password !== confirmPassword) {
        toast.error(t("confirm_password_message"));
        setLoading(false);
        return;
      }
      const otpRes = await handleOtpVerification(e);
      if (otpRes == false) {
        toast.error(t("invalid_otp"));
        setLoading(false);
        setPassword("");
        setConfirmPassword("");
        return;
      }
      const res = await api.forgotPassword({
        phone: phoneNumberWithoutCountryCode,
        otpMethod: "firebase",
        type: forgotPasswordType,
        password: password,
        confirmPassword,
        country_code: countryCode,
      });
      if (res.status == 1) {
        toast.success(res.message);
        setOtp(null);
        setPassword("");
        setConfirmPassword("");
        setShowForgetPassword(false);
        setStage(0);
      } else {
        toast.error(res.message);
        setOtp(null);
        setPassword("");
        setConfirmPassword("");
        setShowForgetPassword(false);
        setStage(0);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleResetPassword = async (e) => {
    if (forgotPasswordType == "email") {
      handleEmailResetPassword(e);
    } else {
      handleMobilePasswordChange(e);
    }
  };

  return (
    <Dialog open={showForgetPassword}>
      <DialogContent className="overflow-y-auto max-w-[440px] w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl">
        <DialogHeader className="flex justify-between items-center flex-row pb-1">
          <div className="flex items-center gap-2">
            <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0BADFB]" />
            <h1 className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
              {t("forget_password")}
            </h1>
          </div>
          <button
            type="button"
            aria-label="Close"
            onClick={() => handleShowModal()}
            className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer"
          >
            <RiCloseFill size={20} />
          </button>
        </DialogHeader>

        <div className="mt-1">
          {stage == 0 ? (
            <div className="flex flex-col w-full gap-4">
              <div className="flex flex-col gap-1.5">
                {isErrorMessage && (
                  <p className="text-rose-500 font-semibold text-xs mb-1">
                    {t("forget_password_note")}
                  </p>
                )}
                {forgotPasswordType == "email" ? (
                  <>
                    <label htmlFor="email" className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {t("email")} <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      placeholder={t("emailPlaceholder")}
                      className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
                      value={email}
                      onChange={handleEmailChange}
                    />
                  </>
                ) : (
                  <>
                    <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                      {t("phone") || "Phone"} <span className="text-rose-500">*</span>
                    </label>
                    <PhoneInput
                      inputStyle={{ direction: language?.type }}
                      country={defaultCountry}
                      value={phoneNumber}
                      onChange={(phone, data) =>
                        handlePhoneNoChange(phone, data)
                      }
                      onCountryChange={(code) => setCountryCode(code)}
                      inputProps={{
                        name: "phone",
                        required: true,
                        autoFocus: true,
                      }}
                    />
                  </>
                )}
              </div>
              {forgotPasswordType == "email" ? (
                <button
                  className="w-full mt-2 bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  onClick={handleForgetPassword}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      {t("loading")}
                    </span>
                  ) : (
                    t("get_mail")
                  )}
                </button>
              ) : (
                <button
                  className="w-full mt-2 bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                  onClick={verifyUser}
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                      {t("loading")}
                    </span>
                  ) : (
                    t("verify_user")
                  )}
                </button>
              )}
            </div>
          ) : (
            <div className="flex flex-col w-full gap-3.5">
              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t("otp")} <span className="text-rose-500">*</span>
                </span>
                <input
                  type="number"
                  inputMode="numeric"
                  pattern="\d*"
                  className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
                  placeholder={t("otpPlaceholder")}
                  value={otp}
                  onChange={handleOtpChange}
                  maxLength={6}
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t("password")} <span className="text-rose-500">*</span>
                </span>
                <div className="relative w-full">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full pl-4 pr-11 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
                    placeholder={t("please_enter_password")}
                    value={password}
                    onChange={handlePasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
                    onClick={handleShowPassword}
                  >
                    {showPassword ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                  {t("confirmPassword")} <span className="text-rose-500">*</span>
                </span>
                <div className="relative w-full">
                  <input
                    type={showConfirmPass ? "text" : "password"}
                    className="w-full pl-4 pr-11 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
                    placeholder={t("please_enter_confirm_password")}
                    value={confirmPassword}
                    onChange={handleConfirmPasswordChange}
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
                    onClick={handleShowConfirmPassword}
                  >
                    {showConfirmPass ? <FaEyeSlash size={16} /> : <FaEye size={16} />}
                  </button>
                </div>
              </div>

              <button
                className="w-full mt-2 bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                onClick={handleResetPassword}
                disabled={loading}
              >
                {loading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    {t("loading")}
                  </span>
                ) : (
                  t("reset_password")
                )}
              </button>
            </div>
          )}
          <div id="recaptcha-container" style={{ display: "none" }}></div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ForgetPasswordModal;
