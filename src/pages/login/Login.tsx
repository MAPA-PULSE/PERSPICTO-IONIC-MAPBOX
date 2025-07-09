import { IonPage, IonContent, IonInput, IonButton, IonLabel, IonItem, IonList, IonToast } from "@ionic/react";
import { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { auth } from "../../firebase"; // Ajusta la ruta según tu proyecto
import { handleLogin } from "./loginUtils";
import "./Login.css";

const Login: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const history = useHistory();

   useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user) {
        history.replace("/profile");
      }
    });

    return () => unsubscribe();
  }, [history]);

  const onLogin = async () => {
    const { success, message } = await handleLogin(email, password);
    setToastMessage(message);
    setShowToast(true);
    if (success) {
      setTimeout(() => history.push("/home"), 1500);
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

        <IonButton expand="block" color="success" onClick={onLogin}>
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

