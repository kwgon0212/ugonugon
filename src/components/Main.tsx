import React, { JSX } from "react";
type Props = {
  children: JSX.Element;
  hasBottomNav: boolean;
};
const Main = ({ children, hasBottomNav }: Props) => {
  return (
    <main
      className={`absolute bg-main-bg top-16 ${
        hasBottomNav ? "bottom-[80px]" : "bottom-0"
      } w-full overflow-y-auto overflow-x-hidden`}
    >
      {children}
    </main>
  );
};

export default Main;
