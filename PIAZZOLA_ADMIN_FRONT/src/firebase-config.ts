// src/firebase-config.js
import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';
import { apiClient } from './utils/apiClient';

const firebaseConfig = {
  apiKey: "AIzaSyCO3ajWtqS9nQApiCkAiIftihD6c2gzO3g",
  authDomain: "piazzola-web-push.firebaseapp.com",
  projectId: "piazzola-web-push",
  storageBucket: "piazzola-web-push.firebasestorage.app",
  messagingSenderId: "774306794201",
  appId: "1:774306794201:web:6b9147ef8d3838574c0cc8",
  measurementId: "G-J8J0DS08T4"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

// Demande de permission et récupération du token
export const requestNotificationPermission = async (utilisateurId: number) => {
  try {
    const permission = await Notification.requestPermission();
    if (permission === "granted") {
      const pushToken = await getToken(messaging, {
        vapidKey: "BORd3giQoFuMli1XeYvnNt8syoEwRACsvnt0yzArLskAPllqHlY9uOHDPVbYy5eSwi5EguAEAmrFwu3OCY6vrWE", // Colle ici la clé publique VAPID
      });
      const res = await apiClient.post("/modifier_push_token", {utilisateurId, pushToken});

      console.log("Token reçu >>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>:", pushToken);
    } else {
      console.log("Permission refusée");
    }
  } catch (err) {
    console.error("Erreur lors de la demande de permission", err);
  }
};

// Écoute des messages en premier plan
export const listenToForegroundMessages = () => {
  onMessage(messaging, (payload) => {
    console.log("Notification reçue en avant-plan :", payload);
    new Notification(payload?.notification?.title!, {
      body: payload?.notification?.body!,
      icon: payload?.notification?.icon!,
    });
  });
};
