import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { io } from "socket.io-client"; // Socket.IO 클라이언트 import

import Header from "@/components/Header";
import Main from "@/components/Main";
import AlertModal from "./AlertMocal";

import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import SendIcon from "@/components/icons/Send";

// styled components는 그대로 유지...
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

export function ChattingPage() {
  const [chat, setChat] = useState("");
  const [userChat, setUserChat] = useState<string[]>([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<
    { text: string; isMine: boolean; time: string }[]
  >([]);
  // 시간 포맷 함수 추가
  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // Socket.IO 연결 설정
  useEffect(() => {
    // 서버 URL을 적절히 수정하세요
    const newSocket = io("http://localhost:8080");

    newSocket.on("connect", () => {
      console.log("서버에 연결됨:", newSocket.id);
    });

    // 서버로부터 메시지 수신 시
    newSocket.on("chat message", (msg) => {
      if (!msg.isMine) {
        setMessages((prevMessages) => [
          ...prevMessages,
          { text: msg, isMine: false, time: formatTime() },
        ]);
      }
    });

    setSocket(newSocket);

    // 컴포넌트 언마운트 시 소켓 연결 해제
    return () => {
      newSocket.disconnect();
    };
  }, []);

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

  // 메시지 전송 시
  const handleSendChat = () => {
    if (chat.trim() === "" || !socket) return;

    socket.emit("chat message", chat);

    setMessages((prevMessages) => [
      ...prevMessages,
      { text: chat, isMine: true, time: formatTime() },
    ]);

    setChat("");
  };

  // 엔터 키로 메시지 전송
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
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
            {/* 모든 메시지 표시 */}
            {messages.map((message, index) =>
              message.isMine ? (
                // 내 메시지
                <UserChatWrap key={index}>
                  <div className="text-[12px] text-main-darkGray mb-[5px]">
                    {message.time}{" "}
                    {/* 여기서 time 상수 대신 message.time을 사용 */}
                  </div>
                  <ChatBox className="bg-selected-box text-selected-text text-[12px]">
                    {message.text}
                  </ChatBox>
                </UserChatWrap>
              ) : (
                // 상대방 메시지
                <OtherChatWrap key={index}>
                  <div className="text-[12px] text-main-darkGray mb-[5px]">
                    {message.time}{" "}
                    {/* 여기서 time 상수 대신 message.time을 사용 */}
                  </div>
                  <ChatBox className="bg-white">{message.text}</ChatBox>
                </OtherChatWrap>
              )
            )}
          </ChattingAreaWrap>
          <InputBar className="bg-main-bg">
            <div className="flex flex-[80%] h-fit">
              <ChatInput
                placeholder="채팅 입력"
                onChange={handleChangeChat}
                onKeyPress={handleKeyPress}
                value={chat}
                className="border-2 border-main-gray"
              ></ChatInput>
            </div>
            <div className="flex flex-[20%] justify-center w-full h-fit">
              <SendIconWrap
                className="bg-selected-box"
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
