import React from "react";

import styled from "styled-components";

const FinishContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: fixed;
  top: 120px;
  left: 50%;
  background-color: #ddd;
  opacity: 0.98;
  border: 2px solid #222;

  padding: 15px 30px;
  z-index: 1;
`;

type Props = {
  children: React.ReactNode;
};
const Dialog: React.FC<Props> = ({ children }) => {
  return <FinishContainer>{children}</FinishContainer>;
};

export default Dialog;
