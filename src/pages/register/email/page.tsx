import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import Main from "@/components/Main";
import { useAppDispatch } from "@/hooks/useRedux";
import {
  setUserEmail,
  setUserEmailCode,
} from "@/util/slices/registerUserInfoSlice";
import axios from "axios";
import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";

const InsertTextInput = styled.input`
  width: 100%;
  height: 50px;
  background: white;
  border-radius: 10px;
  padding: 0 20px;
  border: 1px solid var(--main-gray);

  ::placeholder {
    padding: 0 20px;
    color: #d9d9d9;
    font-size: 14px;
  }
`;

const BottomButton = styled.button`
  position: absolute;
  bottom: 20px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: #0b798b;
  color: white;
`;

function RegisterEmailPage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form["email"].value;
    dispatch(setUserEmail(email));

    // 서버에 해당 이메일로 인증번호 전송 요청
    const result = await axios.post("/api/email/cert", { email });
    const emailCode = result.data;
    dispatch(setUserEmailCode(emailCode));

    navigate("/register/email/cert");
  };
  return (
    <>
      <Header>
        <div className="px-5 h-full flex justify-between flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} />
          <CancelIcon width={24} height={24} />
          {/* <hr /> */}
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <form
          className="w-full p-layout flex flex-col gap-layout"
          onSubmit={handleSubmitEmail}
        >
          <p className="font-semibold text-xl">이메일 인증</p>
          <p className="text-main-darkGray">
            원활한 서비스 이용을 위한
            <br />
            계정에 사용할 이메일 계정을 입력해주세요.
          </p>
          <InsertTextInput
            type="email"
            name="email"
            placeholder="이메일 계정"
            className="w-full h-[50px] bg-white rounded-[10px] outline-main-color"
            pattern="[\w]+@+[\w]+\.[\w]+"
            required
          />
          <BottomButton>인증번호 전송</BottomButton>
        </form>
      </Main>
    </>
  );
}

export default RegisterEmailPage;
