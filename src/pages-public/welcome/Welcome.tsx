//PERSPICTO-IONIC-MAPBOX\src\pages-public\welcome\Welcome.tsx
import {
  IonPage,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonHeader,
  IonTitle
} from "@ionic/react";
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
        <IonHeader>
          <IonTitle id="welcome-heading">PERSPICTO</IonTitle>
        </IonHeader>

        <IonSegment
          aria-label="Selector de acceso"
          role="radiogroup"
          onIonChange={(e) => {
            const value = e.detail.value as string | undefined;
            if (value) {
              handleSegmentChange(value);
            }
          }}
        >
          <IonSegmentButton
            value="login"
            aria-label="Iniciar sesión"
            role="radio"
            aria-checked="false"
          >
            <IonLabel>Iniciar Sesión</IonLabel>
          </IonSegmentButton>

          <IonSegmentButton
            value="register"
            aria-label="Registrarse"
            role="radio"
            aria-checked="false"
          >
            <IonLabel>Registrarse</IonLabel>
          </IonSegmentButton>
        </IonSegment>
      </IonContent>
    </IonPage>
  );
};

export default Welcome;
