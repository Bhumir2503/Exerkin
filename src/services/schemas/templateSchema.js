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

export const TemplateExerciseSchema = {
	name: "TemplateExercise",
	properties: {
		exerciseId: "string",
		name: "string",
		sets: "ExerciseSet[]",
		notes: "string?",
		exerciseType: "string", // "strength", "cardio", "stretching"
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
		unitSystem: "string", // "metric" or "imperial"
        syncStatus: "string", // "synced", "pending", "failed"
	},
};
