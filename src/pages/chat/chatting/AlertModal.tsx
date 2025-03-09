import React from "react";
import { useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import { io } from "socket.io-client";
import { useAppSelector } from "@/hooks/useRedux";
import { formatMessageTime, getOtherUserId } from "@/util/chatUtils";

const MainWrap = styled.div`
  position: absolute;
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
  top: 0;
  background-color: #00000050;
  z-index: 10;
`;

const AlertBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  background-color: white;
  border-radius: 10px;
  width: 70%;
  height: 170px;
  padding: 2%;
`;
const CancleBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: white;
  flex: 1;
  border-radius: 10px;
`;
const ExitBtn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  color: white;
  flex: 1;
  border-radius: 10px;
`;

interface AlertModalProps {
  handleClose: () => void;
  roomId: string; // 채팅방 ID 추가
}

export function AlertModal({ handleClose, roomId }: AlertModalProps) {
  const navigate = useNavigate();

  // Redux에서 사용자 ID 가져오기
  const user = useAppSelector((state) => state.auth.user);
  const userId = user?._id || "";

  const handleExit = async () => {
    try {
      if (!userId) {
        alert("로그인이 필요한 서비스입니다.");
        return;
      }

      console.log(`채팅방 나가기 시작: ${roomId}, 사용자: ${userId}`);

      // 1. 로컬 스토리지에서 나간 채팅방 정보 가져오기
      const leftRooms = JSON.parse(
        localStorage.getItem("leftChatRooms") || "{}"
      );

      // 디버깅 로그
      console.log("채팅방 나가기 전 leftRooms:", leftRooms);

      // 채팅방 정보 있는지 확인
      if (!leftRooms[roomId]) {
        // 처음 나가는 사람인 경우
        leftRooms[roomId] = {
          leftBy: userId,
          leftAt: new Date().toISOString(),
        };
        console.log(`첫 번째 퇴장: ${userId}`);
      } else {
        // 이미 누군가 나간 경우, 두 번째 나가는 사람인지 확인
        const roomInfo = leftRooms[roomId];
        console.log("기존 채팅방 나가기 정보:", roomInfo);

        if (roomInfo.leftBy && roomInfo.leftBy !== userId) {
          leftRooms[roomId].leftBy2 = userId;
          leftRooms[roomId].leftAt2 = new Date().toISOString();
          console.log(`두 번째 퇴장: ${userId}`);
        } else if (!roomInfo.leftBy) {
          leftRooms[roomId].leftBy = userId;
          leftRooms[roomId].leftAt = new Date().toISOString();
          console.log(`첫 번째 퇴장(null 이후): ${userId}`);
        } else {
          // 이미 내가 나간 채팅방인 경우 정보 갱신
          console.log(`이미 퇴장한 사용자의 재퇴장: ${userId}`);
          leftRooms[roomId].leftAt = new Date().toISOString();
        }
      }

      // 스토리지에 저장
      localStorage.setItem("leftChatRooms", JSON.stringify(leftRooms));
      console.log("업데이트된 leftRooms:", leftRooms);

      // 소켓을 통해 채팅방 나가기 이벤트 전송
      const socket = io("http://localhost:8080", {
        transports: ["websocket"],
        withCredentials: true,
      });

      // 상대방에게 나간 알림 메시지 보내기
      try {
        // 상대방 ID 가져오기
        const otherId = getOtherUserId(roomId, userId);

        // 채팅방 나가기 시스템 메시지 전송 (상대방에게 알림)
        const systemMessage = {
          roomId: roomId,
          text: "상대방이 채팅방을 나갔습니다. 더 이상 메시지를 보낼 수 없습니다.",
          senderId: "system", // 시스템 메시지로 표시
          time: formatMessageTime(),
          isSystemMessage: true, // 시스템 메시지 플래그
        };

        // 시스템 메시지 전송
        socket.emit("chat message", systemMessage);
        console.log("상대방에게 채팅방 나가기 알림 메시지 전송");
      } catch (msgError) {
        console.error("알림 메시지 전송 실패:", msgError);
      }

      socket.emit("leave_room", { roomId });
      socket.disconnect();
      console.log("소켓 연결 종료 및 채팅방 퇴장 이벤트 전송 완료");

      // 메시지 삭제 API 호출은 하지 않음 - 대화 내용은 유지하되 더 이상 메시지 전송 불가능하게 함
      // 채팅 목록 페이지로 이동
      console.log("채팅 목록으로 이동");
      navigate(`/chat?userId=${userId}`);
    } catch (error) {
      console.error("채팅방 나가기 중 오류 발생:", error);
      alert("채팅방 나가기 처리 중 문제가 발생했습니다.");
    }
  };

  return (
    <>
      <MainWrap>
        <AlertBox>
          <div className="flex font-bold text-[16px]">
            정말로 나가시겠습니까?
          </div>
          <div className="flex text-[14px]">
            나가시면 이전의 대화내역이 모두 삭제됩니다.
          </div>
          <div className="flex w-full h-[40px] text-[14px] justify-around">
            <div className="flex w-[40%]">
              <CancleBtn
                type="button"
                onClick={handleClose}
                className=" text-main-color border border-main-color"
              >
                취소
              </CancleBtn>
            </div>
            <div className="flex w-[40%]">
              <ExitBtn className="bg-main-color" onClick={handleExit}>
                나가기
              </ExitBtn>
            </div>
          </div>
        </AlertBox>
      </MainWrap>
    </>
  );
}

export default AlertModal;
