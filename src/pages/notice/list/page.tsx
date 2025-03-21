import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import CancelIcon from "@/components/icons/Cancel";
import PostData from "@/types/postdata";
import { jopOptions } from "../options";
import HeaderBack from "@/components/HeaderBack";

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
  height: calc(100% - 70px);
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

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function NoticeListPage() {
  const location = useLocation();
  const [searchParams, setSearchParams] = useState(location.state || {});
  const [hasNotice, setNotice] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const dropMenuRef = useRef<HTMLUListElement | null>(null);
  const minusIconRef = useRef<HTMLDivElement | null>(null);

  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
  const [activeFilters, setActiveFilters] = useState<string[]>([]);
  const [totalItems, setTotalItems] = useState<number>(0);

  const navigate = useNavigate();

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

  // 활성화된 필터 카테고리 설정
  const setupFiltersFromParams = (params = searchParams) => {
    const activeFiltersArr: string[] = [];

    // 검색어가 있을 경우
    if (params.search && params.search.trim() !== "") {
      activeFiltersArr.push(`검색어: ${params.search}`);
    }

    // 지역 정보가 있을 경우
    if (params.sido && params.sido !== "전체") {
      if (params.sigungu && params.sigungu !== "전체") {
        activeFiltersArr.push(`${params.sido} ${params.sigungu}`);
      } else {
        activeFiltersArr.push(`${params.sido}`);
      }
    }

    // 직종 정보가 있을 경우
    if (params.jobType && params.jobType !== "직종 전체") {
      activeFiltersArr.push(`${params.jobType}`);
    }

    // 급여 정보가 있을 경우
    if (params.pay && params.pay > 0) {
      activeFiltersArr.push(
        `${params.payType}: ${params.pay.toLocaleString()}원 이상`
      );
    }

    // 고용 형태가 있을 경우
    if (params.hireType) {
      const selectedTypes = Object.keys(params.hireType).filter(
        (key) => params.hireType[key]
      );

      if (selectedTypes.length > 0) {
        activeFiltersArr.push(`고용형태: ${selectedTypes.join(", ")}`);
      }
    }

    // 근무 기간이 있을 경우
    if (params.startDate || params.endDate) {
      const formatDateString = (date: Date) => {
        return date ? new Date(date).toISOString().split("T")[0] : "";
      };

      const startDateStr = formatDateString(params.startDate);
      const endDateStr = formatDateString(params.endDate);

      if (startDateStr && endDateStr) {
        activeFiltersArr.push(`근무기간: ${startDateStr} ~ ${endDateStr}`);
      }
    }

    setActiveFilters(activeFiltersArr);
  };

  // API에서 공고 데이터 가져오기
  const fetchPosts = async (
    params = searchParams,
    page = 1,
    limit = itemsPerPage
  ) => {
    try {
      // URL 쿼리 파라미터 구성
      const queryParams = new URLSearchParams();

      // 페이지네이션 파라미터
      queryParams.append("page", page.toString());
      queryParams.append("limit", limit.toString());

      // 검색어 추가
      if (params.search && params.search.trim() !== "") {
        queryParams.append("search", params.search);
      }

      // 직종 추가
      if (params.jobType && params.jobType !== "직종 전체") {
        queryParams.append("jobType", params.jobType);
      }

      // 지역 추가
      if (params.sido && params.sido !== "전체") {
        queryParams.append("sido", params.sido);

        if (params.sigungu && params.sigungu !== "전체") {
          queryParams.append("sigungu", params.sigungu);
        }
      }

      // 급여 추가
      if (params.pay && params.pay > 0) {
        queryParams.append("payType", params.payType);
        queryParams.append("payValue", params.pay.toString());
      }

      // 고용 형태 추가
      if (params.hireType) {
        const selectedTypes = Object.keys(params.hireType).filter(
          (key) => params.hireType[key]
        );

        if (selectedTypes.length > 0) {
          queryParams.append("hireType", selectedTypes.join(","));
        }
      }

      // 근무 기간 추가
      if (params.startDate) {
        queryParams.append(
          "startDate",
          new Date(params.startDate).toISOString()
        );
      }

      if (params.endDate) {
        queryParams.append("endDate", new Date(params.endDate).toISOString());
      }

      // API 호출
      const response = await axios.get(
        `http://localhost:8080/api/post/search?${queryParams.toString()}`
      );

      // 응답 데이터 설정
      const { posts, pagination } = response.data as {
        posts: PostData[];
        pagination: PaginationData;
      };

      setFilteredPosts(posts);
      setTotalPages(pagination.totalPages);
      setTotalItems(pagination.total); // 추가된 부분
      setNotice(posts.length > 0);

      // 활성화된 필터 설정
      setupFiltersFromParams(params);
    } catch (error) {
      console.error("데이터 가져오기 실패:", error);
      setNotice(false);
    }
  };

  // 페이지 변경 핸들러
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    fetchPosts(searchParams, pageNumber, itemsPerPage);
  };

  // 드롭다운 메뉴 열기/닫기
  const handleOpenMenu = () => {
    setOpen(!isOpen);
  };

  // 드롭다운 항목 선택 시, itemsPerPage 업데이트 및 현재 페이지 초기화
  const handleSelectItem = (num: number) => {
    setItemsPerPage(num);
    setCurrentPage(1);
    setPageGroup(0);
    fetchPosts(searchParams, 1, num);
    setOpen(false);
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
    } else if (jopOptions.includes(removedFilter)) {
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
    setSearchParams(updatedParams);
    // 새 파라미터로 API 호출
    fetchPosts(updatedParams, 1, itemsPerPage);
  };

  // useEffect에서 초기 데이터 로딩
  useEffect(() => {
    fetchPosts(searchParams, 1, itemsPerPage);
  }, [location]);

  // 페이지 그룹 당 보여줄 페이지 개수
  const pagesToShow = 5;

  // 현재 그룹에 보여질 시작 페이지 번호와 종료 페이지 번호 계산
  const startPage = pageGroup * pagesToShow + 1;
  const endPage = Math.min(totalPages, startPage + pagesToShow - 1);
  const visiblePages = [];
  for (let i = startPage; i <= endPage; i++) {
    visiblePages.push(i);
  }

  return (
    <>
      <HeaderBack title="검색 결과" />
      <Main hasBottomNav={true}>
        <Body>
          {hasNotice ? (
            <>
              <Head>
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
                  <div className="flex justify-between items-center pl-4 w-full h-10 my-1">
                    <div className="flex flex-row">
                      <span>총&nbsp;</span>
                      <span className="text-main-color">{totalItems} 건 </span>
                      <span>공고</span>
                    </div>
                    <DropMenu
                      className="flex items-center justify-evenly gap-2 text-[12px] w-[150px] h-[40px]"
                      onClick={handleOpenMenu}
                      ref={minusIconRef}
                    >
                      <div className="flex w-fit">{itemsPerPage}개씩 보기</div>
                      <div className="relative flex w-fit">
                        <ArrowDownIcon />
                        {isOpen && (
                          <Drop ref={dropMenuRef} className="z-10 -right-2">
                            <li onClick={() => handleSelectItem(5)}>5</li>
                            <li onClick={() => handleSelectItem(10)}>10</li>
                            <li onClick={() => handleSelectItem(20)}>20</li>
                          </Drop>
                        )}
                      </div>
                    </DropMenu>
                  </div>
                  {/* 현재 페이지의 공고 아이템 렌더링 */}
                  {filteredPosts.map((notice) => (
                    <ListContainer
                      key={notice._id}
                      onClick={() =>
                        navigate(`/notice/${notice._id.toString()}`)
                      }
                    >
                      <div className="mr-2 w-20 h-20 ob rounded-lg border border-main-darkGray min-w-20">
                        <img
                          className={`w-full h-full ${
                            notice.images?.length
                              ? "object-contain"
                              : " object-cover"
                          }
                          `}
                          src={
                            notice.images?.length
                              ? notice.images[0]
                              : "/logo.png"
                          }
                          alt="공고 이미지"
                        />
                      </div>
                      <ListInfo>
                        <div className="flex flex-row justify-between w-[95%] h-[15px] text-[12px] text-main-darkGray">
                          <span>{notice.jobType}</span>
                          <div>
                            <span>마감일 </span>
                            <span>
                              {notice.deadline && notice.deadline.date
                                ? formatDate(notice.deadline.date)
                                : "상시모집"}
                            </span>
                          </div>
                        </div>
                        <div className="w-[95%] text-[16px] font-bold flex-wrap">
                          {notice.title}
                        </div>
                        <div className="w-[95%] text-[12px] flex flex-row flex-nowrap gap-2">
                          <div className="text-main-darkGray truncate">
                            {notice.address.street}
                          </div>
                          <div className="min-w-[100px]">
                            <span className="text-[#1D8738] font-bold">
                              {notice.pay.type}
                            </span>
                            &nbsp;
                            <span className="text-main-darkGray">
                              {notice.pay.value.toLocaleString() + " 원"}
                            </span>
                          </div>
                          <div className="text-main-darkGray min-w-8 truncate">
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
                        onClick={() => handlePageChange(page)}
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
