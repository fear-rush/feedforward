import { Fragment, useState } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { Timestamp } from "firebase/firestore";
import { BeatLoader } from "react-spinners";
import { TrashIcon } from "@heroicons/react/24/outline";
import axios from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { UserAuth } from "../../context/AuthContext";
import { shimmerBlurDataURL } from "../../lib/shimmerblurdata";
import { unixDateToStringFormat } from "../../lib/unixdatetostringformat";
import { getTimeAgo } from "../../lib/gettimeago";

import FabButton from "../Button/FabButton";
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
  const router = useRouter();
  const queryClient = useQueryClient();
  const override = {
    borderColor: "blue",
    marginTop: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
    position: "fixed",
    left: "50%",
    top: "50%",
  };

  const {
    mutate,
    isLoading: isFoodPickupLoading,
    isError: isFoodPickupError,
    error,
  } = useMutation({
    mutationFn: () => {
      setIsFoodConfirmationModalOpen(false);
      queryClient.removeQueries();
      // return axios.post(`${process.env.DEV_URL}/sendPickupNotification`, {
      //   foodName: foodName,
      //   takerName: user.displayName,
      //   foodId: foodId,
      //   takerId: user.uid,
      //   dateTaken: Timestamp.now(),
      //   giverId: giverId,
      // });
      return axios.post(
        `https://asia-southeast2-feed-forward-187f4.cloudfunctions.net/app/api/sendPickupNotification`,
        {
          foodName: foodName,
          takerName: user.displayName,
          foodId: foodId,
          takerId: user.uid,
          dateTaken: Timestamp.now(),
          giverId: giverId,
        }
      );
    },
    onSuccess: () => {
      router.replace("/profile");
    },
    onError: (error) => {
      throw new Error(error);
    },
  });

  if (isFoodPickupError) {
    // console.log(`ini error ${error}`);
    return (
      <div className="mx-auto text-center mt-12">
        <TrashIcon className="w-16 h-16 text-black mx-auto" />
        <h1 className="mt-4 text-lg">
          Makanan yang akan diambil sudah tidak tersedia.
        </h1>
        <button
          type="button"
          className="bg-blue-400 px-2 py-1 hover:bg-blue-500 text-white rounded-lg mt-2 cursor-pointer"
          onClick={() => router.replace("/home")}
        >
          Kembali ke Home
        </button>
        <FabButton />
      </div>
    );
  }

  if (isFoodPickupLoading)
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-25"></div>
        <BeatLoader
          color="#000"
          loading={isFoodPickupLoading}
          cssOverride={override}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </>
    );

  return (
    <>
      <div className="grid grid-cols-1 min-h-screen mt-6 mb-20 lg:mb-40 mx-auto justify-items-center rounded-lg shadow-cardshadow max-w-5xl bg-white">
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
          <h1 className="font-bold text-3xl mt-6 mb-4 food-name">{foodName}</h1>
          <p className="font-extralight">{foodDescription}</p>
          <div className="flex flex-col justify-evenly items-center my-4 border-2 border-gray-200 rounded-lg">
            <div className="flex flex-1 flex-col justify-center items-center p-2">
              <p className="font-medium">{giver}</p>
              <p className="font-extralight">{`Dibagikan ${getTimeAgo(
                dateAdded._seconds
              )}`}</p>
            </div>
            <div className="border-[1px] border-gray-200 min-w-full"></div>
            <div className="flex flex-1 flex-col justify-center items-center p-2">
              <p className="font-medium">Baik Diambil Sebelum</p>
              <p className="font-extralight">
                {unixDateToStringFormat(takenBeforeDate._seconds)}
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
          {user.uid === giverId ? null : (
            <button
              type="button"
              className="block mx-auto w-full max-w-sm px-2 py-2 bg-green-100 hover:bg-green-200 rounded-lg mt-6"
              onClick={() => setIsFoodConfirmationModalOpen(true)}
            >
              Ambil Makanan
            </button>
          )}
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
                        onClick={mutate}
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
    </>
  );
};

export default FoodDetailView;
