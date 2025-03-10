import React, { useEffect, useState } from "react";
import styled from "styled-components";
import Header from "@/components/Header";
import Main from "@/components/Main";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ProfileIcon from "@/components/icons/Profile";
import CameraIcon from "@/components/icons/Camera";
import PlusIcon from "@/components/icons/Plus";
import MinusIcon from "@/components/icons/Minus";
import DatePicker from "react-datepicker";
import { ko } from "date-fns/locale/ko";
import { format } from "date-fns";
import "react-datepicker/dist/react-datepicker.css";
import "@/css/datePicker.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import getResume, {
  type Resume,
  type Career,
  putResume,
  deleteResume,
} from "@/hooks/fetchResume";
import { useAppSelector } from "@/hooks/useRedux";
import Modal from "@/components/Modal";
import DaumPostcode from "react-daum-postcode";

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

const Title = styled.p`
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  font-weight: bold;
  font-size: 16px;
`;

const InsertTextInput = styled.input<Props>`
  width: ${(props) => props.width || "100%"};
  height: ${(props) => props.height || "40px"};
  border: 1px solid #d9d9d9;
  background: white;
  border-radius: 10px;
  padding: ${(props) => props.padding || "0 20px"};

  &::placeholder {
    color: #717171;
    font-size: 14px;
  }

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
  }
`;

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

  &:focus {
    border: 1px solid #0b798b;
    outline: none;
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
    border: 1px solid #0b798b;
    z-index: 1;
  }
`;

const BottomButton = styled.button<Props>`
  width: ${(props) => props.width || "calc(100% - 40px)"};
  height: 50px;
  border-radius: 10px;
  font-size: 14px;
  background: ${(props) => props.background || "#0b798b"};
  color: ${(props) => props.color || "white"};
