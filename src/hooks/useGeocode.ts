const useGeocode = () => {
  const getCoordinates = (
    address: string
  ): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve, reject) => {
      if (!window.kakao || !window.kakao.maps) {
        console.error("Kakao Maps API가 로드되지 않았습니다.");
        reject("Kakao Maps API가 로드되지 않음");
        return;
      }

      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(address, (result, status) => {
        if (status === window.kakao.maps.services.Status.OK) {
          const lat = parseFloat(result[0].y); // 위도
          const lng = parseFloat(result[0].x); // 경도
          resolve({ lat, lng });
        } else {
          console.error("주소 검색 실패:", status);
          reject(status);
        }
      });
    });
  };

  return { getCoordinates };
};

export default useGeocode;
