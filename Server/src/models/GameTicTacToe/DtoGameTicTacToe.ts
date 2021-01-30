import DtoGameBase from "../DtoGameBase";

interface DtoGameTicTacToe extends DtoGameBase {
  board: any[];
  wonPlayerId: string;
  currentPlayerId: string;
  state: "idle" | "started" | "finished";
}

export default DtoGameTicTacToe;
