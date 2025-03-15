import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import banks from "./banks";
import Header from "@/components/Header";
import Main from "@/components/Main";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUserBankAccount } from "@/util/slices/registerUserInfoSlice";
import { Link, useNavigate } from "react-router-dom";
import StatusBar from "@/components/StatusBar";
import InputComponent from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";

const RegisterBankAccount = () => {
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
    setAccount(value);
  };

  const handleBank = (bankName: string) => {
    setBank(bankName);
    setIsOpenBottomSheet(false);
  };

  const handleClickNext = () => {
    if (!account || !bank) return;

    dispatch(setUserBankAccount({ bank, account }));
    navigate("/register/user-account");
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
          <StatusBar percent={62.5} />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full p-layout flex flex-col gap-layout relative bg-white">
          <p className="text-xl font-bold">계좌 등록</p>
          <InputComponent
            placeholder="계좌번호를 입력해주세요"
            value={account}
            onChange={handleChangeAccount}
            type="numeric"
          />
          <div
            className="w-full relative"
            onClick={() => setIsOpenBottomSheet(true)}
          >
            <InputComponent
              type="text"
              readOnly
              placeholder="은행선택"
              value={bank ? (bank.includes("뱅크") ? bank : `${bank}은행`) : ""}
              className="cursor-pointer"
            />
            <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
              <ArrowDownIcon color="#717171" />
            </div>
          </div>

          <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
            <SubmitButton onClick={handleClickNext} type="button">
              다음
            </SubmitButton>
          </div>

          {isOpenBottomSheet && (
            <Overlay
              className={`${isOpenBottomSheet ? "active" : ""}`}
              onClick={() => setIsOpenBottomSheet(false)}
            >
              <Sheet
                className={`${
                  isOpenBottomSheet ? "active" : ""
                } flex flex-col items-center gap-[20px]`}
                onClick={(e) => e.stopPropagation()}
              >
                <div className="w-[60px] h-[5px] rounded-full bg-main-gray"></div>
                <h1 className="text-left flex-1 text-[20px] w-full font-bold">
                  은행 선택
                </h1>
                <div className="w-full grow-1 overflow-y-scroll flex flex-wrap gap-y-[10px] mb-[20px]">
                  {Object.entries(banks).map(([key, value]) => {
                    return (
                      <div
                        key={key}
                        onClick={() => handleBank(value)}
                        className="w-1/3 px-[4px]"
                      >
                        <button className="size-full rounded-[10px] bg-main-bg flex flex-col items-center justify-center gap-[5px] py-[8px]">
                          <img
                            src={`/bank/${key}.png`}
                            alt={key}
                            className="size-[30px]"
                          />
                          <span className="text-[14px]">{value}</span>
                        </button>
                      </div>
                    );
                  })}
                </div>
              </Sheet>
            </Overlay>
          )}
        </div>
      </Main>
    </>
  );
};

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  /* width: 100%; */
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;

  &.active {
    opacity: 1;
    visibility: visible;
  }
`;

const Sheet = styled.div`
  width: 100%;
  max-height: 70%;
  min-height: 50%;
  background: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;

  &.active {
    animation: ${slideUp} 0.3s ease-in-out forwards;
  }
`;

export default RegisterBankAccount;
