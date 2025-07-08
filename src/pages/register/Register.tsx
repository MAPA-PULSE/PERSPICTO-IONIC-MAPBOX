import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonItem, IonList, IonToast } from "@ionic/react";
import { useState } from "react";
import axios from "axios";
import "./Register.css";
import { useHistory } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Ajusta la ruta si es necesario
import API_BASE_URL from "../../api";

const Register: React.FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

  
const handleRegister = async () => {
  try {
    if (!name || !email || !password) {
      setToastMessage("Por favor completa todos los campos");
      setShowToast(true);
      return;
    }

    // 1. Registro en Firebase Auth
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const firebase_uid = userCredential.user.uid;

    // 2. Enviar datos al backend, enviando el UID correcto
    const response = await axios.post(`${API_BASE_URL}/users/register`, {
      name,
      email,
      firebase_uid,
    });

    console.log(response.data);
    setToastMessage("Registro exitoso");
    setShowToast(true);

    setTimeout(() => {
      history.push("/login");
    }, 2000);

  } catch (error: any) {
    console.error(error);
    const detail = error.response?.data?.detail ?? error.message ?? "Error desconocido";
    setToastMessage("Error al registrar: " + detail);
    setShowToast(true);
  }
};

 const clearFields = () => {
    setName("");
    setEmail("");
    setPassword("");
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

        <IonButton expand="block" color="success"  onClick={handleRegister}>
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
