import React, { useState, useEffect } from "react";
import { db } from "../../../utils/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import FoodDetailView from "../../../components/FoodDetail/FoodDetailView";
// import FabButton from "../../../components/Button/FabButton";
import dynamic from "next/dynamic";
const FabButton = dynamic(
  () => import("../../../components/Button/FabButton"),
  { ssr: false }
);

const FoodDetail = () => {
  const [foodData, setFoodData] = useState("");
  const [foodFetchLoading, setFoodFetchLoading] = useState(true);
  const [foodDetailError, setFoodDetailError] = useState(false);
  const router = useRouter();

  useEffect(() => {
    let unmounted = false;

    const getFoodDocument = () => {
      const foodDocumentRef = doc(db, "food", router.query.id);
      getDoc(foodDocumentRef)
        .then((foodDocumentSnapshot) => {
          if (unmounted) return;

          if (
            foodDocumentSnapshot.exists() &&
            foodDocumentSnapshot.data().foodStatus === "available"
          ) {
            const fetchedFoodData = {
              foodId: foodDocumentSnapshot.id,
              ...foodDocumentSnapshot.data(),
            };
            setFoodData(fetchedFoodData);
            setFoodFetchLoading(false);
          } else {
            // add error handling on non-existed document
            setFoodFetchLoading(false);
            setFoodDetailError(true);
            console.log("Document Not Found");
          }
        })
        .catch((err) => {
          // add error handling on error
          console.log(err);
          setFoodFetchLoading(false);
          setFoodDetailError(true);
        });
    };

    if (router.isReady) {
      getFoodDocument();
      console.log(foodData);
    }

    return () => {
      unmounted = true;
    };
  }, [router.isReady, router.query]);

  if (foodDetailError) {
    // add food detail error
    return <h1>Makanan Tidak Tersedia</h1>
  }

  return (
    <>
      {foodFetchLoading ? <div>loading</div> : <FoodDetailView {...foodData} />}
      <FabButton />
    </>
  );
};

export default FoodDetail;
