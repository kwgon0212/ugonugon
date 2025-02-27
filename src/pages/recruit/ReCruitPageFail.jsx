import { Link } from "react-router-dom";
import styled from "styled-components";
const CenterDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;
function ReCruitPageFail() {
  return (
    <>
      <CenterDiv className="text-main-darkGray">
        <div className="text-xl">
          <span>현재</span>
          <span className="text-main-color font-bold">박해원</span>
          <span>님의</span>
        </div>
        <div className="text-xl mb-5">고용 내역이 존재하지 않아요</div>
        <div className="flex flex-row justify-center w-full">
          <Link to="/">
            <span className="text-main-color">내가 작성한 공고 페이지</span>
          </Link>
          <span>로 이동</span>
        </div>
      </CenterDiv>
    </>
  );
}
export default ReCruitPageFail;
