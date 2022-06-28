import { DateTime, Duration, Interval } from "luxon";
import Cycle from "./Cycle";

export class CycleWithTimeTaken extends Cycle {
    constructor(
        equipmentId,
        equipmentName,
        start,
        startId,
        recipeId,
        processStepId,
        processStepName,
        recipeName,
        end = null,
        endId = null
    ) {
        super(
            equipmentId,
            equipmentName,
            start,
            startId,
            recipeId,
            processStepId,
            processStepName,
            recipeName,
            end,
            endId
        );

        // Calculate the time start and stop duration

        this.duration = this.#calculateDuration(this.start, this.end);
    }

    #calculateDuration(start, stop) {
        return Interval.fromDateTimes(
            DateTime.fromISO(start),
            DateTime.fromISO(stop)
        )
            .toDuration()
            .toISO();
    }
}
