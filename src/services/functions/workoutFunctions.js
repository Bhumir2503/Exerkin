// firestore Imports - AKA the cloud database
import {
	fetchNewWorkouts,
	fetchDeletedWorkouts,
	uploadWorkout,
	removeWorkoutFromFirestore,
	markWorkoutAsDeleted,
} from "../firestore/firestoreWorkoutServices";

// Realm Imports - AKA the local database
import {
	getRealmWorkouts,
	setRealmWorkout,
	removeRealmWorkout,
	removeAllRealmWorkout,
	getPendingRealmWorkouts,
	markWorkoutAsSynced,
	mergeWorkoutsToRealm,
	removeWorkoutsFromRealm,
	getLastWorkoutSyncTime,
	updateLastWorkoutSyncTime,
} from "../database/realmWorkoutFunctions";

import firestore from "@react-native-firebase/firestore";

const workoutsCollection = firestore().collection("workouts");
const deletedWorkoutsCollection = firestore().collection("deletedWorkouts");

export const listenToWorkoutChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastWorkoutSyncTime(realm);
	const unsubscribe = workoutsCollection
		.where("userId", "==", userId)
		.where("updatedAt", ">", lastSynced)
		.onSnapshot((snapshot) => {
			if (snapshot.empty) {
				onUpdate();
				return;
			}
			const newWorkouts = snapshot.docs.map((doc) => ({
				...doc.data(),
			}));

			realm.write(() => {
				mergeWorkoutsToRealm(realm, newWorkouts);
				updateLastWorkoutSyncTime(realm);
			});

			// Call the onUpdate function to notify about the update
			onUpdate();
		});
	return unsubscribe;
}

export const listenToDeletedWorkoutChanges = (realm, userId, onUpdate) => {
	const lastSynced = getLastWorkoutSyncTime(realm);
	const effectiveLastSynced = lastSynced.getTime() === new Date(0).getTime() ? new Date() : lastSynced;
	return unsubscribe = deletedWorkoutsCollection.where("userId", "==", userId)
		.where("deletedAt", ">", effectiveLastSynced)
		.onSnapshot((snapshot) => {
			if (snapshot.empty) {
				onUpdate();
				return;
			}

			const deletedWorkouts = snapshot.docs.map((doc) => ({
				...doc.data(),
			}));

			realm.write(() => {
				const idsToDelete = deletedWorkouts.map((d) => d.deletedId);
				removeWorkoutsFromRealm(realm, idsToDelete);
				updateLastWorkoutSyncTime(realm);
			});

			onUpdate();
		});
}


export const syncPendingWorkoutsToFirestore = async (realm, userId) => {
	try {

		const pendingWorkouts = await getPendingRealmWorkouts(realm, userId);

		if (pendingWorkouts.length === 0) return;

		realm.write(() => {
			pendingWorkouts.forEach((workout) => {
				try {
					uploadWorkout({
						...(workout.toJSON?.() ?? { ...workout }),
						updatedAt: firestore.Timestamp.now(),
						uploadedAt: firestore.Timestamp.now(),
					});
					markWorkoutAsSynced(realm, workout.id);
				} catch (error) {
					console.error(
						"(Sync) Upload failed for",
						workout.id,
						error
					);
					workout.syncStatus = "failed";
				}
			});
		});
	} catch (error) {
		console.error("(Sync) Error syncing pending workouts:", error);
	}
};

export const syncWorkoutsFromFirestore = async (realm, userId) => {
	try {
		const lastSynced = getLastWorkoutSyncTime(realm);
        const effectiveLastSynced = lastSynced.getTime() === new Date(0).getTime() ? new Date() : lastSynced;

		const [newWorkouts, deletedWorkouts] = await Promise.all([
			fetchNewWorkouts(userId, lastSynced),

			fetchDeletedWorkouts(userId, effectiveLastSynced),
		]);
		realm.write(() => {
			if (newWorkouts.length > 0)
				mergeWorkoutsToRealm(realm, newWorkouts);
			if (deletedWorkouts.length > 0) {
				const idsToDelete = deletedWorkouts.map((d) => d.deletedId);
				removeWorkoutsFromRealm(realm, idsToDelete);
			}
			updateLastWorkoutSyncTime(realm);
		});

	} catch (error) {
		console.error("(Sync) Error syncing from Firestore:", error);
	}
};

export const getWorkouts = async (realm, userId) => {
    try {
        const workouts = await getRealmWorkouts(realm, userId);
        return workouts;
    } catch (error) {
        console.error("(WorkoutFunctions) - Error getting workouts:", error);
    }
}

export const addWorkout = async (realm, userId, workoutData) => {
	try {
		await uploadWorkout(userId, workoutData);
		await setRealmWorkout(realm, userId, workoutData, "synced");
	} catch (error) {
		console.error("(WorkoutFunctions) - Error adding workout:", error);
		await setRealmWorkout(realm, userId, workoutData, "pending");
	}
};

export const deleteWorkout = async (realm, userId, workoutId) => {
	try {
		await removeWorkoutFromFirestore(workoutId);
		await markWorkoutAsDeleted({ workoutId: workoutId, userId: userId });
		await removeRealmWorkout(realm, userId, workoutId, "deleted");
	} catch (error) {
		console.error("(WorkoutFunctions) - Error deleting workout:", error);
		await removeRealmWorkout(realm, userId, workoutId, "pending");
	}
};
