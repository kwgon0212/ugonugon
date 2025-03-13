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
  checkInLocation?: Location;
}

export interface CheckOutData {
  userId: string;
  noticeId: string;
  checkOutTime?: Date;
  checkOutLocation?: Location;
}

export interface AttendanceRecord {
  _id: string;
  userId: string;
  noticeId: string;
  checkInTime: string;
  checkOutTime?: string;
  status: "checked-in" | "checked-out" | "completed";
  checkInLocation?: Location;
  checkOutLocation?: Location;
  createdAt: string;
  updatedAt: string;
}

// 출근 처리 API 호출
export const checkIn = async (data: CheckInData): Promise<AttendanceRecord> => {
  try {
    // req.body 형식에 맞게 데이터 변환
    const requestData = {
      userId: data.userId,
      noticeId: data.noticeId,
      checkInTime: data.checkInTime
        ? data.checkInTime.toISOString()
        : undefined,
      checkInLocation: data.checkInLocation, // 새 API에서는 checkInLocation 필드 사용
    };

    console.log("출근 API 요청 데이터:", requestData);

    const response = await axios.post(
      "/api/newAttendance/check-in",
      requestData
    );
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
    // 요청 데이터 준비
    const requestData = {
      userId: data.userId,
      noticeId: data.noticeId,
      checkOutTime: data.checkOutTime
        ? data.checkOutTime.toISOString()
        : undefined,
      checkOutLocation: data.checkOutLocation, // 새 API에서는 checkOutLocation 필드 사용
    };

    console.log("퇴근 API 요청 데이터:", requestData);

    const response = await axios.post(
      "/api/newAttendance/check-out",
      requestData
    );
    return response.data.attendance;
  } catch (error) {
    console.error("퇴근 처리 요청 오류:", error);
    throw error;
  }
};

// 출근 상태 조회 API 호출 - 새 API는 findById를 사용
export const getAttendanceStatus = async (
  userId: string
): Promise<AttendanceRecord | null> => {
  try {
    console.log("출근 상태 조회 요청:", userId);

    const response = await axios.get("/api/newAttendance/status", {
      params: {
        userId, // 새 API는 userId 파라미터만 받음
      },
    });

    console.log("출근 상태 조회 응답:", response.data);
    return response.data;
  } catch (error) {
    console.error("출근 상태 조회 오류:", error);
    throw error;
  }
};

// 특정 출근 기록 조회 API 호출
export const getAttendanceById = async (
  id: string
): Promise<AttendanceRecord> => {
  try {
    const response = await axios.get(`/api/newAttendance/${id}`);
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
