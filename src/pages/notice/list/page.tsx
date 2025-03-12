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
  jobType: string;
  pay: {
    type: string;
    value: number;
  };
  hireType: string[];
  period: {
    start: Date;
    end: Date;
    discussion: boolean;
  };
  hour: {
    start: Date;
    end: Date;
    discussion: boolean;
  };
  day: string[];
  deadline: {
    date: Date;
    time: Date;
  };
  address: {
    zipcode: string;
    street: string;
    detail?: string;
    lat?: number;
    lng?: number;
  };
  createdAt: Date;
}

export function NoticeListPage() {
  const location = useLocation();
  const searchParams = location.state || {};

  const [hasNotice, setNotice] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);

  const dropMenuRef = useRef<HTMLUListElement | null>(null);
  const minusIconRef = useRef<HTMLDivElement | null>(null);

  const [allPosts, setAllPosts] = useState<PostData[]>([]);
  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);

  // API에서 공고 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get(
          "http://localhost:8080/api/post/lists"
        );
        setAllPosts(response.data);

        // 초기 필터 설정 및 적용
        setupInitialFilters(response.data);
      } catch (error) {
        console.error("데이터 가져오기 실패:", error);
        setNotice(false);
      }
    };

    fetchPosts();
  }, [location]);

  // 활성화된 필터 카테고리 설정
  const setupInitialFilters = (posts: PostData[]) => {
    const activeFiltersArr = [];

    // 검색어가 있을 경우
    if (searchParams.search && searchParams.search.trim() !== "") {
      activeFiltersArr.push(`검색어: ${searchParams.search}`);
    }

    // 지역 정보가 있을 경우
    if (searchParams.sido && searchParams.sido !== "전체") {
      if (searchParams.sigungu && searchParams.sigungu !== "전체") {
        activeFiltersArr.push(`${searchParams.sido} ${searchParams.sigungu}`);
      } else {
        activeFiltersArr.push(`${searchParams.sido}`);
      }
    }

    // 직종 정보가 있을 경우
    if (searchParams.jobType && searchParams.jobType !== "직종 전체") {
      activeFiltersArr.push(`${searchParams.jobType}`);
    }

    // 급여 정보가 있을 경우
    if (searchParams.pay && searchParams.pay > 0) {
      activeFiltersArr.push(
        `${searchParams.payType}: ${searchParams.pay.toLocaleString()}원 이상`
      );
    }

    // 고용 형태가 있을 경우
    if (searchParams.hireType) {
      const selectedTypes = Object.keys(searchParams.hireType).filter(
        (key) => searchParams.hireType[key]
      );

      if (selectedTypes.length > 0) {
        activeFiltersArr.push(`고용형태: ${selectedTypes.join(", ")}`);
      }
    }

    // 근무 기간이 있을 경우
    if (searchParams.startDate || searchParams.endDate) {
      const formatDate = (date: Date) => {
        return date ? new Date(date).toISOString().split("T")[0] : "";
      };

      const startDateStr = formatDate(searchParams.startDate);
      const endDateStr = formatDate(searchParams.endDate);

      if (startDateStr && endDateStr) {
        activeFiltersArr.push(`근무기간: ${startDateStr} ~ ${endDateStr}`);
      }
    }

    setActiveFilters(activeFiltersArr);

    // 필터 적용
    applyFilters(posts);
  };

  // 필터 제거 핸들러
  const handleRemoveFilter = (index: number) => {
    // 필터 카테고리 제거
    const newFilters = [...activeFilters];
    const removedFilter = newFilters.splice(index, 1)[0];
    setActiveFilters(newFilters);

    // 필터 종류에 따라 searchParams 업데이트
    let updatedParams = { ...searchParams };

    if (removedFilter.startsWith("검색어:")) {
      updatedParams.search = "";
    } else if (removedFilter.startsWith("고용형태:")) {
      updatedParams.hireType = { 일일: false, 단기: false, 장기: false };
    } else if (removedFilter.includes(":")) {
      // 급여 필터 제거
      if (
        removedFilter.includes("시급:") ||
        removedFilter.includes("일급:") ||
        removedFilter.includes("주급:") ||
        removedFilter.includes("월급:") ||
        removedFilter.includes("총 급여:")
      ) {
        updatedParams.pay = 0;
      }
    } else if (removedFilter.startsWith("근무기간:")) {
      updatedParams.startDate = null;
      updatedParams.endDate = null;
    } else if (jobTypes.includes(removedFilter)) {
      // 직종 필터 제거
      updatedParams.jobType = "직종 전체";
    } else {
      // 지역 필터 제거 (시도/시군구)
      const parts = removedFilter.split(" ");
      if (parts.length > 1) {
        // 시군구까지 포함된 필터
        updatedParams.sigungu = "전체";
      } else {
        // 시도만 포함된 필터
        updatedParams.sido = "전체";
        updatedParams.sigungu = "전체";
      }
    }

    // 새 파라미터로 필터 적용
    applyFilters(allPosts, updatedParams);
  };

  // 검색 조건에 따라 공고 필터링
  const applyFilters = (posts: PostData[], params = searchParams) => {
    if (!posts.length) {
      setFilteredPosts([]);
      setNotice(false);
      return;
    }

    let result = [...posts]; // 모든 공고에서 시작

    // 검색어 필터링
    if (params.search && params.search.trim() !== "") {
      const searchTerm = params.search.toLowerCase();
      result = result.filter(
        (post) => post.title.toLowerCase().includes(searchTerm)
        // 회사 이름이 스키마에 있다면 추가적으로 검색 가능
      );
    }

    // 지역 필터링
    if (params.sido && params.sido !== "전체") {
      result = result.filter((post) => {
        const postAddress = post.address.street || "";

        if (params.sigungu && params.sigungu !== "전체") {
          // 시/도와 시/군/구 모두 필터링
          return (
            postAddress.includes(params.sido) &&
            postAddress.includes(params.sigungu)
          );
        } else {
          // 시/도만 필터링
          return postAddress.includes(params.sido);
        }
      });
    }

    // 직종 필터링
    if (params.jobType && params.jobType !== "직종 전체") {
      result = result.filter((post) => post.jobType === params.jobType);
    }

    // 급여 필터링
    if (params.pay && params.pay > 0) {
      result = result.filter((post) => {
        // 급여 타입이 일치하고 금액이 검색 조건 이상인 공고 필터링
        if (params.payType === post.pay.type) {
          return post.pay.value >= params.pay;
        }
        return false;
      });
    }

    // 고용 형태 필터링
    if (params.hireType) {
      const selectedTypes = Object.keys(params.hireType).filter(
        (key) => params.hireType[key]
      );

      if (selectedTypes.length > 0) {
        result = result.filter((post) => {
          // 공고의 hireType 배열에 선택된 고용형태 중 하나라도 포함되어 있는지 확인
          return post.hireType.some((type) => selectedTypes.includes(type));
        });
      }
    }

    // 근무 기간 필터링
    if (params.startDate || params.endDate) {
      result = result.filter((post) => {
        const postStartDate = new Date(post.period.start);
        const postEndDate = new Date(post.period.end);

        if (params.startDate && params.endDate) {
          const startDate = new Date(params.startDate);
          const endDate = new Date(params.endDate);

          // 공고의 근무 기간이 검색 조건의 기간과 겹치는지 확인
          return (
            (postStartDate >= startDate && postStartDate <= endDate) ||
            (postEndDate >= startDate && postEndDate <= endDate) ||
            (postStartDate <= startDate && postEndDate >= endDate)
          );
        } else if (params.startDate) {
          const startDate = new Date(params.startDate);
          return postEndDate >= startDate;
        } else if (params.endDate) {
          const endDate = new Date(params.endDate);
          return postStartDate <= endDate;
        }
        return true;
      });
    }

    setFilteredPosts(result);
    setNotice(result.length > 0);
    setCurrentPage(1); // 필터 적용 시 첫 페이지로 이동
    setPageGroup(0); // 페이지 그룹도 초기화
  };

  // 총 페이지 수 계산
  const totalPages = Math.ceil(filteredPosts.length / itemsPerPage);
  // 현재 페이지에 해당하는 아이템들
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentNotices = filteredPosts.slice(
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
    setPageGroup(0);
    setOpen(false);
  };

  // 직종 리스트 (필터 제거 로직에 사용)
  const jobTypes = [
    "직종 전체",
    "관리자",
    "전문가 및 관련 종사자",
    "사무 종사자",
    "서비스 종사자",
    "판매 종사자",
    "농림어업 숙련 종사자",
    "기능원 및 관련 기능 종사자",
    "장치ㆍ기계 조작 및 조립 종사자",
    "단순 노무 종사자",
    "군인",
  ];

  // 날짜를 yyyy-MM-dd 형식으로 변환하는 함수
  const formatDate = (dateString: string | Date) => {
    const date = new Date(dateString);
    return date
      .toLocaleDateString("ko-KR", {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      })
      .replace(/\. /g, "-")
      .replace(".", "");
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
                {/* 활성화된 필터 카테고리 표시 */}
                {activeFilters.length > 0 && (
                  <CetegoryContiner>
                    {activeFilters.map((filter, index) => (
                      <CategoryItem key={index} className="bg-selected-box">
                        <div className="flex w-fit text-main-color">
                          {filter}
                        </div>
                        <div
                          className="flex w-fit h-fit ml-2"
                          onClick={() => handleRemoveFilter(index)}
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
                        {filteredPosts.length} 건{" "}
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
                          <span>{notice.title}</span>
                          <div>
                            <span>마감일 </span>
                            <span>{formatDate(notice.deadline.date)}</span>
                          </div>
                        </div>
                        <div className="w-[95%] text-[16px] font-bold flex-wrap">
                          {notice.title}
                        </div>
                        <div className="w-[95%] text-[12px] flex flex-row flex-nowrap gap-3">
                          <div className="text-main-darkGray">
                            {notice.address.street}
                          </div>
                          <div>
                            <span className="text-[#1D8738] font-bold">
                              {notice.pay.type}
                            </span>
                            <span className="text-main-darkGray">
                              {notice.pay.value.toLocaleString()} 원
                            </span>
                          </div>
                          <div className="text-main-darkGray">
                            {notice.hireType.join(", ")}
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
