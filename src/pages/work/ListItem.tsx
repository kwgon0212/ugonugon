import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAppSelector } from "@/hooks/useRedux";

import CalendarIcon from "../../components/icons/Calendar";
import SendIcon from "../../components/icons/Send";
import ArrowRightIcon from "../../components/icons/ArrowRight";
import LocationIcon from "../../components/icons/ArrowDown";

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
  //getKoreanDate,
  //formatKoreanDateTime,
  calculateMinutesDifference,
} from "./utils";

// 이 부분에서 attendanceService에서 정의한 함수들을 임포트합니다
import {
  checkIn,
  checkOut,
  getAttendanceStatus,
  getAttendanceHistory,
  getAttendanceById,
  getUserStats,
  calculateWorkProgress,
  AttendanceRecord,
  CheckInData,
  CheckOutData,
} from "./attendanceService";

import mongoose from "mongoose";

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

  // 각 공고별 근무 상태를 관리하는 상태 추가
  const [workStatus, setWorkStatus] = useState<Record<string, WorkStatus>>({});
  // 기존 상태 외에 사용자 출근 상태 추가
  const [attendanceRecords, setAttendanceRecords] = useState<
    Record<string, AttendanceRecord>
  >({});

  // 공고 데이터 가져오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!userInfo || userInfo.length === 0) {
          console.error("userInfo가 비어 있습니다.");
          setLoading(false);
          return;
        }

        // 모든 공고의 데이터를 가져옴. Promise.all() 사용
        const getPostData = userInfo.map(async (user) => {
          if (!user || !user.postId) {
            console.error(
              "user 또는 noticeId가 없습니다. :",
              user,
              user.postId
            );
            return null;
          }

          const noticeId = user.postId;
          console.log("사용할 noticeId : ", noticeId);

          try {
            const response = await axios.get(`api/post/`, {
              params: { postId: noticeId },
            });
            console.log(`공고 data : ${response.data}`);

            return response.data; // 각 공고의 data 반환
          } catch (error) {
            console.error(
              `ID : ${noticeId}에 대한 데이터 가져오기 실패 : ${error}`
            );
            return null;
          }
        });

        // 모든 요청 병렬 실행
        const postDataArray = await Promise.all(getPostData);

        // 'null'값 필터링
        const validResponses = postDataArray.filter(Boolean);
        console.log(`공고 정보 가져오기 성공 : ${validResponses}`);

        if (validResponses.length > 0) {
          // 각 공고의 시간 정보 로깅 (디버깅용)
          validResponses.forEach((notice) => {
            logTimeInfo(notice);
          });
        }
        setData(validResponses);

        // 받아온 공고 데이터로 초기 근무 상태 설정
        const initialStatus: Record<string, WorkStatus> = {};
        validResponses.forEach((notice) => {
          initialStatus[notice._id] = {
            isOnTime: true,
            percent: 0,
            canCheckOut: false,
          };
        });
        setWorkStatus(initialStatus);

        // 현재 위치가 있다면 거리 계산
        // if (currentLocation) {
        //   calculateDistances(validResponses, currentLocation);
        // }
      } catch (error: any) {
        console.error("근로 정보 가져오기 실패:", error);
        setError(error.message || "데이터를 가져오는데 실패했습니다");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [userInfo]); //currentLocation

  useEffect(() => {
    // 컴포넌트 마운트 시 즉시 위치 권한 요청
    if (navigator.geolocation) {
      navigator.permissions
        .query({ name: "geolocation" })
        .then((permissionStatus) => {
          if (permissionStatus.state === "prompt") {
            // 권한 요청 다이얼로그를 강제로 표시
            getLocation();
          } else if (permissionStatus.state === "granted") {
            // 이미 권한이 있는 경우
            setLocationEnabled(true);
            getLocation();
          } else {
            // 권한이 거부된 경우
            setLocationEnabled(false);
            setLocationError(
              "위치 권한이 거부되었습니다. 브라우저 설정에서 권한을 허용해주세요."
            );
          }
        });
    }
  }, []);

  // 위치 권한 확인 및 초기화
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
            // 사용자에게 권한 요청 (위치 한 번 가져오기 시도)
            getLocation();
          } else {
            setLocationEnabled(false);
            setLocationError("위치 권한이 거부되었습니다.");
          }
        } else {
          // permissions API를 지원하지 않는 브라우저
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

        // 위치 정보를 가져왔으므로 거리 계산
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

  // 위치 정보 주기적 업데이트
  useEffect(() => {
    if (!locationEnabled) return;

    const locationWatchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ latitude, longitude });

        // 거리 계산 업데이트
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

  // 근무지와의 거리 계산
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
        newDistances[notice._id] = Infinity; // 위치 정보가 없는 경우
      }
    });

    setDistances(newDistances);
  };

  // 날짜 필터링 및 정렬
  useEffect(() => {
    if (workData.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0); // 오늘 날짜의 시작 (00:00:00)

      // 현재 날짜 이후의 근무만 필터링
      const filtered = workData.filter((notice) => {
        const endDate = getWorkEndDate(notice);
        // 종료일이 오늘 이후인 경우만 포함
        return endDate && endDate >= today;
      });

      // 가까운 날짜순으로 정렬
      const sorted = filtered.sort((a, b) => {
        const dateA = getWorkDate(a) || new Date(9999, 11, 31); // 날짜가 없으면 가장 미래로
        const dateB = getWorkDate(b) || new Date(9999, 11, 31);
        return dateA.getTime() - dateB.getTime(); // 오름차순 정렬
      });

      setFilteredData(sorted);
      console.log("필터링 및 정렬된 데이터:", sorted);

      // 현재 위치가 있다면 거리 계산
      if (currentLocation) {
        calculateDistances(sorted, currentLocation);
      }
    }
  }, [workData, currentLocation]);

  // 페이지 로드 시 출근 상태 불러오기
  useEffect(() => {
    if (!userInfo || userInfo.length === 0) return;

    const fetchAttendanceStatus = async () => {
      try {
        // userInfo에서 postId를 추출하여 noticeIds 배열 생성
        const noticeIds = userInfo.map((user) => user.postId).filter(Boolean); // null 값 제거

        // userId 가져오기
        const userId = user?._id;

        if (!userId || noticeIds.length === 0) {
          console.error(
            "출근 상태를 가져올 수 없습니다. userId 또는 noticeIds가 없습니다.",
            userId,
            noticeIds
          );
          return;
        }

        console.log(
          "출근 상태 조회 - userId:",
          userId,
          "noticeIds:",
          noticeIds
        );

        // 출근 상태 가져오기 - API 호출
        const records = await getAttendanceStatus(userId, noticeIds);

        // 출근 상태를 noticeId별로 매핑
        const recordsMap: Record<string, AttendanceRecord> = {};
        records.forEach((record) => {
          recordsMap[record.noticeId] = record;
        });

        setAttendanceRecords(recordsMap);

        // 데이터가 있을 때만 상태 업데이트
        if (filteredData.length > 0) {
          console.log("출근 상태 업데이트 - recordsMap:", recordsMap);
          updateWorkStatusFromRecords(recordsMap);
        }
      } catch (error) {
        console.error("출근 상태 가져오기 실패:", error);
      }
    };

    fetchAttendanceStatus();
  }, [userInfo, filteredData]);

  // 출근 기록으로부터 workStatus 업데이트하는 함수
  const updateWorkStatusFromRecords = (
    records: Record<string, AttendanceRecord>
  ) => {
    const updatedStatus: Record<string, WorkStatus> = {};

    filteredData.forEach((notice) => {
      const record = records[notice._id];
      const startTime = getWorkStartTime(notice);
      const endTime = getWorkEndTime(notice);

      if (record && record.checkInTime) {
        // 이미 출근한 경우
        const checkInTime = new Date(record.checkInTime);
        const estimatedCheckOutTime = endTime || new Date();
        const totalWorkDuration = calculateMinutesDifference(
          checkInTime,
          estimatedCheckOutTime
        );

        // 퇴근 여부 확인
        const hasCheckedOut = !!record.checkOutTime;
        const now = new Date();
        // attendanceService의 calculateWorkProgress 함수 사용
        const percent = hasCheckedOut
          ? 100
          : calculateWorkProgress(checkInTime, estimatedCheckOutTime, now);

        updatedStatus[notice._id] = {
          isOnTime: false, // 출근했으므로 false
          percent,
          checkInTime,
          estimatedCheckOutTime,
          totalWorkDuration,
          canCheckOut: !hasCheckedOut && percent >= 100, // 퇴근 안했고 근무 완료 시 퇴근 가능
        };
      } else {
        // 아직 출근하지 않은 경우
        updatedStatus[notice._id] = {
          isOnTime: true,
          percent: 0,
          canCheckOut: false,
        };
      }
    });

    setWorkStatus((prev) => ({
      ...prev,
      ...updatedStatus,
    }));
  };

  // 현재 시간을 1분마다 업데이트 (진행률 계산을 위해)
  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      setCurrentTime(now);

      // 각 공고별 진행률 업데이트
      updateWorkProgress(now);
    }, 60000); // 1분마다 업데이트

    return () => clearInterval(timer);
  }, []);

  // 근무 진행률 업데이트 함수
  const updateWorkProgress = (now: Date) => {
    setWorkStatus((prevStatus) => {
      const updatedStatus = { ...prevStatus };

      // 모든 공고에 대해 진행률 업데이트
      Object.keys(updatedStatus).forEach((noticeId) => {
        const status = updatedStatus[noticeId];

        // 이미 출근했고, 퇴근을 아직 하지 않은 경우
        if (
          !status.isOnTime &&
          status.checkInTime &&
          status.totalWorkDuration
        ) {
          // 출근 시간부터 지금까지 경과한 시간(분)
          const elapsedMinutes = calculateMinutesDifference(
            status.checkInTime,
            now
          );

          // 진행률 계산 (최대 100%)
          let newPercent = Math.min(
            Math.floor((elapsedMinutes / status.totalWorkDuration) * 100),
            100
          );

          // 근무 시간이 다 되었으면 퇴근 가능하게 설정
          const canCheckOut = newPercent >= 100;

          // 상태 업데이트
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

  // 출근하기 버튼 클릭 핸들러 (API 연동)
  const handleCheckAttendance = async (noticeId: string) => {
    const notice = filteredData.find((item) => item._id === noticeId);
    if (!notice) return;

    const userId = user?._id;
    if (!userId) {
      return console.log(`해당 유저가 없습니다. : ${userId}`);
    }

    // 거리 확인
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
      // API 호출로 출근 정보 서버에 저장 - attendanceService의 checkIn 함수 사용
      const attendanceData = await checkIn({
        userId: userId,
        noticeId: noticeId,
        checkInTime: now,
        location: currentLocation || undefined,
      });

      // 성공 시 상태 업데이트
      setAttendanceRecords((prev) => ({
        ...prev,
        [noticeId]: attendanceData,
      }));

      // 근무 시간 계산 (분 단위)
      const totalWorkDuration = calculateMinutesDifference(startTime, endTime);

      // 상태 업데이트
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

      // 메시지 알림
      alert(
        `${notice.title} 근무에 출근 처리되었습니다. 퇴근 시간에 퇴근 버튼을 눌러주세요.`
      );
    } catch (error) {
      console.error("출근 처리 실패:", error);
      alert("출근 처리 중 오류가 발생했습니다.");
    }
  };

  // 퇴근하기 버튼 클릭 핸들러 (API 연동)
  const handleCheckOut = async (noticeId: string) => {
    if (!userInfo) return;

    // 거리 확인
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
      return console.log(`해당 유저를 찾지 못했습니다. : ${userId}`);
    }

    try {
      // API 호출로 퇴근 정보 서버에 저장 - attendanceService의 checkOut 함수 사용
      const attendanceData = await checkOut({
        userId: userId,
        noticeId: noticeId,
        checkOutTime: now,
        location: currentLocation || undefined,
      });

      // 성공 시 상태 업데이트
      setAttendanceRecords((prev) => ({
        ...prev,
        [noticeId]: attendanceData,
      }));

      // 퇴근 처리 로직
      setWorkStatus((prevStatus) => ({
        ...prevStatus,
        [noticeId]: {
          ...prevStatus[noticeId],
          percent: 100,
          canCheckOut: false, // 이미 퇴근 처리됨
        },
      }));

      // 메시지 알림
      alert("퇴근 처리되었습니다!");
    } catch (error) {
      console.error("퇴근 처리 실패:", error);
      alert("퇴근 처리 중 오류가 발생했습니다.");
    }
  };

  // 위치 정보 업데이트 버튼 클릭 핸들러
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
          // attendanceRecord={attendanceRecords[notice._id]}
        />
      ))}

      <MenuContainer>
        <Link to="#" className="flex flex-row justify-between w-[90%]">
          <div className="flex flex-row">
            <CalendarIcon color="#717171" />
            <span className="ml-2">나의 근무 스케줄</span>
          </div>
          <ArrowRightIcon color="#717171" />
        </Link>
        <Link to="#" className="flex flex-row justify-between w-[90%]">
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
