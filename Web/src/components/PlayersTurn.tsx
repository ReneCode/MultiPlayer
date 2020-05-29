import React from "react";

type Props = {
  playerName?: string;
  myself: boolean;
};
const PlayersTurn: React.FC<Props> = ({ playerName, myself }) => {
  let text: string;
  if (!playerName) {
    return null;
  }

  if (myself) {
    text = "It's your turn";
  } else {
    text = `It's ${playerName}'s turn`;
  }

  return <h4>{text}</h4>;
};

export default PlayersTurn;
