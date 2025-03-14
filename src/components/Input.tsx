import React from "react";
import styled from "styled-components";

const InputComponent = ({
  padding,
  width,
  ...attributes
}: React.InputHTMLAttributes<HTMLInputElement> & {
  width?: string;
  padding?: string;
}) => {
  return (
    <InputContainer width={width}>
      <Input padding={padding} {...attributes} />
    </InputContainer>
  );
};

const InputContainer = styled.div<{ width?: string }>`
  position: relative;
  width: ${({ width }) => width || "fit-content"};

  &::after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: 0;
    width: 0;
    height: 1px;
    background-color: var(--main-color);
    transition: width 0.3s ease, left 0.3s ease;
  }

  &:focus-within::after {
    width: 100%;
    left: 0;
  }
`;

const Input = styled.input<{ padding?: string }>`
  outline: none;
  padding: ${({ padding }) => padding || "0 20px"};
  width: 100%;
  height: ${({ height }) => (height ? height : "50px")};
  border-bottom: 1px solid var(--main-gray);
  background: transparent;
`;
export default InputComponent;
