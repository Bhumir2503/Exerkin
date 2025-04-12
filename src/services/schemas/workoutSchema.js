export const ExerciseSetSchema = {
	name: "ExerciseSet",
	properties: {
		weight: "string?",
		reps: "string?",
		time: "string?",
		distance: "string?",
		completed: "bool?",
		setType: "string?", // "warmUp", "workingSet", "coolDown"

	},
};

export const WorkoutExerciseSchema = {
	name: "WorkoutExercise",
	properties: {
		exerciseId: "string",
		name: "string",
		sets: "ExerciseSet[]",
		notes: "string",
		exerciseType: "string",
	},
};

export const WorkoutSchema = {
	name: "Workout",
	primaryKey: "workoutId",
	properties: {
		workoutId: "string",
		templateId: "string?",
		userId: "string",
		name: "string",
		notes: "string?",
		exercises: "WorkoutExercise[]",
		startedAt: "date",
		completedAt: "date",
		createdAt: "date",
		updatedAt: "date",
		duration: "string",
		unitSystem: "string?", // "metric" or "imperial"
		imageURL: "string?",
		isTemplate: "bool?",
        syncStatus: "string", // "synced", "pending", "failed"
	},
};
