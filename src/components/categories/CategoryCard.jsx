import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";

const CategoryCard = ({ category }) => {
  return (
    <div className="group flex flex-col items-center cursor-pointer w-full text-center">
      {/* CHANDAMAMA Official White Card Box */}
      <div className="w-full aspect-[4/3] sm:aspect-square rounded-2xl bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 hover:border-[#0BADFB] p-4 sm:p-6 flex items-center justify-center transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-md relative overflow-hidden">
        <div className="w-full h-full relative flex items-center justify-center">
          <ImageWithPlaceholder
            src={category.image_url}
            width={300}
            height={300}
            alt={category?.translations?.name ?? category?.name ?? "Category"}
            className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      </div>
      {/* Category Name Underneath Card in Bold Uppercase */}
      <h3 className="text-xs sm:text-sm font-extrabold text-slate-900 dark:text-white group-hover:text-[#0BADFB] transition-colors mt-3 uppercase tracking-wider line-clamp-1 w-full text-center">
        {category?.translations?.name ?? category?.name}
      </h3>
    </div>
  );
};

export default CategoryCard;
