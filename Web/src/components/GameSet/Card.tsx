import React from "react";
import classNames from "classnames";

import "./Card.scss";
import { GameSetCard } from "./DtoGameSet";

import Picture from "./Picture";

type Props = {
  card: GameSetCard;
  selected: boolean;
  borderColor: string;
  onClick: () => void;
};

const Card: React.FC<Props> = ({ card, selected, borderColor, onClick }) => {
  if (!card) {
    return <div className="card"></div>;
  }
  const pics = new Array(card.count).fill(1);
  const style = {
    borderColor: borderColor,
  };
  return (
    <div
      style={style}
      className={classNames("card", {
        selected: selected,
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
