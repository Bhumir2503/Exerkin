export const BlueprintExerciseSetSchema = {
	name: "BlueprintExerciseSet",
	primaryKey: "setId",
	properties: {
		setId: "string",
		weight: "string?",
		reps: "string?",
		time: "string?",
		distance: "string?",
		completed: "bool?",
		setType: "string?", // "warmUp", "workingSet", "coolDown"
		notes: "string?",
	},
};

export const BlueprintExerciseSchema = {
	name: "BlueprintExercise",
	primaryKey: "uniqueId",
	properties: {
		uniqueId: "string",
		exerciseId: "string",
		name: "string",
		sets: "BlueprintExerciseSet[]",
		notes: "string?",
		exerciseType: "string",
	},
};

export const BlueprintSchema = {
	name: "Blueprint",
	primaryKey: "blueprintId",
	properties: {
		blueprintId: "string",
		userId: "string",
		name: "string",
		note: "string?",
		exercises: "BlueprintExercise[]",
		createdAt: "date",
		updatedAt: "date",
		deletedAt: "date?",
		unitSystem: "string", // "metric" or "imperial"
		syncStatus: "string", // "synced", "pending", "failed"
	},
};
