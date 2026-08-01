// HomePageSlider.jsx

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedRouter } from "@/utils/localizedNav";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";

import { setFilterCategory } from "@/redux/slices/productFilterSlice";

const HomePageSlider = ({ slider }) => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const language = useSelector((state) => state.Language.selectedLanguage);

  const slides = slider?.sliders || [];
  const slideCount = slides.length;

  const autoplayPlugin = Autoplay({
    delay: 2000,
    stopOnInteraction: false,
    stopOnMouseEnter: true,
  });

  const [emblaRef, emblaApi] = useEmblaCarousel(
    {
      loop: slideCount > 1,
      align: "center",
      containScroll: "trimSnaps",
      direction: language?.type === "RTL" ? "rtl" : "ltr",
    },
    [autoplayPlugin],
  );

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState([]);

  const scrollTo = useCallback(
    (index) => emblaApi && emblaApi.scrollTo(index),
    [emblaApi],
  );

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    setScrollSnaps(emblaApi.scrollSnapList());
    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const handleSliderClick = (slide) => {
    if (slide?.type === "slider_url") {
      window.open(slide?.slider_url, "_blank");
    } else if (slide?.type === "product") {
      router.push(`/product/${slide.type_slug}`);
    } else if (slide?.type === "category") {
      if (slide?.category_data?.has_child === true) {
        router.push(`/categories/${slide?.type_slug}`);
      } else {
        dispatch(setFilterCategory({ data: slide?.type_id.toString() }));
        router.push(`/products`);
      }
    }
  };

  if (slideCount === 0) {
    return null;
  }

  return (
    <div className="w-full mx-auto backgroundColor relative">
      <div className="overflow-hidden" ref={emblaRef} key={language?.type}>
        <div className="flex">
          {slides.map((slide, index) => (
            <div
              className={`relative flex-shrink-0 min-w-0 basis-full ${
                slideCount > 1 ? "md:basis-2/3" : ""
              }`}
              key={index}
            >
              <div
                className="flex flex-col items-center text-center rounded-xl p-2 md:p-4"
                onClick={() => handleSliderClick(slide)}
              >
                <Image
                  src={slide.image_url}
                  alt="Fruit Basket"
                  priority={index === 0}
                  fetchpriority={index === 0 ? "high" : "auto"}
                  className="swiper-image w-full max-h-[900px] h-[200px] sm:h-[250px] md:h-[380px] lg:h-[570px] 2xl:h-[700px] "
                  width={1200}
                  height={650}
                  sizes="
                    (max-width: 640px) 304px,
                    (max-width: 768px) 480px,
                    (max-width: 1024px) 600px,
                    (max-width: 1536px) 900px,
                    1200px
                  "
                  onClick={() => handleSliderClick(slide)}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div
        className="absolute bottom-[45px] left-1/2 -translate-x-1/2 
             md:flex items-center justify-center gap-2 
             md:px-[6px] md:py-1 lg:px-[10px] lg:py-2 bg-white rounded-[4px] 
             w-fit mx-auto z-10 hidden"
      >
        {scrollSnaps.map((_, index) => (
          <button
            key={index}
            onClick={() => scrollTo(index)}
            className={`h-3 rounded-full transition-all duration-300 
        ${
          index === selectedIndex
            ? "bg-[var(--primary-color)] w-[22px]"
            : "bg-gray-400 w-3"
        }`}
            aria-label={`Go to slide ${index + 1}`}
          />
        ))}
      </div>
    </div>
  );
};

export default HomePageSlider;
