import React, { Fragment, useState, useRef, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/router";

import { Dialog, Transition } from "@headlessui/react";
import { useForm, Controller } from "react-hook-form";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPlus } from "@fortawesome/free-solid-svg-icons";
import { BeatLoader } from "react-spinners";
import { ToastContainer, toast } from "react-toastify";
import {
  doc,
  collection,
  addDoc,
  setDoc,
  Timestamp,
  updateDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import DatePicker from "react-datepicker";

import { db, storage } from "../../utils/firebaseconfig";
import { UserAuth } from "../../context/AuthContext";

import LocationSelector from "../LocationSelector";
import "react-datepicker/dist/react-datepicker.css";

const ShareFoodButton = () => {
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
      <div className="fixed bottom-4 right-5 w-[50px] h-[50px] bg-teal flex justify-center items-center rounded-full cursor-pointer shadow-buttonshadow transition ease-in-out delay-150 duration-300 hover:bg-darkteal">
        <FontAwesomeIcon
          icon={faPlus}
          size="1x"
          color="#fff"
          onClick={() => {
            setIsShareFoodModalOpen(true);
            console.log("adas");
          }}
        />
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
                      Food sharing confirmation
                    </Dialog.Title>
                    <div className="mt-2">
                      <p className="text-sm text-gray-500">
                        Your food has been successfully submitted to the system.
                        Thank you for your kindness.
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
                        Got it, thanks!
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
                <Dialog.Panel className="w-full max-w-md lg:max-w-3xl border-2 border-red-500 transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
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
                          Food Name
                        </label>
                        <input
                          type="text"
                          {...register("foodName", {
                            required: "Please enter a food name",
                          })}
                          id="foodName"
                          placeholder="ex: slice of pizza"
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
                          Food Description
                        </label>
                        <textarea
                          type="foodDescription"
                          {...register("foodDescription", {
                            required: "Please enter food description",
                          })}
                          id="foodDescription"
                          placeholder="slice of domino pizza, expired on 24 March 2024"
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
                          Can be taken before
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
                            Delete Image
                          </button>
                        </div>
                      ) : (
                        <>
                          <div className="min-w-full h-[200px] flex justify-center items-center border-2 border-dashed border-gray-300 rounded-lg mb-4">
                            <label>
                              + Add image
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
                          Pickup address
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
                          Address description (optional)
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
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="inline-flex justify-center rounded-md border border-transparent bg-blue-100 px-4 py-2 text-sm font-medium text-blue-900 hover:bg-blue-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                        >
                          Share
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

export default ShareFoodButton;
