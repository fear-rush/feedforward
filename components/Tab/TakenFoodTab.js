import React from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import axios from "axios";

import { getIdToken } from "firebase/auth";

import FabButton from "../Button/FabButton";
import OnProcessTakenCard from "../FoodStatusCard/FoodTakenCard/OnProcessTakenCard";
import SuccessTakenCard from "../FoodStatusCard/FoodTakenCard/SuccessTakenCard";
import SkeletonStatusFoodCard from "../Card/SkeletonStatusFoodCard";

const TakenFoodTab = ({ user }) => {
  const skeletonPlaceholder = Array(2).fill(0);

  const {
    data: takenFoodData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ["takenFoodList"],
    queryFn: async ({ pageParam = null }) => {
      try {
        const userToken = await getIdToken(user);
        const response = await axios.get(
          `${process.env.PROD_URL}/getTakenFood?pageParam=${pageParam}`,
          {
            headers: {
              Authorization: `Bearer ${userToken}`,
            },
          }
        );

        const res = response.data;

        if (res.status !== 200) {
          throw new Error(res.status);
        }
        const foodData = res.data;
        const takenFoodDocuments = res.takenFoodDocuments;

        return {
          foodData,
          nextCursor: takenFoodDocuments,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    getNextPageParam: (lastPage) => {
      return lastPage?.nextCursor ?? undefined;
    },
  });

  if (isError) {
    return (
      <div className="w-full h-screen px-6">
        <ExclamationTriangleIcon className="h-20 w-20 mt-16 text-yellow-300 mx-auto" />
        <p className="text-center text-gray-700 text-lg">
          Terjadi kegagalan pada sistem. {error.message}
        </p>
        <FabButton />
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <div>
          {skeletonPlaceholder.map((_, index) => (
            <SkeletonStatusFoodCard key={index} />
          ))}
        </div>
      ) : (
        <>
          {/* To Check if first page contain food data or not
            if empty then the user is not take any food yet
        */}
          {takenFoodData?.pages[0].foodData?.length > 0 ? (
            takenFoodData?.pages?.map((page, index) =>
              Array.from(page?.foodData).length > 0 && !isError ? (
                <React.Fragment key={index}>
                  {page?.foodData?.map((food) =>
                    food.foodStatus === "onprocess" ? (
                      <OnProcessTakenCard key={food.id} {...food} />
                    ) : (
                      <SuccessTakenCard key={food.id} {...food} />
                    )
                  )}
                </React.Fragment>
              ) : null
            )
          ) : (
            <div className="text-center px-8 mt-12">
              <TrashIcon className="w-14 h-14 text-black mx-auto" />
              <p className="text-gray-700 mt-4 text-lg">
                Tidak ada makanan yang diambil
              </p>
            </div>
          )}

          <div className="flex justify-center items-center mt-10">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-xl"
              onClick={fetchNextPage}
              disabled={!hasNextPage || isFetchingNextPage}
            >
              {isFetchingNextPage
                ? "Loading more..."
                : hasNextPage
                ? "Next Page"
                : "Nothing more to load"}
            </button>
          </div>
        </>
      )}
    </>
  );
};

export default TakenFoodTab;

