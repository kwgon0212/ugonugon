import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Header from "../../components/Header";
import Main from "../../components/Main";
import BottomNav from "../../components/BottomNav";
import ArrowRightIcon from "../../components/icons/ArrowRight";
import ResumeIcon from "../../components/icons/Resume";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import ArrowUpIcon from "@/components/icons/ArrowUp";
import ReCruitPageFail from "./ReCruitPageFail";
import { useAppSelector } from "@/hooks/useRedux";
import AddIcon from "@/components/icons/Plus";
import Loading from "@/loading/page";
import ProfileIcon from "@/components/icons/Profile";
import getUser, { type User } from "@/hooks/fetchUser";
import getResume, { Resume } from "@/hooks/fetchResume";
import postBank from "@/hooks/fetchBank";

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
  status: "checked-in" | "checked-out" | "completed" | "paid";
  createdAt: string;
}

// AttendanceMap 인터페이스 (새 API 응답 형식)
interface AttendanceMap {
  [postId: string]: Attendance;
}

interface WorkerWithAttendance {
  resume: Resume;
  user: User;
  attendance?: Attendance | null;
  post: Post;
  hasAttendance: boolean; // 출근 기록이 있는지 여부
  totalPay?: number;
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
  resumeResponses?: any;
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
const getGenderDisplay = (resume: Resume): string => {
  if (resume.sex === "male") return "(남)";
  if (resume.sex === "female") return "(여)";

  // sex 필드가 없는 경우 residentId에서 성별 추출 시도
  if (resume.residentId && resume.residentId.length >= 7) {
    // 주민번호 7번째 자리로 성별 추정 (1,3 = 남자, 2,4 = 여자)
    const genderDigit = resume.residentId.charAt(6);
    if (genderDigit === "1" || genderDigit === "3") return "(남)";
    if (genderDigit === "2" || genderDigit === "4") return "(여)";
  }

  return ""; // 성별 정보를 찾을 수 없는 경우
};

// 프로필 이미지 URL 가져오기
const getProfileImageUrl = (resume: Resume, user: User): string | undefined => {
  // profileImage가 있으면 그걸 먼저 사용
  if (resume.profile) {
    return resume.profile;
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

const ReCruitPage: React.FC = () => {
  const [workerGroups, setWorkerGroups] = useState<WorkerGroup[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [debug, setDebug] = useState<DebugState | null>(null);
  const [payModal, setPayModal] = useState(false);
  const [Acno, setAcno] = useState("");
  const [Tram, setTram] = useState("");
  const [reload, setReload] = useState(true);
  const navigate = useNavigate();

  function countSpecificWeekdays(
    startDate: string,
    endDate: string,
    stringDays: string[]
  ): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = { 일: 0, 월: 1, 화: 2, 수: 3, 목: 4, 금: 5, 토: 6 };
    const targetDays = stringDays.map((v) => days[v as keyof typeof days]);
    let counts: { [key: string]: number } = {};

    // 타겟 요일(0: 일요일 ~ 6: 토요일) 개수 초기화
    targetDays.forEach((day) => (counts[day] = 0));

    // 날짜 반복하면서 체크
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      if (targetDays.includes(d.getDay())) {
        counts[d.getDay()]++;
      }
    }
    return Object.values(counts).reduce((p, c) => p + c, 0);
  }
  function getWeeksBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return Math.ceil(
      (end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24 * 7)
    );
  }

  function getMonthsBetween(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);

    return (
      (end.getFullYear() - start.getFullYear()) * 12 +
      (end.getMonth() - start.getMonth())
    );
  }

  // Redux에서 로그인한 사용자 정보 가져오기
  const user = useAppSelector((state: RootState) => state.auth.user);

