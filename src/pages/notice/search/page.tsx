import React, { useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import SearchIcon from "@/components/icons/Search";
import PinLocationIcon from "@/components/icons/PinLocation";
import CalendarIcon from "@/components/icons/Calendar";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  width?: string;
  height?: string;
  padding?: string;
  bottom?: string;
  radius?: string;
  bgSize?: string;
  bWidth?: string;
}

type ObjType = {
  [key: string]: string | boolean;
};

const BottomButton = styled.button<Props>`
  position: absolute;
  bottom: ${(props) => props.bottom || "60px"};
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
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

  ::placeholder {
    color: #d9d9d9;
    font-size: 14px;
  }

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
  }
`;

const SelectBox = styled.select.withConfig({
  shouldForwardProp: (prop) => prop !== "bWidth", // bWidth는 DOM으로 전달되지 않도록 필터링
})<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: solid #d9d9d9;
  border-width: ${(props) => props.bWidth || "1px"};
  border-radius: ${(props) => props.radius || "10px"};
  padding: ${(props) => props.padding || "0 20px"};
  font-size: 14px;
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="%23d9d9d9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: ${(props) => props.bgSize || "20px"};
  outline: none;

  &:focus {
    border: 1px solid #0b798b;
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
  font-size: 16px;
  margin-bottom: -10px;
`;

type Location = {
  [key: string]: string[];
};

function NoticeSearchPage() {
  const [search, setSearch] = useState<string>("");
  const [sido, setSido] = useState<string>("전체");
  const [sigungu, setSigungu] = useState<string>("전체");
  const [jobType, setJobType] = useState<string>("");
  const [payType, setPayType] = useState<string>("");
  const [pay, setPay] = useState<number>(0);
  const hireType: ObjType = { 일일: false, 단기: false, 장기: false };
  const [startDate, setStartDate] = useState<Date | null>(new Date()); // 오늘 날짜
  const [endDate, setEndDate] = useState<Date | null>(
    new Date(new Date().setMonth(new Date().getMonth() + 1))
  ); // 1개월 뒤 날짜

  function handleClick(e: React.MouseEvent<HTMLLIElement>) {
    "border-main-gray bg-white text-main-darkGray border-main-color bg-main-color text-white"
      .split(" ")
      .forEach((v) => {
        e.currentTarget.classList.toggle(v);
      });
    hireType[e.currentTarget.innerText] = !hireType[e.currentTarget.innerText];
  }

  const locations: Location = {
    전체: ["지역 전체"],
    서울: [
      "서울 전체",
      "종로구",
      "중구",
      "용산구",
      "성동구",
      "광진구",
      "동대문구",
      "중랑구",
      "성북구",
      "강북구",
      "도봉구",
      "노원구",
      "은평구",
      "서대문구",
      "마포구",
      "양천구",
      "강서구",
      "구로구",
      "금천구",
    ],
    부산: [
      "부산 전체",
      "중구",
      "서구",
      "서구",
      "동구",
      "동구",
      "영도구",
      "영도구",
      "부산진구",
      "부산진구",
      "동래구",
      "동래구",
      "남구",
      "남구",
      "북구",
      "북구",
      "해운대구",
      "해운대구",
      "사하구",
      "사하구",
      "금정구",
      "금정구",
      "강서구",
      "강서구",
      "연제구",
      "시청 연제구",
      "수영구",
      "수영구",
      "사상구",
      "사상구",
      "자치군",
      "기장군",
      "기장군",
    ],
    대구: [
      "대구 전체",
      "중구",
      "동구",
      "서구",
      "남구",
      "북구",
      "수성구",
      "달서구",
      "달성군",
      "군위군",
    ],
    인천: [
      "인천 전체",
      "강화군",
      "옹진군",
      "중구",
      "동구",
      "미추홀구",
      "연수구",
      "남동구",
      "부평구",
      "계양구",
      "서구",
    ],
    광주: ["광주 전체", "동구", "서구", "남구", "북구", "광산구"],
    대전: ["대전 전체", "동구", "중구", "서구", "유성구", "대덕구"],
    울산: ["울산 전체", "중구", "남구", "동구", "북구", "울주군"],
    세종: ["세종 전체"],
    경기: [
      "경기 전체",
      "수원시",
      "고양시",
      "용인시",
      "성남시",
      "부천시",
      "화성시",
      "안산시",
      "남양주시",
      "안양시",
      "평택시",
      "시흥시",
      "파주시",
      "의정부시",
      "김포시",
      "광주시",
      "광명시",
      "군포시",
      "하남시",
      "오산시",
      "양주시",
      "이천시",
      "구리시",
      "안성시",
      "포천시",
      "의왕시",
      "양평군",
      "여주시",
      "동두천시",
      "과천시",
      "가평군",
      "연천군",
    ],
    강원: [
      "강원 전체",
      "춘천시",
      "원주시",
      "강릉시",
      "동해시",
      "태백시",
      "속초시",
      "삼척시",
      "홍천군",
      "횡성군",
      "영월군",
      "평창군",
      "정선군",
      "철원군",
      "화천군",
      "양구군",
      "인제군",
      "고성군",
      "양양군",
    ],
    충북: [
      "충북 전체",
      "청주시",
      "충주시",
      "제천시",
      "보은군",
      "옥천군",
      "영동군",
      "증평군",
      "진천군",
      "괴산군",
      "음성군",
      "단양군",
    ],
    충남: [
      "충남 전체",
      "천안시",
      "공주시",
      "보령시",
      "아산시",
      "서산시",
      "논산시",
      "계룡시",
      "당진시",
      "금산군",
      "부여군",
      "서천군",
      "청양군",
      "홍성군",
      "예산군",
      "태안군",
    ],
    전북: [
      "전북 전체",
      "전주시",
      "군산시",
      "익산시",
      "정읍시",
      "남원시",
      "김제시",
      "완주군",
      "진안군",
      "무주군",
      "장수군",
      "임실군",
      "순창군",
      "고창군",
      "부안군",
    ],
    전남: [
      "전남 전체",
      "목포시",
      "여수시",
      "순천시",
      "나주시",
      "광양시",
      "담양군",
      "곡성군",
      "구례군",
      "고흥군",
      "보성군",
      "화순군",
      "장흥군",
      "강진군",
      "해남군",
      "영암군",
      "무안군",
      "함평군",
      "영광군",
      "장성군",
      "완도군",
      "진도군",
      "신안군",
    ],
    경북: [
      "경북 전체",
      "포항시",
      "경주시",
      "김천시",
      "안동시",
      "구미시",
      "영주시",
      "영천시",
      "상주시",
      "문경시",
      "경산시",
      "의성군",
      "청송군",
      "영양군",
      "영덕군",
      "청도군",
      "고령군",
      "성주군",
      "칠곡군",
      "예천군",
      "봉화군",
      "울진군",
      "울릉군",
    ],
    경남: [
      "경남 전체",
      "창원시",
      "진주시",
      "통영시",
      "사천시",
      "김해시",
      "밀양시",
      "거제시",
      "양산시",
      "의령군",
      "함안군",
      "창녕군",
      "고성군",
      "남해군",
      "하동군",
      "산청군",
      "함양군",
      "거창군",
      "합천군",
    ],
    제주: ["제주 전체", "제주시", "서귀포시"],
  };
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
          <Title>공고 검색</Title>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <form className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]">
          <div className="relative">
            <p className="left-[15px] absolute top-1/2 -translate-y-1/2">
              <SearchIcon />
            </p>
            <InsertTextInput
              type="text"
              placeholder="원하는 정보를 검색해주세요"
              padding="0 50px"
              onChange={(e) => setSearch(e.target.value)}
              required
            />
          </div>
          <hr />
          <SubTitle>지역 / 동네</SubTitle>
          <div className="flex w-full relative">
            <p className="left-[15px] absolute top-1/2 -translate-y-1/2">
              <PinLocationIcon />
            </p>
            <SelectBox
              id="dropdown"
              onChange={(e) => setSido(e.target.value)}
              width="50%"
              padding="0 0 0 45px"
              radius="10px 0 0 10px"
            >
              {Object.keys(locations).map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </SelectBox>
            <SelectBox
              id="dropdown"
              onChange={(e) => setSigungu(e.target.value)}
              width="50%"
              radius="0 10px 10px 0"
              bWidth="1px 1px 1px 0"
            >
              {locations[sido].map((value, index) => (
                <option key={index} value={value}>
                  {value}
                </option>
              ))}
            </SelectBox>
          </div>
          <SubTitle>직종</SubTitle>
          <SelectBox onChange={(e) => setJobType(e.target.value)}>
            {jobTypes.map((value, index) => (
              <option key={index} value={value}>
                {value}
              </option>
            ))}
          </SelectBox>
          <SubTitle>급여</SubTitle>
          <div className="flex w-full relative">
            <SelectBox
              id="dropdown"
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
                원 이상
              </span>
            </span>
          </div>
          <SubTitle>고용 형태</SubTitle>
          <ul className="flex w-full gap-x-[5px] mb-[10px] h-10 list-none relative">
            {Object.keys(hireType).map((value, index) => (
              <li
                key={index}
                className="btn w-1/3 h-full text-sm border-main-gray bg-white rounded-[10px] text-main-darkGray"
                onClick={handleClick}
              >
                {value}
              </li>
            ))}
          </ul>
          <SubTitle>근무 기간</SubTitle>
          <div className="w-full h-10 flex">
            {/* <CalendarIcon /> */}
            {/* <DatePicker
              showIcon
              toggleCalendarOnIconClick
              icon={<CalendarIcon />}
              placeholderText="시작 날짜"
              className="h-full"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              dateFormat="yyyy-MM-dd"
            /> */}

            <DatePicker
              className="w-full p-0"
              showIcon
              toggleCalendarOnIconClick
              dateFormat="yyyy-MM-dd"
              selected={startDate}
              onChange={(date) => setStartDate(date)}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              minDate={new Date()}
              // disabledKeyboardNavigation
              showDisabledMonthNavigation
              placeholderText="시작 날짜"
            />
            <DatePicker
              className="w-full border-main-color"
              showIcon
              toggleCalendarOnIconClick
              dateFormat="yyyy-MM-dd"
              selected={endDate}
              onChange={(date) => setEndDate(date)}
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              minDate={startDate ?? undefined}
              showDisabledMonthNavigation
            />
          </div>
          <BottomButton bottom="31px">검색 결과 보기</BottomButton>
        </form>
      </Main>
      <BottomNav />
    </>
  );
}

export default NoticeSearchPage;
