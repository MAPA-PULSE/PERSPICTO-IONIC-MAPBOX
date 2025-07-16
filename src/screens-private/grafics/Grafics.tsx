import React from "react";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonText } from "@ionic/react";
import { useSearchStats } from "../../common/hooks/useStatistics";
import { StatsChart } from "../../common/components/statschart/StatsChart";

const Grafics: React.FC = () => {
  const { data, loading, error } = useSearchStats();

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Dashboard Estadísticas</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        {loading && <IonSpinner name="dots" />}
        {error && <IonText color="danger">{error}</IonText>}
        {!loading && !error && data.length === 0 && (
          <IonText>No hay datos disponibles.</IonText>
        )}
        {!loading && !error && data.length > 0 && (
          <StatsChart data={data} />
        )}
      </IonContent>
    </IonPage>
  );
};

export default Grafics;
