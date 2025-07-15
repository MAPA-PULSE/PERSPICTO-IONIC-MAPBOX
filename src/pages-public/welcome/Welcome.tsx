import { IonPage, IonContent, IonSegment, IonSegmentButton, IonLabel } from "@ionic/react";
import { useHistory } from "react-router-dom";
import "./Welcome.css";

const Welcome: React.FC = () => {
  const history = useHistory();

  const handleSegmentChange = (value: string) => {
    if (value === "login") {
      history.push("/login");
    } else if (value === "register") {
      history.push("/register");
    }
  };

  return (
    <IonPage>
      <IonContent className="ion-padding content-welcome">
        <h1>Bienvenido a mi App</h1>

        <IonSegment
          onIonChange={e => {
            const value = e.detail.value as string | undefined;
            if (value) {
              handleSegmentChange(value);
            }
          }}
          >
          <IonSegmentButton value="login">
            <IonLabel onClick={() => handleSegmentChange("login")}>Iniciar Sesión</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="register">
            <IonLabel onClick={() => handleSegmentChange("register")}>Registrarse</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
