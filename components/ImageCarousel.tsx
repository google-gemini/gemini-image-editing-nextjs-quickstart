"use client";

import { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay } from "swiper/modules";
import Image from "next/image";
import type { Swiper as SwiperType } from "swiper";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";

const exampleImages = [
  {
    src: "/carousel-images/example-1.png",
    alt: "Pool example 1",
  },
  {
    src: "/carousel-images/example-2.png", 
    alt: "Pool example 2",
  },
];

export function ImageCarousel() {
  const [mounted, setMounted] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative w-full flex items-center justify-center">
        <div className="w-full aspect-[353/202] lg:max-w-[400px] lg:aspect-[400/322] bg-gradient-to-br from-blue-100 to-green-100 rounded-[4px] border-[12px] border-white shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)]" />
      </div>
    );
  }

  return (
    <div className="relative w-full flex items-center justify-center">
      <div className="w-full aspect-[353/202] lg:max-w-[400px] lg:aspect-[400/322]">
        <Swiper
          modules={[Autoplay]}
          spaceBetween={0}
          slidesPerView={1}
          autoplay={{
            delay: 3000,
            disableOnInteraction: false,
            pauseOnMouseEnter: true,
          }}
          loop={true}
          onSlideChange={(swiper) => {
            setActiveIndex(swiper.realIndex);
          }}
          className="w-full h-full rounded-[4px] border-[12px] border-white shadow-[0px_4px_40px_0px_rgba(0,0,0,0.12)] overflow-hidden"
        >
        {exampleImages.map((image, index) => (
          <SwiperSlide key={index}>
            <div className="relative w-full h-full">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover"
                sizes="(max-width: 640px) 100vw, 50vw"
                priority={index === 0}
              />
            </div>
          </SwiperSlide>
        ))}
        </Swiper>
      </div>
      
      {/* 自定义步骤指示器 */}
      <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 z-10">
        <div className="flex items-center gap-2">
          {exampleImages.map((_, index) => (
            <div
              key={index}
              className={`h-1 rounded-lg transition-all duration-200 ${
                index === activeIndex ? "w-10" : "w-3"
              } ${
                index === activeIndex 
                  ? "bg-text-1-80" 
                  : "bg-text-1-35"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
