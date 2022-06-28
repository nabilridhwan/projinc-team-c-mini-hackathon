class LogItem {
    constructor({
        log_time_id,
        equip_id,
        equip_name,
        recipe_id,
        recipe_name,
        lsc_id,
        process_step_id,
        process_step_name,
        recipe_flow_id,
        recipe_flow_name,
        log_action,
        log_time,
    }) {
        this.log_time_id = log_time_id;
        this.equip_id = equip_id;
        this.equip_name = equip_name;

        this.recipe_id = recipe_id;
        this.recipe_name = recipe_name;

        this.lsc_id = lsc_id;
        this.log_action = log_action;
        this.log_time = log_time;
        this.process_step_id = process_step_id;
        this.process_step_name = process_step_name;
        this.recipe_flow_id = recipe_flow_id;
        this.recipe_flow_name = recipe_flow_name;
    }
}

module.exports = LogItem;
