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
	primaryKey: "exerciseId",
	properties: {
		exerciseId: "string",
		id: "string",
		name: "string",
		sets: "ExerciseSet[]",
		completed: "bool",
		createdAt: "date",
		updatedAt: "date",
		notes: "string",
		order: "int",
		type: "string",
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
