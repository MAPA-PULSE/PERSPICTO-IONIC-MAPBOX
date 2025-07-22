import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle,
  IonContent, IonButton, IonIcon, IonText, IonSpinner, IonToast
} from "@ionic/react";
import { refresh, cloudUpload, save } from "ionicons/icons";

import { useSearchStats } from "../../common/hooks/useStatistics";
import { StatsChart } from "../../common/components/statschart/StatsChart";
import {
  generatePDFBlob,
  uploadPDFToMongo,
  uploadReportToMongo,
  ReportData,
} from "../../common/utils/graficsUtils";

const Grafics: React.FC = () => {
  const { data, loading, error, refetch } = useSearchStats();
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const handleGenerateAndUploadPDF = async () => {
    try {
      const pdfBlob = await generatePDFBlob("chart-container");
      await uploadPDFToMongo(pdfBlob);
      setToastMessage("PDF subido exitosamente a MongoDB");
    } catch (error) {
      console.error(error);
      setToastMessage("Error al subir el PDF a MongoDB");
    }
  };

  const handleSavePDF = async () => {
    try {
      const pdfBlob = await generatePDFBlob("chart-container");
      const url = URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "reporte_estadisticas.pdf";
      a.click();
      URL.revokeObjectURL(url);
      setToastMessage("PDF descargado correctamente");
    } catch (error) {
      console.error(error);
      setToastMessage("Error al generar el PDF");
    }
  };

  const handleDownloadJSON = () => {
    const json = JSON.stringify(data, null, 2);
    const blob = new Blob([json], { type: "application/json" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "estadisticas.json";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToastMessage("JSON descargado correctamente");
  };

  const handleUploadJSON = async () => {
    try {
      const report: ReportData = {
        title: "Estadísticas de uso",
        content: JSON.stringify(data, null, 2),
        created_at: new Date().toISOString(),
      };
      await uploadReportToMongo(report);
      setToastMessage("Informe guardado en MongoDB");
    } catch (error) {
      console.error(error);
      setToastMessage("Error al guardar en MongoDB");
    }
  };


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
        {!loading && !error &&  (
          <>
            <div className="ion-margin-bottom ion-padding-start flex gap-2 ion-justify-content-start ion-wrap">
              <IonButton onClick={refetch} color="primary">
                <IonIcon icon={refresh} slot="start" />
                Actualizar
              </IonButton>

              <IonButton color="success" onClick={handleSavePDF}>
                <IonIcon icon={save} slot="start" />
                Guardar como PDF
              </IonButton>

              <IonButton color="medium" onClick={handleDownloadJSON}>
                <IonIcon icon={save} slot="start" />
                Descargar JSON
              </IonButton>

              <IonButton color="tertiary" onClick={handleUploadJSON}>
                <IonIcon icon={cloudUpload} slot="start" />
                Guardar JSON en MongoDB
              </IonButton>

              <IonButton color="warning" onClick={handleGenerateAndUploadPDF}>
                <IonIcon icon={cloudUpload} slot="start" />
                Subir PDF a MongoDB
              </IonButton>
            </div>

            <div id="chart-container">
              <StatsChart data={data} />
            </div>
          </>
        )}

        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage || ""}
          duration={2000}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default Grafics;
