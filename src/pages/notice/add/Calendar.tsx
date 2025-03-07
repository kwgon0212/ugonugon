import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "@/css/datePicker.css";
import { ko } from "date-fns/locale/ko";

interface CalendarProps {
  onChange: (date: Date | null) => void; // 날짜가 변경될 때 실행될 함수
  startDate?: Date | null; // 시작 날짜 (선택적)
  endDate?: Date | null; // 종료 날짜 (선택적)
  selected?: Date | null; // 현재 선택된 날짜 (선택적)
  dateFormat?: string; // 날짜 형식 (선택적)
}

const Calendar = ({
  onChange,
  startDate,
  endDate,
  selected,
  dateFormat,
}: CalendarProps) => {
  return (
    <DatePicker
      locale={ko}
      showIcon
      icon={
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="20px"
          height="20px"
          color="#717171"
          fill="none"
          style={{
            padding: "10px 0 10px 15px",
            width: "20px",
            height: "20px",
          }}
        >
          <path
            d="M10 18.3333C14.6024 18.3333 18.3333 14.6023 18.3333 9.99996C18.3333 5.39759 14.6024 1.66663 10 1.66663C5.39763 1.66663 1.66667 5.39759 1.66667 9.99996C1.66667 14.6023 5.39763 18.3333 10 18.3333Z"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <path
            d="M10 5V10L13.3333 11.6667"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      }
      toggleCalendarOnIconClick
      showTimeSelect
      showTimeSelectOnly
      // dateFormat="HH : mm"
      dateFormat={dateFormat}
      startDate={startDate}
      endDate={endDate}
      popperPlacement="bottom-start"
      fixedHeight
      selectsStart
      className="left-wrapper"
      placeholderText="출근 시간"
      selected={selected}
      onChange={onChange}
    />
  );
};

export default Calendar;
