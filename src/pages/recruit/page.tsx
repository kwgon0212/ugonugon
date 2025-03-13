import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Main from "../../components/Main";
import BottomNav from "../../components/BottomNav";
import ArrowRightIcon from "../../components/icons/ArrowRight";
import ResumeIcon from "../../components/icons/Resume";
import WalletIcon from "../../components/icons/Wallet";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import ArrowUpIcon from "@/components/icons/ArrowUp";
import ReCruitPageFail from "./ReCruitPageFail";
import { useAppSelector } from "@/hooks/useRedux";

// 타입 정의
interface Post {
  _id: string;
  title: string;
  address?: {
    zipcode?: string;
    street: string;
    detail?: string;
  };
  pay: {
    type: string;
    value: number;
  };
  hour?: {
    start: string;
    end: string;
  };
  period?: {
    start: string;
    end: string;
    discussion?: boolean;
  };
  day?: string[];
  applies?: Array<{
    userId: string;
    status: "pending" | "accepted" | "rejected";
    resumeId: string;
    postId: string;
    appliedAt: string;
  }>;
}

// 업데이트된 Attendance 인터페이스 (새 스키마에 맞춤)
interface Attendance {
  _id: string;
  userId: string;
  postId: string;
  checkInTime?: string;
  checkOutTime?: string;
  status: "checked-in" | "checked-out" | "completed";
  createdAt: string;
}

// AttendanceMap 인터페이스 (새 API 응답 형식)
interface AttendanceMap {
  [postId: string]: Attendance;
}

interface User {
  _id: string;
  name: string;
  birthDate?: string;
  sex?: "male" | "female";
  phone: string;
  profileImage?: string;
  profile?: string;
  residentId?: string;
  email?: string;
  address?: any;
  bankAccount?: any;
}

interface WorkerWithAttendance {
  user: User;
  attendance?: Attendance | null;
  post: Post;
  hasAttendance: boolean; // 출근 기록이 있는지 여부
}

interface WorkerGroup {
  post: Post;
  workers: WorkerWithAttendance[];
  isExpanded: boolean;
}

interface RootState {
  auth: {
    user: {
      _id: string;
    } | null;
  };
}

// 디버깅용 상태 - 타입 정의
interface DebugState {
  postsResponse?: any;
  error?: any;
  userResponses?: any;
  attendanceResponses?: any;
  [key: string]: any;
}

// 날짜 포맷팅 함수
const formatDate = (dateString?: string): string => {
  try {
    if (!dateString) return "날짜 정보 없음";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "날짜 정보 없음";

    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekDay = weekDays[date.getDay()];

    return `${year}년 ${month}월 ${day}일 ${weekDay}요일`;
  } catch (error) {
    console.error("날짜 포맷팅 오류:", error);
    return "날짜 정보 없음";
  }
};

// 시간 포맷팅 함수
const formatTime = (dateString?: string): string => {
  try {
    if (!dateString) return "시간 정보 없음";

    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "시간 정보 없음";

    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
  } catch (error) {
    console.error("시간 포맷팅 오류:", error);
    return "시간 정보 없음";
  }
};

// 근무일자 포맷팅 함수 (공고 데이터 사용)
const formatWorkDate = (post: Post): string => {
  try {
    // 오늘 날짜 기준으로 표시 (출근 데이터가 없는 경우)
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, "0");
    const day = String(today.getDate()).padStart(2, "0");

    const weekDays = ["일", "월", "화", "수", "목", "금", "토"];
    const weekDay = weekDays[today.getDay()];

    let dateStr = `${year}년 ${month}월 ${day}일 ${weekDay}요일`;

    // 시간 정보가 있으면 추가
    if (post.hour?.start && post.hour?.end) {
      dateStr += ` ${formatTime(post.hour.start)}-${formatTime(post.hour.end)}`;
    }

    return dateStr;
  } catch (error) {
    console.error("근무일자 포맷팅 오류:", error);
    return "근무일자 정보 없음";
  }
};

