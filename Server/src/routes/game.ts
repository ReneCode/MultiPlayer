var express = require("express");
var router = express.Router();

import gameServer from "../models/GameServer";

router.post("/", function (req, res) {
  console.log("---- game POST ----");
  const gameName = req.body.gameName;
  //  const gameId = gameServer.createGame(gameName);
  const result = {
    gameName,
    gameId: 42,
  };
  res.json(result);
});

export default router;
