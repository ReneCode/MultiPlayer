import React from "react";

type Props = {
  currentPlayer: string;
  me: string;
};
const PlayersTurn: React.FC<Props> = ({ currentPlayer, me }) => {
  let text: string;

  if (!currentPlayer) {
    return null;
  }

  if (currentPlayer === me) {
    text = "It's your turn";
  } else {
    text = `It's ${currentPlayer}'s turn`;
  }

  return <h4>{text}</h4>;
};

export default PlayersTurn;
