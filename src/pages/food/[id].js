import React, { useState, useEffect } from "react";
import { db } from "../../../utils/firebaseconfig";
import { doc, getDoc } from "firebase/firestore";
import { useRouter } from "next/router";
import FoodDetailView from "../../../components/FoodDetail/FoodDetailView";

const FoodDetail = () => {
  const [foodData, setFoodData] = useState("");
  const [foodFetchLoading, setFoodFetchLoading] = useState(true);
  const router = useRouter();

  // const foodDocRef = doc(db)

  useEffect(() => {
    let unmounted = false;

    const getFoodDocument = () => {
      const foodDocumentRef = doc(db, "allfood", router.query.id);
      getDoc(foodDocumentRef)
        .then((foodDocumentSnapshot) => {
          if (unmounted) return;

          if (foodDocumentSnapshot.exists()) {
            const fetchedFoodData = foodDocumentSnapshot.data();
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
      {foodFetchLoading ? (
        <div>loading</div>
      ) : (
        <FoodDetailView
          {...foodData}
        />
      )}
    </>
  );
};

export default FoodDetail;
