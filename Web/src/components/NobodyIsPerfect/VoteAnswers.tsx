import React from "react";
import styled from "styled-components";

import InputText from "./InputText";
import { GroupContainer, Button } from "../style";
import PlayerNames from "./PlayerNames";

const Container = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const LeftContainer = styled.div`
display:flex:
flex-direction: column;
flex-grow: 1;
`;

const RightContainer = styled.div`
  flex-grow: 0;
`;

type Props = {
  question: string;
  answers: string[];
  votes: { name: string; vote: number }[];
  onSet: (vote: number) => void;
};
const VoteAnswers: React.FC<Props> = ({ question, answers, votes, onSet }) => {
  const handleClickAnswer = (idx: number) => {
    onSet(idx);
  };

  return (
    <GroupContainer>
      <InputText label="Question" text={question} />
      {answers.map((answer, idx) => {
        return (
          <Container key={idx}>
            <InputText text={answer} />
            <Button onClick={() => handleClickAnswer(idx)}>Vote</Button>
            <RightContainer>
              <PlayerNames
                names={votes
                  .filter((vote) => vote.vote === idx)
                  .map((vote) => vote.name)}
              />
            </RightContainer>
          </Container>
        );
      })}
    </GroupContainer>
  );
};

export default VoteAnswers;
