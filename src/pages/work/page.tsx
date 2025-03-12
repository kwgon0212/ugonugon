import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useAppSelector } from "@/hooks/useRedux";
import axios from "axios";

import Header from "../../components/Header";
import Main from "../../components/Main";
import BottomNav from "../../components/BottomNav";
import Check from "../../components/icons/Check";
import ListItem from "../work/ListItem";
import mongoose from "mongoose";
import { UserData } from "./utils";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  padding-top: 20px;
  border-top-left-radius: 20px;
  border-top-right-radius: 20px;
  overflow-y: scroll;
`;

const CenterDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

export function WorkPage() {
  const user = useAppSelector((state) => state.auth.user);
  const [userInfo, setUserInfo] = useState<UserData[] | null>(null);
  const [hasWorkItem, setWorkItem] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setUserEmail(user?.email ?? "의문의 계정님");
  }, [user?.email]);

  useEffect(() => {
    const fetchUserInfo = async () => {
      const userId = user?._id;
      if (!user?._id) {
        setLoading(false);
        return;
      }

      try {
        console.log("사용자 정보 응답:", userId);

        // API 엔드포인트 수정 - users로 변경
        const res = await axios.get(`/api/users/`, { params: { userId } });
        console.log("사용자 정보 응답:", res.data);

        const getData = res.data;
        const userData = getData.applies;

        // userData가 배열인지 확인하고, 적어도 하나의 항목이 accepted 상태인지 확인
        const hasNotices =
          userData &&
          Array.isArray(userData) &&
          userData.some((item) => item.status === "accepted");

        setUserInfo(userData);
        setWorkItem(hasNotices);
        console.log("근무 항목 있음:", hasNotices, "데이터:", userData);
      } catch (error: any) {
        console.error("데이터 가져오기 실패:", error);
        setError(error.message || "사용자 정보를 가져오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };

    fetchUserInfo();
  }, [user?._id]);

  if (loading) {
    return (
      <>
        <Header>
          <div className="w-full h-full flex items-center justify-center font-bold text-[16px] bg-white">
            근로 현황
          </div>
        </Header>
        <Main hasBottomNav={true} back-ground-color="white">
          <Body>
            <CenterDiv>
              <div className="text-xl">로딩 중...</div>
            </CenterDiv>
          </Body>
        </Main>
        <BottomNav />
      </>
    );
  }

  if (error) {
    console.error("오류 발생:", error);
  }

  return (
    <>
      <Header>
        <div className="w-full h-full flex items-center justify-center font-bold text-[16px] bg-white">
          근로 현황
        </div>
      </Header>
      <Main hasBottomNav={true} back-ground-color="white">
        <Body>
          {hasWorkItem ? (
            <>
              <div className="flex flex-row justify-between w-full h-[40px] pl-4 pr-4 font-[18px] font-bold">
                <span>나의 근무 관리</span>
                <div className="flex flex-row text-main-color font-[14px]">
                  위치 권한
                  <Check />
                </div>
              </div>
              <ListItem userInfo={userInfo} />
            </>
          ) : (
            <CenterDiv className="text-main-darkGray">
              <div className="text-xl">
                <span>현재 </span>
                <span className="text-main-color font-bold">{userEmail}</span>
                <span>님의</span>
              </div>
              <div className="text-xl mb-5">근무가 존재하지 않아요</div>
              <div className="flex flex-row justify-center w-full">
                <Link to="/">
                  <span className="text-main-color">
                    내가 지원한 공고 페이지
                  </span>
                </Link>
                <span>로 이동</span>
              </div>
            </CenterDiv>
          )}
        </Body>
      </Main>
      <BottomNav />
    </>
  );
}

export default WorkPage;
