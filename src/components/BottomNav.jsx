import React from "react";

const BottomNav = ({ children }) => {
  return (
    <nav className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[560px] h-16 bg-white border-t z-10">
      {children}
    </nav>
  );
};

export default BottomNav;
