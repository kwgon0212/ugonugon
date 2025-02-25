import React from "react";
import Header from "../components/Header";
import Main from "../components/Main";
import BottomNav from "../components/BottomNav";

const RegisterBankAccount = () => {
  return (
    <>
      <Header>
        <></>
      </Header>
      <Main hasBottomNav={false}>
        <>
          <p>계좌등록</p>
          <input placeholder="계좌번호를 입력해주세요" />
          <input placeholder="" />
        </>
      </Main>
      <BottomNav>
        <></>
      </BottomNav>
    </>
  );
};

export default RegisterBankAccount;
