import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import EditIcon from "@/components/icons/Edit";
import ResumeIcon from "@/components/icons/Resume";
import ResumeEditIcon from "@/components/icons/ResumeEdit";
import StarIcon from "@/components/icons/Star";
import WalletIcon from "@/components/icons/Wallet";
import Main from "@/components/Main";
import getUser, { type User } from "@/hooks/fetchUser";
import { useAppSelector } from "@/hooks/useRedux";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

const MyPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setUserData(await getUser(userId));
      };
      fetchData();
    }
  }, [userId]);

  return (
    <>
      <Header>
        <div className="size-full flex justify-center items-center">
          <span>마이페이지</span>
        </div>
      </Header>
      {userData !== null && (
        <Main hasBottomNav={true}>
          <div className="size-full flex flex-col gap-[20px] pt-[20px]">
            <div className="w-full flex gap-[10px] px-[20px]">
              <img src="https://placehold.co/80" alt="" />
              <div className="flex flex-col">
                <span className="text-[18px]">
                  안녕하세요!&nbsp;
                  <b className="text-main-color">{userData?.name}</b>님
                </span>
                <span className="text-main-gray">{userData?.email}</span>
                <span className="text-main-gray">
                  {userData?.address?.street}
                </span>
              </div>
            </div>

            <div className="px-[20px]">
              <Link
                to="/mypage/edit/info"
                className="w-full h-[50px] rounded-[10px] flex gap-[10px] justify-center items-center border-main-gray border bg-white"
              >
                <EditIcon color="#717171" width={18} height={18} />
                <span className="text-main-darkGray">내 정보 수정</span>
              </Link>
            </div>

            <div className="size-full flex flex-col gap-[20px] rounded-t-[30px] bg-white p-[20px]">
              <div className="w-full rounded-[10px] bg-selected-box p-[20px] flex flex-col gap-[10px]">
                <p className="text-[18px] font-bold text-main-color mb-[10px]">
                  나의 이력서
                </p>
                <Link
                  to="/mypage/resume/add"
                  className="flex gap-[10px] items-center"
                >
                  <ResumeEditIcon />
                  <span className="text-selected-text">이력서 등록</span>
                </Link>
                <Link
                  to="/mypage/resume/list"
                  className="flex gap-[10px] items-center"
                >
                  <ResumeIcon />
                  <span className="text-selected-text">이력서 관리</span>
                </Link>
              </div>

              <div className="w-full p-[20px] flex flex-col gap-[10px]">
                <Link
                  to="/mypage/edit/bank-account"
                  className="flex justify-between items-center"
                >
                  <div className="flex gap-[10px] items-center">
                    <WalletIcon color="#717171" />
                    <span className="text-main-darkGray">
                      {userData?.bankAccount?.bank}&nbsp;
                      {userData?.bankAccount?.account}
                    </span>
                  </div>
                  <ArrowRightIcon color="#717171" />
                </Link>
                <Link
                  to="/mypage/scrab"
                  className="flex justify-between items-center"
                >
                  <div className="flex gap-[10px] items-center">
                    <StarIcon color="#717171" />
                    <span className="text-main-darkGray">
                      내가 스크랩한 공고
                    </span>
                  </div>
                  <ArrowRightIcon color="#717171" />
                </Link>
              </div>

              <div className="w-full flex justify-center gap-[10px]">
                <Link
                  to="#"
                  className="border border-main-gray px-2 rounded-[10px] text-main-darkGray"
                >
                  로그아웃
                </Link>
                <Link
                  to="#"
                  className="border border-main-gray px-2 rounded-[10px] text-main-gray"
                >
                  탈퇴하기
                </Link>
              </div>
            </div>
          </div>
        </Main>
      )}
      <BottomNav />
    </>
  );
};

export default MyPage;
