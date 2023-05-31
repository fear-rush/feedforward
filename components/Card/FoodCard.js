import React from "react";
import Image from "next/image";
import EllipsisText from "react-ellipsis-text/lib/components/EllipsisText";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faLocationDot,
  faClock,
} from "@fortawesome/free-solid-svg-icons";

import { unixDateToStringFormat } from "../../lib/unixdatetostringformat";
import { shimmerBlurDataURL } from "../../lib/shimmerblurdata";

const FoodCard = ({
  images,
  foodName,
  giver,
  pickupAddress,
  takenBeforeDate,
}) => {


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
            quality={50}
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
