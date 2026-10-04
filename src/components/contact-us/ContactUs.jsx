import React, { useState } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { t } from "@/utils/translation";
import {
  setListingSource,
  setFilterSearch,
} from "@/redux/slices/productFilterSlice";
import {
  IoLocationSharp,
  IoCall,
  IoTime,
  IoMail,
  IoCheckmarkCircle,
} from "react-icons/io5";
import { FaWhatsapp, FaHeadset } from "react-icons/fa";
import { HiArrowRight } from "react-icons/hi";

const ContactUs = () => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const setting = useSelector((state) => state?.Setting?.setting);
  const language = useSelector((state) => state.Language.selectedLanguage);

  // Contact Form State
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    subject: "General Inquiry",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({
        name: "",
        email: "",
        phone: "",
        subject: "General Inquiry",
        message: "",
      });
      setTimeout(() => setSubmitted(false), 5000);
    }, 800);
  };

  const supportPhone = setting?.support_number || "1800 222 621";
  const supportEmail = setting?.support_email || "support@chandamama.com";

  return (
    <div className="bg-[#f8fafc] dark:bg-slate-900 min-h-screen pb-20 select-text">

      {/* 2. CHANDAMAMA HERO PANORAMIC CONTACT BANNER */}
      <section className="relative w-full overflow-hidden bg-gradient-to-b from-[#e6f9fc] via-[#f0fbfd] to-[#f8fafc] dark:from-slate-900 dark:via-slate-900/90 dark:to-slate-900 border-b border-slate-200/70 dark:border-slate-800">
        <div className="container mx-auto px-4 py-8 sm:py-12 md:py-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center min-h-[340px] md:min-h-[400px]">
            {/* Left Column: Inspirational Customer Care Headline */}
            <div className="lg:col-span-6 z-20 flex flex-col justify-center space-y-3 sm:space-y-4">
              <div className="flex items-center gap-2 text-[#0BADFB] font-black text-xs sm:text-sm uppercase tracking-widest">
                <FaHeadset size={16} />
                <span>Chandamama Customer Care</span>
              </div>

              <div className="flex flex-col select-none">
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase font-sans">
                  WE ARE ALWAYS
                </span>
                <span className="text-3xl sm:text-4xl md:text-5xl lg:text-[54px] font-black text-slate-800 dark:text-white tracking-tight leading-none uppercase font-sans mt-0.5 sm:mt-1">
                  HERE TO HELP
                </span>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3.5 mt-2 sm:mt-3">
                  <span className="bg-slate-900 text-white font-black text-xs sm:text-sm md:text-base px-3 sm:px-4 py-1 sm:py-1.5 rounded-full uppercase tracking-wider transform -rotate-3 shadow-md inline-block">
                    WITH
                  </span>
                  <span className="text-2xl sm:text-3xl md:text-4xl lg:text-[44px] font-black text-[#0BADFB] tracking-tight leading-none uppercase font-sans">
                    EVERY ORDER & QUERY
                  </span>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base font-medium max-w-md pt-1 leading-relaxed">
                Have questions about toys, sports gear, home essentials, or your delivery?
                Our dedicated support team is here to assist you anytime.
              </p>

              {/* Quick Contact Buttons */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <a
                  href={`tel:${supportPhone}`}
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <IoCall size={16} />
                  <span>Call Toll Free</span>
                </a>
                <a
                  href="https://wa.me/919324325642"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-[#25D366] hover:bg-[#20ba59] text-white font-bold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
                >
                  <FaWhatsapp size={16} />
                  <span>WhatsApp Us</span>
                </a>
              </div>
            </div>

            {/* Right Column: Chandamama Contact Banner Photo Card */}
            <div className="lg:col-span-6 relative flex items-center justify-center min-h-[280px] sm:min-h-[340px] md:min-h-[380px]">
              <div className="relative z-10 w-full max-w-lg aspect-[16/10] rounded-3xl overflow-hidden shadow-2xl border-4 border-white dark:border-slate-800 group transform hover:-translate-y-1 transition-all duration-500">
                <Image
                  src="/banners/chandamama_contact_banner.jpg"
                  alt="Chandamama Customer Care & Support Banner"
                  fill
                  priority
                  className="object-cover group-hover:scale-105 transition-transform duration-700"
                />
                {/* Subtle soft gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 via-transparent to-transparent" />

                {/* Overlay Badge at bottom of banner image */}
                <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-[#FDD811] animate-pulse" />
                    <span className="text-xs sm:text-sm font-extrabold uppercase tracking-wider drop-shadow-md">
                      24/7 Dedicated Support
                    </span>
                  </div>
                  <span className="text-[10px] sm:text-xs font-semibold bg-white/20 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                    Nationwide Assistance
                  </span>
                </div>
              </div>

              {/* Floating Quote Badge (Top Right) */}
              <div className="hidden sm:flex absolute -top-4 -right-2 z-20 bg-[#0BADFB] text-white p-3 rounded-2xl shadow-xl border-2 border-white dark:border-slate-800 transform rotate-6 hover:rotate-0 transition-transform duration-300">
                <div className="flex flex-col text-left">
                  <span className="text-[10px] font-black tracking-widest text-[#FDD811] uppercase">
                    CHANDAMAMA
                  </span>
                  <span className="text-xs font-black uppercase tracking-wider">
                    JOY IN EVERY BOX
                  </span>
                  <span className="text-[9px] text-white/90 font-medium">
                    Toys to daily essentials
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. MAIN CONTACT SECTION: INFO GRID & DIRECT MESSAGE FORM */}
      <div className="container mx-auto px-4 max-w-5xl my-10 sm:my-14 space-y-12 sm:space-y-14">
        {/* Header Tab with Underline Border Matching Reference Image */}
        <div className="relative border-b-2 border-[#0BADFB]/30 dark:border-[#0BADFB]/50 mb-8 pb-0">
          <span className="inline-block bg-[#FDD811] text-slate-900 font-extrabold text-xs sm:text-sm md:text-base uppercase tracking-wider px-6 sm:px-7 py-2 sm:py-2.5 rounded-t-xl shadow-2xs">
            {t("contact") || "CONTACT"}
          </span>
        </div>

        {/* Detailed Contact Information Grid matching the 4 icon rows in the reference image */}
        <div className="space-y-8 sm:space-y-10 text-slate-700 dark:text-slate-300">
          {/* ROW 1: OFFICES */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0BADFB]/10 text-[#0BADFB] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
              <IoLocationSharp size={22} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 w-full text-xs sm:text-sm leading-relaxed">
              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1.5 text-xs sm:text-sm">
                  REGISTERED OFFICE:
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Chandamama E-Commerce Private Limited<br />
                  510, Corporate Arena, Tech Boulevard,<br />
                  Dr. B. R. Ambedkar Road, Parel East,<br />
                  Mumbai – 400012, Maharashtra, India.
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1.5 text-xs sm:text-sm">
                  CORPORATE & FULFILLMENT OFFICE:
                </h4>
                <p className="text-slate-600 dark:text-slate-300">
                  Chandamama Logistics & Fulfillment Park,<br />
                  Block B, Ground & 1st Floor, Express Highway,<br />
                  Bhiwandi, Thane,<br />
                  Mumbai – 421302, MH, IN.
                </p>
              </div>
            </div>
          </div>

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* ROW 2: PHONE & BOARD LINES */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0BADFB]/10 text-[#0BADFB] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
              <IoCall size={20} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-10 w-full text-xs sm:text-sm leading-relaxed">
              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1 text-xs sm:text-sm">
                  TOLL FREE NO:
                </h4>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  <a href="tel:1800222621" className="hover:text-[#0BADFB] transition-colors block">
                    1800 222 621
                  </a>
                  <a href="tel:18002662200" className="hover:text-[#0BADFB] transition-colors block">
                    1800 266 2200
                  </a>
                </p>

                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mt-3 mb-1 text-xs sm:text-sm">
                  BOARD LINE NO:
                </h4>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  <a href="tel:+912261450500" className="hover:text-[#0BADFB] transition-colors">
                    +91 (22) 6145 0500 / 07
                  </a>
                </p>
              </div>

              <div>
                <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1 text-xs sm:text-sm">
                  DIRECT & WHATSAPP SUPPORT:
                </h4>
                <div className="space-y-1 font-semibold text-slate-800 dark:text-slate-200">
                  <a href="tel:+919324325642" className="hover:text-[#0BADFB] transition-colors block">
                    +91 93243 25642 (WhatsApp & Calls)
                  </a>
                  <a href="tel:+912222826444" className="hover:text-[#0BADFB] transition-colors block">
                    +91 (22) 2282 6444
                  </a>
                  <a href="tel:+912222814508" className="hover:text-[#0BADFB] transition-colors block">
                    +91 (22) 2281 4508
                  </a>
                </div>
              </div>
            </div>
          </div>

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* ROW 3: WORKING HOURS */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0BADFB]/10 text-[#0BADFB] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
              <IoTime size={22} />
            </div>
            <div className="w-full text-xs sm:text-sm leading-relaxed">
              <h4 className="font-black text-slate-900 dark:text-white uppercase tracking-wider mb-1 text-xs sm:text-sm">
                WORKING HOURS:
              </h4>
              <p className="text-slate-700 dark:text-slate-300 font-medium">
                Monday – Saturday: 9:30 am – 6:30 pm (Standard Support)<br />
                Sunday: 10:00 am – 4:00 pm (Order & Dispatch Queries)<br />
                <span className="text-[#0BADFB] font-bold">
                  Online Store & AI Chat Assistance: 24/7, 365 Days
                </span>
              </p>
            </div>
          </div>

          <hr className="border-slate-200/80 dark:border-slate-800" />

          {/* ROW 4: DEPARTMENTS & EMAILS */}
          <div className="flex items-start gap-4 sm:gap-6">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#0BADFB]/10 text-[#0BADFB] flex items-center justify-center shrink-0 mt-1 shadow-2xs">
              <IoMail size={21} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 w-full text-xs sm:text-sm">
              <div className="space-y-2">
                <p>
                  <strong className="font-extrabold text-slate-900 dark:text-white uppercase">
                    CUSTOMER ENQUIRY:
                  </strong>{" "}
                  <a
                    href={`mailto:${supportEmail}`}
                    className="text-[#0BADFB] hover:underline font-semibold"
                  >
                    {supportEmail}
                  </a>
                </p>
                <p>
                  <strong className="font-extrabold text-slate-900 dark:text-white uppercase">
                    ORDER & DELIVERY STATUS:
                  </strong>{" "}
                  <a
                    href="mailto:orders@chandamama.com"
                    className="text-[#0BADFB] hover:underline font-semibold"
                  >
                    orders@chandamama.com
                  </a>
                </p>
              </div>

              <div className="space-y-2">
                <p>
                  <strong className="font-extrabold text-slate-900 dark:text-white uppercase">
                    FEEDBACK & REVIEWS:
                  </strong>{" "}
                  <a
                    href="mailto:feedback@chandamama.com"
                    className="text-[#0BADFB] hover:underline font-semibold"
                  >
                    feedback@chandamama.com
                  </a>
                </p>
                <p>
                  <strong className="font-extrabold text-slate-900 dark:text-white uppercase">
                    CAREER & HR:
                  </strong>{" "}
                  <a
                    href="mailto:hr@chandamama.com"
                    className="text-[#0BADFB] hover:underline font-semibold"
                  >
                    hr@chandamama.com
                  </a>
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* 4. SEND US A MESSAGE FORM */}
        <div className="mt-14 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200/90 dark:border-slate-700 p-6 sm:p-10 shadow-card">
          <div className="max-w-2xl mx-auto">
            <div className="text-center mb-8">
              <h3 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white uppercase tracking-tight">
                Send Us A Message
              </h3>
              <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm mt-1.5">
                Have a question or custom request? Fill out the form below and our Chandamama support team will respond within a few hours.
              </p>
            </div>

            {submitted && (
              <div className="mb-6 p-4 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 flex items-center gap-3 text-emerald-800 dark:text-emerald-300 text-sm font-semibold">
                <IoCheckmarkCircle size={22} className="text-emerald-500 shrink-0" />
                <span>
                  Thank you! Your message has been sent successfully. We will be in touch shortly.
                </span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    name="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your name"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+91 98765 43210"
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                    Department / Topic
                  </label>
                  <select
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] transition-all cursor-pointer"
                  >
                    <option value="General Inquiry">General Inquiry</option>
                    <option value="Order & Delivery Tracking">Order & Delivery Tracking</option>
                    <option value="Toys & Games Query">Toys & Games Query</option>
                    <option value="Sports Equipment Support">Sports Equipment Support</option>
                    <option value="Home & Kitchen Appliance Support">Home & Kitchen Appliance Support</option>
                    <option value="Return / Replacement Request">Return / Replacement Request</option>
                    <option value="Seller / Business Collaboration">Seller / Business Collaboration</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1.5">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  placeholder="How can we assist you today? Please share order ID if applicable..."
                  className="w-full px-4 py-2.5 rounded-xl border border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900 text-slate-900 dark:text-white text-sm focus:outline-none focus:border-[#0BADFB] focus:ring-1 focus:ring-[#0BADFB] transition-all resize-none"
                />
              </div>

              <div className="pt-2 text-center">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center justify-center gap-2 px-8 py-3 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer disabled:opacity-70"
                >
                  <span>{isSubmitting ? "Sending..." : "Send Message"}</span>
                  <HiArrowRight size={16} />
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactUs;
