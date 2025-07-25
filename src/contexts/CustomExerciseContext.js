import { createContext, useContext, useState, useEffect } from "react";
import { listenToCustomExerciseChanges } from "../services/firestore/firestoreCustomExerciseServices";
import { useUser } from "./UserContext";

import { saveCustomExerciseToFirestore } from "../services/firestore/firestoreCustomExerciseServices";

const CustomExerciseContext = createContext();

export const CustomExerciseProvider = ({ children }) => {
	const [customExercises, setCustomExercises] = useState("");
	const { userId } = useUser();

	useEffect(() => {
		if (!userId) return;

		const unsubscribe = listenToCustomExerciseChanges(
			userId,
			setCustomExercises
		);
		return () => {
			unsubscribe(); // Unsubscribe from custom exercise changes
		};
	}, [userId]);

	const addCustomExercise = (exercise) => {
		console.log("Adding custom exercise:", exercise);
		exercise.userId = userId; // Ensure userId is set
		saveCustomExerciseToFirestore(exercise)
			.then(() => {
				console.log(
					"Custom exercise saved successfully:",
					exercise.name
				);
			})
			.catch((error) => {
				console.error("Error saving custom exercise:", error);
			});
	};

	return (
		<CustomExerciseContext.Provider
			value={{ customExercises, setCustomExercises, addCustomExercise }}
		>
			{children}
		</CustomExerciseContext.Provider>
	);
};

export const useCustomExercises = () => useContext(CustomExerciseContext);
export default CustomExerciseContext;
