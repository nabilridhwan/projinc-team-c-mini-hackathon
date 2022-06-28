class PairSorter {
    constructor(items = []) {
        this.items = items;
        this.currentIteration = new Array(2);
        this.currentRecipeFlowID = -1;
        this.equipmentID = -1;
        this.currentIterationStep = 0;
        this.array = [];
    }

    getCycles(log = false) {
        this.items.forEach((item) => {
            const { id, equip_id, log_action } = item;
            if (log_action === 2 && this.findIfExistStart(item) >= 0) {
                log &&
                    console.log(
                        `log_time ${id} matches log_action 2 and has same recipe flow as index ${this.findIfExistStart(
                            item
                        )}`
                    );

                this.array[this.findIfExistStart(item)][1] = item;
                // this.currentIteration[1] = item;
            } else if (log_action === 1 && this.findIfExistStop(item) >= 0) {
                log &&
                    console.log(
                        `log_time ${id} matches log_action 1 and has same recipe flow as index ${this.findIfExistStop(
                            item
                        )}`
                    );

                this.array[this.findIfExistStop(item)][0] = item;
                // this.array[this.currentIterationStep - 1][0] = item;
                // this.currentIteration[0] = item;
            } else if (log_action === 1) {
                log &&
                    console.log(
                        `log_time ${id} matches log_action 1 and is new`
                    );
                this.currentRecipeFlowID = item.recipe_flow_id;
                this.currentIteration[0] = item;
                this.equipmentID = equip_id;
            }

            log &&
                console.log(
                    `Iteration: ${this.currentIterationStep}. Current length of array: ${this.array.length}`
                );
            // console.log(this.currentIteration);
            // console.log(this.equipmentID, this.currentRecipeFlowID);

            log && console.log("======================");
            if (this.currentIteration.length !== 0) {
                this.array.push(this.currentIteration);
            }
            this.currentIteration = [];
            this.currentIterationStep++;
            // this.currentRecipeFlowID = -1;
            // this.equipmentID = -1;
        });

        return this.array;
    }

    // Find the items that start but no step
    findIfExistStart(logItem) {
        // Find condition:
        /*
            1. log_action === 2
            2. equip_id === item equip_id
            3. recipe_flow_id === item recipe_flow_id
        */

        let rtnIndex = -1;

        const { equip_id, recipe_flow_id, fr_process_steps } = logItem;

        this.array.forEach((arrayItem, index) => {
            const [start, stop] = arrayItem;

            if (!stop && start) {
                // console.log("Found a start");
                const {
                    equip_id: equip_id_first,
                    recipe_flow_id: recipe_flow_id_first,
                    fr_process_steps: fr_process_steps_first,
                } = start;
                if (
                    equip_id === equip_id_first &&
                    recipe_flow_id === recipe_flow_id_first &&
                    fr_process_steps === fr_process_steps_first
                ) {
                    rtnIndex = index;
                }
            }
        });

        return rtnIndex;
    }

    findIfExistStop(item) {
        // Find condition:
        /*
            1. log_action === 2
            2. equip_id === item equip_id
            3. recipe_flow_id === item recipe_flow_id
        */

        let rtnIndex = -1;

        const { equip_id, recipe_flow_id, fr_process_steps } = item;

        this.array.forEach((arrayItem, index) => {
            const [first, second] = arrayItem;

            if (!first && second) {
                // console.log("Found a end");
                const {
                    equip_id: equip_id_first,
                    recipe_flow_id: recipe_flow_id_first,
                    fr_process_steps: fr_process_steps_first,
                } = second;
                if (
                    equip_id === equip_id_first &&
                    recipe_flow_id === recipe_flow_id_first &&
                    fr_process_steps === fr_process_steps_first
                ) {
                    rtnIndex = index;
                }
            }
        });

        return rtnIndex;
    }
}

module.exports = PairSorter;
