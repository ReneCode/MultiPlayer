import React, { useState, useEffect } from "react";
import GameNameList from "./GameNameList";
import { useHistory } from "react-router";

const API_SERVER = process.env.REACT_APP_API_SERVER;
if (!API_SERVER) {
  throw new Error(`REACT_APP_API_SERVER not set`);
}

const Home = () => {
  const [gameNames, setGameNames] = useState([] as string[]);
  const history = useHistory();

  useEffect(() => {
    const getGames = async () => {
      try {
        const url = `${API_SERVER}/games`;
        const res = await fetch(url);
        const json = await res.json();
        const names = json.names;
        setGameNames(names);
      } catch (err) {
        setGameNames([]);
      }
    };
    getGames();
  }, []);

  const handleCreateGame = async (name: string) => {
    try {
      const params = new URLSearchParams({ name: name });
      const url = `${API_SERVER}/games?${params}`;
      const options = {
        method: "POST",
      };
      const res = await fetch(url, options);
      const json = await res.json();
      if (json.name === name && json.id) {
        history.push(`/g/${json.id}`);
      }
    } catch (err) {}
  };

  return (
    <GameNameList
      gameList={gameNames}
      onClick={handleCreateGame}
    ></GameNameList>
  );
};

export default Home;
