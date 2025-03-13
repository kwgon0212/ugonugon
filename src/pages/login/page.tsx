import React, { useState } from "react";
import styled from "styled-components";
import { Link, useNavigate } from "react-router-dom";

import Header from "../../components/Header";
import Main from "../../components/Main";

import MailIcon from "../../components/icons/Mail";
import LockIcon from "../../components//icons/Lock";
import ArrowRightIcon from "../../components/icons/ArrowRight";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { loginSuccess } from "@/util/slices/authSlice";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  gap: 20px;
  background-color: white;
`;

const InputContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  width: 60%;
  max-width: 330px;
  margin-bottom: 20px;

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 0;
    height: 1px;
    background-color: var(--main-color);
    transition: width 0.3s ease, left 0.3s ease;
  }

  &:focus-within::after {
    width: 100%;
    left: 0;
  }
`;

const IconInputMail = styled.input`
  padding-left: 40px;
  outline: none;
  width: 100%;
  height: 50px;
  font-size: 14px;
  border-bottom: 1px solid var(--main-gray);
  background: transparent;
`;

const IconInputPw = styled(IconInputMail)``;

const FindPw = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: end;
  align-items: center;
  width: 70%;
  max-width: 330px;
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
`;

export function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
      credentials: "include",
    });

    const data = await res.json();

    if (res.ok) {
      dispatch(loginSuccess(data)); // Redux 상태 업데이트
      navigate("/");
    }
  };

  return (
    <>
      <Header>
        <div className=" w-full h-full bg-white"></div>
      </Header>
      <Main hasBottomNav={false}>
        <Body>
          <img
            className="w-[220px] object-contain"
            src="/logo.png"
            alt="logo"
          />
          <form
            className="flex flex-col justify-center items-center mt-7 w-full"
            onSubmit={handleLogin}
          >
            <InputContainer>
              <div className="absolute left-[10px] top-1/2 -translate-y-1/2">
                <MailIcon color="#717171" />
              </div>
              <IconInputMail
                type="text"
                placeholder="이메일 계정"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                }}
              />
            </InputContainer>
            <InputContainer>
              <div className="absolute left-[10px] top-1/2 -translate-y-1/2">
                <LockIcon color="#717171" />
              </div>

              <IconInputPw
                type="password"
                placeholder="비밀번호"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                }}
              />
            </InputContainer>

            <FindPw className="text-main-darkGray">
              <Link to="login" className="flex gap-[4px] text-sm">
                비밀번호 찾기
              </Link>
              <ArrowRightIcon color="#717171" width={18} height={18} />
            </FindPw>

            <LoginButton className="bg-main-color">로그인</LoginButton>
          </form>
          <div className="flex flex-row justify-center gap-[4px] w-full text-sm">
            <div className=" text-main-darkGray">계정이 없으신가요?</div>
            <Link to="/register/info" className="text-main-color font-bold">
              회원가입
            </Link>
          </div>
        </Body>
      </Main>
    </>
  );
}

export default LoginPage;
