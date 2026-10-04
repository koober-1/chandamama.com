import { t } from "@/utils/translation";
import Image from "next/image";
import { LocalizedLink } from "@/utils/localizedNav";
import React from "react";
import { BiMessageAltDots } from "react-icons/bi";
import { IoLocationOutline, IoStorefrontOutline } from "react-icons/io5";
import { FiTruck, FiChevronRight } from "react-icons/fi";
import { MdPhoneInTalk } from "react-icons/md";
import { useSelector } from "react-redux";

import CashOnDeliveryImage from "@/assets/payment_methods_svgs/ic_cod.svg";
import CashfreeImage from "@/assets/payment_methods_svgs/ic_cashfree.svg";
import RazorpayImage from "@/assets/payment_methods_svgs/ic_razorpay.svg";
import PaypalImage from "@/assets/payment_methods_svgs/ic_paypal.svg";
import PaystackImage from "@/assets/payment_methods_svgs/ic_paystack.svg";
import StriperImage from "@/assets/payment_methods_svgs/ic_stripe.svg";
import MidtransImage from "@/assets/payment_methods_svgs/Midtrans.svg";
import PhonePeImage from "@/assets/payment_methods_svgs/Phonepe.svg";
import PaytabsImage from "@/assets/payment_methods_svgs/ic_paytabs.svg";
import { FaXTwitter } from "react-icons/fa6";

const paymentMethodsConfig = [
  { key: "cod_payment_method", label: "COD", image: CashOnDeliveryImage },
  { key: "razorpay_payment_method", label: "razorpay", image: RazorpayImage },
  { key: "paypal_payment_method", label: "paypal", image: PaypalImage },
  { key: "paystack_payment_method", label: "paystack", image: PaystackImage },
  { key: "stripe_payment_method", label: "stripe", image: StriperImage },
  { key: "cashfree_payment_method", label: "cashfree", image: CashfreeImage },
  { key: "midtrans_payment_method", label: "midtrans", image: MidtransImage },
  { key: "phonepay_payment_method", label: "phonepe", image: PhonePeImage },
  { key: "paytabs_payment_method", label: "paytabs", image: PaytabsImage },
];

