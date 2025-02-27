import React from "react";
import styled from "styled-components";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import ArrowLeftIcon from "../../../components/icons/ArrowLeft";
import SearchIcon from "../../../components/icons/Search";

interface InputProps {
  padding?: string;
}

const BottomButton = styled.button`
  position: absolute;
  bottom: 60px;
  left: 50%;
  transform: translateX(-50%);
  width: calc(100% - 40px);
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: #0b798b;
  color: white;
`;

const InsertTextInput = styled.input<InputProps>`
  width: ${(props) => props.height || "100%"};
  height: ${(props) => props.width || "40px"};
  background: white;
  border-radius: 10px;
  padding: ${(props) => props.padding || "0 20px"};

  ::placeholder {
    color: #d9d9d9;
    font-size: 14px;
  }

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
  }
`;

const Title = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 16px;
`;

function NoticeSearch() {
  return (
    <>
      <Header>
        <div className="p-layout h-full flex flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} color="black" />
          <Title>공고 검색</Title>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <form className="w-full p-layout flex flex-col gap-layout divide-[#0b798b]">
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden h-10">
            <button className="px-[15px] bg-white h-full">
              <SearchIcon />
            </button>
            <InsertTextInput
              type="email"
              placeholder="이메일 계정"
              //   padding="0 50px"
              pattern="[\w]+@+[\w]+\.[\w]+"
              required
            />
          </div>
          <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden">
            <input
              type="text"
              placeholder="검색..."
              className="w-full px-4 py-2 focus:outline-none"
            />
            <button className="px-3 bg-gray-100 hover:bg-gray-200">
              <SearchIcon />
            </button>
          </div>

          <BottomButton>이력서 등록</BottomButton>
        </form>
      </Main>
    </>
  );
}

export default NoticeSearch;
