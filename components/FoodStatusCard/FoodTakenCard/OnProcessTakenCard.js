import { useState, Fragment } from "react";
import Image from "next/image";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { doc, Timestamp, updateDoc } from "firebase/firestore";
import EllipsisText from "react-ellipsis-text/lib/components/EllipsisText";

import { UserAuth } from "../../../context/AuthContext";
import { db } from "../../../utils/firebaseconfig";
import { shimmerBlurDataURL } from "../../../lib/shimmerblurdata";
import { BeatLoader } from "react-spinners";

import dynamic from "next/dynamic";
const Messages = dynamic(import("../../Chat/Messages"), { ssr: false });

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
}) => {
  const [pickupConfirmationLoading, setPickupConfirmationLoading] =
    useState(false);
  const [
    isFoodPickupConfirmationModalOpen,
    setIsFoodPickupConfirmationModalOpen,
  ] = useState(false);
  const [isChatModalOpen, setIsChatModalOpen] = useState(false);
  const router = useRouter();
  const { user: currentUser } = UserAuth();
  const combinedChatId =
    currentUser.uid > giverId
      ? currentUser.uid + giverId
      : giverId + currentUser.uid;

  const foodPickupConfirmationHandler = async () => {
    setPickupConfirmationLoading(true);

    try {
      const foodDocumentRef = doc(db, "food", foodId);
      await updateDoc(foodDocumentRef, {
        foodStatus: "taken",
        dateTaken: Timestamp.now(),
      });
      setPickupConfirmationLoading(false);
      router.reload();
    } catch (err) {
      // add error handler toast
      setPickupConfirmationLoading(false);
      console.log(err);
    }
  };

  const contactGiverHandler = () => {
    setIsChatModalOpen(true);
  };

  const override = {
    borderColor: "blue",
    marginTop: "1rem",
    marginBottom: "1rem",
    textAlign: "center",
    position: "fixed",
    left: "50%",
    top: "50%",
  };

  if (pickupConfirmationLoading) {
    return (
      <>
        <div className="fixed inset-0 bg-black bg-opacity-25"></div>
        <BeatLoader
          color="#000"
          loading={pickupConfirmationLoading}
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
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Modal */}

      <Transition appear show={isFoodPickupConfirmationModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsFoodPickupConfirmationModalOpen(false)}
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
                      Apakah anda sudah selesai mengambil makanan?
                    </p>
                  </div>

                  <div className="flex justify-end items-center mt-4 gap-4">
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                      onClick={() => {
                        setIsFoodPickupConfirmationModalOpen(false);
                      }}
                    >
                      Belum
                    </button>
                    <button
                      type="button"
                      className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                      onClick={foodPickupConfirmationHandler}
                    >
                      Sudah
                    </button>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

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
