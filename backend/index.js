const e = require("express");
const express = require("express");
const { DateTime } = require("luxon");
const cors = require("cors");
const app = express();

const YUP_SCHEMAS = require("./schemas/yup");
const LogTime = require("./model/log_time");
const BadRequest = require("./utils/response/BadRequest");
const InternalServerError = require("./utils/response/InternalServerError");
const SuccessResponse = require("./utils/response/SuccessResponse");
const CONFIG = require("./config");
const pool = require("./utils/databaseConfig");
const LogTimes = require("./controllers/LogTimes");

const PORT = CONFIG.PORT;

app.use(cors());

app.get("/", async (req, res) => {
    let pool;
    try {
        pool = await pool.connect();
    } catch (error) {
        console.log(
            "Error connecting to database, did you start the docker instance (or changed the database ports?)"
        );
    } finally {
        res.json(
            new SuccessResponse({
                message: "Hello!",
                time: DateTime.local().toFormat("yyyy-MM-dd HH:mm:ss"),
                database_connection: pool ? "connected" : "not connected",
            })
        );
    }
});

app.get("/api/logtimes", LogTimes.getAllLogTimes);

app.use((error, req, res, next) => {
    if (error) {
        return res.status(error.status).json(error);
    }

    return res.status(500).send(new InternalServerError());
});

app.listen(PORT, () => console.log("Backend started at port " + PORT));
