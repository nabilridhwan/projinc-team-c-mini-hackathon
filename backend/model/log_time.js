const { DateTime } = require("luxon");
const db = require("../utils/databaseConfig");

const LogTime = {
    /**
     * Get all log times
     * @returns {Promise<Array>}
     */
    getAllLogTimes: async () => {
        const query = `
SELECT l.id AS log_time_id, rf.desc_translate as recipe_flow_name, rf.id as recipe_flow_id, rp."name" as recipe_name,
l.recipe_id, l.log_action, l.log_time, l.fr_process_steps AS process_step_id, ps.process_name AS process_step_name
FROM public.log_times l
LEFT JOIN public.recipe_flows rf ON l.fr_process_steps = rf.id
LEFT JOIN public.recipes rp ON l.recipe_id = rp.id
LEFT JOIN public.process_steps ps ON ps.id = l.fr_process_steps
ORDER BY l.log_time ASC
;`;

        const result = await db.query(query);
        return result.rows;
    },

    getLogTimesBetweenDates: async (start_date, end_date) => {
        // Convert the dates into SQL dates
        start_date = DateTime.fromISO(start_date).toSQL();
        end_date = DateTime.fromISO(end_date).toSQL();

        // Query the database
        const query = `SELECT l.log_time_id, l.recipe_id, l.log_action, l.log_time, l.recipe_flow_id, r."name" AS recipe_name, rf."name" AS recipe_flow_name, ps.process_step_id, ps."name" AS process_step_name FROM log_time l
        INNER JOIN recipes r ON l.recipe_id = r.recipe_id
        INNER JOIN recipe_flow rf ON l.recipe_flow_id = rf.recipe_flow_id
        INNER JOIN process_step ps ON rf.process_step_id = ps.process_step_id
        WHERE l.log_time BETWEEN $1 AND $2
        ORDER BY l.log_time
        ;`;

        const result = await db.query(query, [start_date, end_date]);
        return result.rows;
    },
};

module.exports = LogTime;
