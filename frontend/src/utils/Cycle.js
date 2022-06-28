class Cycle {
    /**
     * @param {number} equipmentId The equipment id
     * @param {string} equipmentName The equipment name
     * @param {Date} start The start time
     * @param {number} startId The start log time id
     * @param {number} recipeId The recipe id
     * @param {number} processStepId The process step id (interchangeable with recipe flow id)
     * @param {string} processStepName The process step name (interchangeable with recipe flow name)
     * @param {Date?} end The end time
     * @param {number?} endId The end log time id
     */
    constructor({
        equip_id,
        equip_name,
        recipe_id,
        recipe_name,
        process_step_id,
        process_step_name,
        recipe_flow_id,
        recipe_flow_name,
        start,
        start_id,
        end = null,
        end_id = null,
    }) {
        this.equip_id = equip_id;
        this.equip_name = equip_name;
        this.recipe_id = recipe_id;
        this.recipe_name = recipe_name;
        this.process_step_id = process_step_id;
        this.process_step_name = process_step_name;
        this.recipe_flow_id = recipe_flow_id;
        this.recipe_flow_name = recipe_flow_name;
        this.start = start;
        this.start_id = start_id;
        this.end = end;
        this.end_id = end_id;
    }

    /**
     * True if the cycle has both start and stop (i.e. Complete cycle)
     * @returns {boolean} - True if the cycle has both start and end
     */
    isCompleteCycle() {
        return this.start != null && this.end != null;
    }

    /**
     * True if the cycle has only start but no stop
     * @returns {boolean} - True if the cycle has only start but no stop
     */
    hasOnlyStart() {
        return this.start != null && this.end == null;
    }

    /**
     * True if the cycle has only end but no start
     * @returns {boolean} - True if the cycle has only stop but no start
     */
    hasOnlyStop() {
        return this.end != null && this.end == null;
    }

    /**
     * Sets the end time of the cycle
     * @param end Date - The end time
     * @param endId number - The end log time id
     * @returns {void}
     */
    setEnd(end_id, end) {
        this.end = end;
        this.end_id = end_id;
    }

    /**
     * Sets the start time of the cycle
     * @param start Date - The start time
     * @param startId number - The start log time id
     * @returns {void}
     */
    setStart(start_id, start) {
        this.start_id = start_id;
        this.start = start;
    }
}

module.exports = Cycle;
