var express = require("express");
import * as httpStatus from "http-status-codes";

var router = express.Router();

import gameServer from "../models/GameServer";

router.post("/", function (req, res, next) {
  console.log("---- game POST ----");
  const name = req.query.name;
  if (!name) {
    res.status(httpStatus.BAD_REQUEST).send();
    return;
  }
  const id = gameServer.createGame(name);
  const result = {
    name,
    id,
  };
  res.json(result);
});

router.get("/", (req, res) => {
  const allGames = gameServer.getAvailiableGames();
  res.json({ names: allGames });
});

export default router;
