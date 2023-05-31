import { useState, useEffect } from "react";
import { getDocs, collection, where, query } from "firebase/firestore";
import { useQuery, useQueryClient } from "@tanstack/react-query";

import { db } from "../../utils/firebaseconfig";

import OnProcessTakenCard from "../FoodStatusCard/FoodTakenCard/OnProcessTakenCard";
import SuccessTakenCard from "../FoodStatusCard/FoodTakenCard/SuccessTakenCard";

const TakenFoodTab = ({ user }) => {
  // const [takenFoodData, setTakenFoodData] = useState([]);

  const queryClient = useQueryClient();
  // const [givenFoodData, setGivenFoodData] = useState([]);

  const {
    isLoading,
    isError,
    data: takenFoodData,
    error,
  } = useQuery({
    queryKey: ["takenfoodList"],
    queryFn: async () => {
      if (!queryClient.getQueryData(["takenFoodList"])) {
        let takenFoodList = [];
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
        return takenFoodList;
      }
    },
  });

  useEffect(() => {
    let unmounted = false;
    let takenFoodList = [];
    const getTakenFoodCollection = async () => {
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
      {/* {takenFoodData.map((foodData) =>
        foodData.foodStatus === "onprocess" ? (
          <OnProcessTakenCard key={foodData.id} {...foodData} />
        ) : (
          <SuccessTakenCard key={foodData.id} {...foodData} />
        )
      )} */}

      {isLoading ? (
        <h1>Loading...</h1>
      ) : (
        takenFoodData.map((foodData) =>
          foodData.foodStatus === "onprocess" ? (
            <OnProcessTakenCard key={foodData.id} {...foodData} />
          ) : (
            <SuccessTakenCard key={foodData.id} {...foodData} />
          )
        )
      )}
    </>
  );
};

export default TakenFoodTab;
