import React from "react";
import styled from "styled-components";

const InputComponent = ({
  ...attributes
}: React.InputHTMLAttributes<HTMLInputElement>) => {
  return (
    <InputContainer>
      <Input {...attributes} />
    </InputContainer>
  );
};

const InputContainer = styled.div`
  position: relative;
  width: 100%;

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

const Input = styled.input`
  outline: none;
  padding: 0 20px;
  width: 100%;
  height: 50px;
  border-bottom: 1px solid var(--main-gray);
  background: transparent;
`;
export default InputComponent;
