import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "@/hooks/useRedux";

import CalendarIcon from "../../components/icons/Calendar";
import SendIcon from "../../components/icons/Send";
import ArrowRightIcon from "../../components/icons/ArrowRight";

import { WorkItem } from "./WorkItem";
import { LocationStatusBar } from "./LocationStatusBar";
import { AttendanceGuide } from "./AttendanceGuide";

import {
  WorkData,
  UserData,
  WorkStatus,
  Location,
  getWorkDate,
  getWorkStartTime,
  getWorkEndTime,
  getWorkEndDate,
  getWorkplaceLocation,
  logTimeInfo,
  calculateDistance,
  DISTANCE_TOLERANCE,
  isWithinAllowedDistance,
  calculateMinutesDifference,
} from "./utils";

// 새 attendanceService.ts의 함수들 (checkIn, checkOut, getAttendanceStatus 등)
import {
  checkIn,
  checkOut,
  getAttendanceStatus,
  calculateWorkProgress,
  AttendanceRecord,
} from "./attendanceService";

export function ListItem({ userInfo }: { userInfo: UserData[] | null }) {
  const user = useAppSelector((state) => state.auth.user);

  const [workData, setData] = useState<WorkData[]>([]);
  const [filteredData, setFilteredData] = useState<WorkData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // 현재 위치 정보 상태
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [locationEnabled, setLocationEnabled] = useState<boolean>(false);

  // 거리 정보 상태
  const [distances, setDistances] = useState<Record<string, number>>({});

  // 각 공고별 근무 상태 및 출퇴근 기록 관리
  const [workStatus, setWorkStatus] = useState<Record<string, WorkStatus>>({});
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, AttendanceRecord>
  >({});

  // --------------------------------------
  // 1. 공고 데이터 가져오기
  // --------------------------------------
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!userInfo || userInfo.length === 0) {
          console.error("userInfo가 비어 있습니다.");
          setLoading(false);
          return;
        }

        const getPostData = userInfo.map(async (u) => {
          if (!u || !u.postId) {
            console.error("user 또는 noticeId가 없습니다. :", u, u.postId);
            return null;
          }
          const noticeId = u.postId;
          console.log("사용할 noticeId : ", noticeId);
          try {
            const response = await axios.get(`api/post/`, {
              params: { postId: noticeId },
            });
            console.log(`공고 data : ${response.data}`);
            return response.data;
          } catch (error) {
            console.error(
              `ID : ${noticeId}에 대한 데이터 가져오기 실패 : ${error}`
            );
            return null;
          }
        });

        const postDataArray = await Promise.all(getPostData);
        const validResponses = postDataArray.filter(Boolean);
        console.log(`공고 정보 가져오기 성공 : ${validResponses}`);
        validResponses.forEach((notice) => logTimeInfo(notice));
        setData(validResponses);

        const initialStatus: Record<string, WorkStatus> = {};
        validResponses.forEach((notice) => {
          initialStatus[notice._id] = {
            isOnTime: true,
            percent: 0,
            canCheckOut: false,
          };
        });
        setWorkStatus(initialStatus);
      } catch (error: any) {
        console.error("근로 정보 가져오기 실패:", error);
        setError(error.message || "데이터를 가져오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userInfo]);

  // --------------------------------------
  // 2. 위치 권한 요청 및 초기 위치 가져오기
  // --------------------------------------
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "prompt") {
            getLocation();
          } else if (permissionStatus.state === "granted") {
            setLocationEnabled(true);
            getLocation();
          } else {
            setLocationEnabled(false);
            setLocationError(
              "위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요."
            );
          }
        });
    }
  }, []);

  // 위치 권한 확인 및 초기화 (추가 useEffect)
  useEffect(() => {
    const checkLocationPermission = async () => {
      try {
        if ("permissions" in navigator) {
          const status = await navigator.permissions.query({
            name: "geolocation" as PermissionName,
          });
          if (status.state === "granted") {
            setLocationEnabled(true);
            getLocation();
          } else if (status.state === "prompt") {
            getLocation();
          } else {
            setLocationEnabled(false);
            setLocationError("위치 권한이 거부되었습니다.");
          }
        } else {
          getLocation();
        }
      } catch (error) {
        console.error("위치 권한 확인 오류:", error);
        setLocationError("위치 권한 확인 중 오류가 발생했습니다.");
      }
    };
    checkLocationPermission();
  }, []);

  // 위치 정보 가져오기 함수
  const getLocation = () => {
    if (!navigator.geolocation) {
      setLocationError("브라우저가 위치 정보를 지원하지 않습니다.");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        setLocationEnabled(true);
        setLocationError(null);
        if (filteredData.length > 0) {
          calculateDistances(filteredData, { latitude, longitude });
        }
      },
      (error) => {
        console.error("위치 정보 가져오기 오류:", error);
        setLocationError(
          error.code === 1
            ? "위치 정보 접근이 거부되었습니다."
            : "위치 정보를 가져올 수 없습니다."
        );
        setLocationEnabled(false);
      },
      { enableHighAccuracy: true, timeout: 5000, maximumAge: 0 }
    );
  };

  // --------------------------------------
  // 3. 위치 정보 주기적 업데이트
  // --------------------------------------
  useEffect(() => {
    if (!locationEnabled) return;
    const locationWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });
        if (filteredData.length > 0) {
          calculateDistances(filteredData, { latitude, longitude });
        }
      },
      (error) => {
        console.error("위치 모니터링 오류:", error);
        setLocationError("위치 정보를 업데이트할 수 없습니다.");
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 5000 }
    );
    return () => {
      navigator.geolocation.clearWatch(locationWatchId);
    };
  }, [locationEnabled, filteredData]);

  // --------------------------------------
  // 4. 퇴근 시 현재 위치 정보 가져오기 (Promise)
  // --------------------------------------
  const getCurrentLocation = (): Promise<Location> => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        return reject(
          new Error("이 브라우저는 위치 정보를 지원하지 않습니다.")
        );
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          reject(error);
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
      );
    });
  };

  // --------------------------------------
  // 5. 근무지와의 거리 계산
  // --------------------------------------
  const calculateDistances = (notices: WorkData[], userLocation: Location) => {
    const newDistances: Record<string, number> = {};
    notices.forEach((notice) => {
      const workplaceLocation = getWorkplaceLocation(notice);
      if (workplaceLocation) {
        const distance = calculateDistance(
          userLocation.latitude,
          userLocation.longitude,
          workplaceLocation.lat,
          workplaceLocation.lng
        );
        newDistances[notice._id] = distance;
      } else {
        newDistances[notice._id] = Infinity;
      }
    });
    setDistances(newDistances);
  };

  // --------------------------------------
  // 6. 날짜 필터링 및 정렬
  // --------------------------------------
  useEffect(() => {
    if (workData.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const filtered = workData.filter((notice) => {
        const endDate = getWorkEndDate(notice);
        return endDate && endDate >= today;
      });
      const sorted = filtered.sort((a, b) => {
        const dateA = getWorkDate(a) || new Date(9999, 11, 31);
        const dateB = getWorkDate(b) || new Date(9999, 11, 31);
        return dateA.getTime() - dateB.getTime();
      });
      setFilteredData(sorted);
      console.log("필터링 및 정렬된 데이터:", sorted);
      if (currentLocation) {
        calculateDistances(sorted, currentLocation);
      }
    }
  }, [workData, currentLocation]);

  // --------------------------------------
  // 7. 페이지 로드 시 출근 상태 불러오기
  // --------------------------------------
  useEffect(() => {
    if (!userInfo || userInfo.length === 0) return;
    const fetchAttendanceStatus = async () => {
      try {
        const userId = user?._id;
        if (!userId) {
          console.error("출근 상태를 가져올 수 없습니다. userId가 없습니다.");
          return;
        }
        console.log("출근 상태 조회 - userId:", userId);
        const records = await getAttendanceStatus(userId);
        const recordsArray = Array.isArray(records) ? records : [records];
        const recordsMap: Record<string, AttendanceRecord> = {};
        recordsArray.forEach((record) => {
          if (record) {
            recordsMap[record.noticeId] = record;
          }
        });
        setAttendanceRecords(recordsMap);
        if (filteredData.length > 0) {
          updateWorkStatusFromRecords(recordsMap);
        }
      } catch (error) {
        console.error("출근 상태 가져오기 실패:", error);
      }
    };
    fetchAttendanceStatus();
  }, [userInfo, filteredData, user?._id]);

  // --------------------------------------
  // 8. 출근 기록으로부터 workStatus 업데이트
  // --------------------------------------
  const updateWorkStatusFromRecords = (
    records: Record<string, AttendanceRecord>
  ) => {
    const updatedStatus: Record<string, WorkStatus> = {};
    filteredData.forEach((notice) => {
      const record = records[notice._id];
      const startTime = getWorkStartTime(notice);
      const endTime = getWorkEndTime(notice);
      if (record && record.checkInTime) {
        const checkInTime = new Date(record.checkInTime);
        const estimatedCheckOutTime = endTime || new Date();
        const totalWorkDuration = calculateMinutesDifference(
          checkInTime,
          estimatedCheckOutTime
        );
        const hasCheckedOut = !!record.checkOutTime;
        const now = new Date();
        const percent = hasCheckedOut
          ? 100
          : calculateWorkProgress(checkInTime, estimatedCheckOutTime, now);
        updatedStatus[notice._id] = {
          isOnTime: false,
          percent,
          checkInTime,
          estimatedCheckOutTime,
          totalWorkDuration,
          canCheckOut: !hasCheckedOut && percent >= 100,
        };
      } else {
        updatedStatus[notice._id] = {
          isOnTime: true,
          percent: 0,
          canCheckOut: false,
        };
      }
    });
    setWorkStatus((prev) => ({ ...prev, ...updatedStatus }));
  };

  // --------------------------------------
  // 9. 현재 시간을 1분마다 업데이트 (진행률 계산)
  // --------------------------------------
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);
      updateWorkProgress(now);
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  const updateWorkProgress = (now: Date) => {
    setWorkStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus };
      Object.keys(updatedStatus).forEach((noticeId) => {
        const status = updatedStatus[noticeId];
        if (
          !status.isOnTime &&
          status.checkInTime &&
          status.totalWorkDuration
        ) {
          const elapsedMinutes = calculateMinutesDifference(
            status.checkInTime,
            now
          );
          let newPercent = Math.min(
            Math.floor((elapsedMinutes / status.totalWorkDuration) * 100),
            100
          );
          const canCheckOut = newPercent >= 100;
          updatedStatus[noticeId] = {
            ...status,
            percent: newPercent,
            canCheckOut,
          };
        }
      });
      return updatedStatus;
    });
  };

  // --------------------------------------
  // 10. 출근하기 버튼 클릭 핸들러 (API 연동)
  // --------------------------------------
  const handleCheckAttendance = async (noticeId: string) => {
    const notice = filteredData.find((item) => item._id === noticeId);
    if (!notice) return;
    const userId = user?._id;
    if (!userId) {
      console.log(`해당 유저가 없습니다. : ${userId}`);
      return;
    }
    if (locationEnabled && distances[noticeId] !== undefined) {
      const distanceInMeters = distances[noticeId];
      if (!isWithinAllowedDistance(distanceInMeters)) {
        alert(
          `근무지와의 거리가 허용 범위(${DISTANCE_TOLERANCE}m)를 초과합니다. 현재 거리: ${Math.round(
            distanceInMeters
          )}m`
        );
        return;
      }
    }
    const now = new Date();
    const startTime = getWorkStartTime(notice);
    const endTime = getWorkEndTime(notice);
    if (!startTime || !endTime) return;
    try {
      const attendanceData = await checkIn({
        userId: userId,
        noticeId: noticeId,
        checkInTime: now,
        checkInLocation: currentLocation || undefined,
      });
      setAttendanceRecords((prev) => ({ ...prev, [noticeId]: attendanceData }));
      const totalWorkDuration = calculateMinutesDifference(startTime, endTime);
      setWorkStatus((prevStatus) => ({
        ...prevStatus,
        [noticeId]: {
          ...prevStatus[noticeId],
          isOnTime: false,
          checkInTime: now,
          estimatedCheckOutTime: endTime,
          totalWorkDuration,
          percent: 0,
          canCheckOut: false,
        },
      }));
      alert(
        `${notice.title} 근무에 출근 처리되었습니다. 퇴근 시간에 퇴근 버튼을 눌러주세요.`
      );
    } catch (error) {
      console.error("출근 처리 실패:", error);
      alert("출근 처리 중 오류가 발생했습니다.");
    }
  };

  // --------------------------------------
  // 11. 퇴근하기 버튼 클릭 핸들러 (API 연동)
  // --------------------------------------
  const handleCheckOut = async (noticeId: string) => {
    if (!userInfo) return;
    if (locationEnabled && distances[noticeId] !== undefined) {
      const distanceInMeters = distances[noticeId];
      if (!isWithinAllowedDistance(distanceInMeters)) {
        alert(
          `근무지와의 거리가 허용 범위(${DISTANCE_TOLERANCE}m)를 초과합니다. 현재 거리: ${Math.round(
            distanceInMeters
          )}m`
        );
        return;
      }
    }
    const now = new Date();
    const userId = user?._id;
    if (!userId) {
      console.log(`해당 유저를 찾지 못했습니다. : ${userId}`);
      return;
    }
    try {
      // 퇴근 버튼 클릭 시 최신 위치 받아오기
      const updatedLocation = await getCurrentLocation();
      const attendanceData = await checkOut({
        userId,
        noticeId,
        checkOutTime: now,
        checkOutLocation: updatedLocation || undefined,
      });
      setAttendanceRecords((prev) => ({ ...prev, [noticeId]: attendanceData }));
      setWorkStatus((prevStatus) => ({
        ...prevStatus,
        [noticeId]: {
          ...prevStatus[noticeId],
          percent: 100,
          canCheckOut: false,
        },
      }));
      alert("퇴근 처리되었습니다!");
    } catch (error) {
      console.error("퇴근 처리 실패:", error);
      alert("퇴근 처리 중 오류가 발생했습니다.");
    }
  };

  // --------------------------------------
  // 12. 위치 정보 업데이트 핸들러
  // --------------------------------------
  const handleUpdateLocation = () => {
    getLocation();
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }
  if (error) {
    return <div>에러 발생: {error}</div>;
  }
  if (filteredData.length === 0) {
    return <div>현재 예정된 근무 정보가 없습니다.</div>;
  }

  return (
    <>
      <LocationStatusBar
        locationEnabled={locationEnabled}
        locationError={locationError}
        onUpdateLocation={handleUpdateLocation}
      />

      <AttendanceGuide />

      {filteredData.map((notice) => (
        <WorkItem
          key={notice._id}
          notice={notice}
          status={
            workStatus[notice._id] || {
              isOnTime: true,
              percent: 0,
              canCheckOut: false,
            }
          }
          distance={distances[notice._id]}
          currentLocation={currentLocation}
          locationEnabled={locationEnabled}
          currentTime={currentTime}
          onCheckIn={handleCheckAttendance}
          onCheckOut={handleCheckOut}
          attendanceRecord={attendanceRecords[notice._id]}
        />
      ))}

      <MenuContainer>
        <Link
          to="/work/apply"
          className="flex flex-row justify-between w-[90%]"
        >
          <div className="flex flex-row">
            <SendIcon color="#717171" />
            <span className="ml-2">내가 지원한 공고</span>
          </div>
          <ArrowRightIcon color="#717171" />
        </Link>
      </MenuContainer>
    </>
  );
}

const MenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-evenly;
  align-items: center;
  width: 95%;
  height: 120px;
  background-color: white;
  border-radius: 10px;
  margin-top: 24px;
  margin-bottom: 20px;
`;

export default ListItem;
