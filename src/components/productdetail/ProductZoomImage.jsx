import React, { useEffect, useState } from "react";
import ReactImageMagnify from "react-image-magnify";
import { useSelector } from "react-redux";
import { Card, CardContent } from "../ui/card";

const ProductZoomImage = ({ image }) => {
  const setting = useSelector((state) => state.Setting);
  const imageSrc = image || setting?.setting?.web_settings?.placeholder_image;

  const placeholder = setting?.setting?.web_settings?.placeholder_image;

  const [imgSrc, setImgSrc] = useState(image || placeholder);

  useEffect(() => {
    setImgSrc(image || placeholder);
  }, [image, placeholder]);

  return (
    <Card className="border-0 shadow-none h-full w-full">
      <CardContent className="p-0 h-full w-full">
        <div className="flex justify-center items-center h-full">
          <div className="w-full  h-full custom-img-wrapper">
            <ReactImageMagnify
              {...{
                smallImage: {
                  alt: "Product Image",
                  isFluidWidth: true,
                  src: imgSrc,
                  onError: () => {
                    setImgSrc(placeholder);
                  },
                },
                largeImage: {
                  src: imgSrc,
                  width: 900,
                  height: 1200,
                },
                imageClassName: "my-custom-image-class",
                enlargedImageContainerDimensions: {
                  width: "220%",
                  height: "150%",
                },
                enlargedImageContainerStyle: {
                  zIndex: 1000,
                  overflow: "hidden",
                  backgroundColor: "#fff",
                  border: "none",
                  borderRadius: "12px",
                },
                enlargedImagePosition: "beside",
                lensStyle: {
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                },
                hintTextMouse: "Hover to zoom",
              }}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductZoomImage;
