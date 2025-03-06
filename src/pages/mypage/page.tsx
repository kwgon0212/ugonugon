import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import EditIcon from "@/components/icons/Edit";
import ResumeIcon from "@/components/icons/Resume";
import ResumeEditIcon from "@/components/icons/ResumeEdit";
import StarIcon from "@/components/icons/Star";
import WalletIcon from "@/components/icons/Wallet";
import Main from "@/components/Main";
import { useAppSelector } from "@/hooks/useRedux";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import mongoose from "mongoose";

interface User {
  businessNumber?: string[];
  address?: { zipcode: string; street: string; detail: string };
  bankAccount?: { bank: string; account: string };
  name?: string;
  sex?: string;
  residentId?: string;
  phone?: string;
  signature?: string;
  email?: string;
}

const MyPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  // useEffect(() => {
  //   if (userId) {
  //     fetch(`/api/users?userId=${userId}`)
  //       .then((res) => res.json())
  //       .then((data) => setUserData(data));
  //   }
  // }, [userId]);

  // const res = fetch("api/users", {
  //   method: "POST",
  //   body: JSON.stringify({
  //     userId,
  //   }),
  // });

  const postData = async () => {
    try {
      setLoading(true); // 로딩 시작

      const res = await fetch("/api/users", {
        method: "POST",
        body: JSON.stringify({ userId }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const jsonResponse = await res.json(); // 응답을 JSON으로 파싱
      setUserData(jsonResponse); // data 상태를 업데이트
    } catch (err: any) {
      console.log(err, err?.messages);
    } finally {
      setLoading(false); // 로딩 끝
    }
  };

  useEffect(() => {
    if (userId) {
      postData(); // userId가 있을 때만 호출
    }
  }, [userId]); // userId가 변경될 때마다 호출

  return (
    <>
      <Header>
        <div className="size-full flex justify-center items-center">
          <span>마이페이지</span>
        </div>
      </Header>
      {!loading && (
        <Main hasBottomNav={true}>
          <div className="size-full flex flex-col gap-[20px] pt-[20px]">
            <div className="w-full flex gap-[10px] px-[20px]">
              <img src="https://placehold.co/80" alt="" />
              <div className="flex flex-col">
                <span className="text-[18px]">
                  안녕하세요!{" "}
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
                to={"#"}
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
                <Link to={"#"} className="flex gap-[10px] items-center">
                  <ResumeEditIcon />
                  <span className="text-selected-text">이력서 등록</span>
                </Link>
                <Link to={"#"} className="flex gap-[10px] items-center">
                  <ResumeIcon />
                  <span className="text-selected-text">이력서 관리</span>
                </Link>
              </div>

              <div className="w-full p-[20px] flex flex-col gap-[10px]">
                <Link to={"#"} className="flex justify-between items-center">
                  <div className="flex gap-[10px] items-center">
                    <WalletIcon color="#717171" />
                    <span className="text-main-darkGray">
                      {userData?.bankAccount?.bank}{" "}
                      {userData?.bankAccount?.account}
                    </span>
                  </div>
                  <ArrowRightIcon color="#717171" />
                </Link>
                <Link to={"#"} className="flex justify-between items-center">
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
                  to={"#"}
                  className="border border-main-gray px-2 rounded-[10px] text-main-darkGray"
                >
                  로그아웃
                </Link>
                <Link
                  to={"#"}
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
