import express, { Response, Request } from "express";
import * as httpStatus from "http-status-codes";

// https://auth0.com/blog/use-typescript-to-create-a-secure-api-with-nodejs-and-express-creating-endpoints/
export const gamesRouter = express.Router();

import { gameServer } from "../models/GameServer";

gamesRouter.post("/", function (req: Request, res: Response) {
  const name = req.query.name as string;
  if (!name) {
    // throw { status: 503, message: "bad name" };
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

gamesRouter.get("/", (req, res) => {
  const allGames = gameServer.getAvailiableGames();
  res.json({ names: allGames });
});
