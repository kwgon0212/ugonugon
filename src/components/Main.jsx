import React from "react";

const Main = ({ children, hasHeader, hasBottomNav }) => {
  return (
    <main
      className={`absolute bg-white ${hasHeader ? "top-16" : "top-0"} ${
        hasBottomNav ? "bottom-16" : "bottom-0"
      } w-full overflow-y-auto overflow-x-hidden`}
    >
      {children}
    </main>
  );
};

export default Main;
