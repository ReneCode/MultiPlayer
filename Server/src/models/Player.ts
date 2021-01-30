import Randomize from "./Randomize";

export class Player {
  id: string;
  ws: any;
  name: string;
  score: number = 0;
  color: string = "black";

  constructor(ws: any, id: string) {
    this.ws = ws;
    this.id = id;
    this.name = Randomize.generateId(6, "upcase");
    this.score = 0;
  }
}

export interface DtoPlayer {
  id: string;
  name: string;
  score: number;
  color: string;
}
