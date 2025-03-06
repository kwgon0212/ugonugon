import React from "react";

const StatusBar = ({ percent }: { percent: number }) => {
  return (
    <div className="w-full absolute bottom-0 left-0">
      <div className="bg-main-color h-[3px]" style={{ width: `${percent}%` }} />
    </div>
  );
};

export default StatusBar;
