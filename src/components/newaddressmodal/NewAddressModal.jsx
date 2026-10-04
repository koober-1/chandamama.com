import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { t } from "@/utils/translation";
import { RiCloseFill } from "react-icons/ri";
import * as api from "@/api/apiRoutes";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const NewAddressModal = ({
  showAddAddres,
  setShowAddAddres,
  isAddressSelected,
  fetchAddress,
}) => {
  const addresses = useSelector((state) => state.Addresses);
  const city = useSelector((state) => state.City.city);
  const [loading, setLoading] = useState(false);
  const [addressDetails, setaddressDetails] = useState({
    name: "",
    mobile_num: "",
    email: "",
    alternate_mobile_num: "",
    address: "",
    landmark: "",
    city: "",
    area: "",
    pincode: "",
    state: "",
    country: "",
    address_type: "Home",
    is_default: true,
  });

  useEffect(() => {
    if (isAddressSelected && addresses.selectedEditAddress) {
      setaddressDetails({
        name: addresses.selectedEditAddress.name || "",
        mobile_num: addresses.selectedEditAddress.mobile || "",
        email: addresses.selectedEditAddress.email || "",
        alternate_mobile_num: addresses.selectedEditAddress.alternate_mobile || "",
        address: addresses.selectedEditAddress.address || "",
        landmark: addresses.selectedEditAddress.landmark || "",
        city: addresses.selectedEditAddress.city || "",
        area: addresses.selectedEditAddress.area || "",
        pincode: addresses.selectedEditAddress.pincode || "",
        state: addresses.selectedEditAddress.state || addresses.selectedEditAddress.country || "",
        country: addresses.selectedEditAddress.country || "",
        address_type: addresses.selectedEditAddress.type || "Home",
        is_default: addresses.selectedEditAddress.is_default === 1,
      });
    } else {
      setaddressDetails({
        name: "",
        mobile_num: "",
        email: "",
        alternate_mobile_num: "",
        address: "",
        landmark: "",
        city: "",
        area: "",
        pincode: "",
        state: "",
        country: "",
        address_type: "Home",
        is_default: true,
      });
    }
  }, [isAddressSelected, addresses?.selectedEditAddress, showAddAddres]);

  const handleConfirmAddress = async (e) => {
    e.preventDefault();
    const lat = parseFloat(city?.latitude || city?.city?.latitude || 22.7196);
    const lng = parseFloat(city?.longitude || city?.city?.longitude || 75.8577);

    setLoading(true);
    try {
      const payload = {
        name: addressDetails.name,
        mobile: addressDetails.mobile_num,
        email: addressDetails.email,
        type: addressDetails.address_type,
        address: addressDetails.address,
        landmark: addressDetails.landmark,
        area: addressDetails.area,
        pincode: addressDetails.pincode,
        city: addressDetails.city,
        state: addressDetails.state,
        country: addressDetails.country,
        alternate_mobile: addressDetails.alternate_mobile_num,
        latitude: lat,
        latitiude: lat,
        longitude: lng,
        is_default: addressDetails.is_default,
      };

      if (!isAddressSelected) {
        const response = await api.addAddress(payload);
        if (response.status === 1) {
          fetchAddress();
          toast.success(t("address_added_success") || "Address Added Successfully!");
          handleHideAddressModal();
        } else {
          toast.error(response?.message || "Failed to add address");
        }
      } else {
        payload.id = addresses.selectedEditAddress.id;
        const response = await api.updateAddress(payload);
        if (response.status === 1) {
          toast.success("Successfully Updated Address!");
          fetchAddress();
          handleHideAddressModal();
        } else {
          toast.error(response?.message || "Failed to update address");
        }
      }
    } catch (error) {
      console.log("Error saving address", error);
    } finally {
      setLoading(false);
    }
  };

  const handleHideAddressModal = () => {
    setaddressDetails({
      name: "",
      mobile_num: "",
      email: "",
      alternate_mobile_num: "",
      address: "",
      landmark: "",
      city: "",
      area: "",
      pincode: "",
      state: "",
      country: "",
      address_type: "Home",
      is_default: false,
    });
    setShowAddAddres(false);
  };

  const handleSetAddressType = (value) => {
    if (value) {
      setaddressDetails((state) => ({ ...state, address_type: value }));
    }
  };

  const handleCheckboxChange = (e) => {
    setaddressDetails((prevDetails) => ({
      ...prevDetails,
      is_default: e.target.checked,
    }));
  };

  return (
    <Dialog open={showAddAddres}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-white p-6 md:p-8 shadow-2xl border border-slate-200/80">
        <DialogHeader className="border-b border-slate-100 pb-4 mb-4">
          <div className="flex flex-row justify-between items-center">
            <div>
              <h2 className="font-bold text-xl md:text-2xl text-slate-900 tracking-tight">
                {isAddressSelected ? t("edit_address") || "Edit Address" : t("new_address") || "New Address"}
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Fill in your contact and delivery address details below
              </p>
            </div>
            <button
              onClick={() => handleHideAddressModal()}
              type="button"
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
            >
              <RiCloseFill size={22} />
            </button>
          </div>
        </DialogHeader>

        <form className="flex flex-col gap-5" onSubmit={handleConfirmAddress}>
          {/* Section 1: Contact Details */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">
              {t("contact_details") || "Contact Details"}
            </h4>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder={`${t("name") || "Full Name"} *`}
                className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                value={addressDetails.name}
                onChange={(e) =>
                  setaddressDetails((state) => ({
                    ...state,
                    name: e.target.value,
                  }))
                }
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={`${t("mobileNumber") || "Mobile Number"} *`}
                  className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                  value={addressDetails.mobile_num}
                  onChange={(e) =>
                    setaddressDetails((state) => ({
                      ...state,
                      mobile_num: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  type="email"
                  placeholder={t("email") || "Email Address"}
                  className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                  value={addressDetails.email}
                  onChange={(e) =>
                    setaddressDetails((state) => ({
                      ...state,
                      email: e.target.value,
                    }))
                  }
                />
              </div>

              <input
                type="text"
                placeholder={t("alt_mobile_no") || "Alternative Phone (Optional)"}
                className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                value={addressDetails.alternate_mobile_num}
                onChange={(e) =>
                  setaddressDetails((state) => ({
                    ...state,
                    alternate_mobile_num: e.target.value,
                  }))
                }
              />
            </div>
          </div>

          {/* Section 2: Address Details */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">
              {t("address_details") || "Address Details"}
            </h4>
            <div className="flex flex-col gap-3">
              <input
                type="text"
                placeholder={`${t("address") || "Address (House/Flat No., Street, Building)"} *`}
                className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                value={addressDetails.address}
                onChange={(e) =>
                  setaddressDetails((state) => ({
                    ...state,
                    address: e.target.value,
                  }))
                }
                required
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  placeholder={`${t("enter_landmark") || "Landmark"} *`}
                  className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                  value={addressDetails.landmark}
                  onChange={(e) =>
                    setaddressDetails((state) => ({
                      ...state,
                      landmark: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  type="text"
                  placeholder={`${t("enter_area") || "Area / Locality"} *`}
                  className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                  value={addressDetails.area}
                  onChange={(e) =>
                    setaddressDetails((state) => ({
                      ...state,
                      area: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <input
                  type="text"
                  placeholder={`${t("enter_pincode") || "Pincode"} *`}
                  className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                  value={addressDetails.pincode}
                  onChange={(e) =>
                    setaddressDetails((state) => ({
                      ...state,
                      pincode: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  type="text"
                  placeholder={`${t("enter_city") || "City"} *`}
                  className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                  value={addressDetails.city}
                  onChange={(e) =>
                    setaddressDetails((state) => ({
                      ...state,
                      city: e.target.value,
                    }))
                  }
                  required
                />
                <input
                  type="text"
                  placeholder={`${t("enter_state") || "State"} *`}
                  className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                  value={addressDetails.state}
                  onChange={(e) =>
                    setaddressDetails((state) => ({
                      ...state,
                      state: e.target.value,
                    }))
                  }
                  required
                />
              </div>

              <input
                type="text"
                placeholder={`${t("enter_country") || "Country"} *`}
                className="w-full outline-none border border-slate-200 focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] px-4 py-2.5 rounded-xl text-sm text-slate-800 bg-slate-50/50 transition-all"
                value={addressDetails.country}
                onChange={(e) =>
                  setaddressDetails((state) => ({
                    ...state,
                    country: e.target.value,
                  }))
                }
                required
              />
            </div>
          </div>

          {/* Section 3: Address Type */}
          <div>
            <h4 className="font-bold text-xs uppercase tracking-wider text-slate-500 mb-2.5">
              {t("address_type") || "Address Type"}
            </h4>
            <div className="flex gap-2">
              <ToggleGroup
                type="single"
                value={addressDetails.address_type}
                onValueChange={handleSetAddressType}
              >
                <ToggleGroupItem
                  value="Home"
                  className={`rounded-full px-5 py-2 text-xs font-bold border transition-all cursor-pointer ${
                    addressDetails.address_type === "Home"
                      ? "bg-[#0BADFB] text-white border-[#0BADFB] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span>{t("adress_type_home") || "Home"}</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="Office"
                  className={`rounded-full px-5 py-2 text-xs font-bold border transition-all cursor-pointer ${
                    addressDetails.address_type === "Office"
                      ? "bg-[#0BADFB] text-white border-[#0BADFB] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span>{t("address_type_office") || "Office"}</span>
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="Other"
                  className={`rounded-full px-5 py-2 text-xs font-bold border transition-all cursor-pointer ${
                    addressDetails.address_type === "Other"
                      ? "bg-[#0BADFB] text-white border-[#0BADFB] shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <span>{t("address_type_other") || "Other"}</span>
                </ToggleGroupItem>
              </ToggleGroup>
            </div>

            <label className="flex items-center gap-2 mt-4 cursor-pointer select-none">
              <input
                type="checkbox"
                className="w-4 h-4 rounded text-[#0BADFB] focus:ring-[#0BADFB] border-slate-300"
                checked={addressDetails.is_default}
                onChange={handleCheckboxChange}
              />
              <span className="font-semibold text-xs text-slate-700">
                {t("set_as_default_address") || "Set as default address"}
              </span>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full mt-3 py-3.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-extrabold text-sm tracking-wide shadow-md shadow-[#0BADFB]/20 transition-all cursor-pointer active:scale-98 disabled:opacity-50"
            disabled={loading}
          >
            {loading ? t("loading") || "Saving..." : t("save") || "Save Address"}
          </button>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default NewAddressModal;
