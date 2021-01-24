import express, { Response, Request } from "express";
import * as httpStatus from "http-status-codes";

const config = require("../config.json");

// https://auth0.com/blog/use-typescript-to-create-a-secure-api-with-nodejs-and-express-creating-endpoints/
export const versionRouter = express.Router();

versionRouter.get("/", (req: Request, res: Response) => {
  console.log(config);
  res.json(config);
  // res.send(`version: ${config.version}  env: ${process.env.NODE_ENV}`);
});
