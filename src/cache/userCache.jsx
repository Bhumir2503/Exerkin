import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "userkey";

export const getUserCache = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null ? JSON.parse(jsonValue) : null;
	} catch (e) {
		console.log(e);
		return null;
	}
};

export const setUserCache = async (value) => {
	try {
		const jsonValue = JSON.stringify(value);
		await AsyncStorage.setItem(key, jsonValue);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const removeUserCache = async () => {
	try {
		await AsyncStorage.removeItem(key);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateUserCache = async (value) => {
	try {
		const currentUser = (await getUserCache()) || {};
		const updatedUser = { ...currentUser, ...value };
		await setUserCache(updatedUser);
		return true;
	} catch (e) {
		console.log(e);
		return false;
	}
};

export const updateUsernameCache = async (value) => {
	return await updateUserCache({ username: value });
};

export const updateBioCache = async (value) => {
	return await updateUserCache({ bio: value });
};

export const updateHeightCache = async (value) => {
	return await updateUserCache({ height: value });
};

export const updateWeightCache = async (value) => {
	return await updateUserCache({ weight: value });
};

export const updateAgeCache = async (value) => {
	return await updateUserCache({ age: value });
};
