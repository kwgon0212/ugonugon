// src/utils/chatUtils.js
import axios from "axios";
/**
 * 채팅방 ID를 일관되게 생성하는 함수
 * 항상 작은 ID가 앞에 오도록 정렬하여 동일한 두 사용자 간의 채팅방 ID가 항상 동일하게 생성됨
 * @param {string} user1Id 첫 번째 사용자 ID
 * @param {string} user2Id 두 번째 사용자 ID
 * @returns {string} 생성된 채팅방 ID
 */
export const createChatRoomId = (user1Id, user2Id) => {
  // 항상 작은 ID가 앞에 오도록 정렬하여 일관된 채팅방 ID 생성
  const [smallerId, largerId] = [user1Id, user2Id].sort();
  return `chat_${smallerId}_${largerId}`;
};

/**
 * 채팅방 ID에서 상대방 ID 추출 함수
 * @param {string} roomId 채팅방 ID
 * @param {string} myId 현재 사용자 ID
 * @returns {string} 상대방 ID
 */
export const getOtherUserId = (roomId, myId) => {
  // 채팅방 ID 형식: chat_user1Id_user2Id
  const parts = roomId.split("_");
  if (parts.length === 3) {
    const id1 = parts[1];
    const id2 = parts[2];
    return id1 === myId ? id2 : id1;
  }
  return "";
};

/**
 * 메시지 시간 포맷팅 함수
 * @returns {string} HH:MM 형식의 현재 시간
 */
export const formatMessageTime = () => {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
};

/**
 * 채팅방 생성 API 호출 함수
 * @param {string} user1Id 첫 번째 사용자 ID
 * @param {string} user2Id 두 번째 사용자 ID
 * @returns {Promise} API 응답
 */
export const createChatRoom = async (user1Id, user2Id) => {
  try {
    const response = await axios.post("/api/chat-rooms", {
      user1Id,
      user2Id,
    });
    return response.data;
  } catch (error) {
    console.error("채팅방 생성 실패:", error);
    throw error;
  }
};
