import React, { useEffect, useState, useMemo } from "react";
import BreadCrumb from "../breadcrumb/BreadCrumb";
import * as api from "@/api/apiRoutes";
import { useQuery } from "@tanstack/react-query";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { useDispatch, useSelector } from "react-redux";
import {
  setFilterCategory,
  setSelectedCategories,
  setListingSource,
  setCategorySlug,
  setCategoryBreadcrumb,
} from "@/redux/slices/productFilterSlice";
import CardSkeleton from "../skeleton/CardSkeleton";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { t } from "@/utils/translation";
import { Search } from "lucide-react";

// Helper to recursively collect all categories & sub-categories flat
const extractAllCategories = (categoriesList) => {
  const result = [];
  const visited = new Set();

  const traverse = (cat) => {
    if (!cat || !cat.id || visited.has(cat.id)) return;
    visited.add(cat.id);

    const children =
      cat.cat_active_childs ||
      cat.all_active_childs ||
      cat.all_childs ||
      cat.children ||
      cat.childs ||
      cat.sub_categories ||
      [];

    const name = cat.translations?.name || cat.name || "Category";

    result.push({
      ...cat,
      name,
    });

    if (Array.isArray(children) && children.length > 0) {
      children.forEach((child) => traverse(child));
    }
  };

  if (Array.isArray(categoriesList)) {
    categoriesList.forEach((cat) => traverse(cat));
  }

  return result;
};

