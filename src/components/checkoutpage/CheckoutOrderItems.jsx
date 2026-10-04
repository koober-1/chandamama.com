import React from "react";
import { useSelector } from "react-redux";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { getVariantColorData } from "@/lib/utils";
import { t } from "@/utils/translation";
import { FiShoppingBag } from "react-icons/fi";

const CheckoutOrderItems = ({ checkoutData }) => {
  const setting = useSelector((state) => state.Setting.setting);
  const cart = useSelector((state) => state.Cart);

  // Prioritize full cart objects from checkoutData API response or Redux store
  const products =
    checkoutData?.cart?.length > 0
      ? checkoutData.cart
      : checkoutData?.products?.length > 0
      ? checkoutData.products
      : cart?.cartProducts?.length > 0
      ? cart.cartProducts
      : cart?.cart?.cart?.length > 0
      ? cart.cart.cart
      : Array.isArray(cart?.cart)
      ? cart.cart
      : [];

  if (!products || products.length === 0) {
    return null;
  }

  return (
    <div className="w-full bg-slate-50/70 border border-slate-200/80 rounded-2xl p-4 transition-all">
      {/* Header */}
      <div className="flex items-center justify-between pb-2.5 mb-2.5 border-b border-slate-200/60">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-sky-100/80 text-[#0BADFB] flex items-center justify-center font-bold">
            <FiShoppingBag size={15} />
          </div>
          <div>
            <h3 className="font-extrabold text-slate-900 text-xs md:text-sm tracking-tight">
              {t("items_in_your_order") || "Items in your Order"}
            </h3>
            <p className="text-[11px] text-slate-500 font-medium">
              {products.length} {products.length === 1 ? t("item") || "item" : t("items") || "items"}
            </p>
          </div>
        </div>
      </div>

      {/* Small Compact Product Cards */}
      <div className="flex flex-col gap-2 max-h-[300px] overflow-y-auto pr-0.5 custom-scrollbar">
        {products.map((item, index) => {
          const colorData =
            getVariantColorData(item) ||
            getVariantColorData(item?.product_variant) ||
            getVariantColorData(item?.variant) ||
            getVariantColorData(item?.color_variant) ||
            getVariantColorData(item?.product?.color_variant);

          // Safely extract product title with object/translation fallbacks
          let title = "";
          if (typeof item?.name === "string" && item.name.trim() !== "") {
            title = item.name;
          } else if (typeof item?.product_name === "string" && item.product_name.trim() !== "") {
            title = item.product_name;
          } else if (item?.name && typeof item.name === "object") {
            title = item.name.name || item.name.translations?.[0]?.name || "";
          }

          if (!title && item?.product) {
            if (typeof item.product.name === "string" && item.product.name.trim() !== "") {
              title = item.product.name;
            } else if (item.product.name && typeof item.product.name === "object") {
              title = item.product.name.name || item.product.name.translations?.[0]?.name || "";
            }
          }

          if (!title && item?.product_variant) {
            if (typeof item.product_variant.name === "string" && item.product_variant.name.trim() !== "") {
              title = item.product_variant.name;
            }
          }

          if (!title) {
            title = t("product") || "Product";
          }

          const image =
            item?.image_url ||
            item?.product?.image_url ||
            (Array.isArray(item?.images) ? item?.images[0] : item?.images) ||
            item?.image ||
            item?.product_variant?.image_url ||
            item?.product?.image ||
            "";

          const measurement =
            item?.measurement || item?.variant?.measurement || item?.product_variant?.measurement || "";

          const unitCode =
            item?.unit?.translations?.short_code ||
            item?.unit_code ||
            item?.unit?.short_code ||
            item?.unit_name ||
            item?.stock_unit_name ||
            item?.product_variant?.stock_unit_name ||
            "";

          const qty = Number(item?.qty || item?.quantity || 1);

          // Extract unit price with full fallbacks
          const num = (val) => {
            const parsed = parseFloat(val);
            return !isNaN(parsed) && parsed > 0 ? parsed : 0;
          };

          let unitPrice =
            num(item?.discounted_price) ||
            num(item?.price) ||
            num(item?.taxable_amount) ||
            num(item?.product_variant?.discounted_price) ||
            num(item?.product_variant?.price) ||
            num(item?.product?.discounted_price) ||
            num(item?.product?.price) ||
            0;

          const totalPrice = unitPrice * qty;

          return (
            <div
              key={index}
              className="flex items-center justify-between gap-3 p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs hover:border-[#0BADFB]/40 transition-all"
            >
              {/* Product Image & Info */}
              <div className="flex items-center gap-2.5 min-w-0 flex-1">
                <div className="w-11 h-11 rounded-lg bg-slate-50 border border-slate-100 p-1 flex-shrink-0 relative overflow-hidden">
                  <ImageWithPlaceholder
                    src={image}
                    alt={title}
                    width={88}
                    height={88}
                    className="w-full h-full object-contain rounded"
                  />
                  <span className="absolute -top-1 -right-1 bg-[#0BADFB] text-white text-[9px] font-black w-3.5 h-3.5 rounded-full flex items-center justify-center border border-white shadow-2xs">
                    {qty}
                  </span>
                </div>

                <div className="min-w-0 flex-1">
                  <h4 className="font-bold text-xs text-slate-900 line-clamp-1 leading-snug">
                    {title}
                  </h4>

                  {/* Variant Measurement & Color Badge */}
                  <div className="flex items-center gap-1.5 flex-wrap mt-0.5">
                    {(measurement || unitCode) && (
                      <span className="inline-block text-[10px] font-semibold text-slate-600 bg-slate-100 px-1.5 py-0.2 rounded-md">
                        {measurement} {unitCode}
                      </span>
                    )}

                    {colorData?.name && (
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-slate-700 bg-slate-100 px-1.5 py-0.2 rounded-md border border-slate-200/60">
                        {colorData.hex && (
                          <span
                            className="w-2.5 h-2.5 rounded-full border border-slate-300 shadow-2xs shrink-0 inline-block"
                            style={{ backgroundColor: colorData.hex }}
                          />
                        )}
                        <span>{colorData.name}</span>
                      </span>
                    )}
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="text-right flex-shrink-0">
                <div className="text-xs font-black text-slate-900">
                  {setting?.currency || "₹"}{" "}
                  {totalPrice.toFixed(
                    setting?.decimal_point ? setting?.decimal_point : 0
                  )}
                </div>
                {qty > 1 && (
                  <div className="text-[10px] text-slate-400 font-medium">
                    {setting?.currency || "₹"}{" "}
                    {unitPrice.toFixed(
                      setting?.decimal_point ? setting?.decimal_point : 0
                    )}{" "}
                    ea
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default CheckoutOrderItems;
