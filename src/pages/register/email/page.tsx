import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import Main from "@/components/Main";
import Modal from "@/components/Modal";
import StatusBar from "@/components/StatusBar";
import { useAppDispatch } from "@/hooks/useRedux";
import {
  setUserEmail,
  setUserEmailCode,
} from "@/util/slices/registerUserInfoSlice";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
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
  background: #0b798b;
  color: white;
`;

const DupEmailModal = Modal;

function RegisterEmailPage() {
  const [isOpenDupEmailModal, setIsOpenDupEmailModal] = useState(false);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleSubmitEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const email = form["email"].value;

    // 이메일 중복 여부 API 호출
    // !response.ok
    // setIsOpenDupEmailModal(true);
    // return;

    dispatch(setUserEmail(email));

    // 서버에 해당 이메일로 인증번호 전송 요청
    const result = await axios.post("/api/email/cert", { email });
    const { code } = result.data;
    dispatch(setUserEmailCode(code));

    navigate("/register/email/cert");
  };

  return (
    <>
      <Header>
        <div className="relative flex flex-col justify-center w-full h-full">
          <div className="flex flex-row justify-between px-[20px]">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
            <Link to="/login">
              <CancelIcon />
            </Link>
          </div>
          <StatusBar percent={37.5} />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <>
          <form
            className="w-full p-layout flex flex-col gap-layout"
            onSubmit={handleSubmitEmail}
          >
            <p className="font-semibold text-xl">이메일 인증</p>
            <p className="text-main-darkGray text-base">
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

          <DupEmailModal
            isOpen={isOpenDupEmailModal}
            setIsOpen={setIsOpenDupEmailModal}
          >
            <div className="size-full flex flex-col gap-[20px] text-center">
              <span>이미 가입된 이메일 계정입니다</span>
              <button
                onClick={() => setIsOpenDupEmailModal(false)}
                className="w-full h-[50px] bg-main-color text-white rounded-[10px]"
              >
                닫기
              </button>
            </div>
          </DupEmailModal>
        </>
      </Main>
    </>
  );
}

export default RegisterEmailPage;
