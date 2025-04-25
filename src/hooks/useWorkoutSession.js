import { useWorkoutTitle } from "../contexts/workout/WorkoutTitleContext";
import { useWorkoutNotes } from "../contexts/workout/WorkoutNotesContext";
import { useWorkoutExercises } from "../contexts/workout/WorkoutExercisesContext";
import { useWorkoutTimer } from "../contexts/workout/WorkoutTimerContext";
import { useWorkoutMeta } from "../contexts/workout/WorkoutMetaContext";
import { useWorkoutHistory } from "../contexts/workout/WorkoutHistoryContext";
import { useWorkoutError } from "../contexts/workout/WorkoutErrorContext";
import { useUser } from "../contexts/UserContext";

import { useCallback } from "react";
import uuid from "react-native-uuid";

import { buildWorkoutEditObject, buildWorkoutObject } from "../services/helpers/objectBuilder";

import {
	getWorkouts,
	addWorkout,
	editWorkout,
} from "../services/functions/workoutFunctions";
import { useRealm } from "../contexts/RealmProvider";

export const useWorkoutSession = () => {
	const { user } = useUser();
	const realm = useRealm();
	const { workoutTitle, setWorkoutTitle } = useWorkoutTitle();
	const { workoutNotes, setWorkoutNotes } = useWorkoutNotes();
	const { workoutExercises,setWorkoutExercises, clearExercises } = useWorkoutExercises();
	const { workoutHistory, setWorkoutHistory } = useWorkoutHistory();
	const { workoutTimer, resetTimer } = useWorkoutTimer();
	const { setWorkoutError } = useWorkoutError();
	const {
		workoutIdRef,
		workoutStartTimeRef,
		workoutEndTimeRef,
		workoutCreatedAtRef,
		imageURL,
		setImageURL,
		base64Image,
		setBase64Image,
		unitSystem,
		setUnitSystem,
		blueprintIdRef,
		isBlueprintRef,
		formTypeRef,

		resetWorkoutMeta,
	} = useWorkoutMeta();

	const workoutStart = () => {
		clearExercises();
		workoutIdRef.current = uuid.v4();
		workoutStartTimeRef.current = new Date();
		formTypeRef.current = "workout";
	};

	const workoutFinish = async () => {
		setWorkoutError(null);
		workoutEndTimeRef.current = new Date();

		const workoutObject = buildWorkoutObject({
			userId: user.uid,
			workoutId: workoutIdRef.current,
			workoutTitle: workoutTitle,
			workoutNotes: workoutNotes,
			workoutExercises: workoutExercises,
			startedAt: workoutStartTimeRef.current,
			completedAt: workoutEndTimeRef.current,
			imageURL: imageURL,
			base64Image: base64Image,
			unitSystem: "imperial",
			blueprintId: blueprintIdRef.current,
			isBlueprint: isBlueprintRef.current,
		});

		addWorkout(realm, workoutObject);
		const updatedWorkoutHistory = await getWorkouts(realm, user.uid);
		setWorkoutHistory(updatedWorkoutHistory);
		workoutCancel();
	};

	const workoutCancel = () => {
		setWorkoutError(null);
		setWorkoutTitle("");
		setWorkoutNotes("");
		clearExercises();
		resetWorkoutMeta();
		resetTimer();
	};

	const editStart =(workout) => {
		setWorkoutError(null);
		workoutIdRef.current = workout.workoutId;
		setWorkoutTitle(workout.name);
		setWorkoutNotes(workout.notes);
		workoutStartTimeRef.current = workout.startedAt;
		workoutEndTimeRef.current = workout.completedAt;
		workoutCreatedAtRef.current = workout.createdAt;
		blueprintIdRef.current = workout.blueprintId;
		isBlueprintRef.current = workout.isBlueprint;
		setImageURL(workout.imageURL);
		setBase64Image(workout.base64Image);
		setUnitSystem(workout.unitSystem);
		setWorkoutExercises(workout.exercises);
		formTypeRef.current = "edit";
	}

	const editFinish = async () => {
		setWorkoutError(null);

		const workoutObject = buildWorkoutEditObject({
			userId: user.uid,
			workoutId: workoutIdRef.current,
			workoutTitle: workoutTitle,
			workoutNotes: workoutNotes,
			workoutExercises: workoutExercises,
			startedAt: workoutStartTimeRef.current,
			completedAt: workoutEndTimeRef.current,
			createdAt: workoutCreatedAtRef.current,
			imageURL: imageURL,
			base64Image: base64Image,
			unitSystem: "imperial",
			blueprintId: blueprintIdRef.current,
			isBlueprint: isBlueprintRef.current,
		});

		editWorkout(realm, workoutObject);
		const updatedWorkoutHistory = await getWorkouts(realm, user.uid);
		setWorkoutHistory(updatedWorkoutHistory);
		workoutCancel();
	}

	return {
		workoutIdRef,
		workoutTitle,
		workoutNotes,
		workoutExercises,
		workoutTimer,
		workoutStartTimeRef,
		formTypeRef,
		workoutStart,
		workoutFinish,
		workoutCancel,
		editStart,
		editFinish,
	};
};
