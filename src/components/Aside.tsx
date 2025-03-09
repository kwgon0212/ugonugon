import React from "react";

const Aside = () => {
  return (
    <aside className="hidden lg:flex flex-col max-w-[560px] justify-center items-center w-full p-6">
      <h2 className="text-2xl font-semibold mb-4">회사 소개</h2>
      <p className="text-gray-600 text-center">
        우리의 미션은 더 나은 서비스를 제공하는 것입니다. <br />
        좋은 제품과 편리한 경험을 제공합니다.
      </p>
    </aside>
  );
};

export default Aside;
