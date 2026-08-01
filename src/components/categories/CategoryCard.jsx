import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";

const CategoryCard = ({ category, imageSize, padding }) => {
  return (
    <div className="flex flex-col category-card border border-transparent hover:textPrimaryColor hover:cardBorder rounded-xl categoryCardBackground cursor-pointer " style={{ padding }}>
      <div className="gap-3 flex flex-col items-center">
        <div
          className="relative"
          style={{
            width: imageSize,
            height: imageSize,
          }}
        >
          <ImageWithPlaceholder
            src={category.image_url}
            width={300}
            height={300}
            alt="Category Image"
            className="rounded-full w-full h-full object-cover p-2"
          />
        </div>
        <div className="font-semibold h-[42px] leading-5 mt-2 text-center w-full line-clamp-2">
          {category?.translations?.name ?? category?.name}
        </div>
      </div>
    </div>
  );
};

export default CategoryCard;
