import React, { useState } from "react";
import Header from "./Header";
import Footer from "./Footer";
import { setPaymentSetting, setSetting } from "@/redux/slices/settingSlice";
import { setCity } from "@/redux/slices/citySlice";
import { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import * as api from "@/api/apiRoutes";
import { ToastContainer } from "react-toastify";
import Loader from "../loader/Loader";
import { setFavoriteProductIds } from "@/redux/slices/FavoriteSlice";
import PushNotification from "../firebasenotification/PushNotification";
import LangFile from "@/utils/en.json";
import {
  setAvailableLanguages,
  setSelectedLanguage,
} from "@/redux/slices/languageSlice";
import { useRouter } from "next/router";
import MaintanceMode from "../error/MaintanceMode";

const Layout = ({ children }) => {
  const router = useRouter();
  const dispatch = useDispatch();
  const theme = useSelector((state) => state.Theme.theme);
  const setting = useSelector((state) => state.Setting);
  const city = useSelector((state) => state.City?.city);
  const language = useSelector((state) => state.Language.selectedLanguage);

  const availableLanguages = useSelector(
    (state) => state.Language.availableLanguages,
  );

  useEffect(() => {
    if (!language?.type) return;
    document.documentElement.dir = language.type.toLowerCase();
    document.documentElement.lang = language.code || "en";
  }, [language?.type, language?.code]);

  useEffect(() => {
    fetchSetting();
    fetchPaymentSetting();
    if (!availableLanguages?.length) {
      fetchLanguage();
    }
  }, []);

  useEffect(() => {
    if (!router.isReady || !availableLanguages?.length) return;

    const queryLang = router.query.lang;

    // If no lang in URL → do nothing (your other effect handles it)
    if (!queryLang) return;

    const targetLang = availableLanguages.find((l) => l.code === queryLang);

    // ✅ If valid language → existing behavior (unchanged)
    if (targetLang) {
      if (targetLang.code === language?.code) return;

      api
        .getSystemLanguages({
          id: targetLang.id,
          isDefault: 0,
          systemType: 3,
        })
        .then((res) => {
          if (res.status == 1 && res.data?.code !== language?.code) {
            dispatch(setSelectedLanguage({ data: res.data }));
          }
        })
        .catch((err) => console.log("lang sync error", err));

      return;
    }

    // ✅ ✅ FALLBACK LOGIC (NO API CALL)
    const fallbackLang =
      availableLanguages.find((l) => l.is_default == 1) ||
      availableLanguages.find((l) => l.code === "en") ||
      availableLanguages[0];

    if (!fallbackLang) return;

    // If already same → just fix URL
    if (fallbackLang.code === language?.code) {
      router.replace(
        {
          pathname: router.pathname,
          query: { ...router.query, lang: fallbackLang.code },
        },
        undefined,
        { shallow: true },
      );
      return;
    }

    // ✅ Set fallback WITHOUT API
    dispatch(setSelectedLanguage({ data: fallbackLang }));

    // ✅ Fix URL
    router.replace(
      {
        pathname: router.pathname,
        query: { ...router.query, lang: fallbackLang.code },
      },
      undefined,
      { shallow: true },
    );
  }, [router.query.lang, router.isReady, availableLanguages]);

  const fetchLanguage = async () => {
    try {
      const response = await api.getSystemLanguages({
        id: 0,
        isDefault: 0,
        systemType: 3,
      });
      if (response.status == 1) {
        if (response.data !== undefined) {
          if (response?.data?.length == 1) {
            try {
              const langRes = await api.getSystemLanguages({
                id: response?.data?.[0]?.id,
                isDefault: 1,
                systemType: 3,
              });
              if (langRes.status == 1) {
                dispatch(setSelectedLanguage({ data: langRes?.data }));
              } else {
                const language = {
                  id: 15,
                  name: "English",
                  code: "en",
                  type: "LTR",
                  system_type: 3,
                  is_default: 1,
                  json_data: LangFile,
                  display_name: "English",
                  system_type_name: "Website",
                };
                dispatch(setSelectedLanguage({ data: language }));
              }
            } catch (error) {
              console.log("error");
            }
          } else if (language == null) {
            const langId = response?.data?.find(
              (lang) => lang?.is_default == 1,
            )?.id;
            const langRes = await api.getSystemLanguages({
              id: langId,
              isDefault: 1,
              systemType: 3,
            });
            dispatch(setSelectedLanguage({ data: langRes?.data }));
          }
          dispatch(setAvailableLanguages({ data: response.data }));
        } else {
          const language = {
            id: 15,
            name: "English",
            code: "en",
            type: "LTR",
            system_type: 3,
            is_default: 1,
            json_data: LangFile,
            display_name: "English",
            system_type_name: "Website",
          };
          dispatch(setSelectedLanguage({ data: language }));
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  };
  useEffect(() => {
    if (!router.isReady) return;

    if (router.query?.lang === language?.code) return;

    // If language exists but URL doesn't have it → add it
    if (language?.code && !router.query?.lang) {
      router.replace({
        pathname: router.pathname,
        query: { ...router.query, lang: language?.code },
      });
    }
  }, [language, router.isReady]);

  const fetchSetting = async () => {
    try {
      const res = await api.getSetting();
      let setting = null;
      if (typeof res?.data === "string") {
        try {
          setting = JSON.parse(atob(res.data));
        } catch {
          try {
            setting = JSON.parse(res.data);
          } catch {
            setting = res.data;
          }
        }
      } else {
        setting = res?.data;
      }

      if (setting) {
        dispatch(setSetting({ data: setting }));
        if (setting?.default_city && (!city || !city.latitude)) {
          dispatch(setCity({ data: setting.default_city }));
        }
        dispatch(setFavoriteProductIds({ data: setting?.favorite_product_ids || [] }));

        const themeColor = setting?.web_settings?.color || setting?.color;
        if (themeColor) {
          document.documentElement.style.setProperty("--primary-color", themeColor);
        }
        if (setting?.favicon) {
          const link =
            document.querySelector("link[rel*='icon']") ||
            document.createElement("link");
          const oldLinks = document.querySelectorAll("link[rel*='icon']");
          oldLinks.forEach((el) => el.parentNode.removeChild(el));
          link.type = "image/x-icon";
          link.rel = "shortcut icon";
          link.href = setting.favicon;
          link.sizes = "16x16 32x32 64x64";
          document.getElementsByTagName("head")[0].appendChild(link);
        }
        const lightThemeColor = setting?.web_settings?.light_color || setting?.light_color;
        if (lightThemeColor) {
          document.documentElement.style.setProperty("--light-primary-color", lightThemeColor);
        }
      }
    } catch (error) {
      console.log("error fetching setting", error);
    }
  };

  const fetchPaymentSetting = async () => {
    try {
      const res = await api.getPaymentSetting();
      let paymentData = null;
      if (typeof res?.data === "string") {
        try {
          paymentData = JSON.parse(atob(res.data));
        } catch {
          try {
            paymentData = JSON.parse(res.data);
          } catch {
            paymentData = res.data;
          }
        }
      } else {
        paymentData = res?.data;
      }
      if (paymentData) {
        dispatch(setPaymentSetting({ data: paymentData }));
      }
    } catch (error) {
      console.log("error fetching payment setting", error);
    }
  };

  return (
    <section>
      {setting?.setting?.web_settings?.website_mode == 1 ? (
        <MaintanceMode
          message={setting?.setting?.web_settings?.website_mode_remark}
        />
      ) : (
        <PushNotification>
          <Header />
          {children}
          <Footer />
          <ToastContainer
            theme={theme}
            key="toastContainer"
            bodyClassName={"toast-body"}
            toastClassName="toast-container-className"
          />
        </PushNotification>
      )}
      {/* <Location showLocation={showLocation} setShowLocation={setShowLocation} /> */}
    </section>
  );
};

export default Layout;