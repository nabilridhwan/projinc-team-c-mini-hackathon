const dotenv = require("dotenv");
dotenv.config();

const CONFIG = {
    PORT: process.env.PORT || 3030,
    DATABASE_URL: process.env.DATABASE_URL,
};

module.exports = CONFIG;
