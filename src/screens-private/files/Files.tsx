import React from 'react';
import "./Files.css";
import { IonContent, IonPage } from '@ionic/react';
import PdfList from "../../features-modular/recharst/components-grafics/PdfList"
const Files: React.FC = () => {
  return (
    <IonPage  >
      <IonContent className="ion-padding">
        <h1>Registro de documentos</h1>
        <PdfList />
      </IonContent>
    </IonPage>

  )
};

export default Files;
