import {
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
} from "./workoutSchema";
import { DeletedWorkout } from "./deletedWorkoutSchema";
import { UserSchema } from "./userSchema";
import { MeasurementSchema } from "./measurementSchema";
import { SyncStatusSchema } from "./syncStatusSchema";

import { TemplateSchema, TemplateExerciseSchema, } from "./templateSchema";

export const realmSchemas = [
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
	DeletedWorkout,
	UserSchema,
	MeasurementSchema,
	SyncStatusSchema,
	TemplateSchema,
	TemplateExerciseSchema,
	// add more here if needed
];
