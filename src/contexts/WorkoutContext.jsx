import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
	useCallback,
	useMemo,
} from "react";

import uuid from "react-native-uuid";

import { useRealm } from "./RealmProvider";
import {
	getWorkouts,
	addWorkout,
	deleteWorkout,
	listenToWorkoutChanges,
	listenToDeletedWorkoutChanges,
	editWorkout,
} from "../services/functions/workoutFunctions";

import { useUser } from "./UserContext";

import { buildWorkoutObject } from "../services/helpers/objectBuilder";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
	const { user } = useUser();
	const realm = useRealm();

	// Workout state
	const [workoutHistory, setWorkoutHistory] = useState([]);
	const [workoutExercises, setWorkoutExercises] = useState([]);
	const [isLoading, setIsLoading] = useState(false);
	const [error, setError] = useState(null);

	// Workout refs (don't need re-renders)
	const workoutId = useRef(null);
	const workoutTitle = useRef("");
	const workoutNotes = useRef("");
	const workoutStartTime = useRef(null);
	const workoutTimer = useRef(0);
	const imageURL = useRef(null);
	const unitSystem = useRef(user?.unitSystem || "imperial");
	const templateId = useRef(null);
	const isTemplate = useRef(false);

	// Load initial workout data
	// useEffect(() => {
	// 	const loadWorkouts = async () => {
	// 		if (!user) return;

	// 		try {
	// 			setIsLoading(true);
	// 			setError(null);
	// 			const userWorkouts = await getWorkouts(realm, user.uid);
	// 			setWorkoutHistory(userWorkouts);
	// 		} catch (err) {
	// 			console.error("Failed to load workouts:", err);
	// 			setError("Failed to load your workout history");
	// 		} finally {
	// 			setIsLoading(false);
	// 		}
	// 	};

	// 	loadWorkouts();
	// }, [user, realm]);

	// // Subscribe to workout changes
	// useEffect(() => {
	// 	if (!user) return;

	// 	const handleWorkoutUpdate = async () => {
	// 		try {
	// 			const updatedWorkouts = await getWorkouts(realm, user.uid);
	// 			setWorkoutHistory(updatedWorkouts);
	// 		} catch (err) {
	// 			console.error("Error updating workouts:", err);
	// 		}
	// 	};

	// 	// Setup subscriptions
	// 	const unsubscribeChanges = listenToWorkoutChanges(
	// 		realm,
	// 		user.uid,
	// 		handleWorkoutUpdate
	// 	);

	// 	const unsubscribeDeletes = listenToDeletedWorkoutChanges(
	// 		realm,
	// 		user.uid,
	// 		handleWorkoutUpdate
	// 	);

	// 	// Cleanup subscriptions
	// 	return () => {
	// 		unsubscribeChanges();
	// 		unsubscribeDeletes();
	// 	};
	// }, [user, realm]);

	// Workout session management
	const workoutStarted = useCallback(() => {
		setWorkoutExercises([]);
		workoutStartTime.current = new Date();
		workoutId.current = uuid.v4();
	}, []);

	const workoutEditStarted = useCallback((workout) => {
		// Set the workoutId to the workoutId of the workout being edited
		workoutId.current = workout.workoutId;
		workoutTitle.current = workout.name;
		workoutNotes.current = workout.notes;
		workoutStartTime.current = workout.startedAt;
		templateId.current = workout.templateId;
		isTemplate.current = workout.isTemplate;
		imageURL.current = workout.imageURL;
		unitSystem.current = workout.unitSystem;
		workoutTimer.current = workout.timer;
		setWorkoutExercises(workout.exercises);
	}, []);

	const resetWorkoutState = useCallback(() => {
		setWorkoutExercises([]);
		workoutId.current = null;
		workoutTitle.current = "";
		workoutNotes.current = "";
		workoutStartTime.current = null;
		workoutTimer.current = 0;
		templateId.current = null;
		isTemplate.current = false;
		imageURL.current = null;
		unitSystem.current = user?.unitSystem || "imperial";
	}, [user?.unitSystem]);

	const workoutCancelled = useCallback(() => {
		resetWorkoutState();
	}, [resetWorkoutState]);

	// Save workout to database
	const saveWorkout = useCallback(async () => {
		try {
			setIsLoading(true);
			setError(null);

			const workout = buildWorkoutObject(
				workoutId.current,
				templateId.current,
				user.uid,
				workoutTitle.current,
				workoutNotes.current,
				isTemplate.current,
				imageURL.current,
				unitSystem.current,
				workoutExercises,
				workoutStartTime.current,
				workoutTimer.current,
				"synced"
			);

			return workout;
		} catch (err) {
			console.error("Error preparing workout:", err);
			setError("Failed to save workout");
			throw err;
		} finally {
			setIsLoading(false);
		}
	}, [user?.uid, workoutExercises]);

	// Complete a workout
	const workoutCompleted = useCallback(async () => {
		try {
			const workout = await saveWorkout();
			await addWorkout(realm, workout);
			const updatedWorkouts = await getWorkouts(realm, user.uid);
			setWorkoutHistory(updatedWorkouts);
			resetWorkoutState();
		} catch (err) {
			console.error("Error completing workout:", err);
			setError("Failed to save your workout");
		}
	}, [realm, user?.uid, saveWorkout, resetWorkoutState]);

	// Complete an edited workout
	const workoutEditCompleted = useCallback(async () => {
		try {
			const workout = await saveWorkout();
			await editWorkout(realm, workout);
			const updatedWorkouts = await getWorkouts(realm, user.uid);
			setWorkoutHistory(updatedWorkouts);
			resetWorkoutState();
		} catch (err) {
			console.error("Error saving edited workout:", err);
			setError("Failed to save your workout changes");
		}
	}, [realm, user?.uid, saveWorkout, resetWorkoutState]);


	
	// History management
	const removeWorkoutFromHistory = useCallback(
		async (workout) => {
			try {
				await deleteWorkout(realm, workout.workoutId);
				const updatedWorkouts = await getWorkouts(realm, user.uid);
				setWorkoutHistory(updatedWorkouts);
			} catch (err) {
				console.error("Error deleting workout:", err);
				setError("Failed to delete workout");
			}
		},
		[realm, user?.uid]
	);

	// Memoize the context value to prevent unnecessary renders
	const contextValue = useMemo(
		() => ({


			// Clear error
			clearError: () => setError(null),
		}),
		[

		]
	);

	return (
		<WorkoutContext.Provider value={contextValue}>
			{children}
		</WorkoutContext.Provider>
	);
};

// Custom hook for consuming the context
export const useWorkout = () => {
	const context = useContext(WorkoutContext);
	if (context === undefined) {
		throw new Error("useWorkout must be used within a WorkoutProvider");
	}
	return context;
};
