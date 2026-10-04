import React from "react";
import ImageWithPlaceholder from "../image-with-placeholder/ImageWithPlaceholder";
import { useLocalizedRouter } from "@/utils/localizedNav";
import { setFilterCategory } from "@/redux/slices/productFilterSlice";
import { useDispatch } from "react-redux";

const HomeOfferSection = ({ offer }) => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();

  const handleOfferClick = () => {
    if (offer?.type == "product") {
      router.push(`/product/${offer?.product?.slug}`);
    } else if (offer?.type == "category") {
      if (offer?.category?.has_child == true) {
        router.push(`/categories/${offer?.type_slug}`);
      } else {
        dispatch(setFilterCategory({ data: offer?.category?.id.toString() }));
        router.push(`/products`);
      }
    } else if (offer?.offer_url) {
      window.open(offer?.offer_url, "_blank");
    }
  };

  return (
    <div className="py-3 md:py-5 px-2 md:px-0 relative group" key={offer?.id}>
      <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-slate-100 shadow-card hover:shadow-card-hover transition-all duration-500 cursor-pointer bg-slate-50">
        <ImageWithPlaceholder
          src={offer?.image_url}
          alt={offer?.name || "Special Offer"}
          width={1304}
          height={255}
          quality={90}
          priority={true}
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 90vw, 1320px"
          className="max-h-[290px] h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.01]"
          handleOnClick={handleOfferClick}
        />
      </div>
    </div>
  );
};

export default HomeOfferSection;
