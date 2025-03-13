import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAppSelector } from "@/hooks/useRedux";
import Header from "@/components/Header";
import Main from "@/components/Main";
import BottomNav from "@/components/BottomNav";
import Notice from "@/types/Notice";
import { Link } from "react-router-dom";

interface Attendance {
  checkInTime: string | null;
  checkOutTime: string | null;
  status: "checked-in" | "checked-out" | "completed";
}

const WorkPage: React.FC = () => {
  const userId = useAppSelector((state) => state.auth.user?._id);
  const [workPosts, setWorkPosts] = useState<Notice[] | null>(null);
  const [attendances, setAttendances] = useState<Record<string, Attendance>>(
    {}
  );
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  );
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const fetchData = async () => {
      if (!userId) return;
      const userResponse = await axios.get(`/api/users?userId=${userId}`);
      const user = userResponse.data;

      const postIds = user.applies
        .filter((apply: any) => apply.status === "accepted")
        .map((apply: any) => apply.postId);

      const postsData = await Promise.all(
        postIds.map((postId: string) =>
          axios.get(`/api/post?postId=${postId}`).then((res) => res.data)
        )
      );

      setWorkPosts(postsData);

      const attendanceData = await axios.post(`/api/attendance/check`, {
        postIds,
        userId,
      });
      setAttendances(attendanceData.data);
    };
    fetchData();
  }, [userId]);

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) =>
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
      (err) => console.error("Geolocation error", err),
      { enableHighAccuracy: true }
    );
  }, []);

  const getDistance = (
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLng = ((lng2 - lng1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const handleAttendance = async (
    postId: string,
    type: "check-in" | "check-out"
  ) => {
    if (!userId || !location) return;
    try {
      await axios.post("/api/attendance/save", {
        userId,
        postId,
        type,
        timestamp: new Date(),
      });
      setAttendances((prev) => ({
        ...prev,
        [postId]: {
          ...prev[postId],
          [type === "check-in" ? "checkInTime" : "checkOutTime"]:
            new Date().toISOString(),
          status: type === "check-out" ? "completed" : "checked-in",
        },
      }));
    } catch (error) {
      console.error("Attendance error", error);
    }
  };

  return (
    <>
      <Header>
        <p className="flex justify-center items-center h-full font-bold text-lg">
          근무 현황
        </p>
      </Header>

      <Main hasBottomNav={true}>
        <div className="size-full bg-white">
          <div className="h-full p-[20px] rounded-t-[30px] bg-main-bg">
            {workPosts ? (
              workPosts.map((post) => {
                const workStart = new Date(post.hour.start);
                const workEnd = new Date(post.hour.end);
                const progress = Math.min(
                  100,
                  Math.max(
                    0,
                    ((currentTime.getTime() - workStart.getTime()) /
                      (workEnd.getTime() - workStart.getTime())) *
                      100
                  )
                );
                const distance = location
                  ? getDistance(
                      location.lat,
                      location.lng,
                      post.address.lat,
                      post.address.lng
                    )
                  : Infinity;
                const canCheckIn =
                  currentTime >=
                    new Date(workStart.getTime() - 10 * 60 * 1000) &&
                  distance <= 1;
                const canCheckOut = currentTime >= workEnd && distance <= 1;
                const attendance = attendances[post._id.toString()];
                const attendanceStatus = attendance?.checkOutTime
                  ? "근무 완료"
                  : attendance?.checkInTime
                  ? "퇴근하기"
                  : "출근하기";

                const isActive =
                  (attendance?.checkInTime &&
                    !attendance?.checkOutTime &&
                    canCheckOut) ||
                  (!attendance?.checkInTime && canCheckIn);

                const buttonColor = isActive
                  ? "bg-main-color"
                  : "bg-selected-box";

                return (
                  <div
                    key={post._id.toString()}
                    className="w-full bg-white px-[20px] py-[10px] rounded-[10px] flex flex-col gap-[10px]"
                  >
                    <div>
                      <h3 className="font-bold text-[18px]">{post.title}</h3>
                      <div className="flex gap-[10px] text-main-darkGray text-[14px]">
                        <span>{post.address.street}</span>
                        <span>
                          (근무지와의 거리:{" "}
                          <b
                            className={`font-bold ${
                              canCheckIn && canCheckOut
                                ? "text-main-color"
                                : "text-warn"
                            }`}
                          >
                            {distance.toFixed(2)}km
                          </b>
                          )
                        </span>
                      </div>
                    </div>
                    <div className="flex justify-between text-[14px]">
                      <div className="flex gap-[4px]">
                        <b className="text-main-color">{post.pay.type}</b>
                        <span>{post.pay.value.toLocaleString()}원</span>
                      </div>
                      <Link to="#">근로계약서</Link>
                    </div>
                    <hr className="border border-main-color/20 rounded-full" />
                    <div className="flex flex-col gap-[4px]">
                      <p className="font-bold">근무일자</p>
                      <p className="text-main-color">
                        {new Date().toLocaleDateString()}{" "}
                        {workStart.toLocaleTimeString()} ~{" "}
                        {workEnd.toLocaleTimeString()}
                      </p>
                    </div>
                    <div className="flex items-center gap-[10px]">
                      <div className="w-full h-[10px] border border-main-color rounded-full">
                        <div
                          className={`rounded-full bg-main-color h-full`}
                          style={{
                            width: `${progress}%`,
                          }}
                        />
                      </div>
                      <span className="flex justify-end text-main-darkGray text-[14px]">
                        {progress.toFixed(1)}%
                      </span>
                    </div>
                    <button
                      className={`w-full text-white h-[50px] rounded-[10px] ${buttonColor}`}
                      onClick={() =>
                        handleAttendance(
                          post._id.toString(),
                          attendance?.checkInTime && !attendance?.checkOutTime
                            ? "check-out"
                            : "check-in"
                        )
                      }
                      disabled={!isActive}
                    >
                      {attendanceStatus}
                    </button>
                  </div>
                );
              })
            ) : (
              <p>근무가 존재하지 않습니다</p>
            )}
          </div>
        </div>
      </Main>
      <BottomNav />
    </>
  );
};

export default WorkPage;
