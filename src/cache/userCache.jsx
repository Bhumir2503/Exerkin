// This will store the user info such as username and bio in the cache.
/* 
    The data structure stored in the cache will be:
    {
        "userkey": {
            "username": "username",
            "bio": "bio",
            "height": "height",
            "weight": "weight",
            "age": "age",
        }
    }
*/
import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "userkey";

export const getUser = async () => {
    try {
        const jsonValue = await AsyncStorage.getItem(key);
        return jsonValue != null ? JSON.parse(jsonValue) : null;
    } catch (e) {
        console.log(e);
    }
}

export const setUser = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.setItem(key, jsonValue);
    } catch (e) {
        console.log(e);
    }
}

export const removeUser = async () => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (e) {
        console.log(e);
    }
}

export const updateUser = async (value) => {
    try {
        const jsonValue = JSON.stringify(value);
        await AsyncStorage.mergeItem(key, jsonValue);
    } catch (e) {
        console.log(e);
    }
}

export const updateUsername = async (value) => {
    try {
        await AsyncStorage.mergeItem(key, JSON.stringify({ "username": value }));
    } catch (e) {
        console.log(e);
    }
}

export const updateBio = async (value) => {
    try {
        await AsyncStorage.mergeItem(key, JSON.stringify({ "bio": value }));
    } catch (e) {
        console.log(e);
    }
}

export const updateHeight = async (value) => {
    try {
        await AsyncStorage.mergeItem(key, JSON.stringify({ "height": value }));
    } catch (e) {
        console.log(e);
    }
}

export const updateWeight = async (value) => {
    try {
        await AsyncStorage.mergeItem(key, JSON.stringify({ "weight": value }));
    } catch (e) {
        console.log(e);
    }
}

export const updateAge = async (value) => {
    try {
        await AsyncStorage.mergeItem(key, JSON.stringify({ "age": value }));
    } catch (e) {
        console.log(e);
    }
}



