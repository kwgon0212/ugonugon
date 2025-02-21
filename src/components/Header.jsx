import React from "react";

const Header = ({ children }) => {
  return (
    <header
      className={`absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-[560px] h-16 bg-white shadow-md z-10`}
    >
      {children}
    </header>
  );
};

export default Header;