  useEffect(() => {
    const fetchWorkerData = async () => {
      if (!user || !user._id) {
        setError("로그인이 필요한 서비스입니다.");
        setLoading(false);
        return;
      } else {
        setLoading(true);
        setError(null);
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
        const resumeResponses: Record<string, any> = {};
        const UserResponses: Record<string, any> = {};
        const attendanceResponses: Record<string, any> = {};

        // 2. 각 공고별로 처리
        for (const post of myPosts) {
          console.log(`[DEBUG] 공고 처리: ${post._id} - ${post.title}`);
          console.log("[DEBUG] 공고 근무 정보:", {
            hour: post.hour,
            period: post.period,
            day: post.day,
          });

          const workDays = countSpecificWeekdays(
            post.period.start,
            post.period.end,
            post.day
          );

          const workTime =
            (new Date(post.hour.end).getTime() -
              new Date(post.hour.start).getTime() -
              new Date(post.restTime.end).getTime() +
              new Date(post.restTime.start).getTime()) /
            (60 * 60 * 1000);
          let totalPay = 0;

          if (post.pay.type === "시급")
            totalPay += post.pay.value * workDays * workTime;
          else if (post.pay.type === "일급")
            totalPay += post.pay.value * workDays;
          else if (post.pay.type === "주급")
            totalPay +=
              post.pay.value *
              getWeeksBetween(post.period.start, post.period.end);
          else if (post.pay.type === "월급")
            totalPay +=
              post.pay.value *
              getMonthsBetween(post.period.start, post.period.end);
          else if (post.pay.type === "총 급여") totalPay += post.pay.value;

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
              const resumeId = apply.resumeId.toString();
              const userId = apply.userId.toString();
              console.log(
                `[DEBUG] 사용자 정보 요청: /api/users?resumeId=${resumeId}`
              );

              const resumeResponse = await getResume(resumeId);
              const UserResponse = await getUser(userId);

              console.log(`[DEBUG] 사용자 데이터 응답:`, resumeResponse);
              resumeResponses[resumeId] = resumeResponse;
              UserResponses[userId] = UserResponse;

              // 프로필 이미지 디버깅
              console.log(`[DEBUG] 사용자 프로필 필드:`, {
                // profileImage: userData.profileImage,
                profile: resumeResponse.profile,
              });

              // 3-2. 이미 가져온 출석 정보 사용
              const attendanceData =
                attendanceMapByUser[resumeResponse.userId]?.[post._id] || null;
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
                resume: resumeResponse,
                user: UserResponse,
                attendance: attendanceData, // 출석 정보가 없으면 null
                post: post,
                hasAttendance: hasAttendance,
                totalPay: totalPay,
              });

              console.log(
                `[DEBUG] 근로자 정보 추가 완료: ${
                  resumeResponse.name || "이름 없음"
                }`
              );
            } catch (err) {
              console.error(
                `[ERROR] 근로자 정보 불러오기 실패: ${apply.resumeId}`,
                err
              );

              // 오류가 발생해도 기본 정보로 추가
              // const userId = apply.userId.toString();
              // workersData.push({
              //   user: createDefaultUser(userId),
              //   attendance: null, // 출석 정보 없음
              //   post: post,
              //   hasAttendance: false,
              // });
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
          resumeResponses,
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
  }, [user, reload]);

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
    setPayModal(!payModal);
    e.stopPropagation(); // 이벤트 버블링 방지
    setAcno(worker.user.bankAccount.account);
    setTram(worker.totalPay?.toLocaleString() as string);
  };

  const hanldePayment = async (userId: string, postId: string) => {
    try {
      console.log(
        "userId, postIduserId, postIduserId, postIduserId, postIduserId, postIduserId, postId"
      );
      console.log(userId, postId);

      await axios.post("/api/attendance/pay", {
        userId,
        postId,
      });
    } catch (error) {
      console.error("Attendance error", error);
    }

    const res = await postBank("ReceivedTransferAccountNumber", {
      Bncd: "011",
      Acno,
      Tram: Tram.replace(/,/g, ""),
      DractOtlt: "페이러너 임금 지불",
      MractOtlt: "페이러너 임금 지급",
    });
    if (res) setPayModal(!payModal);
    setReload(!reload);
    // const res = await postBank("DrawingTransfer", {
    //   Bncd: "011",
    //   FinAcno: true,
    //   Tram: Tram.replace(/,/g, ""),
    //   DractOtlt: "페이러너 임금 지불",
    //   MractOtlt: "페이러너 임금 지급",
    // });
    // if (res) setPayModal(!payModal);
    // setReload(!reload);
  };

