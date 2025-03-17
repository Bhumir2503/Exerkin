import AsyncStorage from "@react-native-async-storage/async-storage";
import firestore from "@react-native-firebase/firestore";

const key = "workoutTempalte";

export const getWorkoutTemplateCache = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
        console.log(e);
        return [];
    }
}

export const setWorkoutTemplateCache = async (workoutTemplate) => {
    try {
        const jsonValue = JSON.stringify(workoutTemplate);
        await AsyncStorage
            .setItem(key, jsonValue);
    }
    catch (e) {
        console.log(e);
    }
}


export const resetWorkoutTemplateCache = async () => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log(e);
    }
}

export const addWorkoutToTemplateCache = async (workout) => {
    try {
        const workoutTemplate = await getWorkoutTemplateCache();
        // If the template is empty, create a new one
        if (workoutTemplate.length === 0) {
            await setWorkoutTemplateCache([workout]);
            return;
        }
        // If the template is not empty, add the workout to the existing history
        await setWorkoutTemplateCache([...workoutTemplate, workout]);
    } catch (e) {
        console.log(e);
    }
}

