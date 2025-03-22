// contexts/WorkoutContext.jsx
import React, {
	createContext,
	useState,
	useContext,
	useEffect,
	useRef,
} from "react";
import {
	resetWorkoutHistoryCache,
} from "../cache/workoutHistoryCache";


import uuid from "react-native-uuid";
import firestore from "@react-native-firebase/firestore";

import {
	batchDeleteWorkoutFromFirestore,
} from "../firestore/FirestoreWorkoutServices";

import {
	resyncWorkouts,
	retrieveWorkoutHistory,
	addWorkoutToHistory,
	deleteWorkoutFromHistory,
} from "../utils/WorkoutFunctions";

import { useUser } from "./UserContext";
import { formatTime } from "../components/WorkoutPage/WorkoutTimer";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
	const [init, setInit] = useState(false);
	const { user } = useUser();

	//Workout Section States
	const ModalType = useRef("WorkoutModal");

	//  Workout History, Workout Exercises, Workout Notes, Workout Title, Workout Start Time, Workout Date
	const WorkoutId = useRef(null);
	const [workoutHistory, setWorkoutHistory] = useState([]);
	const [workoutExercises, setWorkoutExercises] = useState([]);
	const WorkoutExerciseRef = useRef([]);
	const WorkoutTitle = useRef("");
	const WorkoutNote = useRef("");
	const WorkoutStartTime = useRef(null);
	const WorkoutTimer = useRef(0);

	// retrieve workout history from cache
	useEffect(() => {
		if (!init) {
			setInit(true);
			return;
		}

		if (!user) return;

		const retrievedWorkout = async () => {
			const workoutRetrieved = await retrieveWorkoutHistory(user.uid);
			setWorkoutHistory(workoutRetrieved.workouts);
		};

		// getWorkoutHistory();
		retrievedWorkout();
	}, [init, user]);

	const setWorkoutData = (data) => {
		setWorkoutExercises(data);
	};

	const workoutStarted = () => {
		setWorkoutExercises([]);
		WorkoutStartTime.current = firestore.Timestamp.now();
		WorkoutId.current = uuid.v4();
	};

	const workoutCompleted = async () => {
		// check if there is resync workout cache
		await resyncWorkouts();

		// loop through activeExercise to check for empty sets and remove them
		// TODO: remove this filter and add a check in the UI to prevent adding empty sets
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

		// TODO: remove this filter and add a check in the UI to prevent adding exercises without sets
		const WorkoutExerciseChecked = WorkoutExerciseFiltered.filter(
			(exercise) => exercise.sets.length > 0
		);

		// TODO: add a check in the UI to prevent adding empty exercises
		if (WorkoutExerciseChecked.length === 0) {
			console.log("No exercises added");
			workoutCancelled();
			return;
		}

		// Set the workout title if it is empty
		if (WorkoutTitle.current === "") {
			WorkoutTitle.current = "Untitled Workout";
		}

		// Set the workout finish time
		const WorkoutFinishTime = firestore.Timestamp.now();

		// Create workout object
		const workout = {
			userId: user.uid,
			name: WorkoutTitle.current,
			id: WorkoutId.current,
			exercises: WorkoutExerciseChecked,
			startedAt: WorkoutStartTime.current,
			completedAt: WorkoutFinishTime,
			updatedAt: WorkoutFinishTime,
			uploadedAt: WorkoutFinishTime,
			duration: formatTime(WorkoutTimer.current),
			notes: WorkoutNote.current,
		};

		// Add workout to workout history
		setWorkoutHistory((prevHistory) => [...prevHistory, workout]);

		// Goes to WOrkoutFunctions.js to add workout to cache and firestore
		addWorkoutToHistory(workout)

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

	const removeWorkoutFromHistory = (workout) => {
		
		const newWorkoutHistory = workoutHistory.filter(
			(workoutcheck) => workoutcheck.id !== workout.id
		);
		setWorkoutHistory(newWorkoutHistory);

		workout.deletedAt = firestore.Timestamp.now();
		deleteWorkoutFromHistory(workout);
	};

	// Clear workout history
	const clearWorkoutHistory = () => {
		const deleteWorkoutId = workoutHistory.map((workout) => workout.id);
		setWorkoutHistory([]);
		batchDeleteWorkoutFromFirestore(deleteWorkoutId);
		resetWorkoutHistoryCache();
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
				setWorkoutData,

				workoutExercises,
				setWorkoutExercises,
				workoutHistory,
				setWorkoutHistory,
				WorkoutExerciseRef,
				WorkoutId,
				WorkoutNote,
				WorkoutTitle,
				WorkoutStartTime,
				WorkoutTimer,
				addExerciseToWorkout,
				removeExerciseFromWorkout,

				removeWorkoutFromHistory,
				clearWorkoutHistory,
			}}
		>
			{children}
		</WorkoutContext.Provider>
	);
};

export const useWorkout = () => useContext(WorkoutContext);
