import DtoGameBase from "../../model/DtoGameBase";

interface DtoGameTicTacToe extends DtoGameBase {
  board: number[][];
  wonPlayerId: string;
  currentPlayerId: string;
  state: "started" | "finished" | "idle";
}

export default DtoGameTicTacToe;
