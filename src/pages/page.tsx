import React, { useState, useEffect } from "react";
import Header from "../components/Header";
import BottomNav from "../components/BottomNav";
import Main from "../components/Main";
import HelpCircleIcon from "../components/icons/HelpCircle";
import SearchIcon from "../components/icons/Search";
import { Link } from "react-router-dom";
import { useAppSelector } from "@/hooks/useRedux";
import CustomNoticeSlider from "./CustomNoticeSlider";
import EmergencyNoticeSlider from "./EmergencyNoticeSlider";
import NewNoticeSlider from "./NewNoticeSlider";
import Notice from "@/types/Notice";
import axios from "axios";
import MapIcon from "@/components/icons/Map";
import { AnimatePresence, motion } from "framer-motion";

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
  const userId = useAppSelector((state) => state.auth.user?._id);

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

  const [customNotices, setCustomNotices] = useState<Notice[] | null>(null);
  const [emergencyNotices, setEmergencyNotices] = useState<Notice[] | null>(
    null
  );
  const [newNotices, setNewNotices] = useState<Notice[] | null>(null);

  const [showTooltip, setShowTooltip] = useState(false);

  const handleTooltipClick = () => {
    setShowTooltip(true);
    setTimeout(() => setShowTooltip(false), 2000);
  };

  useEffect(() => {
    const fetchCustomPosts = async () => {
      if (!userId) return;

      const userResponse = await axios.get(`/api/users?userId=${userId}`);
      const userAddress = userResponse.data.address.street.split(" ")[0];

      const response = await axios.get(`/api/post?street=${userAddress}`);
      const customPosts = response.data;
      setCustomNotices(customPosts);
    };
    const fetchEmergencyPosts = async () => {
      const response = await axios.get("/api/post?urgent=true");
      const emergencyPosts = response.data;
      setEmergencyNotices(emergencyPosts);
    };
    const fetchNewPosts = async () => {
      const response = await axios.get("/api/post?latest=true");
      const newPosts = response.data;
      setNewNotices(newPosts);
    };

    fetchCustomPosts();
    fetchEmergencyPosts();
    fetchNewPosts();
  }, [userId]);

  return (
    <>
      <Header>
        <div className="size-full px-[20px] flex items-center justify-between">
          <img
            src="/payrunner-logo.png"
            alt="logo"
            width={150}
            className="object-contain"
          />
          <Link to={"/map"}>
            <MapIcon width={24} height={24} />
          </Link>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <div className="bg-white size-full">
          <div className="px-[20px] py-[20px]">
            <h1 className="text-[16px] font-regular">
              안녕하세요! {userName}님
            </h1>
            <p className="text-[24px] font-bold tracking-tight ">
              오늘은 <span className="text-main-color">이런 알바</span> 어때요?
            </p>
          </div>
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
                <div className="relative flex items-center">
                  <button onClick={handleTooltipClick}>
                    <HelpCircleIcon color="#717171" width={14} height={14} />
                  </button>
                  <AnimatePresence>
                    {showTooltip && (
                      <motion.div
                        initial={{ opacity: 0, x: -5 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -5 }}
                        transition={{ duration: 0.3 }}
                        className="absolute left-[20px] -translate-x-1/2 whitespace-nowrap bg-gray-800 text-white text-[12px] px-3 py-1 rounded-md shadow-lg z-10"
                      >
                        회원님의 거주지 주변 공고입니다
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
              {customNotices && <CustomNoticeSlider notices={customNotices} />}
            </div>
            {/* 긴급 공고 */}
            <div className="flex flex-col gap-[10px] pb-[10px]">
              <div className="flex justify-between items-center px-[20px]">
                <span className="text-[16px] font-medium text-red-500">
                  긴급 공고 🚨
                </span>
              </div>
              {emergencyNotices && (
                <EmergencyNoticeSlider notices={emergencyNotices} />
              )}
            </div>
            {/* 방금 올라온 공고 */}
            <div className="py-[20px] flex flex-col gap-[10px]">
              <div className="flex gap-2 justify-between items-center px-[20px] text-main-darkGray">
                <span className="text-[16px] font-medium text-main-color">
                  방금 올라온 공고
                </span>
              </div>
              {newNotices && <NewNoticeSlider notices={newNotices} />}
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
