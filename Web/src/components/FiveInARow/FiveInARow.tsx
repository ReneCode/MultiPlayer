import React from "react";
import styled, { keyframes } from "styled-components";
import DtoGameFiveInARow from "./DtoGameFiveInARow";
import { Player } from "../../model/Player";
import PlayerList from "../PlayerList";

import { GameContainer, LeftSide } from "../styledComponents";
import { Button } from "../style";
// import { BaseAnimation } from "./BaseAnimation";

import "./FiveInARow.scss";

// const FadeOutAnimation = keyframes`
//  from {opacity:0;}
//  to {opacity:1;}
// `;

const RightSide = styled.div`
  margin-top: 10px;
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
  lastremove: boolean;
  won: boolean;
  removedcolor: string;
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
    props.won
      ? "won 1.2s infinite"
      : props.lastmove
      ? "lastmove 2s 3"
      : props.lastremove
      ? "lastremove 2s 3"
      : ""};
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

  if (!game.board) {
    return null;
  }

  let actionComponent = null;
  switch (game.state) {
    case "finished":
      actionComponent = <Button onClick={handleStart}>play once more</Button>;
      break;
    case "idle":
      if (players.length > 1) {
        actionComponent = <Button onClick={handleStart}>Start</Button>;
      } else {
        actionComponent = <h4>waiting for 2 or more players</h4>;
      }
      break;
  }

  return (
    <GameContainer>
      <LeftSide>
        <PlayerList
          players={players}
          myPlayerId={playerId}
          currentTurnPlayerId={game.currentPlayerId}
          showScore={true}
        />
        {actionComponent}
      </LeftSide>
      <RightSide>
        <Board>
          {game.board.map((col, iCol: number) => {
            return (
              <div key={iCol}>
                {col.map((val, iRow: number) => {
                  const lastMove =
                    game.lastMovedCell &&
                    iRow === game.lastMovedCell.row &&
                    iCol === game.lastMovedCell.col;
                  const lastRemove =
                    game.lastRemovedCell &&
                    iRow === game.lastRemovedCell.row &&
                    iCol === game.lastRemovedCell.col;
                  const removeVal = game.lastRemovedCell?.val;
                  return (
                    <Cell
                      lastremove={lastRemove}
                      lastmove={lastMove}
                      won={game.wonCells.includes(`${iCol},${iRow}`)}
                      key={iRow}
                      color={getCellColor(val)}
                      removedcolor={getCellColor(removeVal)}
                      onClick={() => handleCellClick(iCol, iRow)}
                    ></Cell>
                  );
                })}
              </div>
            );
          })}
        </Board>
      </RightSide>
    </GameContainer>
  );
};

export default FiveInARow;
