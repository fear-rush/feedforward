import React, { useState, useEffect } from "react";
import { db } from "../../../utils/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import FoodDetailView from "../../../components/FoodDetail/FoodDetailView";
import FabButton from "../../../components/Button/FabButton";

const FoodDetail = () => {
  const [foodData, setFoodData] = useState("");
  const [foodFetchLoading, setFoodFetchLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    let unmounted = false;

    const getFoodDocument = () => {
      const foodDocumentRef = doc(db, "food", router.query.id);
      getDoc(foodDocumentRef)
        .then((foodDocumentSnapshot) => {
          if (unmounted) return;

          if (foodDocumentSnapshot.exists()) {
            const fetchedFoodData = {
              foodId: foodDocumentSnapshot.id,
              ...foodDocumentSnapshot.data(),
            };
            setFoodData(fetchedFoodData);
            setFoodFetchLoading(false);
          } else {
            // add error handling on non-existed document
            setFoodFetchLoading(false);
            console.log("Document Not Found");
          }
        })
        .catch((err) => {
          // add error handling on error
          console.log(err);
          setFoodFetchLoading(false);
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

  return (
    <>
      {foodFetchLoading ? <div>loading</div> : <FoodDetailView {...foodData} />}
      <FabButton />
    </>
  );
};

export default FoodDetail;
