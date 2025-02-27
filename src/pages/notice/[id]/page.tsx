import Header from "@/components/Header";
import Main from "@/components/Main";

import React, { JSX } from "react";
import { useParams } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import { Link } from "react-router-dom";
import BottomNav from "@/components/BottomNav";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import StarIcon from "@/components/icons/Star";
import ShareIcon from "@/components/icons/Share";
import ArrowRightIcon from "@/components/icons/ArrowRight";

const NoticeDetailPage = () => {
  const { id: noticeId } = useParams();
  console.log(noticeId);

  const imageArr = [
    "https://placehold.co/500",
    "https://placehold.co/500x225",
    "https://placehold.co/560x200",
    "https://placehold.co/560x175",
    "https://placehold.co/560x150",
    "https://placehold.co/560x125",
    "https://placehold.co/560x100",
  ];

  return (
    <>
      <Header>
        <div className="size-full flex items-center px-[20px] justify-between">
          <div className="flex gap-[10px]">
            <ArrowLeftIcon />
            <span>채용정보</span>
          </div>
          <div className="flex gap-[10px]">
            <div className="flex flex-col items-center text-[10px] text-main-darkGray gap-[4px]">
              <StarIcon />
              <span>스크랩</span>
            </div>
            <div className="flex flex-col items-center text-[10px] text-main-darkGray gap-[4px]">
              <ShareIcon />
              <span>공유</span>
            </div>
          </div>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full bg-main-bg scrollbar-hidden">
          <ImageSlider imageArr={imageArr} />
          <div className="size-full flex flex-col px-layout relative">
            <div className="flex flex-col gap-[4px] mb-[10px]">
              <div className="flex gap-[4px] text-[12px] text-main-darkGray justify-end">
                <span>작성일자 </span>
                <span>2025-02-17</span>
                <span>10:29:15</span>
              </div>
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

            <div className="flex justify-between sticky top-0 bg-main-bg py-[10px]">
              <a className="flex-1 text-center" href="#condition">
                근무조건
              </a>
              <a className="flex-1 text-center" href="#detail">
                상세요강
              </a>
              <a className="flex-1 text-center" href="#info">
                기업정보
              </a>
            </div>

            <div className="flex flex-col gap-[20px] bg-white rounded-[20px] p-[20px] pb-[110px]">
              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]" id="condition">
                  근무조건
                </h3>
                <div className="flex">
                  <span className="text-main-gray basis-[80px]">급여</span>
                  <p className="flex-1 flex gap-[10px]">
                    <span className="text-warn border border-warn px-2">
                      시급
                    </span>
                    10,030원
                  </p>
                </div>
                {layout("협의기간", "2025년 2월 24일 ~ 2025년 3월 17일")}
                {layout("근무일자", "연속 10일 | 1일")}
                {layout("근무요일", "주 5일(월 ~ 금)")}
                {layout("근무시간", "09:00 ~ 17:50")}
                {layout(
                  "업직종",
                  "풀스택 개발",
                  <p className="bg-main-bg text-[12px] flex justify-center items-center px-2 rounded-[5px]">
                    초보가능
                  </p>
                )}
                {layout("고용형태", "일일 단기 장기")}
                {layout("복리후생", "중식 제공, 노트북 제공")}
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]">모집조건</h3>
                {layout("모집마감", "2025년 3월 3일")}
                {layout("모집인원", "3명")}
                {layout("학력", "학력 무관")}
                {layout("우대사항", "관련 전공, 관련 프젝경험, 관련 자격증")}
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]">근무지역</h3>
                {layout(
                  "근무지역",
                  "서울 중구 청파로 463 한국경제신문사 3층, WISDOM 강의실 123호"
                )}
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]" id="detail">
                  상세요강
                </h3>
                <div className="w-full h-[500px] bg-main-darkGray">이미지</div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]">채용 담당자 정보</h3>
                {layout("담당자", "채용 담당자")}
                {layout("연락처", "비공개")}
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="flex w-full justify-between items-center">
                  <h3 className="font-bold text-[20px]" id="info">
                    기업 정보
                  </h3>
                  <Link
                    to={"#"}
                    className="text-main-darkGray flex items-center"
                  >
                    기업 정보 상세보기
                    <ArrowRightIcon color="#717171" />
                  </Link>
                </div>
                {layout("담당자", "채용 담당자")}
                {layout("연락처", "비공개")}
              </div>

              <div className="flex flex-col gap-[10px]">
                <div className="flex w-full justify-between">
                  <h3 className="font-bold text-[20px]">기업 리뷰</h3>
                  <div>별점</div>
                </div>
                {layout("익명1", "어쩌구")}
                {layout("익명2", "저쩌구")}
                {layout("익명3", "머시기")}
              </div>
            </div>

            <div className="bottom-0 left-1/2 -translate-x-1/2 max-w-[560px] w-full p-[20px] flex gap-[10px] fixed bg-white">
              <Link
                to={"#"}
                className="flex h-[50px] border justify-center items-center px-[20px] bg-white rounded-[10px]"
              >
                채팅하기
              </Link>
              <Link
                to={"#"}
                className="flex flex-1 h-[50px] border justify-center items-center p-[10px] bg-main-color text-white rounded-[10px]"
              >
                지원하기
              </Link>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
};

const layout = (title: string, content: string, option?: JSX.Element) => {
  return (
    <div>
      <div className="flex items-start">
        <span className="text-main-gray basis-[80px]">{title}</span>
        <p className="flex gap-[10px] items-center break-keep flex-1">
          {content}
          {option}
        </p>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
