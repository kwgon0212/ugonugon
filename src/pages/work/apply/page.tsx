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

  // console.log(applies);
  useEffect(() => {
    const fetchPosts = async () => {
      if (!applies) return;

      try {
        const data = await Promise.all(
          applies.map(async (apply) => {
            const response = await axios.get(
              `/api/post?postId=${apply.postId}`
            );
            return response.data;
          })
        );

        setPosts(data);
      } catch (error) {
        alert(error);
        console.log(error);
      }
    };

    fetchPosts();
  }, [applies]);

  const returnStatus = (status: string) => {
    if (status === "accepted")
      return <span className="text-main-color">승인됨</span>;
    if (status === "rejected") return <span className="text-warn">거절됨</span>;
    if (status === "pending")
      return <span className="text-main-darkGray">진행중</span>;
  };

  console.log("지원", applies);
  console.log("공고", posts);
  return (
    <>
      <Header>
        <div className="size-full flex justify-center items-center relative">
          <span>내가 지원한 공고</span>
          <button className="absolute left-[20px] top-1/2 -translate-y-1/2">
            <ArrowLeftIcon color="#717171" />
          </button>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <>
          <div className="size-full flex flex-col gap-[20px] p-[20px]">
            {applies &&
              posts &&
              posts.map((post, idx) => {
                return (
                  <button
                    key={post._id.toString()}
                    onClick={() => navigate(`/notice/${post._id}`)}
                    className="w-full bg-white rounded-[10px] flex p-[10px] gap-[20px] items-center"
                  >
                    <img
                      src="https://placehold.co/90"
                      alt="img"
                      className="size-[90px] rounded-[10px]"
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
          </div>
        </>
      </Main>
      <BottomNav />
    </>
  );
};

export default WorkApplyPage;
