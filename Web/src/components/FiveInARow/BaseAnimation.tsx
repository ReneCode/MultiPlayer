import styled from "styled-components";

type BaseAnimationProps = {
  duration: string;
  timingFunction: string;
  delay: string;
  iterationCount: string;
  direction: string;
  fillMode: string;
  playState: string;
  display: string;
};

export const BaseAnimation = styled.div`
  animation-duration: ${(props: BaseAnimationProps) => props.duration};
  animation-timing-function: ${(props: BaseAnimationProps) =>
    props.timingFunction};
  animation-delay: ${(props: BaseAnimationProps) => props.delay};
  animation-iteration-count: ${(props: BaseAnimationProps) =>
    props.iterationCount};
  animation-direction: ${(props: BaseAnimationProps) => props.direction};
  animation-fill-mode: ${(props: BaseAnimationProps) => props.fillMode};
  animation-play-state: ${(props: BaseAnimationProps) => props.playState};
  display: ${(props: BaseAnimationProps) => props.display};
`;
BaseAnimation.defaultProps = {
  duration: "1s",
  timingFunction: "ease",
  delay: "0s",
  iterationCount: "1",
  direction: "normal",
  fillMode: "both",
  playState: "running",
  display: "block",
};
export default BaseAnimation;
