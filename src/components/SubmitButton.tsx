import React, { ButtonHTMLAttributes } from "react";
import styled from "styled-components";

interface SubmitButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

const SubmitButton: React.FC<SubmitButtonProps> = ({
  children,
  ...attributes
}) => {
  return <Submit {...attributes}>{children}</Submit>;
};

const Submit = styled.button`
  width: 100%;
  height: 50px;
  border: none;
  border-radius: 10px;
  background-color: var(--main-color);
  color: white;
  cursor: pointer;
`;

export default SubmitButton;
