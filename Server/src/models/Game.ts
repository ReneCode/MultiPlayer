/*

player:
1:red
2:black
3:yellow
4:green


position: start, start+1, ....

red:     1, 2, 3, 4, 5, 6, 7, 8, 9,10
black:  11,12,13,14,15,16,17,18,19,20
yellow: 21,22,23,24,25,26,27,28,29,30
green:  31,32,33,34,35,36,37,38,39,40

target for
red:    101,102,103,104
black:  111,112,113,114
yellow: 121,122,123,124
green:  131,132,133,134

path for
red:    1.........40,101,102,103,104
black:  11..40,1..10,111,112,113,114
yellow: 21..40,1..20,121,122,123,124
green:  31..40,1..30,131,132,133,134
*/

const MAX_PLAYER_COUNT = 4;
const ONE_PATH_LEN = 10;

export class Token {
  player: number;
  position: number;
}

class Game {
  players: Set<string> = new Set<string>();
  // players: { name: string; nr: number }[];
  currentPlayer: string;
  token: Token[];
  playerPath: Map<number, number[]>;

  init(countPlayer: number) {
    for (let player = 0; player < MAX_PLAYER_COUNT; player++) {
      let positions = Array.from({
        length: MAX_PLAYER_COUNT * ONE_PATH_LEN,
      }).map((v, i) => i);
    }
  }

  addPlayer(playerId: string) {
    if (this.players.has(playerId)) {
      throw new Error("player ${playerId} allready added to game");
    }
    this.players.add(playerId);
  }

  getPlayerIds(): string[] {
    const ids = [];
    this.players.forEach((v) => ids.push(v));
    return ids;
  }
}

export class Move {
  steps: number;
  token: Token;
}

export const calcNewBoard = (tokenList: Token[], move: Move) => {
  if (
    !tokenList.find((t) => {
      return (
        t.player === move.token.player && t.position === move.token.position
      );
    })
  ) {
    return null;
  }

  let position = move.token.position;
  let steps = move.steps;
  while (steps > 0) {
    steps--;
    position = nextPosition(position, move.token.player);
  }
  if (!position) {
    return null;
  }
};

const nextPosition = (position: number, player: number) => {
  if (!position) {
    return null;
  }
  // if (position <= 1 && position <=)
  // if (isEndPosition(position, player))
};

const isEndPosition = (position: number, player: number) => {};

export default Game;
