import DtoGameBase from "../model/DtoGameBase";

interface DtoGameFiveInARow extends DtoGameBase {
  board: number[][];
  wonPlayerId: string;
  currentPlayerId: string;
  state: "started" | "finished" | "idle";
}

export default DtoGameFiveInARow;
