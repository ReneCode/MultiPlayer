import express, { Request, Response } from "express";
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");
const https = require("https");
const colors = require("colors");
//
import { logger } from "./logger";

colors.setTheme({
  error: ["red"],
});

import { gamesRouter } from "./routes/gamesRouter";
import { versionRouter } from "./routes/versionRouter";

export const app = express();

console.log("create express server");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(cors());

app.use((err, req, res, next) => {
  logger.trackNodeHttpRequest({ request: req, response: res });
  next();
});
app.use(morgan("tiny", {}));

app.use("/games", gamesRouter);
app.use("/version", versionRouter);

app.get("/", (req: any, res: any) => {
  res.send("hi, multi-player server is running.");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  console.error(colors.error(err));
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// module.exports = app;
