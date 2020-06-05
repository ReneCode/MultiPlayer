import React from "react";
import styled from "styled-components";
import DtoGameFiveInARow from "./DtoGameFiveInARow";
import { Player } from "../model/Player";
import PlayersTurn from "../components/PlayersTurn";

const GameContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Board = styled.div`
  background-color: gray;
  display: flex;
  flex-direction: row;
  padding: 8px;
  border-radius: 5px;
`;

type CellProps = {
  lastmove: boolean;
  won: boolean;
  color: string;
};
const Cell = styled.div`
  margin: 3px;
  background-color: ${(props: CellProps) => props.color};
  height: 30px;
  width: 30px;
  cursor: pointer;
  text-align: center;
  border-radius: 15px;
  animation: ${(props) =>
    props.won ? "won 1.2s infinite" : props.lastmove ? "lastmove 2s 3" : ""};
`;

const Button = styled.button`
  font-size: 1.2rem;
  margin: 0.5rem;
`;

type Props = {
  game: DtoGameFiveInARow;
  players: Player[];
  playerId: string;
  sendMessage: (message: any) => void;
};
const FiveInARow: React.FC<Props> = ({
  game,
  players,
  playerId,
  sendMessage,
}) => {
  const handleCellClick = (col: number, row: number) => {
    const move = { row, col };
    sendMessage({
      cmd: "GAME_MOVE",
      move: move,
    });
  };

  const handleStart = () => {
    sendMessage({
      cmd: "GAME_START",
    });
  };

  const getCellColor = (val: number): string => {
    const playerIdx = val - 1;
    switch (val) {
      case 0:
        return "#999";
      default:
        if (players.length > playerIdx) {
          return players[playerIdx].color;
        } else {
          return "drakgray";
        }
    }
  };

  const getCurrentPlayer = () => {
    return players.find((player) => player.id === game.currentPlayerId);
  };

  if (!game.board) {
    return null;
  }

  let component = null;
  switch (game.state) {
    case "finished":
      let textComponent = null;
      if (game.wonPlayerId) {
        textComponent = <h3>Player {game.wonPlayerId} won!</h3>;
      } else {
        textComponent = <h3>drawn</h3>;
      }
      component = (
        <React.Fragment>
          {textComponent}
          <Button onClick={handleStart}>play once more</Button>
        </React.Fragment>
      );
      break;
    case "idle":
      if (players.length >= 1) {
        component = <Button onClick={handleStart}>Start</Button>;
      }
      break;

    case "started":
      const currentPlayerName = getCurrentPlayer()?.name;
      component = (
        <React.Fragment>
          <Button onClick={handleStart}>Restart</Button>
          <PlayersTurn
            playerName={currentPlayerName}
            myself={game.currentPlayerId === playerId}
          />
        </React.Fragment>
      );
      break;
  }

  return (
    <GameContainer>
      <h4>{game.name}</h4>
      {component}
      <Board>
        {game.board.map((col, iCol: number) => {
          return (
            <div key={iCol}>
              {col.map((val, iRow: number) => {
                const lastMove =
                  game.lastMovedCell &&
                  iRow === game.lastMovedCell.row &&
                  iCol === game.lastMovedCell.col;
                return (
                  <Cell
                    lastmove={lastMove}
                    won={game.wonCells.includes(`${iCol},${iRow}`)}
                    key={iRow}
                    color={getCellColor(val)}
                    onClick={() => handleCellClick(iCol, iRow)}
                  ></Cell>
                );
              })}
            </div>
          );
        })}
      </Board>
    </GameContainer>
  );
};

export default FiveInARow;