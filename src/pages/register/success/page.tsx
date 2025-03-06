import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import ArrowLeftIcon from "../../../components/icons/ArrowLeft";
import CancelIcon from "../../../components/icons/Cancel";
import SuccessIcon from "../../../components/icons/Success";
import { useAppSelector } from "@/hooks/useRedux";
import { useNavigate } from "react-router-dom";
import JSConfetti from "js-confetti";

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

function RegisterSuccessPage() {
  const registerUserInfo = useAppSelector((state) => state.registerUserInfo);
  const {
    businessNumber,
    emailCert,
    emailCode,
    address,
    bankAccount,
    ...userInfo
  } = registerUserInfo;
  const confettiRef = useRef(null);
  console.log(registerUserInfo);
  const navigate = useNavigate();

  const isCompleteRegister =
    Object.values(userInfo).every((value) => {
      return value !== "";
    }) &&
    bankAccount.account &&
    bankAccount.bank &&
    address.zipcode &&
    address.street &&
    emailCert;

  useEffect(() => {
    if (!confettiRef.current) return;
    const jsConfetti = new JSConfetti(confettiRef.current);

    if (isCompleteRegister) {
      jsConfetti.addConfetti({
        emojis: ["❤️", "🌟", "💥", "✨", "🫧"],
        confettiNumber: 100,
        emojiSize: 20,
      });

      return () => {
        jsConfetti.clearCanvas();
        jsConfetti.destroyCanvas();
      };
    }
  }, [confettiRef]);

  const handleClickNext = async () => {
    if (!isCompleteRegister) {
      alert("잘못된 접근입니다");
      navigate("/login");
    }

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        businessNumber,
        address,
        bankAccount,
        ...userInfo,
      }),
    });

    if (response.ok) {
      navigate("/login");
    } else {
      alert("잘못된 접근입니다");
      navigate("/login");
    }
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
        <div
          className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]"
          ref={confettiRef}
        >
          <p className="font-semibold text-xl">환영합니다!</p>
          <p className="text-main-darkGray">
            회원가입이 무사히 완료됐어요
            <br />
            다양한 서비스를 자유롭게 이용해보세요
          </p>
          <div className="mt-[81px] flex justify-center">
            <SuccessIcon />
          </div>
          <BottomButton onClick={handleClickNext}>로그인 하기</BottomButton>
        </div>
      </Main>
    </>
  );
}

export default RegisterSuccessPage;
