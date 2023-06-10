import Image from "next/image";
import Link from "next/link";
import EllipsisText from "react-ellipsis-text/lib/components/EllipsisText";

import { shimmerBlurDataURL } from "../../../lib/shimmerblurdata";
import { unixDateToStringFormat } from "../../../lib/unixdatetostringformat";

const AvailableGivenCard = ({
  images,
  foodName,
  takenBeforeDate,
  pickupAddress,
  foodId,
}) => {

  console.log(takenBeforeDate.seconds);

  return (
    <>
      {/* SM COMPONENT CARD*/}
      <div className="lg:hidden rounded-lg shadow-cardshadow min-w-full mt-4">
        <div className="min-w-full cursor-pointer rounded-lg bg-white border-[1px] border-gray-200">
          <div className="relative mx-auto max-w-[300px] h-[300px] rounded-t-lg">
            <Image
              src={images}
              alt="Donated Food Image"
              className="rounded-lg"
              fill
              sizes="50vw"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${window.btoa(
                shimmerBlurDataURL
              )}`}
              style={{
                objectFit: "cover",
              }}
              priority={true}
            />
          </div>
          <div className="border-[1px] my-2 border-gray-200"></div>
          <p className="inline-block ml-4 px-4 py-1 font-extralight text-sm bg-blue-200 mt-3 rounded-xl">
            Makanan masih tersedia
          </p>
          <div className="min-w-full px-6 py-3">
            <div className="text-ellipsis text-lg font-semibold leading-6">
              <h1>
                <EllipsisText text={foodName} length={"100"} />
              </h1>
            </div>
            <div className="mt-3">
              <p className="font-medium">Baik Diambil Sebelum</p>
              <p className="text-gray-700">
                <EllipsisText
                  text={unixDateToStringFormat(takenBeforeDate._seconds)}
                  length={"100"}
                />
              </p>
            </div>
            <div className="mt-3">
              <p className="font-medium">Lokasi Pengambilan</p>
              <p className="text-gray-700">
                <EllipsisText text={pickupAddress} length={"150"} />
              </p>
            </div>
            <Link href={`/food/${foodId}`}>
              <button
                type="button"
                className="block w-full max-w-xs mx-auto px-6 py-2 bg-blue-100 rounded-lg text-gray-900 cursor-pointer my-3"
              >
                Detil Makanan
              </button>
            </Link>
          </div>
        </div>
      </div>

    

      {/* LG COMPONENT CARD */}
      <div className="hidden lg:block rounded-lg shadow-cardshadow mt-4">
        <div className="flex space-x-4 min-w-full h-[300px] cursor-pointer rounded-lg bg-white border-[1px] border-gray-200">
          <div className="relative flex-none w-[300px] h-full">
            <Image
              src={images}
              alt="Donated Food Image"
              className="rounded-lg"
              fill
              sizes="50vw"
              placeholder="blur"
              blurDataURL={`data:image/svg+xml;base64,${window.btoa(
                shimmerBlurDataURL
              )}`}
              style={{
                objectFit: "cover",
              }}
              priority={true}
            />
          </div>
          <div className="flex items-center justify-evenly">
            <div className="flex-1">
              <p className="inline-block mb-3 font-extralight text-sm p-2 rounded-lg bg-blue-200">
                Makanan masih tersedia
              </p>
              <div className="text-ellipsis text-lg font-semibold leading-6">
                <h1>
                  <EllipsisText text={foodName} length={"80"} />
                </h1>
              </div>
              <div className="mt-3">
                <p className="font-medium">Baik Diambil Sebelum</p>
                <p className="text-gray-700">
                  <EllipsisText
                    text={unixDateToStringFormat(takenBeforeDate._seconds)}
                    length={"100"}
                  />
                </p>
              </div>
              <div className="mt-3">
                <p className="font-medium">Lokasi Pengambilan</p>
                <p className="text-gray-700">
                  <EllipsisText text={pickupAddress} length={"150"} />
                </p>
              </div>
            </div>
            <div className="w-64 mr-2">
              <Link href={`/food/${foodId}`}>
                <button
                  type="button"
                  className="block backdrop:w-3/4 mx-auto px-6 py-2 bg-blue-100 hover:bg-200 rounded-lg text-gray-900 cursor-pointer my-3"
                >
                  Detil Makanan
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AvailableGivenCard;
