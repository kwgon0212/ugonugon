// map/page.tsx
import { useEffect, useState, ReactElement } from "react";
import { useNavigate } from "react-router-dom";
import Main from "../../components/Main";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import useKakaoLoader from "./useKakaoLoader";
import axios from "axios";
interface Post {
  _id: string;
  title: string;
  jobType: string;
  pay: {
    type: string;
    value: number;
  };
  hireType: string[];
  address: {
    zipcode: string;
    street: string;
    detail: string;
    lat: number;
    lng: number;
  };
  images: string[];
  name?: string; // 회사명 또는 작성자명
  location?: string; // UI 표시용 위치 정보
  distance?: number; // 사용자 위치와의 거리
}

interface MarkerGroup {
  lat: number;
  lng: number;
  posts: Post[];
}

interface Coordinates {
  lat: number;
  lng: number;
}

export default function MapPage(): ReactElement {
  useKakaoLoader(); // 카카오맵 로더 사용
  const navigate = useNavigate();
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [selectedMarkerGroup, setSelectedMarkerGroup] =
    useState<MarkerGroup | null>(null);
  const [currentPostIndex, setCurrentPostIndex] = useState<number>(0);
  const [userLocation, setUserLocation] = useState<Coordinates>({
    lat: 37.5665, // 서울 시청 기본값
    lng: 126.978,
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [nearbyPosts, setNearbyPosts] = useState<Post[]>([]);
  const [markerGroups, setMarkerGroups] = useState<MarkerGroup[]>([]);
  const [radius, setRadius] = useState<number>(3); // km 단위 검색 반경
  // 지도 확대 레벨 상태 추가
  const [mapLevel, setMapLevel] = useState<number>(6);

  // 사용자의 현재 위치 가져오기
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newPosition = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          setUserLocation(newPosition);
          setIsLoading(false);
          fetchNearbyPosts(newPosition);
        },
        (error) => {
          console.error("현재 위치를 가져오는데 실패했습니다:", error);
          setIsLoading(false);
          // 기본 위치로 주변 공고를 가져옴
          fetchNearbyPosts(userLocation);
        },
        { enableHighAccuracy: true }
      );
    } else {
      console.error("이 브라우저에서는 Geolocation이 지원되지 않습니다.");
      setIsLoading(false);
      fetchNearbyPosts(userLocation);
    }
  }, []);

  // 주변 공고 가져오기
  const fetchNearbyPosts = async (location: Coordinates) => {
    try {
      // 모든 공고 리스트 가져오기
      const response = await axios.get("/api/post/lists");
      const posts = response.data;

      // 위도/경도 정보가 있는 공고만 필터링하고 거리 계산
      const postsWithLocation = posts.filter(
        (post: Post) => post.address && post.address.lat && post.address.lng
      );

      // 위치 기반으로 가까운 순으로 정렬
      const nearbyPostsWithDistance = postsWithLocation.map((post: Post) => {
        const distance = calculateDistance(
          location.lat,
          location.lng,
          post.address.lat,
          post.address.lng
        );

        return {
          ...post,
          distance,
          location: post.address.street.split(" ").slice(0, 2).join(" "), // 주소에서 시/구만 추출
        };
      });

      // 반경 내에 있는 공고만 필터링 후 거리순 정렬
      const filteredPosts = nearbyPostsWithDistance
        .filter((post: Post & { distance: number }) => post.distance <= radius)
        .sort(
          (a: Post & { distance: number }, b: Post & { distance: number }) =>
            a.distance - b.distance
        );

      setNearbyPosts(filteredPosts);

      // 같은 위치의 마커 그룹화
      const groupedMarkers = groupPostsByLocation(filteredPosts);
      setMarkerGroups(groupedMarkers);

      // 최초 로드 시 검색 반경에 맞는 지도 레벨 설정
      if (isLoading) {
        setMapLevel(calculateMapLevel(radius));
      }
    } catch (error) {
      console.error("공고 가져오기 실패:", error);
    }
  };

  // 같은 위치의 공고들을 그룹화하는 함수
  const groupPostsByLocation = (posts: Post[]): MarkerGroup[] => {
    const groups: MarkerGroup[] = [];
    const locationMap: Record<string, MarkerGroup> = {};

    posts.forEach((post) => {
      // 위도,경도를 소수점 5자리까지 반올림하여 키로 사용 (약 1m 정확도)
      const key = `${post.address.lat.toFixed(5)},${post.address.lng.toFixed(
        5
      )}`;

      if (!locationMap[key]) {
        const newGroup: MarkerGroup = {
          lat: post.address.lat,
          lng: post.address.lng,
          posts: [post],
        };
        locationMap[key] = newGroup;
        groups.push(newGroup);
      } else {
        locationMap[key].posts.push(post);
      }
    });

    return groups;
  };

  // 마커 그룹 선택 시 처리하는 함수
  const handleMarkerClick = (markerGroup: MarkerGroup) => {
    setSelectedMarkerGroup(markerGroup);
    setCurrentPostIndex(0); // 첫 번째 공고부터 표시
    setSelectedPost(markerGroup.posts[0]);
  };

  // 다음 공고 표시
  const handleNextPost = () => {
    if (!selectedMarkerGroup) return;

    const nextIndex = (currentPostIndex + 1) % selectedMarkerGroup.posts.length;
    setCurrentPostIndex(nextIndex);
    setSelectedPost(selectedMarkerGroup.posts[nextIndex]);
  };

  // 이전 공고 표시
  const handlePrevPost = () => {
    if (!selectedMarkerGroup) return;

    const prevIndex =
      (currentPostIndex - 1 + selectedMarkerGroup.posts.length) %
      selectedMarkerGroup.posts.length;
    setCurrentPostIndex(prevIndex);
    setSelectedPost(selectedMarkerGroup.posts[prevIndex]);
  };

  // 두 지점 간의 거리를 계산하는 함수 (하버사인 공식 - km 단위)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371; // 지구 반경 (km)
    const dLat = deg2rad(lat2 - lat1);
    const dLon = deg2rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) *
        Math.cos(deg2rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 도(degree)를 라디안(radian)으로 변환
  const deg2rad = (deg: number): number => {
    return deg * (Math.PI / 180);
  };

  // 공고 상세 페이지로 이동
  const handlePostClick = (postId: string) => {
    navigate(`/notice/${postId}`);
  };

  // 검색 반경 변경 핸들러 - 지도 레벨도 함께 조정
  const handleRadiusChange = (newRadius: number) => {
    setRadius(newRadius);
    fetchNearbyPosts(userLocation);

    // 검색 반경에 따라 지도 확대/축소 레벨 자동 조정
    // 반경이 작을수록 지도를 확대하고, 클수록 축소함
    // 카카오맵 레벨: 1(최대확대) ~ 14(최대축소)
    const newLevel = calculateMapLevel(newRadius);
    setMapLevel(newLevel);
  };

  // 검색 반경에 따라 적절한 지도 레벨을 계산하는 함수
  const calculateMapLevel = (radius: number): number => {
    // 검색 반경과 지도 레벨의 대략적인 매핑
    // 실제 지도에서 적절히 조정 필요
    if (radius <= 1) return 3; // 1km 이하: 매우 확대
    else if (radius <= 2) return 4;
    else if (radius <= 3) return 5;
    else if (radius <= 5) return 6;
    else if (radius <= 7) return 7;
    else return 8; // 7km 초과: 매우 축소
  };

  return (
    <div>
      <Header>
        <div className="flex items-center h-full px-[20px] bg-main-color text-white">
          <button
            onClick={() => {
              navigate(-1);
            }}
          >
            <ArrowLeftIcon className="text-white" />
          </button>
          <span className="font-bold flex justify-center w-full">
            내 주변 채용정보
          </span>
        </div>
      </Header>

      <Main hasBottomNav={false}>
        <div className="relative w-full h-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-full">
              <p>위치 정보를 불러오는 중...</p>
            </div>
          ) : (
            <>
              {/* 검색 반경 조절 UI */}
              <div className="absolute top-3 right-3 z-10 bg-white p-2 rounded-lg shadow-md">
                <div className="text-sm font-medium mb-1">
                  검색 반경: {radius}km
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleRadiusChange(Math.max(1, radius - 1))}
                    className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    -
                  </button>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    value={radius}
                    onChange={(e) => handleRadiusChange(Number(e.target.value))}
                    className="w-20"
                  />
                  <button
                    onClick={() => handleRadiusChange(Math.min(10, radius + 1))}
                    className="bg-gray-200 w-8 h-8 rounded-full flex items-center justify-center"
                  >
                    +
                  </button>
                </div>
              </div>

              <Map
                center={userLocation}
                style={{
                  width: "100%",
                  height: "100%",
                }}
                level={mapLevel}
              >
                {/* 사용자 현재 위치 마커 */}
                <MapMarker
                  position={userLocation}
                  image={{
                    src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 노란색 별 마커
                    size: { width: 24, height: 35 },
                  }}
                />

                {/* 그룹화된 마커들 - 여러 공고는 빨간색, 단일 공고는 기본 마커 */}
                {markerGroups.map((group, idx) => (
                  <MapMarker
                    key={`group-${idx}`}
                    position={{ lat: group.lat, lng: group.lng }}
                    onClick={() => handleMarkerClick(group)}
                    image={{
                      src:
                        group.posts.length > 1
                          ? "https://maps.google.com/mapfiles/ms/icons/red-dot.png" // 빨간색 마커 (여러 공고)
                          : "https://maps.google.com/mapfiles/ms/icons/blue-dot.png", // 파란색 마커 (단일 공고)
                      size: { width: 32, height: 32 },
                    }}
                  />
                ))}
              </Map>

              {/* 현재 위치로 가기 버튼 제거됨 */}
            </>
          )}

          {/* 마커 클릭 시 공고 정보 표시 */}
          {selectedPost && selectedMarkerGroup && (
            <>
              {/* 배경을 흐리게 처리 */}
              <div
                className="absolute inset-0 bg-black opacity-50 z-10"
                onClick={() => {
                  setSelectedPost(null);
                  setSelectedMarkerGroup(null);
                }}
              ></div>

              <div
                className="absolute bottom-0 left-0 right-0 bg-white shadow-lg rounded-t-[10px] transition-all duration-500 transform translate-y-full animate-slide-up z-20"
                onClick={() => handlePostClick(selectedPost._id)}
              >
                {/* 여러 공고 탐색 버튼 (공고가 2개 이상일 때만 표시) */}
                {selectedMarkerGroup.posts.length > 1 && (
                  <div className="flex justify-between items-center p-2 bg-gray-100 rounded-t-[10px]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 요소 클릭 이벤트 방지
                        handlePrevPost();
                      }}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      &lt; 이전
                    </button>
                    <span className="text-sm font-medium">
                      {currentPostIndex + 1} /{" "}
                      {selectedMarkerGroup.posts.length}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation(); // 부모 요소 클릭 이벤트 방지
                        handleNextPost();
                      }}
                      className="p-1 rounded hover:bg-gray-200"
                    >
                      다음 &gt;
                    </button>
                  </div>
                )}

                <div className="flex items-center p-5 h-[196px]">
                  <div className="w-[120px] h-[120px] flex justify-center items-center rounded-[5px] overflow-hidden bg-main-gray">
                    {selectedPost.images && selectedPost.images.length > 0 ? (
                      <img
                        src={selectedPost.images[0]}
                        alt={selectedPost.title}
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-main-darkGray">사진</span>
                    )}
                  </div>
                  <div className="flex flex-col pl-4 max-w-[232px]">
                    <p className="text-[12px] text-main-darkGray">
                      {selectedPost.jobType || "일자리"}
                    </p>
                    <p className="font-bold">{selectedPost.title}</p>
                    <p className="text-[12px] text-main-darkGray mt-2 mb-2">
                      {selectedPost.address.street}
                    </p>
                    <div className="flex gap-1 text-[12px]">
                      <p className="text-main-color font-bold">
                        {selectedPost.pay.type}
                      </p>
                      <p className="text-main-darkGray">
                        {selectedPost.pay.value.toLocaleString()}원
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* 검색 결과 숫자 표시 */}
          <div className="absolute bottom-3 right-3 z-10 bg-white px-3 py-2 rounded-lg shadow-md">
            <p className="text-sm font-medium">
              주변 {radius}km 이내 채용공고: {nearbyPosts.length}개
            </p>
          </div>

          {/* 마커 범례 설명 */}
          <div className="absolute top-3 left-3 z-10 bg-white p-2 rounded-lg shadow-md">
            <div className="text-sm font-medium mb-1">마커 설명</div>
            <div className="flex flex-col gap-1 text-xs">
              <div className="flex items-center gap-1">
                <img
                  src="https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png"
                  alt="현재 위치"
                  className="w-4 h-4"
                />
                <span>현재 위치</span>
              </div>
              <div className="flex items-center gap-1">
                <img
                  src="https://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  alt="공고 1개"
                  className="w-5 h-5"
                />
                <span>공고 1개</span>
              </div>
              <div className="flex items-center gap-1">
                <img
                  src="https://maps.google.com/mapfiles/ms/icons/red-dot.png"
                  alt="공고 여러개"
                  className="w-5 h-5"
                />
                <span>공고 여러개</span>
              </div>
            </div>
          </div>
        </div>
      </Main>

      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes slide-up {
            0% {
              transform: translateY(100%);
              opacity: 0;
            }
            100% {
              transform: translateY(0);
              opacity: 1;
            }
          }

          .animate-slide-up {
            animation: slide-up 0.5s ease-out forwards;
          }
        `,
        }}
      />
    </div>
  );
}
