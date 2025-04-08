import {
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
} from "./workoutSchema";
import { DeletedWorkout } from "./deletedWorkoutSchema";
import { UserSchema } from "./userSchema";
import { MeasurementSchema } from "./measurementSchema";
import { SyncStatusSchema } from "./syncStatusSchema";

export const realmSchemas = [
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
	DeletedWorkout,
	UserSchema,
	MeasurementSchema,
	SyncStatusSchema,
	// add more here if needed
];
