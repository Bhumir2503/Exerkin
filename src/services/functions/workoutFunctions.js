// firestore Imports - AKA the cloud database
import {
	fetchNewWorkouts,
	fetchDeletedWorkouts,
	uploadWorkout,
	uploadWorkoutUpdate,
	removeWorkoutFromFirestore,
	markWorkoutAsDeleted,
} from "../firestore/firestoreWorkoutServices";

// Realm Imports - AKA the local database
import {
	getRealmWorkouts,
	setRealmWorkout,
	batchSetRealmWorkout,
	removeRealmWorkout,
	removeAllRealmWorkout,
	getPendingRealmWorkouts,
	markWorkoutAsSynced,
	mergeWorkoutsToRealm,
	removeWorkoutsFromRealm,
	getLastWorkoutSyncTime,
	updateLastWorkoutSyncTime,
} from "../database/realmWorkoutFunctions";
import { getRealm } from "../database/realmConfig";


export const syncPendingWorkoutsToFirestore = async (userId) => {
	try {
		const realm = await getRealm();
		const pendingWorkouts = await getPendingRealmWorkouts(userId);

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

		realm.close();
	} catch (error) {
		console.error("(Sync) Error syncing pending workouts:", error);
	}
};

export const syncWorkoutsFromFirestore = async (userId) => {
	try {
		const realm = await getRealm();
		const lastSynced = getLastWorkoutSyncTime(realm);
        const effectiveLastSynced = lastSynced.getTime() === new Date(0).getTime() ? new Date() : lastSynced;

        console.log(lastSynced, effectiveLastSynced);

		const [newWorkouts, deletedWorkouts] = await Promise.all([
			fetchNewWorkouts(userId, lastSynced),

			fetchDeletedWorkouts(userId, effectiveLastSynced),
		]);

		realm.write(() => {
			if (newWorkouts.length > 0)
				mergeWorkoutsToRealm(realm, newWorkouts);
			if (deletedWorkouts.length > 0) {
				const idsToDelete = deletedWorkouts.map((d) => d.id);
				removeWorkoutsFromRealm(realm, idsToDelete);
			}
			updateLastWorkoutSyncTime(realm);
		});

		realm.close();
	} catch (error) {
		console.error("(Sync) Error syncing from Firestore:", error);
	}
};

export const getWorkouts = async (userId) => {
    try {
        const workouts = await getRealmWorkouts(userId);
        return workouts;
    } catch (error) {
        console.error("(WorkoutFunctions) - Error getting workouts:", error);
    }
}

export const addWorkout = async (userId, workoutData) => {
	try {
		await uploadWorkout(userId, workoutData);
		await setRealmWorkout(userId, workoutData, "uploaded");
	} catch (error) {
		console.error("(WorkoutFunctions) - Error adding workout:", error);
		await setRealmWorkout(userId, workoutData, "pending");
	}
};

export const deleteWorkout = async (userId, workoutId) => {
	try {
		await removeWorkoutFromFirestore(workoutId);
		await markWorkoutAsDeleted({ id: workoutId, userId: userId });
		await removeRealmWorkout(userId, workoutId, "deleted");
	} catch (error) {
		console.error("(WorkoutFunctions) - Error deleting workout:", error);
		await removeRealmWorkout(userId, workoutId, "pending");
	}
};
