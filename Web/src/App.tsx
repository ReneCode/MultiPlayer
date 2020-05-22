import React, { useEffect, useRef, useState, useCallback } from "react";
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
import PlayerList from "./PlayerList";
import WebSocketPingPong from "./components/WebSocketPingPong";

const WS_SERVER = process.env.REACT_APP_WS_SERVER;
if (!WS_SERVER) {
  throw new Error(`REACT_APP_WS_SERVER not set`);
}

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
    console.log("create WebSocket");
    if (!ws.current) {
      // ws.current = new WebSocket(WS_SERVER);
      // ws.current.onopen = () => {
      // console.log("connected");
      // };
    }

    return () => {
      ws.current.close();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendMessage = useCallback(
    (message: any) => {
      let sendMessage = { ...message };
      if (!message.playerId) {
        sendMessage = { ...message, playerId: playerId };
      }
      console.log("sendMessage:", sendMessage);
      ws.current.send(JSON.stringify(sendMessage));
    },
    [playerId]
  );

  useEffect(() => {
    if (!ws.current) {
      return;
    }

    ws.current.onmessage = ({ data }) => {
      const message = JSON.parse(data);
      console.log("got message:", message);
      switch (message.cmd) {
        case "game_update":
          handleUpdateGame(message);
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
  }, [gameId, history, playerId, sendMessage]);

  const handleReset = () => {
    history.push("/");
  };

  const handleUpdateGame = (msg: any) => {
    setPlayers(msg.players ? msg.players : []);
    setGame(msg.game);
  };

  const handleCreateGame = (name: string) => {
    sendMessage({ cmd: "game_create", name: name });
  };

  const handleMessage = (message: any) => {
    console.log("got message in App.tsx", message);
  };

  const gameComponent = game ? (
    <TicTacToe
      game={game}
      playerId={playerId}
      sendMessage={sendMessage}
    ></TicTacToe>
  ) : null;

  return (
    <AppContainer>
      <AppLeftSideContainer>
        <WebSocketPingPong onMessage={handleMessage} />
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
        <PlayerList players={players} />
      </AppLeftSideContainer>
      <AppGameContainer>{gameComponent}</AppGameContainer>
    </AppContainer>
  );
};

export default App;
