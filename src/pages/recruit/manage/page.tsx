import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "@/hooks/useRedux";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import { Link } from "react-router-dom";
import AddIcon from "@/components/icons/Plus";
import ArrowRightIcon from "@/components/icons/ArrowRight";
import Loading from "@/components/loading/page";
// 타입 정의
interface User {
  _id: string;
  // 사용자에게 필요한 다른 속성들
}

interface Post {
  _id: string;
  title: string;
  address?: {
    street: string;
    detail?: string;
  };
  pay: {
    type: string;
    value: number;
  };
  period?: {
    start: string;
    end: string;
  };
  hour?: {
    start: string;
    end: string;
  };
  deadline?: {
    date: string;
  };
  person: number;
  applies?: Array<any>; // 필요에 따라 더 구체적인 타입으로 교체
}

interface RootState {
  auth: {
    user: User | null;
  };
}

// 날짜 포맷팅 함수
const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const year = date.getFullYear().toString().substr(-2); // 년도 뒤의 2자리만
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}.${month}.${day}`;
};

// 시간 포맷팅 함수
const formatTime = (dateString: string): string => {
  const date = new Date(dateString);
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${hours}:${minutes}`;
};

interface ReCruitManageProps {
  post: Post;
}

function ReCruitManage({ post }: ReCruitManageProps): JSX.Element {
  const spanStyle = {
    text: "font-bold text-main-color",
  };

  // 주소 정보를 문자열로 변환
  const addressString = post.address
    ? `${post.address.street} ${post.address.detail || ""}`
    : "주소 정보 없음";

  // 지원자 수 계산
  const applicantCount = post.applies ? post.applies.length : 0;

  // 날짜 범위 포맷팅
  const periodString = post.period
    ? `${formatDate(post.period.start)}~${formatDate(post.period.end)}`
    : "기간 정보 없음";

  // 시간 범위 포맷팅
  const timeString = post.hour
    ? `${formatTime(post.hour.start)}~${formatTime(post.hour.end)}`
    : "시간 정보 없음";

  // 마감일 포맷팅
  const deadlineString = post.deadline
    ? formatDate(post.deadline.date)
    : "마감일 정보 없음";

  return (
    <Link
      to={`/notice/${post._id}`}
      className="block border border-main-gray rounded-[10px]"
    >
      <div className="bg-white rounded-[10px] flex flex-col gap-[10px] p-[20px]">
        <div className="flex justify-between items-center">
          <p className="font-bold text-lg">{post.title}</p>
          <ArrowRightIcon />
        </div>
        <div className="flex justify-between">
          <div className="flex flex-col gap-0.5 text-main-darkGray text-xs">
            <p className="text-sm font-bold text-black">근무조건</p>
            <p>
              <span className={spanStyle.text}>{post.pay.type}</span>{" "}
              {post.pay.value.toLocaleString()}
            </p>
            <p>
              <span className={spanStyle.text}>기간</span> {periodString}
            </p>
            <p>
              <span className={spanStyle.text}>시간</span> {timeString}
            </p>
          </div>
          <div className="flex flex-col gap-0.5 text-xs text-main-darkGray">
            <p className="text-sm font-bold text-black">모집조건</p>
            <p>
              <span className={spanStyle.text}>마감</span> {deadlineString}
            </p>
            <p>
              <span className={spanStyle.text}>인원</span> {post.person}
            </p>
          </div>
          <div className="flex flex-col gap-2 text-xs text-main-color">
            <div className="bg-selected-box rounded-[10px] text-center px-2 py-1">
              모집중
            </div>
            <div className="bg-selected-box rounded-[10px] text-center px-2 py-1">
              {applicantCount}명 지원
            </div>
          </div>
        </div>
        <div className="flex flex-col gap-0.5 text-xs mt-2 text-main-darkGray">
          <p className="text-sm font-bold text-black">근무지역</p>
          <p>{addressString}</p>
        </div>
      </div>
    </Link>
  );
}

const ReCruitManagePage: React.FC = () => {
  const navigate = useNavigate();
  // Redux에서 로그인한 사용자 정보 가져오기
  const user = useAppSelector((state: RootState) => state.auth.user);
  const [myPosts, setMyPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 사용자가 등록한 공고 목록 불러오기
  useEffect(() => {
    const fetchMyPosts = async () => {
      if (!user || !user._id) {
        setError("로그인이 필요한 서비스입니다.");
        setLoading(false);
        return;
      } else {
        setError(null);
        setLoading(true);
      }

      try {
        const response = await axios.get<{ posts: Post[] }>(
          `/api/post/recruit/manage/${user._id}`
        );

        setMyPosts(response.data.posts);
        setLoading(false);
      } catch (err) {
        console.error("공고 목록 불러오기 실패:", err);
        setError("공고 목록을 불러오는데 실패했습니다.");
        setLoading(false);
      }
    };

    fetchMyPosts();
  }, [user]);

  return (
    <>
      <Header>
        <div className="size-full flex justify-center items-center font-bold bg-main-color text-white relative">
          <button
            onClick={() => navigate(-1)}
            className="absolute top-1/2 -translate-y-1/2 left-layout"
          >
            <ArrowLeftIcon className="text-white" />
          </button>
          <span>고용 현황</span>
        </div>
      </Header>
      <Main hasBottomNav={true}>
        <div className="size-full bg-white p-[20px] flex flex-col gap-[20px]">
          {/* 상단 제목 */}
          <h2 className="text-[18px] font-bold">나의 공고 관리</h2>

          {loading ? (
            <Loading />
          ) : error ? (
            <div className="flex justify-center items-center h-40">
              <p className="text-red-500">{error}</p>
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {/* 새 공고 등록 버튼 */}

              {/* 공고 목록 */}
              {myPosts.length > 0 ? (
                myPosts.map((post) => (
                  <ReCruitManage key={post._id} post={post} />
                ))
              ) : (
                <div className="bg-white h-[160px] rounded-[10px] flex justify-center items-center">
                  <p className="text-main-darkGray">등록한 공고가 없습니다.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </Main>
      <BottomNav></BottomNav>
    </>
  );
};

export default ReCruitManagePage;
