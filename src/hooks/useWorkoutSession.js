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

export const useWorkoutSession = () => {
	const { user } = useUser();
	const { workoutTitle } = useWorkoutTitle();
	const { workoutNotes } = useWorkoutNotes();
	const { workoutExercises, clearExercises } = useWorkoutExercises();
	const { workoutHistory } = useWorkoutHistory();
	const { workoutTimer } = useWorkoutTimer();
	const { setWorkoutError } = useWorkoutError();
	const {
		workoutIdRef,
		workoutStartTimeRef,
		workoutEndTimeRef,
		workoutCreatedAtRef,
		imageURL,
		unitSystem,
		templateIdRef,
		isTemplateRef,
	} = useWorkoutMeta();

	const workoutStart = useCallback(() => {
		clearExercises();
		workoutIdRef.current = uuid.v4();
		workoutStartTimeRef.current = new Date();
	}, []);

	const workoutFinish = useCallback(() => {
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
			unitSystem: unitSystem,
			templateId: templateIdRef.current,
			isTemplate: isTemplateRef.current,
		});

		console.log("Workout Object: ", workoutObject);
	}, [user?.uid, workoutExercises]);

    return {
        workoutTitle,
        workoutNotes,
        workoutExercises,
        workoutTimer,
        workoutStartTimeRef,
        workoutStart,
        workoutFinish,
    }
};
