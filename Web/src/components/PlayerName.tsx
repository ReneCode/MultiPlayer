import React from "react";
import { Player } from "../model/Player";

import styled from "styled-components";

const PlayerNameContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const Color = styled.div`
  width: 1rem;
  height: 1rem;
  background-color: ${(props) => props.color};
  border: 0.1rem solid gray;
  border-radius: 50px;
  margin: 5px;
`;

type Props = {
  player: Player;
  withColor?: boolean;
};

const PlayerName: React.FC<Props> = ({ player }) => {
  return (
    <PlayerNameContainer>
      <Color color={player.color} />
      <span>{player.name}</span>
    </PlayerNameContainer>
  );
};

export default PlayerName;
