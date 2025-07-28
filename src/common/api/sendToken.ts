import axios from "axios";
const API_BASE_URL = "http://10.0.2.2:8000"; // IP backend desde Android Emulator

export async function sendTokenToBackend(token: string, userId: number) {
  return axios.post(`${API_BASE_URL}/fcm/register-token`, {
    user_id: userId,
    token: token
  });
}
