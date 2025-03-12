// utils.ts 파일 - 스키마에 맞게 수정됨
// 인터페이스 정의.ts

import mongoose from "mongoose";

// workPage에서 user 스키마에 있는 applies 필드 정보 저장
export interface UserData {
  postId: mongoose.Types.ObjectId;
  status: string;
  applieAt: Date;
  _id: mongoose.Types.ObjectId;
}

// 공고 스키마에 맞게 수정된 WorkData 인터페이스
export interface WorkData {
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
  createdAt?: string | Date;
  applies: [
    {
      userId: mongoose.Types.ObjectId;
      resumeId: mongoose.Types.ObjectId;
      // postId: mongoose.Types.ObjectId;
      status?: "pending" | "accepted" | "rejected";
      appliedAt?: string | Date;
    }
  ];
  // applies: IApply[]; // 따로 분리한 인터페이스 적용
}
// 지원자 정보 인터페이스 (applies 배열) -> 따로 분리해서 사용할 경우
export interface IApply {
  userId: mongoose.Types.ObjectId;
  resumeId: mongoose.Types.ObjectId;
  // postId: mongoose.Types.ObjectId;
  status?: "pending" | "accepted" | "rejected";
  appliedAt?: string | Date;
}

// 각 공고별 근무 상태를 관리하기 위한 인터페이스
export interface WorkStatus {
  isOnTime: boolean; // 출근 상태 (true: 출근 전, false: 출근 후)
  percent: number; // 근무 진행률 (0-100)
  checkInTime?: Date; // 출근 시간
  estimatedCheckOutTime?: Date; // 예상 퇴근 시간
  totalWorkDuration?: number; // 총 근무 시간(분)
  canCheckOut: boolean; // 퇴근 가능 여부
}

// 유저의 현재 위치 정보 인터페이스
export interface Location {
  latitude: number;
  longitude: number;
}

// 출퇴근 버튼 상태 인터페이스
export interface ButtonState {
  text: string;
  enabled: boolean;
  style: string;
  reason?: string;
}

// 날짜 변환 및 비교를 위한 유틸리티 함수들
export const getWorkDate = (notice: WorkData): Date | null => {
  try {
    // period.start가 있는 경우
    if (notice.period?.start) {
      return new Date(notice.period.start);
    }
    return null;
  } catch (error) {
    console.error("날짜 변환 오류:", error);
    return null;
  }
};

export const getWorkEndDate = (notice: WorkData): Date | null => {
  try {
    // period.end가 있는 경우
    if (notice.period?.end) {
      return new Date(notice.period.end);
    }
    return null;
  } catch (error) {
    console.error("종료 날짜 변환 오류:", error);
    return null;
  }
};

// 날짜 형식을 'YYYY-MM-DD' 형태로 변환하는 함수
export const formatDate = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 근무 시작 시간을 가져오는 함수 - 시간대 문제 해결
export const getWorkStartTime = (notice: WorkData): Date | null => {
  try {
    // hour.start가 있는 경우
    if (notice.hour?.start) {
      // 원본 데이터 로깅 (디버깅용)
      console.log("원본 시작 시간:", notice.hour.start);

      // 이미 Date 객체이면 그대로 사용, 문자열이면 Date 객체로 변환
      const date =
        typeof notice.hour.start === "string"
          ? new Date(notice.hour.start)
          : notice.hour.start;

      console.log("변환된 시작 시간:", date.toLocaleString());

      return date;
    }

    return null;
  } catch (error) {
    console.error("시작 시간 변환 오류:", error, notice);
    return null;
  }
};

// 근무 종료 시간을 가져오는 함수 - 시간대 문제 해결
export const getWorkEndTime = (notice: WorkData): Date | null => {
  try {
    // hour.end가 있는 경우
    if (notice.hour?.end) {
      // 원본 데이터 로깅 (디버깅용)
      console.log("원본 종료 시간:", notice.hour.end);

      // 이미 Date 객체이면 그대로 사용, 문자열이면 Date 객체로 변환
      const date =
        typeof notice.hour.end === "string"
          ? new Date(notice.hour.end)
          : notice.hour.end;

      console.log("우곤우곤 변환된 종료 시간:", date.toLocaleString("ko-KR"));

      return date;
    }

    return null;
  } catch (error) {
    console.error("종료 시간 변환 오류:", error, notice);
    return null;
  }
};

