import express, { Response, Request } from "express";

// https://stackoverflow.com/questions/40471152/tell-typescript-to-compile-json-files
import config from "../config.json";

// https://auth0.com/blog/use-typescript-to-create-a-secure-api-with-nodejs-and-express-creating-endpoints/
export const versionRouter = express.Router();

versionRouter.get("/", (req: Request, res: Response) => {
  console.log(config);
  res.send(config.version);
});
