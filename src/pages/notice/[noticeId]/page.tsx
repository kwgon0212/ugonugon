import Header from "@/components/Header";
import Main from "@/components/Main";

import React, { JSX, useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ImageSlider from "./ImageSlider";
import { Link } from "react-router-dom";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import StarIcon from "@/components/icons/Star";
import ShareIcon from "@/components/icons/Share";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import Modal from "@/components/Modal";
import { AnimatePresence, motion } from "framer-motion";
import axios from "axios";
import { useAppSelector } from "@/hooks/useRedux";
import Notice from "@/types/Notice";
import WorkPlaceMap from "./WorkPlaceMap";
import NotFound from "@/NotFound";

const DeleteModal = Modal;
const SelectResumeModal = Modal;
const AcceptModal = Modal;
const ApplyResultModal = Modal;
const AlreadyApplyModal = Modal;

interface ResumeType {
  title: string;
  createdAt: Date;
}

const NoticeDetailPage = () => {
  const { noticeId } = useParams();
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [postData, setPostData] = useState<Notice | null>(null);
  console.log(userId);
  console.log(postData);

  const [isEmployer, setIsEmployer] = useState(false);
  console.log(isEmployer);
  const [isOpenApplyModal, setIsOpenApplyModal] = useState(false);
  const [isOpenDeleteModal, setIsOpenDeleteModal] = useState(false);
  const [isOpenAcceptModal, setIsOpenAcceptModal] = useState(false);
  const [isOpenApplyResultModal, setIsOpenApplyResultModal] = useState(false);
  const [isOpenAlreadyApplyModal, setIsOpenAlreadyApplyModal] = useState(false);
  const [resumes, setResumes] = useState<ResumeType[]>([]);

  const [isClickShare, setIsClickShare] = useState(false);

  const [isAlreadyApply, setIsAlreadyApply] = useState(false);
  const [selectedResume, setSelectedResume] = useState<ResumeType | null>(null);
  const [isCheckedAccept, setIsCheckedAccept] = useState(false);
  const [isNotFound, setIsNotFound] = useState(false);

  const navigate = useNavigate();
  const contentRef = useRef<HTMLDivElement>(null);
  const [contentHeight, setcontentHeight] = useState("auto");

  useEffect(() => {
    if (contentRef.current) {
      setcontentHeight(`${contentRef.current.scrollHeight}px`);
    }
  }, []);

  // useEffect -> post컬렉션에서 해당공고 도큐먼트를 찾고
  // 도큐먼트의 employerId와 로그인한 유저의 _id비교해서 작성자인지 비교
  useEffect(() => {
    if (noticeId) {
      const fetchPost = async () => {
        try {
          const response = await axios.get(`/api/post/${noticeId}`);
          const data = response.data;
          setPostData(data);
          setIsNotFound(false);
          setIsEmployer(data.author === userId);
        } catch (error) {
          console.error("Error fetching post:", error);
          setIsNotFound(true);
        }
      };

      fetchPost();
    }
  }, [noticeId, userId]);

  // 로그인한 유저의 _id를 통해 이미 지원한 공고인지 확인
  useEffect(() => {
    setIsAlreadyApply(false);
  }, []);

  // useEffect -> 로그인한 유저의 이력서를 resume컬렉션에서 찾기
  useEffect(() => {
    setResumes([
      { title: "내 이력서1", createdAt: new Date() },
      { title: "내 이력서2", createdAt: new Date() },
      { title: "내 이력서3", createdAt: new Date() },
    ]);
  }, []);

  const imageArr = [
    "https://placehold.co/500",
    "https://placehold.co/500x225",
    "https://placehold.co/560x200",
    "https://placehold.co/560x175",
    "https://placehold.co/560x150",
    "https://placehold.co/560x125",
    "https://placehold.co/560x100",
  ];

  const handleClickShare = () => {
    navigator.clipboard.writeText(window.location.href).then(() => {
      setIsClickShare(true);
      setTimeout(() => {
        setIsClickShare(false);
      }, 1500);
    });
  };

  const scrollToSection = (id: string) => {
    const section = document.getElementById(id);
    if (section) {
      section.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleResumeNext = () => {
    console.log(selectedResume);
    setIsOpenApplyModal(false);
    setIsOpenAcceptModal(true);
  };

  const handleAcceptNext = async () => {
    // 해당 공고에 이력서 제출 로직
    // 해당 로직이 완료되면 아래코드 실행
    setIsOpenAcceptModal(false);
    setIsOpenApplyResultModal(true);
  };

  const handleDeleteNotice = () => {
    // 해당 공고 삭제
  };

  if (isNotFound) {
    return <NotFound />;
  }

  return (
    <>
      <Header>
        <div className="size-full flex items-center px-[20px] justify-between">
          <div className="flex gap-[10px]">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
            <span className="font-bold">채용정보</span>
          </div>
          <div className="flex gap-[10px]">
            <div className="flex flex-col items-center text-[10px] text-main-darkGray gap-[4px]">
              <StarIcon />
              {/* <span>스크랩</span> */}
            </div>
            <div className="flex flex-col items-center text-[10px] text-main-darkGray gap-[4px]">
              <button onClick={handleClickShare}>
                <ShareIcon />
              </button>
              {/* <span>공유</span> */}
            </div>
          </div>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full bg-main-bg relative">
          <AnimatePresence>
            {isClickShare && (
              <motion.div
                initial={{ opacity: 0, x: "40px" }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: "40px" }}
                className="w-fit absolute top-[20px] right-[20px] px-[10px] py-[5px] rounded-[10px] bg-black/30 z-10"
              >
                <span className="text-black">링크가 복사되었습니다</span>
              </motion.div>
            )}
          </AnimatePresence>
          <ImageSlider imageArr={imageArr} />
          <div
            ref={contentRef}
            className="w-full h-full flex flex-col relative"
            style={{ minHeight: contentHeight }}
          >
            <div className="flex flex-col gap-[4px] mb-[10px] px-layout">
              <div className="flex gap-[4px] text-[12px] text-main-darkGray">
                <span>
                  {postData &&
                    postData.createdAt &&
                    `작성일자 ${new Date(postData.createdAt)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/. /g, "-")
                      .replace(".", "")} ${new Date(
                      postData.createdAt
                    ).toLocaleTimeString("ko-KR", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                      second: "2-digit",
                    })}`}
                </span>
              </div>
              <h1 className="font-bold text-[20px]">{postData?.title}</h1>
              {/* <div className="text-[14px] flex w-full justify-end"> */}
              {/* <h3>한경 2기 풀스택반</h3> */}
              {/* <span className="text-main-darkGray">
                  {postData &&
                    `~ ${new Date(
                      postData.deadline.date
                    ).toLocaleDateString()}`}
                </span>
              </div> */}
              {/* <div className="text-main-darkGray flex gap-[4px] text-[14px]">
                <span>설립 1년차</span>
                <span>25년 2월부터 이용중</span>
              </div> */}
            </div>

            <div className="flex justify-between sticky top-0 bg-main-bg py-[10px] z-[5]">
              <button
                className="flex-1 text-center"
                onClick={() => scrollToSection("condition")}
              >
                근무조건
              </button>
              <button
                className="flex-1 text-center"
                onClick={() => scrollToSection("work-detail")}
              >
                근무상세
              </button>
              <button
                className="flex-1 text-center"
                onClick={() => scrollToSection("post-detail")}
              >
                상세요강
              </button>
            </div>

            <div className="flex flex-col gap-[20px] bg-white rounded-[20px] p-[20px] pb-[110px]">
              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]" id="condition">
                  근무조건
                </h3>
                <div className="flex">
                  <span className="text-main-gray basis-[80px]">급여</span>
                  <p className="flex-1 flex gap-[10px]">
                    <span className="text-warn border border-warn px-2">
                      {postData?.pay.type}
                    </span>
                    {postData?.pay.value}원
                  </p>
                </div>
                {layout(
                  "고용형태",
                  postData?.hireType.map((type) => `${type}고용`).join(", ")
                )}
                {layout(
                  "근무기간",
                  `${
                    postData &&
                    new Date(postData.period.start)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/. /g, "-")
                      .replace(".", "")
                  } ~ ${
                    postData &&
                    new Date(postData.period.end)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/. /g, "-")
                      .replace(".", "")
                  }`,
                  <p className="bg-main-bg text-[12px] flex justify-center items-center px-2 rounded-[5px]">
                    {postData?.period.discussion ? "협의가능" : "협의불가"}
                  </p>
                )}
                {layout(
                  "근무시간",
                  `${
                    postData &&
                    new Date(postData.hour.start).toLocaleTimeString("ko-KR", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  } ~ ${
                    postData &&
                    new Date(postData.hour.end).toLocaleTimeString("ko-KR", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })
                  }`,
                  <p className="bg-main-bg text-[12px] flex justify-center items-center px-2 rounded-[5px]">
                    {postData?.hour.discussion ? "협의가능" : "협의불가"}
                  </p>
                )}
                {layout(
                  "휴게시간",
                  `${
                    postData &&
                    new Date(postData.restTime.start).toLocaleTimeString(
                      "ko-KR",
                      {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  } ~ ${
                    postData &&
                    new Date(postData.restTime.end).toLocaleTimeString(
                      "ko-KR",
                      {
                        hour12: false,
                        hour: "2-digit",
                        minute: "2-digit",
                      }
                    )
                  }`
                )}
                {layout(
                  "근무요일",
                  `${postData?.day.join(", ")} (주 ${postData?.day.length}일)`
                )}

                {/* {layout(
                  "업직종",
                  "풀스택 개발",
                  <p className="bg-main-bg text-[12px] flex justify-center items-center px-2 rounded-[5px]">
                    초보가능
                  </p>
                )} */}

                {layout("복리후생", postData?.welfare)}
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]">모집조건</h3>
                {layout(
                  "모집마감",
                  postData &&
                    `${new Date(postData.deadline.date)
                      .toLocaleDateString("ko-KR", {
                        year: "numeric",
                        month: "2-digit",
                        day: "2-digit",
                      })
                      .replace(/. /g, "-")
                      .replace(".", "")}   ${new Date(
                      postData.deadline.date
                    ).toLocaleTimeString("ko-KR", {
                      hour12: false,
                      hour: "2-digit",
                      minute: "2-digit",
                    })}`
                )}
                {layout(
                  "모집인원",
                  postData && `${postData.person.toString()}명`
                )}
                {layout("우대사항", postData?.preferences)}
                {layout(
                  "학력",
                  postData &&
                    `${postData.education.school} [${postData.education.state}]`
                )}
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]" id="work-detail">
                  근무상세
                </h3>
                <div className="w-full break-keep">
                  {postData && postData.workDetail ? postData.workDetail : "-"}
                </div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]">근무지역</h3>
                {layout(
                  "근무지역",
                  `(${postData?.address.zipcode}) ${postData?.address.street} ${postData?.address.detail}`
                )}
                <WorkPlaceMap
                  address={`${postData?.address.street} ${postData?.address.detail}`}
                />
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]" id="post-detail">
                  상세요강
                </h3>
                <div className="w-full break-keep">
                  {postData && postData.postDetail ? postData.postDetail : "-"}
                </div>
              </div>

              <div className="flex flex-col gap-[10px]">
                <h3 className="font-bold text-[20px]">채용 담당자 정보</h3>
                {layout("담당자", postData?.recruiter?.name || "비공개")}
                {layout("이메일", postData?.recruiter?.email || "비공개")}
                {layout("연락처", postData?.recruiter?.phone || "비공개")}
              </div>

              {/* <div className="flex flex-col gap-[10px]">
                <div className="flex w-full justify-between items-center">
                  <h3 className="font-bold text-[20px]" id="info">
                    기업 정보
                  </h3>
                  <Link
                    to={"#"}
                    className="text-main-darkGray flex items-center"
                  >
                    기업 정보 상세보기
                    <ArrowRightIcon color="#717171" />
                  </Link>
                </div>
                {layout("담당자", "채용 담당자")}
                {layout("연락처", "비공개")}
              </div> */}

              {/* <div className="flex flex-col gap-[10px]">
                <div className="flex w-full justify-between">
                  <h3 className="font-bold text-[20px]">기업 리뷰</h3>
                  <div>별점</div>
                </div>
                {layout("익명1", "어쩌구")}
                {layout("익명2", "저쩌구")}
                {layout("익명3", "머시기")}
              </div> */}
            </div>
          </div>

          <AlreadyApplyModal
            isOpen={isOpenAlreadyApplyModal}
            setIsOpen={setIsOpenAlreadyApplyModal}
          >
            <div className="size-full flex flex-col gap-[20px] text-center">
              <p>이미 지원한 공고입니다.</p>
              <button
                onClick={() => setIsOpenAlreadyApplyModal(false)}
                className="flex w-full h-[50px] bg-main-color justify-center items-center text-white rounded-[10px]"
              >
                확인
              </button>
            </div>
          </AlreadyApplyModal>

          <SelectResumeModal
            isOpen={isOpenApplyModal}
            setIsOpen={setIsOpenApplyModal}
            clickOutsideClose={false}
          >
            <div className="size-full flex flex-col gap-[20px]">
              <p className="text-xl font-bold">이력서 선택</p>
              <div className="flex flex-col gap-[10px] max-h-[200px] overflow-y-scroll">
                {resumes ? (
                  resumes.map((resume) => {
                    return (
                      <button
                        key={resume.title + resume.createdAt}
                        className={`w-full p-[15px] gap-[10px] ${
                          selectedResume === resume
                            ? "border border-transparent bg-selected-box"
                            : "border border-main-gray"
                        } rounded-[10px]`}
                        onClick={() => setSelectedResume(resume)}
                      >
                        <p className="text-main-darkGray text-[14px] text-start">
                          작성일자 {resume.createdAt.toLocaleDateString()}
                        </p>
                        <p className="font-bold flex justify-between items-center">
                          {resume.title}
                          <ArrowRightIcon color="#717171" />
                        </p>
                      </button>
                    );
                  })
                ) : (
                  <p>이력서가 존재하지 않습니다</p>
                )}
              </div>
              <div className="flex gap-[20px]">
                <button
                  onClick={() => {
                    setIsOpenApplyModal(false);
                    setSelectedResume(null);
                  }}
                  className="flex flex-grow h-[50px] border border-main-color justify-center items-center px-[10px] bg-white text-main-color rounded-[10px]"
                >
                  취소
                </button>
                <button
                  onClick={handleResumeNext}
                  disabled={selectedResume ? false : true}
                  className={`flex flex-grow h-[50px] justify-center items-center px-[10px] ${
                    selectedResume
                      ? "bg-main-color text-white"
                      : "bg-main-gray text-main-darkGray"
                  } rounded-[10px]`}
                >
                  다음
                </button>
              </div>
            </div>
          </SelectResumeModal>

          <AcceptModal
            isOpen={isOpenAcceptModal}
            setIsOpen={setIsOpenAcceptModal}
            clickOutsideClose={false}
          >
            <div className="size-full flex flex-col gap-[20px]">
              <p className="text-xl font-bold">공고 지원</p>
              <div className="text-center">
                <p>지원 시 이력서가 고용주에게 전송되며</p>
                <p className="break-keep">
                  채용될 시{" "}
                  <b className="text-main-color">근로계약서에 자동으로 서명</b>
                  이 이루어집니다.
                </p>
              </div>

              <div className="flex justify-center gap-[10px] items-center">
                <input
                  type="checkbox"
                  id="accept-contract"
                  checked={isCheckedAccept}
                  className="accent-main-color w-[15px] h-[15px] cursor-pointer"
                  onChange={(e) => setIsCheckedAccept(e.target.checked)}
                />
                <label htmlFor="accept-contract" className="cursor-pointer">
                  근로계약서 자동 서명에 대한 동의
                </label>
              </div>
              <div className="flex gap-[20px]">
                <button
                  onClick={() => {
                    setIsOpenAcceptModal(false);
                    setIsCheckedAccept(false);
                    setSelectedResume(null);
                  }}
                  className="flex flex-grow h-[50px] border border-main-color justify-center items-center px-[10px] bg-white text-main-color rounded-[10px]"
                >
                  취소
                </button>
                <button
                  onClick={handleAcceptNext}
                  disabled={!isCheckedAccept}
                  className={`flex flex-grow h-[50px] justify-center items-center px-[10px] ${
                    isCheckedAccept
                      ? "bg-main-color text-white"
                      : "bg-main-gray text-main-darkGray"
                  } rounded-[10px]`}
                >
                  다음
                </button>
              </div>
            </div>
          </AcceptModal>

          <ApplyResultModal
            isOpen={isOpenApplyResultModal}
            setIsOpen={setIsOpenApplyResultModal}
          >
            <div className="size-full flex flex-col items-center gap-[20px] pt-[20px]">
              <img
                src="https://placehold.co/100"
                alt="success"
                className="size-[100px]"
              />
              <div className="text-center">
                <p>정상적으로</p>
                <p>공고에 지원했어요</p>
              </div>
              <button
                onClick={() => setIsOpenApplyResultModal(false)}
                className="flex w-full h-[50px] bg-main-color justify-center items-center text-white rounded-[10px]"
              >
                확인
              </button>
            </div>
          </ApplyResultModal>

          <DeleteModal
            isOpen={isOpenDeleteModal}
            setIsOpen={setIsOpenDeleteModal}
            clickOutsideClose={false}
          >
            <div className="w-full flex flex-col gap-[20px]">
              <p className="text-xl font-bold">공고 삭제</p>
              <p className="text-center">정말 해당 공고를 삭제하시겠습니까?</p>
              <div className="flex gap-[20px]">
                <button
                  onClick={() => setIsOpenDeleteModal(false)}
                  className="flex flex-grow h-[50px] border border-main-color justify-center items-center px-[10px] bg-white text-main-color rounded-[10px]"
                >
                  취소
                </button>
                <button
                  onClick={handleDeleteNotice}
                  className="flex flex-grow h-[50px] justify-center items-center px-[10px] bg-main-color text-white rounded-[10px]"
                >
                  삭제
                </button>
              </div>
            </div>
          </DeleteModal>
        </div>
      </Main>
      <div className="absolute bottom-0 left-0 w-full flex gap-[10px] bg-white p-[10px] border-t border-gray-200">
        {isEmployer ? (
          <>
            <button
              onClick={() => setIsOpenDeleteModal(true)}
              className="flex flex-grow h-[50px] border border-main-gray justify-center items-center bg-white rounded-[10px]"
            >
              공고 삭제
            </button>
            <button
              onClick={() => navigate(`/notice/edit/${noticeId}`)}
              className="flex flex-grow h-[50px] justify-center items-center border border-main-color bg-white text-selected-text rounded-[10px]"
            >
              공고 수정
            </button>
            <button
              onClick={() => navigate(`/notice/${noticeId}/apply`)}
              className="flex flex-grow h-[50px] justify-center items-center bg-main-color text-white rounded-[10px]"
            >
              지원 현황
            </button>
          </>
        ) : (
          <>
            <button className="flex h-[50px] border border-main-gray justify-center items-center px-[40px] bg-white rounded-[10px]">
              채팅하기
            </button>
            <button
              onClick={() => {
                isAlreadyApply
                  ? setIsOpenAlreadyApplyModal(true)
                  : setIsOpenApplyModal(true);
              }}
              className="flex flex-grow h-[50px] justify-center items-center px-[10px] bg-main-color text-white rounded-[10px]"
            >
              지원하기
            </button>
          </>
        )}
      </div>
    </>
  );
};

const layout = (
  title: string,
  content?: string | null,
  option?: JSX.Element | null
) => {
  return (
    <div>
      <div className="flex items-start">
        <span className="text-main-gray basis-[80px]">{title}</span>
        <p className="flex gap-[10px] items-center break-keep flex-1">
          {content ? content : "-"}
          {option}
        </p>
      </div>
    </div>
  );
};

export default NoticeDetailPage;
