import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import API_BASE_URL from "../../../common/api/api";

export interface ReportData {
  title: string;
  content: string;
  created_at: string;
}


export const generatePDFBlobFromSVG = async (): Promise<Blob> => {
  const chartElement = document.getElementById("chart-container");
  if (!chartElement) throw new Error("No se encontró el gráfico");

  const canvas = await html2canvas(chartElement, { scale: 2 } as any);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF({
    orientation: "landscape",
    unit: "pt",
    format: [canvas.width, canvas.height],
  });

  pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
  return pdf.output("blob");
};

export const uploadPDFToMongo = async (pdfBlob: Blob) => {
  const formData = new FormData();
  formData.append("file", pdfBlob, "reporte_estadisticas.pdf");

  try {
    const response = await axios.post(`${API_BASE_URL}/mongo/upload-pdf/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  } catch (error) {
    console.error("Error al subir PDF:", error);
    throw error;
  }
};

export const uploadReportToMongo = async (report: ReportData) => {
  const response = await axios.post(`${API_BASE_URL}/mongo/statistics_reports`, report);
  return response.data;
};