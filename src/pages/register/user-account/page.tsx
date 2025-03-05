import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import Main from "@/components/Main";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setUserPassword } from "@/util/slices/registerUserInfoSlice";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterBankAccount = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const isCorrectPassword =
    Boolean(password) && Boolean(rePassword) && password === rePassword;

  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.registerUserInfo.email);
  const navigate = useNavigate();

  useEffect(() => {
    if (email === "") {
      alert("잘못된 접근입니다");
      alert("로그인 화면으로 이동합니다");
      navigate("/login");
    }
  }, []);

  const handleClickNext = () => {
    console.log(password, rePassword);
    if (!isCorrectPassword) return;

    dispatch(setUserPassword(password));
    navigate("/register/success");
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
          <p className="text-[20px] font-bold">계정 등록</p>
          <div className="flex flex-col gap-layout">
            <div className="w-full flex flex-col gap-[4px]">
              <span className="text-[14px] text-main-darkGray">
                이메일 계정
              </span>
              <input
                placeholder="이메일 계정을 불러오는 중..."
                type="text"
                readOnly
                value={email}
                className="w-full h-[50px] rounded-[10px] px-layout border border-main-gray outline-main-color"
              />
            </div>
            <div className="w-full flex flex-col gap-[4px]">
              <span className="text-[14px] text-main-darkGray">비밀번호</span>
              <input
                placeholder="비밀번호를 입력해주세요"
                type="password"
                value={password}
                className="w-full h-[50px] rounded-[10px] px-layout border border-main-gray outline-main-color"
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col gap-[4px]">
              <span className="text-[14px] text-main-darkGray">
                비밀번호 재입력
              </span>
              <input
                placeholder="비밀번호를 다시 입력해주세요"
                type="password"
                value={rePassword}
                className="w-full h-[50px] rounded-[10px] px-layout border border-main-gray outline-main-color"
                onChange={(e) => setRePassword(e.target.value)}
              />
              {password && rePassword && password !== rePassword && (
                <span className="text-[10px] text-warn pl-[10px]">
                  비밀번호가 일치하지 않습니다
                </span>
              )}
            </div>
          </div>

          <div className="w-full absolute bottom-[20px] left-0 px-[20px]">
            <button
              className={`w-full h-[50px] rounded-[10px] px-layout ${
                isCorrectPassword ? "bg-main-color" : "bg-selected-box"
              } text-center text-white`}
              disabled={!isCorrectPassword}
              onClick={handleClickNext}
            >
              다음
            </button>
          </div>
        </div>
      </Main>
    </>
  );
};

export default RegisterBankAccount;
