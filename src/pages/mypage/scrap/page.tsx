import React, { useState, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import styled from "styled-components";

import Header from "../../../components/Header";
import Main from "../../../components/Main";
import BottomNav from "../../../components/BottomNav";

import MinusIcon from "@/components/icons/Minus";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import CancelIcon from "@/components/icons/Cancel";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import StarIcon from "@/components/icons/Star";
import { useAppSelector } from "@/hooks/useRedux";
import axios from "axios";
import { useEffect } from "react";
import Notice from "@/types/Notice";
const Body = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  padding: 20px;
`;

const ListWrapper = styled.div`
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 100%;
  background-color: white;
`;
const ListScrollWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100%;
  height: 93%;
  overflow-y: auto;
  background-color: white;
  scrollbar-width: none;
`;

const ListContainer = styled.div`
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100px;
  padding: 10px;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid var(--main-gray);
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
  right: 0px;
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
  _id: string; // 추가: MongoDB ID도 추가
  companyName: string;
  endDate: string;
  day: string;
  title: string;
  address: string;
  pay: number;
  period: string;
  images: string[];
}

export function MypageScrabPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const [hasNotice, setNotice] = useState(true);
  const [isOpen, setOpen] = useState(false); // 드롭다운 메뉴 열림 상태
  const [itemsPerPage, setItemsPerPage] = useState(5); // 드롭다운에서 선택한 아이템 수
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지 번호
  const [pageGroup, setPageGroup] = useState(0); // 현재 보이는 페이지 그룹(0부터 시작)
  // 추가: 로딩 상태
  const [isLoading, setIsLoading] = useState(true);

  // 추가: Redux에서 사용자 ID 가져오기
  const userId = useAppSelector((state) => state.auth.user?._id);

  // 추가: 스크랩 목록을 저장할 상태
  const [noticeList, setNoticeList] = useState<GetNoticeInfo[]>([]);

  const dropMenuRef = useRef<HTMLUListElement | null>(null);
  const minusIconRef = useRef<HTMLDivElement | null>(null);

  // 추가: 스크랩한 공고 목록 가져오기
  useEffect(() => {
    const fetchScrapedNotices = async () => {
      if (!userId) {
        setIsLoading(false);
        setNotice(false);
        return;
      }

      setIsLoading(true);
      try {
        // 사용자 정보에서 스크랩 목록 가져오기
        const userResponse = await axios.get(`/api/users`, {
          params: { userId },
        });

        if (
          userResponse.data &&
          userResponse.data.scraps &&
          userResponse.data.scraps.length > 0
        ) {
          // 스크랩 ID 목록
          const scrapIds = userResponse.data.scraps;

          // 해당 ID의 공고 정보 가져오기
          const postsResponse = await Promise.all(
            scrapIds.map((id: string) => axios.get(`/api/post?postId=${id}`))
          );

          // 공고 데이터를 GetNoticeInfo 형식으로 변환
          const scrapedNotices = postsResponse.map((response, index) => {
            const post = response.data;
            return {
              id: index,
              _id: post._id,
              companyName: post.author || "회사명", // 실제 데이터 구조에 맞게 수정 필요
              endDate: post.deadline?.date
                ? formatDate(post.deadline.date)
                : "",
              day: post.day && post.day[0] ? post.day[0] : "",
              title: post.title || "",
              address: post.address?.street || "",
              pay: post.pay?.value || 0,
              period: formatPeriod(post.period?.start, post.period?.end),
              images: post.images || [],
            };
          });

          setNoticeList(scrapedNotices);
          setNotice(scrapedNotices.length > 0);
        } else {
          setNoticeList([]);
          setNotice(false);
        }
      } catch (error) {
        console.error("스크랩 공고 조회 오류:", error);
        setNotice(false);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScrapedNotices();
  }, [userId]);

  // 추가: 날짜 포맷팅 함수
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.getMonth() + 1}/${date.getDate()}`;
  };

  // 추가: 근무기간 포맷팅 함수
  const formatPeriod = (start?: string, end?: string) => {
    if (!start || !end) return "기간 정보 없음";

    const startDate = new Date(start);
    const endDate = new Date(end);

    const diffTime = Math.abs(endDate.getTime() - startDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays <= 7) return "1주일";
    if (diffDays <= 30) return "1주일 ~ 1개월";
    if (diffDays <= 90) return "1개월 ~ 3개월";
    if (diffDays <= 180) return "3개월 ~ 6개월";
    return "6개월 이상";
  };
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
          {/* 추가: 로딩 중 표시 */}
          {isLoading ? (
            <div className="flex justify-center items-center h-full">
              로딩 중...
            </div>
          ) : hasNotice ? (
            <>
              <ListWrapper className="bg-white">
                <ListScrollWrapper>
                  <div className="flex flex-row justify-between items-center w-full mb-layout">
                    <span>
                      총{" "}
                      <b className="text-main-color font-bold">
                        {noticeList.length}건
                      </b>
                    </span>
                    <div className="flex flex-row items-center text-sm gap-[4px]">
                      <span>필터</span>
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
                  {currentNotices.map((notice) => (
                    <ListContainer key={notice.id}>
                      {/* 공고 카드 전체를 클릭하면 상세 페이지로 이동 */}
                      <div
                        className="flex w-full cursor-pointer"
                        onClick={() => navigate(`/notice/${notice._id}`)} // 상세 페이지로 이동
                      >
                        <div className="mr-2 w-[80px] h-[80px] rounded-[10px] bg-main-darkGray relative">
                          {notice.images && notice.images.length > 0 ? (
                            <img
                              src={notice.images[0]}
                              alt="공고 이미지"
                              className="w-full h-full object-cover border border-main-gray rounded-[10px]"
                            />
                          ) : (
                            <div className="w-full h-full object-cover border border-main-gray rounded-[10px]" />
                          )}

                          {/* 스크랩 아이콘 - 이제 클릭해도 상세 페이지로 이동됨 */}
                          <div className="absolute top-0.5 right-0.5 p-0.5 bg-white rounded-full">
                            <div>
                              <StarIcon fill="#FFD700" color="#FFD700" />
                            </div>
                          </div>
                        </div>

                        <ListInfo>
                          <div className="flex flex-row justify-between w-full text-[12px] text-main-darkGray">
                            <span>{notice.companyName}</span>
                            <div>
                              <span>
                                ~ {notice.endDate}({notice.day})
                              </span>
                            </div>
                          </div>
                          <div className="w-[95%] text-[12px] font-bold flex-wrap">
                            {notice.title}
                          </div>
                          <div className="w-[95%] text-[12px] flex flex-row flex-nowrap gap-3">
                            <div>{notice.address}</div>
                            <div>
                              <span className="font-bold text-main-color">
                                시급{" "}
                              </span>
                              <span>{notice.pay.toLocaleString()} 원</span>
                            </div>
                            <div>{notice.period}</div>
                          </div>
                        </ListInfo>
                      </div>
                    </ListContainer>
                  ))}
                </ListScrollWrapper>

                {/* 페이지 번호 버튼과 좌우 화살표 */}
                <Numbernav>
                  <div className="flex flex-row w-[50%] justify-center gap-3">
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
                          color:
                            currentPage === page
                              ? "var(--main-color)"
                              : "var(--main-darkGray)",
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
