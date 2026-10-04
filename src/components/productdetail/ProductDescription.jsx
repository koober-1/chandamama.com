import React, { useEffect, useState, useMemo } from "react";
import { t } from "@/utils/translation";
import { Progress } from "@/components/ui/progress";
import * as api from "@/api/apiRoutes";
import NoReviewImage from "@/assets/No_Review_Found.svg";
import ProductReviewCard from "./ProductReviewCard";
import RatingImagesModal from "./RatingImagesModal";
import RatingLightBox from "./RatingLightBox";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useSelector } from "react-redux";
import { FaCheckCircle, FaStar, FaChevronDown, FaChevronUp } from "react-icons/fa";

const ProductDescription = ({ product, ratingData }) => {
  const setting = useSelector((state) => state.Setting.setting);

  const [selectedTab, setSelectedTab] = useState(0);
  const [ratingImages, setRatingImages] = useState([]);
  const [showImagesModal, setShowImagesModal] = useState(false);
  const [showLightBox, setShowLightbox] = useState(false);
  const [imageIndex, setImageIndex] = useState(0);
  const [lightBoxImages, setLightBoxImages] = useState([]);
  const [isExpandedDesc, setIsExpandedDesc] = useState(false);

  useEffect(() => {
    if (product?.id) {
      fetchProductImages();
    }
  }, [product?.id]);

  const fetchProductImages = async () => {
    try {
      const result = await api.getProductImages({
        id: product?.id,
        limit: 8,
        offset: 0,
      });
      if (result?.data) setRatingImages(result.data);
    } catch (error) {
      console.log("error fetching review images", error);
    }
  };

  const handleLightBox = (index) => {
    const images = ratingImages?.map((img) => ({
      src: img?.src ? img?.src : img,
    }));
    setLightBoxImages(images);
    setImageIndex(index);
    setShowLightbox(true);
  };

  const ratings = [
    { stars: 5, count: ratingData?.five_star_rating || 0 },
    { stars: 4, count: ratingData?.four_star_rating || 0 },
    { stars: 3, count: ratingData?.three_star_rating || 0 },
    { stars: 2, count: ratingData?.two_star_rating || 0 },
    { stars: 1, count: ratingData?.one_star_rating || 0 },
  ];
  const totalRatings = ratings.reduce((total, r) => total + r.count, 0);

  // Dynamic Product Highlights from backend tags/highlights/indicators
  const highlightsList = useMemo(() => {
    if (!product) return [];
    const list = [];
    if (product.indicator == 1) list.push("100% Natural & Vegetarian");
    if (product.cancelable_status == 1) list.push("Cancelable Order Policy");
    if (product.return_status == 1) list.push(`${product.return_days || 7} Days Return Policy`);
    if (product.manufacturer) list.push(`Manufactured by ${product.manufacturer}`);
    if (product.made_in) list.push(`Origin: ${product.made_in}`);
    if (product.highlights && Array.isArray(product.highlights)) {
      list.push(...product.highlights);
    }
    if (product.tag_names) {
      const tags = String(product.tag_names).split(",").map((t) => t.trim()).filter(Boolean);
      tags.forEach((t) => list.push(`Premium ${t}`));
    }
    return [...new Set(list)].slice(0, 6);
  }, [product]);

  // Dynamic Specifications Table
  const specificationsList = useMemo(() => {
    if (!product) return [];
    const specs = [];
    if (product.category_name || product.category?.name) {
      specs.push({ label: "Category", value: product.category?.name || product.category_name });
    }
    if (product.sub_category_name || product.sub_category?.name) {
      specs.push({ label: "Sub Category", value: product.sub_category?.name || product.sub_category_name });
    }
    if (product.sub_sub_category_name || product.sub_sub_category?.name) {
      specs.push({ label: "Sub-Sub Category", value: product.sub_sub_category?.name || product.sub_sub_category_name });
    }
    if (product.seller_name || product.seller?.name) {
      specs.push({ label: "Seller / Brand", value: product.seller?.name || product.seller_name });
    }
    if (product.variants?.[0]?.unit?.short_code) {
      specs.push({ label: "Unit Measurement", value: product.variants[0].unit.short_code });
    }
    if (product.variants?.length) {
      specs.push({ label: "Available Variants", value: `${product.variants.length} Options` });
    }
    if (product.sku || product.variants?.[0]?.sku) {
      specs.push({ label: "SKU / Code", value: product.sku || product.variants[0].sku });
    }
    if (product.fssai_lic_no) {
      specs.push({ label: "FSSAI License", value: product.fssai_lic_no });
    }
    return specs;
  }, [product]);

  const rawDescription = product?.translations?.description || product?.description || "";

  return (
    <>
      <div className="bg-white dark:bg-slate-800 rounded-[24px] border border-slate-200/80 dark:border-slate-700/80 shadow-sm overflow-hidden my-8">
        {/* Tab Navigation Bar */}
        <div className="flex flex-wrap items-center gap-2 p-3 md:px-6 md:py-4 border-b border-slate-100 dark:border-slate-700 bg-slate-50/60 dark:bg-slate-800/80">
          <button
            type="button"
            onClick={() => setSelectedTab(0)}
            className={`text-xs font-extrabold px-5 py-2.5 rounded-full transition-all cursor-pointer ${
              selectedTab === 0
                ? "bg-[#0BADFB] text-white shadow-xs"
                : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/60"
            }`}
          >
            {t("product_desc_title") || "Description"}
          </button>

          {highlightsList.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedTab(1)}
              className={`text-xs font-extrabold px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                selectedTab === 1
                  ? "bg-[#0BADFB] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Product Highlights
            </button>
          )}

          {specificationsList.length > 0 && (
            <button
              type="button"
              onClick={() => setSelectedTab(2)}
              className={`text-xs font-extrabold px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                selectedTab === 2
                  ? "bg-[#0BADFB] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              Specifications
            </button>
          )}

          {product?.product_rating == true && (
            <button
              type="button"
              onClick={() => setSelectedTab(3)}
              className={`text-xs font-extrabold px-5 py-2.5 rounded-full transition-all cursor-pointer ${
                selectedTab === 3
                  ? "bg-[#0BADFB] text-white shadow-xs"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 hover:bg-slate-200/60"
              }`}
            >
              {t("rating_and_reviews") || "Reviews"} ({ratingData?.rating_list?.length || 0})
            </button>
          )}
        </div>

        {/* Tab Contents */}
        <div className="p-6 md:p-8">
          {/* TAB 0: Description */}
          {selectedTab === 0 && (
            <div>
              {rawDescription ? (
                <div>
                  <div
                    className={`text-xs sm:text-sm text-slate-700 dark:text-slate-200 leading-relaxed max-w-none api-html-content ${
                      !isExpandedDesc && rawDescription.length > 400 ? "line-clamp-4" : ""
                    }`}
                    dangerouslySetInnerHTML={{ __html: rawDescription }}
                  />

                  {rawDescription.length > 400 && (
                    <button
                      type="button"
                      onClick={() => setIsExpandedDesc(!isExpandedDesc)}
                      className="mt-3 inline-flex items-center gap-1.5 text-xs font-extrabold text-[#0BADFB] hover:underline cursor-pointer"
                    >
                      <span>{isExpandedDesc ? "Show Less" : "Read More"}</span>
                      {isExpandedDesc ? <FaChevronUp size={12} /> : <FaChevronDown size={12} />}
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-xs font-semibold text-slate-400 italic">
                  {t("no_product_description") || "No detailed description available for this product."}
                </p>
              )}
            </div>
          )}

          {/* TAB 1: Product Highlights */}
          {selectedTab === 1 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {highlightsList.map((highlight, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200/80 dark:border-slate-700"
                >
                  <FaCheckCircle className="text-[#0BADFB] shrink-0" size={18} />
                  <span className="text-xs font-extrabold text-slate-800 dark:text-slate-100">
                    {highlight}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* TAB 2: Specifications */}
          {selectedTab === 2 && (
            <div className="max-w-3xl">
              <div className="rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden divide-y divide-slate-100 dark:divide-slate-700">
                {specificationsList.map((spec, idx) => (
                  <div
                    key={idx}
                    className="grid grid-cols-12 p-3.5 text-xs font-semibold bg-white dark:bg-slate-800 odd:bg-slate-50/60 dark:odd:bg-slate-700/30"
                  >
                    <span className="col-span-5 text-slate-400 dark:text-slate-400 font-bold uppercase tracking-wider">
                      {spec.label}
                    </span>
                    <span className="col-span-7 text-slate-900 dark:text-white font-extrabold">
                      {spec.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: Reviews */}
          {selectedTab === 3 && (
            <div>
              {totalRatings !== 0 ? (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  {/* Rating Overview */}
                  <div className="lg:col-span-4 flex flex-col gap-4">
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      {t("customer_reviews") || "Customer Reviews"}
                    </h3>
                    <div className="flex items-center gap-4 p-5 rounded-2xl bg-slate-50 dark:bg-slate-700/50 border border-slate-200 dark:border-slate-700">
                      <div className="w-14 h-14 rounded-2xl bg-[#0BADFB] text-white flex items-center justify-center text-2xl font-black shadow-xs shrink-0">
                        {(ratingData?.average_rating || 4.8).toFixed(1)}
                      </div>
                      <div>
                        <p className="text-xs font-bold text-slate-900 dark:text-white">
                          {t("overall_rating") || "Overall Rating"}
                        </p>
                        <p className="text-[11px] text-slate-400 mt-0.5 font-medium">
                          Based on {totalRatings.toLocaleString()} verified ratings
                        </p>
                      </div>
                    </div>

                    {/* Rating Progress Bars */}
                    <div className="space-y-2 pt-1">
                      {ratings.map(({ stars, count }) => {
                        const percentage = totalRatings > 0 ? (count / totalRatings) * 100 : 0;
                        return (
                          <div key={stars} className="flex items-center gap-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold">
                            <span className="w-3 text-right">{stars}</span>
                            <span className="text-amber-400">★</span>
                            <Progress value={percentage} className="flex-1 h-2 bg-slate-100 dark:bg-slate-700" />
                            <span className="w-8 text-right font-bold text-slate-400">{count}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Rating Comments List */}
                  <div className="lg:col-span-8 space-y-4">
                    <h3 className="text-xs font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                      {t("customer_feedbacks") || "Recent Feedback"}
                    </h3>
                    <div className="space-y-3">
                      {ratingData?.rating_list?.map((review, index) => (
                        <div key={index} className="bg-slate-50/60 dark:bg-slate-700/40 rounded-2xl p-4 border border-slate-200/80 dark:border-slate-700">
                          <ProductReviewCard review={review} />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ) : (
                <div className="py-12 text-center flex flex-col items-center justify-center">
                  <div className="w-20 h-20 relative mb-3 opacity-60">
                    <ImageWithPlaceholder
                      src={NoReviewImage}
                      alt="No reviews"
                      height={80}
                      width={80}
                    />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    {t("no_ratings_available_yet") || "No reviews yet"}
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 max-w-xs font-medium">
                    Be the first to review this product after your order!
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <RatingImagesModal
        showImagesModal={showImagesModal}
        setShowImagesModal={setShowImagesModal}
        images={ratingImages}
      />
      <RatingLightBox
        showLightBox={showLightBox}
        setShowLightbox={setShowLightbox}
        images={lightBoxImages}
        imageIndex={imageIndex}
      />
    </>
  );
};

export default ProductDescription;
