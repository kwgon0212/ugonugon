import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import { io } from "socket.io-client";
import axios from "axios";
import { useAppSelector } from "@/hooks/useRedux";

import Header from "@/components/Header";
import Main from "@/components/Main";
import AlertModal from "./AlertModal";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import CancelIcon from "@/components/icons/Cancel";
import SendIcon from "@/components/icons/Send";
import { formatMessageTime, getOtherUserId } from "@/util/chatUtils";
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
  margin-bottom: 16px;
`;

const UserChatWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: end;
  width: 100%;
  margin-bottom: 16px;
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

// 시스템 메시지 스타일 추가
const SystemMessageWrap = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  margin: 16px 0;
`;

const SystemMessageBox = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: fit-content;
  max-width: 80%;
  padding: 8px 16px;
  border-radius: 16px;
  background-color: #f0f0f0;
  color: #666;
  font-size: 12px;
  text-align: center;
`;

// 메시지 인터페이스 정의
interface Message {
  text: string;
  senderId?: string;
  time: string;
  roomId?: string;
  _id?: string;
  createdAt?: string;
  isRead?: boolean;
  // 클라이언트에서 메시지 추적을 위한 로컬 ID 추가
  localId?: string;
  isSystemMessage?: boolean;
}

// 사용자 정보 인터페이스
interface User {
  _id: string;
  name: string;
}

export function ChattingPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const chattingAreaRef = useRef<HTMLDivElement>(null);

  // 리덕스에서 로그인한 사용자 정보 가져오기
  const currentUser = useAppSelector((state) => state.auth.user);
  const reduxUserId = currentUser?._id;

  // URL에서 userId와 roomId 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const urlUserId = searchParams.get("userId");
  const roomId = searchParams.get("roomId") || location.state?.roomId || "";

  // 실제 사용할 유저 ID (로그인된 사용자 우선, URL 파라미터는 백업)
  const currentUserId = reduxUserId || urlUserId || "";

  // 상대방 이름 (state에서 가져오거나 API로 조회 예정)
  const [otherName, setOtherName] = useState(
    location.state?.otherName || "상대방"
  );

  const [chat, setChat] = useState("");
  const [isModalOpen, setModalOpen] = useState(false);
  const [socket, setSocket] = useState<any>(null);
  const [messages, setMessages] = useState<Message[]>([]);

  // 메시지 중복 방지를 위한 ID 세트
  const [receivedMessages, setReceivedMessages] = useState<Set<string>>(
    new Set()
  );
  // 로컬에서 생성한 메시지 ID 추적
  const [localMessageIds, setLocalMessageIds] = useState<Set<string>>(
    new Set()
  );
  // 상대방이 나갔는지 여부
  const [isPartnerLeft, setIsPartnerLeft] = useState(false);

  // 채팅방 입장 시 메시지를 읽음 상태로 변경
  const markMessagesAsRead = async () => {
    try {
      if (roomId && currentUserId) {
        await axios.put(`/api/messages/read/${roomId}/${currentUserId}`);
        console.log("메시지를 읽음 상태로 업데이트했습니다.");
      }
    } catch (error) {
      console.error("메시지 읽음 상태 업데이트 실패:", error);
    }
  };

  // 상대방 정보 가져오기
  useEffect(() => {
    const fetchOtherUserInfo = async () => {
      if (!roomId || !currentUserId) return;

      try {
        // roomId에서 상대방 ID 추출
        const otherId = getOtherUserId(roomId, currentUserId);
        console.log("상대방 ID:", otherId);

        if (otherId) {
          // API 호출 전 유효성 검사
          if (!otherId || otherId === "undefined" || otherId === "null") {
            console.warn("유효하지 않은 사용자 ID:", otherId);
            setOtherName("알 수 없음");
            return;
          }

          try {
            // 일반 사용자 정보 API 시도
            const response = await axios.get(`/api/users/${otherId}`);
            const otherUser = response.data;

            // 디버깅 로그
            console.log("상대방 정보 (사용자 API):", otherUser);

            if (otherUser && otherUser.name && otherUser.name !== "사용자") {
              setOtherName(otherUser.name);
              return;
            }
          } catch (userError) {
            if (
              axios.isAxiosError(userError) &&
              userError.response?.status === 404
            ) {
              console.warn(`사용자 ${otherId}를 찾을 수 없음`);
            } else {
              console.log("일반 사용자 정보 로드 실패:", userError);
            }
          }

          try {
            // 공고 작성자 정보 API 시도
            const authorResponse = await axios.get(
              `/api/post/author/${otherId}`
            );
            console.log("작성자 정보 응답:", authorResponse.data);

            if (
              authorResponse.data &&
              authorResponse.data.recruiter &&
              authorResponse.data.recruiter.name
            ) {
              setOtherName(authorResponse.data.recruiter.name);
              return;
            }
          } catch (authorError) {
            console.error("공고 작성자 정보 로드 실패:", authorError);
          }

          // location.state에서 이름 가져오기 시도
          if (location.state?.otherName) {
            setOtherName(location.state.otherName);
          } else {
            setOtherName("상대방");
          }
        }
      } catch (error) {
        console.error("상대방 정보 로드 실패:", error);

        // 로컬 상태의 이름이 있으면 사용, 없으면 기본값 설정
        if (!otherName || otherName === "상대방") {
          setOtherName(location.state?.otherName || "상대방");
        }
      }
    };

    // 상대방 이름이 기본값이면 정보 가져오기
    if (otherName === "상대방") {
      fetchOtherUserInfo();
    }
  }, [roomId, currentUserId, otherName, location.state]);

  // 페이지 로드 시 상대방이 나간 채팅방인지 확인
  useEffect(() => {
    if (!roomId || !currentUserId) return;

    console.log("채팅방 상태 확인 중:", roomId);

    // 로컬 스토리지에서 나간 채팅방 정보 가져오기
    const leftRooms = JSON.parse(localStorage.getItem("leftChatRooms") || "{}");
    console.log("나간 채팅방 정보:", leftRooms);

    // 채팅방이 존재하고, 누군가 나갔는지 확인
    if (roomId && leftRooms[roomId]) {
      const roomInfo = leftRooms[roomId];
      console.log("현재 채팅방 나가기 정보:", roomInfo);

      // 상대방 ID 가져오기
      const otherUserId = getOtherUserId(roomId, currentUserId);
      console.log("상대방 ID:", otherUserId, "현재 사용자 ID:", currentUserId);

      // 상대방이 나갔는지 확인 (leftBy나 leftBy2에 상대방 ID가 있는지)
      if (roomInfo.leftBy === otherUserId || roomInfo.leftBy2 === otherUserId) {
        console.log("상대방이 나간 채팅방입니다.");

        // 사용자에게 메시지는 표시하되 채팅 입력은 비활성화
        setIsPartnerLeft(true);

        // 현재 사용자가 이미 나갔는지 확인
        const currentUserLeft =
          roomInfo.leftBy === currentUserId ||
          roomInfo.leftBy2 === currentUserId;

        // 현재 사용자도 이미 나간 상태라면 목록으로 돌아가기
        if (currentUserLeft) {
          console.log("현재 사용자도 이미 나간 상태입니다.");

          // 알림창 표시
          alert("이미 나간 채팅방입니다.");

          // 채팅 목록으로 돌아가기
          navigate(`/chat?userId=${currentUserId}`, { replace: true });
          return; // 이후 코드 실행 중단
        }
      }
    }

    // 추가: 메시지 내용에서 상대방 나감 확인
    const checkMessagesForPartnerLeft = async () => {
      try {
        const response = await axios.get(`/api/messages/${roomId}`);
        const messages = response.data;

        // 시스템 메시지를 찾아서 상대방이 나갔는지 확인
        const partnerLeftMessage = messages.find(
          (msg: any) =>
            (msg.isSystemMessage || msg.senderId === "system") &&
            msg.text &&
            msg.text.includes("상대방이 채팅방을 나갔습니다")
        );

        if (partnerLeftMessage) {
          console.log("상대방 나감 메시지 발견:", partnerLeftMessage);
          setIsPartnerLeft(true);
        }
      } catch (error) {
        console.error("메시지 확인 중 오류:", error);
      }
    };

    checkMessagesForPartnerLeft();
  }, [roomId, currentUserId, navigate]);

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
    if (!roomId || !currentUserId) return;

    // 기존 메시지 로드
    const fetchMessages = async () => {
      try {
        const response = await axios.get(`/api/messages/${roomId}`);
        console.log("기존 메시지 로드:", response.data);

        // 메시지 ID 기록
        const msgIds = new Set<string>();
        response.data.forEach((msg: any) => {
          if (msg._id) {
            msgIds.add(msg._id);
          }
        });

        setReceivedMessages(msgIds);
        setMessages(response.data);
        setTimeout(scrollToBottom, 100);

        // 채팅방에 진입했을 때 메시지를 읽음 상태로 표시
        await markMessagesAsRead();
      } catch (error) {
        console.error("메시지 로드 중 오류:", error);
      }
    };

    fetchMessages();

    // 기존 소켓 연결 정리
    return () => {
      if (socket) {
        socket.off("chat message");
        socket.emit("leave_room", { roomId });
        socket.disconnect();
      }
    };
  }, [roomId, currentUserId]);

  // 소켓 연결 설정
  useEffect(() => {
    if (!roomId || !currentUserId) return;

    // 소켓 연결
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("서버에 연결됨:", newSocket.id);

      // 사용자 ID 전송
      newSocket.emit("join_user", { userId: currentUserId });

      // 해당 채팅방 참여
      newSocket.emit("join_room", { roomId });
    });

    // 메시지 핸들러 함수
    const handleChatMessage = async (msg: any) => {
      console.log("메시지 수신:", msg);

      // 받은 메시지가 현재 방의 메시지인지 확인
      if (msg.roomId !== roomId) return;

      // 시스템 메시지 먼저 처리 (중요: 다른 검사보다 우선)
      if (msg.isSystemMessage || msg.senderId === "system") {
        console.log("시스템 메시지 수신:", msg.text);

        // 시스템 메시지 추가
        setMessages((prevMessages) => [...prevMessages, msg]);

        // 상대방이 채팅방을 나갔다는 메시지인 경우
        if (msg.text && msg.text.includes("상대방이 채팅방을 나갔습니다")) {
          console.log("상대방 퇴장 감지, 입력창 비활성화");
          setIsPartnerLeft(true);
        }

        setTimeout(scrollToBottom, 100);
        return;
      }

      // 이미 받은 메시지인지 확인 (중복 방지)
      if (msg._id && receivedMessages.has(msg._id)) {
        console.log("서버 ID 기준 중복 메시지 무시:", msg._id);
        return;
      }

      // 로컬에서 생성한 메시지인지 확인 (자신이 보낸 메시지의 중복 방지)
      if (msg.localId && localMessageIds.has(msg.localId)) {
        console.log("로컬 ID 기준 중복 메시지 무시:", msg.localId);
        return;
      }

      // 자신이 보낸 메시지인지 확인 (내가 보낸 메시지는 이미 UI에 표시되어 있음)
      if (msg.senderId === currentUserId) {
        // 서버에서 생성된 ID가 있으면 기록 (추후 중복 방지용)
        if (msg._id) {
          setReceivedMessages((prev) => new Set(prev).add(msg._id!));
        }
        return;
      }

      // 메시지 추가 (상대방이 보낸 메시지)
      setMessages((prevMessages) => [...prevMessages, msg]);

      // ID 있는 메시지는 수신 목록에 추가 (중복 방지용)
      if (msg._id) {
        setReceivedMessages((prev) => new Set(prev).add(msg._id!));
      }

      setTimeout(scrollToBottom, 100);

      // 상대방의 메시지가 수신되면 바로 읽음 상태로 업데이트
      await markMessagesAsRead();
    };

    // 메시지 수신 이벤트 등록
    newSocket.on("chat message", handleChatMessage);

    setSocket(newSocket);

    // 정리 함수
    return () => {
      newSocket.off("chat message", handleChatMessage);
      newSocket.emit("leave_room", { roomId });
      newSocket.disconnect();
    };
  }, [roomId, currentUserId, receivedMessages, localMessageIds]);

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
    // 입력 텍스트가 비어있거나, 소켓 연결이 없거나, 방 ID가 없거나, 사용자 ID가 없거나, 상대방이 나간 경우 메시지 전송하지 않음
    if (
      chat.trim() === "" ||
      !socket ||
      !roomId ||
      !currentUserId ||
      isPartnerLeft // 상대방이 나갔는지 확인
    ) {
      if (isPartnerLeft) {
        // 상대방이 나간 경우 알림 표시
        alert("상대방이 채팅방을 나갔습니다. 메시지를 보낼 수 없습니다.");
      }
      return;
    }

    // 로컬 메시지 ID 생성 (중복 방지용)
    const localId = `local_${Date.now()}_${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const currentTime = formatMessageTime();
    const messageToSend = {
      text: chat,
      roomId: roomId,
      senderId: currentUserId,
      time: currentTime,
      localId: localId, // 로컬 ID 추가
    };

    // 로컬 메시지 ID 기록 (중복 방지용)
    setLocalMessageIds((prev) => new Set(prev).add(localId));

    // 소켓으로 메시지 전송
    socket.emit("chat message", messageToSend);

    // 로컬 상태에 메시지 추가 (UI 즉시 업데이트)
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

  // 채팅 입력부 UI 렌더링
  const renderInputBar = () => {
    if (isPartnerLeft) {
      return (
        <InputBar className="bg-main-bg">
          <div className="w-full flex justify-center mr-4 items-center h-[45px] border-2 border-main-color rounded-[10px] bg-selected-box text-gray-500">
            상대방이 채팅방을 나갔습니다
          </div>
        </InputBar>
      );
    }

    return (
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
          <SendIconWrap className="bg-selected-box" onClick={handleSendChat}>
            <SendIcon />
          </SendIconWrap>
        </div>
      </InputBar>
    );
  };

  // 사용자가 로그인하지 않은 경우 처리
  if (!currentUserId) {
    return (
      <>
        <Header>
          <HeaderWrap>
            <div className="flex font-bold text-[16px]">채팅</div>
          </HeaderWrap>
        </Header>
        <Main hasBottomNav={false}>
          <div className="p-5 text-center">
            <p>로그인이 필요합니다.</p>
            <button
              onClick={() => navigate("/login")}
              className="mt-4 bg-main-color text-white py-2 px-4 rounded-[10px]"
            >
              로그인하러 가기
            </button>
          </div>
        </Main>
      </>
    );
  }

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
            {messages.map((message, index) => {
              // 시스템 메시지인 경우
              if (message.isSystemMessage || message.senderId === "system") {
                return (
                  <SystemMessageWrap key={index}>
                    <SystemMessageBox>{message.text}</SystemMessageBox>
                  </SystemMessageWrap>
                );
              }

              // 내가 보낸 메시지
              if (message.senderId === currentUserId) {
                return (
                  <UserChatWrap key={index}>
                    <div className="text-[12px] text-main-darkGray mb-[5px]">
                      {message.time}
                    </div>
                    <ChatBox className="bg-selected-box text-selected-text text-[12px]">
                      {message.text}
                    </ChatBox>
                  </UserChatWrap>
                );
              }

              // 상대방이 보낸 메시지
              return (
                <OtherChatWrap key={index}>
                  <div className="text-[12px] text-main-darkGray mb-[5px]">
                    {message.time}
                  </div>
                  <ChatBox className="bg-white">{message.text}</ChatBox>
                </OtherChatWrap>
              );
            })}
          </ChattingAreaWrap>
          {renderInputBar()}
        </MainWrap>
      </Main>
    </>
  );
}

export default ChattingPage;
