import React, { useState } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import CalendarIcon from "../../components/icons/Calendar";
import SendIcon from "../../components/icons/Send";
import ArrowRightIcon from "../../components/icons/ArrowRight";

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 362px;
  height: fit-content;
  border-radius: 10px;
  background-color: white;
`;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 332px;
  height: 40px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  border-radius: 10px;
  margin-bottom: 14px;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 362px;
  height: 120px;
  background-color: white;
  border-radius: 10px;
  margin-top: 40px;
  margin-bottom: 20px;
`;

interface WorkInfo {
  titleInfo: string;
  addressInfo: string;
  payInfo: number;
  dateInfo: string;
  startTimeInfo: string;
  endTimeInfo: string;
}

const title = "tossbank X 한국 경제 신문 FullStack";
const address = "서울 중구 청파로 463 한국 경제 신문사";
const pay = 10030;
const date = "2025-2-25";
const startTime = "9:00";
const endTime = "18:00";

// // date와 time을 결합하여 하나의 Date 객체로 변환
// const dateTimeString = `${getDate}T${getTime}:00`; // ISO 8601 형식으로 결합
// const date = new Date(dateTimeString); // Date 객체로 변환

// // 시간은 00초로 설정하여 timeInfo에 저장 (시간만 다룰 때)
// const time = new Date();
// time.setHours(Number(getTime.split(":")[0]));
// time.setMinutes(Number(getTime.split(":")[1]));
// time.setSeconds(0); // 초는 0으로 설정

// 나중에 map으로 사용하도록 바꾸기
// userId, 근로 공고?id 로 엮어서 key, value
const WorkInfoList: WorkInfo = {
  titleInfo: title,
  addressInfo: address,
  payInfo: pay,
  dateInfo: date,
  startTimeInfo: startTime,
  endTimeInfo: endTime,
};

export function ListItem() {
  const [isOnTime, setOnTime] = useState(true);
  const [percent, SetPercent] = useState(0);
  const [isFinish, setFinish] = useState(false);

  // 출근하기 눌렀을 때
  // 나중에 근로 시간 계산해서 percent가 0부터 채워지게 해야 됨
  function CheckAttendance() {
    return setOnTime(false), SetPercent(100);
  }

  return (
    <>
      <ItemContainer>
        <div className="flex flex-col pt-4 pb-2 mb-4 w-[90%] border-b border-b-selected-box">
          <div className="font-bold mb-2 text-base">{title}</div>
          <div className="mb-2 text-sm">{address}</div>
          <div>
            <span className="font-bold text-main-color text-sm">시급 </span>
            <span className="text-sm">{pay.toLocaleString()} 원</span>
          </div>
        </div>
        <div className="flex flex-col w-[90%] border-b border-b-selected-box">
          <div className="font-bold mb-2 text-base ">근무일자</div>
          <div className="flex flex-row mb-2 w-full">
            <span className="font-bold text-sm text-main-color pr-2">
              {date}
            </span>
            <span className="font-bold text-sm text-main-color">
              {startTime} ~
            </span>
            <span className="font-bold text-sm pl-1 text-main-color">
              {endTime}
            </span>
          </div>
        </div>

        {isOnTime ? (
          <></>
        ) : (
          <div className="flex flex-col w-[90%] mt-3 mb-5 ">
            <div className="w-full mb-2">{percent}% 근무완료</div>
            <div className="relative w-full h-[10px] rounded-[10px] bg-selected-box">
              <div
                className="absolute h-[10px] rounded-[10px] bg-selected-text z-10"
                style={{ width: `${percent}%` }}
              />
              <div className="relative w-full h-[10px] rounded-[10px] bg-selected-box " />
            </div>
          </div>
        )}

        {isOnTime ? (
          <Btn className="bg-main-color" onClick={CheckAttendance}>
            출근하기
          </Btn>
        ) : (
          <Btn className="bg-selected-box">퇴근하기</Btn>
        )}

        {/* {percent === 100 ? (
          <Btn className="bg-main-color" onClick={CheckAttendance}>
            퇴근하기
          </Btn>
        ) : (
          <></>
        )} */}
      </ItemContainer>
      <MenuContainer>
        <Link to="#" className="flex flex-row justify-between w-[90%]">
          <div className="flex flex-row">
            <CalendarIcon color="#717171" />
            <span className="ml-2">나의 근무 스케줄</span>
          </div>
          <ArrowRightIcon color="#717171" />
        </Link>
        <Link to="#" className="flex flex-row justify-between w-[90%]">
          <div className="flex flex-row">
            <SendIcon color="#717171" />
            <span className="ml-2">내가 지원한 공고</span>
          </div>
          <ArrowRightIcon color="#717171" />
        </Link>
      </MenuContainer>
    </>
  );
}

export default ListItem;
