import { ko } from "date-fns/locale";
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

interface Props {
  value?: Date | null;
  onClick?: () => void;
  icon: React.ReactNode;
  dateFormat?: string;
  placeholder?: string;
  selected?: Date | null;
  setSelectedDate: (date: Date | null) => void;
  mode: "date" | "time"; // 날짜 선택 또는 시간 선택 모드
}

const CustomDatePicker = ({
  value,
  onClick,
  icon,
  dateFormat,
  placeholder = "날짜 선택",
  selected,
  setSelectedDate,
  mode = "date", // 기본값은 날짜 선택 모드
}: Props) => {
  // const formattedValue =
  //   value instanceof Date
  //     ? mode === "date"
  //       ? value.toLocaleDateString("ko-KR") // YYYY-MM-DD 형식
  //       : value.toLocaleTimeString("ko-KR", {
  //           hour: "2-digit",
  //           minute: "2-digit",
  //         }) // HH:mm 형식
  //     : value
  //     ? new Date(value).toLocaleDateString("ko-KR") // `string`일 경우 Date 변환 후 표시
  //     : "";
  // console.log(formattedValue);
  // 🔥 시간만 유지하는 함수 추가
  const handleTimeChange = (date: Date | null) => {
    if (!date) return setSelectedDate(null);

    const hours = date.getHours();
    const minutes = date.getMinutes();

    // 현재 날짜로 설정하되, 시간만 유지
    const newTime = new Date();
    newTime.setHours(hours);
    newTime.setMinutes(minutes);
    newTime.setSeconds(0);
    newTime.setMilliseconds(0);

    setSelectedDate(newTime);
  };

  // 🔥 선택된 값 표시 형식 변경 (날짜/시간 구분)
  const formattedValue =
    selected instanceof Date
      ? mode === "date"
        ? selected.toLocaleDateString("ko-KR") // YYYY-MM-DD 형식
        : selected.toLocaleTimeString("ko-KR", {
            hour: "2-digit",
            minute: "2-digit",
          }) // HH:mm 형식
      : "";
  return (
    <DatePicker
      selected={selected}
      onChange={mode === "time" ? handleTimeChange : setSelectedDate}
      locale={ko}
      className="w-full"
      customInput={
        <div className="relative">
          <div className="absolute left-[10px] top-1/2 -translate-y-1/2">
            {icon}
          </div>
          <input
            type="text"
            className="w-full rounded-[10px] pl-[40px] pr-[10px] border border-gray-300 h-[40px] cursor-pointer outline-main-color"
            value={formattedValue}
            readOnly
            onClick={onClick}
            placeholder={placeholder}
          />
        </div>
      }
      dateFormat={dateFormat || (mode === "date" ? "yyyy-MM-dd" : "HH:mm")}
      showTimeSelect={mode === "time"} // 시간 선택 모드일 경우 활성화
      showTimeSelectOnly={mode === "time"} // 시간만 선택하는 경우
      timeIntervals={30}
      popperPlacement="bottom"
    />
  );
};

export default CustomDatePicker;
