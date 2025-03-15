import React, { useState } from "react";
import Modal from "./Modal";
import SubmitButton from "./SubmitButton";

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
  const [isOpenModal, setIsOpenModal] = useState(false);
  return (
    <>
      <button
        // onClick={downloadPDF}
        onClick={() => setIsOpenModal(true)}
        style={{ padding: "10px 20px", fontSize: "16px" }}
      >
        PDF 다운로드
      </button>
      <Modal
        isOpen={isOpenModal}
        setIsOpen={setIsOpenModal}
        clickOutsideClose={false}
      >
        <h1>hi</h1>
        <SubmitButton onClick={() => setIsOpenModal(false)}>닫기</SubmitButton>
      </Modal>
    </>
  );
};

export default PDFButton;
