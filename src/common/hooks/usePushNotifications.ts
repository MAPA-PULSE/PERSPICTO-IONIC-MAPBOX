// src/hooks/usePushNotifications.ts
import { useEffect } from 'react';
import { PushNotifications } from '@capacitor/push-notifications';

export const usePushNotifications = () => {
  useEffect(() => {
    PushNotifications.requestPermissions().then(permission => {
      if (permission.receive === 'granted') {
        PushNotifications.register();
      } else {
        console.warn('Permiso denegado para notificaciones push');
      }
    });

    PushNotifications.addListener('registration', (token) => {
      console.log('Token FCM:', token.value);
    });

    PushNotifications.addListener('registrationError', (err) => {
      console.error('Error de registro:', err);
    });

    PushNotifications.addListener('pushNotificationReceived', (notification) => {
      console.log('Notificación recibida en primer plano:', notification);
    });

    PushNotifications.addListener('pushNotificationActionPerformed', (action) => {
      console.log('Acción del usuario:', action);
    });
  }, []);
};
