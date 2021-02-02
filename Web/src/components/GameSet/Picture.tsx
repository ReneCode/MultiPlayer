import React from "react";

import styled from "styled-components";

const PictureContainer = styled.div`
  margin-left: 12px;
  margin-right: 12px;
`;

const Diamond: React.FC<{ color: string; fill: string }> = ({
  color,
  fill,
}) => {
  return (
    <svg
      width="45"
      height="45"
      fill={fill}
      stroke={color}
      transform="rotate(45)"
    >
      <rect width="45" height="45" strokeWidth="12" />
    </svg>
  );
};
const Ellipse: React.FC<{ color: string; fill: string }> = ({
  color,
  fill,
}) => {
  return (
    <svg width="50" height="120" fill={fill} stroke={color} transform="">
      <ellipse cx="25" cy="60" rx="20" ry="20" strokeWidth="7" />
    </svg>
  );
};

const Path: React.FC<{ color: string; fill: string }> = ({ color, fill }) => {
  return (
    <svg
      width="50"
      height="120"
      viewBox="-10 -10 50 110"
      xmlns="http://www.w3.org/2000/svg"
    >
      <mask id="path-1-inside-1">
        <path
          fillRule="evenodd"
          clipRule="evenodd"
          d="M30 15V72C30 80.2843 23.2843 87 15 87C6.71573 87 0 80.2843 0 72V15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15Z"
        />
      </mask>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M30 15V72C30 80.2843 23.2843 87 15 87C6.71573 87 0 80.2843 0 72V15C0 6.71573 6.71573 0 15 0C23.2843 0 30 6.71573 30 15Z"
        fill={fill}
        stroke={color}
        strokeWidth="6"
      />
      <path
        d="M29 15V72H31V15H29ZM15 88C23.8366 88 31 80.8366 31 72H29C29 79.732 22.732 86 15 86V88ZM-1 72C-1 80.8366 6.16344 88 15 88V86C7.26801 86 1 79.732 1 72H-1ZM1 72V15H-1V72H1ZM15 -1C6.16344 -1 -1 6.16344 -1 15H1C1 7.26801 7.26801 1 15 1V-1ZM31 15C31 6.16344 23.8366 -1 15 -1V1C22.732 1 29 7.26801 29 15H31Z"
        mask="url(#path-1-inside-1)"
      />
    </svg>
  );
};

type Props = {
  fill: number;
  shape: number;
  color: number;
};

const Card: React.FC<Props> = ({ fill, shape, color }) => {
  const { color: sColor, fill: sFill } = mapColorFill(color, fill);
  let picture = null;
  switch (shape) {
    case 1:
      picture = <Diamond color={sColor} fill={sFill} />;
      break;
    case 2:
      picture = <Ellipse color={sColor} fill={sFill} />;
      break;
    case 3:
      picture = <Path color={sColor} fill={sFill} />;
      break;
  }
  return <PictureContainer>{picture}</PictureContainer>;
};

const mapColorFill = (color: number, fill: number) => {
  const result = { color: "", fill: "" };
  switch (color) {
    case 1:
      result.color = "#196200";
      break;
    case 2:
      result.color = "#B80000";
      break;
    case 3:
      result.color = "#0007AA";
      break;
  }
  switch (fill) {
    case 1:
      result.fill = `${result.color}00`;
      break;
    case 2:
      result.fill = `${result.color}44`;
      break;
    case 3:
      result.fill = `${result.color}ff`;
      break;
  }
  return result;
};

export default Card;
