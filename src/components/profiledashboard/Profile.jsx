import React, { useState, useEffect, use } from "react";
import { t } from "@/utils/translation";
import Image from "next/image";
import { FiEdit } from "react-icons/fi";
import { useSelector } from "react-redux";
import * as api from "@/api/apiRoutes";
import { setCurrentUser } from "@/redux/slices/userSlice";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const validateName = (name) => {
  if (!name.trim()) return "Name is required";
  if (name.length < 2) return "Name must be at least 2 characters";
  if (!/^[a-zA-Z\s]+$/.test(name))
    return t("name_can_contain_only_letters_and_spaces");
  return "";
};

const validateEmail = (email) => {
  if (!email.trim()) return "Email is required";
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!regex.test(email)) return t("enter_a_valid_email_address");
  return "";
};

const validateMobile = (mobile) => {
  if (!mobile.trim()) return "Mobile number is required";
  if (!/^[0-9]{6,16}$/.test(mobile))
    return t("enter_a_valid_mobile_number_with_at_least_6_digits");
  return "";
};

const validateImage = (file) => {
  if (!file) return "";
  const allowedTypes = ["image/jpeg", "image/png"];
  if (!allowedTypes.includes(file.type))
    return t("only_jpg_or_png_images_are_allowed");
};

const Profile = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.User.user);
  const authType = useSelector((state) => state.User.authType);

  const [username, setUsername] = useState(user?.name);
  const [email, setEmail] = useState(user?.email);
  const [mobileNumber, setMobileNumber] = useState(user?.mobile);
  const [countryCode, setCountryCode] = useState(user?.country_code || process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in");
  const [profileImage, setProfileImage] = useState(null);
  const [isChanged, setIsChanged] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    setUsername(user?.name);
    setEmail(user?.email);
    setMobileNumber(user?.mobile);
    setCountryCode(user?.country_code || process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in");
  }, []);

  useEffect(() => {
    checkIfChecked();
  }, [username, email, mobileNumber, countryCode, profileImage]);

  const onImageChange = (event) => {
    const file = event.target.files?.[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const checkIfChecked = () => {
    if (
      username !== user?.name ||
      email !== user?.email ||
      mobileNumber !== user?.mobile ||
      countryCode !== user?.country_code ||
      !user?.profileImage
    ) {
      setIsChanged(true);
    } else {
      setIsChanged(false);
    }
  };

  const handlePhoneNoChange = (value, data) => {
    const dialCode = data?.dialCode || "";
    const phoneWithoutDialCode = value.startsWith(dialCode)
      ? value.slice(dialCode.length)
      : value;
    setMobileNumber(phoneWithoutDialCode);
    setCountryCode("+" + dialCode);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    const newErrors = {
      name: validateName(username),
      email:
        authType === "google" || authType === "email"
          ? ""
          : validateEmail(email),
      mobile: authType === "phone" ? "" : validateMobile(mobileNumber),
      image: validateImage(profileImage),
    };

    Object.keys(newErrors).forEach(
      (key) => !newErrors[key] && delete newErrors[key],
    );

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);

      Object.values(newErrors).forEach((error) => {
        toast.error(error, {
          toastId: error,
        });
      });

      return;
    }

    setErrors({});
    try {
      const response = await api.updateProfile({
        name: username,
        email: email,
        mobileNumber: mobileNumber,
        country_code: countryCode,
        image: profileImage,
        type: authType,
      });
      if (response?.status == 1) {
        const user = await api.getUser();
        dispatch(setCurrentUser({ data: user?.user }));
        toast.success(response.message);
      } else {
        toast.error(response.message);
      }
    } catch (error) {
      console.log(("Error", error));
      toast.error("Something went wrong");
    }
  };

  return (
    <div className="w-full bg-white border border-slate-200/80 rounded-3xl shadow-card overflow-hidden">
      <div className="bg-slate-50/80 px-6 py-4 border-b border-slate-100">
        <h2 className="text-lg font-extrabold text-slate-900 tracking-tight">
          {t("editProfile")}
        </h2>
      </div>
      <div className="flex flex-col items-center p-6 md:p-8">
        <form
          className="w-full max-w-xl flex flex-col gap-6"
          onSubmit={handleProfileUpdate}
        >
          {/* Avatar Preview & Upload */}
          <div className="flex justify-center">
            <div className="relative">
              <div className="relative w-28 h-28 rounded-full border-4 border-[#0BADFB]/30 p-1 flex items-center justify-center overflow-hidden bg-slate-50 shadow-md">
                <Image
                  src={
                    profileImage
                      ? URL.createObjectURL(profileImage)
                      : user?.profile
                  }
                  alt="Profile"
                  fill
                  className="h-full w-full object-cover rounded-full"
                  sizes="112px"
                />
              </div>
              <label
                htmlFor="profileImage"
                className="absolute bottom-0 right-0 w-9 h-9 bg-[#0BADFB] hover:bg-[#0298e0] p-2 rounded-full cursor-pointer text-white shadow-md flex items-center justify-center transition-all hover:scale-105 active:scale-95"
                title="Change Avatar"
              >
                <FiEdit size={16} />
              </label>
              <input
                type="file"
                id="profileImage"
                className="hidden"
                accept="image/png, image/jpeg"
                onChange={onImageChange}
              />
            </div>
          </div>

          {/* Form Fields */}
          <div className="flex flex-col gap-4">
            <div>
              <label htmlFor="name" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t("name")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0BADFB] focus:ring-2 focus:ring-[#0BADFB]/20 shadow-xs transition-all disabled:bg-slate-50 disabled:text-slate-400"
                defaultValue={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t("email")} <span className="text-rose-500">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                className="w-full rounded-2xl border border-slate-200 px-4 py-3 text-sm font-semibold text-slate-800 outline-none focus:border-[#0BADFB] focus:ring-2 focus:ring-[#0BADFB]/20 shadow-xs transition-all disabled:bg-slate-50 disabled:text-slate-400"
                defaultValue={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={authType == "google" || authType == "email"}
              />
            </div>

            <div>
              <label htmlFor="mobile" className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5">
                {t("mobileNumber")} <span className="text-rose-500">*</span>
              </label>
              <PhoneInput
                country={process.env.NEXT_PUBLIC_DEFAULT_COUNTRY_CODE || "in"}
                value={countryCode.replace("+", "") + mobileNumber}
                onChange={(phone, data) => handlePhoneNoChange(phone, data)}
                disabled={authType == "phone"}
                inputProps={{
                  name: "mobile",
                  id: "mobile",
                  required: true,
                  placeholder: t("mobileNumber"),
                }}
                containerClass="mt-1"
                inputStyle={{ width: "100%" }}
                inputClass="!w-full !h-11 !rounded-2xl !border !border-slate-200 !py-2.5 !pl-12 !pr-4 !text-sm !font-semibold !text-slate-800 disabled:!bg-slate-50 disabled:!text-slate-400 shadow-xs"
                buttonClass="!rounded-l-2xl !border-slate-200 !bg-slate-50"
              />
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex justify-end">
            <button
              type="submit"
              className="px-8 py-3 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-sm tracking-wide shadow-md shadow-[#0BADFB]/20 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={isChanged == false}
            >
              {t("editProfile")}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Profile;
