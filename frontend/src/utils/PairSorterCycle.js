const Cycle = require("./Cycle");
const LogItem = require("./LogItem");

/*
    ! The main point of this class is to sort the log items into cycles.
*/
class PairSorter {
    items;
    currentIteration;
    currentRecipeFlowID;
    array;

    constructor(items = []) {
        // Items is of type LogItem
        this.items = items;
        this.currentIteration = null;
        this.currentRecipeFlowID = -1;
        this.array = [];
    }

    getCycles(log = false) {
        this.items.forEach((item) => {
            const {
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
                recipeId,
                recipeName,
                log_action,
                log_time,
            } = item;

            // Check if it is stopped and if it has a start
            if (log_action === 2 && this.findIfExistStart(item) >= 0) {
                const indexFound = this.findIfExistStart(item);
                log &&
                    console.log(
                        `log time id ${log_time_id} matches log_action 2 and has same recipe flow as index ${indexFound}`
                    );

                // Sets the end time of the cycle
                this.array[indexFound].setEnd(log_time_id, log_time);
            } else if (log_action === 1 && this.findIfExistStop(item) >= 0) {
                // Check if it is a start and if there is a stop
                const indexFound = this.findIfExistStop(item);
                log &&
                    console.log(
                        `log time id ${log_time_id} matches log_action 1 and has same recipe flow as index ${indexFound}`
                    );

                // Sets the start time of the cycle
                this.array[indexFound].setStart(log_time_id, log_time);
            } else if (log_action === 1) {
                log &&
                    console.log(
                        `log time id ${log_time_id} matches log_action 1 and is new`
                    );

                this.currentRecipeFlowID = recipe_flow_id;
                this.currentIteration = new Cycle({
                    equip_id,
                    equip_name,
                    recipe_id,
                    recipe_name,
                    process_step_id,
                    process_step_name,
                    recipe_flow_id,
                    recipe_flow_name,
                    start: log_time,
                    start_id: log_time_id,
                });
            }

            log && console.log("======================");

            if (this.currentIteration !== null) {
                this.array.push(this.currentIteration);
            }

            this.currentIteration = null;
        });

        return this.array;
    }

    // Find the items that start but no step
    findIfExistStart(logItem) {
        let rtnIndex = -1;

        const { equip_id, process_step_id, recipe_flow_id } = logItem;

        // Search the array in reverse
        this.array.forEach((arrayItem, index) => {
            // console.log(arrayItem);
            if (arrayItem.hasOnlyStart()) {
                const {
                    equip_id: cycleEquipmentId,
                    process_step_id: cycleProcessStepId,
                    recipe_flow_id: cycleRecipeFlowId,
                } = arrayItem;

                if (
                    equip_id === cycleEquipmentId &&
                    process_step_id == cycleProcessStepId &&
                    recipe_flow_id === cycleRecipeFlowId
                ) {
                    rtnIndex = index;
                }
            }
        });

        return rtnIndex;
    }

    findIfExistStop(logItem) {
        let rtnIndex = -1;

        const { equip_id, process_step_id, recipe_flow_id } = logItem;

        this.array.forEach((arrayItem, index) => {
            if (arrayItem.hasOnlyStop()) {
                const {
                    equip_id: cycleEquipmentId,
                    process_step_id: cycleProcessStepId,
                    recipe_flow_id: cycleRecipeFlowId,
                } = arrayItem;

                if (
                    equip_id === cycleEquipmentId &&
                    process_step_id == cycleProcessStepId &&
                    recipe_flow_id === cycleRecipeFlowId
                ) {
                    rtnIndex = index;
                }
            }
        });

        return rtnIndex;
    }
}

module.exports = PairSorter;
