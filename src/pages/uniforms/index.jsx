import React from "react";
import MetaData from "@/components/metadata-component/MetaData";
import UniformsComingSoonPage from "@/components/pagecomponents/UniformsComingSoonPage";

const UniformsPage = () => {
  return (
    <>
      <MetaData
        pageName="/uniforms"
        title="School Uniforms - Coming Soon | Chandamama"
        description="Explore the upcoming School Uniforms & Schoolwear collection on Chandamama. High quality blazers, shirts, skirts, and trousers launching soon!"
      />
      <UniformsComingSoonPage />
    </>
  );
};

export default UniformsPage;
