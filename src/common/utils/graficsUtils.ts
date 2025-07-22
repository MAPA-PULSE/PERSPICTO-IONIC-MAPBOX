import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import API_BASE_URL from "../api/api";

export interface ReportData {
  title: string;
  content: string;
  created_at: string;
}

export const generatePDFBlob = async (elementId: string): Promise<Blob> => {
  const element = document.getElementById(elementId);
  if (!element) throw new Error("Elemento no encontrado");

  const canvas = await html2canvas(element);
  const imgData = canvas.toDataURL("image/png");

  const pdf = new jsPDF();
  const imgProps = pdf.getImageProperties(imgData);
  const pdfWidth = 190;
  const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

  pdf.text("Reporte de Estadísticas", 10, 10);
  pdf.addImage(imgData, "PNG", 10, 20, pdfWidth, pdfHeight);

  return pdf.output("blob");
};

export const uploadPDFToMongo = async (pdfBlob: Blob) => {
  const formData = new FormData();
  formData.append("file", pdfBlob, "reporte_estadisticas.pdf");

  try {
    const response = await axios.post(`${API_BASE_URL}/mongo/upload-pdf/`, formData);
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