`;

function MypageResumeListId() {
  const [school, setSchool] = useState("");
  const schoolTypes = [
    "대학원(박사)",
    "대학원(석사)",
    "대학교(4년)",
    "대학교(2, 3년)",
    "고등학교",
    "중학교",
    "초등학교",
  ];
  const [schoolState, setSchoolState] = useState("");
  const schoolStateTypes = ["졸업", "재학", "휴학", "중퇴"];
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
  const [resumeData, setResumeData] = useState<Resume>();

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const resume = await getResume(window.location.pathname.slice(20));
        setResumeData(resume);
      };
      fetchData();
    }
  }, [userId]);

  const [name, setName] = useState<string | undefined>("");
  const [sex, setSex] = useState<string | undefined>("");
  const [residentId, setResidentId] = useState<string | undefined>("");
  const [email, setEmail] = useState<string | undefined>("");
  const [phone, setPhone] = useState<string | undefined>("");
  const [address, setAddress] = useState<string | undefined>("");
  const [isPostcodeOpen, setIsPostcodeOpen] = useState(false); // 팝업 열림 상태
  const navigate = useNavigate();

  useEffect(() => {
    setName(resumeData?.name);
    setSex(resumeData?.sex);
    setResidentId(resumeData?.residentId);
    setPhone(resumeData?.phone);
    setEmail(resumeData?.email);
    setAddress(resumeData?.address);
    setSchool(resumeData?.school as string);
    setSchoolState(resumeData?.schoolState as string);
    setcareers(resumeData?.careers as Career[]);
    setResumeTitle(resumeData?.title as string);
    setIntroduction(resumeData?.introduction as string);
  }, [resumeData]);

  return (
    <>
      {modal && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[11]"
          onClick={() => setModal(!modal)}
        />
      )}
      <Header>
        <Link
          to="/mypage"
          className="p-layout h-full flex flex-wrap content-center"
        >
          <ArrowLeftIcon width={24} height={24} />
          <Title>이력서 등록</Title>
        </Link>
      </Header>
      {resumeData && (
        <Main hasBottomNav={false}>
          <>
            {isPostcodeOpen && (
              <Modal isOpen={isPostcodeOpen} setIsOpen={setIsPostcodeOpen}>
                {isPostcodeOpen && (
                  <DaumPostcode
                    onComplete={(data) => {
                      setAddress(data.address);
                      setIsPostcodeOpen(!isPostcodeOpen);
                    }}
                    className="mt-5"
                    autoClose
                  />
                )}
              </Modal>
            )}
            {modal && (
              <form className="w-full min-h-[65%] flex flex-col p-layout bg-white z-[11] rounded-t-[20px] absolute bottom-0">
                <div className="w-full mt-[14px] flex flex-col mb-[10px]">
                  <p className="basis-full font-bold">
                    근무지명
                    <span className="text-[#ff0000]">*</span>
                  </p>
                </div>
                <InsertTextInput
                  onBlur={(e) => setCompany(e.target.value)}
                  placeholder="근무지명을 입력해주세요"
                  required
                />
                <div className="w-full mt-5 flex flex-col mb-[10px]">
                  <p className="basis-full font-bold">
                    근무기간
                    <span className="text-[#ff0000]">*</span>
                  </p>
                </div>
                <div className="w-full h-10 flex gap-[16px] items-center datepicker-css">
                  <DatePicker
                    locale={ko}
                    showIcon
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
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
                          d="M18 2V4M6 2V4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M3 8H21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
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
                  />
                  <span className="text-base font-semibold">-</span>
                  <DatePicker
                    locale={ko}
                    showIcon
                    icon={
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
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
                          d="M18 2V4M6 2V4"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M2.5 12.2432C2.5 7.88594 2.5 5.70728 3.75212 4.35364C5.00424 3 7.01949 3 11.05 3H12.95C16.9805 3 18.9958 3 20.2479 4.35364C21.5 5.70728 21.5 7.88594 21.5 12.2432V12.7568C21.5 17.1141 21.5 19.2927 20.2479 20.6464C18.9958 22 16.9805 22 12.95 22H11.05C7.01949 22 5.00424 22 3.75212 20.6464C2.5 19.2927 2.5 17.1141 2.5 12.7568V12.2432Z"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />

                        <path
                          d="M3 8H21"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    }
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
                  />
                </div>
                <div className="w-full mt-5 flex flex-col gap-[10px]">
                  <p className="w-full font-bold">근무 내용</p>
                  <InsertTextarea
                    className="text-sm p-[15px] min-h-[140px]"
                    width="100%"
                    height="100%"
                    placeholder="근무 시 담당했던 업무에 대해 작성해주세요"
                    onBlur={(e) => setcareerDetail(e.target.value)}
                    required
                  ></InsertTextarea>
                </div>
                <BottomButton
                  className="absolute bottom-[38px]"
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
                        setModal(!modal);
                      }
                    } else {
                      alert("입력되지 않은 내용이 있습니다.");
                    }
                  }}
                >
                  경력 추가
                </BottomButton>
              </form>
            )}
            <form
              className="w-full px-5 pt-5 flex flex-col gap-layout"
              onSubmit={async (e) => {
                e.preventDefault();
                await putResume(resumeData?._id as string, {
                  userId,
                  title: resumeTitle,
                  name,
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
              }}
            >
              <div>
                <input
                  className="w-full h-[22px] text-lg placeholder:underline bg-main-bg text-main-color"
                  type="text"
                  value={resumeTitle}
                  onChange={(e) => setResumeTitle(e.target.value)}
                  placeholder="이력서 제목을 등록해주세요"
                  required
                />
                <div className="flex h-[74px] mt-5">
                  <div className="mr-5 relative">
                    <ProfileIcon />
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
              <div className="rounded-t-[30px] bg-white p-layout flex flex-col gap-layout items-start -mx-[20px]">
                <button
                  className="text-main-color text-xs underline -mb-[10px]"
                  type="button"
                  onClick={() => {
                    setPhone(resumeData.phone);
                    setEmail(resumeData.email);
                    setAddress(resumeData.address);
                  }}
                >
                  내 정보 불러오기
                </button>
                <div className="w-full flex flex-col gap-[10px]">
                  <p className="basis-full font-bold">
                    회원 정보
                    <span className="text-[#ff0000]">*</span>
                  </p>
                  <div className="flex w-full">
                    <ul className="flex flex-col gap-[10px] text-[12px] text-main-darkGray">
                      {["연락처", "이메일", "거주지"].map((value, index) => (
                        <li className="w-[49px]" key={index}>
                          {value}
                        </li>
                      ))}
                    </ul>
                    <div className="w-full flex flex-col gap-[10px] text-[12px] ml-[10px] items-start">
                      <input
                        className="w-full h-[18px] text-xs placeholder:text-main-darkGray placeholder:underline "
                        type="text"
                        placeholder="'-'를 제외하고 입력해주세요'"
                        value={phone}
                        onChange={(e) =>
                          setPhone(e.target.value.replace(/[^\d]/g, ""))
                        }
                        required
                      />
                      <input
                        className="w-full h-[18px] text-xs placeholder:text-main-darkGray placeholder:underline "
                        type="email"
                        placeholder="이메일을 입력해주세요"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        pattern="[\w]+@+[\w]+\.[\w]+"
                        required
                      />
                      <input
                        className="w-full text-xs placeholder:text-main-color placeholder:font-bold placeholder:text-xs placeholder:underline"
                        placeholder="주소 찾기"
                        onClick={() => setIsPostcodeOpen(!isPostcodeOpen)}
                        value={address}
                        readOnly
                        required
                      />
                    </div>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-[10px]">
                  <p className="basis-full font-bold">
                    최종 학력
                    <span className="text-[#ff0000]">*</span>
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
                        key={schoolTypes.length + 1}
                        value=""
                        disabled
                        hidden
                      >
                        학교
                      </option>
                      {schoolTypes.map((value, index) => (
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
                        key={schoolStateTypes.length + 1}
                        value=""
                        disabled
                        hidden
                      >
                        상태
                      </option>
                      {schoolStateTypes.map((value, index) => (
                        <option key={index} value={value}>
                          {value}
                        </option>
                      ))}
                    </SelectBox>
                  </div>
                </div>
                <div className="w-full flex flex-col gap-[10px]">
                  <p className="basis-full font-bold">경력 사항</p>
                  <ul className="list-none">
                    {careers &&
                      careers.map(({ company, dates }, index) => {
                        return (
                          <li
                            key={index}
                            className="w-full relative flex justify-start gap-[10px]"
                          >
                            <span className="text-main-darkGray text-xs">
                              {dates}
                            </span>
                            <span className="text-main-darkGray text-xs">
                              {company}
                            </span>
                            <span
                              className="absolute right-0"
                              onClick={() =>
                                setcareers(
                                  careers.filter((v, i) => i !== index)
                                )
                              }
                            >
                              <MinusIcon />
                            </span>
                          </li>
                        );
                      })}
                  </ul>
                  <button
                    className="w-full h-10 rounded-[10px] border border-dashed border-main-color bg-selected-box flex items-center justify-center text-xs text-main-color"
                    onClick={() => setModal(!modal)}
                    type="button"
                  >
                    <span>
                      <PlusIcon width={14} height={14} />
                    </span>
                    &nbsp; 경력 추가하기
                  </button>
                </div>
                <div className="w-full flex flex-col gap-[10px]">
                  <p className="w-full font-bold">자기 소개</p>
                  <InsertTextarea
                    className="text-sm p-[10px] min-h-[101px]"
                    width="100%"
                    height="100%"
                    radius="5px"
                    defaultValue={introduction}
                    onBlur={(e) => setIntroduction(e.target.value)}
                    required
                  ></InsertTextarea>
                </div>
                <div className="w-full flex gap-[10px]">
                  <BottomButton
                    width="50%"
                    background="white"
                    color="#0b798b"
                    className="border border-main-color"
                    type="button"
                    onClick={async () => {
                      await deleteResume(
                        resumeData?._id as string,
                        userId as string,
                        resumeData?.applyIds as string[]
                      );
                      navigate("/mypage/resume/list");
                    }}
                  >
                    이력서 삭제
                  </BottomButton>
                  <BottomButton width="50%">이력서 수정</BottomButton>
                </div>
              </div>
            </form>
            <div className="w-full min-h-[38px] h-auto -mt-5 bg-white absolute" />
          </>
        </Main>
      )}
    </>
  );
}

export default MypageResumeListId;
