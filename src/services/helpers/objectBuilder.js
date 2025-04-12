import { formatDuration } from "./timeFormatter";
import uuid from "react-native-uuid";

export const buildWorkoutObject = (
	workoutId,
	templateId,
	userId,
	name,
	notes,
	isTemplate,
	imageURL,
	unitSystem,
	exercises,
	startTime,
	duration,
	status
) => {
	if (name === "") {
		name = "Untitled Workout";
	}

    const workoutFiltered = exercises

	const workoutChecked = workoutFiltered.filter(
		(exercise) => exercise.sets.length > 0
	);

	const workout = {
		workoutId,
		templateId,
		userId,
		name,
		notes,
		isTemplate,
		imageURL,
		unitSystem,
		exercises: workoutChecked,
		startedAt: startTime,
		completedAt: new Date(),
		createdAt: new Date(),
		updatedAt: new Date(),
		duration: formatDuration(duration),
		syncStatus: status,
	};
	return workout;
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

export const buildTemplateObject = (
	templateId,
	userId,
	name,
	notes,
	exercises,
	unitSystem,
	status
) => {
	if (name === "") {
		name = "Untitled Blueprint";
	}

	const workoutFiltered = exercises

	const workoutChecked = workoutFiltered.filter(
		(exercise) => exercise.sets.length > 0
	);

	const template = {
		templateId,
		userId,
		name,
		notes,
		exercises: workoutChecked,
		createdAt: new Date(),
		updatedAt: new Date(),
		unitSystem,
		syncStatus: status,
	};
	return template;
};
