import { useState } from "react";
import { UserAuth } from "../../context/AuthContext";
import dynamic from "next/dynamic";

import { getIdToken } from "firebase/auth";
import { useQuery } from "@tanstack/react-query";
import LeaderboardSkeleton from "./LeaderboardSkeleton";
import axios from "axios";

const LeaderboardModal = dynamic(
  () => import("../Modal/LeaderboardModal/LeaderboardModal"),
  { ssr: false }
);

const HomeLeaderboard = () => {
  const { user } = UserAuth();
  const [isleaderboardModalOpen, setIsLeaderBoardModalOpen] = useState(false);

  const getUserStat = async () => {
    try {
      const userToken = await getIdToken(user);
      const res = await axios.get(`${process.env.PROD_URL}/getUserStat`, {
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      const userStat = res.data;
      if (userStat.status !== 200) {
        throw new Error(userStat.status);
      }
      return userStat.data;
    } catch (err) {
      throw new Error(err);
    }
  };
  const {
    isError,
    data: userStat,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["userStat"],
    queryFn: getUserStat,
  });

  if (isError) {
    return (
      <div className="text-center my-4">
        <h1>Terjadi kesalahan saat mengambil data pengguna</h1>
      </div>
    );
  }

  return (
    <>
      {isLoading ? (
        <LeaderboardSkeleton />
      ) : (
        <>
          <div className="grid h-[100px] bg-gray-100 grid-cols-3 md:grid-cols-4 content-center justify-items-center border-2 rounded-lg mt-4">
            <div className="flex flex-col items-center justify-center">
              <p className="text-xs md:text-sm font-medium ">
                {userStat?.pointStat?.username}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-center text-xs mb-1 font-medium">
                Makanan Dibagi
              </p>
              <p className="border-2 border-green-500 rounded-full w-14 h-14 py-3 text-center">
                {userStat?.givenFoodStat?.count}
              </p>
            </div>
            <div className="flex flex-col items-center">
              <p className="text-center text-xs mb-1 font-medium">Poin</p>
              <p className="border-2 border-blue-500 rounded-full w-14 h-14 py-3 text-center ">
                {userStat?.pointStat?.point}
              </p>
            </div>
            <div>
              <button
                onClick={() => setIsLeaderBoardModalOpen(true)}
                className="text-sm bg-blue-500 md:block hidden mx-auto px-2 py-1 mt-7 rounded-lg text-white cursor-pointer"
              >
                Lihat Peringkat
              </button>
            </div>
          </div>
          <button
            onClick={() => setIsLeaderBoardModalOpen(true)}
            className="text-sm bg-blue-500 block md:hidden mx-auto px-2 py-1 mt-4 rounded-lg text-white cursor-pointer"
          >
            Lihat Peringkat
          </button>

          <LeaderboardModal
            isLeaderBoardModalOpen={isleaderboardModalOpen}
            setIsLeaderBoardModalOpen={setIsLeaderBoardModalOpen}
          />
        </>
      )}
    </>
  );
};

export default HomeLeaderboard;
