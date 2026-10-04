import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  setFilterCategory,
  clearAllFilter,
  setFilterBrands,
  setFilterMinMaxPrice,
  setFilterBySeller,
} from "@/redux/slices/productFilterSlice";
import * as api from "@/api/apiRoutes";
import { t } from "@/utils/translation";
import CategoryTree from "./CategoryTree";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { FaChevronDown } from "react-icons/fa";
import { Checkbox } from "@/components/ui/checkbox";
import dynamic from "next/dynamic";
// import { resetSelectedCategories } from "@/redux/slices/productFilterSlice";
const PriceSlider = dynamic(() => import("./PriceSlider"), { ssr: false });
import FilterSkeleton from "./FilterSkeleton";

const Filter = ({
  setProductResult,
  setOffset,
  minPrice,
  maxPrice,
  values,
  setValues,
  setMinPrice,
  setMaxPrice,
  setShowFilter = () => { },
  hideCategory,
  disableFilter,
}) => {
  const filter = useSelector((state) => state.ProductFilter);
  const setting = useSelector((state) => state?.Setting?.setting);
  const city = useSelector((state) => state.City);
  const language = useSelector((state) => state.Language.selectedLanguage);

  const effectiveLat =
    city?.city?.latitude || city?.latitude || setting?.default_city?.latitude || 23.242;
  const effectiveLng =
    city?.city?.longitude || city?.longitude || setting?.default_city?.longitude || 69.6669;

  const dispatch = useDispatch();
  const [categories, setCategories] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [brands, setbrands] = useState(null);
  const [sellers, setSellers] = useState(null);
  const [totalBrands, setTotalBrands] = useState();
  const [totalSeller, setTotalSeller] = useState();
  const [brandOffset, setBrandOffset] = useState(0);
  const [sellerOffset, setSellerOffset] = useState(0);
  const [tempMinPrice, setTempMinPrice] = useState(null);
  const [tempMaxPrice, setTempMaxPrice] = useState(null);
  const [defaultMinPrice, setDefaultMinPrice] = useState(minPrice);
  const [defaultMaxPrice, setDefaultMaxPrice] = useState(maxPrice);
  const [activeKey, setActiveKey] = useState(["1", "2", "3", "4"]);
  const brandLimit = 10;
  const sellerLimit = 10;
  // const [loading, setLoading] = useState(false);
  // const [loadingCategories, setLoadingCategories] = useState(false);
  const [loadingBrands, setLoadingBrands] = useState(false);
  const [loadingSellers, setLoadingSellers] = useState(false);
  useEffect(() => {
    if (!language?.id) return;
    setbrands(null);
    setSellers(null);
    setBrandOffset(0);
    setSellerOffset(0);
    fetchBrands(0);
    fetchSellers(0);
  }, [language?.id]);

  const { data: categoriesData, isLoading: loadingCategories } = useQuery({
    queryKey: ["filter-category", language?.id],

    queryFn: async () => {
      const response = await api.getCategories();
      return response.data;
    },

    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,
  });

  useEffect(() => {
    if (categoriesData) {
      setCategories(categoriesData);
    }
  }, [categoriesData]);

  useEffect(() => {
    if (
      filter?.category_id &&
      filter?.category_id !== "null" &&
      filter?.category_id !== "undefined" &&
      filter?.category_id !== "NaN" &&
      filter?.category_id !== "all categories"
    ) {
      const cats = String(filter.category_id)
        .split(",")
        .map((c) => parseInt(c))
        .filter((c) => !isNaN(c));
      setSelectedCategories(cats);
    } else {
      setSelectedCategories([]);
    }
  }, [filter?.category_id]);

  const handleActiveKey = (key) => {
    setActiveKey((prevActiveKeys) =>
      prevActiveKeys.includes(key)
        ? prevActiveKeys.filter((item) => item !== key)
        : [...prevActiveKeys, key],
    );
  };

  const handleCategoryChange = (categories) => {
    const validCats = Array.isArray(categories)
      ? categories.map((c) => parseInt(c)).filter((c) => !isNaN(c))
      : [];
    setSelectedCategories(validCats);
    setOffset(0);
    dispatch(setFilterCategory({ data: validCats.join(",") }));
  };

  const fetchSellers = useCallback(
    async (sOffset) => {
      setLoadingSellers(true);
      try {
        const result = await api.getSellers({
          latitude: effectiveLat,
          longitude: effectiveLng,
          limit: sellerLimit,
          offset: sOffset,
        });
        if (result.status === 1) {
          setSellers((prevSellers) => {
            if (prevSellers == null) {
              return result?.data;
            } else {
              return [...prevSellers, ...result?.data];
            }
          });
          setTotalSeller(result?.total);
        }
        // setSellers(result?.data);
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoadingSellers(false);
      }
    },
    [effectiveLat, effectiveLng, language?.id],
  );

  // const fetchCategories = async () => {
  //   setLoadingCategories(true);
  //   try {
  //     const categories = await api.getCategories();
  //     setCategories(categories.data);
  //   } catch (error) {
  //     console.log("erorr", error);
  //   } finally {
  //     setLoadingCategories(false);
  //   }
  // };



  const fetchBrands = useCallback(
    async (bOffset) => {
      setLoadingBrands(true);
      try {
        const result = await api.getBrands({
          limit: brandLimit,
          offset: bOffset,
          latitude: effectiveLat,
          longitude: effectiveLng,
        });
        if (result.status === 1) {
          setbrands((prevBrands) => {
            if (prevBrands == null) {
              return result?.data;
            } else {
              return [...prevBrands, ...result?.data];
            }
          });
          setTotalBrands(result?.total);
        }
      } catch (error) {
        console.log("Error", error);
      } finally {
        setLoadingBrands(false);
      }
    },
    [effectiveLat, effectiveLng, language?.id],
  );

  const filterbyBrands = (brand) => {
    var brand_ids = [...filter.brand_ids];
    if (brand_ids.includes(brand.id)) {
      brand_ids.splice(brand_ids.indexOf(brand.id), 1);
    } else {
      brand_ids.push(parseInt(brand.id));
    }
    const sorted_brand_ids = sort_unique_brand_ids(brand_ids);
    dispatch(setFilterBrands({ data: sorted_brand_ids }));
  };

  const sort_unique_brand_ids = (int_brand_ids) => {
    if (int_brand_ids.length === 0) return int_brand_ids;
    int_brand_ids = int_brand_ids.sort(function (a, b) {
      return a * 1 - b * 1;
    });
    var ret = [int_brand_ids[0]];
    for (var i = 1; i < int_brand_ids.length; i++) {
      //Start loop at 1: arr[0] can never be a duplicate
      if (int_brand_ids[i - 1] !== int_brand_ids[i]) {
        ret.push(int_brand_ids[i]);
      }
    }
    return ret;
  };

  const loadMoreBrands = () => {
    setBrandOffset((prevOffset) => prevOffset + brandLimit);
    fetchBrands(brandOffset + brandLimit);
  };

  const loadMoreSellers = () => {
    setSellerOffset((prevOffset) => prevOffset + sellerLimit);
    fetchSellers(sellerOffset + sellerLimit);
  };

  useEffect(() => {
    setDefaultMinPrice(minPrice);
    setDefaultMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  return (
    <>
      {loadingCategories || loadingBrands || loadingSellers ? (
        <FilterSkeleton />
      ) : (
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-subtle overflow-hidden">
          {/* Filter Header */}
          <div className="p-4 border-b border-slate-100 bg-slate-50/60 flex justify-between items-center">
            <h5 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              {t("filters") || "Filters"}
            </h5>
            <button
              type="button"
              className="text-xs font-bold text-[#0BADFB] hover:underline transition-colors cursor-pointer"
              onClick={() => {
                setSelectedCategories([]);
                setMinPrice(defaultMinPrice);
                setMaxPrice(defaultMaxPrice);
                setValues([defaultMinPrice, defaultMaxPrice]);
                setTempMinPrice(defaultMinPrice);
                setTempMaxPrice(defaultMaxPrice);

                if (disableFilter) {
                  dispatch(
                    clearAllFilter({
                      preserveCategory: filter.listing_source === "category",
                    }),
                  );
                } else {
                  dispatch(clearAllFilter());
                }
                setOffset(0);
                setShowFilter(false);
                setProductResult([]);
              }}
            >
              {t("clearAll") || "Reset All"}
            </button>
          </div>

          {/* Categories Filter */}
          {!hideCategory && (
            <Collapsible
              open={activeKey.includes("1")}
              className="w-full border-b border-slate-100"
              onOpenChange={() => handleActiveKey("1")}
            >
              <CollapsibleTrigger className="w-full px-4 py-3.5 flex justify-between items-center hover:bg-slate-50/80 transition-colors group cursor-pointer">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t("product_category") || "Categories"}
                </span>
                <span
                  className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${activeKey.includes("1") ? "rotate-0" : "-rotate-90"
                    }`}
                >
                  <FaChevronDown size={11} />
                </span>
              </CollapsibleTrigger>

              <CollapsibleContent>
                <div className="px-4 pb-4">
                  <CategoryTree
                    categories={categories}
                    selectedCategories={selectedCategories}
                    onCategoryChange={handleCategoryChange}
                    initialFilter={filter}
                  />
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Brands Filter */}
          {brands && brands?.length > 0 && (
            <Collapsible
              open={activeKey.includes("2")}
              className="w-full border-b border-slate-100"
              onOpenChange={() => handleActiveKey("2")}
            >
              <CollapsibleTrigger className="w-full px-4 py-3.5 flex justify-between items-center hover:bg-slate-50/80 transition-colors group cursor-pointer">
                <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                  {t("brands") || "Brands"}
                </span>
                <span
                  className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${activeKey.includes("2") ? "rotate-0" : "-rotate-90"
                    }`}
                >
                  <FaChevronDown size={11} />
                </span>
              </CollapsibleTrigger>
              <CollapsibleContent>
                <div className="px-4 pb-4 space-y-2">
                  {brands?.map((brand) => {
                    const isChecked = filter.brand_ids.includes(brand.id);
                    return (
                      <div
                        key={brand.id}
                        className="flex items-center gap-2.5 py-1 cursor-pointer group"
                        onClick={() => {
                          setProductResult([]);
                          filterbyBrands(brand);
                        }}
                      >
                        <Checkbox
                          className="data-[state=checked]:bg-[#0BADFB] data-[state=checked]:border-[#0BADFB] border-slate-300 rounded"
                          checked={isChecked}
                          onCheckedChange={() => {
                            setProductResult([]);
                            filterbyBrands(brand);
                          }}
                        />
                        <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                          {brand?.translations?.name ?? brand?.name}
                        </span>
                      </div>
                    );
                  })}
                  {brands?.length < totalBrands && (
                    <button
                      type="button"
                      className="text-xs font-semibold text-[#0BADFB] hover:underline pt-1 block cursor-pointer"
                      onClick={loadMoreBrands}
                    >
                      {t("showMore") || "+ View More"}
                    </button>
                  )}
                </div>
              </CollapsibleContent>
            </Collapsible>
          )}

          {/* Sellers Filter */}
          <Collapsible
            open={activeKey.includes("3")}
            className="w-full border-b border-slate-100"
            onOpenChange={() => handleActiveKey("3")}
          >
            <CollapsibleTrigger className="w-full px-4 py-3.5 flex justify-between items-center hover:bg-slate-50/80 transition-colors group cursor-pointer">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t("sellers") || "Sellers"}
              </span>
              <span
                className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${activeKey.includes("3") ? "rotate-0" : "-rotate-90"
                  }`}
              >
                <FaChevronDown size={11} />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="space-y-2">
                {sellers?.map((seller) => {
                  const isChecked = filter.seller_id === seller.id;
                  return (
                    <div
                      key={seller.id}
                      className="flex items-center gap-2.5 py-1 cursor-pointer group"
                      onClick={() => {
                        setProductResult([]);
                        setOffset(0);
                        dispatch(
                          setFilterBySeller({
                            data: seller.id,
                          }),
                        );
                      }}
                    >
                      <input
                        type="radio"
                        name="seller"
                        className="h-4 w-4 text-[#0BADFB] focus:ring-[#0BADFB] accent-[#0BADFB] border-slate-300 cursor-pointer"
                        checked={isChecked}
                        onChange={() => {
                          setProductResult([]);
                          setOffset(0);
                          dispatch(
                            setFilterBySeller({
                              data: seller.id,
                            }),
                          );
                        }}
                      />
                      <span className="text-xs font-medium text-slate-700 group-hover:text-slate-900 transition-colors">
                        {seller?.translations?.name ?? seller?.name}
                      </span>
                    </div>
                  );
                })}

                {sellers?.length < totalSeller && (
                  <button
                    type="button"
                    className="text-xs font-semibold text-[#0BADFB] hover:underline pt-1 block cursor-pointer"
                    onClick={loadMoreSellers}
                  >
                    {t("showMore") || "+ View More"}
                  </button>
                )}
              </div>
            </CollapsibleContent>
          </Collapsible>

          {/* Price Range Filter */}
          <Collapsible
            open={activeKey.includes("4")}
            className="w-full"
            onOpenChange={() => handleActiveKey("4")}
          >
            <CollapsibleTrigger className="w-full px-4 py-3.5 flex justify-between items-center hover:bg-slate-50/80 transition-colors group cursor-pointer">
              <span className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                {t("priceRange") || "Price Range"}
              </span>
              <span
                className={`text-slate-400 group-hover:text-slate-600 transition-transform duration-200 ${activeKey.includes("4") ? "rotate-0" : "-rotate-90"
                  }`}
              >
                <FaChevronDown size={11} />
              </span>
            </CollapsibleTrigger>
            <CollapsibleContent className="px-4 pb-4">
              <div className="flex flex-col gap-3.5">
                <PriceSlider
                  minPrice={minPrice}
                  maxPrice={maxPrice}
                  setValues={setValues}
                  setTempMaxPrice={setTempMaxPrice}
                  setTempMinPrice={setTempMinPrice}
                  values={values}
                />
                <div className="flex justify-between items-center text-xs font-semibold text-slate-700 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                  <span>
                    {setting?.currency}
                    {minPrice}
                  </span>
                  <span className="text-slate-400 font-normal">to</span>
                  <span>
                    {setting?.currency}
                    {maxPrice}
                  </span>
                </div>
                <button
                  type="button"
                  className="w-full py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] text-white font-bold text-xs shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all cursor-pointer"
                  onClick={() => {
                    setOffset(0);
                    setShowFilter(false);
                    setProductResult([]);
                    dispatch(
                      setFilterMinMaxPrice({
                        data: {
                          min_price: tempMinPrice,
                          max_price: tempMaxPrice,
                        },
                      }),
                    );
                  }}
                >
                  {t("apply") || "Apply Price"}
                </button>
              </div>
            </CollapsibleContent>
          </Collapsible>
        </div>
      )}
    </>
  );
};

export default Filter;
