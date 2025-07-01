import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

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