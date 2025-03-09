import React from "react";
import Header from "./components/Header";
import Main from "./components/Main";

const NotFound = () => {
  return (
    <>
      <Header>
        <div className="size-full bg-main-bg"></div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="flex flex-col items-center justify-end h-1/2 bg-gray-100 text-gray-800">
          <h1 className="text-[60px] font-bold text-gray-900">404</h1>
          <p className="text-xl mt-4">페이지를 찾을 수 없습니다.</p>
          <p className="text-gray-600 mt-2">
            존재하지 않는 페이지이거나 이동되었을 수 있습니다.
          </p>
          <a
            href="/"
            className="mt-6 px-6 py-3 text-white bg-main-color rounded-[10px] shadow-md transition"
          >
            홈으로 돌아가기
          </a>
        </div>
      </Main>
    </>
  );
};

export default NotFound;
