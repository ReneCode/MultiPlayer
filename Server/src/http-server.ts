import express = require("express");
const cors = require("cors");
const path = require("path");
const bodyParser = require("body-parser");
const morgan = require("morgan");
const http = require("http");
const https = require("https");

import ludoRouter from "./routes/ludo";

require("dotenv").config();
const app = express();

// if (applicationInsightsLogger.init()) {
//   applicationInsightsLogger.trackHttpRequests(app);
// }

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

app.use(morgan("tiny", {}));

app.use("/ludo", ludoRouter);

app.get("/", (req: any, res: any) => {
  res.send("hi, multi-player server is running");
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

// initData();

// const port = process.env.PORT || 8080;
// const httpServer = http.createServer(app);
// httpServer.listen(port, () => {
//   console.log("app listening on port:", port);
// });

// const wsServer = new WebSocketServer();
// wsServer.listen(httpServer);

module.exports = app;
