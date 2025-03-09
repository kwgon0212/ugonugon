import Header from "../../components/Header";
import Main from "../../components/Main";
import BottomNav from "../../components/BottomNav";
import ArrowRightIcon from "../../components/icons/ArrowRight";
import ResumeIcon from "../../components/icons/Resume";
import WalletIcon from "../../components/icons/Wallet";
import { useState } from "react";
import ReCruitPageFail from "./ReCruitPageFail";
function ReCruitPage() {
  const [hasWorkItem, setWorkItem] = useState(true);
  const [userId, setUserId] = useState("의문의 계정");

  return (
    <>
      {/* 헤더 영역 */}
      <Header>
        {/* 고용 현황 문구, 텍스트 중앙 정렬 및 bold 처리 */}
        <p className="flex justify-center items-center h-full font-bold text-lg">
          고용 현황
        </p>
      </Header>

      {/* 메인 콘텐츠 */}
      <Main hasBottomNav={true}>
        {hasWorkItem ? (
          <div className="size-full bg-white">
            <div className="p-4 space-y-4 rounded-t-[30px] bg-main-bg">
              {/* 상단 제목 */}
              <h2 className="text-[18px] font-bold">나의 근로자 관리</h2>

              {/* 근로자 목록 */}
              <div className="space-y-4">
                {[1, 2].map((worker, index) => (
                  <div
                    key={index}
                    className=" rounded-lg p-4 shadow-md bg-white"
                  >
                    {/* 공고 제목 */}
                    <h3 className="text-[16px] font-semibold">
                      TossBank X 한국경제신문 Fullstack
                    </h3>
                    {/* 위치 정보 */}
                    <p className="text-[12px]">
                      서울 중구 청파로 463 한국경제신문사
                    </p>
                    {/* 시급 정보 */}
                    <p className="text-[12px]">
                      <span className="text-main-color font-bold">시급</span>{" "}
                      10,030원
                    </p>

                    {/* 구분선 */}
                    <hr className="my-2 border-main-color/30" />

                    {/* 근무일자 */}
                    <h4 className="text-[14px] font-semibold">근무일자</h4>
                    <p className="text-[14px] text-main-color font-semibold">
                      2025년 2월 25일 화요일 09:00-18:00
                    </p>

                    {/* 구분선 */}
                    <hr className="my-2 border-main-color/30" />

                    {/* 근로자 정보 */}
                    <h4 className="text-[14px] font-semibold">근로자 정보</h4>
                    <div className="flex items-center space-x-4 mt-2">
                      {/* 근로자 사진 */}
                      <div className="w-[80px] h-[80px] bg-main-gray rounded-[10px]"></div>
                      {/* 근로자 정보 텍스트 */}
                      <div>
                        <p className="flex gap-[6px] text-[14px] font-semibold">
                          홍길동
                          <span className="text-main-darkGray font-medium">
                            1995.05.20
                          </span>
                        </p>
                        <p className="font-semibold">010-1234-5678</p>
                        <p className="flex gap-[7px] text-[14px]">
                          출근<span className="text-main-color">완료</span>
                        </p>
                        <p className="flex gap-[7px] text-[14px]">
                          퇴근<span className="text-main-darkGray">미완료</span>
                        </p>
                      </div>
                    </div>

                    {/* 정산하기 버튼 */}
                    <button
                      className={`mt-4 w-full font-semibold text-[14px] py-2 rounded-[10px] text-white ${
                        worker === 1 ? "bg-main-color " : "bg-selected-box"
                      }`}
                    >
                      정산하기
                    </button>
                  </div>
                ))}
              </div>

              {/*  수정된 목차: 흰 배경 유지, 아이콘을 오른쪽으로 정렬 */}
              <div className="mt-6 space-y-3">
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer">
                  <span className="text-gray-800 font-medium flex gap-[5px] items-center">
                    <span>
                      <ResumeIcon color="#717171" />
                    </span>{" "}
                    등록한 공고 관리
                  </span>
                  <ArrowRightIcon className="w-5 h-5 text-gray-700" />
                </div>
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer">
                  <span className="text-gray-800 font-medium flex items-center gap-[5px]">
                    <span>
                      <WalletIcon color="#717171" />
                    </span>
                    내 출금계좌 관리
                  </span>
                  <ArrowRightIcon className="w-5 h-5 text-gray-700" />
                </div>
              </div>
            </div>
          </div>
        ) : (
          <ReCruitPageFail />
        )}
      </Main>

      {/* 바텀 네비게이션 */}
      <BottomNav />
    </>
  );
}

export default ReCruitPage;
