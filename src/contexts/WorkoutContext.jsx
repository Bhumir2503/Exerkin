// contexts/WorkoutContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import {
	addWorkoutToHistoryCache,
	getWorkoutHistoryCache,
	resetWorkoutHistoryCache,
} from "../cache/workoutHistoryCache";
import {
	addWorkoutToTemplateCache,
	getWorkoutTemplateCache,
} from "../cache/templateCache";
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
	// template for workout
	const [workoutTemplate, setWorkoutTemplate] = useState([]);

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
	const [activeTemplateExercises, setActiveTemplateExercises] = useState([]);
	const [activeId, setActiveId] = useState(null);
	const [startTime, setStartTime] = useState(null);

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

	const newWorkoutStarted = () => {
		setStartTime(firestore.Timestamp.now());
		setActiveExercise([]);
		setActiveId(uuid.v4());
	};

	const templateCompleted = (name) => {
		const activeTemplateExercisesFiltered = activeTemplateExercises.map(
			(exercise) => {
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
			}
		);

		const activeTemplateExercisesChecked =
			activeTemplateExercisesFiltered.filter(
				(exercise) => exercise.sets.length > 0
			);

		if (activeTemplateExercisesChecked.length === 0) {
			console.log("No exercises added");
			setActiveTemplateExercises([]);
			setActiveId(null);
			return;
		}

		const template = {
			userId: user.uid,
			name: name,
			id: activeId,
			exercises: activeTemplateExercisesChecked,
			date: firestore.Timestamp.now(),
		};

		// state
		setWorkoutTemplate((prevTemplate) => [...prevTemplate, template]);
		// cache
		addWorkoutToTemplateCache(template);

		console.log(workoutTemplate);

		setActiveTemplateExercises([]);
		setActiveId(null);
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
			startedAt: startTime,
			completedAt: firestore.Timestamp.now(),
			duration: formatTime(time),
			date: firestore.Timestamp.now(), // TODO: change to start time
		};

		setWorkoutHistory((prevHistory) => [...prevHistory, workout]);
		// Add workout to firestore
		addWorkoutToFirestore(workout);
		// Cache the workout
		addWorkoutToHistoryCache(workout);

		// Reset useStates
		setActiveExercise([]);
		setActiveId(null);
	};

	const workoutCancelled = () => {
		// Reset useStates
		setActiveExercise([]);
		setActiveId(null);
	};

	// Add excercise to active workout
	const addExerciseToActiveWorkout = async (exercise) => {
		setActiveExercise((prevExercises) => [...prevExercises, exercise]);
		// TODO: add to cache so that it can be retrieved if the app crashes or is closed and continues the workout
	};

	const addExerciseToActiveTemplate = (exercise) => {
		setActiveTemplateExercises((prevExercises) => [
			...prevExercises,
			exercise,
		]);
	};

	// Remove exercise from active workout
	const removeExerciseFromActiveWorkout = (exerciseId) => {
		setActiveExercise((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseId)
		);
	};

	// Add set to exercise in active workout
	const addSetToExercise = (exerciseId, set, type) => {
		if (type === "template") {
			setActiveTemplateExercises((prevExercises) =>
				prevExercises.map((exercise) =>
					exercise.id === exerciseId
						? { ...exercise, sets: [...exercise.sets, set] }
						: exercise
				)
			);
		} else if (type === "workout") {
			setActiveExercise((prevExercises) =>
				prevExercises.map((exercise) =>
					exercise.id === exerciseId
						? { ...exercise, sets: [...exercise.sets, set] }
						: exercise
				)
			);
		}
	};

	// Update set in exercise in active workout
	// setIndex is the index of the set in the exercise.sets array
	const updateSetInExercise = (exerciseId, setIndex, set, type) => {
		if (type === "template") {
			setActiveTemplateExercises((prevExercises) =>
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
		} else if (type === "workout") {
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
		}
	};

	// Remove set from exercise in active workout
	// setIndex is the index of the set in the exercise.sets array
	const removeSetFromExercise = (exerciseId, setIndex, type) => {
		if (type === "template") {
			setActiveTemplateExercises((prevExercises) =>
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
		} else if (type === "workout") {
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
		}
	};

	// Parameters: template object
	// Add template to firestore, cache and state
	const addTemplate = (template) => {};

	// Parameters: templateId
	// Remove template from firestore, cache and state
	const removeTemplate = (templateId) => {};

	// Parameters: templateId
	// Update template in firestore, cache and state
	const updateTemplate = (templateId) => {};

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
				workoutHistory,
				setWorkoutHistory,
				workoutTemplate,
				setWorkoutTemplate,
				activeExercise,
				setActiveExercise,
				activeTemplateExercises,
				setActiveTemplateExercises,
				activeId,
				newWorkoutStarted,
				templateCompleted,
				workoutCompleted,
				workoutCancelled,
				setActiveId,
				addExerciseToActiveWorkout,
				addExerciseToActiveTemplate,
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
