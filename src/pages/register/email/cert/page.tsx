import React, { useState } from "react";
import styled from "styled-components";
import Header from "../../../../components/Header";
import Main from "../../../../components/Main";
import BottomNav from "../../../../components/BottomNav";
import ArrowLeftIcon from "../../../../components/icons/ArrowLeft";
import CancelIcon from "../../../../components/icons/Cancel";

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

function RegisterEmailCertPage() {
  const [nums, setNums] = useState(["", "", "", ""]);

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
        <form className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]">
          <p className="font-semibold text-xl text-center">인증번호 확인</p>
          <div className="flex justify-center">
            {nums.map((v, index) => (
              <CertificationInput
                key={index}
                type="text"
                maxLength={1}
                pattern="\d"
                required
              />
            ))}
          </div>
          <p className="font-semibold text-sm text-center">
            아직 인증 번호를 받지 못하셨나요?
          </p>
          <a className="text-main-color text-xs text-center" href="#">
            인증번호 재전송
          </a>
          <BottomButton>인증번호 전송</BottomButton>
          {/* <BottomButton>인증번호 전송</BottomButton> */}
        </form>
      </Main>
    </>
  );
}

export default RegisterEmailCertPage;
