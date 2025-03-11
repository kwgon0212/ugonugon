import axios from "axios";

// 인터페이스 정의
export interface Location {
  latitude: number;
  longitude: number;
}

export interface CheckInData {
  userId: string;
  noticeId: string;
  checkInTime?: Date;
  location?: Location;
}

export interface CheckOutData {
  userId: string;
  noticeId: string;
  checkOutTime?: Date;
  location?: Location;
}

export interface AttendanceRecord {
  _id: string;
  userId: string;
  noticeId: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "checked-in" | "checked-out" | "completed";
  location?: {
    checkIn?: Location;
    checkOut?: Location;
  };
  createdAt: string;
  updatedAt: string;
}

// 출근 처리 API 호출
export const checkIn = async (data: CheckInData): Promise<AttendanceRecord> => {
  try {
    const response = await axios.post("/api/attendance/check-in", {
      userId: data.userId,
      noticeId: data.noticeId,
      checkInTime: data.checkInTime
        ? data.checkInTime.toISOString()
        : undefined,
      location: data.location,
    });

    return response.data.attendance;
  } catch (error: any) {
    // 이미 출근한 경우 처리
    if (error.response?.status === 400 && error.response?.data?.attendance) {
      return error.response.data.attendance;
    }
    throw error;
  }
};

// 퇴근 처리 API 호출
export const checkOut = async (
  data: CheckOutData
): Promise<AttendanceRecord> => {
  try {
    const response = await axios.post("/api/attendance/check-out", {
      userId: data.userId,
      noticeId: data.noticeId,
      checkOutTime: data.checkOutTime
        ? data.checkOutTime.toISOString()
        : undefined,
      location: data.location,
    });

    return response.data.attendance;
  } catch (error) {
    throw error;
  }
};

// 출근 상태 조회 API 호출
export const getAttendanceStatus = async (
  userId: string,
  noticeIds?: string[]
): Promise<AttendanceRecord[]> => {
  try {
    const response = await axios.get("/api/attendance/status", {
      params: {
        userId,
        noticeIds: noticeIds?.join(","),
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// 출근 이력 조회 API 호출
export const getAttendanceHistory = async (
  userId: string,
  page = 1,
  limit = 10,
  startDate?: Date,
  endDate?: Date
): Promise<{
  records: AttendanceRecord[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}> => {
  try {
    const response = await axios.get("/api/attendance/history", {
      params: {
        userId,
        page,
        limit,
        startDate: startDate?.toISOString(),
        endDate: endDate?.toISOString(),
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// 특정 출근 기록 조회 API 호출 - 고용주 (공고->저장된 근로자 ->id로 조회)
export const getAttendanceById = async (
  id: string
): Promise<AttendanceRecord> => {
  try {
    const response = await axios.get(`/api/attendance/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// 근무 통계 조회 API 호출
export const getUserStats = async (
  userId: string,
  period: "week" | "month" | "year" = "month"
): Promise<{
  period: {
    start: string;
    end: string;
  };
  stats: {
    totalWorkDuration: string;
    totalMinutes: number;
    recordsCount: number;
    averageWorkDuration: string;
  };
}> => {
  try {
    const response = await axios.get("/api/attendance/stats/user", {
      params: {
        userId,
        period,
      },
    });

    return response.data;
  } catch (error) {
    throw error;
  }
};

// 근무 진행률 계산 유틸리티 함수 (클라이언트에서만 사용)
export const calculateWorkProgress = (
  checkInTime: Date,
  expectedEndTime: Date,
  currentTime = new Date()
): number => {
  // 출근 시간부터 예상 퇴근 시간까지의 총 시간 (분)
  const totalMinutes = Math.floor(
    (expectedEndTime.getTime() - checkInTime.getTime()) / 60000
  );

  // 출근 시간부터 현재까지 경과 시간 (분)
  const elapsedMinutes = Math.floor(
    (currentTime.getTime() - checkInTime.getTime()) / 60000
  );

  // 진행률 계산 (최대 100%)
  return Math.min(Math.round((elapsedMinutes / totalMinutes) * 100), 100);
};

// export default {
//   checkIn,
//   checkOut,
//   getAttendanceStatus,
//   getAttendanceHistory,
//   getAttendanceById,
//   getUserStats,
//   calculateWorkProgress,
// };
