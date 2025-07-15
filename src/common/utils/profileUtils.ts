import axios from "axios";
import API_BASE_URL from "../../common/api/api";
import { auth } from "../../common/firebase/firebase";
import { User } from "../../index";
import { History } from "history";

export const fetchUserProfile = async (
  setUser: (user: User) => void,
  setError: (msg: string) => void,
  setLoading: (state: boolean) => void
) => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Usuario no autenticado");

    const token = await currentUser.getIdToken();
    const response = await axios.get<User>(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    setUser(response.data);
  } catch {
    setError("Error al obtener perfil");
  } finally {
    setLoading(false);
  }
};

export const updateUserProfile = async (
  updatedUser: User,
  setUser: (user: User) => void,
  setToastMessage: (msg: string) => void,
  setError: (msg: string) => void
): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Usuario no autenticado");

    const token = await currentUser.getIdToken();
    await axios.put(
      `${API_BASE_URL}/users/me`,
      { name: updatedUser.name, email: updatedUser.email },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setUser(updatedUser);
    setToastMessage("Perfil actualizado");
    return true;
  } catch {
    setError("Error al actualizar perfil");
    return false;
  }
};

export const deleteUserAccount = async (
  setToastMessage: (msg: string) => void,
  setError: (msg: string) => void
): Promise<boolean> => {
  try {
    const currentUser = auth.currentUser;
    if (!currentUser) throw new Error("Usuario no autenticado");

    const token = await currentUser.getIdToken();
    await axios.delete(`${API_BASE_URL}/users/me`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setToastMessage("Usuario eliminado");
    return true;
  } catch {
    setError("Error al eliminar usuario");
    return false;
  }
};

export const logoutUser = async (
  authInstance: typeof auth,
  history: History
): Promise<boolean> => {
  try {
    await authInstance.signOut();
    history.push("/login");
    return true;
  } catch {
    return false;
  }
};
