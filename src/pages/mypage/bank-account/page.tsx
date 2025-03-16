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
import { Link, useNavigate } from "react-router-dom";
import CloseEyeIcon from "@/components/icons/CloseEye";
import OpenEyeIcon from "@/components/icons/OpenEye";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import postBank from "@/hooks/fetchBank";

interface History {
  Header: {};
  Iqtcnt: string;
  REC: { [key: string]: string }[];
  Totcnt: string;
}

const BankAccountPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [selectedYear, setSelectedYear] = useState<string>(
    new Date().getFullYear().toString()
  );
  const [selectedMonthIndex, setSelectedMonthIndex] = useState<number>(
    selectedYear === new Date().getFullYear().toString()
      ? new Date().getMonth()
      : new Date().getMonth() + 1
  );
  const [isHiddenhistory, setIsHiddenhistory] = useState(false);
  const [userBank, setUserBank] = useState<User["bankAccount"] | null>(null);
  const sliderRef = useRef<Slider | null>(null);
  const navigate = useNavigate();

  const years: number[] = [
    new Date().getFullYear(),
    new Date().getFullYear() - 1,
  ];
  const months = [
    "01",
    "02",
    "03",
    "04",
    "05",
    "06",
    "07",
    "08",
    "09",
    "10",
    "11",
    "12",
  ];

  const [userData, setUserData] = useState<User | null>(null);
  const [history, setHistory] = useState<History>();
  const [balance, setBalance] = useState();

  useEffect(() => {
    const fetchUserBankAccount = async () => {
      if (!userId) return;
      const response = await getUser(userId);
      if (response) {
        setUserData(response);
        setUserBank(response.bankAccount);
      }
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
      const Acno = userData.bankAccount.account.startsWith("3020000012")
        ? userData.bankAccount.account
        : "3020000012627";

      const tmpData = {
        Bncd: "011",
        Acno,
        Insymd: selectedYear + months[selectedMonthIndex] + "01",
        Ineymd: selectedYear + months[selectedMonthIndex] + Ineymd.getDate(),
        TrnsDsnc: "A",
        Lnsq: "DESC",
        PageNo: "1",
        Dmcnt: "100",
      };

      const historyInfo = await postBank(
        "InquireTransactionHistory",
        tmpData,
        Acno
      );

      if (historyInfo.error) return;
      if (historyInfo.Header.Rsms !== "정상처리 되었습니다.") {
        alert("조회기간이 잘못되었습니다.");
      } else {
        setHistory(historyInfo);
      }
      const Ldbl = await postBank(
        "InquireBalance",
        { FinAcno: true },
        userData.bankAccount.account
      );
      setBalance(Ldbl.Ldbl);
    };

    fetchUserBankAccount();
  }, [userData, selectedYear, months[selectedMonthIndex]]);

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    setSelectedYear(newYear);
    setSelectedMonthIndex(
      newYear === new Date().getFullYear().toString()
        ? new Date().getMonth()
        : new Date().getMonth() + 1
    );
    if (sliderRef.current) sliderRef.current.slickGoTo(0);
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonthIndex = months.indexOf(e.target.value);
    setSelectedMonthIndex(newMonthIndex);
    if (sliderRef.current) sliderRef.current.slickGoTo(newMonthIndex);
  };

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    fade: true,
    slidesToShow: 1,
    slidesToScroll: 1,
  };

  return (
    <>
      <Header>
        <div className="p-layout h-full flex flex-wrap content-center bg-main-color">
          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeftIcon className="text-white" />
          </button>
          <span className="absolute left-1/2 -translate-x-1/2 font-bold text-white">
            내 계좌 관리
          </span>
        </div>
      </Header>
      {userBank && (
        <Main hasBottomNav={false}>
          <div className="size-full flex flex-col gap-[20px] p-[20px]">
            <div className="w-full bg-white border border-main-gray rounded-[10px] flex flex-col gap-[5px] px-[20px] py-[20px]">
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
                      {selectedYear === new Date().getFullYear().toString()
                        ? months.map((month, index) => (
                            <option
                              key={month}
                              value={month}
                              className={`${
                                index > new Date().getMonth() ? "hidden" : ""
                              }`}
                            >
                              {month}월
                            </option>
                          ))
                        : months.map((month, index) => (
                            <option
                              key={month}
                              value={month}
                              className={`${
                                index < new Date().getMonth() + 1
                                  ? "hidden"
                                  : ""
                              }`}
                            >
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
                    {history?.REC.length ? (
                      history.REC.map(
                        ({
                          BnprCntn,
                          Tram,
                          Trdd,
                          TrnsAfAcntBlncSmblCd,
                          MnrcDrotDsnc,
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
                                Number(MnrcDrotDsnc) < 3
                                  ? "text-main-color"
                                  : "text-warn"
                              } font-semibold`}
                            >
                              {Number(MnrcDrotDsnc) < 3 ? "+" : "-"}
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
