import React, { useEffect, useRef, useState } from "react";
import "./App.css";
import { useParams, useHistory } from "react-router";

const WS_URL = "ws://localhost:5001";

const App: React.FC = () => {
  const { id } = useParams();
  const history = useHistory();
  const [playerId, setPlayerId] = useState("");
  const [gameId, setGameId] = useState("");
  const [players, setPlayers] = useState([] as string[]);
  const ws = useRef((null as unknown) as WebSocket);

  useEffect(() => {
    if (id) {
      // routing with gameId
      setGameId(id);
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
      const msg = JSON.parse(data);
      console.log("Message:", msg);
      switch (msg.cmd) {
        case "updateGame":
          updateGame(msg);
          if (!gameId) {
            history.push(`/${msg.gameId}`);
          }
          break;
        case "connected":
          if (!playerId && msg.playerId) {
            setPlayerId(msg.playerId);

            if (gameId) {
              sendMessage({
                cmd: "connectGame",
                gameId: gameId,
                playerId: msg.playerId,
              });
            }
          }
          break;
      }
    };
  }, [gameId, history, playerId]);

  const handleCreateGame = () => {
    if (!gameId) {
      sendMessage({ cmd: "createGame", playerId: playerId });
    }
  };

  const updateGame = (msg: any) => {
    setPlayers(msg.players);
  };

  const sendMessage = (msg: object) => {
    ws.current.send(JSON.stringify(msg));
  };

  console.log("render gameId:", gameId);
  return (
    <div className="App Main">
      <div>Game: {gameId}</div>
      <div>Player: {playerId}</div>
      <h3>Player</h3>
      <ul>
        {players.map((player) => {
          return <li key={player}>{player}</li>;
        })}
      </ul>
      {!gameId && (
        <button className="btn" onClick={handleCreateGame}>
          Create Game
        </button>
      )}
    </div>
  );
};

export default App;
