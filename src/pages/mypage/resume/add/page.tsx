import React from "react";
import styled from "styled-components";
import Header from "../../../../components/Header";
import Main from "../../../../components/Main";
import ArrowLeftIcon from "../../../../components/icons/ArrowLeft";
import CancelIcon from "../../../../components/icons/Cancel";
import SuccessIcon from "../../../../components/icons/SuccessIcon";

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

function MypageResumeCreate() {
  return (
    <>
      <Header>
        <div className="px-5 h-full flex justify-between flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} />
          <CancelIcon width={24} height={24} />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <form className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]">
          <div>제목</div>
          <div>회원 정보</div>
          <div>최종 학력</div>
          <div>희망 근무지</div>
          <div>희망 근무 기간</div>
          <div>자기 소개</div>
          <BottomButton>이력서 등록</BottomButton>
        </form>
      </Main>
    </>
  );
}

export default MypageResumeCreate;
