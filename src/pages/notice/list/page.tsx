import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import Header from "../../../components/Header";
import Main from "../../../components/Main";
import BottomNav from "../../../components/BottomNav";

import ChatIcon from "../../../components/icons/bottomNav/Chat";
import EmployIcon from "../../../components/icons/bottomNav/Employ";
import HomeIcon from "../../../components/icons/bottomNav/Home";
import UserIcon from "../../../components/icons/bottomNav/User";
import WorkIcon from "../../../components/icons/bottomNav/Work";
import EditIcon from "../../../components/icons/Edit";

const Body = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  background-color: white;
  padding: 12px;
`;

const CetegoryContiner = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: fit-content;
  background-color: white;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  height: 30px;
  border-radius: 50px;
  font-size: 12px;
  padding-left: 20px;
  padding-right: 20px;
`;

const ListWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: max-content;
`;
const ListContainer = styled.div``;
const Numbernav = styled.div`
  position: absolute;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 20px;
  bottom: 0;
`;

const NavBtn = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  flex: 1 10%;
  gap: 4px;
  color: #717171;
`;

const category = "서울 용산구";

export function NoticeListPage() {
  const location = useLocation();

  return (
    <>
      <Header>
        <Link to={"/"} className="flex p-3 w-full h-full">
          <img
            src="/logo192.png"
            alt="로고 이미지"
            className="flex bottom-0 w-[179px] h-[43px] "
          />
        </Link>
      </Header>
      <Main hasBottomNav={true}>
        <Body>
          <Head>
            <div className="font-bold text-[20px] mb-2">검색 결과</div>
            <CetegoryContiner>
              <CategoryItem className="bg-selected-box">
                <div className="flex w-fit text-main-color">{category}</div>
                <div className="flex w-fit h-fit ml-2">
                  <EditIcon color="#0B798B" />
                </div>
              </CategoryItem>
            </CetegoryContiner>
          </Head>
        </Body>
      </Main>
      <BottomNav>
        <div className="flex flex-row justify-around items-center w-full h-full">
          <NavBtn>
            <ChatIcon color="#717171" />
            채팅
          </NavBtn>
          <NavBtn
            style={{
              color:
                location.pathname === "/notice/list" ? "#0B798B" : "#717171", // 경로가 검색 페이지일 때만 색상 변경
            }}
          >
            <EmployIcon
              color={
                location.pathname === "/notice/list" ? "#0B798B" : "#717171"
              }
            />
            검색
          </NavBtn>
          <NavBtn>
            <HomeIcon color="#717171" />홈
          </NavBtn>
          <NavBtn>
            <WorkIcon color="#717171" />
            근무 현황
          </NavBtn>
          <NavBtn>
            <UserIcon color="#717171" />내 정보
          </NavBtn>
        </div>
      </BottomNav>
    </>
  );
}

export default NoticeListPage;
