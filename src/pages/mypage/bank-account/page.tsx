import React, { useEffect, useRef, useState } from "react";
import Header from "@/components/Header";
import Main from "@/components/Main";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { useAppSelector } from "@/hooks/useRedux";
import Slider from "react-slick";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import getUser, { type User } from "@/hooks/fetchUser";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CloseEyeIcon from "@/components/icons/CloseEye";
import OpenEyeIcon from "@/components/icons/OpenEye";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import postBank from "@/hooks/fetchBank";

interface Transaction {
  id: number;
  date: string;
  amount: number;
  receiver: string;
  type: "입금" | "출금";
}

const transactions: Record<string, Record<string, Transaction[]>> = {
  "2024": {
    "01": [
      {
        id: 1,
        date: "2024-01-05",
        amount: 45000,
        receiver: "김민수",
        type: "입금",
      },
      {
        id: 2,
        date: "2024-01-15",
        amount: 75000,
        receiver: "박지윤",
        type: "출금",
      },
    ],
    "02": [
      {
        id: 3,
        date: "2024-02-10",
        amount: 98000,
        receiver: "이영호",
        type: "입금",
      },
    ],
  },
  "2025": {
    "01": [
      {
        id: 4,
        date: "2025-01-05",
        amount: 50000,
        receiver: "김철수",
        type: "입금",
      },
      {
        id: 5,
        date: "2025-01-10",
        amount: 30000,
        receiver: "박영희",
        type: "출금",
      },
    ],
    "02": [
      {
        id: 6,
        date: "2025-02-02",
        amount: 20000,
        receiver: "이민호",
        type: "입금",
      },
      {
        id: 7,
        date: "2025-02-15",
        amount: 100000,
        receiver: "최지은",
        type: "출금",
      },
    ],
    "03": [
      {
        id: 8,
        date: "2025-03-03",
        amount: 150000,
        receiver: "오정우",
        type: "입금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "출금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "출금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
      {
        id: 9,
        date: "2025-03-20",
        amount: 50000,
        receiver: "강나래",
        type: "입금",
      },
    ],
    "04": [
      {
        id: 6,
        date: "2025-02-02",
        amount: 20000,
        receiver: "이민호",
        type: "입금",
      },
      {
        id: 7,
        date: "2025-02-15",
        amount: 100000,
        receiver: "최지은",
        type: "출금",
      },
    ],
  },
};

interface History {
  Header: {};
  Iqtcnt: string;
  REC: { [key: string]: string }[];
  Totcnt: string;
}

const BankAccountPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [selectedYear, setSelectedYear] = useState<string>("2025");
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(0);
  const [isHiddenhistory, setIsHiddenhistory] = useState(false);
  const [userBank, setUserBank] = useState<User["bankAccount"] | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const navigate = useNavigate();

  // const years: number[] = [];
  // for (let i = new Date().getFullYear(); i > 1999; i--) {
  //   years.push(i);
  // }
  // const months = [
  //   "01",
  //   "02",
  //   "03",
  //   "04",
  //   "05",
  //   "06",
  //   "07",
  //   "08",
  //   "09",
  //   "10",
  //   "11",
  //   "12",
  // ];

  const years = Object.keys(transactions);
  const months = Object.keys(transactions[selectedYear]);

  const [userData, setUserData] = useState<User | null>(null);
  const [history, setHistory] = useState<History>();
  const [balance, setBalance] = useState();

  useEffect(() => {
    const fetchUserBankAccount = async () => {
      if (!userId) return;
      const response = await getUser(userId);
      setUserData(response);
      setUserBank(response.bankAccount);
    };

    fetchUserBankAccount();
  }, [userId]);

  useEffect(() => {
    const fetchUserBankAccount = async () => {
      if (!userData) return;
      let Ineymd = new Date(
        Number(selectedYear),
        Number(months[selectedMonthIndex]),
        0
      );
      Ineymd = Ineymd > new Date() ? new Date() : Ineymd;
      const tmpData = {
        Bncd: "011",
        Acno: userData.bankAccount.account,
        Insymd: selectedYear + months[selectedMonthIndex] + "01",
        Ineymd: selectedYear + months[selectedMonthIndex] + Ineymd.getDate(),
        TrnsDsnc: "A",
        Lnsq: "DESC",
        PageNo: "1",
        Dmcnt: "100",
      };

      const historyInfo = await postBank("InquireTransactionHistory", tmpData);
      if (historyInfo.Header.Rsms !== "정상처리 되었습니다.") {
        alert("조회기간이 잘못되었습니다.");
      } else {
        setHistory(historyInfo);
      }
      const Ldbl = await postBank("InquireBalance", { FinAcno: true });
      setBalance(Ldbl.Ldbl);
    };

    fetchUserBankAccount();
  }, [userData, selectedYear, months[selectedMonthIndex]]);

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
  console.log(history?.REC);

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
      {userBank && (
        <Main hasBottomNav={false}>
          <div className="size-full flex flex-col gap-[20px] p-[20px]">
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
                  {balance && (
                    <span className="text-[20px] font-bold">
                      {isHiddenhistory
                        ? "---,---,---"
                        : Number(balance).toLocaleString()}
                    </span>
                  )}
                  <span className="font-light">원</span>
                </div>
                <button onClick={() => setIsHiddenhistory((prev) => !prev)}>
                  {isHiddenhistory ? (
                    <CloseEyeIcon color="#717171" />
                  ) : (
                    <OpenEyeIcon color="#717171" />
                  )}
                </button>
              </div>
            </div>

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
                    {/* {transactions[selectedYear][month].length > 0 ? (
                      transactions[selectedYear][month].map((tx) => (
                        <div
                          key={tx.id}
                          className="py-[20px] border-b last:border-none"
                        >
                          <p className="text-sm text-gray-500">{tx.date}</p>
                          <p className="text-lg font-medium">{tx.receiver}</p>
                          <p
                            className={`${
                              tx.type === "입금"
                                ? "text-main-color"
                                : "text-warn"
                            } font-semibold`}
                          >
                            {tx.type === "입금" ? "+" : "-"}
                            {tx.amount.toLocaleString()}원
                          </p>
                        </div>
                      ))
                    ) : (
                      <p className="text-center text-gray-400">
                        거래 내역 없음
                      </p>
                    )} */}
                    {history?.REC.length ? (
                      history.REC.map(
                        ({
                          BnprCntn,
                          Tram,
                          Trdd,
                          TrnsAfAcntBlncSmblCd,
                          Tuno,
                        }) => (
                          <div
                            key={Tuno}
                            className="py-[20px] border-b last:border-none"
                          >
                            <p className="text-sm text-gray-500">
                              {Trdd.slice(0, 4)}-{Trdd.slice(4, 6)}-
                              {Trdd.slice(6)}
                            </p>
                            <p className="text-lg font-medium">{BnprCntn}</p>
                            <p
                              className={`${
                                TrnsAfAcntBlncSmblCd === "+"
                                  ? "text-main-color"
                                  : "text-warn"
                              } font-semibold`}
                            >
                              {TrnsAfAcntBlncSmblCd}
                              {Number(Tram).toLocaleString()}원
                            </p>
                          </div>
                        )
                      )
                    ) : (
                      <p className="text-center text-gray-400">
                        거래 내역 없음
                      </p>
                    )}
                  </div>
                ))}
              </Slider>
            </div>
          </div>
        </Main>
      )}
    </>
  );
};

export default BankAccountPage;
