import React from "react";
import Image from "next/image";
import EllipsisText from "react-ellipsis-text/lib/components/EllipsisText";

import { unixDateToStringFormat } from "../../lib/unixdatetostringformat";
import { shimmerBlurDataURL } from "../../lib/shimmerblurdata";

const FoodCard = ({
  images,
  foodName,
  pickupAddress,
  takenBeforeDate,
  distance,
}) => {
  return (
    <div className="flex flex-col md:flex-row border-[1px] rounded-lg items-center justify-center shadow-cardshadow">
      <div className="w-[300px] h-[300px] rounded-lg relative overflow-hidden">
        <Image
          src={images}
          alt="Donated Food Image"
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
          priority={true}
        />
      </div>
      <div className="flex flex-col border-b-[1px] md:border-r-[1px]  rounded-lg justify-center p-6 w-[300px] md:w-[350px] h-[300px] cursor-pointer rounded-b-lg bg-white">
        <div className="text-ellipsis text-lg font-semibold leading-6">
          <h1>
            <EllipsisText text={foodName} length={"50"} />
          </h1>
        </div>
        <div className="mt-3 gap-3">
          <p className="font-medium">Dapat diambil sebelum</p>
          <p className="text-gray-700">
            <EllipsisText
              text={unixDateToStringFormat(takenBeforeDate._seconds)}
              length={"40"}
            />
          </p>
        </div>
        <div className="mt-3 gap-3">
          <p className="font-medium">Lokasi</p>
          <p className="text-gray-700">
            <EllipsisText text={pickupAddress} length={"65"} />
          </p>
        </div>

        <div className="mt-3 gap-3">
          <p className="font-medium"></p>
          <p className="text-gray-700">
            <EllipsisText
              text={distance.toFixed(2).toString() + " Km dari lokasi anda"}
              length={"40"}
            />
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodCard;
