import React from "react";

export const AttendanceGuide = () => {
  return (
    <div className="w-[95%] bg-blue-50 text-blue-600 p-3 rounded-md mb-4 text-sm">
      <p className="font-bold mb-1">출퇴근 안내</p>
      <ul className="list-disc pl-5">
        <li>출근: 근무 시작 30분 전 ~ 10분 후까지만 가능</li>
        <li>퇴근: 근무 종료 시간이 되어야 가능</li>
        <li>
          위치 확인: 근무지 {DISTANCE_TOLERANCE / 1000}km 이내에서만 출퇴근 가능
        </li>
        <li>위치 권한: 출퇴근 기능 사용을 위해 반드시 위치 권한 허용 필요</li>
      </ul>
    </div>
  );
};

// 허용 거리 (미터) - utils.ts에 정의된 상수와 동일한 값
const DISTANCE_TOLERANCE = 2000;

export default AttendanceGuide;
