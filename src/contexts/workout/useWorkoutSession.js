import { useWorkoutTitle } from "./WorkoutTitleContext";
import { useWorkoutNotes } from "./WorkoutNotesContext";
import { useWorkoutExercises } from "./WorkoutExercisesContext";
import { useWorkoutTimer } from "./WorkoutTimerContext";
import { useWorkoutMeta } from "./WorkoutMetaContext";
import { useWorkoutHistory } from "./WorkoutHistoryContext";
import { useWorkoutError } from "./WorkoutErrorContext";
import { useUser } from "../UserContext";

import { useCallback } from "react";
import uuid from "react-native-uuid";

import { buildWorkoutObject } from "../../services/helpers/objectBuilder";

export const useWorkoutSession = () => {
	const { user } = useUser();
	const { workoutTitle } = useWorkoutTitle();
	const { workoutNotes } = useWorkoutNotes();
	const { workoutExercises, setWorkoutExercises } = useWorkoutExercises();
	const { workoutHistory } = useWorkoutHistory();
	const { workoutTimer } = useWorkoutTimer();
    const { setError } = useWorkoutError();
	const {
		workoutIdRef,
		workoutStartTimeRef,
		workoutEndTimeRef,
		workoutCreatedAtRef,
		imageURL,
		unitSystem,
		templateIdRef,
		isTemplateRef,
	} = useWorkoutMeta;

	const workoutStart = useCallback(() => {
		setWorkoutExercises([]);
		workoutIdRef.current = uuid.v4();
		workoutStartTimeRef.current = new Date();
	}, []);

	const workoutFinish = useCallback(() => {
        setError(null);
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

	}, [user?.uid, workoutExercises]);
};
