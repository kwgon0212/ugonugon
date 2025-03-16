import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "@/hooks/useRedux";
import Header from "@/components/Header";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import Notice from "@/types/Notice";
import { Link } from "react-router-dom";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import PDFButton from "@/components/PDFButton";
import Modal from "@/components/Modal";

const CenterDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

const TabContainer = styled.div`
  display: flex;
  width: 100%;
  margin-bottom: 20px;
  border-radius: 10px;
  border: 1px solid var(--main-color);
  background-color: white;
  overflow: hidden;
`;

const TabButton = styled.button<{ isActive: boolean }>`
  flex: 1;
  padding: 12px;
  border: none;
  background-color: ${(props) => (props.isActive ? "#0B798B" : "white")};
  color: ${(props) => (props.isActive ? "white" : "#333")};
  font-weight: ${(props) => (props.isActive ? "bold" : "normal")};
  transition: all 0.3s ease;
`;

interface Attendance {
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "checked-in" | "checked-out" | "completed";
}

type TabType = "today" | "past" | "upcoming";

const WorkPage: React.FC = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const userName = useAppSelector((state) => state.auth.user?.name);
  const [workPosts, setWorkPosts] = useState<Notice[] | null>(null);
  const [attendances, setAttendances] = useState<Record<string, Attendance>>(
    {}
  );
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState(new Date());
  const [locationPermissionDenied, setLocationPermissionDenied] =
    useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("today");
  const navigate = useNavigate();

  const [isOpenPDFModal, setIsOpenPDFModal] = useState(false);
  const [PDFUrl, setPDFUrl] = useState<string | null>(null);

  // 데이터 가져오기
  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const userResponse = await axios.get(`/api/users?userId=${userId}`);
      const user = userResponse.data;

      const postIds = user.applies
        .filter((apply: any) => apply.status === "accepted")
        .map((apply: any) => apply.postId);

      try {
        const postsData = await Promise.all(
          postIds.map((postId: string) =>
            axios.get(`/api/post?postId=${postId}`).then((res) => res.data)
          )
        );
        setWorkPosts(postsData);
      } catch (error) {
        console.error("error 발생 :", error);
        setWorkPosts(null);
      }

      const attendanceData = await axios.post(`/api/attendance/check`, {
        postIds,
        userId,
      });
      setAttendances(attendanceData.data);
    };
    fetchData();
  }, [userId]);

  // 시간 업데이트
  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // 위치 권한 요청 함수
  const requestLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationPermissionDenied(false);
      },
      (err) => {
        console.error("Geolocation error", err);
        if (err.code === err.PERMISSION_DENIED) {
          setLocationPermissionDenied(true);
        }
      },
      { enableHighAccuracy: true }
    );
  };

  // 컴포넌트가 마운트될 때, 위치 권한 상태가 granted가 아니면 requestLocation() 호출
  useEffect(() => {
    if (navigator.permissions) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state !== "granted") {
            requestLocation();
          }
        });
    } else {
      // permissions API를 지원하지 않으면 기본적으로 위치 요청
      requestLocation();
    }
  }, []);

  // 위치 조회 렌더링시마다
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("Geolocation error", err),
      { enableHighAccuracy: true }
    );
  }, []);

  // 거리 계산 함수
  const getDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 출퇴근 처리 함수
  const handleAttendance = async (
    postId: string,
    type: "check-in" | "check-out"
  ) => {
    if (!userId || !location) return;
    try {
      await axios.post("/api/attendance/save", {
        userId,
        postId,
        type,
        timestamp: new Date(),
      });
      setAttendances((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          [type === "check-in" ? "checkInTime" : "checkOutTime"]:
            new Date().toISOString(),
          status: type === "check-out" ? "completed" : "checked-in",
        },
      }));
    } catch (error) {
      console.error("Attendance error", error);
    }
  };

  // 날짜에 따른 근무 포스트 필터링
  const getFilteredPosts = () => {
    if (!workPosts) return [];

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    return workPosts.filter((post) => {
      const workStartDate = new Date(post.period.start);
      const workEndDate = new Date(post.period.end);
      workStartDate.setHours(0, 0, 0, 0);
      workEndDate.setHours(0, 0, 0, 0);

      if (activeTab === "today") {
        return workStartDate.getTime() === today.getTime();
      } else if (activeTab === "past") {
        return workEndDate.getTime() < today.getTime();
      } else {
        // upcoming
        return (
          workStartDate.getTime() > today.getTime() ||
          workEndDate.getTime() > today.getTime()
        );
      }
    });
  };

  // 근무 카드 렌더링
  const renderWorkCard = (post: Notice) => {
    const workDateStart = new Date(post.period.start);
    const workDateEnd = new Date(post.period.end);
    const workStart = new Date(post.hour.start);
    const workEnd = new Date(post.hour.end);

    // 오늘 날짜인지 확인
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const isToday =
      workDateStart &&
      workDateStart.getDate() === today.getDate() &&
      workDateStart.getMonth() === today.getMonth() &&
      workDateStart.getFullYear() === today.getFullYear();

    const distance = location
      ? getDistance(
          location.lat,
          location.lng,
          post.address.lat,
          post.address.lng
        )
      : Infinity;
    const canCheckIn =
      currentTime >= new Date(workStart.getTime() - 10 * 60 * 1000) &&
      distance <= 4;
    const canCheckOut = currentTime >= workEnd && distance <= 4;
    const attendance = attendances[post._id.toString()];
    const attendanceStatus = attendance?.checkOutTime
      ? "근무 완료"
      : attendance?.checkInTime
      ? "퇴근하기"
      : "출근하기";

    const isActive =
      (attendance?.checkInTime && !attendance?.checkOutTime && canCheckOut) ||
      (!attendance?.checkInTime && canCheckIn);

    const buttonColor = isActive ? "bg-main-color" : "bg-selected-box";

    const progress = attendance?.checkInTime
      ? Math.min(
          100,
          Math.max(
            0,
            ((currentTime.getTime() - workStart.getTime()) /
              (workEnd.getTime() - workStart.getTime())) *
              100
          )
        )
      : 0;

    // 헬퍼 함수: 버튼 비활성화 시 그 이유를 반환
    const getDisabledReason = () => {
      // 퇴근인 경우 (체크인은 했으나 체크아웃은 안 함)
      if (attendance?.checkInTime && !attendance?.checkOutTime) {
        if (currentTime < workEnd) {
          return "근무 종료 시간이 되지 않았습니다.";
        }
        if (distance > 1) {
          return "근무지와의 거리가 너무 멉니다.";
        }
      }
      // 출근인 경우 (체크인하지 않은 경우)
      else if (!attendance?.checkInTime) {
        if (currentTime < new Date(workStart.getTime() - 10 * 60 * 1000)) {
          return "출근 가능 시간이 되지 않았습니다.";
        }
        if (distance > 2) {
          return "근무지와의 거리가 너무 멉니다.";
        }
      }
      return "";
    };

    return (
      <div
        key={post._id.toString()}
        className="w-full bg-white p-[20px] rounded-[10px] flex flex-col gap-[10px] mb-4 border border-main-gray"
      >
        <div>
          <h3 className="font-bold text-[18px]">{post.title}</h3>
          <div className="flex gap-[10px] text-main-darkGray text-[14px]">
            <span>{post.address.street}</span>
            <span>
              (근무지와의 거리:{" "}
              <b
                className={`font-bold ${
                  distance <= 2.5 ? "text-main-color" : "text-warn"
                }`}
              >
                {distance === Infinity ? "..." : distance.toFixed(2.5)}km
              </b>
              )
            </span>
          </div>
        </div>
        <div className="flex justify-between text-[14px]">
          <div className="flex gap-[4px]">
            <b className="text-main-color">{post.pay.type}</b>
            <span>{post.pay.value.toLocaleString()}원</span>
          </div>
          <button className="flex gap-[4px] items-center">
            <PDFButton
              onClick={() => setIsOpenPDFModal(true)}
              postId={post._id}
              userId={userId}
              PDFUrl={PDFUrl}
              setPDFUrl={setPDFUrl}
            >
              <span className="underline">근로계약서</span>
            </PDFButton>
          </button>
        </div>
        <hr className="border border-main-color/20 rounded-full" />
        <div className="flex flex-col gap-[4px]">
          <p className="font-bold">근무일자</p>
          <p className="text-main-color">
            {workDateStart.toLocaleDateString()} {isToday && "(오늘)"}{" "}
            {workStart.toLocaleTimeString()} ~ {workEnd.toLocaleTimeString()}
          </p>
        </div>
        <div className="flex items-center gap-[10px]">
          <div className="w-full h-[10px] border border-main-color rounded-full">
            <div
              className="rounded-full bg-main-color h-full"
              style={{ width: `${progress}%` }}
            />
          </div>
          <span className="flex justify-end text-main-darkGray text-[14px]">
            {progress.toFixed(1)}%
          </span>
        </div>
        {activeTab === "today" && (
          <>
            <button
              className={`w-full text-white h-[50px] rounded-[10px] ${buttonColor}`}
              onClick={() =>
                handleAttendance(
                  post._id.toString(),
                  attendance?.checkInTime && !attendance?.checkOutTime
                    ? "check-out"
                    : "check-in"
                )
              }
              disabled={!isActive}
            >
              {attendanceStatus}
            </button>
            {/* 버튼이 비활성화되어 있다면, 그 이유를 표시 */}
            {!isActive && (
              <p className="mt-2 text-xs text-red-500">{getDisabledReason()}</p>
            )}
          </>
        )}
        {activeTab === "past" && attendance?.checkOutTime && (
          <div className="w-full text-center text-main-color font-bold py-2">
            근무 완료됨
          </div>
        )}
        {activeTab === "upcoming" && (
          <div className="w-full text-center text-main-darkGray py-2">
            예정된 근무
          </div>
        )}
      </div>
    );
  };

  const filteredPosts = getFilteredPosts();

  return (
    <>
      <Header>
        <div className="size-full flex justify-center items-center bg-main-color text-white font-bold">
          근무 현황
        </div>
      </Header>

      <Main hasBottomNav={true}>
        <>
          <div className="size-full bg-white relative">
            <div className="h-full p-layout">
              {/* 탭 메뉴 */}
              <TabContainer>
                <TabButton
                  isActive={activeTab === "today"}
                  onClick={() => setActiveTab("today")}
                >
                  오늘 근무
                </TabButton>
                <TabButton
                  isActive={activeTab === "past"}
                  onClick={() => setActiveTab("past")}
                >
                  지난 근무
                </TabButton>
                <TabButton
                  isActive={activeTab === "upcoming"}
                  onClick={() => setActiveTab("upcoming")}
                >
                  예정된 근무
                </TabButton>
                <TabButton
                  isActive={false}
                  onClick={() => navigate("/work/apply")}
                >
                  지원한 공고
                </TabButton>
              </TabContainer>

              {/* 근무 목록 */}
              {workPosts && filteredPosts.length > 0 ? (
                <div className="overflow-y-auto">
                  {filteredPosts.map((post) => renderWorkCard(post))}
                </div>
              ) : (
                <CenterDiv className="text-main-darkGray">
                  <div className="text-xl">
                    <span>현재 </span>
                    <span className="text-main-color font-bold">
                      {userName}
                    </span>
                    <span>님의</span>
                  </div>
                  <div className="text-xl mb-5">
                    {activeTab === "today"
                      ? "오늘 근무가 없습니다"
                      : activeTab === "past"
                      ? "지난 근무 기록이 없습니다"
                      : "예정된 근무가 없습니다"}
                  </div>
                </CenterDiv>
              )}
            </div>
          </div>
          <Modal isOpen={isOpenPDFModal} setIsOpen={setIsOpenPDFModal}>
            <div className="size-full overflow-scroll flex flex-col items-center gap-[20px]">
              {PDFUrl ? (
                <div className="w-full h-[500px] border overflow-hidden">
                  <iframe
                    src={PDFUrl}
                    title="근로계약서"
                    className="size-full"
                  />
                </div>
              ) : (
                <>
                  <img
                    src="https://em-content.zobj.net/source/microsoft-teams/363/cyclone_1f300.png"
                    loading="lazy"
                    alt="15.0"
                    className="size-[120px]"
                  />
                  <p>잠시만 기다려주세요...</p>
                </>
              )}
            </div>
          </Modal>
        </>
      </Main>
      <BottomNav />
    </>
  );
};

export default WorkPage;
