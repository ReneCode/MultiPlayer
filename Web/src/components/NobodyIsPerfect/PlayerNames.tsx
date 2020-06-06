import React from "react";

type Props = {
  names: string[];
};
const PlayerNames: React.FC<Props> = ({ names }) => {
  const text = names.join(",");
  return <div>{text}</div>;
};

export default PlayerNames;
