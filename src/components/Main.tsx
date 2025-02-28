import React, { JSX } from "react";
import { motion } from "framer-motion";

type Props = {
  children: JSX.Element;
  hasBottomNav: boolean;
};

const pageVariants = {
  initial: { opacity: 0, x: "-10px" },
  animate: { opacity: 1, x: 0 },
  // exit: { opacity: 0, x: "10px" },
};

const Main = ({ children, hasBottomNav }: Props) => {
  return (
    <motion.main
      variants={pageVariants}
      initial="initial"
      animate="animate"
      className={`absolute bg-main-bg top-16 ${
        hasBottomNav ? "bottom-[80px]" : "bottom-0"
      } w-full overflow-y-auto overflow-x-hidden scrollbar-hidden`}
    >
      {children}
    </motion.main>
  );
};

export default Main;
