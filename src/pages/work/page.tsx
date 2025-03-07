import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useAppSelector } from "@/hooks/useRedux";

import Header from "../../components/Header";
import Main from "../../components/Main";
import BottomNav from "../../components/BottomNav";
import Check from "../../components/icons/Check";

import ListItem from "../work/ListItem";

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

const NavBtn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 10%;
  gap: 4px;
  color: #717171;
`;

export function WorkPage() {
  const user = useAppSelector((state) => state.auth.user); // 현재 접속한 유저

  // 유저의 근무 존재 관리
  const [hasWorkItem, setWorkItem] = useState(true);

  const [userEmail, setUserEmail] = useState("");

  useEffect(() => {
    setUserEmail(user?.email ?? "의문의 계정님");
  });

  return (
    <>
      <Header>
        <div className="2-full h-full flex items-center justify-center font-bold text-[16px] bg-white">
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
              <ListItem />
            </>
          ) : (
            <>
              <CenterDiv className="text-main-darkGray">
                <div className="text-xl">
                  <span>현재</span>
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
            </>
          )}
        </Body>
      </Main>
      <BottomNav />
    </>
  );
}

export default WorkPage;
