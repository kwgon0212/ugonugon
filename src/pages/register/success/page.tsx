import React from "react";
import styled from "styled-components";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import ArrowLeftIcon from "../../../components/icons/ArrowLeft";
import CancelIcon from "../../../components/icons/Cancel";
import SuccessIcon from "../../../components/icons/SuccessIcon";

const BottomButton = styled.button`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: #0b798b;
  color: white;
`;

function RegisterSuccessPage() {
  return (
    <>
      <Header>
        <div className="px-5 h-full flex justify-between flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} />
          <CancelIcon width={24} height={24} />
          {/* <hr /> */}
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]">
          <p className="font-semibold text-xl">환영합니다!</p>
          <p className="text-main-darkGray">
            회원가입이 무사히 완료됐어요!
            <br />
            다양한 서비스를 자유롭게 이용해보세요!
          </p>
          <div className="mt-[81px] flex justify-center">
            <SuccessIcon />
          </div>
          <BottomButton>인증번호 전송</BottomButton>
        </div>
      </Main>
    </>
  );
}

export default RegisterSuccessPage;
