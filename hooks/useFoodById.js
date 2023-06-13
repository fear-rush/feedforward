import { useQuery } from "@tanstack/react-query";
import axios from "axios";

const getFoodById = async (foodId) => {
  try {
    const res = await axios.get(`${process.env.PROD_URL}/getFoodById/${foodId}`);
    const food = res.data;
    console.log(food.status)
    if (food.status !== 200) {
      throw new Error(food.status);
    }
    const foodData = food.data;
    return foodData;
  } catch (err) {
    throw new Error(err);
  }
};

export const useFoodById = (foodId) => {
  return useQuery({
    queryKey: ["food", foodId],
    queryFn: () => getFoodById(foodId),
    enabled: Boolean(foodId),
  });
};
