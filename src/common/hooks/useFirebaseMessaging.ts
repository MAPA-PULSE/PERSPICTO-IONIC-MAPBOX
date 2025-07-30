import { useEffect } from 'react';
import { messaging } from '../../common/firebase/firebase';
import { getToken, onMessage } from 'firebase/messaging';
import { sendTokenToBackend } from '../api/sendToken'; 

const VAPID_KEY = 'BKT3rbpg68Ps7f47NOue0NubwqgyvzmK54-jCVI6mLoSzxIm3YgTvPad5s5tEFXm6BzzJ2vUblh-c2RgNfgvgXo';

export const useFirebaseMessaging = (userId: number) => {
  useEffect(() => {
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        getToken(messaging, { vapidKey: VAPID_KEY })
          .then(async (currentToken) => {
            if (currentToken) {
              console.log('Token FCM:', currentToken);
              await sendTokenToBackend(currentToken, userId);
            } else {
              console.warn('No se obtuvo token de FCM');
            }
          })
          .catch((err) => console.error('Error al obtener token:', err));

        onMessage(messaging, (payload) => {
          console.log('Notificación recibida:', payload);
          alert(`${payload.notification?.title}: ${payload.notification?.body}`);
        });
      }
    });
  }, [userId]);
};
