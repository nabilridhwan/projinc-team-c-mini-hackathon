const { Pool } = require("pg");
const CONFIG = require("../config");

const pool = new Pool({
    connectionString: CONFIG.DATABASE_URL,
});

module.exports = pool;
