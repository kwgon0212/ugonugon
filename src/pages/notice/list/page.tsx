import React, { useState, useRef, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";

import Header from "../../../components/Header";
import Main from "../../../components/Main";
import BottomNav from "../../../components/BottomNav";

import ArrowDownIcon from "@/components/icons/ArrowDown";
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
  justify-content: space-between; /* 📌 추가 */
  width: 100%;
  height: 100%;
  background-color: #f7f7f9;
`;

const ListScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  min-height: 100%;
  height: 100%;
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
  min-height: 7%;
  height: 7%;
`;

const NumberBtnWrap = styled.div`
  display: flex;
  height: 100%;
  min-width: 200px; // 최소 너비 설정 (숫자가 적어도 너무 벌어지지 않도록)
  justify-content: center;
  align-items: center;
  gap: 10px; // 숫자 간격 일정하게 유지
`;

const NavBtn = styled.div`
  padding: 5px 10px; // 버튼 내부 간격 조정
  border-radius: 5px; // 버튼 모양 둥글게
  cursor: pointer;
  color: #717171;
  transition: background-color 0.3s ease;

  &:hover {
    background-color: #e0e0e0;
  }

  &.active {
    color: #0b798b;
    font-weight: bold;
  }
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

interface PostData {
  _id: string;
  title: string;
  companyInfo: {
    exposedArea: { goo: string };
    companyName: string;
  };
  payType: string;
  pay: number;
  workingPeriod: string;
  endOfNotice: Date;
}
export function NoticeListPage() {
  const location = useLocation();
  const [hasNotice, setNotice] = useState(true);
  const [isOpen, setOpen] = useState(false); // 드롭다운 메뉴 열림 상태
  const [itemsPerPage, setItemsPerPage] = useState(5); // 드롭다운에서 선택한 아이템 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [pageGroup, setPageGroup] = useState(0); // 현재 보이는 페이지 그룹(0부터 시작)

  const dropMenuRef = useRef<HTMLUListElement | null>(null);
  const minusIconRef = useRef<HTMLDivElement | null>(null);

  const [posts, setPosts] = useState<PostData[]>([]);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/post/get/notice/lists"
        );
        console.log("0");

        setPosts(response.data); // 받아온 데이터를 상태에 저장
        setNotice(!!posts.length);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
      }
    };

    fetchPosts();
  });

  // 총 페이지 수 계산
  const totalPages = Math.ceil(posts.length / itemsPerPage);
  // 현재 페이지에 해당하는 아이템들
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = posts.slice(startIndex, startIndex + itemsPerPage);

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

  // 초기 카테고리 배열 (원하는 만큼 추가 가능)
  const [categories, setCategories] = useState([
    "서울 용산구",
    "서울 강남구",
    "서울 종로구",
    "부산 해운대구",
    "제주도",
  ]);

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
                <ListScrollWrapper>
                  <div className="flex flex-row justify-between items-center pl-4 w-full h-[40px]">
                    <div className="flex flex-row">
                      <span>총 </span>
                      <span className="text-main-color">
                        {posts.length} 건{" "}
                      </span>
                      <span>공고</span>
                    </div>
                    <div className="flex flex-row items-center justify-evenly text-[12px] w-[150px] h-[40px]">
                      <div className="flex w-fit">{itemsPerPage}개씩 보기</div>
                      <div className="relative flex w-fit">
                        <DropMenu onClick={handleOpenMenu} ref={minusIconRef}>
                          <ArrowDownIcon />
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
                    <ListContainer key={notice._id}>
                      <div className="mr-2 w-[80px] h-[80px] rounded-lg bg-main-darkGray">
                        <img src="/logo192.png" alt="공고 이미지" />
                      </div>
                      <ListInfo>
                        <div className="flex flex-row justify-between w-[95%] h-[15px] text-[12px] text-main-darkGray">
                          <span>{notice.companyInfo.companyName}</span>
                          <div>
                            <span>마감일 </span>
                            <span>
                              {new Date(
                                notice.endOfNotice
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-[95%] text-[16px] font-bold flex-wrap">
                          {notice.title}
                        </div>
                        <div className="w-[95%] text-[12px] flex flex-row flex-nowrap gap-3">
                          <div className="text-main-darkGray">
                            {notice.companyInfo.exposedArea.goo}
                          </div>
                          <div>
                            <span className="text-[#1D8738] font-bold">
                              {notice.payType}
                            </span>
                            <span className="text-main-darkGray">
                              {notice.pay.toLocaleString()} 원
                            </span>
                          </div>
                          <div className="text-main-darkGray">
                            {notice.workingPeriod}
                          </div>
                        </div>
                      </ListInfo>
                    </ListContainer>
                  ))}
                </ListScrollWrapper>

                {/* 페이지 번호 버튼과 좌우 화살표 */}
                <Numbernav>
                  <NumberBtnWrap>
                    {pageGroup > 0 && (
                      <NavBtn onClick={() => setPageGroup(pageGroup - 1)}>
                        <ArrowLeftIcon />
                      </NavBtn>
                    )}

                    {visiblePages.map((page) => (
                      <NavBtn
                        key={page}
                        className={currentPage === page ? "active" : ""}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </NavBtn>
                    ))}

                    {(pageGroup + 1) * pagesToShow < totalPages && (
                      <NavBtn onClick={() => setPageGroup(pageGroup + 1)}>
                        <ArrowRightIcon />
                      </NavBtn>
                    )}
                  </NumberBtnWrap>
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
