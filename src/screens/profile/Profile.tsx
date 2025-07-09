import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonLoading, IonText, IonToast, IonButton, IonAlert } from "@ionic/react";
import axios from "axios";
import { User } from "../../index";
import { auth } from "../../firebase";
import ProfileViewEdit from "./ProfileViewEdit";
import API_BASE_URL from "../../api";
import { signOut } from "firebase/auth";
import { useHistory } from "react-router-dom";

const Profile: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const history = useHistory();

  useEffect(() => {
    const fetchUserProfile = async () => {
      const currentUser = auth.currentUser;

      if (!currentUser) {
        setError("Usuario no autenticado");
        setLoading(false);
        return;
      }

      try {
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

    fetchUserProfile();
  }, []);

  const handleSave = async (updatedUser: User) => {
    if (!user) return;
    setLoading(true);
    setError("");

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
      setShowToast(true);
    } catch {
      setError("Error al actualizar perfil");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    try {
      const currentUser = auth.currentUser;
      if (!currentUser) throw new Error("Usuario no autenticado");
      const token = await currentUser.getIdToken();

      await axios.delete(`${API_BASE_URL}/users/me`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setToastMessage("Usuario eliminado");
      setShowToast(true);
      await signOut(auth); // 👈 Cierra sesión después de eliminar
      history.push("/login"); // 👈 Redirige
    } catch {
      setError("Error al eliminar usuario");
    } finally {
      setDeleting(false);
      setShowDeleteAlert(false);
    }
  };

  const handleLogout = async () => {
    try {
      await signOut(auth); // 👈 Cierra sesión con Firebase
      history.push("/login"); // 👈 Redirige a la pantalla de login
    } catch (err) {
      setError("Error al cerrar sesión");
    }
  };

  if (loading) {
    return (
      <IonPage>
        <IonContent fullscreen>
          <IonLoading isOpen message="Cargando perfil..." />
        </IonContent>
      </IonPage>
    );
  }

  if (error) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <IonText color="danger">{error}</IonText>
        </IonContent>
      </IonPage>
    );
  }

  if (!user) {
    return (
      <IonPage>
        <IonContent fullscreen className="ion-padding">
          <IonText>No hay datos de usuario disponibles.</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent fullscreen className="ion-padding">
        <ProfileViewEdit user={user} onSave={handleSave} />

        <IonButton color="medium" expand="block" onClick={handleLogout}>
          Cerrar sesión
        </IonButton>

        <IonButton color="danger" expand="block" onClick={() => setShowDeleteAlert(true)} disabled={deleting}>
          {deleting ? "Eliminando..." : "Eliminar Cuenta"}
        </IonButton>

        <IonAlert
          isOpen={showDeleteAlert}
          onDidDismiss={() => setShowDeleteAlert(false)}
          header={"Confirmar eliminación"}
          message={"¿Estás seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer."}
          buttons={[
            { text: "Cancelar", role: "cancel" },
            { text: "Eliminar", handler: handleDelete, cssClass: "danger" },
          ]}
        />

        <IonToast
          isOpen={showToast}
          message={toastMessage}
          duration={3000}
          onDidDismiss={() => setShowToast(false)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Profile;
