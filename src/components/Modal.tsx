import React, { useEffect } from "react";
import styled, { keyframes } from "styled-components";

interface Props {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  children: React.ReactNode;
  position?: "bottom" | "center";
  clickOutsideClose?: boolean;
}

interface SheetProps {
  position?: "bottom" | "center";
}

const Modal = ({
  isOpen,
  setIsOpen,
  position = "center",
  clickOutsideClose = true,
  children,
}: Props) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }

    return () => {
      document.body.style.overflow = "auto"; // Cleanup (모달 닫힐 때 원래 상태로)
    };
  }, [isOpen]);

  return (
    <Overlay
      className={`${isOpen ? "active" : ""}`}
      onClick={() => clickOutsideClose && setIsOpen(false)}
      position={position}
    >
      <Sheet
        className={`${
          isOpen ? "active" : ""
        } flex flex-col items-center gap-[20px]`}
        onClick={(e) => e.stopPropagation()}
        position={position}
      >
        {position === "bottom" && (
          <div className="w-[60px] h-[5px] rounded-full bg-main-gray"></div>
        )}
        {children}
      </Sheet>
    </Overlay>
  );
};

const slideUp = keyframes`
  from {
    transform: translateY(100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const Overlay = styled.div<SheetProps>`
  position: fixed;
  top: 0;
  width: 100%;
  max-width: 560px;
  height: 100vh;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  padding: ${({ position }) => (position === "center" ? "0 20px" : "0")};
  align-items: ${({ position }) =>
    position === "center" ? "center" : "flex-end"};
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.3s ease-in-out, visibility 0.3s ease-in-out;
  z-index: 5;

  &.active {
    opacity: 1;
    visibility: visible;
  }
`;

const Sheet = styled.div<SheetProps>`
  width: 100%;
  max-height: 70%;
  min-height: ${({ position }) => (position === "center" ? "auto" : "50%")};
  background: white;
  padding: 20px;
  border-radius: ${({ position }) =>
    position === "center" ? "12px" : "12px 12px 0 0"};
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.2);
  transform: translateY(100%);
  opacity: 0;
  transition: transform 0.3s ease-in-out, opacity 0.3s ease-in-out;

  &.active {
    animation: ${slideUp} 0.3s ease-in-out forwards;
  }
`;

export default Modal;
