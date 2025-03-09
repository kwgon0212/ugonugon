import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import { io } from "socket.io-client";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";

// 채팅방 정보 인터페이스 정의
interface ChatRoom {
  id: string;
  name: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount?: number; // 안 읽은 메시지 수 추가
  lastSenderId?: string; // 마지막 메시지 보낸 사람 ID 추가
}

// 서버에서 오는 마지막 메시지 인터페이스
interface LatestMessage {
  roomId: string;
  text: string;
  time: string;
  createdAt: string;
  senderId: string; // 발신자 ID 추가
}

// 소켓으로 받는 메시지 인터페이스
interface SocketMessage {
  roomId: string;
  text: string;
  time: string;
  senderId: string;
}

// 사용자 정보 인터페이스
interface Useree {
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

  // URL에서 userId 파라미터 가져오기
  const currentUserId =
    new URLSearchParams(location.search).get("userId") ||
    "67c7d6bf38fe53ff868e3880"; // 기본값은 홍길동의 ID

  const [chatRooms, setChatRooms] = useState<ChatRoom[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<Record<string, Useree>>({});

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

  // 사용자 정보 가져오기
  const fetchUserInfo = async (userId: string) => {
    try {
      // 실제로는 사용자 정보를 가져오는 API 호출
      // 예시: const response = await axios.get(`/api/users/${userId}`);
      // 임시로 하드코딩된 사용자 정보 사용
      const mockUsers: Record<string, Useree> = {
        "67c7d6bf38fe53ff868e3880": {
          _id: "67c7d6bf38fe53ff868e3880",
          name: "홍길동",
        },
        "67c901f21e006624c5145f13": {
          _id: "67c901f21e006624c5145f13",
          name: "1",
        },
        "67c901f21e006624c5145f14": {
          _id: "67c901f21e006624c5145f14",
          name: "2",
        },
        "67c901f21e006624c5145f15": {
          _id: "67c901f21e006624c5145f15",
          name: "3",
        },
      };

      return mockUsers[userId] || { _id: userId, name: "사용자" };
    } catch (error) {
      console.error("사용자 정보 로드 실패:", error);
      return { _id: userId, name: "사용자" };
    }
  };

  // 채팅방 생성 함수
  const createChatRoom = (user1Id: string, user2Id: string): string => {
    // 항상 작은 ID가 앞에 오도록 정렬하여 일관된 채팅방 ID 생성
    const [smallerId, largerId] = [user1Id, user2Id].sort();
    return `chat_${smallerId}_${largerId}`;
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

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setLoading(true);

        // 1. 사용자의 채팅방 목록 가져오기
        // 실제 API 호출: const response = await axios.get(`/api/chat-rooms/${currentUserId}`);
        // 임시 데이터:
        let mockRoomIds: string[] = [];

        if (currentUserId === "67c7d6bf38fe53ff868e3880") {
          // 홍길동
          // 홍길동의 경우 사용자 1, 2, 3과의 채팅방
          mockRoomIds = [
            createChatRoom(
              "67c7d6bf38fe53ff868e3880",
              "67c901f21e006624c5145f13"
            ), // 사용자 1과의 채팅방
            createChatRoom(
              "67c7d6bf38fe53ff868e3880",
              "67c901f21e006624c5145f14"
            ), // 사용자 2와의 채팅방
            createChatRoom(
              "67c7d6bf38fe53ff868e3880",
              "67c901f21e006624c5145f15"
            ), // 사용자 3과의 채팅방
          ];
        } else if (currentUserId === "67c901f21e006624c5145f13") {
          // 사용자 1
          // 사용자 1의 경우 홍길동과의 채팅방만
          mockRoomIds = [
            createChatRoom(
              "67c7d6bf38fe53ff868e3880",
              "67c901f21e006624c5145f13"
            ),
          ];
        } else if (currentUserId === "67c901f21e006624c5145f14") {
          // 사용자 2
          // 사용자 2의 경우 홍길동과의 채팅방만
          mockRoomIds = [
            createChatRoom(
              "67c7d6bf38fe53ff868e3880",
              "67c901f21e006624c5145f14"
            ),
          ];
        } else if (currentUserId === "67c901f21e006624c5145f15") {
          // 사용자 3
          // 사용자 3의 경우 홍길동과의 채팅방만
          mockRoomIds = [
            createChatRoom(
              "67c7d6bf38fe53ff868e3880",
              "67c901f21e006624c5145f15"
            ),
          ];
        }

        // 2. 각 채팅방의 마지막 메시지 가져오기
        const apiUrl = "http://localhost:8080/api/messages/latest";
        const latestMessagesResponse = await axios.get<LatestMessage[]>(apiUrl);
        const latestMessages = latestMessagesResponse.data;

        // 3. 채팅방과 관련된 모든 사용자 정보 가져오기
        const userIds = new Set<string>();
        mockRoomIds.forEach((roomId) => {
          const otherId = getOtherUserId(roomId, currentUserId);
          if (otherId) userIds.add(otherId);
        });

        const userPromises = Array.from(userIds).map(fetchUserInfo);
        const userInfos = await Promise.all(userPromises);

        const usersMap: Record<string, Useree> = {};
        userInfos.forEach((user) => {
          usersMap[user._id] = user;
        });

        setUsers(usersMap);

        // 4. localStorage에서 내가 나간 채팅방 정보 가져오기
        const leftRooms = JSON.parse(
          localStorage.getItem("leftChatRooms") || "{}"
        );

        // 5. 채팅방 목록 구성 (내가 나간 채팅방 필터링)
        const roomsPromises = mockRoomIds
          .filter((roomId) => {
            // 해당 채팅방에 내가 나간 정보가 있는지 확인
            const roomInfo = leftRooms[roomId];
            if (!roomInfo) return true; // 나간 정보 없으면 표시

            // 내가 나갔거나, 상대방도 나가고 내가 나갔으면 표시 안 함
            return !(
              roomInfo.leftBy === currentUserId ||
              roomInfo.leftBy2 === currentUserId
            );
          })
          .map(async (roomId) => {
            const otherId = getOtherUserId(roomId, currentUserId);
            const otherUser = usersMap[otherId] || { name: "알 수 없음" };

            // 해당 채팅방의 최신 메시지 찾기
            const latestMessage = latestMessages.find(
              (msg) => msg.roomId === roomId
            );

            // 안 읽은 메시지 수 가져오기
            let unreadCount = 0;
            if (latestMessage && latestMessage.senderId !== currentUserId) {
              unreadCount = await fetchUnreadMessageCount(
                roomId,
                currentUserId
              );
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
      } catch (error) {
        console.error("채팅방 로드 실패:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchChatRooms();
  }, [currentUserId]);

  // 소켓 이벤트로 새 메시지 수신 시 마지막 메시지 업데이트를 위한 효과
  useEffect(() => {
    const socket = io("http://localhost:8080", {
      transports: ["websocket"],
      withCredentials: true,
    });

    socket.on("connect", () => {
      console.log("소켓 연결 성공:", socket.id);
    });

    socket.on("connect_error", (error) => {
      console.error("소켓 연결 오류:", error);
    });

    socket.on("chat message", (msg: SocketMessage) => {
      console.log("새로운 메시지 수신:", msg);

      // 메시지가 오면 해당 채팅방의 마지막 메시지 업데이트
      setChatRooms((prevRooms) => {
        const updatedRooms = prevRooms.map((room) => {
          if (room.id === msg.roomId) {
            // 새 메시지가 상대방에게서 온 경우 안 읽은 메시지 수 증가
            const newUnreadCount =
              msg.senderId !== currentUserId
                ? (room.unreadCount || 0) + 1
                : room.unreadCount;

            return {
              ...room,
              lastMessage: msg.text,
              lastMessageTime: msg.time,
              lastSenderId: msg.senderId,
              unreadCount: newUnreadCount,
            };
          }
          return room;
        });
        return updatedRooms;
      });
    });

    return () => {
      console.log("소켓 연결 종료");
      socket.disconnect();
    };
  }, [currentUserId]);

  return (
    <>
      <Header>
        <p className="flex h-full justify-center items-center font-bold">
          채팅
        </p>
      </Header>
      <Main hasBottomNav={true}>
        <div className="p-5">
          {loading ? (
            <p>채팅방 로딩 중...</p>
          ) : chatRooms.length > 0 ? (
            chatRooms.map((room) => (
              <Link
                key={room.id}
                to={`/chat/chatting?roomId=${room.id}&userId=${currentUserId}`}
                state={{ roomId: room.id, otherName: room.name }}
              >
                <Chat room={room} />
              </Link>
            ))
          ) : null}
        </div>
      </Main>
      <BottomNav></BottomNav>
    </>
  );
}

export default ChatPage;
