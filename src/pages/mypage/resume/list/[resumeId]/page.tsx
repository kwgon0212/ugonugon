import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";
import Main from "@/components/Main";
import ProfileIcon from "@/components/icons/Profile";
import CameraIcon from "@/components/icons/Camera";
import PlusIcon from "@/components/icons/Plus";
import MinusIcon from "@/components/icons/Minus";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@/css/datePicker.css";
import { useNavigate } from "react-router-dom";
import getUser, { type User } from "@/hooks/fetchUser";
import getResume, {
  type Resume,
  type Career,
  putResume,
  deleteResume,
} from "@/hooks/fetchResume";
import { useAppSelector } from "@/hooks/useRedux";
import Modal from "@/components/Modal";
import DaumPostcode from "react-daum-postcode";
import Loading from "@/components/loading/page";
import InputComponent from "@/components/Input";
import SubmitButton from "@/components/SubmitButton";
import HeaderBack from "@/components/HeaderBack";
import CalendarIcon from "@/components/icons/Calendar";
import { schoolOptions, schoolStateOptions } from "@/pages/notice/options";

interface Props {
  width?: string;
  height?: string;
  padding?: string;
  bottom?: string;
  radius?: string;
  fontSize?: string;
  background?: string;
  color?: string;
}

const InsertTextarea = styled.textarea<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "auto"};
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: ${(props) => props.radius || "10px"};

  &::placeholder {
    color: #717171;
    font-size: 14px;
  }
`;

const SelectBox = styled.select<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: 1px solid #d9d9d9;
  border-radius: ${(props) => props.radius || "10px"};
  padding: ${(props) => props.padding || "0 20px"};
  font-size: ${(props) => props.fontSize || "14px"};
  appearance: none;
  background-image: url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="20" height="20" fill="none"><path d="M18 9.00005C18 9.00005 13.5811 15 12 15C10.4188 15 6 9 6 9" stroke="%23d9d9d9" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/></svg>');
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 20px;
  outline: none;

  &:focus {
    border: 1px solid var(--main-color);
    z-index: 1;
  }
`;

const bgCalender = (
  <div style={{ padding: "10px 0 10px 15px" }}>
    <CalendarIcon color="#d9d9d9" />
  </div>
);

const CareerModal = Modal;
const DeleteModal = Modal;

