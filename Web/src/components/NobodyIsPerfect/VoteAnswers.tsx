import React from "react";
import styled from "styled-components";

import InputText from "./InputText";
import { GroupContainer, Button } from "../style";

const Container = styled.div`
  display: flex;
  flex-direction: row;
`;

type Props = {
  question: string;
  answers: string[];
  onSet: (vote: number) => void;
};
const VoteAnswers: React.FC<Props> = ({ question, answers, onSet }) => {
  const handleClickAnswer = (idx: number) => {
    onSet(idx);
  };

  return (
    <GroupContainer>
      <InputText label="Question" text={question} />
      {answers.map((answer, idx) => {
        return (
          <Container key={idx}>
            <InputText label={`Answer ${idx}`} text={answer} />
            <Button onClick={() => handleClickAnswer(idx)}>Vote</Button>
          </Container>
        );
      })}
    </GroupContainer>
  );
};

export default VoteAnswers;
