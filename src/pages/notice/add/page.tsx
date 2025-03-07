import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import Main from "@/components/Main";
import React, { useState } from "react";
import {
  dayOptions,
  hireOptions,
  jopOptions,
  payOptions,
  schoolOptions,
  schoolStateOptions,
} from "./options";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import DaumPostcode from "react-daum-postcode";
import Modal from "@/components/Modal";
import CustomDatePicker from "./Calendar";
import CalendarIcon from "@/components/icons/Calendar";
import ClockIcon from "@/components/icons/Clock";
import { useAppSelector } from "@/hooks/useRedux";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AddressModal = Modal;

interface PostcodeData {
  zonecode: string; // 우편번호
  address: string; // 기본 주소
}

interface Pay {
  type: string;
  value: number;
}

interface DeadLineTime {
  date: Date;
  time: Date;
}
interface NoticeTime {
  start: Date;
  end: Date;
}

interface PeriodTime extends NoticeTime {
  discussion: boolean;
}

interface WorkTime extends NoticeTime {
  discussion: boolean;
}
interface RestTime extends NoticeTime {}

const NoticeAddPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const navigate = useNavigate();

  const [jobType, setJobType] = useState("");
  const [pay, setPay] = useState<Pay>({
    type: "시급",
    value: 0,
  });
  const [hireType, setHireType] = useState<string[]>(["일일"]);
  const [period, setPeriod] = useState<PeriodTime | null>({
    start: new Date(),
    end: new Date(),
    discussion: false,
  });
  const [hour, setHour] = useState<WorkTime | null>({
    start: new Date(),
    end: new Date(),
    discussion: false,
  });
  const [restTime, setRestTime] = useState<RestTime | null>({
    start: new Date(),
    end: new Date(),
  });
  const [day, setDay] = useState<string[]>(["월"]);
  const [workDetail, setWorkDetail] = useState("");
  const [welfare, setWelfare] = useState("");
  const [postDetail, setPostDetail] = useState("");
  const [deadline, setDeadline] = useState<DeadLineTime | null>({
    date: new Date(),
    time: new Date(),
  });
  const [person, setPerson] = useState(0);
  const [preferences, setPreferences] = useState("무관");
  const [education, setEducation] = useState({ school: "무관", state: "" });
  const [address, setAddress] = useState({
    zipcode: "",
    street: "",
    detail: "",
  });
  const [recruiter, setRecruiter] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [isOpenAddressModal, setIsOpenAddressModal] = useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 팝업 열림 상태

  const handleSetType = (
    state: string[],
    setState: Function,
    option: string
  ) => {
    if (state.includes(option)) {
      setState(state.filter((item) => item !== option));
    } else {
      setState([...state, option]);
    }
  };

  const handlePostcodeComplete = (data: PostcodeData) => {
    setAddress({ ...address, zipcode: data.zonecode, street: data.address }); // 기본 주소
    setIsOpenAddressModal(false);
    setIsPostcodeOpen(false);
  };

  const handleSubmitNotice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("📝 현재 상태 목록:");
    console.log("💼 직종:", jobType);
    console.log("💰 급여:", pay);
    console.log("📌 고용 형태:", hireType);
    console.log("📅 근무 기간:", period);
    console.log("⏳ 근무 시간:", hour);
    console.log("☕ 휴식 시간:", restTime);
    console.log("📆 근무 요일:", day);
    console.log("🛠 업무 상세:", workDetail);
    console.log("🎁 복리후생:", welfare);
    console.log("📝 공고 상세:", postDetail);
    console.log("🕒 모집 마감:", deadline);
    console.log("👥 모집 인원:", person);
    console.log("✅ 우대 사항:", preferences);
    console.log("🎓 학력:", education);
    console.log("🏠 주소:", address);
    console.log("📞 채용 담당자:", recruiter);
    if (person <= 0 || !address.zipcode || !address.street) {
      return;
    }

    if (userId) {
      try {
        await axios.post("/api/post/notice", {
          jobType,
          pay,
          hireType,
          period,
          hour,
          restTime,
          day,
          workDetail,
          welfare,
          postDetail,
          deadline,
          person,
          preferences,
          education,
          address,
          recruiter,
          author: userId,
        });

        navigate(`/notice/123`);
      } catch (error) {
        alert("error");
        console.log(error);
      }
    }
  };

  return (
    <>
      <Header>
        <div className="p-layout h-full flex flex-wrap content-center">
          <ArrowLeftIcon width={24} height={24} />
          <span>공고 등록</span>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <div className="w-full flex flex-col relative">
          <form
            className="w-full p-layout flex flex-col gap-layout divide-[#0b798b] relative"
            onSubmit={handleSubmitNotice}
          >
            <div className="flex flex-col gap-[5px]">
              <b>
                직종 <b className="text-warn">*</b>
              </b>
              <div className="w-full relative">
                <select
                  className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none appearance-none"
                  onChange={(e) => setJobType(e.target.value)}
                  value={jobType}
                >
                  {jopOptions.map((jopOption, index) => (
                    <option key={jopOption} value={jopOption}>
                      {jopOption}
                    </option>
                  ))}
                </select>
                <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
                  <ArrowDownIcon color="#717171" />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b>
                급여 <b className="text-warn">*</b>
              </b>
              <div className="flex gap-[10px]">
                <div className="relative">
                  <select
                    className="w-[150px] rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none appearance-none relative"
                    onChange={(e) => setPay({ ...pay, type: e.target.value })}
                    value={pay.type}
                  >
                    {payOptions.map((payOption, index) => (
                      <option key={payOption} value={payOption}>
                        {payOption}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
                    <ArrowDownIcon color="#717171" />
                  </div>
                </div>
                <div className="relative flex-grow">
                  <input
                    type="text"
                    value={pay.value}
                    onChange={(e) =>
                      setPay({
                        ...pay,
                        value: Number(e.target.value.replace(/[^\d]/g, "")),
                      })
                    }
                    onFocus={(e) => {
                      e.target.value =
                        pay.value === 0 ? "" : pay.value.toString();
                    }}
                    onBlur={(e) =>
                      (e.target.value = pay.value.toLocaleString())
                    }
                    required
                    className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none"
                  />
                  <span className="absolute right-[10px] top-1/2 -translate-y-1/2">
                    원
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[5px]">
              <b>
                고용형태 <b className="text-warn">*</b>
              </b>
              <div className="w-full flex gap-[10px]">
                {hireOptions.map((hireOption, index) => (
                  <button
                    key={hireOption}
                    type="button"
                    className={`w-full ${
                      hireType.includes(hireOption)
                        ? "text-white bg-main-color"
                        : "text-main-darkGray bg-white border border-main-gray"
                    } h-[40px] rounded-[10px]`}
                    onClick={() =>
                      handleSetType(hireType, setHireType, hireOption)
                    }
                  >
                    {hireOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <p className="w-full flex justify-between">
                <b>
                  근무기간 <b className="text-warn">*</b>
                </b>
                <div className="flex gap-[10px]">
                  <label htmlFor="period-discussion">기간 협의 가능</label>
                  <input
                    type="checkbox"
                    checked={period?.discussion}
                    onChange={(e) =>
                      setPeriod({
                        ...period,
                        discussion: e.target.checked,
                      } as PeriodTime)
                    }
                    id="period-discussion"
                  />
                </div>
              </p>
              <div className="flex gap-[10px]">
                <CustomDatePicker
                  selected={period?.start || null}
                  setSelectedDate={(date) =>
                    setPeriod((prev) =>
                      prev ? { ...prev, start: date! } : null
                    )
                  }
                  icon={<CalendarIcon color="#717171" />}
                  placeholder="시작 날짜"
                  mode="date"
                  value={period?.start}
                />
                <CustomDatePicker
                  selected={period?.end || null}
                  setSelectedDate={(date) =>
                    setPeriod((prev) => (prev ? { ...prev, end: date! } : null))
                  }
                  icon={<CalendarIcon color="#717171" />}
                  placeholder="종료 날짜"
                  mode="date"
                  value={period?.end}
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <p className="w-full flex justify-between">
                <b>
                  근무시간 <b className="text-warn">*</b>
                </b>
                <div className="flex gap-[10px]">
                  <label htmlFor="hour-discussion">시간 협의 가능</label>
                  <input
                    type="checkbox"
                    checked={hour?.discussion}
                    onChange={(e) =>
                      setHour({
                        ...hour,
                        discussion: e.target.checked,
                      } as WorkTime)
                    }
                    id="hour-discussion"
                  />
                </div>
              </p>
              <div className="flex gap-[10px]">
                <CustomDatePicker
                  selected={hour?.start || null}
                  setSelectedDate={(date) =>
                    setHour((prev) => (prev ? { ...prev, start: date! } : null))
                  }
                  icon={<ClockIcon color="#717171" />}
                  placeholder="출근 시각"
                  mode="time"
                  value={hour?.start}
                />
                <CustomDatePicker
                  selected={hour?.end || null}
                  setSelectedDate={(date) =>
                    setHour((prev) => (prev ? { ...prev, end: date! } : null))
                  }
                  icon={<ClockIcon color="#717171" />}
                  placeholder="퇴근 시각"
                  mode="time"
                  value={hour?.end}
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b>
                휴게시간 <b className="text-warn">*</b>
              </b>
              <div className="flex gap-[10px]">
                <CustomDatePicker
                  selected={restTime?.start || null}
                  setSelectedDate={(date) =>
                    setRestTime((prev) =>
                      prev ? { ...prev, start: date! } : null
                    )
                  }
                  icon={<ClockIcon color="#717171" />}
                  placeholder="휴식 시작"
                  mode="time"
                  value={restTime?.start}
                />
                <CustomDatePicker
                  selected={restTime?.end || null}
                  setSelectedDate={(date) =>
                    setRestTime((prev) =>
                      prev ? { ...prev, end: date! } : null
                    )
                  }
                  icon={<ClockIcon color="#717171" />}
                  placeholder="휴식 종료"
                  mode="time"
                  value={restTime?.end}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[5px]">
              <b>
                근무요일 <b className="text-warn">*</b>
              </b>
              <div className="w-full flex gap-[10px]">
                {dayOptions.map((dayOption, index) => (
                  <button
                    key={dayOption}
                    type="button"
                    className={`w-full ${
                      day.includes(dayOption)
                        ? "text-white bg-main-color"
                        : "text-main-darkGray bg-white border border-main-gray"
                    } h-[40px] rounded-[10px]`}
                    onClick={() => handleSetType(day, setDay, dayOption)}
                  >
                    {dayOption}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-[5px]">
              <b>근무상세</b>
              <textarea
                className="w-full resize-none outline-none rounded-[10px] border border-main-gray p-[10px]"
                placeholder="근무 상세 설명을 작성해주세요"
                value={workDetail}
                onChange={(e) => setWorkDetail(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <b>복리후생</b>
              <textarea
                className="w-full resize-none outline-none rounded-[10px] border border-main-gray p-[10px]"
                placeholder="복리후생을 작성해주세요"
                value={welfare}
                onChange={(e) => setWelfare(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <b>상세요강</b>
              <textarea
                className="w-full resize-none outline-none rounded-[10px] border border-main-gray p-[10px]"
                placeholder="추가할 html 내용을 작성해주세요"
                value={postDetail}
                onChange={(e) => setPostDetail(e.target.value)}
                rows={5}
              />
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b>
                모집마감 <b className="text-warn">*</b>
              </b>
              <div className="flex gap-[10px]">
                <CustomDatePicker
                  selected={deadline?.date || null}
                  setSelectedDate={(date) =>
                    setDeadline((prev) =>
                      prev ? { ...prev, date: date! } : null
                    )
                  }
                  icon={<CalendarIcon color="#717171" />}
                  placeholder="모집 마감날짜"
                  mode="date"
                  value={deadline?.date}
                />
                <CustomDatePicker
                  selected={deadline?.time || null}
                  setSelectedDate={(date) =>
                    setDeadline((prev) =>
                      prev ? { ...prev, time: date! } : null
                    )
                  }
                  icon={<ClockIcon color="#717171" />}
                  placeholder="모집 마감시간"
                  mode="time"
                  value={deadline?.time}
                />
              </div>
            </div>

            <div className="flex flex-col gap-[5px]">
              <b>
                모집인원 <b className="text-warn">*</b>
              </b>
              <div className="relative">
                <input
                  type="text"
                  value={person}
                  onChange={(e) =>
                    setPerson(Number(e.target.value.replace(/[^\d]/g, "")))
                  }
                  onFocus={(e) => {
                    e.target.value = person === 0 ? "" : person.toString();
                  }}
                  onBlur={(e) => (e.target.value = person.toLocaleString())}
                  required
                  className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none"
                />
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2">
                  명
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-[5px]">
              <b>우대사항</b>
              <textarea
                className="w-full resize-none outline-none rounded-[10px] border border-main-gray p-[10px]"
                placeholder="우대사항을 작성해주세요"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={5}
              />
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b>
                학력제한 <b className="text-warn">*</b>
              </b>
              <div className="flex gap-[10px]">
                <div className="w-full relative">
                  <select
                    className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none appearance-none relative"
                    onChange={(e) =>
                      setEducation({ ...education, school: e.target.value })
                    }
                  >
                    {schoolOptions.map((schoolOption, index) => (
                      <option key={schoolOption} value={schoolOption}>
                        {schoolOption}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
                    <ArrowDownIcon color="#717171" />
                  </div>
                </div>
                <div className="w-full relative">
                  <select
                    className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none appearance-none relative"
                    onChange={(e) =>
                      setEducation({ ...education, state: e.target.value })
                    }
                  >
                    {education.school === "무관" ? (
                      <option key="무관" value="무관">
                        무관
                      </option>
                    ) : (
                      schoolStateOptions.map((stateOption, index) => (
                        <option key={stateOption} value={stateOption}>
                          {stateOption}
                        </option>
                      ))
                    )}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
                    <ArrowDownIcon color="#717171" />
                  </div>
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b>
                주소지 등록 <b className="text-warn">*</b>
              </b>
              <div className="w-full flex flex-col gap-[10px]">
                <div className="w-full flex gap-[10px]">
                  <input
                    type="text"
                    placeholder="우편번호"
                    value={address.zipcode}
                    readOnly
                    className="flex-grow rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpenAddressModal(true);
                      setIsPostcodeOpen(true);
                    }}
                    className="px-[20px] rounded-[10px] h-[40px] bg-main-color text-white"
                  >
                    주소 검색
                  </button>
                </div>
                <input
                  type="text"
                  placeholder="주소"
                  readOnly
                  value={address.street}
                  className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none"
                />
                <input
                  type="text"
                  placeholder="상세주소"
                  value={address.detail}
                  className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none"
                />
              </div>
            </div>

            <div className="w-full h-[1px] border border-main-color opacity-30" />

            <div className="w-full flex flex-col gap-[5px]">
              <b>채용담당</b>
              <div className="flex flex-col gap-[10px]">
                <div className="flex gap-[10px] items-center">
                  <span className="basis-[50px] text-main-darkGray">이름</span>
                  <input
                    placeholder="채용 담당자명"
                    className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none"
                    value={recruiter.name}
                    onChange={(e) =>
                      setRecruiter({ ...recruiter, name: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-[10px] items-center">
                  <span className="basis-[50px] text-main-darkGray">
                    이메일
                  </span>
                  <input
                    placeholder="비공개"
                    className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none"
                    value={recruiter.email}
                    onChange={(e) =>
                      setRecruiter({ ...recruiter, email: e.target.value })
                    }
                  />
                </div>
                <div className="flex gap-[10px] items-center">
                  <span className="basis-[50px] text-main-darkGray">
                    연락처
                  </span>
                  <input
                    placeholder="비공개"
                    className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none"
                    value={recruiter.phone}
                    onChange={(e) =>
                      setRecruiter({ ...recruiter, phone: e.target.value })
                    }
                  />
                </div>
              </div>
            </div>

            <button className="w-full h-[50px] bg-main-color rounded-[10px] text-white">
              공고 등록
            </button>
          </form>

          <AddressModal
            isOpen={isOpenAddressModal}
            setIsOpen={setIsOpenAddressModal}
          >
            {isPostcodeOpen && (
              <DaumPostcode
                onComplete={handlePostcodeComplete} // 주소 선택 시 실행되는 함수
                autoClose
              />
            )}
          </AddressModal>
        </div>
      </Main>
      <BottomNav />
    </>
  );
};

export default NoticeAddPage;
