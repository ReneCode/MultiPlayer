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

// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b
const allowedOrigins = [
  "http://ecad.fun",
  "https://ecad.fun",
  "http://www.ecad.fun",
  "https://www.ecad.fun",
  "http://localhost:3000",
];
app.use(
  cors({
    origin: (origin: string, callback: any) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg = `The CORS policy for this site does not allow access from: ${origin} `;
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
  })
);

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

const port = process.env.PORT || 8080;
const httpServer = http.createServer(app);
httpServer.listen(port, () => {
  console.log("app listening on port:", port);
});

// const wsServer = new WsServer();
// wsServer.listen(httpServer);
