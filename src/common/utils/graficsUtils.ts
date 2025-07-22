// import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import axios from "axios";
import API_BASE_URL from "../api/api";

export interface ReportData {
  title: string;
  content: string;
  created_at: string;
}


export const generatePDFBlobFromSVG = async (): Promise<Blob> => {
  const svgElement = document.querySelector("#chart-container svg") as SVGSVGElement;
  if (!svgElement) throw new Error("SVG no encontrado en #chart-container");

  const serializer = new XMLSerializer();
  const svgString = serializer.serializeToString(svgElement);
  const svgBlob = new Blob([svgString], { type: "image/svg+xml;charset=utf-8" });
  const url = URL.createObjectURL(svgBlob);

  const image = new Image();
  const canvas = document.createElement("canvas");
  canvas.width = svgElement.clientWidth;
  canvas.height = svgElement.clientHeight;
  const ctx = canvas.getContext("2d");

  return new Promise((resolve, reject) => {
    image.onload = () => {
      ctx?.drawImage(image, 0, 0);
      URL.revokeObjectURL(url);

      const imgData = canvas.toDataURL("image/png");
      const pdf = new jsPDF({
        orientation: "landscape",
        unit: "pt",
        format: [canvas.width, canvas.height],
      });

      pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
      resolve(pdf.output("blob"));
    };

    image.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Error cargando imagen desde SVG"));
    };

    image.src = url;
  });
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