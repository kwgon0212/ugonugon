import ArrowRightIcon from "@/components/icons/ArrowRight";
import ProfileIcon from "@/components/icons/Profile";
import BirthIcon from "@/components/icons/Birth";
import CallIcon from "@/components/icons/Call";
import Main from "@/components/Main";
import getResume, { Resume } from "@/hooks/fetchResume";
import Notice from "@/types/Notice";
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import HeaderBack from "@/components/HeaderBack";

// posts스키마의 apply
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
      <HeaderBack title="지원현황" />
      <Main hasBottomNav={false}>
        <div className="size-full bg-white relative">
          <div className="w-full h-full flex flex-col relative">
            <div className="flex flex-col gap-[4px] p-[20px] pt-0 rounded-b-[20px] bg-main-color">
              <div className="bg-white rounded-[10px] p-[10px]">
                <h1 className="font-bold text-[20px]">{postData?.title}</h1>
                <div className="text-[14px] flex w-full justify-end">
                  <span className="text-main-darkGray text-xs">
                    ~{" "}
                    {postData &&
                      `${new Date(
                        postData.deadline.date
                      ).toLocaleDateString()} ${new Date(
                        postData.deadline.time
                      ).toLocaleTimeString()}`}
                  </span>
                </div>
              </div>
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
                        <div className="w-20 h-20 rounded-full border border-main-darkGray flex items-center justify-center cursor-pointer overflow-hidden">
                          {resume.profile ? (
                            <img
                              width="80px"
                              src={resume.profile}
                              alt="user-img"
                              // className="rounded-full object-cover border border-main-darkGray"
                            />
                          ) : (
                            <ProfileIcon />
                          )}
                        </div>
                        <div className="flex flex-col w-full gap-[2px] text-left text-[12px] text-main-darkGray">
                          <p className="flex justify-between items-center w-full">
                            <span className="font-bold text-[14px] text-black">
                              {resume.name
                                ? resume.name
                                : "이름 정보가 없습니다."}{" "}
                              ({resume.sex === "male" ? "남" : "여"})
                            </span>
                            <ArrowRightIcon color="#717171" />
                          </p>
                          <div className="flex gap-[4px] items-center">
                            <BirthIcon width={12} height={12} color="#717171" />
                            <span>
                              <span>
                                {resume?.residentId
                                  ? resume.residentId
                                      .split("-")[0]
                                      .replace(
                                        /^(\d{2})(\d{2})(\d{2})/,
                                        "$1.$2.$3."
                                      )
                                  : "주민번호 정보 없음"}
                              </span>
                            </span>
                          </div>
                          <div className="flex gap-[4px] items-center">
                            <CallIcon width={12} height={12} color="#717171" />
                            <span>
                              {resume?.phone
                                ? resume.phone?.replace(
                                    /(\d{3})(\d{4})(\d{4})/,
                                    "$1-$2-$3"
                                  )
                                : "핸드폰 정보 없음"}
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
