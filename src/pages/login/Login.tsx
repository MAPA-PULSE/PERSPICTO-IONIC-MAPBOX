import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonItem, IonList, IonToast } from "@ionic/react";
import { useState } from "react";
import { useHistory } from "react-router-dom";
import axios from "axios";
import "./Login.css";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

const handleLogin = async () => {
  try {
    if (!email || !password) {
      setToastMessage("Por favor, completa todos los campos");
      setShowToast(true);
      return;
    }

    // 1. Login en Firebase Auth
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    const firebase_uid = userCredential.user.uid;

    // 2. Enviar al backend para validar y obtener datos del usuario
    const response = await axios.post("http://localhost:8000/users/login", {
      email,
      firebase_uid,
    });

    console.log(response.data);
    setToastMessage("Inicio de sesión correcto");
    setShowToast(true);

    setTimeout(() => {
      history.push("/home");
    }, 1500);

  } catch (error: any) {
    console.error(error);
    const detail = error.response?.data?.detail ?? error.message ?? "Error desconocido";
    setToastMessage("Error al iniciar sesión: " + detail);
    setShowToast(true);
  }
};
  return (
    <IonPage>
      <IonContent className="ion-padding login-content">
        <h2 className="title">Perspicto</h2>

        <IonList>
          <IonItem>
            <IonLabel position="stacked">Email</IonLabel>
            <IonInput type="email" value={email} onIonChange={(e) => setEmail(e.detail.value!)} />
          </IonItem>
          <IonItem>
            <IonLabel position="stacked">Contraseña</IonLabel>
            <IonInput type="password" value={password} onIonChange={(e) => setPassword(e.detail.value!)} />
          </IonItem>
        </IonList>

        <IonButton expand="block" color="success" onClick={handleLogin}>
          Iniciar sesión
        </IonButton>

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

export default Login;

