import { useEffect } from "react";
import { FirebaseX } from "@ionic-native/firebase-x";
import { isPlatform } from "@ionic/react";
import { sendTokenToBackend } from "../api/sendToken";

export const useFCM = (userId: number) => {
  useEffect(() => {
    const initFirebase = async () => {
      if (!isPlatform("android")) return;

      try {
        const token = await FirebaseX.getToken();
        console.log("Token:", token);
        await sendTokenToBackend(token ?? "", userId);

        FirebaseX.onMessageReceived().subscribe((data) => {
          console.log("Notificación recibida:", data);
          alert(`${data.title}: ${data.body}`);
        });
      } catch (err) {
        console.error("Error al inicializar FCM:", err);
      }
    };

    initFirebase();
  }, [userId]);
};