const Category = () => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const { slug } = router.query;
  const language = useSelector((state) => state.Language.selectedLanguage);

  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const itemsPerPage = 24;

  const slug_id = slug === "all" ? "" : slug;

  // Fetch full category hierarchy
  const { data: categoriesResponse, isLoading } = useQuery({
    queryKey: ["allCategoriesFull", slug_id, language?.id],
    queryFn: async () => {
      const res = await api.getCategories({
        slug: slug_id,
      });
      return res;
    },
    staleTime: 1000 * 60 * 5,
  });

  const rawCategories = categoriesResponse?.data || [];

  // Extract all categories & sub-categories cleanly
  const allExtractedCategories = useMemo(() => {
    return extractAllCategories(rawCategories);
  }, [rawCategories]);

  // Filter categories by search
  const filteredCategories = useMemo(() => {
    if (!searchQuery.trim()) return allExtractedCategories;
    const q = searchQuery.toLowerCase();
    return allExtractedCategories.filter((cat) =>
      cat.name.toLowerCase().includes(q)
    );
  }, [allExtractedCategories, searchQuery]);

  // Reset page when search changes
  useEffect(() => {
    setPage(1);
  }, [searchQuery]);

  const categoryBreadcrumb = useSelector(
    (state) => state.ProductFilter.categoryBreadcrumb
  );

  const handleCategoryClick = (category) => {
    const exists = categoryBreadcrumb.find((c) => c.id === category.id);
    const newBreadcrumb = exists
      ? categoryBreadcrumb
      : [
          ...categoryBreadcrumb,
          {
            id: category.id,
            name: category.name || category.translations?.name,
            slug: category.slug,
          },
        ];

    dispatch(setListingSource({ data: "category" }));
    dispatch(setFilterCategory({ data: category.id }));
    dispatch(setCategorySlug({ data: category.slug }));
    dispatch(setCategoryBreadcrumb({ data: newBreadcrumb }));
    dispatch(setSelectedCategories({ data: category.id }));

    router.push({
      pathname: "/products",
      query: {
        category: category.slug || category.id,
        category_id: category.id,
        source: "category",
        lang: language?.code,
      },
    });
  };

  useEffect(() => {
    dispatch(setCategoryBreadcrumb({ data: [] }));
  }, [dispatch]);

  // Pagination
  const totalPages = Math.ceil(filteredCategories.length / itemsPerPage);
  const paginatedCategories = useMemo(() => {
    const start = (page - 1) * itemsPerPage;
    return filteredCategories.slice(start, start + itemsPerPage);
  }, [filteredCategories, page]);

  const title = categoryBreadcrumb?.find((c) => c.slug === slug)?.name;

  return (
    <section className="bg-slate-50/40 dark:bg-slate-900 min-h-screen pb-16 transition-colors duration-200">
      <BreadCrumb title={title} />

      <div className="container mx-auto px-4 md:px-8 py-8 md:py-10">
        {/* Page Header Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 border-b-2 border-[#0BADFB]/30 pb-4">
          <div className="flex flex-wrap items-baseline gap-3">
            <span className="inline-block bg-[#FDD811] text-slate-900 font-extrabold text-xs sm:text-sm uppercase tracking-widest px-5 py-2 rounded-t-xl shadow-xs">
              {slug_id ? t("sub_categories") || "CATEGORIES" : t("all_categories") || "ALL CATEGORIES"}
            </span>
            <span className="text-slate-500 text-xs sm:text-sm font-medium">
              {filteredCategories.length > 0
                ? `${filteredCategories.length} categories available`
                : "Browse our categories"}
            </span>
          </div>

          {/* Clean Search Input */}
          <div className="relative min-w-[240px] sm:min-w-[300px]">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search category..."
              className="w-full pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-xs sm:text-sm font-medium focus:outline-none focus:border-[#0BADFB] shadow-2xs"
            />
          </div>
        </div>

        {/* Category Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {isLoading
            ? Array.from({ length: 12 }).map((_, index) => (
                <div key={index} className="flex flex-col items-center">
                  <CardSkeleton height={160} />
                </div>
              ))
            : paginatedCategories.map((category) => {
                const catName = category.name || category.translations?.name || "Category";
                const catImg =
                  category.image_url ||
                  category.image ||
                  category.translations?.image_url ||
                  category.translations?.image;

                return (
                  <div
                    key={category.id}
                    className="group flex flex-col items-center cursor-pointer w-full text-center"
                    onClick={() => handleCategoryClick(category)}
                  >
                    <div className="w-full aspect-square rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 hover:border-[#0BADFB] p-4 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1.5 group-hover:shadow-lg group-hover:shadow-[#0BADFB]/10 relative overflow-hidden">
                      {/* Hover primary blue glow background */}
                      <div className="absolute inset-0 bg-gradient-to-br from-[#0BADFB]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />
                      <div className="w-full h-full relative flex items-center justify-center z-10">
                        <ImageWithPlaceholder
                          src={catImg}
                          width={220}
                          height={220}
                          alt={catName}
                          className="w-full h-full object-contain group-hover:scale-108 transition-transform duration-300"
                        />
                      </div>
                    </div>

                    {/* Category Name */}
                    <h3 className="text-xs sm:text-sm font-extrabold text-slate-800 dark:text-white group-hover:text-[#0BADFB] transition-colors mt-3 uppercase tracking-wide line-clamp-2 w-full text-center leading-snug px-1">
                      {catName}
                    </h3>
                  </div>
                );
              })}
        </div>

        {/* Empty state */}
        {!isLoading && filteredCategories.length === 0 && (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700">
            <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">
              {t("no_categories_found") || "No categories found."}
            </p>
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex justify-center my-10 gap-2 flex-wrap items-center">
            <button
              type="button"
              onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
              disabled={page === 1}
              className={`px-5 py-2 rounded-full border text-xs font-bold transition-all ${
                page === 1
                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "border-[#0BADFB]/40 bg-white text-[#0BADFB] hover:bg-[#0BADFB] hover:text-white shadow-2xs cursor-pointer"
              }`}
            >
              ← {t("prev") || "Prev"}
            </button>

            {Array.from({ length: totalPages }).map((_, idx) => {
              const pNum = idx + 1;
              return (
                <button
                  key={pNum}
                  type="button"
                  onClick={() => setPage(pNum)}
                  className={`w-9 h-9 rounded-full border text-xs font-extrabold transition-all cursor-pointer ${
                    page === pNum
                      ? "bg-[#0BADFB] text-white border-[#0BADFB] shadow-sm"
                      : "bg-white text-slate-700 border-slate-200 hover:border-[#0BADFB] hover:text-[#0BADFB]"
                  }`}
                >
                  {pNum}
                </button>
              );
            })}

            <button
              type="button"
              onClick={() => setPage((prev) => (prev < totalPages ? prev + 1 : prev))}
              disabled={page === totalPages}
              className={`px-5 py-2 rounded-full border text-xs font-bold transition-all ${
                page === totalPages
                  ? "border-slate-200 bg-slate-50 text-slate-400 cursor-not-allowed"
                  : "border-[#0BADFB]/40 bg-white text-[#0BADFB] hover:bg-[#0BADFB] hover:text-white shadow-2xs cursor-pointer"
              }`}
            >
              {t("next") || "Next"} →
            </button>
          </div>
        )}
      </div>
    </section>
  );
};

export default Category;
