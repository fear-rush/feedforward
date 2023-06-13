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
    data: {
      url: "/home",
    },
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
  self.addEventListener("notificationclick", function (event) {
    let urlToRedirect = event.notification.data.url;
    event.notification.close();
    event.waitUntil(self.clientInformation.openWindow(urlToRedirect));
  });
});


// onMessage(messaging, (payload) => {
//   const notificationTitle = payload.notification.title;
//   const notificationOptions = {
//     body: payload.notification.body,
//     data: {
//       url: "/home",
//     },
//   };
//   navigator.serviceWorker.ready.then((registration) => {
//     registration.showNotification(notificationTitle, {
//       body: payload.notification.body,
//     });
//   });
//   // new Notification(notificationTitle, notificationOptions);
// });

// messaging.onMessage((payload) => {
//   const obj = JSON.parse(payload.data.notification);
//   const notification = new Notification(obj.title, {
//     body: obj.body,
//   });

//   notification.onclick = function (event) {
//     event.preventDefault();
//     window.open(payload.notification.webpush.fcm_options.link);
//     notification.close();
//   };
// });

// messaging.onMessage(function (payload) {
//   try {
//     console.log(`message received ${payload}`);
//     const notificationTitle = payload.notification.title;
//     const notificationOptions = {
//       body: payload.notification.body,
//       data: {
//         url: "/home",
//       },
//     };
//     self.registration.showNotification(notificationTitle, notificationOptions);
//     new Notification(notificationTitle, notificationOptions);
//   } catch (err) {
//     console.log(`caught error ${err}`);
//   }
// });
