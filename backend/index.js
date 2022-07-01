const express = require("express");
const { DateTime } = require("luxon");
const cors = require("cors");
const app = express();

const InternalServerError = require("./utils/response/InternalServerError");
const SuccessResponse = require("./utils/response/SuccessResponse");
const NotFound = require("./utils/response/NotFound");
const CONFIG = require("./config");

const LogTimeRoutes = require("./routers/LogTimeRoutes");

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

app.use("/api", LogTimeRoutes);

// 404 Route
app.get("*", (req, res, next) => {
    return next(new NotFound("Endpoint not found"));
});

app.use((error, req, res, next) => {
    if (error) {
        return res.status(error.status).json(error);
    }

    return res.status(500).send(new InternalServerError());
});

app.listen(PORT, () => console.log("Backend started at port " + PORT));
