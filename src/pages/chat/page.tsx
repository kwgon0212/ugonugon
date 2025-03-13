import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import { useAppSelector } from "@/hooks/useRedux";
import { getOtherUserId } from "@/util/chatUtils";
import RefreshIcon from "@/components/icons/Refresh";
import ChatLoading from "@/loading/page";
// 채팅방 정보 인터페이스 정의
interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number;
  lastSenderId?: string;
}

// 서버에서 오는 마지막 메시지 인터페이스
interface LatestMessage {
  roomId: string;
  text: string;
  time: string;
  createdAt: string;
  senderId: string;
}

// 소켓으로 받는 메시지 인터페이스
interface SocketMessage {
  roomId: string;
  text: string;
  time: string;
  senderId: string;
}

// 사용자 정보 인터페이스
interface User {
  _id: string;
  name: string;
}

function Chat(props: { room: ChatRoom }) {
  const { room } = props;
  return (
    <>
      <div className="bg-white w-[100%] p-4 rounded-[10px] mb-4">
        <div className="flex justify-between mb-2">
          <span className="font-bold">
            {room.name} <span className="text-main-color">님</span>
          </span>
          <div className="flex items-center">
            {/* 안 읽은 메시지 수가 있을 때만 표시 */}
            {room.unreadCount && room.unreadCount > 0 ? (
              <span className="bg-main-color text-white rounded-full w-[22px] h-[22px] flex items-center justify-center text-[12px] mr-2">
                {room.unreadCount}
              </span>
            ) : null}
            <span className="text-[14px] text-main-darkGray">
              {room.lastMessageTime}
            </span>
          </div>
        </div>
        <p className="text-[14px] text-main-darkGray">
          {room.lastMessage || "대화가 없습니다."}
        </p>
      </div>
    </>
  );
}

