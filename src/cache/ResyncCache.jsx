import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "WorkoutResync";

export const getWorkoutInResyncCache = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : [];
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const setWorkoutInResyncCache = async (workouts) => {
    try {
        const jsonValue = JSON.stringify(workouts);
        await AsyncStorage.setItem(key, jsonValue);
    }
    catch (e) {
        console.log(e);
    }
}

export const addWorkoutToResyncCache = async (workout) => {
	try {
		const resync = await getWorkoutInResyncCache();
		resync.push(workout);
		await AsyncStorage.setItem(key, JSON.stringify(resync));
	} catch (e) {
		console.log(e);
	}
};

export const resetWorkoutResyncCache = async () => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log(e);
    }
};