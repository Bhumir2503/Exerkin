// contexts/WorkoutContext.jsx
import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
	useMemo,
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

// Create separate contexts for state, functions, and refs
const WorkoutStateContext = createContext();
const WorkoutFunctionsContext = createContext();
const WorkoutRefsContext = createContext();

// Legacy context for backward compatibility
const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
	const { user } = useUser();

	// REF SECTION
	//Workout Section States
	const ModalType = useRef("WorkoutModal");
	const WorkoutId = useRef(null);
	const WorkoutExerciseRef = useRef([]);
	const WorkoutTitle = useRef("");
	const WorkoutNote = useRef("");
	const WorkoutStartTime = useRef(null);
	const WorkoutTimer = useRef(0);

	// STATE SECTION
	const [workoutHistory, setWorkoutHistory] = useState([]);
	const [workoutExercises, setWorkoutExercises] = useState([]);

	// retrieve workout history from cache
	useEffect(() => {
		const getWorkoutHistory = async () => {
			console.log("Getting workout history");
			const history = await getWorkoutHistoryCache();
			console.log(history);
			if (history.workout.length === 0) {
				console.log("No workout history found");
				return;
			} else {
				console.log("Workout history found");
				setWorkoutHistory(history.workout);
			}
		};
		getWorkoutHistory();
	}, []);

	// FUNCTIONS SECTION
	const workoutStarted = () => {
		setWorkoutExercises([]);
		WorkoutStartTime.current = firestore.Timestamp.now();
		WorkoutId.current = uuid.v4();
	};

	const workoutCompleted = () => {
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
			workoutCancelled();
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
			updatedAt: WorkoutFinishTime,
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

	// Add excercise to active workout
	const addExerciseToWorkout = async (exercise) => {
		setWorkoutExercises((prevExercises) => [...prevExercises, exercise]);
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

	// Clear workout history
	const clearWorkoutHistory = () => {
		const deleteWorkoutId = workoutHistory.map((workout) => workout.id);
		setWorkoutHistory([]);
		batchDeleteWorkoutFromFirestore(deleteWorkoutId);
		resetWorkoutHistoryCache();
	};

	// Memoize the context values to prevent unnecessary re-renders
	const stateValue = useMemo(
		() => ({
			workoutExercises,
			setWorkoutExercises,
			workoutHistory,
			setWorkoutHistory,
		}),
		[workoutExercises, workoutHistory]
	);

	const functionsValue = useMemo(
		() => ({
			workoutStarted,
			workoutCompleted,
			workoutCancelled,
			addSetToExercise,
			updateSetInExercise,
			removeSetFromExercise,
			addExerciseToWorkout,
			removeExerciseFromWorkout,
			clearWorkoutHistory,
		}),
		[workoutExercises, workoutHistory] // Dependencies needed for functions that use state
	);

	const refsValue = useMemo(
		() => ({
			ModalType,
			WorkoutId,
			WorkoutExerciseRef,
			WorkoutNote,
			WorkoutTitle,
			WorkoutStartTime,
			WorkoutTimer,
		}),
		[] // Refs don't need dependencies as they don't change
	);

	// Create a complete context value for backward compatibility
	const legacyContextValue = useMemo(
		() => ({
			...stateValue,
			...functionsValue,
			...refsValue,
		}),
		[stateValue, functionsValue, refsValue]
	);

	return (
		<WorkoutRefsContext.Provider value={refsValue}>
			<WorkoutFunctionsContext.Provider value={functionsValue}>
				<WorkoutStateContext.Provider value={stateValue}>
					<WorkoutContext.Provider value={legacyContextValue}>
						{children}
					</WorkoutContext.Provider>
				</WorkoutStateContext.Provider>
			</WorkoutFunctionsContext.Provider>
		</WorkoutRefsContext.Provider>
	);
};

// New hooks for accessing specific contexts
export const useWorkoutState = () => useContext(WorkoutStateContext);
export const useWorkoutFunctions = () => useContext(WorkoutFunctionsContext);
export const useWorkoutRefs = () => useContext(WorkoutRefsContext);

// Legacy hook for backward compatibility
export const useWorkout = () => useContext(WorkoutContext);
