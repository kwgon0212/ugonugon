import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import Header from "../../../components/Header";
import Main from "../../../components/Main";
import BottomNav from "../../../components/BottomNav";

import MinusIcon from "@/components/icons/Minus";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import CancelIcon from "@/components/icons/Cancel";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import StarIcon from "@/components/icons/Star";
const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const ListWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: #f7f7f9;
`;
const ListScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 93%;
  overflow-y: auto;
  background-color: #f7f7f9;
  scrollbar-width: none;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  height: 100px;
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
  border-radius: 10px;
`;

const ListInfo = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  width: 80%;
  gap: 2px;
`;

const Numbernav = styled.div`
  position: sticky;
  bottom: 0;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  width: 100%;
  //수정
  height: 7%;
  //수정 끝
  padding: 5px 0;
  background-color: #fff;
`;

const NavBtn = styled.div`
  flex: 1;
  color: #717171;
  cursor: pointer;
`;

const DropMenu = styled.div`
  display: flex;
  width: fit-content;
  margin-right: 15px;
  cursor: pointer;
`;

const Drop = styled.ul`
  position: absolute;
  display: block;
  top: 20px;
  text-align: center;
  background-color: white;
  width: 40px;
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 5px;
  list-style: none;
`;

interface GetNoticeInfo {
  id: number;
  companyName: string;
  endDate: string;
  day: string;
  title: string;
  address: string;
  pay: number;
  period: string;
}

export function MypageScrabPage() {
  const location = useLocation();
  const [hasNotice, setNotice] = useState(true);
  const [isOpen, setOpen] = useState(false); // 드롭다운 메뉴 열림 상태
  const [itemsPerPage, setItemsPerPage] = useState(5); // 드롭다운에서 선택한 아이템 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [pageGroup, setPageGroup] = useState(0); // 현재 보이는 페이지 그룹(0부터 시작)

  const dropMenuRef = useRef<HTMLUListElement | null>(null);
  const minusIconRef = useRef<HTMLDivElement | null>(null);

  // 예시용 103건의 공고 데이터 배열 생성
  const noticeList: GetNoticeInfo[] = Array.from(
    { length: 103 },
    (_, index) => ({
      id: index,
      companyName: "회사명",
      endDate: "3/1",
      day: "토",
      title: `[업무강도 상]풀스택 프로젝트 보조 구인 / 중식 제공 - ${
        index + 1
      }`,
      address: "서울 용산구",
      pay: 100030,
      period: "1주일 ~ 1개월",
    })
  );

  // 총 페이지 수 계산
  const totalPages = Math.ceil(noticeList.length / itemsPerPage);
  // 현재 페이지에 해당하는 아이템들
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = noticeList.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  // 페이지 그룹 당 보여줄 페이지 개수
  const pagesToShow = 5;
  // 현재 그룹에 보여질 시작 페이지 번호와 종료 페이지 번호 계산
  const startPage = pageGroup * pagesToShow + 1;
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  // 드롭다운 메뉴 열기/닫기
  const handleOpenMenu = () => {
    setOpen(!isOpen);
  };

  // 드롭다운 항목 선택 시, itemsPerPage 업데이트 및 현재 페이지 초기화
  const handleSelectItem = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
    setPageGroup(0); // 페이지 그룹도 초기화
    setOpen(false);
  };

  return (
    <>
      <Header>
        <Link to="/mypage" className="flex items-center h-full ml-2">
          <ArrowLeftIcon />
          <span className="font-bold flex justify-center w-full mr-3">
            스크랩알바
          </span>
        </Link>
      </Header>
      <Main hasBottomNav={true}>
        <Body>
          {hasNotice ? (
            <>
              <ListWrapper className="bg-main-bg">
                <ListScrollWrapper>
                  <div className="flex flex-row justify-between items-center pl-4 w-full h-[40px]">
                    <div className="flex flex-row gap-1">
                      <span>총 </span>
                      <span className="text-main-color font-bold">
                        {noticeList.length}건의
                      </span>
                      <span>스크랩 공고</span>
                    </div>
                    <div className="flex flex-row items-center justify-evenly text-[12px] w-[100px] h-[40px]">
                      <div className="flex w-fit">필터</div>
                      <div className="relative flex w-fit">
                        <DropMenu onClick={handleOpenMenu} ref={minusIconRef}>
                          <MinusIcon />
                        </DropMenu>
                        {isOpen && (
                          <Drop ref={dropMenuRef}>
                            <li onClick={() => handleSelectItem(5)}>5</li>
                            <li onClick={() => handleSelectItem(10)}>10</li>
                            <li onClick={() => handleSelectItem(20)}>20</li>
                          </Drop>
                        )}
                      </div>
                    </div>
                  </div>
                  {/* 현재 페이지의 공고 아이템 렌더링 */}
                  {currentNotices.map((notice) => (
                    <ListContainer key={notice.id}>
                      <div className="mr-2 w-[80px] h-[80px] rounded-lg bg-main-darkGray relative">
                        <img
                          src="/logo192.png"
                          alt="공고 이미지"
                          className="w-full h-full object-cover rounded-lg"
                        />

                        {/* Star 아이콘을 감싸는 div 추가 */}
                        <div className="absolute top-0.5 right-0.5 p-0.5 bg-white rounded-full ">
                          <div>
                            <StarIcon />
                          </div>
                        </div>
                      </div>

                      <ListInfo>
                        <div className="flex flex-row justify-between w-[95%] h-[15px] text-[12px] text-main-darkGray">
                          <span>{notice.companyName}</span>
                          <div>
                            <span>마감일 </span>
                            <span>{notice.endDate}</span>
                            <span>({notice.day})</span>
                          </div>
                        </div>
                        <div className="w-[95%] text-[12px] font-bold flex-wrap">
                          {notice.title}
                        </div>
                        <div className="w-[95%] text-[12px] flex flex-row flex-nowrap gap-3">
                          <div>{notice.address}</div>
                          <div>
                            <span className="font-bold text-[#1D8738]">
                              시급{" "}
                            </span>
                            <span>{notice.pay.toLocaleString()} 원</span>
                          </div>
                          <div>{notice.period}</div>
                        </div>
                      </ListInfo>
                    </ListContainer>
                  ))}
                </ListScrollWrapper>
                {/* 페이지 번호 버튼과 좌우 화살표 */}

                <Numbernav>
                  <div className="flex flex-row w-[50%] justify-around">
                    {pageGroup > 0 && (
                      <NavBtn onClick={() => setPageGroup(pageGroup - 1)}>
                        <ArrowLeftIcon />
                      </NavBtn>
                    )}
                    {visiblePages.map((page) => (
                      <NavBtn
                        key={page}
                        onClick={() => setCurrentPage(page)}
                        style={{
                          color: currentPage === page ? "#0B798B" : "#717171",
                        }}
                      >
                        {page}
                      </NavBtn>
                    ))}
                    {(pageGroup + 1) * pagesToShow < totalPages && (
                      <NavBtn onClick={() => setPageGroup(pageGroup + 1)}>
                        <ArrowRightIcon />
                      </NavBtn>
                    )}
                  </div>
                </Numbernav>
              </ListWrapper>
            </>
          ) : (
            <div className="flex flex-col justify-center items-center w-full h-full">
              <div className="font-bold text-[18px]">
                스크랩 알바가 존재하지 않습니다.
              </div>
            </div>
          )}
        </Body>
      </Main>
      <BottomNav />
    </>
  );
}
// 주석추가
export default MypageScrabPage;
