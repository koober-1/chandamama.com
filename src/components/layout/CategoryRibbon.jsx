import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedRouter } from "@/utils/localizedNav";
import {
  setListingSource,
  setFilterSearch,
  setFilterCategory,
  setCategorySlug,
} from "@/redux/slices/productFilterSlice";
import { useQuery } from "@tanstack/react-query";
import * as api from "@/api/apiRoutes";

const CategoryRibbon = () => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const language = useSelector((state) => state.Language.selectedLanguage);
  const shopCategories = useSelector((state) => state.Shop?.shop?.categories);

  const { data: categoriesData } = useQuery({
    queryKey: ["ribbonCategories", language?.id],
    queryFn: async () => {
      const res = await api.getCategories();
      return res?.data || [];
    },
    staleTime: 1000 * 60 * 10,
  });

  const liveCategories =
    categoriesData && categoriesData.length > 0
      ? categoriesData
      : shopCategories && shopCategories.length > 0
      ? shopCategories
      : [];

  const departmentSegments = [
    { label: "TOYS & GAMES", search: "toys" },
    { label: "SPORTS & FITNESS", search: "sports" },
    { label: "HOME & KITCHEN", search: "kitchen" },
    { label: "BABY & KIDS", search: "baby" },
    { label: "HOUSEHOLD", search: "household" },
    { label: "STATIONERY", search: "stationery" },
  ];

  const handleLiveCategoryClick = (cat) => {
    dispatch(setListingSource({ data: "category" }));
    dispatch(setFilterCategory({ data: cat.id }));
    if (cat.slug) {
      dispatch(setCategorySlug({ data: cat.slug }));
    }
    router.push({
      pathname: "/products",
      query: {
        category: cat.slug || cat.id,
        category_id: cat.id,
        source: "category",
        lang: language?.code,
      },
    });
  };

  const handleDepartmentClick = (dept) => {
    dispatch(setListingSource({ data: "search" }));
    dispatch(setFilterSearch({ data: dept.search }));
    router.push({
      pathname: "/products",
      query: { search: dept.search, lang: language?.code },
    });
  };

  return (
    <div className="w-full bg-[#e0f7fe]/70 dark:bg-[#071E36] border-b border-[#0BADFB]/20 dark:border-[#0D3866] py-2 px-3 sm:px-6 transition-colors shadow-xs">
      <div className="container mx-auto flex items-center justify-center flex-wrap gap-2 sm:gap-4 md:gap-6">
        {liveCategories.length > 0
          ? liveCategories.map((cat, index) => {
              const catName = cat.translations?.name || cat.name;
              return (
                <React.Fragment key={cat.id || index}>
                  <button
                    type="button"
                    onClick={() => handleLiveCategoryClick(cat)}
                    className="text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#0BADFB] dark:text-[#7DD3FC] hover:text-[#0298e0] dark:hover:text-white transition-colors duration-200 cursor-pointer py-1 px-2 whitespace-nowrap"
                  >
                    {catName}
                  </button>
                  <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#0BADFB]/40 dark:bg-[#1E4E79]"></span>
                </React.Fragment>
              );
            })
          : departmentSegments.map((segment, index) => (
              <React.Fragment key={segment.label}>
                <button
                  type="button"
                  onClick={() => handleDepartmentClick(segment)}
                  className="text-[11px] sm:text-xs md:text-sm font-extrabold uppercase tracking-wider text-[#0BADFB] dark:text-[#7DD3FC] hover:text-[#0298e0] dark:hover:text-white transition-colors duration-200 cursor-pointer py-1 px-2 whitespace-nowrap"
                >
                  {segment.label}
                </button>
                <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#0BADFB]/40 dark:bg-[#1E4E79]"></span>
              </React.Fragment>
            ))}

        {/* Static UNIFORM Category at the end */}
        <button
          type="button"
          onClick={() =>
            router.push({
              pathname: "/uniforms",
              query: { lang: language?.code },
            })
          }
          className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs md:text-sm font-black uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:text-amber-700 dark:hover:text-amber-300 transition-colors duration-200 cursor-pointer py-1 px-2.5 rounded-full bg-amber-100/70 dark:bg-amber-900/30 border border-amber-300/60 dark:border-amber-700/50 shadow-xs whitespace-nowrap group"
        >
          <span>UNIFORM</span>
          <span className="text-[9px] font-extrabold uppercase px-1.5 py-0.2 rounded-full bg-amber-500 text-white group-hover:scale-105 transition-transform">
            SOON
          </span>
        </button>
      </div>
    </div>
  );
};

export default CategoryRibbon;
