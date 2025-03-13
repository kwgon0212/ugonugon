import React from "react";

const ChatLoading: React.FC = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-5">
      {/* Replace this with your actual loading image */}
      <div className="mb-4">
        <img
          src="https://em-content.zobj.net/source/microsoft-teams/363/mouse-face_1f42d.png"
          loading="lazy"
          alt="15.0"
          className="w-[200px] h-[200px]"
        />
      </div>
      <p className="text-lg font-semibold ">로딩 중...</p>
    </div>
  );
};

export default ChatLoading;
