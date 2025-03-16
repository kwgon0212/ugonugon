import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Header from "../../../../components/Header";
import Main from "../../../../components/Main";
import ArrowLeftIcon from "../../../../components/icons/ArrowLeft";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import { useAppSelector } from "@/hooks/useRedux";
import getUser, { type User } from "@/hooks/fetchUser";
import getResume, { type Resume } from "@/hooks/fetchResume";

interface Props {
  width?: string;
  height?: string;
  padding?: string;
  bottom?: string;
  radius?: string;
  fontSize?: string;
}

const CenterDiv = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
`;

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
  background: #0b798b;
  color: white;
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
      <Header>
        <div className="size-full flex justify-center items-center font-bold bg-main-color text-white relative">
          <button
            onClick={() => navigate("/mypage")}
            className="absolute top-1/2 -translate-y-1/2 left-layout"
          >
            <ArrowLeftIcon className="text-white" />
          </button>
          <span>이력서 관리</span>
        </div>
      </Header>
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
