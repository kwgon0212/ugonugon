import React, { JSX, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import HomeIcon from "./icons/bottomNav/Home";
import EmployIcon from "./icons/bottomNav/Employ";
import UserIcon from "./icons/bottomNav/User";
import WorkIcon from "./icons/bottomNav/Work";
import ChatIcon from "./icons/bottomNav/Chat";

const BottomNav = () => {
  const startPathname = useLocation().pathname.split("/").splice(1);

  const mainColor = "#0B798B";
  const darkGrayColor = "#717171";

  const colors = useMemo(
    () => ({
      home: startPathname.includes("") ? mainColor : darkGrayColor,
      recruit: startPathname.includes("recruit") ? mainColor : darkGrayColor,
      chat: startPathname.includes("chat") ? mainColor : darkGrayColor,
      work: startPathname.includes("work") ? mainColor : darkGrayColor,
      mypage: startPathname.includes("mypage") ? mainColor : darkGrayColor,
    }),
    [startPathname]
  );

  return (
    <nav className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[560px] h-[80px] border-t-1 border-main-bg bg-white pt-[10px] px-[20px] z-10">
      <div className="flex gap-[10px] justify-around items-center">
        <Link to={"/"} className="flex flex-col items-center gap-[4px]">
          <HomeIcon width={24} height={24} color={colors.home} />
          <span className="text-[12px]" style={{ color: colors.home }}>
            홈
          </span>
        </Link>
        <Link to={"/recruit"} className="flex flex-col items-center gap-[4px]">
          <EmployIcon width={24} height={24} color={colors.recruit} />
          <span className="text-[12px]" style={{ color: colors.recruit }}>
            고용현황
          </span>
        </Link>
        <Link to={"/chat"} className="flex flex-col items-center gap-[4px]">
          <ChatIcon width={24} height={24} color={colors.chat} />
          <span className="text-[12px]" style={{ color: colors.chat }}>
            채팅
          </span>
        </Link>
        <Link to={"/work"} className="flex flex-col items-center gap-[4px]">
          <WorkIcon width={24} height={24} color={colors.work} />
          <span className="text-[12px]" style={{ color: colors.work }}>
            근무현황
          </span>
        </Link>
        <Link to={"/mypage"} className="flex flex-col items-center gap-[4px]">
          <UserIcon width={24} height={24} color={colors.mypage} />
          <span className="text-[12px]" style={{ color: colors.mypage }}>
            내 정보
          </span>
        </Link>
      </div>
    </nav>
  );
};

export default BottomNav;
