import React, { useState } from "react";
import styled from "styled-components";
import Header from "../../../../components/Header";
import Main from "../../../../components/Main";
import ArrowLeftIcon from "../../../../components/icons/ArrowLeft";
import ProfileIcon from "@/components/icons/Profile";
import CameraIcon from "@/components/icons/Camera";
import PlusIcon from "@/components/icons/Plus";

interface Props {
  width?: string;
  height?: string;
  padding?: string;
  bottom?: string;
  radius?: string;
  fontSize?: string;
}

const Title = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 16px;
`;

const InsertTextarea = styled.textarea<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 5px;

  /* ::placeholder {
    color: #d9d9d9;
    font-size: 14px;
  } */

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
  }
`;

const SelectBox = styled.select<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: 1px solid #d9d9d9;
  border-radius: ${(props) => props.radius || "10px"};
  padding: ${(props) => props.padding || "0 20px"};
  font-size: ${(props) => props.fontSize || "14px"};
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="%23d9d9d9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
  outline: none;

  &:focus {
    border: 1px solid #0b798b;
    z-index: 1;
  }
`;

const BottomButton = styled.button`
  position: absolute;
  bottom: 32px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: #0b798b;
  color: white;
`;

function MypageResumeAdd() {
  const name = "김김김";
  const sex = "남성";
  const residentNumber = "000123-3******";
  const [school, setSchool] = useState("");
  const schoolTypes = [
    "대학원(박사)",
    "대학원(석사)",
    "대학교(4년)",
    "대학교(2, 3년)",
    "고등학교",
    "중학교",
    "초등학교",
  ];
  const [state, setState] = useState("");
  const stateTypes = ["졸업", "재학", "휴학", "중퇴"];

  return (
    <>
      <Header>
        <div className="p-layout h-full flex flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} />
          <Title>이력서 등록</Title>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <form className="w-full p-layout flex flex-col gap-layout">
          <div>
            <input
              className="w-full h-[22px] text-lg placeholder:underline bg-main-bg"
              type="text"
              placeholder="이력서 제목을 등록해주세요"
            />
            <div className="flex h-[74px] mt-5">
              <div className="mr-5 relative">
                <ProfileIcon />
                <p className="w-6 h-6 bg-main-color rounded-full flex justify-center items-center absolute right-0 bottom-0">
                  <CameraIcon color="white" width={14} height={14} />
                </p>
              </div>
              <ul className="flex flex-col gap-[10px] text-[12px] text-main-darkGray">
                {["이름", "성별", "주민번호"].map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
              <ul className="flex flex-col gap-[10px] text-[12px] ml-[10px]">
                {[name, sex, residentNumber].map((value, index) => (
                  <li key={index}>{value}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className="rounded-t-[30px] bg-white p-layout flex flex-col gap-layout items-start -mx-[20px]">
            <button
              className="text-main-color text-xs underline -mb-[10px]"
              type="button"
            >
              내 정보 불러오기
            </button>
            <div className="w-full flex flex-col gap-[10px]">
              <p className="basis-full font-bold">
                회원 정보
                <span className="text-[#ff0000]">*</span>
              </p>
              <div className="flex w-full">
                <ul className="flex flex-col gap-[10px] text-[12px] text-main-darkGray">
                  {["연락처", "이메일", "거주지"].map((value, index) => (
                    <li className="w-[49px]" key={index}>
                      {value}
                    </li>
                  ))}
                </ul>
                <div className="w-full flex flex-col gap-[10px] text-[12px] ml-[10px] items-start">
                  <input
                    className="w-full h-[18px] text-xs placeholder:text-main-darkGray placeholder:underline "
                    type="text"
                    placeholder="'-'를 제외하고 입력해주세요'"
                  />
                  <input
                    className="w-full h-[18px] text-xs placeholder:text-main-darkGray placeholder:underline "
                    type="email"
                    placeholder="이메일을 입력해주세요"
                  />
                  <button
                    className="text-main-color font-bold text-xs underline"
                    type="button"
                  >
                    주소 찾기
                  </button>
                </div>
              </div>
            </div>
            <div className="w-full flex flex-col gap-[10px]">
              <p className="basis-full font-bold">
                최종 학력
                <span className="text-[#ff0000]">*</span>
              </p>
              <div className="flex w-full h-10 gap-[10px]">
                <SelectBox
                  className="text-main-darkGray"
                  width="50%"
                  fontSize="12px"
                  defaultValue={school}
                  onClick={(e) =>
                    e.currentTarget.classList.remove("text-main-darkGray")
                  }
                  onChange={(e) => setSchool(e.target.value)}
                >
                  <option
                    className="text-main-darkGray"
                    key={school.length + 1}
                    value=""
                    disabled
                    hidden
                  >
                    학교
                  </option>
                  {schoolTypes.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </SelectBox>
                <SelectBox
                  className="text-main-darkGray"
                  width="50%"
                  fontSize="12px"
                  defaultValue={state}
                  onClick={(e) =>
                    e.currentTarget.classList.remove("text-main-darkGray")
                  }
                  onChange={(e) => setState(e.target.value)}
                >
                  <option
                    className="text-main-darkGray"
                    key={state.length + 1}
                    value=""
                    disabled
                    hidden
                  >
                    상태
                  </option>
                  {stateTypes.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))}
                </SelectBox>
              </div>
            </div>
            <div className="w-full flex flex-col gap-[10px]">
              <p className="basis-full font-bold">경력 사항</p>
              <button
                className="w-full h-10 rounded-[10px] border border-dashed border-main-color bg-selected-box flex items-center justify-center text-xs text-main-color"
                type="button"
              >
                <span>
                  <PlusIcon width={14} height={14} />
                </span>
                &nbsp; 경력 추가하기
              </button>
            </div>
            <div className="w-full flex flex-col gap-[10px]">
              <p className="w-full font-bold">기타 사항</p>
              <div className="flex gap-[10.5px]">
                <p className="w-[60px] text-xs text-main-darkGray">자기소개</p>
                <InsertTextarea
                  className="text-xs p-1"
                  width="100%"
                  height="101px"
                ></InsertTextarea>
              </div>
            </div>
            <div className="w-[100vw] -mx-5 h-[120px] bg-white z-10" />
          </div>
          <BottomButton className="z-[11]">이력서 등록</BottomButton>
        </form>
      </Main>
    </>
  );
}

export default MypageResumeAdd;
