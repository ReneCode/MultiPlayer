import DtoGameBase from "./DtoGameBase";

interface DtoGameFiveInARow extends DtoGameBase {
  board: any[];
  wonPlayerId: string;
  currentPlayerId: string;
  state: "started" | "finished" | "idle";
}

export default DtoGameFiveInARow;
