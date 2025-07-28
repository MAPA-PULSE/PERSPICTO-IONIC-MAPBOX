import React, { useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonInput, IonItem, IonLabel,
  IonContent, IonButton, IonIcon, IonText, IonSpinner, IonSelect, IonSelectOption, IonToast
} from "@ionic/react";
import { refresh, cloudUpload, save } from "ionicons/icons";

import { useSearchStats } from "../hooks/useStatistics";
import { StatsChart } from "../components-grafics/StatsChart";
import {
  generatePDFBlobFromSVG,
  uploadPDFToMongo,
  uploadReportToMongo,
  ReportData,
} from "../utils/graficsUtils";



const GraficsDashboard: React.FC = () => {
  const { data, loading, error, refetch } = useSearchStats();
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [filename, setFilename] = useState("reporte_estadisticas");
  const [chartType, setChartType] = useState<"line" | "bar" | "area" | "radar">("line");

  const handleGenerateAndUploadPDF = async () => {
    try {
      const pdfBlob = await generatePDFBlobFromSVG();
      await uploadPDFToMongo(pdfBlob, filename || "reporte_estadisticas.pdf");
      setToastMessage("PDF subido exitosamente a MongoDB");
    } catch (error) {
      console.error(error);
      setToastMessage("Error al subir el PDF a MongoDB");
    }
  };

  const handleSavePDF = async () => {
    try {
      const pdfBlob = await generatePDFBlobFromSVG();
      const url = URL.createObjectURL(pdfBlob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${filename || "reporte_estadisticas"}.pdf`;
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
    link.download = `${filename || "estadisticas"}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setToastMessage("JSON descargado correctamente");
  };

  const handleUploadJSON = async () => {
    try {
      const report: ReportData = {
        title: filename || "Estadísticas de uso",
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
      <IonContent className="ion-padding">
        {loading && <IonSpinner name="dots" />}
        {error && <IonText color="danger">{error}</IonText>}
        {!loading && !error && data.length === 0 && (
          <IonText>No hay datos disponibles.</IonText>
        )}
        {!loading && !error && (
          <>
            <div className="ion-margin-bottom ion-padding-start flex gap-2 ion-justify-content-start ion-wrap">
              <IonText className="ion-margin-top">Nombre del archivo:</IonText>
              <IonInput
                value={filename}
                placeholder="Nombre del archivo"
                onIonChange={(e) => setFilename(e.detail.value!)}
                className="ion-margin-bottom"
              />

              <IonButton onClick={refetch} color="primary">
                <IonIcon icon={refresh} slot="start" />
                Actualizar Info
              </IonButton>

              <IonButton color="success" onClick={handleSavePDF}>
                <IonIcon icon={save} slot="start" />
                Guardar PDF
              </IonButton>

              <IonButton color="medium" onClick={handleDownloadJSON}>
                <IonIcon icon={save} slot="start" />
                Descargar JSON
              </IonButton>

              <IonButton color="tertiary" onClick={handleUploadJSON}>
                <IonIcon icon={cloudUpload} slot="start" />
                Guardar JSON DataBase {/*en MongoDB */} 
              </IonButton>

              <IonButton color="warning" onClick={handleGenerateAndUploadPDF}>
                <IonIcon icon={cloudUpload} slot="start" />
                Subir PDF Files{/*a MongoDB*/}
              </IonButton>
            </div>
            <IonItem>
              <IonLabel>Tipo de gráfico</IonLabel>
              <IonSelect
                value={chartType}
                placeholder="Selecciona tipo"
                onIonChange={(e) => setChartType(e.detail.value)}
              >
                <IonSelectOption value="line">Líneas</IonSelectOption>
                <IonSelectOption value="bar">Barras</IonSelectOption>
                <IonSelectOption value="area">Área</IonSelectOption>
                <IonSelectOption value="radar">Radar</IonSelectOption>
              </IonSelect>
            </IonItem>
            <div id="chart-container">
              <StatsChart data={data} type={chartType} />
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

export default GraficsDashboard;