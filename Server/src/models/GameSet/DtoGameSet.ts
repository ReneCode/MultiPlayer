import DtoGameBase from "../DtoGameBase";
import { DtoPlayer } from "../Player";

export type GameSetCard = {
  shape: number;
  color: number;
  count: number;
  fill: number;
};

export interface DtoGameSet extends DtoGameBase {
  board: GameSetCard[];
  pickedCards: number[];
  players: DtoPlayer[];
}
