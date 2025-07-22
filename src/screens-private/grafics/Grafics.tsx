import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from "@ionic/react";
import GraficsDashboard from "../../features-modular/recharst/components-grafics/GraficsDashboard";

const Grafics: React.FC = () => (
  <IonPage>
    
    <IonHeader>
      <IonToolbar>
        <IonTitle>Dashboard Estadísticas</IonTitle>
      </IonToolbar>
    </IonHeader>

    <IonContent className="ion-padding">
      <GraficsDashboard />
    </IonContent>
  </IonPage>
);

export default Grafics;
