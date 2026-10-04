"use client";
import React, { useEffect, useState } from "react";
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { t } from "@/utils/translation";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import { useDispatch, useSelector } from "react-redux";
import { useLocalizedRouter } from "@/utils/localizedNav";
import SearchProductCard from "../cards/SearchProductCard";
import { FaSearch } from "react-icons/fa";
import { isRtl } from "@/lib/utils";
import * as api from "@/api/apiRoutes";

const SearchComponent = ({
  handleSearchCategory,
  handleSearch,
  isSuggLoading,
}) => {
  const rtl = isRtl();
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const [categories, setCategories] = useState([]);
  const [showCategories, setShowCategories] = useState(false);
  const [isCategoryLoading, setIsCategoryLoading] = useState(false);
  const filter = useSelector((state) => state.ProductFilter);

  useEffect(() => {
    if(showCategories){
      fetchCategories();
    }
    setShowCategories(false);
  }, [showCategories]);

  const fetchCategories = async () => {
    try {
      setIsCategoryLoading(true);
      const categories = await api.getCategories();
      setCategories(categories.data);
    } catch (error) {
      console.log("erorr", error);
    } finally {
      setIsCategoryLoading(false);
    }
  };

  const handleSearchItemClick = async () => {
    dispatch(setFilterCategory({ data: filter?.searchedCategory }));
    router.push("/products");
  };

  return (
    <>
      <div
        className="flex w-full flex-col p-2 md:p-0 items-center md:flex-row rounded-2xl md:rounded-full border border-slate-200/90 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm hover:border-[#0BADFB]/50 focus-within:border-[#0BADFB] focus-within:ring-2 focus-within:ring-[#0BADFB]/15 transition-all duration-200"
        onClick={() => setShowCategories(true)}
      >
        <Select
          dir={rtl ? "rtl" : "ltr"}
          value={filter?.searchedCategory}
          onValueChange={(value) => handleSearchCategory(value)}
        >
          <SelectTrigger
            className="w-full md:w-[140px] md:min-w-[140px] h-10 border-0 bg-transparent text-slate-700 dark:text-slate-200 font-medium text-xs md:border-r md:border-slate-200/80 dark:md:border-slate-700 rounded-none focus:ring-0 px-3 cursor-pointer"
          >
            <SelectValue placeholder={t("all_categories")} />
          </SelectTrigger>
          
          <SelectContent className="w-full z-50 md:w-[180px] rounded-xl shadow-dropdown border border-slate-100 dark:border-slate-700 bg-white dark:bg-slate-800">
            <SelectItem value="all categories">
              {t("all_categories")}
            </SelectItem>
            {isCategoryLoading ? (
                <div className="p-2 w-full">
                  <Skeleton height={25} count={5} className="mb-2" />
                </div>
              ) : (
                categories?.map((category) => (
                  <SelectItem key={category?.id} value={`${category?.id}`}>
                    {category?.translations?.name}
                  </SelectItem>
                ))
              )}
          </SelectContent>
        </Select>
        <div className="w-full flex flex-col flex-grow md:relative md:flex-row md:items-center">
          <input
            type="text"
            placeholder={t("iAmLookingFor")}
            className="w-full flex-grow px-4 py-2 text-sm text-slate-800 dark:text-slate-100 placeholder:text-slate-400 bg-transparent focus:outline-none order-1"
            value={filter?.search ? filter?.search : ""}
            onChange={(e) => handleSearch(e)}
          />
          <button
            className="justify-center gap-1.5 px-4 py-2 md:px-5 md:py-2 flex items-center rounded-xl md:rounded-full font-bold text-xs uppercase tracking-wider bg-[#0BADFB] hover:bg-[#0298e0] text-white shadow-xs transition-all duration-200 order-2 my-1 md:my-0 md:mr-1.5 cursor-pointer"
            onClick={() => {
              handleSearchItemClick();
            }}
          >
            <FaSearch size={12} />
            <span className="hidden md:inline">{t("search")}</span>
          </button>
          {router?.pathname !== "/products" && filter?.search ? (
            <div
              className="w-full mt-2 flex flex-col bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 shadow-dropdown overflow-hidden gap-1 order-2 md:order-2 md:absolute md:z-50 md:top-12 md:left-0 max-h-[380px] overflow-y-auto"
            >
              {filter?.search_product?.map((product, idx) => (
                <SearchProductCard key={idx} product={product} />
              ))}
              {!isSuggLoading && filter?.search_product?.length === 0 && (
                  <div className="p-4 text-sm font-medium text-slate-500 text-center">
                    {t("no_product_found")}
                  </div>
              )}
            </div>
          ) : null}
        </div>
      </div>
    </>
  );
};

export default SearchComponent;