  return (
    <>
      {/* 헤더 영역 */}
      <Header>
        <div className="size-full flex justify-center items-center font-bold bg-main-color text-white">
          <span>고용 현황</span>
        </div>
      </Header>

      {/* 메인 콘텐츠 */}
      <Main hasBottomNav={true}>
        <div className="size-full bg-white">
          <div className="size-full bg-white">
            {loading ? (
              <Loading />
            ) : error ? (
              <div className="flex justify-center items-center h-40">
                <p className="text-red-500">{error}</p>
              </div>
            ) : workerGroups.length === 0 ? (
              <ReCruitPageFail />
            ) : (
              /* 공고 등록하기 */
              <>
                <div className="bg-main-color rounded-b-[10px] flex justify-center items-center p-[20px] pt-0">
                  <div
                    className="size-full bg-white rounded-[10px]"
                    onClick={() => navigate("/notice/add")}
                  >
                    <div className=" bg-selected-box rounded-[10px] flex-1 h-[100px] border-2 border-main-color cursor-pointer">
                      <div className="flex flex-col justify-center h-full items-center">
                        <AddIcon />
                        <p className="text-main-color text-[12px]">
                          새 공고 등록하기
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/*  수정된 목차: 흰 배경 유지, 아이콘을 오른쪽으로 정렬 */}
                <div className="size-full flex flex-col gap-[20px] p-[20px] bg-white">
                  <Link
                    to="/recruit/manage"
                    className="flex justify-between items-center border-b-main-gray border-b py-[10px]"
                  >
                    <div className="flex gap-[10px] items-center">
                      <ResumeIcon color="#717171" />
                      <span>등록한 공고 관리</span>
                    </div>
                    <div className="w-8 h-8 flex items-center justify-center hover:bg-gray-100 rounded-full">
                      <ArrowRightIcon color="#717171" />
                    </div>
                  </Link>
                  {/* 상단 제목 */}
                  <h2 className=" font-bold">나의 근로자 관리</h2>

                  {/* 근로자 그룹 목록 */}
                  {workerGroups.map((group, groupIndex) => (
                    <div
                      key={group.post._id}
                      className="bg-white rounded-[10px] border border-main-gray"
                    >
                      {/* 공고 정보 및 펼치기 헤더 */}
                      <div className="px-[20px] py-[10px]">
                        <div className="flex justify-between items-center">
                          <h3 className="text-[16px] font-semibold">
                            {group.post.title || "제목 없음"}
                          </h3>
                          <button
                            onClick={(e) => handleToggleExpand(groupIndex, e)}
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
                          >
                            {group.isExpanded ? (
                              <ArrowUpIcon color="#717171" />
                            ) : (
                              <ArrowDownIcon color="#717171" />
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
                              {!group.isExpanded &&
                                group.workers.length > 0 && (
                                  <span>
                                    {" · " + group.workers[0].resume.name ||
                                      "이름 없음" + " "}
                                    {getGenderDisplay(group.workers[0].resume)}
                                    {group.workers.length > 1
                                      ? ` 외 ${group.workers.length - 1}명`
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
                                key={worker.resume._id as string}
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
                                  {/* <div className="w-[80px] h-[80px] bg-main-gray rounded-[10px] overflow-hidden"> */}
                                  <div className="w-[80px] h-[80px] border border-main-darkGray rounded-full overflow-hidden">
                                    {getProfileImageUrl(
                                      worker.resume,
                                      worker.user
                                    ) ? (
                                      <img
                                        src={getProfileImageUrl(
                                          worker.resume,
                                          worker.user
                                        )}
                                        alt={worker.user.name}
                                        className="w-full h-full object-cover rounded-[10px]"
                                      />
                                    ) : (
                                      <ProfileIcon />
                                      // <div className="w-full h-full flex items-center justify-center text-main-darkGray text-sm">
                                      //   No Photo
                                      // </div>
                                    )}
                                  </div>

                                  {/* 근로자 정보 텍스트 */}
                                  <div>
                                    <p className="flex gap-[6px] text-[14px] font-semibold">
                                      {worker.resume.name || "이름 정보 없음"}{" "}
                                      {getGenderDisplay(worker.resume)}
                                      <span className="text-main-darkGray font-medium ml-1">
                                        {formatBirthDate(
                                          worker.resume.residentId.slice(0, 6),
                                          worker.resume.residentId
                                        )}
                                      </span>
                                    </p>
                                    <p className="font-semibold">
                                      {worker.resume.phone ||
                                        "연락처 정보 없음"}
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
                                  onClick={(e) => {
                                    handleSettlement(worker, e);
                                  }}
                                  className={`mt-4 w-full font-semibold text-[14px] py-2 rounded-[10px] ${
                                    worker.hasAttendance &&
                                    worker.attendance?.status === "completed"
                                      ? "bg-main-color"
                                      : "bg-selected-box"
                                  } ${
                                    worker.hasAttendance &&
                                    worker.attendance?.status === "paid"
                                      ? "text-main-color"
                                      : "text-white"
                                  }`}
                                  disabled={
                                    !worker.hasAttendance ||
                                    worker.attendance?.status !== "completed"
                                  }
                                >
                                  {worker.attendance?.status === "paid"
                                    ? "지급완료"
                                    : "정산하기"}
                                </button>
                                {payModal && (
                                  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-60">
                                    <div className="bg-white p-5 flex flex-col gap-[10px] rounded-[10px] w-[362px] text-center">
                                      <p className="font-bold text-lg">
                                        정산 금액을 확인해주세요.
                                      </p>
                                      <p className="text-[14px]  mt-2">
                                        정산은 취소할 수 없습니다.
                                      </p>
                                      <input
                                        className="border border-main-darkGray rounded-[10px] p-[10px] text-main-color"
                                        type="text"
                                        value={Tram}
                                        onChange={(e) =>
                                          setTram(e.target.value)
                                        }
                                        onBlur={() =>
                                          setTram(Number(Tram).toLocaleString())
                                        }
                                      />

                                      <div className="flex gap-3 justify-between mt-5">
                                        <button
                                          className="flex-1 border border-main-color rounded-[10px] text-main-color font-semibold p-2"
                                          onClick={() => setPayModal(!payModal)}
                                        >
                                          취소
                                        </button>
                                        <button
                                          className="w-[151px] p-2 rounded-[10px] bg-main-color text-white"
                                          onClick={async () => {
                                            setTram(Tram.replace(/,/g, ""));
                                            if (worker.attendance)
                                              await hanldePayment(
                                                worker.attendance.userId,
                                                worker.attendance.postId
                                              );
                                          }}
                                        >
                                          정산하기
                                        </button>
                                      </div>
                                    </div>
                                  </div>
                                )}
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
              </>
            )}
          </div>
        </div>
      </Main>
      {/* 바텀 네비게이션 */}
      <BottomNav />
    </>
  );
};

export default ReCruitPage;
