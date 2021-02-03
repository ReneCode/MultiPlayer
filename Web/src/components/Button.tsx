import React from "react";
import styled from "styled-components";

export const ButtonContainer = styled.button`
  font-size: 1.2rem;
  margin: 0.5rem;
`;

type Props = {
  children: React.ReactNode;
  onClick: () => void;
};
const Button: React.FC<Props> = ({ children, onClick }) => {
  return <ButtonContainer onClick={onClick}></ButtonContainer>;
};

export default Button;
