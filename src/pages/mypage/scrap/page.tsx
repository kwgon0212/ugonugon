import React, { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";
import axios from "axios";
import mongoose from "mongoose";
import Header from "../../../components/Header";
import Main from "../../../components/Main";
import BottomNav from "../../../components/BottomNav";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { useAppSelector } from "@/hooks/useRedux";
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
    start: string | Date;
    end: string | Date;
    discussion: boolean;
  };
  hour: {
    start: string | Date;
    end: string | Date;
    discussion: boolean;
  };
  restTime?: {
    start: string | Date;
    end: string | Date;
  };
  day: string[];
  workDetail?: string;
  welfare?: string;
  postDetail?: string;
  deadline?: {
    date: string | Date;
    time: string | Date;
  };
  person?: number;
  preferences?: string;
  education?: {
    school: string;
    state: string;
  };
  address: {
    zipcode: string;
    street: string;
    detail?: string;
    lat?: number;
    lng?: number;
  };
  recruiter?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  author: string;
  images?: [string];
  createdAt?: string | Date;
  applies: [
    {
      userId: mongoose.Types.ObjectId;
      resumeId: mongoose.Types.ObjectId;
      status?: "pending" | "accepted" | "rejected";
      appliedAt?: string | Date;
    }
  ];
}

interface PaginationData {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export function NoticeListPage() {
  const location = useLocation();
  const searchParams = location.state || {};
  const userId = useAppSelector((state) => state.auth.user?._id);

  const [hasNotice, setNotice] = useState(true);
  const [isOpen, setOpen] = useState(false);
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageGroup, setPageGroup] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const dropMenuRef = useRef<HTMLUListElement | null>(null);
  const minusIconRef = useRef<HTMLDivElement | null>(null);

  const [filteredPosts, setFilteredPosts] = useState<PostData[]>([]);
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

  // API에서 공고 데이터 가져오기
  const fetchPosts = async (
    params = searchParams,
    page = 1,
    limit = itemsPerPage
  ) => {
    try {
      // 사용자 정보에서 스크랩 목록 가져오기
      const userResponse = await axios.get(`/api/users`, {
        params: { userId },
      });

      // 해당 ID의 공고 정보 가져오기
      let postsResponse = await Promise.all(
        userResponse.data.scraps.map((id: string) =>
          axios.get(`/api/post?postId=${id}`)
        )
      );

      postsResponse = postsResponse.map((v) => v.data);

      setTotalPages(Math.ceil(postsResponse.length / itemsPerPage));
      setTotalItems(postsResponse.length); // 추가된 부분
      setNotice(postsResponse.length > 0);

      setFilteredPosts(
        postsResponse.splice(
          itemsPerPage * page - itemsPerPage,
          itemsPerPage * page
        )
      );
      // 활성화된 필터 설정
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
      <Header>
        <div className="size-full flex justify-center items-center font-bold bg-main-color text-white relative">
          <button
            onClick={() => navigate("/mypage")}
            className="absolute top-1/2 -translate-y-1/2 left-layout"
          >
            <ArrowLeftIcon className="text-white" />
          </button>
          <span>스크랩 공고</span>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <Body>
          {hasNotice ? (
            <>
              <ListWrapper className="bg-main-bg">
                <ListScrollWrapper>
                  <div className="flex justify-between items-center pl-4 w-full h-10 my-1">
                    <div className="flex flex-row">
                      <span>총&nbsp;</span>
                      <span className="text-main-color">{totalItems} 건 </span>
                      <span>공고</span>
                    </div>
                    <div className="flex items-center justify-evenly text-[12px] w-[150px] h-[40px]">
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
                  {filteredPosts.map((notice) => (
                    <ListContainer
                      key={notice._id}
                      onClick={() =>
                        navigate(`/notice/${notice._id.toString()}`)
                      }
                    >
                      <div className="mr-2 w-20 h-20 rounded-lg border border-main-darkGray min-w-20">
                        <img
                          className="w-full h-full object-cover"
                          src={
                            notice.images?.length
                              ? notice.images[0]
                              : "/logo.png"
                          }
                          alt="공고 이미지"
                        />
                      </div>
                      <ListInfo>
                        <div className="flex flex-row justify-between w-[95%] h-[15px] text-[12px] text-main-darkGray relative">
                          <span>{notice.jobType}</span>
                          <div className="pr-7">
                            <span>마감일 </span>
                            <span>
                              {notice.deadline && notice.deadline.date
                                ? formatDate(notice.deadline.date)
                                : "상시모집"}
                            </span>
                          </div>
                          <div className="absolute -top-0.5 right-0.5">
                            <StarIcon fill="#FFD700" color="#FFD700" />
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
                스크랩한 공고가 존재하지 않습니다.
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
