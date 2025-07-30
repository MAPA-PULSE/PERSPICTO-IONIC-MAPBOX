import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getMessaging, getToken } from "firebase/messaging";

const firebaseConfig = {
  apiKey: "AIzaSyDNn3IjsSmmCwYgZVK0tF_2WmZPKr8mA6k",
  authDomain: "perspicto-ea5e9.firebaseapp.com",
  projectId: "perspicto-ea5e9",
  storageBucket: "perspicto-ea5e9.firebasestorage.app",
  messagingSenderId: "878987297613",
  appId: "1:878987297613:web:951bf9a2ded12385ce2d04",
  measurementId: "G-ET1FE1SP57"
};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app);
export const messaging = getMessaging(app);

export const getFcmToken = async () => {
  try {
    const currentToken = await getToken(messaging, {
      vapidKey: "BKT3rbpg68Ps7f47NOue0NubwqgyvzmK54-jCVI6mLoSzxIm3YgTvPad5s5tEFXm6BzzJ2vUblh-c2RgNfgvgXo"
    });
    if (currentToken) {
      return currentToken;
    }
  } catch (err) {
    console.error("No se pudo obtener el token FCM", err);
  }
};
