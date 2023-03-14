// import { getMessaging, onBackgroundMessage } from "firebase/messaging/sw";
// import { app } from "../utils/firebaseconfig";

// const messaging = getMessaging(app);

// onBackgroundMessage(messaging, (payload) => {
//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
//   // Customize notification here
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     icon: payload.notification.icon,
//   };

//   self.registration.showNotification(notificationTitle,
//     notificationOptions);
// });

// importScripts("https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js");
// importScripts(
//   "https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js"
// );

importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js');

// const firebaseConfig = {
//   apiKey: "AIzaSyDpZFuPwJzUHA8_gEwfdBOp2lghrcjhO8A",
//   authDomain: "web-push-notification-ex-b6d93.firebaseapp.com",
//   projectId: "web-push-notification-ex-b6d93",
//   storageBucket: "web-push-notification-ex-b6d93.appspot.com",
//   messagingSenderId: "414177235606",
//   appId: "1:414177235606:web:a29f3fb8e6ee3b621e28b7",
// };

const firebaseConfig = {
  apiKey: "AIzaSyAJLWeEwHt6MpYLWhWM_V-xxHFhVacq5Rs",
  authDomain: "feedforward-45118.firebaseapp.com",
  projectId: "feedforward-45118",
  storageBucket: "feedforward-45118.appspot.com",
  messagingSenderId: "555789981939",
  appId: "1:555789981939:web:dca0e05db4402bf4ae7f86",
  measurementId: "G-X6Z2EJZQXW"
}

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  console.log(
    "[firebase-messaging-sw.js] Received background message ",
    payload
  );
  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.image,
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
