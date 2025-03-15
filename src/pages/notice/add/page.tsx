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
} from "../options";
import ArrowDownIcon from "@/components/icons/ArrowDown";
import DaumPostcode from "react-daum-postcode";
import Modal from "@/components/Modal";
import CustomDatePicker from "../Calendar";
import CalendarIcon from "@/components/icons/Calendar";
import ClockIcon from "@/components/icons/Clock";
import { useAppSelector } from "@/hooks/useRedux";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import useGeocode from "@/hooks/useGeocode";
import PlusIcon from "@/components/icons/Plus";
import CancelIcon from "@/components/icons/Cancel";
import InputComponent from "@/components/Input";

const AddressModal = Modal;
const AddNoticeResultModal = Modal;

interface PostcodeData {
  zonecode: string; // 우편번호
  address: string; // 기본 주소
}

interface Pay {
  type: string;
  value: number;
}

interface DeadLineTime {
  date: Date | null;
  time: Date | null;
}
interface NoticeTime {
  start: Date | null;
  end: Date | null;
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
  const { getCoordinates } = useGeocode();

  const [title, setTitle] = useState("");
  const [jobType, setJobType] = useState("전체");
  const [pay, setPay] = useState<Pay>({
    type: "시급",
    value: 0,
  });
  const [hireType, setHireType] = useState<string[]>(["일일"]);
  const [period, setPeriod] = useState<PeriodTime | null>({
    start: null,
    end: null,
    discussion: false,
  });
  const [hour, setHour] = useState<WorkTime | null>({
    start: null,
    end: null,
    discussion: false,
  });
  const [restTime, setRestTime] = useState<RestTime | null>({
    start: null,
    end: null,
  });
  const [day, setDay] = useState<string[]>(["월"]);
  const [workDetail, setWorkDetail] = useState("");
  const [welfare, setWelfare] = useState("");
  const [postDetail, setPostDetail] = useState("");
  const [deadline, setDeadline] = useState<DeadLineTime | null>({
    date: null,
    time: null,
  });
  const [person, setPerson] = useState(0);
  const [preferences, setPreferences] = useState("");
  const [education, setEducation] = useState({ school: "무관", state: "무관" });
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
  const [isOpenAddNoticeResultModal, setIsOpenAddNoticeResultModal] =
    useState(false);
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 팝업 열림 상태
  const [postId, setPostId] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

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

