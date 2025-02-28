import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import Main from "@/components/Main";
import React from "react";
import styled from "styled-components";

const CertificationInput = styled.input`
  width: 48px;
  height: 48px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  color: #1f2024;
  /* form의 padding으로 해결 못하여 input에 margin 설정 */
  margin: 0 4px;
  caret-color: #0b798b;

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
  }
`;

const BottomButton = styled.button`
  width: 100%;
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: #0b798b;
  color: white;
`;

function RegisterEmailCertPage() {
  return (
    <>
      <Header>
        <div className="px-5 h-full flex justify-between flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} />
          <CancelIcon width={24} height={24} />
          {/* <hr /> */}
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <div className="w-full p-layout p-5 flex flex-col gap-layout divide-[#0b798b]">
          <p className="font-semibold text-xl text-center">인증번호 확인</p>
          <form className="flex justify-center">
            <CertificationInput autoFocus type="text" value="1" />
            <CertificationInput type="text" />
            <CertificationInput type="text" />
            <CertificationInput type="text" />
          </form>
          <p className="font-semibold text-sm text-center">
            아직 인증 번호를 받지 못하셨나요?
          </p>
          <a className="text-main-color text-xs text-center" href="#">
            인증번호 재전송
          </a>
        </div>
      </Main>
      <BottomNav>
        <div className="pb-15 px-5">
          <BottomButton>다음</BottomButton>
        </div>
      </BottomNav>
    </>
  );
}

export default RegisterEmailCertPage;
