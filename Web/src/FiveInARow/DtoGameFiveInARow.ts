import DtoGameBase from "../model/DtoGameBase";

interface DtoGameFiveInARow extends DtoGameBase {
  board: number[][];
  wonPlayerId: string;
  currentPlayerId: string;
  lastMovedCell: { col: number; row: number };
  state: "started" | "finished" | "idle";
}

export default DtoGameFiveInARow;
