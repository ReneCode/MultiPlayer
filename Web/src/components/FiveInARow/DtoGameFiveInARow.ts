import DtoGameBase from "../../model/DtoGameBase";

interface DtoGameFiveInARow extends DtoGameBase {
  board: number[][];
  wonPlayerId: string;
  currentPlayerId: string;
  lastMovedCell: { col: number; row: number };
  lastRemovedCell: { col: number; row: number; val: number };
  state: "started" | "finished" | "idle";
  wonCells: string[];
}

export default DtoGameFiveInARow;
