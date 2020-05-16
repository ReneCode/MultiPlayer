import React from "react";
import { Board, Cell, Button, TicTacToeGameContainer } from "../style";
import PlayersTurn from "./PlayersTurn";

type Props = {
  game: any;
  playerId: string;
  onMove: (move: object) => void;
  onRestart: () => void;
};
const TicTacToe: React.FC<Props> = ({ game, playerId, onMove, onRestart }) => {
  const handleCellClick = (row: number, col: number) => {
    onMove({ row, col });
  };

  if (!game.board) {
    return null;
  }

  let component = null;
  if (game.wonPlayerId) {
    component = (
      <React.Fragment>
        <h3>Player {game.wonPlayerId} won!</h3>
        <Button onClick={() => onRestart()}>play once more</Button>
      </React.Fragment>
    );
  } else {
    component = (
      <PlayersTurn currentPlayer={game.currentPlayerId} me={playerId} />
    );
  }

  return (
    <TicTacToeGameContainer>
      <h4>TIC TAC TOE</h4>
      {component}
      <Board>
        {game.board.map((row: [], iRow: number) => {
          return (
            <div key={iRow}>
              {row.map((cell, iCol: number) => {
                return (
                  <Cell key={iCol} onClick={() => handleCellClick(iRow, iCol)}>
                    {cell}
                  </Cell>
                );
              })}
            </div>
          );
        })}
      </Board>
    </TicTacToeGameContainer>
  );
};

export default TicTacToe;
