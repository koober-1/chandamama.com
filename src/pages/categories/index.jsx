import React from "react";
import dynamic from "next/dynamic";
import MetaData from "@/components/metadata-component/MetaData";

const CategoriesPages = dynamic(
  () => import("@/components/pagecomponents/CategoriesPages"),
  { ssr: false }
);

const CategoriesIndex = () => {
  return (
    <div>
      <MetaData
        pageName="/categories/all"
        title="All Categories | Chandamama"
        description="Browse all categories on Chandamama"
      />
      <CategoriesPages />
    </div>
  );
};

export default CategoriesIndex;
