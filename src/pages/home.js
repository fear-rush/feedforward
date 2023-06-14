import React, { useEffect } from "react";
import Link from "next/link";

import { UserAuth } from "../../context/AuthContext";
import { useLocation } from "../../hooks/useLocation";

import {
  ExclamationTriangleIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";

import { useQuery } from "@tanstack/react-query";

import FabButton from "../../components/Button/FabButton";
import FoodCard from "../../components/Card/FoodCard";
import SkeletonFoodCard from "../../components/Card/SkeletonFoodCard";
import { getIdToken } from "firebase/auth";
import ArticleSlider from "../../components/Slider/ArticleSlider";
import HomeLeaderboard from "../../components/Leaderboard/HomeLeaderboard";
import { useNotification } from "../../hooks/useNotification";
import axios from "axios";

const HomePage = () => {
  const { user } = UserAuth();
  const skeletonPlaceholder = Array(4).fill(0);

  const {
    isError: isLocationError,
    data: locationData,
    isLoading: isLocationLoading,
  } = useLocation();

  const {
    isError: isNotificationError,
    isLoading: isNotificationLoading,
    error: notificationError,
  } = useNotification(user?.uid);

  const {
    data: allFoodData = [],
    isLoading: isAllFoodLoading,
    error: isAllFoodError,
    error,
  } = useQuery({
    queryKey: ["foodList"],
    queryFn: async () => {
      try {
        const userToken = await getIdToken(user);
        // const response = await axios.get(
        //   `${process.env.PROD_URL}/getFood?lat=${locationData.latitude}&lng=${locationData.longitude}`,
        //   {
        //     headers: {
        //       Authorization: `Bearer ${userToken}`,
        //     },
        //   }
        // );
        const response = await axios.get(
          `https://asia-southeast2-feed-forward-187f4.cloudfunctions.net/app/api/getFood?lat=${locationData.latitude}&lng=${locationData.longitude}`,
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
        return {
          foodData,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    // Query will not execute until locationData exists
    enabled: !!locationData,
  });


  if (isLocationError || isAllFoodError || isNotificationError) {
    return (
      <div className="w-full h-screen px-6">
        <ExclamationTriangleIcon className="h-20 w-20 mt-16 text-yellow-300 mx-auto" />
        <p className="text-center text-gray-700 text-lg">
          Galat terjadi. Dimohon untuk mengaktifkan perizinan lokasi dan
          notifikasi agar web bisa berjalan. Jika masih muncul pemberitahuan
          galat silakan cek koneksi internet anda dan muat ulang halaman ini
          atau gunakan Google Chrome.{" "}
          {isLocationError
            ? "Error Location Disabled"
            : isNotificationError
            ? notificationError.message
            : error.message}
        </p>
        <FabButton />
      </div>
    );
  }

  return (
    <>
      <ArticleSlider />
      <div className="mx-6 md:mx-10 ">
        <HomeLeaderboard />
      </div>
      <div className="grid justify-items-center grid-cols-1 gap-x-4 gap-y-12 md:gap-y-6">
        <h1 className="mt-4 font-medium text-lg">
          Makanan Tersedia di Sekitar Anda
        </h1>
        {isAllFoodLoading || isLocationLoading ? (
          skeletonPlaceholder?.map((_, id) => <SkeletonFoodCard key={id} />)
        ) : allFoodData?.foodData?.length > 0 ? (
          allFoodData?.foodData?.map((food) => (
            <Link key={food.id} href={`/food/${food.id}`}>
              <FoodCard key={food.id} {...food} />
            </Link>
          ))
        ) : (
          <div className="text-center px-8">
            <TrashIcon className="w-14 h-14 text-black mx-auto" />
            <p className="text-gray-700 mt-4 text-lg">
              Belum ada makanan tersedia di sekitar anda. Ingin mencoba untuk
              berbagi makanan? tekan tombol bagikan makanan untuk mulai berbagi
            </p>
          </div>
        )}
      </div>
      <FabButton />
    </>
  );
};

export default HomePage;
