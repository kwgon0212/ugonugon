import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

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
  const location = useLocation();

  // URL에서 userId 파라미터 가져오기
  const searchParams = new URLSearchParams(location.search);
  const userId = searchParams.get("userId") || "";

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

  const handleExit = async () => {
    try {
      // 1. 로컬 스토리지에서 채팅방 나감 정보 가져오기
      const leftRooms = JSON.parse(
        localStorage.getItem("leftChatRooms") || "{}"
      );

      // 채팅방 정보 있는지 확인
      if (!leftRooms[roomId]) {
        // 처음 나가는 사람인 경우
        leftRooms[roomId] = {
          leftBy: userId,
          leftAt: new Date().toISOString(),
        };
      } else {
        // 이미 누군가 나간 경우, 두 번째 나가는 사람인지 확인
        if (leftRooms[roomId].leftBy && leftRooms[roomId].leftBy !== userId) {
          leftRooms[roomId].leftBy2 = userId;
          leftRooms[roomId].leftAt2 = new Date().toISOString();
        } else if (!leftRooms[roomId].leftBy) {
          leftRooms[roomId].leftBy = userId;
          leftRooms[roomId].leftAt = new Date().toISOString();
        }
      }

      // 스토리지에 저장
      localStorage.setItem("leftChatRooms", JSON.stringify(leftRooms));

      // 2. 메시지 삭제 API 호출
      await axios.delete("/api/messages/clear", {
        data: { roomId },
      });

      // 3. 채팅 목록 페이지로 이동 (userId 유지)
      navigate(`/chat?userId=${userId}`);
    } catch (error) {
      console.error("메시지 삭제 중 오류 발생:", error);
      // 에러 처리 (선택적)
      alert("채팅 기록 삭제 중 문제가 발생했습니다.");
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
