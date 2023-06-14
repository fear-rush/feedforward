import { Fragment, useState } from "react";
import { Transition, Dialog } from "@headlessui/react";
import DatePicker from "react-datepicker";
import { Controller } from "react-hook-form";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import axios from "axios";

import { UserAuth } from "../../../context/AuthContext";

import LocationSelector from "../../LocationSelector";

import "react-toastify/dist/ReactToastify.css";
import "react-datepicker/dist/react-datepicker.css";

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

  const { mutate } = useMutation({
    mutationFn: (formData) => {
      // return axios.post(`${process.env.PROD_URL}/shareFood`, formData);
      return axios.post(`https://asia-southeast2-feed-forward-187f4.cloudfunctions.net/app/api/shareFood`, formData);
    },
    onSuccess: () => {
      setIsShareFoodModalOpen(false);
      setFoodShareLoading(false);
      setIsFoodShareSuccess(true);
    },
    onError: (error) => {
      toast.error(error.message);
      setIsShareFoodModalOpen(false);
      setFoodShareLoading(false);
    },
  });

  const filterPassedTime = (time) => {
    const currentDate = new Date();
    const selectedDate = new Date(time);

    return currentDate.getTime() < selectedDate.getTime();
  };

  const submitFoodHandler = async (data) => {
    setIsShareFoodModalOpen(false);
    setFoodShareLoading(true);
    setIsFoodShareSuccess(false);
    const formData = new FormData();
    const uploadImages = Object.values(data.foodImages);
    formData.append("foodName", data.foodName);
    formData.append("foodDescription", data.foodDescription);
    formData.append("images", uploadImages[0]);
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
  };

  return (
    <>
      <ToastContainer />
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
                  <div className="mt-2 bg-yellow-200 rounded-lg">
                    <p className="p-4 text-gray-600">
                      Sebelum membagikan makanan dimohon untuk memperhatikan
                      kondisi makanan. Perhatikan kondisi makanan layak untuk
                      dimakan dan dibagikan
                    </p>
                  </div>

                  <div className="mt-2">
                    <form noValidate onSubmit={handleSubmit(submitFoodHandler)}>
                      <div className="mb-4">
                        <label htmlFor="foodName" className="block">
                          Nama Makanan
                        </label>
                        <input
                          type="text"
                          {...register("foodName", {
                            required: "Masukkan nama makanan",
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
                            required:
                              "Masakan deskripsi tambahan untuk makanan",
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
                            Sangat mudah basi (dapat bertahan 1-2 hari)
                          </option>
                          <option value={2}>
                            Mudah basi (dapat bertahan lebih dari 2 hari)
                          </option>
                          <option value={3}>
                            Tidak mudah basi (dapat bertahan lebih dari 1 bulan)
                          </option>
                        </select>
                        <a
                          href="https://www.foodsafety.gov/keep-food-safe/foodkeeper-app"
                          target="_blank"
                          rel="noopener"
                        >
                          <p className="text-blue-500 underline mt-2">
                            Pelajari lebih lanjut tentang rentang waktu simpan
                            makanan
                          </p>
                        </a>
                      </div>

                      <div className="mb-4">
                        <label htmlFor="foodName" className="block">
                          Berat Makanan (opsional)
                        </label>
                        <input
                          type="number"
                          {...register("foodWeight", {
                            min: 0,
                          })}
                          id="foodWeight"
                          placeholder="300"
                          className="w-1/5 border-2 p-2 rounded-lg mt-1"
                        ></input>
                        <span className="ml-2">Gram</span>
                        {errors.foodWeight && (
                          <div className="text-red-500">
                            {errors.foodWeight.message}
                          </div>
                        )}
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
                                capture="environment"
                                {...register("foodImages", {
                                  required: "Silakan unggah satu gambar",
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
