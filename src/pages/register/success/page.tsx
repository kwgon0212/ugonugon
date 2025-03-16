import React, { useEffect, useRef } from "react";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import ArrowLeftIcon from "../../../components/icons/ArrowLeft";
import CancelIcon from "../../../components/icons/Cancel";
import { useAppSelector } from "@/hooks/useRedux";
import { Link, useNavigate } from "react-router-dom";
import JSConfetti from "js-confetti";
import StatusBar from "@/components/StatusBar";
import axios from "axios";
import SubmitButton from "@/components/SubmitButton";

function RegisterSuccessPage() {
  const registerUserInfo = useAppSelector((state) => state.registerUserInfo);
  const { emailCert, emailCode, address, bankAccount, signature, ...userInfo } =
    registerUserInfo;
  const confettiRef = useRef(null);
  const navigate = useNavigate();

  const isCompleteRegister =
    Object.values(userInfo).every((value) => {
      return value !== "";
    }) &&
    Boolean(
      signature &&
        bankAccount.account &&
        bankAccount.bank &&
        address.zipcode &&
        address.street &&
        emailCert
    );

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
    }
    navigate("/login");

    const response = await fetch("/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        address,
        bankAccount,
        ...userInfo,
      }),
    });

    const data = await response.json();

    if (response.ok) {
      try {
        await axios.post("/api/image/signature", {
          userId: data.userId,
          image: signature,
        });
        navigate("/login");
      } catch (error) {
        console.log(error);
      }
    } else {
      alert("잘못된 접근입니다");
      navigate("/login");
    }
  };
  return (
    <>
      <Header>
        <div className="relative flex flex-col justify-center w-full h-full">
          <div className="flex flex-row justify-between px-[20px]">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
          </div>
          <StatusBar percent={100} />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div
          className="size-full p-layout flex flex-col gap-layout bg-white"
          ref={confettiRef}
        >
          <p className="font-semibold text-xl">환영합니다!</p>
          <p className="text-main-darkGray">
            회원가입이 무사히 완료됐어요
            <br />
            다양한 서비스를 자유롭게 이용해보세요
          </p>
          <div className="mt-[81px] flex justify-center">
            {/* <SuccessIcon /> */}
            <img
              src="https://em-content.zobj.net/source/microsoft-teams/363/party-popper_1f389.png"
              loading="lazy"
              alt="15.0"
              className="size-[200px]"
            />
          </div>

          <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
            <SubmitButton onClick={handleClickNext} type="button">
              로그인
            </SubmitButton>
          </div>
        </div>
      </Main>
    </>
  );
}

export default RegisterSuccessPage;
