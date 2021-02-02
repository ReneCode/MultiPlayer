import React, { useState } from "react";
import { DtoGameSet, GameSetCard } from "./DtoGameSet";

import styled from "styled-components";
import Card from "./Card";

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
    let h = cards;
    if (cards.includes(index)) {
      h = cards.filter((c) => c != index);
    } else {
      h = cards.concat(index);
    }
    console.log(h);
    if (h.length === 3) {
      sendMessage({ cmd: "PICK_TUPLE", cards: h });
      h = [];

      // setTimeout(() => {
      //   console.log(">>> add cards");
      //   sendMessage({ cmd: "ADD_CARDS" });
      //   setCards([]);
      // }, 2000);
    }
    setCards(h);
  };

  return (
    <CardContainer>
      {game.board.map((card, index) => {
        return (
          <Card
            key={index}
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
