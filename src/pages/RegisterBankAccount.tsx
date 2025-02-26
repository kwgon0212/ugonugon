import React, { useRef } from "react";
import Header from "@/src/components/Header";
import BottomNav from "../components/BottomNav";
import Main from "../components/Main";

const RegisterBankAccount = () => {
  const modalRef = useRef<HTMLDialogElement | null>(null);

  const handleSelectBank = () => {
    if (!modalRef.current) return;
    modalRef.current.classList.add("modal-open");
  };

  return (
    <>
      <Header>
        <></>
      </Header>
      <Main hasBottomNav={false}>
        <div className="w-full p-layout flex flex-col gap-layout">
          <p className="text-[20px]">계좌등록</p>
          <div className="flex flex-col gap-layout">
            <input
              placeholder="계좌번호를 입력해주세요"
              className="h-[50px] rounded-[10px] px-layout border border-main-gray outline-main-color"
            />
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="w-full h-[50px] rounded-[10px] px-layout bg-white text-main-gray text-left"
              onClick={handleSelectBank}
            >
              <span>은행선택</span>
            </button>
          </div>
        </div>
      </Main>
      <BottomNav>
        <button className="w-full h-[50px] rounded-[10px] px-layout bg-white text-main-gray text-left">
          다음
        </button>
      </BottomNav>
    </>
  );
};

export default RegisterBankAccount;
