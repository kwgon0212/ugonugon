import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import Main from "@/components/Main";
import { useAppSelector } from "@/hooks/useRedux";
import Notice from "@/types/Notice";
import axios from "axios";
import { Types } from "mongoose";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

interface Apply {
  postId: Types.ObjectId;
  status: "pending" | "accepted" | "rejected";
  appliedAt: Date;
}

// 삭제된 공고를 위한 카드 컴포넌트
const DeletedPostCard = ({
  keyProp,
  appliedAt,
}: {
  keyProp: string | number;
  appliedAt: string;
}) => {
  return (
    <div
      key={keyProp}
      className="w-full bg-white rounded-[10px] p-[10px] flex items-center gap-[20px] opacity-50 border border-dashed border-gray-300"
    >
      <div className="w-[90px] h-[90px] flex items-center justify-center bg-gray-200 rounded-[10px]">
        {/* 삭제된 공고 아이콘 (적절한 아이콘 경로로 교체) */}
        {/* <img src="/icons/deleted.svg" alt="Deleted Post" className="w-6 h-6" /> */}
        <img
          src="/logo.png"
          alt="Deleted Post"
          className="w-full h-full object-cover grayscale blur-sm -scale-x-100"
        />
      </div>
      <div className="flex flex-col">
        <p className="text-lg font-bold text-gray-600">삭제된 공고</p>
        <p className="text-sm text-gray-500">
          이 공고는 더 이상 유효하지 않습니다.
        </p>
        <br />
        <p className=" text-sm text-gray-500 ">{appliedAt}</p>
      </div>
    </div>
  );
};

const WorkApplyPage = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const navigate = useNavigate();

  const [applies, setApplies] = useState<Apply[] | null>(null);
  const [posts, setPosts] = useState<Notice[] | null>(null);

  useEffect(() => {
    const fetchUserDoc = async () => {
      if (!userId) return;
      try {
        const response = await axios.get(`/api/users?userId=${userId}`);
        setApplies(response.data.applies);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    };

    fetchUserDoc();
  }, [userId]);

  useEffect(() => {
    const fetchPosts = async () => {
      if (!applies) return;
      const data = await Promise.all(
        applies.map(async (apply) => {
          try {
            const res = await axios.get(`/api/post/${apply.postId}`);
            return res.data;
          } catch (error) {
            // 404 에러 등 요청 실패 시 null 반환
            return null;
          }
        })
      );
      console.log("post", data);
      setPosts(data);
    };

    fetchPosts();
  }, [applies]);

  const returnStatus = (status: string) => {
    if (status === "accepted")
      return (
        <span className="text-main-color bg-selected-box rounded-xl pl-2 pr-2">
          승인됨
        </span>
      );
    if (status === "rejected") return <span className="text-warn">거절됨</span>;
    if (status === "pending")
      return (
        <span className="text-main-darkGray bg-main-gray rounded-xl pl-2 pr-2">
          진행중
        </span>
      );
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
            내가 지원한 공고
          </span>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <div className="size-full flex flex-col gap-[20px] p-[20px]">
          {applies &&
            applies.length > 0 &&
            posts &&
            posts.map((post, idx) => {
              if (!post)
                return (
                  <DeletedPostCard
                    keyProp={`deleted-${idx}`}
                    appliedAt={new Date(
                      applies[idx].appliedAt
                    ).toLocaleDateString()}
                  />
                );
              return (
                <button
                  key={post._id.toString()}
                  onClick={() => {
                    navigate(`/notice/${post._id}`);
                  }}
                  className="w-full bg-white rounded-[10px] flex p-[10px] gap-[20px] items-center border border-main-gray"
                >
                  <img
                    src={post.images.length ? post.images[0] : "/logo.png"}
                    alt="img"
                    className={`size-[90px] rounded-[10px] ${
                      post.images?.length ? "object-contain" : " object-cover"
                    }`}
                  />
                  <div className="w-full flex flex-col gap-[4px]">
                    <div className="flex gap-[10px] items-center">
                      <p className="flex-grow text-left font-bold">
                        {post.title}
                      </p>
                      <span className="text-main-darkGray text-[14px]">
                        ~ {new Date(post.deadline.date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <div className="w-full flex justify-between gap-[10px] text-[12px] text-main-darkGray">
                        <div>
                          <span>지원날짜</span>
                          <span>
                            {new Date(
                              applies[idx].appliedAt
                            ).toLocaleDateString()}
                          </span>
                        </div>
                        {returnStatus(applies[idx].status)}
                      </div>
                      <p className="text-main-darkGray w-fit text-[12px]">
                        {post.address.street} {post.address.detail}
                      </p>
                      <div className="flex gap-[4px] items-center text-[12px]">
                        <span className="font-bold text-[14px] text-main-color">
                          {post.pay.type}
                        </span>
                        <span className="text-main-darkGray">
                          {post.pay.value.toLocaleString()}원
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          {applies && applies.length <= 0 && (
            <p className="size-full flex justify-center items-center text-main-darkGray">
              지원한 공고가 없습니다
            </p>
          )}
        </div>
      </Main>
      <BottomNav />
    </>
  );
};

export default WorkApplyPage;
