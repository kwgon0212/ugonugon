import React, { useEffect, useRef } from "react";

const { kakao } = window;

interface MapProps {
  address: string; // 지도에 표시할 주소
}

const WorkPlaceMap: React.FC<MapProps> = ({ address }) => {
  const mapRef = useRef<kakao.maps.Map | null>(null); // ✅ 지도 객체 저장
  const markerRef = useRef<kakao.maps.Marker | null>(null); // ✅ 마커 객체 저장

  useEffect(() => {
    const mapContainer = document.getElementById("map"); // 지도 표시할 div
    if (!mapContainer) return;

    // 기존 지도 객체가 없으면 새로 생성
    if (!mapRef.current) {
      const mapOption = {
        center: new kakao.maps.LatLng(37.5665, 126.978), // 기본값: 서울 중심
        level: 3, // 확대 수준
      };

      mapRef.current = new kakao.maps.Map(mapContainer, mapOption);
    }

    if (!address || !mapRef.current) return; // ✅ mapRef.current가 null이 아니어야 실행

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(
          parseFloat(result[0].y),
          parseFloat(result[0].x)
        );

        // ✅ mapRef.current가 null이 아닐 때만 실행
        if (mapRef.current) {
          // 기존 마커 삭제 후 새 마커 생성
          if (markerRef.current) markerRef.current.setMap(null);
          markerRef.current = new kakao.maps.Marker({
            position: coords,
            map: mapRef.current,
          });

          // 지도 중심 변경
          mapRef.current.setCenter(coords);
        }
      } else {
        console.error("주소 검색 실패:", status);
      }
    });
  }, [address]); // ✅ 지도 객체를 초기화하지 않고 중심 좌표만 변경

  return (
    <div
      id="map"
      className="w-full h-[300px] rounded-[10px] border border-main-gray z-0"
    />
  );
};

export default WorkPlaceMap;