const Footer = () => {
  const setting = useSelector((state) => state?.Setting?.setting);
  const paymentSettings = useSelector(
    (state) => state?.Setting?.payment_setting
  );

  const enabledPaymentMethods = paymentMethodsConfig.filter(
    (method) =>
      paymentSettings?.[method.key] && paymentSettings?.[method.key] === "1"
  );

  const hasAnyPolicy = Boolean(
    setting?.terms_conditions ||
    setting?.privacy_policy ||
    setting?.returns_and_exchanges_policy ||
    setting?.shipping_policy ||
    setting?.cancellation_policy
  );

  return (
    <footer className="footer bg-slate-950 text-slate-300 relative overflow-hidden">
      {/* Decorative gradient blur */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#0BADFB]/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-[#0BADFB]/10 rounded-full blur-3xl pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Top Feature Bar: App Download & Partner CTAs */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 py-10 border-b border-slate-800/80 items-center">
          {/* App download section */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight">
                {setting?.web_settings?.app_title
                  ? setting?.web_settings?.app_title
                  : t("downloadAppsFooter") || "Shop on the Go"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {setting?.web_settings?.app_short_description
                  ? setting?.web_settings?.app_short_description
                  : t("AppsDowloadMsg") || "Get our mobile app for faster checkout and exclusive offers."}
              </p>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              {setting?.web_settings?.is_android_app !== "0" && setting?.web_settings?.play_store_logo && (
                <LocalizedLink
                  href={setting?.web_settings?.android_app_url || "#"}
                  target="_blank"
                  className="inline-block transition-transform hover:scale-105 rounded-xl overflow-hidden shadow-sm"
                >
                  <Image
                    className="h-10 w-auto object-contain"
                    width={140}
                    height={40}
                    src={setting?.web_settings?.play_store_logo}
                    alt="Get it on Google Play"
                    quality={95}
                  />
                </LocalizedLink>
              )}
              {setting?.web_settings?.is_ios_app !== "0" && setting?.web_settings?.ios_store_logo && (
                <LocalizedLink
                  href={setting?.web_settings?.ios_app_url || "#"}
                  target="_blank"
                  className="inline-block transition-transform hover:scale-105 rounded-xl overflow-hidden shadow-sm"
                >
                  <Image
                    className="h-10 w-auto object-contain"
                    width={140}
                    height={40}
                    src={setting?.web_settings?.ios_store_logo}
                    alt="Download on App Store"
                    quality={95}
                  />
                </LocalizedLink>
              )}
            </div>
          </div>

          {/* Join Us / Partner CTAs */}
          <div className="lg:col-span-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 p-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] backdrop-blur-sm">
            <div>
              <h3 className="font-bold text-lg text-white tracking-tight">
                {t("join_us") || "Partner With Us"}
              </h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">
                {t("collabration_msg") || "Join our marketplace as a verified seller or delivery partner today."}
              </p>
            </div>
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-2.5 shrink-0">
              <LocalizedLink
                href={`${process.env.NEXT_PUBLIC_API_URL}/seller/login`}
                target="__blank"
                className="px-4 py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white text-xs font-semibold flex items-center gap-2 shadow-sm shadow-[#0BADFB]/20 transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <IoStorefrontOutline size={16} />
                <span>{t("seller_registration") || "Sell With Us"}</span>
              </LocalizedLink>
              <LocalizedLink
                href={`${process.env.NEXT_PUBLIC_API_URL}/delivery_boy/login`}
                target="__blank"
                className="px-4 py-2.5 rounded-full bg-slate-800 hover:bg-slate-700 border border-slate-700 hover:border-[#0BADFB]/50 hover:text-white text-slate-200 text-xs font-semibold flex items-center gap-2 shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5"
              >
                <FiTruck size={16} />
                <span>{t("deliveryboy_registration") || "Deliver"}</span>
              </LocalizedLink>
            </div>
          </div>
        </div>

        {/* Main Footer Links & Information Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-14">
          {/* Column 1: Store Bio & Contact (4 cols) */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div>
              <h4 className="text-white text-base font-bold tracking-tight mb-2">
                {setting?.web_settings?.site_title || "Chandamama"}
              </h4>
              <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
                {setting?.web_settings?.app_short_description || 
                  "Your premier destination for natural, authentic, and premium wellness essentials delivered directly to your doorstep."}
              </p>
            </div>

            {/* Store Contact Pills */}
            <div className="flex flex-col gap-3.5">
              {setting?.store_address && (
                <LocalizedLink
                  href={`https://maps.google.com/?q=${setting?.store_address}`}
                  target="_blank"
                  className="flex items-start gap-3 group text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#0BADFB] group-hover:bg-[#0BADFB]/15 group-hover:border-[#0BADFB]/40 group-hover:text-[#7DD3FC] transition-colors">
                    <IoLocationOutline size={16} />
                  </span>
                  <span className="leading-snug mt-1 group-hover:text-white">
                    {setting?.store_address}
                  </span>
                </LocalizedLink>
              )}

              {setting?.support_email && (
                <LocalizedLink
                  href={`mailto:${setting?.support_email}`}
                  target="_blank"
                  className="flex items-center gap-3 group text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#0BADFB] group-hover:bg-[#0BADFB]/15 group-hover:border-[#0BADFB]/40 group-hover:text-[#7DD3FC] transition-colors">
                    <BiMessageAltDots size={16} />
                  </span>
                  <span className="group-hover:text-white">
                    {setting?.support_email}
                  </span>
                </LocalizedLink>
              )}

              {setting?.support_number && (
                <LocalizedLink
                  href={`tel:${setting?.support_number}`}
                  target="_blank"
                  className="flex items-center gap-3 group text-xs text-slate-300 hover:text-white transition-colors"
                >
                  <span className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 flex items-center justify-center shrink-0 text-[#0BADFB] group-hover:bg-[#0BADFB]/15 group-hover:border-[#0BADFB]/40 group-hover:text-[#7DD3FC] transition-colors">
                    <MdPhoneInTalk size={16} />
                  </span>
                  <span className="group-hover:text-white font-medium">
                    {setting?.support_number}
                  </span>
                </LocalizedLink>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              {t("quick_links") || "Quick Links"}
            </h4>
            <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
              <li>
                <LocalizedLink
                  href="/"
                  className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                >
                  <FiChevronRight size={12} className="text-[#0BADFB]" />
                  {t("home") || "Home"}
                </LocalizedLink>
              </li>
              {setting?.about_us && (
                <li>
                  <LocalizedLink
                    href="/about-us"
                    className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                  >
                    <FiChevronRight size={12} className="text-[#0BADFB]" />
                    {t("about_us") || "About Us"}
                  </LocalizedLink>
                </li>
              )}
              {setting?.contact_us && (
                <li>
                  <LocalizedLink
                    href="/contact-us"
                    className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                  >
                    <FiChevronRight size={12} className="text-[#0BADFB]" />
                    {t("contact_us") || "Contact Us"}
                  </LocalizedLink>
                </li>
              )}
              <li>
                <LocalizedLink
                  href="/faqs"
                  className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                >
                  <FiChevronRight size={12} className="text-[#0BADFB]" />
                  {t("faqs") || t("faq") || "FAQs"}
                </LocalizedLink>
              </li>
              <li>
                <LocalizedLink
                  href="/categories/all"
                  className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                >
                  <FiChevronRight size={12} className="text-[#0BADFB]" />
                  {t("categories") || "Categories"}
                </LocalizedLink>
              </li>
            </ul>
          </div>

          {/* Column 3: Company Policy (3 cols) */}
          <div className="lg:col-span-3 flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              {t("company_policy") || "Customer Care & Policies"}
            </h4>
            {hasAnyPolicy ? (
              <ul className="flex flex-col gap-2.5 text-xs text-slate-400">
                {setting?.terms_conditions && (
                  <li>
                    <LocalizedLink
                      href="/terms-and-conditions"
                      className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                    >
                      <FiChevronRight size={12} className="text-[#0BADFB]" />
                      {t("terms_and_conditions") || "Terms & Conditions"}
                    </LocalizedLink>
                  </li>
                )}
                {setting?.privacy_policy && (
                  <li>
                    <LocalizedLink
                      href="/privacy-policy"
                      className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                    >
                      <FiChevronRight size={12} className="text-[#0BADFB]" />
                      {t("privacy_policy") || "Privacy Policy"}
                    </LocalizedLink>
                  </li>
                )}
                {setting?.returns_and_exchanges_policy && (
                  <li>
                    <LocalizedLink
                      href="/return-and-exchange-policy"
                      className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                    >
                      <FiChevronRight size={12} className="text-[#0BADFB]" />
                      {t("return_and_exchange_policy") || "Return & Exchange"}
                    </LocalizedLink>
                  </li>
                )}
                {setting?.shipping_policy && (
                  <li>
                    <LocalizedLink
                      href="/shipping-policy"
                      className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                    >
                      <FiChevronRight size={12} className="text-[#0BADFB]" />
                      {t("shipping_policy") || "Shipping Policy"}
                    </LocalizedLink>
                  </li>
                )}
                {setting?.cancellation_policy && (
                  <li>
                    <LocalizedLink
                      href="/cancellation-policy"
                      className="hover:text-[#0BADFB] flex items-center gap-1.5 transition-all duration-200 hover:translate-x-1"
                    >
                      <FiChevronRight size={12} className="text-[#0BADFB]" />
                      {t("cancellation_policy") || "Cancellation Policy"}
                    </LocalizedLink>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-xs text-slate-500">Policies updated seasonally.</p>
            )}
          </div>

          {/* Column 4: Social Media & Connect (2 cols) */}
          <div className="lg:col-span-2 flex flex-col gap-4">
            <h4 className="text-white text-xs font-bold uppercase tracking-wider">
              {t("follow_us") || "Connect"}
            </h4>
            <p className="text-xs text-slate-400">
              Stay updated with our latest offers, seasonal arrivals & wellness guides.
            </p>
            {setting?.social_media?.length > 0 && (
              <div className="flex flex-wrap gap-2.5 mt-1">
                {setting?.social_media?.map((social) => {
                  let iconElement = <i className={social?.icon} />;
                  if (social?.icon?.toLowerCase().includes("wechat")) {
                    iconElement = <i className="fab fa-weixin" />;
                  } else if (social?.icon?.toLowerCase().includes("twitter")) {
                    iconElement = <FaXTwitter className={social?.icon} />;
                  }

                  return (
                    <LocalizedLink
                      key={social?.id}
                      href={social?.link || "#"}
                      target="_blank"
                      className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 hover:text-white hover:bg-[#0BADFB] hover:border-[#0BADFB] hover:shadow-md hover:shadow-[#0BADFB]/25 transition-all duration-200 shadow-sm"
                    >
                      {iconElement}
                    </LocalizedLink>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Copyright & Payment Badges Bar */}
      <div className="border-t border-slate-900 bg-black/60 backdrop-blur-sm text-slate-400 text-xs">
        <div className="container mx-auto px-4 md:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4 mb-[75px] md:mb-0">
          <div className="text-center md:text-left text-slate-400">
            {setting?.web_settings?.copyright_details || 
              `© ${new Date().getFullYear()} Chandamama. All rights reserved.`}
          </div>

          {/* Payment Badges */}
          {enabledPaymentMethods?.length > 0 && (
            <div className="flex items-center gap-3">
              <span className="text-slate-400 text-[11px] font-medium hidden sm:inline">
                {t("we_accept") || "Secured Payments"}:
              </span>
              <div className="flex items-center gap-1.5">
                {enabledPaymentMethods.slice(0, 5).map((method, idx) => (
                  <div
                    key={idx}
                    className="w-10 h-7 bg-white rounded-md flex items-center justify-center p-1 shadow-sm border border-white/20"
                    title={method.label}
                  >
                    <Image
                      src={method?.image}
                      alt={method?.label}
                      width={36}
                      height={24}
                      className="object-contain max-h-5 w-auto"
                      unoptimized={true}
                    />
                  </div>
                ))}
                {enabledPaymentMethods?.length > 5 && (
                  <div className="h-7 px-2 bg-white/10 rounded-md flex items-center justify-center text-[10px] text-white font-semibold">
                    +{enabledPaymentMethods.length - 5}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </footer>
  );
};

export default Footer;
