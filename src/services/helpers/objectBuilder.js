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

	const workoutFiltered = exercises.map((exercise) => {
		const sets = exercise.sets.filter(
			(set) =>
				set.weight !== null &&
				set.weight !== "" &&
				set.weight !== 0 &&
				set.time !== null &&
				set.time !== "" &&
				set.time !== 0 &&
				set.distance !== null &&
				set.distance !== "" &&
				set.distance !== 0
		);
		return { ...exercise, sets };
	});

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
	userId,
	templateId,
	name,
	notes,
	exercises,
	unitSystem,
	status
) => {
	if (name === "") {
		name = "Untitled Template";
	}

	const workoutFiltered = exercises.map((exercise) => {
		const sets = exercise.sets.filter(
			(set) =>
				set.weight !== null &&
				set.weight !== "" &&
				set.weight !== 0 &&
				set.time !== null &&
				set.time !== "" &&
				set.time !== 0 &&
				set.distance !== null &&
				set.distance !== "" &&
				set.distance !== 0
		);
		return { ...exercise, sets };
	});

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
