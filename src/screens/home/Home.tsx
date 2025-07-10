import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import './Home.css';
import MapboxMapHome from '../../components/mapboxhome/MapboxHome';
import React from 'react';


const Home: React.FC = () => {

  return (
    <IonPage>
      <IonContent  className="ion-padding">
      <IonHeader>
        <IonToolbar>
          <IonTitle>Home</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen>
        <IonHeader collapse="condense">
          {/* <IonToolbar> */}
            {/* <IonTitle size="large">Tab 1</IonTitle> */}
          {/* </IonToolbar> */}
        </IonHeader>

        <MapboxMapHome />
      </IonContent>
      </IonContent>
    </IonPage>
  );
};

export default Home;
