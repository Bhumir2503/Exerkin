import { createContext, useContext, useState, useCallback } from "react";

const WorkoutExercisesContext = createContext();

export const WorkoutExercisesProvider = ({ children }) => {
	const [workoutExercises, setWorkoutExercises] = useState([]);

	const addExercise = useCallback((exercise) => {
		setWorkoutExercises((prev) => [...prev, { ...exercise }]);
	}, []);

	const updateExercise = useCallback((exerciseId, updater) => {
		setWorkoutExercises((prev) =>
			prev.map((ex) => (ex.exerciseId === exerciseId ? updater(ex) : ex))
		);
	}, []);

	const removeExercise = useCallback((exerciseId) => {
		setWorkoutExercises((prev) =>
			prev.filter((ex) => ex.exerciseId !== exerciseId)
		);
	}, []);

	const clearExercises = useCallback(() => {
		setWorkoutExercises([]);
	}, []);

	const addSetToExercise = useCallback((exerciseId, set) => {
		setWorkoutExercises((prev) =>
			prev.map((ex) =>
				ex.exerciseId === exerciseId
					? { ...ex, sets: [...ex.sets, set] }
					: ex
			)
		);
	}, []);

	const updateSetInExercise = useCallback((exerciseId, setIndex, set) => {
		setWorkoutExercises((prev) =>
			prev.map((ex) =>
				ex.exerciseId === exerciseId
					? {
							...ex,
							sets: ex.sets.map((prevSet, index) =>
								index === setIndex ? set : prevSet
							),
					  }
					: ex
			)
		);
	}, []);

	const removeSetFromExercise = useCallback((exerciseId, setId) => {
		setWorkoutExercises((prev) =>
			prev.map((ex) =>
				ex.exerciseId === exerciseId
					? {
							...ex,
							sets: ex.sets.filter((set) => set.setId !== setId),
					  }
					: ex
			)
		);
	}, []);

	const updateUnitSystemInExercise = useCallback((exerciseId, unitSystem) => {
		setWorkoutExercises((prev) =>
			prev.map((ex) =>
				ex.exerciseId === exerciseId ? { ...ex, unitSystem } : ex
			)
		);
	}, []);

	return (
		<WorkoutExercisesContext.Provider
			value={{
				workoutExercises,
				setWorkoutExercises,
				addExercise,
				updateExercise,
				removeExercise,
				clearExercises,
				addSetToExercise,
				updateSetInExercise,
				removeSetFromExercise,
				updateUnitSystemInExercise,
			}}
		>
			{children}
		</WorkoutExercisesContext.Provider>
	);
};

export const useWorkoutExercises = () => useContext(WorkoutExercisesContext);
