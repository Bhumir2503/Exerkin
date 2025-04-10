import { formatDuration } from "./timeFormatter";

export const buildWorkoutObject = (userId, workoutId, name, notes, exercises, startTime,  duration) => {
    if(name === "") {
        name = "Untitled Workout";
    }

    const workoutFiltered = exercises.map((exercise) => {
        const sets = exercise.sets.filter(
            (set) =>
                set.weight !== null &&
                set.weight !== "" &&
                set.weight !== 0 &&
                set.time !== null &&
                set.time !== "" &&
                set.time !== 0 &&
                set.distance !== null &&
                set.distance !== "" &&
                set.distance !== 0
        );
        return { ...exercise, sets };
    });

    const workoutChecked = workoutFiltered.filter(
        (exercise) => exercise.sets.length > 0
    );

    const workout = {
        workoutId,
        userId,
        name,
        notes,
        exercises: workoutChecked,
        startedAt: startTime,
        completedAt: new Date(),
        updatedAt: new Date(),
        uploadedAt: new Date(),
        duration: formatDuration(duration),
    };
    return workout;

}