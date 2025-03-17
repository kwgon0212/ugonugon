import React from "react";

const Loading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-5">
      {/* Replace this with your actual loading image */}
      <div className="mb-4">
        <img
          src="https://em-content.zobj.net/source/microsoft-teams/363/hamster_1f439.png"
          loading="lazy"
          alt="15.0"
          className="w-auto h-full"
        />
      </div>
      <p className="text-lg font-semibold ">로딩 중...</p>
    </div>
  );
};

export default Loading;
