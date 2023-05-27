import React, { useState, useEffect } from "react";
import { UserAuth } from "../../context/AuthContext";
import { getDocs, collection, query, where } from "firebase/firestore";
import { db } from "../../utils/firebaseconfig";
import AvailableGivenCard from "../FoodStatusCard/FoodGivenCard/AvailableGivenCard";
import ExpiredGivenCard from "../FoodStatusCard/FoodGivenCard/ExpiredGivenCard";
import OnProcessGivenCard from "../FoodStatusCard/FoodGivenCard/OnProcessGivenCard";
import SuccessGivenCard from "../FoodStatusCard/FoodGivenCard/SuccessGivenCard";

const GivenFoodTab = ({ user }) => {
  const [givenFoodData, setGivenFoodData] = useState([]);
  // console.log(user);
  useEffect(() => {
    let unmounted = false;
    let givenFoodList = [];
    const getGivenFoodCollection = async () => {
      // try {
      //   const givenFoodCollectionRef = collection(db, "user", user.uid, "food");
      //   const givenFoodSnapshot = await getDocs(givenFoodCollectionRef);
      //   givenFoodSnapshot.forEach((givenFood) => {
      //     givenFoodList.push({ foodId: givenFood.id, ...givenFood.data() });
      //   });
      //   console.log(`given food list ${givenFoodList}`);
      //   setGivenFoodData(givenFoodList);
      // } catch (err) {
      //   // add error handler
      //   console.log(err);
      // }
      try {
        const givenFoodQuery = query(
          collection(db, "food"),
          where("giverId", "==", user.uid)
        );
        const givenFoodSnapshot = await getDocs(givenFoodQuery);
        givenFoodSnapshot.forEach((givenFood) => {
          givenFoodList.push({ foodId: givenFood.id, ...givenFood.data() });
        });
        console.log(`given food list ${givenFoodList}`);
        setGivenFoodData(givenFoodList);
      } catch (err) {
        // add error handler
        console.log(err);
      }
    };

    if (!unmounted) {
      getGivenFoodCollection();
    }
    return () => {
      unmounted = true;
    };
  }, []);

  return (
    <>
      {givenFoodData.map((foodData) =>
        foodData.foodStatus === "available" ? (
          <AvailableGivenCard key={foodData.id} {...foodData} />
        ) : foodData.foodStatus === "onprocess" ? (
          <OnProcessGivenCard key={foodData.id} {...foodData} />
        ) : foodData.foodStatus === "taken" ? (
          <SuccessGivenCard key={foodData.id} {...foodData} />
        ) : (
          <ExpiredGivenCard key={foodData.id} {...foodData} />
        )
      )}
    </>
  );
};

export default React.memo(GivenFoodTab);
