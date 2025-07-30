import API_BASE_URL from './api';
import axios from 'axios';


interface FCMTokenRegister {
  user_id: number;
  fcm_token: string;
}

export const sendTokenToBackend = async (token: string, userId: number) => {
  try {
    const response = await fetch(`${API_BASE_URL}/fcm/register-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: userId, fcm_token: token }),
    });
    if (!response.ok) {
      throw new Error("Error registrando token");
    }
    return await response.json();
  } catch (error) {
    console.error("Error enviando token al backend:", error);
  }
};
