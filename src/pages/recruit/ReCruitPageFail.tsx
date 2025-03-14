import getUser, { type User } from "@/hooks/fetchUser";
import { useAppSelector } from "@/hooks/useRedux";
import { useEffect, useState } from "react";
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
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User>();
  useEffect(() => {
    const fetchUser = async () => {
      const res = await getUser(userId);
      setUserData(res);
    };
    fetchUser();
  }, [userId]);

  return (
    <>
      <CenterDiv className="text-main-darkGray">
        <div className="text-xl">
          <span>현재&nbsp;</span>
          <span className="text-main-color font-bold">{userData?.name}</span>
          <span>님의</span>
        </div>
        <div className="text-xl mb-5">고용 내역이 존재하지 않아요</div>
        <div className="flex flex-row justify-center w-full">
          <Link to="/notice/add">
            <span className="text-main-color font-bold">공고 등록하러가기</span>
          </Link>
        </div>
      </CenterDiv>
    </>
  );
}
export default ReCruitPageFail;
