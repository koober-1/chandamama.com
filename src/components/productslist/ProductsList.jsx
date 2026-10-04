import React, { useEffect, useMemo, useState } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import { t } from "@/utils/translation";
import Filter from "../productFilter/ProductFilter";
import * as api from "@/api/apiRoutes";
import { useDispatch, useSelector } from "react-redux";
import SubCategorySwiper from "../categories/SubCategorySwiper";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import { useQuery } from "@tanstack/react-query";

import {
  setListingSource,
  setCategorySlug,
  setCategoryBreadcrumb,
} from "@/redux/slices/productFilterSlice";
import CategoryFlowBreadcrumb from "../categories/CategoryFlowBreadcrumb";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLocalizedRouter } from "@/utils/localizedNav";
import "swiper/css";
import "swiper/css/navigation";
import { BsFillGrid3X3GapFill } from "react-icons/bs";
import { FaThList } from "react-icons/fa";
import ListViewProductCard from "../productcards/ListViewProductCard";
import VerticleProductCard from "../productcards/VerticleProductCard";
import CardSkeleton from "../skeleton/CardSkeleton";
import FilterDrawer from "../productFilter/FilterDrawer";
import { IoFilter } from "react-icons/io5";
import {
  setFilterSort,
  setFilterView,
  clearAllFilter,
} from "@/redux/slices/productFilterSlice";
import NoOrderSvg from "@/assets/not_found_images/No_Orders.svg";
import Image from "next/image";

const findCategoryPath = (categories, targetId) => {
  if (!categories || !Array.isArray(categories)) return null;

  for (const category of categories) {
    if (category.id == targetId) {
      return [category];
    }
    if (category.cat_active_childs && category.cat_active_childs.length > 0) {
      const path = findCategoryPath(category.cat_active_childs, targetId);
      if (path) {
        return [category, ...path];
      }
    }
  }
  return null;
};

