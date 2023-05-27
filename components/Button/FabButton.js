import React, { Fragment, useState } from "react";
import { useRouter } from "next/router";
import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  Timestamp,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";

import { db, storage } from "../../utils/firebaseconfig";
import { UserAuth } from "../../context/AuthContext";

import LocationSelector from "../LocationSelector";
import "react-datepicker/dist/react-datepicker.css";

const FabButton = () => {
  const [foodData, setFoodData] = useState([]);
  const [position, setPosition] = useState({
    lat: -7.772721510854569,
    lng: 110.37710870153107,
  });
  const [isShareFoodModalOpen, setIsShareFoodModalOpen] = useState(false);
  const [isMapModalOpen, setIsMapModalOpen] = useState(false);
  const [isFoodShareSuccessModalOpen, setIsFoodShareSuccessModalOpen] =
    useState(true);
  const [foodShareLoading, setFoodShareLoading] = useState(false);
  const [isFoodShareSuccess, setIsFoodShareSuccess] = useState(false);
  const { user } = UserAuth();
  const router = useRouter();
  const batch = writeBatch(db);

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    mode: "onChange",
    criteriaMode: "all",
    defaultValues: {
      foodName: "",
      foodDescription: "",
      takenBeforeDate: "",
      foodStatus: "available",
      giver: user.displayName,
      giverId: user.uid,
      pickupAddress: "",
      geohash: "",
      latitude: "",
      longitude: "",
      foodImages: [],
      address: "",
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
  };

  const submitFoodHandler = async (data) => {
    const geofire = require("geofire-common");
    const foodCollectionRef = collection(db, "user", user.uid, "food");
    const latitude = Number(position.lat);
    const longitude = Number(position.lng);
    const hash = geofire.geohashForLocation([latitude, longitude]);
    const uploadImages = Object.values(data.foodImages);

    setIsShareFoodModalOpen(false);
    setFoodShareLoading(true);
    setIsFoodShareSuccess(false);

    addDoc(foodCollectionRef, {
      foodName: data.foodName,
      foodDescription: data.foodDescription,
      dateAdded: Timestamp.fromDate(new Date()),
      takenBeforeDate: data.takenBeforeDate,
      foodStatus: "available",
      giver: user.displayName,
      giverId: user.uid,
      pickupAddress: data.pickupAddress,
      addressDescription: data.addressDescription
        ? data.addressDescription
        : " ",
      geohash: hash,
      latitude: latitude,
      longitude: longitude,
    })
      .then((foodSnapshot) => {
        if (foodSnapshot.id) {
          const imageRef = ref(
            storage,
            `images/${foodSnapshot.id}/${uploadImages[0].name}`
          );
          uploadBytes(imageRef, uploadImages[0]).then((snapshot) => {
            getDownloadURL(imageRef)
              .then(async (imageDownloadURL) => {
                console.log(imageDownloadURL);
                await setDoc(doc(db, "allfood", foodSnapshot.id), {
                  foodName: data.foodName,
                  foodDescription: data.foodDescription,
                  dateAdded: Timestamp.fromDate(new Date()),
                  takenBeforeDate: data.takenBeforeDate,
                  foodStatus: "available",
                  giver: user.displayName,
                  giverId: user.uid,
                  pickupAddress: data.pickupAddress,
                  addressDescription: data.addressDescription
                    ? data.addressDescription
                    : " ",
                  geohash: hash,
                  latitude: latitude,
                  longitude: longitude,
                  images: imageDownloadURL,
                });

                await updateDoc(
                  doc(db, "user", user.uid, "food", foodSnapshot.id),
                  {
                    images: imageDownloadURL,
                  }
                );

                setFoodData([
                  {
                    foodName: data.foodName,
                    foodDescription: data.foodDescription,
                    dateAdded: Timestamp.fromDate(new Date()),
                    takenBeforeDate: data.takenBeforeDate,
                    foodStatus: "available",
                    giver: user.displayName,
                    giverId: user.uid,
                    pickupAddress: data.pickupAddress,
                    addressDescription: data.addressDescription
                      ? data.addressDescription
                      : " ",
                    geohash: hash,
                    latitude: latitude,
                    longitude: longitude,
                    images: imageDownloadURL,
                  },
                  ...foodData,
                ]);
                setIsShareFoodModalOpen(false);
                setFoodShareLoading(false);
                setIsFoodShareSuccess(true);
              })
              .catch((err) => {
                toast.error(`Error occurred: ${err}`);
                setIsShareFoodModalOpen(false);
                setFoodShareLoading(false);
                setIsFoodShareSuccess(false);
                console.log(err);
              });
          });
        } else {
          toast.error(
            "Error on adding data to the system. Please retry/reload the page"
          );
          setFoodShareLoading(false);
          setIsFoodShareSuccess(false);
        }
        console.log(`ini foodSnapshot ${JSON.stringify(foodSnapshot.id)}`);
      })
      .catch((err) => {
        toast.error(`Error occurred: ${err}`);
        setIsShareFoodModalOpen(false);
        setFoodShareLoading(false);
        setIsFoodShareSuccess(false);
      });
  };
  return (
    <>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="hidden lg:block"
      />
      <ToastContainer
        position="bottom-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
        className="lg:hidden"
      />
      {/* <div className="fixed bottom-4 right-5 w-[50px] h-[50px] bg-teal flex justify-center items-center rounded-full cursor-pointer shadow-buttonshadow transition ease-in-out delay-150 duration-300 hover:bg-darkteal">
      <FontAwesomeIcon
        icon={faPlus}
        size="1x"
        color="#fff"
        onClick={() => {
          setIsShareFoodModalOpen(true);
          console.log("adas");
        }}
      />
    </div> */}

      <div class="fixed z-10 w-screen sm:w-[500px] h-20 -translate-x-1/2 bg-gray-50 border border-gray-200 sm:rounded-full bottom-0 lg:bottom-4 left-1/2">
        <div class="grid h-full max-w-lg grid-cols-3 mx-auto">
          <button
            data-tooltip-target="tooltip-home"
            type="button"
            class="group inline-flex flex-col items-center justify-center px-5 rounded-l-full hover:bg-gray-100 group"
            onClick={() => router.push("/dashboard")}
          >
            <svg
              class="w-8 h-8 mb-1 text-gray-500  group-hover:text-blue-600 "
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z"></path>
            </svg>
            <div class="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 -top-10 group-hover:opacity-100 px-3 pointer-events-none">
              Dashboard
              <svg
                class="absolute text-black h-2 w-full left-0 top-full"
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
              >
                <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
              </svg>
            </div>
          </button>

          <div class="flex flex-col items-center justify-center">
            <button
              data-tooltip-target="tooltip-new"
              type="button"
              class="group inline-flex items-center justify-center w-12 h-12 font-medium bg-blue-600 rounded-full hover:bg-blue-700 group focus:ring-4 focus:ring-blue-300 focus:outline-none"
              onClick={() => {
                setIsShareFoodModalOpen(true);
              }}
            >
              <svg
                class="w-6 h-6 text-white"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  clip-rule="evenodd"
                  fill-rule="evenodd"
                  d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                ></path>
              </svg>
              <div class="opacity-0 w-36 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 -top-10 group-hover:opacity-100 px-3 pointer-events-none">
                Bagikan Makanan
                <svg
                  class="absolute text-black h-2 w-full left-0 top-full"
                  x="0px"
                  y="0px"
                  viewBox="0 0 255 255"
                >
                  <polygon
                    class="fill-current"
                    points="0,0 127.5,127.5 255,0"
                  />
                </svg>
              </div>
            </button>
          </div>

          <button
            data-tooltip-target="tooltip-profile"
            type="button"
            class="group inline-flex flex-col items-center justify-center px-5 rounded-r-full hover:bg-gray-100 group"
            onClick={() => router.push("/profile")}
          >
            <svg
              class="w-8 h-8 mb-1 text-gray-500  group-hover:text-blue-600"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                clip-rule="evenodd"
                fill-rule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z"
              ></path>
            </svg>
            <span class="sr-only">Profile</span>
            <div class="opacity-0 w-28 bg-black text-white text-center text-xs rounded-lg py-2 absolute z-10 -top-10 group-hover:opacity-100 px-3 pointer-events-none">
              Profile
              <svg
                class="absolute text-black h-2 w-full left-0 top-full"
                x="0px"
                y="0px"
                viewBox="0 0 255 255"
              >
                <polygon class="fill-current" points="0,0 127.5,127.5 255,0" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {foodShareLoading && !isFoodShareSuccess && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-25"></div>
          <BeatLoader
            color="#000"
            loading={foodShareLoading}
            cssOverride={override}
            size={15}
            aria-label="Loading Spinner"
            data-testid="loader"
          />
        </>
      )}

      {!foodShareLoading && isFoodShareSuccess && (
        <Transition appear show={isFoodShareSuccessModalOpen} as={Fragment}>
          <Dialog
            as="div"
            className="relative z-10"
            onClose={() => setIsFoodShareSuccessModalOpen(false)}
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
                      Konfirmasi pembagian makanan
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Makanan berhasil dibagikan. Terima kasih atas keinginan
                        anda untuk membagikan makanan.
                      </p>
                    </div>

                    <div className="mt-4">
                      <button
                        type="button"
                        className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        onClick={() => {
                          setIsFoodShareSuccessModalOpen(false);
                          router.reload();
                        }}
                      >
                        OK
                      </button>
                    </div>
                  </Dialog.Panel>
                </Transition.Child>
              </div>
            </div>
          </Dialog>
        </Transition>
      )}

      <Transition appear show={isShareFoodModalOpen} as={Fragment}>
        <Dialog
          as="div"
          className="relative z-10"
          onClose={() => setIsShareFoodModalOpen(false)}
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
                <Dialog.Panel className="relative z-50 w-full max-w-md lg:max-w-3xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Share your food!
                  </Dialog.Title>
                  <div className="mt-2">
                    <form noValidate onSubmit={handleSubmit(submitFoodHandler)}>
                      <div className="mb-4">
                        <label htmlFor="foodName" className="block">
                          Nama Makanan
                        </label>
                        <input
                          type="text"
                          {...register("foodName", {
                            required: "Please enter a food name",
                          })}
                          id="foodName"
                          placeholder="contoh: mie instan"
                          className="min-w-full border-2 p-2 rounded-lg mt-1"
                        ></input>
                        {errors.foodName && (
                          <div className="text-red-500">
                            {errors.foodName.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="foodDescription" className="block">
                          Deskripsi Makanan
                        </label>
                        <textarea
                          type="foodDescription"
                          {...register("foodDescription", {
                            required: "Please enter food description",
                          })}
                          id="foodDescription"
                          placeholder="mie instan 4 bungkus"
                          className="block h-[100px] min-w-full border-2 p-2 rounded-lg mt-1"
                        ></textarea>
                        {errors.foodDescription && (
                          <div className="text-red-500">
                            {errors.foodDescription.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="takenBeforeDate" className="block">
                          Bisa Diambil Sebelum
                        </label>
                        <Controller
                          control={control}
                          name="takenBeforeDate"
                          rules={{
                            required: "Please select a date",
                          }}
                          render={({ field: { onChange, value } }) => (
                            <DatePicker
                              selected={value}
                              onChange={onChange}
                              value={value}
                              dateFormat="dd MMMM yyyy"
                              placeholderText="Select Date"
                              className="min-w-full border-2 p-2 rounded-lg mt-1"
                              minDate={new Date()}
                            />
                          )}
                        />
                        {errors.takenBeforeDate && (
                          <div className="text-red-500">
                            {errors.takenBeforeDate.message}
                          </div>
                        )}
                      </div>
                      {watch("foodImages").length > 0 ? (
                        <div className="min-w-full flex flex-col justify-center items-center mb-4">
                          <div className="relative w-[300px] h-[300px] flex justify-center items-center mt-4">
                            <img
                              src={URL.createObjectURL(
                                getValues("foodImages")[0]
                              )}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            className="w-1/2 mt-4 rounded-lg bg-red-400 text-sm font-medium text-white hover:bg-red-500 cursor-pointer p-2"
                            onClick={() => {
                              URL.revokeObjectURL(getValues("foodImages"));
                              setValue("foodImages", []);
                            }}
                          >
                            Hapus Gambar
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="min-w-full h-[200px] flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg mb-4">
                            <label>
                              + Tambahkan Gambar
                              <br />
                              <input
                                type="file"
                                {...register("foodImages", {
                                  required: "Please upload one image",
                                })}
                                id="foodImages"
                                className="hidden"
                                accept="image/*"
                              ></input>
                            </label>
                          </div>
                          {errors.foodImages && (
                            <div className="text-red-500">
                              {errors.foodImages.message}
                            </div>
                          )}
                        </>
                      )}
                      <div className="mb-4">
                        <label htmlFor="pickupAddress" className="block">
                          Lokasi Pengambilan
                        </label>
                        <div className="mb-2 flex items-center gap-2">
                          <input
                            type="text"
                            {...register("pickupAddress", {
                              required: "Please enter a valid pickup address",
                            })}
                            id="pickupAddress"
                            value={watch("pickupAddress")}
                            placeholder="Gg. Murai 15, Godean, Sleman "
                            className="flex-1 min-w-0 border-2 p-2 rounded-lg mt-1 inline-flex"
                          ></input>
                          <LocationSelector
                            setValue={setValue}
                            isMapModalOpen={isMapModalOpen}
                            setIsMapModalOpen={setIsMapModalOpen}
                            position={position}
                            setPosition={setPosition}
                          />
                        </div>
                        {errors.pickupAddress && (
                          <div className="text-red-500">
                            {errors.pickupAddress.message}
                          </div>
                        )}
                      </div>
                      <div className="mb-4">
                        <label htmlFor="addressDescription" className="block">
                          Detil Lokasi (opsional)
                        </label>
                        <input
                          type="text"
                          {...register("addressDescription")}
                          id="addressDescription"
                          placeholder="yellow house, brown fence"
                          className="min-w-full border-2 p-2 rounded-lg mt-1"
                        ></input>
                        {errors.addressDescription && (
                          <div className="text-red-500">
                            {errors.longitude.addressDescription}
                          </div>
                        )}
                      </div>
                      <div className="flex justify-end items-center mt-4 gap-4">
                        <button
                          type="button"
                          className="inline-flex justify-center rounded-md border border-transparent bg-red-100 px-4 py-2 text-sm font-medium text-red-900 hover:bg-red-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 focus-visible:ring-offset-2"
                          onClick={() => {
                            reset();
                            setIsShareFoodModalOpen(false);
                          }}
                        >
                          Batal
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Bagikan
                        </button>
                      </div>
                    </form>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

export default FabButton;
