import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import EllipsisText from "react-ellipsis-text/lib/components/EllipsisText";
import { ToastContainer, toast } from "react-toastify";
import dynamic from "next/dynamic";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

import { UserAuth } from "../../../context/AuthContext";
import { shimmerBlurDataURL } from "../../../lib/shimmerblurdata";
import { BeatLoader } from "react-spinners";

const Messages = dynamic(import("../../Chat/Messages"), { ssr: false });
const FoodPickupConfirmation = dynamic(import("../../Modal/OnProcessTakenModal/FoodPickupConfirmation"))
const FoodCancelConfirmation = dynamic(import("../../Modal/OnProcessTakenModal/FoodCancelConfirmation"))

import "react-toastify/dist/ReactToastify.css";


const OnProcessTakenCard = ({
  images,
  foodName,
  pickupAddress,
  latitude,
  longitude,
  giver,
  giverId,
  foodId,
  addressDescription,
  takerName,
}) => {
  const [
    isFoodPickupConfirmationModalOpen,
    setIsFoodPickupConfirmationModalOpen,
  ] = useState(false);
  const [isFoodCancelModalOpen, setIsFoodCancelModalOpen] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const router = useRouter();
  const { user: currentUser } = UserAuth();
  const combinedChatId =
    currentUser.uid > giverId
      ? currentUser.uid + giverId
      : giverId + currentUser.uid;

  const {
    mutate: foodPickupMutate,
    isLoading: foodPickupLoading,
    isError: foodPickupError,
    error,
  } = useMutation({
    mutationFn: () => {
      setIsFoodPickupConfirmationModalOpen(false);
      // return axios.post(`${process.env.PROD_URL}/sendTakenNotification`, {
      //   foodId: foodId,
      //   foodName: foodName,
      //   giverId: giverId,
      //   takerName: takerName,
      // });
      return axios.post(`https://asia-southeast2-feed-forward-187f4.cloudfunctions.net/app/api/sendTakenNotification`, {
        foodId: foodId,
        foodName: foodName,
        giverId: giverId,
        takerName: takerName,
      });
    },
    onSuccess: () => {
      router.reload();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const contactGiverHandler = () => {
    setIsChatModalOpen(true);
  };

  const {
    mutate: foodCancelMutate,
    isLoading: foodCancelLoading,
    isError: foodCancelError,
  } = useMutation({
    mutationFn: () => {
      setIsFoodCancelModalOpen(false);
      // return axios.post(`${process.env.PROD_URL}/sendCancelNotification`, {
      //   takerName: takerName,
      //   foodName: foodName,
      //   foodId: foodId,
      //   giverId: giverId,
      // });
      return axios.post(`https://asia-southeast2-feed-forward-187f4.cloudfunctions.net/app/api/sendCancelNotification`, {
        takerName: takerName,
        foodName: foodName,
        foodId: foodId,
        giverId: giverId,
      });
    },
    onSuccess: () => {
      router.reload();
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const override = {
    borderColor: "blue",
    marginTop: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
    position: "fixed",
    left: "50%",
    top: "50%",
    zIndex: "99"
  };

  useEffect(() => {
    if (foodPickupError || foodCancelError) {
      toast.error(error.message);
    }
  }, [foodPickupError, foodCancelError]);

  if (foodPickupLoading || foodCancelLoading) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-25"></div>
        <BeatLoader
          color="#000"
          loading={foodPickupLoading || foodCancelLoading}
          cssOverride={override}
          size={15}
          aria-label="Loading Spinner"
          data-testid="loader"
        />
      </>
    );
  }

  return (
    <>
      <ToastContainer />
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
          <p className="inline-block ml-4 px-4 py-1 font-extralight text-sm bg-yellow-200 mt-3 rounded-xl">
            Dalam proses pengambilan
          </p>
          <div className="min-w-full px-6 py-3">
            <div className="text-ellipsis text-lg font-semibold leading-6">
              <h1>
                <EllipsisText text={foodName} length={"100"} />
              </h1>
            </div>
            <div className="mt-3">
              <p className="font-medium">Pemberi</p>
              <p className="text-gray-700">
                <EllipsisText text={giver} length={"100"} />
              </p>
            </div>
            <div className="mt-3">
              <p className="font-medium">Lokasi Pengambilan</p>
              <p className="text-gray-700">
                <EllipsisText text={pickupAddress} length={"150"} />
              </p>
            </div>
            {addressDescription ? (
              <div className="mt-3">
                <p className="font-medium">Detil Lokasi</p>
                <p className="text-gray-700">
                  <EllipsisText text={addressDescription} length={"50"} />
                </p>
              </div>
            ) : null}
            <button
              type="button"
              className="block w-full max-w-xs mx-auto px-6 py-2 bg-blue-100 rounded-lg text-gray-900 cursor-pointer my-3"
            >
              <a
                href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                target="_blank"
                rel="noopener"
              >
                Buka Lokasi di Google Maps
              </a>
            </button>
            <button
              type="button"
              className="block w-full max-w-xs mx-auto px-6 py-2 bg-blue-100 rounded-lg text-gray-900 cursor-pointer my-3"
              onClick={contactGiverHandler}
            >
              Hubungi Pemberi
            </button>
            <button
              type="button"
              onClick={() => setIsFoodPickupConfirmationModalOpen(true)}
              className="block w-full max-w-xs mx-auto px-6 py-2 bg-blue-100 rounded-lg text-gray-900 cursor-pointer my-3"
            >
              Konfirmasi Pengambilan
            </button>
            <button
              type="button"
              onClick={() => setIsFoodCancelModalOpen(true)}
              className="block w-full max-w-xs mx-auto px-6 py-2 bg-red-100 rounded-lg text-gray-900 cursor-pointer my-3"
            >
              Batalkan Pengambilan
            </button>
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
              <p className="inline-block mb-3 font-extralight text-sm p-2 rounded-lg bg-yellow-200">
                Dalam proses pengambilan
              </p>
              <div className="text-ellipsis text-lg font-semibold leading-6">
                <h1>
                  <EllipsisText text={foodName} length={"100"} />
                </h1>
              </div>
              <div className="mt-3">
                <p className="font-medium">Pemberi</p>
                <p className="text-gray-700">
                  <EllipsisText text={giver} length={"100"} />
                </p>
              </div>
              <div className="mt-3">
                <p className="font-medium">Lokasi Pengambilan</p>
                <p className="text-gray-700">
                  <EllipsisText text={pickupAddress} length={"80"} />
                </p>
              </div>
              {addressDescription ? (
                <div className="mt-3">
                  <p className="font-medium">Detil Lokasi</p>
                  <p className="text-gray-700">
                    <EllipsisText text={addressDescription} length={"50"} />
                  </p>
                </div>
              ) : null}
            </div>
            <div className="w-64 mr-2 ">
              <button
                type="button"
                className="w-full px-6 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-gray-900 cursor-pointer my-3"
              >
                <a
                  href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
                  target="_blank"
                  rel="noopener"
                >
                  Buka Lokasi di Google Maps
                </a>
              </button>
              <button
                type="button"
                className="w-full px-6 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-gray-900 cursor-pointer my-3"
                onClick={() => setIsChatModalOpen(true)}
              >
                Hubungi Pemberi
              </button>
              <button
                type="button"
                onClick={() => setIsFoodPickupConfirmationModalOpen(true)}
                className="w-full px-6 py-2 bg-blue-100 hover:bg-blue-200 rounded-lg text-gray-900 cursor-pointer my-3"
              >
                Konfirmasi Pengambilan
              </button>
              <button
                type="button"
                onClick={() => setIsFoodCancelModalOpen(true)}
                className="w-full px-6 py-2 bg-red-100 hover:bg-red-200 rounded-lg text-gray-900 cursor-pointer my-3"
              >
                Batalkan Pengambilan
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}

      <FoodPickupConfirmation
        isFoodPickupConfirmationModalOpen={isFoodPickupConfirmationModalOpen}
        setIsFoodPickupConfirmationModalOpen={
          setIsFoodPickupConfirmationModalOpen
        }
        foodPickupMutate={foodPickupMutate}
      />

      {/* Cancel Modal */}
      <FoodCancelConfirmation
        isFoodCancelModalOpen={isFoodCancelModalOpen}
        setIsFoodCancelModalOpen={setIsFoodCancelModalOpen}
        foodCancelMutate={foodCancelMutate}
      />

       {/* Message Modal */}
      <Messages
        isChatModalOpen={isChatModalOpen}
        setIsChatModalOpen={setIsChatModalOpen}
        combinedChatId={combinedChatId}
        giver={giver}
      />
    </>
  );
};

export default OnProcessTakenCard;
