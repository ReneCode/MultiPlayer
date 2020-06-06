import React, { FocusEvent, useState, useEffect } from "react";

import styled from "styled-components";

const InputContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Label = styled.div`
  font-size: 1.1rem;
  margin-bottom: 0.2rem;
`;

const Text = styled.textarea`
  font-size: 1rem;
  font-family: "arial";
  height: 4rem;
  margin-bottom: 0.8rem;
`;

type Props = {
  label: string;
  text?: string;
  onChangeText?: (text: string) => void;
};
const InputText: React.FC<Props> = ({ label, text, onChangeText }) => {
  const [value, setValue] = useState("");

  useEffect(() => {
    if (text) {
      setValue(text);
    }
  }, [text]);

  const handleOnBlur = (event: FocusEvent<HTMLTextAreaElement>) => {
    if (onChangeText) {
      onChangeText(value);
    }
  };

  return (
    <InputContainer>
      <Label>{label}</Label>
      <Text
        readOnly={!onChangeText}
        value={value}
        onChange={(ev: any) => setValue(ev.target.value)}
        onBlur={handleOnBlur}
      />
    </InputContainer>
  );
};

export default InputText;
