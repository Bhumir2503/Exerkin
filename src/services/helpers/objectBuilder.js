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
		unitSystem: workout.unitSystem,
		exercises: workoutFiltered,
		startedAt: workout.startedAt,
		completedAt: workout.completedAt,
		createdAt: new Date(),
		updatedAt: new Date(),
		duration: formatDuration(workout.duration),
		deleted: false,
		deletedAt: null,
		syncStatus: "Synced",
	};

}

export const buildWorkoutEditObject = (
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

	const workoutFiltered = exercises.filter(
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
		deleted: false,
		deletedAt: null,
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
		note: notes,
		exercises: workoutChecked,
		createdAt: new Date(),
		updatedAt: new Date(),
		deletedAt: null,
		unitSystem,
		syncStatus: status,
	};
	return template;
};
