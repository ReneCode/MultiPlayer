var express = require("express");
var router = express.Router();

router.post("/start", function (req, res) {
  res.send("abc");
});

export default router;