  const handleImages = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);

      // 🔥 5개 초과하면 업로드 불가
      if (selectedFiles.length + images.length > 5) {
        alert("최대 5개의 이미지만 업로드할 수 있습니다.");
        return;
      }

      setImages((prev) => [...prev, ...selectedFiles]);
      setImagePreviews((prev) => [
        ...prev,
        ...selectedFiles.map((file) => URL.createObjectURL(file)),
      ]);
    }
  };

  const handleImageDelete = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index)); // 선택한 이미지 제거
    setImagePreviews((prev) => prev.filter((_, i) => i !== index)); // 미리보기 이미지도 제거
  };

  const handleSubmitNotice = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      !title ||
      hireType.length <= 0 ||
      day.length <= 0 ||
      pay.value <= 0 ||
      person <= 0 ||
      !address.zipcode ||
      !address.street
    ) {
      alert("입력하지 않은 정보가 존재합니다");
      return;
    }

    const coords = await getCoordinates(address.street);

    if (userId) {
      try {
        // 🔥 FormData 객체 생성
        const formData = new FormData();
        formData.append("title", title);
        formData.append("jobType", jobType);
        formData.append("pay", JSON.stringify(pay));
        formData.append("hireType", JSON.stringify(hireType));
        formData.append("period", JSON.stringify(period));
        formData.append("hour", JSON.stringify(hour));
        formData.append("restTime", JSON.stringify(restTime));
        formData.append("day", JSON.stringify(day));
        formData.append("workDetail", workDetail);
        formData.append("welfare", JSON.stringify(welfare));
        formData.append("postDetail", postDetail);
        formData.append("deadline", JSON.stringify(deadline));
        formData.append("person", person.toString());
        formData.append("preferences", JSON.stringify(preferences));
        formData.append("education", JSON.stringify(education));
        formData.append(
          "address",
          JSON.stringify({
            ...address,
            lat: coords?.lat,
            lng: coords?.lng,
          })
        );
        formData.append("recruiter", JSON.stringify(recruiter));
        formData.append("author", userId);

        // 🔥 이미지 개별 추가
        images.forEach((image) => {
          formData.append("images", image);
        });

        const response = await axios.post("/api/post/notice", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        const { postId } = response.data;
        setIsOpenAddNoticeResultModal(true);
        setPostId(postId.toString());
      } catch (error) {
        console.error("공고 등록 오류:", error);
        alert("공고 등록 중 오류가 발생했습니다.");
      }
    } else {
      alert("잠시 후에 시도해주세요");
    }
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
            공고 등록
          </span>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="w-full flex flex-col relative bg-white">
          <form
            className="w-full p-layout flex flex-col gap-layout relative"
            onSubmit={handleSubmitNotice}
          >
            <div className="flex flex-col gap-[5px]">
              <b className="text-lg">
                공고제목 <b className="text-main-warn">*</b>
              </b>
              <InputComponent
                type="text"
                placeholder="공고 제목을 작성해주세요"
                width="100%"
                height="40px"
                padding="0 10px"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <b className="text-lg">
                직종 <b className="text-main-warn">*</b>
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
                  <ArrowDownIcon className="text-main-darkGray" />
                </div>
              </div>
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b className="text-lg">
                급여 <b className="text-main-warn">*</b>
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
                    <ArrowDownIcon className="text-main-darkGray" />
                  </div>
                </div>
                <div className="relative flex-grow">
                  <InputComponent
                    type="text"
                    height="40px"
                    width="100%"
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
                  />
                  <span className="absolute right-[10px] top-1/2 -translate-y-1/2">
                    원
                  </span>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[5px]">
              <b className="text-lg">
                고용형태 <b className="text-main-warn">*</b>
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
                <b className="text-lg">
                  근무기간 <b className="text-main-warn">*</b>
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
              <div className="w-full flex justify-between items-center">
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
                <span className="mx-[10px]">~</span>
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
              <div className="w-full flex justify-between">
                <b className="text-lg">
                  근무시간 <b className="text-main-warn">*</b>
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
              </div>
              <div className="w-full flex justify-between items-center">
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
                <span className="mx-[10px]">~</span>
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
              <b className="text-lg">
                휴게시간 <b className="text-main-warn">*</b>
              </b>
              <div className="w-full flex justify-between items-center">
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
                <span className="mx-[10px]">~</span>
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
              <b className="text-lg">
                근무요일 <b className="text-main-warn">*</b>
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
              <b className="text-lg">근무상세</b>
              <textarea
                className="w-full resize-none outline-none rounded-[10px] border border-main-gray p-[10px]"
                placeholder="근무 상세 설명을 작성해주세요"
                value={workDetail}
                onChange={(e) => setWorkDetail(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <b className="text-lg">복리후생</b>
              <textarea
                className="w-full resize-none outline-none rounded-[10px] border border-main-gray p-[10px]"
                placeholder="복리후생을 작성해주세요"
                value={welfare}
                onChange={(e) => setWelfare(e.target.value)}
                rows={5}
              />
            </div>

            <div className="flex flex-col gap-[5px]">
              <b className="text-lg">상세요강</b>
              <textarea
                className="w-full resize-none outline-none rounded-[10px] border border-main-gray p-[10px]"
                placeholder="추가할 html 내용을 작성해주세요"
                value={postDetail}
                onChange={(e) => setPostDetail(e.target.value)}
                rows={5}
              />
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b className="text-lg">
                모집마감 <b className="text-main-warn">*</b>
              </b>
              <div className="w-full flex justify-between items-center">
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
                <span className="mx-[10px]">-</span>
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
              <b className="text-lg">
                모집인원 <b className="text-main-warn">*</b>
              </b>
              <div className="w-fit relative">
                <InputComponent
                  type="text"
                  height="40px"
                  value={person}
                  onChange={(e) =>
                    setPerson(Number(e.target.value.replace(/[^\d]/g, "")))
                  }
                  onFocus={(e) => {
                    e.target.value = person === 0 ? "" : person.toString();
                  }}
                  onBlur={(e) => (e.target.value = person.toLocaleString())}
                  required
                  padding="0 10px"
                />
                <span className="absolute right-[10px] top-1/2 -translate-y-1/2">
                  명
                </span>
              </div>
            </div>

            <div className="flex flex-col gap-[5px]">
              <b className="text-lg">우대사항</b>
              <textarea
                className="w-full resize-none outline-none rounded-[10px] border border-main-gray p-[10px]"
                placeholder="우대사항을 작성해주세요"
                value={preferences}
                onChange={(e) => setPreferences(e.target.value)}
                rows={5}
              />
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b className="text-lg">
                학력제한 <b className="text-main-warn">*</b>
              </b>
              <div className="flex gap-[10px]">
                <div className="w-full relative">
                  <select
                    className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none appearance-none relative"
                    onChange={(e) =>
                      setEducation({ ...education, school: e.target.value })
                    }
                    value={education.school}
                  >
                    {schoolOptions.map((schoolOption, index) => (
                      <option key={schoolOption} value={schoolOption}>
                        {schoolOption}
                      </option>
                    ))}
                  </select>
                  <div className="absolute right-[10px] top-1/2 -translate-y-1/2">
                    <ArrowDownIcon className="text-main-darkGray" />
                  </div>
                </div>
                <div className="w-full relative">
                  <select
                    className="w-full rounded-[10px] border border-main-gray h-[40px] px-[10px] outline-none appearance-none relative"
                    onChange={(e) =>
                      setEducation({ ...education, state: e.target.value })
                    }
                    value={education.state}
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
              <b className="text-lg">
                주소지 등록 <b className="text-main-warn">*</b>
              </b>
              <div className="w-full flex flex-col gap-[10px]">
                <div className="w-full flex gap-[10px]">
                  <InputComponent
                    type="text"
                    placeholder="우편번호"
                    value={address.zipcode}
                    height="40px"
                    width="100%"
                    padding="0 10px"
                    readOnly
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setIsOpenAddressModal(true);
                      setIsPostcodeOpen(true);
                    }}
                    className="w-[200px] rounded-[10px] h-[40px] bg-main-color text-white"
                  >
                    주소 검색
                  </button>
                </div>
                <InputComponent
                  type="text"
                  placeholder="주소"
                  readOnly
                  value={address.street}
                  height="40px"
                  width="100%"
                  padding="0 10px"
                />
                <InputComponent
                  type="text"
                  placeholder="상세주소"
                  value={address.detail}
                  onChange={(e) => {
                    setAddress({ ...address, detail: e.target.value });
                  }}
                  height="40px"
                  width="100%"
                  padding="0 10px"
                />
              </div>
            </div>

            <div className="w-full flex flex-col gap-[5px]">
              <b className="text-lg">채용담당</b>
              <div className="flex flex-col gap-[10px]">
                <div className="flex gap-[10px] items-center">
                  <span className="basis-[50px] text-main-darkGray">이름</span>
                  <InputComponent
                    placeholder="채용 담당자명"
                    value={recruiter.name}
                    onChange={(e) =>
                      setRecruiter({ ...recruiter, name: e.target.value })
                    }
                    width="100%"
                    height="40px"
                    padding="0 10px"
                  />
                </div>
                <div className="flex gap-[10px] items-center">
                  <span className="basis-[50px] text-main-darkGray">
                    이메일
                  </span>
                  <InputComponent
                    placeholder="비공개"
                    value={recruiter.email}
                    onChange={(e) =>
                      setRecruiter({ ...recruiter, email: e.target.value })
                    }
                    width="100%"
                    height="40px"
                    padding="0 10px"
                  />
                </div>
                <div className="flex gap-[10px] items-center">
                  <span className="basis-[50px] text-main-darkGray">
                    연락처
                  </span>
                  <InputComponent
                    placeholder="비공개"
                    value={recruiter.phone}
                    onChange={(e) =>
                      setRecruiter({ ...recruiter, phone: e.target.value })
                    }
                    width="100%"
                    height="40px"
                    padding="0 10px"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-[10px]">
              <input
                id="post-images"
                type="file"
                accept="image/*"
                multiple
                className="hidden"
                onChange={handleImages}
              />
              <label
                className="w-full h-[80px] flex flex-col items-center justify-center bg-selected-box rounded-[10px] border-2 border-main-color border-dashed cursor-pointer"
                htmlFor="post-images"
              >
                <PlusIcon />
                <span className="text-main-color">이미지 추가</span>
              </label>

              <div className="flex gap-[10px]">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={index}
                    className="relative cursor-pointer bg-main-bg"
                    onClick={() => handleImageDelete(index)}
                  >
                    <img
                      src={preview}
                      alt="preview"
                      className="size-[100px] rounded-[10px] border border-main-gray object-cover"
                    />
                    <div className="absolute top-[1px] right-[1px] bg-main-bg rounded-[10px]">
                      <CancelIcon color="red" />
                    </div>
                  </div>
                ))}
              </div>

              <p className="w-full text-right text-main-darkGray">
                {images.length} / 5
              </p>
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

          <AddNoticeResultModal
            isOpen={isOpenAddNoticeResultModal}
            setIsOpen={setIsOpenAddNoticeResultModal}
          >
            <div className="size-full flex flex-col items-center gap-[20px]">
              <div className="text-center">
                <p>정상적으로</p>
                <p>공고가 등록됐어요</p>
              </div>
              <button
                onClick={() => {
                  setIsOpenAddNoticeResultModal(false);
                  postId && navigate(`/notice/${postId}`);
                }}
                className="flex w-full h-[50px] bg-main-color justify-center items-center text-white rounded-[10px]"
              >
                해당 페이지로 이동
              </button>
            </div>
          </AddNoticeResultModal>
        </div>
      </Main>
    </>
  );
};

export default NoticeAddPage;
