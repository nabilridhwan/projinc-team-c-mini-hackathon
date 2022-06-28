import { useEffect, useState } from "react";
import { getAllLogTimes } from "./api/log_time";
import LogItem from "./utils/LogItem";
import PairSorter from "./utils/PairSorterCycle";
import { CycleWithTimeTaken } from "./utils/CycleWithTimeTaken";
import { Duration } from "luxon";
import ReactApexChart from "react-apexcharts";

function App() {
    const [data, setData] = useState({});

    const [categories, setCategories] = useState([]);

    const [series, setSeries] = useState([]);

    const [options, setOptions] = useState();

    useEffect(() => {
        (async () => {
            const results = await getAllLogTimes();

            const {
                data: {
                    data: { message },
                },
            } = results;

            const dataToLogItem = message.map(
                (item) => new LogItem({ ...item })
            );

            // console.log(dataToLogItem);

            const cycles = new PairSorter(dataToLogItem).getCycles(false);

            const completedCycles = cycles.filter((cycle) =>
                cycle.isCompleteCycle()
            );

            // Create an object with every recipe name from completed cycles
            const completedCyclesRecipeNames = completedCycles.reduce(
                (acc, cycle) => {
                    const { recipe_name, recipe_id } = cycle;
                    acc[recipe_name] = {
                        recipe_name,
                        recipe_id,
                        processes: [],
                    };

                    return acc;
                },
                {}
            );

            completedCycles.forEach((cycle) => {
                const { recipe_name, process_step_id, process_step_name } =
                    cycle;

                // Get the processes from completed cycles recipe name
                const processes =
                    completedCyclesRecipeNames[recipe_name].processes;

                // Check if the process is already in the processes array
                const processExists = processes.some(
                    (process) => process.process_step_id === process_step_id
                );

                // If the process doesn't exist, add it to the processes array
                if (!processExists) {
                    processes.push({
                        process_step_id,
                        process_step_name,
                        cycles: [],
                    });
                }
            });

            // Sort the processes by process_step_id
            Object.keys(completedCyclesRecipeNames).forEach((recipe) => {
                completedCyclesRecipeNames[recipe].processes.sort(
                    (a, b) => a.process_step_id - b.process_step_id
                );
            });

            // Put the cycles in the cycles array of the processes
            completedCycles.forEach((cycle) => {
                // Get all properties of cycle

                const { recipe_name, process_step_id } = cycle;

                // Put cycle into cycle with time taken class
                const newCycle = new CycleWithTimeTaken({ ...cycle });

                completedCyclesRecipeNames[recipe_name].processes.forEach(
                    (process) => {
                        if (process.process_step_id === process_step_id) {
                            process.cycles.push(newCycle);
                        }
                    }
                );
            });

            // Get the average time of all the processes
            Object.keys(completedCyclesRecipeNames).forEach((recipe_name) => {
                const obj = completedCyclesRecipeNames[recipe_name];

                // Get the cycles for each process
                obj.processes.forEach((process) => {
                    const process_step_name = process.process_step_name;
                    const totalDuration = [];
                    process.cycles.forEach((cycle) => {
                        // Get the duration
                        const duration = cycle.duration;
                        totalDuration.push(Duration.fromISO(duration));
                    });
                    console.log(recipe_name);
                    console.log(process_step_name);
                    console.log(totalDuration);

                    // Add the duration up
                    const td = totalDuration.reduce((prev, current) => {
                        return prev + current;
                    }, Duration.fromMillis(0));

                    const avg = td / process.cycles.length;

                    process.average_time_taken =
                        Duration.fromMillis(avg).toISO();
                });
            });

            // ! State setting
            setCategories(Object.keys(completedCyclesRecipeNames));
            setData(completedCyclesRecipeNames);

            // TODO: Fix series
            const d = Object.keys(completedCyclesRecipeNames).map(
                (recipe_name) => ({
                    name: "",
                    data: completedCyclesRecipeNames[recipe_name].processes.map(
                        ({ average_time_taken }) =>
                            Duration.fromISO(average_time_taken).as("hour")
                    ),
                })
            );

            setSeries(d);
        })();
    }, []);

    return (
        <div className="App">
            <ReactApexChart
                options={{
                    chart: {
                        type: "bar",
                        height: 350,
                        stacked: true,
                    },
                    plotOptions: {
                        bar: {
                            horizontal: true,
                        },
                    },
                    stroke: {
                        width: 1,
                        colors: ["#fff"],
                    },
                    title: {
                        text: "Average Production Time",
                    },
                    xaxis: {
                        categories,
                        labels: {
                            formatter: function (val) {
                                return val + "H";
                            },
                        },
                        title: {
                            text: "Time Taken",
                        },
                    },
                    yaxis: {
                        title: {
                            text: "Recipe Name",
                        },
                    },
                    tooltip: {
                        y: {
                            formatter: function (val) {
                                return val + "H";
                            },
                        },
                    },
                    fill: {
                        opacity: 1,
                    },
                    legend: {
                        position: "top",
                        horizontalAlign: "left",
                        offsetX: 40,
                    },
                }}
                series={series}
                type="bar"
                height={350}
            />
        </div>
    );
}

export default App;