function MypageResumeListId() {
  const [school, setSchool] = useState("");
  const [schoolState, setSchoolState] = useState("");
  const [introduction, setIntroduction] = useState("");
  const [careers, setcareers] = useState<Career[]>();
  const [modal, setModal] = useState(false);
  const [resumeTitle, setResumeTitle] = useState("");
  const [company, setCompany] = useState("");
  const [startDate, setStartDate] = useState<Date | null | undefined>(
    new Date()
  );
  const [endDate, setEndDate] = useState<Date | null | undefined>(new Date());
  const [careerDetail, setcareerDetail] = useState("");
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);
  const [resumeData, setResumeData] = useState<Resume>();

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        setUserData(await getUser(userId));
        const resume = await getResume(window.location.pathname.slice(20));
        setResumeData(resume);
      };
      fetchData();
    }
  }, [userId]);

  const [exitModalOpen, setExitModalOpen] = useState(false); // 나가기 모달 상태
  const [name, setName] = useState<string | undefined>("");
  const [sex, setSex] = useState<string | undefined>("");
  const [residentId, setResidentId] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [address, setAddress] = useState<string | undefined>("");
  const [addressDetail, setAddressDetail] = useState<string | undefined>("");
  const [profile, setProfile] = useState<string | undefined>(undefined);
  const profileInputRef = useRef<HTMLInputElement>(null);
  const handleProfileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.readAsDataURL(file); // Base64 변환
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const img = new Image();
          img.src = reader.result;
          img.onload = () => {
            const { width, height } = img;
            const scale = 80 / Math.min(width, height); // 짧은 쪽을 80px로 변환
            const newWidth = Math.round(width * scale);
            const newHeight = Math.round(height * scale);

            const canvas = document.createElement("canvas");
            canvas.width = newWidth;
            canvas.height = newHeight;
            const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;
            ctx.drawImage(img, 0, 0, newWidth, newHeight);

            const compressedImage = canvas.toDataURL("image/webp", 0.7);
            setProfile(compressedImage);
          };
        }
      };
    }
  };

  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 팝업 열림 상태
  const [isOpenCareerModal, setIsOpenCareerModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    setProfile(resumeData?.profile);
    setName(resumeData?.name);
    setSex(resumeData?.sex);
    setResidentId(resumeData?.residentId);
    setPhone(resumeData?.phone);
    setEmail(resumeData?.email);
    setAddress(resumeData?.address);
    setAddressDetail(resumeData?.addressDetail);
    setSchool(resumeData?.school as string);
    setSchoolState(resumeData?.schoolState as string);
    setcareers(resumeData?.careers as Career[]);
    setResumeTitle(resumeData?.title as string);
    setIntroduction(resumeData?.introduction as string);
  }, [resumeData]);

  const handleSubmit = async (e: React.ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    await putResume(resumeData?._id as string, {
      userId,
      profile,
      title: resumeTitle,
      name,
      addressDetail,
      sex,
      residentId,
      phone,
      email,
      address,
      school,
      schoolState,
      careers,
      introduction,
      writtenDay: new Date().toLocaleDateString(),
    });
    navigate("/mypage/resume/list");
  };

  if (!resumeData) {
    return <Loading />;
  }

  return (
    <>
      <HeaderBack title="이력서 수정" />
      <Main hasBottomNav={false}>
        <div className="size-full bg-white">
          {isPostcodeOpen && (
            <Modal isOpen={isPostcodeOpen} setIsOpen={setIsPostcodeOpen}>
              {isPostcodeOpen && (
                <DaumPostcode
                  onComplete={(data) => {
                    setAddress(data.address);
                    setIsPostcodeOpen(!isPostcodeOpen);
                  }}
                  autoClose
                />
              )}
            </Modal>
          )}

          <form
            className="w-full flex flex-col gap-layout"
            onSubmit={handleSubmit}
          >
            <div className="bg-main-color p-layout rounded-b-[20px]">
              <div className="bg-white rounded-[10px] p-layout">
                <InputComponent
                  type="text"
                  width="100%"
                  height="40px"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="이력서 제목을 등록해주세요"
                  required
                />
                <div className="flex h-20 mt-5">
                  <div className="mr-5 relative">
                    <div
                      className="w-20 h-20 rounded-full border border-main-gray flex items-center justify-center cursor-pointer overflow-hidden"
                      onClick={() => profileInputRef.current?.click()}
                    >
                      {profile ? (
                        <img
                          src={profile}
                          alt="Profile"
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <ProfileIcon>
                          <span className="text-gray-500">Upload</span>
                        </ProfileIcon>
                      )}
                      <input
                        type="file"
                        ref={profileInputRef}
                        accept="image/*"
                        className="hidden"
                        onChange={handleProfileChange}
                      />
                    </div>
                    <p className="w-6 h-6 bg-main-color rounded-full flex justify-center items-center absolute right-0 bottom-0">
                      <CameraIcon color="white" width={14} height={14} />
                    </p>
                  </div>

                  <ul className="flex flex-col gap-[10px] text-[12px] text-main-darkGray">
                    {["이름", "성별", "주민번호"].map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                  <ul className="flex flex-col gap-[10px] text-[12px] ml-[10px]">
                    {[name, sex, residentId].map((value, index) => (
                      <li key={index}>{value}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
            <div className="bg-white p-layout pt-0 flex flex-col gap-layout items-start">
              <div className="w-full flex flex-col gap-[10px]">
                <div className="flex gap-[10px] items-center">
                  <p className="font-bold text-xl">
                    회원 정보
                    <span className="text-[#ff0000]">*</span>
                  </p>
                  <button
                    className="text-white bg-main-color px-[10px] py-[5px] rounded-[5px] text-xs"
                    type="button"
                    onClick={() => {
                      setPhone(userData?.phone);
                      setEmail(userData?.email);
                      setAddress(userData?.address?.street);
                      setAddressDetail(userData?.address?.detail);
                      setProfile(userData?.profile);
                    }}
                  >
                    내 정보 불러오기
                  </button>
                </div>
                <div className="flex w-full">
                  <ul className="flex flex-col gap-[15px] text-sm text-main-darkGray justify-between">
                    {["연락처", "이메일", "거주지", "상세주소"].map(
                      (value, index) => (
                        <li className="w-[60px]" key={index}>
                          {value}
                        </li>
                      )
                    )}
                  </ul>
                  <div className="w-full flex flex-col gap-[15px] text-sm ml-[10px] items-start">
                    <InputComponent
                      height={10}
                      width={"300px"}
                      padding="0 10px"
                      type="text"
                      placeholder="'-'를 제외하고 입력해주세요"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/[^\d]/g, ""))
                      }
                      required
                    />
                    <InputComponent
                      height={10}
                      width={"300px"}
                      padding="0 10px"
                      type="email"
                      placeholder="이메일을 입력해주세요"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      pattern="[\w]+@+[\w]+\.[\w]+"
                      required
                    />
                    <InputComponent
                      height={10}
                      width={"300px"}
                      padding="0 10px"
                      onClick={() => setIsPostcodeOpen(!isPostcodeOpen)}
                      value={address}
                      readOnly
                      required
                      className="cursor-pointer"
                    />
                    <InputComponent
                      height={10}
                      width={"300px"}
                      padding="0 10px"
                      placeholder="ex) 102동 123호"
                      onChange={(e) => setAddressDetail(e.target.value)}
                      value={addressDetail}
                    />
                  </div>
                </div>
              </div>
              <div className="w-full flex flex-col gap-[10px]">
                <p className="font-bold text-xl">
                  최종 학력
                  <span className="text-warn">*</span>
                </p>
                <div className="flex w-full h-10 gap-[10px]">
                  <SelectBox
                    className="text-main-darkGray"
                    width="50%"
                    fontSize="12px"
                    defaultValue={school}
                    onFocus={(e) =>
                      e.target.classList.remove("text-main-darkGray")
                    }
                    onChange={(e) => setSchool(e.target.value)}
                    required
                  >
                    <option
                      className="text-main-darkGray"
                      key={schoolOptions.length + 1}
                      value=""
                      disabled
                      hidden
                    >
                      학교
                    </option>
                    {schoolOptions.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </SelectBox>
                  <SelectBox
                    className="text-main-darkGray"
                    width="50%"
                    fontSize="12px"
                    defaultValue={schoolState}
                    onFocus={(e) =>
                      e.target.classList.remove("text-main-darkGray")
                    }
                    onChange={(e) => setSchoolState(e.target.value)}
                    required
                  >
                    <option
                      className="text-main-darkGray"
                      key={schoolStateOptions.length + 1}
                      value=""
                      disabled
                      hidden
                    >
                      상태
                    </option>
                    {schoolStateOptions.map((value, index) => (
                      <option key={index} value={value}>
                        {value}
                      </option>
                    ))}
                  </SelectBox>
                </div>
              </div>
              <div className="w-full flex flex-col gap-[10px]">
                <p className="font-bold text-xl">경력사항</p>
                <ul className="list-none flex flex-col gap-[10px]">
                  {careers &&
                    careers.map(({ company, dates, careerDetail }, index) => {
                      return (
                        <li
                          key={index}
                          className="w-full relative flex justify-start gap-[10px]"
                        >
                          <span
                            className="w-full relative flex justify-start gap-[10px]"
                            onClick={() => {
                              setCompany(company as string);
                              if (typeof dates === "string") {
                                let year = Number("20" + dates.slice(0, 2));
                                setStartDate(
                                  new Date(
                                    year,
                                    Number(dates.slice(3, 5)) - 1,
                                    1
                                  )
                                );
                                let year2 = Number("20" + dates.slice(6, 8));
                                setEndDate(
                                  new Date(
                                    year2,
                                    Number(dates.slice(10)) - 1,
                                    1
                                  )
                                );
                              }
                              setcareerDetail(careerDetail as string);
                              setModal(!modal);
                            }}
                          >
                            <span className="text-main-darkGray text-xs min-w-[64px]">
                              {dates}
                            </span>
                            <span className="text-main-darkGray text-xs min-w-[64px] truncate">
                              {company}
                            </span>
                            <span className="text-main-darkGray text-xs min-w-[64px] truncate pr-5">
                              {careerDetail}
                            </span>
                          </span>
                          <button
                            className="absolute right-0 top-1/2 -translate-y-1/2"
                            onClick={() =>
                              setcareers(careers.filter((v, i) => i !== index))
                            }
                          >
                            <MinusIcon />
                          </button>
                        </li>
                      );
                    })}
                </ul>
                <button
                  className="w-full h-10 rounded-[10px] border border-dashed border-main-color bg-selected-box flex items-center justify-center text-xs text-main-color"
                  onClick={() => {
                    setIsOpenCareerModal(true);
                    setCompany("");
                    setStartDate(null);
                    setEndDate(null);
                    setcareerDetail("");
                  }}
                  type="button"
                >
                  <span>
                    <PlusIcon width={14} height={14} />
                  </span>
                  &nbsp; 경력 추가하기
                </button>
              </div>
              <div className="w-full flex flex-col gap-[10px]">
                <p className="font-bold text-xl">자기 소개</p>
                <InsertTextarea
                  className="text-sm p-[10px] resize-none"
                  width="100%"
                  height="100%"
                  rows={5}
                  radius="10px"
                  value={introduction}
                  onChange={(e) => setIntroduction(e.target.value)}
                ></InsertTextarea>
              </div>
              <div className="w-full flex gap-[10px]">
                <SubmitButton
                  onClick={() => setIsOpenDeleteModal(true)}
                  type="button"
                  diff
                >
                  이력서 삭제
                </SubmitButton>
                <SubmitButton type="submit">이력서 수정</SubmitButton>
              </div>
            </div>
          </form>
          <div className="w-full min-h-[38px] h-auto -mt-5 bg-white absolute" />
          <CareerModal
            isOpen={isOpenCareerModal}
            setIsOpen={setIsOpenCareerModal}
            position="bottom"
          >
            <form className="size-full overflow-y-scroll flex flex-col gap-[20px]">
              <div className="w-full flex flex-col gap-[10px]">
                <p className="text-xl font-bold">
                  근무지명
                  <span className="text-[#ff0000]">*</span>
                </p>
                <InputComponent
                  height={"40px"}
                  width={"100%"}
                  onBlur={(e) => setCompany(e.target.value)}
                  onChange={(e) => setCompany(e.target.value)}
                  placeholder="근무지명을 입력해주세요"
                  value={company || ""}
                  required
                />
              </div>
              <div className="w-full flex flex-col gap-[10px]">
                <p className="text-xl font-bold">
                  근무기간
                  <span className="text-warn">*</span>
                </p>
                <div className="w-full h-10 flex items-center datepicker-css">
                  <DatePicker
                    locale={ko}
                    showIcon
                    icon={bgCalender}
                    toggleCalendarOnIconClick
                    dateFormat="yyyy/MM"
                    startDate={startDate}
                    endDate={endDate}
                    popperPlacement="bottom-start"
                    fixedHeight
                    showMonthYearPicker
                    selectsStart
                    className="placeholder:text-main-darkGray"
                    maxDate={new Date()}
                    placeholderText="년/월 선택"
                    selected={startDate}
                    onChange={(date) => setStartDate(date)}
                    required
                    value={
                      startDate
                        ? startDate?.getFullYear() +
                          "/" +
                          (startDate?.getMonth() + 1)
                            .toString()
                            .padStart(2, "0")
                        : ""
                    }
                  />
                  <span className="text-base mx-4">~</span>
                  <DatePicker
                    locale={ko}
                    showIcon
                    icon={bgCalender}
                    toggleCalendarOnIconClick
                    dateFormat="yyyy/MM"
                    startDate={startDate}
                    endDate={endDate}
                    popperPlacement="bottom-start"
                    fixedHeight
                    showMonthYearPicker
                    selectsEnd
                    className="placeholder:text-main-darkGray"
                    maxDate={new Date()}
                    placeholderText="년/월 선택"
                    selected={endDate}
                    onChange={(date) => setEndDate(date)}
                    required
                    value={
                      endDate
                        ? endDate?.getFullYear() +
                          "/" +
                          (endDate?.getMonth() + 1).toString().padStart(2, "0")
                        : ""
                    }
                  />
                </div>
              </div>
              <div className="w-full flex flex-col gap-[10px]">
                <p className="text-xl font-bold">근무 내용</p>
                <InsertTextarea
                  className="text-sm p-[15px] resize-none"
                  rows={5}
                  width="100%"
                  height="100%"
                  placeholder="근무 시 담당했던 업무에 대해 작성해주세요"
                  onChange={(e) => setcareerDetail(e.target.value)}
                  value={careerDetail || ""}
                />
              </div>
              <SubmitButton
                type="button"
                onClick={(e) => {
                  if (company && startDate && endDate && careerDetail) {
                    if (startDate > endDate) {
                      alert("근무 기간이 잘못되었습니다.");
                    } else {
                      setcareers([
                        ...(careers as Career[]),
                        {
                          company,
                          dates:
                            format(startDate, "yy.MM") +
                            "-" +
                            format(endDate, "yy.MM"),
                          careerDetail: careerDetail,
                        },
                      ]);
                      setCompany("");
                      setStartDate(null);
                      setEndDate(null);
                      setcareerDetail("");
                      setIsOpenCareerModal(false);
                    }
                  } else {
                    alert("입력되지 않은 내용이 있습니다.");
                  }
                }}
              >
                경력추가
              </SubmitButton>
            </form>
          </CareerModal>
        </div>
      </Main>
      <DeleteModal isOpen={isOpenDeleteModal} setIsOpen={setIsOpenDeleteModal}>
        <p className="font-bold text-lg">정말로 삭제하시겠습니까?</p>
        <p className="text-sm">삭제된 이력서는 복구할 수 없습니다.</p>
        <div className="w-full flex gap-3 justify-between">
          <SubmitButton diff onClick={() => setIsOpenDeleteModal(false)}>
            취소
          </SubmitButton>
          <SubmitButton
            onClick={async () => {
              await deleteResume(
                resumeData?._id as string,
                userId as string,
                resumeData?.applyIds as string[]
              );
              setExitModalOpen(false);
              navigate("/mypage/resume/list");
            }}
          >
            삭제
          </SubmitButton>
        </div>
      </DeleteModal>
    </>
  );
}

export default MypageResumeListId;
