import React, { useState } from "react";
import styled, { keyframes } from "styled-components";
import banks from "@/types/banks";
import InputComponent from "@/components/Input";
import ArrowDownIcon from "@/components/icons/ArrowDown";

interface BankAccountInputProps {
  account: string;
  bank: string;
  onAccountChange: (value: string) => void;
  onBankSelect: (bank: string) => void;
}

const BankAccountInput: React.FC<BankAccountInputProps> = ({
  account,
  bank,
  onAccountChange,
  onBankSelect,
}) => {
  const [isOpenBottomSheet, setIsOpenBottomSheet] = useState(false);

  const handleChangeAccount = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, "").slice(0, 16);
    onAccountChange(value);
  };

  return (
    <>
      <InputComponent
        placeholder="계좌번호를 입력해주세요"
        value={account}
        onChange={handleChangeAccount}
        width="100%"
        padding="0 10px"
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
          width="100%"
          padding="0 10px"
          value={bank ? (bank.includes("뱅크") ? bank : `${bank}은행`) : ""}
          className="cursor-pointer"
        />
        <div className="absolute right-[20px] top-1/2 -translate-y-1/2">
          <ArrowDownIcon color="#717171" />
        </div>
      </div>
      {isOpenBottomSheet && (
        <Overlay
          isOpen={isOpenBottomSheet}
          onClick={() => setIsOpenBottomSheet(false)}
        >
          <Sheet
            isOpen={isOpenBottomSheet}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="w-[60px] h-[5px] rounded-full bg-main-gray"></div>
            <h1 className="text-left text-[20px] font-bold">은행 선택</h1>
            <div className="w-full overflow-y-scroll flex flex-wrap gap-y-[10px] mb-[20px]">
              {Object.entries(banks).map(([key, value]) => (
                <div
                  key={key}
                  onClick={() => {
                    onBankSelect(value);
                    setIsOpenBottomSheet(false);
                  }}
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
              ))}
            </div>
          </Sheet>
        </Overlay>
      )}
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

const Overlay = styled.div<{ isOpen: boolean }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: flex-end;
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  visibility: ${({ isOpen }) => (isOpen ? "visible" : "hidden")};
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
`;

const Sheet = styled.div<{ isOpen: boolean }>`
  width: 100%;
  max-height: 70%;
  min-height: 50%;
  background: white;
  padding: 20px;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(${({ isOpen }) => (isOpen ? "0" : "100%")});
  opacity: ${({ isOpen }) => (isOpen ? 1 : 0)};
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;
`;

export default BankAccountInput;
