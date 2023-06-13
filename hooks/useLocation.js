import { useQuery } from "@tanstack/react-query";

const getUserLocation = async () => {
  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        resolve({ latitude, longitude });
      },
      (error) => {
        reject(error);
      }, {
        enableHighAccuracy: true,
        timeout: 30000
      }
    );
  });
};

export const useLocation = () => {
  return useQuery({ queryKey: ["location"], queryFn: getUserLocation });
}
