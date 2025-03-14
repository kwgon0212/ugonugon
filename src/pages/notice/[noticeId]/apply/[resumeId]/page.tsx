import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import Main from "@/components/Main";
import Modal from "@/components/Modal";
import getResume, { postResume, Resume } from "@/hooks/fetchResume";
import { useAppSelector } from "@/hooks/useRedux";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlaceMap from "../../PlaceMap";

const RejectModal = Modal;
const AcceptModal = Modal;

const NoticeApplyResumePage = () => {
  const { noticeId, resumeId } = useParams();

  const navigate = useNavigate();
  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);
  const [isOpenAcceptModal, setIsOpenAcceptModal] = useState(false);

  const [resume, setResume] = useState<Resume>();

  const [isFetchStatus, setIsFetchStatus] = useState(false);

  // Redux에서 현재 로그인한 사용자 정보 가져오기
  const currentUser = useAppSelector((state) => state.auth.user);
  const currentUserId = currentUser?._id;

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await getResume(resumeId);
        setResume(response);
        console.log(resumeId);
        console.log(noticeId);
        console.log(resume);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResume();
  }, [resumeId]);

  const handleClickChat = async () => {
    try {
      if (!resume || !resume.userId || !currentUserId) {
        console.error("채팅에 필요한 사용자 정보가 부족합니다.");
        alert("채팅을 시작할 수 없습니다. 사용자 정보가 부족합니다.");
        return;
      }

      console.log(
        "채팅 시작: 공고 작성자",
        currentUserId,
        "지원자",
        resume.userId
      );

      // 지원자 사용자 정보 가져오기 (이름을 확실히 얻기 위해)
      let applicantName = resume.name;
      // try {
      //   const userResponse = await axios.get(`/api/users/${resume.userId}`);
      //   if (userResponse.data && userResponse.data.name) {
      //     applicantName = userResponse.data.name;
      //   }
      // } catch (error) {
      //   console.error("사용자 정보 조회 실패:", error);
      //   // 실패해도 계속 진행 (기본 이름 사용)
      // }

      // 채팅방 생성 또는 기존 채팅방 가져오기
      const response = await axios.post("/api/chat-rooms", {
        user1Id: currentUserId,
        user2Id: resume.userId,
      });

      // 생성된/기존 채팅방 ID 가져오기
      const roomId = response.data.roomId;
      console.log("채팅방 ID:", roomId);

      // 채팅 페이지로 이동
      navigate(`/chat/chatting?roomId=${roomId}&userId=${currentUserId}`, {
        state: {
          roomId,
          otherName: applicantName, // 가져온 실제 사용자 이름 사용
        },
      });
    } catch (error) {
      console.error("채팅방 생성 중 오류 발생:", error);
      alert("채팅 시작에 실패했습니다. 다시 시도해 주세요.");
    }
  };
  const handleReject = async () => {
    if (!resume) return;

    try {
      const response = await axios.post(`/api/post/${noticeId}/apply/status`, {
        userId: resume.userId,
        status: "rejected",
      });
      setIsFetchStatus(true);
      console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  const handleAccept = async () => {
    if (!resume) return;

    try {
      const response = await axios.post(`/api/post/${noticeId}/apply/status`, {
        userId: resume.userId,
        status: "accepted",
      });
      console.log(response.data);
      setIsFetchStatus(true);
    } catch (error) {
      console.log(error);
    }
  };
  if (!resume) return <></>;
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
            지원자 - {resume.name}
          </span>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full bg-white relative">
          <div className="w-full h-full flex flex-col relative">
            <div className="bg-main-color rounded-b-[20px] p-[20px] pt-0">
              <div className="flex p-layout gap-[20px] items-center bg-white rounded-[10px]">
                <img
                  width="80px"
                  src={resume.profile}
                  alt="user-img"
                  className="rounded-full object-cover border border-main-darkGray self-stretch"
                />
                <div className="w-full flex flex-col justify-between">
                  <p className="w-full flex">
                    <span className="basis-[80px] text-main-darkGray">
                      이름
                    </span>
                    <span className="flex-grow">{resume.name}</span>
                  </p>
                  <p className="w-full flex">
                    <span className="basis-[80px] text-main-darkGray">
                      성별
                    </span>
                    <span className="flex-grow">{resume.sex}</span>
                  </p>
                  <p className="w-full flex">
                    <span className="basis-[80px] text-main-darkGray">
                      주민번호
                    </span>
                    <span className="flex-grow">{resume.residentId}</span>
                  </p>
                </div>
              </div>
            </div>
            <div className="flex h-full flex-col gap-[20px] bg-white rounded-t-[20px] p-[20px]">
              <div className="flex flex-col gap-[20px] pb-[100px] bg-white">
                <div className="w-full flex flex-col gap-[10px]">
                  <h3 className="font-bold text-[20px]">기본정보</h3>
                  <p className="w-full flex gap-[10px]">
                    <span className="basis-[80px] text-main-darkGray">
                      연락처
                    </span>
                    <span className="flex-grow">
                      {resume?.phone?.replace(
                        /(\d{3})(\d{4})(\d{4})/,
                        "$1-$2-$3"
                      )}
                    </span>
                  </p>
                  <p className="w-full flex gap-[10px]">
                    <span className="basis-[80px] text-main-darkGray">
                      이메일
                    </span>
                    <span className="flex-grow">{resume?.email}</span>
                  </p>
                  <p className="w-full flex gap-[10px]">
                    <span className="basis-[80px] text-main-darkGray">
                      거주지
                    </span>
                    <span className="flex-grow">{resume?.address}</span>
                  </p>
                  {resume && resume.address && (
                    <PlaceMap address={resume.address} />
                  )}
                </div>

                <div className="w-full flex gap-[10px] flex-col">
                  <h3 className="font-bold text-[20px]">학력</h3>
                  <p className="w-full flex gap-[10px]">
                    <span className="basis-[80px] text-main-darkGray">
                      최종학력
                    </span>
                    <span className="flex-grow">
                      {resume?.school} [{resume?.schoolState}]
                    </span>
                  </p>
                </div>

                <div className="w-full flex gap-[10px] flex-col">
                  <h3 className="font-bold text-[20px]">경력사항</h3>
                  {resume &&
                    resume.careers?.map((career) => {
                      return (
                        <p
                          className="w-full flex gap-[10px] flex-col"
                          key={JSON.stringify(career)}
                        >
                          <div className="flex">
                            <span className="basis-[100px] text-main-darkGray">
                              {career.dates}
                            </span>
                            <span className="flex-grow">{career.company}</span>
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-[16px] pb-[10px]">
                              근무내용
                            </h3>
                            {career.careerDetail}
                          </div>
                          <hr className="border-dashed" />
                        </p>
                      );
                    })}
                </div>

                <div className="w-full flex flex-col gap-[10px]">
                  <h3 className="font-bold text-[20px]">자기소개</h3>
                  <textarea
                    value={resume?.introduction}
                    readOnly
                    disabled
                    rows={5}
                    className="flex-grow border border-main-gray rounded-[10px] py-[5px] px-[10px] resize-none bg-white"
                  />
                </div>
              </div>
            </div>
          </div>

          <RejectModal
            isOpen={isOpenRejectModal}
            setIsOpen={setIsOpenRejectModal}
            clickOutsideClose={!isFetchStatus}
          >
            <div className="w-full flex flex-col gap-[20px]">
              <p className="text-xl font-bold ">고용 거절</p>
              <p className="text-center">
                {isFetchStatus
                  ? "거절 되었습니다"
                  : "정말 해당 지원자를 고용하지 않으시겠습니까?"}
              </p>
              <div className="flex gap-[20px]">
                {!isFetchStatus ? (
                  <>
                    <button
                      onClick={() => setIsOpenRejectModal(false)}
                      className="flex flex-grow h-[50px] border border-main-color justify-center items-center px-[10px] bg-white text-main-color rounded-[10px]"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleReject}
                      className="flex flex-grow h-[50px] justify-center items-center px-[10px] bg-main-color text-white rounded-[10px]"
                    >
                      확인
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/notice/${noticeId}/apply`)}
                    className="flex flex-grow h-[50px] justify-center items-center px-[10px] bg-main-color text-white rounded-[10px]"
                  >
                    확인
                  </button>
                )}
              </div>
            </div>
          </RejectModal>

          <AcceptModal
            isOpen={isOpenAcceptModal}
            setIsOpen={setIsOpenAcceptModal}
            clickOutsideClose={!isFetchStatus}
          >
            <div className="w-full flex flex-col gap-[20px]">
              <p className="text-xl font-bold">고용 승인</p>
              <p className="text-center">
                {isFetchStatus
                  ? "승인되었습니다"
                  : "정말 해당 지원자를 고용하시겠습니까?"}
              </p>
              <div className="flex gap-[20px]">
                {!isFetchStatus ? (
                  <>
                    <button
                      onClick={() => setIsOpenAcceptModal(false)}
                      className="flex flex-grow h-[50px] border border-main-color justify-center items-center px-[10px] bg-white text-main-color rounded-[10px]"
                    >
                      취소
                    </button>
                    <button
                      onClick={handleAccept}
                      className="flex flex-grow h-[50px] justify-center items-center px-[10px] bg-main-color text-white rounded-[10px]"
                    >
                      확인
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => navigate(`/notice/${noticeId}/apply`)}
                    className="flex flex-grow h-[50px] justify-center items-center px-[10px] bg-main-color text-white rounded-[10px]"
                  >
                    확인
                  </button>
                )}
              </div>
            </div>
          </AcceptModal>
        </div>
      </Main>
      <div className="absolute bottom-0 left-0 w-full flex gap-[10px] bg-white p-[10px] border-t border-gray-200">
        <button
          onClick={handleClickChat}
          className="flex flex-grow h-[50px] border border-main-gray justify-center items-center bg-white rounded-[10px]"
        >
          채팅 하기
        </button>
        <button
          onClick={() => setIsOpenRejectModal(true)}
          className="flex flex-grow h-[50px] justify-center items-center border border-main-color bg-white text-main-color rounded-[10px]"
        >
          고용 거절
        </button>
        <button
          onClick={() => setIsOpenAcceptModal(true)}
          className="flex flex-grow h-[50px] justify-center items-center bg-main-color text-white rounded-[10px]"
        >
          고용 승인
        </button>
      </div>
    </>
  );
};

export default NoticeApplyResumePage;
