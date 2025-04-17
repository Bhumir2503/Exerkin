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
	listenToDeletedWorkoutChanges,
	listenToWorkoutChanges,
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

	useEffect(() => {
		if (!user) return;
		// Subscribe to changes in workout data using Realm
		const unsubscribe = listenToWorkoutChanges(
			realm,
			user.uid,
			async () => {
				const updatedWorkouts = await getWorkouts(realm, user.uid); // Fetch updated workouts from Realm
				setWorkoutHistory(updatedWorkouts); // Update local state with updated workout history
			}
		);

		return () => {
			unsubscribe(); // Unsubscribe from workout data changes
		};
	}, [user, realm]);

	// Effect hook to listen for changes in deleted workout data
	useEffect(() => {
		if (!user) return;

		// Subscribe to changes in deleted workout data using Realm
		const unsubscribe = listenToDeletedWorkoutChanges(
			realm,
			user.uid,
			async () => {
				const updatedWorkouts = await getWorkouts(realm, user.uid); // Fetch updated workouts from Realm
				setWorkoutHistory(updatedWorkouts); // Update local state with updated workout history
			}
		);

		return () => {
			unsubscribe(); // Unsubscribe from deleted workout data changes
		};
	}, [user, realm]);

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
