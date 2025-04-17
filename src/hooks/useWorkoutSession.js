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

import { buildWorkoutObject } from "../services/helpers/objectBuilder";

import {
	getWorkouts,
	addWorkout,
} from "../services/functions/workoutFunctions";
import { useRealm } from "../contexts/RealmProvider";

export const useWorkoutSession = () => {
	const { user } = useUser();
	const realm = useRealm();
	const { workoutTitle, setWorkoutTitle } = useWorkoutTitle();
	const { workoutNotes, setWorkoutNotes } = useWorkoutNotes();
	const { workoutExercises, clearExercises } = useWorkoutExercises();
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
		unitSystem,
		setUnitSystem,
		templateIdRef,
		isTemplateRef,
	} = useWorkoutMeta();

	const workoutStart = () => {
		clearExercises();
		workoutIdRef.current = uuid.v4();
		workoutStartTimeRef.current = new Date();
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
			duration: workoutTimer,
			imageURL: imageURL,
			unitSystem: "imperial",
			templateId: templateIdRef.current,
			isTemplate: isTemplateRef.current,
		});

		addWorkout(realm, workoutObject);
		const updatedWorkoutHistory = await getWorkouts(realm, user.uid);
		setWorkoutHistory(updatedWorkoutHistory);
		workoutCancel();
	};

	const workoutCancel = () => {
		setWorkoutError(null);
		workoutEndTimeRef.current = new Date();
		workoutIdRef.current = null;
		workoutStartTimeRef.current = null;
		workoutCreatedAtRef.current = null;
		workoutEndTimeRef.current = null;
		setWorkoutTitle("");
		setWorkoutNotes("");
		clearExercises();
		setImageURL(null);
		setUnitSystem(user?.unitSystem || "imperial");
		templateIdRef.current = null;
		isTemplateRef.current = false;
		resetTimer();
	};

	return {
		workoutIdRef,
		workoutTitle,
		workoutNotes,
		workoutExercises,
		workoutTimer,
		workoutStartTimeRef,
		workoutStart,
		workoutFinish,
		workoutCancel,
	};
};
