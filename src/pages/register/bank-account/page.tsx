import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import banks from "./banks";
import Header from "@/components/Header";
import Main from "@/components/Main";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import ArrowDownIcon from "@/components/icons/ArrowDown";

const RegisterBankAccount = () => {
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);
  // const navigate = useNavigate();

  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
    setAccount(value);
  };

  const handleClickBank = () => {
    setIsOpenBottomSheet(true);
    console.log("hi");
  };

  const handleBank = (bankName: string) => {
    setBank(bankName);
    setIsOpenBottomSheet(false);
  };

  const handleClickNext = () => {
    console.log(account, bank);
    // navigate('/')
  };

  return (
    <>
      <Header>
        <div className="size-full flex items-center justify-between px-[20px]">
          <ArrowLeftIcon width={24} height={24} />
          <CancelIcon width={24} height={24} />
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full p-layout flex flex-col gap-layout relative">
          <p className="text-[20px] font-bold">계좌 등록</p>
          <div className="flex flex-col gap-layout">
            <input
              placeholder="계좌번호를 입력해주세요"
              value={account}
              onChange={handleChangeAccount}
              type="numeric"
              className="h-[50px] rounded-[10px] px-layout border border-main-gray outline-main-color"
            />
            <div className="w-full relative">
              <input
                className="w-full h-[50px] rounded-[10px] px-layout bg-white text-left border border-main-gray outline-none"
                onClick={handleClickBank}
                readOnly
                placeholder="은행선택"
                value={
                  bank ? (bank.includes("뱅크") ? bank : `${bank}은행`) : ""
                }
              />
              <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
                <ArrowDownIcon color="#D9D9D9" />
              </div>
            </div>
          </div>

          <div className="w-full absolute bottom-[20px] left-0 px-[20px]">
            <button
              className={`w-full h-[50px] rounded-[10px] px-layout ${
                account && bank ? "bg-main-color" : "bg-selected-box"
              } text-center text-white`}
              disabled={!account || !bank}
              onClick={handleClickNext}
            >
              다음
            </button>
          </div>

          {isOpenBottomSheet && (
            <Overlay
              className={isOpenBottomSheet ? "active" : ""}
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
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
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
