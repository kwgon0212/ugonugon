import { Link } from "react-router-dom";
import styled from "styled-components";

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
  handleClose: () => void; // handleClose 함수 타입 정의
  link: string;
}

export function AlertModal({ handleClose, link }: AlertModalProps) {
  return (
    <>
      <MainWrap>
        <AlertBox>
          <div className="flex font-bold text-[16px]">
            정말로 나가시겠습니까?
          </div>
          <div className="flex text-[14px]">
            나가시면 변경사항이 저장되지 않습니다.
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
            <Link to={link} className="flex w-[40%]">
              <ExitBtn className=" bg-main-color">나가기</ExitBtn>
            </Link>
          </div>
        </AlertBox>
      </MainWrap>
    </>
  );
}

export default AlertModal;
