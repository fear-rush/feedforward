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

importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/9.0.0/firebase-messaging-compat.js"
);

const firebaseConfig = {
  apiKey: "AIzaSyAg6jNWOzBWEm8msNSwPQN-ePUF_v0rki4",
  authDomain: "feed-forward-187f4.firebaseapp.com",
  projectId: "feed-forward-187f4",
  storageBucket: "feed-forward-187f4.appspot.com",
  messagingSenderId: "185567387995",
  appId: "1:185567387995:web:b64116d5779e60a769ba7e",
  measurementId: "G-RLZMCWDH8C",
};

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
    data: {
      url: "localhost:3000/profile",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  self.addEventListener("notificationclick", function (event) {
    let urlToRedirect = event.notification.data.urll;
    event.notification.close();
    event.waitUntil(self.clientInformation.openWindow(urlToRedirect));
  });
});


