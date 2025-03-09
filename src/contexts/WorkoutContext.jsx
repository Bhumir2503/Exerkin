// contexts/WorkoutContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import {
	addWorkoutToHistoryCache,
	getWorkoutHistoryCache,
	resetWorkoutHistoryCache,
} from "../cache/workoutHistoryCache";
import uuid from "react-native-uuid";
import firestore from "@react-native-firebase/firestore";
import {
	getWorkoutsFromFirestore,
	addWorkoutToFirestore,
	batchDeleteWorkoutFromFirestore,
} from "../utils/WorkoutFirestoreServices";
import { useUser } from "./UserContext";
import { formatTime } from "../components/WorkoutPage/WorkoutTimer";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
	// workouts history state
	// should be an array of objects that is stored in cache or firebase
	// probably init if
	const [workoutHistory, setWorkoutHistory] = useState([]);

	// active workout state
	// activeExercise scheme
	// {
	// 	id: 1,
	// 	name: "Bench Press",
	// 	sets: [
	// 		{ reps: 10, weight: 100 },
	// 		{ reps: 8, weight: 110 },
	// 		{ reps: 6, weight: 120 },
	// 	],
	// 	rest: 60,
	// 	notes: "Felt good",
	// 	order: 1,
	// 	completed: false,
	// 	createdAt: "2023-10-01T12:00:00Z",
	// 	updatedAt: "2023-10-01T12:00:00Z",
	//  exercise: excercise object
	//  date: "2023-10-01T12:00:00Z",
	//  time: "00:00:00",
	// }
	const [activeExercise, setActiveExercise] = useState([]);
	const [activeId, setActiveId] = useState(null);

	const { user } = useUser();

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

		getWorkoutHistory();
	}, []);

	const newWorkoutStarted = () => {
		setActiveExercise([]);
		setActiveId(uuid.v4());
	};

	const workoutCompleted = (name, time) => {
		// loop through activeExercise to check for empty sets and remove them
		const activeExerciseFiltered = activeExercise.map((exercise) => {
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
		const activeExerciseChecked = activeExerciseFiltered.filter(
			(exercise) => exercise.sets.length > 0
		);

		// if no exercises are added, return
		if (activeExerciseChecked.length === 0) {
			console.log("No exercises added");
			setActiveExercise([]);
			setActiveId(null);
			return;
		}

		const workout = {
			userId: user.uid,
			name: name,
			id: activeId,
			exercises: activeExerciseChecked,
			completedAt: firestore.Timestamp.now(),
			time: formatTime(time),
			date: firestore.Timestamp.now(), // TODO: change to start time
		};

		setWorkoutHistory((prevHistory) => [...prevHistory, workout]);
		// Add workout to firestore
		addWorkoutToFirestore(workout);
		// Cache the workout
		addWorkoutToHistoryCache(workout);

		setActiveExercise([]);
		setActiveId(null);
	};

	const workoutCancelled = () => {
		setActiveExercise([]);
		setActiveId(null);
	};

	const addExerciseToActiveWorkout = async (exercise) => {
		setActiveExercise((prevExercises) => [...prevExercises, exercise]);
		// TODO: add to cache so that it can be retrieved if the app crashes or is closed and continues the workout
	};

	const removeExerciseFromActiveWorkout = (exerciseId) => {
		setActiveExercise((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseId)
		);
	};

	const addSetToExercise = (exerciseId, set) => {
		setActiveExercise((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.id === exerciseId
					? { ...exercise, sets: [...exercise.sets, set] }
					: exercise
			)
		);
	};

	const updateSetInExercise = (exerciseId, setIndex, set) => {
		setActiveExercise((prevExercises) =>
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

	const removeSetFromExercise = (exerciseId, setIndex) => {
		setActiveExercise((prevExercises) =>
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

	const clearWorkoutHistory = () => {
		const deleteWorkoutId = workoutHistory.map((workout) => workout.id);
		setWorkoutHistory([]);
		batchDeleteWorkoutFromFirestore(deleteWorkoutId);
		resetWorkoutHistoryCache();
	};

	return (
		<WorkoutContext.Provider
			value={{
				workoutHistory,
				setWorkoutHistory,
				activeExercise,
				setActiveExercise,
				activeId,
				newWorkoutStarted,
				workoutCompleted,
				workoutCancelled,
				setActiveId,
				addExerciseToActiveWorkout,
				removeExerciseFromActiveWorkout,
				addSetToExercise,
				updateSetInExercise,
				removeSetFromExercise,
				clearWorkoutHistory,
			}}
		>
			{children}
		</WorkoutContext.Provider>
	);
};

export const useWorkout = () => useContext(WorkoutContext);
