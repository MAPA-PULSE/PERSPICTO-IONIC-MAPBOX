import React, { useEffect, useState } from "react";
import API_BASE_URL from "../../../common/api/api";

interface PdfFile {
  id: string;
  filename: string;
  uploadDate?: string;
  length?: number;
}

const PdfList: React.FC = () => {
  const [pdfs, setPdfs] = useState<PdfFile[]>([]);
  const [error, setError] = useState<string | null>(null);

  const fetchPdfs = async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/mongo/list-pdfs/`);
      const data = await res.json();
      setPdfs(data);
    } catch (err) {
      console.error("❌ Error al cargar PDFs:", err);
      setError("Error al cargar la lista de PDFs");
    }
  };

  const downloadPdf = async (id: string, filename: string) => {
    try {
      const res = await fetch(`${API_BASE_URL}/mongo/download-pdf/${id}`);
      if (!res.ok) throw new Error("Descarga fallida");

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (err) {
      console.error("Error al descargar el PDF:", err);
      setError("Error al descargar el PDF");
    }
  };

  useEffect(() => {
    fetchPdfs();
  }, []);

  return (
    <div>
      <h2>📄 Lista de PDFs</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul>
        {pdfs.map((pdf) => (
          <li key={pdf.id} style={{ marginBottom: "12px" }}>
            <strong>{pdf.filename}</strong> — {pdf.uploadDate?.slice(0, 10) || "Sin fecha"}
            <button
              onClick={() => downloadPdf(pdf.id, pdf.filename)}
              style={{ marginLeft: "10px" }}
            >
              Descargar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PdfList;
