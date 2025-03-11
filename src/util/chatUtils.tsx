// src/util/chatUtils.ts

import axios from "axios";

/**
 * 채팅방 ID에서 상대방 ID를 추출하는 함수
 * @param roomId 채팅방 ID (형식: chat_소형ID_대형ID)
 * @param currentUserId 현재 사용자 ID
 * @returns 상대방 ID
 */
export function getOtherUserId(roomId: string, currentUserId: string): string {
  if (!roomId || !roomId.startsWith("chat_") || !currentUserId) {
    console.warn("getOtherUserId: 유효하지 않은 인자", {
      roomId,
      currentUserId,
    });
    return "";
  }

  // roomId 형식: chat_userId1_userId2
  const parts = roomId.split("_");
  if (parts.length !== 3) {
    console.warn("getOtherUserId: 잘못된 roomId 형식", roomId);
    return "";
  }

  // 사용자 ID가 첫 번째 ID와 같으면 두 번째 ID 반환, 아니면 첫 번째 ID 반환
  const userId1 = parts[1];
  const userId2 = parts[2];

  console.log("getOtherUserId:", { roomId, currentUserId, userId1, userId2 });

  return userId1 === currentUserId ? userId2 : userId1;
}

/**
 * 채팅 메시지 시간을 포맷팅하는 함수
 * @returns 포맷팅된 시간 문자열 (예: "14:30")
 */
export function formatMessageTime(): string {
  const now = new Date();
  const hours = now.getHours().toString().padStart(2, "0");
  const minutes = now.getMinutes().toString().padStart(2, "0");
  return `${hours}:${minutes}`;
}

/**
 * 두 사용자 간의 채팅방을 생성하는 함수
 * @param userId1 첫 번째 사용자 ID
 * @param userId2 두 번째 사용자 ID
 * @returns 생성된 채팅방 ID
 */
export async function createChatRoom(
  userId1: string,
  userId2: string
): Promise<string> {
  try {
    console.log("채팅방 생성 시도:", { userId1, userId2 });

    // 채팅방 생성 API 호출
    const response = await axios.post("/api/chat-rooms", {
      user1Id: userId1,
      user2Id: userId2,
    });

    console.log("채팅방 생성 성공:", response.data);
    return response.data.roomId;
  } catch (error) {
    console.error("채팅방 생성 실패:", error);
    throw new Error("채팅방 생성에 실패했습니다");
  }
}
