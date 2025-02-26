import { useState } from "react";
import { Link } from "react-router-dom";
import BottomNav from "../../../components/BottomNav";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import ArrowLeftIcon from "../../../components/icons/ArrowLeft";
import CancelIcon from "../../../components/icons/Cancel";

function RegisterBusinessPage() {
  const [businessNumbers, setBusinessNumbers] = useState([""]);

  // 사업자 번호 추가
  const addBusinessNumber = () => {
    setBusinessNumbers([...businessNumbers, ""]);
  };

  // 사업자 번호 삭제
  const removeBusinessNumber = (index) => {
    setBusinessNumbers(businessNumbers.filter((_, i) => i !== index));
  };

  // 입력 값 변경
  const handleChange = (index, value) => {
    const updatedNumbers = [...businessNumbers];
    updatedNumbers[index] = value;
    setBusinessNumbers(updatedNumbers);
  };
  const handleNumericInput = (index) => (e) => {
    const value = e.target.value.replace(/\D/g, ""); // 숫자만 남기고 제거
    handleChange(index, value); // 업데이트된 숫자를 설정
  };

  return (
    <>
      <Header>
        <div className="relative flex flex-col justify-center w-full h-full">
          <div className="flex flex-row justify-between pl-5 pr-5">
            <Link to="/register/login">
              <ArrowLeftIcon />
            </Link>
            <Link to="/login">
              <CancelIcon />
            </Link>
          </div>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="flex flex-col gap-4 p-5">
          <p className="font-semibold text-[20px]">사업자번호</p>
          <p className="text-[16px] text-main-darkGray">
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
          <Link to="/register/info" className="w-full flex justify-center">
            <button className="bg-[#0B798B]  text-white w-[362px] p-[12px] absolute bottom-[20px] rounded-[10px] text-[16px]  hover:bg-[#0e6977]">
              다음
            </button>
          </Link>
        </div>
      </Main>
    </>
  );
}

export default RegisterBusinessPage;
