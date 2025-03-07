import React, { useEffect, useState } from "react";

const { kakao } = window; // ✅ Kakao 지도 API 불러오기

interface MapProps {
  address: string; // 지도에 표시할 주소
}

const WorkPlaceMap: React.FC<MapProps> = ({ address }) => {
  const [map, setMap] = useState<kakao.maps.Map | null>(null);

  useEffect(() => {
    const mapContainer = document.getElementById("map"); // 지도 표시할 div
    if (!mapContainer) return;

    const mapOption = {
      center: new kakao.maps.LatLng(37.5665, 126.978), // 기본값: 서울 중심
      level: 3, // 확대 수준
    };

    const newMap = new kakao.maps.Map(mapContainer, mapOption);
    setMap(newMap);
  }, []);

  useEffect(() => {
    if (!map) return;

    const geocoder = new kakao.maps.services.Geocoder();

    geocoder.addressSearch(address, (result, status) => {
      if (status === kakao.maps.services.Status.OK) {
        const coords = new kakao.maps.LatLng(
          parseFloat(result[0].y), // ✅ 문자열 -> 숫자로 변환
          parseFloat(result[0].x) // ✅ 문자열 -> 숫자로 변환
        );

        const marker = new kakao.maps.Marker({ position: coords, map: map });
        // const infowindow = new kakao.maps.InfoWindow({
        //   content: `<div style="">${address}</div>`,
        // });

        // infowindow.open(map, marker);
        map.setCenter(coords);
      }
    });
  }, [map, address]);

  return (
    <div
      id="map"
      className="w-full h-[300px] rounded-[10px] border border-main-gray z-0"
    />
  );
};

export default WorkPlaceMap;
