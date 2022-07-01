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

app.get("/api/logtimes", async (req, res, next) => {
    const { start_date, end_date } = req.query;

    // Check if there is start_date and end_date
    if (start_date && end_date) {
        // Validate the dates
        const isStartDateValid = DateTime.fromISO(start_date).isValid;
        const isEndDateValid = DateTime.fromISO(end_date).isValid;

        if (!isStartDateValid || !isEndDateValid) {
            return next(new BadRequest("Invalid date"));
        }

        const data = await LogTime.getLogTimesBetweenDates(
            start_date,
            end_date
        );
        return res.json(new SuccessResponse(data));
    }

    const data = await LogTime.getAllLogTimes();
    return res.json(new SuccessResponse(data));

    // Query against the database
});

app.use((error, req, res, next) => {
    if (error) {
        return res.status(error.status).json(error);
    }

    return res.status(500).send(new InternalServerError());
});

app.listen(PORT, () => console.log("Backend started at port " + PORT));
