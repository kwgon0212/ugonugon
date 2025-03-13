import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Main from "@/components/Main";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAppSelector } from "@/hooks/useRedux";
import Slider from "react-slick";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { User } from "@/hooks/fetchUser";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CloseEyeIcon from "@/components/icons/CloseEye";
import OpenEyeIcon from "@/components/icons/OpenEye";
import ArrowDownIcon from "@/components/icons/ArrowDown";

interface Transaction {
  id: number;
  date: string;
  amount: number;
  receiver: string;
  type: "입금" | "출금";
}

const transactions: Record<string, Record<string, Transaction[]>> = {
  "2023": {
    "01": [
      {
        id: 1,
        date: "2023-01-05",
        amount: 45000,
        receiver: "김민수",
        type: "입금",
      },
      {
        id: 2,
        date: "2023-01-15",
        amount: 75000,
        receiver: "박지윤",
        type: "출금",
      },
    ],
    "02": [
      {
        id: 3,
        date: "2023-02-10",
        amount: 98000,
        receiver: "이영호",
        type: "입금",
      },
    ],
  },
  "2024": {
    "01": [
      {
        id: 4,
        date: "2024-01-05",
        amount: 50000,
        receiver: "김철수",
        type: "입금",
      },
      {
        id: 5,
        date: "2024-01-10",
        amount: 30000,
        receiver: "박영희",
        type: "출금",
      },
    ],
    "02": [
      {
        id: 6,
        date: "2024-02-02",
        amount: 20000,
        receiver: "이민호",
        type: "입금",
      },
      {
        id: 7,
        date: "2024-02-15",
        amount: 100000,
        receiver: "최지은",
        type: "출금",
      },
    ],
    "03": [
      {
        id: 8,
        date: "2024-03-03",
        amount: 150000,
        receiver: "오정우",
        type: "입금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "출금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "출금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2024-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
    ],
  },
};

const BankAccountPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [selectedYear, setSelectedYear] = useState<string>("2024");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
  const [isHiddenBalance, setIsHiddenBalance] = useState(false);
  const [userBank, setUserBank] = useState<User["bankAccount"] | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const navigate = useNavigate();

  const years = Object.keys(transactions);
  const months = Object.keys(transactions[selectedYear]);

  useEffect(() => {
    const fetchUserBankAccount = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`/api/users?userId=${userId}`);
        const userDoc = response.data;
        setUserBank(userDoc.bankAccount);
      } catch (error) {
        console.log(error);
        setUserBank(null);
      }
    };

    fetchUserBankAccount();
  }, [userId]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    setSelectedMonthIndex(0);
    if (sliderRef.current) sliderRef.current.slickGoTo(0);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonthIndex = months.indexOf(e.target.value);
    setSelectedMonthIndex(newMonthIndex);
    if (sliderRef.current) sliderRef.current.slickGoTo(newMonthIndex);
  };

  const handleAfterChange = (index: number) => {
    setSelectedMonthIndex(index);
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    afterChange: handleAfterChange,
  };

  return (
    <>
      <Header>
        <div className="size-full flex justify-center items-center relative">
          <span>내 계좌 관리</span>
          <button
            onClick={() => navigate(-1)}
            className="absolute left-[20px] top-1/2 -translate-y-1/2"
          >
            <ArrowLeftIcon />
          </button>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full flex flex-col gap-[20px] p-[20px]">
          {userBank && (
            <div className="w-full bg-white rounded-[10px] flex flex-col gap-[5px] px-[20px] py-[20px]">
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-[10px]">
                  <img
                    src="/bank/toss.png"
                    alt="bank-logo"
                    className="size-[30px] border rounded-[10px]"
                  />
                  <p className="text-xl">내 {userBank.bank} 계좌</p>
                </div>
                <Link
                  to="/mypage/edit/bank-account"
                  className="text-[14px] text-main-darkGray flex gap-[2px] items-center"
                >
                  <span>내 계좌 변경</span>
                  <ArrowRightIcon width={20} height={20} color="#717171" />
                </Link>
              </div>
              <p className="text-main-darkGray text-[14px]">
                입출금 {userBank.account}
              </p>
              <div className="flex gap-[10px] items-center">
                <div className="flex gap-[4px] items-center">
                  <span className="text-[20px] font-bold">
                    {isHiddenBalance ? "---,---,---" : "300,422,521"}
                  </span>
                  <span className="font-light">원</span>
                </div>
                <button onClick={() => setIsHiddenBalance((prev) => !prev)}>
                  {isHiddenBalance ? (
                    <CloseEyeIcon color="#717171" />
                  ) : (
                    <OpenEyeIcon color="#717171" />
                  )}
                </button>
              </div>
            </div>
          )}

          <span className="text-[18px]">거래 내역</span>
          <div className="w-full flex flex-col gap-[10px]">
            <div className="flex justify-between items-center">
              <button onClick={() => sliderRef.current?.slickPrev()}>
                <ArrowLeftIcon width={24} height={24} color="#717171" />
              </button>
              <div className="flex gap-[10px] items-center">
                <div className="relative">
                  <select
                    value={selectedYear}
                    onChange={handleYearChange}
                    className="appearance-none pl-[20px] pr-[40px] h-[40px] text-center rounded-[10px] border border-main-gray"
                  >
                    {years.map((year) => (
                      <option key={year} value={year}>
                        {year}년
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2 z-5">
                    <ArrowDownIcon color="#717171" />
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={months[selectedMonthIndex]}
                    onChange={handleMonthChange}
                    className="appearance-none pl-[20px] pr-[40px] h-[40px] text-center rounded-[10px] border border-main-gray"
                  >
                    {months.map((month, index) => (
                      <option key={month} value={month}>
                        {month}월
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
                    <ArrowDownIcon color="#717171" />
                  </div>
                </div>
              </div>
              <button onClick={() => sliderRef.current?.slickNext()}>
                <ArrowRightIcon width={24} height={24} color="#717171" />
              </button>
            </div>

            <Slider ref={sliderRef} {...settings}>
              {months.map((month) => (
                <div
                  key={month}
                  className="px-[20px] bg-white rounded-[10px] max-h-[500px] overflow-y-scroll"
                >
                  {transactions[selectedYear][month].length > 0 ? (
                    transactions[selectedYear][month].map((tx) => (
                      <div
                        key={tx.id}
                        className="py-[20px] border-b last:border-none"
                      >
                        <p className="text-sm text-gray-500">{tx.date}</p>
                        <p className="text-lg font-medium">{tx.receiver}</p>
                        <p
                          className={`${
                            tx.type === "입금" ? "text-main-color" : "text-warn"
                          } font-semibold`}
                        >
                          {tx.type === "입금" ? "+" : "-"}
                          {tx.amount.toLocaleString()}원
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-center text-gray-400">거래 내역 없음</p>
                  )}
                </div>
              ))}
            </Slider>
          </div>
        </div>
      </Main>
    </>
  );
};

export default BankAccountPage;
