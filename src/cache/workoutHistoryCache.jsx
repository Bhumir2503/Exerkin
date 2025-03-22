import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const key = "workoutHistory";

/*
    WorkoutHistory Schema
    {
        date: timestamp,
        workout: [
            {
                name: string,
                id: string,
                exercises: [],
                completedAt: string
            }
        ]
    }
*/

export const getWorkoutHistoryCache = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : [];
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const setWorkoutHistoryCache = async (workoutHistory) => {
	try {
		const jsonValue = JSON.stringify(workoutHistory);
		await AsyncStorage.setItem(key, jsonValue);
	} catch (e) {
		console.log(e);
	}
};

export const resetWorkoutHistoryCache = async () => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		console.log(e);
	}
};

export const addWorkoutToHistoryCache = async (workout, time) => {
	try {
		const workoutHistory = await getWorkoutHistoryCache();
		// If the workoutHistory is empty, create a new one
		if (workoutHistory.length === 0) {
			await setWorkoutHistoryCache({
				lastSynced: time,
				workouts: [workout],
			});
			return;
		}
		// If the workoutHistory is not empty, add the workout to the existing history
		workoutHistory.lastSynced = workout.completedAt;
		workoutHistory.workouts.push(workout);
		await setWorkoutHistoryCache(workoutHistory);
	} catch (e) {
		console.log(e);
	}
};

export const removeWorkoutFromHistoryCache = async (workoutId, deleteTime) => {
	try {
		const workoutHistory = await getWorkoutHistoryCache();
		const newWorkoutHistory = workoutHistory.workouts.filter(
			(workout) => workout.id !== workoutId
		);
        const updatededHistory = workoutHistory;    
        updatededHistory.lastSynced = deleteTime;
        updatededHistory.workouts = newWorkoutHistory;
		await setWorkoutHistoryCache(updatededHistory);
	} catch (e) {
		console.log(e);
	}
};

export const updateWorkoutInHistoryCache = async (workout) => {
	try {
		const workoutHistory = await getWorkoutHistoryCache();
		const newWorkoutHistory = workoutHistory.workouts.map((w) =>
			w.id === workout.id ? workout : w
		);
		// set the lasySync
		const updatededHistory = workoutHistory;
		updatededHistory.lastSynced = workout.updatedAt;
		updatededHistory.workouts = newWorkoutHistory;
		await setWorkoutHistoryCache(updateWorkoutInHistoryCache);
	} catch (e) {
		console.log(e);
	}
}

export const clearWorkoutHistoryCache = async () => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		console;
	}
};
