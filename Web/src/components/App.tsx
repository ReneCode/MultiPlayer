import React, { useEffect, useState } from "react";
import styled from "styled-components";

// import "./App.css";
import { useParams, useHistory } from "react-router";
import TicTacToe from "../TicTacToe/TicTacToe";
import WebSocketPingPong from "./WebSocketPingPong";
import { Player } from "../model/Player";
import FiveInARow from "../FiveInARow/FiveInARow";
import NobodyIsPerfect from "./NobodyIsPerfect/NobodyIsPerfect";
import GameSet from "./GameSet/GameSet";
import GameNameList from "./GameNameList";

const WS_SERVER = process.env.REACT_APP_WS_SERVER;
if (!WS_SERVER) {
  throw new Error(`REACT_APP_WS_SERVER not set`);
}

export const AppContainer = styled.div`
  height: 100%;
`;

const HomeButton = styled.div`
  padding: 2px;
  cursor: pointer;
`;

const TopBar = styled.div`
  background-color: #ddd7;
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const GameName = styled.div`
  margin-left: 10px;
`;

const App: React.FC = () => {
  const { id } = useParams();
  const history = useHistory();
  const [game, setGame] = useState(undefined as any);
  const [playerId, setPlayerId] = useState("");
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([] as Player[]);
  const [ws, setWs] = useState((undefined as unknown) as WebSocket);

  useEffect(() => {
    // routing with gameId
    setGameId(id);
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

  const handleMessage = (message: any) => {
    console.log("got message:", message);
    switch (message.cmd) {
      case "GAME_UPDATE":
        setPlayers(message.players ? message.players : []);
        setGame(message.game);
        if (!gameId) {
          history.push(`/g/${message.gameId}`);
        }
        break;

      case "GAME_INVALID":
        if (gameId) {
          setGameId("");
          history.push("/");
        }
        break;

      case "CLIENT_CONNECTED":
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
      break;

    case "NobodyIsPerfect":
      gameComponent = (
        <NobodyIsPerfect
          game={game}
          playerId={playerId}
          sendMessage={sendMessage}
        />
      );
      break;

    case "Set":
      gameComponent = (
        <GameSet game={game} playerId={playerId} sendMessage={sendMessage} />
      );
      break;
  }

  return (
    <AppContainer>
      <WebSocketPingPong
        onMessage={handleMessage}
        onConnectWebSocket={(ws) => setWs(ws)}
      />
      <TopBar>
        <HomeButton onClick={handleReset}>
          <img src="/home.svg" alt="home" width="28" height="28" />
        </HomeButton>
        <GameName>{game?.name}</GameName>
      </TopBar>
      {gameComponent}
    </AppContainer>
  );
};

export default App;
