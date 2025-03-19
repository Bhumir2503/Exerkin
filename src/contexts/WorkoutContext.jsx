// contexts/WorkoutContext.jsx
import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
	useMemo,
	useCallback,
} from "react";
import {
	addWorkoutToHistoryCache,
	getWorkoutHistoryCache,
	resetWorkoutHistoryCache,
} from "../cache/workoutHistoryCache";
import {
	addWorkoutToTemplateCache,
	getWorkoutTemplateCache,
	resetWorkoutTemplateCache,
} from "../cache/templateCache";
import uuid from "react-native-uuid";
import firestore from "@react-native-firebase/firestore";
import {
	addWorkoutToFirestore,
	batchDeleteWorkoutFromFirestore,
} from "../utils/WorkoutFirestoreServices";
import { useUser } from "./UserContext";
import { formatTime } from "../components/WorkoutPage/WorkoutTimer";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
	const { user } = useUser();

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

	// retrieve workout history from cache
	useEffect(() => {
		const getWorkoutHistory = async () => {
			console.log("Getting workout history");
			const history = await getWorkoutHistoryCache();
			if (history.length === 0) {
				console.log("No workout history found");
				return;
			} else {
				console.log("Workout history found");
				setWorkoutHistory(history.workout);
			}
		};

		const getWorkoutTemplate = async () => {
			console.log("Getting workout template");
			const template = await getWorkoutTemplateCache();
			if (template.length === 0) {
				console.log("No workout template found");
				return;
			} else {
				console.log("Workout template found");
				setWorkoutTemplate(template);
			}
		};

		getWorkoutHistory();
		getWorkoutTemplate();
	}, []);

	// Using useCallback to memoize functions that modify exercises
	const workoutStarted = useCallback(() => {
		setWorkoutExercises([]);
		WorkoutStartTime.current = firestore.Timestamp.now();
		WorkoutId.current = uuid.v4();
	}, []);

	const workoutCompleted = useCallback(() => {
		// loop through activeExercise to check for empty sets and remove them
		const WorkoutExerciseFiltered = workoutExercises.map((exercise) => {
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

		// loops through activeExercise to check for empty exercises and remove them
		const WorkoutExerciseChecked = WorkoutExerciseFiltered.filter(
			(exercise) => exercise.sets.length > 0
		);

		// if no exercises are added, return
		if (WorkoutExerciseChecked.length === 0) {
			console.log("No exercises added");
			setWorkoutExercises([]);
			return;
		}

		const WorkoutFinishTime = firestore.Timestamp.now();
		if (WorkoutTitle.current === "") {
			WorkoutTitle.current = "Untitled Workout";
		}

		const workout = {
			userId: user.uid,
			name: WorkoutTitle.current,
			id: WorkoutId.current,
			exercises: WorkoutExerciseChecked,
			startedAt: WorkoutStartTime.current,
			completedAt: WorkoutFinishTime,
			duration: formatTime(WorkoutTimer.current),
			notes: WorkoutNote.current,
		};

		setWorkoutHistory((prevHistory) => [...prevHistory, workout]);
		// Add workout to firestore
		addWorkoutToFirestore(workout);
		// Cache the workout
		addWorkoutToHistoryCache(workout);

		// Reset useStates
		workoutCancelled();
	}, [workoutExercises, user]);

	const workoutCancelled = useCallback(() => {
		// Reset useStates
		setWorkoutExercises([]);
		WorkoutId.current = null;
		WorkoutTitle.current = "";
		WorkoutNote.current = "";
		WorkoutStartTime.current = null;
		WorkoutTimer.current = 0;
	}, []);

	// Add exercise to active workout
	const addExerciseToWorkout = useCallback(async (exercise) => {
		setWorkoutExercises((prevExercises) => [...prevExercises, exercise]);
	}, []);

	// Remove exercise from active workout
	const removeExerciseFromWorkout = useCallback((exerciseId) => {
		setWorkoutExercises((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseId)
		);
	}, []);

	// Add set to exercise in active workout - optimized
	const addSetToExercise = useCallback((exerciseId, set) => {
		setWorkoutExercises((prevExercises) => {
			return prevExercises.map((exercise) => {
				if (exercise.id === exerciseId) {
					return {
						...exercise,
						sets: [...exercise.sets, set],
					};
				}
				return exercise;
			});
		});
	}, []);

	// Update set in exercise in active workout - optimized
	const updateSetInExercise = useCallback((exerciseId, setIndex, set) => {
		setWorkoutExercises((prevExercises) => {
			return prevExercises.map((exercise) => {
				if (exercise.id === exerciseId) {
					const updatedSets = [...exercise.sets];
					updatedSets[setIndex] = set;
					return {
						...exercise,
						sets: updatedSets,
					};
				}
				return exercise;
			});
		});
	}, []);

	// Remove set from exercise in active workout - optimized
	const removeSetFromExercise = useCallback((exerciseId, setIndex) => {
		setWorkoutExercises((prevExercises) => {
			return prevExercises.map((exercise) => {
				if (exercise.id === exerciseId) {
					return {
						...exercise,
						sets: exercise.sets.filter(
							(_, index) => index !== setIndex
						),
					};
				}
				return exercise;
			});
		});
	}, []);

	// Clear workout history
	const clearWorkoutHistory = useCallback(() => {
		const deleteWorkoutId = workoutHistory.map((workout) => workout.id);
		setWorkoutHistory([]);
		batchDeleteWorkoutFromFirestore(deleteWorkoutId);
		resetWorkoutHistoryCache();
	}, [workoutHistory]);

	// Create a memoized value object for the context to prevent unnecessary re-renders
	const contextValue = useMemo(
		() => ({
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

			clearWorkoutHistory,
		}),
		[
			workoutExercises,
			workoutHistory,
			workoutStarted,
			workoutCompleted,
			workoutCancelled,
			addSetToExercise,
			updateSetInExercise,
			removeSetFromExercise,
			addExerciseToWorkout,
			removeExerciseFromWorkout,
			clearWorkoutHistory,
		]
	);

	return (
		<WorkoutContext.Provider value={contextValue}>
			{children}
		</WorkoutContext.Provider>
	);
};

// This custom hook will allow individual exercise components to subscribe only to their specific exercise
export const useExercise = (exerciseId) => {
	const context = useContext(WorkoutContext);

	// Get only the specific exercise from the workoutExercises array
	const exercise = useMemo(() => {
		return context.workoutExercises.find((ex) => ex.id === exerciseId);
	}, [context.workoutExercises, exerciseId]);

	// Return only what's needed for this specific exercise
	return {
		exercise,
		addSetToExercise: context.addSetToExercise,
		updateSetInExercise: context.updateSetInExercise,
		removeSetFromExercise: context.removeSetFromExercise,
	};
};

// For components that need the full context
export const useWorkout = () => useContext(WorkoutContext);
