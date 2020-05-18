const WS_OPEN = 1;

class GameConnector {
  constructor(private wss: any) {}

  public sendMessageToClients(message: object, clients: any[]) {
    console.log("sendMessageToPlayers:", clients.length, message);

    const messageString = JSON.stringify(message);
    clients.forEach((client) => {
      if (client.readyState === WS_OPEN) {
        client.send(messageString);
      }
    });
  }

  // ---------------------
}

export default GameConnector;
