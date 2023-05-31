import React from "react";
import Link from "next/link";
import { useEffect, useState } from "react";
import {
  getDocs,
  collection,
  where,
  query,
  startAfter,
  limit,
} from "firebase/firestore";
import { ToastContainer, toast } from "react-toastify";

import { UserAuth } from "../../context/AuthContext";
import { UserLocation } from "../../context/LocationContext";
import { useLocation } from "../../hooks/useLocation";
import { db } from "../../utils/firebaseconfig";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import FabButton from "../../components/Button/FabButton";
import FoodCard from "../../components/Card/FoodCard";
import SkeletonFoodCard from "../../components/Card/SkeletonFoodCard";
import "react-toastify/dist/ReactToastify.css";

const DashboardPage = () => {
  const queryClient = useQueryClient();
  // const [allFoodData, setAllFoodData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const { user } = UserAuth();
  const [foodFetchLoading, setFoodFetchLoading] = useState(true);
  const skeletonPlaceholder = Array(8).fill(0);

  // const fetchFoodDocuments = async (page = 0) => {
  //   const allFoodCollectionQuery = query(
  //     collection(db, "food"),
  //     where("giverId", "!=", user?.uid),
  //     limit(4),
  //     startAfter(page * 4)
  //   );

  // };

  const {
    isError: islocationError,
    data: locationData,
  } = useLocation();

  const {
    isLoading,
    isError,
    data: allFoodData,
    error,
    refetch,
  } = useQuery({
    queryKey: ["foodList"],
    queryFn: async () => {
      // add error handler

      console.log("here");

      if (!queryClient.getQueryData(["foodList"])) {
        const allFoodCollectionQuery = query(
          collection(db, "food"),
          where("giverId", "!=", user?.uid)
        );
        const allFoodDocuments = await getDocs(allFoodCollectionQuery);
        const foodData = allFoodDocuments.docs
          .filter((doc) => doc.data().foodStatus === "available")
          .map((food) => {
            return { id: food.id, ...food.data() };
          });
        return foodData;
      }
    },
    // Query will not execute until locationData exists
    enabled: !!locationData
  });


  if (islocationError) {
    return <h1>Location Error...</h1>
  }

  

  // console.log(`ini error ${isError}`);

  // console.log(queryClient.getQueryCache())
  // console.log(queryClient.getQueryData(["foodList"]));

  // useEffect(() => {
  //   let unmounted = false; // flag to set if component if unmounted then rebort fetch

  //   const getAllFoodCollection = () => {
  //     const allFoodCollectionQuery = query(
  //       collection(db, "food"),
  //       where("giverId", "!=", user?.uid)
  //     );
  //     getDocs(allFoodCollectionQuery)
  //       .then((allFoodCollectionSnapshot) => {
  //         if (unmounted) return;

  //         if (allFoodCollectionSnapshot.docs.length > 0) {
  //           const availableFood = allFoodCollectionSnapshot.docs
  //             .filter((doc) => doc.data().foodStatus === "available")
  //             .map((foodData) => {
  //               return { id: foodData.id, ...foodData.data() };
  //             });

  //           setAllFoodData(availableFood);
  //           setFoodFetchLoading(false);
  //         } else {
  //           setAllFoodData([]);
  //           setFoodFetchLoading(false);
  //         }
  //       })
  //       .catch((err) => {
  //         // error handling toastass
  //         console.log(err);
  //       });
  //   };

  //   // add firebase messaging service to service worker
  //   if ("serviceWorker" in navigator) {
  //     window.addEventListener("load", function () {
  //       this.navigator.serviceWorker.register("../../firebase-messaging-sw.js");
  //     });
  //   }

  //   if (!unmounted) {
  //     getAllFoodCollection();
  //   }

  //   return () => {
  //     unmounted = true;
  //     console.log(`food ${JSON.stringify(allFoodData)}`);
  //   };
  // }, [user?.uid]);

  return (
    <>
      <ToastContainer />
      {/* <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 lg:gap-y-6">
        {foodFetchLoading
          ? skeletonPlaceholder.map((_, id) => <SkeletonFoodCard key={id} />)
          : allFoodData.map((food) => (
              <Link key={food.id} href={`/food/${food.id}`}>
                <FoodCard key={food.id} {...food} />
              </Link>
            ))}
      </div> */}
      <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 lg:gap-y-6">
        {isLoading
          ? skeletonPlaceholder.map((_, id) => <SkeletonFoodCard key={id} />)
          : allFoodData.map((food) => (
              <Link key={food.id} href={`/food/${food.id}`}>
                <FoodCard key={food.id} {...food} />
              </Link>
            ))}
      </div>

      <div className="flex justify-center items-center mt-10">
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
          // onClick={handlePreviousPage}
          // disabled={isPreviousData || data.length < 4}
        >
          Prev Page
        </button>
        {/* <span className="text-gray-500 mx-4">Page {currentPage + 1}</span> */}
        <span className="text-gray-500 mx-4 border-2 border-blue-200 px-4 py-1.5 rounded-xl">
          1
        </span>
        <button
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
          // onClick={handleNextPage}
          // disabled={data.length < 4}
        >
          Next Page
        </button>
      </div>

      <FabButton />
    </>
  );
};

export default DashboardPage;
