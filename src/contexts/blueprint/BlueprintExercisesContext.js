import { createContext, useContext, useState, useCallback } from "react";

const BlueprintExercisesContext = createContext();

export const BlueprintExercisesProvider = ({ children }) => {
	const [blueprintExercises, setBlueprintExercises] = useState([]);
	const addExerciseToBlueprint = useCallback((exercise) => {
		setBlueprintExercises((prev) => [...prev, { ...exercise }]);
	}, []);
	const updateExercise = useCallback((exerciseId, updater) => {
		setBlueprintExercises((prev) =>
			prev.map((ex) => (ex.exerciseId === exerciseId ? updater(ex) : ex))
		);
	}, []);
	const removeExercise = useCallback((exerciseId) => {
		setBlueprintExercises((prev) =>
			prev.filter((ex) => ex.exerciseId !== exerciseId)
		);
	}, []);

	const clearExercises = useCallback(() => {
		setBlueprintExercises([]);
	}, []);

	const addSetToExercise = useCallback((exerciseId, set) => {
		setBlueprintExercises((prev) =>
			prev.map((ex) =>
				ex.exerciseId === exerciseId
					? { ...ex, sets: [...ex.sets, set] }
					: ex
			)
		);
	}, []);

	const updateSetInExercise = useCallback((exerciseId, setIndex, set) => {
		setBlueprintExercises((prev) =>
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

	const removeSetFromExercise = useCallback((exerciseId, setIndex) => {
		setBlueprintExercises((prev) =>
			prev.map((ex) =>
				ex.exerciseId === exerciseId
					? {
							...ex,
							sets: ex.sets.filter(
								(_, index) => index !== setIndex
							),
					  }
					: ex
			)
		);
	}, []);

	return (
		<BlueprintExercisesContext.Provider value={{
            blueprintExercises,
            setBlueprintExercises,
            addExerciseToBlueprint,
            updateExercise,
            removeExercise,
            clearExercises,
            addSetToExercise,
            updateSetInExercise,
            removeSetFromExercise,
        }}>
			{children}
		</BlueprintExercisesContext.Provider>
	);
};

export const useBlueprintExercises = () => {
	const context = useContext(BlueprintExercisesContext);
	if (!context) {
		throw new Error(
			"useBlueprintExercises must be used within a BlueprintExercisesProvider"
		);
	}
	return context;
};
