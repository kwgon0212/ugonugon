import React from "react";

const Aside = () => {
  return (
    <aside className="hidden lg:flex flex-col max-w-[560px] justify-center items-center w-full p-6">
      <img
        src="/logo.png"
        alt="logo"
        className="mix-blend-multiply w-[300px] object-contain mb-[20px]"
      />
      <p className="text-bold text-2xl mb-[10px]">
        모두를 위한 올인원(All-in-One) 구인구직 플랫폼
      </p>
      <div className="text-gray-600 text-center break-keep">
        <p>저희는 고용주와 근로자가 채용부터 계약,</p>
        <p>출/퇴근, 임금 정산까지 한 번에 해결할 수 있도록 지원합니다.</p>
      </div>
    </aside>
  );
};

export default Aside;
