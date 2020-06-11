import React from "react";
import styled, { keyframes } from "styled-components";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const resize = keyframes`
  0% {
    transform: scale(1);
  }
  30% {
    transform: scale(1.6);
  }
  60% {
    transform: scale(1);
  }
`;

type DotProps = {
  delay: string;
  color?: string;
};
const Dot = styled.div`
  margin: 1px;
  width: 4px;
  height: 4px;
  border-radius: 4px;
  border: 1px solid #222;
  background-color: ${(props) => (props.color ? props.color : "#222")};
  animation: ${resize} 2s infinite;
  animation-delay: ${(props: DotProps) => props.delay};
`;

type WaitingProps = {
  color?: string;
};
const Waiting: React.FC<WaitingProps> = ({ color }) => {
  return (
    <Container>
      <Dot color={color} delay="0s"></Dot>
      <Dot color={color} delay=".5s"></Dot>
      <Dot color={color} delay="1s"></Dot>
      <Dot color={color} delay="1.5s"></Dot>
    </Container>
  );
};

export default Waiting;
