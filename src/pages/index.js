import { forwardRef, useEffect, useState, useRef } from "react";
import { getFcmToken } from "utils/firebase-get-token";
import Layout from "components/Layout";
import { useForm, Controller } from "react-hook-form";
import { db, storage } from "../../utils/firebaseconfig";
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
export default function Home() {
  const [foodData, setFoodData] = useState([]);
  const [isPermissionGranted, setIsPermissionGranted] = useState(false);
  const [rangeSliderValue, setRangeSliderValue] = useState(5);
  const [userLocation, setUserLocation] = useState({
    latitude: 0,
    longitude: 0,
  });
  
  const [imageDownloadURL, setImageDownloadURL] = useState([]);

  // imageListRef disesuaikan sama document id
  // 1. await addDoc
  // 2. get doc.id()
  // 3. upload image based on id
  // 4  updateDoc on imageUrl properties
  // 5. done

  const { user, logOut } = UserAuth();
  const router = useRouter();

  const {
    handleSubmit,
    register,
    formState: { errors },
    control,
  } = useForm();

  const submitHandler = async (data) => {
    const geofire = require("geofire-common");
    const foodCollectionRef = collection(db, "user", user.uid, "food");
    const latitude = Number(data.latitude);
    const longitude = Number(data.longitude);
    const hash = geofire.geohashForLocation([latitude, longitude]);
    const uploadImages = Object.values(data.images);

    try {
      const foodSnapshot = await addDoc(foodCollectionRef, {
        foodTitle: data.foodTitle,
        foodDescription: data.foodDescription,
        dateAdded: Timestamp.fromDate(new Date()),
        expiredDate: data.expiredDate,
        foodStatus: "available",
        giver: user.displayName,
        giverId: user.uid,
        locationName: data.locationName,
        geohash: hash,
        latitude: latitude,
        longitude: longitude,
      });

      if (foodSnapshot.id) {
        await Promise.all(
          uploadImages.map((img) => {
            const imageRef = ref(
              storage,
              `images/${foodSnapshot.id}/${img.name}`
            );
            uploadBytes(imageRef, img)
              .then(async () => {
                const downloadURL = await getDownloadURL(imageRef);
                setImageDownloadURL((prevURL) => [...prevURL, downloadURL]);
              })
              .catch((err) => {
                console.log(err);
              });
          })
        );
        console.log(imageDownloadURL);
        await setDoc(doc(db, "allfood", foodSnapshot.id), {
          foodTitle: data.foodTitle,
          foodDescription: data.foodDescription,
          dateAdded: Timestamp.fromDate(new Date()),
          expiredDate: data.expiredDate,
          foodStatus: "available",
          giver: user.displayName,
          giverId: user.uid,
          locationName: data.locationName,
          geohash: hash,
          latitude: latitude,
          longitude: longitude,
          images: imageDownloadURL,
        });
        await updateDoc(doc(db, "user", user.uid, "food", foodSnapshot.id), {
          images: imageDownloadURL,
        });
        setFoodData([
          {
            foodTitle: data.foodTitle,
            foodDescription: data.foodDescription,
            dateAdded: Timestamp.fromDate(new Date()),
            expiredDate: data.expiredDate,
            foodStatus: "available",
            giver: user.displayName,
            giverId: user.uid,
            locationName: data.locationName,
            geohash: hash,
            latitude: latitude,
            longitude: longitude,
            images: imageDownloadURL,
          },
          ...foodData,
        ]);
      } else {
        // add error handling if setting document failed
        console.log("Error on add document");
      }
      console.log(`ini foodSnapshot ${JSON.stringify(foodSnapshot.id)}`);
    } catch (err) {
      console.log(err);
    }
  };

  const topicSubscribeHandler = async () => {
    if (isPermissionGranted) {
      alert("Already subscribe to topic");
    } else {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          const t = await getFcmToken();
          console.log(t);
          const res = await fetch("api/topicsubscribe", {
            method: "POST",
            body: JSON.stringify({
              token: t,
              topic: "food",
            }),
          });
          const data = await res.json();
          console.log(data);
        }
        setIsPermissionGranted(true);
      } catch (err) {
        setIsPermissionGranted(false);
        console.log(err);
      }
    }
  };

  const filterByRangeHandler = async () => {
    console.log(rangeSliderValue);
    // setRangeSliderValue(rangeSliderRef.current.value);
    const geofire = require("geofire-common");

    const center = [userLocation.latitude, userLocation.longitude];
    // const center = [-7.798676243221753, 110.3927648451548];
    const radiusInM = rangeSliderValue * 1000;

    const bounds = geofire.geohashQueryBounds(center, radiusInM);
    const locationSnapshot = [];
    for (const b of bounds) {
      const q = query(
        collection(db, "allfood"),
        orderBy("geohash"),
        startAt(b[0]),
        endAt(b[1])
      );

      const querySnapshot = await getDocs(q);
      querySnapshot.forEach((doc) => {
        const lat = doc.data().latitude;
        const lng = doc.data().longitude;
        const distanceInKm = geofire.distanceBetween([lat, lng], center);
        const distanceInM = distanceInKm * 1000;
        if (distanceInM <= radiusInM) {
          locationSnapshot.push(doc.data());
          console.log(`${doc.id} => ${doc.data().locationName}`);
        }
      });
    }
  };
  useEffect(() => {
    // const getFoodCollection = async () => {
    //   try {
    //     const userDocRef = doc(db, "user", user.uid);
    //     const userDocSnap = await getDoc(userDocRef);
    //     if (userDocSnap.exists()) {
    //       const foodCollectionRef = collection(db, "user", user.uid, "food");
    //       const foodSnapshot = await getDocs(foodCollectionRef);
    //       let foodList = [];
    //       foodSnapshot.forEach((food) => {
    //         foodList.push(food.data());
    //       });
    //       setFoodData(foodList);
    //     }
    //   } catch (err) {
    //     console.log(err);
    //   }
    // };

    const getAllFoodCollection = async () => {
      try {
        const allFoodCollectionRef = collection(db, "allfood");
        const allFoodSnapshot = await getDocs(allFoodCollectionRef);
        if (allFoodSnapshot.docs.length > 0) {
          let foodList = [];
          allFoodSnapshot.forEach((food) => {
            foodList.push(food.data());
          });
          setFoodData(foodList);
          // error handler if empty
        } else {
          setFoodData([]);
        }
      } catch (err) {
        console.log(err);
      }
    };

    const getUserLocation = () => {
      const getLocationSuccess = (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      };

      const getLocationError = () => {
        alert("Unable to retrieve your location");
      };

      if (!navigator.geolocation) {
        // add error handler on geolocation not supported by browser
        alert("Geolocation is not supported by your browser");
      } else {
        // add loader to wait get current position
        navigator.geolocation.getCurrentPosition(
          getLocationSuccess,
          getLocationError
        );
      }
    };

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        navigator.serviceWorker.register("../../firebase-messaging-sw.js");
      });
    }

    if (user.uid) {
      getAllFoodCollection();
      getUserLocation();
    }
  }, [user]);
  return (
    <>
      <Layout>
        <h1 className="text-lg font-bold">Notification Example</h1>
        <form noValidate onSubmit={handleSubmit(submitHandler)}>
          <div>
            <input
              type="text"
              {...register("foodTitle", {
                required: "Please enter a food title",
              })}
              id="foodTitle"
              placeholder="foodTitle"
              className="border-2 border-blue-500"
            ></input>
            {errors.foodTitle && (
              <div className="text-red-500">{errors.foodTitle.message}</div>
            )}
          </div>
          <div>
            <input
              type="foodDescription"
              {...register("foodDescription", {
                required: "Please enter a food description",
              })}
              id="foodDescription"
              placeholder="foodDescription"
              className="mt-2 border-2 border-blue-500"
            ></input>
            {errors.foodDescription && (
              <div className="text-red-500">
                {errors.foodDescription.message}
              </div>
            )}
          </div>
          <div className="mt-4">
            <input
              type="text"
              {...register("locationName", {
                required: "Please enter a valid locationName",
              })}
              id="locationName"
              placeholder="locationName"
              className="border-2 border-blue-500"
            ></input>
            {errors.locationName && (
              <div className="text-red-500">{errors.locationName.message}</div>
            )}
          </div>
          <div>
            <input
              type="text"
              {...register("latitude", {
                required: "Please enter a valid latitude",
              })}
              id="latitude"
              placeholder="latitude"
              className="border-2 border-blue-500"
            ></input>
            {errors.latitude && (
              <div className="text-red-500">{errors.latitude.message}</div>
            )}
          </div>
          <div>
            <input
              type="longitude"
              {...register("longitude", {
                required: "Please enter a valid longitude",
              })}
              id="longitude"
              placeholder="longitude"
              className="mt-2 border-2 border-blue-500"
            ></input>
            {errors.longitude && (
              <div className="text-red-500">{errors.longitude.message}</div>
            )}
          </div>
          <div>
            <Controller
              control={control}
              name="expiredDate"
              render={({ field: { onChange, value } }) => (
                <DatePicker
                  selected={value}
                  onChange={onChange}
                  dateFormat="dd MMMM yyyy"
                  placeholderText="Select Expired Date"
                  className="border-2 border-red-500"
                  minDate={new Date()}
                />
              )}
            />
          </div>
          <input
            type="file"
            multiple
            {...register("images", {
              required: "Please upload at least one image",
            })}
            id="images"
            className="mt-2"
          ></input>
          {errors.images && (
            <div className="text-red-500">{errors.images.message}</div>
          )}

          <button className="border-2 border-red-500 mt-2 cursor-pointer">
            Submit
          </button>
        </form>
        <button
          onClick={topicSubscribeHandler}
          className="mt-6 border-2 border-yellow-500"
        >
          {isPermissionGranted
            ? "UNSUBSCRIBE FROM TOPIC"
            : "SUBSCRIBE TO TOPIC"}
        </button>
        <div className="mt-6">
          {foodData.map((food, index) => (
            <div className="mt-2" key={index}>
              <h1>{food.foodTitle}</h1>
              <h1>{food.foodDescription}</h1>
              <h1>{food.locationName}</h1>
            </div>
          ))}
        </div>
        <div>
          <input
            type="range"
            min="5"
            max="50"
            defaultValue={rangeSliderValue}
            className="ml-10"
            onChange={(e) => setRangeSliderValue(e.target.value)}
          ></input>
        </div>
        <h1>{rangeSliderValue}</h1>
        {userLocation.latitude !== 0 ? (
          <h1>
            {userLocation.latitude} & {userLocation.longitude}
          </h1>
        ) : (
          <h1>Kosong</h1>
        )}
        <button
          type="button"
          className="bg-yellow-500 ml-6 cursor-pointer"
          onClick={filterByRangeHandler}
        >
          Submit Range
        </button>

        <button
          className="mt-6 border-2 border-blue-500"
          type="button"
          onClick={() => {
            logOut();
            router.push("/signin");
          }}
        >
          LOGOUT
        </button>
      </Layout>
    </>
  );
}
