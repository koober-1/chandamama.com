import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import CategoryRibbon from "./CategoryRibbon";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FaMoon, FaRegUser, FaSun, FaCaretDown } from "react-icons/fa";
import * as api from "@/api/apiRoutes";
import {
  IoCartOutline,
  IoLocationOutline,
  IoHomeOutline,
  IoSearchOutline,
  IoLanguage,
} from "react-icons/io5";
import { LuUser } from "react-icons/lu";
import { FaPhoneVolume, FaXTwitter } from "react-icons/fa6";
import { BiCaretRight } from "react-icons/bi";
import { RxHamburgerMenu } from "react-icons/rx";
import CartDrawer from "../cart/CartDrawer";
// import Login from "../login/Login";
import { t } from "@/utils/translation";
import { useDispatch, useSelector } from "react-redux";
import dynamic from "next/dynamic";
const Location = dynamic(() => import("../locationmodal/Location"), {
  ssr: false,
});
const Login = dynamic(() => import("../login/Login"), {
  ssr: false,
});
// const CartDrawer = dynamic(() => import("../cart/CartDrawer"), {
//   ssr: false,
// });
const LogoutModal = dynamic(() => import("../logoutmodal/LogoutModal"), {
  ssr: false,
});
const ProfileDrawer = dynamic(
  () => import("../profiledashboard/ProfileDrawer"),
  {
    ssr: false,
  },
);
const MobileNavSidebar = dynamic(
  () => import("../mobile-nav-sidebar/MobileNavSidebar"),
  {
    ssr: false,
  },
);
import {
  BiBell,
  BiBookmarkHeart,
  BiCartAlt,
  BiUserCircle,
  BiWallet,
  BiCart,
} from "react-icons/bi";
import { RiLogoutCircleRLine } from "react-icons/ri";
import { LuMapPin } from "react-icons/lu";
import { LocalizedLink } from "@/utils/localizedNav";
import { useRouter } from "next/router";
import { setCity } from "@/redux/slices/citySlice";
import { setLocalTheme } from "@/redux/slices/themeSlice";
import { useTheme } from "next-themes";
// import LogoutModal from "../logoutmodal/LogoutModal";
// import ProfileDrawer from "../profiledashboard/ProfileDrawer";
import { clearCheckout } from "@/redux/slices/checkoutSlice";
import {
  setFilterSearch,
  setProductBySearch,
  setSearchedCategory,
} from "@/redux/slices/productFilterSlice";
import SearchComponent from "../search/SearchComponent";
import { useMediaQuery } from "react-responsive";
import { RiCloseFill } from "react-icons/ri";
import { setSelectedLanguage } from "@/redux/slices/languageSlice";
import Image from "next/image";
// import MobileNavSidebar from "../mobile-nav-sidebar/MobileNavSidebar";

import { CiSun } from "react-icons/ci";
import { FiMoon } from "react-icons/fi";

