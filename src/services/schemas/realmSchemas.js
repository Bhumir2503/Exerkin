import {
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
} from "./workoutSchema";
import { UserSchema, UserPreferencesSchema } from "./userSchema";
import { MeasurementSchema } from "./measurementSchema";
import { SyncStatusSchema } from "./syncStatusSchema";

import {
	BlueprintSchema,
	BlueprintExerciseSchema,
	BlueprintExerciseSetSchema,
} from "./blueprintSchema";

export const realmSchemas = [
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
	UserSchema,
	UserPreferencesSchema,
	MeasurementSchema,
	SyncStatusSchema,
	BlueprintSchema,
	BlueprintExerciseSchema,
	BlueprintExerciseSetSchema,
	// add more here if needed
];
