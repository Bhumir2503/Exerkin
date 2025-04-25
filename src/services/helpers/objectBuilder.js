import { formatDuration } from "./timeFormatter";
import uuid from "react-native-uuid";

export const buildWorkoutObject = (workout) => {
	if (workout.workoutTitle === "") {
		workout.workoutTitle = "Untitled Workout";
	}

	const workoutFiltered = workout.workoutExercises.filter(
		(exercise) => exercise.sets.length > 0
	);

	return {
		userId: workout.userId,
		workoutId: workout.workoutId,
		name: workout.workoutTitle,
		notes: workout.workoutNotes,
		imageURL: workout.imageURL,
		base64Image: workout.base64Image,
		unitSystem: workout.unitSystem,
		exercises: workoutFiltered,
		startedAt: workout.startedAt,
		completedAt: workout.completedAt,
		createdAt: new Date(),
		updatedAt: new Date(),
		duration: formatDuration(workout.startedAt, workout.completedAt),
		deleted: false,
		deletedAt: null,
		blueprintId: workout.blueprintId,
		isBlueprint: workout.isBlueprint,
		syncStatus: "unsynced",
	};
};

export const buildWorkoutEditObject = (workout) => {
	if (workout.workoutTitle === "") {
		workout.workoutTitle = "Untitled Workout";
	}

	const workoutFiltered = workout.workoutExercises.filter(
		(exercise) => exercise.sets.length > 0
	);

	return {
		userId: workout.userId,
		workoutId: workout.workoutId,
		name: workout.workoutTitle,
		notes: workout.workoutNotes,
		imageURL: workout.imageURL,
		base64Image: workout.base64Image,
		unitSystem: workout.unitSystem,
		exercises: workoutFiltered,
		startedAt: workout.startedAt,
		completedAt: workout.completedAt,
		createdAt: workout.createdAt,
		updatedAt: new Date(),
		duration: formatDuration(workout.startedAt, workout.completedAt),
		deleted: false,
		deletedAt: null,
		blueprintId: workout.blueprintId,
		isBlueprint: workout.isBlueprint,
		syncStatus: "unsynced",
	};

};

export const buildExerciseObject = (selectedExercise) => {
	const exercise = {
		uniqueId: uuid.v4(),
		exerciseId: selectedExercise.id,
		name: selectedExercise.name,
		sets: [buildSetObject()],
		notes: null,
		exerciseType: selectedExercise.type,
	};

	return exercise;
};

export const buildSetObject = () => {
	const set = {
		setId: uuid.v4(),
		weight: null,
		time: null,
		distance: null,
		reps: null,
		completed: false,
		notes: null,
		setType: null,
	};
	return set;
};

export const buildBlueprintObject = (blueprint) => {
	if (blueprint.blueprintTitle === "") {
		blueprint.blueprintTitle = "Untitled Blueprint";
	}

	const workoutFiltered = blueprint.blueprintExercises.filter(
		(exercise) => exercise.sets.length > 0
	);


	const workoutChecked = workoutFiltered.filter(
		(exercise) => exercise.sets.length > 0
	);

	return {
		blueprintId: blueprint.blueprintId,
		userId: blueprint.userId,
		name: blueprint.blueprintTitle,
		note: blueprint.blueprintNotes,
		exercises: workoutChecked,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		unitSystem: blueprint.unitSystem,
		syncStatus: "unsynced",
	};

};
