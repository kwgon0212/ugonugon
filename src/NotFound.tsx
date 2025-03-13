import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";
import SubmitButton from "./components/SubmitButton";
import { Link } from "react-router-dom";

const NotFound = () => {
  return (
    <>
      <Header>
        <div className="size-full bg-white"></div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full bg-white relative">
          <div className="w-full flex flex-col items-center absolute top-[30%] -translate-y-1/2">
            <h1 className="text-[60px] font-bold text-gray-900">404</h1>
            <p className="text-xl mt-4">페이지를 찾을 수 없습니다</p>
            <p className="text-gray-600 mt-2">
              존재하지 않는 페이지이거나 이동되었을 수 있습니다
            </p>
            <Link to="/" className="w-[200px] mt-6">
              <SubmitButton>홈으로 돌아가기</SubmitButton>
            </Link>
          </div>
        </div>
      </Main>
    </>
  );
};

export default NotFound;
