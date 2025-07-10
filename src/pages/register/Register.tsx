import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonItem, IonList, IonToast } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import { handleRegister } from "./registerUtils";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

 const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
  };
  
   const handleSubmit = async () => {
    const { success, message } = await handleRegister({
      name,
      email,
      password,
      setShowToast,
      setToastMessage,
      history,
    });

    if (success) clearFields();
  };

  return (
    <IonPage>
      <IonContent className="ion-padding register-content">
        <h2 className="title">Perspicto</h2>

        <IonList>
          <IonItem>
            <IonLabel position="stacked">Nombre</IonLabel>
            <IonInput value={name} onIonChange={(e) => setName(e.detail.value!)} />
          </IonItem>

          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
          </IonItem>
        </IonList>

        <IonButton expand="block" color="medium" onClick={clearFields}>
          Limpiar
        </IonButton>

        <IonButton expand="block" color="success"  onClick={handleSubmit}>
          Registrarse
        </IonButton>

        <p>¿Ya tienes una cuenta? <a href="/login">Inicia sesión</a></p>

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

export default Register;
