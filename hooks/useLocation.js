import { useQuery } from "@tanstack/react-query";

const getUserLocation = async () => {
  const location = new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve(position);
      },
      (error) => {
        reject(error);
      }
    );
  });
  return location;
};

export const useLocation = () => {
  return useQuery({ queryKey: ["location"], queryFn: getUserLocation });
}
