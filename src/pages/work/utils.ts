// 인터페이스 정의
export interface UserData {
  noticeIds: string[] | string;
  contract?: string;
}

export interface WorkData {
  _id: string;
  title: string;
  companyAddress?: {
    address: string;
    detailAddress?: string;
    Latitude?: string;
    Longitude?: string;
  };
  address?: {
    street: string;
    detail?: string;
    lat?: number;
    lng?: number;
  };
  payType?: string;
  pay?: number | { type: string; value: number };
  workDate?: string;
  period?: {
    start: string;
    end: string;
    discussion?: boolean;
  };
  hour?: {
    start: string;
    end: string;
    discussion?: boolean;
  };
  customTime?: {
    startTime: string;
    endTime: string;
  };
  day?: string[];
  workDetail?: string;
  welfare?: string;
  postDetail?: string;
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

// 위치 정보 인터페이스
export interface Location {
  latitude: number;
  longitude: number;
}

// 버튼 상태 인터페이스
export interface ButtonState {
  text: string;
  enabled: boolean;
  style: string;
  reason?: string;
}

// 날짜 변환 및 비교를 위한 유틸리티 함수들
export const getWorkDate = (notice: WorkData): Date | null => {
  try {
    // workDate가 있는 경우
    if (notice.workDate) {
      return new Date(notice.workDate);
    }
    // period.start가 있는 경우
    else if (notice.period?.start) {
      // ISO 형식 문자열을 Date 객체로 변환
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
    // workDate만 있는 경우 (하루 근무로 간주)
    else if (notice.workDate) {
      const date = new Date(notice.workDate);
      // 같은 날의 23:59:59로 설정
      date.setHours(23, 59, 59);
      return date;
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

// 근무 시작 시간을 가져오는 함수
export const getWorkStartTime = (notice: WorkData): Date | null => {
  try {
    // customTime이 있는 경우 (HH:MM 형식)
    if (notice.customTime?.startTime) {
      const workDate = getWorkDate(notice);
      if (!workDate) return null;

      const [hours, minutes] = notice.customTime.startTime
        .split(":")
        .map(Number);
      const startTime = new Date(workDate);
      startTime.setHours(hours, minutes, 0);
      return startTime;
    }
    // hour.start가 있는 경우 (ISO 형식)
    else if (notice.hour?.start) {
      return new Date(notice.hour.start);
    }
    // period.start만 있는 경우, 오전 9시로 가정
    else if (notice.period?.start) {
      const date = new Date(notice.period.start);
      // 만약 시간이 이미 설정되어 있다면 그대로 사용
      if (date.getHours() !== 0 || date.getMinutes() !== 0) {
        return date;
      }
      // 시간이 설정되지 않았다면 오전 9시로 설정
      date.setHours(9, 0, 0);
      return date;
    }
    return null;
  } catch (error) {
    console.error("시작 시간 변환 오류:", error);
    return null;
  }
};

// 근무 종료 시간을 가져오는 함수
export const getWorkEndTime = (notice: WorkData): Date | null => {
  try {
    // customTime이 있는 경우
    if (notice.customTime?.endTime) {
      const workDate = getWorkDate(notice);
      if (!workDate) return null;

      const [hours, minutes] = notice.customTime.endTime.split(":").map(Number);
      const endTime = new Date(workDate);
      endTime.setHours(hours, minutes, 0);
      return endTime;
    }
    // hour.end가 있는 경우
    else if (notice.hour?.end) {
      return new Date(notice.hour.end);
    }
    // period.start만 있고 hour 정보가 없는 경우, 오후 6시로 가정
    else if (notice.period?.start && !notice.hour) {
      const date = new Date(notice.period.start);
      date.setHours(18, 0, 0);
      return date;
    }
    return null;
  } catch (error) {
    console.error("종료 시간 변환 오류:", error);
    return null;
  }
};

// 시간 형식을 'HH:MM' 형태로 변환하는 함수
export const formatTime = (date: Date): string => {
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
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

// 두 시간 사이의 분 차이를 계산하는 함수
export const calculateMinutesDifference = (start: Date, end: Date): number => {
  const diffMs = end.getTime() - start.getTime();
  return Math.floor(diffMs / 60000); // 분 단위로 반환
};

// 근무지 위치 정보를 가져오는 함수
export const getWorkplaceLocation = (
  notice: WorkData
): { lat: number; lng: number } | null => {
  // address 내부에 lat, lng가 있는 경우
  if (notice.address?.lat && notice.address?.lng) {
    return {
      lat: notice.address.lat,
      lng: notice.address.lng,
    };
  }
  // companyAddress 내부에 Latitude, Longitude가 있는 경우
  else if (
    notice.companyAddress?.Latitude &&
    notice.companyAddress?.Longitude
  ) {
    return {
      lat: parseFloat(notice.companyAddress.Latitude),
      lng: parseFloat(notice.companyAddress.Longitude),
    };
  }
  return null;
};

// 디버깅 함수: 날짜/시간 정보 로깅
export const logTimeInfo = (notice: WorkData) => {
  const workDate = getWorkDate(notice);
  const startTime = getWorkStartTime(notice);
  const endTime = getWorkEndTime(notice);

  console.group("근무 시간 정보");
  console.log("공고 ID:", notice._id);
  console.log("공고 제목:", notice.title);
  console.log("원본 데이터:", {
    workDate: notice.workDate,
    period: notice.period,
    hour: notice.hour,
    customTime: notice.customTime,
  });
  console.log("파싱된 날짜:", workDate ? formatDate(workDate) : "null");
  console.log("파싱된 시작 시간:", startTime ? formatTime(startTime) : "null");
  console.log("파싱된 종료 시간:", endTime ? formatTime(endTime) : "null");
  console.groupEnd();

  return { workDate, startTime, endTime };
};
