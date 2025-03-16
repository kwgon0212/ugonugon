import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowDownIcon from "@/components/icons/ArrowDown";

import Header from "@/components/Header";
import Main from "@/components/Main";

import banks from "./banks";
import { useAppSelector } from "@/hooks/useRedux";
import { putUser, type User } from "@/hooks/fetchUser";
import SubmitButton from "@/components/SubmitButton";
import InputComponent from "@/components/Input";
import Modal from "@/components/Modal";
import CancelIcon from "@/components/icons/Cancel";

const BankBottomSheet = Modal;
const SaveModal = Modal;

export function EditBankAccountPageBefore() {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const navigate = useNavigate();

  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");

  // color State가 필요한지?
  const [isOpenBankBottomSheet, setIsOpenBankBottomSheet] = useState(false);
  const [isOpenSaveModal, setIsOpenSaveModal] = useState(false);

  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
    // 은행마다 계좌번호 길이가 다를 수 있음 (ex: 폰 번호로 계좌 번호)
    setAccount(value);
  };

  const handleBank = (bankName: string) => {
    setBank(bankName);
    setIsOpenBankBottomSheet(false);
  };

  const handleClickSave = async () => {
    await putUser(userId, {
      bankAccount: {
        bank,
        account,
      },
    });
    navigate("/mypage");
  };

  return (
    <>
      <Header>
        {/* <HeaderWrap>
          <div onClick={handleOpenAlertModal} className="flex w-fit h-fit ">
            <ArrowLeftIcon color={color} />
          </div>
        </HeaderWrap> */}
        <div className="p-layout h-full flex flex-wrap content-center bg-main-color">
          <button onClick={() => setIsOpenSaveModal(true)}>
            <ArrowLeftIcon className="text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 font-bold text-white">
            내 계좌 관리
          </span>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <>
          <div className="size-full p-layout flex flex-col gap-layout relative bg-white">
            {/* {isModalOpen && <AlertModal handleClose={handleCloseAlertModal} />} */}
            <p className="text-xl font-bold">계좌 등록</p>
            <div className="w-full relative">
              <InputComponent
                placeholder="계좌번호를 입력해주세요"
                value={account}
                onChange={handleChangeAccount}
                type="numeric"
                width="100%"
                height="50px"
              />
              {account !== "" && (
                <button
                  className="absolute top-1/2 -translate-y-1/2 right-[20px]"
                  onClick={() => setAccount("")}
                >
                  <CancelIcon className="text-main-darkGray" />
                </button>
              )}
            </div>
            <div
              className="w-full relative"
              onClick={() => setIsOpenBankBottomSheet(true)}
            >
              <InputComponent
                type="text"
                width="100%"
                height="50px"
                readOnly
                placeholder="은행선택"
                value={
                  bank ? (bank.includes("뱅크") ? bank : `${bank}은행`) : ""
                }
                className="cursor-pointer"
              />
              <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
                <ArrowDownIcon className="text-main-darkGray" />
              </div>
            </div>
            <div className="flex justify-center w-full h-[10%]">
              <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
                <SubmitButton onClick={handleClickSave} type="button">
                  저장
                </SubmitButton>
              </div>
              <SaveModal
                isOpen={isOpenSaveModal}
                setIsOpen={setIsOpenSaveModal}
              >
                <div className="flex font-bold text-[16px]">
                  정말로 나가시겠습니까?
                </div>
                <div className="flex text-[14px]">
                  나가시면 변경사항이 저장되지 않습니다.
                </div>
                <div className="flex w-full gap-[10px]">
                  <SubmitButton diff onClick={() => setIsOpenSaveModal(false)}>
                    취소
                  </SubmitButton>
                  <SubmitButton onClick={() => navigate(-1)}>
                    나가기
                  </SubmitButton>
                </div>
              </SaveModal>

              <BankBottomSheet
                isOpen={isOpenBankBottomSheet}
                setIsOpen={setIsOpenBankBottomSheet}
                position="bottom"
              >
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
              </BankBottomSheet>
            </div>
          </div>
        </>
      </Main>
    </>
  );
}

export default EditBankAccountPageBefore;
