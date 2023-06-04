import { Fragment, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { doc, Timestamp, getDoc, updateDoc } from "firebase/firestore";
import { BeatLoader } from "react-spinners";

import { UserAuth } from "../../context/AuthContext";
import { db } from "../../utils/firebaseconfig";
import { shimmerBlurDataURL } from "../../lib/shimmerblurdata";
import { unixDateToStringFormat } from "../../lib/unixdatetostringformat";
import { getTimeAgo } from "../../lib/gettimeago";

import MapContainer from "./MapContainer";

const FoodDetailView = ({
  images,
  giver,
  giverId,
  dateAdded,
  takenBeforeDate,
  foodName,
  foodDescription,
  pickupAddress,
  addressDescription,
  latitude,
  longitude,
  foodId,
}) => {
  const [isFoodConfirmationModalOpen, setIsFoodConfirmationModalOpen] =
    useState(false);
  const { user } = UserAuth();
  const [isGettingFoodLoading, setIsGettingFoodLoading] = useState(false);
  const router = useRouter();
  const override = {
    borderColor: "blue",
    marginTop: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
    position: "fixed",
    left: "50%",
    top: "50%",
  };

  const takeFoodHandler = async () => {
    setIsGettingFoodLoading(true);
    try {
      console.log(foodId);
      const foodDocument = await getDoc(doc(db, "food", foodId));
      if (foodDocument.data().foodStatus !== "available") {
        // add toast food is already taken or processed
        setIsGettingFoodLoading(false);
        return;
      }

      const foodDocumentRef = doc(db, "food", foodId);

      // use transaction
      await updateDoc(foodDocumentRef, {
        foodStatus: "onprocess",
        takerName: user.displayName,
        takerId: user.uid,
        dateTaken: Timestamp.now(),
      });

      console.log("success");
      setIsGettingFoodLoading(false);
      router.push("/profile");
    } catch (err) {
      // add error handler toast
      console.log(err);
      setIsGettingFoodLoading(true);
    }
  };

  if (isGettingFoodLoading)
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-25"></div>
        <BeatLoader
          color="#000"
          loading={isGettingFoodLoading}
          cssOverride={override}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </>
    );

  return (
    <div className="grid grid-cols-1 min-h-screen mb-20 lg:mb-28 mx-auto justify-items-center rounded-lg shadow-cardshadow max-w-5xl bg-white">
      <div className="relative w-[350px] h-[350px] overflow-hidden">
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
        />
      </div>
      <div className="px-6 pb-6 lg:pb-14 min-w-full">
        <h1 className="font-bold text-3xl mt-6 mb-4">{foodName}</h1>
        <p className="font-extralight">{foodDescription}</p>
        <div className="flex flex-col justify-evenly items-center my-4 border-2 border-gray-200 rounded-lg">
          <div className="flex flex-1 flex-col justify-center items-center p-2">
            <p className="font-medium">{giver}</p>
            <p className="font-extralight">{`Dibagikan ${getTimeAgo(
              dateAdded.seconds
            )}`}</p>
          </div>
          <div className="border-[1px] border-gray-200 min-w-full"></div>
          <div className="flex flex-1 flex-col justify-center items-center p-2">
            <p className="font-medium">Baik Diambil Sebelum</p>
            <p className="font-extralight">
              {unixDateToStringFormat(takenBeforeDate.seconds)}
            </p>
          </div>
        </div>
        <p className="font-medium mb-3">Lokasi Pengambilan</p>
        <MapContainer latitude={latitude} longitude={longitude} />
        <p className="font-extralight my-3">{pickupAddress}</p>
        <button className="block w-full max-w-sm mx-auto p-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-gray-900 cursor-pointer">
          <a
            href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
            target="_blank"
            rel="noopener"
          >
            Buka Lokasi di Google Maps
          </a>
        </button>
        {addressDescription ? (
          <>
            <p className="font-medium mt-3 mb-1">Detil Lokasi</p>
            <p className="font-extralight">{addressDescription}</p>
          </>
        ) : null}
        <button
          type="button"
          className="block mx-auto w-full max-w-sm px-2 py-2 bg-green-100 hover:bg-green-200 rounded-lg mt-6"
          onClick={() => setIsFoodConfirmationModalOpen(true)}
        >
          Ambil Makanan
        </button>
      </div>

      <Transition appear show={isFoodConfirmationModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsFoodConfirmationModalOpen(false)}
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Konfirmasi Pengambilan Makanan
                  </Dialog.Title>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Apakah anda ingin mengambil makanan ini?
                    </p>
                  </div>

                  <div className="flex justify-end items-center mt-4 gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsFoodConfirmationModalOpen(false);
                      }}
                    >
                      Batal
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={takeFoodHandler}
                    >
                      Ambil
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </div>
  );
};

export default FoodDetailView;
