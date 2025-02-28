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

const Body = styled.div`
  display: flex;
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
        <Body></Body>
      </Main>
      <BottomNav />
    </>
  );
}

export default NoticeListPage;
