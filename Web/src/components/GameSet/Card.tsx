import React from "react";
import { DtoGameSet, GameSetCard } from "./DtoGameSet";

import styled from "styled-components";
import Picture from "./Picture";

// #f9f9f9;

type CellProps = {
  selected: boolean;
};
const CardContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  margin: 3px;
  background-color: ${(props: CellProps) =>
    props.selected ? "#ddd" : "#f9f9f9"};
  height: 150px;
  width: 220px;
  cursor: pointer;
  text-align: center;
  border: 1px solid #aaa;
  border-radius: 15px;
  box-shadow: 2px 2px 2px #ddd;
  :hover {
    background-color: #ddd;
    border-color: #444;
    box-shadow: 2px 4px 4px #ccc;
  }
`;

type Props = {
  card: GameSetCard;
  selected: boolean;
  onClick: () => void;
};

const Card: React.FC<Props> = ({ card, selected, onClick }) => {
  const { color } = mapCardProps(card);
  const pics = new Array(card.count).fill(1);
  return (
    <CardContainer selected={selected} onClick={onClick}>
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
    </CardContainer>
  );
};

const mapCardProps = (card: GameSetCard) => {
  const props = { color: "white" };
  switch (card.color) {
    case 1:
      props.color = "red";
      break;
    case 2:
      props.color = "green";
      break;
    case 3:
      props.color = "blue";
      break;
  }

  return props;
};

export default Card;
