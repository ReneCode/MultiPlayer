interface DtoGameBase {
  readonly gameId: string;
}

interface DtoGameTicTacToe extends DtoGameBase {
  board: any[];
  wonPlayerId: string;
  currentPlayerId: string;
}

export default DtoGameTicTacToe;
