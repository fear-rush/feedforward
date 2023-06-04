import React from "react";
import Link from "next/link";
import {
  getDocs,
  collection,
  where,
  query,
  orderBy,
  startAt,
  endAt,
} from "firebase/firestore";

import { UserAuth } from "../../context/AuthContext";
import { useLocation } from "../../hooks/useLocation";
import { db } from "../../utils/firebaseconfig";

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

const DashboardPage = () => {
  const { user, userToken } = UserAuth();
  const skeletonPlaceholder = Array(4).fill(0);

  const {
    isError: isLocationError,
    data: locationData,
    isLoading: isLocationLoading,
  } = useLocation();

  const {
    data: allFoodData,
    isLoading: isAllFoodLoading,
    error: isAllFoodError,
    error,
  } = useQuery({
    queryKey: ["foodList"],
    queryFn: async () => {
      // const geofire = require("geofire-common");

      try {
        const userToken = await getIdToken(user);
        console.log(userToken);
        console.log(locationData);

        const response = await fetch(
          `http://127.0.0.1:5001/feed-forward-187f4/asia-southeast2/app/api/getFood?lat=${locationData.coords.latitude}&lng=${locationData.coords.longitude}`,
          {
            headers: {
              Authorization: "Bearer " + userToken,
            },
          }
        );
        const res = await response.json();

        if (res.status !== 200) {
          throw new Error(res.status);
        }
        const foodData = res.data;
        return {
          foodData,
        };

        // const center = [
        //   locationData.coords.latitude,
        //   locationData.coords.longitude,
        // ];
        // let foodData = [];

        // const radiusInM = 5 * 1000;
        // const bounds = geofire.geohashQueryBounds(center, radiusInM);
        // for (const b of bounds) {
        //   const q = query(
        //     collection(db, "food"),
        //     where("foodStatus", "==", "available"),
        //     orderBy("geohash"),
        //     startAt(b[0]),
        //     endAt(b[1])
        //   );
        //   const querySnapshot = await getDocs(q);
        //   querySnapshot.forEach((doc) => {
        //     if (doc.data().giverId !== user.uid) {
        //       const lat = doc.data().latitude;
        //       const lng = doc.data().longitude;
        //       const distanceInKm = geofire.distanceBetween([lat, lng], center);
        //       const distanceInM = distanceInKm * 1000;
        //       if (distanceInM <= radiusInM) {
        //         foodData.push({
        //           id: doc.id,
        //           distance: distanceInKm,
        //           ...doc.data(),
        //         });
        //         console.log(
        //           `${doc.id} => ${doc.data().foodName} ${distanceInM}`
        //         );
        //       }
        //     }
        //   });
        //   foodData.sort((a, b) => a.distance - b.distance);
        // }
        return {
          foodData,
        };
      } catch (err) {
        console.log(err);
        throw new Error(err);
      }
    },
    // Query will not execute until locationData exists
    enabled: !!locationData,
  });

  if (isLocationError || isAllFoodError) {
    return (
      <div className="w-full h-screen px-6">
        <ExclamationTriangleIcon className="h-20 w-20 mt-16 text-yellow-300 mx-auto" />
        <p className="text-center text-gray-700 text-lg">
          Galat terjadi. Dimohon untuk mengaktifkan perizinan lokasi agar web
          bisa berjalan. Jika masih muncul pemberitahuan galat silakan cek
          koneksi internet anda dan muat ulang halaman ini. {error.message}
        </p>
        <FabButton />
      </div>
    );
  }

  return (
    <>
      <ArticleSlider />
      <div className="grid justify-items-center grid-cols-1 gap-x-4 gap-y-12 md:gap-y-6">
        <h1 className="mt-4 font-medium text-lg">
          Makanan Tersedia di Sekitar Anda
        </h1>
        {isAllFoodLoading || isLocationLoading ? (
          skeletonPlaceholder.map((_, id) => <SkeletonFoodCard key={id} />)
        ) : allFoodData.foodData.length > 0 ? (
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

export default DashboardPage;

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

// console.log(allFoodData)

// console.log(allFoodData.pages[1].foodData[0])

{
  /* <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 lg:gap-y-6">
        {foodFetchLoading
          ? skeletonPlaceholder.map((_, id) => <SkeletonFoodCard key={id} />)
          : allFoodData.map((food) => (
              <Link key={food.id} href={`/food/${food.id}`}>
                <FoodCard key={food.id} {...food} />
              </Link>
            ))}
      </div> */
}
{
  /* <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 lg:gap-y-6">
        {isLoading
          ? skeletonPlaceholder.map((_, id) => <SkeletonFoodCard key={id} />)
          : allFoodData.map((food) => (
              <Link key={food.id} href={`/food/${food.id}`}>
                <FoodCard key={food.id} {...food} />
              </Link>
            ))}
      </div> */
}

// const {
//   data: allFoodData,
//   fetchNextPage,
//   hasNextPage,
//   isFetchingNextPage,
//   isLoading: isAllFoodLoading,
// } = useInfiniteQuery({
//   queryKey: ["foodList"],
//   queryFn: async ({ pageParam = null }) => {
//     // add error handler
//     const geofire = require("geofire-common");

//     try {
//       const center = [
//         locationData.coords.latitude,
//         locationData.coords.longitude,
//       ];
//       let foodData = [];
//       let querySnapshot = [];
//       let q;

//       const radiusInM = 5 * 1000;
//       const bounds = geofire.geohashQueryBounds(center, radiusInM);
//       for (const b of bounds) {
//         q = query(
//           collection(db, "food"),
//           where("foodStatus", "==", "available"),
//           orderBy("geohash"),
//           startAt(b[0]),
//           endAt(b[1]),
//         );

//         querySnapshot = await getDocs(q);
//         querySnapshot.forEach((doc) => {
//           if (doc.data().giverId !== user.uid) {
//             const lat = doc.data().latitude;
//             const lng = doc.data().longitude;
//             const distanceInKm = geofire.distanceBetween([lat, lng], center);
//             const distanceInM = distanceInKm * 1000;
//             if (distanceInM <= radiusInM) {
//               foodData.push({
//                 id: doc.id,
//                 distance: distanceInM,
//                 ...doc.data(),
//               });
//               console.log(
//                 `${doc.id} => ${doc.data().foodName} ${distanceInM}`
//               );
//             }
//           }
//         });
//       }

//       // let allFoodDocumentsQuery;
//       // allFoodDocumentsQuery = query(
//       //   collection(db, "food"),
//       //   where("foodStatus", "==", "available"),
//       //   orderBy("geohash"),
//       //   limit(2)
//       // );

//       // if (pageParam) {
//       //   allFoodDocumentsQuery = query(
//       //     allFoodDocumentsQuery,
//       //     startAfter(pageParam)
//       //   );
//       // }

//       // const userToken = await getIdToken(user);
//       // console.log(userToken);

//       // const allFoodDocuments = await getDocs(allFoodDocumentsQuery);
//       // const foodData = allFoodDocuments.docs.map((food) => {
//       //   if ((food.data().giverId, "!=", user.uid)) {
//       //     return { id: food.id, ...food.data() };
//       //   }
//       // });
//       return {
//         foodData,
//         // nextCursor:
//         //   allFoodDocuments.docs.length <= 2
//         //     ? allFoodDocuments.docs[allFoodDocuments.docs.length - 1]
//         //     : null,
//       };
//     } catch (err) {
//       // add error handling
//       console.log(err);
//     }
//   },
//   getNextPageParam: (lastPage) => {
//     return lastPage?.nextCursor ?? undefined;
//   },
//   // Query will not execute until locationData exists
//   enabled: !!locationData,
// });

{
  /* <div className="grid justify-items-center grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-4 gap-y-12 lg:gap-y-6">
            {allFoodData?.pages?.map((page, index) => (
              <React.Fragment key={index}>
                {page?.foodData?.map((food) => (
                  <Link key={food.id} href={`/food/${food.id}`}>
                    <FoodCard key={food.id} {...food} />
                  </Link>
                ))}
              </React.Fragment>
            ))}
          </div> */
}

{
  /* <div className="flex justify-center items-center mt-10">
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
          </div> */
}
