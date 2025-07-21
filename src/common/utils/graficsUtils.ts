import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";

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

  const response = await axios.post("/upload-pdf/", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

  return response.data;
};

export const uploadReportToMongo = async (report: ReportData) => {
  const response = await axios.post("/statistics_reports", report);
  return response.data;
};
