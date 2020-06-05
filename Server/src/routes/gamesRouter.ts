var express = require("express");
import * as httpStatus from "http-status-codes";

var router = express.Router();

import gameServer from "../models/GameServer";

router.post("/", function (req, res) {
  try {
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
  } catch (err) {
    console.error(err);
  }
});

router.get("/", (req, res) => {
  const allGames = gameServer.getAvailiableGames();
  res.json({ names: allGames });
});

export default router;