// 생년월일 포맷팅 함수 (YY.MM.DD 형식)
const formatBirthDate = (dateString?: string, residentId?: string): string => {
  if (!dateString && !residentId) return "";

  try {
    if (dateString) {
      // dateString으로 포맷팅
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        // 이미 포맷팅된 경우 그대로 반환
        if (dateString.includes(".")) return dateString;
        return "";
      }

      const year = date.getFullYear().toString().slice(-2);
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      return `${year}.${month}.${day}`;
    } else if (residentId) {
      // residentId에서 생년월일 추출 (YYMMDD 형식 가정)
      const birthPart = residentId.substring(0, 6);
      if (birthPart.length === 6) {
        return `${birthPart.substring(0, 2)}.${birthPart.substring(
          2,
          4
        )}.${birthPart.substring(4, 6)}`;
      }
    }

    return "";
  } catch (error) {
    console.error("생년월일 포맷팅 오류:", error);
    return "";
  }
};

// 성별 표시 함수
const getGenderDisplay = (user: User): string => {
  if (user.sex === "male") return "(남)";
  if (user.sex === "female") return "(여)";

  // sex 필드가 없는 경우 residentId에서 성별 추출 시도
  if (user.residentId && user.residentId.length >= 8) {
    // 주민번호 7번째 자리로 성별 추정 (1,3 = 남자, 2,4 = 여자)
    const genderDigit = user.residentId.charAt(6);
    if (genderDigit === "1" || genderDigit === "3") return "(남)";
    if (genderDigit === "2" || genderDigit === "4") return "(여)";
  }

  return ""; // 성별 정보를 찾을 수 없는 경우
};

// 프로필 이미지 URL 가져오기
const getProfileImageUrl = (user: User): string | undefined => {
  // profileImage가 있으면 그걸 먼저 사용
  if (user.profileImage) {
    return user.profileImage;
  }

  // profile 필드에 이미지가 있을 수 있음
  if (user.profile) {
    // 이미 URL 형태면 그대로 반환
    if (
      typeof user.profile === "string" &&
      (user.profile.startsWith("http") || user.profile.startsWith("data:image"))
    ) {
      return user.profile;
    }

    // 다른 형태일 경우 로깅
    console.log(
      "[DEBUG] Profile 필드 형식:",
      typeof user.profile,
      user.profile
    );

    // 문자열 변환 시도
    if (user.profile && typeof user.profile.toString === "function") {
      const profileStr = user.profile.toString();
      if (
        profileStr.startsWith("http") ||
        profileStr.startsWith("data:image")
      ) {
        return profileStr;
      }
    }
  }

  return undefined;
};
type ApplyType = {
  userId: string;
  status: string;
  resumeId: string;
  postId: string;
  appliedAt: string;
};
// 기본 사용자 정보 생성 함수
const createDefaultUser = (userId: string): User => ({
  _id: userId,
  name: "이름 정보 없음",
  phone: "연락처 정보 없음",
});

