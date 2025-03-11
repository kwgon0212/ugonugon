import React from "react";

export const AttendanceGuide = () => {
  return (
    <div className="w-[95%] bg-blue-50 text-blue-600 p-3 rounded-md mb-4 text-sm">
      <p className="font-bold mb-1">출퇴근 안내</p>
      <ul className="list-disc pl-5">
        <li>출근: 근무 시작 30분 전 ~ 10분 후까지만 가능</li>
        <li>퇴근: 근무 종료 시간이 되어야 가능</li>
        <li>위치 조건: 근무지 100m 이내에서만 출퇴근 가능</li>
      </ul>
    </div>
  );
};

export default AttendanceGuide;
