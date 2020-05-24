interface DtoGameBase {
  readonly gameId: string;
}

interface DtoGameTicTacToe extends DtoGameBase {
  board: number[][];
  wonPlayerId: string;
  currentPlayerId: string;
  state: "started" | "finished" | "idle";
}

export default DtoGameTicTacToe;
