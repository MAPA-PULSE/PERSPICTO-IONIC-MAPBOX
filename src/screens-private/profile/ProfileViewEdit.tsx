// PERSPICTO-IONIC-MAPBOX\src\screens-private\profile\ProfileViewEdit.tsx
import React, { useState } from "react";
import {
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonAvatar,
  IonList,
  IonItem,
  IonLabel,
  IonInput,
  IonButton,
} from "@ionic/react";
import { User } from "../../index";
import './ProfileViewEdit.css';


interface ProfileViewEditProps {
  user: User;
  image: Image;
  onSave: (updatedUser: User) => Promise<void>;
}

const ProfileViewEdit: React.FC<ProfileViewEditProps> = ({ user, onSave }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState<User>({ ...user });
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await onSave(editedUser);
    setSaving(false);
    setIsEditing(false);
  };

  if (isEditing) {
    return (
      <IonCard className="profile-card">
  <IonCardHeader>
    <IonCardTitle>
      {isEditing ? "Editar perfil" : `Perfil de ${user.name}`}
    </IonCardTitle>
  </IonCardHeader>
  <IonCardContent>

    <IonAvatar className="profile-avatar">
      <img src={user.image ?? "/assets/jesus-olivia-wilson.png"} alt="Avatar" />
    </IonAvatar>

    {isEditing ? (
      <IonList>
        <IonItem>
          <IonLabel position="stacked">Nombre</IonLabel>
          <IonInput value={editedUser.name} onIonChange={(e) => setEditedUser({ ...editedUser, name: e.detail.value ?? "" })} />
        </IonItem>
        <IonItem>
          <IonLabel position="stacked">Email</IonLabel>
          <IonInput value={editedUser.email} onIonChange={(e) => setEditedUser({ ...editedUser, email: e.detail.value ?? "" })} />
        </IonItem>
        <IonButton expand="block" color="primary" onClick={handleSave} disabled={saving}>
          {saving ? "Guardando..." : "Guardar Cambios"}
        </IonButton>
        <IonButton expand="block" color="medium" onClick={() => setIsEditing(false)} disabled={saving}>
          Cancelar
        </IonButton>
      </IonList>
    ) : (
      <>
        <IonList>
          <IonItem><IonLabel>Nombre: {user.name}</IonLabel></IonItem>
          <IonItem><IonLabel>Email: {user.email}</IonLabel></IonItem>
        </IonList>
        <IonButton expand="block" color="primary" onClick={() => setIsEditing(true)}>Editar perfil</IonButton>
      </>
    )}
  </IonCardContent>
</IonCard>

    );
  }

  // Modo lectura
  return (
    <IonCard className="fade-in">
      <IonCardHeader>
        <IonCardTitle>Perfil de  {user.name}</IonCardTitle>
      </IonCardHeader>
      <IonCardContent>
        <IonAvatar>
          <img src={user.image ?? "/assets/jesus-olivia-wilson.png"} alt="Avatar" />
        </IonAvatar>
        <IonList>
          <IonItem>
            <IonLabel>Nombre: {user.name}</IonLabel>
          </IonItem>
          <IonItem>
            <IonLabel>Email: {user.email}</IonLabel>
          </IonItem>
        </IonList>
        <IonButton expand="block" color="primary" onClick={() => setIsEditing(true)}>
          Editar perfil
        </IonButton>
      </IonCardContent>
    </IonCard>
  );
};

export default ProfileViewEdit;
