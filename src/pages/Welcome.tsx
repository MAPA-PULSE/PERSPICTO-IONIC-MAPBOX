import { IonPage, IonContent, IonButton } from "@ionic/react";
import { useHistory} from "react-router-dom";

const Welcome: React.FC = () => {
  const history = useHistory();

  return (
    <IonPage>
      <IonContent className="ion-padding">
        <h1>Bienvenido a mi App</h1>

        <IonButton expand="block" onClick={() => history.push("/pages/login")}>
          Iniciar Sesión
        </IonButton>

        <IonButton expand="block" onClick={() => history.push("/pages/register")}>
            Registrarse
        </IonButton>

      </IonContent>
    </IonPage>
  );
};

export default Welcome;
