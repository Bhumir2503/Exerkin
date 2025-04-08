export const ExerciseSetSchema = {
	name: "ExerciseSet",
	properties: {
		weight: "string?",
		reps: "string?",
		time: "string?",
		distance: "string?",
	},
};

export const WorkoutExerciseSchema = {
	name: "WorkoutExercise",
	properties: {
		id: "string",
		name: "string",
		sets: "ExerciseSet[]",
	},
};

export const WorkoutSchema = {
	name: "Workout",
	primaryKey: "workoutId",
	properties: {
		workoutId: "string",
		userId: "string",
		name: "string",
		notes: "string",
		exercises: "WorkoutExercise[]",
		startedAt: "date",
		completedAt: "date",
		updatedAt: "date",
		uploadedAt: "date",
		duration: "string",
        syncStatus: "string", // "synced", "pending", "failed"
	},
};
