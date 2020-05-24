import React from "react";
import { GameName, GameNameContainer, GameListHeader } from "./style";

type Props = {
  gameList: string[];
  onClick: (name: string) => void;
};
const GameNameList: React.FC<Props> = ({ gameList, onClick }) => {
  if (!gameList) {
    return null;
  }
  return (
    <GameNameContainer>
      <GameListHeader>Availiable Games</GameListHeader>
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