function ChatPage() {
  const location = useLocation();

  // 리덕스에서 로그인한 사용자 정보 가져오기
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id;

  // URL에서 userId 파라미터 가져오기 (사용자 테스트용)
  const urlUserId = new URLSearchParams(location.search).get("userId");

  // 실제 사용할 유저 ID (로그인된 사용자 우선, URL 파라미터는 백업)
  const userId = currentUserId || urlUserId || "";

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Record<string, User>>({});
  const [socket, setSocket] = useState<any>(null);

  // 사용자 정보 가져오기
  const fetchUserInfo = async (userId: string) => {
    try {
      const response = await axios.get(`/api/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
      return { _id: userId, name: "사용자" };
    }
  };

  // 안 읽은 메시지 수 가져오기
  const fetchUnreadMessageCount = async (roomId: string, userId: string) => {
    try {
      const response = await axios.get(
        `/api/messages/unread/${roomId}/${userId}`
      );
      return response.data.unreadCount;
    } catch (error) {
      console.error("안 읽은 메시지 수 조회 실패:", error);
      return 0;
    }
  };

  // ChatPage.tsx의 useEffect 부분 수정 (채팅방 목록 필터링 강화)

  useEffect(() => {
    // 사용자가 로그인되어 있지 않으면 처리하지 않음
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchChatRooms = async () => {
      try {
        setLoading(true);

        // 1. 사용자의 채팅방 목록 가져오기
        const response = await axios.get(`/api/chat-rooms/${userId}`);
        const roomIds = response.data;
        console.log("서버에서 받은 채팅방 목록:", roomIds);

        // 2. 각 채팅방의 마지막 메시지 가져오기
        const latestMessagesResponse = await axios.get<LatestMessage[]>(
          "/api/messages/latest"
        );
        const latestMessages = latestMessagesResponse.data;

        // 3. 사용자 정보 가져오기
        const userIds = new Set<string>();
        roomIds.forEach((roomId: string) => {
          const otherId = getOtherUserId(roomId, userId);
          if (otherId) userIds.add(otherId);
        });

        const userPromises = Array.from(userIds).map(fetchUserInfo);
        const userInfos = await Promise.all(userPromises);

        const usersMap: Record<string, User> = {};
        userInfos.forEach((user) => {
          usersMap[user._id] = user;
        });

        setUsers(usersMap);

        // 4. localStorage에서 내가 나간 채팅방 정보 가져오기
        const leftRooms = JSON.parse(
          localStorage.getItem("leftChatRooms") || "{}"
        );
        console.log("로컬에 저장된 나간 채팅방 정보:", leftRooms);

        // 5. 채팅방 목록 구성 (내가 나간 채팅방 필터링)
        const roomsPromises = roomIds
          .filter((roomId: string) => {
            // 해당 채팅방에 내가 나간 정보가 있는지 확인
            const roomInfo = leftRooms[roomId];
            if (!roomInfo) return true; // 나간 정보 없으면 표시

            // 내가 나간 채팅방이면 표시하지 않음
            const iLeftRoom =
              roomInfo.leftBy === userId || roomInfo.leftBy2 === userId;
            console.log(`채팅방 ${roomId} 필터링 결과:`, { iLeftRoom });
            return !iLeftRoom;
          })
          .map(async (roomId: string) => {
            const otherId = getOtherUserId(roomId, userId);
            const otherUser = usersMap[otherId] || { name: "알 수 없음" };

            // 해당 채팅방의 최신 메시지 찾기
            const latestMessage = latestMessages.find(
              (msg) => msg.roomId === roomId
            );

            // 안 읽은 메시지 수 가져오기
            let unreadCount = 0;
            if (latestMessage && latestMessage.senderId !== userId) {
              unreadCount = await fetchUnreadMessageCount(roomId, userId);
            }

            return {
              id: roomId,
              name: otherUser.name,
              lastMessage: latestMessage?.text || "",
              lastMessageTime: latestMessage?.time || "",
              unreadCount: unreadCount,
              lastSenderId: latestMessage?.senderId || "",
            };
          });

        const rooms = await Promise.all(roomsPromises);
        setChatRooms(rooms);
        console.log("필터링 후 표시될 채팅방 목록:", rooms);
      } catch (error) {
        console.error("채팅방 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();

    // 소켓 연결 생성
    const newSocket = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
    });

    newSocket.on("connect", () => {
      console.log("소켓 연결 성공:", newSocket.id);
      // 사용자 ID 전송
      newSocket.emit("join_user", { userId });
    });

    newSocket.on("connect_error", (error) => {
      console.error("소켓 연결 오류:", error);
    });

    setSocket(newSocket);

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
    };
  }, [userId]);

  // 소켓 이벤트로 새 메시지 수신 시 마지막 메시지 업데이트를 위한 효과
  useEffect(() => {
    if (!userId || !socket) return;

    socket.on("chat message", (msg: SocketMessage) => {
      console.log("새로운 메시지 수신:", msg);

      // 새 메시지 수신 시 채팅방 목록 업데이트
      setChatRooms((prevRooms) => {
        // 이미 존재하는 채팅방인지 확인
        const existingRoomIndex = prevRooms.findIndex(
          (room) => room.id === msg.roomId
        );

        // 채팅방이 존재하면 업데이트
        if (existingRoomIndex !== -1) {
          const updatedRooms = [...prevRooms];
          const room = updatedRooms[existingRoomIndex];

          // 새 메시지가 상대방에게서 온 경우 안 읽은 메시지 수 증가
          const newUnreadCount =
            msg.senderId !== userId
              ? (room.unreadCount || 0) + 1
              : room.unreadCount;

          updatedRooms[existingRoomIndex] = {
            ...room,
            lastMessage: msg.text,
            lastMessageTime: msg.time,
            lastSenderId: msg.senderId,
            unreadCount: newUnreadCount,
          };

          return updatedRooms;
        }
        // 새로운 채팅방인 경우 (첫 메시지 수신)
        else {
          // 상대방 ID 확인
          const otherId = getOtherUserId(msg.roomId, userId);

          // 소켓 연결 효과에서 타입 오류 수정 부분

          // 상대방 정보 확인 (없으면 비동기로 가져오기)
          const fetchAndAddRoom = async () => {
            let otherUser: User = { _id: otherId, name: "알 수 없음" }; // 기본값을 명시적 타입과 함께 설정

            if (users[otherId]) {
              otherUser = users[otherId];
            } else {
              try {
                const fetchedUser = await fetchUserInfo(otherId);
                // User 타입에 맞게 변환
                otherUser = {
                  _id: fetchedUser._id || otherId,
                  name: fetchedUser.name || "알 수 없음",
                };
                setUsers((prev) => ({ ...prev, [otherId]: otherUser }));
              } catch (error) {
                console.error("상대방 정보 로드 실패:", error);
                // 오류 발생 시 기본값 유지
              }
            }

            // 새 채팅방 추가
            setChatRooms((prev) => [
              ...prev,
              {
                id: msg.roomId,
                name: otherUser.name,
                lastMessage: msg.text,
                lastMessageTime: msg.time,
                lastSenderId: msg.senderId,
                unreadCount: msg.senderId !== userId ? 1 : 0,
              },
            ]);
          };

          fetchAndAddRoom();
          return prevRooms; // 비동기 업데이트를 위해 현재 상태 반환
        }
      });
    });

    return () => {
      socket.off("chat message");
    };
  }, [userId, users, socket]);

  if (!userId) {
    return (
      <>
        <Header>
          <p className="flex h-full justify-center items-center font-bold">
            채팅
          </p>
        </Header>
        <Main hasBottomNav={true}>
          <div className="p-5 text-center">
            <p>로그인이 필요합니다.</p>
          </div>
        </Main>
        <BottomNav></BottomNav>
      </>
    );
  }

  return (
    <>
      <Header>
        <div className="flex h-full w-full justify-between items-center px-5 relative">
          <div className="w-8"></div> {/* 왼쪽 여백용 빈 div */}
          {/* left-1/2: 요소의 왼쪽 모서리를 부모 컨테이너 너비의 50% 위치에 배치합니다. 이는 CSS로 left: 50%와 같습니다.
transform -translate-x-1/2: 요소를 자신의 너비의 50%만큼 왼쪽으로 이동시킵니다. 이는 CSS로 transform: translateX(-50%)와 같습니다. */}
          <p className="font-bold absolute left-1/2 transform -translate-x-1/2">
            채팅
          </p>
          <div
            onClick={() => window.location.reload()}
            className="cursor-pointer"
          >
            <RefreshIcon />
          </div>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <div className="p-5">
          {loading ? (
            <ChatLoading />
          ) : chatRooms.length > 0 ? (
            chatRooms.map((room) => (
              <Link
                key={room.id}
                to={`/chat/chatting?roomId=${room.id}&userId=${userId}`}
                state={{ roomId: room.id, otherName: room.name }}
              >
                <Chat room={room} />
              </Link>
            ))
          ) : (
            <p className="text-center">채팅방이 없습니다.</p>
          )}
        </div>
      </Main>
      <BottomNav></BottomNav>
    </>
  );
}

export default ChatPage;
