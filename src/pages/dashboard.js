import React, { useEffect, useState } from "react";
import Link from "next/link";
import FoodCard from "../../components/Card/FoodCard";
import ShareFoodButton from "../../components/Button/ShareFoodButton";
import { db, storage } from "../../utils/firebaseconfig";
import { getDocs, collection } from "firebase/firestore";
import SkeletonFoodCard from "../../components/Card/SkeletonFoodCard";
import { UserLocation } from "../../context/LocationContext";

const DashboardPage = () => {
  const [allFoodData, setAllFoodData] = useState([]);
  const { userLocation } = UserLocation();
  const [foodFetchLoading, setFoodFetchLoading] = useState(true);
  const skeletonPlaceholder = Array(8).fill(0);

  useEffect(() => {
    console.log("mounted");
    let unmounted = false; // flag to set if component if unmounted then rebort fetch
    const allFoodCollectionRef = collection(db, "allfood");

    const getAllFoodCollection = () => {
      getDocs(allFoodCollectionRef)
        .then((allFoodCollectionSnapshot) => {
          if (unmounted) return;

          if (allFoodCollectionSnapshot.docs.length > 0) {
            const newData = allFoodCollectionSnapshot.docs.map((doc) => {
              return { id: doc.id, ...doc.data() };
            });
            setAllFoodData(newData);
            setFoodFetchLoading(false);
          } else {
            setAllFoodData([]);
            setFoodFetchLoading(false);
          }
        })
        .catch((err) => {
          // error handling toast
          console.log(err);
        });
    };

    // add firebase messaging service to service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        this.navigator.serviceWorker.register("../../firebase-messaging-sw.js");
      });
    }

    getAllFoodCollection();

    return () => {
      console.log("unmounted");
      unmounted = true;
    };
  }, []);

  return (
    <>
      <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 lg:gap-y-6">
        {foodFetchLoading
          ? skeletonPlaceholder.map((_, id) => <SkeletonFoodCard key={id} />)
          : allFoodData.map((food) => (
              <Link href={`/food/${food.id}`}>
                <FoodCard key={food.id} {...food} />
              </Link>
            ))}
      </div>

      <ShareFoodButton />
      {userLocation.longitude === 0 ? (
        <h1>Denied</h1>
      ) : (
        <h1>{userLocation.latitude}</h1>
      )}
    </>
  );
};

export default DashboardPage;
