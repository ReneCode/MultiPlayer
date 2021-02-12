import React, { useMemo, useState } from "react";
import { DtoGameSet } from "./DtoGameSet";

import Card from "./Card";
import { Button } from "../style";
import Dialog from "./Dialog";
import "./Board.scss";

import { Sound } from "../../Sound";

type Props = {
  game: DtoGameSet;
  sendMessage: (message: any) => void;
};
const createSound = () => {
  return new Sound();
};
const Board: React.FC<Props> = ({ game, sendMessage }) => {
  const [cards, setCards] = useState([] as number[]);
  const sound = useMemo(createSound, []);

  const onClickCard = (index: number) => {
    // toggle card
    // if three cards are picked than send them to the server
    let h = cards;
    const addCard = !cards.includes(index);
    playSound(addCard);
    if (addCard) {
      h = cards.concat(index);
    } else {
      h = cards.filter((c) => c !== index);
    }
    if (h.length === 3) {
      sendMessage({ cmd: "PICK_TUPLE", cards: h });
      h = [];
    }
    setCards(h);
  };

  const onStart = () => {
    sendMessage({
      cmd: "GAME_START",
    });
  };

  const playSound = (add: boolean) => {
    if (add) {
      sound.play("on");
    } else {
      sound.play("off");
    }
  };

  const getBorderColor = (playerId: string) => {
    const player = game.players.find((p) => p.id === playerId);
    if (player) {
      return player.color;
    }
    return "";
  };

  let component = null;
  if (game.state === "finish") {
    component = (
      <Dialog>
        <h3>Finish</h3>
        <Button onClick={onStart}>Start new Game</Button>
      </Dialog>
    );
  }

  return (
    <div className="board">
      {component}
      {game.board.map((card, index) => {
        let borderColor = "";
        if (
          game.state === "showPickedCards" &&
          game.pickedCards.tuple.includes(index)
        ) {
          borderColor = getBorderColor(game.pickedCards.playerId);
        }
        return (
          <Card
            key={index}
            borderColor={borderColor}
            selected={cards.includes(index)}
            card={card}
            onClick={() => onClickCard(index)}
          ></Card>
        );
      })}
    </div>
  );
};

export default Board;
