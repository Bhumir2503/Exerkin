import AsyncStorage from "@react-native-async-storage/async-storage";

const key = "WorkoutSyncCache";

// schema
// {
//     added: []
//     deleted: []
//     updated: []
//    deleteAdd: []

export const getSyncCache = async () => {
	try {
		const jsonValue = await AsyncStorage.getItem(key);
		return jsonValue != null
			? JSON.parse(jsonValue)
			: { added: [], deleted: [], updated: [], deleteAdd: [] };
	} catch (e) {
		console.log(e);
		return [];
	}
};

export const workoutAddedToSyncCache = async (workout) => {
	try {
		const sync = await getSyncCache();
		sync.updated = sync.updated;
		sync.deleted = sync.deleted;
		sync.deleteAdd = sync.deleteAdd;
		sync.added.push(workout);
		console.log("Sycn", sync);
		await AsyncStorage.setItem(key, JSON.stringify(sync));
	} catch (e) {
		console.log(e);
		//try again
		workoutAddedToSyncCache(workout);
	}
};

export const resetWorkoutResyncCache = async () => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		console.log(e);
	}
};

export const setWorkoutSyncCache = async (workoutSyncObject) => {
	try {
		await AsyncStorage.setItem(key, JSON.stringify(workoutSyncObject));
	} catch (e) {
		console.log(e);
	}
};

export const cacheWorkoutAddition = async (workout) => {
	try {
		const sync = await getSyncCache();
		sync.added.push(workout);
		sync.deleted = sync.deleted;
		sync.updated = sync.updated;
		sync.deleteAdd = sync.deleteAdd;
		setWorkoutSyncCache(sync);
	} catch (e) {
		console.log(e);
	}
};

export const cacheWorkoutUpdate = async (workout) => {
	try {
		const sync = await getSyncCache();

		sync.added = sync.added.filter((w) => w.id !== workout.id);
		sync.updated.push(workout);
		sync.deleted = sync.deleted;
		sync.deleteAdd = sync.deleteAdd;
		setWorkoutSyncCache(sync);
	} catch (e) {
		console.log(e);
	}
};

export const cacheWorkoutDeletion = async (workout) => {
	try {
		const sync = await getSyncCache();
		sync.added = sync.added.filter((w) => w.id !== workout.id);
		sync.updated = sync.updated.filter((w) => w.id !== workout.id);
		sync.deleted.push(workout);
		sync.deleteAdd = sync.deleteAdd;
		setWorkoutSyncCache(sync);
	} catch (e) {
		console.log(e);
	}
};

export const cacheWorkoutDeletionAdd = async (workout) => {
	try {
		const sync = await getSyncCache();
		sync.added = sync.added.filter((w) => w.id !== workout.id);
		sync.updated = sync.updated.filter((w) => w.id !== workout.id);
		sync.deleted = sync.deleted;
		sync.deleteAdd.push(workout);
		setWorkoutSyncCache(sync);
	} catch (e) {
		console.log(e);
	}
};

export const clearWorkoutSyncCache = async () => {
	try {
		await AsyncStorage.removeItem(key);
	} catch (e) {
		console.log(e);
	}
};

export const checkStorageCapacity = async () => {
	const STORAGE_THRESHOLD_MB = 6; // 6 MB threshold
	const BYTES_TO_MB = 1024 * 1024; // Conversion factor: 1 MB = 1,048,576 bytes
	try{
    const keys = await AsyncStorage.getAllKeys();
    const stores = await AsyncStorage.multiGet(keys);
    const totalSizeBytes = stores.reduce((size, [_, value]) => 
      size + (value ? value.length : 0), 0);
    
    // Convert bytes to MB
    const totalSizeMB = totalSizeBytes / BYTES_TO_MB;
    
    return {
      totalSizeBytes,
      totalSizeMB,
      isNearCapacity: totalSizeMB > STORAGE_THRESHOLD_MB,
      keys: keys.length
    };
	} catch (e) {
		console.error("Error checking storage capacity:", e);
		return { isNearCapacity: false, totalSize: 0, keys: 0 };
	}
};
