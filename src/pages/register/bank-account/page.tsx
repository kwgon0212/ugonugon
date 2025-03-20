import React, { useState } from "react";
import Main from "@/components/Main";
import { useAppDispatch } from "@/hooks/useRedux";
import { setUserBankAccount } from "@/util/slices/registerUserInfoSlice";
import { useNavigate } from "react-router-dom";
import SubmitButton from "@/components/SubmitButton";
import RegHeader from "@/components/RegHeader";
import BankAccountInput from "@/components/BankAccountInput";

const RegisterBankAccount = () => {
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");

  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleClickNext = () => {
    if (!account || !bank) return;

    dispatch(setUserBankAccount({ bank, account }));
    navigate("/register/user-account");
  };

  return (
    <>
      <RegHeader percent={62.5} />
      <Main hasBottomNav={false}>
        <div className="size-full p-layout flex flex-col gap-layout relative bg-white">
          <p className="text-xl font-bold">계좌 등록</p>
          <BankAccountInput
            account={account}
            bank={bank}
            onAccountChange={setAccount}
            onBankSelect={setBank}
          />

          <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
            <SubmitButton onClick={handleClickNext} type="button">
              다음
            </SubmitButton>
          </div>
        </div>
      </Main>
    </>
  );
};

export default RegisterBankAccount;
