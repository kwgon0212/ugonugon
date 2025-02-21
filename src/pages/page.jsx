import React from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Main from "../components/Main";

const RootPage = () => {
  return (
    <>
      <Header>header</Header>
      <Main hasHeader={true} hasBottomNav={true}>
        main
      </Main>
      <BottomNav>bottom nav</BottomNav>
    </>
  );
};

export default RootPage;
