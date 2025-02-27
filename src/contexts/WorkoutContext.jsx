// contexts/WorkoutContext.jsx
import React, { createContext, useState, useContext, useEffect } from "react";
import storage from "../utils/storage";

const WorkoutContext = createContext();

export const WorkoutProvider = ({ children }) => {
	const [activeWorkout, setActiveWorkout] = useState(null);
	const [workoutHistory, setWorkoutHistory] = useState([]);
	const [workoutTimer, setWorkoutTimer] = useState(0);
	const [isWorkoutActive, setIsWorkoutActive] = useState(false);

	// Load workout history on mount
	useEffect(() => {
		loadWorkoutHistory();
	}, []);

	const loadWorkoutHistory = async () => {
		try {
			const storedWorkouts = storage.getString("workouts");
			if (storedWorkouts) {
				setWorkoutHistory(JSON.parse(storedWorkouts));
			}
		} catch (error) {
			console.error("Error loading workout history:", error);
		}
	};

	const startWorkout = () => {
		setActiveWorkout({
			id: Date.now(),
			startTime: new Date().toISOString(),
			exercises: [],
		});
		setIsWorkoutActive(true);
		setWorkoutTimer(0);
	};

	const addExercise = (exercise) => {
		if (!exercise || !activeWorkout) return;

		setActiveWorkout((prev) => ({
			...prev,
			exercises: [...prev.exercises, { name: exercise, sets: [] }],
		}));
	};

	const updateExercise = (exerciseName, sets) => {
		if (!activeWorkout) return;

		setActiveWorkout((prev) => ({
			...prev,
			exercises: prev.exercises.map((ex) =>
				ex.name === exerciseName ? { ...ex, sets } : ex
			),
		}));
	};

	const saveWorkout = async () => {
		if (!activeWorkout) return;

		try {
			const completedWorkout = {
				...activeWorkout,
				endTime: new Date().toISOString(),
				duration: workoutTimer,
			};

			const updatedHistory = [...workoutHistory, completedWorkout];
			setWorkoutHistory(updatedHistory);

			storage.set("workouts", JSON.stringify(updatedHistory));

			// Reset active workout
			setActiveWorkout(null);
			setIsWorkoutActive(false);

			return completedWorkout;
		} catch (error) {
			console.error("Error saving workout:", error);
			return null;
		}
	};

	const cancelWorkout = () => {
		setActiveWorkout(null);
		setIsWorkoutActive(false);
	};

	return (
		<WorkoutContext.Provider
			value={{
				activeWorkout,
				workoutHistory,
				isWorkoutActive,
				workoutTimer,
				setWorkoutTimer,
				startWorkout,
				addExercise,
				updateExercise,
				saveWorkout,
				cancelWorkout,
				loadWorkoutHistory,
			}}
		>
			{children}
		</WorkoutContext.Provider>
	);
};

export const useWorkout = () => useContext(WorkoutContext);
