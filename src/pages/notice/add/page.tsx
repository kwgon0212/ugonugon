import React, { useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import DaumPostcode from "react-daum-postcode";
import PlusIcon from "@/components/icons/Plus";

import locations from "./locations";

interface Props {
  width?: string;
  height?: string;
  padding?: string;
  bottom?: string;
  radius?: string;
  bgSize?: string;
  fontSize?: string;
}

type ObjType = {
  [key: string]: string | boolean;
};

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
  height: 40px;
  border-radius: 10px;
  color: white;

  &:hover {
    background-color: #196b78;
  }
`;

const BottomButton = styled.button<Props>`
  bottom: ${(props) => props.bottom || "60px"};
  width: ${(props) => props.width || "calc(100% - 40px)"};
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: #0b798b;
  color: white;
`;

const InsertTextInput = styled.input<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 10px;
  padding: ${(props) => props.padding || "0 20px"};

  &::placeholder {
    color: #717171;
    font-size: 14px;
  }

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
  }
`;

const InsertTextarea = styled.textarea<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "auto"};
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: ${(props) => props.radius || "10px"};

  &::placeholder {
    color: #717171;
    font-size: 14px;
  }

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
  font-size: 14px;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="%23717171" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: ${(props) => props.bgSize || "20px"};
  outline: none;

  &:focus {
    border: 1px solid #0b798b;
    z-index: 1;
  }
`;

const Title = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 16px;
`;

const SubTitle = styled.label`
  font-weight: 600;
  font-size: 18px;
  margin-bottom: -10px;
`;

