import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "themekey";

export const getThemeCache = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const setThemeCache = async (value) => {
	try {
        console.log(value);
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const removeThemeCache = async () => {
	try {
		await AsyncStorage.removeItem(key);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};
