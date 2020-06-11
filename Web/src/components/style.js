import styled from "styled-components";

export const SmallText = styled.div`
  font-size: 0.7rem;
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

export const GroupContainer = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 600px;

  background-color: #00000033;
  border: 1px solid #00000022;
  border-radius: 5px;
  padding: 10px;
`;
// --------------------------------
