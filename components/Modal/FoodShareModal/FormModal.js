import { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import LocationSelector from "../../LocationSelector";
import {
  doc,
  collection,
  addDoc,
  Timestamp,
  updateDoc,
  getDoc,
} from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";

import { UserAuth } from "../../../context/AuthContext";
import { db, storage } from "../../../utils/firebaseconfig";

import "react-datepicker/dist/react-datepicker.css";
import { useMutation } from "@tanstack/react-query";

const FormModal = ({
  isShareFoodModalOpen,
  setIsShareFoodModalOpen,
  isMapModalOpen,
  setIsMapModalOpen,
  setFoodShareLoading,
  setIsFoodShareSuccess,
}) => {
  const [position, setPosition] = useState({
    lat: -7.772721510854569,
    lng: 110.37710870153107,
  });
  const [startDate, setStartDate] = useState(null);
  const { user } = UserAuth();

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
      foodType: 0,
      foodWeight: 0,
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

  const { mutate, isLoading, isError } = useMutation({
    mutationFn: (formData) => {
      return fetch(`${process.env.DEV_URL}/shareFood`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Acecess-Control-Allow-Origin": "*",
        },
        body: formData,
      });
    },
    onSuccess: (data) => {
      console.log(data);
    },
    onError: (error) => {
      console.log(error);
    },
  });

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const submitFoodHandler = async (data) => {
    const formData = new FormData();
    // const geofire = require("geofire-common");
    // const foodCollectionRef = collection(db, "food");
    // const latitude = Number(position.lat);
    // const longitude = Number(position.lng);
    // const hash = geofire.geohashForLocation([latitude, longitude]);
    const uploadImages = Object.values(data.foodImages);
    formData.append("foodName", data.foodName);
    formData.append("foodDescription", data.foodDescription);
    formData.append("images", uploadImages[0]);
    formData.append("dateAdded", {
      seconds: Timestamp.now().seconds,
      nanoseconds: Timestamp.now().nanoseconds,
    });
    formData.append("takenBeforeDate", data.takenBeforeDate.toISOString());
    formData.append("foodType", data.foodType);
    formData.append("foodWeight", data.foodWeight);
    formData.append("giver", user.displayName);
    formData.append("giverId", user.uid);
    formData.append("pickupAddress", data.pickupAddress);
    formData.append("addressDescription", data.addressDescription);
    formData.append("latitude", position.lat);
    formData.append("longitude", position.lng);
    mutate(formData);

    // setIsShareFoodModalOpen(false);
    // setFoodShareLoading(true);
    // setIsFoodShareSuccess(false);
    // addDoc(foodCollectionRef, {
    //   // change lat and lng to geopoint
    //   foodName: data.foodName,
    //   foodDescription: data.foodDescription,
    //   dateAdded: Timestamp.fromDate(new Date()),
    //   takenBeforeDate: data.takenBeforeDate,
    //   foodStatus: "available",
    //   foodType: data.foodType,
    //   foodWeight: data.foodWeight,
    //   giver: user.displayName,
    //   giverId: user.uid,
    //   pickupAddress: data.pickupAddress,
    //   addressDescription: data.addressDescription
    //     ? data.addressDescription
    //     : " ",
    //   geohash: hash,
    //   latitude: latitude,
    //   longitude: longitude,
    // })
    //   .then((foodSnapshot) => {
    //     if (foodSnapshot.id) {
    //       const imageRef = ref(
    //         storage,
    //         `images/${foodSnapshot.id}/${uploadImages[0].name}`
    //       );
    //       uploadBytes(imageRef, uploadImages[0]).then((snapshot) => {
    //         getDownloadURL(imageRef)
    //           .then(async (imageDownloadURL) => {
    //             await updateDoc(doc(db, "food", foodSnapshot.id), {
    //               images: imageDownloadURL,
    //             });
    //             // change to transcation
    //             const userPoint = await getDoc(doc(db, "user", user.uid));
    //             const currentUserPoint = userPoint.data().point;
    //             await updateDoc(doc(db, "user", user.uid), {
    //               point: Number(currentUserPoint + 10),
    //             });
    //             setIsShareFoodModalOpen(false);
    //             setFoodShareLoading(false);
    //             setIsFoodShareSuccess(true);
    //           })
    //           .catch((err) => {
    //             toast.error(`Error occurred: ${err}`);
    //             setIsShareFoodModalOpen(false);
    //             setFoodShareLoading(false);
    //             setIsFoodShareSuccess(false);
    //             console.log(err);
    //           });
    //       });
    //     } else {
    //       toast.error(
    //         "Error on adding data to the system. Please retry/reload the page"
    //       );
    //       setFoodShareLoading(false);
    //       setIsFoodShareSuccess(false);
    //     }
    //     console.log(`ini foodSnapshot ${JSON.stringify(foodSnapshot.id)}`);
    //   })
    //   .catch((err) => {
    //     toast.error(`Error occurred: ${err}`);
    //     setIsShareFoodModalOpen(false);
    //     setFoodShareLoading(false);
    //     setIsFoodShareSuccess(false);
    //   });
  };

  // console.log(`ini date ${startDate.toISOString()}`);

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
                        <label htmlFor="foodType" className="block">
                          Tipe Makanan (opsional)
                        </label>
                        <select
                          {...register("foodType")}
                          id="foodType"
                          name="foodType"
                          className="w-full border-2 p-2 rounded-lg mt-1 overflow-scroll"
                        >
                          <option selected value={0}>
                            Kosongkan
                          </option>
                          <option value={1}>
                            Makanan dengan minimal proses (buah, sayur, daging,
                            jagung)
                          </option>
                          <option value={2}>
                            Bahan pangan olahan industri (garam, gula, minyak)
                          </option>
                          <option value={3}>
                            Makanan olahan (asinan, keju, daging asap)
                          </option>
                          <option value={4}>
                            Makanan ultra proses (mie instan, minuman bersoda,
                            sereal)
                          </option>
                        </select>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="foodName" className="block">
                          Berat Makanan (opsional)
                        </label>
                        <input
                          type="number"
                          {...register("foodWeight")}
                          id="foodWeight"
                          placeholder="300"
                          className="w-1/5 border-2 p-2 rounded-lg mt-1"
                        ></input>
                        <span className="ml-2">Gram</span>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="takenBeforeDate" className="block">
                          Dapat Diambil Sebelum
                        </label>
                        <Controller
                          control={control}
                          name="takenBeforeDate"
                          rules={{
                            required: "Please select a date",
                          }}
                          render={({ field: { onChange, value } }) => (
                            <DatePicker
                              onChange={(date) => {
                                setStartDate(date);
                                onChange(date);
                              }}
                              selected={startDate}
                              value={startDate}
                              dateFormat="dd MMMM yyyy HH:mm"
                              showTimeSelect
                              timeFormat="HH:mm"
                              filterTime={filterPassedTime}
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

export default FormModal;
