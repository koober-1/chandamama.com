import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import React from "react";
import { t } from "@/utils/translation";
import Image from "next/image";
import { LocalizedLink } from "@/utils/localizedNav";
import { useRouter } from "next/router";
import { RiCloseFill } from "react-icons/ri";
import { useSelector } from "react-redux";
import { FaCaretDown } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/api/apiRoutes";

const MobileNavSidebar = ({ open, setOpen, handleLanguageChange }) => {
  const router = useRouter();
  const setting = useSelector((state) => state?.Setting?.setting);
  const language = useSelector((state) => state.Language);
  const shopCategories = useSelector((state) => state.Shop?.shop?.categories);

  const { data: navCategoriesData } = useQuery({
    queryKey: ["mobileNavCategories", language?.selectedLanguage?.id],
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
    { href: "/products", label: t("all_products") || "All Products" },
    ...liveCategories.map((cat) => ({
      href: `/products?category=${cat.slug || cat.id}&category_id=${cat.id}&source=category`,
      label: cat.translations?.name || cat.name,
    })),
  ];

  const navLinks = [
    { href: "/", label: t("home") },
    { 
      href: "/products", 
      label: t("products") || "PRODUCTS",
      dropdown: productDropdown
    },
    { href: "/categories/all", label: t("categories") || "CATEGORIES" },
    { href: "/about-us", label: t("about_us") },
    { href: "/contact-us", label: t("contact_us") },
  ];

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        className="p-0 w-full sm:w-[420px] bg-white flex flex-col justify-between"
        side="left"
        aria-describedby={undefined}
      >
        <div>
          <SheetHeader>
            <SheetTitle className="flex justify-between px-5 py-4 items-center border-b border-slate-100 bg-slate-50/50">
              <div className="w-36 h-9 relative">
                {setting?.web_settings?.web_logo && (
                  <Image
                    src={setting?.web_settings?.web_logo}
                    alt="mobileLogo"
                    fill
                    sizes="144px"
                    priority
                    className="object-contain object-left"
                  />
                )}
              </div>
              <SheetTrigger className="focus:outline-none bg-white hover:bg-slate-100 border border-slate-200 rounded-full p-2 text-slate-600 transition-colors">
                <RiCloseFill size={20} />
              </SheetTrigger>
            </SheetTitle>
          </SheetHeader>

          {/* Links Mobile Sidebar */}
          <div className="p-3">
            <ul className="flex flex-col gap-1">
              {navLinks.map((link) => {
                const isActive = router.pathname === link.href || (link.dropdown && router.pathname.startsWith(link.href));
                
                if (link.dropdown) {
                  return (
                    <li key={link.href} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all text-slate-700 bg-slate-50/50">
                        <span>{link.label}</span>
                        <FaCaretDown className="text-slate-400" />
                      </div>
                      <ul className="flex flex-col gap-1 pl-4 border-l-2 border-slate-100 ml-4 mt-1">
                        {link.dropdown.map((dropItem) => (
                          <li key={dropItem.href}>
                            <LocalizedLink
                              href={dropItem.href}
                              onClick={() => setOpen(false)}
                              className="block px-4 py-2 text-sm text-slate-600 hover:text-[#0084DE] hover:bg-slate-50 rounded-lg transition-colors font-medium"
                            >
                              {dropItem.label}
                            </LocalizedLink>
                          </li>
                        ))}
                      </ul>
                    </li>
                  );
                }

                return (
                  <li key={link.href}>
                    <LocalizedLink
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                        isActive
                          ? "bg-sky-50 text-[#0084DE] font-bold border-l-4 border-[#0084DE] shadow-subtle"
                          : "text-slate-700 hover:bg-slate-50 hover:text-[#0084DE]"
                      }`}
                    >
                      <span>{link.label}</span>
                      <span className="text-slate-300 text-xs">→</span>
                    </LocalizedLink>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-4">
          {/* Follow Us Mobile Sidebar */}
          {setting?.social_media?.length > 0 && (
            <div className="flex flex-col gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                {t("follow_us")}
              </span>
              <ul className="flex items-center gap-2">
                {setting?.social_media?.slice(0, 7)?.map((social) => (
                  <li key={social?.id}>
                    <LocalizedLink
                      href={social?.link || "#"}
                      target="_blank"
                      className="w-8 h-8 rounded-full bg-white border border-slate-200 flex items-center justify-center text-slate-600 hover:text-emerald-700 hover:border-emerald-600 transition-colors shadow-subtle"
                    >
                      {social?.icon.toLowerCase().includes("wechat") ? (
                        <i className="fab fa-weixin text-xs"></i>
                      ) : social?.icon.toLowerCase().includes("twitter") ? (
                        <FaXTwitter className="text-xs" />
                      ) : (
                        <i className={`${social?.icon} text-xs`}></i>
                      )}
                    </LocalizedLink>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Language Mobile Sidebar */}
          <div className="w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full rounded-xl bg-white border border-slate-200 text-sm font-semibold text-slate-800 p-3 flex items-center justify-between shadow-subtle hover:border-slate-300 transition-all">
                <span>
                  {language?.selectedLanguage
                    ? language?.selectedLanguage?.name
                    : "English"}
                </span>
                <FaCaretDown className="text-slate-400 transition-transform duration-300 ease-in-out group-data-[state=open]:-rotate-180" />
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-[300px] bg-white border border-slate-100 rounded-xl shadow-dropdown">
                {language?.availableLanguages?.map((lang) => (
                  <DropdownMenuItem
                    key={lang?.id}
                    onSelect={() => handleLanguageChange(lang)}
                    className="text-xs font-medium cursor-pointer"
                  >
                    {lang?.name}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNavSidebar;
