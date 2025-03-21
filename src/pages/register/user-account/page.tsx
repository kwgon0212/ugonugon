import InputComponent from "@/components/Input";
import Main from "@/components/Main";
import RegHeader from "@/components/RegHeader";
import SubmitButton from "@/components/SubmitButton";
import { useAppDispatch, useAppSelector } from "@/hooks/useRedux";
import { setUserPassword } from "@/util/slices/registerUserInfoSlice";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

const RegisterBankAccount = () => {
  const [password, setPassword] = useState("");
  const [rePassword, setRePassword] = useState("");
  const isCorrectPassword =
    Boolean(password) && Boolean(rePassword) && password === rePassword;

  const dispatch = useAppDispatch();
  const email = useAppSelector((state) => state.registerUserInfo.email);
  const navigate = useNavigate();

  const handleClickNext = () => {
    if (!isCorrectPassword) return;

    dispatch(setUserPassword(password));
    navigate("/register/success");
  };

  return (
    <>
      <RegHeader percent={87.5} />
      <Main hasBottomNav={false}>
        <div className="size-full p-layout flex flex-col gap-layout relative bg-white">
          <p className="text-xl font-bold">계정 등록</p>
          <div className="flex flex-col gap-layout">
            <div className="w-full flex flex-col gap-[4px]">
              <span className="text-sm text-main-darkGray">이메일 계정</span>
              <InputComponent
                placeholder="이메일 계정을 불러오는 중..."
                type="text"
                width="100%"
                padding="0 10px"
                readOnly
                value={email}
                className="cursor-default"
              />
            </div>
            <div className="w-full flex flex-col gap-[4px]">
              <span className="text-sm text-main-darkGray">비밀번호</span>
              <InputComponent
                placeholder="비밀번호를 입력해주세요"
                type="password"
                width="100%"
                padding="0 10px"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <div className="w-full flex flex-col gap-[4px]">
              <span className="text-sm text-main-darkGray">
                비밀번호 재입력
              </span>
              <InputComponent
                placeholder="비밀번호를 다시 입력해주세요"
                type="password"
                width="100%"
                padding="0 10px"
                value={rePassword}
                onChange={(e) => setRePassword(e.target.value)}
              />
              {password && rePassword && password !== rePassword && (
                <span className="text-sm text-warn pl-[10px]">
                  비밀번호가 일치하지 않습니다
                </span>
              )}
            </div>
          </div>

          <div className="absolute bottom-[20px] left-0 w-full px-[20px] flex justify-center">
            <SubmitButton onClick={handleClickNext}>다음</SubmitButton>
          </div>
        </div>
      </Main>
    </>
  );
};

export default RegisterBankAccount;
