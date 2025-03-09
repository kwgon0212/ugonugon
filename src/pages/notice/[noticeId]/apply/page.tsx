import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import Main from "@/components/Main";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const NoticeApplyPage = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  console.log(noticeId);

  const handleClickUser = (resumeId: string) => {
    navigate(`/notice/${noticeId}/apply/${resumeId}`);
  };
  return (
    <>
      <Header>
        <div className="size-full flex items-center px-[20px] justify-between">
          <div className="flex gap-[10px] items-center">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
            <span className="font-bold">지원현황</span>
          </div>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full bg-main-bg relative">
          <div className="w-full h-full flex flex-col relative">
            <div className="flex flex-col gap-[4px] py-[10px] px-layout">
              {/* <div className="flex gap-[4px] text-[12px] text-main-darkGray justify-end">
                <span>작성일자 </span>
                <span>2025-02-17</span>
                <span>10:29:15</span>
              </div> */}
              <h1 className="font-bold text-[20px]">
                [업무강도 상] 풀스택 프로젝트 보조 구인 / 중식 제공
              </h1>
              <div className="text-[14px] flex w-full justify-between">
                <h3>한경 2기 풀스택반</h3>
                <span className="text-main-darkGray">~ 25/03/04(월)</span>
              </div>
              <div className="text-main-darkGray flex gap-[4px] text-[14px]">
                <span>설립 1년차</span>
                <span>25년 2월부터 이용중</span>
              </div>
            </div>

            <div className="flex h-full flex-col gap-[20px] bg-white rounded-[20px] p-[20px]">
              <div className="flex flex-col gap-[10px] pb-[20px]">
                <h3 className="font-bold text-[20px]">지원현황</h3>
                {Array(5)
                  .fill(0)
                  .map((_, idx) => {
                    return (
                      <button
                        key={idx + "지원자"}
                        className="w-full bg-white border border-main-gray flex gap-[10px] rounded-[10px] px-[15px] py-[10px]"
                        onClick={() => handleClickUser("이력서id")}
                      >
                        <img
                          src="https://placehold.co/80"
                          alt="user-img"
                          className="rounded-[10px]"
                        />
                        <div className="flex flex-col w-full gap-[2px] text-left text-[12px] text-main-darkGray">
                          <p className="flex justify-between items-center w-full">
                            <span className="font-bold text-[14px] text-black">
                              김김김 (남)
                            </span>
                            <ArrowRightIcon color="#717171" />
                          </p>
                          <span>2001.02.12</span>
                          <span>010-1234-1234</span>
                          <span>서울 서대문구 어쩌구 저쩌구</span>
                        </div>
                      </button>
                    );
                  })}
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
};

export default NoticeApplyPage;
