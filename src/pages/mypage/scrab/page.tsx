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
import { useAppSelector } from "@/hooks/useRedux";
import axios from "axios";
import { useEffect } from "react";
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
  _id: string; // 추가: MongoDB ID도 추가
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
            scrapIds.map((id: string) => axios.get(`/api/post/${id}`))
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

  // 추가: 스크랩 취소 함수
  const handleToggleScrap = async (postId: string) => {
    if (!userId) return;

    try {
      await axios.post("/api/scrap/toggle", {
        userId,
        postId,
      });

      // 목록에서 제거
      setNoticeList((prev) => prev.filter((notice) => notice._id !== postId));

      // 공고가 없으면 hasNotice false로 설정
      if (noticeList.length <= 1) {
        setNotice(false);
      }
    } catch (error) {
      console.error("스크랩 토글 오류:", error);
    }
  };

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
        <Link to="/mypage" className="flex items-center h-full ml-2">
          <ArrowLeftIcon />
          <span className="font-bold flex justify-center w-full mr-3">
            스크랩알바
          </span>
        </Link>
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

                        {/* 수정된 부분: 스크랩 아이콘에 토글 기능 추가 */}
                        <div
                          className="absolute top-0.5 right-0.5 p-0.5 bg-white rounded-full cursor-pointer"
                          onClick={() => handleToggleScrap(notice._id)}
                        >
                          <div>
                            {/* 스크랩 페이지에서는 항상 채워진 별 */}
                            <StarIcon color="#FFD700" />{" "}
                            {/* 또는 StarIcon에 지원되는 속성 사용 */}
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

export default MypageScrabPage;
