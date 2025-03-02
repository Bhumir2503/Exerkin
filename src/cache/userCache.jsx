import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "userkey";

export const getUser = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const setUser = async (value) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const removeUser = async () => {
	try {
		await AsyncStorage.removeItem(key);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateUser = async (value) => {
	try {
		const currentUser = (await getUser()) || {};
		const updatedUser = { ...currentUser, ...value };
		await setUser(updatedUser);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateUsername = async (value) => {
	return await updateUser({ username: value });
};

export const updateBio = async (value) => {
	return await updateUser({ bio: value });
};

export const updateHeight = async (value) => {
	return await updateUser({ height: value });
};

export const updateWeight = async (value) => {
	return await updateUser({ weight: value });
};

export const updateAge = async (value) => {
	return await updateUser({ age: value });
};
