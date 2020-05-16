import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useParams, useHistory } from "react-router";
import TicTacToe from "./TicTacToe/TicTacToe";
import {
  Button,
  AppContainer,
  AppLeftSideContainer,
  AppGameContainer,
  SmallText,
} from "./style";
import GameNameList from "./GameNameList";

const WS_URL = "ws://localhost:5001";

const App: React.FC = () => {
  const { id } = useParams();
  const history = useHistory();
  const [game, setGame] = useState(null as any);
  const [playerId, setPlayerId] = useState("");
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([] as string[]);
  const [availiableGames, setAvailiableGames] = useState([] as string[]);
  const ws = useRef((null as unknown) as WebSocket);

  useEffect(() => {
    console.log("routing-id changed");
    // routing with gameId
    setGameId(id);
    if (!id) {
      setGame(null);
      setPlayers([]);
    }
  }, [id]);

  useEffect(() => {
    if (!ws.current) {
      ws.current = new WebSocket(WS_URL);
      ws.current.onopen = () => {
        console.log("connected");
      };
    }

    return () => {
      ws.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (!ws.current) {
      return;
    }

    ws.current.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      console.log("get message:", message);
      switch (message.cmd) {
        case "game_update":
          updateGame(message);
          if (!gameId) {
            history.push(`/${message.gameId}`);
          }
          break;
        case "client_connected":
          setAvailiableGames(message.availiableGames);
          if (!playerId && message.playerId) {
            setPlayerId(message.playerId);

            if (gameId) {
              sendMessage({
                cmd: "game_connect",
                gameId: gameId,
                playerId: message.playerId,
              });
            }
          }
          break;
      }
    };
  }, [gameId, history, playerId]);

  const handleReset = () => {
    history.push("/");
  };

  const updateGame = (msg: any) => {
    setPlayers(msg.players ? msg.players : []);
    setGame(msg.game);
  };

  const sendMessage = (message: any) => {
    let sendMessage = { ...message };
    if (!message.playerId) {
      sendMessage = { ...message, playerId: playerId };
    }
    console.log("sendMessage:", sendMessage);
    ws.current.send(JSON.stringify(sendMessage));
  };

  const handleCreateGame = (name: string) => {
    sendMessage({ cmd: "game_create", name: name });
  };

  const handleMove = (move: any) => {
    sendMessage({
      cmd: "game_move",
      playerId: playerId,
      gameId: gameId,
      move: move,
    });
  };

  const handleRestart = () => {
    sendMessage({
      cmd: "game_restart",
      gameId: gameId,
    });
  };

  const gameComponent = game ? (
    <TicTacToe
      game={game}
      playerId={playerId}
      onMove={handleMove}
      onRestart={handleRestart}
    ></TicTacToe>
  ) : null;

  return (
    <AppContainer>
      <AppLeftSideContainer>
        <Button onClick={handleReset}>Reset</Button>
        <GameNameList
          gameList={availiableGames}
          onClick={handleCreateGame}
        ></GameNameList>

        <SmallText>
          <div>my GameId: {gameId}</div>
          <div>my PlayerId: {playerId}</div>
        </SmallText>
        <h3>Player List</h3>
        <ul>
          {players.map((player) => {
            return <li key={player}>{player}</li>;
          })}
        </ul>
      </AppLeftSideContainer>
      <AppGameContainer>{gameComponent}</AppGameContainer>
    </AppContainer>
  );
};

export default App;
