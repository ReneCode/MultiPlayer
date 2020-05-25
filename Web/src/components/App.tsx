import React, { useEffect, useState } from "react";
import "./App.css";
import { useParams, useHistory } from "react-router";
import TicTacToe from "../TicTacToe/TicTacToe";
import {
  Button,
  AppContainer,
  AppLeftSideContainer,
  AppGameContainer,
  SmallText,
} from "./style";
import GameNameList from "./GameNameList";
import PlayerList from "./PlayerList";
import WebSocketPingPong from "./WebSocketPingPong";
import { Player } from "../model/Player";

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
  const [players, setPlayers] = useState([] as Player[]);
  const [availiableGames, setAvailiableGames] = useState([] as string[]);
  const [ws, setWs] = useState((undefined as unknown) as WebSocket);

  useEffect(() => {
    //    console.log("routing-id changed");
    // routing with gameId
    setGameId(id);
    if (!id) {
      setGame(null);
      setPlayers([]);
    }
  }, [id]);

  const sendMessage = (message: any) => {
    let sendMessage = { ...message };
    if (!message.playerId) {
      sendMessage = { ...message, playerId: playerId };
    }
    //    console.log("sendMessage:", sendMessage);
    ws.send(JSON.stringify(sendMessage));
  };

  const handleReset = () => {
    history.push("/");
  };

  const handleCreateGame = (name: string) => {
    sendMessage({ cmd: "game_create", name: name });
  };

  const handleMessage = (message: any) => {
    //    console.log("got message:", message);
    switch (message.cmd) {
      case "game_update":
        setPlayers(message.players ? message.players : []);
        setGame(message.game);
        if (!gameId) {
          history.push(`/${message.gameId}`);
        }
        break;

      case "game_invalid":
        if (gameId) {
          setGameId("");
          history.push("/");
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

  const gameComponent = game ? (
    <TicTacToe
      game={game}
      players={players}
      playerId={playerId}
      sendMessage={sendMessage}
    ></TicTacToe>
  ) : null;

  return (
    <AppContainer>
      <AppLeftSideContainer>
        <WebSocketPingPong
          onMessage={handleMessage}
          onConnectWebSocket={(ws) => setWs(ws)}
        />
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
        <PlayerList players={players} myPlayerId={playerId} />
      </AppLeftSideContainer>
      <AppGameContainer>{gameComponent}</AppGameContainer>
    </AppContainer>
  );
};

export default App;
