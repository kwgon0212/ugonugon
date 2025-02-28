import React, { useRef } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Header from "@/components/Header";
import Main from "@/components/Main";
// 헤더 아이콘
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
// 전자 서명판
import SignatureCanvas from "react-signature-canvas";

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  background-color: #f5f5f5;
`;

const Head = styled.div`
  display: flex;
  align-self: start;
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 20px;
  margin-top: 20px;
  padding-left: 15px;
  color: #333;
`;

const ClearButton = styled.button`
  display: flex;
  justify-content: center;
  text-align: center;
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 10px;
  font-weight: bold;
  cursor: pointer;
  width: 200px;

  &:hover {
    background-color: #357abd;
  }
`;

const NextButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 50px;
  border-radius: 10px;
  color: white;

  &:hover {
    background-color: #196b78;
  }
`;

export const RegisterSignPage = () => {
  const signaturePadRef = useRef<SignatureCanvas | null>(null);

  // 서명 초기화
  const handleClearSignature = () => {
    if (!signaturePadRef.current) return;
    signaturePadRef.current.clear();
  };

  // 서명 저장 후 다운로드
  const handleSaveSignature = () => {
    if (!signaturePadRef.current) return;
    const dataURL = signaturePadRef.current.toDataURL("image/png");
    const link = document.createElement("a");
    link.href = dataURL;
    link.download = "signature.png";
    link.click();
  };

  return (
    <>
      <Header>
        <div className="relative flex flex-col justify-center w-full h-full">
          <div className="flex flex-row justify-between pl-5 pr-5">
            <Link to="/register/address">
              <ArrowLeftIcon />
            </Link>
            <Link to="/login">
              <CancelIcon />
            </Link>
          </div>
          <div className="absolute bottom-0 bg-main-color h-[3px] w-[217.2px]" />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <>
          <Head>서명 등록</Head>
          <Container>
            <div className="flex flex-col justify-items-center items-center w-full h-full px-[20px] mb-11">
              <SignatureCanvas
                ref={signaturePadRef}
                penColor="black"
                backgroundColor="white"
                canvasProps={{
                  className: "signature-canvas flex",
                  style: { width: "100%", height: "250px" },
                }}
              />
              <ClearButton onClick={handleClearSignature}>
                서명 지우기
              </ClearButton>
            </div>

            <div className="absolute bottom-[20px] left-0 w-full px-[20px]">
              <Link to="/register/bank-account" className="w-full">
                <NextButton
                  className="bg-main-color"
                  onClick={handleSaveSignature}
                >
                  다음
                </NextButton>
              </Link>
            </div>
          </Container>
        </>
      </Main>
    </>
  );
};

export default RegisterSignPage;
