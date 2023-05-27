import React, { useState, useEffect } from "react";
import { getDocs, collection, where, query } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";
import OnProcessTakenCard from "../FoodStatusCard/FoodTakenCard/OnProcessTakenCard";
import SuccessTakenCard from "../FoodStatusCard/FoodTakenCard/SuccessTakenCard";

const TakenFoodTab = ({ user }) => {
  const [takenFoodData, setTakenFoodData] = useState([]);
  useEffect(() => {
    let unmounted = false;
    let takenFoodList = [];
    const getTakenFoodCollection = async () => {
      // try {
      //   const takenFoodCollectionRef = collection(
      //     db,
      //     "user",
      //     user.uid,
      //     "takenFood"
      //   );
      //   const takenFoodSnapshot = await getDocs(takenFoodCollectionRef);
      //   takenFoodSnapshot.forEach((takenFood) => {
      //     takenFoodList.push({
      //       takenFoodId: takenFood.id,
      //       ...takenFood.data(),
      //     });
      //   });
      //   setTakenFoodData(takenFoodList);
      // } catch (err) {
      //   // add error handler
      //   console.log(err);
      // }

      try {
        const takenFoodQuery = query(
          collection(db, "food"),
          where("takerId", "==", user.uid)
        );
        const takenFoodSnapshot = await getDocs(takenFoodQuery);
        takenFoodSnapshot.forEach((takenFood) => {
          takenFoodList.push({
            foodId: takenFood.id,
            ...takenFood.data(),
          });
        });
        setTakenFoodData(takenFoodList);
      } catch (err) {
        // add error handler
        console.log(err);
      }
    };
    if (!unmounted) {
      getTakenFoodCollection();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <>
      {takenFoodData.map((foodData) =>
        foodData.foodStatus === "onprocess" ? (
          <OnProcessTakenCard key={foodData.id} {...foodData} />
        ) : (
          <SuccessTakenCard key={foodData.id} {...foodData} />
        )
      )}
    </>
  );
};

export default TakenFoodTab;
