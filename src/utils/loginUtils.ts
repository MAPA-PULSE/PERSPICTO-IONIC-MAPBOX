import { signInWithEmailAndPassword } from "firebase/auth";
import axios from "axios";
import API_BASE_URL from "../api";
import { auth } from "../firebase";


export const handleLogin = async (email: string, password: string) => {
  try {
    if (!email || !password) {
      return { success: false, message: "Por favor, completa todos los campos" };
    }

    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebase_uid = userCredential.user.uid;

    await axios.post(`${API_BASE_URL}/users/login`, {
      email,
      firebase_uid,
    });

    return { success: true, message: "Inicio de sesión correcto" };
  } catch (error: any) {
    console.error(error);
    const detail = error.response?.data?.detail ?? error.message ?? "Error desconocido";
    return { success: false, message: "Error al iniciar sesión: " + detail };
  }
};
