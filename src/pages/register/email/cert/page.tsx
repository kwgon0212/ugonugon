import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import Main from "@/components/Main";
import Modal from "@/components/Modal";
import StatusBar from "@/components/StatusBar";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setUserEmailCert,
  setUserEmailCode,
} from "@/util/slices/registerUserInfoSlice";
import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";

const CertificationInput = styled.input`
  width: 48px;
  height: 48px;
  border: 1px solid #d9d9d9;
  border-radius: 10px;
  text-align: center;
  font-size: 14px;
  color: #1f2024;
  /* form의 padding으로 해결 못하여 input에 margin 설정 */
  margin: 0 4px;

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
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

const NotEqualEmailCodeModal = Modal;
const ReSendEmailCodeModal = Modal;

function RegisterEmailCertPage() {
  const [nums, setNums] = useState(["", "", "", ""]);
  const [isOpenNotEqualEmailCodeModal, setIsOpenNotEqualEmailCodeModal] =
    useState(false);
  const [isOpenReSendEmailCodeModal, setIsOpenReSendEmailCodeModal] =
    useState(false);

  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.registerUserInfo.email);
  const emailCode = useAppSelector((state) => state.registerUserInfo.emailCode);
  const navigate = useNavigate();

  const handleNums = (event: any, index: number) => {
    const newNums = [...nums];
    newNums[index] = event.target.value;
    setNums(newNums);

    if (event.target.value.length === 1 && index < 3) {
      document.getElementsByTagName("input")[index + 1].focus();
    }
  };

  const handleKeyUp = (event: any, index: number) => {
    if (event.key === "Backspace" || event.key === "Delete")
      if (index !== 0 && nums[index] === "") {
        const newNums = [...nums];
        newNums[index] = "";
        event.target.value = "";
        document.getElementsByTagName("input")[index - 1].focus();
      }
  };

  const handleKeyDown = (event: any, index: number) => {
    if (!["Backspace", "Delete", "Tab", "Shift"].includes(event.key))
      if (index !== 3 && nums[index] !== "") {
        document.getElementsByTagName("input")[index + 1].focus();
      }
  };

  const handleReSendEmailCode = async () => {
    // 이메일로 다시 코드 전송
    // 서버에 해당 이메일로 인증번호 전송 요청
    if (!email) {
      alert("잘못된 접근입니다");
      navigate("/login");
      return;
    }
    const result = await axios.post("/api/email/cert", { email });
    const emailCode = result.data;
    dispatch(setUserEmailCode(emailCode));
  };

  const handleEmailCodeSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const userFormEmailCode = Number(nums.join(""));

    if (userFormEmailCode !== emailCode) {
      setIsOpenNotEqualEmailCodeModal(true);
      return;
    }

    dispatch(setUserEmailCert(true));
    navigate("/register/sign");
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
            className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]"
            onSubmit={handleEmailCodeSubmit}
          >
            <p className="font-semibold text-xl text-center">인증번호 확인</p>
            <div className="flex justify-center">
              {nums.map((v, index) =>
                !index ? (
                  <CertificationInput
                    key={index}
                    type="text"
                    maxLength={1}
                    pattern="\d"
                    required
                    autoFocus
                    onChange={(event) => handleNums(event, index)}
                    onKeyUp={(event) => handleKeyUp(event, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  />
                ) : (
                  <CertificationInput
                    key={index}
                    type="text"
                    maxLength={1}
                    pattern="\d"
                    required
                    onChange={(event) => handleNums(event, index)}
                    onKeyUp={(event) => handleKeyUp(event, index)}
                    onKeyDown={(event) => handleKeyDown(event, index)}
                  />
                )
              )}
            </div>
            <div className="flex flex-col items-center gap-[5px] text-sm">
              <p className="text-center text-main-darkGray">
                아직 인증 번호를 받지 못하셨나요?
              </p>
              <button
                className="text-main-color text-sm text-center"
                onClick={() => {
                  setIsOpenReSendEmailCodeModal(true);
                  handleReSendEmailCode();
                }}
                type="button"
              >
                인증번호 재전송
              </button>
            </div>
            <BottomButton>확인</BottomButton>
          </form>
          <NotEqualEmailCodeModal
            isOpen={isOpenNotEqualEmailCodeModal}
            setIsOpen={setIsOpenNotEqualEmailCodeModal}
          >
            <div className="size-full flex flex-col gap-[20px] text-center">
              <span>인증번호가 일치하지 않습니다</span>
              <button
                onClick={() => setIsOpenNotEqualEmailCodeModal(false)}
                className="w-full h-[50px] bg-main-color text-white rounded-[10px]"
              >
                닫기
              </button>
            </div>
          </NotEqualEmailCodeModal>

          <ReSendEmailCodeModal
            isOpen={isOpenReSendEmailCodeModal}
            setIsOpen={setIsOpenReSendEmailCodeModal}
          >
            <div className="size-full flex flex-col gap-[20px] text-center">
              <span>인증번호를 재전송 하였습니다</span>
              <button
                onClick={() => setIsOpenReSendEmailCodeModal(false)}
                className="w-full h-[50px] bg-main-color text-white rounded-[10px]"
              >
                닫기
              </button>
            </div>
          </ReSendEmailCodeModal>
        </>
      </Main>
    </>
  );
}

export default RegisterEmailCertPage;
