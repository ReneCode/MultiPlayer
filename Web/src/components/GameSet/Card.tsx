import React from "react";
import classNames from "classnames";

import "./Card.scss";
import { GameSetCard } from "./DtoGameSet";

import Picture from "./Picture";

type Props = {
  card: GameSetCard;
  selected: boolean;
  showFrame: boolean;
  onClick: () => void;
};

const Card: React.FC<Props> = ({ card, selected, showFrame, onClick }) => {
  if (!card) {
    return <div className="card"></div>;
  }
  const pics = new Array(card.count).fill(1);
  return (
    <div
      className={classNames("card", {
        selected: selected,
        frame: showFrame,
      })}
      onClick={onClick}
    >
      {pics.map((p, index) => {
        return (
          <Picture
            key={index}
            shape={card.shape}
            color={card.color}
            fill={card.fill}
          ></Picture>
        );
      })}
    </div>
  );
};

export default Card;
