// PERSPICTO-IONIC-MAPBOX\src\screens-private\profile\Profile.tsx
import React, { useEffect, useState } from "react";
import { IonPage, IonContent, IonLoading, IonText, IonToast, IonButton, IonAlert } from "@ionic/react";
import { User } from "../../index";
import { fetchUserProfile, updateUserProfile, deleteUserAccount, logoutUser } from "../../common/utils/profileUtils";
import ProfileViewEdit from "./ProfileViewEdit";
import { auth } from "../../common/firebase/firebase";
import { useHistory } from "react-router-dom";
import "./Profile.css"
//import { CustomButtonProps } from "../../common/components/custtombutton/CustomButton";
import {ImgOlivia} from "../../../public/assets/jesus-olivia-wilson.png"

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
    fetchUserProfile(setUser, setError, setLoading);
  }, []);

  const handleSave = async (updatedUser: User) => {
    setLoading(true);
    setError("");

    const success = await updateUserProfile(updatedUser, setUser, setToastMessage, setError);
    setShowToast(success);
    setLoading(false);
  };

  const handleDelete = async () => {
    setDeleting(true);
    setError("");

    const success = await deleteUserAccount(setToastMessage, setError);
    if (success) {
      setShowToast(true);
      await logoutUser(auth, history);
    }
    setDeleting(false);
    setShowDeleteAlert(false);
  };
  const handleLogout = async () => {
    const success = await logoutUser(auth, history);
    if (!success) setError("Error al cerrar sesión");

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
          <IonText color="danger">No hay datos de usuario disponibles.</IonText>
        </IonContent>
      </IonPage>
    );
  }

  return (
    <IonPage>
      <IonContent className="ion-padding">
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
