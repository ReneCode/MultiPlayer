import React, { useEffect, useMemo, useState } from "react";
import { io, Socket } from "socket.io-client";
import styled from "styled-components";

import { useParams, useHistory } from "react-router";
import TicTacToe from "./TicTacToe/TicTacToe";
import { Player } from "../model/Player";
import FiveInARow from "./FiveInARow/FiveInARow";
import NobodyIsPerfect from "./NobodyIsPerfect/NobodyIsPerfect";
import GameSet from "./GameSet/GameSet";

const WS_SERVER = process.env.REACT_APP_WS_SERVER as string;
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

export const SocketContext = React.createContext<Socket>(
  (undefined as unknown) as Socket
);

const App = () => {
  const { id: gameId } = useParams<{ id: string }>();
  const socket = useMemo(() => io(WS_SERVER), []);
  const history = useHistory();
  const [game, setGame] = useState(undefined as any);
  const [playerId, setPlayerId] = useState("");
  const [players, setPlayers] = useState([] as Player[]);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    const handleMessage = (message: any) => {
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
      setMessage(message);
    };

    socket.onAny((data: string) => {
      try {
        const message = JSON.parse(data);
        handleMessage(message);
      } catch (err) {
        console.error(err);
      }
    });

    return () => {
      console.log("disconnect");
      socket.disconnect();
    };
    // eslint-disable-next-line
  }, []);

  const sendMessage = (message: any) => {
    let sendMessage = { ...message };
    if (gameId) {
      sendMessage = { ...sendMessage, gameId: gameId };
    }
    if (playerId) {
      sendMessage = { ...sendMessage, playerId: playerId };
    }
    socket.emit(JSON.stringify(sendMessage));
  };

  const handleReset = () => {
    history.push("/");
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
        <GameSet
          game={game}
          players={players}
          playerId={playerId}
          message={message}
          sendMessage={sendMessage}
        />
      );
      break;
  }

  return (
    <AppContainer>
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
