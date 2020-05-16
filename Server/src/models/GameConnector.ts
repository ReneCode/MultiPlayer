const WS_OPEN = 1;

class GameConnector {
  constructor(private wss: any) {}

  // public updateAllPlayer = (message: {}) => {
  //   console.log("--- update all Player ----");

  //   const clients = this.getAllClients();
  //   const playerIds = clients.map((client) => client.playerId);

  //   const msg = JSON.stringify({
  //     cmd: "updateGame",
  //     players: playerIds,
  //     gameId: this.gameId,
  //     ...message,
  //   });
  //   clients.forEach((client) => {
  //     if (client.readyState === WS_OPEN) {
  //       client.send(msg);
  //     }
  //   });
  // };

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

  private getAllClients() {
    const clients = [];
    this.wss.clients.forEach((client) => {
      if (client.readyState === WS_OPEN) {
        clients.push(client);
      }
    });
    return clients;
  }
}

export default GameConnector;
