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
  border-left-width: 12px;
  border-left-style: solid;
  border-left-color: ${(props) => (props.color ? props.color : "#00000055")};
  border-right: ${(props) =>
    !!(props as any)["data-master"] ? "12px solid gray" : "none"};
`;

type Props = {
  label?: string;
  text?: string;
  color?: string;
  master?: boolean;
  onChangeText?: (text: string) => void;
};
const InputText: React.FC<Props> = ({
  color,
  label,
  text,
  master,
  onChangeText,
}) => {
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
      {label && <Label>{label}</Label>}
      <Text
        readOnly={!onChangeText}
        value={value}
        color={color}
        data-master={master}
        onChange={(ev: any) => setValue(ev.target.value)}
        onBlur={handleOnBlur}
      />
    </InputContainer>
  );
};

export default InputText;
