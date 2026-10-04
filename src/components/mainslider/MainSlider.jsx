// HomePageSlider.jsx

import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import { useLocalizedRouter } from "@/utils/localizedNav";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import { IoChevronBackOutline, IoChevronForwardOutline } from "react-icons/io5";

import { setFilterCategory } from "@/redux/slices/productFilterSlice";

const HomePageSlider = ({ slider }) => {
  const dispatch = useDispatch();
  const router = useLocalizedRouter();
  const language = useSelector((state) => state.Language.selectedLanguage);

  const slides = slider?.sliders || [];
  const slideCount = slides.length;

  const autoplayPlugin = Autoplay({
    delay: 3500,
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

  const scrollPrev = useCallback(
    () => emblaApi && emblaApi.scrollPrev(),
    [emblaApi],
  );

  const scrollNext = useCallback(
    () => emblaApi && emblaApi.scrollNext(),
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
    <div className="w-full py-3 md:py-5">
      <div className="container mx-auto px-2 md:px-4 relative group">
        <div className="overflow-hidden rounded-2xl md:rounded-3xl border border-slate-100 shadow-card bg-slate-50" ref={emblaRef} key={language?.type}>
          <div className="flex">
            {slides.map((slide, index) => (
              <div
                className="relative flex-shrink-0 min-w-0 basis-full"
                key={index}
              >
                <div
                  className="relative w-full cursor-pointer overflow-hidden aspect-[16/7] md:aspect-[21/9]"
                  onClick={() => handleSliderClick(slide)}
                >
                  <Image
                    src={slide.image_url}
                    alt={slide?.name || "Promotional Banner"}
                    priority={index === 0}
                    fetchpriority={index === 0 ? "high" : "auto"}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 100vw, 1320px"
                    className="object-cover w-full h-full transition-transform duration-700 ease-out hover:scale-[1.01]"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating Arrows */}
        {slideCount > 1 && (
          <>
            <button
              onClick={scrollPrev}
              type="button"
              aria-label="Previous slide"
              className="absolute left-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white backdrop-blur-md shadow-card border border-slate-100 text-slate-700 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 hover:scale-105 active:scale-95"
            >
              <IoChevronBackOutline size={20} />
            </button>
            <button
              onClick={scrollNext}
              type="button"
              aria-label="Next slide"
              className="absolute right-6 top-1/2 -translate-y-1/2 w-9 h-9 md:w-11 md:h-11 rounded-full bg-white/90 hover:bg-white backdrop-blur-md shadow-card border border-slate-100 text-slate-700 flex items-center justify-center transition-all opacity-0 group-hover:opacity-100 z-10 hover:scale-105 active:scale-95"
            >
              <IoChevronForwardOutline size={20} />
            </button>
          </>
        )}

        {/* Floating Pagination Pill */}
        {slideCount > 1 && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1.5 px-3 py-1.5 bg-white/90 backdrop-blur-md rounded-full shadow-subtle border border-slate-100/80 z-10">
            {scrollSnaps.map((_, index) => (
              <button
                key={index}
                onClick={() => scrollTo(index)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  index === selectedIndex
                    ? "bg-emerald-700 w-6"
                    : "bg-slate-300 w-2 hover:bg-slate-400"
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePageSlider;
