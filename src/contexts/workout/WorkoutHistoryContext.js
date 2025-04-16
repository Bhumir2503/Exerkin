// WorkoutHistoryContext.js
import React, {
	createContext,
	useContext,
	useState,
	useCallback,
	useEffect,
} from "react";
import {
	getWorkouts,
	deleteWorkout,
} from "../../services/functions/workoutFunctions";
import { useRealm } from "../RealmProvider";
import { useUser } from "../UserContext";

const WorkoutHistoryContext = createContext();

export const WorkoutHistoryProvider = ({ children }) => {
	const [workoutHistory, setWorkoutHistory] = useState([]);
	const realm = useRealm();
	const { user } = useUser();

	const refreshWorkoutHistory = useCallback(async () => {
		if (!user) return;
		try {
			const workouts = await getWorkouts(realm, user.uid);
			setWorkoutHistory(workouts);
		} catch (error) {
			console.error("Failed to fetch workout history:", error);
		}
	}, [user, realm]);

	const removeWorkoutFromHistory = useCallback(
		async (workoutId) => {
			if (!user) return;
			try {
				await deleteWorkout(realm, workoutId);
				await refreshWorkoutHistory();
			} catch (error) {
				console.error("Failed to delete workout:", error);
			}
		},
		[realm, user, refreshWorkoutHistory]
	);

	// Automatically load on mount
	useEffect(() => {
		refreshWorkoutHistory();
	}, [refreshWorkoutHistory]);

	return (
		<WorkoutHistoryContext.Provider
			value={{
				workoutHistory,
				setWorkoutHistory,
				refreshWorkoutHistory,
				removeWorkoutFromHistory,
			}}
		>
			{children}
		</WorkoutHistoryContext.Provider>
	);
};

export const useWorkoutHistory = () => useContext(WorkoutHistoryContext);
