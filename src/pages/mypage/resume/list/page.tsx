import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Main from "@/components/Main";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { useAppSelector } from "@/hooks/useRedux";
import getUser, { type User } from "@/hooks/fetchUser";
import getResume, { type Resume } from "@/hooks/fetchResume";
import HeaderBack from "@/components/HeaderBack";

const CenterDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

function MypageResumeList() {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [userData, setUserData] = useState<User | null>(null);
  const [resumes, setResumes] = useState<Resume[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (userId) {
      const fetchData = async () => {
        const user = await getUser(userId);
        setUserData(user);
        if (user?.resumeIds && Array.isArray(user?.resumeIds)) {
          const newResumes = await Promise.all(
            user.resumeIds.map(async (resumeId: string) => {
              if (typeof resumeId === "string") {
                return await getResume(resumeId);
              }
              return null;
            })
          );
          setResumes(newResumes);
        }
      };
      fetchData();
    }
  }, [userId, resumes]);

  return (
    <>
      <HeaderBack title="이력서 관리" backPage={"/mypage"} />
      {userData && (
        <Main hasBottomNav={false}>
          <div className="size-full bg-white">
            {resumes?.length === 0 || resumes === null ? (
              <CenterDiv className="text-main-darkGray">
                <div className="text-base text-center">
                  <span>현재&nbsp;</span>
                  <span className="text-main-color font-bold">
                    {userData?.name}
                  </span>
                  <span>
                    님의
                    <br />
                    이력서가 존재하지 않아요
                    <br />
                  </span>
                  <div className="m-[10px] text-sm">
                    <Link to="/mypage/resume/add">
                      <span className="text-main-color">이력서 등록</span>
                      &nbsp;페이지로 이동
                    </Link>
                  </div>
                </div>
              </CenterDiv>
            ) : (
              <ul className="w-full px-5 pt-[22px] flex flex-col gap-[10px] list-none">
                {Array.isArray(resumes)
                  ? resumes.map(({ _id, writtenDay, title }, index) => (
                      <button
                        key={index}
                        className="w-full rounded-[10px] bg-white flex flex-col p-[15px] gap-[10px] border border-main-gray"
                        onClick={() => navigate(`/mypage/resume/list/${_id}`)}
                      >
                        <span className="flex gap-[4px]">
                          <span className="w-[49px] text-main-darkGray text-xs">
                            작성일자
                          </span>
                          <span className="text-main-darkGray text-xs">
                            {writtenDay}
                          </span>
                        </span>
                        <div className="text-lg font-semibold flex justify-between items-center text-start">
                          <p>{title}</p>
                          <ArrowRightIcon color="#717171" />
                        </div>
                      </button>
                    ))
                  : ""}
              </ul>
            )}
          </div>
        </Main>
      )}
    </>
  );
}

export default MypageResumeList;
