import React from "react";
import styled from "styled-components";

const GameNameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const GameListHeader = styled.h3`
  border-bottom: 1px solid #33442233;
`;

const GameName = styled.button`
  border: 1px solid #888;
  box-shadow: 4px 4px 4px #00000055;
  background-color: lightgreen;
  width: 300px;
  font-size: 1.4rem;
  margin: 0.7rem;
  cursor: pointer;
`;

type Props = {
  gameList: string[];
  onClick: (name: string) => void;
};
const GameNameList: React.FC<Props> = ({ gameList, onClick }) => {
  if (!gameList) {
    return null;
  }
  return (
    <GameNameContainer data-cy="game-name-container">
      <GameListHeader>Availiable Games:</GameListHeader>
      {gameList.map((name) => {
        return (
          <GameName key={name} onClick={() => onClick(name)}>
            {name}
          </GameName>
        );
      })}
    </GameNameContainer>
  );
};
export default GameNameList;
