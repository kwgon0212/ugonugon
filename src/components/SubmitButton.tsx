import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps & { diff?: boolean }> = ({
  children,
  diff = false,
  ...attributes
}) => {
  return (
    <Submit diff={diff} {...attributes}>
      {children}
    </Submit>
  );
};

const Submit = styled.button<{ diff?: boolean }>`
  width: 100%;
  height: 50px;
  border: ${({ diff }) => (diff ? "1px solid var(--main-color)" : "none")};
  border-radius: 10px;
  background-color: ${({ diff }) => (diff ? "white" : "var(--main-color)")};
  color: ${({ diff }) => (diff ? "var(--main-color)" : "white")};
  cursor: pointer;
`;

export default SubmitButton;