// 시간 형식을 'HH:MM' 형태로 변환하는 함수 (24시간 형식) - 현지 시간 기준
export const formatTime = (date: Date): string => {
  // 현지 시간대를 기준으로 시간과 분을 가져옴
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

// 시간 형식을 'HH:MM AM/PM' 형태로 변환하는 함수 (12시간 형식) - 현지 시간 기준
export const formatTime12Hour = (date: Date): string => {
  // 현지 시간대를 기준으로 시간과 분을 가져옴
  const hours = date.getHours();
  const minutes = String(date.getMinutes()).padStart(2, "0");
  const ampm = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12; // 12시간 형식 (0은 12로 표시)
  return `${displayHours}:${minutes} ${ampm}`;
};

// 날짜와 시간을 표시하는 함수 (시간대 정보 포함)
export const formatDateTimeWithTimezone = (date: Date): string => {
  // 날짜 부분
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");

  // 시간 부분 (12시간 형식)
  const timeStr = formatTime12Hour(date);

  // 요일 가져오기
  const weekdays = ["일", "월", "화", "수", "목", "금", "토"];
  const weekday = weekdays[date.getDay()];

  return `${year}-${month}-${day} (${weekday}) ${timeStr}`;
};

// 근무 시간 표시 함수 (시작~종료)
export const formatWorkTimeRange = (startDate: Date, endDate: Date): string => {
  const startTime = formatTime12Hour(startDate);
  const endTime = formatTime12Hour(endDate);

  // 날짜가 다른지 확인
  const startDay = startDate.getDate();
  const endDay = endDate.getDate();

  if (startDay !== endDay) {
    // 날짜가 다른 경우, 다음날 표시 추가
    return `${startTime} ~ ${endTime} (다음날)`;
  }

  return `${startTime} ~ ${endTime}`;
};

// UTC ISO 문자열을 현지 시간대의 Date 객체로 변환
export const convertUTCtoLocal = (isoString: string): Date => {
  const date = new Date(isoString);
  return date;
};

// 날짜 객체를 YYYY-MM-DD 형식의 문자열로 변환
export const formatDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

// 허용 오차 범위 (미터 단위)
export const DISTANCE_TOLERANCE = 1000; // 1Km 로 설정 (필요에 따라 조정 가능)

// 거리가 허용 오차 범위 내에 있는지 확인하는 함수
export const isWithinAllowedDistance = (distanceInMeters: number): boolean => {
  return distanceInMeters <= DISTANCE_TOLERANCE;
};

// 두 위치 사이의 거리를 계산하는 함수 (하버사인 공식)
export const calculateDistance = (
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number => {
  const R = 6371e3; // 지구 반지름(미터)
  const φ1 = (lat1 * Math.PI) / 180; // φ, λ in radians
  const φ2 = (lat2 * Math.PI) / 180;
  const Δφ = ((lat2 - lat1) * Math.PI) / 180;
  const Δλ = ((lon2 - lon1) * Math.PI) / 180;

  const a =
    Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
    Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return R * c; // 미터 단위 거리
};

// 근무지 위치 정보를 가져오는 함수
export const getWorkplaceLocation = (
  notice: WorkData
): { lat: number; lng: number } | null => {
  // address 내부에 lat, lng가 있는 경우 (새 스키마)
  if (notice.address?.lat && notice.address?.lng) {
    return {
      lat: notice.address.lat,
      lng: notice.address.lng,
    };
  }
  return null;
};

// 두 시간 사이의 분 차이를 계산하는 함수
export const calculateMinutesDifference = (start: Date, end: Date): number => {
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / 60000); // 분 단위로 반환
};

// 디버깅 함수: 시간 정보 출력
export const debugTime = (date: Date | null, label: string): void => {
  if (!date) {
    console.log(`${label}: null`);
    return;
  }

  console.log(`${label}:`);
  console.log(`  날짜: ${date.toLocaleDateString()}`);
  console.log(`  시간: ${date.toLocaleTimeString()}`);
  console.log(`  ISO: ${date.toISOString()}`);
  console.log(`  Raw: ${date}`);
};

// 디버깅 함수: 날짜/시간 정보 로깅
export const logTimeInfo = (notice: WorkData): void => {
  console.group("근무 시간 정보 디버깅");
  console.log("공고 ID:", notice._id);
  console.log("공고 제목:", notice.title);

  console.log("원본 데이터:");
  console.log("  period.start:", notice.period?.start);
  console.log("  period.end:", notice.period?.end);
  console.log("  hour.start:", notice.hour?.start);
  console.log("  hour.end:", notice.hour?.end);

  // Date 객체로 변환한 시간 정보
  const workDate = getWorkDate(notice);
  const startTime = getWorkStartTime(notice);
  const endTime = getWorkEndTime(notice);

  debugTime(workDate, "근무 날짜");
  debugTime(startTime, "시작 시간");
  debugTime(endTime, "종료 시간");

  console.groupEnd();
};
