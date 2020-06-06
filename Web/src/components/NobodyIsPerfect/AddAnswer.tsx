import React, { useState } from "react";

import InputText from "./InputText";
import { Button, GroupContainer } from "../style";

type Props = {
  question: string;
  onSet: (answer: string) => void;
};
const AddAnswer: React.FC<Props> = ({ question, onSet }) => {
  const [answer, setAnswer] = useState("");

  const handleClickFinish = () => {
    if (question && answer) {
      onSet(answer);
    }
  };

  return (
    <GroupContainer>
      <InputText label="Question" text={question} />
      <InputText label="Your answer" onChangeText={(text) => setAnswer(text)} />
      <Button onClick={handleClickFinish}>OK</Button>
    </GroupContainer>
  );
};

export default AddAnswer;
