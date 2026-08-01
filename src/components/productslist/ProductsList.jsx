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
    filter?.category_id === "NaN" || filter?.category_id === "all categories"
      ? null
      : filter?.category_id;

  const finalCategoryIds = resolvedCategory;

  const fetchProducts = async ({ pageParam = 0 }) => {
    const filterParams = {
      min_price: filter.price_filter?.min_price,
      max_price: filter.price_filter?.max_price,
      ...(finalCategoryIds && {
        category_ids: finalCategoryIds,
      }),
      brand_ids: filter?.brand_ids.toString(),
      sort: filter?.sort_filter,
      search: debouncedSearch,
      limit: total_products_per_page,
      sizes: filter?.search_sizes
        ?.filter((obj) => obj.checked)
        .map((obj) => obj["size"])
        .join(","),
      offset: pageParam,
      unit_ids: filter?.search_sizes
        ?.filter((obj) => obj.checked)
        .map((obj) => obj["unit_id"])
        .join(","),
      seller_id: filter?.seller_id,
      country_id: filter?.country_id,
      section_id: filter?.section_id,
    };

    return await api.getProductByFilter({
      latitude: city.city.latitude,
      longitude: city.city.longitude,
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
      "products",
      { ...filter, search: debouncedSearch },
      city?.city?.latitude,
      city?.city?.longitude,
      language?.id,
      resolvedCategory,
    ],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, allPages) => {
      if (!lastPage.data || lastPage.data.length < total_products_per_page) {
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
    queryKey: ["subCategories", listing_source, category_slug,language?.id,resolvedCategory],
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
    }
  }, [router.isReady, router.query]);

  
  return (
    <section>
      <div>
        <div>
          <BreadCrumb />
        </div>
        <div className="container px-2">
          <div className="md:hidden sticky pt-0.5 top-0 z-30 bodyBackgroundColor">
            <div
              className="w-full cardBorder flex p-3 mt-3.5 rounded-sm gap-2 items-center text-xl font-bold hover:cursor-pointer"
              onClick={() => setShowFilter(true)}
            >
              <IoFilter />
              {t("filter")}
            </div>
          </div>
          <div className="mb-5  md:my-8 grid grid-cols-12 gap-6">
            <div className=" col-span-3 rounded-sm hidden md:block ">
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
                hideCategory={listing_source === "category"}
                disableFilter={listing_source === "category"}
              />
            </div>
            <div className="col-span-12 md:col-span-9">
              <div
                className={`${listing_source === "category" ? "mb-0" : "mb-6"} pt-5 md:py-0 sticky top-[56px] bodyBackgroundColor z-20 md:static `}
              >
                {loading ? (
                  <CardSkeleton height={70} />
                ) : (
                  <div
                    className={` flex justify-between flex-col md:flex-row  md:items-center p-4 cardBorder rounded-md gap-1 md:gap-0  headerBackgroundColor  `}
                  >
                    <p className="text-dm font-normal order-2 md:order-1">
                      {totalProducts} {t("products_found")}
                    </p>
                    <div className="flex justify-between gap-3 order-1 md:order-2 ">
                      <div className="flex  gap-2 items-center">
                        <p className="text-sm text-nowrap font-normal">
                          {t("sortBy")}
                        </p>
                        <Select
                          onValueChange={sortProduct}
                          value={filter?.sort_filter}
                        >
                          <SelectTrigger className="w-[120px] md:w-[150px] lg:w-[200px] h-full buttonBackground border-none">
                            <SelectValue placeholder={t("default")} />
                          </SelectTrigger>
                          <SelectContent className="w-[120px] md:w-[150px] lg:w-[200px] h-full z-30  hidden md:block lg:block">
                            <SelectItem value="default">
                              {t("default")}
                            </SelectItem>
                            <SelectItem value="new">
                              {t("newest_first")}
                            </SelectItem>
                            <SelectItem value="old">
                              {t("oldest_first")}
                            </SelectItem>
                            <SelectItem value="high">
                              {t("high_to_low")}
                            </SelectItem>
                            <SelectItem value="low">
                              {t("low_to_high")}
                            </SelectItem>
                            <SelectItem value="discount">
                              {t("discount_high_to_low")}
                            </SelectItem>
                            <SelectItem value="popular">
                              {t("popularity")}
                            </SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex  gap-4 items-center">
                        <span
                          className={`${filter?.grid_view
                            ? "primaryBackColor rounded-md text-white p-1.5"
                            : ""
                            } hover:cursor-pointer`}
                        >
                          <BsFillGrid3X3GapFill
                            size={23}
                            onClick={handleGridViewChange}
                          />
                        </span>
                        <span
                          className={`${!filter?.grid_view
                            ? "primaryBackColor rounded-md text-white  p-1.5"
                            : ""
                            } hover:cursor-pointer`}
                        >
                          <FaThList size={23} onClick={handleListViewChange} />
                        </span>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {listing_source === "category" && <CategoryFlowBreadcrumb />}
              <div className="flex flex-col gap-6">
                {listing_source === "category" && (
                  <SubCategorySwiper
                    title={currentCategoryName}
                    subCategories={subCategories}
                    isLoading={isSubCatLoading}
                    languageCode={selectedLanguage?.code} 
                    rtl={selectedLanguage?.type === "RTL"}
                    onCategoryClick={handleCategoryClick}
                  />
                )}

                <div className="grid grid-cols-12 gap-2 h-full">
                  {loading ? (
                    placeholderItems.map((index) => {
                      return filter?.grid_view ? (
                        <div
                          className="col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3"
                          key={index}
                        >
                          <CardSkeleton height={300} />
                        </div>
                      ) : (
                        <div className="col-span-12">
                          <CardSkeleton height={200} />
                        </div>
                      );
                    })
                  ) : productResult?.length <= 0 ? (
                    <div className="flex flex-col justify-center items-center col-span-12">
                      <div className="h-3/4 w-3/4">
                        <Image
                          src={NoOrderSvg}
                          alt="Product not found"
                          width={320}
                          height={320}
                          className="h-full w-full"
                        />
                      </div>
                      <h2 className="font-bold text-2xl">
                        {t("no_products_found")}
                      </h2>
                    </div>
                  ) : (
                    productResult?.map((product) => {
                      return filter?.grid_view ? (
                        <div
                          className=" col-span-6 md:col-span-6 lg:col-span-4 xl:col-span-3 "
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

                  {isLoadMoreLoading ? (
                    placeholderItems.map((index) => {
                      return filter?.grid_view ? (
                        <div
                          className="col-span-6 sm:col-span-6 md:col-span-4 lg:col-span-3"
                          key={index}
                        >
                          <CardSkeleton height={300} />
                        </div>
                      ) : (
                        <div className="col-span-12">
                          <CardSkeleton height={200} />
                        </div>
                      );
                    })
                  ) : (
                    <></>
                  )}
                  <div className="col-span-12 mt-6 w-full flex justify-center mx-auto">
                    {totalProducts > productResult?.length ? (
                      <button
                        className="bg-[#29363f] rounded-md text-white text-base font-medium gap-1 p-1.5 px-3"
                        onClick={handleFetchMore}
                      >
                        {t("load_more")}
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          </div>
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
    </section>
  );
};

export default Products;
