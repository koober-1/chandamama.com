"use client";
import react, { useEffect, useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import Image from "next/image";
import { t } from "@/utils/translation";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GoogleLogo from "@/assets/googleLogin.svg";
import OtpInput from "react-otp-input";
import { useDispatch, useSelector } from "react-redux";
import {
  addtoGuestCart,
  setCart,
  setCartProducts,
  setCartSubTotal,
  setDoorStepDeliveryMode,
  setGuestCartTotal,
  setIsGuest,
  setSelfPickupMode,
} from "@/redux/slices/cartSlice";
import {
  setAuthId,
  setAuthType,
  setCurrentUser,
} from "@/redux/slices/userSlice";
import { FaRegEye, FaRegEyeSlash, FaRegEnvelope } from "react-icons/fa";
import { FiPhone } from "react-icons/fi";
import { toast } from "react-toastify";
import {
  signInWithPhoneNumber,
  GoogleAuthProvider,
  signInWithPopup,
  signInWithRedirect,
  RecaptchaVerifier,
} from "firebase/auth";
import { app, auth, initFirebaseFromSetting } from "@/utils/firebase";
import * as api from "@/api/apiRoutes";
import { setTokenThunk } from "@/redux/thunk/loginthunk";
import NewUserModal from "../newusermodal/NewUserModal";
import { RiCloseFill } from "react-icons/ri";
import Register from "../register/Register";
import { setSetting } from "@/redux/slices/settingSlice";
import ForgetPasswordModal from "../forgetpasswordmodal/ForgetPasswordModal";
import { LocalizedLink } from "@/utils/localizedNav";

export function Login({ showLogin, setShowLogin, setMobileActiveKey }) {
  const city = useSelector((state) => state.City.city);
  const cart = useSelector((state) => state.Cart);
  const setting = useSelector((state) => state.Setting.setting);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const fcmToken = useSelector((state) => state.User?.fcm_token);
  const dispatch = useDispatch();
  const inputRef = useRef(null);

  const defaultCountry = setting?.nation_code?.toLowerCase() || process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE;

  const [userName, setUserName] = useState("");
  const [showNewUser, setShowNewUser] = useState(false);
  const [isOTP, setIsOTP] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [otp, setOtp] = useState(null);
  const [email, setEmail] = useState("");
  const [countryCode, setCountryCode] = useState(null);
  const [inputValue, setInputValue] = useState(null);
  const [inputType, setInputType] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState("");
  const [phoneNumberWithoutCountryCode, setPhoneNumberWithoutCountryCode] =
    useState("");
  const [Uid, setUid] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(90);
  const [otpDisabled, setOtpDisabled] = useState(true);
  const [error, setError] = useState("");
  const [userAuthType, setUserAuthType] = useState("");
  const [showRegister, setShowRegister] = useState(false);
  const [showForgetPassword, setShowForgetPassword] = useState(false);
  const [phonePassword, setPhonePassword] = useState("");
  const [forgotPasswordType, setForgotPasswordType] = useState("");
  const [isErrorMessage, setIsErrorMessage] = useState(false);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [inputType]);

  useEffect(() => {
    const dialCode = setting?.country_code || process.env.NEXT_PUBLIC_COUNTRY_DIAL_CODE;
    setCountryCode(dialCode);
  }, []);

  useEffect(() => {
    if (showLogin === true && showRegister === false) {
      if (process.env.NEXT_PUBLIC_DEMO_MODE == "true") {
        setInputType("number");
        dispatch(setAuthType({ data: "number" }));
        setPhoneNumber(`+919876543210`);
        const dialCode = setting?.country_code || process.env.NEXT_PUBLIC_COUNTRY_DIAL_CODE;
        setCountryCode(dialCode);
        setPhoneNumberWithoutCountryCode("9876543210");
        if (inputType != "email") {
          setOtp("123456");
        }
      }
    }
    setInputType("email");
  }, [showLogin]);

  useEffect(() => {
    let interval;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
    } else if (timer === 0) {
      setOtpDisabled(false);
    }

    return () => clearInterval(interval);
  }, [timer]);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds
      .toString()
      .padStart(2, "0")}`;
  };

  useEffect(() => {
    // OTP login is temporarily disabled. Keep the helpers available for a
    // later rollout, but do not initialize Firebase reCAPTCHA in this flow.
    return () => {
      recaptchaClear();
    };
  }, [showLogin]);

  const recaptchaClear = async () => {
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (window.recaptchaVerifier) {
      try {
        window.recaptchaVerifier.clear();
        window.recaptchaVerifier = undefined;
      } catch (error) {
        console.error("Error clearing ReCAPTCHA verifier:", error);
      }
    }
    if (recaptchaContainer) {
      recaptchaContainer.innerHTML = "";
      console.log("ReCAPTCHA container cleared");
    }
  };

  const generateRecaptcha = async () => {
    await recaptchaClear();
    const recaptchaContainer = document.getElementById("recaptcha-container");
    if (!recaptchaContainer) {
      console.error("Container element 'recaptcha-container' not found.");
      return null;
    }
    try {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        recaptchaContainer,
        {
          size: "invisible",
        },
      );
      return window.recaptchaVerifier;
    } catch (error) {
      console.error("Error initializing RecaptchaVerifier:", error.message);
      return null;
    }
  };

  const handleShowRegister = (type) => {
    setShowRegister(true);
    setInputType(type);

    setError("");
  };

  const handleEmailChange = (value, data) => {
    setInputType("email");
    setEmail(value);
    setOtp("");
    setPhoneNumber("");
    setCountryCode("");
  };

  const handlePhoneNoChange = (value, data) => {
    setInputValue(value);
    setInputType("number");
    dispatch(setAuthType({ data: "phone" }));
    const dialCode = data?.dialCode || "";
    const phoneWithoutDialCode = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;
    setPhoneNumber(`+${value}`);
    setPhoneNumberWithoutCountryCode(phoneWithoutDialCode);
    setCountryCode(dialCode);
    setOtp("");
  };
  const handleSendOTP = async (e) => {
    setLoading(true);
    setOtpDisabled(true);
    e.preventDefault();
    if (
      phoneNumber?.length < countryCode.length ||
      phoneNumber?.slice(1) === countryCode
    ) {
      setError(t("please_enter_phone_number"));
      setLoading(false);
    } else {
      const phoneNumberWithoutSpaces = `${phoneNumber}`.replace(/\s+/g, "");
      if (setting?.firebase_authentication == 1) {
        try {
          const confirmationResult = await signInWithPhoneNumber(
            auth,
            phoneNumberWithoutSpaces,
            window.recaptchaVerifier,
          );
          window.confirmationResult = confirmationResult;
          setTimer(90);
          setIsOTP(true);
          setLoading(false);
        } catch (error) {
          console.log("error", error);
          setPhoneNumber();
          setError(error.message);
          setLoading(false);
          setIsOTP(false);
        }
      } else if (setting?.custom_sms_gateway_otp_based == 1) {
        try {
          const res = await api.sendSms({
            mobile: phoneNumberWithoutSpaces,
          });
          if (res?.status == 1) {
            setTimer(90);
            setIsOTP(true);
            setLoading(false);
          } else {
            setError(t("custom_send_sms_error_message"));
            setLoading(false);
          }
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
        dispatch(setAuthId({ data: user.user.id }));
        setUid(user.user.id);
        const loginResponse = await loginApiCall(
          user.user,
          phoneNumberWithoutCountryCode,
          fcmToken,
          "phone",
          `+${countryCode}`,
        );
        setLoading(false);
      } catch (error) {
        setLoading(false);
        toast.error(t("invalid_otp"));
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
          response?.message == "otp_valid_but_user_invalid"
        ) {
          setShowNewUser(true);
          setShowLogin(false);
          setIsOTP(false);
          dispatch(setAuthType({ data: "phone" }));
          setPhoneNumber(mobileNo);
          setUserName("");
          setEmail("");
        } else if (response?.status == 1) {
          const tokenSet = await dispatch(
            setTokenThunk(response?.data?.access_token),
          );
          await getCurrentUser();
          dispatch(setAuthType({ data: "phone" }));
          if (response?.data?.user?.status == 1) {
            dispatch(setIsGuest({ data: false }));
          }
          await handleFetchSetting();
          if (
            cart?.isGuest === true &&
            cart?.guestCart?.length !== 0 &&
            response?.data?.user?.status == 1
          ) {
            await addToBulkCart(response?.data.access_token);
          }
          await fetchCart();
          setError("");
          setOtp("");
          setPhoneNumber("");
          setLoading(false);
          setIsOTP(false);
          setShowLogin(false);
        } else {
          toast.error();
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  };

  const handleFetchSetting = async () => {
    try {
      const res = await api.getSetting();
      const parsedSetting = JSON.parse(atob(res.data));
      dispatch(setSetting({ data: parsedSetting }));
    } catch (error) {
      console.log("error", error);
    }
  };

  const getProductData = (cartData) => {
    const cartProducts = cartData?.cart?.map((product) => {
      return {
        product_id: product?.product_id,
        product_variant_id: product?.product_variant_id,
        qty: product?.qty,
      };
    });
    return cartProducts;
  };

  const fetchCart = async () => {
    const latitude = city?.latitude || setting?.default_city?.latitude;
    const longitude = city?.longitude || setting?.default_city?.longitude;
    try {
      const response = await api.getCart({
        latitude: latitude,
        longitude: longitude,
      });
      if (response.status === 1) {
        dispatch(setCart({ data: response.data }));
        dispatch(setSelfPickupMode({ data: response?.data?.self_pickup_mode }));
        dispatch(
          setDoorStepDeliveryMode({
            data: response?.data?.doorstep_delivery_mode,
          }),
        );
        const productsData = getProductData(response.data);
        dispatch(setCartProducts({ data: productsData }));
        dispatch(setCartSubTotal({ data: response?.data?.sub_total }));
      } else {
        dispatch(setCart({ data: null }));
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const loginApiCall = async (user, id, fcm, type, country_code) => {
    setLoading(true);
    try {
      dispatch(setAuthId({ data: Uid, type }));
      const isPhoneAuthPassword =
        setting?.phone_auth_password == 1 ? true : false;
      const res = await api.login({
        id: id,
        fcm,
        type,
        phoneAuthType: isPhoneAuthPassword,
        password: phonePassword,
        country_code: country_code,
      });
      if (res.status === 1) {
        if (res?.status == 1 && res?.message == "user_deactivated") {
          toast.error(t("user_deactivated"));
          setLoading(false);
          setShowLogin(false);
          return;
        } else {
          const tokenSet = await dispatch(
            setTokenThunk(res?.data?.access_token),
          );
          await getCurrentUser();
          dispatch(setAuthType({ data: type }));
          if (res?.data?.user?.status == 1) {
            dispatch(setIsGuest({ data: false }));
          }
          await handleFetchSetting();
          if (
            cart?.isGuest === true &&
            cart?.guestCart?.length !== 0 &&
            res?.data?.user?.status == 1
          ) {
            await addToBulkCart(res?.data.access_token);
          }
          await fetchCart();
          setError("");
          setOtp("");
          setPhoneNumber("");
          setLoading(false);
          setIsOTP(false);
          setShowLogin(false);
          setShowRegister(false);
        }
      } else if (res.message == "user_exist_with_email") {
        toast.error(t("user_exist_with_email"));
        setLoading(false);
      } else if (res.message == "user_exist_password_blank") {
        setIsErrorMessage(t("forget_password_note"));
        handleShowForgotPassword("phone");
        setLoading(false);
      } else if (res.message == "invalid_password") {
        setError(t("password_not_valid"));
        setPhonePassword("");
        setLoading(false);
      } else if (
        res.message == "user_not_exist" &&
        isPhoneAuthPassword == true
      ) {
        setError(t("user_not_exist"));
        setLoading(false);
      } else if (res?.message == "user_exist_with_google") {
        setError(t("user_exist_with_google"));
        setLoading(false);
      } else {
        setUserAuthType(type);
        setEmail(user?.providerData?.[0]?.email);
        setUserName(user?.providerData?.[0]?.displayName);
        setPhoneNumber(user?.providerData?.[0]?.phoneNumber);
        setShowNewUser(true);
        setShowLogin(false);
        setLoading(false);
      }
    } catch (error) {
      console.error("error", error);
      setLoading(false);
    }
  };

  const getCurrentUser = async () => {
    try {
      const response = await api.getUser();
      dispatch(setCurrentUser({ data: response.user }));
      toast.success(t('login_success'));
    } catch (error) {
      console.log("error", error);
    }
  };

  const handlePasswordShow = () => {
    setShowPassword(!showPassword);
  };

  const handleShowForgotPassword = (type) => {
    setPhonePassword("");
    // setShowLogin(false);
    setForgotPasswordType(type);
    setShowForgetPassword(true);
  };

  const handleHideLogin = async () => {
    await recaptchaClear();
    setIsOTP(false);
    setShowLogin(false);
    setError("");
    setInputValue("");
    setInputType("");
    setLoading(false);
    setMobileActiveKey(1);
    setEmail("");
    setPassword("");
  };

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError("");
    try {
      let activeAuth = auth;
      if (!activeAuth) {
        const fbRes = initFirebaseFromSetting(setting);
        activeAuth = fbRes.auth;
      }

      if (!activeAuth) {
        toast.error("Firebase Authentication is not configured or missing API key.");
        setLoading(false);
        return;
      }

      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({
        prompt: "select_account",
      });

      const result = await signInWithPopup(activeAuth, provider);
      const user = result?.user;
      const userEmail = user?.providerData?.[0]?.email || user?.email;
      
      dispatch(setAuthType({ data: "google" }));
      await loginApiCall(
        user,
        userEmail,
        fcmToken,
        "google",
        null
      );
    } catch (error) {
      setLoading(false);
      console.error("Google Auth error:", error);
      if (error?.code === "auth/popup-blocked") {
        toast.info("Popups are blocked by your browser. Attempting redirect login...");
        try {
          let activeAuth = auth || initFirebaseFromSetting(setting).auth;
          const provider = new GoogleAuthProvider();
          await signInWithRedirect(activeAuth, provider);
        } catch (redirectErr) {
          toast.error("Google Login popup was blocked. Please allow popups for localhost in your browser address bar.");
        }
      } else if (error?.code === "auth/popup-closed-by-user" || error?.message?.includes("auth/popup-closed-by-user")) {
        toast.error(t("popup_closed_by_user") || "Google Login popup closed.");
      } else if (error?.code === "auth/unauthorized-domain") {
        toast.error("Unauthorized domain for Google Login. Please add localhost to Firebase Auth authorized domains.");
      } else {
        toast.error(error?.message || t("google_login_error") || "Google Sign-In failed.");
      }
    }
  };

  const handleEmailLogin = async (e) => {
    setLoading(true);

    if (e != undefined) {
      e.preventDefault();
    }
    if (!email || !password) {
      setError(t("email_password_mandatory"));
      setLoading(false);
      return;
    }
    try {
      const res = await api.login({
        id: email,
        type: "email",
        password: password,
        fcm: fcmToken,
      });
      if (res.status === 1) {
        if (res?.status == 1 && res?.message == "user_deactivated") {
          toast.error(t("user_deactivated"));
          setLoading(false);
          setShowLogin(false);
          return;
        } else {
          const tokenSet = await dispatch(
            setTokenThunk(res?.data?.access_token),
          );
          await getCurrentUser();
          dispatch(setAuthType({ data: "email" }));
          if (res?.data?.user?.status == 1) {
            dispatch(setIsGuest({ data: false }));
          }
          await handleFetchSetting();
          if (
            cart?.isGuest === true &&
            cart?.guestCart?.length !== 0 &&
            res?.data?.user?.status == 1
          ) {
            await addToBulkCart(res?.data.access_token);
          }
          await fetchCart();
          setError("");
          setOtp("");
          setPhoneNumber("");
          setLoading(false);
          setIsOTP(false);
          setShowRegister(false);
          setShowLogin(false);
        }
      } else {
        setLoading(false);
        if (res.message == "email_not_verified") {
          setError(t("email_not_verified"));
          setIsOTP(false);
        } else if (res.message == "user_does_not_exist") {
          setError(t("user_does_not_exist"));
          // setInputValue("")
          setPassword("");
        } else if (res.message == "user_exist_with_email") {
          toast.error(t("user_exist_with_email"));
        } else if (res.message == "user_exist_with_google") {
          toast.error(t("user_exist_with_google"));
          setError(t("user_exist_with_google"));
          setPassword("");
        } else {
          setError(t("password_not_valid"));
          // setInputValue("")
          setPassword("");
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleEmailVerify = async (e) => {
    e.preventDefault();
    try {
      const res = await api.verifyEmail({ email: email, code: otp });
      if (res.status == 1) {
        const tokenSet = await dispatch(setTokenThunk(res?.data?.access_token));
        await getCurrentUser();
        dispatch(setAuthType({ data: "email" }));
        if (res?.data?.user?.status == 1) {
          dispatch(setIsGuest({ data: false }));
        }
        await handleFetchSetting();
        if (
          cart?.isGuest === true &&
          cart?.guestCart?.length !== 0 &&
          res?.data?.user?.status == 1
        ) {
          await addToBulkCart(res?.data?.access_token);
        }
        await fetchCart();
        // props.setShow(false)
        setIsOTP(false);
        setShowLogin(false);
      } else {
        setError(res.message);
        toast.error(res.message);
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const addToBulkCart = async () => {
    try {
      const variantIds = cart?.guestCart?.map((p) => p.product_variant_id);
      const quantities = cart?.guestCart?.map((p) => p.qty);
      const response = await api.addToBulkCart({
        variant_ids: variantIds.join(","),
        quantities: quantities.join(","),
      });
      if (response.status == 1) {
        dispatch(setGuestCartTotal({ data: 0 }));
        dispatch(addtoGuestCart({ data: [] }));
        dispatch(setCartSubTotal({ data: response.sub_total }));
      } else {
        console.log("Error while adding bulk products");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handlePhoneLogin = async (e) => {
    e.preventDefault();
    if (setting?.phone_auth_password == 1) {
      if (
        phoneNumber?.length < countryCode.length ||
        phoneNumber?.slice(1) === countryCode
      ) {
        setError(t("please_enter_phone_number"));
        setLoading(false);
        return;
      } else if (!phonePassword) {
        setError(t("please_enter_password"));
        return;
      } else {
        loginApiCall(
          null,
          phoneNumberWithoutCountryCode,
          fcmToken,
          "phone",
          `+${countryCode}`,
        );
      }
    } else {
      handleSendOTP(e);
    }
  };

  const renderPhoneInput = () => (
    <>
      {error && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
          {error}
        </div>
      )}
      <form onSubmit={handlePhoneLogin} className="flex flex-col gap-3.5">
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t("phone") || "Phone Number"}
          </label>
          <PhoneInput
            inputStyle={{ direction: language?.type }}
            country={defaultCountry}
            value={phoneNumber}
            onChange={(phone, data) => handlePhoneNoChange(phone, data)}
            onCountryChange={(code) => setCountryCode(code)}
            inputProps={{
              name: "phone",
              required: true,
              autoFocus: true,
            }}
          />
        </div>
        {setting?.phone_auth_password == 1 && (
          <div className="flex flex-col gap-1.5">
            <div className="flex justify-between items-center">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
                {t("passwordMessage") || "Password"}
              </label>
              <button
                type="button"
                className="text-xs font-semibold text-[#0BADFB] hover:underline cursor-pointer"
                onClick={() => handleShowForgotPassword("phone")}
              >
                {t("forget_password_?")}
              </button>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={phonePassword}
                onChange={(e) => setPhonePassword(e.target.value)}
                className="w-full pl-4 pr-11 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
                placeholder={t("passwordMessage")}
              />
              <button
                type="button"
                aria-label="Toggle password visibility"
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
                onClick={handlePasswordShow}
              >
                {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
              </button>
            </div>
          </div>
        )}
        <button
          disabled={loading}
          type="submit"
          className="w-full mt-2 bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {t("loading")}
            </span>
          ) : (
            t("continue")
          )}
        </button>
        {setting?.phone_auth_password == 1 && (
          <div className="mt-3 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
              {t("registerMsg")}{" "}
              <button
                type="button"
                onClick={() => handleShowRegister("number")}
                className="text-[#0BADFB] hover:underline font-bold transition-colors cursor-pointer ml-1"
              >
                {t("registerNow")}
              </button>
            </p>
          </div>
        )}
      </form>
    </>
  );

  const renderEmailInput = () => (
    <>
      {error && (
        <div className="mb-3 p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
          {error}
        </div>
      )}

      <form className="flex flex-col gap-3.5" onSubmit={handleEmailLogin}>
        <div className="flex flex-col gap-1.5">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {t("email")}
          </label>
          <input
            value={email}
            onChange={(e) => handleEmailChange(e.target.value, {})}
            className="w-full px-4 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
            placeholder={t("please_enter_email")}
            ref={inputRef}
            type="email"
            autoComplete="email"
          />
        </div>

        <div className="flex flex-col gap-1.5">
          <div className="flex justify-between items-center">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
              {t("passwordMessage") || "Password"}
            </label>
            <button
              type="button"
              onClick={() => handleShowForgotPassword("email")}
              className="text-xs font-semibold text-[#0BADFB] hover:underline cursor-pointer"
            >
              {t("forget_password_?")}
            </button>
          </div>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-4 pr-11 py-3 bg-slate-50/80 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white placeholder:text-slate-400 text-sm font-medium focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200"
              placeholder={t("passwordMessage")}
              autoComplete="current-password"
            />
            <button
              type="button"
              aria-label="Toggle password visibility"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-1 cursor-pointer transition-colors"
              onClick={handlePasswordShow}
            >
              {showPassword ? <FaRegEyeSlash size={16} /> : <FaRegEye size={16} />}
            </button>
          </div>
        </div>

        <button
          disabled={loading}
          type="submit"
          className="w-full mt-2 bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
        >
          {loading ? (
            <span className="flex items-center gap-2">
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
              {t("loading")}
            </span>
          ) : (
            t("continue")
          )}
        </button>

        <div className="mt-3 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">
            {t("registerMsg")}{" "}
            <button
              type="button"
              onClick={() => handleShowRegister("email")}
              className="text-[#0BADFB] hover:underline font-bold transition-colors cursor-pointer ml-1"
            >
              {t("registerNow")}
            </button>
          </p>
        </div>
      </form>
    </>
  );

  return (
    <>
      <Dialog open={showLogin}>
        <DialogContent className="overflow-y-auto overflow-x-hidden max-w-[440px] w-full p-6 sm:p-7 rounded-3xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-2xl">
          <DialogHeader className="flex justify-between items-center flex-row pb-1">
            <DialogTitle className="flex items-center gap-2">
              <span className="inline-block w-2.5 h-2.5 rounded-full bg-[#0BADFB]" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-200">
                {t("login")}
              </span>
            </DialogTitle>
            <DialogDescription className="sr-only">
              Sign in to your account using phone, email, or Google
            </DialogDescription>
            <button
              type="button"
              aria-label="Close"
              onClick={() => handleHideLogin()}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 flex items-center justify-center transition-all cursor-pointer"
            >
              <RiCloseFill size={20} />
            </button>
          </DialogHeader>

          <div>
            <div className="mb-5 mt-1">
              {isOTP ? (
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t("enter_verification_code")}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-1 leading-relaxed">
                    {t("otp_send_message")}
                  </p>
                  <div className="mt-2.5 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#0BADFB]/10 text-[#0BADFB] text-xs font-semibold">
                    <span>{inputType === "email" ? t("email") : t("phone")}:</span>
                    <span className="font-bold">{inputType === "email" ? email : phoneNumber}</span>
                  </div>
                </div>
              ) : (
                <div>
                  <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {t("welcome")}
                  </h2>
                  {(setting?.email_login == 1 || setting?.phone_login == 1) && (
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-normal mt-1 leading-relaxed">
                      {t("login_message")}
                    </p>
                  )}
                </div>
              )}
            </div>

            <div>
              {isOTP ? (
                <form
                  onSubmit={
                    inputType == "email"
                      ? handleEmailVerify
                      : handleOtpVerification
                  }
                >
                  <div className="flex items-center justify-center flex-col py-2">
                    {error && (
                      <div className="mb-4 w-full p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900/50 text-rose-600 dark:text-rose-400 text-xs font-medium text-center">
                        {error}
                      </div>
                    )}
                    <OtpInput
                      className="mx-auto items-center flex justify-center gap-2 sm:gap-3 p-0"
                      value={otp}
                      onChange={setOtp}
                      numInputs={6}
                      inputType="number"
                      renderInput={(props) => (
                        <input
                          {...props}
                          className="w-10 sm:w-12 h-12 text-center text-lg font-bold bg-slate-50/90 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl text-slate-900 dark:text-white focus:bg-white dark:focus:bg-slate-800 focus:border-[#0BADFB] focus:ring-4 focus:ring-[#0BADFB]/15 outline-none transition-all duration-200 shadow-2xs"
                        />
                      )}
                    />
                  </div>

                  <button
                    className="w-full mt-6 bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] disabled:opacity-60 text-white font-bold text-sm py-3 px-6 rounded-xl shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all duration-200 cursor-pointer flex items-center justify-center gap-2"
                    type="submit"
                  >
                    {loading == true ? (
                      <span className="flex items-center gap-2">
                        <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                        {t("loading")}
                      </span>
                    ) : (
                      t("login")
                    )}
                  </button>

                  {inputType == "number" && (
                    <div className="mt-4 text-center">
                      <button
                        type="button"
                        onClick={handleSendOTP}
                        disabled={otpDisabled}
                        className="text-xs font-semibold text-slate-600 dark:text-slate-400 disabled:opacity-60 enabled:hover:text-[#0BADFB] transition-colors cursor-pointer"
                      >
                        {timer === 0 ? (
                          <span className="text-[#0BADFB] font-bold underline">Resend OTP</span>
                        ) : (
                          <>
                            {t("resetOtpIn")}{" "}
                            <span className="font-bold text-[#0BADFB]">{formatTime(timer)}</span>
                          </>
                        )}
                      </button>
                    </div>
                  )}
                </form>
              ) : (
                <>
                  {/* Optional Tab Toggle if both email and phone login are enabled */}
                  {setting?.email_login == 1 && setting?.phone_login == 1 && (
                    <div className="flex p-1 bg-slate-100 dark:bg-slate-800 rounded-xl mb-4">
                      <button
                        type="button"
                        onClick={() => {
                          setInputType("email");
                          setError("");
                        }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          inputType === "email"
                            ? "bg-white dark:bg-slate-700 text-[#0BADFB] shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                      >
                        {t("email") || "Email"}
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setInputType("number");
                          setError("");
                        }}
                        className={`flex-1 py-1.5 text-xs font-bold rounded-lg transition-all cursor-pointer ${
                          inputType === "number"
                            ? "bg-white dark:bg-slate-700 text-[#0BADFB] shadow-xs"
                            : "text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
                        }`}
                      >
                        {t("phone") || "Phone"}
                      </button>
                    </div>
                  )}

                  <div className="flex flex-col">
                    {inputType === "number" ? renderPhoneInput() : renderEmailInput()}
                  </div>

                  {/* Google Social Login */}
                  {(setting?.google_login == 1 || setting?.google_login == "1" || setting?.google_login === undefined) && (
                    <>
                      <div className="relative my-4">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-slate-200 dark:border-slate-800" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white dark:bg-slate-900 px-3 text-slate-400 font-semibold">
                            {t("or") || "OR"}
                          </span>
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={loading}
                        className="w-full flex items-center justify-center gap-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700/80 text-slate-700 dark:text-slate-200 font-bold text-sm py-3 px-5 rounded-xl shadow-2xs hover:shadow-md transition-all duration-200 cursor-pointer active:scale-[0.99] disabled:opacity-60"
                      >
                        <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                          />
                        </svg>
                        <span>{t("continue_with_google") || "Continue with Google"}</span>
                      </button>
                    </>
                  )}

                  <div className="pt-4 mt-6 border-t border-slate-100 dark:border-slate-800 text-center">
                    <p className="text-xs text-slate-400 dark:text-slate-500 leading-relaxed max-w-xs mx-auto">
                      {t("agreement_updated_message")}{" "}
                      <span className="font-semibold text-slate-600 dark:text-slate-300">
                        {setting?.web_settings?.site_title || "Chandamama"}
                      </span>{" "}
                      <LocalizedLink
                        href="/terms-and-conditions"
                        className="text-[#0BADFB] hover:underline font-semibold transition-colors"
                      >
                        {t("terms_of_service")}
                      </LocalizedLink>{" "}
                      {t("and")}{" "}
                      <LocalizedLink
                        href="/privacy-policy"
                        className="text-[#0BADFB] hover:underline font-semibold transition-colors"
                      >
                        {t("privacy_policy")}
                      </LocalizedLink>
                    </p>
                  </div>
                </>
              )}
            </div>
          </div>
          <div id="recaptcha-container" style={{ display: "none" }}></div>
        </DialogContent>
      </Dialog>
      <Register
        setShowRegister={setShowRegister}
        showRegister={showRegister}
        setIsOTP={setIsOTP}
        email={email}
        setEmail={setEmail}
        setOtp={setOtp}
        inputType={inputType}
        setTimer={setTimer}
        setShowLogin={setShowLogin}
      />
      <NewUserModal
        showNewUser={showNewUser}
        setShowNewUser={setShowNewUser}
        setUserName={setUserName}
        setPhoneNumberWithoutCountryCode={setPhoneNumberWithoutCountryCode}
        setEmail={setEmail}
        userName={userName}
        email={email}
        phoneNumberWithoutCountryCode={phoneNumberWithoutCountryCode}
        countryCode={countryCode}
        setCountryCode={setCountryCode}
        setIsOTP={setIsOTP}
      />
      <ForgetPasswordModal
        showForgetPassword={showForgetPassword}
        setShowForgetPassword={setShowForgetPassword}
        forgotPasswordType={forgotPasswordType}
        isErrorMessage={isErrorMessage}
      />
    </>
  );
}

export default Login;
