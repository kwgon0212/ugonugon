import React from "react";
import styled from "styled-components";
import LocationIcon from "../../components/icons/ArrowDown";
import {
  WorkData,
  WorkStatus,
  Location,
  DISTANCE_TOLERANCE,
  isWithinAllowedDistance,
  getWorkDate,
  getWorkStartTime,
  getWorkEndTime,
  formatDate,
  formatTime,
  formatTime12Hour,
  getWorkplaceLocation,
} from "./utils";
import { AttendanceRecord } from "./attendanceService";

interface WorkItemProps {
  notice: WorkData;
  status: WorkStatus;
  distance: number | undefined;
  currentLocation: Location | null;
  locationEnabled: boolean;
  currentTime: Date;
  onCheckIn: (noticeId: string) => void;
  onCheckOut: (noticeId: string) => void;
  attendanceRecord?: AttendanceRecord; // 추가
}

export const WorkItem: React.FC<WorkItemProps> = ({
  notice,
  status,
  distance,
  currentLocation,
  locationEnabled,
  currentTime,
  onCheckIn,
  onCheckOut,
  attendanceRecord, // 추가: 출석 기록을 props로 받음
}) => {
  // 스키마 구조에 맞게 처리
  const address = notice.address?.street || "주소 정보 없음";

  // pay 필드는 항상 { type, value } 형태
  const payInfo = notice.pay
    ? `${notice.pay.type} ${notice.pay.value.toLocaleString()} 원`
    : "급여 정보 없음";

  // 근무 날짜 정보 처리
  const workDateObj = getWorkDate(notice);
  const dateInfo = workDateObj ? formatDate(workDateObj) : "날짜 정보 없음";

  // 근무 시간 정보 처리
  const startTimeObj = getWorkStartTime(notice);
  const endTimeObj = getWorkEndTime(notice);

  // 12시간 형식 (AM/PM)으로 시간 표시
  const timeInfo =
    startTimeObj && endTimeObj
      ? `${formatTime12Hour(startTimeObj)} ~ ${formatTime12Hour(endTimeObj)}`
      : "시간 정보 없음";

  // 오늘 날짜인지 확인
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const isToday =
    workDateObj &&
    workDateObj.getDate() === today.getDate() &&
    workDateObj.getMonth() === today.getMonth() &&
    workDateObj.getFullYear() === today.getFullYear();

  // 현재 위치와 근무지 사이의 거리
  const formattedDistance =
    distance !== undefined ? `${Math.round(distance)}m` : "거리 정보 없음";

  // 버튼 상태 가져오기 (출석 기록도 전달)
  const buttonState = getButtonState(
    notice,
    status,
    currentTime,
    distance,
    locationEnabled,
    currentLocation,
    attendanceRecord
  );

  // 디버깅용 로그 추가
  const handleButtonClick = () => {
    if (buttonState.enabled) {
      console.log("Button clicked", {
        noticeId: notice._id,
        isOnTime: status.isOnTime,
        attendanceRecord: attendanceRecord,
        buttonState: buttonState,
      });

      if (
        !status.isOnTime ||
        (attendanceRecord && attendanceRecord.status === "checked-in")
      ) {
        console.log("퇴근 처리 실행");
        onCheckOut(notice._id);
      } else {
        console.log("출근 처리 실행");
        onCheckIn(notice._id);
      }
    }
  };

  return (
    <ItemContainer>
      <div className="flex flex-col pt-4 pb-2 mb-4 w-[90%] border-b border-b-selected-box">
        <div className="font-bold mb-2 text-base">{notice.title}</div>
        <div className="mb-2 text-sm">{address}</div>
        {distance !== undefined && distance !== Infinity && (
          <div className="mb-2 text-sm flex items-center">
            <LocationIcon color="#718096" />
            <span className="ml-1">현재 위치에서 {formattedDistance} 거리</span>
          </div>
        )}
        <div>
          <span className="font-bold text-main-color text-sm">{payInfo}</span>
        </div>
      </div>
      <div className="flex flex-col w-[90%] border-b border-b-selected-box">
        <div className="font-bold mb-2 text-base ">근무일자</div>
        <div className="flex flex-row mb-2 w-full">
          <span
            className={`font-bold text-sm pr-2 ${
              isToday ? "text-red-500" : "text-main-color"
            }`}
          >
            {dateInfo} {isToday && "(오늘)"}
          </span>
          <span className="font-bold text-sm text-main-color">{timeInfo}</span>
        </div>
        {notice.day && notice.day.length > 0 && (
          <div className="mb-2 text-sm">
            <span className="font-bold mr-2">근무 요일:</span>
            {notice.day.join(", ")}
          </div>
        )}
      </div>

      {(!status.isOnTime ||
        (attendanceRecord && attendanceRecord.status === "checked-in")) && (
        <div className="flex flex-col w-[90%] mt-3 mb-5">
          <div className="w-full mb-2 flex justify-between">
            <span>{status.percent}% 근무완료</span>
            {status.checkInTime && (
              <span className="text-sm text-gray-600">
                출근: {formatTime12Hour(status.checkInTime)}
              </span>
            )}
          </div>
          <div className="relative w-full h-[10px] rounded-[10px] bg-selected-box">
            <div
              className="absolute h-[10px] rounded-[10px] bg-selected-text z-10"
              style={{ width: `${status.percent}%` }}
            />
            <div className="relative w-full h-[10px] rounded-[10px] bg-selected-box " />
          </div>
          {status.estimatedCheckOutTime && (
            <div className="text-right text-sm text-gray-600 mt-1">
              예상 퇴근: {formatTime12Hour(status.estimatedCheckOutTime)}
            </div>
          )}
        </div>
      )}

      {/* 현재 상태 디버깅용 (필요시 주석 해제) */}
      {/* <div className="text-xs text-gray-500 mb-2 w-[90%]">
        <div>Status: {attendanceRecord ? attendanceRecord.status : "없음"}</div>
        <div>Progress: {status.percent}%</div>
        <div>canCheckOut: {status.canCheckOut ? "Yes" : "No"}</div>
      </div> */}

      <Btn
        className={buttonState.style}
        onClick={handleButtonClick}
        disabled={!buttonState.enabled}
      >
        {buttonState.text}
      </Btn>

      {buttonState.reason && (
        <div className="text-sm text-gray-600 mb-3 mt-[-10px] w-[70%] text-center">
          {buttonState.reason}
        </div>
      )}
    </ItemContainer>
  );
};

const ItemContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  height: fit-content;
  border-radius: 10px;
  background-color: white;
  margin-bottom: 16px;
`;

const Btn = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 70%;
  height: 40px;
  color: white;
  font-weight: bold;
  font-size: 14px;
  border-radius: 10px;
  margin-bottom: 14px;
  margin-top: 14px;
`;

// 버튼 상태 및 텍스트 반환 함수 - 출석 기록(attendanceRecord) 파라미터 추가
const getButtonState = (
  notice: WorkData,
  status: WorkStatus,
  currentTime: Date,
  distance: number | undefined,
  locationEnabled: boolean,
  currentLocation: Location | null,
  attendanceRecord?: AttendanceRecord // 추가: 출석 기록 파라미터
): { text: string; enabled: boolean; style: string; reason?: string } => {
  const workDate = getWorkDate(notice);
  const startTime = getWorkStartTime(notice);
  const endTime = getWorkEndTime(notice);
  const now = currentTime;
  const distanceValue = distance || Infinity;

  // 위치가 허용 범위 이내인지 확인
  const isNearWorkplace = isWithinAllowedDistance(distanceValue);

  // 기본적인 조건 검사
  if (!workDate) {
    return {
      text: "날짜 정보 없음",
      enabled: false,
      style: "bg-gray-300 cursor-not-allowed",
    };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const isToday =
    workDate.getDate() === today.getDate() &&
    workDate.getMonth() === today.getMonth() &&
    workDate.getFullYear() === today.getFullYear();

  if (!isToday) {
    return {
      text: workDate.getTime() > today.getTime() ? "예정된 근무" : "지난 근무",
      enabled: false,
      style: "bg-gray-300 cursor-not-allowed",
    };
  }

  if (!startTime || !endTime) {
    return {
      text: "시간 정보 없음",
      enabled: false,
      style: "bg-gray-300 cursor-not-allowed",
    };
  }

  // 출석 기록 기반으로 출퇴근 상태 확인 (개선됨)
  const hasCheckedIn =
    attendanceRecord &&
    (attendanceRecord.status === "checked-in" ||
      attendanceRecord.status === "completed");

  // 이미 출근한 경우 (출석 기록 또는 status 기반으로 확인)
  if (hasCheckedIn || !status.isOnTime) {
    // 이미 퇴근한 경우
    if (attendanceRecord && attendanceRecord.status === "completed") {
      return {
        text: "근무 완료",
        enabled: false,
        style: "bg-gray-400 cursor-not-allowed",
      };
    }

    // 퇴근 가능 여부 확인: 출근한 상태이고, 근무 시간이 종료되었거나 100% 진행된 경우
    const isPastEndTime = endTime && now >= endTime;
    const isWorkCompleted = status.percent >= 100;
    const canCheckOut = isPastEndTime || isWorkCompleted;

    if (canCheckOut) {
      // 퇴근 가능하지만 거리 조건 확인
      if (!locationEnabled) {
        return {
          text: "퇴근하기 (위치 권한 필요)",
          enabled: false,
          style: "bg-selected-box cursor-not-allowed",
          reason: "위치 권한을 허용해주세요",
        };
      }

      if (!isNearWorkplace) {
        return {
          text: "퇴근하기",
          enabled: false,
          style: "bg-selected-box cursor-not-allowed",
          reason: `근무지에 더 가까이 가주세요 (${DISTANCE_TOLERANCE}m 이내)`,
        };
      }

      // 모든 조건 만족
      return {
        text: "퇴근하기",
        enabled: true,
        style: "bg-selected-box",
      };
    } else {
      // 아직 퇴근 불가능한 경우
      return {
        text: "근무 중...",
        enabled: false,
        style: "bg-selected-box cursor-not-allowed",
        reason: "근무 시간이 끝나야 퇴근할 수 있습니다",
      };
    }
  }

  // 출근 관련 로직 (아직 출근하지 않은 경우)

  // 위치 정보 관련 조건 검사
  if (!locationEnabled) {
    return {
      text: "위치 권한 필요",
      enabled: false,
      style: "bg-selected-box cursor-not-allowed",
      reason: "위치 권한을 허용해주세요",
    };
  }

  if (!currentLocation) {
    return {
      text: "위치 확인 중...",
      enabled: false,
      style: "bg-selected-box cursor-not-allowed",
    };
  }

  const workplaceLocation = getWorkplaceLocation(notice);
  if (!workplaceLocation) {
    return {
      text: "근무지 위치 정보 없음",
      enabled: false,
      style: "bg-gray-300 cursor-not-allowed",
    };
  }

  // 근무 시작 30분 전 시간 계산
  const thirtyMinBefore = new Date(startTime);
  thirtyMinBefore.setMinutes(thirtyMinBefore.getMinutes() - 30);

  // 근무 시작 10분 후 시간 계산 (지각 한계)
  const tenMinAfter = new Date(startTime);
  tenMinAfter.setMinutes(tenMinAfter.getMinutes() + 10);

  // 현재 시간이 시작 시간 기준으로 출근 가능 시간 범위 이내인지 확인
  // 출근 가능 시간: 시작 30분 전 ~ 시작 10분 후
  const isWithinCheckInTimeWindow =
    now >= thirtyMinBefore && now <= tenMinAfter;

  // 아직 출근 시간 30분 전이 안 된 경우
  if (now < thirtyMinBefore) {
    const timeDiff = Math.floor(
      (thirtyMinBefore.getTime() - now.getTime()) / 60000
    );
    const hours = Math.floor(timeDiff / 60);
    const mins = timeDiff % 60;

    let timeText = "";
    if (hours > 0) {
      timeText += `${hours}시간 `;
    }
    timeText += `${mins}분 후 활성화`;

    return {
      text: timeText,
      enabled: false,
      style: "bg-selected-box cursor-not-allowed",
    };
  }

  // 근무 시작 10분 이후인 경우 (지각 시간 초과)
  if (now > tenMinAfter) {
    return {
      text: "출근 시간 초과",
      enabled: false,
      style: "bg-red-500 cursor-not-allowed",
      reason: "근무 시작 10분 이내에 출근해야 합니다",
    };
  }

  // 근무 종료 시간이 지난 경우
  if (now > endTime) {
    return {
      text: "근무 시간 종료",
      enabled: false,
      style: "bg-gray-300 cursor-not-allowed",
    };
  }
  // 거리 기반 조건 - 허용 거리 이내인지 확인
  if (!isNearWorkplace) {
    return {
      text: `근무지와 ${DISTANCE_TOLERANCE}m 떨어짐`,
      enabled: false,
      style: "bg-selected-box cursor-not-allowed",
      reason: `근무지에 더 가까이 가주세요 (${DISTANCE_TOLERANCE}m 이내)`,
    };
  }

  let buttonText = "출근하기";
  if (now > startTime) {
    // 시작 시간 이후 10분 이내 (지각 출근)
    const lateMinutes = Math.floor(
      (now.getTime() - startTime.getTime()) / 60000
    );
    buttonText = `지각 출근 (${lateMinutes}분)`;
  } else if (now >= startTime) {
    // 시작 시간 정확히 또는 조금 지남
    buttonText = "출근하기";
  } else {
    // 시작 시간 이전 (조기 출근)
    buttonText = "출근하기";
  }

  // 모든 조건을 만족하면 출근 가능
  return { text: buttonText, enabled: true, style: "bg-main-color" };
};
