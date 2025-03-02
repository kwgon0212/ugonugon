import React from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";

import Header from "../../components/Header";
import Main from "../../components/Main";

import MailIcon from "../../components/icons/Mail";
import LockIcon from "../../components//icons/Lock";
import ArrowRightIcon from "../../components/icons/ArrowRight";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 20px;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  justify-content: center;
  width: 60%;
  min-width: 330px;
  margin-bottom: 20px;
`;

const IconInputMail = styled.input`
  padding-left: 50px;
  width: 100%;
  height: 50px;
  font-size: 14px;
  border: 1px solid #bababa;
  border-radius: 10px;
`;

const IconInputPw = styled.input`
  padding-left: 50px;
  width: 100%;
  height: 50px;
  font-size: 14px;
  border: 1px solid #bababa;
  border-radius: 10px;
`;

const FindPw = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  width: 70%;
  min-width: 330px;
  margin-bottom: 20px;
`;

const LoginButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 60%;
  min-width: 330px;
  height: 50px;
  border-radius: 10px;
  color: white;
  font-size: 16px;
  font-weight: bold;
  &:hover {
    background-color: #196b78;
  }
`;

export function LoginPage() {
  return (
    <>
      <Header>
        <div className=" w-full h-full bg-main-bg"></div>
      </Header>
      <Main hasBottomNav={false}>
        <Body>
          <div className="w-fit h-fit">
            <img
              className="w-[199.81px] h-[48px]"
              src="/logo192.png"
              alt="로고 이미지"
            />
          </div>
          <form className="flex flex-col justify-center items-center mt-7 w-full">
            <InputContainer>
              <div className="absolute left-5 top-4">
                <MailIcon color="#BABABA" />
              </div>
              <IconInputMail
                type="text"
                placeholder="이메일 계정"
              ></IconInputMail>
            </InputContainer>
            <InputContainer>
              <div className="absolute left-5 top-4">
                <LockIcon color="#BABABA" />
              </div>

              <IconInputPw type="password" placeholder="비밀번호"></IconInputPw>
            </InputContainer>

            <FindPw className="pr-[15px] text-main-darkGray">
              <Link to="login" className="flex">
                <div>비밀번호 찾기</div>
              </Link>
              <ArrowRightIcon color="#BABABA" />
            </FindPw>
            <Link to="/" className="flex w-full justify-center">
              {/* 로그인하는 함수 만들어야 됨 */}
              {/* 나중에 타입 변경 */}
              <LoginButton type="button" className="bg-main-color">
                로그인
              </LoginButton>
            </Link>
          </form>
          <div className="flex flex-row justify-center gap-3 w-full">
            <div className=" text-main-darkGray">계정이 없으신가요?</div>
            <Link to="/register/business-num">
              <div className="text-main-color font-bold">회원가입하기</div>
            </Link>
          </div>
        </Body>
      </Main>
    </>
  );
}

export default LoginPage;
