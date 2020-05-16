import React from "react";
import { Board, Cell } from "../style";

type Props = {
  game: any;
  onMove: (move: object) => void;
};
const TicTacToe: React.FC<Props> = ({ game, onMove }) => {
  const handleCellClick = (row: number, col: number) => {
    onMove({ row, col });
  };

  if (!game.board) {
    return null;
  }
  return (
    <div>
      <h4>TIC TAC TOE</h4>
      <Board>
        {game.board.map((row: [], iRow: number) => {
          return (
            <div>
              {row.map((cell, iCol: number) => {
                return (
                  <Cell onClick={() => handleCellClick(iRow, iCol)}>
                    {cell}
                  </Cell>
                );
              })}
            </div>
          );
        })}
      </Board>
    </div>
  );
};

export default TicTacToe;
