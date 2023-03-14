import { initializeApp } from "firebase/app";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyAJLWeEwHt6MpYLWhWM_V-xxHFhVacq5Rs",
  authDomain: "feedforward-45118.firebaseapp.com",
  projectId: "feedforward-45118",
  storageBucket: "feedforward-45118.appspot.com",
  messagingSenderId: "555789981939",
  appId: "1:555789981939:web:dca0e05db4402bf4ae7f86",
  measurementId: "G-X6Z2EJZQXW",
};

export async function getFcmToken() {
  const app = initializeApp(firebaseConfig);
  const messaging = getMessaging(app);
  const currentToken = await getToken(messaging, {
    vapidKey:
      "BCSDNBzIJlVXyIPloZY8FV6JoLJPGPJnrDtyMgkJRZMsXgz6eIforS_pPmh8K3thrmS9COdOAdmqlrK06SjDRZU",
  });
  if (!currentToken) {
    throw new Error("Can not get token");
  }
  return currentToken;
}
