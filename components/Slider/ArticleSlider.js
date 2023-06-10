import React from "react";
import Image from "next/image";

import { ChevronLeftIcon, ChevronRightIcon } from "@heroicons/react/24/outline";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Navigation } from "swiper";

import { useArticle } from "../../hooks/useArticle";
import { shimmerBlurDataURL } from "../../lib/shimmerblurdata";

import SkeletonArticleSlider from "./SkeletonArticleSlider";

import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const ArticleSlider = () => {
  const {
    isError: isArticleError,
    data: articleData,
    isLoading: isArticleLoading,
    error,
  } = useArticle();

  if (isArticleError) {
    return (
      <h1 className="text-center">Error Loading Article {error.message}</h1>
    );
  }

  return (
    <div className="px-6">
      {isArticleLoading ? (
        <SkeletonArticleSlider />
      ) : (
        <Swiper
          className="max-h-[400px]"
          slidesPerView="auto"
          spaceBetween={20}
          loop={true}
          autoplay={{
            delay: 5000,
          }}
          pagination={{
            clickable: true,
            el: ".custom-bullet",
            type: "custom",
            renderCustom: (_, current, total) => {
              var text =
                '<div style="display: flex; gap: 1rem; justify-content: center; align-items: center;">';
              for (let i = 1; i <= total; i++) {
                if (current == i) {
                  text += `<div style="width: 36px; height: 6px; border-radius: 1rem; background-color: #60A5FA;" ></div>`;
                } else {
                  text += `<div style="width: 36px; height: 6px; border-radius: 1rem; background-color: #D1D5DB;" ></div>`;
                }
              }
              text += "</div>";
              return text;
            },
          }}
          navigation={{
            prevEl: ".home-prev",
            nextEl: ".home-next",
          }}
          modules={[Pagination, Navigation]}
          updateOnWindowResize
        >
          {articleData?.map((data, index) => (
            <div key={index}>
              <SwiperSlide>
                <div className="mx-auto flex flex-col max-w-4xl items-center justify-center rounded-lg">
                  <div className="rounded-lg bg-white w-full">
                    <div className="flex flex-col items-center justify-center">
                      <div className="relative min-w-full h-[300px]">
                        <a href={data.url} target="_blank" rel="noopener">
                          <Image
                            className="cursor-pointer rounded-xl"
                            src={data.image}
                            alt="Article Banner"
                            sizes="100vw"
                            fill
                            placeholder="blur"
                            blurDataURL={shimmerBlurDataURL}
                            style={{
                              objectFit: "cover",
                            }}
                            priority={true}
                          />
                        </a>
                        <div>
                          <h1 className="text-white absolute bottom-10 text-lg md:text-2xl font-medium ml-4">
                            {data.title}
                          </h1>
                        </div>
                        <div className="absolute top-0 bottom-0 left-3 my-auto h-fit w-fit">
                          <div className="home-prev w-fit rounded-full bg-white p-1 text-center">
                            <ChevronLeftIcon className="h-6 w-6 cursor-pointer text-black" />
                          </div>
                        </div>

                        <div className="absolute top-0 bottom-0 right-3 my-auto h-fit w-fit">
                          <div className="home-next w-fit rounded-full bg-white p-1 text-center">
                            <ChevronRightIcon className="h-6 w-6 cursor-pointer text-black" />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </div>
          ))}
          <div className="custom-bullet mt-10 h-[20px] min-w-full rounded-lg"></div>
        </Swiper>
      )}
    </div>
  );
};

export default ArticleSlider;
