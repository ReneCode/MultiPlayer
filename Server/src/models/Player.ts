class Player {
  id: string;
  ws: any;
  name: string;
  score: number = 0;

  constructor(ws: any, id: string) {
    this.ws = ws;
    this.id = id;
  }
}

export default Player;
