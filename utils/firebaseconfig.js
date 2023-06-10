import { initializeApp } from "firebase/app";
import { getMessaging } from "firebase/messaging";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";

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

const app = initializeApp(firebaseConfig);

let messaging;
if (typeof window !== "undefined" && typeof window.navigator !== "undefined") {
  messaging = getMessaging(app);
}
const db = getFirestore(app);
const auth = getAuth(app);
const storage = getStorage(app);

export { app, db, messaging, auth, storage };
