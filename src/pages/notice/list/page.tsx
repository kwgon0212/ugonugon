import React, { useState, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";

import Header from "../../../components/Header";
import Main from "../../../components/Main";
import BottomNav from "../../../components/BottomNav";

import MinusIcon from "@/components/icons/Minus";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import CancelIcon from "@/components/icons/Cancel";

const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;

const Head = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: fit-content;
  background-color: white;
  padding: 12px;
`;

const CetegoryContiner = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  width: 100%;
  height: fit-content;
  background-color: white;
`;

const CategoryItem = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  width: fit-content;
  height: 30px;
  border-radius: 50px;
  font-size: 12px;
  padding-left: 20px;
  padding-right: 20px;
  margin-right: 7px;
  margin-bottom: 7px;
`;

const ListWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  background-color: #f5f5f5;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 95%;
  height: 100px;
  background-color: white;
  padding: 10px;
  margin-bottom: 10px;
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

export function NoticeListPage() {
  const location = useLocation();
  const [hasNotice, setNotice] = useState(true);
  const [isOpen, setOpen] = useState(false); // 드롭다운 메뉴 열림 상태
  const [itemsPerPage, setItemsPerPage] = useState(5); // 드롭다운에서 선택한 아이템 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [pageGroup, setPageGroup] = useState(0); // 현재 보이는 페이지 그룹(0부터 시작)
  // 초기 카테고리 배열 (원하는 만큼 추가 가능)
  const [categories, setCategories] = useState([
    "서울 용산구",
    "서울 강남구",
    "서울 종로구",
    "부산 해운대구",
    "제주도",
  ]);
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

  // 특정 카테고리 제거 핸들러
  const handleRemoveCategory = (index: number) => {
    setCategories((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <>
      <Header>
        <Link to={"/"} className="flex p-3 w-full h-full">
          <img
            src="/logo192.png"
            alt="로고 이미지"
            className="flex bottom-0 w-[179px] h-[43px]"
          />
        </Link>
      </Header>
      <Main hasBottomNav={true}>
        <Body>
          {hasNotice ? (
            <>
              <Head>
                <div className="font-bold text-[20px] mb-2">검색 결과</div>
                {/* categories 배열이 존재할 때만 카테고리 아이템 렌더링 */}
                {categories.length > 0 && (
                  <CetegoryContiner>
                    {categories.map((cat, index) => (
                      <CategoryItem key={index} className="bg-selected-box">
                        <div className="flex w-fit text-main-color">{cat}</div>
                        <div
                          className="flex w-fit h-fit ml-2"
                          onClick={() => handleRemoveCategory(index)}
                        >
                          <CancelIcon color="#0B798B" />
                        </div>
                      </CategoryItem>
                    ))}
                  </CetegoryContiner>
                )}
              </Head>
              <ListWrapper className="bg-main-bg">
                <div className="flex flex-row justify-between items-center pl-4 w-full h-[40px]">
                  <div className="flex flex-row">
                    <span>총 </span>
                    <span className="text-main-color">
                      {noticeList.length} 건{" "}
                    </span>
                    <span>공고</span>
                  </div>
                  <div className="flex flex-row items-center justify-evenly text-[12px] w-[100px] h-[40px]">
                    <div className="flex w-fit">마감일</div>
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
                    <div className="mr-2 w-[80px] h-[80px] rounded-lg bg-main-darkGray">
                      <img src="/logo192.png" alt="공고 이미지" />
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
                          <span>시급 </span>
                          <span>{notice.pay.toLocaleString()} 원</span>
                        </div>
                        <div>{notice.period}</div>
                      </div>
                    </ListInfo>
                  </ListContainer>
                ))}
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
                검색 결과가 존재하지 않습니다.
              </div>
            </div>
          )}
        </Body>
      </Main>
      <BottomNav />
    </>
  );
}

export default NoticeListPage;
