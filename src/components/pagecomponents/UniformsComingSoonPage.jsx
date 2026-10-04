import React, { useState } from "react";
import Layout from "../layout/Layout";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import Image from "next/image";
import { t } from "@/utils/translation";
import { toast } from "react-toastify";
import { FiBell, FiShield, FiCheckCircle, FiTruck, FiStar, FiClock, FiTag } from "react-icons/fi";

const mockUniformProducts = [
  {
    id: 1,
    name: "Classic Academy Blazer Set",
    category: "Boys & Girls Uniform",
    desc: "Premium stain-resistant poly-viscose blend blazer with school crest pocket.",
    estimatedPrice: "₹1,299",
    tag: "Launching Soon",
  },
  {
    id: 2,
    name: "Crisp Cotton School Shirt (Pack of 2)",
    category: "Unisex Everyday Wear",
    desc: "Breathable 100% combed cotton easy-iron shirts for maximum daily comfort.",
    estimatedPrice: "₹699",
    tag: "Coming Soon",
  },
  {
    id: 3,
    name: "Girls Pleated Uniform Skirt & Pinafore",
    category: "Girls Uniform",
    desc: "Wrinkle-free pleated skirt with adjustable waistband & elastic insert.",
    estimatedPrice: "₹799",
    tag: "Coming Soon",
  },
  {
    id: 4,
    name: "Boys Tailored School Trousers",
    category: "Boys Uniform",
    desc: "Durable reinforced knee trousers designed for active daily school wear.",
    estimatedPrice: "₹849",
    tag: "Coming Soon",
  },
  {
    id: 5,
    name: "Ergonomic Waterproof School Backpack",
    category: "Accessories",
    desc: "Orthopedic padded shoulder straps with multi-compartment storage.",
    estimatedPrice: "₹999",
    tag: "Launching Soon",
  },
  {
    id: 6,
    name: "All-Weather School Shoes & Socks Combo",
    category: "Footwear",
    desc: "Genuine leather formal school shoes with antibacterial cotton socks.",
    estimatedPrice: "₹899",
    tag: "Coming Soon",
  },
];

const UniformsComingSoonPage = () => {
  const [emailOrPhone, setEmailOrPhone] = useState("");
  const [notified, setNotified] = useState(false);

  const handleNotifySubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone.trim()) {
      toast.error("Please enter your email or phone number");
      return;
    }
    setNotified(true);
    toast.success("Thank you! We will notify you as soon as School Uniforms launch!");
    setEmailOrPhone("");
  };

  return (
    <Layout>
      <section className="bg-slate-50/60 min-h-[80vh] pb-16">
        <BreadCrumb />

        <div className="container mx-auto px-4 max-w-7xl my-6 md:my-10">
          {/* Hero Banner Section */}
          <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-sky-900 via-sky-800 to-indigo-900 text-white shadow-xl border border-sky-700/30 mb-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 items-center">
              {/* Text Area */}
              <div className="p-6 sm:p-10 lg:p-12 lg:col-span-7 flex flex-col justify-center gap-4 z-10">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0BADFB]/20 border border-[#0BADFB]/40 backdrop-blur-md w-fit">
                  <FiStar className="text-[#0BADFB] animate-pulse" size={16} />
                  <span className="text-xs font-bold uppercase tracking-wider text-[#7DD3FC]">
                    Exciting New Category • Launching Soon
                  </span>
                </div>

                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
                  School Uniforms & <span className="text-[#0BADFB]">Schoolwear</span>
                </h1>

                <p className="text-slate-200 text-sm sm:text-base leading-relaxed max-w-xl font-medium">
                  We are bringing high-quality, durable, and comfortable school uniforms, blazers, PE kits, and accessories straight to your doorstep. Tailored for all grade levels!
                </p>


              </div>

              {/* Image Area */}
              <div className="lg:col-span-5 relative h-64 sm:h-80 lg:h-full min-h-[320px] w-full">
                <Image
                  src="/uniform_coming_soon.jpg"
                  alt="School Uniforms Coming Soon"
                  fill
                  priority
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-sky-900/80 via-transparent to-transparent lg:bg-gradient-to-r lg:from-sky-900 lg:to-transparent pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Value Highlights */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
            {[
              {
                icon: <FiTag size={24} className="text-[#0BADFB]" />,
                title: "Premium Fabric",
                desc: "Breathable & stain resistant materials engineered for daily play.",
              },
              {
                icon: <FiShield size={24} className="text-[#0BADFB]" />,
                title: "Standardized Sizing",
                desc: "Precise fit guarantee for all age groups and school codes.",
              },
              {
                icon: <FiTruck size={24} className="text-[#0BADFB]" />,
                title: "Fast Doorstep Delivery",
                desc: "Hassle-free home delivery right before the new academic session.",
              },
              {
                icon: <FiClock size={24} className="text-[#0BADFB]" />,
                title: "Easy Exchanges",
                desc: "Seamless size swaps and hassle-free returns support.",
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-start gap-4 hover:shadow-card transition-all"
              >
                <div className="p-3 rounded-xl bg-[#e0f7fe] shrink-0">
                  {item.icon}
                </div>
                <div>
                  <h3 className="font-extrabold text-sm text-slate-900">{item.title}</h3>
                  <p className="text-xs text-slate-500 mt-1 leading-snug">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Product Preview Showcase */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-card p-6 sm:p-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-100 mb-8">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-[#0BADFB]">
                  Sneak Peek Preview
                </span>
                <h2 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                  Upcoming Uniform Products
                </h2>
              </div>
              <span className="px-4 py-1.5 rounded-full bg-[#e0f7fe] text-[#0BADFB] text-xs font-bold border border-[#0BADFB]/30 w-fit">
                Catalog Under Prep
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {mockUniformProducts.map((item) => (
                <div
                  key={item.id}
                  className="rounded-2xl border border-slate-200/80 bg-slate-50/40 p-5 flex flex-col justify-between hover:border-[#0BADFB] hover:shadow-md transition-all group"
                >
                  <div>
                    <div className="flex justify-between items-start mb-3">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-slate-400 bg-slate-200/60 px-2.5 py-1 rounded-full">
                        {item.category}
                      </span>
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-50 border border-amber-200/60 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <FiClock size={11} />
                        {item.tag}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-slate-900 group-hover:text-[#0BADFB] transition-colors">
                      {item.name}
                    </h3>
                    <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>

                  <div className="pt-5 mt-4 border-t border-slate-200/60 flex items-center justify-between">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-slate-400 block">Est. Price</span>
                      <span className="font-extrabold text-sm text-slate-900">{item.estimatedPrice}</span>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        toast.info(`We will alert you when "${item.name}" is available!`);
                      }}
                      className="px-3.5 py-1.5 rounded-full border border-[#0BADFB]/30 hover:border-[#0BADFB] bg-[#e0f7fe] text-[#0BADFB] font-bold text-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
                    >
                      Remind Me
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default UniformsComingSoonPage;
