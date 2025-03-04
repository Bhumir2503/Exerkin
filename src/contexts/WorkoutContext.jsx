// contexts/WorkoutContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import uuid from "react-native-uuid";


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
	// }
	const [activeExercise, setActiveExercise] = useState([]);
	const [activeId, setActiveId] = useState(null);

	const newWorkoutStarted = () => {
		setActiveExercise([]);
		setActiveId(uuid.v4());
	}

	const workoutCompleted = (name) => {
		setWorkoutHistory((prevWorkouts) => [
			...prevWorkouts,
			{
				name: name,
				id: activeId,
				exercises: activeExercise,
				completedAt: new Date().toISOString(),
			},
		]);
		setActiveExercise([]);
		setActiveId(null);
		console.log(workoutHistory);
	}

	const workoutCancelled = () => {
		setActiveExercise([]);
		setActiveId(null);
		console.log(workoutHistory);
	}

	const addExerciseToActiveWorkout = async (exercise) => {
		setActiveExercise((prevExercises) => [...prevExercises, exercise]);
		// TODO: add to cache and firebase 
	}

	const removeExerciseFromActiveWorkout = (exerciseId) => {
		setActiveExercise((prevExercises) =>
			prevExercises.filter((exercise) => exercise.id !== exerciseId)
		);
	}

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
	}

	const removeSetFromExercise = (exerciseId, setIndex) => {
		setActiveExercise((prevExercises) =>
			prevExercises.map((exercise) =>
				exercise.id === exerciseId
					? {
							...exercise,
							sets: exercise.sets.filter((_, index) => index !== setIndex),
					  }
					: exercise
			)
		);
	}

	const clearWorkoutHistory = () => {
		setWorkoutHistory([]);
	}







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
