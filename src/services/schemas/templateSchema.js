export const ExerciseSetSchema = {
	name: "ExerciseSet",
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

export const TemplateExerciseSchema = {
	name: "TemplateExercise",
	primaryKey: "uniqueId",
	properties: {
		uniqueId: "string",
		exerciseId: "string",
		name: "string",
		sets: "ExerciseSet[]",
		notes: "string?",
		exerciseType: "string",
	},
};

export const TemplateSchema = {
	name: "Template",
	primaryKey: "templateId",
	properties: {
		templateId: "string",
		userId: "string",
		name: "string",
		note: "string?",
		exercises: "TemplateExercise[]",
		createdAt: "date",
		updatedAt: "date",
		deletedAt: "date?",
		unitSystem: "string", // "metric" or "imperial"
        syncStatus: "string", // "synced", "pending", "failed"
	},
};
