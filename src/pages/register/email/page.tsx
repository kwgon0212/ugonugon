import React from "react";
import styled from "styled-components";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import BottomNav from "../../../components/BottomNav";
import ArrowLeftIcon from "../../../components/icons/ArrowLeft";
import CancelIcon from "../../../components/icons/Cancel";

const InsertTextInput = styled.input`
  width: 100%;
  height: 50px;
  background: white;
  border-radius: 10px;
  padding: 0 20px;

  ::placeholder {
    padding: 0 20px;
    color: #d9d9d9;
    font-size: 14px;
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

function RegisterEmailPage() {
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
          <p className="font-semibold text-xl">이메일 인증</p>
          <p className="text-main-darkGray">
            원활한 서비스 이용을 위한
            <br />
            계정에 사용할 이메일 계정을 입력해주세요.
          </p>
          <InsertTextInput
            type="text"
            placeholder="이메일 계정"
            className="w-full h-[50px] bg-white rounded-[10%]"
          />
        </div>
      </Main>
      <BottomNav>
        <div className="pb-15 px-5">
          <BottomButton>인증번호 전송</BottomButton>
        </div>
      </BottomNav>
    </>
  );
}

export default RegisterEmailPage;
