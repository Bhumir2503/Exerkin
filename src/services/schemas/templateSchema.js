export const ExerciseSetSchema = {
	name: "ExerciseSet",
	properties: {
		weight: "string?",
		reps: "string?",
		time: "string?",
		distance: "string?",
	},
};

export const TemplateExerciseSchema = {
	name: "TemplateExercise",
	properties: {
		id: "string",
		name: "string",
		sets: "ExerciseSet[]",
	},
};

export const TemplateSchema = {
	name: "Template",
	primaryKey: "templateId",
	properties: {
		templateId: "string",
		title: "string",
		note: "string",
		exercises: "TemplateExercise[]",
		createdAt: "date",
		updatedAt: "date",
		uploadedAt: "date",
		userId: "string",
        syncStatus: "string", // "synced", "pending", "failed"
	},
};