const Header = () => {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const dispatch = useDispatch();

  const themes = useSelector((state) => state.Theme);
  const cart = useSelector((state) => state.Cart);
  const setting = useSelector((state) => state.Setting);
  const user = useSelector((state) => state.User);
  const city = useSelector((state) => state.City);
  const filter = useSelector((state) => state.ProductFilter);
  const language = useSelector((state) => state.Language);
  const fcmToken = useSelector((state) => state.User?.fcm_token);

  // Device Width Checking
  const isMobile = useMediaQuery({ query: "(max-width: 765px)" });

  const [showCart, setShowCart] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showLogout, setShowLogout] = useState(false);
  const [mobileActiveKey, setMobileActiveKey] = useState(1);
  const [selectedTab, setSelectedTab] = useState("profile");
  const [showProfile, setShowProfile] = useState(false);

  const [showLocation, setShowLocation] = useState(false);
  const [loading, setLoading] = useState(false);

  const [mobileSearch, setMobileSearch] = useState(false);
  const [searchCatId, setSearchCatId] = useState("");
  const [typingTimeout, setTypingTimeout] = useState(null);
  const [isSuggLoading, setIsSuggLoading] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);

  useEffect(() => {
    if (router?.pathname !== "/products") {
      dispatch(setFilterSearch({ data: "" }));
    }
  }, []);

  useEffect(() => {
    if (router?.pathname != "/checkout") {
      dispatch(clearCheckout());
    }
  }, [router]);

  useEffect(() => {
    // if mobile screen is dragged to desktop screen close the mobile search
    if (isMobile === false && mobileSearch === true) {
      setMobileSearch(false);
    }
  }, [isMobile]);
  useEffect(() => {
    fetchCity();
  }, [setting]);
  useEffect(() => {
    if (router.pathname.includes("/profile")) {
      setMobileActiveKey(3);
    }
  }, [router.pathname]);

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDarkMode = mounted ? (themes?.theme === "dark" || theme === "dark") : false;

  const handleChangeTheme = (newTheme) => {
    setTheme(newTheme);
    dispatch(setLocalTheme({ data: newTheme }));
    if (typeof document !== "undefined") {
      if (newTheme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  };

  const handleToggleTheme = () => {
    const nextTheme = isDarkMode ? "light" : "dark";
    handleChangeTheme(nextTheme);
  };

  useEffect(() => {
    if (typeof document !== "undefined") {
      if (themes?.theme === "dark") {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    }
  }, [themes?.theme]);

  const handleLanguageChange = async (language) => {
    if (language?.code === router.query.lang) return;
    try {
      const response = await api.getSystemLanguages({
        id: language?.id,
        isDefault: 0,
        systemType: 3,
      });
      if (response.status == 1) {
        dispatch(setSelectedLanguage({ data: language?.data }));
        // document.documentElement.dir = response?.data?.type;

        // Keep URL in sync when language is changed via dropdown
        router.replace({
          pathname: router.pathname,
          query: { ...router.query, lang: response?.data?.code },
        });

        await api.updateFcmToken({
          langaugeId: response?.data?.admin_lang_id_for_fcm,
          fcmToken,
        });
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const fetchCity = async () => {
    try {
      if (setting?.setting?.default_city && city?.city == null) {
        const latitude = parseFloat(setting.setting.default_city?.latitude);
        const longitude = parseFloat(setting.setting.default_city?.longitude);
        const response = await api.getCity({
          latitude: latitude,
          longitude: longitude,
        });
        if (response.status === 1) {
          dispatch(setCity({ data: response.data }));
        }
      }
    } catch (error) {
      console.log("error", error);
    }
  };

  const handleCartOpen = () => {
    if (router.pathname == "/checkout") {
      router.push("/cart");
    } else {
      setShowCart(true);
    }
  };

  const handleLoginOpen = () => {
    setShowLogin(true);
  };

  const handleOpenLocation = () => {
    setShowLocation(true);
  };

  const handleHomeClick = () => {
    setMobileActiveKey(1);
    router.push("/");
  };

  const handleProfileClick = () => {
    setMobileActiveKey(3);
    if (user?.jwtToken) {
      setShowProfile(true);
    } else {
      setShowLogin(true);
    }
  };

  const handleSearchCategory = (value) => {
    setSearchCatId(value);
    dispatch(setSearchedCategory({ data: value }));
  };

  const handleSearchData = async (searchValue) => {
    setIsSuggLoading(true);
    try {
      const response = await api.getProductByFilter({
        latitude: city?.city?.latitude,
        longitude: city?.city?.longitude,
        filters: {
          search: searchValue,
          category_id: filter?.searchedCategory,
        },
      });
      dispatch(setProductBySearch({ data: response?.data }));
      setIsSuggLoading(false);
    } catch (error) {
      console.log("Error", error?.message);
    }
  };

  const handleSearch = (e) => {
    const value = e.target.value;
    if (value.trim() === "") {
      dispatch(setProductBySearch({ data: [] }));
      dispatch(setFilterSearch({ data: "" }));
      clearTimeout(typingTimeout);
      return;
    }
    setIsSuggLoading(true);
    dispatch(setFilterSearch({ data: e.target.value }));
    dispatch(setSearchedCategory({ data: searchCatId }));
    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }
    const timeout = setTimeout(() => {
      handleSearchData(e.target.value);
    }, 2000);
    setTypingTimeout(timeout);
  };

  const handleMobileSearch = () => {
    setMobileSearch(!mobileSearch);
  };

  const handleMobileNav = () => {
    setMobileNav(!mobileNav);
  };

  const shopCategories = useSelector((state) => state.Shop?.shop?.categories);

  const { data: navCategoriesData } = useQuery({
    queryKey: ["headerNavCategories", language?.selectedLanguage?.id],
    queryFn: async () => {
      const res = await api.getCategories();
      return res?.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const liveCategories = navCategoriesData && navCategoriesData.length > 0
    ? navCategoriesData
    : (shopCategories && shopCategories.length > 0 ? shopCategories : []);

  const productDropdown = [
    { path: "/products", label: t("all_products") || "All Products" },
    ...liveCategories.map((cat) => ({
      path: `/products?category=${cat.slug || cat.id}&category_id=${cat.id}&source=category`,
      label: cat.translations?.name || cat.name,
    })),
  ];

  return (
    <>
      {/* Fixed Header on Top */}
      <header className="fixed top-0 left-0 right-0 z-50 w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200/90 dark:border-slate-800 shadow-xs transition-all duration-200">
        {/* Main Brand & Navigation Bar */}
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-3">
            {/* Logo */}
            <div className="relative h-10 w-36 lg:w-44 flex-shrink-0">
              <LocalizedLink href="/" className="relative block w-full h-full">
                {mounted && typeof setting?.setting?.web_settings?.web_logo === 'string' && setting?.setting?.web_settings?.web_logo.trim() !== '' && (
                  <Image
                    src={setting?.setting?.web_settings?.web_logo}
                    alt="Logo"
                    fill
                    priority={true}
                    fetchpriority="high"
                    loading="eager"
                    className="object-contain object-left"
                  />
                )}
              </LocalizedLink>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center">
              <ul className="flex items-center gap-7">
                {[
                  { path: "/", label: t("home") },
                  {
                    path: "/products",
                    label: t("products") || "PRODUCTS",
                    dropdown: productDropdown,
                  },
                  { path: "/categories/all", label: t("categories") || "CATEGORIES" },
                  { path: "/about-us", label: t("about_us") },
                  { path: "/contact-us", label: t("contact_us") },
                ].map((navItem) => {
                  const isActive = router.pathname === navItem.path || (navItem.dropdown && router.pathname.startsWith(navItem.path));

                  if (navItem.dropdown) {
                    return (
                      <li key={navItem.path}>
                        <DropdownMenu>
                          <DropdownMenuTrigger className={`flex items-center gap-1.5 text-xs uppercase tracking-wider font-extrabold transition-all duration-200 relative py-1.5 outline-none cursor-pointer group ${isActive
                            ? "text-[#0BADFB] font-black"
                            : "text-slate-700 dark:text-slate-200 hover:text-[#0BADFB]"
                            }`}>
                            {navItem.label}
                            <FaCaretDown size={14} className={`transition-colors ${isActive ? "text-[#0BADFB]" : "text-slate-400 group-hover:text-[#0BADFB]"}`} />
                            {isActive && (
                              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0BADFB] rounded-full"></span>
                            )}
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-64 max-h-80 overflow-y-auto bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-xl rounded-xl p-1 z-50 mt-1">
                            {navItem.dropdown.map((dropItem) => (
                              <LocalizedLink key={dropItem.path} href={dropItem.path}>
                                <DropdownMenuItem className="text-sm font-semibold cursor-pointer rounded-lg px-4 py-2.5 text-slate-700 dark:text-slate-200 hover:bg-[#e0f7fe] hover:text-[#0BADFB] dark:hover:bg-slate-700 dark:hover:text-[#0BADFB] outline-none transition-colors">
                                  {dropItem.label}
                                </DropdownMenuItem>
                              </LocalizedLink>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </li>
                    );
                  }

                  return (
                    <li key={navItem.path}>
                      <LocalizedLink
                        href={navItem.path}
                        className={`text-xs uppercase tracking-wider font-extrabold transition-all duration-200 relative py-1.5 ${isActive
                          ? "text-[#0BADFB] font-black"
                          : "text-slate-700 dark:text-slate-200 hover:text-[#0BADFB]"
                          }`}
                      >
                        {navItem.label}
                        {isActive && (
                          <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0BADFB] rounded-full"></span>
                        )}
                      </LocalizedLink>
                    </li>
                  );
                })}
              </ul>
            </nav>

            {/* Mobile Hamburger */}
            <div className="flex lg:hidden items-center">
              <button
                type="button"
                onClick={handleMobileNav}
                aria-label="Open menu"
                className="p-2 rounded-xl text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <RxHamburgerMenu size={22} />
              </button>
            </div>

            {/* Right Action Cluster: Theme, Language, Cart, Profile */}
            <div className="flex items-center gap-2 sm:gap-3">



              {/* Modern Cart Button */}
              <button
                type="button"
                onClick={handleCartOpen}
                className="flex items-center gap-2 sm:gap-2.5 px-2.5 sm:px-3.5 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-[#0BADFB] hover:shadow-md transition-all duration-200 cursor-pointer group shrink-0"
              >
                <span className="relative flex items-center justify-center w-8 h-8 rounded-full bg-[#e0f7fe] dark:bg-[#0BADFB]/20 text-[#0BADFB] group-hover:scale-105 transition-transform">
                  <IoCartOutline size={19} />
                  {((cart.isGuest ? cart?.guestCart?.length : cart?.cartProducts?.length) || 0) > 0 && (
                    <span className="absolute -top-1 -right-1 flex h-4 min-w-[16px] px-1 items-center justify-center rounded-full bg-[#0BADFB] text-white text-[10px] font-extrabold shadow-xs">
                      {cart.isGuest ? cart?.guestCart?.length : cart?.cartProducts?.length}
                    </span>
                  )}
                </span>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="text-[9px] font-bold text-slate-400 dark:text-slate-400 uppercase tracking-wider leading-none">
                    {t("your_cart") || "Your Cart"}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-[#0BADFB] transition-colors leading-tight mt-0.5">
                    {setting.setting?.currency}
                    {(cart.isGuest
                      ? cart?.guestCartTotal || 0
                      : cart?.cartSubTotal || 0
                    ).toFixed(setting?.setting?.decimal_point || 0)}
                  </span>
                </div>
              </button>

              {/* User / Login */}
              {user?.jwtToken !== "" ? (
                <DropdownMenu>
                  <DropdownMenuTrigger className="flex items-center gap-2 px-2.5 sm:px-3 py-1.5 rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700/60 transition-all outline-none cursor-pointer shrink-0">
                    <span className="flex items-center justify-center w-7 h-7 rounded-full bg-[#e0f7fe] text-[#0BADFB] font-bold text-xs">
                      <LuUser size={15} />
                    </span>
                    <span className="hidden lg:inline text-xs font-semibold text-slate-800 dark:text-slate-200">
                      {t("profile")}
                    </span>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-56 p-1.5 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 shadow-dropdown rounded-2xl z-50">
                    <LocalizedLink href="/profile">
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0BADFB] rounded-xl cursor-pointer">
                        <BiUserCircle size={18} className="text-slate-400" />
                        {t("editProfile")}
                      </DropdownMenuItem>
                    </LocalizedLink>
                    <LocalizedLink href="/profile/activeorders">
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0BADFB] rounded-xl cursor-pointer">
                        <BiCartAlt size={18} className="text-slate-400" />
                        {t("orders")}
                      </DropdownMenuItem>
                    </LocalizedLink>
                    <LocalizedLink href="/profile/wishlist">
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0BADFB] rounded-xl cursor-pointer">
                        <BiBookmarkHeart size={18} className="text-slate-400" />
                        {t("wishlist")}
                      </DropdownMenuItem>
                    </LocalizedLink>
                    <LocalizedLink href="/profile/notifications">
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0BADFB] rounded-xl cursor-pointer">
                        <BiBell size={18} className="text-slate-400" />
                        {t("notification")}
                      </DropdownMenuItem>
                    </LocalizedLink>
                    <LocalizedLink href="/profile/address">
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0BADFB] rounded-xl cursor-pointer">
                        <IoLocationOutline size={18} className="text-slate-400" />
                        {t("myAddress")}
                      </DropdownMenuItem>
                    </LocalizedLink>
                    <LocalizedLink href="/profile/wallethistory">
                      <DropdownMenuItem className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-[#0BADFB] rounded-xl cursor-pointer">
                        <BiWallet size={18} className="text-slate-400" />
                        {t("walletBalance")}
                      </DropdownMenuItem>
                    </LocalizedLink>
                    <div className="h-px bg-slate-100 dark:bg-slate-700 my-1"></div>
                    <DropdownMenuItem
                      onClick={() => setShowLogout(true)}
                      className="flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl cursor-pointer"
                    >
                      <RiLogoutCircleRLine size={18} />
                      {t("logout")}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <button
                  onClick={handleLoginOpen}
                  className="flex items-center gap-1.5 px-4 py-2 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-xs shadow-xs hover:shadow transition-all duration-200 cursor-pointer shrink-0"
                >
                  <LuUser size={14} />
                  <span>{t("login")}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Sub-Header / Search & Location Bar */}
        <div className="bg-slate-50/80 dark:bg-slate-900/80 border-t border-slate-100 dark:border-slate-800 py-2.5">
          <div className="container mx-auto px-4 flex items-center justify-between gap-3 sm:gap-4">


            {/* Desktop Live Search Component */}
            <div className="flex-grow max-w-2xl mx-1 sm:mx-2">
              <SearchComponent
                isSuggLoading={isSuggLoading}
                isMobile={isMobile}
                handleSearchCategory={handleSearchCategory}
                handleSearch={handleSearch}
              />
            </div>


          </div>
        </div>
        <CategoryRibbon />
      </header>

      {/* Compensation Spacer for Fixed Header */}
      <div className="h-[150px] md:h-[160px] w-full pointer-events-none select-none" aria-hidden="true" />
      <Sheet open={mobileSearch} onOpenChange={setMobileSearch}>
        <SheetContent
          className="p-0 w-full sm:w-[900px]"
          side={language?.selectedLanguage?.type == "RTL" ? "left" : "right"}
        >
          <SheetHeader>
            <SheetTitle className="flex justify-between px-4 py-2 items-center">
              {t("search")}
              <SheetTrigger className="focus:outline-none closeButtonBg rounded-full p-[8px] gap-[4px] cursor-pointer">
                <RiCloseFill size={22} />
              </SheetTrigger>
            </SheetTitle>
            <SheetDescription>
              <SearchComponent
                isSuggLoading={isSuggLoading}
                isMobile={isMobile}
                mobileSearch={mobileSearch}
                setMobileSearch={setMobileSearch}
                handleSearch={handleSearch}
                handleSearchCategory={handleSearchCategory}
              />
            </SheetDescription>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <MobileNavSidebar
        open={mobileNav}
        setOpen={setMobileNav}
        handleLanguageChange={handleLanguageChange}
      />
      <CartDrawer
        showCart={showCart}
        setShowCart={setShowCart}
        setMobileActiveKey={setMobileActiveKey}
      />
      <Login
        showLogin={showLogin}
        setShowLogin={setShowLogin}
        setMobileActiveKey={setMobileActiveKey}
      />

      <LogoutModal showLogout={showLogout} setShowLogout={setShowLogout} />
      <section className="fixed bottom-0 left-0 w-full z-50 md:hidden bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] py-2">
        <div className="container mx-auto px-6">
          <div className="flex justify-around items-center">
            <button
              type="button"
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${mobileActiveKey === 1
                ? "text-[#0BADFB] dark:text-[#7DD3FC] bg-[#e0f7fe] dark:bg-slate-800 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              onClick={handleHomeClick}
            >
              <IoHomeOutline size={20} />
              <span className="text-[11px]">{t("home")}</span>
            </button>

            <button
              type="button"
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${mobileActiveKey === 2
                ? "text-[#0BADFB] dark:text-[#7DD3FC] bg-[#e0f7fe] dark:bg-slate-800 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              onClick={handleMobileSearch}
            >
              <IoSearchOutline size={20} />
              <span className="text-[11px]">{t("search")}</span>
            </button>

            <button
              type="button"
              className={`flex flex-col items-center gap-1 py-1 px-4 rounded-xl transition-all ${mobileActiveKey === 3
                ? "text-[#0BADFB] dark:text-[#7DD3FC] bg-[#e0f7fe] dark:bg-slate-800 font-bold"
                : "text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white"
                }`}
              onClick={handleProfileClick}
            >
              <FaRegUser size={18} />
              <span className="text-[11px]">
                {user?.jwtToken ? t("profile") : t("login")}
              </span>
            </button>
          </div>
        </div>
      </section>
      <ProfileDrawer
        showProfile={showProfile}
        setShowProfile={setShowProfile}
        setSelectedTab={setSelectedTab}
        selectedTab={selectedTab}
      />
    </>
  );
};

export default Header;
