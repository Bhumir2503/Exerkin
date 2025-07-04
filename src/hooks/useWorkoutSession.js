import { useWorkoutTitle } from "../contexts/workout/WorkoutTitleContext";
import { useWorkoutNotes } from "../contexts/workout/WorkoutNotesContext";
import { useWorkoutExercises } from "../contexts/workout/WorkoutExercisesContext";
import { useWorkoutTimer } from "../contexts/workout/WorkoutTimerContext";
import { useWorkoutMeta } from "../contexts/workout/WorkoutMetaContext";
import { useWorkoutHistory } from "../contexts/workout/WorkoutHistoryContext";
import { useWorkoutError } from "../contexts/workout/WorkoutErrorContext";
import { useUser } from "../contexts/UserContext";

import uuid from "react-native-uuid";
import { Timestamp, serverTimestamp } from "@react-native-firebase/firestore";

import {
	saveWorkoutInFirestore,
	updateWorkoutInFirestore,
} from "../services/firestore/firestoreWorkoutServices";

export const useWorkoutSession = () => {
	const { userId, unitSystem } = useUser();
	const { workoutTitle, setWorkoutTitle } = useWorkoutTitle();
	const { workoutNotes, setWorkoutNotes } = useWorkoutNotes();
	const { workoutExercises, setWorkoutExercises, clearExercises } =
		useWorkoutExercises();
	const { setWorkoutHistory } = useWorkoutHistory();
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
		setUnitSystem,
		blueprintIdRef,
		isBlueprintRef,
		formTypeRef,
		resetWorkoutMeta,
	} = useWorkoutMeta();

	const getCurrentWorkoutObject = () => {
		return {
			userId: userId,
			workoutId: workoutIdRef.current,
			name: workoutTitle,
			notes: workoutNotes,
			exercises: workoutExercises,
			startedAt: workoutStartTimeRef.current,
			completedAt: workoutEndTimeRef.current,
			imageURL: imageURL,
			base64Image: base64Image,
			unitSystem: unitSystem,
			isBlueprint: isBlueprintRef.current,
			blueprintId: blueprintIdRef.current,
			startedAt: workoutStartTimeRef.current,
			completedAt: workoutEndTimeRef.current,
			createdAt: workoutCreatedAtRef.current || serverTimestamp(),
			updatedAt: serverTimestamp(),
		};
	};

	const workoutStart = () => {
		clearExercises();
		workoutIdRef.current = uuid.v4();
		workoutStartTimeRef.current = Timestamp.now();
		formTypeRef.current = "workout";
	};

	const workoutFinish = async () => {
		setWorkoutError(null);
		workoutEndTimeRef.current = Timestamp.now();

		const workoutObject = getCurrentWorkoutObject();
		try {
			saveWorkoutInFirestore(workoutObject);
		} catch (error) {
			console.error("Error saving workout:", error);
			setWorkoutError("Failed to save workout. Please try again.");
			return;
		}
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

	const editStart = (workout) => {
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
	};

	const editFinish = async () => {
		setWorkoutError(null);

		const workoutObject = getCurrentWorkoutObject();

		try {
			await updateWorkoutInFirestore(workoutObject);
		} catch (error) {
			console.error("Error updating workout:", error);
			setWorkoutError("Failed to update workout. Please try again.");
			return;
		}

		setWorkoutHistory((prevHistory) =>
			prevHistory.map((workout) =>
				workout.workoutId === workoutIdRef.current
					? workoutObject
					: workout
			)
		);
		workoutCancel();
	};

	const blueprintStart = (blueprint) => {
		setWorkoutError(null);
		workoutIdRef.current = uuid.v4();
		isBlueprintRef.current = true;
		blueprintIdRef.current = blueprint.blueprintId;
		workoutStartTimeRef.current = new Date();
		formTypeRef.current = "workout";
		setWorkoutTitle(blueprint.name);
		console.log("blueprint", blueprint);
		setWorkoutNotes(blueprint.note);
		setWorkoutExercises(blueprint.exercises);
	};

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
		blueprintStart,
	};
};
