import { useQuery } from "@tanstack/react-query";
import { getFcmToken } from "../utils/firebase-get-token";

const getUserNotification = async (user) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      console.log(user);
      const deviceToken = await getFcmToken();
      await fetch(`${process.env.DEV_URL}/saveDeviceToken`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
          "Acecess-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          userId: user,
          token: deviceToken,
        }),
      });
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
