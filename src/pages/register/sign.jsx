import React, { useState, useRef } from "react";
import { Route, Routes } from "react-router-dom";

import Header from "../../components/Header";
import Main from "../../components/Main";
import BottomNav from "../../components/BottomNav";

import styled from "styled-components";
import SignatureCanvas from "react-signature-canvas";

// 스타일 정의
const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  background-color: #f5f5f5;
`;

const Head = styled.div`
  display: flex;
  font-size: 24px;
  font-weight: bold;
  margin-bottom: 20px;
  color: #333;
`;

const ClearButton = styled.button`
  margin-top: 20px;
  padding: 10px 20px;
  background-color: #4a90e2;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background-color: #357abd;
  }
`;

const Button = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 90%;
  height: 50px;
  margin-top: 10px;
  border-radius: 5px;
  background-color: #0b798b;
  color: white;
`;

export const Sign = () => {
  const signaturePadRef = useRef(null);

  // 서명 초기화
  const clearSignature = () => {
    signaturePadRef.current.clear();
  };

  return (
    <>
      <Header></Header>
      <Main>
        <Container>
          <Head>사인 페이지</Head>
          <SignatureCanvas
            ref={signaturePadRef}
            penColor="black"
            backgroundColor="white"
            canvasProps={{
              width: 500,
              height: 250,
              className: "signature-canvas",
            }}
          />
          <ClearButton onClick={clearSignature}>서명 지우기</ClearButton>
          <Button>다음</Button>
        </Container>
      </Main>
      <BottomNav></BottomNav>
    </>
  );
};

export default Sign;
