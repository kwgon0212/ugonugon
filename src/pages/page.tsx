import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Main from "../components/Main";
import HelpCircleIcon from "../components/icons/HelpCircle";
import SearchIcon from "../components/icons/Search";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import CustomNoticeSlider from "./CustomNoticeSlider";
import dummy from "./DummyNotices";
import EmergencyNoticeSlider from "./EmergencyNoticeSlider";
import NewNoticeSlider from "./NewNoticeSlider";

const RootPage = () => {
  const searchKeywords = [
    "PC방",
    "쿠팡",
    "편의점",
    "카페",
    "음식점",
    "서빙",
    "주말",
    "단기알바",
    "대학생",
    "재택근무",
  ];

  const [currentKeyword, setCurrentKeyword] = useState(searchKeywords[0]);
  const [isVisible, setIsVisible] = useState(true);

  const userName = useAppSelector((state) => state.auth.user?.name);

  useEffect(() => {
    const interval = setInterval(() => {
      // 페이드 아웃 (투명해짐)
      setIsVisible(false);

      // 1초 후에 키워드를 변경하고 다시 페이드 인
      setTimeout(() => {
        const randomIndex = Math.floor(Math.random() * searchKeywords.length);
        setCurrentKeyword(searchKeywords[randomIndex]);
        setIsVisible(true);
      }, 1000);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const [customNotices, setCustomNotices] = useState(dummy);
  const [emergencyNotices, setEmergencyNotices] = useState(dummy);
  const [newNotices, setNewNotices] = useState(dummy);
  useEffect(() => {}, []);

  return (
    <>
      <Header>
        <div className="size-full px-[20px] flex items-center">
          <img src="https://placehold.co/200x50" alt="logo" />
        </div>
      </Header>
      <Main hasBottomNav={true}>
        {/* 인사 문구 */}
        <div className="bg-white size-full">
          <div className="px-[20px] py-[20px]">
            <h1 className="text-[16px] font-regular">
              안녕하세요! {userName}님
            </h1>
            <p className="text-[24px] font-bold tracking-tight ">
              오늘은 <span className="text-main-color">이런 알바</span> 어때요?
            </p>
          </div>
          {/* 검색창 */}
          <Link to="/notice/search" className="block pr-4 pl-4 pb-6">
            <div className="flex items-center border border-main-gray rounded-[10px] px-4 py-3 bg-white focus-within:border-main-darkGray">
              <SearchIcon color="#717171" />
              <div className="relative flex-1">
                <div className="ml-2 w-full outline-none bg-transparent h-6">
                  <div
                    className={`absolute left-2 top-0 transition-opacity duration-1000 ${
                      isVisible ? "opacity-100" : "opacity-0"
                    }`}
                  >
                    <span className="font-bold text-main-color">
                      {currentKeyword}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Link>
          <div className="bg-main-bg rounded-[30px] pb-[20px]">
            {/* 맞춤형 추천 공고 */}
            <div className="p-[20px] flex flex-col gap-[10px]">
              <div className="flex gap-2 items-center text-main-darkGray">
                <span className="text-[16px] font-medium ">
                  맞춤형 추천공고
                </span>
                <HelpCircleIcon color="#717171" width={14} height={14} />
              </div>
              {/* <div className="flex space-x-4 overflow-x-auto pb-2">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="min-w-[160px] bg-white shadow-md rounded-[10px] p-3"
                  >
                    <div className="w-30 h-24 bg-main-gray rounded-[10px]"></div>
                    <p className="text-[12px] text-main-darkGray font-regular mt-2">
                      한국경제신문
                    </p>
                    <p className="text-[12px] font-bold mt-1">
                      [업무강도 상] 풀스택 프로젝트 보조 구인
                    </p>
                    <p className="text-[10px] text-main-darkGray mt-2">
                      서울 용산구
                    </p>
                    <p className="text-[10px] text-main-darkGray mt-1">
                      <span className="text-main-color font-bold">시급</span>{" "}
                      10,030원
                    </p>
                  </div>
                ))}
              </div> */}
              <CustomNoticeSlider notices={customNotices} />
            </div>
            {/* 긴급 공고 */}
            <div className="flex flex-col gap-[10px] pb-[10px]">
              <div className="flex justify-between items-center px-[20px]">
                <span className="text-[16px] font-medium text-red-500">
                  긴급 공고 🚨
                </span>
                <span className="text-[12px] text-main-darkGray cursor-pointer">
                  전체보기
                </span>
              </div>
              {/* <div className="flex space-x-4 overflow-x-auto pb-2">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="min-w-[160px] bg-white shadow-md rounded-[10px] p-3"
                  >
                    <div className="w-30 h-24 bg-main-gray rounded-[10px]"></div>
                    <p className="text-[12px] text-main-darkGray font-regular mt-2">
                      한국경제신문
                    </p>
                    <p className="text-[12px] font-bold mt-1">
                      [업무강도 상] 풀스택 프로젝트 보조 구인
                    </p>
                    <p className="text-[10px] text-main-darkGray mt-2">
                      서울 용산구
                    </p>
                    <p className="text-[10px] text-main-darkGray mt-1">
                      <span className="text-main-color font-bold">시급</span>{" "}
                      10,030원
                    </p>
                  </div>
                ))}
              </div> */}
              <EmergencyNoticeSlider notices={emergencyNotices} />
            </div>
            {/* 방금 올라온 공고 */}
            <div className="py-[20px] flex flex-col gap-[10px]">
              <div className="flex gap-2 justify-between items-center px-[20px] text-main-darkGray">
                <span className="text-[16px] font-medium">
                  방금 올라온 공고
                </span>
                <span className="text-[12px] text-main-darkGray cursor-pointer">
                  전체보기
                </span>
              </div>
              {/* <div className="flex space-x-4 overflow-x-auto pb-2">
                {[...Array(10)].map((_, index) => (
                  <div
                    key={index}
                    className="min-w-[160px] bg-white shadow-md rounded-[10px] p-3"
                  >
                    <div className="w-30 h-24 bg-main-gray rounded-[10px]"></div>
                    <p className="text-[12px] text-main-darkGray font-regular mt-2">
                      한국경제신문
                    </p>
                    <p className="text-[12px] font-bold mt-1">
                      [업무강도 상] 풀스택 프로젝트 보조 구인
                    </p>
                    <p className="text-[10px] text-main-darkGray mt-2">
                      서울 용산구
                    </p>
                    <p className="text-[10px] text-main-darkGray mt-1">
                      <span className="text-main-color font-bold">시급</span>{" "}
                      10,030원
                    </p>
                  </div>
                ))}
              </div> */}
              <NewNoticeSlider notices={newNotices} />
            </div>
            {/* 하단 정보 */}
            <div className=" text-center text-[12px] text-main-darkGray">
              <p>
                이용약관{" "}
                <span className="font-bold">
                  개인정보 처리방침 위치기반서비스
                </span>
              </p>
              <p className="mt-2 text-[10px] ">
                문의 이메일 godnjs5870@naver.com
              </p>
              <p className="mt-1 text-[10px] ">
                @2025. PayRunner. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </Main>
      <BottomNav />
    </>
  );
};

export default RootPage;
