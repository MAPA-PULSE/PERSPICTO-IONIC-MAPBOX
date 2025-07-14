import axios from "axios";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../firebase";
import API_BASE_URL from "../api";

interface RegisterParams {
  name: string;
  email: string;
  password: string;
  setShowToast: (show: boolean) => void;
  setToastMessage: (message: string) => void;
  history: any;
}

export const handleRegister = async ({
  name,
  email,
  password,
  setShowToast,
  setToastMessage,
  history,
}: RegisterParams): Promise<{ success: boolean; message: string }> => {
  try {
    if (!name || !email || !password) {
      const msg = "Por favor completa todos los campos";
      setToastMessage(msg);
      setShowToast(true);
      return { success: false, message: msg };
    }

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebase_uid = userCredential.user.uid;

    await axios.post(`${API_BASE_URL}/users/register`, {
      name,
      email,
      firebase_uid,
    });

    const successMsg = "Registro exitoso";
    setToastMessage(successMsg);
    setShowToast(true);

    setTimeout(() => {
      history.push("/login");
    }, 2000);

    return { success: true, message: successMsg };
  } catch (error: any) {
    const detail = error.response?.data?.detail ?? error.message ?? "Error desconocido";
    const errMsg = "Error al registrar: " + detail;
    setToastMessage(errMsg);
    setShowToast(true);
    return { success: false, message: errMsg };
  }
};
