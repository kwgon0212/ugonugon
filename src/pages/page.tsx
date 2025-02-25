import React from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Main from "../components/Main";

const RootPage = () => {
  return (
    <>
      <Header>
        <span>header</span>
      </Header>
      <Main hasBottomNav={true}>
        <p className="w-full h-[5000px]">main</p>
      </Main>
      <BottomNav>
        <span>bottom nav</span>
      </BottomNav>
    </>
  );
};

export default RootPage;
