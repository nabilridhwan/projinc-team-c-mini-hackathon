const { Pool } = require("pg");

const pool = new Pool({
    connectionString: "postgres://postgres:root@localhost:5430/postgres",
});

module.exports = pool;
