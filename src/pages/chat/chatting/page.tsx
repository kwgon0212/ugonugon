import React, { useState } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";

import Header from "@/components/Header";
import Main from "@/components/Main";
import AlertModal from "./AlertMocal";

import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import SendIcon from "@/components/icons/Send";

const HeaderWrap = styled.div`
  position: relative;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 100%;
  padding: 5%;
`;

const MainWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 5%;
`;
const ChattingAreaWrap = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 80px;
  scrollbar-width: none;

  /* &:-webkit-scrollbar {
    display: none;
  } */
  /* -ms-overflow-style: none; */
`;

const OtherChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: start;
  width: 100%;
`;

const UserChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  width: 100%;
`;

const ChatBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  max-width: 46%;
  height: fit-content;
  border-radius: 10px;
  font-size: 14px;
  padding: 12px;
`;

const InputBar = styled.div`
  position: absolute;
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  height: 80px;
  /* max-height: 160px; */
  bottom: 0;
  left: 0;
  padding: 5%;
  padding-right: 0;
  z-index: 10;
`;

const ChatInput = styled.textarea`
  display: flex;
  align-items: center;
  padding: 12px;
  padding-top: 10px;
  padding-bottom: 5px;
  border-radius: 10px;
  width: 100%;
  font-size: 16px;
  height: 45px;
  max-height: 90px;
  /* border: 1px solid "#717171"; */
  /* resize: none; 사용자가 크기를 조정하지 못하게 설정 */
  overflow: hidden; /* 텍스트가 넘치지 않도록 숨김 */
`;

const SendIconWrap = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 45px;
  width: 45px;
`;

const user = "고용주";
const time = "13:00";
const otherChat = "안녕하세요! 근로자님";

export function ChattingPage() {
  const [chat, setChat] = useState("");
  const [userChat, setUserChat] = useState<string[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);

  const handleOpenAlertModal = () => {
    setModalOpen(true);
  };

  const handleCloseAlertModal = () => {
    setModalOpen(false);
  };

  const handleChangeChat = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setChat(value);
  };

  const handleSendChat = () => {
    if (chat.trim() === "") return;
    setUserChat((prevChat) => [...prevChat, chat]);
    setChat("");
  };

  return (
    <>
      {isModalOpen && <AlertModal handleClose={handleCloseAlertModal} />}
      <Header>
        <HeaderWrap>
          <Link to="/chat" className="flex w-fit h-fit">
            <ArrowLeftIcon />
          </Link>
          <div className="flex font-bold text-[16px]">{user}님</div>
          <div onClick={handleOpenAlertModal} className="flex w-fit h-fit">
            <CancelIcon />
          </div>
        </HeaderWrap>
      </Header>
      <Main hasBottomNav={false}>
        <MainWrap>
          <ChattingAreaWrap>
            {/* 상대방 채팅 말풍선 */}
            <OtherChatWrap>
              <div className="text-[12px] text-main-darkGray mb-[5px]">
                {time}
              </div>
              <ChatBox className="bg-white">{otherChat}</ChatBox>
            </OtherChatWrap>
            {/* 사용자 채팅 말풍선 */}
            <UserChatWrap>
              {userChat.map((chat, index) => (
                <>
                  <div
                    key={index}
                    className="text-[12px] text-main-darkGray mb-[5px]"
                  >
                    {time}
                  </div>
                  <ChatBox
                    key={index}
                    className="bg-selected-box text-selected-text text-[12px]"
                  >
                    {chat}
                  </ChatBox>
                </>
              ))}
            </UserChatWrap>
          </ChattingAreaWrap>
          <InputBar className="bg-main-bg">
            <div className="flex flex-[80%] h-fit  ">
              <ChatInput
                placeholder="채팅 입력"
                onChange={handleChangeChat}
                value={chat}
                className="border-2 border-main-gray"
              ></ChatInput>
            </div>
            <div className="flex flex-[20%] justify-center w-full h-fit">
              <SendIconWrap
                className=" bg-selected-box"
                onClick={handleSendChat}
              >
                <SendIcon />
              </SendIconWrap>
            </div>
          </InputBar>
        </MainWrap>
      </Main>
    </>
  );
}

export default ChattingPage;
