import React from "react";
import Header from "../components/Header";
import Main from "../components/Main";
import BottomNav from "../components/BottomNav";
import ArrowLeftIcon from "../components/icons/ArrowLeft";

const RegisterBankAccount = () => {
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
              className="h-[50px] rounded-[10px] px-layout"
            />
            <button className="w-full h-[50px] rounded-[10px] px-layout bg-white text-main-gray text-left">
              <span>은행선택</span>
            </button>
            {/* You can open the modal using document.getElementById('ID').showModal() method */}
            <button
              className="btn"
              // onClick={() => document.getElementById("my_modal_3").showModal()}
            >
              open modal
            </button>
            <dialog id="my_modal_3" className="modal">
              <div className="modal-box">
                <form method="dialog">
                  {/* if there is a button in form, it will close the modal */}
                  <button className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">
                    ✕
                  </button>
                </form>
                <h3 className="font-bold text-lg">Hello!</h3>
                <p className="py-4">
                  Press ESC key or click on ✕ button to close
                </p>
              </div>
            </dialog>
            <ArrowLeftIcon width={50} height={50} color="#000000" />
          </div>
        </div>
      </Main>
      <BottomNav>
        <></>
      </BottomNav>
    </>
  );
};

export default RegisterBankAccount;
