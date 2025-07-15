// /features/notifications/useNotifications.ts
import { useState, useEffect } from 'react';
import apiClient from '../../../common/api/axiosGlobal';

export function useNotifications() {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    apiClient.get('/notifications')
      .then(res => setNotifications(res.data))
      .catch(err => setError(err))
      .finally(() => setLoading(false));
  }, []);

  return { notifications, loading, error };
}
