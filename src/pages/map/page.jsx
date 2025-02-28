import { useEffect, useState } from "react";
import Main from "../../components/Main";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import Header from "@/components/Header";
import ArrowLeftIcon from "@/components/icons/ArrowLeft";
import BottomNav from "@/components/BottomNav";

export default function MapPage() {
  const [selectedPlace, setSelectedPlace] = useState(null); // 선택된 장소 정보 저장

  // 예시 장소 데이터 (마커 클릭 시 보여줄 정보)
  const places = [
    {
      id: 1,
      title: "[업무강도상] 풀스택 프로젝트 보조 구인",
      lat: 33.450701,
      lng: 126.570667,
      location: "서울 용산구",
      type: "시급",
      pay: "10,030원",
      name: "한국경제신문",
    },
    {
      id: 2,
      name: "매점 B",
      lat: 33.451701,
      lng: 126.571667,
      location: "서울 용산구",
      type: "시급",
      pay: "10,030원",
      title: "바퀴벌레잡아줄분",
    },
    {
      id: 3,
      name: "카페 C",
      lat: 33.452701,
      lng: 126.572667,
      location: "서울 용산구",
      type: "시급",
      pay: "10,030원",
      title: "바퀴벌레잡아줄분",
    },
  ];

  return (
    <>
      <Header>
        <div className="flex items-center h-full ml-2">
          <ArrowLeftIcon />{" "}
          <span className="font-bold flex justify-center w-full mr-3">
            내 주변 검색
          </span>
        </div>
      </Header>

      <Main hasBottomNav={false}>
        <Map
          center={{
            lat: 33.450701,
            lng: 126.570667,
          }}
          style={{
            width: "100%",
            height: "100%",
          }}
          level={3}
        >
          {/* 지도 위에 표시될 마커들 */}
          {places.map((place) => (
            <MapMarker
              key={place.id}
              position={{ lat: place.lat, lng: place.lng }}
              onClick={() => setSelectedPlace(place)} // 마커 클릭 시 해당 장소 정보 표시
            />
          ))}
        </Map>

        {/* 지도 밖에 표시되는 정보 */}
        {selectedPlace && (
          <>
            {/* 배경을 흐리게 처리 */}
            <div
              className="fixed inset-0 bg-black opacity-80 z-10"
              onClick={() => setSelectedPlace(null)}
            ></div>

            <div className="fixed bottom-0 left-0 right-0 h-[196px] bg-white p-5 shadow-lg rounded-t-[10px] transition-all duration-500 transform translate-y-full animate-slide-up z-20">
              <div className="flex items-center h-full">
                <div className="w-[120px] h-[120px] flex justify-center items-center rounded-[5px] text-main-darkGray bg-main-gray">
                  사진
                </div>
                <div className="flex flex-col pl-4 max-w-[232px]">
                  <p className="text-[12px] text-main-darkGray">
                    {selectedPlace.name}
                  </p>
                  <p className="font-bold">{selectedPlace.title}</p>
                  <p className="text-[12px] text-main-darkGray mt-2 mb-2">
                    {selectedPlace.location}
                  </p>
                  <div className="flex gap-1  text-[12px]">
                    <p className="text-main-color font-bold">
                      {selectedPlace.type}
                    </p>
                    <p className=" text-main-darkGray">{selectedPlace.pay}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </Main>

      <style jsx>{`
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
      `}</style>
    </>
  );
}
