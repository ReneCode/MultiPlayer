import DtoGameBase from "../../model/DtoGameBase";

import { DtoPlayer } from "../../model/DtoPlayer";

export type GameSetCard = {
  shape: number;
  color: number;
  count: number;
  fill: number;
};

export interface DtoGameSet extends DtoGameBase {
  state: any;
  remainingCards: number;
  board: GameSetCard[];
  pickedTuple: number[];
  players: DtoPlayer[];
}
