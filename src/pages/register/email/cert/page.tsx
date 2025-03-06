import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import Main from "@/components/Main";
import Modal from "@/components/Modal";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import {
  setUserEmailCert,
  setUserEmailCode,
} from "@/util/slices/registerUserInfoSlice";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  font-size: 14px;
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
  const userEmail = useAppSelector((state) => state.registerUserInfo.email);
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

  const handleReSendEmailCode = () => {
    const code = 2345;
    dispatch(setUserEmailCode(code));

    // 이메일로 다시 코드 전송
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
        <div className="px-5 h-full flex justify-between flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} />
          <CancelIcon width={24} height={24} />
          {/* <hr /> */}
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
              {nums.map((v, index) => (
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
              ))}
            </div>
            <p className="font-semibold text-sm text-center">
              아직 인증 번호를 받지 못하셨나요?
            </p>
            <button
              className="text-main-color text-xs text-center"
              onClick={() => {
                setIsOpenReSendEmailCodeModal(true);
                handleReSendEmailCode();
              }}
              type="button"
            >
              인증번호 재전송
            </button>
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
