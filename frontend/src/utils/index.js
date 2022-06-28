const { DateTime, Interval } = require("luxon");
const LogItem = require("./LogItem");
const PairSorter = require("./PairSorterCycle");
// const pool = require("../pool");
// const fs = require("fs").promises;
const { LogTimes, EQUIP_TYPE } = require("../model/logTimes");

// Start and end date goes here
const startDate = DateTime.fromObject(
    {
        year: 2021,
        month: 8,
        day: 15,
        hour: 0,
        minute: 0,
        second: 0,
    },
    {
        zone: "Asia/Singapore",
    }
);
const endDate = DateTime.fromObject(
    {
        year: 2021,
        month: 8,
        day: 21,
        hour: 23,
        minute: 59,
        second: 59,
    },
    {
        zone: "Asia/Singapore",
    }
);

const intervalObject = {
    days: 1,
};

async function getHeatmapData(startDate, endDate, intervalObj, equipmentType) {
    // Object to contain items (a.k.a Final Object!)
    const obj = {};

    // Prepare the dates for SQL query
    const startDateSQLQuery = startDate.toFormat("yyyy-MM-dd HH:mm:ss");
    const endDateSQLQuery = endDate.toFormat("yyyy-MM-dd HH:mm:ss");

    // Get all the distinct equipments
    const uniqueEquipments = await LogTimes.getUniqueEquipments(
        startDateSQLQuery,
        endDateSQLQuery,
        equipmentType
    );

    // Create a new object for each equipment
    uniqueEquipments.forEach(({ equip_id, name }) => {
        obj[name] = {
            equip_id,
            name,
            data: getDateIntervalsWithNumberOfTimesUsed(
                startDate,
                endDate,
                intervalObj
            ),
        };
    });

    // Get all the log times
    const allLogTimesQuery = await LogTimes.getAllLogTimes(
        startDateSQLQuery,
        endDateSQLQuery,
        equipmentType
    );

    // Map all the log times into a new object called Log Item
    const allLogItems = allLogTimesQuery.map(
        ({
            equip_name,
            recipe_flow_desc,
            recipe_flow_id,
            recipe_name,
            id,
            equip_id,
            recipe_id,
            log_action,
            log_time,
            fr_process_steps,
        }) =>
            new LogItem(
                id,
                equip_id,
                equip_name,
                recipe_flow_desc,
                recipe_flow_id,
                recipe_id,
                recipe_name,
                fr_process_steps,
                log_action,
                log_time
            )
    );

    // Close the pool connection
    // pool.end();

    const cycleTimeStart = performance.now();

    // Initialize the Pair Sorter
    const ps = new PairSorter(allLogItems);

    // Get the total cycles
    const cycles = ps.getCycles(false);

    const cycleTimeStop = performance.now();

    console.log(`Cycle time: ${cycleTimeStop - cycleTimeStart}ms`);

    const cycleSortStart = performance.now();

    // For each cycle
    cycles.forEach((cycle) => {
        // If there is a start and stop for a cycle
        if (cycle.isCompleteCycle()) {
            // Get logTime, equipmentName and endLogTime
            const { start, end, equipmentName } = cycle;

            if (!start || !end) {
                console.log(cycle);
                return;
            }

            // Minus all the things below largestIntervalType to be 0
            const startConverted = DateTime.fromJSDate(start, {
                zone: "Asia/Singapore",
            });
            const endConverted = DateTime.fromJSDate(end, {
                zone: "Asia/Singapore",
            });

            // Get the interval from the start and stop log time
            const machineInterval = Interval.fromDateTimes(
                startConverted,
                endConverted
            );

            obj[equipmentName].data.forEach((interval, index) => {
                const { start, end } = interval;
                const startIntervalConverted = DateTime.fromISO(start, {
                    zone: "Asia/Singapore",
                });
                const endIntervalConverted = DateTime.fromISO(end, {
                    zone: "Asia/Singapore",
                });

                const intervalInterval = Interval.fromDateTimes(
                    startIntervalConverted,
                    endIntervalConverted
                );

                if (machineInterval.overlaps(intervalInterval)) {
                    obj[equipmentName].data[index].numberOfTimesUsed += 1;
                }
            });
        }
    });

    const cycleSortStop = performance.now();

    console.log(`Cycle sort time: ${cycleSortStop - cycleSortStart}ms`);
    console.log(
        `Total time for both: ${
            cycleSortStop - cycleTimeStart + (cycleTimeStop - cycleTimeStart)
        }ms`
    );

    // Write the data
    // const data = JSON.stringify(obj);
    // await fs.writeFile("./data.json", data);

    return obj;
}

// Make date intervals
function getDateIntervals(startDate, endDate, intervalObj) {
    const intervals = [];
    let start = startDate;

    while (start <= endDate) {
        const obj = {
            start: start.toISO(),
            end: "",
        };

        // Plus the required interval but minus 1 second
        start = start.plus(intervalObj).minus({ seconds: 1 });

        // Set end
        obj.end = start.toISO();

        // Plus the extra one second for the next interval
        start = start.plus({ seconds: 1 });

        intervals.push(obj);
    }

    return intervals;
}

function getDateIntervalsWithNumberOfTimesUsed(
    startDate,
    endDate,
    intervalObj
) {
    return getDateIntervals(startDate, endDate, intervalObj).map(
        (interval) => ({
            ...interval,
            numberOfTimesUsed: 0,
        })
    );
}

module.exports = getHeatmapData;
