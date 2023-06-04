import React from "react";
import {
  getDocs,
  collection,
  query,
  where,
  orderBy,
  startAfter,
  limit,
} from "firebase/firestore";
import { useInfiniteQuery } from "@tanstack/react-query";
import {
  TrashIcon,
  ExclamationTriangleIcon,
} from "@heroicons/react/24/outline";
import FabButton from "../Button/FabButton";
import { getIdToken } from "firebase/auth";

import { db } from "../../utils/firebaseconfig";

import AvailableGivenCard from "../FoodStatusCard/FoodGivenCard/AvailableGivenCard";
import ExpiredGivenCard from "../FoodStatusCard/FoodGivenCard/ExpiredGivenCard";
import OnProcessGivenCard from "../FoodStatusCard/FoodGivenCard/OnProcessGivenCard";
import SuccessGivenCard from "../FoodStatusCard/FoodGivenCard/SuccessGivenCard";
import SkeletonStatusFoodCard from "../Card/SkeletonStatusFoodCard";

const GivenFoodTab = ({ user }) => {
  const skeletonPlaceholder = Array(2).fill(0);

  const {
    data: givenFoodData,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isError,
    isLoading,
    error,
  } = useInfiniteQuery({
    queryKey: ["givenFoodList"],
    queryFn: async ({ pageParam = null }) => {
      try {
        // let givenFoodDocumentsQuery;
        // givenFoodDocumentsQuery = query(
        //   collection(db, "food"),
        //   where("giverId", "==", user.uid),
        //   orderBy("foodStatus", "desc"),
        //   orderBy("dateAdded", "desc"),
        //   limit(2)
        // );

        // if (pageParam) {
        //   givenFoodDocumentsQuery = query(
        //     givenFoodDocumentsQuery,
        //     startAfter(pageParam)
        //   );
        // }

        // const givenFoodDocuments = await getDocs(givenFoodDocumentsQuery);
        // const foodData = givenFoodDocuments.docs.map((food) => {
        //   return { foodId: food.id, ...food.data() };
        // });

        const userToken = await getIdToken(user);
        console.log(`inside next cursor ${pageParam}`);

        const response = await fetch(
          `http://127.0.0.1:5001/feed-forward-187f4/asia-southeast2/app/api/getGivenFood`,
          {
            method: "POST",
            body: JSON.stringify({
              pageParam: pageParam,
            }),
            headers: {
              Authorization: "Bearer " + userToken,
              "Content-type": "application/json; charset=UTF-8",
            },
          }
        );

        const res = await response.json();

        if (res.status !== 200) {
          throw new Error(res.status);
        }
        const foodData = res.data;
        const givenFoodDocuments = res.givenFoodDocuments;

        return {
          foodData,
          // nextCursor:
          //   givenFoodDocuments.docs.length <= 2
          //     ? givenFoodDocuments.docs[givenFoodDocuments.docs.length - 1]
          //     : null,
          nextCursor: givenFoodDocuments,
        };
      } catch (err) {
        throw new Error(err);
      }
    },
    getNextPageParam: (lastPage) => {
      console.log(lastPage?.nextCursor);
      return lastPage?.nextCursor ?? undefined;
    },
  });

  if (isError) {
    return (
      <div className="w-full h-screen px-6">
        <ExclamationTriangleIcon className="h-20 w-20 mt-16 text-yellow-300 mx-auto" />
        <p className="text-center text-gray-700 text-lg">
          Terjadi kegagalan pada sistem
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
          {/* {givenFoodData?.pages?.map((page, index) =>
            page?.foodData?.length > 0 && !isError ? (
              <React.Fragment key={index}>
                {page?.foodData?.map((food) =>
                  food.foodStatus === "available" ? (
                    <AvailableGivenCard key={food.id} {...food} />
                  ) : food.foodStatus === "onprocess" ? (
                    <OnProcessGivenCard key={food.id} {...food} />
                  ) : food.foodStatus === "taken" ? (
                    <SuccessGivenCard key={food.id} {...food} />
                  ) : (
                    <ExpiredGivenCard key={food.id} {...food} />
                  )
                )}
              </React.Fragment>
            ) : (
              <div className="text-center px-8 mt-12">
                <TrashIcon className="w-14 h-14 text-black mx-auto" />
                <p className="text-gray-700 mt-4 text-lg">
                  Anda belum membagikan makanan, silakan tekan tombol bagikan
                  makanan untuk mulai berbagi
                </p>
              </div>
            )
          )} */}
          {givenFoodData?.pages[0].foodData?.length > 0 ? (
            givenFoodData?.pages?.map((page, index) =>
              Array.from(page?.foodData).length > 0 && !isError ? (
                <React.Fragment key={index}>
                  {page?.foodData?.map((food) =>
                    food.foodStatus === "available" ? (
                      <AvailableGivenCard key={food.id} {...food} />
                    ) : food.foodStatus === "onprocess" ? (
                      <OnProcessGivenCard key={food.id} {...food} />
                    ) : food.foodStatus === "taken" ? (
                      <SuccessGivenCard key={food.id} {...food} />
                    ) : (
                      <ExpiredGivenCard key={food.id} {...food} />
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

export default GivenFoodTab;

// const [givenFoodData, setGivenFoodData] = useState([]);

// const {
//   isLoading,
//   isError,
//   data: givenFoodData,
//   error,
// } = useQuery({
//   queryKey: ["givenFoodList"],
//   queryFn: async () => {
//     if (!queryClient.getQueryData(["givenFoodList"])) {
//       console.log("here 2");

//       let givenFoodList = [];
//       const givenFoodQuery = query(
//         collection(db, "food"),
//         where("giverId", "==", user.uid)
//       );
//       const givenFoodSnapshot = await getDocs(givenFoodQuery);
//       givenFoodSnapshot.forEach((givenFood) => {
//         givenFoodList.push({ foodId: givenFood.id, ...givenFood.data() });
//       });
//       return givenFoodList;
//     }
//   },
// });

// useEffect(() => {
//   let unmounted = false;
//   let givenFoodList = [];
//   const getGivenFoodCollection = async () => {
//     try {
//       const givenFoodQuery = query(
//         collection(db, "food"),
//         where("giverId", "==", user.uid)
//       );
//       const givenFoodSnapshot = await getDocs(givenFoodQuery);
//       givenFoodSnapshot.forEach((givenFood) => {
//         givenFoodList.push({ foodId: givenFood.id, ...givenFood.data() });
//       });
//       console.log(`given food list ${givenFoodList}`);
//       setGivenFoodData(givenFoodList);
//     } catch (err) {
//       // add error handler
//       console.log(err);
//     }
//   };

//   if (!unmounted) {
//     getGivenFoodCollection();
//   }
//   return () => {
//     unmounted = true;
//   };
// }, []);

{
  /* {givenFoodData.map((foodData) =>
            foodData.foodStatus === "available" ? (
              <AvailableGivenCard key={foodData.id} {...foodData} />
            ) : foodData.foodStatus === "onprocess" ? (
              <OnProcessGivenCard key={foodData.id} {...foodData} />
            ) : foodData.foodStatus === "taken" ? (
              <SuccessGivenCard key={foodData.id} {...foodData} />
            ) : (
              <ExpiredGivenCard key={foodData.id} {...foodData} />
            )
          )} */
}

{
  /* {givenFoodData.map((foodData) =>
        foodData.foodStatus === "available" ? (
          <AvailableGivenCard key={foodData.id} {...foodData} />
        ) : foodData.foodStatus === "onprocess" ? (
          <OnProcessGivenCard key={foodData.id} {...foodData} />
        ) : foodData.foodStatus === "taken" ? (
          <SuccessGivenCard key={foodData.id} {...foodData} />
        ) : (
          <ExpiredGivenCard key={foodData.id} {...foodData} />
        )
      )} */
}
