import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

// 카카오 우편번호 검색 api
import DaumPostcode from "react-daum-postcode";

import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import Main from "@/components/Main";

// 우편번호 데이터 타입 정의
interface PostcodeData {
  zonecode: string; // 우편번호
  address: string; // 기본 주소
}

const Head = styled.div`
  display: flex;
  align-self: start;
  margin-bottom: 20px;
  margin-top: 20px;
  padding-left: 20px;
  font-size: 18px;
  font-weight: bold;
`;

const FindBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 140px;
  height: 50px;
  border-radius: 10px;
  color: white;

  &:hover {
    background-color: #196b78;
  }
`;

const NextButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 362px;
  height: 50px;
  border-radius: 10px;
  color: white;

  &:hover {
    background-color: #196b78;
  }
`;

export function RegisterAddressPage() {
  const [postcode, setPostcode] = useState(""); // 우편번호 상태
  const [address, setAddress] = useState(""); // 주소 상태
  const [detailAddress, setDetailAddress] = useState(""); // 상세주소 상태
  const [isPostcodeOpen, setPostcodeOpen] = useState(false); // 팝업 열림 상태

  // 주소 검색 버튼 클릭 시 우편번호 팝업 열기
  const handleOpenPostcodePopup = () => {
    setPostcodeOpen(true);
  };

  // DaumPostcode 컴포넌트에서 주소 선택 시 실행되는 함수
  const handlePostcodeComplete = (data: PostcodeData) => {
    setPostcode(data.zonecode); // 우편번호
    setAddress(data.address); // 기본 주소
    setPostcodeOpen(false); // 팝업 닫기
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
          <div className="absolute bottom-0 bg-main-color h-[3px] w-[148.8px]" />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="flex flex-col items-center w-full h-full">
          <Head>주소지 등록</Head>
          {/* 우편번호 + 주소검색 버튼 */}
          <div className="flex flex-row w-full justify-around mb-[20px]">
            <input
              type="text"
              placeholder="우편번호"
              value={postcode}
              className="flex W-[202px] h-[50px] pl-3 rounded-[10px] border-main-bg focus:border-main-color"
            ></input>
            <FindBtn
              type="button"
              onClick={handleOpenPostcodePopup}
              className="bg-main-color"
            >
              주소검색
            </FindBtn>
          </div>
          {/* 주소 + 상세주소 */}
          <input
            type="text"
            placeholder="주소"
            value={address}
            readOnly
            className="flex w-[362px] h-[50px] mb-[20px] pl-3 rounded-[10px]"
          ></input>
          <input
            type="text"
            placeholder="상세주소"
            value={detailAddress}
            onChange={(e) => setDetailAddress(e.target.value)}
            className="flex w-[362px] h-[50px] pl-3 rounded-[10px]"
          ></input>

          <Link
            to="/register/sign"
            className="absolute bottom-[20px] rounded-[10px] bg-main-color"
          >
            <NextButton type="button">다음</NextButton>
          </Link>

          {/* 주소 검색 팝업 */}
          {isPostcodeOpen && (
            <DaumPostcode
              onComplete={handlePostcodeComplete} // 주소 선택 시 실행되는 함수
              className="mt-5"
              autoClose
            />
          )}
        </div>
      </Main>
    </>
  );
}

export default RegisterAddressPage;
