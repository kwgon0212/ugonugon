import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled, { keyframes } from "styled-components";

import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowDownIcon from "@/components/icons/ArrowDown";

import Header from "@/components/Header";
import Main from "@/components/Main";

import banks from "./banks";
import AlertModal from "./AlertMocal";
import { useAppSelector } from "@/hooks/useRedux";
import getUser, { putUser, type User } from "@/hooks/fetchUser";

const HeaderWrap = styled.div`
  display: flex;
  align-items: center;
  padding-left: 20px;
  width: 100%;
  height: 100%;
`;

const MainWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  height: 100%;
  padding: 5%;
`;

const ColWrap = styled.div`
  display: flex;
  width: 100%;
  height: 23%;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
`;

const SaveBtn = styled.button`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 90%;
  height: 50px;
  color: white;
  border-radius: 10px;
`;

export function EditBankAccountPage() {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);

  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);

  const [color, setColor] = useState("#0B798B");
  // color State가 필요한지?
  const [isModalOpen, setModalOpen] = useState(false);
  const [saveModalOpen, setSaveModalOpen] = useState(false);

  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
    // 은행마다 계좌번호 길이가 다를 수 있음 (ex: 폰 번호로 계좌 번호)
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

  const handleOpenAlertModal = () => {
    setColor("#D7F6F6");
    setModalOpen(true);
  };

  const handleCloseAlertModal = () => {
    setModalOpen(false);
    setColor("#0B798B");
  };

  return (
    <>
      <Header>
        <HeaderWrap>
          <div onClick={handleOpenAlertModal} className="flex w-fit h-fit ">
            <ArrowLeftIcon color={color} />
          </div>
        </HeaderWrap>
      </Header>
      <Main hasBottomNav={false}>
        <MainWrap>
          {isModalOpen && <AlertModal handleClose={handleCloseAlertModal} />}
          <ColWrap>
            <div className="flex text-[20px] w-full font-bold mb-[2%]">
              입출금 계좌 변경
            </div>
            <div className="flex w-full justify-center">
              <input
                onChange={handleChangeAccount}
                type="numeric"
                placeholder="계좌번호 입력"
                value={account}
                className="flex pl-4 w-[95%] h-[50px] rounded-[10px] border border-main-gray"
              />
            </div>
            <div
              className="relative flex w-full h-[50px] justify-center"
              onClick={handleClickBank}
            >
              <input
                type="text"
                readOnly
                placeholder="은행 선택"
                value={
                  bank ? (bank.includes("뱅크") ? bank : `${bank}은행`) : ""
                }
                className="flex pl-4 w-[95%] h-[50px] rounded-[10px] border border-main-gray"
              />
              <div className="absolute flex right-[7%] top-[30%]">
                <ArrowDownIcon />
              </div>
            </div>
          </ColWrap>
          <div className="flex justify-center w-full h-[10%]">
            <SaveBtn
              className="bg-main-color"
              onClick={() => {
                putUser(userId, {
                  bankAccount: {
                    bank,
                    account,
                  },
                });
                handleClickNext();
                setSaveModalOpen(!saveModalOpen);
              }}
            >
              저장
            </SaveBtn>
            {saveModalOpen && (
              <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                <div className="bg-white flex flex-col gap-[20px] p-5 rounded-[10px] w-[362px] items-center">
                  <p className="font-bold text-lg">
                    입출금 계좌가 성공적으로 변경되었습니다.
                  </p>
                  <Link
                    to="/mypage"
                    className="w-1/2 p-2 rounded-[10px] bg-main-color text-white text-center"
                  >
                    확인
                  </Link>
                </div>
              </div>
            )}
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
        </MainWrap>
      </Main>
    </>
  );
}

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

export default EditBankAccountPage;
