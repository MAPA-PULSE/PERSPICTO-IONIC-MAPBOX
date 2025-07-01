import { IonContent, IonHeader, IonButton, IonPage, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/react';
import ExploreContainer from '../components/ExploreContainer';
import './Login.css';

const Login: React.FC = () => {
  return (
    <IonPage>
      <IonContent fullscreen>

        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">Login</IonTitle>
          </IonToolbar>
        </IonHeader>

        <ExploreContainer name="Login page" />

        <IonButton expand="block" fill="outline" color="medium" routerLink="/pages">
          Volver
        </IonButton>
        
      </IonContent>
    </IonPage>
  );
};

export default Login;
