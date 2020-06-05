import styled from "styled-components";

export const AppContainer = styled.div`
  height: 100%;
  display: flex;
  flex-direction: row;
`;

export const AppLeftSideContainer = styled.div`
  background-color: #f1f1f1;
  padding: 10px;
`;

export const AppGameContainer = styled.div`
  flex-grow: 1;
  padding: 10px;
  background-color: #f7f7f7;
`;

export const SmallText = styled.div`
  font-size: 0.7rem;
`;

export const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

export const Board = styled.div`
  background-color: gray;
  display: flex;
  flex-direction: row;
`;

export const Cell = styled.div`
  margin: 7px;
  background-color: ${(props) => props.color};
  height: 50px;
  width: 50px;
  cursor: pointer;
  text-align: center;
  border-radius: 7px;
`;

export const Button = styled.button`
  font-size: 1.2rem;
  margin: 0.5rem;
`;

// --------------------------------
