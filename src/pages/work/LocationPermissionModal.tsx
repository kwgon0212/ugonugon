import React from "react";
import styled from "styled-components";

interface LocationPermissionModalProps {
  onRequestPermission: () => void;
  onClose: () => void;
}

export const LocationPermissionModal: React.FC<
  LocationPermissionModalProps
> = ({ onRequestPermission, onClose }) => {
  return (
    <ModalOverlay>
      <ModalContainer>
        <h2 className="text-xl font-bold mb-4">위치 권한 필요</h2>
        <p className="mb-4">
          근무지와의 거리를 확인하고 출퇴근 기능을 사용하기 위해서는 위치 정보
          접근 권한이 필요합니다.
        </p>
        <p className="mb-6">
          '권한 허용' 버튼을 클릭하시면 브라우저의 위치 접근 권한 요청이
          표시됩니다.
        </p>
        <div className="flex justify-between w-full">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-md"
          >
            나중에 하기
          </button>
          <button
            onClick={onRequestPermission}
            className="px-4 py-2 bg-main-color text-white rounded-md"
          >
            권한 허용
          </button>
        </div>
      </ModalContainer>
    </ModalOverlay>
  );
};

const ModalOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContainer = styled.div`
  background-color: white;
  padding: 24px;
  border-radius: 12px;
  width: 85%;
  max-width: 400px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
`;

export default LocationPermissionModal;
