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
import FiveInARow from "../FiveInARow/FiveInARow";

const WS_SERVER = process.env.REACT_APP_WS_SERVER;
if (!WS_SERVER) {
  throw new Error(`REACT_APP_WS_SERVER not set`);
}

const App: React.FC = () => {
  const { id } = useParams();
  const history = useHistory();
  const [game, setGame] = useState(undefined as any);
  const [playerId, setPlayerId] = useState("");
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([] as Player[]);
  const [availiableGames, setAvailiableGames] = useState([] as string[]);
  const [ws, setWs] = useState((undefined as unknown) as WebSocket);

  useEffect(() => {
    console.log("routing-id changed:", id);
    // routing with gameId
    setGameId(id);
    if (!id) {
      setGame(undefined);
      setPlayers([]);
    }
  }, [id]);

  const sendMessage = (message: any) => {
    let sendMessage = { ...message };
    if (gameId) {
      sendMessage = { ...sendMessage, gameId: gameId };
    }
    if (playerId) {
      sendMessage = { ...sendMessage, playerId: playerId };
    }

    // console.log("sendMessage:", sendMessage);
    ws.send(JSON.stringify(sendMessage));
  };

  const handleReset = () => {
    history.push("/");
  };

  const handleCreateGame = (name: string) => {
    sendMessage({ cmd: "GAME_CREATE", name: name });
  };

  const handleMessage = (message: any) => {
    console.log("got message:", message);
    switch (message.cmd) {
      case "GAME_UPDATE":
        setPlayers(message.players ? message.players : []);
        setGame(message.game);
        if (!gameId) {
          history.push(`/${message.gameId}`);
        }
        break;

      case "GAME_INVALID":
        if (gameId) {
          setGameId("");
          history.push("/");
        }
        break;

      case "CLIENT_CONNECTED":
        setAvailiableGames(message.availiableGames);
        if (!playerId && message.playerId) {
          setPlayerId(message.playerId);
          if (gameId) {
            sendMessage({
              cmd: "GAME_CONNECT",
              gameId: gameId,
              playerId: message.playerId,
            });
          }
        }
        break;
    }
  };

  let gameComponent = null;
  switch (game?.name) {
    case "TicTacToe":
      gameComponent = (
        <TicTacToe
          game={game}
          players={players}
          playerId={playerId}
          sendMessage={sendMessage}
        ></TicTacToe>
      );
      break;

    case "FiveInARow":
      gameComponent = (
        <FiveInARow
          game={game}
          players={players}
          playerId={playerId}
          sendMessage={sendMessage}
        />
      );
  }

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
