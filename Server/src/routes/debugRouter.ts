import express, { Response, Request } from "express";

export const debugRouter = express.Router();

debugRouter.get("/", (req: Request, res: Response) => {
  const payload = {
    origin: process.env.CORS_ORIGIN,
  };
  res.json(payload);
});
