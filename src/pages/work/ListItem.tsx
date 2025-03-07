import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";

import { useAppSelector } from "@/hooks/useRedux";

import CalendarIcon from "../../components/icons/Calendar";
import SendIcon from "../../components/icons/Send";
import ArrowRightIcon from "../../components/icons/ArrowRight";
import { resolve } from "path";

interface UserData {
  noticeId: string[] | string; // 스키마에서 배열로 선언했기 때문에 type을 이렇게 지정
  contract: string;
}

interface WorkData {
  _id: string;
  title: string;
  companyAddress: {
    address: string;
    detailAddress: string;
    Latitude: string;
    Longitude: string;
  };
  payType: string;
  pay: number;
  workDate: string;
  customTime: {
    startTime: string;
    endTime: string;
  };
}

// 임의의 데이터
// const title = "tossbank X 한국 경제 신문 FullStack";
// const address = "서울 중구 청파로 463 한국 경제 신문사";
// const pay = 10030;
// const date = "2025-3-27";
// const startTime = "9:00";
// const endTime = "18:00";

// // date와 time을 결합하여 하나의 Date 객체로 변환
// const dateTimeString = `${getDate}T${getTime}:00`; // ISO 8601 형식으로 결합
// const date = new Date(dateTimeString); // Date 객체로 변환

// // 시간은 00초로 설정하여 timeInfo에 저장 (시간만 다룰 때)
// const time = new Date();
// time.setHours(Number(getTime.split(":")[0]));
// time.setMinutes(Number(getTime.split(":")[1]));
// time.setSeconds(0); // 초는 0으로 설정

export function ListItem() {
  const user = useAppSelector((state) => state.auth.user); // 현재 접속한 유저

  // 유저의 정보 관리 -> 현재는 근로 Id 불러올 때
  // 이 경우는 배열이 아니라 객체기 때문에 [] X
  const [userInfo, setUserInfo] = useState<UserData | null>(null);
  // 유저의 근로(공고) 정보 관리
  const [data, setData] = useState<WorkData[]>([]);

  // 근무 상태 관리
  const [isOnTime, setOnTime] = useState(true);
  const [percent, SetPercent] = useState(0);
  const [isFinish, setFinish] = useState(false);

  // 페이지 접근했을 때 user에 저장된 근로 정보 접근을 위해 근로(공고)Id 불러오기
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        if (user?._id) {
          const res = await axios.get(`/api/auth/userInfo/${user._id}`);
          console.log("사용자 정보:", res.data);
          setUserInfo(res.data); // 객체 그대로 저장
        }
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    if (user?._id) {
      fetchUserInfo();
    }
  }, [user?._id]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (userInfo && userInfo.noticeId) {
          let noticeIds = Array.isArray(userInfo.noticeId)
            ? userInfo.noticeId
            : [userInfo.noticeId];

          if (noticeIds.length === 0) {
            console.error("유효한 noticeId가 없습니다:", userInfo.noticeId);
            return;
          }

          console.log("사용할 noticeIds:", noticeIds);

          // 모든 noticeId에 대해 API 요청을 보내고 응답을 병렬 처리
          const responses = await Promise.all(
            noticeIds.map(async (id) => {
              const response = await axios.get(`/api/post/get/oneNotice/${id}`);
              return response.data;
            })
          );

          console.log("근로 정보 가져오기 성공", responses);

          // 여러 개의 데이터를 한 번에 추가
          setData(responses.flat()); // 응답이 배열일 수도 있으므로 flat() 사용
        } else {
          console.error("userInfo에서 noticeId를 찾을 수 없음:", userInfo);
        }
      } catch (error) {
        console.error("근로 정보 가져오기 실패:", error);
      }
    };

    if (userInfo) {
      fetchPosts();
    }
  }, [userInfo]);

  // 출근하기 눌렀을 때
  // 나중에 근로 시간 계산해서 percent가 0부터 채워지게 해야 됨
  function CheckAttendance() {
    return setOnTime(false), SetPercent(100);
  }

  return (
    <>
      {data.map((notice) => (
        <ItemContainer key={notice._id}>
          <div className="flex flex-col pt-4 pb-2 mb-4 w-[90%] border-b border-b-selected-box">
            <div className="font-bold mb-2 text-base">{notice.title}</div>
            <div className="mb-2 text-sm">{notice.companyAddress.address}</div>
            <div>
              <span className="font-bold text-main-color text-sm">
                {notice.payType}{" "}
              </span>
              <span className="text-sm">{notice.pay.toLocaleString()} 원</span>
            </div>
          </div>
          <div className="flex flex-col w-[90%] border-b border-b-selected-box">
            <div className="font-bold mb-2 text-base ">근무일자</div>
            <div className="flex flex-row mb-2 w-full">
              <span className="font-bold text-sm text-main-color pr-2">
                {notice.workDate}
              </span>
              <span className="font-bold text-sm text-main-color">
                {notice.customTime.startTime} ~
              </span>
              <span className="font-bold text-sm pl-1 text-main-color">
                {notice.customTime.endTime}
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
      ))}

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

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  height: fit-content;
  border-radius: 10px;
  background-color: white;
`;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 40px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  border-radius: 10px;
  margin-bottom: 14px;
  margin-top: 14px;
`;

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 95%;
  height: 120px;
  background-color: white;
  border-radius: 10px;
  margin-top: 40px;
  margin-bottom: 20px;
`;

export default ListItem;
