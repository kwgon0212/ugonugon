import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import BirthIcon from "@/components/icons/Birth";
import CallIcon from "@/components/icons/Call";
import Main from "@/components/Main";
import getResume, { Resume } from "@/hooks/fetchResume";
import Notice from "@/types/Notice";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface Apply {
  // userId: String;
  resumeId: String;
  // postId: String;
  status: "pending" | "accepted" | "rejected";
  appliedAt: Date;
}

const NoticeApplyPage = () => {
  const navigate = useNavigate();
  const { noticeId } = useParams();
  const [postData, setPostData] = useState<Notice | null>(null);
  const [applies, setApplies] = useState<Apply[]>([]);
  const [resumes, setResumes] = useState<Resume[]>([]);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const response = await axios.get(`/api/post?postId=${noticeId}`);
        const post = response.data;
        setPostData(post);
        if (!post.applies) {
          setApplies([]);
        } else {
          const filteredApplies = post.applies.filter((item: Apply) => {
            return item.status === "pending";
          });
          setApplies(filteredApplies);
        }
      } catch (error) {
        console.log(error);
      }
    };

    fetchPost();
  }, [noticeId]);

  useEffect(() => {
    if (applies.length <= 0) return;

    const fetchResumes = async () => {
      const resumeData = await Promise.all(
        applies.map(({ resumeId }) => getResume(resumeId as string))
      );
      setResumes(resumeData);
    };

    fetchResumes();
  }, [applies]);

  const handleClickUser = (resumeId: string) => {
    navigate(`/notice/${noticeId}/apply/${resumeId}`);
  };
  return (
    <>
      <Header>
        <div className="size-full flex items-center px-[20px] justify-between">
          <div className="flex gap-[10px] items-center">
            <button onClick={() => navigate(-1)}>
              <ArrowLeftIcon />
            </button>
            <span className="font-bold">지원현황</span>
          </div>
        </div>
      </Header>
      <Main hasBottomNav={false}>
        <div className="size-full bg-main-bg relative">
          <div className="w-full h-full flex flex-col relative">
            <div className="flex flex-col gap-[4px] py-[10px] px-layout">
              {/* <div className="flex gap-[4px] text-[12px] text-main-darkGray justify-end">
                <span>작성일자 </span>
                <span>2025-02-17</span>
                <span>10:29:15</span>
              </div> */}
              <h1 className="font-bold text-[20px]">{postData?.title}</h1>
              <div className="text-[14px] flex w-full justify-end">
                {/* <h3>한경 2기 풀스택반</h3> */}
                <span className="text-main-darkGray">
                  ~{" "}
                  {postData &&
                    `${new Date(
                      postData.deadline.date
                    ).toLocaleDateString()} ${new Date(
                      postData.deadline.time
                    ).toLocaleTimeString()}`}
                </span>
              </div>
              {/* <div className="text-main-darkGray flex gap-[4px] text-[14px]">
                <span>설립 1년차</span>
                <span>25년 2월부터 이용중</span>
              </div> */}
            </div>

            <div className="flex h-full flex-col gap-[20px] bg-white rounded-[20px] p-[20px]">
              <div className="flex flex-col gap-[10px] pb-[20px]">
                <h3 className="font-bold text-[20px]">지원현황</h3>
                {resumes.length > 0 ? (
                  resumes.map((resume, idx) => {
                    return (
                      <button
                        key={idx + "지원자"}
                        className="w-full bg-white border border-main-gray flex gap-[10px] rounded-[10px] px-[15px] py-[10px]"
                        onClick={() => {
                          handleClickUser(resume._id as string);
                        }}
                      >
                        <img
                          width="80px"
                          src={resume.profile}
                          alt="user-img"
                          className="rounded-full object-cover border border-main-darkGray"
                        />
                        <div className="flex flex-col w-full gap-[2px] text-left text-[12px] text-main-darkGray">
                          <p className="flex justify-between items-center w-full">
                            <span className="font-bold text-[14px] text-black">
                              {resume.name} (
                              {resume.sex === "male" ? "남" : "여"})
                            </span>
                            <ArrowRightIcon color="#717171" />
                          </p>
                          <div className="flex gap-[4px] items-center">
                            <BirthIcon width={12} height={12} color="#717171" />
                            <span>
                              {resume.residentId
                                .split("-")[0]
                                .replace(/^(\d{2})(\d{2})(\d{2})/, "$1.$2.$3.")}
                            </span>
                          </div>
                          <div className="flex gap-[4px] items-center">
                            <CallIcon width={12} height={12} color="#717171" />
                            <span>
                              {resume?.phone?.replace(
                                /(\d{3})(\d{4})(\d{4})/,
                                "$1-$2-$3"
                              )}
                            </span>
                          </div>
                          <span>{resume?.address}</span>
                        </div>
                      </button>
                    );
                  })
                ) : (
                  <p>지원자가 존재하지 않습니다</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </Main>
    </>
  );
};

export default NoticeApplyPage;
