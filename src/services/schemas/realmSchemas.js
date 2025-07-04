import {
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
} from "./workoutSchema";
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

	SyncStatusSchema,
	BlueprintSchema,
	BlueprintExerciseSchema,
	BlueprintExerciseSetSchema,
	// add more here if needed
];