const ReCruitPage: React.FC = () => {
  const [workerGroups, setWorkerGroups] = useState<WorkerGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<DebugState | null>(null);

  // Redux에서 로그인한 사용자 정보 가져오기
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!user || !user._id) {
        setError("로그인이 필요한 서비스입니다.");
        setLoading(false);
        return;
      }

      try {
        console.log("[DEBUG] 사용자 ID:", user._id);

        // 1. 사용자가 등록한 공고 목록 불러오기
        console.log(
          `[DEBUG] 공고 목록 요청: /api/post/recruit/manage/${user._id}`
        );
        const postsResponse = await axios.get(
          `/api/post/recruit/manage/${user._id}`
        );
        console.log("[DEBUG] 공고 데이터 응답:", postsResponse.data);

        const myPosts = postsResponse.data.posts || [];

        // 디버깅용 - 공고 API 응답 저장
        setDebug((prev: DebugState | null) => ({
          ...(prev || {}),
          postsResponse: postsResponse.data,
        }));

        if (!myPosts || myPosts.length === 0) {
          console.log("[DEBUG] 등록된 공고가 없습니다.");
          setLoading(false);
          return;
        }

        const workerGroupsData: WorkerGroup[] = [];
        const userResponses: Record<string, any> = {};
        const attendanceResponses: Record<string, any> = {};

        // 2. 각 공고별로 처리
        for (const post of myPosts) {
          console.log(`[DEBUG] 공고 처리: ${post._id} - ${post.title}`);
          console.log("[DEBUG] 공고 근무 정보:", {
            hour: post.hour,
            period: post.period,
            day: post.day,
          });

          // Post 스키마를 건드리지 않고 인라인 타입으로 문제 해결하기

          // 1. acceptedApplies 필터 부분 수정
          const acceptedApplies =
            post.applies?.filter(
              (apply: ApplyType) => apply.status === "accepted"
            ) || [];

          const workersData: WorkerWithAttendance[] = [];

          if (acceptedApplies.length === 0) {
            // 채택된 지원자가 없는 경우 빈 배열 추가하고 다음 공고로
            workerGroupsData.push({
              post: post,
              workers: [],
              isExpanded: false,
            });
            continue;
          }

          // 2. map 함수에서도 apply 매개변수에 타입을 명시
          const userIds = acceptedApplies.map(
            (apply: ApplyType) => apply.userId
          );

          // 3-0. 먼저 출석 정보를 일괄적으로 가져오기 (새 API 사용)
          const postIds = [post._id];
          console.log("[DEBUG] 공고 ID 배열:", postIds);

          // 새 API로 출석 정보 조회
          console.log(`[DEBUG] 출석 정보 요청 (새 API): /api/attendance/check`);
          let attendanceMapByUser: Record<string, AttendanceMap> = {};

          try {
            // 각 사용자별로 출석 정보 요청
            for (const userId of userIds) {
              const attendanceResponse = await axios.post(
                `/api/attendance/check`,
                {
                  userId,
                  postIds,
                }
              );
              console.log(
                `[DEBUG] 출석 데이터 응답 (사용자 ${userId}):`,
                attendanceResponse.data
              );
              attendanceMapByUser[userId] = attendanceResponse.data;
              attendanceResponses[userId] = attendanceResponse.data;
            }
          } catch (err) {
            console.error("[ERROR] 출석 정보 요청 실패:", err);
            // 오류 발생 시에도 계속 진행
          }

          // 3. 각 지원자에 대해 사용자 정보 불러오기
          for (const apply of acceptedApplies as ApplyType[]) {
            try {
              // 3-1. 사용자 정보 불러오기
              const userId = apply.userId.toString();
              console.log(
                `[DEBUG] 사용자 정보 요청: /api/users?userId=${userId}`
              );

              const userResponse = await axios.get(`/api/users`, {
                params: { userId },
              });

              console.log(`[DEBUG] 사용자 데이터 응답:`, userResponse.data);
              userResponses[userId] = userResponse.data;

              const userData: User =
                userResponse.data || createDefaultUser(userId);

              // 프로필 이미지 디버깅
              console.log(`[DEBUG] 사용자 프로필 필드:`, {
                profileImage: userData.profileImage,
                profile: userData.profile,
              });

              // 3-2. 이미 가져온 출석 정보 사용
              const attendanceData =
                attendanceMapByUser[userId]?.[post._id] || null;
              const hasAttendance = !!attendanceData;

              // 디버깅: 출석 상태 로그
              if (hasAttendance) {
                console.log("[DEBUG] 출석 상태:", attendanceData.status);
                console.log("[DEBUG] 출/퇴근 시간:", {
                  checkInTime: attendanceData.checkInTime,
                  checkOutTime: attendanceData.checkOutTime,
                });
              } else {
                console.log("[DEBUG] 출석 기록 없음");
              }

              // 근로자 정보 추가
              workersData.push({
                user: userData,
                attendance: attendanceData, // 출석 정보가 없으면 null
                post: post,
                hasAttendance: hasAttendance,
              });

              console.log(
                `[DEBUG] 근로자 정보 추가 완료: ${userData.name || "이름 없음"}`
              );
            } catch (err) {
              console.error(
                `[ERROR] 근로자 정보 불러오기 실패: ${apply.userId}`,
                err
              );

              // 오류가 발생해도 기본 정보로 추가
              const userId = apply.userId.toString();
              workersData.push({
                user: createDefaultUser(userId),
                attendance: null, // 출석 정보 없음
                post: post,
                hasAttendance: false,
              });
            }
          }

          // 근로자 목록이 비어있어도 공고 그룹 추가
          workerGroupsData.push({
            post: post,
            workers: workersData,
            isExpanded: false,
          });

          console.log(
            `[DEBUG] 공고 ${post._id} 처리 완료, 근로자 수: ${workersData.length}`
          );
        }

        // 디버깅용 - API 응답 데이터 저장
        setDebug((prev: DebugState | null) => ({
          ...(prev || {}),
          userResponses,
          attendanceResponses,
          workerGroups: workerGroupsData,
        }));

        console.log("[DEBUG] 최종 근로자 그룹 데이터:", workerGroupsData);
        setWorkerGroups(workerGroupsData);
        setLoading(false);
      } catch (err) {
        console.error("[ERROR] 근로자 데이터 로딩 실패:", err);
        setError("데이터를 불러오는데 실패했습니다.");
        setDebug((prev: DebugState | null) => ({
          ...(prev || {}),
          error: err,
        }));
        setLoading(false);
      }
    };

    fetchWorkerData();
  }, [user]);

  // 그룹 펼치기/접기 토글 함수
  const handleToggleExpand = (
    index: number,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    console.log("[DEBUG] 그룹 펼치기 토글:", index);

    setWorkerGroups((prevGroups) => {
      const newGroups = [...prevGroups];
      newGroups[index] = {
        ...newGroups[index],
        isExpanded: !newGroups[index].isExpanded,
      };
      return newGroups;
    });
  };

  // 정산 버튼 클릭 핸들러
  const handleSettlement = (
    worker: WorkerWithAttendance,
    e: React.MouseEvent<HTMLButtonElement>
  ) => {
    e.stopPropagation(); // 이벤트 버블링 방지
    console.log("[DEBUG] 정산 처리:", worker);
    alert(`${worker.user.name} 근로자 정산을 진행합니다.`);
  };

  return (
    <>
      {/* 헤더 영역 */}
      <Header>
        <p className="flex justify-center items-center h-full font-bold text-lg">
          고용 현황
        </p>
      </Header>

      {/* 메인 콘텐츠 */}
      <Main hasBottomNav={true}>
        <div className="size-full bg-white">
          <div className="p-4 space-y-4 h-full rounded-t-[30px] bg-main-bg">
            {/* 상단 제목 */}
            <h2 className="text-[18px] font-bold">나의 근로자 관리</h2>

            {loading ? (
              <div className="flex justify-center items-center h-40">
                <p>근로자 정보를 불러오는 중...</p>
              </div>
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
              </div>
            ) : workerGroups.length === 0 ? (
              <ReCruitPageFail />
            ) : (
              /* 근로자 그룹 목록 */
              <div className="space-y-4">
                {workerGroups.map((group, groupIndex) => (
                  <div
                    key={group.post._id}
                    className="bg-white rounded-lg shadow-md"
                  >
                    {/* 공고 정보 및 펼치기 헤더 */}
                    <div className="p-4">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[16px] font-semibold">
                          {group.post.title || "제목 없음"}
                        </h3>
                        <button
                          onClick={(e) => handleToggleExpand(groupIndex, e)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                        >
                          {group.isExpanded ? (
                            <ArrowUpIcon />
                          ) : (
                            <ArrowDownIcon />
                          )}
                        </button>
                      </div>
                      <p className="text-[12px]">
                        {group.post.address?.street || "주소 정보 없음"}{" "}
                        {group.post.address?.detail || ""}
                      </p>
                      <p className="text-[12px]">
                        <span className="text-main-color font-bold">
                          {group.post.pay?.type || "급여 유형 없음"}
                        </span>{" "}
                        {group.post.pay?.value
                          ? group.post.pay.value.toLocaleString()
                          : "0"}
                        원
                      </p>

                      {/* 근로자 수 표시 */}
                      <div className="mt-2 text-[12px] text-main-darkGray">
                        {group.workers.length > 0 ? (
                          <>
                            총 근로자 {group.workers.length}명
                            {!group.isExpanded && group.workers.length > 0 && (
                              <span>
                                {" "}
                                · {group.workers[0].user.name ||
                                  "이름 없음"}{" "}
                                {getGenderDisplay(group.workers[0].user)}{" "}
                                {group.workers.length > 1
                                  ? `외 ${group.workers.length - 1}명`
                                  : ""}
                              </span>
                            )}
                          </>
                        ) : (
                          <span>근로자 없음</span>
                        )}
                      </div>
                    </div>

                    {/* 펼쳐진 상태일 때 근로자 목록 표시 */}
                    {group.isExpanded && (
                      <div className="border-t border-gray-200 pt-2">
                        {group.workers.length > 0 ? (
                          group.workers.map((worker) => (
                            <div
                              key={worker.user._id}
                              className="p-4 border-b border-gray-100 last:border-b-0"
                            >
                              {/* 근무일자 */}
                              <h4 className="text-[14px] font-semibold">
                                근무일자
                              </h4>
                              <p className="text-[14px] text-main-color font-semibold">
                                {worker.attendance?.checkInTime
                                  ? // 출석 정보가 있으면 그 날짜 사용
                                    `${formatDate(
                                      worker.attendance.checkInTime
                                    )} ${formatTime(
                                      worker.post.hour?.start || ""
                                    )}-${formatTime(
                                      worker.post.hour?.end || ""
                                    )}`
                                  : // 출석 정보가 없으면 공고 정보에서 가져옴
                                    formatWorkDate(worker.post)}
                              </p>

                              <hr className="my-2 border-main-color/30" />

                              {/* 근로자 정보 */}
                              <h4 className="text-[14px] font-semibold">
                                근로자 정보
                              </h4>
                              <div className="flex items-center space-x-4 mt-2">
                                {/* 근로자 사진 */}
                                <div className="w-[80px] h-[80px] bg-main-gray rounded-[10px] overflow-hidden">
                                  {getProfileImageUrl(worker.user) ? (
                                    <img
                                      src={getProfileImageUrl(worker.user)}
                                      alt={worker.user.name}
                                      className="w-full h-full object-cover rounded-[10px]"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center text-main-darkGray text-sm">
                                      No Photo
                                    </div>
                                  )}
                                </div>

                                {/* 근로자 정보 텍스트 */}
                                <div>
                                  <p className="flex gap-[6px] text-[14px] font-semibold">
                                    {worker.user.name || "이름 정보 없음"}{" "}
                                    {getGenderDisplay(worker.user)}
                                    <span className="text-main-darkGray font-medium ml-1">
                                      {formatBirthDate(
                                        worker.user.birthDate,
                                        worker.user.residentId
                                      )}
                                    </span>
                                  </p>
                                  <p className="font-semibold">
                                    {worker.user.phone || "연락처 정보 없음"}
                                  </p>
                                  <p className="flex gap-[7px] text-[14px]">
                                    출근
                                    <span
                                      className={
                                        worker.hasAttendance &&
                                        worker.attendance?.checkInTime
                                          ? "text-main-color"
                                          : "text-main-darkGray"
                                      }
                                    >
                                      {worker.hasAttendance &&
                                      worker.attendance?.checkInTime
                                        ? "완료"
                                        : "미완료"}
                                    </span>
                                  </p>
                                  <p className="flex gap-[7px] text-[14px]">
                                    퇴근
                                    <span
                                      className={
                                        worker.hasAttendance &&
                                        worker.attendance?.checkOutTime
                                          ? "text-main-color"
                                          : "text-main-darkGray"
                                      }
                                    >
                                      {worker.hasAttendance &&
                                      worker.attendance?.checkOutTime
                                        ? "완료"
                                        : "미완료"}
                                    </span>
                                  </p>
                                </div>
                              </div>

                              {/* 정산하기 버튼 */}
                              <button
                                onClick={(e) => handleSettlement(worker, e)}
                                className={`mt-4 w-full font-semibold text-[14px] py-2 rounded-[10px] text-white ${
                                  worker.hasAttendance &&
                                  worker.attendance?.status === "completed"
                                    ? "bg-main-color"
                                    : "bg-selected-box"
                                }`}
                                disabled={
                                  !worker.hasAttendance ||
                                  worker.attendance?.status !== "completed"
                                }
                              >
                                정산하기
                              </button>
                            </div>
                          ))
                        ) : (
                          <div className="p-4 text-center text-main-darkGray">
                            이 공고에 등록된 근로자가 없습니다.
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/*  수정된 목차: 흰 배경 유지, 아이콘을 오른쪽으로 정렬 */}
            <div className="mt-6 space-y-3">
              <Link to="/recruit/manage">
                <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer">
                  <span className="text-gray-800 font-medium flex gap-[5px] items-center">
                    <span>
                      <ResumeIcon color="#717171" />
                    </span>{" "}
                    등록한 공고 관리
                  </span>
                  <div className="w-5 h-5 text-gray-700">
                    <ArrowRightIcon color="#717171" />
                  </div>
                </div>
              </Link>
              <div className="bg-white p-4 rounded-lg shadow-md flex justify-between items-center cursor-pointer">
                <span className="text-gray-800 font-medium flex items-center gap-[5px]">
                  <span>
                    <WalletIcon color="#717171" />
                  </span>
                  내 출금계좌 관리
                </span>
                <div className="w-5 h-5 text-gray-700">
                  <ArrowRightIcon color="#717171" />
                </div>
              </div>
            </div>
          </div>
        </div>
      </Main>

      {/* 바텀 네비게이션 */}
      <BottomNav />
    </>
  );
};

export default ReCruitPage;
