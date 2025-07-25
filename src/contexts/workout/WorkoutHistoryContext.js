// WorkoutHistoryContext.js
import { createContext, useContext, useState, useEffect } from "react";
import {
	listenToWorkoutChanges,
	deleteWorkoutFromFirestore,
} from "../../services/firestore/firestoreWorkoutServices";
import { useUser } from "../UserContext";

const WorkoutHistoryContext = createContext();

export const WorkoutHistoryProvider = ({ children }) => {
	const [workoutHistory, setWorkoutHistory] = useState([]);
	const { userId } = useUser();

	useEffect(() => {
		if (!userId) return;
		// Subscribe to changes in workout data using Realm
		const unsubscribe = listenToWorkoutChanges(userId, setWorkoutHistory);

		return () => {
			unsubscribe(); // Unsubscribe from workout data changes
		};
	}, [userId]);

	const removeWorkoutFromHistory = (workout) => {
		let image = false;
		if (workout.imageURL) {
			// Optionally, handle image deletion if needed
			// deleteWorkoutImage(workout.imageURL);
			image = true;
		}
		deleteWorkoutFromFirestore(workout.workoutId, image);
	};

	return (
		<WorkoutHistoryContext.Provider
			value={{
				workoutHistory,
				setWorkoutHistory,
				removeWorkoutFromHistory,
			}}
		>
			{children}
		</WorkoutHistoryContext.Provider>
	);
};

export const useWorkoutHistory = () => useContext(WorkoutHistoryContext);
