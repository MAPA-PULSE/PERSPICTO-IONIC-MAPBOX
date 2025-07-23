import React, { useEffect, useState } from "react";
import {
  IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem,
  IonLabel, IonButton, IonText, IonSpinner, IonToast
} from "@ionic/react";
import API_BASE_URL from "../../../common/api/api";

interface PdfFile {
  id: string;
  filename: string;
  uploadDate?: string;
  length: number;
}

const PdfListPage: React.FC = () => {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const API_BASE = "/mongo"; // Cambia si tu backend tiene otra ruta base

  useEffect(() => {
    fetchPdfs();
  }, []);

const fetchPdfs = async () => {
  setLoading(true);
  try {
    const res = await fetch(`${API_BASE_URL}/mongo/list-pdfs/`);
    const data = await res.json();
    console.log("PDFs recibidos:", data); // <-- asegúrate que llegue al frontend
    setPdfs(data);
  } catch (e) {
    console.error("Error al cargar PDFs:", e);
    setToastMessage("Error al cargar PDFs");
  } finally {
    setLoading(false);
  }
};


  const downloadPdf = (id: string, filename: string) => {
    const url = `${API_BASE}/download-pdf/${id}`;
    const a = document.createElement("a");
    a.href = url;
    a.download = filename || "archivo.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Lista de PDFs</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonText>
          <h2>Archivos PDF Subidos</h2>
        </IonText>
        {loading ? (
          <IonSpinner name="dots" />
        ) : (
          <IonList>
            {pdfs.length === 0 ? (
              <IonText>No hay archivos PDF disponibles.</IonText>
            ) : (
              pdfs.map((pdf) => (
                <IonItem key={pdf.id}>
                  <IonLabel>
                    <strong>{pdf.filename}</strong>
                    <br />
                    <small>
                      {pdf.uploadDate
                        ? new Date(pdf.uploadDate).toLocaleString()
                        : "Sin fecha"}
                      {" - "}
                      {Math.round(pdf.length / 1024)} KB
                    </small>
                  </IonLabel>
                  <IonButton onClick={() => downloadPdf(pdf.id, pdf.filename)} size="small">
                    Descargar
                  </IonButton>
                </IonItem>
              ))
            )}
          </IonList>
        )}
        <IonToast
          isOpen={!!toastMessage}
          message={toastMessage || ""}
          duration={3000}
          onDidDismiss={() => setToastMessage(null)}
        />
      </IonContent>
    </IonPage>
  );
};

export default PdfListPage;
