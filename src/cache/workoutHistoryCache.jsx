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
}

export const setWorkoutHistoryCache = async (workoutHistory) => {
    try {
        const jsonValue = JSON.stringify(workoutHistory);
        await AsyncStorage.setItem(key, jsonValue);
    }
    catch (e) {
        console.log(e);
    }
}

export const resetWorkoutHistoryCache = async () => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log(e);
    }
}

export const addWorkoutToHistoryCache = async (workout) => {
    try {
        const workoutHistory = await getWorkoutHistoryCache();
        // If the workoutHistory is empty, create a new one
        if (workoutHistory.length === 0) {
            await setWorkoutHistoryCache({
                date: firestore.Timestamp.now(),
                workout: [workout],
            });
            return;
        }
        // If the workoutHistory is not empty, add the workout to the existing history
        workoutHistory.date = firestore.Timestamp.now();
        workoutHistory.workout.push(workout);
        console.log(workoutHistory);
        await setWorkoutHistoryCache(workoutHistory);
    } catch (e) {
        console.log(e);
    }
}

export const clearWorkoutHistoryCache = async () => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console
    }
}

export const removeWorkoutFromHistoryCache = async (workoutId) => {
    try {
        const workoutHistory = await getWorkoutHistoryCache();
        const newWorkoutHistory = workoutHistory.filter((workout) => workout.id !== workoutId);
        await setWorkoutHistoryCache(newWorkoutHistory);
    } catch (e) {
        console.log(e);
    }
}

