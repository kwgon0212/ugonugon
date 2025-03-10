import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import Main from "@/components/Main";
import Modal from "@/components/Modal";
import { Resume } from "@/hooks/fetchResume";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import PlaceMap from "../../PlaceMap";

const RejectModal = Modal;
const ApproveModal = Modal;

const NoticeApplyResumePage = () => {
  const { noticeId, resumeId } = useParams();
  console.log(noticeId, resumeId);

  const navigate = useNavigate();
  const [isOpenRejectModal, setIsOpenRejectModal] = useState(false);
  const [isOpenApproveModal, setIsOpenApproveModal] = useState(false);

  const [resume, setResume] = useState<Resume | null>(null);

  useEffect(() => {
    const fetchResume = async () => {
      try {
        const response = await axios.get(`/api/resume?resumeId=${resumeId}`);
        const resumeDoc = response.data;
        setResume(resumeDoc);
      } catch (error) {
        console.log(error);
      }
    };

    fetchResume();
  }, [resumeId]);

  const handleClickChat = () => {};

  const handleReject = () => {};

  const handleApprove = () => {};

  return (
    <>
      <Header>
        <div className="size-full flex items-center px-[20px] justify-between">
          <div className="flex gap-[10px] items-center">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
            <span className="font-bold">지원자</span>
          </div>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full bg-main-bg relative">
          <div className="w-full h-full flex flex-col relative">
            <div className="flex p-layout gap-[20px] items-center">
              <img
                src="https://placehold.co/80"
                alt="user-img"
                className="rounded-[10px]"
              />
              <div className="w-full flex flex-col justify-between">
                <p className="w-full flex">
                  <span className="basis-[80px] text-main-darkGray">이름</span>
                  <span className="flex-grow">김김김</span>
                </p>
                <p className="w-full flex">
                  <span className="basis-[80px] text-main-darkGray">성별</span>
                  <span className="flex-grow">남성</span>
                </p>
                <p className="w-full flex">
                  <span className="basis-[80px] text-main-darkGray">
                    주민번호
                  </span>
                  <span className="flex-grow">123456-1234567</span>
                </p>
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
                          className="w-full flex gap-[10px]"
                          key={JSON.stringify(career)}
                        >
                          <span className="basis-[100px] text-main-darkGray">
                            {career.dates}
                          </span>
                          <span className="flex-grow">{career.company}</span>
                        </p>
                      );
                    })}
                </div>

                <div className="w-full flex flex-col gap-[10px]">
                  <h3 className="font-bold text-[20px]">기타사항</h3>
                  <p className="w-full flex">
                    <span className="basis-[80px] text-main-darkGray">
                      자기소개
                    </span>
                    <textarea
                      value={resume?.introduction}
                      readOnly
                      disabled
                      rows={5}
                      className="flex-grow border border-main-gray rounded-[10px] py-[5px] px-[10px] resize-none bg-white"
                    />
                  </p>
                </div>
              </div>
            </div>
          </div>

          <RejectModal
            isOpen={isOpenRejectModal}
            setIsOpen={setIsOpenRejectModal}
          >
            <div className="w-full flex flex-col gap-[20px]">
              <p className="text-xl font-bold">고용 거절</p>
              <p className="text-center">
                정말 해당 지원자를 고용하지 않으시겠습니까?
              </p>
              <div className="flex gap-[20px]">
                <button
                  onClick={handleReject}
                  className="flex flex-grow h-[50px] border border-main-color justify-center items-center px-[10px] bg-white text-main-color rounded-[10px]"
                >
                  취소
                </button>
                <button
                  onClick={() => {}}
                  className="flex flex-grow h-[50px] justify-center items-center px-[10px] bg-main-color text-white rounded-[10px]"
                >
                  승인
                </button>
              </div>
            </div>
          </RejectModal>

          <ApproveModal
            isOpen={isOpenApproveModal}
            setIsOpen={setIsOpenApproveModal}
          >
            <div className="w-full flex flex-col gap-[20px]">
              <p className="text-xl font-bold">고용 승인</p>
              <p className="text-center">
                정말 해당 지원자를 고용하시겠습니까?
              </p>
              <div className="flex gap-[20px]">
                <button
                  onClick={() => setIsOpenApproveModal(false)}
                  className="flex flex-grow h-[50px] border border-main-color justify-center items-center px-[10px] bg-white text-main-color rounded-[10px]"
                >
                  취소
                </button>
                <button
                  onClick={handleApprove}
                  className="flex flex-grow h-[50px] justify-center items-center px-[10px] bg-main-color text-white rounded-[10px]"
                >
                  승인
                </button>
              </div>
            </div>
          </ApproveModal>
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
          className="flex flex-grow h-[50px] justify-center items-center border border-main-color bg-white text-selected-text rounded-[10px]"
        >
          고용 거절
        </button>
        <button
          onClick={() => setIsOpenApproveModal(true)}
          className="flex flex-grow h-[50px] justify-center items-center bg-main-color text-white rounded-[10px]"
        >
          고용 승인
        </button>
      </div>
    </>
  );
};

export default NoticeApplyResumePage;
