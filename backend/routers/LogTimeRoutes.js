const express = require("express");
const LogTimes = require("../controllers/LogTimes");
const router = express.Router();

router.get("/logtimes", LogTimes.getAllLogTimes);

module.exports = router;