const Products = () => {
  const total_products_per_page = 12;
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const city = useSelector((state) => state.City);
  const setting = useSelector((state) => state.Setting?.setting);
  // const [subCategories, setSubCategories] = useState([]);
  // const [isSubCatLoading, setIsSubCatLoading] = useState(false);
  const filter = useSelector((state) => state.ProductFilter);
  const [minPrice, setMinPrice] = useState(null);
  const [maxPrice, setMaxPrice] = useState(null);
  const [values, setValues] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const [debouncedSearch, setDebouncedSearch] = useState(filter?.search);
  const { listing_source, category_slug } = useSelector(
    (state) => state.ProductFilter,
  );

  const effectiveLat =
    city?.city?.latitude || city?.latitude || setting?.default_city?.latitude || 23.242;
  const effectiveLng =
    city?.city?.longitude || city?.longitude || setting?.default_city?.longitude || 69.6669;
  const { selectedLanguage } = useSelector((state) => state.Language);
  const language = useSelector((state) => state.Language.selectedLanguage);
  const categoryBreadcrumb = useSelector(
    (state) => state.ProductFilter.categoryBreadcrumb,
  );

  const currentCategory = categoryBreadcrumb?.[categoryBreadcrumb.length - 1];

  const currentCategoryName = useMemo(() => {
    if (!currentCategory) return "";

    return (
      currentCategory?.translations?.[selectedLanguage?.code]?.name ||
      currentCategory?.translations?.name ||
      currentCategory?.name ||
      ""
    );
  }, [currentCategory, selectedLanguage?.code]);

  const ancestorCategoryIds = (categoryBreadcrumb) => {
    if (!Array.isArray(categoryBreadcrumb) || categoryBreadcrumb.length === 0) {
      return null;
    }
    return categoryBreadcrumb.map((category) => category.id).join(",");
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(filter?.search);
    }, 500);
    return () => clearTimeout(timer);
  }, [filter?.search]);



  useEffect(() => {
    if (!categoryBreadcrumb || categoryBreadcrumb.length === 0) return;
    // const needsTranslation = categoryBreadcrumb.some(cat => !cat.translations);

    refetchBreadcrumbTranslations();
  }, [selectedLanguage, categoryBreadcrumb.length > 0]);

  const refetchBreadcrumbTranslations = async () => {
    const updated = await Promise.all(
      categoryBreadcrumb.map(async (category) => {
        try {
          const res = await api.getCategories({
            slug: category.slug,
            is_own_data: 1,
          });
          const data = res?.data;

          // Find the matched category from the response array to avoid taking the first one if the API returns a list
          const matchedCategory = Array.isArray(data)
            ? data.find((c) => c.slug === category.slug || c.id === category.id)
            : data;

          if (!matchedCategory) return category;

          return {
            ...category,
            name: matchedCategory?.translations?.name || matchedCategory?.name || category.name,
            translations: matchedCategory?.translations || category.translations,
          };
        } catch (error) {
          return category;
        }
      }),
    );

    // Only dispatch if there's an actual change to avoid infinite loops
    const isDifferent = JSON.stringify(updated) !== JSON.stringify(categoryBreadcrumb);
    if (isDifferent) {
      dispatch(setCategoryBreadcrumb({ data: updated }));
    }
  };

  const resolvedCategory =
    !filter?.category_id ||
    filter?.category_id === "NaN" ||
    filter?.category_id === "null" ||
    filter?.category_id === "undefined" ||
    filter?.category_id === "all categories" ||
    filter?.category_id === ""
      ? null
      : filter?.category_id;

  const finalCategoryIds = resolvedCategory;

  const fetchProducts = async ({ pageParam = 0 }) => {
    const filterParams = {
      limit: total_products_per_page,
      offset: pageParam,
    };

    if (filter.price_filter?.min_price) {
      filterParams.min_price = filter.price_filter.min_price;
    }
    if (filter.price_filter?.max_price) {
      filterParams.max_price = filter.price_filter.max_price;
    }

    if (
      finalCategoryIds &&
      finalCategoryIds !== "null" &&
      finalCategoryIds !== "undefined" &&
      finalCategoryIds !== "NaN"
    ) {
      filterParams.category_ids = finalCategoryIds;
    }

    if (filter?.brand_ids && Array.isArray(filter.brand_ids) && filter.brand_ids.length > 0) {
      filterParams.brand_ids = filter.brand_ids.join(",");
    }

    if (filter?.seller_id && String(filter.seller_id).trim() !== "") {
      filterParams.seller_id = filter.seller_id;
    }

    if (filter?.country_id && String(filter.country_id).trim() !== "") {
      filterParams.country_id = filter.country_id;
    }

    if (filter?.section_id) {
      filterParams.section_id = filter.section_id;
    }

    if (filter?.sort_filter && String(filter.sort_filter).trim() !== "") {
      filterParams.sort = filter.sort_filter;
    }

    if (debouncedSearch && String(debouncedSearch).trim() !== "") {
      filterParams.search = String(debouncedSearch).trim();
    }

    const sizes = filter?.search_sizes
      ?.filter((obj) => obj.checked)
      .map((obj) => obj["size"])
      .join(",");
    if (sizes) filterParams.sizes = sizes;

    const unit_ids = filter?.search_sizes
      ?.filter((obj) => obj.checked)
      .map((obj) => obj["unit_id"])
      .join(",");
    if (unit_ids) filterParams.unit_ids = unit_ids;

    return await api.getProductByFilter({
      latitude: effectiveLat,
      longitude: effectiveLng,
      filters: filterParams,
    });
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
  } = useInfiniteQuery({
    queryKey: [
      "productsListKey",
      filter?.category_id || "",
      Array.isArray(filter?.brand_ids) ? filter.brand_ids.join(",") : "",
      filter?.seller_id || "",
      filter?.country_id || "",
      filter?.section_id || "",
      filter?.price_filter?.min_price || "",
      filter?.price_filter?.max_price || "",
      filter?.sort_filter || "",
      debouncedSearch || "",
      effectiveLat,
      effectiveLng,
      language?.id,
      resolvedCategory || "",
    ],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage || !lastPage.data || lastPage.data.length < total_products_per_page) {
        return undefined;
      }
      return allPages.length * total_products_per_page;
    },
    initialPageParam: 0,
  });

  const productResult = data?.pages?.flatMap((page) => page?.data ?? []) ?? [];
  const totalProducts = data?.pages?.[0]?.total || 0;
  const loading = isLoading;
  const isLoadMoreLoading = isFetchingNextPage;

  const setProductResult = () => { };
  const setOffset = () => { };

  useEffect(() => {
    if (data?.pages?.[0]) {
      handlePrices(data.pages[0]);
    }
  }, [data]);

  const handlePrices = async (result) => {
    if (
      filter?.price_filter?.min_price !== undefined &&
      filter?.price_filter?.min_price !== null &&
      filter?.price_filter?.max_price !== null &&
      filter?.price_filter?.max_price !== undefined
    ) {
      setValues([
        parseInt(filter?.price_filter?.min_price),
        parseInt(filter?.price_filter?.max_price),
      ]);
      setMinPrice(parseInt(result?.total_min_price));
      setMaxPrice(parseInt(result?.total_max_price));
    } else {
      setMinPrice(parseInt(result?.total_min_price));
      if (result.total_min_price === result.total_max_price) {
        setMaxPrice(parseInt(result?.total_max_price) + 100);
        setValues([
          parseInt(result?.total_min_price),
          parseInt(result?.total_max_price) + 100,
        ]);
      } else {
        setMaxPrice(parseInt(result?.total_max_price));
        setValues([
          parseInt(result?.total_min_price),
          parseInt(result?.total_max_price),
        ]);
      }
    }
  };

  const handleGridViewChange = () => {
    dispatch(setFilterView({ data: true }));
  };
  const handleListViewChange = () => {
    dispatch(setFilterView({ data: false }));
  };

  const handleFetchMore = async () => {
    fetchNextPage();
  };

  const sortProduct = async (value) => {
    dispatch(setFilterSort({ data: value }));
  };

  const placeholderItems = Array.from({ length: 12 }).map((_, index) => index);

  const {
    data: subCategories = [],
    isLoading: isSubCatLoading,
    error,
  } = useQuery({
    queryKey: ["subCategories", listing_source, category_slug, language?.id, resolvedCategory],
    queryFn: async () => {

      if (listing_source !== "category" || !category_slug) {
        return [];
      }

      const res = await api.getCategories({
        slug: category_slug,
      });

      const currentCategory = res?.data;

      return Array.isArray(currentCategory)
        ? currentCategory
        : (currentCategory?.cat_active_childs ?? []);
    },


    enabled: listing_source === "category" && !!category_slug,


    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 30,


    onError: (err) => {
      console.error("Failed to fetch subcategories", err);
    },
  });

  const handleCategoryClick = (category) => {
    // Avoid duplicate entries in the breadcrumb.
    const exists = categoryBreadcrumb.find((c) => c.id === category.id);

    const newBreadcrumb = exists
      ? categoryBreadcrumb
      : [
        ...categoryBreadcrumb,
        {
          id: category.id,
          name:
            category?.translations?.[selectedLanguage?.code]?.name ||
            category?.translations?.name ||
            category.name,
          slug: category.slug,
          translations: category.translations,
        },
      ];

    // Update Redux state — the product query reacts to this automatically.
    dispatch(setListingSource({ data: "category" }));
    dispatch(setFilterCategory({ data: category.id }));
    dispatch(setCategorySlug({ data: category.slug }));
    dispatch(setCategoryBreadcrumb({ data: newBreadcrumb }));

    // Reflect the new category in the URL so the link is shareable.
    // `shallow: true` keeps Next.js from unmounting / re-mounting the page,
    // and the hydration effect won't re-run because hasHydrated.current is
    // already true for this page load.
    router.push(
      {
        pathname: "/products",
        query: {
          category: category.slug,
          category_id: category.id,
          source: "category",
          lang: language?.code,
        },
      },
      undefined,
      { shallow: true }
    );
  };
  // URL Hydration for shared links
  useEffect(() => {
    if (!router.isReady) return;

    const { category_id, source, category: slug_from_url } = router.query;

    if (source === "category" && category_id) {
      // Only hydrate if we don't have a breadcrumb or the category ID doesn't match
      const currentCatId = categoryBreadcrumb?.[categoryBreadcrumb.length - 1]?.id;

      if (String(currentCatId) !== String(category_id) || categoryBreadcrumb.length === 0) {
        const hydrate = async () => {
          dispatch(setListingSource({ data: "category" }));
          dispatch(setFilterCategory({ data: category_id }));
          dispatch(setCategorySlug({ data: slug_from_url }));

          try {
            const res = await api.getCategories();
            if (res.status === 1) {
              const allCategories = res.data;
              const path = findCategoryPath(allCategories, category_id);
              if (path) {
                const formattedPath = path.map((cat) => ({
                  id: cat.id,
                  name: cat.translations?.name || cat.name,
                  slug: cat.slug,
                  translations: cat.translations,
                }));
                dispatch(setCategoryBreadcrumb({ data: formattedPath }));
              }
            }
          } catch (error) {
            console.error("Error hydrating category from URL:", error);
          }
        };
        hydrate();
      }
    } else if (!category_id && !source && listing_source === "category") {
      dispatch(clearAllFilter());
    }
  }, [router.isReady, router.query, listing_source]);


  return (
    <div className="bg-slate-50/40 min-h-screen">
      <BreadCrumb />
      <div className="container mx-auto px-4 md:px-8 py-6">
        {/* Mobile Filter Button */}
        <div className="md:hidden sticky top-[68px] z-30 mb-4">
          <button
            type="button"
            className="w-full bg-white border border-slate-200 shadow-sm rounded-full py-2.5 px-4 flex items-center justify-center gap-2 text-xs font-semibold text-slate-800 hover:bg-slate-50 transition-colors"
            onClick={() => setShowFilter(true)}
          >
            <IoFilter size={16} className="text-[#0BADFB]" />
            <span>{t("filter") || "Filters & Refine"}</span>
          </button>
        </div>

        <div className="grid grid-cols-12 gap-6 lg:gap-8 items-start">
          {/* Desktop Filter Sidebar */}
          <aside className="col-span-12 md:col-span-4 lg:col-span-3 hidden md:block sticky top-24">
            <Filter
              setProductResult={setProductResult}
              setOffset={setOffset}
              handlePrices={handlePrices}
              minPrice={minPrice}
              maxPrice={maxPrice}
              values={values}
              setValues={setValues}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              hideCategory={false}
              disableFilter={false}
            />
          </aside>

          {/* Main Products Area */}
          <main className="col-span-12 md:col-span-8 lg:col-span-9">
            {/* Top Toolbar */}
            <div className="mb-6">
              {loading ? (
                <CardSkeleton height={60} />
              ) : (
                <div className="bg-white border border-slate-200/80 rounded-2xl p-3 md:p-4 shadow-subtle flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <p className="text-xs font-medium text-slate-500 order-2 sm:order-1">
                    <span className="text-slate-900 font-bold">{totalProducts}</span>{" "}
                    {t("products_found") || "products found"}
                  </p>

                  <div className="flex items-center justify-between sm:justify-end gap-3 order-1 sm:order-2">
                    {/* Sort Dropdown */}
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-slate-500 hidden sm:inline whitespace-nowrap">
                        {t("sortBy") || "Sort by"}:
                      </span>
                      <Select
                        onValueChange={sortProduct}
                        value={filter?.sort_filter}
                      >
                        <SelectTrigger className="w-[130px] md:w-[160px] h-9 text-xs rounded-full border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 px-3 transition-colors shadow-none font-medium text-slate-700">
                          <SelectValue placeholder={t("default") || "Default"} />
                        </SelectTrigger>
                        <SelectContent className="w-[160px] text-xs z-30 rounded-xl shadow-lg border border-slate-100">
                          <SelectItem value="default">
                            {t("default") || "Default"}
                          </SelectItem>
                          <SelectItem value="new">
                            {t("newest_first") || "Newest First"}
                          </SelectItem>
                          <SelectItem value="old">
                            {t("oldest_first") || "Oldest First"}
                          </SelectItem>
                          <SelectItem value="high">
                            {t("high_to_low") || "Price: High to Low"}
                          </SelectItem>
                          <SelectItem value="low">
                            {t("low_to_high") || "Price: Low to High"}
                          </SelectItem>
                          <SelectItem value="discount">
                            {t("discount_high_to_low") || "Discount"}
                          </SelectItem>
                          <SelectItem value="popular">
                            {t("popularity") || "Popularity"}
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    {/* View Switcher Toggle */}
                    <div className="bg-slate-100 p-1 rounded-full flex items-center gap-1">
                      <button
                        type="button"
                        aria-label="Grid view"
                        onClick={handleGridViewChange}
                        className={`p-1.5 rounded-full transition-all cursor-pointer ${filter?.grid_view
                            ? "bg-white text-[#0BADFB] shadow-xs"
                            : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        <BsFillGrid3X3GapFill size={15} />
                      </button>
                      <button
                        type="button"
                        aria-label="List view"
                        onClick={handleListViewChange}
                        className={`p-1.5 rounded-full transition-all cursor-pointer ${!filter?.grid_view
                            ? "bg-white text-[#0BADFB] shadow-xs"
                            : "text-slate-400 hover:text-slate-600"
                          }`}
                      >
                        <FaThList size={15} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Subcategories ribbon if viewing category source */}
            {listing_source === "category" && <CategoryFlowBreadcrumb />}
            {listing_source === "category" && (
              <div className="mb-6">
                <SubCategorySwiper
                  title={currentCategoryName}
                  subCategories={subCategories}
                  isLoading={isSubCatLoading}
                  languageCode={selectedLanguage?.code}
                  rtl={selectedLanguage?.type === "RTL"}
                  onCategoryClick={handleCategoryClick}
                />
              </div>
            )}

            {/* Product Cards Grid */}
            <div className="grid grid-cols-12 gap-3.5 sm:gap-4 md:gap-5">
              {loading ? (
                placeholderItems.map((index) => {
                  return filter?.grid_view ? (
                    <div
                      className="col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
                      key={index}
                    >
                      <CardSkeleton height={320} />
                    </div>
                  ) : (
                    <div className="col-span-12" key={index}>
                      <CardSkeleton height={180} />
                    </div>
                  );
                })
              ) : productResult?.length <= 0 ? (
                <div className="col-span-12 py-16 px-4 bg-white rounded-2xl border border-slate-100 text-center flex flex-col items-center justify-center">
                  <div className="w-48 h-48 relative mb-4">
                    <Image
                      src={NoOrderSvg}
                      alt="No products"
                      fill
                      sizes="192px"
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-1">
                    {t("no_products_found")?.toLowerCase()?.includes("cart") ? "No products found" : (t("no_products_found") || "No products found")}
                  </h3>
                  <p className="text-xs text-slate-500 max-w-sm mb-5">
                    We couldn&apos;t find any products matching your current filters. Try changing or clearing your filter criteria.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      dispatch(clearAllFilter());
                      setOffset(0);
                    }}
                    className="px-6 py-2.5 rounded-full bg-[#0BADFB] hover:bg-[#0298e0] active:scale-[0.99] text-white font-bold text-xs shadow-xs hover:shadow-md hover:shadow-[#0BADFB]/20 transition-all cursor-pointer"
                  >
                    {t("clearAll") || "Clear All Filters"}
                  </button>
                </div>
              ) : (
                productResult?.map((product) => {
                  return filter?.grid_view ? (
                    <div
                      className="col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
                      key={product?.id}
                    >
                      <VerticleProductCard product={product} />
                    </div>
                  ) : (
                    <div className="col-span-12" key={product?.id}>
                      <ListViewProductCard product={product} />
                    </div>
                  );
                })
              )}

              {isLoadMoreLoading && (
                placeholderItems.slice(0, 4).map((index) => {
                  return filter?.grid_view ? (
                    <div
                      className="col-span-6 sm:col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
                      key={`load-more-${index}`}
                    >
                      <CardSkeleton height={320} />
                    </div>
                  ) : (
                    <div className="col-span-12" key={`load-more-${index}`}>
                      <CardSkeleton height={180} />
                    </div>
                  );
                })
              )}

              {/* Load More Button */}
              {totalProducts > productResult?.length && (
                <div className="col-span-12 mt-8 mb-4 flex justify-center">
                  <button
                    type="button"
                    className="px-8 py-3 rounded-full bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold shadow-sm hover:shadow-md transition-all hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2"
                    onClick={handleFetchMore}
                    disabled={isLoadMoreLoading}
                  >
                    <span>{isLoadMoreLoading ? "Loading..." : (t("load_more") || "Load More Products")}</span>
                  </button>
                </div>
              )}
            </div>
          </main>
        </div>
      </div>

      <FilterDrawer
        showFilter={showFilter}
        setShowFilter={setShowFilter}
        setProductResult={setProductResult}
        setOffset={setOffset}
        handlePrices={handlePrices}
        minPrice={minPrice}
        maxPrice={maxPrice}
        values={values}
        setValues={setValues}
        setMaxPrice={setMaxPrice}
        setMinPrice={setMinPrice}
      />
    </div>
  );
};

export default Products;
