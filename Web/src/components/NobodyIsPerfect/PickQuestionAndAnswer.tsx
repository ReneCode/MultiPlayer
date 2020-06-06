import React, { useState } from "react";

import InputText from "./InputText";
import { Button, GroupContainer } from "../style";

type Props = {
  onSet: (param: { question: string; answer: string }) => void;
};
const PickQuestionAndAnswer: React.FC<Props> = ({ onSet }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleClickFinish = () => {
    if (question && answer) {
      onSet({ question, answer });
    }
  };

  return (
    <GroupContainer>
      <InputText label="Question" onChangeText={(text) => setQuestion(text)} />
      <InputText label="Answer" onChangeText={(text) => setAnswer(text)} />
      <Button onClick={handleClickFinish}>OK</Button>
    </GroupContainer>
  );
};

export default PickQuestionAndAnswer;
