import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { getDocs, collection, where, query } from "firebase/firestore";

import FoodCard from "../../components/Card/FoodCard";
import ShareFoodButton from "../../components/Button/ShareFoodButton";
import SkeletonFoodCard from "../../components/Card/SkeletonFoodCard";

import { db } from "../../utils/firebaseconfig";
import { UserLocation } from "../../context/LocationContext";
import { UserAuth } from "../../context/AuthContext";
import FabButton from "../../components/Button/FabButton";

const DashboardPage = () => {
  const [allFoodData, setAllFoodData] = useState([]);
  const { userLocation } = UserLocation();
  const { user, userAuthLoading } = UserAuth();
  const [foodFetchLoading, setFoodFetchLoading] = useState(true);
  const skeletonPlaceholder = Array(8).fill(0);

  useEffect(() => {

    let unmounted = false; // flag to set if component if unmounted then rebort fetch

    const getAllFoodCollection = () => {
      const allFoodCollectionQuery = query(
        collection(db, "food"),
        where("giverId", "!=", user?.uid)
      );
      getDocs(allFoodCollectionQuery)
        .then((allFoodCollectionSnapshot) => {
          if (unmounted) return;

          if (allFoodCollectionSnapshot.docs.length > 0) {
            const availableFood = allFoodCollectionSnapshot.docs
              .filter((doc) => doc.data().foodStatus === "available")
              .map((foodData) => {
                return { id: foodData.id, ...foodData.data() };
              });

            setAllFoodData(availableFood);
            setFoodFetchLoading(false);
          } else {
            setAllFoodData([]);
            setFoodFetchLoading(false);
          }
        })
        .catch((err) => {
          // error handling toastass
          console.log(err);
        });
    };

    // add firebase messaging service to service worker
    if ("serviceWorker" in navigator) {
      window.addEventListener("load", function () {
        this.navigator.serviceWorker.register("../../firebase-messaging-sw.js");
      });
    }

    if (!userAuthLoading) {
      getAllFoodCollection();
    }

    getAllFoodCollection();
    return () => {
      unmounted = true;
    };
  }, [userAuthLoading]);

  console.log(allFoodData);

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

      {/* <ShareFoodButton /> */}
      <FabButton />
    </>
  );
};

export default DashboardPage;
