import React from "react";
import styled from "styled-components";
import LocationIcon from "../../components/icons/ArrowDown";

interface LocationStatusBarProps {
  locationEnabled: boolean;
  locationError: string | null;
  onUpdateLocation: () => void;
}

export const LocationStatusBar: React.FC<LocationStatusBarProps> = ({
  locationEnabled,
  locationError,
  onUpdateLocation,
}) => {
  return (
    <LocationStatusContainer>
      <div className="flex items-center justify-between w-full px-4 py-2">
        <div className="flex items-center">
          <LocationIcon color={locationEnabled ? "#5cb85c" : "#d9534f"} />
          <span className="ml-2">
            {locationEnabled ? "위치 권한 허용됨" : "위치 권한 필요함"}
          </span>
        </div>
        <button
          onClick={onUpdateLocation}
          className="bg-main-color text-white px-3 py-1 rounded-md text-sm"
        >
          위치 갱신
        </button>
      </div>
      {locationError && (
        <div className="bg-red-100 text-red-600 px-4 py-2 w-full text-sm">
          {locationError}
        </div>
      )}
    </LocationStatusContainer>
  );
};

const LocationStatusContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 95%;
  border-radius: 10px;
  background-color: white;
  margin-bottom: 16px;
  overflow: hidden;
`;

export default LocationStatusBar;