function NoticeAddPage() {
  const [search, setSearch] = useState<string>("");
  const [sido, setSido] = useState<string>("전체");
  const [sigungu, setSigungu] = useState<string>("전체");
  const [jobType, setJobType] = useState<string>("");
  const [payType, setPayType] = useState<string>("");
  const [pay, setPay] = useState<number>(0);
  const hireType: ObjType = { 일일: false, 단기: false, 장기: false };
  const [startDatetime, setStartDatetime] = useState<Date | null>();
  const [endDatetime, setEndDatetime] = useState<Date | null>();
  const [startRest, setStartRest] = useState<Date | null>();
  const [endRest, setEndRest] = useState<Date | null>();
  const dayType: ObjType = {
    월: false,
    화: false,
    수: false,
    목: false,
    금: false,
    토: false,
    일: false,
  };
  const [workDetail, setWorkDetail] = useState("");
  const [welfare, setWelfare] = useState("");
  const [postDetail, setPostDetail] = useState("");
  const [postcode, setPostcode] = useState(""); // 우편번호 상태
  const [address, setAddress] = useState(""); // 주소 상태
  const [detailAddress, setDetailAddress] = useState(""); // 상세주소 상태
  const [isPostcodeOpen, setPostcodeOpen] = useState(false); // 팝업 열림 상태
  const [postEndDate, setPostEndDate] = useState<Date | null>();
  const registerDate = new Date();
  const [workNums, setWorkNums] = useState(0);
  const [school, setSchool] = useState("무관");
  const schoolTypes = [
    "무관",
    "대학원(박사)",
    "대학원(석사)",
    "대학교(4년)",
    "대학교(2, 3년)",
    "고등학교",
    "중학교",
    "초등학교",
  ];
  const [state, setState] = useState("무관");
  const stateTypes = ["졸업", "재학", "휴학", "중퇴"];
  const [preferences, setPreferences] = useState("");
  const [recruiter, setRecruiter] = useState("채용 담당자");
  const [email, setEmail] = useState("비공개");
  const [phone, setPhone] = useState("비공개");

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

  function handleHireType(e: React.MouseEvent<HTMLLIElement>) {
    "border-main-gray bg-white text-main-darkGray border-main-color bg-main-color text-white"
      .split(" ")
      .forEach((v) => {
        e.currentTarget.classList.toggle(v);
      });
    hireType[e.currentTarget.innerText] = !hireType[e.currentTarget.innerText];
  }
  function handleDayType(e: React.MouseEvent<HTMLLIElement>) {
    "border-main-gray bg-white text-main-darkGray border-main-color bg-main-color text-white"
      .split(" ")
      .forEach((v) => {
        e.currentTarget.classList.toggle(v);
      });
    dayType[e.currentTarget.innerText] = !dayType[e.currentTarget.innerText];
  }

  const jobTypes = [
    "직종 전체",
    "관리자",
    "전문가 및 관련 종사자",
    "사무 종사자",
    "서비스 종사자",
    "판매 종사자",
    "농림어업 숙련 종사자",
    "기능원 및 관련 기능 종사자",
    "장치ㆍ기계 조작 및 조립 종사자",
    "단순 노무 종사자",
    "군인",
  ];
  const payTypes = ["시급", "일급", "주급", "월급", "총 급여"];

  return (
    <>
      <Header>
        <div className="p-layout h-full flex flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} />
          <Title>공고 등록</Title>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <form className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]">
          <div className="w-full font-bold -mb-[10px]">
            직종
            <span className="text-[#ff0000]">*</span>
          </div>
          <div>
            <SelectBox onChange={(e) => setJobType(e.target.value)}>
              {jobTypes.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </SelectBox>
          </div>
          <div className="w-full font-bold -mb-[10px]">
            급여
            <span className="text-[#ff0000]">*</span>
          </div>
          <div className="flex w-full relative">
            <SelectBox
              onChange={(e) => setPayType(e.target.value)}
              className="mr-[10px]"
              width="30%"
            >
              {payTypes.map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </SelectBox>
            <span className="w-[70%] relative">
              <InsertTextInput
                type="text"
                padding="0 69px 0 20px"
                value={pay}
                onChange={(e) =>
                  setPay(Number(e.target.value.replace(/[^\d]/g, "")))
                }
                onFocus={(e) => {
                  e.target.value = pay === 0 ? "" : pay.toString();
                }}
                onBlur={(e) => (e.target.value = pay.toLocaleString())}
                required
              />
              <span className="absolute right-[15px] text-main-darkGray top-1/2 -translate-y-1/2">
                원
              </span>
            </span>
          </div>
          <div className="w-full font-bold -mb-[10px]">
            고용 형태
            <span className="text-[#ff0000]">*</span>
          </div>
          <ul className="flex w-full h-10 gap-x-[5px] list-none relative">
            {Object.keys(hireType).map((value, index) => (
              <li
                key={index}
                className="w-1/3 text-sm flex justify-center items-center border border-main-gray bg-white rounded-[10px] text-main-darkGray"
                onClick={handleHireType}
              >
                {value}
              </li>
            ))}
          </ul>
          <div className="w-full font-bold -mb-[10px] relative">
            근무 기간
            <span className="text-[#ff0000]">*</span>
            <div className="absolute right-0 top-0 flex gap-5">
              <label>기간 협의 가능</label>
              <input type="checkbox" />
            </div>
          </div>
          <div className="w-full h-10 flex">
            <DatePicker
              locale={ko}
              showIcon
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20px"
                  height="20px"
                  color="#717171"
                  fill="none"
                  style={{
                    padding: "10px 0 10px 15px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <path
                    d="M18 2V4M6 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M3 8H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              toggleCalendarOnIconClick
              dateFormat="yyyy-MM-dd"
              startDate={startDatetime}
              endDate={endDatetime}
              popperPlacement="bottom-start"
              fixedHeight
              selectsStart
              className="left-wrapper"
              minDate={new Date()}
              placeholderText="시작 날짜"
              selected={startDatetime}
              onChange={(date) => setStartDatetime(date)}
            />
            <DatePicker
              locale={ko}
              showIcon
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width="20px"
                  height="20px"
                  color="#717171"
                  fill="none"
                  style={{
                    padding: "10px 0 10px 15px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <path
                    d="M18 2V4M6 2V4"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />

                  <path
                    d="M3 8H21"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              }
              toggleCalendarOnIconClick
              dateFormat="yyyy-MM-dd"
              startDate={startDatetime}
              endDate={endDatetime}
              popperPlacement="bottom-start"
              fixedHeight
              selectsEnd
              className="right-wrapper"
              minDate={startDatetime ?? undefined}
              placeholderText="종료 날짜"
              selected={endDatetime}
              onChange={(date) => setEndDatetime(date)}
            />
          </div>
          <div className="w-full font-bold -mb-[10px] relative">
            근무 시간
            <span className="text-[#ff0000]">*</span>
            <div className="absolute right-0 top-0 flex gap-5">
              <label>시간 협의 가능</label>
              <input type="checkbox" />
            </div>
          </div>
          <div className="w-full h-10 flex">
            <DatePicker
              locale={ko}
              showIcon
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  color="#717171"
                  fill="none"
                  style={{
                    padding: "10px 0 10px 15px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <path
                    d="M10 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 10 1.66663C5.39763 1.66663 1.66667 5.39759 1.66667 9.99996C1.66667 14.6023 5.39763 18.3333 10 18.3333Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 5V10L13.3333 11.6667"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              toggleCalendarOnIconClick
              showTimeSelect
              showTimeSelectOnly
              dateFormat="HH : mm"
              startDate={startDatetime}
              endDate={endDatetime}
              popperPlacement="bottom-start"
              fixedHeight
              selectsStart
              className="left-wrapper"
              placeholderText="출근 시간"
              selected={startDatetime}
              onChange={(date) => setStartDatetime(date)}
            />
            <DatePicker
              locale={ko}
              showIcon
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  color="#717171"
                  fill="none"
                  style={{
                    padding: "10px 0 10px 15px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <path
                    d="M10 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 10 1.66663C5.39763 1.66663 1.66667 5.39759 1.66667 9.99996C1.66667 14.6023 5.39763 18.3333 10 18.3333Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 5V10L13.3333 11.6667"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              toggleCalendarOnIconClick
              showTimeSelect
              showTimeSelectOnly
              dateFormat="HH : mm"
              startDate={startDatetime}
              endDate={endDatetime}
              popperPlacement="bottom-start"
              fixedHeight
              selectsEnd
              className="right-wrapper"
              placeholderText="퇴근 시간"
              selected={endDatetime}
              onChange={(date) => setEndDatetime(date)}
            />
          </div>
          <div className="w-full font-bold -mb-[10px] relative">
            휴게 시간
            <span className="text-[#ff0000]">*</span>
            <div className="absolute right-0 top-0 flex gap-5"></div>
          </div>
          <div className="w-full h-10 flex">
            <DatePicker
              locale={ko}
              showIcon
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  color="#717171"
                  fill="none"
                  style={{
                    padding: "10px 0 10px 15px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <path
                    d="M10 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 10 1.66663C5.39763 1.66663 1.66667 5.39759 1.66667 9.99996C1.66667 14.6023 5.39763 18.3333 10 18.3333Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 5V10L13.3333 11.6667"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              toggleCalendarOnIconClick
              showTimeSelect
              showTimeSelectOnly
              dateFormat="HH : mm"
              popperPlacement="bottom-start"
              fixedHeight
              selectsStart
              className="left-wrapper"
              placeholderText="휴식 시작"
              selected={startRest}
              onChange={(date) => setStartRest(date)}
            />
            <DatePicker
              locale={ko}
              showIcon
              icon={
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="20px"
                  height="20px"
                  color="#717171"
                  fill="none"
                  style={{
                    padding: "10px 0 10px 15px",
                    width: "20px",
                    height: "20px",
                  }}
                >
                  <path
                    d="M10 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 10 1.66663C5.39763 1.66663 1.66667 5.39759 1.66667 9.99996C1.66667 14.6023 5.39763 18.3333 10 18.3333Z"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M10 5V10L13.3333 11.6667"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              }
              toggleCalendarOnIconClick
              showTimeSelect
              showTimeSelectOnly
              dateFormat="HH : mm"
              popperPlacement="bottom-start"
              fixedHeight
              selectsEnd
              className="right-wrapper"
              placeholderText="휴식 종료"
              selected={endRest}
              onChange={(date) => setEndRest(date)}
            />
          </div>
          <div className="w-full font-bold -mb-[10px]">
            근무 요일
            <span className="text-[#ff0000]">*</span>
          </div>
          <ul className="flex w-full h-10 gap-x-[5px] list-none">
            {Object.keys(dayType).map((value, index) => (
              <li
                key={index}
                className="w-full text-sm flex justify-center items-center border border-main-gray bg-white rounded-[10px] text-main-darkGray"
                onClick={handleDayType}
              >
                {value}
              </li>
            ))}
          </ul>
          <div className="w-full flex flex-col gap-[10px]">
            <p className="w-full font-bold">근무 상세</p>
            <InsertTextarea
              className="text-sm p-[15px] min-h-[140px]"
              width="100%"
              height="100%"
              placeholder="근무 상세 설명을 작성해주세요"
              onBlur={(e) => setWorkDetail(e.target.value)}
            ></InsertTextarea>
          </div>
          <div className="w-full flex flex-col gap-[10px]">
            <p className="w-full font-bold">복리 후생</p>
            <InsertTextarea
              className="text-sm p-[15px] min-h-[140px]"
              width="100%"
              height="100%"
              placeholder="복리 후생을 작성해주세요"
              onBlur={(e) => setWelfare(e.target.value)}
            ></InsertTextarea>
          </div>
          <div className="w-full flex flex-col gap-[10px]">
            <p className="w-full font-bold">상세 요강</p>
            <InsertTextarea
              className="text-sm p-[15px] min-h-[140px]"
              width="100%"
              height="100%"
              placeholder="상세 요강 html이나 이미지 링크를 넣어주세요"
              onBlur={(e) => setPostDetail(e.target.value)}
            ></InsertTextarea>
          </div>
          <hr />
          <div className="w-full flex flex-col gap-[10px]">
            <p className="basis-full font-bold">
              모집 마감일시
              <span className="text-[#ff0000]">*</span>
            </p>
            <div className="w-full h-10 flex">
              <DatePicker
                locale={ko}
                showIcon
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="20px"
                    height="20px"
                    color="#717171"
                    fill="none"
                    style={{
                      padding: "10px 0 10px 15px",
                      width: "20px",
                      height: "20px",
                    }}
                  >
                    <path
                      d="M18 2V4M6 2V4"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />

                    <path
                      d="M3 8H21"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
                toggleCalendarOnIconClick
                showTimeSelect
                dateFormat="yyyy-MM-dd HH:mm"
                popperPlacement="bottom-start"
                fixedHeight
                minDate={new Date()}
                placeholderText="모집 마감일시"
                selected={postEndDate}
                onChange={(date) => setPostEndDate(date)}
              />
            </div>
          </div>
          <div className="w-full flex flex-col gap-[10px]">
            <p className="basis-full font-bold">
              모집 인원
              <span className="text-[#ff0000]">*</span>
            </p>
            <div className="w-full relative">
              <InsertTextInput
                type="number"
                value={workNums}
                onChange={(e) => setWorkNums(Number(e.target.value))}
              ></InsertTextInput>
              <span className="absolute right-[15px] text-main-darkGray top-1/2 -translate-y-1/2">
                명
              </span>
            </div>
          </div>
          <div className="w-full flex flex-col gap-[10px]">
            <p className="w-full font-bold">우대 사항</p>
            <InsertTextarea
              className="text-sm p-[15px] min-h-[140px]"
              width="100%"
              height="100%"
              placeholder="우대 사항을 적어주세요"
              onBlur={(e) => setPreferences(e.target.value)}
            ></InsertTextarea>
          </div>
          <div className="w-full flex flex-col gap-[10px]">
            <p className="basis-full font-bold">
              학력 제한
              <span className="text-[#ff0000]">*</span>
            </p>
            <div className="flex w-full h-10 gap-[10px]">
              <SelectBox
                width="50%"
                fontSize="12px"
                defaultValue={school}
                onChange={(e) => setSchool(e.target.value)}
                required
              >
                {schoolTypes.map((value, index) => (
                  <option key={index} value={value}>
                    {value}
                  </option>
                ))}
              </SelectBox>
              <SelectBox
                width="50%"
                fontSize="12px"
                defaultValue={state}
                onChange={(e) => setState(e.target.value)}
                required
              >
                {school === "무관" ? (
                  <option key={0} value="무관">
                    무관
                  </option>
                ) : (
                  stateTypes.map((value, index) => (
                    <option key={index} value={value}>
                      {value}
                    </option>
                  ))
                )}
              </SelectBox>
            </div>
          </div>
          <hr />
          <div className="w-full font-bold -mb-[10px]">
            주소지 등록
            <span className="text-[#ff0000]">*</span>
          </div>
          {/* 우편번호 + 주소검색 버튼 */}
          <div className="w-full flex flex-col gap-[10px]">
            <div className="flex flex-row gap-[20px] w-full">
              <input
                type="text"
                placeholder="우편번호"
                value={postcode}
                className="flex w-full h-10 pl-3 rounded-[10px] border border-main-gray outline-main-color"
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
              className="flex w-full h-10 pl-3 rounded-[10px] border border-main-gray outline-main-color"
            ></input>
            <input
              type="text"
              placeholder="상세주소"
              value={detailAddress}
              onChange={(e) => setDetailAddress(e.target.value)}
              className="flex w-full h-10 pl-3 rounded-[10px] border border-main-gray outline-main-color"
            ></input>
          </div>
          {/* 주소 검색 팝업 */}
          {isPostcodeOpen && (
            <DaumPostcode
              onComplete={handlePostcodeComplete} // 주소 선택 시 실행되는 함수
              className="mt-5"
              autoClose
            />
          )}
          <hr />
          <div className="w-full flex gap-[10px]">
            <p className="w-[40%] font-bold content-center">채용 담당자</p>
            <div className="w-full relative">
              <InsertTextInput
                type="text"
                value={recruiter}
                onChange={(e) => setRecruiter(e.target.value)}
              ></InsertTextInput>
            </div>
          </div>
          <div className="w-full flex gap-[10px]">
            <p className="w-[40%] font-bold content-center">이메일 주소</p>
            <div className="w-full relative">
              <InsertTextInput
                type="text"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              ></InsertTextInput>
            </div>
          </div>
          <div className="w-full flex gap-[10px]">
            <p className="w-[40%] font-bold content-center">연락처</p>
            <div className="w-full relative">
              <InsertTextInput
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              ></InsertTextInput>
            </div>
          </div>
          <hr />
          <button
            className="w-full h-[150px] rounded-[10px] border border-dashed border-main-color bg-selected-box flex items-center justify-center text-xs text-main-color"
            type="button"
          >
            <span>
              <PlusIcon width={14} height={14} />
            </span>
            &nbsp; 관련 이미지 추가하기
          </button>
          <BottomButton width="100%" bottom="31px">
            공고 등록하기
          </BottomButton>
        </form>
      </Main>
      <BottomNav />
    </>
  );
}

export default NoticeAddPage;
