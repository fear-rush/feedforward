import { forwardRef, useEffect, useState, useRef } from "react";
import { getFcmToken } from "utils/firebase-get-token";
import { useForm, Controller } from "react-hook-form";
import { db, storage } from "../../utils/firebaseconfig";
import Link from "next/link";
import {
  doc,
  getDocs,
  collection,
  addDoc,
  setDoc,
  getDoc,
  query,
  orderBy,
  startAt,
  endAt,
  Timestamp,
  updateDoc,
  where,
  limit,
} from "firebase/firestore";
import {
  ref,
  uploadBytes,
  getDownloadURL,
  listAll,
  list,
} from "firebase/storage";
import { UserAuth } from "context/AuthContext";
import { useRouter } from "next/router";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import {
  ArchiveBoxIcon,
  CheckCircleIcon,
  GiftIcon,
} from "@heroicons/react/24/outline";
import Image from "next/image";

import hero from "../../public/hero.png"

export default function Home() {
  // const [foodData, setFoodData] = useState([]);
  // const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  // const [rangeSliderValue, setRangeSliderValue] = useState(5);
  // const [userLocation, setUserLocation] = useState({
  //   latitude: 0,
  //   longitude: 0,
  // });

  // const [imageDownloadURL, setImageDownloadURL] = useState([]);

  // const { user, logOut } = UserAuth();
  // const router = useRouter();

  // const {
  //   handleSubmit,
  //   register,
  //   formState: { errors, formState },
  //   control,
  // } = useForm();

  // const submitHandler = async (data) => {
  //   const geofire = require("geofire-common");
  //   const foodCollectionRef = collection(db, "user", user.uid, "food");
  //   const latitude = Number(data.latitude);
  //   const longitude = Number(data.longitude);
  //   const hash = geofire.geohashForLocation([latitude, longitude]);
  //   const uploadImages = Object.values(data.images);

  //   try {
  //     const foodSnapshot = await addDoc(foodCollectionRef, {
  //       foodTitle: data.foodTitle,
  //       foodDescription: data.foodDescription,
  //       dateAdded: Timestamp.fromDate(new Date()),
  //       expiredDate: data.expiredDate,
  //       foodStatus: "available",
  //       giver: user.displayName,
  //       giverId: user.uid,
  //       locationName: data.locationName,
  //       geohash: hash,
  //       latitude: latitude,
  //       longitude: longitude,
  //     });

  //     if (foodSnapshot.id) {
  //       await Promise.all(
  //         uploadImages.map((img) => {
  //           const imageRef = ref(
  //             storage,
  //             `images/${foodSnapshot.id}/${img.name}`
  //           );
  //           uploadBytes(imageRef, img)
  //             .then(async () => {
  //               const downloadURL = await getDownloadURL(imageRef);
  //               setImageDownloadURL((prevURL) => [...prevURL, downloadURL]);
  //             })
  //             .catch((err) => {
  //               console.log(err);
  //             });
  //         })
  //       );
  //       console.log(imageDownloadURL);
  //       await setDoc(doc(db, "allfood", foodSnapshot.id), {
  //         foodTitle: data.foodTitle,
  //         foodDescription: data.foodDescription,
  //         dateAdded: Timestamp.fromDate(new Date()),
  //         expiredDate: data.expiredDate,
  //         foodStatus: "available",
  //         giver: user.displayName,
  //         giverId: user.uid,
  //         locationName: data.locationName,
  //         geohash: hash,
  //         latitude: latitude,
  //         longitude: longitude,
  //         images: imageDownloadURL,
  //       });
  //       await updateDoc(doc(db, "user", user.uid, "food", foodSnapshot.id), {
  //         images: imageDownloadURL,
  //       });
  //       setFoodData([
  //         {
  //           foodTitle: data.foodTitle,
  //           foodDescription: data.foodDescription,
  //           dateAdded: Timestamp.fromDate(new Date()),
  //           expiredDate: data.expiredDate,
  //           foodStatus: "available",
  //           giver: user.displayName,
  //           giverId: user.uid,
  //           locationName: data.locationName,
  //           geohash: hash,
  //           latitude: latitude,
  //           longitude: longitude,
  //           images: imageDownloadURL,
  //         },
  //         ...foodData,
  //       ]);
  //     } else {
  //       // add error handling if setting document failed
  //       console.log("Error on add document");
  //     }
  //     console.log(`ini foodSnapshot ${JSON.stringify(foodSnapshot.id)}`);
  //   } catch (err) {
  //     console.log(err);
  //   }
  // };

  // const topicSubscribeHandler = async () => {
  //   if (isPermissionGranted) {
  //     alert("Already subscribe to topic");
  //   } else {
  //     try {
  //       const permission = await Notification.requestPermission();
  //       if (permission === "granted") {
  //         const t = await getFcmToken();
  //         console.log(t);
  //         const res = await fetch("api/topicsubscribe", {
  //           method: "POST",
  //           body: JSON.stringify({
  //             token: t,
  //             topic: "food",
  //           }),
  //         });
  //         const data = await res.json();
  //         console.log(data);
  //       }
  //       setIsPermissionGranted(true);
  //     } catch (err) {
  //       setIsPermissionGranted(false);
  //       console.log(err);
  //     }
  //   }
  // };

  // const filterByRangeHandler = async () => {
  //   console.log(rangeSliderValue);
  //   // setRangeSliderValue(rangeSliderRef.current.value);
  //   const geofire = require("geofire-common");

  //   const center = [userLocation.latitude, userLocation.longitude];
  //   // const center = [-7.798676243221753, 110.3927648451548];
  //   const radiusInM = rangeSliderValue * 1000;

  //   console.log(userLocation.latitude);
  //   console.log(userLocation.longitude);

  //   const bounds = geofire.geohashQueryBounds(center, radiusInM);
  //   console.log(bounds);
  //   const locationSnapshot = [];
  //   const locationWithoutSnapshot = [];
  //   for (const b of bounds) {
  //     const q = query(
  //       collection(db, "food"),
  //       where("foodStatus", "==", "available"),
  //       orderBy("geohash"),
  //       startAt(b[0]),
  //       endAt(b[1])
  //     );

  //     // const querySnapshot = await getDocs(q);
  //     // console.log(b);
  //     // querySnapshot.forEach((doc) => {
  //     //   const lat = doc.data().latitude;
  //     //   const lng = doc.data().longitude;
  //     //   const distanceInKm = geofire.distanceBetween([lat, lng], center);
  //     //   const distanceInM = distanceInKm * 1000;
  //     //   console.log(doc.data().pickupAddress + distanceInM);
  //     // });

  //     const querySnapshot = await getDocs(q);
  //     querySnapshot.forEach((doc) => {
  //       if (doc.data().giverId !== user.uid) {
  //         const lat = doc.data().latitude;
  //         const lng = doc.data().longitude;
  //         const distanceInKm = geofire.distanceBetween([lat, lng], center);
  //         const distanceInM = distanceInKm * 1000;
  //         if (distanceInM <= radiusInM) {
  //           locationSnapshot.push(doc.data());
  //           console.log(`${doc.id} => ${doc.data().foodName} ${distanceInM}`);
  //         } else {
  //           console.log(
  //             `${doc.id} => ${doc.data().foodName} normal ${distanceInM}`
  //           );
  //         }
  //       }
  //     });
  //   }
  // };

  // useEffect(() => {
  //   // const getFoodCollection = async () => {
  //   //   try {
  //   //     const userDocRef = doc(db, "user", user.uid);
  //   //     const userDocSnap = await getDoc(userDocRef);
  //   //     if (userDocSnap.exists()) {
  //   //       const foodCollectionRef = collection(db, "user", user.uid, "food");
  //   //       const foodSnapshot = await getDocs(foodCollectionRef);
  //   //       let foodList = [];
  //   //       foodSnapshot.forEach((food) => {
  //   //         foodList.push(food.data());
  //   //       });
  //   //       setFoodData(foodList);
  //   //     }
  //   //   } catch (err) {
  //   //     console.log(err);
  //   //   }
  //   // };

  //   const getAllFoodCollection = async () => {
  //     try {
  //       const allFoodCollectionRef = collection(db, "allfood");
  //       const allFoodSnapshot = await getDocs(allFoodCollectionRef);
  //       if (allFoodSnapshot.docs.length > 0) {
  //         let foodList = [];
  //         allFoodSnapshot.forEach((food) => {
  //           foodList.push(food.data());
  //         });
  //         setFoodData(foodList);
  //         // error handler if empty
  //       } else {
  //         setFoodData([]);
  //       }
  //     } catch (err) {
  //       console.log(err);
  //     }
  //   };

  //   const getUserLocation = () => {
  //     const getLocationSuccess = (position) => {
  //       setUserLocation({
  //         latitude: position.coords.latitude,
  //         longitude: position.coords.longitude,
  //       });
  //     };

  //     const getLocationError = () => {
  //       alert("Unable to retrieve your location");
  //     };

  //     if (!navigator.geolocation) {
  //       alert("Geolocation is not supported by your browser");
  //     } else {
  //       navigator.geolocation.getCurrentPosition(
  //         getLocationSuccess,
  //         getLocationError
  //       );
  //     }
  //   };

  //   if ("serviceWorker" in navigator) {
  //     window.addEventListener("load", function () {
  //       navigator.serviceWorker.register("../../firebase-messaging-sw.js");
  //     });
  //   }

  //   if (user.uid) {
  //     getAllFoodCollection();
  //     getUserLocation();
  //   }
  // }, [user]);

  return (
    <>
      <section class="bg-gradient-to-r from-green-200 via-green-400 to-green-500 px-4 lg:px-0">
        <div class="grid max-w-screen-xl px-4 py-8 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <div class="mr-auto place-self-center lg:col-span-7">
            <h1 class="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl">
              Giving and Receiving Goodness
            </h1>
            <p class="max-w-2xl mb-6 font-light text-gray-700 lg:mb-8 md:text-lg lg:text-xl">
              Berbagi makanan berlebih kepada mereka yang membutuhkan untuk
              membantu mengurangi sampah makanan
            </p>

            <Link href="/signin">
              <button class="inline-flex items-center justify-center px-5 py-3 mr-3 text-base font-medium text-center text-black rounded-lg bg-white hover:bg-gray-100 focus:ring-4 focus:ring-primary-300">
                Mulai Berbagi
                <svg
                  class="w-5 h-5 ml-2 -mr-1"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                    clip-rule="evenodd"
                  ></path>
                </svg>
              </button>
            </Link>
          </div>
          <div class="hidden relative lg:mt-0 lg:col-span-5 lg:flex">
            <Image 
              src={hero}

            />
            {/* <img
              src={hero}
              alt="Hero PNG From Freepik"
            /> */}
          </div>
        </div>
      </section>

      <section class="mx-auto py-24 bg-white overflow-hidden">
        <div class="container max-w-screen-xl px-4 mx-auto">
          <div class="max-w-xl text-center mx-auto mb-20">
            <h1 class="mb-5 text-5xl lg:text-6xl tracking-tighter font-semibold">
              Cara Kerja FeedForward
            </h1>
            <p class="text-xl tracking-tight font-light">
              Dengan FeedForward anda bisa memberi dan menerima makanan. Pemberi
              adalah pihak pemberi makanan dan penerima adalah pihak penerima
              makanan
            </p>
          </div>
          <div class="flex flex-wrap -m-7 mb-14">
            <div class="w-full md:w-1/3 p-7">
              <div class="max-w-xs">
                <GiftIcon className="w-12 h-12 mb-4" />
                <h3 class="mb-4 text-xl font-semibold tracking-tight">
                  Bagi makanan
                </h3>
                <p class="text-gray-600 tracking-tight">
                  Pemberi membagikan makanan dengan mengisi keterangan makanan
                  yang akan dibagikan. Setiap membagi makanan akan mendapatkan
                  poin
                </p>
              </div>
            </div>
            <div class="w-full md:w-1/3 p-7">
              <div class="max-w-xs">
                <ArchiveBoxIcon className="w-12 h-12 mb-4" />
                <h3 class="mb-4 text-xl font-semibold tracking-tight">
                  Penerima mengambil makanan
                </h3>
                <p class="text-gray-600 tracking-tight">
                  Makanan yang dibagi oleh pembagi otomatis akan ditampilkan
                  kepada penerima dengan jarak terdekat. Ketika penerima
                  mengambil makanan, pemberi mendapatkan notifikasi pengambilan
                  makanan
                </p>
              </div>
            </div>
            <div class="w-full md:w-1/3 p-7">
              <div class="max-w-xs">
                <CheckCircleIcon className="w-12 h-12 mb-4" />
                <h3 class="mb-4 text-xl font-semibold tracking-tight">
                  Konfirmasi pengambilan makanan
                </h3>
                <p class="text-gray-600 tracking-tight">
                  Setelah penerima selesai mengambil makanan. Penerima
                  mengonfirmasi pengambilan makanan
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

// <h1 className="text-lg font-bold">Notification Example</h1>
//       <form noValidate onSubmit={handleSubmit(submitHandler)}>
//         <div>
//           <input
//             type="text"
//             {...register("foodTitle", {
//               required: "Please enter a food title",
//             })}
//             id="foodTitle"
//             placeholder="foodTitle"
//             className="border-2 border-blue-500"
//           ></input>
//           {errors.foodTitle && (
//             <div className="text-red-500">{errors.foodTitle.message}</div>
//           )}
//         </div>
//         <div>
//           <input
//             type="foodDescription"
//             {...register("foodDescription", {
//               required: "Please enter a food description",
//             })}
//             id="foodDescription"
//             placeholder="foodDescription"
//             className="mt-2 border-2 border-blue-500"
//           ></input>
//           {errors.foodDescription && (
//             <div className="text-red-500">{errors.foodDescription.message}</div>
//           )}
//         </div>
//         <div className="mt-4">
//           <input
//             type="text"
//             {...register("locationName", {
//               required: "Please enter a valid locationName",
//             })}
//             id="locationName"
//             placeholder="locationName"
//             className="border-2 border-blue-500"
//           ></input>
//           {errors.locationName && (
//             <div className="text-red-500">{errors.locationName.message}</div>
//           )}
//         </div>
//         <div>
//           <input
//             type="text"
//             {...register("latitude", {
//               required: "Please enter a valid latitude",
//             })}
//             id="latitude"
//             placeholder="latitude"
//             className="border-2 border-blue-500"
//           ></input>
//           {errors.latitude && (
//             <div className="text-red-500">{errors.latitude.message}</div>
//           )}
//         </div>
//         <div>
//           <input
//             type="longitude"
//             {...register("longitude", {
//               required: "Please enter a valid longitude",
//             })}
//             id="longitude"
//             placeholder="longitude"
//             className="mt-2 border-2 border-blue-500"
//           ></input>
//           {errors.longitude && (
//             <div className="text-red-500">{errors.longitude.message}</div>
//           )}
//         </div>
//         <div>
//           <Controller
//             control={control}
//             name="expiredDate"
//             render={({ field: { onChange, value } }) => (
//               <DatePicker
//                 selected={value}
//                 onChange={onChange}
//                 dateFormat="dd MMMM yyyy"
//                 placeholderText="Select Expired Date"
//                 className="border-2 border-red-500"
//                 minDate={new Date()}
//               />
//             )}
//           />
//         </div>
//         <input
//           type="file"
//           multiple
//           {...register("images", {
//             required: "Please upload at least one image",
//           })}
//           id="images"
//           className="mt-2"
//         ></input>
//         {errors.images && (
//           <div className="text-red-500">{errors.images.message}</div>
//         )}

//         <button className="border-2 border-red-500 mt-2 cursor-pointer">
//           Submit
//         </button>
//       </form>
//       <button
//         onClick={topicSubscribeHandler}
//         className="mt-6 border-2 border-yellow-500"
//       >
//         {isPermissionGranted ? "UNSUBSCRIBE FROM TOPIC" : "SUBSCRIBE TO TOPIC"}
//       </button>
//       <div className="mt-6">
//         {foodData.map((food, index) => (
//           <div className="mt-2" key={index}>
//             <h1>{food.foodTitle}</h1>
//             <h1>{food.foodDescription}</h1>
//             <h1>{food.locationName}</h1>
//           </div>
//         ))}
//       </div>
//       <div>
//         <input
//           type="range"
//           min="5"
//           max="50"
//           defaultValue={rangeSliderValue}
//           className="ml-10"
//           onChange={(e) => setRangeSliderValue(e.target.value)}
//         ></input>
//       </div>
//       <h1>{rangeSliderValue}</h1>
//       {userLocation.latitude !== 0 ? (
//         <h1>
//           {userLocation.latitude} & {userLocation.longitude}
//         </h1>
//       ) : (
//         <h1>Kosong</h1>
//       )}
//       <button
//         type="button"
//         className="bg-yellow-500 ml-6 cursor-pointer"
//         onClick={filterByRangeHandler}
//       >
//         Submit Range
//       </button>

//       <button
//         className="mt-6 border-2 border-blue-500"
//         type="button"
//         onClick={() => {
//           logOut();
//           router.push("/signin");
//         }}
//       >
//         LOGOUT
//       </button>
