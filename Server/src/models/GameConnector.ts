const colors = require("colors");

const WS_OPEN = 1;

class GameConnector {
  constructor(private wss: any) {}

  public sendMessageToClients(message: any, clients: any[]) {
    console.log(colors.messageOut(message.cmd));
    // console.log("sendMessage:", message);

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
