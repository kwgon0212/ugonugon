import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { io } from "socket.io-client";
import axios from "axios";

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
  overflow: hidden;
`;

const SendIconWrap = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  height: 45px;
  width: 45px;
`;

// 메시지 인터페이스 정의
interface Message {
  text: string;
  senderId?: string;
  time: string;
  roomId?: string;
  _id?: string;
  createdAt?: string;
  isRead?: boolean; // 읽음 상태 추가
}

export function ChattingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const chattingAreaRef = useRef<HTMLDivElement>(null);

  // URL에서 userId와 roomId 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const currentUserId =
    searchParams.get("userId") || "67c7d6bf38fe53ff868e3880"; // 기본값은 홍길동의 ID
  const roomId = searchParams.get("roomId") || location.state?.roomId || "";
  const otherName = location.state?.otherName || "상대방";

  const [chat, setChat] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // 채팅방 ID에서 상대방 ID 추출
  const getOtherUserId = (roomId: string, myId: string): string => {
    // 채팅방 ID 형식: chat_user1Id_user2Id
    const parts = roomId.split("_");
    if (parts.length === 3) {
      const id1 = parts[1];
      const id2 = parts[2];
      return id1 === myId ? id2 : id1;
    }
    return "";
  };

  // 채팅방 입장 시 메시지를 읽음 상태로 변경
  const markMessagesAsRead = async () => {
    try {
      if (roomId && currentUserId) {
        await axios.put(`/api/messages/read/${roomId}/${currentUserId}`);
      }
    } catch (error) {
      console.error("메시지 읽음 상태 업데이트 실패:", error);
    }
  };

  // 페이지 로드 시 상대방이 나간 채팅방인지 확인
  useEffect(() => {
    // 로컬 스토리지에서 나간 채팅방 정보 가져오기
    const leftRooms = JSON.parse(localStorage.getItem("leftChatRooms") || "{}");

    // 채팅방이 존재하고, 누군가 나갔는지 확인
    if (roomId && leftRooms[roomId]) {
      const roomInfo = leftRooms[roomId];

      // 상대방 ID 가져오기
      const otherUserId = getOtherUserId(roomId, currentUserId);

      // 상대방이 나갔는지 확인 (leftBy나 leftBy2에 상대방 ID가 있는지)
      if (
        (roomInfo.leftBy === otherUserId || roomInfo.leftBy2 === otherUserId) &&
        roomInfo.leftBy !== currentUserId &&
        roomInfo.leftBy2 !== currentUserId
      ) {
        // 알림창 표시
        alert("상대방이 나간 채팅방입니다.");

        // 현재 사용자도 이 채팅방을 나간 것으로 표시
        if (roomInfo.leftBy && roomInfo.leftBy !== currentUserId) {
          leftRooms[roomId].leftBy2 = currentUserId;
          leftRooms[roomId].leftAt2 = new Date().toISOString();
        } else {
          leftRooms[roomId].leftBy = currentUserId;
          leftRooms[roomId].leftAt = new Date().toISOString();
        }

        localStorage.setItem("leftChatRooms", JSON.stringify(leftRooms));

        // 채팅 목록으로 돌아가기
        navigate(`/chat?userId=${currentUserId}`, { replace: true });
        return; // 이후 코드 실행 중단
      }
    }
  }, [roomId, currentUserId, navigate]);

  const formatTime = () => {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, "0");
    const minutes = now.getMinutes().toString().padStart(2, "0");
    return `${hours}:${minutes}`;
  };

  // 스크롤을 항상 맨 아래로 유지하는 함수
  const scrollToBottom = () => {
    if (chattingAreaRef.current) {
      chattingAreaRef.current.scrollTop = chattingAreaRef.current.scrollHeight;
    }
  };

  const handleBackClick = () => {
    // URL 파라미터 유지하며 목록으로 이동
    navigate(`/chat?userId=${currentUserId}`, { replace: true });
  };

  // 페이지 로드 시 기존 메시지 불러오기
  useEffect(() => {
    // 기존 메시지 로드
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${roomId}`);
        setMessages(response.data);
        setTimeout(scrollToBottom, 100);

        // 채팅방에 진입했을 때 메시지를 읽음 상태로 표시
        await markMessagesAsRead();
      } catch (error) {
        console.error("메시지 로드 중 오류:", error);
      }
    };

    if (roomId) {
      fetchMessages();
    }

    // 소켓 연결
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("서버에 연결됨:", newSocket.id);
    });

    newSocket.on("chat message", async (msg) => {
      // 받은 메시지가 현재 방의 메시지인지 확인
      if (msg.roomId === roomId) {
        setMessages((prevMessages) => [...prevMessages, msg]);
        setTimeout(scrollToBottom, 100);

        // 상대방의 메시지가 수신되면 바로 읽음 상태로 업데이트
        if (msg.senderId !== currentUserId) {
          await markMessagesAsRead();
        }
      }
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [roomId, currentUserId]);

  // 메시지가 변경될 때마다 스크롤 맨 아래로
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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
    if (chat.trim() === "" || !socket || !roomId) return;

    const currentTime = formatTime();
    const messageToSend = {
      text: chat,
      roomId: roomId,
      senderId: currentUserId, // 발신자 ID 추가
      time: currentTime,
    };

    // 소켓으로 메시지 전송
    socket.emit("chat message", messageToSend);

    // 로컬 상태에 메시지 추가
    setMessages((prevMessages) => [...prevMessages, messageToSend]);

    setChat("");
    setTimeout(scrollToBottom, 100);
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendChat();
    }
  };

  return (
    <>
      {isModalOpen && (
        <AlertModal handleClose={handleCloseAlertModal} roomId={roomId} />
      )}
      <Header>
        <HeaderWrap>
          <div onClick={handleBackClick} className="flex w-fit h-fit">
            <ArrowLeftIcon />
          </div>
          <div className="flex font-bold text-[16px]">{otherName}님</div>
          <div onClick={handleOpenAlertModal} className="flex w-fit h-fit">
            <CancelIcon />
          </div>
        </HeaderWrap>
      </Header>
      <Main hasBottomNav={false}>
        <MainWrap>
          <ChattingAreaWrap ref={chattingAreaRef}>
            {messages.map((message, index) =>
              message.senderId === currentUserId ? (
                <UserChatWrap key={index}>
                  <div className="text-[12px] text-main-darkGray mb-[5px]">
                    {message.time}
                  </div>
                  <ChatBox className="bg-selected-box text-selected-text text-[12px]">
                    {message.text}
                  </ChatBox>
                </UserChatWrap>
              ) : (
                <OtherChatWrap key={index}>
                  <div className="text-[12px] text-main-darkGray mb-[5px]">
                    {message.time}
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
