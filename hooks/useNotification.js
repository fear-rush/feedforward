import { useQuery } from "@tanstack/react-query";
import { getFcmToken } from "../utils/firebase-get-token";
import axios from "axios";

const getUserNotification = async (user) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const deviceToken = await getFcmToken();
      // await axios.post(`${process.env.PROD_URL}/saveDeviceToken`, {
      //   userId: user,
      //   token: deviceToken,
      // })
      await axios.post(`https://asia-southeast2-feed-forward-187f4.cloudfunctions.net/app/api/saveDeviceToken`, {
        userId: user,
        token: deviceToken,
      })
      return deviceToken;
    } else {
      throw new Error("Permission Disabled");
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const useNotification = (user) => {
  return useQuery({
    queryKey: ["userDeviceToken", user],
    queryFn: () => getUserNotification(user),
    enabled: Boolean(user),
  });
};
