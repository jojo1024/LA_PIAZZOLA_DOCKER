// public/firebase-messaging-sw.js
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.12.1/firebase-messaging-compat.js");

firebase.initializeApp({
    apiKey: "AIzaSyCO3ajWtqS9nQApiCkAiIftihD6c2gzO3g",
    authDomain: "piazzola-web-push.firebaseapp.com",
    projectId: "piazzola-web-push",
    storageBucket: "piazzola-web-push.firebasestorage.app",
    messagingSenderId: "774306794201",
    appId: "1:774306794201:web:6b9147ef8d3838574c0cc8",
  });



const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log("Message reçu en arrière-plan :", payload);

  const notificationTitle = payload.notification.title;
  const notificationOptions = {
    body: payload.notification.body,
    icon: payload.notification.icon
  };

  self.registration.showNotification(notificationTitle, notificationOptions);
});
