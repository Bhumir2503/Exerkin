import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
} from "react";

import uuid from "react-native-uuid";

import { useRealm } from "./RealmProvider";
import {
	syncPendingWorkoutsToFirestore,
	getWorkouts,
	addWorkout,
	deleteWorkout,
	listenToWorkoutChanges,
	listenToDeletedWorkoutChanges,
} from "../services/functions/workoutFunctions";

import { useUser } from "./UserContext";

import { buildWorkoutObject } from "../services/helpers/workoutHelperFunctions";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
	const { user } = useUser();
	const realm = useRealm();

	//Workout Section States
	const ModalType = useRef("WorkoutModal");

	//  Workout History, Workout Exercises, Workout Notes, Workout Title, Workout Start Time, Workout Date
	const WorkoutId = useRef(null);
	const [workoutHistory, setWorkoutHistory] = useState([]);
	const [workoutExercises, setWorkoutExercises] = useState([]);

	const WorkoutTitle = useRef("");
	const WorkoutNote = useRef("");
	const WorkoutStartTime = useRef(null);
	const WorkoutTimer = useRef(0);

	/*
	Effect hooks for managing workout data subscriptions and updates.
	*/

	// Effect hook to listen for changes in workout data
	useEffect(() => {
		if (!user) return;

		// Subscribe to changes in workout data using Realm
		const unsubscribe = listenToWorkoutChanges(
			realm,
			user.uid,
			async () => {
				const updatedWorkouts = await getWorkouts(realm, user.uid); // Fetch updated workouts from Realm
				setWorkoutHistory(updatedWorkouts); // Update local state with updated workout history
			}
		);

		return () => {
			unsubscribe(); // Unsubscribe from workout data changes
		};
	}, [user, realm]);

	// Effect hook to listen for changes in deleted workout data
	useEffect(() => {
		if (!user) return;

		// Subscribe to changes in deleted workout data using Realm
		const unsubscribe = listenToDeletedWorkoutChanges(
			realm,
			user.uid,
			async () => {
				const updatedWorkouts = await getWorkouts(realm, user.uid); // Fetch updated workouts from Realm
				setWorkoutHistory(updatedWorkouts); // Update local state with updated workout history
			}
		);

		return () => {
			unsubscribe(); // Unsubscribe from deleted workout data changes
		};
	}, [user, realm]);

	/*
	Functions related to managing active workouts, exercises, and workout history
	*/

	const workoutStarted = () => {
		setWorkoutExercises([]);
		WorkoutStartTime.current = new Date();
		WorkoutId.current = uuid.v4();
	};

	const workoutCancelled = () => {
		// Reset useStates
		setWorkoutExercises([]);
		WorkoutId.current = null;
		WorkoutTitle.current = "";
		WorkoutNote.current = "";
		WorkoutStartTime.current = null;
		WorkoutTimer.current = 0;
	};

	const workoutCompleted = async () => {
		// check if there is resync workout cache
		await syncPendingWorkoutsToFirestore(realm, user.uid);

		const workout = buildWorkoutObject(
			user.uid,
			WorkoutId.current,
			WorkoutTitle.current,
			WorkoutNote.current,
			workoutExercises,
			WorkoutStartTime.current,
			WorkoutTimer.current
		);

		
		addWorkout(realm, workout.userId, workout);

		// Reset useStates
		workoutCancelled();
	};

	// Add excercise to active workout
	const addExerciseToWorkout = async (exercise) => {
		setWorkoutExercises((prevExercises) => [
			...prevExercises,
			{ ...exercise, exerciseId: uuid.v4() },
		]);
		// TODO: add to cache so that it can be retrieved if the app crashes or is closed and continues the workout
	};

	// Remove exercise from active workout
	const removeExerciseFromWorkout = (exerciseId) => {
		setWorkoutExercises((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseId)
		);
	};

	// Add set to exercise in active workout
	const addSetToExercise = (exerciseId, set) => {
		setWorkoutExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.id === exerciseId
					? { ...exercise, sets: [...exercise.sets, set] }
					: exercise
			)
		);
	};

	// Update set in exercise in active workout
	// setIndex is the index of the set in the exercise.sets array
	const updateSetInExercise = (exerciseId, setIndex, set) => {
		setWorkoutExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.map((prevSet, index) =>
								index === setIndex ? set : prevSet
							),
					  }
					: exercise
			)
		);
	};

	// Remove set from exercise in active workout
	// setIndex is the index of the set in the exercise.sets array
	const removeSetFromExercise = (exerciseId, setIndex) => {
		setWorkoutExercises((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.filter(
								(_, index) => index !== setIndex
							),
					  }
					: exercise
			)
		);
	};

	const removeWorkoutFromHistory = (workout) => {
		const newWorkoutHistory = workoutHistory.filter(
			(workoutcheck) => workoutcheck.workoutId !== workout.workoutId
		);
		setWorkoutHistory(newWorkoutHistory);
		deleteWorkout(realm, workout.userId, workout.workoutId);
	};

	return (
		<WorkoutContext.Provider
			value={{
				ModalType,

				workoutStarted,
				workoutCompleted,
				workoutCancelled,
				addSetToExercise,
				updateSetInExercise,
				removeSetFromExercise,

				workoutExercises,
				setWorkoutExercises,
				workoutHistory,
				setWorkoutHistory,
				WorkoutId,
				WorkoutNote,
				WorkoutTitle,
				WorkoutStartTime,
				WorkoutTimer,
				addExerciseToWorkout,
				removeExerciseFromWorkout,

				removeWorkoutFromHistory,
			}}
		>
			{children}
		</WorkoutContext.Provider>
	);
};

export const useWorkout = () => useContext(WorkoutContext);
