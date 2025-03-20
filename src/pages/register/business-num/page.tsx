import Main from "@/components/Main";
import RegHeader from "@/components/RegHeader";
import { useAppDispatch } from "@/hooks/useRedux";
// import { setUserBisnessNumber } from "@/util/slices/registerUserInfoSlice";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterBusinessPage() {
  const [businessNumbers, setBusinessNumbers] = useState([""]);
  const dispatch = useAppDispatch();

  const navigate = useNavigate();

  // 사업자 번호 추가
  const addBusinessNumber = () => {
    setBusinessNumbers([...businessNumbers, ""]);
  };

  // 사업자 번호 삭제
  const removeBusinessNumber = (index: number) => {
    setBusinessNumbers(businessNumbers.filter((_, i) => i !== index));
  };

  // 입력 값 변경
  const handleChange = (index: number, value: string) => {
    const updatedNumbers = [...businessNumbers];
    updatedNumbers[index] = value;
    setBusinessNumbers(updatedNumbers);
  };

  const handleNumericInput =
    (index: number) => (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value.replace(/\D/g, ""); // 숫자만 남기고 제거
      handleChange(index, value); // 업데이트된 숫자를 설정
    };

  const handleClickNext = () => {
    // dispatch(setUserBisnessNumber(businessNumbers));
    navigate("/register/user-account");
  };

  return (
    <>
      <RegHeader percent={75} />
      <Main hasBottomNav={false}>
        <div className="flex flex-col gap-4 p-5">
          <p className="font-semibold text-xl">사업자번호</p>
          <p className="text-main-darkGray">
            사업자번호가 있으시면 입력해주세요
          </p>
          <div className="flex flex-col gap-2">
            {businessNumbers.map((number, index) => (
              <div key={index} className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="'-'를 제외하고 입력해주세요"
                  className="border border-white rounded-[10px] px-3 py-2 w-full focus:border-[#0B798B] focus:border-2 focus:outline-none"
                  value={number}
                  onChange={handleNumericInput(index)}
                  maxLength={10}
                />

                {index === businessNumbers.length - 1 ? (
                  <button
                    onClick={addBusinessNumber}
                    className="bg-[#0B798B] text-white px-3 py-2 rounded-[10px] w-10 h-10 flex items-center justify-center"
                  >
                    +
                  </button>
                ) : (
                  <button
                    onClick={() => removeBusinessNumber(index)}
                    className="bg-[#D7F6F6] text-black px-3 py-2 rounded-[10px] w-10 h-10 flex items-center justify-center"
                  >
                    -
                  </button>
                )}
              </div>
            ))}
          </div>

          <div className="absolute bottom-[20px] left-0 w-full px-[20px]">
            <button
              onClick={handleClickNext}
              className="bg-main-color text-white w-full p-[12px] rounded-[10px] text-[16px] hover:bg-[#0e6977]"
            >
              다음
            </button>
          </div>
        </div>
      </Main>
    </>
  );
}

export default RegisterBusinessPage;
