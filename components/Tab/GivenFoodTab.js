import { useState, useEffect } from "react";
import { getDocs, collection, query, where } from "firebase/firestore";

import { useQuery, useQueryClient } from "@tanstack/react-query";

import { db } from "../../utils/firebaseconfig";

import AvailableGivenCard from "../FoodStatusCard/FoodGivenCard/AvailableGivenCard";
import ExpiredGivenCard from "../FoodStatusCard/FoodGivenCard/ExpiredGivenCard";
import OnProcessGivenCard from "../FoodStatusCard/FoodGivenCard/OnProcessGivenCard";
import SuccessGivenCard from "../FoodStatusCard/FoodGivenCard/SuccessGivenCard";

const GivenFoodTab = ({ user }) => {
  const queryClient = useQueryClient();
  // const [givenFoodData, setGivenFoodData] = useState([]);

  const {
    isLoading,
    isError,
    data: givenFoodData,
    error,
  } = useQuery({
    queryKey: ["givenFoodList"],
    queryFn: async () => {
      if (!queryClient.getQueryData(["givenFoodList"])) {
        let givenFoodList = [];
        const givenFoodQuery = query(
          collection(db, "food"),
          where("giverId", "==", user.uid)
        );
        const givenFoodSnapshot = await getDocs(givenFoodQuery);
        givenFoodSnapshot.forEach((givenFood) => {
          givenFoodList.push({ foodId: givenFood.id, ...givenFood.data() });
        });
        return givenFoodList;
      }
    },
  });

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

  return (
    <>
      {/* {givenFoodData.map((foodData) =>
        foodData.foodStatus === "available" ? (
          <AvailableGivenCard key={foodData.id} {...foodData} />
        ) : foodData.foodStatus === "onprocess" ? (
          <OnProcessGivenCard key={foodData.id} {...foodData} />
        ) : foodData.foodStatus === "taken" ? (
          <SuccessGivenCard key={foodData.id} {...foodData} />
        ) : (
          <ExpiredGivenCard key={foodData.id} {...foodData} />
        )
      )} */}
      {isLoading ? (
        <h1>Loading</h1>
      ) : (
        givenFoodData.map((foodData) =>
          foodData.foodStatus === "available" ? (
            <AvailableGivenCard key={foodData.id} {...foodData} />
          ) : foodData.foodStatus === "onprocess" ? (
            <OnProcessGivenCard key={foodData.id} {...foodData} />
          ) : foodData.foodStatus === "taken" ? (
            <SuccessGivenCard key={foodData.id} {...foodData} />
          ) : (
            <ExpiredGivenCard key={foodData.id} {...foodData} />
          )
        )
      )}
    </>
  );
};

export default GivenFoodTab;
