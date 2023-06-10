import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

// const firebaseConfig = {
//   apiKey: "AIzaSyAJLWeEwHt6MpYLWhWM_V-xxHFhVacq5Rs",
//   authDomain: "feedforward-45118.firebaseapp.com",
//   projectId: "feedforward-45118",
//   storageBucket: "feedforward-45118.appspot.com",
//   messagingSenderId: "555789981939",
//   appId: "1:555789981939:web:dca0e05db4402bf4ae7f86",
//   measurementId: "G-X6Z2EJZQXW",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAg6jNWOzBWEm8msNSwPQN-ePUF_v0rki4",
  authDomain: "feed-forward-187f4.firebaseapp.com",
  projectId: "feed-forward-187f4",
  storageBucket: "feed-forward-187f4.appspot.com",
  messagingSenderId: "185567387995",
  appId: "1:185567387995:web:b64116d5779e60a769ba7e",
  measurementId: "G-RLZMCWDH8C",
};

export async function getFcmToken() {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const currentToken = await getToken(messaging, {
    vapidKey:
      "BL28CgM8Ow0p0A18O8zlR3UeootWyJeGe3Md8e8xX7JWgP55dZCp2ZekceN-RavthSDhZxeD4YPFyXJTYZi6EiU",
  });
  if (!currentToken) {
    throw new Error("Can not get token");
  }
  return currentToken;
}
