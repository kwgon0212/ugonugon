import React from "react";

const downloadPDF = async () => {
  try {
    const response = await fetch("/api/contract");
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "contract.pdf";
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  } catch (error) {
    console.error("PDF 다운로드 오류:", error);
  }
};

const PDFButton: React.FC = () => {
  return (
    <button
      onClick={downloadPDF}
      style={{ padding: "10px 20px", fontSize: "16px" }}
    >
      PDF 다운로드
    </button>
  );
};

export default PDFButton;
