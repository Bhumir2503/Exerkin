import {
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
} from "./workoutSchema";
import { DeletedWorkout } from "./deletedWorkoutSchema";
import { UserSchema } from "./userSchema";

export const realmSchemas = [
	WorkoutSchema,
	WorkoutExerciseSchema,
	ExerciseSetSchema,
	DeletedWorkout,
	UserSchema,
	// add more here if needed
];
