import { useQuery } from "@tanstack/react-query";

const getFoodById = async (foodId) => {
  try {
    const res = await fetch(
      `${process.env.DEV_URL}/getFoodById/${foodId}`
    );
    const food = await res.json();
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
