//PERSPICTO-IONIC-MAPBOX\src\screens\alerts\Alerts.tsx
import { IonContent, IonPage } from '@ionic/react';
import React from 'react';
import "./Alerts.css"
import Search from '../../features/search/Search';

const Alerts: React.FC = () => {

  return (
  <IonPage>
    <IonContent className="ion-padding">
      {/* <h1>Pruebas</h1> */}
       <Search />
    </IonContent>
  </IonPage>
  )
};

export default Alerts;
