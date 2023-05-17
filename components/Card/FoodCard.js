import React from "react";
import Image from "next/image";
import Link from "next/link";
import EllipsisText from "react-ellipsis-text/lib/components/EllipsisText";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
  faUser,
  faLocationDot,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

const FoodCard = ({
  images,
  foodName,
  giver,
  pickupAddress,
  takenBeforeDate,
}) => {

  // extract to lib folder
  const unixDateToStringFormat = (unixdate) => {
    const unixDateToLongString = new Date(unixdate * 1000);
    return unixDateToLongString.toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const shimmerBlurDataURL = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" style="margin:auto;background:#f1f2f3;display:block;z-index:1;position:relative" width="300" height="300" preserveAspectRatio="xMidYMid" viewBox="0 0 300 300">
  <g transform="translate(150,150) scale(1,1) translate(-150,-150)"><linearGradient id="ldbk-qs03tb1hqma" x1="-0.1" y1="0" x2="1.1" y2="1">
    <animate attributeName="y2" repeatCount="indefinite" dur="4s" keyTimes="0;0.5;1" values="-1;1;-1" keySplines="0.5 0 0.5 1;0.5 0 0.5 1" calcMode="spline"></animate>
    <stop stop-color="#d4d4d4" offset="0"></stop>
    <stop stop-color="#cacaca" offset="1"></stop>
  </linearGradient>
  <rect x="0" y="0" width="300" height="300" fill="url(#ldbk-qs03tb1hqma)"></rect></g>
  </svg>`;

  return (
    <div className="flex flex-col items-center justify-center rounded-lg shadow-cardshadow max-w-[300px]">
      <div className="min-w-full cursor-pointer rounded-lg bg-white">
        <div className="w-[300px] h-[300px] relative overflow-hidden">
          <Image
            src={images}
            alt="Donated Food Image"
            className="rounded-t-lg"
            fill
            placeholder="blur"
            blurDataURL={`data:image/svg+xml;base64,${window.btoa(
              shimmerBlurDataURL
            )}`}
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            l
            style={{
              objectFit: "cover",
              maxWidth: "100%",
            }}
            priority={false}
          />
        </div>
        <div className="min-w-full h-[200px] py-6 px-6">
          <div className="text-ellipsis text-lg font-semibold leading-6">
            <h1>
              <EllipsisText text={foodName} length={"25"} />
            </h1>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <FontAwesomeIcon icon={faUser} className="w-4" />
            <p className="text-gray-700">
              <EllipsisText text={giver} length={"20"} />
            </p>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <FontAwesomeIcon icon={faLocationDot} className="w-4" />
            <p className="text-gray-700">
              <EllipsisText text={pickupAddress} length={"45"} />
            </p>
          </div>
          <div className="mt-3 flex items-center gap-3">
            <FontAwesomeIcon icon={faClock} className="w-4" />
            <p className="text-gray-700">
              <EllipsisText text={unixDateToStringFormat(takenBeforeDate.seconds)} length={"20"} />
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
