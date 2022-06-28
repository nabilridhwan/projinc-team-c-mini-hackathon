const axios = require("axios");

export async function getAllLogTimes() {
    return await axios.get("http://localhost:3030/api/logtimes");
}

export async function getLogTimesBetweenDates(start_date, end_date) {
    return await axios.get("http://localhost:3030/api/logtimes", {
        params: { start_date, end_date },
    });
}
