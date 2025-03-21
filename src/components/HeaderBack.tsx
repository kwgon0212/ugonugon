import React from "react";
import { useNavigate } from "react-router-dom";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";

interface HeaderWithBackProps {
  title: string;
  backPage?: string | number | (() => void); // 함수도 받을 수 있도록 수정
}

const HeaderBack: React.FC<HeaderWithBackProps> = ({
  title,
  backPage = -1,
}) => {
  const navigate = useNavigate();

  const handleNavigate = () => {
    if (typeof backPage === "function") {
      backPage(); // 전달된 함수 실행
    } else if (typeof backPage === "number") {
      navigate(backPage); // 뒤로 가기
    } else {
      navigate(backPage); // 특정 경로로 이동
    }
  };

  return (
    <header className="bg-main-color">
      <div className="p-layout h-full flex flex-wrap content-center">
        <button onClick={handleNavigate}>
          <ArrowLeftIcon className="text-white" />
        </button>
        <span className="absolute left-1/2 -translate-x-1/2 font-bold text-white">
          {title}
        </span>
      </div>
    </header>
  );
};

export default HeaderBack;
