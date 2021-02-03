import React, { useState } from "react";
import { DtoGameSet } from "./DtoGameSet";

import styled from "styled-components";
import Card from "./Card";
import { Button } from "../style";
import Dialog from "./Dialog";

const CardContainer = styled.div`
  margin-top: 10px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
`;

type Props = {
  game: DtoGameSet;
  sendMessage: (message: any) => void;
};

const Board: React.FC<Props> = ({ game, sendMessage }) => {
  const [cards, setCards] = useState([] as number[]);

  const onClickCard = (index: number) => {
    // toggle card
    // if three cards are picked than send them to the server
    let h = cards;
    if (cards.includes(index)) {
      h = cards.filter((c) => c !== index);
    } else {
      h = cards.concat(index);
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
    <CardContainer>
      {component}
      {game.board.map((card, index) => {
        let showFrame = false;
        if (
          game.state === "showPickedCards" &&
          game.pickedTuple.includes(index)
        ) {
          showFrame = true;
        }
        return (
          <Card
            key={index}
            showFrame={showFrame}
            selected={cards.includes(index)}
            card={card}
            onClick={() => onClickCard(index)}
          ></Card>
        );
      })}
    </CardContainer>
  );
};

export default Board;
